const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SyncManager {
  constructor(config) {
    this.config = {
      syncInterval: 24 * 60 * 60 * 1000, // 24小时
      projects: [
        {
          id: 'hermes',
          name: 'Hermes Agent',
          repository: 'https://github.com/NousResearch/hermes-agent.git',
          localPath: 'D:\\opensource\\hermes\\agent',
          branch: 'main',
          category: 'AI Agent',
          priority: 'high',
          syncRules: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'openclaw',
          name: 'OpenCLAW',
          repository: 'https://github.com/openclaw/openclaw.git',
          localPath: 'D:\\opensource\\openclaw',
          branch: 'main',
          category: 'Workflow',
          priority: 'high',
          syncRules: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'awesome-kgr',
          name: 'Awesome Knowledge Graph Reasoning',
          repository: 'https://github.com/LIANGKE23/Awesome-Knowledge-Graph-Reasoning.git',
          localPath: 'D:\\opensource\\awesome-kgr',
          branch: 'main',
          category: 'Knowledge Graph',
          priority: 'high',
          syncRules: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'superpower',
          name: 'Superpowers',
          repository: 'https://github.com/obra/superpowers',
          localPath: 'D:\\opensource\\superpower',
          branch: 'main',
          category: 'AI Agent',
          priority: 'high',
          syncRules: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'langchain',
          name: 'LangChain',
          repository: 'https://github.com/langchain-ai/langchain.git',
          localPath: 'D:\\opensource\\langchain',
          branch: 'main',
          category: 'AI Agent',
          priority: 'medium',
          syncRules: {
            enabled: true,
            interval: 48 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'llama-index',
          name: 'LlamaIndex',
          repository: 'https://github.com/run-llama/llama_index.git',
          localPath: 'D:\\opensource\\llama-index',
          branch: 'main',
          category: 'AI Agent',
          priority: 'medium',
          syncRules: {
            enabled: true,
            interval: 48 * 60 * 60 * 1000,
            autoMerge: true
          }
        },
        {
          id: 'neo4j',
          name: 'Neo4j',
          repository: 'https://github.com/neo4j/neo4j.git',
          localPath: 'D:\\opensource\\neo4j',
          branch: 'main',
          category: 'Knowledge Graph',
          priority: 'medium',
          syncRules: {
            enabled: true,
            interval: 72 * 60 * 60 * 1000,
            autoMerge: false
          }
        },
        {
          id: 'dgraph',
          name: 'Dgraph',
          repository: 'https://github.com/dgraph-io/dgraph.git',
          localPath: 'D:\\opensource\\dgraph',
          branch: 'main',
          category: 'Knowledge Graph',
          priority: 'medium',
          syncRules: {
            enabled: true,
            interval: 72 * 60 * 60 * 1000,
            autoMerge: false
          }
        }
      ],
      logPath: 'D:\\opensource\\sync-logs',
      defaultSyncRules: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000,
        autoMerge: true
      },
      ...config
    };
    
    // 创建日志目录
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  async syncAllProjects() {
    const results = [];
    
    // 按优先级排序项目
    const sortedProjects = [...this.config.projects].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    for (const project of sortedProjects) {
      // 检查项目是否启用同步
      const syncRules = project.syncRules || this.config.defaultSyncRules;
      if (!syncRules.enabled) {
        results.push({
          project: project.name,
          status: 'skipped',
          message: '同步已禁用'
        });
        continue;
      }
      
      try {
        const result = await this.syncProject(project);
        results.push(result);
      } catch (error) {
        results.push({
          project: project.name,
          status: 'error',
          message: error.message
        });
      }
    }
    
    return results;
  }
  
  // 添加项目
  addProject(project) {
    // 验证项目参数
    if (!project.id || !project.name || !project.repository || !project.localPath) {
      throw new Error('项目参数不完整');
    }
    
    // 检查项目是否已存在
    const existingProject = this.config.projects.find(p => p.id === project.id);
    if (existingProject) {
      throw new Error('项目ID已存在');
    }
    
    // 添加默认同步规则
    project.syncRules = { ...this.config.defaultSyncRules, ...project.syncRules };
    
    // 添加项目
    this.config.projects.push(project);
    return project;
  }
  
  // 删除项目
  removeProject(projectId) {
    const index = this.config.projects.findIndex(p => p.id === projectId);
    if (index === -1) {
      throw new Error('项目不存在');
    }
    
    const removedProject = this.config.projects.splice(index, 1)[0];
    return removedProject;
  }
  
  // 更新项目
  updateProject(projectId, updates) {
    const project = this.config.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('项目不存在');
    }
    
    // 更新项目信息
    Object.assign(project, updates);
    
    // 确保同步规则完整
    project.syncRules = { ...this.config.defaultSyncRules, ...project.syncRules };
    
    return project;
  }
  
  // 获取项目列表
  getProjects() {
    return this.config.projects;
  }
  
  // 按分类获取项目
  getProjectsByCategory(category) {
    return this.config.projects.filter(p => p.category === category);
  }
  
  // 按优先级获取项目
  getProjectsByPriority(priority) {
    return this.config.projects.filter(p => p.priority === priority);
  }

  async syncProject(project) {
    const logFile = path.join(this.config.logPath, `${project.id}_${new Date().toISOString().split('T')[0]}.log`);
    const logStream = fs.createWriteStream(logFile, { flags: 'a' });
    
    try {
      logStream.write(`[${new Date().toISOString()}] 开始同步项目: ${project.name}\n`);
      
      // 检查本地目录是否存在
      if (!fs.existsSync(project.localPath)) {
        logStream.write(`[${new Date().toISOString()}] 本地目录不存在，开始克隆项目\n`);
        execSync(`git clone ${project.repository} "${project.localPath}"`, {
          stdio: ['ignore', logStream, logStream]
        });
      } else {
        logStream.write(`[${new Date().toISOString()}] 本地目录存在，开始拉取更新\n`);
        execSync(`git -C "${project.localPath}" checkout ${project.branch}`, {
          stdio: ['ignore', logStream, logStream]
        });
        execSync(`git -C "${project.localPath}" pull`, {
          stdio: ['ignore', logStream, logStream]
        });
      }
      
      logStream.write(`[${new Date().toISOString()}] 同步完成: ${project.name}\n`);
      
      return {
        project: project.name,
        status: 'success',
        message: '同步成功'
      };
    } catch (error) {
      logStream.write(`[${new Date().toISOString()}] 同步失败: ${project.name}, 错误: ${error.message}\n`);
      throw error;
    } finally {
      logStream.end();
    }
  }

  startScheduledSync() {
    this.syncAllProjects(); // 立即执行一次
    
    // 设置定时任务
    setInterval(() => {
      this.syncAllProjects();
    }, this.config.syncInterval);
    
    console.log('自动同步任务已启动，每24小时执行一次');
  }
}

module.exports = SyncManager;