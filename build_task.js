#!/usr/bin/env node

/**
 * 构建任务记录脚本
 * 用于记录构建和打包任务的执行过程
 */

const { taskTracker } = require('./src/superpowers/task_tracker');
const { execSync } = require('child_process');

function recordBuildTask() {
  const taskId = `build_${Date.now()}`;
  const startTime = Date.now();
  
  // 开始构建任务
  console.log('开始记录构建任务...');
  const task = taskTracker.startTask(
    taskId,
    '构建项目',
    '执行webpack构建，生成打包文件'
  );
  
  if (!task) {
    console.error('启动构建任务失败');
    process.exit(1);
  }
  
  console.log(`构建任务已启动: ${taskId}`);
  
  try {
    // 添加构建步骤
    taskTracker.addTaskStep(taskId, '准备构建环境', '检查依赖和配置');
    
    // 执行构建命令
    console.log('执行webpack构建...');
    taskTracker.addTaskStep(taskId, '执行webpack构建', '运行webpack命令生成打包文件');
    
    const buildOutput = execSync('webpack', { encoding: 'utf8' });
    console.log('构建完成:', buildOutput);
    
    // 添加构建完成步骤
    taskTracker.addTaskStep(taskId, '构建完成', '生成lossless-superpower.js文件');
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // 完成构建任务
    taskTracker.completeTask(
      taskId,
      `构建成功，生成了lossless-superpower.js文件，耗时 ${duration.toFixed(2)} 秒`
    );
    
    console.log(`构建任务已记录，耗时 ${duration.toFixed(2)} 秒`);
    process.exit(0);
  } catch (error) {
    console.error('构建失败:', error.message);
    
    // 记录失败的任务
    taskTracker.completeTask(
      taskId,
      `构建失败: ${error.message}`
    );
    
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  recordBuildTask();
}

module.exports = {
  recordBuildTask
};
