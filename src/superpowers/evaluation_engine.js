/**
 * 评估引擎
 * 评估提取和对齐的质量
 */

class EvaluationEngine {
  constructor() {
    this.evaluationHistory = [];
  }

  async evaluateExtraction(extractionResult, options = {}) {
    const evaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'extraction',
      timestamp: Date.now(),
      scores: {},
      overallScore: 0,
      issues: [],
      recommendations: []
    };

    // 评估原始数据提取
    if (extractionResult.raw) {
      evaluation.scores.raw = 1.0; // 原始数据提取总是成功
    }

    // 评估结构化数据提取
    if (extractionResult.structured) {
      const structuredScore = this.evaluateStructuredData(extractionResult.structured);
      evaluation.scores.structured = structuredScore;
      
      if (structuredScore < 0.8) {
        evaluation.issues.push({
          component: 'structured',
          severity: 'medium',
          message: '结构化数据提取质量较低'
        });
        evaluation.recommendations.push('优化实体和关键词提取算法');
      }
    }

    // 评估语义数据提取
    if (extractionResult.semantic) {
      const semanticScore = this.evaluateSemanticData(extractionResult.semantic);
      evaluation.scores.semantic = semanticScore;
      
      if (semanticScore < 0.7) {
        evaluation.issues.push({
          component: 'semantic',
          severity: 'medium',
          message: '语义数据提取质量较低'
        });
        evaluation.recommendations.push('改进主题和意图识别');
      }
    }

    // 评估知识提取
    if (extractionResult.knowledge) {
      const knowledgeScore = this.evaluateKnowledgeData(extractionResult.knowledge);
      evaluation.scores.knowledge = knowledgeScore;
      
      if (knowledgeScore < 0.6) {
        evaluation.issues.push({
          component: 'knowledge',
          severity: 'high',
          message: '知识提取质量较低'
        });
        evaluation.recommendations.push('增强事实和规则提取能力');
      }
    }

    // 评估洞察提取
    if (extractionResult.insight) {
      const insightScore = this.evaluateInsightData(extractionResult.insight);
      evaluation.scores.insight = insightScore;
      
      if (insightScore < 0.5) {
        evaluation.issues.push({
          component: 'insight',
          severity: 'high',
          message: '洞察提取质量较低'
        });
        evaluation.recommendations.push('改进趋势和建议提取');
      }
    }

    // 计算总体分数
    const scores = Object.values(evaluation.scores);
    if (scores.length > 0) {
      evaluation.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    this.evaluationHistory.push(evaluation);
    return evaluation;
  }

  async evaluateAlignment(mappings, options = {}) {
    const evaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'alignment',
      timestamp: Date.now(),
      scores: {
        accuracy: 0,
        coverage: 0,
        consistency: 0
      },
      overallScore: 0,
      issues: [],
      recommendations: []
    };

    if (mappings.length > 0) {
      // 评估准确性
      const totalConfidence = mappings.reduce((sum, mapping) => sum + mapping.confidence, 0);
      evaluation.scores.accuracy = totalConfidence / mappings.length;
      
      // 评估覆盖率
      evaluation.scores.coverage = mappings.length / (options.totalNodes || mappings.length);
      
      // 评估一致性
      evaluation.scores.consistency = this.evaluateMappingConsistency(mappings);
      
      // 计算总体分数
      evaluation.overallScore = (
        evaluation.scores.accuracy * 0.5 +
        evaluation.scores.coverage * 0.3 +
        evaluation.scores.consistency * 0.2
      );

      // 检查问题
      if (evaluation.scores.accuracy < 0.8) {
        evaluation.issues.push({
          component: 'accuracy',
          severity: 'high',
          message: '对齐准确性较低'
        });
        evaluation.recommendations.push('优化语义匹配算法');
      }

      if (evaluation.scores.coverage < 0.7) {
        evaluation.issues.push({
          component: 'coverage',
          severity: 'medium',
          message: '对齐覆盖率较低'
        });
        evaluation.recommendations.push('增加对齐策略，提高覆盖率');
      }

      if (evaluation.scores.consistency < 0.9) {
        evaluation.issues.push({
          component: 'consistency',
          severity: 'medium',
          message: '对齐一致性较低'
        });
        evaluation.recommendations.push('改进映射一致性检查');
      }
    }

