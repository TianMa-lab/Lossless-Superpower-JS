/**
 * 同步引擎
 * 实现DAG和知识图谱之间的双向同步
 */

class SyncEngine {
  constructor() {
    this.syncHistory = [];
    this.syncStatus = {
      lastSyncTime: null,
      lastSyncStatus: 'idle',
      syncCount: 0,
      failedSyncs: 0
    };
  }

  async syncDAGtoKG(dagNode, kgManager, options = {}) {
    try {
      this.syncStatus.lastSyncStatus = 'syncing';
      
      // 检查是否已存在对应的KG节点
      const existingMappings = this.getMappingsByDagNode(dagNode.id);
      let kgNode = null;

      if (existingMappings.length > 0) {
        // 更新现有节点
        const mapping = existingMappings[0];
        kgNode = kgManager.getNode(mapping.kgNodeId);
        if (kgNode) {
          kgNode = await this.updateKGNode(kgNode, dagNode, options);
        }
      } else {
        // 创建新节点
        kgNode = await this.createKGNodeFromDAG(dagNode, options);
        kgManager.addNode(kgNode.id, kgNode);
        
        // 创建映射
        const mapping = {
          id: `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dagNodeId: dagNode.id,
          kgNodeId: kgNode.id,
          confidence: 0.9,
          type: 'direct',
          createdAt: Date.now(),
          metadata: {
            source: 'sync',
            method: 'dag_to_kg',
            score: 0.9
          }
        };
        this.addMapping(mapping);
      }

      const syncResult = {
        success: true,
        direction: 'dag_to_kg',
        dagNodeId: dagNode.id,
        kgNodeId: kgNode?.id,
        timestamp: Date.now(),
        message: 'DAG to KG sync successful'
      };

      this.syncHistory.push(syncResult);
      this.updateSyncStatus(syncResult);
      
      return syncResult;
    } catch (error) {
      const syncResult = {
        success: false,
        direction: 'dag_to_kg',
        dagNodeId: dagNode.id,
        timestamp: Date.now(),
        message: `DAG to KG sync failed: ${error.message}`
      };

      this.syncHistory.push(syncResult);
      this.updateSyncStatus(syncResult);
      
      return syncResult;
    }
  }

  async syncKGtoDAG(kgNode, dagManager, options = {}) {
    try {
      this.syncStatus.lastSyncStatus = 'syncing';
      
      // 检查是否已存在对应的DAG节点
      const existingMappings = this.getMappingsByKgNode(kgNode.id);
      let dagNode = null;

      if (existingMappings.length > 0) {
        // 更新现有节点
        const mapping = existingMappings[0];
        dagNode = dagManager.getNode(mapping.dagNodeId);
        if (dagNode) {
          dagNode = await this.updateDAGNode(dagNode, kgNode, options);
        }
      } else {
        // 创建新节点
        dagNode = await this.createDAGNodeFromKG(kgNode, options);
        dagManager.addNode(dagNode.id, dagNode);
        
        // 创建映射
        const mapping = {
          id: `mapping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          dagNodeId: dagNode.id,
          kgNodeId: kgNode.id,
          confidence: 0.9,
          type: 'direct',
          createdAt: Date.now(),
          metadata: {
            source: 'sync',
            method: 'kg_to_dag',
            score: 0.9
          }
        };
        this.addMapping(mapping);
      }

      const syncResult = {
        success: true,
        direction: 'kg_to_dag',
        kgNodeId: kgNode.id,
        dagNodeId: dagNode?.id,
        timestamp: Date.now(),
        message: 'KG to DAG sync successful'
      };

      this.syncHistory.push(syncResult);
      this.updateSyncStatus(syncResult);
      
      return syncResult;
    } catch (error) {
      const syncResult = {
        success: false,
        direction: 'kg_to_dag',
        kgNodeId: kgNode.id,
        timestamp: Date.now(),
        message: `KG to DAG sync failed: ${error.message}`
      };

      this.syncHistory.push(syncResult);
      this.updateSyncStatus(syncResult);
      
      return syncResult;
    }
  }

