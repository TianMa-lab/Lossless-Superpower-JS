const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class WebhookManager {
  constructor(config = {}) {
    this.webhooksDir = config.webhooksDir || 'webhooks';
    this.webhooksFile = path.join(this.webhooksDir, 'webhooks.json');
    this.webhooks = [];
    this.eventHistory = [];
    
    this._ensureDirectory();
    this._loadWebhooks();
  }

  _ensureDirectory() {
    if (!fs.existsSync(this.webhooksDir)) {
      fs.mkdirSync(this.webhooksDir, { recursive: true });
    }
  }

  _loadWebhooks() {
    try {
      if (fs.existsSync(this.webhooksFile)) {
        const data = fs.readFileSync(this.webhooksFile, 'utf-8');
        this.webhooks = JSON.parse(data);
        console.log(`加载了 ${this.webhooks.length} 个Webhook配置`);
      }
    } catch (error) {
      console.error('加载Webhook配置失败:', error.message);
      this.webhooks = [];
    }
  }

  _saveWebhooks() {
    try {
      fs.writeFileSync(this.webhooksFile, JSON.stringify(this.webhooks, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存Webhook配置失败:', error.message);
      return false;
    }
  }

  registerWebhook(name, url, events, options = {}) {
    const webhook = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      url,
      events: Array.isArray(events) ? events : [events],
      enabled: options.enabled !== false,
      secret: options.secret || null,
      headers: options.headers || {},
      retryCount: options.retryCount || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 30000,
      createdAt: Date.now(),
      lastTriggered: null,
      successCount: 0,
      failureCount: 0
    };

    this.webhooks.push(webhook);
    this._saveWebhooks();
    
    console.log(`Webhook注册成功: ${name} (${url})`);
    return webhook;
  }

  unregisterWebhook(webhookId) {
    const index = this.webhooks.findIndex(w => w.id === webhookId);
    if (index >= 0) {
      const webhook = this.webhooks.splice(index, 1)[0];
      this._saveWebhooks();
      console.log(`Webhook注销成功: ${webhook.name}`);
      return true;
    }
    return false;
  }

  updateWebhook(webhookId, updates) {
    const webhook = this.webhooks.find(w => w.id === webhookId);
    if (webhook) {
      Object.assign(webhook, updates, { updatedAt: Date.now() });
      this._saveWebhooks();
      console.log(`Webhook更新成功: ${webhook.name}`);
      return true;
    }
    return false;
  }

  getWebhooks() {
    return this.webhooks;
  }

  getWebhook(webhookId) {
    return this.webhooks.find(w => w.id === webhookId);
  }

  getWebhooksByEvent(eventType) {
    return this.webhooks.filter(w => 
      w.enabled && w.events.includes(eventType)
    );
  }

  async trigger(eventType, payload) {
    const webhooks = this.getWebhooksByEvent(eventType);
    
    if (webhooks.length === 0) {
      console.log(`没有Webhook订阅事件: ${eventType}`);
      return { triggered: 0, success: 0, failed: 0 };
    }

    const results = {
      triggered: webhooks.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (const webhook of webhooks) {
      const result = await this._sendWebhook(webhook, eventType, payload);
      results.details.push(result);
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
      }

      webhook.lastTriggered = Date.now();
      if (result.success) {
        webhook.successCount++;
      } else {
        webhook.failureCount++;
      }
    }

    this._saveWebhooks();
    this._recordEvent(eventType, payload, results);
    
    console.log(`Webhook触发完成: ${eventType}, 成功: ${results.success}, 失败: ${results.failed}`);
    return results;
  }

  async _sendWebhook(webhook, eventType, payload) {
    const result = {
      webhookId: webhook.id,
      webhookName: webhook.name,
      eventType,
      timestamp: Date.now(),
      success: false,
      statusCode: null,
      error: null,
      duration: 0
    };

    const startTime = Date.now();

    try {
      const data = JSON.stringify({
        event: eventType,
        timestamp: result.timestamp,
        data: payload
      });

      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'X-Webhook-Event': eventType,
        'X-Webhook-ID': webhook.id,
        ...webhook.headers
      };

      if (webhook.secret) {
        const crypto = require('crypto');
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(data)
          .digest('hex');
        headers['X-Webhook-Signature'] = signature;
      }

      const urlObj = new URL(webhook.url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers,
        timeout: webhook.timeout
      };

      const client = urlObj.protocol === 'https:' ? https : http;

      const response = await new Promise((resolve, reject) => {
        const req = client.request(options, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, body });
          });
        });

        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('请求超时'));
        });

        req.write(data);
        req.end();
      });

      result.duration = Date.now() - startTime;
      result.statusCode = response.statusCode;
      result.success = response.statusCode >= 200 && response.statusCode < 300;

      console.log(`Webhook发送${result.success ? '成功' : '失败'}: ${webhook.name}, 状态码: ${response.statusCode}`);
    } catch (error) {
      result.duration = Date.now() - startTime;
      result.error = error.message;
      console.error(`Webhook发送失败: ${webhook.name}, 错误: ${error.message}`);
    }

    return result;
  }

  _recordEvent(eventType, payload, results) {
    const event = {
      id: `event_${Date.now()}`,
      eventType,
      timestamp: Date.now(),
      payload,
      results: {
        triggered: results.triggered,
        success: results.success,
        failed: results.failed
      }
    };

    this.eventHistory.push(event);

    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }
  }

  getEventHistory(limit = 100) {
    return this.eventHistory.slice(-limit);
  }

  getEventHistoryByType(eventType, limit = 100) {
    return this.eventHistory
      .filter(e => e.eventType === eventType)
      .slice(-limit);
  }

  clearEventHistory() {
    this.eventHistory = [];
    console.log('Webhook事件历史已清空');
  }

  testWebhook(webhookId) {
    const webhook = this.getWebhook(webhookId);
    if (!webhook) {
      return { success: false, error: 'Webhook不存在' };
    }

    const testPayload = {
      test: true,
      message: '这是Webhook测试消息',
      timestamp: Date.now()
    };

    return this.trigger('test', testPayload);
  }

  getStatistics() {
    const stats = {
      totalWebhooks: this.webhooks.length,
      enabledWebhooks: this.webhooks.filter(w => w.enabled).length,
      disabledWebhooks: this.webhooks.filter(w => !w.enabled).length,
      totalEvents: this.eventHistory.length,
      recentEvents: this.eventHistory.slice(-10).map(e => ({
        eventType: e.eventType,
        timestamp: e.timestamp,
        success: e.results.success,
        failed: e.results.failed
      })),
      topWebhooks: this.webhooks
        .map(w => ({
          name: w.name,
          successCount: w.successCount,
          failureCount: w.failureCount,
          lastTriggered: w.lastTriggered
        }))
        .sort((a, b) => (b.successCount || 0) - (a.successCount || 0))
        .slice(0, 5)
    };

    return stats;
  }
}

