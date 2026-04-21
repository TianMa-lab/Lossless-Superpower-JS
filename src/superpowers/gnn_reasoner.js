const { v4: uuidv4 } = require('uuid');

/**
 * 图神经网络基类
 */
class GNN {
  constructor(config = {}) {
    this.hiddenDim = config.hiddenDim || 256;
    this.outputDim = config.outputDim || 128;
    this.numLayers = config.numLayers || 2;
    this.learningRate = config.learningRate || 0.001;
    this.epochs = config.epochs || 100;
    this.batchSize = config.batchSize || 32;
    this.weights = {};
  }

  /**
   * 初始化权重
   * @param {number} inputDim 输入维度
   */
  initializeWeights(inputDim) {
    throw new Error('子类必须实现 initializeWeights 方法');
  }

  /**
   * 前向传播
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 输出特征
   */
  forward(nodeFeatures, adjMatrix) {
    throw new Error('子类必须实现 forward 方法');
  }

  /**
   * 训练模型
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @param {Array} labels 标签
   * @returns {Promise} 训练结果
   */
  async train(nodeFeatures, adjMatrix, labels) {
    throw new Error('子类必须实现 train 方法');
  }

  /**
   * 预测
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 预测结果
   */
  predict(nodeFeatures, adjMatrix) {
    throw new Error('子类必须实现 predict 方法');
  }

  /**
   * 生成随机权重
   * @param {number} inDim 输入维度
   * @param {number} outDim 输出维度
   * @returns {Array} 权重矩阵
   */
  _randomWeights(inDim, outDim) {
    const weights = [];
    for (let i = 0; i < inDim; i++) {
      const row = [];
      for (let j = 0; j < outDim; j++) {
        row.push((Math.random() - 0.5) * 0.1);
      }
      weights.push(row);
    }
    return weights;
  }

  /**
   * 矩阵乘法
   * @param {Array} a 矩阵A
   * @param {Array} b 矩阵B
   * @returns {Array} 乘积矩阵
   */
  _matmul(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      const row = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        row.push(sum);
      }
      result.push(row);
    }
    return result;
  }

  /**
   * 矩阵加法
   * @param {Array} a 矩阵A
   * @param {Array} b 矩阵B
   * @returns {Array} 和矩阵
   */
  _add(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
      const row = [];
      for (let j = 0; j < a[0].length; j++) {
        row.push(a[i][j] + b[i][j]);
      }
      result.push(row);
    }
    return result;
  }

  /**
   * 激活函数
   * @param {Array} x 输入
   * @returns {Array} 激活后的值
   */
  _relu(x) {
    return x.map(row => row.map(val => Math.max(0, val)));
  }

  /**
   * 归一化邻接矩阵
   * @param {Array} adj 邻接矩阵
   * @returns {Array} 归一化后的邻接矩阵
   */
  _normalizeAdj(adj) {
    const n = adj.length;
    const degree = new Array(n).fill(0);

    // 计算度矩阵
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        degree[i] += adj[i][j];
      }
    }

    // 计算度矩阵的逆平方根
    const degreeSqrtInv = degree.map(d => 1 / Math.sqrt(d + 1e-10));

    // 归一化邻接矩阵
    const normalizedAdj = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(degreeSqrtInv[i] * adj[i][j] * degreeSqrtInv[j]);
      }
      normalizedAdj.push(row);
    }

    return normalizedAdj;
  }
}

/**
 * 图卷积网络 (GCN)
 */
class GCN extends GNN {
  /**
   * 初始化权重
   * @param {number} inputDim 输入维度
   */
  initializeWeights(inputDim) {
    this.weights = {
      w1: this._randomWeights(inputDim, this.hiddenDim),
      w2: this._randomWeights(this.hiddenDim, this.outputDim)
    };
  }

  /**
   * 前向传播
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 输出特征
   */
  forward(nodeFeatures, adjMatrix) {
    const normalizedAdj = this._normalizeAdj(adjMatrix);

    // 第一层
    const h1 = this._relu(this._matmul(this._matmul(normalizedAdj, nodeFeatures), this.weights.w1));
    
    // 第二层
    const output = this._matmul(this._matmul(normalizedAdj, h1), this.weights.w2);

    return output;
  }

