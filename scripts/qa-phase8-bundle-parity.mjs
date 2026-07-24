import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { chromium } from 'playwright-core'

const root = resolve(import.meta.dirname, '..')
const referenceRoot = join(root, 'dist')
const targetRoot = join(root, 'wordpress-theme', 'superior-plus', 'react-dist')
const outputRoot = join(root, 'wordpress-theme', 'dist', 'phase8')
const referenceOrigin = 'http://127.0.0.1:4191'
const externalTarget = Boolean(process.env.SPP_PHASE8_WP_URL)
const targetOrigin = (process.env.SPP_PHASE8_WP_URL || 'http://127.0.0.1:4192').replace(/\/$/, '')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const maxVisualDifference = 0.05

const routes = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['our-process', '/our-process'],
  ['faqs', '/faqs'],
  ['contact', '/contact'],
  ['residential-painting', '/services/residential-painting-melbourne'],
  ['commercial-painting', '/services/commercial-painting-melbourne'],
  ['interior-painting', '/services/interior-painting-melbourne'],
  ['exterior-painting', '/services/exterior-painting-melbourne'],
  ['roof-painting', '/services/roof-painting-melbourne'],
  ['fence-painting', '/services/fence-painting-melbourne'],
  ['deck-painting-staining', '/services/deck-painting-staining-melbourne'],
  ['wallpaper-removal', '/services/wallpaper-removal-melbourne'],
  ['plaster-repairs', '/services/plaster-repairs-melbourne'],
]
const requestedRoute = process.env.SPP_PHASE8_ROUTE || ''
const activeRoutes = requestedRoute ? routes.filter(([, route]) => route === requestedRoute) : routes
if (!activeRoutes.length) throw new Error(`Unknown SPP_PHASE8_ROUTE: ${requestedRoute}`)

const viewports = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 820, height: 1000 },
  mobile: { width: 390, height: 844 },
}

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
  '.txt': 'text/plain; charset=utf-8',
}

const manifest = JSON.parse(await readFile(join(targetRoot, '.vite', 'manifest.json'), 'utf8'))
const entry = manifest['index.html'] || manifest['src/main.jsx']
if (!entry?.file) throw new Error('The WordPress React manifest has no application entry')

