import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getThemeById } from '../themes/index.js'

const DEFAULT_MARKDOWN = `# 欢迎使用 MD转公众号排版工具

这是一款**在线 Markdown 编辑器**，帮助你快速排版出精美的微信公众号文章。

## ✨ 主要功能

- 🎨 **多主题切换** — 5套精心设计的主题风格
- 🖼️ **图片支持** — 本地上传、URL链接、拖拽插入
- 📋 **一键复制** — 直接粘贴到公众号后台，样式完整保留
- ⚡ **实时预览** — 所见即所得

## 代码示例

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`)
  return \`Welcome to MD2WeChat\`
}

greet('World')
\`\`\`

## 引用样式

> 好的工具能让创作事半功倍。
> 希望这款工具能帮助你更高效地创作公众号内容。

## 表格示例

| 功能 | 说明 | 支持 |
|------|------|------|
| Markdown 解析 | 完整 GFM 支持 | ✅ |
| 代码高亮 | 100+ 语言 | ✅ |
| 图片上传 | 转 base64 | ✅ |
| 主题切换 | 5套主题 | ✅ |

---

**开始创作吧！** 在左侧编辑 Markdown，右侧实时预览公众号效果。
`

function makeArticle(n, markdown = '') {
  return {
    id: crypto.randomUUID(),
    title: `新文章 ${n}`,
    markdown: n === 1 ? DEFAULT_MARKDOWN : markdown,
    themeId: 'default',
  }
}

// 从 articles + activeArticleId 同步出顶层 markdown / themeId
// 这样 useEditorStore(s => s.markdown) 的订阅可以正确触发
function syncActive(articles, activeArticleId) {
  const active = articles.find((a) => a.id === activeArticleId) ?? articles[0]
  return {
    markdown: active?.markdown ?? '',
    themeId: active?.themeId ?? 'default',
  }
}

const firstArticle = makeArticle(1)

export const useEditorStore = create(
  persist(
    (set, get) => ({
      // ── 文章列表 ──────────────────────────────────────
      articles: [firstArticle],
      activeArticleId: firstArticle.id,

      // ── 顶层派生字段（与 active article 实时同步）────
      // useMarkdown / Editor / ThemeSwitcher 直接订阅这两个字段
      markdown: firstArticle.markdown,
      themeId: firstArticle.themeId,

      // ── getCurrentTheme ──────────────────────────────
      getCurrentTheme: () => getThemeById(get().themeId),

      // ── setMarkdown：写入 active article + 同步顶层 ─
      setMarkdown: (md) =>
        set((s) => {
          const articles = s.articles.map((a) =>
            a.id === s.activeArticleId ? { ...a, markdown: md } : a
          )
          return { articles, markdown: md }
        }),

      // ── setThemeId：写入 active article + 同步顶层 ──
      setThemeId: (id) =>
        set((s) => {
          const articles = s.articles.map((a) =>
            a.id === s.activeArticleId ? { ...a, themeId: id } : a
          )
          return { articles, themeId: id }
        }),

      // ── 切换文章：同步顶层 markdown / themeId ────────
      switchArticle: (id) =>
        set((s) => {
          const derived = syncActive(s.articles, id)
          return { activeArticleId: id, ...derived }
        }),

      // ── 新建文章 ─────────────────────────────────────
      createArticle: () =>
        set((s) => {
          const article = makeArticle(s.articles.length + 1)
          const articles = [...s.articles, article]
          const derived = syncActive(articles, article.id)
          return { articles, activeArticleId: article.id, ...derived }
        }),

      // ── 删除文章 ─────────────────────────────────────
      deleteArticle: (id) =>
        set((s) => {
          if (s.articles.length === 1) return {}
          const idx = s.articles.findIndex((a) => a.id === id)
          const articles = s.articles.filter((a) => a.id !== id)
          const newActiveId =
            s.activeArticleId === id
              ? (articles[idx - 1] ?? articles[0]).id
              : s.activeArticleId
          const derived = syncActive(articles, newActiveId)
          return { articles, activeArticleId: newActiveId, ...derived }
        }),

      // ── 重命名文章 ───────────────────────────────────
      renameArticle: (id, title) =>
        set((s) => ({
          articles: s.articles.map((a) =>
            a.id === id ? { ...a, title } : a
          ),
        })),

      // ── 拖拽排序文章 ───────────────────────────────
      reorderArticles: (fromIndex, toIndex) =>
        set((s) => {
          if (fromIndex === toIndex) return {}
          const arr = [...s.articles]
          const [moved] = arr.splice(fromIndex, 1)
          arr.splice(toIndex, 0, moved)
          return { articles: arr }
        }),

      // ── 侧边栏折叠 ───────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ── 界面明暗模式（默认白天）──────────────────────
      uiMode: 'light',
      toggleUiMode: () =>
        set((s) => ({ uiMode: s.uiMode === 'dark' ? 'light' : 'dark' })),

      // ── 编译后 HTML（运行时，不持久化）──────────────
      compiledHtml: '',
      setCompiledHtml: (html) => set({ compiledHtml: html }),

      // ── CodeMirror 实例（运行时，不持久化）──────────
      editorView: null,
      setEditorView: (view) => set({ editorView: view }),

      // ── 图片对话框 ──────────────────────────────────
      showImageUrlDialog: false,
      setShowImageUrlDialog: (v) => set({ showImageUrlDialog: v }),
    }),
    {
      name: 'md-editor-store',
      partialize: (s) => ({
        articles: s.articles,
        activeArticleId: s.activeArticleId,
        uiMode: s.uiMode,
        sidebarCollapsed: s.sidebarCollapsed,
        // 持久化顶层派生字段，rehydrate 后直接可用
        markdown: s.markdown,
        themeId: s.themeId,
      }),
      // rehydrate 后重新同步一次，防止 articles 与顶层字段不一致
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const derived = syncActive(state.articles, state.activeArticleId)
        state.markdown = derived.markdown
        state.themeId = derived.themeId
      },
    }
  )
)
