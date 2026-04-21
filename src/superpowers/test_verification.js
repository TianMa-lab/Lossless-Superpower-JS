/**
 * 测试验证机制
 * 验证测试是否被正确记录
 */

const fs = require('fs');
const path = require('path');
const { permanentMemorySystem } = require('./permanent_memory');

class TestVerification {
  constructor() {
    this.verificationResults = new Map();
    this.recordedTests = new Set();
    this.missingTests = new Set();
  }

  /**
   * 初始化验证器
   */
  async init() {
    await permanentMemorySystem.init();
  }

  /**
   * 验证测试是否被记录
   * @param {string} testName - 测试名称
   * @returns {boolean} 是否已记录
   */
  async verifyTestRecorded(testName) {
    const memories = await permanentMemorySystem.getMemories({
      tags: 'test',
      limit: 100
    });

    const isRecorded = memories.some(m => 
      m.content && m.content.includes(testName)
    );

    if (isRecorded) {
      this.recordedTests.add(testName);
    } else {
      this.missingTests.add(testName);
    }

    this.verificationResults.set(testName, {
      testName,
      isRecorded,
      verifiedAt: Date.now()
    });

    return isRecorded;
  }

  /**
   * 批量验证测试记录
   * @param {Array} testNames - 测试名称数组
   * @returns {Object} 验证结果
   */
  async verifyTestsRecorded(testNames) {
    const results = {
      total: testNames.length,
      recorded: 0,
      missing: 0,
      details: []
    };

    for (const testName of testNames) {
      const isRecorded = await this.verifyTestRecorded(testName);
      results.details.push({
        testName,
        isRecorded
      });
      if (isRecorded) {
        results.recorded++;
      } else {
        results.missing++;
      }
    }

    return results;
  }

  /**
   * 验证最近的测试记录
   * @param {number} hours - 最近多少小时
   * @returns {Object} 验证结果
   */
  async verifyRecentTests(hours = 24) {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    
    const memories = await permanentMemorySystem.getMemories({
      limit: 1000
    });

    const recentTestMemories = memories.filter(m => 
      m.type === 'test_result' && 
      m.timestamp >= cutoffTime
    );

    return {
      recentTests: recentTestMemories.length,
      cutoffTime: new Date(cutoffTime).toISOString(),
      tests: recentTestMemories.map(m => ({
        name: m.metadata?.testName || m.metadata?.testId,
        status: m.metadata?.status,
        timestamp: m.timestamp
      }))
    };
  }

  /**
   * 获取记录统计
   * @returns {Object} 统计信息
   */
  getRecordingStats() {
    return {
      recordedTests: this.recordedTests.size,
      missingTests: this.missingTests.size,
      totalVerified: this.verificationResults.size,
      missingTestList: Array.from(this.missingTests)
    };
  }

  /**
   * 生成验证报告
   * @returns {Object} 验证报告
   */
  async generateVerificationReport() {
    const recentTests = await this.verifyRecentTests();
    const stats = this.getRecordingStats();

    return {
      summary: {
        recordingRate: stats.totalVerified > 0 ? 
          (stats.recordedTests / stats.totalVerified) * 100 : 0,
        totalVerified: stats.totalVerified,
        recorded: stats.recordedTests,
        missing: stats.missingTests
      },
      recentTests: recentTests.recentTests,
      missingTests: stats.missingTestList,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 检查测试框架集成
   * @returns {Object} 集成状态
   */
  async checkFrameworkIntegration() {
    const checks = {
      taskRunner: false,
      testWrapper: false,
      testHooks: false,
      testRecorder: false
    };

    // 检查TaskRunner
    try {
      const taskRunner = require('./task_runner');
      checks.taskRunner = !!taskRunner.TaskRunner;
    } catch (e) {
      checks.taskRunner = false;
    }

    // 检查TestWrapper
    try {
      const testWrapper = require('./test_task_wrapper');
      checks.testWrapper = !!testWrapper.TestTaskWrapper;
    } catch (e) {
      checks.testWrapper = false;
    }

    // 检查TestHooks
    try {
      const testHooks = require('./test_hooks');
      checks.testHooks = !!testHooks.TestHooks;
    } catch (e) {
      checks.testHooks = false;
    }

    // 检查TestRecorder
    try {
      const testRecorder = require('./test_result_recorder');
      checks.testRecorder = !!testRecorder.TestResultRecorder;
    } catch (e) {
      checks.testRecorder = false;
    }

    const allIntegrated = Object.values(checks).every(v => v);

    return {
      frameworkIntegration: checks,
      allIntegrated,
      status: allIntegrated ? 'ready' : 'incomplete'
    };
  }

  /**
   * 验证任务完成情况
   * @param {Array} taskIds - 任务ID数组
   * @returns {Object} 验证结果
   */
  async verifyTaskCompletion(taskIds) {
    const results = {
      completed: [],
      incomplete: [],
      notFound: []
    };

    for (const taskId of taskIds) {
      const memories = await permanentMemorySystem.getMemories({
        limit: 100
      });

      const taskMemory = memories.find(m => 
        m.metadata?.taskId === taskId ||
        m.content?.includes(taskId)
      );

      if (taskMemory) {
        if (taskMemory.type === 'task_completion') {
          results.completed.push(taskId);
        } else {
          results.incomplete.push(taskId);
        }
      } else {
        results.notFound.push(taskId);
      }
    }

    return {
      total: taskIds.length,
      completed: results.completed.length,
      incomplete: results.incomplete.length,
      notFound: results.notFound.length,
      details: results
    };
  }

  /**
   * 清空验证结果
   */
  clearVerificationResults() {
    this.verificationResults.clear();
    this.recordedTests.clear();
    this.missingTests.clear();
  }

  /**
   * 导出验证报告
   * @param {string} filePath - 文件路径
   */
  async exportVerificationReport(filePath) {
    const report = await this.generateVerificationReport();
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
      console.log(`[TestVerification] 验证报告已导出到: ${filePath}`);
    } catch (error) {
      console.error(`[TestVerification] 导出验证报告失败: ${error.message}`);
    }
  }
}

module.exports = {
  TestVerification
};
