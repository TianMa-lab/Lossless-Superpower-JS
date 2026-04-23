/**
 * DAG Lossless Memory 系统
 * 实现多层提取的lossless memory功能
 */

const { dagTaskIntegration } = require('./dag_task_integration');

class DAGLosslessMemory {
  constructor() {
    this.dagInitialized = false;
    this.memoryLayers = {
      raw: '原始数据层',
      structured: '结构化数据层',
      semantic: '语义理解层',
      knowledge: '知识提取层',
      insight: '洞察发现层'
    };
    this.extractors = {
      raw: this.extractRawData.bind(this),
      structured: this.extractStructuredData.bind(this),
      semantic: this.extractSemanticData.bind(this),
      knowledge: this.extractKnowledge.bind(this),
      insight: this.extractInsights.bind(this)
    };
    this.memoryCache = new Map();
  }

  async initialize() {
    if (!this.dagInitialized) {
      try {
        await dagTaskIntegration.initialize();
        this.dagInitialized = true;
        console.log('[DAGLosslessMemory] 初始化成功');
      } catch (error) {
        console.error('[DAGLosslessMemory] 初始化失败:', error.message);
      }
    }
    return this.dagInitialized;
  }

  async processData(data, context = {}) {
    if (!this.dagInitialized) {
      await this.initialize();
    }

    const memoryId = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memoryNode = {
      id: memoryId,
      type: 'memory',
      topic: context.topic || '未命名记忆',
      createdAt: Date.now(),
      layers: {},
      metadata: {
        source: context.source || 'unknown',
        confidence: context.confidence || 0.8,
        relevance: context.relevance || 0.7
      }
    };

    // 多层提取
    for (const [layer, description] of Object.entries(this.memoryLayers)) {
      const extractor = this.extractors[layer];
      if (extractor) {
        const extractedData = await extractor(data, context);
        memoryNode.layers[layer] = {
          data: extractedData,
          processedAt: Date.now(),
          description: description
        };
      }
    }

    // 存储到DAG
    const dagManager = dagTaskIntegration.getDAGManager();
    const addNodeResult = dagManager.addNode(memoryId, memoryNode);

    if (addNodeResult) {
      this.memoryCache.set(memoryId, memoryNode);
      return {
        success: true,
        memoryId: memoryId,
        layers: Object.keys(memoryNode.layers)
      };
    }

    return { success: false, message: '存储记忆到DAG失败' };
  }

  extractRawData(data, context) {
    return {
      original: data,
      timestamp: Date.now(),
      size: typeof data === 'string' ? data.length : JSON.stringify(data).length,
      type: typeof data,
      source: context.source || 'unknown'
    };
  }

  extractStructuredData(data, context) {
    const structured = {
      entities: [],
      keywords: [],
      relationships: [],
      metadata: {}
    };

    if (typeof data === 'string') {
      // 提取实体
      structured.entities = this.extractEntities(data);
      // 提取关键词
      structured.keywords = this.extractKeywords(data);
      // 提取关系
      structured.relationships = this.extractRelationships(data);
    } else if (typeof data === 'object' && data !== null) {
      structured.metadata = data;
      structured.entities = this.extractEntitiesFromObject(data);
    }

    return structured;
  }

  extractSemanticData(data, context) {
    const semantic = {
      topics: [],
      sentiments: [],
      intentions: [],
      concepts: []
    };

    if (typeof data === 'string') {
      semantic.topics = this.extractTopics(data);
      semantic.sentiments = this.extractSentiments(data);
      semantic.intentions = this.extractIntentions(data);
      semantic.concepts = this.extractConcepts(data);
    }

    return semantic;
  }

  extractKnowledge(data, context) {
    const knowledge = {
      facts: [],
      rules: [],
      patterns: [],
      insights: []
    };

    if (typeof data === 'string') {
      knowledge.facts = this.extractFacts(data);
      knowledge.rules = this.extractRules(data);
      knowledge.patterns = this.extractPatterns(data);
    }

    return knowledge;
  }

  extractInsights(data, context) {
    const insights = {
      trends: [],
      opportunities: [],
      risks: [],
      recommendations: []
    };

    if (typeof data === 'string') {
      insights.trends = this.extractTrends(data);
      insights.opportunities = this.extractOpportunities(data);
      insights.risks = this.extractRisks(data);
      insights.recommendations = this.extractRecommendations(data);
    }

    return insights;
  }

