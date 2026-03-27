import { useEditorStore } from '../../store/editorStore.js'

export default function Preview() {
  const compiledHtml = useEditorStore((s) => s.compiledHtml)

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <span className="preview-label">公众号预览</span>
        <div className="preview-phone-bar">
          <span className="phone-dot" />
          <span className="phone-dot" />
          <span className="phone-dot" />
        </div>
      </div>
      <div className="preview-scroll">
        <div className="preview-phone-frame">
          <div className="preview-phone-statusbar">
            <span>9:41</span>
            <span>📶 🔋</span>
          </div>
          <div className="preview-phone-content">
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: compiledHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
