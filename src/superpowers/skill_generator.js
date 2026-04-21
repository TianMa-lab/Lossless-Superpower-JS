/**
 * 技能生成器模块
 * 负责技能的自动生成和质量评估
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nlp = require('compromise');

class SkillGenerator {
  /**
   * 技能生成器
   * @param {string} skillsDir - 技能存储目录
   * @param {string} interactionHistoryDir - 交互历史目录
   */
  constructor(skillsDir, interactionHistoryDir) {
    this.skillsDir = skillsDir;
    this.interactionHistoryDir = interactionHistoryDir;
    this.templates = this._loadTemplates();
    this.patterns = this._loadPatterns();
    this.qualityEvaluator = new QualityEvaluator();
  }

  /**
   * 加载技能模板
   * @returns {Object} 模板对象
   */
  _loadTemplates() {
    const templatesDir = path.join(this.skillsDir, 'templates');
    const templates = {};
    
    try {
      if (fs.existsSync(templatesDir)) {
        const files = fs.readdirSync(templatesDir);
        for (const file of files) {
          if (file.endsWith('.md')) {
            const templatePath = path.join(templatesDir, file);
            const content = fs.readFileSync(templatePath, 'utf-8');
            const templateName = path.basename(file, '.md');
            templates[templateName] = content;
          }
        }
      }
    } catch (error) {
      console.error(`加载技能模板失败: ${error.message}`);
    }
    
    return templates;
  }

  /**
   * 加载模式库
   * @returns {Object} 模式对象
   * @private
   */
  _loadPatterns() {
    return {
      commonPatterns: [
        /如何.*\?/, // 如何开头的问题
        /帮我.*\?/, // 帮我开头的请求
        /创建.*\?/, // 创建开头的请求
        /实现.*\?/, // 实现开头的请求
        /优化.*\?/, // 优化开头的请求
        /分析.*\?/, // 分析开头的请求
        /测试.*\?/, // 测试开头的请求
        /部署.*\?/, // 部署开头的请求
        /配置.*\?/  // 配置开头的请求
      ],
      skillPatterns: [
        /技能/, /功能/, /任务/, /工具/, /方法/, /步骤/, /流程/
      ],
      actionPatterns: [
        /创建/, /修改/, /删除/, /更新/, /添加/, /移除/, /启动/, /停止/
      ]
    };
  }

  /**
   * 从交互历史生成技能
   * @param {string} userId - 用户ID
   * @param {number} days - 分析最近多少天的交互
   * @returns {Array} 生成的技能列表
   */
  generateSkillsFromInteractionHistory(userId, days = 30) {
    console.log(`从交互历史生成技能，用户: ${userId}, 天数: ${days}`);
    
    const skills = [];
    const historyFiles = this._getInteractionHistoryFiles(userId, days);
    
    for (const historyFile of historyFiles) {
      const interactions = this._loadInteractionHistory(historyFile);
      if (interactions && interactions.length > 0) {
        const potentialSkills = this._analyzeInteractions(interactions);
        for (const potentialSkill of potentialSkills) {
          const skill = this._createSkillFromTemplate(potentialSkill);
          if (skill) {
            skills.push(skill);
          }
        }
      }
    }
    
    console.log(`从交互历史生成了 ${skills.length} 个技能`);
    return skills;
  }

  /**
   * 获取交互历史文件
   * @param {string} userId - 用户ID
   * @param {number} days - 最近多少天
   * @returns {Array} 文件列表
   */
  _getInteractionHistoryFiles(userId, days) {
    const files = [];
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    try {
      if (fs.existsSync(this.interactionHistoryDir)) {
        const userDir = path.join(this.interactionHistoryDir, userId);
        if (fs.existsSync(userDir)) {
          const historyFiles = fs.readdirSync(userDir);
          for (const file of historyFiles) {
            if (file.endsWith('.json')) {
              const filePath = path.join(userDir, file);
              const stats = fs.statSync(filePath);
              if (stats.mtime.getTime() > cutoffTime) {
                files.push(filePath);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`获取交互历史文件失败: ${error.message}`);
    }
    
    return files;
  }

  /**
   * 加载交互历史
   * @param {string} filePath - 文件路径
   * @returns {Array} 交互数据
   */
  _loadInteractionHistory(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`加载交互历史文件 ${filePath} 失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 分析交互数据
   * @param {Array} interactions - 交互数据
   * @returns {Array} 潜在的技能
   */
  _analyzeInteractions(interactions) {
    const potentialSkills = [];
    const actionSequences = this._extractActionSequences(interactions);
    
    for (const sequence of actionSequences) {
      if (sequence.length >= 3) { // 至少3个步骤
        const skill = this._analyzeActionSequence(sequence);
        if (skill) {
          // 智能模式识别和NLP分析
          const content = sequence.map(s => s.content).join(' ');
          const patternMatch = this._matchPatterns(content);
          const nlpAnalysis = this._analyzeWithNLP(content);
          
          // 质量评估
          const qualityScore = this.qualityEvaluator.evaluateContent(content, nlpAnalysis);
          
          // 增强技能信息
          skill.patternMatch = patternMatch;
          skill.nlpAnalysis = nlpAnalysis;
          skill.qualityScore = qualityScore;
          skill.tags = this._extractTags(content, nlpAnalysis);
          
          potentialSkills.push(skill);
        }
      }
    }
    
    // 按质量评分排序
    potentialSkills.sort((a, b) => b.qualityScore - a.qualityScore);
    
    return potentialSkills;
  }

  /**
   * 匹配模式
   * @param {string} content - 内容
   * @returns {Object} 匹配结果
   * @private
   */
  _matchPatterns(content) {
    const matches = [];
    
    // 匹配常见模式
    for (const pattern of this.patterns.commonPatterns) {
      if (pattern.test(content)) {
        matches.push({ type: 'common', pattern: pattern.toString() });
      }
    }
    
    // 匹配技能相关模式
    for (const pattern of this.patterns.skillPatterns) {
      if (pattern.test(content)) {
        matches.push({ type: 'skill', pattern: pattern.toString() });
      }
    }
    
    // 匹配动作模式
    for (const pattern of this.patterns.actionPatterns) {
      if (pattern.test(content)) {
        matches.push({ type: 'action', pattern: pattern.toString() });
      }
    }
    
    return matches.length > 0 ? { matches, score: matches.length } : null;
  }

  /**
   * 使用NLP分析内容
   * @param {string} content - 内容
   * @returns {Object} NLP分析结果
   * @private
   */
  _analyzeWithNLP(content) {
    const doc = nlp(content);
    
    return {
      nouns: doc.nouns().out('array'),
      verbs: doc.verbs().out('array'),
      questions: doc.questions().out('array'),
      topics: doc.topics().out('array'),
      length: content.length
    };
  }

  /**
   * 提取标签
   * @param {string} content - 内容
   * @param {Object} nlpAnalysis - NLP分析结果
   * @returns {Array} 标签列表
   * @private
   */
  _extractTags(content, nlpAnalysis) {
    const tags = new Set();
    
    // 从NLP分析结果中提取标签
    if (nlpAnalysis.nouns && nlpAnalysis.nouns.length > 0) {
      nlpAnalysis.nouns.forEach(noun => {
        if (noun.length > 1) {
          tags.add(noun);
        }
      });
    }
    
    // 从内容中提取常见标签
    const commonTags = ['编程', '设计', '测试', '分析', '优化', '部署', '配置', '开发'];
    commonTags.forEach(tag => {
      if (content.includes(tag)) {
        tags.add(tag);
      }
    });
    
    return Array.from(tags);
  }

  /**
   * 提取动作序列
   * @param {Array} interactions - 交互数据
   * @returns {Array} 动作序列
   */
  _extractActionSequences(interactions) {
    const sequences = [];
    let currentSequence = [];
    
    for (const interaction of interactions) {
      if (interaction.type === 'action') {
        currentSequence.push(interaction);
      } else if (currentSequence.length > 0) {
        sequences.push([...currentSequence]);
        currentSequence = [];
      }
    }
    
    if (currentSequence.length > 0) {
      sequences.push(currentSequence);
    }
    
    return sequences;
  }

  /**
   * 分析动作序列
   * @param {Array} sequence - 动作序列
   * @returns {Object} 技能数据
   */
  _analyzeActionSequence(sequence) {
    // 分析动作序列，提取技能信息
    const actions = sequence.map(action => action.action);
    const parameters = this._extractParameters(sequence);
    const description = this._generateDescription(sequence);
    
    return {
      name: this._generateSkillName(actions),
      description: description,
      actions: actions,
      parameters: parameters,
      examples: this._generateExamples(sequence)
    };
  }

  /**
   * 提取参数
   * @param {Array} sequence - 动作序列
   * @returns {Object} 参数
   */
  _extractParameters(sequence) {
    const parameters = {};
    
    for (const action of sequence) {
      if (action.parameters) {
        Object.assign(parameters, action.parameters);
      }
    }
    
    return parameters;
  }

  /**
   * 生成技能名称
   * @param {Array} actions - 动作列表
   * @returns {string} 技能名称
   */
  _generateSkillName(actions) {
    if (actions.length === 0) return 'unnamed_skill';
    
    const firstAction = actions[0].toLowerCase();
    const skillName = firstAction.replace(/[^a-zA-Z0-9]/g, '_') + '_' + uuidv4().substring(0, 8);
    return skillName;
  }

  /**
   * 生成技能描述
   * @param {Array} sequence - 动作序列
   * @returns {string} 描述
   */
  _generateDescription(sequence) {
    if (sequence.length === 0) return 'Automatically generated skill';
    
    const actions = sequence.map(action => action.action);
    return `Automatically generated skill that performs: ${actions.join(', ')}`;
  }

  /**
   * 生成示例
   * @param {Array} sequence - 动作序列
   * @returns {Array} 示例
   */
  _generateExamples(sequence) {
    return sequence.map(action => {
      return {
        input: action.input || 'User input',
        output: action.output || 'System output'
      };
    });
  }

  /**
   * 从模板创建技能
   * @param {Object} skillData - 技能数据
   * @returns {Object} 技能对象
   */
  _createSkillFromTemplate(skillData) {
    const template = this.templates.default || this._getDefaultTemplate();
    let content = template;
    
    // 替换模板变量
    content = content.replace(/{{name}}/g, skillData.name);
    content = content.replace(/{{description}}/g, skillData.description);
    content = content.replace(/{{actions}}/g, JSON.stringify(skillData.actions, null, 2));
    content = content.replace(/{{parameters}}/g, JSON.stringify(skillData.parameters, null, 2));
    content = content.replace(/{{examples}}/g, JSON.stringify(skillData.examples, null, 2));
    
    const skillDir = path.join(this.skillsDir, 'auto_generated', skillData.name);
    const skillFilePath = path.join(skillDir, 'SKILL.md');
    
    try {
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(skillFilePath, content, 'utf-8');
      
      return {
        name: skillData.name,
        description: skillData.description,
        path: path.relative(this.skillsDir, skillDir),
        filePath: skillFilePath
      };
    } catch (error) {
      console.error(`创建技能 ${skillData.name} 失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 获取默认模板
   * @returns {string} 默认模板
   */
  _getDefaultTemplate() {
    return `---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [auto_generated]
trigger_patterns:
  - "{{name}}"
parameters: {{parameters}}
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 动作序列

{{actions}}

## 参数

{{parameters}}

## 示例

{{examples}}

## 执行逻辑

This skill was automatically generated from user interaction history.
`;
  }

  /**
   * 评估技能质量
   * @param {Object} skill - 技能对象
   * @returns {number} 质量评分 (0-100)
   */
  evaluateSkillQuality(skill) {
    let score = 0;
    
    // 评估技能名称
    if (skill.name && skill.name.length > 3) {
      score += 10;
    }
    
    // 评估技能描述
    if (skill.description && skill.description.length > 20) {
      score += 20;
    }
    
    // 评估动作序列
    if (skill.actions && skill.actions.length >= 3) {
      score += 30;
    }
    
    // 评估参数
    if (skill.parameters && Object.keys(skill.parameters).length > 0) {
      score += 20;
    }
    
    // 评估示例
    if (skill.examples && skill.examples.length > 0) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }

  /**
   * 批量生成技能
   * @param {Array} users - 用户ID列表
   * @param {number} days - 分析天数
   * @returns {Object} 生成结果
   */
  batchGenerateSkills(users, days = 30) {
    const results = {
      totalSkills: 0,
      skillsByUser: {},
      qualityStats: {
        high: 0,
        medium: 0,
        low: 0
      }
    };
    
    for (const user of users) {
      const skills = this.generateSkillsFromInteractionHistory(user, days);
      results.skillsByUser[user] = skills.length;
      results.totalSkills += skills.length;
      
      for (const skill of skills) {
        const quality = this.evaluateSkillQuality(skill);
        if (quality >= 70) {
          results.qualityStats.high++;
        } else if (quality >= 40) {
          results.qualityStats.medium++;
        } else {
          results.qualityStats.low++;
        }
      }
    }
    
    return results;
  }

  /**
   * 清理低质量技能
   * @param {number} minQuality - 最低质量评分
   * @returns {number} 清理的技能数量
   */
  cleanupLowQualitySkills(minQuality = 40) {
    const autoGeneratedDir = path.join(this.skillsDir, 'auto_generated');
    let cleanedCount = 0;
    
    try {
      if (fs.existsSync(autoGeneratedDir)) {
        const skillDirs = fs.readdirSync(autoGeneratedDir);
        for (const skillDir of skillDirs) {
          const skillPath = path.join(autoGeneratedDir, skillDir, 'SKILL.md');
          if (fs.existsSync(skillPath)) {
            const content = fs.readFileSync(skillPath, 'utf-8');
            const skill = this._parseSkillContent(content);
            if (skill) {
              const quality = this.evaluateSkillQuality(skill);
              if (quality < minQuality) {
                fs.rmSync(path.join(autoGeneratedDir, skillDir), { recursive: true, force: true });
                cleanedCount++;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`清理低质量技能失败: ${error.message}`);
    }
    
    console.log(`清理了 ${cleanedCount} 个低质量技能`);
    return cleanedCount;
  }

  /**
   * 解析技能内容
   * @param {string} content - 技能内容
   * @returns {Object} 技能对象
   */
  _parseSkillContent(content) {
    try {
      const frontmatterMatch = content.match(/---[\s\S]*?---/);
      if (frontmatterMatch) {
        const frontmatterStr = frontmatterMatch[0].replace(/---/g, '').trim();
        const frontmatter = this._parseFrontmatter(frontmatterStr);
        return frontmatter;
      }
    } catch (error) {
      console.error(`解析技能内容失败: ${error.message}`);
    }
    return null;
  }

  /**
   * 解析前置元数据
   * @param {string} frontmatterStr - 前置元数据字符串
   * @returns {Object} 前置元数据
   */
  _parseFrontmatter(frontmatterStr) {
    const lines = frontmatterStr.split('\n');
    const frontmatter = {};
    
    for (const line of lines) {
      const match = line.match(/(\w+):\s*(.*)/);
      if (match) {
        const [, key, value] = match;
        frontmatter[key] = value;
      }
    }
    
    return frontmatter;
  }
}

/**
 * 质量评估器类
 * 负责评估技能的质量
 */
class QualityEvaluator {
  /**
   * 评估内容质量
   * @param {string} content - 内容
   * @param {Object} nlpAnalysis - NLP分析结果
   * @returns {number} 质量评分 (0-100)
   */
  evaluateContent(content, nlpAnalysis) {
    let score = 0;
    
    // 内容长度评估
    if (content.length > 50) {
      score += 20;
    } else if (content.length > 20) {
      score += 10;
    }
    
    // 词汇丰富度评估
    if (nlpAnalysis.nouns && nlpAnalysis.nouns.length > 5) {
      score += 15;
    } else if (nlpAnalysis.nouns && nlpAnalysis.nouns.length > 2) {
      score += 5;
    }
    
    if (nlpAnalysis.verbs && nlpAnalysis.verbs.length > 3) {
      score += 15;
    } else if (nlpAnalysis.verbs && nlpAnalysis.verbs.length > 1) {
      score += 5;
    }
    
    // 问题类型评估
    if (nlpAnalysis.questions && nlpAnalysis.questions.length > 0) {
      score += 10;
    }
    
    // 主题明确性评估
    if (nlpAnalysis.topics && nlpAnalysis.topics.length > 0) {
      score += 10;
    }
    
    // 情感分析
    if (nlpAnalysis.sentiment && nlpAnalysis.sentiment.score > 0) {
      score += 10;
    }
    
    // 模式匹配评估
    const patternScore = this._evaluatePatterns(content);
    score += patternScore;
    
    // 多样性评估
    const diversityScore = this._evaluateDiversity(content);
    score += diversityScore;
    
    return Math.min(score, 100);
  }

  /**
   * 评估模式匹配
   * @param {string} content - 内容
   * @returns {number} 模式匹配评分
   * @private
   */
  _evaluatePatterns(content) {
    let score = 0;
    
    const patterns = [
      /如何.*\?/, // 如何开头的问题
      /帮我.*\?/, // 帮我开头的请求
      /创建.*\?/, // 创建开头的请求
      /实现.*\?/, // 实现开头的请求
      /优化.*\?/, // 优化开头的请求
      /分析.*\?/, // 分析开头的请求
      /测试.*\?/, // 测试开头的请求
      /部署.*\?/, // 部署开头的请求
      /配置.*\?/  // 配置开头的请求
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        score += 5;
      }
    }
    
    return Math.min(score, 15);
  }

  /**
   * 评估多样性
   * @param {string} content - 内容
   * @returns {number} 多样性评分
   * @private
   */
  _evaluateDiversity(content) {
    const words = content.split(/\s+/);
    const uniqueWords = new Set(words);
    const diversity = uniqueWords.size / words.length;
    
    if (diversity > 0.8) {
      return 10;
    } else if (diversity > 0.5) {
      return 5;
    }
    return 0;
  }

  /**
   * 评估技能结构质量
   * @param {Object} skill - 技能对象
   * @returns {number} 结构质量评分
   */
  evaluateStructure(skill) {
    let score = 0;
    
    // 评估技能名称
    if (skill.name && skill.name.length > 3) {
      score += 10;
    }
    
    // 评估技能描述
    if (skill.description && skill.description.length > 20) {
      score += 15;
    }
    
    // 评估动作序列
    if (skill.actions && skill.actions.length >= 3) {
      score += 20;
    }
    
    // 评估参数
    if (skill.parameters && Object.keys(skill.parameters).length > 0) {
      score += 15;
    }
    
    // 评估示例
    if (skill.examples && skill.examples.length > 0) {
      score += 10;
    }
    
    // 评估标签
    if (skill.tags && skill.tags.length > 0) {
      score += 10;
    }
    
    // 评估质量评分
    if (skill.qualityScore && skill.qualityScore > 50) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }

  /**
   * 生成质量报告
   * @param {Object} skill - 技能对象
   * @returns {Object} 质量报告
   */
  generateQualityReport(skill) {
    const contentScore = skill.qualityScore || 0;
    const structureScore = this.evaluateStructure(skill);
    const overallScore = (contentScore + structureScore) / 2;
    
    let qualityLevel;
    if (overallScore >= 80) {
      qualityLevel = '优秀';
    } else if (overallScore >= 60) {
      qualityLevel = '良好';
    } else if (overallScore >= 40) {
      qualityLevel = '一般';
    } else {
      qualityLevel = '需改进';
    }
    
    return {
      overallScore: overallScore,
      contentScore: contentScore,
      structureScore: structureScore,
      qualityLevel: qualityLevel,
      suggestions: this._generateImprovementSuggestions(skill, overallScore),
      timestamp: Date.now()
    };
  }

  /**
   * 生成改进建议
   * @param {Object} skill - 技能对象
   * @param {number} score - 评分
   * @returns {Array} 改进建议
   * @private
   */
  _generateImprovementSuggestions(skill, score) {
    const suggestions = [];
    
    if (!skill.name || skill.name.length <= 3) {
      suggestions.push('技能名称应更具体，至少3个字符');
    }
    
    if (!skill.description || skill.description.length <= 20) {
      suggestions.push('技能描述应更详细，至少20个字符');
    }
    
    if (!skill.actions || skill.actions.length < 3) {
      suggestions.push('技能应包含至少3个步骤的动作序列');
    }
    
    if (!skill.parameters || Object.keys(skill.parameters).length === 0) {
      suggestions.push('技能应定义必要的参数');
    }
    
    if (!skill.examples || skill.examples.length === 0) {
      suggestions.push('技能应提供使用示例');
    }
    
    if (!skill.tags || skill.tags.length === 0) {
      suggestions.push('技能应添加相关标签');
    }
    
    if (score < 60) {
      suggestions.push('建议重新分析交互历史，提取更完整的技能信息');
    }
    
    return suggestions;
  }
}

// 导出模块
module.exports = {
  SkillGenerator,
  QualityEvaluator
};
