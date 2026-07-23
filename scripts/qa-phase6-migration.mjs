import { chromium } from 'playwright-core'

const baseUrl=(process.env.SPP_WP_URL||'http://127.0.0.1:9480').replace(/\/$/,'')
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const browser=await chromium.launch({executablePath:edge,headless:true})
const page=await browser.newPage({viewport:{width:1280,height:900}})
const failures=[]
const check=(condition,message)=>{if(!condition)failures.push(message)}

async function runMigration(){
  await page.goto(`${baseUrl}/wp-admin/admin.php?page=spp-content-migration`,{waitUntil:'domcontentloaded',timeout:60000})
  await Promise.all([
    page.waitForURL(/migrated=1/,{timeout:180000}),
    page.getByRole('button',{name:'Import or safely refresh approved content'}).click(),
  ])
  const report=JSON.parse(await page.locator('pre').innerText())
  check(report.complete===true,'migration report is not complete')
  check(JSON.stringify(report.expected)===JSON.stringify(report.actual),'migration counts do not match')
  return report
}

try{
  await page.goto(`${baseUrl}/`,{waitUntil:'domcontentloaded',timeout:60000})
  await runMigration()

  const first=await page.evaluate(async()=>Promise.all(
    ['services','faqs','testimonials','projects'].map(async name=>{
      const response=await fetch(`/wp-json/spp/v1/${name}`)
      return [name,(await response.json()).data.length]
    })
  ))
  const counts=Object.fromEntries(first)
  check(counts.services===9,'expected 9 services')
  check(counts.faqs===10,'expected 10 FAQs')
  check(counts.testimonials===4,'expected 4 testimonials')
  check(counts.projects===9,'expected 9 projects')

  await runMigration()
  const second=await page.evaluate(async()=>Promise.all(
    ['services','faqs','testimonials','projects'].map(async name=>{
      const response=await fetch(`/wp-json/spp/v1/${name}`)
      return [name,(await response.json()).data.length]
    })
  ))
  check(JSON.stringify(first)===JSON.stringify(second),'rerun created duplicate records')

  await page.goto(`${baseUrl}/wp-admin/edit.php?post_type=spp_site_config`,{waitUntil:'domcontentloaded'})
  await page.getByRole('link',{name:'Superior Plus Site Settings'}).first().click()
  await page.locator('#spp_business_name').fill('Client Protected Business Name')
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.locator('#publish').click(),
  ])
  await runMigration()
  const protectedName=await page.evaluate(async()=>{
    const response=await fetch('/wp-json/spp/v1/bootstrap')
    return (await response.json()).data.business.name
  })
  check(protectedName==='Client Protected Business Name','migration overwrote a client edit')

  const service=await page.evaluate(async()=>{
    const response=await fetch('/wp-json/spp/v1/services/exterior-painting-melbourne')
    return (await response.json()).data
  })
  check(service.gallery.length===12,'exterior gallery should contain 9 images and 3 videos')
  check(service.gallery.filter(item=>item.type==='video').length===3,'exterior videos were not preserved')
  check(service.gallery.every(item=>item.media?.url),'gallery contains unresolved media')
}finally{
  await browser.close()
}

console.log(JSON.stringify({checks:12,failures},null,2))
if(failures.length)process.exit(1)
