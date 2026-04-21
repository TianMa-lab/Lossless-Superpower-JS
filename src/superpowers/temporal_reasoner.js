const { v4: uuidv4 } = require('uuid');

/**
 * 时序知识图谱
 */
class TemporalKnowledgeGraph {
  constructor() {
    this.entities = new Map();      // 实体字典
    this.relations = new Map();     // 关系字典
    this.temporalTriplets = [];     // 时序三元组列表
    this.timeIndex = new Map();     // 时间索引
  }

  /**
   * 添加实体
   * @param {string} id 实体ID
   * @param {string} type 实体类型
   * @param {Object} attributes 实体属性
   */
  addEntity(id, type, attributes = {}) {
    this.entities.set(id, {
      id,
      type,
      attributes,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * 添加关系
   * @param {string} id 关系ID
   * @param {string} type 关系类型
   * @param {Object} attributes 关系属性
   */
  addRelation(id, type, attributes = {}) {
    this.relations.set(id, {
      id,
      type,
      attributes,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * 添加时序三元组
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @param {Date|string} timestamp 时间戳
   * @param {number} confidence 置信度
   */
  addTemporalTriplet(head, relation, tail, timestamp, confidence = 1.0) {
    const triplet = {
      id: uuidv4(),
      head,
      relation,
      tail,
      timestamp: new Date(timestamp).toISOString(),
      confidence,
      createdAt: new Date().toISOString()
    };

    this.temporalTriplets.push(triplet);
    
    // 更新时间索引
    const timeKey = new Date(timestamp).toISOString().split('T')[0];
    if (!this.timeIndex.has(timeKey)) {
      this.timeIndex.set(timeKey, []);
    }
    this.timeIndex.get(timeKey).push(triplet.id);
  }

  /**
   * 获取某个时间点的三元组
   * @param {Date|string} timestamp 时间戳
   * @returns {Array} 三元组列表
   */
  getTripletsAtTime(timestamp) {
    const timeKey = new Date(timestamp).toISOString().split('T')[0];
    const tripletIds = this.timeIndex.get(timeKey) || [];
    return this.temporalTriplets.filter(triplet => tripletIds.includes(triplet.id));
  }

  /**
   * 获取时间范围内的三元组
   * @param {Date|string} startTime 开始时间
   * @param {Date|string} endTime 结束时间
   * @returns {Array} 三元组列表
   */
  getTripletsInTimeRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    return this.temporalTriplets.filter(triplet => {
      const tripletTime = new Date(triplet.timestamp);
      return tripletTime >= start && tripletTime <= end;
    });
  }

  /**
   * 获取实体在时间范围内的活动
   * @param {string} entityId 实体ID
   * @param {Date|string} startTime 开始时间
   * @param {Date|string} endTime 结束时间
   * @returns {Array} 活动列表
   */
  getEntityActivity(entityId, startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    return this.temporalTriplets.filter(triplet => {
      const tripletTime = new Date(triplet.timestamp);
      return (triplet.head === entityId || triplet.tail === entityId) &&
             tripletTime >= start && tripletTime <= end;
    });
  }

  /**
   * 获取时间线
   * @param {string} entityId 实体ID
   * @returns {Array} 时间线
   */
  getTimeline(entityId) {
    const activities = this.temporalTriplets.filter(triplet => 
      triplet.head === entityId || triplet.tail === entityId
    );

    // 按时间排序
    return activities.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  /**
   * 统计时间分布
   * @returns {Object} 时间分布
   */
  getTimeDistribution() {
    const distribution = {};

    for (const triplet of this.temporalTriplets) {
      const timeKey = triplet.timestamp.split('T')[0];
      distribution[timeKey] = (distribution[timeKey] || 0) + 1;
    }

    return distribution;
  }
}

/**
 * 时序推理器
 */
class TemporalReasoner {
  constructor(config = {}) {
    this.timeGranularity = config.timeGranularity || 'day';
    this.temporalEmbedding = config.temporalEmbedding || true;
    this.maxTimeSteps = config.maxTimeSteps || 10;
    this.graph = new TemporalKnowledgeGraph();
  }

  /**
   * 设置知识图谱
   * @param {TemporalKnowledgeGraph} graph 时序知识图谱
   */
  setGraph(graph) {
    this.graph = graph;
  }

  /**
   * 时序嵌入
   * @param {string} entity 实体
   * @param {Date|string} time 时间
   * @returns {Array} 嵌入向量
   */
  temporalEmbedding(entity, time) {
    // 简化的时序嵌入
    const baseEmbedding = this._getBaseEmbedding(entity);
    const timeEmbedding = this._getTimeEmbedding(time);
    
    // 拼接基础嵌入和时间嵌入
    return [...baseEmbedding, ...timeEmbedding];
  }

  /**
   * 基础嵌入
   * @param {string} entity 实体
   * @returns {Array} 基础嵌入向量
   * @private
   */
  _getBaseEmbedding(entity) {
    // 简化的基础嵌入
    const embedding = [];
    for (let i = 0; i < 16; i++) {
      embedding.push(Math.sin(entity.charCodeAt(i % entity.length) + i));
    }
    return embedding;
  }

  /**
   * 时间嵌入
   * @param {Date|string} time 时间
   * @returns {Array} 时间嵌入向量
   * @private
   */
  _getTimeEmbedding(time) {
    const date = new Date(time);
    const embedding = [];
    
    // 年、月、日、小时的正弦和余弦值
    embedding.push(Math.sin(date.getFullYear() / 100));
    embedding.push(Math.cos(date.getFullYear() / 100));
    embedding.push(Math.sin(date.getMonth() / 12));
    embedding.push(Math.cos(date.getMonth() / 12));
    embedding.push(Math.sin(date.getDate() / 31));
    embedding.push(Math.cos(date.getDate() / 31));
    embedding.push(Math.sin(date.getHours() / 24));
    embedding.push(Math.cos(date.getHours() / 24));
    
    return embedding;
  }

  /**
   * 时序推理
   * @param {Object} query 查询
   * @param {Object} timeRange 时间范围
   * @returns {Array} 推理结果
   */
  async temporalInference(query, timeRange) {
    const { entity, relation } = query;
    const { start, end } = timeRange;

    // 获取时间范围内的相关三元组
    const relevantTriplets = this.graph.getTripletsInTimeRange(start, end);
    
    // 构建时间序列
    const timeSeries = this._buildTimeSeries(relevantTriplets, entity, relation);
    
    // 预测未来事件
    const predictions = this._predictFutureEvents(timeSeries, query, end);
    
    return {
      timeSeries,
      predictions
    };
  }

  /**
   * 构建时间序列
   * @param {Array} triplets 三元组列表
   * @param {string} entity 实体
   * @param {string} relation 关系
   * @returns {Array} 时间序列
   * @private
   */
  _buildTimeSeries(triplets, entity, relation) {
    const timeSeries = [];
    
    for (const triplet of triplets) {
      if ((triplet.head === entity || triplet.tail === entity) &&
          (relation === null || triplet.relation === relation)) {
        timeSeries.push({
          timestamp: triplet.timestamp,
          event: {
            head: triplet.head,
            relation: triplet.relation,
            tail: triplet.tail,
            confidence: triplet.confidence
          }
        });
      }
    }
    
    // 按时间排序
    return timeSeries.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  /**
   * 预测未来事件
   * @param {Array} timeSeries 时间序列
   * @param {Object} query 查询
   * @param {Date|string} endTime 结束时间
   * @returns {Array} 预测结果
   * @private
   */
  _predictFutureEvents(timeSeries, query, endTime) {
    const predictions = [];
    const end = new Date(endTime);
    
    // 简单的基于频率的预测
    if (timeSeries.length > 0) {
      // 计算事件频率
      const eventCounts = {};
      for (const item of timeSeries) {
        const eventKey = `${item.event.relation}:${item.event.tail}`;
        eventCounts[eventKey] = (eventCounts[eventKey] || 0) + 1;
      }
      
      // 按频率排序
      const sortedEvents = Object.entries(eventCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      // 生成预测
      for (const [eventKey, count] of sortedEvents) {
        const [relation, tail] = eventKey.split(':');
        const confidence = count / timeSeries.length;
        
        // 预测未来7天的事件
        for (let i = 1; i <= 7; i++) {
          const predictionTime = new Date(end);
          predictionTime.setDate(predictionTime.getDate() + i);
          
          predictions.push({
            time: predictionTime.toISOString(),
            event: {
              head: query.entity,
              relation,
              tail,
              confidence
            }
          });
        }
      }
    }
    
    return predictions;
  }

  /**
   * 时间线查询
   * @param {string} entity 实体
   * @param {Object} timeRange 时间范围
   * @returns {Array} 时间线
   */
  async timelineQuery(entity, timeRange = null) {
    if (timeRange) {
      const { start, end } = timeRange;
      return this.graph.getEntityActivity(entity, start, end);
    } else {
      return this.graph.getTimeline(entity);
    }
  }

  /**
   * 事件预测
   * @param {string} entity 实体
   * @param {Date|string} time 时间
   * @param {number} horizon 预测范围（天）
   * @returns {Array} 预测结果
   */
  async eventPrediction(entity, time, horizon = 7) {
    const startTime = new Date(time);
    startTime.setDate(startTime.getDate() - 30); // 过去30天的数据
    
    const query = { entity, relation: null };
    const timeRange = { start: startTime, end: time };
    
    const result = await this.temporalInference(query, timeRange);
    return result.predictions.slice(0, horizon);
  }

  /**
   * 时间模式挖掘
   * @param {string} entity 实体
   * @param {number} minSupport 最小支持度
   * @returns {Array} 时间模式
   */
  async timePatternMining(entity, minSupport = 3) {
    const timeline = this.graph.getTimeline(entity);
    const patterns = [];
    
    // 挖掘时间间隔模式
    const timeIntervals = [];
    for (let i = 1; i < timeline.length; i++) {
      const time1 = new Date(timeline[i-1].timestamp);
      const time2 = new Date(timeline[i].timestamp);
      const interval = Math.floor((time2 - time1) / (1000 * 60 * 60 * 24)); // 天数
      if (interval > 0) {
        timeIntervals.push(interval);
      }
    }
    
    // 统计间隔频率
    const intervalCounts = {};
    for (const interval of timeIntervals) {
      intervalCounts[interval] = (intervalCounts[interval] || 0) + 1;
    }
    
    // 提取模式
    for (const [interval, count] of Object.entries(intervalCounts)) {
      if (count >= minSupport) {
        patterns.push({
          type: 'time_interval',
          interval: parseInt(interval),
          support: count,
          confidence: count / timeIntervals.length
        });
      }
    }
    
    return patterns;
  }

  /**
   * 时间约束推理
   * @param {Array} events 事件列表
   * @param {Array} constraints 时间约束
   * @returns {Array} 满足约束的事件
   */
  timeConstraintReasoning(events, constraints) {
    return events.filter(event => {
      const eventTime = new Date(event.timestamp);
      
      for (const constraint of constraints) {
        const constraintTime = new Date(constraint.time);
        
        switch (constraint.type) {
          case 'before':
            if (!(eventTime < constraintTime)) return false;
            break;
          case 'after':
            if (!(eventTime > constraintTime)) return false;
            break;
          case 'at':
            if (!(eventTime.toDateString() === constraintTime.toDateString())) return false;
            break;
          case 'within':
            const start = new Date(constraint.start);
            const end = new Date(constraint.end);
            if (!(eventTime >= start && eventTime <= end)) return false;
            break;
        }
      }
      
      return true;
    });
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.graph = new TemporalKnowledgeGraph();
  }
}

/**
 * 时序推理管理器
 */
class TemporalReasonerManager {
  constructor() {
    this.reasoners = new Map();
  }

  /**
   * 创建时序推理器
   * @param {Object} config 配置
   * @returns {Object} 推理器
   */
  createReasoner(config = {}) {
    const reasoner = new TemporalReasoner(config);
    const id = uuidv4();
    this.reasoners.set(id, reasoner);
    return { id, reasoner };
  }

  /**
   * 获取时序推理器
   * @param {string} id 推理器ID
   * @returns {TemporalReasoner} 推理器
   */
  getReasoner(id) {
    return this.reasoners.get(id);
  }

  /**
   * 删除时序推理器
   * @param {string} id 推理器ID
   */
  deleteReasoner(id) {
    this.reasoners.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    for (const reasoner of this.reasoners.values()) {
      reasoner.cleanup();
    }
    this.reasoners.clear();
  }
}

const temporalReasonerManager = new TemporalReasonerManager();

module.exports = {
  TemporalKnowledgeGraph,
  TemporalReasoner,
  TemporalReasonerManager,
  temporalReasonerManager
};
