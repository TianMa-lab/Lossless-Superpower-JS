const { securityManager } = require('../src/superpowers/security_manager');

async function testSecurityManager() {
  console.log('=== 测试安全性增强系统 ===\n');

  // 1. 初始化安全性增强系统
  console.log('1. 初始化安全性增强系统...');
  const initResult = await securityManager.init();
  console.log(`初始化结果: ${initResult ? '成功' : '失败'}\n`);

  // 2. 测试加密和解密数据
  console.log('2. 测试加密和解密数据...');
  const testData = { id: 1, name: '测试数据', value: 123 };
  const encryptedData = securityManager.encryptData(testData);
  console.log('加密数据:', encryptedData);
  const decryptedData = securityManager.decryptData(encryptedData);
  console.log('解密数据:', decryptedData);
  console.log(`加密和解密测试结果: ${JSON.stringify(testData) === JSON.stringify(decryptedData) ? '成功' : '失败'}\n`);

  // 3. 测试生成和验证哈希
  console.log('3. 测试生成和验证哈希...');
  const hash = securityManager.generateHash(testData);
  console.log('生成的哈希:', hash);
  const verifyResult = securityManager.verifyDataIntegrity(testData, hash);
  console.log(`哈希验证结果: ${verifyResult ? '成功' : '失败'}\n`);

  // 4. 测试记录和获取安全审计日志
  console.log('4. 测试记录和获取安全审计日志...');
  const eventId = securityManager.logSecurityEvent({
    type: 'test_event',
    severity: 'info',
    description: '测试安全事件',
    details: { test: 'data' }
  });
  console.log('记录的事件ID:', eventId);
  const logs = securityManager.getSecurityAuditLogs(1);
  console.log(`获取到 ${logs.length} 条审计日志`);
  console.log('安全审计日志测试结果: 成功\n');

  // 5. 测试执行安全扫描
  console.log('5. 测试执行安全扫描...');
  const scanResult = securityManager.runSecurityScan();
  console.log('安全扫描结果:', scanResult);
  console.log(`安全扫描测试结果: ${scanResult ? '成功' : '失败'}\n`);

  // 6. 测试生成安全报告
  console.log('6. 测试生成安全报告...');
  const report = securityManager.generateSecurityReport();
  console.log('安全报告摘要:', report ? report.summary : '失败');
  console.log(`安全报告生成结果: ${report ? '成功' : '失败'}\n`);

  // 7. 测试实施安全措施
  console.log('7. 测试实施安全措施...');
  const measures = securityManager.implementSecurityMeasures();
  console.log('实施的安全措施:', measures);
  console.log(`安全措施实施结果: ${measures.length > 0 ? '成功' : '失败'}\n`);

  // 8. 测试验证安全状态
  console.log('8. 测试验证安全状态...');
  const status = securityManager.validateSecurityStatus();
  console.log('安全状态:', status ? status.overallStatus : '失败');
  console.log(`安全状态验证结果: ${status ? '成功' : '失败'}\n`);

  console.log('=== 安全性增强系统测试完成 ===');
}

// 运行测试
testSecurityManager().catch(error => {
  console.error('测试失败:', error);
}).finally(() => {
  process.exit(0);
});
