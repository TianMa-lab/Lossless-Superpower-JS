/**
 * 主测试文件
 */

const fs = require('fs');
const path = require('path');

// 运行所有测试文件
function runTests() {
  console.log('Running Lossless Superpower JS tests...');
  
  const testFiles = fs.readdirSync(__dirname).filter(file => file.startsWith('test_') && file.endsWith('.js'));
  
  testFiles.forEach(file => {
    console.log(`\nRunning ${file}...`);
    try {
      require(`./${file}`);
      console.log(`${file} passed!`);
    } catch (error) {
      console.error(`${file} failed:`, error.message);
    }
  });
  
  console.log('\nTest run completed!');
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
