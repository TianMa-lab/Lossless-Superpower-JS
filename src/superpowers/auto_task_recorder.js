/**
 * 全局任务自动记录系统
 * 监控所有执行的任务和操作，自动记录到任务追踪系统
 */

const { taskTracker } = require('./task_tracker');
const { permanentMemorySystem } = require('./permanent_memory');
const { eventRecorder } = require('./event_recorder');
const { iterationManager } = require('./iteration_manager');

// 全局任务计数器
let taskCounter = 0;

// 正在执行的任务栈
const taskStack = [];

// 配置
const config = {
  enableAutoRecording: true,
  enableMemoryStorage: true,
  enableEventRecording: true,
  enableIterationTracking: true,
  defaultTaskImportance: 3
};

/**
 * 自动记录系统
 */
class AutoTaskRecorder {
  constructor() {
    this.isInitialized = false;
    this.sessionId = null;
  }

  /**
   * 初始化系统
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // 初始化记忆系统
      await permanentMemorySystem.init();

      // 创建会话
      this.sessionId = `auto_record_session_${Date.now()}`;
      taskTracker.startTask(
        this.sessionId,
        '自动记录会话',
        '全局自动任务记录会话',
        { type: 'auto_record_session' }
      );

      // 包装关键函数
      this.wrapGlobalFunctions();

      this.isInitialized = true;
      console.log('[AutoTaskRecorder] 全局自动任务记录系统已初始化');
    } catch (error) {
      console.error('[AutoTaskRecorder] 初始化失败:', error.message);
    }
  }

  /**
   * 包装全局函数
   */
  wrapGlobalFunctions() {
    // 包装setTimeout
    this.wrapSetTimeout();

    // 包装setInterval
    this.wrapSetInterval();

    // 包装Promise
    this.wrapPromise();

    // 包装核心模块
    this.wrapCoreModules();
  }

  /**
   * 包装setTimeout
   */
  wrapSetTimeout() {
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = (callback, delay, ...args) => {
      const taskId = `timeout_${Date.now()}_${++taskCounter}`;
      const startTime = Date.now();

      taskTracker.startTask(
        taskId,
        'setTimeout执行',
        `延迟 ${delay}ms 执行任务`,
        { type: 'timeout', delay }
      );

      const wrappedCallback = (...cbArgs) => {
        try {
          const result = callback(...cbArgs);
          const duration = Date.now() - startTime;
          taskTracker.completeTask(
            taskId,
            `setTimeout执行完成 (${duration}ms)`
          );
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          taskTracker.completeTask(
            taskId,
            `setTimeout执行失败: ${error.message} (${duration}ms)`
          );
          throw error;
        }
      };

      return originalSetTimeout(wrappedCallback, delay, ...args);
    };
  }

  /**
   * 包装setInterval
   */
  wrapSetInterval() {
    const originalSetInterval = global.setInterval;
    global.setInterval = (callback, interval, ...args) => {
      const taskId = `interval_${Date.now()}_${++taskCounter}`;

      taskTracker.startTask(
        taskId,
        'setInterval执行',
        `每 ${interval}ms 重复执行任务`,
        { type: 'interval', interval }
      );

      let executionCount = 0;
      const wrappedCallback = (...cbArgs) => {
        const executionId = `${taskId}_exec_${++executionCount}`;
        const startTime = Date.now();

        try {
          const result = callback(...cbArgs);
          const duration = Date.now() - startTime;
          taskTracker.addTaskStep(
            taskId,
            `执行 ${executionCount}`,
            `执行完成 (${duration}ms)`
          );
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          taskTracker.addTaskStep(
            taskId,
            `执行 ${executionCount}`,
            `执行失败: ${error.message} (${duration}ms)`
          );
          throw error;
        }
      };

      return originalSetInterval(wrappedCallback, interval, ...args);
    };
  }

  /**
   * 包装Promise
   */
  wrapPromise() {
    const originalPromise = global.Promise;
    global.Promise = class extends originalPromise {
      constructor(executor) {
        const taskId = `promise_${Date.now()}_${++taskCounter}`;
        const startTime = Date.now();

        taskTracker.startTask(
          taskId,
          'Promise执行',
          '异步Promise执行',
          { type: 'promise' }
        );

        const wrappedExecutor = (resolve, reject) => {
          const wrappedResolve = (value) => {
            const duration = Date.now() - startTime;
            taskTracker.completeTask(
              taskId,
              `Promise resolved (${duration}ms)`
            );
            resolve(value);
          };

          const wrappedReject = (reason) => {
            const duration = Date.now() - startTime;
            taskTracker.completeTask(
              taskId,
              `Promise rejected: ${reason} (${duration}ms)`
            );
            reject(reason);
          };

          executor(wrappedResolve, wrappedReject);
        };

        super(wrappedExecutor);
      }
    };

    // 复制静态方法
    Object.assign(global.Promise, originalPromise);
  }

  /**
   * 包装核心模块
   */
  wrapCoreModules() {
    // 包装fs模块
    this.wrapFsModule();

    // 包装http模块
    this.wrapHttpModule();

    // 包装child_process模块
    this.wrapChildProcessModule();

    // 包装crypto模块
    this.wrapCryptoModule();

    // 包装os模块
    this.wrapOsModule();
  }

  /**
   * 包装fs模块
   */
  wrapFsModule() {
    const fs = require('fs');
    const methodsToWrap = ['readFile', 'writeFile', 'appendFile', 'mkdir', 'rm', 'copyFile'];

    methodsToWrap.forEach(method => {
      if (fs[method]) {
        const originalMethod = fs[method];
        fs[method] = (...args) => {
          const taskId = `fs_${method}_${Date.now()}_${++taskCounter}`;
          const startTime = Date.now();

          taskTracker.startTask(
            taskId,
            `fs.${method}`,
            `文件操作: ${method}`,
            { type: 'fs', method, path: args[0] }
          );

          // 处理回调版本
          if (typeof args[args.length - 1] === 'function') {
            const callback = args[args.length - 1];
            args[args.length - 1] = (err, result) => {
              const duration = Date.now() - startTime;
              if (err) {
                taskTracker.completeTask(
                  taskId,
                  `fs.${method} 失败: ${err.message} (${duration}ms)`
                );
              } else {
                taskTracker.completeTask(
                  taskId,
                  `fs.${method} 成功 (${duration}ms)`
                );
              }
              callback(err, result);
            };
            return originalMethod(...args);
          } 
          // 处理Promise版本
          else {
            return originalMethod(...args).then(result => {
              const duration = Date.now() - startTime;
              taskTracker.completeTask(
                taskId,
                `fs.${method} 成功 (${duration}ms)`
              );
              return result;
            }).catch(err => {
              const duration = Date.now() - startTime;
              taskTracker.completeTask(
                taskId,
                `fs.${method} 失败: ${err.message} (${duration}ms)`
              );
              throw err;
            });
          }
        };
      }
    });
  }

  /**
   * 包装http模块
   */
  wrapHttpModule() {
    const http = require('http');
    const https = require('https');

    [http, https].forEach(module => {
      if (module.get) {
        const originalGet = module.get;
        module.get = (options, callback) => {
          const taskId = `http_get_${Date.now()}_${++taskCounter}`;
          const startTime = Date.now();

          const url = typeof options === 'string' ? options : `${options.protocol || 'http:'}//${options.host}${options.path}`;

          taskTracker.startTask(
            taskId,
            'HTTP GET请求',
            `请求: ${url}`,
            { type: 'http', method: 'GET', url }
          );

          const wrappedCallback = (response) => {
            response.on('end', () => {
              const duration = Date.now() - startTime;
              taskTracker.completeTask(
                taskId,
                `HTTP GET 成功 (${response.statusCode}) (${duration}ms)`
              );
            });
            if (callback) callback(response);
          };

          const req = originalGet(options, wrappedCallback);
          req.on('error', (err) => {
            const duration = Date.now() - startTime;
            taskTracker.completeTask(
              taskId,
              `HTTP GET 失败: ${err.message} (${duration}ms)`
            );
          });
          return req;
        };
      }
    });
  }

  /**
   * 包装child_process模块
   */
  wrapChildProcessModule() {
    const childProcess = require('child_process');
    const methodsToWrap = ['exec', 'execFile', 'spawn', 'fork'];

    methodsToWrap.forEach(method => {
      if (childProcess[method]) {
        const originalMethod = childProcess[method];
        childProcess[method] = (...args) => {
          const taskId = `child_process_${method}_${Date.now()}_${++taskCounter}`;
          const startTime = Date.now();

          const command = args[0];
          taskTracker.startTask(
            taskId,
            `child_process.${method}`,
            `执行命令: ${command}`,
            { type: 'child_process', method, command }
          );

          const result = originalMethod(...args);

          if (result && result.on) {
            result.on('exit', (code, signal) => {
              const duration = Date.now() - startTime;
              if (code === 0) {
                taskTracker.completeTask(
                  taskId,
                  `命令执行成功 (${duration}ms)`
                );
              } else {
                taskTracker.completeTask(
                  taskId,
                  `命令执行失败 (code: ${code}, signal: ${signal}) (${duration}ms)`
                );
              }
            });

            result.on('error', (err) => {
              const duration = Date.now() - startTime;
              taskTracker.completeTask(
                taskId,
                `命令执行错误: ${err.message} (${duration}ms)`
              );
            });
          }

          return result;
        };
      }
    });
  }

