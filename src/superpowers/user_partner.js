/**
 * 用户伙伴模块
 * 实现与用户的交互和关系管理
 * JavaScript Version
 */

const fs = require('fs');
const path = require('path');

class UserPartner {
  /**
   * 用户伙伴类
   * @param {string} storagePath - 存储用户数据的文件路径
   */
  constructor(storagePath = 'user_partner.json') {
    this.storagePath = storagePath;
    this.userData = this._loadUserData();
  }

  _loadUserData() {
    /**
     * 加载用户数据
     * @returns {Object} 用户数据
     */
    try {
      if (fs.existsSync(this.storagePath)) {
        const content = fs.readFileSync(this.storagePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn(`加载用户数据失败: ${error.message}`);
    }
    return {
      user_profile: {
        name: '用户',
        interests: [],
        preferences: {},
        interaction_count: 0,
        last_interaction: 0
      },
      relationship: {
        level: 1,
        trust_score: 50,
        interaction_history: []
      }
    };
  }

  _saveUserData() {
    /**
     * 保存用户数据
     */
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(this.userData, null, 2), 'utf-8');
    } catch (error) {
      console.error(`保存用户数据失败: ${error.message}`);
    }
  }

  generateGreeting() {
    /**
     * 生成问候语
     * @returns {string} 问候语
     */
    const userProfile = this.userData.user_profile;
    const relationship = this.userData.relationship;
    
    const greetings = [
      `你好，${userProfile.name}！很高兴见到你。`,
      `嗨，${userProfile.name}！今天有什么我可以帮助你的吗？`,
      `Hello，${userProfile.name}！最近过得怎么样？`,
      `嘿，${userProfile.name}！有什么新的想法或问题吗？`
    ];
    
    // 根据关系等级调整问候语
    if (relationship.level >= 3) {
      greetings.push(`亲爱的${userProfile.name}，很高兴再次见到你！`);
      greetings.push(`嗨，我的老朋友${userProfile.name}！最近怎么样？`);
    }
    
    // 随机选择一个问候语
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  }

  generatePersonalizedResponse(userInput, context = {}) {
    /**
     * 生成个性化响应
     * @param {string} userInput - 用户输入
     * @param {Object} context - 上下文信息
     * @returns {string} 个性化响应
     */
    const userProfile = this.userData.user_profile;
    const relationship = this.userData.relationship;
    
    // 分析用户输入
    const inputLower = userInput.toLowerCase();
    
    // 基于用户兴趣和偏好生成响应
    let response = '';
    
    if (inputLower.includes('你好') || inputLower.includes('hello') || inputLower.includes('hi')) {
      response = this.generateGreeting();
    } else if (inputLower.includes('名字') || inputLower.includes('叫什么')) {
      response = `我是你的AI伙伴，你可以叫我Lossless Superpower。`;
    } else if (inputLower.includes('帮助') || inputLower.includes('help')) {
      response = `我可以帮助你学习新技能、解决问题、提供建议，以及与你进行愉快的交流。你有什么具体需要帮助的吗？`;
    } else if (inputLower.includes('兴趣') || inputLower.includes('爱好')) {
      if (userProfile.interests.length > 0) {
        response = `根据我们的交流，我了解到你对${userProfile.interests.join('、')}等话题感兴趣。`;
      } else {
        response = `我还在了解你的兴趣爱好。你平时喜欢做什么呢？`;
      }
    } else {
      // 默认响应
      response = `我理解你的意思。让我思考一下如何最好地帮助你...`;
    }
    
    // 根据关系等级调整响应语气
    if (relationship.level >= 2) {
      response += ' 作为你的伙伴，我会尽力提供最好的支持。';
    }
    
    return response;
  }

  getRelationshipStatus() {
    /**
     * 获取关系状态
     * @returns {Object} 关系状态
     */
    return this.userData.relationship;
  }

  generatePartnerMessage(topic, context = {}) {
    /**
     * 生成伙伴消息
     * @param {string} topic - 消息主题
     * @param {Object} context - 上下文信息
     * @returns {string} 伙伴消息
     */
    const messages = {
      'greeting': this.generateGreeting(),
      'check_in': `嘿，${this.userData.user_profile.name}！最近怎么样？有什么新的进展吗？`,
      'encouragement': `你做得很好，${this.userData.user_profile.name}！继续保持这种势头！`,
      'congratulation': `恭喜你，${this.userData.user_profile.name}！这是一个很棒的成就！`,
      'support': `我在这里支持你，${this.userData.user_profile.name}。无论遇到什么困难，我们一起面对。`,
      'feedback': `谢谢你的反馈，${this.userData.user_profile.name}。这对我很有帮助！`
    };
    
    return messages[topic] || `我在这里，${this.userData.user_profile.name}。有什么我可以帮助你的吗？`;
  }

