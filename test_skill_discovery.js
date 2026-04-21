/**
 * 技能发现和管理测试脚本
 * 测试智能探测和建立skill的功能
 */

const SkillDiscovery = require('./src/superpowers/skill_discovery');

async function testSkillDiscovery() {
  console.log('=== 技能发现和管理测试 ===\n');

  // 创建技能发现实例
  const skillDiscovery = new SkillDiscovery();
  
  // 初始化技能发现模块
  console.log('1. 初始化技能发现模块...');
  skillDiscovery.init();
  console.log('✅ 技能发现模块初始化成功\n');

  // 测试技能目录扫描
  console.log('2. 测试技能目录扫描...');
  const skills = skillDiscovery.scanSkills();
  console.log(`✅ 扫描完成，发现 ${skills.length} 个技能\n`);

  // 测试技能列表
  console.log('3. 测试技能列表...');
  const skillsList = skillDiscovery.getSkillsList();
  console.log('✅ 技能列表获取成功');
  console.log(`   技能数量: ${skillsList.count}`);
  console.log(`   分类数量: ${skillsList.categories.length}`);
  if (skillsList.categories.length > 0) {
    console.log(`   分类: ${skillsList.categories.join(', ')}`);
  }
  console.log('   技能列表:');
  skillsList.skills.forEach((skill, index) => {
    const category = skill.category ? `[${skill.category}] ` : '';
    console.log(`   ${index + 1}. ${category}${skill.name}: ${skill.description}`);
  });
  console.log('');

  // 测试创建技能
  console.log('4. 测试创建技能...');
  const testSkillName = 'test-skill';
  const createResult = skillDiscovery.createSkill(testSkillName, {
    description: 'Test skill for skill discovery',
    version: '1.0.0',
    platforms: ['windows', 'macos', 'linux'],
    tags: ['test', 'demo'],
    frontmatter: {
      prerequisites: {
        env_vars: ['TEST_API_KEY'],
        commands: ['node']
      }
    }
  });
  
  if (createResult.success) {
    console.log(`✅ 技能创建成功: ${testSkillName}`);
    console.log(`   路径: ${createResult.path}`);
  } else {
    console.log(`❌ 技能创建失败: ${createResult.error}`);
  }
  console.log('');

  // 重新扫描技能
  console.log('5. 重新扫描技能...');
  const skillsAfterCreate = skillDiscovery.scanSkills();
  console.log(`✅ 扫描完成，发现 ${skillsAfterCreate.length} 个技能\n`);

  // 测试技能详情
  console.log('6. 测试技能详情...');
  const skillView = skillDiscovery.getSkillView(testSkillName);
  if (skillView.success) {
    console.log(`✅ 技能详情获取成功: ${testSkillName}`);
    console.log(`   描述: ${skillView.description}`);
    console.log(`   标签: ${skillView.tags.join(', ')}`);
    console.log(`   准备状态: ${skillView.readiness_status}`);
    if (skillView.linked_files) {
      console.log('   链接文件:');
      Object.keys(skillView.linked_files).forEach(key => {
        console.log(`     ${key}: ${skillView.linked_files[key].length} 个文件`);
      });
    }
  } else {
    console.log(`❌ 技能详情获取失败: ${skillView.error}`);
  }
  console.log('');

  // 测试分类过滤
  console.log('7. 测试分类过滤...');
  const categories = skillsList.categories;
  if (categories.length > 0) {
    const firstCategory = categories[0];
    const filteredSkills = skillDiscovery.getSkillsList(firstCategory);
    console.log(`✅ 分类过滤成功，分类: ${firstCategory}`);
    console.log(`   技能数量: ${filteredSkills.count}`);
  } else {
    console.log('⚠️  没有分类可测试');
  }
  console.log('');

  console.log('=== 测试完成 ===');
  console.log('所有测试项目已执行');
}

// 执行测试
testSkillDiscovery().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});