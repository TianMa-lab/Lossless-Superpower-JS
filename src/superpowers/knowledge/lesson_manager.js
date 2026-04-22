/**
 * 经验教训管理工具
 * 自动提取和应用经验教训
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 路径配置
const KNOWLEDGE_DIR = path.join(__dirname);
const LESSONS_FILE = path.join(KNOWLEDGE_DIR, 'lessons.json');
const EMBEDDINGS_FILE = path.join(KNOWLEDGE_DIR, 'lesson_embeddings.json');
const SYSTEM_LOGS_DIR = path.join('D:', 'opensource', 'logs');

// 自动提取配置
const AUTO_EXTRACT_CONFIG = {
  enabled: true,
  logDirectories: [
    SYSTEM_LOGS_DIR,
    path.join(__dirname, '..', '..', 'logs')
  ],
  extractionInterval: 60 * 60 * 1000, // 每小时提取一次
  minErrorCount: 3, // 同一错误出现3次以上才提取
  confidenceThreshold: 0.7, // 提取的置信度阈值
  maxLessonsPerDay: 10 // 每天最多提取10条教训
};

/**
 * 加载所有教训
 * @returns {Array} 教训列表
 */
function loadLessons() {
  if (!fs.existsSync(LESSONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(LESSONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`加载教训失败: ${error.message}`);
    return [];
  }
}

/**
 * 保存教训
 * @param {Array} lessons - 教训列表
 */
function saveLessons(lessons) {
  try {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2), 'utf-8');
  } catch (error) {
    console.error(`保存教训失败: ${error.message}`);
  }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateId() {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const lessons = loadLessons();
  const count = lessons.filter(lesson => lesson.id.startsWith(`lesson-${dateStr}`)).length + 1;
  return `lesson-${dateStr}-${count.toString().padStart(3, '0')}`;
}

/**
 * 添加新教训
 * @param {string} lesson - 教训摘要
 * @param {Object} story - 完整故事
 * @param {Array} triggers - 触发关键词
 * @param {Array} relatedTopics - 相关主题
 * @returns {string} 教训ID
 */
function addLesson(lesson, story, triggers, relatedTopics) {
  const lessonId = generateId();
  
  const newLesson = {
    id: lessonId,
    lesson: lesson,
    story: story,
    triggers: triggers,
    related_topics: relatedTopics,
    created: new Date().toISOString(),
    times_matched: 0,
    last_matched: null
  };
  
  const lessons = loadLessons();
  lessons.push(newLesson);
  saveLessons(lessons);
  
  return lessonId;
}

/**
 * 检查当前方案是否匹配历史教训
 * @param {string} query - 当前方案描述
 * @returns {Array} 匹配的教训列表
 */
function checkLessons(query) {
  const lessons = loadLessons();
  
  if (!lessons.length) {
    return [];
  }

  // Level 1: 规则模式匹配
  const ruleMatches = matchRulePatterns(query);
  
  // Level 2: 同义词扩展
  const expandedKeywords = expandSynonyms(query);
  
  const matches = [];
  for (const lesson of lessons) {
    const triggerWords = lesson.triggers || [];
    const lessonText = lesson.lesson.toLowerCase();
    
    let matchScore = 0;
    const matchedReasons = [];
    
    // 规则模式匹配（高分）
    for (const rule of ruleMatches) {
      const hintKeywords = rule.lesson_hint.split(',');
      for (const hint of hintKeywords) {
        if (triggerWords.includes(hint)) {
          matchScore += 5; // 规则匹配高分
          matchedReasons.push(`规则匹配: ${rule.description}`);
        }
      }
    }
    
    // 同义词扩展匹配
    for (const kw of expandedKeywords) {
      const kwLower = kw.toLowerCase();
      for (const trigger of triggerWords) {
        if (kwLower.includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(kwLower)) {
          matchScore += 1;
          if (!matchedReasons.includes(`关键词: ${kw}`)) {
            matchedReasons.push(`关键词: ${kw}`);
          }
          break;
        }
      }
      // 匹配教训文本
      if (lessonText.includes(kwLower)) {
        matchScore += 0.5;
        if (!matchedReasons.includes(`文本匹配: ${kw}`)) {
          matchedReasons.push(`文本匹配: ${kw}`);
        }
      }
    }
    
    if (matchScore > 0) {
      matches.push({
        lesson: lesson,
        score: matchScore,
        reasons: matchedReasons
      });
    }
  }
  
  // 按分数排序
  matches.sort((a, b) => b.score - a.score);
  
  // 更新匹配统计
  for (const match of matches) {
    const lesson = match.lesson;
    for (const l of lessons) {
      if (l.id === lesson.id) {
        l.times_matched = (l.times_matched || 0) + 1;
        l.last_matched = new Date().toISOString();
        break;
      }
    }
  }
  
  saveLessons(lessons);
  
  return matches;
}

