/**
 * 智能预测模块
 * 用于基于历史数据，预测未来可能出现的问题
 */

const fs = require('fs');
const path = require('path');

// 尝试导入依赖
let IP_ENABLED = false;
let RandomForestRegression = null;

// 尝试加载mljs库
try {
  const ml = require('ml');
  if (ml.RandomForestRegression) {
    RandomForestRegression = ml.RandomForestRegression;
    IP_ENABLED = true;
  }
} catch (error) {
  console.warn('未安装必要的智能预测依赖，智能预测功能将被禁用');
  console.warn('请运行: npm install ml');
}

class IntelligentPrediction {
  /**
   * 初始化智能预测系统
   * @param {string} dataDir - 数据目录
   */
  constructor(dataDir = 'prediction_data') {
    this.dataDir = dataDir;
    this.modelDir = path.join(dataDir, 'models');
    this.dataFile = path.join(dataDir, 'prediction_data.json');
    
    // 创建目录
    this._ensureDirectories();
    
    // 初始化模型
    this.models = {};
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
   * 收集预测数据
   * @param {Object} monitoringData - 监控数据
   */
  collectData(monitoringData) {
    if (!IP_ENABLED) {
      console.warn('智能预测功能被禁用，跳过数据收集');
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
          console.error('读取预测数据文件失败:', error.message);
          existingData = [];
        }
      }
      
      existingData.push(data);
      
      // 只保留最近200条数据
      if (existingData.length > 200) {
        existingData = existingData.slice(-200);
      }
      
      fs.writeFileSync(this.dataFile, JSON.stringify(existingData, null, 2), 'utf-8');
      console.log('预测数据收集完成');
    } catch (error) {
      console.error('收集预测数据失败:', error.message);
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
   * 训练预测模型
   */
  trainPredictionModels() {
    if (!IP_ENABLED) {
      console.warn('智能预测功能被禁用，跳过模型训练');
      return;
    }
    
    try {
      if (!fs.existsSync(this.dataFile)) {
        console.warn('预测数据文件不存在，无法训练模型');
        return;
      }
      
      // 加载数据
      const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'));
      
      // 确保数据充足
      if (data.length < 20) {
        console.warn('预测数据量不足，无法训练模型');
        return;
      }
      
      // 准备特征和目标变量
      const features = ['total_events', 'error_count', 'queue_size', 'cpu_percent', 'memory_percent', 'disk_percent'];
      
      // 准备训练数据
      const X = [];
      const ySuccess = [];
      const yTime = [];
      
      // 创建时间滞后特征
      for (let i = 2; i < data.length; i++) {
        const currentData = data[i];
        const lag1Data = data[i-1];
        const lag2Data = data[i-2];
        
        const featureVector = [];
        
        // 添加当前特征
        for (const feature of features) {
          featureVector.push(currentData[feature] || 0);
        }
        
        // 添加滞后1特征
        for (const feature of features) {
          featureVector.push(lag1Data[feature] || 0);
        }
        
        // 添加滞后2特征
        for (const feature of features) {
          featureVector.push(lag2Data[feature] || 0);
        }
        
        X.push(featureVector);
        ySuccess.push(currentData.success_rate || 0);
        yTime.push(currentData.avg_processing_time || 0);
      }
      
      // 确保数据充足
      if (X.length < 10) {
        console.warn('创建滞后特征后数据量不足，无法训练模型');
        return;
      }
      
      // 训练未来成功率预测模型
      const modelSuccess = new RandomForestRegression({
        nEstimators: 100,
        maxDepth: 10,
        randomSeed: 42
      });
      modelSuccess.train(X, ySuccess);
      
      // 训练未来处理时间预测模型
      const modelTime = new RandomForestRegression({
        nEstimators: 100,
        maxDepth: 10,
        randomSeed: 42
      });
      modelTime.train(X, yTime);
      
      // 保存模型
      this._saveModel('future_success_rate_model', modelSuccess);
      this._saveModel('future_processing_time_model', modelTime);
      
      this.models.future_success_rate = modelSuccess;
      this.models.future_processing_time = modelTime;
      
      console.log('预测模型训练完成');
    } catch (error) {
      console.error('训练预测模型失败:', error.message);
    }
  }

  /**
   * 保存模型
   * @param {string} name - 模型名称
   * @param {Object} model - 模型对象
   */
  _saveModel(name, model) {
    try {
      const modelPath = path.join(this.modelDir, `${name}.json`);
      fs.writeFileSync(modelPath, JSON.stringify(model, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存模型失败:', error.message);
    }
  }

  /**
   * 加载预测模型
   */
  loadPredictionModels() {
    try {
      const successModelPath = path.join(this.modelDir, 'future_success_rate_model.json');
      const timeModelPath = path.join(this.modelDir, 'future_processing_time_model.json');
      
      if (fs.existsSync(successModelPath)) {
        const modelData = JSON.parse(fs.readFileSync(successModelPath, 'utf-8'));
        this.models.future_success_rate = modelData;
        console.log('未来成功率预测模型加载成功');
      }
      
      if (fs.existsSync(timeModelPath)) {
        const modelData = JSON.parse(fs.readFileSync(timeModelPath, 'utf-8'));
        this.models.future_processing_time = modelData;
        console.log('未来处理时间预测模型加载成功');
      }
    } catch (error) {
      console.error('加载预测模型失败:', error.message);
    }
  }

  /**
   * 预测未来系统状态
   * @param {Object} inputData - 输入数据
   * @param {number} steps - 预测步数
   * @returns {Object} 预测结果
   */
  predictFuture(inputData, steps = 5) {
    if (!IP_ENABLED) {
      console.warn('智能预测功能被禁用，跳过预测');
      return {};
    }
    
    try {
      if (Object.keys(this.models).length === 0) {
        this.loadPredictionModels();
      }
      
      if (Object.keys(this.models).length === 0) {
        console.warn('预测模型未加载，使用模拟预测');
        return this._simulatePrediction(inputData, steps);
      }
      
      // 准备输入数据
      const features = ['total_events', 'error_count', 'queue_size', 'cpu_percent', 'memory_percent', 'disk_percent'];
      const inputFeatures = features.map(feature => inputData[feature] || 0);
      
      // 预测未来状态
      const predictions = {
        success_rate: [],
        processing_time: []
      };
      
      let currentFeatures = inputFeatures.slice();
      
      for (let i = 0; i < steps; i++) {
        // 创建滞后特征
        const lagFeatures = [];
        for (let lag = 0; lag < 2; lag++) {
          lagFeatures.push(...currentFeatures);
        }
        
        // 准备预测输入
        const predictionInput = [...currentFeatures, ...lagFeatures];
        
        // 预测
        if (this.models.future_success_rate) {
          const successRatePred = this.models.future_success_rate.predict([predictionInput])[0];
          predictions.success_rate.push(successRatePred);
        }
        
        if (this.models.future_processing_time) {
          const processingTimePred = this.models.future_processing_time.predict([predictionInput])[0];
          predictions.processing_time.push(processingTimePred);
        }
        
        // 更新当前特征
        currentFeatures = inputFeatures.slice();
        // 模拟未来特征变化
        currentFeatures[0] += 10; // 事件数量增加
        currentFeatures[1] += 1;  // 错误数量增加
        currentFeatures[2] += 2;  // 队列大小增加
      }
      
      console.log('未来预测结果:', predictions);
      return predictions;
    } catch (error) {
      console.error('预测未来失败:', error.message);
      return this._simulatePrediction(inputData, steps);
    }
  }

  /**
   * 模拟预测（当模型不可用时）
   * @param {Object} inputData - 输入数据
   * @param {number} steps - 预测步数
   * @returns {Object} 模拟预测结果
   */
  _simulatePrediction(inputData, steps = 5) {
    const predictions = {
      success_rate: [],
      processing_time: []
    };
    
    let currentSuccessRate = inputData.success_rate || 95;
    let currentProcessingTime = this._calculateAvgProcessingTime(inputData.avg_processing_time) || 0.3;
    
    for (let i = 0; i < steps; i++) {
      // 模拟成功率逐渐下降
      currentSuccessRate -= 1.5;
      if (currentSuccessRate < 70) currentSuccessRate = 70;
      
      // 模拟处理时间逐渐增加
      currentProcessingTime += 0.1;
      if (currentProcessingTime > 2) currentProcessingTime = 2;
      
      predictions.success_rate.push(currentSuccessRate);
      predictions.processing_time.push(currentProcessingTime);
    }
    
    console.log('模拟预测结果:', predictions);
    return predictions;
  }

  /**
   * 检测未来可能出现的问题
   * @param {Object} futurePredictions - 未来预测结果
   * @returns {Array} 问题列表
   */
  detectFutureIssues(futurePredictions) {
    try {
      const issues = [];
      
      // 检测成功率问题
      if (futurePredictions.success_rate) {
        for (let i = 0; i < futurePredictions.success_rate.length; i++) {
          const successRate = futurePredictions.success_rate[i];
          if (successRate < 90) {
            issues.push({
              type: 'future_success_rate_issue',
              severity: 'high',
              message: `预测 ${i+1} 步后成功率将下降到 ${successRate.toFixed(2)}%，可能导致系统不稳定`,
              timestamp: Date.now(),
              predicted_time: i+1
            });
          }
        }
      }
      
      // 检测处理时间问题
      if (futurePredictions.processing_time) {
        for (let i = 0; i < futurePredictions.processing_time.length; i++) {
          const processingTime = futurePredictions.processing_time[i];
          if (processingTime > 1.0) {
            issues.push({
              type: 'future_processing_time_issue',
              severity: 'medium',
              message: `预测 ${i+1} 步后处理时间将增加到 ${processingTime.toFixed(3)}秒，可能影响系统性能`,
              timestamp: Date.now(),
              predicted_time: i+1
            });
          }
        }
      }
      
      console.log(`检测到 ${issues.length} 个未来可能的问题`);
      return issues;
    } catch (error) {
      console.error('检测未来问题失败:', error.message);
      return [];
    }
  }

  /**
   * 生成预防性优化建议
   * @param {Array} futureIssues - 未来问题列表
   * @returns {Array} 优化建议列表
   */
  generatePreventiveSuggestions(futureIssues) {
    try {
      const suggestions = [];
      
      for (const issue of futureIssues) {
        if (issue.type === 'future_success_rate_issue') {
          suggestions.push({
            type: 'preventive_success_rate_optimization',
            priority: 'high',
            description: issue.message,
            target: 'plugin_system.js',
            predicted_time: issue.predicted_time
          });
        } else if (issue.type === 'future_processing_time_issue') {
          suggestions.push({
            type: 'preventive_processing_time_optimization',
            priority: 'medium',
            description: issue.message,
            target: 'plugin_system.js',
            predicted_time: issue.predicted_time
          });
        }
      }
      
      console.log(`生成 ${suggestions.length} 个预防性优化建议`);
      return suggestions;
    } catch (error) {
      console.error('生成预防性优化建议失败:', error.message);
      return [];
    }
  }
}

// 全局实例
const intelligentPrediction = new IntelligentPrediction();

// 导出函数
function collectData(monitoringData) {
  intelligentPrediction.collectData(monitoringData);
}

function trainPredictionModels() {
  intelligentPrediction.trainPredictionModels();
}

function loadPredictionModels() {
  intelligentPrediction.loadPredictionModels();
}

function predictFuture(inputData, steps = 5) {
  return intelligentPrediction.predictFuture(inputData, steps);
}

function detectFutureIssues(futurePredictions) {
  return intelligentPrediction.detectFutureIssues(futurePredictions);
}

function generatePreventiveSuggestions(futureIssues) {
  return intelligentPrediction.generatePreventiveSuggestions(futureIssues);
}

module.exports = {
  IntelligentPrediction,
  intelligentPrediction,
  collectData,
  trainPredictionModels,
  loadPredictionModels,
  predictFuture,
  detectFutureIssues,
  generatePreventiveSuggestions
};
