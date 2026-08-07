import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4194
const origin = `http://127.0.0.1:${port}/`
const liveApi = 'https://sppaintingremodeling.com.au/wp-json/spp/v1'
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' }

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'
    const filepath = normalize(join(root, pathname))
    if (!filepath.startsWith(root)) throw new Error('Invalid path')
    const info = await stat(filepath)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': mime[extname(filepath)] || 'application/octet-stream' })
    response.end(await readFile(filepath))
  } catch {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(await readFile(join(root, 'index.html')))
  }
})

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })

async function preparePage(viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  await page.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
  await page.route('**/wp-json/spp/v1/**', async route => {
    const endpoint = new URL(route.request().url()).pathname.split('/spp/v1')[1]
    const liveResponse = await fetch(`${liveApi}${endpoint}`, { headers: { accept: 'application/json' } })
    await route.fulfill({ status: liveResponse.status, contentType: 'application/json', body: await liveResponse.text() })
  })
  return page
}

async function waitForContent(page) {
  await page.locator('.content-status').waitFor({ state: 'attached' })
  await page.waitForFunction(() => document.querySelector('.content-status')?.dataset.contentState === 'ready')
}

try {
  const desktop = await preparePage({ width: 1440, height: 900 })
  await desktop.goto(origin, { waitUntil: 'networkidle' })
  await waitForContent(desktop)
  await desktop.locator('.hero').screenshot({ path: 'docs/homepage-hero-fixed-desktop.png' })
  await desktop.locator('.commercial').scrollIntoViewIfNeeded()
  await desktop.locator('.commercial').screenshot({ path: 'docs/homepage-process-fixed-desktop.png' })
  await desktop.evaluate(() => {
    history.pushState({}, '', '/services/residential-painting-melbourne')
    dispatchEvent(new PopStateEvent('popstate'))
  })
  await desktop.getByRole('heading', { name: /Residential Painting/i }).first().waitFor()
  await desktop.locator('.scope-section').scrollIntoViewIfNeeded()
  await desktop.locator('.scope-section').screenshot({ path: 'docs/service-scope-icons-fixed-desktop.png' })
  await desktop.close()

  const mobile = await preparePage({ width: 390, height: 844 })
  await mobile.goto(origin, { waitUntil: 'networkidle' })
  await waitForContent(mobile)
  await mobile.locator('.hero').screenshot({ path: 'docs/homepage-hero-fixed-mobile.png' })
  await mobile.close()
  console.log('Captured fixed homepage and service-card previews with live WordPress content.')
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
