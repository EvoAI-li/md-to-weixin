import { useState } from 'react'
import { useEditorStore } from '../../store/editorStore.js'
import { copyHtmlToClipboard } from '../../utils/clipboard.js'
import toast from 'react-hot-toast'
import { Copy, Check } from 'lucide-react'

export default function CopyButton() {
  const compiledHtml = useEditorStore((s) => s.compiledHtml)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!compiledHtml) {
      toast.error('内容为空，无法复制')
      return
    }
    const ok = await copyHtmlToClipboard(compiledHtml)
    if (ok) {
      setCopied(true)
      toast.success('已复制！请粘贴到公众号后台', {
        duration: 3000,
        icon: '📋',
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('复制失败，请手动选择内容复制')
    }
  }

  return (
    <button
      className={`copy-btn ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      title="复制排版后的HTML，可直接粘贴到公众号后台"
    >
      {copied ? (
        <>
          <Check size={15} />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy size={15} />
          <span>复制到公众号</span>
        </>
      )}
    </button>
  )
}
