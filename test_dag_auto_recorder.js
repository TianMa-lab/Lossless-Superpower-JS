const { dagTaskAutoRecorder } = require('./src/superpowers/dag_task_auto_recorder');

async function testDAGAutoRecorder() {
  console.log('测试DAG自动记录器...\n');

  const initResult = await dagTaskAutoRecorder.initialize();
  console.log('初始化结果:', initResult);

  console.log('\n获取系统状态:');
  const status = dagTaskAutoRecorder.getSystemStatus();
  console.log(JSON.stringify(status, null, 2));

  console.log('\n获取DAG统计:');
  const stats = dagTaskAutoRecorder.getDAGStats();
  if (stats) {
    console.log(JSON.stringify(stats, null, 2));
  } else {
    console.log('DAG未初始化');
  }

  console.log('\n测试记录任务...');
  const taskResult = await dagTaskAutoRecorder.recordTask({
    name: '测试任务-DAG自动记录',
    description: '测试DAG任务自动记录功能',
    priority: 'high',
    project: 'test'
  });
  console.log('任务记录结果:', taskResult);

  if (taskResult.success) {
    console.log('\n测试完成任务...');
    const completeResult = await dagTaskAutoRecorder.completeTask(
      taskResult.taskId,
      { success: true, message: '测试完成' },
      ['这是经验教训']
    );
    console.log('完成任务结果:', completeResult);
  }

  console.log('\n获取最终DAG统计:');
  const finalStats = dagTaskAutoRecorder.getDAGStats();
  if (finalStats) {
    console.log(JSON.stringify(finalStats, null, 2));
  }

  console.log('\n✓ 测试完成');
}

testDAGAutoRecorder().catch(err => {
  console.error('测试失败:', err);
  process.exit(1);
});