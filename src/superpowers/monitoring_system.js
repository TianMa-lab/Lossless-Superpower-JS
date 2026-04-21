const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class MonitoringSystem {
  constructor(config) {
    this.config = {
      monitorInterval: 60000, // 1分钟
      dataPath: 'D:\\opensource\\monitoring-data',
      logPath: 'D:\\opensource\\monitoring-logs',
      alertThresholds: {
        syncFailures: 3,
        analysisErrors: 5,
        executionTime: 600000 // 10分钟
      },
      ...config
    };
    
    // 创建数据和日志目录
    if (!fs.existsSync(this.config.dataPath)) {
      fs.mkdirSync(this.config.dataPath, { recursive: true });
    }
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
    
    // 初始化监控数据
    this.monitoringData = {
      sync: {
        total: 0,
        success: 0,
        failed: 0,
        lastSync: null
      },
      analysis: {
        total: 0,
        success: 0,
        failed: 0,
        lastAnalysis: null
      },
      comparison: {
        total: 0,
        success: 0,
        failed: 0,
        lastComparison: null
      },
      documentation: {
        total: 0,
        success: 0,
        failed: 0,
        lastDocumentation: null
      },
      execution: {
        total: 0,
        success: 0,
        failed: 0,
        lastExecution: null
      },
      system: {
        memoryUsage: 0,
        cpuUsage: 0,
        uptime: 0,
        lastUpdate: null
      },
      alerts: []
    };
    
    // 加载历史数据
    this.loadHistoricalData();
    
    // 启动监控
    this.startMonitoring();
  }

  // 加载历史数据
  loadHistoricalData() {
    const dataFile = path.join(this.config.dataPath, 'monitoring_data.json');
    if (fs.existsSync(dataFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        this.monitoringData = { ...this.monitoringData, ...data };
      } catch (error) {
        console.error('加载监控数据失败:', error.message);
      }
    }
  }

  // 保存监控数据
  saveHistoricalData() {
    const dataFile = path.join(this.config.dataPath, 'monitoring_data.json');
    try {
      fs.writeFileSync(dataFile, JSON.stringify(this.monitoringData, null, 2));
    } catch (error) {
      console.error('保存监控数据失败:', error.message);
    }
  }

  // 启动监控
  startMonitoring() {
    this.monitorInterval = setInterval(() => {
      this.collectSystemData();
      this.checkAlerts();
      this.saveHistoricalData();
    }, this.config.monitorInterval);
    
    console.log('监控系统已启动，每1分钟采集一次数据');
  }

  // 停止监控
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      console.log('监控系统已停止');
    }
  }

  // 采集系统数据
  collectSystemData() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    this.monitoringData.system = {
      memoryUsage: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100, // MB
      cpuUsage: 0, // 简化处理，实际项目中可以使用os.cpus()计算
      uptime: Math.round(uptime * 100) / 100,
      lastUpdate: new Date().toISOString()
    };
  }

  // 记录同步事件
  recordSyncEvent(success, project, duration) {
    this.monitoringData.sync.total++;
    if (success) {
      this.monitoringData.sync.success++;
    } else {
      this.monitoringData.sync.failed++;
    }
    this.monitoringData.sync.lastSync = new Date().toISOString();
    
    this.logEvent('sync', {
      project,
      success,
      duration,
      timestamp: new Date().toISOString()
    });
    
    this.checkAlerts();
  }

  // 记录分析事件
  recordAnalysisEvent(success, project, duration) {
    this.monitoringData.analysis.total++;
    if (success) {
      this.monitoringData.analysis.success++;
    } else {
      this.monitoringData.analysis.failed++;
    }
    this.monitoringData.analysis.lastAnalysis = new Date().toISOString();
    
    this.logEvent('analysis', {
      project,
      success,
      duration,
      timestamp: new Date().toISOString()
    });
    
    this.checkAlerts();
  }

  // 记录比较事件
  recordComparisonEvent(success, project, duration) {
    this.monitoringData.comparison.total++;
    if (success) {
      this.monitoringData.comparison.success++;
    } else {
      this.monitoringData.comparison.failed++;
    }
    this.monitoringData.comparison.lastComparison = new Date().toISOString();
    
    this.logEvent('comparison', {
      project,
      success,
      duration,
      timestamp: new Date().toISOString()
    });
    
    this.checkAlerts();
  }

  // 记录文档生成事件
  recordDocumentationEvent(success, duration) {
    this.monitoringData.documentation.total++;
    if (success) {
      this.monitoringData.documentation.success++;
    } else {
      this.monitoringData.documentation.failed++;
    }
    this.monitoringData.documentation.lastDocumentation = new Date().toISOString();
    
    this.logEvent('documentation', {
      success,
      duration,
      timestamp: new Date().toISOString()
    });
    
    this.checkAlerts();
  }

  // 记录执行事件
  recordExecutionEvent(success, project, duration) {
    this.monitoringData.execution.total++;
    if (success) {
      this.monitoringData.execution.success++;
    } else {
      this.monitoringData.execution.failed++;
    }
    this.monitoringData.execution.lastExecution = new Date().toISOString();
    
    this.logEvent('execution', {
      project,
      success,
      duration,
      timestamp: new Date().toISOString()
    });
    
    this.checkAlerts();
  }

  // 记录事件日志
  logEvent(type, data) {
    const logFile = path.join(this.config.logPath, `${type}_${new Date().toISOString().split('T')[0]}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    logStream.write(`${new Date().toISOString()} - ${type} - ${JSON.stringify(data)}\n`);
    logStream.end();
  }

  // 检查告警
  checkAlerts() {
    // 检查同步失败次数
    if (this.monitoringData.sync.failed >= this.config.alertThresholds.syncFailures) {
      this.addAlert('sync', '同步失败次数过多', 'error');
    }
    
    // 检查分析错误次数
    if (this.monitoringData.analysis.failed >= this.config.alertThresholds.analysisErrors) {
      this.addAlert('analysis', '分析错误次数过多', 'error');
    }
    
    // 检查内存使用
    if (this.monitoringData.system.memoryUsage > 1024) { // 1GB
      this.addAlert('system', '内存使用过高', 'warning');
    }
  }

  // 添加告警
  addAlert(type, message, severity) {
    const alert = {
      id: uuidv4(),
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    
    this.monitoringData.alerts.push(alert);
    console.log(`[${severity.toUpperCase()}] ${type}: ${message}`);
  }

  // 解决告警
  resolveAlert(alertId) {
    const alert = this.monitoringData.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
    }
  }

  // 获取监控数据
  getMonitoringData() {
    return this.monitoringData;
  }

  // 获取统计数据
  getStatistics() {
    return {
      sync: {
        successRate: this.monitoringData.sync.total > 0 ? 
          Math.round((this.monitoringData.sync.success / this.monitoringData.sync.total) * 100) : 0
      },
      analysis: {
        successRate: this.monitoringData.analysis.total > 0 ? 
          Math.round((this.monitoringData.analysis.success / this.monitoringData.analysis.total) * 100) : 0
      },
      comparison: {
        successRate: this.monitoringData.comparison.total > 0 ? 
          Math.round((this.monitoringData.comparison.success / this.monitoringData.comparison.total) * 100) : 0
      },
      documentation: {
        successRate: this.monitoringData.documentation.total > 0 ? 
          Math.round((this.monitoringData.documentation.success / this.monitoringData.documentation.total) * 100) : 0
      },
      execution: {
        successRate: this.monitoringData.execution.total > 0 ? 
          Math.round((this.monitoringData.execution.success / this.monitoringData.execution.total) * 100) : 0
      },
      system: this.monitoringData.system
    };
  }

  // 清理过期数据
  cleanupOldData(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // 清理过期告警
    this.monitoringData.alerts = this.monitoringData.alerts.filter(alert => {
      return new Date(alert.timestamp) > cutoffDate || !alert.resolved;
    });
    
    // 清理过期日志文件
    const logFiles = fs.readdirSync(this.config.logPath);
    logFiles.forEach(file => {
      const filePath = path.join(this.config.logPath, file);
      const stats = fs.statSync(filePath);
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = MonitoringSystem;