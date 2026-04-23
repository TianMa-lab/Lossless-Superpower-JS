/**
 * DAG-KG API 接口
 * 提供DAG-KG自动提取和对齐系统的API接口
 */

const express = require('express');
const router = express.Router();
const { enhancedKnowledgeGraphDAGIntegration } = require('../dag_kg_integration');
const { extractionEngine } = require('../extraction_engine');
const { alignmentEngine } = require('../alignment_engine');
const { syncEngine } = require('../sync_engine');
const { evaluationEngine } = require('../evaluation_engine');
const { optimizationEngine } = require('../optimization_engine');

// 初始化API
router.post('/initialize', async (req, res) => {
  try {
    const { dagManager, kgManager } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.initialize(dagManager, kgManager);
    res.json({ success: result, message: 'API初始化成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 智能提取
router.post('/extract', async (req, res) => {
  try {
    const { data, options } = req.body;
    const result = await extractionEngine.extract(data, options);
    res.json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 智能提取知识图谱到DAG
router.post('/extract-to-dag', async (req, res) => {
  try {
    const { data, options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG(data, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 优化边映射
router.post('/optimize-edge-mapping', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 双向同步
router.post('/bidirectional-sync', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 实时同步
router.post('/realtime-sync', async (req, res) => {
  try {
    const { dagNode, options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.realtimeSync(dagNode, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分析映射
router.post('/analyze-mapping', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.analyzeMapping(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 性能优化
router.post('/optimize-performance', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.optimizePerformance(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 节点去重
router.post('/deduplicate-nodes', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.deduplicateNodes(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成可视化
router.post('/generate-visualization', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await enhancedKnowledgeGraphDAGIntegration.generateVisualization(options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取系统状态
router.get('/status', async (req, res) => {
  try {
    const status = enhancedKnowledgeGraphDAGIntegration.getStatus();
    res.json({ success: true, status: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 评估提取
router.post('/evaluate-extraction', async (req, res) => {
  try {
    const { extractionResult, options } = req.body;
    const result = await evaluationEngine.evaluateExtraction(extractionResult, options);
    res.json({ success: true, evaluation: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 评估对齐
router.post('/evaluate-alignment', async (req, res) => {
  try {
    const { mappings, options } = req.body;
    const result = await evaluationEngine.evaluateAlignment(mappings, options);
    res.json({ success: true, evaluation: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 评估同步
router.post('/evaluate-sync', async (req, res) => {
  try {
    const { syncResults, options } = req.body;
    const result = await evaluationEngine.evaluateSync(syncResults, options);
    res.json({ success: true, evaluation: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 优化提取
router.post('/optimize-extraction', async (req, res) => {
  try {
    const { extractionResult, evaluation, options } = req.body;
    const result = await optimizationEngine.optimizeExtraction(extractionResult, evaluation, options);
    res.json({ success: true, optimization: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 优化对齐
router.post('/optimize-alignment', async (req, res) => {
  try {
    const { mappings, evaluation, options } = req.body;
    const result = await optimizationEngine.optimizeAlignment(mappings, evaluation, options);
    res.json({ success: true, optimization: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 优化同步
router.post('/optimize-sync', async (req, res) => {
  try {
    const { syncResults, evaluation, options } = req.body;
    const result = await optimizationEngine.optimizeSync(syncResults, evaluation, options);
    res.json({ success: true, optimization: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
