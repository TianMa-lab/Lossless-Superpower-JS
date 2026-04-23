/**
 * DAG-KG 自动提取和对齐系统测试脚本
 * 测试系统的核心功能
 */

const { enhancedKnowledgeGraphDAGIntegration } = require('./src/superpowers/dag_kg_integration');
const { extractionEngine } = require('./src/superpowers/extraction_engine');
const { alignmentEngine } = require('./src/superpowers/alignment_engine');
const { syncEngine } = require('./src/superpowers/sync_engine');
const { evaluationEngine } = require('./src/superpowers/evaluation_engine');
const { optimizationEngine } = require('./src/superpowers/optimization_engine');

// 模拟DAG管理器
class MockDAGManager {
  constructor() {
    this.dag = {
      nodes: {},
      edges: {}
    };
  }

  addNode(id, node) {
    this.dag.nodes[id] = node;
    return true;
  }

  getNode(id) {
    return this.dag.nodes[id];
  }

  getNodes() {
    return Object.values(this.dag.nodes);
  }
}

// 模拟知识图谱管理器
class MockKGManager {
  constructor() {
    this.nodes = {};
  }

  addNode(id, node) {
    this.nodes[id] = node;
    return true;
  }

  getNode(id) {
    return this.nodes[id];
  }

  getNodes() {
    return Object.values(this.nodes);
  }
}

async function testDAGKGSystem() {
  console.log('开始测试DAG-KG自动提取和对齐系统...\n');

  // 1. 初始化系统
  console.log('1. 初始化系统...');
  const dagManager = new MockDAGManager();
  const kgManager = new MockKGManager();
  const initResult = await enhancedKnowledgeGraphDAGIntegration.initialize(dagManager, kgManager);
  console.log('初始化结果:', initResult);

  // 2. 测试提取引擎
  console.log('\n2. 测试提取引擎...');
  const testData = `
    你好，我需要配置NekoBox使用海外静态住宅IP代理服务器。
    服务器地址是64.105.162.121，端口7778，用户名1ifv2sdd22p26d，密码ipweb。
    我希望能够通过这个代理访问谷歌地图和其他国际网站。
  `;

  const extractionResult = await extractionEngine.extract(testData);
  console.log('提取结果:', {
    raw: extractionResult.raw ? '✓' : '✗',
    structured: extractionResult.structured ? '✓' : '✗',
    semantic: extractionResult.semantic ? '✓' : '✗',
    knowledge: extractionResult.knowledge ? '✓' : '✗',
    insight: extractionResult.insight ? '✓' : '✗'
  });

  // 3. 测试评估引擎
  console.log('\n3. 测试评估引擎...');
  const extractionEvaluation = await evaluationEngine.evaluateExtraction(extractionResult);
  console.log('提取评估结果:', {
    overallScore: extractionEvaluation.overallScore,
    issues: extractionEvaluation.issues.length,
    recommendations: extractionEvaluation.recommendations.length
  });

  // 4. 测试优化引擎
  console.log('\n4. 测试优化引擎...');
  const optimizationResult = await optimizationEngine.optimizeExtraction(extractionResult, extractionEvaluation);
  console.log('优化结果:', {
    success: optimizationResult.success,
    actions: optimizationResult.actions.length
  });

  // 5. 测试DAG-KG集成
  console.log('\n5. 测试DAG-KG集成...');
  const extractToDagResult = await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG(testData);
  console.log('提取到DAG结果:', {
    success: extractToDagResult.success,
    dagNodeId: extractToDagResult.dagNodeId
  });

  // 6. 测试边映射优化
  console.log('\n6. 测试边映射优化...');
  const optimizeEdgeMappingResult = await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping();
  console.log('边映射优化结果:', {
    success: optimizeEdgeMappingResult.success,
    mappings: optimizeEdgeMappingResult.mappings ? optimizeEdgeMappingResult.mappings.length : 0
  });

  // 7. 测试双向同步
  console.log('\n7. 测试双向同步...');
  const bidirectionalSyncResult = await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync();
  console.log('双向同步结果:', {
    success: bidirectionalSyncResult.success,
    syncResults: bidirectionalSyncResult.syncResults ? bidirectionalSyncResult.syncResults.length : 0
  });

  // 8. 测试映射分析
  console.log('\n8. 测试映射分析...');
  const analyzeMappingResult = await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
  console.log('映射分析结果:', {
    mappingCount: analyzeMappingResult.mappingCount,
    averageConfidence: analyzeMappingResult.statistics?.averageConfidence
  });

  // 9. 测试性能优化
  console.log('\n9. 测试性能优化...');
  const optimizePerformanceResult = await enhancedKnowledgeGraphDAGIntegration.optimizePerformance();
  console.log('性能优化结果:', {
    success: optimizePerformanceResult.success,
    actions: optimizePerformanceResult.actions.length
  });

  // 10. 测试系统状态
  console.log('\n10. 测试系统状态...');
  const status = enhancedKnowledgeGraphDAGIntegration.getStatus();
  console.log('系统状态:', status);

  // 11. 验证DAG和KG数据
  console.log('\n11. 验证DAG和KG数据...');
  console.log('DAG节点数量:', Object.keys(dagManager.dag.nodes).length);
  console.log('KG节点数量:', Object.keys(kgManager.nodes).length);

  console.log('\n✅ DAG-KG自动提取和对齐系统测试完成！');
}

testDAGKGSystem().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});
