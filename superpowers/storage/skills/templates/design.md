---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [design, auto_generated]
trigger_patterns:
  - "{{name}}"
  - "设计{{name}}"
  - "创建{{name}}设计"
parameters: 
  type: 
    type: string
    description: 设计类型
    required: true
  purpose: 
    type: string
    description: 设计目的
    required: true
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 设计内容

{{actions}}

## 参数

| 参数名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| type | string | 设计类型 | true |
| purpose | string | 设计目的 | true |

## 示例

{{examples}}

## 执行逻辑

1. 理解设计需求
2. 研究设计趋势和最佳实践
3. 构思设计方案
4. 创建设计原型
5. 收集反馈并修改
6. 最终确定设计方案

## 注意事项

- 考虑目标受众的需求
- 保持设计的一致性和美观性
- 注重用户体验
- 定期更新设计以适应变化的需求
