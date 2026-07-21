import { chromium } from 'playwright-core'

const base = process.env.SPP_WP_URL || 'http://127.0.0.1:9402'
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await chromium.launch({ executablePath: edge, headless: true })
const errors = []

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  desktop.on('pageerror', error => errors.push(error.message))
  await desktop.goto(base, { waitUntil: 'networkidle' })

  const desktopResults = {
    status: (await desktop.request.get(base)).status(),
    h1: await desktop.locator('h1').first().innerText(),
    serviceCards: await desktop.locator('.home-service-grid .wp-service-card').count(),
    serviceMenuItems: await desktop.locator('.nav-links .sub-menu li').count(),
    sections: await desktop.locator('.services-section, .commercial, #projects, .areas, .testimonials, .contact').count(),
  }

  const imageSources = await desktop.locator('img').evaluateAll(images => images.map(image => image.currentSrc || image.src))
  const brokenImages = []
  for (const source of imageSources) {
    const response = await desktop.request.get(source)
    if (!response.ok()) brokenImages.push(`${response.status()} ${source}`)
  }
  desktopResults.brokenImages = brokenImages
  await desktop.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' })
  await desktop.screenshot({ path: 'wordpress-theme/dist/spp-wordpress-desktop.png', fullPage: true })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
  mobile.on('pageerror', error => errors.push(error.message))
  await mobile.goto(base, { waitUntil: 'networkidle' })
  await mobile.locator('[data-menu-toggle]').click()
  const mobileResults = {
    menuExpanded: await mobile.locator('[data-menu-toggle]').getAttribute('aria-expanded'),
    menuVisible: await mobile.locator('.nav-links').isVisible(),
  }
  await mobile.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' })
  await mobile.screenshot({ path: 'wordpress-theme/dist/spp-wordpress-mobile.png', fullPage: true })

  const service = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  service.on('pageerror', error => errors.push(error.message))
  const serviceResponse = await service.goto(`${base}/services/fence-painting-melbourne/`, { waitUntil: 'networkidle' })
  const serviceResults = {
    status: serviceResponse?.status(),
    h1: await service.locator('h1').first().innerText(),
    galleryItems: await service.locator('.client-gallery-grid > *:not([hidden])').count(),
  }

  const report = { desktop: desktopResults, mobile: mobileResults, service: serviceResults, pageErrors: errors }
  console.log(JSON.stringify(report, null, 2))

  if (
    desktopResults.status !== 200 ||
    desktopResults.serviceCards !== 8 ||
    desktopResults.serviceMenuItems !== 9 ||
    desktopResults.sections !== 6 ||
    brokenImages.length ||
    mobileResults.menuExpanded !== 'true' ||
    !mobileResults.menuVisible ||
    serviceResults.status !== 200 ||
    serviceResults.galleryItems !== 8 ||
    errors.length
  ) process.exitCode = 1
} finally {
  await browser.close()
}
