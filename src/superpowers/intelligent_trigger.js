/**
 * 智能触发系统
 * 在任务完成后自动分析并触发相关技能
 */

// 使用延迟加载避免循环依赖
let taskDrivenDAGKGIteration;
let permanentMemorySystem;
let skillTrigger;

// 在需要时加载模块
function loadModules() {
  if (!taskDrivenDAGKGIteration) {
    taskDrivenDAGKGIteration = require('./task_driven_dag_kg_iteration').taskDrivenDAGKGIteration;
  }
  if (!permanentMemorySystem) {
    permanentMemorySystem = require('./permanent_memory').permanentMemorySystem;
  }
  if (!skillTrigger) {
    skillTrigger = require('./skill_trigger').skillTrigger;
  }
}

const fs = require('fs');
const path = require('path');

// 触发历史存储文件
const TRIGGER_HISTORY_FILE = path.join(__dirname, 'storage', 'trigger_history.json');
// 触发策略存储文件
const TRIGGER_STRATEGY_FILE = path.join(__dirname, 'storage', 'trigger_strategy.json');
// 日志存储文件
const LOG_FILE = path.join(__dirname, 'storage', 'intelligent_trigger.log');

class IntelligentTrigger {
  constructor() {
    this.enabled = true;
    this.triggerHistory = this.loadTriggerHistory();
    this.triggerStrategy = this.loadTriggerStrategy();
    this.minimumImportance = this.triggerStrategy.minimumImportance || 3;
    this.minimumRelevance = this.triggerStrategy.minimumRelevance || 0.15;
    this.minimumConfidence = this.triggerStrategy.minimumConfidence || 0.43;
    this.relevantTaskTypes = [
      'knowledge_extraction',
      'dag_kg_alignment',
      'system_optimization',
      'intelligent_iteration',
      'skill_development',
      'system_improvement',
      'task_management'
    ];
    // 缓存机制
    this.analysisCache = new Map();
    this.taskTypeCache = new Map();
    this.importanceCache = new Map();
    this.relevanceCache = new Map();
    
    // 监控数据
    this.metrics = {
      totalTasks: 0,
      triggeredTasks: 0,
      failedTasks: 0,
      averageAnalysisTime: 0,
      cacheHitRate: 0,
      lastAnalysisTime: null
    };
    
    // 缓存清理间隔（10分钟）
    setInterval(() => this.cleanupCache(), 10 * 60 * 1000);
    
    // 日志清理间隔（24小时）
    setInterval(() => this.cleanupLogs(), 24 * 60 * 60 * 1000);
  }

