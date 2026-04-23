const { dagTaskIntegration } = require('./src/superpowers/dag_task_integration');

async function testDAGTaskIntegration() {
  console.log('开始测试DAG-Task集成系统...\n');

  const initResult = await dagTaskIntegration.initialize();
  console.log('初始化结果:', initResult);

  console.log('\n记录测试任务1...');
  const task1 = dagTaskIntegration.recordTask({
    topic: 'NekoBox代理配置',
    description: '配置NekoBox使用海外静态住宅IP代理服务器',
    priority: 'high',
    agent: 'assistant',
    project: 'nekoray',
    tags: ['nekoray', 'proxy', 'configuration'],
    metadata: {
      proxyServer: '64.105.162.121',
      proxyPort: 7778,
      proxyType: 'socks5'
    }
  });
  console.log('任务1记录结果:', task1);

  const task1Id = task1.taskId;

  console.log('\n记录测试任务2...');
  const task2 = dagTaskIntegration.recordTask({
    topic: '测试代理连接',
    description: '测试NekoBox代理服务器连接和速度',
    priority: 'medium',
    agent: 'assistant',
    project: 'nekoray',
    tags: ['nekoray', 'proxy', 'testing']
  });
  console.log('任务2记录结果:', task2);

  const task2Id = task2.taskId;

  console.log('\n链接任务1和任务2...');
  const linkResult = dagTaskIntegration.linkTasks(task1Id, task2Id, 'depends_on');
  console.log('链接结果:', linkResult);

  console.log('\n完成测试任务1...');
  const completeResult = dagTaskIntegration.completeTask(task1Id, {
    success: true,
    proxyConnected: true,
    ip: '64.105.162.121',
    location: 'Singapore'
  }, [
    '配置文件格式使用addr和port字段',
    '代理服务器位于新加坡',
    '某些网站可能限制代理访问'
  ]);
  console.log('完成任务结果:', completeResult);

  console.log('\n获取系统状态...');
  const status = dagTaskIntegration.getSystemStatus();
  console.log('系统状态:', JSON.stringify(status, null, 2));

  console.log('\n获取任务统计...');
  const stats = dagTaskIntegration.getTaskStatistics();
  console.log('任务统计:', JSON.stringify(stats, null, 2));

  console.log('\n生成任务报告...');
  const report = dagTaskIntegration.generateTaskReport();
  console.log('任务报告:', JSON.stringify(report, null, 2));

  console.log('\n查询所有任务...');
  const tasks = dagTaskIntegration.getTaskRecorder().queryTasks({});
  console.log('所有任务:', tasks.length);
  tasks.forEach(t => {
    console.log(`- ${t.topic} (${t.status})`);
  });

  console.log('\n测试DAG导出...');
  const dagExport = dagTaskIntegration.exportDAG();
  console.log('DAG节点数:', Object.keys(dagExport.nodes).length);
  console.log('DAG边数:', dagExport.edges.length);

  console.log('\n✓ DAG-Task集成系统测试完成');
}

testDAGTaskIntegration().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});