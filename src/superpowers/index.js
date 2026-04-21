/**
 * 超级能力模块入口
 * 集成所有超级能力模块
 */

// 导入各个超级能力模块
const pluginSystem = require('./plugin_system');
const permanentMemory = require('./permanent_memory');
const selfEvolution = require('./self_evolution');
const autoIterationRecorder = require('./auto_iteration_recorder');
const feishuTools = require('./feishu_tools');
const feishuSkill = require('./feishu_skill');
const skillDiscovery = require('./skill_discovery');

// 导出所有模块
module.exports = {
  pluginSystem,
  permanentMemory,
  selfEvolution,
  autoIterationRecorder,
  feishuTools,
  feishuSkill,
  skillDiscovery
};
