/**
 * 测试技能触发器
 */

const { skillTrigger } = require('./src/superpowers/skill_trigger');

async function testTaskRecorder() {
  console.log('测试任务记录技能...');
  
  // 模拟用户输入
  const userInput = '记录这次任务';
  
  // 分析输入
  const skillInfo = skillTrigger.analyzeInput(userInput);
  console.log('分析结果:', skillInfo);
  
  if (skillInfo) {
    // 触发技能
    const result = await skillTrigger.triggerSkill(skillInfo);
    console.log('技能执行结果:', result);
  } else {
    console.log('未识别到技能');
  }
}

testTaskRecorder().catch(console.error);
