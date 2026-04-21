/**
 * DAG查询技能
 */

const { dagManager } = require('../dag_manager');

async function dagQuerySkill(action, params) {
  /**
   * 执行DAG查询
   * @param {string} action - 操作类型
   * @param {Object} params - 查询参数
   * @returns {string} 查询结果
   */
  try {
    console.log('执行DAG查询: ' + action + '，参数:', params);
    
    switch (action) {
      case 'query_nodes':
        return await queryNodes(params);
      case 'query_edges':
        return await queryEdges(params);
      case 'dfs':
        return await dfs(params);
      case 'bfs':
        return await bfs(params);
      case 'find_paths':
        return await findPaths(params);
      case 'analyze':
        return await analyzeDAG(params);
      default:
        return '未知的DAG操作: ' + action;
    }
  } catch (error) {
    console.error('DAG查询失败: ' + error.message);
    return 'DAG查询失败: ' + error.message;
  }
}

async function queryNodes(params) {
  const { query = {} } = params;
  const nodes = dagManager.queryNodes(query);
  return '找到 ' + nodes.length + ' 个节点: ' + JSON.stringify(nodes, null, 2);
}

async function queryEdges(params) {
  const { query = {} } = params;
  const edges = dagManager.queryEdges(query);
  return '找到 ' + edges.length + ' 条边: ' + JSON.stringify(edges, null, 2);
}

async function dfs(params) {
  const { startNode } = params;
  if (!startNode) {
    return '请提供起始节点ID';
  }
  const nodes = dagManager.dfs(startNode);
  return 'DFS结果: ' + JSON.stringify(nodes, null, 2);
}

async function bfs(params) {
  const { startNode } = params;
  if (!startNode) {
    return '请提供起始节点ID';
  }
  const nodes = dagManager.bfs(startNode);
  return 'BFS结果: ' + JSON.stringify(nodes, null, 2);
}

async function findPaths(params) {
  const { source, target, maxDepth = 10 } = params;
  if (!source || !target) {
    return '请提供源节点和目标节点';
  }
  const paths = dagManager.findPaths(source, target, maxDepth);
  return '找到 ' + paths.length + ' 条路径: ' + JSON.stringify(paths, null, 2);
}

async function analyzeDAG(params) {
  const analysis = dagManager.analyzeDAG();
  return 'DAG分析结果: ' + JSON.stringify(analysis, null, 2);
}

module.exports = {
  dagQuerySkill
};