const targetShell = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script>window.__SPP_SITE_URL__=${JSON.stringify(`${targetOrigin}/`)};window.__SPP_CONTENT_API__=${JSON.stringify(`${targetOrigin}/wp-json/spp/v1`)};window.__SPP_FORM_NONCE__="phase8";</script>
${(entry.css || []).map(file => `<link rel="stylesheet" href="/${file}">`).join('')}
<script type="module" src="/${entry.file}"></script>
</head><body class="spp-react-frontend"><div id="root"></div></body></html>`

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

async function serveFile(base, pathname, response) {
  const filepath = normalize(join(base, decodeURIComponent(pathname)))
  if (!filepath.startsWith(base)) throw new Error('Invalid path')
  const info = await stat(filepath)
  if (!info.isFile()) throw new Error('Not a file')
  response.writeHead(200, { 'Content-Type': mime[extname(filepath)] || 'application/octet-stream' })
  response.end(await readFile(filepath))
}

function createReferenceServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, referenceOrigin)
      const pathname = url.pathname === '/' ? '/index.html' : url.pathname
      await serveFile(referenceRoot, pathname, response)
    } catch {
      response.writeHead(404)
      response.end('Not found')
    }
  })
}

function createTargetServer() {
  return createServer(async (request, response) => {
    const url = new URL(request.url, targetOrigin)
    if (url.pathname.startsWith('/wp-json/spp/v1/')) {
      const endpoint = url.pathname.slice('/wp-json/spp/v1'.length)
      const collections = new Set(['/services', '/projects', '/faqs', '/testimonials'])
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      response.end(JSON.stringify({
        schema_version: '1.0.0',
        data: collections.has(endpoint) ? [] : {},
      }))
      return
    }
    try {
      if (url.pathname.startsWith('/assets/')) {
        await serveFile(targetRoot, url.pathname, response)
        return
      }
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end(targetShell)
    } catch {
      response.writeHead(404)
      response.end('Not found')
    }
  })
}

async function listen(server, port) {
  await new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolveListen)
  })
}

async function revealPage(page) {
  await page.evaluate(() => document.fonts?.ready)
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach(image => {
      image.loading = 'eager'
    })
  })
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate(position => window.scrollTo(0, position), y)
    await page.waitForTimeout(25)
  }
  await page.evaluate(async () => {
    const loaded = Promise.all([...document.images].map(image => image.complete
      ? Promise.resolve()
      : new Promise(resolveImage => {
          image.addEventListener('load', resolveImage, { once: true })
          image.addEventListener('error', resolveImage, { once: true })
        })))
    await Promise.race([
      loaded,
      new Promise(resolveWait => setTimeout(resolveWait, 5000)),
    ])
    await Promise.all([...document.images].map(image => image.decode?.().catch(() => {}) || Promise.resolve()))
    await new Promise(resolveFrame => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)))
  })
  await page.evaluate(() => {
    document.querySelectorAll('#root [style]').forEach(element => {
      if (element.style.opacity === '0') {
        element.style.setProperty('opacity', '1', 'important')
        element.style.setProperty('transform', 'none', 'important')
      }
    })
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(100)
}

async function inventory(page) {
  return page.evaluate(() => {
    const root = document.querySelector('#root')
    const normal = value => String(value || '').replace(/\s+/g, ' ').trim()
    const normalizeUrl = value => {
      if (!value) return ''
      if (/^(tel:|mailto:)/i.test(value)) return value.toLowerCase()
      try {
        const parsed = new URL(value, location.href)
        if (parsed.hash.startsWith('#/')) return parsed.hash.slice(1).replace(/\/+$/, '') || '/'
        if (parsed.hostname === 'grantzz-zzz.github.io') {
          return parsed.pathname.replace(/^\/paint-2/, '').replace(/\/+$/, '') || '/'
        }
        if (parsed.origin === location.origin) return parsed.pathname.replace(/\/+$/, '') || '/'
        return parsed.href
      } catch {
        return value
      }
    }
    const normalizeAsset = value => {
      if (!value) return ''
      const parsed = new URL(value, location.href)
      const marker = '/assets/'
      const index = parsed.pathname.indexOf(marker)
      return index >= 0 ? parsed.pathname.slice(index + marker.length) : parsed.pathname
    }
    const visibleText = normal(root.innerText)
    return {
      h1: [...root.querySelectorAll('h1')].map(node => normal(node.innerText)),
      headings: [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(node => `${node.tagName}:${normal(node.innerText)}`),
      sections: [...root.querySelectorAll('main section')].map(node => `${node.id}|${normal(node.className)}|${normal(node.querySelector('h1,h2,h3')?.innerText)}`),
      text: visibleText,
      images: [...root.querySelectorAll('img')].map(image => ({
        src: normalizeAsset(image.currentSrc || image.src),
        alt: image.alt,
        loaded: image.complete && image.naturalWidth > 0,
        naturalSize: [image.naturalWidth, image.naturalHeight],
        opacity: getComputedStyle(image).opacity,
        revealOpacity: image.closest('.reveal') ? getComputedStyle(image.closest('.reveal')).opacity : '',
      })),
      videos: [...root.querySelectorAll('video')].map(video => ({
        src: normalizeAsset(video.currentSrc || video.src),
        poster: normalizeAsset(video.poster),
        controls: video.controls,
      })),
      links: [...root.querySelectorAll('a')].map(link => `${normal(link.innerText)}|${normalizeUrl(link.getAttribute('href'))}|${link.getAttribute('aria-label') || ''}`),
      buttons: [...root.querySelectorAll('button')].map(button => `${normal(button.innerText)}|${button.getAttribute('aria-label') || ''}|${button.getAttribute('aria-controls') || ''}`),
      sectionCount: root.querySelectorAll('main section').length,
      internalHeaderCount: root.querySelectorAll(':scope > header.nav-shell').length,
      footerCount: root.querySelectorAll(':scope > footer').length,
      elementorCount: document.querySelectorAll('.elementor, .elementor-location-header, .elementor-location-footer, .spp-uae-header, #masthead').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      unnamedButtons: [...root.querySelectorAll('button')].filter(button => !normal(button.innerText) && !button.getAttribute('aria-label')).length,
      positiveTabindex: root.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').length,
      contentState: root.querySelector('.content-status')?.getAttribute('data-content-state') || '',
    }
  })
}

async function capture(page, url) {
  const errors = []
  const failures = []
  const onError = error => errors.push(error.message)
  const onFailure = request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(`${request.failure()?.errorText}: ${request.url()}`)
  }
  page.on('pageerror', onError)
  page.on('requestfailed', onFailure)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('#root h1').first().waitFor({ timeout: 30000 })
  await page.locator('.content-status[data-content-state="ready"], .content-status[data-content-state="fallback"]').waitFor()
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' })
  await revealPage(page)
  const result = await inventory(page)
  page.off('pageerror', onError)
  page.off('requestfailed', onFailure)
  return { ...result, errors, failures }
}

function comparable(value) {
  return JSON.stringify(value)
}

async function compareScreenshots(page, reference, target) {
  return page.evaluate(async ({ referenceData, targetData }) => {
    const load = source => new Promise((resolveImage, rejectImage) => {
      const image = new Image()
      image.onload = () => resolveImage(image)
      image.onerror = rejectImage
      image.src = source
    })
    const [referenceImage, targetImage] = await Promise.all([
      load(`data:image/png;base64,${referenceData}`),
      load(`data:image/png;base64,${targetData}`),
    ])
    const width = Math.min(360, referenceImage.width, targetImage.width)
    const referenceHeight = Math.round(referenceImage.height * width / referenceImage.width)
    const targetHeight = Math.round(targetImage.height * width / targetImage.width)
    if (referenceHeight !== targetHeight) {
      return {
        dimensionsMatch: false,
        reference: [referenceImage.width, referenceImage.height],
        target: [targetImage.width, targetImage.height],
        differentPixelRatio: 1,
      }
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = referenceHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.drawImage(referenceImage, 0, 0, width, referenceHeight)
    const referencePixels = context.getImageData(0, 0, width, referenceHeight).data
    context.clearRect(0, 0, width, referenceHeight)
    context.drawImage(targetImage, 0, 0, width, referenceHeight)
    const targetPixels = context.getImageData(0, 0, width, referenceHeight).data
    let different = 0
    for (let index = 0; index < referencePixels.length; index += 4) {
      if (
        Math.abs(referencePixels[index] - targetPixels[index]) > 10 ||
        Math.abs(referencePixels[index + 1] - targetPixels[index + 1]) > 10 ||
        Math.abs(referencePixels[index + 2] - targetPixels[index + 2]) > 10
      ) different += 1
    }
    return {
      dimensionsMatch: true,
      reference: [referenceImage.width, referenceImage.height],
      target: [targetImage.width, targetImage.height],
      differentPixelRatio: different / (width * referenceHeight),
    }
  }, {
    referenceData: reference.toString('base64'),
    targetData: target.toString('base64'),
  })
}

const referenceServer = createReferenceServer()
const targetServer = externalTarget ? null : createTargetServer()
await listen(referenceServer, 4191)
if (targetServer) await listen(targetServer, 4192)
await mkdir(outputRoot, { recursive: true })

const browser = await chromium.launch({ executablePath: edge, headless: true })
const failures = []
const routeReport = []
let checks = 0
const check = (condition, message) => {
  checks += 1
  if (!condition) failures.push(message)
}
const firstStringDifference = (reference, target) => {
  let index = 0
  while (index < reference.length && index < target.length && reference[index] === target[index]) index += 1
  return {
    index,
    reference: reference.slice(Math.max(0, index - 80), index + 160),
    target: target.slice(Math.max(0, index - 80), index + 160),
  }
}

try {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })

    for (const [name, route] of activeRoutes) {
      // A fresh tab pair prevents state and decoded-image memory from leaking
      // between long galleries, matching a real direct visit to each route.
      const referencePage = await context.newPage()
      const targetPage = await context.newPage()
      const reference = await capture(referencePage, `${referenceOrigin}/#${route}`)
      const target = await capture(targetPage, `${targetOrigin}${route}`)
      const prefix = `${viewportName}/${name}`

      check(target.h1.length === 1, `${prefix}: expected exactly one H1`)
      check(comparable(target.h1) === comparable(reference.h1), `${prefix}: H1 differs`)
      check(comparable(target.headings) === comparable(reference.headings), `${prefix}: heading order/text differs`)
      check(comparable(target.sections) === comparable(reference.sections), `${prefix}: section order differs`)
      check(target.text === reference.text, `${prefix}: visible text differs`)
      check(
        comparable(target.images.map(({ src }) => src.split('/').pop())) === comparable(reference.images.map(({ src }) => src.split('/').pop())),
        `${prefix}: image source parity differs`,
      )
      check(target.images.every(image => image.alt.trim()), `${prefix}: target image has empty alt text`)
      check(target.images.every(image => image.loaded), `${prefix}: target contains an unloaded or broken image`)
      check(comparable(target.videos) === comparable(reference.videos), `${prefix}: video parity differs`)
      check(comparable(target.links) === comparable(reference.links), `${prefix}: link label/destination parity differs`)
      check(comparable(target.buttons) === comparable(reference.buttons), `${prefix}: button parity differs`)
      check(!target.overflow, `${prefix}: horizontal overflow`)
      check(target.internalHeaderCount === 1 && target.footerCount === 1, `${prefix}: React header/footer count differs`)
      check(target.elementorCount === 0, `${prefix}: Elementor/UAE markup rendered`)
      check(target.unnamedButtons === 0 && target.positiveTabindex === 0, `${prefix}: basic keyboard semantics failed`)
      check(target.errors.length === 0 && target.failures.length === 0, `${prefix}: runtime/resource failures`)

      if (viewportName === 'desktop') {
        const referenceShot = await referencePage.screenshot({ fullPage: true })
        const targetShot = await targetPage.screenshot({ fullPage: true })
        await Promise.all([
          writeFile(join(outputRoot, `${name}-reference.png`), referenceShot),
          writeFile(join(outputRoot, `${name}-wordpress-bundle.png`), targetShot),
        ])
        const visualHashParity = sha256(referenceShot) === sha256(targetShot)
        const visualComparison = await compareScreenshots(targetPage, referenceShot, targetShot)
        check(
          visualComparison.dimensionsMatch && visualComparison.differentPixelRatio <= maxVisualDifference,
          `${prefix}: rendered pixels differ (${(visualComparison.differentPixelRatio * 100).toFixed(3)}%)`,
        )
        routeReport.push({
          route,
          h1: target.h1[0],
          sections: target.sectionCount,
          images: target.images.length,
          textParity: target.text === reference.text,
          diagnostics: target.text === reference.text && comparable(target.buttons) === comparable(reference.buttons)
            ? undefined
            : {
                text: firstStringDifference(reference.text, target.text),
                referenceButtons: reference.buttons,
                targetButtons: target.buttons,
              },
          visualHashParity,
          visualComparison,
          imageDiagnostics: visualComparison.differentPixelRatio > maxVisualDifference
            ? { reference: reference.images, target: target.images }
            : undefined,
        })
      }
      await Promise.all([referencePage.close(), targetPage.close()])
    }
    console.log(`Completed ${viewportName}: ${activeRoutes.length} routes`)
    await context.close()
  }

  const interactionContext = await browser.newContext({ viewport: viewports.desktop, reducedMotion: 'reduce' })
  const interaction = await interactionContext.newPage()
  await interaction.goto(`${targetOrigin}/`, { waitUntil: 'domcontentloaded' })
  await interaction.locator('#root h1').first().waitFor()
  await interaction.locator('.nav-dropdown').hover()
  check(await interaction.locator('#desktop-services-menu button').count() === 10, 'desktop menu: overview plus nine service links expected')
  await interaction.goto(`${targetOrigin}/faqs`, { waitUntil: 'domcontentloaded' })
  const faq = interaction.locator('.faq-item').nth(1)
  await faq.locator('button').click()
  check(await faq.locator('button').getAttribute('aria-expanded') === 'true', 'FAQ accordion interaction failed')
  await interaction.goto(`${targetOrigin}/services/fence-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  await interaction.locator('[data-content-state="ready"]').waitFor()
  await interaction.locator('#root h1').first().waitFor()
  check(await interaction.locator('.client-media-card').count() === 8, 'gallery progressive initial count differs')
  await interaction.locator('.gallery-more').click()
  check(await interaction.locator('.client-media-card').count() === 22, 'gallery expansion count differs')
  await interaction.locator('.client-media-card').first().click()
  check(await interaction.locator('.media-lightbox').isVisible(), 'gallery lightbox did not open')
  await interaction.keyboard.press('Escape')
  check(!(await interaction.locator('.media-lightbox').count()), 'gallery lightbox did not close with Escape')

  await interaction.goto(`${targetOrigin}/`, { waitUntil: 'domcontentloaded' })
  await interaction.evaluate(() => {
    document.body.tabIndex = -1
    document.body.focus()
  })
  await interaction.keyboard.press('Tab')
  const focused = await interaction.evaluate(() => {
    const element = document.activeElement
    const bounds = element?.getBoundingClientRect()
    const style = element ? getComputedStyle(element) : null
    return {
      className: element?.className || '',
      visible: Boolean(bounds && bounds.width > 0 && bounds.height > 0 && style?.visibility !== 'hidden'),
    }
  })
  check(focused.className === 'skip-link', 'skip link is not the first keyboard focus target')
  check(focused.visible, 'skip link is not visible when focused')
  const motion = await interaction.evaluate(() => {
    const reveal = document.querySelector('.reveal')
    const style = reveal ? getComputedStyle(reveal) : null
    return {
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      transition: style?.transitionDuration || '',
      animation: style?.animationDuration || '',
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    }
  })
  const zeroDuration = value => !value || value.split(',').every(duration => Number.parseFloat(duration) === 0)
  check(motion.reduced && zeroDuration(motion.transition) && zeroDuration(motion.animation), `reduced-motion styles are not disabled (${JSON.stringify(motion)})`)
  check(motion.scrollBehavior === 'auto', 'reduced motion did not disable smooth scrolling')
  await interactionContext.close()

  const fallbackContext = await browser.newContext({ viewport: viewports.desktop, reducedMotion: 'reduce' })
  const fallbackPage = await fallbackContext.newPage()
  await fallbackPage.route('**/wp-json/spp/v1/**', route => route.abort())
  await fallbackPage.goto(`${targetOrigin}/services`, { waitUntil: 'domcontentloaded' })
  await fallbackPage.locator('[data-content-state="error"]').waitFor()
  await fallbackPage.locator('#root h1').first().waitFor()
  await fallbackPage.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' })
  await revealPage(fallbackPage)
  const fallback = await inventory(fallbackPage)
  check(fallback.h1.length === 1 && fallback.sections.length > 0, 'API fallback did not preserve the complete page')
  check(fallback.images.every(image => image.loaded), 'API fallback contains broken images')
  await fallbackContext.close()
} finally {
  await browser.close()
  await new Promise(resolveClose => referenceServer.close(resolveClose))
  if (targetServer) await new Promise(resolveClose => targetServer.close(resolveClose))
}

const report = {
  generatedAt: new Date().toISOString(),
  target: externalTarget ? targetOrigin : 'packaged WordPress React bundle',
  checks,
  routes: activeRoutes.length,
  viewports,
  failures,
  routeReport,
}
const reportName = externalTarget ? 'wordpress-parity-report.json' : 'bundle-parity-report.json'
await writeFile(join(outputRoot, reportName), `${JSON.stringify(report, null, 2)}\n`)

console.log(JSON.stringify({
  checks,
  routes: activeRoutes.length,
  viewports: Object.keys(viewports),
  failures: failures.length,
  visualHashMatches: routeReport.filter(route => route.visualHashParity).length,
  visualPixelMatches: routeReport.filter(route => route.visualComparison.dimensionsMatch && route.visualComparison.differentPixelRatio <= maxVisualDifference).length,
}, null, 2))
if (failures.length) {
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
}
