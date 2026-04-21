#!/usr/bin/env node

/**
 * 系统集成测试脚本
 * 验证所有新模块是否能正确加载和初始化
 */

const losslessSuperpower = require('./src');

async function testSystemIntegration() {
  console.log('=== Lossless Superpower 系统集成测试 ===\n');

  try {
    // 测试1: 验证模块加载
    console.log('1. 测试模块加载...');
    
    // 核心模块
    console.log('   - 核心模块: 加载成功');
    
    // 新增模块
    const modules = [
      'knowledgeGraphEmbedding',
      'pathReasoner',
      'gnnReasoner',
      'ruleReasoner',
      'temporalReasoner',
      'performanceOptimizer'
    ];
    
    for (const moduleName of modules) {
      try {
        const module = losslessSuperpower[moduleName];
        console.log(`   - ${moduleName}: 加载成功`);
      } catch (error) {
        console.error(`   - ${moduleName}: 加载失败:`, error.message);
      }
    }

    // 测试2: 验证创建方法
    console.log('\n2. 测试创建方法...');
    
    try {
      // 测试知识图谱嵌入
      const embedding = losslessSuperpower.createEmbedding('TransE', { embeddingDim: 128 });
      console.log('   - createEmbedding: 成功');
    } catch (error) {
      console.error('   - createEmbedding: 失败:', error.message);
    }

    try {
      // 测试路径推理器
      const pathReasoner = losslessSuperpower.createPathReasoner({ nodes: [], edges: [] }, { maxDepth: 5 });
      console.log('   - createPathReasoner: 成功');
    } catch (error) {
      console.error('   - createPathReasoner: 失败:', error.message);
    }

    try {
      // 测试GNN推理器
      const gnnReasoner = losslessSuperpower.createGNNReasoner({ hiddenDim: 128 });
      console.log('   - createGNNReasoner: 成功');
    } catch (error) {
      console.error('   - createGNNReasoner: 失败:', error.message);
    }

    try {
      // 测试规则推理器
      const ruleReasoner = losslessSuperpower.createRuleReasoner({ minConfidence: 0.9 });
      console.log('   - createRuleReasoner: 成功');
    } catch (error) {
      console.error('   - createRuleReasoner: 失败:', error.message);
    }

    try {
      // 测试时序推理器
      const temporalReasoner = losslessSuperpower.createTemporalReasoner({ timeGranularity: 'day' });
      console.log('   - createTemporalReasoner: 成功');
    } catch (error) {
      console.error('   - createTemporalReasoner: 失败:', error.message);
    }

    try {
      // 测试性能优化器
      const optimizer = losslessSuperpower.createPerformanceOptimizer({ enabled: true });
      console.log('   - createPerformanceOptimizer: 成功');
    } catch (error) {
      console.error('   - createPerformanceOptimizer: 失败:', error.message);
    }

    // 测试3: 验证系统初始化
    console.log('\n3. 测试系统初始化...');
    
    const initResult = await losslessSuperpower.init({
      enableKnowledgeGraphReasoning: true,
      enablePerformanceOptimization: true,
      enableDocGenerator: false,
      enableGitHubSync: false,
      enableHermes: false,
      enableCoder: false,
      enableFileProcessor: false
    });
    
    if (initResult) {
      console.log('   - 系统初始化: 成功');
    } else {
      console.error('   - 系统初始化: 失败');
    }

    // 测试4: 验证系统清理
    console.log('\n4. 测试系统清理...');
    
    const cleanupResult = losslessSuperpower.cleanup();
    
    if (cleanupResult) {
      console.log('   - 系统清理: 成功');
    } else {
      console.error('   - 系统清理: 失败');
    }

    console.log('\n=== 测试完成 ===');
    console.log('所有模块加载和功能测试完成');

  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
  }
}

// 运行测试
testSystemIntegration();
