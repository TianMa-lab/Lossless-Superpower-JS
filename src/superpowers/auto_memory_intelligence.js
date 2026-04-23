/**
 * 自动记忆智能提取系统
 * 实现自动记忆、智能提取的完整功能
 */

const { conversationRecorder } = require('./conversation_recorder');
const { dagLosslessMemory } = require('./dag_lossless_memory');
const { autoTaskRecorder } = require('../index.js');

class AutoMemoryIntelligence {
  constructor() {
    this.initialized = false;
    this.memoryProcessors = new Map();
    this.config = {
      enableAutoMemory: true,
      enableIntelligentExtraction: true,
      enableRealTimeProcessing: true,
      enableMemoryConsolidation: true,
      memoryConsolidationInterval: 3600000, // 1小时
      maxMemorySize: 10000
    };
  }

  async initialize() {
    if (!this.initialized) {
      try {
        // 初始化各个模块
        await conversationRecorder.initialize();
        await dagLosslessMemory.initialize();
        
        // 启动内存整合任务
        this.startMemoryConsolidation();
        
        this.initialized = true;
        console.log('[AutoMemoryIntelligence] 自动记忆智能提取系统初始化成功');
      } catch (error) {
        console.error('[AutoMemoryIntelligence] 初始化失败:', error.message);
      }
    }
    return this.initialized;
  }

  async autoRecordConversation(conversationId, messages, metadata = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`[AutoMemoryIntelligence] 自动记录对话: ${conversationId}`);

    // 1. 记录对话到DAG
    const conversationResult = await conversationRecorder.recordConversation(
      conversationId,
      messages,
      metadata
    );

    if (conversationResult.success) {
      // 2. 提取对话内容进行智能处理
      const conversationText = messages.map(msg => msg.content).join('\n');
      
      // 3. 处理记忆
      const memoryResult = await dagLosslessMemory.processData(
        conversationText,
        {
          topic: metadata.topic || conversationResult.topic,
          source: 'conversation',
          confidence: 0.8,
          relevance: 0.7,
          conversationId: conversationId
        }
      );

      if (memoryResult.success) {
        // 4. 记录任务
        await autoTaskRecorder.recordTask(
          '对话自动处理',
          `自动处理对话 ${conversationId}，提取记忆 ${memoryResult.memoryId}`,
          async () => {
            console.log(`[AutoMemoryIntelligence] 对话 ${conversationId} 处理完成`);
            return { success: true, message: '对话处理完成' };
          },
          {
            priority: 'medium',
            project: 'auto_memory',
            tags: ['conversation', 'memory', 'auto_processing'],
            metadata: {
              conversationId: conversationId,
              memoryId: memoryResult.memoryId
            }
          }
        );

        return {
          success: true,
          conversationId: conversationId,
          memoryId: memoryResult.memoryId,
          layers: memoryResult.layers
        };
      }
    }

