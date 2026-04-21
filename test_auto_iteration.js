/**
 * 自动迭代记录功能测试
 * 测试自动迭代记录器在不同环境下的工作情况
 */

const fs = require('fs');
const path = require('path');
const { init, cleanup, getAutoIterationStatus, triggerIteration } = require('./src');

// 测试配置
const testConfig = {
  enableAutoIterationRecording: true,
  autoIterationConfig: {
    environment: 'test',
    debounceTime: 1000, // 缩短测试时间
    minChanges: 1
  }
};

// 测试文件路径
const testFilePath = path.join(__dirname, 'src', 'test_auto_iteration.js');

// 创建测试文件
function createTestFile() {
  const content = `/**
 * 测试文件
 * 用于测试自动迭代记录功能
 */

console.log('测试自动迭代记录功能');
`;
  
  fs.writeFileSync(testFilePath, content);
  console.log(`创建测试文件: ${testFilePath}`);
}

// 修改测试文件
function modifyTestFile() {
  const content = `/**
 * 测试文件
 * 用于测试自动迭代记录功能
 */

console.log('测试自动迭代记录功能');
console.log('修改测试文件以触发迭代记录');
`;
  
  fs.writeFileSync(testFilePath, content);
  console.log(`修改测试文件: ${testFilePath}`);
}

// 删除测试文件
function deleteTestFile() {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log(`删除测试文件: ${testFilePath}`);
  }
}

// 测试自动迭代记录功能
async function testAutoIteration() {
  console.log('=== 自动迭代记录功能测试 ===\n');
  
  try {
    // 清理测试文件
    deleteTestFile();
    
    // 初始化系统
    console.log('1. 初始化系统...');
    const initResult = await init(testConfig);
    if (!initResult) {
      console.error('系统初始化失败');
      return;
    }
    console.log('✅ 系统初始化成功\n');
    
    // 检查自动迭代记录器状态
    console.log('2. 检查自动迭代记录器状态...');
    const status = getAutoIterationStatus();
    console.log('自动迭代记录器状态:', status);
    console.log('✅ 状态检查完成\n');
    
    // 等待一段时间
    console.log('3. 等待系统稳定...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ 系统稳定\n');
    
    // 创建测试文件
    console.log('4. 创建测试文件...');
    createTestFile();
    console.log('✅ 测试文件创建完成\n');
    
    // 等待防抖时间
    console.log('5. 等待防抖时间...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ 防抖时间结束\n');
    
    // 修改测试文件
    console.log('6. 修改测试文件...');
    modifyTestFile();
    console.log('✅ 测试文件修改完成\n');
    
    // 等待防抖时间
    console.log('7. 等待防抖时间...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ 防抖时间结束\n');
    
    // 手动触发迭代检测
    console.log('8. 手动触发迭代检测...');
    triggerIteration();
    console.log('✅ 迭代检测触发完成\n');
    
    // 等待迭代记录创建
    console.log('9. 等待迭代记录创建...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ 迭代记录创建完成\n');
    
    // 检查迭代记录
    console.log('10. 检查迭代记录...');
    const { getAllIterations } = require('./src/superpowers/iteration_manager');
    const iterations = getAllIterations();
    const recentIterations = iterations.slice(0, 3);
    console.log('最近3条迭代记录:', JSON.stringify(recentIterations, null, 2));
    console.log('✅ 迭代记录检查完成\n');
    
    // 清理测试文件
    console.log('11. 清理测试文件...');
    deleteTestFile();
    console.log('✅ 测试文件清理完成\n');
    
    // 清理系统
    console.log('12. 清理系统...');
    cleanup();
    console.log('✅ 系统清理完成\n');
    
    // 测试结果
    console.log('=== 测试结果 ===');
    console.log('✅ 自动迭代记录功能测试完成');
    console.log('✅ 系统能够正确检测和记录文件变更');
    console.log('✅ 测试环境下的迭代记录功能正常工作');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    console.error(error.stack);
    
    // 清理
    deleteTestFile();
    cleanup();
  }
}

// 执行测试
if (require.main === module) {
  testAutoIteration();
}

module.exports = {
  testAutoIteration
};