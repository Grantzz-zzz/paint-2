import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(process.cwd(), 'dist')
const port = 4191
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const sectionCount = 40
const itemsPerSection = 8
const stressLocations = Array.from({ length: 60 }, (_, index) => `Melbourne stress location ${String(index + 1).padStart(2, '0')}${index === 17 ? ' with an intentionally long suburb-style name' : ''}`)
const stressProcessSteps = Array.from({ length: 12 }, (_, index) => index === 6
  ? 'Protect every floor, fitting and adjacent surface before preparation begins'
  : `Editable process step ${String(index + 1).padStart(2, '0')}`)

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

const heroIntro = [
  'This deliberately long hero introduction stress-tests detailed client copy while keeping the locked layout readable across every supported template. The complete wording must remain available without forcing the first screen to carry all of it at once, and the disclosure control must remain keyboard accessible.',
  'This is the second saved paragraph. It must remain separate, appear after expansion, and never merge into the first paragraph when the WordPress REST payload is rendered.',
].join('\n\n')

function flexibleSections(prefix) {
  return Array.from({ length: sectionCount }, (_, index) => {
    const number = String(index + 1).padStart(2, '0')
    const styles = ['white', 'green', 'maroon', 'gold']
    const layouts = ['text', 'image-left', 'image-right', 'image-background']
    const designed = true
    const extreme = index === 9
    const extremeTitle = `${prefix} section ${number} with an intentionally oversized heading that keeps wrapping across several lines without colliding with its project image or escaping the section container`
    const extremeText = Array.from({ length: 8 }, (_, paragraphIndex) => `Long paragraph ${paragraphIndex + 1} for ${prefix}. This deliberately detailed client wording repeats enough practical information about preparation, access, protection, coating selection, scheduling, communication and final inspection to force the copy column to become substantially taller than the adjacent project photograph while preserving every paragraph.`).join('\n\n')
    return {
      id: `${prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${number}`,
      eyebrow: `${prefix} eyebrow ${number}`,
      title: extreme ? extremeTitle : `${prefix} section ${number}`,
      text: extreme ? extremeText : `First paragraph for ${prefix} section ${number}. It contains enough copy to exercise wrapping without changing the design.\n\nSecond paragraph for ${prefix} section ${number}. It must render as a separate paragraph.`,
      items: Array.from({ length: itemsPerSection }, (_, itemIndex) => extreme ? `${prefix} ${number} deliberately long list item ${itemIndex + 1} that wraps naturally without creating a bulky card or horizontal overflow` : `${prefix} ${number} list item ${itemIndex + 1}`),
      style: designed ? styles[index % styles.length] : 'auto',
      layout: designed ? layouts[index % layouts.length] : 'text',
      image: designed && index > 0 ? { url: `${origin}assets/client/projects/new-batch/batch-097.webp`, alt: `${prefix} test project` } : null,
      image_position: '50% 50%',
      order: index,
    }
  })
}

function pagePayload(path, templateKey, prefix) {
  return {
    template_key: templateKey,
    title: `${prefix} stress page`,
    seo: { title: `${prefix} stress page`, description: 'Flexible-section stress test.', social_image: null },
    hero: { eyebrow: `${prefix} hero`, title: `${prefix} stress page`, accent: 'Heavy content, stable layout.', intro: heroIntro, image: null },
    closing_cta: { title: 'Stress-test quote', text: 'Closing content remains available.', link: { label: 'Request a quote', url: '/contact' } },
    content: {
      fields: {
        __configured: ['hero_intro', 'content_sections', ...(templateKey === 'about' ? ['about_standards_enabled'] : []), ...(templateKey === 'home' ? ['home_trust_points', 'home_process_label', 'home_process_intro', 'home_process_steps'] : [])],
        hero_intro: heroIntro,
        content_sections: flexibleSections(prefix),
        ...(templateKey === 'about' ? { about_standards_enabled: '0' } : {}),
        ...(templateKey === 'home' ? {
          home_trust_points: [],
          home_commercial_title: 'Our Painting',
          home_commercial_accent: 'Process',
          home_commercial_text: 'Professional finishes, clear communication and scheduling built around your operation—from a single office to multi-site projects.',
          home_commercial_tags: ['Free onsite inspection', 'Detailed written quotation', 'Surface preparation', 'Repairs, filling and sanding', 'Masking and protection', 'Premium primer where required', 'Two premium finish coats', 'Final inspection', 'Site clean-up', 'Customer satisfaction'],
          home_process_label: 'Editable homepage process',
          home_process_intro: 'Every step below comes from the plugin and remains safely ordered.',
          home_process_steps: stressProcessSteps,
        } : {}),
      },
    },
    path,
  }
}

