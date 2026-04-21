const { storageLayer } = require('../storage');
const fs = require('fs');
const path = require('path');

class PermanentMemorySystem {
  constructor() {
    this.storageLayer = storageLayer;
    this.backupDir = path.join(__dirname, 'memory_backups');
    this.compressionEnabled = true;
    this.memoryIndex = new Map();
    this.memoryGraph = new Map();
    this.memoryQualityScores = new Map();
  }

  async init() {
    try {
      // 确保备份目录存在
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }

      // 初始化存储层
      const storageInitialized = await this.storageLayer.init();
      if (!storageInitialized) {
        console.error('永久记忆系统初始化失败：存储层初始化失败');
        return false;
      }

      // 初始化记忆索引
      await this._buildMemoryIndex();
      
      // 初始化记忆图谱
      await this._buildMemoryGraph();

      console.log('永久记忆系统初始化成功');
      return true;
    } catch (error) {
      console.error('永久记忆系统初始化失败:', error.message);
      return false;
    }
  }

  // 添加记忆
  async addMemory(content, type = 'general', importance = 0, tags = '', metadata = {}) {
    try {
      const memory = {
        id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        type,
        timestamp: Date.now(),
        importance,
        tags,
        metadata: JSON.stringify(metadata)
      };

      const success = await this.storageLayer.addMemory(memory);
      if (success) {
        // 更新索引
        this._updateMemoryIndex(memory);
        
        // 更新记忆图谱
        await this._updateMemoryGraph(memory);
        
        // 计算记忆质量
        const qualityScore = this._calculateMemoryQuality(memory);
        this.memoryQualityScores.set(memory.id, qualityScore);
        
        // 自动整理记忆
        await this.organizeMemories();
        return memory.id;
      } else {
        return null;
      }
    } catch (error) {
      console.error('添加记忆失败:', error.message);
      return null;
    }
  }

  // 获取记忆
  async getMemories(limit = 100, offset = 0) {
    try {
      const memories = await this.storageLayer.getMemories(limit, offset);
      return memories;
    } catch (error) {
      console.error('获取记忆失败:', error.message);
      return [];
    }
  }

  // 按类型获取记忆
  async getMemoriesByType(type, limit = 100) {
    try {
      const memories = await this.storageLayer.getMemoriesByType(type, limit);
      return memories;
    } catch (error) {
      console.error('按类型获取记忆失败:', error.message);
      return [];
    }
  }

  // 按标签获取记忆
  async getMemoriesByTag(tag, limit = 100) {
    try {
      // 优先从索引中获取
      if (this.memoryIndex.has('tag:' + tag)) {
        const memoryIds = this.memoryIndex.get('tag:' + tag);
        const memories = [];
        for (const memoryId of memoryIds) {
          const memory = await this.getMemoryById(memoryId);
          if (memory) {
            memories.push(memory);
          }
        }
        return memories.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
      }
      
      // 回退到存储层查询
      const allMemories = await this.storageLayer.getMemories(1000);
      const filteredMemories = allMemories
        .filter(memory => memory.tags && memory.tags.includes(tag))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
      return filteredMemories;
    } catch (error) {
      console.error('按标签获取记忆失败:', error.message);
      return [];
    }
  }

  // 按ID获取记忆
  async getMemoryById(id) {
    try {
      return await this.storageLayer.getMemoryById(id);
    } catch (error) {
      console.error('按ID获取记忆失败:', error.message);
      return null;
    }
  }

  // 搜索记忆
  async searchMemories(query, limit = 100) {
    try {
      const allMemories = await this.storageLayer.getMemories(1000);
      const lowerQuery = query.toLowerCase();
      const filteredMemories = allMemories
        .filter(memory => 
          memory.content.toLowerCase().includes(lowerQuery) ||
          memory.tags.toLowerCase().includes(lowerQuery) ||
          (memory.metadata && JSON.parse(memory.metadata).description?.toLowerCase().includes(lowerQuery))
        )
        .sort((a, b) => {
          // 按相关性和时间排序
          const scoreA = this._calculateSearchScore(a, query);
          const scoreB = this._calculateSearchScore(b, query);
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
          return b.timestamp - a.timestamp;
        })
        .slice(0, limit);
      return filteredMemories;
    } catch (error) {
      console.error('搜索记忆失败:', error.message);
      return [];
    }
  }

  // 获取相关记忆
  async getRelatedMemories(memoryId, limit = 10) {
    try {
      if (!this.memoryGraph.has(memoryId)) {
        return [];
      }
      
      const relatedMemories = this.memoryGraph.get(memoryId);
      const memories = [];
      
      for (const [relatedId, score] of relatedMemories.entries()) {
        const memory = await this.getMemoryById(relatedId);
        if (memory) {
          memories.push({ ...memory, relevanceScore: score });
        }
      }
      
      return memories
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    } catch (error) {
      console.error('获取相关记忆失败:', error.message);
      return [];
    }
  }

  // 计算记忆质量
  _calculateMemoryQuality(memory) {
    let score = 0;
    
    // 内容长度
    if (memory.content.length > 100) score += 2;
    if (memory.content.length > 500) score += 3;
    
    // 重要性
    score += memory.importance * 2;
    
    // 标签数量
    const tagCount = memory.tags.split(',').filter(tag => tag.trim()).length;
    score += tagCount;
    
    // 元数据完整性
    try {
      const metadata = JSON.parse(memory.metadata);
      if (metadata.description) score += 2;
      if (metadata.source) score += 1;
      if (metadata.category) score += 1;
    } catch (e) {
      // 元数据解析失败
    }
    
    return score;
  }

  // 计算搜索得分
  _calculateSearchScore(memory, query) {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    
    // 内容匹配
    if (memory.content.toLowerCase().includes(lowerQuery)) {
      score += 3;
    }
    
    // 标签匹配
    if (memory.tags.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }
    
    // 元数据匹配
    try {
      const metadata = JSON.parse(memory.metadata);
      if (metadata.description?.toLowerCase().includes(lowerQuery)) {
        score += 4;
      }
      if (metadata.category?.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }
    } catch (e) {
      // 元数据解析失败
    }
    
    // 重要性加成
    score += memory.importance;
    
    return score;
  }

  // 构建记忆索引
  async _buildMemoryIndex() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      this.memoryIndex.clear();
      
      memories.forEach(memory => {
        // 按标签索引
        if (memory.tags) {
          const tags = memory.tags.split(',').filter(tag => tag.trim());
          tags.forEach(tag => {
            const key = 'tag:' + tag.trim();
            if (!this.memoryIndex.has(key)) {
              this.memoryIndex.set(key, new Set());
            }
            this.memoryIndex.get(key).add(memory.id);
          });
        }
        
        // 按类型索引
        const typeKey = 'type:' + memory.type;
        if (!this.memoryIndex.has(typeKey)) {
          this.memoryIndex.set(typeKey, new Set());
        }
        this.memoryIndex.get(typeKey).add(memory.id);
      });
      
      console.log('记忆索引构建完成，包含', this.memoryIndex.size, '个索引');
    } catch (error) {
      console.error('构建记忆索引失败:', error.message);
    }
  }

  // 更新记忆索引
  _updateMemoryIndex(memory) {
    // 按标签索引
    if (memory.tags) {
      const tags = memory.tags.split(',').filter(tag => tag.trim());
      tags.forEach(tag => {
        const key = 'tag:' + tag.trim();
        if (!this.memoryIndex.has(key)) {
          this.memoryIndex.set(key, new Set());
        }
        this.memoryIndex.get(key).add(memory.id);
      });
    }
    
    // 按类型索引
    const typeKey = 'type:' + memory.type;
    if (!this.memoryIndex.has(typeKey)) {
      this.memoryIndex.set(typeKey, new Set());
    }
    this.memoryIndex.get(typeKey).add(memory.id);
  }

  // 构建记忆图谱
  async _buildMemoryGraph() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      this.memoryGraph.clear();
      
      // 构建记忆之间的关联
      for (let i = 0; i < memories.length; i++) {
        const memoryA = memories[i];
        if (!this.memoryGraph.has(memoryA.id)) {
          this.memoryGraph.set(memoryA.id, new Map());
        }
        
        for (let j = i + 1; j < memories.length; j++) {
          const memoryB = memories[j];
          if (!this.memoryGraph.has(memoryB.id)) {
            this.memoryGraph.set(memoryB.id, new Map());
          }
          
          const similarity = this._calculateMemorySimilarity(memoryA, memoryB);
          if (similarity > 0.3) {
            this.memoryGraph.get(memoryA.id).set(memoryB.id, similarity);
            this.memoryGraph.get(memoryB.id).set(memoryA.id, similarity);
          }
        }
      }
      
      console.log('记忆图谱构建完成，包含', this.memoryGraph.size, '个记忆节点');
    } catch (error) {
      console.error('构建记忆图谱失败:', error.message);
    }
  }

  // 更新记忆图谱
  async _updateMemoryGraph(newMemory) {
    try {
      const allMemories = await this.storageLayer.getMemories(1000);
      
      if (!this.memoryGraph.has(newMemory.id)) {
        this.memoryGraph.set(newMemory.id, new Map());
      }
      
      for (const existingMemory of allMemories) {
        if (existingMemory.id !== newMemory.id) {
          const similarity = this._calculateMemorySimilarity(newMemory, existingMemory);
          if (similarity > 0.3) {
            this.memoryGraph.get(newMemory.id).set(existingMemory.id, similarity);
            
            if (!this.memoryGraph.has(existingMemory.id)) {
              this.memoryGraph.set(existingMemory.id, new Map());
            }
            this.memoryGraph.get(existingMemory.id).set(newMemory.id, similarity);
          }
        }
      }
    } catch (error) {
      console.error('更新记忆图谱失败:', error.message);
    }
  }

  // 计算记忆相似度
  _calculateMemorySimilarity(memoryA, memoryB) {
    let similarity = 0;
    let totalFactors = 0;
    
    // 类型匹配
    if (memoryA.type === memoryB.type) {
      similarity += 0.3;
      totalFactors += 0.3;
    }
    
    // 标签匹配
    const tagsA = new Set(memoryA.tags.split(',').filter(tag => tag.trim()));
    const tagsB = new Set(memoryB.tags.split(',').filter(tag => tag.trim()));
    const commonTags = [...tagsA].filter(tag => tagsB.has(tag));
    if (tagsA.size + tagsB.size > 0) {
      const tagSimilarity = commonTags.length / (tagsA.size + tagsB.size - commonTags.length);
      similarity += tagSimilarity * 0.4;
      totalFactors += 0.4;
    }
    
    // 内容相似度（简单的词频匹配）
    const wordsA = new Set(memoryA.content.toLowerCase().split(/\s+/));
    const wordsB = new Set(memoryB.content.toLowerCase().split(/\s+/));
    const commonWords = [...wordsA].filter(word => wordsB.has(word));
    if (wordsA.size + wordsB.size > 0) {
      const contentSimilarity = commonWords.length / (wordsA.size + wordsB.size - commonWords.length);
      similarity += contentSimilarity * 0.3;
      totalFactors += 0.3;
    }
    
    return totalFactors > 0 ? similarity / totalFactors : 0;
  }

  // 整理记忆
  async organizeMemories() {
    try {
      console.log('开始整理记忆...');
      
      // 清理低质量记忆
      await this._cleanupLowQualityMemories();
      
      // 优化记忆索引
      await this._optimizeMemoryIndex();
      
      // 优化记忆图谱
      await this._optimizeMemoryGraph();
      
      // 备份记忆
      await this.backupMemories();
      
      console.log('记忆整理完成');
    } catch (error) {
      console.error('整理记忆失败:', error.message);
    }
  }

  // 清理低质量记忆
  async _cleanupLowQualityMemories() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      const lowQualityMemories = memories.filter(memory => {
        const score = this.memoryQualityScores.get(memory.id) || this._calculateMemoryQuality(memory);
        return score < 3;
      });
      
      for (const memory of lowQualityMemories) {
        await this.storageLayer.deleteMemory(memory.id);
        this.memoryIndex.forEach((memoryIds, key) => {
          memoryIds.delete(memory.id);
        });
        this.memoryGraph.delete(memory.id);
        this.memoryQualityScores.delete(memory.id);
      }
      
      if (lowQualityMemories.length > 0) {
        console.log(`清理了 ${lowQualityMemories.length} 个低质量记忆`);
      }
    } catch (error) {
      console.error('清理低质量记忆失败:', error.message);
    }
  }

  // 优化记忆索引
  async _optimizeMemoryIndex() {
    try {
      // 移除空索引
      const emptyKeys = [];
      this.memoryIndex.forEach((memoryIds, key) => {
        if (memoryIds.size === 0) {
          emptyKeys.push(key);
        }
      });
      
      emptyKeys.forEach(key => {
        this.memoryIndex.delete(key);
      });
      
      if (emptyKeys.length > 0) {
        console.log(`优化了 ${emptyKeys.length} 个空索引`);
      }
    } catch (error) {
      console.error('优化记忆索引失败:', error.message);
    }
  }

  // 优化记忆图谱
  async _optimizeMemoryGraph() {
    try {
      // 移除不存在的记忆节点
      const invalidNodes = [];
      this.memoryGraph.forEach((relatedMemories, memoryId) => {
        const invalidRelated = [];
        relatedMemories.forEach((score, relatedId) => {
          if (!this.memoryGraph.has(relatedId)) {
            invalidRelated.push(relatedId);
          }
        });
        
        invalidRelated.forEach(relatedId => {
          relatedMemories.delete(relatedId);
        });
        
        if (relatedMemories.size === 0) {
          invalidNodes.push(memoryId);
        }
      });
      
      invalidNodes.forEach(memoryId => {
        this.memoryGraph.delete(memoryId);
      });
      
      if (invalidNodes.length > 0) {
        console.log(`优化了 ${invalidNodes.length} 个无效记忆节点`);
      }
    } catch (error) {
      console.error('优化记忆图谱失败:', error.message);
    }
  }

  // 备份记忆
  async backupMemories() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      const backupFileName = `memory_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const backupPath = path.join(this.backupDir, backupFileName);
      
      fs.writeFileSync(backupPath, JSON.stringify(memories, null, 2), 'utf-8');
      console.log(`已备份 ${memories.length} 条记忆到 ${backupFileName}`);
      
      // 清理旧备份
      await this._cleanupOldBackups();
    } catch (error) {
      console.error('备份记忆失败:', error.message);
    }
  }

  // 清理旧备份
  async _cleanupOldBackups() {
    try {
      const backupFiles = fs.readdirSync(this.backupDir);
      const backups = backupFiles
        .filter(file => file.startsWith('memory_backup_') && file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          mtime: fs.statSync(path.join(this.backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      // 保留最近10个备份
      const backupsToKeep = 10;
      if (backups.length > backupsToKeep) {
        const backupsToDelete = backups.slice(backupsToKeep);
        backupsToDelete.forEach(backup => {
          fs.unlinkSync(backup.path);
        });
        console.log(`清理了 ${backupsToDelete.length} 个旧备份文件`);
      }
    } catch (error) {
      console.error('清理旧备份失败:', error.message);
    }
  }

  // 获取记忆统计
  async getMemoryStatistics() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      const stats = {
        totalMemories: memories.length,
        memoriesByType: {},
        memoriesByTag: {},
        averageQuality: 0,
        totalQuality: 0
      };
      
      memories.forEach(memory => {
        // 按类型统计
        stats.memoriesByType[memory.type] = (stats.memoriesByType[memory.type] || 0) + 1;
        
        // 按标签统计
        const tags = memory.tags.split(',').filter(tag => tag.trim());
        tags.forEach(tag => {
          stats.memoriesByTag[tag] = (stats.memoriesByTag[tag] || 0) + 1;
        });
        
        // 质量统计
        const quality = this.memoryQualityScores.get(memory.id) || this._calculateMemoryQuality(memory);
        stats.totalQuality += quality;
      });
      
      stats.averageQuality = stats.totalMemories > 0 ? stats.totalQuality / stats.totalMemories : 0;
      
      return stats;
    } catch (error) {
      console.error('获取记忆统计失败:', error.message);
      return null;
    }
  }

  // 导出记忆
  async exportMemories(format = 'json') {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      
      if (format === 'json') {
        return JSON.stringify(memories, null, 2);
      } else if (format === 'csv') {
        const headers = ['id', 'content', 'type', 'timestamp', 'importance', 'tags', 'metadata'];
        const rows = memories.map(memory => [
          memory.id,
          `"${memory.content.replace(/"/g, '""')}"`,
          memory.type,
          new Date(memory.timestamp).toISOString(),
          memory.importance,
          `"${memory.tags}"`,
          `"${memory.metadata.replace(/"/g, '""')}"`
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      }
      
      return null;
    } catch (error) {
      console.error('导出记忆失败:', error.message);
      return null;
    }
  }

  // 导入记忆
  async importMemories(data, format = 'json') {
    try {
      let memories;
      
      if (format === 'json') {
        memories = JSON.parse(data);
      } else if (format === 'csv') {
        const rows = data.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        memories = rows.slice(1).map(row => {
          const values = row.split(',');
          const memory = {};
          headers.forEach((header, index) => {
            memory[header] = values[index]?.replace(/^"|"$/g, '');
          });
          return memory;
        });
      } else {
        throw new Error('不支持的格式');
      }
      
      let importedCount = 0;
      for (const memory of memories) {
        const success = await this.storageLayer.addMemory(memory);
        if (success) {
          this._updateMemoryIndex(memory);
          await this._updateMemoryGraph(memory);
          importedCount++;
        }
      }
      
      return importedCount;
    } catch (error) {
      console.error('导入记忆失败:', error.message);
      return 0;
    }
  }

  // 清空记忆
  async clearMemories() {
    try {
      await this.storageLayer.clearMemories();
      this.memoryIndex.clear();
      this.memoryGraph.clear();
      this.memoryQualityScores.clear();
      console.log('记忆已清空');
      return true;
    } catch (error) {
      console.error('清空记忆失败:', error.message);
      return false;
    }
  }

  // 获取记忆质量报告
  async getMemoryQualityReport() {
    try {
      const memories = await this.storageLayer.getMemories(10000);
      const report = {
        totalMemories: memories.length,
        qualityDistribution: {
          low: 0,    // 0-3
          medium: 0, // 4-7
          high: 0    // 8+
        },
        averageQuality: 0,
        highestQualityMemories: [],
        lowestQualityMemories: []
      };
      
      let totalQuality = 0;
      const qualityScores = [];
      
      memories.forEach(memory => {
        const quality = this.memoryQualityScores.get(memory.id) || this._calculateMemoryQuality(memory);
        totalQuality += quality;
        qualityScores.push({ memory, quality });
        
        if (quality <= 3) {
          report.qualityDistribution.low++;
        } else if (quality <= 7) {
          report.qualityDistribution.medium++;
        } else {
          report.qualityDistribution.high++;
        }
      });
      
      report.averageQuality = memories.length > 0 ? totalQuality / memories.length : 0;
      
      // 按质量排序
      qualityScores.sort((a, b) => b.quality - a.quality);
      report.highestQualityMemories = qualityScores.slice(0, 10).map(item => ({
        id: item.memory.id,
        quality: item.quality,
        content: item.memory.content.substring(0, 100) + '...',
        type: item.memory.type
      }));
      
      qualityScores.sort((a, b) => a.quality - b.quality);
      report.lowestQualityMemories = qualityScores.slice(0, 10).map(item => ({
        id: item.memory.id,
        quality: item.quality,
        content: item.memory.content.substring(0, 100) + '...',
        type: item.memory.type
      }));
      
      return report;
    } catch (error) {
      console.error('获取记忆质量报告失败:', error.message);
      return null;
    }
  }

  // 智能记忆推荐
  async getMemoryRecommendations(context, limit = 5) {
    try {
      const allMemories = await this.storageLayer.getMemories(1000);
      const recommendations = [];
      
      for (const memory of allMemories) {
        const score = this._calculateRecommendationScore(memory, context);
        if (score > 0) {
          recommendations.push({ memory, score });
        }
      }
      
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.memory);
    } catch (error) {
      console.error('获取记忆推荐失败:', error.message);
      return [];
    }
  }

  // 计算推荐得分
  _calculateRecommendationScore(memory, context) {
    let score = 0;
    
    // 上下文关键词匹配
    if (context.keywords) {
      context.keywords.forEach(keyword => {
        if (memory.content.toLowerCase().includes(keyword.toLowerCase()) ||
            memory.tags.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
    }
    
    // 类型匹配
    if (context.type && memory.type === context.type) {
      score += 2;
    }
    
    // 重要性加成
    score += memory.importance * 0.5;
    
    // 质量加成
    const quality = this.memoryQualityScores.get(memory.id) || this._calculateMemoryQuality(memory);
    score += quality * 0.3;
    
    // 时间衰减
    const timeDiff = Date.now() - memory.timestamp;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const timeScore = Math.max(0, 1 - daysDiff / 30); // 30天内的记忆有时间加成
    score *= timeScore;
    
    return score;
  }
}

// 导出单例
const permanentMemorySystem = new PermanentMemorySystem();

module.exports = {
  PermanentMemorySystem,
  permanentMemorySystem
};