const fs = require('fs');
const path = require('path');
const { generateMachineLearningFeatures, getAllIterations } = require('./iteration_manager');

let ML_ENABLED = false;
let LinearRegression = null;
let StandardScaler = null;

try {
  const ml = require('ml');
  // 适配ml库8.0.0版本
  if (ml.SimpleLinearRegression) {
    LinearRegression = ml.SimpleLinearRegression;
    ML_ENABLED = true;
  } else if (ml.MultivariateLinearRegression) {
    LinearRegression = ml.MultivariateLinearRegression;
    ML_ENABLED = true;
  }
  
  // 检查是否有StandardScaler，否则使用简单的标准化
  if (ml.StandardScaler) {
    StandardScaler = ml.StandardScaler;
  } else {
    // 自定义简单的StandardScaler
    StandardScaler = class StandardScaler {
      fit(X) {
        this.means = [];
        this.stds = [];
        for (let i = 0; i < X[0].length; i++) {
          const column = X.map(row => row[i]);
          this.means[i] = column.reduce((sum, val) => sum + val, 0) / column.length;
          const variance = column.reduce((sum, val) => sum + Math.pow(val - this.means[i], 2), 0) / column.length;
          this.stds[i] = Math.sqrt(variance) || 1;
        }
        return this;
      }
      transform(X) {
        return X.map(row => {
          return row.map((val, i) => (val - this.means[i]) / this.stds[i]);
        });
      }
      fitTransform(X) {
        return this.fit(X).transform(X);
      }
      toJSON() {
        return { means: this.means, stds: this.stds };
      }
      static fromJSON(json) {
        const scaler = new StandardScaler();
        scaler.means = json.means;
        scaler.stds = json.stds;
        return scaler;
      }
    };
  }
  
  ML_ENABLED = true;
} catch (error) {
  console.warn('机器学习功能将被禁用，请运行: npm install ml');
  ML_ENABLED = false;
}

class IterationPredictor {
  constructor(modelDir = 'ml_data/iteration_models') {
    this.modelDir = modelDir;
    this.featureModelFile = path.join(modelDir, 'feature_model.json');
    this.effectModelFile = path.join(modelDir, 'effect_model.json');
    this.statsModelFile = path.join(modelDir, 'stats_model.json');
    
    this.featureModel = null;
    this.effectModel = null;
    this.statsModel = null;
    this.scaler = null;
    
    this._ensureDirectories();
  }

  _ensureDirectories() {
    if (!fs.existsSync(this.modelDir)) {
      fs.mkdirSync(this.modelDir, { recursive: true });
    }
  }

  prepareTrainingData() {
    const features = generateMachineLearningFeatures();
    
    if (features.length === 0) {
      console.warn('没有足够的迭代数据用于训练');
      return null;
    }

    const X = [];
    const yFeatures = [];
    const yEffects = [];
    const yStats = [];

    for (const feature of features) {
      const input = [
        feature.has_features_added,
        feature.has_features_improved,
        feature.has_bug_fixes,
        feature.features_added_count,
        feature.features_improved_count,
        feature.bug_fixes_count,
        feature.files_modified_count,
        feature.updates_count,
        feature.month,
        feature.day_of_week
      ];

      X.push(input);

      yFeatures.push(feature.features_added_count + feature.features_improved_count);
      yEffects.push(feature.has_features_added + feature.has_features_improved);
      yStats.push(feature.files_modified_count);
    }

    return {
      X,
      yFeatures,
      yEffects,
      yStats
    };
  }

  trainModels() {
    if (!ML_ENABLED) {
      console.warn('机器学习功能被禁用，跳过模型训练');
      return false;
    }

    try {
      const trainingData = this.prepareTrainingData();
      
      if (!trainingData || trainingData.X.length < 2) {
        console.warn('数据量不足，无法训练模型');
        return false;
      }

      const { X, yFeatures, yEffects, yStats } = trainingData;

      this.scaler = new StandardScaler();
      const XScaled = this.scaler.fitTransform(X);

      // 适配ml库8.0.0版本的API
      if (LinearRegression === require('ml').MultivariateLinearRegression) {
        // 使用MultivariateLinearRegression
        const featureDim = XScaled[0].length;
        this.featureModel = new LinearRegression(featureDim);
        this.featureModel.train(XScaled, yFeatures);

        this.effectModel = new LinearRegression(featureDim);
        this.effectModel.train(XScaled, yEffects);

        this.statsModel = new LinearRegression(featureDim);
        this.statsModel.train(XScaled, yStats);
      } else if (LinearRegression === require('ml').SimpleLinearRegression) {
        // 使用SimpleLinearRegression (仅支持单变量)
        // 对于多变量，我们使用第一个特征作为简单线性回归
        const XSimple = XScaled.map(row => row[0]);
        this.featureModel = new LinearRegression(XSimple, yFeatures);
        this.effectModel = new LinearRegression(XSimple, yEffects);
        this.statsModel = new LinearRegression(XSimple, yStats);
      } else {
        console.warn('未知的线性回归模型类型');
        return false;
      }

      this._saveModels();

      console.log('迭代预测模型训练完成');
      return true;
    } catch (error) {
      console.error('训练模型失败:', error.message);
      return false;
    }
  }

