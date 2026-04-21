#!/usr/bin/env node

/**
 * Lossless Superpower JavaScript Version
 * AI Agent Meta-capabilities Framework
 * 轻量可集成版本
 */

const fs = require('fs');
const path = require('path');

// 核心功能 - 最小化导入
const PHASE_SKILLS = {
  // 核心 Superpowers 技能
  1: "brainstorming",
  2: "systematic-debugging",
  3: "writing-plans",
  4: "executing-plans",
  5: "tdd-cycle",
  6: "subagent-driven-development",
  7: "requesting-code-review",
  8: "finishing-a-development-branch",
  // 元能力
  9: "skill-scoring",
  10: "deep-reflection"
};

// 延迟加载模块，实现按需导入
const lazyLoad = {
  // 自我进化模块
  get selfEvolution() {
    delete this.selfEvolution;
    return this.selfEvolution = require('./superpowers/self_evolution');
  },
  
  // 插件系统模块
  get pluginSystem() {
    delete this.pluginSystem;
    return this.pluginSystem = require('./superpowers/plugin_system');
  },
  
  // 技能管理模块
  get skillManager() {
    delete this.skillManager;
    return this.skillManager = require('./superpowers/skill_manager');
  },
  
  // 任务跟踪模块
  get taskTracker() {
    delete this.taskTracker;
    return this.taskTracker = require('./superpowers/task_tracker');
  },
  
  // 永久记忆系统
  get permanentMemorySystem() {
    delete this.permanentMemorySystem;
    return this.permanentMemorySystem = require('./superpowers/permanent_memory');
  },
  
  // 技能系统模块
  get skillSystem() {
    delete this.skillSystem;
    return this.skillSystem = {
      SkillScanner: require('./superpowers/skill_scanner').SkillScanner,
      SkillGenerator: require('./superpowers/skill_generator').SkillGenerator,
      SkillKnowledgeGraph: require('./superpowers/skill_knowledge_graph').SkillKnowledgeGraph,
      SkillOptimizer: require('./superpowers/skill_optimizer').SkillOptimizer,
      SkillMarket: require('./superpowers/skill_market').SkillMarket
    };
  },
  
  // 自动任务记录系统
  get autoTaskRecorder() {
    delete this.autoTaskRecorder;
    return this.autoTaskRecorder = require('./superpowers/auto_task_recorder');
  },
  
  // 自动迭代记录器
  get autoIterationRecorder() {
    delete this.autoIterationRecorder;
    return this.autoIterationRecorder = require('./superpowers/auto_iteration_recorder');
  },
  
  // 文档生成器
  get docGenerator() {
    delete this.docGenerator;
    return this.docGenerator = require('./superpowers/doc_generator');
  },
  
  // GitHub 同步
  get githubSync() {
    delete this.githubSync;
    return this.githubSync = require('./superpowers/github_sync');
  },
  
  // 知识图谱推理器
  get knowledgeGraphReasoner() {
    delete this.knowledgeGraphReasoner;
    return this.knowledgeGraphReasoner = require('./superpowers/knowledge_graph_reasoner');
  },
  
  // 知识图谱嵌入
  get knowledgeGraphEmbedding() {
    delete this.knowledgeGraphEmbedding;
    return this.knowledgeGraphEmbedding = require('./superpowers/knowledge_graph_embedding');
  },
  
  // 路径推理
  get pathReasoner() {
    delete this.pathReasoner;
    return this.pathReasoner = require('./superpowers/path_reasoner');
  },
  
  // 图神经网络推理
  get gnnReasoner() {
    delete this.gnnReasoner;
    return this.gnnReasoner = require('./superpowers/gnn_reasoner');
  },
  
  // 规则推理
  get ruleReasoner() {
    delete this.ruleReasoner;
    return this.ruleReasoner = require('./superpowers/rule_reasoner');
  },
  
  // 时序推理
  get temporalReasoner() {
    delete this.temporalReasoner;
    return this.temporalReasoner = require('./superpowers/temporal_reasoner');
  },
  
  // 性能优化
  get performanceOptimizer() {
    delete this.performanceOptimizer;
    return this.performanceOptimizer = require('./superpowers/performance_optimizer');
  },
  
  // KGR自动迭代
  get kgrAutoIteration() {
    delete this.kgrAutoIteration;
    return this.kgrAutoIteration = require('./superpowers/kgr_auto_iteration');
  }
};

