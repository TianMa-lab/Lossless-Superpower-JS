/**
 * 用户反馈管理模块
 * 负责收集、存储和分析用户对技能的反馈
 */

const fs = require('fs');
const path = require('path');

class FeedbackManager {
  /**
   * 用户反馈管理器
   * @param {string} storageDir - 存储目录
   */
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.feedbackData = new Map();
    this.loadFeedbackData();
  }

  /**
   * 加载反馈数据
   */
  loadFeedbackData() {
    const feedbackFilePath = path.join(this.storageDir, 'feedback_data.json');
    
    try {
      if (fs.existsSync(feedbackFilePath)) {
        const content = fs.readFileSync(feedbackFilePath, 'utf-8');
        const data = JSON.parse(content);
        this.feedbackData = new Map(Object.entries(data));
        console.log('用户反馈数据加载成功');
      }
    } catch (error) {
      console.error(`加载用户反馈数据失败: ${error.message}`);
    }
  }

  /**
   * 保存反馈数据
   */
  saveFeedbackData() {
    const feedbackFilePath = path.join(this.storageDir, 'feedback_data.json');
    
    try {
      const data = Object.fromEntries(this.feedbackData);
      fs.mkdirSync(this.storageDir, { recursive: true });
      fs.writeFileSync(feedbackFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('用户反馈数据保存成功');
    } catch (error) {
      console.error(`保存用户反馈数据失败: ${error.message}`);
    }
  }

  /**
   * 提交技能反馈
   * @param {string} skillName - 技能名称
   * @param {string} userId - 用户ID
   * @param {number} rating - 评分 (1-5)
   * @param {string} comment - 评论
   * @param {Object} metadata - 元数据
   * @returns {string} 反馈ID
   */
  submitFeedback(skillName, userId, rating, comment, metadata = {}) {
    const feedbackId = `${skillName}_${userId}_${Date.now()}`;
    const feedback = {
      id: feedbackId,
      skillName: skillName,
      userId: userId,
      rating: rating,
      comment: comment,
      metadata: metadata,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    if (!this.feedbackData.has(skillName)) {
      this.feedbackData.set(skillName, []);
    }
    
    this.feedbackData.get(skillName).push(feedback);
    this.saveFeedbackData();
    
    console.log(`用户 ${userId} 对技能 ${skillName} 提交了反馈，评分: ${rating}`);
    return feedbackId;
  }

  /**
   * 获取技能的反馈
   * @param {string} skillName - 技能名称
   * @param {Object} filters - 过滤条件
   * @returns {Array} 反馈列表
   */
  getSkillFeedback(skillName, filters = {}) {
    const feedbackList = this.feedbackData.get(skillName) || [];
    let filteredFeedback = [...feedbackList];
    
    // 应用过滤条件
    if (filters.minRating) {
      filteredFeedback = filteredFeedback.filter(fb => fb.rating >= filters.minRating);
    }
    
    if (filters.maxRating) {
      filteredFeedback = filteredFeedback.filter(fb => fb.rating <= filters.maxRating);
    }
    
    if (filters.startDate) {
      filteredFeedback = filteredFeedback.filter(fb => fb.timestamp >= filters.startDate);
    }
    
    if (filters.endDate) {
      filteredFeedback = filteredFeedback.filter(fb => fb.timestamp <= filters.endDate);
    }
    
    if (filters.status) {
      filteredFeedback = filteredFeedback.filter(fb => fb.status === filters.status);
    }
    
    // 按时间排序
    filteredFeedback.sort((a, b) => b.timestamp - a.timestamp);
    
    return filteredFeedback;
  }

  /**
   * 获取用户的反馈
   * @param {string} userId - 用户ID
   * @returns {Array} 反馈列表
   */
  getUserFeedback(userId) {
    const userFeedback = [];
    
    for (const [skillName, feedbackList] of this.feedbackData) {
      for (const feedback of feedbackList) {
        if (feedback.userId === userId) {
          userFeedback.push(feedback);
        }
      }
    }
    
    userFeedback.sort((a, b) => b.timestamp - a.timestamp);
    return userFeedback;
  }

  /**
   * 获取技能的平均评分
   * @param {string} skillName - 技能名称
   * @returns {number} 平均评分
   */
  getSkillAverageRating(skillName) {
    const feedbackList = this.feedbackData.get(skillName) || [];
    if (feedbackList.length === 0) {
      return 0;
    }
    
    const totalRating = feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
    return totalRating / feedbackList.length;
  }

  /**
   * 获取技能的反馈统计
   * @param {string} skillName - 技能名称
   * @returns {Object} 反馈统计
   */
  getSkillFeedbackStats(skillName) {
    const feedbackList = this.feedbackData.get(skillName) || [];
    const stats = {
      totalFeedback: feedbackList.length,
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      statusDistribution: {
        pending: 0,
        processed: 0,
        resolved: 0
      },
      recentFeedback: []
    };
    
    if (feedbackList.length > 0) {
      // 计算平均评分
      const totalRating = feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
      stats.averageRating = totalRating / feedbackList.length;
      
      // 计算评分分布
      for (const feedback of feedbackList) {
        stats.ratingDistribution[feedback.rating]++;
        stats.statusDistribution[feedback.status] = (stats.statusDistribution[feedback.status] || 0) + 1;
      }
      
      // 获取最近的反馈
      const recentFeedback = [...feedbackList].sort((a, b) => b.timestamp - a.timestamp);
      stats.recentFeedback = recentFeedback.slice(0, 5);
    }
    
    return stats;
  }

  /**
   * 更新反馈状态
   * @param {string} skillName - 技能名称
   * @param {string} feedbackId - 反馈ID
   * @param {string} status - 新状态
   * @returns {boolean} 是否更新成功
   */
  updateFeedbackStatus(skillName, feedbackId, status) {
    const feedbackList = this.feedbackData.get(skillName);
    if (!feedbackList) {
      return false;
    }
    
    const feedback = feedbackList.find(fb => fb.id === feedbackId);
    if (!feedback) {
      return false;
    }
    
    feedback.status = status;
    this.saveFeedbackData();
    console.log(`更新反馈 ${feedbackId} 状态为 ${status}`);
    return true;
  }

  /**
   * 分析反馈数据
   * @param {string} skillName - 技能名称（可选，不提供则分析所有技能）
   * @returns {Object} 分析结果
   */
  analyzeFeedback(skillName = null) {
    let feedbackList = [];
    
    if (skillName) {
      feedbackList = this.feedbackData.get(skillName) || [];
    } else {
      // 分析所有技能的反馈
      for (const [skill, feedbacks] of this.feedbackData) {
        feedbackList.push(...feedbacks);
      }
    }
    
    const analysis = {
      totalFeedback: feedbackList.length,
      averageRating: 0,
      ratingTrend: [],
      commonIssues: [],
      positiveComments: [],
      negativeComments: []
    };
    
    if (feedbackList.length > 0) {
      // 计算平均评分
      const totalRating = feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
      analysis.averageRating = totalRating / feedbackList.length;
      
      // 分析评分趋势
      analysis.ratingTrend = this.analyzeRatingTrend(feedbackList);
      
      // 分析常见问题
      analysis.commonIssues = this.analyzeCommonIssues(feedbackList);
      
      // 分析正面和负面评论
      const comments = this.analyzeComments(feedbackList);
      analysis.positiveComments = comments.positive;
      analysis.negativeComments = comments.negative;
    }
    
    return analysis;
  }

  /**
   * 分析评分趋势
   * @param {Array} feedbackList - 反馈列表
   * @returns {Array} 评分趋势
   */
  analyzeRatingTrend(feedbackList) {
    const trend = [];
    const sortedFeedback = [...feedbackList].sort((a, b) => a.timestamp - b.timestamp);
    
    // 按周分组
    const weeklyRatings = new Map();
    
    for (const feedback of sortedFeedback) {
      const weekStart = this.getWeekStart(feedback.timestamp);
      if (!weeklyRatings.has(weekStart)) {
        weeklyRatings.set(weekStart, []);
      }
      weeklyRatings.get(weekStart).push(feedback.rating);
    }
    
    // 计算每周平均评分
    for (const [week, ratings] of weeklyRatings) {
      const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      trend.push({
        week: week,
        averageRating: averageRating,
        count: ratings.length
      });
    }
    
    return trend;
  }

  /**
   * 获取周开始时间
   * @param {number} timestamp - 时间戳
   * @returns {string} 周开始日期
   */
  getWeekStart(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  }

  /**
   * 分析常见问题
   * @param {Array} feedbackList - 反馈列表
   * @returns {Array} 常见问题
   */
  analyzeCommonIssues(feedbackList) {
    const issues = new Map();
    
    for (const feedback of feedbackList) {
      if (feedback.rating <= 3 && feedback.comment) {
        const keywords = this.extractKeywords(feedback.comment);
        for (const keyword of keywords) {
          issues.set(keyword, (issues.get(keyword) || 0) + 1);
        }
      }
    }
    
    // 按出现频率排序
    const sortedIssues = Array.from(issues.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count);
    
    return sortedIssues.slice(0, 10);
  }

  /**
   * 提取关键词
   * @param {string} text - 文本
   * @returns {Array} 关键词列表
   */
  extractKeywords(text) {
    // 简单的关键词提取，实际应用中可以使用更复杂的NLP技术
    const stopWords = new Set(['的', '了', '和', '是', '在', '有', '我', '他', '她', '它', '们']);
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => !stopWords.has(word) && word.length > 2);
  }

  /**
   * 分析评论
   * @param {Array} feedbackList - 反馈列表
   * @returns {Object} 正面和负面评论
   */
  analyzeComments(feedbackList) {
    const positive = [];
    const negative = [];
    
    for (const feedback of feedbackList) {
      if (feedback.comment) {
        if (feedback.rating >= 4) {
          positive.push({
            comment: feedback.comment,
            rating: feedback.rating,
            timestamp: feedback.timestamp
          });
        } else if (feedback.rating <= 2) {
          negative.push({
            comment: feedback.comment,
            rating: feedback.rating,
            timestamp: feedback.timestamp
          });
        }
      }
    }
    
    // 按评分和时间排序
    positive.sort((a, b) => b.rating - a.rating || b.timestamp - a.timestamp);
    negative.sort((a, b) => a.rating - b.rating || b.timestamp - a.timestamp);
    
    return {
      positive: positive.slice(0, 10),
      negative: negative.slice(0, 10)
    };
  }

  /**
   * 生成反馈报告
   * @param {string} skillName - 技能名称（可选）
   * @returns {Object} 反馈报告
   */
  generateFeedbackReport(skillName = null) {
    const analysis = this.analyzeFeedback(skillName);
    const report = {
      skillName: skillName || '所有技能',
      totalFeedback: analysis.totalFeedback,
      averageRating: analysis.averageRating,
      ratingTrend: analysis.ratingTrend,
      commonIssues: analysis.commonIssues,
      positiveComments: analysis.positiveComments,
      negativeComments: analysis.negativeComments,
      timestamp: Date.now()
    };
    
    return report;
  }

  /**
   * 导出反馈数据
   * @param {string} filePath - 导出文件路径
   */
  exportFeedbackData(filePath) {
    try {
      const data = {
        feedbackData: Object.fromEntries(this.feedbackData),
        report: this.generateFeedbackReport(),
        exportedAt: Date.now()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`反馈数据导出成功: ${filePath}`);
    } catch (error) {
      console.error(`导出反馈数据失败: ${error.message}`);
    }
  }

  /**
   * 导入反馈数据
   * @param {string} filePath - 导入文件路径
   */
  importFeedbackData(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (data.feedbackData) {
        this.feedbackData = new Map(Object.entries(data.feedbackData));
        this.saveFeedbackData();
        console.log(`反馈数据导入成功: ${filePath}`);
      }
    } catch (error) {
      console.error(`导入反馈数据失败: ${error.message}`);
    }
  }

  /**
   * 清理过期反馈
   * @param {number} days - 保留天数
   */
  cleanupOldFeedback(days = 90) {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    for (const [skillName, feedbackList] of this.feedbackData) {
      const recentFeedback = feedbackList.filter(fb => fb.timestamp > cutoffTime);
      if (recentFeedback.length < feedbackList.length) {
        this.feedbackData.set(skillName, recentFeedback);
        cleanedCount += feedbackList.length - recentFeedback.length;
      }
    }
    
    if (cleanedCount > 0) {
      this.saveFeedbackData();
      console.log(`清理了 ${cleanedCount} 条过期反馈`);
    }
  }

  /**
   * 删除技能的反馈
   * @param {string} skillName - 技能名称
   * @returns {number} 删除的反馈数量
   */
  deleteSkillFeedback(skillName) {
    const feedbackCount = this.feedbackData.get(skillName)?.length || 0;
    this.feedbackData.delete(skillName);
    this.saveFeedbackData();
    console.log(`删除了技能 ${skillName} 的 ${feedbackCount} 条反馈`);
    return feedbackCount;
  }

  /**
   * 获取反馈统计摘要
   * @returns {Object} 统计摘要
   */
  getFeedbackSummary() {
    let totalFeedback = 0;
    let totalRating = 0;
    const skillCount = this.feedbackData.size;
    
    for (const [skillName, feedbackList] of this.feedbackData) {
      totalFeedback += feedbackList.length;
      totalRating += feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
    }
    
    return {
      totalFeedback: totalFeedback,
      totalSkills: skillCount,
      averageRating: totalFeedback > 0 ? totalRating / totalFeedback : 0,
      averageFeedbackPerSkill: skillCount > 0 ? totalFeedback / skillCount : 0
    };
  }
}

// 导出模块
module.exports = {
  FeedbackManager
};
