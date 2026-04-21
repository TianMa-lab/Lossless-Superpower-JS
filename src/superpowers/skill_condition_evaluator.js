/**
 * 技能条件激活评估器
 * 实现Hermes风格的条件激活机制
 */

class SkillConditionEvaluator {
  /**
   * 条件激活评估器
   * @param {Object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = {
      strictMode: config.strictMode || false,
      logEvaluation: config.logEvaluation || false,
      ...config
    };
    this.evaluationCache = new Map();
  }

  /**
   * 评估技能是否应该激活
   * @param {Object} skill - 技能对象
   * @param {Object} availableTools - 可用工具信息
   * @returns {Object} 评估结果
   */
  evaluateActivationConditions(skill, availableTools) {
    const cacheKey = `${skill.name}_${JSON.stringify(availableTools)}`;
    
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    const conditions = this._extractConditions(skill);
    if (!conditions || Object.keys(conditions).length === 0) {
      return { activated: true, reason: 'no_conditions', score: 1.0 };
    }

    const result = this._evaluateConditions(conditions, availableTools, skill);
    this.evaluationCache.set(cacheKey, result);
    
    if (this.config.logEvaluation) {
      this._logEvaluation(skill.name, conditions, availableTools, result);
    }

    return result;
  }

  /**
   * 获取所有应激活的技能
   * @param {Array} skills - 技能列表
   * @param {Object} availableTools - 可用工具信息
   * @returns {Array} 应激活的技能列表
   */
  getActivatedSkills(skills, availableTools) {
    const activated = [];
    const deactivated = [];

    for (const skill of skills) {
      const result = this.evaluateActivationConditions(skill, availableTools);
      if (result.activated) {
        activated.push({ skill, ...result });
      } else {
        deactivated.push({ skill, ...result });
      }
    }

    return { activated, deactivated };
  }

  /**
   * 获取技能激活优先级
   * @param {Array} skills - 技能列表
   * @param {Object} availableTools - 可用工具信息
   * @returns {Array} 按优先级排序的技能列表
   */
  getSkillPriorities(skills, availableTools) {
    const prioritized = skills.map(skill => {
      const result = this.evaluateActivationConditions(skill, availableTools);
      return {
        skill,
        priority: this._calculatePriority(skill, availableTools, result),
        ...result
      };
    });

    prioritized.sort((a, b) => b.priority - a.priority);
    return prioritized;
  }

  /**
   * 检查技能是否支持当前平台
   * @param {Object} skill - 技能对象
   * @param {string} platform - 当前平台
   * @returns {boolean} 是否支持
   */
  checkPlatformSupport(skill, platform) {
    const platforms = skill.platforms || skill.metadata?.platforms || [];
    
    if (platforms.length === 0) {
      return true; // 没有平台限制，默认支持
    }

    const normalizedPlatform = platform.toLowerCase();
    return platforms.some(p => p.toLowerCase() === normalizedPlatform ||
                             p.toLowerCase() === 'all');
  }

  /**
   * 获取技能的fallback技能
   * @param {Object} skill - 技能对象
   * @param {Array} allSkills - 所有技能
   * @param {Object} availableTools - 可用工具信息
   * @returns {Array} fallback技能列表
   */
  getFallbackSkills(skill, allSkills, availableTools) {
    const conditions = this._extractConditions(skill);
    const fallbackSkills = [];

    if (!conditions?.fallback_for_toolsets) {
      return fallbackSkills;
    }

    for (const fallbackToolset of conditions.fallback_for_toolsets) {
      const matchingSkills = allSkills.filter(s => {
        if (s.name === skill.name) return false;
        const sConditions = this._extractConditions(s);
        return sConditions?.requires_toolsets?.includes(fallbackToolset);
      });

      for (const fallbackSkill of matchingSkills) {
        const result = this.evaluateActivationConditions(fallbackSkill, availableTools);
        if (result.activated) {
          fallbackSkills.push({
            original: skill.name,
            fallback: fallbackSkill,
            forToolset: fallbackToolset
          });
        }
      }
    }

    return fallbackSkills;
  }

  /**
   * 清除评估缓存
   */
  clearCache() {
    this.evaluationCache.clear();
  }

  /**
   * 提取技能的条件配置
   * @param {Object} skill - 技能对象
   * @returns {Object} 条件配置
   * @private
   */
  _extractConditions(skill) {
    return skill.activationConditions ||
           skill.metadata?.hermes ||
           skill.prerequisites?.activation_conditions || {};
  }

