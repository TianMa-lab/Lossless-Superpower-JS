const fs = require('fs');
const path = require('path');

class DAGManager {
  constructor() {
    this.dagDir = path.join(__dirname, 'storage', 'memory-dag');
    this.dagIndexFile = path.join(this.dagDir, 'dag-index.json');
    this.ensureDirs();
    this.loadDAG();
  }

  ensureDirs() {
    if (!fs.existsSync(this.dagDir)) {
      fs.mkdirSync(this.dagDir, { recursive: true });
    }
  }

  loadDAG() {
    if (fs.existsSync(this.dagIndexFile)) {
      try {
        const data = fs.readFileSync(this.dagIndexFile, 'utf-8');
        this.dag = JSON.parse(data);
      } catch (error) {
        console.error('加载DAG失败:', error.message);
        this.dag = { nodes: {}, edges: [] };
      }
    } else {
      this.dag = { nodes: {}, edges: [] };
    }
  }

  saveDAG() {
    try {
      fs.writeFileSync(this.dagIndexFile, JSON.stringify(this.dag, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存DAG失败:', error.message);
      return false;
    }
  }

  // 添加节点
  addNode(nodeId, nodeData) {
    this.dag.nodes[nodeId] = {
      ...nodeData,
      id: nodeId,
      createdAt: Date.now()
    };
    return this.saveDAG();
  }

  // 添加边
  addEdge(source, target, edgeData = {}) {
    const edgeId = 'edge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    this.dag.edges.push({
      id: edgeId,
      source,
      target,
      ...edgeData,
      createdAt: Date.now()
    });
    return this.saveDAG();
  }

  // 查询节点
  queryNodes(query = {}) {
    const results = [];
    for (const [nodeId, node] of Object.entries(this.dag.nodes)) {
      let match = true;
      for (const [key, value] of Object.entries(query)) {
        if (node[key] !== value) {
          match = false;
          break;
        }
      }
      if (match) {
        results.push(node);
      }
    }
    return results;
  }

  // 查询边
  queryEdges(query = {}) {
    return this.dag.edges.filter(edge => {
      for (const [key, value] of Object.entries(query)) {
        if (edge[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  // 深度优先搜索
  dfs(startNodeId, visited = new Set()) {
    const result = [];
    const stack = [startNodeId];
    
    while (stack.length > 0) {
      const nodeId = stack.pop();
      if (!visited.has(nodeId) && this.dag.nodes[nodeId]) {
        visited.add(nodeId);
        result.push(this.dag.nodes[nodeId]);
        
        // 找到所有从该节点出发的边
        const outgoingEdges = this.dag.edges.filter(edge => edge.source === nodeId);
        for (const edge of outgoingEdges) {
          stack.push(edge.target);
        }
      }
    }
    
    return result;
  }

  // 广度优先搜索
  bfs(startNodeId) {
    const result = [];
    const queue = [startNodeId];
    const visited = new Set();
    
    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!visited.has(nodeId) && this.dag.nodes[nodeId]) {
        visited.add(nodeId);
        result.push(this.dag.nodes[nodeId]);
        
        // 找到所有从该节点出发的边
        const outgoingEdges = this.dag.edges.filter(edge => edge.source === nodeId);
        for (const edge of outgoingEdges) {
          queue.push(edge.target);
        }
      }
    }
    
    return result;
  }

  // 查找路径
  findPaths(source, target, maxDepth = 10) {
    const paths = [];
    const currentPath = [source];
    
    const dfs = (currentNode, depth) => {
      if (depth > maxDepth) return;
      if (currentNode === target) {
        paths.push([...currentPath]);
        return;
      }
      
      const outgoingEdges = this.dag.edges.filter(edge => edge.source === currentNode);
      for (const edge of outgoingEdges) {
        if (!currentPath.includes(edge.target)) {
          currentPath.push(edge.target);
          dfs(edge.target, depth + 1);
          currentPath.pop();
        }
      }
    };
    
    dfs(source, 0);
    return paths;
  }

  // 分析DAG
  analyzeDAG() {
    const analysis = {
      nodeCount: Object.keys(this.dag.nodes).length,
      edgeCount: this.dag.edges.length,
      connectedComponents: [],
      longestPath: []
    };
    
    // 计算连通分量
    const visited = new Set();
    for (const nodeId of Object.keys(this.dag.nodes)) {
      if (!visited.has(nodeId)) {
        const component = this.dfs(nodeId, visited);
        analysis.connectedComponents.push(component);
      }
    }
    
    // 计算最长路径（简化版）
    let maxLength = 0;
    for (const nodeId of Object.keys(this.dag.nodes)) {
      const paths = this.findPaths(nodeId, null, 10);
      for (const path of paths) {
        if (path.length > maxLength) {
          maxLength = path.length;
          analysis.longestPath = path;
        }
      }
    }
    
    return analysis;
  }

  // 导出DAG
  exportDAG() {
    return this.dag;
  }

  // 导入DAG
  importDAG(dagData) {
    this.dag = dagData;
    return this.saveDAG();
  }
}

const dagManager = new DAGManager();

module.exports = {
  DAGManager,
  dagManager
};