  /**
   * 训练模型
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @param {Array} labels 标签
   * @returns {Promise} 训练结果
   */
  async train(nodeFeatures, adjMatrix, labels) {
    this.initializeWeights(nodeFeatures[0].length);

    console.log('开始 GCN 训练...');

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      // 前向传播
      const outputs = this.forward(nodeFeatures, adjMatrix);

      // 计算损失（简化版）
      let loss = 0;
      for (let i = 0; i < outputs.length; i++) {
        for (let j = 0; j < outputs[0].length; j++) {
          loss += Math.pow(outputs[i][j] - labels[i][j], 2);
        }
      }

      // 简化的权重更新（实际应该使用反向传播）
      this._updateWeights(loss);

      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${loss.toFixed(4)}`);
      }
    }

    console.log('GCN 训练完成');
    return { success: true };
  }

  /**
   * 更新权重
   * @param {number} loss 损失
   * @private
   */
  _updateWeights(loss) {
    // 简化的权重更新
    for (const key in this.weights) {
      const weights = this.weights[key];
      for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[0].length; j++) {
          weights[i][j] -= this.learningRate * (loss * 0.001);
        }
      }
    }
  }

  /**
   * 预测
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 预测结果
   */
  predict(nodeFeatures, adjMatrix) {
    return this.forward(nodeFeatures, adjMatrix);
  }
}

/**
 * 图注意力网络 (GAT)
 */
class GAT extends GNN {
  constructor(config = {}) {
    super(config);
    this.numHeads = config.numHeads || 4;
  }

  /**
   * 初始化权重
   * @param {number} inputDim 输入维度
   */
  initializeWeights(inputDim) {
    this.weights = {};
    for (let h = 0; h < this.numHeads; h++) {
      this.weights[`w${h}`] = this._randomWeights(inputDim, this.hiddenDim / this.numHeads);
      this.weights[`a${h}`] = this._randomWeights(this.hiddenDim / this.numHeads * 2, 1);
    }
    this.weights['w_out'] = this._randomWeights(this.hiddenDim, this.outputDim);
  }

  /**
   * 前向传播
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 输出特征
   */
  forward(nodeFeatures, adjMatrix) {
    const n = nodeFeatures.length;
    const headOutputs = [];

    // 多头注意力
    for (let h = 0; h < this.numHeads; h++) {
      const wh = this.weights[`w${h}`];
      const ah = this.weights[`a${h}`];

      // 线性变换
      const transformed = this._matmul(nodeFeatures, wh);

      // 计算注意力系数
      const attention = [];
      for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
          if (adjMatrix[i][j] > 0) {
            const cat = [...transformed[i], ...transformed[j]];
            const e = Math.exp(this._dotProduct(cat, ah.flat()));
            row.push(e);
          } else {
            row.push(0);
          }
        }
        // 归一化
        const sum = row.reduce((a, b) => a + b, 0);
        row.forEach((val, idx) => row[idx] = sum > 0 ? val / sum : 0);
        attention.push(row);
      }

      // 加权聚合
      const headOutput = [];
      for (let i = 0; i < n; i++) {
        const h_i = new Array(this.hiddenDim / this.numHeads).fill(0);
        for (let j = 0; j < n; j++) {
          if (attention[i][j] > 0) {
            for (let k = 0; k < h_i.length; k++) {
              h_i[k] += attention[i][j] * transformed[j][k];
            }
          }
        }
        headOutput.push(h_i);
      }
      headOutputs.push(headOutput);
    }

    // 拼接多头输出
    const concatenated = [];
    for (let i = 0; i < n; i++) {
      const vec = [];
      for (const head of headOutputs) {
        vec.push(...head[i]);
      }
      concatenated.push(vec);
    }

    // 输出层
    const output = this._matmul(concatenated, this.weights['w_out']);

    return output;
  }

  /**
   * 点积
   * @param {Array} a 向量a
   * @param {Array} b 向量b
   * @returns {number} 点积结果
   * @private
   */
  _dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  /**
   * 训练模型
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @param {Array} labels 标签
   * @returns {Promise} 训练结果
   */
  async train(nodeFeatures, adjMatrix, labels) {
    this.initializeWeights(nodeFeatures[0].length);

    console.log('开始 GAT 训练...');

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const outputs = this.forward(nodeFeatures, adjMatrix);

      let loss = 0;
      for (let i = 0; i < outputs.length; i++) {
        for (let j = 0; j < outputs[0].length; j++) {
          loss += Math.pow(outputs[i][j] - labels[i][j], 2);
        }
      }

      this._updateWeights(loss);

      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${loss.toFixed(4)}`);
      }
    }

    console.log('GAT 训练完成');
    return { success: true };
  }

  /**
   * 更新权重
   * @param {number} loss 损失
   * @private
   */
  _updateWeights(loss) {
    for (const key in this.weights) {
      const weights = this.weights[key];
      for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[0].length; j++) {
          weights[i][j] -= this.learningRate * (loss * 0.001);
        }
      }
    }
  }

  /**
   * 预测
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 预测结果
   */
  predict(nodeFeatures, adjMatrix) {
    return this.forward(nodeFeatures, adjMatrix);
  }
}

