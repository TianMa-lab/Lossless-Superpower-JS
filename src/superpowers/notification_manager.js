/**
 * 通知管理器
 * 实现邮件通知、系统通知和Webhook通知
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// 通知配置
const NOTIFICATION_CONFIG = {
  email: {
    enabled: true,
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@example.com',
        pass: 'your-password'
      }
    },
    from: 'Lossless Superpower <no-reply@example.com>',
    to: 'admin@example.com'
  },
  system: {
    enabled: true,
    logPath: 'D:\\opensource\\notifications'
  },
  webhook: {
    enabled: true,
    urls: [
      'http://localhost:3001/api/webhook'
    ]
  },
  templates: {
    alert: {
      subject: '系统告警: {{title}}',
      message: '**告警类型**: {{type}}\n**严重程度**: {{severity}}\n**消息**: {{message}}\n**时间**: {{timestamp}}'
    },
    backup: {
      subject: '备份完成: {{status}}',
      message: '**备份状态**: {{status}}\n**备份文件**: {{backupFile}}\n**时间**: {{timestamp}}'
    },
    sync: {
      subject: '同步完成: {{project}}',
      message: '**项目**: {{project}}\n**状态**: {{status}}\n**结果**: {{result}}\n**时间**: {{timestamp}}'
    }
  }
};

class NotificationManager {
  constructor() {
    this.config = NOTIFICATION_CONFIG;
    this._ensureNotificationDirectory();
  }

  /**
   * 确保通知目录存在
   */
  _ensureNotificationDirectory() {
    if (!fs.existsSync(this.config.system.logPath)) {
      fs.mkdirSync(this.config.system.logPath, { recursive: true });
    }
  }

  /**
   * 发送邮件通知
   * @param {string} template - 模板名称
   * @param {Object} data - 模板数据
   */
  async sendEmail(template, data) {
    if (!this.config.email.enabled) {
      console.log('[通知] 邮件通知已禁用');
      return false;
    }

    try {
      // 这里简化实现，实际应该使用 nodemailer 等库
      const subject = this._renderTemplate(this.config.templates[template].subject, data);
      const message = this._renderTemplate(this.config.templates[template].message, data);
      
      console.log(`[通知] 发送邮件: ${subject}`);
      console.log(`[通知] 邮件内容: ${message}`);
      
      // 模拟邮件发送
      return true;
    } catch (error) {
      console.error('[通知] 发送邮件失败:', error.message);
      return false;
    }
  }

  /**
   * 发送系统通知
   * @param {string} type - 通知类型
   * @param {string} message - 通知消息
   * @param {Object} data - 附加数据
   */
  async sendSystemNotification(type, message, data = {}) {
    if (!this.config.system.enabled) {
      console.log('[通知] 系统通知已禁用');
      return false;
    }

    try {
      const notification = {
        id: `notification-${Date.now()}`,
        type,
        message,
        data,
        timestamp: new Date().toISOString(),
        read: false
      };

      // 保存通知到文件
      const notificationFile = path.join(this.config.system.logPath, `${notification.id}.json`);
      fs.writeFileSync(notificationFile, JSON.stringify(notification, null, 2), 'utf-8');

      console.log(`[通知] 发送系统通知: ${type} - ${message}`);
      return true;
    } catch (error) {
      console.error('[通知] 发送系统通知失败:', error.message);
      return false;
    }
  }

  /**
   * 发送Webhook通知
   * @param {string} event - 事件名称
   * @param {Object} data - 事件数据
   */
  async sendWebhook(event, data) {
    if (!this.config.webhook.enabled) {
      console.log('[通知] Webhook通知已禁用');
      return false;
    }

    const webhookData = {
      event,
      data,
      timestamp: new Date().toISOString()
    };

    const promises = this.config.webhook.urls.map(url => {
      return new Promise((resolve) => {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.request(url, options, (res) => {
          res.resume();
          resolve(true);
        });

        req.on('error', () => {
          resolve(false);
        });

        req.write(JSON.stringify(webhookData));
        req.end();
      });
    });

    const results = await Promise.all(promises);
    const success = results.every(result => result);

    if (success) {
      console.log(`[通知] 发送Webhook通知: ${event}`);
    } else {
      console.error('[通知] 部分Webhook通知发送失败');
    }

    return success;
  }

  /**
   * 发送告警通知
   * @param {Object} alert - 告警信息
   */
  async sendAlert(alert) {
    const data = {
      title: alert.message,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      timestamp: alert.timestamp || new Date().toISOString()
    };

    // 发送多种通知
    const emailResult = await this.sendEmail('alert', data);
    const systemResult = await this.sendSystemNotification('alert', alert.message, alert);
    const webhookResult = await this.sendWebhook('alert', alert);

    return emailResult || systemResult || webhookResult;
  }

  /**
   * 发送备份通知
   * @param {Object} backup - 备份信息
   */
  async sendBackupNotification(backup) {
    const data = {
      status: backup.status || 'completed',
      backupFile: backup.backupFile || 'unknown',
      timestamp: backup.timestamp || new Date().toISOString()
    };

    const emailResult = await this.sendEmail('backup', data);
    const systemResult = await this.sendSystemNotification('backup', `备份${data.status}`, backup);
    const webhookResult = await this.sendWebhook('backup', backup);

    return emailResult || systemResult || webhookResult;
  }

  /**
   * 发送同步通知
   * @param {Object} sync - 同步信息
   */
  async sendSyncNotification(sync) {
    const data = {
      project: sync.project || 'unknown',
      status: sync.status || 'completed',
      result: sync.result || 'success',
      timestamp: sync.timestamp || new Date().toISOString()
    };

    const emailResult = await this.sendEmail('sync', data);
    const systemResult = await this.sendSystemNotification('sync', `${data.project} 同步${data.status}`, sync);
    const webhookResult = await this.sendWebhook('sync', sync);

    return emailResult || systemResult || webhookResult;
  }

  /**
   * 渲染模板
   * @param {string} template - 模板字符串
   * @param {Object} data - 模板数据
   * @returns {string} 渲染后的字符串
   */
  _renderTemplate(template, data) {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      return data[key.trim()] || match;
    });
  }

  /**
   * 获取系统通知列表
   * @param {number} limit - 限制返回数量
   * @returns {Array} 通知列表
   */
  getSystemNotifications(limit = 50) {
    try {
      const files = fs.readdirSync(this.config.system.logPath);
      const notifications = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.config.system.logPath, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          notifications.push(JSON.parse(data));
        }
      }

      // 按时间排序
      notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return notifications.slice(0, limit);
    } catch (error) {
      console.error('[通知] 获取系统通知失败:', error.message);
      return [];
    }
  }

  /**
   * 标记通知为已读
   * @param {string} notificationId - 通知ID
   */
  markNotificationAsRead(notificationId) {
    try {
      const notificationFile = path.join(this.config.system.logPath, `${notificationId}.json`);
      if (fs.existsSync(notificationFile)) {
        const notification = JSON.parse(fs.readFileSync(notificationFile, 'utf-8'));
        notification.read = true;
        fs.writeFileSync(notificationFile, JSON.stringify(notification, null, 2), 'utf-8');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[通知] 标记通知为已读失败:', error.message);
      return false;
    }
  }

  /**
   * 清理旧通知
   * @param {number} days - 保留天数
   */
  cleanupOldNotifications(days = 30) {
    try {
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      const files = fs.readdirSync(this.config.system.logPath);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.config.system.logPath, file);
          const stats = fs.statSync(filePath);

          if (stats.mtime.getTime() < cutoffTime) {
            fs.unlinkSync(filePath);
            console.log(`[通知] 已清理旧通知: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('[通知] 清理旧通知失败:', error.message);
    }
  }
}

// 导出通知管理器
module.exports = NotificationManager;