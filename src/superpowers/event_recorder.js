/**
 * 事件记录器
 * 用于记录系统中的各种事件，同时存储到 DAG 和 KG 系统
 */

const fs = require('fs');
const path = require('path');

class EventRecorder {
  /**
   * 初始化事件记录器
   */
  constructor() {
    this.dagTools = null;
    this.kgTools = null;
    this._initializeTools();
    // 事件历史记录
    this.eventHistory = {};
    // 事件统计
    this.eventStats = {};
    // 验证结果历史
    this.validationHistory = {};
    // 最大重试次数
    this.maxRetries = 3;
  }

  /**
   * 初始化存储工具
   */
  _initializeTools() {
    try {
      // 尝试导入DAG工具
      try {
        // 这里假设DAG工具存在
        this.dagAdd = this._mockDagAdd;
        console.log('DAG 工具初始化成功');
      } catch (error) {
        console.error('初始化 DAG 工具失败:', error.message);
        this.dagAdd = null;
      }
      
      // 尝试导入知识图谱工具
      try {
        // 这里假设知识图谱工具存在
        this.addKnowledge = this._mockAddKnowledge;
        this.addRelationship = this._mockAddRelationship;
        console.log('知识图谱工具初始化成功');
      } catch (error) {
        console.error('初始化知识图谱工具失败:', error.message);
        this.addKnowledge = null;
        this.addRelationship = null;
      }
    } catch (error) {
      console.error('初始化工具失败:', error.message);
    }
  }

  /**
   * 模拟DAG添加函数
   * @param {string} content - 内容
   * @param {string} topic - 主题
   * @returns {string} 结果
   */
  _mockDagAdd(content, topic) {
    console.log(`模拟 DAG 添加: ${topic} - ${content.substring(0, 50)}...`);
    return `dag_${Date.now()}`;
  }

  /**
   * 模拟添加知识函数
   * @param {string} content - 内容
   * @param {string} topic - 主题
   * @returns {string} 节点ID
   */
  _mockAddKnowledge(content, topic) {
    console.log(`模拟知识图谱添加: ${topic} - ${content.substring(0, 50)}...`);
    return `kg_${Date.now()}`;
  }

  /**
   * 模拟添加关系函数
   * @param {string} fromId - 源节点ID
   * @param {string} toId - 目标节点ID
   * @param {string} relationship - 关系类型
   * @returns {string} 结果
   */
  _mockAddRelationship(fromId, toId, relationship) {
    console.log(`模拟添加关系: ${fromId} -> ${relationship} -> ${toId}`);
    return 'success';
  }

