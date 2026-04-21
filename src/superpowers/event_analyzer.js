/**
 * 事件分析模块
 * 用于分析事件触发的历史记录，识别模式和问题
 */

const fs = require('fs');

class EventAnalyzer {
  /**
   * 初始化事件分析器
   */
  constructor() {}

  /**
   * 分析事件触发模式
   * @param {Array} eventHistory - 事件历史记录
   * @returns {Object} 事件模式分析结果
   */
  analyzeEventPatterns(eventHistory) {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    // 按事件类型分组
    const eventsByType = {};
    for (const event of eventHistory) {
      const eventName = event.event_name;
      if (!eventsByType[eventName]) {
        eventsByType[eventName] = [];
      }
      eventsByType[eventName].push(event);
    }
    
    // 分析每种事件类型的模式
    const patterns = {};
    for (const eventName in eventsByType) {
      const events = eventsByType[eventName];
      
      // 计算事件频率
      const timestamps = events.map(event => new Date(event.timestamp));
      timestamps.sort((a, b) => a - b);
      
      // 计算时间间隔
      const intervals = [];
      for (let i = 1; i < timestamps.length; i++) {
        const interval = (timestamps[i] - timestamps[i-1]) / 1000; // 转换为秒
        intervals.push(interval);
      }
      
      // 计算统计数据
      const patternData = {
        count: events.length,
        first_occurrence: timestamps[0] ? timestamps[0].toISOString() : null,
        last_occurrence: timestamps[timestamps.length - 1] ? timestamps[timestamps.length - 1].toISOString() : null,
        success_rate: events.filter(event => event.success !== false).length / events.length * 100,
        avg_processing_time: this._calculateMean(events.map(event => event.processing_time || 0))
      };
      
      if (intervals.length > 0) {
        patternData.avg_interval = this._calculateMean(intervals);
        patternData.min_interval = Math.min(...intervals);
        patternData.max_interval = Math.max(...intervals);
      }
      
      patterns[eventName] = patternData;
    }
    
    return patterns;
  }

  /**
   * 分析事件处理性能
   * @param {Array} eventHistory - 事件历史记录
   * @returns {Object} 性能分析结果
   */
  analyzeEventPerformance(eventHistory) {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    // 按事件类型分组
    const eventsByType = {};
    for (const event of eventHistory) {
      const eventName = event.event_name;
      if (!eventsByType[eventName]) {
        eventsByType[eventName] = [];
      }
      eventsByType[eventName].push(event);
    }
    
    // 分析每种事件类型的性能
    const performance = {};
    for (const eventName in eventsByType) {
      const events = eventsByType[eventName];
      
      // 提取处理时间
      const processingTimes = events.map(event => event.processing_time || 0);
      
      // 计算统计数据
      if (processingTimes.length > 0) {
        performance[eventName] = {
          count: events.length,
          avg_processing_time: this._calculateMean(processingTimes),
          min_processing_time: Math.min(...processingTimes),
          max_processing_time: Math.max(...processingTimes),
          std_processing_time: processingTimes.length > 1 ? this._calculateStd(processingTimes) : 0,
          median_processing_time: this._calculateMedian(processingTimes)
        };
      } else {
        performance[eventName] = {
          count: 0,
          avg_processing_time: 0,
          min_processing_time: 0,
          max_processing_time: 0,
          std_processing_time: 0,
          median_processing_time: 0
        };
      }
    }
    
    return performance;
  }

