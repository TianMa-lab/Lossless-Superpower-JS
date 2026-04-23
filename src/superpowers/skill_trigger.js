/**
 * 技能触发器
 * 用于分析用户输入并自动触发相应的技能
 */

const { fuzzyMatch } = require('./fuzzy_match');
const { taskTracker } = require('./task_tracker');
const { comprehensiveAutoRecorder } = require('./comprehensive_auto_recorder');

class SkillTrigger {
  constructor() {
    this.skillPatterns = {
      "dag_query": [
        "查询DAG",
        "查看DAG",
        "DAG查询",
        "查询事件",
        "查看事件",
        "事件查询",
        "查询记录",
        "查看记录",
        "记录查询"
      ],
      "iteration_recorder": [
        "记录迭代",
        "迭代记录",
        "记录变更",
        "变更记录",
        "记录改进",
        "改进记录"
      ],
      "intelligent_iteration": [
        "智能迭代",
        "自动迭代",
        "系统迭代",
        "启动迭代",
        "停止迭代",
        "迭代状态",
        "升级历史"
      ],
      "intelligent_trigger_skill": [
        "智能触发",
        "自动触发",
        "触发分析",
        "技能触发",
        "智能分析",
        "任务完成",
        "任务分析",
        "触发技能"
      ],
      "task_recorder": [
        "记录任务",
        "任务记录",
        "任务管理",
        "执行任务",
        "任务分析",
        "记录该次任务",
        "记录这次任务"
      ],
      "task_driven_dag_kg": [
        "任务驱动",
        "DAG-KG迭代",
        "知识提取",
        "DAG对齐",
        "DAG-KG对齐",
        "对齐",
        "完整迭代",
        "任务迭代",
        "任务驱动状态",
        "启动任务驱动",
        "停止任务驱动"
      ],
      "lesson_collector": [
        "收集教训",
        "教训收集",
        "总结经验",
        "经验总结",
        "记录教训",
        "教训记录"
      ],
      "self_introspection": [
        "自我反思",
        "反思自我",
        "自我评估",
        "评估自我",
        "自我分析",
        "分析自我",
        "深刻自省",
        "系统自省",
        "自我检查",
        "检查自我"
      ]
    };
  }

  /**
   * 分析用户输入，识别需要触发的技能
   * @param {string} userInput - 用户输入
   * @returns {Object|null} 技能信息字典，包含技能名称和参数
   */
  analyzeInput(userInput) {
    const userInputLower = userInput.toLowerCase();
    
    // 1. 关键词匹配
    for (const [skillName, patterns] of Object.entries(this.skillPatterns)) {
      for (const pattern of patterns) {
        if (userInputLower.includes(pattern.toLowerCase())) {
          // 提取参数
          const params = this._extractParams(skillName, userInput);
          return {
            skillName: skillName,
            params: params
          };
        }
      }
    }
    
    // 2. 模糊匹配
    let bestMatch = null;
    let bestScore = 0.6; // 相似度阈值
    
    for (const [skillName, patterns] of Object.entries(this.skillPatterns)) {
      for (const pattern of patterns) {
        const score = fuzzyMatch(userInput, pattern);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = skillName;
        }
      }
    }
    
    if (bestMatch) {
      const params = this._extractParams(bestMatch, userInput);
      console.log(`通过模糊匹配识别技能: ${bestMatch}，相似度: ${bestScore.toFixed(2)}`);
      return {
        skillName: bestMatch,
        params: params
      };
    }
    
