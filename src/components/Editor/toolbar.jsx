import { useState, useRef, useEffect, useCallback } from 'react'
import { useEditorStore } from '../../store/editorStore.js'
import { fileToBase64, buildImageMarkdown } from '../../utils/imageProcessor.js'
import toast from 'react-hot-toast'
import {
  Bold, Italic, Heading2, Link, Image, Minus,
  Code, List, Quote, Palette
} from 'lucide-react'

// 插入文本到编辑器光标处（通过 store 的 editorView）
function insertAtCursor(view, text) {
  if (!view) return
  const { state, dispatch } = view
  const from = state.selection.main.from
  const to = state.selection.main.to
  const transaction = state.update({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  })
  dispatch(transaction)
  view.focus()
}

// 预设颜色列表
const PRESET_COLORS = [
  // 红橙黄
  '#e53935', '#f4511e', '#fb8c00', '#fdd835', '#ffca28',
  // 绿青蓝
  '#43a047', '#00897b', '#039be5', '#1e88e5', '#3949ab',
  // 紫粉棕
  '#8e24aa', '#d81b60', '#e91e63', '#795548', '#546e7a',
  // 深浅灰
  '#212121', '#424242', '#757575', '#bdbdbd', '#ffffff',
]

// 颜色选择器浮层
function ColorPicker({ onPickColor, onClose, anchorRef }) {
  const pickerRef = useRef(null)
  const [customColor, setCustomColor] = useState('#ff5733')

  // 点击外部关闭
  useEffect(() => {
    const handler = (e) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, anchorRef])

  return (
    <div className="color-picker-popup" ref={pickerRef}>
      <div className="color-picker-label">选择文字颜色</div>
      <div className="color-picker-grid">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            className="color-swatch"
            style={{ background: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none' }}
            title={color}
            onClick={() => onPickColor(color)}
          />
        ))}
      </div>
      <div className="color-picker-custom">
        <label className="color-picker-custom-label">自定义</label>
        <div className="color-picker-custom-row">
          <input
            type="color"
            className="color-native-input"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
          />
          <input
            type="text"
            className="color-hex-input"
            value={customColor}
            onChange={(e) => {
              const v = e.target.value
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setCustomColor(v)
            }}
            maxLength={7}
            spellCheck={false}
          />
          <button
            className="color-apply-btn"
            onClick={() => {
              if (/^#[0-9a-fA-F]{6}$/.test(customColor)) onPickColor(customColor)
              else toast.error('请输入有效的颜色值，如 #ff5733')
            }}
          >应用</button>
        </div>
      </div>
    </div>
  )
}

// 图片 URL 对话框
function ImageUrlDialog({ onClose, onInsert }) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('图片')

  const handleInsert = () => {
    if (!url.trim()) {
      toast.error('请输入图片 URL')
      return
    }
    onInsert(url.trim(), alt.trim() || '图片')
    onClose()
  }

  return (
    <div
      className="dialog-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dialog-box">
        <h3 className="dialog-title">插入图片链接</h3>
        <div className="dialog-field">
          <label>图片 URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            autoFocus
          />
        </div>
        <div className="dialog-field">
          <label>图片描述（Alt）</label>
          <input
            type="text"
            placeholder="图片描述"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <div className="dialog-actions">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button className="btn-confirm" onClick={handleInsert}>插入</button>
        </div>
      </div>
    </div>
  )
}

// 工具栏按钮
function ToolBtn({ icon: Icon, title, onClick }) {
  return (
    <button className="toolbar-btn" title={title} onClick={onClick}>
      <Icon size={15} />
    </button>
  )
}

export default function EditorToolbar() {
  const editorView = useEditorStore((s) => s.editorView)
  const [showUrlDialog, setShowUrlDialog] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const fileInputRef = useRef(null)
  const colorBtnRef = useRef(null)

  const insert = (text) => insertAtCursor(editorView, text)

  // 工具栏操作
  const actions = [
    { icon: Bold,     title: '加粗 (Ctrl+B)',   text: '**加粗文字**' },
    { icon: Italic,   title: '斜体 (Ctrl+I)',   text: '*斜体文字*' },
    { icon: Heading2, title: '二级标题',          text: '\n## 标题\n' },
    { icon: Code,     title: '行内代码',          text: '`代码`' },
    { icon: Quote,    title: '引用',             text: '\n> 引用内容\n' },
    { icon: List,     title: '无序列表',          text: '\n- 列表项\n- 列表项\n- 列表项\n' },
    { icon: Minus,    title: '分割线',            text: '\n---\n' },
  ]

  // 应用颜色到选中文字
  const handlePickColor = useCallback((color) => {
    if (!editorView) return
    const { state, dispatch } = editorView
    const { from, to } = state.selection.main
    if (from === to) {
      // 没有选中文字，插入示例
      const sample = `<span style="color:${color};">文字</span>`
      const tr = state.update({
        changes: { from, to, insert: sample },
        selection: { anchor: from + sample.length },
      })
      dispatch(tr)
    } else {
      const selectedText = state.sliceDoc(from, to)
      const wrapped = `<span style="color:${color};">${selectedText}</span>`
      const tr = state.update({
        changes: { from, to, insert: wrapped },
        selection: { anchor: from + wrapped.length },
      })
      dispatch(tr)
    }
    editorView.focus()
    setShowColorPicker(false)
  }, [editorView])

  // 本地上传图片
  const handleFileUpload = async (files) => {
    const file = files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }
    const loadingToast = toast.loading('图片处理中...')
    try {
      const base64 = await fileToBase64(file)
      const imgMd = buildImageMarkdown(base64, file.name.replace(/\.[^.]+$/, ''))
      insert(imgMd)
      toast.success('图片插入成功', { id: loadingToast })
    } catch {
      toast.error('图片处理失败', { id: loadingToast })
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // 插入 URL 图片
  const handleInsertUrl = (url, alt) => {
    insert(buildImageMarkdown(url, alt))
  }

  return (
    <>
      <div className="editor-toolbar">
        {actions.map(({ icon, title, text }) => (
          <ToolBtn key={title} icon={icon} title={title} onClick={() => insert(text)} />
        ))}
        <div className="toolbar-divider" />
        {/* 文字颜色按钮 */}
        <div className="color-btn-wrap" ref={colorBtnRef}>
          <button
            className={`toolbar-btn${showColorPicker ? ' active' : ''}`}
            title="文字颜色"
            onClick={() => setShowColorPicker((v) => !v)}
          >
            <Palette size={15} />
          </button>
          {showColorPicker && (
            <ColorPicker
              onPickColor={handlePickColor}
              onClose={() => setShowColorPicker(false)}
              anchorRef={colorBtnRef}
            />
          )}
        </div>
        <div className="toolbar-divider" />
        <ToolBtn
          icon={Image}
          title="上传本地图片"
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolBtn
          icon={Link}
          title="插入图片链接"
          onClick={() => setShowUrlDialog(true)}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {showUrlDialog && (
        <ImageUrlDialog
          onClose={() => setShowUrlDialog(false)}
          onInsert={handleInsertUrl}
        />
      )}
    </>
  )
}
