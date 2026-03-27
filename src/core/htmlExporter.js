import juice from 'juice'
import DOMPurify from 'dompurify'
import { parseMarkdown } from './markdownParser.js'

/**
 * 将主题 vars 对象展开为 CSS 字符串（用于 juice 内联）
 * 注意：不使用 CSS 变量 var()，直接展开值，公众号不支持 CSS 变量
 */
function buildThemeCSS(vars) {
  const v = vars

  return `
.weixin-article {
  background-color: ${v['--body-bg']};
  padding: ${v['--body-padding']};
  color: ${v['--text-color']};
  font-size: ${v['--text-size']};
  line-height: ${v['--line-height']};
  font-family: ${v['--font-family']};
  word-break: break-word;
  -webkit-text-size-adjust: 100%;
}

.weixin-article p {
  margin: 0 0 1em 0;
  color: ${v['--text-color']};
  font-size: ${v['--text-size']};
  line-height: ${v['--line-height']};
}

.weixin-article h1 {
  font-size: ${v['--h1-size']};
  color: ${v['--h1-color']};
  font-weight: ${v['--h1-weight']};
  margin: 1.4em 0 0.6em 0;
  padding-bottom: ${v['--h1-padding-bottom']};
  border-bottom: ${v['--h1-border-bottom']};
  line-height: 1.4;
}

.weixin-article h2 {
  font-size: ${v['--h2-size']};
  color: ${v['--h2-color']};
  font-weight: ${v['--h2-weight']};
  margin: 1.3em 0 0.5em 0;
  padding-left: ${v['--h2-padding-left']};
  border-left: ${v['--h2-border-left']};
  line-height: 1.4;
}

.weixin-article h3 {
  font-size: ${v['--h3-size']};
  color: ${v['--h3-color']};
  font-weight: ${v['--h3-weight']};
  margin: 1.2em 0 0.4em 0;
  line-height: 1.4;
}

.weixin-article h4, .weixin-article h5, .weixin-article h6 {
  font-size: 15px;
  color: ${v['--h3-color']};
  font-weight: 700;
  margin: 1em 0 0.4em 0;
}

.weixin-article strong, .weixin-article b {
  color: ${v['--strong-color']};
  font-weight: 700;
}

.weixin-article em, .weixin-article i {
  color: ${v['--em-color']};
  font-style: italic;
}

.weixin-article a {
  color: ${v['--a-color']};
  text-decoration: none;
  border-bottom: 1px solid ${v['--a-color']};
}

.weixin-article blockquote {
  background: ${v['--blockquote-bg']};
  border-left: 4px solid ${v['--blockquote-border']};
  color: ${v['--blockquote-color']};
  margin: 1em 0;
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  font-style: italic;
}

.weixin-article blockquote p {
  margin: 0;
  color: ${v['--blockquote-color']};
}

.weixin-article code {
  background: ${v['--code-bg']};
  color: ${v['--code-color']};
  border: 1px solid ${v['--code-border']};
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 13px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.weixin-article pre {
  background: ${v['--pre-bg']};
  color: ${v['--pre-color']};
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1em 0;
  font-size: 13px;
  line-height: 1.6;
}

.weixin-article pre code {
  background: transparent;
  color: inherit;
  border: none;
  padding: 0;
  font-size: inherit;
}

.weixin-article table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 14px;
  overflow: hidden;
  border-radius: 6px;
}

.weixin-article th {
  background: ${v['--table-header-bg']};
  color: ${v['--table-header-color']};
  padding: 10px 14px;
  text-align: left;
  font-weight: 700;
  border: 1px solid ${v['--table-border']};
}

.weixin-article td {
  padding: 9px 14px;
  border: 1px solid ${v['--table-border']};
  color: ${v['--text-color']};
}

.weixin-article tr:nth-child(even) td {
  background: ${v['--table-row-even']};
}

.weixin-article ul, .weixin-article ol {
  padding-left: 2em;
  margin: 0.5em 0 1em 0;
}

.weixin-article li {
  margin: 4px 0;
  color: ${v['--text-color']};
  line-height: ${v['--line-height']};
}

.weixin-article img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px auto;
  border-radius: 4px;
}

.weixin-article hr {
  border: none;
  border-top: 1px solid ${v['--hr-color']};
  margin: 1.5em 0;
}

/* hljs 代码高亮颜色适配 */
.weixin-article .hljs-keyword,
.weixin-article .hljs-selector-tag,
.weixin-article .hljs-built_in { color: #c678dd; }
.weixin-article .hljs-string,
.weixin-article .hljs-attr { color: #98c379; }
.weixin-article .hljs-number,
.weixin-article .hljs-literal { color: #d19a66; }
.weixin-article .hljs-comment { color: #7f848e; font-style: italic; }
.weixin-article .hljs-function,
.weixin-article .hljs-title { color: #61afef; }
.weixin-article .hljs-variable { color: #e06c75; }
`
}

/**
 * 后处理：修复公众号不支持的元素/属性
 * @param {string} html
 * @returns {string}
 */
function postProcess(html) {
  return html
    // 确保所有图片宽度安全
    .replace(/<img([^>]*?)>/gi, (match, attrs) => {
      if (!attrs.includes('style=')) {
        return `<img${attrs} style="max-width:100%;height:auto;display:block;margin:12px auto;">`
      }
      return match
    })
    // 清理空 style 属性
    .replace(/\s*style=""\s*/gi, ' ')
}

/**
 * 主导出函数：Markdown → 内联样式 HTML
 * @param {string} markdown
 * @param {object} theme  主题对象 { vars: {...} }
 * @returns {string}  可直接粘贴到公众号的 HTML
 */
export function exportHtml(markdown, theme) {
  // 1. 解析 Markdown → HTML
  const rawHtml = parseMarkdown(markdown)

  // 2. 包裹到容器中（用于 juice 选择器匹配）
  const wrappedHtml = `<div class="weixin-article">${rawHtml}</div>`

  // 3. 生成主题 CSS
  const css = buildThemeCSS(theme.vars)

  // 4. juice 内联 CSS
  let inlinedHtml
  try {
    inlinedHtml = juice(`<style>${css}</style>${wrappedHtml}`, {
      removeStyleTags: true,
      preserveImportant: true,
      applyAttributesTableElements: true,
    })
  } catch {
    inlinedHtml = wrappedHtml
  }

  // 5. DOMPurify 安全净化（保留 style 属性）
  let safeHtml
  if (typeof window !== 'undefined') {
    safeHtml = DOMPurify.sanitize(inlinedHtml, {
      ALLOWED_ATTR: ['style', 'src', 'alt', 'href', 'class', 'id',
        'width', 'height', 'colspan', 'rowspan', 'align', 'valign'],
      ADD_TAGS: ['section'],
    })
  } else {
    safeHtml = inlinedHtml
  }

  // 6. 后处理
  return postProcess(safeHtml)
}
