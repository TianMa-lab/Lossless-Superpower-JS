const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { storageLayer } = require('../storage');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 系统宪章路径
const charterPath = path.join(__dirname, '..', '..', 'SYSTEM_CHARTER.md');

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger配置
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Lossless Superpower API',
      description: 'Lossless Superpower JavaScript Version API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/api/server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 初始化存储层
let storageInitialized = false;

async function initializeStorage() {
  if (!storageInitialized) {
    storageInitialized = await storageLayer.init();
    if (!storageInitialized) {
      console.error('存储层初始化失败，API服务可能无法正常工作');
    }
  }
  return storageInitialized;
}

// 健康检查
/**
 * @swagger
 * /health:
 *   get:
 *     summary: 健康检查
 *     description: 检查API服务是否正常运行
 *     responses:
 *       200:
 *         description: API服务正常
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lossless Superpower API is running' });
});

// 系统宪章API
/**
 * @swagger
 * /api/system/charter:
 *   get:
 *     summary: 获取系统宪章
 *     description: 获取系统的根本大法，定义系统定位和设计原则
 *     responses:
 *       200:
 *         description: 成功获取系统宪章
 */
app.get('/api/system/charter', (req, res) => {
  try {
    if (fs.existsSync(charterPath)) {
      const charter = fs.readFileSync(charterPath, 'utf-8');
      res.status(200).json({
        charter: charter,
        path: charterPath
      });
    } else {
      res.status(404).json({ error: '系统宪章文件不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 记忆管理API
/**
 * @swagger
 * /api/memories:
 *   get:
 *     summary: 获取记忆列表
 *     description: 获取系统中的记忆列表
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 返回的最大记忆数量
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: 偏移量
 *     responses:
 *       200:
 *         description: 成功获取记忆列表
 */
app.get('/api/memories', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const memories = await storageLayer.getMemories(limit, offset);
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/memories/type/{type}:
 *   get:
 *     summary: 按类型获取记忆
 *     description: 根据类型获取系统中的记忆
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: 记忆类型
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 返回的最大记忆数量
 *     responses:
 *       200:
 *         description: 成功获取记忆列表
 */
app.get('/api/memories/type/:type', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const type = req.params.type;
    const limit = parseInt(req.query.limit) || 100;
    const memories = await storageLayer.getMemoriesByType(type, limit);
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/memories:
 *   post:
 *     summary: 添加记忆
 *     description: 向系统添加新的记忆
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *               importance:
 *                 type: integer
 *               tags:
 *                 type: string
 *               metadata:
 *                 type: string
 *     responses:
 *       201:
 *         description: 记忆添加成功
 */
app.post('/api/memories', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const memory = req.body;
    const success = await storageLayer.addMemory(memory);
    if (success) {
      res.status(201).json({ message: '记忆添加成功' });
    } else {
      res.status(500).json({ error: '记忆添加失败' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/memories/{id}:
 *   put:
 *     summary: 更新记忆
 *     description: 更新系统中的记忆
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 记忆ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *               importance:
 *                 type: integer
 *               tags:
 *                 type: string
 *               metadata:
 *                 type: string
 *     responses:
 *       200:
 *         description: 记忆更新成功
 */
app.put('/api/memories/:id', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const id = req.params.id;
    const updates = req.body;
    const success = await storageLayer.updateMemory(id, updates);
    if (success) {
      res.status(200).json({ message: '记忆更新成功' });
    } else {
      res.status(500).json({ error: '记忆更新失败' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/memories/{id}:
 *   delete:
 *     summary: 删除记忆
 *     description: 从系统中删除记忆
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 记忆ID
 *     responses:
 *       200:
 *         description: 记忆删除成功
 */
app.delete('/api/memories/:id', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const id = req.params.id;
    const success = await storageLayer.deleteMemory(id);
    if (success) {
      res.status(200).json({ message: '记忆删除成功' });
    } else {
      res.status(500).json({ error: '记忆删除失败' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 知识图谱API
/**
 * @swagger
 * /api/knowledge:
 *   get:
 *     summary: 获取知识
 *     description: 根据主体和谓词获取知识
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: 知识主体
 *       - in: query
 *         name: predicate
 *         schema:
 *           type: string
 *         description: 知识谓词
 *     responses:
 *       200:
 *         description: 成功获取知识
 */
app.get('/api/knowledge', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const subject = req.query.subject;
    const predicate = req.query.predicate;
    const knowledge = await storageLayer.getKnowledge(subject, predicate);
    res.status(200).json(knowledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/knowledge:
 *   post:
 *     summary: 添加知识
 *     description: 向系统添加新的知识
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               predicate:
 *                 type: string
 *               object:
 *                 type: string
 *               confidence:
 *                 type: number
 *     responses:
 *       201:
 *         description: 知识添加成功
 */
app.post('/api/knowledge', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const { subject, predicate, object, confidence = 1.0 } = req.body;
    const id = await storageLayer.addKnowledge(subject, predicate, object, confidence);
    if (id) {
      res.status(201).json({ message: '知识添加成功', id });
    } else {
      res.status(500).json({ error: '知识添加失败' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户管理API
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取用户列表
 *     description: 获取系统中的用户列表
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 */
app.get('/api/users', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 添加用户
 *     description: 向系统添加新的用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               preferences:
 *                 type: string
 *     responses:
 *       201:
 *         description: 用户添加成功
 */
app.post('/api/users', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const user = req.body;
    const success = await storageLayer.addUser(user);
    if (success) {
      res.status(201).json({ message: '用户添加成功' });
    } else {
      res.status(500).json({ error: '用户添加失败' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 获取用户
 *     description: 根据ID获取用户信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const initialized = await initializeStorage();
    if (!initialized) {
      return res.status(500).json({ error: '存储层初始化失败' });
    }

    const id = req.params.id;
    const user = await storageLayer.getUser(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: '用户不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 系统状态API
/**
 * @swagger
 * /api/system/status:
 *   get:
 *     summary: 获取系统状态
 *     description: 获取系统的当前状态
 *     responses:
 *       200:
 *         description: 成功获取系统状态
 */
app.get('/api/system/status', async (req, res) => {
  try {
    const initialized = await initializeStorage();

    const status = {
      storage_initialized: initialized,
      charter: '见 /api/system/charter 端点获取系统宪章全文',
      fundamental_position: 'Lossless Superpower JS 是 trae CN 的插件系统',
      timestamp: Date.now(),
      version: '1.0.0',
      name: 'Lossless Superpower JS'
    };

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Lossless Superpower API server running at http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

module.exports = app;