/**
 * 列出所有教训
 * @returns {Array} 教训列表
 */
function listLessons() {
  const lessons = loadLessons();
  return lessons.sort((a, b) => new Date(b.created) - new Date(a.created));
}

/**
 * 获取特定教训详情
 * @param {string} lessonId - 教训ID
 * @returns {Object|null} 教训详情
 */
function getLesson(lessonId) {
  const lessons = loadLessons();
  return lessons.find(lesson => lesson.id === lessonId) || null;
}

/**
 * 导出教训到 AGENTS.md 格式
 * @returns {string} 导出的内容
 */
function exportLessons() {
  const lessons = loadLessons();
  
  if (!lessons.length) {
    return "暂无教训可导出";
  }
  
  let content = "## 📚 经验教训库\n\n";
  for (const lesson of lessons.slice(0, 10)) {
    content += `- **${lesson.lesson}**\n`;
    content += `  - 触发: ${lesson.triggers ? lesson.triggers.join(', ') : ''}\n`;
    content += `  - ID: ${lesson.id}\n\n`;
  }
  
  return content;
}

// 同义词词典
const SYNONYMS = {
  "监控": ["盯着", "监听", "跟踪", "观测", "监视", "监控", "观察", "看守"],
  "拦截": ["捕获", "截获", "阻断", "拦截", "截取", "钩子", "hook"],
  "绕过": ["避开", "突破", "绕过", "绕开", "跳过", "bypass"],
  "外部程序": ["外部进程", "守护进程", "守护程序", "daemon", "外部工具"],
  "技术障碍": ["碰壁", "失败", "不行", "不支持", "无法", "限制"],
  "复杂方案": ["复杂的", "繁琐", "多步骤", "大工程", "过度设计"],
  "主动": ["主动", "自愿", "自发", "自己", "自动"],
  "被动": ["被动", "强制", "被监控", "被拦截"],
};

// 规则模式（高优先级，直接匹配语义模式）
const RULE_PATTERNS = [
  {
    pattern: /(想|要|准备|打算).*(用|通过).*(外部|守护|daemon).*监控/i,
    lesson_hint: "技术障碍,监控,外部程序",
    description: "想用外部程序监控"
  },
  {
    pattern: /(怎么|如何).*(拦截|捕获|截获).*(输出|请求)/i,
    lesson_hint: "拦截,监控",
    description: "想拦截输出或请求"
  },
  {
    pattern: /(绕过|避开|突破).*(限制|障碍|困难)/i,
    lesson_hint: "绕过,技术障碍",
    description: "想绕过限制"
  },
  {
    pattern: /(太|好).*(复杂|繁琐|麻烦)/i,
    lesson_hint: "复杂方案",
    description: "方案太复杂"
  },
];

/**
 * 从文本中提取并扩展同义词
 * @param {string} text - 文本
 * @returns {Array} 扩展后的关键词列表
 */
function expandSynonyms(text) {
  const expanded = [];
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    // 检查文本中是否包含关键词或其同义词
    const allWords = [key, ...synonyms];
    for (const word of allWords) {
      if (text.includes(word)) {
        expanded.push(...allWords);
        break;
      }
    }
  }
  return [...new Set(expanded)];
}

