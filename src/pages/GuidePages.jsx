import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Check, Clock, PaintRoller } from 'lucide-react'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { paintingGuideBySlug, paintingGuides } from '../data/paintingGuides'
import { serviceList } from '../data/siteData'
import { mediaUrl, pairItems, useRouteContent } from '../content/ContentProvider'
import NotFoundPage from './NotFoundPage'

function GuideCard({guide,index}) {
  const navigate=useNavigate()
  return <Reveal delay={(index%3)*.05}><article className="guide-card">
    <button className="guide-card-image" onClick={()=>navigate(`/painting-guides/${guide.slug}`)} aria-label={`Read ${guide.title}`}>
      <img src={guide.image} alt={guide.imageAlt} loading="lazy" decoding="async"/>
      <span><Clock/>{guide.readTime}</span>
    </button>
    <div><small>{guide.eyebrow}</small><h3>{guide.title}</h3><p>{guide.excerpt}</p><button className="guide-link" onClick={()=>navigate(`/painting-guides/${guide.slug}`)}>Read the guide <ArrowRight/></button></div>
  </article></Reveal>
}

export function PaintingGuidesPage() {
  const {data:route}=useRouteContent('/painting-guides')
  const image=mediaUrl(route?.hero?.image,paintingGuides[0].image)
  const seo=route?.seo
  return <PageLayout title={seo?.title||'Painting Guides for Melbourne Property Owners'} description={seo?.description||'Practical guidance about repainting, preparation, interior and exterior paint systems, and choosing professional painters in Melbourne.'} image={mediaUrl(seo?.social_image,image)} pageType="CollectionPage" schemaData={{mainEntity:paintingGuides.map(guide=>({'@type':'Article',headline:guide.title,url:`/painting-guides/${guide.slug}`}))}}>
    <PageHero eyebrow={route?.hero?.eyebrow||'Advice from the preparation stage'} title={route?.hero?.title||'Practical painting guides'} accent={route?.hero?.accent||'for better project decisions.'} intro={route?.hero?.intro||'Clear, useful information for Melbourne homeowners, property managers and businesses planning a repaint, repair or property refresh.'} image={image} imageAlt={route?.hero?.image?.alt||paintingGuides[0].imageAlt} tone="gold"/>
    <TrustStrip/>
    <section className="inner-section guide-directory"><div className="container"><SectionIntro eyebrow="Superior Plus knowledge hub" title="Understand the work" accent="before the quote." text="These approved guides explain common painting timelines, product differences, preparation and the standards to expect from a professional team."/><div className="guide-grid">{paintingGuides.map((guide,index)=><GuideCard guide={guide} index={index} key={guide.slug}/>)}</div></div></section>
    <section className="guide-help-band"><div className="container"><Reveal><BookOpen/><span>Need advice for your property?</span><h2>Every surface tells us<br/><em>what it needs next.</em></h2></Reveal><Reveal delay={.1}><p>A guide can help you plan, but the final system should be based on an inspection of the existing coating, substrate, access and exposure.</p></Reveal></div><Divider color="#fff" variant="drip"/></section>
    <ClosingCTA title="Ready to discuss your painting project?" text="Tell us about the property, the surfaces involved and what you would like to change. We’ll arrange a free, no-obligation quotation."/>
  </PageLayout>
}

export function PaintingGuidePage() {
  const {slug}=useParams()
  const navigate=useNavigate()
  const fallback=paintingGuideBySlug[slug]
  const {data:route}=useRouteContent(`/painting-guides/${slug}`)
  if(!fallback)return <NotFoundPage/>
  const cmsSections=pairItems(route?.content?.fields?.content_sections,[])
  const sections=cmsSections.length?cmsSections.map(([title,body])=>[title,[body.replace(/<[^>]*>/g,'')]]):fallback.sections
  const heroImage=mediaUrl(route?.hero?.image,fallback.image)
  const related=fallback.relatedServices.map(serviceSlug=>serviceList.find(service=>service.slug===serviceSlug)).filter(Boolean)
  const seo=route?.seo
  return <PageLayout title={seo?.title||fallback.title} description={seo?.description||fallback.excerpt} image={mediaUrl(seo?.social_image,heroImage)} pageType="Article" schemaData={{headline:fallback.title,datePublished:fallback.published,dateModified:fallback.published,author:{'@type':'Organization',name:'Superior Plus Painting & Remodeling'},about:'Professional painting in Melbourne'}}>
    <PageHero eyebrow={route?.hero?.eyebrow||fallback.eyebrow} title={route?.hero?.title||fallback.title} accent={route?.hero?.accent||'A practical Melbourne guide.'} intro={route?.hero?.intro||fallback.excerpt} image={heroImage} imageAlt={route?.hero?.image?.alt||fallback.imageAlt} tone="green"/>
    <TrustStrip/>
    <article className="guide-article"><div className="container guide-article-layout">
      <aside><div><BookOpen/><small>Superior Plus guide</small><strong>{fallback.readTime}</strong></div><nav aria-label="On this page">{sections.map(([title],index)=><a href={`#guide-section-${index+1}`} key={title}><span>{String(index+1).padStart(2,'0')}</span>{title}</a>)}</nav></aside>
      <div className="guide-article-body">
        {sections.map(([title,paragraphs],index)=><section id={`guide-section-${index+1}`} key={title}><span>{String(index+1).padStart(2,'0')}</span><h2>{title}</h2>{paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>)}
        <section className="guide-takeaways"><PaintRoller/><h2>Key takeaways</h2>{fallback.takeaways.map(item=><p key={item}><Check/>{item}</p>)}</section>
      </div>
    </div></article>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="Relevant services" title="Turn the advice" accent="into a clear project plan."/><div className="related-grid">{related.map(service=><button className={`related-card tone-${service.tone}`} key={service.slug} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus service</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>
    <ClosingCTA title="Would you like advice for your property?" text="Arrange a free consultation and written quote based on the actual surfaces, preparation and finish your project needs."/>
  </PageLayout>
}
