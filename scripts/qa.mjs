import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4188
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const routes = [
  ['/', 'Made to feel'],
  ['/about', 'Care in every coat'],
  ['/services', 'Painting & property services'],
  ['/services/residential-painting-melbourne', 'Residential Painting'],
  ['/services/commercial-painting-melbourne', 'Commercial Painting'],
  ['/services/interior-painting-melbourne', 'Interior Painting'],
  ['/services/exterior-painting-melbourne', 'Exterior Painting'],
  ['/services/roof-painting-melbourne', 'Roof Painting'],
  ['/services/fence-painting-melbourne', 'Fence Painting'],
  ['/services/deck-painting-staining-melbourne', 'Deck Painting'],
  ['/services/wallpaper-removal-melbourne', 'Wallpaper Removal'],
  ['/services/plaster-repairs-melbourne', 'Plaster Repairs'],
  ['/our-process', 'Our painting process'],
  ['/faqs', 'Frequently asked questions'],
  ['/contact', 'Get in touch'],
]

const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['tablet', { width: 768, height: 1024 }],
  ['mobile', { width: 390, height: 844 }],
]

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
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
    response.end(await readFile(filepath))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })
const failures = []
let checks = 0

function check(condition, message) {
  checks += 1
  if (!condition) failures.push(message)
}

try {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const runtimeErrors = []
    page.on('pageerror', error => runtimeErrors.push(error.message))

    for (const [route, expected] of routes) {
      runtimeErrors.length = 0
      await page.goto(`${origin}#${route}`, { waitUntil: 'domcontentloaded' })
      await page.locator('#main-content').waitFor({ state: 'attached' })
      await page.locator('h1').first().waitFor({ state: 'visible' })
      await page.waitForTimeout(120)

      const result = await page.evaluate(() => {
        const images = [...document.images]
        const emptyButtons = [...document.querySelectorAll('button')].filter(button => !button.textContent.trim() && !button.getAttribute('aria-label'))
        let schemaValid = true
        try { JSON.parse(document.querySelector('#page-structured-data')?.textContent || '{}') } catch { schemaValid = false }
        return {
          h1Count: document.querySelectorAll('h1').length,
          h1: document.querySelector('h1')?.textContent || '',
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          brokenImages: images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src),
          emptyAlts: images.filter(image => !image.alt.trim()).map(image => image.src),
          emptyButtons: emptyButtons.length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          schemaValid,
        }
      })

      const label = `${viewportName} ${route}`
      check(result.h1Count === 1, `${label}: expected one H1, found ${result.h1Count}`)
      check(result.h1.toLowerCase().includes(expected.toLowerCase()), `${label}: H1 did not include “${expected}”`)
      check(result.title.includes('Superior Plus'), `${label}: missing route title`)
      check(result.description.length >= 70, `${label}: meta description too short`)
      check(result.canonical.includes('paint-2'), `${label}: canonical missing`)
      check(result.schemaValid, `${label}: invalid structured data`)
      check(result.brokenImages.length === 0, `${label}: broken images: ${result.brokenImages.join(', ')}`)
      check(result.emptyAlts.length === 0, `${label}: images missing alt text`)
      check(result.emptyButtons === 0, `${label}: unnamed buttons detected`)
      check(result.overflow <= 1, `${label}: horizontal overflow of ${result.overflow}px`)
      check(runtimeErrors.length === 0, `${label}: runtime errors: ${runtimeErrors.join(' | ')}`)
    }
    await context.close()
  }

  const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await interactionContext.newPage()

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('.menu-btn').click()
  check(await page.locator('#mobile-navigation').isVisible(), 'mobile menu: navigation did not open')
  check(await page.locator('#mobile-services-folder button').count() === 9, 'mobile menu: all nine service pages are not visible')
  await page.locator('#mobile-services-folder button', { hasText: 'Interior Painting' }).click()
  await page.waitForURL(/#\/services\/interior-painting-melbourne$/)
  check(page.url().endsWith('#/services/interior-painting-melbourne'), 'mobile submenu: service-page navigation failed')
  await page.locator('.menu-btn').click()
  await page.locator('#mobile-navigation button', { hasText: 'Services' }).click()
  await page.waitForURL(/#\/services$/)
  check(page.url().endsWith('#/services'), 'mobile menu: Services navigation failed')

  await page.goto(`${origin}#/faqs`, { waitUntil: 'domcontentloaded' })
  const secondFaq = page.locator('.faq-item').nth(1)
  await secondFaq.locator('button').click()
  check(await secondFaq.locator('.faq-answer').isVisible(), 'FAQ: accordion did not open')
  check(await secondFaq.locator('button').getAttribute('aria-expanded') === 'true', 'FAQ: aria-expanded did not update')

  await page.goto(`${origin}#/contact`, { waitUntil: 'domcontentloaded' })
  const form = page.locator('.full-quote-form')
  await form.locator('input').nth(0).fill('QA Test')
  await form.locator('input').nth(1).fill('0400000000')
  await form.locator('input').nth(2).fill('qa@example.com')
  await form.locator('input').nth(3).fill('Chadstone')
  await form.locator('select').nth(0).selectOption({ label: 'Residential Painting' })
  await form.locator('textarea').fill('Automated quote form interaction test.')
  await form.locator('button[type="submit"], button.btn-wide').click()
  check(await form.locator('.form-success').isVisible(), 'contact form: success state did not appear')

  await page.goto(`${origin}#/services/residential-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  await page.locator('.related-card').first().click()
  await page.waitForTimeout(100)
  check(!page.url().endsWith('residential-painting-melbourne'), 'related service: navigation did not change route')

  await interactionContext.close()
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`QA checks: ${checks}`)
console.log(`Routes: ${routes.length}`)
console.log(`Viewports: ${viewports.map(([name]) => name).join(', ')}`)
if (failures.length) {
  console.error(`Failures: ${failures.length}`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log('Failures: 0')
  console.log('Result: PASS')
}