  learnFromFeedback(feedback) {
    /**
     * 从反馈中学习
     * @param {Object} feedback - 用户反馈
     */
    const userProfile = this.userData.user_profile;
    const relationship = this.userData.relationship;
    
    // 更新交互计数
    userProfile.interaction_count += 1;
    userProfile.last_interaction = Date.now() / 1000;
    
    // 处理反馈
    if (feedback) {
      if (feedback.satisfied) {
        // 增加信任分数
        relationship.trust_score = Math.min(100, relationship.trust_score + 5);
        // 可能提升关系等级
        if (relationship.trust_score >= 80 && relationship.level < 5) {
          relationship.level += 1;
        }
      } else {
        // 降低信任分数
        relationship.trust_score = Math.max(0, relationship.trust_score - 3);
      }
      
      // 记录反馈到交互历史
      relationship.interaction_history.push({
        timestamp: Date.now() / 1000,
        feedback: feedback,
        trust_score: relationship.trust_score,
        level: relationship.level
      });
      
      // 限制交互历史长度
      if (relationship.interaction_history.length > 100) {
        relationship.interaction_history = relationship.interaction_history.slice(-100);
      }
    }
    
    // 保存用户数据
    this._saveUserData();
  }

  updateUserProfile(interactionData) {
    /**
     * 更新用户配置文件
     * @param {Object} interactionData - 交互数据
     */
    const userProfile = this.userData.user_profile;
    
    // 提取用户兴趣
    if (interactionData.user_input) {
      const interests = this._extractInterests(interactionData.user_input);
      for (const interest of interests) {
        if (!userProfile.interests.includes(interest)) {
          userProfile.interests.push(interest);
        }
      }
    }
    
    // 保存用户数据
    this._saveUserData();
  }

  _extractInterests(text) {
    /**
     * 从文本中提取兴趣
     * @param {string} text - 文本内容
     * @returns {Array} 兴趣列表
     */
    const interests = [];
    const interestKeywords = {
      '编程': ['代码', '编程', '开发', '实现', '算法', '编程', '脚本', '程序'],
      '写作': ['写作', '文章', '文档', '报告', '文案', '写作', '文章', '文档'],
      '设计': ['设计', '界面', 'UI', 'UX', '布局', '设计', '界面', 'UI'],
      '分析': ['分析', '数据', '统计', '趋势', '预测', '分析', '数据', '统计'],
      '研究': ['研究', '调查', '资料', '信息', '背景', '研究', '调查', '资料'],
      '音乐': ['音乐', '歌曲', '旋律', '节奏', '乐器', '音乐', '歌曲', '旋律'],
      '电影': ['电影', '影片', '剧情', '演员', '导演', '电影', '影片', '剧情'],
      '运动': ['运动', '健身', '锻炼', '跑步', '游泳', '运动', '健身', '锻炼'],
      '阅读': ['阅读', '书籍', '小说', '文章', '知识', '阅读', '书籍', '小说'],
      '旅行': ['旅行', '旅游', '景点', '风景', '体验', '旅行', '旅游', '景点']
    };
    
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        interests.push(interest);
      }
    }
    
    return interests;
  }
}

// 全局用户伙伴实例
const userPartner = new UserPartner();

// 导出函数
function generateGreeting() {
  /**
   * 生成问候语
   */
  return userPartner.generateGreeting();
}

function generatePersonalizedResponse(userInput, context = {}) {
  /**
   * 生成个性化响应
   */
  return userPartner.generatePersonalizedResponse(userInput, context);
}

function getRelationshipStatus() {
  /**
   * 获取关系状态
   */
  return userPartner.getRelationshipStatus();
}

function generatePartnerMessage(topic, context = {}) {
  /**
   * 生成伙伴消息
   */
  return userPartner.generatePartnerMessage(topic, context);
}

function learnFromFeedback(feedback) {
  /**
   * 从反馈中学习
   */
  return userPartner.learnFromFeedback(feedback);
}

module.exports = {
  generateGreeting,
  generatePersonalizedResponse,
  getRelationshipStatus,
  generatePartnerMessage,
  learnFromFeedback
};
