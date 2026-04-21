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

// 中间件
app.use(cors());
app.use(express.json());

// 初始化各个模块
let syncManager, analyzer, comparator, docGenerator, executor;

try {
  syncManager = new SyncManager();
  analyzer = new Analyzer();
  comparator = new Comparator();
  docGenerator = new DocGenerator();
  executor = new Executor();
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