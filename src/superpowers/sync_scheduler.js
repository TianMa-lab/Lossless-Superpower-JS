/**
 * 自动同步调度器
 * 定期同步本地代码与GitHub仓库
 */

const fs = require('fs');
const path = require('path');
const { GitHubSync } = require('./github_sync');

class SyncScheduler {
  constructor(configPath = 'github_sync_config.json') {
    this.configPath = configPath;
    this.config = this.loadConfig();
    this.githubSync = new GitHubSync();
    this.scheduledTasks = new Map();
    this.runningTasks = new Set();
  }
  
  /**
   * 加载配置
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('加载配置失败:', error.message);
    }
    return {
      repositories: [],
      sync_config: {
        default_interval: 3600,
        max_retries: 3,
        retry_delay: 60,
        timeout: 300,
        notification_enabled: true,
        log_level: 'info'
      }
    };
  }
  
  /**
   * 保存配置
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('保存配置失败:', error.message);
      return false;
    }
  }
  
  /**
   * 启动调度器
   */
  start() {
    console.log('启动自动同步调度器...');
    
    // 为每个启用的仓库创建定时任务
    this.config.repositories.forEach(repo => {
      if (repo.sync_enabled) {
        this.scheduleSync(repo);
      }
    });
    
    console.log('自动同步调度器已启动');
  }
  
  /**
   * 停止调度器
   */
  stop() {
    console.log('停止自动同步调度器...');
    
    // 取消所有定时任务
    this.scheduledTasks.forEach((task, repoId) => {
      clearInterval(task);
      console.log(`取消仓库 ${repoId} 的同步任务`);
    });
    
    this.scheduledTasks.clear();
    console.log('自动同步调度器已停止');
  }
  
  /**
   * 为仓库安排同步任务
   */
  scheduleSync(repo) {
    const interval = (repo.sync_interval || this.config.sync_config.default_interval) * 1000;
    
    console.log(`为仓库 ${repo.id} 安排同步任务，间隔 ${interval / 1000} 秒`);
    
    const task = setInterval(() => {
      this.performSync(repo);
    }, interval);
    
    this.scheduledTasks.set(repo.id, task);
  }
  
  /**
   * 执行同步
   */
  async performSync(repo) {
    // 避免重复执行
    if (this.runningTasks.has(repo.id)) {
      console.log(`仓库 ${repo.id} 的同步任务正在执行中，跳过本次调度`);
      return;
    }
    
    this.runningTasks.add(repo.id);
    
    try {
      console.log(`开始同步仓库 ${repo.id}...`);
      
      // 更新状态
      this.updateRepoStatus(repo.id, 'syncing');
      
      // 检查目录是否存在
      if (!fs.existsSync(repo.local_path)) {
        console.log(`目录 ${repo.local_path} 不存在，创建目录...`);
        fs.mkdirSync(repo.local_path, { recursive: true });
      }
      
      // 检查是否是Git仓库
      if (!this.githubSync.isGitRepo(repo.local_path)) {
        console.log(`目录 ${repo.local_path} 不是Git仓库，初始化...`);
        this.githubSync.initGitRepo(repo.local_path, repo.github_url);
      }
      
      // 执行同步
      const success = this.githubSync.syncCode(
        repo.local_path,
        repo.branch,
        `Auto sync: ${new Date().toISOString()}`
      );
      
      if (success) {
        console.log(`仓库 ${repo.id} 同步成功`);
        this.updateRepoStatus(repo.id, 'synced');
      } else {
        console.error(`仓库 ${repo.id} 同步失败`);
        this.updateRepoStatus(repo.id, 'failed');
      }
      
    } catch (error) {
      console.error(`同步仓库 ${repo.id} 时出错:`, error.message);
      this.updateRepoStatus(repo.id, 'error');
    } finally {
      this.runningTasks.delete(repo.id);
    }
  }
  
  /**
   * 更新仓库状态
   */
  updateRepoStatus(repoId, status) {
    const repo = this.config.repositories.find(r => r.id === repoId);
    if (repo) {
      repo.status = status;
      repo.last_sync = new Date().toISOString();
      this.saveConfig();
    }
  }
  
  /**
   * 手动触发同步
   */
  triggerSync(repoId) {
    const repo = this.config.repositories.find(r => r.id === repoId);
    if (repo) {
      console.log(`手动触发仓库 ${repoId} 的同步...`);
      this.performSync(repo);
      return true;
    } else {
      console.error(`仓库 ${repoId} 不存在`);
      return false;
    }
  }
  
  /**
   * 触发所有仓库同步
   */
  triggerAllSync() {
    console.log('触发所有仓库同步...');
    this.config.repositories.forEach(repo => {
      if (repo.sync_enabled) {
        this.performSync(repo);
      }
    });
  }
  
  /**
   * 获取调度器状态
   */
  getStatus() {
    const status = {
      running: this.scheduledTasks.size > 0,
      scheduledRepos: Array.from(this.scheduledTasks.keys()),
      runningTasks: Array.from(this.runningTasks),
      repositories: this.config.repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        status: repo.status,
        lastSync: repo.last_sync,
        syncEnabled: repo.sync_enabled
      }))
    };
    
    return status;
  }
  
  /**
   * 重新加载配置
   */
  reloadConfig() {
    console.log('重新加载配置...');
    this.config = this.loadConfig();
    
    // 重新安排任务
    this.stop();
    this.start();
  }
  
  /**
   * 添加新仓库
   */
  addRepository(repoConfig) {
    this.config.repositories.push({
      id: repoConfig.id || `repo_${Date.now()}`,
      name: repoConfig.name,
      github_url: repoConfig.github_url,
      local_path: repoConfig.local_path,
      branch: repoConfig.branch || 'main',
      sync_enabled: repoConfig.sync_enabled !== false,
      sync_interval: repoConfig.sync_interval || this.config.sync_config.default_interval,
      auto_pull: repoConfig.auto_pull !== false,
      auto_push: repoConfig.auto_push !== false,
      last_sync: new Date().toISOString(),
      status: 'idle'
    });
    
    this.saveConfig();
    
    // 为新仓库安排同步任务
    if (repoConfig.sync_enabled !== false) {
      const newRepo = this.config.repositories[this.config.repositories.length - 1];
      this.scheduleSync(newRepo);
    }
    
    return true;
  }
  
  /**
   * 移除仓库
   */
  removeRepository(repoId) {
    const index = this.config.repositories.findIndex(r => r.id === repoId);
    if (index !== -1) {
      // 取消定时任务
      if (this.scheduledTasks.has(repoId)) {
        clearInterval(this.scheduledTasks.get(repoId));
        this.scheduledTasks.delete(repoId);
      }
      
      // 移除仓库
      this.config.repositories.splice(index, 1);
      this.saveConfig();
      return true;
    }
    return false;
  }
}

// 导出模块
module.exports = {
  SyncScheduler
};