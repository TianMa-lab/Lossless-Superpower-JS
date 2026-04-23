/**
 * 智能触发系统测试
 */

const { intelligentTrigger } = require('./src/superpowers/intelligent_trigger');
const { TaskRunner } = require('./src/superpowers/task_runner');

async function testIntelligentTrigger() {
  console.log('开始测试智能触发系统...');

  // 测试任务1：知识提取任务
  console.log('\n测试任务1：知识提取任务');
  await TaskRunner.runTask(
    'test_knowledge_extraction',
    '测试知识提取',
    '这是一个重要的知识提取任务，需要提取关键信息',
    async () => {
      return {
        success: true,
        data: '提取的知识内容',
        impact: 0.8
      };
    },
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'test,knowledge_extraction'
    }
  );

  // 测试任务2：DAG-KG对齐任务
  console.log('\n测试任务2：DAG-KG对齐任务');
  await TaskRunner.runTask(
    'test_dag_kg_alignment',
    '测试DAG-KG对齐',
    '这是一个关键的DAG-KG对齐任务，需要对齐知识图谱',
    async () => {
      return {
        success: true,
        data: '对齐结果',
        impact: 0.9
      };
    },
    {
      storeInMemory: true,
      memoryImportance: 5,
      memoryTags: 'test,dag_kg_alignment'
    }
  );

  // 测试任务3：系统优化任务
  console.log('\n测试任务3：系统优化任务');
  await TaskRunner.runTask(
    'test_system_optimization',
    '测试系统优化',
    '这是一个重要的系统优化任务，需要提高系统性能',
    async () => {
      return {
        success: true,
        data: '优化结果',
        impact: 0.7
      };
    },
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'test,system_optimization'
    }
  );

  // 测试任务4：任务管理任务
  console.log('\n测试任务4：任务管理任务');
  await TaskRunner.runTask(
    'test_task_management',
    '测试任务管理',
    '这是一个任务管理任务，需要记录和管理任务',
    async () => {
      return {
        success: true,
        data: '任务管理结果',
        impact: 0.6
      };
    },
    {
      storeInMemory: true,
      memoryImportance: 3,
      memoryTags: 'test,task_management'
    }
  );

  // 测试任务5：普通任务（不应该触发）
  console.log('\n测试任务5：普通任务（不应该触发）');
  await TaskRunner.runTask(
    'test_normal_task',
    '测试普通任务',
    '这是一个普通任务，不需要触发智能技能',
    async () => {
      return {
        success: true,
        data: '任务结果',
        impact: 0.3
      };
    },
    {
      storeInMemory: true,
      memoryImportance: 2,
      memoryTags: 'test,normal'
    }
  );

  // 获取智能触发状态
  console.log('\n获取智能触发状态：');
  const status = intelligentTrigger.getStatus();
  console.log(JSON.stringify(status, null, 2));

  console.log('\n智能触发系统测试完成！');
}

// 运行测试
testIntelligentTrigger().catch(console.error);