/**
 * 匹配规则模式
 * @param {string} text - 文本
 * @returns {Array} 匹配的规则列表
 */
function matchRulePatterns(text) {
  const matches = [];
  for (const rule of RULE_PATTERNS) {
    if (rule.pattern.test(text)) {
      matches.push(rule);
    }
  }
  return matches;
}

/**
 * 从日志文件中提取错误和问题
 * @returns {Array} 提取的问题列表
 */
function extractIssuesFromLogs() {
  const issues = [];
  const errorPatterns = [
    /Error: (.+)/,
    /error: (.+)/,
    /Exception: (.+)/,
    /exception: (.+)/,
    /Failed to (.+)/,
    /failed to (.+)/,
    /Cannot (.+)/,
    /cannot (.+)/,
    /Timeout: (.+)/,
    /timeout: (.+)/
  ];

  // 遍历日志目录
  for (const logDir of AUTO_EXTRACT_CONFIG.logDirectories) {
    if (!fs.existsSync(logDir)) continue;

    try {
      const files = fs.readdirSync(logDir);
      for (const file of files) {
        if (file.endsWith('.log') || file.endsWith('.txt')) {
          const filePath = path.join(logDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');

          for (const line of lines) {
            for (const pattern of errorPatterns) {
              const match = line.match(pattern);
              if (match) {
                issues.push({
                  message: match[1].trim(),
                  source: file,
                  timestamp: new Date().toISOString()
                });
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`提取日志失败: ${error.message}`);
    }
  }

  return issues;
}

/**
 * 分析错误模式并提取经验教训
 */
function analyzeErrorPatterns() {
  const issues = extractIssuesFromLogs();
  if (issues.length === 0) return;

  // 按错误消息分组
  const errorGroups = issues.reduce((acc, issue) => {
    const key = issue.message.substring(0, 100); // 使用前100个字符作为键
    if (!acc[key]) {
      acc[key] = {
        message: issue.message,
        count: 0,
        sources: new Set()
      };
    }
    acc[key].count++;
    acc[key].sources.add(issue.source);
    return acc;
  }, {});

  // 提取有意义的经验教训
  const lessons = loadLessons();
  const today = new Date().toISOString().split('T')[0];
  const todayLessons = lessons.filter(lesson => lesson.created.startsWith(today));

  if (todayLessons.length >= AUTO_EXTRACT_CONFIG.maxLessonsPerDay) {
    console.log('今天已达到最大经验教训提取数量');
    return;
  }

  for (const [key, group] of Object.entries(errorGroups)) {
    if (group.count >= AUTO_EXTRACT_CONFIG.minErrorCount) {
      // 检查是否已经存在类似的教训
      const similarLesson = lessons.find(lesson => 
        lesson.lesson.toLowerCase().includes(group.message.toLowerCase().substring(0, 50))
      );

      if (!similarLesson) {
        // 自动创建经验教训
        const lesson = `避免 ${group.message.substring(0, 100)}`;
        const story = `系统多次遇到以下错误：\n${group.message}\n\n出现次数：${group.count}\n来源文件：${Array.from(group.sources).join(', ')}`;
        const triggers = extractTriggers(group.message);
        const relatedTopics = extractRelatedTopics(group.message);

        const lessonId = addLesson(lesson, story, triggers, relatedTopics);
        console.log(`[经验教训] 自动提取新教训: ${lessonId}`);
      }
    }
  }
}

/**
 * 从错误消息中提取触发词
 * @param {string} message - 错误消息
 * @returns {Array} 触发词列表
 */
function extractTriggers(message) {
  const triggers = [];
  const commonTriggers = [
    '错误', '失败', '超时', '无法', '不能', '异常', '问题',
    'Error', 'Failed', 'Timeout', 'Cannot', 'Exception', 'Problem'
  ];

  for (const trigger of commonTriggers) {
    if (message.includes(trigger)) {
      triggers.push(trigger);
    }
  }

  return triggers.length > 0 ? triggers : ['错误'];
}

/**
 * 从错误消息中提取相关主题
 * @param {string} message - 错误消息
 * @returns {Array} 相关主题列表
 */
function extractRelatedTopics(message) {
  const topics = [];
  const topicPatterns = {
    '网络': ['network', '网络', '连接', '请求', '响应'],
    '文件': ['file', '文件', '读写', '路径'],
    '数据库': ['database', '数据库', 'SQL', 'MongoDB', 'Redis'],
    '内存': ['memory', '内存', '堆', '栈'],
    'CPU': ['cpu', '处理器', '计算'],
    '权限': ['permission', '权限', '访问', '授权'],
    '配置': ['config', '配置', '设置', '参数']
  };

  for (const [topic, keywords] of Object.entries(topicPatterns)) {
    for (const keyword of keywords) {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        topics.push(topic);
        break;
      }
    }
  }

  return topics.length > 0 ? topics : ['系统'];
}

/**
 * 应用经验教训到系统中
 * @param {string} context - 上下文信息
 * @returns {Array} 应用的经验教训列表
 */
function applyLessons(context) {
  const matches = checkLessons(context);
  const appliedLessons = [];

  for (const match of matches) {
    if (match.score > 2) { // 只应用分数较高的教训
      appliedLessons.push({
        lesson: match.lesson,
        score: match.score,
        reasons: match.reasons,
        action: generateActionFromLesson(match.lesson)
      });
    }
  }

  return appliedLessons;
}

/**
 * 从经验教训生成行动建议
 * @param {Object} lesson - 经验教训
 * @returns {string} 行动建议
 */
function generateActionFromLesson(lesson) {
  const lessonText = lesson.lesson.toLowerCase();
  
  if (lessonText.includes('网络')) {
    return '检查网络连接，确保网络稳定';
  } else if (lessonText.includes('文件')) {
    return '检查文件路径和权限，确保文件存在且可访问';
  } else if (lessonText.includes('内存')) {
    return '优化内存使用，考虑增加内存或减少内存消耗';
  } else if (lessonText.includes('超时')) {
    return '增加超时时间，检查服务响应速度';
  } else if (lessonText.includes('权限')) {
    return '检查权限设置，确保有足够的访问权限';
  } else {
    return '根据经验教训调整系统配置';
  }
}

/**
 * 启动自动经验教训提取服务
 */
function startAutoExtraction() {
  if (!AUTO_EXTRACT_CONFIG.enabled) {
    console.log('自动经验教训提取已禁用');
    return;
  }

  console.log('启动自动经验教训提取服务');
  
  // 立即执行一次
  analyzeErrorPatterns();
  
  // 设置定时任务
  setInterval(() => {
    analyzeErrorPatterns();
  }, AUTO_EXTRACT_CONFIG.extractionInterval);
}

/**
 * 获取经验教训统计信息
 * @returns {Object} 统计信息
 */
function getLessonStatistics() {
  const lessons = loadLessons();
  const stats = {
    total: lessons.length,
    byTopic: {},
    byMonth: {},
    mostMatched: []
  };

  // 按主题统计
  for (const lesson of lessons) {
    for (const topic of lesson.related_topics || []) {
      stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
    }
  }

  // 按月份统计
  for (const lesson of lessons) {
    const month = lesson.created.substring(0, 7); // YYYY-MM
    stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
  }

  // 最常匹配的教训
  stats.mostMatched = lessons
    .sort((a, b) => (b.times_matched || 0) - (a.times_matched || 0))
    .slice(0, 5);

  return stats;
}

module.exports = {
  loadLessons,
  saveLessons,
  generateId,
  addLesson,
  checkLessons,
  listLessons,
  getLesson,
  exportLessons,
  expandSynonyms,
  matchRulePatterns,
  extractIssuesFromLogs,
  analyzeErrorPatterns,
  applyLessons,
  startAutoExtraction,
  getLessonStatistics
};