  /**
   * 分析事件处理错误
   * @param {Array} eventHistory - 事件历史记录
   * @returns {Object} 错误分析结果
   */
  analyzeEventErrors(eventHistory) {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    // 按事件类型分组
    const eventsByType = {};
    for (const event of eventHistory) {
      const eventName = event.event_name;
      if (!eventsByType[eventName]) {
        eventsByType[eventName] = [];
      }
      eventsByType[eventName].push(event);
    }
    
    // 分析每种事件类型的错误
    const errors = {};
    for (const eventName in eventsByType) {
      const events = eventsByType[eventName];
      
      // 提取错误事件
      const errorEvents = events.filter(event => event.success !== true);
      
      // 计算错误统计
      const errorCount = errorEvents.length;
      const totalCount = events.length;
      const errorRate = totalCount > 0 ? (errorCount / totalCount * 100) : 0;
      
      errors[eventName] = {
        total_count: totalCount,
        error_count: errorCount,
        error_rate: errorRate
      };
    }
    
    return errors;
  }

  /**
   * 分析事件相关性
   * @param {Array} eventHistory - 事件历史记录
   * @returns {Object} 相关性分析结果
   */
  analyzeEventCorrelations(eventHistory) {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    // 按时间排序
    const sortedEvents = [...eventHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // 分析事件序列
    const eventSequences = {};
    const windowSeconds = 5; // 5秒窗口内的事件视为相关
    
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const eventName = event.event_name;
      const eventTime = new Date(event.timestamp);
      
      // 查找窗口内的后续事件
      for (let j = i + 1; j < sortedEvents.length; j++) {
        const nextEvent = sortedEvents[j];
        const nextEventName = nextEvent.event_name;
        const nextEventTime = new Date(nextEvent.timestamp);
        
        // 检查时间窗口
        const timeDiff = (nextEventTime - eventTime) / 1000; // 转换为秒
        if (timeDiff > windowSeconds) {
          break;
        }
        
        // 记录事件序列
        const sequenceKey = `${eventName} -> ${nextEventName}`;
        eventSequences[sequenceKey] = (eventSequences[sequenceKey] || 0) + 1;
      }
    }
    
    // 按频率排序
    const sortedSequences = Object.entries(eventSequences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20); // 返回前20个最常见的序列
    
    return { event_sequences: sortedSequences };
  }

  /**
   * 分析事件趋势
   * @param {Array} eventHistory - 事件历史记录
   * @param {string} timeWindow - 时间窗口，可选值: "hour", "day", "week"
   * @returns {Object} 趋势分析结果
   */
  analyzeEventTrends(eventHistory, timeWindow = "day") {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    // 按时间窗口分组
    const timeGroups = {};
    for (const event of eventHistory) {
      const eventTime = new Date(event.timestamp);
      const eventName = event.event_name;
      
      // 根据时间窗口格式化时间
      let groupKey;
      if (timeWindow === "hour") {
        groupKey = eventTime.toISOString().substring(0, 13) + ":00";
      } else if (timeWindow === "day") {
        groupKey = eventTime.toISOString().substring(0, 10);
      } else if (timeWindow === "week") {
        // 计算周的开始（周一）
        const weekStart = new Date(eventTime);
        weekStart.setDate(eventTime.getDate() - eventTime.getDay() + 1);
        groupKey = weekStart.toISOString().substring(0, 10);
      } else {
        groupKey = eventTime.toISOString().substring(0, 10);
      }
      
      // 记录事件
      if (!timeGroups[groupKey]) {
        timeGroups[groupKey] = {};
      }
      if (!timeGroups[groupKey][eventName]) {
        timeGroups[groupKey][eventName] = 0;
      }
      timeGroups[groupKey][eventName]++;
    }
    
    return timeGroups;
  }

  /**
   * 生成综合分析报告
   * @param {Array} eventHistory - 事件历史记录
   * @returns {Object} 综合分析报告
   */
  generateAnalysisReport(eventHistory) {
    if (!eventHistory || eventHistory.length === 0) {
      return { message: '没有事件历史数据' };
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      total_events: eventHistory.length,
      event_patterns: this.analyzeEventPatterns(eventHistory),
      performance_analysis: this.analyzeEventPerformance(eventHistory),
      error_analysis: this.analyzeEventErrors(eventHistory),
      event_correlations: this.analyzeEventCorrelations(eventHistory),
      hourly_trends: this.analyzeEventTrends(eventHistory, "hour"),
      daily_trends: this.analyzeEventTrends(eventHistory, "day")
    };
    
    return report;
  }

