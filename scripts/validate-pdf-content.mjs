import { readFile } from 'node:fs/promises'

const readJson=async path=>JSON.parse(await readFile(path,'utf8'))
const appManifest=await readJson('src/data/clientApprovedContent.json')
const pluginManifest=await readJson('wordpress-plugin/superior-plus-content/data/client-approved-content.json')
const blogs=await readJson('src/data/clientApprovedBlogs.json')
const pluginBlogs=await readJson('wordpress-plugin/superior-plus-content/data/blog-articles.json')
const failures=[]
const check=(condition,message)=>{if(!condition)failures.push(message)}

check(JSON.stringify(appManifest)===JSON.stringify(pluginManifest),'React and WordPress client-copy manifests differ')
check(JSON.stringify(blogs)===JSON.stringify(pluginBlogs),'React and WordPress blog manifests differ')
check(appManifest.policy.includes('verbatim'),'Manifest does not declare the verbatim-copy policy')

const serviceEntries=Object.entries(appManifest.services||{})
check(serviceEntries.length===9,`Expected 9 dedicated service PDFs, found ${serviceEntries.length}`)
for(const [slug,service] of serviceEntries){
  check(Boolean(service.document_title&&service.headline&&service.intro),`${slug}: title, headline or introduction is missing`)
  check(service.sections.some(section=>section.items?.length),`${slug}: supplied scope list is missing`)
  check(service.sections.some(section=>section.steps?.length),`${slug}: supplied process is missing`)
  check(service.sections.some(section=>section.heading==='Areas We Service'),`${slug}: exact Areas We Service section is missing`)
  check(service.sections.at(-1)?.heading.toLowerCase().includes('quote'),`${slug}: supplied quote section is not last`)
}

const documents=appManifest.documents||{}
for(const key of ['about','additional_services','process','faqs','contact','testimonials']){
  check(Boolean(documents[key]),`${key}: supplied document is missing from the manifest`)
}
check(documents.about?.sections?.length===6,'About PDF: expected 6 supplied sections')
check(documents.additional_services?.sections?.length===11,'Additional Services PDF: expected 11 supplied sections')
check(documents.process?.steps?.length===6,'Our Process PDF: expected 6 supplied steps')
check(documents.faqs?.items?.length===10,'FAQ PDF: expected 10 supplied questions')
check(documents.contact?.service_options?.length===12,'Contact PDF: expected 12 service options')
check(documents.contact?.property_options?.length===8,'Contact PDF: expected 8 property options')
check(documents.testimonials?.reviews?.length===4,'Testimonials PDF: expected 4 supplied testimonials in the archive')

check(blogs.length===19,'Website blogs PDF: expected 4 complete articles plus 15 expanded SEO briefs')
for(const [index,article] of blogs.entries()){
  check(article.copy_version==='pdf-verbatim-2026-08-01',`${article.slug}: approved-copy version is missing`)
  if(index<4){
    check(article.content.length>2500,`${article.slug}: complete supplied article is unexpectedly short`)
  }else{
    check(article.content.length>2200,`${article.slug}: expanded SEO-brief article is unexpectedly short`)
    check(article.seo_keywords?.length>0,`${article.slug}: original SEO keywords are missing`)
    check(article.outline_topics?.length>0,`${article.slug}: original outline topics are missing`)
    check(article.source_label==='Superior Plus Painting guide',`${article.slug}: public source label is not branded`)
  }
}

const activeFiles=[
  'src/pages/ServicePage.jsx','src/pages/ContentPages.jsx','src/pages/GuidePages.jsx',
  'wordpress-theme/superior-plus/front-page.php','wordpress-theme/superior-plus/page-services.php',
  'wordpress-theme/superior-plus/inc/default-content.php',
  'wordpress-plugin/superior-plus-content/includes/class-spp-content-migration.php',
]
const activeSource=(await Promise.all(activeFiles.map(file=>readFile(file,'utf8')))).join('\n')
check(!activeSource.includes('commercial-02.webp'),'Competitor-branded commercial-02.webp is still referenced by active code')
check(activeSource.includes('pdf-verbatim-2026-08-01'),'Approved-copy migration marker is missing')

console.log(`Client documents checked: ${serviceEntries.length+Object.keys(documents).length+1}`)
console.log(`Service pages checked: ${serviceEntries.length}`)
console.log(`Blog records checked: ${blogs.length}`)
if(failures.length){
  console.error(`Failures: ${failures.length}`)
  failures.forEach(failure=>console.error(`- ${failure}`))
  process.exitCode=1
}else{
  console.log('Result: PASS — approved wording, SEO keywords and expanded brief topics are synchronized')
}