/**
 * 关系图卷积网络 (RGCN)
 */
class RGCN extends GNN {
  constructor(config = {}) {
    super(config);
    this.numRelations = config.numRelations || 10;
  }

  /**
   * 初始化权重
   * @param {number} inputDim 输入维度
   */
  initializeWeights(inputDim) {
    this.weights = {};
    // 为每种关系初始化权重
    for (let r = 0; r < this.numRelations; r++) {
      this.weights[`w_r${r}`] = this._randomWeights(inputDim, this.hiddenDim);
    }
    this.weights['w_self'] = this._randomWeights(inputDim, this.hiddenDim);
    this.weights['w_out'] = this._randomWeights(this.hiddenDim, this.outputDim);
  }

  /**
   * 前向传播
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵（关系特定）
   * @returns {Array} 输出特征
   */
  forward(nodeFeatures, adjMatrix) {
    const n = nodeFeatures.length;
    const h = new Array(n).fill(0).map(() => new Array(this.hiddenDim).fill(0));

    // 自环
    const selfEmbedding = this._matmul(nodeFeatures, this.weights['w_self']);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < this.hiddenDim; j++) {
        h[i][j] += selfEmbedding[i][j];
      }
    }

    // 关系特定的卷积
    for (let r = 0; r < this.numRelations; r++) {
      if (adjMatrix[r]) {
        const normalizedAdj = this._normalizeAdj(adjMatrix[r]);
        const relationEmbedding = this._matmul(this._matmul(normalizedAdj, nodeFeatures), this.weights[`w_r${r}`]);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < this.hiddenDim; j++) {
            h[i][j] += relationEmbedding[i][j];
          }
        }
      }
    }

    // 激活
    const hActivated = this._relu(h);

    // 输出层
    const output = this._matmul(hActivated, this.weights['w_out']);

    return output;
  }

  /**
   * 训练模型
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵（关系特定）
   * @param {Array} labels 标签
   * @returns {Promise} 训练结果
   */
  async train(nodeFeatures, adjMatrix, labels) {
    this.initializeWeights(nodeFeatures[0].length);

    console.log('开始 RGCN 训练...');

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const outputs = this.forward(nodeFeatures, adjMatrix);

      let loss = 0;
      for (let i = 0; i < outputs.length; i++) {
        for (let j = 0; j < outputs[0].length; j++) {
          loss += Math.pow(outputs[i][j] - labels[i][j], 2);
        }
      }

      this._updateWeights(loss);

      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${loss.toFixed(4)}`);
      }
    }

    console.log('RGCN 训练完成');
    return { success: true };
  }

  /**
   * 更新权重
   * @param {number} loss 损失
   * @private
   */
  _updateWeights(loss) {
    for (const key in this.weights) {
      const weights = this.weights[key];
      for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[0].length; j++) {
          weights[i][j] -= this.learningRate * (loss * 0.001);
        }
      }
    }
  }

  /**
   * 预测
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵（关系特定）
   * @returns {Array} 预测结果
   */
  predict(nodeFeatures, adjMatrix) {
    return this.forward(nodeFeatures, adjMatrix);
  }
}

/**
 * 图神经网络推理器
 */
class GNNReasoner {
  constructor(config = {}) {
    this.config = config;
    this.models = new Map();
  }

  /**
   * 创建 GNN 模型
   * @param {string} type 模型类型
   * @param {Object} modelConfig 模型配置
   * @returns {Object} 模型
   */
  createModel(type, modelConfig = {}) {
    let model;
    switch (type) {
      case 'GCN':
        model = new GCN({ ...this.config, ...modelConfig });
        break;
      case 'GAT':
        model = new GAT({ ...this.config, ...modelConfig });
        break;
      case 'RGCN':
        model = new RGCN({ ...this.config, ...modelConfig });
        break;
      default:
        throw new Error(`不支持的 GNN 模型类型: ${type}`);
    }

    const id = uuidv4();
    this.models.set(id, model);
    return { id, model };
  }

  /**
   * 获取模型
   * @param {string} id 模型ID
   * @returns {GNN} 模型
   */
  getModel(id) {
    return this.models.get(id);
  }

  /**
   * 删除模型
   * @param {string} id 模型ID
   */
  deleteModel(id) {
    this.models.delete(id);
  }

  /**
   * 节点分类
   * @param {string} modelId 模型ID
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 分类结果
   */
  async nodeClassification(modelId, nodeFeatures, adjMatrix) {
    const model = this.getModel(modelId);
    if (!model) throw new Error('模型不存在');

    const output = model.predict(nodeFeatures, adjMatrix);
    // 简化的分类结果
    return output.map(row => row.indexOf(Math.max(...row)));
  }

  /**
   * 链接预测
   * @param {string} modelId 模型ID
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @param {Array} edges 边列表
   * @returns {Array} 预测结果
   */
  async linkPrediction(modelId, nodeFeatures, adjMatrix, edges) {
    const model = this.getModel(modelId);
    if (!model) throw new Error('模型不存在');

    const nodeEmbeddings = model.predict(nodeFeatures, adjMatrix);
    const predictions = [];

    for (const [head, tail] of edges) {
      const score = this._calculateEdgeScore(nodeEmbeddings[head], nodeEmbeddings[tail]);
      predictions.push({ head, tail, score });
    }

    return predictions;
  }

  /**
   * 子图嵌入
   * @param {string} modelId 模型ID
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 子图嵌入
   */
  async subgraphEmbedding(modelId, nodeFeatures, adjMatrix) {
    const model = this.getModel(modelId);
    if (!model) throw new Error('模型不存在');

    return model.predict(nodeFeatures, adjMatrix);
  }

  /**
   * 归纳推理
   * @param {string} modelId 模型ID
   * @param {Array} nodeFeatures 节点特征
   * @param {Array} adjMatrix 邻接矩阵
   * @returns {Array} 推理结果
   */
  async inductiveInference(modelId, nodeFeatures, adjMatrix) {
    const model = this.getModel(modelId);
    if (!model) throw new Error('模型不存在');

    return model.predict(nodeFeatures, adjMatrix);
  }

  /**
   * 计算边得分
   * @param {Array} h 头节点嵌入
   * @param {Array} t 尾节点嵌入
   * @returns {number} 得分
   * @private
   */
  _calculateEdgeScore(h, t) {
    let score = 0;
    for (let i = 0; i < h.length; i++) {
      score += h[i] * t[i];
    }
    return score;
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.models.clear();
  }
}

/**
 * 图神经网络推理管理器
 */
class GNNReasonerManager {
  constructor() {
    this.reasoners = new Map();
  }

  /**
   * 创建 GNN 推理器
   * @param {Object} config 配置
   * @returns {Object} 推理器
   */
  createReasoner(config = {}) {
    const reasoner = new GNNReasoner(config);
    const id = uuidv4();
    this.reasoners.set(id, reasoner);
    return { id, reasoner };
  }

  /**
   * 获取 GNN 推理器
   * @param {string} id 推理器ID
   * @returns {GNNReasoner} 推理器
   */
  getReasoner(id) {
    return this.reasoners.get(id);
  }

  /**
   * 删除 GNN 推理器
   * @param {string} id 推理器ID
   */
  deleteReasoner(id) {
    this.reasoners.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    for (const reasoner of this.reasoners.values()) {
      reasoner.cleanup();
    }
    this.reasoners.clear();
  }
}

const gnnReasonerManager = new GNNReasonerManager();

module.exports = {
  GNN,
  GCN,
  GAT,
  RGCN,
  GNNReasoner,
  GNNReasonerManager,
  gnnReasonerManager
};
