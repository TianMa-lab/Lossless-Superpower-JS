const { storageLayer } = require('../storage');
const { permanentMemorySystem } = require('./permanent_memory');
const fs = require('fs');
const path = require('path');
const nlp = require('compromise');

class AutonomousLearningSystem {
  constructor() {
    this.storageLayer = storageLayer;
    this.permanentMemorySystem = permanentMemorySystem;
    this.learningDir = path.join(__dirname, 'learning');
    this.knowledgeGraphDir = path.join(this.learningDir, 'knowledge_graph');
    this.learningHistoryFile = path.join(this.learningDir, 'learning_history.json');
    this.learningHistory = [];
  }

  async init() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.learningDir)) {
        fs.mkdirSync(this.learningDir, { recursive: true });
      }
      if (!fs.existsSync(this.knowledgeGraphDir)) {
        fs.mkdirSync(this.knowledgeGraphDir, { recursive: true });
      }

      // 加载学习历史
      this._loadLearningHistory();

      // 初始化存储层和永久记忆系统
      const storageInitialized = await this.storageLayer.init();
      if (!storageInitialized) {
        console.error('自主学习系统初始化失败：存储层初始化失败');
        return false;
      }

      const memoryInitialized = await this.permanentMemorySystem.init();
      if (!memoryInitialized) {
        console.error('自主学习系统初始化失败：永久记忆系统初始化失败');
        return false;
      }

      console.log('自主学习系统初始化成功');
      return true;
    } catch (error) {
      console.error('自主学习系统初始化失败:', error.message);
      return false;
    }
  }

  _loadLearningHistory() {
    if (fs.existsSync(this.learningHistoryFile)) {
      try {
        const data = fs.readFileSync(this.learningHistoryFile, 'utf-8');
        this.learningHistory = JSON.parse(data);
      } catch (error) {
        console.error('加载学习历史失败:', error.message);
        this.learningHistory = [];
      }
    }
  }

  _saveLearningHistory() {
    try {
      fs.writeFileSync(this.learningHistoryFile, JSON.stringify(this.learningHistory, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存学习历史失败:', error.message);
      return false;
    }
  }

  // 学习框架：从交互中学习
  async learnFromInteraction(userInput, systemResponse, context = {}) {
    try {
      const learningData = {
        id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userInput,
        systemResponse,
        context,
        timestamp: Date.now(),
        confidence: 0.8,
        tags: this._extractTags(userInput + ' ' + systemResponse)
      };

      // 保存到学习历史
      this.learningHistory.push(learningData);
      this._saveLearningHistory();

      // 提取知识并添加到知识图谱
      await this._extractKnowledgeFromInteraction(learningData);

      // 保存为记忆
      await this.permanentMemorySystem.addMemory(
        `学习: 用户输入: ${userInput}, 系统响应: ${systemResponse}`,
        'learning',
        2,
        learningData.tags.join(','),
        { context }
      );

      return true;
    } catch (error) {
      console.error('从交互中学习失败:', error.message);
      return false;
    }
  }

  // 从交互中提取知识
  async _extractKnowledgeFromInteraction(learningData) {
    try {
      // 简单的知识提取逻辑
      // 实际应用中可以使用更复杂的NLP技术
      const { userInput, systemResponse } = learningData;
      
      // 提取主体-谓词-对象三元组
      const knowledgeTriples = this._extractTriples(userInput, systemResponse);
      
      for (const triple of knowledgeTriples) {
        const { subject, predicate, object, confidence } = triple;
        await this.storageLayer.addKnowledge(subject, predicate, object, confidence);
      }

      return true;
    } catch (error) {
      console.error('提取知识失败:', error.message);
      return false;
    }
  }

  // 提取三元组（增强版）
  _extractTriples(userInput, systemResponse) {
    const triples = [];
    
    // 使用NLP库进行更复杂的提取
    const text = userInput + ' ' + systemResponse;
    let entities = [];
    
    try {
      const doc = nlp(text);
      entities = doc.entities().out('array');
    } catch (error) {
      console.warn('NLP处理失败，使用备用方法:', error.message);
    }

    // 简单的模式匹配（保留原有功能）
    const patterns = [
      /(.+)是(.+)/,
      /(.+)有(.+)/,
      /(.+)可以(.+)/,
      /(.+)需要(.+)/,
      /(.+)应该(.+)/
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        triples.push({
          subject: matches[1].trim(),
          predicate: pattern.source.includes('是') ? '是' : 
                     pattern.source.includes('有') ? '有' :
                     pattern.source.includes('可以') ? '可以' :
                     pattern.source.includes('需要') ? '需要' : '应该',
          object: matches[2].trim(),
          confidence: 0.7
        });
      }
    }

    // 使用NLP提取更多关系
    if (entities.length >= 2) {
      for (let i = 0; i < entities.length - 1; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          // 简单的关系推断
          triples.push({
            subject: entities[i],
            predicate: '相关',
            object: entities[j],
            confidence: 0.5
          });
        }
      }
    }

    return triples;
  }

  // 提取标签
  _extractTags(text) {
    const commonTags = ['学习', '知识', '问题', '答案', '建议', '方法', '技巧', '经验'];
    const tags = [];

    for (const tag of commonTags) {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    }

    // 添加一些基于内容的标签
    if (text.includes('如何')) {
      tags.push('教程');
    }
    if (text.includes('为什么')) {
      tags.push('原理');
    }
    if (text.includes('什么')) {
      tags.push('概念');
    }

    return tags.length > 0 ? tags : ['其他'];
  }

  // 构建知识图谱
  async buildKnowledgeGraph() {
    try {
      console.log('开始构建知识图谱...');
      
      // 获取所有知识
      const allKnowledge = await this.storageLayer.getKnowledge();
      
      // 构建图谱结构
      const graph = {
        nodes: [],
        edges: []
      };

      const nodeMap = new Map();

      for (const knowledge of allKnowledge) {
        // 添加主体节点
        if (!nodeMap.has(knowledge.subject)) {
          nodeMap.set(knowledge.subject, {
            id: knowledge.subject,
            label: knowledge.subject,
            type: 'subject'
          });
        }

        // 添加对象节点
        if (!nodeMap.has(knowledge.object)) {
          nodeMap.set(knowledge.object, {
            id: knowledge.object,
            label: knowledge.object,
            type: 'object'
          });
        }

        // 添加边
        graph.edges.push({
          id: knowledge.id,
          source: knowledge.subject,
          target: knowledge.object,
          label: knowledge.predicate,
          confidence: knowledge.confidence
        });
      }

      // 转换节点Map为数组
      graph.nodes = Array.from(nodeMap.values());

      // 保存知识图谱
      const graphFile = path.join(this.knowledgeGraphDir, `knowledge_graph_${Date.now()}.json`);
      fs.writeFileSync(graphFile, JSON.stringify(graph, null, 2), 'utf-8');
      
      console.log(`知识图谱构建完成，包含 ${graph.nodes.length} 个节点和 ${graph.edges.length} 条边`);
      return graph;
    } catch (error) {
      console.error('构建知识图谱失败:', error.message);
      return null;
    }
  }

  // 学习效率优化
  async optimizeLearning() {
    try {
      console.log('开始优化学习效率...');
      
      // 分析学习历史
      const analysis = this._analyzeLearningHistory();
      
      // 生成优化建议
      const suggestions = this._generateOptimizationSuggestions(analysis);
      
      // 应用优化措施
      this._applyOptimizationSuggestions(suggestions);
      
      console.log('学习效率优化完成');
      return {
        analysis,
        suggestions
      };
    } catch (error) {
      console.error('优化学习效率失败:', error.message);
      return null;
    }
  }

  // 分析学习历史
  _analyzeLearningHistory() {
    const analysis = {
      totalLearningSessions: this.learningHistory.length,
      averageConfidence: 0,
      mostCommonTags: {},
      learningRate: 0
    };

    if (this.learningHistory.length === 0) {
      return analysis;
    }

    // 计算平均置信度
    const totalConfidence = this.learningHistory.reduce((sum, item) => sum + item.confidence, 0);
    analysis.averageConfidence = totalConfidence / this.learningHistory.length;

    // 统计最常见的标签
    this.learningHistory.forEach(item => {
      item.tags.forEach(tag => {
        analysis.mostCommonTags[tag] = (analysis.mostCommonTags[tag] || 0) + 1;
      });
    });

    // 计算学习率
    if (this.learningHistory.length > 0) {
      const oldest = Math.min(...this.learningHistory.map(l => l.timestamp));
      const newest = Math.max(...this.learningHistory.map(l => l.timestamp));
      const days = (newest - oldest) / (24 * 60 * 60 * 1000);
      analysis.learningRate = days > 0 ? this.learningHistory.length / days : 0;
    }

    return analysis;
  }

  // 生成优化建议
  _generateOptimizationSuggestions(analysis) {
    const suggestions = [];

    // 基于学习率的建议
    if (analysis.learningRate < 1) {
      suggestions.push('增加学习频率，建议每天至少学习一次');
    }

    // 基于置信度的建议
    if (analysis.averageConfidence < 0.7) {
      suggestions.push('提高学习质量，建议更深入地分析交互内容');
    }

    // 基于标签的建议
    const sortedTags = Object.entries(analysis.mostCommonTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sortedTags.length > 0) {
      suggestions.push(`重点关注 ${sortedTags.map(([tag]) => tag).join('、')} 等主题`);
    }

    return suggestions;
  }

  // 应用优化建议
  _applyOptimizationSuggestions(suggestions) {
    // 这里可以添加实际的优化措施
    // 例如调整学习参数、更新学习策略等
    console.log('应用优化建议:', suggestions);
  }

  // 知识图谱分析
  async analyzeKnowledgeGraph() {
    try {
      console.log('开始分析知识图谱...');
      
      // 构建最新的知识图谱
      const graph = await this.buildKnowledgeGraph();
      if (!graph) {
        return null;
      }

      // 分析图谱结构
      const analysis = {
        nodeCount: graph.nodes.length,
        edgeCount: graph.edges.length,
        density: graph.nodes.length > 0 ? 
          (2 * graph.edges.length) / (graph.nodes.length * (graph.nodes.length - 1)) : 0,
        mostConnectedNodes: [],
        mostCommonPredicates: {}
      };

      // 统计最连接的节点
      const nodeConnections = new Map();
      graph.edges.forEach(edge => {
        nodeConnections.set(edge.source, (nodeConnections.get(edge.source) || 0) + 1);
        nodeConnections.set(edge.target, (nodeConnections.get(edge.target) || 0) + 1);
      });

      analysis.mostConnectedNodes = Array.from(nodeConnections.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([node, count]) => ({ node, count }));

      // 统计最常见的谓词
      graph.edges.forEach(edge => {
        analysis.mostCommonPredicates[edge.label] = 
          (analysis.mostCommonPredicates[edge.label] || 0) + 1;
      });

      console.log('知识图谱分析完成');
      return analysis;
    } catch (error) {
      console.error('分析知识图谱失败:', error.message);
      return null;
    }
  }

  // 智能学习推荐
  async getLearningRecommendations() {
    try {
      console.log('生成学习推荐...');
      
      // 分析知识图谱
      const graphAnalysis = await this.analyzeKnowledgeGraph();
      if (!graphAnalysis) {
        return [];
      }

      // 基于知识图谱分析生成推荐
      const recommendations = [];

      // 推荐连接度高的节点相关内容
      graphAnalysis.mostConnectedNodes.forEach(({ node }) => {
        recommendations.push(`深入学习 ${node} 相关的知识`);
      });

      // 推荐常见谓词相关的学习方向
      const commonPredicates = Object.entries(graphAnalysis.mostCommonPredicates)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([predicate]) => predicate);

      if (commonPredicates.length > 0) {
        recommendations.push(`重点关注 ${commonPredicates.join('、')} 等关系类型`);
      }

      // 基于学习历史的推荐
      if (this.learningHistory.length > 0) {
        const recentLearning = this.learningHistory.slice(-5);
        const recentTopics = new Set();
        
        recentLearning.forEach(item => {
          item.tags.forEach(tag => recentTopics.add(tag));
        });

        if (recentTopics.size > 0) {
          recommendations.push(`继续深入学习 ${Array.from(recentTopics).join('、')} 等主题`);
        }
      }

      console.log('学习推荐生成完成');
      return recommendations;
    } catch (error) {
      console.error('生成学习推荐失败:', error.message);
      return [];
    }
  }

  // 导出学习数据
  async exportLearningData() {
    try {
      console.log('导出学习数据...');
      
      const exportData = {
        learningHistory: this.learningHistory,
        exportTime: new Date().toISOString(),
        version: '1.0.0'
      };

      const exportFile = path.join(this.learningDir, `learning_export_${Date.now()}.json`);
      fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2), 'utf-8');
      
      console.log(`学习数据导出完成，保存到 ${exportFile}`);
      return exportFile;
    } catch (error) {
      console.error('导出学习数据失败:', error.message);
      return null;
    }
  }

  // 导入学习数据
  async importLearningData(filePath) {
    try {
      console.log('导入学习数据...');
      
      if (!fs.existsSync(filePath)) {
        throw new Error('导入文件不存在');
      }

      const importData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (importData.learningHistory && Array.isArray(importData.learningHistory)) {
        // 合并学习历史
        this.learningHistory = [...this.learningHistory, ...importData.learningHistory];
        this._saveLearningHistory();
        
        console.log(`成功导入 ${importData.learningHistory.length} 条学习记录`);
        return true;
      }

      throw new Error('无效的导入数据格式');
    } catch (error) {
      console.error('导入学习数据失败:', error.message);
      return false;
    }
  }
}

const autonomousLearningSystem = new AutonomousLearningSystem();

module.exports = {
  AutonomousLearningSystem,
  autonomousLearningSystem
};