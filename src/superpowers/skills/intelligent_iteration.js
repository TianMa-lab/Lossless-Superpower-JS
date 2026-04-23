/**
 * 智能迭代技能
 * 用于包装DAG-KG智能迭代系统
 */

const { intelligentIterationSystem } = require('../dag_kg_intelligent_iteration');
const { TaskRunner } = require('../task_runner');

async function runSkill(action) {
  /**
   * 执行智能迭代
   * @param {string} action - 操作类型
   * @returns {string} 执行结果
   */
  try {
    console.log(`执行智能迭代: ${action}`);
    
    switch (action) {
      case 'start':
        return await startIntelligentIteration();
      case 'stop':
        return await stopIntelligentIteration();
      case 'status':
        return await getIntelligentIterationStatus();
      case 'trigger_iteration':
        return await triggerManualIteration();
      case 'trigger_upgrade':
        return await triggerManualUpgrade();
      case 'history':
        return await getUpgradeHistory();
      default:
        return `未知操作类型: ${action}`;
    }
  } catch (error) {
    console.error(`智能迭代技能执行失败: ${error.message}`);
    return `智能迭代技能执行失败: ${error.message}`;
  }
}

async function startIntelligentIteration() {
  /**
   * 启动智能迭代系统
   */
  console.log('启动智能迭代系统...');
  
  await TaskRunner.runTask(
    'intelligent_iteration_start',
    '启动智能迭代系统',
    '启动DAG-KG智能迭代系统，开始自动分析和升级',
    async () => {
      await intelligentIterationSystem.start();
      return '智能迭代系统启动成功';
    },
    {
      storeInMemory: true,
      memoryImportance: 5,
      memoryTags: 'intelligent_iteration,system_start'
    }
  );
  
  return '智能迭代系统启动成功';
}

async function stopIntelligentIteration() {
  /**
   * 停止智能迭代系统
   */
  console.log('停止智能迭代系统...');
  
  await TaskRunner.runTask(
    'intelligent_iteration_stop',
    '停止智能迭代系统',
    '停止DAG-KG智能迭代系统',
    async () => {
      intelligentIterationSystem.stop();
      return '智能迭代系统停止成功';
    },
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'intelligent_iteration,system_stop'
    }
  );
  
  return '智能迭代系统停止成功';
}

async function getIntelligentIterationStatus() {
  /**
   * 获取智能迭代系统状态
   */
  console.log('获取智能迭代系统状态...');
  
  const status = intelligentIterationSystem.getStatus();
  
  await TaskRunner.runTask(
    'intelligent_iteration_status',
    '获取智能迭代系统状态',
    '获取DAG-KG智能迭代系统的当前状态',
    async () => {
      return JSON.stringify(status, null, 2);
    },
    {
      storeInMemory: true,
      memoryImportance: 3,
      memoryTags: 'intelligent_iteration,status'
    }
  );
  
  return `智能迭代系统状态:\n${JSON.stringify(status, null, 2)}`;
}

async function triggerManualIteration() {
  /**
   * 手动触发智能迭代
   */
  console.log('手动触发智能迭代...');
  
  await TaskRunner.runTask(
    'intelligent_iteration_manual',
    '手动触发智能迭代',
    '手动触发DAG-KG智能迭代系统执行一次迭代分析',
    async () => {
      const result = await intelligentIterationSystem.triggerManualIteration();
      return '手动迭代触发成功';
    },
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'intelligent_iteration,manual_trigger'
    }
  );
  
  return '手动迭代触发成功';
}

async function triggerManualUpgrade() {
  /**
   * 手动触发智能升级
   */
  console.log('手动触发智能升级...');
  
  await TaskRunner.runTask(
    'intelligent_upgrade_manual',
    '手动触发智能升级',
    '手动触发DAG-KG智能迭代系统执行一次智能升级',
    async () => {
      const result = await intelligentIterationSystem.triggerManualUpgrade();
      return '手动升级触发成功';
    },
    {
      storeInMemory: true,
      memoryImportance: 5,
      memoryTags: 'intelligent_iteration,manual_upgrade'
    }
  );
  
  return '手动升级触发成功';
}

async function getUpgradeHistory() {
  /**
   * 获取升级历史
   */
  console.log('获取升级历史...');
  
  const history = intelligentIterationSystem.getUpgradeHistory();
  
  await TaskRunner.runTask(
    'intelligent_iteration_history',
    '获取升级历史',
    '获取DAG-KG智能迭代系统的升级历史',
    async () => {
      return JSON.stringify(history, null, 2);
    },
    {
      storeInMemory: true,
      memoryImportance: 3,
      memoryTags: 'intelligent_iteration,history'
    }
  );
  
  return `升级历史:\n${JSON.stringify(history, null, 2)}`;
}

module.exports = {
  runSkill
};