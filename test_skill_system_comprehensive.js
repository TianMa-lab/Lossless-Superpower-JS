/**
 * 技能系统综合测试脚本
 * 测试所有新添加的功能
 */

const path = require('path');
const { 
  SkillScanner, 
  SkillGenerator, 
  SkillKnowledgeGraph, 
  SkillOptimizer, 
  FeedbackManager, 
  SkillMarket, 
  PerformanceOptimizer 
} = require('./src/superpowers');

async function testSkillSystem() {
  console.log('=== 开始测试技能系统 ===\n');
  
  try {
    // 初始化测试环境
    const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
    const storageDir = path.join(__dirname, 'src', 'superpowers', 'storage');
    const optimizationDir = path.join(__dirname, 'src', 'superpowers', 'optimization_data');
    const marketDir = path.join(__dirname, 'src', 'superpowers', 'market');
    const cacheDir = path.join(__dirname, 'src', 'superpowers', 'cache');
    const interactionHistoryDir = path.join(__dirname, 'src', 'superpowers', 'learning');
    
    // 1. 测试性能优化器
    console.log('1. 测试性能优化器...');
    const performanceOptimizer = new PerformanceOptimizer(cacheDir);
    
    // 2. 测试技能扫描器
    console.log('2. 测试技能扫描器...');
    const scanner = new SkillScanner(skillsDir);
    const skills = scanner.scanSkills();
    console.log(`   发现 ${skills.length} 个技能`);
    
    // 3. 测试技能生成器
    console.log('3. 测试技能生成器...');
    const generator = new SkillGenerator(skillsDir, interactionHistoryDir);
    const generatedSkills = generator.generateSkillsFromInteractionHistory('test_user', 7);
    console.log(`   生成了 ${generatedSkills.length} 个技能`);
    
    // 4. 测试技能知识图谱
    console.log('4. 测试技能知识图谱...');
    const knowledgeGraph = new SkillKnowledgeGraph(storageDir);
    knowledgeGraph.buildSkillRelationships(skills);
    
    if (skills.length > 0) {
      const testSkill = skills[0].name;
      const recommendations = knowledgeGraph.getSkillRecommendations(testSkill, 5, 'test_user', 'hybrid');
      console.log(`   为技能 ${testSkill} 推荐的技能:`);
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.skill} (评分: ${(rec.score * 100).toFixed(2)}%, 算法: ${rec.algorithm})`);
      });
    }
    
    // 5. 测试技能优化器
    console.log('5. 测试技能优化器...');
    const optimizer = new SkillOptimizer(skillsDir, optimizationDir);
    
    if (skills.length > 0) {
      const testSkill = skills[0].name;
      const usageData = {
        totalUses: 100,
        successfulUses: 85,
        totalDuration: 50000,
        users: new Map([['user1', 20], ['user2', 15]]),
        averageResponseTime: 1500,
        errorRate: 0.15
      };
      
      const optimizationResult = optimizer.optimizeSkill(testSkill, usageData);
      if (optimizationResult.success) {
        console.log(`   技能 ${testSkill} 优化成功`);
        console.log(`   优化建议数量: ${optimizationResult.suggestions.length}`);
      } else {
        console.log(`   技能 ${testSkill} 优化失败: ${optimizationResult.error}`);
      }
    }
    
    // 6. 测试用户反馈机制
    console.log('6. 测试用户反馈机制...');
    const feedbackManager = new FeedbackManager(storageDir);
    
    if (skills.length > 0) {
      const testSkill = skills[0].name;
      const feedbackId = feedbackManager.submitFeedback(testSkill, 'test_user', 5, '非常好的技能！');
      console.log(`   提交反馈成功，反馈ID: ${feedbackId}`);
      
      const skillFeedback = feedbackManager.getSkillFeedback(testSkill);
      console.log(`   技能 ${testSkill} 的反馈数量: ${skillFeedback.length}`);
      
      const averageRating = feedbackManager.getSkillAverageRating(testSkill);
      console.log(`   技能 ${testSkill} 的平均评分: ${averageRating.toFixed(2)}`);
    }
    
    // 7. 测试技能市场
    console.log('7. 测试技能市场...');
    const skillMarket = new SkillMarket(marketDir, skillsDir);
    
    if (skills.length > 0) {
      const testSkill = skills[0].name;
      const marketSkillId = skillMarket.publishSkill(testSkill, 'test_user', {
        description: '测试技能',
        tags: ['test', 'demo'],
        category: 'testing'
      });
      
      if (marketSkillId) {
        console.log(`   技能 ${testSkill} 发布到市场成功，市场ID: ${marketSkillId}`);
        
        // 测试搜索
        const searchResults = skillMarket.searchSkills('test');
        console.log(`   搜索 "test" 结果数量: ${searchResults.length}`);
        
        // 测试下载
        const downloadPath = skillMarket.downloadSkill(marketSkillId, 'test_user2');
        if (downloadPath) {
          console.log(`   下载技能成功，路径: ${downloadPath}`);
        }
        
        // 测试评级
        const ratingResult = skillMarket.rateSkill(marketSkillId, 'test_user2', 4, '不错的技能');
        if (ratingResult) {
          console.log(`   评级技能成功`);
        }
      }
    }
    
    // 8. 测试性能优化
    console.log('8. 测试性能优化...');
    const performanceTest = await performanceOptimizer.monitorPerformance('技能扫描', () => {
      return scanner.scanSkills();
    });
    
    console.log(`   性能测试结果: 耗时 ${performanceTest.performance.duration}ms, 内存 ${(performanceTest.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    
    // 9. 生成报告
    console.log('9. 生成报告...');
    const kgReport = knowledgeGraph.generateReport();
    console.log(`   知识图谱报告: 总技能数 ${kgReport.totalSkills}, 总关联数 ${kgReport.totalRelationships}`);
    
    const feedbackReport = feedbackManager.generateFeedbackReport();
    console.log(`   反馈报告: 总反馈数 ${feedbackReport.totalFeedback}, 平均评分 ${feedbackReport.averageRating.toFixed(2)}`);
    
    const marketReport = skillMarket.generateMarketReport();
    console.log(`   市场报告: 总技能数 ${marketReport.totalSkills}, 总下载数 ${marketReport.totalDownloads}`);
    
    const performanceReport = performanceOptimizer.generatePerformanceReport();
    console.log(`   性能报告: 缓存条目数 ${performanceReport.cacheStats.skillCache.size}`);
    
    // 10. 导出数据
    console.log('10. 导出数据...');
    const exportDir = path.join(__dirname, 'test_exports');
    if (!require('fs').existsSync(exportDir)) {
      require('fs').mkdirSync(exportDir, { recursive: true });
    }
    
    knowledgeGraph.exportGraph(path.join(exportDir, 'skill_knowledge_graph.json'));
    feedbackManager.exportFeedbackData(path.join(exportDir, 'feedback_data.json'));
    performanceOptimizer.exportPerformanceData(path.join(exportDir, 'performance_data.json'));
    
    console.log('\n=== 技能系统测试完成 ===');
    console.log('测试结果: 成功');
    
  } catch (error) {
    console.error('测试失败:', error);
    console.log('\n=== 技能系统测试完成 ===');
    console.log('测试结果: 失败');
  } finally {
    // 清理资源
    if (typeof performanceOptimizer !== 'undefined') {
      performanceOptimizer.cleanup();
    }
  }
}

// 运行测试
testSkillSystem().catch(error => {
  console.error('执行测试失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
