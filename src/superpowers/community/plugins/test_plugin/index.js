
// test_plugin 插件
module.exports = {
  name: 'test_plugin',
  version: '1.0.0',
  description: '测试插件',
  author: 'Test Author',
  
  // 插件初始化
  init: function() {
    console.log('test_plugin 插件初始化');
  },
  
  // 插件执行
  execute: function(data) {
    console.log('test_plugin 插件执行:', data);
    return { success: true, data: data };
  }
};
