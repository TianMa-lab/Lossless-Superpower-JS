const fs = require('fs');
const path = require('path');

class CommunityManager {
  constructor() {
    this.communityDir = path.join(__dirname, 'community');
    this.pluginsDir = path.join(this.communityDir, 'plugins');
    this.contributionsDir = path.join(this.communityDir, 'contributions');
    this.versionsDir = path.join(this.communityDir, 'versions');
    this.docsDir = path.join(this.communityDir, 'docs');
    this.plugins = {};
    this.contributions = [];
  }

  async init() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.communityDir)) {
        fs.mkdirSync(this.communityDir, { recursive: true });
      }
      if (!fs.existsSync(this.pluginsDir)) {
        fs.mkdirSync(this.pluginsDir, { recursive: true });
      }
      if (!fs.existsSync(this.contributionsDir)) {
        fs.mkdirSync(this.contributionsDir, { recursive: true });
      }
      if (!fs.existsSync(this.versionsDir)) {
        fs.mkdirSync(this.versionsDir, { recursive: true });
      }
      if (!fs.existsSync(this.docsDir)) {
        fs.mkdirSync(this.docsDir, { recursive: true });
      }

      // 加载插件
      await this.loadPlugins();
      
      // 加载贡献
      this.loadContributions();

      console.log('社区系统初始化成功');
      return true;
    } catch (error) {
      console.error('社区系统初始化失败:', error.message);
      return false;
    }
  }

  // 加载插件
  async loadPlugins() {
    try {
      const pluginDirectories = fs.readdirSync(this.pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const pluginName of pluginDirectories) {
        const pluginPath = path.join(this.pluginsDir, pluginName);
        const pluginMain = path.join(pluginPath, 'index.js');
        
        if (fs.existsSync(pluginMain)) {
          try {
            const plugin = require(pluginMain);
            this.plugins[pluginName] = plugin;
            console.log(`加载插件: ${pluginName}`);
          } catch (error) {
            console.error(`加载插件 ${pluginName} 失败:`, error.message);
          }
        }
      }

      console.log(`共加载 ${Object.keys(this.plugins).length} 个插件`);
    } catch (error) {
      console.error('加载插件失败:', error.message);
    }
  }

  // 加载贡献
  loadContributions() {
    try {
      const contributionFiles = fs.readdirSync(this.contributionsDir)
        .filter(file => file.endsWith('.json'));

      for (const file of contributionFiles) {
        const filePath = path.join(this.contributionsDir, file);
        try {
          const contribution = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          this.contributions.push(contribution);
        } catch (error) {
          console.error(`加载贡献文件 ${file} 失败:`, error.message);
        }
      }

      console.log(`共加载 ${this.contributions.length} 条贡献`);
    } catch (error) {
      console.error('加载贡献失败:', error.message);
    }
  }

  // 注册插件
  async registerPlugin(pluginName, pluginConfig) {
    try {
      const pluginPath = path.join(this.pluginsDir, pluginName);
      
      // 创建插件目录
      if (!fs.existsSync(pluginPath)) {
        fs.mkdirSync(pluginPath, { recursive: true });
      }

      // 创建插件主文件
      const pluginMain = path.join(pluginPath, 'index.js');
      const pluginContent = `
// ${pluginName} 插件
module.exports = {
  name: '${pluginName}',
  version: '${pluginConfig.version || '1.0.0'}',
  description: '${pluginConfig.description || ''}',
  author: '${pluginConfig.author || 'Unknown'}',
  
  // 插件初始化
  init: function() {
    console.log('${pluginName} 插件初始化');
  },
  
  // 插件执行
  execute: function(data) {
    console.log('${pluginName} 插件执行:', data);
    return { success: true, data: data };
  }
};
`;
      fs.writeFileSync(pluginMain, pluginContent, 'utf-8');

      // 重新加载插件
      await this.loadPlugins();
      
      console.log(`插件 ${pluginName} 注册成功`);
      return true;
    } catch (error) {
      console.error(`注册插件 ${pluginName} 失败:`, error.message);
      return false;
    }
  }

  // 执行插件
  executePlugin(pluginName, data) {
    try {
      if (this.plugins[pluginName]) {
        const plugin = this.plugins[pluginName];
        if (plugin.execute) {
          return plugin.execute(data);
        } else {
          console.error(`插件 ${pluginName} 没有 execute 方法`);
          return { success: false, error: '插件没有 execute 方法' };
        }
      } else {
        console.error(`插件 ${pluginName} 不存在`);
        return { success: false, error: '插件不存在' };
      }
    } catch (error) {
      console.error(`执行插件 ${pluginName} 失败:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // 列出所有插件
  listPlugins() {
    return Object.keys(this.plugins).map(pluginName => {
      const plugin = this.plugins[pluginName];
      return {
        name: pluginName,
        version: plugin.version || '1.0.0',
        description: plugin.description || '',
        author: plugin.author || 'Unknown'
      };
    });
  }

  // 添加贡献
  addContribution(contribution) {
    try {
      const contributionData = {
        id: `contribution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...contribution
      };

      const contributionFile = path.join(this.contributionsDir, `${contributionData.id}.json`);
      fs.writeFileSync(contributionFile, JSON.stringify(contributionData, null, 2), 'utf-8');

      this.contributions.push(contributionData);
      console.log(`贡献 ${contributionData.id} 添加成功`);
      return contributionData.id;
    } catch (error) {
      console.error('添加贡献失败:', error.message);
      return null;
    }
  }

  // 获取贡献
  getContributions(limit = 100) {
    return this.contributions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // 版本管理
  createVersion(versionData) {
    try {
      const version = {
        id: `version_${Date.now()}`,
        timestamp: Date.now(),
        ...versionData
      };

      const versionFile = path.join(this.versionsDir, `${version.version}.json`);
      fs.writeFileSync(versionFile, JSON.stringify(version, null, 2), 'utf-8');

      console.log(`版本 ${version.version} 创建成功`);
      return version;
    } catch (error) {
      console.error('创建版本失败:', error.message);
      return null;
    }
  }

  // 获取版本历史
  getVersionHistory() {
    try {
      const versionFiles = fs.readdirSync(this.versionsDir)
        .filter(file => file.endsWith('.json'));

      const versions = [];
      for (const file of versionFiles) {
        const filePath = path.join(this.versionsDir, file);
        try {
          const version = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          versions.push(version);
        } catch (error) {
          console.error(`加载版本文件 ${file} 失败:`, error.message);
        }
      }

      return versions.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('获取版本历史失败:', error.message);
      return [];
    }
  }

  // 生成文档
  generateDocumentation() {
    try {
      const docs = {
        plugins: this.listPlugins(),
        contributions: this.getContributions(10),
        versions: this.getVersionHistory().slice(0, 10),
        generatedAt: Date.now()
      };

      const docsFile = path.join(this.docsDir, `documentation_${Date.now()}.json`);
      fs.writeFileSync(docsFile, JSON.stringify(docs, null, 2), 'utf-8');

      console.log('文档生成成功');
      return docs;
    } catch (error) {
      console.error('生成文档失败:', error.message);
      return null;
    }
  }

  // 生成Markdown文档
  generateMarkdownDocumentation() {
    try {
      const plugins = this.listPlugins();
      const contributions = this.getContributions(10);
      const versions = this.getVersionHistory().slice(0, 10);

      let markdown = `# Lossless Superpower 社区文档

生成时间: ${new Date().toISOString()}

## 插件列表

| 插件名称 | 版本 | 描述 | 作者 |
|---------|------|------|------|
`;

      plugins.forEach(plugin => {
        markdown += `| ${plugin.name} | ${plugin.version} | ${plugin.description} | ${plugin.author} |
`;
      });

      markdown += `
## 最近贡献

| 贡献ID | 类型 | 描述 | 作者 | 时间 |
|--------|------|------|------|------|
`;

      contributions.forEach(contribution => {
        const date = new Date(contribution.timestamp).toISOString();
        markdown += `| ${contribution.id} | ${contribution.type || '其他'} | ${contribution.description || ''} | ${contribution.author || 'Unknown'} | ${date} |
`;
      });

      markdown += `
## 版本历史

| 版本 | 描述 | 时间 |
|------|------|------|
`;

      versions.forEach(version => {
        const date = new Date(version.timestamp).toISOString();
        markdown += `| ${version.version} | ${version.description || ''} | ${date} |
`;
      });

      const markdownFile = path.join(this.docsDir, `documentation_${Date.now()}.md`);
      fs.writeFileSync(markdownFile, markdown, 'utf-8');

      console.log('Markdown文档生成成功');
      return markdown;
    } catch (error) {
      console.error('生成Markdown文档失败:', error.message);
      return null;
    }
  }

  // 获取社区统计信息
  getCommunityStats() {
    try {
      const stats = {
        plugins: Object.keys(this.plugins).length,
        contributions: this.contributions.length,
        versions: this.getVersionHistory().length,
        lastUpdated: Date.now()
      };

      return stats;
    } catch (error) {
      console.error('获取社区统计信息失败:', error.message);
      return null;
    }
  }

  // 清理旧数据
  cleanOldData(days = 30) {
    try {
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);

      // 清理旧贡献
      const oldContributions = this.contributions.filter(c => c.timestamp < cutoffTime);
      for (const contribution of oldContributions) {
        const contributionFile = path.join(this.contributionsDir, `${contribution.id}.json`);
        if (fs.existsSync(contributionFile)) {
          fs.unlinkSync(contributionFile);
        }
      }

      // 清理旧文档
      const docFiles = fs.readdirSync(this.docsDir);
      for (const file of docFiles) {
        const filePath = path.join(this.docsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
        }
      }

      console.log(`清理了 ${oldContributions.length} 条旧贡献和部分旧文档`);
      return true;
    } catch (error) {
      console.error('清理旧数据失败:', error.message);
      return false;
    }
  }
}

const communityManager = new CommunityManager();

module.exports = {
  CommunityManager,
  communityManager
};
