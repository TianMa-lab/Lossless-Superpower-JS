const fs = require('fs');
const path = require('path');
const { storageManager } = require('./storage_manager');

class IterationManager {
  constructor(iterationsPath = 'iterations') {
    this.iterationsPath = path.join(__dirname, iterationsPath);
    this.mainRecordsFile = path.join(this.iterationsPath, 'iterations.json');
    this._ensureDirectory();
    this.iterations = this._loadIterations();
  }

  _ensureDirectory() {
    if (!fs.existsSync(this.iterationsPath)) {
      fs.mkdirSync(this.iterationsPath, { recursive: true });
    }
  }

  _loadIterations() {
    try {
      if (fs.existsSync(this.mainRecordsFile)) {
        const data = fs.readFileSync(this.mainRecordsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('加载迭代记录失败:', error);
    }
    return [];
  }

  // 从描述中提取借鉴的外部系统信息
  _extractReferencedSystems(description) {
    const referenced_systems = [];
    if (description.includes('Hermes')) {
      referenced_systems.push('Hermes');
    }
    if (description.toLowerCase().includes('superpower')) {
      referenced_systems.push('Superpower');
    }
    if (description.toLowerCase().includes('lossless')) {
      referenced_systems.push('Lossless Superpower');
    }
    return referenced_systems;
  }

  _saveIterations() {
    try {
      // 使用存储管理器存储数据
      storageManager.storeData('iterations', this.iterations, {
        filename: 'iterations.json'
      });
      
      // 同时保存到本地文件以保持兼容性
      fs.writeFileSync(this.mainRecordsFile, JSON.stringify(this.iterations, null, 2));
      return true;
    } catch (error) {
      console.error('保存迭代记录失败:', error);
      return false;
    }
  }

  // 获取所有迭代记录
  getAllIterations() {
    return this.iterations;
  }

  // 根据版本号获取迭代记录
  getIterationByVersion(version) {
    return this.iterations.find(iteration => iteration.version === version);
  }

  // 根据ID获取迭代记录
  getIterationById(id) {
    return this.iterations.find(iteration => iteration.id === id);
  }

  // 获取最近的N条迭代记录
  getRecentIterations(limit = 10) {
    return this.iterations.slice(0, limit);
  }

  // 根据日期范围获取迭代记录
  getIterationsByDateRange(startDate, endDate) {
    return this.iterations.filter(iteration => {
      const iterationDate = new Date(iteration.date);
      return iterationDate >= new Date(startDate) && iterationDate <= new Date(endDate);
    });
  }

  // 根据借鉴的系统获取迭代记录
  getIterationsBySystem(system) {
    return this.iterations.filter(iteration => {
      return iteration.referenced_systems && iteration.referenced_systems.includes(system);
    });
  }

  // 统计信息
  getStatistics() {
    const totalIterations = this.iterations.length;
    const featuresAdded = this.iterations.reduce((count, iteration) => {
      return count + (iteration.features_added ? iteration.features_added.length : 0);
    }, 0);
    const featuresImproved = this.iterations.reduce((count, iteration) => {
      return count + (iteration.features_improved ? iteration.features_improved.length : 0);
    }, 0);
    const bugFixes = this.iterations.reduce((count, iteration) => {
      return count + (iteration.bug_fixes ? iteration.bug_fixes.length : 0);
    }, 0);
    const filesModified = this.iterations.reduce((count, iteration) => {
      return count + (iteration.files_modified ? iteration.files_modified.length : 0);
    }, 0);

    // 按月份统计
    const monthlyStats = {};
    this.iterations.forEach(iteration => {
      const month = iteration.date.substring(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          count: 0,
          featuresAdded: 0,
          featuresImproved: 0,
          bugFixes: 0
        };
      }
      monthlyStats[month].count++;
      monthlyStats[month].featuresAdded += (iteration.features_added ? iteration.features_added.length : 0);
      monthlyStats[month].featuresImproved += (iteration.features_improved ? iteration.features_improved.length : 0);
      monthlyStats[month].bugFixes += (iteration.bug_fixes ? iteration.bug_fixes.length : 0);
    });

    // 按系统借鉴统计
    const systemStats = {};
    this.iterations.forEach(iteration => {
      if (iteration.referenced_systems) {
        iteration.referenced_systems.forEach(system => {
          if (!systemStats[system]) {
            systemStats[system] = 0;
          }
          systemStats[system]++;
        });
      }
    });

    return {
      totalIterations,
      featuresAdded,
      featuresImproved,
      bugFixes,
      filesModified,
      monthlyStats,
      systemStats,
      averageFeaturesPerIteration: totalIterations > 0 ? (featuresAdded + featuresImproved) / totalIterations : 0
    };
  }

  // 导出迭代数据
  exportData(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.iterations, null, 2);
    } else if (format === 'csv') {
      // 生成CSV格式
      const headers = ['id', 'version', 'date', 'title', 'description', 'referenced_systems', 'updates', 'files_modified', 'features_added', 'features_improved', 'performance_changes', 'bug_fixes', 'issues', 'notes', 'author', 'timestamp'];
      const rows = this.iterations.map(iteration => {
        return headers.map(header => {
          const value = iteration[header];
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          } else if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          } else {
            return value;
          }
        }).join(',');
      });
      return [headers.join(','), ...rows].join('\n');
    } else {
      throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  // 导入迭代数据
  importData(data, format = 'json') {
    try {
      let importedIterations;
      if (format === 'json') {
        importedIterations = typeof data === 'string' ? JSON.parse(data) : data;
      } else if (format === 'csv') {
        // 解析CSV格式
        const lines = data.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        importedIterations = lines.slice(1).map(line => {
          const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => v.replace(/"/g, ''));
          const iteration = {};
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === 'timestamp') {
              iteration[header] = parseFloat(value);
            } else if (['referenced_systems', 'updates', 'files_modified', 'features_added', 'features_improved', 'performance_changes', 'bug_fixes', 'issues'].includes(header)) {
              iteration[header] = value ? value.split('; ').map(item => item.trim()) : [];
            } else {
              iteration[header] = value;
            }
          });
          return iteration;
        });
      } else {
        throw new Error(`不支持的导入格式: ${format}`);
      }

      // 合并数据，避免重复
      const existingIds = new Set(this.iterations.map(iteration => iteration.id));
      const newIterations = importedIterations.filter(iteration => !existingIds.has(iteration.id));
      
      this.iterations = [...newIterations, ...this.iterations];
      // 按时间戳排序
      this.iterations.sort((a, b) => b.timestamp - a.timestamp);
      
      return this._saveIterations();
    } catch (error) {
      console.error('导入迭代数据失败:', error);
      return false;
    }
  }

  // 生成机器学习特征
  generateMachineLearningFeatures() {
    return this.iterations.map(iteration => {
      const features = {
        version: iteration.version,
        timestamp: iteration.timestamp,
        date: iteration.date,
        has_features_added: (iteration.features_added && iteration.features_added.length > 0) ? 1 : 0,
        has_features_improved: (iteration.features_improved && iteration.features_improved.length > 0) ? 1 : 0,
        has_bug_fixes: (iteration.bug_fixes && iteration.bug_fixes.length > 0) ? 1 : 0,
        has_performance_changes: (iteration.performance_changes && iteration.performance_changes.length > 0) ? 1 : 0,
        features_added_count: iteration.features_added ? iteration.features_added.length : 0,
        features_improved_count: iteration.features_improved ? iteration.features_improved.length : 0,
        bug_fixes_count: iteration.bug_fixes ? iteration.bug_fixes.length : 0,
        files_modified_count: iteration.files_modified ? iteration.files_modified.length : 0,
        updates_count: iteration.updates ? iteration.updates.length : 0,
        referenced_systems_count: iteration.referenced_systems ? iteration.referenced_systems.length : 0,
        description_length: iteration.description ? iteration.description.length : 0,
        notes_length: iteration.notes ? iteration.notes.length : 0,
        is_auto_generated: iteration.author === '系统' ? 1 : 0
      };

      // 提取时间特征
      const date = new Date(iteration.date);
      features.year = date.getFullYear();
      features.month = date.getMonth() + 1;
      features.day = date.getDate();
      features.day_of_week = date.getDay();

      return features;
    });
  }

  // 生成报告
  generateReport(format = 'json') {
    const statistics = this.getStatistics();
    const recentIterations = this.getRecentIterations(5);

    if (format === 'json') {
      return {
        generated_at: new Date().toISOString(),
        statistics,
        recent_iterations: recentIterations,
        total_iterations: this.iterations.length
      };
    } else if (format === 'markdown') {
      let report = `# 迭代记录报告\n\n`;
      report += `生成时间: ${new Date().toISOString().replace('T', ' ').split('.')[0]}\n`;
      report += `总迭代次数: ${statistics.totalIterations}\n`;
      report += `平均每次迭代新增/改进功能数: ${statistics.averageFeaturesPerIteration.toFixed(2)}\n\n`;

      report += `## 统计信息\n`;
      report += `- 新增功能: ${statistics.featuresAdded}\n`;
      report += `- 改进功能: ${statistics.featuresImproved}\n`;
      report += `- Bug修复: ${statistics.bugFixes}\n`;
      report += `- 修改文件: ${statistics.filesModified}\n\n`;

      if (Object.keys(statistics.monthlyStats).length > 0) {
        report += `## 月度统计\n`;
        Object.entries(statistics.monthlyStats).forEach(([month, stats]) => {
          report += `- ${month}: ${stats.count}次迭代, 新增${stats.featuresAdded}个功能, 改进${stats.featuresImproved}个功能, 修复${stats.bugFixes}个Bug\n`;
        });
        report += `\n`;
      }

      if (Object.keys(statistics.systemStats).length > 0) {
        report += `## 系统借鉴统计\n`;
        Object.entries(statistics.systemStats).forEach(([system, count]) => {
          report += `- ${system}: ${count}次\n`;
        });
        report += `\n`;
      }

      if (recentIterations.length > 0) {
        report += `## 最近迭代\n`;
        recentIterations.forEach(iteration => {
          report += `### ${iteration.title} (${iteration.date})\n`;
          report += `**版本**: ${iteration.version}\n`;
          report += `**描述**: ${iteration.description}\n`;
          if (iteration.features_added && iteration.features_added.length > 0) {
            report += `**新增功能**: ${iteration.features_added.join(', ')}\n`;
          }
          if (iteration.features_improved && iteration.features_improved.length > 0) {
            report += `**改进功能**: ${iteration.features_improved.join(', ')}\n`;
          }
          if (iteration.bug_fixes && iteration.bug_fixes.length > 0) {
            report += `**Bug修复**: ${iteration.bug_fixes.join(', ')}\n`;
          }
          report += `\n`;
        });
      }

      return report;
    } else {
      throw new Error(`不支持的报告格式: ${format}`);
    }
  }

  // 添加迭代记录
  addIteration(iteration) {
    // 确保迭代数据包含必要的字段
    const iterationId = iteration.id || `iteration_${Date.now()}`;
    const timestamp = iteration.timestamp || Date.now() / 1000;
    const title = iteration.title || `迭代_${iterationId}`;
    const description = iteration.description || '';
    
    // 提取借鉴的外部系统信息
    let referenced_systems = iteration.referenced_systems || [];
    if (referenced_systems.length === 0) {
      // 尝试从描述中提取
      referenced_systems = this._extractReferencedSystems(description);
      if (referenced_systems.length === 0) {
        referenced_systems = ['Lossless Superpower'];
      }
    }
    
    // 构建完整的迭代记录
    const completeIteration = {
      id: iterationId,
      timestamp,
      version: iteration.version || '',
      date: iteration.date || new Date().toISOString().split('T')[0],
      title,
      description,
      referenced_systems,
      updates: iteration.updates || [],
      files_modified: iteration.files_modified || [],
      features_added: iteration.features_added || [],
      features_improved: iteration.features_improved || [],
      performance_changes: iteration.performance_changes || [],
      bug_fixes: iteration.bug_fixes || [],
      related_tasks: iteration.related_tasks || [],
      issues: iteration.issues || [],
      notes: iteration.notes || '',
      author: iteration.author || '系统',
      status: iteration.status || 'completed'
    };

    const existingIndex = this.iterations.findIndex(item => item.id === completeIteration.id);
    if (existingIndex >= 0) {
      // 更新现有记录
      this.iterations[existingIndex] = completeIteration;
    } else {
      // 添加新记录
      this.iterations.push(completeIteration);
    }
    // 按时间戳排序
    this.iterations.sort((a, b) => b.timestamp - a.timestamp);
    return this._saveIterations();
  }

  // 更新迭代记录
  updateIteration(id, updates) {
    const existingIndex = this.iterations.findIndex(item => item.id === id);
    if (existingIndex >= 0) {
      // 更新现有记录
      this.iterations[existingIndex] = {
        ...this.iterations[existingIndex],
        ...updates,
        timestamp: Date.now() / 1000
      };
      // 按时间戳排序
      this.iterations.sort((a, b) => b.timestamp - a.timestamp);
      return this._saveIterations();
    }
    return false;
  }

  // 删除迭代记录
  deleteIteration(id) {
    const originalLength = this.iterations.length;
    this.iterations = this.iterations.filter(iteration => iteration.id !== id);
    if (this.iterations.length < originalLength) {
      return this._saveIterations();
    }
    return false;
  }

  // 清理旧数据
  cleanupOldData(daysToKeep = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffTimestamp = cutoffDate.getTime() / 1000;

    const originalLength = this.iterations.length;
    this.iterations = this.iterations.filter(iteration => iteration.timestamp >= cutoffTimestamp);
    
    if (this.iterations.length < originalLength) {
      return this._saveIterations();
    }
    return false;
  }
}

