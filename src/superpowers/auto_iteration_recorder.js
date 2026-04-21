/**
 * 自动迭代记录器
 * 监控代码变化，自动检测和记录迭代改进
 */

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { addIteration, getAllIterations } = require('./iteration_manager');
const { storageManager } = require('./storage_manager');
const { taskTracker } = require('./task_tracker');

class AutoIterationRecorder {
  constructor(config = {}) {
    this.config = {
      watchPaths: [
        'src/', 
        'SYSTEM_CHARTER.md', 
        'package.json',
        'plugins/',
        'feishu_app_config.json',
        'github_sync_config.json',
        'hermes_code_locations.json'
      ],
      ignorePaths: ['node_modules/', 'storage/', 'iterations/', '*.log', '*.gz', 'test/', '__tests__/', 'coverage/', 'src/superpowers/iterations/'],
      debounceTime: 5000, // 5秒防抖
      minChanges: 1, // 最小变更数量
      maxChanges: 100, // 最大变更数量
      iterationInterval: 3600000, // 1小时
      autoCommit: true,
      environment: process.env.NODE_ENV || 'development',
      testEnvironmentPatterns: ['test', '__tests__', 'spec', 'specs'],
      enableHealthCheck: true,
      healthCheckInterval: 60000, // 1分钟
      ...config
    };
    
    this.watcher = null;
    this.changeBuffer = [];
    this.changeTimer = null;
    this.lastIterationTime = Date.now();
    this.isRunning = false;
    this.healthCheckInterval = null;
  }
  
  /**
   * 启动自动迭代记录器
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('[AutoIterationRecorder] 自动迭代记录器已经在运行');
      return;
    }
    
    // 更新配置
    this.config = {
      ...this.config,
      ...config
    };
    
    console.log(`[AutoIterationRecorder] 启动自动迭代记录器 (环境: ${this.config.environment})...`);
    
    // 根据环境调整配置
    this._adjustConfigForEnvironment();
    
    // 创建文件监视器
    this.watcher = chokidar.watch(this.config.watchPaths, {
      ignored: this.config.ignorePaths,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      },
      usePolling: this.config.environment === 'test', // 测试环境使用轮询
      interval: 100, // 轮询间隔
      binaryInterval: 300 // 二进制文件轮询间隔
    });
    
    // 监听文件变化
    this.watcher
      .on('add', (filePath) => this._handleFileChange('add', filePath))
      .on('change', (filePath) => this._handleFileChange('change', filePath))
      .on('unlink', (filePath) => this._handleFileChange('delete', filePath))
      .on('error', (error) => console.error('[AutoIterationRecorder] 错误:', error))
      .on('ready', () => console.log('[AutoIterationRecorder] 文件监控就绪'))
      .on('raw', (event, path, details) => {
        if (this.config.environment === 'test') {
          console.log(`[AutoIterationRecorder] 原始事件: ${event} ${path}`);
        }
      });
    
    // 启动定期检查
    this._startPeriodicCheck();
    
    // 启动健康检查
    if (this.config.enableHealthCheck) {
      this._startHealthCheck();
    }
    
    this.isRunning = true;
    console.log('[AutoIterationRecorder] 自动迭代记录器已启动');
  }
  
  /**
   * 停止自动迭代记录器
   */
  stop() {
    if (!this.isRunning) {
      console.log('[AutoIterationRecorder] 自动迭代记录器未运行');
      return;
    }
    
    console.log('[AutoIterationRecorder] 停止自动迭代记录器...');
    
    if (this.watcher) {
      this.watcher.close();
    }
    
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.isRunning = false;
    console.log('[AutoIterationRecorder] 自动迭代记录器已停止');
  }
  
  /**
   * 根据环境调整配置
   */
  _adjustConfigForEnvironment() {
    if (this.config.environment === 'test') {
      console.log('[AutoIterationRecorder] 调整为测试环境配置');
      // 测试环境配置
      this.config.debounceTime = 2000; // 缩短防抖时间
      this.config.minChanges = 2; // 增加最小变更数量
      this.config.ignorePaths = [
        ...this.config.ignorePaths,
        'test/',
        '__tests__/',
        'coverage/',
        '*.test.js',
        '*.spec.js'
      ];
    } else if (this.config.environment === 'production') {
      console.log('[AutoIterationRecorder] 调整为生产环境配置');
      // 生产环境配置
      this.config.debounceTime = 10000; // 延长防抖时间
      this.config.iterationInterval = 7200000; // 2小时
    }
  }
  
  /**
   * 启动健康检查
   */
  _startHealthCheck() {
    this.healthCheckInterval = setInterval(() => {
      this._performHealthCheck();
    }, this.config.healthCheckInterval);
  }
  
