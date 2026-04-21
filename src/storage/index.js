const { dbManager } = require('./db/db_manager');

class StorageLayer {
  constructor() {
    this.dbManager = dbManager;
  }

  async init() {
    try {
      // 初始化数据库
      const dbInitResult = await this.dbManager.init();
      if (!dbInitResult) {
        console.error('存储层初始化失败：数据库初始化失败');
        return false;
      }

      console.log('存储层初始化成功');
      return true;
    } catch (error) {
      console.error('存储层初始化失败:', error.message);
      return false;
    }
  }

  // 记忆相关操作
  async addMemory(memory) {
    try {
      if (!memory.id) {
        memory.id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      if (!memory.timestamp) {
        memory.timestamp = Date.now();
      }
      
      await this.dbManager.addMemory(memory);
      return true;
    } catch (error) {
      console.error('添加记忆失败:', error.message);
      return false;
    }
  }

  async getMemories(limit = 100, offset = 0) {
    try {
      const memories = await this.dbManager.getMemories(limit, offset);
      return memories;
    } catch (error) {
      console.error('获取记忆失败:', error.message);
      return [];
    }
  }

  async getMemoriesByType(type, limit = 100) {
    try {
      const memories = await this.dbManager.getMemoriesByType(type, limit);
      return memories;
    } catch (error) {
      console.error('获取记忆失败:', error.message);
      return [];
    }
  }

  async updateMemory(id, updates) {
    try {
      await this.dbManager.updateMemory(id, updates);
      return true;
    } catch (error) {
      console.error('更新记忆失败:', error.message);
      return false;
    }
  }

  async deleteMemory(id) {
    try {
      await this.dbManager.deleteMemory(id);
      return true;
    } catch (error) {
      console.error('删除记忆失败:', error.message);
      return false;
    }
  }

  // 知识图谱相关操作
  async addKnowledge(subject, predicate, object, confidence = 1.0) {
    try {
      const id = await this.dbManager.addKnowledge(subject, predicate, object, confidence);
      return id;
    } catch (error) {
      console.error('添加知识失败:', error.message);
      return null;
    }
  }

  async getKnowledge(subject, predicate) {
    try {
      const knowledge = await this.dbManager.getKnowledge(subject, predicate);
      return knowledge;
    } catch (error) {
      console.error('获取知识失败:', error.message);
      return [];
    }
  }

  // 用户相关操作
  async addUser(user) {
    try {
      if (!user.id) {
        user.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      await this.dbManager.addUser(user);
      return true;
    } catch (error) {
      console.error('添加用户失败:', error.message);
      return false;
    }
  }

  async getUser(id) {
    try {
      const user = await this.dbManager.getUser(id);
      return user;
    } catch (error) {
      console.error('获取用户失败:', error.message);
      return null;
    }
  }

  // 执行自定义查询
  async executeQuery(sql, params = []) {
    try {
      const result = await this.dbManager.executeQuery(sql, params);
      return result;
    } catch (error) {
      console.error('执行查询失败:', error.message);
      return [];
    }
  }

  // 关闭存储层
  async close() {
    try {
      await this.dbManager.close();
      console.log('存储层已关闭');
      return true;
    } catch (error) {
      console.error('关闭存储层失败:', error.message);
      return false;
    }
  }
}

const storageLayer = new StorageLayer();

module.exports = {
  StorageLayer,
  storageLayer
};
