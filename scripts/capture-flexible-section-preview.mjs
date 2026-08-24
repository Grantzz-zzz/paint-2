import { createServer } from 'node:http'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const output = join(process.cwd(), 'docs')
const port = 4192
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const image = path => ({ url: `${origin}assets/client/projects/new-batch/${path}`, alt: 'Superior Plus completed painting project' })
const sections = [{
  id: 'timber-deck-preview',
  eyebrow: 'Service information',
  title: 'Restore and Protect Your Timber Deck',
  text: [
    'Over time, timber decking is exposed to sunlight, rain, dirt, foot traffic and changing temperatures. Without regular maintenance, timber can become faded, cracked, dry and weathered.',
    'Professional deck painting and staining restores the appearance of the surface while providing practical, long-term protection for Melbourne conditions.',
  ].join('\n\n'),
  items: [
    'Protect timber from UV damage',
    'Reduce moisture penetration',
    'Prevent premature weathering',
    'Improve durability',
    'Enhance the natural beauty of timber',
    'Extend the life of your deck',
    'Increase property value',
    'Improve outdoor entertaining areas',
  ],
  style: 'green',
  layout: 'image-left',
  image: image('batch-097.jpg'),
  image_position: '50% 50%',
  order: 0,
}, {
  id: 'interior-preview',
  eyebrow: 'Interior craftsmanship',
  title: 'Colour, preparation and a finish made to last',
  text: 'A carefully designed section can carry detailed client wording without looking like a plain document. The image and brand treatment support the content while the list remains compact and easy to scan.',
  items: ['Careful surface preparation', 'Premium low-VOC coatings', 'Clean lines and consistent coverage', 'A tidy final handover'],
  style: 'gold',
  layout: 'image-right',
  image: image('batch-073.jpg'),
  image_position: '50% 50%',
  order: 1,
}, {
  id: 'exterior-preview',
  eyebrow: 'Superior Plus project',
  title: 'A stronger visual option for important content',
  text: 'For a major message, the same plugin section can use project photography as a background with a controlled overlay. Contrast and spacing remain locked so the wording stays readable.',
  items: ['Responsive on mobile', 'Accessible text contrast', 'Optional project photography', 'Editable entirely through WordPress'],
  style: 'maroon',
  layout: 'image-background',
  image: image('batch-145.jpg'),
  image_position: '50% 50%',
  order: 2,
}]

const pagePayload = {
  template_key: 'standard',
  title: 'Flexible section preview',
  seo: { title: 'Flexible section preview', description: 'Preview', social_image: null },
  hero: { eyebrow: 'WordPress content preview', title: 'Flexible section', accent: 'added through the plugin.', intro: 'The section below demonstrates the exact desktop and mobile rendering.', image: null },
  closing_cta: {},
  content: {
    fields: {
      __configured: ['content_sections'],
      content_sections: sections,
    },
  },
  path: '/preview-section',
}

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

await mkdir(output, { recursive: true })
await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
    await page.route('**/wp-json/spp/v1/**', async route => {
      const endpoint = new URL(route.request().url()).pathname.split('/spp/v1')[1]
      const data = endpoint === '/routes/preview-section'
        ? pagePayload
        : endpoint === '/bootstrap'
          ? { quote_form: { enabled: true, privacy_text: '' } }
          : ['/services', '/projects', '/articles', '/testimonials', '/faqs', '/areas'].includes(endpoint)
            ? []
            : undefined
      await route.fulfill({
        status: data === undefined ? 404 : 200,
        contentType: 'application/json',
        body: JSON.stringify(data === undefined ? {} : { schema_version: '1.0.0', data }),
      })
    })
    await page.goto(`${origin}preview-section`, { waitUntil: 'domcontentloaded' })
    await page.locator('.content-status').waitFor({ state: 'attached' })
    await page.waitForFunction(() => document.querySelector('.content-status')?.dataset.contentState === 'ready')
    await page.addStyleTag({ content: '.nav-shell,.floating-contact-actions,.skip-link,.page-hero,.breadcrumbs,footer,.closing-cta{display:none!important}body{background:#fff!important}' })
    const preview = page.locator('.managed-content-section').first()
    await preview.scrollIntoViewIfNeeded()
    await page.waitForFunction(() => [...document.querySelectorAll('.managed-content-section img')].every(image => image.complete && image.naturalWidth > 0), null, { timeout: 30000 })
    for (const section of await page.locator('.managed-content-section').all()) {
      await section.scrollIntoViewIfNeeded()
      await page.waitForTimeout(180)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await page.locator('.managed-content-section').evaluateAll(sections => sections.forEach(section => section.setAttribute('data-preview', 'true')))
    await page.screenshot({ path: join(output, `flexible-section-brand-designs-${name}.png`), fullPage: true })
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log('Created desktop and mobile flexible-section previews in docs/.')