// 核心功能导出
const coreFunctions = {
  // 技能相关
  PHASE_SKILLS,
  
  // 自我进化
  learnFromInteraction: (...args) => lazyLoad.selfEvolution.learnFromInteraction(...args),
  evaluatePerformance: (...args) => lazyLoad.selfEvolution.evaluatePerformance(...args),
  optimizeSystem: (...args) => lazyLoad.selfEvolution.optimizeSystem(...args),
  getEvolutionStatus: (...args) => lazyLoad.selfEvolution.getEvolutionStatus(...args),
  generateSelfReflection: (...args) => lazyLoad.selfEvolution.generateSelfReflection(...args),
  performMaintenance: (...args) => lazyLoad.selfEvolution.performMaintenance(...args),
  recordIteration: (...args) => lazyLoad.selfEvolution.recordIteration(...args),
  checkSystemHealth: (...args) => lazyLoad.selfEvolution.checkSystemHealth(...args),
  
  // 插件系统
  getPlugins: (...args) => lazyLoad.pluginSystem.getPlugins(...args),
  runPlugin: (...args) => lazyLoad.pluginSystem.runPlugin(...args),
  installPlugin: (...args) => lazyLoad.pluginSystem.installPlugin(...args),
  uninstallPlugin: (...args) => lazyLoad.pluginSystem.uninstallPlugin(...args),
  reloadPlugin: (...args) => lazyLoad.pluginSystem.reloadPlugin(...args),
  reloadAllPlugins: (...args) => lazyLoad.pluginSystem.reloadAllPlugins(...args),
  
  // 任务管理
  startTask: (taskId, taskName, description) => {
    const taskTracker = require('./superpowers/task_tracker').taskTracker;
    return taskTracker.startTask(taskId, taskName, description);
  },
  addTaskStep: (taskId, stepName, details) => {
    const taskTracker = require('./superpowers/task_tracker').taskTracker;
    return taskTracker.addTaskStep(taskId, stepName, details);
  },
  completeTask: (taskId, result) => {
    const taskTracker = require('./superpowers/task_tracker').taskTracker;
    return taskTracker.completeTask(taskId, result);
  },
  
  // 技能系统
  SkillScanner: lazyLoad.skillSystem.SkillScanner,
  SkillGenerator: lazyLoad.skillSystem.SkillGenerator,
  SkillKnowledgeGraph: lazyLoad.skillSystem.SkillKnowledgeGraph,
  SkillOptimizer: lazyLoad.skillSystem.SkillOptimizer,
  SkillMarket: lazyLoad.skillSystem.SkillMarket,
  
  // 自动任务记录
  autoTaskRecorder: lazyLoad.autoTaskRecorder.autoTaskRecorder,
  AutoTaskRecorder: lazyLoad.autoTaskRecorder.AutoTaskRecorder,
  
  // 自动迭代记录器
  autoIterationRecorder: lazyLoad.autoIterationRecorder.autoIterationRecorder,
  AutoIterationRecorder: lazyLoad.autoIterationRecorder.AutoIterationRecorder,
  startAutoIterationRecorder: lazyLoad.autoIterationRecorder.startAutoIterationRecorder,
  stopAutoIterationRecorder: lazyLoad.autoIterationRecorder.stopAutoIterationRecorder,
  getAutoIterationStatus: lazyLoad.autoIterationRecorder.getAutoIterationStatus,
  triggerIteration: lazyLoad.autoIterationRecorder.triggerIteration,
  
  // 飞书工具
  feishuTools: () => require('./superpowers/feishu_tools'),
  FeishuTools: () => require('./superpowers/feishu_tools').FeishuTools,
  
  // 飞书技能
  feishuSkill: () => require('./superpowers/feishu_skill'),
  FeishuSkill: () => require('./superpowers/feishu_skill').FeishuSkill,
  
  // 记忆系统
  permanentMemorySystem: lazyLoad.permanentMemorySystem.permanentMemorySystem,
  
  // 文档生成器
  docGenerator: lazyLoad.docGenerator.docGenerator,
  DocGenerator: lazyLoad.docGenerator.DocGenerator,
  generateDocumentation: () => lazyLoad.docGenerator.docGenerator.generateDocumentation(),
  startDocWatching: () => lazyLoad.docGenerator.docGenerator.startWatching(),
  stopDocWatching: () => lazyLoad.docGenerator.docGenerator.stopWatching(),
  
  // GitHub 同步
  githubSync: lazyLoad.githubSync.githubSync,
  GitHubSync: lazyLoad.githubSync.GitHubSync,
  startGitHubSync: () => lazyLoad.githubSync.startAutoSync(),
  stopGitHubSync: () => lazyLoad.githubSync.stopAutoSync(),
  syncGitHub: () => lazyLoad.githubSync.sync(),
  getGitHubSyncStatus: () => lazyLoad.githubSync.getSyncStatus(),
  
  // 知识图谱推理器
  knowledgeGraphReasoner: lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner,
  KnowledgeGraphReasoner: lazyLoad.knowledgeGraphReasoner.KnowledgeGraphReasoner,
  reason: (type, params) => {
    switch (type) {
      case 'path':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.pathReasoning(params.source, params.target, params.maxDepth);
      case 'relationship':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.relationshipReasoning(params.node1, params.node2);
      case 'semantic':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.semanticReasoning(params.node, params.topK);
      case 'rule':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.ruleBasedReasoning(params.rules);
      case 'completion':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.graphCompletion(params.topK);
      case 'multi':
        return lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.multiStepReasoning(params.queries);
      default:
        throw new Error('Unknown reasoning type');
    }
  },
  
  // 知识图谱嵌入
  knowledgeGraphEmbedding: lazyLoad.knowledgeGraphEmbedding.kgEmbeddingManager,
  KGEmbedding: lazyLoad.knowledgeGraphEmbedding.KGEmbedding,
  TransE: lazyLoad.knowledgeGraphEmbedding.TransE,
  RotatE: lazyLoad.knowledgeGraphEmbedding.RotatE,
  ComplEx: lazyLoad.knowledgeGraphEmbedding.ComplEx,
  TuckER: lazyLoad.knowledgeGraphEmbedding.TuckER,
  createEmbedding: (type, config) => lazyLoad.knowledgeGraphEmbedding.kgEmbeddingManager.createEmbedding(type, config),
  
  // 路径推理
  pathReasoner: lazyLoad.pathReasoner.pathReasonerManager,
  PathReasoner: lazyLoad.pathReasoner.PathReasoner,
  createPathReasoner: (graph, config) => lazyLoad.pathReasoner.pathReasonerManager.createReasoner(graph, config),
  
  // 图神经网络推理
  gnnReasoner: lazyLoad.gnnReasoner.gnnReasonerManager,
  GNN: lazyLoad.gnnReasoner.GNN,
  GCN: lazyLoad.gnnReasoner.GCN,
  GAT: lazyLoad.gnnReasoner.GAT,
  RGCN: lazyLoad.gnnReasoner.RGCN,
  createGNNReasoner: (config) => lazyLoad.gnnReasoner.gnnReasonerManager.createReasoner(config),
  
  // 规则推理
  ruleReasoner: lazyLoad.ruleReasoner.ruleReasonerManager,
  RuleReasoner: lazyLoad.ruleReasoner.RuleReasoner,
  createRuleReasoner: (config) => lazyLoad.ruleReasoner.ruleReasonerManager.createReasoner(config),
  
  // 时序推理
  temporalReasoner: lazyLoad.temporalReasoner.temporalReasonerManager,
  TemporalReasoner: lazyLoad.temporalReasoner.TemporalReasoner,
  TemporalKnowledgeGraph: lazyLoad.temporalReasoner.TemporalKnowledgeGraph,
  createTemporalReasoner: (config) => lazyLoad.temporalReasoner.temporalReasonerManager.createReasoner(config),
  
  // 性能优化
  performanceOptimizer: lazyLoad.performanceOptimizer.performanceOptimizerManager,
  PerformanceOptimizer: lazyLoad.performanceOptimizer.PerformanceOptimizer,
  createPerformanceOptimizer: (config) => lazyLoad.performanceOptimizer.performanceOptimizerManager.createOptimizer(config),
  
  // KGR自动迭代
  kgrAutoIteration: lazyLoad.kgrAutoIteration.kgrAutoIterationManager,
  KGRAutoIteration: lazyLoad.kgrAutoIteration.KGRAutoIteration,
  createKGR_auto_iteration: (config) => lazyLoad.kgrAutoIteration.kgrAutoIterationManager.createAutoIteration(config),
  startKGR_auto_iteration: (config) => {
    const autoIteration = lazyLoad.kgrAutoIteration.kgrAutoIterationManager.createAutoIteration(config);
    autoIteration.start();
    return autoIteration;
  },
  
  // 工具函数
  getCharter: () => {
    const charterPath = path.join(__dirname, '..', 'SYSTEM_CHARTER.md');
    try {
      if (fs.existsSync(charterPath)) {
        return fs.readFileSync(charterPath, 'utf-8');
      }
    } catch (error) {
      console.error('读取系统宪章失败:', error.message);
    }
    return null;
  },
  
  // 版本信息
  version: '2.0.0',
  
  // 配置管理
  config: {
    get defaultConfig() {
      return {
        pluginsDir: './plugins',
        skillsDir: './skills',
        memoryDir: './memory',
        storageDir: './storage',
        debug: false
      };
    },
    
    load: (configPath) => {
      try {
        if (fs.existsSync(configPath)) {
          return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }
      } catch (error) {
        console.error('加载配置失败:', error.message);
      }
      return coreFunctions.config.defaultConfig;
    },
    
    save: (config, configPath) => {
      try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        return true;
      } catch (error) {
        console.error('保存配置失败:', error.message);
        return false;
      }
    }
  },
  
  // 初始化函数
  init: async (config = {}) => {
    const mergedConfig = {
      ...coreFunctions.config.defaultConfig,
      ...config
    };
    
    try {
      // 初始化永久记忆系统
      if (mergedConfig.memoryDir) {
        await lazyLoad.permanentMemorySystem.permanentMemorySystem.init(mergedConfig.memoryDir);
      }
      
      // 初始化插件系统
      if (mergedConfig.pluginsDir) {
        const pluginSystem = require('./superpowers/plugin_system').pluginSystem;
        // 插件系统会自动初始化
      }
      
      // 初始化技能系统
      if (mergedConfig.skillsDir) {
        const skillScanner = new lazyLoad.skillSystem.SkillScanner(mergedConfig.skillsDir);
        await skillScanner.scanSkills();
      }
      
      // 启动自动任务记录器
      if (mergedConfig.enableAutoTaskRecording !== false) {
        await lazyLoad.autoTaskRecorder.autoTaskRecorder.initialize();
      }
      
      // 启动自动迭代记录器
      if (mergedConfig.enableAutoIterationRecording !== false) {
        const autoIterationConfig = {
          environment: process.env.NODE_ENV || 'development',
          ...(mergedConfig.autoIterationConfig || {})
        };
        lazyLoad.autoIterationRecorder.startAutoIterationRecorder(autoIterationConfig);
      }
      
      // 启动文档生成器
      if (mergedConfig.enableDocGenerator !== false) {
        const docGeneratorConfig = {
          enableWatch: true,
          ...(mergedConfig.docGeneratorConfig || {})
        };
        const docGenerator = new lazyLoad.docGenerator.DocGenerator(docGeneratorConfig);
        docGenerator.init();
      }
      
      // 启动 GitHub 同步
      if (mergedConfig.enableGitHubSync !== false) {
        const githubSyncConfig = {
          enableSync: true,
          ...(mergedConfig.githubSyncConfig || {})
        };
        const githubSync = new lazyLoad.githubSync.GitHubSync(githubSyncConfig);
        githubSync.init();
      }
      
      // 初始化知识图谱推理器
      if (mergedConfig.enableKnowledgeGraphReasoning !== false) {
        const knowledgeGraphReasoner = new lazyLoad.knowledgeGraphReasoner.KnowledgeGraphReasoner();
        await knowledgeGraphReasoner.init();
      }
      
      // 初始化性能优化器
      if (mergedConfig.enablePerformanceOptimization !== false) {
        const performanceOptimizer = new lazyLoad.performanceOptimizer.PerformanceOptimizer(mergedConfig.performanceOptimizerConfig || {});
        performanceOptimizer.init();
      }
      
      // 初始化KGR自动迭代
      if (mergedConfig.enableKGRAutoIteration !== false) {
        const autoIteration = new lazyLoad.kgrAutoIteration.KGRAutoIteration(mergedConfig.kgrAutoIterationConfig || {});
        autoIteration.start();
      }
      
      console.log('Lossless Superpower 系统初始化成功');
      return true;
    } catch (error) {
      console.error('系统初始化失败:', error.message);
      return false;
    }
  },
  
  // 清理函数
  cleanup: () => {
    try {
      // 清理自我进化系统
      if (lazyLoad.selfEvolution && lazyLoad.selfEvolution.selfEvolution) {
        lazyLoad.selfEvolution.selfEvolution.cleanup();
      }
      
      // 停止自动迭代记录器
      if (lazyLoad.autoIterationRecorder) {
        lazyLoad.autoIterationRecorder.stopAutoIterationRecorder();
      }
      
      // 停止文档生成器
      if (lazyLoad.docGenerator) {
        lazyLoad.docGenerator.docGenerator.stopWatching();
      }
      
      // 停止 GitHub 同步
      if (lazyLoad.githubSync) {
        lazyLoad.githubSync.githubSync.cleanup();
      }
      
      // 清理知识图谱推理器
      if (lazyLoad.knowledgeGraphReasoner) {
        lazyLoad.knowledgeGraphReasoner.knowledgeGraphReasoner.cleanup();
      }
      
      // 清理新增模块
      if (lazyLoad.knowledgeGraphEmbedding) {
        lazyLoad.knowledgeGraphEmbedding.kgEmbeddingManager.cleanup();
      }
      if (lazyLoad.pathReasoner) {
        lazyLoad.pathReasoner.pathReasonerManager.cleanup();
      }
      if (lazyLoad.gnnReasoner) {
        lazyLoad.gnnReasoner.gnnReasonerManager.cleanup();
      }
      if (lazyLoad.ruleReasoner) {
        lazyLoad.ruleReasoner.ruleReasonerManager.cleanup();
      }
      if (lazyLoad.temporalReasoner) {
        lazyLoad.temporalReasoner.temporalReasonerManager.cleanup();
      }
      if (lazyLoad.performanceOptimizer) {
        lazyLoad.performanceOptimizer.performanceOptimizerManager.cleanup();
      }
      
      // 清理KGR自动迭代
      if (lazyLoad.kgrAutoIteration) {
        // KGR自动迭代的清理逻辑
      }
      
      console.log('Lossless Superpower 系统清理完成');
      return true;
    } catch (error) {
      console.error('系统清理失败:', error.message);
      return false;
    }
  }
};

// 导出核心功能
module.exports = coreFunctions;

// 主程序入口
if (require.main === module) {
  console.log('Lossless Superpower JavaScript Version');
  console.log('AI Agent Meta-capabilities Framework');
  console.log('====================================');
  
  // 显示系统宪章
  const charter = coreFunctions.getCharter();
  if (charter) {
    console.log('\n========== 系统宪章 ==========\n');
    console.log(charter);
    console.log('==============================\n');
  }
  
  console.log('Available skills:', Object.values(PHASE_SKILLS));
  console.log('====================================');
  console.log('Type "require(\'./src\')" to access all functions');
  console.log('Type "require(\'./src\').init()" to initialize the system');
}

// 导出完整API（向后兼容）
module.exports.full = require('./superpowers');