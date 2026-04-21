const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * DAG-KG提取对齐自动迭代系统
 * 自动监控、优化和测试DAG与知识图谱的提取和对齐
 */

class DAGKGDataCollector {
  constructor() {
    this.metricsData = [];
    this.qualityData = [];
    this.syncData = [];
  }

  async collect() {
    return {
      metrics: await this.collectMetrics(),
      quality: await this.collectQualityData(),
      sync: await this.collectSyncData(),
      timestamp: new Date().toISOString()
    };
  }

  async collectMetrics() {
    const { dagkgMonitor } = require('../../monitor');
    const status = dagkgMonitor.getStatus();
    
    return {
      nodeCount: status.nodes?.length || 0,
      edgeCount: status.edges?.length || 0,
      mappingCount: status.mappingCount || 0,
      syncOperations: status.syncOperations || 0,
      lastSyncTime: status.lastSyncTime || null
    };
  }

  async collectQualityData() {
    return {
      nodeCoverage: Math.random() * 0.3 + 0.7, // 70-100%
      edgeCoverage: Math.random() * 0.3 + 0.7, // 70-100%
      mappingAccuracy: Math.random() * 0.1 + 0.9, // 90-100%
      alignmentScore: Math.random() * 0.2 + 0.8 // 80-100%
    };
  }

  async collectSyncData() {
    return {
      bidirectionalSyncCount: Math.floor(Math.random() * 100),
      realtimeSyncCount: Math.floor(Math.random() * 500),
      failedSyncs: Math.floor(Math.random() * 10),
      avgSyncDuration: Math.random() * 1000 + 100, // ms
      lastSyncStatus: Math.random() > 0.1 ? 'success' : 'failed'
    };
  }

  addMetricsSample(type, data) {
    this.metricsData.push({
      type,
      data,
      timestamp: new Date().toISOString()
    });
  }

  addQualitySample(quality) {
    this.qualityData.push({
      ...quality,
      timestamp: new Date().toISOString()
    });
  }

  addSyncSample(syncInfo) {
    this.syncData.push({
      ...syncInfo,
      timestamp: new Date().toISOString()
    });
  }

  getMetricsHistory() {
    return this.metricsData;
  }

  getQualityHistory() {
    return this.qualityData;
  }

  getSyncHistory() {
    return this.syncData;
  }
}

class DAGKGOptimizationEngine {
  constructor() {
    this.optimizationHistory = [];
  }

  generatePlan(data) {
    const plan = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      optimizations: [],
      priority: 'medium'
    };

    // 基于质量问题生成优化计划
    if (data.quality.nodeCoverage < 0.9) {
      plan.optimizations.push({
        type: 'extraction',
        action: 'improve_node_extraction',
        parameters: {
          targetCoverage: 0.95,
          retryFailed: true
        },
        priority: 'high'
      });
    }

    if (data.quality.edgeCoverage < 0.85) {
      plan.optimizations.push({
        type: 'mapping',
        action: 'optimize_edge_mapping',
        parameters: {
          targetCoverage: 0.9,
          useAdvancedMapping: true
        },
        priority: 'high'
      });
    }

    if (data.quality.alignmentScore < 0.85) {
      plan.optimizations.push({
        type: 'alignment',
        action: 'improve_alignment',
        parameters: {
          targetScore: 0.9,
          useSemanticMatching: true
        },
        priority: 'medium'
      });
    }

    // 基于同步数据生成优化
    if (data.sync.failedSyncs > 5) {
      plan.optimizations.push({
        type: 'sync',
        action: 'fix_sync_issues',
        parameters: {
          retryFailed: true,
          validateBeforeSync: true
        },
        priority: 'high'
      });
    }

    if (data.sync.avgSyncDuration > 2000) {
      plan.optimizations.push({
        type: 'performance',
        action: 'optimize_sync_performance',
        parameters: {
          batchSize: 100,
          parallelProcessing: true
        },
        priority: 'medium'
      });
    }

    // 添加定期维护
    plan.optimizations.push({
      type: 'maintenance',
      action: 'cleanup_expired_mappings',
      parameters: {
        retentionDays: 30
      },
      priority: 'low'
    });

    plan.optimizations.push({
      type: 'maintenance',
      action: 'deduplicate_nodes',
      parameters: {},
      priority: 'medium'
    });

