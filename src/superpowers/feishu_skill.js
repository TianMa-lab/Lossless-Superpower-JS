/**
 * 飞书技能模块
 * 将飞书工具注册为技能
 */

const { FeishuTools } = require('./feishu_tools');

class FeishuSkill {
  constructor() {
    this.feishuTools = null;
    this.config = {
      appId: process.env.FEISHU_APP_ID || '',
      appSecret: process.env.FEISHU_APP_SECRET || '',
      tenantAccessToken: process.env.FEISHU_TENANT_ACCESS_TOKEN || ''
    };
  }
  
  /**
   * 初始化飞书技能
   */
  init(config = {}) {
    this.config = {
      ...this.config,
      ...config
    };
    
    this.feishuTools = new FeishuTools(this.config);
    return true;
  }
  
  /**
   * 获取技能信息
   */
  getSkillInfo() {
    return {
      name: 'feishu',
      description: '飞书文档和评论操作技能',
      version: '1.0.0',
      author: 'Lossless Superpower',
      tags: ['feishu', 'document', 'comment', 'productivity'],
      requires: {
        environment: ['FEISHU_APP_ID', 'FEISHU_APP_SECRET']
      }
    };
  }
  
  /**
   * 读取飞书文档
   */
  async readDocument(params) {
    try {
      const { docToken } = params;
      if (!docToken) {
        return { success: false, error: 'docToken is required' };
      }
      
      const content = await this.feishuTools.readDocument(docToken);
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 列出评论
   */
  async listComments(params) {
    try {
      const { fileToken, fileType, isWhole, pageSize, pageToken } = params;
      if (!fileToken) {
        return { success: false, error: 'fileToken is required' };
      }
      
      const result = await this.feishuTools.listComments(fileToken, {
        fileType,
        isWhole,
        pageSize,
        pageToken
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 列出评论回复
   */
  async listCommentReplies(params) {
    try {
      const { fileToken, commentId, fileType, pageSize, pageToken } = params;
      if (!fileToken || !commentId) {
        return { success: false, error: 'fileToken and commentId are required' };
      }
      
      const result = await this.feishuTools.listCommentReplies(fileToken, commentId, {
        fileType,
        pageSize,
        pageToken
      });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 回复评论
   */
  async replyComment(params) {
    try {
      const { fileToken, commentId, content, fileType } = params;
      if (!fileToken || !commentId || !content) {
        return { success: false, error: 'fileToken, commentId, and content are required' };
      }
      
      const result = await this.feishuTools.replyComment(fileToken, commentId, content, fileType);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 添加评论
   */
  async addComment(params) {
    try {
      const { fileToken, content, fileType } = params;
      if (!fileToken || !content) {
        return { success: false, error: 'fileToken and content are required' };
      }
      
      const result = await this.feishuTools.addComment(fileToken, content, fileType);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 获取技能操作
   */
  getOperations() {
    return [
      {
        name: 'feishu_read_document',
        description: '读取飞书文档内容',
        parameters: {
          type: 'object',
          properties: {
            docToken: {
              type: 'string',
              description: '文档token（从文档URL获取）'
            }
          },
          required: ['docToken']
        },
        handler: this.readDocument.bind(this)
      },
      {
        name: 'feishu_list_comments',
        description: '列出飞书文档评论',
        parameters: {
          type: 'object',
          properties: {
            fileToken: {
              type: 'string',
              description: '文件token'
            },
            fileType: {
              type: 'string',
              description: '文件类型，默认为docx',
              default: 'docx'
            },
            isWhole: {
              type: 'boolean',
              description: '是否只返回整文档评论',
              default: false
            },
            pageSize: {
              type: 'integer',
              description: '每页评论数量',
              default: 100
            },
            pageToken: {
              type: 'string',
              description: '分页token'
            }
          },
          required: ['fileToken']
        },
        handler: this.listComments.bind(this)
      },
      {
        name: 'feishu_list_comment_replies',
        description: '列出评论回复',
        parameters: {
          type: 'object',
          properties: {
            fileToken: {
              type: 'string',
              description: '文件token'
            },
            commentId: {
              type: 'string',
              description: '评论ID'
            },
            fileType: {
              type: 'string',
              description: '文件类型，默认为docx',
              default: 'docx'
            },
            pageSize: {
              type: 'integer',
              description: '每页回复数量',
              default: 100
            },
            pageToken: {
              type: 'string',
              description: '分页token'
            }
          },
          required: ['fileToken', 'commentId']
        },
        handler: this.listCommentReplies.bind(this)
      },
      {
        name: 'feishu_reply_comment',
        description: '回复评论',
        parameters: {
          type: 'object',
          properties: {
            fileToken: {
              type: 'string',
              description: '文件token'
            },
            commentId: {
              type: 'string',
              description: '评论ID'
            },
            content: {
              type: 'string',
              description: '回复内容'
            },
            fileType: {
              type: 'string',
              description: '文件类型，默认为docx',
              default: 'docx'
            }
          },
          required: ['fileToken', 'commentId', 'content']
        },
        handler: this.replyComment.bind(this)
      },
      {
        name: 'feishu_add_comment',
        description: '添加评论',
        parameters: {
          type: 'object',
          properties: {
            fileToken: {
              type: 'string',
              description: '文件token'
            },
            content: {
              type: 'string',
              description: '评论内容'
            },
            fileType: {
              type: 'string',
              description: '文件类型，默认为docx',
              default: 'docx'
            }
          },
          required: ['fileToken', 'content']
        },
        handler: this.addComment.bind(this)
      }
    ];
  }
  
  /**
   * 检查技能是否可用
   */
  isAvailable() {
    return FeishuTools.isAvailable() && 
           (this.config.appId && this.config.appSecret || this.config.tenantAccessToken);
  }
}

// 导出模块
module.exports = {
  FeishuSkill
};