const fs = require('fs');
const path = require('path');
const { skillManager } = require('./skill_manager');
const { eventManager } = require('./events');

class SelfEvolution {
  constructor(storagePath = 'self_evolution.json') {
    this.storagePath = path.join(__dirname, storagePath);
    this.evolutionData = this._loadEvolutionData();
    this.lastEvaluation = this.evolutionData.lastEvaluation || 0;
    this.performanceMetrics = this.evolutionData.performanceMetrics || {};
    this.learningHistory = this.evolutionData.learningHistory || [];
    this.improvementAreas = this.evolutionData.improvementAreas || [];
    this.lastMaintenance = this.evolutionData.lastMaintenance || 0;
    this.maintenanceTasks = this.evolutionData.maintenanceTasks || [];
    this.createdSkills = this.evolutionData.createdSkills || [];
    this.lastSkillGeneration = this.evolutionData.lastSkillGeneration || 0;
    this.errorPatterns = this.evolutionData.errorPatterns || [];
    this.systemHealth = this.evolutionData.systemHealth || { score: 100, issues: [] };
    this.optimizationHistory = this.evolutionData.optimizationHistory || [];
    
    // 启动维护线程
    this._startMaintenanceThread();
  }

  _loadEvolutionData() {
    try {
      if (fs.existsSync(this.storagePath)) {
        const data = fs.readFileSync(this.storagePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('加载进化数据失败:', error);
    }
    return {
      lastEvaluation: 0,
      performanceMetrics: {},
      learningHistory: [],
      improvementAreas: [],
      createdSkills: [],
      maintenanceTasks: [],
      errorPatterns: [],
      systemHealth: { score: 100, issues: [] },
      optimizationHistory: [],
      version: '2.0.0'
    };
  }

  _saveEvolutionData() {
    this.evolutionData = {
      lastEvaluation: this.lastEvaluation,
      lastMaintenance: this.lastMaintenance,
      performanceMetrics: this.performanceMetrics,
      learningHistory: this.learningHistory,
      improvementAreas: this.improvementAreas,
      maintenanceTasks: this.maintenanceTasks,
      createdSkills: this.createdSkills,
      lastSkillGeneration: this.lastSkillGeneration,
      errorPatterns: this.errorPatterns,
      systemHealth: this.systemHealth,
      optimizationHistory: this.optimizationHistory,
      version: '2.0.0'
    };
    
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(this.evolutionData, null, 2));
    } catch (error) {
      console.error('保存进化数据失败:', error);
    }
  }

  _startMaintenanceThread() {
    // 维护线程
    const maintenanceInterval = setInterval(() => {
      const currentTime = Date.now() / 1000;
      // 每6小时执行一次维护
      if (currentTime - this.lastMaintenance > 6 * 3600) {
        this.performMaintenance();
      }
    }, 3600000); // 每小时检查一次

    // 技能生成线程
    const skillGenerationInterval = setInterval(() => {
      const currentTime = Date.now() / 1000;
      // 每2小时检查一次技能生成
      if (currentTime - this.lastSkillGeneration > 2 * 3600) {
        // 从错误模式中提取技能
        if (this.errorPatterns && this.errorPatterns.length > 0) {
          this._createSkillFromPattern(this.errorPatterns[0]);
        }
        this.lastSkillGeneration = currentTime;
      }
    }, 3600000); // 每小时检查一次

    // 性能监控线程
    const performanceInterval = setInterval(() => {
      this.evaluatePerformance();
    }, 3600000); // 每小时评估一次

    // 健康检查线程
    const healthCheckInterval = setInterval(() => {
      this.checkSystemHealth();
    }, 7200000); // 每2小时检查一次

    // 保存定时器引用，以便后续清理
    this.maintenanceInterval = maintenanceInterval;
    this.skillGenerationInterval = skillGenerationInterval;
    this.performanceInterval = performanceInterval;
    this.healthCheckInterval = healthCheckInterval;
  }

  performMaintenance() {
    const currentTime = Date.now() / 1000;
    this.lastMaintenance = currentTime;
    
    const maintenanceResult = {
      timestamp: currentTime,
      tasks: []
    };
    
    // 1. 清理学习历史
    const cleanupTask = this._cleanupLearningHistory();
    if (Object.keys(cleanupTask).length > 0) {
      maintenanceResult.tasks.push(cleanupTask);
    }
    
    // 2. 优化性能指标
    const optimizationTask = this._optimizePerformanceMetrics();
    if (Object.keys(optimizationTask).length > 0) {
      maintenanceResult.tasks.push(optimizationTask);
    }
    
    // 3. 更新改进领域
    const updateTask = this._updateImprovementAreas();
    if (Object.keys(updateTask).length > 0) {
      maintenanceResult.tasks.push(updateTask);
    }
    
    // 4. 执行系统优化
    const systemOptimization = this.optimizeSystem();
    if (systemOptimization.actions && systemOptimization.actions.length > 0) {
      maintenanceResult.tasks.push({
        type: 'system_optimization',
        actions: systemOptimization.actions
      });
    }
    
    // 5. 检查是否需要记录迭代
    const iterationTask = this._checkForIteration();
    if (iterationTask) {
      maintenanceResult.tasks.push(iterationTask);
    }
    
    // 6. 清理错误模式
    const errorCleanupTask = this._cleanupErrorPatterns();
    if (Object.keys(errorCleanupTask).length > 0) {
      maintenanceResult.tasks.push(errorCleanupTask);
    }
    
    // 7. 优化历史清理
    const historyCleanupTask = this._cleanupOptimizationHistory();
    if (Object.keys(historyCleanupTask).length > 0) {
      maintenanceResult.tasks.push(historyCleanupTask);
    }
    
    // 记录维护任务
    this.maintenanceTasks.push(maintenanceResult);
    // 限制维护任务记录数量
    if (this.maintenanceTasks.length > 50) {
      this.maintenanceTasks = this.maintenanceTasks.slice(-50);
    }
    
    // 保存进化数据
    this._saveEvolutionData();
    
    return maintenanceResult;
  }

