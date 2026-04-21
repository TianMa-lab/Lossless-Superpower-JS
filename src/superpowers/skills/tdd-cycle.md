# tdd-cycle 技能

| name | description |
|------|-------------|
| tdd-cycle | 实现功能时强制 TDD 流程 |

## 触发条件
- 编写新功能代码
- 修复 Bug
- 重构代码

## RED-GREEN-REFACTOR 循环

### RED 阶段
```
1. 写失败测试
2. 运行测试
3. 确认测试失败（预期失败原因正确）
```

### GREEN 阶段
```
1. 写最小实现代码
2. 运行测试
3. 确认测试通过
```

### REFACTOR 阶段
```
1. 优化代码结构
2. 运行测试
3. 确认测试仍通过
4. 提交代码
```

## 强制规则
- ❌ 不允许先写实现再写测试
- ❌ 不允许跳过 RED 阶段
- ❌ 不允许测试未通过就提交

## 验证命令模板
```powershell
# Python
pytest tests/test_xxx.py -v

# JavaScript
npm test -- --testNamePattern="xxx"

# PowerShell
Invoke-Pester -Path tests/
```
