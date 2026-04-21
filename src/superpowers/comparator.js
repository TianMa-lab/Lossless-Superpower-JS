const fs = require('fs');
const path = require('path');

class Comparator {
  constructor(config) {
    this.config = {
      analysisPath: 'D:\\opensource\\analysis-results',
      currentSystemPath: 'C:\\Users\\55237\\Lossless-Superpower-JS',
      comparisonPath: 'D:\\opensource\\comparison-results',
      ...config
    };
    
    // 创建比较结果目录
    if (!fs.existsSync(this.config.comparisonPath)) {
      fs.mkdirSync(this.config.comparisonPath, { recursive: true });
    }
  }

  async compareAllProjects() {
    const results = [];
    const projects = ['hermes', 'openclaw', 'awesome-kgr', 'superpower'];
    
    for (const projectId of projects) {
      try {
        const result = await this.compareProject(projectId);
        results.push(result);
      } catch (error) {
        results.push({
          project: projectId,
          status: 'error',
          message: error.message
        });
      }
    }
    
    return results;
  }

  async compareProject(projectId) {
    const analysisFile = path.join(this.config.analysisPath, `${projectId}_analysis.json`);
    const comparisonFile = path.join(this.config.comparisonPath, `${projectId}_comparison.json`);
    
    try {
      // 读取分析结果
      if (!fs.existsSync(analysisFile)) {
        throw new Error(`分析结果文件不存在: ${analysisFile}`);
      }
      
      const analysis = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
      
      // 分析当前系统
      const currentSystem = this.analyzeCurrentSystem();
      
      // 比较功能
      const featureComparison = this.compareFeatures(analysis.coreFeatures, currentSystem.features);
      
      // 比较技术栈
      const techComparison = this.compareTechStack(analysis.techStack, currentSystem.techStack);
      
      // 比较API
      const apiComparison = this.compareAPI(analysis.api, currentSystem.api);
      
      // 生成建议
      const recommendations = this.generateRecommendations(featureComparison, techComparison, apiComparison);
      
      const comparison = {
        project: analysis.project,
        timestamp: new Date().toISOString(),
        featureComparison,
        techComparison,
        apiComparison,
        recommendations
      };
      
      // 保存比较结果
      fs.writeFileSync(comparisonFile, JSON.stringify(comparison, null, 2));
      
      return {
        project: analysis.project,
        status: 'success',
        comparison
      };
    } catch (error) {
      throw error;
    }
  }

  analyzeCurrentSystem() {
    const currentSystem = {
      features: [
        '知识图谱推理',
        'DAG-KG提取对齐',
        '自动迭代记录',
        '技能系统',
        '插件系统',
        '永久记忆',
        '自我进化',
        '飞书集成'
      ],
      techStack: {
        languages: ['JavaScript'],
        dependencies: ['uuid', 'fs', 'path', 'child_process'],
        frameworks: ['Node.js']
      },
      api: {
        endpoints: ['知识图谱API', 'DAG API', '技能API', '插件API', '记忆API'],
        methods: ['createEmbedding', 'createPathReasoner', 'createGNNReasoner', 'createRuleReasoner', 'createTemporalReasoner']
      }
    };
    
    return currentSystem;
  }

  compareFeatures(projectFeatures, currentFeatures) {
    const comparison = {
      projectFeatures,
      currentFeatures,
      missingFeatures: [],
      existingFeatures: [],
      potentialFeatures: [],
      similarFeatures: [],
      featureMatchScore: 0
    };
    
    let matchCount = 0;
    let totalFeatures = projectFeatures.length;
    
    projectFeatures.forEach(feature => {
      // 精确匹配
      if (currentFeatures.includes(feature)) {
        comparison.existingFeatures.push(feature);
        matchCount++;
      } else {
        // 模糊匹配
        const similarFeature = this.findSimilarFeature(feature, currentFeatures);
        if (similarFeature) {
          comparison.similarFeatures.push({
            projectFeature: feature,
            currentFeature: similarFeature
          });
          matchCount += 0.5; // 部分匹配
        } else {
          comparison.missingFeatures.push(feature);
        }
      }
    });
    
    // 计算匹配分数
    comparison.featureMatchScore = totalFeatures > 0 ? 
      Math.round((matchCount / totalFeatures) * 100) : 0;
    
    // 分析潜在的功能
    comparison.potentialFeatures = this.identifyPotentialFeatures(projectFeatures, currentFeatures);
    
    return comparison;
  }
  
  // 查找相似功能
  findSimilarFeature(feature, currentFeatures) {
    const featureLower = feature.toLowerCase();
    
    for (const currentFeature of currentFeatures) {
      const currentLower = currentFeature.toLowerCase();
      
      // 检查是否包含相同的关键词
      const featureWords = featureLower.split(/\s+/);
      const currentWords = currentLower.split(/\s+/);
      
      const commonWords = featureWords.filter(word => currentWords.includes(word));
      
      // 如果有超过50%的关键词匹配，则认为是相似功能
      if (commonWords.length > featureWords.length * 0.5) {
        return currentFeature;
      }
      
      // 检查子串匹配
      if (featureLower.includes(currentLower) || currentLower.includes(featureLower)) {
        return currentFeature;
      }
    }
    
    return null;
  }

