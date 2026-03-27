import { useCallback, useState, useRef, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'
import { useEditorStore } from '../../store/editorStore.js'
import { fileToBase64, buildImageMarkdown } from '../../utils/imageProcessor.js'
import toast from 'react-hot-toast'
import EditorToolbar from './toolbar.jsx'

// 暗色编辑器主题
const darkEditorTheme = EditorView.theme({
  '&': { fontSize: '14px', height: '100%', backgroundColor: '#1e1e2e' },
  '.cm-content': {
    caretColor: '#cba6f7',
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    padding: '12px 16px',
    lineHeight: '1.7',
  },
  '.cm-focused': { outline: 'none' },
  '.cm-line': { color: '#cdd6f4' },
  '.cm-gutters': { backgroundColor: '#181825', color: '#585b70', borderRight: '1px solid #313244' },
  '.cm-activeLineGutter': { backgroundColor: '#1e1e2e' },
  '.cm-activeLine': { backgroundColor: 'rgba(203,166,247,0.06)' },
  '.cm-selectionBackground': { backgroundColor: 'rgba(203,166,247,0.25) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(203,166,247,0.35) !important' },
  '.cm-cursor': { borderLeftColor: '#cba6f7' },
  '.cm-scroller': { overflow: 'auto' },
})

// 亮色编辑器主题
const lightEditorTheme = EditorView.theme({
  '&': { fontSize: '14px', height: '100%', backgroundColor: '#ffffff' },
  '.cm-content': {
    caretColor: '#7c5cbf',
    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    padding: '12px 16px',
    lineHeight: '1.7',
  },
  '.cm-focused': { outline: 'none' },
  '.cm-line': { color: '#24292e' },
  '.cm-gutters': { backgroundColor: '#f6f8fa', color: '#959da5', borderRight: '1px solid #e1e4e8' },
  '.cm-activeLineGutter': { backgroundColor: '#f0f0f0' },
  '.cm-activeLine': { backgroundColor: 'rgba(124,92,191,0.06)' },
  '.cm-selectionBackground': { backgroundColor: 'rgba(124,92,191,0.18) !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(124,92,191,0.28) !important' },
  '.cm-cursor': { borderLeftColor: '#7c5cbf' },
  '.cm-scroller': { overflow: 'auto' },
})

// 文章标题编辑栏
function ArticleTitleBar() {
  const activeArticleId = useEditorStore((s) => s.activeArticleId)
  const articles = useEditorStore((s) => s.articles)
  const renameArticle = useEditorStore((s) => s.renameArticle)

  const activeArticle = articles.find((a) => a.id === activeArticleId) ?? articles[0]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(activeArticle?.title ?? '')
  const inputRef = useRef(null)

  // 切换文章时同步 draft
  useEffect(() => {
    setDraft(activeArticle?.title ?? '')
    setEditing(false)
  }, [activeArticleId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 进入编辑时全选
  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== activeArticle?.title) {
      renameArticle(activeArticleId, trimmed)
    } else {
      setDraft(activeArticle?.title ?? '')
    }
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') {
      setDraft(activeArticle?.title ?? '')
      setEditing(false)
    }
  }

  return (
    <div className="article-title-bar">
      {editing ? (
        <input
          ref={inputRef}
          className="article-title-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="article-title-display"
          onClick={() => setEditing(true)}
          title="点击编辑文章标题"
        >
          {activeArticle?.title ?? '未命名文章'}
        </span>
      )}
    </div>
  )
}

export default function Editor() {
  const markdown_content = useEditorStore((s) => s.markdown)
  const setMarkdown = useEditorStore((s) => s.setMarkdown)
  const setEditorView = useEditorStore((s) => s.setEditorView)
  const uiMode = useEditorStore((s) => s.uiMode)

  const onChange = useCallback((val) => {
    setMarkdown(val)
  }, [setMarkdown])

  const onCreateEditor = useCallback((view) => {
    setEditorView(view)
  }, [setEditorView])

  // 拖拽图片到编辑器
  const handleDrop = useCallback(async (e) => {
    const files = Array.from(e.dataTransfer?.files || [])
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return
    e.preventDefault()
    const loadingToast = toast.loading(`处理 ${imageFiles.length} 张图片中...`)
    try {
      const results = await Promise.all(
        imageFiles.map(async (file) => {
          const base64 = await fileToBase64(file)
          return buildImageMarkdown(base64, file.name.replace(/\.[^.]+$/, ''))
        })
      )
      setMarkdown(markdown_content + '\n' + results.join('\n'))
      toast.success('图片插入成功', { id: loadingToast })
    } catch {
      toast.error('图片处理失败', { id: loadingToast })
    }
  }, [markdown_content, setMarkdown])

  const handleDragOver = useCallback((e) => {
    const hasImage = Array.from(e.dataTransfer?.items || []).some(i => i.type.startsWith('image/'))
    if (hasImage) e.preventDefault()
  }, [])

  const editorTheme = uiMode === 'dark' ? darkEditorTheme : lightEditorTheme

  return (
    <div className="editor-panel">
      <ArticleTitleBar />
      <EditorToolbar />
      <div
        className="editor-codemirror-wrap"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CodeMirror
          value={markdown_content}
          height="100%"
          style={{ height: '100%' }}
          extensions={[markdown(), editorTheme]}
          onChange={onChange}
          onCreateEditor={onCreateEditor}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBrackets: true,
            autocompletion: false,
            syntaxHighlighting: true,
          }}
        />
        <div className="drop-hint">拖拽图片到此处可快速插入</div>
      </div>
    </div>
  )
}