const pageRoutes = new Map([
  ['/routes', pagePayload('/', 'home', 'Home')],
  ['/routes/services', pagePayload('/services', 'services_directory', 'Services')],
  ['/routes/additional-services', pagePayload('/additional-services', 'additional_services', 'Additional')],
  ['/routes/about', pagePayload('/about', 'about', 'About')],
  ['/routes/our-process', pagePayload('/our-process', 'process', 'Process')],
  ['/routes/faqs', pagePayload('/faqs', 'faqs', 'FAQ')],
  ['/routes/contact', pagePayload('/contact', 'contact', 'Contact')],
  ['/routes/gallery', pagePayload('/gallery', 'gallery', 'Gallery')],
  ['/routes/service-areas', pagePayload('/service-areas', 'service_areas', 'Areas')],
  ['/routes/service-areas/chadstone', pagePayload('/service-areas/chadstone', 'service_areas', 'Suburb')],
  ['/routes/stress-test', pagePayload('/stress-test', 'standard', 'Standard')],
])

const serviceSections = flexibleSections('Service document')
const serviceExtras = flexibleSections('Service extra')
pageRoutes.set('/routes/services/residential-painting-melbourne', {
  template_key: 'service',
  title: 'Residential Painting',
  seo: { title: 'Service stress page', description: 'Service stress test.', social_image: null },
  closing_cta: { title: 'Service quote', text: 'Service closing content.', link: { label: 'Request a quote', url: '/contact' } },
  content: {
    id: 501, slug: 'residential-painting-melbourne', title: 'Residential Painting', short: '', tone: 'maroon',
    copy_version: 'pdf-verbatim-2026-08-01',
    hero: { eyebrow: 'Service hero', title: 'Service stress page', accent: '', intro: heroIntro, image: null },
    scope_title: 'Stress scope', scope: [], why: '', process: [], benefits: [], related: [], gallery: [],
    document_sections: serviceSections, content_sections: serviceExtras, section_labels: {},
  },
})

pageRoutes.set('/routes/blog/stress-article', {
  template_key: 'article', title: 'Stress article',
  seo: { title: 'Stress article', description: 'Article stress test.', social_image: null },
  closing_cta: { title: 'Article quote', text: 'Article closing content.', link: { label: 'Request a quote', url: '/contact' } },
  content: {
    id: 601, slug: 'stress-article', title: 'Stress article', excerpt: 'Stress article excerpt.', category: 'Testing',
    eyebrow: 'Article hero', read_time: '10 min read', published: '2026-08-06', modified: '2026-08-06',
    hero: { title: 'Stress article', accent: 'Heavy content, stable layout.', intro: heroIntro, image: null },
    body: '<h2>Article body</h2><p>The normal article body remains present.</p>', takeaways: [], references: [], related_services: [],
    content_sections: flexibleSections('Article'),
  },
})

pageRoutes.set('/routes/projects/stress-project', {
  template_key: 'project', title: 'Stress project',
  seo: { title: 'Stress project', description: 'Project stress test.', social_image: null },
  hero: { eyebrow: 'Project hero', title: 'Stress project', accent: 'Heavy content, stable layout.', intro: heroIntro, image: null },
  closing_cta: { title: 'Project quote', text: 'Project closing content.', link: { label: 'Request a quote', url: '/contact' } },
  content: { id: 701, slug: 'stress-project', title: 'Stress project', project_type: 'Residential', featured_media: null, gallery: [], related_pages: [], content_sections: flexibleSections('Project') },
})

const cases = [
  ['/', 'Home', sectionCount], ['/services', 'Services', sectionCount],
  ['/additional-services', 'Additional', sectionCount - 2], ['/about', 'About', sectionCount - 5],
  ['/our-process', 'Process', sectionCount - 2], ['/faqs', 'FAQ', sectionCount],
  ['/contact', 'Contact', sectionCount], ['/gallery', 'Gallery', sectionCount],
  ['/service-areas', 'Areas', sectionCount], ['/service-areas/chadstone', 'Suburb', sectionCount],
  ['/services/residential-painting-melbourne', 'Service extra', sectionCount],
  ['/blog/stress-article', 'Article', sectionCount], ['/projects/stress-project', 'Project', sectionCount],
  ['/stress-test', 'Standard', sectionCount],
]

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

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })
const failures = []
let checks = 0
let locationBandMode = 'before'
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message) }

