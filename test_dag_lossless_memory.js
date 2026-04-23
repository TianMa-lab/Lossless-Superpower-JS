/**
 * DAG Lossless Memory 测试脚本
 * 测试多层提取功能
 */

const { dagLosslessMemory } = require('./src/superpowers/dag_lossless_memory');

async function testDAGLosslessMemory() {
  console.log('开始测试DAG Lossless Memory系统...\n');

  // 1. 初始化
  console.log('1. 初始化DAG Lossless Memory...');
  const initResult = await dagLosslessMemory.initialize();
  console.log('初始化结果:', initResult);

  // 2. 测试数据
  const testData = `
    你好，我需要配置NekoBox使用海外静态住宅IP代理服务器。
    服务器地址是64.105.162.121，端口7778，用户名1ifv2sdd22p26d，密码ipweb。
    我希望能够通过这个代理访问谷歌地图和其他国际网站。
    配置完成后，我需要测试代理连接是否正常。
    另外，我还需要了解如何在浏览器中设置代理服务器。
  `;

  const testContext = {
    topic: 'NekoBox代理配置',
    source: 'conversation',
    confidence: 0.9,
    relevance: 0.8
  };

  // 3. 处理数据
  console.log('\n2. 处理测试数据...');
  const processResult = await dagLosslessMemory.processData(testData, testContext);
  console.log('处理结果:', processResult);

  if (processResult.success) {
    const memoryId = processResult.memoryId;

    // 4. 检索记忆
    console.log('\n3. 检索记忆...');
    const retrievedMemory = await dagLosslessMemory.retrieveMemory(memoryId);
    console.log('记忆检索成功:', retrievedMemory !== null);

    // 5. 搜索记忆
    console.log('\n4. 搜索记忆...');
    const searchResult = await dagLosslessMemory.searchMemory('代理');
    console.log('搜索结果数量:', searchResult.length);

    // 6. 生成记忆报告
    console.log('\n5. 生成记忆报告...');
    const reportResult = await dagLosslessMemory.generateMemoryReport(memoryId);
    if (reportResult.success) {
      console.log('报告生成成功:', JSON.stringify(reportResult.report, null, 2));
    }

    // 7. 查看各层数据
    console.log('\n6. 查看各层数据...');
    if (retrievedMemory && retrievedMemory.layers) {
      for (const [layer, data] of Object.entries(retrievedMemory.layers)) {
        console.log(`\n${layer}层:`);
        console.log('描述:', data.description);
        console.log('处理时间:', new Date(data.processedAt).toISOString());
        if (layer === 'structured') {
          console.log('实体数量:', data.data.entities.length);
          console.log('关键词数量:', data.data.keywords.length);
          console.log('实体:', data.data.entities.slice(0, 3));
        }
        if (layer === 'semantic') {
          console.log('主题:', data.data.topics);
          console.log('情感:', data.data.sentiments);
          console.log('意图:', data.data.intentions.slice(0, 2));
        }
        if (layer === 'insight') {
          console.log('建议:', data.data.recommendations.slice(0, 2));
        }
      }
    }
  }

  // 8. 清理缓存
  console.log('\n7. 清理缓存...');
  const cleanupResult = dagLosslessMemory.cleanupCache();
  console.log('清理结果:', cleanupResult);

  console.log('\n✅ DAG Lossless Memory测试完成！');
}

testDAGLosslessMemory().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});