/**
 * 任务自动记录验证测试
 * 验证Hermes融合功能是否被正确记录到任务追踪系统
 */

const path = require('path');
const fs = require('fs');
const { TaskRunner } = require('../src/superpowers/task_runner');
const { taskTracker } = require('../src/superpowers/task_tracker');
const { permanentMemorySystem } = require('../src/superpowers/permanent_memory');
const { iterationManager } = require('../src/superpowers/iteration_manager');

// 测试目录
const testDir = path.join(__dirname, 'test_task_recording');
const memoryDir = path.join(testDir, 'memory');
const taskDataDir = path.join(testDir, 'task_data');

async function cleanup() {
  const dirs = [memoryDir, taskDataDir];
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir, { recursive: true });
  });
}

async function runRecordingTest() {
  console.log('=== 任务自动记录验证测试 ===\n');

  // 1. 清理旧数据
  console.log('1. 清理测试环境...');
  await cleanup();
  console.log('   清理完成\n');

  // 2. 初始化永久记忆系统
  console.log('2. 初始化记忆系统...');
  await permanentMemorySystem.init(memoryDir);
  console.log('   初始化完成\n');

  // 3. 定义Hermes融合任务步骤
  const hermesFusionSteps = [
    {
      name: '创建技能渐进式加载器',
      description: '实现Level 0/1/2分层加载机制',
      execute: async () => {
        console.log('   - 创建 skill_loader.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    {
      name: '创建条件激活评估器',
      description: '实现基于工具集的条件激活机制',
      execute: async () => {
        console.log('   - 创建 skill_condition_evaluator.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    {
      name: '创建任务轨迹分析器',
      description: '实现程序记忆功能',
      execute: async () => {
        console.log('   - 创建 task_analyzer.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    {
      name: '创建安全扫描器',
      description: '实现Hermes风格的安全扫描',
      execute: async () => {
        console.log('   - 创建 skill_security_scanner.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    {
      name: '创建版本检测器',
      description: '实现版本差异检测功能',
      execute: async () => {
        console.log('   - 创建 skill_version_detector.js');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  ];

  // 4. 执行带步骤的任务（使用TaskRunner）
  console.log('3. 执行Hermes融合任务...\n');
  await TaskRunner.runTaskWithSteps(
    'hermes_fusion_001',
    '融合Hermes设计理念',
    '实现渐进式加载、条件激活、任务分析、安全扫描和版本检测功能',
    hermesFusionSteps,
    {
      storeInMemory: true,
      memoryImportance: 5,
      memoryTags: 'hermes,skill-system-fusion,progressive-loading,condition-activation',
      memoryMetadata: {
        features: [
          'skill_loader (渐进式加载)',
          'skill_condition_evaluator (条件激活)',
          'task_analyzer (任务分析)',
          'skill_security_scanner (安全扫描)',
          'skill_version_detector (版本检测)'
        ],
        hermesInspired: true,
        testCase: true
      }
    }
  );

  console.log('');

  // 5. 执行一个简单的任务
  console.log('4. 执行简单验证任务...\n');
  await TaskRunner.runTask(
    'test_verification_001',
    '验证任务记录功能',
    '测试TaskRunner是否正确记录任务到追踪系统',
    async () => {
      console.log('   - 执行验证逻辑');
      return { verified: true, timestamp: Date.now() };
    },
    {
      storeInMemory: true,
      memoryImportance: 3,
      memoryTags: 'test,verification',
      memoryMetadata: { testType: 'recording-verification' }
    }
  );

  console.log('');

  // 6. 检查任务追踪记录
  console.log('6. 检查任务追踪记录...');
  const taskHistory = taskTracker.listTasks();
  console.log(`   任务历史记录数: ${taskHistory.length}`);
  taskHistory.forEach((task, index) => {
    console.log(`   ${index + 1}. ${task.name} - ${task.status}`);
  });
  console.log('');

  // 7. 检查迭代记录
  console.log('7. 检查迭代记录...');
  const iterations = iterationManager.getAllIterations();
  console.log(`   迭代记录数: ${iterations.length}`);
  if (iterations.length > 0) {
    const lastIteration = iterations[iterations.length - 1];
    console.log(`   最新迭代: ${lastIteration.title}`);
  }
  console.log('');

  // 8. 检查记忆系统记录
  console.log('8. 检查记忆系统记录...');
  const memories = await permanentMemorySystem.getMemories(1000);
  console.log(`   记忆记录数: ${memories.length}`);

  const hermesMemories = memories.filter(m =>
    m.tags && m.tags.includes('hermes')
  );
  console.log(`   Hermes相关记忆: ${hermesMemories.length}`);

  if (hermesMemories.length > 0) {
    console.log('   Hermes融合任务已正确记录到记忆系统！');
  }
  console.log('');

  // 9. 输出总结
  console.log('=== 测试结果总结 ===');
  console.log(`✓ 任务历史记录: ${taskHistory.length} 条`);
  console.log(`✓ 迭代记录: ${iterations.length} 条`);
  console.log(`✓ 记忆记录: ${memories.length} 条`);
  console.log(`✓ Hermes相关记忆: ${hermesMemories.length} 条`);

  const allRecorded =
    taskHistory.length >= 2 &&
    memories.length >= 2 &&
    hermesMemories.length >= 1;

  if (allRecorded) {
    console.log('\n✅ 任务自动记录功能验证成功！');
  } else {
    console.log('\n❌ 任务自动记录功能验证失败');
  }

  return allRecorded;
}

// 执行测试
runRecordingTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });