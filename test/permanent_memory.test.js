const { permanentMemorySystem } = require('../src/superpowers/permanent_memory');

async function testPermanentMemory() {
  console.log('=== 测试永久记忆系统 ===');

  try {
    // 初始化永久记忆系统
    console.log('1. 初始化永久记忆系统...');
    const initResult = await permanentMemorySystem.init();
    console.log(`初始化结果: ${initResult ? '成功' : '失败'}`);
    if (!initResult) {
      console.error('永久记忆系统初始化失败，测试终止');
      return;
    }

    // 测试添加记忆
    console.log('\n2. 测试添加记忆...');
    const memoryId1 = await permanentMemorySystem.addMemory('测试记忆1', 'test', 3, 'test,memory', { source: 'test' });
    console.log(`添加记忆1结果: ${memoryId1 ? '成功' : '失败'}`);
    
    const memoryId2 = await permanentMemorySystem.addMemory('测试记忆2', 'test', 5, 'test,memory', { source: 'test' });
    console.log(`添加记忆2结果: ${memoryId2 ? '成功' : '失败'}`);

    // 测试获取记忆
    console.log('\n3. 测试获取记忆...');
    const memories = await permanentMemorySystem.getMemories(10);
    console.log(`获取到 ${memories.length} 条记忆`);
    if (memories.length > 0) {
      console.log('最新记忆:', memories[0].content);
    }

    // 测试按类型获取记忆
    console.log('\n4. 测试按类型获取记忆...');
    const testMemories = await permanentMemorySystem.getMemoriesByType('test');
    console.log(`获取到 ${testMemories.length} 条测试类型记忆`);

    // 测试按标签获取记忆
    console.log('\n5. 测试按标签获取记忆...');
    const tagMemories = await permanentMemorySystem.getMemoriesByTag('test');
    console.log(`获取到 ${tagMemories.length} 条包含test标签的记忆`);

    // 测试搜索记忆
    console.log('\n6. 测试搜索记忆...');
    const searchResults = await permanentMemorySystem.searchMemories('测试');
    console.log(`搜索结果: ${searchResults.length} 条`);
    if (searchResults.length > 0) {
      console.log('搜索结果内容:', searchResults[0].content);
    }

    // 测试记忆整理
    console.log('\n7. 测试记忆整理...');
    const organizeResult = await permanentMemorySystem.organizeMemories();
    console.log(`记忆整理结果: ${organizeResult ? '成功' : '失败'}`);

    // 测试获取记忆统计信息
    console.log('\n8. 测试获取记忆统计信息...');
    const stats = await permanentMemorySystem.getMemoryStats();
    console.log('记忆统计信息:', stats);

    // 测试备份记忆
    console.log('\n9. 测试备份记忆...');
    const backupResult = await permanentMemorySystem.backupMemories();
    console.log(`备份记忆结果: ${backupResult ? '成功' : '失败'}`);

    // 测试压缩记忆
    console.log('\n10. 测试压缩记忆...');
    const compressResult = await permanentMemorySystem.compressMemories();
    console.log(`压缩记忆结果: ${compressResult ? '成功' : '失败'}`);

    console.log('\n=== 永久记忆系统测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
  }
}

// 运行测试
testPermanentMemory();
