/**
 * 知识管理系统入口
 */

const lessonManager = require('./lesson_manager');
const autoCollector = require('./auto_collector');

// 导出所有功能
module.exports = {
  // 经验教训管理
  loadLessons: lessonManager.loadLessons,
  saveLessons: lessonManager.saveLessons,
  generateId: lessonManager.generateId,
  addLesson: lessonManager.addLesson,
  checkLessons: lessonManager.checkLessons,
  listLessons: lessonManager.listLessons,
  getLesson: lessonManager.getLesson,
  exportLessons: lessonManager.exportLessons,
  expandSynonyms: lessonManager.expandSynonyms,
  matchRulePatterns: lessonManager.matchRulePatterns,
  
  // 自动采集
  AutoCollector: autoCollector.AutoCollector,
  autoCollector: autoCollector.autoCollector,
  logActivity: autoCollector.logActivity,
  collectGitActivities: autoCollector.collectGitActivities,
  analyzeText: autoCollector.analyzeText,
  processActivity: autoCollector.processActivity,
  monitor: autoCollector.monitor,
  processActivityLog: autoCollector.processActivityLog,
  importActivities: autoCollector.importActivities
};
