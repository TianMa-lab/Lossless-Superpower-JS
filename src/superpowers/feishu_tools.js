/**
 * 飞书工具模块
 * 实现飞书文档读取和评论操作功能
 */

const { Client } = require('@larksuiteoapi/node-sdk');

class FeishuTools {
  constructor(config = {}) {
    this.config = {
      appId: process.env.FEISHU_APP_ID || '',
      appSecret: process.env.FEISHU_APP_SECRET || '',
      tenantAccessToken: process.env.FEISHU_TENANT_ACCESS_TOKEN || '',
      ...config
    };
    
    this.client = null;
    this._initClient();
  }
  
  /**
   * 初始化飞书客户端
   */
  _initClient() {
    if (this.config.appId && this.config.appSecret) {
      this.client = new Client({
        appId: this.config.appId,
        appSecret: this.config.appSecret
      });
    } else if (this.config.tenantAccessToken) {
      this.client = new Client({
        tenantAccessToken: this.config.tenantAccessToken
      });
    }
  }
  
  /**
   * 检查客户端是否初始化
   */
  _checkClient() {
    if (!this.client) {
      throw new Error('飞书客户端未初始化，请提供appId和appSecret或tenantAccessToken');
    }
    return true;
  }
  
  /**
   * 读取飞书文档内容
   * @param {string} docToken - 文档token
   * @returns {Promise<string>} 文档内容
   */
  async readDocument(docToken) {
    this._checkClient();
    
    try {
      const response = await this.client.docx.v1.documents.rawContent({
        path: {
          document_id: docToken
        }
      });
      
      if (response.code !== 0) {
        throw new Error(`读取文档失败: ${response.msg}`);
      }
      
      return response.data.content || '';
    } catch (error) {
      console.error('读取飞书文档失败:', error);
      throw error;
    }
  }
  
  /**
   * 列出文档评论
   * @param {string} fileToken - 文件token
   * @param {object} options - 选项
   * @returns {Promise<object>} 评论列表
   */
  async listComments(fileToken, options = {}) {
    this._checkClient();
    
    try {
      const { 
        fileType = 'docx', 
        isWhole = false, 
        pageSize = 100, 
        pageToken = '' 
      } = options;
      
      const response = await this.client.drive.v1.files.comments.list({
        path: {
          file_token: fileToken
        },
        query: {
          file_type: fileType,
          user_id_type: 'open_id',
          page_size: pageSize.toString(),
          is_whole: isWhole ? 'true' : 'false',
          page_token: pageToken
        }
      });
      
      if (response.code !== 0) {
        throw new Error(`列出评论失败: ${response.msg}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('列出飞书评论失败:', error);
      throw error;
    }
  }
  
  /**
   * 列出评论回复
   * @param {string} fileToken - 文件token
   * @param {string} commentId - 评论ID
   * @param {object} options - 选项
   * @returns {Promise<object>} 回复列表
   */
  async listCommentReplies(fileToken, commentId, options = {}) {
    this._checkClient();
    
    try {
      const { 
        fileType = 'docx', 
        pageSize = 100, 
        pageToken = '' 
      } = options;
      
      const response = await this.client.drive.v1.files.comments.replies.list({
        path: {
          file_token: fileToken,
          comment_id: commentId
        },
        query: {
          file_type: fileType,
          user_id_type: 'open_id',
          page_size: pageSize.toString(),
          page_token: pageToken
        }
      });
      
      if (response.code !== 0) {
        throw new Error(`列出评论回复失败: ${response.msg}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('列出飞书评论回复失败:', error);
      throw error;
    }
  }
  
  /**
   * 回复评论
   * @param {string} fileToken - 文件token
   * @param {string} commentId - 评论ID
   * @param {string} content - 回复内容
   * @param {string} fileType - 文件类型
   * @returns {Promise<object>} 回复结果
   */
  async replyComment(fileToken, commentId, content, fileType = 'docx') {
    this._checkClient();
    
    try {
      const response = await this.client.drive.v1.files.comments.replies.create({
        path: {
          file_token: fileToken,
          comment_id: commentId
        },
        query: {
          file_type: fileType
        },
        data: {
          content: {
            elements: [
              {
                type: 'text_run',
                text_run: { text: content }
              }
            ]
          }
        }
      });
      
      if (response.code !== 0) {
        throw new Error(`回复评论失败: ${response.msg}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('回复飞书评论失败:', error);
      throw error;
    }
  }
  
  /**
   * 添加评论
   * @param {string} fileToken - 文件token
   * @param {string} content - 评论内容
   * @param {string} fileType - 文件类型
   * @returns {Promise<object>} 评论结果
   */
  async addComment(fileToken, content, fileType = 'docx') {
    this._checkClient();
    
    try {
      const response = await this.client.drive.v1.files.newComments.create({
        path: {
          file_token: fileToken
        },
        data: {
          file_type: fileType,
          reply_elements: [
            { type: 'text', text: content }
          ]
        }
      });
      
      if (response.code !== 0) {
        throw new Error(`添加评论失败: ${response.msg}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('添加飞书评论失败:', error);
      throw error;
    }
  }
  
  /**
   * 获取飞书客户端
   */
  getClient() {
    return this.client;
  }
  
  /**
   * 检查飞书SDK是否可用
   */
  static isAvailable() {
    try {
      require('@larksuiteoapi/node-sdk');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 导出模块
module.exports = {
  FeishuTools
};