const { DAGManager, dagManager } = require('./dag_manager');
const { TaskRecorder, createTaskRecorder } = require('./task_recorder');

class DAGTaskIntegration {
  constructor() {
    this.dagManager = null;
    this.taskRecorder = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return true;
    }

    try {
      this.dagManager = new DAGManager();
      this.dagManager.loadDAG();

      this.taskRecorder = createTaskRecorder(this.dagManager);
      this.taskRecorder.initialize();

      this.initialized = true;
      console.log('DAG-Task集成系统初始化成功');
      return true;
    } catch (error) {
      console.error('DAG-Task集成系统初始化失败:', error.message);
      return false;
    }
  }

  getDAGManager() {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.dagManager;
  }

  getTaskRecorder() {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder;
  }

  recordTask(taskInfo) {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.recordTask(taskInfo);
  }

  completeTask(taskId, outcome = {}, lessons = []) {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.completeTask(taskId, outcome, lessons);
  }

  updateTask(taskId, updates) {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.updateTask(taskId, updates);
  }

  linkTasks(sourceTaskId, targetTaskId, relationType = 'related') {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.linkTasks(sourceTaskId, targetTaskId, relationType);
  }

  getTaskStatistics() {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.getTaskStatistics();
  }

  generateTaskReport(timeRange = null) {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.taskRecorder.generateTaskReport(timeRange);
  }

  getSystemStatus() {
    if (!this.initialized) {
      return {
        initialized: false,
        message: '系统未初始化'
      };
    }

    const dagAnalysis = this.dagManager.analyzeDAG();
    const taskStats = this.taskRecorder.getTaskStatistics();

    return {
      initialized: true,
      dag: {
        nodeCount: dagAnalysis.nodeCount,
        edgeCount: dagAnalysis.edgeCount,
        connectedComponents: dagAnalysis.connectedComponents.length
      },
      tasks: taskStats,
      autoRecord: this.taskRecorder.config.autoRecord,
      recordInterval: this.taskRecorder.config.recordInterval
    };
  }

  exportDAG() {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.dagManager.exportDAG();
  }

  importDAG(dagData) {
    if (!this.initialized) {
      throw new Error('DAG-Task集成系统未初始化');
    }
    return this.dagManager.importDAG(dagData);
  }
}

const dagTaskIntegration = new DAGTaskIntegration();

module.exports = {
  DAGTaskIntegration,
  dagTaskIntegration
};