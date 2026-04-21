#!/usr/bin/env node

/**
 * 任务记录的监控和分析脚本
 * 用于分析任务执行情况和趋势
 */

const { taskTracker } = require('./src/superpowers/task_tracker');
const fs = require('fs');
const path = require('path');

function analyzeTasks() {
  console.log('=== 任务记录分析 ===\n');
  
  // 获取所有任务
  const tasks = taskTracker.listTasks();
  console.log(`总任务数: ${tasks.length}\n`);
  
  // 任务统计信息
  console.log('1. 任务统计信息:');
  const stats = taskTracker.getTaskStatistics();
  console.log(JSON.stringify(stats, null, 2));
  console.log('');
  
  // 构建任务分析
  console.log('2. 构建任务分析:');
  const buildTasks = tasks.filter(task => task.name === '构建项目');
  console.log(`构建任务数量: ${buildTasks.length}`);
  
  if (buildTasks.length > 0) {
    // 计算构建任务的平均执行时间
    const buildDurations = buildTasks.map(task => {
      if (task.end_time && task.start_time) {
        return task.end_time - task.start_time;
      }
      return 0;
    }).filter(duration => duration > 0);
    
    if (buildDurations.length > 0) {
      const averageDuration = buildDurations.reduce((sum, duration) => sum + duration, 0) / buildDurations.length;
      console.log(`平均构建时间: ${averageDuration.toFixed(2)} 秒`);
      console.log(`最长构建时间: ${Math.max(...buildDurations).toFixed(2)} 秒`);
      console.log(`最短构建时间: ${Math.min(...buildDurations).toFixed(2)} 秒`);
    }
    
    // 构建任务成功率
    const successfulBuilds = buildTasks.filter(task => task.status === 'completed' && task.result.includes('成功'));
    const successRate = buildTasks.length > 0 ? (successfulBuilds.length / buildTasks.length * 100).toFixed(2) : 0;
    console.log(`构建成功率: ${successRate}%`);
  }
  console.log('');
  
  // 任务状态分析
  console.log('3. 任务状态分析:');
  const statusCount = {};
  tasks.forEach(task => {
    statusCount[task.status] = (statusCount[task.status] || 0) + 1;
  });
  console.log(JSON.stringify(statusCount, null, 2));
  console.log('');
  
  // 最近的任务
  console.log('4. 最近的5个任务:');
  const recentTasks = tasks
    .sort((a, b) => (b.start_time || 0) - (a.start_time || 0))
    .slice(0, 5);
  
  recentTasks.forEach(task => {
    const duration = task.end_time && task.start_time ? (task.end_time - task.start_time).toFixed(2) : 'N/A';
    console.log(`- ${task.name} (${task.status}): ${duration} 秒`);
    console.log(`  结果: ${task.result}`);
    console.log(`  时间: ${new Date((task.start_time || 0) * 1000).toLocaleString()}`);
    console.log('');
  });
  
  // 生成分析报告
  generateAnalysisReport(tasks);
}

function generateAnalysisReport(tasks) {
  const report = {
    generatedAt: new Date().toISOString(),
    totalTasks: tasks.length,
    statistics: taskTracker.getTaskStatistics(),
    buildTasks: tasks.filter(task => task.name === '构建项目'),
    recentTasks: tasks
      .sort((a, b) => (b.start_time || 0) - (a.start_time || 0))
      .slice(0, 10)
  };
  
  // 计算构建任务的平均执行时间
  if (report.buildTasks.length > 0) {
    const buildDurations = report.buildTasks.map(task => {
      if (task.end_time && task.start_time) {
        return task.end_time - task.start_time;
      }
      return 0;
    }).filter(duration => duration > 0);
    
    if (buildDurations.length > 0) {
      report.averageBuildTime = buildDurations.reduce((sum, duration) => sum + duration, 0) / buildDurations.length;
      report.maxBuildTime = Math.max(...buildDurations);
      report.minBuildTime = Math.min(...buildDurations);
    }
  }
  
  // 保存分析报告
  const reportDir = path.join(__dirname, 'task_analysis');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = path.join(reportDir, `task_analysis_${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log(`分析报告已保存到: ${reportFile}`);
}

// 如果直接运行此脚本
if (require.main === module) {
  analyzeTasks();
}

module.exports = {
  analyzeTasks,
  generateAnalysisReport
};
