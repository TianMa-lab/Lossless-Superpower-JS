/**
 * 测试任务包装器
 * 用于自动记录测试任务的执行过程
 */

const { TaskRunner } = require('./task_runner');
const { permanentMemorySystem } = require('./permanent_memory');

class TestTaskWrapper {
  constructor() {
    this.testRecords = new Map();
    this.recordEnabled = true;
    this.recordedTests = [];
  }

  /**
   * 包装测试函数，自动记录执行过程
   * @param {string} testName - 测试名称
   * @param {Function} testFn - 测试函数
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否存储到记忆系统
   * @param {number} options.memoryImportance - 记忆重要性
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.metadata - 元数据
   * @returns {Function} 包装后的测试函数
   */
  static wrapTestFunction(testName, testFn, options = {}) {
    return async (...args) => {
      const testId = `test_${testName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      const wrapper = new TestTaskWrapper();
      
      wrapper.testRecords.set(testId, {
        name: testName,
        startTime: Date.now(),
        status: 'running',
        steps: []
      });

      try {
        // 执行测试
        const result = await testFn(...args);
        
        const endTime = Date.now();
        const duration = endTime - wrapper.testRecords.get(testId).startTime;
        
        wrapper.testRecords.set(testId, {
          ...wrapper.testRecords.get(testId),
          endTime,
          duration,
          status: 'passed',
          result
        });

        // 记录成功结果
        await wrapper.recordTestSuccess(testId, testName, duration, options);
        
        wrapper.recordedTests.push({
          testId,
          testName,
          status: 'passed',
          duration
        });

        return result;
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - wrapper.testRecords.get(testId).startTime;
        
        wrapper.testRecords.set(testId, {
          ...wrapper.testRecords.get(testId),
          endTime,
          duration,
          status: 'failed',
          error: error.message
        });

        // 记录失败结果
        await wrapper.recordTestFailure(testId, testName, duration, error, options);
        
        wrapper.recordedTests.push({
          testId,
          testName,
          status: 'failed',
          duration,
          error: error.message
        });

        throw error;
      }
    };
  }

  /**
   * 包装测试套件
   * @param {string} suiteName - 测试套件名称
   * @param {Array} tests - 测试数组
   * @param {Object} options - 选项
   * @returns {Array} 包装后的测试数组
   */
  static wrapTestSuite(suiteName, tests, options = {}) {
    const wrapper = new TestTaskWrapper();
    
    return tests.map(test => {
      return {
        ...test,
        fn: TestTaskWrapper.wrapTestFunction(
          `${suiteName}: ${test.name}`,
          test.fn,
          {
            ...options,
            metadata: {
              ...(options.metadata || {}),
              suite: suiteName
            }
          }
        )
      };
    });
  }

  /**
   * 使用TaskRunner执行测试
   * @param {string} testName - 测试名称
   * @param {string} description - 测试描述
   * @param {Function} testFn - 测试函数
   * @param {Object} options - 选项
   * @returns {Promise<any>} 测试执行结果
   */
  static async runTestWithTracking(testName, description, testFn, options = {}) {
    const testId = `test_${testName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    return await TaskRunner.runTask(
      testId,
      testName,
      description,
      testFn,
      {
        storeInMemory: options.storeInMemory !== false,
        memoryImportance: options.memoryImportance || 3,
        memoryTags: options.memoryTags || 'test,automated',
        memoryMetadata: {
          ...(options.metadata || {}),
          type: 'automated_test'
        },
        resultMessage: `测试 ${testName} 执行成功`
      }
    );
  }

  /**
   * 记录测试成功
   * @private
   */
  async recordTestSuccess(testId, testName, duration, options) {
    if (!this.recordEnabled) return;

    try {
      if (!this.memoryInitialized) {
        await permanentMemorySystem.init();
        this.memoryInitialized = true;
      }

      const memoryContent = `测试通过: ${testName}
测试ID: ${testId}
执行时间: ${duration}ms
状态: 通过
时间戳: ${new Date().toISOString()}`;

      await permanentMemorySystem.addMemory(
        memoryContent,
        {
          context: '测试',
          type: 'test_result',
          testId,
          testName,
          duration,
          status: 'passed',
          timestamp: Date.now(),
          ...(options.metadata || {})
        },
        options.memoryImportance || 3,
        options.memoryTags || 'test,passed,automated'
      );

      console.log(`[TestTaskWrapper] 测试 ${testName} 结果已记录`);
    } catch (error) {
      console.error(`[TestTaskWrapper] 记录测试结果失败: ${error.message}`);
    }
  }

  /**
   * 记录测试失败
   * @private
   */
  async recordTestFailure(testId, testName, duration, error, options) {
    if (!this.recordEnabled) return;

    try {
      if (!this.memoryInitialized) {
        await permanentMemorySystem.init();
        this.memoryInitialized = true;
      }

      const memoryContent = `测试失败: ${testName}
测试ID: ${testId}
执行时间: ${duration}ms
状态: 失败
错误信息: ${error.message}
时间戳: ${new Date().toISOString()}`;

      await permanentMemorySystem.addMemory(
        memoryContent,
        {
          context: '测试',
          type: 'test_result',
          testId,
          testName,
          duration,
          status: 'failed',
          error: error.message,
          timestamp: Date.now(),
          ...(options.metadata || {})
        },
        options.memoryImportance || 4, // 失败测试更重要
        `${options.memoryTags || 'test,automated'},failed,error`
      );

      console.log(`[TestTaskWrapper] 测试 ${testName} 失败结果已记录`);
    } catch (error) {
      console.error(`[TestTaskWrapper] 记录测试失败结果失败: ${error.message}`);
    }
  }

  /**
   * 获取测试记录
   * @returns {Array} 测试记录数组
   */
  getTestRecords() {
    return Array.from(this.testRecords.values());
  }

  /**
   * 获取已记录的测试
   * @returns {Array} 已记录的测试数组
   */
  getRecordedTests() {
    return this.recordedTests;
  }

  /**
   * 启用记录
   */
  enableRecording() {
    this.recordEnabled = true;
  }

  /**
   * 禁用记录
   */
  disableRecording() {
    this.recordEnabled = false;
  }

  /**
   * 清空记录
   */
  clearRecords() {
    this.testRecords.clear();
    this.recordedTests = [];
  }

  /**
   * 生成测试报告
   * @returns {Object} 测试报告
   */
  generateReport() {
    const tests = this.recordedTests;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);

    return {
      total: tests.length,
      passed,
      failed,
      passRate: tests.length > 0 ? (passed / tests.length) * 100 : 0,
      totalDuration,
      averageDuration: tests.length > 0 ? totalDuration / tests.length : 0,
      tests: tests,
      timestamp: Date.now()
    };
  }
}

// 初始化记忆系统标志
TestTaskWrapper.memoryInitialized = false;

module.exports = {
  TestTaskWrapper
};
