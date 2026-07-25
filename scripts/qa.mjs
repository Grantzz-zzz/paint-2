import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'
import { serviceAreas } from '../src/data/serviceAreas.js'
import { paintingGuides } from '../src/data/paintingGuides.js'

const root = join(process.cwd(), 'dist')
const port = 4188
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const routes = [
  ['/', 'Professional painters'],
  ['/about', 'Care in every coat'],
  ['/services', 'Painting & property services'],
  ['/additional-services', 'Additional property services'],
  ['/services/residential-painting-melbourne', 'Residential Painting'],
  ['/services/commercial-painting-melbourne', 'Commercial Painting'],
  ['/services/interior-painting-melbourne', 'Interior Painting'],
  ['/services/exterior-painting-melbourne', 'Exterior Painting'],
  ['/services/roof-painting-melbourne', 'Roof Painting'],
  ['/services/fence-painting-melbourne', 'Fence Painting'],
  ['/services/deck-painting-staining-melbourne', 'Deck Painting'],
  ['/services/wallpaper-removal-melbourne', 'Wallpaper Removal'],
  ['/services/plaster-repairs-melbourne', 'Plaster Repairs'],
  ['/our-process', 'Our painting process'],
  ['/faqs', 'Frequently asked questions'],
  ['/contact', 'Get in touch'],
  ['/gallery', 'Every project'],
  ['/service-areas', 'Painters across Melbourne'],
  ...serviceAreas.map(area => [`/service-areas/${area.slug}`, `Painters in ${area.name}`]),
  ['/painting-guides', 'Practical painting guides'],
  ...paintingGuides.map(guide => [`/painting-guides/${guide.slug}`, guide.title]),
]

const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['tablet', { width: 768, height: 1024 }],
  ['mobile', { width: 390, height: 844 }],
]

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname === '/') pathname = '/index.html'
    const filepath = normalize(join(root, pathname))
    if (!filepath.startsWith(root)) throw new Error('Invalid path')
    const info = await stat(filepath)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': mime[extname(filepath)] || 'application/octet-stream' })
    response.end(await readFile(filepath))
  } catch {
    response.writeHead(404)
    response.end('Not found')
  }
})

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
const browser = await chromium.launch({ executablePath: edge, headless: true })
const failures = []
let checks = 0

function check(condition, message) {
  checks += 1
  if (!condition) failures.push(message)
}

