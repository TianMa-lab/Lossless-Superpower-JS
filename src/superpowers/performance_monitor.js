/**
 * 性能监控模块
 * 每周执行一次性能分析，识别性能瓶颈并提供优化建议
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 性能监控配置
const PERFORMANCE_CONFIG = {
  interval: 7 * 24 * 60 * 60 * 1000, // 7天
  logPath: 'D:\\opensource\\performance-logs',
  benchmarks: {
    cpu: {
      iterations: 1000000,
      threshold: 500 // ms
    },
    memory: {
      allocation: 100 * 1024 * 1024, // 100MB
      threshold: 200 // ms
    },
    disk: {
      fileSize: 10 * 1024 * 1024, // 10MB
      threshold: 1000 // ms
    },
    network: {
      url: 'http://example.com',
      threshold: 2000 // ms
    }
  }
};

class PerformanceMonitor {
  constructor() {
    this.config = PERFORMANCE_CONFIG;
    this._ensureLogDirectory();
  }

  /**
   * 确保日志目录存在
   */
  _ensureLogDirectory() {
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  /**
   * 执行性能分析
   */
  async runPerformanceAnalysis() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`[性能] 开始执行性能分析: ${timestamp}`);
      
      // 执行各项性能测试
      const results = {
        timestamp,
        system: this._getSystemInfo(),
        benchmarks: {
          cpu: await this._benchmarkCPU(),
          memory: await this._benchmarkMemory(),
          disk: await this._benchmarkDisk(),
          network: await this._benchmarkNetwork()
        },
        process: this._getProcessInfo(),
        recommendations: []
      };

      // 生成优化建议
      results.recommendations = this._generateRecommendations(results);

      // 保存分析结果
      this._saveAnalysisResults(results);

      console.log('[性能] 性能分析完成');
      return results;
    } catch (error) {
      console.error('[性能] 性能分析失败:', error.message);
      return null;
    }
  }

  /**
   * 获取系统信息
   * @returns {Object} 系统信息
   */
  _getSystemInfo() {
    return {
      os: {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: os.uptime(),
        cpus: os.cpus()
      },
      node: {
        version: process.version,
        env: process.env.NODE_ENV || 'development'
      }
    };
  }

  /**
   * 获取进程信息
   * @returns {Object} 进程信息
   */
  _getProcessInfo() {
    return {
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal
    };
  }

  /**
   * CPU基准测试
   * @returns {Object} CPU测试结果
   */
  async _benchmarkCPU() {
    const startTime = Date.now();
    
    // 执行CPU密集型任务
    let sum = 0;
    for (let i = 0; i < this.config.benchmarks.cpu.iterations; i++) {
      sum += Math.sqrt(i) * Math.sin(i);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      duration,
      threshold: this.config.benchmarks.cpu.threshold,
      passed: duration < this.config.benchmarks.cpu.threshold,
      iterations: this.config.benchmarks.cpu.iterations
    };
  }

  /**
   * 内存基准测试
   * @returns {Object} 内存测试结果
   */
  async _benchmarkMemory() {
    const startTime = Date.now();
    
    // 分配和释放内存
    const buffer = Buffer.alloc(this.config.benchmarks.memory.allocation);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = i % 256;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return {
      duration,
      threshold: this.config.benchmarks.memory.threshold,
      passed: duration < this.config.benchmarks.memory.threshold,
      allocation: this.config.benchmarks.memory.allocation
    };
  }

  /**
   * 磁盘基准测试
   * @returns {Object} 磁盘测试结果
   */
  async _benchmarkDisk() {
    const testFile = path.join(this.config.logPath, `disk-test-${Date.now()}.tmp`);
    const startTime = Date.now();
    
    try {
      // 写入测试文件
      const buffer = Buffer.alloc(this.config.benchmarks.disk.fileSize);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = i % 256;
      }
      
      fs.writeFileSync(testFile, buffer);
      
      // 读取测试文件
      const readBuffer = fs.readFileSync(testFile);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      return {
        duration,
        threshold: this.config.benchmarks.disk.threshold,
        passed: duration < this.config.benchmarks.disk.threshold,
        fileSize: this.config.benchmarks.disk.fileSize
      };
    } finally {
      // 清理测试文件
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  }

  /**
   * 网络基准测试
   * @returns {Object} 网络测试结果
   */
  async _benchmarkNetwork() {
    return new Promise((resolve) => {
      const http = require('http');
      const startTime = Date.now();
      
      http.get(this.config.benchmarks.network.url, (res) => {
        res.resume();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        resolve({
          duration,
          threshold: this.config.benchmarks.network.threshold,
          passed: duration < this.config.benchmarks.network.threshold,
          url: this.config.benchmarks.network.url
        });
      }).on('error', () => {
        resolve({
          duration: -1,
          threshold: this.config.benchmarks.network.threshold,
          passed: false,
          url: this.config.benchmarks.network.url,
          error: '网络请求失败'
        });
      });
    });
  }

  /**
   * 生成优化建议
   * @param {Object} results - 性能测试结果
   * @returns {Array} 优化建议
   */
  _generateRecommendations(results) {
    const recommendations = [];
    
    // CPU优化建议
    if (!results.benchmarks.cpu.passed) {
      recommendations.push({
        type: 'cpu',
        severity: 'warning',
        message: 'CPU性能测试未通过，建议检查系统负载和进程数量',
        suggestion: '考虑升级CPU或减少同时运行的进程数量'
      });
    }
    
    // 内存优化建议
    if (!results.benchmarks.memory.passed) {
      recommendations.push({
        type: 'memory',
        severity: 'warning',
        message: '内存性能测试未通过，建议检查内存使用情况',
        suggestion: '考虑增加内存或优化内存使用，避免内存泄漏'
      });
    }
    
    // 磁盘优化建议
    if (!results.benchmarks.disk.passed) {
      recommendations.push({
        type: 'disk',
        severity: 'warning',
        message: '磁盘性能测试未通过，建议检查磁盘健康状态',
        suggestion: '考虑使用SSD或清理磁盘空间'
      });
    }
    
    // 网络优化建议
    if (!results.benchmarks.network.passed) {
      recommendations.push({
        type: 'network',
        severity: 'warning',
        message: '网络性能测试未通过，建议检查网络连接',
        suggestion: '检查网络连接质量或考虑使用CDN'
      });
    }
    
    // 进程内存使用建议
    const heapUsedMB = Math.round(results.process.heapUsed / (1024 * 1024));
    if (heapUsedMB > 500) {
      recommendations.push({
        type: 'process',
        severity: 'info',
        message: `进程内存使用较高 (${heapUsedMB}MB)`,
        suggestion: '考虑优化内存使用，检查是否存在内存泄漏'
      });
    }
    
    return recommendations;
  }

  /**
   * 保存分析结果
   * @param {Object} results - 性能测试结果
   */
  _saveAnalysisResults(results) {
    const fileName = `performance-analysis-${results.timestamp.replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(this.config.logPath, fileName);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`[性能] 分析结果已保存: ${fileName}`);
    } catch (error) {
      console.error('[性能] 保存分析结果失败:', error.message);
    }
  }

  /**
   * 启动性能监控
   */
  startPerformanceMonitoring() {
    console.log('启动性能监控，每周执行一次性能分析');
    
    // 立即执行一次
    this.runPerformanceAnalysis();
    
    // 设置定时任务
    setInterval(() => {
      this.runPerformanceAnalysis();
    }, this.config.interval);
  }

  /**
   * 获取性能历史数据
   * @param {number} limit - 限制返回数量
   * @returns {Array} 性能历史数据
   */
  getPerformanceHistory(limit = 10) {
    try {
      const files = fs.readdirSync(this.config.logPath);
      const history = [];
      
      for (const file of files) {
        if (file.startsWith('performance-analysis-') && file.endsWith('.json')) {
          const filePath = path.join(this.config.logPath, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          history.push(JSON.parse(data));
        }
      }
      
      // 按时间排序
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return history.slice(0, limit);
    } catch (error) {
      console.error('[性能] 获取性能历史数据失败:', error.message);
      return [];
    }
  }

  /**
   * 生成性能报告
   * @returns {string} 性能报告
   */
  generatePerformanceReport() {
    const history = this.getPerformanceHistory(1);
    if (history.length === 0) {
      return '暂无性能数据';
    }
    
    const latest = history[0];
    let report = `# 性能报告\n\n`;
    report += `**生成时间**: ${latest.timestamp}\n\n`;
    
    // 系统信息
    report += `## 系统信息\n`;
    report += `- 平台: ${latest.system.os.platform}\n`;
    report += `- 架构: ${latest.system.os.arch}\n`;
    report += `- 总内存: ${Math.round(latest.system.os.totalMemory / (1024 * 1024 * 1024))}GB\n`;
    report += `- 空闲内存: ${Math.round(latest.system.os.freeMemory / (1024 * 1024 * 1024))}GB\n\n`;
    
    // 基准测试结果
    report += `## 基准测试结果\n`;
    for (const [key, value] of Object.entries(latest.benchmarks)) {
      report += `- ${key.toUpperCase()}: ${value.duration}ms (阈值: ${value.threshold}ms) - ${value.passed ? '通过' : '未通过'}\n`;
    }
    
    // 优化建议
    if (latest.recommendations.length > 0) {
      report += `\n## 优化建议\n`;
      for (const recommendation of latest.recommendations) {
        report += `- [${recommendation.severity.toUpperCase()}] ${recommendation.message}\n`;
        report += `  建议: ${recommendation.suggestion}\n`;
      }
    }
    
    return report;
  }

  /**
   * 清理旧的性能分析数据
   * @param {number} days - 保留天数
   */
  cleanupOldData(days = 30) {
    try {
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      const files = fs.readdirSync(this.config.logPath);
      
      for (const file of files) {
        if (file.startsWith('performance-analysis-') && file.endsWith('.json')) {
          const filePath = path.join(this.config.logPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            console.log(`[性能] 已清理旧性能数据: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('[性能] 清理旧性能数据失败:', error.message);
    }
  }
}

// 导出性能监控模块
module.exports = PerformanceMonitor;