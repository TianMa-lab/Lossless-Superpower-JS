const SyncManager = require('./sync_manager');
const Analyzer = require('./analyzer');
const Comparator = require('./comparator');
const DocGenerator = require('./doc_generator');
const Executor = require('./executor');
const fs = require('fs');
const path = require('path');

class Scheduler {
  constructor(config) {
    this.config = {
      syncInterval: 24 * 60 * 60 * 1000, // 24小时
      logPath: 'D:\\opensource\\scheduler-logs',
      ...config
    };
    
    // 创建日志目录
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
    
    // 延迟初始化各个模块（避免阻塞启动）
    this._syncManager = null;
    this._analyzer = null;
    this._comparator = null;
    this._docGenerator = null;
    this._executor = null;
  }
  
  // 延迟加载模块
  get syncManager() {
    if (!this._syncManager) {
      this._syncManager = new SyncManager();
    }
    return this._syncManager;
  }
  
  get analyzer() {
    if (!this._analyzer) {
      this._analyzer = new Analyzer();
    }
    return this._analyzer;
  }
  
  get comparator() {
    if (!this._comparator) {
      this._comparator = new Comparator();
    }
    return this._comparator;
  }
  
  get docGenerator() {
    if (!this._docGenerator) {
      this._docGenerator = new DocGenerator();
    }
    return this._docGenerator;
  }
  
  get executor() {
    if (!this._executor) {
      this._executor = new Executor();
    }
    return this._executor;
  }

  async runFullCycle() {
    const logFile = path.join(this.config.logPath, `${new Date().toISOString().split('T')[0]}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    
    try {
      logStream.write(`[${new Date().toISOString()}] 开始完整执行周期\n`);
      
      // 1. 同步开源项目
      logStream.write(`[${new Date().toISOString()}] 开始同步开源项目\n`);
      const syncResults = await this.syncManager.syncAllProjects();
      logStream.write(`[${new Date().toISOString()}] 同步完成，结果: ${JSON.stringify(syncResults)}\n`);
      
      // 2. 分析项目
      logStream.write(`[${new Date().toISOString()}] 开始分析项目\n`);
      const analysisResults = await this.analyzer.analyzeAllProjects();
      logStream.write(`[${new Date().toISOString()}] 分析完成，结果: ${JSON.stringify(analysisResults)}\n`);
      
      // 3. 比较系统
      logStream.write(`[${new Date().toISOString()}] 开始比较系统\n`);
      const comparisonResults = await this.comparator.compareAllProjects();
      logStream.write(`[${new Date().toISOString()}] 比较完成，结果: ${JSON.stringify(comparisonResults)}\n`);
      
      // 4. 生成文档
      logStream.write(`[${new Date().toISOString()}] 开始生成文档\n`);
      const docResults = await this.docGenerator.generateDocumentation();
      logStream.write(`[${new Date().toISOString()}] 文档生成完成，结果: ${JSON.stringify(docResults)}\n`);
      
      // 5. 执行更新
      logStream.write(`[${new Date().toISOString()}] 开始执行更新\n`);
      const executionResults = await this.executor.executeAllPlans();
      logStream.write(`[${new Date().toISOString()}] 执行完成，结果: ${JSON.stringify(executionResults)}\n`);
      
      // 6. 验证执行结果
      logStream.write(`[${new Date().toISOString()}] 开始验证执行结果\n`);
      const verificationResults = await this.executor.verifyExecution();
      logStream.write(`[${new Date().toISOString()}] 验证完成，结果: ${JSON.stringify(verificationResults)}\n`);
      
      logStream.write(`[${new Date().toISOString()}] 完整执行周期完成\n`);
      
      return {
        status: 'success',
        message: '完整执行周期完成',
        results: {
          sync: syncResults,
          analysis: analysisResults,
          comparison: comparisonResults,
          doc: docResults,
          execution: executionResults,
          verification: verificationResults
        }
      };
    } catch (error) {
      logStream.write(`[${new Date().toISOString()}] 执行周期失败: ${error.message}\n`);
      throw error;
    } finally {
      logStream.end();
    }
  }

  startScheduledCycle() {
    // 计算距离下一个0点的时间
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // 设置为明天0点
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    console.log(`距离下次自动同步 (0点) 还有 ${Math.round(msUntilMidnight / 1000 / 60)} 分钟`);
    
    // 先在0点执行一次
    setTimeout(() => {
      console.log('[自动任务] 开始执行每日0点同步...');
      this.runFullCycle();
      
      // 然后每24小时执行一次
      setInterval(() => {
        console.log('[自动任务] 开始执行每日0点同步...');
        this.runFullCycle();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
    
    console.log('自动执行任务已启动，将在每天0点执行完整周期');
  }

  async runManualCycle() {
    return this.runFullCycle();
  }

  getStatus() {
    return {
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + this.config.syncInterval).toISOString(),
      syncInterval: this.config.syncInterval
    };
  }
}

module.exports = Scheduler;