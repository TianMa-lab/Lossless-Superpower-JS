---
name: {{name}}
description: {{description}}
version: 1.0.0
author: Lossless Superpower
tags: [programming, auto_generated]
trigger_patterns:
  - "{{name}}"
  - "编写{{name}}代码"
  - "执行{{name}}编程"
parameters: 
  language: 
    type: string
    description: 编程语言
    required: true
  task: 
    type: string
    description: 编程任务
    required: true
execution:
  type: javascript
  module: skills.{{name}}
  function: runSkill
---

# {{name}}

## 描述

{{description}}

## 编程任务

{{actions}}

## 参数

| 参数名 | 类型 | 描述 | 是否必填 |
|--------|------|------|----------|
| language | string | 编程语言 | true |
| task | string | 编程任务 | true |

## 示例

{{examples}}

## 执行逻辑

1. 分析编程任务需求
2. 选择合适的编程语言
3. 编写代码实现功能
4. 测试代码运行效果
5. 优化代码性能

## 注意事项

- 确保代码的可读性和可维护性
- 遵循所选语言的最佳实践
- 注意代码安全性和性能
- 定期更新技能以适应编程语言的变化
