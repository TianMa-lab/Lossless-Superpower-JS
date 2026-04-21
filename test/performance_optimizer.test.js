const { performanceOptimizer } = require('../src/superpowers/performance_optimizer');

async function testPerformanceOptimizer() {
  console.log('=== 测试性能优化系统 ===');

  try {
    // 初始化性能优化系统
    console.log('1. 初始化性能优化系统...');
    const initResult = await performanceOptimizer.init();
    console.log(`初始化结果: ${initResult ? '成功' : '失败'}`);
    if (!initResult) {
      console.error('性能优化系统初始化失败，测试终止');
      return;
    }

    // 测试收集系统指标
    console.log('\n2. 测试收集系统指标...');
    const metrics = performanceOptimizer.collectSystemMetrics();
    console.log(`收集系统指标结果: ${metrics ? '成功' : '失败'}`);
    if (metrics) {
      console.log('系统指标:', metrics);
    }

    // 测试性能测试
    console.log('\n3. 测试性能测试...');
    const testResult = await performanceOptimizer.runPerformanceTest('测试循环性能', async () => {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      return sum;
    });
    console.log(`性能测试结果: ${testResult ? '成功' : '失败'}`);
    if (testResult) {
      console.log('测试结果:', testResult);
    }

    // 测试优化数据库查询
    console.log('\n4. 测试优化数据库查询...');
    const dbOptimization = performanceOptimizer.optimizeDatabaseQueries();
    console.log(`优化数据库查询结果: ${dbOptimization ? '成功' : '失败'}`);
    if (dbOptimization) {
      console.log('优化详情:', dbOptimization);
    }

    // 测试优化内存使用
    console.log('\n5. 测试优化内存使用...');
    const memoryOptimization = performanceOptimizer.optimizeMemoryUsage();
    console.log(`优化内存使用结果: ${memoryOptimization ? '成功' : '失败'}`);
    if (memoryOptimization) {
      console.log('优化详情:', memoryOptimization);
    }

    // 测试优化网络请求
    console.log('\n6. 测试优化网络请求...');
    const networkOptimization = performanceOptimizer.optimizeNetworkRequests();
    console.log(`优化网络请求结果: ${networkOptimization ? '成功' : '失败'}`);
    if (networkOptimization) {
      console.log('优化详情:', networkOptimization);
    }

    // 测试优化代码执行效率
    console.log('\n7. 测试优化代码执行效率...');
    const codeOptimization = performanceOptimizer.optimizeCodeExecution();
    console.log(`优化代码执行效率结果: ${codeOptimization ? '成功' : '失败'}`);
    if (codeOptimization) {
      console.log('优化详情:', codeOptimization);
    }

    // 测试获取性能指标
    console.log('\n8. 测试获取性能指标...');
    const performanceMetrics = performanceOptimizer.getPerformanceMetrics(10);
    console.log(`获取性能指标结果: ${performanceMetrics ? '成功' : '失败'}`);
    if (performanceMetrics) {
      console.log(`获取到 ${performanceMetrics.length} 条性能指标`);
    }

    // 测试获取优化历史
    console.log('\n9. 测试获取优化历史...');
    const optimizationHistory = performanceOptimizer.getOptimizationHistory();
    console.log(`获取优化历史结果: ${optimizationHistory ? '成功' : '失败'}`);
    if (optimizationHistory) {
      console.log(`获取到 ${optimizationHistory.length} 条优化记录`);
    }

    // 测试生成性能报告
    console.log('\n10. 测试生成性能报告...');
    const report = performanceOptimizer.generatePerformanceReport();
    console.log(`生成性能报告结果: ${report ? '成功' : '失败'}`);
    if (report) {
      console.log('性能报告摘要:', report.summary);
    }

    // 测试自动优化
    console.log('\n11. 测试自动优化...');
    const autoOptimizeResult = await performanceOptimizer.autoOptimize();
    console.log(`自动优化结果: ${autoOptimizeResult ? '成功' : '失败'}`);
    if (autoOptimizeResult) {
      console.log(`执行了 ${autoOptimizeResult.optimizations.length} 项优化`);
    }

    // 测试性能监控
    console.log('\n12. 测试性能监控...');
    const monitoringInterval = performanceOptimizer.startPerformanceMonitoring(2000); // 2秒间隔
    console.log(`开始性能监控: ${monitoringInterval ? '成功' : '失败'}`);

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 停止性能监控
    const stopResult = performanceOptimizer.stopPerformanceMonitoring(monitoringInterval);
    console.log(`停止性能监控: ${stopResult ? '成功' : '失败'}`);

    console.log('\n=== 性能优化系统测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
  }
}

// 运行测试
testPerformanceOptimizer();
