/**
 * 测试TaskRunner与记忆系统的集成功能
 */

const { TaskRunner } = require('./src/superpowers');
const { permanentMemorySystem } = require('./src/superpowers');

async function testTaskRunnerWithMemory() {
  console.log('=== 测试TaskRunner与记忆系统集成 ===\n');

  // 初始化永久记忆系统
  console.log('初始化永久记忆系统...');
  try {
    await permanentMemorySystem.init();
    console.log('永久记忆系统初始化成功');
  } catch (error) {
    console.error('永久记忆系统初始化失败:', error.message);
    return;
  }
  console.log('');

  // 测试1: 基本任务执行并存储到记忆系统
  console.log('测试1: 基本任务执行并存储到记忆系统');
  try {
    const result = await TaskRunner.runTask(
      'memory_test_1',
      '记忆测试任务1',
      '测试任务结果存储到记忆系统',
      async () => {
        console.log('执行测试任务1...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { value: 42, message: '测试成功' };
      },
      {
        storeInMemory: true,
        memoryImportance: 4,
        memoryTags: 'test,memory',
        memoryMetadata: { testCase: 1 }
      }
    );
    console.log('测试任务1结果:', result);
  } catch (error) {
    console.error('测试任务1失败:', error.message);
  }
  console.log('');

  // 测试2: 带步骤的任务并存储到记忆系统
  console.log('测试2: 带步骤的任务并存储到记忆系统');
  try {
    await TaskRunner.runTaskWithSteps(
      'memory_test_2',
      '记忆测试任务2',
      '带步骤的任务存储到记忆系统',
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
        }
      ],
      {
        storeInMemory: true,
        memoryImportance: 3,
        memoryTags: 'test,memory,steps',
        memoryMetadata: { testCase: 2, steps: 2 }
      }
    );
  } catch (error) {
    console.error('测试任务2失败:', error.message);
  }
  console.log('');

  // 测试3: 任务失败并存储到记忆系统
  console.log('测试3: 任务失败并存储到记忆系统');
  try {
    await TaskRunner.runTask(
      'memory_test_3',
      '记忆测试任务3',
      '测试失败任务存储到记忆系统',
      async () => {
        console.log('执行测试任务3...');
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('测试任务失败');
      },
      {
        storeInMemory: true,
        memoryImportance: 5,
        memoryTags: 'test,memory,error',
        memoryMetadata: { testCase: 3 }
      }
    );
  } catch (error) {
    console.log('测试任务3失败（预期行为）:', error.message);
  }
  console.log('');

  // 测试4: 任务执行并记录为迭代，同时存储到记忆系统
  console.log('测试4: 任务执行并记录为迭代，同时存储到记忆系统');
  try {
    await TaskRunner.runTaskWithIteration(
      'memory_test_4',
      '记忆测试任务4',
      '测试迭代任务存储到记忆系统',
      async () => {
        console.log('执行测试任务4...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return '迭代测试完成';
      },
      {
        version: '1.5.2',
        title: '测试迭代',
        description: '测试迭代功能与记忆系统集成',
        updates: ['测试迭代功能', '集成记忆系统'],
        files_modified: ['test.js'],
        features_added: ['记忆系统集成']
      },
      {
        storeInMemory: true,
        memoryImportance: 4,
        memoryTags: 'test,memory,iteration',
        memoryMetadata: { testCase: 4, iteration: '1.5.2' }
      }
    );
  } catch (error) {
    console.error('测试任务4失败:', error.message);
  }
  console.log('');

  // 测试5: 批量任务并存储到记忆系统
  console.log('测试5: 批量任务并存储到记忆系统');
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
      }
    ];
    
    const results = await TaskRunner.runBatchTasks(tasks, {
      storeInMemory: true,
      memoryImportance: 3,
      memoryTags: 'test,memory,batch',
      memoryMetadata: { testCase: 5, batch: true }
    });
    console.log('批量任务结果:', results);
  } catch (error) {
    console.error('测试批量任务失败:', error.message);
  }
  console.log('');

  // 测试6: 系统维护任务并存储到记忆系统
  console.log('测试6: 系统维护任务并存储到记忆系统');
  try {
    await TaskRunner.runMaintenanceTask({
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'maintenance,memory',
      memoryMetadata: { testCase: 6 }
    });
  } catch (error) {
    console.error('测试系统维护任务失败:', error.message);
  }
  console.log('');

  // 测试7: 系统更新任务并存储到记忆系统
  console.log('测试7: 系统更新任务并存储到记忆系统');
  try {
    await TaskRunner.runUpdateTask(
      {
        version: '1.5.3',
        title: '测试更新',
        description: '测试系统更新功能与记忆系统集成',
        updates: ['测试更新功能', '集成记忆系统'],
        files_modified: ['test.js'],
        features_added: ['记忆系统集成']
      },
      {
        storeInMemory: true,
        memoryImportance: 5,
        memoryTags: 'update,memory,iteration',
        memoryMetadata: { testCase: 7, update: '1.5.3' }
      }
    );
  } catch (error) {
    console.error('测试系统更新任务失败:', error.message);
  }
  
  // 验证记忆系统中的任务记录
  console.log('\n=== 验证记忆系统中的任务记录 ===');
  try {
    const memories = await permanentMemorySystem.searchMemories('task_result');
    console.log('记忆系统中的任务记录数量:', memories.length);
    console.log('最近5条任务记忆:');
    memories.slice(-5).forEach((memory, index) => {
      console.log(`\n${index + 1}. 记忆ID: ${memory.id}`);
      console.log(`   内容: ${memory.content.substring(0, 100)}...`);
      console.log(`   标签: ${memory.tags}`);
      console.log(`   重要性: ${memory.importance}`);
      console.log(`   时间: ${new Date(memory.timestamp).toLocaleString()}`);
    });
  } catch (error) {
    console.error('读取记忆系统失败:', error.message);
  }
  
  console.log('\n=== 测试完成 ===');
  console.log('TaskRunner与记忆系统集成测试完成');
}

// 运行测试
testTaskRunnerWithMemory().catch(error => {
  console.error('测试失败:', error);
}).finally(() => {
  process.exit(0);
});
