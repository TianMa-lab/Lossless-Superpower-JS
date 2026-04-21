/**
 * 测试DAG与知识图谱集成迭代技能
 */

const { dagKgIntegrationIterationSkill } = require('./src/superpowers');

async function testSkill() {
  console.log('=== 测试DAG与知识图谱集成迭代技能 ===\n');
  
  try {
    // 测试完整迭代
    console.log('1. 测试完整迭代...');
    const fullIterationResult = await dagKgIntegrationIterationSkill.runSkill('full_iteration');
    console.log('  结果:', fullIterationResult);
    console.log();
    
    // 测试性能优化迭代
    console.log('2. 测试性能优化迭代...');
    const performanceResult = await dagKgIntegrationIterationSkill.runSkill('performance_optimization');
    console.log('  结果:', performanceResult);
    console.log();
    
    // 测试深度集成迭代
    console.log('3. 测试深度集成迭代...');
    const deepIntegrationResult = await dagKgIntegrationIterationSkill.runSkill('deep_integration');
    console.log('  结果:', deepIntegrationResult);
    console.log();
    
    // 测试知识图谱推理迭代
    console.log('4. 测试知识图谱推理迭代...');
    const reasoningResult = await dagKgIntegrationIterationSkill.runSkill('knowledge_graph_reasoning');
    console.log('  结果:', reasoningResult);
    console.log();
    
    // 测试用户界面高级功能迭代
    console.log('5. 测试用户界面高级功能迭代...');
    const uiResult = await dagKgIntegrationIterationSkill.runSkill('ui_features');
    console.log('  结果:', uiResult);
    console.log();
    
    // 测试系统安全加固迭代
    console.log('6. 测试系统安全加固迭代...');
    const securityResult = await dagKgIntegrationIterationSkill.runSkill('security_hardening');
    console.log('  结果:', securityResult);
    console.log();
    
    // 测试系统集成与API扩展迭代
    console.log('7. 测试系统集成与API扩展迭代...');
    const integrationResult = await dagKgIntegrationIterationSkill.runSkill('system_integration');
    console.log('  结果:', integrationResult);
    console.log();
    
    // 测试系统文档和用户指南完善迭代
    console.log('8. 测试系统文档和用户指南完善迭代...');
    const documentationResult = await dagKgIntegrationIterationSkill.runSkill('documentation');
    console.log('  结果:', documentationResult);
    console.log();
    
    console.log('=== 测试完成 ===');
    console.log('所有测试都已成功执行');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testSkill().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
