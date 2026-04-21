const path = require('path');
const { SkillScanner } = require('../src/superpowers/skill_scanner');
const { SkillGenerator } = require('../src/superpowers/skill_generator');
const { SkillKnowledgeGraph } = require('../src/superpowers/skill_knowledge_graph');
const { SkillOptimizer } = require('../src/superpowers/skill_optimizer');
const { SkillMarket } = require('../src/superpowers/skill_market');
const SkillAnalytics = require('../src/superpowers/skill_analytics');

// 测试目录
const testSkillsDir = path.join(__dirname, 'test_skills');
const testMarketDir = path.join(__dirname, 'test_market');
const testOptimizationDir = path.join(__dirname, 'test_optimization');
const testAnalyticsDir = path.join(__dirname, 'test_analytics');

// 清理测试目录
const fs = require('fs');
const rimraf = require('rimraf');

function cleanupTestDirs() {
  const dirs = [testSkillsDir, testMarketDir, testOptimizationDir, testAnalyticsDir];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      rimraf.sync(dir);
    }
    fs.mkdirSync(dir, { recursive: true });
  });
}

describe('技能系统测试', () => {
  let skillScanner;
  let skillGenerator;
  let skillKnowledgeGraph;
  let skillOptimizer;
  let skillMarket;
  let skillAnalytics;

  beforeAll(() => {
    cleanupTestDirs();
    
    // 初始化各个模块
    skillScanner = new SkillScanner(testSkillsDir);
    skillGenerator = new SkillGenerator(testSkillsDir, testSkillsDir);
    skillKnowledgeGraph = new SkillKnowledgeGraph(testSkillsDir);
    skillOptimizer = new SkillOptimizer(testSkillsDir, testOptimizationDir);
    skillMarket = new SkillMarket(testMarketDir, testSkillsDir);
    skillAnalytics = new SkillAnalytics(testAnalyticsDir);
  });

  afterAll(() => {
    cleanupTestDirs();
  });

  describe('SkillScanner 测试', () => {
    test('扫描技能目录', () => {
      const skills = skillScanner.scanSkills();
      expect(Array.isArray(skills)).toBe(true);
    });

    test('获取技能信息', () => {
      const skillInfo = skillScanner.getSkill('test_skill');
      expect(skillInfo).toBeUndefined();
    });
  });

  describe('SkillGenerator 测试', () => {
    test('从交互历史生成技能', () => {
      const result = skillGenerator.generateSkillsFromInteractionHistory('user1', 7);
      expect(Array.isArray(result)).toBe(true);
    });

    test('使用NLP分析内容', () => {
      const content = '# 描述\n这是一个测试技能';
      const analysis = skillGenerator._analyzeWithNLP(content);
      expect(typeof analysis).toBe('object');
    });
  });

  describe('SkillKnowledgeGraph 测试', () => {
    test('添加技能节点', () => {
      const skillData = {
        name: 'test_skill',
        description: '测试技能',
        category: 'test'
      };
      skillKnowledgeGraph.addSkillNode('test_skill', skillData);
      const skill = skillKnowledgeGraph.getSkill('test_skill');
      expect(skill).toBeDefined();
    });

    test('获取技能推荐', () => {
      const recommendations = skillKnowledgeGraph.getSkillRecommendations('test_skill');
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('SkillOptimizer 测试', () => {
    test('优化技能', () => {
      // 创建测试技能文件
      const skillDir = path.join(testSkillsDir, 'test_skill');
      fs.mkdirSync(skillDir, { recursive: true });
      const skillContent = '# 描述\n这是一个测试技能';
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);

      const usageData = {
        totalUses: 100,
        successfulUses: 80,
        totalDuration: 50000,
        users: new Map([['user1', 10], ['user2', 5]]),
        averageResponseTime: 1000,
        errorRate: 0.2
      };

      const result = skillOptimizer.optimizeSkill('test_skill', usageData);
      expect(result.success).toBe(true);
    });

    test('启用自动优化', () => {
      skillOptimizer.enableAutoOptimization({ interval: 1000 });
      expect(skillOptimizer.autoOptimizationEnabled).toBe(true);
      skillOptimizer.disableAutoOptimization();
    });
  });

  describe('SkillMarket 测试', () => {
    test('发布技能到市场', () => {
      // 创建测试技能文件
      const skillDir = path.join(testSkillsDir, 'market_skill');
      fs.mkdirSync(skillDir, { recursive: true });
      const skillContent = '# 描述\n这是一个市场测试技能';
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);

      const marketSkillId = skillMarket.publishSkill('market_skill', 'user1', {
        description: '市场测试技能',
        tags: ['test', 'market'],
        category: 'testing'
      });
      expect(marketSkillId).toBeDefined();
    });

    test('搜索技能', () => {
      const results = skillMarket.searchSkills('test');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('SkillAnalytics 测试', () => {
    test('记录技能使用', () => {
      const result = skillAnalytics.recordSkillUsage('test_skill', 'user1', {
        success: true,
        duration: 1000,
        parameters: {}
      });
      expect(result).toBe(true);
    });

    test('获取技能使用统计', () => {
      const stats = skillAnalytics.getSkillUsageStats('test_skill');
      expect(typeof stats).toBe('object');
    });

    test('生成技能分析报告', () => {
      const report = skillAnalytics.generateSkillReport('test_skill');
      expect(typeof report).toBe('object');
    });
  });
});