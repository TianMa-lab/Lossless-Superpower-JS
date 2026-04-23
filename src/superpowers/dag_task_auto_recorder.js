/**
 * DAG任务自动记录器
 * 将DAG任务集成到AutoTaskRecorder系统中
 */

const { dagTaskIntegration } = require('./dag_task_integration');

class DAGTaskAutoRecorder {
  constructor() {
    this.dagInitialized = false;
    this.recordingEnabled = true;
    this.taskMapping = new Map();
  }

  async initialize() {
    try {
      await dagTaskIntegration.initialize();
      this.dagInitialized = true;
      console.log('[DAGTaskAutoRecorder] DAG任务自动记录器初始化成功');
      return true;
    } catch (error) {
      console.error('[DAGTaskAutoRecorder] DAG任务自动记录器初始化失败:', error.message);
      return false;
    }
  }

  async recordTask(taskInfo) {
    if (!this.dagInitialized) {
      await this.initialize();
    }

    const result = dagTaskIntegration.recordTask({
      topic: taskInfo.name || taskInfo.topic,
      description: taskInfo.description,
      priority: taskInfo.priority || 'medium',
      agent: 'assistant',
      project: taskInfo.project || 'default',
      tags: taskInfo.tags || [],
      metadata: {
        ...taskInfo.metadata,
        source: 'auto_task_recorder'
      }
    });

    if (result.success) {
      this.taskMapping.set(result.taskId, {
        taskId: result.taskId,
        nodeId: result.nodeId,
        startTime: Date.now(),
        source: 'dag'
      });
    }

    return result;
  }

  async completeTask(taskId, outcome = {}, lessons = []) {
    if (!this.dagInitialized) {
      return { success: false, message: 'DAG未初始化' };
    }

    const result = dagTaskIntegration.completeTask(taskId, outcome, lessons);

    if (this.taskMapping.has(taskId)) {
      const mapping = this.taskMapping.get(taskId);
      mapping.endTime = Date.now();
      mapping.duration = mapping.endTime - mapping.startTime;
    }

    return result;
  }

  getDAGStats() {
    if (!this.dagInitialized) {
      return null;
    }
    return dagTaskIntegration.getTaskStatistics();
  }

  generateReport() {
    if (!this.dagInitialized) {
      return null;
    }
    return dagTaskIntegration.generateTaskReport();
  }

  getSystemStatus() {
    return {
      initialized: this.dagInitialized,
      recordingEnabled: this.recordingEnabled,
      trackedDAGTasks: this.taskMapping.size,
      dagStatus: this.dagInitialized ? dagTaskIntegration.getSystemStatus() : null
    };
  }

  cleanup() {
    this.taskMapping.clear();
    this.dagInitialized = false;
  }
}

const dagTaskAutoRecorder = new DAGTaskAutoRecorder();

module.exports = {
  DAGTaskAutoRecorder,
  dagTaskAutoRecorder
};