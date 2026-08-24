import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4193
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'
    const nestedAssetIndex = pathname.indexOf('/assets/')
    if (nestedAssetIndex > 0) pathname = pathname.slice(nestedAssetIndex)
    const filepath = normalize(join(root, pathname))
    if (!filepath.startsWith(root)) throw new Error('Invalid path')
    const info = await stat(filepath)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': mime[extname(filepath)] || 'application/octet-stream' })
    response.end(await readFile(filepath))
  } catch {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(await readFile(join(root, 'index.html')))
  }
})

const bootstrap = {
  business: { name: 'Saved WordPress Business', phone_display: '0470 234 567', phone_href: 'tel:0470234567', email: 'saved@example.com', location: 'Melbourne' },
  navigation: [], footer: { intro: '', columns: [], stats: [], copyright: '', closing_line: '' },
  review_profile: { rating: 5, count: 1, url: '' }, trust_items: [], service_areas: [], default_cta: {}, quote_form: { enabled: true, privacy_text: '' },
}

const savedRoute = {
  template_key: 'home', title: 'Saved WordPress Heading',
  seo: { title: 'Saved WordPress title', description: 'Saved WordPress description', social_image: null },
  hero: { title: 'Saved WordPress Heading', eyebrow: 'Saved eyebrow', accent: 'Saved accent', intro: 'Saved WordPress introduction.', image: null },
  closing_cta: {},
  content: { fields: {
    __configured: ['eyebrow', 'hero_title', 'accent', 'hero_intro', 'home_service_ids', 'home_project_ids', 'home_testimonial_ids'],
    eyebrow: 'Saved eyebrow', hero_title: 'Saved WordPress Heading', accent: 'Saved accent', hero_intro: 'Saved WordPress introduction.',
    home_service_ids: [], home_project_ids: [], home_testimonial_ids: [],
  } },
  path: '/',
}

const failures = []
let checks = 0
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message) }

async function createPage(browser, mode) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  const runtimeErrors = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') {
      const source = message.location().url
      runtimeErrors.push(`${message.text()}${source ? ` @ ${source}` : ''}`)
    }
  })
  await page.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
  await page.route('**/wp-json/spp/v1/**', async route => {
    const endpoint = new URL(route.request().url()).pathname.split('/spp/v1')[1]
    if (endpoint === '/bootstrap') {
      if (mode === 'delayed-success') await sleep(450)
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ schema_version: '1.0.0', data: bootstrap }) })
    }
    if (endpoint === '/services') {
      if (mode === 'delayed-success') await sleep(550)
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ schema_version: '1.0.0', data: [] }) })
    }
    if (endpoint === '/routes' || endpoint.startsWith('/routes/')) {
      await sleep(mode === 'delayed-success' ? 1250 : 550)
      if (mode === 'route-failure') return route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ schema_version: '1.0.0', data: savedRoute }) })
    }
    if (['/projects', '/articles', '/testimonials', '/faqs', '/areas'].includes(endpoint)) {
      if (mode === 'delayed-success') await sleep(1500)
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ schema_version: '1.0.0', data: [] }) })
    }
    return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' })
  })
  return { context, page, runtimeErrors }
}

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  {
    const { context, page, runtimeErrors } = await createPage(browser, 'delayed-success')
    await page.goto(origin, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(180)
    check(await page.locator('.content-loading-gate').isVisible(), 'Delayed success: neutral loading gate was not visible.')
    check(await page.locator('.content-application').evaluate(element => getComputedStyle(element).visibility) === 'hidden', 'Delayed success: bundled fallback application was visible while loading.')
    check(!(await page.locator('.hero-title-seo').isVisible().catch(() => false)), 'Delayed success: original bundled hero wording flashed while loading.')
    await page.getByRole('heading', { name: /Saved WordPress Heading/i }).waitFor({ state: 'visible', timeout: 5000 })
    check((await page.locator('.content-loading-gate').count()) === 0, 'Delayed success: loading gate remained after route success.')
    check(await page.locator('.content-application').evaluate(element => getComputedStyle(element).visibility) === 'visible', 'Delayed success: WordPress application did not become visible.')
    check(!(await page.getByText('Warm modern interior', { exact: true }).isVisible().catch(() => false)), 'Delayed success: bundled project content appeared while its collection was loading.')
    await page.locator('header.nav-shell').getByRole('button', { name: 'About', exact: true }).click()
    await page.waitForTimeout(180)
    check((await page.locator('.content-loading-gate').count()) === 0, 'Internal navigation: full-screen loading gate appeared again.')
    check(await page.locator('.content-route-progress').isVisible(), 'Internal navigation: subtle route progress indicator was not visible.')
    check(await page.locator('header.nav-shell').isVisible(), 'Internal navigation: shared navigation was hidden.')
    check(await page.locator('main').evaluate(element => getComputedStyle(element).visibility) === 'hidden', 'Internal navigation: unsaved/default destination body was visible while loading.')
    check(!(await page.getByRole('heading', { name: /Your Trusted Painting Professionals/i }).isVisible().catch(() => false)), 'Internal navigation: bundled destination heading flashed while loading.')
    await page.getByRole('heading', { name: /Saved WordPress Heading/i }).waitFor({ state: 'visible', timeout: 5000 })
    check((await page.locator('.content-route-progress').count()) === 0, 'Internal navigation: route progress indicator remained after saved content loaded.')
    await page.waitForTimeout(450)
    check(runtimeErrors.length === 0, `Delayed success runtime errors: ${runtimeErrors.join(' | ')}`)
    await context.close()
  }

  {
    const { context, page, runtimeErrors } = await createPage(browser, 'route-failure')
    await page.goto(origin, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(180)
    check(await page.locator('.content-loading-gate').isVisible(), 'Route failure: neutral loading gate was not visible before the failure resolved.')
    await page.locator('.hero-title-seo').waitFor({ state: 'visible', timeout: 5000 })
    check((await page.locator('.content-loading-gate').count()) === 0, 'Route failure: loading gate did not release to the emergency fallback.')
    check(!(await page.getByRole('heading', { name: /Saved WordPress Heading/i }).isVisible().catch(() => false)), 'Route failure: unavailable WordPress content was displayed.')
    const unexpectedErrors = runtimeErrors.filter(message => !message.includes('500 (Internal Server Error)'))
    check(unexpectedErrors.length === 0, `Route failure runtime errors: ${unexpectedErrors.join(' | ')}`)
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`Content-loading gate checks: ${checks}`)
console.log(`Failures: ${failures.length}`)
failures.forEach(failure => console.error(`- ${failure}`))
if (failures.length) process.exit(1)
console.log('Result: PASS')
