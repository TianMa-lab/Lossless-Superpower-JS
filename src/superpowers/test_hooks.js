/**
 * 测试钩子和监听器
 * 用于自动拦截和记录测试执行过程
 */

const { permanentMemorySystem } = require('./permanent_memory');

class TestHooks {
  constructor() {
    this.listeners = new Map();
    this.testStartTime = new Map();
    this.testResults = new Map();
    this.suiteResults = new Map();
    this.initialized = false;
  }

  /**
   * 初始化钩子系统
   */
  async init() {
    if (!this.initialized) {
      await permanentMemorySystem.init();
      this.initialized = true;
    }
  }

  /**
   * beforeAll钩子 - 测试套件开始前
   * @param {string} suiteName - 测试套件名称
   */
  static async beforeAll(suiteName) {
    const hook = TestHooks.getInstance();
    await hook.init();
    
    hook.suiteResults.set(suiteName, {
      suiteName,
      startTime: Date.now(),
      tests: [],
      status: 'running'
    });
    
    console.log(`[TestHooks] 测试套件开始: ${suiteName}`);
  }

  /**
   * afterAll钩子 - 测试套件结束后
   * @param {string} suiteName - 测试套件名称
   */
  static async afterAll(suiteName) {
    const hook = TestHooks.getInstance();
    await hook.init();
    
    const suite = hook.suiteResults.get(suiteName);
    if (suite) {
      suite.endTime = Date.now();
      suite.duration = suite.endTime - suite.startTime;
      suite.status = 'completed';
      
      // 记录套件结果
      await hook.recordSuiteResult(suite);
    }
    
    console.log(`[TestHooks] 测试套件结束: ${suiteName}, 耗时: ${suite?.duration || 0}ms`);
  }

  /**
   * beforeEach钩子 - 每个测试开始前
   * @param {string} testName - 测试名称
   */
  static async beforeEach(testName) {
    const hook = TestHooks.getInstance();
    await hook.init();
    
    hook.testStartTime.set(testName, Date.now());
    
    console.log(`[TestHooks] 测试开始: ${testName}`);
  }

  /**
   * afterEach钩子 - 每个测试结束后
   * @param {Object} testInfo - 测试信息
   */
  static async afterEach(testInfo) {
    const hook = TestHooks.getInstance();
    await hook.init();
    
    const startTime = hook.testStartTime.get(testInfo.name) || Date.now();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const result = {
      name: testInfo.name,
      status: testInfo.status || 'unknown',
      duration,
      startTime,
      endTime,
      error: testInfo.error || null,
      metadata: testInfo.metadata || {}
    };
    
    hook.testResults.set(testInfo.name, result);
    hook.testStartTime.delete(testInfo.name);
    
    // 记录测试结果
    await hook.recordTestResult(result);
    
    console.log(`[TestHooks] 测试结束: ${testInfo.name}, 状态: ${result.status}, 耗时: ${duration}ms`);
  }

  /**
   * 记录测试结果
   * @private
   */
  async recordTestResult(result) {
    try {
      const memoryContent = `测试结果: ${result.name}
状态: ${result.status}
执行时间: ${result.duration}ms
${result.error ? `错误信息: ${result.error}` : ''}
时间戳: ${new Date().toISOString()}`;

      await permanentMemorySystem.addMemory(
        memoryContent,
        {
          context: '测试',
          type: 'test_result',
          testName: result.name,
          status: result.status,
          duration: result.duration,
          error: result.error,
          timestamp: Date.now(),
          ...result.metadata
        },
        result.status === 'failed' ? 4 : 3,
        `test,result,${result.status}`
      );
    } catch (error) {
      console.error(`[TestHooks] 记录测试结果失败: ${error.message}`);
    }
  }

  /**
   * 记录测试套件结果
   * @private
   */
  async recordSuiteResult(suite) {
    try {
      const passedTests = suite.tests.filter(t => t.status === 'passed').length;
      const failedTests = suite.tests.filter(t => t.status === 'failed').length;
      
      const memoryContent = `测试套件结果: ${suite.suiteName}
总测试数: ${suite.tests.length}
通过: ${passedTests}
失败: ${failedTests}
通过率: ${suite.tests.length > 0 ? (passedTests / suite.tests.length) * 100 : 0}%
执行时间: ${suite.duration}ms
状态: ${suite.status}
时间戳: ${new Date().toISOString()}`;

      await permanentMemorySystem.addMemory(
        memoryContent,
        {
          context: '测试',
          type: 'test_suite_result',
          suiteName: suite.suiteName,
          testCount: suite.tests.length,
          passedCount: passedTests,
          failedCount: failedTests,
          passRate: suite.tests.length > 0 ? (passedTests / suite.tests.length) * 100 : 0,
          duration: suite.duration,
          status: suite.status,
          timestamp: Date.now()
        },
        4,
        'test,suite,result'
      );
    } catch (error) {
      console.error(`[TestHooks] 记录测试套件结果失败: ${error.message}`);
    }
  }

  /**
   * 添加监听器
   * @param {string} event - 事件名称
   * @param {Function} listener - 监听器函数
   */
  addListener(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
  }

  /**
   * 移除监听器
   * @param {string} event - 事件名称
   * @param {Function} listener - 监听器函数
   */
  removeListener(event, listener) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {Object} data - 事件数据
   */
  async emit(event, data) {
    if (this.listeners.has(event)) {
      for (const listener of this.listeners.get(event)) {
        try {
          await listener(data);
        } catch (error) {
          console.error(`[TestHooks] 触发事件 ${event} 失败: ${error.message}`);
        }
      }
    }
  }

  /**
   * 获取测试结果
   * @returns {Array} 测试结果数组
   */
  getTestResults() {
    return Array.from(this.testResults.values());
  }

  /**
   * 获取套件结果
   * @returns {Array} 套件结果数组
   */
  getSuiteResults() {
    return Array.from(this.suiteResults.values());
  }

  /**
   * 清空结果
   */
  clearResults() {
    this.testResults.clear();
    this.suiteResults.clear();
    this.testStartTime.clear();
  }

  /**
   * 获取单例实例
   * @private
   */
  static getInstance() {
    if (!TestHooks.instance) {
      TestHooks.instance = new TestHooks();
    }
    return TestHooks.instance;
  }
}

// 导出Mocha风格的钩子函数
const beforeAll = TestHooks.beforeAll;
const afterAll = TestHooks.afterAll;
const beforeEach = TestHooks.beforeEach;
const afterEach = TestHooks.afterEach;

module.exports = {
  TestHooks,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach
};
