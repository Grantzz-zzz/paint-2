import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4188
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const routes = [
  ['/', 'Professional painters'],
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

      const result = await page.evaluate(async () => {
        const images = [...document.images]
        const sources = [...new Set(images.map(image => image.currentSrc || image.src))]
        const brokenImages = (await Promise.all(sources.map(source => new Promise(resolve => {
          const probe = new Image()
          probe.onload = () => resolve(null)
          probe.onerror = () => resolve(source)
          probe.src = source
        })))).filter(Boolean)
        const emptyButtons = [...document.querySelectorAll('button')].filter(button => !button.textContent.trim() && !button.getAttribute('aria-label'))
        let schemaValid = true
        try { JSON.parse(document.querySelector('#page-structured-data')?.textContent || '{}') } catch { schemaValid = false }
        return {
          h1Count: document.querySelectorAll('h1').length,
          h1: document.querySelector('h1')?.textContent || '',
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          brokenImages,
          emptyAlts: images.filter(image => !image.alt.trim()).map(image => image.src),
          emptyButtons: emptyButtons.length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          logoFit: getComputedStyle(document.querySelector('.logo-wrap img')).objectFit,
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
      check(result.logoFit === 'contain', `${label}: logo is cropped because object-fit is “${result.logoFit}”`)
      check(runtimeErrors.length === 0, `${label}: runtime errors: ${runtimeErrors.join(' | ')}`)
    }
    await context.close()
  }

  const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await interactionContext.newPage()

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('.menu-btn').click()
  check(await page.locator('#mobile-navigation').isVisible(), 'mobile menu: navigation did not open')
  check(await page.locator('#mobile-services-menu button').count() === 9, 'mobile menu: all nine service pages are not visible')
  await page.locator('#mobile-services-menu button', { hasText: 'Interior Painting' }).click()
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
  await form.locator('[name="name"]').fill('QA Test')
  await form.locator('[name="phone"]').fill('0400000000')
  await form.locator('[name="email"]').fill('qa@example.com')
  await form.locator('[name="suburb"]').fill('Chadstone')
  await form.locator('[name="service"]').selectOption({ label: 'Residential Painting' })
  await form.locator('textarea').fill('Automated quote form interaction test.')
  await form.locator('button[type="submit"], button.btn-wide').click()
  check(await form.locator('.form-success').isVisible(), 'contact form: success state did not appear')

  await page.goto(`${origin}#/services/residential-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  await page.locator('.related-card').first().click()
  await page.waitForTimeout(100)
  check(!page.url().endsWith('residential-painting-melbourne'), 'related service: navigation did not change route')

  await page.goto(`${origin}#/services/fence-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  check(await page.locator('.client-media-card').count() === 8, 'project gallery: initial progressive set is incorrect')
  await page.locator('.gallery-more').click()
  check(await page.locator('.client-media-card').count() === 22, 'project gallery: full unique media set did not expand')
  await page.locator('.client-media-card').last().click()
  check(await page.locator('.media-lightbox').isVisible() && await page.locator('.media-lightbox video').count() === 1, 'project gallery: video lightbox did not open')
  await page.locator('.lightbox-close').click()
  check(!(await page.locator('.media-lightbox').count()), 'project gallery: lightbox did not close')

  const apiPage = await interactionContext.newPage()
  await apiPage.addInitScript(() => {
    window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1`
    window.__SPP_FORM_NONCE__ = 'qa-form-nonce'
  })
  let quoteAttempts = 0
  await apiPage.route('**/wp-json/spp/v1/**', async route => {
    const url = new URL(route.request().url())
    const endpoint = url.pathname.split('/spp/v1')[1]
    if (endpoint === '/bootstrap') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: '1.0.0',
          data: { quote_form: { enabled: true, privacy_text: '' } },
        }),
      })
    }
    if (endpoint === '/services') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: '1.0.0', data: [] }),
      })
    }
    if (endpoint === '/quote') {
      quoteAttempts += 1
      return route.fulfill({
        status: quoteAttempts === 1 ? 502 : 200,
        contentType: 'application/json',
        body: JSON.stringify(
          quoteAttempts === 1
            ? { code: 'spp_quote_delivery_failed', message: 'Temporary delivery failure.' }
            : { schema_version: '1.0.0', data: { delivered: true, message: 'Delivered.' } },
        ),
      })
    }
    return route.fulfill({ status: 404, body: '{}' })
  })
  await apiPage.goto(`${origin}#/contact`, { waitUntil: 'domcontentloaded' })
  await apiPage.locator('[data-content-state="ready"]').waitFor()
  const apiForm = apiPage.locator('.full-quote-form')
  await apiForm.locator('[name="name"]').fill('Delivery QA')
  await apiForm.locator('[name="phone"]').fill('0400000000')
  await apiForm.locator('[name="email"]').fill('delivery@example.com')
  await apiForm.locator('[name="suburb"]').fill('Melbourne')
  await apiForm.locator('[name="service"]').selectOption({ label: 'Residential Painting' })
  await apiForm.locator('[name="details"]').fill('Failure and retry delivery confirmation test.')
  await apiForm.locator('button.btn-wide').click()
  await apiForm.locator('.form-error').waitFor()
  check(await apiForm.locator('.form-error').innerText() === 'Temporary delivery failure.', 'contact form: delivery failure was not shown')
  check(!(await apiForm.locator('.form-success').count()), 'contact form: success appeared before delivery confirmation')
  await apiForm.locator('button.btn-wide').click()
  await apiForm.locator('.form-success').waitFor()
  check(quoteAttempts === 2, 'contact form: failed submission was not retryable')
  check(await apiForm.locator('.form-success').isVisible(), 'contact form: confirmed retry did not show success')

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
