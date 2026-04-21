/**
 * 模糊匹配工具
 * 用于技能搜索和匹配
 */

function fuzzyMatch(query, text) {
  /**
   * 计算查询字符串与文本的相似度
   * @param {string} query - 查询字符串
   * @param {string} text - 待匹配的文本
   * @returns {number} 相似度分数 (0-1)
   */
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // 完全匹配
  if (textLower === queryLower) return 1;
  
  // 包含匹配
  if (textLower.includes(queryLower)) return 0.8;
  
  // 前缀匹配
  if (textLower.startsWith(queryLower)) return 0.9;
  
  // 计算编辑距离
  const distance = levenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  const score = 1 - (distance / maxLength);
  
  return Math.max(0, score);
}

function levenshteinDistance(a, b) {
  /**
   * 计算两个字符串之间的编辑距离
   * @param {string} a - 第一个字符串
   * @param {string} b - 第二个字符串
   * @returns {number} 编辑距离
   */
  const matrix = [];
  
  // 初始化矩阵
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // 填充矩阵
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替换
          matrix[i][j - 1] + 1,     // 插入
          matrix[i - 1][j] + 1      // 删除
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

function findBestMatch(query, items) {
  /**
   * 找到与查询最匹配的项目
   * @param {string} query - 查询字符串
   * @param {Array} items - 待匹配的项目数组
   * @returns {Object} 最匹配的项目和分数
   */
  if (!items || items.length === 0) return null;
  
  let bestMatch = null;
  let bestScore = 0;
  
  items.forEach(item => {
    let score = 0;
    
    // 检查item是否有name、description等属性
    if (item.name) {
      score += fuzzyMatch(query, item.name) * 0.6;
    }
    if (item.description) {
      score += fuzzyMatch(query, item.description) * 0.3;
    }
    if (item.tags && Array.isArray(item.tags)) {
      const tagScores = item.tags.map(tag => fuzzyMatch(query, tag));
      const maxTagScore = Math.max(...tagScores);
      score += maxTagScore * 0.1;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  });
  
  return bestMatch ? { item: bestMatch, score: bestScore } : null;
}

module.exports = {
  fuzzyMatch,
  findBestMatch
};
