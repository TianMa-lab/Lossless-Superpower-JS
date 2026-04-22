/**
 * 系统监控模块
 * 每5分钟执行一次监控，监控系统运行状态、API响应时间等
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');

// 监控配置
const MONITORING_CONFIG = {
  interval: 5 * 60 * 1000, // 5分钟
  thresholds: {
    cpu: 80, // CPU使用率阈值（%）
    memory: 80, // 内存使用率阈值（%）
    disk: 90, // 磁盘使用率阈值（%）
    apiResponseTime: 500 // API响应时间阈值（ms）
  },
  logPath: 'D:\\opensource\\monitoring-logs'
};

// 监控数据存储路径
const MONITORING_DIR = path.join(__dirname, '..', '..', 'monitoring');
const METRICS_FILE = path.join(MONITORING_DIR, 'metrics.json');
const ALERTS_FILE = path.join(MONITORING_DIR, 'alerts.json');

class MonitoringSystem {
  constructor() {
    this.config = MONITORING_CONFIG;
    this.metrics = [];
    this.alerts = [];
    this._ensureDirectories();
  }

  /**
   * 确保监控目录存在
   */
  _ensureDirectories() {
    if (!fs.existsSync(MONITORING_DIR)) {
      fs.mkdirSync(MONITORING_DIR, { recursive: true });
    }
  }

  /**
   * 获取系统CPU使用率
   * @returns {number} CPU使用率（%）
   */
  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    }

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    return Math.round((1 - idle / total) * 100);
  }

  /**
   * 获取系统内存使用情况
   * @returns {Object} 内存使用情况
   */
  getMemoryUsage() {
    const memory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - memory;
    const usagePercent = Math.round((usedMemory / totalMemory) * 100);

    return {
      total: totalMemory,
      used: usedMemory,
      free: memory,
      usagePercent
    };
  }

  /**
   * 获取磁盘使用情况
   * @returns {Object} 磁盘使用情况
   */
  getDiskUsage() {
    try {
      const stats = fs.statSync(__dirname);
      const disk = fs.fstatSync(process.stdout.fd);
      
      // 简化实现，实际应该使用更详细的磁盘信息
      return {
        total: 1000000000000, // 假设总空间为1TB
        used: 500000000000,  // 假设已使用500GB
        free: 500000000000,  // 假设剩余500GB
        usagePercent: 50
      };
    } catch (error) {
      console.error('获取磁盘使用情况失败:', error.message);
      return {
        total: 0,
        used: 0,
        free: 0,
        usagePercent: 0
      };
    }
  }

  /**
   * 测试API响应时间
   * @param {string} url - API URL
   * @returns {Promise<number>} 响应时间（ms）
   */
  async testApiResponseTime(url = 'http://localhost:3001') {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      http.get(url, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        res.resume(); // 消耗响应体
        resolve(responseTime);
      }).on('error', () => {
        resolve(-1); // 错误情况返回-1
      });
    });
  }

  /**
   * 执行一次监控
   */
  async runMonitoring() {
    try {
      const timestamp = new Date().toISOString();
      
      // 收集监控数据
      const cpuUsage = this.getCpuUsage();
      const memoryUsage = this.getMemoryUsage();
      const diskUsage = this.getDiskUsage();
      const apiResponseTime = await this.testApiResponseTime();

      // 构建监控数据
      const metric = {
        timestamp,
        cpu: cpuUsage,
        memory: memoryUsage.usagePercent,
        disk: diskUsage.usagePercent,
        apiResponseTime,
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        networkInterfaces: os.networkInterfaces()
      };

      // 保存监控数据
      this.metrics.push(metric);
      this._saveMetrics();

      // 检查阈值并生成告警
      this._checkThresholds(metric);

      console.log(`[监控] ${timestamp} - CPU: ${cpuUsage}%, 内存: ${memoryUsage.usagePercent}%, 磁盘: ${diskUsage.usagePercent}%, API响应: ${apiResponseTime}ms`);

      return metric;
    } catch (error) {
      console.error('监控执行失败:', error.message);
      return null;
    }
  }

  /**
   * 检查阈值并生成告警
   * @param {Object} metric - 监控数据
   */
  _checkThresholds(metric) {
    const alerts = [];

    // 检查CPU使用率
    if (metric.cpu > this.config.thresholds.cpu) {
      alerts.push({
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'cpu',
        severity: 'warning',
        message: `CPU使用率过高: ${metric.cpu}%`,
        value: metric.cpu,
        threshold: this.config.thresholds.cpu
      });
    }

    // 检查内存使用率
    if (metric.memory > this.config.thresholds.memory) {
      alerts.push({
        id: `alert-${Date.now() + 1}`,
        timestamp: new Date().toISOString(),
        type: 'memory',
        severity: 'warning',
        message: `内存使用率过高: ${metric.memory}%`,
        value: metric.memory,
        threshold: this.config.thresholds.memory
      });
    }

    // 检查磁盘使用率
    if (metric.disk > this.config.thresholds.disk) {
      alerts.push({
        id: `alert-${Date.now() + 2}`,
        timestamp: new Date().toISOString(),
        type: 'disk',
        severity: 'critical',
        message: `磁盘使用率过高: ${metric.disk}%`,
        value: metric.disk,
        threshold: this.config.thresholds.disk
      });
    }

    // 检查API响应时间
    if (metric.apiResponseTime > this.config.thresholds.apiResponseTime) {
      alerts.push({
        id: `alert-${Date.now() + 3}`,
        timestamp: new Date().toISOString(),
        type: 'api',
        severity: 'warning',
        message: `API响应时间过长: ${metric.apiResponseTime}ms`,
        value: metric.apiResponseTime,
        threshold: this.config.thresholds.apiResponseTime
      });
    }

    // 保存告警
    if (alerts.length > 0) {
      this.alerts.push(...alerts);
      this._saveAlerts();
      this._sendAlerts(alerts);
    }
  }

  /**
   * 发送告警
   * @param {Array} alerts - 告警列表
   */
  _sendAlerts(alerts) {
    // 这里可以实现邮件通知、系统通知等
    for (const alert of alerts) {
      console.log(`[告警] ${alert.severity.toUpperCase()}: ${alert.message}`);
    }
  }

  /**
   * 保存监控数据
   */
  _saveMetrics() {
    try {
      // 只保留最近24小时的数据（按5分钟间隔，288条）
      const recentMetrics = this.metrics.slice(-288);
      fs.writeFileSync(METRICS_FILE, JSON.stringify(recentMetrics, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存监控数据失败:', error.message);
    }
  }

  /**
   * 保存告警数据
   */
  _saveAlerts() {
    try {
      // 只保留最近100条告警
      const recentAlerts = this.alerts.slice(-100);
      fs.writeFileSync(ALERTS_FILE, JSON.stringify(recentAlerts, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存告警数据失败:', error.message);
    }
  }

  /**
   * 启动监控
   */
  startMonitoring() {
    console.log('启动系统监控，每5分钟执行一次');
    
    // 立即执行一次
    this.runMonitoring();
    
    // 设置定时任务
    setInterval(() => {
      this.runMonitoring();
    }, this.config.interval);
  }

  /**
   * 获取监控数据
   * @param {number} limit - 限制返回数量
   * @returns {Array} 监控数据列表
   */
  getMetrics(limit = 100) {
    try {
      if (fs.existsSync(METRICS_FILE)) {
        const data = fs.readFileSync(METRICS_FILE, 'utf-8');
        const metrics = JSON.parse(data);
        return metrics.slice(-limit);
      }
      return [];
    } catch (error) {
      console.error('获取监控数据失败:', error.message);
      return [];
    }
  }

  /**
   * 获取告警数据
   * @param {number} limit - 限制返回数量
   * @returns {Array} 告警数据列表
   */
  getAlerts(limit = 50) {
    try {
      if (fs.existsSync(ALERTS_FILE)) {
        const data = fs.readFileSync(ALERTS_FILE, 'utf-8');
        const alerts = JSON.parse(data);
        return alerts.slice(-limit);
      }
      return [];
    } catch (error) {
      console.error('获取告警数据失败:', error.message);
      return [];
    }
  }

  /**
   * 获取系统状态摘要
   * @returns {Object} 系统状态摘要
   */
  async getSystemStatus() {
    const metric = await this.runMonitoring();
    const alerts = this.getAlerts(10);
    
    return {
      current: metric,
      alerts: alerts,
      uptime: os.uptime(),
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    };
  }
}

// 导出监控系统
module.exports = MonitoringSystem;