/**
 * 自动任务记录器
 * 提供自动记录任务执行过程的功能
 */

const { taskTracker } = require('./task_tracker');
const { iterationManager } = require('./iteration_manager');
const { permanentMemorySystem } = require('./permanent_memory');
const { intelligentTrigger } = require('./intelligent_trigger');

class TaskRunner {
  /**
   * 执行任务并自动记录
   * @param {string} taskId - 任务ID
   * @param {string} taskName - 任务名称
   * @param {string} description - 任务描述
   * @param {Function} taskFunction - 任务执行函数
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @param {string} options.resultMessage - 任务结果消息
   * @returns {Promise<any>} 任务执行结果
   */
  static async runTask(taskId, taskName, description, taskFunction, options = {}) {
    try {
      // 开始任务
      taskTracker.startTask(taskId, taskName, description);
      
      // 执行任务
      const result = await taskFunction();
      
      // 完成任务
      const taskResult = options.resultMessage || `任务 ${taskName} 执行成功`;
      taskTracker.completeTask(taskId, taskResult);
      
      // 存储到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          taskResult, 
          result, 
          {
            importance: options.memoryImportance || 3,
            tags: options.memoryTags || 'task',
            metadata: options.memoryMetadata || {}
          }
        );
      }
      
      // 智能触发分析
      console.log('[TaskRunner] 调用智能触发分析:', taskName);
      await intelligentTrigger.analyzeTaskCompletion(
        {
          id: taskId,
          taskName,
          description,
          importance: options.memoryImportance || 3,
          tags: options.memoryTags || 'task'
        },
        taskResult
      );
      console.log('[TaskRunner] 智能触发分析完成');
      console.log('[TaskRunner] 智能触发状态:', await intelligentTrigger.getStatus());
      
