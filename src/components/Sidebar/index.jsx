import { useState, useRef, useEffect, useCallback } from 'react'
import { useEditorStore } from '../../store/editorStore.js'
import toast from 'react-hot-toast'
import {
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  GripVertical,
} from 'lucide-react'

// ── 单篇文章行（支持拖拽）──────────────────────────────────────────
function ArticleItem({
  article,
  index,
  isActive,
  onSwitch,
  onDelete,
  onRename,
  dragState,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(article.title)
  const inputRef = useRef(null)
  const itemRef = useRef(null)

  // 进入编辑态时自动全选
  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  // 同步外部 title 变化
  useEffect(() => {
    if (!editing) setDraft(article.title)
  }, [article.title, editing])

  const commitRename = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== article.title) {
      onRename(article.id, trimmed)
    } else {
      setDraft(article.title)
    }
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') {
      setDraft(article.title)
      setEditing(false)
    }
  }

  // 拖拽指示器位置
  const isDragging = dragState.draggingIndex === index
  let dropIndicator = ''
  if (dragState.draggingIndex !== null && dragState.overIndex === index && !isDragging) {
    dropIndicator = dragState.dropPosition // 'before' | 'after'
  }

  return (
    <li
      ref={itemRef}
      className={
        `article-item` +
        `${isActive ? ' active' : ''}` +
        `${isDragging ? ' dragging' : ''}` +
        `${dropIndicator === 'before' ? ' drop-before' : ''}` +
        `${dropIndicator === 'after' ? ' drop-after' : ''}`
      }
      draggable={!editing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      onClick={() => !editing && onSwitch(article.id)}
    >
      <span className="article-item-grip">
        <GripVertical size={12} />
      </span>
      <FileText size={13} className="article-item-icon" />

      {editing ? (
        <input
          ref={inputRef}
          className="article-item-rename-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="article-item-title"
          onDoubleClick={(e) => {
            e.stopPropagation()
            setEditing(true)
          }}
          title={article.title}
        >
          {article.title}
        </span>
      )}

      <button
        className="article-item-delete"
        title="删除文章"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(article.id)
        }}
      >
        <Trash2 size={12} />
      </button>
    </li>
  )
}

// ── 侧边栏根组件 ──────────────────────────────────────────────────
export default function Sidebar() {
  const articles = useEditorStore((s) => s.articles)
  const activeArticleId = useEditorStore((s) => s.activeArticleId)
  const sidebarCollapsed = useEditorStore((s) => s.sidebarCollapsed)
  const switchArticle = useEditorStore((s) => s.switchArticle)
  const createArticle = useEditorStore((s) => s.createArticle)
  const deleteArticle = useEditorStore((s) => s.deleteArticle)
  const renameArticle = useEditorStore((s) => s.renameArticle)
  const reorderArticles = useEditorStore((s) => s.reorderArticles)
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar)

  // ── 拖拽状态 ──
  const [dragState, setDragState] = useState({
    draggingIndex: null,
    overIndex: null,
    dropPosition: null, // 'before' | 'after'
  })

  const handleDelete = (id) => {
    if (articles.length === 1) {
      toast.error('至少保留一篇文章')
      return
    }
    deleteArticle(id)
  }

  // ── 拖拽事件 ──
  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    // 延迟设置 dragging 状态，让浏览器先截图拖拽预览
    requestAnimationFrame(() => {
      setDragState((s) => ({ ...s, draggingIndex: index }))
    })
  }, [])

  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault()
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // 根据鼠标位置在目标元素上/下半部分判断放置位置
    const rect = e.currentTarget.getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const position = e.clientY < midY ? 'before' : 'after'
    setDragState((s) => ({
      ...s,
      overIndex: index,
      dropPosition: position,
    }))
  }, [])

  const handleDragLeave = useCallback((e) => {
    // 只在离开 article-item 时清除（忽略子元素冒泡）
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragState((s) => ({ ...s, overIndex: null, dropPosition: null }))
    }
  }, [])

  const handleDrop = useCallback(
    (e, targetIndex) => {
      e.preventDefault()
      const fromIndex = dragState.draggingIndex
      if (fromIndex === null || fromIndex === targetIndex) {
        setDragState({ draggingIndex: null, overIndex: null, dropPosition: null })
        return
      }
      // 根据放置位置计算最终 toIndex
      let toIndex = targetIndex
      if (dragState.dropPosition === 'after') {
        toIndex = targetIndex + 1
      }
      // 从原位置移除后，后面的 index 要减 1
      if (fromIndex < toIndex) {
        toIndex -= 1
      }
      reorderArticles(fromIndex, toIndex)
      setDragState({ draggingIndex: null, overIndex: null, dropPosition: null })
    },
    [dragState.draggingIndex, dragState.dropPosition, reorderArticles]
  )

  const handleDragEnd = useCallback(() => {
    setDragState({ draggingIndex: null, overIndex: null, dropPosition: null })
  }, [])

  return (
    <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
      {/* ── 头部 ── */}
      <div className="sidebar-header">
        {!sidebarCollapsed && (
          <span className="sidebar-title">文章列表</span>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}
        </button>
      </div>

      {/* ── 文章列表（折叠时隐藏）── */}
      {!sidebarCollapsed && (
        <>
          <ul className="article-list">
            {articles.map((article, index) => (
              <ArticleItem
                key={article.id}
                article={article}
                index={index}
                isActive={article.id === activeArticleId}
                onSwitch={switchArticle}
                onDelete={handleDelete}
                onRename={renameArticle}
                dragState={dragState}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ul>

          {/* ── 底部新建按钮 ── */}
          <div className="sidebar-footer">
            <button className="sidebar-new-btn" onClick={createArticle}>
              <PlusCircle size={14} />
              <span>新建文章</span>
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
