/**
 * 简化版测试任务记录和迭代记录之间的关联关系
 */

const { init, startAutoIterationRecorder, stopAutoIterationRecorder, triggerIteration } = require('./src');
const { autoTaskRecorder } = require('./src/superpowers/auto_task_recorder');
const { taskTracker } = require('./src/superpowers/task_tracker');
const fs = require('fs');
const path = require('path');

async function testSimpleRelation() {
  console.log('开始简化版测试任务记录和迭代记录之间的关联关系...');
  
  try {
    // 清理之前的测试文件
    if (fs.existsSync('./src/superpowers/iterations/iterations.json')) {
      fs.writeFileSync('./src/superpowers/iterations/iterations.json', '[]', 'utf8');
    }
    
    console.log('1. 初始化系统...');
    await init({
      enableAutoIterationRecording: true,
      autoIterationConfig: {
        environment: 'test'
      }
    });
    
    console.log('2. 启动自动迭代记录器...');
    startAutoIterationRecorder({
      environment: 'test'
    });
    
    console.log('3. 等待系统初始化...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('4. 执行文件操作，触发文件变更...');
    await fs.promises.writeFile('test_temp.txt', '测试内容 - 新增功能');
    await fs.promises.readFile('test_temp.txt', 'utf8');
    
    console.log('5. 手动记录一个测试任务...');
    await autoTaskRecorder.recordTask(
      '测试任务',
      '这是一个测试任务，用于验证迭代记录关联',
      async () => {
        // 模拟任务执行
        await new Promise(resolve => setTimeout(resolve, 500));
        return '测试任务执行成功';
      }
    );
    
    console.log('6. 等待任务执行完成...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('7. 检查任务记录...');
    const tasks = taskTracker.listTasks();
    console.log(`任务记录数量: ${tasks.length}`);
    
    console.log('8. 触发迭代记录...');
    triggerIteration();
    
    console.log('9. 等待迭代记录创建...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('10. 检查迭代记录...');
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
      } else {
        console.log('警告: 没有关联的任务记录');
      }
    } else {
      console.log('警告: 没有创建迭代记录');
    }
    
    console.log('11. 清理临时文件...');
    if (fs.existsSync('test_temp.txt')) {
      await fs.promises.unlink('test_temp.txt');
    }
    
    console.log('12. 测试完成！');
    
    // 清理
    console.log('13. 清理资源...');
    stopAutoIterationRecorder();
    
  } catch (error) {
    console.error('测试失败:', error.message);
    // 即使失败也要清理
    stopAutoIterationRecorder();
  }
}

// 运行测试
testSimpleRelation();