      console.log(`任务 ${taskName} 执行完成并记录`);
      return result;
    } catch (error) {
      // 记录任务失败
      const errorMessage = `任务 ${taskName} 执行失败: ${error.message}`;
      taskTracker.completeTask(taskId, errorMessage);
      
      // 存储失败结果到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          errorMessage, 
          null, 
          {
            importance: options.memoryImportance || 4, // 失败任务更重要
            tags: `${options.memoryTags || 'task'},error`,
            metadata: { ...(options.memoryMetadata || {}), error: error.message }
          }
        );
      }
      
      // 智能触发分析（失败任务）
      await intelligentTrigger.analyzeTaskCompletion(
        {
          id: taskId,
          taskName,
          description,
          importance: options.memoryImportance || 4, // 失败任务更重要
          tags: `${options.memoryTags || 'task'},error`
        },
        errorMessage
      );
      
      console.error(errorMessage);
      throw error;
    }
  }

  /**
   * 存储任务结果到记忆系统
   * @private
   * @param {string} taskId - 任务ID
   * @param {string} taskName - 任务名称
   * @param {string} description - 任务描述
   * @param {string} resultMessage - 任务结果消息
   * @param {any} result - 任务执行结果
   * @param {Object} memoryOptions - 记忆选项
   * @returns {Promise<void>}
   */
  static async _storeTaskResultInMemory(taskId, taskName, description, resultMessage, result, memoryOptions) {
    try {
      // 初始化永久记忆系统（如果未初始化）
      if (!this.memoryInitialized) {
        await permanentMemorySystem.init();
        this.memoryInitialized = true;
      }

      // 构建记忆内容
      const memoryContent = `
任务ID: ${taskId}
任务名称: ${taskName}
任务描述: ${description}
任务结果: ${resultMessage}
${result ? `执行结果: ${JSON.stringify(result)}` : ''}
时间: ${new Date().toISOString()}
`;

      // 添加到记忆系统
      await permanentMemorySystem.addMemory(
        memoryContent.trim(),
        'task_result',
        memoryOptions.importance,
        memoryOptions.tags,
        {
          taskId,
          taskName,
          description,
          resultMessage,
          timestamp: Date.now(),
          ...memoryOptions.metadata
        }
      );

      console.log(`任务 ${taskName} 结果已存储到记忆系统`);
    } catch (error) {
      console.error('存储任务结果到记忆系统失败:', error.message);
      // 存储失败不影响任务执行
    }
  }

  /**
   * 执行带步骤的任务
   * @param {string} taskId - 任务ID
   * @param {string} taskName - 任务名称
   * @param {string} description - 任务描述
   * @param {Array} steps - 任务步骤数组
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Promise<void>}
   */
  static async runTaskWithSteps(taskId, taskName, description, steps, options = {}) {
    try {
      // 开始任务
      taskTracker.startTask(taskId, taskName, description);
      
      // 执行每个步骤
      for (const step of steps) {
        taskTracker.addTaskStep(taskId, step.name, step.description);
        await step.execute();
      }
      
      // 完成任务
      const taskResult = `任务 ${taskName} 执行成功，完成 ${steps.length} 个步骤`;
      taskTracker.completeTask(taskId, taskResult);
      
      // 存储到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          taskResult, 
          { steps: steps.length, stepNames: steps.map(s => s.name) }, 
          {
            importance: options.memoryImportance || 3,
            tags: options.memoryTags || 'task,steps',
            metadata: options.memoryMetadata || { steps: steps.length }
          }
        );
      }
      
      console.log(`任务 ${taskName} 执行完成并记录`);
    } catch (error) {
      // 记录任务失败
      const errorMessage = `任务 ${taskName} 执行失败: ${error.message}`;
      taskTracker.completeTask(taskId, errorMessage);
      
      // 存储失败结果到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          errorMessage, 
          null, 
          {
            importance: options.memoryImportance || 4, // 失败任务更重要
            tags: `${options.memoryTags || 'task,steps'},error`,
            metadata: { ...(options.memoryMetadata || {}), error: error.message }
          }
        );
      }
      
      // 智能触发分析（失败任务）
      await intelligentTrigger.analyzeTaskCompletion(
        {
          id: taskId,
          taskName,
          description,
          importance: options.memoryImportance || 4, // 失败任务更重要
          tags: `${options.memoryTags || 'task'},error`
        },
        errorMessage
      );
      
      console.error(errorMessage);
      throw error;
    }
  }

  /**
   * 执行任务并记录为迭代
   * @param {string} taskId - 任务ID
   * @param {string} taskName - 任务名称
   * @param {string} description - 任务描述
   * @param {Function} taskFunction - 任务执行函数
   * @param {Object} iterationData - 迭代数据
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Promise<any>} 任务执行结果
   */
  static async runTaskWithIteration(taskId, taskName, description, taskFunction, iterationData, options = {}) {
    try {
      // 开始任务
      taskTracker.startTask(taskId, taskName, description);
      
      // 执行任务
      const result = await taskFunction();
      
      // 完成任务
      const taskResult = `任务 ${taskName} 执行成功`;
      taskTracker.completeTask(taskId, taskResult);
      
      // 记录迭代
      const iteration = {
        version: iterationData.version || `1.0.${Date.now()}`,
        title: iterationData.title || taskName,
        description: iterationData.description || description,
        referenced_systems: iterationData.referenced_systems || [],
        updates: iterationData.updates || [],
        files_modified: iterationData.files_modified || [],
        features_added: iterationData.features_added || [],
        features_improved: iterationData.features_improved || [],
        performance_changes: iterationData.performance_changes || [],
        bug_fixes: iterationData.bug_fixes || [],
        issues: iterationData.issues || [],
        notes: iterationData.notes || '',
        author: iterationData.author || '系统'
      };
      
      iterationManager.addIteration(iteration);
      
      // 存储到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          taskResult, 
          { iteration: iteration.version, result }, 
          {
            importance: options.memoryImportance || 4, // 迭代任务更重要
            tags: options.memoryTags || 'task,iteration',
            metadata: { ...(options.memoryMetadata || {}), iteration: iteration.version }
          }
        );
      }
      
      console.log(`任务 ${taskName} 执行完成并记录为迭代`);
      return result;
    } catch (error) {
      // 记录任务失败
      const errorMessage = `任务 ${taskName} 执行失败: ${error.message}`;
      taskTracker.completeTask(taskId, errorMessage);
      
      // 存储失败结果到记忆系统
      if (options.storeInMemory !== false) {
        await this._storeTaskResultInMemory(
          taskId, 
          taskName, 
          description, 
          errorMessage, 
          null, 
          {
            importance: options.memoryImportance || 5, // 失败的迭代任务最重要
            tags: `${options.memoryTags || 'task,iteration'},error`,
            metadata: { ...(options.memoryMetadata || {}), error: error.message }
          }
        );
      }
      
      // 智能触发分析（失败任务）
      await intelligentTrigger.analyzeTaskCompletion(
        {
          id: taskId,
          taskName,
          description,
          importance: options.memoryImportance || 4, // 失败任务更重要
          tags: `${options.memoryTags || 'task'},error`
        },
        errorMessage
      );
      
      console.error(errorMessage);
      throw error;
    }
  }

  /**
   * 包装函数，自动记录执行过程
   * @param {string} taskName - 任务名称
   * @param {string} description - 任务描述
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Function} 包装后的函数
   */
  static wrapFunction(taskName, description, options = {}) {
    return (fn) => {
      return async (...args) => {
        const taskId = `${taskName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
        return await this.runTask(taskId, taskName, description, () => fn(...args), options);
      };
    };
  }

  /**
   * 批量执行任务
   * @param {Array} tasks - 任务数组
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Promise<Array>} 任务执行结果数组
   */
  static async runBatchTasks(tasks, options = {}) {
    const results = [];
    
    for (const task of tasks) {
      try {
        const result = await this.runTask(
          task.id || `${task.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          task.name,
          task.description,
          task.execute,
          {
            storeInMemory: options.storeInMemory,
            memoryImportance: options.memoryImportance,
            memoryTags: options.memoryTags,
            memoryMetadata: { ...(options.memoryMetadata || {}), batchTask: true }
          }
        );
        results.push({ task: task.name, status: 'success', result });
      } catch (error) {
        results.push({ task: task.name, status: 'error', error: error.message });
      }
    }
    
    return results;
  }

  /**
   * 执行系统维护任务
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Promise<void>}
   */
  static async runMaintenanceTask(options = {}) {
    const taskId = `maintenance_${Date.now()}`;
    const steps = [
      {
        name: '检查系统状态',
        description: '检查系统各模块的运行状态',
        execute: async () => {
          console.log('检查系统状态...');
          // 这里可以添加实际的检查逻辑
        }
      },
      {
        name: '清理临时文件',
        description: '清理系统产生的临时文件',
        execute: async () => {
          console.log('清理临时文件...');
          // 这里可以添加实际的清理逻辑
        }
      },
      {
        name: '优化存储',
        description: '优化系统存储结构',
        execute: async () => {
          console.log('优化存储...');
          // 这里可以添加实际的优化逻辑
        }
      }
    ];

    await this.runTaskWithSteps(taskId, '系统维护', '执行系统维护任务', steps, options);
  }

  /**
   * 执行系统更新任务
   * @param {Object} updateData - 更新数据
   * @param {Object} options - 选项
   * @param {boolean} options.storeInMemory - 是否将任务结果存储到记忆系统
   * @param {number} options.memoryImportance - 记忆的重要性（1-5）
   * @param {string} options.memoryTags - 记忆标签
   * @param {Object} options.memoryMetadata - 记忆元数据
   * @returns {Promise<void>}
   */
  static async runUpdateTask(updateData, options = {}) {
    const taskId = `update_${Date.now()}`;
    const taskName = `系统更新: ${updateData.version}`;
    const description = updateData.description || `更新系统到版本 ${updateData.version}`;

    await this.runTaskWithIteration(
      taskId,
      taskName,
      description,
      async () => {
        console.log(`执行系统更新到版本 ${updateData.version}...`);
        // 这里可以添加实际的更新逻辑
        return '更新完成';
      },
      updateData,
      options
    );
  }
}

// 初始化记忆系统标志
TaskRunner.memoryInitialized = false;
module.exports = {
  TaskRunner
};
