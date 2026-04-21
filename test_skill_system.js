/**
 * 技能系统测试脚本
 * 测试Hermes技能系统的核心功能
 */

const path = require('path');
const { 
  SkillScanner, 
  SkillGenerator, 
  SkillKnowledgeGraph, 
  SkillOptimizer 
} = require('./src/superpowers');

async function testSkillSystem() {
  console.log('=== 开始测试技能系统 ===\n');
  
  try {
    // 1. 初始化技能扫描器
    console.log('1. 初始化技能扫描器...');
    const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
    const scanner = new SkillScanner(skillsDir);
    
    // 2. 扫描技能
    console.log('2. 扫描技能...');
    const skills = scanner.scanSkills();
    console.log(`   发现 ${skills.length} 个技能`);
    
    // 3. 初始化技能生成器
    console.log('3. 初始化技能生成器...');
    const interactionHistoryDir = path.join(__dirname, 'src', 'superpowers', 'learning');
    const generator = new SkillGenerator(skillsDir, interactionHistoryDir);
    
    // 4. 初始化技能知识图谱
    console.log('4. 初始化技能知识图谱...');
    const storageDir = path.join(__dirname, 'src', 'superpowers', 'storage');
    const knowledgeGraph = new SkillKnowledgeGraph(storageDir);
    
    // 5. 构建技能关联
    console.log('5. 构建技能关联...');
    knowledgeGraph.buildSkillRelationships(skills);
    
    // 6. 初始化技能优化器
    console.log('6. 初始化技能优化器...');
    const optimizationDir = path.join(__dirname, 'src', 'superpowers', 'optimization_data');
    const optimizer = new SkillOptimizer(skillsDir, optimizationDir);
    
    // 7. 测试技能推荐
    console.log('7. 测试技能推荐...');
    if (skills.length > 0) {
      const testSkill = skills[0].name;
      const recommendations = knowledgeGraph.getSkillRecommendations(testSkill, 5);
      console.log(`   为技能 ${testSkill} 推荐的技能:`);
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.skill} (相似度: ${(rec.score * 100).toFixed(2)}%)`);
      });
    }
    
    // 8. 测试技能优化
    console.log('8. 测试技能优化...');
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
    
    // 9. 生成技能知识图谱报告
    console.log('9. 生成技能知识图谱报告...');
    const report = knowledgeGraph.generateReport();
    console.log(`   总技能数: ${report.totalSkills}`);
    console.log(`   总关联数: ${report.totalRelationships}`);
    console.log(`   总使用次数: ${report.usageStats.totalUses}`);
    console.log(`   平均成功率: ${(report.usageStats.averageSuccessRate * 100).toFixed(2)}%`);
    
    // 10. 导出技能知识图谱
    console.log('10. 导出技能知识图谱...');
    const exportPath = path.join(__dirname, 'skill_knowledge_graph_export.json');
    knowledgeGraph.exportGraph(exportPath);
    
    // 11. 导出优化报告
    console.log('11. 导出优化报告...');
    const optimizationExportPath = path.join(__dirname, 'skill_optimization_report.json');
    optimizer.exportOptimizationData(optimizationExportPath);
    
    console.log('\n=== 技能系统测试完成 ===');
    console.log('测试结果: 成功');
    
  } catch (error) {
    console.error('测试失败:', error);
    console.log('\n=== 技能系统测试完成 ===');
    console.log('测试结果: 失败');
  }
}

// 运行测试
testSkillSystem().catch(error => {
  console.error('执行测试失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
