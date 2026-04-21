const fs = require('fs');
const path = require('path');

class AutoOptimizer {
  constructor(config = {}) {
    this.optimizationDir = config.optimizationDir || 'optimization_data';
    this.knowledgeBaseFile = path.join(this.optimizationDir, 'knowledge_base.json');
    this.historyFile = path.join(this.optimizationDir, 'optimization_history.json');
    
    this.knowledgeBase = [];
    this.optimizationHistory = [];
    
    this._ensureDirectories();
    this._loadKnowledgeBase();
    this._loadHistory();
  }

  _ensureDirectories() {
    if (!fs.existsSync(this.optimizationDir)) {
      fs.mkdirSync(this.optimizationDir, { recursive: true });
    }
  }

  _loadKnowledgeBase() {
    try {
      if (fs.existsSync(this.knowledgeBaseFile)) {
        const data = fs.readFileSync(this.knowledgeBaseFile, 'utf-8');
        this.knowledgeBase = JSON.parse(data);
        console.log(`加载了 ${this.knowledgeBase.length} 条优化知识`);
      }
    } catch (error) {
      console.error('加载优化知识库失败:', error.message);
      this.knowledgeBase = [];
    }
  }

  _saveKnowledgeBase() {
    try {
      fs.writeFileSync(this.knowledgeBaseFile, JSON.stringify(this.knowledgeBase, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存优化知识库失败:', error.message);
      return false;
    }
  }

  _loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf-8');
        this.optimizationHistory = JSON.parse(data);
        console.log(`加载了 ${this.optimizationHistory.length} 条优化历史`);
      }
    } catch (error) {
      console.error('加载优化历史失败:', error.message);
      this.optimizationHistory = [];
    }
  }

  _saveHistory() {
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify(this.optimizationHistory, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存优化历史失败:', error.message);
      return false;
    }
  }

  addKnowledge(knowledge) {
    const entry = {
      id: `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      problem: knowledge.problem,
      solution: knowledge.solution,
      effect: knowledge.effect || 0,
      context: knowledge.context || {},
      tags: knowledge.tags || [],
      success: knowledge.success !== false
    };

    this.knowledgeBase.push(entry);
    this._saveKnowledgeBase();
    
    console.log(`添加优化知识: ${entry.id}`);
    return entry;
  }

  getKnowledge(problem) {
    return this.knowledgeBase.filter(k => 
      k.problem.includes(problem) || k.tags.some(tag => problem.includes(tag))
    );
  }

  getRelevantKnowledge(context) {
    return this.knowledgeBase.filter(k => {
      return Object.keys(context).every(key => {
        return k.context[key] === context[key] || !k.context[key];
      });
    }).sort((a, b) => b.effect - a.effect);
  }

  async executeOptimization(optimization) {
    const record = {
      id: `opt_${Date.now()}`,
      timestamp: Date.now(),
      optimization,
      status: 'pending',
      result: null,
      effect: 0,
      error: null
    };

    try {
      console.log(`执行优化: ${optimization.type}`);
      
      switch (optimization.type) {
        case 'code_optimization':
          record.result = await this._optimizeCode(optimization);
          break;
        case 'performance_tuning':
          record.result = await this._tunePerformance(optimization);
          break;
        case 'resource_allocation':
          record.result = await this._allocateResources(optimization);
          break;
        case 'configuration_update':
          record.result = await this._updateConfiguration(optimization);
          break;
        case 'cleanup':
          record.result = await this._performCleanup(optimization);
          break;
        default:
          record.error = `未知的优化类型: ${optimization.type}`;
          record.status = 'failed';
      }

      if (!record.error) {
        record.status = 'success';
        record.effect = optimization.expectedEffect || 0.5;
      }
    } catch (error) {
      record.error = error.message;
      record.status = 'failed';
      console.error(`优化执行失败: ${error.message}`);
    }

    this.optimizationHistory.push(record);
    if (this.optimizationHistory.length > 500) {
      this.optimizationHistory = this.optimizationHistory.slice(-500);
    }
    this._saveHistory();

    if (record.status === 'success' && record.result) {
      this.addKnowledge({
        problem: optimization.type,
        solution: JSON.stringify(record.result),
        effect: record.effect,
        context: optimization.context || {},
        tags: optimization.tags || [optimization.type]
      });
    }

    return record;
  }

  async _optimizeCode(optimization) {
    await this._simulateDelay(100);
    return {
      action: 'code_optimization',
      changes: optimization.changes || [],
      summary: '代码优化完成'
    };
  }

  async _tunePerformance(optimization) {
    await this._simulateDelay(100);
    return {
      action: 'performance_tuning',
      metrics: optimization.metrics || {},
      summary: '性能调优完成'
    };
  }

  async _allocateResources(optimization) {
    await this._simulateDelay(100);
    return {
      action: 'resource_allocation',
      allocation: optimization.allocation || {},
      summary: '资源分配完成'
    };
  }

  async _updateConfiguration(optimization) {
    await this._simulateDelay(100);
    return {
      action: 'configuration_update',
      config: optimization.config || {},
      summary: '配置更新完成'
    };
  }

  async _performCleanup(optimization) {
    await this._simulateDelay(100);
    return {
      action: 'cleanup',
      cleaned: optimization.targets || [],
      summary: '清理完成'
    };
  }

  _simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getHistory(limit = 100) {
    return this.optimizationHistory.slice(-limit);
  }

  getHistoryByType(type) {
    return this.optimizationHistory.filter(h => h.optimization.type === type);
  }

  getStatistics() {
    const total = this.optimizationHistory.length;
    const success = this.optimizationHistory.filter(h => h.status === 'success').length;
    const failed = this.optimizationHistory.filter(h => h.status === 'failed').length;
    const averageEffect = total > 0 
      ? this.optimizationHistory.reduce((sum, h) => sum + h.effect, 0) / total 
      : 0;

    const byType = {};
    this.optimizationHistory.forEach(h => {
      const type = h.optimization.type;
      if (!byType[type]) {
        byType[type] = { total: 0, success: 0, failed: 0, totalEffect: 0 };
      }
      byType[type].total++;
      if (h.status === 'success') byType[type].success++;
      if (h.status === 'failed') byType[type].failed++;
      byType[type].totalEffect += h.effect;
    });

    return {
      total,
      success,
      failed,
      successRate: total > 0 ? success / total : 0,
      averageEffect,
      byType
    };
  }

  getRecommendations() {
    const recommendations = [];
    const stats = this.getStatistics();

    if (stats.successRate < 0.5) {
      recommendations.push({
        priority: 'high',
        type: 'review_strategy',
        reason: '优化成功率较低，建议审查优化策略',
        currentRate: stats.successRate
      });
    }

    const typeStats = Object.entries(stats.byType);
    if (typeStats.length > 0) {
      const worstType = typeStats.sort((a, b) => {
        const rateA = a[1].total > 0 ? a[1].success / a[1].total : 0;
        const rateB = b[1].total > 0 ? b[1].success / b[1].total : 0;
        return rateA - rateB;
      })[0];

      if (worstType && worstType[1].total > 3) {
        const rate = worstType[1].total > 0 ? worstType[1].success / worstType[1].total : 0;
        if (rate < 0.7) {
          recommendations.push({
            priority: 'medium',
            type: 'improve_category',
            category: worstType[0],
            reason: `${worstType[0]}类型的优化成功率较低，建议改进`,
            currentRate: rate
          });
        }
      }
    }

    const recentKnowledge = this.getRecentKnowledge(10);
    if (recentKnowledge.length === 0) {
      recommendations.push({
        priority: 'low',
        type: 'knowledge_collection',
        reason: '优化知识库为空，建议开始收集优化经验'
      });
    }

    return recommendations;
  }

  getRecentKnowledge(limit = 10) {
    return this.knowledgeBase
      .filter(k => k.success)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  clearHistory() {
    this.optimizationHistory = [];
    this._saveHistory();
    console.log('优化历史已清空');
  }

  exportKnowledge() {
    return JSON.stringify(this.knowledgeBase, null, 2);
  }

  importKnowledge(data) {
    try {
      const imported = typeof data === 'string' ? JSON.parse(data) : data;
      this.knowledgeBase = [...this.knowledgeBase, ...imported];
      this._saveKnowledgeBase();
      return true;
    } catch (error) {
      console.error('导入优化知识失败:', error.message);
      return false;
    }
  }
}

const autoOptimizer = new AutoOptimizer();

function addKnowledge(knowledge) {
  return autoOptimizer.addKnowledge(knowledge);
}

function getKnowledge(problem) {
  return autoOptimizer.getKnowledge(problem);
}

function getRelevantKnowledge(context) {
  return autoOptimizer.getRelevantKnowledge(context);
}

function executeOptimization(optimization) {
  return autoOptimizer.executeOptimization(optimization);
}

function getOptimizationHistory(limit) {
  return autoOptimizer.getHistory(limit);
}

function getOptimizationHistoryByType(type) {
  return autoOptimizer.getHistoryByType(type);
}

function getOptimizationStatistics() {
  return autoOptimizer.getStatistics();
}

function getRecommendations() {
  return autoOptimizer.getRecommendations();
}

function getRecentKnowledge(limit) {
  return autoOptimizer.getRecentKnowledge(limit);
}

function clearOptimizationHistory() {
  return autoOptimizer.clearHistory();
}

function exportOptimizationKnowledge() {
  return autoOptimizer.exportKnowledge();
}

function importOptimizationKnowledge(data) {
  return autoOptimizer.importKnowledge(data);
}

module.exports = {
  AutoOptimizer,
  autoOptimizer,
  addKnowledge,
  getKnowledge,
  getRelevantKnowledge,
  executeOptimization,
  getOptimizationHistory,
  getOptimizationHistoryByType,
  getOptimizationStatistics,
  getRecommendations,
  getRecentKnowledge,
  clearOptimizationHistory,
  exportOptimizationKnowledge,
  importOptimizationKnowledge
};
