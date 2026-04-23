/**
 * 全局自动记录系统
 * 监控文件变更和对话，自动记录到任务追踪系统
 */

const fs = require('fs');
const path = require('path');
const { taskTracker } = require('./task_tracker');
const { permanentMemorySystem } = require('./permanent_memory');

class ComprehensiveAutoRecorder {
  constructor() {
    this.isInitialized = false;
    this.sessionId = null;
    this.fileChanges = new Map();
    this.lastSessionFiles = new Map();
    this.watchedDirectories = [
      './src/superpowers',
      './src/superpowers/skills'
    ];
    this.pollInterval = 5000;
    this.pollTimer = null;
    this.knownFiles = new Map();
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await permanentMemorySystem.init();

      this.sessionId = `auto_record_session_${Date.now()}`;
      taskTracker.startTask(
        this.sessionId,
        '自动记录会话',
        '全局自动任务记录会话',
        { type: 'auto_record_session' }
      );

      this.scanCurrentFiles();
      this.startFilePolling();
      this.isInitialized = true;
      console.log('[ComprehensiveAutoRecorder] 全局自动记录系统已初始化');
    } catch (error) {
      console.error('[ComprehensiveAutoRecorder] 初始化失败:', error.message);
    }
  }

  scanCurrentFiles() {
    this.watchedDirectories.forEach(dir => {
      this.scanDirectory(dir);
    });
    console.log(`[ComprehensiveAutoRecorder] 已扫描 ${this.lastSessionFiles.size} 个文件`);
  }

  scanDirectory(dirPath) {
    try {
      const fullPath = path.resolve(dirPath);
      if (!fs.existsSync(fullPath)) return;

      const files = fs.readdirSync(fullPath, { withFileTypes: true });
      files.forEach(file => {
        const filePath = path.join(fullPath, file.name);
        if (file.isFile()) {
          const stats = fs.statSync(filePath);
          this.lastSessionFiles.set(filePath, {
            mtime: stats.mtime.getTime(),
            size: stats.size,
            content: this.getFilePreview(filePath)
          });
        } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
          this.scanDirectory(filePath);
        }
      });
    } catch (error) {
      // 忽略错误
    }
  }

  getFilePreview(filePath, maxLength = 100) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.substring(0, maxLength);
    } catch (error) {
      return '';
    }
  }

  startFilePolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }

    this.pollTimer = setInterval(() => {
      this.pollForChanges();
    }, this.pollInterval);

    console.log(`[ComprehensiveAutoRecorder] 开始轮询监控文件变化 (间隔: ${this.pollInterval}ms)`);
  }

  pollForChanges() {
    const newFiles = [];
    const modifiedFiles = [];
    const deletedFiles = [];

    this.watchedDirectories.forEach(dir => {
      this.checkDirectoryChanges(dir, newFiles, modifiedFiles, deletedFiles);
    });

    newFiles.forEach(file => this.recordFileChange(file, 'created'));
    modifiedFiles.forEach(file => this.recordFileChange(file, 'modified'));

    if (newFiles.length > 0 || modifiedFiles.length > 0) {
      console.log(`[ComprehensiveAutoRecorder] 检测到 ${newFiles.length} 个新文件, ${modifiedFiles.length} 个修改文件`);
    }
  }

  checkDirectoryChanges(dirPath, newFiles, modifiedFiles, deletedFiles) {
    try {
      const fullPath = path.resolve(dirPath);
      if (!fs.existsSync(fullPath)) return;

      const files = fs.readdirSync(fullPath, { withFileTypes: true });
      files.forEach(file => {
        const filePath = path.join(fullPath, file.name);

        if (file.isFile()) {
          const stats = fs.statSync(filePath);
          const lastState = this.lastSessionFiles.get(filePath);

          if (!lastState) {
            newFiles.push(filePath);
          } else if (stats.mtime.getTime() > lastState.mtime) {
            modifiedFiles.push(filePath);
          }

          this.lastSessionFiles.set(filePath, {
            mtime: stats.mtime.getTime(),
            size: stats.size,
            content: this.getFilePreview(filePath)
          });
        } else if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
          this.checkDirectoryChanges(filePath, newFiles, modifiedFiles, deletedFiles);
        }
      });
    } catch (error) {
      // 忽略错误
    }
  }

  recordFileChange(filePath, changeType, stats = null) {
    if (!stats) {
      try {
        stats = fs.statSync(filePath);
      } catch (error) {
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    if (!this.isRelevantFile(ext, fileName)) {
      return;
    }

    const taskId = `file_${changeType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let description = '';
    let taskName = '';

    switch (changeType) {
      case 'created':
        taskName = `创建文件: ${fileName}`;
        description = `创建新文件: ${filePath}`;
        break;
      case 'modified':
        taskName = `修改文件: ${fileName}`;
        description = `修改文件: ${filePath}`;
        break;
      case 'deleted':
        taskName = `删除文件: ${fileName}`;
        description = `删除文件: ${filePath}`;
        break;
    }

    taskTracker.startTask(
      taskId,
      taskName,
      description,
      {
        type: 'file_operation',
        operation: changeType,
        filePath: filePath,
        fileName: fileName,
        extension: ext,
        size: stats ? stats.size : 0
      }
    );

    taskTracker.completeTask(
      taskId,
      `${taskName} (${stats ? stats.size + ' bytes' : 'N/A'})`
    );

    console.log(`[ComprehensiveAutoRecorder] 已记录: ${taskName}`);
  }

  isRelevantFile(ext, fileName) {
    const relevantExtensions = ['.js', '.json', '.md'];
    const relevantNames = ['skill', 'dag', 'kg', 'knowledge', 'iteration', 'task', 'superpower', 'recorder', 'intelligent'];

    if (relevantExtensions.includes(ext)) {
      const lowerName = fileName.toLowerCase();
      return relevantNames.some(name => lowerName.includes(name)) ||
             lowerName.includes('superpower');
    }

    return false;
  }

  async recordConversationTasks(conversationHistory) {
    const taskId = `conversation_task_${Date.now()}`;

    taskTracker.startTask(
      taskId,
      '对话任务记录',
      '自动记录对话中的任务',
      { type: 'conversation' }
    );

    const tasks = this.extractTasksFromConversation(conversationHistory);

    for (const task of tasks) {
      this.recordExtractedTask(task);
    }

    taskTracker.completeTask(
      taskId,
      `从对话中提取并记录了 ${tasks.length} 个任务`
    );

    return tasks.length;
  }

  extractTasksFromConversation(conversationHistory) {
    const tasks = [];
    const taskPatterns = [
      /创建.*?技能/is,
      /实现.*?功能/is,
      /修改.*?模块/is,
      /添加.*?支持/is,
      /优化.*?性能/is,
      /修复.*?问题/is,
      /完善.*?系统/is,
      /迭代.*?DAG/is,
      /实现.*?迭代/is,
      /创建.*?文件/is,
      /包装.*?技能/is
    ];

    conversationHistory.forEach(msg => {
      if (msg.role === 'assistant') {
        taskPatterns.forEach(pattern => {
          const match = msg.content.match(pattern);
          if (match) {
            tasks.push({
              name: match[0],
              content: msg.content.substring(0, 200),
              timestamp: Date.now()
            });
          }
        });
      }
    });

    return tasks;
  }

  recordExtractedTask(task) {
    const taskId = `extracted_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    taskTracker.startTask(
      taskId,
      '提取的任务',
      task.name,
      { type: 'extracted' }
    );

    taskTracker.completeTask(
      taskId,
      `任务内容: ${task.content.substring(0, 100)}...`
    );
  }

  async recordSessionSummary(sessionId, summary) {
    const taskId = `session_summary_${sessionId || Date.now()}`;

    await permanentMemorySystem.addMemory(
      `会话总结:\n\n${summary}\n\n时间戳: ${new Date().toISOString()}`,
      'session_summary',
      5,
      'session,summary,auto_record',
      { sessionId, timestamp: Date.now() }
    );

    taskTracker.startTask(
      taskId,
      '会话总结',
      summary.substring(0, 100),
      { type: 'session_summary' }
    );

    taskTracker.completeTask(
      taskId,
      '会话总结已记录'
    );
  }

  manualRecordFileOperation(filePath, operation, details = {}) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    if (!this.isRelevantFile(ext, fileName)) {
      return null;
    }

    const taskId = `file_${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let taskName = '';
    let description = '';

    switch (operation) {
      case 'created':
        taskName = `创建文件: ${fileName}`;
        description = details.description || `创建新文件: ${filePath}`;
        break;
      case 'modified':
        taskName = `修改文件: ${fileName}`;
        description = details.description || `修改文件: ${filePath}`;
        break;
      case 'deleted':
        taskName = `删除文件: ${fileName}`;
        description = details.description || `删除文件: ${filePath}`;
        break;
    }

    taskTracker.startTask(
      taskId,
      taskName,
      description,
      {
        type: 'file_operation',
        operation: operation,
        filePath: filePath,
        fileName: fileName,
        extension: ext,
        ...details
      }
    );

    taskTracker.completeTask(
      taskId,
      `${taskName} - 已手动记录`
    );

    this.lastSessionFiles.set(filePath, {
      mtime: Date.now(),
      size: details.size || 0,
      content: details.content || ''
    });

    return taskId;
  }

  getSessionId() {
    return this.sessionId;
  }

  getFileChanges() {
    return Array.from(this.fileChanges.entries()).map(([path, time]) => ({
      path,
      time: new Date(time).toISOString()
    }));
  }

  getTrackedFiles() {
    return Array.from(this.lastSessionFiles.entries()).map(([path, info]) => ({
      path,
      mtime: new Date(info.mtime).toISOString(),
      size: info.size
    }));
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      sessionId: this.sessionId,
      watchedDirectories: this.watchedDirectories,
      trackedFiles: this.lastSessionFiles.size,
      pollInterval: this.pollInterval,
      recentFileChanges: this.getFileChanges().slice(-10)
    };
  }

  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    console.log('[ComprehensiveAutoRecorder] 已停止文件轮询');
  }
}

const comprehensiveAutoRecorder = new ComprehensiveAutoRecorder();

module.exports = {
  ComprehensiveAutoRecorder,
  comprehensiveAutoRecorder
};