  /**
   * 评估条件
   * @param {Object} conditions - 条件配置
   * @param {Object} availableTools - 可用工具信息
   * @param {Object} skill - 技能对象
   * @returns {Object} 评估结果
   * @private
   */
  _evaluateConditions(conditions, availableTools, skill) {
    const reasons = [];
    let score = 0.5; // 降低初始分数，更严格的评估

    // 检查平台支持
    if (!this.checkPlatformSupport(skill, availableTools.platform || 'all')) {
      return { activated: false, reason: 'platform_not_supported', score: 0 };
    }

    // 检查必需的toolsets - 这是硬性要求
    if (conditions.requires_toolsets && conditions.requires_toolsets.length > 0) {
      const hasRequiredToolsets = conditions.requires_toolsets.every(
        ts => availableTools.toolsets?.includes(ts)
      );

      if (hasRequiredToolsets) {
        score += 0.4;
      } else {
        const missingToolsets = conditions.requires_toolsets.filter(
          ts => !availableTools.toolsets?.includes(ts)
        );
        reasons.push(`missing_toolsets: ${missingToolsets.join(', ')}`);
        // 必需的toolset不满足时，activated为false
        return {
          activated: false,
          score: 0,
          reasons: [`missing_toolsets: ${missingToolsets.join(', ')}`],
          conditions
        };
      }
    } else {
      score += 0.1; // 没有toolset要求，得分较低
    }

    // 检查必需的tools - 这也是硬性要求
    if (conditions.requires_tools && conditions.requires_tools.length > 0) {
      const hasRequiredTools = conditions.requires_tools.every(
        tool => availableTools.tools?.includes(tool)
      );

      if (!hasRequiredTools) {
        const missingTools = conditions.requires_tools.filter(
          tool => !availableTools.tools?.includes(tool)
        );
        reasons.push(`missing_tools: ${missingTools.join(', ')}`);
        // 必需的工具不满足时，activated为false
        return {
          activated: false,
          score: 0,
          reasons: [`missing_tools: ${missingTools.join(', ')}`],
          conditions
        };
      }
      score += 0.3;
    } else {
      score += 0.1;
    }

    // 检查fallback_for_toolsets
    if (conditions.fallback_for_toolsets && conditions.fallback_for_toolsets.length > 0) {
      const hasFallback = conditions.fallback_for_toolsets.some(
        ts => availableTools.toolsets?.includes(ts)
      );

      if (hasFallback) {
        reasons.push('fallback_available');
        score -= 0.2; // 有fallback，降低优先级
      }
    }

    // 检查fallback_for_tools
    if (conditions.fallback_for_tools && conditions.fallback_for_tools.length > 0) {
      const hasFallback = conditions.fallback_for_tools.some(
        tool => availableTools.tools?.includes(tool)
      );

      if (hasFallback) {
        reasons.push('tool_fallback_available');
        score -= 0.2;
      }
    }

    // 检查环境变量
    if (conditions.requires_environment_variables) {
      const hasEnvVars = conditions.requires_environment_variables.every(
        env => availableTools.environment?.[env] !== undefined
      );

      if (!hasEnvVars) {
        reasons.push('missing_environment_variables');
        score -= 0.3;
      }
    }

    // 检查用户级别
    if (conditions.requires_user_level) {
      const userLevel = availableTools.userLevel || 'beginner';
      const levelHierarchy = ['beginner', 'intermediate', 'advanced', 'expert'];
      const requiredIndex = levelHierarchy.indexOf(conditions.requires_user_level);
      const userIndex = levelHierarchy.indexOf(userLevel);

      if (userIndex < requiredIndex) {
        reasons.push(`insufficient_user_level: ${userLevel} < ${conditions.requires_user_level}`);
        score -= 0.3;
      }
    }

    const activated = score >= (this.config.strictMode ? 1.0 : 0.5);
    
    return {
      activated,
      score: Math.max(0, score),
      reasons,
      conditions
    };
  }

  /**
   * 计算技能优先级
   * @param {Object} skill - 技能对象
   * @param {Object} availableTools - 可用工具信息
   * @param {Object} evaluation - 评估结果
   * @returns {number} 优先级分数
   * @private
   */
  _calculatePriority(skill, availableTools, evaluation) {
    let priority = evaluation.score;

    // 使用次数多的技能优先级更高
    if (skill.metadata?.usageCount) {
      priority *= (1 + Math.log10(skill.metadata.usageCount + 1) * 0.1);
    }

    // 内置技能优先级更高
    if (skill.metadata?.trustLevel === 'builtin') {
      priority *= 1.5;
    } else if (skill.metadata?.trustLevel === 'official') {
      priority *= 1.3;
    } else if (skill.metadata?.trustLevel === 'trusted') {
      priority *= 1.1;
    }

    // 最近使用的技能优先级更高
    if (skill.metadata?.lastUsed) {
      const daysSinceUse = (Date.now() - skill.metadata.lastUsed) / (1000 * 60 * 60 * 24);
      if (daysSinceUse < 7) {
        priority *= 1.2;
      } else if (daysSinceUse < 30) {
        priority *= 1.1;
      }
    }

    return priority;
  }

  /**
   * 记录评估日志
   * @param {string} skillName - 技能名称
   * @param {Object} conditions - 条件配置
   * @param {Object} availableTools - 可用工具信息
   * @param {Object} result - 评估结果
   * @private
   */
  _logEvaluation(skillName, conditions, availableTools, result) {
    console.log(`[SkillConditionEvaluator] 技能: ${skillName}`);
    console.log(`  条件: ${JSON.stringify(conditions)}`);
    console.log(`  可用工具: ${JSON.stringify(availableTools)}`);
    console.log(`  结果: activated=${result.activated}, score=${result.score}`);
    console.log(`  原因: ${result.reasons.join(', ')}`);
  }
}

module.exports = { SkillConditionEvaluator };