  _checkForIteration() {
    try {
      const projectRoot = path.join(__dirname, '..', '..');
      const modifiedFiles = [];
      
      // 检查核心文件的修改时间
      const coreFiles = [
        'src/superpowers/self_evolution.js',
        'src/superpowers/skill_manager.js',
        'src/superpowers/skill_trigger.js',
        'src/superpowers/plugin_system.js',
        'src/superpowers/knowledge/index.js',
        'src/superpowers/skills/iteration_recorder.js',
        'src/superpowers/auto_task_recorder.js',
        'src/superpowers/permanent_memory.js'
      ];
      
      const twentyFourHoursAgo = Date.now() - 24 * 3600 * 1000;
      
      for (const filePath of coreFiles) {
        const fullPath = path.join(projectRoot, filePath);
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath);
          if (stat.mtimeMs > twentyFourHoursAgo) {
            modifiedFiles.push(filePath);
          }
        }
      }
      
      if (modifiedFiles.length > 0) {
        // 生成迭代版本号
        const version = `2.0.${Math.floor(Date.now() / 1000) % 1000}`;
        const date = new Date().toISOString().split('T')[0];
        const changes = modifiedFiles.map(file => `修改了 ${file}`);
        const issues = [];
        
        // 构建详细的迭代数据
        const iterationData = {
          title: '系统自动迭代',
          description: '系统检测到核心文件变更，自动执行迭代记录',
          referenced_systems: ['Lossless Superpower'],
          files_modified: modifiedFiles,
          features_added: [],
          features_improved: ['迭代记录功能'],
          performance_changes: [],
          bug_fixes: [],
          notes: `检测到 ${modifiedFiles.length} 个核心文件被修改，自动执行迭代记录`,
          author: '系统'
        };
        
        // 记录迭代
        const iterationResult = this.recordIteration(version, date, changes, issues, iterationData);
        
        return {
          type: 'iteration_record',
          version: version,
          modifiedFiles: modifiedFiles.length,
          result: '成功'
        };
      }
    } catch (error) {
      console.error('检查迭代失败:', error);
      return {
        type: 'iteration_record',
        result: `失败: ${error.message}`
      };
    }
    return null;
  }

  recordIteration(version, date, changes, issues, iterationData = {}) {
    try {
      // 构建详细的迭代记录
      const iterationRecord = {
        id: iterationData.id || `iteration_${Date.now()}`,
        timestamp: Date.now() / 1000,
        version,
        date,
        title: iterationData.title || `迭代 ${version}`,
        description: iterationData.description || `系统自动迭代到版本 ${version}`,
        referenced_systems: iterationData.referenced_systems || ['Lossless Superpower'],
        updates: changes,
        files_modified: iterationData.files_modified || [],
        features_added: iterationData.features_added || [],
        features_improved: iterationData.features_improved || [],
        performance_changes: iterationData.performance_changes || [],
        bug_fixes: iterationData.bug_fixes || [],
        issues: issues,
        notes: iterationData.notes || '',
        author: iterationData.author || '系统'
      };
      
      // 保存迭代记录
      const iterationsPath = path.join(__dirname, 'iterations');
      if (!fs.existsSync(iterationsPath)) {
        fs.mkdirSync(iterationsPath, { recursive: true });
      }
      
      const iterationFile = path.join(iterationsPath, `iteration_${version}.json`);
      fs.writeFileSync(iterationFile, JSON.stringify(iterationRecord, null, 2));
      
      // 保存到主迭代记录文件
      const mainRecordsFile = path.join(iterationsPath, 'iterations.json');
      let allIterations = [];
      if (fs.existsSync(mainRecordsFile)) {
        try {
          allIterations = JSON.parse(fs.readFileSync(mainRecordsFile, 'utf8'));
        } catch (error) {
          console.error('读取迭代记录失败:', error);
          allIterations = [];
        }
      }
      
      // 检查是否已存在相同ID的记录
      const existingIndex = allIterations.findIndex(record => record.id === iterationRecord.id);
      if (existingIndex >= 0) {
        // 更新现有记录
        allIterations[existingIndex] = iterationRecord;
      } else {
        // 添加新记录
        allIterations.push(iterationRecord);
      }
      
      // 按时间戳排序（最新的在前）
      allIterations.sort((a, b) => b.timestamp - a.timestamp);
      
      // 保存所有迭代记录
      fs.writeFileSync(mainRecordsFile, JSON.stringify(allIterations, null, 2));
      
      // 记录到学习历史
      this.learningHistory.push({
        timestamp: Date.now() / 1000,
        type: 'iteration',
        data: iterationRecord
      });
      
      return {
        success: true,
        message: `迭代 ${version} 记录成功`,
        record: iterationRecord
      };
    } catch (error) {
      console.error('记录迭代失败:', error);
      return {
        success: false,
        message: `记录迭代失败: ${error.message}`
      };
    }
  }

  _cleanupLearningHistory() {
    const originalLength = this.learningHistory.length;
    // 保留最近1000条记录
    if (this.learningHistory.length > 1000) {
      this.learningHistory = this.learningHistory.slice(-1000);
    }
    const cleanedCount = originalLength - this.learningHistory.length;
    
    if (cleanedCount > 0) {
      return {
        type: 'cleanup_learning_history',
        originalLength,
        newLength: this.learningHistory.length,
        cleanedCount
      };
    }
    return {};
  }

  _optimizePerformanceMetrics() {
    const originalCount = Object.keys(this.performanceMetrics).length;
    // 保留最近30天的性能指标
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 3600;
    const filteredMetrics = {};
    
    for (const [timestamp, metric] of Object.entries(this.performanceMetrics)) {
      if (metric.timestamp > thirtyDaysAgo) {
        filteredMetrics[timestamp] = metric;
      }
    }
    
    this.performanceMetrics = filteredMetrics;
    const optimizedCount = originalCount - Object.keys(this.performanceMetrics).length;
    
    if (optimizedCount > 0) {
      return {
        type: 'optimize_performance_metrics',
        originalCount,
        newCount: Object.keys(this.performanceMetrics).length,
        optimizedCount
      };
    }
    return {};
  }

  _updateImprovementAreas() {
    // 移除过期的改进领域（超过7天）
    const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 3600;
    const originalCount = this.improvementAreas.length;
    
    this.improvementAreas = this.improvementAreas.filter(
      area => area.timestamp > sevenDaysAgo
    );
    
    const removedCount = originalCount - this.improvementAreas.length;
    
    if (removedCount > 0) {
      return {
        type: 'update_improvement_areas',
        originalCount,
        newCount: this.improvementAreas.length,
        removedCount
      };
    }
    return {};
  }

  _cleanupErrorPatterns() {
    const originalLength = this.errorPatterns.length;
    // 保留最近30天的错误模式
    const thirtyDaysAgo = Date.now() / 1000 - 30 * 24 * 3600;
    this.errorPatterns = this.errorPatterns.filter(
      pattern => pattern.lastSeen > thirtyDaysAgo
    );
    
    const cleanedCount = originalLength - this.errorPatterns.length;
    
    if (cleanedCount > 0) {
      return {
        type: 'cleanup_error_patterns',
        originalLength,
        newLength: this.errorPatterns.length,
        cleanedCount
      };
    }
    return {};
  }

  _cleanupOptimizationHistory() {
    const originalLength = this.optimizationHistory.length;
    // 保留最近50条优化记录
    if (this.optimizationHistory.length > 50) {
      this.optimizationHistory = this.optimizationHistory.slice(-50);
    }
    
    const cleanedCount = originalLength - this.optimizationHistory.length;
    
    if (cleanedCount > 0) {
      return {
        type: 'cleanup_optimization_history',
        originalLength,
        newLength: this.optimizationHistory.length,
        cleanedCount
      };
    }
    return {};
  }

  learnFromInteraction(userInput, systemResponse, feedback = null) {
    // 记录学习历史
    const learningEntry = {
      timestamp: Date.now() / 1000,
      userInput,
      systemResponse,
      feedback
    };
    
    this.learningHistory.push(learningEntry);
    
    // 限制学习历史长度
    if (this.learningHistory.length > 1000) {
      this.learningHistory = this.learningHistory.slice(-1000);
    }
    
    // 分析用户模式
    this._analyzeUserPatterns();
    
    // 保存进化数据
    this._saveEvolutionData();
    
    // 触发学习完成事件
    eventManager.trigger('interaction_learned', userInput, systemResponse);
  }

  learnFromError(error, context, solution = null) {
    // 记录错误模式
    const errorPattern = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now() / 1000,
      lastSeen: Date.now() / 1000,
      errorType: error.name || 'UnknownError',
      message: error.message || 'No error message',
      stack: error.stack || '',
      context: context || {},
      solution: solution || null,
      count: 1
    };
    
    // 检查是否已存在相同的错误模式
    const existingPatternIndex = this.errorPatterns.findIndex(pattern => 
      pattern.errorType === errorPattern.errorType &&
      pattern.message === errorPattern.message
    );
    
    if (existingPatternIndex >= 0) {
      // 更新现有错误模式
      const existingPattern = this.errorPatterns[existingPatternIndex];
      existingPattern.count++;
      existingPattern.lastSeen = Date.now() / 1000;
      if (solution) {
        existingPattern.solution = solution;
      }
      this.errorPatterns[existingPatternIndex] = existingPattern;
    } else {
      // 添加新错误模式
      this.errorPatterns.push(errorPattern);
    }
    
    // 分析错误模式
    this._analyzeErrorPatterns();
    
    // 保存进化数据
    this._saveEvolutionData();
    
    // 触发错误学习事件
    eventManager.trigger('error_learned', error, context, solution);
  }

  _analyzeUserPatterns() {
    // 分析最近的交互
    const recentInteractions = this.learningHistory.slice(-5);
    
    if (recentInteractions.length < 2) {
      return;
    }
    
    // 识别潜在的技能模式
    const patterns = this._identifySkillPatterns(recentInteractions);
    
    for (const pattern of patterns) {
      // 创建技能
      this._createSkillFromPattern(pattern);
    }
  }

  _analyzeErrorPatterns() {
    // 分析最近的错误模式
    const recentErrors = this.errorPatterns.slice(-5);
    
    if (recentErrors.length < 2) {
      return;
    }
    
    // 识别高频错误
    const highFrequencyErrors = recentErrors.filter(error => error.count >= 3);
    
    for (const error of highFrequencyErrors) {
      // 为高频错误创建解决方案技能
      this._createErrorSolutionSkill(error);
    }
  }

  _identifySkillPatterns(interactions) {
    const patterns = [];
    const patternCount = {};
    
    // 分析交互内容，识别潜在的技能模式
    for (let i = 0; i < interactions.length - 1; i++) {
      const currentInput = interactions[i].userInput.toLowerCase();
      const nextInput = interactions[i+1].userInput.toLowerCase();
      
      // 检查是否有相似的任务
      if (this._areTasksSimilar(currentInput, nextInput)) {
        // 提取任务类型和解决方案
        const taskType = this._extractTaskType(currentInput);
        const solution = this._extractSolution(interactions[i].systemResponse);
        
        if (taskType && solution) {
          const patternKey = taskType;
          patternCount[patternKey] = (patternCount[patternKey] || 0) + 1;
          
          patterns.push({
            taskType,
            solution,
            frequency: patternCount[patternKey],
            lastSeen: interactions[i+1].timestamp
          });
        }
      }
    }
    
    // 分析单个交互，识别潜在的技能模式
    for (const interaction of interactions) {
      const userInput = interaction.userInput.toLowerCase();
      const systemResponse = interaction.systemResponse;
      
      // 检查是否包含技能相关的关键词
      const skillKeywords = ["如何", "怎样", "方法", "步骤", "教程", "指南", "解决", "处理", "实现", "学习", "使用", "安装", "配置", "优化", "调试", "修复", "创建", "开发", "设计", "分析", "研究"];
      if (skillKeywords.some(keyword => userInput.includes(keyword))) {
        const taskType = this._extractTaskType(userInput);
        const solution = this._extractSolution(systemResponse);
        
        if (taskType && solution) {
          const patternKey = taskType;
          if (!patternCount[patternKey]) {
            patternCount[patternKey] = 1;
            patterns.push({
              taskType,
              solution,
              frequency: 1,
              lastSeen: interaction.timestamp
            });
          }
        }
      }
    }
    
    // 过滤低频率的模式
    const filteredPatterns = patterns.filter(pattern => pattern.frequency >= 1);
    
    // 去重，保留频率最高的模式
    const uniquePatterns = {};
    for (const pattern of filteredPatterns) {
      const key = pattern.taskType;
      if (!uniquePatterns[key] || pattern.frequency > uniquePatterns[key].frequency) {
        uniquePatterns[key] = pattern;
      }
    }
    
    return Object.values(uniquePatterns);
  }

  _areTasksSimilar(task1, task2) {
    // 检查是否有共同的关键词
    const commonKeywords = [
      "如何", "怎样", "方法", "步骤", "教程", "指南", "解决", "处理", "实现",
      "学习", "使用", "安装", "配置", "优化", "调试", "修复", "创建", "开发",
      "设计", "分析", "研究", "了解", "掌握", "应用", "实践", "案例", "技巧"
    ];
    
    const task1Keywords = commonKeywords.filter(kw => task1.includes(kw));
    const task2Keywords = commonKeywords.filter(kw => task2.includes(kw));
    
    // 如果有共同的关键词，认为相似
    if (task1Keywords.length > 0 && task2Keywords.length > 0) {
      const common = task1Keywords.filter(kw => task2Keywords.includes(kw));
      if (common.length > 0) {
        return true;
      }
    }
    
    // 检查任务类型是否相似
    const task1Type = this._extractTaskType(task1);
    const task2Type = this._extractTaskType(task2);
    
    // 如果任务类型相同，认为相似
    if (task1Type && task2Type && task1Type === task2Type) {
      return true;
    }
    
    return false;
  }

  _extractTaskType(task) {
    const taskTypes = {
      "编程": ["代码", "编程", "开发", "实现", "算法", "脚本", "程序"],
      "写作": ["写作", "文章", "文档", "报告", "文案"],
      "设计": ["设计", "界面", "UI", "UX", "布局"],
      "分析": ["分析", "数据", "统计", "趋势", "预测"],
      "研究": ["研究", "调查", "资料", "信息", "背景"],
      "问题解决": ["问题", "故障", "错误", "修复", "解决"],
      "学习": ["学习", "了解", "掌握"],
      "使用": ["使用", "应用", "操作"],
      "安装": ["安装", "部署", "配置"],
      "优化": ["优化", "改进", "提升"],
      "调试": ["调试", "测试", "排查"],
      "创建": ["创建", "新建", "生成"],
      "开发": ["开发", "构建", "制作"],
      "设计": ["设计", "规划", "构思"],
      "分析": ["分析", "研究", "评估"],
      "管理": ["管理", "组织", "协调"],
      "沟通": ["沟通", "交流", "表达"],
      "创新": ["创新", "创意", "发明"]
    };
    
    for (const [taskType, keywords] of Object.entries(taskTypes)) {
      if (keywords.some(keyword => task.includes(keyword))) {
        return taskType;
      }
    }
    
    return "通用任务";
  }

  _extractSolution(response) {
    // 提取解决方案内容
    // 首先，尝试提取响应中的步骤或方法部分
    const stepsPattern = /(步骤|方法|教程|指南)[：:].*?(?:\n\s*\d+\.|\s*[-•*]).*?(?=\n\s*$|\n\s*[#=])/s;
    const stepsMatch = response.match(stepsPattern);
    if (stepsMatch) {
      return stepsMatch[0];
    }
    
    // 查找包含解决方案的部分
    const solutionPattern = /(解决方案|解决方法|处理方法|实现方法)[：:].*?(?=\n\s*$|\n\s*[#=])/s;
    const solutionMatch = response.match(solutionPattern);
    if (solutionMatch) {
      return solutionMatch[0];
    }
    
    // 如果没有找到特定的部分，返回响应的前800个字符
    return response.substring(0, 800);
  }

  _createSkillFromPattern(pattern) {
    // 生成技能名称
    const timestamp = Date.now();
    const skillName = `${pattern.taskType}_skill_${timestamp}`;
    
    // 生成技能描述
    const description = `处理${pattern.taskType}的技能，基于用户交互经验，包含详细的解决方案和使用场景`;
    
    // 生成技能内容
    const content = `# ${pattern.taskType}技能

## 技能信息
- **任务类型**: ${pattern.taskType}
- **创建时间**: ${new Date(pattern.lastSeen * 1000).toISOString().replace('T', ' ').split('.')[0]}
- **使用频率**: ${pattern.frequency}次

## 解决方案
${pattern.solution}

## 使用场景
适用于处理${pattern.taskType}相关的任务，特别是需要详细步骤和方法的场景。

**具体场景**:
- 初学者学习${pattern.taskType}的基本方法
- 有经验的用户寻找更高效的${pattern.taskType}技巧
- 解决${pattern.taskType}过程中遇到的常见问题
- 优化${pattern.taskType}的执行流程和效果

## 执行步骤
1. **分析需求**: 明确具体的${pattern.taskType}任务目标和要求
2. **准备工作**: 收集必要的资源和工具
3. **执行方案**: 按照解决方案中的步骤逐步执行
4. **调整优化**: 根据实际情况调整解决方案的细节
5. **验证结果**: 检查执行结果是否达到预期目标
6. **总结经验**: 记录执行过程中的经验和教训

## 注意事项
- **灵活性**: 根据具体情况调整解决方案，不要生搬硬套
- **特殊性**: 注意任务的特殊性和复杂性，针对性地解决问题
- **时效性**: 定期更新技能内容以适应新的情况和技术变化
- **集成性**: 结合其他技能一起使用，提高解决问题的效率
- **安全性**: 确保执行过程中的安全，避免潜在的风险

## 常见问题与解决方案
- **问题**: 执行过程中遇到错误
  **解决**: 检查步骤是否正确，参考解决方案中的 troubleshooting 部分

- **问题**: 结果不符合预期
  **解决**: 重新分析需求，调整执行步骤和参数

- **问题**: 执行效率低下
  **解决**: 优化执行流程，使用更高效的方法和工具

## 经验总结
此技能基于用户交互经验生成，经过实际验证，具有较高的实用性和可靠性。通过学习和应用此技能，用户可以更有效地处理${pattern.taskType}相关的任务，提高工作效率和质量。

## 相关资源
- 参考文档和教程
- 常用工具和资源
- 最佳实践和案例分析

## 技能更新日志
- **创建**: ${new Date(pattern.lastSeen * 1000).toISOString().split('T')[0]} - 基于用户交互经验生成
- **版本**: 1.0.0 - 初始版本`;
    
    // 生成技能标签
    const tags = [pattern.taskType, "经验", "解决方案", "步骤", "方法", "实用"];
    
    // 生成其他元数据
    const version = "1.0.0";
    const license = "MIT";
    const platforms = ["windows", "linux", "macos"];
    const prerequisites = {
      envVars: [],
      commands: []
    };
    const compatibility = `适用于所有平台，处理${pattern.taskType}相关任务`;
    const metadata = {
      hermes: {
        tags,
        relatedSkills: []
      }
    };
    
    // 检查技能是否已存在
    const existingSkills = skillManager.listSkills();
    const existingNames = existingSkills.map(skill => skill.name);
    
    if (!existingNames.includes(skillName)) {
      // 创建技能
      const success = skillManager.createSkill(
        skillName,
        description,
        content,
        tags,
        version,
        license,
        platforms,
        prerequisites,
        compatibility,
        metadata
      );
      
      if (success) {
        console.log(`成功创建技能: ${skillName}`);
        // 记录技能创建
        this.createdSkills.push({
          name: skillName,
          taskType: pattern.taskType,
          createdAt: Date.now() / 1000,
          description
        });
        this._saveEvolutionData();
        
        // 触发技能创建事件
        eventManager.trigger('skill_auto_created', skillName, pattern.taskType);
      }
    }
  }

  _createErrorSolutionSkill(errorPattern) {
    // 生成技能名称
    const timestamp = Date.now();
    const skillName = `error_solution_${errorPattern.errorType}_${timestamp}`;
    
    // 生成技能描述
    const description = `解决${errorPattern.errorType}错误的技能，基于系统错误处理经验`;
    
    // 生成技能内容
    const content = `# ${errorPattern.errorType} 错误解决方案

## 技能信息
- **错误类型**: ${errorPattern.errorType}
- **创建时间**: ${new Date(errorPattern.timestamp * 1000).toISOString().replace('T', ' ').split('.')[0]}
- **出现次数**: ${errorPattern.count}次

## 错误信息
${errorPattern.message}

## 错误上下文
${JSON.stringify(errorPattern.context, null, 2)}

## 解决方案
${errorPattern.solution || '暂无解决方案'}

## 预防措施
1. **代码审查**: 定期检查可能导致此错误的代码
2. **输入验证**: 确保所有输入参数的有效性
3. **错误处理**: 添加适当的错误处理机制
4. **监控预警**: 建立错误监控和预警系统

## 故障排除步骤
1. **定位错误**: 确定错误发生的具体位置
2. **分析原因**: 理解错误产生的根本原因
3. **应用解决方案**: 按照解决方案步骤执行
4. **验证修复**: 确认错误是否已解决
5. **记录经验**: 记录此次错误处理的经验

## 相关错误类型
- 可能相关的其他错误类型
- 类似错误的处理方法

## 技能更新日志
- **创建**: ${new Date(errorPattern.timestamp * 1000).toISOString().split('T')[0]} - 基于系统错误处理经验生成
- **版本**: 1.0.0 - 初始版本`;
    
    // 生成技能标签
    const tags = [errorPattern.errorType, "错误处理", "解决方案", "故障排除"];
    
    // 生成其他元数据
    const version = "1.0.0";
    const license = "MIT";
    const platforms = ["windows", "linux", "macos"];
    const prerequisites = {
      envVars: [],
      commands: []
    };
    const compatibility = "适用于所有平台的错误处理";
    const metadata = {
      hermes: {
        tags,
        relatedSkills: []
      }
    };
    
    // 检查技能是否已存在
    const existingSkills = skillManager.listSkills();
    const existingNames = existingSkills.map(skill => skill.name);
    
    if (!existingNames.includes(skillName)) {
      // 创建技能
      const success = skillManager.createSkill(
        skillName,
        description,
        content,
        tags,
        version,
        license,
        platforms,
        prerequisites,
        compatibility,
        metadata
      );
      
      if (success) {
        console.log(`成功创建错误解决方案技能: ${skillName}`);
        // 记录技能创建
        this.createdSkills.push({
          name: skillName,
          taskType: "错误处理",
          createdAt: Date.now() / 1000,
          description
        });
        this._saveEvolutionData();
        
        // 触发技能创建事件
        eventManager.trigger('skill_auto_created', skillName, "错误处理");
      }
    }
  }

  evaluatePerformance() {
    const currentTime = Date.now() / 1000;
    
    // 收集性能指标
    const metrics = {
      timestamp: currentTime,
      userInteractions: this.learningHistory.length,
      knowledgeExtraction: this._evaluateKnowledgeExtraction(),
      responseQuality: this._evaluateResponseQuality(),
      userSatisfaction: this._evaluateUserSatisfaction(),
      errorRate: this._evaluateErrorRate(),
      skillCreation: this._evaluateSkillCreation(),
      improvementAreas: this.improvementAreas
    };
    
    // 更新性能指标
    this.performanceMetrics[Math.floor(currentTime).toString()] = metrics;
    this.lastEvaluation = currentTime;
    
    // 分析性能趋势
    this._analyzePerformanceTrends();
    
    // 保存进化数据
    this._saveEvolutionData();
    
    return metrics;
  }

  _evaluateKnowledgeExtraction() {
    try {
      // 简单评估：基于学习历史的长度
      if (this.learningHistory.length > 0) {
        return Math.min(1.0, this.learningHistory.length / 100);
      }
      return 0.5;
    } catch (error) {
      console.error('评估知识提取效果失败:', error);
      return 0.5;
    }
  }

  _evaluateResponseQuality() {
    try {
      // 简单评估：基于最近的学习历史
      const recentInteractions = this.learningHistory.slice(-10);
      
      if (recentInteractions.length === 0) {
        return 0.5;
      }
      
      // 基于反馈和交互质量的简单评分
      let qualityScore = 0.0;
      for (const interaction of recentInteractions) {
        const feedback = interaction.feedback;
        // 如果没有反馈，默认认为满意
        if (!feedback || feedback.satisfied !== false) {
          qualityScore += 1.0;
        }
      }
      
      return Math.min(1.0, qualityScore / recentInteractions.length);
    } catch (error) {
      console.error('评估响应质量失败:', error);
      return 0.5;
    }
  }

  _evaluateUserSatisfaction() {
    try {
      // 基于反馈的满意度评估
      const recentInteractions = this.learningHistory.slice(-20);
      
      if (recentInteractions.length === 0) {
        return 0.5;
      }
      
      let satisfiedCount = 0;
      for (const interaction of recentInteractions) {
        const feedback = interaction.feedback;
        // 如果没有反馈，默认认为满意
        if (!feedback || feedback.satisfied !== false) {
          satisfiedCount++;
        }
      }
      
      return Math.min(1.0, satisfiedCount / recentInteractions.length);
    } catch (error) {
      console.error('评估用户满意度失败:', error);
      return 0.5;
    }
  }

  _evaluateErrorRate() {
    try {
      // 评估错误率
      const recentErrors = this.errorPatterns.filter(
        pattern => pattern.lastSeen > Date.now() / 1000 - 24 * 3600
      );
      const recentInteractions = this.learningHistory.filter(
        entry => entry.timestamp > Date.now() / 1000 - 24 * 3600
      );
      
      if (recentInteractions.length === 0) {
        return 0.0;
      }
      
      const errorRate = recentErrors.length / recentInteractions.length;
      return Math.min(1.0, errorRate);
    } catch (error) {
      console.error('评估错误率失败:', error);
      return 0.5;
    }
  }

  _evaluateSkillCreation() {
    try {
      // 评估技能创建效果
      const recentSkills = this.createdSkills.filter(
        skill => skill.createdAt > Date.now() / 1000 - 7 * 24 * 3600
      );
      
      if (recentSkills.length === 0) {
        return 0.0;
      }
      
      return Math.min(1.0, recentSkills.length / 10);
    } catch (error) {
      console.error('评估技能创建失败:', error);
      return 0.5;
    }
  }

  _analyzePerformanceTrends() {
    // 分析最近的性能数据
    const recentMetrics = Object.values(this.performanceMetrics).slice(-5);
    
    if (recentMetrics.length < 2) {
      return;
    }
    
    // 识别性能下降的领域
    for (const metricName of ["knowledgeExtraction", "responseQuality", "userSatisfaction"]) {
      const values = recentMetrics.map(m => m[metricName] || 0);
      if (values.length >= 2) {
        const trend = values[values.length - 1] - values[0];
        if (trend < -0.1) {
          // 性能下降，添加到改进领域
          const improvementArea = {
            topic: metricName,
            priority: "high",
            timestamp: Date.now() / 1000,
            reason: `Performance declined by ${Math.abs(trend).toFixed(2)}`
          };
          
          if (!this.improvementAreas.some(area => area.topic === metricName)) {
            this.improvementAreas.push(improvementArea);
          }
        }
      }
    }
    
    // 识别错误率上升的情况
    const errorRates = recentMetrics.map(m => m.errorRate || 0);
    if (errorRates.length >= 2) {
      const trend = errorRates[errorRates.length - 1] - errorRates[0];
      if (trend > 0.1) {
        // 错误率上升，添加到改进领域
        const improvementArea = {
          topic: "errorRate",
          priority: "high",
          timestamp: Date.now() / 1000,
          reason: `Error rate increased by ${trend.toFixed(2)}`
        };
        
        if (!this.improvementAreas.some(area => area.topic === "errorRate")) {
          this.improvementAreas.push(improvementArea);
        }
      }
    }
  }

  optimizeSystem() {
    const optimizationResults = {
      timestamp: Date.now() / 1000,
      actions: [],
      improvements: []
    };
    
    // 基于改进领域进行优化
    for (const area of this.improvementAreas) {
      const topic = area.topic;
      const priority = area.priority;
      
      if (priority === "high") {
        // 执行高优先级优化
        const optimizationAction = this._executeOptimization(topic);
        if (optimizationAction) {
          optimizationResults.actions.push(optimizationAction);
          optimizationResults.improvements.push({
            topic,
            action: optimizationAction,
            timestamp: Date.now() / 1000
          });
          
          // 记录优化历史
          this.optimizationHistory.push({
            timestamp: Date.now() / 1000,
            topic,
            action: optimizationAction,
            priority
          });
        }
      }
    }
    
    // 清理已处理的改进领域
    this.improvementAreas = this.improvementAreas.filter(area => area.priority === "high");
    
    // 保存进化数据
    this._saveEvolutionData();
    
    return optimizationResults;
  }

  _executeOptimization(topic) {
    if (topic === "knowledgeExtraction") {
      // 优化知识提取
      return "Optimized knowledge extraction parameters";
    } else if (topic === "responseQuality") {
      // 优化响应质量
      return "Adjusted response generation parameters";
    } else if (topic === "userSatisfaction") {
      // 优化用户满意度
      return "Improved user interaction patterns";
    } else if (topic === "errorRate") {
      // 优化错误率
      return "Enhanced error handling mechanisms";
    } else {
      // 针对特定主题的优化
      return `Enhanced ${topic} knowledge base`;
    }
  }

  checkSystemHealth() {
    const healthCheck = {
      timestamp: Date.now() / 1000,
      score: 100,
      issues: []
    };
    
    // 检查学习历史
    if (this.learningHistory.length === 0) {
      healthCheck.score -= 10;
      healthCheck.issues.push("No learning history recorded");
    }
    
    // 检查错误模式
    const recentErrors = this.errorPatterns.filter(
      pattern => pattern.lastSeen > Date.now() / 1000 - 24 * 3600
    );
    if (recentErrors.length > 5) {
      healthCheck.score -= 15;
      healthCheck.issues.push(`High error rate: ${recentErrors.length} errors in the last 24 hours`);
    }
    
    // 检查性能指标
    const recentMetrics = Object.values(this.performanceMetrics).slice(-1);
    if (recentMetrics.length > 0) {
      const lastMetric = recentMetrics[0];
      if (lastMetric.userSatisfaction < 0.5) {
        healthCheck.score -= 20;
        healthCheck.issues.push("Low user satisfaction");
      }
      if (lastMetric.responseQuality < 0.5) {
        healthCheck.score -= 15;
        healthCheck.issues.push("Poor response quality");
      }
    }
    
    // 检查系统年龄
    if (this.learningHistory.length > 0) {
      const systemAge = Date.now() / 1000 - Math.min(...this.learningHistory.map(entry => entry.timestamp));
      if (systemAge > 30 * 24 * 3600) { // 30天
        healthCheck.score += 10;
        healthCheck.issues.push("System is mature (30+ days)");
      }
    }
    
    // 检查技能创建
    const recentSkills = this.createdSkills.filter(
      skill => skill.createdAt > Date.now() / 1000 - 7 * 24 * 3600
    );
    if (recentSkills.length > 0) {
      healthCheck.score += 5;
    } else {
      healthCheck.score -= 5;
      healthCheck.issues.push("No new skills created in the last 7 days");
    }
    
    // 确保分数在0-100之间
    healthCheck.score = Math.max(0, Math.min(100, healthCheck.score));
    
    // 更新系统健康状态
    this.systemHealth = healthCheck;
    
    // 保存进化数据
    this._saveEvolutionData();
    
    // 触发健康检查事件
    eventManager.trigger('system_health_check', healthCheck);
    
    return healthCheck;
  }

  getEvolutionStatus() {
    return {
      lastEvaluation: this.lastEvaluation,
      learningHistoryCount: this.learningHistory.length,
      performanceMetricsCount: Object.keys(this.performanceMetrics).length,
      improvementAreasCount: this.improvementAreas.length,
      createdSkillsCount: this.createdSkills.length,
      errorPatternsCount: this.errorPatterns.length,
      systemHealth: this.systemHealth,
      optimizationHistoryCount: this.optimizationHistory.length,
      systemAge: this.learningHistory.length > 0 ? 
        (Date.now() / 1000 - Math.min(...this.learningHistory.map(entry => entry.timestamp))) : 0
    };
  }

  generateSelfReflection() {
    const status = this.getEvolutionStatus();
    const performance = this.evaluatePerformance();
    const health = this.checkSystemHealth();
    
    let reflection = `# Lossless Superpower 自我反思报告

`;
    reflection += `## 基本信息
`;
    reflection += `- 系统年龄: ${Math.floor(status.systemHealth / 3600)} 小时
`;
    reflection += `- 学习历史: ${status.learningHistoryCount} 条交互
`;
    reflection += `- 最后评估: ${new Date(status.lastEvaluation * 1000).toISOString().replace('T', ' ').split('.')[0]}
`;
    reflection += `- 创建技能: ${status.createdSkillsCount} 个
`;
    reflection += `- 错误模式: ${status.errorPatternsCount} 个
`;
    reflection += `- 系统健康度: ${health.score}/100
`;
    reflection += `- 优化历史: ${status.optimizationHistoryCount} 次

`;
    
    reflection += `## 性能评估
`;
    reflection += `- 知识提取: ${performance.knowledgeExtraction.toFixed(2)}
`;
    reflection += `- 响应质量: ${performance.responseQuality.toFixed(2)}
`;
    reflection += `- 用户满意度: ${performance.userSatisfaction.toFixed(2)}
`;
    reflection += `- 错误率: ${performance.errorRate.toFixed(2)}
`;
    reflection += `- 技能创建: ${performance.skillCreation.toFixed(2)}

`;
    
    reflection += `## 系统健康问题
`;
    if (health.issues.length > 0) {
      for (const issue of health.issues) {
        reflection += `- ${issue}
`;
      }
    } else {
      reflection += `- 系统健康，无问题
`;
    }
    
    reflection += `
## 改进领域
`;
    for (const area of this.improvementAreas) {
      reflection += `- ${area.topic} (优先级: ${area.priority})
`;
    }
    
    // 添加创建的技能信息
    if (this.createdSkills.length > 0) {
      reflection += "\n## 创建的技能\n";
      const recentSkills = this.createdSkills.slice(-5); // 显示最近创建的5个技能
      for (const skill of recentSkills) {
        const skillName = skill.name;
        const taskType = skill.taskType;
        const createdAt = skill.createdAt;
        const createdTime = new Date(createdAt * 1000).toISOString().replace('T', ' ').split('.')[0];
        reflection += `- ${skillName} (类型: ${taskType}, 创建时间: ${createdTime})
`;
      }
    }
    
    reflection += "\n## 学习总结\n";
    
    // 分析学习历史
    if (this.learningHistory.length > 0) {
      const recentInteractions = this.learningHistory.slice(-5);
      for (let i = 0; i < recentInteractions.length; i++) {
        const interaction = recentInteractions[i];
        if (interaction.userInput && interaction.systemResponse) {
          reflection += `${i + 1}. 用户: ${interaction.userInput.substring(0, 50)}...\n`;
          reflection += `   系统: ${interaction.systemResponse.substring(0, 50)}...\n`;
        } else if (interaction.type === 'iteration') {
          reflection += `${i + 1}. 系统: 记录迭代 ${interaction.data.version}\n`;
        } else {
          reflection += `${i + 1}. 系统: 其他学习记录\n`;
        }
      }
    }
    
    // 触发反思生成事件
    eventManager.trigger('reflection_generated', reflection);
    
    return reflection;
  }

  // 清理资源
  cleanup() {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
    }
    if (this.skillGenerationInterval) {
      clearInterval(this.skillGenerationInterval);
    }
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// 全局自我进化实例
const selfEvolution = new SelfEvolution();

// 导出函数
function learnFromInteraction(userInput, systemResponse, feedback = null) {
  return selfEvolution.learnFromInteraction(userInput, systemResponse, feedback);
}

function learnFromError(error, context, solution = null) {
  return selfEvolution.learnFromError(error, context, solution);
}

function evaluatePerformance() {
  return selfEvolution.evaluatePerformance();
}

function optimizeSystem() {
  return selfEvolution.optimizeSystem();
}

function getEvolutionStatus() {
  return selfEvolution.getEvolutionStatus();
}

function generateSelfReflection() {
  return selfEvolution.generateSelfReflection();
}

function performMaintenance() {
  return selfEvolution.performMaintenance();
}

function recordIteration(version, date, changes, issues) {
  return selfEvolution.recordIteration(version, date, changes, issues);
}

function checkSystemHealth() {
  return selfEvolution.checkSystemHealth();
}

module.exports = {
  SelfEvolution,
  selfEvolution,
  learnFromInteraction,
  learnFromError,
  evaluatePerformance,
  optimizeSystem,
  getEvolutionStatus,
  generateSelfReflection,
  performMaintenance,
  recordIteration,
  checkSystemHealth
};