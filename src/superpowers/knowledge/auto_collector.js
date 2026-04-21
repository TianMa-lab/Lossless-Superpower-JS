/**
 * 自动采集经验教训
 */

const fs = require('fs');
const path = require('path');
const { addLesson } = require('./lesson_manager');

// 路径配置
const KNOWLEDGE_DIR = path.join(__dirname);
const ACTIVITY_LOG = path.join(KNOWLEDGE_DIR, 'activity.log');

// 经验教训模式
const LESSON_PATTERNS = {
  "problem_solution": {
    pattern: /(问题|bug|错误|故障|失败).*?(解决|修复|解决了|修复了|搞定了|搞定)/i,
    description: "问题-解决方案模式",
    priority: 5
  },
  "trial_error": {
    pattern: /(尝试|试了|试过).*?(不行|失败|没用|没成功).*?(后来|然后|最终|最后).*?(成功|解决)/i,
    description: "尝试-错误-成功模式",
    priority: 4
  },
  "best_practice": {
    pattern: /(最好|最佳|推荐|建议).*?(做法|方法|方式|步骤)/i,
    description: "最佳实践模式",
    priority: 3
  },
  "warning": {
    pattern: /(注意|警告|小心|不要|避免).*?(错误|问题|陷阱|坑)/i,
    description: "警告模式",
    priority: 3
  },
  "time_saving": {
    pattern: /(节省时间|提高效率|加快速度|简化流程).*?(方法|技巧|工具|步骤)/i,
    description: "时间节省模式",
    priority: 2
  }
};

// 关键词提取规则
const KEYWORD_RULES = {
  "技术": ["技术", "工具", "框架", "库", "语言", "API", "系统", "平台"],
  "问题": ["问题", "bug", "错误", "故障", "失败", "异常", "错误"],
  "解决方案": ["解决", "修复", "解决了", "修复了", "搞定了", "搞定", "解决方法", "解决方案"],
  "工具": ["工具", "软件", "库", "框架", "插件", "应用", "程序"],
  "方法": ["方法", "技巧", "步骤", "流程", "策略", "方案", "做法"],
  "经验": ["经验", "教训", "总结", "心得", "体会", "收获"]
};

class AutoCollector {
  constructor() {
    this.activityLog = ACTIVITY_LOG;
    this.patterns = LESSON_PATTERNS;
    this.keywordRules = KEYWORD_RULES;
    this._ensureLogFile();
  }

