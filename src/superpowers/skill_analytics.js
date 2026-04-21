/**
 * 技能使用统计和分析模块
 * 负责跟踪技能的使用情况、性能指标和用户行为
 */

const fs = require('fs');
const path = require('path');

class SkillAnalytics {
  /**
   * 技能分析器
   * @param {string} analyticsDir - 分析数据存储目录
   */
  constructor(analyticsDir) {
    this.analyticsDir = analyticsDir;
    this.usageDir = path.join(this.analyticsDir, 'usage');
    this.performanceDir = path.join(this.analyticsDir, 'performance');
    this.userBehaviorDir = path.join(this.analyticsDir, 'user_behavior');
    this.init();
  }

  /**
   * 初始化分析目录
   */
  init() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.analyticsDir)) {
        fs.mkdirSync(this.analyticsDir, { recursive: true });
      }
      if (!fs.existsSync(this.usageDir)) {
        fs.mkdirSync(this.usageDir, { recursive: true });
      }
      if (!fs.existsSync(this.performanceDir)) {
        fs.mkdirSync(this.performanceDir, { recursive: true });
      }
      if (!fs.existsSync(this.userBehaviorDir)) {
        fs.mkdirSync(this.userBehaviorDir, { recursive: true });
      }
      
      console.log('技能分析系统初始化成功');
    } catch (error) {
      console.error('技能分析系统初始化失败:', error.message);
    }
  }

  /**
   * 记录技能使用情况
   * @param {string} skillName - 技能名称
   * @param {string} userId - 用户ID
   * @param {Object} usageData - 使用数据
   */
  recordSkillUsage(skillName, userId, usageData) {
    try {
      const usageRecord = {
        skillName: skillName,
        userId: userId,
        timestamp: Date.now(),
        ...usageData
      };

      const usageFile = path.join(this.usageDir, `usage_${new Date().toISOString().split('T')[0]}.json`);
      
      let usageRecords = [];
      if (fs.existsSync(usageFile)) {
        try {
          usageRecords = JSON.parse(fs.readFileSync(usageFile, 'utf-8'));
        } catch (error) {
          usageRecords = [];
        }
      }

      usageRecords.push(usageRecord);
      fs.writeFileSync(usageFile, JSON.stringify(usageRecords, null, 2), 'utf-8');

      return true;
    } catch (error) {
      console.error('记录技能使用失败:', error.message);
      return false;
    }
  }

  /**
   * 记录技能性能指标
   * @param {string} skillName - 技能名称
   * @param {Object} performanceData - 性能数据
   */
  recordSkillPerformance(skillName, performanceData) {
    try {
      const performanceRecord = {
        skillName: skillName,
        timestamp: Date.now(),
        ...performanceData
      };

      const performanceFile = path.join(this.performanceDir, `performance_${new Date().toISOString().split('T')[0]}.json`);
      
      let performanceRecords = [];
      if (fs.existsSync(performanceFile)) {
        try {
          performanceRecords = JSON.parse(fs.readFileSync(performanceFile, 'utf-8'));
        } catch (error) {
          performanceRecords = [];
        }
      }

      performanceRecords.push(performanceRecord);
      fs.writeFileSync(performanceFile, JSON.stringify(performanceRecords, null, 2), 'utf-8');

      return true;
    } catch (error) {
      console.error('记录技能性能失败:', error.message);
      return false;
    }
  }

  /**
   * 记录用户行为
   * @param {string} userId - 用户ID
   * @param {string} action - 行为类型
   * @param {Object} actionData - 行为数据
   */
  recordUserBehavior(userId, action, actionData) {
    try {
      const behaviorRecord = {
        userId: userId,
        action: action,
        timestamp: Date.now(),
        ...actionData
      };

      const behaviorFile = path.join(this.userBehaviorDir, `behavior_${new Date().toISOString().split('T')[0]}.json`);
      
      let behaviorRecords = [];
      if (fs.existsSync(behaviorFile)) {
        try {
          behaviorRecords = JSON.parse(fs.readFileSync(behaviorFile, 'utf-8'));
        } catch (error) {
          behaviorRecords = [];
        }
      }

      behaviorRecords.push(behaviorRecord);
      fs.writeFileSync(behaviorFile, JSON.stringify(behaviorRecords, null, 2), 'utf-8');

      return true;
    } catch (error) {
      console.error('记录用户行为失败:', error.message);
      return false;
    }
  }

  /**
   * 获取技能使用统计
   * @param {string} skillName - 技能名称
   * @param {number} days - 统计天数
   * @returns {Object} 使用统计
   */
  getSkillUsageStats(skillName, days = 30) {
    try {
      const stats = {
        totalUses: 0,
        successfulUses: 0,
        failedUses: 0,
        averageDuration: 0,
        userCount: 0,
        usageTrend: [],
        errorRate: 0
      };

      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
      const usageFiles = fs.readdirSync(this.usageDir)
        .filter(file => file.endsWith('.json'));

      const users = new Set();
      const totalDuration = 0;

      for (const file of usageFiles) {
        const filePath = path.join(this.usageDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantRecords = fileData.filter(record => 
            record.skillName === skillName && record.timestamp > cutoffDate
          );

          for (const record of relevantRecords) {
            stats.totalUses++;
            if (record.success) {
              stats.successfulUses++;
            } else {
              stats.failedUses++;
            }
            if (record.duration) {
              stats.averageDuration += record.duration;
            }
            if (record.userId) {
              users.add(record.userId);
            }
          }
        } catch (error) {
          console.error(`读取使用文件 ${file} 失败:`, error.message);
        }
      }

      stats.userCount = users.size;
      if (stats.totalUses > 0) {
        stats.averageDuration /= stats.totalUses;
        stats.errorRate = stats.failedUses / stats.totalUses;
      }

      return stats;
    } catch (error) {
      console.error('获取技能使用统计失败:', error.message);
      return null;
    }
  }

  /**
   * 获取技能性能分析
   * @param {string} skillName - 技能名称
   * @param {number} days - 统计天数
   * @returns {Object} 性能分析
   */
  getSkillPerformanceAnalysis(skillName, days = 30) {
    try {
      const analysis = {
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Infinity,
        responseTimeTrend: [],
        resourceUsage: {
          cpu: 0,
          memory: 0
        },
        errorRate: 0
      };

      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
      const performanceFiles = fs.readdirSync(this.performanceDir)
        .filter(file => file.endsWith('.json'));

      let totalResponseTime = 0;
      let totalRecords = 0;

      for (const file of performanceFiles) {
        const filePath = path.join(this.performanceDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantRecords = fileData.filter(record => 
            record.skillName === skillName && record.timestamp > cutoffDate
          );

          for (const record of relevantRecords) {
            totalRecords++;
            if (record.responseTime) {
              totalResponseTime += record.responseTime;
              analysis.maxResponseTime = Math.max(analysis.maxResponseTime, record.responseTime);
              analysis.minResponseTime = Math.min(analysis.minResponseTime, record.responseTime);
            }
            if (record.resourceUsage) {
              analysis.resourceUsage.cpu += record.resourceUsage.cpu || 0;
              analysis.resourceUsage.memory += record.resourceUsage.memory || 0;
            }
            if (record.errorRate) {
              analysis.errorRate += record.errorRate;
            }
          }
        } catch (error) {
          console.error(`读取性能文件 ${file} 失败:`, error.message);
        }
      }

      if (totalRecords > 0) {
        analysis.averageResponseTime = totalResponseTime / totalRecords;
        analysis.resourceUsage.cpu /= totalRecords;
        analysis.resourceUsage.memory /= totalRecords;
        analysis.errorRate /= totalRecords;
      }

      if (analysis.minResponseTime === Infinity) {
        analysis.minResponseTime = 0;
      }

      return analysis;
    } catch (error) {
      console.error('获取技能性能分析失败:', error.message);
      return null;
    }
  }

  /**
   * 获取用户行为分析
   * @param {string} userId - 用户ID
   * @param {number} days - 统计天数
   * @returns {Object} 行为分析
   */
  getUserBehaviorAnalysis(userId, days = 30) {
    try {
      const analysis = {
        totalActions: 0,
        actionBreakdown: {},
        skillUsage: {},
        activityTrend: []
      };

      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
      const behaviorFiles = fs.readdirSync(this.userBehaviorDir)
        .filter(file => file.endsWith('.json'));

      for (const file of behaviorFiles) {
        const filePath = path.join(this.userBehaviorDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantRecords = fileData.filter(record => 
            record.userId === userId && record.timestamp > cutoffDate
          );

          for (const record of relevantRecords) {
            analysis.totalActions++;
            
            // 行为类型统计
            analysis.actionBreakdown[record.action] = (analysis.actionBreakdown[record.action] || 0) + 1;
            
            // 技能使用统计
            if (record.skillName) {
              analysis.skillUsage[record.skillName] = (analysis.skillUsage[record.skillName] || 0) + 1;
            }
          }
        } catch (error) {
          console.error(`读取行为文件 ${file} 失败:`, error.message);
        }
      }

      return analysis;
    } catch (error) {
      console.error('获取用户行为分析失败:', error.message);
      return null;
    }
  }

  /**
   * 生成技能分析报告
   * @param {string} skillName - 技能名称
   * @param {number} days - 统计天数
   * @returns {Object} 分析报告
   */
  generateSkillReport(skillName, days = 30) {
    try {
      const usageStats = this.getSkillUsageStats(skillName, days);
      const performanceAnalysis = this.getSkillPerformanceAnalysis(skillName, days);

      const report = {
        skillName: skillName,
        reportDate: new Date().toISOString(),
        timeRange: `${days}天`,
        usage: usageStats,
        performance: performanceAnalysis,
        recommendations: this.generateRecommendations(usageStats, performanceAnalysis)
      };

      return report;
    } catch (error) {
      console.error('生成技能分析报告失败:', error.message);
      return null;
    }
  }

  /**
   * 生成优化建议
   * @param {Object} usageStats - 使用统计
   * @param {Object} performanceAnalysis - 性能分析
   * @returns {Array} 优化建议
   */
  generateRecommendations(usageStats, performanceAnalysis) {
    const recommendations = [];

    if (usageStats) {
      if (usageStats.errorRate > 0.1) {
        recommendations.push({
          type: 'error_rate',
          priority: 'high',
          message: `错误率较高 (${(usageStats.errorRate * 100).toFixed(2)}%)，建议优化技能执行逻辑`
        });
      }

      if (usageStats.averageDuration > 5000) {
        recommendations.push({
          type: 'performance',
          priority: 'medium',
          message: `平均执行时间较长 (${(usageStats.averageDuration / 1000).toFixed(2)}s)，建议优化性能`
        });
      }
    }

    if (performanceAnalysis) {
      if (performanceAnalysis.averageResponseTime > 2000) {
        recommendations.push({
          type: 'response_time',
          priority: 'high',
          message: `平均响应时间较长 (${(performanceAnalysis.averageResponseTime / 1000).toFixed(2)}s)，建议优化响应速度`
        });
      }

      if (performanceAnalysis.resourceUsage.cpu > 50) {
        recommendations.push({
          type: 'resource_usage',
          priority: 'medium',
          message: `CPU使用率较高 (${performanceAnalysis.resourceUsage.cpu.toFixed(2)}%)，建议优化资源使用`
        });
      }
    }

    return recommendations;
  }

  /**
   * 清理旧数据
   * @param {number} days - 保留天数
   */
  cleanupOldData(days = 90) {
    try {
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
      const cutoffDateStr = new Date(cutoffDate).toISOString().split('T')[0];

      // 清理使用数据
      this.cleanupDirectory(this.usageDir, cutoffDateStr);
      
      // 清理性能数据
      this.cleanupDirectory(this.performanceDir, cutoffDateStr);
      
      // 清理行为数据
      this.cleanupDirectory(this.userBehaviorDir, cutoffDateStr);

      console.log('清理旧数据成功');
    } catch (error) {
      console.error('清理旧数据失败:', error.message);
    }
  }

  /**
   * 清理目录中的旧文件
   * @param {string} directory - 目录路径
   * @param {string} cutoffDateStr - 截止日期字符串
   */
  cleanupDirectory(directory, cutoffDateStr) {
    try {
      const files = fs.readdirSync(directory)
        .filter(file => file.endsWith('.json'));

      for (const file of files) {
        const fileName = path.basename(file, '.json');
        const fileDate = fileName.split('_')[1];
        if (fileDate < cutoffDateStr) {
          const filePath = path.join(directory, file);
          fs.unlinkSync(filePath);
          console.log(`删除旧文件: ${file}`);
        }
      }
    } catch (error) {
      console.error(`清理目录 ${directory} 失败:`, error.message);
    }
  }
}

module.exports = SkillAnalytics;