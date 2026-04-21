const { v4: uuidv4 } = require('uuid');
const os = require('os');

/**
 * LRU 缓存实现
 */
class LRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.order = [];
  }

  /**
   * 获取缓存
   * @param {string} key 键
   * @returns {*} 值
   */
  get(key) {
    if (this.cache.has(key)) {
      // 更新访问顺序
      const index = this.order.indexOf(key);
      if (index > -1) {
        this.order.splice(index, 1);
      }
      this.order.push(key);
      return this.cache.get(key);
    }
    return null;
  }

  /**
   * 设置缓存
   * @param {string} key 键
   * @param {*} value 值
   */
  set(key, value) {
    if (this.cache.has(key)) {
      // 更新访问顺序
      const index = this.order.indexOf(key);
      if (index > -1) {
        this.order.splice(index, 1);
      }
    } else if (this.cache.size >= this.maxSize) {
      // 移除最久未使用的项
      const oldestKey = this.order.shift();
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, value);
    this.order.push(key);
  }

  /**
   * 删除缓存
   * @param {string} key 键
   */
  delete(key) {
    if (this.cache.has(key)) {
      const index = this.order.indexOf(key);
      if (index > -1) {
        this.order.splice(index, 1);
      }
      this.cache.delete(key);
    }
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
    this.order = [];
  }

  /**
   * 获取缓存大小
   * @returns {number} 大小
   */
  size() {
    return this.cache.size;
  }
}

/**
 * 多级缓存
 */