// 全局迭代管理器实例
const iterationManager = new IterationManager();

// 导出函数
function getAllIterations() {
  return iterationManager.getAllIterations();
}

function getIterationByVersion(version) {
  return iterationManager.getIterationByVersion(version);
}

function getIterationById(id) {
  return iterationManager.getIterationById(id);
}

function getRecentIterations(limit = 10) {
  return iterationManager.getRecentIterations(limit);
}

function getIterationsByDateRange(startDate, endDate) {
  return iterationManager.getIterationsByDateRange(startDate, endDate);
}

function getIterationsBySystem(system) {
  return iterationManager.getIterationsBySystem(system);
}

function getStatistics() {
  return iterationManager.getStatistics();
}

function updateIteration(id, updates) {
  return iterationManager.updateIteration(id, updates);
}

function exportData(format = 'json') {
  return iterationManager.exportData(format);
}

function importData(data, format = 'json') {
  return iterationManager.importData(data, format);
}

function generateMachineLearningFeatures() {
  return iterationManager.generateMachineLearningFeatures();
}

function generateReport(format = 'json') {
  return iterationManager.generateReport(format);
}

function addIteration(iteration) {
  return iterationManager.addIteration(iteration);
}

function deleteIteration(id) {
  return iterationManager.deleteIteration(id);
}

function cleanupOldData(daysToKeep = 365) {
  return iterationManager.cleanupOldData(daysToKeep);
}

module.exports = {
  IterationManager,
  iterationManager,
  getAllIterations,
  getIterationByVersion,
  getIterationById,
  getRecentIterations,
  getIterationsByDateRange,
  getIterationsBySystem,
  getStatistics,
  exportData,
  importData,
  generateMachineLearningFeatures,
  generateReport,
  addIteration,
  updateIteration,
  deleteIteration,
  cleanupOldData
};
