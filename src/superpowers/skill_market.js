/**
 * 技能市场模块
 * 负责技能的发布、搜索、评级和管理
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SkillMarket {
  /**
   * 技能市场
   * @param {string} marketDir - 市场存储目录
   * @param {string} skillsDir - 技能存储目录
   */
  constructor(marketDir, skillsDir) {
    this.marketDir = marketDir;
    this.skillsDir = skillsDir;
    this.marketData = {
      skills: new Map(),
      categories: new Map(),
      tags: new Map(),
      users: new Map(),
      transactions: new Map(),
      reviews: new Map(),
      sharedSkills: new Map()
    };
    this.loadMarketData();
  }

  /**
   * 加载市场数据
   */
  loadMarketData() {
    const marketFilePath = path.join(this.marketDir, 'market_data.json');
    
    try {
      if (fs.existsSync(marketFilePath)) {
        const content = fs.readFileSync(marketFilePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (data.skills) {
          this.marketData.skills = new Map(Object.entries(data.skills));
        }
        
        if (data.categories) {
          this.marketData.categories = new Map(Object.entries(data.categories));
        }
        
        if (data.tags) {
          this.marketData.tags = new Map(Object.entries(data.tags));
        }
        
        if (data.users) {
          this.marketData.users = new Map(Object.entries(data.users));
        }
        
        if (data.transactions) {
          this.marketData.transactions = new Map(Object.entries(data.transactions));
        }
        
        if (data.reviews) {
          this.marketData.reviews = new Map(Object.entries(data.reviews));
        }
        
        if (data.sharedSkills) {
          this.marketData.sharedSkills = new Map(Object.entries(data.sharedSkills));
        }
        
        console.log('技能市场数据加载成功');
      }
    } catch (error) {
      console.error(`加载技能市场数据失败: ${error.message}`);
    }
  }

  /**
   * 保存市场数据
   */
  saveMarketData() {
    const marketFilePath = path.join(this.marketDir, 'market_data.json');
    
    try {
      const data = {
        skills: Object.fromEntries(this.marketData.skills),
        categories: Object.fromEntries(this.marketData.categories),
        tags: Object.fromEntries(this.marketData.tags),
        users: Object.fromEntries(this.marketData.users),
        transactions: Object.fromEntries(this.marketData.transactions),
        reviews: Object.fromEntries(this.marketData.reviews),
        sharedSkills: Object.fromEntries(this.marketData.sharedSkills)
      };
      
      fs.mkdirSync(this.marketDir, { recursive: true });
      fs.writeFileSync(marketFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('技能市场数据保存成功');
    } catch (error) {
      console.error(`保存技能市场数据失败: ${error.message}`);
    }
  }

  /**
   * 发布技能到市场
   * @param {string} skillName - 技能名称
   * @param {string} userId - 用户ID
   * @param {Object} metadata - 元数据
   * @returns {string} 市场技能ID
   */
  publishSkill(skillName, userId, metadata = {}) {
    const skillPath = path.join(this.skillsDir, skillName);
    const skillFilePath = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillFilePath)) {
      console.error(`技能 ${skillName} 不存在`);
      return null;
    }
    
    try {
      // 读取技能文件
      const content = fs.readFileSync(skillFilePath, 'utf-8');
      
      // 生成市场技能ID
      const marketSkillId = `market_${skillName}_${Date.now()}`;
      
      // 创建技能市场记录
      const marketSkill = {
        id: marketSkillId,
        name: skillName,
        publisher: userId,
        version: metadata.version || '1.0.0',
        description: metadata.description || '',
        tags: metadata.tags || [],
        category: metadata.category || 'uncategorized',
        rating: 0,
        downloadCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        metadata: metadata
      };
      
      // 保存技能到市场
      this.marketData.skills.set(marketSkillId, marketSkill);
      
      // 更新分类
      if (!this.marketData.categories.has(marketSkill.category)) {
        this.marketData.categories.set(marketSkill.category, []);
      }
      this.marketData.categories.get(marketSkill.category).push(marketSkillId);
      
      // 更新标签
      for (const tag of marketSkill.tags) {
        if (!this.marketData.tags.has(tag)) {
          this.marketData.tags.set(tag, []);
        }
        this.marketData.tags.get(tag).push(marketSkillId);
      }
      
      // 更新用户
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          ratings: []
        });
      }
      this.marketData.users.get(userId).publishedSkills.push(marketSkillId);
      
      // 创建技能市场目录
      const marketSkillDir = path.join(this.marketDir, 'skills', marketSkillId);
      fs.mkdirSync(marketSkillDir, { recursive: true });
      
      // 复制技能文件到市场
      fs.writeFileSync(path.join(marketSkillDir, 'SKILL.md'), content, 'utf-8');
      
      // 保存市场数据
      this.saveMarketData();
      
      console.log(`技能 ${skillName} 发布到市场成功`);
      return marketSkillId;
    } catch (error) {
      console.error(`发布技能到市场失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 搜索技能
   * @param {string} query - 搜索查询
   * @param {Object} filters - 过滤条件
   * @returns {Array} 搜索结果
   */
  searchSkills(query, filters = {}) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const [skillId, skill] of this.marketData.skills) {
      const score = this.calculateSearchScore(skill, lowerQuery);
      if (score > 0) {
        // 应用过滤条件
        if (this.applyFilters(skill, filters)) {
          results.push({
            skill: skill,
            score: score
          });
        }
      }
    }
    
    // 排序
    results.sort((a, b) => b.score - a.score);
    
    return results.map(item => item.skill);
  }

  /**
   * 共享技能给其他用户
   * @param {string} skillId - 技能ID
   * @param {string} fromUserId - 分享者ID
   * @param {string} toUserId - 接收者ID
   * @param {Object} options - 共享选项
   * @returns {string} 共享ID
   */
  shareSkill(skillId, fromUserId, toUserId, options = {}) {
    const skill = this.marketData.skills.get(skillId);
    if (!skill) {
      console.error(`技能 ${skillId} 不存在`);
      return null;
    }
    
    try {
      const shareId = `share_${skillId}_${Date.now()}`;
      const sharedSkill = {
        id: shareId,
        skillId: skillId,
        fromUserId: fromUserId,
        toUserId: toUserId,
        sharedAt: Date.now(),
        status: 'active',
        options: options
      };
      
      this.marketData.sharedSkills.set(shareId, sharedSkill);
      this.saveMarketData();
      
      console.log(`技能 ${skillId} 共享给用户 ${toUserId} 成功`);
      return shareId;
    } catch (error) {
      console.error(`共享技能失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 购买技能
   * @param {string} skillId - 技能ID
   * @param {string} userId - 用户ID
   * @param {number} amount - 金额
   * @returns {string} 交易ID
   */
  purchaseSkill(skillId, userId, amount) {
    const skill = this.marketData.skills.get(skillId);
    if (!skill) {
      console.error(`技能 ${skillId} 不存在`);
      return null;
    }
    
    try {
      const transactionId = `tx_${skillId}_${Date.now()}`;
      const transaction = {
        id: transactionId,
        skillId: skillId,
        buyerId: userId,
        sellerId: skill.publisher,
        amount: amount,
        status: 'completed',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      this.marketData.transactions.set(transactionId, transaction);
      
      // 更新用户购买记录
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          purchasedSkills: [],
          ratings: []
        });
      }
      this.marketData.users.get(userId).purchasedSkills = 
        this.marketData.users.get(userId).purchasedSkills || [];
      this.marketData.users.get(userId).purchasedSkills.push(skillId);
      
      // 增加技能下载次数
      skill.downloadCount += 1;
      this.marketData.skills.set(skillId, skill);
      
      this.saveMarketData();
      
      console.log(`用户 ${userId} 购买技能 ${skillId} 成功`);
      return transactionId;
    } catch (error) {
      console.error(`购买技能失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 评价技能
   * @param {string} skillId - 技能ID
   * @param {string} userId - 用户ID
   * @param {number} rating - 评分 (1-5)
   * @param {string} comment - 评价内容
   * @returns {string} 评价ID
   */
  rateSkill(skillId, userId, rating, comment = '') {
    const skill = this.marketData.skills.get(skillId);
    if (!skill) {
      console.error(`技能 ${skillId} 不存在`);
      return null;
    }
    
    try {
      const reviewId = `review_${skillId}_${userId}_${Date.now()}`;
      const review = {
        id: reviewId,
        skillId: skillId,
        userId: userId,
        rating: rating,
        comment: comment,
        createdAt: Date.now()
      };
      
      this.marketData.reviews.set(reviewId, review);
      
      // 更新技能评分
      const reviews = Array.from(this.marketData.reviews.values())
        .filter(r => r.skillId === skillId);
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      skill.rating = averageRating;
      this.marketData.skills.set(skillId, skill);
      
      // 更新用户评价记录
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          ratings: []
        });
      }
      this.marketData.users.get(userId).ratings.push(reviewId);
      
      this.saveMarketData();
      
      console.log(`用户 ${userId} 评价技能 ${skillId} 成功`);
      return reviewId;
    } catch (error) {
      console.error(`评价技能失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 下载技能
   * @param {string} skillId - 技能ID
   * @param {string} userId - 用户ID
   * @returns {boolean} 是否下载成功
   */
  downloadSkill(skillId, userId) {
    const skill = this.marketData.skills.get(skillId);
    if (!skill) {
      console.error(`技能 ${skillId} 不存在`);
      return false;
    }
    
    try {
      const marketSkillDir = path.join(this.marketDir, 'skills', skillId);
      const skillFilePath = path.join(marketSkillDir, 'SKILL.md');
      
      if (!fs.existsSync(skillFilePath)) {
        console.error(`技能文件不存在: ${skillFilePath}`);
        return false;
      }
      
      // 创建本地技能目录
      const localSkillDir = path.join(this.skillsDir, skill.name);
      fs.mkdirSync(localSkillDir, { recursive: true });
      
      // 复制技能文件
      const content = fs.readFileSync(skillFilePath, 'utf-8');
      fs.writeFileSync(path.join(localSkillDir, 'SKILL.md'), content, 'utf-8');
      
      // 更新用户下载记录
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          ratings: []
        });
      }
      this.marketData.users.get(userId).downloadedSkills.push(skillId);
      
      // 增加技能下载次数
      skill.downloadCount += 1;
      this.marketData.skills.set(skillId, skill);
      
      this.saveMarketData();
      
      console.log(`用户 ${userId} 下载技能 ${skillId} 成功`);
      return true;
    } catch (error) {
      console.error(`下载技能失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 获取技能评价
   * @param {string} skillId - 技能ID
   * @returns {Array} 评价列表
   */
  getSkillReviews(skillId) {
    return Array.from(this.marketData.reviews.values())
      .filter(review => review.skillId === skillId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 获取用户交易历史
   * @param {string} userId - 用户ID
   * @returns {Array} 交易列表
   */
  getUserTransactions(userId) {
    return Array.from(this.marketData.transactions.values())
      .filter(tx => tx.buyerId === userId || tx.sellerId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 更新技能版本
   * @param {string} skillId - 技能ID
   * @param {string} userId - 用户ID
   * @param {string} newVersion - 新版本号
   * @param {string} content - 新技能内容
   * @returns {boolean} 是否更新成功
   */
  updateSkillVersion(skillId, userId, newVersion, content) {
    const skill = this.marketData.skills.get(skillId);
    if (!skill) {
      console.error(`技能 ${skillId} 不存在`);
      return false;
    }
    
    if (skill.publisher !== userId) {
      console.error(`用户 ${userId} 不是技能 ${skillId} 的发布者`);
      return false;
    }
    
    try {
      // 更新技能文件
      const marketSkillDir = path.join(this.marketDir, 'skills', skillId);
      fs.writeFileSync(path.join(marketSkillDir, 'SKILL.md'), content, 'utf-8');
      
      // 更新技能版本信息
      skill.version = newVersion;
      skill.updatedAt = Date.now();
      this.marketData.skills.set(skillId, skill);
      
      this.saveMarketData();
      
      console.log(`技能 ${skillId} 版本更新成功: ${newVersion}`);
      return true;
    } catch (error) {
      console.error(`更新技能版本失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 计算搜索得分
   * @param {Object} skill - 技能对象
   * @param {string} query - 搜索查询
   * @returns {number} 得分
   */
  calculateSearchScore(skill, query) {
    let score = 0;
    
    // 名称匹配
    if (skill.name.toLowerCase().includes(query)) {
      score += 3;
    }
    
    // 描述匹配
    if (skill.description.toLowerCase().includes(query)) {
      score += 2;
    }
    
    // 标签匹配
    for (const tag of skill.tags) {
      if (tag.toLowerCase().includes(query)) {
        score += 1;
      }
    }
    
    // 分类匹配
    if (skill.category.toLowerCase().includes(query)) {
      score += 1;
    }
    
    return score;
  }

  /**
   * 应用过滤条件
   * @param {Object} skill - 技能对象
   * @param {Object} filters - 过滤条件
   * @returns {boolean} 是否匹配
   */
  applyFilters(skill, filters) {
    // 分类过滤
    if (filters.category && skill.category !== filters.category) {
      return false;
    }
    
    // 标签过滤
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => skill.tags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }
    
    // 评分过滤
    if (filters.minRating && skill.rating < filters.minRating) {
      return false;
    }
    
    // 版本过滤
    if (filters.minVersion) {
      const versionCompare = this.compareVersions(skill.version, filters.minVersion);
      if (versionCompare < 0) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 比较版本号
   * @param {string} version1 - 版本1
   * @param {string} version2 - 版本2
   * @returns {number} 比较结果
   */
  compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    
    return 0;
  }

  /**
   * 下载技能
   * @param {string} marketSkillId - 市场技能ID
   * @param {string} userId - 用户ID
   * @returns {string} 下载的技能路径
   */
  downloadSkill(marketSkillId, userId) {
    const marketSkill = this.marketData.skills.get(marketSkillId);
    if (!marketSkill) {
      console.error(`市场技能 ${marketSkillId} 不存在`);
      return null;
    }
    
    try {
      // 增加下载次数
      marketSkill.downloadCount++;
      marketSkill.updatedAt = Date.now();
      
      // 更新用户下载记录
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          ratings: []
        });
      }
      
      const user = this.marketData.users.get(userId);
      if (!user.downloadedSkills.includes(marketSkillId)) {
        user.downloadedSkills.push(marketSkillId);
      }
      
      // 复制技能到用户技能目录
      const sourceDir = path.join(this.marketDir, 'skills', marketSkillId);
      const targetDir = path.join(this.skillsDir, marketSkill.name);
      
      fs.mkdirSync(targetDir, { recursive: true });
      const sourceFiles = fs.readdirSync(sourceDir);
      
      for (const file of sourceFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
      }
      
      // 保存市场数据
      this.saveMarketData();
      
      console.log(`用户 ${userId} 下载技能 ${marketSkill.name} 成功`);
      return targetDir;
    } catch (error) {
      console.error(`下载技能失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 评级技能
   * @param {string} marketSkillId - 市场技能ID
   * @param {string} userId - 用户ID
   * @param {number} rating - 评级 (1-5)
   * @param {string} comment - 评论
   * @returns {boolean} 是否评级成功
   */
  rateSkill(marketSkillId, userId, rating, comment = '') {
    const marketSkill = this.marketData.skills.get(marketSkillId);
    if (!marketSkill) {
      console.error(`市场技能 ${marketSkillId} 不存在`);
      return false;
    }
    
    try {
      // 记录评级
      if (!this.marketData.users.has(userId)) {
        this.marketData.users.set(userId, {
          id: userId,
          publishedSkills: [],
          downloadedSkills: [],
          ratings: []
        });
      }
      
      const user = this.marketData.users.get(userId);
      const existingRating = user.ratings.find(r => r.skillId === marketSkillId);
      
      if (existingRating) {
        existingRating.rating = rating;
        existingRating.comment = comment;
        existingRating.updatedAt = Date.now();
      } else {
        user.ratings.push({
          skillId: marketSkillId,
          rating: rating,
          comment: comment,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
      
      // 计算平均评级
      const allRatings = [];
      for (const [userId, user] of this.marketData.users) {
        for (const rating of user.ratings) {
          if (rating.skillId === marketSkillId) {
            allRatings.push(rating.rating);
          }
        }
      }
      
      if (allRatings.length > 0) {
        const averageRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
        marketSkill.rating = averageRating;
      }
      
      marketSkill.updatedAt = Date.now();
      
      // 保存市场数据
      this.saveMarketData();
      
      console.log(`用户 ${userId} 评级技能 ${marketSkill.name} 为 ${rating} 星`);
      return true;
    } catch (error) {
      console.error(`评级技能失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 获取技能详情
   * @param {string} marketSkillId - 市场技能ID
   * @returns {Object} 技能详情
   */
  getSkillDetails(marketSkillId) {
    const marketSkill = this.marketData.skills.get(marketSkillId);
    if (!marketSkill) {
      return null;
    }
    
    // 获取技能的评级和评论
    const ratings = [];
    for (const [userId, user] of this.marketData.users) {
      for (const rating of user.ratings) {
        if (rating.skillId === marketSkillId) {
          ratings.push({
            userId: userId,
            rating: rating.rating,
            comment: rating.comment,
            timestamp: rating.updatedAt
          });
        }
      }
    }
    
    return {
      ...marketSkill,
      ratings: ratings
    };
  }

  /**
   * 获取分类列表
   * @returns {Array} 分类列表
   */
  getCategories() {
    return Array.from(this.marketData.categories.entries())
      .map(([category, skillIds]) => ({
        category: category,
        skillCount: skillIds.length
      }));
  }

  /**
   * 获取标签列表
   * @returns {Array} 标签列表
   */
  getTags() {
    return Array.from(this.marketData.tags.entries())
      .map(([tag, skillIds]) => ({
        tag: tag,
        skillCount: skillIds.length
      }))
      .sort((a, b) => b.skillCount - a.skillCount);
  }

  /**
   * 获取热门技能
   * @param {number} limit - 限制数量
   * @returns {Array} 热门技能列表
   */
  getPopularSkills(limit = 10) {
    const skills = Array.from(this.marketData.skills.values())
      .sort((a, b) => b.downloadCount - a.downloadCount);
    
    return skills.slice(0, limit);
  }

  /**
   * 获取高评级技能
   * @param {number} limit - 限制数量
   * @returns {Array} 高评级技能列表
   */
  getTopRatedSkills(limit = 10) {
    const skills = Array.from(this.marketData.skills.values())
      .filter(skill => skill.rating > 0)
      .sort((a, b) => b.rating - a.rating);
    
    return skills.slice(0, limit);
  }

  /**
   * 获取最新技能
   * @param {number} limit - 限制数量
   * @returns {Array} 最新技能列表
   */
  getLatestSkills(limit = 10) {
    const skills = Array.from(this.marketData.skills.values())
      .sort((a, b) => b.createdAt - a.createdAt);
    
    return skills.slice(0, limit);
  }

  /**
   * 导出技能
   * @param {string} marketSkillId - 市场技能ID
   * @param {string} filePath - 导出文件路径
   * @returns {boolean} 是否导出成功
   */
  exportSkill(marketSkillId, filePath) {
    const marketSkill = this.marketData.skills.get(marketSkillId);
    if (!marketSkill) {
      console.error(`市场技能 ${marketSkillId} 不存在`);
      return false;
    }
    
    try {
      const skillDir = path.join(this.marketDir, 'skills', marketSkillId);
      const skillFilePath = path.join(skillDir, 'SKILL.md');
      
      if (!fs.existsSync(skillFilePath)) {
        console.error(`技能文件不存在`);
        return false;
      }
      
      const content = fs.readFileSync(skillFilePath, 'utf-8');
      const exportData = {
        skill: marketSkill,
        content: content,
        exportedAt: Date.now()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf-8');
      console.log(`技能 ${marketSkill.name} 导出成功: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`导出技能失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 导入技能
   * @param {string} filePath - 导入文件路径
   * @param {string} userId - 用户ID
   * @returns {string} 市场技能ID
   */
  importSkill(filePath, userId) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const importData = JSON.parse(content);
      
      const skillName = importData.skill.name;
      const skillContent = importData.content;
      
      // 创建技能目录
      const skillDir = path.join(this.skillsDir, skillName);
      fs.mkdirSync(skillDir, { recursive: true });
      
      // 写入技能文件
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent, 'utf-8');
      
      // 发布技能到市场
      const marketSkillId = this.publishSkill(skillName, userId, importData.skill);
      
      console.log(`技能 ${skillName} 导入成功`);
      return marketSkillId;
    } catch (error) {
      console.error(`导入技能失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 删除市场技能
   * @param {string} marketSkillId - 市场技能ID
   * @param {string} userId - 用户ID（必须是发布者）
   * @returns {boolean} 是否删除成功
   */
  deleteMarketSkill(marketSkillId, userId) {
    const marketSkill = this.marketData.skills.get(marketSkillId);
    if (!marketSkill) {
      console.error(`市场技能 ${marketSkillId} 不存在`);
      return false;
    }
    
    // 检查是否是发布者
    if (marketSkill.publisher !== userId) {
      console.error(`只有发布者可以删除技能`);
      return false;
    }
    
    try {
      // 从分类中移除
      if (this.marketData.categories.has(marketSkill.category)) {
        const categorySkills = this.marketData.categories.get(marketSkill.category);
        const index = categorySkills.indexOf(marketSkillId);
        if (index > -1) {
          categorySkills.splice(index, 1);
        }
      }
      
      // 从标签中移除
      for (const tag of marketSkill.tags) {
        if (this.marketData.tags.has(tag)) {
          const tagSkills = this.marketData.tags.get(tag);
          const index = tagSkills.indexOf(marketSkillId);
          if (index > -1) {
            tagSkills.splice(index, 1);
          }
        }
      }
      
      // 从用户发布列表中移除
      if (this.marketData.users.has(userId)) {
        const user = this.marketData.users.get(userId);
        const index = user.publishedSkills.indexOf(marketSkillId);
        if (index > -1) {
          user.publishedSkills.splice(index, 1);
        }
      }
      
      // 从用户下载列表中移除
      for (const [userId, user] of this.marketData.users) {
        const index = user.downloadedSkills.indexOf(marketSkillId);
        if (index > -1) {
          user.downloadedSkills.splice(index, 1);
        }
      }
      
      // 从用户评级中移除
      for (const [userId, user] of this.marketData.users) {
        user.ratings = user.ratings.filter(rating => rating.skillId !== marketSkillId);
      }
      
      // 删除技能文件
      const skillDir = path.join(this.marketDir, 'skills', marketSkillId);
      if (fs.existsSync(skillDir)) {
        fs.rmSync(skillDir, { recursive: true, force: true });
      }
      
      // 从市场中移除
      this.marketData.skills.delete(marketSkillId);
      
      // 保存市场数据
      this.saveMarketData();
      
      console.log(`技能 ${marketSkill.name} 从市场中删除成功`);
      return true;
    } catch (error) {
      console.error(`删除市场技能失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 生成市场报告
   * @returns {Object} 市场报告
   */
  generateMarketReport() {
    const report = {
      totalSkills: this.marketData.skills.size,
      totalCategories: this.marketData.categories.size,
      totalTags: this.marketData.tags.size,
      totalUsers: this.marketData.users.size,
      totalDownloads: 0,
      averageRating: 0,
      popularSkills: this.getPopularSkills(10),
      topRatedSkills: this.getTopRatedSkills(10),
      latestSkills: this.getLatestSkills(10),
      categoryDistribution: [],
      timestamp: Date.now()
    };
    
    let totalRating = 0;
    let ratedSkills = 0;
    
    for (const [skillId, skill] of this.marketData.skills) {
      report.totalDownloads += skill.downloadCount;
      if (skill.rating > 0) {
        totalRating += skill.rating;
        ratedSkills++;
      }
    }
    
    report.averageRating = ratedSkills > 0 ? totalRating / ratedSkills : 0;
    
    // 计算分类分布
    for (const [category, skillIds] of this.marketData.categories) {
      report.categoryDistribution.push({
        category: category,
        skillCount: skillIds.length,
        percentage: this.marketData.skills.size > 0 ? (skillIds.length / this.marketData.skills.size) * 100 : 0
      });
    }
    
    return report;
  }

  /**
   * 清理市场数据
   * @param {number} days - 保留天数
   */
  cleanupMarketData(days = 365) {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    // 清理过期技能
    const skillsToDelete = [];
    for (const [skillId, skill] of this.marketData.skills) {
      if (skill.createdAt < cutoffTime && skill.downloadCount === 0) {
        skillsToDelete.push(skillId);
      }
    }
    
    for (const skillId of skillsToDelete) {
      const skill = this.marketData.skills.get(skillId);
      if (skill) {
        this.deleteMarketSkill(skillId, skill.publisher);
        cleanedCount++;
      }
    }
    
    console.log(`清理了 ${cleanedCount} 个过期技能`);
  }
}

// 导出模块
module.exports = {
  SkillMarket
};
