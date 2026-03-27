import { Toaster } from 'react-hot-toast'
import { useMarkdown } from './hooks/useMarkdown.js'
import Editor from './components/Editor/index.jsx'
import Preview from './components/Preview/index.jsx'
import ThemeSwitcher from './components/ThemeSwitcher/index.jsx'
import CopyButton from './components/CopyButton/index.jsx'
import Sidebar from './components/Sidebar/index.jsx'
import { FileText, Sun, Moon } from 'lucide-react'
import { useEditorStore } from './store/editorStore.js'
import './styles/app.css'

function AppContent() {
  useMarkdown()
  const uiMode = useEditorStore((s) => s.uiMode)
  const toggleUiMode = useEditorStore((s) => s.toggleUiMode)
  const activeArticleId = useEditorStore((s) => s.activeArticleId)

  return (
    <div className="app" data-mode={uiMode}>
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-left">
          <FileText size={20} className="header-logo-icon" />
          <span className="header-title">MD转公众号</span>
          <span className="header-subtitle">Markdown 排版工具</span>
        </div>
        <div className="header-center">
          <ThemeSwitcher />
        </div>
        <div className="header-right">
          {/* 明暗切换 */}
          <button
            className="mode-toggle-btn"
            onClick={toggleUiMode}
            title={uiMode === 'dark' ? '切换到白天模式' : '切换到黑夜模式'}
          >
            {uiMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{uiMode === 'dark' ? '白天' : '黑夜'}</span>
          </button>
          <CopyButton />
        </div>
      </header>

      {/* 主编辑区 */}
      <main className="app-main">
        <Sidebar />
        <div className="split-line" />
        <Editor key={activeArticleId} />
        <div className="split-line" />
        <Preview />
      </main>
    </div>
  )
}

export default function App() {
  const uiMode = useEditorStore((s) => s.uiMode)
  return (
    <>
      <AppContent />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: uiMode === 'dark' ? '#1e1e2e' : '#ffffff',
            color: uiMode === 'dark' ? '#cdd6f4' : '#24292e',
            border: `1px solid ${uiMode === 'dark' ? '#313244' : '#e1e4e8'}`,
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#a6e3a1', secondary: uiMode === 'dark' ? '#1e1e2e' : '#fff' },
          },
          error: {
            iconTheme: { primary: '#f38ba8', secondary: uiMode === 'dark' ? '#1e1e2e' : '#fff' },
          },
        }}
      />
    </>
  )
}
