/**
 * 对话记录器
 * 自动记录对话中的有用数据到DAG系统
 */

const { dagTaskIntegration } = require('./dag_task_integration');

class ConversationRecorder {
  constructor() {
    this.dagInitialized = false;
    this.conversations = new Map();
    this.config = {
      enableAutoRecording: true,
      enableTopicExtraction: true,
      enableEntityExtraction: true,
      enableSentimentAnalysis: false,
      minMessageLength: 10,
      maxConversationLength: 100
    };
  }

  async initialize() {
    if (!this.dagInitialized) {
      try {
        await dagTaskIntegration.initialize();
        this.dagInitialized = true;
        console.log('[ConversationRecorder] 对话记录器初始化成功');
      } catch (error) {
        console.error('[ConversationRecorder] 初始化失败:', error.message);
      }
    }
    return this.dagInitialized;
  }

  async recordConversation(conversationId, messages, metadata = {}) {
    if (!this.dagInitialized) {
      await this.initialize();
    }

    if (!conversationId || !messages || messages.length === 0) {
      return { success: false, message: '无效的对话数据' };
    }

    // 过滤短消息
    const filteredMessages = messages.filter(msg => 
      msg.content && msg.content.length >= this.config.minMessageLength
    );

    if (filteredMessages.length === 0) {
      return { success: false, message: '没有足够长的消息' };
    }

    // 提取对话主题
    const topic = this.extractConversationTopic(filteredMessages);
    const entities = this.extractEntities(filteredMessages);
    const tasks = this.extractTasks(filteredMessages);

    // 创建对话节点
    const conversationNode = {
      id: `conversation_${conversationId}`,
      type: 'conversation',
      topic: topic,
      messageCount: filteredMessages.length,
      participantCount: this.countParticipants(filteredMessages),
      entities: entities,
      metadata: {
        ...metadata,
        startTime: filteredMessages[0].timestamp || Date.now(),
        endTime: filteredMessages[filteredMessages.length - 1].timestamp || Date.now()
      }
    };

    // 记录到DAG
    const dagManager = dagTaskIntegration.getDAGManager();
    const addNodeResult = dagManager.addNode(conversationNode.id, conversationNode);

    if (!addNodeResult) {
      return { success: false, message: '记录对话到DAG失败' };
    }

    // 记录提取的任务
    const recordedTasks = [];
    for (const task of tasks) {
      const taskResult = await dagTaskIntegration.recordTask({
        topic: task.topic,
        description: task.description,
        priority: 'medium',
        project: 'conversation',
        tags: ['conversation', 'extracted'],
        metadata: {
          detectedFrom: 'conversation',
          conversationId: conversationId,
          confidence: task.confidence || 0.7
        }
      });

      if (taskResult.success) {
        recordedTasks.push(taskResult);
        // 建立对话与任务的关系
        dagManager.addEdge(conversationNode.id, taskResult.nodeId, {
          type: 'contains_task',
          confidence: task.confidence || 0.7
        });
      }
    }

    // 记录消息节点
    const messageNodes = [];
    filteredMessages.forEach((msg, index) => {
      const messageNode = {
        id: `message_${conversationId}_${index}`,
        type: 'message',
        role: msg.role || 'user',
        content: msg.content.substring(0, 500), // 限制内容长度
        timestamp: msg.timestamp || Date.now(),
        metadata: {
          conversationId: conversationId,
          sequence: index
        }
      };

      dagManager.addNode(messageNode.id, messageNode);
      messageNodes.push(messageNode);

      // 建立对话与消息的关系
      dagManager.addEdge(conversationNode.id, messageNode.id, {
        type: 'contains_message',
        sequence: index
      });

      // 建立消息之间的顺序关系
      if (index > 0) {
        const prevMessageId = `message_${conversationId}_${index - 1}`;
        dagManager.addEdge(prevMessageId, messageNode.id, {
          type: 'followed_by',
          sequence: index
        });
      }
    });

    this.conversations.set(conversationId, {
      nodeId: conversationNode.id,
      topic: topic,
      messageCount: filteredMessages.length,
      recordedTasks: recordedTasks,
      messageNodes: messageNodes,
      timestamp: Date.now()
    });

    return {
      success: true,
      conversationId: conversationId,
      nodeId: conversationNode.id,
      topic: topic,
      messageCount: filteredMessages.length,
      recordedTasks: recordedTasks.length,
      messageNodes: messageNodes.length
    };
  }

