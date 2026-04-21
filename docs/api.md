# DAG与知识图谱集成系统API文档

## 核心模块API

### 增强的DAG与知识图谱集成模块

#### 初始化

```javascript
const { enhancedKnowledgeGraphDAGIntegration } = require('./src/superpowers');
await enhancedKnowledgeGraphDAGIntegration.init();
```

#### 智能提取知识图谱到DAG

```javascript
await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG();
```

#### 双向同步

```javascript
await enhancedKnowledgeGraphDAGIntegration.bidirectionalSync();
```

#### 边映射优化

```javascript
await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping();
```

#### 实时同步

```javascript
await enhancedKnowledgeGraphDAGIntegration.realtimeSync();
```

#### 节点去重

```javascript
await enhancedKnowledgeGraphDAGIntegration.deduplicateNodes();
```

#### 性能优化

```javascript
await enhancedKnowledgeGraphDAGIntegration.optimizePerformance();
```

#### 映射分析

```javascript
const report = await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
console.log('映射分析报告:', report);
```

#### 生成可视化数据

```javascript
const visualizationData = await enhancedKnowledgeGraphDAGIntegration.generateVisualization();
console.log('可视化数据已生成');
```

#### 导出映射数据

```javascript
const exportFile = enhancedKnowledgeGraphDAGIntegration.exportMappingData();
console.log('映射数据已导出到:', exportFile);
```

### 监控系统API

#### 初始化监控

```javascript
const { dagkgMonitor } = require('./src/monitor');
dagkgMonitor.init();
```

#### 获取当前状态

```javascript
const status = dagkgMonitor.getStatus();
console.log('系统状态:', status);
```

#### 导出监控数据

```javascript
const exportFile = dagkgMonitor.exportData();
console.log('监控数据已导出到:', exportFile);
```

#### 清除告警

```javascript
dagkgMonitor.clearAlerts();
```

## HTTP API

### 系统状态

**请求**：
```
GET /api/system/status
```

**响应**：
```json
{
  "storage_initialized": true,
  "charter": "见 /api/system/charter 端点获取系统宪章全文",
  "fundamental_position": "Lossless Superpower JS 是 trace CN 的插件系统",
  "timestamp": 1776425998580,
  "version": "1.0.0",
  "name": "Lossless Superpower JS"
}
```

### 系统宪章

**请求**：
```
GET /api/system/charter
```

**响应**：
```json
{
  "charter": "# Lossless Superpower JS 系统宪章

## 根本定位

**Lossless Superpower JS 是 trace CN 的插件系统**

所有架构设计、功能迭代、技术决策都必须从这一根本定位出发。"
}
```

## 错误处理

### 常见错误

1. **知识图谱构建失败**
   - 原因：自主学习系统初始化失败或数据问题
   - 解决方案：检查自主学习系统配置，确保数据正确

2. **边映射失败**
   - 原因：源节点或目标节点不存在
   - 解决方案：确保所有节点都已正确提取到DAG中

3. **同步失败**
   - 原因：网络问题或数据冲突
   - 解决方案：检查网络连接，处理数据冲突

4. **性能问题**
   - 原因：数据量过大或系统资源不足
   - 解决方案：优化系统配置，增加系统资源

### 错误处理最佳实践

1. **使用try-catch**：捕获并处理异常
2. **日志记录**：记录错误信息，便于排查
3. **错误重试**：对于临时性错误，实现重试机制
4. **错误告警**：对于严重错误，触发告警

## 示例代码

### 完整示例

```javascript
const { enhancedKnowledgeGraphDAGIntegration, dagkgMonitor } = require('./src/superpowers');

async function main() {
  try {
    // 初始化监控
    dagkgMonitor.init();
    
    // 初始化集成
    await enhancedKnowledgeGraphDAGIntegration.init();
    
    // 性能优化
    await enhancedKnowledgeGraphDAGIntegration.optimizePerformance();
    
    // 节点去重
    await enhancedKnowledgeGraphDAGIntegration.deduplicateNodes();
    
    // 智能提取知识图谱到DAG
    await enhancedKnowledgeGraphDAGIntegration.intelligentExtractKnowledgeGraphToDAG();
    
    // 边映射优化
    await enhancedKnowledgeGraphDAGIntegration.optimizeEdgeMapping();
    
    // 实时同步
    await enhancedKnowledgeGraphDAGIntegration.realtimeSync();
    
    // 分析映射关系
    await enhancedKnowledgeGraphDAGIntegration.analyzeMapping();
    
    // 生成可视化数据
    await enhancedKnowledgeGraphDAGIntegration.generateVisualization();
    
    // 导出映射数据
    enhancedKnowledgeGraphDAGIntegration.exportMappingData();
    
    console.log('操作完成');
  } catch (error) {
    console.error('操作失败:', error.message);
  }
}

main();
```
