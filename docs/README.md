# Lossless Superpower - 无损超能

**LSP** - 智能双模型路由系统，实现云端大脑与本地小脑的无缝切换。

## 简介

Lossless Superpower 是一个智能的 AI 模型路由系统，通过"大脑+小脑"架构实现：

- **无缝切换**：云端模型与本地模型智能切换
- **故障转移**：自动降级到备用模型
- **成本优化**：优先使用本地免费模型
- **高可用性**：双重保障，服务不中断

## 核心特性

- **智能路由**：根据任务复杂度自动选择模型
- **故障切换**：模型不可用时自动切换
- **成本优化**：简单任务优先本地模型
- **健康监控**：实时监控模型状态
- **统计报告**：详细的使用统计
- **知识图谱**：增强语义搜索和知识关联能力
- **多模态支持**：扩展对图像、音频等数据的处理能力
- **个性化学习**：基于用户历史交互提供个性化响应
- **插件系统**：支持第三方插件集成
- **并发处理**：高效的任务队列和线程池管理
- **性能优化**：内存缓存机制和智能资源调度
- **Hermes Agent 集成**：融合 Hermes 的存储和自学习机制
- **DAG 内存管理**：基于有向无环图的高效记忆存储
- **自我进化**：从经验中学习并创建新技能
- **经验教训管理**：自动采集和激活工作中的经验教训
- **Superpowers 集成**：融合 obra/superpowers 的工作流技能和方法论

## 快速开始

### 1. 启动本地模型服务

```bash
# 使用 LM Studio CLI
lms load qwen/qwen3.5-9b
lms server start --port 1234
```

### 2. 运行系统

```bash
# Windows
start_lsp.bat

# 或手动启动
python setup.py
```

### 3. 基本使用

```python
from lsp import ModelRouter

# 创建路由器
router = ModelRouter()

# 生成响应（自动选择最优模型）
result = router.generate("你的问题")

if result["success"]:
    print(f"回答: {result['response']['choices'][0]['message']['content']}")
    print(f"使用模型: {result['model']}")
```

## 配置说明

编辑 `lsp_config.json` 文件：

```json
{
  "models": {
    "brain": {
      "name": "云端大脑",
      "type": "cloud",
      "endpoint": "https://api.iflow.cn/v1/chat/completions",
      "api_key": "your-api-key",
      "timeout": 30
    },
    "cerebellum": {
      "name": "本地小脑",
      "type": "local",
      "endpoint": "http://localhost:1234/v1/chat/completions",
      "model": "qwen/qwen3.5-9b",
      "timeout": 120
    }
  }
}
```

## 架构说明

### 大脑+小脑架构

```
┌─────────────────┐    ┌─────────────────┐
│   云端大脑       │    │   本地小脑       │
│   (Brain)       │    │   (Cerebellum)  │
│                 │    │                 │
│  iFlow/Qoder    │    │  LM Studio      │
│  云端 API       │    │  本地模型       │
└─────────────────┘    └─────────────────┘
         │                      │
         └──────────┬───────────┘
                    │
            ┌───────▼───────┐
            │  智能路由器    │
            │  (LSP)        │
            └───────────────┘
```

### 工作流程

1. **任务分析**：分析任务复杂度
2. **模型选择**：智能选择最适合的模型
3. **请求转发**：将请求转发到选定模型
4. **故障切换**：失败时自动切换备用模型
5. **响应返回**：返回结果并记录统计

## 项目结构

Lossless Superpower 项目已分为三个独立的 Python 包：

### 1. lossless-memory
**无损记忆系统** - 基于 DAG 的长期上下文记忆管理

- **功能**：DAG 存储结构、记忆管理、记忆维护、压缩和上下文组装、Hermes 存储机制集成、内存缓存优化
- **位置**：`lossless-memory/`
- **依赖**：Python 3.9+

### 2. superpowers
**超能力系统** - AI 智能体元能力框架

- **功能**：守护者、知识管理、自省、评分、技能库、自我进化、经验教训管理、Hermes 自学习机制集成
- **位置**：`superpowers/`
- **依赖**：Python 3.9+, lossless-memory>=1.0.0

### 3. router
**大脑+小脑路由器** - 智能双模型路由系统

