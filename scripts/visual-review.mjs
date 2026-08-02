import { createServer } from 'node:http'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const output = join(process.cwd(), '.visual-review')
const port = 4190
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin)
    const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)
    const filepath = normalize(join(root, pathname))
    if (!filepath.startsWith(root)) throw new Error('Invalid path')
    const info = await stat(filepath)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': mime[extname(filepath)] || 'application/octet-stream' })
    response.end(await readFile(filepath))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

const routes = [
  ['about', '/about'],
  ['process', '/our-process'],
  ['service', '/services/commercial-painting-melbourne'],
  ['faq', '/faqs'],
  ['contact', '/contact'],
]
const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
]

await mkdir(output, { recursive: true })
await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
    const page = await context.newPage()
    for (const [name, route] of routes) {
      await page.goto(`${origin}#${route}`, { waitUntil: 'networkidle' })
      await page.locator('h1').first().waitFor({ state: 'visible' })
      await page.evaluate(async () => {
        const step = Math.max(420, Math.floor(window.innerHeight * .72))
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise(resolve => setTimeout(resolve, 45))
        }
        window.scrollTo(0, 0)
        await new Promise(resolve => setTimeout(resolve, 120))
      })
      await page.screenshot({
        path: join(output, `${name}-${viewportName}.png`),
        fullPage: true,
      })
    }
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`Visual review screenshots written to ${output}`)
