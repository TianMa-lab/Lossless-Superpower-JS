/**
 * 存储管理工具
 * 用于监控和管理频繁迭代下的存储状态
 */

const { storageManager, optimizeStorage, generateStorageReport, backupStorage, cleanupOldData, archiveOldData } = require('./src/superpowers/storage_manager');

// 执行存储管理操作
async function runStorageManagement() {
  console.log('=== 存储管理工具 ===\n');
  
  try {
    // 1. 生成存储报告
    console.log('1. 生成存储报告...');
    const report = generateStorageReport();
    console.log('✅ 存储报告生成成功\n');
    
    // 显示关键统计信息
    console.log('=== 存储统计信息 ===');
    console.log(`总文件数: ${report.totalFiles}`);
    console.log(`总存储大小: ${report.totalSizeFormatted}`);
    console.log('\n各分类存储情况:');
    Object.entries(report.statistics).forEach(([category, stats]) => {
      if (stats.fileCount !== undefined) {
        console.log(`- ${category}: ${stats.fileCount} 个文件, ${stats.totalSizeFormatted}`);
      }
    });
    console.log('');
    
    // 2. 优化存储
    console.log('2. 优化存储结构...');
    optimizeStorage();
    console.log('✅ 存储优化完成\n');
    
    // 3. 清理过期数据
    console.log('3. 清理过期数据...');
    cleanupOldData(30); // 清理30天前的数据
    console.log('✅ 过期数据清理完成\n');
    
    // 4. 归档旧数据
    console.log('4. 归档旧数据...');
    const categories = ['iterations', 'tasks', 'memory', 'performance', 'knowledge', 'skills'];
    categories.forEach(category => {
      console.log(`  归档 ${category} 数据...`);
      archiveOldData(category, 90); // 归档90天前的数据
    });
    console.log('✅ 旧数据归档完成\n');
    
    // 5. 创建备份
    console.log('5. 创建存储备份...');
    const backupPath = backupStorage(`backup_${new Date().toISOString().split('T')[0]}`);
    console.log(`✅ 存储备份完成: ${backupPath}\n`);
    
    // 6. 生成最终报告
    console.log('6. 生成最终存储报告...');
    const finalReport = generateStorageReport();
    
    // 保存报告到文件
    const fs = require('fs');
    const reportPath = `storage_report_${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    console.log(`✅ 最终报告已保存到: ${reportPath}\n`);
    
    // 总结
    console.log('=== 存储管理完成 ===');
    console.log('✅ 存储状态已优化');
    console.log('✅ 过期数据已清理');
    console.log('✅ 旧数据已归档');
    console.log('✅ 存储已备份');
    console.log('✅ 存储报告已生成');
    
  } catch (error) {
    console.error('存储管理过程中出现错误:', error.message);
    console.error(error.stack);
  }
}

// 执行存储管理
runStorageManagement();