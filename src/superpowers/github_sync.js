/**
 * GitHub 同步模块
 * 自动从 GitHub 同步代码，确保本地代码与远程仓库保持一致
 * 同时支持将本地项目代码推送到 GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * GitHub 同步器
 */
class GitHubSync {
  constructor(config = {}) {
    this.config = {
      repos: [
        {
          name: 'superpowers',
          path: 'C:\\USERS\\55237\\superpowers',
          remoteUrl: 'https://github.com/obra/superpowers.git',
          branch: 'main'
        },
        {
          name: 'hermes-agent',
          path: 'C:\\USERS\\55237\\hermes-agent',
          remoteUrl: 'https://github.com/NousResearch/hermes-agent.git',
          branch: 'main'
        }
      ],
      localProject: {
        name: 'Lossless-Superpower-JS',
        path: 'C:\\USERS\\55237\\Lossless-Superpower-JS',
        remoteUrl: '',
        branch: 'main',
        autoCommit: true,
        commitMessage: '自动同步更新'
      },
      syncTime: {
        hour: 0,
        minute: 0
      },
      enableSync: true,
      autoUpdateProject: true,
      ...config
    };

    this.syncIntervalId = null;
    this.lastCommitHashes = {};
  }

  init() {
    console.log('GitHub 同步器初始化...');
    
    for (const repo of this.config.repos) {
      if (!fs.existsSync(repo.path)) {
        console.error(`仓库路径不存在: ${repo.path}`);
        continue;
      }

      if (!fs.existsSync(path.join(repo.path, '.git'))) {
        console.error(`路径不是 git 仓库: ${repo.path}`);
        continue;
      }

      try {
        const originalCwd = process.cwd();
        process.chdir(repo.path);
        const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
        this.lastCommitHashes[repo.name] = commitHash;
        process.chdir(originalCwd);
      } catch (error) {
        console.error(`获取 ${repo.name} 初始提交哈希失败:`, error.message);
      }
    }

    if (fs.existsSync(this.config.localProject.path)) {
      const gitPath = path.join(this.config.localProject.path, '.git');
      if (fs.existsSync(gitPath)) {
        console.log('本地项目已是 Git 仓库');
      } else {
        console.log('本地项目尚未初始化为 Git 仓库');
      }
    }

    if (this.config.enableSync) {
      this.startAutoSync();
    }

    console.log('GitHub 同步器初始化完成');
    return true;
  }

  startAutoSync() {
    console.log('启动 GitHub 自动同步...');
    this.syncAll();
    this.scheduleNextSync();
  }

  stopAutoSync() {
    if (this.syncIntervalId) {
      clearTimeout(this.syncIntervalId);
      this.syncIntervalId = null;
      console.log('停止 GitHub 自动同步');
    }
  }

  scheduleNextSync() {
    const now = new Date();
    const nextSync = new Date();
    nextSync.setHours(this.config.syncTime.hour, this.config.syncTime.minute, 0, 0);
    
    if (nextSync <= now) {
      nextSync.setDate(nextSync.getDate() + 1);
    }

    const timeUntilSync = nextSync - now;
    console.log(`下次同步时间: ${nextSync.toISOString()}`);

    this.syncIntervalId = setTimeout(() => {
      this.syncAll();
      this.scheduleNextSync();
    }, timeUntilSync);
  }

  syncAll() {
    console.log('开始同步所有 GitHub 仓库...');
    
    for (const repo of this.config.repos) {
      console.log(`\n同步仓库: ${repo.name}`);
      const syncResult = this.syncRepo(repo);
      
      if (syncResult && syncResult.updated) {
        console.log(`\n分析 ${repo.name} 的代码变更...`);
        const changes = this.analyzeChanges(repo, syncResult);
        
        console.log(`\n评估 ${repo.name} 是否需要更新项目...`);
        const shouldUpdate = this.shouldUpdateProject(repo, changes);
        
        if (shouldUpdate) {
          console.log(`\n${repo.name} 需要更新项目！`);
          this.updateProjectIfNeeded(repo, changes);
        } else {
          console.log(`\n${repo.name} 不需要更新项目`);
        }
      }
    }

    if (this.config.localProject.autoCommit) {
      console.log(`\n推送本地项目到 GitHub...`);
      this.pushLocalProject();
    }

    console.log('\n所有 GitHub 仓库同步完成');
  }

