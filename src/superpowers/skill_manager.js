/**
 * 技能管理工具 - 管理用户的程序性知识
 * JavaScript Version
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { fuzzyMatch } = require('./fuzzy_match');
const { eventManager } = require('./events');

class Skill {
  /**
   * 技能数据结构
   * @param {string} name - 技能名称
   * @param {string} description - 技能描述
   * @param {string} content - 技能内容
   * @param {Array} tags - 技能标签
   * @param {number} createdAt - 创建时间
   * @param {number} updatedAt - 更新时间
   * @param {number} usageCount - 使用次数
   * @param {string} path - 技能路径
   * @param {Object} linkedFiles - 关联文件
   * @param {string} version - 技能版本
   * @param {string} license - 技能许可证
   * @param {Array} platforms - 支持的平台
   * @param {Object} prerequisites - 依赖项
   * @param {string} compatibility - 兼容性信息
   * @param {Object} metadata - 其他元数据
   */
  constructor(name, description, content, tags, createdAt, updatedAt, usageCount = 0, path = null, linkedFiles = null, version = null, license = null, platforms = null, prerequisites = null, compatibility = null, metadata = null) {
    this.name = name;
    this.description = description;
    this.content = content;
    this.tags = tags;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.usageCount = usageCount;
    this.path = path;
    this.linkedFiles = linkedFiles;
    this.version = version;
    this.license = license;
    this.platforms = platforms;
    this.prerequisites = prerequisites;
    this.compatibility = compatibility;
    this.metadata = metadata;
  }
}

class SkillManager {
  /**
   * 技能管理器
   * @param {string} skillsDir - 技能存储目录
   */
  constructor(skillsDir) {
    this.skillsDir = skillsDir;
    this._ensureDirectoryExists(skillsDir);
  }

  _ensureDirectoryExists(dir) {
    /**
     * 确保目录存在
     * @param {string} dir - 目录路径
     */
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  _parseFrontmatter(content) {
    /**
     * 解析 YAML 前置元数据
     * @param {string} content - 包含前置元数据的内容
     * @returns {Array} [前置元数据, 正文]
     */
    if (content.startsWith('---')) {
      const parts = content.split('---', 3);
      if (parts.length >= 3) {
        const frontmatterStr = parts[1].trim();
        const body = parts[2].trim();
        try {
          const frontmatter = yaml.parse(frontmatterStr);
          return [frontmatter || {}, body];
        } catch (error) {
          return [{}, content];
        }
      }
    }
    return [{}, content];
  }

  skillMatchesPlatform(frontmatter) {
    /**
     * 检查技能是否兼容当前平台
     * @param {Object} frontmatter - 技能的前置元数据
     * @returns {boolean} 是否兼容当前平台
     */
    const currentPlatform = process.platform;
    
    // 平台映射
    const platformMap = {
      'darwin': 'macos',
      'linux': 'linux',
      'win32': 'windows'
    };
    
    const currentPlatformName = platformMap[currentPlatform] || currentPlatform;
    
    // 检查技能是否指定了平台
    const platforms = frontmatter.platforms || [];
    if (!platforms || platforms.length === 0) {
      // 没有指定平台，默认兼容所有平台
      return true;
    }
    
    // 确保 platforms 是数组
    const platformList = Array.isArray(platforms) ? platforms : platforms.split(',').map(p => p.trim());
    
    // 检查当前平台是否在技能支持的平台列表中
    return platformList.includes(currentPlatformName);
  }

  listSkills() {
    /**
     * 列出所有技能
     * @returns {Array} 技能列表
     */
    const skills = [];
    
    // 扫描所有技能目录
    const scanDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory() && !file.name.startsWith('.')) {
          scanDirectory(fullPath);
        } else if (file.name === 'SKILL.md') {
          const skillDir = path.dirname(fullPath);
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const [frontmatter, body] = this._parseFrontmatter(content);
            
            // 检查平台兼容性
            if (!this.skillMatchesPlatform(frontmatter)) {
              continue;
            }
            
            const name = frontmatter.name || path.basename(skillDir);
            let description = frontmatter.description || '';
            if (!description) {
              // 从正文提取描述
              const lines = body.split('\n');
              for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                  description = trimmedLine.substring(0, 1024);
                  break;
                }
              }
            }
            
