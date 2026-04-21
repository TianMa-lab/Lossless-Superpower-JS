---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [learning, auto_generated]
trigger_patterns:
  - "{{name}}"
  - "学习{{name}}"
  - "了解{{name}}"
parameters: 
  topic: 
    type: string
    description: 学习主题
    required: true
  level: 
    type: string
    description: 学习级别 (beginner, intermediate, advanced)
    required: true
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 学习内容

{{actions}}

## 参数

| 参数名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| topic | string | 学习主题 | true |
| level | string | 学习级别 | true |

## 示例

{{examples}}

## 执行逻辑

1. 确定学习目标和范围
2. 收集相关学习资料
3. 制定学习计划
4. 实施学习活动
5. 评估学习效果
6. 调整学习策略

## 注意事项

- 根据学习者的水平调整内容难度
- 提供多样化的学习资源
- 鼓励实践和应用
- 定期复习和巩固知识
