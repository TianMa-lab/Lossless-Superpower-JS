const fs = require('fs');
const path = require('path');

const oldPath = path.join(__dirname, 'plugins', 'trace');
const newPath = path.join(__dirname, 'plugins', 'trae');

console.log(`尝试将目录从 ${oldPath} 重命名为 ${newPath}`);

try {
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('目录重命名成功！');
  } else {
    console.log('源目录不存在');
  }
} catch (error) {
  console.error('目录重命名失败:', error.message);
}
