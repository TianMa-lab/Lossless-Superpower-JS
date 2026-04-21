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
          branch: 'main'
        },
        {
          id: 'openclaw',
          name: 'OpenCLAW',
          repository: 'https://github.com/openclaw/openclaw.git',
          localPath: 'D:\\opensource\\openclaw',
          branch: 'main'
        },
        {
          id: 'awesome-kgr',
          name: 'Awesome Knowledge Graph Reasoning',
          repository: 'https://github.com/LIANGKE23/Awesome-Knowledge-Graph-Reasoning.git',
          localPath: 'D:\\opensource\\awesome-kgr',
          branch: 'main'
        },
        {
          id: 'superpower',
          name: 'Superpowers',
          repository: 'https://github.com/obra/superpowers',
          localPath: 'D:\\opensource\\superpower',
          branch: 'main'
        }
      ],
      logPath: 'D:\\opensource\\sync-logs',
      ...config
    };
    
    // 创建日志目录
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  async syncAllProjects() {
    const results = [];
    
    for (const project of this.config.projects) {
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