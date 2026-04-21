#!/usr/bin/env node

/**
 * 自动迭代系统测试脚本
 * 测试自动迭代系统的基本功能
 */

const Scheduler = require('./src/superpowers/scheduler');

async function testAutoIteration() {
  console.log('测试自动迭代系统...');
  
  try {
    // 创建调度器实例
    const scheduler = new Scheduler();
    
    // 测试获取状态
    console.log('\n测试获取系统状态...');
    const status = scheduler.getStatus();
    console.log('系统状态:', status);
    
    // 测试启动定时任务
    console.log('\n测试启动定时任务...');
    scheduler.startScheduledCycle();
    console.log('定时任务已启动');
    
    // 测试手动执行一次迭代
    console.log('\n测试手动执行一次迭代...');
    const result = await scheduler.runManualCycle();
    console.log('手动执行结果:', result);
    
    console.log('\n自动迭代系统测试成功!');
  } catch (error) {
    console.error('测试失败:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
testAutoIteration();