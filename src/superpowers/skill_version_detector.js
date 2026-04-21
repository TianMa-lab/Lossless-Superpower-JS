/**
 * 技能版本检测器
 * 实现Hermes风格的版本差异检测和增量更新
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SkillVersionDetector {
  /**
   * 版本检测器
   * @param {Object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = {
      versionDir: config.versionDir || './skill_versions',
      enableAutoTrack: config.enableAutoTrack !== false,
      hashAlgorithm: config.hashAlgorithm || 'sha256',
      ...config
    };

    this.versions = new Map();
    this.upstreamRegistry = new Map();
    this.loadVersions();
  }

  /**
   * 检查技能更新
   * @param {string} skillName - 技能名称
   * @returns {Object} 更新信息
   */
  checkForUpdates(skillName) {
    const currentVersion = this.versions.get(skillName);
    if (!currentVersion) {
      return { hasUpdate: false, error: 'Skill not tracked' };
    }

    const upstream = this.upstreamRegistry.get(skillName);
    if (!upstream) {
      return { hasUpdate: false, error: 'No upstream registered' };
    }

    try {
      // 检查远程版本
      const remoteVersion = this._fetchRemoteVersion(upstream);
      if (!remoteVersion) {
        return { hasUpdate: false, error: 'Failed to fetch remote version' };
      }

      const hasUpdate = this._compareVersions(currentVersion, remoteVersion);
      return {
        hasUpdate,
        currentVersion: currentVersion.version,
        remoteVersion: remoteVersion.version,
        currentHash: currentVersion.contentHash,
        remoteHash: remoteVersion.contentHash
      };
    } catch (error) {
      return { hasUpdate: false, error: error.message };
    }
  }

  /**
   * 获取版本差异
   * @param {string} skillName - 技能名称
   * @returns {Object} 差异信息
   */
  getVersionDiff(skillName) {
    const currentVersion = this.versions.get(skillName);
    if (!currentVersion) {
      return null;
    }

    const upstream = this.upstreamRegistry.get(skillName);
    if (!upstream) {
      return null;
    }

    try {
      const remoteContent = this._fetchRemoteContent(upstream);
      if (!remoteContent) {
        return null;
      }

      const remoteHash = this._computeHash(remoteContent);
      const currentHash = currentVersion.contentHash;

      if (remoteHash === currentHash) {
        return { hasDiff: false };
      }

      // 计算差异统计
      const diff = {
        hasDiff: true,
        currentVersion: currentVersion.version,
        remoteVersion: upstream.version,
        changes: this._analyzeDiff(currentVersion.content, remoteContent)
      };

      return diff;
    } catch (error) {
      console.error(`获取版本差异失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 应用更新
   * @param {string} skillName - 技能名称
   * @param {string} newContent - 新内容
   * @param {Object} options - 选项
   * @returns {Object} 更新结果
   */
  applyUpdate(skillName, newContent, options = {}) {
    const oldVersion = this.versions.get(skillName);

    try {
      const newHash = this._computeHash(newContent);
      const newVersionNum = this._incrementVersion(
        oldVersion ? oldVersion.version : '1.0.0'
      );

      const updateRecord = {
        skillName,
        previousVersion: oldVersion ? oldVersion.version : null,
        previousHash: oldVersion ? oldVersion.contentHash : null,
        newVersion: newVersionNum,
        newHash,
        timestamp: Date.now(),
        source: options.source || 'manual',
        changelog: options.changelog || []
      };

      // 保存旧版本
      if (oldVersion) {
        this._saveVersionSnapshot(skillName, oldVersion);
      }

      // 更新当前版本
      this.versions.set(skillName, {
        version: newVersionNum,
        contentHash: newHash,
        content: newContent,
        updatedAt: Date.now(),
        source: options.source || 'manual'
      });

      this.saveVersions();

      // 如果设置了自动同步选项，同步到上游
      if (options.syncToUpstream && upstream) {
        this._syncToUpstream(skillName, newContent, upstream);
      }

      return {
        success: true,
        ...updateRecord
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 同步到上游
   * @param {string} skillName - 技能名称
   * @param {string} content - 内容
   * @param {Object} upstream - 上游配置
   * @private
   */
  _syncToUpstream(skillName, content, upstream) {
    // 这里应该实现到实际的上游注册表的同步逻辑
    console.log(`同步技能 ${skillName} 到上游: ${upstream.url}`);
  }

  /**
   * 注册技能上游
   * @param {string} skillName - 技能名称
   * @param {Object} upstreamConfig - 上游配置
   */
  registerUpstream(skillName, upstreamConfig) {
    this.upstreamRegistry.set(skillName, {
      ...upstreamConfig,
      registeredAt: Date.now()
    });
    this.saveUpstreamRegistry();
  }

  /**
   * 获取版本历史
   * @param {string} skillName - 技能名称
   * @returns {Array} 版本历史
   */
  getVersionHistory(skillName) {
    const versionDir = path.join(this.config.versionDir, skillName);
    if (!fs.existsSync(versionDir)) {
      return [];
    }

    try {
      const files = fs.readdirSync(versionDir)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();

      return files.map(file => {
        const content = fs.readFileSync(path.join(versionDir, file), 'utf-8');
        return JSON.parse(content);
      });
    } catch (error) {
      console.error(`读取版本历史失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 回滚到指定版本
   * @param {string} skillName - 技能名称
   * @param {string} versionId - 版本ID
   * @returns {Object} 回滚结果
   */
  rollbackToVersion(skillName, versionId) {
    const versionHistory = this.getVersionHistory(skillName);
    const targetVersion = versionHistory.find(v => v.version === versionId);

    if (!targetVersion) {
      return { success: false, error: 'Version not found' };
    }

    return this.applyUpdate(skillName, targetVersion.content, {
      source: `rollback_to_${versionId}`,
      changelog: [`回滚到版本 ${versionId}`]
    });
  }

  /**
   * 追踪技能版本
   * @param {string} skillName - 技能名称
   * @param {string} content - 技能内容
   * @param {Object} metadata - 元数据
   */
  trackSkill(skillName, content, metadata = {}) {
    const hash = this._computeHash(content);
    const existing = this.versions.get(skillName);

    if (existing && existing.contentHash === hash) {
      return { tracked: false, reason: 'no_changes' };
    }

    const version = existing
      ? this._incrementVersion(existing.version)
      : metadata.initialVersion || '1.0.0';

    this.versions.set(skillName, {
      skillName,
      version,
      contentHash: hash,
      content,
      createdAt: existing ? existing.createdAt : Date.now(),
      updatedAt: Date.now(),
      source: metadata.source || 'local'
    });

    this.saveVersions();
    return { tracked: true, version };
  }

  /**
   * 获取技能版本信息
   * @param {string} skillName - 技能名称
   * @returns {Object|null} 版本信息
   */
  getVersionInfo(skillName) {
    return this.versions.get(skillName) || null;
  }

  /**
   * 获取所有追踪的技能
   * @returns {Array} 技能列表
   */
  getTrackedSkills() {
    return Array.from(this.versions.keys());
  }

  /**
   * 计算内容哈希
   * @param {string} content - 内容
   * @returns {string} 哈希值
   * @private
   */
  _computeHash(content) {
    return crypto
      .createHash(this.config.hashAlgorithm)
      .update(content)
      .digest('hex');
  }

  /**
   * 递增版本号
   * @param {string} version - 当前版本
   * @returns {string} 新版本
   * @private
   */
  _incrementVersion(version) {
    const parts = version.split('.');
    if (parts.length !== 3) {
      return '1.0.0';
    }

    const [major, minor, patch] = parts.map(p => parseInt(p, 10));
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * 比较版本
   * @param {Object} current - 当前版本
   * @param {Object} remote - 远程版本
   * @returns {boolean} 是否有更新
   * @private
   */
  _compareVersions(current, remote) {
    if (current.version === remote.version) {
      return current.contentHash !== remote.contentHash;
    }

    const currentParts = current.version.split('.').map(p => parseInt(p, 10));
    const remoteParts = remote.version.split('.').map(p => parseInt(p, 10));

    for (let i = 0; i < 3; i++) {
      if (remoteParts[i] > currentParts[i]) {
        return true;
      } else if (remoteParts[i] < currentParts[i]) {
        return false;
      }
    }

    return false;
  }

  /**
   * 分析差异
   * @param {string} oldContent - 旧内容
   * @param {string} newContent - 新内容
   * @returns {Object} 差异分析
   * @private
   */
  _analyzeDiff(oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');

    const changes = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0
    };

    const maxLines = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine === undefined) {
        changes.added++;
      } else if (newLine === undefined) {
        changes.removed++;
      } else if (oldLine !== newLine) {
        changes.modified++;
      } else {
        changes.unchanged++;
      }
    }

    return changes;
  }

  /**
   * 获取远程版本
   * @param {Object} upstream - 上游配置
   * @returns {Object|null} 远程版本信息
   * @private
   */
  _fetchRemoteVersion(upstream) {
    // 模拟远程版本获取
    // 实际实现应该调用远程API
    return {
      version: upstream.version || '1.0.0',
      contentHash: upstream.contentHash || null
    };
  }

  /**
   * 获取远程内容
   * @param {Object} upstream - 上游配置
   * @returns {string|null} 远程内容
   * @private
   */
  _fetchRemoteContent(upstream) {
    // 模拟远程内容获取
    // 实际实现应该调用远程API
    return upstream.content || null;
  }

  /**
   * 保存版本快照
   * @param {string} skillName - 技能名称
   * @param {Object} version - 版本信息
   * @private
   */
  _saveVersionSnapshot(skillName, version) {
    const versionDir = path.join(this.config.versionDir, skillName);
    fs.mkdirSync(versionDir, { recursive: true });

    const snapshot = {
      version: version.version,
      contentHash: version.contentHash,
      content: version.content,
      timestamp: version.updatedAt,
      source: version.source
    };

    const filePath = path.join(
      versionDir,
      `${version.version}_${version.contentHash.substring(0, 8)}.json`
    );
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
  }

  /**
   * 加载版本数据
   * @private
   */
  loadVersions() {
    try {
      if (!fs.existsSync(this.config.versionDir)) {
        fs.mkdirSync(this.config.versionDir, { recursive: true });
        return;
      }

      const versionsFile = path.join(this.config.versionDir, 'versions.json');
      if (fs.existsSync(versionsFile)) {
        const data = JSON.parse(fs.readFileSync(versionsFile, 'utf-8'));
        this.versions = new Map(Object.entries(data.versions || {}));
      }

      const registryFile = path.join(this.config.versionDir, 'upstream_registry.json');
      if (fs.existsSync(registryFile)) {
        const data = JSON.parse(fs.readFileSync(registryFile, 'utf-8'));
        this.upstreamRegistry = new Map(Object.entries(data.registry || {}));
      }
    } catch (error) {
      console.error(`加载版本数据失败: ${error.message}`);
    }
  }

  /**
   * 保存版本数据
   * @private
   */
  saveVersions() {
    try {
      fs.mkdirSync(this.config.versionDir, { recursive: true });

      const versionsFile = path.join(this.config.versionDir, 'versions.json');
      const data = {
        versions: Object.fromEntries(this.versions),
        savedAt: Date.now()
      };
      fs.writeFileSync(versionsFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`保存版本数据失败: ${error.message}`);
    }
  }

  /**
   * 保存上游注册表
   * @private
   */
  saveUpstreamRegistry() {
    try {
      fs.mkdirSync(this.config.versionDir, { recursive: true });

      const registryFile = path.join(this.config.versionDir, 'upstream_registry.json');
      const data = {
        registry: Object.fromEntries(this.upstreamRegistry),
        savedAt: Date.now()
      };
      fs.writeFileSync(registryFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`保存上游注册表失败: ${error.message}`);
    }
  }
}

module.exports = { SkillVersionDetector };