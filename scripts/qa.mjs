import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright-core'
import { serviceAreas } from '../src/data/serviceAreas.js'
import { paintingGuides } from '../src/data/paintingGuides.js'
import { newBatchPhotoCount } from '../src/data/newBatchMedia.js'

const root = join(process.cwd(), 'dist')
const port = 4188
const origin = `http://127.0.0.1:${port}/`
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const routes = [
  ['/', 'Professional painting services in Melbourne'],
  ['/about', 'Your Trusted Painting Professionals in Melbourne'],
  ['/services', 'Painting & property services'],
  ['/additional-services', 'Complete Property Improvement Services in Melbourne'],
  ['/services/residential-painting-melbourne', 'Trusted Residential Painters in Melbourne'],
  ['/services/commercial-painting-melbourne', 'Professional Commercial Painting Services in Melbourne'],
  ['/services/interior-painting-melbourne', 'Professional Interior Painting Services in Melbourne'],
  ['/services/exterior-painting-melbourne', 'Professional Exterior Painting Services in Melbourne'],
  ['/services/roof-painting-melbourne', 'Professional Roof Painting Services in Melbourne'],
  ['/services/fence-painting-melbourne', 'Professional Fence Painting Services in Melbourne'],
  ['/services/deck-painting-staining-melbourne', 'Professional Deck Painting & Staining Services in Melbourne'],
  ['/services/wallpaper-removal-melbourne', 'Professional Wallpaper Removal Services in Melbourne'],
  ['/services/plaster-repairs-melbourne', 'Professional Plaster Repairs in Melbourne'],
  ['/our-process', 'A Proven Process for Exceptional Results'],
  ['/faqs', 'Frequently asked questions'],
  ['/contact', 'Get in touch'],
  ['/gallery', 'Every project'],
  ['/service-areas', 'Professional painters servicing'],
  ...serviceAreas.map(area => [`/service-areas/${area.slug}`, `Painters in ${area.name}`]),
  ['/painting-guides', 'Practical painting advice'],
  ...paintingGuides.map(guide => [`/painting-guides/${guide.slug}`, guide.title]),
  ['/blog', 'Practical painting advice'],
  ...paintingGuides.map(guide => [`/blog/${guide.slug}`, guide.title]),
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
      try {
        await page.locator('h1:visible').first().waitFor({ state: 'visible', timeout: 5000 })
      } catch (error) {
        const diagnostic=await page.locator('#main-content').innerText().catch(()=>'(main unavailable)')
        throw new Error(`${viewportName} ${route}: no visible H1; runtime=${runtimeErrors.join(' | ')||'none'}; main=${diagnostic.slice(0,500)}`,{cause:error})
      }
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
          h1: [...document.querySelectorAll('h1')].find(element=>element.getClientRects().length)?.textContent || '',
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content || '',
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          brokenImages,
          emptyAlts: images.filter(image => !image.alt.trim()).map(image => image.src),
          emptyButtons: emptyButtons.length,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          logoFit: getComputedStyle(document.querySelector('.logo-wrap img')).objectFit,
          footerServices: document.querySelectorAll('.footer-services button').length,
          footerStats: [...document.querySelectorAll('footer .footer-stats>div')].map(item=>({
            value:item.querySelector('strong')?.textContent.trim(),
            label:item.querySelector(':scope>span')?.textContent.trim(),
          })),
          homeStats: [...document.querySelectorAll('.home-stats-band .footer-stats>div')].map(item=>({
            value:item.querySelector('strong')?.textContent.trim(),
            label:item.querySelector(':scope>span')?.textContent.trim(),
          })),
          footerTrustBadges: document.querySelectorAll('footer .footer-trust-image').length,
          homeTrustBadges: document.querySelectorAll('.home-stats-band .footer-trust-image').length,
          quickContacts: [...document.querySelectorAll('.floating-contact-actions>a')].map(item=>({
            href:item.getAttribute('href'),
            label:item.getAttribute('aria-label'),
            visible:item.getBoundingClientRect().width>=56&&item.getBoundingClientRect().right<=window.innerWidth+1,
          })),
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
      check(result.footerServices === 10, `${label}: footer does not include all nine core services and the additional-services page (${result.footerServices})`)
      check(result.footerStats.length===0, `${label}: footer still contains the removed statistics band`)
      check(result.footerTrustBadges===0, `${label}: footer still contains the relocated trust badges`)
      check(result.quickContacts.length===2&&result.quickContacts.every(item=>item.visible), `${label}: floating contact actions are missing or clipped`)
      check(result.quickContacts[0]?.href?.startsWith('tel:')&&result.quickContacts[1]?.href?.startsWith('mailto:'), `${label}: floating contact destinations are incorrect (${JSON.stringify(result.quickContacts)})`)
      check(result.quickContacts.every(item=>item.label), `${label}: floating contact action is missing an accessible label`)
      check(result.minParagraphSize >= 16, `${label}: paragraph text is too small at ${result.minParagraphSize}px`)
      check(result.minParagraphWeight >= 700, `${label}: paragraph text is not bold enough at weight ${result.minParagraphWeight}`)
      if(route==='/'){
        check(result.homeStats.length===3, `${label}: upper homepage statistics band is incomplete`)
        check(result.homeStats.map(item=>item.value).join('|')==='670+|99%|500+', `${label}: upper homepage statistics values changed unexpectedly (${JSON.stringify(result.homeStats)})`)
        check(result.homeTrustBadges===3, `${label}: homepage trust badge group is incomplete`)
        const homeStatsColors=await page.locator('.home-stats-band').evaluate(element=>({
          band:getComputedStyle(element).backgroundColor,
          panel:getComputedStyle(element.querySelector('.home-project-stats')).backgroundColor,
          followingSection:getComputedStyle(document.querySelector('.commercial')).backgroundColor,
          precedingDivider:getComputedStyle(document.querySelector('.services-section .divider-path')).fill,
          boundaryHeight:Number.parseFloat(getComputedStyle(element,'::after').height),
          boundaryBackground:getComputedStyle(element,'::after').backgroundImage,
        }))
        check(homeStatsColors.band===homeStatsColors.panel, `${label}: statistics panel does not match its green section (${JSON.stringify(homeStatsColors)})`)
        check(homeStatsColors.band===homeStatsColors.followingSection&&homeStatsColors.band===homeStatsColors.precedingDivider, `${label}: statistics band is sandwiched between mismatched greens (${JSON.stringify(homeStatsColors)})`)
        check(homeStatsColors.boundaryHeight>=6&&homeStatsColors.boundaryBackground!=='none', `${label}: statistics band lacks a visible transition boundary (${JSON.stringify(homeStatsColors)})`)
        const homeServiceImages=await page.locator('.home-service-front').evaluateAll(elements=>Object.fromEntries(elements.map(element=>[
          element.querySelector('strong')?.textContent.trim(),
          element.querySelector('img')?.getAttribute('src')||'',
        ])))
        check(Object.keys(homeServiceImages).length===9, `${label}: expected nine homepage service images`)
        check(Object.values(homeServiceImages).every(source=>source.includes('/new-batch/')||source.includes('/projects/roof/')), `${label}: an outdated homepage service image remains (${JSON.stringify(homeServiceImages)})`)
        check(homeServiceImages['Roof Painting']?.includes('/roof-commercial-coating.webp'), `${label}: roof card is not using the requested commercial-roof photo`)
        check(homeServiceImages['Deck Painting & Staining']?.includes('/batch-108.webp'), `${label}: deck card no longer matches its service hero`)
        const badgeLayout=await page.locator('.home-project-stats .footer-trust-image').evaluateAll(elements=>elements.map(element=>({
          width:Math.round(element.getBoundingClientRect().width),
          height:Math.round(element.getBoundingClientRect().height),
          alignedWithCounter:element.parentElement?.matches('.home-project-stats>div')||false,
        })))
        check(badgeLayout.every(item=>item.width===badgeLayout[0].width&&item.height===badgeLayout[0].height), `${label}: homepage trust badges are not equally sized (${JSON.stringify(badgeLayout)})`)
        check(badgeLayout.every(item=>item.alignedWithCounter), `${label}: a homepage trust badge is not aligned inside its counter column`)
        const descriptionSizes=await page.locator('.hero-copy>p,.section-heading>p,.commercial-top>div:last-child>p,.why-copy>p,.home-areas-copy>p,.contact-copy>p').evaluateAll(elements=>elements.map(element=>Number.parseFloat(getComputedStyle(element).fontSize)))
        const expectedMinimum=22
        check(descriptionSizes.length===8, `${label}: expected eight primary homepage descriptions, found ${descriptionSizes.length}`)
        check(Math.min(...descriptionSizes)>=expectedMinimum, `${label}: a primary description is below the senior-readable target (${descriptionSizes.join(', ')}px)`)
        const compactAreaCards=page.locator('.home-area-grid>button')
        const compactVisibleCount=await compactAreaCards.evaluateAll(elements=>elements.filter(element=>element.getBoundingClientRect().height>0).length)
        check(await compactAreaCards.count()===12, `${label}: compact service-area directory should render 12 priority suburbs`)
        check(compactVisibleCount===(viewportName==='mobile'?8:12), `${label}: compact service-area directory shows ${compactVisibleCount} visible cards`)
        const areaToggle=page.locator('.home-area-toggle')
        check(await areaToggle.getAttribute('aria-expanded')==='false', `${label}: service-area directory starts expanded`)
        await areaToggle.click()
        check(await page.locator('.home-area-grid>button').count()===serviceAreas.length, `${label}: Show more does not reveal all ${serviceAreas.length} suburbs`)
        check(await areaToggle.getAttribute('aria-expanded')==='true', `${label}: expanded service-area state is not announced`)
        await areaToggle.click()
        await page.waitForFunction(()=>document.querySelectorAll('.home-area-grid>button').length===12)
        check(await page.locator('.home-area-grid>button').count()===12, `${label}: Show fewer does not restore the compact directory`)
        check(await page.getByRole('button',{name:/View all service areas/i}).count()===1, `${label}: full service-area directory link is missing`)
      }
      if(route==='/services'||route==='/gallery'){
        const selector=route==='/services'?'.services-main .page-hero-copy>p,.services-main .inner-section-heading>p,.services-main .closing-cta p':'.gallery-main .page-hero-copy>p,.gallery-main .inner-section-heading>p,.gallery-main .closing-cta p'
        const descriptionSizes=await page.locator(selector).evaluateAll(elements=>elements.map(element=>Number.parseFloat(getComputedStyle(element).fontSize)))
        const expectedCount=route==='/services'?5:11
        check(descriptionSizes.length===expectedCount, `${label}: expected ${expectedCount} primary descriptions, found ${descriptionSizes.length}`)
        check(Math.min(...descriptionSizes)>=22, `${label}: a primary description is below the senior-readable target (${descriptionSizes.join(', ')}px)`)
      }
      if(route.startsWith('/services/')){
        check(await page.locator('.scope-section').count()===1&&await page.locator('.process-section').count()===1,`${label}: approved scope or process section is missing`)
        check(await page.locator('.benefit-section').count()===1,`${label}: designed approved benefits section is missing`)
        check(await page.locator('.service-why-gallery').count()===1,`${label}: Why Choose copy is not paired with the project gallery`)
        const whyCopy=(await page.locator('.service-why-gallery .inner-section-heading').innerText()).toLowerCase()
        check(whyCopy.includes('why choose')||whyCopy.includes('why businesses'),`${label}: approved Why Choose heading is missing from the project gallery`)
        check(!(await page.locator('.process-section .inner-section-heading').innerText()).toLowerCase().includes('why choose'),`${label}: Why Choose copy is still incorrectly attached to the process section`)
        check(await page.locator('.service-local-approved').count()===1,`${label}: approved service-area statement is missing`)
        const localArea=await page.locator('.service-local-card').evaluate(element=>({
          paragraphSize:Number.parseFloat(getComputedStyle(element.querySelector(':scope > div:first-child > p')).fontSize),
          image:element.querySelector('img')?.getAttribute('src')||'',
        }))
        check(localArea.paragraphSize>=(viewportName==='mobile'?20:24),`${label}: service-area copy is below the prominent type target (${localArea.paragraphSize}px)`)
        check(localArea.image.includes('exterior-07.webp'),`${label}: service-area feature image is not the approved completed-home photograph`)
        check((await page.locator('.closing-cta').innerText()).toLowerCase().includes('quote'),`${label}: client-approved quote section is missing`)
      }
      if(route==='/additional-services'){
        check(await page.locator('.additional-services-main').count()===1,`${label}: additional services is not using its standalone page treatment`)
        check(await page.locator('.additional-service-grid article').count()===8,`${label}: PDF-approved additional services directory is incomplete`)
        check(await page.locator('.additional-service-icon svg').count()===8,`${label}: additional services cards are missing professional icon treatments`)
      }
      if(route==='/service-areas'){
        const areaNames=await page.locator('.area-directory-card h3').allTextContents()
        check(serviceAreas.length===67, `${label}: expected 67 deduplicated approved service areas, found ${serviceAreas.length}`)
        check(areaNames.length===67, `${label}: service-area directory shows ${areaNames.length} suburb cards instead of 67`)
        check(new Set(areaNames).size===67, `${label}: service-area directory contains duplicate suburbs`)
        for(const suburb of ['Hawthorn','Kew','Camberwell','Balwyn','Box Hill','Malvern','Glen Iris','Vermont','Blackburn','Ringwood','Ferntree Gully','Rowville','Croydon','Lilydale','Chirnside Park']){
          check(areaNames.includes(`Painters in ${suburb}`), `${label}: PDF-approved suburb ${suburb} is missing`)
        }
        const coverageText=await page.locator('.eastern-service-scope').innerText()
        for(const marker of ['Interior Painting Eastern Suburbs Melbourne','Exterior Painting Eastern Suburbs Melbourne','Complete house repaints','Body corporate buildings','Quality preparation and workmanship']){
          check(coverageText.includes(marker), `${label}: PDF-approved Eastern Suburbs content is missing “${marker}”`)
        }
      }
      if(route==='/blog'){
        check(paintingGuides.length===19, `${label}: expected the four completed blogs plus 15 expanded client SEO briefs`)
        check(await page.locator('.blog-grid .guide-card').count()===paintingGuides.length, `${label}: dedicated blog does not show all ${paintingGuides.length} articles`)
        check(await page.getByRole('button',{name:/Read article/i}).count()===paintingGuides.length, `${label}: blog articles are not independently selectable`)
        check(await page.locator('.nav-links .nav-main-link').filter({hasText:'Blog'}).count()===1, `${label}: Blog is missing from the desktop navigation`)
        const desktopNav=await page.locator('.nav-links .nav-main-link').allTextContents()
        check(desktopNav.join('|')==='Home|Services|Areas|Gallery|About|Our Process|FAQs|Blog|Contact', `${label}: desktop navigation order is incoherent (${desktopNav.join('|')})`)
        if(viewportName!=='desktop'){
          await page.locator('.menu-btn').click()
          const mobileNav=await page.locator('.mobile-menu>button,.mobile-menu>.mobile-services .mobile-services-head>button:first-child').allTextContents()
          check(mobileNav.join('|')==='Home|Services|Areas|Gallery|About|Our Process|FAQs|Blog|Contact', `${label}: mobile navigation order is incoherent (${mobileNav.join('|')})`)
          await page.locator('.menu-btn').click()
        }
      }
      if(route.startsWith('/blog/')){
        const articleText=await page.locator('.guide-article-body').innerText()
        const guide=paintingGuides.find(item=>item.slug===route.split('/').pop())
        const guideIndex=paintingGuides.findIndex(item=>item.slug===route.split('/').pop())
        const expectedMarker=guide.sections[0][0]
        check(articleText.includes(expectedMarker), `${label}: PDF-approved article content marker is missing`)
        check(await page.locator('.guide-article-body>section').count()>=(guideIndex<4?6:4), `${label}: client-supplied or expanded article is incomplete`)
        check(await page.locator('.blog-more .guide-card').count()===6, `${label}: article does not offer six alternative Blog posts`)
        check(await page.locator('.blog-more').getByRole('button',{name:/Read article/i}).count()===6, `${label}: alternative Blog posts are not directly selectable`)
        check(await page.locator('.guide-article aside nav button').count()===await page.locator('.guide-article-body>section:not(.guide-takeaways):not(.guide-references)').count(), `${label}: numbered article navigation is incomplete`)
        if(viewportName==='desktop'){
          const routeHash=await page.evaluate(()=>window.location.hash)
          await page.locator('.guide-article aside nav button').last().click()
          await page.waitForTimeout(80)
          check(await page.evaluate(()=>window.location.hash)===routeHash, `${label}: numbered navigation replaced the Blog route`)
          check(await page.locator('.guide-article-body>section:not(.guide-takeaways):not(.guide-references)').last().evaluate(section=>Math.abs(section.getBoundingClientRect().top-120)<30), `${label}: numbered navigation did not scroll to its article section`)
        }
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
  check(await desktopNavPage.locator('.additional-services-link').isVisible(),'desktop menu: dedicated Additional property services slot is missing')
  const desktopDropdownType = await desktopNavPage.locator('.services-dropdown-grid button b').first().evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))
  check(desktopNavType >= 16, `desktop menu: primary navigation text is too small (${desktopNavType}px)`)
  check(desktopDropdownType >= 14, `desktop menu: dropdown text is too small (${desktopDropdownType}px)`)
  await desktopNavContext.close()

  const interactionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await interactionContext.newPage()

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  check((await page.locator('.hero-bg img').getAttribute('src')).includes('client/projects/brand/home-hero-ai-v2.webp'),'homepage hero: high-impact generated branded image is missing')
  const initialReviewNumber=await page.locator('.slider-controls>span').textContent()
  await page.waitForFunction(previous=>document.querySelector('.slider-controls>span')?.textContent!==previous,initialReviewNumber,{timeout:4500})
  check((await page.locator('.review-autoplay-status').textContent()).startsWith('Reviews change automatically'),'homepage reviews: automatic carousel status is missing')
  const reviewBeforeSwipe=await page.locator('.slider-controls>span').textContent()
  await page.locator('.quote-card').dispatchEvent('pointerdown',{pointerType:'touch',isPrimary:true,clientX:310,clientY:400})
  await page.locator('.quote-card').dispatchEvent('pointerup',{pointerType:'touch',isPrimary:true,clientX:90,clientY:410})
  check(await page.locator('.slider-controls>span').textContent()!==reviewBeforeSwipe,'homepage reviews: left swipe did not advance the carousel')
  await page.getByRole('button',{name:'Next review'}).click()
  const manuallySelectedReview=await page.locator('.slider-controls>span').textContent()
  await page.waitForFunction(previous=>document.querySelector('.slider-controls>span')?.textContent!==previous,manuallySelectedReview,{timeout:4500})
  check((await page.locator('.review-autoplay-status').textContent()).startsWith('Reviews change automatically'),'homepage reviews: automatic rotation stopped after manual navigation')
  await page.locator('.review-playback').click()
  const pausedReviewNumber=await page.locator('.slider-controls>span').textContent()
  await page.waitForTimeout(3200)
  check(await page.locator('.slider-controls>span').textContent()===pausedReviewNumber,'homepage reviews: pause control did not stop automatic rotation')
  check((await page.locator('.google-review-summary').textContent()).includes('129 reviews'),'homepage reviews: official Google review count is missing')
  check((await page.locator('.google-reviews .slider-controls>span').first().textContent()).includes('/ 07'),'homepage reviews: carousel does not contain the seven verified Google reviews')
  check((await page.locator('.google-review-summary a').getAttribute('href'))==='https://tinyurl.com/36jdkp9d','homepage reviews: official Google profile link is missing')
  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  const southEasternFilter=page.locator('.home-area-regions button',{hasText:'South Eastern Suburbs'})
  await southEasternFilter.click()
  await page.waitForFunction(()=>document.querySelectorAll('.home-area-grid>button').length===9)
  const filteredAreaState=await page.locator('.home-area-grid>button').evaluateAll(elements=>({
    names:elements.map(element=>element.textContent),
    visible:elements.filter(element=>element.getBoundingClientRect().height>0).length,
    scrollY:window.scrollY,
  }))
  check(filteredAreaState.names.some(name=>name.includes('Malvern'))&&filteredAreaState.names.some(name=>name.includes('Clayton South')), 'homepage areas: South Eastern Suburbs filter did not populate its suburb cards')
  check(filteredAreaState.visible===8, `homepage areas: expected eight visible filtered cards on mobile, found ${filteredAreaState.visible}`)
  check(filteredAreaState.scrollY>0, 'homepage areas: mobile region selection did not move to the suburb directory')
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
  check(await page.locator('#mobile-services-menu button').count() === 10, 'mobile menu: nine core services plus Additional property services are not visible')
  await page.locator('#mobile-services-menu button', { hasText: 'Interior Painting' }).click()
  await page.waitForURL(/#\/services\/interior-painting-melbourne$/)
  check(page.url().endsWith('#/services/interior-painting-melbourne'), 'mobile submenu: service-page navigation failed')
  await page.locator('.menu-btn').click()
  await page.locator('#mobile-navigation').getByRole('button',{name:'Services',exact:true}).click()
  await page.waitForURL(/#\/services$/)
  check(page.url().endsWith('#/services'), 'mobile menu: Services navigation failed')

  await page.goto(`${origin}#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('.menu-btn').click()
  await page.locator('.mobile-areas-head button[aria-controls="mobile-areas-menu"]').click()
  check(await page.locator('#mobile-areas-menu button').count() === serviceAreas.length, `mobile areas menu: all ${serviceAreas.length} suburb pages are not visible`)
  await page.locator('#mobile-areas-menu button', { hasText: 'Chadstone' }).click()
  await page.waitForURL(/#\/service-areas\/chadstone$/)
  check(page.url().endsWith('#/service-areas/chadstone'), 'mobile areas menu: suburb navigation failed')

  await page.goto(`${origin}#/faqs`, { waitUntil: 'domcontentloaded' })
  const secondFaq = page.locator('.faq-item').nth(1)
  await secondFaq.locator('button').click()
  check(await secondFaq.locator('.faq-answer').isVisible(), 'FAQ: accordion did not open')
  check(await secondFaq.locator('button').getAttribute('aria-expanded') === 'true', 'FAQ: aria-expanded did not update')
  check(await page.locator('.comparison-board-grid figure').count() === 35, 'FAQ: complete before-and-after comparison-board archive is missing')
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
  const homeMap = await page.locator('.home-location .contact-map iframe').evaluate(element => {
    const url = new URL(element.src)
    return { hostname: url.hostname, pathname: url.pathname, place: url.searchParams.get('pb') }
  })
  check(homeMap.hostname === 'www.google.com' && homeMap.pathname === '/maps/embed' && homeMap.place?.includes('Superior plus painting & remodeling'), `homepage map: unexpected business listing “${JSON.stringify(homeMap)}”`)
  check((await page.locator('.home-location .contact-street-address').textContent()).includes('20 Rae Street'), 'homepage map: verified street address is not displayed')

  await page.goto(`${origin}#/contact`, { waitUntil: 'domcontentloaded' })
  const contactMap = await page.locator('.contact-map iframe').evaluate(element => {
    const url = new URL(element.src)
    return { hostname: url.hostname, pathname: url.pathname, place: url.searchParams.get('pb') }
  })
  check(contactMap.hostname === 'www.google.com' && contactMap.pathname === '/maps/embed' && contactMap.place?.includes('Superior plus painting & remodeling'), `contact map: unexpected business listing “${JSON.stringify(contactMap)}”`)
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

  await page.goto(`${origin}#/faqs`, { waitUntil: 'domcontentloaded' })
  const faqReviews=page.locator('.faq-google-reviews')
  check(await faqReviews.count()===1,'FAQs: Google review section is missing')
  check(await faqReviews.locator('.google-review-card').count()===1,'FAQs: Google review carousel card is missing')
  check((await faqReviews.locator('.slider-controls>span').textContent()).includes('/ 07'),'FAQs: carousel does not contain the seven verified Google reviews')
  check(await page.locator('.faq-google-reviews + .client-testimonial-archive').count()===1,'FAQs: supplied testimonial archive is not placed after Google reviews')
  check(await page.locator('.client-testimonial-grid article').count()===4,'FAQs: four client-supplied PDF testimonials are not present')
  check(await page.locator('.client-testimonial-archive ~ .faq-transformations').count()===1,'FAQs: before-and-after archive is not placed after the review content')
  check(await page.locator('.comparison-board-grid figure').count()>=35,'FAQs: expanded before-and-after archive is incomplete')
  check(await page.locator('.comparison-board-grid img[src*="roof-before-after"]').count()===1,'FAQs: roof before-and-after comparison is missing')

  await page.goto(`${origin}#/services/residential-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  check((await page.locator('.page-hero-copy h1').textContent()).startsWith('Trusted Residential Painters in Melbourne'),'service hero: residential headline does not match the client PDF')
  const residentialReadability=await page.evaluate(()=>({
    scopeItems:document.querySelectorAll('.scope-item').length,
    scopeIcons:document.querySelectorAll('.scope-item .scope-icon svg').length,
    scopeType:Math.min(...[...document.querySelectorAll('.scope-item b')].map(element=>Number.parseFloat(getComputedStyle(element).fontSize))),
    processType:Math.min(...[...document.querySelectorAll('.service-process span')].map(element=>Number.parseFloat(getComputedStyle(element).fontSize))),
  }))
  check(residentialReadability.scopeIcons===residentialReadability.scopeItems&&residentialReadability.scopeIcons>0,'service scope: painting icons are missing')
  check(residentialReadability.scopeType>=16,'service scope: card text is still too small')
  check(residentialReadability.processType>=16,'service process: step text is still too small')
  const residentialAreaCopy=await page.locator('main').innerText()
  check(residentialAreaCopy.includes('We proudly service Melbourne including Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Mulgrave, Clayton, Dandenong, Noble Park, Berwick, Narre Warren, Endeavour Hills and surrounding suburbs.'),'service local areas: exact PDF paragraph is missing')
  const residentialHero=await page.locator('.page-hero-visual img').evaluate(image=>({src:image.getAttribute('src'),position:getComputedStyle(image).objectPosition}))
  check(residentialHero.src.includes('/new-batch/'), `service hero: residential page is not using the new client batch (${JSON.stringify(residentialHero)})`)
  check(residentialHero.position!=='50% 50%', `service hero: focal position was not intentionally set (${JSON.stringify(residentialHero)})`)
  await page.locator('.related-card').first().click()
  await page.waitForTimeout(100)
  check(!page.url().endsWith('residential-painting-melbourne'), 'related service: navigation did not change route')

  await page.goto(`${origin}#/services/roof-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  const roofHeroSource=await page.locator('.page-hero-visual img').getAttribute('src')
  check(roofHeroSource?.includes('/roof-spray-coating.webp'), `roof service hero: expected the new roof-spraying photo, found ${roofHeroSource}`)
  check((await page.locator('main').innerText()).includes('We provide roof painting services across Melbourne, including Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Mulgrave, Clayton, Dandenong, Noble Park, Springvale, Keysborough, Berwick, Narre Warren, Endeavour Hills and surrounding suburbs.'),'roof service local areas: exact PDF paragraph is missing')

  await page.goto(`${origin}#/services/fence-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  check(await page.locator('.client-media-card').count() === 8, 'project gallery: initial progressive set is incorrect')
  check(await page.locator('.client-media-card.fit-contain').count() > 0, 'project gallery: portrait and legacy photos are still forced into a cropped cover fit')
  await page.locator('.gallery-more').click()
  check(await page.locator('.client-media-card').count() === 36, 'project gallery: full unique media set did not expand')
  await page.locator('.client-media-card').last().click()
  check(await page.locator('.media-lightbox').isVisible() && await page.locator('.media-lightbox video').count() === 1, 'project gallery: video lightbox did not open')
  await page.locator('.lightbox-close').click()
  check(!(await page.locator('.media-lightbox').count()), 'project gallery: lightbox did not close')

  await page.goto(`${origin}#/gallery`, { waitUntil: 'domcontentloaded' })
  await page.locator('.gallery-photo').first().waitFor()
  check(await page.locator('.gallery-category').count() === 9, 'complete gallery: expected nine labelled service sections')
  check(newBatchPhotoCount === 164, `complete gallery: expected 164 unique optimized photos from the new batch, found ${newBatchPhotoCount}`)
  check(await page.locator('.gallery-photo').count() === 300, 'complete gallery: expected all 300 approved project photos to be visible in the page')
  check(await page.locator('.gallery-directory nav button').count() === 9, 'complete gallery: section directory is incomplete')
  const uniqueGallerySources=await page.locator('.gallery-photo img').evaluateAll(images=>new Set(images.map(image=>image.getAttribute('src'))).size)
  check(uniqueGallerySources === 300, `complete gallery: expected 300 unique approved image sources, found ${uniqueGallerySources}`)
  const newBatchGallerySources=await page.locator('.gallery-photo img[src*="/new-batch/"]').count()
  check(newBatchGallerySources === newBatchPhotoCount, `complete gallery: ${newBatchPhotoCount-newBatchGallerySources} optimized new-batch photos are missing`)
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
    if (endpoint === '/routes/services/residential-painting-melbourne') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: '1.0.0',
          data: {
            template_key: 'service',
            title: 'Residential Painting',
            seo: { title: 'Editable residential page', description: '', social_image: null },
            closing_cta: { title: '', text: '', link: { label: '', url: '' } },
            content: {
              id: 501,
              slug: 'residential-painting-melbourne',
              title: 'Residential Painting',
              short: '',
              copy_version: 'pdf-verbatim-2026-08-01',
              hero: { eyebrow: '', title: 'Editable Residential Hero', accent: '', intro: '', image: null },
              scope_title: '',
              scope: [],
              document_sections: [],
              why: '',
              process: [],
              benefits: [],
              related: [],
              gallery: [],
              section_labels: {
                scope_eyebrow: '', scope_accent: '', scope_intro: '',
                process_eyebrow: '', process_title: '', process_accent: '',
                benefits_title: '', benefits_accent: '',
                related_eyebrow: '', related_title: '', related_accent: '',
              },
            },
          },
        }),
      })
    }
    if (endpoint === '/routes/gallery') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: '1.0.0',
          data: {
            template_key: 'gallery',
            title: 'Gallery',
            seo: { title: 'Editable gallery', description: '', social_image: null },
            hero: { eyebrow: '', title: 'Editable Gallery Hero', accent: '', intro: '', image: null },
            closing_cta: { title: '', text: '', link: { label: '', url: '' } },
            content: {
              fields: {
                __configured: ['content_sections', 'secondary_image', 'related_pages'],
                content_sections: [{ title: 'Editable gallery section', text: '<p>Visible editor-managed gallery copy.</p>' }],
                secondary_image: null,
                related_pages: [{ id: 901, title: 'Editable related page', path: '/contact' }],
              },
            },
          },
        }),
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

  await apiPage.goto(`${origin}#/services/residential-painting-melbourne`, { waitUntil: 'domcontentloaded' })
  await apiPage.locator('[data-content-state="ready"]').waitFor()
  await apiPage.locator('.page-hero-copy h1').waitFor()
  check((await apiPage.locator('.page-hero-copy h1').innerText()).trim()==='Editable Residential Hero', 'editor authority: service hero title was replaced by hardcoded approved copy')
  check(!(await apiPage.locator('.page-hero-copy .eyebrow').count()), 'editor authority: intentionally blank hero eyebrow reappeared')
  check(!(await apiPage.locator('.page-hero-copy>p').count()), 'editor authority: intentionally blank hero introduction reappeared')
  check((await apiPage.locator('.scope-grid .scope-item').count())===0, 'editor authority: deleted service scope cards reappeared')
  check((await apiPage.locator('.service-process article').count())===0, 'editor authority: deleted service process steps reappeared')
  check((await apiPage.locator('.related-grid .related-card').count())===0, 'editor authority: deleted related services reappeared')

  await apiPage.goto(`${origin}#/gallery`, { waitUntil: 'domcontentloaded' })
  await apiPage.locator('[data-content-state="ready"]').waitFor()
  await apiPage.getByRole('heading', { name: 'Editable gallery section' }).waitFor()
  check(await apiPage.getByText('Visible editor-managed gallery copy.').isVisible(), 'editor authority: shared content section did not render on gallery template')
  check(await apiPage.getByRole('heading', { name: 'Editable related page' }).isVisible(), 'editor authority: related-page selection did not render on gallery template')
  check((await apiPage.locator('.managed-page-extra .editorial-image').count())===0, 'editor authority: intentionally removed secondary image reappeared')

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