            let tags = frontmatter.tags || [];
            if (typeof tags === 'string') {
              tags = tags.split(',').map(tag => tag.trim());
            }
            
            // 构建技能数据
            const skillData = {
              name: name,
              description: description,
              tags: tags,
              path: path.relative(this.skillsDir, skillDir),
              usageCount: 0  // 后续可以从使用统计文件中读取
            };
            skills.push(skillData);
          } catch (error) {
            console.warn(`读取技能文件 ${fullPath} 失败: ${error.message}`);
          }
        }
      }
    };
    
    scanDirectory(this.skillsDir);
    return skills;
  }

  getSkill(name) {
    /**
     * 获取技能
     * @param {string} name - 技能名称
     * @returns {Skill|null} 技能对象，如果不存在则返回 null
     */
    let foundSkill = null;
    
    const searchDirectory = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory() && !file.name.startsWith('.')) {
          searchDirectory(fullPath);
        } else if (file.name === 'SKILL.md' && !foundSkill) {
          const skillDir = path.dirname(fullPath);
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const [frontmatter, body] = this._parseFrontmatter(content);
            
            // 检查平台兼容性
            if (!this.skillMatchesPlatform(frontmatter)) {
              continue;
            }
            
            const skillName = frontmatter.name || path.basename(skillDir);
            if (skillName === name) {
              // 读取技能数据
              const description = frontmatter.description || '';
              let tags = frontmatter.tags || [];
              if (typeof tags === 'string') {
                tags = tags.split(',').map(tag => tag.trim());
              }
              
              // 收集关联文件
              const linkedFiles = {};
              const subdirs = ['references', 'templates', 'assets', 'scripts'];
              for (const subdir of subdirs) {
                const subdirPath = path.join(skillDir, subdir);
                if (fs.existsSync(subdirPath)) {
                  const files = [];
                  const collectFiles = (dirPath, relativePath = '') => {
                    const dirFiles = fs.readdirSync(dirPath, { withFileTypes: true });
                    for (const dirFile of dirFiles) {
                      const fullFilePath = path.join(dirPath, dirFile.name);
                      const newRelativePath = path.join(relativePath, dirFile.name);
                      if (dirFile.isDirectory()) {
                        collectFiles(fullFilePath, newRelativePath);
                      } else {
                        files.push(newRelativePath);
                      }
                    }
                  };
                  collectFiles(subdirPath);
                  if (files.length > 0) {
                    linkedFiles[subdir] = files;
                  }
                }
              }
              
              // 计算创建和更新时间
              const stats = fs.statSync(fullPath);
              const createdAt = stats.birthtime.getTime() / 1000;
              const updatedAt = stats.mtime.getTime() / 1000;
              
              // 提取其他元数据
              const version = frontmatter.version || '1.0.0';
              const license = frontmatter.license;
              let platforms = frontmatter.platforms;
              if (typeof platforms === 'string') {
                platforms = platforms.split(',').map(p => p.trim());
              }
              const prerequisites = frontmatter.prerequisites;
              const compatibility = frontmatter.compatibility;
              const metadata = frontmatter.metadata;
              
              foundSkill = new Skill(
                skillName,
                description,
                content,
                tags,
                createdAt,
                updatedAt,
                0,
                path.relative(this.skillsDir, skillDir),
                linkedFiles,
                version,
                license,
                platforms,
                prerequisites,
                compatibility,
                metadata
              );
            }
          } catch (error) {
            console.warn(`读取技能 ${name} 失败: ${error.message}`);
          }
        }
      }
    };
    
    searchDirectory(this.skillsDir);
    return foundSkill;
  }

  createSkill(name, description, content, tags, version = '1.0.0', license = null, platforms = null, prerequisites = null, compatibility = null, metadata = null) {
    /**
     * 创建技能
     * @param {string} name - 技能名称
     * @param {string} description - 技能描述
     * @param {string} content - 技能内容
     * @param {Array} tags - 技能标签
     * @param {string} version - 技能版本
     * @param {string} license - 技能许可证
     * @param {Array} platforms - 支持的平台
     * @param {Object} prerequisites - 依赖项
     * @param {string} compatibility - 兼容性信息
     * @param {Object} metadata - 其他元数据
     * @returns {boolean} 是否创建成功
     */
    // 创建技能目录
    const skillDir = path.join(this.skillsDir, name);
    if (fs.existsSync(skillDir)) {
      console.warn(`技能 ${name} 已存在`);
      return false;
    }
    
    try {
      fs.mkdirSync(skillDir, { recursive: true });
      
      // 创建 SKILL.md 文件
      const skillMd = path.join(skillDir, 'SKILL.md');
      
      // 构建 YAML 前置元数据
      const frontmatter = {
        name: name,
        description: description,
        tags: tags,
        version: version
      };
      
      // 添加其他元数据
      if (license) frontmatter.license = license;
      if (platforms) frontmatter.platforms = platforms;
      if (prerequisites) frontmatter.prerequisites = prerequisites;
      if (compatibility) frontmatter.compatibility = compatibility;
      if (metadata) frontmatter.metadata = metadata;
      
      // 构建文件内容
      const frontmatterStr = yaml.stringify(frontmatter);
      const fileContent = `---\n${frontmatterStr}---\n\n${content}`;
      
      fs.writeFileSync(skillMd, fileContent, 'utf-8');
      
      // 创建默认目录结构
      const subdirs = ['references', 'templates', 'assets', 'scripts'];
      for (const subdir of subdirs) {
        fs.mkdirSync(path.join(skillDir, subdir), { recursive: true });
      }
      
      // 记录到DAG存储（模拟）
      try {
        // 这里可以实现与lossless_memory的集成
        console.log(`创建技能: ${name} - ${description}`);
      } catch (error) {
        console.warn(`记录技能创建到DAG存储失败: ${error.message}`);
      }
      
      // 技能创建完成后触发事件
      eventManager.trigger('skill_created', name, description);
      
      console.log(`技能 ${name} 创建成功`);
      return true;
    } catch (error) {
      console.error(`创建技能 ${name} 失败: ${error.message}`);
      // 清理失败的创建
      if (fs.existsSync(skillDir)) {
        fs.rmSync(skillDir, { recursive: true, force: true });
      }
      return false;
    }
  }

  updateSkill(name, description = null, content = null, tags = null, version = null, license = null, platforms = null, prerequisites = null, compatibility = null, metadata = null) {
    /**
     * 更新技能
     * @param {string} name - 技能名称
     * @param {string} description - 技能描述（可选）
     * @param {string} content - 技能内容（可选）
     * @param {Array} tags - 技能标签（可选）
     * @param {string} version - 技能版本（可选）
     * @param {string} license - 技能许可证（可选）
     * @param {Array} platforms - 支持的平台（可选）
     * @param {Object} prerequisites - 依赖项（可选）
     * @param {string} compatibility - 兼容性信息（可选）
     * @param {Object} metadata - 其他元数据（可选）
     * @returns {boolean} 是否更新成功
     */
    const skill = this.getSkill(name);
    if (!skill) {
      console.warn(`技能 ${name} 不存在`);
      return false;
    }
    
    // 找到技能文件
    const skillDir = path.join(this.skillsDir, skill.path);
    const skillMd = path.join(skillDir, 'SKILL.md');
    
    try {
      // 读取当前内容
      const currentContent = fs.readFileSync(skillMd, 'utf-8');
      const [frontmatter, body] = this._parseFrontmatter(currentContent);
      
      // 更新前置元数据
      if (description !== null) frontmatter.description = description;
      if (tags !== null) frontmatter.tags = tags;
      if (version !== null) frontmatter.version = version;
      if (license !== null) frontmatter.license = license;
      if (platforms !== null) frontmatter.platforms = platforms;
      if (prerequisites !== null) frontmatter.prerequisites = prerequisites;
      if (compatibility !== null) frontmatter.compatibility = compatibility;
      if (metadata !== null) frontmatter.metadata = metadata;
      
      // 更新内容
      const newBody = content !== null ? content : body;
      
      // 重新构建文件内容
      const frontmatterStr = yaml.stringify(frontmatter);
      const newContent = `---\n${frontmatterStr}---\n\n${newBody}`;
      
      fs.writeFileSync(skillMd, newContent, 'utf-8');
      
      // 记录到DAG存储（模拟）
      try {
        // 这里可以实现与lossless_memory的集成
        const updateInfo = [];
        if (description !== null) updateInfo.push('描述');
        if (content !== null) updateInfo.push('内容');
        if (tags !== null) updateInfo.push('标签');
        if (version !== null) updateInfo.push('版本');
        if (license !== null) updateInfo.push('许可证');
        if (platforms !== null) updateInfo.push('平台');
        if (prerequisites !== null) updateInfo.push('依赖项');
        if (compatibility !== null) updateInfo.push('兼容性');
        if (metadata !== null) updateInfo.push('元数据');
        
        const updateStr = updateInfo.join('、');
        console.log(`更新技能: ${name} - 更新了${updateStr}`);
      } catch (error) {
        console.warn(`记录技能更新到DAG存储失败: ${error.message}`);
      }
      
      // 技能更新完成后触发事件
      eventManager.trigger('skill_updated', name);
      
      console.log(`技能 ${name} 更新成功`);
      return true;
    } catch (error) {
      console.error(`更新技能 ${name} 失败: ${error.message}`);
      return false;
    }
  }

  deleteSkill(name) {
    /**
     * 删除技能
     * @param {string} name - 技能名称
     * @returns {boolean} 是否删除成功
     */
    const skill = this.getSkill(name);
    if (!skill) {
      console.warn(`技能 ${name} 不存在`);
      return false;
    }
    
    const skillDir = path.join(this.skillsDir, skill.path);
    if (!fs.existsSync(skillDir)) {
      console.warn(`技能目录 ${skillDir} 不存在`);
      return false;
    }
    
    try {
      // 记录到DAG存储（模拟）
      try {
        // 这里可以实现与lossless_memory的集成
        console.log(`删除技能: ${name}`);
      } catch (error) {
        console.warn(`记录技能删除到DAG存储失败: ${error.message}`);
      }
      
      fs.rmSync(skillDir, { recursive: true, force: true });
      
      // 技能删除完成后触发事件
      eventManager.trigger('skill_deleted', name);
      
      console.log(`技能 ${name} 删除成功`);
      return true;
    } catch (error) {
      console.error(`删除技能 ${name} 失败: ${error.message}`);
      return false;
    }
  }

  incrementUsage(name) {
    /**
     * 增加技能使用次数
     * @param {string} name - 技能名称
     * @returns {boolean} 是否更新成功
     */
    // 这里可以实现使用次数的存储和更新
    // 暂时返回 true
    return true;
  }

  searchSkills(query, maxResults = 5) {
    /**
     * 搜索技能
     * @param {string} query - 搜索查询
     * @param {number} maxResults - 最大结果数
     * @returns {Array} 匹配的技能列表
     */
    const skills = this.listSkills();
    if (!skills || skills.length === 0) {
      return [];
    }

    // 计算相似度
    const matches = [];
    for (const skill of skills) {
      try {
        // 确保技能数据包含必要的字段
        if (skill.name && skill.description) {
          // 计算与技能名称、描述和标签的相似度
          const nameScore = fuzzyMatch(query, skill.name);
          const descScore = fuzzyMatch(query, skill.description);
          const tagScore = skill.tags && Array.isArray(skill.tags) 
            ? Math.max(...skill.tags.map(tag => fuzzyMatch(query, tag)), 0)
            : 0;
          // 综合评分
          const score = Math.max(nameScore, descScore, tagScore);
          if (score > 0.5) { // 阈值
            matches.push({ score, skill });
          }
        }
      } catch (error) {
        console.warn(`处理技能 ${skill.name || 'unknown'} 失败: ${error.message}`);
      }
    }

    // 按相似度排序
    matches.sort((a, b) => b.score - a.score);
    // 返回前 maxResults 个结果
    return matches.slice(0, maxResults).map(match => match.skill);
  }

  getSkillFile(name, filePath) {
    /**
     * 获取技能的关联文件内容
     * @param {string} name - 技能名称
     * @param {string} filePath - 关联文件路径（相对于技能目录）
     * @returns {string|null} 文件内容，如果文件不存在则返回 null
     */
    const skill = this.getSkill(name);
    if (!skill) {
      console.warn(`技能 ${name} 不存在`);
      return null;
    }
    
    // 构建文件路径
    const skillDir = path.join(this.skillsDir, skill.path);
    const targetFile = path.join(skillDir, filePath);
    
    // 检查文件是否存在
    if (!fs.existsSync(targetFile)) {
      console.warn(`文件 ${filePath} 不存在`);
      return null;
    }
    
    // 读取文件内容
    try {
      const content = fs.readFileSync(targetFile, 'utf-8');
      return content;
    } catch (error) {
      console.error(`读取文件 ${filePath} 失败: ${error.message}`);
      return null;
    }
  }

  listSkillFiles(name) {
    /**
     * 列出技能的所有关联文件
     * @param {string} name - 技能名称
     * @returns {Object|null} 关联文件字典，按目录分类
     */
    const skill = this.getSkill(name);
    if (!skill) {
      console.warn(`技能 ${name} 不存在`);
      return null;
    }
    
    return skill.linkedFiles;
  }
}

