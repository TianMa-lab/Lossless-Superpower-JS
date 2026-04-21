/**
 * 自动迭代记录器配置管理
 * 提供配置选项和监控功能
 */

const fs = require('fs');
const path = require('path');

class AutoIterationConfigManager {
  constructor(configPath = 'auto_iteration_config.json') {
    this.configPath = configPath;
    this.defaultConfig = {
      // 基本配置
      enabled: true,
      environment: process.env.NODE_ENV || 'development',
      
      // 文件监控配置
      watchPaths: ['src/', 'SYSTEM_CHARTER.md', 'package.json'],
      ignorePaths: [
        'node_modules/', 'storage/', 'iterations/', '*.log', '*.gz',
        'test/', '__tests__/', 'coverage/', '*.test.js', '*.spec.js'
      ],
      
      // 迭代检测配置
      debounceTime: 5000, // 5秒防抖
      minChanges: 1, // 最小变更数量
      maxChanges: 100, // 最大变更数量
      iterationInterval: 3600000, // 1小时
      
      // 测试环境配置
      testEnvironmentPatterns: ['test', '__tests__', 'spec', 'specs'],
      
      // 健康检查配置
      enableHealthCheck: true,
      healthCheckInterval: 60000, // 1分钟
      
      // 版本管理配置
      versioning: {
        enabled: true,
        autoIncrement: true,
        majorVersionThreshold: 5, // 每5个次版本号递增主版本号
      },
      
      // 日志配置
      logging: {
        enabled: true,
        level: 'info', // error, warn, info, debug
        logFile: 'auto_iteration.log'
      },
      
      // 存储配置
      storage: {
        enabled: true,
        maxRecords: 1000,
        cleanupDays: 30
      }
    };
    
    this.config = this.loadConfig();
  }
  
  /**
   * 加载配置
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        return {
          ...this.defaultConfig,
          ...JSON.parse(content)
        };
      }
    } catch (error) {
      console.error('加载配置失败:', error.message);
    }
    return this.defaultConfig;
  }
  
  /**
   * 保存配置
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('保存配置失败:', error.message);
      return false;
    }
  }
  
  /**
   * 获取配置
   */
  getConfig() {
    return this.config;
  }
  
  /**
   * 更新配置
   */
  updateConfig(updates) {
    this.config = {
      ...this.config,
      ...updates
    };
    return this.saveConfig();
  }
  
  /**
   * 获取环境特定配置
   */
  getEnvironmentConfig() {
    const env = this.config.environment;
    const envConfig = {
      ...this.config
    };
    
    // 根据环境调整配置
    if (env === 'test') {
      envConfig.debounceTime = 2000;
      envConfig.minChanges = 2;
      envConfig.logging.level = 'debug';
    } else if (env === 'production') {
      envConfig.debounceTime = 10000;
      envConfig.iterationInterval = 7200000;
      envConfig.logging.level = 'warn';
    }
    
    return envConfig;
  }
  
  /**
   * 验证配置
   */
  validateConfig() {
    const errors = [];
    
    if (!Array.isArray(this.config.watchPaths) || this.config.watchPaths.length === 0) {
      errors.push('watchPaths 必须是一个非空数组');
    }
    
    if (this.config.debounceTime < 100) {
      errors.push('debounceTime 不能小于 100ms');
    }
    
    if (this.config.minChanges < 0) {
      errors.push('minChanges 不能小于 0');
    }
    
    if (this.config.maxChanges < this.config.minChanges) {
      errors.push('maxChanges 不能小于 minChanges');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * 重置配置到默认值
   */
  resetConfig() {
    this.config = this.defaultConfig;
    return this.saveConfig();
  }
  
  /**
   * 生成配置报告
   */
  generateConfigReport() {
    const validation = this.validateConfig();
    const envConfig = this.getEnvironmentConfig();
    
    return {
      timestamp: new Date().toISOString(),
      currentConfig: this.config,
      environmentConfig: envConfig,
      validation,
      environment: this.config.environment,
      watchPathCount: this.config.watchPaths.length,
      ignorePathCount: this.config.ignorePaths.length
    };
  }
}

// 全局配置管理器实例
const configManager = new AutoIterationConfigManager();

// 导出函数
function getConfig() {
  return configManager.getConfig();
}

function updateConfig(updates) {
  return configManager.updateConfig(updates);
}

function loadConfig() {
  return configManager.loadConfig();
}

function saveConfig() {
  return configManager.saveConfig();
}

function getEnvironmentConfig() {
  return configManager.getEnvironmentConfig();
}

function validateConfig() {
  return configManager.validateConfig();
}

function resetConfig() {
  return configManager.resetConfig();
}

function generateConfigReport() {
  return configManager.generateConfigReport();
}

module.exports = {
  AutoIterationConfigManager,
  configManager,
  getConfig,
  updateConfig,
  loadConfig,
  saveConfig,
  getEnvironmentConfig,
  validateConfig,
  resetConfig,
  generateConfigReport
};