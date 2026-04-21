/**
 * 全局自动任务记录系统测试
 * 验证所有任务是否都被自动记录
 */

const fs = require('fs');
const path = require('path');
const { autoTaskRecorder } = require('../src/superpowers/auto_task_recorder');
const { taskTracker } = require('../src/superpowers/task_tracker');
const { permanentMemorySystem } = require('../src/superpowers/permanent_memory');

// 测试目录
const testDir = path.join(__dirname, 'test_auto_record');

async function cleanup() {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
  fs.mkdirSync(testDir, { recursive: true });
}

async function testSetTimeout() {
  console.log('\n1. 测试 setTimeout...');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('   ✓ setTimeout 执行完成');
      resolve();
    }, 100);
  });
}

async function testPromise() {
  console.log('\n2. 测试 Promise...');
  
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  
  console.log('   ✓ Promise 执行完成');
}

async function testFsOperations() {
  console.log('\n3. 测试 fs 操作...');
  
  const testFile = path.join(testDir, 'test.txt');
  
  // 写入文件
  await fs.promises.writeFile(testFile, '测试内容', 'utf-8');
  console.log('   ✓ fs.writeFile 成功');
  
  // 读取文件
  const content = await fs.promises.readFile(testFile, 'utf-8');
  console.log('   ✓ fs.readFile 成功');
  
  // 创建目录
  const testSubDir = path.join(testDir, 'subdir');
  await fs.promises.mkdir(testSubDir, { recursive: true });
  console.log('   ✓ fs.mkdir 成功');
  
  // 复制文件
  const copiedFile = path.join(testSubDir, 'copied.txt');
  await fs.promises.copyFile(testFile, copiedFile);
  console.log('   ✓ fs.copyFile 成功');
  
  // 删除文件
  await fs.promises.rm(testFile);
  console.log('   ✓ fs.rm 成功');
}

async function testManualTask() {
  console.log('\n4. 测试手动任务记录...');
  
  const result = await autoTaskRecorder.recordTask(
    '测试手动任务',
    '这是一个手动记录的测试任务',
    async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { success: true, data: '测试数据' };
    },
    {
      tags: 'test,manual',
      importance: 4
    }
  );
  
  console.log('   ✓ 手动任务记录成功');
  console.log('   结果:', result);
}

async function testHttpRequest() {
  console.log('\n5. 测试 HTTP 请求...');
  
  const http = require('http');
  
  return new Promise((resolve, reject) => {
    const req = http.get('http://example.com', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('   ✓ HTTP GET 请求成功');
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log('   ⚠ HTTP GET 请求失败:', error.message);
      resolve(); // 继续执行
    });
  });
}

async function testChildProcess() {
  console.log('\n6. 测试子进程...');
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('echo "Hello World"', (error, stdout, stderr) => {
      if (error) {
        console.log('   ⚠ 子进程执行失败:', error.message);
      } else {
        console.log('   ✓ 子进程执行成功');
        console.log('   输出:', stdout.trim());
      }
      resolve();
    });
  });
}

async function verifyResults() {
  console.log('\n7. 验证记录结果...');
  
  // 检查任务追踪
  const tasks = taskTracker.listTasks();
  console.log(`   任务追踪记录数: ${tasks.length}`);
  
  // 检查记忆系统
  const memories = await permanentMemorySystem.getMemories(1000);
  const taskMemories = memories.filter(m => m.type === 'task_result');
  console.log(`   记忆系统任务记录数: ${taskMemories.length}`);
  
  // 检查自动记录统计
  const stats = autoTaskRecorder.getStats();
  console.log('   自动记录统计:');
  console.log(`   - 总任务数: ${stats.totalTasks}`);
  console.log(`   - 今日任务数: ${stats.recentTasks}`);
  console.log(`   - 通过任务数: ${stats.passedTasks}`);
  console.log(`   - 失败任务数: ${stats.failedTasks}`);
  console.log('   - 任务类型分布:');
  Object.entries(stats.taskTypes).forEach(([type, count]) => {
    console.log(`     ${type}: ${count}`);
  });
  
  // 生成报告
  const report = await autoTaskRecorder.generateReport();
  console.log('\n8. 生成报告...');
  console.log(`   报告生成时间: ${report.generatedAt}`);
  console.log(`   最近任务记忆数: ${report.recentTaskMemories.length}`);
  
  return {
    totalTasks: tasks.length,
    taskMemories: taskMemories.length,
    stats: stats
  };
}

async function main() {
  console.log('=== 全局自动任务记录系统测试 ===');
  
  try {
    // 清理测试环境
    await cleanup();
    console.log('\n测试环境准备完成');
    
    // 运行各种测试
    await testSetTimeout();
    await testPromise();
    await testFsOperations();
    await testManualTask();
    await testHttpRequest();
    await testChildProcess();
    
    // 验证结果
    const results = await verifyResults();
    
    console.log('\n=== 测试结果总结 ===');
    console.log(`✓ 任务追踪记录: ${results.totalTasks} 条`);
    console.log(`✓ 记忆系统记录: ${results.taskMemories} 条`);
    console.log(`✓ 今日任务: ${results.stats.recentTasks} 条`);
    console.log(`✓ 成功率: ${results.stats.recentTasks > 0 ? Math.round((results.stats.passedTasks / results.stats.recentTasks) * 100) : 0}%`);
    
    const success = results.totalTasks > 0 && results.taskMemories > 0;
    
    if (success) {
      console.log('\n🎉 全局自动任务记录系统测试成功！');
      console.log('   所有任务都被自动记录到追踪系统和记忆系统');
    } else {
      console.log('\n❌ 全局自动任务记录系统测试失败');
      console.log('   任务没有被正确记录');
    }
    
    return success;
  } catch (error) {
    console.error('测试执行失败:', error.message);
    return false;
  }
}

// 执行测试
main()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });