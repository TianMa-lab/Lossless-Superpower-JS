const { autonomousLearningSystem } = require('./autonomous_learning');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class KnowledgeGraphReasoner {
  constructor() {
    this.autonomousLearningSystem = autonomousLearningSystem;
    this.graph = null;
    this.reasoningHistory = [];
  }

  // 初始化推理器
  async init() {
    try {
      console.log('知识图谱推理器初始化...');
      
      // 初始化自主学习系统
      const alInitialized = await this.autonomousLearningSystem.init();
      if (!alInitialized) {
        console.error('自主学习系统初始化失败');
        return false;
      }
      
      // 构建知识图谱
      this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      if (!this.graph) {
        console.error('知识图谱构建失败');
        return false;
      }
      
      console.log('知识图谱推理器初始化成功，包含', this.graph.nodes.length, '个节点和', this.graph.edges.length, '条边');
      return true;
    } catch (error) {
      console.error('知识图谱推理器初始化失败:', error.message);
      return false;
    }
  }

  // 路径推理：寻找两个节点之间的路径
  async pathReasoning(sourceNodeId, targetNodeId, maxDepth = 5) {
    try {
      console.log(`执行路径推理: ${sourceNodeId} -> ${targetNodeId}`);
      
      if (!this.graph) {
        this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      }
      
      const paths = [];
      const visited = new Set();
      
      // 深度优先搜索
      this._dfsPath(sourceNodeId, targetNodeId, [], visited, paths, maxDepth);
      
      // 按路径长度排序
      paths.sort((a, b) => a.length - b.length);
      
      // 记录推理结果
      this._logReasoning('path_reasoning', {
        source: sourceNodeId,
        target: targetNodeId,
        paths: paths.length,
        maxDepth: maxDepth,
        timestamp: Date.now()
      });
      
      return paths;
    } catch (error) {
      console.error('路径推理失败:', error.message);
      return [];
    }
  }

  // 深度优先搜索路径
  _dfsPath(current, target, path, visited, paths, maxDepth) {
    if (path.length > maxDepth) {
      return;
    }
    
    visited.add(current);
    path.push(current);
    
    if (current === target) {
      paths.push([...path]);
    } else {
      // 查找从当前节点出发的所有边
      const outgoingEdges = this.graph.edges.filter(edge => edge.source === current);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          this._dfsPath(edge.target, target, path, visited, paths, maxDepth);
        }
      }
    }
    
    path.pop();
    visited.delete(current);
  }

  // 关系推理：推断两个节点之间的关系
  async relationshipReasoning(node1Id, node2Id) {
    try {
      console.log(`执行关系推理: ${node1Id} <-> ${node2Id}`);
      
      if (!this.graph) {
        this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      }
      
      // 直接关系
      const directRelations = this.graph.edges.filter(edge => 
        (edge.source === node1Id && edge.target === node2Id) || 
        (edge.source === node2Id && edge.target === node1Id)
      );
      
      // 间接关系（通过中间节点）
      const indirectRelations = [];
      const maxDepth = 3;
      
      // 查找通过一个中间节点的关系
      for (const edge1 of this.graph.edges) {
        if (edge1.source === node1Id) {
          for (const edge2 of this.graph.edges) {
            if (edge2.source === edge1.target && edge2.target === node2Id) {
              indirectRelations.push({
                path: [node1Id, edge1.target, node2Id],
                relations: [edge1.label, edge2.label],
                confidence: (edge1.confidence || 1) * (edge2.confidence || 1)
              });
            }
          }
        }
      }
      
      // 记录推理结果
      this._logReasoning('relationship_reasoning', {
        node1: node1Id,
        node2: node2Id,
        directRelations: directRelations.length,
        indirectRelations: indirectRelations.length,
        timestamp: Date.now()
      });
      
      return {
        direct: directRelations,
        indirect: indirectRelations
      };
    } catch (error) {
      console.error('关系推理失败:', error.message);
      return { direct: [], indirect: [] };
    }
  }

  // 语义推理：基于语义相似度的推理
  async semanticReasoning(nodeId, topK = 5) {
    try {
      console.log(`执行语义推理: ${nodeId}`);
      
      if (!this.graph) {
        this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      }
      
      // 查找与目标节点语义相似的节点
      const similarNodes = [];
      const targetNode = this.graph.nodes.find(node => node.id === nodeId);
      
      if (!targetNode) {
        console.warn('目标节点不存在:', nodeId);
        return [];
      }
      
      // 基于标签和类型计算相似度
      for (const node of this.graph.nodes) {
        if (node.id !== nodeId) {
          const similarity = this._calculateSemanticSimilarity(targetNode, node);
          if (similarity > 0.3) { // 相似度阈值
            similarNodes.push({
              node: node,
              similarity: similarity
            });
          }
        }
      }
      
      // 按相似度排序并返回前K个
      similarNodes.sort((a, b) => b.similarity - a.similarity);
      const topSimilarNodes = similarNodes.slice(0, topK);
      
      // 记录推理结果
      this._logReasoning('semantic_reasoning', {
        node: nodeId,
        similarNodes: topSimilarNodes.length,
        topK: topK,
        timestamp: Date.now()
      });
      
      return topSimilarNodes;
    } catch (error) {
      console.error('语义推理失败:', error.message);
      return [];
    }
  }

  // 计算语义相似度
  _calculateSemanticSimilarity(node1, node2) {
    let similarity = 0;
    
    // 类型相似度
    if (node1.type === node2.type) {
      similarity += 0.5;
    }
    
    // 标签相似度（简单的字符串相似度）
    if (node1.label && node2.label) {
      const labelSimilarity = this._stringSimilarity(node1.label, node2.label);
      similarity += labelSimilarity * 0.3;
    }
    
    // 关系相似度（共同的邻居节点）
    const neighbors1 = this._getNeighbors(node1.id);
    const neighbors2 = this._getNeighbors(node2.id);
    const commonNeighbors = neighbors1.filter(n => neighbors2.includes(n));
    if (neighbors1.length > 0 || neighbors2.length > 0) {
      const neighborSimilarity = commonNeighbors.length / Math.max(neighbors1.length, neighbors2.length);
      similarity += neighborSimilarity * 0.2;
    }
    
    return similarity;
  }

  // 获取节点的邻居
  _getNeighbors(nodeId) {
    const neighbors = new Set();
    
    // 查找所有以该节点为源的边
    for (const edge of this.graph.edges) {
      if (edge.source === nodeId) {
        neighbors.add(edge.target);
      }
      if (edge.target === nodeId) {
        neighbors.add(edge.source);
      }
    }
    
    return Array.from(neighbors);
  }

  // 字符串相似度（简单的Levenshtein距离）
  _stringSimilarity(str1, str2) {
    const distance = this._levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength > 0 ? 1 - (distance / maxLength) : 0;
  }

  // Levenshtein距离
  _levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 规则推理：基于规则的推理
  async ruleBasedReasoning(rules) {
    try {
      console.log('执行规则推理');
      
      if (!this.graph) {
        this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      }
      
      const results = [];
      
      // 应用每条规则
      for (const rule of rules) {
        const ruleResults = this._applyRule(rule);
        results.push({
          rule: rule,
          results: ruleResults
        });
      }
      
      // 记录推理结果
      this._logReasoning('rule_based_reasoning', {
        rules: rules.length,
        totalResults: results.reduce((sum, r) => sum + r.results.length, 0),
        timestamp: Date.now()
      });
      
      return results;
    } catch (error) {
      console.error('规则推理失败:', error.message);
      return [];
    }
  }

  // 应用规则
  _applyRule(rule) {
    const results = [];
    
    switch (rule.type) {
      case 'transitive':
        // 传递性规则：如果 A->B 且 B->C，则 A->C
        for (const edge1 of this.graph.edges) {
          for (const edge2 of this.graph.edges) {
            if (edge1.target === edge2.source) {
              results.push({
                source: edge1.source,
                target: edge2.target,
                relation: `${edge1.label}->${edge2.label}`,
                confidence: (edge1.confidence || 1) * (edge2.confidence || 1)
              });
            }
          }
        }
        break;
        
      case 'symmetric':
        // 对称性规则：如果 A->B，则 B->A
        for (const edge of this.graph.edges) {
          results.push({
            source: edge.target,
            target: edge.source,
            relation: `reverse_${edge.label}`,
            confidence: edge.confidence || 1
          });
        }
        break;
        
      case 'reflexive':
        // 自反性规则：A->A
        for (const node of this.graph.nodes) {
          results.push({
            source: node.id,
            target: node.id,
            relation: 'self',
            confidence: 1
          });
        }
        break;
    }
    
    return results;
  }

  // 知识图谱补全：预测缺失的边
  async graphCompletion(topK = 10) {
    try {
      console.log('执行知识图谱补全');
      
      if (!this.graph) {
        this.graph = await this.autonomousLearningSystem.buildKnowledgeGraph();
      }
      
      const predictions = [];
      
      // 预测可能的边
      for (const sourceNode of this.graph.nodes) {
        for (const targetNode of this.graph.nodes) {
          if (sourceNode.id !== targetNode.id) {
            // 检查是否已经存在边
            const existingEdge = this.graph.edges.find(edge => 
              edge.source === sourceNode.id && edge.target === targetNode.id
            );
            
            if (!existingEdge) {
              // 计算边存在的概率
              const probability = this._calculateEdgeProbability(sourceNode, targetNode);
              if (probability > 0.5) { // 概率阈值
                predictions.push({
                  source: sourceNode.id,
                  target: targetNode.id,
                  probability: probability
                });
              }
            }
          }
        }
      }
      
      // 按概率排序并返回前K个
      predictions.sort((a, b) => b.probability - a.probability);
      const topPredictions = predictions.slice(0, topK);
      
      // 记录推理结果
      this._logReasoning('graph_completion', {
        predictions: topPredictions.length,
        topK: topK,
        timestamp: Date.now()
      });
      
      return topPredictions;
    } catch (error) {
      console.error('知识图谱补全失败:', error.message);
      return [];
    }
  }

  // 计算边存在的概率
  _calculateEdgeProbability(sourceNode, targetNode) {
    let probability = 0;
    
    // 基于共同邻居计算
    const sourceNeighbors = this._getNeighbors(sourceNode.id);
    const targetNeighbors = this._getNeighbors(targetNode.id);
    const commonNeighbors = sourceNeighbors.filter(n => targetNeighbors.includes(n));
    
    if (sourceNeighbors.length > 0 && targetNeighbors.length > 0) {
      probability = commonNeighbors.length / Math.sqrt(sourceNeighbors.length * targetNeighbors.length);
    }
    
    // 基于类型计算
    if (sourceNode.type === targetNode.type) {
      probability += 0.2;
    }
    
    // 基于标签相似度计算
    if (sourceNode.label && targetNode.label) {
      const labelSimilarity = this._stringSimilarity(sourceNode.label, targetNode.label);
      probability += labelSimilarity * 0.1;
    }
    
    return Math.min(probability, 1.0);
  }

  // 多步推理：组合多种推理方法
  async multiStepReasoning(queries) {
    try {
      console.log('执行多步推理');
      
      const results = [];
      
      for (const query of queries) {
        let queryResult;
        
        switch (query.type) {
          case 'path':
            queryResult = await this.pathReasoning(query.source, query.target, query.maxDepth || 5);
            break;
            
          case 'relationship':
            queryResult = await this.relationshipReasoning(query.node1, query.node2);
            break;
            
          case 'semantic':
            queryResult = await this.semanticReasoning(query.node, query.topK || 5);
            break;
            
          case 'rule':
            queryResult = await this.ruleBasedReasoning(query.rules || []);
            break;
            
          case 'completion':
            queryResult = await this.graphCompletion(query.topK || 10);
            break;
        }
        
        results.push({
          query: query,
          result: queryResult
        });
      }
      
      // 记录推理结果
      this._logReasoning('multi_step_reasoning', {
        queries: queries.length,
        timestamp: Date.now()
      });
      
      return results;
    } catch (error) {
      console.error('多步推理失败:', error.message);
      return [];
    }
  }

  // 导出推理结果
  exportReasoningResults() {
    const exportData = {
      reasoningHistory: this.reasoningHistory,
      exportTime: Date.now()
    };
    
    const exportFile = path.join(__dirname, 'reasoning_results', 'reasoning_export_' + Date.now() + '.json');
    if (!fs.existsSync(path.dirname(exportFile))) {
      fs.mkdirSync(path.dirname(exportFile), { recursive: true });
    }
    fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2), 'utf-8');
    
    console.log('推理结果已导出到:', exportFile);
    return exportFile;
  }

  // 记录推理过程
  _logReasoning(type, details) {
    const reasoning = {
      id: uuidv4(),
      type: type,
      details: details,
      timestamp: Date.now()
    };
    this.reasoningHistory.push(reasoning);
    
    // 限制历史记录大小
    if (this.reasoningHistory.length > 1000) {
      this.reasoningHistory = this.reasoningHistory.slice(-1000);
    }
  }

  // 清理资源
  cleanup() {
    this.reasoningHistory = [];
    console.log('知识图谱推理器资源清理完成');
  }
}

const knowledgeGraphReasoner = new KnowledgeGraphReasoner();

module.exports = {
  KnowledgeGraphReasoner,
  knowledgeGraphReasoner
};
