/**
 * 文档生成器模块
 * 自动从代码中提取信息并生成技术设计文档
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocGenerator {
  constructor(config = {}) {
    this.config = {
      // 代码目录
      codeDir: './src',
      // 输出文档路径
      outputPath: './SYSTEM_DESIGN.md',
      // 监控的文件扩展名
      watchExtensions: ['.js', '.json', '.md'],
      // 监控的目录
      watchDirs: ['src', 'plugins', 'skills'],
      // 忽略的目录
      ignoreDirs: ['node_modules', 'dist', 'logs'],
      // 文档模板
      template: 'default',
      // 自动更新间隔（毫秒）
      autoUpdateInterval: 3600000, // 1小时
      // 是否启用监控
      enableWatch: true,
      ...config
    };

    this.lastUpdateTime = 0;
    this.fileModificationTimes = new Map();
    this.watchInterval = null;
  }

  /**
   * 初始化文档生成器
   */
  init() {
    console.log('文档生成器初始化...');
    
    // 初始化文件修改时间记录
    this._initializeFileModificationTimes();
    
    // 生成初始文档
    this.generateDocumentation();
    
    // 启动监控
    if (this.config.enableWatch) {
      this.startWatching();
    }
    
    console.log('文档生成器初始化完成');
  }

  /**
   * 生成技术设计文档
   */
  generateDocumentation() {
    console.log('开始生成技术设计文档...');
    
    try {
      // 提取系统信息
      const systemInfo = this._extractSystemInfo();
      
      // 生成文档内容
      const docContent = this._generateDocContent(systemInfo);
      
      // 写入文档文件
      fs.writeFileSync(this.config.outputPath, docContent, 'utf-8');
      
      this.lastUpdateTime = Date.now();
      console.log(`技术设计文档生成成功: ${this.config.outputPath}`);
      return true;
    } catch (error) {
      console.error('生成技术设计文档失败:', error.message);
      return false;
    }
  }

  /**
   * 开始监控文件变化
   */
  startWatching() {
    console.log('开始监控文件变化...');
    
    this.watchInterval = setInterval(() => {
      if (this._hasFilesChanged()) {
        console.log('检测到文件变化，更新技术设计文档...');
        this.generateDocumentation();
      }
    }, this.config.autoUpdateInterval);
  }

  /**
   * 停止监控
   */
  stopWatching() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
      console.log('停止监控文件变化');
    }
  }

  /**
   * 提取系统信息
   */
  _extractSystemInfo() {
    const systemInfo = {
      modules: this._extractModules(),
      api: this._extractAPI(),
      config: this._extractConfig(),
      structure: this._extractStructure(),
      dependencies: this._extractDependencies(),
      dataStructures: this._extractDataStructures()
    };

    return systemInfo;
  }

  /**
   * 提取模块信息
   */
  _extractModules() {
    const modules = [];
    const modulesDir = path.join(this.config.codeDir, 'superpowers');
    
    if (fs.existsSync(modulesDir)) {
      const files = fs.readdirSync(modulesDir);
      
      files.forEach(file => {
        const filePath = path.join(modulesDir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
          const moduleName = path.basename(file, '.js');
          const content = fs.readFileSync(filePath, 'utf-8');
          
          modules.push({
            name: moduleName,
            path: filePath,
            content: content,
            functions: this._extractFunctions(content),
            classes: this._extractClasses(content)
          });
        }
      });
    }
    
    return modules;
  }

  /**
   * 提取API信息
   */
  _extractAPI() {
    const api = [];
    const apiDir = path.join(this.config.codeDir, 'api');
    
    if (fs.existsSync(apiDir)) {
      const files = fs.readdirSync(apiDir);
      
      files.forEach(file => {
        const filePath = path.join(apiDir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          api.push({
            name: path.basename(file, '.js'),
            path: filePath,
            content: content
          });
        }
      });
    }
    
    return api;
  }

  /**
   * 提取配置信息
   */
  _extractConfig() {
    const config = {};
    
    // 从index.js提取默认配置
    const indexPath = path.join(this.config.codeDir, 'index.js');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const configMatch = content.match(/defaultConfig[\s\S]*?\{([\s\S]*?)\}/);
      if (configMatch) {
        config.defaultConfig = configMatch[1];
      }
    }
    
    // 从config.json提取配置
    const configPath = './config.json';
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      config.userConfig = JSON.parse(content);
    }
    
    return config;
  }

  /**
   * 提取系统结构
   */
  _extractStructure() {
    const structure = {
      directories: [],
      files: []
    };
    
    this._traverseDirectory('.', structure);
    return structure;
  }

  /**
   * 提取依赖关系
   */
  _extractDependencies() {
    const dependencies = {};
    
    // 从package.json提取依赖
    const packagePath = './package.json';
    if (fs.existsSync(packagePath)) {
      const content = fs.readFileSync(packagePath, 'utf-8');
      const packageData = JSON.parse(content);
      dependencies.npm = packageData.dependencies || {};
      dependencies.devDependencies = packageData.devDependencies || {};
    }
    
    // 提取模块间依赖
    dependencies.modules = this._extractModuleDependencies();
    
    return dependencies;
  }

  /**
   * 提取数据结构
   */
  _extractDataStructures() {
    const dataStructures = [];
    
    // 从代码中提取数据结构定义
    const modules = this._extractModules();
    modules.forEach(module => {
      const structures = this._extractStructuresFromContent(module.content);
      if (structures.length > 0) {
        dataStructures.push({
          module: module.name,
          structures: structures
        });
      }
    });
    
    return dataStructures;
  }

  /**
   * 从内容中提取函数
   */
  _extractFunctions(content) {
    const functions = [];
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)|([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*\(([^)]*)\)\s*=>/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      functions.push({
        name: match[1] || match[3],
        parameters: match[2] || match[4]
      });
    }
    
    return functions;
  }

  /**
   * 从内容中提取类
   */
  _extractClasses(content) {
    const classes = [];
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*)?\{/g;
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      classes.push({
        name: match[1],
        extends: match[3]
      });
    }
    
    return classes;
  }

  /**
   * 遍历目录
   */
  _traverseDirectory(dir, structure) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // 跳过忽略的目录
        if (!this.config.ignoreDirs.includes(file)) {
          structure.directories.push(filePath);
          this._traverseDirectory(filePath, structure);
        }
      } else {
        // 只包含指定扩展名的文件
        if (this.config.watchExtensions.some(ext => file.endsWith(ext))) {
          structure.files.push(filePath);
        }
      }
    });
  }

  /**
   * 提取模块间依赖
   */
  _extractModuleDependencies() {
    const dependencies = {};
    const modules = this._extractModules();
    
    modules.forEach(module => {
      const requires = [];
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
      let match;
      
      while ((match = requireRegex.exec(module.content)) !== null) {
        requires.push(match[1]);
      }
      
      if (requires.length > 0) {
        dependencies[module.name] = requires;
      }
    });
    
    return dependencies;
  }

  /**
   * 从内容中提取数据结构
   */
  _extractStructuresFromContent(content) {
    const structures = [];
    
    // 提取对象字面量
    const objectRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\{([\s\S]*?)\};|let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\{([\s\S]*?)\};/g;
    let match;
    
    while ((match = objectRegex.exec(content)) !== null) {
      structures.push({
        name: match[1] || match[3],
        type: 'object',
        content: match[2] || match[4]
      });
    }
    
    return structures;
  }

  /**
   * 生成文档内容
   */
  _generateDocContent(systemInfo) {
    let content = '# Lossless Superpower JavaScript Version 系统设计文档\n\n';
    
    // 系统概述
    content += this._generateSystemOverview();
    
    // 系统架构
    content += this._generateSystemArchitecture(systemInfo);
    
    // 核心模块设计
    content += this._generateCoreModules(systemInfo);
    
    // 功能模块设计
    content += this._generateFeatureModules(systemInfo);
    
    // 集成模块设计
    content += this._generateIntegrationModules(systemInfo);
    
    // 数据流设计
    content += this._generateDataFlow(systemInfo);
    
    // 数据结构设计
    content += this._generateDataStructures(systemInfo);
    
    // API设计
    content += this._generateAPI(systemInfo);
    
    // 部署与配置
    content += this._generateDeployment(systemInfo);
    
    // 监控与维护
    content += this._generateMonitoring();
    
    // 安全考虑
    content += this._generateSecurity();
    
    // 未来规划
    content += this._generateFuturePlan();
    
    // 结论
    content += this._generateConclusion();
    
    // 更新信息
    content += '\n---\n\n**文档版本**: 1.0.0  \n**最后更新**: ' + new Date().toISOString() + '  \n**生成工具**: DocGenerator';
    
    return content;
  }

  /**
   * 生成系统概述
   */
  _generateSystemOverview() {
    return '## 1. 系统概述\n\nLossless Superpower JavaScript Version 是一个 AI Agent Meta-capabilities Framework，旨在提供强大的元能力和自我进化能力，使AI代理能够自主学习、优化和执行任务。\n\n### 1.1 核心价值\n\n- **自我进化**：系统能够根据用户反馈和执行结果自动优化自身能力\n- **技能管理**：支持技能的发现、生成、优化和管理\n- **任务跟踪**：自动记录和管理所有任务执行\n- **迭代记录**：自动检测和记录系统变更，建立变更历史\n- **知识管理**：构建和维护知识图谱，支持智能决策\n- **插件扩展**：通过插件系统支持功能扩展\n- **多系统集成**：支持与飞书、GitHub等外部系统集成\n\n### 1.2 技术栈\n\n- 运行时：Node.js 14.0+\n- 开发语言：JavaScript\n- 存储：文件系统（JSON格式）\n- 通信：事件驱动架构\n- 外部集成：HTTP/HTTPS API\n\n';
  }

  /**
   * 生成系统架构
   */
  _generateSystemArchitecture(systemInfo) {
    let content = '## 2. 系统架构\n\n### 2.1 整体架构\n\n```mermaid\nflowchart TD\n    subgraph 核心层\n        Core[核心功能模块]\n        Storage[存储管理]\n        Memory[永久记忆系统]\n        Events[事件系统]\n    end\n    \n    subgraph 功能层\n        SelfEvolution[自我进化系统]\n        SkillSystem[技能系统]\n        TaskTracker[任务跟踪系统]\n        AutoRecorder[自动记录系统]\n        Performance[性能优化系统]\n    end\n    \n    subgraph 集成层\n        PluginSystem[插件系统]\n        Feishu[飞书集成]\n        GitHub[GitHub同步]\n        API[API服务]\n    end\n    \n    Core --> Storage\n    Core --> Memory\n    Core --> Events\n    \n    SelfEvolution --> Core\n    SkillSystem --> Core\n    TaskTracker --> Core\n    AutoRecorder --> Core\n    Performance --> Core\n    \n    PluginSystem --> Core\n    Feishu --> Core\n    GitHub --> Core\n    API --> Core\n```\n\n### 2.2 模块依赖关系\n\n| 模块 | 主要职责 | 依赖模块 | 实现文件 |\n|------|---------|----------|----------|\n';
    
    // 生成模块依赖表
    systemInfo.modules.forEach(module => {
      const dependencies = systemInfo.dependencies.modules[module.name] || [];
      content += '| ' + module.name + ' | 核心功能 | ' + dependencies.join(', ') + ' | ' + module.path + ' |\n';
    });
    
    content += '\n';
    return content;
  }

  /**
   * 生成核心模块设计
   */
  _generateCoreModules(systemInfo) {
    let content = '## 3. 核心模块设计\n\n';
    
    // 生成核心模块文档
    systemInfo.modules.forEach(module => {
      if (['storage_manager', 'permanent_memory', 'events', 'index'].includes(module.name)) {
        content += '### 3.' + (systemInfo.modules.indexOf(module) + 1) + ' ' + module.name + ' 模块 (' + module.path + ')\n\n';
        content += '#### 底层实现：\n';
        content += '- 核心功能模块\n';
        content += '\n';
        
        if (module.functions.length > 0) {
          content += '#### 关键函数：\n';
          module.functions.forEach(func => {
            content += '- **' + func.name + '(' + func.parameters + ')**\n';
          });
          content += '\n';
        }
        
        if (module.classes.length > 0) {
          content += '#### 核心类：\n';
          module.classes.forEach(cls => {
            content += '- **' + cls.name + '**' + (cls.extends ? ' extends ' + cls.extends : '') + '\n';
          });
          content += '\n';
        }
      }
    });
    
    return content;
  }

  /**
   * 生成功能模块设计
   */
  _generateFeatureModules(systemInfo) {
    let content = '## 4. 功能模块设计\n\n';
    
    // 生成功能模块文档
    systemInfo.modules.forEach(module => {
      if (['self_evolution', 'skill_manager', 'task_tracker', 'auto_task_recorder', 'auto_iteration_recorder', 'performance_optimizer'].includes(module.name)) {
        content += '### 4.' + (systemInfo.modules.indexOf(module) + 1) + ' ' + module.name + ' 模块 (' + module.path + ')\n\n';
        content += '#### 底层实现：\n';
        content += '- 功能模块\n';
        content += '\n';
        
        if (module.functions.length > 0) {
          content += '#### 关键函数：\n';
          module.functions.forEach(func => {
            content += '- **' + func.name + '(' + func.parameters + ')**\n';
          });
          content += '\n';
        }
      }
    });
    
    return content;
  }

  /**
   * 生成集成模块设计
   */
  _generateIntegrationModules(systemInfo) {
    let content = '## 5. 集成模块设计\n\n';
    
    // 生成集成模块文档
    systemInfo.modules.forEach(module => {
      if (['plugin_system', 'feishu_tools', 'github_sync'].includes(module.name)) {
        content += '### 5.' + (systemInfo.modules.indexOf(module) + 1) + ' ' + module.name + ' 模块 (' + module.path + ')\n\n';
        content += '#### 底层实现：\n';
        content += '- 集成模块\n';
        content += '\n';
        
        if (module.functions.length > 0) {
          content += '#### 关键函数：\n';
          module.functions.forEach(func => {
            content += '- **' + func.name + '(' + func.parameters + ')**\n';
          });
          content += '\n';
        }
      }
    });
    
    return content;
  }

  /**
   * 生成数据流设计
   */
  _generateDataFlow(systemInfo) {
    return '## 6. 数据流设计\n\n### 6.1 任务执行数据流\n\n```mermaid\nsequenceDiagram\n    participant Client as 客户端\n    participant Core as 核心功能\n    participant TaskTracker as 任务跟踪系统\n    participant AutoRecorder as 自动记录系统\n    participant Storage as 存储管理\n    participant Events as 事件系统\n    \n    Client->>Core: 执行任务\n    Core->>TaskTracker: startTask()\n    TaskTracker->>Storage: saveData()\n    TaskTracker->>Events: trigger(\'task_started\')\n    TaskTracker-->>Core: 返回任务信息\n    Core->>AutoRecorder: recordTask()\n    AutoRecorder->>Storage: saveData()\n    Core-->>Client: 返回任务结果\n    TaskTracker->>TaskTracker: completeTask()\n    TaskTracker->>Storage: saveData()\n    TaskTracker->>Events: trigger(\'task_completed\')\n```\n\n### 6.2 迭代记录数据流\n\n```mermaid\nsequenceDiagram\n    participant FileSystem as 文件系统\n    participant AutoIteration as 自动迭代记录器\n    participant TaskTracker as 任务跟踪系统\n    participant IterationManager as 迭代管理器\n    participant Storage as 存储管理\n    participant Events as 事件系统\n    \n    FileSystem->>AutoIteration: 文件变更事件\n    AutoIteration->>AutoIteration: _checkForChanges()\n    AutoIteration->>AutoIteration: _hasMeaningfulChanges()\n    AutoIteration->>TaskTracker: _getRecentTasks()\n    TaskTracker-->>AutoIteration: 返回最近任务列表\n    AutoIteration->>IterationManager: createIteration()\n    IterationManager->>Storage: saveData()\n    IterationManager->>Events: trigger(\'iteration_created\')\n    IterationManager-->>AutoIteration: 返回迭代信息\n    AutoIteration-->>FileSystem: 确认变更处理\n```\n\n';
  }

  /**
   * 生成数据结构设计
   */
  _generateDataStructures(systemInfo) {
    let content = '## 7. 数据结构设计\n\n';
    
    // 生成数据结构文档
    systemInfo.dataStructures.forEach(item => {
      content += '### 7.' + (systemInfo.dataStructures.indexOf(item) + 1) + ' ' + item.module + ' 数据结构\n\n';
      item.structures.forEach(structure => {
        content += '#### ' + structure.name + '\n\n';
        content += '```json\n';
        content += '{' + structure.content + '}';
        content += '\n```\n\n';
      });
    });
    
    return content;
  }

  /**
   * 生成API设计
   */
  _generateAPI(systemInfo) {
    let content = '## 8. API设计\n\n### 8.1 核心API\n\n| API路径 | 方法 | 功能 | 请求体 | 响应 | 实现文件 |\n|---------|------|------|--------|------|----------|\n| /api/init | POST | 初始化系统 | {"config": {...}} | {"success": true, "message": "系统初始化成功"} | src/api/server.js |\n| /api/cleanup | POST | 清理系统 | N/A | {"success": true, "message": "系统清理完成"} | src/api/server.js |\n| /api/status | GET | 获取系统状态 | N/A | {"status": "running", "version": "2.0.0"} | src/api/server.js |\n| /api/charter | GET | 获取系统宪章 | N/A | {"charter": "..."} | src/api/server.js |\n\n';
    
    return content;
  }

  /**
   * 生成部署与配置
   */
  _generateDeployment(systemInfo) {
    let content = '## 9. 部署与配置\n\n### 9.1 系统要求\n\n- **操作系统**：Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+, CentOS 7+)\n- **Node.js**：14.0+ (推荐 16.0+)\n- **npm**：6.0+ (推荐 8.0+)\n- **内存**：至少 1GB (推荐 2GB+)\n- **磁盘空间**：至少 10GB (推荐 20GB+)\n- **网络**：需要互联网连接（用于GitHub同步和飞书集成）\n\n### 9.2 安装与配置\n\n1. **克隆仓库**\n   ```bash\n   git clone <repository-url>\n   cd Lossless-Superpower-JS\n   ```\n\n2. **安装依赖**\n   ```bash\n   npm install\n   ```\n\n3. **配置系统**\n   创建 `config.json` 文件：\n   ```json\n   {\n     "pluginsDir": "./plugins",\n     "skillsDir": "./skills",\n     "memoryDir": "./memory",\n     "storageDir": "./storage",\n     "debug": false,\n     "enableAutoTaskRecording": true,\n     "enableAutoIterationRecording": true,\n     "autoIterationConfig": {\n       "environment": "development"\n     }\n   }\n   ```\n\n4. **启动系统**\n   ```bash\n   node src/index.js\n   ```\n\n';
    
    return content;
  }

  /**
   * 生成监控与维护
   */
  _generateMonitoring() {
    return '## 10. 监控与维护\n\n### 10.1 日志系统\n\n**底层实现**：\n- **日志级别**：debug, info, warn, error, fatal\n- **日志输出**：标准输出和文件输出\n- **日志格式**：JSON格式，包含时间戳、级别、消息、上下文\n- **日志轮转**：按日期和大小自动轮转\n\n### 10.2 健康检查\n\n**API接口**：\n- 路径：/api/health\n- 方法：GET\n- 响应：{"status": "healthy", "timestamp": 1234567890, "components": {...}}\n\n### 10.3 性能监控\n\n**监控指标**：\n- **系统指标**：CPU使用率、内存使用情况、磁盘空间、网络流量\n- **应用指标**：API响应时间、任务执行时间、请求量、错误率\n- **业务指标**：任务成功率、迭代频率、技能使用率\n\n';
  }

  /**
   * 生成安全考虑
   */
  _generateSecurity() {
    return '## 11. 安全考虑\n\n### 11.1 安全措施\n\n**底层实现**：\n\n1. **输入验证**：\n   - 使用正则表达式验证输入格式\n   - 对所有用户输入进行类型检查\n   - 限制输入长度和格式\n   - 防止SQL注入、XSS等攻击\n\n2. **权限控制**：\n   - 基于角色的访问控制（RBAC）\n   - API密钥认证机制\n   - 请求签名验证\n   - 访问控制列表（ACL）\n\n3. **数据加密**：\n   - 敏感配置使用环境变量存储\n   - API密钥和令牌使用加密存储\n   - 传输数据使用HTTPS加密\n   - 敏感数据使用AES-256加密存储\n\n';
  }

  /**
   * 生成未来规划
   */
  _generateFuturePlan() {
    return '## 12. 未来规划\n\n### 12.1 功能增强\n\n**具体实现计划**：\n\n1. **多语言支持**：\n   - 实现语言适配器层，支持Python、Java等语言\n   - 开发语言转换工具，实现技能跨语言调用\n   - 建立多语言技能库，支持不同语言的技能\n\n2. **云服务集成**：\n   - 开发云服务适配器，支持AWS、Azure、GCP等\n   - 实现云存储集成，支持S3、Blob Storage等\n   - 集成云函数服务，支持Serverless部署\n\n3. **机器学习增强**：\n   - 集成TensorFlow、PyTorch等机器学习框架\n   - 开发机器学习模型训练和部署工具\n   - 实现智能任务调度和资源分配\n\n';
  }

  /**
   * 生成结论
   */
  _generateConclusion() {
    return '## 13. 结论\n\nLossless Superpower JavaScript Version 是一个功能强大、架构清晰的AI Agent Meta-capabilities Framework。系统通过模块化设计和丰富的功能，为AI代理提供了自我进化、技能管理、任务跟踪等核心能力。\n\n系统的设计考虑了可扩展性、可维护性和安全性，为未来的功能增强和性能优化奠定了基础。通过不断的迭代和改进，系统将能够更好地满足用户的需求，为AI代理的发展提供强大的支持。\n\n';
  }

  /**
   * 初始化文件修改时间记录
   */
  _initializeFileModificationTimes() {
    const structure = { directories: [], files: [] };
    this._traverseDirectory('.', structure);
    
    structure.files.forEach(file => {
      const stats = fs.statSync(file);
      this.fileModificationTimes.set(file, stats.mtime.getTime());
    });
  }

  /**
   * 检查文件是否变化
   */
  _hasFilesChanged() {
    let hasChanged = false;
    const structure = { directories: [], files: [] };
    this._traverseDirectory('.', structure);
    
    structure.files.forEach(file => {
      try {
        const stats = fs.statSync(file);
        const currentMtime = stats.mtime.getTime();
        const lastMtime = this.fileModificationTimes.get(file) || 0;
        
        if (currentMtime > lastMtime) {
          hasChanged = true;
          this.fileModificationTimes.set(file, currentMtime);
        }
      } catch (error) {
        // 文件可能已被删除，忽略
      }
    });
    
    return hasChanged;
  }
}

// 导出文档生成器
module.exports = {
  DocGenerator,
  docGenerator: new DocGenerator()
};

// 主程序入口
if (require.main === module) {
  const docGenerator = new DocGenerator();
  docGenerator.init();
}
