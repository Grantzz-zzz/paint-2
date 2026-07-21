import { chromium } from 'playwright-core'

const base = process.env.SPP_WP_URL || 'http://127.0.0.1:9410'
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.setDefaultNavigationTimeout(60000)
await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort())
const errors = []
page.on('pageerror', error => errors.push(error.message))

try {
  await page.goto(`${base}/wp-admin/plugins.php`, { waitUntil: 'networkidle' })
  const activateElementor = page.locator('tr[data-slug="elementor"] .activate a')
  if (await activateElementor.count()) {
    await activateElementor.click()
    await page.waitForLoadState('domcontentloaded')
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
    page.locator('input[name="action"][value="spp_install_elementor_home"]').locator('..').evaluate(form => HTMLFormElement.prototype.submit.call(form)),
  ])
  console.log('Installer response:', page.url(), (await page.locator('body').innerText()).slice(-800))
  const success = await page.getByText('The editable Elementor homepage was installed successfully.').isVisible()

  await page.goto(base, { waitUntil: 'networkidle' })
  const desktop = {
    status: (await page.request.get(base)).status(),
    elementorRoot: await page.locator('.elementor').count(),
    h1: await page.locator('h1').first().innerText(),
    serviceCards: await page.locator('.spp-el-service-card').count(),
    projects: await page.locator('.spp-el-project').count(),
    reviews: await page.locator('.spp-el-review').count(),
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
  await page.goto(base, { waitUntil: 'networkidle' })
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

  const playgroundOnlyErrors = new Set(['Transition was skipped', 'wp is not defined'])
  const actionableErrors = errors.filter(error => !playgroundOnlyErrors.has(error))
  console.log(JSON.stringify({ desktop, mobile, pageErrors: actionableErrors }, null, 2))
  if (!success || desktop.status !== 200 || desktop.elementorRoot !== 1 || desktop.serviceCards !== 8 || desktop.projects !== 3 || desktop.reviews !== 3 || mobile.horizontalOverflow || actionableErrors.length) process.exitCode = 1
} finally {
  await browser.close()
}
