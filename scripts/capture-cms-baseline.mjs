import { chromium } from 'playwright-core'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const baseUrl = (process.env.SPP_BASELINE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '')
const outputRoot = path.join(root, 'baseline')
const screenshotRoot = path.join(outputRoot, 'screenshots')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

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

const viewports = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 820, height: 1000 },
  mobile: { width: 390, height: 844 },
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(absolute) : [absolute]
  })
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/')
}

async function revealPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 650) {
    await page.evaluate(position => window.scrollTo(0, position), y)
    await page.waitForTimeout(65)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(350)
}

async function captureInteractions(page) {
  const snapshots = {}

  const servicesTrigger = page.getByRole('button', { name: 'Show service pages' })
  if (await servicesTrigger.count()) {
    await page.locator('.nav-dropdown').hover()
    await page.locator('#desktop-services-menu').waitFor()
    snapshots.servicesDropdown = await page.locator('#desktop-services-menu button').allInnerTexts()
    await page.mouse.move(0, 0)
  }

  const more = page.locator('.gallery-more')
  if (await more.count()) {
    await more.click()
    snapshots.expandedGalleryItems = await page.locator('.client-media-card').count()
  }

  const galleryCards = page.locator('.client-media-card')
  if (await galleryCards.count()) {
    await galleryCards.first().click()
    snapshots.imageLightbox = {
      label: await page.locator('.media-lightbox').getAttribute('aria-label'),
      caption: (await page.locator('.lightbox-media p').innerText()).trim(),
    }
    await page.locator('.lightbox-close').click()

    const videoCards = galleryCards.filter({ hasText: 'Video' })
    snapshots.galleryVideos = []
    for (let index = 0; index < await videoCards.count(); index++) {
      await videoCards.nth(index).click()
      snapshots.galleryVideos.push(await page.locator('.lightbox-media video').evaluate(video => ({
        src: video.getAttribute('src'),
        poster: video.getAttribute('poster'),
        controls: video.controls,
      })))
      await page.locator('.lightbox-close').click()
    }
  }

  const faqButtons = page.locator('.faq-item > button')
  if (await faqButtons.count()) {
    snapshots.faqs = []
    for (let index = 0; index < await faqButtons.count(); index++) {
      const button = faqButtons.nth(index)
      if (await button.getAttribute('aria-expanded') !== 'true') {
        await button.click()
      }
      snapshots.faqs.push({
        question: (await button.innerText()).replace(/^\d+\s*/, '').trim(),
        answer: (await page.locator('.faq-item').nth(index).locator('.faq-answer').innerText()).trim(),
      })
    }
  }

  const nextReview = page.getByRole('button', { name: 'Next review' })
  if (await nextReview.count()) {
    const reviews = []
    for (let index = 0; index < 3; index++) {
      reviews.push({
        quote: (await page.locator('.quote-card blockquote').innerText()).trim(),
        attribution: (await page.locator('.quote-by').innerText()).replace(/\s+/g, ' ').trim(),
      })
      await nextReview.click()
      await page.waitForTimeout(250)
    }
    snapshots.homeTestimonials = reviews
  }

  const form = page.locator('.quote-form')
  if (await form.count()) {
    await form.locator('[name="name"]').fill('Baseline Test')
    await form.locator('[name="phone"]').fill('0400000000')
    await form.locator('[name="email"]').fill('baseline@example.com')
    await form.locator('[name="suburb"]').fill('Melbourne')
    await form.locator('textarea').fill('Baseline interaction capture')
    await form.locator('button[type="submit"]').click()
    snapshots.quoteFormSuccess = (await form.locator('.form-success').innerText()).replace(/\s+/g, ' ').trim()
  }

  return snapshots
}

