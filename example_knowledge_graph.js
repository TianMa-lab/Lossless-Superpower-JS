#!/usr/bin/env node

/**
 * 知识图谱推理系统示例
 * 展示如何使用各个推理模块
 */

const losslessSuperpower = require('./src');

async function runKnowledgeGraphExample() {
  console.log('=== 知识图谱推理系统示例 ===\n');

  try {
    // 1. 初始化系统
    console.log('1. 初始化系统...');
    await losslessSuperpower.init({
      enableKnowledgeGraphReasoning: true,
      enablePerformanceOptimization: true,
      enableDocGenerator: false,
      enableGitHubSync: false,
      enableHermes: false,
      enableCoder: false,
      enableFileProcessor: false
    });
    console.log('   系统初始化成功\n');

    // 2. 创建知识图谱数据
    console.log('2. 创建知识图谱数据...');
    const graph = {
      nodes: [
        { id: 'Alice', type: 'Person', properties: { age: 30, occupation: 'Engineer' } },
        { id: 'Bob', type: 'Person', properties: { age: 35, occupation: 'Manager' } },
        { id: 'Charlie', type: 'Person', properties: { age: 25, occupation: 'Designer' } },
        { id: 'Google', type: 'Company', properties: { founded: 1998, industry: 'Technology' } },
        { id: 'Microsoft', type: 'Company', properties: { founded: 1975, industry: 'Technology' } }
      ],
      edges: [
        { source: 'Alice', target: 'Bob', type: 'knows', properties: { since: 2010 } },
        { source: 'Bob', target: 'Charlie', type: 'knows', properties: { since: 2015 } },
        { source: 'Alice', target: 'Google', type: 'works_at', properties: { since: 2020, position: 'Software Engineer' } },
        { source: 'Bob', target: 'Microsoft', type: 'works_at', properties: { since: 2018, position: 'Product Manager' } },
        { source: 'Google', target: 'Microsoft', type: 'competitor', properties: { intensity: 'high' } }
      ]
    };
    console.log('   知识图谱创建完成，包含', graph.nodes.length, '个节点和', graph.edges.length, '条边\n');

    // 3. 知识图谱嵌入示例
    console.log('3. 知识图谱嵌入示例...');
    try {
      const embedding = losslessSuperpower.createEmbedding('TransE', {
        embeddingDim: 64,
        learningRate: 0.01,
        epochs: 100
      });
      
      // 准备训练数据
      const trainingData = graph.edges.map(edge => ({
        subject: edge.source,
        predicate: edge.type,
        object: edge.target
      }));
      
      // 训练模型
      console.log('   训练 TransE 模型...');
      await embedding.train(trainingData);
      console.log('   模型训练完成');
      
      // 预测链接
      const predictions = embedding.predict({ subject: 'Alice', relation: 'knows' });
      console.log('   预测 Alice 认识的人:', predictions.slice(0, 3));
      
      // 知识图谱补全
      const completions = embedding.completeGraph(trainingData, 3);
      console.log('   知识图谱补全结果:', completions.slice(0, 3));
    } catch (error) {
      console.error('   嵌入示例失败:', error.message);
    }
    console.log('');

    // 4. 路径推理示例
    console.log('4. 路径推理示例...');
    try {
      const pathReasoner = losslessSuperpower.createPathReasoner(graph, {
        maxDepth: 3,
        algorithm: 'A*'
      });
      
      // 寻找路径
      const path = pathReasoner.findPath('Alice', 'Charlie');
      console.log('   Alice 到 Charlie 的路径:', path);
      
      // 多跳推理
      const reasoningResult = pathReasoner.multiHopReasoning('Alice', 'competitor', 'Microsoft');
      console.log('   Alice 与 Microsoft 的竞争关系推理:', reasoningResult);
      
      // 路径排序
      const paths = pathReasoner.findAllPaths('Alice', 'Microsoft');
      console.log('   Alice 到 Microsoft 的所有路径:', paths);
    } catch (error) {
      console.error('   路径推理示例失败:', error.message);
    }
    console.log('');

    // 5. 图神经网络示例
    console.log('5. 图神经网络示例...');
    try {
      const gnnReasoner = losslessSuperpower.createGNNReasoner({
        modelType: 'GCN',
        hiddenDim: 64,
        numLayers: 2
      });
      
      // 节点分类
      const nodeClasses = gnnReasoner.classifyNodes(graph);
      console.log('   节点分类结果:', nodeClasses);
      
      // 链接预测
      const links = gnnReasoner.predictLinks(graph);
      console.log('   预测的链接:', links.slice(0, 3));
      
      // 子图嵌入
      const subgraph = {
        nodes: graph.nodes.slice(0, 3),
        edges: graph.edges.filter(edge => 
          ['Alice', 'Bob', 'Charlie'].includes(edge.source) && 
          ['Alice', 'Bob', 'Charlie'].includes(edge.target)
        )
      };
      const embedding = gnnReasoner.embedSubgraph(subgraph);
      console.log('   子图嵌入维度:', embedding.length);
    } catch (error) {
      console.error('   GNN 示例失败:', error.message);
    }
    console.log('');

    // 6. 规则推理示例
    console.log('6. 规则推理示例...');
    try {
      const ruleReasoner = losslessSuperpower.createRuleReasoner({
        minConfidence: 0.8,
        maxRuleLength: 3
      });
      
      // 学习规则
      const rules = ruleReasoner.learnRules(graph);
      console.log('   学习到的规则:', rules.slice(0, 3));
      
      // 应用规则
      const inferences = ruleReasoner.applyRules(graph, rules);
      console.log('   推理结果:', inferences.slice(0, 3));
      
      // 验证规则
      const validation = ruleReasoner.validateRules(rules, graph);
      console.log('   规则验证结果:', validation);
    } catch (error) {
      console.error('   规则推理示例失败:', error.message);
    }
    console.log('');

    // 7. 时序推理示例
    console.log('7. 时序推理示例...');
    try {
      const temporalReasoner = losslessSuperpower.createTemporalReasoner({
        timeGranularity: 'day',
        maxHistoryLength: 365
      });
      
      // 添加时序事实
      await temporalReasoner.addTemporalFact('Alice', 'works_at', 'Google', new Date('2020-01-01'));
      await temporalReasoner.addTemporalFact('Bob', 'works_at', 'Microsoft', new Date('2018-06-01'));
      await temporalReasoner.addTemporalFact('Alice', 'knows', 'Bob', new Date('2010-03-15'));
      
      // 时间线查询
      const aliceTimeline = temporalReasoner.getTimeline('Alice');
      console.log('   Alice 的时间线:', aliceTimeline);
      
      // 事件预测
      const prediction = temporalReasoner.predictEvent('Alice', 'promoted', new Date('2023-01-01'));
      console.log('   Alice 晋升预测:', prediction);
      
      // 时间模式挖掘
      const patterns = temporalReasoner.mineTimePatterns(['Alice', 'Bob']);
      console.log('   时间模式:', patterns.slice(0, 3));
    } catch (error) {
      console.error('   时序推理示例失败:', error.message);
    }
    console.log('');

    // 8. 性能优化示例
    console.log('8. 性能优化示例...');
    try {
      const optimizer = losslessSuperpower.createPerformanceOptimizer({
        enableParallel: true,
        cacheSize: 1000,
        enableIndexing: true
      });
      
      // 优化推理
      const optimizedResult = optimizer.optimize推理(() => {
        // 模拟复杂推理
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
          result += Math.sqrt(i);
        }
        return result;
      });
      console.log('   优化后推理结果:', optimizedResult);
      
      // 获取性能统计
      const stats = optimizer.getPerformanceStats();
      console.log('   性能统计:', stats);
      
      // 缓存示例
      const cachedFunction = optimizer.cache((key) => {
        console.log('   执行计算 for key:', key);
        return key * 2;
      });
      
      console.log('   第一次调用:', cachedFunction(5));
      console.log('   第二次调用（应该使用缓存）:', cachedFunction(5));
    } catch (error) {
      console.error('   性能优化示例失败:', error.message);
    }
    console.log('');

    // 9. 综合示例
    console.log('9. 综合示例...');
    try {
      // 使用通用推理接口
      const result = losslessSuperpower.reason('path', {
        source: 'Alice',
        target: 'Microsoft',
        maxDepth: 3
      });
      console.log('   通用推理结果:', result);
      
      // 组合多个模块
      const embedding = losslessSuperpower.createEmbedding('RotatE', { embeddingDim: 64 });
      const pathReasoner = losslessSuperpower.createPathReasoner(graph, { maxDepth: 3 });
      
      // 使用嵌入结果增强路径推理
      const enhancedGraph = {
        nodes: graph.nodes.map(node => ({
          ...node,
          embedding: [Math.random(), Math.random(), Math.random()]
        })),
        edges: graph.edges
      };
      
      const enhancedPath = pathReasoner.findPath('Alice', 'Microsoft');
      console.log('   增强路径推理结果:', enhancedPath);
    } catch (error) {
      console.error('   综合示例失败:', error.message);
    }
    console.log('');

    // 10. 清理资源
    console.log('10. 清理资源...');
    const cleanupResult = losslessSuperpower.cleanup();
    if (cleanupResult) {
      console.log('   系统清理成功');
    } else {
      console.error('   系统清理失败');
    }

    console.log('\n=== 示例完成 ===');
    console.log('所有模块示例运行完成');

  } catch (error) {
    console.error('示例运行过程中发生错误:', error.message);
    // 确保清理资源
    losslessSuperpower.cleanup();
  }
}

// 运行示例
runKnowledgeGraphExample();
