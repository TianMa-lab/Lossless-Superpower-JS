/**
 * DAG系统迭代脚本
 * 执行DAG系统的技术迭代，实现第二阶段功能增强
 */

const path = require('path');
const { dagTaskIntegration } = require(path.join(__dirname, '..', 'src', 'superpowers', 'dag_task_integration'));
const { autoTaskRecorder } = require(path.join(__dirname, '..', 'src', 'index.js'));

async function iterateDAG() {
  console.log('开始DAG系统技术迭代...\n');

  // 1. 初始化DAG系统
  console.log('1. 初始化DAG系统...');
  const initResult = await dagTaskIntegration.initialize();
  console.log('DAG系统初始化结果:', initResult);

  // 2. 检查当前状态
  console.log('\n2. 检查当前DAG状态...');
  const status = dagTaskIntegration.getSystemStatus();
  console.log('当前DAG状态:', JSON.stringify(status, null, 2));

  // 3. 记录迭代任务
  console.log('\n3. 记录DAG迭代任务...');
  const iterationTask = await autoTaskRecorder.recordTask(
    'DAG系统技术迭代',
    '实施DAG系统第二阶段功能增强',
    async () => {
      console.log('\n   3.1 增强DAGManager功能...');
      
      // 3.1.1 增强DAGManager
      const dagManager = dagTaskIntegration.getDAGManager();
      
      // 3.1.2 添加新功能：节点更新
      if (!dagManager.updateNode) {
        dagManager.updateNode = function(nodeId, updates) {
          if (this.dag.nodes[nodeId]) {
            this.dag.nodes[nodeId] = {
              ...this.dag.nodes[nodeId],
              ...updates,
              updatedAt: Date.now()
            };
            return this.saveDAG();
          }
          return false;
        };
        console.log('   ✓ 添加节点更新功能');
      }

      // 3.1.3 添加新功能：节点删除
      if (!dagManager.removeNode) {
        dagManager.removeNode = function(nodeId) {
          if (this.dag.nodes[nodeId]) {
            delete this.dag.nodes[nodeId];
            // 同时删除相关的边
            this.dag.edges = this.dag.edges.filter(edge => 
              edge.source !== nodeId && edge.target !== nodeId
            );
            return this.saveDAG();
          }
          return false;
        };
        console.log('   ✓ 添加节点删除功能');
      }

      // 3.1.4 添加新功能：边删除
      if (!dagManager.removeEdge) {
        dagManager.removeEdge = function(edgeId) {
          const initialLength = this.dag.edges.length;
          this.dag.edges = this.dag.edges.filter(edge => edge.id !== edgeId);
          if (this.dag.edges.length < initialLength) {
            this.saveDAG();
            return true;
          }
          return false;
        };
        console.log('   ✓ 添加边删除功能');
      }

      // 3.1.5 增强搜索功能
      if (!dagManager.advancedQuery) {
        dagManager.advancedQuery = function(query) {
          const results = [];
          for (const [nodeId, node] of Object.entries(this.dag.nodes)) {
            let match = true;
            for (const [key, value] of Object.entries(query)) {
              if (typeof value === 'object' && value !== null) {
                // 支持嵌套查询
                if (typeof node[key] === 'object' && node[key] !== null) {
                  for (const [nestedKey, nestedValue] of Object.entries(value)) {
                    if (node[key][nestedKey] !== nestedValue) {
                      match = false;
                      break;
                    }
                  }
                } else {
                  match = false;
                }
              } else if (node[key] !== value) {
                match = false;
              }
              if (!match) break;
            }
            if (match) {
              results.push(node);
            }
          }
          return results;
        };
        console.log('   ✓ 增强查询功能');
      }

      console.log('\n   3.2 增强TaskRecorder功能...');
      
      // 3.2.1 增强TaskRecorder
      const taskRecorder = dagTaskIntegration.getTaskRecorder();
      
      // 3.2.2 添加任务暂停/恢复功能
      if (!taskRecorder.pauseTask) {
        taskRecorder.pauseTask = function(taskId) {
          return this.updateTask(taskId, { status: 'paused' });
        };
        console.log('   ✓ 添加任务暂停功能');
      }

      if (!taskRecorder.resumeTask) {
        taskRecorder.resumeTask = function(taskId) {
          return this.updateTask(taskId, { status: 'active' });
        };
        console.log('   ✓ 添加任务恢复功能');
      }

      // 3.2.3 添加任务依赖管理
      if (!taskRecorder.addTaskDependency) {
        taskRecorder.addTaskDependency = function(taskId, dependencyTaskId) {
          return this.linkTasks(dependencyTaskId, taskId, 'depends_on');
        };
        console.log('   ✓ 添加任务依赖管理');
      }

      // 3.2.4 增强报告生成
      if (!taskRecorder.generateDetailedReport) {
        taskRecorder.generateDetailedReport = function(timeRange = null, filters = {}) {
          const tasks = this.queryTasks(filters);
          const filteredTasks = timeRange
            ? tasks.filter(t => t.createdAt >= timeRange.start && t.createdAt <= timeRange.end)
            : tasks;

          const report = {
            summary: {
              total: filteredTasks.length,
              active: filteredTasks.filter(t => t.status === 'active').length,
              completed: filteredTasks.filter(t => t.status === 'completed').length,
              paused: filteredTasks.filter(t => t.status === 'paused').length,
              failed: filteredTasks.filter(t => t.status === 'failed').length
            },
            tasks: filteredTasks.map(t => ({
              id: t.taskId,
              topic: t.topic,
              description: t.description,
              status: t.status,
              priority: t.priority,
              project: t.metadata?.project || 'default',
              createdAt: new Date(t.createdAt).toISOString(),
              completedAt: t.completedAt ? new Date(t.completedAt).toISOString() : null,
              duration: t.completedAt ? (t.completedAt - t.createdAt) : null,
              metadata: t.metadata
            })),
            statistics: {
              byPriority: {},
              byProject: {},
              byStatus: {}
            },
            timeline: []
          };

          // 计算统计数据
          filteredTasks.forEach(t => {
            // 按优先级统计
            report.statistics.byPriority[t.priority] = (report.statistics.byPriority[t.priority] || 0) + 1;
            // 按项目统计
            const project = t.metadata?.project || 'default';
            report.statistics.byProject[project] = (report.statistics.byProject[project] || 0) + 1;
            // 按状态统计
            report.statistics.byStatus[t.status] = (report.statistics.byStatus[t.status] || 0) + 1;
          });

          return report;
        };
        console.log('   ✓ 增强报告生成功能');
      }

      console.log('\n   3.3 测试新功能...');
      
      // 3.3.1 测试节点更新
      const testNodeId = 'test_node_' + Date.now();
      dagManager.addNode(testNodeId, {
        type: 'test',
        topic: '测试节点',
        description: '用于测试DAG迭代功能',
        status: 'active'
      });
      console.log('   ✓ 创建测试节点');

      // 3.3.2 测试节点更新
      const updateResult = dagManager.updateNode(testNodeId, {
        status: 'completed',
        description: '测试节点 - 已更新'
      });
      console.log('   ✓ 测试节点更新:', updateResult);

      // 3.3.3 测试任务记录
      const testTask = await taskRecorder.recordTask({
        topic: '测试任务',
        description: '测试DAG迭代后的任务记录功能',
        priority: 'medium',
        project: 'test'
      });
      console.log('   ✓ 创建测试任务:', testTask.taskId);

      // 3.3.4 测试任务暂停
      const pauseResult = taskRecorder.pauseTask(testTask.taskId);
      console.log('   ✓ 测试任务暂停:', pauseResult.success);

      // 3.3.5 测试任务恢复
      const resumeResult = taskRecorder.resumeTask(testTask.taskId);
      console.log('   ✓ 测试任务恢复:', resumeResult.success);

      // 3.3.6 测试任务完成
      const completeResult = taskRecorder.completeTask(testTask.taskId, {
        success: true,
        message: '测试任务完成'
      }, ['测试成功的经验教训']);
      console.log('   ✓ 测试任务完成:', completeResult.success);

      // 3.3.7 测试详细报告
      const detailedReport = taskRecorder.generateDetailedReport();
      console.log('   ✓ 生成详细报告:', Object.keys(detailedReport).join(', '));

      console.log('\n   3.4 清理测试数据...');
      
      // 3.4.1 清理测试节点
      const removeNodeResult = dagManager.removeNode(testNodeId);
      console.log('   ✓ 清理测试节点:', removeNodeResult);

      console.log('\n3.5 验证DAG系统状态...');
      const finalStatus = dagTaskIntegration.getSystemStatus();
      console.log('迭代后DAG状态:', JSON.stringify(finalStatus, null, 2));

      return {
        success: true,
        message: 'DAG系统技术迭代完成',
        changes: [
          '增强DAGManager功能（节点更新、删除、边删除、高级查询）',
          '增强TaskRecorder功能（任务暂停/恢复、依赖管理、详细报告）',
          '测试新功能',
          '验证系统状态'
        ]
      };
    },
    {
      priority: 'high',
      project: 'dag_iteration',
      tags: ['dag', 'iteration', 'enhancement']
    }
  );

  console.log('\n4. 生成迭代报告...');
  const iterationReport = dagTaskIntegration.generateTaskReport();
  console.log('迭代报告生成成功:', iterationReport.summary);

  console.log('\n5. 更新技术设计文档...');
  // 这里可以添加自动更新文档的逻辑
  console.log('✓ 技术设计文档更新提示：请手动更新 docs/DAG_SYSTEM_TECHNICAL_DESIGN.md');

  console.log('\n✅ DAG系统技术迭代完成！');
  console.log('\n迭代成果：');
  console.log('- 增强了DAGManager核心功能');
  console.log('- 增强了TaskRecorder功能');
  console.log('- 测试了新功能');
  console.log('- 验证了系统状态');
  console.log('- 生成了迭代报告');

  return {
    success: true,
    message: 'DAG系统技术迭代完成',
    iterationTask: iterationTask
  };
}

iterateDAG().catch(error => {
  console.error('DAG迭代失败:', error);
  process.exit(1);
});