    this.evaluationHistory.push(evaluation);
    return evaluation;
  }

  async evaluateSync(syncResults, options = {}) {
    const evaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'sync',
      timestamp: Date.now(),
      scores: {
        successRate: 0,
        timeliness: 0,
        consistency: 0
      },
      overallScore: 0,
      issues: [],
      recommendations: []
    };

    if (syncResults.length > 0) {
      // 评估成功率
      const successCount = syncResults.filter(r => r.success).length;
      evaluation.scores.successRate = successCount / syncResults.length;
      
      // 评估及时性
      const avgTime = syncResults.reduce((sum, r) => sum + (r.timestamp || Date.now()), 0) / syncResults.length;
      const timeDiff = Date.now() - avgTime;
      evaluation.scores.timeliness = Math.max(0, 1 - (timeDiff / (60 * 1000))); // 1分钟内为1.0
      
      // 评估一致性
      evaluation.scores.consistency = this.evaluateSyncConsistency(syncResults);
      
      // 计算总体分数
      evaluation.overallScore = (
        evaluation.scores.successRate * 0.5 +
        evaluation.scores.timeliness * 0.3 +
        evaluation.scores.consistency * 0.2
      );

      // 检查问题
      if (evaluation.scores.successRate < 0.9) {
        evaluation.issues.push({
          component: 'successRate',
          severity: 'high',
          message: '同步成功率较低'
        });
        evaluation.recommendations.push('优化同步错误处理');
      }

      if (evaluation.scores.timeliness < 0.8) {
        evaluation.issues.push({
          component: 'timeliness',
          severity: 'medium',
          message: '同步及时性较低'
        });
        evaluation.recommendations.push('改进实时同步机制');
      }
    }

    this.evaluationHistory.push(evaluation);
    return evaluation;
  }

  evaluateStructuredData(structuredData) {
    let score = 0;
    
    // 评估实体提取
    if (structuredData.entities && structuredData.entities.length > 0) {
      score += 0.3;
    }
    
    // 评估关键词提取
    if (structuredData.keywords && structuredData.keywords.length > 0) {
      score += 0.3;
    }
    
    // 评估关系提取
    if (structuredData.relationships && structuredData.relationships.length > 0) {
      score += 0.4;
    }
    
    return score;
  }

  evaluateSemanticData(semanticData) {
    let score = 0;
    
    // 评估主题提取
    if (semanticData.topics && semanticData.topics.length > 0) {
      score += 0.3;
    }
    
    // 评估情感分析
    if (semanticData.sentiments && semanticData.sentiments.length > 0) {
      score += 0.2;
    }
    
    // 评估意图识别
    if (semanticData.intentions && semanticData.intentions.length > 0) {
      score += 0.3;
    }
    
    // 评估概念提取
    if (semanticData.concepts && semanticData.concepts.length > 0) {
      score += 0.2;
    }
    
    return score;
  }

  evaluateKnowledgeData(knowledgeData) {
    let score = 0;
    
    // 评估事实提取
    if (knowledgeData.facts && knowledgeData.facts.length > 0) {
      score += 0.4;
    }
    
    // 评估规则提取
    if (knowledgeData.rules && knowledgeData.rules.length > 0) {
      score += 0.3;
    }
    
    // 评估模式提取
    if (knowledgeData.patterns && knowledgeData.patterns.length > 0) {
      score += 0.3;
    }
    
    return score;
  }

  evaluateInsightData(insightData) {
    let score = 0;
    
    // 评估趋势发现
    if (insightData.trends && insightData.trends.length > 0) {
      score += 0.25;
    }
    
    // 评估机会发现
    if (insightData.opportunities && insightData.opportunities.length > 0) {
      score += 0.25;
    }
    
    // 评估风险发现
    if (insightData.risks && insightData.risks.length > 0) {
      score += 0.25;
    }
    
    // 评估建议生成
    if (insightData.recommendations && insightData.recommendations.length > 0) {
      score += 0.25;
    }
    
    return score;
  }

  evaluateMappingConsistency(mappings) {
    // 检查映射的一致性
    const dagNodeMappings = new Map();
    
    for (const mapping of mappings) {
      if (!dagNodeMappings.has(mapping.dagNodeId)) {
        dagNodeMappings.set(mapping.dagNodeId, []);
      }
      dagNodeMappings.get(mapping.dagNodeId).push(mapping);
    }
    
    // 检查每个DAG节点是否只有一个高置信度映射
    let consistentCount = 0;
    for (const [dagNodeId, nodeMappings] of dagNodeMappings.entries()) {
      const highConfidenceMappings = nodeMappings.filter(m => m.confidence >= 0.8);
      if (highConfidenceMappings.length <= 1) {
        consistentCount++;
      }
    }
    
    return dagNodeMappings.size > 0 ? consistentCount / dagNodeMappings.size : 1.0;
  }

  evaluateSyncConsistency(syncResults) {
    // 检查同步的一致性
    const nodeSyncs = new Map();
    
    for (const result of syncResults) {
      const nodeId = result.dagNodeId || result.kgNodeId;
      if (nodeId) {
        if (!nodeSyncs.has(nodeId)) {
          nodeSyncs.set(nodeId, []);
        }
        nodeSyncs.get(nodeId).push(result);
      }
    }
    
    // 检查每个节点的同步结果是否一致
    let consistentCount = 0;
    for (const [nodeId, syncs] of nodeSyncs.entries()) {
      const successCount = syncs.filter(s => s.success).length;
      if (successCount === 0 || successCount === syncs.length) {
        consistentCount++;
      }
    }
    
    return nodeSyncs.size > 0 ? consistentCount / nodeSyncs.size : 1.0;
  }

  getEvaluationHistory() {
    return this.evaluationHistory;
  }

  getEvaluationById(evaluationId) {
    return this.evaluationHistory.find(e => e.id === evaluationId);
  }

  getLatestEvaluation(type) {
    return this.evaluationHistory
      .filter(e => e.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  clearEvaluationHistory() {
    this.evaluationHistory = [];
  }
}

const evaluationEngine = new EvaluationEngine();

module.exports = {
  EvaluationEngine,
  evaluationEngine
};
