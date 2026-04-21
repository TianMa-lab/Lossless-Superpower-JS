/**
 * 经验教训管理工具
 */

const fs = require('fs');
const path = require('path');

// 路径配置
const KNOWLEDGE_DIR = path.join(__dirname);
const LESSONS_FILE = path.join(KNOWLEDGE_DIR, 'lessons.json');
const EMBEDDINGS_FILE = path.join(KNOWLEDGE_DIR, 'lesson_embeddings.json');

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
  matchRulePatterns
};
