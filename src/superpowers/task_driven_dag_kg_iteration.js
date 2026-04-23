/**
 * 任务驱动的DAG-KG提取与对齐智能迭代系统
 * 以任务为核心，智能推进DAG-KG的提取与对齐
 */

const { TaskRunner } = require('./task_runner');
const { enhancedKnowledgeGraphDAGIntegration } = require('./dag_kg_integration');
const { intelligentIterationSystem } = require('./dag_kg_intelligent_iteration');

class TaskDrivenDAGKGIteration {
  constructor() {
    this.taskQueue = [];
    this.running = false;
    this.currentTask = null;
    this.iterationCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
  }

  async start() {
    if (!this.running) {
      this.running = true;
      console.log('任务驱动的DAG-KG迭代系统已启动');
      this.processTaskQueue();
    }
  }

  stop() {
    this.running = false;
    console.log('任务驱动的DAG-KG迭代系统已停止');
  }

  addTask(task) {
    const taskWithId = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'pending',
      ...task
    };
    this.taskQueue.push(taskWithId);
    console.log(`已添加任务: ${taskWithId.name}`);
    return taskWithId.id;
  }

  async processTaskQueue() {
    while (this.running && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      this.currentTask = task;
      await this.executeTask(task);
    }
  }

  async executeTask(task) {
    console.log(`开始执行任务: ${task.name}`);
    task.status = 'in_progress';
    task.startTime = Date.now();

    try {
      let result;
      switch (task.type) {
        case 'extract_knowledge':
          result = await this.executeExtractKnowledgeTask(task);
          break;
        case 'align_dag_kg':
          result = await this.executeAlignDAGKGTask(task);
          break;
        case 'sync_dag_kg':
          result = await this.executeSyncDAGKGTask(task);
          break;
        case 'optimize_performance':
          result = await this.executeOptimizePerformanceTask(task);
          break;
        case 'analyze_mapping':
          result = await this.executeAnalyzeMappingTask(task);
          break;
        case 'intelligent_iteration':
          result = await this.executeIntelligentIterationTask(task);
          break;
        default:
          throw new Error(`未知任务类型: ${task.type}`);
      }

      task.status = 'completed';
      task.endTime = Date.now();
      task.result = result;
      task.duration = task.endTime - task.startTime;
      this.successCount++;
      console.log(`任务 ${task.name} 执行成功，耗时 ${task.duration}ms`);

      // 自动生成后续任务
      await this.generateFollowupTasks(task, result);

    } catch (error) {
      task.status = 'failed';
      task.endTime = Date.now();
      task.error = error.message;
      task.duration = task.endTime - task.startTime;
      this.failureCount++;
      console.error(`任务 ${task.name} 执行失败: ${error.message}`);

      // 生成错误处理任务
      this.generateErrorHandlingTask(task, error);
    } finally {
      this.currentTask = null;
      this.iterationCount++;
    }
  }

  async executeExtractKnowledgeTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG(
          task.data,
          task.options || {}
        );
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: task.priority === 'high' ? 5 : 3,
        memoryTags: ['knowledge_extraction', 'dag_kg', task.type]
      }
    );
  }

  async executeAlignDAGKGTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping(
          task.options || {}
        );
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: task.priority === 'high' ? 5 : 3,
        memoryTags: ['dag_kg_alignment', 'edge_mapping', task.type]
      }
    );
  }

  async executeSyncDAGKGTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync(
          task.options || {}
        );
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: task.priority === 'high' ? 5 : 3,
        memoryTags: ['dag_kg_sync', 'bidirectional_sync', task.type]
      }
    );
  }

  async executeOptimizePerformanceTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await enhancedKnowledgeGraphDAGIntegration.optimizePerformance(
          task.options || {}
        );
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: task.priority === 'high' ? 5 : 3,
        memoryTags: ['performance_optimization', 'system_maintenance', task.type]
      }
    );
  }

  async executeAnalyzeMappingTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await enhancedKnowledgeGraphDAGIntegration.analyzeMapping(
          task.options || {}
        );
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: task.priority === 'high' ? 5 : 3,
        memoryTags: ['mapping_analysis', 'dag_kg', task.type]
      }
    );
  }

  async executeIntelligentIterationTask(task) {
    return await TaskRunner.runTask(
      task.id,
      task.name,
      task.description,
      async () => {
        const result = await intelligentIterationSystem.triggerManualIteration();
        return result;
      },
      {
        storeInMemory: true,
        memoryImportance: 5,
        memoryTags: ['intelligent_iteration', 'system_upgrade', task.type]
      }
    );
  }

  async generateFollowupTasks(task, result) {
    // 根据任务执行结果生成后续任务
    if (result.success) {
      switch (task.type) {
        case 'extract_knowledge':
          // 提取完成后，进行对齐
          this.addTask({
            name: 'DAG-KG对齐',
            description: '对提取的知识进行DAG与知识图谱的对齐',
            type: 'align_dag_kg',
            priority: task.priority,
            options: {}
          });
          break;
        case 'align_dag_kg':
          // 对齐完成后，进行同步
          this.addTask({
            name: 'DAG-KG同步',
            description: '将对齐结果同步到知识图谱',
            type: 'sync_dag_kg',
            priority: task.priority,
            options: {}
          });
          break;
        case 'sync_dag_kg':
          // 同步完成后，分析映射关系
          this.addTask({
            name: '映射分析',
            description: '分析DAG与知识图谱的映射关系',
            type: 'analyze_mapping',
            priority: 'medium',
            options: {}
          });
          break;
        case 'analyze_mapping':
          // 分析完成后，根据需要进行性能优化
          if (result.evaluation && result.evaluation.overallScore < 0.8) {
            this.addTask({
              name: '性能优化',
              description: '根据映射分析结果进行性能优化',
              type: 'optimize_performance',
              priority: 'medium',
              options: {}
            });
          }
          break;
      }
    }
  }

  generateErrorHandlingTask(task, error) {
    // 生成错误处理任务
    this.addTask({
      name: `错误处理: ${task.name}`,
      description: `处理任务 ${task.name} 执行失败的情况`,
      type: 'optimize_performance',
      priority: 'high',
      options: {
        error: error.message,
        originalTask: task
      }
    });
  }

  getStatus() {
    return {
      running: this.running,
      queueLength: this.taskQueue.length,
      currentTask: this.currentTask,
      iterationCount: this.iterationCount,
      successCount: this.successCount,
      failureCount: this.failureCount,
      lastIterationTime: this.iterationCount > 0 ? Date.now() : null
    };
  }

  async triggerKnowledgeExtraction(data, options = {}) {
    const taskId = this.addTask({
      name: '知识提取',
      description: '从数据中提取知识到DAG',
      type: 'extract_knowledge',
      priority: 'high',
      data: data,
      options: options
    });
    return taskId;
  }

  async triggerFullIteration(options = {}) {
    // 触发完整的DAG-KG迭代流程
    const tasks = [
      {
        name: '知识提取',
        description: '从数据中提取知识到DAG',
        type: 'extract_knowledge',
        priority: 'high',
        data: options.data || {},
        options: options.extractOptions || {}
      },
      {
        name: 'DAG-KG对齐',
        description: '对提取的知识进行DAG与知识图谱的对齐',
        type: 'align_dag_kg',
        priority: 'high',
        options: options.alignOptions || {}
      },
      {
        name: 'DAG-KG同步',
        description: '将对齐结果同步到知识图谱',
        type: 'sync_dag_kg',
        priority: 'high',
        options: options.syncOptions || {}
      },
      {
        name: '映射分析',
        description: '分析DAG与知识图谱的映射关系',
        type: 'analyze_mapping',
        priority: 'medium',
        options: options.analyzeOptions || {}
      },
      {
        name: '智能迭代',
        description: '执行智能迭代，优化系统性能',
        type: 'intelligent_iteration',
        priority: 'medium',
        options: options.iterationOptions || {}
      }
    ];

    const taskIds = [];
    for (const task of tasks) {
      taskIds.push(this.addTask(task));
    }

    return taskIds;
  }
}

const taskDrivenDAGKGIteration = new TaskDrivenDAGKGIteration();

module.exports = {
  TaskDrivenDAGKGIteration,
  taskDrivenDAGKGIteration
};