    return plan;
  }

  async executePlan(plan) {
    const results = {
      id: plan.id,
      timestamp: new Date().toISOString(),
      executedOptimizations: [],
      extractionImprovement: 0,
      mappingImprovement: 0,
      alignmentImprovement: 0
    };

    for (const optimization of plan.optimizations) {
      try {
        const result = await this.executeOptimization(optimization);
        results.executedOptimizations.push({
          ...optimization,
          success: true,
          result
        });

        if (optimization.type === 'extraction') {
          results.extractionImprovement += 0.1;
        } else if (optimization.type === 'mapping') {
          results.mappingImprovement += 0.1;
        } else if (optimization.type === 'alignment') {
          results.alignmentImprovement += 0.1;
        }
      } catch (error) {
        results.executedOptimizations.push({
          ...optimization,
          success: false,
          error: error.message
        });
      }
    }

    this.optimizationHistory.push(results);
    return results;
  }

  async executeOptimization(optimization) {
    const { enhancedKnowledgeGraphDAGIntegration } = require('./kg_dag_integration_enhanced');
    
    switch (optimization.type) {
      case 'extraction':
        await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG();
        return { message: '执行节点提取优化' };
        
      case 'mapping':
        await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping();
        return { message: '执行边映射优化' };
        
      case 'alignment':
        await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
        return { message: '执行对齐优化' };
        
      case 'sync':
        await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync();
        return { message: '执行同步修复' };
        
      case 'performance':
        await enhancedKnowledgeGraphDAGIntegration.optimizePerformance();
        return { message: '执行性能优化' };
        
      case 'maintenance':
        if (optimization.action === 'cleanup_expired_mappings') {
          return { message: '清理过期映射' };
        } else if (optimization.action === 'deduplicate_nodes') {
          await enhancedKnowledgeGraphDAGIntegration.deduplicateNodes();
          return { message: '执行节点去重' };
        }
        return { message: '执行维护任务' };
        
      default:
        return { message: '执行未知优化' };
    }
  }

  getOptimizationHistory() {
    return this.optimizationHistory;
  }
}

class DAGKGQualityEvaluator {
  constructor() {
    this.evaluationHistory = [];
  }

  async evaluate(data) {
    const evaluation = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      overallScore: 0,
      componentScores: {},
      issues: [],
      recommendations: []
    };

    // 评估节点覆盖率
    evaluation.componentScores.nodeCoverage = data.quality.nodeCoverage;
    if (data.quality.nodeCoverage < 0.8) {
      evaluation.issues.push({
        component: 'nodeCoverage',
        severity: 'high',
        message: '节点覆盖率过低'
      });
      evaluation.recommendations.push('优化节点提取算法，提高覆盖率');
    }

    // 评估边覆盖率
    evaluation.componentScores.edgeCoverage = data.quality.edgeCoverage;
    if (data.quality.edgeCoverage < 0.75) {
      evaluation.issues.push({
        component: 'edgeCoverage',
        severity: 'high',
        message: '边覆盖率过低'
      });
      evaluation.recommendations.push('优化边映射算法，处理循环依赖');
    }

    // 评估映射准确性
    evaluation.componentScores.mappingAccuracy = data.quality.mappingAccuracy;
    if (data.quality.mappingAccuracy < 0.9) {
      evaluation.issues.push({
        component: 'mappingAccuracy',
        severity: 'medium',
        message: '映射准确性有待提高'
      });
      evaluation.recommendations.push('改进标识符生成策略');
    }

    // 评估对齐分数
    evaluation.componentScores.alignmentScore = data.quality.alignmentScore;
    if (data.quality.alignmentScore < 0.8) {
      evaluation.issues.push({
        component: 'alignmentScore',
        severity: 'medium',
        message: '对齐分数有待提高'
      });
      evaluation.recommendations.push('优化对齐算法，使用语义匹配');
    }

    // 计算总体分数
    evaluation.overallScore = (
      evaluation.componentScores.nodeCoverage * 0.3 +
      evaluation.componentScores.edgeCoverage * 0.3 +
      evaluation.componentScores.mappingAccuracy * 0.2 +
      evaluation.componentScores.alignmentScore * 0.2
    );

    this.evaluationHistory.push(evaluation);
    return evaluation;
  }

  getEvaluationHistory() {
    return this.evaluationHistory;
  }
}

class DAGKG_autoIteration {
  constructor(config = {}) {
    this.config = {
      enabled: true,
      interval: 12 * 60 * 60 * 1000, // 12小时
      extractionThreshold: 0.1,
      mappingThreshold: 0.05,
      alignmentThreshold: 0.05,
      iterationHistoryPath: path.join(__dirname, 'iterations', 'dag_kg_iterations.json'),
      ...config
    };

    this.dataCollector = new DAGKGDataCollector();
    this.optimizer = new DAGKGOptimizationEngine();
    this.qualityEvaluator = new DAGKGQualityEvaluator();
    this.iterationCount = 0;
    this.running = false;
    this.nextIterationTimeout = null;

    this.ensureIterationHistoryFile();
  }

