/**
 * 技能安全扫描器
 * 实现Hermes风格的安全扫描和信任等级体系
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SkillSecurityScanner {
  /**
   * 安全扫描器
   * @param {Object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = {
      enableDeepScan: config.enableDeepScan !== false,
      checkPromptInjection: config.checkPromptInjection !== false,
      checkDataLeakage: config.checkDataLeakage !== false,
      checkDestructiveCommands: config.checkDestructiveCommands !== false,
      ...config
    };

    this.trustLevels = {
      builtin: { level: 0, name: 'Builtin', description: '系统内置技能' },
      official: { level: 1, name: 'Official', description: '官方审核通过' },
      trusted: { level: 2, name: 'Trusted', description: '可信注册表' },
      community: { level: 3, name: 'Community', description: '社区贡献' }
    };

    this.risks = {
      critical: { level: 0, name: 'Critical', description: '严重风险' },
      high: { level: 1, name: 'High', description: '高风险' },
      medium: { level: 2, name: 'Medium', description: '中等风险' },
      low: { level: 3, name: 'Low', description: '低风险' },
      info: { level: 4, name: 'Info', description: '信息' }
    };
  }

  /**
   * 扫描技能安全性
   * @param {Object} skill - 技能对象
   * @returns {Object} 扫描报告
   */
  scanSkill(skill) {
    const report = {
      skillId: skill.id || skill.name,
      skillName: skill.name,
      timestamp: Date.now(),
      trustLevel: this._determineInitialTrustLevel(skill),
      risks: [],
      warnings: [],
      passed: [],
      overallRisk: 'low',
      canPublish: true,
      scanDetails: {}
    };

    if (!skill.content && !skill.body) {
      report.risks.push({
        type: 'missing_content',
        severity: 'high',
        message: '技能内容为空'
      });
      report.canPublish = false;
      return report;
    }

    const content = skill.content || skill.body;

    // 1. 检查提示注入
    if (this.config.checkPromptInjection) {
      report.scanDetails.promptInjection = this._checkPromptInjection(content);
      if (report.scanDetails.promptInjection.hasRisk) {
        report.risks.push(...report.scanDetails.promptInjection.risks);
      }
    }

    // 2. 检查数据泄露
    if (this.config.checkDataLeakage) {
      report.scanDetails.dataLeakage = this._checkDataLeakage(content, skill);
      if (report.scanDetails.dataLeakage.hasRisk) {
        report.risks.push(...report.scanDetails.dataLeakage.risks);
      }
    }

    // 3. 检查破坏性命令
    if (this.config.checkDestructiveCommands) {
      report.scanDetails.destructiveCommands = this._checkDestructiveCommands(content);
      if (report.scanDetails.destructiveCommands.hasRisk) {
        report.warnings.push(...report.scanDetails.destructiveCommands.warnings);
      }
    }

    // 4. 检查供应链信号
    report.scanDetails.supplyChain = this._checkSupplyChain(skill);
    if (report.scanDetails.supplyChain.hasRisk) {
      report.warnings.push(...report.scanDetails.supplyChain.warnings);
    }

    // 5. 检查代码质量
    if (this.config.enableDeepScan) {
      report.scanDetails.codeQuality = this._checkCodeQuality(content);
      if (report.scanDetails.codeQuality.warnings.length > 0) {
        report.warnings.push(...report.scanDetails.codeQuality.warnings);
      }
    }

    // 确定整体风险等级
    report.overallRisk = this._determineOverallRisk(report.risks);
    report.canPublish = !report.risks.some(r => 
      r.severity === 'critical' || r.severity === 'high');

    return report;
  }

  /**
   * 批量扫描技能
   * @param {Array} skills - 技能列表
   * @returns {Array} 扫描报告列表
   */
  scanSkills(skills) {
    return skills.map(skill => this.scanSkill(skill));
  }

  /**
   * 生成信任等级
   * @param {Object} skill - 技能对象
   * @param {Object} publisherInfo - 发布者信息
   * @returns {string} 信任等级
   */
  generateTrustLevel(skill, publisherInfo = {}) {
    let level = 'community';

    // 内置技能
    if (skill.metadata?.isBuiltin || skill.builtin) {
      level = 'builtin';
    }
    // 官方审核通过
    else if (skill.metadata?.verified || publisherInfo.verified) {
      level = 'official';
    }
    // 可信注册表
    else if (skill.metadata?.fromRegistry || publisherInfo.fromTrustedRegistry) {
      level = 'trusted';
    }

    return level;
  }

  /**
   * 获取风险摘要
   * @param {Object} report - 扫描报告
   * @returns {Object} 风险摘要
   */
  getRiskSummary(report) {
    return {
      totalRisks: report.risks.length,
      totalWarnings: report.warnings.length,
      criticalCount: report.risks.filter(r => r.severity === 'critical').length,
      highCount: report.risks.filter(r => r.severity === 'high').length,
      mediumCount: report.risks.filter(r => r.severity === 'medium').length,
      lowCount: report.risks.filter(r => r.severity === 'low').length,
      overallRisk: report.overallRisk,
      canPublish: report.canPublish
    };
  }

  /**
   * 生成修复建议
   * @param {Object} report - 扫描报告
   * @returns {Array} 修复建议
   */
  generateFixSuggestions(report) {
    const suggestions = [];

    for (const risk of report.risks) {
      switch (risk.type) {
        case 'prompt_injection':
          suggestions.push({
            risk: risk.type,
            suggestion: '移除或转义可疑的提示注入模式，避免模型被恶意引导'
          });
          break;
        case 'data_leakage':
          suggestions.push({
            risk: risk.type,
            suggestion: '移除或替换敏感信息，使用环境变量代替'
          });
          break;
        case 'destructive_command':
          suggestions.push({
            risk: risk.type,
            suggestion: '添加安全确认机制，避免意外执行破坏性操作'
          });
          break;
        case 'missing_content':
          suggestions.push({
            risk: risk.type,
            suggestion: '添加完整的技能内容，包括描述、指令和示例'
          });
          break;
      }
    }

    return suggestions;
  }

  /**
   * 检查提示注入
   * @param {string} content - 内容
   * @returns {Object} 检查结果
   * @private
   */
  _checkPromptInjection(content) {
    const result = {
      hasRisk: false,
      risks: []
    };

    // 常见的提示注入模式
    const injectionPatterns = [
      { pattern: /ignore.*previous.*instructions/i, risk: '试图忽略之前指令' },
      { pattern: /disregard.*all.*previous/i, risk: '试图忽略所有之前内容' },
      { pattern: /forget.*instructions/i, risk: '试图忘记指令' },
      { pattern: /you.*are.*now.*/i, risk: '试图改变角色' },
      { pattern: /pretend.*you.*are/i, risk: '试图扮演其他角色' },
      { pattern: /system.*prompt/i, risk: '试图访问系统提示' },
      { pattern: /#\s*roleplay/i, risk: '角色扮演指令' },
      { pattern: /<\s*system\s*>/i, risk: '注入系统标签' },
      { pattern: /\[\s*INST\s*\]/i, risk: '指令注入' },
      { pattern: /\{\{\{.*\}\}\}/i, risk: '模板注入' }
    ];

    for (const { pattern, risk } of injectionPatterns) {
      if (pattern.test(content)) {
        result.hasRisk = true;
        result.risks.push({
          type: 'prompt_injection',
          severity: 'high',
          message: risk,
          pattern: pattern.source
        });
      }
    }

    return result;
  }

  /**
   * 检查数据泄露
   * @param {string} content - 内容
   * @param {Object} skill - 技能对象
   * @returns {Object} 检查结果
   * @private
   */
  _checkDataLeakage(content, skill) {
    const result = {
      hasRisk: false,
      risks: []
    };

    // 敏感信息模式
    const sensitivePatterns = [
      { pattern: /api[_-]?key\s*[=:]\s*['"]?[\w-]{20,}/i, risk: '可能包含API密钥' },
      { pattern: /password\s*[=:]\s*['"]?[^\s'"]+/i, risk: '可能包含密码' },
      { pattern: /secret\s*[=:]\s*['"]?[^\s'"]+/i, risk: '可能包含密钥' },
      { pattern: /token\s*[=:]\s*['"]?[\w-]{20,}/i, risk: '可能包含令牌' },
      { pattern: /sk-[a-zA-Z0-9]{20,}/i, risk: '可能包含OpenAI密钥' },
      { pattern: /ghp_[a-zA-Z0-9]{36}/i, risk: '可能包含GitHub令牌' },
      { pattern: /-----BEGIN.*PRIVATE KEY-----/i, risk: '可能包含私钥' }
    ];

    for (const { pattern, risk } of sensitivePatterns) {
      if (pattern.test(content)) {
        result.hasRisk = true;
        result.risks.push({
          type: 'data_leakage',
          severity: 'critical',
          message: risk,
          pattern: pattern.source
        });
      }
    }

    // 检查是否有环境变量使用不当
    if (/\$\{?[A-Z_]+\}?/.test(content)) {
      const envVars = content.match(/\$\{?[A-Z_][A-Z0-9_]*\}?/g);
      const uniqueEnvVars = [...new Set(envVars)];
      const missingPlaceholder = uniqueEnvVars.filter(v => 
        !skill.prerequisites?.required_environment_variables?.includes(v.replace(/[\$\{\}]/g, ''))
      );

      if (missingPlaceholder.length > 0) {
        result.warnings = result.warnings || [];
        result.warnings.push({
          type: 'environment_variable',
          severity: 'low',
          message: `使用了环境变量但未在 prerequisites 中声明: ${missingPlaceholder.join(', ')}`
        });
      }
    }

    return result;
  }

  /**
   * 检查破坏性命令
   * @param {string} content - 内容
   * @returns {Object} 检查结果
   * @private
   */
  _checkDestructiveCommands(content) {
    const result = {
      hasRisk: false,
      warnings: []
    };

    // 破坏性命令模式
    const destructivePatterns = [
      { pattern: /rm\s+-rf\s+\//i, risk: '根目录递归删除', severity: 'critical' },
      { pattern: /rm\s+-rf\s+\*\s/i, risk: '递归删除当前目录', severity: 'high' },
      { pattern: /format\s+[a-z]:/i, risk: '格式化驱动器', severity: 'critical' },
      { pattern: /del\s+\/f\s+\/s\s+\/q/i, risk: '强制删除文件', severity: 'medium' },
      { pattern: /dd\s+if=.*of=\/dev\//i, risk: '直接写入设备', severity: 'high' },
      { pattern: /shutdown\s+-h\s+now/i, risk: '立即关机', severity: 'medium' },
      { pattern: /halt/i, risk: '系统停止', severity: 'medium' },
      { pattern: /reboot/i, risk: '系统重启', severity: 'medium' },
      { pattern: /mv\s+.*\s+\/dev\/null/i, risk: '移动到空设备', severity: 'medium' },
      { pattern: />\s*\/\s*dev\/null/i, risk: '重定向到空设备', severity: 'low' }
    ];

    for (const { pattern, risk, severity } of destructivePatterns) {
      if (pattern.test(content)) {
        result.hasRisk = true;
        result.warnings.push({
          type: 'destructive_command',
          severity,
          message: risk,
          pattern: pattern.source
        });
      }
    }

    return result;
  }

  /**
   * 检查供应链信号
   * @param {Object} skill - 技能对象
   * @returns {Object} 检查结果
   * @private
   */
  _checkSupplyChain(skill) {
    const result = {
      hasRisk: false,
      warnings: []
    };

    // 检查是否有外部依赖声明
    if (skill.metadata?.dependencies) {
      result.warnings.push({
        type: 'external_dependency',
        severity: 'info',
        message: `技能依赖外部包: ${skill.metadata.dependencies.join(', ')}`
      });
    }

    // 检查是否来自可信源
    if (!skill.metadata?.fromRegistry && !skill.metadata?.verified) {
      result.warnings.push({
        type: 'unverified_source',
        severity: 'low',
        message: '技能未经验证，建议通过官方渠道审核'
      });
    }

    return result;
  }

  /**
   * 检查代码质量
   * @param {string} content - 内容
   * @returns {Object} 检查结果
   * @private
   */
  _checkCodeQuality(content) {
    const result = {
      warnings: []
    };

    // 检查代码块比例
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const totalLines = content.split('\n').length;
    if (totalLines > 20 && codeBlocks === 0) {
      result.warnings.push({
        type: 'no_examples',
        severity: 'low',
        message: '技能内容较长但没有代码示例，建议添加示例'
      });
    }

    // 检查是否有TODO
    if (/TODO|FIXME|XXX|HACK/.test(content)) {
      result.warnings.push({
        type: 'incomplete_code',
        severity: 'info',
        message: '技能包含未完成的代码标记'
      });
    }

    return result;
  }

  /**
   * 确定初始信任等级
   * @param {Object} skill - 技能对象
   * @returns {string} 信任等级
   * @private
   */
  _determineInitialTrustLevel(skill) {
    return this.generateTrustLevel(skill);
  }

  /**
   * 确定整体风险等级
   * @param {Array} risks - 风险列表
   * @returns {string} 风险等级
   * @private
   */
  _determineOverallRisk(risks) {
    if (risks.some(r => r.severity === 'critical')) return 'critical';
    if (risks.some(r => r.severity === 'high')) return 'high';
    if (risks.some(r => r.severity === 'medium')) return 'medium';
    return 'low';
  }
}

module.exports = { SkillSecurityScanner };