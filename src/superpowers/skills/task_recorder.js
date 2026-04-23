/**
 * 任务记录技能
 * 在任务完成时触发，记录任务信息，总结经验教训
 */

const { taskTracker } = require('../task_tracker');
const { permanentMemorySystem } = require('../permanent_memory');
const { lessonCollector } = require('./lesson_collector');
const { eventRecorder } = require('../event_recorder');

class TaskRecorderSkill {
  /**
   * 运行任务记录技能
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {string} 执行结果
   */
  async run(taskInfo, taskResult) {
    try {
      console.log('[TaskRecorderSkill] 开始运行任务记录技能');
      
      // 1. 记录任务信息
      const taskRecord = await this.recordTask(taskInfo, taskResult);
      
      // 2. 分析任务执行结果
      const analysis = await this.analyzeTaskResult(taskInfo, taskResult);
      
      // 3. 总结经验教训
      const lessons = await this.extractLessons(analysis);
      
      // 4. 记录经验教训
      await this.recordLessons(lessons, taskInfo);
      
      // 5. 记录事件
      await this.recordTaskEvent(taskInfo, taskResult, lessons);
      
      console.log('[TaskRecorderSkill] 任务记录技能执行完成');
      return `任务记录完成，提取了 ${lessons.length} 条经验教训`;
    } catch (error) {
      console.error('[TaskRecorderSkill] 执行失败:', error.message);
      return `任务记录技能执行失败: ${error.message}`;
    }
  }

  /**
   * 记录任务信息
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {Object} 任务记录
   */
  async recordTask(taskInfo, taskResult) {
    const taskRecord = {
      id: taskInfo.id || `task_${Date.now()}`,
      name: taskInfo.taskName || taskInfo.name || '未知任务',
      description: taskInfo.description || '',
      timestamp: Date.now(),
      result: taskResult,
      importance: taskInfo.importance || 3,
      tags: taskInfo.tags || 'task'
    };

    // 存储到永久记忆系统
    await permanentMemorySystem.addMemory(
      `任务记录: ${taskRecord.name}\n描述: ${taskRecord.description}\n结果: ${taskRecord.result}`,
      'task_record',
      taskRecord.importance,
      taskRecord.tags,
      taskRecord
    );

    console.log(`[TaskRecorderSkill] 任务记录已存储: ${taskRecord.name}`);
    return taskRecord;
  }

  /**
   * 分析任务执行结果
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {Object} 分析结果
   */
  async analyzeTaskResult(taskInfo, taskResult) {
    const analysis = {
      taskName: taskInfo.taskName || taskInfo.name || '未知任务',
      success: this.isTaskSuccess(taskResult),
      duration: taskInfo.duration || 0,
      issues: this.extractIssues(taskResult),
      improvements: this.extractImprovements(taskInfo, taskResult)
    };

    console.log(`[TaskRecorderSkill] 任务分析完成: ${analysis.taskName}, 成功: ${analysis.success}`);
    return analysis;
  }

  /**
   * 判断任务是否成功
   * @param {any} taskResult - 任务结果
   * @returns {boolean} 是否成功
   */
  isTaskSuccess(taskResult) {
    if (typeof taskResult === 'string') {
      return !taskResult.includes('失败') && !taskResult.includes('error') && !taskResult.includes('Error');
    } else if (typeof taskResult === 'object' && taskResult !== null) {
      return taskResult.success !== false;
    }
    return true;
  }

  /**
   * 提取任务中的问题
   * @param {any} taskResult - 任务结果
   * @returns {Array} 问题列表
   */
  extractIssues(taskResult) {
    const issues = [];
    
    if (typeof taskResult === 'string') {
      if (taskResult.includes('失败')) {
        issues.push('任务执行失败');
      }
      if (taskResult.includes('错误') || taskResult.includes('error') || taskResult.includes('Error')) {
        issues.push('任务执行出现错误');
      }
    } else if (typeof taskResult === 'object' && taskResult !== null) {
      if (taskResult.error) {
        issues.push(`错误: ${taskResult.error}`);
      }
      if (taskResult.issues) {
        issues.push(...taskResult.issues);
      }
    }
    
    return issues;
  }