  /**
   * 加载触发历史
   * @returns {Array} 触发历史
   */
  loadTriggerHistory() {
    try {
      if (fs.existsSync(TRIGGER_HISTORY_FILE)) {
        const data = fs.readFileSync(TRIGGER_HISTORY_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('[IntelligentTrigger] 加载触发历史失败:', error.message);
    }
    return [];
  }

  /**
   * 加载触发策略
   * @returns {Object} 触发策略
   */
  loadTriggerStrategy() {
    try {
      if (fs.existsSync(TRIGGER_STRATEGY_FILE)) {
        const data = fs.readFileSync(TRIGGER_STRATEGY_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('[IntelligentTrigger] 加载触发策略失败:', error.message);
    }
    return {
      minimumImportance: 3,
      minimumRelevance: 0.15,
      minimumConfidence: 0.43,
      keywordWeights: {
        'knowledge_extraction': 1.2,
        'dag_kg_alignment': 1.1,
        'system_optimization': 1.0,
        'intelligent_iteration': 1.0,
        'skill_development': 1.0,
        'task_management': 0.9
      }
    };
  }

  /**
   * 保存触发策略
   */
  saveTriggerStrategy() {
    try {
      // 确保存储目录存在
      const storageDir = path.dirname(TRIGGER_STRATEGY_FILE);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      
      fs.writeFileSync(TRIGGER_STRATEGY_FILE, JSON.stringify(this.triggerStrategy, null, 2));
    } catch (error) {
      console.error('[IntelligentTrigger] 保存触发策略失败:', error.message);
    }
  }

  /**
   * 清理缓存
   */
  cleanupCache() {
    const now = Date.now();
    const cacheSizeBefore = this.analysisCache.size + this.taskTypeCache.size + this.importanceCache.size + this.relevanceCache.size;
    
    // 清理分析缓存
    for (const [key, value] of this.analysisCache.entries()) {
      if (now - value.timestamp > 5 * 60 * 1000) { // 5分钟过期
        this.analysisCache.delete(key);
      }
    }
    
    // 清理任务类型缓存
    for (const [key, value] of this.taskTypeCache.entries()) {
      if (now - value.timestamp > 10 * 60 * 1000) { // 10分钟过期
        this.taskTypeCache.delete(key);
      }
    }
    
    // 清理重要性缓存
    for (const [key, value] of this.importanceCache.entries()) {
      if (now - value.timestamp > 10 * 60 * 1000) { // 10分钟过期
        this.importanceCache.delete(key);
      }
    }
    
    // 清理相关性缓存
    for (const [key, value] of this.relevanceCache.entries()) {
      if (now - value.timestamp > 10 * 60 * 1000) { // 10分钟过期
        this.relevanceCache.delete(key);
      }
    }
    
    const cacheSizeAfter = this.analysisCache.size + this.taskTypeCache.size + this.importanceCache.size + this.relevanceCache.size;
    this.log(`缓存清理完成: ${cacheSizeBefore} → ${cacheSizeAfter}`, 'info');
  }

  /**
   * 记录日志
   * @param {string} message - 日志消息
   * @param {string} level - 日志级别
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level.toUpperCase()}] [IntelligentTrigger] ${message}\n`;
    
    // 控制台输出
    console.log(`${timestamp} [${level.toUpperCase()}] [IntelligentTrigger] ${message}`);
    
    // 文件存储
    try {
      // 确保存储目录存在
      const storageDir = path.dirname(LOG_FILE);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      
      fs.appendFileSync(LOG_FILE, logEntry);
    } catch (error) {
      console.error('[IntelligentTrigger] 写入日志失败:', error.message);
    }
  }

  /**
   * 清理旧日志
   */
  cleanupLogs() {
    try {
      if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        const fileSize = stats.size;
        
        // 如果日志文件超过10MB，清理
        if (fileSize > 10 * 1024 * 1024) {
          const backupFile = path.join(path.dirname(LOG_FILE), `intelligent_trigger_${Date.now()}.log`);
          fs.renameSync(LOG_FILE, backupFile);
          fs.writeFileSync(LOG_FILE, '');
          this.log(`日志文件已清理，备份到: ${backupFile}`, 'info');
        }
      }
    } catch (error) {
      console.error('[IntelligentTrigger] 清理日志失败:', error.message);
    }
  }

  /**
   * 更新监控数据
   * @param {Object} data - 监控数据
   */
  updateMetrics(data) {
    if (data.totalTasks) {
      this.metrics.totalTasks += data.totalTasks;
    }
    
    if (data.triggeredTasks) {
      this.metrics.triggeredTasks += data.triggeredTasks;
    }
    
    if (data.failedTasks) {
      this.metrics.failedTasks += data.failedTasks;
    }
    
    if (data.analysisTime) {
      // 计算平均分析时间
      const newTime = data.analysisTime;
      const oldAverage = this.metrics.averageAnalysisTime;
      const count = this.metrics.totalTasks;
      this.metrics.averageAnalysisTime = count > 0 ? 
        (oldAverage * (count - 1) + newTime) / count : 
        newTime;
    }
    
    if (data.cacheHit) {
      // 计算缓存命中率
      const totalRequests = this.metrics.totalTasks;
      const cacheHits = this.metrics.triggeredTasks; // 简化计算，实际应该统计缓存命中次数
      this.metrics.cacheHitRate = totalRequests > 0 ? 
        (cacheHits / totalRequests) * 100 : 
        0;
    }
    
    this.metrics.lastAnalysisTime = new Date().toISOString();
  }

  /**
   * 获取监控数据
   * @returns {Object} 监控数据
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheSizes: {
        analysis: this.analysisCache.size,
        taskType: this.taskTypeCache.size,
        importance: this.importanceCache.size,
        relevance: this.relevanceCache.size
      },
      strategy: {
        minimumImportance: this.minimumImportance,
        minimumRelevance: this.minimumRelevance,
        minimumConfidence: this.minimumConfidence
      }
    };
  }

  /**
   * 保存触发历史
   */
  saveTriggerHistory() {
    try {
      // 确保存储目录存在
      const storageDir = path.dirname(TRIGGER_HISTORY_FILE);
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      
      fs.writeFileSync(TRIGGER_HISTORY_FILE, JSON.stringify(this.triggerHistory, null, 2));
    } catch (error) {
      console.error('[IntelligentTrigger] 保存触发历史失败:', error.message);
    }
  }

  /**
   * 智能分析任务完成结果并决定是否触发任务驱动的DAG-KG技能
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @param {Object} options - 选项
   */
  async analyzeTaskCompletion(taskInfo, taskResult, options = {}) {
    if (!this.enabled) return;

    const startTime = Date.now();
    let cacheHit = false;

    try {
      // 输入验证
      if (!this.validateTaskInfo(taskInfo)) {
        this.log('任务信息验证失败', 'error');
        this.updateMetrics({ totalTasks: 1, failedTasks: 1 });
        return;
      }

      const taskName = taskInfo.name || taskInfo.taskName || '未知任务';
      this.log(`开始分析任务: ${taskName}`, 'info');

      // 生成缓存键
      const cacheKey = `${taskInfo.id || taskInfo.name || 'unknown'}_${JSON.stringify(taskResult)}`;
      
      // 检查缓存
      let analysis;
      if (this.analysisCache.has(cacheKey)) {
        analysis = this.analysisCache.get(cacheKey);
        this.log(`从缓存中获取分析结果: ${taskName}`, 'info');
        cacheHit = true;
      } else {
        analysis = this.analyzeTask(taskInfo, taskResult);
        // 缓存分析结果，有效期5分钟
        this.analysisCache.set(cacheKey, {
          ...analysis,
          timestamp: Date.now()
        });
        setTimeout(() => {
          this.analysisCache.delete(cacheKey);
        }, 5 * 60 * 1000);
      }
      
      if (analysis.shouldTrigger) {
        this.log(`触发技能: ${analysis.recommendedAction}，任务: ${taskName}`, 'info');
        await this.triggerDAGKGSkill(analysis, taskInfo, taskResult);
        this.updateMetrics({ triggeredTasks: 1 });
      } else {
        this.log(`不触发技能，原因: ${analysis.triggerReason}，任务: ${taskName}`, 'info');
      }

      this.recordTriggerHistory(analysis, taskInfo);
      
      // 调整触发策略
      this.adjustTriggerStrategy(analysis, taskInfo);

      const analysisTime = Date.now() - startTime;
      this.log(`任务分析完成，耗时: ${analysisTime}ms，任务: ${taskName}`, 'info');
      
      // 更新监控数据
      this.updateMetrics({
        totalTasks: 1,
        analysisTime: analysisTime,
        cacheHit: cacheHit
      });
    } catch (error) {
      this.log(`分析任务完成失败: ${error.message}`, 'error');
      this.updateMetrics({ totalTasks: 1, failedTasks: 1 });
    }
  }

  /**
   * 验证任务信息
   * @param {Object} taskInfo - 任务信息
   * @returns {boolean} 是否有效
   */
  validateTaskInfo(taskInfo) {
    if (!taskInfo || typeof taskInfo !== 'object') {
      return false;
    }

    // 检查必要字段
    if (!taskInfo.name && !taskInfo.taskName) {
      return false;
    }

    // 检查字段类型
    if (taskInfo.id && typeof taskInfo.id !== 'string') {
      return false;
    }

    if (taskInfo.name && typeof taskInfo.name !== 'string') {
      return false;
    }

    if (taskInfo.taskName && typeof taskInfo.taskName !== 'string') {
      return false;
    }

    if (taskInfo.description && typeof taskInfo.description !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * 验证外部事件
   * @param {Object} event - 外部事件
   * @returns {boolean} 是否有效
   */
  validateExternalEvent(event) {
    if (!event || typeof event !== 'object') {
      return false;
    }

    if (!event.type || typeof event.type !== 'string') {
      return false;
    }

    if (!event.data) {
      return false;
    }

    return true;
  }

  /**
   * 分析任务信息，决定是否应该触发DAG-KG技能
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {Object} 分析结果
   */
  analyzeTask(taskInfo, taskResult) {
    const analysis = {
      shouldTrigger: false,
      triggerReason: '',
      confidence: 0,
      recommendedAction: null,
      taskType: null
    };

    const taskName = taskInfo.name || taskInfo.taskName || '';
    const taskDescription = taskInfo.description || '';

    // 检查任务类型相关性
    const taskType = this.extractTaskType(taskInfo);
    analysis.taskType = taskType;
    const isRelevant = this.relevantTaskTypes.includes(taskType);

    if (!isRelevant) {
      analysis.confidence = 0.1;
      analysis.triggerReason = '任务类型不相关';
      return analysis;
    }

    // 分析任务重要性
    const importance = this.calculateTaskImportance(taskInfo, taskResult);
    
    if (importance < this.minimumImportance) {
      analysis.confidence = 0.2;
      analysis.triggerReason = '任务重要性不足';
      return analysis;
    }

    // 分析任务内容相关性
    const contentRelevance = this.analyzeContentRelevance(taskInfo);
    
    if (contentRelevance < this.minimumRelevance) {
      analysis.confidence = 0.3;
      analysis.triggerReason = '内容相关性不足';
      return analysis;
    }

    // 基于任务类型推荐操作
    analysis.recommendedAction = this.recommendAction(taskType, taskInfo);
    
    // 计算置信度
    analysis.confidence = this.calculateConfidence(importance, contentRelevance, taskType);
    
    // 检查置信度阈值
    if (analysis.confidence >= this.minimumConfidence) {
      analysis.shouldTrigger = true;
      analysis.triggerReason = '智能分析认为需要触发DAG-KG技能';
    } else {
      analysis.triggerReason = '置信度不足';
    }

    return analysis;
  }

  /**
   * 提取任务类型
   * @param {Object} taskInfo - 任务信息
   * @returns {string} 任务类型
   */
  extractTaskType(taskInfo) {
    const taskName = taskInfo.name || taskInfo.taskName || '';
    const taskDescription = taskInfo.description || '';
    const cacheKey = taskName + '|' + taskDescription;

    // 检查缓存
    if (this.taskTypeCache.has(cacheKey)) {
      const cached = this.taskTypeCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10分钟内有效
        return cached.value;
      }
    }

    const keywords = {
      'knowledge_extraction': ['提取', '知识', '信息', '数据', '采集'],
      'dag_kg_alignment': ['对齐', 'DAG', '知识图谱', '图结构', '节点'],
      'system_optimization': ['优化', '性能', '效率', '速度', '资源'],
      'intelligent_iteration': ['迭代', '更新', '改进', '升级', '版本'],
      'skill_development': ['技能', '开发', '创建', '构建', '实现'],
      'task_management': ['任务', '记录', '管理', '执行', '完成']
    };

    const taskContent = (taskName + ' ' + taskDescription).toLowerCase();

    // 计算每种任务类型的匹配分数
    let bestType = 'general';
    let bestScore = 0;

    for (const [type, keywordList] of Object.entries(keywords)) {
      let score = 0;
      keywordList.forEach(keyword => {
        if (taskContent.includes(keyword)) {
          score += 1;
        }
      });

      // 应用任务类型权重
      const weight = this.triggerStrategy.keywordWeights[type] || 1.0;
      score *= weight;

      if (score > bestScore) {
        bestScore = score;
        bestType = type;
      }
    }

    // 缓存结果
    this.taskTypeCache.set(cacheKey, {
      value: bestType,
      timestamp: Date.now()
    });

    return bestType;
  }

  /**
   * 计算任务重要性
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {number} 重要性分数 (1-5)
   */
  calculateTaskImportance(taskInfo, taskResult) {
    const taskName = taskInfo.name || taskInfo.taskName || '';
    const taskDescription = taskInfo.description || '';
    const resultKey = taskResult ? JSON.stringify(taskResult) : 'null';
    const cacheKey = taskName + '|' + taskDescription + '|' + resultKey;

    // 检查缓存
    if (this.importanceCache.has(cacheKey)) {
      const cached = this.importanceCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10分钟内有效
        return cached.value;
      }
    }

    let importance = 3;

    // 基于任务名称和描述的重要性
    const importantKeywords = ['重要', '关键', '核心', '基础', '系统'];
    importantKeywords.forEach(keyword => {
      if (taskName.toLowerCase().includes(keyword) ||
          taskDescription.toLowerCase().includes(keyword)) {
        importance += 0.5;
      }
    });

    // 基于任务结果的重要性
    if (taskResult && typeof taskResult === 'object') {
      if (taskResult.success === true) {
        importance += 0.5;
      }
      if (taskResult.impact && taskResult.impact > 0.7) {
        importance += 1;
      }
    }

    const finalImportance = Math.min(importance, 5);

    // 缓存结果
    this.importanceCache.set(cacheKey, {
      value: finalImportance,
      timestamp: Date.now()
    });

    return finalImportance;
  }

  /**
   * 分析内容相关性
   * @param {Object} taskInfo - 任务信息
   * @returns {number} 相关性分数 (0-1)
   */
  analyzeContentRelevance(taskInfo) {
    const taskName = taskInfo.name || taskInfo.taskName || '';
    const taskDescription = taskInfo.description || '';
    const cacheKey = taskName + '|' + taskDescription;

    // 检查缓存
    if (this.relevanceCache.has(cacheKey)) {
      const cached = this.relevanceCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) { // 10分钟内有效
        return cached.value;
      }
    }

    // 根据任务类型使用不同的关键词
    let relevantKeywords = [
      'DAG', '知识图谱', '提取', '对齐', '同步', '迭代',
      '技能', '系统', '优化', '智能', '记忆'
    ];

    // 对于任务管理类型的任务，添加任务相关的关键词
    const taskType = this.extractTaskType(taskInfo);
    if (taskType === 'task_management') {
      relevantKeywords = [
        '任务', '记录', '管理', '执行', '完成', '跟踪',
        '计划', '分配', '进度', '状态', '报告'
      ];
    }

    let relevanceScore = 0;
    relevantKeywords.forEach(keyword => {
      if (taskName.toLowerCase().includes(keyword) ||
          taskDescription.toLowerCase().includes(keyword)) {
        relevanceScore += 1 / relevantKeywords.length;
      }
    });

    // 对于任务管理类型的任务，如果相关性分数较低，给予默认分数
    if (taskType === 'task_management' && relevanceScore < 0.15) {
      relevanceScore = 0.2; // 确保任务管理任务能够被触发
    }

    // 缓存结果
    this.relevanceCache.set(cacheKey, {
      value: relevanceScore,
      timestamp: Date.now()
    });

    return relevanceScore;
  }

  /**
   * 推荐操作
   * @param {string} taskType - 任务类型
   * @param {Object} taskInfo - 任务信息
   * @returns {string} 推荐的操作
   */
  recommendAction(taskType, taskInfo) {
    const actionMapping = {
      'knowledge_extraction': 'extract_knowledge',
      'dag_kg_alignment': 'align_dag_kg',
      'system_optimization': 'full_iteration',
      'intelligent_iteration': 'full_iteration',
      'skill_development': 'full_iteration',
      'task_management': 'record_task'
    };

    return actionMapping[taskType] || 'full_iteration';
  }

  /**
   * 计算触发置信度
   * @param {number} importance - 重要性
   * @param {number} relevance - 相关性
   * @param {string} taskType - 任务类型
   * @returns {number} 置信度 (0-1)
   */
  calculateConfidence(importance, relevance, taskType) {
    // 应用任务类型权重
    const weight = this.triggerStrategy.keywordWeights[taskType] || 1.0;
    const baseConfidence = (importance / 5) * 0.6 + relevance * 0.4;
    return Math.min(baseConfidence * weight, 1.0);
  }

  /**
   * 调整触发策略
   * @param {Object} analysis - 分析结果
   * @param {Object} taskInfo - 任务信息
   */
  adjustTriggerStrategy(analysis, taskInfo) {
    // 基于最近的触发历史调整策略
    const recentHistory = this.triggerHistory.slice(-20);
    if (recentHistory.length < 10) return;

    // 计算整体成功触发的比例
    const successCount = recentHistory.filter(entry => entry.shouldTrigger).length;
    const successRate = successCount / recentHistory.length;

    // 按任务类型分析成功率
    const taskTypeStats = {};
    recentHistory.forEach(entry => {
      if (!taskTypeStats[entry.taskType]) {
        taskTypeStats[entry.taskType] = { total: 0, success: 0 };
      }
      taskTypeStats[entry.taskType].total++;
      if (entry.shouldTrigger) {
        taskTypeStats[entry.taskType].success++;
      }
    });

    // 计算平均置信度
    const averageConfidence = recentHistory.reduce((sum, entry) => sum + entry.confidence, 0) / recentHistory.length;

    // 根据整体成功率调整基础阈值
    if (successRate > 0.8) {
      // 成功率高，降低阈值以增加触发频率
      this.minimumConfidence = Math.max(0.3, this.minimumConfidence - 0.03);
      this.minimumRelevance = Math.max(0.1, this.minimumRelevance - 0.01);
    } else if (successRate < 0.4) {
      // 成功率低，提高阈值以减少误触发
      this.minimumConfidence = Math.min(0.6, this.minimumConfidence + 0.03);
      this.minimumRelevance = Math.min(0.25, this.minimumRelevance + 0.01);
    }

    // 根据任务类型调整权重
    for (const [taskType, stats] of Object.entries(taskTypeStats)) {
      if (stats.total >= 3) {
        const typeSuccessRate = stats.success / stats.total;
        const currentWeight = this.triggerStrategy.keywordWeights[taskType] || 1.0;
        
        if (typeSuccessRate > 0.8 && currentWeight < 1.5) {
          // 该任务类型成功率高，增加权重
          this.triggerStrategy.keywordWeights[taskType] = Math.min(1.5, currentWeight + 0.1);
        } else if (typeSuccessRate < 0.4 && currentWeight > 0.5) {
          // 该任务类型成功率低，降低权重
          this.triggerStrategy.keywordWeights[taskType] = Math.max(0.5, currentWeight - 0.1);
        }
      }
    }

    // 根据平均置信度调整重要性阈值
    if (averageConfidence > 0.7) {
      // 平均置信度高，降低重要性阈值
      this.minimumImportance = Math.max(2, this.minimumImportance - 0.5);
    } else if (averageConfidence < 0.4) {
      // 平均置信度低，提高重要性阈值
      this.minimumImportance = Math.min(4, this.minimumImportance + 0.5);
    }

    // 更新触发策略
    this.triggerStrategy.minimumConfidence = this.minimumConfidence;
    this.triggerStrategy.minimumRelevance = this.minimumRelevance;
    this.triggerStrategy.minimumImportance = this.minimumImportance;
    
    // 保存策略
    this.saveTriggerStrategy();
    
    console.log('[IntelligentTrigger] 已调整触发策略:', {
      minimumConfidence: this.minimumConfidence,
      minimumRelevance: this.minimumRelevance,
      minimumImportance: this.minimumImportance,
      successRate: successRate,
      averageConfidence: averageConfidence,
      taskTypeStats: taskTypeStats
    });
  }

  /**
   * 触发技能
   * @param {Object} analysis - 分析结果
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   */
  async triggerDAGKGSkill(analysis, taskInfo, taskResult) {
    try {
      // 加载模块
      loadModules();
      
      // 触发推荐的操作
      const action = analysis.recommendedAction;
      
      let skillInfo, result;
      
      // 技能映射
      const skillMapping = {
        'record_task': {
          skillName: 'task_recorder',
          handler: async () => {
            const { run } = require('./skills/task_recorder');
            return await run(taskInfo, taskResult);
          }
        },
        'extract_knowledge': {
          skillName: 'task_driven_dag_kg',
          handler: async () => {
            // 检查任务驱动系统是否已启动
            if (!taskDrivenDAGKGIteration.running) {
              await taskDrivenDAGKGIteration.start();
              console.log('[IntelligentTrigger] 已启动任务驱动的DAG-KG系统');
            }
            
            const skillInfo = {
              skillName: 'task_driven_dag_kg',
              params: {
                action: action,
                taskInfo: taskInfo,
                taskResult: taskResult,
                analysis: analysis
              }
            };
            
            return await skillTrigger.triggerSkill(skillInfo);
          }
        },
        'align_dag_kg': {
          skillName: 'task_driven_dag_kg',
          handler: async () => {
            // 检查任务驱动系统是否已启动
            if (!taskDrivenDAGKGIteration.running) {
              await taskDrivenDAGKGIteration.start();
              console.log('[IntelligentTrigger] 已启动任务驱动的DAG-KG系统');
            }
            
            const skillInfo = {
              skillName: 'task_driven_dag_kg',
              params: {
                action: action,
                taskInfo: taskInfo,
                taskResult: taskResult,
                analysis: analysis
              }
            };
            
            return await skillTrigger.triggerSkill(skillInfo);
          }
        },
        'full_iteration': {
          skillName: 'task_driven_dag_kg',
          handler: async () => {
            // 检查任务驱动系统是否已启动
            if (!taskDrivenDAGKGIteration.running) {
              await taskDrivenDAGKGIteration.start();
              console.log('[IntelligentTrigger] 已启动任务驱动的DAG-KG系统');
            }
            
            const skillInfo = {
              skillName: 'task_driven_dag_kg',
              params: {
                action: action,
                taskInfo: taskInfo,
                taskResult: taskResult,
                analysis: analysis
              }
            };
            
            return await skillTrigger.triggerSkill(skillInfo);
          }
        }
      };
      
      // 触发相应的技能
      if (skillMapping[action]) {
        const skillConfig = skillMapping[action];
        try {
          result = await skillConfig.handler();
          console.log(`[IntelligentTrigger] 已触发${skillConfig.skillName}技能 (${action}):`, result);
        } catch (error) {
          console.error(`[IntelligentTrigger] 触发${skillConfig.skillName}技能失败:`, error.message);
          result = `触发${skillConfig.skillName}技能失败: ${error.message}`;
        }
      } else {
        // 默认触发任务驱动的DAG-KG技能
        if (!taskDrivenDAGKGIteration.running) {
          await taskDrivenDAGKGIteration.start();
          console.log('[IntelligentTrigger] 已启动任务驱动的DAG-KG系统');
        }
        
        skillInfo = {
          skillName: 'task_driven_dag_kg',
          params: {
            action: action,
            taskInfo: taskInfo,
            taskResult: taskResult,
            analysis: analysis
          }
        };
        
        result = await skillTrigger.triggerSkill(skillInfo);
        console.log(`[IntelligentTrigger] 已触发DAG-KG技能 (${action}):`, result);
      }

      // 记录到永久记忆
      await permanentMemorySystem.addMemory(
        `智能触发技能: ${action}\n任务: ${taskInfo.taskName || taskInfo.name}\n置信度: ${(analysis.confidence * 100).toFixed(1)}%\n结果: ${result}`,
        'intelligent_trigger',
        4,
        'intelligent,trigger,auto',
        {
          taskId: taskInfo.id,
          taskName: taskInfo.taskName || taskInfo.name,
          action: action,
          confidence: analysis.confidence,
          result: result,
          timestamp: Date.now()
        }
      );

    } catch (error) {
      console.error('[IntelligentTrigger] 触发技能失败:', error.message);
    }
  }

  /**
   * 记录触发历史
   * @param {Object} analysis - 分析结果
   * @param {Object} taskInfo - 任务信息
   */
  recordTriggerHistory(analysis, taskInfo) {
    const historyEntry = {
      timestamp: Date.now(),
      taskId: taskInfo.id,
      taskName: taskInfo.taskName || taskInfo.name || '未知任务',
      taskType: analysis.taskType || 'general',
      shouldTrigger: analysis.shouldTrigger,
      confidence: analysis.confidence,
      triggerReason: analysis.triggerReason,
      recommendedAction: analysis.recommendedAction
    };

    this.triggerHistory.push(historyEntry);
    
    // 保持历史记录在合理范围内
    if (this.triggerHistory.length > 100) {
      this.triggerHistory.shift();
    }

    // 保存触发历史到文件
    this.saveTriggerHistory();
  }

  /**
   * 获取触发历史
   * @param {number} limit - 限制数量
   * @returns {Array} 触发历史
   */
  getTriggerHistory(limit = 20) {
    return this.triggerHistory.slice(-limit);
  }

  /**
   * 启用智能触发
   */
  enable() {
    this.enabled = true;
    console.log('[IntelligentTrigger] 智能触发已启用');
  }

  /**
   * 禁用智能触发
   */
  disable() {
    this.enabled = false;
    console.log('[IntelligentTrigger] 智能触发已禁用');
  }

  /**
   * 切换智能触发状态
   * @returns {boolean} 切换后的状态
   */
  toggle() {
    this.enabled = !this.enabled;
    console.log(`[IntelligentTrigger] 智能触发已${this.enabled ? '启用' : '禁用'}`);
    return this.enabled;
  }

  /**
   * 获取智能触发状态
   * @returns {Object} 状态信息
   */
  getStatus() {
    const successCount = this.triggerHistory.filter(entry => entry.shouldTrigger).length;
    const lastTrigger = this.triggerHistory.length > 0 ? 
      new Date(this.triggerHistory[this.triggerHistory.length - 1].timestamp).toLocaleString() : 
      null;
      
    return {
      count: this.triggerHistory.length,
      success: successCount,
      last: lastTrigger,
      enabled: this.enabled,
      history: this.getTriggerHistory(10)
    };
  }

  /**
   * 处理外部事件
   * @param {Object} event - 外部事件信息
   * @returns {Object} 处理结果
   */
  async handleExternalEvent(event) {
    try {
      console.log('[IntelligentTrigger] 接收到外部事件:', event);

      // 验证事件格式
      if (!this.validateExternalEvent(event)) {
        return {
          success: false,
          message: '事件格式无效，缺少type或data字段'
        };
      }

      // 权限控制：检查事件来源是否被允许
      if (!this.isAllowedSource(event.source)) {
        return {
          success: false,
          message: '事件来源不被允许'
        };
      }

      // 转换外部事件为任务信息
      const taskInfo = {
        id: `external_${Date.now()}`,
        name: event.name || `外部事件: ${event.type}`,
        description: event.description || `来自外部系统的${event.type}事件`,
        external: true,
        source: event.source || 'unknown'
      };

      const taskResult = {
        success: true,
        data: event.data,
        impact: event.impact || 0.5
      };

      // 分析事件
      const analysis = this.analyzeTask(taskInfo, taskResult);

      // 触发技能
      if (analysis.shouldTrigger) {
        await this.triggerDAGKGSkill(analysis, taskInfo, taskResult);
      }

      // 记录触发历史
      this.recordTriggerHistory(analysis, taskInfo);

      // 调整触发策略
      this.adjustTriggerStrategy(analysis, taskInfo);

      return {
        success: true,
        message: '外部事件处理成功',
        analysis: analysis
      };
    } catch (error) {
      console.error('[IntelligentTrigger] 处理外部事件失败:', error.message);
      return {
        success: false,
        message: `处理外部事件失败: ${error.message}`
      };
    }
  }

  /**
   * 检查事件来源是否被允许
   * @param {string} source - 事件来源
   * @returns {boolean} 是否被允许
   */
  isAllowedSource(source) {
    // 允许的来源列表
    const allowedSources = [
      'system',
      'api',
      'external',
      'unknown'
    ];

    return allowedSources.includes(source || 'unknown');
  }
}

const intelligentTrigger = new IntelligentTrigger();

module.exports = {
  IntelligentTrigger,
  intelligentTrigger
};