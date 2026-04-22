/**
 * 安全扫描模块
 * 每周执行一次安全检查，检测系统安全问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 安全扫描配置
const SECURITY_CONFIG = {
  interval: 7 * 24 * 60 * 60 * 1000, // 7天
  logPath: 'D:\\opensource\\security-logs',
  checks: {
    dependencies: true,
    code: true,
    config: true,
    network: true,
    permissions: true
  },
  ignorePatterns: [
    'node_modules',
    'backups',
    'monitoring',
    'performance-logs',
    'security-logs',
    'scheduler-logs',
    'sync-logs'
  ]
};

class SecurityScanner {
  constructor() {
    this.config = SECURITY_CONFIG;
    this._ensureLogDirectory();
  }

  /**
   * 确保日志目录存在
   */
  _ensureLogDirectory() {
    if (!fs.existsSync(this.config.logPath)) {
      fs.mkdirSync(this.config.logPath, { recursive: true });
    }
  }

  /**
   * 执行安全扫描
   */
  async runSecurityScan() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`[安全] 开始执行安全扫描: ${timestamp}`);
      
      // 执行各项安全检查
      const results = {
        timestamp,
        checks: {
          dependencies: this.config.checks.dependencies ? await this._checkDependencies() : null,
          code: this.config.checks.code ? await this._checkCode() : null,
          config: this.config.checks.config ? await this._checkConfig() : null,
          network: this.config.checks.network ? await this._checkNetwork() : null,
          permissions: this.config.checks.permissions ? await this._checkPermissions() : null
        },
        vulnerabilities: [],
        recommendations: []
      };

      // 收集漏洞
      results.vulnerabilities = this._collectVulnerabilities(results.checks);

      // 生成安全建议
      results.recommendations = this._generateRecommendations(results.vulnerabilities);

      // 保存扫描结果
      this._saveScanResults(results);

      console.log(`[安全] 安全扫描完成，发现 ${results.vulnerabilities.length} 个漏洞`);
      return results;
    } catch (error) {
      console.error('[安全] 安全扫描失败:', error.message);
      return null;
    }
  }

  /**
   * 检查依赖包安全
   * @returns {Object} 依赖包安全检查结果
   */
  async _checkDependencies() {
    try {
      const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        return { status: 'error', message: 'package.json 不存在' };
      }

      // 读取 package.json
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // 模拟依赖包安全检查
      const vulnerabilities = [];
      
      // 检查常见的安全问题
      for (const [name, version] of Object.entries(dependencies)) {
        // 模拟发现漏洞
        if (name === 'lodash' && version < '4.17.21') {
          vulnerabilities.push({
            package: name,
            version,
            severity: 'high',
            description: 'lodash 存在原型链污染漏洞',
            cve: 'CVE-2021-41773'
          });
        }
      }

      return {
        status: vulnerabilities.length === 0 ? 'safe' : 'vulnerable',
        dependencies: Object.keys(dependencies).length,
        vulnerabilities
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 检查代码安全
   * @returns {Object} 代码安全检查结果
   */
  async _checkCode() {
    try {
      const projectRoot = path.join(__dirname, '..', '..');
      const vulnerabilities = [];

      // 扫描 JavaScript 文件
      const jsFiles = this._findFiles(projectRoot, '*.js');
      for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // 检查常见的安全问题
        if (content.includes('console.log(') && content.includes('password')) {
          vulnerabilities.push({
            file: file.replace(projectRoot, ''),
            type: 'info',
            description: '可能存在密码日志记录'
          });
        }

        if (content.includes('eval(')) {
          vulnerabilities.push({
            file: file.replace(projectRoot, ''),
            type: 'high',
            description: '使用了 eval() 函数，可能导致代码注入'
          });
        }

        if (content.includes('execSync(')) {
          vulnerabilities.push({
            file: file.replace(projectRoot, ''),
            type: 'medium',
            description: '使用了 execSync() 函数，可能导致命令注入'
          });
        }
      }

      return {
        status: vulnerabilities.length === 0 ? 'safe' : 'vulnerable',
        filesScanned: jsFiles.length,
        vulnerabilities
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 检查配置文件安全
   * @returns {Object} 配置文件安全检查结果
   */
  async _checkConfig() {
    try {
      const projectRoot = path.join(__dirname, '..', '..');
      const vulnerabilities = [];

      // 扫描配置文件
      const configFiles = this._findFiles(projectRoot, '*.json').concat(
        this._findFiles(projectRoot, '*.config.js')
      );

      for (const file of configFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // 检查敏感信息
        const sensitivePatterns = [
          /password|secret|token|api_key|access_key/gi
        ];

        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            vulnerabilities.push({
              file: file.replace(projectRoot, ''),
              type: 'high',
              description: '可能包含敏感信息'
            });
            break;
          }
        }
      }

      return {
        status: vulnerabilities.length === 0 ? 'safe' : 'vulnerable',
        filesScanned: configFiles.length,
        vulnerabilities
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 检查网络安全
   * @returns {Object} 网络安全检查结果
   */
  async _checkNetwork() {
    try {
      const vulnerabilities = [];

      // 检查监听端口
      try {
        const netstatOutput = execSync('netstat -ano', { encoding: 'utf-8' });
        const lines = netstatOutput.split('\n');
        
        // 检查常见的危险端口
        const dangerousPorts = [21, 23, 25, 110, 135, 139, 445];
        
        for (const line of lines) {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
              const portMatch = parts[1].match(/:(\d+)$/);
              if (portMatch) {
                const port = parseInt(portMatch[1]);
                if (dangerousPorts.includes(port)) {
                  vulnerabilities.push({
                    type: 'medium',
                    description: `检测到危险端口 ${port} 正在监听`
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        // 忽略执行错误
      }

      return {
        status: vulnerabilities.length === 0 ? 'safe' : 'vulnerable',
        vulnerabilities
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 检查权限安全
   * @returns {Object} 权限安全检查结果
   */
  async _checkPermissions() {
    try {
      const projectRoot = path.join(__dirname, '..', '..');
      const vulnerabilities = [];

      // 检查文件权限
      const files = this._findFiles(projectRoot, '*');
      for (const file of files) {
        try {
          const stats = fs.statSync(file);
          const mode = stats.mode.toString(8).slice(-4);
          
          // 检查危险的权限设置
          if (mode.includes('777')) {
            vulnerabilities.push({
              file: file.replace(projectRoot, ''),
              type: 'high',
              description: '文件权限设置为 777，过于宽松'
            });
          }
        } catch (error) {
          // 忽略权限错误
        }
      }

      return {
        status: vulnerabilities.length === 0 ? 'safe' : 'vulnerable',
        filesScanned: files.length,
        vulnerabilities
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  /**
   * 收集漏洞
   * @param {Object} checks - 检查结果
   * @returns {Array} 漏洞列表
   */
  _collectVulnerabilities(checks) {
    const vulnerabilities = [];

    for (const [checkType, checkResult] of Object.entries(checks)) {
      if (checkResult && checkResult.vulnerabilities) {
        for (const vuln of checkResult.vulnerabilities) {
          vulnerabilities.push({
            type: checkType,
            ...vuln
          });
        }
      }
    }

    return vulnerabilities;
  }

  /**
   * 生成安全建议
   * @param {Array} vulnerabilities - 漏洞列表
   * @returns {Array} 安全建议
   */
  _generateRecommendations(vulnerabilities) {
    const recommendations = [];

    // 按类型分组漏洞
    const vulnsByType = vulnerabilities.reduce((acc, vuln) => {
      if (!acc[vuln.type]) acc[vuln.type] = [];
      acc[vuln.type].push(vuln);
      return acc;
    }, {});

    // 生成建议
    for (const [type, vulns] of Object.entries(vulnsByType)) {
      switch (type) {
        case 'dependencies':
          recommendations.push({
            type: 'dependencies',
            severity: 'high',
            message: `发现 ${vulns.length} 个依赖包漏洞`,
            suggestion: '更新依赖包到最新版本，使用 npm audit 检查详细信息'
          });
          break;
        case 'code':
          recommendations.push({
            type: 'code',
            severity: 'medium',
            message: `发现 ${vulns.length} 个代码安全问题`,
            suggestion: '修复代码中的安全问题，避免使用危险函数'
          });
          break;
        case 'config':
          recommendations.push({
            type: 'config',
            severity: 'high',
            message: `发现 ${vulns.length} 个配置文件安全问题`,
            suggestion: '移除配置文件中的敏感信息，使用环境变量'
          });
          break;
        case 'network':
          recommendations.push({
            type: 'network',
            severity: 'medium',
            message: `发现 ${vulns.length} 个网络安全问题`,
            suggestion: '关闭不需要的端口，配置防火墙'
          });
          break;
        case 'permissions':
          recommendations.push({
            type: 'permissions',
            severity: 'medium',
            message: `发现 ${vulns.length} 个权限安全问题`,
            suggestion: '修复文件权限，避免使用 777 权限'
          });
          break;
      }
    }

    return recommendations;
  }

  /**
   * 保存扫描结果
   * @param {Object} results - 扫描结果
   */
  _saveScanResults(results) {
    const fileName = `security-scan-${results.timestamp.replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(this.config.logPath, fileName);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`[安全] 扫描结果已保存: ${fileName}`);
    } catch (error) {
      console.error('[安全] 保存扫描结果失败:', error.message);
    }
  }

  /**
   * 查找文件
   * @param {string} directory - 目录
   * @param {string} pattern - 文件模式
   * @returns {Array} 文件列表
   */
  _findFiles(directory, pattern) {
    const files = [];
    
    function search(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        // 检查是否忽略
        if (this.config.ignorePatterns.includes(item)) {
          continue;
        }
        
        if (stats.isDirectory()) {
          search(itemPath);
        } else if (path.basename(item).match(new RegExp(pattern.replace('*', '.*')))) {
          files.push(itemPath);
        }
      }
    }
    
    search.call(this, directory);
    return files;
  }

  /**
   * 启动安全扫描
   */
  startSecurityScanning() {
    console.log('启动安全扫描，每周执行一次安全检查');
    
    // 立即执行一次
    this.runSecurityScan();
    
    // 设置定时任务
    setInterval(() => {
      this.runSecurityScan();
    }, this.config.interval);
  }

  /**
   * 获取安全扫描历史
   * @param {number} limit - 限制返回数量
   * @returns {Array} 安全扫描历史
   */
  getSecurityHistory(limit = 10) {
    try {
      const files = fs.readdirSync(this.config.logPath);
      const history = [];
      
      for (const file of files) {
        if (file.startsWith('security-scan-') && file.endsWith('.json')) {
          const filePath = path.join(this.config.logPath, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          history.push(JSON.parse(data));
        }
      }
      
      // 按时间排序
      history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return history.slice(0, limit);
    } catch (error) {
      console.error('[安全] 获取安全扫描历史失败:', error.message);
      return [];
    }
  }

  /**
   * 生成安全报告
   * @returns {string} 安全报告
   */
  generateSecurityReport() {
    const history = this.getSecurityHistory(1);
    if (history.length === 0) {
      return '暂无安全扫描数据';
    }
    
    const latest = history[0];
    let report = `# 安全报告\n\n`;
    report += `**生成时间**: ${latest.timestamp}\n\n`;
    
    // 漏洞统计
    report += `## 漏洞统计\n`;
    report += `- 总漏洞数: ${latest.vulnerabilities.length}\n`;
    
    // 详细漏洞
    if (latest.vulnerabilities.length > 0) {
      report += `\n## 详细漏洞\n`;
      for (const vuln of latest.vulnerabilities) {
        report += `- [${vuln.severity || 'medium'}] ${vuln.description}\n`;
        if (vuln.file) report += `  文件: ${vuln.file}\n`;
        if (vuln.package) report += `  包: ${vuln.package}@${vuln.version}\n`;
      }
    }
    
    // 安全建议
    if (latest.recommendations.length > 0) {
      report += `\n## 安全建议\n`;
      for (const recommendation of latest.recommendations) {
        report += `- [${recommendation.severity.toUpperCase()}] ${recommendation.message}\n`;
        report += `  建议: ${recommendation.suggestion}\n`;
      }
    }
    
    return report;
  }

  /**
   * 清理旧的安全扫描数据
   * @param {number} days - 保留天数
   */
  cleanupOldData(days = 30) {
    try {
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      const files = fs.readdirSync(this.config.logPath);
      
      for (const file of files) {
        if (file.startsWith('security-scan-') && file.endsWith('.json')) {
          const filePath = path.join(this.config.logPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            console.log(`[安全] 已清理旧安全扫描数据: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('[安全] 清理旧安全扫描数据失败:', error.message);
    }
  }
}

// 导出安全扫描模块
module.exports = SecurityScanner;