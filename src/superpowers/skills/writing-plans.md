# writing-plans 技能

| name | description |
|------|-------------|
| writing-plans | 有设计文档后激活，拆分为 2-5 分钟原子任务 |

## 触发条件
- 设计文档已批准
- 用户说"开始实现"、"写计划"等

## 执行流程

### 1. 声明
```
"I'm using the writing-plans skill to create implementation plan."
```

### 2. 拆分原子任务
每个任务必须是 2-5 分钟可完成的单一动作：

```
❌ "实现用户登录" （太大）
✅ "Write failing test for login validation"
✅ "Run test, confirm it fails"
✅ "Implement minimal login code"
✅ "Run test, confirm it passes"
✅ "Commit changes"
```

### 3. 保存计划
```
docs/plans/YYYY-MM-DD-<feature-name>.md
```

## 计划模板
```markdown
# [Feature Name] 实现计划
**Goal:** [一句话]
**Architecture:** [2-3 句]

## 任务列表
- [ ] Task 1: [动作] | 文件: `path` | 验证: [方法]
- [ ] Task 2: [动作] | 文件: `path` | 验证: [方法]

## 验证命令
```bash
[测试命令]
```
```

## 零上下文假设
计划必须包含：
- 精确文件路径
- 完整代码片段
- 验证命令
- 预期结果

## 持久化规则

### 保存位置
~/.iflow/plans/YYYY-MM-DD-<feature-name>.md

### 状态追踪
~/.iflow/plans/status.json

### 执行命令
# 创建新计划
Copy-Item ~/.iflow/plans/template.md ~/.iflow/plans/YYYY-MM-DD-<name>.md

# 更新状态
$status = Get-Content ~/.iflow/plans/status.json | ConvertFrom-Json
$status.status = "in_progress"
$status | ConvertTo-Json | Out-File ~/.iflow/plans/status.json
