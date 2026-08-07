import { chromium } from 'playwright-core'

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser = await chromium.launch({ executablePath: edge, headless: true })

try {
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport })
    await page.goto('https://sppaintingremodeling.com.au/', { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.hero-title-seo')
    const details = await page.evaluate(() => {
      const box = selector => {
        const element = document.querySelector(selector)
        if (!element) return null
        const rect = element.getBoundingClientRect()
        return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height }
      }
      return {
        scrollY,
        viewport: [innerWidth, innerHeight],
        hero: box('.hero'),
        copy: box('.hero-copy'),
        title: box('.hero-title-seo'),
        intro: box('.home-hero-intro'),
        buttons: box('.hero-buttons'),
        trust: box('.hero-trust'),
        commercialTop: box('.commercial-top'),
        commercialHeading: box('.commercial-top h2'),
        commercialCopy: box('.commercial-top>div:last-child'),
      }
    })
    await page.screenshot({ path: `docs/live-home-${name}.png`, fullPage: true })
    console.log(JSON.stringify({ name, details }))
    await page.close()
  }
} finally {
  await browser.close()
}
