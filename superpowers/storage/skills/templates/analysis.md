---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [analysis, auto_generated]
trigger_patterns:
  - "{{name}}"
  - "分析{{name}}"
  - "进行{{name}}分析"
parameters: 
  data: 
    type: string
    description: 分析数据
    required: true
  method: 
    type: string
    description: 分析方法
    required: true
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 分析内容

{{actions}}

## 参数

| 参数名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| data | string | 分析数据 | true |
| method | string | 分析方法 | true |

## 示例

{{examples}}

## 执行逻辑

1. 收集和整理分析数据
2. 选择合适的分析方法
3. 执行数据分析
4. 生成分析报告
5. 提供数据驱动的建议
6. 跟踪分析结果的应用

## 注意事项

- 确保数据的准确性和完整性
- 使用适当的分析方法和工具
- 清晰地呈现分析结果
- 提供可行的建议和解决方案
