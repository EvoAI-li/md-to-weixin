import { useEditorStore } from '../../store/editorStore.js'
import { THEMES } from '../../themes/index.js'

export default function ThemeSwitcher() {
  const themeId = useEditorStore((s) => s.themeId)
  const setThemeId = useEditorStore((s) => s.setThemeId)

  return (
    <div className="theme-switcher">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          className={`theme-btn ${themeId === theme.id ? 'active' : ''}`}
          onClick={() => setThemeId(theme.id)}
          title={theme.name}
          data-theme={theme.id}
        >
          <span className="theme-emoji">{theme.emoji}</span>
          <span className="theme-name">{theme.name}</span>
        </button>
      ))}
    </div>
  )
}
