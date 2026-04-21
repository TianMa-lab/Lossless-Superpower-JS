/**
 * 任务跟踪模块
 * 实现任务的创建、跟踪和管理
 * JavaScript Version
 */

const fs = require('fs');
const path = require('path');
const { eventManager } = require('./events');

class TaskTracker {
  /**
   * 任务跟踪类
   * @param {string} storagePath - 存储任务数据的文件路径
   */
  constructor(storagePath = 'task_tracker.json') {
    this.storagePath = storagePath;
    this.tasks = this._loadTasks();
  }

  _loadTasks() {
    /**
     * 加载任务数据
     * @returns {Object} 任务数据
     */
    try {
      if (fs.existsSync(this.storagePath)) {
        const content = fs.readFileSync(this.storagePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn(`加载任务数据失败: ${error.message}`);
    }
    return {};
  }

  _saveTasks() {
    /**
     * 保存任务数据
     */
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(this.tasks, null, 2), 'utf-8');
    } catch (error) {
      console.error(`保存任务数据失败: ${error.message}`);
    }
  }

  startTask(taskId, taskName, description) {
    /**
     * 开始一个任务
     * @param {string} taskId - 任务ID
     * @param {string} taskName - 任务名称
     * @param {string} description - 任务描述
     * @returns {Object} 任务对象
     */
    try {
      const task = {
        id: taskId,
        name: taskName,
        description: description,
        status: 'in_progress',
        start_time: Date.now() / 1000,
        end_time: null,
        steps: [],
        result: null
      };
      
      this.tasks[taskId] = task;
      this._saveTasks();
      
      // 触发任务开始事件
      eventManager.trigger('task_started', taskId, taskName, description);
      
      console.log(`任务 ${taskName} (${taskId}) 开始`);
      return task;
    } catch (error) {
      console.error(`开始任务失败: ${error.message}`);
      return null;
    }
  }

  addTaskStep(taskId, stepName, details) {
    /**
     * 添加任务步骤
     * @param {string} taskId - 任务ID
     * @param {string} stepName - 步骤名称
     * @param {string} details - 步骤详情
     * @returns {Object} 步骤对象
     */
    try {
      const task = this.tasks[taskId];
      if (!task) {
        console.warn(`任务 ${taskId} 不存在`);
        return null;
      }
      
      const step = {
        id: `step_${Date.now()}`,
        name: stepName,
        details: details,
        status: 'pending',
        start_time: null,
        end_time: null
      };
      
      task.steps.push(step);
      this._saveTasks();
      
      // 触发步骤添加事件
      eventManager.trigger('task_step_added', taskId, stepName, details);
      
      console.log(`任务 ${taskId} 添加步骤: ${stepName}`);
      return step;
    } catch (error) {
      console.error(`添加任务步骤失败: ${error.message}`);
      return null;
    }
  }

  completeTask(taskId, result) {
    /**
     * 完成一个任务
     * @param {string} taskId - 任务ID
     * @param {string} result - 任务结果
     * @returns {Object} 任务对象
     */
    try {
      const task = this.tasks[taskId];
      if (!task) {
        console.warn(`任务 ${taskId} 不存在`);
        return null;
      }
      
      task.status = 'completed';
      task.end_time = Date.now() / 1000;
      task.result = result;
      
      // 完成所有未完成的步骤
      task.steps.forEach(step => {
        if (step.status === 'pending' || step.status === 'in_progress') {
          step.status = 'completed';
          if (!step.end_time) {
            step.end_time = Date.now() / 1000;
          }
        }
      });
      
      this._saveTasks();
      
      // 触发任务完成事件
      eventManager.trigger('task_completed', taskId, result);
      
      console.log(`任务 ${taskId} 完成: ${result}`);
      return task;
    } catch (error) {
      console.error(`完成任务失败: ${error.message}`);
      return null;
    }
  }

  getTask(taskId) {
    /**
     * 获取任务
     * @param {string} taskId - 任务ID
     * @returns {Object} 任务对象
     */
    return this.tasks[taskId] || null;
  }

  listTasks(status = null) {
    /**
     * 列出任务
     * @param {string} status - 任务状态（可选）
     * @returns {Array} 任务列表
     */
    const tasks = Object.values(this.tasks);
    if (status) {
      return tasks.filter(task => task.status === status);
    }
    return tasks;
  }

  updateTaskStatus(taskId, status) {
    /**
     * 更新任务状态
     * @param {string} taskId - 任务ID
     * @param {string} status - 任务状态
     * @returns {Object} 任务对象
     */
    try {
      const task = this.tasks[taskId];
      if (!task) {
        console.warn(`任务 ${taskId} 不存在`);
        return null;
      }
      
      task.status = status;
      
      // 如果状态为完成，设置结束时间
      if (status === 'completed' && !task.end_time) {
        task.end_time = Date.now() / 1000;
      }
      
      this._saveTasks();
      
      // 触发任务状态更新事件
      eventManager.trigger('task_status_updated', taskId, status);
      
      console.log(`任务 ${taskId} 状态更新为: ${status}`);
      return task;
    } catch (error) {
      console.error(`更新任务状态失败: ${error.message}`);
      return null;
    }
  }

  updateStepStatus(taskId, stepId, status) {
    /**
     * 更新步骤状态
     * @param {string} taskId - 任务ID
     * @param {string} stepId - 步骤ID
     * @param {string} status - 步骤状态
     * @returns {Object} 步骤对象
     */
    try {
      const task = this.tasks[taskId];
      if (!task) {
        console.warn(`任务 ${taskId} 不存在`);
        return null;
      }
      
      const step = task.steps.find(s => s.id === stepId);
      if (!step) {
        console.warn(`步骤 ${stepId} 不存在`);
        return null;
      }
      
      step.status = status;
      
      // 如果状态为开始，设置开始时间
      if (status === 'in_progress' && !step.start_time) {
        step.start_time = Date.now() / 1000;
      }
      
      // 如果状态为完成，设置结束时间
      if (status === 'completed' && !step.end_time) {
        step.end_time = Date.now() / 1000;
      }
      
      this._saveTasks();
      
      // 触发步骤状态更新事件
      eventManager.trigger('task_step_status_updated', taskId, stepId, status);
      
      console.log(`任务 ${taskId} 的步骤 ${stepId} 状态更新为: ${status}`);
      return step;
    } catch (error) {
      console.error(`更新步骤状态失败: ${error.message}`);
      return null;
    }
  }

  deleteTask(taskId) {
    /**
     * 删除任务
     * @param {string} taskId - 任务ID
     * @returns {boolean} 是否删除成功
     */
    try {
      if (!this.tasks[taskId]) {
        console.warn(`任务 ${taskId} 不存在`);
        return false;
      }
      
      delete this.tasks[taskId];
      this._saveTasks();
      
      // 触发任务删除事件
      eventManager.trigger('task_deleted', taskId);
      
      console.log(`任务 ${taskId} 删除成功`);
      return true;
    } catch (error) {
      console.error(`删除任务失败: ${error.message}`);
      return false;
    }
  }

  getTaskStatistics() {
    /**
     * 获取任务统计信息
     * @returns {Object} 统计信息
     */
    const tasks = Object.values(this.tasks);
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    
    return {
      total,
      completed,
      in_progress: inProgress,
      pending,
      completion_rate: total > 0 ? (completed / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// 全局任务跟踪实例
const taskTracker = new TaskTracker();

module.exports = {
  TaskTracker,
  taskTracker
};
