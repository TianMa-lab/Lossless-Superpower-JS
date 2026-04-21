/**
 * 同步Hermes源代码脚本
 * 手动触发Hermes源代码的同步
 */

const { SyncScheduler } = require('./src/superpowers/sync_scheduler');
const { SyncMonitor } = require('./src/superpowers/sync_monitor');

// 创建同步调度器
const scheduler = new SyncScheduler();

// 创建同步监控器
const monitor = new SyncMonitor();

// 同步Hermes源代码
async function syncHermesSourceCode() {
  console.log('=== 同步Hermes源代码 ===\n');
  
  try {
    // 启动调度器
    console.log('1. 启动同步调度器...');
    scheduler.start();
    console.log('✅ 调度器启动成功');
    
    // 等待调度器初始化
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 触发Hermes主仓库同步
    console.log('\n2. 触发Hermes主仓库同步...');
    const syncSuccess = scheduler.triggerSync('hermes_main');
    
    if (syncSuccess) {
      console.log('✅ Hermes主仓库同步触发成功');
    } else {
      console.error('❌ Hermes主仓库同步触发失败');
      return false;
    }
    
    // 等待同步完成
    console.log('\n3. 等待同步完成...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // 等待10秒
    
    // 检查同步状态
    console.log('\n4. 检查同步状态...');
    const status = scheduler.getStatus();
    console.log('同步状态:', status);
    
    // 生成同步报告
    console.log('\n5. 生成同步报告...');
    const report = monitor.generateHumanReadableReport();
    console.log('✅ 同步报告生成成功');
    
    // 停止调度器
    console.log('\n6. 停止同步调度器...');
    scheduler.stop();
    console.log('✅ 调度器停止成功');
    
    console.log('\n=== 同步完成 ===');
    console.log('Hermes源代码同步任务已执行');
    
    return true;
  } catch (error) {
    console.error('同步过程中出现错误:', error.message);
    
    // 确保调度器停止
    try {
      scheduler.stop();
    } catch (stopError) {
      // 忽略停止错误
    }
    
    return false;
  }
}

// 执行同步
if (require.main === module) {
  syncHermesSourceCode()
    .then(result => {
      console.log('\n=== 同步结果 ===');
      if (result) {
        console.log('✅ Hermes源代码同步成功');
      } else {
        console.log('❌ Hermes源代码同步失败');
      }
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('同步执行失败:', error.message);
      process.exit(1);
    });
}

module.exports = {
  syncHermesSourceCode
};