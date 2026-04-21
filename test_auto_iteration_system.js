// 测试自动迭代系统
const { init, getAutoIterationStatus, runAutoIteration, startAutoIteration, stopAutoIteration } = require('./src/index.js');

async function testAutoIterationSystem() {
  console.log('=== 测试自动迭代系统 ===');
  
  try {
    // 1. 初始化系统
    console.log('1. 初始化系统...');
    await init();
    console.log('系统初始化成功');
    
    // 2. 检查自动迭代状态
    console.log('\n2. 检查自动迭代状态...');
    const status = getAutoIterationStatus();
    console.log('自动迭代状态:', status);
    
    // 3. 手动运行一次自动迭代
    console.log('\n3. 手动运行自动迭代...');
    const result = await runAutoIteration();
    console.log('自动迭代运行结果:', result);
    
    // 4. 启动自动迭代
    console.log('\n4. 启动自动迭代...');
    const startResult = startAutoIteration();
    console.log('自动迭代启动结果:', startResult);
    
    // 5. 再次检查自动迭代状态
    console.log('\n5. 再次检查自动迭代状态...');
    const statusAfterStart = getAutoIterationStatus();
    console.log('自动迭代状态:', statusAfterStart);
    
    // 6. 停止自动迭代
    console.log('\n6. 停止自动迭代...');
    const stopResult = stopAutoIteration();
    console.log('自动迭代停止结果:', stopResult);
    
    // 7. 最后检查自动迭代状态
    console.log('\n7. 最后检查自动迭代状态...');
    const statusAfterStop = getAutoIterationStatus();
    console.log('自动迭代状态:', statusAfterStop);
    
    console.log('\n=== 自动迭代系统测试完成 ===');
    console.log('测试结果: 成功');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    console.log('\n=== 自动迭代系统测试失败 ===');
  }
}

// 运行测试
testAutoIterationSystem();