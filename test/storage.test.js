const { storageLayer } = require('../src/storage');

async function testStorageLayer() {
  console.log('=== 测试存储层 ===');

  try {
    // 初始化存储层
    console.log('1. 初始化存储层...');
    const initResult = await storageLayer.init();
    console.log(`初始化结果: ${initResult ? '成功' : '失败'}`);
    if (!initResult) {
      console.error('存储层初始化失败，测试终止');
      return;
    }

    // 测试添加记忆
    console.log('\n2. 测试添加记忆...');
    const memory = {
      content: '测试记忆内容',
      type: 'test',
      importance: 5,
      tags: 'test,memory',
      metadata: JSON.stringify({ source: 'test' })
    };
    const addMemoryResult = await storageLayer.addMemory(memory);
    console.log(`添加记忆结果: ${addMemoryResult ? '成功' : '失败'}`);

    // 测试获取记忆
    console.log('\n3. 测试获取记忆...');
    const memories = await storageLayer.getMemories(10);
    console.log(`获取到 ${memories.length} 条记忆`);
    if (memories.length > 0) {
      console.log('最新记忆:', memories[0].content);
    }

    // 测试按类型获取记忆
    console.log('\n4. 测试按类型获取记忆...');
    const testMemories = await storageLayer.getMemoriesByType('test');
    console.log(`获取到 ${testMemories.length} 条测试类型记忆`);

    // 测试添加知识
    console.log('\n5. 测试添加知识...');
    const knowledgeId = await storageLayer.addKnowledge('测试主体', '测试谓词', '测试对象', 0.9);
    console.log(`添加知识结果: ${knowledgeId ? '成功' : '失败'}`);

    // 测试获取知识
    console.log('\n6. 测试获取知识...');
    const knowledge = await storageLayer.getKnowledge('测试主体');
    console.log(`获取到 ${knowledge.length} 条知识`);
    if (knowledge.length > 0) {
      console.log('知识内容:', knowledge[0]);
    }

    // 测试添加用户
    console.log('\n7. 测试添加用户...');
    const user = {
      name: '测试用户',
      email: 'test@example.com',
      preferences: JSON.stringify({ theme: 'dark' })
    };
    const addUserResult = await storageLayer.addUser(user);
    console.log(`添加用户结果: ${addUserResult ? '成功' : '失败'}`);

    // 测试执行自定义查询
    console.log('\n8. 测试执行自定义查询...');
    const queryResult = await storageLayer.executeQuery('SELECT count(*) as count FROM memories');
    console.log('记忆数量:', queryResult[0].count);

    // 关闭存储层
    console.log('\n9. 关闭存储层...');
    const closeResult = await storageLayer.close();
    console.log(`关闭结果: ${closeResult ? '成功' : '失败'}`);

    console.log('\n=== 存储层测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    // 尝试关闭存储层
    await storageLayer.close();
  }
}

// 运行测试
testStorageLayer();