  _saveModels() {
    try {
      if (this.featureModel) {
        fs.writeFileSync(this.featureModelFile, JSON.stringify({
          model: this.featureModel.toJSON(),
          scaler: this.scaler.toJSON()
        }), 'utf-8');
      }
      
      if (this.effectModel) {
        fs.writeFileSync(this.effectModelFile, JSON.stringify({
          model: this.effectModel.toJSON(),
          scaler: this.scaler.toJSON()
        }), 'utf-8');
      }
      
      if (this.statsModel) {
        fs.writeFileSync(this.statsModelFile, JSON.stringify({
          model: this.statsModel.toJSON(),
          scaler: this.scaler.toJSON()
        }), 'utf-8');
      }
      
      console.log('模型保存成功');
    } catch (error) {
      console.error('保存模型失败:', error.message);
    }
  }

  loadModels() {
    try {
      if (fs.existsSync(this.featureModelFile)) {
        const data = JSON.parse(fs.readFileSync(this.featureModelFile, 'utf-8'));
        this.featureModel = new LinearRegression(data.model);
        this.scaler = new StandardScaler(data.scaler);
        console.log('特征模型加载成功');
      }
      
      if (fs.existsSync(this.effectModelFile)) {
        const data = JSON.parse(fs.readFileSync(this.effectModelFile, 'utf-8'));
        this.effectModel = new LinearRegression(data.model);
        console.log('效果模型加载成功');
      }
      
      if (fs.existsSync(this.statsModelFile)) {
        const data = JSON.parse(fs.readFileSync(this.statsModelFile, 'utf-8'));
        this.statsModel = new LinearRegression(data.model);
        console.log('统计模型加载成功');
      }
      
      return this.featureModel && this.effectModel && this.statsModel;
    } catch (error) {
      console.error('加载模型失败:', error.message);
      return false;
    }
  }

  predict(inputFeatures) {
    if (!ML_ENABLED) {
      return this._mockPredict(inputFeatures);
    }

    try {
      if (!this.featureModel) {
        const loaded = this.loadModels();
        if (!loaded) {
          console.warn('模型未加载，尝试训练新模型');
          const trained = this.trainModels();
          if (!trained) {
            return this._mockPredict(inputFeatures);
          }
        }
      }

      const input = [
        inputFeatures.has_features_added || 0,
        inputFeatures.has_features_improved || 0,
        inputFeatures.has_bug_fixes || 0,
        inputFeatures.features_added_count || 0,
        inputFeatures.features_improved_count || 0,
        inputFeatures.bug_fixes_count || 0,
        inputFeatures.files_modified_count || 0,
        inputFeatures.updates_count || 0,
        inputFeatures.month || new Date().getMonth() + 1,
        inputFeatures.day_of_week || new Date().getDay()
      ];

      let inputScaled = [input];
      if (this.scaler) {
        inputScaled = this.scaler.transform(inputScaled);
      }

      let predicted_features = 0;
      let predicted_effectiveness = 0;
      let predicted_files_modified = 0;

      // 适配ml库8.0.0版本的API
      if (LinearRegression === require('ml').MultivariateLinearRegression) {
        // MultivariateLinearRegression的predict方法调用
        predicted_features = this.featureModel ? Math.max(0, Math.round(this.featureModel.predict(inputScaled))) : 0;
        predicted_effectiveness = this.effectModel ? Math.min(1, Math.max(0, this.effectModel.predict(inputScaled))) : 0;
        predicted_files_modified = this.statsModel ? Math.max(0, Math.round(this.statsModel.predict(inputScaled))) : 0;
      } else if (LinearRegression === require('ml').SimpleLinearRegression) {
        // SimpleLinearRegression的predict方法调用 (使用第一个特征)
        const inputSimple = inputScaled[0][0];
        predicted_features = this.featureModel ? Math.max(0, Math.round(this.featureModel.predict(inputSimple))) : 0;
        predicted_effectiveness = this.effectModel ? Math.min(1, Math.max(0, this.effectModel.predict(inputSimple))) : 0;
        predicted_files_modified = this.statsModel ? Math.max(0, Math.round(this.statsModel.predict(inputSimple))) : 0;
      } else {
        // 未知模型类型，使用mock预测
        return this._mockPredict(inputFeatures);
      }

      const predictions = {
        predicted_features,
        predicted_effectiveness,
        predicted_files_modified,
        confidence: this._calculateConfidence(),
        timestamp: Date.now()
      };

      console.log('预测结果:', predictions);
      return predictions;
    } catch (error) {
      console.error('预测失败:', error.message);
      return this._mockPredict(inputFeatures);
    }
  }