    return null;
  }

  /**
   * 提取技能参数
   * @param {string} skillName - 技能名称
   * @param {string} userInput - 用户输入
   * @returns {Object} 技能参数字典
   */
  _extractParams(skillName, userInput) {
    const params = {};
    
    if (skillName === "dag_query") {
      // 提取查询关键词
      const keywordMatch = userInput.match(/查询(.*?)的记录/);
      if (keywordMatch) {
        params.keyword = keywordMatch[1].trim();
      } else {
        // 尝试提取其他形式的关键词
        const keywordMatch2 = userInput.match(/查询(.*)/);
        if (keywordMatch2) {
          params.keyword = keywordMatch2[1].trim();
        } else {
          params.keyword = "";
        }
      }
    }
    
    return params;
  }

  _extractIntelligentIterationAction(userInput) {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('启动')) {
      return 'start';
    } else if (userInputLower.includes('停止')) {
      return 'stop';
    } else if (userInputLower.includes('状态')) {
      return 'status';
    } else if (userInputLower.includes('触发') && userInputLower.includes('迭代')) {
      return 'trigger_iteration';
    } else if (userInputLower.includes('触发') && userInputLower.includes('升级')) {
      return 'trigger_upgrade';
    } else if (userInputLower.includes('历史')) {
      return 'history';
    } else {
      return 'status';
    }
  }

  _extractTaskDrivenDAGKGAction(userInput) {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('启动')) {
      return 'start';
    } else if (userInputLower.includes('停止')) {
      return 'stop';
    } else if (userInputLower.includes('状态')) {
      return 'status';
    } else if (userInputLower.includes('知识提取')) {
      return 'extract_knowledge';
    } else if (userInputLower.includes('对齐') || userInputLower.includes('DAG对齐') || userInputLower.includes('DAG-KG对齐')) {
      return 'align_dag_kg';
    } else if (userInputLower.includes('完整迭代')) {
      return 'full_iteration';
    } else if (userInputLower.includes('添加任务')) {
      return 'add_task';
    } else {
      return 'status';
    }
  }

  /**
   * 触发技能
   * @param {Object} skillInfo - 技能信息字典
   * @returns {*} 技能执行结果
   */
  async triggerSkill(skillInfo) {
    const skillName = skillInfo.skillName;
    const params = skillInfo.params || {};
    
    try {
      let result;
      
      switch (skillName) {
        case "dag_query":
          // 导入并执行DAG查询技能
          try {
            const { dagQuerySkill } = require('./skills/dag_query');
            const action = params.action || "query";
            result = await dagQuerySkill(action, params);
          } catch (error) {
            result = "DAG查询技能未实现";
          }
          break;
        case "iteration_recorder":
          // 导入并执行迭代记录技能
          try {
            const { runSkill } = require('./skills/iteration_recorder');
            result = await runSkill("自动记录迭代");
          } catch (error) {
            result = "迭代记录技能未实现";
          }
          break;
        case "lesson_collector":
          // 导入并执行教训收集技能
          try {
            const { runSkill } = require('./skills/lesson_collector');
            result = await runSkill("检测经验教训");
          } catch (error) {
            result = "教训收集技能未实现";
          }
          break;
        case "intelligent_iteration":
          // 导入并执行智能迭代技能
          try {
            const { runSkill } = require('./skills/intelligent_iteration');
            const action = params.action || this._extractIntelligentIterationAction('状态');
            result = await runSkill(action);
          } catch (error) {
            result = "智能迭代技能未实现";
          }
          break;
        case "task_driven_dag_kg":
          // 导入并执行任务驱动的DAG-KG迭代技能
          try {
            const { runSkill } = require('./skills/task_driven_dag_kg_iteration');
            const action = params.action || this._extractTaskDrivenDAGKGAction('状态');
            result = await runSkill(action);
          } catch (error) {
            result = "任务驱动的DAG-KG迭代技能未实现";
          }
          break;
        case "self_introspection":
          // 导入并执行自我反思技能
          try {
            const { runSkill } = require('./skills/self_introspection');
            result = await runSkill("自我反思");
          } catch (error) {
            result = "自我反思技能未实现";
          }
          break;
        case "intelligent_trigger_skill":
          // 导入并执行智能触发技能
          try {
            const { run } = require('./skills/intelligent_trigger_skill');
            result = await run(params.taskInfo, params.taskResult);
          } catch (error) {
            result = "智能触发技能未实现";
          }
          break;
        case "task_recorder":
          // 导入并执行任务记录技能
          try {
            const { run } = require('./skills/task_recorder');
            // 传递默认的任务信息
            const defaultTaskInfo = {
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: '用户任务',
              description: '用户请求记录的任务',
              timestamp: Date.now()
            };
            result = await run(defaultTaskInfo, { success: true, message: '任务执行成功' });
          } catch (error) {
            result = `任务记录技能执行失败: ${error.message}`;
          }
          break;
        default:
          result = `未知技能: ${skillName}`;
      }
      
      console.log(`成功触发技能: ${skillName}，结果: ${result}`);
      return result;
    } catch (error) {
      console.error(`触发技能 ${skillName} 失败: ${error.message}`);
      return `触发技能失败: ${error.message}`;
    }
  }

  /**
   * 处理用户输入，自动触发相应的技能
   * @param {string} userInput - 用户输入
   * @returns {*} 技能执行结果
   */
  async processInput(userInput) {
    const startTime = Date.now();
    const taskId = `skill_trigger_${startTime}_${Math.random().toString(36).substr(2, 9)}`;

    taskTracker.startTask(
      taskId,
      '技能触发',
      userInput,
      { type: 'skill_trigger', userInput }
    );

    // 分析用户输入
    const skillInfo = this.analyzeInput(userInput);

    if (skillInfo) {
      // 触发技能
      const result = await this.triggerSkill(skillInfo);

      const duration = Date.now() - startTime;
      taskTracker.completeTask(
        taskId,
        `技能 ${skillInfo.skillName} 执行完成 (${duration}ms): ${result}`
      );

      // 记录相关文件变化
      setTimeout(() => {
        this.recordRelatedFileChanges(skillInfo);
      }, 2000);

      return result;
    } else {
      // 没有识别到技能
      taskTracker.completeTask(
        taskId,
        '未识别到需要触发的技能'
      );
      return "未识别到需要触发的技能";
    }
  }

  recordRelatedFileChanges(skillInfo) {
    try {
      comprehensiveAutoRecorder.pollForChanges();
    } catch (error) {
      console.error('[SkillTrigger] 记录文件变化失败:', error.message);
    }
  }
}

// 全局技能触发器实例
const skillTrigger = new SkillTrigger();

/**
 * 分析用户输入，识别需要触发的技能
 * @param {string} userInput - 用户输入
 * @returns {Object|null} 技能信息字典，包含技能名称和参数
 */
function analyzeInput(userInput) {
  return skillTrigger.analyzeInput(userInput);
}

/**
 * 触发技能
 * @param {Object} skillInfo - 技能信息字典
 * @returns {*} 技能执行结果
 */
async function triggerSkill(skillInfo) {
  return await skillTrigger.triggerSkill(skillInfo);
}

/**
 * 处理用户输入，自动触发相应的技能
 * @param {string} userInput - 用户输入
 * @returns {*} 技能执行结果
 */
async function processInput(userInput) {
  return await skillTrigger.processInput(userInput);
}

module.exports = {
  SkillTrigger,
  skillTrigger,
  analyzeInput,
  triggerSkill,
  processInput
};
