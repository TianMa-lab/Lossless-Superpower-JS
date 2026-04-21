/**
 * 技能管理系统测试
 */

const { SkillManager, skillManage } = require('../src/superpowers/skill_manager');
const fs = require('fs');
const path = require('path');

describe('SkillManager', () => {
  let skillManager;
  let testDir;

  beforeEach(() => {
    // 创建临时测试目录
    testDir = path.join(__dirname, 'test_skills');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    skillManager = new SkillManager(testDir);
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('should list skills', () => {
    const skills = skillManager.listSkills();
    expect(Array.isArray(skills)).toBe(true);
  });

  test('should create a skill', () => {
    const success = skillManager.createSkill(
      'test_skill',
      'Test skill description',
      '# Test Skill\n\nThis is a test skill',
      ['test', 'example']
    );
    expect(success).toBe(true);
  });

  test('should get a skill', () => {
    // 先创建一个技能
    skillManager.createSkill(
      'test_skill',
      'Test skill description',
      '# Test Skill\n\nThis is a test skill',
      ['test', 'example']
    );
    
    // 获取技能
    const skill = skillManager.getSkill('test_skill');
    expect(skill).toBeTruthy();
    expect(skill.name).toBe('test_skill');
  });

  test('should update a skill', () => {
    // 先创建一个技能
    skillManager.createSkill(
      'test_skill',
      'Test skill description',
      '# Test Skill\n\nThis is a test skill',
      ['test', 'example']
    );
    
    // 更新技能
    const success = skillManager.updateSkill(
      'test_skill',
      'Updated description',
      '# Test Skill\n\nUpdated content',
      ['test', 'updated']
    );
    expect(success).toBe(true);
    
    // 验证更新
    const skill = skillManager.getSkill('test_skill');
    expect(skill.description).toBe('Updated description');
  });

  test('should delete a skill', () => {
    // 先创建一个技能
    skillManager.createSkill(
      'test_skill',
      'Test skill description',
      '# Test Skill\n\nThis is a test skill',
      ['test', 'example']
    );
    
    // 删除技能
    const success = skillManager.deleteSkill('test_skill');
    expect(success).toBe(true);
    
    // 验证删除
    const skill = skillManager.getSkill('test_skill');
    expect(skill).toBeNull();
  });

  test('should search skills', () => {
    // 创建几个技能
    skillManager.createSkill(
      'javascript_skill',
      'JavaScript programming skill',
      '# JavaScript Skill\n\nJavaScript programming',
      ['javascript', 'programming']
    );
    
    skillManager.createSkill(
      'python_skill',
      'Python programming skill',
      '# Python Skill\n\nPython programming',
      ['python', 'programming']
    );
    
    // 搜索技能
    const results = skillManager.searchSkills('javascript');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('javascript_skill');
  });
});

describe('skillManage function', () => {
  test('should handle create action', () => {
    const uniqueSkillName = `test_skill_${Date.now()}`;
    const result = JSON.parse(skillManage(uniqueSkillName, 'create', {
      description: 'Test skill',
      content: '# Test Skill',
      tags: ['test']
    }));
    expect(result.success).toBe(true);
  });

  test('should handle list action', () => {
    const result = JSON.parse(skillManage('test_skill', 'list'));
    expect(result.success).toBe(true);
    expect(Array.isArray(result.skills)).toBe(true);
  });
});
