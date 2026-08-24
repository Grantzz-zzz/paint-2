import { createServer } from 'node:http'
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4197
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

async function themeShell() {
  const html = await readFile(join(root, 'index.html'), 'utf8')
  return html.replace(
    '<div id="root"></div>',
    `<script id="spp-react-runtime-config">window.__SPP_SITE_URL__=${JSON.stringify(origin)};window.__SPP_ROUTER_BASE__="";window.__SPP_CONTENT_API__="";window.__SPP_SEO_SERVER_MANAGED__=true;</script><div id="root"><div class="spp-boot-fallback" role="status">Loading the current website content…</div></div>`,
  )
}

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
    response.end(pathname === '/index.html' ? await themeShell() : await readFile(filepath))
  } catch {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(await themeShell())
  }
})

const manifest = JSON.parse(await readFile(join(root, '.vite', 'manifest.json'), 'utf8'))
const javascript = (await Promise.all(Object.values(manifest)
  .map(item => item.file)
  .filter(file => file?.endsWith('.js'))
  .map(file => readFile(join(root, file), 'utf8')))).join('\n')

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectFiles(path))
    else files.push(path)
  }
  return files
}

const bundledFiles = await collectFiles(root)

const failures = []
let checks = 0
const check = (condition, message) => {
  checks += 1
  if (!condition) failures.push(message)
}

check(!/\?\.(?:[A-Za-z_$[(])/.test(javascript), 'production JavaScript still contains optional-chaining syntax')
check(!/\?\?/.test(javascript), 'production JavaScript still contains nullish-coalescing syntax')
check(!/Object\.hasOwn\s*\(/.test(javascript), 'production JavaScript still calls Object.hasOwn directly')
check(!/\.at\s*\(/.test(javascript), 'production JavaScript still calls Array.prototype.at directly')
check(!/\.replaceAll\s*\(/.test(javascript), 'production JavaScript still calls String.prototype.replaceAll directly')
check(!bundledFiles.some(file => file.toLowerCase().endsWith('.webp')), 'production bundle still contains WebP-only theme media')

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })
const cases = [
  ['classic-ipad-portrait', { width: 768, height: 1024 }, '/'],
  ['ipad-air-portrait', { width: 820, height: 1180 }, '/services/residential-painting-melbourne'],
  ['ipad-landscape', { width: 1180, height: 820 }, '/faqs'],
  ['classic-ipad-blog', { width: 768, height: 1024 }, '/blog'],
]

try {
  for (const [name, viewport, route] of cases) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const runtimeErrors = []
    page.on('pageerror', error => runtimeErrors.push(error.message))
    await page.addInitScript(() => {
      Object.hasOwn = undefined
      Array.prototype.at = undefined
      String.prototype.replaceAll = undefined
      Object.fromEntries = undefined
      window.queueMicrotask = undefined
    })
    await page.goto(`${origin}#${route}`, { waitUntil: 'domcontentloaded' })
    await page.locator('#main-content h1').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    const result = await page.evaluate(() => ({
      text: document.querySelector('#root')?.innerText.trim() || '',
      h1: document.querySelector('#main-content h1')?.innerText.trim() || '',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      hasOwn: typeof Object.hasOwn,
      at: typeof Array.prototype.at,
      fromEntries: typeof Object.fromEntries,
      queueMicrotask: typeof window.queueMicrotask,
      runtimeConfig: Boolean(window.__SPP_SITE_URL__) && window.__SPP_SEO_SERVER_MANAGED__ === true,
      fallbackRemoved: !document.querySelector('.spp-boot-fallback'),
    }))
    check(Boolean(result.text), `${name}: root is blank`)
    check(Boolean(result.h1), `${name}: page did not render an H1`)
    check(!result.overflow, `${name}: page has horizontal overflow`)
    check(runtimeErrors.length === 0, `${name}: runtime errors: ${runtimeErrors.join(' | ')}`)
    check(result.hasOwn === 'function' && result.at === 'function' && result.fromEntries === 'function' && result.queueMicrotask === 'function', `${name}: compatibility helpers did not initialise`)
    check(result.runtimeConfig, `${name}: WordPress runtime bridge did not initialise before React`)
    check(result.fallbackRemoved, `${name}: boot fallback remained after React rendered`)
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager' }))
    await page.evaluate(async () => {
      const height = document.documentElement.scrollHeight
      for (let y = 0; y < height; y += 700) {
        window.scrollTo(0, y)
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      await Promise.race([
        Promise.all([...document.images].map(image => image.complete
          ? Promise.resolve()
          : new Promise(resolve => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }))),
        new Promise(resolve => setTimeout(resolve, 4000)),
      ])
      window.scrollTo(0, 0)
    })
    const images = await page.evaluate(() => ({
      webp: [...document.images].filter(image => /\.webp(?:$|[?#])/i.test(image.currentSrc || image.src)).length,
      broken: [...document.images].filter(image => image.complete && !image.naturalWidth).length,
    }))
    check(images.webp === 0, `${name}: rendered page still requests ${images.webp} WebP image(s)`)
    check(images.broken === 0, `${name}: rendered page has ${images.broken} broken image(s)`)
    if (name === 'classic-ipad-portrait') {
      const flip = await page.evaluate(() => {
        const card = document.querySelector('.home-service-flip')
        const inner = card?.querySelector('.home-service-flip-inner')
        const front = card?.querySelector('.home-service-front')
        const back = card?.querySelector('.home-service-back')
        const before = {
          touchClass: document.documentElement.classList.contains('spp-touch-ui'),
          transform: inner ? getComputedStyle(inner).transform : '',
          front: front ? getComputedStyle(front).display : '',
          back: back ? getComputedStyle(back).display : '',
        }
        card?.click()
        return new Promise(resolve => setTimeout(() => resolve({
          ...before,
          flipped: card?.classList.contains('is-flipped') || false,
          flippedFront: front ? getComputedStyle(front).display : '',
          flippedBack: back ? getComputedStyle(back).display : '',
        }), 50))
      })
      check(flip.touchClass, `${name}: touch compatibility class is missing`)
      check(flip.transform === 'none', `${name}: service card still uses a 3D transform`)
      check(flip.front !== 'none' && flip.back === 'none', `${name}: service card front is not stable before tap`)
      check(flip.flipped && flip.flippedFront === 'none' && flip.flippedBack !== 'none', `${name}: service card does not swap to its details after tap`)
    }
    if (viewport.width <= 820) {
      const menu = page.getByRole('button', { name: 'Toggle menu' })
      const menuVisible = await menu.isVisible().catch(() => false)
      check(menuVisible, `${name}: tablet navigation control is not visible`)
      if (menuVisible) {
        await menu.click()
        check(await page.locator('#mobile-navigation').isVisible(), `${name}: tablet navigation does not open`)
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`iPad compatibility checks: ${checks}`)
console.log(`Failures: ${failures.length}`)
failures.forEach(failure => console.error(`- ${failure}`))
if (failures.length) process.exit(1)
console.log('Result: PASS')
