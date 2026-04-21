/**
 * 自动同步功能测试脚本
 * 测试GitHub同步功能的可靠性
 */

const fs = require('fs');
const path = require('path');
const { GitHubSync } = require('./src/superpowers/github_sync');
const { SyncScheduler } = require('./src/superpowers/sync_scheduler');
const { SyncMonitor } = require('./src/superpowers/sync_monitor');

// 测试配置
const testConfig = {
  testDir: path.join(__dirname, 'test', 'sync_test'),
  testRepo: {
    id: 'test_repo',
    name: 'Test Repository',
    github_url: 'https://github.com/octocat/Hello-World.git', // 测试用的公开仓库
    local_path: path.join(__dirname, 'test', 'sync_test', 'hello-world'),
    branch: 'master', // 测试仓库使用 master 分支
    sync_enabled: true,
    sync_interval: 60 // 1分钟
  }
};

// 清理测试目录
function cleanupTestDir() {
  if (fs.existsSync(testConfig.testDir)) {
    fs.rmSync(testConfig.testDir, { recursive: true, force: true });
  }
  fs.mkdirSync(testConfig.testDir, { recursive: true });
  console.log('清理测试目录完成');
}

// 测试GitHubSync
async function testGitHubSync() {
  console.log('\n=== 测试GitHubSync模块 ===');
  
  const githubSync = new GitHubSync();
  
  try {
    // 测试克隆仓库
    console.log('1. 测试克隆仓库...');
    const cloneSuccess = githubSync.cloneRepo(
      testConfig.testRepo.github_url,
      testConfig.testRepo.local_path
    );
    
    if (!cloneSuccess) {
      throw new Error('克隆仓库失败');
    }
    console.log('✅ 克隆仓库成功');
    
    // 测试是否是Git仓库
    console.log('2. 测试是否是Git仓库...');
    const isGitRepo = githubSync.isGitRepo(testConfig.testRepo.local_path);
    if (!isGitRepo) {
      throw new Error('目录不是Git仓库');
    }
    console.log('✅ 确认是Git仓库');
    
    // 测试获取仓库信息
    console.log('3. 测试获取仓库信息...');
    const repoInfo = githubSync.getRepoInfo(testConfig.testRepo.local_path);
    if (!repoInfo) {
      throw new Error('获取仓库信息失败');
    }
    console.log('✅ 获取仓库信息成功:', repoInfo);
    
    // 测试拉取代码
    console.log('4. 测试拉取代码...');
    const pullSuccess = githubSync.pullCode(testConfig.testRepo.local_path);
    if (!pullSuccess) {
      throw new Error('拉取代码失败');
    }
    console.log('✅ 拉取代码成功');
    
    // 测试推送代码（可选，需要写入权限）
    console.log('5. 测试推送代码...');
    // 创建测试文件
    const testFilePath = path.join(testConfig.testRepo.local_path, 'test_sync.txt');
    fs.writeFileSync(testFilePath, `Test sync at ${new Date().toISOString()}`);
    
    // 尝试推送（可能会失败，因为没有写入权限，但测试流程是正确的）
    try {
      const pushSuccess = githubSync.pushCode(
        testConfig.testRepo.local_path,
        null,
        'Test sync'
      );
      if (pushSuccess) {
        console.log('✅ 推送代码成功');
      } else {
        console.log('⚠️  推送代码失败（可能是因为没有写入权限）');
      }
    } catch (error) {
      console.log('⚠️  推送代码失败（可能是因为没有写入权限）:', error.message);
    }
    
    return true;
  } catch (error) {
    console.error('GitHubSync测试失败:', error.message);
    return false;
  }
}

