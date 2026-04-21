/**
 * 技能扫描器模块
 * 负责技能的自动探测、扫描和索引
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const chokidar = require('chokidar');

class SkillScanner {
  /**
   * 技能扫描器
   * @param {string} skillsDir - 技能存储目录
   */
  constructor(skillsDir) {
    this.skillsDir = skillsDir;
    this.skillIndex = new Map();
    this.categoryIndex = new Map();
    this.tagIndex = new Map();
    this.lastScanTime = 0;
    this.watcher = null;
    this.cache = new Map();
    this.cacheExpiry = 3600000; // 1小时缓存
  }

  /**
   * 扫描技能目录
   * @param {boolean} incremental - 是否增量扫描
   * @returns {Array} 发现的技能列表
   */
  scanSkills(incremental = false) {
    console.log(`开始${incremental ? '增量' : '完整'}扫描技能目录...`);
    
    const skills = [];
    const scanDirectory = (dir, category = 'uncategorized') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory() && !file.name.startsWith('.')) {
            // 检查是否是技能目录
            const skillMdPath = path.join(fullPath, 'SKILL.md');
            if (fs.existsSync(skillMdPath)) {
              // 是技能目录
              const skill = this._parseSkill(skillMdPath, category);
              if (skill) {
                skills.push(skill);
                this._updateIndexes(skill);
                // 更新缓存
                this._updateCache(skill);
              }
            } else {
              // 可能是分类目录
              const subCategory = file.name;
              scanDirectory(fullPath, subCategory);
            }
          } else if (file.name === 'SKILL.md') {
            // 根目录下的技能文件
            const skill = this._parseSkill(fullPath, category);
            if (skill) {
              skills.push(skill);
              this._updateIndexes(skill);
              // 更新缓存
              this._updateCache(skill);
            }
          }
        }
      } catch (error) {
        console.error(`扫描目录 ${dir} 失败: ${error.message}`);
      }
    };

    if (incremental) {
      // 增量扫描逻辑
      const changedFiles = this._getChangedFiles();
      for (const file of changedFiles) {
        if (file.endsWith('SKILL.md')) {
          const category = this._extractCategory(file);
          const skill = this._parseSkill(file, category);
          if (skill) {
            skills.push(skill);
            this._updateIndexes(skill);
            this._updateCache(skill);
          }
        }
      }
    } else {
      // 完整扫描
      scanDirectory(this.skillsDir);
    }
    
    this.lastScanTime = Date.now();
    
    console.log(`技能扫描完成，发现 ${skills.length} 个技能`);
    return skills;
  }

  /**
   * 开始实时监控
   * @param {Function} onChange - 变更回调函数
   */
  startWatching(onChange) {
    if (this.watcher) {
      console.warn('监控已经启动');
      return;
    }

    console.log('开始实时监控技能目录...');
    
    this.watcher = chokidar.watch(this.skillsDir, {
      ignored: /(^|\/\.)(node_modules|\.git|templates)/,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    });

    this.watcher
      .on('add', (path) => {
        if (path.endsWith('SKILL.md')) {
          console.log(`新增技能文件: ${path}`);
          const category = this._extractCategory(path);
          const skill = this._parseSkill(path, category);
          if (skill) {
            this._updateIndexes(skill);
            this._updateCache(skill);
            if (onChange) {
              onChange('add', skill);
            }
          }
        }
      })
      .on('change', (path) => {
        if (path.endsWith('SKILL.md')) {
          console.log(`修改技能文件: ${path}`);
          const category = this._extractCategory(path);
          const skill = this._parseSkill(path, category);
          if (skill) {
            this._updateIndexes(skill);
            this._updateCache(skill);
            if (onChange) {
              onChange('change', skill);
            }
          }
        }
      })
      .on('unlink', (path) => {
        if (path.endsWith('SKILL.md')) {
          console.log(`删除技能文件: ${path}`);
          const skillName = path.basename(path.dirname(path));
          this._removeFromIndexes(skillName);
          this._removeFromCache(skillName);
          if (onChange) {
            onChange('remove', { name: skillName, path: path });
          }
        }
      })
      .on('error', (error) => {
        console.error(`监控错误: ${error}`);
      });

    console.log('技能目录监控已启动');
  }

  /**
   * 停止实时监控
   */
  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('技能目录监控已停止');
    }
  }

  /**
   * 获取缓存的技能
   * @param {string} skillName - 技能名称
   * @returns {Object} 技能对象
   */
  getCachedSkill(skillName) {
    const cached = this.cache.get(skillName);
    if (cached) {
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      } else {
        // 缓存过期，删除
        this.cache.delete(skillName);
      }
    }
    return null;
  }

  /**
   * 清理过期缓存
   */
  cleanupCache() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.cacheExpiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`清理了 ${cleaned} 个过期缓存`);
    }
  }

  /**
   * 解析技能文件
   * @param {string} skillMdPath - 技能文件路径
   * @param {string} category - 技能分类
   * @returns {Object} 技能对象
   */
  _parseSkill(skillMdPath, category) {
    try {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const [frontmatter, body] = this._parseFrontmatter(content);
      
      const skillName = frontmatter.name || path.basename(path.dirname(skillMdPath));
      const skill = {
        name: skillName,
        description: frontmatter.description || '',
        version: frontmatter.version || '1.0.0',
        author: frontmatter.author || 'Lossless Superpower',
        tags: frontmatter.tags || [],
        category: category,
        triggerPatterns: frontmatter.trigger_patterns || [],
        parameters: frontmatter.parameters || {},
        execution: frontmatter.execution || {},
        content: body,
        path: path.relative(this.skillsDir, path.dirname(skillMdPath)),
        filePath: skillMdPath,
        lastModified: fs.statSync(skillMdPath).mtime.getTime()
      };
      
      return skill;
    } catch (error) {
      console.error(`解析技能文件 ${skillMdPath} 失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 解析YAML前置元数据
   * @param {string} content - 包含前置元数据的内容
   * @returns {Array} [前置元数据, 正文]
   */
  _parseFrontmatter(content) {
    if (content.startsWith('---')) {
      const parts = content.split('---', 3);
      if (parts.length >= 3) {
        const frontmatterStr = parts[1].trim();
        const body = parts[2].trim();
        try {
          const frontmatter = yaml.parse(frontmatterStr);
          return [frontmatter || {}, body];
        } catch (error) {
          console.error(`解析前置元数据失败: ${error.message}`);
          return [{}, content];
        }
      }
    }
    return [{}, content];
  }

  /**
   * 更新技能索引
   * @param {Object} skill - 技能对象
   */
  _updateIndexes(skill) {
    // 更新技能索引
    this.skillIndex.set(skill.name, skill);
    
    // 更新分类索引
    if (!this.categoryIndex.has(skill.category)) {
      this.categoryIndex.set(skill.category, []);
    }
    this.categoryIndex.get(skill.category).push(skill.name);
    
    // 更新标签索引
    for (const tag of skill.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, []);
      }
      this.tagIndex.get(tag).push(skill.name);
    }
  }

  /**
   * 获取所有技能
   * @returns {Array} 技能列表
   */
  getAllSkills() {
    return Array.from(this.skillIndex.values());
  }

  /**
   * 根据名称获取技能
   * @param {string} name - 技能名称
   * @returns {Object} 技能对象
   */
  getSkill(name) {
    return this.skillIndex.get(name);
  }

  /**
   * 根据分类获取技能
   * @param {string} category - 分类名称
   * @returns {Array} 技能列表
   */
  getSkillsByCategory(category) {
    const skillNames = this.categoryIndex.get(category) || [];
    return skillNames.map(name => this.skillIndex.get(name)).filter(Boolean);
  }

  /**
   * 根据标签获取技能
   * @param {string} tag - 标签名称
   * @returns {Array} 技能列表
   */
  getSkillsByTag(tag) {
    const skillNames = this.tagIndex.get(tag) || [];
    return skillNames.map(name => this.skillIndex.get(name)).filter(Boolean);
  }

  /**
   * 搜索技能
   * @param {string} query - 搜索查询
   * @returns {Array} 匹配的技能列表
   */
  searchSkills(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const skill of this.skillIndex.values()) {
      const score = this._calculateSearchScore(skill, lowerQuery);
      if (score > 0) {
        results.push({ skill, score });
      }
    }
    
    results.sort((a, b) => b.score - a.score);
    return results.map(item => item.skill);
  }

  /**
   * 计算搜索得分
   * @param {Object} skill - 技能对象
   * @param {string} query - 搜索查询
   * @returns {number} 得分
   */
  _calculateSearchScore(skill, query) {
    let score = 0;
    
    // 名称匹配
    if (skill.name.toLowerCase().includes(query)) {
      score += 3;
    }
    
    // 描述匹配
    if (skill.description.toLowerCase().includes(query)) {
      score += 2;
    }
    
    // 标签匹配
    for (const tag of skill.tags) {
      if (tag.toLowerCase().includes(query)) {
        score += 1;
      }
    }
    
    // 内容匹配
    if (skill.content.toLowerCase().includes(query)) {
      score += 0.5;
    }
    
    return score;
  }

  /**
   * 检查技能是否需要更新
   * @param {string} skillName - 技能名称
   * @returns {boolean} 是否需要更新
   */
  needsUpdate(skillName) {
    const skill = this.skillIndex.get(skillName);
    if (!skill) return true;
    
    try {
      const currentMtime = fs.statSync(skill.filePath).mtime.getTime();
      return currentMtime > skill.lastModified;
    } catch (error) {
      return true;
    }
  }

  /**
   * 重新加载技能
   * @param {string} skillName - 技能名称
   * @returns {Object} 更新后的技能对象
   */
  reloadSkill(skillName) {
    const skill = this.skillIndex.get(skillName);
    if (!skill) return null;
    
    const updatedSkill = this._parseSkill(skill.filePath, skill.category);
    if (updatedSkill) {
      this._updateIndexes(updatedSkill);
      return updatedSkill;
    }
    
    return null;
  }

  /**
   * 清理索引
   */
  clearIndexes() {
    this.skillIndex.clear();
    this.categoryIndex.clear();
    this.tagIndex.clear();
  }

  /**
   * 获取索引统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      totalSkills: this.skillIndex.size,
      categories: this.categoryIndex.size,
      tags: this.tagIndex.size,
      lastScanTime: this.lastScanTime
    };
  }

  /**
   * 导出技能索引
   * @returns {Object} 技能索引数据
   */
  exportIndex() {
    return {
      skills: Array.from(this.skillIndex.values()),
      categories: Object.fromEntries(this.categoryIndex),
      tags: Object.fromEntries(this.tagIndex),
      stats: this.getStats()
    };
  }

  /**
   * 导入技能索引
   * @param {Object} indexData - 索引数据
   */
  importIndex(indexData) {
    if (indexData.skills) {
      for (const skill of indexData.skills) {
        this.skillIndex.set(skill.name, skill);
        // 更新缓存
        this._updateCache(skill);
      }
    }
    
    if (indexData.categories) {
      this.categoryIndex = new Map(Object.entries(indexData.categories));
    }
    
    if (indexData.tags) {
      this.tagIndex = new Map(Object.entries(indexData.tags));
    }
  }

  /**
   * 从索引中移除技能
   * @param {string} skillName - 技能名称
   * @private
   */
  _removeFromIndexes(skillName) {
    const skill = this.skillIndex.get(skillName);
    if (!skill) return;

    // 从技能索引中移除
    this.skillIndex.delete(skillName);

    // 从分类索引中移除
    if (this.categoryIndex.has(skill.category)) {
      this.categoryIndex.get(skill.category).delete(skillName);
      if (this.categoryIndex.get(skill.category).size === 0) {
        this.categoryIndex.delete(skill.category);
      }
    }

    // 从标签索引中移除
    for (const tag of skill.tags) {
      if (this.tagIndex.has(tag)) {
        this.tagIndex.get(tag).delete(skillName);
        if (this.tagIndex.get(tag).size === 0) {
          this.tagIndex.delete(tag);
        }
      }
    }
  }

  /**
   * 更新缓存
   * @param {Object} skill - 技能对象
   * @private
   */
  _updateCache(skill) {
    this.cache.set(skill.name, {
      data: skill,
      timestamp: Date.now()
    });
  }

  /**
   * 从缓存中移除
   * @param {string} skillName - 技能名称
   * @private
   */
  _removeFromCache(skillName) {
    this.cache.delete(skillName);
  }

  /**
   * 提取分类
   * @param {string} filePath - 文件路径
   * @returns {string} 分类名称
   * @private
   */
  _extractCategory(filePath) {
    const relativePath = path.relative(this.skillsDir, path.dirname(filePath));
    const parts = relativePath.split(path.sep);
    return parts.length > 1 ? parts[0] : 'uncategorized';
  }

  /**
   * 获取变更文件
   * @returns {Array} 变更文件列表
   * @private
   */
  _getChangedFiles() {
    // 简单实现，实际项目中可以使用文件系统监控或版本控制
    const changedFiles = [];
    const scanDirectory = (dir) => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory() && !file.name.startsWith('.')) {
            scanDirectory(fullPath);
          } else if (file.name === 'SKILL.md') {
            const stats = fs.statSync(fullPath);
            if (stats.mtime.getTime() > this.lastScanTime) {
              changedFiles.push(fullPath);
            }
          }
        }
      } catch (error) {
        console.error(`扫描变更文件失败: ${error.message}`);
      }
    };

    scanDirectory(this.skillsDir);
    return changedFiles;
  }

  /**
   * 获取扫描统计信息
   * @returns {Object} 统计信息
   */
  getScanStats() {
    return {
      totalSkills: this.skillIndex.size,
      totalCategories: this.categoryIndex.size,
      totalTags: this.tagIndex.size,
      cacheSize: this.cache.size,
      lastScanTime: this.lastScanTime,
      watching: !!this.watcher
    };
  }
}

// 导出模块
module.exports = {
  SkillScanner
};