  /**
   * 执行健康检查
   */
  _performHealthCheck() {
    const status = this.getStatus();
    console.log('[AutoIterationRecorder] 健康检查:', {
      isRunning: status.isRunning,
      changeBufferLength: status.changeBufferLength,
      timeSinceLastIteration: status.timeSinceLastIteration / 1000 / 60 + ' 分钟'
    });
    
    // 检查监控器状态
    if (this.watcher && !this.watcher.getWatched()) {
      console.warn('[AutoIterationRecorder] 监控器可能未正常工作');
    }
  }
  
  /**
   * 处理文件变化
   */
  _handleFileChange(eventType, filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // 检查是否是测试文件
    if (this._isTestFile(relativePath)) {
      console.log(`[AutoIterationRecorder] 忽略测试文件: ${relativePath}`);
      return;
    }
    
    // 检查是否是临时文件
    if (this._isTemporaryFile(relativePath)) {
      console.log(`[AutoIterationRecorder] 忽略临时文件: ${relativePath}`);
      return;
    }
    
    this.changeBuffer.push({
      type: eventType,
      path: relativePath,
      timestamp: Date.now()
    });
    
    console.log(`[AutoIterationRecorder] 检测到文件变化: ${eventType} ${relativePath}`);
    
    // 防抖处理
    this._debounceIterationCheck();
  }
  
  /**
   * 检查是否是测试文件
   */
  _isTestFile(filePath) {
    const testPatterns = this.config.testEnvironmentPatterns;
    return testPatterns.some(pattern => {
      return filePath.includes(pattern) || 
             filePath.endsWith(`.${pattern}.js`) ||
             filePath.endsWith(`.${pattern}.ts`);
    });
  }
  
  /**
   * 检查是否是临时文件
   */
  _isTemporaryFile(filePath) {
    const tempPatterns = [
      '~$', '.tmp', '.temp', '.swp', '.swo', 
      '.DS_Store', 'Thumbs.db', '.git'
    ];
    return tempPatterns.some(pattern => filePath.includes(pattern));
  }
  
  /**
   * 防抖检查迭代
   */
  _debounceIterationCheck() {
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }
    
