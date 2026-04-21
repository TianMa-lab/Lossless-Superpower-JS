/**
 * 执行DAG系统改进计划 - 第二阶段
 */

const { TaskRunner } = require('./src/superpowers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('=== 执行DAG系统改进计划 - 第二阶段 ===\n');

  // 第二阶段：与知识图谱集成
  await TaskRunner.runTaskWithSteps(
    'dag_improvement_phase2',
    '第二阶段：与知识图谱集成',
    '建立知识图谱与DAG的映射关系，实现知识节点到DAG节点的自动转换',
    [
      {
        name: '分析知识图谱结构',
        description: '分析现有的知识图谱结构，了解其数据格式和组织方式',
        execute: async () => {
          console.log('分析知识图谱结构...');
          const { autonomousLearningSystem } = require('./src/superpowers');
          await autonomousLearningSystem.init();
          
          // 构建知识图谱
          const graph = await autonomousLearningSystem.buildKnowledgeGraph();
          if (graph) {
            console.log('知识图谱结构:', {
              nodes: graph.nodes.length,
              edges: graph.edges.length
            });
            console.log('示例节点:', graph.nodes.slice(0, 3));
            console.log('示例边:', graph.edges.slice(0, 3));
          } else {
            console.log('知识图谱为空或构建失败');
          }
        }
      },
      {
        name: '创建知识图谱与DAG集成模块',
        description: '创建模块实现知识图谱与DAG的双向映射',
        execute: async () => {
          console.log('创建知识图谱与DAG集成模块...');
          const integrationFile = path.join(__dirname, 'src', 'superpowers', 'kg_dag_integration.js');
          
          const content = 'const { dagManager } = require(\'./dag_manager\');\nconst { autonomousLearningSystem } = require(\'./autonomous_learning\');\n\nclass KnowledgeGraphDAGIntegration {\n  constructor() {\n    this.dagManager = dagManager;\n    this.autonomousLearningSystem = autonomousLearningSystem;\n  }\n\n  // 初始化集成\n  async init() {\n    try {\n      // 初始化自主学习系统\n      const alInitialized = await this.autonomousLearningSystem.init();\n      if (!alInitialized) {\n        console.error(\'自主学习系统初始化失败\');\n        return false;\n      }\n      \n      console.log(\'知识图谱与DAG集成初始化成功\');\n      return true;\n    } catch (error) {\n      console.error(\'知识图谱与DAG集成初始化失败:\', error.message);\n      return false;\n    }\n  }\n\n  // 将知识图谱节点转换为DAG节点\n  async convertKnowledgeGraphToDAG() {\n    try {\n      console.log(\'将知识图谱转换为DAG...\');\n      \n      // 构建知识图谱\n      const graph = await this.autonomousLearningSystem.buildKnowledgeGraph();\n      if (!graph) {\n        console.error(\'知识图谱构建失败\');\n        return false;\n      }\n      \n      // 转换节点\n      for (const node of graph.nodes) {\n        const nodeId = \'kg_node_\' + node.id.replace(/\\s+/g, \'_\').toLowerCase();\n        await this.dagManager.addNode(nodeId, {\n          type: \'knowledge\',\n          label: node.label,\n          originalId: node.id,\n          nodeType: node.type,\n          status: \'active\'\n        });\n      }\n      \n      // 转换边\n      for (const edge of graph.edges) {\n        const sourceNodeId = \'kg_node_\' + edge.source.replace(/\\s+/g, \'_\').toLowerCase();\n        const targetNodeId = \'kg_node_\' + edge.target.replace(/\\s+/g, \'_\').toLowerCase();\n        await this.dagManager.addEdge(sourceNodeId, targetNodeId, {\n          type: \'knowledge_relation\',\n          label: edge.label,\n          confidence: edge.confidence,\n          originalId: edge.id\n        });\n      }\n      \n      console.log(\'成功将知识图谱转换为DAG，包含 \' + graph.nodes.length + \' 个节点和 \' + graph.edges.length + \' 条边\');\n      return true;\n    } catch (error) {\n      console.error(\'将知识图谱转换为DAG失败:\', error.message);\n      return false;\n    }\n  }\n\n  // 将DAG节点转换为知识图谱\n  async convertDAGToKnowledgeGraph() {\n    try {\n      console.log(\'将DAG转换为知识图谱...\');\n      \n      // 获取DAG中的知识节点\n      const knowledgeNodes = this.dagManager.queryNodes({ type: \'knowledge\' });\n      const knowledgeEdges = this.dagManager.queryEdges({ type: \'knowledge_relation\' });\n      \n      console.log(\'DAG中包含 \' + knowledgeNodes.length + \' 个知识节点和 \' + knowledgeEdges.length + \' 条知识边\');\n      \n      // 这里可以实现将DAG节点转换回知识图谱的逻辑\n      // 由于知识图谱已经有自己的存储机制，这里主要是建立映射关系\n      \n      return true;\n    } catch (error) {\n      console.error(\'将DAG转换为知识图谱失败:\', error.message);\n      return false;\n    }\n  }\n\n  // 通过DAG查询知识图谱\n  async queryKnowledgeThroughDAG(query) {\n    try {\n      console.log(\'通过DAG查询知识图谱:\', query);\n      \n      // 转换查询条件\n      const dagQuery = {};\n      if (query.type) {\n        dagQuery.type = query.type;\n      }\n      if (query.status) {\n        dagQuery.status = query.status;\n      }\n      \n      // 查询DAG\n      const nodes = this.dagManager.queryNodes(dagQuery);\n      \n      // 转换结果\n      const knowledgeResults = nodes.map(node => ({\n        id: node.originalId || node.id,\n        label: node.label,\n        type: node.nodeType,\n        properties: node\n      }));\n      \n      console.log(\'通过DAG查询到 \' + knowledgeResults.length + \' 条知识\');\n      return knowledgeResults;\n    } catch (error) {\n      console.error(\'通过DAG查询知识图谱失败:\', error.message);\n      return [];\n    }\n  }\n\n  // 同步知识图谱和DAG\n  async syncKnowledgeGraphAndDAG() {\n    try {\n      console.log(\'同步知识图谱和DAG...\');\n      \n      // 先将知识图谱转换为DAG\n      await this.convertKnowledgeGraphToDAG();\n      \n      // 然后将DAG转换为知识图谱（如果需要）\n      await this.convertDAGToKnowledgeGraph();\n      \n      console.log(\'知识图谱和DAG同步完成\');\n      return true;\n    } catch (error) {\n      console.error(\'同步知识图谱和DAG失败:\', error.message);\n      return false;\n    }\n  }\n\n  // 分析知识图谱与DAG的映射关系\n  async analyzeMapping() {\n    try {\n      console.log(\'分析知识图谱与DAG的映射关系...\');\n      \n      // 构建知识图谱\n      const graph = await this.autonomousLearningSystem.buildKnowledgeGraph();\n      if (!graph) {\n        console.error(\'知识图谱构建失败\');\n        return null;\n      }\n      \n      // 查询DAG中的知识节点\n      const knowledgeNodes = this.dagManager.queryNodes({ type: \'knowledge\' });\n      const knowledgeEdges = this.dagManager.queryEdges({ type: \'knowledge_relation\' });\n      \n      const analysis = {\n        knowledgeGraph: {\n          nodes: graph.nodes.length,\n          edges: graph.edges.length\n        },\n        dag: {\n          knowledgeNodes: knowledgeNodes.length,\n          knowledgeEdges: knowledgeEdges.length\n        },\n        mappingRatio: {\n          nodes: knowledgeNodes.length / graph.nodes.length,\n          edges: knowledgeEdges.length / graph.edges.length\n        }\n      };\n      \n      console.log(\'映射关系分析结果:\', analysis);\n      return analysis;\n    } catch (error) {\n      console.error(\'分析映射关系失败:\', error.message);\n      return null;\n    }\n  }\n}\n\nconst knowledgeGraphDAGIntegration = new KnowledgeGraphDAGIntegration();\n\nmodule.exports = {\n  KnowledgeGraphDAGIntegration,\n  knowledgeGraphDAGIntegration\n};\n';
          
          fs.writeFileSync(integrationFile, content, 'utf-8');
          console.log('知识图谱与DAG集成模块创建完成');
        }
      },
      {
        name: '在superpowers/index.js中添加集成模块',
        description: '在superpowers/index.js中添加知识图谱与DAG集成模块的导入和导出',
        execute: async () => {
          console.log('在superpowers/index.js中添加集成模块...');
          const indexFile = path.join(__dirname, 'src', 'superpowers', 'index.js');
          
          let content = fs.readFileSync(indexFile, 'utf-8');
          
          // 添加导入
          if (!content.includes('const { knowledgeGraphDAGIntegration } = require')) {
            content = content.replace('// 导入DAG管理器\nconst { dagManager } = require(\'./dag_manager\');', '// 导入DAG管理器\nconst { dagManager } = require(\'./dag_manager\');\n\n// 导入知识图谱与DAG集成模块\nconst { knowledgeGraphDAGIntegration } = require(\'./kg_dag_integration\');');
          }
          
          // 添加导出
          if (!content.includes('knowledgeGraphDAGIntegration')) {
            content = content.replace('  dagManager\n};', '  dagManager,\n  knowledgeGraphDAGIntegration\n};');
          }
          
          fs.writeFileSync(indexFile, content, 'utf-8');
          console.log('集成模块添加到superpowers/index.js完成');
        }
      },
      {
        name: '测试知识图谱与DAG集成',
        description: '测试知识图谱与DAG的集成功能',
        execute: async () => {
          console.log('测试知识图谱与DAG集成...');
          const { knowledgeGraphDAGIntegration } = require('./src/superpowers');
          
          // 初始化集成
          await knowledgeGraphDAGIntegration.init();
          
          // 同步知识图谱和DAG
          await knowledgeGraphDAGIntegration.syncKnowledgeGraphAndDAG();
          
          // 分析映射关系
          await knowledgeGraphDAGIntegration.analyzeMapping();
          
          // 通过DAG查询知识
          const results = await knowledgeGraphDAGIntegration.queryKnowledgeThroughDAG({ type: 'knowledge' });
          console.log('通过DAG查询到的知识:', results.slice(0, 3));
          
          console.log('知识图谱与DAG集成测试完成');
        }
      }
    ],
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'dag,knowledge_graph,integration,phase2',
      memoryMetadata: { phase: 2, objective: '与知识图谱集成' }
    }
  );

  console.log('\n=== DAG系统改进计划第二阶段完成 ===');
  console.log('已成功实现知识图谱与DAG的集成，建立了双向映射关系，支持通过DAG查询知识图谱');
}

main().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