const webhookManager = new WebhookManager();

function registerWebhook(name, url, events, options) {
  return webhookManager.registerWebhook(name, url, events, options);
}

function unregisterWebhook(webhookId) {
  return webhookManager.unregisterWebhook(webhookId);
}

function updateWebhook(webhookId, updates) {
  return webhookManager.updateWebhook(webhookId, updates);
}

function getWebhooks() {
  return webhookManager.getWebhooks();
}

function getWebhook(webhookId) {
  return webhookManager.getWebhook(webhookId);
}

function trigger(eventType, payload) {
  return webhookManager.trigger(eventType, payload);
}

function getWebhookEventHistory(limit) {
  return webhookManager.getEventHistory(limit);
}

function getWebhookEventHistoryByType(eventType, limit) {
  return webhookManager.getEventHistoryByType(eventType, limit);
}

function clearEventHistory() {
  return webhookManager.clearEventHistory();
}

function testWebhook(webhookId) {
  return webhookManager.testWebhook(webhookId);
}

function getStatistics() {
  return webhookManager.getStatistics();
}

module.exports = {
  WebhookManager,
  webhookManager,
  registerWebhook,
  unregisterWebhook,
  updateWebhook,
  getWebhooks,
  getWebhook,
  trigger,
  getWebhookEventHistory,
  getWebhookEventHistoryByType,
  clearEventHistory,
  testWebhook,
  getWebhookStats: getStatistics
};