try {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const runtimeErrors = []
    page.on('pageerror', error => runtimeErrors.push(error.message))

    for (const [route, expected] of routes) {
      runtimeErrors.length = 0
      await page.goto(`${origin}#${route}`, { waitUntil: 'domcontentloaded' })
      await page.locator('#main-content').waitFor({ state: 'attached' })
      await page.locator('h1').first().waitFor({ state: 'visible' })
      await page.waitForTimeout(120)

      const result = await page.evaluate(async () => {
        const images = [...document.images]
        const sources = [...new Set(images.map(image => image.currentSrc || image.src))]
        const brokenImages = (await Promise.all(sources.map(source => new Promise(resolve => {
          const probe = new Image()
          probe.onload = () => resolve(null)
          probe.onerror = () => resolve(source)
          probe.src = source
        })))).filter(Boolean)
        const emptyButtons = [...document.querySelectorAll('button')].filter(button => !button.textContent.trim() && !button.getAttribute('aria-label'))
        const readableParagraphs = [...document.querySelectorAll('main p:not(.form-note)')].filter(paragraph => {
          const box = paragraph.getBoundingClientRect()
          return box.width > 0 && box.height > 0
        }).map(paragraph => {
          const style = getComputedStyle(paragraph)
          return { size: Number.parseFloat(style.fontSize), weight: Number.parseInt(style.fontWeight, 10) || 400 }
        })
        let schemaValid = true
        try { JSON.parse(document.querySelector('#page-structured-data')?.textContent || '{}') } catch { schemaValid = false }
        return {
          h1Count: document.querySelectorAll('h1').length,
          h1: document.querySelector('h1')?.textContent || '',
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          brokenImages,
          emptyAlts: images.filter(image => !image.alt.trim()).map(image => image.src),
          emptyButtons: emptyButtons.length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          logoFit: getComputedStyle(document.querySelector('.logo-wrap img')).objectFit,
          footerServices: document.querySelectorAll('.footer-services button').length,
          minParagraphSize: Math.min(...readableParagraphs.map(paragraph => paragraph.size)),
          minParagraphWeight: Math.min(...readableParagraphs.map(paragraph => paragraph.weight)),
          schemaValid,
        }
      })

      const label = `${viewportName} ${route}`
      check(result.h1Count === 1, `${label}: expected one H1, found ${result.h1Count}`)
      check(result.h1.toLowerCase().includes(expected.toLowerCase()), `${label}: H1 did not include “${expected}”`)
      check(result.title.includes('Superior Plus'), `${label}: missing route title`)
      check(result.description.length >= 70, `${label}: meta description too short`)
      check(result.canonical.includes('paint-2'), `${label}: canonical missing`)
      check(result.schemaValid, `${label}: invalid structured data`)
      check(result.brokenImages.length === 0, `${label}: broken images: ${result.brokenImages.join(', ')}`)
      check(result.emptyAlts.length === 0, `${label}: images missing alt text`)
      check(result.emptyButtons === 0, `${label}: unnamed buttons detected`)
      check(result.overflow <= 1, `${label}: horizontal overflow of ${result.overflow}px`)
      check(result.logoFit === 'contain', `${label}: logo is cropped because object-fit is “${result.logoFit}”`)
      check(result.footerServices === 9, `${label}: footer lists ${result.footerServices} services instead of nine`)
      check(result.minParagraphSize >= 16, `${label}: paragraph text is too small at ${result.minParagraphSize}px`)
      check(result.minParagraphWeight >= 700, `${label}: paragraph text is not bold enough at weight ${result.minParagraphWeight}`)
      if(route==='/'){
        const descriptionSizes=await page.locator('.hero-copy>p,.section-heading>p,.commercial-top>div:last-child>p,.why-copy>p,.areas-layout>div:first-child>p,.contact-copy>p').evaluateAll(elements=>elements.map(element=>Number.parseFloat(getComputedStyle(element).fontSize)))
        const expectedMinimum=22
        check(descriptionSizes.length===8, `${label}: expected eight primary homepage descriptions, found ${descriptionSizes.length}`)
        check(Math.min(...descriptionSizes)>=expectedMinimum, `${label}: a primary description is below the senior-readable target (${descriptionSizes.join(', ')}px)`)
      }
      if(route==='/services'||route==='/gallery'){
        const selector=route==='/services'?'.services-main .page-hero-copy>p,.services-main .inner-section-heading>p,.services-main .closing-cta p':'.gallery-main .page-hero-copy>p,.gallery-main .inner-section-heading>p,.gallery-main .closing-cta p'
        const descriptionSizes=await page.locator(selector).evaluateAll(elements=>elements.map(element=>Number.parseFloat(getComputedStyle(element).fontSize)))
        const expectedCount=route==='/services'?5:11
        check(descriptionSizes.length===expectedCount, `${label}: expected ${expectedCount} primary descriptions, found ${descriptionSizes.length}`)
        check(Math.min(...descriptionSizes)>=22, `${label}: a primary description is below the senior-readable target (${descriptionSizes.join(', ')}px)`)
      }
      if(route!=='/'){
        const allPrimarySizes=await page.locator('.inner-main .page-hero-copy>p,.inner-main .inner-section-heading>p,.inner-main .closing-cta p').evaluateAll(elements=>elements.map(element=>Number.parseFloat(getComputedStyle(element).fontSize)))
        check(allPrimarySizes.length>0, `${label}: no primary page descriptions were detected`)
        check(Math.min(...allPrimarySizes)>=22, `${label}: a primary page description is below 22px (${allPrimarySizes.join(', ')}px)`)
        if(viewportName==='desktop'){
          const alignments=await page.locator('.inner-main .inner-section-heading').evaluateAll(headings=>headings.filter(heading=>heading.querySelector(':scope>p')).map(heading=>({
            title:heading.querySelector('h2')?.getBoundingClientRect().top,
            description:heading.querySelector(':scope>p')?.getBoundingClientRect().top,
          })))
          check(alignments.every(item=>Math.abs(item.title-item.description)<=12), `${label}: a section description is not aligned with its title (${JSON.stringify(alignments)})`)
        }
      }
      if(route==='/'||route==='/contact'){
        const formReadability=await page.locator(route==='/'?'.quote-form':'.full-quote-form').evaluate(form=>({
          labelSizes:[...form.querySelectorAll('label')].filter(label=>getComputedStyle(label).display!=='none').map(label=>Number.parseFloat(getComputedStyle(label).fontSize)),
          helperSizes:[...form.querySelectorAll('.form-title small,.form-heading small,.form-note,.form-consent')].filter(item=>getComputedStyle(item).display!=='none').map(item=>Number.parseFloat(getComputedStyle(item).fontSize)),
        }))
        check(Math.min(...formReadability.labelSizes)>=16, `${label}: quote-form labels are too small (${formReadability.labelSizes.join(', ')}px)`)
        check(!formReadability.helperSizes.length||Math.min(...formReadability.helperSizes)>=14, `${label}: quote-form supporting text is too small (${formReadability.helperSizes.join(', ')}px)`)
      }
      check(runtimeErrors.length === 0, `${label}: runtime errors: ${runtimeErrors.join(' | ')}`)
    }
    await context.close()
  }

  const desktopNavContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const desktopNavPage = await desktopNavContext.newPage()
  await desktopNavPage.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await desktopNavPage.locator('.nav-main-link').first().waitFor()
  const desktopNavType = await desktopNavPage.locator('.nav-main-link').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))
  await desktopNavPage.locator('.nav-dropdown').first().hover()
  await desktopNavPage.locator('.services-dropdown-grid button').first().waitFor()
  const desktopDropdownType = await desktopNavPage.locator('.services-dropdown-grid button b').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))
  check(desktopNavType >= 16, `desktop menu: primary navigation text is too small (${desktopNavType}px)`)
  check(desktopDropdownType >= 14, `desktop menu: dropdown text is too small (${desktopDropdownType}px)`)
  await desktopNavContext.close()

  const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await interactionContext.newPage()

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  const homeServiceCard = page.locator('.home-service-flip').first()
  await homeServiceCard.waitFor()
  const homeServiceCount = await page.locator('.home-service-flip').count()
  check(homeServiceCount === 9, `homepage services: expected nine image-led flip cards, found ${homeServiceCount}`)
  const homeServiceType = await homeServiceCard.evaluate(element => {
    const box = element.getBoundingClientRect()
    const copy = getComputedStyle(element.querySelector('.home-service-back p'))
    return { width: box.width, height: box.height, size: Number.parseFloat(copy.fontSize), weight: Number.parseInt(copy.fontWeight, 10), text: element.querySelector('.home-service-back p').textContent.trim() }
  })
  check(homeServiceType.width > homeServiceType.height * 1.35, `homepage services: card is not landscape (${homeServiceType.width}×${homeServiceType.height})`)
  check(homeServiceType.size >= 16 && homeServiceType.weight >= 700, `homepage services: back description is not large and bold (${homeServiceType.size}px/${homeServiceType.weight})`)
  check(homeServiceType.text === 'Complete home repaints, interior refreshes and exterior transformations.', 'homepage services: Residential description does not match its service-directory description')
  await homeServiceCard.hover()
  await page.waitForTimeout(50)
  check(await homeServiceCard.getAttribute('aria-pressed') === 'true', 'homepage services: card did not flip on hover')
  check(await homeServiceCard.evaluate(element => element.classList.contains('is-flipped')), 'homepage services: 3D flipped state is missing')
  await homeServiceCard.focus()
  await homeServiceCard.locator('.home-service-read-more').click()
  await page.waitForURL(/#\/services\/residential-painting-melbourne$/)
  check(page.url().endsWith('#/services/residential-painting-melbourne'), 'homepage services: Read more did not open Residential Painting')

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('footer').waitFor()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.locator('.footer-services button', { hasText: 'Residential Painting' }).click()
  await page.waitForURL(/#\/services\/residential-painting-melbourne$/)
  await page.locator('h1').first().waitFor()
  check(await page.evaluate(() => window.scrollY) <= 1, 'route navigation: new page retained the previous scroll position')

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('.menu-btn').click()
  check(await page.locator('#mobile-navigation').isVisible(), 'mobile menu: navigation did not open')
  const mobileNavType = await page.locator('#mobile-navigation>button').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))
  const mobileDropdownType = await page.locator('#mobile-services-menu button').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))
  check(mobileNavType >= 17, `mobile menu: primary navigation text is too small (${mobileNavType}px)`)
  check(mobileDropdownType >= 16, `mobile menu: dropdown text is too small (${mobileDropdownType}px)`)
  check(await page.locator('#mobile-services-menu button').count() === 9, 'mobile menu: all nine service pages are not visible')
  await page.locator('#mobile-services-menu button', { hasText: 'Interior Painting' }).click()
  await page.waitForURL(/#\/services\/interior-painting-melbourne$/)
  check(page.url().endsWith('#/services/interior-painting-melbourne'), 'mobile submenu: service-page navigation failed')
  await page.locator('.menu-btn').click()
  await page.locator('#mobile-navigation button', { hasText: 'Services' }).click()
  await page.waitForURL(/#\/services$/)
  check(page.url().endsWith('#/services'), 'mobile menu: Services navigation failed')

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('.menu-btn').click()
  await page.locator('.mobile-areas-head button[aria-controls="mobile-areas-menu"]').click()
  check(await page.locator('#mobile-areas-menu button').count() === 15, 'mobile areas menu: all 15 suburb pages are not visible')
  await page.locator('#mobile-areas-menu button', { hasText: 'Chadstone' }).click()
  await page.waitForURL(/#\/service-areas\/chadstone$/)
  check(page.url().endsWith('#/service-areas/chadstone'), 'mobile areas menu: suburb navigation failed')

  await page.goto(`${origin}#/faqs`, { waitUntil: 'domcontentloaded' })
  const secondFaq = page.locator('.faq-item').nth(1)
  await secondFaq.locator('button').click()
  check(await secondFaq.locator('.faq-answer').isVisible(), 'FAQ: accordion did not open')
  check(await secondFaq.locator('button').getAttribute('aria-expanded') === 'true', 'FAQ: aria-expanded did not update')
  check(await page.locator('.comparison-board-grid figure').count() === 15, 'FAQ: complete before-and-after comparison-board archive is missing')
  check(await page.locator('.plaster-comparison-grid article').count() === 2, 'FAQ: plaster before-and-after sequences are missing')

  await page.goto(`${origin}#/about`, { waitUntil: 'domcontentloaded' })
  const aboutFlip = page.locator('.flip-feature').first()
  await aboutFlip.waitFor()
  check(await page.locator('.flip-feature').count() === 8, 'About: expected eight image-led standards cards')
  await aboutFlip.click()
  check(await aboutFlip.getAttribute('aria-pressed') === 'true', 'About: standards card did not expose its flipped state')
  check(await aboutFlip.evaluate(element => element.classList.contains('is-flipped')), 'About: 3D standards card did not turn over')
  await aboutFlip.click()
  check(await aboutFlip.getAttribute('aria-pressed') === 'false', 'About: standards card did not turn back')

  await page.goto(`${origin}#/our-process`, { waitUntil: 'domcontentloaded' })
  const processFlip = page.locator('.flip-feature').nth(1)
  await processFlip.waitFor()
  check(await page.locator('.flip-feature').count() === 6, 'Process: expected six image-led promise cards')
  const processFrontType = await processFlip.evaluate(element => ({
    title: Number.parseFloat(getComputedStyle(element.querySelector('.flip-feature-summary strong')).fontSize),
    brief: Number.parseFloat(getComputedStyle(element.querySelector('.flip-feature-summary small')).fontSize),
    titleColor: getComputedStyle(element.querySelector('.flip-feature-summary strong')).color,
  }))
  check(processFrontType.title >= 20 && processFrontType.brief >= 16, `Process: front-card typography is too small (${JSON.stringify(processFrontType)})`)
  check(processFrontType.titleColor !== 'rgb(255, 255, 255)', 'Process: front-card title is not visible against the white card')
  await processFlip.click()
  check(await processFlip.getAttribute('aria-pressed') === 'true', 'Process: promise card did not expose its flipped state')
  const processBackType = await processFlip.evaluate(element => Number.parseFloat(getComputedStyle(element.querySelector('.flip-feature-back p')).fontSize))
  check(processBackType >= 16, `Process: back-card description is too small (${processBackType}px)`)

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  const homeMapQuery = await page.locator('.home-location .contact-map iframe').evaluate(element => new URL(element.src).searchParams.get('q'))
  check(homeMapQuery === '20 Rae Street, Chadstone VIC 3148, Australia', `homepage map: unexpected address “${homeMapQuery}”`)
  check((await page.locator('.home-location .contact-street-address').textContent()).includes('20 Rae Street'), 'homepage map: verified street address is not displayed')

  await page.goto(`${origin}#/contact`, { waitUntil: 'domcontentloaded' })
  const contactMapQuery = await page.locator('.contact-map iframe').evaluate(element => new URL(element.src).searchParams.get('q'))
  check(contactMapQuery === '20 Rae Street, Chadstone VIC 3148, Australia', `contact map: unexpected address “${contactMapQuery}”`)
  check((await page.locator('.contact-street-address').textContent()).includes('20 Rae Street'), 'contact map: street address is not displayed beside the map')
  const form = page.locator('.full-quote-form')
  await form.locator('[name="name"]').fill('QA Test')
  await form.locator('[name="phone"]').fill('0400000000')
  await form.locator('[name="email"]').fill('qa@example.com')
  await form.locator('[name="suburb"]').fill('Chadstone')
  await form.locator('[name="service"]').selectOption({ label: 'Residential Painting' })
  await form.locator('textarea').fill('Automated quote form interaction test.')
  await form.locator('button[type="submit"], button.btn-wide').click()
  check(await form.locator('.form-success').isVisible(), 'contact form: success state did not appear')

  await page.goto(`${origin}#/services/residential-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  await page.locator('.related-card').first().click()
  await page.waitForTimeout(100)
  check(!page.url().endsWith('residential-painting-melbourne'), 'related service: navigation did not change route')

  await page.goto(`${origin}#/services/fence-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  check(await page.locator('.client-media-card').count() === 8, 'project gallery: initial progressive set is incorrect')
  await page.locator('.gallery-more').click()
  check(await page.locator('.client-media-card').count() === 29, 'project gallery: full unique media set did not expand')
  await page.locator('.client-media-card').last().click()
  check(await page.locator('.media-lightbox').isVisible() && await page.locator('.media-lightbox video').count() === 1, 'project gallery: video lightbox did not open')
  await page.locator('.lightbox-close').click()
  check(!(await page.locator('.media-lightbox').count()), 'project gallery: lightbox did not close')

  await page.goto(`${origin}#/gallery`, { waitUntil: 'domcontentloaded' })
  await page.locator('.gallery-photo').first().waitFor()
  check(await page.locator('.gallery-category').count() === 9, 'complete gallery: expected nine labelled service sections')
  check(await page.locator('.gallery-photo').count() === 133, 'complete gallery: expected all 133 project photos to be visible in the page')
  check(await page.locator('.gallery-directory nav button').count() === 9, 'complete gallery: section directory is incomplete')
  const uniqueGallerySources=await page.locator('.gallery-photo img').evaluateAll(images=>new Set(images.map(image=>image.getAttribute('src'))).size)
  check(uniqueGallerySources === 133, `complete gallery: expected 133 unique image sources, found ${uniqueGallerySources}`)
  check(!(await page.locator('.gallery-more').count()), 'complete gallery: photos are hidden behind a load-more control')
  const galleryUrl=page.url()
  const galleryStartScroll=await page.evaluate(()=>window.scrollY)
  await page.locator('.gallery-directory nav button', {hasText:'Commercial Painting'}).click()
  await page.waitForTimeout(100)
  check(page.url() === galleryUrl, 'complete gallery: section shortcut changed the application route')
  const galleryScrollResult=await page.locator('#gallery-commercial').evaluate(element=>({scrollY:window.scrollY,top:element.getBoundingClientRect().top}))
  check(galleryScrollResult.scrollY > galleryStartScroll && galleryScrollResult.top >= 70 && galleryScrollResult.top <= 110, `complete gallery: section shortcut did not scroll beneath the header (${JSON.stringify(galleryScrollResult)})`)
  await page.locator('.gallery-photo').first().click()
  check(await page.locator('.gallery-lightbox').isVisible(), 'complete gallery: photo viewer did not open')
  await page.locator('.gallery-lightbox .lightbox-close').click()
  check(!(await page.locator('.gallery-lightbox').count()), 'complete gallery: photo viewer did not close')

  const apiPage = await interactionContext.newPage()
  await apiPage.addInitScript(() => {
    window.__SPP_CONTENT_API__ = `${window.location.origin}/wp-json/spp/v1`
    window.__SPP_FORM_NONCE__ = 'qa-form-nonce'
  })
  let quoteAttempts = 0
  await apiPage.route('**/wp-json/spp/v1/**', async route => {
    const url = new URL(route.request().url())
    const endpoint = url.pathname.split('/spp/v1')[1]
    if (endpoint === '/bootstrap') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: '1.0.0',
          data: { quote_form: { enabled: true, privacy_text: '' } },
        }),
      })
    }
    if (endpoint === '/services') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: '1.0.0', data: [] }),
      })
    }
    if (endpoint === '/quote') {
      quoteAttempts += 1
      return route.fulfill({
        status: quoteAttempts === 1 ? 502 : 200,
        contentType: 'application/json',
        body: JSON.stringify(
          quoteAttempts === 1
            ? { code: 'spp_quote_delivery_failed', message: 'Temporary delivery failure.' }
            : { schema_version: '1.0.0', data: { delivered: true, message: 'Delivered.' } },
        ),
      })
    }
    return route.fulfill({ status: 404, body: '{}' })
  })
  await apiPage.goto(`${origin}#/contact`, { waitUntil: 'domcontentloaded' })
  await apiPage.locator('[data-content-state="ready"]').waitFor()
  const apiForm = apiPage.locator('.full-quote-form')
  await apiForm.locator('[name="name"]').fill('Delivery QA')
  await apiForm.locator('[name="phone"]').fill('0400000000')
  await apiForm.locator('[name="email"]').fill('delivery@example.com')
  await apiForm.locator('[name="suburb"]').fill('Melbourne')
  await apiForm.locator('[name="service"]').selectOption({ label: 'Residential Painting' })
  await apiForm.locator('[name="details"]').fill('Failure and retry delivery confirmation test.')
  await apiForm.locator('button.btn-wide').click()
  await apiForm.locator('.form-error').waitFor()
  check(await apiForm.locator('.form-error').innerText() === 'Temporary delivery failure.', 'contact form: delivery failure was not shown')
  check(!(await apiForm.locator('.form-success').count()), 'contact form: success appeared before delivery confirmation')
  await apiForm.locator('button.btn-wide').click()
  await apiForm.locator('.form-success').waitFor()
  check(quoteAttempts === 2, 'contact form: failed submission was not retryable')
  check(await apiForm.locator('.form-success').isVisible(), 'contact form: confirmed retry did not show success')

  await interactionContext.close()
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}

console.log(`QA checks: ${checks}`)
console.log(`Routes: ${routes.length}`)
console.log(`Viewports: ${viewports.map(([name]) => name).join(', ')}`)
if (failures.length) {
  console.error(`Failures: ${failures.length}`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log('Failures: 0')
  console.log('Result: PASS')
}
