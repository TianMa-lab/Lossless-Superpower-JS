---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [auto_generated]
trigger_patterns:
  - "{{name}}"
  - "使用{{name}}技能"
  - "执行{{name}}"
parameters: {{parameters}}
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 动作序列

{{actions}}

## 参数

{{parameters}}

## 示例

{{examples}}

## 执行逻辑

This skill was automatically generated from user interaction history.

## 注意事项

- 此技能为自动生成，可能需要手动调整
- 请根据实际需求修改参数和执行逻辑
- 定期检查技能的执行效果并进行优化
