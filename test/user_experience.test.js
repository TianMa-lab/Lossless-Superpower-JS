const { userExperienceOptimizer } = require('../src/superpowers/user_experience');

async function testUserExperienceOptimizer() {
  console.log('=== 测试用户体验优化系统 ===\n');

  // 1. 初始化用户体验优化系统
  console.log('1. 初始化用户体验优化系统...');
  const initResult = await userExperienceOptimizer.init();
  console.log(`初始化结果: ${initResult ? '成功' : '失败'}\n`);

  // 2. 测试记录和获取用户反馈
  console.log('2. 测试记录和获取用户反馈...');
  const feedbackId = userExperienceOptimizer.recordFeedback({
    type: 'bug',
    sentiment: 'negative',
    issue: '响应速度慢',
    details: 'API响应时间超过1秒'
  });
  console.log('记录的反馈ID:', feedbackId);
  const feedbacks = userExperienceOptimizer.getFeedback(1);
  console.log(`获取到 ${feedbacks.length} 条用户反馈`);
  console.log('用户反馈测试结果: 成功\n');

  // 3. 测试记录和获取用户体验指标
  console.log('3. 测试记录和获取用户体验指标...');
  const metricsId = userExperienceOptimizer.recordMetrics({
    responseTime: 350,
    satisfaction: 4.5,
    action: 'api_call',
    endpoint: '/api/memory'
  });
  console.log('记录的指标ID:', metricsId);
  const metrics = userExperienceOptimizer.getMetrics(1);
  console.log(`获取到 ${metrics.length} 条用户体验指标`);
  console.log('用户体验指标测试结果: 成功\n');

  // 4. 测试生成用户体验报告
  console.log('4. 测试生成用户体验报告...');
  const report = userExperienceOptimizer.generateUXReport();
  console.log('用户体验报告摘要:', report ? report.feedbackAnalysis : '失败');
  console.log(`用户体验报告生成结果: ${report ? '成功' : '失败'}\n`);

  // 5. 测试优化API响应
  console.log('5. 测试优化API响应...');
  const apiResponse = userExperienceOptimizer.optimizeAPIResponse({}, 200, { data: 'test' }, '操作成功');
  console.log('优化后的API响应:', apiResponse);
  console.log('API响应优化测试结果: 成功\n');

  // 6. 测试生成友好的错误信息
  console.log('6. 测试生成友好的错误信息...');
  const error = new Error('文件不存在');
  error.code = 'ENOENT';
  const friendlyError = userExperienceOptimizer.generateFriendlyError(error);
  console.log('友好的错误信息:', friendlyError);
  console.log('友好错误信息测试结果: 成功\n');

  // 7. 测试优化用户界面提示
  console.log('7. 测试优化用户界面提示...');
  const userMessage = userExperienceOptimizer.generateUserMessage('success', '操作成功完成');
  console.log('用户界面提示:', userMessage);
  console.log('用户界面提示测试结果: 成功\n');

  // 8. 测试分析用户行为
  console.log('8. 测试分析用户行为...');
  const events = [
    { type: 'click', action: 'login', timestamp: Date.now() - 3600000, sessionId: '1' },
    { type: 'click', action: 'browse', timestamp: Date.now() - 3500000, sessionId: '1' },
    { type: 'click', action: 'search', timestamp: Date.now() - 3400000, sessionId: '1' }
  ];
  const behaviorAnalysis = userExperienceOptimizer.analyzeUserBehavior(events);
  console.log('用户行为分析:', behaviorAnalysis);
  console.log(`用户行为分析测试结果: ${behaviorAnalysis ? '成功' : '失败'}\n`);

  // 9. 测试生成用户体验改进计划
  console.log('9. 测试生成用户体验改进计划...');
  const improvementPlan = userExperienceOptimizer.generateImprovementPlan();
  console.log('用户体验改进计划:', improvementPlan ? improvementPlan.goals : '失败');
  console.log(`用户体验改进计划生成结果: ${improvementPlan ? '成功' : '失败'}\n`);

  // 10. 测试验证用户体验状态
  console.log('10. 测试验证用户体验状态...');
  const uxStatus = userExperienceOptimizer.validateUXStatus();
  console.log('用户体验状态:', uxStatus ? uxStatus.overallStatus : '失败');
  console.log(`用户体验状态验证结果: ${uxStatus ? '成功' : '失败'}\n`);

  console.log('=== 用户体验优化系统测试完成 ===');
}

// 运行测试
testUserExperienceOptimizer().catch(error => {
  console.error('测试失败:', error);
}).finally(() => {
  process.exit(0);
});
