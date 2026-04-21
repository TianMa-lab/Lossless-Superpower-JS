const fs = require('fs');
const path = require('path');

class UserExperienceOptimizer {
  constructor() {
    this.uxDir = path.join(__dirname, 'user_experience');
    this.feedbackDir = path.join(this.uxDir, 'feedback');
    this.metricsDir = path.join(this.uxDir, 'metrics');
  }

  async init() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.uxDir)) {
        fs.mkdirSync(this.uxDir, { recursive: true });
      }
      if (!fs.existsSync(this.feedbackDir)) {
        fs.mkdirSync(this.feedbackDir, { recursive: true });
      }
      if (!fs.existsSync(this.metricsDir)) {
        fs.mkdirSync(this.metricsDir, { recursive: true });
      }

      console.log('用户体验优化系统初始化成功');
      return true;
    } catch (error) {
      console.error('用户体验优化系统初始化失败:', error.message);
      return false;
    }
  }

  // 记录用户反馈
  recordFeedback(feedback) {
    try {
      const feedbackData = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...feedback
      };

      const feedbackFile = path.join(this.feedbackDir, `feedback_${new Date().toISOString().split('T')[0]}.json`);
      
      let feedbacks = [];
      if (fs.existsSync(feedbackFile)) {
        try {
          feedbacks = JSON.parse(fs.readFileSync(feedbackFile, 'utf-8'));
        } catch (error) {
          feedbacks = [];
        }
      }

      feedbacks.push(feedbackData);
      fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2), 'utf-8');

      return feedbackData.id;
    } catch (error) {
      console.error('记录用户反馈失败:', error.message);
      return null;
    }
  }

  // 获取用户反馈
  getFeedback(days = 7) {
    try {
      const feedbacks = [];
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

      const feedbackFiles = fs.readdirSync(this.feedbackDir)
        .filter(file => file.endsWith('.json'));

      for (const file of feedbackFiles) {
        const filePath = path.join(this.feedbackDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantFeedbacks = fileData.filter(feedback => feedback.timestamp > cutoffDate);
          feedbacks.push(...relevantFeedbacks);
        } catch (error) {
          console.error(`读取反馈文件 ${file} 失败:`, error.message);
        }
      }

      return feedbacks.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('获取用户反馈失败:', error.message);
      return [];
    }
  }

  // 记录用户体验指标
  recordMetrics(metrics) {
    try {
      const metricsData = {
        id: `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...metrics
      };

      const metricsFile = path.join(this.metricsDir, `metrics_${new Date().toISOString().split('T')[0]}.json`);
      
      let metricsList = [];
      if (fs.existsSync(metricsFile)) {
        try {
          metricsList = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
        } catch (error) {
          metricsList = [];
        }
      }

      metricsList.push(metricsData);
      fs.writeFileSync(metricsFile, JSON.stringify(metricsList, null, 2), 'utf-8');

      return metricsData.id;
    } catch (error) {
      console.error('记录用户体验指标失败:', error.message);
      return null;
    }
  }

  // 获取用户体验指标
  getMetrics(days = 7) {
    try {
      const metricsList = [];
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

      const metricsFiles = fs.readdirSync(this.metricsDir)
        .filter(file => file.endsWith('.json'));

      for (const file of metricsFiles) {
        const filePath = path.join(this.metricsDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantMetrics = fileData.filter(metric => metric.timestamp > cutoffDate);
          metricsList.push(...relevantMetrics);
        } catch (error) {
          console.error(`读取指标文件 ${file} 失败:`, error.message);
        }
      }

      return metricsList.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('获取用户体验指标失败:', error.message);
      return [];
    }
  }

  // 生成用户体验报告
  generateUXReport(days = 30) {
    try {
      const feedbacks = this.getFeedback(days);
      const metrics = this.getMetrics(days);

      // 分析反馈
      const feedbackAnalysis = this._analyzeFeedback(feedbacks);
      // 分析指标
      const metricsAnalysis = this._analyzeMetrics(metrics);

      const report = {
        generatedAt: Date.now(),
        period: `${days}天`,
        feedbackAnalysis,
        metricsAnalysis,
        recommendations: this._generateRecommendations(feedbackAnalysis, metricsAnalysis)
      };

      const reportFile = path.join(this.uxDir, `ux_report_${Date.now()}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');

      console.log('用户体验报告生成成功');
      return report;
    } catch (error) {
      console.error('生成用户体验报告失败:', error.message);
      return null;
    }
  }

  // 分析反馈
  _analyzeFeedback(feedbacks) {
    const analysis = {
      totalFeedback: feedbacks.length,
      byType: {},
      bySentiment: {},
      commonIssues: []
    };

    // 按类型分类
    feedbacks.forEach(feedback => {
      const type = feedback.type || 'general';
      analysis.byType[type] = (analysis.byType[type] || 0) + 1;

      // 按情感分类
      const sentiment = feedback.sentiment || 'neutral';
      analysis.bySentiment[sentiment] = (analysis.bySentiment[sentiment] || 0) + 1;
    });

    // 识别常见问题
    const issues = {};
    feedbacks.forEach(feedback => {
      if (feedback.issue) {
        const issue = feedback.issue.toLowerCase();
        issues[issue] = (issues[issue] || 0) + 1;
      }
    });

    // 排序并取前5个常见问题
    analysis.commonIssues = Object.entries(issues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));

    return analysis;
  }

  // 分析指标
  _analyzeMetrics(metrics) {
    const analysis = {
      totalMetrics: metrics.length,
      averageResponseTime: 0,
      averageSatisfaction: 0,
      performanceTrends: []
    };

    if (metrics.length > 0) {
      // 计算平均响应时间
      const totalResponseTime = metrics.reduce((sum, metric) => sum + (metric.responseTime || 0), 0);
      analysis.averageResponseTime = totalResponseTime / metrics.length;

      // 计算平均满意度
      const totalSatisfaction = metrics.reduce((sum, metric) => sum + (metric.satisfaction || 0), 0);
      analysis.averageSatisfaction = totalSatisfaction / metrics.length;

      // 按日期分组分析性能趋势
      const dailyMetrics = {};
      metrics.forEach(metric => {
        const date = new Date(metric.timestamp).toISOString().split('T')[0];
        if (!dailyMetrics[date]) {
          dailyMetrics[date] = {
            responseTimes: [],
            satisfactions: []
          };
        }
        if (metric.responseTime) dailyMetrics[date].responseTimes.push(metric.responseTime);
        if (metric.satisfaction) dailyMetrics[date].satisfactions.push(metric.satisfaction);
      });

      // 计算每日平均值
      analysis.performanceTrends = Object.entries(dailyMetrics)
        .map(([date, data]) => ({
          date,
          avgResponseTime: data.responseTimes.length > 0 ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length : 0,
          avgSatisfaction: data.satisfactions.length > 0 ? data.satisfactions.reduce((a, b) => a + b, 0) / data.satisfactions.length : 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    return analysis;
  }

  // 生成改进建议
  _generateRecommendations(feedbackAnalysis, metricsAnalysis) {
    const recommendations = [];

    // 基于响应时间的建议
    if (metricsAnalysis.averageResponseTime > 500) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        description: '响应时间过长，建议优化API性能',
        actions: [
          '检查并优化数据库查询',
          '实现缓存机制',
          '优化代码执行效率'
        ]
      });
    }

    // 基于满意度的建议
    if (metricsAnalysis.averageSatisfaction < 4) {
      recommendations.push({
        type: 'satisfaction',
        priority: 'medium',
        description: '用户满意度较低，建议改善用户体验',
        actions: [
          '优化用户界面',
          '提供更清晰的错误信息',
          '增加功能说明文档'
        ]
      });
    }

    // 基于常见问题的建议
    if (feedbackAnalysis.commonIssues.length > 0) {
      recommendations.push({
        type: 'issues',
        priority: 'medium',
        description: '存在常见问题，建议针对性解决',
        actions: feedbackAnalysis.commonIssues.map(issue => `解决: ${issue.issue}`)
      });
    }

    // 通用建议
    recommendations.push({
      type: 'general',
      priority: 'low',
      description: '持续优化用户体验',
      actions: [
        '定期收集用户反馈',
        '监控系统性能指标',
        '更新文档和使用指南'
      ]
    });

    return recommendations;
  }

  // 优化API响应
  optimizeAPIResponse(response, statusCode, data, message) {
    return {
      status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
      statusCode,
      message: message || (statusCode >= 200 && statusCode < 300 ? '操作成功' : '操作失败'),
      data,
      timestamp: Date.now()
    };
  }

  // 生成友好的错误信息
  generateFriendlyError(error) {
    const errorMap = {
      'ENOENT': '请求的资源不存在',
      'EACCES': '权限不足',
      'ECONNREFUSED': '连接被拒绝',
      'ValidationError': '数据验证失败',
      'TypeError': '类型错误',
      'SyntaxError': '语法错误'
    };

    const errorType = error.name || error.code || 'UnknownError';
    const friendlyMessage = errorMap[errorType] || '发生未知错误';

    return {
      code: errorType,
      message: friendlyMessage,
      details: error.message || '',
      timestamp: Date.now()
    };
  }

  // 优化用户界面提示
  generateUserMessage(type, content) {
    const messageTypes = {
      success: {
        icon: '✅',
        color: '#4CAF50',
        title: '成功'
      },
      error: {
        icon: '❌',
        color: '#F44336',
        title: '错误'
      },
      warning: {
        icon: '⚠️',
        color: '#FF9800',
        title: '警告'
      },
      info: {
        icon: 'ℹ️',
        color: '#2196F3',
        title: '信息'
      }
    };

    const config = messageTypes[type] || messageTypes.info;

    return {
      ...config,
      content,
      timestamp: Date.now()
    };
  }

  // 分析用户行为
  analyzeUserBehavior(events) {
    try {
      const analysis = {
        totalEvents: events.length,
        byType: {},
        mostFrequentActions: [],
        averageSessionDuration: 0
      };

      // 按类型分类
      events.forEach(event => {
        const type = event.type || 'unknown';
        analysis.byType[type] = (analysis.byType[type] || 0) + 1;
      });

      // 识别最频繁的操作
      const actions = {};
      events.forEach(event => {
        if (event.action) {
          const action = event.action.toLowerCase();
          actions[action] = (actions[action] || 0) + 1;
        }
      });

      // 排序并取前5个最频繁的操作
      analysis.mostFrequentActions = Object.entries(actions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([action, count]) => ({ action, count }));

      // 计算平均会话时长
      if (events.length > 0) {
        const sessions = {};
        events.forEach(event => {
          const sessionId = event.sessionId || 'default';
          if (!sessions[sessionId]) {
            sessions[sessionId] = {
              start: event.timestamp,
              end: event.timestamp
            };
          } else {
            sessions[sessionId].end = Math.max(sessions[sessionId].end, event.timestamp);
          }
        });

        const totalDuration = Object.values(sessions)
          .reduce((sum, session) => sum + (session.end - session.start), 0);
        analysis.averageSessionDuration = totalDuration / Object.keys(sessions).length;
      }

      return analysis;
    } catch (error) {
      console.error('分析用户行为失败:', error.message);
      return null;
    }
  }

  // 生成用户体验改进计划
  generateImprovementPlan() {
    try {
      const report = this.generateUXReport();
      const plan = {
        id: `plan_${Date.now()}`,
        generatedAt: Date.now(),
        goals: [
          '提高系统响应速度',
          '提升用户满意度',
          '减少常见问题',
          '优化用户界面'
        ],
        initiatives: [],
        timeline: {
          shortTerm: '1-2周',
          mediumTerm: '1-2个月',
          longTerm: '3-6个月'
        }
      };

      // 基于报告生成具体举措
      if (report) {
        // 短期举措
        if (report.metricsAnalysis.averageResponseTime > 500) {
          plan.initiatives.push({
            id: `init_${Date.now()}_1`,
            title: '优化API响应时间',
            description: '减少API响应时间，提高系统性能',
            timeline: 'shortTerm',
            priority: 'high',
            actions: [
              '实现API响应缓存',
              '优化数据库查询',
              '压缩响应数据'
            ]
          });
        }

        // 中期举措
        if (report.feedbackAnalysis.commonIssues.length > 0) {
          plan.initiatives.push({
            id: `init_${Date.now()}_2`,
            title: '解决常见问题',
            description: '针对用户反馈的常见问题进行修复',
            timeline: 'mediumTerm',
            priority: 'medium',
            actions: report.feedbackAnalysis.commonIssues.map(issue => `解决: ${issue.issue}`)
          });
        }

        // 长期举措
        plan.initiatives.push({
          id: `init_${Date.now()}_3`,
          title: '持续用户体验优化',
          description: '建立用户体验监控和优化机制',
          timeline: 'longTerm',
          priority: 'low',
          actions: [
            '建立用户反馈收集系统',
            '定期生成用户体验报告',
            '持续优化用户界面'
          ]
        });
      }

      const planFile = path.join(this.uxDir, `improvement_plan_${plan.id}.json`);
      fs.writeFileSync(planFile, JSON.stringify(plan, null, 2), 'utf-8');

      console.log('用户体验改进计划生成成功');
      return plan;
    } catch (error) {
      console.error('生成用户体验改进计划失败:', error.message);
      return null;
    }
  }

  // 验证用户体验状态
  validateUXStatus() {
    try {
      const report = this.generateUXReport(7);
      const status = {
        timestamp: Date.now(),
        overallStatus: 'good',
        metrics: {
          responseTime: report ? report.metricsAnalysis.averageResponseTime : 0,
          satisfaction: report ? report.metricsAnalysis.averageSatisfaction : 0,
          feedbackCount: report ? report.feedbackAnalysis.totalFeedback : 0
        },
        recommendations: report ? report.recommendations : []
      };

      // 评估状态
      if (status.metrics.responseTime > 1000) {
        status.overallStatus = 'poor';
      } else if (status.metrics.responseTime > 500) {
        status.overallStatus = 'fair';
      }

      if (status.metrics.satisfaction < 3) {
        status.overallStatus = 'poor';
      } else if (status.metrics.satisfaction < 4) {
        status.overallStatus = 'fair';
      }

      console.log('用户体验状态验证完成:', status.overallStatus);
      return status;
    } catch (error) {
      console.error('验证用户体验状态失败:', error.message);
      return null;
    }
  }
}

const userExperienceOptimizer = new UserExperienceOptimizer();

module.exports = {
  UserExperienceOptimizer,
  userExperienceOptimizer
};
