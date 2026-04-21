/**
 * 存储管理系统
 * 优化频繁迭代下的数据存储方式
 * 实现数据清理、归档、压缩和监控
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class StorageManager {
  constructor(config = {}) {
    this.config = {
      baseDir: './storage',
      maxFileSize: 1024 * 1024 * 10, // 10MB
      maxFilesPerDir: 1000,
      cleanupDays: 30,
      archiveDays: 90,
      compressionLevel: zlib.constants.Z_BEST_COMPRESSION,
      ...config
    };
    
    this.storageDirs = {
      iterations: path.join(this.config.baseDir, 'iterations'),
      tasks: path.join(this.config.baseDir, 'tasks'),
      memory: path.join(this.config.baseDir, 'memory'),
      performance: path.join(this.config.baseDir, 'performance'),
      knowledge: path.join(this.config.baseDir, 'knowledge'),
      skills: path.join(this.config.baseDir, 'skills'),
      backups: path.join(this.config.baseDir, 'backups'),
      archives: path.join(this.config.baseDir, 'archives')
    };
    
    this._ensureDirectories();
  }
  
  /**
   * 确保存储目录存在
   */
  _ensureDirectories() {
    Object.values(this.storageDirs).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  /**
   * 存储数据
   */
  storeData(category, data, options = {}) {
    const dir = this.storageDirs[category];
    if (!dir) {
      throw new Error(`Invalid storage category: ${category}`);
    }
    
    const timestamp = Date.now();
    const fileName = options.filename || `${category}_${timestamp}.json`;
    const filePath = path.join(dir, fileName);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      // 检查文件大小和数量
      this._checkStorageLimits(category);
      
      return {
        path: filePath,
        size: fs.statSync(filePath).size,
        timestamp
      };
    } catch (error) {
      console.error(`存储数据失败: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * 读取数据
   */
  readData(category, fileName) {
    const dir = this.storageDirs[category];
    if (!dir) {
      throw new Error(`Invalid storage category: ${category}`);
    }
    
    const filePath = path.join(dir, fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
      return null;
    } catch (error) {
      console.error(`读取数据失败: ${error.message}`);
      return null;
    }
  }
  
  /**
   * 列出存储的文件
   */
  listFiles(category, options = {}) {
    const dir = this.storageDirs[category];
    if (!dir) {
      throw new Error(`Invalid storage category: ${category}`);
    }
    
    try {
      const files = fs.readdirSync(dir);
      const filteredFiles = files.filter(file => {
        if (options.pattern) {
          return file.match(options.pattern);
        }
        return true;
      });
      
      return filteredFiles.map(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          mtime: stats.mtime,
          ctime: stats.ctime
        };
      }).sort((a, b) => b.mtime - a.mtime);
    } catch (error) {
      console.error(`列出文件失败: ${error.message}`);
      return [];
    }
  }
  
  /**
   * 检查存储限制
   */
  _checkStorageLimits(category) {
    const dir = this.storageDirs[category];
    const files = this.listFiles(category);
    
    // 检查文件数量
    if (files.length > this.config.maxFilesPerDir) {
      this._cleanupOldFiles(category, files.length - this.config.maxFilesPerDir);
    }
    
    // 检查文件大小
    files.forEach(file => {
      if (file.size > this.config.maxFileSize) {
        this._compressFile(file.path);
      }
    });
  }
  
  /**
   * 清理旧文件
   */
  _cleanupOldFiles(category, keepCount = 100) {
    const files = this.listFiles(category);
    if (files.length <= keepCount) return;
    
    const filesToDelete = files.slice(keepCount);
    filesToDelete.forEach(file => {
      try {
        fs.unlinkSync(file.path);
        console.log(`清理文件: ${file.name}`);
      } catch (error) {
        console.error(`删除文件失败: ${error.message}`);
      }
    });
  }
  
  /**
   * 压缩文件
   */
  _compressFile(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      const compressed = zlib.gzipSync(content, {
        level: this.config.compressionLevel
      });
      
      const compressedPath = filePath + '.gz';
      fs.writeFileSync(compressedPath, compressed);
      
      // 删除原文件
      fs.unlinkSync(filePath);
      
      console.log(`压缩文件: ${path.basename(filePath)} -> ${path.basename(compressedPath)}`);
    } catch (error) {
      console.error(`压缩文件失败: ${error.message}`);
    }
  }
  
  /**
   * 解压缩文件
   */
  decompressFile(compressedPath) {
    try {
      const compressed = fs.readFileSync(compressedPath);
      const decompressed = zlib.gunzipSync(compressed);
      
      const originalPath = compressedPath.replace('.gz', '');
      fs.writeFileSync(originalPath, decompressed);
      
      return originalPath;
    } catch (error) {
      console.error(`解压缩文件失败: ${error.message}`);
      return null;
    }
  }
  
  /**
   * 归档旧数据
   */
  archiveOldData(category, days = this.config.archiveDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const files = this.listFiles(category);
    const oldFiles = files.filter(file => file.mtime < cutoffDate);
    
    if (oldFiles.length === 0) {
      console.log(`没有需要归档的${category}数据`);
      return;
    }
    
    const archiveDir = path.join(this.storageDirs.archives, category);
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    
    oldFiles.forEach(file => {
      try {
        const archivePath = path.join(archiveDir, path.basename(file.path));
        fs.renameSync(file.path, archivePath);
        
        // 压缩归档文件
        this._compressFile(archivePath);
        
        console.log(`归档文件: ${file.name}`);
      } catch (error) {
        console.error(`归档文件失败: ${error.message}`);
      }
    });
  }
  
  /**
   * 清理过期数据
   */
  cleanupOldData(days = this.config.cleanupDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    Object.keys(this.storageDirs).forEach(category => {
      if (category === 'archives') return;
      
      const files = this.listFiles(category);
      const oldFiles = files.filter(file => file.mtime < cutoffDate);
      
      oldFiles.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log(`清理过期文件: ${file.name}`);
        } catch (error) {
          console.error(`清理文件失败: ${error.message}`);
        }
      });
    });
  }
  
  /**
   * 获取存储统计信息
   */
  getStorageStats() {
    const stats = {};
    
    Object.entries(this.storageDirs).forEach(([category, dir]) => {
      try {
        const files = this.listFiles(category);
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        stats[category] = {
          fileCount: files.length,
          totalSize,
          totalSizeFormatted: this._formatSize(totalSize),
          oldestFile: files.length > 0 ? files[files.length - 1].mtime : null,
          newestFile: files.length > 0 ? files[0].mtime : null
        };
      } catch (error) {
        stats[category] = {
          error: error.message
        };
      }
    });
    
    return stats;
  }
  
  /**
   * 格式化文件大小
   */
  _formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * 优化存储结构
   */
  optimizeStorage() {
    console.log('开始优化存储结构...');
    
    // 检查并清理所有类别
    Object.keys(this.storageDirs).forEach(category => {
      if (category === 'archives') return;
      
      console.log(`优化 ${category} 存储...`);
      this._checkStorageLimits(category);
      this.archiveOldData(category);
    });
    
    console.log('存储优化完成');
  }
  
  /**
   * 生成存储报告
   */
  generateStorageReport() {
    const stats = this.getStorageStats();
    const report = {
      generatedAt: new Date().toISOString(),
      configuration: this.config,
      statistics: stats,
      totalFiles: Object.values(stats).reduce((sum, stat) => sum + (stat.fileCount || 0), 0),
      totalSize: Object.values(stats).reduce((sum, stat) => sum + (stat.totalSize || 0), 0)
    };
    
    report.totalSizeFormatted = this._formatSize(report.totalSize);
    
    return report;
  }
  
  /**
   * 备份存储数据
   */
  backupStorage(backupName = null) {
    const backupDir = path.join(
      this.storageDirs.backups,
      backupName || `backup_${Date.now()}`
    );
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    Object.entries(this.storageDirs).forEach(([category, dir]) => {
      if (category === 'backups' || category === 'archives') return;
      
      const categoryBackupDir = path.join(backupDir, category);
      if (!fs.existsSync(categoryBackupDir)) {
        fs.mkdirSync(categoryBackupDir, { recursive: true });
      }
      
      const files = this.listFiles(category);
      files.forEach(file => {
        try {
          const destPath = path.join(categoryBackupDir, path.basename(file.path));
          fs.copyFileSync(file.path, destPath);
        } catch (error) {
          console.error(`备份文件失败: ${error.message}`);
        }
      });
    });
    
    console.log(`存储备份完成: ${path.basename(backupDir)}`);
    return backupDir;
  }
  
  /**
   * 恢复存储数据
   */
  restoreStorage(backupPath) {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`备份路径不存在: ${backupPath}`);
    }
    
    const categories = fs.readdirSync(backupPath);
    categories.forEach(category => {
      const categoryBackupDir = path.join(backupPath, category);
      if (!fs.statSync(categoryBackupDir).isDirectory()) return;
      
      const targetDir = this.storageDirs[category];
      if (!targetDir) return;
      
      const files = fs.readdirSync(categoryBackupDir);
      files.forEach(file => {
        try {
          const srcPath = path.join(categoryBackupDir, file);
          const destPath = path.join(targetDir, file);
          fs.copyFileSync(srcPath, destPath);
        } catch (error) {
          console.error(`恢复文件失败: ${error.message}`);
        }
      });
    });
    
    console.log(`存储恢复完成: ${path.basename(backupPath)}`);
  }
}

// 全局存储管理器实例
const storageManager = new StorageManager();

// 导出函数
function storeData(category, data, options = {}) {
  return storageManager.storeData(category, data, options);
}

function readData(category, fileName) {
  return storageManager.readData(category, fileName);
}

function listFiles(category, options = {}) {
  return storageManager.listFiles(category, options);
}

function archiveOldData(category, days) {
  return storageManager.archiveOldData(category, days);
}

function cleanupOldData(days) {
  return storageManager.cleanupOldData(days);
}

function getStorageStats() {
  return storageManager.getStorageStats();
}

function optimizeStorage() {
  return storageManager.optimizeStorage();
}

function generateStorageReport() {
  return storageManager.generateStorageReport();
}

function backupStorage(backupName) {
  return storageManager.backupStorage(backupName);
}

function restoreStorage(backupPath) {
  return storageManager.restoreStorage(backupPath);
}

module.exports = {
  StorageManager,
  storageManager,
  storeData,
  readData,
  listFiles,
  archiveOldData,
  cleanupOldData,
  getStorageStats,
  optimizeStorage,
  generateStorageReport,
  backupStorage,
  restoreStorage
};