- **功能**：智能路由、故障切换、成本优化、健康监控、统计报告、并发处理、性能优化、模型选择策略增强
- **位置**：`router/`
- **依赖**：Python 3.7+, requests, lossless-memory>=1.0.0, superpowers>=1.0.0

```
Lossless-Superpower/
├── lossless-memory/          # 无损记忆系统
│   ├── lossless_memory/      # 核心代码
│   ├── pyproject.toml        # 包配置
│   └── README.md             # 文档
├── superpowers/              # 超能力系统
│   ├── superpowers/          # 核心代码
│   ├── pyproject.toml        # 包配置
│   └── README.md             # 文档
├── router/                   # 大脑+小脑路由器
│   ├── llm_provider.py       # LLM 提供者
│   ├── lossless_superpower.py # 核心路由器
│   ├── lsp_config.json       # 配置文件
│   ├── pyproject.toml        # 包配置
│   └── README.md             # 文档
├── docs/                     # 文档
├── examples/                 # 示例代码
├── tests/                    # 测试文件
├── README.md                 # 项目文档
├── setup.py                  # 启动脚本
└── start_lsp.bat             # 启动批处理
```

## 相关项目

### lossless-claw-source
**独立项目** - OpenClaw 插件（TypeScript + Go）

- **仓库**: `C:\Users\55237\lossless-claw-source`
- **技术栈**: TypeScript, Go
- **用途**: OpenClaw 集成插件
- **独立性**: 独立版本发布和维护

**关联方式**: 作为外部依赖，通过明确的接口规范与 Lossless-Superpower 集成。

### 项目关联图

```
┌─────────────────────────────────────────────┐
│          Lossless-Superpower                │
│                                             │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │ superpowers │◄────►│ lossless-memory │  │
│  └─────────────┘      └─────────────────┘  │
│         │                      │            │
│         └──────────┬───────────┘            │
│                    │                        │
│            ┌───────▼───────┐                │
│            │     router    │                │
│            └───────────────┘                │
└─────────────────────────────────────────────┘
                     │
                     │ API接口
                     ▼
        ┌───────────────────────┐
        │  lossless-claw-source  │
        │  (TypeScript + Go)     │
        └───────────────────────┘
```

## 使用示例

### 基本使用

```python
from lsp import ModelRouter

router = ModelRouter()

# 简单任务（自动选择本地小脑）
result = router.generate("帮我格式化这段文本")

# 复杂任务（自动选择云端大脑）
result = router.generate("分析这个系统架构并提供优化建议")
```

### 查看统计信息

```python
stats = router.get_stats()
print(f"总请求数: {stats['total_requests']}")
print(f"大脑请求: {stats['brain_requests']}")
print(f"小脑请求: {stats['cerebellum_requests']}")
print(f"故障切换: {stats['failovers']}")
```

### 知识图谱使用

```python
from lossless_memory import add_knowledge, add_relationship, search_knowledge, export_knowledge_graph

# 添加知识
user_node = add_knowledge("什么是人工智能？", topic="AI")
assistant_node = add_knowledge("人工智能是模拟人类智能的技术", topic="AI")

# 添加关系
add_relationship(user_node, assistant_node, "response_to", confidence=0.9)

# 搜索知识
results = search_knowledge("人工智能")
for result in results:
    print(result.get("content"))

# 导出知识图谱
graph = export_knowledge_graph()
print(graph)
```

### 多模态支持

```python
from lossless_memory import save_image, save_audio, search_files

# 保存图像
with open("image.png", "rb") as f:
    image_data = f.read()
image_id = save_image(image_data, description="示例图像")

# 保存音频
with open("audio.wav", "rb") as f:
    audio_data = f.read()
audio_id = save_audio(audio_data, description="示例音频")

# 搜索文件
results = search_files("示例", file_type="image")
for result in results:
    print(f"ID: {result.get('id')}, 描述: {result.get('description')}")
```

### 个性化学习

```python
from lossless_memory import update_user_profile, get_user_interests, generate_personalized_response

# 更新用户配置文件
update_user_profile("我对人工智能很感兴趣", "人工智能是一个广泛的领域...")

# 获取用户兴趣
interests = get_user_interests()
print(interests)

# 生成个性化响应
base_response = "人工智能是模拟人类智能的技术"
personalized_response = generate_personalized_response("什么是人工智能？", base_response)
print(personalized_response)
```

