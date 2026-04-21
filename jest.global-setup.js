/**
 * Jest全局测试环境设置
 * 在所有测试套件之前执行
 */

const { taskTracker } = require('./src/superpowers/task_tracker');
const { permanentMemorySystem } = require('./src/superpowers/permanent_memory');
const path = require('path');
const fs = require('fs');

// 会话ID
let sessionId = null;

/**
 * 全局设置 - 在所有测试之前执行一次
 */
async function globalSetup() {
  console.log('\n========================================');
  console.log('   初始化自动任务记录系统...');
  console.log('========================================\n');

  try {
    // 初始化记忆系统
    const memoryDir = path.join(__dirname, 'src', 'superpowers', 'memory_backups');
    await permanentMemorySystem.init(memoryDir);
    console.log('[GlobalSetup] 记忆系统初始化完成');

    // 创建测试会话任务
    sessionId = `jest_session_${Date.now()}`;
    taskTracker.startTask(
      sessionId,
      'Jest测试会话',
      '自动化测试执行会话',
      { type: 'jest_session' }
    );

    console.log(`[GlobalSetup] 测试会话已创建: ${sessionId}`);

    // 将会话ID写入临时文件，供测试环境读取
    const sessionFile = path.join(__dirname, '.jest_session_id');
    fs.writeFileSync(sessionFile, sessionId, 'utf-8');

    console.log('\n========================================');
    console.log('   自动任务记录系统已启用');
    console.log('========================================\n');
  } catch (error) {
    console.error('[GlobalSetup] 初始化失败:', error.message);
    throw error;
  }
}

/**
 * 全局拆卸 - 在所有测试之后执行一次
 */
async function globalTeardown() {
  console.log('\n========================================');
  console.log('   清理测试会话...');
  console.log('========================================\n');

  try {
    if (sessionId) {
      const tasks = taskTracker.listTasks();
      const sessionTasks = tasks.filter(t => t.metadata?.sessionId === sessionId);
      const passed = sessionTasks.filter(t => t.status === 'completed').length;
      const failed = sessionTasks.filter(t => t.status === 'failed').length;

      console.log(`会话 ${sessionId} 统计:`);
      console.log(`  总任务数: ${sessionTasks.length}`);
      console.log(`  通过: ${passed}`);
      console.log(`  失败: ${failed}`);

      // 完成任务
      taskTracker.completeTask(
        sessionId,
        `测试会话完成 - 通过: ${passed}, 失败: ${failed}`
      );
    }

    // 清理临时文件
    const sessionFile = path.join(__dirname, '.jest_session_id');
    if (fs.existsSync(sessionFile)) {
      fs.unlinkSync(sessionFile);
    }

    console.log('\n========================================');
    console.log('   测试会话已清理');
    console.log('========================================\n');
  } catch (error) {
    console.error('[GlobalTeardown] 清理失败:', error.message);
    throw error;
  }
}

module.exports = globalSetup;
module.exports.globalSetup = globalSetup;
module.exports.globalTeardown = globalTeardown;