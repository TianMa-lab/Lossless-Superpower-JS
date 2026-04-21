const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * 知识图谱嵌入基类
 */
class KGEmbedding {
  constructor(config = {}) {
    this.embeddingDim = config.embeddingDim || 256;
    this.margin = config.margin || 1.0;
    this.learningRate = config.learningRate || 0.001;
    this.batchSize = config.batchSize || 128;
    this.epochs = config.epochs || 1000;
    this.entityEmbeddings = new Map();
    this.relationEmbeddings = new Map();
    this.entities = new Set();
    this.relations = new Set();
  }

  /**
   * 初始化嵌入
   * @param {Array} triplets 三元组数组 [{head, relation, tail}]
   */
  async init(triplets) {
    // 收集实体和关系
    for (const triplet of triplets) {
      this.entities.add(triplet.head);
      this.entities.add(triplet.tail);
      this.relations.add(triplet.relation);
    }

    // 初始化嵌入向量
    this._initializeEmbeddings();
  }

  /**
   * 初始化嵌入向量
   * @private
   */
  _initializeEmbeddings() {
    // 为每个实体初始化随机嵌入
    for (const entity of this.entities) {
      this.entityEmbeddings.set(entity, this._randomVector(this.embeddingDim));
    }

    // 为每个关系初始化随机嵌入
    for (const relation of this.relations) {
      this.relationEmbeddings.set(relation, this._randomVector(this.embeddingDim));
    }
  }

  /**
   * 生成随机向量
   * @param {number} dim 向量维度
   * @returns {Array} 随机向量
   * @private
   */
  _randomVector(dim) {
    const vector = [];
    for (let i = 0; i < dim; i++) {
      vector.push((Math.random() - 0.5) * 2); // [-1, 1] 范围
    }
    return vector;
  }

  /**
   * 训练嵌入
   * @param {Array} triplets 三元组数组
   * @returns {Promise} 训练结果
   */
  async train(triplets) {
    throw new Error('子类必须实现 train 方法');
  }

  /**
   * 链接预测
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @returns {number} 预测得分
   */
  predictLink(head, relation, tail) {
    throw new Error('子类必须实现 predictLink 方法');
  }

  /**
   * 知识图谱补全
   * @param {number} topK 前K个预测
   * @returns {Array} 预测结果
   */
  async completeGraph(topK = 10) {
    throw new Error('子类必须实现 completeGraph 方法');
  }

  /**
   * 获取实体嵌入
   * @param {string} entity 实体
   * @returns {Array} 嵌入向量
   */
  getEntityEmbedding(entity) {
    return this.entityEmbeddings.get(entity) || this._randomVector(this.embeddingDim);
  }

  /**
   * 获取关系嵌入
   * @param {string} relation 关系
   * @returns {Array} 嵌入向量
   */
  getRelationEmbedding(relation) {
    return this.relationEmbeddings.get(relation) || this._randomVector(this.embeddingDim);
  }

  /**
   * 保存嵌入
   * @param {string} filePath 保存路径
   */
  save(filePath) {
    const data = {
      entityEmbeddings: Object.fromEntries(this.entityEmbeddings),
      relationEmbeddings: Object.fromEntries(this.relationEmbeddings),
      config: {
        embeddingDim: this.embeddingDim,
        margin: this.margin,
        learningRate: this.learningRate
      }
    };

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('嵌入已保存到:', filePath);
  }

