const { communityManager } = require('../src/superpowers/community_manager');

async function testCommunityManager() {
  console.log('=== 测试社区系统 ===');

  try {
    // 初始化社区系统
    console.log('1. 初始化社区系统...');
    const initResult = await communityManager.init();
    console.log(`初始化结果: ${initResult ? '成功' : '失败'}`);
    if (!initResult) {
      console.error('社区系统初始化失败，测试终止');
      return;
    }

    // 测试注册插件
    console.log('\n2. 测试注册插件...');
    const pluginResult = await communityManager.registerPlugin('test_plugin', {
      version: '1.0.0',
      description: '测试插件',
      author: 'Test Author'
    });
    console.log(`注册插件结果: ${pluginResult ? '成功' : '失败'}`);

    // 测试执行插件
    console.log('\n3. 测试执行插件...');
    const executeResult = communityManager.executePlugin('test_plugin', { test: 'data' });
    console.log(`执行插件结果:`, executeResult);

    // 测试列出插件
    console.log('\n4. 测试列出插件...');
    const plugins = communityManager.listPlugins();
    console.log(`插件列表: ${plugins.length} 个`);
    console.log('插件详情:', plugins);

    // 测试添加贡献
    console.log('\n5. 测试添加贡献...');
    const contributionId = communityManager.addContribution({
      type: 'feature',
      description: '添加社区系统功能',
      author: 'System',
      category: 'core'
    });
    console.log(`添加贡献结果: ${contributionId ? '成功' : '失败'}`);

    // 测试获取贡献
    console.log('\n6. 测试获取贡献...');
    const contributions = communityManager.getContributions(10);
    console.log(`获取到 ${contributions.length} 条贡献`);
    if (contributions.length > 0) {
      console.log('最新贡献:', contributions[0]);
    }

    // 测试创建版本
    console.log('\n7. 测试创建版本...');
    const version = communityManager.createVersion({
      version: '1.1.0',
      description: '添加社区系统',
      changes: ['添加插件系统', '添加贡献机制', '添加版本管理']
    });
    console.log(`创建版本结果: ${version ? '成功' : '失败'}`);
    if (version) {
      console.log('版本详情:', version);
    }

    // 测试获取版本历史
    console.log('\n8. 测试获取版本历史...');
    const versions = communityManager.getVersionHistory();
    console.log(`获取到 ${versions.length} 个版本`);
    if (versions.length > 0) {
      console.log('最新版本:', versions[0]);
    }

    // 测试生成文档
    console.log('\n9. 测试生成文档...');
    const docs = communityManager.generateDocumentation();
    console.log(`生成文档结果: ${docs ? '成功' : '失败'}`);

    // 测试生成Markdown文档
    console.log('\n10. 测试生成Markdown文档...');
    const markdownDocs = communityManager.generateMarkdownDocumentation();
    console.log(`生成Markdown文档结果: ${markdownDocs ? '成功' : '失败'}`);

    // 测试获取社区统计信息
    console.log('\n11. 测试获取社区统计信息...');
    const stats = communityManager.getCommunityStats();
    console.log(`获取社区统计信息结果: ${stats ? '成功' : '失败'}`);
    if (stats) {
      console.log('统计信息:', stats);
    }

    // 测试清理旧数据
    console.log('\n12. 测试清理旧数据...');
    const cleanResult = communityManager.cleanOldData(365); // 清理1年前的数据
    console.log(`清理旧数据结果: ${cleanResult ? '成功' : '失败'}`);

    console.log('\n=== 社区系统测试完成 ===');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
  }
}

// 运行测试
testCommunityManager();
