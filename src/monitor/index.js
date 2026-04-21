const fs = require("fs");
const path = require("path");

class DAGKGMonitor {
  constructor() {
    this.metrics = {
      nodeCount: 0,
      edgeCount: 0,
      mappingCoverage: 0,
      syncStatus: "idle",
      lastSyncTime: null,
      errorCount: 0
    };
    this.alerts = [];
    this.logs = [];
  }

  // 初始化监控
  init() {
    console.log("监控系统初始化");
    this.startMonitoring();
    return true;
  }

  // 开始监控
  startMonitoring() {
    // 每5秒检查一次状态
    setInterval(() => {
      this.checkStatus();
    }, 5000);
  }

  // 检查状态
  async checkStatus() {
    try {
      // 这里可以添加实际的状态检查逻辑
      console.log("检查系统状态...");
      
      // 模拟状态更新
      this.metrics.nodeCount = 12;
      this.metrics.edgeCount = 9;
      this.metrics.mappingCoverage = 100;
      this.metrics.syncStatus = "synced";
      this.metrics.lastSyncTime = new Date().toISOString();
      
      // 检查是否需要告警
      this.checkAlerts();
      
      // 记录状态
      this.logStatus();
    } catch (error) {
      console.error("检查状态失败:", error.message);
      this.metrics.errorCount++;
      this.addAlert("error", "状态检查失败", error.message);
    }
  }

  // 检查告警
  checkAlerts() {
    // 检查节点数
    if (this.metrics.nodeCount === 0) {
      this.addAlert("warning", "节点数为0", "知识图谱中没有节点");
    }
    
    // 检查边数
    if (this.metrics.edgeCount === 0) {
      this.addAlert("warning", "边数为0", "知识图谱中没有边");
    }
    
    // 检查映射覆盖率
    if (this.metrics.mappingCoverage < 90) {
      this.addAlert("warning", "映射覆盖率低", "当前覆盖率: " + this.metrics.mappingCoverage + "%");
    }
    
    // 检查同步状态
    if (this.metrics.syncStatus !== "synced") {
      this.addAlert("info", "同步状态", "当前状态: " + this.metrics.syncStatus);
    }
  }

  // 添加告警
  addAlert(level, title, message) {
    const alert = {
      id: Date.now(),
      level: level,
      title: title,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    this.alerts.push(alert);
    
    // 限制告警数量
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    console.log("[" + level.toUpperCase() + "] " + title + ": " + message);
  }

  // 记录状态
  logStatus() {
    const logEntry = {
      timestamp: new Date().toISOString(),
      metrics: { ...this.metrics },
      alertCount: this.alerts.length
    };
    
    this.logs.push(logEntry);
    
    // 限制日志数量
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    // 保存日志到文件
    this.saveLogs();
  }

  // 保存日志
  saveLogs() {
    const logFile = path.join(__dirname, "logs", "monitor_logs.json");
    if (!fs.existsSync(path.dirname(logFile))) {
      fs.mkdirSync(path.dirname(logFile), { recursive: true });
    }
    
    fs.writeFileSync(logFile, JSON.stringify(this.logs, null, 2), "utf-8");
  }

  // 获取当前状态
  getStatus() {
    return {
      metrics: { ...this.metrics },
      alerts: this.alerts.slice(-10), // 返回最近10个告警
      lastUpdated: new Date().toISOString()
    };
  }

  // 清除告警
  clearAlerts() {
    this.alerts = [];
    console.log("告警已清除");
  }

  // 导出监控数据
  exportData() {
    const exportData = {
      metrics: { ...this.metrics },
      alerts: this.alerts,
      logs: this.logs,
      exportTime: new Date().toISOString()
    };
    
    const exportFile = path.join(__dirname, "exports", "monitor_export_" + Date.now() + ".json");
    if (!fs.existsSync(path.dirname(exportFile))) {
      fs.mkdirSync(path.dirname(exportFile), { recursive: true });
    }
    
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2), "utf-8");
    console.log("监控数据已导出到:", exportFile);
    
    return exportFile;
  }
}

const dagkgMonitor = new DAGKGMonitor();

module.exports = {
  DAGKGMonitor,
  dagkgMonitor
};
