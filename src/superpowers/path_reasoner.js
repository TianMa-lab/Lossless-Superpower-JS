const { v4: uuidv4 } = require('uuid');

/**
 * 优先队列实现
 */
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * 添加元素
   * @param {*} element 元素
   * @param {number} priority 优先级
   */
  add(element, priority) {
    this.heap.push({ element, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * 弹出优先级最高的元素
   * @returns {*} 元素
   */
  poll() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop().element;

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return top.element;
  }

  /**
   * 检查队列是否为空
   * @returns {boolean} 是否为空
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * 上浮操作
   * @param {number} index 索引
   * @private
   */
  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  /**
   * 下沉操作
   * @param {number} index 索引
   * @private
   */
  _sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let smallestIndex = index;

      if (leftChildIndex < length && this.heap[leftChildIndex].priority < this.heap[smallestIndex].priority) {
        smallestIndex = leftChildIndex;
      }
      if (rightChildIndex < length && this.heap[rightChildIndex].priority < this.heap[smallestIndex].priority) {
        smallestIndex = rightChildIndex;
      }
      if (smallestIndex === index) break;
      [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
      index = smallestIndex;
    }
  }
}

/**
 * 路径推理优化模块
 */
class PathReasoner {
  constructor(graph, config = {}) {
    this.graph = graph;
    this.maxDepth = config.maxDepth || 10;
    this.pathLimit = config.pathLimit || 100;
    this.timeout = config.timeout || 30000; // 30秒超时
  }

  /**
   * 设置图
   * @param {Object} graph 知识图谱
   */
  setGraph(graph) {
    this.graph = graph;
  }

  /**
   * 寻找路径
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {Object} options 选项
   * @returns {Array} 路径列表
   */
  async findPaths(source, target, options = {}) {
    const algorithm = options.algorithm || 'AStar';
    const maxDepth = options.maxDepth || this.maxDepth;
    const pathLimit = options.pathLimit || this.pathLimit;

    switch (algorithm) {
      case 'DFS':
        return this._dfsPath(source, target, maxDepth, pathLimit);
      case 'BFS':
        return this._bfsPath(source, target, maxDepth, pathLimit);
      case 'AStar':
        return this._aStarPath(source, target, maxDepth, pathLimit, options.heuristic);
      case 'IDAStar':
        return this._idaStarPath(source, target, maxDepth, pathLimit, options.heuristic);
      case 'PRA':
        return this._praPath(source, target, maxDepth, pathLimit);
      default:
        throw new Error(`不支持的路径搜索算法: ${algorithm}`);
    }
  }

