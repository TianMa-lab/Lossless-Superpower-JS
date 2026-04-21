const { dagManager } = require('./dag_manager');
const { autonomousLearningSystem } = require('./autonomous_learning');

class KnowledgeGraphDAGIntegration {
  constructor() {
    this.dagManager = dagManager;
    this.autonomousLearningSystem = autonomousLearningSystem;
  }

  // 初始化集成
  async init() {
    try {
      // 初始化自主学习系统
      const alInitialized = await this.autonomousLearningSystem.init();
      if (!alInitialized) {
        console.error('自主学习系统初始化失败');
        return false;
      }
      
      console.log('知识图谱与DAG集成初始化成功');
      return true;
    } catch (error) {
      console.error('知识图谱与DAG集成初始化失败:', error.message);
      return false;
    }
  }

  // 将知识图谱节点转换为DAG节点
  async convertKnowledgeGraphToDAG() {
    try {
      console.log('将知识图谱转换为DAG...');
      
      // 构建知识图谱
      const graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      if (!graph) {
        console.error('知识图谱构建失败');
        return false;
      }
      
      // 转换节点
      for (const node of graph.nodes) {
        const nodeId = 'kg_node_' + node.id.replace(/\s+/g, '_').toLowerCase();
        await this.dagManager.addNode(nodeId, {
          type: 'knowledge',
          label: node.label,
          originalId: node.id,
          nodeType: node.type,
          status: 'active'
        });
      }
      
      // 转换边
      for (const edge of graph.edges) {
        const sourceNodeId = 'kg_node_' + edge.source.replace(/\s+/g, '_').toLowerCase();
        const targetNodeId = 'kg_node_' + edge.target.replace(/\s+/g, '_').toLowerCase();
        await this.dagManager.addEdge(sourceNodeId, targetNodeId, {
          type: 'knowledge_relation',
          label: edge.label,
          confidence: edge.confidence,
          originalId: edge.id
        });
      }
      
      console.log('成功将知识图谱转换为DAG，包含 ' + graph.nodes.length + ' 个节点和 ' + graph.edges.length + ' 条边');
      return true;
    } catch (error) {
      console.error('将知识图谱转换为DAG失败:', error.message);
      return false;
    }
  }

  // 将DAG节点转换为知识图谱
  async convertDAGToKnowledgeGraph() {
    try {
      console.log('将DAG转换为知识图谱...');
      
      // 获取DAG中的知识节点
      const knowledgeNodes = this.dagManager.queryNodes({ type: 'knowledge' });
      const knowledgeEdges = this.dagManager.queryEdges({ type: 'knowledge_relation' });
      
      console.log('DAG中包含 ' + knowledgeNodes.length + ' 个知识节点和 ' + knowledgeEdges.length + ' 条知识边');
      
      // 这里可以实现将DAG节点转换回知识图谱的逻辑
      // 由于知识图谱已经有自己的存储机制，这里主要是建立映射关系
      
      return true;
    } catch (error) {
      console.error('将DAG转换为知识图谱失败:', error.message);
      return false;
    }
  }

  // 通过DAG查询知识图谱
  async queryKnowledgeThroughDAG(query) {
    try {
      console.log('通过DAG查询知识图谱:', query);
      
      // 转换查询条件
      const dagQuery = {};
      if (query.type) {
        dagQuery.type = query.type;
      }
      if (query.status) {
        dagQuery.status = query.status;
      }
      
      // 查询DAG
      const nodes = this.dagManager.queryNodes(dagQuery);
      
      // 转换结果
      const knowledgeResults = nodes.map(node => ({
        id: node.originalId || node.id,
        label: node.label,
        type: node.nodeType,
        properties: node
      }));
      
      console.log('通过DAG查询到 ' + knowledgeResults.length + ' 条知识');
      return knowledgeResults;
    } catch (error) {
      console.error('通过DAG查询知识图谱失败:', error.message);
      return [];
    }
  }

  // 同步知识图谱和DAG
  async syncKnowledgeGraphAndDAG() {
    try {
      console.log('同步知识图谱和DAG...');
      
      // 先将知识图谱转换为DAG
      await this.convertKnowledgeGraphToDAG();
      
      // 然后将DAG转换为知识图谱（如果需要）
      await this.convertDAGToKnowledgeGraph();
      
      console.log('知识图谱和DAG同步完成');
      return true;
    } catch (error) {
      console.error('同步知识图谱和DAG失败:', error.message);
      return false;
    }
  }

  // 分析知识图谱与DAG的映射关系
  async analyzeMapping() {
    try {
      console.log('分析知识图谱与DAG的映射关系...');
      
      // 构建知识图谱
      const graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      if (!graph) {
        console.error('知识图谱构建失败');
        return null;
      }
      
      // 查询DAG中的知识节点
      const knowledgeNodes = this.dagManager.queryNodes({ type: 'knowledge' });
      const knowledgeEdges = this.dagManager.queryEdges({ type: 'knowledge_relation' });
      
      const analysis = {
        knowledgeGraph: {
          nodes: graph.nodes.length,
          edges: graph.edges.length
        },
        dag: {
          knowledgeNodes: knowledgeNodes.length,
          knowledgeEdges: knowledgeEdges.length
        },
        mappingRatio: {
          nodes: knowledgeNodes.length / graph.nodes.length,
          edges: knowledgeEdges.length / graph.edges.length
        }
      };
      
      console.log('映射关系分析结果:', analysis);
      return analysis;
    } catch (error) {
      console.error('分析映射关系失败:', error.message);
      return null;
    }
  }
}

const knowledgeGraphDAGIntegration = new KnowledgeGraphDAGIntegration();

module.exports = {
  KnowledgeGraphDAGIntegration,
  knowledgeGraphDAGIntegration
};
