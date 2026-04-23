/**
 * 综合自动记录器技能
 * 用于触发和查看综合自动记录器的状态
 */

const { comprehensiveAutoRecorder } = require('../comprehensive_auto_recorder');

async function runSkill(action) {
  /**
   * 执行综合自动记录器技能
   * @param {string} action - 操作类型
   * @returns {string} 执行结果
   */
  try {
    console.log(`执行综合自动记录器技能: ${action}`);
    
    switch (action) {
      case 'status':
        return await getStatus();
      case 'init':
        return await initializeRecorder();
      case 'file_changes':
        return await getFileChanges();
      default:
        return `未知操作类型: ${action}`;
    }
  } catch (error) {
    console.error(`综合自动记录器技能执行失败: ${error.message}`);
    return `综合自动记录器技能执行失败: ${error.message}`;
  }
}

async function getStatus() {
  /**
   * 获取综合自动记录器状态
   */
  console.log('获取综合自动记录器状态...');
  
  const status = comprehensiveAutoRecorder.getStatus();
  
  return `综合自动记录器状态:\n${JSON.stringify(status, null, 2)}`;
}

async function initializeRecorder() {
  /**
   * 初始化综合自动记录器
   */
  console.log('初始化综合自动记录器...');
  
  await comprehensiveAutoRecorder.initialize();
  
  return '综合自动记录器初始化成功';
}

async function getFileChanges() {
  /**
   * 获取文件变更记录
   */
  console.log('获取文件变更记录...');
  
  const fileChanges = comprehensiveAutoRecorder.getFileChanges();
  
  return `文件变更记录:\n${JSON.stringify(fileChanges, null, 2)}`;
}

module.exports = {
  runSkill
};