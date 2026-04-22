#!/usr/bin/env node

/**
 * 测试代码审查和智能编码助手模块的集成
 */

const losslessSuperpower = require('./src');

async function testIntegration() {
  console.log('开始测试代码审查和智能编码助手模块集成...');
  
  try {
    // 初始化系统
    console.log('初始化系统...');
    const initResult = await losslessSuperpower.init();
    if (!initResult) {
      console.error('系统初始化失败');
      return;
    }
    console.log('系统初始化成功');
    
    // 测试代码审查模块
    console.log('\n测试代码审查模块...');
    await testCodeReview();
    
    // 测试智能编码助手模块
    console.log('\n测试智能编码助手模块...');
    await testCodingAssistant();
    
    console.log('\n所有测试完成！');
    
  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
  } finally {
    // 清理系统
    console.log('\n清理系统...');
    losslessSuperpower.cleanup();
  }
}

async function testCodeReview() {
  try {
    // 测试单个文件审查
    const testCode = `
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// 测试函数
function test() {
  console.log(add(1, 2));
  console.log(multiply(3, 4));
}

test();
`;
    
    console.log('测试单个文件审查...');
    const reviewResult = losslessSuperpower.reviewCode('test.js', testCode);
    console.log('代码审查结果:', JSON.stringify(reviewResult, null, 2));
    
    // 测试生成审查报告
    console.log('\n测试生成审查报告...');
    const directoryReview = losslessSuperpower.reviewDirectory('./src');
    const report = losslessSuperpower.generateCodeReviewReport(directoryReview);
    console.log('审查报告生成成功，报告长度:', report.length, '字符');
    
  } catch (error) {
    console.error('代码审查模块测试失败:', error.message);
  }
}

async function testCodingAssistant() {
  try {
    // 测试获取编码建议
    const testCode = `
function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}
`;
    
    console.log('测试获取编码建议...');
    const suggestions = losslessSuperpower.getCodingSuggestions(testCode, 'test.js');
    console.log('编码建议:', JSON.stringify(suggestions, null, 2));
    
    // 测试生成代码模板
    console.log('\n测试生成代码模板...');
    const template = losslessSuperpower.generateCodeTemplate('实现一个简单的计算器功能');
    console.log('代码模板:', template);
    
    // 测试代码质量分析
    console.log('\n测试代码质量分析...');
    const qualityAnalysis = losslessSuperpower.analyzeCodeQuality(testCode);
    console.log('代码质量分析:', JSON.stringify(qualityAnalysis, null, 2));
    
    // 测试重构建议
    console.log('\n测试重构建议...');
    const refactoringSuggestions = losslessSuperpower.getRefactoringSuggestions(testCode);
    console.log('重构建议:', JSON.stringify(refactoringSuggestions, null, 2));
    
  } catch (error) {
    console.error('智能编码助手模块测试失败:', error.message);
  }
}

// 运行测试
testIntegration();