/**
 * 性能优化模块
 * 负责技能系统的性能优化，包括缓存、异步处理和资源管理
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class PerformanceOptimizer {
  /**
   * 性能优化器
   * @param {string} cacheDir - 缓存目录
   */
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    this.caches = {
      skillCache: new Map(),
      recommendationCache: new Map(),
      searchCache: new Map(),
      analysisCache: new Map()
    };
    this.cacheExpiry = {
      skillCache: 3600000, // 1小时
      recommendationCache: 1800000, // 30分钟
      searchCache: 600000, // 10分钟
      analysisCache: 7200000 // 2小时
    };
    this.batchJobs = [];
    this.batchProcessingInterval = null;
    this.init();
  }

  /**
   * 初始化性能优化器
   */
  init() {
    // 创建缓存目录
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    // 加载持久化缓存
    this.loadCache();
    
    // 启动批处理
    this.startBatchProcessing();
    
    // 启动缓存清理
    this.startCacheCleanup();
  }

  /**
   * 加载持久化缓存
   */
  loadCache() {
    for (const cacheName in this.caches) {
      const cacheFilePath = path.join(this.cacheDir, `${cacheName}.json`);
      try {
        if (fs.existsSync(cacheFilePath)) {
          const content = fs.readFileSync(cacheFilePath, 'utf-8');
          const cacheData = JSON.parse(content);
          
          // 恢复缓存数据，过滤过期数据
          for (const [key, value] of Object.entries(cacheData)) {
            if (value.timestamp + this.cacheExpiry[cacheName] > Date.now()) {
              this.caches[cacheName].set(key, value);
            }
          }
          
          console.log(`加载 ${cacheName} 缓存成功，恢复 ${this.caches[cacheName].size} 个条目`);
        }
      } catch (error) {
        console.error(`加载 ${cacheName} 缓存失败: ${error.message}`);
      }
    }
  }

  /**
   * 保存缓存到磁盘
   */
  saveCache() {
    for (const cacheName in this.caches) {
      const cacheFilePath = path.join(this.cacheDir, `${cacheName}.json`);
      try {
        const cacheData = Object.fromEntries(this.caches[cacheName]);
        fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf-8');
        console.log(`保存 ${cacheName} 缓存成功`);
      } catch (error) {
        console.error(`保存 ${cacheName} 缓存失败: ${error.message}`);
      }
    }
  }

  /**
   * 获取缓存
   * @param {string} cacheName - 缓存名称
   * @param {string} key - 缓存键
   * @returns {any} 缓存值
   */
  getCache(cacheName, key) {
    const cache = this.caches[cacheName];
    if (!cache) {
      return null;
    }
    
    const value = cache.get(key);
    if (value) {
      // 检查是否过期
      if (value.timestamp + this.cacheExpiry[cacheName] > Date.now()) {
        return value.data;
      } else {
        // 过期数据，从缓存中移除
        cache.delete(key);
        return null;
      }
    }
    
    return null;
  }

  /**
   * 设置缓存
   * @param {string} cacheName - 缓存名称
   * @param {string} key - 缓存键
   * @param {any} data - 缓存值
   */
  setCache(cacheName, key, data) {
    const cache = this.caches[cacheName];
    if (!cache) {
      return;
    }
    
    cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
    
    // 限制缓存大小
    this.limitCacheSize(cacheName);
  }

  /**
   * 限制缓存大小
   * @param {string} cacheName - 缓存名称
   * @param {number} maxSize - 最大大小
   */
  limitCacheSize(cacheName, maxSize = 1000) {
    const cache = this.caches[cacheName];
    if (!cache) {
      return;
    }
    
    if (cache.size > maxSize) {
      // 按时间排序，删除最旧的条目
      const entries = Array.from(cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, cache.size - maxSize);
      for (const [key] of toDelete) {
        cache.delete(key);
      }
    }
  }

  /**
   * 清除缓存
   * @param {string} cacheName - 缓存名称（可选，不提供则清除所有缓存）
   */
  clearCache(cacheName = null) {
    if (cacheName) {
      if (this.caches[cacheName]) {
        this.caches[cacheName].clear();
        console.log(`清除 ${cacheName} 缓存成功`);
      }
    } else {
      for (const name in this.caches) {
        this.caches[name].clear();
      }
      console.log('清除所有缓存成功');
    }
  }

  /**
   * 启动批处理
   */
  startBatchProcessing() {
    this.batchProcessingInterval = setInterval(() => {
      this.processBatchJobs();
    }, 5000); // 每5秒处理一次批处理任务
  }

  /**
   * 停止批处理
   */
  stopBatchProcessing() {
    if (this.batchProcessingInterval) {
      clearInterval(this.batchProcessingInterval);
      this.batchProcessingInterval = null;
    }
  }

  /**
   * 添加批处理任务
   * @param {Function} job - 任务函数
   * @param {Array} args - 任务参数
   */
  addBatchJob(job, args = []) {
    this.batchJobs.push({ job, args });
  }

  /**
   * 处理批处理任务
   */
  processBatchJobs() {
    if (this.batchJobs.length === 0) {
      return;
    }
    
    console.log(`开始处理 ${this.batchJobs.length} 个批处理任务`);
    
    // 处理任务
    for (const job of this.batchJobs) {
      try {
        job.job(...job.args);
      } catch (error) {
        console.error(`处理批处理任务失败: ${error.message}`);
      }
    }
    
    // 清空任务队列
    this.batchJobs = [];
  }

  /**
   * 启动缓存清理
   */
  startCacheCleanup() {
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 300000); // 每5分钟清理一次过期缓存
  }

  /**
   * 清理过期缓存
   */
  cleanupExpiredCache() {
    let cleanedCount = 0;
    
    for (const cacheName in this.caches) {
      const cache = this.caches[cacheName];
      const expiry = this.cacheExpiry[cacheName];
      const now = Date.now();
      
      for (const [key, value] of cache.entries()) {
        if (value.timestamp + expiry < now) {
          cache.delete(key);
          cleanedCount++;
        }
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`清理了 ${cleanedCount} 个过期缓存条目`);
      // 保存清理后的缓存
      this.saveCache();
    }
  }

  /**
   * 异步执行函数
   * @param {Function} fn - 要执行的函数
   * @param {Array} args - 函数参数
   * @returns {Promise} 执行结果
   */
  async executeAsync(fn, args = []) {
    return new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          const result = fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * 并行执行多个函数
   * @param {Array} tasks - 任务数组，每个任务是一个包含函数和参数的对象
   * @returns {Promise<Array>} 执行结果数组
   */
  async executeParallel(tasks) {
    const promises = tasks.map(task => {
      return this.executeAsync(task.fn, task.args || []);
    });
    
    return Promise.all(promises);
  }

  /**
   * 限制并发执行
   * @param {Array} tasks - 任务数组
   * @param {number} concurrency - 并发数
   * @returns {Promise<Array>} 执行结果数组
   */
  async executeWithConcurrency(tasks, concurrency = 5) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
      // 等待并发数小于限制
      while (executing.length >= concurrency) {
        await Promise.race(executing);
      }
      
      const promise = this.executeAsync(task.fn, task.args || []);
      results.push(promise);
      
      const executingPromise = promise.then(() => {
        const index = executing.indexOf(executingPromise);
        if (index > -1) {
          executing.splice(index, 1);
        }
      });
      
      executing.push(executingPromise);
    }
    
    return Promise.all(results);
  }

  /**
   * 优化文件读取
   * @param {string} filePath - 文件路径
   * @returns {Promise<string>} 文件内容
   */
  async readFileOptimized(filePath) {
    const cacheKey = `file_${filePath}`;
    const cachedContent = this.getCache('skillCache', cacheKey);
    
    if (cachedContent) {
      return cachedContent;
    }
    
    try {
      const readFile = promisify(fs.readFile);
      const content = await readFile(filePath, 'utf-8');
      
      // 缓存文件内容
      this.setCache('skillCache', cacheKey, content);
      
      return content;
    } catch (error) {
      console.error(`读取文件 ${filePath} 失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 优化目录扫描
   * @param {string} dirPath - 目录路径
   * @returns {Promise<Array>} 文件列表
   */
  async scanDirectoryOptimized(dirPath) {
    const cacheKey = `dir_${dirPath}`;
    const cachedFiles = this.getCache('skillCache', cacheKey);
    
    if (cachedFiles) {
      return cachedFiles;
    }
    
    try {
      const readdir = promisify(fs.readdir);
      const files = await readdir(dirPath, { withFileTypes: true });
      
      // 缓存目录扫描结果
      this.setCache('skillCache', cacheKey, files);
      
      return files;
    } catch (error) {
      console.error(`扫描目录 ${dirPath} 失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 性能监控
   * @param {string} operation - 操作名称
   * @param {Function} fn - 要执行的函数
   * @returns {Object} 执行结果和性能数据
   */
  async monitorPerformance(operation, fn) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    try {
      const result = await fn();
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      const performanceData = {
        operation: operation,
        duration: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        timestamp: Date.now()
      };
      
      console.log(`性能监控: ${operation} - 耗时: ${performanceData.duration}ms, 内存: ${(performanceData.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      
      return {
        result: result,
        performance: performanceData
      };
    } catch (error) {
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      console.error(`性能监控: ${operation} - 执行失败: ${error.message}`);
      
      throw error;
    }
  }

  /**
   * 生成性能报告
   * @returns {Object} 性能报告
   */
  generatePerformanceReport() {
    const report = {
      cacheStats: {},
      memoryUsage: process.memoryUsage(),
      batchJobs: this.batchJobs.length,
      timestamp: Date.now()
    };
    
    // 缓存统计
    for (const cacheName in this.caches) {
      report.cacheStats[cacheName] = {
        size: this.caches[cacheName].size,
        expiry: this.cacheExpiry[cacheName]
      };
    }
    
    return report;
  }

  /**
   * 导出性能数据
   * @param {string} filePath - 导出文件路径
   */
  exportPerformanceData(filePath) {
    try {
      const data = {
        report: this.generatePerformanceReport(),
        caches: {},
        exportedAt: Date.now()
      };
      
      // 导出缓存统计
      for (const cacheName in this.caches) {
        data.caches[cacheName] = {
          size: this.caches[cacheName].size,
          entries: Array.from(this.caches[cacheName].keys())
        };
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`性能数据导出成功: ${filePath}`);
    } catch (error) {
      console.error(`导出性能数据失败: ${error.message}`);
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    // 停止批处理
    this.stopBatchProcessing();
    
    // 保存缓存
    this.saveCache();
    
    console.log('性能优化器资源清理完成');
  }
}

// 导出模块
module.exports = {
  PerformanceOptimizer
};
