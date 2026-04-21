const express = require('express');
const router = express.Router();
const {
  getAllIterations,
  getIterationByVersion,
  getIterationById,
  getRecentIterations,
  getIterationsByDateRange,
  getIterationsBySystem,
  getStatistics,
  exportData,
  importData,
  addIteration,
  updateIteration,
  deleteIteration
} = require('../superpowers');

// 中间件：错误处理
function errorHandler(err, req, res, next) {
  console.error('API错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
}

// 中间件：请求验证
function validateRequest(req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: '请求体不能为空'
    });
  }
  next();
}

// 获取所有迭代记录
router.get('/iterations', (req, res) => {
  try {
    const iterations = getAllIterations();
    res.json({
      success: true,
      data: iterations
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 根据版本获取迭代记录
router.get('/iterations/version/:version', (req, res) => {
  try {
    const { version } = req.params;
    const iteration = getIterationByVersion(version);
    if (iteration) {
      res.json({
        success: true,
        data: iteration
      });
    } else {
      res.status(404).json({
        success: false,
        message: `版本 ${version} 的迭代记录不存在`
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 根据ID获取迭代记录
router.get('/iterations/id/:id', (req, res) => {
  try {
    const { id } = req.params;
    const iteration = getIterationById(id);
    if (iteration) {
      res.json({
        success: true,
        data: iteration
      });
    } else {
      res.status(404).json({
        success: false,
        message: `ID ${id} 的迭代记录不存在`
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 获取最近的迭代记录
router.get('/iterations/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const iterations = getRecentIterations(limit);
    res.json({
      success: true,
      data: iterations
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 根据日期范围获取迭代记录
router.get('/iterations/date-range', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '请提供开始日期和结束日期'
      });
    }
    const iterations = getIterationsByDateRange(startDate, endDate);
    res.json({
      success: true,
      data: iterations
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 根据系统获取迭代记录
router.get('/iterations/system/:system', (req, res) => {
  try {
    const { system } = req.params;
    const iterations = getIterationsBySystem(system);
    res.json({
      success: true,
      data: iterations
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 获取统计信息
router.get('/iterations/statistics', (req, res) => {
  try {
    const statistics = getStatistics();
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 导出迭代数据
router.get('/iterations/export', (req, res) => {
  try {
    const format = req.query.format || 'json';
    const data = exportData(format);
    
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=iterations.${format}`);
    
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 导入迭代数据
router.post('/iterations/import', validateRequest, (req, res) => {
  try {
    const { data, format } = req.body;
    if (!data) {
      return res.status(400).json({
        success: false,
        message: '请提供要导入的数据'
      });
    }
    const result = importData(data, format || 'json');
    res.json({
      success: result,
      message: result ? '数据导入成功' : '数据导入失败'
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 添加迭代记录
router.post('/iterations', validateRequest, (req, res) => {
  try {
    const iteration = req.body;
    const result = addIteration(iteration);
    res.json({
      success: result,
      message: result ? '迭代记录添加成功' : '迭代记录添加失败'
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 更新迭代记录
router.put('/iterations/:id', validateRequest, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = updateIteration(id, updates);
    if (result) {
      res.json({
        success: true,
        message: '迭代记录更新成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `ID ${id} 的迭代记录不存在`
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// 删除迭代记录
router.delete('/iterations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteIteration(id);
    if (result) {
      res.json({
        success: true,
        message: '迭代记录删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `ID ${id} 的迭代记录不存在`
      });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
});

module.exports = router;
