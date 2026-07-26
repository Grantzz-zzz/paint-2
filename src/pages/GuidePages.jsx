import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Clock, PaintRoller } from 'lucide-react'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { paintingGuideBySlug, paintingGuides } from '../data/paintingGuides'
import { serviceList } from '../data/siteData'
import { mediaUrl, useCollection, useRouteContent } from '../content/ContentProvider'
import NotFoundPage from './NotFoundPage'

const emptyArticles=[]

function normalizeArticle(article) {
  const fallback=paintingGuideBySlug[article.slug]
  return {
    ...fallback,
    ...article,
    image:mediaUrl(article.hero?.image,article.image||fallback?.image),
    imageAlt:article.hero?.image?.alt||article.imageAlt||fallback?.imageAlt||`${article.title} by Superior Plus Painting`,
    readTime:article.read_time||article.readTime||fallback?.readTime||'Practical guide',
    sourceLabel:article.source_label||article.sourceLabel||fallback?.sourceLabel||'Superior Plus guide',
  }
}

function GuideCard({guide,index}) {
  const navigate=useNavigate()
  return <Reveal className={`guide-card-reveal ${index===0?'blog-featured-wrap':''}`} delay={(index%3)*.05}><article className={`guide-card ${index===0?'blog-featured-card':''}`}>
    <button className="guide-card-image" onClick={()=>navigate(`/blog/${guide.slug}`)} aria-label={`Read ${guide.title}`}>
      <img src={guide.image} alt={guide.imageAlt} loading="lazy" decoding="async"/>
      <span><Clock/>{guide.readTime}</span>
    </button>
    <div><small>{guide.category} · {guide.sourceLabel}</small><h3>{guide.title}</h3><p>{guide.excerpt}</p><button className="guide-link" onClick={()=>navigate(`/blog/${guide.slug}`)}>Read article <ArrowRight/></button></div>
  </article></Reveal>
}

export function PaintingGuidesPage() {
  const {data:route}=useRouteContent('/painting-guides')
  const {data:cmsArticles}=useCollection('articles',emptyArticles)
  const articles=useMemo(()=>{
    const cms=(cmsArticles||[]).map(normalizeArticle)
    const cmsSlugs=new Set(cms.map(item=>item.slug))
    return [...cms,...paintingGuides.filter(item=>!cmsSlugs.has(item.slug))]
  },[cmsArticles])
  const image=mediaUrl(route?.hero?.image,articles[0]?.image)
  return <PageLayout mainClassName="blog-main" title={route?.seo?.title||'Painting Blog for Melbourne Property Owners'} description={route?.seo?.description||'Melbourne painting articles about preparation, colour, interiors, exteriors, roofs, commercial projects and choosing a professional painter.'} image={mediaUrl(route?.seo?.social_image,image)} pageType="Blog" schemaData={{blogPost:articles.map(guide=>({'@type':'BlogPosting',headline:guide.title,url:`/blog/${guide.slug}`,datePublished:guide.published}))}}>
    <PageHero eyebrow={route?.hero?.eyebrow||'Superior Plus Painting blog'} title={route?.hero?.title||'Practical painting advice'} accent={route?.hero?.accent||'for Melbourne properties.'} intro={route?.hero?.intro||'Explore client-approved articles for homeowners, property managers and businesses planning a repaint, repair or property refresh.'} image={image} imageAlt={route?.hero?.image?.alt||articles[0]?.imageAlt} tone="gold"/>
    <TrustStrip/>
    <section className="inner-section guide-directory"><div className="container"><SectionIntro eyebrow={`${articles.length} practical articles`} title="Select a topic" accent="and plan with confidence." text="Choose a guide below. New articles added in WordPress automatically use this same approved layout."/><div className="guide-grid blog-grid">{articles.map((guide,index)=><GuideCard guide={guide} index={index} key={guide.slug}/>)}</div></div></section>
    <section className="guide-help-band"><div className="container"><Reveal><BookOpen/><span>Advice for your property</span><h2>Useful information,<br/><em>grounded in real work.</em></h2></Reveal><Reveal delay={.1}><p>These articles help you understand the process, but the right coating system still depends on the existing surface, exposure, access and preparation identified during an inspection.</p></Reveal></div><Divider color="#fff" variant="drip"/></section>
    <ClosingCTA title="Ready to discuss your painting project?" text="Tell us about the property, the surfaces involved and what you would like to change. We’ll arrange a free, no-obligation quotation."/>
  </PageLayout>
}

function ArticleBlock({block}) {
  if(typeof block==='string')return <p>{block}</p>
  return <div className="blog-article-block">
    {block.heading&&<h3>{block.heading}</h3>}
    {block.paragraphs?.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
    {block.items?.length>0&&<ul>{block.items.map(item=><li key={item}><Check/>{item}</li>)}</ul>}
  </div>
}

function prepareCmsBody(body='') {
  const headings=[]
  let index=0
  const html=String(body).replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi,(match,attributes,label)=>{
    index+=1
    const text=label.replace(/<[^>]+>/g,'').trim()
    headings.push(text)
    return `<h2${attributes} id="guide-section-${index}">${label}</h2>`
  })
  return {html,headings}
}

