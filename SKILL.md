# MD to WeChat — Article Formatter / MD 转公众号排版工具

> [中文](#中文) | [English](#english)

---

<a id="中文"></a>

## 中文

### 概述

这是一款在线 Markdown 转微信公众号排版工具，能够将 Markdown 文本实时转换为适配微信公众号后台的内联样式 HTML。

### 能力

#### 核心能力
- **Markdown 转 HTML**：将标准 Markdown（GFM 扩展）解析为 HTML，自动内联所有 CSS 样式
- **多主题排版**：提供 5 套精心设计的公众号排版主题
- **代码高亮**：支持 100+ 编程语言的语法高亮
- **图片处理**：支持本地图片转 base64、URL 引用、拖拽插入，自动压缩大图
- **富文本复制**：以 `text/html` MIME 类型复制，粘贴到公众号后台样式 100% 保留
- **多文章管理**：支持同时管理多篇文章，每篇独立主题、内容，支持拖拽排序
- **文字着色**：支持选中文字后应用 20 种预设颜色或自定义 HEX 颜色

#### 可用主题
| 主题 ID | 名称 | 风格描述 |
|---------|------|----------|
| `default` | ⬜ 微信默认 | 经典简洁黑白风，微信绿色强调 |
| `tech-blue` | 🔵 科技蓝 | 科技感蓝色调，深色代码块 |
| `literary` | 🌸 文艺清新 | 暖色调文艺风，衬线字体 |
| `dark` | 🌑 暗黑酷炫 | 赛博朋克暗色，等宽字体 |
| `green-forest` | 🌿 绿色森林 | 自然清新绿色调 |

#### 支持的 Markdown 语法
- 标题 (h1-h6)
- 粗体、斜体、删除线
- 有序列表、无序列表
- 引用块
- 行内代码、代码块（带语法高亮）
- 表格（GFM 扩展）
- 图片（base64 / URL）
- 链接
- 分割线
- 内联 HTML（如 `<span style="color:red;">` 着色文字）

### 使用方式

#### 本地运行

```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器
npm run build  # 生产构建
```

#### 通过浏览器使用

1. 打开 `http://localhost:5173`
2. 在左侧 Markdown 编辑器中编写内容
3. 右侧实时预览公众号排版效果
4. 点击顶部主题按钮切换排版风格
5. 点击「复制 HTML」按钮
6. 在微信公众号后台 → 新建文章 → Ctrl+V 粘贴

#### 作为排版服务

核心排版逻辑在 `src/core/` 目录下：

```javascript
import { exportHtml } from './src/core/htmlExporter.js'
import { getThemeById } from './src/themes/index.js'

const theme = getThemeById('tech-blue')
const html = exportHtml(markdownContent, theme)
// html 可直接粘贴到公众号后台
```

### 技术细节

#### 公众号兼容处理
- 所有 CSS 通过 `juice` 库内联到 HTML 标签的 `style` 属性
- 不使用 CSS 变量 `var()`（公众号不支持）
- 不使用 `::before` / `::after` 伪元素
- 图片强制 `max-width:100%` 防止溢出
- 代码块启用横向滚动
- 使用 `DOMPurify` 净化 HTML 防止 XSS

#### 数据持久化
- 使用 Zustand persist 中间件
- localStorage key: `md-editor-store`
- 持久化内容: 文章列表、当前文章 ID、UI 模式、侧边栏状态

### 限制

- 仅支持浏览器环境（依赖 DOM API）
- 图片 base64 编码会增大 HTML 体积
- 公众号后台对单篇文章有长度限制（约 20000 字符）
- 主题样式为静态定义，运行时不可动态自定义变量

---

<a id="english"></a>

## English

### Overview

An online Markdown-to-WeChat formatting tool that converts Markdown text into inline-styled HTML compatible with the WeChat Official Account backend in real time.

### Capabilities

#### Core
- **Markdown to HTML**: Parses standard Markdown (GFM) into HTML with all CSS automatically inlined
- **Multi-Theme Formatting**: 5 carefully designed article themes
- **Syntax Highlighting**: 100+ programming languages supported
- **Image Handling**: Local upload (auto base64), URL reference, drag & drop — large images auto-compressed
- **Rich-Text Copy**: Copies as `text/html` MIME type — styles 100% preserved when pasted into WeChat
- **Multi-Article Management**: Manage multiple articles simultaneously, each with independent theme & content, drag-to-reorder
- **Text Coloring**: Apply 20 preset colors or custom HEX to selected text

#### Available Themes
| Theme ID | Name | Style |
|----------|------|-------|
| `default` | ⬜ WeChat Default | Clean black & white, WeChat green accents |
| `tech-blue` | 🔵 Tech Blue | Blue tones, dark code blocks |
| `literary` | 🌸 Literary Fresh | Warm tones, serif fonts |
| `dark` | 🌑 Dark Cyber | Cyberpunk dark, monospace fonts |
| `green-forest` | 🌿 Green Forest | Natural fresh green tones |

#### Supported Markdown Syntax
- Headings (h1-h6)
- Bold, italic, strikethrough
- Ordered / unordered lists
- Blockquotes
- Inline code, code blocks (with syntax highlighting)
- Tables (GFM)
- Images (base64 / URL)
- Links
- Horizontal rules
- Inline HTML (e.g., `<span style="color:red;">` for colored text)

### Usage

#### Local Development

```bash
npm install    # Install dependencies
npm run dev    # Start dev server
npm run build  # Production build
```

#### Browser Usage

1. Open `http://localhost:5173`
2. Write Markdown in the left editor
3. Preview WeChat formatting on the right in real time
4. Click theme buttons at the top to switch styles
5. Click "Copy HTML" button
6. Go to WeChat Official Account backend → New Article → Ctrl+V paste

#### As a Formatting Service

Core formatting logic is in `src/core/`:

```javascript
import { exportHtml } from './src/core/htmlExporter.js'
import { getThemeById } from './src/themes/index.js'

const theme = getThemeById('tech-blue')
const html = exportHtml(markdownContent, theme)
// html can be pasted directly into WeChat backend
```

### Technical Details

#### WeChat Compatibility
- All CSS inlined into HTML `style` attributes via `juice`
- No CSS variables `var()` used (unsupported by WeChat)
- No `::before` / `::after` pseudo-elements
- Images forced to `max-width:100%` to prevent overflow
- Code blocks have horizontal scrolling enabled
- HTML sanitized with `DOMPurify` to prevent XSS

#### Data Persistence
- Zustand persist middleware
- localStorage key: `md-editor-store`
- Persisted data: article list, active article ID, UI mode, sidebar state

### Limitations

- Browser-only (depends on DOM API)
- Base64 image encoding increases HTML size
- WeChat backend has article length limits (~20,000 characters)
- Theme styles are statically defined; no runtime custom variable support

---

## Links

- Source: [GitHub Repository](https://github.com/EvoAI-li/md-to-weixin)
- Tech Stack: React 19, Vite 8, CodeMirror 6, marked 17, juice 11, Zustand 5
