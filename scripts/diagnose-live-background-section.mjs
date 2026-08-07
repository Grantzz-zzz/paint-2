import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const output = 'docs/live-background-section-diagnostic.png'
await mkdir('docs', { recursive: true })
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const failures = []
  page.on('requestfailed', request => failures.push(`${request.failure()?.errorText}: ${request.url()}`))
  const routeResponses = []
  page.on('response', response => {
    if (response.url().includes('/wp-json/spp/')) routeResponses.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('https://sppaintingremodeling.com.au/about/', { waitUntil: 'networkidle', timeout: 60000 })
  const section = page.locator('.managed-content-section.layout-image-background').first()
  await page.waitForTimeout(5000)
  if (!await section.count()) {
    const snapshot = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      bodyText: document.body.innerText.slice(0, 2500),
      managedSections: [...document.querySelectorAll('.managed-content-section')].map(element => element.className),
      sectionHeadings: [...document.querySelectorAll('section h2')].map(element => element.textContent.trim()),
      scripts: [...document.scripts].map(element => element.src).filter(Boolean),
    }))
    await page.screenshot({ path: output, fullPage: true })
    console.log(JSON.stringify({ missingBackgroundSection: true, snapshot, routeResponses, failedRequests: failures, screenshot: output }, null, 2))
    process.exitCode = 2
  } else {
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1000)
  const details = await section.evaluate(element => {
    const image = element.querySelector('.managed-content-background img')
    const background = element.querySelector('.managed-content-background')
    const overlay = element.querySelector('.managed-content-background span')
    const imageStyle = image ? getComputedStyle(image) : null
    const backgroundStyle = background ? getComputedStyle(background) : null
    return {
      classes: element.className,
      sectionBackground: getComputedStyle(element).backgroundColor,
      imageSrc: image?.currentSrc || image?.src || '',
      imageComplete: image?.complete || false,
      imageNaturalSize: image ? [image.naturalWidth, image.naturalHeight] : [0, 0],
      imageDisplay: imageStyle?.display,
      imageVisibility: imageStyle?.visibility,
      imageOpacity: imageStyle?.opacity,
      backgroundZIndex: backgroundStyle?.zIndex,
      backgroundDisplay: backgroundStyle?.display,
      overlayBackground: overlay ? getComputedStyle(overlay).backgroundImage : '',
      sectionSize: [element.clientWidth, element.clientHeight],
    }
  })
  await section.screenshot({ path: output })
  console.log(JSON.stringify({ details, failedRequests: failures, screenshot: output }, null, 2))
  }
} finally {
  await browser.close()
}