export function PaintingGuidePage() {
  const {slug}=useParams()
  const navigate=useNavigate()
  const fallback=paintingGuideBySlug[slug]
  const {data:route,status}=useRouteContent(`/blog/${slug}`)
  const {data:cmsArticles}=useCollection('articles',emptyArticles)
  const cms=route?.template_key==='article'?route.content:null
  const article=cms?normalizeArticle(cms):fallback
  const prepared=useMemo(()=>prepareCmsBody(cms?.body),[cms?.body])
  const allArticles=useMemo(()=>{
    const normalized=(cmsArticles||[]).map(normalizeArticle)
    const slugs=new Set(normalized.map(item=>item.slug))
    return [...normalized,...paintingGuides.filter(item=>!slugs.has(item.slug))]
  },[cmsArticles])
  if(!article&&status==='loading')return <PageLayout title="Loading article" description="Loading the latest article."><section className="inner-section"><div className="container"><p>Loading article…</p></div></section></PageLayout>
  if(!article)return <NotFoundPage/>
  const sections=cms?prepared.headings:(article.sections||[]).map(([title])=>title)
  const heroImage=mediaUrl(cms?.hero?.image,article.image)
  const related=cms?.related_services?.length?cms.related_services:(article.relatedServices||[]).map(serviceSlug=>serviceList.find(service=>service.slug===serviceSlug)).filter(Boolean)
  const currentIndex=Math.max(0,allArticles.findIndex(guide=>guide.slug===slug))
  const moreArticles=Array.from({length:Math.min(6,Math.max(0,allArticles.length-1))},(_,offset)=>allArticles[(currentIndex+offset+1)%allArticles.length])
  const scrollToSection=index=>document.getElementById(`guide-section-${index+1}`)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})
  const takeaways=cms?.takeaways||article.takeaways||[]
  const references=cms?.references||article.references||[]
  return <PageLayout mainClassName="blog-main blog-article-main" title={route?.seo?.title||article.title} description={route?.seo?.description||article.excerpt} image={mediaUrl(route?.seo?.social_image,heroImage)} pageType="BlogPosting" schemaData={{headline:article.title,datePublished:article.published,dateModified:article.modified||article.published,author:{'@type':'Organization',name:'Superior Plus Painting & Remodeling'},publisher:{'@type':'Organization',name:'Superior Plus Painting & Remodeling'},about:'Professional painting in Melbourne'}}>
    <PageHero eyebrow={cms?.eyebrow||article.eyebrow} title={cms?.hero?.title||article.title} accent={cms?.hero?.accent||'A practical Melbourne article.'} intro={cms?.hero?.intro||article.excerpt} image={heroImage} imageAlt={cms?.hero?.image?.alt||article.imageAlt} tone="green"/>
    <TrustStrip/>
    <article className="guide-article"><div className="container guide-article-layout">
      <aside><div><BookOpen/><small>{cms?.source_label||article.sourceLabel}</small><strong>{cms?.read_time||article.readTime}</strong></div>{sections.length>0&&<nav aria-label="On this page">{sections.map((title,index)=><button type="button" onClick={()=>scrollToSection(index)} key={`${title}-${index}`}><span>{String(index+1).padStart(2,'0')}</span>{title}</button>)}</nav>}</aside>
      <div className="guide-article-body">
        {cms?<div className="cms-article-content" dangerouslySetInnerHTML={{__html:prepared.html}}/>:(article.sections||[]).map(([title,blocks],index)=><section id={`guide-section-${index+1}`} key={title}><span>{String(index+1).padStart(2,'0')}</span><h2>{title}</h2>{blocks.map((block,blockIndex)=><ArticleBlock block={block} key={typeof block==='string'?block:`${title}-${block.heading||blockIndex}`}/>)}</section>)}
        {references.length>0&&<section className="guide-references"><span>Sources</span><h2>Official references</h2><p>Product guidance and colour information can change. Review current manufacturer information for the selected system.</p><div>{references.map(reference=><a href={reference.url} target="_blank" rel="noopener noreferrer" key={reference.url}>{reference.label}<ArrowRight/></a>)}</div></section>}
        {takeaways.length>0&&<section className="guide-takeaways"><PaintRoller/><h2>Key takeaways</h2>{takeaways.map(item=><p key={item}><Check/>{item}</p>)}</section>}
      </div>
    </div></article>
    {moreArticles.length>0&&<section className="inner-section blog-more"><div className="container"><SectionIntro eyebrow="Continue reading" title="Choose another" accent="painting article." text="Keep exploring without returning to the main Blog page. Select any article below to open it directly."/><div className="guide-grid">{moreArticles.map((guide,index)=><GuideCard guide={guide} index={index+1} key={guide.slug}/>)}</div></div></section>}
    {related.length>0&&<section className="inner-section cream"><div className="container"><SectionIntro eyebrow="Relevant services" title="Turn the advice" accent="into a clear project plan."/><div className="related-grid">{related.map(service=><button className={`related-card tone-${service.tone||'green'}`} key={service.slug} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus service</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>}
    <ClosingCTA title={route?.closing_cta?.title||'Would you like advice for your property?'} text={route?.closing_cta?.text||'Arrange a free consultation and written quote based on the actual surfaces, preparation and finish your project needs.'} label={route?.closing_cta?.link?.label} url={route?.closing_cta?.link?.url}/>
  </PageLayout>
}
