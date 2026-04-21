/**
 * 飞书功能测试脚本
 * 测试飞书文档和评论操作功能
 */

const { FeishuTools } = require('./src/superpowers/feishu_tools');
const { FeishuSkill } = require('./src/superpowers/feishu_skill');

// 测试配置
const testConfig = {
  // 这里填写飞书应用配置
  // appId: 'your_app_id',
  // appSecret: 'your_app_secret',
  // 或者使用tenantAccessToken
  // tenantAccessToken: 'your_tenant_access_token'
};

// 测试文档token（需要替换为实际的文档token）
const testDocToken = '';
const testFileToken = '';

// 测试飞书工具
async function testFeishuTools() {
  console.log('=== 测试飞书工具 ===\n');
  
  try {
    // 创建飞书工具实例
    const feishuTools = new FeishuTools(testConfig);
    console.log('✅ 飞书工具初始化成功');
    
    // 检查飞书SDK是否可用
    const isAvailable = FeishuTools.isAvailable();
    console.log(`飞书SDK可用: ${isAvailable}`);
    
    if (!isAvailable) {
      console.log('⚠️  飞书SDK不可用，跳过测试');
      return false;
    }
    
    // 测试读取文档
    if (testDocToken) {
      console.log('\n测试读取文档...');
      const content = await feishuTools.readDocument(testDocToken);
      console.log('✅ 读取文档成功');
      console.log('文档内容预览:', content.substring(0, 100) + '...');
    } else {
      console.log('\n⚠️  未设置testDocToken，跳过文档读取测试');
    }
    
    // 测试列出评论
    if (testFileToken) {
      console.log('\n测试列出评论...');
      const comments = await feishuTools.listComments(testFileToken);
      console.log('✅ 列出评论成功');
      console.log('评论数量:', comments.items?.length || 0);
    } else {
      console.log('\n⚠️  未设置testFileToken，跳过评论测试');
    }
    
    return true;
  } catch (error) {
    console.error('测试飞书工具失败:', error.message);
    return false;
  }
}

// 测试飞书技能
async function testFeishuSkill() {
  console.log('\n=== 测试飞书技能 ===\n');
  
  try {
    // 创建飞书技能实例
    const feishuSkill = new FeishuSkill();
    console.log('✅ 飞书技能初始化成功');
    
    // 初始化技能
    const initResult = feishuSkill.init(testConfig);
    console.log(`技能初始化: ${initResult ? '成功' : '失败'}`);
    
    // 获取技能信息
    const skillInfo = feishuSkill.getSkillInfo();
    console.log('技能信息:', skillInfo);
    
    // 获取技能操作
    const operations = feishuSkill.getOperations();
    console.log('技能操作数量:', operations.length);
    console.log('技能操作:', operations.map(op => op.name));
    
    // 检查技能是否可用
    const isAvailable = feishuSkill.isAvailable();
    console.log(`技能可用: ${isAvailable}`);
    
    return true;
  } catch (error) {
    console.error('测试飞书技能失败:', error.message);
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('=== 飞书功能测试 ===\n');
  
  const toolsResult = await testFeishuTools();
  const skillResult = await testFeishuSkill();
  
  console.log('\n=== 测试结果 ===');
  console.log(`飞书工具测试: ${toolsResult ? '✅ 通过' : '❌ 失败'}`);
  console.log(`飞书技能测试: ${skillResult ? '✅ 通过' : '❌ 失败'}`);
  
  if (toolsResult && skillResult) {
    console.log('\n✅ 所有测试通过');
    return true;
  } else {
    console.log('\n❌ 部分测试失败');
    return false;
  }
}

// 执行测试
if (require.main === module) {
  runTests()
    .then(result => {
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('测试执行失败:', error.message);
      process.exit(1);
    });
}

module.exports = {
  testFeishuTools,
  testFeishuSkill,
  runTests
};