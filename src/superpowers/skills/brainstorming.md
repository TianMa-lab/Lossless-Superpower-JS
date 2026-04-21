# brainstorming 技能

| name | description |
|------|-------------|
| brainstorming | 在写代码前激活，通过对话澄清需求，生成设计文档 |

## 触发条件
- 用户请求实现新功能
- 用户说"帮我设计"、"我想做"等
- 需求不明确时

## 执行流程

### 1. 声明
```
I'm using the brainstorming skill to clarify requirements and design.
```

### 2. 苏格拉底式提问
依次询问：
1. 你想解决什么问题？
2. 谁是用户？
3. 成功的标准是什么？
4. 有什么约束？
5. 有什么替代方案？

### 3. 分块展示设计
每块不超过 10 行，等待用户确认后继续

### 4. 保存设计文档
```
docs/designs/YYYY-MM-DD-<feature-name>.md
```

## 输出格式
```markdown
# [功能名] 设计文档

## 问题陈述
[一句话描述问题]

## 用户故事
As a [角色], I want to [动作], so that [价值]

## 解决方案
[核心设计]

## 技术方案
[技术选型]

## 风险与约束
[列出风险]
```
