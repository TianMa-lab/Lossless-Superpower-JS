/**
 * 插件系统模块 - 标准化版本
 * 支持trae CN插件生态系统
 */

const fs = require('fs');
const path = require('path');
const { eventManager } = require('./events');

class PluginSystem {
  /**
   * 初始化插件系统
   * @param {string} pluginsDir - 插件目录
   */
  constructor(pluginsDir = './plugins') {
    // 使用绝对路径，避免相对路径问题
    this.pluginsDir = path.resolve(pluginsDir);
    this.plugins = {};
    this.pluginEvents = {};
    this.eventQueue = [];
    this.eventProcessing = false;
    this.manifestSchema = this._getManifestSchema();
    this._ensurePluginsDir();
    this._loadPlugins();
    this._startEventProcessor();
  }

  /**
   * 获取插件清单模式
   */
  _getManifestSchema() {
    return {
      required: ['name', 'version', 'description', 'main'],
      optional: ['author', 'dependencies', 'keywords', 'config', 'permissions', 'events']
    };
  }

  /**
   * 确保插件目录存在
   */
  _ensurePluginsDir() {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
    }
  }

  /**
   * 启动事件处理器
   */
  _startEventProcessor() {
    this._processEvents();
  }

  /**
   * 处理事件队列中的事件
   */
  async _processEvents() {
    if (this.eventProcessing) return;
    
    this.eventProcessing = true;
    
    while (this.eventQueue.length > 0) {
      try {
        // 按优先级排序
        this.eventQueue.sort((a, b) => a.priority - b.priority);
        
        // 取出第一个事件
        const event = this.eventQueue.shift();
        const { eventName, data, source, priority } = event;
        
        console.log(`处理事件: ${eventName} (优先级: ${priority}, 来源: ${source})`);
        
        // 通知所有订阅该事件的插件
        let successCount = 0;
        let errorCount = 0;
        
        for (const pluginName in this.plugins) {
          if (pluginName !== source) {
            const plugin = this.plugins[pluginName];
            if (plugin.module && typeof plugin.module.onEvent === 'function') {
              try {
                await plugin.module.onEvent(eventName, data, source);
                successCount++;
              } catch (error) {
                errorCount++;
                console.error(`插件 ${pluginName} 处理事件 ${eventName} 失败: ${error.message}`);
              }
            }
          }
        }
        
        console.log(`事件 ${eventName} 处理完成: 成功 ${successCount}, 失败 ${errorCount}`);
        
      } catch (error) {
        console.error(`处理事件时发生错误: ${error.message}`);
      }
    }
    
    this.eventProcessing = false;
  }

  /**
   * 验证插件清单
   */
  _validateManifest(manifest, pluginName) {
    const missing = this.manifestSchema.required.filter(field => !manifest[field]);
    if (missing.length > 0) {
      console.error(`插件 ${pluginName} 缺少必要字段: ${missing.join(', ')}`);
      return false;
    }
    
    // 验证版本格式
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      console.error(`插件 ${pluginName} 版本格式错误: ${manifest.version}`);
      return false;
    }
    
    return true;
  }

  /**
   * 加载所有插件
   */
  _loadPlugins() {
    if (!fs.existsSync(this.pluginsDir)) {
      return;
    }
    
    // 先收集所有插件信息
    const pluginInfos = [];
    const pluginNames = fs.readdirSync(this.pluginsDir);
    
    for (const pluginName of pluginNames) {
      const pluginPath = path.join(this.pluginsDir, pluginName);
      if (fs.statSync(pluginPath).isDirectory()) {
        const manifestFile = path.join(pluginPath, 'manifest.json');
        if (fs.existsSync(manifestFile)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
            if (this._validateManifest(manifest, pluginName)) {
              pluginInfos.push({ pluginName, pluginPath, manifest });
            }
          } catch (error) {
            console.error(`加载插件 ${pluginName} 失败: ${error.message}`);
          }
        } else {
          console.error(`插件 ${pluginName} 缺少 manifest.json 文件`);
        }
      }
    }
    
    // 按依赖顺序加载插件
    this._loadPluginsByDependency(pluginInfos);
  }

  /**
   * 按依赖顺序加载插件
   * @param {Array} pluginInfos - 插件信息数组
   */
  _loadPluginsByDependency(pluginInfos) {
    // 构建依赖图
    const dependencyGraph = {};
    for (const { pluginName, pluginPath, manifest } of pluginInfos) {
      let dependencies = manifest.dependencies || [];
      // 确保dependencies是数组
      if (typeof dependencies === 'object' && !Array.isArray(dependencies)) {
        dependencies = [];
      }
      dependencyGraph[pluginName] = {
        path: pluginPath,
        manifest: manifest,
        dependencies: dependencies,
        loaded: false
      };
    }
    
    // 拓扑排序加载插件
    while (Object.keys(dependencyGraph).length > 0) {
      // 找出没有未加载依赖的插件
      const readyPlugins = [];
      for (const pluginName in dependencyGraph) {
        const info = dependencyGraph[pluginName];
        const dependencies = info.dependencies;
        const allDepsLoaded = dependencies.every(dep => this.plugins[dep]);
        if (allDepsLoaded) {
          readyPlugins.push(pluginName);
        }
      }
      
      if (readyPlugins.length === 0) {
        // 存在循环依赖
        console.error('插件依赖存在循环，无法加载:');
        for (const pluginName in dependencyGraph) {
          const info = dependencyGraph[pluginName];
          console.error(`  ${pluginName} 依赖: ${info.dependencies}`);
        }
        break;
      }
      
      // 加载准备好的插件
      for (const pluginName of readyPlugins) {
        const info = dependencyGraph[pluginName];
        this._loadPlugin(pluginName, info.path, info.manifest);
        delete dependencyGraph[pluginName];
      }
    }
  }

  /**
   * 加载单个插件
   * @param {string} pluginName - 插件名称
   * @param {string} pluginPath - 插件路径
   * @param {Object} manifest - 插件清单
   */
  _loadPlugin(pluginName, pluginPath, manifest) {
    // 检查插件入口文件
    const mainFile = manifest.main || 'main.js';
    const mainPath = path.join(pluginPath, mainFile);
    
    if (!fs.existsSync(mainPath)) {
      console.error(`插件 ${pluginName} 缺少入口文件 ${mainFile}`);
      return;
    }
    
    try {
      // 导入插件模块
      delete require.cache[require.resolve(mainPath)];
      const module = require(mainPath);
      
      // 初始化插件
      const pluginInfo = {
        name: pluginName,
        path: pluginPath,
        manifest: manifest,
        module: module,
        loadedAt: new Date().toISOString(),
        status: 'loaded',
        config: this._loadPluginConfig(pluginName, pluginPath),
        metadata: {
          version: manifest.version,
          author: manifest.author,
          description: manifest.description,
          keywords: manifest.keywords || [],
          permissions: manifest.permissions || [],
          events: manifest.events || []
        }
      };
      
      // 调用插件初始化函数
      if (typeof module.initialize === 'function') {
        try {
          const initResult = module.initialize(pluginInfo.config);
          if (initResult) {
            pluginInfo.status = 'initialized';
            console.log(`插件 ${pluginName} 初始化成功`);
          } else {
            pluginInfo.status = 'failed';
            console.error(`插件 ${pluginName} 初始化失败`);
            return;
          }
        } catch (error) {
          pluginInfo.status = 'failed';
          console.error(`插件 ${pluginName} 初始化异常: ${error.message}`);
          return;
        }
      } else {
        pluginInfo.status = 'initialized';
      }
      
      // 检查插件是否实现了必要的接口
      if (typeof module.run !== 'function') {
        console.error(`插件 ${pluginName} 缺少 run 函数`);
        return;
      }
      
      // 注册插件事件处理器
      if (typeof module.registerEvents === 'function') {
        try {
          module.registerEvents(this._getEventEmitter(pluginName));
        } catch (error) {
          console.error(`插件 ${pluginName} 注册事件处理器失败: ${error.message}`);
        }
      }
      
      this.plugins[pluginName] = pluginInfo;
      console.log(`插件 ${pluginName} 加载成功`);
    } catch (error) {
      console.error(`加载插件 ${pluginName} 失败: ${error.message}`);
    }
  }

  /**
   * 加载插件配置
   * @param {string} pluginName - 插件名称
   * @param {string} pluginPath - 插件路径
   * @returns {Object} 插件配置
   */
  _loadPluginConfig(pluginName, pluginPath) {
    const configFile = path.join(pluginPath, 'config.json');
    if (fs.existsSync(configFile)) {
      try {
        return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      } catch (error) {
        console.error(`加载插件 ${pluginName} 配置失败: ${error.message}`);
      }
    }
    return {};
  }

  /**
   * 获取事件发射器
   * @param {string} pluginName - 插件名称
   * @returns {Function} 事件发射器函数
   */
  _getEventEmitter(pluginName) {
    return (eventName, data) => {
      this.emitEvent(eventName, data, pluginName);
    };
  }

  /**
   * 获取所有插件
   * @returns {Object} 插件字典
   */
  getPlugins() {
    return this.plugins;
  }

  /**
   * 获取单个插件
   * @param {string} pluginName - 插件名称
   * @returns {Object|null} 插件信息
   */
  getPlugin(pluginName) {
    return this.plugins[pluginName] || null;
  }

  /**
   * 运行插件
   * @param {string} pluginName - 插件名称
   * @param {*} args - 位置参数
   * @returns {*} 插件运行结果
   */
  async runPlugin(pluginName, ...args) {
    const plugin = this.getPlugin(pluginName);
    if (plugin) {
      try {
        // 检查插件状态
        if (plugin.status !== 'initialized') {
          console.error(`插件 ${pluginName} 未初始化，无法运行`);
          return null;
        }
        
        const result = await plugin.module.run(...args);
        console.log(`插件 ${pluginName} 运行成功`);
        return result;
      } catch (error) {
        console.error(`运行插件 ${pluginName} 失败: ${error.message}`);
        return null;
      }
    } else {
      console.error(`插件 ${pluginName} 不存在`);
      return null;
    }
  }

  /**
   * 停止插件
   * @param {string} pluginName - 插件名称
   * @returns {boolean} 是否停止成功
   */
  stopPlugin(pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (plugin) {
      try {
        // 调用插件停止函数
        if (typeof plugin.module.stop === 'function') {
          plugin.module.stop();
        }
        plugin.status = 'stopped';
        console.log(`插件 ${pluginName} 停止成功`);
        return true;
      } catch (error) {
        console.error(`停止插件 ${pluginName} 失败: ${error.message}`);
        return false;
      }
    } else {
      console.error(`插件 ${pluginName} 不存在`);
      return false;
    }
  }

  /**
   * 重新加载插件
   * @param {string} pluginName - 插件名称
   * @returns {boolean} 是否重新加载成功
   */
  reloadPlugin(pluginName) {
    if (this.plugins[pluginName]) {
      // 先停止插件
      this.stopPlugin(pluginName);
      
      const plugin = this.plugins[pluginName];
      const pluginPath = plugin.path;
      const manifestFile = path.join(pluginPath, 'manifest.json');
      
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
        
        // 验证清单
        if (!this._validateManifest(manifest, pluginName)) {
          return false;
        }
        
        // 移除旧插件
        delete this.plugins[pluginName];
        
        // 重新加载插件
        this._loadPlugin(pluginName, pluginPath, manifest);
        return true;
      } catch (error) {
        console.error(`重新加载插件 ${pluginName} 失败: ${error.message}`);
        return false;
      }
    } else {
      console.error(`插件 ${pluginName} 不存在`);
      return false;
    }
  }

  /**
   * 重新加载所有插件
   */
  reloadAllPlugins() {
    // 先停止所有插件
    for (const pluginName in this.plugins) {
      this.stopPlugin(pluginName);
    }
    
    // 清空插件列表
    this.plugins = {};
    
    // 重新加载所有插件
    this._loadPlugins();
  }

  /**
   * 安装插件
   * @param {string} pluginZip - 插件压缩包路径
   * @returns {boolean} 是否安装成功
   */
  installPlugin(pluginZip) {
    try {
      const unzipper = require('unzipper');
      const fs = require('fs');
      const path = require('path');
      
      // 解压插件
      return new Promise((resolve) => {
        let pluginName = null;
        fs.createReadStream(pluginZip)
          .pipe(unzipper.Parse())
          .on('entry', (entry) => {
            const fileName = entry.path;
            const type = entry.type;
            
            if (type === 'Directory' && !pluginName) {
              pluginName = fileName;
            }
            
            const filePath = path.join(this.pluginsDir, fileName);
            if (type === 'Directory') {
              if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
              }
              entry.autodrain();
            } else {
              entry.pipe(fs.createWriteStream(filePath));
            }
          })
          .on('finish', () => {
            if (pluginName) {
              const pluginPath = path.join(this.pluginsDir, pluginName);
              const manifestFile = path.join(pluginPath, 'manifest.json');
              
              if (fs.existsSync(manifestFile)) {
                try {
                  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
                  if (this._validateManifest(manifest, pluginName)) {
                    this._loadPlugin(pluginName, pluginPath, manifest);
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                } catch (error) {
                  console.error(`加载插件 ${pluginName} 失败: ${error.message}`);
                  resolve(false);
                }
              } else {
                console.error(`插件 ${pluginName} 缺少 manifest.json 文件`);
                resolve(false);
              }
            } else {
              console.error('无法确定插件名称');
              resolve(false);
            }
          })
          .on('error', (error) => {
            console.error(`解压插件失败: ${error.message}`);
            resolve(false);
          });
      });
    } catch (error) {
      console.error(`安装插件失败: ${error.message}`);
      return false;
    }
  }

  /**
   * 卸载插件
   * @param {string} pluginName - 插件名称
   * @returns {boolean} 是否卸载成功
   */
  uninstallPlugin(pluginName) {
    if (this.plugins[pluginName]) {
      // 先停止插件
      this.stopPlugin(pluginName);
      
      const plugin = this.plugins[pluginName];
      const pluginPath = plugin.path;
      
      try {
        const rimraf = require('rimraf');
        rimraf.sync(pluginPath);
        delete this.plugins[pluginName];
        console.log(`插件 ${pluginName} 卸载成功`);
        return true;
      } catch (error) {
        console.error(`卸载插件 ${pluginName} 失败: ${error.message}`);
        return false;
      }
    } else {
      console.error(`插件 ${pluginName} 不存在`);
      return false;
    }
  }

  /**
   * 发射事件
   * @param {string} eventName - 事件名称
   * @param {*} data - 事件数据
   * @param {string} source - 事件源
   * @param {number} priority - 事件优先级，数值越小优先级越高
   */
  emitEvent(eventName, data = null, source = 'system', priority = 5) {
    console.log(`发射事件: ${eventName} 来源: ${source} 优先级: ${priority}`);
    
    // 将事件添加到队列中
    this.eventQueue.push({ eventName, data, source, priority });
    
    // 处理事件队列
    this._processEvents();
  }

  /**
   * 注册事件处理器
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  registerEventHandler(eventName, handler) {
    if (!this.pluginEvents[eventName]) {
      this.pluginEvents[eventName] = [];
    }
    this.pluginEvents[eventName].push(handler);
  }

  /**
   * 获取插件状态
   * @param {string} pluginName - 插件名称
   * @returns {string|null} 插件状态
   */
  getPluginStatus(pluginName) {
    const plugin = this.getPlugin(pluginName);
    return plugin ? plugin.status : null;
  }

  /**
   * 获取插件清单
   * @param {string} pluginName - 插件名称
   * @returns {Object|null} 插件清单
   */
  getPluginManifest(pluginName) {
    const plugin = this.getPlugin(pluginName);
    return plugin ? plugin.manifest : null;
  }

  /**
   * 更新插件配置
   * @param {string} pluginName - 插件名称
   * @param {Object} config - 新配置
   * @returns {boolean} 是否更新成功
   */
  updatePluginConfig(pluginName, config) {
    const plugin = this.getPlugin(pluginName);
    if (plugin) {
      try {
        // 更新内存中的配置
        Object.assign(plugin.config, config);
        
        // 保存配置到文件
        const configFile = path.join(plugin.path, 'config.json');
        fs.writeFileSync(configFile, JSON.stringify(plugin.config, null, 2), 'utf-8');
        
        // 通知插件配置更新
        if (typeof plugin.module.onConfigUpdate === 'function') {
          plugin.module.onConfigUpdate(plugin.config);
        }
        
        console.log(`插件 ${pluginName} 配置更新成功`);
        return true;
      } catch (error) {
        console.error(`更新插件 ${pluginName} 配置失败: ${error.message}`);
        return false;
      }
    } else {
      console.error(`插件 ${pluginName} 不存在`);
      return false;
    }
  }

  /**
   * 获取插件信息
   * @param {string} pluginName - 插件名称
   * @returns {Object|null} 插件信息
   */
  getPluginInfo(pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (plugin) {
      return {
        name: plugin.name,
        version: plugin.metadata.version,
        author: plugin.metadata.author,
        description: plugin.metadata.description,
        status: plugin.status,
        loadedAt: plugin.loadedAt,
        keywords: plugin.metadata.keywords,
        permissions: plugin.metadata.permissions,
        events: plugin.metadata.events
      };
    }
    return null;
  }

  /**
   * 搜索插件
   * @param {string} query - 搜索关键词
   * @returns {Array} 匹配的插件
   */
  searchPlugins(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const pluginName in this.plugins) {
      const plugin = this.plugins[pluginName];
      const info = this.getPluginInfo(pluginName);
      
      if (info.name.toLowerCase().includes(lowerQuery) ||
          info.description.toLowerCase().includes(lowerQuery) ||
          info.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))) {
        results.push(info);
      }
    }
    
    return results;
  }

  /**
   * 获取插件依赖关系
   * @returns {Object} 依赖关系图
   */
  getDependencyGraph() {
    const graph = {};
    
    for (const pluginName in this.plugins) {
      const plugin = this.plugins[pluginName];
      graph[pluginName] = {
        dependencies: plugin.manifest.dependencies || [],
        dependents: []
      };
    }
    
    // 找出依赖该插件的其他插件
    for (const pluginName in this.plugins) {
      const plugin = this.plugins[pluginName];
      const dependencies = plugin.manifest.dependencies || [];
      
      dependencies.forEach(dep => {
        if (graph[dep]) {
          graph[dep].dependents.push(pluginName);
        }
      });
    }
    
    return graph;
  }

  /**
   * 验证插件兼容性
   * @param {string} pluginName - 插件名称
   * @returns {Object} 兼容性报告
   */
  validatePluginCompatibility(pluginName) {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) {
      return { compatible: false, message: '插件不存在' };
    }
    
    const report = {
      compatible: true,
      issues: [],
      warnings: []
    };
    
    // 检查依赖
    const dependencies = plugin.manifest.dependencies || [];
    dependencies.forEach(dep => {
      if (!this.plugins[dep]) {
        report.compatible = false;
        report.issues.push(`缺少依赖插件: ${dep}`);
      }
    });
    
    // 检查必要接口
    if (typeof plugin.module.run !== 'function') {
      report.compatible = false;
      report.issues.push('缺少 run 函数');
    }
    
    return report;
  }
}

