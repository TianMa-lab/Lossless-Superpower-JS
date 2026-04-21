/**
 * 测试TaskRunner自动任务记录功能
 */

const { TaskRunner } = require('./src/superpowers');

async function testTaskRunner() {
  console.log('=== 测试TaskRunner自动任务记录功能 ===\n');

  // 测试1: 基本任务执行
  console.log('测试1: 基本任务执行');
  try {
    const result = await TaskRunner.runTask(
      'test_task_1',
      '测试任务1',
      '这是一个测试任务',
      async () => {
        console.log('执行测试任务1...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return '测试任务1完成';
      }
    );
    console.log('测试任务1结果:', result);
  } catch (error) {
    console.error('测试任务1失败:', error.message);
  }
  console.log('');

  // 测试2: 带步骤的任务
  console.log('测试2: 带步骤的任务');
  try {
    await TaskRunner.runTaskWithSteps(
      'test_task_2',
      '测试任务2',
      '带多个步骤的测试任务',
      [
        {
          name: '步骤1',
          description: '执行第一步',
          execute: async () => {
            console.log('执行步骤1...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        },
        {
          name: '步骤2',
          description: '执行第二步',
          execute: async () => {
            console.log('执行步骤2...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        },
        {
          name: '步骤3',
          description: '执行第三步',
          execute: async () => {
            console.log('执行步骤3...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      ]
    );
  } catch (error) {
    console.error('测试任务2失败:', error.message);
  }
  console.log('');

  // 测试3: 任务失败处理
  console.log('测试3: 任务失败处理');
  try {
    await TaskRunner.runTask(
      'test_task_3',
      '测试任务3',
      '测试任务失败处理',
      async () => {
        console.log('执行测试任务3...');
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('测试任务失败');
      }
    );
  } catch (error) {
    console.log('测试任务3失败（预期行为）:', error.message);
  }
  console.log('');

  // 测试4: 任务包装器
  console.log('测试4: 任务包装器');
  try {
    const wrappedFunction = TaskRunner.wrapFunction('测试包装函数', '测试函数包装功能');
    const wrapped = wrappedFunction(async (param1, param2) => {
      console.log('执行包装函数，参数:', param1, param2);
      await new Promise(resolve => setTimeout(resolve, 500));
      return `结果: ${param1} + ${param2} = ${param1 + param2}`;
    });
    
    const result = await wrapped(5, 3);
    console.log('包装函数结果:', result);
  } catch (error) {
    console.error('测试包装函数失败:', error.message);
  }
  console.log('');

  // 测试5: 批量任务
  console.log('测试5: 批量任务');
  try {
    const tasks = [
      {
        name: '批量任务1',
        description: '第一个批量任务',
        execute: async () => {
          console.log('执行批量任务1...');
          await new Promise(resolve => setTimeout(resolve, 300));
          return '批量任务1完成';
        }
      },
      {
        name: '批量任务2',
        description: '第二个批量任务',
        execute: async () => {
          console.log('执行批量任务2...');
          await new Promise(resolve => setTimeout(resolve, 300));
          return '批量任务2完成';
        }
      },
      {
        name: '批量任务3',
        description: '第三个批量任务',
        execute: async () => {
          console.log('执行批量任务3...');
          await new Promise(resolve => setTimeout(resolve, 300));
          return '批量任务3完成';
        }
      }
    ];
    
    const results = await TaskRunner.runBatchTasks(tasks);
    console.log('批量任务结果:', results);
  } catch (error) {
    console.error('测试批量任务失败:', error.message);
  }
  console.log('');

  // 测试6: 系统维护任务
  console.log('测试6: 系统维护任务');
  try {
    await TaskRunner.runMaintenanceTask();
  } catch (error) {
    console.error('测试系统维护任务失败:', error.message);
  }
  console.log('');

  // 测试7: 系统更新任务
  console.log('测试7: 系统更新任务');
  try {
    await TaskRunner.runUpdateTask({
      version: '1.5.1',
      title: '测试更新',
      description: '测试系统更新功能',
      updates: ['测试更新功能', '添加新特性'],
      files_modified: ['test.js'],
      features_added: ['测试功能']
    });
  } catch (error) {
    console.error('测试系统更新任务失败:', error.message);
  }
  
  console.log('\n=== 测试完成 ===');
  console.log('检查任务列表以确认所有任务都已记录');
}

// 运行测试
testTaskRunner().catch(error => {
  console.error('测试失败:', error);
}).finally(() => {
  process.exit(0);
});
