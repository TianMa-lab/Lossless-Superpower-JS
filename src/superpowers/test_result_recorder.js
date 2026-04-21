/**
 * 测试结果记录器
 * 统一管理测试结果的记录和查询
 */

const fs = require('fs');
const path = require('path');
const { permanentMemorySystem } = require('./permanent_memory');
const { iterationManager } = require('./iteration_manager');

class TestResultRecorder {
  constructor() {
    this.testRecords = new Map();
    this.recordStorageDir = null;
    this.initialized = false;
  }

  /**
   * 初始化记录器
   * @param {string} storageDir - 存储目录
   */
  async init(storageDir) {
    if (!this.initialized) {
      this.recordStorageDir = path.join(storageDir, 'test_records');
      
      if (!fs.existsSync(this.recordStorageDir)) {
        fs.mkdirSync(this.recordStorageDir, { recursive: true });
      }
      
      await permanentMemorySystem.init();
      this.initialized = true;
      
      // 加载历史记录
      await this.loadHistory();
    }
  }

  /**
   * 加载历史记录
   */
  async loadHistory() {
    try {
      const indexFile = path.join(this.recordStorageDir, 'index.json');
      
      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf-8');
        const data = JSON.parse(content);
        
        for (const [testId, record] of Object.entries(data)) {
          this.testRecords.set(testId, record);
        }
        
        console.log(`[TestResultRecorder] 加载了 ${this.testRecords.size} 条历史记录`);
      }
    } catch (error) {
      console.error(`[TestResultRecorder] 加载历史记录失败: ${error.message}`);
    }
  }

  /**
   * 保存记录索引
   */
  async saveIndex() {
    try {
      const indexFile = path.join(this.recordStorageDir, 'index.json');
      const data = Object.fromEntries(this.testRecords);
      fs.writeFileSync(indexFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`[TestResultRecorder] 保存记录索引失败: ${error.message}`);
    }
  }

  /**
   * 记录测试开始
   * @param {Object} testInfo - 测试信息
   */
  async recordTestStart(testInfo) {
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const record = {
      id: testId,
      name: testInfo.name,
      description: testInfo.description || '',
      startTime: Date.now(),
      endTime: null,
      duration: null,
      status: 'running',
      result: null,
      error: null,
      metadata: testInfo.metadata || {},
      steps: [],
      createdAt: new Date().toISOString()
    };
    
    this.testRecords.set(testId, record);
    await this.saveIndex();
    
    console.log(`[TestResultRecorder] 记录测试开始: ${testInfo.name}`);
    return testId;
  }

  /**
   * 记录测试结束
   * @param {string} testId - 测试ID
   * @param {Object} testResult - 测试结果
   */
  async recordTestEnd(testId, testResult) {
    const record = this.testRecords.get(testId);
    
    if (!record) {
      console.warn(`[TestResultRecorder] 测试记录不存在: ${testId}`);
      return;
    }
    
    record.endTime = Date.now();
    record.duration = record.endTime - record.startTime;
    record.status = testResult.status || 'completed';
    record.result = testResult.result || null;
    record.error = testResult.error || null;
    
    if (testResult.steps) {
      record.steps = testResult.steps;
    }
    
    await this.saveIndex();
    
    console.log(`[TestResultRecorder] 记录测试结束: ${record.name}, 状态: ${record.status}`);
  }

  /**
   * 记录测试结果
   * @param {Object} testResult - 测试结果
   */
  async recordTestResult(testResult) {
    try {
      // 存储到文件系统
      const recordFile = path.join(this.recordStorageDir, `${testResult.id}.json`);
      fs.writeFileSync(recordFile, JSON.stringify(testResult, null, 2), 'utf-8');
      
      // 存储到记忆系统
      await this.recordToMemory(testResult);
      
      // 如果是重要测试，记录到迭代
      if (testResult.metadata?.important || testResult.status === 'failed') {
        await this.recordToIteration(testResult);
      }
      
      console.log(`[TestResultRecorder] 测试结果已记录: ${testResult.name}`);
    } catch (error) {
      console.error(`[TestResultRecorder] 记录测试结果失败: ${error.message}`);
    }
  }

  /**
   * 记录到记忆系统
   * @private
   */
  async recordToMemory(testResult) {
    const memoryContent = `测试结果: ${testResult.name}
状态: ${testResult.status}
执行时间: ${testResult.duration || 0}ms
${testResult.error ? `错误信息: ${testResult.error}` : ''}
描述: ${testResult.description || '无'}
时间戳: ${testResult.createdAt}`;

    await permanentMemorySystem.addMemory(
      memoryContent,
      {
        context: '测试',
        type: 'test_result_record',
        testId: testResult.id,
        testName: testResult.name,
        status: testResult.status,
        duration: testResult.duration,
        error: testResult.error,
        timestamp: Date.now(),
        ...testResult.metadata
      },
      testResult.status === 'failed' ? 4 : 3,
      `test,record,${testResult.status}`
    );
  }

  /**
   * 记录到迭代系统
   * @private
   */
  async recordToIteration(testResult) {
    const iteration = {
      version: `1.0.${Date.now()}`,
      title: `测试 ${testResult.status === 'failed' ? '失败' : '完成'}: ${testResult.name}`,
      description: `测试${testResult.status === 'failed' ? '失败' : '完成'}记录 - ${testResult.description || ''}`,
      updates: [
        `测试: ${testResult.name}`,
        `状态: ${testResult.status}`,
        `耗时: ${testResult.duration || 0}ms`
      ],
      filesModified: [],
      featuresAdded: [],
      featuresImproved: [],
      performanceChanges: [],
      bugFixes: testResult.status === 'failed' ? [testResult.error] : [],
      issues: testResult.status === 'failed' ? [testResult.error] : [],
      notes: testResult.status === 'failed' ? '需要调查和修复' : '测试通过',
      author: 'TestResultRecorder',
      status: 'completed'
    };
    
    iterationManager.addIteration(iteration);
    console.log(`[TestResultRecorder] 迭代记录已创建: ${iteration.title}`);
  }

  /**
   * 记录套件结果
   * @param {Object} suiteResult - 套件结果
   */
  async recordSuiteResult(suiteResult) {
    try {
      const recordFile = path.join(this.recordStorageDir, `suite_${Date.now()}.json`);
      fs.writeFileSync(recordFile, JSON.stringify(suiteResult, null, 2), 'utf-8');
      
      // 记录到记忆系统
      const memoryContent = `测试套件: ${suiteResult.name}
测试数: ${suiteResult.testCount}
通过: ${suiteResult.passedCount}
失败: ${suiteResult.failedCount}
通过率: ${suiteResult.passRate}%
总耗时: ${suiteResult.totalDuration}ms
时间戳: ${new Date().toISOString()}`;

      await permanentMemorySystem.addMemory(
        memoryContent,
        {
          context: '测试',
          type: 'test_suite_record',
          suiteName: suiteResult.name,
          testCount: suiteResult.testCount,
          passedCount: suiteResult.passedCount,
          failedCount: suiteResult.failedCount,
          passRate: suiteResult.passRate,
          totalDuration: suiteResult.totalDuration,
          timestamp: Date.now()
        },
        4,
        'test,suite,record'
      );
      
      console.log(`[TestResultRecorder] 套件结果已记录: ${suiteResult.name}`);
    } catch (error) {
      console.error(`[TestResultRecorder] 记录套件结果失败: ${error.message}`);
    }
  }

  /**
   * 获取测试记录
   * @param {Object} filters - 过滤条件
   * @returns {Array} 测试记录数组
   */
  async getTestRecords(filters = {}) {
    let records = Array.from(this.testRecords.values());
    
    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }
    
    if (filters.name) {
      records = records.filter(r => r.name.includes(filters.name));
    }
    
    if (filters.startDate) {
      records = records.filter(r => r.startTime >= new Date(filters.startDate).getTime());
    }
    
    if (filters.endDate) {
      records = records.filter(r => r.startTime <= new Date(filters.endDate).getTime());
    }
    
    // 按时间排序
    records.sort((a, b) => b.startTime - a.startTime);
    
    // 限制数量
    if (filters.limit) {
      records = records.slice(0, filters.limit);
    }
    
    return records;
  }

  /**
   * 生成测试报告
   * @param {Object} filters - 过滤条件
   * @returns {Object} 测试报告
   */
  async generateTestReport(filters = {}) {
    const records = await this.getTestRecords(filters);
    
    const passed = records.filter(r => r.status === 'passed').length;
    const failed = records.filter(r => r.status === 'failed').length;
    const total = records.length;
    const totalDuration = records.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    return {
      summary: {
        total,
        passed,
        failed,
        passRate: total > 0 ? (passed / total) * 100 : 0,
        totalDuration,
        averageDuration: total > 0 ? totalDuration / total : 0
      },
      records,
      filters,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 导出报告到文件
   * @param {string} filePath - 文件路径
   * @param {Object} filters - 过滤条件
   */
  async exportReport(filePath, filters = {}) {
    const report = await this.generateTestReport(filters);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
      console.log(`[TestResultRecorder] 测试报告已导出到: ${filePath}`);
    } catch (error) {
      console.error(`[TestResultRecorder] 导出测试报告失败: ${error.message}`);
    }
  }

  /**
   * 清空记录
   */
  async clearRecords() {
    this.testRecords.clear();
    await this.saveIndex();
    console.log(`[TestResultRecorder] 测试记录已清空`);
  }

  /**
   * 获取记录统计
   * @returns {Object} 统计信息
   */
  getStats() {
    const records = Array.from(this.testRecords.values());
    
    return {
      totalRecords: records.length,
      passedCount: records.filter(r => r.status === 'passed').length,
      failedCount: records.filter(r => r.status === 'failed').length,
      runningCount: records.filter(r => r.status === 'running').length,
      storageDir: this.recordStorageDir
    };
  }
}

module.exports = {
  TestResultRecorder
};