  /**
   * 加载嵌入
   * @param {string} filePath 加载路径
   */
  load(filePath) {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      this.entityEmbeddings = new Map(Object.entries(data.entityEmbeddings));
      this.relationEmbeddings = new Map(Object.entries(data.relationEmbeddings));
      this.embeddingDim = data.config.embeddingDim;
      this.margin = data.config.margin;
      this.learningRate = data.config.learningRate;
      console.log('嵌入已从:', filePath, '加载');
    }
  }

  /**
   * 向量加法
   * @param {Array} v1 向量1
   * @param {Array} v2 向量2
   * @returns {Array} 结果向量
   */
  _addVectors(v1, v2) {
    const result = [];
    for (let i = 0; i < v1.length; i++) {
      result.push(v1[i] + v2[i]);
    }
    return result;
  }

  /**
   * 向量减法
   * @param {Array} v1 向量1
   * @param {Array} v2 向量2
   * @returns {Array} 结果向量
   */
  _subtractVectors(v1, v2) {
    const result = [];
    for (let i = 0; i < v1.length; i++) {
      result.push(v1[i] - v2[i]);
    }
    return result;
  }

  /**
   * 向量点积
   * @param {Array} v1 向量1
   * @param {Array} v2 向量2
   * @returns {number} 点积结果
   */
  _dotProduct(v1, v2) {
    let result = 0;
    for (let i = 0; i < v1.length; i++) {
      result += v1[i] * v2[i];
    }
    return result;
  }

  /**
   * 向量范数
   * @param {Array} v 向量
   * @returns {number} 范数
   */
  _norm(v) {
    let sum = 0;
    for (const value of v) {
      sum += value * value;
    }
    return Math.sqrt(sum);
  }

  /**
   * 归一化向量
   * @param {Array} v 向量
   * @returns {Array} 归一化后的向量
   */
  _normalize(v) {
    const norm = this._norm(v);
    if (norm === 0) return v;
    return v.map(value => value / norm);
  }

  /**
   * 生成负样本
   * @param {Array} triplets 正样本三元组
   * @returns {Array} 负样本三元组
   */
  _generateNegativeSamples(triplets) {
    const negativeSamples = [];
    const entitiesArray = Array.from(this.entities);

    for (const triplet of triplets) {
      // 替换头实体
      const headEntity = entitiesArray[Math.floor(Math.random() * entitiesArray.length)];
      negativeSamples.push({
        head: headEntity,
        relation: triplet.relation,
        tail: triplet.tail,
        label: 0
      });

      // 替换尾实体
      const tailEntity = entitiesArray[Math.floor(Math.random() * entitiesArray.length)];
      negativeSamples.push({
        head: triplet.head,
        relation: triplet.relation,
        tail: tailEntity,
        label: 0
      });
    }

    return negativeSamples;
  }
}

/**
 * TransE 算法
 * 原理：将关系视为实体间的翻译向量
 */
