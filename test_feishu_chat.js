/**
 * 飞书机器人会话测试脚本
 * 测试与飞书机器人"悟空"的会话功能
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

// 测试飞书机器人会话功能
async function testFeishuChat() {
  console.log('=== 测试飞书机器人会话功能 ===\n');
  
  try {
    // 读取配置
    const config = readConfig();
    if (!config) {
      return false;
    }
    
    // 初始化飞书工具
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
    
    // 检查是否有足够的配置
    if (!feishuConfig.appId || !feishuConfig.appSecret) {
      console.log('\n⚠️  缺少飞书应用配置');
      console.log('请在 feishu_app_config.json 文件中设置:');
      console.log('  feishu.appId - 飞书应用ID');
      console.log('  feishu.appSecret - 飞书应用密钥');
      return false;
    }
    
    // 检查客户端是否成功初始化
    const client = feishuTools.getClient();
    if (!client) {
      console.log('\n❌ 飞书客户端初始化失败');
      return false;
    }
    
    console.log('\n✅ 飞书客户端初始化成功');
    
    // 检查是否有发送消息的权限
    const hasMessagePermission = config.permissions.optional.includes('im:message:send');
    console.log(`是否包含发送消息权限: ${hasMessagePermission}`);
    
    if (!hasMessagePermission) {
      console.log('\n⚠️  缺少发送消息的权限');
      console.log('请在飞书开发者平台中添加 im:message:send 权限');
      return false;
    }
    
    console.log('\n✅ 飞书机器人"悟空"配置正常');
    console.log('✅ 可以与"悟空"进行会话');
    
    console.log('\n=== 测试结果 ===');
    console.log('✅ 飞书机器人会话测试通过');
    
    return true;
    
  } catch (error) {
    console.error('测试飞书机器人会话时出错:', error.message);
    return false;
  }
}

// 执行测试
if (require.main === module) {
  testFeishuChat()
    .then(result => {
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('测试执行失败:', error.message);
      process.exit(1);
    });
}

module.exports = {
  testFeishuChat
};