<h1 align="center">
  <br>
  MD 转公众号排版工具
  <br>
</h1>

<p align="center">
  <strong>在线 Markdown 编辑器，一键生成精美的微信公众号文章</strong>
</p>

<p align="center">
  <a href="./README.md">中文</a> &nbsp;|&nbsp;
  <a href="./README_EN.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Zustand-5-orange" alt="Zustand 5" />
  <img src="https://img.shields.io/badge/CodeMirror-6-green" alt="CodeMirror 6" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License" />
</p>

<p align="center">
  <a href="#-快速开始">快速开始</a> &nbsp;|&nbsp;
  <a href="#-功能特性">功能特性</a> &nbsp;|&nbsp;
  <a href="#-主题预览">主题预览</a> &nbsp;|&nbsp;
  <a href="#-技术架构">技术架构</a> &nbsp;|&nbsp;
  <a href="#-mcp--openclaw-接入">MCP 接入</a>
</p>

---

## 💡 项目简介

**MD 转公众号** 是一款专为微信公众号排版设计的在线 Markdown 编辑器。左侧编写 Markdown，右侧实时预览公众号效果，一键复制即可粘贴到公众号后台，**样式 100% 保留**。

> 核心原理：通过 `marked` 解析 Markdown → `highlight.js` 代码高亮 → `juice` 将 CSS 内联到每个 HTML 标签的 `style` 属性 → `DOMPurify` 安全净化 → 生成可直接粘贴到公众号的富文本 HTML。

---

## ✨ 功能特性

### 核心功能
- 📝 **Markdown 实时编辑** — 基于 CodeMirror 6，支持语法高亮、行号、自动缩进
- 👁️ **公众号实时预览** — 375px 手机宽度模拟，所见即所得
- 📋 **一键复制 HTML** — 使用 `text/html` MIME 类型复制，粘贴到公众号后台样式完整保留
- 🎨 **5 套精美主题** — 微信默认、科技蓝、文艺清新、暗黑酷炫、绿色森林
- 🌗 **明暗模式切换** — 编辑器界面支持白天/黑夜两种 UI 模式

### 多文章管理
- 📂 **侧边栏文章列表** — 左侧侧边栏管理多篇文章，点击切换
- ➕ **新建/删除文章** — 支持无限创建文章，最后一篇不可删除
- ✏️ **文章标题编辑** — 双击侧边栏标题或点击编辑器顶部标题栏即可修改
- 🔀 **拖拽排序** — 按住拖拽手柄上下拖动，自由排列文章顺序
- 💾 **自动持久化** — 所有文章内容、主题选择、排序均自动保存到 localStorage

### 图片支持
- 📤 **本地上传** — 自动转 base64 编码，超过 800KB 自动压缩
- 🔗 **URL 链接** — 弹出对话框输入图片 URL 和描述
- 🖱️ **拖拽插入** — 直接拖拽图片文件到编辑器

### 编辑器工具栏
- **B** 加粗 · *I* 斜体 · **H2** 标题 · `Code` 行内代码
- > 引用 · - 列表 · --- 分割线
- 🎨 **文字颜色** — 20 种预设色 + 自定义 HEX 颜色，选中文字一键上色
- 🖼️ 图片上传 · 🔗 图片链接

---

## 🎨 主题预览

### ⬜ 微信默认
经典的微信公众号排版风格，简洁大方。

<p align="center">
  <img src="./screenshots/theme-default.png" width="800" alt="微信默认主题" />
</p>

### 🔵 科技蓝
适合技术文章的蓝色调主题，代码块采用深色背景。

<p align="center">
  <img src="./screenshots/theme-tech-blue.png" width="800" alt="科技蓝主题" />
</p>

### 🌸 文艺清新
暖色调文艺风，适合读书笔记、生活随笔等内容。

<p align="center">
  <img src="./screenshots/theme-literary.png" width="800" alt="文艺清新主题" />
</p>

### 🌑 暗黑酷炫
赛博朋克风格暗色主题，等宽字体，适合极客风格文章。

<p align="center">
  <img src="./screenshots/theme-dark.png" width="800" alt="暗黑酷炫主题" />
</p>

### 🌿 绿色森林
清新自然的绿色调主题，适合环保、健康、生活类内容。