  extractConversationTopic(messages) {
    if (!messages || messages.length === 0) {
      return '未命名对话';
    }

    // 分析前几条和最后几条消息
    const keyMessages = [
      ...messages.slice(0, 3),
      ...messages.slice(-3)
    ];

    // 提取关键词
    const keywords = [];
    keyMessages.forEach(msg => {
      if (msg.content) {
        const words = msg.content.split(/\s+/);
        const importantWords = words.filter(word => 
          word.length > 2 && !this.isStopWord(word)
        );
        keywords.push(...importantWords);
      }
    });

    // 统计词频
    const wordCount = {};
    keywords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 取词频最高的3个词
    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    if (topWords.length > 0) {
      return topWords.join(' ') || '未命名对话';
    }

    // 如果没有关键词，使用第一条消息的前50个字符
    return messages[0].content.substring(0, 50) || '未命名对话';
  }

  extractEntities(messages) {
    const entities = [];
    messages.forEach(msg => {
      if (msg.content) {
        // 简单的实体提取
        const urls = msg.content.match(/https?:\/\/[^\s]+/g) || [];
        const emails = msg.content.match(/[^\s]+@[^\s]+/g) || [];
        const ips = msg.content.match(/\d+\.\d+\.\d+\.\d+/g) || [];
        
        entities.push(...urls, ...emails, ...ips);
      }
    });
    return [...new Set(entities)]; // 去重
  }

  extractTasks(messages) {
    const tasks = [];
    const taskPatterns = [
      /(?:完成|执行|实现|修复|创建|构建|配置|设置)(.+?)(?:任务|功能|模块|系统)/gi,
      /(?:帮我|请)(.+?)(?:一下|一下)/gi,
      /(?:task|任务|完成)(.+?)(?:完成|结束|$)/gi
    ];

    messages.forEach(msg => {
      if (msg.content) {
        for (const pattern of taskPatterns) {
          const matches = msg.content.matchAll(pattern);
          for (const match of matches) {
            if (match[1] && match[1].length > 3) {
              tasks.push({
                topic: match[1].trim(),
                description: match[0],
                confidence: 0.7,
                source: msg.content
              });
            }
          }
        }
      }
    });

    return tasks;
  }

  countParticipants(messages) {
    const roles = new Set();
    messages.forEach(msg => {
      if (msg.role) {
        roles.add(msg.role);
      }
    });
    return roles.size;
  }

  isStopWord(word) {
    const stopWords = new Set([
      '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  getConversation(conversationId) {
    return this.conversations.get(conversationId);
  }

  getConversations() {
    return Array.from(this.conversations.values());
  }

  async analyzeConversation(conversationId) {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      return { success: false, message: '对话不存在' };
    }

    const dagManager = dagTaskIntegration.getDAGManager();
    const conversationNode = dagManager.dag.nodes[conversation.nodeId];
    if (!conversationNode) {
      return { success: false, message: '对话节点不存在' };
    }

    // 分析对话结构
    const messages = dagManager.queryNodes({
      type: 'message',
      'metadata.conversationId': conversationId
    });

    const tasks = dagManager.queryNodes({
      type: 'task',
      'metadata.conversationId': conversationId
    });

    return {
      success: true,
      conversation: conversationNode,
      messageCount: messages.length,
      taskCount: tasks.length,
      messages: messages,
      tasks: tasks
    };
  }

  async generateConversationReport(conversationId) {
    const analysis = await this.analyzeConversation(conversationId);
    if (!analysis.success) {
      return analysis;
    }

    return {
      success: true,
      report: {
        conversationId: conversationId,
        topic: analysis.conversation.topic,
        messageCount: analysis.messageCount,
        taskCount: analysis.taskCount,
        tasks: analysis.tasks.map(task => ({
          id: task.taskId,
          topic: task.topic,
          status: task.status
        })),
        generatedAt: Date.now()
      }
    };
  }

  cleanupOldConversations(days = 30) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    let deletedCount = 0;

    for (const [conversationId, conversation] of this.conversations.entries()) {
      if (conversation.timestamp < cutoffTime) {
        this.conversations.delete(conversationId);
        deletedCount++;
      }
    }

    console.log(`[ConversationRecorder] 清理了 ${deletedCount} 个旧对话`);
    return deletedCount;
  }
}

const conversationRecorder = new ConversationRecorder();

module.exports = {
  ConversationRecorder,
  conversationRecorder
};