  extractEntities(text) {
    const entities = [];
    // 提取IP地址
    const ips = text.match(/\d+\.\d+\.\d+\.\d+/g) || [];
    entities.push(...ips.map(ip => ({ type: 'ip', value: ip })));
    // 提取URL
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    entities.push(...urls.map(url => ({ type: 'url', value: url })));
    // 提取邮箱
    const emails = text.match(/[^\s]+@[^\s]+/g) || [];
    entities.push(...emails.map(email => ({ type: 'email', value: email })));
    return entities;
  }

  extractKeywords(text) {
    const stopWords = new Set([
      '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
    ]);

    const words = text.split(/\s+/);
    return words
      .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()))
      .map(word => word.toLowerCase());
  }

  extractRelationships(text) {
    const relationships = [];
    // 简单的关系提取
    const patterns = [
      /(\w+)\s+(is|are|was|were|be)\s+([\w\s]+)/gi,
      /(\w+)\s+(has|have|had)\s+([\w\s]+)/gi,
      /(\w+)\s+(does|do|did)\s+([\w\s]+)/gi
    ];

    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[3]) {
          relationships.push({
            subject: match[1],
            predicate: match[2],
            object: match[3]
          });
        }
      }
    });

    return relationships;
  }

  extractEntitiesFromObject(obj) {
    const entities = [];
    const stack = [obj];

    while (stack.length > 0) {
      const current = stack.pop();
      if (typeof current === 'object' && current !== null) {
        for (const [key, value] of Object.entries(current)) {
          if (typeof value === 'string') {
            entities.push(...this.extractEntities(value));
          } else if (typeof value === 'object' && value !== null) {
            stack.push(value);
          }
        }
      }
    }

    return entities;
  }

  extractTopics(text) {
    const topics = [];
    const topicPatterns = [
      /(关于|关于|涉及|关于)\s+([\w\s]+)/gi,
      /(讨论|讨论|谈论|讨论)\s+([\w\s]+)/gi,
      /(主题|主题|话题|主题)\s*[:：]?\s*([\w\s]+)/gi
    ];

    topicPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          topics.push(match[2].trim());
        }
      }
    });

    return topics;
  }

  extractSentiments(text) {
    const sentiments = [];
    const positiveWords = ['好', '优秀', '棒', '完美', '成功', 'happy', 'good', 'excellent', 'great'];
    const negativeWords = ['坏', '差', '糟糕', '失败', 'sad', 'bad', 'poor', 'terrible', 'failure'];

    positiveWords.forEach(word => {
      if (text.includes(word)) {
        sentiments.push({ type: 'positive', word: word });
      }
    });

    negativeWords.forEach(word => {
      if (text.includes(word)) {
        sentiments.push({ type: 'negative', word: word });
      }
    });

    return sentiments;
  }

  extractIntentions(text) {
    const intentions = [];
    const intentionPatterns = [
      /(需要|想要|希望|想)\s+([\w\s]+)/gi,
      /(请|麻烦|帮忙)\s+([\w\s]+)/gi,
      /(应该|应该|应当|应该)\s+([\w\s]+)/gi
    ];

    intentionPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          intentions.push({
            type: 'intention',
            content: match[2].trim()
          });
        }
      }
    });

    return intentions;
  }

  extractConcepts(text) {
    const concepts = [];
    const conceptPatterns = [
      /(概念|概念|理念|概念)\s*[:：]?\s*([\w\s]+)/gi,
      /(原理|原理|机制|原理)\s*[:：]?\s*([\w\s]+)/gi,
      /(方法|方法|技术|方法)\s*[:：]?\s*([\w\s]+)/gi
    ];

    conceptPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          concepts.push({
            type: 'concept',
            content: match[2].trim()
          });
        }
      }
    });

    return concepts;
  }

  extractFacts(text) {
    const facts = [];
    const factPatterns = [
      /(事实|事实|事实是|事实)\s*[:：]?\s*([\w\s]+)/gi,
      /(数据|数据|统计|数据)\s*[:：]?\s*([\w\s]+)/gi,
      /(信息|信息|资讯|信息)\s*[:：]?\s*([\w\s]+)/gi
    ];

    factPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          facts.push({
            type: 'fact',
            content: match[2].trim()
          });
        }
      }
    });

    return facts;
  }

  extractRules(text) {
    const rules = [];
    const rulePatterns = [
      /(规则|规则|规定|规则)\s*[:：]?\s*([\w\s]+)/gi,
      /(要求|要求|条件|要求)\s*[:：]?\s*([\w\s]+)/gi,
      /(必须|必须|需要|必须)\s+([\w\s]+)/gi
    ];

    rulePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          rules.push({
            type: 'rule',
            content: match[2].trim()
          });
        }
      }
    });

    return rules;
  }

  extractPatterns(text) {
    const patterns = [];
    const patternPatterns = [
      /(模式|模式|规律|模式)\s*[:：]?\s*([\w\s]+)/gi,
      /(趋势|趋势|倾向|趋势)\s*[:：]?\s*([\w\s]+)/gi,
      /(特点|特点|特征|特点)\s*[:：]?\s*([\w\s]+)/gi
    ];

    patternPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          patterns.push({
            type: 'pattern',
            content: match[2].trim()
          });
        }
      }
    });

    return patterns;
  }

  extractTrends(text) {
    const trends = [];
    const trendPatterns = [
      /(趋势|趋势|发展趋势|趋势)\s*[:：]?\s*([\w\s]+)/gi,
      /(越来越|越来越|日益|越来越)\s+([\w\s]+)/gi,
      /(增长|增长|上升|增长)\s+([\w\s]+)/gi
    ];

    trendPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          trends.push({
            type: 'trend',
            content: match[2].trim()
          });
        }
      }
    });

    return trends;
  }

  extractOpportunities(text) {
    const opportunities = [];
    const opportunityPatterns = [
      /(机会|机会|机遇|机会)\s*[:：]?\s*([\w\s]+)/gi,
      /(可能|可能|可以|可能)\s+([\w\s]+)/gi,
      /(潜力|潜力|潜能|潜力)\s*[:：]?\s*([\w\s]+)/gi
    ];

    opportunityPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          opportunities.push({
            type: 'opportunity',
            content: match[2].trim()
          });
        }
      }
    });

    return opportunities;
  }

  extractRisks(text) {
    const risks = [];
    const riskPatterns = [
      /(风险|风险|危险|风险)\s*[:：]?\s*([\w\s]+)/gi,
      /(问题|问题|难题|问题)\s*[:：]?\s*([\w\s]+)/gi,
      /(挑战|挑战|困难|挑战)\s*[:：]?\s*([\w\s]+)/gi
    ];

    riskPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          risks.push({
            type: 'risk',
            content: match[2].trim()
          });
        }
      }
    });

    return risks;
  }

  extractRecommendations(text) {
    const recommendations = [];
    const recommendationPatterns = [
      /(建议|建议|推荐|建议)\s*[:：]?\s*([\w\s]+)/gi,
      /(应该|应该|应当|应该)\s+([\w\s]+)/gi,
      /(最好|最好|最佳|最好)\s+([\w\s]+)/gi
    ];

    recommendationPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[2]) {
          recommendations.push({
            type: 'recommendation',
            content: match[2].trim()
          });
        }
      }
    });

    return recommendations;
  }

  async retrieveMemory(memoryId) {
    if (this.memoryCache.has(memoryId)) {
      return this.memoryCache.get(memoryId);
    }

    const dagManager = dagTaskIntegration.getDAGManager();
    const memoryNode = dagManager.dag.nodes[memoryId];
    if (memoryNode) {
      this.memoryCache.set(memoryId, memoryNode);
      return memoryNode;
    }

    return null;
  }

  async searchMemory(query) {
    const dagManager = dagTaskIntegration.getDAGManager();
    const memories = dagManager.queryNodes({ type: 'memory' });

    return memories.filter(memory => {
      const text = JSON.stringify(memory.layers);
      return text.includes(query);
    });
  }

  async generateMemoryReport(memoryId) {
    const memory = await this.retrieveMemory(memoryId);
    if (!memory) {
      return { success: false, message: '记忆不存在' };
    }

    const report = {
      memoryId: memory.id,
      topic: memory.topic,
      createdAt: memory.createdAt,
      layers: {},
      statistics: {
        totalLayers: Object.keys(memory.layers).length,
        entities: 0,
        keywords: 0,
        insights: 0
      }
    };

    for (const [layer, data] of Object.entries(memory.layers)) {
      report.layers[layer] = {
        description: data.description,
        processedAt: data.processedAt
      };

      if (layer === 'structured') {
        report.statistics.entities = data.data.entities.length;
        report.statistics.keywords = data.data.keywords.length;
      }

      if (layer === 'insight') {
        report.statistics.insights = Object.values(data.data).flat().length;
      }
    }

    return { success: true, report: report };
  }

  cleanupCache() {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24小时
    let deletedCount = 0;

    for (const [memoryId, memory] of this.memoryCache.entries()) {
      if (memory.createdAt < cutoffTime) {
        this.memoryCache.delete(memoryId);
        deletedCount++;
      }
    }

    console.log(`[DAGLosslessMemory] 清理了 ${deletedCount} 个缓存记忆`);
    return deletedCount;
  }
}

const dagLosslessMemory = new DAGLosslessMemory();

module.exports = {
  DAGLosslessMemory,
  dagLosslessMemory
};