class MultiLevelCache {
  constructor(config = {}) {
    this.l1Cache = new LRUCache(config.l1Size || 1000);  // 内存缓存
    this.l2Cache = new LRUCache(config.l2Size || 10000); // 二级缓存
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * 获取缓存
   * @param {string} key 键
   * @returns {*} 值
   */
  get(key) {
    // 先从 L1 缓存获取
    let result = this.l1Cache.get(key);
    if (result) {
      this.hitCount++;
      return result;
    }

    // 再从 L2 缓存获取
    result = this.l2Cache.get(key);
    if (result) {
      this.hitCount++;
      // 提升到 L1 缓存
      this.l1Cache.set(key, result);
      return result;
    }

    this.missCount++;
    return null;
  }

  /**
   * 设置缓存
   * @param {string} key 键
   * @param {*} value 值
   */
  set(key, value) {
    this.l1Cache.set(key, value);
    this.l2Cache.set(key, value);
  }

  /**
   * 删除缓存
   * @param {string} key 键
   */
  delete(key) {
    this.l1Cache.delete(key);
    this.l2Cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear() {
    this.l1Cache.clear();
    this.l2Cache.clear();
  }

  /**
   * 获取命中率
   * @returns {number} 命中率
   */
  getHitRate() {
    const total = this.hitCount + this.missCount;
    return total > 0 ? this.hitCount / total : 0;
  }

  /**
   * 获取缓存统计
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: this.getHitRate(),
      l1Size: this.l1Cache.size(),
      l2Size: this.l2Cache.size()
    };
  }
}

/**
 * 并行推理器
 */
class ParallelReasoner {
  constructor(config = {}) {
    this.numWorkers = config.numWorkers || os.cpus().length;
    this.maxBatchSize = config.maxBatchSize || 100;
    this.workers = [];
    this.taskQueue = [];
    this.running = false;
  }

  /**
   * 初始化
   */
  init() {
    // 这里使用简单的并行实现，实际应该使用 Worker 线程
    console.log(`初始化并行推理器，使用 ${this.numWorkers} 个工作线程`);
  }

  /**
   * 并行执行推理
   * @param {Array} queries 查询列表
   * @param {Function}推理函数
   * @returns {Promise<Array>} 推理结果
   */
  async reason(queries, reasonFunction) {
    if (queries.length === 0) return [];

    // 分割批次
    const batches = this._createBatches(queries, this.maxBatchSize);
    
    // 并行执行
    const results = await Promise.all(
      batches.map(batch => this._processBatch(batch, reasonFunction))
    );

    return results.flat();
  }

  /**
   * 创建批次
   * @param {Array} items 项目列表
   * @param {number} batchSize 批次大小
   * @returns {Array} 批次列表
   * @private
   */
  _createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * 处理批次
   * @param {Array} batch 批次
   * @param {Function} reasonFunction 推理函数
   * @returns {Promise<Array>} 处理结果
   * @private
   */
  async _processBatch(batch, reasonFunction) {
    const results = [];
    for (const item of batch) {
      try {
        const result = await reasonFunction(item);
        results.push(result);
      } catch (error) {
        console.error('处理批次项失败:', error.message);
        results.push({ error: error.message });
      }
    }
    return results;
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.taskQueue = [];
    console.log('并行推理器资源清理完成');
  }
}

/**
 * 图索引
 */
class GraphIndex {
  constructor() {
    this.entityIndex = new Map();      // 实体索引
    this.relationIndex = new Map();   // 关系索引
    this.adjacencyIndex = new Map();  // 邻接表索引
    this.reverseAdjacencyIndex = new Map(); // 反向邻接表索引
    this.typeIndex = new Map();       // 类型索引
    this.communityIndex = new Map();  // 社区索引
  }

  /**
   * 构建索引
   * @param {Object} graph 知识图谱
   */
  buildIndexes(graph) {
    console.log('开始构建图索引...');

    // 构建实体索引
    for (const node of graph.nodes) {
      this.entityIndex.set(node.id, node);
      
      // 构建类型索引
      if (!this.typeIndex.has(node.type)) {
        this.typeIndex.set(node.type, []);
      }
      this.typeIndex.get(node.type).push(node.id);
    }

    // 构建关系索引
    for (const edge of graph.edges) {
      if (!this.relationIndex.has(edge.label)) {
        this.relationIndex.set(edge.label, []);
      }
      this.relationIndex.get(edge.label).push(edge);

      // 构建邻接表索引
      if (!this.adjacencyIndex.has(edge.source)) {
        this.adjacencyIndex.set(edge.source, []);
      }
      this.adjacencyIndex.get(edge.source).push({
        target: edge.target,
        relation: edge.label,
        weight: edge.confidence || 1
      });

      // 构建反向邻接表索引
      if (!this.reverseAdjacencyIndex.has(edge.target)) {
        this.reverseAdjacencyIndex.set(edge.target, []);
      }
      this.reverseAdjacencyIndex.get(edge.target).push({
        source: edge.source,
        relation: edge.label,
        weight: edge.confidence || 1
      });
    }

    // 构建社区索引（简化版）
    this._buildCommunityIndex(graph);

    console.log(`索引构建完成，实体数: ${this.entityIndex.size}, 关系数: ${this.relationIndex.size}`);
  }

  /**
   * 构建社区索引
   * @param {Object} graph 知识图谱
   * @private
   */
  _buildCommunityIndex(graph) {
    // 简化的社区检测
    const visited = new Set();
    let communityId = 0;

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        const community = this._dfsCommunity(node.id, visited);
        for (const nodeId of community) {
          this.communityIndex.set(nodeId, communityId);
        }
        communityId++;
      }
    }
  }

  /**
   * DFS 社区检测
   * @param {string} nodeId 节点ID
   * @param {Set} visited 访问集合
   * @returns {Array} 社区节点
   * @private
   */
  _dfsCommunity(nodeId, visited) {
    const community = [];
    const stack = [nodeId];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!visited.has(current)) {
        visited.add(current);
        community.push(current);

        // 添加邻居
        const neighbors = this.adjacencyIndex.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.target)) {
            stack.push(neighbor.target);
          }
        }
      }
    }

    return community;
  }

  /**
   * 查询索引
   * @param {string} type 索引类型
   * @param {string} value 值
   * @returns {*} 查询结果
   */
  query(type, value) {
    switch (type) {
      case 'entity':
        return this.entityIndex.get(value);
      case 'relation':
        return this.relationIndex.get(value);
      case 'neighbors':
        return this.adjacencyIndex.get(value) || [];
      case 'reverse_neighbors':
        return this.reverseAdjacencyIndex.get(value) || [];
      case 'type':
        return this.typeIndex.get(value) || [];
      case 'community':
        return this.communityIndex.get(value);
      default:
        return null;
    }
  }

  /**
   * 获取实体
   * @param {string} entityId 实体ID
   * @returns {Object} 实体
   */
  getEntity(entityId) {
    return this.entityIndex.get(entityId);
  }

  /**
   * 获取关系
   * @param {string} relationName 关系名称
   * @returns {Array} 关系列表
   */
  getRelations(relationName) {
    return this.relationIndex.get(relationName) || [];
  }

  /**
   * 获取邻居
   * @param {string} nodeId 节点ID
   * @returns {Array} 邻居列表
   */
  getNeighbors(nodeId) {
    return this.adjacencyIndex.get(nodeId) || [];
  }

  /**
   * 获取反向邻居
   * @param {string} nodeId 节点ID
   * @returns {Array} 反向邻居列表
   */
  getReverseNeighbors(nodeId) {
    return this.reverseAdjacencyIndex.get(nodeId) || [];
  }

  /**
   * 获取同类型实体
   * @param {string} type 类型
   * @returns {Array} 实体列表
   */
  getEntitiesByType(type) {
    return this.typeIndex.get(type) || [];
  }

  /**
   * 获取社区
   * @param {string} nodeId 节点ID
   * @returns {number} 社区ID
   */
  getCommunity(nodeId) {
    return this.communityIndex.get(nodeId);
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.entityIndex.clear();
    this.relationIndex.clear();
    this.adjacencyIndex.clear();
    this.reverseAdjacencyIndex.clear();
    this.typeIndex.clear();
    this.communityIndex.clear();
  }
}

