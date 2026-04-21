const fs = require('fs');
const path = require('path');

class DocGenerator {
  constructor(config) {
    this.config = {
      comparisonPath: 'D:\\opensource\\comparison-results',
      docPath: 'C:\\Users\\55237\\Lossless-Superpower-JS\\SYSTEM_DESIGN.md',
      templatePath: 'C:\\Users\\55237\\Lossless-Superpower-JS\\src\\superpowers\\templates',
      ...config
    };
    
    // 创建模板目录
    if (!fs.existsSync(this.config.templatePath)) {
      fs.mkdirSync(this.config.templatePath, { recursive: true });
    }
  }

  async generateDocumentation() {
    try {
      // 读取比较结果
      const comparisons = this.readComparisons();
      
      // 生成技术设计文档
      await this.generateSystemDesignDoc(comparisons);
      
      // 生成变更日志
      await this.generateChangeLog(comparisons);
      
      return {
        status: 'success',
        message: '文档生成成功'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  readComparisons() {
    const comparisons = {};
    const projects = ['hermes', 'openclaw', 'awesome-kgr', 'superpower'];
    
    projects.forEach(projectId => {
      const comparisonFile = path.join(this.config.comparisonPath, `${projectId}_comparison.json`);
      if (fs.existsSync(comparisonFile)) {
        comparisons[projectId] = JSON.parse(fs.readFileSync(comparisonFile, 'utf8'));
      }
    });
    
    return comparisons;
  }

  async generateSystemDesignDoc(comparisons) {
    // 读取现有的系统设计文档
    let existingContent = '';
    if (fs.existsSync(this.config.docPath)) {
      existingContent = fs.readFileSync(this.config.docPath, 'utf8');
    }
    
    // 生成新的内容
    const newContent = this.generateDocContent(comparisons, existingContent);
    
    // 写入文档
    fs.writeFileSync(this.config.docPath, newContent);
  }

  generateDocContent(comparisons, existingContent) {
    // 提取现有文档的头部内容
    const headerEndIndex = existingContent.indexOf('## 1. 系统架构');
    let headerContent = '';
    if (headerEndIndex !== -1) {
      headerContent = existingContent.substring(0, headerEndIndex);
    } else {
      headerContent = `# Lossless Superpower 系统设计文档

## 文档信息

- **版本**: 1.0.0
- **最后更新**: ${new Date().toISOString()}
- **生成工具**: DocGenerator

`;
    }
    
    // 生成系统架构部分
    let architectureContent = `## 1. 系统架构

### 1.1 整体架构

Lossless Superpower 采用模块化、插件化的架构设计，主要包含以下核心模块：

- **核心引擎**：系统的核心逻辑和调度中心
- **知识图谱推理**：提供知识图谱的推理能力
- **DAG-KG提取对齐**：实现DAG与知识图谱之间的转换和对齐
- **自动迭代系统**：自动监控和优化系统性能
- **技能系统**：提供各种技能和工具
- **插件系统**：支持第三方插件扩展
- **永久记忆**：持久化存储系统状态和知识
- **自我进化**：系统的自学习和自优化能力
- **飞书集成**：与飞书平台的集成

### 1.2 核心模块

`;
    
    // 生成功能模块部分
    let featuresContent = `## 2. 核心功能

### 2.1 知识图谱推理
- 支持多种推理算法：TransE、RotatE、ComplEx、TuckER
- 路径推理优化：A*、IDA*、PRA算法
- 图神经网络：GCN、GAT、RGCN模型
- 规则推理：一阶逻辑和规则学习
- 时序推理：时序知识图谱和时间模式挖掘

### 2.2 DAG-KG提取对齐
- 智能提取：从知识图谱提取DAG结构
- 边映射优化：自动优化边的映射关系
- 双向同步：支持DAG和知识图谱的双向同步
- 质量评估：评估提取和对齐的质量

### 2.3 自动迭代系统
- 同步管理器：自动同步开源项目
- 项目分析器：分析开源项目的功能和结构
- 系统比较器：与当前系统比较，识别需要借鉴的功能
- 文档生成器：自动更新技术设计文档
- 执行器：执行更新计划

`;
    
    // 从开源项目中借鉴的功能
    let borrowedFeaturesContent = `### 2.4 从开源项目借鉴的功能

`;
    
    // 处理每个项目的比较结果
    Object.keys(comparisons).forEach(projectId => {
      const comparison = comparisons[projectId];
      const projectName = comparison.project;
      
      borrowedFeaturesContent += `#### 2.4.1 ${projectName}

`;
      
      // 添加缺失的功能
      if (comparison.featureComparison.missingFeatures.length > 0) {
        borrowedFeaturesContent += `**缺失的功能**：
`;
        comparison.featureComparison.missingFeatures.forEach(feature => {
          borrowedFeaturesContent += `- ${feature}
`;
        });
        borrowedFeaturesContent += `
`;
      }
      
      // 添加潜在的功能
      if (comparison.featureComparison.potentialFeatures.length > 0) {
        borrowedFeaturesContent += `**潜在的功能**：
`;
        comparison.featureComparison.potentialFeatures.forEach(feature => {
          borrowedFeaturesContent += `- ${feature}
`;
        });
        borrowedFeaturesContent += `
`;
      }
      
      // 添加建议
      if (comparison.recommendations.length > 0) {
        borrowedFeaturesContent += `**建议**：
`;
        comparison.recommendations.forEach(rec => {
          borrowedFeaturesContent += `- [${rec.priority.toUpperCase()}] ${rec.title}：${rec.description}
`;
        });
        borrowedFeaturesContent += `
`;
      }
    });
    
    // 生成技术栈部分
    let techStackContent = `## 3. 技术栈

### 3.1 核心技术
- **语言**：JavaScript
- **运行环境**：Node.js
- **依赖**：uuid、fs、path、child_process
- **版本控制**：Git

### 3.2 开源项目依赖
- **Hermes**：提供代理系统和技能框架
- **OpenCLAW**：提供工作流管理和自适应能力
- **Awesome-Knowledge-Graph-Reasoning**：提供知识图谱推理算法
- **Superpowers**：提供技能框架和软件开发方法论

`;
    
    // 生成总结部分
    const summaryContent = `## 4. 总结

Lossless Superpower 是一个功能强大的AI系统，通过借鉴多个开源项目的先进功能，不断提升自身能力。系统采用模块化、插件化的架构设计，支持知识图谱推理、DAG-KG提取对齐、自动迭代等核心功能。

通过自动同步和分析开源项目，系统能够持续学习和进化，保持技术的先进性和竞争力。未来，系统将继续借鉴和整合更多开源项目的优秀功能，为用户提供更强大、更智能的服务。

`;
    
    // 组合所有内容
    const fullContent = headerContent + architectureContent + featuresContent + borrowedFeaturesContent + techStackContent + summaryContent;
    
    return fullContent;
  }

  async generateChangeLog(comparisons) {
    const changelogPath = path.join(path.dirname(this.config.docPath), 'CHANGELOG.md');
    
    // 生成变更日志内容
    let changelogContent = `# 变更日志

## ${new Date().toISOString().split('T')[0]}

### 从开源项目借鉴的功能

`;
    
    // 处理每个项目的比较结果
    Object.keys(comparisons).forEach(projectId => {
      const comparison = comparisons[projectId];
      const projectName = comparison.project;
      
      changelogContent += `#### ${projectName}

`;
      
      // 添加建议
      if (comparison.recommendations.length > 0) {
        comparison.recommendations.forEach(rec => {
          changelogContent += `- [${rec.priority.toUpperCase()}] ${rec.title}：${rec.description}
`;
        });
        changelogContent += `
`;
      }
    });
    
    // 读取现有的变更日志
    let existingChangelog = '';
    if (fs.existsSync(changelogPath)) {
      existingChangelog = fs.readFileSync(changelogPath, 'utf8');
    }
    
    // 组合内容
    const fullChangelog = changelogContent + (existingChangelog ? `\n${existingChangelog}` : '');
    
    // 写入变更日志
    fs.writeFileSync(changelogPath, fullChangelog);
  }
}

module.exports = DocGenerator;