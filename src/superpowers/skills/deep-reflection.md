# 深刻自省 (Deep Reflection)

## 强制规则：每个阶段必须声明+评分

**Phase 1 前声明**: I'm using the brainstorming skill
**Phase 2 前声明**: I'm using the systematic-debugging skill
**Phase 3 前声明**: I'm using the writing-plans skill
**Phase 4 前声明**: I'm using the executing-plans skill
**Phase 5 前声明**: I'm using the tdd-cycle skill
**Phase 6 前声明**: I'm using the skill-scoring skill

## 触发条件
- 用户问"你是不是需要深刻自省一下？"
- 会话开始时自动检查
- 发现异常指标时触发
- **Guardian v3.9 自动触发**: 健康检查发现问题时自动调用 auto_reflection.py

## 自省流程

### Phase 1: 问题发现 (brainstorming)
检查心跳、AGENTS.md、Guardian、DAG、技能评分、关键工具

### Phase 2: 根因分析 (systematic-debugging)
收集证据 -> 形成假设 -> 验证假设 -> 确认根因
追问"为什么"至少3层

### Phase 3: 修复计划 (writing-plans)
问题 + 根因 + 步骤 + 验证方法

### Phase 4: 执行修复 (executing-plans)
备份 -> 逐步执行 -> 记录到 DAG

### Phase 5: 验证改进 (tdd-cycle)
重跑检查 -> 确认正常 -> 记录改进

### Phase 6: 评分记录 (skill-scoring)
每个阶段后调用 skill_scorer.py trigger/result

## 关键原则
1. 不看表面看实际
2. 找到根因再修复
3. 修复后必须验证
4. 记录改进到系统
5. 每个阶段必须评分