  /**
   * DFS 路径搜索
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {number} maxDepth 最大深度
   * @param {number} pathLimit 路径限制
   * @returns {Array} 路径列表
   * @private
   */
  _dfsPath(source, target, maxDepth, pathLimit) {
    const paths = [];
    const visited = new Set();
    const startTime = Date.now();

    const dfs = (current, path, depth) => {
      if (Date.now() - startTime > this.timeout) return;
      if (paths.length >= pathLimit) return;
      if (depth > maxDepth) return;

      visited.add(current);
      path.push(current);

      if (current === target) {
        paths.push([...path]);
      } else {
        const neighbors = this._getNeighbors(current);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.node)) {
            dfs(neighbor.node, path, depth + 1);
          }
        }
      }

      path.pop();
      visited.delete(current);
    };

    dfs(source, [], 0);
    return paths;
  }

  /**
   * BFS 路径搜索
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {number} maxDepth 最大深度
   * @param {number} pathLimit 路径限制
   * @returns {Array} 路径列表
   * @private
   */
  _bfsPath(source, target, maxDepth, pathLimit) {
    const paths = [];
    const queue = [[source]];
    const visited = new Set([source]);
    const startTime = Date.now();

    while (queue.length > 0 && paths.length < pathLimit && Date.now() - startTime < this.timeout) {
      const currentPath = queue.shift();
      const currentNode = currentPath[currentPath.length - 1];

      if (currentPath.length > maxDepth) continue;

      if (currentNode === target) {
        paths.push([...currentPath]);
        continue;
      }

      const neighbors = this._getNeighbors(currentNode);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push([...currentPath, neighbor.node]);
        }
      }
    }

    return paths;
  }

  /**
   * A* 路径搜索
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {number} maxDepth 最大深度
   * @param {number} pathLimit 路径限制
   * @param {Function} heuristic 启发函数
   * @returns {Array} 路径列表
   * @private
   */
  _aStarPath(source, target, maxDepth, pathLimit, heuristic = null) {
    const paths = [];
    const openSet = new PriorityQueue();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    const startTime = Date.now();

    // 默认启发函数：使用节点ID的字符串相似度
    const defaultHeuristic = (node1, node2) => {
      return this._stringDistance(node1, node2);
    };

    const h = heuristic || defaultHeuristic;

    gScore.set(source, 0);
    fScore.set(source, h(source, target));
    openSet.add({ node: source, path: [source] }, fScore.get(source));

    while (!openSet.isEmpty() && paths.length < pathLimit && Date.now() - startTime < this.timeout) {
      const current = openSet.poll();
      const currentNode = current.node;
      const currentPath = current.path;

      if (currentPath.length > maxDepth) continue;

      if (currentNode === target) {
        paths.push([...currentPath]);
        continue;
      }

      const neighbors = this._getNeighbors(currentNode);
      for (const neighbor of neighbors) {
        const tentativeGScore = gScore.get(currentNode) + (neighbor.weight || 1);
        const neighborNode = neighbor.node;

        if (!gScore.has(neighborNode) || tentativeGScore < gScore.get(neighborNode)) {
          cameFrom.set(neighborNode, currentNode);
          gScore.set(neighborNode, tentativeGScore);
          fScore.set(neighborNode, tentativeGScore + h(neighborNode, target));
          openSet.add({ node: neighborNode, path: [...currentPath, neighborNode] }, fScore.get(neighborNode));
        }
      }
    }

    return paths;
  }

  /**
   * IDA* 路径搜索
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {number} maxDepth 最大深度
   * @param {number} pathLimit 路径限制
   * @param {Function} heuristic 启发函数
   * @returns {Array} 路径列表
   * @private
   */
  _idaStarPath(source, target, maxDepth, pathLimit, heuristic = null) {
    const paths = [];
    const startTime = Date.now();

    // 默认启发函数
    const defaultHeuristic = (node1, node2) => {
      return this._stringDistance(node1, node2);
    };

    const h = heuristic || defaultHeuristic;

    let threshold = h(source, target);

    while (threshold <= maxDepth && paths.length < pathLimit && Date.now() - startTime < this.timeout) {
      const visited = new Set();
      const path = [source];
      const result = this._idaStarSearch(source, target, path, visited, 0, threshold, h, paths, pathLimit, startTime);
      if (result === 'FOUND') break;
      if (result === Infinity) break;
      threshold = result;
    }

    return paths;
  }

  /**
   * IDA* 搜索实现
   * @param {string} current 当前节点
   * @param {string} target 目标节点
   * @param {Array} path 当前路径
   * @param {Set} visited 访问过的节点
   * @param {number} g 当前路径代价
   * @param {number} threshold 阈值
   * @param {Function} h 启发函数
   * @param {Array} paths 路径列表
   * @param {number} pathLimit 路径限制
   * @param {number} startTime 开始时间
   * @returns {number|string} 新的阈值或 'FOUND'
   * @private
   */
  _idaStarSearch(current, target, path, visited, g, threshold, h, paths, pathLimit, startTime) {
    if (Date.now() - startTime > this.timeout) return Infinity;
    if (paths.length >= pathLimit) return Infinity;

    const f = g + h(current, target);
    if (f > threshold) return f;

    if (current === target) {
      paths.push([...path]);
      return 'FOUND';
    }

    let min = Infinity;
    visited.add(current);

    const neighbors = this._getNeighbors(current);
    for (const neighbor of neighbors) {
      const neighborNode = neighbor.node;
      if (!visited.has(neighborNode)) {
        path.push(neighborNode);
        const result = this._idaStarSearch(neighborNode, target, path, visited, g + (neighbor.weight || 1), threshold, h, paths, pathLimit, startTime);
        if (result === 'FOUND') return 'FOUND';
        if (result < min) min = result;
        path.pop();
      }
    }

    visited.delete(current);
    return min;
  }

  /**
   * PRA (Path Ranking Algorithm) 路径搜索
   * @param {string} source 源节点
   * @param {string} target 目标节点
   * @param {number} maxDepth 最大深度
   * @param {number} pathLimit 路径限制
   * @returns {Array} 路径列表
   * @private
   */
  _praPath(source, target, maxDepth, pathLimit) {
    const paths = [];
    const pathFeatures = new Map();
    const randomWalks = this._randomWalks(source, maxDepth, 1000); // 1000次随机游走
    const startTime = Date.now();

    // 收集路径特征
    for (const walk of randomWalks) {
      if (Date.now() - startTime > this.timeout) break;
      if (walk[walk.length - 1] === target) {
        const pathStr = walk.join('->');
        const count = pathFeatures.get(pathStr) || 0;
        pathFeatures.set(pathStr, count + 1);
      }
    }

    // 按频率排序路径
    const sortedPaths = Array.from(pathFeatures.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, pathLimit)
      .map(([pathStr, count]) => {
        return {
          path: pathStr.split('->'),
          score: count
        };
      });

    // 转换为路径格式
    for (const sortedPath of sortedPaths) {
      paths.push(sortedPath.path);
    }

    return paths;
  }

  /**
   * 随机游走
   * @param {string} start 起始节点
   * @param {number} maxLength 最大长度
   * @param {number} numWalks 游走次数
   * @returns {Array} 游走路径
   * @private
   */
  _randomWalks(start, maxLength, numWalks) {
    const walks = [];

    for (let i = 0; i < numWalks; i++) {
      const walk = [start];
      let current = start;

      for (let j = 1; j < maxLength; j++) {
        const neighbors = this._getNeighbors(current);
        if (neighbors.length === 0) break;

        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        current = randomNeighbor.node;
        walk.push(current);
      }

      walks.push(walk);
    }

    return walks;
  }

  /**
   * 获取节点的邻居
   * @param {string} nodeId 节点ID
   * @returns {Array} 邻居列表
   * @private
   */
  _getNeighbors(nodeId) {
    if (!this.graph || !this.graph.edges) return [];

    const neighbors = [];
    for (const edge of this.graph.edges) {
      if (edge.source === nodeId) {
        neighbors.push({
          node: edge.target,
          relation: edge.label,
          weight: edge.confidence || 1
        });
      }
    }

    return neighbors;
  }

  /**
   * 字符串距离
   * @param {string} str1 字符串1
   * @param {string} str2 字符串2
   * @returns {number} 距离
   * @private
   */
  _stringDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * 路径排序
   * @param {Array} paths 路径列表
   * @param {Object} options 选项
   * @returns {Array} 排序后的路径
   */
  rankPaths(paths, options = {}) {
    const rankingStrategy = options.strategy || 'length';

    switch (rankingStrategy) {
      case 'length':
        return paths.sort((a, b) => a.length - b.length);
      case 'weight':
        return paths.sort((a, b) => this._calculatePathWeight(a) - this._calculatePathWeight(b));
      case 'diversity':
        return this._rankByDiversity(paths);
      default:
        return paths;
    }
  }

  /**
   * 计算路径权重
   * @param {Array} path 路径
   * @returns {number} 权重
   * @private
   */
  _calculatePathWeight(path) {
    let weight = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.graph.edges.find(e => e.source === path[i] && e.target === path[i + 1]);
      weight += edge ? (edge.confidence || 1) : 1;
    }
    return weight;
  }

  /**
   * 按多样性排序
   * @param {Array} paths 路径列表
   * @returns {Array} 排序后的路径
   * @private
   */
  _rankByDiversity(paths) {
    // 简单的多样性排序：优先选择不同的中间节点
    const diversityScores = new Map();

    for (const path of paths) {
      const uniqueNodes = new Set(path);
      diversityScores.set(path, uniqueNodes.size);
    }

    return paths.sort((a, b) => {
      const scoreA = diversityScores.get(a);
      const scoreB = diversityScores.get(b);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return a.length - b.length;
    });
  }

  /**
   * 多跳推理
   * @param {string} entity 实体
   * @param {string} relation 关系
   * @param {number} hops 跳数
   * @returns {Array} 推理结果
   */
  async multiHopReasoning(entity, relation, hops = 2) {
    const results = [];
    const visited = new Set([entity]);

    const hop = async (current, path, depth) => {
      if (depth >= hops) return;

      const neighbors = this._getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          const newPath = [...path, { node: neighbor.node, relation: neighbor.relation }];
          results.push({
            path: newPath,
            depth: depth + 1
          });
          await hop(neighbor.node, newPath, depth + 1);
        }
      }
    };

    await hop(entity, [{ node: entity }], 0);
    return results;
  }
}

/**
 * 路径推理管理器
 */
class PathReasonerManager {
  constructor() {
    this.reasoners = new Map();
  }

  /**
   * 创建路径推理器
   * @param {Object} graph 知识图谱
   * @param {Object} config 配置
   * @returns {Object} 推理器
   */
  createReasoner(graph, config = {}) {
    const reasoner = new PathReasoner(graph, config);
    const id = uuidv4();
    this.reasoners.set(id, reasoner);
    return { id, reasoner };
  }

  /**
   * 获取路径推理器
   * @param {string} id 推理器ID
   * @returns {PathReasoner} 推理器
   */
  getReasoner(id) {
    return this.reasoners.get(id);
  }

  /**
   * 删除路径推理器
   * @param {string} id 推理器ID
   */
  deleteReasoner(id) {
    this.reasoners.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.reasoners.clear();
  }
}

const pathReasonerManager = new PathReasonerManager();

module.exports = {
  PathReasoner,
  PathReasonerManager,
  pathReasonerManager,
  PriorityQueue
};