  /**
   * 记录事件
   * @param {string} eventType - 事件类型
   * @param {string} content - 事件内容
   * @param {Array} participants - 事件参与者
   * @param {Object} metadata - 事件元数据
   * @returns {string} 事件ID
   */
  recordEvent(eventType, content, participants = [], metadata = {}) {
    // 生成事件ID
    const eventId = `event_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`;
    
    // 构建事件数据
    const eventData = {
      id: eventId,
      type: eventType,
      content: content,
      timestamp: Date.now(),
      participants: participants || [],
      metadata: metadata || {}
    };
    
    // 记录事件历史
    this.eventHistory[eventId] = eventData;
    
    // 更新事件统计
    if (!this.eventStats[eventType]) {
      this.eventStats[eventType] = 0;
    }
    this.eventStats[eventType] += 1;
    
    // 记录到DAG（带重试机制）
    if (this.dagAdd) {
      let retryCount = 0;
      while (retryCount < this.maxRetries) {
        try {
          // 构建事件内容
          let eventContent = `事件类型: ${eventType}\n内容: ${content}`;
          if (participants && participants.length > 0) {
            eventContent += `\n参与者: ${participants.join(', ')}`;
          }
          if (metadata && Object.keys(metadata).length > 0) {
            eventContent += `\n元数据: ${JSON.stringify(metadata)}`;
          }
          // 调用 dagAdd 函数
          const result = this.dagAdd(eventContent, 'events');
          console.log(`事件记录到 DAG 成功: ${result}`);
          
          // 自动触发 DAG 查询技能验证事件记录
          try {
            // 尝试导入dag_query技能
            let dagQuerySkill = null;
            try {
              const dagQueryModule = require('./skills/dag_query');
              dagQuerySkill = dagQueryModule.run;
            } catch (error) {
              console.warn('dag_query技能未找到，跳过验证');
            }
            
            if (dagQuerySkill) {
              // 查询与当前事件相关的记录
              const result = dagQuerySkill('query', { keyword: eventType });
              console.log(`事件记录验证结果: ${result}`);
              // 记录验证结果
              this.validationHistory[eventId] = {
                status: 'success',
                result: result,
                timestamp: Date.now()
              };
            }
          } catch (error) {
            console.error('触发 DAG 查询技能失败:', error.message);
            this.validationHistory[eventId] = {
              status: 'failed',
              error: error.message,
              timestamp: Date.now()
            };
          }
          
          // 自动触发迭代记录技能，当事件类型为系统变更相关事件时
          if (['skill_created', 'skill_updated', 'skill_deleted', 'skill_auto_created', 'task_completed'].includes(eventType)) {
            try {
              // 尝试导入iteration_recorder技能
              let iterationRecorderSkill = null;
              try {
                const iterationModule = require('./skills/iteration_recorder');
                iterationRecorderSkill = iterationModule.run;
              } catch (error) {
                console.warn('iteration_recorder技能未找到，跳过迭代记录');
              }
              
              if (iterationRecorderSkill) {
                // 自动记录迭代
                const result = iterationRecorderSkill('自动记录迭代');
                console.log(`迭代记录结果: ${result}`);
              }
            } catch (error) {
              console.error('触发迭代记录技能失败:', error.message);
            }
          }
          
          break; // 成功，跳出重试循环
        } catch (error) {
          retryCount += 1;
          console.error(`记录事件到 DAG 失败 (尝试 ${retryCount}/${this.maxRetries}):`, error.message);
          if (retryCount >= this.maxRetries) {
            console.error('记录事件到 DAG 最终失败:', error.message);
          }
        }
      }
    }
    
    // 记录到知识图谱（带重试机制）
    if (this.addKnowledge) {
      let retryCount = 0;
      while (retryCount < this.maxRetries) {
        try {
          // 添加事件实体
          const nodeId = this.addKnowledge(`事件: ${eventType}\n内容: ${content}`, 'events');
          console.log(`事件记录到知识图谱成功: ${nodeId}`);
          
          // 添加事件关系
          if (participants && participants.length > 0) {
            for (const participant of participants) {
              try {
                // 为参与者创建知识节点
                const participantNodeId = this.addKnowledge(participant, 'participants');
                // 添加关系
                this.addRelationship(nodeId, participantNodeId, 'has_participant');
                console.log(`添加参与者 ${participant} 关系成功`);
              } catch (error) {
                console.error(`添加参与者 ${participant} 关系失败:`, error.message);
              }
            }
          }
          break; // 成功，跳出重试循环
        } catch (error) {
          retryCount += 1;
          console.error(`记录事件到知识图谱失败 (尝试 ${retryCount}/${this.maxRetries}):`, error.message);
          if (retryCount >= this.maxRetries) {
            console.error('记录事件到知识图谱最终失败:', error.message);
          }
        }
      }
    }
    
    console.log(`事件记录完成，事件ID: ${eventId}`);
    return eventId;
  }