<p align="center">
  <img src="./screenshots/theme-green-forest.png" width="800" alt="绿色森林主题" />
</p>

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9（或 pnpm / yarn）

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/EvoAI-li/md-to-weixin.git
cd md-to-weixin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可使用。

### 构建部署

```bash
# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

构建产物在 `dist/` 目录，可直接部署到任意静态托管服务（Vercel、Netlify、Cloudflare Pages、GitHub Pages 等）。

---

## 🏗️ 技术架构

### 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + Vite 8 |
| 代码编辑器 | CodeMirror 6 (`@uiw/react-codemirror`) |
| Markdown 解析 | marked 17 + marked-highlight |
| 代码高亮 | highlight.js 11 |
| CSS 内联 | juice 11（将 `<style>` 转为 `style=""` 属性） |
| XSS 防护 | DOMPurify 3 |
| 状态管理 | Zustand 5（含 persist 中间件） |
| 图片处理 | browser-image-compression |
| UI 图标 | lucide-react |
| 消息提示 | react-hot-toast |

### 项目结构

```
md-to-weixin/
├── index.html
├── package.json
├── vite.config.js
├── SKILL.md                         # MCP / OpenClaw 技能描述
└── src/
    ├── main.jsx                     # 入口
    ├── App.jsx                      # 根组件（布局 + 路由）
    ├── store/
    │   └── editorStore.js           # Zustand 全局状态（多文章 + 持久化）
    ├── themes/
    │   ├── index.js                 # 主题注册表
    │   ├── default.js               # ⬜ 微信默认
    │   ├── tech-blue.js             # 🔵 科技蓝
    │   ├── literary.js              # 🌸 文艺清新
    │   ├── dark.js                  # 🌑 暗黑酷炫
    │   └── green-forest.js          # 🌿 绿色森林
    ├── core/
    │   ├── markdownParser.js        # marked 配置 + highlight.js 集成
    │   └── htmlExporter.js          # 主题 CSS 生成 → juice 内联 → DOMPurify → 后处理
    ├── hooks/
    │   └── useMarkdown.js           # 300ms 防抖编译 Hook
    ├── components/
    │   ├── Sidebar/
    │   │   └── index.jsx            # 文章列表侧边栏（拖拽排序）
    │   ├── Editor/
    │   │   ├── index.jsx            # CodeMirror 编辑器 + 标题栏
    │   │   └── toolbar.jsx          # 格式工具栏 + 颜色选择器
    │   ├── Preview/
    │   │   └── index.jsx            # 手机预览面板
    │   ├── ThemeSwitcher/
    │   │   └── index.jsx            # 主题切换按钮组
    │   └── CopyButton/
    │       └── index.jsx            # 复制 HTML 按钮
    ├── utils/
    │   ├── clipboard.js             # text/html MIME 复制
    │   └── imageProcessor.js        # base64 转换 + 自动压缩
    └── styles/
        └── app.css                  # 全局布局 + 明暗主题 CSS 变量
```

### 数据流

```
用户输入 Markdown
  ↓ onChange（实时）
Zustand Store (markdown 字段更新)
  ↓ useMarkdown Hook（300ms 防抖）
marked.parse() + highlight.js 代码高亮
  ↓
buildThemeCSS(themeVars) — 将主题变量展开为纯 CSS
  ↓
juice(html + css) — CSS 内联到每个标签的 style 属性
  ↓
DOMPurify.sanitize() — XSS 安全净化
  ↓
postProcess() — 修复图片宽度、清理空属性
  ↓
