import { chromium } from 'playwright-core'

const base = (process.env.SPP_WP_URL || 'http://127.0.0.1:9414').replace(/\/$/, '')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await chromium.launch({ executablePath: edge, headless: true })
const pageErrors = []
const failedResources = []

const routes = [
  ['/', 'Made to feel'],
  ['/about', 'Care in every coat'],
  ['/services', 'Painting & property services'],
  ['/our-process', 'Our Painting Process'],
  ['/faqs', 'Frequently Asked Questions'],
  ['/contact', 'Get in Touch'],
  ['/services/residential-painting-melbourne', 'Residential Painting'],
  ['/services/commercial-painting-melbourne', 'Commercial Painting'],
  ['/services/interior-painting-melbourne', 'Interior Painting'],
  ['/services/exterior-painting-melbourne', 'Exterior Painting'],
  ['/services/roof-painting-melbourne', 'Roof Painting'],
  ['/services/fence-painting-melbourne', 'Fence Painting'],
  ['/services/deck-painting-staining-melbourne', 'Deck Painting'],
  ['/services/wallpaper-removal-melbourne', 'Wallpaper Removal'],
  ['/services/plaster-repairs-melbourne', 'Plaster Repairs'],
]

function watch(page) {
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('requestfailed', request => {
    const url = request.url()
    if (url.startsWith(base) && request.failure()?.errorText !== 'net::ERR_ABORTED') {
      failedResources.push(`${request.failure()?.errorText}: ${url}`)
    }
  })
}

async function revealWholePage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate(position => window.scrollTo(0, position), y)
    await page.waitForTimeout(90)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  watch(desktop)
  const routeResults = []

  for (const [route, expectedH1] of routes) {
    await desktop.goto(`${base}/#${route}`, { waitUntil: 'networkidle' })
    await desktop.locator('#root h1').first().waitFor()
    const h1 = (await desktop.locator('#root h1').first().innerText()).replace(/\s+/g, ' ').trim()
    routeResults.push({
      route,
      h1,
      expectedH1,
      passed: h1.toLowerCase().includes(expectedH1.toLowerCase()),
      headers: await desktop.locator('#root > header.nav-shell').count(),
      footers: await desktop.locator('#root > footer').count(),
      overflow: await desktop.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    })
  }

  await desktop.goto(`${base}/#/`, { waitUntil: 'networkidle' })
  const home = {
    serviceCards: await desktop.locator('.services-grid .service-card').count(),
    images: await desktop.locator('#root img').count(),
    brokenImages: await desktop.locator('#root img').evaluateAll(images =>
      images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc || image.src)
    ),
    phpHeaders: await desktop.locator('.spp-uae-header, #masthead').count(),
  }
  await revealWholePage(desktop)
  await desktop.screenshot({ path: 'wordpress-theme/dist/spp-react-wordpress-desktop.png', fullPage: true })

  const direct = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  watch(direct)
  const directResponse = await direct.goto(`${base}/about/`, { waitUntil: 'networkidle' })
  await direct.locator('#root h1').first().waitFor()
  const directRoute = {
    status: directResponse?.status(),
    url: direct.url(),
    h1: (await direct.locator('#root h1').first().innerText()).replace(/\s+/g, ' ').trim(),
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  watch(mobile)
  await mobile.goto(`${base}/#/`, { waitUntil: 'networkidle' })
  await mobile.locator('.menu-btn').click()
  const mobileResult = {
    expanded: await mobile.locator('.menu-btn').getAttribute('aria-expanded'),
    menuVisible: await mobile.locator('#mobile-navigation').isVisible(),
    serviceLinks: await mobile.locator('#mobile-services-menu button').count(),
    overflow: await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  }
  await mobile.locator('.menu-btn').click()
  await revealWholePage(mobile)
  await mobile.screenshot({ path: 'wordpress-theme/dist/spp-react-wordpress-mobile.png', fullPage: true })

  const report = { routeResults, home, directRoute, mobile: mobileResult, pageErrors, failedResources }
  console.log(JSON.stringify(report, null, 2))

  const failedRoutes = routeResults.filter(result =>
    !result.passed || result.headers !== 1 || result.footers !== 1 || result.overflow
  )
  if (
    failedRoutes.length ||
    home.serviceCards !== 8 ||
    home.brokenImages.length ||
    home.phpHeaders ||
    !directRoute.url.includes('/#/about') ||
    !directRoute.h1.toLowerCase().includes('care in every coat') ||
    mobileResult.expanded !== 'true' ||
    !mobileResult.menuVisible ||
    mobileResult.serviceLinks !== 9 ||
    mobileResult.overflow ||
    pageErrors.length ||
    failedResources.length
  ) process.exitCode = 1
} finally {
  await browser.close()
}
