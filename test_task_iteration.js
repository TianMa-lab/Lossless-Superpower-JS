/**
 * 测试任务记录和迭代记录系统
 * 确保在测试环境下能够自动记录所有任务
 */

const { init, startAutoIterationRecorder, getAutoIterationStatus, triggerIteration } = require('./src');
const { autoTaskRecorder } = require('./src/superpowers/auto_task_recorder');
const { taskTracker } = require('./src/superpowers/task_tracker');
const fs = require('fs');
const path = require('path');

async function testSystem() {
  console.log('开始测试任务记录和迭代记录系统...');
  
  try {
    // 初始化系统
    console.log('初始化系统...');
    await init({
      enableAutoIterationRecording: true,
      autoIterationConfig: {
        environment: 'test'
      }
    });
    
    // 启动自动迭代记录器
    console.log('启动自动迭代记录器...');
    startAutoIterationRecorder({
      environment: 'test'
    });
    
    // 等待系统初始化
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 测试自动任务记录
    console.log('测试自动任务记录...');
    
    // 执行一些操作，触发任务记录
    console.log('执行文件操作...');
    await fs.promises.writeFile('test_temp.txt', '测试内容');
    await fs.promises.readFile('test_temp.txt', 'utf8');
    await fs.promises.unlink('test_temp.txt');
    
    console.log('执行HTTP请求...');
    const http = require('http');
    http.get('http://example.com', (res) => {
      console.log('HTTP请求完成');
    }).on('error', (err) => {
      console.log('HTTP请求失败:', err.message);
    });
    
    console.log('执行加密操作...');
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update('测试加密');
    hash.digest('hex');
    
    console.log('执行系统操作...');
    const os = require('os');
    os.cpus();
    os.freemem();
    
    console.log('执行命令操作...');
    const childProcess = require('child_process');
    childProcess.exec('echo "测试命令"', (err, stdout, stderr) => {
      console.log('命令执行完成:', stdout);
    });
    
    // 等待任务执行完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查任务记录
    console.log('检查任务记录...');
    const tasks = taskTracker.listTasks();
    console.log(`任务记录数量: ${tasks.length}`);
    
    // 触发迭代记录
    console.log('触发迭代记录...');
    triggerIteration();
    
    // 等待迭代记录创建
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 检查迭代记录
    console.log('检查迭代记录...');
    const iterations = require('./src/superpowers/iterations/iterations.json');
    console.log(`迭代记录数量: ${iterations.length}`);
    
    if (iterations.length > 0) {
      const latestIteration = iterations[iterations.length - 1];
      console.log(`最新迭代记录: ${latestIteration.title} (${latestIteration.version})`);
      console.log(`关联任务数量: ${latestIteration.related_tasks ? latestIteration.related_tasks.length : 0}`);
    }
    
    // 检查系统状态
    console.log('检查系统状态...');
    const status = getAutoIterationStatus();
    console.log('自动迭代记录器状态:', status);
    
    const taskStats = autoTaskRecorder.getStats();
    console.log('任务记录统计:', taskStats);
    
    console.log('测试完成！');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

// 运行测试
testSystem();
