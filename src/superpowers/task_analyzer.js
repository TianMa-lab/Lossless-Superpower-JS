/**
 * 任务轨迹分析器
 * 实现Hermes风格的"程序记忆"，从任务经验中自动生成技能建议
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class TaskAnalyzer {
  /**
   * 任务分析器
   * @param {Object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = {
      complexTaskThreshold: config.complexTaskThreshold || 5, // 复杂任务阈值(工具调用数)
      maxTrajectoryLength: config.maxTrajectoryLength || 100,
      analysisDir: config.analysisDir || './task_analysis',
      enableAutoTrigger: config.enableAutoTrigger !== false,
      ...config
    };

    this.trajectories = new Map();
    this.skillSuggestions = [];
    this.loadTrajectories();
  }

  /**
   * 记录任务轨迹
   * @param {Object} task - 任务对象
   */
  recordTaskTrajectory(task) {
    const trajectory = {
      id: task.id || this._generateId(),
      name: task.name || 'unnamed_task',
      startTime: task.startTime || Date.now(),
      endTime: task.endTime || Date.now(),
      status: task.status || 'unknown',
      toolCalls: task.toolCalls || [],
      errors: task.errors || [],
      userFeedback: task.userFeedback || null,
      context: task.context || {},
      createdAt: Date.now()
    };

    this.trajectories.set(trajectory.id, trajectory);
    this.saveTrajectories();

    // 如果满足自动触发条件，生成技能建议
    if (this.config.enableAutoTrigger) {
      this._checkAndTriggerAnalysis(trajectory);
    }

    return trajectory;
  }

  /**
   * 分析成功任务
   * @param {string} trajectoryId - 轨迹ID
   * @returns {Object} 分析结果
   */
  analyzeTaskSuccess(trajectoryId) {
    const trajectory = this.trajectories.get(trajectoryId);
    if (!trajectory) {
      return { success: false, error: 'Trajectory not found' };
    }

    if (trajectory.status !== 'success') {
      return { success: false, error: 'Task was not successful' };
    }

    const analysis = {
      trajectoryId,
      taskName: trajectory.name,
      analysisType: 'success',
      timestamp: Date.now(),
      complexity: trajectory.toolCalls.length,
      isComplex: trajectory.toolCalls.length >= this.config.complexTaskThreshold,
      workflow: this._extractWorkflow(trajectory),
      keyPatterns: this._extractPatterns(trajectory),
      prerequisites: this._extractPrerequisites(trajectory),
      potentialSkill: null
    };

    // 如果是复杂任务，生成技能建议
    if (analysis.isComplex) {
      analysis.potentialSkill = this._generateSkillFromAnalysis(analysis, trajectory);
      this.skillSuggestions.push(analysis.potentialSkill);
    }

    return analysis;
  }

  /**
   * 分析失败任务
   * @param {string} trajectoryId - 轨迹ID
   * @returns {Object} 分析结果
   */
  analyzeTaskFailure(trajectoryId) {
    const trajectory = this.trajectories.get(trajectoryId);
    if (!trajectory) {
      return { success: false, error: 'Trajectory not found' };
    }

    const analysis = {
      trajectoryId,
      taskName: trajectory.name,
      analysisType: 'failure',
      timestamp: Date.now(),
      errors: trajectory.errors,
      failedAt: this._extractFailedAt(trajectory),
      recoveryPath: this._extractRecoveryPath(trajectory),
      rootCauses: this._extractRootCauses(trajectory),
      potentialFixSkill: null
    };

    // 如果找到恢复路径，生成修复技能建议
    if (analysis.recoveryPath) {
      analysis.potentialFixSkill = this._generateFixSkillFromAnalysis(analysis, trajectory);
      this.skillSuggestions.push(analysis.potentialFixSkill);
    }

    return analysis;
  }

  /**
   * 从用户纠正中学习
   * @param {string} trajectoryId - 轨迹ID
   * @param {string} correction - 用户纠正内容
   * @returns {Object} 学习结果
   */
  learnFromCorrection(trajectoryId, correction) {
    const trajectory = this.trajectories.get(trajectoryId);
    if (!trajectory) {
      return { success: false, error: 'Trajectory not found' };
    }

    trajectory.userFeedback = correction;
    this.trajectories.set(trajectoryId, trajectory);
    this.saveTrajectories();

    const learning = {
      trajectoryId,
      correction,
      timestamp: Date.now(),
      learnedPatterns: this._extractPatternsFromCorrection(correction, trajectory),
      potentialSkill: null
    };

    if (learning.learnedPatterns.length > 0) {
      learning.potentialSkill = this._generateSkillFromCorrection(learning, trajectory);
      this.skillSuggestions.push(learning.potentialSkill);
    }

    return learning;
  }

  /**
   * 提取技能建议
   * @param {Object} options - 选项
   * @returns {Array} 技能建议列表
   */
  getSkillSuggestions(options = {}) {
    let suggestions = [...this.skillSuggestions];

    if (options.type) {
      suggestions = suggestions.filter(s => s.type === options.type);
    }

    if (options.minConfidence) {
      suggestions = suggestions.filter(s => s.confidence >= options.minConfidence);
    }

    if (options.limit) {
      suggestions = suggestions.slice(0, options.limit);
    }

    return suggestions;
  }

  /**
   * 清除旧的建议
   * @param {number} olderThan - 清除早于此时间的建议（毫秒）
   */
  clearOldSuggestions(olderThan = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - olderThan;
    this.skillSuggestions = this.skillSuggestions.filter(s => s.createdAt > cutoff);
  }

  /**
   * 获取任务统计
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const trajectories = Array.from(this.trajectories.values());
    
    return {
      totalTasks: trajectories.length,
      successfulTasks: trajectories.filter(t => t.status === 'success').length,
      failedTasks: trajectories.filter(t => t.status === 'failure').length,
      complexTasks: trajectories.filter(t => t.toolCalls.length >= this.config.complexTaskThreshold).length,
      totalToolCalls: trajectories.reduce((sum, t) => sum + t.toolCalls.length, 0),
      skillSuggestionsCount: this.skillSuggestions.length,
      averageComplexity: trajectories.length > 0 
        ? trajectories.reduce((sum, t) => sum + t.toolCalls.length, 0) / trajectories.length 
        : 0
    };
  }

  /**
   * 检查是否满足自动分析条件并触发
   * @param {Object} trajectory - 轨迹对象
   * @private
   */
  _checkAndTriggerAnalysis(trajectory) {
    if (trajectory.status === 'success' && 
        trajectory.toolCalls.length >= this.config.complexTaskThreshold) {
      // 复杂任务成功，自动分析
      this.analyzeTaskSuccess(trajectory.id);
    } else if (trajectory.status === 'failure' && trajectory.errors.length > 0) {
      // 任务失败，自动分析
      this.analyzeTaskFailure(trajectory.id);
    }
  }

  /**
   * 提取工作流
   * @param {Object} trajectory - 轨迹对象
   * @returns {Array} 工作流步骤
   * @private
   */
  _extractWorkflow(trajectory) {
    return trajectory.toolCalls.map((call, index) => ({
      step: index + 1,
      tool: call.tool,
      args: call.args,
      result: call.result ? this._summarizeResult(call.result) : null,
      timestamp: call.timestamp
    }));
  }

  /**
   * 提取模式
   * @param {Object} trajectory - 轨迹对象
   * @returns {Array} 模式列表
   * @private
   */
  _extractPatterns(trajectory) {
    const patterns = [];
    const tools = trajectory.toolCalls.map(c => c.tool);

    // 检测顺序模式
    for (let i = 0; i < tools.length - 1; i++) {
      patterns.push({
        type: 'sequence',
        pattern: `${tools[i]} -> ${tools[i + 1]}`,
        frequency: 1
      });
    }

    // 检测循环模式
    for (let i = 0; i < tools.length - 2; i++) {
      if (tools[i] === tools[i + 2] && tools[i] !== tools[i + 1]) {
        patterns.push({
          type: 'loop',
          pattern: `${tools[i]} -> ${tools[i + 1]} -> ${tools[i]}`,
          frequency: 1
        });
      }
    }

    return patterns;
  }

  /**
   * 提取前置条件
   * @param {Object} trajectory - 轨迹对象
   * @returns {Object} 前置条件
   * @private
   */
  _extractPrerequisites(trajectory) {
    const prerequisites = {
      tools: [],
      environment: [],
      files: []
    };

    for (const call of trajectory.toolCalls) {
      if (call.args) {
        if (call.args.file || call.args.path) {
          prerequisites.files.push(call.args.file || call.args.path);
        }
      }
      prerequisites.tools.push(call.tool);
    }

    return {
      requiredTools: [...new Set(prerequisites.tools)],
      requiredFiles: [...new Set(prerequisites.files)],
      environmentVariables: trajectory.context?.envVars || []
    };
  }

  /**
   * 生成技能建议
   * @param {Object} analysis - 分析结果
   * @param {Object} trajectory - 轨迹对象
   * @returns {Object} 技能建议
   * @private
   */
  _generateSkillFromAnalysis(analysis, trajectory) {
    return {
      id: this._generateId(),
      type: 'workflow',
      name: this._generateSkillName(analysis.taskName),
      description: this._generateDescription(analysis),
      workflow: analysis.workflow,
      patterns: analysis.keyPatterns,
      prerequisites: analysis.prerequisites,
      confidence: Math.min(0.9, 0.5 + (analysis.complexity * 0.05)),
      source: 'task_analysis',
      sourceTrajectory: trajectory.id,
      createdAt: Date.now(),
      metadata: {
        analysisType: 'success',
        complexity: analysis.complexity,
        isAutoGenerated: true
      }
    };
  }

  /**
   * 生成修复技能建议
   * @param {Object} analysis - 分析结果
   * @param {Object} trajectory - 轨迹对象
   * @returns {Object} 修复技能建议
   * @private
   */
  _generateFixSkillFromAnalysis(analysis, trajectory) {
    return {
      id: this._generateId(),
      type: 'fix',
      name: `fix_${analysis.taskName}_errors`,
      description: `自动修复 ${analysis.taskName} 相关错误的技能`,
      errorPatterns: analysis.rootCauses,
      recoveryPath: analysis.recoveryPath,
      confidence: 0.6,
      source: 'task_analysis',
      sourceTrajectory: trajectory.id,
      createdAt: Date.now(),
      metadata: {
        analysisType: 'failure',
        isAutoGenerated: true
      }
    };
  }

  /**
   * 从纠正中学习并生成技能
   * @param {Object} learning - 学习结果
   * @param {Object} trajectory - 轨迹对象
   * @returns {Object} 技能建议
   * @private
   */
  _generateSkillFromCorrection(learning, trajectory) {
    return {
      id: this._generateId(),
      type: 'correction',
      name: `corrected_${trajectory.name}`,
      description: `基于用户纠正优化的技能: ${learning.correction}`,
      learnedPatterns: learning.learnedPatterns,
      originalWorkflow: this._extractWorkflow(trajectory),
      confidence: 0.8,
      source: 'user_correction',
      sourceTrajectory: trajectory.id,
      createdAt: Date.now(),
      metadata: {
        correction: learning.correction,
        isAutoGenerated: true
      }
    };
  }

  /**
   * 提取失败点
   * @param {Object} trajectory - 轨迹对象
   * @returns {Object} 失败点信息
   * @private
   */
  _extractFailedAt(trajectory) {
    if (trajectory.errors.length === 0) return null;

    const lastError = trajectory.errors[trajectory.errors.length - 1];
    const failedCallIndex = trajectory.toolCalls.findIndex(
      c => c.tool === lastError.tool || c.result?.error
    );

    return {
      toolCallIndex: failedCallIndex >= 0 ? failedCallIndex : trajectory.toolCalls.length - 1,
      error: lastError,
      toolCall: trajectory.toolCalls[failedCallIndex] || null
    };
  }

  /**
   * 提取恢复路径
   * @param {Object} trajectory - 轨迹对象
   * @returns {Array|null} 恢复路径
   * @private
   */
  _extractRecoveryPath(trajectory) {
    if (trajectory.errors.length === 0) return null;

    const recoveryCalls = trajectory.toolCalls.filter(c => !c.result?.error);
    if (recoveryCalls.length === 0) return null;

    return recoveryCalls.map((call, index) => ({
      step: index + 1,
      tool: call.tool,
      args: call.args,
      timestamp: call.timestamp
    }));
  }

  /**
   * 提取根本原因
   * @param {Object} trajectory - 轨迹对象
   * @returns {Array} 根本原因列表
   * @private
   */
  _extractRootCauses(trajectory) {
    const causes = [];

    for (const error of trajectory.errors) {
      if (error.message) {
        if (error.message.includes('permission')) {
          causes.push('permission_denied');
        } else if (error.message.includes('not found') || error.message.includes('不存在')) {
          causes.push('resource_not_found');
        } else if (error.message.includes('timeout')) {
          causes.push('timeout');
        } else if (error.message.includes('invalid')) {
          causes.push('invalid_input');
        } else {
          causes.push('unknown_error');
        }
      }
    }

    return [...new Set(causes)];
  }

  /**
   * 从纠正中提取模式
   * @param {string} correction - 纠正内容
   * @param {Object} trajectory - 轨迹对象
   * @returns {Array} 模式列表
   * @private
   */
  _extractPatternsFromCorrection(correction, trajectory) {
    const patterns = [];

    // 简单的关键词检测
    const keywords = ['应该用', '不要用', '改用', '先用', '后用', '先', '后'];
    for (const keyword of keywords) {
      if (correction.includes(keyword)) {
        patterns.push({
          type: 'correction',
          keyword,
          context: correction
        });
      }
    }

    return patterns;
  }

  /**
   * 生成技能名称
   * @param {string} taskName - 任务名称
   * @returns {string} 技能名称
   * @private
   */
  _generateSkillName(taskName) {
    const cleaned = taskName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `auto_${cleaned}_workflow`;
  }

  /**
   * 生成描述
   * @param {Object} analysis - 分析结果
   * @returns {string} 描述
   * @private
   */
  _generateDescription(analysis) {
    const steps = analysis.workflow.length;
    const tools = [...new Set(analysis.workflow.map(w => w.tool))];
    return `自动生成的工作流技能，包含${steps}个步骤，使用${tools.join(', ')}等工具`;
  }

  /**
   * 总结结果
   * @param {any} result - 结果对象
   * @returns {string} 总结
   * @private
   */
  _summarizeResult(result) {
    if (typeof result === 'string') {
      return result.substring(0, 100);
    }
    if (result && result.error) {
      return `Error: ${result.error}`;
    }
    if (result && result.success !== undefined) {
      return result.success ? 'Success' : 'Failed';
    }
    return 'Completed';
  }

  /**
   * 生成唯一ID
   * @returns {string} ID
   * @private
   */
  _generateId() {
    return crypto.randomUUID();
  }

  /**
   * 加载轨迹数据
   * @private
   */
  loadTrajectories() {
    try {
      if (!fs.existsSync(this.config.analysisDir)) {
        fs.mkdirSync(this.config.analysisDir, { recursive: true });
        return;
      }

      const filePath = path.join(this.config.analysisDir, 'trajectories.json');
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.trajectories = new Map(Object.entries(data.trajectories || {}));
        this.skillSuggestions = data.skillSuggestions || [];
      }
    } catch (error) {
      console.error(`加载轨迹数据失败: ${error.message}`);
    }
  }

  /**
   * 保存轨迹数据
   * @private
   */
  saveTrajectories() {
    try {
      fs.mkdirSync(this.config.analysisDir, { recursive: true });
      const filePath = path.join(this.config.analysisDir, 'trajectories.json');
      const data = {
        trajectories: Object.fromEntries(this.trajectories),
        skillSuggestions: this.skillSuggestions
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`保存轨迹数据失败: ${error.message}`);
    }
  }
}

module.exports = { TaskAnalyzer };