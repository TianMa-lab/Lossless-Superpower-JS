/**
 * 测试任务记录和迭代记录之间的关联关系
 */

const { init, startAutoIterationRecorder, stopAutoIterationRecorder, getAutoIterationStatus, triggerIteration } = require('./src');
const { autoTaskRecorder } = require('./src/superpowers/auto_task_recorder');
const { taskTracker } = require('./src/superpowers/task_tracker');
const fs = require('fs');
const path = require('path');

async function testRelation() {
  console.log('开始测试任务记录和迭代记录之间的关联关系...');
  
  try {
    console.log('步骤1: 初始化系统...');
    await init({
      enableAutoIterationRecording: true,
      autoIterationConfig: {
        environment: 'test'
      }
    });
    
    console.log('步骤2: 启动自动迭代记录器...');
    startAutoIterationRecorder({
      environment: 'test'
    });
    
    console.log('步骤3: 等待系统初始化...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('步骤4: 手动记录一个任务...');
    await autoTaskRecorder.recordTask(
      '测试手动任务',
      '这是一个手动记录的测试任务',
      async () => {
        // 模拟任务执行
        await new Promise(resolve => setTimeout(resolve, 500));
        return '测试任务执行成功';
      }
    );
    
    console.log('步骤5: 等待任务执行完成...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('步骤6: 检查任务记录...');
    const tasks = taskTracker.listTasks();
    console.log(`任务记录数量: ${tasks.length}`);
    
    console.log('步骤7: 触发迭代记录...');
    triggerIteration();
    
    console.log('步骤8: 等待迭代记录创建...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('步骤9: 检查迭代记录...');
    const iterations = require('./src/superpowers/iterations/iterations.json');
    console.log(`迭代记录数量: ${iterations.length}`);
    
    if (iterations.length > 0) {
      const latestIteration = iterations[0];
      console.log(`最新迭代记录: ${latestIteration.title} (${latestIteration.version})`);
      console.log(`关联任务数量: ${latestIteration.related_tasks ? latestIteration.related_tasks.length : 0}`);
      
      if (latestIteration.related_tasks && latestIteration.related_tasks.length > 0) {
        console.log('关联任务详情:');
        latestIteration.related_tasks.forEach((task, index) => {
          console.log(`${index + 1}. ${task.name} - ${task.description}`);
        });
      }
    }
    
    console.log('步骤10: 测试完成！');
    
    // 清理
    console.log('步骤11: 清理资源...');
    stopAutoIterationRecorder();
    
  } catch (error) {
    console.error('测试失败:', error.message);
    // 即使失败也要清理
    stopAutoIterationRecorder();
  }
}

// 运行测试
testRelation();
