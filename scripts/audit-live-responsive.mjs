import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import { serviceAreas } from '../src/data/serviceAreas.js'
import { paintingGuides } from '../src/data/paintingGuides.js'

const origin = 'https://sppaintingremodeling.com.au'
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const output = 'docs/live-responsive-audit'
const routes = [
  '/', '/about', '/services', '/additional-services',
  '/services/residential-painting-melbourne', '/services/commercial-painting-melbourne',
  '/services/interior-painting-melbourne', '/services/exterior-painting-melbourne',
  '/services/roof-painting-melbourne', '/services/fence-painting-melbourne',
  '/services/deck-painting-staining-melbourne', '/services/wallpaper-removal-melbourne',
  '/services/plaster-repairs-melbourne', '/our-process', '/faqs', '/contact', '/gallery',
  '/service-areas', ...serviceAreas.map(area => `/service-areas/${area.slug}`),
  '/painting-guides', ...paintingGuides.map(guide => `/painting-guides/${guide.slug}`),
  '/blog', ...paintingGuides.map(guide => `/blog/${guide.slug}`),
]
const devices = {
  desktop: { viewport: { width: 1440, height: 1000 }, hasTouch: false },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
  ipad: { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true },
}
const screenshotRoutes = new Set(['/', '/about', '/services', '/blog'])
const failures = []
const timings = []
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: edge, headless: true })

async function inspectRoute(context, deviceName, options, route) {
  const page = await context.newPage()
  const runtimeErrors = []
  const criticalFailures = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  page.on('requestfailed', request => {
    if (['document', 'script', 'stylesheet', 'image'].includes(request.resourceType())) {
      criticalFailures.push(`${request.resourceType()}: ${request.url()} (${request.failure()?.errorText || 'failed'})`)
    }
  })
  const started = Date.now()
  try {
    const url = `${origin}${route === '/' ? '/' : `${route}/`}`
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.locator('#main-content h1:visible').first().waitFor({ timeout: 15000 }).catch(() => {})
    const readyMs = Date.now() - started
    if (screenshotRoutes.has(route)) {
      await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager' }))
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 1000) {
          scrollTo(0, y)
          await new Promise(resolve => setTimeout(resolve, 10))
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        scrollTo(0, 0)
      })
    }
    const result = await page.evaluate(() => ({
      h1: document.querySelector('#main-content h1')?.textContent?.trim() || '',
      mainText: document.querySelector('#main-content')?.innerText?.trim().length || 0,
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
      brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.currentSrc || image.src),
      webpImages: [...document.images].filter(image => /\.webp(?:$|[?#])/i.test(image.currentSrc || image.src)).map(image => image.currentSrc || image.src),
      touchUi: document.documentElement.classList.contains('spp-touch-ui'),
      navToggle: Boolean(document.querySelector('[aria-label="Toggle menu"]')),
      resourceBytes: performance.getEntriesByType('resource').reduce((sum, item) => sum + (item.transferSize || 0), 0),
      resourceCount: performance.getEntriesByType('resource').length,
      navigation: (() => {
        const nav = performance.getEntriesByType('navigation')[0]
        return nav ? { responseStart: Math.round(nav.responseStart), domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) } : {}
      })(),
    }))
    const label = `${deviceName} ${route}`
    if (!response || response.status() >= 400) failures.push(`${label}: HTTP ${response?.status() || 'no response'}`)
    if (!result.h1) failures.push(`${label}: no visible page heading`)
    if (result.mainText < 40) failures.push(`${label}: blank or incomplete content`)
    if (result.overflow) failures.push(`${label}: horizontal overflow`)
    if (result.brokenImages.length) failures.push(`${label}: broken images: ${result.brokenImages.join(', ')}`)
    if (result.webpImages.length) failures.push(`${label}: old WebP requests: ${result.webpImages.join(', ')}`)
    if (runtimeErrors.length) failures.push(`${label}: runtime errors: ${runtimeErrors.join(' | ')}`)
    if (criticalFailures.length) failures.push(`${label}: critical requests: ${criticalFailures.join(' | ')}`)
    if (options.hasTouch && !result.touchUi) failures.push(`${label}: touch compatibility mode missing`)
    if (options.viewport.width <= 820 && !result.navToggle) failures.push(`${label}: navigation toggle missing`)
    if (route === '/') timings.push({ device: deviceName, readyMs, ...result.navigation, resourceBytes: result.resourceBytes, resourceCount: result.resourceCount })
    if (screenshotRoutes.has(route)) {
      const slug = route === '/' ? 'home' : route.slice(1)
      await page.screenshot({ path: `${output}/${deviceName}-${slug}.png`, fullPage: true })
    }
  } catch (error) {
    failures.push(`${deviceName} ${route}: audit exception: ${error.message}`)
  } finally {
    await page.close()
  }
}

try {
  for (const [deviceName, options] of Object.entries(devices)) {
    const context = await browser.newContext({ ...options, reducedMotion: 'reduce' })
    let cursor = 0
    const workers = Array.from({ length: 8 }, async () => {
      while (cursor < routes.length) await inspectRoute(context, deviceName, options, routes[cursor++])
    })
    await Promise.all(workers)
    await context.close()
  }
} finally {
  await browser.close()
}

const report = { checkedAt: new Date().toISOString(), routes: routes.length, devices: Object.keys(devices), checks: routes.length * 3, timings, failures }
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1
