import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { paintingGuides } from '../src/data/paintingGuides.js'

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const destination=resolve(root,'wordpress-plugin/superior-plus-content/data/blog-articles.json')

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
const blocksToHtml=blocks=>(blocks||[]).map(block=>{
  if(typeof block==='string')return `<p>${escape(block)}</p>`
  const heading=block.heading?`<h3>${escape(block.heading)}</h3>`:''
  const paragraphs=(block.paragraphs||[]).map(value=>`<p>${escape(value)}</p>`).join('')
  const items=block.items?.length?`<ul>${block.items.map(value=>`<li>${escape(value)}</li>`).join('')}</ul>`:''
  return `${heading}${paragraphs}${items}`
}).join('\n')

const payload=paintingGuides.map(guide=>({
  slug:guide.slug,
  title:guide.title,
  excerpt:guide.excerpt,
  content:(guide.sections||[]).map(([title,blocks])=>`<h2>${escape(title)}</h2>\n${blocksToHtml(blocks)}`).join('\n'),
  eyebrow:guide.eyebrow,
  category:guide.category,
  read_time:guide.readTime,
  source_label:guide.sourceLabel,
  published:guide.published,
  image_asset:String(guide.image).match(/client\/.+$/)?.[0]||'',
  image_alt:guide.imageAlt,
  takeaways:guide.takeaways||[],
  references:guide.references||[],
  related_services:guide.relatedServices||[],
  seo_keywords:guide.seoKeywords||[],
}))

await mkdir(dirname(destination),{recursive:true})
await writeFile(destination,`${JSON.stringify(payload,null,2)}\n`,'utf8')
console.log(`Generated ${payload.length} WordPress blog article seeds.`)