  /**
   * 提取改进点
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @returns {Array} 改进点列表
   */
  extractImprovements(taskInfo, taskResult) {
    const improvements = [];
    
    // 基于任务类型提取改进点
    const taskName = taskInfo.taskName || taskInfo.name || '';
    
    if (taskName.includes('优化')) {
      improvements.push('优化任务执行效率');
      improvements.push('优化资源使用');
    } else if (taskName.includes('分析')) {
      improvements.push('提高分析准确性');
      improvements.push('优化分析方法');
    } else if (taskName.includes('同步')) {
      improvements.push('提高同步速度');
      improvements.push('优化同步策略');
    } else if (taskName.includes('技能')) {
      improvements.push('提高技能触发准确性');
      improvements.push('优化技能执行逻辑');
    }
    
    // 基于任务结果提取改进点
    if (typeof taskResult === 'string' && taskResult.includes('超时')) {
      improvements.push('优化任务执行时间');
    }
    
    return improvements;
  }

  /**
   * 提取经验教训
   * @param {Object} analysis - 分析结果
   * @returns {Array} 经验教训列表
   */
  async extractLessons(analysis) {
    const lessons = [];
    
    // 基于任务成功与否提取经验教训
    if (analysis.success) {
      lessons.push({
        type: 'success',
        content: `任务 ${analysis.taskName} 执行成功，可作为成功案例参考`,
        importance: 3
      });
    } else {
      lessons.push({
        type: 'failure',
        content: `任务 ${analysis.taskName} 执行失败，需要分析原因并改进`,
        importance: 4
      });
    }
    
    // 基于问题提取经验教训
    analysis.issues.forEach(issue => {
      lessons.push({
        type: 'issue',
        content: `任务执行中遇到问题: ${issue}`,
        importance: 4
      });
    });
    
    // 基于改进点提取经验教训
    analysis.improvements.forEach(improvement => {
      lessons.push({
        type: 'improvement',
        content: `改进建议: ${improvement}`,
        importance: 3
      });
    });
    
    // 基于任务执行时间提取经验教训
    if (analysis.duration > 60000) { // 超过1分钟
      lessons.push({
        type: 'performance',
        content: `任务 ${analysis.taskName} 执行时间较长(${Math.round(analysis.duration / 1000)}秒)，需要优化执行效率`,
        importance: 3
      });
    }
    
    console.log(`[TaskRecorderSkill] 提取了 ${lessons.length} 条经验教训`);
    return lessons;
  }

  /**
   * 记录经验教训
   * @param {Array} lessons - 经验教训列表
   * @param {Object} taskInfo - 任务信息
   */
  async recordLessons(lessons, taskInfo) {
    for (const lesson of lessons) {
      // 存储到永久记忆系统
      await permanentMemorySystem.addMemory(
        lesson.content,
        'lesson',
        lesson.importance,
        `task,${lesson.type}`,
        {
          taskId: taskInfo.id,
          taskName: taskInfo.taskName || taskInfo.name,
          lessonType: lesson.type,
          timestamp: Date.now()
        }
      );
      
      // 使用教训收集技能记录
      try {
        await lessonCollector.addLesson({
          content: lesson.content,
          type: lesson.type,
          importance: lesson.importance,
          source: `task_${taskInfo.id}`,
          timestamp: Date.now()
        });
      } catch (error) {
        console.warn('[TaskRecorderSkill] 教训收集技能调用失败:', error.message);
      }
    }
    
    console.log(`[TaskRecorderSkill] 经验教训已记录: ${lessons.length}条`);
  }

  /**
   * 记录任务事件
   * @param {Object} taskInfo - 任务信息
   * @param {any} taskResult - 任务结果
   * @param {Array} lessons - 经验教训列表
   */
  async recordTaskEvent(taskInfo, taskResult, lessons) {
    // 记录任务完成事件
    eventRecorder.recordEvent(
      'task_completed',
      `任务 ${taskInfo.taskName || taskInfo.name} 执行完成`,
      [],
      {
        taskId: taskInfo.id,
        taskName: taskInfo.taskName || taskInfo.name,
        taskResult: taskResult,
        lessonsCount: lessons.length
      }
    );
    
    console.log(`[TaskRecorderSkill] 任务事件已记录`);
  }
}

const taskRecorderSkill = new TaskRecorderSkill();

/**
 * 运行任务记录技能
 * @param {Object} taskInfo - 任务信息
 * @param {any} taskResult - 任务结果
 * @returns {string} 执行结果
 */
async function run(taskInfo, taskResult) {
  return await taskRecorderSkill.run(taskInfo, taskResult);
}

module.exports = {
  TaskRecorderSkill,
  taskRecorderSkill,
  run
};