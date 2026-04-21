const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

class DataMigration {
  constructor() {
    this.pythonRootPath = 'C:/USERS/55237/lossless-superpower';
    this.jsRootPath = 'c:/Users/55237/Lossless-Superpower-JS';
    this.migrationLog = [];
    this.concurrencyLimit = 4; // 并行处理限制
    this.progress = {}; // 迁移进度
    this.statusFile = path.join(this.jsRootPath, 'src', 'superpowers', 'migration_status.json');
    this.migrationStatus = this.loadMigrationStatus();
  }

  // 加载迁移状态
  loadMigrationStatus() {
    try {
      if (fs.existsSync(this.statusFile)) {
        const statusData = fs.readFileSync(this.statusFile, 'utf8');
        return JSON.parse(statusData);
      }
    } catch (error) {
      this.log(`加载迁移状态时出错: ${error.message}`);
    }
    return {
      completedFiles: {},
      failedFiles: {},
      lastUpdated: new Date().toISOString()
    };
  }

  // 保存迁移状态
  saveMigrationStatus() {
    try {
      this.migrationStatus.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.statusFile, JSON.stringify(this.migrationStatus, null, 2));
    } catch (error) {
      this.log(`保存迁移状态时出错: ${error.message}`);
    }
  }

  // 标记文件为已完成
  markFileCompleted(filePath) {
    this.migrationStatus.completedFiles[filePath] = new Date().toISOString();
    delete this.migrationStatus.failedFiles[filePath];
    this.saveMigrationStatus();
  }

  // 标记文件为失败
  markFileFailed(filePath, error) {
    this.migrationStatus.failedFiles[filePath] = {
      error: error.message,
      timestamp: new Date().toISOString()
    };
    this.saveMigrationStatus();
  }

  // 检查文件是否已迁移
  isFileCompleted(filePath) {
    return this.migrationStatus.completedFiles[filePath] !== undefined;
  }

  // 检查文件是否迁移失败
  isFileFailed(filePath) {
    return this.migrationStatus.failedFiles[filePath] !== undefined;
  }

  // 清理迁移状态
  clearMigrationStatus() {
    this.migrationStatus = {
      completedFiles: {},
      failedFiles: {},
      lastUpdated: new Date().toISOString()
    };
    this.saveMigrationStatus();
  }

  // 验证文件是否存在
  validateFileExists(filePath) {
    return fs.existsSync(filePath);
  }

  // 验证JSON文件格式是否正确
  validateJsonFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const content = fs.readFileSync(filePath, 'utf8');
      JSON.parse(content);
      return true;
    } catch (error) {
      return false;
    }
  }

  // 验证文件大小是否合理
  validateFileSize(filePath, maxSize = 100 * 1024 * 1024) { // 100MB
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const stats = fs.statSync(filePath);
      return stats.size <= maxSize;
    } catch (error) {
      return false;
    }
  }

  // 验证迁移数据的完整性
  async validateMigration() {
    this.log('开始验证迁移数据...');
    
    const validationResults = {
      totalFiles: 0,
      validFiles: 0,
      invalidFiles: 0,
      errors: []
    };

    // 验证技能数据
    const jsSkillsPath = path.join(this.jsRootPath, 'src', 'superpowers', 'skills');
    if (fs.existsSync(jsSkillsPath)) {
      const skillFiles = fs.readdirSync(jsSkillsPath);
      const jsonFiles = skillFiles.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const filePath = path.join(jsSkillsPath, file);
        validationResults.totalFiles++;
        
        if (this.validateJsonFile(filePath) && this.validateFileSize(filePath)) {
          validationResults.validFiles++;
        } else {
          validationResults.invalidFiles++;
          validationResults.errors.push(`技能文件 ${file} 验证失败`);
        }
      }
    }

    // 验证DAG数据
    const jsDagPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'memory-dag');
    if (fs.existsSync(jsDagPath)) {
      const dagFiles = fs.readdirSync(jsDagPath);
      const jsonFiles = dagFiles.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const filePath = path.join(jsDagPath, file);
        validationResults.totalFiles++;
        
        if (this.validateJsonFile(filePath) && this.validateFileSize(filePath)) {
          validationResults.validFiles++;
        } else {
          validationResults.invalidFiles++;
          validationResults.errors.push(`DAG文件 ${file} 验证失败`);
        }
      }
    }

    // 验证知识管理数据
    const jsKnowledgePath = path.join(this.jsRootPath, 'src', 'superpowers', 'knowledge');
    const jsLessonsPath = path.join(jsKnowledgePath, 'lessons.json');
    const jsActivityPath = path.join(jsKnowledgePath, 'activity.log');
    
    if (fs.existsSync(jsLessonsPath)) {
      validationResults.totalFiles++;
      if (this.validateJsonFile(jsLessonsPath) && this.validateFileSize(jsLessonsPath)) {
        validationResults.validFiles++;
      } else {
        validationResults.invalidFiles++;
        validationResults.errors.push('经验教训文件验证失败');
      }
    }

    if (fs.existsSync(jsActivityPath)) {
      validationResults.totalFiles++;
      if (this.validateJsonFile(jsActivityPath) && this.validateFileSize(jsActivityPath)) {
        validationResults.validFiles++;
      } else {
        validationResults.invalidFiles++;
        validationResults.errors.push('活动记录文件验证失败');
      }
    }

    // 验证知识图谱数据
    const jsKgPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'knowledge_graph.json');
    if (fs.existsSync(jsKgPath)) {
      validationResults.totalFiles++;
      if (this.validateJsonFile(jsKgPath) && this.validateFileSize(jsKgPath)) {
        validationResults.validFiles++;
      } else {
        validationResults.invalidFiles++;
        validationResults.errors.push('知识图谱文件验证失败');
      }
    }

    // 验证用户配置数据
    const jsUserPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'user_profile.json');
    if (fs.existsSync(jsUserPath)) {
      validationResults.totalFiles++;
      if (this.validateJsonFile(jsUserPath) && this.validateFileSize(jsUserPath)) {
        validationResults.validFiles++;
      } else {
        validationResults.invalidFiles++;
        validationResults.errors.push('用户配置文件验证失败');
      }
    }

    // 验证插件数据
    const jsReportsPath = path.join(this.jsRootPath, 'plugins', 'trace', 'reports');
    if (fs.existsSync(jsReportsPath)) {
      const reportFiles = fs.readdirSync(jsReportsPath);
      const htmlFiles = reportFiles.filter(file => file.endsWith('.html'));
      
      for (const file of htmlFiles) {
        const filePath = path.join(jsReportsPath, file);
        validationResults.totalFiles++;
        
        if (this.validateFileExists(filePath) && this.validateFileSize(filePath)) {
          validationResults.validFiles++;
        } else {
          validationResults.invalidFiles++;
          validationResults.errors.push(`插件报告文件 ${file} 验证失败`);
        }
      }
    }

    // 验证MD文件
    const jsSkillsMdPath = path.join(this.jsRootPath, 'src', 'superpowers', 'skills');
    if (fs.existsSync(jsSkillsMdPath)) {
      const skillFiles = fs.readdirSync(jsSkillsMdPath);
      const mdFiles = skillFiles.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(jsSkillsMdPath, file);
        validationResults.totalFiles++;
        
        if (this.validateFileExists(filePath) && this.validateFileSize(filePath)) {
          validationResults.validFiles++;
        } else {
          validationResults.invalidFiles++;
          validationResults.errors.push(`技能MD文件 ${file} 验证失败`);
        }
      }
    }

    const jsDocsPath = path.join(this.jsRootPath, 'docs');
    if (fs.existsSync(jsDocsPath)) {
      const docFiles = fs.readdirSync(jsDocsPath);
      const mdFiles = docFiles.filter(file => file.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(jsDocsPath, file);
        validationResults.totalFiles++;
        
        if (this.validateFileExists(filePath) && this.validateFileSize(filePath)) {
          validationResults.validFiles++;
        } else {
          validationResults.invalidFiles++;
          validationResults.errors.push(`文档MD文件 ${file} 验证失败`);
        }
      }
    }

    // 生成验证报告
    this.log('数据验证完成！');
    this.log(`总文件数: ${validationResults.totalFiles}`);
    this.log(`有效文件数: ${validationResults.validFiles}`);
    this.log(`无效文件数: ${validationResults.invalidFiles}`);
    
    if (validationResults.errors.length > 0) {
      this.log('验证错误:');
      validationResults.errors.forEach(error => this.log(`- ${error}`));
    } else {
      this.log('所有文件验证通过！');
    }

    // 保存验证结果
    const validationReportPath = path.join(this.jsRootPath, 'src', 'superpowers', 'migration_validation.json');
    fs.writeFileSync(validationReportPath, JSON.stringify(validationResults, null, 2));
    this.log(`验证报告已保存到: ${validationReportPath}`);

    return validationResults;
  }

  // 计算目录文件统计信息
  getDirectoryStats(directoryPath) {
    const stats = {
      fileCount: 0,
      totalSize: 0,
      files: []
    };

    if (!fs.existsSync(directoryPath)) {
      return stats;
    }

    const files = fs.readdirSync(directoryPath, { recursive: true });
    
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = fs.statSync(filePath);
      
      if (fileStats.isFile()) {
        stats.fileCount++;
        stats.totalSize += fileStats.size;
        stats.files.push({
          name: file,
          size: fileStats.size,
          path: filePath
        });
      }
    }

    return stats;
  }

  // 比较迁移前后的数据
  async compareMigration() {
    this.log('开始比较迁移前后的数据...');
    
    const comparisonResults = {
      python: {
        skills: this.getDirectoryStats(path.join(this.pythonRootPath, 'superpowers', 'storage', 'skills')),
        dag: this.getDirectoryStats(path.join(this.pythonRootPath, 'superpowers', 'storage', 'memory-dag')),
        knowledge: this.getDirectoryStats(path.join(this.pythonRootPath, 'superpowers', 'superpowers', 'knowledge')),
        knowledgeGraph: this.getDirectoryStats(path.join(this.pythonRootPath, 'lossless-memory', 'memory', 'storage')),
        plugins: this.getDirectoryStats(path.join(this.pythonRootPath, 'plugins', 'trace', 'reports')),
        skillsMd: this.getDirectoryStats(path.join(this.pythonRootPath, 'superpowers', 'superpowers', 'skills')),
        otherMd: this.getDirectoryStats(this.pythonRootPath)
      },
      javascript: {
        skills: this.getDirectoryStats(path.join(this.jsRootPath, 'src', 'superpowers', 'skills')),
        dag: this.getDirectoryStats(path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'memory-dag')),
        knowledge: this.getDirectoryStats(path.join(this.jsRootPath, 'src', 'superpowers', 'knowledge')),
        knowledgeGraph: this.getDirectoryStats(path.join(this.jsRootPath, 'src', 'superpowers', 'storage')),
        plugins: this.getDirectoryStats(path.join(this.jsRootPath, 'plugins', 'trace', 'reports')),
        skillsMd: this.getDirectoryStats(path.join(this.jsRootPath, 'src', 'superpowers', 'skills')),
        otherMd: this.getDirectoryStats(path.join(this.jsRootPath, 'docs'))
      },
      comparison: {}
    };

    // 计算比较结果
    comparisonResults.comparison.skills = {
      pythonCount: comparisonResults.python.skills.fileCount,
      javascriptCount: comparisonResults.javascript.skills.fileCount,
      difference: comparisonResults.javascript.skills.fileCount - comparisonResults.python.skills.fileCount,
      pythonSize: comparisonResults.python.skills.totalSize,
      javascriptSize: comparisonResults.javascript.skills.totalSize,
      sizeDifference: comparisonResults.javascript.skills.totalSize - comparisonResults.python.skills.totalSize
    };

    comparisonResults.comparison.dag = {
      pythonCount: comparisonResults.python.dag.fileCount,
      javascriptCount: comparisonResults.javascript.dag.fileCount,
      difference: comparisonResults.javascript.dag.fileCount - comparisonResults.python.dag.fileCount,
      pythonSize: comparisonResults.python.dag.totalSize,
      javascriptSize: comparisonResults.javascript.dag.totalSize,
      sizeDifference: comparisonResults.javascript.dag.totalSize - comparisonResults.python.dag.totalSize
    };

    comparisonResults.comparison.knowledge = {
      pythonCount: comparisonResults.python.knowledge.fileCount,
      javascriptCount: comparisonResults.javascript.knowledge.fileCount,
      difference: comparisonResults.javascript.knowledge.fileCount - comparisonResults.python.knowledge.fileCount,
      pythonSize: comparisonResults.python.knowledge.totalSize,
      javascriptSize: comparisonResults.javascript.knowledge.totalSize,
      sizeDifference: comparisonResults.javascript.knowledge.totalSize - comparisonResults.python.knowledge.totalSize
    };

    comparisonResults.comparison.knowledgeGraph = {
      pythonCount: comparisonResults.python.knowledgeGraph.fileCount,
      javascriptCount: comparisonResults.javascript.knowledgeGraph.fileCount,
      difference: comparisonResults.javascript.knowledgeGraph.fileCount - comparisonResults.python.knowledgeGraph.fileCount,
      pythonSize: comparisonResults.python.knowledgeGraph.totalSize,
      javascriptSize: comparisonResults.javascript.knowledgeGraph.totalSize,
      sizeDifference: comparisonResults.javascript.knowledgeGraph.totalSize - comparisonResults.python.knowledgeGraph.totalSize
    };

    comparisonResults.comparison.plugins = {
      pythonCount: comparisonResults.python.plugins.fileCount,
      javascriptCount: comparisonResults.javascript.plugins.fileCount,
      difference: comparisonResults.javascript.plugins.fileCount - comparisonResults.python.plugins.fileCount,
      pythonSize: comparisonResults.python.plugins.totalSize,
      javascriptSize: comparisonResults.javascript.plugins.totalSize,
      sizeDifference: comparisonResults.javascript.plugins.totalSize - comparisonResults.python.plugins.totalSize
    };

    comparisonResults.comparison.skillsMd = {
      pythonCount: comparisonResults.python.skillsMd.files.filter(f => f.name.endsWith('.md')).length,
      javascriptCount: comparisonResults.javascript.skillsMd.files.filter(f => f.name.endsWith('.md')).length,
      difference: comparisonResults.javascript.skillsMd.files.filter(f => f.name.endsWith('.md')).length - comparisonResults.python.skillsMd.files.filter(f => f.name.endsWith('.md')).length
    };

    comparisonResults.comparison.otherMd = {
      pythonCount: comparisonResults.python.otherMd.files.filter(f => f.name.endsWith('.md')).length,
      javascriptCount: comparisonResults.javascript.otherMd.files.filter(f => f.name.endsWith('.md')).length,
      difference: comparisonResults.javascript.otherMd.files.filter(f => f.name.endsWith('.md')).length - comparisonResults.python.otherMd.files.filter(f => f.name.endsWith('.md')).length
    };

    // 计算总体比较
    const totalPythonCount = comparisonResults.python.skills.fileCount + 
                            comparisonResults.python.dag.fileCount + 
                            comparisonResults.python.knowledge.fileCount + 
                            comparisonResults.python.knowledgeGraph.fileCount + 
                            comparisonResults.python.plugins.fileCount + 
                            comparisonResults.python.skillsMd.files.filter(f => f.name.endsWith('.md')).length + 
                            comparisonResults.python.otherMd.files.filter(f => f.name.endsWith('.md')).length;

    const totalJavascriptCount = comparisonResults.javascript.skills.fileCount + 
                                 comparisonResults.javascript.dag.fileCount + 
                                 comparisonResults.javascript.knowledge.fileCount + 
                                 comparisonResults.javascript.knowledgeGraph.fileCount + 
                                 comparisonResults.javascript.plugins.fileCount + 
                                 comparisonResults.javascript.skillsMd.files.filter(f => f.name.endsWith('.md')).length + 
                                 comparisonResults.javascript.otherMd.files.filter(f => f.name.endsWith('.md')).length;

    comparisonResults.comparison.total = {
      pythonCount: totalPythonCount,
      javascriptCount: totalJavascriptCount,
      difference: totalJavascriptCount - totalPythonCount
    };

    // 生成比较报告
    this.log('数据比较完成！');
    this.log('迁移前后数据对比：');
    this.log(`技能文件: Python=${comparisonResults.comparison.skills.pythonCount}, JavaScript=${comparisonResults.comparison.skills.javascriptCount}, 差异=${comparisonResults.comparison.skills.difference}`);
    this.log(`DAG文件: Python=${comparisonResults.comparison.dag.pythonCount}, JavaScript=${comparisonResults.comparison.dag.javascriptCount}, 差异=${comparisonResults.comparison.dag.difference}`);
    this.log(`知识管理文件: Python=${comparisonResults.comparison.knowledge.pythonCount}, JavaScript=${comparisonResults.comparison.knowledge.javascriptCount}, 差异=${comparisonResults.comparison.knowledge.difference}`);
    this.log(`知识图谱文件: Python=${comparisonResults.comparison.knowledgeGraph.pythonCount}, JavaScript=${comparisonResults.comparison.knowledgeGraph.javascriptCount}, 差异=${comparisonResults.comparison.knowledgeGraph.difference}`);
    this.log(`插件报告文件: Python=${comparisonResults.comparison.plugins.pythonCount}, JavaScript=${comparisonResults.comparison.plugins.javascriptCount}, 差异=${comparisonResults.comparison.plugins.difference}`);
    this.log(`技能MD文件: Python=${comparisonResults.comparison.skillsMd.pythonCount}, JavaScript=${comparisonResults.comparison.skillsMd.javascriptCount}, 差异=${comparisonResults.comparison.skillsMd.difference}`);
    this.log(`其他MD文件: Python=${comparisonResults.comparison.otherMd.pythonCount}, JavaScript=${comparisonResults.comparison.otherMd.javascriptCount}, 差异=${comparisonResults.comparison.otherMd.difference}`);
    this.log(`总文件数: Python=${comparisonResults.comparison.total.pythonCount}, JavaScript=${comparisonResults.comparison.total.javascriptCount}, 差异=${comparisonResults.comparison.total.difference}`);

    // 保存比较结果
    const comparisonReportPath = path.join(this.jsRootPath, 'src', 'superpowers', 'migration_comparison.json');
    fs.writeFileSync(comparisonReportPath, JSON.stringify(comparisonResults, null, 2));
    this.log(`比较报告已保存到: ${comparisonReportPath}`);

    return comparisonResults;
  }

  // 并行处理函数
  async parallelProcess(items, processor, limit = this.concurrencyLimit) {
    const results = [];
    const queue = [...items];
    const activeWorkers = [];

    while (queue.length > 0 || activeWorkers.length > 0) {
      while (activeWorkers.length < limit && queue.length > 0) {
        const item = queue.shift();
        const worker = processor(item).then(result => {
          results.push(result);
          const index = activeWorkers.indexOf(worker);
          if (index > -1) {
            activeWorkers.splice(index, 1);
          }
        }).catch(error => {
          console.error(`处理项时出错: ${error.message}`);
          const index = activeWorkers.indexOf(worker);
          if (index > -1) {
            activeWorkers.splice(index, 1);
          }
        });
        activeWorkers.push(worker);
      }

      if (activeWorkers.length > 0) {
        await Promise.race(activeWorkers);
      }
    }

    return results;
  }

  // 流处理大文件
  async streamFile(sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(targetPath);

      readStream.on('error', reject);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);

      readStream.pipe(writeStream);
    });
  }

  // 显示进度条
  displayProgressBar(task, current, total) {
    const width = 50;
    const percentage = Math.round((current / total) * 100);
    const filledWidth = Math.round((width * percentage) / 100);
    const progressBar = '='.repeat(filledWidth) + ' '.repeat(width - filledWidth);
    return `[${progressBar}] ${percentage}%`;
  }

  // 更新迁移进度
  updateProgress(task, current, total) {
    this.progress[task] = {
      current,
      total,
      percentage: Math.round((current / total) * 100),
      timestamp: new Date().toISOString()
    };
    
    const progressBar = this.displayProgressBar(task, current, total);
    this.log(`${task} ${progressBar} (${current}/${total})`);
  }

  // 计算整体迁移进度
  calculateOverallProgress() {
    const tasks = Object.values(this.progress);
    if (tasks.length === 0) return 0;
    
    const totalProgress = tasks.reduce((sum, task) => {
      return sum + task.percentage;
    }, 0);
    
    return Math.round(totalProgress / tasks.length);
  }

  // 显示整体迁移进度
  displayOverallProgress() {
    const overallPercentage = this.calculateOverallProgress();
    const progressBar = this.displayProgressBar('整体迁移', overallPercentage, 100);
    this.log(`整体迁移进度 ${progressBar}`);
  }

  log(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}`;
    console.log(logMessage);
    this.migrationLog.push(logMessage);
  }

  async migrateAllData() {
    this.log('开始数据迁移...');
    
    try {
      // 并行处理所有迁移任务
      const migrationTasks = [
        this.migrateKnowledgeData(),
        this.migrateSkillData(),
        this.migrateDagData(),
        this.migrateKnowledgeGraphData(),
        this.migrateUserData(),
        this.migratePluginData(),
        this.migrateProblemSolutionData(),
        this.migrateMdFiles()
      ];

      // 定期显示整体迁移进度
      const progressInterval = setInterval(() => {
        this.displayOverallProgress();
      }, 1000); // 每1秒显示一次进度

      await Promise.all(migrationTasks);
      
      clearInterval(progressInterval);
      this.displayOverallProgress(); // 显示最终进度
      
      this.log('数据迁移完成！');
      
      // 验证迁移数据的完整性
      const validationResults = await this.validateMigration();
      
      // 比较迁移前后的数据
      const comparisonResults = await this.compareMigration();
      
      this.log('迁移日志：');
      this.migrationLog.forEach(log => console.log(log));
      
      return {
        success: true,
        log: this.migrationLog,
        progress: this.progress,
        validation: validationResults,
        comparison: comparisonResults,
        overallProgress: this.calculateOverallProgress()
      };
    } catch (error) {
      this.log(`迁移失败：${error.message}`);
      return {
        success: false,
        error: error.message,
        log: this.migrationLog,
        progress: this.progress,
        overallProgress: this.calculateOverallProgress()
      };
    }
  }

  async migrateKnowledgeData() {
    this.log('开始迁移知识管理数据...');
    
    const pythonLessonsPath = path.join(this.pythonRootPath, 'superpowers', 'superpowers', 'knowledge', 'lessons.json');
    const pythonActivityPath = path.join(this.pythonRootPath, 'superpowers', 'superpowers', 'knowledge', 'activity.log');
    
    const jsKnowledgePath = path.join(this.jsRootPath, 'src', 'superpowers', 'knowledge');
    const jsLessonsPath = path.join(jsKnowledgePath, 'lessons.json');
    const jsActivityPath = path.join(jsKnowledgePath, 'activity.log');
    
    if (!fs.existsSync(jsKnowledgePath)) {
      fs.mkdirSync(jsKnowledgePath, { recursive: true });
      this.log(`创建目录：${jsKnowledgePath}`);
    }
    
    if (fs.existsSync(pythonLessonsPath)) {
      const lessonsData = JSON.parse(fs.readFileSync(pythonLessonsPath, 'utf8'));
      fs.writeFileSync(jsLessonsPath, JSON.stringify(lessonsData, null, 2));
      this.log(`迁移了 ${lessonsData.length} 条经验教训`);
    } else {
      this.log('未找到Python版本的lessons.json文件');
    }
    
    if (fs.existsSync(pythonActivityPath)) {
      const activityData = JSON.parse(fs.readFileSync(pythonActivityPath, 'utf8'));
      fs.writeFileSync(jsActivityPath, JSON.stringify(activityData, null, 2));
      this.log(`迁移了 ${activityData.length} 条活动记录`);
    } else {
      this.log('未找到Python版本的activity.log文件');
    }
  }

  async migrateSkillData() {
    this.log('开始迁移技能数据...');
    
    const pythonSkillsPath = path.join(this.pythonRootPath, 'superpowers', 'storage', 'skills');
    const jsSkillsPath = path.join(this.jsRootPath, 'src', 'superpowers', 'skills');
    
    if (!fs.existsSync(jsSkillsPath)) {
      fs.mkdirSync(jsSkillsPath, { recursive: true });
      this.log(`创建目录：${jsSkillsPath}`);
    }
    
    if (fs.existsSync(pythonSkillsPath)) {
      const skillFiles = fs.readdirSync(pythonSkillsPath);
      const jsonFiles = skillFiles.filter(file => file.endsWith('.json'));
      
      // 过滤已完成的文件
      const filesToMigrate = jsonFiles.filter(file => {
        const pythonSkillPath = path.join(pythonSkillsPath, file);
        return !this.isFileCompleted(pythonSkillPath);
      });
      
      const totalFiles = jsonFiles.length;
      const completedFiles = totalFiles - filesToMigrate.length;
      
      this.updateProgress('技能数据迁移', completedFiles, totalFiles);
      
      let migratedCount = completedFiles;
      
      // 并行处理技能文件迁移
      await this.parallelProcess(filesToMigrate, async (file) => {
        const pythonSkillPath = path.join(pythonSkillsPath, file);
        const jsSkillPath = path.join(jsSkillsPath, file);
        
        try {
          const skillData = JSON.parse(fs.readFileSync(pythonSkillPath, 'utf8'));
          fs.writeFileSync(jsSkillPath, JSON.stringify(skillData, null, 2));
          this.markFileCompleted(pythonSkillPath);
          migratedCount++;
          this.updateProgress('技能数据迁移', migratedCount, totalFiles);
        } catch (error) {
          this.log(`迁移技能文件 ${file} 时出错: ${error.message}`);
          this.markFileFailed(pythonSkillPath, error);
        }
      });
      
      this.log(`迁移了 ${migratedCount} 个技能文件，其中 ${completedFiles} 个已完成，${migratedCount - completedFiles} 个新迁移`);
    } else {
      this.log('未找到Python版本的skills目录');
    }
  }

  async migrateDagData() {
    this.log('开始迁移DAG内存数据...');
    
    const pythonDagPath = path.join(this.pythonRootPath, 'superpowers', 'storage', 'memory-dag');
    const jsDagPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'memory-dag');
    
    if (!fs.existsSync(jsDagPath)) {
      fs.mkdirSync(jsDagPath, { recursive: true });
      this.log(`创建目录：${jsDagPath}`);
    }
    
    if (fs.existsSync(pythonDagPath)) {
      const dagFiles = fs.readdirSync(pythonDagPath);
      const jsonFiles = dagFiles.filter(file => file.endsWith('.json'));
      
      // 过滤已完成的文件
      const filesToMigrate = jsonFiles.filter(file => {
        const pythonDagFilePath = path.join(pythonDagPath, file);
        return !this.isFileCompleted(pythonDagFilePath);
      });
      
      const totalFiles = jsonFiles.length;
      const completedFiles = totalFiles - filesToMigrate.length;
      
      this.updateProgress('DAG内存数据迁移', completedFiles, totalFiles);
      
      let migratedCount = completedFiles;
      
      // 并行处理DAG文件迁移
      await this.parallelProcess(filesToMigrate, async (file) => {
        const pythonDagFilePath = path.join(pythonDagPath, file);
        const jsDagFilePath = path.join(jsDagPath, file);
        
        try {
          const dagData = JSON.parse(fs.readFileSync(pythonDagFilePath, 'utf8'));
          fs.writeFileSync(jsDagFilePath, JSON.stringify(dagData, null, 2));
          this.markFileCompleted(pythonDagFilePath);
          migratedCount++;
          this.updateProgress('DAG内存数据迁移', migratedCount, totalFiles);
        } catch (error) {
          this.log(`迁移DAG文件 ${file} 时出错: ${error.message}`);
          this.markFileFailed(pythonDagFilePath, error);
        }
      });
      
      this.log(`迁移了 ${migratedCount} 个DAG数据文件，其中 ${completedFiles} 个已完成，${migratedCount - completedFiles} 个新迁移`);
    } else {
      this.log('未找到Python版本的memory-dag目录');
    }
  }

  async migrateKnowledgeGraphData() {
    this.log('开始迁移知识图谱数据...');
    
    const pythonKgPath = path.join(this.pythonRootPath, 'lossless-memory', 'memory', 'storage', 'knowledge_graph.json');
    const jsKgPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'knowledge_graph.json');
    const jsStoragePath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage');
    
    if (!fs.existsSync(jsStoragePath)) {
      fs.mkdirSync(jsStoragePath, { recursive: true });
      this.log(`创建目录：${jsStoragePath}`);
    }
    
    if (fs.existsSync(pythonKgPath)) {
      // 检查是否已完成
      if (this.isFileCompleted(pythonKgPath)) {
        this.log('知识图谱数据已经迁移完成');
        return;
      }
      
      try {
        // 使用流处理大文件，减少内存使用
        await this.streamFile(pythonKgPath, jsKgPath);
        this.markFileCompleted(pythonKgPath);
        this.log('迁移了知识图谱数据');
      } catch (error) {
        this.log(`迁移知识图谱数据时出错: ${error.message}`);
        this.markFileFailed(pythonKgPath, error);
        //  fallback到传统方法
        try {
          const kgData = JSON.parse(fs.readFileSync(pythonKgPath, 'utf8'));
          fs.writeFileSync(jsKgPath, JSON.stringify(kgData, null, 2));
          this.markFileCompleted(pythonKgPath);
          this.log('使用备用方法迁移了知识图谱数据');
        } catch (fallbackError) {
          this.log(`备用方法也失败: ${fallbackError.message}`);
          this.markFileFailed(pythonKgPath, fallbackError);
        }
      }
    } else {
      this.log('未找到Python版本的knowledge_graph.json文件');
    }
  }

  async migrateUserData() {
    this.log('开始迁移用户配置数据...');
    
    const pythonUserPath = path.join(this.pythonRootPath, 'lossless-memory', 'memory', 'storage', 'user_profile.json');
    const jsUserPath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage', 'user_profile.json');
    const jsStoragePath = path.join(this.jsRootPath, 'src', 'superpowers', 'storage');
    
    if (!fs.existsSync(jsStoragePath)) {
      fs.mkdirSync(jsStoragePath, { recursive: true });
      this.log(`创建目录：${jsStoragePath}`);
    }
    
    if (fs.existsSync(pythonUserPath)) {
      // 检查是否已完成
      if (this.isFileCompleted(pythonUserPath)) {
        this.log('用户配置数据已经迁移完成');
        return;
      }
      
      try {
        const userData = JSON.parse(fs.readFileSync(pythonUserPath, 'utf8'));
        fs.writeFileSync(jsUserPath, JSON.stringify(userData, null, 2));
        this.markFileCompleted(pythonUserPath);
        this.log('迁移了用户配置数据');
      } catch (error) {
        this.log(`迁移用户配置数据时出错: ${error.message}`);
        this.markFileFailed(pythonUserPath, error);
      }
    } else {
      this.log('未找到Python版本的user_profile.json文件');
    }
  }

  async migratePluginData() {
    this.log('开始迁移插件数据...');
    
    const pythonReportsPath = path.join(this.pythonRootPath, 'plugins', 'trace', 'reports');
    const jsReportsPath = path.join(this.jsRootPath, 'plugins', 'trace', 'reports');
    
    if (!fs.existsSync(jsReportsPath)) {
      fs.mkdirSync(jsReportsPath, { recursive: true });
      this.log(`创建目录：${jsReportsPath}`);
    }
    
    if (fs.existsSync(pythonReportsPath)) {
      const reportFiles = fs.readdirSync(pythonReportsPath);
      const htmlFiles = reportFiles.filter(file => file.endsWith('.html'));
      
      // 过滤已完成的文件
      const filesToMigrate = htmlFiles.filter(file => {
        const pythonReportPath = path.join(pythonReportsPath, file);
        return !this.isFileCompleted(pythonReportPath);
      });
      
      const totalFiles = htmlFiles.length;
      const completedFiles = totalFiles - filesToMigrate.length;
      
      this.updateProgress('插件数据迁移', completedFiles, totalFiles);
      
      let migratedCount = completedFiles;
      
      // 并行处理插件报告文件迁移
      await this.parallelProcess(filesToMigrate, async (file) => {
        const pythonReportPath = path.join(pythonReportsPath, file);
        const jsReportPath = path.join(jsReportsPath, file);
        
        try {
          // 使用流处理大文件
          await this.streamFile(pythonReportPath, jsReportPath);
          this.markFileCompleted(pythonReportPath);
          migratedCount++;
          this.updateProgress('插件数据迁移', migratedCount, totalFiles);
        } catch (error) {
          this.log(`迁移插件报告文件 ${file} 时出错: ${error.message}`);
          this.markFileFailed(pythonReportPath, error);
          //  fallback到传统方法
          try {
            const reportData = fs.readFileSync(pythonReportPath, 'utf8');
            fs.writeFileSync(jsReportPath, reportData);
            this.markFileCompleted(pythonReportPath);
            migratedCount++;
            this.updateProgress('插件数据迁移', migratedCount, totalFiles);
          } catch (fallbackError) {
            this.log(`备用方法也失败: ${fallbackError.message}`);
            this.markFileFailed(pythonReportPath, fallbackError);
          }
        }
      });
      
      this.log(`迁移了 ${migratedCount} 个插件报告文件，其中 ${completedFiles} 个已完成，${migratedCount - completedFiles} 个新迁移`);
    } else {
      this.log('未找到Python版本的reports目录');
    }
  }

  async migrateProblemSolutionData() {
    this.log('开始迁移问题解决方案数据...');
    
    const pythonPlansPath = path.join(this.pythonRootPath, 'superpowers', 'problem_resolution', 'plans');
    const jsPlansPath = path.join(this.jsRootPath, 'src', 'superpowers', 'problem_resolution', 'plans');
    
    if (!fs.existsSync(jsPlansPath)) {
      fs.mkdirSync(jsPlansPath, { recursive: true });
      this.log(`创建目录：${jsPlansPath}`);
    }
    
    if (fs.existsSync(pythonPlansPath)) {
      const planFiles = fs.readdirSync(pythonPlansPath);
      let migratedCount = 0;
      
      for (const file of planFiles) {
        if (file.endsWith('.json') || file.endsWith('.md')) {
          const pythonPlanPath = path.join(pythonPlansPath, file);
          const jsPlanPath = path.join(jsPlansPath, file);
          
          if (file.endsWith('.json')) {
            const planData = JSON.parse(fs.readFileSync(pythonPlanPath, 'utf8'));
            fs.writeFileSync(jsPlanPath, JSON.stringify(planData, null, 2));
          } else {
            const planData = fs.readFileSync(pythonPlanPath, 'utf8');
            fs.writeFileSync(jsPlanPath, planData);
          }
          migratedCount++;
        }
      }
      
      this.log(`迁移了 ${migratedCount} 个问题解决方案文件`);
    } else {
      this.log('未找到Python版本的plans目录');
    }
  }

  async migrateMdFiles() {
    this.log('开始迁移MD格式文件...');
    
    // 迁移技能相关的MD文件
    const pythonSkillsMdPath = path.join(this.pythonRootPath, 'superpowers', 'superpowers', 'skills');
    const jsSkillsMdPath = path.join(this.jsRootPath, 'src', 'superpowers', 'skills');
    
    if (!fs.existsSync(jsSkillsMdPath)) {
      fs.mkdirSync(jsSkillsMdPath, { recursive: true });
      this.log(`创建目录：${jsSkillsMdPath}`);
    }
    
    if (fs.existsSync(pythonSkillsMdPath)) {
      const skillFiles = fs.readdirSync(pythonSkillsMdPath);
      const mdFiles = skillFiles.filter(file => file.endsWith('.md'));
      
      // 过滤已完成的文件
      const filesToMigrate = mdFiles.filter(file => {
        const pythonSkillPath = path.join(pythonSkillsMdPath, file);
        return !this.isFileCompleted(pythonSkillPath);
      });
      
      const totalFiles = mdFiles.length;
      const completedFiles = totalFiles - filesToMigrate.length;
      
      this.updateProgress('技能MD文件迁移', completedFiles, totalFiles);
      
      let migratedCount = completedFiles;
      
      // 并行处理技能MD文件迁移
      await this.parallelProcess(filesToMigrate, async (file) => {
        const pythonSkillPath = path.join(pythonSkillsMdPath, file);
        const jsSkillPath = path.join(jsSkillsMdPath, file);
        
        try {
          // 使用流处理大文件
          await this.streamFile(pythonSkillPath, jsSkillPath);
          this.markFileCompleted(pythonSkillPath);
          migratedCount++;
          this.updateProgress('技能MD文件迁移', migratedCount, totalFiles);
        } catch (error) {
          this.log(`迁移技能MD文件 ${file} 时出错: ${error.message}`);
          this.markFileFailed(pythonSkillPath, error);
          //  fallback到传统方法
          try {
            const skillData = fs.readFileSync(pythonSkillPath, 'utf8');
            fs.writeFileSync(jsSkillPath, skillData);
            this.markFileCompleted(pythonSkillPath);
            migratedCount++;
            this.updateProgress('技能MD文件迁移', migratedCount, totalFiles);
          } catch (fallbackError) {
            this.log(`备用方法也失败: ${fallbackError.message}`);
            this.markFileFailed(pythonSkillPath, fallbackError);
          }
        }
      });
      
      this.log(`迁移了 ${migratedCount} 个技能MD文件，其中 ${completedFiles} 个已完成，${migratedCount - completedFiles} 个新迁移`);
    } else {
      this.log('未找到Python版本的skills MD文件');
    }
    
    // 迁移其他MD文件
    const pythonRootFiles = fs.readdirSync(this.pythonRootPath);
    const jsDocsPath = path.join(this.jsRootPath, 'docs');
    
    if (!fs.existsSync(jsDocsPath)) {
      fs.mkdirSync(jsDocsPath, { recursive: true });
      this.log(`创建目录：${jsDocsPath}`);
    }
    
    const rootMdFiles = pythonRootFiles.filter(file => file.endsWith('.md'));
    
    // 过滤已完成的文件
    const rootFilesToMigrate = rootMdFiles.filter(file => {
      const pythonFilePath = path.join(this.pythonRootPath, file);
      return !this.isFileCompleted(pythonFilePath);
    });
    
    const totalRootFiles = rootMdFiles.length;
    const completedRootFiles = totalRootFiles - rootFilesToMigrate.length;
    
    this.updateProgress('其他MD文件迁移', completedRootFiles, totalRootFiles);
    
    let otherMdCount = completedRootFiles;
    
    // 并行处理其他MD文件迁移
    await this.parallelProcess(rootFilesToMigrate, async (file) => {
      const pythonFilePath = path.join(this.pythonRootPath, file);
      const jsFilePath = path.join(jsDocsPath, file);
      
      try {
        // 使用流处理大文件
        await this.streamFile(pythonFilePath, jsFilePath);
        this.markFileCompleted(pythonFilePath);
        otherMdCount++;
        this.updateProgress('其他MD文件迁移', otherMdCount, totalRootFiles);
      } catch (error) {
        this.log(`迁移MD文件 ${file} 时出错: ${error.message}`);
        this.markFileFailed(pythonFilePath, error);
        //  fallback到传统方法
        try {
          const fileData = fs.readFileSync(pythonFilePath, 'utf8');
          fs.writeFileSync(jsFilePath, fileData);
          this.markFileCompleted(pythonFilePath);
          otherMdCount++;
          this.updateProgress('其他MD文件迁移', otherMdCount, totalRootFiles);
        } catch (fallbackError) {
          this.log(`备用方法也失败: ${fallbackError.message}`);
          this.markFileFailed(pythonFilePath, fallbackError);
        }
      }
    });
    
    this.log(`迁移了 ${otherMdCount} 个其他MD文件，其中 ${completedRootFiles} 个已完成，${otherMdCount - completedRootFiles} 个新迁移`);
  }
}

const dataMigration = new DataMigration();

module.exports = {
  DataMigration,
  dataMigration,
  migrateAllData: () => dataMigration.migrateAllData()
};