    this.changeTimer = setTimeout(() => {
      this._checkForIteration();
    }, this.config.debounceTime);
  }
  
  /**
   * 启动定期检查
   */
  _startPeriodicCheck() {
    setInterval(() => {
      this._checkForIteration();
    }, this.config.iterationInterval);
  }
  
  /**
   * 检查是否需要创建迭代记录
   */
  _checkForIteration() {
    const now = Date.now();
    const timeSinceLastIteration = now - this.lastIterationTime;
    
    // 检查变更数量
    if (this.changeBuffer.length >= this.config.minChanges) {
      console.log(`[AutoIterationRecorder] 检测到 ${this.changeBuffer.length} 个文件变更，创建迭代记录...`);
      this._createIterationRecord();
    }
    // 检查时间间隔
    else if (timeSinceLastIteration >= this.config.iterationInterval) {
      console.log(`[AutoIterationRecorder] 超过 ${this.config.iterationInterval / 1000 / 60} 分钟未创建迭代记录，检查是否有变更...`);
      if (this.changeBuffer.length > 0) {
        this._createIterationRecord();
      }
    }
  }
  
  /**
   * 创建迭代记录
   */
  _createIterationRecord() {
    if (this.changeBuffer.length === 0) {
      return;
    }
    
    // 分析变更
    const analysis = this._analyzeChanges();
    
    // 检查是否有有意义的变更
    const hasMeaningfulChanges = this._hasMeaningfulChanges(analysis);
    if (!hasMeaningfulChanges) {
      console.log('[AutoIterationRecorder] 没有检测到有意义的变更，跳过迭代记录');
      this.changeBuffer = [];
      return;
    }
    
    // 生成迭代记录
    const iteration = this._generateIterationRecord(analysis);
    
    // 保存迭代记录
    const success = addIteration(iteration);
    
    if (success) {
      console.log(`[AutoIterationRecorder] 迭代记录创建成功: ${iteration.title}`);
      this.lastIterationTime = Date.now();
      this.changeBuffer = [];
    } else {
      console.error('[AutoIterationRecorder] 迭代记录创建失败');
    }
  }
  
  /**
   * 检查是否有有意义的变更
   */
  _hasMeaningfulChanges(analysis) {
    // 检查是否有文件变更
    const hasFileChanges = analysis.filesAdded.length > 0 || 
                           analysis.filesModified.length > 0 || 
                           analysis.filesDeleted.length > 0;
    
    // 检查是否有功能变更
    const hasFeatureChanges = analysis.featuresAdded.length > 0 || 
                              analysis.featuresImproved.length > 0 || 
                              analysis.bugFixes.length > 0 || 
                              analysis.performanceChanges.length > 0;
    
    // 在测试环境中，需要更严格的检查
    if (this.config.environment === 'test') {
      return hasFileChanges && hasFeatureChanges;
    }
    
    return hasFileChanges;
  }
  
  /**
   * 分析变更
   */
  _analyzeChanges() {
    const changes = {
      filesAdded: [],
      filesModified: [],
      filesDeleted: [],
      featuresAdded: [],
      featuresImproved: [],
      bugFixes: [],
      performanceChanges: []
    };
    
    this.changeBuffer.forEach(change => {
      const filePath = change.path;
      
      switch (change.type) {
        case 'add':
          changes.filesAdded.push(filePath);
          // 分析新文件内容
          this._analyzeFileContent(filePath, changes);
          break;
        case 'change':
          changes.filesModified.push(filePath);
          // 分析文件变更
          this._analyzeFileChanges(filePath, changes);
          break;
        case 'delete':
          changes.filesDeleted.push(filePath);
          break;
      }
    });
    
    return changes;
  }
  
  /**
   * 分析文件内容
   */
  _analyzeFileContent(filePath, changes) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检测功能添加
      if (content.includes('add') || content.includes('new') || content.includes('create') ||
          content.includes('实现') || content.includes('添加') || content.includes('新增')) {
        changes.featuresAdded.push(`新增功能: ${path.basename(filePath)}`);
      }
      
      // 检测性能优化
      if (content.includes('optimize') || content.includes('performance') || content.includes('speed') ||
          content.includes('优化') || content.includes('性能') || content.includes('速度')) {
        changes.performanceChanges.push(`性能优化: ${path.basename(filePath)}`);
      }
      
      // 检测Bug修复
      if (content.includes('fix') || content.includes('bug') || content.includes('error') ||
          content.includes('修复') || content.includes('错误') || content.includes('问题')) {
        changes.bugFixes.push(`Bug修复: ${path.basename(filePath)}`);
      }
      
      // 检测功能改进
      if (content.includes('improve') || content.includes('enhance') || content.includes('refactor') ||
          content.includes('改进') || content.includes('增强') || content.includes('重构')) {
        changes.featuresImproved.push(`功能改进: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`[AutoIterationRecorder] 分析文件内容失败: ${error.message}`);
    }
  }
  
  /**
   * 分析文件变更
   */
  _analyzeFileChanges(filePath, changes) {
    try {
      // 这里可以实现更复杂的文件变更分析
      // 例如，比较文件的前后版本
      
      // 根据文件类型进行分析
      const fileExt = path.extname(filePath);
      
      if (fileExt === '.js' || fileExt === '.ts') {
        changes.featuresImproved.push(`代码改进: ${path.basename(filePath)}`);
      } else if (fileExt === '.json') {
        changes.featuresImproved.push(`配置更新: ${path.basename(filePath)}`);
      } else if (fileExt === '.md') {
        changes.featuresImproved.push(`文档更新: ${path.basename(filePath)}`);
      } else {
        changes.featuresImproved.push(`文件改进: ${path.basename(filePath)}`);
      }
    } catch (error) {
      console.error(`[AutoIterationRecorder] 分析文件变更失败: ${error.message}`);
    }
  }
  
  /**
   * 生成迭代记录
   */
  _generateIterationRecord(analysis) {
    const filesModified = [...analysis.filesAdded, ...analysis.filesModified, ...analysis.filesDeleted];
    const allChanges = [...analysis.featuresAdded, ...analysis.featuresImproved, ...analysis.bugFixes, ...analysis.performanceChanges];
    
    // 生成版本号
    const versions = getAllIterations().map(i => i.version);
    const newVersion = this._generateVersion(versions, analysis);
    
    // 生成标题
    let title = this._generateTitle(analysis);
    
    // 生成描述
    let description = this._generateDescription(analysis);
    
    // 获取最近的任务记录
    const recentTasks = this._getRecentTasks();
    
    return {
      id: `iteration_${Date.now()}`,
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      title,
      description,
      referenced_systems: ['Lossless Superpower'],
      updates: allChanges.slice(0, 10),
      files_modified: filesModified.slice(0, 20),
      features_added: analysis.featuresAdded,
      features_improved: analysis.featuresImproved,
      performance_changes: analysis.performanceChanges,
      bug_fixes: analysis.bugFixes,
      related_tasks: recentTasks,
      issues: [],
      notes: '自动生成的迭代记录',
      author: 'AutoIterationRecorder',
      status: 'completed'
    };
  }
  
  /**
   * 生成标题
   */
  _generateTitle(analysis) {
    if (analysis.featuresAdded.length > 0) {
      return '功能添加与改进';
    } else if (analysis.bugFixes.length > 0) {
      return 'Bug修复与优化';
    } else if (analysis.performanceChanges.length > 0) {
      return '性能优化';
    } else if (analysis.featuresImproved.length > 0) {
      return '功能改进';
    } else {
      return '代码更新';
    }
  }
  
  /**
   * 生成描述
   */
  _generateDescription(analysis) {
    const parts = [];
    
    if (analysis.featuresAdded.length > 0) {
      parts.push(`新增 ${analysis.featuresAdded.length} 个功能`);
    }
    
    if (analysis.featuresImproved.length > 0) {
      parts.push(`改进 ${analysis.featuresImproved.length} 个功能`);
    }
    
    if (analysis.bugFixes.length > 0) {
      parts.push(`修复 ${analysis.bugFixes.length} 个问题`);
    }
    
    if (analysis.performanceChanges.length > 0) {
      parts.push(`优化 ${analysis.performanceChanges.length} 处性能`);
    }
    
    if (parts.length > 0) {
      return `自动检测到以下变更: ${parts.join('，')}`;
    }
    
    return '自动检测到代码变更';
  }
  
  /**
   * 生成版本号
   */
  _generateVersion(existingVersions, analysis) {
    if (existingVersions.length === 0) {
      return '1.0.0';
    }
    
    // 解析最新版本
    const latestVersion = existingVersions.sort((a, b) => {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal > bVal) return -1;
        if (aVal < bVal) return 1;
      }
      return 0;
    })[0];
    
    // 递增版本号
    const parts = latestVersion.split('.').map(Number);
    
    // 根据变更类型决定版本号递增方式
    if (analysis.featuresAdded.length > 0) {
      // 有新功能，递增次版本号
      parts[1] = (parts[1] || 0) + 1;
      parts[2] = 0;
    } else if (analysis.bugFixes.length > 0 || analysis.performanceChanges.length > 0) {
      // 只有Bug修复或性能优化，递增修订号
      parts[2] = (parts[2] || 0) + 1;
    } else {
      // 其他变更，递增修订号
      parts[2] = (parts[2] || 0) + 1;
    }
    
    return parts.join('.');
  }
  
  /**
   * 获取状态
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      changeBufferLength: this.changeBuffer.length,
      lastIterationTime: this.lastIterationTime,
      timeSinceLastIteration: Date.now() - this.lastIterationTime
    };
  }
  
  /**
   * 手动触发迭代记录
   */
  triggerIteration() {
    this._checkForIteration();
  }
  
  /**
   * 获取最近的任务记录
   */
  _getRecentTasks() {
    try {
      const tasks = taskTracker.listTasks();
      const now = Date.now() / 1000;
      const recentTasks = [];
      
      console.log(`[AutoIterationRecorder] 开始获取最近任务，总任务数: ${tasks.length}`);
      
      // 获取最近1小时内完成的任务
      tasks.forEach(task => {
        if (task.status === 'completed' && task.end_time && (now - task.end_time) <= 3600) {
          recentTasks.push({
            id: task.id,
            name: task.name,
            description: task.description,
            result: task.result,
            end_time: task.end_time,
            duration: task.end_time - task.start_time
          });
        }
      });
      
      console.log(`[AutoIterationRecorder] 找到 ${recentTasks.length} 个最近完成的任务`);
      
      // 按结束时间排序，最近的任务在前
      recentTasks.sort((a, b) => b.end_time - a.end_time);
      
      // 只返回最近的10个任务
      const result = recentTasks.slice(0, 10);
      console.log(`[AutoIterationRecorder] 返回 ${result.length} 个最近的任务`);
      
      return result;
    } catch (error) {
      console.error(`[AutoIterationRecorder] 获取最近任务失败: ${error.message}`);
      return [];
    }
  }
}

// 全局自动迭代记录器实例
const autoIterationRecorder = new AutoIterationRecorder();

// 导出函数
function startAutoIterationRecorder(config = {}) {
  autoIterationRecorder.start(config);
}

function stopAutoIterationRecorder() {
  autoIterationRecorder.stop();
}

function getAutoIterationStatus() {
  return autoIterationRecorder.getStatus();
}

function triggerIteration() {
  autoIterationRecorder.triggerIteration();
}

module.exports = {
  AutoIterationRecorder,
  autoIterationRecorder,
  startAutoIterationRecorder,
  stopAutoIterationRecorder,
  getAutoIterationStatus,
  triggerIteration
};