const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecurityManager {
  constructor() {
    this.securityDir = path.join(__dirname, 'security');
    this.keysDir = path.join(this.securityDir, 'keys');
    this.auditDir = path.join(this.securityDir, 'audit');
    this.encryptionKey = this._generateEncryptionKey();
  }

  async init() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.securityDir)) {
        fs.mkdirSync(this.securityDir, { recursive: true });
      }
      if (!fs.existsSync(this.keysDir)) {
        fs.mkdirSync(this.keysDir, { recursive: true });
      }
      if (!fs.existsSync(this.auditDir)) {
        fs.mkdirSync(this.auditDir, { recursive: true });
      }

      // 保存加密密钥
      this._saveEncryptionKey();

      console.log('安全性增强系统初始化成功');
      return true;
    } catch (error) {
      console.error('安全性增强系统初始化失败:', error.message);
      return false;
    }
  }

  // 生成加密密钥
  _generateEncryptionKey() {
    try {
      const keyPath = path.join(this.keysDir, 'encryption_key.json');
      if (fs.existsSync(keyPath)) {
        const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
        return keyData.key;
      } else {
        const key = crypto.randomBytes(32).toString('hex');
        return key;
      }
    } catch (error) {
      console.error('生成加密密钥失败:', error.message);
      return crypto.randomBytes(32).toString('hex');
    }
  }

  // 保存加密密钥
  _saveEncryptionKey() {
    try {
      const keyPath = path.join(this.keysDir, 'encryption_key.json');
      const keyData = {
        key: this.encryptionKey,
        generatedAt: Date.now()
      };
      fs.writeFileSync(keyPath, JSON.stringify(keyData, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存加密密钥失败:', error.message);
    }
  }

  // 加密数据
  encryptData(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv);
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
      };
    } catch (error) {
      console.error('加密数据失败:', error.message);
      return null;
    }
  }

  // 解密数据
  decryptData(encryptedData) {
    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv);
      let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('解密数据失败:', error.message);
      return null;
    }
  }

  // 生成安全哈希
  generateHash(data) {
    try {
      const hash = crypto.createHash('sha256');
      hash.update(JSON.stringify(data));
      return hash.digest('hex');
    } catch (error) {
      console.error('生成哈希失败:', error.message);
      return null;
    }
  }

  // 验证数据完整性
  verifyDataIntegrity(data, hash) {
    try {
      const generatedHash = this.generateHash(data);
      return generatedHash === hash;
    } catch (error) {
      console.error('验证数据完整性失败:', error.message);
      return false;
    }
  }

  // 记录安全审计日志
  logSecurityEvent(event) {
    try {
      const eventData = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...event
      };

      const auditFile = path.join(this.auditDir, `audit_${new Date().toISOString().split('T')[0]}.json`);
      
      let auditData = [];
      if (fs.existsSync(auditFile)) {
        try {
          auditData = JSON.parse(fs.readFileSync(auditFile, 'utf-8'));
        } catch (error) {
          auditData = [];
        }
      }

      auditData.push(eventData);
      fs.writeFileSync(auditFile, JSON.stringify(auditData, null, 2), 'utf-8');

      return eventData.id;
    } catch (error) {
      console.error('记录安全事件失败:', error.message);
      return null;
    }
  }

  // 获取安全审计日志
  getSecurityAuditLogs(days = 7) {
    try {
      const logs = [];
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

      const auditFiles = fs.readdirSync(this.auditDir)
        .filter(file => file.endsWith('.json'));

      for (const file of auditFiles) {
        const filePath = path.join(this.auditDir, file);
        try {
          const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          const relevantEvents = fileData.filter(event => event.timestamp > cutoffDate);
          logs.push(...relevantEvents);
        } catch (error) {
          console.error(`读取审计文件 ${file} 失败:`, error.message);
        }
      }

      return logs.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('获取安全审计日志失败:', error.message);
      return [];
    }
  }

  // 执行安全扫描
  runSecurityScan() {
    try {
      console.log('开始执行安全扫描...');

      const scanResult = {
        id: `scan_${Date.now()}`,
        timestamp: Date.now(),
        scanType: 'comprehensive',
        results: {
          vulnerabilities: [],
          warnings: [],
          recommendations: []
        }
      };

      // 检查文件权限
      this._checkFilePermissions(scanResult);

      // 检查敏感信息泄露
      this._checkSensitiveInformation(scanResult);

      // 检查配置安全
      this._checkConfigurationSecurity(scanResult);

      // 保存扫描结果
      const scanFile = path.join(this.securityDir, `security_scan_${scanResult.id}.json`);
      fs.writeFileSync(scanFile, JSON.stringify(scanResult, null, 2), 'utf-8');

      console.log('安全扫描完成');
      return scanResult;
    } catch (error) {
      console.error('执行安全扫描失败:', error.message);
      return null;
    }
  }

  // 检查文件权限
  _checkFilePermissions(scanResult) {
    try {
      const sensitiveFiles = [
        path.join(this.keysDir, 'encryption_key.json'),
        path.join(__dirname, '..', 'storage', 'db', 'data', 'memories.json'),
        path.join(__dirname, '..', 'storage', 'db', 'data', 'knowledge.json'),
        path.join(__dirname, '..', 'storage', 'db', 'data', 'users.json')
      ];

      for (const file of sensitiveFiles) {
        if (fs.existsSync(file)) {
          try {
            const stats = fs.statSync(file);
            // 检查文件权限
            if (stats.mode & 0o007) { // 其他用户可写
              scanResult.results.vulnerabilities.push({
                type: 'file_permission',
                severity: 'high',
                description: `文件 ${file} 权限过于宽松`,
                recommendation: '限制文件权限为 600'
              });
            }
          } catch (error) {
            console.error(`检查文件 ${file} 权限失败:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('检查文件权限失败:', error.message);
    }
  }

  // 检查敏感信息泄露
  _checkSensitiveInformation(scanResult) {
    try {
      const patterns = [
        /\b(api|key|secret|token|password)\b/i,
        /\b(ssh|private|rsa|dsa)\b/i,
        /\b(aws|azure|google|cloud)\b.*\b(key|secret)\b/i
      ];

      const filesToCheck = [
        path.join(__dirname, '..', 'package.json'),
        path.join(__dirname, '..', 'src', 'api', 'server.js'),
        path.join(__dirname, '..', 'src', 'superpowers', 'index.js')
      ];

      for (const file of filesToCheck) {
        if (fs.existsSync(file)) {
          try {
            const content = fs.readFileSync(file, 'utf-8');
            for (const pattern of patterns) {
              if (pattern.test(content)) {
                scanResult.results.warnings.push({
                  type: 'sensitive_information',
                  severity: 'medium',
                  description: `文件 ${file} 可能包含敏感信息`,
                  recommendation: '检查并移除敏感信息或使用环境变量'
                });
                break;
              }
            }
          } catch (error) {
            console.error(`检查文件 ${file} 敏感信息失败:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('检查敏感信息失败:', error.message);
    }
  }

  // 检查配置安全
  _checkConfigurationSecurity(scanResult) {
    try {
      // 检查API服务器配置
      const serverFile = path.join(__dirname, '..', 'src', 'api', 'server.js');
      if (fs.existsSync(serverFile)) {
        const content = fs.readFileSync(serverFile, 'utf-8');
        
        // 检查CORS配置
        if (!content.includes('cors()')) {
          scanResult.results.recommendations.push({
            type: 'cors_configuration',
            description: 'API服务器未配置CORS',
            recommendation: '添加CORS中间件以提高安全性'
          });
        }

        // 检查错误处理
        if (!content.includes('try') || !content.includes('catch')) {
          scanResult.results.recommendations.push({
            type: 'error_handling',
            description: 'API服务器缺少错误处理',
            recommendation: '添加完善的错误处理机制'
          });
        }
      }
    } catch (error) {
      console.error('检查配置安全失败:', error.message);
    }
  }

  // 生成安全报告
  generateSecurityReport() {
    try {
      const auditLogs = this.getSecurityAuditLogs(30); // 最近30天的审计日志
      const scanResult = this.runSecurityScan();

      const report = {
        generatedAt: Date.now(),
        auditLogs: auditLogs,
        securityScan: scanResult,
        summary: {
          totalEvents: auditLogs.length,
          totalVulnerabilities: scanResult ? scanResult.results.vulnerabilities.length : 0,
          totalWarnings: scanResult ? scanResult.results.warnings.length : 0,
          totalRecommendations: scanResult ? scanResult.results.recommendations.length : 0
        }
      };

      const reportFile = path.join(this.securityDir, `security_report_${Date.now()}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');

      console.log('安全报告生成成功');
      return report;
    } catch (error) {
      console.error('生成安全报告失败:', error.message);
      return null;
    }
  }

  // 实施安全措施
  implementSecurityMeasures() {
    try {
      console.log('开始实施安全措施...');

      const measures = [];

      // 1. 确保密钥文件安全
      const keyPath = path.join(this.keysDir, 'encryption_key.json');
      if (fs.existsSync(keyPath)) {
        try {
          fs.chmodSync(keyPath, 0o600);
          measures.push({
            id: `measure_${Date.now()}_1`,
            type: 'file_permission',
            description: '设置加密密钥文件权限为 600',
            status: 'success'
          });
        } catch (error) {
          measures.push({
            id: `measure_${Date.now()}_1`,
            type: 'file_permission',
            description: '设置加密密钥文件权限为 600',
            status: 'failed',
            error: error.message
          });
        }
      }

      // 2. 清理旧的审计日志
      this._cleanOldAuditLogs();
      measures.push({
        id: `measure_${Date.now()}_2`,
        type: 'audit_cleanup',
        description: '清理旧的审计日志',
        status: 'success'
      });

      // 3. 生成新的加密密钥（可选）
      // this.encryptionKey = this._generateEncryptionKey();
      // this._saveEncryptionKey();
      // measures.push({
      //   id: `measure_${Date.now()}_3`,
      //   type: 'key_rotation',
      //   description: '生成新的加密密钥',
      //   status: 'success'
      // });

      console.log('安全措施实施完成');
      return measures;
    } catch (error) {
      console.error('实施安全措施失败:', error.message);
      return [];
    }
  }

  // 清理旧的审计日志
  _cleanOldAuditLogs(days = 90) {
    try {
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

      const auditFiles = fs.readdirSync(this.auditDir)
        .filter(file => file.endsWith('.json'));

      for (const file of auditFiles) {
        const filePath = path.join(this.auditDir, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.mtime.getTime() < cutoffDate) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(`清理审计文件 ${file} 失败:`, error.message);
        }
      }
    } catch (error) {
      console.error('清理旧审计日志失败:', error.message);
    }
  }

  // 验证安全状态
  validateSecurityStatus() {
    try {
      console.log('开始验证安全状态...');

      const status = {
        timestamp: Date.now(),
        encryptionKey: this.encryptionKey ? 'present' : 'missing',
        auditLogs: this.getSecurityAuditLogs(7).length,
        securityScan: this.runSecurityScan(),
        overallStatus: 'secure'
      };

      // 检查是否存在高危漏洞
      if (status.securityScan && status.securityScan.results.vulnerabilities.length > 0) {
        status.overallStatus = 'vulnerable';
      } else if (status.securityScan && status.securityScan.results.warnings.length > 0) {
        status.overallStatus = 'warning';
      }

      console.log('安全状态验证完成:', status.overallStatus);
      return status;
    } catch (error) {
      console.error('验证安全状态失败:', error.message);
      return null;
    }
  }
}

const securityManager = new SecurityManager();

module.exports = {
  SecurityManager,
  securityManager
};
