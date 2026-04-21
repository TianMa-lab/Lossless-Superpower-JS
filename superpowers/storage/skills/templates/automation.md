---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [automation, auto_generated]
trigger_patterns:
  - "{{name}}"
  - "自动化{{name}}"
  - "自动执行{{name}}"
parameters: 
  task: 
    type: string
    description: 自动化任务
    required: true
  schedule: 
    type: string
    description: 执行计划
    required: false
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 自动化内容

{{actions}}

## 参数

| 参数名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| task | string | 自动化任务 | true |
| schedule | string | 执行计划 | false |

## 示例

{{examples}}

## 执行逻辑

1. 定义自动化任务和目标
2. 设计自动化工作流
3. 配置执行环境和参数
4. 测试自动化流程
5. 部署和监控自动化任务
6. 优化自动化性能

## 注意事项

- 确保自动化任务的可靠性和稳定性
- 考虑错误处理和异常情况
- 定期维护和更新自动化流程
- 监控自动化任务的执行效果
