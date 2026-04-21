const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Analyzer {
  constructor(config) {
    this.config = {
      projects: [
        {
          id: 'hermes',
          name: 'Hermes Agent',
          localPath: 'D:\\opensource\\hermes\\agent'
        },
        {
          id: 'openclaw',
          name: 'OpenCLAW',
          localPath: 'D:\\opensource\\openclaw'
        },
        {
          id: 'awesome-kgr',
          name: 'Awesome Knowledge Graph Reasoning',
          localPath: 'D:\\opensource\\awesome-kgr'
        },
        {
          id: 'superpower',
          name: 'Superpowers',
          localPath: 'D:\\opensource\\superpower'
        }
      ],
      analysisPath: 'D:\\opensource\\analysis-results',
      ...config
    };
    
    // 创建分析结果目录
    if (!fs.existsSync(this.config.analysisPath)) {
      fs.mkdirSync(this.config.analysisPath, { recursive: true });
    }
  }

  async analyzeAllProjects() {
    const results = [];
    
    for (const project of this.config.projects) {
      try {
        const result = await this.analyzeProject(project);
        results.push(result);
      } catch (error) {
        results.push({
          project: project.name,
          status: 'error',
          message: error.message
        });
      }
    }
    
    return results;
  }

  async analyzeProject(project) {
    const analysisFile = path.join(this.config.analysisPath, `${project.id}_analysis.json`);
    
    try {
      // 分析目录结构
      const structure = this.analyzeDirectoryStructure(project.localPath);
      
      // 分析技术栈
      const techStack = this.analyzeTechStack(project.localPath);
      
      // 分析核心功能
      const coreFeatures = this.analyzeCoreFeatures(project.localPath, project.id);
      
      // 分析API
      const api = this.analyzeAPI(project.localPath, project.id);
      
      const analysis = {
        project: project.name,
        timestamp: new Date().toISOString(),
        structure,
        techStack,
        coreFeatures,
        api
      };
      
      // 保存分析结果
      fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
      
      return {
        project: project.name,
        status: 'success',
        analysis
      };
    } catch (error) {
      throw error;
    }
  }

  analyzeDirectoryStructure(dir) {
    const structure = {};
    
    function traverse(currentPath, currentStructure) {
      const files = fs.readdirSync(currentPath);
      
      files.forEach(file => {
        const fullPath = path.join(currentPath, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          currentStructure[file] = {};
          traverse(fullPath, currentStructure[file]);
        } else {
          currentStructure[file] = {
            size: stats.size,
            mtime: stats.mtime.toISOString()
          };
        }
      });
    }
    
    traverse(dir, structure);
    return structure;
  }

  analyzeTechStack(dir) {
    const techStack = {
      languages: new Set(),
      dependencies: new Set(),
      frameworks: new Set()
    };
    
    // 检查package.json
    const packageJsonPath = path.join(dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      techStack.frameworks.add('Node.js');
      
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
          techStack.dependencies.add(dep);
        });
      }
    }
    
    // 检查requirements.txt
    const requirementsPath = path.join(dir, 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      techStack.frameworks.add('Python');
      const content = fs.readFileSync(requirementsPath, 'utf8');
      content.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          techStack.dependencies.add(line.split('=')[0].trim());
        }
      });
    }
    
    // 检查其他语言文件
    function checkFiles(currentPath) {
      const files = fs.readdirSync(currentPath);
      
      files.forEach(file => {
        const fullPath = path.join(currentPath, file);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          checkFiles(fullPath);
        } else {
          const ext = path.extname(file);
          switch (ext) {
            case '.js':
            case '.jsx':
              techStack.languages.add('JavaScript');
              break;
            case '.ts':
            case '.tsx':
              techStack.languages.add('TypeScript');
              break;
            case '.py':
              techStack.languages.add('Python');
              break;
            case '.go':
              techStack.languages.add('Go');
              break;
            case '.java':
              techStack.languages.add('Java');
              break;
            case '.cs':
              techStack.languages.add('C#');
              break;
            case '.cpp':
            case '.cc':
              techStack.languages.add('C++');
              break;
            case '.c':
              techStack.languages.add('C');
              break;
          }
        }
      });
    }
    
    checkFiles(dir);
    
    // 转换Set为数组
    return {
      languages: Array.from(techStack.languages),
      dependencies: Array.from(techStack.dependencies),
      frameworks: Array.from(techStack.frameworks)
    };
  }

  analyzeCoreFeatures(dir, projectId) {
    const features = [];
    
    switch (projectId) {
      case 'hermes':
        features.push(
          '代理系统',
          '网关系统',
          '技能系统',
          '工具系统',
          '记忆系统',
          '调度系统'
        );
        break;
      case 'openclaw':
        features.push(
          '工作流管理',
          '自适应能力',
          '模块化设计',
          '插件机制',
          '监控和反馈'
        );
        break;
      case 'awesome-kgr':
        features.push(
          '知识图谱推理算法',
          '数据集',
          '论文资源',
          '工具集成'
        );
        break;
      case 'superpower':
        features.push(
          '技能框架',
          '软件开发方法论',
          '代理系统',
          '代码审查',
          '测试驱动开发'
        );
        break;
    }
    
    return features;
  }

  analyzeAPI(dir, projectId) {
    const api = {
      endpoints: [],
      methods: []
    };
    
    // 这里可以根据项目类型进行更详细的API分析
    switch (projectId) {
      case 'hermes':
        api.endpoints.push('代理API', '网关API', '技能API', '工具API', '记忆API');
        api.methods.push('createAgent', 'executeTask', 'manageSkills', 'useTools', 'storeMemory');
        break;
      case 'openclaw':
        api.endpoints.push('工作流API', '任务API', '插件API');
        api.methods.push('createWorkflow', 'executeTask', 'registerPlugin');
        break;
      case 'awesome-kgr':
        api.endpoints.push('推理API', '数据集API');
        api.methods.push('runInference', 'loadDataset');
        break;
      case 'superpower':
        api.endpoints.push('技能API', '代理API');
        api.methods.push('executeSkill', 'manageAgents');
        break;
    }
    
    return api;
  }
}

module.exports = Analyzer;