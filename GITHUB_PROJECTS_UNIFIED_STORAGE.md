# GitHub开源项目统一存储结构

## 1. 统一存储结构设计

为了更好地管理和同步GitHub开源项目，我们设计了一个统一的存储结构，将所有开源项目集中存储在一个标准位置。

### 1.1 统一存储目录

```
C:\Users\55237\opensource\
├── hermes/          # Hermes项目
│   ├── agent/       # 主代码库
│   ├── docs/        # 文档
│   └── test/        # 测试代码
├── superpower/      # Lossless Superpower项目
│   ├── src/         # 源代码
│   └── test/        # 测试代码
├── other-projects/  # 其他开源项目
│   ├── project1/
│   └── project2/
└── sync-config.json # 同步配置
```

### 1.2 存储结构说明

| 目录 | 用途 | 描述 |
|-----|-----|------|
| opensource/ | 根目录 | 所有开源项目的统一存储位置 |
| hermes/ | Hermes项目 | Hermes相关代码和文档 |
| superpower/ | Superpower项目 | Lossless Superpower项目 |
| other-projects/ | 其他项目 | 其他GitHub开源项目 |
| sync-config.json | 同步配置 | 项目同步和管理配置 |

## 2. 统一配置文件

### 2.1 同步配置文件 (sync-config.json)

```json
{
  "version": "1.0.0",
  "last_updated": "2026-04-21",
  "base_path": "C:\\Users\\55237\\opensource",
  "projects": [
    {
      "id": "hermes",
      "name": "Hermes Agent",
      "type": "github",
      "repository": "https://github.com/hermes/agent.git",
      "local_path": "hermes/agent",
      "branch": "main",
      "auto_sync": true,
      "last_sync": "2026-04-20",
      "sync_interval": 3600
    },
    {
      "id": "superpower",
      "name": "Lossless Superpower",
      "type": "github",
      "repository": "https://github.com/lossless/superpower.git",
      "local_path": "superpower",
      "branch": "main",
      "auto_sync": true,
      "last_sync": "2026-04-20",
      "sync_interval": 3600
    }
  ],
  "config": {
    "auto_scan": true,
    "scan_interval": 3600,
    "notification_enabled": true,
    "max_concurrent_sync": 3
  },
  "metadata": {
    "created_by": "System",
    "created_at": "2026-04-21",
    "description": "GitHub开源项目同步配置文件"
  }
}
```

### 2.2 项目位置配置文件 (project_locations.json)

```json
{
  "version": "1.0.0",
  "last_updated": "2026-04-21",
  "base_path": "C:\\Users\\55237\\opensource",
  "projects": [
    {
      "id": "hermes",
      "name": "Hermes Agent",
      "path": "C:\\Users\\55237\\opensource\\hermes\\agent",
      "type": "local",
      "description": "Hermes的主要源代码目录",
      "is_git_repo": true,
      "last_scanned": "2026-04-21"
    },
    {
      "id": "superpower",
      "name": "Lossless Superpower",
      "path": "C:\\Users\\55237\\opensource\\superpower",
      "type": "local",
      "description": "Lossless Superpower项目",
      "is_git_repo": true,
      "last_scanned": "2026-04-21"
    }
  ],
  "metadata": {
    "created_by": "System",
    "created_at": "2026-04-21",
    "description": "GitHub开源项目位置配置文件"
  }
}
```

## 3. 同步管理工具