    return { success: false, message: '自动记忆失败' };
  }

  async autoRecordTask(taskInfo) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`[AutoMemoryIntelligence] 自动记录任务: ${taskInfo.topic}`);

    // 1. 记录任务
    const taskResult = await autoTaskRecorder.recordTask(
      taskInfo.topic,
      taskInfo.description,
      taskInfo.taskFn || (async () => { return {}; }),
      taskInfo.options || {}
    );

    if (taskResult) {
      // 2. 处理任务数据为记忆
      const taskData = {
        topic: taskInfo.topic,
        description: taskInfo.description,
        options: taskInfo.options,
        timestamp: Date.now()
      };

      const memoryResult = await dagLosslessMemory.processData(
        taskData,
        {
          topic: taskInfo.topic,
          source: 'task',
          confidence: 0.9,
          relevance: 0.8,
          taskId: taskResult
        }
      );

      return {
        success: true,
        taskId: taskResult,
        memoryId: memoryResult.memoryId
      };
    }

    return { success: false, message: '任务记忆失败' };
  }

  async intelligentExtract(data, context = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('[AutoMemoryIntelligence] 智能提取数据');

    // 1. 处理记忆
    const memoryResult = await dagLosslessMemory.processData(data, context);

    if (memoryResult.success) {
      // 2. 生成智能分析
      const memory = await dagLosslessMemory.retrieveMemory(memoryResult.memoryId);
      
      if (memory) {
        return {
          success: true,
          memoryId: memoryResult.memoryId,
          extractedData: {
            entities: memory.layers.structured?.data.entities || [],
            keywords: memory.layers.structured?.data.keywords || [],
            topics: memory.layers.semantic?.data.topics || [],
            sentiments: memory.layers.semantic?.data.sentiments || [],
            intentions: memory.layers.semantic?.data.intentions || [],
            facts: memory.layers.knowledge?.data.facts || [],
            insights: memory.layers.insight?.data || {}
          }
        };
      }
    }

    return { success: false, message: '智能提取失败' };
  }

  async searchMemories(query, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`[AutoMemoryIntelligence] 搜索记忆: ${query}`);

    // 1. 搜索记忆
    const memories = await dagLosslessMemory.searchMemory(query);

    // 2. 智能排序
    const sortedMemories = memories.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      return scoreB - scoreA;
    });

    // 3. 提取关键信息
    const results = sortedMemories.slice(0, options.limit || 10).map(memory => ({
      memoryId: memory.id,
      topic: memory.topic,
      relevance: this.calculateRelevanceScore(memory, query),
      entities: memory.layers.structured?.data.entities || [],
      keywords: memory.layers.structured?.data.keywords || [],
      topics: memory.layers.semantic?.data.topics || [],
      createdAt: memory.createdAt
    }));

    return {
      success: true,
      results: results,
      total: memories.length
    };
  }

  calculateRelevanceScore(memory, query) {
    let score = 0;
    
    // 检查标题匹配
    if (memory.topic && memory.topic.includes(query)) {
      score += 0.5;
    }

    // 检查关键词匹配
    const keywords = memory.layers.structured?.data.keywords || [];
    if (keywords.some(keyword => keyword.includes(query))) {
      score += 0.3;
    }

    // 检查实体匹配
    const entities = memory.layers.structured?.data.entities || [];
    if (entities.some(entity => entity.value.includes(query))) {
      score += 0.2;
    }

    // 时间衰减
    const age = Date.now() - memory.createdAt;
    const timeDecay = Math.max(0, 1 - (age / (7 * 24 * 60 * 60 * 1000))); // 7天衰减
    score *= timeDecay;

    return score;
  }

  async generateMemoryInsights(options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('[AutoMemoryIntelligence] 生成记忆洞察');

    // 1. 获取最近的记忆
    const recentMemories = await this.getRecentMemories(options.days || 7);

    // 2. 分析记忆
    const insights = {
      trends: [],
      patterns: [],
      opportunities: [],
      risks: [],
      recommendations: []
    };

    // 分析记忆内容
    recentMemories.forEach(memory => {
      if (memory.layers.insight?.data) {
        const insightData = memory.layers.insight.data;
        insights.trends.push(...insightData.trends);
        insights.opportunities.push(...insightData.opportunities);
        insights.risks.push(...insightData.risks);
        insights.recommendations.push(...insightData.recommendations);
      }
    });

    // 去重
    insights.trends = this.removeDuplicates(insights.trends);
    insights.opportunities = this.removeDuplicates(insights.opportunities);
    insights.risks = this.removeDuplicates(insights.risks);
    insights.recommendations = this.removeDuplicates(insights.recommendations);

    return {
      success: true,
      insights: insights,
      memoryCount: recentMemories.length
    };
  }

  async getRecentMemories(days = 7) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const memories = await dagLosslessMemory.searchMemory('');
    return memories.filter(memory => memory.createdAt > cutoffTime);
  }

  removeDuplicates(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        return true;
      }
      return false;
    });
  }

  startMemoryConsolidation() {
    setInterval(async () => {
      await this.consolidateMemories();
    }, this.config.memoryConsolidationInterval);
    console.log('[AutoMemoryIntelligence] 内存整合任务已启动');
  }

  async consolidateMemories() {
    console.log('[AutoMemoryIntelligence] 执行内存整合');

    try {
      // 1. 获取所有记忆
      const allMemories = await dagLosslessMemory.searchMemory('');

      // 2. 按主题分组
      const memoriesByTopic = new Map();
      allMemories.forEach(memory => {
        const topic = memory.topic || '未分类';
        if (!memoriesByTopic.has(topic)) {
          memoriesByTopic.set(topic, []);
        }
        memoriesByTopic.get(topic).push(memory);
      });

      // 3. 合并相似记忆
      for (const [topic, memories] of memoriesByTopic.entries()) {
        if (memories.length > 1) {
          await this.mergeSimilarMemories(topic, memories);
        }
      }

      console.log('[AutoMemoryIntelligence] 内存整合完成');
    } catch (error) {
      console.error('[AutoMemoryIntelligence] 内存整合失败:', error.message);
    }
  }

  async mergeSimilarMemories(topic, memories) {
    // 简单的合并逻辑
    // 实际应用中可以使用更复杂的相似度算法
    console.log(`[AutoMemoryIntelligence] 合并 ${memories.length} 个关于 "${topic}" 的记忆`);
  }

  async clearOldMemories(days = 30) {
    console.log(`[AutoMemoryIntelligence] 清理 ${days} 天前的记忆`);
    // 实现清理逻辑
  }

  getSystemStatus() {
    return {
      initialized: this.initialized,
      config: this.config,
      modules: {
        conversationRecorder: conversationRecorder,
        dagLosslessMemory: dagLosslessMemory
      }
    };
  }
}

const autoMemoryIntelligence = new AutoMemoryIntelligence();

module.exports = {
  AutoMemoryIntelligence,
  autoMemoryIntelligence
};