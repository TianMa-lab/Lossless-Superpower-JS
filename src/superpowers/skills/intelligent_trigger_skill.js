/**
 * 智能触发技能
 * 当AI认为任务完成时，主动触发此技能，智能分析任务并决定是否触发其他技能
 */

const { intelligentTrigger } = require('../intelligent_trigger');

async function run(taskInfo, taskResult) {
  try {
    // 调用智能触发系统分析任务
    await intelligentTrigger.analyzeTaskCompletion(taskInfo, taskResult);

    // 获取分析结果
    const analysis = intelligentTrigger.analyzeTask(taskInfo, taskResult);

    // 获取触发历史
    const history = intelligentTrigger.getTriggerHistory(5);

    // 获取智能触发状态
    const status = intelligentTrigger.getStatus();

    return {
      success: true,
      message: '智能触发分析完成',
      data: {
        analysis: analysis,
        history: history,
        status: status
      }
    };
  } catch (error) {
    console.error('智能触发技能执行失败:', error.message);
    return {
      success: false,
      message: `智能触发技能执行失败: ${error.message}`
    };
  }
}

module.exports = {
  run
};
