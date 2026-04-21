#!/usr/bin/env node

/**
 * KGR自动迭代示例
 * 展示如何使用KGR自动迭代功能
 */

const losslessSuperpower = require('./src');

async function runKGR_auto_iterationExample() {
  console.log('=== KGR自动迭代示例 ===\n');

  try {
    // 1. 初始化系统
    console.log('1. 初始化系统...');
    await losslessSuperpower.init({
      enableKnowledgeGraphReasoning: true,
      enablePerformanceOptimization: true,
      enableKGRAutoIteration: true,
      kgrAutoIterationConfig: {
        enabled: true,
        interval: 60000, // 1分钟（实际使用中建议24小时）
        performanceThreshold: 0.1,
        qualityThreshold: 0.05
      },
      enableDocGenerator: false,
      enableGitHubSync: false,
      enableHermes: false,
      enableCoder: false,
      enableFileProcessor: false
    });
    console.log('   系统初始化成功\n');

    // 2. 创建KGR自动迭代实例
    console.log('2. 创建KGR自动迭代实例...');
    const autoIteration = losslessSuperpower.createKGR_auto_iteration({
      enabled: true,
      interval: 30000, // 30秒（演示用）
      performanceThreshold: 0.05,
      qualityThreshold: 0.03
    });
    console.log('   KGR自动迭代实例创建成功\n');

    // 3. 手动触发一次迭代
    console.log('3. 手动触发一次迭代...');
    const iterationResult = await autoIteration.triggerManualIteration();
    console.log('   迭代完成，结果:', iterationResult ? '成功' : '失败');
    if (iterationResult) {
      console.log('   迭代ID:', iterationResult.id);
      console.log('   性能提升:', (iterationResult.evaluation.performanceImprovement * 100).toFixed(2) + '%');
      console.log('   质量提升:', (iterationResult.evaluation.qualityImprovement * 100).toFixed(2) + '%');
    }
    console.log('');

    // 4. 查看迭代状态
    console.log('4. 查看迭代状态...');
    const status = autoIteration.getStatus();
    console.log('   运行状态:', status.running ? '运行中' : '已停止');
    console.log('   迭代次数:', status.iterationCount);
    console.log('   下次迭代时间:', status.nextIterationTime);
    console.log('');

    // 5. 查看迭代历史
    console.log('5. 查看迭代历史...');
    const history = autoIteration.getIterationHistory();
    console.log('   历史迭代次数:', history.length);
    if (history.length > 0) {
      const lastIteration = history[history.length - 1];
      console.log('   最近一次迭代:', lastIteration.timestamp);
      console.log('   迭代结果:', lastIteration.evaluation.success ? '成功' : '失败');
    }
    console.log('');

    // 6. 手动添加性能样本
    console.log('6. 手动添加性能样本...');
    autoIteration.addPerformanceSample(15.5, 1024 * 1024 * 500); // 15.5ms, 500MB
    autoIteration.addPerformanceSample(12.3, 1024 * 1024 * 450); // 12.3ms, 450MB
    autoIteration.addPerformanceSample(18.7, 1024 * 1024 * 550); // 18.7ms, 550MB
    console.log('   性能样本添加成功\n');

    // 7. 手动添加质量样本
    console.log('7. 手动添加质量样本...');
    autoIteration.addQualitySample(0.85, 0.82); // 准确率, 召回率
    autoIteration.addQualitySample(0.88, 0.85); // 准确率, 召回率
    autoIteration.addQualitySample(0.90, 0.87); // 准确率, 召回率
    console.log('   质量样本添加成功\n');

    // 8. 手动添加使用样本
    console.log('8. 手动添加使用样本...');
    autoIteration.addUsageSample('path');
    autoIteration.addUsageSample('relationship');
    autoIteration.addUsageSample('semantic');
    console.log('   使用样本添加成功\n');

    // 9. 启动自动迭代
    console.log('9. 启动自动迭代...');
    autoIteration.start();
    console.log('   自动迭代已启动，将按照配置的时间间隔执行\n');

    // 10. 等待一段时间，观察自动迭代
    console.log('10. 等待自动迭代执行（等待60秒）...');
    await new Promise(resolve => setTimeout(resolve, 60000));
    
    // 11. 查看最新状态
    console.log('11. 查看最新状态...');
    const finalStatus = autoIteration.getStatus();
    console.log('   最终运行状态:', finalStatus.running ? '运行中' : '已停止');
    console.log('   最终迭代次数:', finalStatus.iterationCount);
    
    // 12. 停止自动迭代
    console.log('\n12. 停止自动迭代...');
    autoIteration.stop();
    console.log('   自动迭代已停止\n');

    // 13. 清理资源
    console.log('13. 清理资源...');
    const cleanupResult = losslessSuperpower.cleanup();
    if (cleanupResult) {
      console.log('   系统清理成功');
    } else {
      console.error('   系统清理失败');
    }

    console.log('\n=== 示例完成 ===');
    console.log('KGR自动迭代功能演示完成');

  } catch (error) {
    console.error('示例运行过程中发生错误:', error.message);
    // 确保清理资源
    losslessSuperpower.cleanup();
  }
}

// 运行示例
runKGR_auto_iterationExample();