const fulfilContentApi = async route => {
  const endpoint = new URL(route.request().url()).pathname.split('/spp/v1')[1]
  const collection = endpoint === '/bootstrap'
    ? {
        quote_form: { enabled: true, privacy_text: '' },
        location_band: { enabled: locationBandMode !== 'hidden', after_coloured: locationBandMode === 'after', eyebrow: 'Editable coverage', title: 'Local stress service,', accent: 'carefully tested.', text: 'Every location below is supplied by the plugin in editor order.' },
        service_areas: stressLocations,
      }
    : ['/services', '/projects', '/articles', '/testimonials', '/faqs', '/areas'].includes(endpoint) ? [] : undefined
  const data = pageRoutes.get(endpoint) ?? collection
  return route.fulfill({
    status: data === undefined ? 404 : 200,
    contentType: 'application/json',
    body: JSON.stringify(data === undefined ? {} : { schema_version: '1.0.0', data }),
  })
}

try {
  for (const [viewportName, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    const runtimeErrors = []
    page.on('pageerror', error => runtimeErrors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') runtimeErrors.push(message.text()) })
    await page.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
    await page.route('**/wp-json/spp/v1/**', fulfilContentApi)

    for (const [path, prefix, minimumSections] of cases) {
      const label = `${viewportName} ${path}`
      await page.goto(new URL(path.replace(/^\//, ''), origin).href, { waitUntil: 'domcontentloaded' })
      await page.locator('.content-status').waitFor({ state: 'attached' })
      await page.waitForFunction(() => document.querySelector('.content-status')?.dataset.contentState !== 'loading')
      const contentState = await page.locator('.content-status').getAttribute('data-content-state')
      check(contentState === 'ready', `${label}: content API finished in ${contentState} state`)
      const finalHeading = page.getByRole('heading', { name: `${prefix} section 40` })
      await page.waitForTimeout(750)
      if (!(await finalHeading.count())) {
        const renderedTitles = await page.locator('.structured-section-copy h2').allTextContents()
        failures.push(`${label}: final stress section is missing (rendered structured titles: ${renderedTitles.slice(-3).join(' | ') || 'none'})`)
        continue
      }
      const matchingHeadings = await page.locator('.structured-section-copy h2').evaluateAll((headings, expectedPrefix) => headings.map(heading => heading.textContent.trim()).filter(text => text.startsWith(`${expectedPrefix} section `)), prefix)
      check(matchingHeadings.length >= minimumSections, `${label}: rendered ${matchingHeadings.length}/${minimumSections} expected stress sections`)
      check(matchingHeadings.at(-1) === `${prefix} section 40`, `${label}: section order or final section is wrong`)
      check((await page.getByText(`Second paragraph for ${prefix} section 40. It must render as a separate paragraph.`).count()) > 0, `${label}: second paragraph is missing`)
      const expectedMinimumItems = minimumSections * itemsPerSection
      const listItemCount = await page.locator('.structured-list li').count()
      check(listItemCount >= expectedMinimumItems, `${label}: rendered ${listItemCount}/${expectedMinimumItems} expected compact list items`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      check(overflow <= 2, `${label}: horizontal overflow is ${overflow}px`)
      const nodeCount = await page.locator('*').count()
      check(nodeCount < 20000, `${label}: DOM grew unexpectedly large (${nodeCount} nodes)`)
      const locationBands = page.locator('.inner-areas')
      check((await locationBands.count()) === 1, `${label}: expected exactly one site-wide location band`)
      const renderedLocations = await locationBands.locator('.inner-suburbs span').allTextContents()
      check(renderedLocations.length === stressLocations.length, `${label}: rendered ${renderedLocations.length}/${stressLocations.length} location chips`)
      check(renderedLocations[0]?.trim() === stressLocations[0] && renderedLocations.at(-1)?.trim() === stressLocations.at(-1), `${label}: location add/reorder order was not preserved`)
      const endSectionOrder = await page.evaluate(() => {
        const band = document.querySelector('.inner-areas')
        const closing = document.querySelector('.closing-cta')
        const contact = document.querySelector('.contact')
        return { band: band?.getBoundingClientRect().top ?? 0, end: (closing || contact)?.getBoundingClientRect().top ?? Number.MAX_SAFE_INTEGER }
      })
      check(endSectionOrder.band < endSectionOrder.end, `${label}: location band was not placed before the coloured near-footer section`)
      const designClasses = await page.locator('.managed-content-section').evaluateAll(sections => sections.map(section => section.className))
      check(designClasses.some(value => value.includes('tone-green')), `${label}: green brand design did not render (${designClasses.slice(0, 6).join(' | ')})`)
      check(designClasses.some(value => value.includes('tone-maroon')), `${label}: maroon brand design did not render (${designClasses.slice(0, 6).join(' | ')})`)
      check(designClasses.some(value => value.includes('tone-gold')), `${label}: gold brand design did not render (${designClasses.slice(0, 6).join(' | ')})`)
      check(designClasses.some(value => value.includes('layout-image-left')), `${label}: image-left layout did not render (${designClasses.slice(0, 6).join(' | ')})`)
      check(designClasses.some(value => value.includes('layout-image-right')), `${label}: image-right layout did not render (${designClasses.slice(0, 6).join(' | ')})`)
      check(designClasses.some(value => value.includes('layout-image-background')), `${label}: background-image layout did not render (${designClasses.slice(0, 6).join(' | ')})`)
      const extremeHeading = page.locator('.structured-section-copy h2').filter({ hasText: `${prefix} section 10 with an intentionally oversized heading` }).first()
      if (await extremeHeading.count()) {
        const geometry = await extremeHeading.evaluate((heading, currentViewport) => {
          const section = heading.closest('.managed-content-section') || heading.closest('.service-approved-story')
          const media = section?.querySelector('.managed-content-media, .service-story-photo')
          const panel = heading.closest('.managed-content-panel, .service-story-copy')
          const image = media?.querySelector('img')
          const sectionBox = section?.getBoundingClientRect()
          const mediaBox = media?.getBoundingClientRect()
          const panelBox = panel?.getBoundingClientRect()
          return {
            overflow: panel ? panel.scrollWidth - panel.clientWidth : 999,
            sectionHeight: sectionBox?.height || 0,
            mediaHeight: mediaBox?.height || 0,
            overlaps: currentViewport === 'mobile'
              ? Boolean(mediaBox && panelBox && mediaBox.bottom > panelBox.top + 2)
              : Boolean(mediaBox && panelBox && mediaBox.right > panelBox.left + 2 && mediaBox.left < panelBox.right - 2),
            paragraphs: section?.querySelectorAll('.structured-section-copy>p').length || 0,
            imageOutside: image ? (() => { const box = image.getBoundingClientRect(); return box.left < -2 || box.right > innerWidth + 2 })() : false,
          }
        }, viewportName)
        check(geometry.overflow <= 2, `${label}: extreme section overflow is ${geometry.overflow}px`)
        check(geometry.paragraphs >= 8, `${label}: extreme section lost paragraphs (${geometry.paragraphs}/8)`)
        check(geometry.sectionHeight > geometry.mediaHeight, `${label}: extreme copy did not expand its section safely`)
        check(!geometry.overlaps, `${label}: extreme copy overlaps its project image`)
        check(!geometry.imageOutside, `${label}: extreme section pushed its project image outside the viewport`)
      } else {
        check(false, `${label}: extreme heading test section was not rendered`)
      }
      if (path === '/about') check((await page.locator('.about-standards').count()) === 0, `${label}: disabled original standards section remained visible`)
      if (path === '/about') {
        const iconClasses = await page.locator('.about-service-range .scope-icon svg').evaluateAll(icons => icons.map(icon => icon.getAttribute('class') || ''))
        const unexpectedIcons = iconClasses.filter(value => !/(lucide-paint-roller|lucide-brush|lucide-spray-can)/.test(value))
        check(iconClasses.length > 0 && unexpectedIcons.length === 0, `${label}: painting scope contains unexpected icons (${unexpectedIcons.join(' | ') || 'none rendered'})`)
      }
      if (path === '/') {
        const homepageGeometry = await page.evaluate(() => {
          const rect = selector => document.querySelector(selector)?.getBoundingClientRect()
          const header = rect('.site-header')
          const copy = rect('.hero-copy')
          const buttons = rect('.hero-buttons')
          const hero = rect('.hero')
          const commercialChildren = [...document.querySelectorAll('.commercial-top>div')].map(element => element.getBoundingClientRect().top)
          return {
            copyTop: copy?.top ?? -999,
            headerBottom: header?.bottom ?? 0,
            buttonsBottom: buttons?.bottom ?? 999999,
            heroBottom: hero?.bottom ?? 0,
            commercialTopDifference: commercialChildren.length === 2 ? Math.abs(commercialChildren[0] - commercialChildren[1]) : 999,
          }
        })
        check(homepageGeometry.copyTop >= homepageGeometry.headerBottom + 10, `${label}: hero copy starts behind the navigation (${homepageGeometry.copyTop}px vs ${homepageGeometry.headerBottom}px)`)
        check(homepageGeometry.buttonsBottom <= homepageGeometry.heroBottom - 35, `${label}: hero actions are clipped by the hero divider (${homepageGeometry.buttonsBottom}px vs ${homepageGeometry.heroBottom}px)`)
        const trustPointText = await page.locator('.hero-trust span').allTextContents()
        check(JSON.stringify(trustPointText.map(value => value.trim())) === JSON.stringify(['Fully insured', 'Free written quotes', 'Careful preparation']), `${label}: empty saved trust points did not recover the three homepage defaults (${trustPointText.join(' | ')})`)
        if (viewportName === 'desktop') check(homepageGeometry.commercialTopDifference <= 4, `${label}: commercial heading/copy columns are misaligned by ${homepageGeometry.commercialTopDifference}px`)
        const renderedSteps = await page.locator('.process-grid .process-step span').allTextContents()
        check(renderedSteps.length === stressProcessSteps.length, `${label}: rendered ${renderedSteps.length}/${stressProcessSteps.length} editable process steps`)
        check(renderedSteps[0]?.trim() === stressProcessSteps[0] && renderedSteps.at(-1)?.trim() === stressProcessSteps.at(-1), `${label}: process-step add/reorder order was not preserved`)
      }
      const seeMore = page.getByRole('button', { name: 'See more' }).first()
      check(await seeMore.isVisible(), `${label}: long hero copy has no See more control`)
      await seeMore.click()
      check(await page.getByRole('button', { name: 'Show less' }).first().isVisible(), `${label}: hero copy did not expand`)
    }
    locationBandMode = 'after'
    const movedPage = await context.newPage()
    await movedPage.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
    await movedPage.route('**/wp-json/spp/v1/**', fulfilContentApi)
    await movedPage.goto(new URL('services', origin).href, { waitUntil: 'domcontentloaded' })
    await movedPage.waitForFunction(() => document.querySelector('.content-status')?.dataset.contentState === 'ready')
    await movedPage.locator('.closing-cta').waitFor()
    const movedDown = await movedPage.evaluate(() => ({
      closingTop: document.querySelector('.closing-cta')?.getBoundingClientRect().top,
      bandTop: document.querySelector('.inner-areas')?.getBoundingClientRect().top,
      count: document.querySelectorAll('.inner-areas').length,
      title: document.title,
      state: document.querySelector('.content-status')?.dataset.contentState,
      main: document.querySelector('main')?.innerText.slice(0, 160),
    }))
    check(movedDown.closingTop < movedDown.bandTop, `${viewportName}: move-down option did not place the location band after the coloured CTA (${JSON.stringify(movedDown)})`)
    await movedPage.close()
    locationBandMode = 'hidden'
    const hiddenPage = await context.newPage()
    await hiddenPage.addInitScript(() => { window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1` })
    await hiddenPage.route('**/wp-json/spp/v1/**', fulfilContentApi)
    await hiddenPage.goto(new URL('services', origin).href, { waitUntil: 'domcontentloaded' })
    await hiddenPage.waitForFunction(() => document.querySelector('.content-status')?.dataset.contentState === 'ready')
    await hiddenPage.locator('main').waitFor()
    check((await hiddenPage.locator('.inner-areas').count()) === 0, `${viewportName}: visibility option did not remove the site-wide location band`)
    await hiddenPage.close()
    locationBandMode = 'before'
    check(runtimeErrors.length === 0, `${viewportName}: runtime errors: ${runtimeErrors.join(' | ')}`)
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`Flexible-section stress checks: ${checks}`)
console.log(`Routes per viewport: ${cases.length}`)
console.log(`Sections per field: ${sectionCount}`)
console.log(`List items per section: ${itemsPerSection}`)
console.log(`Failures: ${failures.length}`)
failures.forEach(failure => console.error(`- ${failure}`))
if (failures.length) process.exit(1)
console.log('Result: PASS')
