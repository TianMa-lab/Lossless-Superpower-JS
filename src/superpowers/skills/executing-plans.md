# executing-plans 技能

| name | description |
|------|-------------|
| executing-plans | 有实现计划后激活，逐任务执行并审查 |

## 触发条件
- 实现计划已创建
- 用户说"开始"、"执行计划"等

## 执行流程

### 1. 声明
```
"I'm using the executing-plans skill to implement the plan."
```

### 2. 逐任务执行
```
For each task:
  1. 标记任务为 in_progress
  2. 执行任务
  3. 运行验证命令
  4. 双重审查：
     - 规格审查：是否符合计划？
     - 代码审查：质量是否达标？
  5. 标记任务为 completed
  6. 提交（如通过）
```

### 3. 审查标准
| 级别 | 描述 | 处理 |
|------|------|------|
| Critical | 阻塞问题 | 立即修复 |
| Major | 功能缺陷 | 修复后继续 |
| Minor | 风格问题 | 记录，稍后处理 |

### 4. 进度报告
每完成一个任务，报告：
```
✅ Task N: [描述]
   - 文件: [路径]
   - 验证: [结果]
   - 审查: [通过/问题]
```

## 子代理派发

派发时机: 任务需要独立审查 或 可并行执行

派发命令:
task(subagent_type=""general-purpose"", prompt=""审查代码..."")

结果处理: 收集报告 -> 汇总问题 -> 统一决策
