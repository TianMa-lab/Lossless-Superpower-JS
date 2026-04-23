/**
 * AutoMemoryIntelligence 测试脚本
 * 测试"自动记忆，智能提取"功能
 */

const { autoMemoryIntelligence } = require('./src/superpowers/auto_memory_intelligence');

async function testAutoMemoryIntelligence() {
  console.log('开始测试自动记忆智能提取系统...\n');

  // 1. 初始化
  console.log('1. 初始化系统...');
  const initResult = await autoMemoryIntelligence.initialize();
  console.log('初始化结果:', initResult);

  // 2. 测试对话自动记忆
  console.log('\n2. 测试对话自动记忆...');
  const testConversation = {
    id: 'test_conversation_auto_1',
    messages: [
      {
        role: 'user',
        content: '你好，我需要了解如何使用DAG系统进行任务管理',
        timestamp: Date.now() - 3600000
      },
      {
        role: 'assistant',
        content: 'DAG系统是一个基于有向无环图的任务管理系统，它可以帮助你跟踪任务的依赖关系和执行状态',
        timestamp: Date.now() - 3500000
      },
      {
        role: 'user',
        content: '那如何添加任务到DAG系统中呢？',
        timestamp: Date.now() - 3400000
      },
      {
        role: 'assistant',
        content: '你可以使用TaskRecorder模块的recordTask方法来添加任务，它会自动处理任务的依赖关系和状态管理',
        timestamp: Date.now() - 3300000
      }
    ],
    metadata: {
      topic: 'DAG系统使用指南',
      source: 'chat',
      user_id: 'test_user'
    }
  };

  const autoMemoryResult = await autoMemoryIntelligence.autoRecordConversation(
    testConversation.id,
    testConversation.messages,
    testConversation.metadata
  );
  console.log('对话自动记忆结果:', autoMemoryResult);

  if (autoMemoryResult.success) {
    // 3. 测试智能提取
    console.log('\n3. 测试智能提取...');
    const extractResult = await autoMemoryIntelligence.intelligentExtract(
      testConversation.messages.map(msg => msg.content).join('\n'),
      {
        topic: 'DAG系统分析',
        source: 'test'
      }
    );
    console.log('智能提取结果:', extractResult);

    // 4. 测试记忆搜索
    console.log('\n4. 测试记忆搜索...');
    const searchResult = await autoMemoryIntelligence.searchMemories('DAG');
    console.log('记忆搜索结果:', searchResult);

    // 5. 测试记忆洞察
    console.log('\n5. 测试记忆洞察...');
    const insightsResult = await autoMemoryIntelligence.generateMemoryInsights({
      days: 7
    });
    console.log('记忆洞察结果:', insightsResult);

    // 6. 测试系统状态
    console.log('\n6. 测试系统状态...');
    const status = autoMemoryIntelligence.getSystemStatus();
    console.log('系统状态:', {
      initialized: status.initialized,
      modules: Object.keys(status.modules)
    });
  }

  console.log('\n✅ 自动记忆智能提取系统测试完成！');
}

testAutoMemoryIntelligence().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});