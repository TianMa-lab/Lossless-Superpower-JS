// 启动web服务器，提供静态文件服务
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'ui')));

// 根路径重定向到index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`Web服务器已启动，访问地址: http://localhost:${port}`);
  console.log(`UI界面: http://localhost:${port}`);
});

module.exports = app;