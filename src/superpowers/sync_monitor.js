/**
 * 同步状态监控和日志记录模块
 * 监控GitHub同步状态并记录详细日志
 */

const fs = require('fs');
const path = require('path');

class SyncMonitor {
  constructor(logDir = 'logs') {
    this.logDir = logDir;
    this.ensureLogDir();
    this.statusFile = path.join(this.logDir, 'sync_status.json');
    this.logFile = path.join(this.logDir, 'sync.log');
  }
  
  /**
   * 确保日志目录存在
   */
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  /**
   * 记录日志
   */
  log(message, level = 'info', repoId = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      repoId,
      message
    };
    
    // 输出到控制台
    const consoleMessage = `[${timestamp}] [${level.toUpperCase()}]${repoId ? ` [${repoId}]` : ''} ${message}`;
    if (level === 'error') {
      console.error(consoleMessage);
    } else {
      console.log(consoleMessage);
    }
    
    // 写入日志文件
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }
  
  /**
   * 记录同步开始
   */
  logSyncStart(repoId, repoName) {
    this.log(`开始同步仓库 ${repoName}`, 'info', repoId);
  }
  
  /**
   * 记录同步成功
   */
  logSyncSuccess(repoId, repoName, duration) {
    this.log(`仓库 ${repoName} 同步成功，耗时 ${duration}ms`, 'info', repoId);
  }
  
  /**
   * 记录同步失败
   */
  logSyncFailure(repoId, repoName, error) {
    this.log(`仓库 ${repoName} 同步失败: ${error.message}`, 'error', repoId);
  }
  
  /**
   * 记录同步状态
   */
  updateSyncStatus(repoId, status, details = {}) {
    const currentStatus = this.getSyncStatus();
    
    currentStatus.repositories[repoId] = {
      status,
      lastUpdated: new Date().toISOString(),
      ...details
    };
    
    fs.writeFileSync(this.statusFile, JSON.stringify(currentStatus, null, 2));
  }
  
  /**
   * 获取同步状态
   */
  getSyncStatus() {
    try {
      if (fs.existsSync(this.statusFile)) {
        const content = fs.readFileSync(this.statusFile, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('读取同步状态失败:', error.message);
    }
    
    return {
      lastUpdated: new Date().toISOString(),
      repositories: {}
    };
  }
  
  /**
   * 生成同步报告
   */
  generateSyncReport() {
    const status = this.getSyncStatus();
    const reportPath = path.join(this.logDir, `sync_report_${new Date().toISOString().split('T')[0]}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      status: status,
      summary: {
        totalRepositories: Object.keys(status.repositories).length,
        syncedRepositories: Object.values(status.repositories).filter(r => r.status === 'synced').length,
        failedRepositories: Object.values(status.repositories).filter(r => r.status === 'failed').length,
        syncingRepositories: Object.values(status.repositories).filter(r => r.status === 'syncing').length
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`生成同步报告: ${reportPath}`);
    
    return report;
  }
  
  /**
   * 生成人类可读的同步报告
   */
  generateHumanReadableReport() {
    const report = this.generateSyncReport();
    const reportPath = path.join(this.logDir, `sync_report_${new Date().toISOString().split('T')[0]}.md`);
    
    let mdReport = `# 同步状态报告\n\n`;
    mdReport += `生成时间: ${report.timestamp}\n\n`;
    
    mdReport += `## 摘要\n`;
    mdReport += `**总仓库数**: ${report.summary.totalRepositories}\n`;
    mdReport += `**同步成功**: ${report.summary.syncedRepositories}\n`;
    mdReport += `**同步失败**: ${report.summary.failedRepositories}\n`;
    mdReport += `**同步中**: ${report.summary.syncingRepositories}\n\n`;
    
    mdReport += `## 详细状态\n`;
    Object.entries(report.status.repositories).forEach(([repoId, repoStatus]) => {
      mdReport += `### ${repoId}\n`;
      mdReport += `**状态**: ${repoStatus.status}\n`;
      mdReport += `**最后更新**: ${repoStatus.lastUpdated}\n`;
      if (repoStatus.duration) {
        mdReport += `**同步耗时**: ${repoStatus.duration}ms\n`;
      }
      if (repoStatus.error) {
        mdReport += `**错误信息**: ${repoStatus.error}\n`;
      }
      mdReport += `\n`;
    });
    
    fs.writeFileSync(reportPath, mdReport);
    this.log(`生成人类可读同步报告: ${reportPath}`);
    
    return mdReport;
  }
  
  /**
   * 清理旧日志
   */
  cleanupOldLogs(days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const files = fs.readdirSync(this.logDir);
      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.log(`清理旧日志文件: ${file}`);
        }
      });
    } catch (error) {
      this.log(`清理旧日志失败: ${error.message}`, 'error');
    }
  }
  
  /**
   * 监控同步状态
   */
  monitorSyncStatus() {
    const status = this.getSyncStatus();
    
    // 检查长时间同步中的仓库
    Object.entries(status.repositories).forEach(([repoId, repoStatus]) => {
      if (repoStatus.status === 'syncing') {
        const lastUpdated = new Date(repoStatus.lastUpdated);
        const now = new Date();
        const diffMs = now - lastUpdated;
        
        // 超过30分钟仍在同步中，可能有问题
        if (diffMs > 30 * 60 * 1000) {
          this.log(`仓库 ${repoId} 同步时间过长，可能存在问题`, 'warn');
        }
      }
    });
  }
  
  /**
   * 获取同步统计信息
   */
  getSyncStatistics() {
    const status = this.getSyncStatus();
    const stats = {
      total: Object.keys(status.repositories).length,
      statusCounts: {},
      lastSyncTimes: {}
    };
    
    Object.entries(status.repositories).forEach(([repoId, repoStatus]) => {
      // 统计状态
      stats.statusCounts[repoStatus.status] = (stats.statusCounts[repoStatus.status] || 0) + 1;
      
      // 记录最后同步时间
      stats.lastSyncTimes[repoId] = repoStatus.lastUpdated;
    });
    
    return stats;
  }
}

// 导出模块
module.exports = {
  SyncMonitor
};