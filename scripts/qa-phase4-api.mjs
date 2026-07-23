import { chromium } from 'playwright-core'

const base=(process.env.SPP_WP_URL||'http://127.0.0.1:9419').replace(/\/$/,'')
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser=await chromium.launch({executablePath:edge,headless:true})
const page=await browser.newPage({viewport:{width:1280,height:900}})
const errors=[]
page.on('pageerror',error=>errors.push(error.message))

try {
  await page.goto(`${base}/wp-admin/admin.php?page=spp-content`,{waitUntil:'networkidle'})
  await page.getByRole('link',{name:'Site settings',exact:true}).click()
  await page.locator('#spp_phone_display').fill('0499 111 222')
  await page.locator('#spp_phone_normalized').fill('0499111222')
  await page.locator('#spp_footer_intro').fill('Phase 4 API integration verified.')
  await page.locator('#spp_service_areas').fill('API Test Suburb\nChadstone\nGlen Waverley')
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.locator('#publish').click({force:true}),
  ])

  await page.goto(`${base}/wp-admin/themes.php?page=spp-setup`,{waitUntil:'networkidle'})
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('button',{name:'Create starter content'}).click(),
  ])

  const api=await page.evaluate(async baseUrl=>{
    const [bootstrap,services,residential]=await Promise.all([
      fetch(`${baseUrl}/wp-json/spp/v1/bootstrap`),
      fetch(`${baseUrl}/wp-json/spp/v1/services`),
      fetch(`${baseUrl}/wp-json/spp/v1/routes/services/residential-painting-melbourne`),
    ])
    return {
      status:bootstrap.status,
      payload:await bootstrap.json(),
      services:(await services.json()).data,
      residential:(await residential.json()).data,
    }
  },base)

  await page.goto(`${base}/#/`,{waitUntil:'networkidle'})
  await page.locator('#root .nav-shell').waitFor()
  await page.goto(`${base}/#/services/residential-painting-melbourne`,{waitUntil:'networkidle'})
  await page.locator('h1').first().waitFor()
  const publicServiceTitle=(await page.locator('h1').first().innerText()).replace(/\s+/g,' ').trim()
  await page.goto(`${base}/?spp_preview=${api.residential.id}#/services/residential-painting-melbourne`,{waitUntil:'networkidle'})
  await page.locator('h1').first().waitFor()
  const result={
    apiStatus:api.status,
    schemaVersion:api.payload?.schema_version,
    phone:api.payload?.data?.business?.phone_display,
    navbarPhone:(await page.locator('.nav-actions a').first().innerText()).trim(),
    footerIntro:(await page.locator('footer .footer-grid > div').first().locator('p').innerText()).trim(),
    serviceAreas:await page.locator('.suburb-cloud .chip, .inner-suburbs span').allInnerTexts(),
    serviceCount:api.services.length,
    apiServiceTitle:api.residential.hero.title,
    reactServiceTitle:publicServiceTitle,
    previewTitle:(await page.locator('h1').first().innerText()).replace(/\s+/g,' ').trim(),
    previewState:await page.locator('.content-status').getAttribute('data-content-state'),
    sourceState:await page.locator('.content-status').getAttribute('data-content-state'),
    errors,
  }
  console.log(JSON.stringify(result,null,2))
  if(
    result.apiStatus!==200||
    result.schemaVersion!=='1.0.0'||
    result.phone!=='0499 111 222'||
    !result.navbarPhone.includes('0499 111 222')||
    result.footerIntro!=='Phase 4 API integration verified.'||
    !result.serviceAreas.includes('API Test Suburb')||
    result.serviceCount!==9||
    result.apiServiceTitle!=='Residential Painting'||
    !result.reactServiceTitle.includes('Residential Painting')||
    !result.previewTitle.includes('Residential Painting')||
    result.previewState!=='ready'||
    result.sourceState!=='ready'||
    errors.length
  ) process.exitCode=1
} finally {
  await browser.close()
}
