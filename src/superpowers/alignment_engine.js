/**
 * 对齐引擎
 * 自动将DAG节点与知识图谱节点进行对齐
 */

class AlignmentEngine {
  constructor() {
    this.mappings = new Map();
  }

  async align(dagNode, kgNode, options = {}) {
    const confidence = this.calculateConfidence(dagNode, kgNode);
    
    if (confidence >= (options.minConfidence || 0.7)) {
      const mapping = {
        id: `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dagNodeId: dagNode.id,
        kgNodeId: kgNode.id,
        confidence: confidence,
        type: options.type || 'direct',
        createdAt: Date.now(),
        metadata: {
          source: options.source || 'auto',
          method: options.method || 'semantic_matching',
          score: confidence
        }
      };

      this.mappings.set(mapping.id, mapping);
      return mapping;
    }

    return null;
  }

  calculateConfidence(dagNode, kgNode) {
    let confidence = 0;

    // 基于名称匹配
    if (dagNode.topic && kgNode.name) {
      const nameSimilarity = this.calculateStringSimilarity(
        dagNode.topic.toLowerCase(),
        kgNode.name.toLowerCase()
      );
      confidence += nameSimilarity * 0.4;
    }

    // 基于内容匹配
    if (dagNode.content && kgNode.description) {
      const contentSimilarity = this.calculateStringSimilarity(
        dagNode.content.toLowerCase(),
        kgNode.description.toLowerCase()
      );
      confidence += contentSimilarity * 0.3;
    }

    // 基于类型匹配
    if (dagNode.type && kgNode.type) {
      if (dagNode.type === kgNode.type) {
        confidence += 0.2;
      } else if (this.areTypesCompatible(dagNode.type, kgNode.type)) {
        confidence += 0.1;
      }
    }

    // 基于标签匹配
    if (dagNode.metadata?.tags && kgNode.properties?.tags) {
      const tagSimilarity = this.calculateTagSimilarity(
        dagNode.metadata.tags,
        kgNode.properties.tags
      );
      confidence += tagSimilarity * 0.1;
    }

    return Math.min(1.0, confidence);
  }

  calculateStringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    return (longerLength - this.editDistance(longer, shorter)) / longerLength;
  }

  editDistance(str1, str2) {
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

  areTypesCompatible(dagType, kgType) {
    const compatibilityMap = {
      task: ['skill', 'activity', 'process'],
      memory: ['knowledge', 'memory', 'information'],
      conversation: ['dialogue', 'communication', 'interaction'],
      entity: ['entity', 'object', 'item'],
      concept: ['concept', 'idea', 'notion']
    };

    return compatibilityMap[dagType]?.includes(kgType) || false;
  }

  calculateTagSimilarity(tags1, tags2) {
    if (!tags1 || !tags2) return 0;
    
    const intersection = tags1.filter(tag => tags2.includes(tag));
    const union = [...new Set([...tags1, ...tags2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  async batchAlign(dagNodes, kgNodes, options = {}) {
    const mappings = [];
    
    for (const dagNode of dagNodes) {
      let bestMapping = null;
      let bestConfidence = 0;
      
      for (const kgNode of kgNodes) {
        const mapping = await this.align(dagNode, kgNode, options);
        if (mapping && mapping.confidence > bestConfidence) {
          bestMapping = mapping;
          bestConfidence = mapping.confidence;
        }
      }
      
      if (bestMapping) {
        mappings.push(bestMapping);
      }
    }
    
    return mappings;
  }

  getMapping(mappingId) {
    return this.mappings.get(mappingId);
  }

  getMappings() {
    return Array.from(this.mappings.values());
  }

  getMappingsByDagNode(dagNodeId) {
    return Array.from(this.mappings.values()).filter(
      mapping => mapping.dagNodeId === dagNodeId
    );
  }

  getMappingsByKgNode(kgNodeId) {
    return Array.from(this.mappings.values()).filter(
      mapping => mapping.kgNodeId === kgNodeId
    );
  }

  removeMapping(mappingId) {
    return this.mappings.delete(mappingId);
  }

  clearMappings() {
    this.mappings.clear();
  }

  validateMappings() {
    const validMappings = [];
    const invalidMappings = [];
    
    for (const mapping of this.mappings.values()) {
      if (mapping.confidence >= 0.7) {
        validMappings.push(mapping);
      } else {
        invalidMappings.push(mapping);
      }
    }
    
    return {
      valid: validMappings,
      invalid: invalidMappings,
      validationTime: Date.now()
    };
  }
}

const alignmentEngine = new AlignmentEngine();

module.exports = {
  AlignmentEngine,
  alignmentEngine
};