  /**
   * 记录任务事件
   * @param {Object} task - 任务信息字典
   * @returns {Array} 事件ID列表
   */
  recordTaskEvent(task) {
    const eventIds = [];
    const taskName = task.name || 'unknown';
    const taskId = task.id || 'unknown';
    
    console.log(`开始记录任务事件: ${taskName} (ID: ${taskId})`);
    
    // 任务开始事件
    try {
      const startEventId = this.recordEvent(
        'task_started',
        `开始任务: ${taskName}`,
        [],
        {
          task_id: taskId,
          task_name: taskName,
          task_description: task.description || ''
        }
      );
      eventIds.push(startEventId);
      console.log(`任务开始事件记录成功: ${startEventId}`);
    } catch (error) {
      console.error('记录任务开始事件失败:', error.message);
    }
    
    // 任务步骤事件
    if (task.steps && Array.isArray(task.steps)) {
      task.steps.forEach((step, index) => {
        try {
          const stepEventId = this.recordEvent(
            'task_step_completed',
            `完成步骤: ${step.name}`,
            [],
            {
              task_id: taskId,
              step_name: step.name,
              step_details: step.details || '',
              step_index: index + 1
            }
          );
          eventIds.push(stepEventId);
          console.log(`步骤 ${index + 1} 事件记录成功: ${stepEventId}`);
        } catch (error) {
          console.error(`记录步骤 ${index + 1} 事件失败:`, error.message);
        }
      });
    }
    
    // 任务完成事件
    try {
      const completeEventId = this.recordEvent(
        'task_completed',
        `完成任务: ${taskName}`,
        [],
        {
          task_id: taskId,
          task_result: task.result || '',
          task_duration: task.duration || 0
        }
      );
      eventIds.push(completeEventId);
      console.log(`任务完成事件记录成功: ${completeEventId}`);
    } catch (error) {
      console.error('记录任务完成事件失败:', error.message);
    }
    
    console.log(`任务事件记录完成，共记录 ${eventIds.length} 个事件`);
    return eventIds;
  }

  /**
   * 获取事件历史
   * @param {string} eventId - 事件ID，若为null则返回所有事件历史
   * @returns {Object} 事件历史
   */
  getEventHistory(eventId = null) {
    if (eventId) {
      return this.eventHistory[eventId] || {};
    }
    return this.eventHistory;
  }

  /**
   * 获取事件统计
   * @returns {Object} 事件统计
   */
  getEventStats() {
    return this.eventStats;
  }

  /**
   * 获取验证历史
   * @param {string} eventId - 事件ID，若为null则返回所有验证历史
   * @returns {Object} 验证历史
   */
  getValidationHistory(eventId = null) {
    if (eventId) {
      return this.validationHistory[eventId] || {};
    }
    return this.validationHistory;
  }

  /**
   * 清空历史记录
   */
  clearHistory() {
    this.eventHistory = {};
    this.eventStats = {};
    this.validationHistory = {};
    console.log('历史记录已清空');
  }

  /**
   * 导出历史记录
   * @param {string} filename - 导出文件名
   */
  exportHistory(filename) {
    try {
      const historyData = {
        event_history: this.eventHistory,
        event_stats: this.eventStats,
        validation_history: this.validationHistory
      };
      fs.writeFileSync(filename, JSON.stringify(historyData, null, 2), 'utf-8');
      console.log(`历史记录导出成功: ${filename}`);
    } catch (error) {
      console.error('导出历史记录失败:', error.message);
    }
  }
}

// 全局事件记录器
const eventRecorder = new EventRecorder();

// 导出函数
function recordEvent(eventType, content, participants = [], metadata = {}) {
  return eventRecorder.recordEvent(eventType, content, participants, metadata);
}

function recordTaskEvent(task) {
  return eventRecorder.recordTaskEvent(task);
}

function getEventHistory(eventId = null) {
  return eventRecorder.getEventHistory(eventId);
}

function getEventStats() {
  return eventRecorder.getEventStats();
}

function getValidationHistory(eventId = null) {
  return eventRecorder.getValidationHistory(eventId);
}

function clearHistory() {
  eventRecorder.clearHistory();
}

function exportHistory(filename) {
  eventRecorder.exportHistory(filename);
}

module.exports = {
  EventRecorder,
  eventRecorder,
  recordEvent,
  recordTaskEvent,
  getEventHistory,
  getEventStats,
  getValidationHistory,
  clearHistory,
  exportHistory
};
