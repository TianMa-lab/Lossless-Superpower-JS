const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.memoriesFile = path.join(this.dataDir, 'memories.json');
    this.knowledgeFile = path.join(this.dataDir, 'knowledge.json');
    this.usersFile = path.join(this.dataDir, 'users.json');
    
    this.memories = [];
    this.knowledge = [];
    this.users = [];
  }

  async init() {
    try {
      // 确保数据目录存在
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      // 加载数据
      this._loadData();
      console.log('文件存储初始化成功');
      return true;
    } catch (error) {
      console.error('文件存储初始化失败:', error.message);
      return false;
    }
  }

  _loadData() {
    // 加载记忆数据
    if (fs.existsSync(this.memoriesFile)) {
      try {
        const data = fs.readFileSync(this.memoriesFile, 'utf-8');
        this.memories = JSON.parse(data);
      } catch (error) {
        console.error('加载记忆数据失败:', error.message);
        this.memories = [];
      }
    }

    // 加载知识数据
    if (fs.existsSync(this.knowledgeFile)) {
      try {
        const data = fs.readFileSync(this.knowledgeFile, 'utf-8');
        this.knowledge = JSON.parse(data);
      } catch (error) {
        console.error('加载知识数据失败:', error.message);
        this.knowledge = [];
      }
    }

    // 加载用户数据
    if (fs.existsSync(this.usersFile)) {
      try {
        const data = fs.readFileSync(this.usersFile, 'utf-8');
        this.users = JSON.parse(data);
      } catch (error) {
        console.error('加载用户数据失败:', error.message);
        this.users = [];
      }
    }
  }

  _saveData() {
    try {
      // 保存记忆数据
      fs.writeFileSync(this.memoriesFile, JSON.stringify(this.memories, null, 2), 'utf-8');
      
      // 保存知识数据
      fs.writeFileSync(this.knowledgeFile, JSON.stringify(this.knowledge, null, 2), 'utf-8');
      
      // 保存用户数据
      fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('保存数据失败:', error.message);
      return false;
    }
  }

  // 记忆相关操作
  addMemory(memory) {
    return new Promise((resolve, reject) => {
      try {
        this.memories.push(memory);
        this._saveData();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getMemories(limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      try {
        const sortedMemories = [...this.memories].sort((a, b) => b.timestamp - a.timestamp);
        const result = sortedMemories.slice(offset, offset + limit);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMemoriesByType(type, limit = 100) {
    return new Promise((resolve, reject) => {
      try {
        const filteredMemories = this.memories
          .filter(memory => memory.type === type)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        resolve(filteredMemories);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateMemory(id, updates) {
    return new Promise((resolve, reject) => {
      try {
        const index = this.memories.findIndex(memory => memory.id === id);
        if (index >= 0) {
          this.memories[index] = { ...this.memories[index], ...updates };
          this._saveData();
          resolve();
        } else {
          reject(new Error('记忆不存在'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteMemory(id) {
    return new Promise((resolve, reject) => {
      try {
        this.memories = this.memories.filter(memory => memory.id !== id);
        this._saveData();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // 知识图谱相关操作
  addKnowledge(subject, predicate, object, confidence = 1.0) {
    return new Promise((resolve, reject) => {
      try {
        const id = `kg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const knowledgeItem = {
          id,
          subject,
          predicate,
          object,
          confidence,
          timestamp: Date.now()
        };
        this.knowledge.push(knowledgeItem);
        this._saveData();
        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
  }

  getKnowledge(subject, predicate) {
    return new Promise((resolve, reject) => {
      try {
        let result = [...this.knowledge];
        if (subject) {
          result = result.filter(item => item.subject === subject);
        }
        if (predicate) {
          result = result.filter(item => item.predicate === predicate);
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 用户相关操作
  addUser(user) {
    return new Promise((resolve, reject) => {
      try {
        this.users.push(user);
        this._saveData();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      try {
        const user = this.users.find(user => user.id === id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 执行自定义查询（模拟）
  executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      try {
        // 简单的模拟查询
        if (sql.includes('SELECT count(*) as count FROM memories')) {
          resolve([{ count: this.memories.length }]);
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // 关闭存储
  close() {
    return new Promise((resolve) => {
      // 文件存储不需要关闭连接
      console.log('文件存储已关闭');
      resolve();
    });
  }
}

const dbManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  dbManager
};