function skillManage(name, action, kwargs = {}) {
  /**
   * 管理技能
   * @param {string} name - 技能名称
   * @param {string} action - 操作类型 (create, edit, delete, list, get, search)
   * @param {Object} kwargs - 其他参数，根据操作类型不同而不同
   * @returns {string} JSON 格式的结果
   */
  try {
    // 获取技能目录
    const superpowersHome = path.join(process.cwd(), 'superpowers', 'storage');
    const skillsDir = path.join(superpowersHome, 'skills');
    const skillManager = new SkillManager(skillsDir);

    switch (action) {
      case 'create':
        const description = kwargs.description || '';
        const content = kwargs.content || '';
        const tags = kwargs.tags || [];
        const success = skillManager.createSkill(name, description, content, tags);
        return JSON.stringify({ success, message: success ? '技能创建成功' : '技能创建失败' });

      case 'edit':
        const editDescription = kwargs.description;
        const editContent = kwargs.content;
        const editTags = kwargs.tags;
        const editSuccess = skillManager.updateSkill(name, editDescription, editContent, editTags);
        return JSON.stringify({ success: editSuccess, message: editSuccess ? '技能更新成功' : '技能更新失败' });

      case 'delete':
        const deleteSuccess = skillManager.deleteSkill(name);
        return JSON.stringify({ success: deleteSuccess, message: deleteSuccess ? '技能删除成功' : '技能删除失败' });

      case 'list':
        const skills = skillManager.listSkills();
        return JSON.stringify({ success: true, skills });

      case 'get':
        const skill = skillManager.getSkill(name);
        if (skill) {
          return JSON.stringify({ success: true, skill: {
            name: skill.name,
            description: skill.description,
            content: skill.content,
            tags: skill.tags,
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
            usageCount: skill.usageCount,
            path: skill.path,
            linkedFiles: skill.linkedFiles,
            version: skill.version,
            license: skill.license,
            platforms: skill.platforms,
            prerequisites: skill.prerequisites,
            compatibility: skill.compatibility,
            metadata: skill.metadata
          }});
        } else {
          return JSON.stringify({ success: false, message: '技能不存在' });
        }

      case 'search':
        const query = kwargs.query || '';
        const maxResults = kwargs.maxResults || 5;
        const results = skillManager.searchSkills(query, maxResults);
        return JSON.stringify({ success: true, results });

      case 'get_file':
        const filePath = kwargs.filePath || '';
        const fileContent = skillManager.getSkillFile(name, filePath);
        if (fileContent) {
          return JSON.stringify({ success: true, content: fileContent });
        } else {
          return JSON.stringify({ success: false, message: '文件不存在或读取失败' });
        }

      case 'list_files':
        const files = skillManager.listSkillFiles(name);
        if (files) {
          return JSON.stringify({ success: true, files });
        } else {
          return JSON.stringify({ success: false, message: '技能不存在或没有关联文件' });
        }

      default:
        return JSON.stringify({ error: `未知操作: ${action}` });
    }
  } catch (error) {
    console.error(`技能管理失败: ${error.message}`);
    return JSON.stringify({ error: `技能管理失败: ${error.message}` });
  }
}

module.exports = {
  SkillManager,
  skillManage
};
