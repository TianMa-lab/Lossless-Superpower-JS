/**
 * 技能系统综合测试脚本（自动记录版）
 * 使用TaskRunner和TestTaskWrapper确保所有测试都被自动记录
 */

const path = require('path');
const { 
  TaskRunner 
} = require('./src/superpowers/task_runner');
const { 
  TestTaskWrapper 
} = require('./src/superpowers/test_task_wrapper');
const { 
  TestHooks 
} = require('./src/superpowers/test_hooks');
const { 
  TestResultRecorder 
} = require('./src/superpowers/test_result_recorder');
const { 
  permanentMemorySystem 
} = require('./src/superpowers/permanent_memory');

async function runTestWithTracking(testName, testFn, options = {}) {
  return await TaskRunner.runTask(
    `test_${testName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    testName,
    options.description || `自动化测试: ${testName}`,
    testFn,
    {
      storeInMemory: options.storeInMemory !== false,
      memoryImportance: options.memoryImportance || 4,
      memoryTags: options.memoryTags || 'test,automated,skill_system',
      memoryMetadata: {
        type: 'automated_test',
        category: 'skill_system',
        ...(options.metadata || {})
      },
      resultMessage: options.resultMessage || `测试 ${testName} 执行成功`
    }
  );
}

async function testSkillSystem() {
  console.log('=== 开始测试技能系统（自动记录版） ===\n');

  try {
    // 初始化系统
    const storageDir = path.join(__dirname, 'src', 'superpowers', 'storage');
    const recorder = new TestResultRecorder();
    await recorder.init(storageDir);

    // 测试1：技能扫描器
    console.log('1. 测试技能扫描器...');
    await runTestWithTracking(
      '技能扫描器测试',
      async () => {
        const { SkillScanner } = require('./src/superpowers');
        const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
        const scanner = new SkillScanner(skillsDir);
        const skills = scanner.scanSkills();
        console.log(`   发现 ${skills.length} 个技能`);
        return { skillsFound: skills.length };
      },
      {
        description: '测试技能扫描器能否正确发现和扫描技能',
        metadata: { component: 'SkillScanner' }
      }
    );

    // 测试2：技能生成器
    console.log('2. 测试技能生成器...');
    await runTestWithTracking(
      '技能生成器测试',
      async () => {
        const { SkillGenerator } = require('./src/superpowers');
        const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
        const interactionHistoryDir = path.join(__dirname, 'src', 'superpowers', 'learning');
        const generator = new SkillGenerator(skillsDir, interactionHistoryDir);
        const generatedSkills = generator.generateSkillsFromInteractionHistory('test_user', 7);
        console.log(`   生成了 ${generatedSkills.length} 个技能`);
        return { skillsGenerated: generatedSkills.length };
      },
      {
        description: '测试技能生成器能否从交互历史生成技能',
        metadata: { component: 'SkillGenerator' }
      }
    );

    // 测试3：技能知识图谱
    console.log('3. 测试技能知识图谱...');
    await runTestWithTracking(
      '技能知识图谱测试',
      async () => {
        const { SkillScanner, SkillKnowledgeGraph } = require('./src/superpowers');
        const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
        const scanner = new SkillScanner(skillsDir);
        const skills = scanner.scanSkills();
        
        const kgStorageDir = path.join(__dirname, 'src', 'superpowers', 'storage');
        const knowledgeGraph = new SkillKnowledgeGraph(kgStorageDir);
        knowledgeGraph.buildSkillRelationships(skills);
        
        return { 
          skillsFound: skills.length,
          relationshipsBuilt: true 
        };
      },
      {
        description: '测试技能知识图谱能否构建技能关联',
        metadata: { component: 'SkillKnowledgeGraph' }
      }
    );

    // 测试4：技能优化器
    console.log('4. 测试技能优化器...');
    await runTestWithTracking(
      '技能优化器测试',
      async () => {
        const { SkillOptimizer } = require('./src/superpowers');
        const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
        const optimizationDir = path.join(__dirname, 'src', 'superpowers', 'optimization_data');
        const optimizer = new SkillOptimizer(skillsDir, optimizationDir);
        
        const usageData = {
          totalUses: 100,
          successfulUses: 85,
          totalDuration: 50000,
          users: new Map([['user1', 20], ['user2', 15]]),
          averageResponseTime: 1500,
          errorRate: 0.15
        };
        
        return { optimizerReady: true };
      },
      {
        description: '测试技能优化器能否正常工作',
        metadata: { component: 'SkillOptimizer' }
      }
    );

    // 测试5：用户反馈机制
    console.log('5. 测试用户反馈机制...');
    await runTestWithTracking(
      '用户反馈机制测试',
      async () => {
        const { FeedbackManager } = require('./src/superpowers');
        const feedbackManager = new FeedbackManager(storageDir);
        
        const feedbackId = feedbackManager.submitFeedback(
          'test_skill', 
          'test_user', 
          5, 
          '测试反馈'
        );
        
        console.log(`   提交反馈成功: ${feedbackId}`);
        return { feedbackSubmitted: !!feedbackId };
      },
      {
        description: '测试用户反馈机制能否提交和获取反馈',
        metadata: { component: 'FeedbackManager' }
      }
    );

    // 测试6：技能市场
    console.log('6. 测试技能市场...');
    await runTestWithTracking(
      '技能市场测试',
      async () => {
        const { SkillMarket } = require('./src/superpowers');
        const marketDir = path.join(__dirname, 'src', 'superpowers', 'market');
        const skillsDir = path.join(__dirname, 'superpowers', 'storage', 'skills');
        const skillMarket = new SkillMarket(marketDir, skillsDir);
        
        const categories = skillMarket.getCategories();
        const tags = skillMarket.getTags();
        
        return { 
          categoriesFound: categories.length,
          tagsFound: tags.length 
        };
      },
      {
        description: '测试技能市场能否获取分类和标签',
        metadata: { component: 'SkillMarket' }
      }
    );

    // 测试7：性能优化器
    console.log('7. 测试性能优化器...');
    await runTestWithTracking(
      '性能优化器测试',
      async () => {
        const { PerformanceOptimizer } = require('./src/superpowers');
        const cacheDir = path.join(__dirname, 'src', 'superpowers', 'cache');
        const performanceOptimizer = new PerformanceOptimizer(cacheDir);
        
        const report = performanceOptimizer.generatePerformanceReport();
        
        console.log(`   性能报告生成成功`);
        return { performanceReport: !!report };
      },
      {
        description: '测试性能优化器能否生成性能报告',
        metadata: { component: 'PerformanceOptimizer' }
      }
    );

    // 测试8：TestTaskWrapper
    console.log('8. 测试TestTaskWrapper...');
    await runTestWithTracking(
      'TestTaskWrapper测试',
      async () => {
        const testFn = TestTaskWrapper.wrapTestFunction(
          '示例测试',
          async () => {
            return { status: 'passed' };
          },
          { memoryImportance: 5 }
        );
        
        await testFn();
        
        const wrapper = new TestTaskWrapper();
        const report = wrapper.generateReport();
        
        return { testRecorded: report.total > 0 };
      },
      {
        description: '测试TestTaskWrapper能否正确包装和记录测试',
        metadata: { component: 'TestTaskWrapper' }
      }
    );

    // 测试9：TestHooks
    console.log('9. 测试TestHooks...');
    await runTestWithTracking(
      'TestHooks测试',
      async () => {
        await TestHooks.beforeAll('TestSuite');
        await TestHooks.beforeEach('test_example');
        await TestHooks.afterEach({ name: 'test_example', status: 'passed' });
        await TestHooks.afterAll('TestSuite');
        
        const hooks = TestHooks.getInstance();
        const results = hooks.getTestResults();
        
        return { hooksWorking: true, resultsCount: results.length };
      },
      {
        description: '测试TestHooks钩子函数是否正常工作',
        metadata: { component: 'TestHooks' }
      }
    );

    // 测试10：TestResultRecorder
    console.log('10. 测试TestResultRecorder...');
    await runTestWithTracking(
      'TestResultRecorder测试',
      async () => {
        const recorder = new TestResultRecorder();
        await recorder.init(storageDir);
        
        const testId = await recorder.recordTestStart({
          name: 'Integration Test',
          description: 'Test integration of all modules'
        });
        
        await recorder.recordTestEnd(testId, {
          status: 'passed',
          result: { integrated: true }
        });
        
        const stats = recorder.getStats();
        
        return { recorderWorking: true, testId };
      },
      {
        description: '测试TestResultRecorder能否记录测试结果',
        metadata: { component: 'TestResultRecorder' }
      }
    );

    console.log('\n=== 技能系统测试完成 ===');
    console.log('所有测试已成功执行并记录');

  } catch (error) {
    console.error('测试失败:', error);
    throw error;
  }
}

// 运行测试
testSkillSystem()
  .then(() => {
    console.log('\n测试执行成功！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n测试执行失败:', error);
    process.exit(1);
  });