// 全局插件系统实例
const pluginSystem = new PluginSystem();

// 导出函数
function getPlugins() {
  return pluginSystem.getPlugins();
}

function getPlugin(pluginName) {
  return pluginSystem.getPlugin(pluginName);
}

async function runPlugin(pluginName, ...args) {
  return await pluginSystem.runPlugin(pluginName, ...args);
}

function stopPlugin(pluginName) {
  return pluginSystem.stopPlugin(pluginName);
}

function reloadPlugin(pluginName) {
  return pluginSystem.reloadPlugin(pluginName);
}

function reloadAllPlugins() {
  pluginSystem.reloadAllPlugins();
}

function installPlugin(pluginZip) {
  return pluginSystem.installPlugin(pluginZip);
}

function uninstallPlugin(pluginName) {
  return pluginSystem.uninstallPlugin(pluginName);
}

function emitEvent(eventName, data = null, source = 'system', priority = 5) {
  pluginSystem.emitEvent(eventName, data, source, priority);
}

function registerEventHandler(eventName, handler) {
  pluginSystem.registerEventHandler(eventName, handler);
}

function getPluginStatus(pluginName) {
  return pluginSystem.getPluginStatus(pluginName);
}

function getPluginManifest(pluginName) {
  return pluginSystem.getPluginManifest(pluginName);
}

function updatePluginConfig(pluginName, config) {
  return pluginSystem.updatePluginConfig(pluginName, config);
}

function getPluginInfo(pluginName) {
  return pluginSystem.getPluginInfo(pluginName);
}

function searchPlugins(query) {
  return pluginSystem.searchPlugins(query);
}

function getDependencyGraph() {
  return pluginSystem.getDependencyGraph();
}

function validatePluginCompatibility(pluginName) {
  return pluginSystem.validatePluginCompatibility(pluginName);
}

module.exports = {
  PluginSystem,
  pluginSystem,
  getPlugins,
  getPlugin,
  runPlugin,
  stopPlugin,
  reloadPlugin,
  reloadAllPlugins,
  installPlugin,
  uninstallPlugin,
  emitEvent,
  registerEventHandler,
  getPluginStatus,
  getPluginManifest,
  updatePluginConfig,
  getPluginInfo,
  searchPlugins,
  getDependencyGraph,
  validatePluginCompatibility
};