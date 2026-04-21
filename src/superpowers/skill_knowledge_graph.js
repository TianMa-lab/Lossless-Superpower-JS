/**
 * 技能知识图谱模块
 * 负责技能知识图谱的构建和管理
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SkillKnowledgeGraph {
  /**
   * 技能知识图谱
   * @param {string} storageDir - 存储目录
   */
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.graphData = {
      nodes: new Map(),
      edges: new Map(),
      usageStats: new Map(),
      recommendations: new Map()
    };
    this.loadGraph();
  }

  /**
   * 加载图谱数据
   */
  loadGraph() {
    const graphFilePath = path.join(this.storageDir, 'skill_knowledge_graph.json');
    
    try {
      if (fs.existsSync(graphFilePath)) {
        const content = fs.readFileSync(graphFilePath, 'utf-8');
        const data = JSON.parse(content);
        
        // 加载节点
        if (data.nodes) {
          this.graphData.nodes = new Map(Object.entries(data.nodes));
        }
        
        // 加载边
        if (data.edges) {
          this.graphData.edges = new Map(Object.entries(data.edges));
        }
        
        // 加载使用统计
        if (data.usageStats) {
          this.graphData.usageStats = new Map(Object.entries(data.usageStats));
        }
        
        // 加载推荐
        if (data.recommendations) {
          this.graphData.recommendations = new Map(Object.entries(data.recommendations));
        }
        
        console.log('技能知识图谱加载成功');
      }
    } catch (error) {
      console.error(`加载技能知识图谱失败: ${error.message}`);
    }
  }

  /**
   * 保存图谱数据
   */
  saveGraph() {
    const graphFilePath = path.join(this.storageDir, 'skill_knowledge_graph.json');
    
    try {
      const data = {
        nodes: Object.fromEntries(this.graphData.nodes),
        edges: Object.fromEntries(this.graphData.edges),
        usageStats: Object.fromEntries(this.graphData.usageStats),
        recommendations: Object.fromEntries(this.graphData.recommendations)
      };
      
      fs.mkdirSync(this.storageDir, { recursive: true });
      fs.writeFileSync(graphFilePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('技能知识图谱保存成功');
    } catch (error) {
      console.error(`保存技能知识图谱失败: ${error.message}`);
    }
  }

  /**
   * 添加技能节点
   * @param {string} skillName - 技能名称
   * @param {Object} skillData - 技能数据
   */
  addSkillNode(skillName, skillData) {
    const node = {
      id: skillName,
      type: 'skill',
      data: skillData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.graphData.nodes.set(skillName, node);
    this.saveGraph();
  }

  /**
   * 获取技能节点
   * @param {string} skillName - 技能名称
   * @returns {Object} 技能节点
   */
  getSkill(skillName) {
    return this.graphData.nodes.get(skillName);
  }

  /**
   * 添加技能关联
   * @param {string} sourceSkill - 源技能
   * @param {string} targetSkill - 目标技能
   * @param {string} relationship - 关系类型
   * @param {number} strength - 关系强度 (0-1)
   */
  addSkillRelationship(sourceSkill, targetSkill, relationship, strength = 0.5) {
    const edgeId = `${sourceSkill}_${targetSkill}_${relationship}`;
    const edge = {
      id: edgeId,
      source: sourceSkill,
      target: targetSkill,
      relationship: relationship,
      strength: strength,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.graphData.edges.set(edgeId, edge);
    this.saveGraph();
  }

  /**
   * 记录技能使用
   * @param {string} skillName - 技能名称
   * @param {string} userId - 用户ID
   * @param {number} duration - 执行时间
   * @param {boolean} success - 是否成功
   */
  recordSkillUsage(skillName, userId, duration, success = true) {
    if (!this.graphData.usageStats.has(skillName)) {
      this.graphData.usageStats.set(skillName, {
        totalUses: 0,
        successfulUses: 0,
        totalDuration: 0,
        users: new Map(),
        lastUsed: 0
      });
    }
    
    const usage = this.graphData.usageStats.get(skillName);
    usage.totalUses++;
    if (success) {
      usage.successfulUses++;
    }
    usage.totalDuration += duration;
    usage.lastUsed = Date.now();
    
    if (!usage.users.has(userId)) {
      usage.users.set(userId, 0);
    }
    usage.users.set(userId, usage.users.get(userId) + 1);
    
    this.saveGraph();
  }

  /**
   * 获取技能使用统计
   * @param {string} skillName - 技能名称
   * @returns {Object} 使用统计
   */
  getSkillUsageStats(skillName) {
    return this.graphData.usageStats.get(skillName) || {
      totalUses: 0,
      successfulUses: 0,
      totalDuration: 0,
      users: new Map(),
      lastUsed: 0
    };
  }

  /**
   * 构建技能关联
   * @param {Array} skills - 技能列表
   */
  buildSkillRelationships(skills) {
    console.log('开始构建技能关联...');
    
    for (let i = 0; i < skills.length; i++) {
      const skill1 = skills[i];
      
      for (let j = i + 1; j < skills.length; j++) {
        const skill2 = skills[j];
        const similarity = this.calculateSkillSimilarity(skill1, skill2);
        
        if (similarity > 0.3) {
          this.addSkillRelationship(skill1.name, skill2.name, 'similar', similarity);
        }
        
        // 检查技能之间的其他关系
        const relationship = this.detectSkillRelationship(skill1, skill2);
        if (relationship) {
          this.addSkillRelationship(skill1.name, skill2.name, relationship, 0.7);
        }
      }
    }
    
    console.log('技能关联构建完成');
  }

  /**
   * 计算技能相似度
   * @param {Object} skill1 - 技能1
   * @param {Object} skill2 - 技能2
   * @returns {number} 相似度 (0-1)
   */
  calculateSkillSimilarity(skill1, skill2) {
    let similarity = 0;
    
    // 标签相似度
    if (skill1.tags && skill2.tags) {
      const commonTags = skill1.tags.filter(tag => skill2.tags.includes(tag));
      const totalTags = new Set([...skill1.tags, ...skill2.tags]).size;
      if (totalTags > 0) {
        similarity += (commonTags.length / totalTags) * 0.4;
      }
    }
    
    // 分类相似度
    if (skill1.category && skill2.category && skill1.category === skill2.category) {
      similarity += 0.3;
    }
    
    // 描述相似度
    if (skill1.description && skill2.description) {
      const descSimilarity = this.calculateTextSimilarity(skill1.description, skill2.description);
      similarity += descSimilarity * 0.3;
    }
    
    return Math.min(similarity, 1);
  }

  /**
   * 计算文本相似度
   * @param {string} text1 - 文本1
   * @param {string} text2 - 文本2
   * @returns {number} 相似度 (0-1)
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  /**
   * 检测技能关系
   * @param {Object} skill1 - 技能1
   * @param {Object} skill2 - 技能2
   * @returns {string|null} 关系类型
   */
  detectSkillRelationship(skill1, skill2) {
    // 检查技能之间的关系
    if (skill1.description && skill2.description) {
      if (skill1.description.includes(skill2.name) || skill2.description.includes(skill1.name)) {
        return 'related';
      }
    }
    
    return null;
  }

  /**
   * 获取技能推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @param {string} userId - 用户ID（可选，用于个性化推荐）
   * @param {string} algorithm - 推荐算法类型 (similarity, collaborative, content, hybrid)
   * @returns {Array} 推荐技能列表
   */
  getSkillRecommendations(skillName, limit = 5, userId = null, algorithm = 'hybrid') {
    let recommendations = [];
    
    switch (algorithm) {
      case 'similarity':
        // 基于相似度推荐
        recommendations = this.getSimilarityBasedRecommendations(skillName, limit);
        break;
      case 'collaborative':
        // 基于协同过滤推荐
        recommendations = this.getCollaborativeFilteringRecommendations(skillName, limit, userId);
        break;
      case 'content':
        // 基于内容推荐
        recommendations = this.getContentBasedRecommendations(skillName, limit);
        break;
      case 'hybrid':
      default:
        // 混合推荐
        recommendations = this.getHybridRecommendations(skillName, limit, userId);
        break;
    }
    
    // 排序并去重
    const uniqueRecs = this.deduplicateRecommendations(recommendations);
    uniqueRecs.sort((a, b) => b.score - a.score);
    
    return uniqueRecs.slice(0, limit);
  }

  /**
   * 获取工具集感知的上下文推荐（融合Hermes条件激活）
   * @param {string} task - 当前任务描述
   * @param {Object} availableTools - 可用工具信息
   * @param {Object} context - 上下文信息
   * @returns {Array} 推荐的技能列表
   */
  getContextAwareRecommendations(task, availableTools, context = {}) {
    const recommendations = [];
    const toolsetMatchScores = new Map();

    // 1. 收集所有技能并计算工具集匹配度
    for (const [skillName, skill] of this.graphData.nodes) {
      const matchResult = this._calculateToolsetMatch(skill, availableTools);
      if (matchResult.isMatch) {
        toolsetMatchScores.set(skillName, {
          ...matchResult,
          skill
        });
      }
    }

    // 2. 基于任务匹配度
    const taskLower = task.toLowerCase();
    for (const [skillName, matchData] of toolsetMatchScores) {
      let taskScore = 0;
      const skill = matchData.skill;

      // 检查技能名称/描述与任务的匹配度
      if (skill.data) {
        const nameMatch = skill.data.name?.toLowerCase().includes(taskLower);
        const descMatch = skill.data.description?.toLowerCase().includes(taskLower);
        const tagMatch = skill.data.tags?.some(tag => taskLower.includes(tag.toLowerCase()));

        if (nameMatch) taskScore += 0.5;
        if (descMatch) taskScore += 0.3;
        if (tagMatch) taskScore += 0.2;
      }

      // 综合得分
      const finalScore = (
        matchData.toolsetScore * 0.4 +
        taskScore * 0.3 +
        (skill.data?.usageCount || 0) * 0.001 * 0.2 +
        (skill.data?.rating || 3) / 5 * 0.1
      );

      recommendations.push({
        skill: skillName,
        score: finalScore,
        matchDetails: matchData,
        isExactMatch: taskScore > 0.5,
        fallbackAvailable: matchData.fallbackToolset !== null
      });
    }

    // 3. 排序并返回
    recommendations.sort((a, b) => b.score - a.score);

    // 4. 添加fallback技能（当主技能不可用时）
    const fallbackSkills = this._getFallbackSkills(recommendations, availableTools);
    recommendations.push(...fallbackSkills);

    return recommendations.slice(0, 10);
  }

  /**
   * 计算技能与工具集的匹配度
   * @param {Object} skill - 技能对象
   * @param {Object} availableTools - 可用工具信息
   * @returns {Object} 匹配结果
   * @private
   */
  _calculateToolsetMatch(skill, availableTools) {
    const conditions = skill.data?.activationConditions ||
                      skill.data?.metadata?.hermes || {};

    const availableToolsets = availableTools.toolsets || [];
    const availableToolsList = availableTools.tools || [];

    let score = 0;
    let isMatch = true;
    const missingToolsets = [];
    const missingTools = [];
    let fallbackToolset = null;

    // 检查必需的toolsets
    if (conditions.requires_toolsets && conditions.requires_toolsets.length > 0) {
      const hasAllToolsets = conditions.requires_toolsets.every(
        ts => availableToolsets.includes(ts)
      );

      if (hasAllToolsets) {
        score += 0.5;
      } else {
        isMatch = false;
        missingToolsets.push(...conditions.requires_toolsets.filter(
          ts => !availableToolsets.includes(ts)
        ));
      }
    } else {
      score += 0.3; // 没有toolset要求，得分较低
    }

    // 检查必需的tools
    if (conditions.requires_tools && conditions.requires_tools.length > 0) {
      const hasAllTools = conditions.requires_tools.every(
        tool => availableToolsList.includes(tool)
      );

      if (hasAllTools) {
        score += 0.3;
      } else {
        isMatch = false;
        missingTools.push(...conditions.requires_tools.filter(
          tool => !availableToolsList.includes(tool)
        ));
      }
    } else {
      score += 0.2;
    }

    // 检查fallback_for_toolsets
    if (conditions.fallback_for_toolsets && conditions.fallback_for_toolsets.length > 0) {
      const hasFallback = conditions.fallback_for_toolsets.some(
        ts => availableToolsets.includes(ts)
      );

      if (hasFallback) {
        fallbackToolset = conditions.fallback_for_toolsets.find(
          ts => availableToolsets.includes(ts)
        );
        score += 0.1;
      }
    }

    // 平台检查
    const skillPlatforms = skill.data?.platforms || [];
    const currentPlatform = availableTools.platform || 'all';
    if (skillPlatforms.length > 0) {
      if (skillPlatforms.includes(currentPlatform) || skillPlatforms.includes('all')) {
        score += 0.1;
      } else {
        isMatch = false;
      }
    }

    return {
      isMatch,
      score: Math.min(score, 1),
      missingToolsets,
      missingTools,
      fallbackToolset,
      conditions
    };
  }

  /**
   * 获取fallback技能
   * @param {Array} recommendations - 当前推荐
   * @param {Object} availableTools - 可用工具
   * @returns {Array} fallback技能
   * @private
   */
  _getFallbackSkills(recommendations, availableTools) {
    const fallbacks = [];
    const primarySkills = new Set(recommendations.map(r => r.skill));

    for (const [skillName, skill] of this.graphData.nodes) {
      if (primarySkills.has(skillName)) continue;

      const conditions = skill.data?.activationConditions ||
                        skill.data?.metadata?.hermes || {};

      if (!conditions.fallback_for_toolsets) continue;

      // 检查是否有可用的fallback toolset
      const availableFallback = conditions.fallback_for_toolsets.some(
        ts => (availableTools.toolsets || []).includes(ts)
      );

      if (availableFallback) {
        fallbacks.push({
          skill: skillName,
          score: 0.3,
          matchDetails: { isMatch: true, isFallback: true },
          isExactMatch: false,
          fallbackAvailable: true
        });
      }
    }

    return fallbacks;
  }

  /**
   * 添加工具集关系边
   * @param {string} skillName - 技能名称
   * @param {string} toolsetName - 工具集名称
   * @param {number} weight - 权重
   */
  addToolsetRelationship(skillName, toolsetName, weight = 1.0) {
    const edgeId = `toolset_${skillName}_${toolsetName}`;
    const edge = {
      id: edgeId,
      source: skillName,
      target: toolsetName,
      type: 'requires_toolset',
      weight: weight,
      createdAt: Date.now()
    };

    this.graphData.edges.set(edgeId, edge);
    this.saveGraph();
  }

  /**
   * 获取技能的工具集依赖
   * @param {string} skillName - 技能名称
   * @returns {Array} 工具集列表
   */
  getSkillToolsets(skillName) {
    const toolsets = [];
    for (const [edgeId, edge] of this.graphData.edges) {
      if (edge.source === skillName && edge.type === 'requires_toolset') {
        toolsets.push({
          toolset: edge.target,
          weight: edge.weight
        });
      }
    }
    return toolsets;
  }

  /**
   * 基于相似度推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @returns {Array} 推荐技能列表
   */
  getSimilarityBasedRecommendations(skillName, limit = 5) {
    const recommendations = [];
    
    for (const [edgeId, edge] of this.graphData.edges) {
      if (edge.source === skillName || edge.target === skillName) {
        const targetSkill = edge.source === skillName ? edge.target : edge.source;
        const skill = this.graphData.nodes.get(targetSkill);
        if (skill) {
          recommendations.push({
            skill: targetSkill,
            score: edge.strength,
            relationship: edge.relationship,
            algorithm: 'similarity'
          });
        }
      }
    }
    
    return recommendations;
  }

  /**
   * 基于协同过滤推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @param {string} userId - 用户ID
   * @returns {Array} 推荐技能列表
   */
  getCollaborativeFilteringRecommendations(skillName, limit = 5, userId = null) {
    const recommendations = [];
    
    if (userId) {
      // 基于用户的协同过滤
      const similarUsers = this.findSimilarUsers(userId);
      
      for (const user of similarUsers) {
        const userSkills = this.getUserSkills(user);
        for (const userSkill of userSkills) {
          if (userSkill !== skillName && !this.getUserSkills(userId).includes(userSkill)) {
            const usageStats = this.getSkillUsageStats(userSkill);
            const score = (usageStats.totalUses / 100) * (1 / similarUsers.indexOf(user) + 1);
            recommendations.push({
              skill: userSkill,
              score: score,
              relationship: 'user_similarity',
              algorithm: 'collaborative'
            });
          }
        }
      }
    } else {
      // 基于物品的协同过滤
      const usageBasedRecs = this.getUsageBasedRecommendations(skillName, limit);
      recommendations.push(...usageBasedRecs);
    }
    
    return recommendations;
  }

  /**
   * 基于内容推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @returns {Array} 推荐技能列表
   */
  getContentBasedRecommendations(skillName, limit = 5) {
    const recommendations = [];
    const targetSkill = this.graphData.nodes.get(skillName);
    
    if (!targetSkill) {
      return recommendations;
    }
    
    for (const [otherSkillName, otherSkill] of this.graphData.nodes) {
      if (otherSkillName !== skillName) {
        const similarity = this.calculateContentSimilarity(targetSkill, otherSkill);
        if (similarity > 0.3) {
          recommendations.push({
            skill: otherSkillName,
            score: similarity,
            relationship: 'content_similarity',
            algorithm: 'content'
          });
        }
      }
    }
    
    return recommendations;
  }

  /**
   * 混合推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @param {string} userId - 用户ID
   * @returns {Array} 推荐技能列表
   */
  getHybridRecommendations(skillName, limit = 5, userId = null) {
    const recommendations = [];
    
    // 基于相似度推荐
    const similarityRecs = this.getSimilarityBasedRecommendations(skillName, limit * 2);
    recommendations.push(...similarityRecs);
    
    // 基于协同过滤推荐
    const collaborativeRecs = this.getCollaborativeFilteringRecommendations(skillName, limit * 2, userId);
    recommendations.push(...collaborativeRecs);
    
    // 基于内容推荐
    const contentRecs = this.getContentBasedRecommendations(skillName, limit * 2);
    recommendations.push(...contentRecs);
    
    // 基于流行度推荐
    const popularRecs = this.getPopularSkills(limit * 2);
    recommendations.push(...popularRecs);
    
    return recommendations;
  }

  /**
   * 计算内容相似度
   * @param {Object} skill1 - 技能1
   * @param {Object} skill2 - 技能2
   * @returns {number} 相似度 (0-1)
   */
  calculateContentSimilarity(skill1, skill2) {
    let similarity = 0;
    
    // 标签相似度
    if (skill1.data && skill1.data.tags && skill2.data && skill2.data.tags) {
      const commonTags = skill1.data.tags.filter(tag => skill2.data.tags.includes(tag));
      const totalTags = new Set([...skill1.data.tags, ...skill2.data.tags]).size;
      if (totalTags > 0) {
        similarity += (commonTags.length / totalTags) * 0.3;
      }
    }
    
    // 分类相似度
    if (skill1.data && skill1.data.category && skill2.data && skill2.data.category && 
        skill1.data.category === skill2.data.category) {
      similarity += 0.2;
    }
    
    // 描述相似度
    if (skill1.data && skill1.data.description && skill2.data && skill2.data.description) {
      const descSimilarity = this.calculateTextSimilarity(skill1.data.description, skill2.data.description);
      similarity += descSimilarity * 0.3;
    }
    
    // 执行类型相似度
    if (skill1.data && skill1.data.execution && skill1.data.execution.type && 
        skill2.data && skill2.data.execution && skill2.data.execution.type && 
        skill1.data.execution.type === skill2.data.execution.type) {
      similarity += 0.2;
    }
    
    return Math.min(similarity, 1);
  }

  /**
   * 查找相似用户
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @returns {Array} 相似用户列表
   */
  findSimilarUsers(userId, limit = 5) {
    const similarUsers = [];
    const userSkills = this.getUserSkills(userId);
    
    for (const [skillName, usage] of this.graphData.usageStats) {
      for (const [otherUserId, count] of usage.users) {
        if (otherUserId !== userId) {
          const otherUserSkills = this.getUserSkills(otherUserId);
          const similarity = this.calculateUserSimilarity(userSkills, otherUserSkills);
          
          if (similarity > 0.3) {
            similarUsers.push({
              userId: otherUserId,
              similarity: similarity
            });
          }
        }
      }
    }
    
    similarUsers.sort((a, b) => b.similarity - a.similarity);
    return similarUsers.slice(0, limit).map(user => user.userId);
  }

  /**
   * 计算用户相似度
   * @param {Array} skills1 - 用户1的技能列表
   * @param {Array} skills2 - 用户2的技能列表
   * @returns {number} 相似度 (0-1)
   */
  calculateUserSimilarity(skills1, skills2) {
    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    const totalSkills = new Set([...skills1, ...skills2]).size;
    return totalSkills > 0 ? commonSkills.length / totalSkills : 0;
  }

  /**
   * 获取流行技能
   * @param {number} limit - 限制数量
   * @returns {Array} 流行技能列表
   */
  getPopularSkills(limit = 10) {
    const popularSkills = [];
    
    for (const [skillName, usage] of this.graphData.usageStats) {
      popularSkills.push({
        skill: skillName,
        score: usage.totalUses / 100,
        relationship: 'popularity',
        algorithm: 'popularity'
      });
    }
    
    popularSkills.sort((a, b) => b.score - a.score);
    return popularSkills.slice(0, limit);
  }

  /**
   * 基于使用统计获取推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @returns {Array} 推荐技能列表
   */
  getUsageBasedRecommendations(skillName, limit = 5) {
    const recommendations = [];
    const skillUsers = this.getSkillUsers(skillName);
    
    // 查找使用过该技能的用户也使用过的其他技能
    for (const userId of skillUsers) {
      const userSkills = this.getUserSkills(userId);
      for (const userSkill of userSkills) {
        if (userSkill !== skillName) {
          const usageStats = this.getSkillUsageStats(userSkill);
          const score = usageStats.totalUses / 100;
          recommendations.push({
            skill: userSkill,
            score: score,
            relationship: 'used_together'
          });
        }
      }
    }
    
    return recommendations;
  }

  /**
   * 获取使用技能的用户
   * @param {string} skillName - 技能名称
   * @returns {Array} 用户ID列表
   */
  getSkillUsers(skillName) {
    const usage = this.graphData.usageStats.get(skillName);
    return usage ? Array.from(usage.users.keys()) : [];
  }

  /**
   * 获取用户使用的技能
   * @param {string} userId - 用户ID
   * @returns {Array} 技能名称列表
   */
  getUserSkills(userId) {
    const userSkills = [];
    
    for (const [skillName, usage] of this.graphData.usageStats) {
      if (usage.users.has(userId)) {
        userSkills.push(skillName);
      }
    }
    
    return userSkills;
  }

  /**
   * 基于协同过滤获取推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @param {string} userId - 用户ID
   * @returns {Array} 推荐技能列表
   */
  getCollaborativeFilteringRecommendations(skillName, limit = 5, userId = null) {
    const recommendations = [];
    
    if (userId) {
      // 基于用户的协同过滤
      const similarUsers = this.findSimilarUsers(userId, 10);
      
      for (const user of similarUsers) {
        const userSkills = this.getUserSkills(user.userId);
        for (const userSkill of userSkills) {
          if (userSkill !== skillName && !recommendations.some(r => r.skill === userSkill)) {
            const usageStats = this.getSkillUsageStats(userSkill);
            const score = (usageStats.totalUses / 100) * user.similarity;
            recommendations.push({
              skill: userSkill,
              score: score,
              relationship: 'user_similarity',
              algorithm: 'collaborative'
            });
          }
        }
      }
    } else {
      // 基于物品的协同过滤
      const skillUsers = this.getSkillUsers(skillName);
      const relatedSkills = new Map();
      
      for (const userId of skillUsers) {
        const userSkills = this.getUserSkills(userId);
        for (const userSkill of userSkills) {
          if (userSkill !== skillName) {
            relatedSkills.set(userSkill, (relatedSkills.get(userSkill) || 0) + 1);
          }
        }
      }
      
      for (const [skill, count] of relatedSkills.entries()) {
        recommendations.push({
          skill: skill,
          score: count / skillUsers.length,
          relationship: 'item_similarity',
          algorithm: 'collaborative'
        });
      }
    }
    
    return recommendations;
  }

  /**
   * 基于内容获取推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @returns {Array} 推荐技能列表
   */
  getContentBasedRecommendations(skillName, limit = 5) {
    const recommendations = [];
    const targetSkill = this.graphData.nodes.get(skillName);
    
    if (!targetSkill) {
      return recommendations;
    }
    
    for (const [otherSkillName, otherSkill] of this.graphData.nodes) {
      if (otherSkillName !== skillName) {
        const similarity = this.calculateContentSimilarity(targetSkill, otherSkill);
        if (similarity > 0.3) {
          recommendations.push({
            skill: otherSkillName,
            score: similarity,
            relationship: 'content_similarity',
            algorithm: 'content'
          });
        }
      }
    }
    
    return recommendations;
  }

  /**
   * 基于混合算法获取推荐
   * @param {string} skillName - 技能名称
   * @param {number} limit - 推荐数量
   * @param {string} userId - 用户ID
   * @returns {Array} 推荐技能列表
   */
  getHybridRecommendations(skillName, limit = 5, userId = null) {
    const recommendations = [];
    
    // 基于相似度推荐
    const similarityRecs = this.getSimilarityBasedRecommendations(skillName, limit * 2);
    recommendations.push(...similarityRecs);
    
    // 基于协同过滤推荐
    const collaborativeRecs = this.getCollaborativeFilteringRecommendations(skillName, limit * 2, userId);
    recommendations.push(...collaborativeRecs);
    
    // 基于内容推荐
    const contentRecs = this.getContentBasedRecommendations(skillName, limit * 2);
    recommendations.push(...contentRecs);
    
    // 基于使用统计推荐
    const usageRecs = this.getUsageBasedRecommendations(skillName, limit * 2);
    recommendations.push(...usageRecs);
    
    return recommendations;
  }

  /**
   * 计算内容相似度
   * @param {Object} skill1 - 技能1
   * @param {Object} skill2 - 技能2
   * @returns {number} 相似度 (0-1)
   */
  calculateContentSimilarity(skill1, skill2) {
    let similarity = 0;
    
    // 标签相似度
    if (skill1.data && skill1.data.tags && skill2.data && skill2.data.tags) {
      const commonTags = skill1.data.tags.filter(tag => skill2.data.tags.includes(tag));
      const totalTags = new Set([...skill1.data.tags, ...skill2.data.tags]).size;
      if (totalTags > 0) {
        similarity += (commonTags.length / totalTags) * 0.4;
      }
    }
    
    // 分类相似度
    if (skill1.data && skill1.data.category && skill2.data && skill2.data.category && 
        skill1.data.category === skill2.data.category) {
      similarity += 0.2;
    }
    
    // 描述相似度
    if (skill1.data && skill1.data.description && skill2.data && skill2.data.description) {
      const descSimilarity = this.calculateTextSimilarity(skill1.data.description, skill2.data.description);
      similarity += descSimilarity * 0.2;
    }
    
    // 执行类型相似度
    if (skill1.data && skill1.data.execution && skill1.data.execution.type && 
        skill2.data && skill2.data.execution && skill2.data.execution.type && 
        skill1.data.execution.type === skill2.data.execution.type) {
      similarity += 0.2;
    }
    
    return Math.min(similarity, 1);
  }

  /**
   * 计算文本相似度
   * @param {string} text1 - 文本1
   * @param {string} text2 - 文本2
   * @returns {number} 相似度 (0-1)
   */
  calculateTextSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * 查找相似用户
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量
   * @returns {Array} 相似用户列表
   */
  findSimilarUsers(userId, limit = 10) {
    const similarUsers = [];
    const userSkills = this.getUserSkills(userId);
    
    for (const [skillName, usage] of this.graphData.usageStats) {
      for (const [otherUserId, count] of usage.users) {
        if (otherUserId !== userId) {
          const otherUserSkills = this.getUserSkills(otherUserId);
          const similarity = this.calculateUserSimilarity(userSkills, otherUserSkills);
          
          if (similarity > 0.3) {
            similarUsers.push({
              userId: otherUserId,
              similarity: similarity
            });
          }
        }
      }
    }
    
    similarUsers.sort((a, b) => b.similarity - a.similarity);
    return similarUsers.slice(0, limit);
  }

  /**
   * 计算用户相似度
   * @param {Array} skills1 - 用户1的技能列表
   * @param {Array} skills2 - 用户2的技能列表
   * @returns {number} 相似度 (0-1)
   */
  calculateUserSimilarity(skills1, skills2) {
    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    const totalSkills = new Set([...skills1, ...skills2]).size;
    return totalSkills > 0 ? commonSkills.length / totalSkills : 0;
  }

  /**
   * 获取技能使用统计
   * @param {string} skillName - 技能名称
   * @returns {Object} 使用统计
   */
  getSkillUsageStats(skillName) {
    return this.graphData.usageStats.get(skillName) || {
      totalUses: 0,
      successfulUses: 0,
      totalDuration: 0,
      users: new Map(),
      averageResponseTime: 0,
      errorRate: 0
    };
  }

  /**
   * 去重推荐
   * @param {Array} recommendations - 推荐列表
   * @returns {Array} 去重后的推荐列表
   */
  deduplicateRecommendations(recommendations) {
    const uniqueMap = new Map();
    
    for (const rec of recommendations) {
      if (!uniqueMap.has(rec.skill) || rec.score > uniqueMap.get(rec.skill).score) {
        uniqueMap.set(rec.skill, rec);
      }
    }
    
    return Array.from(uniqueMap.values());
  }

  /**
   * 生成技能知识图谱报告
   * @returns {Object} 报告数据
   */
  generateReport() {
    const report = {
      totalSkills: this.graphData.nodes.size,
      totalRelationships: this.graphData.edges.size,
      usageStats: {
        totalUses: 0,
        averageSuccessRate: 0,
        mostUsedSkills: []
      },
      graphStats: {
        averageRelationshipsPerSkill: 0,
        mostConnectedSkills: []
      },
      timestamp: Date.now()
    };
    
    // 计算使用统计
    let totalUses = 0;
    let totalSuccessfulUses = 0;
    const skillUsage = [];
    
    for (const [skillName, usage] of this.graphData.usageStats) {
      totalUses += usage.totalUses;
      totalSuccessfulUses += usage.successfulUses;
      skillUsage.push({
        skill: skillName,
        uses: usage.totalUses,
        successRate: usage.totalUses > 0 ? usage.successfulUses / usage.totalUses : 0
      });
    }
    
    report.usageStats.totalUses = totalUses;
    report.usageStats.averageSuccessRate = totalUses > 0 ? totalSuccessfulUses / totalUses : 0;
    
    // 按使用次数排序
    skillUsage.sort((a, b) => b.uses - a.uses);
    report.usageStats.mostUsedSkills = skillUsage.slice(0, 10);
    
    // 计算图统计
    const skillConnections = new Map();
    for (const edge of this.graphData.edges.values()) {
      if (!skillConnections.has(edge.source)) {
        skillConnections.set(edge.source, 0);
      }
      if (!skillConnections.has(edge.target)) {
        skillConnections.set(edge.target, 0);
      }
      skillConnections.set(edge.source, skillConnections.get(edge.source) + 1);
      skillConnections.set(edge.target, skillConnections.get(edge.target) + 1);
    }
    
    report.graphStats.averageRelationshipsPerSkill = this.graphData.nodes.size > 0 ? 
      this.graphData.edges.size / this.graphData.nodes.size : 0;
    
    // 按连接数排序
    const connectionList = Array.from(skillConnections.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
    report.graphStats.mostConnectedSkills = connectionList.slice(0, 10);
    
    return report;
  }

  /**
   * 导出技能知识图谱
   * @param {string} filePath - 导出文件路径
   */
  exportGraph(filePath) {
    try {
      const data = {
        nodes: Object.fromEntries(this.graphData.nodes),
        edges: Object.fromEntries(this.graphData.edges),
        usageStats: Object.fromEntries(this.graphData.usageStats),
        report: this.generateReport(),
        exportedAt: Date.now()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`技能知识图谱导出成功: ${filePath}`);
    } catch (error) {
      console.error(`导出技能知识图谱失败: ${error.message}`);
    }
  }

  /**
   * 导入技能知识图谱
   * @param {string} filePath - 导入文件路径
   */
  importGraph(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (data.nodes) {
        this.graphData.nodes = new Map(Object.entries(data.nodes));
      }
      
      if (data.edges) {
        this.graphData.edges = new Map(Object.entries(data.edges));
      }
      
      if (data.usageStats) {
        this.graphData.usageStats = new Map(Object.entries(data.usageStats));
      }
      
      this.saveGraph();
      console.log(`技能知识图谱导入成功: ${filePath}`);
    } catch (error) {
      console.error(`导入技能知识图谱失败: ${error.message}`);
    }
  }

  /**
   * 清理过期数据
   * @param {number} days - 保留天数
   */
  cleanupOldData(days = 30) {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    // 清理过期的使用统计
    for (const [skillName, usage] of this.graphData.usageStats) {
      if (usage.lastUsed < cutoffTime) {
        this.graphData.usageStats.delete(skillName);
        cleanedCount++;
      }
    }
    
    // 清理没有使用统计的技能节点
    for (const [skillName, node] of this.graphData.nodes) {
      if (!this.graphData.usageStats.has(skillName) && node.updatedAt < cutoffTime) {
        this.graphData.nodes.delete(skillName);
        cleanedCount++;
      }
    }
    
    // 清理无效的边
    const edgesToDelete = [];
    for (const [edgeId, edge] of this.graphData.edges) {
      if (!this.graphData.nodes.has(edge.source) || !this.graphData.nodes.has(edge.target)) {
        edgesToDelete.push(edgeId);
      }
    }
    
    for (const edgeId of edgesToDelete) {
      this.graphData.edges.delete(edgeId);
      cleanedCount++;
    }
    
    if (cleanedCount > 0) {
      this.saveGraph();
      console.log(`清理了 ${cleanedCount} 个过期数据`);
    }
  }
}

// 导出模块
module.exports = {
  SkillKnowledgeGraph
};
