import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Clock, PaintRoller } from 'lucide-react'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { paintingGuideBySlug, paintingGuides } from '../data/paintingGuides'
import { serviceList } from '../data/siteData'
import { mediaUrl, useRouteContent } from '../content/ContentProvider'
import NotFoundPage from './NotFoundPage'

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
  // Keep the established CMS record as the editable source while publishing
  // the customer-facing collection at the clearer /blog route.
  const {data:route}=useRouteContent('/painting-guides')
  const image=mediaUrl(route?.hero?.image,paintingGuides[0].image)
  return <PageLayout mainClassName="blog-main" title="Painting Blog for Melbourne Property Owners" description="Melbourne painting articles about preparation, colour, interiors, exteriors, roofs, commercial projects and choosing a professional painter." image={mediaUrl(route?.seo?.social_image,image)} pageType="Blog" schemaData={{blogPost:paintingGuides.map(guide=>({'@type':'BlogPosting',headline:guide.title,url:`/blog/${guide.slug}`,datePublished:guide.published,keywords:guide.seoKeywords?.join(', ')}))}}>
    <PageHero eyebrow="Superior Plus Painting blog" title="Practical painting advice" accent="for Melbourne properties." intro="Explore client-approved articles for homeowners, property managers and businesses planning a repaint, repair or property refresh." image={image} imageAlt={route?.hero?.image?.alt||paintingGuides[0].imageAlt} tone="gold"/>
    <TrustStrip/>
    <section className="inner-section guide-directory"><div className="container"><SectionIntro eyebrow={`${paintingGuides.length} practical articles`} title="Select a topic" accent="and plan with confidence." text="Every completed article and SEO topic supplied in the client’s website blog document has been developed into customer-ready guidance for Melbourne property owners, managers and businesses."/><div className="guide-grid blog-grid">{paintingGuides.map((guide,index)=><GuideCard guide={guide} index={index} key={guide.slug}/>)}</div></div></section>
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

export function PaintingGuidePage() {
  const {slug}=useParams()
  const navigate=useNavigate()
  const fallback=paintingGuideBySlug[slug]
  const {data:route}=useRouteContent(`/painting-guides/${slug}`)
  if(!fallback)return <NotFoundPage/>
  const sections=fallback.sections
  const heroImage=mediaUrl(route?.hero?.image,fallback.image)
  const related=fallback.relatedServices.map(serviceSlug=>serviceList.find(service=>service.slug===serviceSlug)).filter(Boolean)
  const currentIndex=paintingGuides.findIndex(guide=>guide.slug===slug)
  const moreArticles=Array.from({length:Math.min(6,paintingGuides.length-1)},(_,offset)=>paintingGuides[(currentIndex+offset+1)%paintingGuides.length])
  const scrollToSection=index=>{
    const target=document.getElementById(`guide-section-${index+1}`)
    if(target)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})
  }
  return <PageLayout mainClassName="blog-main blog-article-main" title={fallback.title} description={fallback.excerpt} image={mediaUrl(route?.seo?.social_image,heroImage)} pageType="BlogPosting" schemaData={{headline:fallback.title,datePublished:fallback.published,dateModified:fallback.published,keywords:fallback.seoKeywords?.join(', '),author:{'@type':'Organization',name:'Superior Plus Painting & Remodeling'},publisher:{'@type':'Organization',name:'Superior Plus Painting & Remodeling'},about:'Professional painting in Melbourne'}}>
    <PageHero eyebrow={fallback.eyebrow} title={fallback.title} accent="A practical Melbourne article." intro={fallback.excerpt} image={heroImage} imageAlt={route?.hero?.image?.alt||fallback.imageAlt} tone="green"/>
    <TrustStrip/>
    <article className="guide-article"><div className="container guide-article-layout">
      <aside><div><BookOpen/><small>{fallback.sourceLabel}</small><strong>{fallback.readTime}</strong></div><nav aria-label="On this page">{sections.map(([title],index)=><button type="button" onClick={()=>scrollToSection(index)} key={title}><span>{String(index+1).padStart(2,'0')}</span>{title}</button>)}</nav></aside>
      <div className="guide-article-body">
        {sections.map(([title,blocks],index)=><section id={`guide-section-${index+1}`} key={title}><span>{String(index+1).padStart(2,'0')}</span><h2>{title}</h2>{blocks.map((block,blockIndex)=><ArticleBlock block={block} key={typeof block==='string'?block:`${title}-${block.heading||blockIndex}`}/>)}</section>)}
        {fallback.references?.length>0&&<section className="guide-references"><span>Sources</span><h2>Official references</h2><p>Product guidance and colour information can change. Review the current manufacturer information for the system selected for your property.</p><div>{fallback.references.map(reference=><a href={reference.url} target="_blank" rel="noopener noreferrer" key={reference.url}>{reference.label}<ArrowRight/></a>)}</div></section>}
        <section className="guide-takeaways"><PaintRoller/><h2>Key takeaways</h2>{fallback.takeaways.map(item=><p key={item}><Check/>{item}</p>)}</section>
      </div>
    </div></article>
    <section className="inner-section blog-more"><div className="container"><SectionIntro eyebrow="Continue reading" title="Choose another" accent="painting article." text="Keep exploring without returning to the main Blog page. Select any article below to open it directly."/><div className="guide-grid">{moreArticles.map((guide,index)=><GuideCard guide={guide} index={index+1} key={guide.slug}/>)}</div></div></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="Relevant services" title="Turn the advice" accent="into a clear project plan."/><div className="related-grid">{related.map(service=><button className={`related-card tone-${service.tone}`} key={service.slug} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus service</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>
    <ClosingCTA title="Would you like advice for your property?" text="Arrange a free consultation and written quote based on the actual surfaces, preparation and finish your project needs."/>
  </PageLayout>
}