class TransE extends KGEmbedding {
  /**
   * 训练嵌入
   * @param {Array} triplets 三元组数组
   * @returns {Promise} 训练结果
   */
  async train(triplets) {
    await this.init(triplets);
    const positiveSamples = triplets.map(t => ({ ...t, label: 1 }));

    console.log(`开始 TransE 训练，实体数: ${this.entities.size}, 关系数: ${this.relations.size}`);

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const negativeSamples = this._generateNegativeSamples(triplets);
      const batch = [...positiveSamples, ...negativeSamples];
      
      // 随机打乱批次
      this._shuffleArray(batch);

      let totalLoss = 0;

      for (let i = 0; i < batch.length; i += this.batchSize) {
        const batchSamples = batch.slice(i, i + this.batchSize);
        const batchLoss = this._trainBatch(batchSamples);
        totalLoss += batchLoss;
      }

      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${totalLoss.toFixed(4)}`);
      }
    }

    console.log('TransE 训练完成');
    return { success: true };
  }

  /**
   * 训练批次
   * @param {Array} batch 批次样本
   * @returns {number} 批次损失
   * @private
   */
  _trainBatch(batch) {
    let loss = 0;

    for (const sample of batch) {
      const h = this.getEntityEmbedding(sample.head);
      const r = this.getRelationEmbedding(sample.relation);
      const t = this.getEntityEmbedding(sample.tail);

      // 计算得分
      const score = this.scoreFunction(h, r, t);

      // 计算损失
      if (sample.label === 1) {
        // 正样本：希望得分尽可能大
        loss += Math.max(0, this.margin - score);
      } else {
        // 负样本：希望得分尽可能小
        loss += Math.max(0, score + this.margin);
      }

      // 更新嵌入
      if (sample.label === 1) {
        // 正样本：h + r 应该接近 t
        const hNew = this._addVectors(h, this._multiplyVector(r, this.learningRate));
        const rNew = this._addVectors(r, this._multiplyVector(this._subtractVectors(t, h), this.learningRate));
        const tNew = this._addVectors(t, this._multiplyVector(this._subtractVectors(h, t), this.learningRate));

        this.entityEmbeddings.set(sample.head, this._normalize(hNew));
        this.relationEmbeddings.set(sample.relation, this._normalize(rNew));
        this.entityEmbeddings.set(sample.tail, this._normalize(tNew));
      } else {
        // 负样本：h + r 应该远离 t
        const hNew = this._addVectors(h, this._multiplyVector(r, -this.learningRate));
        const rNew = this._addVectors(r, this._multiplyVector(this._subtractVectors(t, h), -this.learningRate));
        const tNew = this._addVectors(t, this._multiplyVector(this._subtractVectors(h, t), -this.learningRate));

        this.entityEmbeddings.set(sample.head, this._normalize(hNew));
        this.relationEmbeddings.set(sample.relation, this._normalize(rNew));
        this.entityEmbeddings.set(sample.tail, this._normalize(tNew));
      }
    }

    return loss;
  }

  /**
   * 计算得分
   * @param {Array} h 头实体嵌入
   * @param {Array} r 关系嵌入
   * @param {Array} t 尾实体嵌入
   * @returns {number} 得分
   */
  scoreFunction(h, r, t) {
    const hPlusR = this._addVectors(h, r);
    const distance = this._norm(this._subtractVectors(hPlusR, t));
    return -distance; // 得分越高越好
  }

  /**
   * 链接预测
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @returns {number} 预测得分
   */
  predictLink(head, relation, tail) {
    const h = this.getEntityEmbedding(head);
    const r = this.getRelationEmbedding(relation);
    const t = this.getEntityEmbedding(tail);
    return this.scoreFunction(h, r, t);
  }

  /**
   * 知识图谱补全
   * @param {number} topK 前K个预测
   * @returns {Array} 预测结果
   */
  async completeGraph(topK = 10) {
    const predictions = [];
    const entitiesArray = Array.from(this.entities);
    const relationsArray = Array.from(this.relations);

    // 生成所有可能的三元组
    for (const head of entitiesArray) {
      for (const relation of relationsArray) {
        for (const tail of entitiesArray) {
          if (head !== tail) {
            const score = this.predictLink(head, relation, tail);
            predictions.push({
              head,
              relation,
              tail,
              score
            });
          }
        }
      }
    }

    // 按得分排序并返回前K个
    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, topK);
  }

  /**
   * 向量乘法
   * @param {Array} v 向量
   * @param {number} scalar 标量
   * @returns {Array} 结果向量
   * @private
   */
  _multiplyVector(v, scalar) {
    return v.map(value => value * scalar);
  }

  /**
   * 打乱数组
   * @param {Array} array 数组
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

/**
 * RotatE 算法
 * 原理：将关系视为复数空间中的旋转
 */
class RotatE extends KGEmbedding {
  /**
   * 训练嵌入
   * @param {Array} triplets 三元组数组
   * @returns {Promise} 训练结果
   */
  async train(triplets) {
    await this.init(triplets);
    const positiveSamples = triplets.map(t => ({ ...t, label: 1 }));

    console.log(`开始 RotatE 训练，实体数: ${this.entities.size}, 关系数: ${this.relations.size}`);

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const negativeSamples = this._generateNegativeSamples(triplets);
      const batch = [...positiveSamples, ...negativeSamples];
      
      this._shuffleArray(batch);

      let totalLoss = 0;

      for (let i = 0; i < batch.length; i += this.batchSize) {
        const batchSamples = batch.slice(i, i + this.batchSize);
        const batchLoss = this._trainBatch(batchSamples);
        totalLoss += batchLoss;
      }

      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${totalLoss.toFixed(4)}`);
      }
    }

    console.log('RotatE 训练完成');
    return { success: true };
  }

  /**
   * 训练批次
   * @param {Array} batch 批次样本
   * @returns {number} 批次损失
   * @private
   */
  _trainBatch(batch) {
    let loss = 0;

    for (const sample of batch) {
      const h = this.getEntityEmbedding(sample.head);
      const r = this.getRelationEmbedding(sample.relation);
      const t = this.getEntityEmbedding(sample.tail);

      // 计算得分
      const score = this.scoreFunction(h, r, t);

      // 计算损失
      if (sample.label === 1) {
        loss += Math.max(0, this.margin - score);
      } else {
        loss += Math.max(0, score + this.margin);
      }

      // 更新嵌入（简化版）
      if (sample.label === 1) {
        const hNew = this._addVectors(h, this._multiplyVector(this._rotate(h, r), this.learningRate));
        const rNew = this._addVectors(r, this._multiplyVector(this._subtractVectors(t, this._rotate(h, r)), this.learningRate));
        const tNew = this._addVectors(t, this._multiplyVector(this._subtractVectors(this._rotate(h, r), t), this.learningRate));

        this.entityEmbeddings.set(sample.head, this._normalize(hNew));
        this.relationEmbeddings.set(sample.relation, this._normalize(rNew));
        this.entityEmbeddings.set(sample.tail, this._normalize(tNew));
      }
    }

    return loss;
  }

  /**
   * 计算得分
   * @param {Array} h 头实体嵌入
   * @param {Array} r 关系嵌入
   * @param {Array} t 尾实体嵌入
   * @returns {number} 得分
   */
  scoreFunction(h, r, t) {
    const rotated = this._rotate(h, r);
    const distance = this._norm(this._subtractVectors(rotated, t));
    return -distance;
  }

  /**
   * 旋转操作
   * @param {Array} embedding 实体嵌入
   * @param {Array} rotation 关系旋转
   * @returns {Array} 旋转后的嵌入
   * @private
   */
  _rotate(embedding, rotation) {
    // 简化版旋转：使用角度旋转
    const result = [];
    for (let i = 0; i < embedding.length; i++) {
      // 计算旋转角度
      const angle = rotation[i] * Math.PI;
      // 旋转操作
      result.push(embedding[i] * Math.cos(angle) - embedding[(i + 1) % embedding.length] * Math.sin(angle));
    }
    return result;
  }

  /**
   * 链接预测
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @returns {number} 预测得分
   */
  predictLink(head, relation, tail) {
    const h = this.getEntityEmbedding(head);
    const r = this.getRelationEmbedding(relation);
    const t = this.getEntityEmbedding(tail);
    return this.scoreFunction(h, r, t);
  }

  /**
   * 知识图谱补全
   * @param {number} topK 前K个预测
   * @returns {Array} 预测结果
   */
  async completeGraph(topK = 10) {
    const predictions = [];
    const entitiesArray = Array.from(this.entities);
    const relationsArray = Array.from(this.relations);

    for (const head of entitiesArray) {
      for (const relation of relationsArray) {
        for (const tail of entitiesArray) {
          if (head !== tail) {
            const score = this.predictLink(head, relation, tail);
            predictions.push({
              head,
              relation,
              tail,
              score
            });
          }
        }
      }
    }

    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, topK);
  }

  /**
   * 向量乘法
   * @param {Array} v 向量
   * @param {number} scalar 标量
   * @returns {Array} 结果向量
   * @private
   */
  _multiplyVector(v, scalar) {
    return v.map(value => value * scalar);
  }

  /**
   * 打乱数组
   * @param {Array} array 数组
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

/**
 * ComplEx 算法
 * 原理：在复数空间中分解知识图谱
 */