### 3.1 同步管理器 (sync_manager.js)

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SyncManager {
  constructor(configPath = 'sync-config.json') {
    this.configPath = configPath;
    this.config = this._loadConfig();
    this.basePath = this.config.base_path;
  }

  _loadConfig() {
    try {
      const configPath = path.join(this.basePath || process.cwd(), this.configPath);
      const content = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('加载同步配置失败:', error);
      return {
        version: '1.0.0',
        base_path: 'C:\\Users\\55237\\opensource',
        projects: [],
        config: {
          auto_scan: true,
          scan_interval: 3600,
          notification_enabled: true,
          max_concurrent_sync: 3
        }
      };
    }
  }

  _saveConfig() {
    try {
      const configPath = path.join(this.basePath, this.configPath);
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('保存同步配置失败:', error);
      return false;
    }
  }

  async syncAllProjects() {
    console.log('开始同步所有项目...');
    const results = [];
    
    for (const project of this.config.projects) {
      if (project.auto_sync) {
        const result = await this.syncProject(project.id);
        results.push(result);
      }
    }
    
    console.log('所有项目同步完成');
    return results;
  }

  async syncProject(projectId) {
    const project = this.config.projects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, message: `项目 ${projectId} 不存在` };
    }
    
    const projectPath = path.join(this.basePath, project.local_path);
    console.log(`开始同步项目 ${project.name}...`);
    
    try {
      // 检查目录是否存在
      if (!fs.existsSync(projectPath)) {
        // 克隆项目
        console.log(`克隆项目 ${project.name}...`);
        const cloneCommand = `git clone ${project.repository} "${projectPath}"`;
        execSync(cloneCommand, { stdio: 'inherit' });
        console.log(`项目 ${project.name} 克隆成功`);
      } else {
        // 拉取更新
        console.log(`拉取项目 ${project.name} 的更新...`);
        const pullCommand = `cd "${projectPath}" && git pull origin ${project.branch}`;
        execSync(pullCommand, { stdio: 'inherit' });
        console.log(`项目 ${project.name} 拉取成功`);
      }
      
      // 更新同步时间
      project.last_sync = new Date().toISOString().split('T')[0];
      this._saveConfig();
      
      return { success: true, message: `项目 ${project.name} 同步成功` };
    } catch (error) {
      console.error(`项目 ${project.name} 同步失败:`, error);
      return { success: false, message: `项目 ${project.name} 同步失败: ${error.message}` };
    }
  }

  addProject(project) {
    // 验证项目信息
    if (!project.id || !project.name || !project.repository) {
      return { success: false, message: '项目信息不完整' };
    }
    
    // 检查项目是否已存在
    const existingProject = this.config.projects.find(p => p.id === project.id);
    if (existingProject) {
      return { success: false, message: '项目已存在' };
    }
    
    // 添加项目
    const newProject = {
      id: project.id,
      name: project.name,
      type: project.type || 'github',
      repository: project.repository,
      local_path: project.local_path || project.id,
      branch: project.branch || 'main',
      auto_sync: project.auto_sync || true,
      last_sync: null,
      sync_interval: project.sync_interval || 3600
    };
    
    this.config.projects.push(newProject);
    this._saveConfig();
    
    return { success: true, message: `项目 ${project.name} 添加成功` };
  }

  removeProject(projectId) {
    const projectIndex = this.config.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, message: `项目 ${projectId} 不存在` };
    }
    
    const project = this.config.projects[projectIndex];
    const projectPath = path.join(this.basePath, project.local_path);
    
    // 删除本地文件
    if (fs.existsSync(projectPath)) {
      try {
        fs.rmSync(projectPath, { recursive: true, force: true });
        console.log(`项目 ${project.name} 的本地文件已删除`);
      } catch (error) {
        console.error(`删除项目 ${project.name} 的本地文件失败:`, error);
      }
    }
    
    // 从配置中移除项目
    this.config.projects.splice(projectIndex, 1);
    this._saveConfig();
    
    return { success: true, message: `项目 ${project.name} 移除成功` };
  }

  listProjects() {
    return this.config.projects;
  }

  getProject(projectId) {
    return this.config.projects.find(p => p.id === projectId);
  }

  updateProject(projectId, updates) {
    const project = this.config.projects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, message: `项目 ${projectId} 不存在` };
    }
    
    // 更新项目信息
    Object.assign(project, updates);
    this._saveConfig();
    
    return { success: true, message: `项目 ${project.name} 更新成功` };
  }

  ensureDirectories() {
    // 确保基础目录存在
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
      console.log(`创建基础目录: ${this.basePath}`);
    }
    
    // 确保项目目录存在
    for (const project of this.config.projects) {
      const projectPath = path.join(this.basePath, project.local_path);
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
        console.log(`创建项目目录: ${projectPath}`);
      }
    }
  }
}

module.exports = SyncManager;
```

### 3.2 位置管理器 (location_manager.js)

```javascript
const fs = require('fs');
const path = require('path');

class LocationManager {
  constructor(configPath = 'project_locations.json') {
    this.configPath = configPath;
    this.config = this._loadConfig();
    this.basePath = this.config.base_path;
  }

  _loadConfig() {
    try {
      const configPath = path.join(this.basePath || process.cwd(), this.configPath);
      const content = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('加载位置配置失败:', error);
      return {
        version: '1.0.0',
        base_path: 'C:\\Users\\55237\\opensource',
        projects: [],
        metadata: {
          created_by: 'System',
          created_at: new Date().toISOString(),
          description: 'GitHub开源项目位置配置文件'
        }
      };
    }
  }

  _saveConfig() {
    try {
      const configPath = path.join(this.basePath, this.configPath);
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('保存位置配置失败:', error);
      return false;
    }
  }

