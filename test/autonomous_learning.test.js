const { autonomousLearningSystem } = require('../src/superpowers/autonomous_learning');

async function testAutonomousLearning() {
  console.log('=== 测试自主学习系统 ===');

  try {
    // 初始化自主学习系统
    console.log('1. 初始化自主学习系统...');
    const initResult = await autonomousLearningSystem.init();
    console.log(`初始化结果: ${initResult ? '成功' : '失败'}`);
    if (!initResult) {
      console.error('自主学习系统初始化失败，测试终止');
      return;
    }

    // 测试从交互中学习
    console.log('\n2. 测试从交互中学习...');
    const learnResult1 = await autonomousLearningSystem.learnFromInteraction(
      '如何使用永久记忆系统',
      '永久记忆系统可以通过addMemory方法添加记忆，通过getMemories方法获取记忆',
      { context: 'API使用' }
    );
    console.log(`学习结果1: ${learnResult1 ? '成功' : '失败'}`);

    const learnResult2 = await autonomousLearningSystem.learnFromInteraction(
      '什么是知识图谱',
      '知识图谱是一种以图形方式表示知识的结构，包含节点和边',
      { context: '概念解释' }
    );
    console.log(`学习结果2: ${learnResult2 ? '成功' : '失败'}`);

    // 测试构建知识图谱
    console.log('\n3. 测试构建知识图谱...');
    const graph = await autonomousLearningSystem.buildKnowledgeGraph();
    console.log(`知识图谱构建结果: ${graph ? '成功' : '失败'}`);
    if (graph) {
      console.log(`知识图谱包含 ${graph.nodes.length} 个节点和 ${graph.edges.length} 条边`);
    }

    // 测试学习效率优化
    console.log('\n4. 测试学习效率优化...');
    const suggestions = await autonomousLearningSystem.optimizeLearning();
    console.log(`优化建议: ${suggestions.length} 条`);
    if (suggestions.length > 0) {
      console.log('优化建议内容:', suggestions);
    }

    // 测试学习内容评估
    console.log('\n5. 测试学习内容评估...');
    const evaluation = await autonomousLearningSystem.evaluateLearningContent();
    console.log(`学习内容评估结果: ${evaluation ? '成功' : '失败'}`);
    if (evaluation) {
      console.log('评估内容:', evaluation);
    }

    // 测试学习模式识别
    console.log('\n6. 测试学习模式识别...');
    const patterns = await autonomousLearningSystem.identifyLearningPatterns();
    console.log(`学习模式识别结果: ${patterns ? '成功' : '失败'}`);
    if (patterns) {
      console.log('模式内容:', patterns);
    }

    // 测试获取学习统计信息
    console.log('\n7. 测试获取学习统计信息...');
    const stats = await autonomousLearningSystem.getLearningStats();
    console.log(`学习统计信息: ${stats ? '成功' : '失败'}`);
    if (stats) {
      console.log('统计内容:', stats);
    }

    console.log('\n=== 自主学习系统测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
  }
}

// 运行测试
testAutonomousLearning();