class ComplEx extends KGEmbedding {
  /**
   * 训练嵌入
   * @param {Array} triplets 三元组数组
   * @returns {Promise} 训练结果
   */
  async train(triplets) {
    await this.init(triplets);
    const positiveSamples = triplets.map(t => ({ ...t, label: 1 }));

    console.log(`开始 ComplEx 训练，实体数: ${this.entities.size}, 关系数: ${this.relations.size}`);

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const negativeSamples = this._generateNegativeSamples(triplets);
      const batch = [...positiveSamples, ...negativeSamples];
      
      this._shuffleArray(batch);

      let totalLoss = 0;

      for (let i = 0; i < batch.length; i += this.batchSize) {
        const batchSamples = batch.slice(i, i + this.batchSize);
        const batchLoss = this._trainBatch(batchSamples);
        totalLoss += batchLoss;
      }

      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${totalLoss.toFixed(4)}`);
      }
    }

    console.log('ComplEx 训练完成');
    return { success: true };
  }

  /**
   * 训练批次
   * @param {Array} batch 批次样本
   * @returns {number} 批次损失
   * @private
   */
  _trainBatch(batch) {
    let loss = 0;

    for (const sample of batch) {
      const h = this.getEntityEmbedding(sample.head);
      const r = this.getRelationEmbedding(sample.relation);
      const t = this.getEntityEmbedding(sample.tail);

      // 计算得分
      const score = this.scoreFunction(h, r, t);

      // 计算损失（使用 sigmoid 损失）
      const sigmoidScore = 1 / (1 + Math.exp(-score));
      if (sample.label === 1) {
        loss += -Math.log(sigmoidScore);
      } else {
        loss += -Math.log(1 - sigmoidScore);
      }

      // 更新嵌入（简化版）
      if (sample.label === 1) {
        const hNew = this._addVectors(h, this._multiplyVector(r, this.learningRate));
        const rNew = this._addVectors(r, this._multiplyVector(this._elementwiseMultiply(h, t), this.learningRate));
        const tNew = this._addVectors(t, this._multiplyVector(this._elementwiseMultiply(h, r), this.learningRate));

        this.entityEmbeddings.set(sample.head, this._normalize(hNew));
        this.relationEmbeddings.set(sample.relation, this._normalize(rNew));
        this.entityEmbeddings.set(sample.tail, this._normalize(tNew));
      }
    }

    return loss;
  }

  /**
   * 计算得分
   * @param {Array} h 头实体嵌入
   * @param {Array} r 关系嵌入
   * @param {Array} t 尾实体嵌入
   * @returns {number} 得分
   */
  scoreFunction(h, r, t) {
    // 简化版 ComplEx 得分计算
    let score = 0;
    for (let i = 0; i < h.length; i++) {
      score += h[i] * r[i] * t[i];
    }
    return score;
  }

  /**
   * 链接预测
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @returns {number} 预测得分
   */
  predictLink(head, relation, tail) {
    const h = this.getEntityEmbedding(head);
    const r = this.getRelationEmbedding(relation);
    const t = this.getEntityEmbedding(tail);
    return this.scoreFunction(h, r, t);
  }

  /**
   * 知识图谱补全
   * @param {number} topK 前K个预测
   * @returns {Array} 预测结果
   */
  async completeGraph(topK = 10) {
    const predictions = [];
    const entitiesArray = Array.from(this.entities);
    const relationsArray = Array.from(this.relations);

    for (const head of entitiesArray) {
      for (const relation of relationsArray) {
        for (const tail of entitiesArray) {
          if (head !== tail) {
            const score = this.predictLink(head, relation, tail);
            predictions.push({
              head,
              relation,
              tail,
              score
            });
          }
        }
      }
    }

    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, topK);
  }

  /**
   * 元素级乘法
   * @param {Array} v1 向量1
   * @param {Array} v2 向量2
   * @returns {Array} 结果向量
   * @private
   */
  _elementwiseMultiply(v1, v2) {
    const result = [];
    for (let i = 0; i < v1.length; i++) {
      result.push(v1[i] * v2[i]);
    }
    return result;
  }

  /**
   * 向量乘法
   * @param {Array} v 向量
   * @param {number} scalar 标量
   * @returns {Array} 结果向量
   * @private
   */
  _multiplyVector(v, scalar) {
    return v.map(value => value * scalar);
  }

  /**
   * 打乱数组
   * @param {Array} array 数组
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

/**
 * TuckER 算法
 * 原理：使用 Tucker 分解进行知识图谱嵌入
 */
class TuckER extends KGEmbedding {
  constructor(config = {}) {
    super(config);
    this.coreTensor = null; // 核心张量
  }

  /**
   * 初始化嵌入
   * @param {Array} triplets 三元组数组
   */
  async init(triplets) {
    super.init(triplets);
    // 初始化核心张量
    this.coreTensor = this._initializeCoreTensor();
  }

  /**
   * 初始化核心张量
   * @returns {Array} 核心张量
   * @private
   */
  _initializeCoreTensor() {
    // 简化版核心张量
    const tensor = [];
    for (let i = 0; i < this.embeddingDim; i++) {
      const matrix = [];
      for (let j = 0; j < this.embeddingDim; j++) {
        const vector = [];
        for (let k = 0; k < this.embeddingDim; k++) {
          vector.push((Math.random() - 0.5) * 0.1);
        }
        matrix.push(vector);
      }
      tensor.push(matrix);
    }
    return tensor;
  }

  /**
   * 训练嵌入
   * @param {Array} triplets 三元组数组
   * @returns {Promise} 训练结果
   */
  async train(triplets) {
    await this.init(triplets);
    const positiveSamples = triplets.map(t => ({ ...t, label: 1 }));

    console.log(`开始 TuckER 训练，实体数: ${this.entities.size}, 关系数: ${this.relations.size}`);

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      const negativeSamples = this._generateNegativeSamples(triplets);
      const batch = [...positiveSamples, ...negativeSamples];
      
      this._shuffleArray(batch);

      let totalLoss = 0;

      for (let i = 0; i < batch.length; i += this.batchSize) {
        const batchSamples = batch.slice(i, i + this.batchSize);
        const batchLoss = this._trainBatch(batchSamples);
        totalLoss += batchLoss;
      }

      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}/${this.epochs}, Loss: ${totalLoss.toFixed(4)}`);
      }
    }

    console.log('TuckER 训练完成');
    return { success: true };
  }

  /**
   * 训练批次
   * @param {Array} batch 批次样本
   * @returns {number} 批次损失
   * @private
   */
  _trainBatch(batch) {
    let loss = 0;

    for (const sample of batch) {
      const h = this.getEntityEmbedding(sample.head);
      const r = this.getRelationEmbedding(sample.relation);
      const t = this.getEntityEmbedding(sample.tail);

      // 计算得分
      const score = this.scoreFunction(h, r, t);

      // 计算损失
      if (sample.label === 1) {
        loss += Math.max(0, this.margin - score);
      } else {
        loss += Math.max(0, score + this.margin);
      }

      // 更新嵌入（简化版）
      if (sample.label === 1) {
        const hNew = this._addVectors(h, this._multiplyVector(r, this.learningRate));
        const rNew = this._addVectors(r, this._multiplyVector(t, this.learningRate));
        const tNew = this._addVectors(t, this._multiplyVector(h, this.learningRate));

        this.entityEmbeddings.set(sample.head, this._normalize(hNew));
        this.relationEmbeddings.set(sample.relation, this._normalize(rNew));
        this.entityEmbeddings.set(sample.tail, this._normalize(tNew));
      }
    }

    return loss;
  }

  /**
   * 计算得分
   * @param {Array} h 头实体嵌入
   * @param {Array} r 关系嵌入
   * @param {Array} t 尾实体嵌入
   * @returns {number} 得分
   */
  scoreFunction(h, r, t) {
    // 简化版 TuckER 得分计算
    let score = 0;
    for (let i = 0; i < this.embeddingDim; i++) {
      for (let j = 0; j < this.embeddingDim; j++) {
        for (let k = 0; k < this.embeddingDim; k++) {
          score += h[i] * this.coreTensor[i][j][k] * r[j] * t[k];
        }
      }
    }
    return score;
  }

  /**
   * 链接预测
   * @param {string} head 头实体
   * @param {string} relation 关系
   * @param {string} tail 尾实体
   * @returns {number} 预测得分
   */
  predictLink(head, relation, tail) {
    const h = this.getEntityEmbedding(head);
    const r = this.getRelationEmbedding(relation);
    const t = this.getEntityEmbedding(tail);
    return this.scoreFunction(h, r, t);
  }

  /**
   * 知识图谱补全
   * @param {number} topK 前K个预测
   * @returns {Array} 预测结果
   */
  async completeGraph(topK = 10) {
    const predictions = [];
    const entitiesArray = Array.from(this.entities);
    const relationsArray = Array.from(this.relations);

    for (const head of entitiesArray) {
      for (const relation of relationsArray) {
        for (const tail of entitiesArray) {
          if (head !== tail) {
            const score = this.predictLink(head, relation, tail);
            predictions.push({
              head,
              relation,
              tail,
              score
            });
          }
        }
      }
    }

    predictions.sort((a, b) => b.score - a.score);
    return predictions.slice(0, topK);
  }

  /**
   * 向量乘法
   * @param {Array} v 向量
   * @param {number} scalar 标量
   * @returns {Array} 结果向量
   * @private
   */
  _multiplyVector(v, scalar) {
    return v.map(value => value * scalar);
  }

  /**
   * 打乱数组
   * @param {Array} array 数组
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

/**
 * 知识图谱嵌入管理器
 */
