import { useEffect, useRef } from 'react'
import { useEditorStore } from '../store/editorStore.js'
import { exportHtml } from '../core/htmlExporter.js'

/**
 * 防抖 Markdown 编译 Hook
 * 监听 markdown 内容和主题变化，300ms 防抖后重新编译为内联 HTML
 */
export function useMarkdown() {
  const markdown = useEditorStore((s) => s.markdown)
  const themeId = useEditorStore((s) => s.themeId)
  const getCurrentTheme = useEditorStore((s) => s.getCurrentTheme)
  const setCompiledHtml = useEditorStore((s) => s.setCompiledHtml)
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const theme = getCurrentTheme()
      const html = exportHtml(markdown, theme)
      setCompiledHtml(html)
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [markdown, themeId]) // eslint-disable-line react-hooks/exhaustive-deps
}
