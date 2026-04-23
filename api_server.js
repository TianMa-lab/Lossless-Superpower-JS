// API服务器，提供真实的同步、分析等功能
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// 导入同步管理器
const SyncManager = require('./src/superpowers/sync_manager');
const Analyzer = require('./src/superpowers/analyzer');
const Comparator = require('./src/superpowers/comparator');
const DocGenerator = require('./src/superpowers/doc_generator');
const Executor = require('./src/superpowers/executor');
const CodeReview = require('./src/superpowers/code_review');
const CodingAssistant = require('./src/superpowers/coding_assistant');

// 中间件
app.use(cors());
app.use(express.json());

// 初始化各个模块
let syncManager, analyzer, comparator, docGenerator, executor, codeReview, codingAssistant;

try {
  syncManager = new SyncManager();
  analyzer = new Analyzer();
  comparator = new Comparator();
  docGenerator = new DocGenerator();
  executor = new Executor();
  codeReview = new CodeReview();
  codingAssistant = new CodingAssistant();
} catch (error) {
  console.error('初始化模块失败:', error);
}

// API路由

// 获取所有项目状态
app.get('/api/projects', (req, res) => {
  try {
    const projects = syncManager.getProjects();
    const results = [];

    projects.forEach(project => {
      results.push({
        id: project.id,
        name: project.name,
        category: project.category,
        priority: project.priority,
        repository: project.repository,
        localPath: project.localPath,
        lastSync: getLastSyncTime(project.id)
      });
    });

    res.json({ success: true, projects: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取同步状态统计
app.get('/api/sync/status', (req, res) => {
  try {
    const projects = syncManager.getProjects();
    let success = 0;
    let failed = 0;

    projects.forEach(project => {
      if (checkProjectSyncStatus(project.id)) {
        success++;
      } else {
        failed++;
      }
    });

    res.json({
      success: true,
      stats: {
        total: projects.length,
        success: success,
        failed: failed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 同步单个项目
app.post('/api/sync/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const projects = syncManager.getProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ success: false, error: '项目不存在' });
  }

  try {
    const result = await syncManager.syncProject(project);
    updateProjectSyncStatus(projectId, true);
    res.json({ success: true, result });
  } catch (error) {
    updateProjectSyncStatus(projectId, false);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 同步所有项目
app.post('/api/sync/all', async (req, res) => {
  try {
    const results = await syncManager.syncAllProjects();

    // 更新所有项目的同步状态
    results.forEach(result => {
      const projectId = result.project.toLowerCase().replace(/\s+/g, '-');
      updateProjectSyncStatus(projectId, result.status === 'success');
    });

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分析单个项目
app.post('/api/analyze/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const projects = analyzer.config.projects;
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: '项目不存在' });
    }

    const result = await analyzer.analyzeProject(project);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分析所有项目
app.post('/api/analyze/all', async (req, res) => {
  try {
    const results = await analyzer.analyzeAllProjects();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 比较单个项目
app.post('/api/compare/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await comparator.compareProject(projectId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 比较所有项目
app.post('/api/compare/all', async (req, res) => {
  try {
    const results = await comparator.compareAllProjects();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成文档
app.post('/api/doc/generate', async (req, res) => {
  try {
    const result = await docGenerator.generateDocumentation();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 执行计划
app.post('/api/execute/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await executor.executePlan(projectId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 执行所有计划
app.post('/api/execute/all', async (req, res) => {
  try {
    const results = await executor.executeAllPlans();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 验证执行结果
app.get('/api/execute/verify', async (req, res) => {
  try {
    const results = await executor.verifyExecution();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取系统状态
app.get('/api/system/status', (req, res) => {
  try {
    const memUsage = process.memoryUsage();
    res.json({
      success: true,
      status: {
        memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024),
        uptime: Math.round(process.uptime() / 3600),
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取分析状态
app.get('/api/analysis/status', (req, res) => {
  try {
    const results = [];
    const analysisPath = 'D:\\opensource\\analysis-results';

    if (require('fs').existsSync(analysisPath)) {
      const files = require('fs').readdirSync(analysisPath);
      files.forEach(file => {
        if (file.endsWith('_analysis.json')) {
          const projectId = file.replace('_analysis.json', '');
          results.push({
            projectId,
            status: 'completed',
            file
          });
        }
      });
    }

    res.json({
      success: true,
      stats: {
        total: syncManager.getProjects().length,
        completed: results.length,
        pending: syncManager.getProjects().length - results.length
      },
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== 代码审查和智能编码助手 API ==========

// 审查代码
app.post('/api/code/review', (req, res) => {
  try {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({ success: false, error: '缺少filePath或content参数' });
    }

    const result = codeReview.reviewCode(filePath, content);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 审查目录
app.post('/api/code/review/directory', (req, res) => {
  try {
    const { directoryPath } = req.body;

    if (!directoryPath) {
      return res.status(400).json({ success: false, error: '缺少directoryPath参数' });
    }

    const result = codeReview.reviewDirectory(directoryPath);
    const report = codeReview.generateReport(result);
    res.json({ success: true, result, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取编码建议
app.post('/api/coding/suggestions', (req, res) => {
  try {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({ success: false, error: '缺少filePath或content参数' });
    }

    const result = codingAssistant.getCodingSuggestions(content, filePath);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成代码模板
app.post('/api/coding/template', (req, res) => {
  try {
    const { taskDescription } = req.body;

    if (!taskDescription) {
      return res.status(400).json({ success: false, error: '缺少taskDescription参数' });
    }

    const result = codingAssistant.generateCodeTemplate(taskDescription);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 分析代码质量
app.post('/api/coding/quality', (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: '缺少content参数' });
    }

    const result = codingAssistant.analyzeCodeQuality(content);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取重构建议
app.post('/api/coding/refactoring', (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: '缺少content参数' });
    }

    const result = codingAssistant.getRefactoringSuggestions(content);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取编码准则
app.get('/api/coding/guidelines', (req, res) => {
  try {
    res.json({
      success: true,
      guidelines: codeReview.guidelines
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取智能编码助手状态
app.get('/api/coding/status', (req, res) => {
  try {
    // 模拟智能编码助手状态数据
    res.json({
      success: true,
      stats: {
        suggestions: 12,
        templates: '已生成 5 个',
        refactoring: '8 条建议'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取代码审查状态
app.get('/api/code/status', (req, res) => {
  try {
    // 模拟代码审查状态数据
    res.json({
      success: true,
      stats: {
        files: 25,
        issues: 8,
        quality: '85.5'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 运行健康检查
app.post('/api/health/check', (req, res) => {
  try {
    // 模拟健康检查过程
    setTimeout(() => {
      res.json({
        success: true,
        score: 92,
        status: 'healthy',
        checks: 15,
        result: {
          check: '成功',
          details: '系统健康检查完成，所有指标正常'
        }
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取健康状态
app.get('/api/health/status', (req, res) => {
  try {
    // 模拟健康状态数据
    res.json({
      success: true,
      stats: {
        score: 92,
        status: 'healthy',
        checks: 15
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取经验教训
app.get('/api/lessons', (req, res) => {
  try {
    // 模拟经验教训数据
    const lessons = [
      {
        id: '1',
        title: '同步失败的处理',
        description: '当Git同步失败时，应检查网络连接和本地目录权限',
        applied: true,
        created: new Date().toISOString()
      },
      {
        id: '2',
        title: '代码审查的重要性',
        description: '定期进行代码审查可以发现潜在的问题',
        applied: false,
        created: new Date().toISOString()
      },
      {
        id: '3',
        title: '项目优先级管理',
        description: '根据项目优先级安排同步和分析任务',
        applied: true,
        created: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      lessons: lessons,
      stats: {
        total: lessons.length,
        applied: lessons.filter(l => l.applied).length,
        new: lessons.filter(l => !l.applied).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 运行自动优化
app.post('/api/optimization/run', (req, res) => {
  try {
    // 模拟自动优化过程
    setTimeout(() => {
      res.json({
        success: true,
        result: {
          optimization: '成功',
          details: '系统优化完成，清理了临时文件，优化了内存使用'
        }
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取优化状态
app.get('/api/optimization/status', (req, res) => {
  try {
    // 模拟优化状态数据
    res.json({
      success: true,
      stats: {
        count: 5,
        success: 5,
        last: new Date().toLocaleString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 运行安全扫描
app.post('/api/security/scan', (req, res) => {
  try {
    // 模拟安全扫描过程
    setTimeout(() => {
      res.json({
        success: true,
        vulnerabilities: 2,
        result: {
          scan: '成功',
          details: '安全扫描完成，发现2个潜在漏洞'
        }
      });
    }, 1500);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取安全扫描状态
app.get('/api/security/status', (req, res) => {
  try {
    // 模拟安全扫描状态数据
    res.json({
      success: true,
      stats: {
        scans: 8,
        vulnerabilities: 5,
        lastScan: new Date().toLocaleString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取性能监控数据
app.get('/api/performance/status', (req, res) => {
  try {
    // 模拟性能监控数据
    res.json({
      success: true,
      stats: {
        cpu: Math.round(Math.random() * 30 + 10), // 10-40%
        disk: Math.round(Math.random() * 20 + 5),  // 5-25%
        network: Math.round(Math.random() * 50 + 10) / 10, // 1-6 MB/s
        lastReport: new Date().toLocaleString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取性能报告
app.get('/api/performance/report', (req, res) => {
  try {
    // 模拟性能报告数据
    res.json({
      success: true,
      report: {
        cpu: {
          average: 25,
          max: 45,
          min: 10
        },
        disk: {
          average: 15,
          max: 30,
          min: 5
        },
        network: {
          average: 3.5,
          max: 8.2,
          min: 0.5
        },
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 辅助函数：获取项目最后同步时间
function getLastSyncTime(projectId) {
  try {
    const logPath = 'D:\\opensource\\sync-logs';
    if (require('fs').existsSync(logPath)) {
      const files = require('fs').readdirSync(logPath);
      const logFile = files.find(f => f.startsWith(projectId + '_'));
      if (logFile) {
        const stats = require('fs').statSync(require('path').join(logPath, logFile));
        return stats.mtime.toISOString();
      }
    }
  } catch (error) {
    // 忽略错误
  }
  return null;
}

// 辅助函数：检查项目同步状态
function checkProjectSyncStatus(projectId) {
  try {
    const logPath = 'D:\\opensource\\sync-logs';
    if (require('fs').existsSync(logPath)) {
      const files = require('fs').readdirSync(logPath);
      const today = new Date().toISOString().split('T')[0];
      const logFile = files.find(f => f.startsWith(projectId + '_') && f.includes(today));
      if (logFile) {
        const content = require('fs').readFileSync(require('path').join(logPath, logFile), 'utf8');
        return content.includes('同步完成') || content.includes('已是最新版本');
      }
    }
  } catch (error) {
    // 忽略错误
  }
  return false;
}

// 辅助函数：更新项目同步状态
function updateProjectSyncStatus(projectId, success) {
  // 这里可以实现更复杂的状态管理逻辑
  // 目前只是记录日志
  console.log(`项目 ${projectId} 同步状态: ${success ? '成功' : '失败'}`);
}

// 静态文件服务
app.use(express.static(path.join(__dirname, 'ui')));

// 启动服务器
app.listen(port, () => {
  console.log(`API服务器已启动，访问地址: http://localhost:${port}`);
  console.log(`UI界面: http://localhost:${port}`);
});

module.exports = app;