  syncRepo(repo) {
    const originalCwd = process.cwd();
    
    try {
      process.chdir(repo.path);

      const beforeHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
      
      console.log(`拉取 ${repo.name} 最新代码...`);
      execSync(`git pull origin ${repo.branch}`, { stdio: 'pipe' });

      const afterHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
      
      const updated = beforeHash !== afterHash;
      
      if (updated) {
        console.log(`${repo.name} 已更新: ${beforeHash} -> ${afterHash}`);
      } else {
        console.log(`${repo.name} 已是最新版本`);
      }

      process.chdir(originalCwd);

      this.lastCommitHashes[repo.name] = afterHash;
      
      console.log(`${repo.name} 同步成功`);
      return {
        success: true,
        updated: updated,
        beforeHash: beforeHash,
        afterHash: afterHash
      };
    } catch (error) {
      console.error(`${repo.name} 同步失败:`, error.message);
      process.chdir(originalCwd);
      return {
        success: false,
        updated: false,
        error: error.message
      };
    }
  }

  pushLocalProject() {
    const project = this.config.localProject;
    const originalCwd = process.cwd();
    
    try {
      process.chdir(project.path);

      if (!fs.existsSync('.git')) {
        console.log(`${project.name} 尚未初始化为 Git 仓库`);
        process.chdir(originalCwd);
        return { success: false, error: 'not a git repository' };
      }

      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      
      if (!status.trim()) {
        console.log(`${project.name} 没有变更需要推送`);
        process.chdir(originalCwd);
        return { success: true, pushed: false };
      }

      console.log('添加所有变更到暂存区...');
      execSync('git add -A', { stdio: 'pipe' });

      const stagedStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
      if (!stagedStatus.trim()) {
        console.log('没有新变更需要提交');
        process.chdir(originalCwd);
        return { success: true, pushed: false };
      }

      const timestamp = new Date().toISOString();
      const commitMessage = `${project.commitMessage} - ${timestamp}`;

      console.log(`提交变更: ${commitMessage}`);
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });

      let remoteUrl;
      try {
        remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
      } catch (error) {
        console.log(`${project.name} 没有配置远程仓库，需要先设置远程仓库`);
        console.log('请运行以下命令添加远程仓库:');
        console.log(`git remote add origin <your-github-repo-url>`);
        process.chdir(originalCwd);
        return { success: false, error: 'no remote configured' };
      }

      console.log(`推送到 GitHub: ${remoteUrl}`);
      execSync(`git push origin ${project.branch}`, { stdio: 'pipe' });

      process.chdir(originalCwd);

