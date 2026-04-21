/**
 * 飞书连接状态检查脚本
 * 检查飞书登录状态和API连接
 */

const { FeishuTools } = require('./src/superpowers/feishu_tools');
const fs = require('fs');
const path = require('path');

// 从配置文件读取配置
function readConfig() {
  try {
    const configPath = path.join(__dirname, 'feishu_app_config.json');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error('读取配置文件失败:', error.message);
    return null;
  }
}

// 检查飞书连接状态
async function checkFeishuConnection() {
  console.log('=== 检查飞书连接状态 ===\n');
  
  try {
    // 读取配置
    const config = readConfig();
    if (!config) {
      return false;
    }
    
    // 尝试使用配置文件初始化飞书工具
    const feishuTools = new FeishuTools(config.feishu);
    console.log('✅ 飞书工具初始化成功');
    
    // 检查飞书SDK是否可用
    const isSdkAvailable = FeishuTools.isAvailable();
    console.log(`飞书SDK可用: ${isSdkAvailable}`);
    
    if (!isSdkAvailable) {
      console.log('❌ 飞书SDK不可用');
      return false;
    }
    
    // 检查配置
    const feishuConfig = config.feishu;
    
    console.log('配置信息:');
    console.log(`App ID: ${feishuConfig.appId ? '已设置' : '未设置'}`);
    console.log(`App Secret: ${feishuConfig.appSecret ? '已设置' : '未设置'}`);
    console.log(`Tenant Access Token: ${feishuConfig.tenantAccessToken ? '已设置' : '未设置'}`);
    
    // 检查是否有足够的配置
    if (!feishuConfig.appId || !feishuConfig.appSecret) {
      console.log('\n⚠️  缺少飞书应用配置');
      console.log('请在 feishu_app_config.json 文件中设置:');
      console.log('  feishu.appId - 飞书应用ID');
      console.log('  feishu.appSecret - 飞书应用密钥');
      return false;
    }
    
    // 检查客户端是否成功初始化
    if (feishuConfig.appId && feishuConfig.appSecret) {
      console.log('\n检查飞书客户端初始化状态...');
      try {
        const client = feishuTools.getClient();
        if (client) {
          console.log('✅ 飞书客户端初始化成功');
          console.log('✅ 飞书连接配置正常');
          return true;
        } else {
          console.log('❌ 飞书客户端初始化失败');
          return false;
        }
      } catch (error) {
        console.log(`❌ 检查客户端时出错: ${error.message}`);
        return false;
      }
    }
    
    // 如果使用tenantAccessToken，尝试调用一个简单的API
    if (feishuConfig.tenantAccessToken) {
      console.log('\n尝试使用租户访问令牌调用API...');
      try {
        // 尝试获取当前用户信息
        const response = await feishuTools.client.tenant.v2.info.get({});
        
        if (response.code === 0) {
          console.log('✅ 成功调用飞书API');
          console.log(`租户名称: ${response.data.name}`);
          console.log(`租户描述: ${response.data.description}`);
          return true;
        } else {
          console.log(`❌ 调用飞书API失败: ${response.msg}`);
          return false;
        }
      } catch (error) {
        console.log(`❌ 调用飞书API时出错: ${error.message}`);
        return false;
      }
    }
    
  } catch (error) {
    console.error('检查飞书连接时出错:', error.message);
    return false;
  }
}

// 执行检查
if (require.main === module) {
  checkFeishuConnection()
    .then(result => {
      console.log('\n=== 检查结果 ===');
      if (result) {
        console.log('✅ 飞书连接正常');
      } else {
        console.log('❌ 飞书连接异常');
      }
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('检查执行失败:', error.message);
      process.exit(1);
    });
}

module.exports = {
  checkFeishuConnection
};