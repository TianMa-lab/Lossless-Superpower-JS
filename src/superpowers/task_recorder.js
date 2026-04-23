const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class TaskRecorder {
  constructor(dagManager) {
    this.dagManager = dagManager;
    this.activeTasks = new Map();
    this.taskHistory = [];
    this.config = {
      autoRecord: true,
      recordInterval: 60000,
      maxHistorySize: 1000,
      taskNodePrefix: 'task_',
      enableAutoExtraction: true
    };
    this.recordInterval = null;
  }

  initialize() {
    if (this.config.autoRecord) {
      this.startAutoRecord();
    }
    console.log('TaskRecorder初始化完成');
    return true;
  }

  startAutoRecord() {
    if (this.recordInterval) {
      clearInterval(this.recordInterval);
    }
    this.recordInterval = setInterval(() => {
      this.recordActiveTasks();
    }, this.config.recordInterval);
  }

  stopAutoRecord() {
    if (this.recordInterval) {
      clearInterval(this.recordInterval);
      this.recordInterval = null;
    }
  }

  recordTask(taskInfo) {
    const taskId = taskInfo.id || `${this.config.taskNodePrefix}${Date.now()}`;
    const nodeId = `task_node_${taskId}`;

    const taskNode = {
      id: nodeId,
      type: 'task',
      taskId: taskId,
      status: taskInfo.status || 'active',
      priority: taskInfo.priority || 'medium',
      topic: taskInfo.topic || taskInfo.description || '未分类任务',
      description: taskInfo.description || '',
      createdAt: taskInfo.createdAt || Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      metadata: {
        agent: taskInfo.agent || 'unknown',
        project: taskInfo.project || 'default',
        tags: taskInfo.tags || [],
        outcome: taskInfo.outcome || null,
        lessons: taskInfo.lessons || []
      }
    };

    this.dagManager.addNode(nodeId, taskNode);
    this.activeTasks.set(taskId, taskNode);

    return {
      success: true,
      taskId: taskId,
      nodeId: nodeId
    };
  }

  updateTask(taskId, updates) {
    const nodeId = `task_node_${taskId}`;
    const existingNode = this.dagManager.dag.nodes[nodeId];

    if (!existingNode) {
      return { success: false, message: '任务不存在' };
    }

    const updatedNode = {
      ...existingNode,
      ...updates,
      updatedAt: Date.now()
    };

    if (updates.status === 'completed' || updates.status === 'done') {
      updatedNode.completedAt = Date.now();
      updatedNode.status = 'completed';
      this.activeTasks.delete(taskId);
    }

    this.dagManager.dag.nodes[nodeId] = updatedNode;
    this.dagManager.saveDAG();

    return {
      success: true,
      taskId: taskId,
      node: updatedNode
    };
  }

  completeTask(taskId, outcome = {}, lessons = []) {
    return this.updateTask(taskId, {
      status: 'completed',
      outcome: outcome,
      lessons: lessons,
      completedAt: Date.now()
    });
  }

  linkTasks(sourceTaskId, targetTaskId, relationType = 'related') {
    const sourceNodeId = `task_node_${sourceTaskId}`;
    const targetNodeId = `task_node_${targetTaskId}`;

    const success = this.dagManager.addEdge(sourceNodeId, targetNodeId, {
      type: 'task_relation',
      relationType: relationType
    });

    return { success };
  }

  recordActiveTasks() {
    const activeTasksArray = Array.from(this.activeTasks.values());
    if (activeTasksArray.length > 0) {
      console.log(`记录${activeTasksArray.length}个活动任务到DAG`);
    }
  }

  extractTaskFromConversation(messages) {
    if (!this.config.enableAutoExtraction) {
      return null;
    }

    const taskPatterns = [
      /(?:完成|执行|实现|修复|创建|构建|配置|设置)(.+?)(?:任务|功能|模块|系统)/gi,
      /(?:帮我|请)(.+?)(?:一下|一下)/gi,
      /(?:task|任务|完成)(.+?)(?:完成|结束|$)/gi
    ];

    const extractedTasks = [];

    for (const message of messages) {
      if (typeof message.content === 'string') {
        for (const pattern of taskPatterns) {
          const matches = message.content.matchAll(pattern);
          for (const match of matches) {
            if (match[1] && match[1].length > 3) {
              extractedTasks.push({
                topic: match[1].trim(),
                description: match[0],
                detectedFrom: 'conversation',
                timestamp: Date.now()
              });
            }
          }
        }
      }
    }

    return extractedTasks.length > 0 ? extractedTasks : null;
  }

  getTaskHistory() {
    return this.taskHistory;
  }

  getActiveTasks() {
    return Array.from(this.activeTasks.values());
  }

  getTaskById(taskId) {
    const nodeId = `task_node_${taskId}`;
    return this.dagManager.dag.nodes[nodeId] || null;
  }

  queryTasks(query = {}) {
    const results = [];
    for (const [nodeId, node] of Object.entries(this.dagManager.dag.nodes)) {
      if (node.type === 'task') {
        let match = true;
        for (const [key, value] of Object.entries(query)) {
          if (node[key] !== value && node.metadata?.[key] !== value) {
            match = false;
            break;
          }
        }
        if (match) {
          results.push(node);
        }
      }
    }
    return results;
  }

  getTaskStatistics() {
    const tasks = this.queryTasks();
    const stats = {
      total: tasks.length,
      active: tasks.filter(t => t.status === 'active').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      byPriority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      byProject: {}
    };

    for (const task of tasks) {
      const project = task.metadata?.project || 'default';
      if (!stats.byProject[project]) {
        stats.byProject[project] = 0;
      }
      stats.byProject[project]++;
    }

    return stats;
  }

  generateTaskReport(timeRange = null) {
    const tasks = this.queryTasks();
    const filteredTasks = timeRange
      ? tasks.filter(t => t.createdAt >= timeRange.start && t.createdAt <= timeRange.end)
      : tasks;

    const completedTasks = filteredTasks.filter(t => t.status === 'completed');
    const activeTasks = filteredTasks.filter(t => t.status === 'active');

    const lessons = [];
    completedTasks.forEach(t => {
      if (t.metadata?.lessons && Array.isArray(t.metadata.lessons)) {
        lessons.push(...t.metadata.lessons);
      }
    });

    return {
      summary: {
        total: filteredTasks.length,
        completed: completedTasks.length,
        active: activeTasks.length,
        completionRate: filteredTasks.length > 0
          ? (completedTasks.length / filteredTasks.length * 100).toFixed(2) + '%'
          : '0%'
      },
      tasks: filteredTasks.map(t => ({
        id: t.taskId,
        topic: t.topic,
        status: t.status,
        priority: t.priority,
        createdAt: new Date(t.createdAt).toISOString(),
        completedAt: t.completedAt ? new Date(t.completedAt).toISOString() : null,
        duration: t.completedAt ? (t.completedAt - t.createdAt) : null,
        lessons: t.metadata?.lessons || []
      })),
      lessons: lessons,
      recommendations: this.generateRecommendations(completedTasks, lessons)
    };
  }

  generateRecommendations(completedTasks, lessons) {
    const recommendations = [];

    if (completedTasks.length > 0) {
      recommendations.push({
        type: 'pattern',
        message: `完成了${completedTasks.length}个任务，提取了${lessons.length}条经验教训`
      });
    }

    const highPriorityCompleted = completedTasks.filter(t => t.priority === 'high');
    if (highPriorityCompleted.length > 0) {
      recommendations.push({
        type: 'efficiency',
        message: `高优先级任务完成率: ${highPriorityCompleted.length}/${completedTasks.length}`
      });
    }

    return recommendations;
  }

  recordLessonsLearned(taskId, lessons) {
    const task = this.getTaskById(taskId);
    if (!task) {
      return { success: false, message: '任务不存在' };
    }

    const existingLessons = task.metadata?.lessons || [];
    const updatedLessons = [...existingLessons, ...lessons];

    return this.updateTask(taskId, {
      metadata: {
        ...task.metadata,
        lessons: updatedLessons
      }
    });
  }
}

function createTaskRecorder(dagManager) {
  return new TaskRecorder(dagManager);
}

module.exports = {
  TaskRecorder,
  createTaskRecorder
};