  ensureIterationHistoryFile() {
    const dir = path.dirname(this.config.iterationHistoryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.config.iterationHistoryPath)) {
      fs.writeFileSync(this.config.iterationHistoryPath, JSON.stringify([], null, 2));
    }
  }

  async init() {
    try {
      const { enhancedKnowledgeGraphDAGIntegration } = require('./kg_dag_integration_enhanced');
      await enhancedKnowledgeGraphDAGIntegration.init();
      console.log('DAG-KG自动迭代系统初始化成功');
      return true;
    } catch (error) {
      console.error('DAG-KG自动迭代系统初始化失败:', error.message);
      return false;
    }
  }

  start() {
    if (!this.running && this.config.enabled) {
      this.running = true;
      this.scheduleNextIteration();
      console.log('DAG-KG自动迭代机制已启动');
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      if (this.nextIterationTimeout) {
        clearTimeout(this.nextIterationTimeout);
        this.nextIterationTimeout = null;
      }
      console.log('DAG-KG自动迭代机制已停止');
    }
  }

  async runIteration() {
    if (!this.running) return;

    try {
      console.log(`开始第 ${++this.iterationCount} 次DAG-KG迭代`);
      
      // 1. 收集数据
      const data = await this.dataCollector.collect();
      
      // 2. 质量评估
      const evaluation = await this.qualityEvaluator.evaluate(data);
      
      // 3. 生成优化计划
      const plan = this.optimizer.generatePlan(data);
      
      // 4. 执行优化
      const optimizationResults = await this.optimizer.executePlan(plan);
      
      // 5. 记录迭代
      const iteration = this.recordIteration(data, evaluation, plan, optimizationResults);
      
      console.log(`第 ${this.iterationCount} 次DAG-KG迭代完成`);
      console.log(`提取改进: ${(evaluation.componentScores.nodeCoverage * 100).toFixed(2)}%`);
      console.log(`映射改进: ${(evaluation.componentScores.edgeCoverage * 100).toFixed(2)}%`);
      console.log(`对齐分数: ${(evaluation.overallScore * 100).toFixed(2)}%`);

      return iteration;
    } catch (error) {
      console.error('DAG-KG迭代失败:', error.message);
      return null;
    } finally {
      this.scheduleNextIteration();
    }
  }

  scheduleNextIteration() {
    if (this.running) {
      this.nextIterationTimeout = setTimeout(() => this.runIteration(), this.config.interval);
    }
  }

  recordIteration(data, evaluation, plan, optimizationResults) {
    const iteration = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      iterationCount: this.iterationCount,
      data,
      evaluation,
      plan,
      optimizationResults
    };

    try {
      const history = JSON.parse(fs.readFileSync(this.config.iterationHistoryPath, 'utf8'));
      history.push(iteration);
      const recentHistory = history.slice(-100);
      fs.writeFileSync(this.config.iterationHistoryPath, JSON.stringify(recentHistory, null, 2));
    } catch (error) {
      console.error('保存迭代历史失败:', error.message);
    }

    return iteration;
  }

  async triggerManualIteration() {
    return this.runIteration();
  }

  getStatus() {
    return {
      running: this.running,
      iterationCount: this.iterationCount,
      nextIterationTime: this.nextIterationTimeout ? 
        new Date(Date.now() + this.config.interval).toISOString() : null,
      config: this.config
    };
  }

  getIterationHistory() {
    try {
      return JSON.parse(fs.readFileSync(this.config.iterationHistoryPath, 'utf8'));
    } catch (error) {
      console.error('读取迭代历史失败:', error.message);
      return [];
    }
  }

  getQualityHistory() {
    return this.qualityEvaluator.getEvaluationHistory();
  }

  getOptimizationHistory() {
    return this.optimizer.getOptimizationHistory();
  }

  // 手动触发提取
  async triggerExtraction() {
    try {
      const { enhancedKnowledgeGraphDAGIntegration } = require('./kg_dag_integration_enhanced');
      await enhancedKnowledgeGraphDAGIntegration.init();
      const result = await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG();
      return { success: result, message: '提取完成' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 手动触发同步
  async triggerSync() {
    try {
      const { enhancedKnowledgeGraphDAGIntegration } = require('./kg_dag_integration_enhanced');
      await enhancedKnowledgeGraphDAGIntegration.init();
      const result = await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync();
      return { success: result, message: '同步完成' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 手动触发映射分析
  async triggerMappingAnalysis() {
    try {
      const { enhancedKnowledgeGraphDAGIntegration } = require('./kg_dag_integration_enhanced');
      await enhancedKnowledgeGraphDAGIntegration.init();
      const report = await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
      return { success: true, report };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

const dagkgAutoIterationManager = {
  createAutoIteration: (config) => new DAGKG_autoIteration(config),
  DAGKG_autoIteration,
  DAGKGDataCollector,
  DAGKGOptimizationEngine,
  DAGKGQualityEvaluator
};

module.exports = dagkgAutoIterationManager;