  compareTechStack(projectTechStack, currentTechStack) {
    const comparison = {
      projectTechStack,
      currentTechStack,
      missingLanguages: [],
      missingDependencies: [],
      missingFrameworks: [],
      missingBuildTools: [],
      missingDatabases: [],
      techStackMatchScore: 0,
      detailedMatchScores: {}
    };
    
    let totalMatchScore = 0;
    let totalCategories = 0;
    
    // 比较语言
    const languageMatch = this.compareArray(projectTechStack.languages || [], currentTechStack.languages || []);
    comparison.missingLanguages = languageMatch.missing;
    comparison.detailedMatchScores.languages = languageMatch.matchScore;
    totalMatchScore += languageMatch.matchScore;
    totalCategories++;
    
    // 比较依赖
    const dependencyMatch = this.compareArray(projectTechStack.dependencies || [], currentTechStack.dependencies || []);
    comparison.missingDependencies = dependencyMatch.missing;
    comparison.detailedMatchScores.dependencies = dependencyMatch.matchScore;
    totalMatchScore += dependencyMatch.matchScore;
    totalCategories++;
    
    // 比较框架
    const frameworkMatch = this.compareArray(projectTechStack.frameworks || [], currentTechStack.frameworks || []);
    comparison.missingFrameworks = frameworkMatch.missing;
    comparison.detailedMatchScores.frameworks = frameworkMatch.matchScore;
    totalMatchScore += frameworkMatch.matchScore;
    totalCategories++;
    
    // 比较构建工具
    const buildToolMatch = this.compareArray(projectTechStack.buildTools || [], currentTechStack.buildTools || []);
    comparison.missingBuildTools = buildToolMatch.missing;
    comparison.detailedMatchScores.buildTools = buildToolMatch.matchScore;
    totalMatchScore += buildToolMatch.matchScore;
    totalCategories++;
    
    // 比较数据库
    const databaseMatch = this.compareArray(projectTechStack.databases || [], currentTechStack.databases || []);
    comparison.missingDatabases = databaseMatch.missing;
    comparison.detailedMatchScores.databases = databaseMatch.matchScore;
    totalMatchScore += databaseMatch.matchScore;
    totalCategories++;
    
    // 计算总体匹配分数
    comparison.techStackMatchScore = totalCategories > 0 ? 
      Math.round((totalMatchScore / totalCategories) * 100) : 0;
    
    return comparison;
  }
  
  // 比较数组并计算匹配分数
  compareArray(projectItems, currentItems) {
    const missing = [];
    let matchCount = 0;
    const totalItems = projectItems.length;
    
    projectItems.forEach(item => {
      if (currentItems.includes(item)) {
        matchCount++;
      } else {
        missing.push(item);
      }
    });
    
    const matchScore = totalItems > 0 ? 
      Math.round((matchCount / totalItems) * 100) : 100;
    
    return { missing, matchScore };
  }

  compareAPI(projectAPI, currentAPI) {
    const comparison = {
      projectAPI,
      currentAPI,
      missingEndpoints: [],
      missingMethods: []
    };
    
    // 比较端点
    projectAPI.endpoints.forEach(endpoint => {
      if (!currentAPI.endpoints.includes(endpoint)) {
        comparison.missingEndpoints.push(endpoint);
      }
    });
    
    // 比较方法
    projectAPI.methods.forEach(method => {
      if (!currentAPI.methods.includes(method)) {
        comparison.missingMethods.push(method);
      }
    });
    
    return comparison;
  }

  identifyPotentialFeatures(projectFeatures, currentFeatures) {
    // 这里可以根据项目特点识别潜在的功能
    const potentialFeatures = [];
    
    // 示例逻辑
    if (projectFeatures.includes('代理系统') && !currentFeatures.includes('代理系统')) {
      potentialFeatures.push('代理系统');
    }
    
    if (projectFeatures.includes('工作流管理') && !currentFeatures.includes('工作流管理')) {
      potentialFeatures.push('工作流管理');
    }
    
    if (projectFeatures.includes('技能框架') && !currentFeatures.includes('技能框架')) {
      potentialFeatures.push('技能框架');
    }
    
    if (projectFeatures.includes('知识图谱推理算法') && !currentFeatures.includes('高级知识图谱推理算法')) {
      potentialFeatures.push('高级知识图谱推理算法');
    }
    
    return potentialFeatures;
  }

  generateRecommendations(featureComparison, techComparison, apiComparison) {
    const recommendations = [];
    
    // 基于缺失功能的建议
    if (featureComparison.missingFeatures.length > 0) {
      featureComparison.missingFeatures.forEach(feature => {
        recommendations.push({
          type: 'feature',
          priority: 'high',
          title: `实现${feature}功能`,
          description: `从开源项目中借鉴${feature}功能，增强系统能力`
        });
      });
    }
    
    // 基于潜在功能的建议
    if (featureComparison.potentialFeatures.length > 0) {
      featureComparison.potentialFeatures.forEach(feature => {
        recommendations.push({
          type: 'feature',
          priority: 'medium',
          title: `考虑实现${feature}功能`,
          description: `从开源项目中借鉴${feature}功能，提升系统性能`
        });
      });
    }
    
    // 基于技术栈的建议
    if (techComparison.missingFrameworks.length > 0) {
      techComparison.missingFrameworks.forEach(framework => {
        recommendations.push({
          type: 'tech',
          priority: 'medium',
          title: `集成${framework}框架`,
          description: `考虑集成${framework}框架，提升系统技术栈`
        });
      });
    }
    
    // 基于API的建议
    if (apiComparison.missingEndpoints.length > 0) {
      apiComparison.missingEndpoints.forEach(endpoint => {
        recommendations.push({
          type: 'api',
          priority: 'low',
          title: `添加${endpoint}`,
          description: `从开源项目中借鉴${endpoint}，丰富系统API`
        });
      });
    }
    
    return recommendations;
  }
}

module.exports = Comparator;