  updateProjectLocations() {
    console.log('更新项目位置信息...');
    
    // 扫描基础目录
    if (fs.existsSync(this.basePath)) {
      const entries = fs.readdirSync(this.basePath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(this.basePath, entry.name);
          this._updateProjectLocation(entry.name, projectPath);
        }
      }
    }
    
    this.config.last_updated = new Date().toISOString().split('T')[0];
    this._saveConfig();
    console.log('项目位置信息更新完成');
  }

  _updateProjectLocation(projectId, projectPath) {
    // 检查是否是Git仓库
    const isGitRepo = fs.existsSync(path.join(projectPath, '.git'));
    
    // 检查项目是否已存在
    let project = this.config.projects.find(p => p.id === projectId);
    
    if (project) {
      // 更新现有项目
      project.path = projectPath;
      project.is_git_repo = isGitRepo;
      project.last_scanned = new Date().toISOString().split('T')[0];
    } else {
      // 添加新项目
      project = {
        id: projectId,
        name: projectId.charAt(0).toUpperCase() + projectId.slice(1),
        path: projectPath,
        type: 'local',
        description: `${projectId}项目目录`,
        is_git_repo: isGitRepo,
        last_scanned: new Date().toISOString().split('T')[0]
      };
      this.config.projects.push(project);
    }
  }

  getProjectLocation(projectId) {
    return this.config.projects.find(p => p.id === projectId);
  }

  listProjectLocations() {
    return this.config.projects;
  }

  removeProjectLocation(projectId) {
    const projectIndex = this.config.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, message: `项目 ${projectId} 不存在` };
    }
    
    this.config.projects.splice(projectIndex, 1);
    this._saveConfig();
    
    return { success: true, message: `项目 ${projectId} 位置信息移除成功` };
  }

  getBasePath() {
    return this.basePath;
  }

  setBasePath(basePath) {
    this.basePath = basePath;
    this.config.base_path = basePath;
    this._saveConfig();
    return { success: true, message: `基础路径更新为 ${basePath}` };
  }
}

module.exports = LocationManager;
```

## 4. 命令行工具

### 4.1 同步命令 (sync-github.js)

```javascript
#!/usr/bin/env node

const SyncManager = require('./sync_manager');
const LocationManager = require('./location_manager');

class SyncCommand {
  constructor() {
    this.syncManager = new SyncManager();
    this.locationManager = new LocationManager();
  }

  async execute(args) {
    const command = args[0];
    
    switch (command) {
      case 'sync':
        await this.sync(args.slice(1));
        break;
      case 'add':
        this.add(args.slice(1));
        break;
      case 'remove':
        this.remove(args.slice(1));
        break;
      case 'list':
        this.list();
        break;
      case 'update':
        this.update(args.slice(1));
        break;
      case 'locations':
        this.locations();
        break;
      case 'init':
        this.init();
        break;
      default:
        this.help();
        break;
    }
  }

  async sync(args) {
    if (args.length === 0) {
      // 同步所有项目
      await this.syncManager.syncAllProjects();
    } else {
      // 同步指定项目
      const projectId = args[0];
      await this.syncManager.syncProject(projectId);
    }
    
    // 更新位置信息
    this.locationManager.updateProjectLocations();
  }

  add(args) {
    if (args.length < 3) {
      console.log('用法: sync-github add <id> <name> <repository> [local_path]');
      return;
    }
    
    const [id, name, repository, localPath] = args;
    const result = this.syncManager.addProject({
      id,
      name,
      repository,
      local_path: localPath || id
    });
    
    console.log(result.message);
  }

  remove(args) {
    if (args.length === 0) {
      console.log('用法: sync-github remove <id>');
      return;
    }
    
    const projectId = args[0];
    const result = this.syncManager.removeProject(projectId);
    console.log(result.message);
  }

  list() {
    const projects = this.syncManager.listProjects();
    console.log('项目列表:');
    projects.forEach(project => {
      console.log(`- ${project.id}: ${project.name} (${project.repository})`);
      console.log(`  本地路径: ${path.join(this.syncManager.basePath, project.local_path)}`);
      console.log(`  最后同步: ${project.last_sync || '从未'}`);
      console.log(`  自动同步: ${project.auto_sync ? '是' : '否'}`);
      console.log('');
    });
  }

  update(args) {
    if (args.length < 2) {
      console.log('用法: sync-github update <id> <key> <value>');
      return;
    }
    
    const [id, key, ...valueParts] = args;
    const value = valueParts.join(' ');
    
    const updates = {};
    updates[key] = this._parseValue(value);
    
    const result = this.syncManager.updateProject(id, updates);
    console.log(result.message);
  }