async function inventoryRoute(page, route) {
  const failures = []
  const onFailure = request => {
    const error = request.failure()?.errorText
    if (error !== 'net::ERR_ABORTED') failures.push({ url: request.url(), error })
  }
  page.on('requestfailed', onFailure)

  await page.goto(`${baseUrl}/#${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.locator('#root h1').first().waitFor({ timeout: 30000 })
  await revealPage(page)
  const interactions = await captureInteractions(page)
  await revealPage(page)

  const result = await page.evaluate(() => {
    const root = document.querySelector('#root')
    const normal = value => String(value || '').replace(/\s+/g, ' ').trim()
    const textNodes = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = normal(node.textContent)
        const tag = node.parentElement?.tagName
        return text && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(tag)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      },
    })
    let node
    while ((node = walker.nextNode())) {
      textNodes.push({
        text: normal(node.textContent),
        parent: node.parentElement.tagName.toLowerCase(),
        className: normal(node.parentElement.className),
      })
    }

    const fields = [...root.querySelectorAll('input, textarea, select')].map(field => ({
      tag: field.tagName.toLowerCase(),
      type: field.getAttribute('type') || null,
      name: field.getAttribute('name') || null,
      placeholder: field.getAttribute('placeholder') || null,
      required: field.required,
      label: normal(field.closest('label')?.innerText),
    }))

    return {
      url: location.href,
      documentTitle: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      headings: [...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(heading => ({
        level: Number(heading.tagName.slice(1)),
        text: normal(heading.innerText),
      })),
      sections: [...root.querySelectorAll('main section')].map((section, index) => ({
        index,
        id: section.id || null,
        className: normal(section.className),
        heading: normal(section.querySelector('h1,h2,h3')?.innerText),
      })),
      textNodes,
      links: [...root.querySelectorAll('a')].map(link => ({
        text: normal(link.innerText),
        href: link.getAttribute('href'),
        resolvedHref: link.href,
        ariaLabel: link.getAttribute('aria-label'),
      })),
      buttons: [...root.querySelectorAll('button')].map(button => ({
        text: normal(button.innerText),
        ariaLabel: button.getAttribute('aria-label'),
        ariaExpanded: button.getAttribute('aria-expanded'),
        ariaControls: button.getAttribute('aria-controls'),
        type: button.getAttribute('type') || 'submit',
      })),
      images: [...root.querySelectorAll('img')].map(image => ({
        src: image.getAttribute('src'),
        resolvedSrc: image.currentSrc || image.src,
        alt: image.alt,
        loading: image.loading,
        width: image.naturalWidth,
        height: image.naturalHeight,
        loaded: image.complete && image.naturalWidth > 0,
        objectFit: getComputedStyle(image).objectFit,
        objectPosition: getComputedStyle(image).objectPosition,
      })),
      videos: [...root.querySelectorAll('video')].map(video => ({
        src: video.getAttribute('src'),
        poster: video.getAttribute('poster'),
        controls: video.controls,
      })),
      forms: [...root.querySelectorAll('form')].map(form => ({
        className: normal(form.className),
        method: form.method,
        action: form.action,
        fields,
      })),
      dialogs: [...root.querySelectorAll('[role="dialog"]')].map(dialog => ({
        label: dialog.getAttribute('aria-label'),
        modal: dialog.getAttribute('aria-modal'),
      })),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
  })

  page.off('requestfailed', onFailure)
  return { ...result, interactions, requestFailures: failures }
}

fs.mkdirSync(screenshotRoot, { recursive: true })
const browser = await chromium.launch({ executablePath: edge, headless: true })
const pageErrors = []
const routeInventory = {}

try {
  const inventoryPage = await browser.newPage({ viewport: viewports.desktop })
  inventoryPage.on('pageerror', error => pageErrors.push(error.message))
  for (const [name, route] of routes) {
    routeInventory[name] = { route, ...(await inventoryRoute(inventoryPage, route)) }
  }

  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const directory = path.join(screenshotRoot, viewportName)
    fs.mkdirSync(directory, { recursive: true })
    const page = await browser.newPage({ viewport })
    page.on('pageerror', error => pageErrors.push(error.message))
    for (const [name, route] of routes) {
      await page.goto(`${baseUrl}/#${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.locator('#root h1').first().waitFor({ timeout: 30000 })
      await revealPage(page)
      await page.screenshot({
        path: path.join(directory, `${name}.jpg`),
        type: 'jpeg',
        quality: 58,
        fullPage: true,
      })
    }
    await page.close()
  }
} finally {
  await browser.close()
}

const publicAssets = walkFiles(path.join(root, 'public', 'assets')).map(file => ({
  path: relative(file),
  bytes: fs.statSync(file).size,
  sha256: sha256(file),
}))

const sourceFiles = walkFiles(path.join(root, 'src')).map(file => ({
  path: relative(file),
  bytes: fs.statSync(file).size,
  sha256: sha256(file),
}))

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  referenceUrl: 'https://grantzz-zzz.github.io/paint-2/',
  captureUrl: baseUrl,
  routeCount: routes.length,
  viewports,
  routes: routeInventory,
  publicAssets,
  sourceFiles,
  pageErrors: [...new Set(pageErrors)],
}

fs.mkdirSync(outputRoot, { recursive: true })
fs.writeFileSync(path.join(outputRoot, 'site-baseline.json'), `${JSON.stringify(manifest, null, 2)}\n`)

const summary = {
  routes: manifest.routeCount,
  screenshots: routes.length * Object.keys(viewports).length,
  publicAssets: publicAssets.length,
  textNodes: Object.values(routeInventory).reduce((sum, route) => sum + route.textNodes.length, 0),
  images: Object.values(routeInventory).reduce((sum, route) => sum + route.images.length, 0),
  requestFailures: Object.values(routeInventory).flatMap(route => route.requestFailures).length,
  pageErrors: manifest.pageErrors.length,
}

console.log(JSON.stringify(summary, null, 2))
if (summary.requestFailures || summary.pageErrors || Object.values(routeInventory).some(route => route.horizontalOverflow)) {
  process.exitCode = 1
}
