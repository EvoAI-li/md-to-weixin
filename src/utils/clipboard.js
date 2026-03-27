/**
 * 复制 HTML 到剪贴板，保持富文本格式
 * 微信公众号后台需要 text/html MIME 类型才能保留样式
 */
export async function copyHtmlToClipboard(html) {
  // 方案A：现代 Clipboard API（Chrome 86+）
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      const blob = new Blob([html], { type: 'text/html' })
      const item = new ClipboardItem({ 'text/html': blob })
      await navigator.clipboard.write([item])
      return true
    } catch {
      // 降级到方案B
    }
  }

  // 方案B：execCommand 降级（Safari / 旧浏览器）
  try {
    const el = document.createElement('div')
    el.innerHTML = html
    el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none'
    document.body.appendChild(el)
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
    document.execCommand('copy')
    sel.removeAllRanges()
    document.body.removeChild(el)
    return true
  } catch {
    return false
  }
}
