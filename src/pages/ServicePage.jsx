import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, PaintRoller } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA } from '../components/PageLayout'
import { serviceList, servicePages } from '../data/siteData'
import { Reveal, Divider } from '../App'
import ProjectGallery from '../components/ProjectGallery'
import { serviceMediaCategory } from '../data/projectMedia'
import NotFoundPage from './NotFoundPage'
import { mediaUrl, mergeContent, textItems, useRouteContent, useSiteContent } from '../content/ContentProvider'

export default function ServicePage() {
  const { slug } = useParams()
  const fallbackPage = servicePages[slug]
  const {services}=useSiteContent()
  const {data:route,status}=useRouteContent(`/services/${slug}`)
  const cms=route?.content
  const page=cms?mergeContent(fallbackPage||{},{
    eyebrow:cms.hero?.eyebrow,
    title:cms.hero?.title||cms.title,
    accent:cms.hero?.accent,
    intro:cms.hero?.intro,
    image:mediaUrl(cms.hero?.image),
    imageAlt:cms.hero?.image?.alt,
    scopeTitle:cms.scope_title,
    scope:textItems(cms.scope),
    process:textItems(cms.process),
    why:cms.why,
    benefits:textItems(cms.benefits),
    related:cms.related,
    gallery:cms.gallery,
  }):fallbackPage
  const navigate = useNavigate()
  if (!page && status==='loading') return <PageLayout title="Loading service" description="Loading the latest service information." pageType="Service"><section className="inner-section"><div className="container"><p>Loading the latest service information…</p></div></section></PageLayout>
  if (!page) return <NotFoundPage/>
  const related = (page.related||[]).map(item => typeof item==='string'?services.find(s=>s.slug===item):item).filter(Boolean)
  const seo=route?.seo
  const cta=route?.closing_cta
  const image=page.image||fallbackPage?.image
  return <PageLayout title={seo?.title||`${page.title} Melbourne`} description={seo?.description||page.intro} pageType="Service" image={mediaUrl(seo?.social_image,image)}>
    <PageHero {...page} image={image} imageAlt={page.imageAlt||(image?.includes('/client/')?`${page.title} project completed by Superior Plus Painting`:`${page.title} service placeholder`)}/>
    <TrustStrip/>

    <section className="inner-section scope-section"><div className="container">
      <SectionIntro eyebrow="What we can help with" title={page.scopeTitle} accent="covered with care." text="Every quote is tailored to the property, surface condition and finish you want to achieve."/>
      <div className="scope-grid">{page.scope.map((item,i)=><Reveal key={item} delay={(i%5)*.04}><div className={`scope-item scope-${page.tone}`}><span>{String(i+1).padStart(2,'0')}</span><Check/><b>{item}</b></div></Reveal>)}</div>
    </div><Divider color="#fbf6ec" variant="slash"/></section>

    <section className="inner-section process-section"><div className="container">
      <SectionIntro eyebrow="How it comes together" title="A considered process." accent="A lasting finish." text={page.why}/>
      <div className="service-process">{page.process.map((item,i)=><Reveal key={item} delay={i*.06}><article><b>{String(i+1).padStart(2,'0')}</b><span>{item}</span>{i<page.process.length-1&&<i/>}</article></Reveal>)}</div>
    </div></section>

    <ProjectGallery category={serviceMediaCategory[slug]} items={page.gallery}/>

    <section className={`benefit-section benefit-${page.tone}`}><div className="container benefit-grid"><Reveal><PaintRoller/><h2>Why this work<br/><em>makes a difference.</em></h2></Reveal><div className="benefit-list">{page.benefits.map((item,i)=><Reveal key={item} delay={i*.06}><div><span>0{i+1}</span><h3>{item}</h3></div></Reveal>)}</div></div><Divider color="#fff" variant="drip"/></section>

    <section className="inner-section related-section"><div className="container"><SectionIntro eyebrow="Keep exploring" title="Related services" accent="for the whole property."/><div className="related-grid">{related.map(service=><button key={service.slug} className={`related-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>

    <TestimonialBand index={Math.max(0,services.findIndex(item=>item.slug===slug))}/>
    <AreasBand/>
    <ClosingCTA title={cta?.title||`Planning ${page.title.toLowerCase()}?`} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}
