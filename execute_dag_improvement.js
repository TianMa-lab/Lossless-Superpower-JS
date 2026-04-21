/**
 * 执行DAG系统改进计划
 */

const { TaskRunner } = require('./src/superpowers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('=== 执行DAG系统改进计划 ===\n');

  // 第一阶段：完善DAG查询功能
  await TaskRunner.runTaskWithSteps(
    'dag_improvement_phase1',
    '第一阶段：完善DAG查询功能',
    '实现实际的DAG查询逻辑，支持复杂查询操作',
    [
      {
        name: '检查DAG目录结构',
        description: '检查当前DAG系统的目录结构和文件',
        execute: async () => {
          console.log('检查DAG目录结构...');
          const dagDir = path.join(__dirname, 'src', 'superpowers', 'storage', 'memory-dag');
          if (fs.existsSync(dagDir)) {
            const files = fs.readdirSync(dagDir);
            console.log('DAG目录文件:', files);
          } else {
            console.log('DAG目录不存在，创建目录...');
            fs.mkdirSync(dagDir, { recursive: true });
          }
        }
      },
      {
        name: '创建DAG管理模块',
        description: '创建DAG管理模块，实现DAG的基本操作',
        execute: async () => {
          console.log('创建DAG管理模块...');
          const dagManagerFile = path.join(__dirname, 'src', 'superpowers', 'dag_manager.js');
          
          const content = "const fs = require('fs');\nconst path = require('path');\n\nclass DAGManager {\n  constructor() {\n    this.dagDir = path.join(__dirname, 'storage', 'memory-dag');\n    this.dagIndexFile = path.join(this.dagDir, 'dag-index.json');\n    this.ensureDirs();\n    this.loadDAG();\n  }\n\n  ensureDirs() {\n    if (!fs.existsSync(this.dagDir)) {\n      fs.mkdirSync(this.dagDir, { recursive: true });\n    }\n  }\n\n  loadDAG() {\n    if (fs.existsSync(this.dagIndexFile)) {\n      try {\n        const data = fs.readFileSync(this.dagIndexFile, 'utf-8');\n        this.dag = JSON.parse(data);\n      } catch (error) {\n        console.error('加载DAG失败:', error.message);\n        this.dag = { nodes: {}, edges: [] };\n      }\n    } else {\n      this.dag = { nodes: {}, edges: [] };\n    }\n  }\n\n  saveDAG() {\n    try {\n      fs.writeFileSync(this.dagIndexFile, JSON.stringify(this.dag, null, 2), 'utf-8');\n      return true;\n    } catch (error) {\n      console.error('保存DAG失败:', error.message);\n      return false;\n    }\n  }\n\n  // 添加节点\n  addNode(nodeId, nodeData) {\n    this.dag.nodes[nodeId] = {\n      ...nodeData,\n      id: nodeId,\n      createdAt: Date.now()\n    };\n    return this.saveDAG();\n  }\n\n  // 添加边\n  addEdge(source, target, edgeData = {}) {\n    const edgeId = 'edge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);\n    this.dag.edges.push({\n      id: edgeId,\n      source,\n      target,\n      ...edgeData,\n      createdAt: Date.now()\n    });\n    return this.saveDAG();\n  }\n\n  // 查询节点\n  queryNodes(query = {}) {\n    const results = [];\n    for (const [nodeId, node] of Object.entries(this.dag.nodes)) {\n      let match = true;\n      for (const [key, value] of Object.entries(query)) {\n        if (node[key] !== value) {\n          match = false;\n          break;\n        }\n      }\n      if (match) {\n        results.push(node);\n      }\n    }\n    return results;\n  }\n\n  // 查询边\n  queryEdges(query = {}) {\n    return this.dag.edges.filter(edge => {\n      for (const [key, value] of Object.entries(query)) {\n        if (edge[key] !== value) {\n          return false;\n        }\n      }\n      return true;\n    });\n  }\n\n  // 深度优先搜索\n  dfs(startNodeId, visited = new Set()) {\n    const result = [];\n    const stack = [startNodeId];\n    \n    while (stack.length > 0) {\n      const nodeId = stack.pop();\n      if (!visited.has(nodeId) && this.dag.nodes[nodeId]) {\n        visited.add(nodeId);\n        result.push(this.dag.nodes[nodeId]);\n        \n        // 找到所有从该节点出发的边\n        const outgoingEdges = this.dag.edges.filter(edge => edge.source === nodeId);\n        for (const edge of outgoingEdges) {\n          stack.push(edge.target);\n        }\n      }\n    }\n    \n    return result;\n  }\n\n  // 广度优先搜索\n  bfs(startNodeId) {\n    const result = [];\n    const queue = [startNodeId];\n    const visited = new Set();\n    \n    while (queue.length > 0) {\n      const nodeId = queue.shift();\n      if (!visited.has(nodeId) && this.dag.nodes[nodeId]) {\n        visited.add(nodeId);\n        result.push(this.dag.nodes[nodeId]);\n        \n        // 找到所有从该节点出发的边\n        const outgoingEdges = this.dag.edges.filter(edge => edge.source === nodeId);\n        for (const edge of outgoingEdges) {\n          queue.push(edge.target);\n        }\n      }\n    }\n    \n    return result;\n  }\n\n  // 查找路径\n  findPaths(source, target, maxDepth = 10) {\n    const paths = [];\n    const currentPath = [source];\n    \n    const dfs = (currentNode, depth) => {\n      if (depth > maxDepth) return;\n      if (currentNode === target) {\n        paths.push([...currentPath]);\n        return;\n      }\n      \n      const outgoingEdges = this.dag.edges.filter(edge => edge.source === currentNode);\n      for (const edge of outgoingEdges) {\n        if (!currentPath.includes(edge.target)) {\n          currentPath.push(edge.target);\n          dfs(edge.target, depth + 1);\n          currentPath.pop();\n        }\n      }\n    };\n    \n    dfs(source, 0);\n    return paths;\n  }\n\n  // 分析DAG\n  analyzeDAG() {\n    const analysis = {\n      nodeCount: Object.keys(this.dag.nodes).length,\n      edgeCount: this.dag.edges.length,\n      connectedComponents: [],\n      longestPath: []\n    };\n    \n    // 计算连通分量\n    const visited = new Set();\n    for (const nodeId of Object.keys(this.dag.nodes)) {\n      if (!visited.has(nodeId)) {\n        const component = this.dfs(nodeId, visited);\n        analysis.connectedComponents.push(component);\n      }\n    }\n    \n    // 计算最长路径（简化版）\n    let maxLength = 0;\n    for (const nodeId of Object.keys(this.dag.nodes)) {\n      const paths = this.findPaths(nodeId, null, 10);\n      for (const path of paths) {\n        if (path.length > maxLength) {\n          maxLength = path.length;\n          analysis.longestPath = path;\n        }\n      }\n    }\n    \n    return analysis;\n  }\n\n  // 导出DAG\n  exportDAG() {\n    return this.dag;\n  }\n\n  // 导入DAG\n  importDAG(dagData) {\n    this.dag = dagData;\n    return this.saveDAG();\n  }\n}\n\nconst dagManager = new DAGManager();\n\nmodule.exports = {\n  DAGManager,\n  dagManager\n};\n";
          
          fs.writeFileSync(dagManagerFile, content, 'utf-8');
          console.log('DAG管理模块创建完成');
        }
      },
      {
        name: '更新DAG查询技能',
        description: '更新DAG查询技能，实现实际的查询功能',
        execute: async () => {
          console.log('更新DAG查询技能...');
          const dagQueryFile = path.join(__dirname, 'src', 'superpowers', 'skills', 'dag_query.js');
          
          const content = "/**\n * DAG查询技能\n */\n\nconst { dagManager } = require('../dag_manager');\n\nasync function dagQuerySkill(action, params) {\n  /**\n   * 执行DAG查询\n   * @param {string} action - 操作类型\n   * @param {Object} params - 查询参数\n   * @returns {string} 查询结果\n   */\n  try {\n    console.log('执行DAG查询: ' + action + '，参数:', params);\n    \n    switch (action) {\n      case 'query_nodes':\n        return await queryNodes(params);\n      case 'query_edges':\n        return await queryEdges(params);\n      case 'dfs':\n        return await dfs(params);\n      case 'bfs':\n        return await bfs(params);\n      case 'find_paths':\n        return await findPaths(params);\n      case 'analyze':\n        return await analyzeDAG(params);\n      default:\n        return '未知的DAG操作: ' + action;\n    }\n  } catch (error) {\n    console.error('DAG查询失败: ' + error.message);\n    return 'DAG查询失败: ' + error.message;\n  }\n}\n\nasync function queryNodes(params) {\n  const { query = {} } = params;\n  const nodes = dagManager.queryNodes(query);\n  return '找到 ' + nodes.length + ' 个节点: ' + JSON.stringify(nodes, null, 2);\n}\n\nasync function queryEdges(params) {\n  const { query = {} } = params;\n  const edges = dagManager.queryEdges(query);\n  return '找到 ' + edges.length + ' 条边: ' + JSON.stringify(edges, null, 2);\n}\n\nasync function dfs(params) {\n  const { startNode } = params;\n  if (!startNode) {\n    return '请提供起始节点ID';\n  }\n  const nodes = dagManager.dfs(startNode);\n  return 'DFS结果: ' + JSON.stringify(nodes, null, 2);\n}\n\nasync function bfs(params) {\n  const { startNode } = params;\n  if (!startNode) {\n    return '请提供起始节点ID';\n  }\n  const nodes = dagManager.bfs(startNode);\n  return 'BFS结果: ' + JSON.stringify(nodes, null, 2);\n}\n\nasync function findPaths(params) {\n  const { source, target, maxDepth = 10 } = params;\n  if (!source || !target) {\n    return '请提供源节点和目标节点';\n  }\n  const paths = dagManager.findPaths(source, target, maxDepth);\n  return '找到 ' + paths.length + ' 条路径: ' + JSON.stringify(paths, null, 2);\n}\n\nasync function analyzeDAG(params) {\n  const analysis = dagManager.analyzeDAG();\n  return 'DAG分析结果: ' + JSON.stringify(analysis, null, 2);\n}\n\nmodule.exports = {\n  dagQuerySkill\n};\n";
          
          fs.writeFileSync(dagQueryFile, content, 'utf-8');
          console.log('DAG查询技能更新完成');
        }
      },
      {
        name: '在superpowers/index.js中添加DAG管理器',
        description: '在superpowers/index.js中添加DAG管理器的导入和导出',
        execute: async () => {
          console.log('在superpowers/index.js中添加DAG管理器...');
          const indexFile = path.join(__dirname, 'src', 'superpowers', 'index.js');
          
          let content = fs.readFileSync(indexFile, 'utf-8');
          
          // 添加导入
          if (!content.includes('const { dagManager } = require')) {
            content = content.replace('// 导入自主学习系统\nconst { autonomousLearningSystem } = require(\'./autonomous_learning\');', '// 导入自主学习系统\nconst { autonomousLearningSystem } = require(\'./autonomous_learning\');\n\n// 导入DAG管理器\nconst { dagManager } = require(\'./dag_manager\');');
          }
          
          // 添加导出
          if (!content.includes('dagManager')) {
            content = content.replace('  autonomousLearningSystem\n};', '  autonomousLearningSystem,\n  dagManager\n};');
          }
          
          fs.writeFileSync(indexFile, content, 'utf-8');
          console.log('DAG管理器添加到superpowers/index.js完成');
        }
      },
      {
        name: '测试DAG查询功能',
        description: '测试完善后的DAG查询功能',
        execute: async () => {
          console.log('测试DAG查询功能...');
          const { dagManager } = require('./src/superpowers');
          
          // 添加测试节点
          dagManager.addNode('test_node_1', { type: 'test', topic: '测试1', status: 'active' });
          dagManager.addNode('test_node_2', { type: 'test', topic: '测试2', status: 'active' });
          dagManager.addNode('test_node_3', { type: 'test', topic: '测试3', status: 'inactive' });
          
          // 添加测试边
          dagManager.addEdge('test_node_1', 'test_node_2', { type: 'related' });
          dagManager.addEdge('test_node_2', 'test_node_3', { type: 'depends_on' });
          
          // 测试查询
          console.log('测试查询节点:');
          const activeNodes = dagManager.queryNodes({ status: 'active' });
          console.log('活跃节点:', activeNodes);
          
          console.log('\n测试DFS:');
          const dfsResult = dagManager.dfs('test_node_1');
          console.log('DFS结果:', dfsResult);
          
          console.log('\n测试BFS:');
          const bfsResult = dagManager.bfs('test_node_1');
          console.log('BFS结果:', bfsResult);
          
          console.log('\n测试路径查找:');
          const paths = dagManager.findPaths('test_node_1', 'test_node_3');
          console.log('路径:', paths);
          
          console.log('\n测试DAG分析:');
          const analysis = dagManager.analyzeDAG();
          console.log('分析结果:', analysis);
          
          console.log('DAG查询功能测试完成');
        }
      }
    ],
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'dag,improvement,phase1',
      memoryMetadata: { phase: 1, objective: '完善DAG查询功能' }
    }
  );

  console.log('\n=== DAG系统改进计划第一阶段完成 ===');
  console.log('已成功完善DAG查询功能，实现了实际的DAG查询逻辑，支持复杂查询操作');
}

main().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
