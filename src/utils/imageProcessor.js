import imageCompression from 'browser-image-compression'

/**
 * 将 File 对象转为 base64 字符串（带压缩）
 * @param {File} file
 * @returns {Promise<string>} base64 DataURL
 */
export async function fileToBase64(file) {
  // 如果图片大于 800KB，先压缩
  let targetFile = file
  if (file.size > 800 * 1024) {
    try {
      targetFile = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })
    } catch {
      targetFile = file
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(targetFile)
  })
}

/**
 * 生成 Markdown 图片语法
 * @param {string} src base64 或 URL
 * @param {string} alt
 * @returns {string}
 */
export function buildImageMarkdown(src, alt = '图片') {
  return `![${alt}](${src})\n`
}
