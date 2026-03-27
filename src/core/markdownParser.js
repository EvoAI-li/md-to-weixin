import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

// 配置代码高亮
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
)

// 配置 marked 选项
marked.setOptions({
  gfm: true,
  breaks: true,
})

/**
 * 将 Markdown 解析为 HTML 字符串
 * @param {string} markdown
 * @returns {string} HTML
 */
export function parseMarkdown(markdown) {
  return marked.parse(markdown || '')
}