  _mockPredict(inputFeatures) {
    return {
      predicted_features: Math.floor(Math.random() * 5) + 1,
      predicted_effectiveness: 0.5 + Math.random() * 0.4,
      predicted_files_modified: Math.floor(Math.random() * 10) + 1,
      confidence: 0.3,
      timestamp: Date.now()
    };
  }

  _calculateConfidence() {
    const iterations = getAllIterations();
    if (iterations.length < 5) {
      return 0.3;
    } else if (iterations.length < 10) {
      return 0.5;
    } else if (iterations.length < 20) {
      return 0.7;
    } else {
      return 0.9;
    }
  }

  predictTrend(periods = 7) {
    const iterations = getAllIterations();
    
    if (iterations.length < 3) {
      return {
        trend: 'insufficient_data',
        message: '数据量不足，无法预测趋势',
        periods: []
      };
    }

    const recentIterations = iterations.slice(0, Math.min(periods, iterations.length));
    
    const featuresTrend = recentIterations.reduce((sum, iter) => {
      return sum + (iter.features_added ? iter.features_added.length : 0) + 
             (iter.features_improved ? iter.features_improved.length : 0);
    }, 0) / recentIterations.length;

    const filesTrend = recentIterations.reduce((sum, iter) => {
      return sum + (iter.files_modified ? iter.files_modified.length : 0);
    }, 0) / recentIterations.length;

    const trendDirection = featuresTrend > 2 ? 'increasing' : featuresTrend < 1 ? 'decreasing' : 'stable';

    return {
      trend: trendDirection,
      average_features_per_iteration: featuresTrend,
      average_files_modified: filesTrend,
      message: `迭代趋势呈${trendDirection === 'increasing' ? '上升' : trendDirection === 'decreasing' ? '下降' : '稳定'}态势`,
      periods: recentIterations.length,
      timestamp: Date.now()
    };
  }

  recommendNextAction() {
    const iterations = getAllIterations();
    const trend = this.predictTrend();
    
    const recommendations = [];

    if (iterations.length < 3) {
      recommendations.push({
        priority: 'high',
        action: '增加迭代频率',
        reason: '系统仍在初始化阶段，需要更多数据来优化性能'
      });
    }

    if (trend.trend === 'decreasing') {
      recommendations.push({
        priority: 'high',
        action: '提高迭代质量',
        reason: '迭代效果呈下降趋势，建议增加功能开发和改进的投入'
      });
    } else if (trend.trend === 'stable') {
      recommendations.push({
        priority: 'medium',
        action: '探索新的功能领域',
        reason: '系统处于稳定期，建议尝试新的功能方向以突破瓶颈'
      });
    }

    if (iterations.length > 10) {
      const recentBugs = iterations.slice(0, 5).reduce((sum, iter) => {
        return sum + (iter.bug_fixes ? iter.bug_fixes.length : 0);
      }, 0);
      
      if (recentBugs < 2) {
        recommendations.push({
          priority: 'low',
          action: '关注代码质量',
          reason: '近期Bug修复较少，可能需要加强代码审查和测试'
        });
      }
    }

    recommendations.push({
      priority: 'medium',
      action: '收集用户反馈',
      reason: '持续收集用户反馈，以指导未来的迭代方向'
    });

    return {
      recommendations,
      based_on: {
        total_iterations: iterations.length,
        current_trend: trend.trend
      },
      timestamp: Date.now()
    };
  }
}

const iterationPredictor = new IterationPredictor();

function prepareTrainingData() {
  return iterationPredictor.prepareTrainingData();
}

function trainIterationModels() {
  return iterationPredictor.trainModels();
}

function loadIterationModels() {
  return iterationPredictor.loadModels();
}

function predictIteration(inputFeatures) {
  return iterationPredictor.predict(inputFeatures);
}

function predictTrend(periods) {
  return iterationPredictor.predictTrend(periods);
}

function recommendNextAction() {
  return iterationPredictor.recommendNextAction();
}

module.exports = {
  IterationPredictor,
  iterationPredictor,
  prepareTrainingData,
  trainIterationModels,
  loadIterationModels,
  predictIteration,
  predictTrend,
  recommendNextAction
};