  /**
   * 导出分析报告
   * @param {Object} report - 分析报告
   * @param {string} filename - 导出文件名
   */
  exportAnalysisReport(report, filename) {
    try {
      fs.writeFileSync(filename, JSON.stringify(report, null, 2), 'utf-8');
      console.log(`分析报告导出成功: ${filename}`);
    } catch (error) {
      console.error(`导出分析报告失败: ${error.message}`);
    }
  }

  /**
   * 计算平均值
   * @param {Array} values - 值数组
   * @returns {number} 平均值
   */
  _calculateMean(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * 计算标准差
   * @param {Array} values - 值数组
   * @returns {number} 标准差
   */
  _calculateStd(values) {
    if (values.length <= 1) return 0;
    const mean = this._calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  /**
   * 计算中位数
   * @param {Array} values - 值数组
   * @returns {number} 中位数
   */
  _calculateMedian(values) {
    if (values.length === 0) return 0;
    const sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
    } else {
      return sortedValues[mid];
    }
  }
}

// 全局事件分析器
const eventAnalyzer = new EventAnalyzer();

// 导出函数
function analyzeEventPatterns(eventHistory) {
  return eventAnalyzer.analyzeEventPatterns(eventHistory);
}

function analyzeEventPerformance(eventHistory) {
  return eventAnalyzer.analyzeEventPerformance(eventHistory);
}

function analyzeEventErrors(eventHistory) {
  return eventAnalyzer.analyzeEventErrors(eventHistory);
}

function analyzeEventCorrelations(eventHistory) {
  return eventAnalyzer.analyzeEventCorrelations(eventHistory);
}

function analyzeEventTrends(eventHistory, timeWindow = "day") {
  return eventAnalyzer.analyzeEventTrends(eventHistory, timeWindow);
}

function generateAnalysisReport(eventHistory) {
  return eventAnalyzer.generateAnalysisReport(eventHistory);
}

function exportAnalysisReport(report, filename) {
  eventAnalyzer.exportAnalysisReport(report, filename);
}

function analyzePerformanceTrends(eventHistory) {
  return eventAnalyzer.analyzeEventTrends(eventHistory);
}

function detectAnomalies(eventHistory) {
  if (!eventHistory || eventHistory.length === 0) {
    return [];
  }
  
  // 按事件类型分组
  const eventsByType = {};
  for (const event of eventHistory) {
    const eventName = event.event_name;
    if (!eventsByType[eventName]) {
      eventsByType[eventName] = [];
    }
    eventsByType[eventName].push(event);
  }
  
  // 检测异常
  const anomalies = [];
  for (const eventName in eventsByType) {
    const events = eventsByType[eventName];
    const processingTimes = events.map(event => event.processing_time || 0);
    if (processingTimes.length > 1) {
      const mean = eventAnalyzer._calculateMean(processingTimes);
      const std = eventAnalyzer._calculateStd(processingTimes);
      const threshold = mean + 2 * std; // 2倍标准差作为阈值
      
      for (const event of events) {
        const processingTime = event.processing_time || 0;
        if (processingTime > threshold) {
          anomalies.push({
            type: 'processing_time_anomaly',
            severity: 'high',
            message: `事件 ${eventName} 处理时间异常: ${processingTime.toFixed(3)}秒`,
            timestamp: event.timestamp
          });
        }
      }
    }
  }
  
  return anomalies;
}

module.exports = {
  EventAnalyzer,
  eventAnalyzer,
  analyzeEventPatterns,
  analyzeEventPerformance,
  analyzeEventErrors,
  analyzeEventCorrelations,
  analyzeEventTrends,
  generateAnalysisReport,
  exportAnalysisReport,
  analyzePerformanceTrends,
  detectAnomalies
};
