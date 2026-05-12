# 抖音学习助手

一款基于 AI 角色的抖音视频伴学应用。将抖音视频字幕输入后，由不同性格的 AI 角色对内容进行解读、重构，并生成思维导图，让学习更有趣、更高效。

## 功能特性

- **5 位 AI 伴学角色** — 学者猫、机械龙、精灵鹿、勇者犬、小幽灵，各有不同性格和擅长领域
- **视频内容智能分类** — 自动识别视频类别，匹配最合适的角色
- **个性化内容重构** — 将视频字幕以角色口吻重新讲解，包含简单解析、逻辑树、行动建议
- **思维导图生成** — 自动输出 Mermaid 格式思维导图
- **分析结果缓存** — MongoDB 存储历史分析，同一视频不重复调用 AI

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + TypeScript + Vite + Tailwind CSS + Three.js |
| 后端 | Node.js + Express |
| AI   | DeepSeek API |
| 数据库 | MongoDB（可选，无数据库时降级运行） |

## 目录结构

```
.
├── server.js              # 后端入口
├── config/
│   ├── characters.js      # 5 位角色定义与 Prompt
│   └── deepseek.js        # DeepSeek API 配置
├── routes/
│   ├── analyze.js         # POST /api/analyze
│   └── characters.js      # GET /api/characters
├── services/
│   └── deepseekService.js # AI 调用逻辑
├── models/
│   └── VideoInsight.js    # MongoDB 数据模型
├── middleware/
│   └── logger.js          # 请求日志
└── frontend/              # Vue 3 前端
    └── src/
        ├── components/    # UI 组件
        ├── composables/   # 业务逻辑 Hooks
        ├── services/      # API 请求封装
        └── config/        # 角色前端配置
```

## 快速开始

### 1. 安装依赖

```bash
# 后端
npm install

# 前端
cd frontend && npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
MONGODB_URI=mongodb://localhost:27017/douyin_ai_companion
PORT=3000
```

> MongoDB 为可选项，不配置时服务仍可正常运行，但不会缓存分析结果。

### 3. 启动服务

```bash
# 启动后端（开发模式）
npm run dev

# 启动前端（新终端）
cd frontend && npm run dev
```

- 后端：http://localhost:3000
- 前端：http://localhost:5173

## API 接口

### 分析视频内容

```
POST /api/analyze
```

**请求体：**

```json
{
  "videoId": "视频唯一ID",
  "transcript": "视频字幕文本内容",
  "characterId": "scholar-cat"  // 可选，不填则自动匹配
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "classification": { "category": "学术科普", "tags": [], "difficulty": "medium" },
    "character": { "id": "scholar-cat", "name": "学者猫" },
    "reconstruction": {
      "simpleExplanations": "...",
      "logicTree": "...",
      "actionTips": "..."
    },
    "mindmapMermaid": "mindmap\n  root((...))\n    ...",
    "cached": false
  }
}
```

### 获取所有角色

```
GET /api/characters
```

### 健康检查

```
GET /api/health
```

## AI 角色介绍

| 角色 | 性格 | 擅长领域 |
|------|------|---------|
| 学者猫 | 博学严谨、温和耐心 | 学术科普、编程技术、历史人文 |
| 机械龙 | 理性高效、数据导向 | AI/数据科学、财经分析、商业策略 |
| 精灵鹿 | 治愈温暖、善于共情 | 心理健康、职场压力、自我成长 |
| 勇者犬 | 热血行动、正能量 | 健身运动、创业奋斗、挑战打卡 |
| 小幽灵 | 可爱随性、反内卷 | 生活方式、轻松搞笑、旅行美食 |
