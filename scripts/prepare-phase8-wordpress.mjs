import { chromium } from 'playwright-core'

const base = (process.env.SPP_WP_URL || 'http://127.0.0.1:9490').replace(/\/$/, '')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${base}/wp-admin/admin.php?page=spp-content-migration`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  })
  await Promise.all([
    page.waitForURL(/migrated=1/, { timeout: 180000 }),
    page.getByRole('button', { name: 'Import or safely refresh approved content' }).click({ noWaitAfter: true }),
  ])
  const report = JSON.parse(await page.locator('pre').innerText())
  const expected = JSON.stringify(report.expected)
  const actual = JSON.stringify(report.actual)
  if (!report.complete || expected !== actual) {
    throw new Error(`Phase 8 preparation migration is incomplete: ${JSON.stringify(report)}`)
  }
  console.log(JSON.stringify({
    target: base,
    complete: report.complete,
    expected: report.expected,
    actual: report.actual,
  }, null, 2))
} finally {
  await browser.close()
}
