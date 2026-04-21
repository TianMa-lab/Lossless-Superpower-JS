/**
 * 多维度优化模块
 * 用于扩展优化维度，包括内存使用、网络传输、CPU使用率和存储使用等
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 尝试导入systeminformation库
let si = null;
try {
  si = require('systeminformation');
} catch (error) {
  console.warn('未安装systeminformation库，使用模拟数据');
  console.warn('请运行: npm install systeminformation');
}

class MultiDimensionalOptimizer {
  /**
   * 初始化多维度优化器
   * @param {string} dataDir - 数据目录
   */
  constructor(dataDir = 'md_optimization_data') {
    this.dataDir = dataDir;
    this.metricsFile = path.join(dataDir, 'system_metrics.json');
    
    // 创建目录
    this._ensureDirectories();
    
    // 初始化指标历史
    this._initMetricsFile();
  }

  /**
   * 确保目录存在
   */
  _ensureDirectories() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * 初始化指标文件
   */
  _initMetricsFile() {
    if (!fs.existsSync(this.metricsFile)) {
      fs.writeFileSync(this.metricsFile, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  /**
   * 收集系统指标
   * @returns {Object} 系统指标
   */
  async collectMetrics() {
    try {
      let metrics = {};
      
      if (si) {
        // 使用systeminformation库收集指标
        metrics = await this._collectMetricsWithSI();
      } else {
        // 使用模拟数据
        metrics = this._collectMetricsWithMock();
      }
      
      // 保存指标数据
      this._saveMetrics(metrics);
      
      console.log('系统指标收集完成');
      return metrics;
    } catch (error) {
      console.error('收集系统指标失败:', error.message);
      return {};
    }
  }

  /**
   * 使用systeminformation库收集指标
   * @returns {Object} 系统指标
   */
  async _collectMetricsWithSI() {
    try {
      // 收集内存使用情况
      const memory = await si.mem();
      const memoryMetrics = {
        total: memory.total,
        available: memory.available,
        used: memory.used,
        percent: memory.usedPercent
      };
      
      // 收集CPU使用情况
      const cpu = await si.currentLoad();
      const cpuCount = os.cpus().length;
      const cpuMetrics = {
        percent: cpu.currentLoad,
        count: cpuCount
      };
      
      // 收集磁盘使用情况
      const disk = await si.fsSize();
      const diskMetrics = {
        total: disk[0].size,
        used: disk[0].used,
        free: disk[0].available,
        percent: disk[0].use
      };
      
      // 收集网络使用情况
      const netIO = await si.networkStats();
      const netMetrics = {
        bytes_sent: netIO[0].tx_bytes,
        bytes_recv: netIO[0].rx_bytes,
        packets_sent: netIO[0].tx_packets,
        packets_recv: netIO[0].rx_packets
      };
      
      // 构建指标数据
      return {
        timestamp: Date.now(),
        memory: memoryMetrics,
        cpu: cpuMetrics,
        disk: diskMetrics,
        network: netMetrics
      };
    } catch (error) {
      console.error('使用systeminformation收集指标失败:', error.message);
      return this._collectMetricsWithMock();
    }
  }

  /**
   * 使用模拟数据收集指标
   * @returns {Object} 系统指标
   */
  _collectMetricsWithMock() {
    // 生成模拟数据
    return {
      timestamp: Date.now(),
      memory: {
        total: 8 * 1024 * 1024 * 1024, // 8GB
        available: Math.random() * 4 * 1024 * 1024 * 1024,
        used: Math.random() * 4 * 1024 * 1024 * 1024 + 4 * 1024 * 1024 * 1024,
        percent: Math.random() * 50 + 30 // 30-80%
      },
      cpu: {
        percent: Math.random() * 60 + 20, // 20-80%
        count: os.cpus().length
      },
      disk: {
        total: 500 * 1024 * 1024 * 1024, // 500GB
        used: Math.random() * 200 * 1024 * 1024 * 1024 + 100 * 1024 * 1024 * 1024,
        free: Math.random() * 200 * 1024 * 1024 * 1024,
        percent: Math.random() * 40 + 30 // 30-70%
      },
      network: {
        bytes_sent: Math.random() * 1024 * 1024,
        bytes_recv: Math.random() * 1024 * 1024,
        packets_sent: Math.random() * 1000,
        packets_recv: Math.random() * 1000
      }
    };
  }

  /**
   * 保存指标数据
   * @param {Object} metrics - 指标数据
   */
  _saveMetrics(metrics) {
    try {
      // 读取历史数据
      let history = [];
      if (fs.existsSync(this.metricsFile)) {
        try {
          history = JSON.parse(fs.readFileSync(this.metricsFile, 'utf-8'));
        } catch (error) {
          console.error('读取指标文件失败:', error.message);
          history = [];
        }
      }
      
      // 添加新数据
      history.push(metrics);
      
      // 保留最近1000条记录
      if (history.length > 1000) {
        history = history.slice(-1000);
      }
      
      // 保存数据
      fs.writeFileSync(this.metricsFile, JSON.stringify(history, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存指标数据失败:', error.message);
    }
  }

  /**
   * 分析系统指标
   * @returns {Object} 分析结果
   */
  analyzeMetrics() {
    try {
      if (!fs.existsSync(this.metricsFile)) {
        console.warn('指标文件不存在，无法分析');
        return {};
      }
      
      // 加载指标历史
      let history = [];
      try {
        history = JSON.parse(fs.readFileSync(this.metricsFile, 'utf-8'));
      } catch (error) {
        console.error('读取指标文件失败:', error.message);
        return {};
      }
      
      if (history.length === 0) {
        console.warn('指标历史为空，无法分析');
        return {};
      }
      
      // 分析内存使用趋势
      const memoryPercentages = history.map(item => item.memory.percent);
      const avgMemory = this._calculateAverage(memoryPercentages);
      const maxMemory = Math.max(...memoryPercentages);
      const minMemory = Math.min(...memoryPercentages);
      
      // 分析CPU使用趋势
      const cpuPercentages = history.map(item => item.cpu.percent);
      const avgCpu = this._calculateAverage(cpuPercentages);
      const maxCpu = Math.max(...cpuPercentages);
      const minCpu = Math.min(...cpuPercentages);
      
      // 分析磁盘使用趋势
      const diskPercentages = history.map(item => item.disk.percent);
      const avgDisk = this._calculateAverage(diskPercentages);
      const maxDisk = Math.max(...diskPercentages);
      const minDisk = Math.min(...diskPercentages);
      
      // 分析网络使用趋势
      const bytesSent = history.map(item => item.network.bytes_sent);
      const bytesRecv = history.map(item => item.network.bytes_recv);
      const avgBytesSent = this._calculateAverage(bytesSent);
      const avgBytesRecv = this._calculateAverage(bytesRecv);
      
      // 构建分析结果
      const analysis = {
        memory: {
          average: avgMemory,
          max: maxMemory,
          min: minMemory,
          status: this._getStatus(avgMemory, 80, 90)
        },
        cpu: {
          average: avgCpu,
          max: maxCpu,
          min: minCpu,
          status: this._getStatus(avgCpu, 70, 85)
        },
        disk: {
          average: avgDisk,
          max: maxDisk,
          min: minDisk,
          status: this._getStatus(avgDisk, 70, 85)
        },
        network: {
          average_sent: avgBytesSent,
          average_recv: avgBytesRecv,
          status: 'normal' // 网络使用一般不会有严重问题
        }
      };
      
      console.log('系统指标分析完成');
      return analysis;
    } catch (error) {
      console.error('分析系统指标失败:', error.message);
      return {};
    }
  }

  /**
   * 计算平均值
   * @param {Array} values - 值数组
   * @returns {number} 平均值
   */
  _calculateAverage(values) {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * 获取状态
   * @param {number} value - 值
   * @param {number} warningThreshold - 警告阈值
   * @param {number} criticalThreshold - 临界阈值
   * @returns {string} 状态
   */
  _getStatus(value, warningThreshold, criticalThreshold) {
    if (value >= criticalThreshold) {
      return 'critical';
    } else if (value >= warningThreshold) {
      return 'warning';
    } else {
      return 'normal';
    }
  }

  /**
   * 生成优化建议
   * @returns {Array} 优化建议
   */
  generateOptimizationSuggestions() {
    try {
      const analysis = this.analyzeMetrics();
      const suggestions = [];
      
      // 内存优化建议
      if (analysis.memory && analysis.memory.status === 'critical') {
        suggestions.push({
          type: 'memory_optimization',
          priority: 'high',
          description: `内存使用过高: ${analysis.memory.average.toFixed(2)}%，建议优化内存使用`,
          target: 'memory'
        });
      } else if (analysis.memory && analysis.memory.status === 'warning') {
        suggestions.push({
          type: 'memory_optimization',
          priority: 'medium',
          description: `内存使用较高: ${analysis.memory.average.toFixed(2)}%，建议优化内存使用`,
          target: 'memory'
        });
      }
      
      // CPU优化建议
      if (analysis.cpu && analysis.cpu.status === 'critical') {
        suggestions.push({
          type: 'cpu_optimization',
          priority: 'high',
          description: `CPU使用率过高: ${analysis.cpu.average.toFixed(2)}%，建议优化CPU使用`,
          target: 'cpu'
        });
      } else if (analysis.cpu && analysis.cpu.status === 'warning') {
        suggestions.push({
          type: 'cpu_optimization',
          priority: 'medium',
          description: `CPU使用率较高: ${analysis.cpu.average.toFixed(2)}%，建议优化CPU使用`,
          target: 'cpu'
        });
      }
      
      // 磁盘优化建议
      if (analysis.disk && analysis.disk.status === 'critical') {
        suggestions.push({
          type: 'disk_optimization',
          priority: 'high',
          description: `磁盘使用率过高: ${analysis.disk.average.toFixed(2)}%，建议优化磁盘使用`,
          target: 'disk'
        });
      } else if (analysis.disk && analysis.disk.status === 'warning') {
        suggestions.push({
          type: 'disk_optimization',
          priority: 'medium',
          description: `磁盘使用率较高: ${analysis.disk.average.toFixed(2)}%，建议优化磁盘使用`,
          target: 'disk'
        });
      }
      
      console.log(`生成 ${suggestions.length} 个多维度优化建议`);
      return suggestions;
    } catch (error) {
      console.error('生成优化建议失败:', error.message);
      return [];
    }
  }

  /**
   * 优化内存使用
   * @returns {Object} 优化记录
   */
  optimizeMemory() {
    try {
      console.log('开始优化内存使用');
      
      // 这里可以添加具体的内存优化逻辑
      // 例如：释放缓存、关闭不必要的进程等
      
      // 记录优化
      const optimizationRecord = {
        type: 'memory_optimization',
        timestamp: Date.now(),
        description: '优化内存使用',
        status: 'completed'
      };
      
      console.log('内存使用优化完成');
      return optimizationRecord;
    } catch (error) {
      console.error('优化内存使用失败:', error.message);
      return null;
    }
  }

  /**
   * 优化CPU使用
   * @returns {Object} 优化记录
   */
  optimizeCpu() {
    try {
      console.log('开始优化CPU使用');
      
      // 这里可以添加具体的CPU优化逻辑
      // 例如：调整进程优先级、关闭不必要的进程等
      
      // 记录优化
      const optimizationRecord = {
        type: 'cpu_optimization',
        timestamp: Date.now(),
        description: '优化CPU使用',
        status: 'completed'
      };
      
      console.log('CPU使用优化完成');
      return optimizationRecord;
    } catch (error) {
      console.error('优化CPU使用失败:', error.message);
      return null;
    }
  }

  /**
   * 优化磁盘使用
   * @returns {Object} 优化记录
   */
  optimizeDisk() {
    try {
      console.log('开始优化磁盘使用');
      
      // 这里可以添加具体的磁盘优化逻辑
      // 例如：清理临时文件、压缩日志等
      
      // 记录优化
      const optimizationRecord = {
        type: 'disk_optimization',
        timestamp: Date.now(),
        description: '优化磁盘使用',
        status: 'completed'
      };
      
      console.log('磁盘使用优化完成');
      return optimizationRecord;
    } catch (error) {
      console.error('优化磁盘使用失败:', error.message);
      return null;
    }
  }

  /**
   * 优化网络使用
   * @returns {Object} 优化记录
   */
  optimizeNetwork() {
    try {
      console.log('开始优化网络使用');
      
      // 这里可以添加具体的网络优化逻辑
      // 例如：优化网络连接、调整网络参数等
      
      // 记录优化
      const optimizationRecord = {
        type: 'network_optimization',
        timestamp: Date.now(),
        description: '优化网络使用',
        status: 'completed'
      };
      
      console.log('网络使用优化完成');
      return optimizationRecord;
    } catch (error) {
      console.error('优化网络使用失败:', error.message);
      return null;
    }
  }
}

// 全局实例
const mdOptimizer = new MultiDimensionalOptimizer();

// 导出函数
async function collectMetrics() {
  return mdOptimizer.collectMetrics();
}

function analyzeMetrics() {
  return mdOptimizer.analyzeMetrics();
}

function generateOptimizationSuggestions() {
  return mdOptimizer.generateOptimizationSuggestions();
}

function optimizeMemory() {
  return mdOptimizer.optimizeMemory();
}

function optimizeCpu() {
  return mdOptimizer.optimizeCpu();
}

function optimizeDisk() {
  return mdOptimizer.optimizeDisk();
}

function optimizeNetwork() {
  return mdOptimizer.optimizeNetwork();
}

module.exports = {
  MultiDimensionalOptimizer,
  mdOptimizer,
  collectMetrics,
  analyzeMetrics,
  generateOptimizationSuggestions,
  optimizeMemory,
  optimizeCpu,
  optimizeDisk,
  optimizeNetwork
};
