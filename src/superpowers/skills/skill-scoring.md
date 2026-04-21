
# skill-scoring 技能

| name | description |
|------|-------------|
| skill-scoring | 技能执行后记录评分，生成改进报告 |

## 触发条件
- 技能执行完成后
- 用户请求评分报告时

## 执行流程

### 1. 记录触发
`powershell
python ~/.iflow/tools/skill_scorer.py trigger <skill>
`

### 2. 记录结果
`powershell
# 成功
python ~/.iflow/tools/skill_scorer.py result <skill> success

# 失败
python ~/.iflow/tools/skill_scorer.py result <skill> failure
`

### 3. 查看报告
`powershell
python ~/.iflow/tools/skill_scorer.py report
`

## 改进建议
- 成功率 < 50%: 分析根因
- 成功率 < 30%: 重新设计技能
- 连续失败: 检查触发条件是否合理