  /**
   * 包装crypto模块
   */
  wrapCryptoModule() {
    const crypto = require('crypto');
    const methodsToWrap = ['createHash', 'createHmac', 'createCipher', 'createDecipher', 'randomBytes'];

    methodsToWrap.forEach(method => {
      if (crypto[method]) {
        const originalMethod = crypto[method];
        crypto[method] = (...args) => {
          const taskId = `crypto_${method}_${Date.now()}_${++taskCounter}`;
          const startTime = Date.now();

          taskTracker.startTask(
            taskId,
            `crypto.${method}`,
            `加密操作: ${method}`,
            { type: 'crypto', method }
          );

          const result = originalMethod(...args);
          const duration = Date.now() - startTime;

          taskTracker.completeTask(
            taskId,
            `加密操作完成 (${duration}ms)`
          );

          return result;
        };
      }
    });
  }

  /**
   * 包装os模块
   */
  wrapOsModule() {
    const os = require('os');
    const methodsToWrap = ['cpus', 'freemem', 'totalmem', 'hostname', 'platform', 'arch'];

    methodsToWrap.forEach(method => {
      if (os[method]) {
        const originalMethod = os[method];
        os[method] = (...args) => {
          const taskId = `os_${method}_${Date.now()}_${++taskCounter}`;
          const startTime = Date.now();

          taskTracker.startTask(
            taskId,
            `os.${method}`,
            `系统操作: ${method}`,
            { type: 'os', method }
          );

          const result = originalMethod(...args);
          const duration = Date.now() - startTime;

          taskTracker.completeTask(
            taskId,
            `系统操作完成 (${duration}ms)`
          );

          return result;
        };
      }
    });
  }

  /**
   * 手动记录任务
   */
  async recordTask(name, description, taskFn, options = {}) {
    const taskId = `manual_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${++taskCounter}`;
    const startTime = Date.now();

    taskTracker.startTask(
      taskId,
      name,
      description,
      { type: 'manual', ...options }
    );

    try {
      const result = await taskFn();
      const duration = Date.now() - startTime;
      const resultMessage = `任务 ${name} 完成 (${duration}ms)`;

      taskTracker.completeTask(taskId, resultMessage);

      if (config.enableMemoryStorage) {
        await permanentMemorySystem.addMemory(
          `任务执行结果: ${name}\n\n${description}\n\n执行时间: ${duration}ms\n状态: 成功\n时间戳: ${new Date().toISOString()}`,
          'task_result',
          options.importance || config.defaultTaskImportance,
          `task,manual,${options.tags || ''}`,
          {
            taskId,
            name,
            description,
            duration,
            status: 'completed',
            type: 'manual_task',
            timestamp: Date.now()
          }
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = `任务 ${name} 失败: ${error.message} (${duration}ms)`;

      taskTracker.completeTask(taskId, errorMessage);

      if (config.enableMemoryStorage) {
        await permanentMemorySystem.addMemory(
          `任务执行结果: ${name}\n\n${description}\n\n执行时间: ${duration}ms\n状态: 失败\n错误: ${error.message}\n时间戳: ${new Date().toISOString()}`,
          'task_result',
          5, // 失败任务更重要
          `task,manual,error,${options.tags || ''}`,
          {
            taskId,
            name,
            description,
            duration,
            error: error.message,
            status: 'failed',
            type: 'manual_task',
            timestamp: Date.now()
          }
        );
      }

      throw error;
    }
  }

  /**
   * 获取记录统计
   */
  getStats() {
    const tasks = taskTracker.listTasks();
    const today = Date.now() - 24 * 60 * 60 * 1000;
    const recentTasks = tasks.filter(t => t.timestamp && t.timestamp > today);

    const stats = {
      totalTasks: tasks.length,
      recentTasks: recentTasks.length,
      passedTasks: recentTasks.filter(t => t.status === 'completed').length,
      failedTasks: recentTasks.filter(t => t.status === 'failed').length,
      taskTypes: {}
    };

    // 统计任务类型
    recentTasks.forEach(task => {
      const type = task.metadata?.type || 'unknown';
      stats.taskTypes[type] = (stats.taskTypes[type] || 0) + 1;
    });

    return stats;
  }

  /**
   * 生成报告
   */
  async generateReport() {
    const stats = this.getStats();
    const memories = await permanentMemorySystem.getMemories(1000);
    const taskMemories = memories.filter(m => m.type === 'task_result');

    return {
      generatedAt: new Date().toISOString(),
      statistics: stats,
      recentTaskMemories: taskMemories.slice(-10).map(m => ({
        id: m.id,
        content: m.content.substring(0, 100) + '...',
        timestamp: new Date(m.timestamp).toISOString(),
        importance: m.importance,
        tags: m.tags
      }))
    };
  }

  /**
   * 清理过期任务
   */
  cleanupOldTasks(days = 7) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const tasks = taskTracker.listTasks();
    const oldTasks = tasks.filter(t => t.timestamp < cutoffTime);

    console.log(`[AutoTaskRecorder] 清理 ${oldTasks.length} 个过期任务`);
    // 这里可以添加清理逻辑
  }
}

// 导出单例实例
const autoTaskRecorder = new AutoTaskRecorder();

// 自动初始化
autoTaskRecorder.initialize().catch(console.error);

module.exports = {
  AutoTaskRecorder,
  autoTaskRecorder
};