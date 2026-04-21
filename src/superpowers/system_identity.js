const { permanentMemorySystem } = require('./permanent_memory');

class SystemIdentityManager {
  constructor() {
    this.identityKey = 'system_identity';
    this.identityType = 'system';
    this.identityImportance = 5; // 最高重要性
  }

  async init() {
    try {
      // 初始化永久记忆系统
      const memoryInitialized = await permanentMemorySystem.init();
      if (!memoryInitialized) {
        console.error('系统定位管理初始化失败：永久记忆系统初始化失败');
        return false;
      }

      // 确保系统定位信息存在
      await this.ensureIdentity();

      console.log('系统定位管理初始化成功');
      return true;
    } catch (error) {
      console.error('系统定位管理初始化失败:', error.message);
      return false;
    }
  }

  // 确保系统定位信息存在
  async ensureIdentity() {
    try {
      // 搜索现有的定位信息
      const existingIdentities = await permanentMemorySystem.searchMemories(this.identityKey);
      
      if (existingIdentities.length === 0) {
        // 如果不存在，创建系统定位信息
        await this.setIdentity('trae CN 的插件');
        console.log('系统定位信息已创建');
      } else {
        console.log('系统定位信息已存在');
      }
    } catch (error) {
      console.error('确保系统定位信息失败:', error.message);
    }
  }

  // 设置系统定位
  async setIdentity(identity) {
    try {
      const content = `系统定位: ${identity}`;
      const metadata = {
        key: this.identityKey,
        value: identity,
        type: this.identityType,
        importance: this.identityImportance
      };

      const memoryId = await permanentMemorySystem.addMemory(
        content,
        this.identityType,
        this.identityImportance,
        this.identityKey,
        metadata
      );

      return memoryId;
    } catch (error) {
      console.error('设置系统定位失败:', error.message);
      return null;
    }
  }

  // 获取系统定位
  async getIdentity() {
    try {
      // 搜索定位信息
      const identities = await permanentMemorySystem.searchMemories(this.identityKey);
      
      if (identities.length > 0) {
        // 按时间戳排序，获取最新的定位信息
        const latestIdentity = identities.sort((a, b) => b.timestamp - a.timestamp)[0];
        
        // 解析定位信息
        const content = latestIdentity.content;
        const match = content.match(/系统定位: (.*)/);
        if (match) {
          return match[1];
        }
      }
      
      return null;
    } catch (error) {
      console.error('获取系统定位失败:', error.message);
      return null;
    }
  }

  // 更新系统定位
  async updateIdentity(identity) {
    try {
      // 先删除旧的定位信息
      await this.clearOldIdentities();
      
      // 添加新的定位信息
      return await this.setIdentity(identity);
    } catch (error) {
      console.error('更新系统定位失败:', error.message);
      return null;
    }
  }

  // 清除旧的定位信息
  async clearOldIdentities() {
    try {
      const identities = await permanentMemorySystem.searchMemories(this.identityKey);
      
      for (const identity of identities) {
        // 这里可以实现删除逻辑，但为了安全起见，我们暂时只添加新的定位信息
        // 让旧的定位信息自然过期
      }
    } catch (error) {
      console.error('清除旧的定位信息失败:', error.message);
    }
  }

  // 获取系统定位上下文
  async getIdentityContext() {
    try {
      const identity = await this.getIdentity();
      if (identity) {
        return {
          identity: identity,
          timestamp: Date.now(),
          importance: this.identityImportance
        };
      }
      return null;
    } catch (error) {
      console.error('获取系统定位上下文失败:', error.message);
      return null;
    }
  }

  // 在每次对话开始时检查定位
  async checkIdentity() {
    try {
      const identity = await this.getIdentity();
      if (!identity) {
        // 如果定位信息不存在，重新设置
        await this.setIdentity('trae CN 的插件');
        console.log('系统定位已重置');
      }
      return identity || 'trae CN 的插件';
    } catch (error) {
      console.error('检查系统定位失败:', error.message);
      return 'trae CN 的插件';
    }
  }
}

const systemIdentityManager = new SystemIdentityManager();

module.exports = {
  SystemIdentityManager,
  systemIdentityManager
};
