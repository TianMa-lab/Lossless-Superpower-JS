/**
 * 机器学习模块
 * 用于预测系统性能和识别潜在问题
 */

const fs = require('fs');
const path = require('path');

// 尝试导入依赖
let ML_ENABLED = false;
let RandomForestRegression = null;
let StandardScaler = null;

try {
  // 尝试加载mljs库
  const ml = require('ml');
  if (ml.RandomForestRegression && ml.StandardScaler) {
    RandomForestRegression = ml.RandomForestRegression;
    StandardScaler = ml.StandardScaler;
    ML_ENABLED = true;
  }
} catch (error) {
  console.warn('未安装必要的机器学习依赖，机器学习功能将被禁用');
  console.warn('请运行: npm install ml');
}

class MachineLearningEngine {
  /**
   * 初始化机器学习引擎
   * @param {string} dataDir - 数据目录
   */
  constructor(dataDir = 'ml_data') {
    this.dataDir = dataDir;
    this.modelDir = path.join(dataDir, 'models');
    this.dataFile = path.join(dataDir, 'system_data.json');
    
    // 创建目录
    this._ensureDirectories();
    
    // 初始化模型
    this.models = {};
    this.scaler = null;
  }

  /**
   * 确保目录存在
   */
  _ensureDirectories() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.modelDir)) {
      fs.mkdirSync(this.modelDir, { recursive: true });
    }
  }

  /**
   * 收集系统数据
   * @param {Object} monitoringData - 监控数据
   */
  collectData(monitoringData) {
    if (!ML_ENABLED) {
      console.warn('机器学习功能被禁用，跳过数据收集');
      return;
    }
    
    try {
      // 准备数据
      const data = {
        timestamp: Date.now(),
        total_events: monitoringData.total_events || 0,
        success_rate: monitoringData.success_rate || 0,
        error_count: monitoringData.error_count || 0,
        queue_size: monitoringData.queue_size || 0,
        avg_processing_time: this._calculateAvgProcessingTime(monitoringData.avg_processing_time),
        cpu_percent: monitoringData.system_stats?.cpu_percent || 0,
        memory_percent: monitoringData.system_stats?.memory_percent || 0,
        disk_percent: monitoringData.system_stats?.disk_percent || 0
      };
      
      // 保存数据
      let existingData = [];
      if (fs.existsSync(this.dataFile)) {
        try {
          existingData = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
        } catch (error) {
          console.error('读取数据文件失败:', error.message);
          existingData = [];
        }
      }
      
      existingData.push(data);
      
      // 只保留最近1000条数据
      if (existingData.length > 1000) {
        existingData = existingData.slice(-1000);
      }
      
      fs.writeFileSync(this.dataFile, JSON.stringify(existingData, null, 2), 'utf-8');
      console.log('系统数据收集完成');
    } catch (error) {
      console.error('收集数据失败:', error.message);
    }
  }

  /**
   * 计算平均处理时间
   * @param {Object} processingTimes - 处理时间对象
   * @returns {number} 平均处理时间
   */
  _calculateAvgProcessingTime(processingTimes) {
    if (!processingTimes || typeof processingTimes !== 'object') {
      return 0;
    }
    
    const values = Object.values(processingTimes);
    if (values.length === 0) {
      return 0;
    }
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  /**
   * 训练模型
   */
  trainModels() {
    if (!ML_ENABLED) {
      console.warn('机器学习功能被禁用，跳过模型训练');
      return;
    }
    
    try {
      if (!fs.existsSync(this.dataFile)) {
        console.warn('数据文件不存在，无法训练模型');
        return;
      }
      
      // 加载数据
      const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
      
      // 确保数据充足
      if (data.length < 10) {
        console.warn('数据量不足，无法训练模型');
        return;
      }
      
      // 准备特征和目标变量
      const features = ['total_events', 'error_count', 'queue_size', 'cpu_percent', 'memory_percent', 'disk_percent'];
      const X = [];
      const ySuccess = [];
      const yTime = [];
      
      for (const item of data) {
        const featureVector = features.map(feature => item[feature] || 0);
        X.push(featureVector);
        ySuccess.push(item.success_rate || 0);
        yTime.push(item.avg_processing_time || 0);
      }
      
      // 数据标准化
      this.scaler = new StandardScaler();
      const XScaled = this.scaler.fit_transform(X);
      
      // 训练成功率预测模型
      const modelSuccess = new RandomForestRegression({
        nEstimators: 100,
        maxDepth: 10,
        randomSeed: 42
      });
      modelSuccess.train(XScaled, ySuccess);
      
      // 训练处理时间预测模型
      const modelTime = new RandomForestRegression({
        nEstimators: 100,
        maxDepth: 10,
        randomSeed: 42
      });
      modelTime.train(XScaled, yTime);
      
      // 保存模型
      this._saveModel('success_rate_model', { model: modelSuccess, scaler: this.scaler });
      this._saveModel('processing_time_model', { model: modelTime, scaler: this.scaler });
      
      this.models.success_rate = modelSuccess;
      this.models.processing_time = modelTime;
      
      console.log('模型训练完成');
    } catch (error) {
      console.error('训练模型失败:', error.message);
    }
  }

  /**
   * 保存模型
   * @param {string} name - 模型名称
   * @param {Object} modelData - 模型数据
   */
  _saveModel(name, modelData) {
    try {
      const modelPath = path.join(this.modelDir, `${name}.json`);
      fs.writeFileSync(modelPath, JSON.stringify(modelData, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存模型失败:', error.message);
    }
  }

  /**
   * 加载模型
   */
  loadModels() {
    try {
      const successModelPath = path.join(this.modelDir, 'success_rate_model.json');
      const timeModelPath = path.join(this.modelDir, 'processing_time_model.json');
      
      if (fs.existsSync(successModelPath)) {
        const modelData = JSON.parse(fs.readFileSync(successModelPath, 'utf-8'));
        this.models.success_rate = modelData.model;
        this.scaler = modelData.scaler;
        console.log('成功率预测模型加载成功');
      }
      
      if (fs.existsSync(timeModelPath)) {
        const modelData = JSON.parse(fs.readFileSync(timeModelPath, 'utf-8'));
        this.models.processing_time = modelData.model;
        this.scaler = modelData.scaler;
        console.log('处理时间预测模型加载成功');
      }
    } catch (error) {
      console.error('加载模型失败:', error.message);
    }
  }

  /**
   * 预测系统性能
   * @param {Object} inputData - 输入数据
   * @returns {Object} 预测结果
   */
  predict(inputData) {
    if (!ML_ENABLED) {
      console.warn('机器学习功能被禁用，跳过预测');
      return {};
    }
    
    try {
      if (Object.keys(this.models).length === 0) {
        this.loadModels();
      }
      
      if (Object.keys(this.models).length === 0) {
        console.warn('模型未加载，无法进行预测');
        return {};
      }
      
      // 准备输入数据
      const features = ['total_events', 'error_count', 'queue_size', 'cpu_percent', 'memory_percent', 'disk_percent'];
      const inputFeatures = features.map(feature => inputData[feature] || 0);
      
      // 数据标准化
      let inputScaled = [inputFeatures];
      if (this.scaler) {
        inputScaled = this.scaler.transform(inputScaled);
      }
      
      // 预测
      const predictions = {};
      
      if (this.models.success_rate) {
        predictions.success_rate = this.models.success_rate.predict(inputScaled)[0];
      }
      
      if (this.models.processing_time) {
        predictions.processing_time = this.models.processing_time.predict(inputScaled)[0];
      }
      
      console.log('预测结果:', predictions);
      return predictions;
    } catch (error) {
      console.error('预测失败:', error.message);
      return {};
    }
  }

  /**
   * 检测异常
   * @param {Object} currentData - 当前数据
   * @returns {Array} 异常列表
   */
  detectAnomalies(currentData) {
    if (!ML_ENABLED) {
      console.warn('机器学习功能被禁用，跳过异常检测');
      return [];
    }
    
    try {
      if (!fs.existsSync(this.dataFile)) {
        console.warn('数据文件不存在，无法检测异常');
        return [];
      }
      
      // 加载历史数据
      const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
      
      // 计算统计信息
      const anomalies = [];
      
      // 检查成功率
      const successRates = data.map(item => item.success_rate || 0).filter(val => val > 0);
      if (successRates.length > 0) {
        const meanSuccess = this._calculateMean(successRates);
        const stdSuccess = this._calculateStd(successRates);
        const thresholdSuccess = meanSuccess - 2 * stdSuccess; // 2倍标准差作为阈值
        
        const currentSuccessRate = currentData.success_rate || 0;
        if (currentSuccessRate < thresholdSuccess) {
          anomalies.push({
            type: 'success_rate_anomaly',
            severity: 'high',
            message: `成功率异常: ${currentSuccessRate.toFixed(2)}%, 低于阈值: ${thresholdSuccess.toFixed(2)}%`,
            timestamp: Date.now()
          });
        }
      }
      
      // 检查处理时间
      const processingTimes = data.map(item => item.avg_processing_time || 0).filter(val => val > 0);
      if (processingTimes.length > 0) {
        const meanTime = this._calculateMean(processingTimes);
        const stdTime = this._calculateStd(processingTimes);
        const thresholdTime = meanTime + 2 * stdTime; // 2倍标准差作为阈值
        
        const currentTime = this._calculateAvgProcessingTime(currentData.avg_processing_time);
        if (currentTime > thresholdTime) {
          anomalies.push({
            type: 'processing_time_anomaly',
            severity: 'high',
            message: `处理时间异常: ${currentTime.toFixed(3)}秒, 超过阈值: ${thresholdTime.toFixed(3)}秒`,
            timestamp: Date.now()
          });
        }
      }
      
      // 检查队列大小
      const queueSizes = data.map(item => item.queue_size || 0);
      if (queueSizes.length > 0) {
        const meanQueue = this._calculateMean(queueSizes);
        const stdQueue = this._calculateStd(queueSizes);
        const thresholdQueue = meanQueue + 2 * stdQueue; // 2倍标准差作为阈值
        
        const currentQueueSize = currentData.queue_size || 0;
        if (currentQueueSize > thresholdQueue) {
          anomalies.push({
            type: 'queue_size_anomaly',
            severity: 'medium',
            message: `队列大小异常: ${currentQueueSize}, 超过阈值: ${thresholdQueue.toFixed(2)}`,
            timestamp: Date.now()
          });
        }
      }
      
      console.log(`检测到 ${anomalies.length} 个异常`);
      return anomalies;
    } catch (error) {
      console.error('检测异常失败:', error.message);
      return [];
    }
  }

  /**
   * 计算均值
   * @param {Array} data - 数据数组
   * @returns {number} 均值
   */
  _calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  /**
   * 计算标准差
   * @param {Array} data - 数据数组
   * @returns {number} 标准差
   */
  _calculateStd(data) {
    const mean = this._calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
    return Math.sqrt(variance);
  }
}

// 全局实例
const mlEngine = new MachineLearningEngine();

// 导出函数
function collectData(monitoringData) {
  mlEngine.collectData(monitoringData);
}

function trainModels() {
  mlEngine.trainModels();
}

function loadModels() {
  mlEngine.loadModels();
}

function predict(inputData) {
  return mlEngine.predict(inputData);
}

function detectAnomalies(currentData) {
  return mlEngine.detectAnomalies(currentData);
}

module.exports = {
  MachineLearningEngine,
  mlEngine,
  collectData,
  trainModels,
  loadModels,
  predict,
  detectAnomalies
};
