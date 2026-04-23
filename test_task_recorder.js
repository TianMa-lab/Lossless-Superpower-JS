/**
 * 测试任务记录技能
 */

const { TaskRunner } = require('./src/superpowers/task_runner');

async function testTaskRecorderSkill() {
  console.log('开始测试任务记录技能...');
  
  try {
    // 创建一个测试任务
    const taskId = `test_task_${Date.now()}`;
    const taskName = '测试任务记录技能';
    const taskDescription = '这是一个测试任务，用于验证任务记录技能是否能正常工作';
    
    // 执行测试任务
    const result = await TaskRunner.runTask(
      taskId,
      taskName,
      taskDescription,
      async () => {
        console.log('执行测试任务...');
        // 模拟任务执行
        await new Promise(resolve => setTimeout(resolve, 1000));
        return '测试任务执行成功';
      },
      {
        storeInMemory: true,
        memoryImportance: 4,
        memoryTags: 'test,task,recorder'
      }
    );
    
    console.log('测试任务执行完成，结果:', result);
    console.log('任务记录技能测试完成');
  } catch (error) {
    console.error('测试任务执行失败:', error.message);
  }
}

// 运行测试
testTaskRecorderSkill();