### 插件系统

```python
from superpowers import get_plugins, run_plugin, install_plugin

# 查看插件
plugins = get_plugins()
print(plugins)

# 运行插件
result = run_plugin("example_plugin", "Hello, World!")
print(result)

# 安装插件
install_plugin("example_plugin.zip")
```

### 并发处理

```python
from router.concurrent_processor import concurrent_processor, TaskPriority

# 定义任务函数
def my_task(task_id):
    """示例任务"""
    import time
    time.sleep(0.1)  # 模拟任务执行时间
    return f"Task {task_id} completed"

# 提交多个任务
task_ids = []
for i in range(10):
    # 提交高优先级任务
    task_id = concurrent_processor.submit(
        my_task, i, 
        priority=TaskPriority.HIGH,
        timeout=5
    )
    task_ids.append(task_id)

# 异步获取结果
for task_id in task_ids:
    result = concurrent_processor.get_task_result(task_id, timeout=10)
    print(f"任务 {task_id} 状态: {result['status'].value}")
    if 'result' in result:
        print(f"任务 {task_id} 结果: {result['result']}")

# 获取并发处理器统计信息
stats = concurrent_processor.get_stats()
print(f"总任务数: {stats['total_tasks']}")
print(f"当前工作线程数: {stats['current_workers']}")
print(f"任务状态分布: {stats['status_counts']}")
```

### Hermes Agent 集成

```python
from lossless_memory import MemoryManager, DAGMemoryProvider

# 创建内存管理器
memory_manager = MemoryManager()

# 添加 DAG 内存提供者（集成 Hermes 存储机制）
dag_provider = DAGMemoryProvider()
memory_manager.add_provider(dag_provider)

# 初始化内存管理器
memory_manager.initialize_all("your_session_id")

# 预取内存上下文
query = "Python编程"
memory_context = memory_manager.prefetch_all(query)
print(f"预取的内存上下文: {memory_context}")

# 同步对话内容到内存
user_message = "什么是Python？"
assistant_response = "Python是一种流行的编程语言"
memory_manager.sync_all(user_message, assistant_response)

# 队列预取下一轮的内存
memory_manager.queue_prefetch_all(user_message)

# 获取所有工具模式
tool_schemas = memory_manager.get_all_tool_schemas()
print(f"可用的内存工具: {[schema['name'] for schema in tool_schemas]}")
```

## 优势

| 特性 | 传统架构 | LSP 架构 |
|------|----------|----------|
| 可用性 | 单点故障 | 双重保障 |
| 成本 | 高（全云端） | 低（优先本地） |
| 性能 | 依赖网络 | 本地更快 + 并发处理优化 |
| 灵活性 | 固定模型 | 智能切换 |
| 记忆能力 | 有限上下文 | DAG 长期记忆 + Hermes 存储机制 |
| 自学习能力 | 基本学习 | 自我进化 + 经验教训管理 |
| 响应速度 | 一般 | 内存缓存加速（2.54x） |
| 资源利用 | 低效 | 智能资源调度 + 动态线程管理 |

## 适用场景

- **成本敏感**：优先使用本地免费模型
- **高可用性**：需要服务不中断
- **性能优化**：需要快速响应
- **混合部署**：云端+本地混合使用

## 安装

### 安装所有包

```bash
# 安装 lossless-memory
cd lossless-memory
pip install -e .

# 安装 superpowers
cd ../superpowers
pip install -e .

# 安装 router
cd ../router
pip install -e .
```

### 单独安装

```bash
# 仅安装 lossless-memory
pip install lossless-memory

# 仅安装 superpowers
pip install superpowers

# 仅安装 router
pip install lossless-router
```

## 依赖

### lossless-memory
- Python 3.9+

### superpowers
- Python 3.9+
- lossless-memory>=1.0.0

### router
- Python 3.7+
- requests
- lossless-memory>=1.0.0
- superpowers>=1.0.0

### 外部依赖
- LM Studio (本地模型)
- 云端 API (可选)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**Lossless Superpower - 让 AI 服务更智能、更可靠、更经济！**