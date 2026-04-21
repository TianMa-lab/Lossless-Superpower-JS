/**
 * 事件监控模块
 * 用于实时监控事件触发情况，提供监控面板和调试工具
 */

const fs = require('fs');

class EventMonitor {
  /**
   * 初始化事件监控器
   */
  constructor() {
    // 事件统计数据
    this.eventStats = {
      total_events: 0,
      events_per_type: {},
      processing_time: {},
      success_count: 0,
      error_count: 0,
      queue_size: 0
    };
    // 事件处理历史
    this.eventHistory = [];
    // 最大历史记录数
    this.maxHistorySize = 1000;
    // 监控定时器
    this.monitorInterval = null;
    // 锁标志
    this.isLocked = false;
  }

  /**
   * 开始监控
   */
  startMonitoring() {
    if (this.monitorInterval) {
      console.log('事件监控已经启动');
      return;
    }

    this.monitorInterval = setInterval(() => {
      try {
        this._logMonitoringData();
      } catch (error) {
        console.error('监控过程中出错:', error.message);
      }
    }, 10000); // 每10秒记录一次监控数据

    console.log('事件监控已启动');
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('事件监控已停止');
    } else {
      console.log('事件监控未启动');
    }
  }

  /**
   * 记录事件处理情况
   * @param {string} eventName - 事件名称
   * @param {number} processingTime - 处理时间（秒）
   * @param {boolean} success - 是否成功
   */
  recordEvent(eventName, processingTime, success) {
    this._lock();
    try {
      // 更新统计数据
      this.eventStats.total_events += 1;
      
      // 更新事件类型统计
      if (!this.eventStats.events_per_type[eventName]) {
        this.eventStats.events_per_type[eventName] = 0;
      }
      this.eventStats.events_per_type[eventName] += 1;
      
      // 更新处理时间统计
      if (!this.eventStats.processing_time[eventName]) {
        this.eventStats.processing_time[eventName] = [];
      }
      this.eventStats.processing_time[eventName].push(processingTime);
      
      // 更新成功/失败统计
      if (success) {
        this.eventStats.success_count += 1;
      } else {
        this.eventStats.error_count += 1;
      }
      
      // 记录事件历史
      const eventRecord = {
        event_name: eventName,
        processing_time: processingTime,
        success: success,
        timestamp: new Date().toISOString()
      };
      this.eventHistory.push(eventRecord);
      
      // 限制历史记录大小
      if (this.eventHistory.length > this.maxHistorySize) {
        this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
      }
    } finally {
      this._unlock();
    }
  }

  /**
   * 更新队列大小
   * @param {number} size - 队列大小
   */
  updateQueueSize(size) {
    this._lock();
    try {
      this.eventStats.queue_size = size;
    } finally {
      this._unlock();
    }
  }

  /**
   * 记录监控数据
   */
  _logMonitoringData() {
    this._lock();
    try {
      // 计算平均处理时间
      const avgProcessingTime = {};
      for (const eventName in this.eventStats.processing_time) {
        const times = this.eventStats.processing_time[eventName];
        if (times.length > 0) {
          avgProcessingTime[eventName] = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
      }
      
      // 计算成功率
      const totalProcessed = this.eventStats.success_count + this.eventStats.error_count;
      const successRate = totalProcessed > 0 ? (this.eventStats.success_count / totalProcessed * 100) : 0;
      
      // 构建监控数据
      const monitoringData = {
        timestamp: new Date().toISOString(),
        total_events: this.eventStats.total_events,
        events_per_type: this.eventStats.events_per_type,
        avg_processing_time: avgProcessingTime,
        success_count: this.eventStats.success_count,
        error_count: this.eventStats.error_count,
        success_rate: successRate,
        queue_size: this.eventStats.queue_size
      };
      
      console.log('事件监控数据:', JSON.stringify(monitoringData, null, 2));
    } finally {
      this._unlock();
    }
  }

  /**
   * 获取监控数据
   * @returns {Object} 监控数据
   */
  getMonitoringData() {
    this._lock();
    try {
      // 计算平均处理时间
      const avgProcessingTime = {};
      for (const eventName in this.eventStats.processing_time) {
        const times = this.eventStats.processing_time[eventName];
        if (times.length > 0) {
          avgProcessingTime[eventName] = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
      }
      
      // 计算成功率
      const totalProcessed = this.eventStats.success_count + this.eventStats.error_count;
      const successRate = totalProcessed > 0 ? (this.eventStats.success_count / totalProcessed * 100) : 0;
      
      // 构建监控数据
      const monitoringData = {
        timestamp: new Date().toISOString(),
        total_events: this.eventStats.total_events,
        events_per_type: this.eventStats.events_per_type,
        avg_processing_time: avgProcessingTime,
        success_count: this.eventStats.success_count,
        error_count: this.eventStats.error_count,
        success_rate: successRate,
        queue_size: this.eventStats.queue_size
      };
      
      return monitoringData;
    } finally {
      this._unlock();
    }
  }

  /**
   * 获取事件历史
   * @param {number} limit - 限制返回的历史记录数
   * @returns {Array} 事件历史
   */
  getEventHistory(limit = null) {
    this._lock();
    try {
      if (limit) {
        return this.eventHistory.slice(-limit);
      }
      return [...this.eventHistory];
    } finally {
      this._unlock();
    }
  }

  /**
   * 清空统计数据
   */
  clearStats() {
    this._lock();
    try {
      this.eventStats = {
        total_events: 0,
        events_per_type: {},
        processing_time: {},
        success_count: 0,
        error_count: 0,
        queue_size: 0
      };
      this.eventHistory = [];
      console.log('统计数据已清空');
    } finally {
      this._unlock();
    }
  }

  /**
   * 导出统计数据
   * @param {string} filename - 导出文件名
   */
  exportStats(filename) {
    this._lock();
    try {
      const statsData = {
        event_stats: this.eventStats,
        event_history: this.eventHistory,
        export_time: new Date().toISOString()
      };
      
      fs.writeFileSync(filename, JSON.stringify(statsData, null, 2), 'utf-8');
      
      console.log(`统计数据导出成功: ${filename}`);
    } catch (error) {
      console.error(`导出统计数据失败: ${error.message}`);
    } finally {
      this._unlock();
    }
  }

  /**
   * 锁定操作
   */
  _lock() {
    while (this.isLocked) {
      // 简单的自旋锁
    }
    this.isLocked = true;
  }

  /**
   * 解锁操作
   */
  _unlock() {
    this.isLocked = false;
  }
}

// 全局事件监控器
const eventMonitor = new EventMonitor();

// 导出函数
function startMonitoring() {
  eventMonitor.startMonitoring();
}

function stopMonitoring() {
  eventMonitor.stopMonitoring();
}

function recordEvent(eventName, processingTime, success) {
  eventMonitor.recordEvent(eventName, processingTime, success);
}

function updateQueueSize(size) {
  eventMonitor.updateQueueSize(size);
}

function getMonitoringData() {
  return eventMonitor.getMonitoringData();
}

function getEventHistory(limit = null) {
  return eventMonitor.getEventHistory(limit);
}

function clearStats() {
  eventMonitor.clearStats();
}

function exportStats(filename) {
  eventMonitor.exportStats(filename);
}

module.exports = {
  EventMonitor,
  eventMonitor,
  startMonitoring,
  stopMonitoring,
  recordEvent,
  updateQueueSize,
  getMonitoringData,
  getEventHistory,
  clearStats,
  exportStats
};
