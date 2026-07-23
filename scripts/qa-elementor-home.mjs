import { chromium } from 'playwright-core'

const base = process.env.SPP_WP_URL || 'http://127.0.0.1:9410'
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultNavigationTimeout(60000)
const errors = []
page.on('pageerror', error => errors.push(error.message))

try {
  await page.goto(`${base}/wp-admin/plugins.php`, { waitUntil: 'networkidle' })
  for (const slug of ['elementor', 'header-footer-elementor', 'metform']) {
    const activatePlugin = page.locator(`tr[data-slug="${slug}"] .activate a`)
    if (await activatePlugin.count()) {
      const href = await activatePlugin.getAttribute('href')
      await page.goto(new URL(href, `${base}/wp-admin/`).href, { waitUntil: 'domcontentloaded' })
      await page.goto(`${base}/wp-admin/plugins.php`, { waitUntil: 'domcontentloaded' })
    }
  }

  await page.goto(`${base}/wp-admin/themes.php`, { waitUntil: 'networkidle' })
  const activateTheme = page.locator('[data-slug="superior-plus"] .activate')
  if (await activateTheme.count()) {
    await activateTheme.click()
    await page.waitForLoadState('networkidle')
  }

  await page.goto(`${base}/wp-admin/themes.php?page=spp-setup`, { waitUntil: 'networkidle' })
  const starter = page.getByRole('button', { name: 'Create starter content' })
  if (await starter.count()) {
    await starter.click()
    await page.waitForLoadState('networkidle')
  }
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.locator('input[name="action"][value="spp_create_elementor_home_draft"]').locator('..').evaluate(form => HTMLFormElement.prototype.submit.call(form)),
  ])
  console.log('Installer response:', page.url(), (await page.locator('body').innerText()).slice(-800))
  const created = await page.getByText('Homepage Redesign was created as a separate draft. The current homepage was not changed.').isVisible()
  const alreadyPreserved = await page.getByText('Homepage Redesign already contains Elementor work, so the importer preserved it and changed nothing.').isVisible()
  const success = created || alreadyPreserved
  const draftId = new URL(page.url()).searchParams.get('spp-home-draft') || new URL(page.url()).searchParams.get('spp-home-preserved')

  await page.goto(`${base}/?page_id=${draftId}&preview=true`, { waitUntil: 'networkidle' })
  const desktop = {
    status: (await page.request.get(`${base}/?page_id=${draftId}&preview=true`)).status(),
    elementorRoot: await page.locator('.elementor').count(),
    h1: await page.locator('h1').first().innerText(),
    serviceCards: await page.locator('.spp-el-service-card').count(),
    projects: await page.locator('.spp-el-project').count(),
    reviews: await page.locator('.spp-el-review').count(),
    uaeHeader: await page.locator('.spp-uae-header').count(),
    uaeFooter: await page.locator('.spp-uae-footer').count(),
    metform: await page.locator('.spp-mf-form').count(),
    success,
  }
  console.log('Desktop checkpoint:', JSON.stringify(desktop))
  if (!desktop.elementorRoot) {
    await page.goto(`${base}/wp-admin/themes.php?page=spp-setup`, { waitUntil: 'domcontentloaded' })
    console.log('Setup diagnostics:', JSON.stringify({
      notices: await page.locator('.notice').allInnerTexts(),
      elementorButton: await page.getByRole('button', { name: 'Install or replace Elementor homepage' }).count(),
      body: (await page.locator('body').innerText()).slice(0, 1200),
    }))
    throw new Error('Elementor homepage did not render')
  }
  for (const section of await page.locator('.spp-el-section').all()) {
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(100)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'wordpress-theme/dist/elementor-home-desktop.png', fullPage: true, timeout: 60000 })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/?page_id=${draftId}&preview=true`, { waitUntil: 'networkidle' })
  for (const section of await page.locator('.spp-el-section').all()) {
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(100)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'wordpress-theme/dist/elementor-home-mobile.png', fullPage: true, timeout: 60000 })
  const mobile = {
    width: await page.locator('.spp-el-hero').evaluate(element => Math.round(element.getBoundingClientRect().width)),
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  }

  await page.goto(`${base}/wp-admin/themes.php?page=spp-setup`, { waitUntil: 'domcontentloaded' })
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.locator('input[name="action"][value="spp_create_elementor_home_draft"]').locator('..').evaluate(form => HTMLFormElement.prototype.submit.call(form)),
  ])
  const secondRunPreserved = await page.getByText('Homepage Redesign already contains Elementor work, so the importer preserved it and changed nothing.').isVisible()

  const playgroundOnlyErrors = new Set(['Transition was skipped', 'wp is not defined', 'A network error occurred.'])
  const actionableErrors = errors.filter(error => !playgroundOnlyErrors.has(error))
  console.log(JSON.stringify({ desktop, mobile, secondRunPreserved, pageErrors: actionableErrors }, null, 2))
  if (!success || !secondRunPreserved || desktop.status !== 200 || desktop.elementorRoot < 1 || desktop.serviceCards !== 8 || desktop.projects !== 3 || desktop.reviews !== 3 || desktop.metform !== 1 || mobile.horizontalOverflow || actionableErrors.length) process.exitCode = 1
} finally {
  await browser.close()
}