      console.log(`${project.name} 推送成功!`);
      return { success: true, pushed: true, commitMessage };
    } catch (error) {
      console.error(`${project.name} 推送失败:`, error.message);
      process.chdir(originalCwd);
      return { success: false, error: error.message };
    }
  }

  setRemote(remoteUrl) {
    const project = this.config.localProject;
    const originalCwd = process.cwd();
    
    try {
      process.chdir(project.path);

      if (!fs.existsSync('.git')) {
        console.log(`${project.name} 尚未初始化为 Git 仓库`);
        process.chdir(originalCwd);
        return false;
      }

      try {
        const existingRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        if (existingRemote) {
          console.log(`已有远程仓库: ${existingRemote}`);
          console.log(`更新为: ${remoteUrl}`);
          execSync(`git remote set-url origin ${remoteUrl}`, { stdio: 'pipe' });
        }
      } catch (error) {
        console.log(`添加远程仓库: ${remoteUrl}`);
        execSync(`git remote add origin ${remoteUrl}`, { stdio: 'pipe' });
      }

      process.chdir(originalCwd);
      console.log('远程仓库设置成功!');
      return true;
    } catch (error) {
      console.error('设置远程仓库失败:', error.message);
      process.chdir(originalCwd);
      return false;
    }
  }

  analyzeChanges(repo, syncResult) {
    if (!syncResult.updated) {
      return { hasChanges: false, commits: [], files: [] };
    }

    const originalCwd = process.cwd();

    try {
      process.chdir(repo.path);

      const commits = execSync(
        `git log ${syncResult.beforeHash}..${syncResult.afterHash} --oneline`,
        { encoding: 'utf-8' }
      ).trim().split('\n');

      const files = execSync(
        `git diff --name-only ${syncResult.beforeHash} ${syncResult.afterHash}`,
        { encoding: 'utf-8' }
      ).trim().split('\n').filter(f => f);

      const stats = execSync(
        `git diff --stat ${syncResult.beforeHash} ${syncResult.afterHash}`,
        { encoding: 'utf-8' }
      );

      process.chdir(originalCwd);

      return {
        hasChanges: true,
        commits: commits,
        files: files,
        stats: stats,
        beforeHash: syncResult.beforeHash,
        afterHash: syncResult.afterHash
      };
    } catch (error) {
      console.error(`分析 ${repo.name} 变更失败:`, error.message);
      process.chdir(originalCwd);
      return { hasChanges: false, error: error.message };
    }
  }

  shouldUpdateProject(repo, changes) {
    if (!changes.hasChanges) {
      return false;
    }

    console.log(`\n分析 ${repo.name} 的变更:`);
    console.log(`- 变更提交数: ${changes.commits.length}`);
    console.log(`- 变更文件数: ${changes.files.length}`);
    
    const fileTypes = this.categorizeFiles(changes.files);
    console.log(`\n变更文件类型分布:`);
    for (const [type, count] of Object.entries(fileTypes)) {
      console.log(`- ${type}: ${count} 个文件`);
    }

    const hasBreakingChanges = this.checkBreakingChanges(changes);
    if (hasBreakingChanges) {
      console.log(`\n检测到重大变更!`);
      return true;
    }

    const affectsCore = this.checkCoreFunctionality(repo, fileTypes);
    if (affectsCore) {
      console.log(`\n核心功能受到影响，需要更新项目`);
      return true;
    }

    const hasNewFeatures = this.checkNewFeatures(changes);
    if (hasNewFeatures) {
      console.log(`\n检测到新功能，需要更新项目`);
      return true;
    }

    const hasConfigChanges = this.checkConfigChanges(changes);
    if (hasConfigChanges) {
      console.log(`\n检测到配置变更，需要更新项目`);
      return true;
    }

    const threshold = 10;
    if (changes.files.length > threshold) {
      console.log(`\n变更文件数 (${changes.files.length}) 超过阈值 (${threshold})，需要更新项目`);
      return true;
    }

    return false;
  }

  categorizeFiles(files) {
    const categories = {
      '源代码': 0,
      '测试': 0,
      '配置': 0,
      '文档': 0,
      '依赖': 0,
      '其他': 0
    };

    for (const file of files) {
      if (file.match(/\.(js|ts|py|java|cpp|c|go|rs)$/)) {
        categories['源代码']++;
      } else if (file.match(/test|spec|__tests__/i)) {
        categories['测试']++;
      } else if (file.match(/\.(json|yaml|yml|toml|ini|conf)$/)) {
        categories['配置']++;
      } else if (file.match(/\.(md|txt|rst)$/)) {
        categories['文档']++;
      } else if (file.match(/package\.json|requirements\.txt|go\.mod|cargo\.toml|Gemfile/)) {
        categories['依赖']++;
      } else {
        categories['其他']++;
      }
    }

    return categories;
  }

  checkBreakingChanges(changes) {
    const breakingPatterns = [
      /BREAKING/i,
      /breaking[- ]change/i,
      /major[- ]version/i,
      /api[- ]change/i,
      /dropping/i,
      /remove.*deprecated/i
    ];

    for (const commit of changes.commits) {
      for (const pattern of breakingPatterns) {
        if (pattern.test(commit)) {
          return true;
        }
      }
    }

    return false;
  }

  checkCoreFunctionality(repo, fileTypes) {
    const coreFiles = {
      'superpowers': ['skills/', 'agents/', 'commands/', 'hooks/'],
      'hermes-agent': ['agent/', 'gateway/', 'tools/']
    };

    const corePaths = coreFiles[repo.name] || [];
    
    for (const file of fileTypes) {
      for (const corePath of corePaths) {
        if (file.startsWith(corePath)) {
          return true;
        }
      }
    }

    return false;
  }

  checkNewFeatures(changes) {
    const featurePatterns = [
      /feat/i,
      /feature/i,
      /new/i,
      /add/i,
      /implement/i,
      /enhancement/i
    ];

    for (const commit of changes.commits) {
      for (const pattern of featurePatterns) {
        if (pattern.test(commit)) {
          return true;
        }
      }
    }

    return false;
  }

  checkConfigChanges(changes) {
    const configPatterns = [
      /config/i,
      /setting/i,
      /default/i,
      /environment/i,
      /\.env/i
    ];

    for (const file of changes.files) {
      for (const pattern of configPatterns) {
        if (pattern.test(file)) {
          return true;
        }
      }
    }

    return false;
  }

  updateProjectIfNeeded(repo, changes) {
    if (!this.config.autoUpdateProject) {
      console.log('自动更新项目已禁用，跳过更新');
      return false;
    }

    console.log(`\n开始更新 ${repo.name} 相关项目...`);
    
    try {
      const updates = this.determineUpdates(repo, changes);
      
      if (updates.length === 0) {
        console.log('没有需要更新的内容');
        return false;
      }

      console.log(`需要更新以下内容:`);
      for (const update of updates) {
        console.log(`- ${update.type}: ${update.description}`);
      }

      for (const update of updates) {
        this.executeUpdate(update);
      }

      console.log(`\n${repo.name} 项目更新完成!`);
      return true;
    } catch (error) {
      console.error(`更新 ${repo.name} 项目失败:`, error.message);
      return false;
    }
  }

  determineUpdates(repo, changes) {
    const updates = [];

    if (changes.files.some(f => f.match(/\.md$/) || f.match(/docs?\//i))) {
      updates.push({
        type: '文档',
        description: '更新系统设计文档',
        action: 'updateDocs'
      });
    }

    const depPatterns = [
      'package.json',
      'requirements.txt',
      'go.mod',
      'cargo.toml',
      'Gemfile',
      'package-lock.json',
      'yarn.lock',
      'poetry.lock'
    ];
    
    if (changes.files.some(f => depPatterns.includes(path.basename(f)))) {
      updates.push({
        type: '依赖',
        description: '更新项目依赖',
        action: 'updateDeps'
      });
    }

    if (repo.name === 'superpowers' && changes.files.some(f => f.startsWith('skills/'))) {
      updates.push({
        type: '技能',
        description: '同步更新技能定义',
        action: 'updateSkills'
      });
    }

    if (changes.files.some(f => f.match(/\.json$/) && f.match(/config/i))) {
      updates.push({
        type: '配置',
        description: '同步更新配置',
        action: 'updateConfig'
      });
    }

    return updates;
  }

  executeUpdate(update) {
    console.log(`执行更新: ${update.description}`);
    
    switch (update.action) {
      case 'updateDocs':
        console.log('-> 生成更新文档...');
        this.updateDocs();
        break;
      case 'updateDeps':
        console.log('-> 更新项目依赖...');
        this.updateDeps();
        break;
      case 'updateSkills':
        console.log('-> 同步技能定义...');
        this.updateSkills();
        break;
      case 'updateConfig':
        console.log('-> 同步配置文件...');
        this.updateConfig();
        break;
      default:
        console.log(`-> 未知更新操作: ${update.action}`);
    }
  }

  updateDocs() {
    try {
      const { generateDocumentation } = require('./doc_generator');
      if (generateDocumentation) {
        generateDocumentation();
        console.log('文档更新完成');
      }
    } catch (error) {
      console.error('文档更新失败:', error.message);
    }
  }

  updateDeps() {
    console.log('依赖更新需要手动执行');
    console.log('请运行以下命令更新依赖:');
    console.log('- npm install (Node.js)');
    console.log('- pip install -r requirements.txt (Python)');
    console.log('- go mod download (Go)');
  }

  updateSkills() {
    console.log('技能更新需要手动执行');
    console.log('请运行技能同步功能');
  }

  updateConfig() {
    console.log('配置更新需要手动执行');
    console.log('请检查并更新配置文件');
  }

  manualSync() {
    return this.syncAll();
  }

  getSyncStatus() {
    const status = {};
    const originalCwd = process.cwd();
    
    for (const repo of this.config.repos) {
      try {
        process.chdir(repo.path);

        const remoteStatus = execSync('git remote -v', { encoding: 'utf-8' });
        const branchStatus = execSync('git branch -v', { encoding: 'utf-8' });
        const commitStatus = execSync('git log -1', { encoding: 'utf-8' });

        process.chdir(originalCwd);

        status[repo.name] = {
          remote: remoteStatus,
          branch: branchStatus,
          commit: commitStatus,
          lastSync: new Date().toISOString()
        };
      } catch (error) {
        console.error(`获取 ${repo.name} 状态失败:`, error.message);
        process.chdir(originalCwd);
        status[repo.name] = {
          error: error.message,
          lastSync: new Date().toISOString()
        };
      }
    }

    return status;
  }

  getLocalProjectStatus() {
    const project = this.config.localProject;
    const originalCwd = process.cwd();
    
    try {
      process.chdir(project.path);

      if (!fs.existsSync('.git')) {
        process.chdir(originalCwd);
        return {
          isGitRepo: false,
          hasChanges: false,
          lastCommit: null
        };
      }

      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      const hasChanges = !!status.trim();

      let lastCommit = null;
      try {
        lastCommit = execSync('git log -1 --format="%H|%s|%ai"', { encoding: 'utf-8' }).trim();
      } catch (error) {
      }

      let remoteUrl = null;
      try {
        remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
      } catch (error) {
      }

      process.chdir(originalCwd);

      return {
        isGitRepo: true,
        hasChanges,
        lastCommit,
        remoteUrl,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error(`获取 ${project.name} 状态失败:`, error.message);
      process.chdir(originalCwd);
      return {
        isGitRepo: false,
        hasChanges: false,
        error: error.message
      };
    }
  }

  cleanup() {
    this.stopAutoSync();
  }
}

const githubSync = new GitHubSync();
githubSync.init();

module.exports = {
  GitHubSync,
  githubSync,
  startAutoSync: () => githubSync.startAutoSync(),
  stopAutoSync: () => githubSync.stopAutoSync(),
  sync: () => githubSync.syncAll(),
  getSyncStatus: () => githubSync.getSyncStatus(),
  getLocalProjectStatus: () => githubSync.getLocalProjectStatus(),
  setRemote: (url) => githubSync.setRemote(url),
  pushLocalProject: () => githubSync.pushLocalProject()
};