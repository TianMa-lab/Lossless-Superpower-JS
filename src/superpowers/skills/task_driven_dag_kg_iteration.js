/**
 * 任务驱动的DAG-KG提取与对齐技能
 * 以任务为核心，智能推进DAG-KG的提取、对齐与同步
 */

const { taskDrivenDAGKGIteration } = require('../task_driven_dag_kg_iteration');

async function runSkill(action) {
  /**
   * 执行任务驱动的DAG-KG提取与对齐
   * @param {string} action - 操作类型
   * @returns {string} 执行结果
   */
  try {
    console.log(`执行任务驱动的DAG-KG提取与对齐: ${action}`);
    
    switch (action) {
      case 'start':
        return await startTaskDrivenIteration();
      case 'stop':
        return await stopTaskDrivenIteration();
      case 'status':
        return await getTaskDrivenIterationStatus();
      case 'extract_knowledge':
        return await triggerKnowledgeExtraction();
      case 'align_dag_kg':
        return await triggerDAGKGAlignment();
      case 'full_iteration':
        return await triggerFullIteration();
      case 'add_task':
        return await addTask();
      default:
        return `未知操作类型: ${action}`;
    }
  } catch (error) {
    console.error(`任务驱动的DAG-KG提取与对齐技能执行失败: ${error.message}`);
    return `任务驱动的DAG-KG提取与对齐技能执行失败: ${error.message}`;
  }
}

async function startTaskDrivenIteration() {
  /**
   * 启动任务驱动的DAG-KG迭代系统
   */
  console.log('启动任务驱动的DAG-KG迭代系统...');
  
  await taskDrivenDAGKGIteration.start();
  
  return '任务驱动的DAG-KG迭代系统启动成功';
}

async function stopTaskDrivenIteration() {
  /**
   * 停止任务驱动的DAG-KG迭代系统
   */
  console.log('停止任务驱动的DAG-KG迭代系统...');
  
  taskDrivenDAGKGIteration.stop();
  
  return '任务驱动的DAG-KG迭代系统停止成功';
}

async function getTaskDrivenIterationStatus() {
  /**
   * 获取任务驱动的DAG-KG迭代系统状态
   */
  console.log('获取任务驱动的DAG-KG迭代系统状态...');
  
  const status = taskDrivenDAGKGIteration.getStatus();
  
  return `任务驱动的DAG-KG迭代系统状态:\n${JSON.stringify(status, null, 2)}`;
}

async function triggerKnowledgeExtraction() {
  /**
   * 触发知识提取任务
   */
  console.log('触发知识提取任务...');
  
  const testData = {
    text: 'DAG-KG集成是一个重要的系统，它能够智能提取知识并进行对齐和同步。',
    metadata: {
      source: 'user_input',
      timestamp: Date.now()
    }
  };
  
  const taskId = await taskDrivenDAGKGIteration.triggerKnowledgeExtraction(testData);
  
  return `知识提取任务已触发，任务ID: ${taskId}`;
}

async function triggerDAGKGAlignment() {
  /**
   * 触发DAG-KG对齐任务
   */
  console.log('触发DAG-KG对齐任务...');
  
  const taskId = taskDrivenDAGKGIteration.addTask({
    name: 'DAG-KG对齐任务',
    description: '执行DAG与知识图谱的智能对齐',
    type: 'align_dag_kg',
    priority: 'high',
    options: {
      confidenceThreshold: 0.7,
      batchSize: 100,
      useSemanticMatching: true
    }
  });
  
  return `DAG-KG对齐任务已触发，任务ID: ${taskId}`;
}

async function triggerFullIteration() {
  /**
   * 触发完整的DAG-KG迭代流程
   */
  console.log('触发完整的DAG-KG迭代流程...');
  
  const testData = {
    text: 'DAG-KG集成系统需要不断迭代优化，以提高提取和对齐的准确性。',
    metadata: {
      source: 'system',
      timestamp: Date.now()
    }
  };
  
  const taskIds = await taskDrivenDAGKGIteration.triggerFullIteration({
    data: testData,
    extractOptions: { depth: 3 },
    alignOptions: { confidenceThreshold: 0.7 },
    syncOptions: { realtime: true },
    analyzeOptions: { detailed: true },
    iterationOptions: { priority: 'high' }
  });
  
  return `完整的DAG-KG迭代流程已触发，任务ID列表: ${taskIds.join(', ')}`;
}

async function addTask() {
  /**
   * 添加自定义任务
   */
  console.log('添加自定义任务...');
  
  const taskId = taskDrivenDAGKGIteration.addTask({
    name: '性能优化任务',
    description: '优化DAG-KG系统性能',
    type: 'optimize_performance',
    priority: 'high',
    options: {
      target: 'extraction_engine',
      metrics: ['speed', 'accuracy']
    }
  });
  
  return `自定义任务已添加，任务ID: ${taskId}`;
}

module.exports = {
  runSkill
};