  locations() {
    this.locationManager.updateProjectLocations();
    const locations = this.locationManager.listProjectLocations();
    console.log('项目位置信息:');
    locations.forEach(location => {
      console.log(`- ${location.id}: ${location.name}`);
      console.log(`  路径: ${location.path}`);
      console.log(`  Git仓库: ${location.is_git_repo ? '是' : '否'}`);
      console.log(`  最后扫描: ${location.last_scanned}`);
      console.log('');
    });
  }

  init() {
    console.log('初始化GitHub项目同步...');
    
    // 确保目录结构
    this.syncManager.ensureDirectories();
    
    // 更新位置信息
    this.locationManager.updateProjectLocations();
    
    console.log('初始化完成');
  }

  help() {
    console.log('GitHub项目同步工具');
    console.log('用法: sync-github <command> [arguments]');
    console.log('');
    console.log('命令:');
    console.log('  sync [project-id]    同步所有项目或指定项目');
    console.log('  add <id> <name> <repo> [path]  添加新项目');
    console.log('  remove <id>         移除项目');
    console.log('  list                列出所有项目');
    console.log('  update <id> <key> <value>  更新项目信息');
    console.log('  locations           显示项目位置信息');
    console.log('  init                初始化同步环境');
    console.log('  help                显示帮助信息');
  }

  _parseValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value)) return Number(value);
    return value;
  }
}

// 执行命令
const syncCommand = new SyncCommand();
syncCommand.execute(process.argv.slice(2));
```

## 5. 集成到系统

### 5.1 系统初始化

```javascript
// 在系统初始化时启动同步管理器
const SyncManager = require('./sync_manager');
const syncManager = new SyncManager();

// 确保目录结构
syncManager.ensureDirectories();

// 自动同步所有项目
syncManager.syncAllProjects().then(results => {
  console.log('项目同步完成:', results);
});

// 更新位置信息
const LocationManager = require('./location_manager');
const locationManager = new LocationManager();
locationManager.updateProjectLocations();
```

### 5.2 环境变量

| 环境变量 | 描述 | 默认值 |
|---------|------|-------|
| GITHUB_SYNC_BASE_PATH | GitHub项目基础路径 | C:\Users\55237\opensource |
| GITHUB_SYNC_AUTO_SYNC | 是否自动同步 | true |
| GITHUB_SYNC_INTERVAL | 同步间隔(秒) | 3600 |

## 6. 最佳实践

### 6.1 项目管理

1. **统一命名**：使用一致的项目ID和命名规范
2. **定期同步**：设置合理的同步间隔，确保代码保持最新
3. **分支管理**：为每个项目指定合适的分支
4. **权限管理**：确保有适当的Git权限

### 6.2 存储管理

1. **空间监控**：定期检查存储空间使用情况
2. **备份策略**：定期备份重要项目
3. **清理策略**：定期清理不需要的项目和分支
4. **安全管理**：确保存储位置的安全性

### 6.3 同步策略

1. **增量同步**：使用Git的增量同步特性
2. **批量同步**：合理安排同步时间，避免网络拥塞
3. **错误处理**：妥善处理同步错误和冲突
4. **日志记录**：记录同步过程和结果

## 7. 迁移策略

### 7.1 从现有位置迁移

1. **备份现有代码**：确保现有代码的安全
2. **创建新目录结构**：按照新的存储结构创建目录
3. **复制或克隆项目**：将现有项目移动或重新克隆到新位置
4. **更新配置**：更新同步和位置配置文件
5. **验证功能**：确保所有功能正常工作

### 7.2 迁移步骤

1. **准备阶段**：
   - 备份现有项目
   - 创建新的基础目录
   - 配置同步工具

2. **执行阶段**：
   - 对于Git仓库：重新克隆到新位置
   - 对于非Git项目：复制到新位置
   - 更新配置文件

3. **验证阶段**：
   - 测试项目功能
   - 验证同步功能
   - 确认所有项目正常工作

## 8. 总结

通过统一的GitHub开源项目存储结构，我们可以：

1. **集中管理**：所有开源项目集中存储，便于管理
2. **自动同步**：定期自动同步项目，确保代码最新
3. **统一配置**：使用统一的配置文件管理项目
4. **易于扩展**：方便添加新的开源项目
5. **提高效率**：减少手动管理的工作量

这种统一的存储结构不仅提高了项目管理的效率，也为后续的自动化工具和集成提供了基础。