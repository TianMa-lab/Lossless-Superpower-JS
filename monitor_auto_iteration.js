/**
 * 自动迭代记录器监控工具
 * 提供监控界面和状态查看功能
 */

const fs = require('fs');
const path = require('path');
const { getAutoIterationStatus, getConfig, generateConfigReport } = require('./src');
const { getAllIterations, getStatistics } = require('./src/superpowers/iteration_manager');

// 监控工具类
class AutoIterationMonitor {
  constructor() {
    this.logFile = 'auto_iteration_monitor.log';
    this.ensureLogFile();
  }
  
  /**
   * 确保日志文件存在
   */
  ensureLogFile() {
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }
  
  /**
   * 记录日志
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    console.log(logEntry.trim());
    fs.appendFileSync(this.logFile, logEntry);
  }
  
  /**
   * 获取完整状态
   */
  getFullStatus() {
    try {
      const iterationStatus = getAutoIterationStatus();
      const config = getConfig();
      const configReport = generateConfigReport();
      const iterations = getAllIterations();
      const statistics = getStatistics();
      
      return {
        timestamp: new Date().toISOString(),
        iterationStatus,
        config,
        configReport,
        iterationStatistics: statistics,
        recentIterations: iterations.slice(0, 5),
        totalIterations: iterations.length
      };
    } catch (error) {
      this.log(`获取状态失败: ${error.message}`, 'error');
      return {
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
  
  /**
   * 生成监控报告
   */
  generateMonitorReport() {
    const status = this.getFullStatus();
    const reportPath = `auto_iteration_monitor_${new Date().toISOString().split('T')[0]}.json`;
    
    fs.writeFileSync(reportPath, JSON.stringify(status, null, 2));
    this.log(`监控报告已生成: ${reportPath}`);
    
    return status;
  }
  
  /**
   * 生成人类可读的监控报告
   */
  generateHumanReadableReport() {
    const status = this.getFullStatus();
    const reportPath = `auto_iteration_monitor_${new Date().toISOString().split('T')[0]}.md`;
    
    let report = `# 自动迭代记录器监控报告\n\n`;
    report += `生成时间: ${status.timestamp}\n\n`;
    
    if (status.error) {
      report += `## 错误\n`;
      report += `**错误信息**: ${status.error}\n\n`;
      return report;
    }
    
    // 状态信息
    report += `## 状态信息\n`;
    report += `**运行状态**: ${status.iterationStatus.isRunning ? '运行中' : '已停止'}\n`;
    report += `**变更缓冲区**: ${status.iterationStatus.changeBufferLength} 个变更\n`;
    report += `**上次迭代时间**: ${new Date(status.iterationStatus.lastIterationTime).toISOString()}\n`;
    report += `**距上次迭代**: ${(status.iterationStatus.timeSinceLastIteration / 1000 / 60).toFixed(2)} 分钟\n\n`;
    
    // 配置信息
    report += `## 配置信息\n`;
    report += `**环境**: ${status.config.environment}\n`;
    report += `**监控路径**: ${status.config.watchPaths.length} 个\n`;
    report += `**忽略路径**: ${status.config.ignorePaths.length} 个\n`;
    report += `**防抖时间**: ${status.config.debounceTime}ms\n`;
    report += `**最小变更数**: ${status.config.minChanges}\n`;
    report += `**迭代间隔**: ${(status.config.iterationInterval / 1000 / 60).toFixed(0)} 分钟\n\n`;
    
    // 迭代统计
    report += `## 迭代统计\n`;
    report += `**总迭代次数**: ${status.totalIterations}\n`;
    report += `**新增功能**: ${status.iterationStatistics.featuresAdded}\n`;
    report += `**改进功能**: ${status.iterationStatistics.featuresImproved}\n`;
    report += `**Bug修复**: ${status.iterationStatistics.bugFixes}\n`;
    report += `**修改文件**: ${status.iterationStatistics.filesModified}\n\n`;
    
    // 最近迭代
    report += `## 最近迭代\n`;
    status.recentIterations.forEach((iteration, index) => {
      report += `### ${index + 1}. ${iteration.title} (${iteration.date})\n`;
      report += `**版本**: ${iteration.version}\n`;
      report += `**描述**: ${iteration.description}\n`;
      if (iteration.features_added.length > 0) {
        report += `**新增功能**: ${iteration.features_added.join(', ')}\n`;
      }
      if (iteration.features_improved.length > 0) {
        report += `**改进功能**: ${iteration.features_improved.join(', ')}\n`;
      }
      if (iteration.bug_fixes.length > 0) {
        report += `**Bug修复**: ${iteration.bug_fixes.join(', ')}\n`;
      }
      report += `\n`;
    });
    
    fs.writeFileSync(reportPath, report);
    this.log(`人类可读监控报告已生成: ${reportPath}`);
    
    return report;
  }
  
  /**
   * 检查系统健康状态
   */
  checkHealth() {
    const status = this.getFullStatus();
    const issues = [];
    
    // 检查运行状态
    if (!status.iterationStatus.isRunning) {
      issues.push('自动迭代记录器未运行');
    }
    
    // 检查变更缓冲区
    if (status.iterationStatus.changeBufferLength > 50) {
      issues.push('变更缓冲区过大，可能存在积压');
    }
    
    // 检查上次迭代时间
    if (status.iterationStatus.timeSinceLastIteration > 24 * 60 * 60 * 1000) {
      issues.push('超过24小时未创建迭代记录');
    }
    
    // 检查配置验证
    if (!status.configReport.validation.valid) {
      issues.push('配置验证失败');
      status.configReport.validation.errors.forEach(error => {
        issues.push(`配置错误: ${error}`);
      });
    }
    
    const healthStatus = issues.length === 0 ? 'healthy' : 'unhealthy';
    
    return {
      status: healthStatus,
      issues,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * 运行监控
   */
  runMonitor() {
    this.log('开始监控自动迭代记录器...');
    
    // 生成状态报告
    const status = this.getFullStatus();
    
    // 检查健康状态
    const health = this.checkHealth();
    
    // 生成监控报告
    this.generateMonitorReport();
    this.generateHumanReadableReport();
    
    // 记录健康状态
    this.log(`健康状态: ${health.status}`);
    if (health.issues.length > 0) {
      health.issues.forEach(issue => {
        this.log(`问题: ${issue}`, 'warn');
      });
    }
    
    this.log('监控完成');
    
    return {
      status,
      health
    };
  }
}

// 全局监控实例
const monitor = new AutoIterationMonitor();

// 导出函数
function runMonitor() {
  return monitor.runMonitor();
}

function getStatus() {
  return monitor.getFullStatus();
}

function generateReport() {
  return monitor.generateMonitorReport();
}

function generateHumanReadableReport() {
  return monitor.generateHumanReadableReport();
}

function checkHealth() {
  return monitor.checkHealth();
}

// 执行监控
if (require.main === module) {
  console.log('=== 自动迭代记录器监控 ===\n');
  runMonitor();
  console.log('\n=== 监控完成 ===');
}

module.exports = {
  AutoIterationMonitor,
  monitor,
  runMonitor,
  getStatus,
  generateReport,
  generateHumanReadableReport,
  checkHealth
};