/**
 * 性能优化管理器
 */
class PerformanceOptimizer {
  constructor(config = {}) {
    this.cache = new MultiLevelCache(config.cache || {});
    this.parallelReasoner = new ParallelReasoner(config.parallel || {});
    this.graphIndex = new GraphIndex();
    this.enabled = config.enabled || true;
  }

  /**
   * 初始化
   */
  init() {
    if (this.enabled) {
      this.parallelReasoner.init();
      console.log('性能优化管理器初始化完成');
    }
  }

  /**
   * 构建图索引
   * @param {Object} graph 知识图谱
   */
  buildGraphIndex(graph) {
    if (this.enabled) {
      this.graphIndex.buildIndexes(graph);
    }
  }

  /**
   * 缓存包装器
   * @param {Function} fn 函数
   * @param {string} cacheKey 缓存键
   * @returns {Function} 包装后的函数
   */
  cached(fn, cacheKey) {
    if (!this.enabled) {
      return fn;
    }

    return async (...args) => {
      const key = `${cacheKey}:${JSON.stringify(args)}`;
      const cachedResult = this.cache.get(key);
      
      if (cachedResult) {
        return cachedResult;
      }

      const result = await fn(...args);
      this.cache.set(key, result);
      return result;
    };
  }

  /**
   * 并行执行
   * @param {Array} tasks 任务列表
   * @param {Function} taskFn 任务函数
   * @returns {Promise<Array>} 执行结果
   */
  async parallel(tasks, taskFn) {
    if (!this.enabled || tasks.length <= 1) {
      return Promise.all(tasks.map(taskFn));
    }

    return this.parallelReasoner.reason(tasks, taskFn);
  }

  /**
   * 获取图索引
   * @returns {GraphIndex} 图索引
   */
  getGraphIndex() {
    return this.graphIndex;
  }

  /**
   * 获取缓存
   * @returns {MultiLevelCache} 缓存
   */
  getCache() {
    return this.cache;
  }

  /**
   * 获取性能统计
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      cache: this.cache.getStats(),
      index: {
        entities: this.graphIndex.entityIndex.size,
        relations: this.graphIndex.relationIndex.size,
        communities: new Set([...this.graphIndex.communityIndex.values()]).size
      }
    };
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.cache.clear();
    this.parallelReasoner.cleanup();
    this.graphIndex.cleanup();
    console.log('性能优化管理器资源清理完成');
  }
}

/**
 * 性能优化管理器
 */
class PerformanceOptimizerManager {
  constructor() {
    this.optimizers = new Map();
  }

  /**
   * 创建性能优化器
   * @param {Object} config 配置
   * @returns {Object} 优化器
   */
  createOptimizer(config = {}) {
    const optimizer = new PerformanceOptimizer(config);
    const id = uuidv4();
    this.optimizers.set(id, optimizer);
    return { id, optimizer };
  }

  /**
   * 获取性能优化器
   * @param {string} id 优化器ID
   * @returns {PerformanceOptimizer} 优化器
   */
  getOptimizer(id) {
    return this.optimizers.get(id);
  }

  /**
   * 删除性能优化器
   * @param {string} id 优化器ID
   */
  deleteOptimizer(id) {
    const optimizer = this.optimizers.get(id);
    if (optimizer) {
      optimizer.cleanup();
    }
    this.optimizers.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    for (const optimizer of this.optimizers.values()) {
      optimizer.cleanup();
    }
    this.optimizers.clear();
  }
}

const performanceOptimizerManager = new PerformanceOptimizerManager();

module.exports = {
  LRUCache,
  MultiLevelCache,
  ParallelReasoner,
  GraphIndex,
  PerformanceOptimizer,
  PerformanceOptimizerManager,
  performanceOptimizerManager
};
