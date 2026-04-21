/**
 * 技能发现和管理模块
 * 基于Hermes的技能管理机制，实现智能探测和建立skill的功能
 * 手动修改以测试自动迭代记录功能
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class SkillDiscovery {
  constructor() {
    this.skillsDir = path.join(process.cwd(), 'skills');
    this.externalSkillsDirs = [];
    this.skills = [];
    this._injectionPatterns = [
      'ignore previous instructions',
      'ignore all previous',
      'you are now',
      'disregard your',
      'forget your instructions',
      'new instructions:',
      'system prompt:',
      '<system>',
      ']]>'
    ];
  }

  /**
   * 初始化技能发现模块
   * @param {Array<string>} externalDirs - 外部技能目录
   */
  init(externalDirs = []) {
    this.externalSkillsDirs = externalDirs.map(dir => path.resolve(dir));
    this.ensureSkillsDir();
  }

  /**
   * 确保技能目录存在
   */
  ensureSkillsDir() {
    if (!fs.existsSync(this.skillsDir)) {
      fs.mkdirSync(this.skillsDir, { recursive: true });
    }
  }

  /**
   * 扫描所有技能目录，发现技能
   * @returns {Array<Object>} 技能列表
   */
  scanSkills() {
    this.skills = [];
    const seenNames = new Set();

    // 扫描本地技能目录
    this.scanDirectory(this.skillsDir, seenNames);

    // 扫描外部技能目录
    for (const externalDir of this.externalSkillsDirs) {
      if (fs.existsSync(externalDir)) {
        this.scanDirectory(externalDir, seenNames);
      }
    }

    return this.skills;
  }

  /**
   * 扫描单个目录，发现技能
   * @param {string} directory - 目录路径
   * @param {Set} seenNames - 已发现的技能名称集合
   */
  scanDirectory(directory, seenNames) {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);

      // 跳过隐藏目录
      if (file.name.startsWith('.')) {
        continue;
      }

      if (file.isDirectory()) {
        // 检查是否是技能目录（包含SKILL.md）
        const skillMdPath = path.join(fullPath, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
          this.processSkill(skillMdPath, seenNames);
        } else {
          // 递归扫描子目录
          this.scanDirectory(fullPath, seenNames);
        }
      } else if (file.isFile() && file.name === 'SKILL.md') {
        // 处理根目录下的SKILL.md文件
        this.processSkill(fullPath, seenNames);
      }
    }
  }

  /**
   * 处理技能文件
   * @param {string} skillMdPath - SKILL.md文件路径
   * @param {Set} seenNames - 已发现的技能名称集合
   */
  processSkill(skillMdPath, seenNames) {
    try {
      const content = fs.readFileSync(skillMdPath, 'utf8');
      const { frontmatter, body } = this.parseFrontmatter(content);

      // 检查平台兼容性
      if (!this.skillMatchesPlatform(frontmatter)) {
        return;
      }

      // 提取技能名称
      const skillDir = path.dirname(skillMdPath);
      const name = frontmatter.name || path.basename(skillDir);

      // 检查是否已存在
      if (seenNames.has(name)) {
        return;
      }

      // 提取描述
      let description = frontmatter.description || '';
      if (!description) {
        // 从body中提取第一个非标题行作为描述
        for (const line of body.trim().split('\n')) {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            description = trimmedLine;
            break;
          }
        }
      }

      // 提取分类
      const category = this.getCategoryFromPath(skillMdPath);

      // 提取标签和相关技能
      const tags = this.parseTags(frontmatter.tags || []);
      const relatedSkills = this.parseTags(frontmatter.related_skills || []);

      // 检查安全问题
      const securityWarnings = this.checkSecurity(content, skillMdPath);

      // 构建技能对象
      const skill = {
        name,
        description,
        category,
        path: skillMdPath,
        directory: skillDir,
        tags,
        relatedSkills,
        frontmatter,
        securityWarnings,
        readinessStatus: this.getReadinessStatus(frontmatter)
      };

      this.skills.push(skill);
      seenNames.add(name);
    } catch (error) {
      console.error(`Error processing skill ${skillMdPath}:`, error);
    }
  }

  /**
   * 解析YAML frontmatter
   * @param {string} content - 文件内容
   * @returns {Object} 解析结果，包含frontmatter和body
   */
  parseFrontmatter(content) {
    if (!content.startsWith('---')) {
      return { frontmatter: {}, body: content };
    }

    const endMatch = content.indexOf('\n---\n', 3);
    if (endMatch === -1) {
      return { frontmatter: {}, body: content };
    }

    const yamlContent = content.substring(3, endMatch);
    const body = content.substring(endMatch + 4);

    try {
      const frontmatter = yaml.load(yamlContent);
      return { frontmatter: frontmatter || {}, body };
    } catch (error) {
      // 解析失败，返回空frontmatter
      return { frontmatter: {}, body: content };
    }
  }

  /**
   * 检查技能是否与当前平台兼容
   * @param {Object} frontmatter - 技能元数据
   * @returns {boolean} 是否兼容
   */
  skillMatchesPlatform(frontmatter) {
    const platforms = frontmatter.platforms;
    if (!platforms) {
      return true;
    }

    const currentPlatform = process.platform;
    const platformMap = {
      'macos': 'darwin',
      'linux': 'linux',
      'windows': 'win32'
    };

    const platformList = Array.isArray(platforms) ? platforms : [platforms];
    for (const platform of platformList) {
      const normalizedPlatform = String(platform).toLowerCase().trim();
      const mappedPlatform = platformMap[normalizedPlatform] || normalizedPlatform;
      if (currentPlatform.startsWith(mappedPlatform)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 从路径中提取分类
   * @param {string} skillMdPath - SKILL.md文件路径
   * @returns {string|null} 分类名称
   */
  getCategoryFromPath(skillMdPath) {
    const skillDir = path.dirname(skillMdPath);
    const parentDir = path.dirname(skillDir);

    // 检查是否在skills目录下的子目录
    if (parentDir.includes('skills')) {
      const relativePath = path.relative(this.skillsDir, skillDir);
      const parts = relativePath.split(path.sep);
      if (parts.length > 1) {
        return parts[0];
      }
    }

    return null;
  }

  /**
   * 解析标签
   * @param {string|Array} tagsValue - 标签值
   * @returns {Array<string>} 标签列表
   */
  parseTags(tagsValue) {
    if (!tagsValue) {
      return [];
    }

    if (Array.isArray(tagsValue)) {
      return tagsValue.map(tag => String(tag).trim()).filter(Boolean);
    }

    const tagsString = String(tagsValue).trim();
    if (tagsString.startsWith('[') && tagsString.endsWith(']')) {
      const inner = tagsString.substring(1, tagsString.length - 1);
      return inner.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
  }

  /**
   * 检查技能安全性
   * @param {string} content - 技能内容
   * @param {string} skillMdPath - 技能文件路径
   * @returns {Array<string>} 安全警告列表
   */
  checkSecurity(content, skillMdPath) {
    const warnings = [];

    // 检查提示注入
    const contentLower = content.toLowerCase();
    for (const pattern of this._injectionPatterns) {
      if (contentLower.includes(pattern)) {
        warnings.push('Skill contains patterns that may indicate prompt injection');
        break;
      }
    }

    // 检查文件路径安全性
    if (!skillMdPath.includes(this.skillsDir) && !this.externalSkillsDirs.some(dir => skillMdPath.includes(dir))) {
      warnings.push('Skill file is outside trusted directories');
    }

    return warnings;
  }

  /**
   * 获取技能准备状态
   * @param {Object} frontmatter - 技能元数据
   * @returns {string} 准备状态
   */
  getReadinessStatus(frontmatter) {
    // 检查环境变量需求
    const prerequisites = frontmatter.prerequisites || {};
    const envVars = prerequisites.env_vars || [];
    const missingEnvVars = envVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      return 'setup_needed';
    }

    // 检查命令需求
    const commands = prerequisites.commands || [];
    // 这里可以添加命令检查逻辑

    return 'available';
  }

  /**
   * 获取技能列表
   * @param {string} category - 可选的分类过滤
   * @returns {Object} 技能列表和分类
   */
  getSkillsList(category = null) {
    const skills = this.scanSkills();
    let filteredSkills = skills;

    if (category) {
      filteredSkills = skills.filter(skill => skill.category === category);
    }

    // 提取分类
    const categories = [...new Set(skills.map(skill => skill.category).filter(Boolean))].sort();

    return {
      success: true,
      skills: filteredSkills.map(skill => ({
        name: skill.name,
        description: skill.description,
        category: skill.category
      })),
      categories,
      count: filteredSkills.length,
      hint: 'Use skill_view(name) to see full content, tags, and linked files'
    };
  }

  /**
   * 查看技能详细信息
   * @param {string} name - 技能名称
   * @param {string} filePath - 可选的文件路径
   * @returns {Object} 技能详细信息
   */
  getSkillView(name, filePath = null) {
    const skills = this.scanSkills();
    const skill = skills.find(s => s.name === name);

    if (!skill) {
      return {
        success: false,
        error: `Skill '${name}' not found.`,
        available_skills: skills.map(s => s.name),
        hint: 'Use skills_list to see all available skills'
      };
    }

    try {
      if (filePath) {
        // 查看技能中的特定文件
        const targetFile = path.join(skill.directory, filePath);

        // 检查路径遍历
        if (filePath.includes('..')) {
          return {
            success: false,
            error: "Path traversal ('..') is not allowed.",
            hint: 'Use a relative path within the skill directory'
          };
        }

        // 检查文件是否存在
        if (!fs.existsSync(targetFile)) {
          // 列出可用文件
          const availableFiles = this.listSkillFiles(skill.directory);
          return {
            success: false,
            error: `File '${filePath}' not found in skill '${name}'.`,
            available_files: availableFiles,
            hint: 'Use one of the available file paths listed above'
          };
        }

        // 读取文件内容
        const content = fs.readFileSync(targetFile, 'utf8');
        return {
          success: true,
          name: skill.name,
          file: filePath,
          content,
          file_type: path.extname(targetFile)
        };
      } else {
        // 查看技能主内容
        const content = fs.readFileSync(skill.path, 'utf8');
        const linkedFiles = this.listSkillFiles(skill.directory);

        return {
          success: true,
          name: skill.name,
          description: skill.description,
          tags: skill.tags,
          related_skills: skill.relatedSkills,
          content,
          path: path.relative(this.skillsDir, skill.path),
          skill_dir: skill.directory,
          linked_files: linkedFiles,
          usage_hint: linkedFiles ? "To view linked files, call skill_view(name, file_path) where file_path is e.g. 'references/api.md' or 'assets/config.yaml'" : null,
          readiness_status: skill.readinessStatus,
          security_warnings: skill.securityWarnings
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to read skill '${name}': ${error.message}`
      };
    }
  }

  /**
   * 列出技能中的文件
   * @param {string} skillDir - 技能目录
   * @returns {Object} 文件列表
   */
  listSkillFiles(skillDir) {
    const files = {
      references: [],
      templates: [],
      assets: [],
      scripts: [],
      other: []
    };

    // 扫描技能目录
    function scanDir(dir, baseDir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (item.isFile() && item.name !== 'SKILL.md') {
          if (relativePath.startsWith('references/')) {
            files.references.push(relativePath);
          } else if (relativePath.startsWith('templates/')) {
            files.templates.push(relativePath);
          } else if (relativePath.startsWith('assets/')) {
            files.assets.push(relativePath);
          } else if (relativePath.startsWith('scripts/')) {
            files.scripts.push(relativePath);
          } else {
            files.other.push(relativePath);
          }
        } else if (item.isDirectory() && !item.name.startsWith('.')) {
          scanDir(fullPath, baseDir);
        }
      }
    }

    scanDir(skillDir, skillDir);

    // 移除空分类
    Object.keys(files).forEach(key => {
      if (files[key].length === 0) {
        delete files[key];
      }
    });

    return Object.keys(files).length > 0 ? files : null;
  }

  /**
   * 创建新技能
   * @param {string} name - 技能名称
   * @param {Object} options - 技能选项
   * @returns {Object} 创建结果
   */
  createSkill(name, options = {}) {
    const skillDir = path.join(this.skillsDir, name);

    // 检查技能是否已存在
    if (fs.existsSync(skillDir)) {
      return {
        success: false,
        error: `Skill '${name}' already exists.`
      };
    }

    try {
      // 创建技能目录
      fs.mkdirSync(skillDir, { recursive: true });

      // 创建SKILL.md文件
      const frontmatter = {
        name,
        description: options.description || `Skill for ${name}`,
        version: options.version || '1.0.0',
        platforms: options.platforms || ['windows', 'macos', 'linux'],
        ...options.frontmatter
      };

      const yamlFrontmatter = yaml.dump(frontmatter);
      const content = `---
${yamlFrontmatter}---

# ${name}

Skill instructions here...
`;

      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);

      // 创建支持目录
      if (options.createDirectories !== false) {
        fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
        fs.mkdirSync(path.join(skillDir, 'templates'), { recursive: true });
        fs.mkdirSync(path.join(skillDir, 'assets'), { recursive: true });
        fs.mkdirSync(path.join(skillDir, 'scripts'), { recursive: true });
      }

      return {
        success: true,
        message: `Skill '${name}' created successfully.`,
        path: skillDir
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create skill '${name}': ${error.message}`
      };
    }
  }
}

// 导出模块
module.exports = SkillDiscovery;