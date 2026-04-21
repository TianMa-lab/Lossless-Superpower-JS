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
    const ignoredDirs = ['.git', 'node_modules', 'dist', 'build', '.vscode', '.idea'];
    const maxDepth = 5;
    
    function traverse(currentPath, currentStructure, depth) {
      if (depth >= maxDepth) {
        currentStructure['...'] = '目录深度超过限制';
        return;
      }
      
      try {
        const files = fs.readdirSync(currentPath);
        
        files.forEach(file => {
          if (ignoredDirs.includes(file)) {
            return;
          }
          
          const fullPath = path.join(currentPath, file);
          try {
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
              currentStructure[file] = {};
              traverse(fullPath, currentStructure[file], depth + 1);
            } else {
              // 只存储重要文件的信息
              const ext = path.extname(file);
              const importantExts = ['.js', '.ts', '.py', '.json', '.md', '.yml', '.yaml', '.txt'];
              
              if (importantExts.includes(ext) || file === 'README' || file === 'package.json' || file === 'requirements.txt') {
                currentStructure[file] = {
                  size: stats.size,
                  mtime: stats.mtime.toISOString(),
                  type: ext || 'txt'
                };
              } else {
                // 对于其他文件，只记录存在性
                currentStructure[file] = 'file';
              }
            }
          } catch (error) {
            // 忽略无法访问的文件
            currentStructure[file] = 'access_error';
          }
        });
      } catch (error) {
        currentStructure['error'] = error.message;
      }
    }
    
    traverse(dir, structure, 0);
    return structure;
  }

  analyzeTechStack(dir) {
    const techStack = {
      languages: new Set(),
      dependencies: new Set(),
      frameworks: new Set(),
      buildTools: new Set(),
      databases: new Set()
    };
    
    const ignoredDirs = ['.git', 'node_modules', 'dist', 'build', '.vscode', '.idea'];
    const maxDepth = 3;
    
    // 检查package.json
    const packageJsonPath = path.join(dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        techStack.frameworks.add('Node.js');
        
        // 检查依赖
        if (packageJson.dependencies) {
          Object.keys(packageJson.dependencies).forEach(dep => {
            techStack.dependencies.add(dep);
            // 识别常见框架和库
            if (['react', 'vue', 'angular', 'express', 'koa', 'nestjs'].includes(dep)) {
              techStack.frameworks.add(dep);
            }
            if (['mongodb', 'mongoose', 'mysql', 'pg', 'redis'].includes(dep)) {
              techStack.databases.add(dep);
            }
          });
        }
        
        // 检查开发依赖
        if (packageJson.devDependencies) {
          Object.keys(packageJson.devDependencies).forEach(dep => {
            techStack.dependencies.add(dep);
            if (['webpack', 'vite', 'babel', 'eslint', 'jest', 'mocha'].includes(dep)) {
              techStack.buildTools.add(dep);
            }
          });
        }
      } catch (error) {
        console.error('分析package.json失败:', error.message);
      }
    }
    
    // 检查requirements.txt
    const requirementsPath = path.join(dir, 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      try {
        techStack.frameworks.add('Python');
        const content = fs.readFileSync(requirementsPath, 'utf8');
        content.split('\n').forEach(line => {
          if (line.trim() && !line.startsWith('#')) {
            const dep = line.split('=')[0].trim();
            techStack.dependencies.add(dep);
            // 识别常见Python库
            if (['django', 'flask', 'fastapi', 'pytorch', 'tensorflow', 'numpy', 'pandas'].includes(dep)) {
              techStack.frameworks.add(dep);
            }
            if (['pymongo', 'psycopg2', 'mysql-connector', 'redis'].includes(dep)) {
              techStack.databases.add(dep);
            }
          }
        });
      } catch (error) {
        console.error('分析requirements.txt失败:', error.message);
      }
    }
    
    // 检查其他配置文件
    const configFiles = [
      { name: 'tsconfig.json', framework: 'TypeScript' },
      { name: 'webpack.config.js', buildTool: 'Webpack' },
      { name: 'vite.config.js', buildTool: 'Vite' },
      { name: 'Dockerfile', buildTool: 'Docker' },
      { name: 'docker-compose.yml', buildTool: 'Docker Compose' }
    ];
    
    configFiles.forEach(config => {
      const configPath = path.join(dir, config.name);
      if (fs.existsSync(configPath)) {
        if (config.framework) {
          techStack.frameworks.add(config.framework);
        }
        if (config.buildTool) {
          techStack.buildTools.add(config.buildTool);
        }
      }
    });
    
    // 检查其他语言文件
    function checkFiles(currentPath, depth) {
      if (depth >= maxDepth) {
        return;
      }
      
      try {
        const files = fs.readdirSync(currentPath);
        
        files.forEach(file => {
          if (ignoredDirs.includes(file)) {
            return;
          }
          
          const fullPath = path.join(currentPath, file);
          try {
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
              checkFiles(fullPath, depth + 1);
            } else {
              const ext = path.extname(file);
              const extToLanguage = {
                '.js': 'JavaScript',
                '.jsx': 'JavaScript',
                '.ts': 'TypeScript',
                '.tsx': 'TypeScript',
                '.py': 'Python',
                '.go': 'Go',
                '.java': 'Java',
                '.cs': 'C#',
                '.cpp': 'C++',
                '.cc': 'C++',
                '.c': 'C',
                '.rb': 'Ruby',
                '.php': 'PHP',
                '.swift': 'Swift',
                '.kt': 'Kotlin',
                '.rs': 'Rust'
              };
              
              if (extToLanguage[ext]) {
                techStack.languages.add(extToLanguage[ext]);
              }
            }
          } catch (error) {
            // 忽略无法访问的文件
          }
        });
      } catch (error) {
        // 忽略无法访问的目录
      }
    }
    
    checkFiles(dir, 0);
    
    // 转换Set为数组
    return {
      languages: Array.from(techStack.languages),
      dependencies: Array.from(techStack.dependencies),
      frameworks: Array.from(techStack.frameworks),
      buildTools: Array.from(techStack.buildTools),
      databases: Array.from(techStack.databases)
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