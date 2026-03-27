/**
 * 截图脚本：生成每个主题的预览截图 + 白天/黑夜全局截图
 * 运行方式：node scripts/take-screenshots.mjs
 * 要求：先启动 dev server（npm run dev -- --port 5199）
 */
import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots')
const BASE_URL = 'http://localhost:5199'

// 5 个主题按钮的 data-theme 属性
const THEMES = [
  { id: 'default', filename: 'theme-default' },
  { id: 'tech-blue', filename: 'theme-tech-blue' },
  { id: 'literary', filename: 'theme-literary' },
  { id: 'dark', filename: 'theme-dark' },
  { id: 'green-forest', filename: 'theme-green-forest' },
]

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  })

  const page = await browser.newPage()

  // 先清除 localStorage 以获得默认状态
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle0' })
  await sleep(1500) // 等待 CodeMirror 完全渲染

  // ── 截图: 完整界面（白天模式）──
  // 默认就是白天模式
  console.log('📸 full-light.png')
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'full-light.png'),
    fullPage: false,
  })

  // ── 截图: 完整界面（黑夜模式）──
  const modeBtn = await page.$('.mode-toggle-btn')
  if (modeBtn) {
    await modeBtn.click()
    await sleep(500)
  }
  console.log('📸 full-dark.png')
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'full-dark.png'),
    fullPage: false,
  })

  // 切回白天模式
  if (modeBtn) {
    await modeBtn.click()
    await sleep(500)
  }

  // ── 截图: 每个主题 ──
  for (const theme of THEMES) {
    // 点击对应主题按钮
    const themeBtn = await page.$(`[data-theme="${theme.id}"]`)
    if (themeBtn) {
      await themeBtn.click()
      await sleep(800) // 等待预览更新
    }

    console.log(`📸 ${theme.filename}.png`)
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${theme.filename}.png`),
      fullPage: false,
    })
  }

  await browser.close()
  console.log('✅ 所有截图完成！')
}

main().catch((e) => {
  console.error('❌ 截图失败:', e)
  process.exit(1)
})
