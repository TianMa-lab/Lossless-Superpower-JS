/**
 * Jest自动任务记录设置文件
 * Jest会在所有测试之前自动执行此文件
 */

const { taskTracker } = require('./src/superpowers/task_tracker');
const { permanentMemorySystem } = require('./src/superpowers/permanent_memory');
const path = require('path');
const fs = require('fs');

let isRecordingEnabled = false;

/**
 * 启用自动记录
 */
async function enableAutoRecording() {
  if (isRecordingEnabled) return;

  try {
    // 获取或创建会话ID
    const sessionFile = path.join(__dirname, '.jest_session_id');
    let sessionId = null;

    if (fs.existsSync(sessionFile)) {
      sessionId = fs.readFileSync(sessionFile, 'utf-8');
    } else {
      sessionId = `jest_session_${Date.now()}`;
      taskTracker.startTask(
        sessionId,
        'Jest测试会话',
        '自动化测试执行会话',
        { type: 'jest_session' }
      );
    }

    // 包装全局test和it函数
    wrapTestFunction('test', sessionId);
    wrapTestFunction('it', sessionId);

    // 包装describe
    wrapDescribeFunction(sessionId);

    isRecordingEnabled = true;
    console.log('[AutoRecord] 自动任务记录已启用');

    return sessionId;
  } catch (error) {
    console.error('[AutoRecord] 启用失败:', error.message);
    return null;
  }
}

/**
 * 包装test/it函数
 */
function wrapTestFunction(fnName, sessionId) {
  const originalFn = global[fnName];

  if (typeof originalFn !== 'function') {
    console.warn(`[AutoRecord] ${fnName} 函数不存在`);
    return;
  }

  // 使用Object.defineProperty替换，确保属性描述符正确
  Object.defineProperty(global, fnName, {
    value: function(testName, testFn, timeout) {
      // 如果是被包装的函数，直接调用
      if (testFn && testFn.__isWrapped__) {
        return originalFn.call(this, testName, testFn.__originalFn__, timeout);
      }

      // 包装测试函数
      const wrappedFn = wrapTestForRecording(testName, testFn, fnName, sessionId);
      wrappedFn.__originalFn__ = testFn;
      wrappedFn.__isWrapped__ = true;

      return originalFn.call(this, testName, wrappedFn, timeout);
    },
    writable: true,
    configurable: true,
    enumerable: true
  });

  // 复制test.only, test.skip等
  if (originalFn.only) {
    global[fnName].only = function(testName, testFn, timeout) {
      const wrappedFn = wrapTestForRecording(testName, testFn, `${fnName}.only`, sessionId);
      wrappedFn.__originalFn__ = testFn;
      wrappedFn.__isWrapped__ = true;
      return originalFn.only.call(this, testName, wrappedFn, timeout);
    };
  }

  if (originalFn.skip) {
    global[fnName].skip = function(testName, testFn, timeout) {
      const wrappedFn = wrapTestForRecording(testName, testFn, `${fnName}.skip`, sessionId);
      wrappedFn.__originalFn__ = testFn;
      wrappedFn.__isWrapped__ = true;
      return originalFn.skip.call(this, testName, wrappedFn, timeout);
    };
  }

  if (originalFn.each) {
    global[fnName].each = originalFn.each;
  }
}

/**
 * 包装describe函数
 */
function wrapDescribeFunction(sessionId) {
  const originalDescribe = global.describe;

  if (typeof originalDescribe !== 'function') {
    console.warn('[AutoRecord] describe 函数不存在');
    return;
  }

  Object.defineProperty(global, 'describe', {
    value: function suiteName(testName, fn) {
      // 包装describe内的test
      const wrappedFn = function() {
        // 临时包装test和it
        const tempTest = global.test;
        const tempIt = global.it;
        wrapTestFunction('test', sessionId);
        wrapTestFunction('it', sessionId);

        try {
          fn();
        } finally {
          // 恢复
        }
      };

      return originalDescribe.call(this, testName, wrappedFn);
    },
    writable: true,
    configurable: true,
    enumerable: true
  });
}

/**
 * 包装测试函数进行记录
 */
function wrapTestForRecording(testName, testFn, testType, sessionId) {
  return async function(...args) {
    const testId = `jest_${testType}_${testName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    // 开始任务追踪
    taskTracker.startTask(
      testId,
      testName,
      `测试: ${testName}`,
      {
        type: 'jest_test',
        sessionId,
        testType
      }
    );

    const startTime = Date.now();

    try {
      // 执行原始测试
      if (testFn.length > 0) {
        await new Promise((resolve, reject) => {
          testFn(...args, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } else {
        await testFn(...args);
      }

      // 测试通过
      const duration = Date.now() - startTime;
      taskTracker.completeTask(testId, `✓ ${testName} (${duration}ms)`);

      // 记录到记忆系统
      await recordTestResult(testName, testId, {
        status: 'passed',
        duration,
        testType
      });

      return true;
    } catch (error) {
      // 测试失败
      const duration = Date.now() - startTime;
      taskTracker.completeTask(testId, `✗ ${testName}: ${error.message}`);

      // 记录到记忆系统
      await recordTestResult(testName, testId, {
        status: 'failed',
        duration,
        error: error.message,
        testType
      });

      throw error;
    }
  };
}

/**
 * 记录测试结果
 */
async function recordTestResult(testName, testId, result) {
  try {
    const memoryContent = `Jest自动化测试结果

测试名称: ${testName}
测试ID: ${testId}
测试类型: ${result.testType || 'test'}
状态: ${result.status}
执行时间: ${result.duration}ms
${result.error ? `错误信息: ${result.error}` : ''}
时间戳: ${new Date().toISOString()}
`;

    await permanentMemorySystem.addMemory(
      memoryContent.trim(),
      'test_result',
      result.status === 'passed' ? 3 : 5,
      `jest,test,${result.status}`,
      {
        testId,
        testName,
        testType: result.testType,
        status: result.status,
        duration: result.duration,
        error: result.error,
        type: 'jest_automated_test',
        timestamp: Date.now()
      }
    );

    console.log(`[AutoRecord] ${result.status === 'passed' ? '✓' : '✗'} ${testName} (${result.duration}ms)`);
  } catch (error) {
    console.error('[AutoRecord] 记录失败:', error.message);
  }
}

// 自动启用
enableAutoRecording().catch(console.error);

module.exports = {
  enableAutoRecording
};