Preview 实时渲染 / 一键复制到公众号后台
```

### 公众号兼容策略

微信公众号后台的富文本编辑器有诸多限制，本项目做了以下适配：

| 限制 | 应对策略 |
|------|----------|
| 不支持 `<style>` 标签 | `juice` 将所有 CSS 内联到 `style=""` 属性 |
| 不支持 CSS 变量 `var()` | 主题 CSS 使用字面量值，不依赖 `var()` |
| 不支持 `::before` / `::after` | 用 `border-left` 等属性替代伪元素装饰 |
| 图片宽度溢出 | 所有 `<img>` 添加 `max-width:100%; height:auto` |
| 代码块横向溢出 | `<pre>` 添加 `overflow-x:auto; -webkit-overflow-scrolling:touch` |
| 富文本粘贴丢失样式 | 使用 `ClipboardItem('text/html')` MIME 类型复制 |

---

## 🔌 MCP / OpenClaw 接入

本项目支持 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 和 [OpenClaw](https://openclaw.ai/) 接入，可作为 AI 工具链中的 Markdown 排版服务。

### MCP 配置

在你的 MCP 客户端（如 Claude Desktop、Cursor 等）的配置中添加：

```json
{
  "mcpServers": {
    "md-to-weixin": {
      "command": "npx",
      "args": ["serve", "./dist", "-l", "3000"],
      "env": {},
      "description": "Markdown to WeChat Article Formatter - 在线 Markdown 转公众号排版工具"
    }
  }
}
```

### OpenClaw 接入

本项目提供 `SKILL.md` 文件，兼容 OpenClaw 技能发现协议。AI Agent 可通过读取 `SKILL.md` 了解本工具的能力和使用方式。

详见 [SKILL.md](./SKILL.md) 获取完整的技能描述。

### 作为 AI 工具使用的场景

| 场景 | 说明 |
|------|------|
| 公众号排版自动化 | AI 生成 Markdown → 本工具转换为公众号 HTML |
| 批量文章生成 | 多文章管理 + 主题一键切换 |
| 内容审核预览 | 在手机预览模式下检查排版效果 |
| 样式定制 | 5 套主题快速切换，无需手动调 CSS |

---

## 📸 界面预览

### 完整界面（白天模式）

<p align="center">
  <img src="./screenshots/full-light.png" width="800" alt="完整界面 - 白天模式" />
</p>

### 完整界面（黑夜模式）

<p align="center">
  <img src="./screenshots/full-dark.png" width="800" alt="完整界面 - 黑夜模式" />
</p>

---

## 📋 更新日志

### v1.0.0 — 首个正式版

#### 核心功能
- ✅ Markdown 实时编辑与预览
- ✅ 5 套公众号排版主题（微信默认 / 科技蓝 / 文艺清新 / 暗黑酷炫 / 绿色森林）
- ✅ 一键复制内联 CSS 的 HTML，直接粘贴到公众号后台
- ✅ 100+ 语言代码高亮
- ✅ 图片三种插入方式（本地上传 / URL 链接 / 拖拽）

#### 多文章管理
- ✅ 左侧侧边栏文章列表，支持新建/删除/切换
- ✅ 文章标题双击重命名，编辑器顶部标题栏点击编辑
- ✅ 拖拽排序文章顺序
- ✅ 侧边栏折叠/展开
- ✅ 全部状态自动保存到 localStorage（刷新不丢失）

#### 编辑器增强
- ✅ 白天/黑夜 UI 模式切换
- ✅ 文字颜色选择器（20 种预设色 + 自定义 HEX）
- ✅ 格式工具栏（加粗/斜体/标题/代码/引用/列表/分割线）

#### 技术亮点
- ✅ CSS 全量内联（juice），公众号兼容性 100%
- ✅ XSS 安全净化（DOMPurify）
- ✅ 图片自动压缩（>800KB 自动处理）
- ✅ 300ms 防抖编译，流畅编辑体验
- ✅ 支持 MCP 和 OpenClaw 接入

---

## 🛠️ 开发指南

### 添加新主题

1. 在 `src/themes/` 下新建主题文件（如 `ocean.js`）：

```javascript
export default {
  id: 'ocean',
  name: '海洋蓝',
  emoji: '🌊',
  vars: {
    '--body-bg': '#f0f8ff',
    '--text-color': '#1a3a5c',
    '--primary': '#0077b6',
    // ... 完整变量列表参考 default.js
  }
}
```

2. 在 `src/themes/index.js` 中导入并注册：

```javascript
import themeOcean from './ocean.js'
export const THEMES = [
  // ...existing themes,
  themeOcean,
]
```

3. 完成！主题会自动出现在顶部主题切换器中。

### 本地开发

```bash
npm run dev        # 启动开发服务器（HMR 热更新）
npm run build      # 生产构建
npm run preview    # 预览构建产物
npm run lint       # ESLint 检查
```

---

## 📄 License

[MIT](./LICENSE) - 随便用，记得给个 Star 就好。
