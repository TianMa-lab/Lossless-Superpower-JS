/**
 * DAG-KG 智能迭代升级系统测试脚本
 * 测试智能迭代和升级功能
 */

const { intelligentIterationSystem } = require('./src/superpowers/dag_kg_intelligent_iteration');

async function testIntelligentIterationSystem() {
  console.log('开始测试DAG-KG智能迭代升级系统...\n');

  // 1. 启动系统
  console.log('1. 启动智能迭代系统...');
  await intelligentIterationSystem.start();
  
  // 2. 查看系统状态
  console.log('\n2. 查看系统状态...');
  const status = intelligentIterationSystem.getStatus();
  console.log('系统状态:', status);

  // 3. 手动触发迭代
  console.log('\n3. 手动触发智能迭代...');
  await intelligentIterationSystem.triggerManualIteration();

  // 4. 手动触发升级
  console.log('\n4. 手动触发智能升级...');
  const upgradeResult = await intelligentIterationSystem.triggerManualUpgrade();
  console.log('升级结果:', {
    success: upgradeResult?.result?.success,
    targetVersion: upgradeResult?.plan?.targetVersion,
    actions: upgradeResult?.plan?.actions?.length || 0
  });

  // 5. 查看升级历史
  console.log('\n5. 查看升级历史...');
  const upgradeHistory = intelligentIterationSystem.getUpgradeHistory();
  console.log('升级历史记录数:', upgradeHistory.length);
  if (upgradeHistory.length > 0) {
    console.log('最近一次升级:', {
      timestamp: new Date(upgradeHistory[0].timestamp).toISOString(),
      success: upgradeHistory[0].success,
      targetVersion: upgradeHistory[0].plan.targetVersion,
      actions: upgradeHistory[0].executedActions.length
    });
  }

  // 6. 查看分析结果
  console.log('\n6. 查看分析结果...');
  const analysisResults = intelligentIterationSystem.getAnalysisResults();
  console.log('分析结果记录数:', analysisResults.length);
  if (analysisResults.length > 0) {
    const latestAnalysis = analysisResults[0];
    console.log('最近一次分析:', {
      timestamp: new Date(latestAnalysis.timestamp).toISOString(),
      issues: latestAnalysis.issues.length,
      recommendations: latestAnalysis.recommendations.length,
      upgradePotential: (latestAnalysis.upgradePotential * 100).toFixed(2) + '%'
    });
  }

  // 7. 再次查看系统状态
  console.log('\n7. 再次查看系统状态...');
  const finalStatus = intelligentIterationSystem.getStatus();
  console.log('最终系统状态:', finalStatus);

  // 8. 停止系统
  console.log('\n8. 停止智能迭代系统...');
  intelligentIterationSystem.stop();

  console.log('\n✅ DAG-KG智能迭代升级系统测试完成！');
}

testIntelligentIterationSystem().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});
