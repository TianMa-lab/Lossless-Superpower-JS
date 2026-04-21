/**
 * 技能优化器模块
 * 负责技能的迭代优化和版本控制
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SkillOptimizer {
  /**
   * 技能优化器
   * @param {string} skillsDir - 技能存储目录
   * @param {string} optimizationDir - 优化数据存储目录
   */
  constructor(skillsDir, optimizationDir) {
    this.skillsDir = skillsDir;
    this.optimizationDir = optimizationDir;
    this.optimizationHistory = new Map();
    this.versionHistory = new Map();
    this.abTests = new Map();
    this.autoOptimizationEnabled = false;
    this.loadOptimizationHistory();
    this.loadVersionHistory();
    this.loadABTests();
  }

  /**
   * 加载优化历史
   */
  loadOptimizationHistory() {
    const historyFilePath = path.join(this.optimizationDir, 'optimization_history.json');
    
    try {
      if (fs.existsSync(historyFilePath)) {
        const content = fs.readFileSync(historyFilePath, 'utf-8');
        const history = JSON.parse(content);
        this.optimizationHistory = new Map(Object.entries(history));
        console.log('技能优化历史加载成功');
      }
    } catch (error) {
      console.error(`加载技能优化历史失败: ${error.message}`);
    }
  }

  /**
   * 保存优化历史
   */
  saveOptimizationHistory() {
    const historyFilePath = path.join(this.optimizationDir, 'optimization_history.json');
    
    try {
      const history = Object.fromEntries(this.optimizationHistory);
      fs.mkdirSync(this.optimizationDir, { recursive: true });
      fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
      console.log('技能优化历史保存成功');
    } catch (error) {
      console.error(`保存技能优化历史失败: ${error.message}`);
    }
  }

  /**
   * 加载版本历史
   */
  loadVersionHistory() {
    const versionFilePath = path.join(this.optimizationDir, 'version_history.json');
    
    try {
      if (fs.existsSync(versionFilePath)) {
        const content = fs.readFileSync(versionFilePath, 'utf-8');
        const history = JSON.parse(content);
        this.versionHistory = new Map(Object.entries(history));
        console.log('技能版本历史加载成功');
      }
    } catch (error) {
      console.error(`加载技能版本历史失败: ${error.message}`);
    }
  }

  /**
   * 保存版本历史
   */
  saveVersionHistory() {
    const versionFilePath = path.join(this.optimizationDir, 'version_history.json');
    
    try {
      const history = Object.fromEntries(this.versionHistory);
      fs.mkdirSync(this.optimizationDir, { recursive: true });
      fs.writeFileSync(versionFilePath, JSON.stringify(history, null, 2), 'utf-8');
      console.log('技能版本历史保存成功');
    } catch (error) {
      console.error(`保存技能版本历史失败: ${error.message}`);
    }
  }

  /**
   * 加载A/B测试数据
   */
  loadABTests() {
    const abTestsFilePath = path.join(this.optimizationDir, 'ab_tests.json');
    
    try {
      if (fs.existsSync(abTestsFilePath)) {
        const content = fs.readFileSync(abTestsFilePath, 'utf-8');
        const tests = JSON.parse(content);
        this.abTests = new Map(Object.entries(tests));
        console.log('A/B测试数据加载成功');
      }
    } catch (error) {
      console.error(`加载A/B测试数据失败: ${error.message}`);
    }
  }

  /**
   * 保存A/B测试数据
   */
  saveABTests() {
    const abTestsFilePath = path.join(this.optimizationDir, 'ab_tests.json');
    
    try {
      const tests = Object.fromEntries(this.abTests);
      fs.mkdirSync(this.optimizationDir, { recursive: true });
      fs.writeFileSync(abTestsFilePath, JSON.stringify(tests, null, 2), 'utf-8');
      console.log('A/B测试数据保存成功');
    } catch (error) {
      console.error(`保存A/B测试数据失败: ${error.message}`);
    }
  }

  /**
   * 启用自动优化
   * @param {Object} config - 自动优化配置
   */
  enableAutoOptimization(config = {}) {
    this.autoOptimizationEnabled = true;
    this.autoOptimizationConfig = {
      interval: config.interval || 60000, // 默认1分钟
      threshold: config.threshold || 0.7, // 性能阈值
      maxOptimizations: config.maxOptimizations || 10, // 最大优化次数
      ...config
    };
    
    this.startAutoOptimization();
    console.log('自动优化已启用');
  }

  /**
   * 禁用自动优化
   */
  disableAutoOptimization() {
    this.autoOptimizationEnabled = false;
    if (this.autoOptimizationInterval) {
      clearInterval(this.autoOptimizationInterval);
      this.autoOptimizationInterval = null;
    }
    console.log('自动优化已禁用');
  }

  /**
   * 启动自动优化
   */
  startAutoOptimization() {
    if (this.autoOptimizationInterval) {
      clearInterval(this.autoOptimizationInterval);
    }
    
    this.autoOptimizationInterval = setInterval(() => {
      this.runAutoOptimization();
    }, this.autoOptimizationConfig.interval);
  }

  /**
   * 运行自动优化
   */
  async runAutoOptimization() {
    if (!this.autoOptimizationEnabled) return;
    
    console.log('开始自动优化检查...');
    
    try {
      const skills = fs.readdirSync(this.skillsDir);
      
      for (const skillName of skills) {
        const skillPath = path.join(this.skillsDir, skillName);
        if (fs.statSync(skillPath).isDirectory()) {
          const skillFilePath = path.join(skillPath, 'SKILL.md');
          if (fs.existsSync(skillFilePath)) {
            // 获取使用数据（这里需要从实际的使用统计中获取）
            const usageData = this.getSkillUsageData(skillName);
            
            // 分析是否需要优化
            if (this.shouldOptimizeSkill(skillName, usageData)) {
              console.log(`自动优化技能: ${skillName}`);
              this.optimizeSkill(skillName, usageData);
            }
          }
        }
      }
    } catch (error) {
      console.error(`自动优化失败: ${error.message}`);
    }
  }

  /**
   * 检查技能是否需要优化
   * @param {string} skillName - 技能名称
   * @param {Object} usageData - 使用数据
   * @returns {boolean} 是否需要优化
   */
  shouldOptimizeSkill(skillName, usageData) {
    if (!usageData) return false;
    
    // 基于使用数据判断是否需要优化
    const successRate = usageData.totalUses > 0 ? 
      (usageData.successfulUses / usageData.totalUses) : 1;
    
    const averageDuration = usageData.totalUses > 0 ? 
      (usageData.totalDuration / usageData.totalUses) : 0;
    
    const errorRate = usageData.errorRate || 0;
    
    // 检查性能指标
    const needsOptimization = successRate < this.autoOptimizationConfig.threshold ||
      averageDuration > 5000 ||
      errorRate > 0.1;
    
    return needsOptimization;
  }

  /**
   * 获取技能使用数据
   * @param {string} skillName - 技能名称
   * @returns {Object} 使用数据
   */
  getSkillUsageData(skillName) {
    // 这里应该从实际的使用统计系统中获取数据
    // 暂时返回模拟数据
    return {
      totalUses: Math.floor(Math.random() * 1000),
      successfulUses: Math.floor(Math.random() * 1000),
      totalDuration: Math.floor(Math.random() * 100000),
      users: new Map([['user1', 10], ['user2', 5]]),
      averageResponseTime: Math.random() * 5000,
      errorRate: Math.random() * 0.2
    };
  }

  /**
   * 优化技能
   * @param {string} skillName - 技能名称
   * @param {Object} usageData - 使用数据
   * @returns {Object} 优化结果
   */
  optimizeSkill(skillName, usageData) {
    console.log(`开始优化技能: ${skillName}`);
    
    const skillPath = path.join(this.skillsDir, skillName);
    const skillFilePath = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillFilePath)) {
      console.error(`技能 ${skillName} 不存在`);
      return { success: false, error: '技能不存在' };
    }
    
    try {
      // 读取技能文件
      const content = fs.readFileSync(skillFilePath, 'utf-8');
      
      // 分析技能内容
      const analysis = this.analyzeSkill(content, usageData);
      
      // 生成优化建议
      const suggestions = this.generateOptimizationSuggestions(analysis, usageData);
      
      // 应用优化
      const optimizedContent = this.applyOptimizations(content, suggestions);
      
      // 创建版本备份
      this.createVersionBackup(skillName, content);
      
      // 保存优化后的技能
      fs.writeFileSync(skillFilePath, optimizedContent, 'utf-8');
      
      // 记录优化历史
      const optimizationRecord = {
        skillName: skillName,
        timestamp: Date.now(),
        suggestions: suggestions,
        changes: this.calculateChanges(content, optimizedContent),
        usageData: usageData
      };
      
      this.optimizationHistory.set(`${skillName}_${Date.now()}`, optimizationRecord);
      this.saveOptimizationHistory();
      
      console.log(`技能 ${skillName} 优化成功`);
      return {
        success: true,
        suggestions: suggestions,
        changes: optimizationRecord.changes
      };
    } catch (error) {
      console.error(`优化技能 ${skillName} 失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 分析技能
   * @param {string} content - 技能内容
   * @param {Object} usageData - 使用数据
   * @returns {Object} 分析结果
   */
  analyzeSkill(content, usageData) {
    // 分析技能内容和使用数据
    const analysis = {
      structure: this.analyzeSkillStructure(content),
      usage: this.analyzeSkillUsage(usageData),
      performance: this.analyzeSkillPerformance(usageData)
    };
    
    return analysis;
  }

  /**
   * 分析技能结构
   * @param {string} content - 技能内容
   * @returns {Object} 结构分析
   */
  analyzeSkillStructure(content) {
    const structure = {
      hasFrontmatter: content.includes('---'),
      hasDescription: content.includes('# 描述'),
      hasParameters: content.includes('# 参数'),
      hasExamples: content.includes('# 示例'),
      hasExecutionLogic: content.includes('# 执行逻辑')
    };
    
    return structure;
  }

  /**
   * 分析技能使用
   * @param {Object} usageData - 使用数据
   * @returns {Object} 使用分析
   */
  analyzeSkillUsage(usageData) {
    const usage = {
      totalUses: usageData.totalUses || 0,
      successRate: usageData.totalUses > 0 ? 
        (usageData.successfulUses / usageData.totalUses) : 0,
      averageDuration: usageData.totalUses > 0 ? 
        (usageData.totalDuration / usageData.totalUses) : 0,
      userCount: usageData.users ? usageData.users.size : 0
    };
    
    return usage;
  }

  /**
   * 分析技能性能
   * @param {Object} usageData - 使用数据
   * @returns {Object} 性能分析
   */
  analyzeSkillPerformance(usageData) {
    const performance = {
      responseTime: usageData.averageResponseTime || 0,
      errorRate: usageData.errorRate || 0,
      resourceUsage: usageData.resourceUsage || {}
    };
    
    return performance;
  }

  /**
   * 生成优化建议
   * @param {Object} analysis - 分析结果
   * @param {Object} usageData - 使用数据
   * @returns {Array} 优化建议
   */
  generateOptimizationSuggestions(analysis, usageData) {
    const suggestions = [];
    
    // 结构优化建议
    if (!analysis.structure.hasFrontmatter) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        suggestion: '添加YAML前置元数据，包含技能名称、描述、版本等信息'
      });
    }
    
    if (!analysis.structure.hasDescription) {
      suggestions.push({
        type: 'structure',
        priority: 'medium',
        suggestion: '添加技能描述部分，详细说明技能的功能和用途'
      });
    }
    
    if (!analysis.structure.hasParameters) {
      suggestions.push({
        type: 'structure',
        priority: 'medium',
        suggestion: '添加参数说明部分，明确技能的输入参数'
      });
    }
    
    if (!analysis.structure.hasExamples) {
      suggestions.push({
        type: 'structure',
        priority: 'low',
        suggestion: '添加使用示例，帮助用户理解如何使用技能'
      });
    }
    
    // 使用优化建议
    if (analysis.usage.successRate < 0.8) {
      suggestions.push({
        type: 'usage',
        priority: 'high',
        suggestion: `成功率较低 (${(analysis.usage.successRate * 100).toFixed(2)}%)，建议优化执行逻辑`
      });
    }
    
    if (analysis.usage.averageDuration > 5000) {
      suggestions.push({
        type: 'performance',
        priority: 'medium',
        suggestion: `执行时间较长 (${(analysis.usage.averageDuration / 1000).toFixed(2)}s)，建议优化性能`
      });
    }
    
    // 性能优化建议
    if (analysis.performance.responseTime > 2000) {
      suggestions.push({
        type: 'performance',
        priority: 'high',
        suggestion: `响应时间较长 (${(analysis.performance.responseTime / 1000).toFixed(2)}s)，建议优化响应速度`
      });
    }
    
    if (analysis.performance.errorRate > 0.1) {
      suggestions.push({
        type: 'performance',
        priority: 'high',
        suggestion: `错误率较高 (${(analysis.performance.errorRate * 100).toFixed(2)}%)，建议修复错误`
      });
    }
    
    // 智能优化建议
    suggestions.push(...this.generateSmartSuggestions(analysis, usageData));
    
    return suggestions;
  }

  /**
   * 生成智能优化建议
   * @param {Object} analysis - 分析结果
   * @param {Object} usageData - 使用数据
   * @returns {Array} 智能优化建议
   */
  generateSmartSuggestions(analysis, usageData) {
    const smartSuggestions = [];
    
    // 基于使用模式的优化建议
    if (usageData && usageData.users && usageData.users.size > 0) {
      const userCount = usageData.users.size;
      const totalUses = usageData.totalUses || 0;
      const averageUsesPerUser = totalUses / userCount;
      
      if (averageUsesPerUser > 10) {
        smartSuggestions.push({
          type: 'usage_pattern',
          priority: 'medium',
          suggestion: `该技能被频繁使用 (平均每个用户使用 ${averageUsesPerUser.toFixed(1)} 次)，建议添加缓存机制提高性能`
        });
      }
    }
    
    // 基于错误模式的优化建议
    if (analysis.performance.errorRate > 0.05) {
      smartSuggestions.push({
        type: 'error_pattern',
        priority: 'high',
        suggestion: '建议添加错误处理和重试机制，提高技能的稳定性'
      });
    }
    
    // 基于性能模式的优化建议
    if (analysis.performance.responseTime > 1000) {
      smartSuggestions.push({
        type: 'performance_pattern',
        priority: 'medium',
        suggestion: '建议优化执行逻辑，考虑使用异步操作或并行处理提高响应速度'
      });
    }
    
    return smartSuggestions;
  }

  /**
   * 创建A/B测试
   * @param {string} skillName - 技能名称
   * @param {Object} variants - 测试变体
   * @returns {string} 测试ID
   */
  createABTest(skillName, variants) {
    const testId = uuidv4();
    const test = {
      id: testId,
      skillName: skillName,
      variants: variants,
      startTime: Date.now(),
      status: 'active',
      results: {}
    };
    
    this.abTests.set(testId, test);
    this.saveABTests();
    console.log(`创建A/B测试: ${testId} for ${skillName}`);
    return testId;
  }

  /**
   * 结束A/B测试
   * @param {string} testId - 测试ID
   * @returns {Object} 测试结果
   */
  endABTest(testId) {
    const test = this.abTests.get(testId);
    if (!test) {
      return { success: false, error: '测试不存在' };
    }
    
    test.status = 'completed';
    test.endTime = Date.now();
    this.abTests.set(testId, test);
    this.saveABTests();
    
    console.log(`结束A/B测试: ${testId}`);
    return { success: true, results: test.results };
  }

  /**
   * 记录A/B测试结果
   * @param {string} testId - 测试ID
   * @param {string} variantId - 变体ID
   * @param {Object} result - 测试结果
   */
  recordABTestResult(testId, variantId, result) {
    const test = this.abTests.get(testId);
    if (!test) return;
    
    if (!test.results[variantId]) {
      test.results[variantId] = {
        totalUses: 0,
        successfulUses: 0,
        totalDuration: 0,
        errorRate: 0
      };
    }
    
    const variantResults = test.results[variantId];
    variantResults.totalUses += result.totalUses || 1;
    variantResults.successfulUses += result.successfulUses || 1;
    variantResults.totalDuration += result.totalDuration || 0;
    variantResults.errorRate = (variantResults.totalUses - variantResults.successfulUses) / variantResults.totalUses;
    
    this.abTests.set(testId, test);
    this.saveABTests();
  }

  /**
   * 回滚到之前的版本
   * @param {string} skillName - 技能名称
   * @param {string} versionId - 版本ID
   * @returns {Object} 回滚结果
   */
  rollbackToVersion(skillName, versionId) {
    const versionData = this.versionHistory.get(`${skillName}_${versionId}`);
    if (!versionData) {
      return { success: false, error: '版本不存在' };
    }
    
    const skillPath = path.join(this.skillsDir, skillName);
    const skillFilePath = path.join(skillPath, 'SKILL.md');
    
    try {
      fs.writeFileSync(skillFilePath, versionData.content, 'utf-8');
      console.log(`回滚技能 ${skillName} 到版本 ${versionId}`);
      return { success: true, version: versionId };
    } catch (error) {
      console.error(`回滚技能 ${skillName} 失败: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取技能版本历史
   * @param {string} skillName - 技能名称
   * @returns {Array} 版本历史
   */
  getSkillVersionHistory(skillName) {
    const history = [];
    
    for (const [key, versionData] of this.versionHistory) {
      if (key.startsWith(`${skillName}_`)) {
        history.push({
          versionId: key.split('_').pop(),
          timestamp: versionData.timestamp,
          changes: versionData.changes,
          optimizerVersion: versionData.optimizerVersion
        });
      }
    }
    
    history.sort((a, b) => b.timestamp - a.timestamp);
    return history;
  }

  /**
   * 应用优化
   * @param {string} content - 原始内容
   * @param {Array} suggestions - 优化建议
   * @returns {string} 优化后的内容
   */
  applyOptimizations(content, suggestions) {
    let optimizedContent = content;
    
    // 应用结构优化
    if (suggestions.some(s => s.type === 'structure' && s.priority === 'high')) {
      optimizedContent = this.addFrontmatter(optimizedContent);
    }
    
    if (suggestions.some(s => s.type === 'structure' && s.suggestion.includes('添加技能描述'))) {
      optimizedContent = this.addDescriptionSection(optimizedContent);
    }
    
    if (suggestions.some(s => s.type === 'structure' && s.suggestion.includes('添加参数说明'))) {
      optimizedContent = this.addParametersSection(optimizedContent);
    }
    
    if (suggestions.some(s => s.type === 'structure' && s.suggestion.includes('添加使用示例'))) {
      optimizedContent = this.addExamplesSection(optimizedContent);
    }
    
    return optimizedContent;
  }

  /**
   * 添加前置元数据
   * @param {string} content - 原始内容
   * @returns {string} 添加前置元数据后的内容
   */
  addFrontmatter(content) {
    if (content.startsWith('---')) {
      return content;
    }
    
    const frontmatter = `---
name: ${path.basename(path.dirname(content))}
description: 技能描述
version: 1.0.0
author: Lossless Superpower
tags: []
trigger_patterns:
  - "使用该技能"
parameters: {}
execution:
  type: javascript
  module: skills.skill_name
  function: runSkill
---

`;
    
    return frontmatter + content;
  }

  /**
   * 添加描述部分
   * @param {string} content - 原始内容
   * @returns {string} 添加描述部分后的内容
   */
  addDescriptionSection(content) {
    if (content.includes('# 描述')) {
      return content;
    }
    
    return content + '\n## 描述\n\n技能详细描述...\n';
  }

  /**
   * 添加参数部分
   * @param {string} content - 原始内容
   * @returns {string} 添加参数部分后的内容
   */
  addParametersSection(content) {
    if (content.includes('# 参数')) {
      return content;
    }
    
    return content + '\n## 参数\n\n| 参数名 | 类型 | 描述 | 是否必填 |\n|--------|------|------|----------|\n| param1 | string | 参数1描述 | true |\n';
  }

  /**
   * 添加示例部分
   * @param {string} content - 原始内容
   * @returns {string} 添加示例部分后的内容
   */
  addExamplesSection(content) {
    if (content.includes('# 示例')) {
      return content;
    }
    
    return content + '\n## 示例\n\n### 示例1\n输入: 使用该技能\n输出: 技能执行结果\n';
  }

  /**
   * 计算变更
   * @param {string} original - 原始内容
   * @param {string} optimized - 优化后的内容
   * @returns {Object} 变更信息
   */
  calculateChanges(original, optimized) {
    const originalLines = original.split('\n');
    const optimizedLines = optimized.split('\n');
    
    return {
      originalLines: originalLines.length,
      optimizedLines: optimizedLines.length,
      addedLines: optimizedLines.length - originalLines.length
    };
  }

  /**
   * 创建版本备份
   * @param {string} skillName - 技能名称
   * @param {string} content - 技能内容
   * @returns {string} 版本ID
   */
  createVersionBackup(skillName, content) {
    const versionDir = path.join(this.optimizationDir, 'versions', skillName);
    const versionId = Date.now().toString();
    const versionFile = path.join(versionDir, `${versionId}.md`);
    
    try {
      // 保存到文件系统
      fs.mkdirSync(versionDir, { recursive: true });
      fs.writeFileSync(versionFile, content, 'utf-8');
      
      // 记录到版本历史
      const versionData = {
        skillName: skillName,
        versionId: versionId,
        timestamp: Date.now(),
        content: content,
        optimizerVersion: '1.0.0',
        changes: '自动版本备份'
      };
      
      this.versionHistory.set(`${skillName}_${versionId}`, versionData);
      this.saveVersionHistory();
      
      console.log(`技能 ${skillName} 版本备份成功: ${versionId}`);
      return versionId;
    } catch (error) {
      console.error(`创建技能版本备份失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 回滚技能版本
   * @param {string} skillName - 技能名称
   * @param {number} timestamp - 版本时间戳
   * @returns {boolean} 是否回滚成功
   */
  rollbackSkill(skillName, timestamp) {
    const versionFile = path.join(this.optimizationDir, 'versions', skillName, `${timestamp}.md`);
    const skillFilePath = path.join(this.skillsDir, skillName, 'SKILL.md');
    
    try {
      if (fs.existsSync(versionFile)) {
        const content = fs.readFileSync(versionFile, 'utf-8');
        fs.writeFileSync(skillFilePath, content, 'utf-8');
        console.log(`技能 ${skillName} 回滚到版本 ${timestamp} 成功`);
        return true;
      } else {
        console.error(`版本文件不存在: ${versionFile}`);
        return false;
      }
    } catch (error) {
      console.error(`回滚技能版本失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 批量优化技能
   * @param {Array} skillNames - 技能名称列表
   * @param {Object} usageDataMap - 使用数据映射
   * @returns {Object} 优化结果
   */
  batchOptimizeSkills(skillNames, usageDataMap) {
    const results = {
      totalSkills: skillNames.length,
      successful: 0,
      failed: 0,
      details: {}
    };
    
    for (const skillName of skillNames) {
      const usageData = usageDataMap[skillName] || {};
      const result = this.optimizeSkill(skillName, usageData);
      
      results.details[skillName] = result;
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
      }
    }
    
    return results;
  }

  /**
   * 获取技能优化历史
   * @param {string} skillName - 技能名称
   * @returns {Array} 优化历史
   */
  getSkillOptimizationHistory(skillName) {
    const history = [];
    
    for (const [key, record] of this.optimizationHistory) {
      if (record.skillName === skillName) {
        history.push(record);
      }
    }
    
    history.sort((a, b) => b.timestamp - a.timestamp);
    return history;
  }

  /**
   * 生成优化报告
   * @returns {Object} 优化报告
   */
  generateOptimizationReport() {
    const report = {
      totalOptimizations: this.optimizationHistory.size,
      optimizationsBySkill: {},
      successRate: 0,
      mostOptimizedSkills: [],
      timestamp: Date.now()
    };
    
    let successfulOptimizations = 0;
    
    for (const [key, record] of this.optimizationHistory) {
      if (!report.optimizationsBySkill[record.skillName]) {
        report.optimizationsBySkill[record.skillName] = 0;
      }
      report.optimizationsBySkill[record.skillName]++;
      
      if (record.changes) {
        successfulOptimizations++;
      }
    }
    
    report.successRate = this.optimizationHistory.size > 0 ? 
      successfulOptimizations / this.optimizationHistory.size : 0;
    
    // 按优化次数排序
    const skillOptimizations = Object.entries(report.optimizationsBySkill)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);
    report.mostOptimizedSkills = skillOptimizations.slice(0, 10);
    
    return report;
  }

  /**
   * 清理优化历史
   * @param {number} days - 保留天数
   */
  cleanupOptimizationHistory(days = 90) {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    const keysToDelete = [];
    for (const [key, record] of this.optimizationHistory) {
      if (record.timestamp < cutoffTime) {
        keysToDelete.push(key);
      }
    }
    
    for (const key of keysToDelete) {
      this.optimizationHistory.delete(key);
      cleanedCount++;
    }
    
    if (cleanedCount > 0) {
      this.saveOptimizationHistory();
      console.log(`清理了 ${cleanedCount} 条优化历史记录`);
    }
  }

  /**
   * 导出优化数据
   * @param {string} filePath - 导出文件路径
   */
  exportOptimizationData(filePath) {
    try {
      const data = {
        optimizationHistory: Object.fromEntries(this.optimizationHistory),
        report: this.generateOptimizationReport(),
        exportedAt: Date.now()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`优化数据导出成功: ${filePath}`);
    } catch (error) {
      console.error(`导出优化数据失败: ${error.message}`);
    }
  }

  /**
   * 导入优化数据
   * @param {string} filePath - 导入文件路径
   */
  importOptimizationData(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (data.optimizationHistory) {
        this.optimizationHistory = new Map(Object.entries(data.optimizationHistory));
        this.saveOptimizationHistory();
        console.log(`优化数据导入成功: ${filePath}`);
      }
    } catch (error) {
      console.error(`导入优化数据失败: ${error.message}`);
    }
  }
}

// 导出模块
module.exports = {
  SkillOptimizer
};