class KGEmbeddingManager {
  constructor() {
    this.embeddings = new Map();
  }

  /**
   * 创建嵌入模型
   * @param {string} type 嵌入类型
   * @param {Object} config 配置
   * @returns {KGEmbedding} 嵌入模型
   */
  createEmbedding(type, config = {}) {
    let embedding;
    switch (type) {
      case 'TransE':
        embedding = new TransE(config);
        break;
      case 'RotatE':
        embedding = new RotatE(config);
        break;
      case 'ComplEx':
        embedding = new ComplEx(config);
        break;
      case 'TuckER':
        embedding = new TuckER(config);
        break;
      default:
        throw new Error(`不支持的嵌入类型: ${type}`);
    }

    const id = uuidv4();
    this.embeddings.set(id, embedding);
    return { id, embedding };
  }

  /**
   * 获取嵌入模型
   * @param {string} id 模型ID
   * @returns {KGEmbedding} 嵌入模型
   */
  getEmbedding(id) {
    return this.embeddings.get(id);
  }

  /**
   * 删除嵌入模型
   * @param {string} id 模型ID
   */
  deleteEmbedding(id) {
    this.embeddings.delete(id);
  }

  /**
   * 清理资源
   */
  cleanup() {
    this.embeddings.clear();
  }
}

const kgEmbeddingManager = new KGEmbeddingManager();

module.exports = {
  KGEmbedding,
  TransE,
  RotatE,
  ComplEx,
  TuckER,
  KGEmbeddingManager,
  kgEmbeddingManager
};