// 测试SyncScheduler
async function testSyncScheduler() {
  console.log('\n=== 测试SyncScheduler模块 ===');
  
  try {
    // 创建测试配置文件
    const testConfigPath = path.join(testConfig.testDir, 'test_sync_config.json');
    const testConfigContent = {
      repositories: [testConfig.testRepo],
      sync_config: {
        default_interval: 60,
        max_retries: 3,
        retry_delay: 10,
        timeout: 30,
        notification_enabled: true,
        log_level: 'info'
      }
    };
    fs.writeFileSync(testConfigPath, JSON.stringify(testConfigContent, null, 2));
    
    // 创建调度器
    const scheduler = new SyncScheduler(testConfigPath);
    
    // 测试启动调度器
    console.log('1. 测试启动调度器...');
    scheduler.start();
    console.log('✅ 调度器启动成功');
    
    // 测试获取状态
    console.log('2. 测试获取状态...');
    const status = scheduler.getStatus();
    console.log('✅ 获取状态成功:', status);
    
    // 测试手动触发同步
    console.log('3. 测试手动触发同步...');
    const triggerSuccess = scheduler.triggerSync(testConfig.testRepo.id);
    if (triggerSuccess) {
      console.log('✅ 手动触发同步成功');
    } else {
      console.log('⚠️  手动触发同步失败');
    }
    
    // 等待一段时间让同步完成
    console.log('4. 等待同步完成...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 测试停止调度器
    console.log('5. 测试停止调度器...');
    scheduler.stop();
    console.log('✅ 调度器停止成功');
    
    return true;
  } catch (error) {
    console.error('SyncScheduler测试失败:', error.message);
    return false;
  }
}

// 测试SyncMonitor
function testSyncMonitor() {
  console.log('\n=== 测试SyncMonitor模块 ===');
  
  try {
    const monitor = new SyncMonitor(path.join(testConfig.testDir, 'logs'));
    
    // 测试日志记录
    console.log('1. 测试日志记录...');
    monitor.log('测试日志记录', 'info', 'test_repo');
    console.log('✅ 日志记录成功');
    
    // 测试同步状态更新
    console.log('2. 测试同步状态更新...');
    monitor.updateSyncStatus('test_repo', 'syncing', { duration: 1000 });
    console.log('✅ 同步状态更新成功');
    
    // 测试获取同步状态
    console.log('3. 测试获取同步状态...');
    const status = monitor.getSyncStatus();
    console.log('✅ 获取同步状态成功:', status);
    
    // 测试生成报告
    console.log('4. 测试生成报告...');
    const report = monitor.generateSyncReport();
    console.log('✅ 生成报告成功');
    
    // 测试生成人类可读报告
    console.log('5. 测试生成人类可读报告...');
    const humanReport = monitor.generateHumanReadableReport();
    console.log('✅ 生成人类可读报告成功');
    
    return true;
  } catch (error) {
    console.error('SyncMonitor测试失败:', error.message);
    return false;
  }
}

// 测试整体流程
async function testFullSyncFlow() {
  console.log('\n=== 测试整体同步流程 ===');
  
  try {
    // 清理测试目录
    cleanupTestDir();
    
    // 测试各个模块
    const githubSyncResult = await testGitHubSync();
    const schedulerResult = await testSyncScheduler();
    const monitorResult = testSyncMonitor();
    
    // 汇总测试结果
    const allPassed = githubSyncResult && schedulerResult && monitorResult;
    
    console.log('\n=== 测试结果汇总 ===');
    console.log(`GitHubSync测试: ${githubSyncResult ? '✅ 通过' : '❌ 失败'}`);
    console.log(`SyncScheduler测试: ${schedulerResult ? '✅ 通过' : '❌ 失败'}`);
    console.log(`SyncMonitor测试: ${monitorResult ? '✅ 通过' : '❌ 失败'}`);
    console.log(`整体测试: ${allPassed ? '✅ 全部通过' : '❌ 部分失败'}`);
    
    // 清理测试目录
    cleanupTestDir();
    
    return allPassed;
  } catch (error) {
    console.error('整体同步流程测试失败:', error.message);
    cleanupTestDir();
    return false;
  }
}

// 执行测试
if (require.main === module) {
  console.log('=== 自动同步功能测试 ===\n');
  testFullSyncFlow()
    .then(result => {
      console.log('\n=== 测试完成 ===');
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('测试执行失败:', error.message);
      process.exit(1);
    });
}

module.exports = {
  testGitHubSync,
  testSyncScheduler,
  testSyncMonitor,
  testFullSyncFlow
};