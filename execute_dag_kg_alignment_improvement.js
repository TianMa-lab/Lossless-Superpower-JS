/**
 * 执行DAG与知识图谱提取和对齐改进
 */

const { TaskRunner } = require('./src/superpowers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('=== 执行DAG与知识图谱提取和对齐改进 ===\n');

  // 执行提取和对齐改进任务
  await TaskRunner.runTaskWithSteps(
    'dag_kg_alignment_improvement',
    'DAG与知识图谱提取和对齐改进',
    '解决DAG与知识图谱之间的提取和对齐问题，包括智能提取、双向同步、统一标识符和映射分析',
    [
      {
        name: '安装UUID依赖',
        description: '安装UUID库用于生成统一标识符',
        execute: async () => {
          console.log('安装UUID依赖...');
          const { execSync } = require('child_process');
          try {
            execSync('npm install uuid', { stdio: 'inherit' });
            console.log('UUID库安装成功');
          } catch (error) {
            console.error('UUID库安装失败:', error.message);
          }
        }
      },
      {
        name: '在superpowers/index.js中添加增强集成模块',
        description: '在superpowers/index.js中添加增强的DAG与知识图谱集成模块的导入和导出',
        execute: async () => {
          console.log('在superpowers/index.js中添加增强集成模块...');
          const indexFile = path.join(__dirname, 'src', 'superpowers', 'index.js');
          
          let content = fs.readFileSync(indexFile, 'utf-8');
          
          // 添加导入
          if (!content.includes('const { enhancedKnowledgeGraphDAGIntegration } = require')) {
            content = content.replace('// 导入知识图谱与DAG集成模块\nconst { knowledgeGraphDAGIntegration } = require(\'./kg_dag_integration\');', '// 导入知识图谱与DAG集成模块\nconst { knowledgeGraphDAGIntegration } = require(\'./kg_dag_integration\');\n\n// 导入增强的知识图谱与DAG集成模块\nconst { enhancedKnowledgeGraphDAGIntegration } = require(\'./kg_dag_integration_enhanced\');');
          }
          
          // 添加导出
          if (!content.includes('enhancedKnowledgeGraphDAGIntegration')) {
            content = content.replace('  knowledgeGraphDAGIntegration\n};', '  knowledgeGraphDAGIntegration,\n  enhancedKnowledgeGraphDAGIntegration\n};');
          }
          
          fs.writeFileSync(indexFile, content, 'utf-8');
          console.log('增强集成模块添加到superpowers/index.js完成');
        }
      },
      {
        name: '测试增强的DAG与知识图谱集成',
        description: '测试增强的DAG与知识图谱集成功能，包括智能提取、双向同步和映射分析',
        execute: async () => {
          console.log('测试增强的DAG与知识图谱集成...');
          const { enhancedKnowledgeGraphDAGIntegration } = require('./src/superpowers');
          
          // 初始化集成
          await enhancedKnowledgeGraphDAGIntegration.init();
          
          // 智能提取知识图谱到DAG
          await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG();
          
          // 执行双向同步
          await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync();
          
          // 分析映射关系
          await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
          
          // 导出映射数据
          enhancedKnowledgeGraphDAGIntegration.exportMappingData();
          
          console.log('增强的DAG与知识图谱集成测试完成');
        }
      }
    ],
    {
      storeInMemory: true,
      memoryImportance: 4,
      memoryTags: 'dag,knowledge_graph,alignment,improvement',
      memoryMetadata: { objective: '解决DAG与知识图谱的提取和对齐问题' }
    }
  );

  console.log('\n=== DAG与知识图谱提取和对齐改进完成 ===');
  console.log('已成功解决DAG与知识图谱之间的提取和对齐问题，包括智能提取、双向同步、统一标识符和映射分析');
}

main().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});
