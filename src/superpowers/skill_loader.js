/**
 * 技能渐进式加载器
 * 实现Hermes风格的Level 0/1/2分层加载
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

class SkillLoader {
  /**
   * 技能加载器
   * @param {string} skillsDir - 技能存储目录
   */
  constructor(skillsDir) {
    this.skillsDir = skillsDir;
    this.cache = new Map();
    this.metadataCache = new Map();
  }

  /**
   * 加载技能元数据（Level 0）
   * 仅加载元数据，节省token
   * @param {string} skillName - 技能名称
   * @returns {Object} 技能元数据
   */
  loadSkillMetadata(skillName) {
    if (this.metadataCache.has(skillName)) {
      return this.metadataCache.get(skillName);
    }

    const skillPath = this._findSkillPath(skillName);
    if (!skillPath) {
      return null;
    }

    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const frontmatter = this._parseFrontmatter(content);
      
      const metadata = {
        name: frontmatter.name || skillName,
        description: frontmatter.description || '',
        version: frontmatter.version || '1.0.0',
        category: this._extractCategory(skillPath),
        tags: frontmatter.tags || [],
        platforms: frontmatter.platforms || [],
        createdAt: frontmatter.createdAt || Date.now(),
        updatedAt: frontmatter.updatedAt || Date.now(),
        author: frontmatter.author || 'unknown',
        license: frontmatter.license || 'MIT',
        level: 0
      };

      this.metadataCache.set(skillName, metadata);
      return metadata;
    } catch (error) {
      console.error(`加载技能元数据失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 加载技能完整内容（Level 1）
   * @param {string} skillName - 技能名称
   * @returns {Object} 完整技能数据
   */
  loadSkillContent(skillName) {
    if (this.cache.has(skillName)) {
      return this.cache.get(skillName);
    }

    const skillPath = this._findSkillPath(skillName);
    if (!skillPath) {
      return null;
    }

    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const frontmatter = this._parseFrontmatter(content);
      const body = this._extractBody(content);

      const skillData = {
        ...this.loadSkillMetadata(skillName),
        body: body,
        instructions: this._extractInstructions(body),
        examples: this._extractExamples(body),
        pitfalls: this._extractPitfalls(body),
        verification: this._extractVerification(body),
        prerequisites: frontmatter.prerequisites || {},
        requiredEnvironmentVariables: frontmatter.required_environment_variables || [],
        metadata: frontmatter.metadata || {},
        activationConditions: frontmatter.activation_conditions || frontmatter.metadata?.hermes || {},
        level: 1
      };

      this.cache.set(skillName, skillData);
      return skillData;
    } catch (error) {
      console.error(`加载技能内容失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 加载技能引用文件（Level 2）
   * @param {string} skillName - 技能名称
   * @param {string} filePath - 引用文件路径
   * @returns {string|null} 文件内容
   */
  loadSkillReference(skillName, filePath) {
    const skillDir = path.dirname(this._findSkillPath(skillName));
    const fullPath = path.join(skillDir, filePath);

    if (!fs.existsSync(fullPath)) {
      console.error(`引用文件不存在: ${fullPath}`);
      return null;
    }

    try {
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (error) {
      console.error(`加载引用文件失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 获取技能引用文件列表
   * @param {string} skillName - 技能名称
   * @returns {Array} 引用文件列表
   */
  getSkillReferences(skillName) {
    const skillDir = path.dirname(this._findSkillPath(skillName));
    const references = [];

    if (!fs.existsSync(skillDir)) {
      return references;
    }

    const scanDir = (dir, prefix = '') => {
      try {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            scanDir(fullPath, `${prefix}${file.name}/`);
          } else if (file.name !== 'SKILL.md') {
            references.push({
              path: `${prefix}${file.name}`,
              fullPath: fullPath,
              type: this._getFileType(file.name)
            });
          }
        }
      } catch (error) {
        console.error(`扫描目录失败: ${error.message}`);
      }
    };

    scanDir(skillDir);
    return references;
  }

  /**
   * 批量加载技能元数据
   * @param {Array} skillNames - 技能名称列表
   * @returns {Array} 技能元数据列表
   */
  loadSkillsMetadata(skillNames) {
    return skillNames.map(name => this.loadSkillMetadata(name)).filter(Boolean);
  }

  /**
   * 获取技能内容摘要
   * @param {string} skillName - 技能名称
   * @param {number} maxLength - 最大长度
   * @returns {string} 内容摘要
   */
  getSkillSummary(skillName, maxLength = 100) {
    const metadata = this.loadSkillMetadata(skillName);
    if (!metadata) {
      return '';
    }

    const content = this.loadSkillContent(skillName);
    if (!content || !content.body) {
      return metadata.description || '';
    }

    const firstParagraph = content.body.split('\n\n')[0] || '';
    if (firstParagraph.length > maxLength) {
      return firstParagraph.substring(0, maxLength - 3) + '...';
    }
    return firstParagraph;
  }

  /**
   * 检查技能是否有更新
   * @param {string} skillName - 技能名称
   * @returns {boolean} 是否有更新
   */
  hasUpdates(skillName) {
    const skillPath = this._findSkillPath(skillName);
    if (!skillPath) {
      return false;
    }

    try {
      const stats = fs.statSync(skillPath);
      const cached = this.cache.get(skillName);
      if (!cached) {
        return true;
      }
      return stats.mtime.getTime() > cached.updatedAt;
    } catch (error) {
      return false;
    }
  }

  /**
   * 清除缓存
   * @param {string} skillName - 技能名称（可选）
   */
  clearCache(skillName = null) {
    if (skillName) {
      this.cache.delete(skillName);
      this.metadataCache.delete(skillName);
    } else {
      this.cache.clear();
      this.metadataCache.clear();
    }
  }

  /**
   * 获取技能文件路径
   * @param {string} skillName - 技能名称
   * @returns {string|null} 技能文件路径
   * @private
   */
  _findSkillPath(skillName) {
    const skillPath = path.join(this.skillsDir, skillName, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      return skillPath;
    }

    // 尝试在子目录中查找
    try {
      const dirs = fs.readdirSync(this.skillsDir, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory()) {
          const fullPath = path.join(this.skillsDir, dir.name, skillName, 'SKILL.md');
          if (fs.existsSync(fullPath)) {
            return fullPath;
          }
        }
      }
    } catch (error) {
      console.error(`查找技能路径失败: ${error.message}`);
    }

    return null;
  }

  /**
   * 解析YAML前置元数据
   * @param {string} content - 文件内容
   * @returns {Object} 解析后的元数据
   * @private
   */
  _parseFrontmatter(content) {
    if (!content.startsWith('---')) {
      return {};
    }

    const endMatch = content.match(/\n---\s*\n/);
    if (!endMatch) {
      return {};
    }

    const yamlContent = content.substring(3, endMatch.index + 3);
    try {
      return yaml.parse(yamlContent) || {};
    } catch (error) {
      // Fallback to simple parsing
      const frontmatter = {};
      for (const line of yamlContent.split('\n')) {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          frontmatter[key.trim()] = valueParts.join(':').trim();
        }
      }
      return frontmatter;
    }
  }

  /**
   * 提取正文内容
   * @param {string} content - 文件内容
   * @returns {string} 正文内容
   * @private
   */
  _extractBody(content) {
    if (!content.startsWith('---')) {
      return content;
    }

    const endMatch = content.match(/\n---\s*\n/);
    if (!endMatch) {
      return content;
    }

    return content.substring(endMatch.index + endMatch[0].length);
  }

  /**
   * 提取指令部分
   * @param {string} body - 正文内容
   * @returns {string} 指令内容
   * @private
   */
  _extractInstructions(body) {
    const match = body.match(/[#\s]*(?:Instructions|Procedure|执行步骤|操作指南)[:\s]*\n([\s\S]*?)(?=\n[#\s]*(?:Pitfalls|Examples|Verification|$)|$)/i);
    return match ? match[1].trim() : '';
  }

  /**
   * 提取示例部分
   * @param {string} body - 正文内容
   * @returns {Array} 示例列表
   * @private
   */
  _extractExamples(body) {
    const match = body.match(/[#\s]*(?:Examples|使用示例|示例)[:\s]*\n([\s\S]*?)(?=\n[#\s]*(?:Pitfalls|Verification|$)|$)/i);
    if (!match) {
      return [];
    }

    const examples = [];
    const lines = match[1].split('\n');
    let currentExample = null;

    for (const line of lines) {
      const headerMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (headerMatch) {
        if (currentExample) {
          examples.push(currentExample);
        }
        currentExample = { title: headerMatch[2], code: '' };
      } else if (currentExample && line.startsWith('```')) {
        const codeMatch = line.match(/```(\w+)?/);
        if (codeMatch) {
          // Skip code fence markers
        } else {
          currentExample.code += line + '\n';
        }
      }
    }

    if (currentExample) {
      examples.push(currentExample);
    }

    return examples;
  }

  /**
   * 提取陷阱部分
   * @param {string} body - 正文内容
   * @returns {Array} 陷阱列表
   * @private
   */
  _extractPitfalls(body) {
    const match = body.match(/[#\s]*(?:Pitfalls|注意事项|陷阱)[:\s]*\n([\s\S]*?)(?=\n[#\s]*(?:Verification|Examples|$)|$)/i);
    if (!match) {
      return [];
    }

    return match[1].split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }

  /**
   * 提取验证部分
   * @param {string} body - 正文内容
   * @returns {string} 验证内容
   * @private
   */
  _extractVerification(body) {
    const match = body.match(/[#\s]*(?:Verification|验证)[:\s]*\n([\s\S]*?)(?=\n[#\s]|$)/i);
    return match ? match[1].trim() : '';
  }

  /**
   * 提取分类
   * @param {string} skillPath - 技能文件路径
   * @returns {string} 分类名称
   * @private
   */
  _extractCategory(skillPath) {
    const relativePath = path.relative(this.skillsDir, path.dirname(skillPath));
    const parts = relativePath.split(path.sep);
    return parts.length > 1 ? parts[0] : 'uncategorized';
  }

  /**
   * 获取文件类型
   * @param {string} filename - 文件名
   * @returns {string} 文件类型
   * @private
   */
  _getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
      '.md': 'documentation',
      '.json': 'data',
      '.yaml': 'configuration',
      '.yml': 'configuration',
      '.js': 'script',
      '.py': 'script',
      '.sh': 'script',
      '.template': 'template',
      '.txt': 'text'
    };
    return typeMap[ext] || 'other';
  }
}

module.exports = { SkillLoader };