/**
 * 技能发现和管理综合测试脚本
 * 全面测试智能探测和建立skill的功能
 */

const SkillDiscovery = require('./src/superpowers/skill_discovery');
const fs = require('fs');
const path = require('path');

async function testSkillDiscoveryComprehensive() {
  console.log('=== 技能发现和管理综合测试 ===\n');

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

  // 测试技能文件结构
  console.log('5. 测试技能文件结构...');
  const skillDir = path.join(process.cwd(), 'skills', testSkillName);
  if (fs.existsSync(skillDir)) {
    console.log(`✅ 技能目录存在: ${skillDir}`);
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      console.log('✅ SKILL.md文件存在');
      const content = fs.readFileSync(skillMdPath, 'utf8');
      console.log('✅ SKILL.md文件内容:');
      console.log(content);
    } else {
      console.log('❌ SKILL.md文件不存在');
    }
    
    // 检查支持目录
    const dirs = ['references', 'templates', 'assets', 'scripts'];
    dirs.forEach(dir => {
      const dirPath = path.join(skillDir, dir);
      if (fs.existsSync(dirPath)) {
        console.log(`✅ ${dir}目录存在`);
      } else {
        console.log(`❌ ${dir}目录不存在`);
      }
    });
  } else {
    console.log(`❌ 技能目录不存在: ${skillDir}`);
  }
  console.log('');

  // 重新扫描技能
  console.log('6. 重新扫描技能...');
  const skillsAfterCreate = skillDiscovery.scanSkills();
  console.log(`✅ 扫描完成，发现 ${skillsAfterCreate.length} 个技能\n`);

  // 测试技能详情
  console.log('7. 测试技能详情...');
  const skillView = skillDiscovery.getSkillView(testSkillName);
  if (skillView.success) {
    console.log(`✅ 技能详情获取成功: ${testSkillName}`);
    console.log(`   描述: ${skillView.description}`);
    console.log(`   标签: ${skillView.tags.join(', ')}`);
    console.log(`   准备状态: ${skillView.readiness_status}`);
    if (skillView.security_warnings && skillView.security_warnings.length > 0) {
      console.log('   安全警告:');
      skillView.security_warnings.forEach(warning => {
        console.log(`     - ${warning}`);
      });
    } else {
      console.log('   安全警告: 无');
    }
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

  // 测试技能文件查看
  console.log('8. 测试技能文件查看...');
  const skillMdView = skillDiscovery.getSkillView(testSkillName, 'SKILL.md');
  if (skillMdView.success) {
    console.log(`✅ 技能文件查看成功: ${testSkillName}/SKILL.md`);
    console.log(`   文件类型: ${skillMdView.file_type}`);
    console.log(`   内容长度: ${skillMdView.content.length} 字符`);
  } else {
    console.log(`❌ 技能文件查看失败: ${skillMdView.error}`);
  }
  console.log('');

  // 测试路径遍历防护
  console.log('9. 测试路径遍历防护...');
  const traversalTest = skillDiscovery.getSkillView(testSkillName, '../package.json');
  if (!traversalTest.success && traversalTest.error.includes('Path traversal')) {
    console.log('✅ 路径遍历防护成功');
    console.log(`   错误信息: ${traversalTest.error}`);
  } else {
    console.log('❌ 路径遍历防护失败');
  }
  console.log('');

  // 测试平台兼容性
  console.log('10. 测试平台兼容性...');
  // 创建一个仅支持Windows的技能
  const windowsSkillName = 'windows-only-skill';
  const windowsSkillResult = skillDiscovery.createSkill(windowsSkillName, {
    description: 'Windows only skill',
    platforms: ['windows']
  });
  
  if (windowsSkillResult.success) {
    console.log(`✅ Windows专属技能创建成功: ${windowsSkillName}`);
    // 扫描技能
    const skillsWithWindows = skillDiscovery.scanSkills();
    const windowsSkill = skillsWithWindows.find(s => s.name === windowsSkillName);
    if (windowsSkill) {
      console.log(`✅ Windows专属技能被正确扫描`);
    } else {
      console.log(`❌ Windows专属技能未被扫描`);
    }
  } else {
    console.log(`❌ Windows专属技能创建失败: ${windowsSkillResult.error}`);
  }
  console.log('');

  // 测试环境变量检查
  console.log('11. 测试环境变量检查...');
  // 创建一个需要环境变量的技能
  const envSkillName = 'env-required-skill';
  const envSkillResult = skillDiscovery.createSkill(envSkillName, {
    description: 'Skill with environment variable requirement',
    frontmatter: {
      prerequisites: {
        env_vars: ['TEST_API_KEY']
      }
    }
  });
  
  if (envSkillResult.success) {
    console.log(`✅ 环境变量依赖技能创建成功: ${envSkillName}`);
    // 获取技能详情
    const envSkillView = skillDiscovery.getSkillView(envSkillName);
    if (envSkillView.success && envSkillView.readiness_status === 'setup_needed') {
      console.log(`✅ 环境变量依赖检查成功，状态: ${envSkillView.readiness_status}`);
    } else {
      console.log(`❌ 环境变量依赖检查失败`);
    }
  } else {
    console.log(`❌ 环境变量依赖技能创建失败: ${envSkillResult.error}`);
  }
  console.log('');

  // 测试清理
  console.log('12. 测试清理...');
  const testSkills = [testSkillName, windowsSkillName, envSkillName];
  testSkills.forEach(skillName => {
    const skillDir = path.join(process.cwd(), 'skills', skillName);
    if (fs.existsSync(skillDir)) {
      // 删除技能目录
      function deleteDir(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            deleteDir(fullPath);
          } else {
            fs.unlinkSync(fullPath);
          }
        }
        fs.rmdirSync(dir);
      }
      
      try {
        deleteDir(skillDir);
        console.log(`✅ 技能清理成功: ${skillName}`);
      } catch (error) {
        console.log(`❌ 技能清理失败: ${skillName} - ${error.message}`);
      }
    } else {
      console.log(`⚠️  技能目录不存在: ${skillName}`);
    }
  });
  console.log('');

  console.log('=== 综合测试完成 ===');
  console.log('所有测试项目已执行');
}

// 执行测试
testSkillDiscoveryComprehensive().catch(error => {
  console.error('测试执行失败:', error);
  process.exit(1);
});