  async bidirectionalSync(dagNode, kgNode, dagManager, kgManager, options = {}) {
    const results = [];
    
    // DAG to KG
    const dagToKgResult = await this.syncDAGtoKG(dagNode, kgManager, options);
    results.push(dagToKgResult);
    
    // KG to DAG
    if (dagToKgResult.success && dagToKgResult.kgNodeId) {
      const kgToDagResult = await this.syncKGtoDAG(
        kgManager.getNode(dagToKgResult.kgNodeId),
        dagManager,
        options
      );
      results.push(kgToDagResult);
    }
    
    return {
      success: results.every(r => r.success),
      results: results,
      timestamp: Date.now()
    };
  }

  async batchSync(dagNodes, kgManager, options = {}) {
    const results = [];
    
    for (const dagNode of dagNodes) {
      const result = await this.syncDAGtoKG(dagNode, kgManager, options);
      results.push(result);
    }
    
    return {
      success: results.every(r => r.success),
      results: results,
      timestamp: Date.now()
    };
  }

  async realtimeSync(dagNode, kgManager, options = {}) {
    // 实时同步实现
    return this.syncDAGtoKG(dagNode, kgManager, {
      ...options,
      realtime: true
    });
  }

  async createKGNodeFromDAG(dagNode, options = {}) {
    return {
      id: `kg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.mapDAGTypeToKGType(dagNode.type),
      name: dagNode.topic || '未命名节点',
      description: dagNode.content || '',
      properties: {
        ...(dagNode.metadata || {}),
        source: 'dag',
        dagNodeId: dagNode.id
      },
      relationships: [],
      usage_count: 1,
      last_used: Date.now()
    };
  }

  async createDAGNodeFromKG(kgNode, options = {}) {
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.mapKGTypeToDAGType(kgNode.type),
      topic: kgNode.name || '未命名节点',
      content: kgNode.description || '',
      status: 'completed',
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        ...(kgNode.properties || {}),
        source: 'kg',
        kgNodeId: kgNode.id
      },
      layers: {
        raw: { data: kgNode },
        structured: { entities: [] },
        semantic: { topics: [kgNode.name] },
        knowledge: { facts: [] },
        insight: { recommendations: [] }
      }
    };
  }

  async updateKGNode(kgNode, dagNode, options = {}) {
    return {
      ...kgNode,
      name: dagNode.topic || kgNode.name,
      description: dagNode.content || kgNode.description,
      properties: {
        ...kgNode.properties,
        ...(dagNode.metadata || {}),
        lastSynced: Date.now()
      },
      usage_count: (kgNode.usage_count || 0) + 1,
      last_used: Date.now()
    };
  }

  async updateDAGNode(dagNode, kgNode, options = {}) {
    return {
      ...dagNode,
      topic: kgNode.name || dagNode.topic,
      content: kgNode.description || dagNode.content,
      metadata: {
        ...dagNode.metadata,
        ...(kgNode.properties || {}),
        lastSynced: Date.now()
      },
      updatedAt: Date.now()
    };
  }

  mapDAGTypeToKGType(dagType) {
    const typeMap = {
      task: 'skill',
      memory: 'knowledge',
      conversation: 'dialogue',
      entity: 'entity',
      concept: 'concept'
    };
    return typeMap[dagType] || 'unknown';
  }

  mapKGTypeToDAGType(kgType) {
    const typeMap = {
      skill: 'task',
      knowledge: 'memory',
      dialogue: 'conversation',
      entity: 'entity',
      concept: 'concept'
    };
    return typeMap[kgType] || 'unknown';
  }

  addMapping(mapping) {
    // 实际应用中，这里应该存储到持久化存储
    console.log('添加映射:', mapping);
  }

  getMappingsByDagNode(dagNodeId) {
    // 实际应用中，这里应该从持久化存储中获取
    return [];
  }

  getMappingsByKgNode(kgNodeId) {
    // 实际应用中，这里应该从持久化存储中获取
    return [];
  }

  updateSyncStatus(syncResult) {
    this.syncStatus.lastSyncTime = syncResult.timestamp;
    this.syncStatus.lastSyncStatus = syncResult.success ? 'success' : 'failed';
    this.syncStatus.syncCount++;
    if (!syncResult.success) {
      this.syncStatus.failedSyncs++;
    }
  }

  getSyncStatus() {
    return this.syncStatus;
  }

  getSyncHistory() {
    return this.syncHistory;
  }

  clearSyncHistory() {
    this.syncHistory = [];
  }
}

const syncEngine = new SyncEngine();

module.exports = {
  SyncEngine,
  syncEngine
};