  /**
   * 确保日志文件存在
   */
  _ensureLogFile() {
    if (!fs.existsSync(this.activityLog)) {
      fs.writeFileSync(this.activityLog, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  /**
   * 记录活动
   * @param {Object} activity - 活动信息
   */
  logActivity(activity) {
    try {
      // 加载现有日志
      const activities = this._loadActivities();
      
      // 添加新活动
      activity.timestamp = new Date().toISOString();
      activities.push(activity);
      
      // 保存日志，只保留最近1000条
      fs.writeFileSync(this.activityLog, JSON.stringify(activities.slice(-1000), null, 2), 'utf-8');
      
      console.log(`记录活动: ${activity.type || 'unknown'}`);
    } catch (error) {
      console.error(`记录活动失败: ${error.message}`);
    }
  }

  /**
   * 加载活动日志
   * @returns {Array} 活动列表
   */
  _loadActivities() {
    try {
      const data = fs.readFileSync(this.activityLog, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`加载活动日志失败: ${error.message}`);
      return [];
    }
  }

  /**
   * 收集 Git 活动
   */
  collectGitActivities() {
    try {
      const { execSync } = require('child_process');
      
      // 检查是否在 Git 仓库中
      if (!fs.existsSync('.git')) {
        console.warn("不在 Git 仓库中");
        return;
      }
      
      // 获取最近的提交
      const result = execSync('git log --oneline -n 10', { encoding: 'utf-8' });
      const commits = result.trim().split('\n');
      
      for (const commit of commits) {
        if (commit) {
          const [commitId, ...messageParts] = commit.split(' ');
          const message = messageParts.join(' ');
          
          const activity = {
            type: "git_commit",
            commit_id: commitId,
            message: message
          };
          this.logActivity(activity);
        }
      }
    } catch (error) {
      console.error(`收集 Git 活动失败: ${error.message}`);
    }
  }

  /**
   * 分析文本，识别经验教训
   * @param {string} text - 要分析的文本
   * @returns {Array} 识别出的经验教训列表
   */
  analyzeText(text) {
    const lessons = [];
    
    // 匹配模式
    for (const [patternName, patternInfo] of Object.entries(this.patterns)) {
      const matches = text.matchAll(patternInfo.pattern);
      for (const match of matches) {
        // 提取匹配的文本
        const matchedText = match[0];
        
        // 提取关键词
        const keywords = this.extractKeywords(matchedText);
        
        // 生成教训摘要
        const summary = this.generateSummary(matchedText);
        
        // 构建教训
        const lesson = {
          pattern: patternName,
          summary: summary,
          content: matchedText,
          keywords: keywords,
          priority: patternInfo.priority
        };
        lessons.push(lesson);
      }
    }
    
    // 按优先级排序
    lessons.sort((a, b) => b.priority - a.priority);
    
    return lessons;
  }

  /**
   * 提取关键词
   * @param {string} text - 文本
   * @returns {Array} 关键词列表
   */
  extractKeywords(text) {
    const keywords = [];
    
    for (const [category, terms] of Object.entries(this.keywordRules)) {
      for (const term of terms) {
        if (text.includes(term)) {
          keywords.push(term);
        }
      }
    }
    
    return [...new Set(keywords)];
  }

  /**
   * 生成教训摘要
   * @param {string} text - 文本
   * @returns {string} 摘要
   */
  generateSummary(text) {
    // 简单实现：取前50个字符
    const summary = text.trim().substring(0, 50);
    return summary.length < text.length ? summary + "..." : summary;
  }

  /**
   * 处理活动，提取经验教训
   * @param {Object} activity - 活动信息
   */
  processActivity(activity) {
    // 提取活动文本
    let text = "";
    if (activity.message) {
      text = activity.message;
    } else if (activity.content) {
      text = activity.content;
    }
    
    if (!text) {
      return;
    }
    
    // 分析文本
    const lessons = this.analyzeText(text);
    
    // 处理识别出的教训
    for (const lesson of lessons) {
      // 构建故事结构
      const story = {
        context: text,
        approaches: [],
        breakthrough: lesson.summary,
        result: lesson.content
      };
      
      // 提取触发词和相关主题
      const triggers = lesson.keywords;
      const relatedTopics = [];
      
      // 尝试从文本中提取更多信息
      if (text.includes("尝试")) {
        const approaches = text.match(/尝试(.*?)(不行|失败|没用|没成功)/gi);
        if (approaches) {
          for (const approach of approaches) {
            const cleanedApproach = approach.replace(/尝试|不行|失败|没用|没成功/g, '').trim();
            if (cleanedApproach) {
              story.approaches.push(cleanedApproach);
            }
          }
        }
      }
      
      // 添加经验教训
      const lessonId = addLesson(
        lesson.summary,
        story,
        triggers,
        relatedTopics
      );
      
      console.log(`自动添加经验教训: ${lessonId}`);
    }
  }

  /**
   * 监控工作流程
   * @param {number} interval - 监控间隔（秒）
   */
  monitor(interval = 60) {
    console.log(`开始监控工作流程，间隔 ${interval} 秒`);
    
    const monitorInterval = setInterval(() => {
      try {
        // 收集 Git 活动
        this.collectGitActivities();
        
        // 处理活动日志
        this.processActivityLog();
      } catch (error) {
        console.error(`监控过程中发生错误: ${error.message}`);
      }
    }, interval * 1000);
    
    // 监听终止信号
    process.on('SIGINT', () => {
      clearInterval(monitorInterval);
      console.log("监控已停止");
      process.exit(0);
    });
  }

  /**
   * 处理活动日志
   */
  processActivityLog() {
    try {
      const activities = this._loadActivities();
      
      // 处理未处理的活动
      for (const activity of activities) {
        if (!activity.processed) {
          this.processActivity(activity);
          activity.processed = true;
        }
      }
      
      // 保存处理后的日志
      fs.writeFileSync(this.activityLog, JSON.stringify(activities, null, 2), 'utf-8');
    } catch (error) {
      console.error(`处理活动日志失败: ${error.message}`);
    }
  }

  /**
   * 导入活动日志
   * @param {string} filePath - 日志文件路径
   */
  importActivities(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const activities = JSON.parse(data);
      
      for (const activity of activities) {
        this.logActivity(activity);
      }
      
      console.log(`导入了 ${activities.length} 条活动`);
    } catch (error) {
      console.error(`导入活动失败: ${error.message}`);
    }
  }
}

// 全局自动采集器实例
const autoCollector = new AutoCollector();

// 导出函数
function logActivity(activity) {
  autoCollector.logActivity(activity);
}

function collectGitActivities() {
  autoCollector.collectGitActivities();
}

function analyzeText(text) {
  return autoCollector.analyzeText(text);
}

function processActivity(activity) {
  autoCollector.processActivity(activity);
}

function monitor(interval = 60) {
  autoCollector.monitor(interval);
}

function processActivityLog() {
  autoCollector.processActivityLog();
}

function importActivities(filePath) {
  autoCollector.importActivities(filePath);
}

module.exports = {
  AutoCollector,
  autoCollector,
  logActivity,
  collectGitActivities,
  analyzeText,
  processActivity,
  monitor,
  processActivityLog,
  importActivities
};
