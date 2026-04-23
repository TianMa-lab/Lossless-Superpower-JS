/**
 * 对话记录器测试脚本
 * 测试对话数据自动记录到DAG系统的功能
 */

const { conversationRecorder } = require('./src/superpowers/conversation_recorder');

async function testConversationRecorder() {
  console.log('开始测试对话记录器...\n');

  // 1. 初始化
  console.log('1. 初始化对话记录器...');
  const initResult = await conversationRecorder.initialize();
  console.log('初始化结果:', initResult);

  // 2. 测试对话数据
  const testConversation = {
    id: 'test_conversation_1',
    messages: [
      {
        role: 'user',
        content: '你好，我需要配置NekoBox使用海外静态住宅IP代理服务器',
        timestamp: Date.now() - 3600000
      },
      {
        role: 'assistant',
        content: '好的，我可以帮你配置NekoBox。请提供代理服务器的地址、端口、用户名和密码',
        timestamp: Date.now() - 3500000
      },
      {
        role: 'user',
        content: '服务器地址是64.105.162.121，端口7778，用户名1ifv2sdd22p26d，密码ipweb',
        timestamp: Date.now() - 3400000
      },
      {
        role: 'assistant',
        content: '收到，我会帮你配置NekoBox。首先我需要检查配置文件的位置，然后创建正确的配置格式',
        timestamp: Date.now() - 3300000
      },
      {
        role: 'assistant',
        content: '配置已完成，NekoBox现在应该可以使用海外静态住宅IP代理服务器了',
        timestamp: Date.now() - 3200000
      },
      {
        role: 'user',
        content: '谢谢，现在我需要测试代理连接是否正常',
        timestamp: Date.now() - 3100000
      },
      {
        role: 'assistant',
        content: '好的，我可以帮你测试代理连接。让我运行测试命令来验证',
        timestamp: Date.now() - 3000000
      }
    ],
    metadata: {
      channel: 'chat',
      user_id: 'test_user',
      language: 'Chinese'
    }
  };

  // 3. 记录对话
  console.log('\n2. 记录测试对话...');
  const recordResult = await conversationRecorder.recordConversation(
    testConversation.id,
    testConversation.messages,
    testConversation.metadata
  );
  console.log('记录结果:', recordResult);

  if (recordResult.success) {
    // 4. 分析对话
    console.log('\n3. 分析对话...');
    const analysisResult = await conversationRecorder.analyzeConversation(testConversation.id);
    console.log('分析结果:', analysisResult);

    // 5. 生成报告
    console.log('\n4. 生成对话报告...');
    const reportResult = await conversationRecorder.generateConversationReport(testConversation.id);
    console.log('报告结果:', JSON.stringify(reportResult.report, null, 2));

    // 6. 获取对话列表
    console.log('\n5. 获取对话列表...');
    const conversations = conversationRecorder.getConversations();
    console.log('对话列表:', conversations.length);
    conversations.forEach(conv => {
      console.log(`- ${conv.topic} (${conv.messageCount} messages)`);
    });
  }

  // 7. 清理测试数据
  console.log('\n6. 清理测试数据...');
  const cleanupResult = conversationRecorder.cleanupOldConversations(0);
  console.log('清理结果:', cleanupResult);

  console.log('\n✅ 对话记录器测试完成！');
}

testConversationRecorder().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});