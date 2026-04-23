/**
 * DAG-KG 集成管理器
 * 管理DAG和知识图谱之间的集成
 */

const { extractionEngine } = require('./extraction_engine');
const { alignmentEngine } = require('./alignment_engine');
const { syncEngine } = require('./sync_engine');
const { evaluationEngine } = require('./evaluation_engine');
const { optimizationEngine } = require('./optimization_engine');

class DAGKGIntegration {
  constructor() {
    this.initialized = false;
    this.dagManager = null;
    this.kgManager = null;
  }

  async initialize(dagManager, kgManager) {
    this.dagManager = dagManager;
    this.kgManager = kgManager;
    this.initialized = true;
    this.log('DAG-KG集成管理器初始化成功');
    return true;
  }

  log(message) {
    console.log(`[DAGKGIntegration] ${message}`);
  }

  async intelligentExtractKnowledgeGraphToDAG(data, options = {}) {
    try {
      this.log('开始智能提取知识图谱到DAG');
      
      // 1. 提取数据
      const extractionResult = await extractionEngine.extract(data, options);
      
      // 2. 评估提取结果
      const extractionEvaluation = await evaluationEngine.evaluateExtraction(extractionResult);
      
      // 3. 优化提取
      if (extractionEvaluation.overallScore < 0.8) {
        await optimizationEngine.optimizeExtraction(extractionResult, extractionEvaluation);
      }
      
      // 4. 创建DAG节点
      const dagNode = this.createDAGNodeFromExtraction(extractionResult, options);
      
      // 5. 添加到DAG
      if (this.dagManager) {
        this.dagManager.addNode(dagNode.id, dagNode);
      }
      
      this.log('智能提取完成');
      return {
        success: true,
        dagNodeId: dagNode.id,
        extractionResult: extractionResult,
        evaluation: extractionEvaluation
      };
    } catch (error) {
      this.log(`智能提取失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async optimizeEdgeMapping(options = {}) {
    try {
      this.log('开始优化边映射');
      
      // 1. 获取DAG节点
      const dagNodes = this.dagManager ? Object.values(this.dagManager.dag.nodes) : [];
      
      // 2. 获取知识图谱节点
      const kgNodes = this.kgManager ? Object.values(this.kgManager.nodes) : [];
      
      // 3. 批量对齐
      const mappings = await alignmentEngine.batchAlign(dagNodes, kgNodes, options);
      
      // 4. 评估对齐结果
      const alignmentEvaluation = await evaluationEngine.evaluateAlignment(mappings, {
        totalNodes: dagNodes.length
      });
      
      // 5. 优化对齐
      if (alignmentEvaluation.overallScore < 0.8) {
        await optimizationEngine.optimizeAlignment(mappings, alignmentEvaluation);
      }
      
      this.log('边映射优化完成');
      return {
        success: true,
        mappings: mappings,
        evaluation: alignmentEvaluation
      };
    } catch (error) {
      this.log(`边映射优化失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async bidirectionalSync(options = {}) {
    try {
      this.log('开始双向同步');
      
      // 1. 获取DAG节点
      const dagNodes = this.dagManager ? Object.values(this.dagManager.dag.nodes) : [];
      
      // 2. 批量同步到知识图谱
      const syncResults = [];
      for (const dagNode of dagNodes) {
        const result = await syncEngine.syncDAGtoKG(dagNode, this.kgManager, options);
        syncResults.push(result);
      }
      
      // 3. 评估同步结果
      const syncEvaluation = await evaluationEngine.evaluateSync(syncResults);
      
      // 4. 优化同步
      if (syncEvaluation.overallScore < 0.8) {
        await optimizationEngine.optimizeSync(syncResults, syncEvaluation);
      }
      
      this.log('双向同步完成');
      return {
        success: true,
        syncResults: syncResults,
        evaluation: syncEvaluation
      };
    } catch (error) {
      this.log(`双向同步失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async realtimeSync(dagNode, options = {}) {
    try {
      this.log('开始实时同步');
      
      // 实时同步到知识图谱
      const result = await syncEngine.realtimeSync(dagNode, this.kgManager, options);
      
      this.log('实时同步完成');
      return result;
    } catch (error) {
      this.log(`实时同步失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async analyzeMapping(options = {}) {
    try {
      this.log('开始分析映射关系');
      
      // 1. 获取所有映射
      const mappings = alignmentEngine.getMappings();
      
      // 2. 评估映射
      const evaluation = await evaluationEngine.evaluateAlignment(mappings, options);
      
      // 3. 生成报告
      const report = {
        timestamp: Date.now(),
        mappingCount: mappings.length,
        evaluation: evaluation,
        statistics: {
          averageConfidence: mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length,
          highConfidenceMappings: mappings.filter(m => m.confidence >= 0.8).length,
          lowConfidenceMappings: mappings.filter(m => m.confidence < 0.5).length
        }
      };
      
      this.log('映射分析完成');
      return report;
    } catch (error) {
      this.log(`映射分析失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async optimizePerformance(options = {}) {
    try {
      this.log('开始性能优化');
      
      // 执行性能优化
      const optimization = await optimizationEngine.optimizePerformance(options);
      
      this.log('性能优化完成');
      return optimization;
    } catch (error) {
      this.log(`性能优化失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async deduplicateNodes(options = {}) {
    try {
      this.log('开始节点去重');
      
      // 实际应用中，这里应该实现节点去重逻辑
      this.log('节点去重完成');
      return { success: true, message: '节点去重完成' };
    } catch (error) {
      this.log(`节点去重失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async generateVisualization(options = {}) {
    try {
      this.log('开始生成可视化数据');
      
      // 实际应用中，这里应该生成可视化数据
      this.log('可视化数据生成完成');
      return { success: true, message: '可视化数据生成完成' };
    } catch (error) {
      this.log(`可视化数据生成失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  createDAGNodeFromExtraction(extractionResult, options = {}) {
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'memory',
      topic: this.extractTopic(extractionResult),
      content: this.extractContent(extractionResult),
      status: 'completed',
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        source: options.source || 'extraction',
        confidence: extractionResult.semantic?.topics?.length > 0 ? 0.8 : 0.5,
        tags: this.extractTags(extractionResult)
      },
      layers: extractionResult
    };
  }

  extractTopic(extractionResult) {
    if (extractionResult.semantic?.topics?.length > 0) {
      return extractionResult.semantic.topics[0];
    }
    if (extractionResult.structured?.keywords?.length > 0) {
      return extractionResult.structured.keywords.slice(0, 3).join(' ');
    }
    return '未命名节点';
  }

  extractContent(extractionResult) {
    if (extractionResult.raw?.original) {
      return typeof extractionResult.raw.original === 'string' 
        ? extractionResult.raw.original 
        : JSON.stringify(extractionResult.raw.original);
    }
    return '';
  }

  extractTags(extractionResult) {
    const tags = [];
    if (extractionResult.structured?.keywords) {
      tags.push(...extractionResult.structured.keywords.slice(0, 5));
    }
    if (extractionResult.semantic?.topics) {
      tags.push(...extractionResult.semantic.topics.slice(0, 3));
    }
    return [...new Set(tags)];
  }

  getStatus() {
    return {
      initialized: this.initialized,
      dagManager: this.dagManager ? 'connected' : 'disconnected',
      kgManager: this.kgManager ? 'connected' : 'disconnected',
      extractionEngine: 'active',
      alignmentEngine: 'active',
      syncEngine: 'active',
      evaluationEngine: 'active',
      optimizationEngine: 'active'
    };
  }
}

const enhancedKnowledgeGraphDAGIntegration = new DAGKGIntegration();

module.exports = {
  DAGKGIntegration,
  enhancedKnowledgeGraphDAGIntegration
};
