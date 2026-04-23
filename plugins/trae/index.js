/**
 * trae 插件
 * Lossless Superpower 的 trae CN 插件
 */

class TraePlugin {
  constructor() {
    this.name = 'trae';
    this.version = '1.0.0';
    this.description = 'Trae plugin for Lossless Superpower';
    this.intelligentTrigger = null;
    this.skillTrigger = null;
  }

  /**
   * 初始化插件
   * @param {Object} context - 插件上下文
   * @returns {boolean} 初始化是否成功
   */
  init(context) {
    console.log('trae 插件初始化');
    this.context = context;

    // 延迟加载智能触发系统和技能触发器
    try {
      this.intelligentTrigger = require('../../src/superpowers/intelligent_trigger').intelligentTrigger;
      this.skillTrigger = require('../../src/superpowers/skill_trigger').skillTrigger;
      console.log('智能触发系统和技能触发器已加载');
    } catch (error) {
      console.error('加载系统模块失败:', error.message);
    }

    return true;
  }

  /**
   * 获取插件信息
   * @returns {Object} 插件信息
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      skills: this.getSkills()
    };
  }

  /**
   * 获取插件提供的技能列表
   * @returns {Array} 技能列表
   */
  getSkills() {
    return [
      {
        name: '智能触发技能',
        key: 'intelligent_trigger_skill',
        description: '当AI认为任务完成时，主动触发此技能，智能分析任务并决定是否触发其他技能',
        patterns: ['智能触发', '自动触发', '触发分析', '技能触发', '智能分析', '任务完成', '任务分析'],
        autoTrigger: true
      },
      {
        name: '任务记录技能',
        key: 'task_recorder',
        description: '在任务完成时触发，记录任务信息，总结经验教训',
        patterns: ['记录任务', '任务记录', '任务管理'],
        autoTrigger: true
      }
    ];
  }

  /**
   * 执行插件功能
   * @param {string} action - 动作名称
   * @param {Object} params - 动作参数
   * @returns {Object} 执行结果
   */
  async execute(action, params = {}) {
    console.log(`trae 插件执行动作: ${action}`, params);

    switch (action) {
      case 'trae_iterations':
        return this.traeIterations(params);
      case 'generate_reports':
        return this.generateReports(params);
      case 'task_completed':
        return await this.handleTaskCompleted(params);
      case 'trigger_skill':
        return await this.handleTriggerSkill(params);
      case 'get_skills':
        return this.getSkills();
      default:
        return {
          success: false,
          error: `未知动作: ${action}`
        };
    }
  }

  /**
   * 处理技能触发
   * @param {Object} params - 参数
   * @returns {Object} 执行结果
   */
  async handleTriggerSkill(params) {
    console.log('处理技能触发', params);

    try {
      const { skillName, taskInfo, taskResult } = params;

      if (skillName === 'intelligent_trigger_skill') {
        // 触发智能触发技能
        if (this.intelligentTrigger) {
          await this.intelligentTrigger.analyzeTaskCompletion(
            taskInfo || params,
            taskResult || { success: true },
            { source: 'trae' }
          );
          console.log('智能触发技能已执行');
        }
        return {
          success: true,
          message: '智能触发技能执行成功'
        };
      } else if (skillName === 'task_recorder') {
        // 触发任务记录技能
        if (this.skillTrigger) {
          const result = await this.skillTrigger.triggerSkill({
            skillName: 'task_recorder',
            params: { taskInfo, taskResult }
          });
          console.log('任务记录技能已执行:', result);
        }
        return {
          success: true,
          message: '任务记录技能执行成功'
        };
      } else {
        return {
          success: false,
          error: `未知技能: ${skillName}`
        };
      }
    } catch (error) {
      console.error('处理技能触发失败:', error.message);
      return {
        success: false,
        error: `处理技能触发失败: ${error.message}`
      };
    }
  }

  /**
   * 处理任务完成
   * @param {Object} params - 参数
   * @returns {Object} 执行结果
   */
  async handleTaskCompleted(params) {
    console.log('处理任务完成事件', params);

    try {
      // 触发智能触发技能
      if (this.intelligentTrigger) {
        await this.intelligentTrigger.analyzeTaskCompletion(
          params.taskInfo || params,
          params.taskResult || { success: true },
          { source: 'trae' }
        );
        console.log('智能触发技能已执行');
      }

      return {
        success: true,
        message: '任务完成处理成功',
        data: {
          taskId: params.taskInfo?.id || params.id,
          taskName: params.taskInfo?.name || params.name,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('处理任务完成失败:', error.message);
      return {
        success: false,
        error: `处理任务完成失败: ${error.message}`
      };
    }
  }

  /**
   * 追踪迭代
   * @param {Object} params - 参数
   * @returns {Object} 执行结果
   */
  traeIterations(params) {
    console.log('追踪迭代', params);
    return {
      success: true,
      message: '迭代追踪成功',
      data: {
        iterations: [],
        timestamp: Date.now()
      }
    };
  }

  /**
   * 生成报告
   * @param {Object} params - 参数
   * @returns {Object} 执行结果
   */
  generateReports(params) {
    console.log('生成报告', params);
    return {
      success: true,
      message: '报告生成成功',
      data: {
        reportPath: 'reports/report.html',
        timestamp: Date.now()
      }
    };
  }

  /**
   * 清理插件资源
   */
  cleanup() {
    console.log('trae 插件清理');
  }

  /**
   * 运行插件
   * @param {Object} options - 运行选项
   * @returns {Object} 运行结果
   */
  run(options = {}) {
    console.log('trae 插件运行', options);
    return {
      success: true,
      message: '插件运行成功',
      data: {
        plugin: this.name,
        version: this.version,
        timestamp: Date.now()
      }
    };
  }
}

// 创建插件实例
const traePlugin = new TraePlugin();

// 导出插件对象，确保具有run函数
module.exports = {
  initialize: function(config) {
    return traePlugin.init(config);
  },
  run: function(options) {
    return traePlugin.run(options);
  },
  execute: function(action, params) {
    return traePlugin.execute(action, params);
  },
  getInfo: function() {
    return traePlugin.getInfo();
  },
  getSkills: function() {
    return traePlugin.getSkills();
  },
  cleanup: function() {
    return traePlugin.cleanup();
  }
};