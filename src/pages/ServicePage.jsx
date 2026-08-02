import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Brush, Check, Hammer, PaintRoller, Palette, SprayCan } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA } from '../components/PageLayout'
import { serviceList, servicePages } from '../data/siteData'
import { Reveal, Divider } from '../App'
import ProjectGallery from '../components/ProjectGallery'
import { serviceMediaCategory } from '../data/projectMedia'
import NotFoundPage from './NotFoundPage'
import { mediaUrl, mergeContent, pairItems, textItems, useRouteContent, useSiteContent } from '../content/ContentProvider'
import approvedContent from '../data/clientApprovedContent.json'
import { asset } from '../utils/assets'

const scopeIcons=[PaintRoller,Brush,Palette,SprayCan,Hammer]
const serviceAreaImage=asset('client/projects/exterior/exterior-07.webp')
const serviceStoryImages={
  'residential-painting-melbourne':['client/projects/new-batch/batch-159.webp','client/projects/new-batch/batch-102.webp'],
  'commercial-painting-melbourne':['client/projects/commercial/commercial-12.webp','client/projects/new-batch/batch-100.webp'],
  'interior-painting-melbourne':['client/projects/new-batch/batch-157.webp','client/projects/new-batch/batch-155.webp'],
  'exterior-painting-melbourne':['client/projects/new-batch/batch-158.webp','client/projects/new-batch/batch-154.webp'],
  'roof-painting-melbourne':['client/projects/roof/roof-commercial-coating.webp','client/projects/roof/roof-before-after.webp'],
  'fence-painting-melbourne':['client/projects/fence/fence-03.webp','client/projects/fence/fence-05.webp'],
  'deck-painting-staining-melbourne':['client/projects/new-batch/batch-163.webp','client/projects/new-batch/batch-152.webp'],
  'wallpaper-removal-melbourne':['client/projects/wallpaper/wallpaper-06.webp','client/projects/wallpaper/wallpaper-12.webp'],
  'plaster-repairs-melbourne':['client/projects/plaster/plaster-13.webp','client/projects/plaster/plaster-06.webp'],
}
const serviceHeadlines={
  'residential-painting-melbourne':['Residential Painting','Residential painting services'],
  'commercial-painting-melbourne':['Commercial Painting','Commercial painting services'],
  'interior-painting-melbourne':['Interior Painting','Interior painting services'],
  'exterior-painting-melbourne':['Exterior Painting','Exterior painting services'],
  'roof-painting-melbourne':['Roof Painting','Roof painting services'],
  'fence-painting-melbourne':['Fence Painting','Fence painting services'],
  'deck-painting-staining-melbourne':['Deck Painting & Staining','Deck painting and staining services'],
  'wallpaper-removal-melbourne':['Wallpaper Removal','Wallpaper removal services'],
  'plaster-repairs-melbourne':['Plaster Repairs','Plaster repair services'],
}

export default function ServicePage() {
  const { slug } = useParams()
  const fallbackPage = servicePages[slug]
  const {services}=useSiteContent()
  const {data:route,status}=useRouteContent(`/services/${slug}`)
  const cms=route?.content
  const approved=approvedContent.services[slug]
  const itemSection=approved?.sections.find(section=>section.items?.length)
  const stepSection=approved?.sections.find(section=>section.steps?.length)
  const ctaSection=approved?.sections.at(-1)
  const approvedNarrative=approved?.sections.filter(section=>section!==itemSection&&section!==stepSection&&section!==ctaSection)||[]
  const approvedPage=approved?mergeContent(fallbackPage||{}, {
    eyebrow:approved.document_title,
    title:approved.headline,
    accent:'',
    intro:approved.intro,
    scopeTitle:itemSection?.heading,
    scope:itemSection?.items||[],
    process:stepSection?.steps||[],
  }):fallbackPage
  const page=cms?.copy_version==='pdf-verbatim-2026-08-01'?mergeContent(approvedPage||{},{
    eyebrow:cms.hero?.eyebrow,
    title:cms.hero?.title||cms.title,
    accent:cms.hero?.accent,
    intro:cms.hero?.intro,
    image:mediaUrl(cms.hero?.image),
    imageAlt:cms.hero?.image?.alt,
    imagePosition:cms.hero?.image?.object_position,
    scopeTitle:cms.scope_title,
    scope:textItems(cms.scope),
    process:textItems(cms.process),
    why:cms.why,
    benefits:textItems(cms.benefits),
    related:cms.related,
    gallery:cms.gallery,
    sectionLabels:cms.section_labels,
  }):approvedPage
  const narrative=cms?.copy_version==='pdf-verbatim-2026-08-01'&&cms.document_sections?.length
    ?pairItems(cms.document_sections).map(([heading,text])=>({heading,paragraphs:[text]}))
    :approvedNarrative
  const whySection=narrative.find(section=>/^(Why Choose|Why Businesses)/i.test(section.heading))
  const benefitSection=narrative.find(section=>/^Benefits of/i.test(section.heading))
  const areasSection=narrative.find(section=>section.heading==='Areas We Service')
  const storySections=narrative.filter(section=>section!==whySection&&section!==benefitSection&&section!==areasSection)
  const storyImages=(serviceStoryImages[slug]||[]).map(asset)
  const sectionText=section=>(section?.paragraphs||[]).join(' ')
  const navigate = useNavigate()
  if (!page && status==='loading') return <PageLayout title="Loading service" description="Loading the latest service information." pageType="Service"><section className="inner-section"><div className="container"><p>Loading the latest service information…</p></div></section></PageLayout>
  if (!page) return <NotFoundPage/>
  const related = (page.related||[]).map(item => typeof item==='string'?services.find(s=>s.slug===item):item).filter(Boolean)
  const seo=route?.seo
  const cta=route?.closing_cta
  const image=page.image||fallbackPage?.image
  const labels=page.sectionLabels||{}
  const headlineRule=serviceHeadlines[slug]
  const heroTitle=approved?.headline||(headlineRule&&page.title?.trim().toLowerCase()===headlineRule[0].toLowerCase()?headlineRule[1]:page.title)
  return <PageLayout title={seo?.title||`${page.title} Melbourne`} description={seo?.description||page.intro} pageType="Service" image={mediaUrl(seo?.social_image,image)}>
    <PageHero {...page} title={heroTitle} image={image} imagePosition={page.imagePosition||fallbackPage?.imagePosition} imageAlt={page.imageAlt||(image?.includes('/client/')?`${page.title} project completed by Superior Plus Painting`:`${page.title} service placeholder`)}/>
    <TrustStrip/>

    <section className="inner-section scope-section"><div className="container">
      <SectionIntro eyebrow={labels.scope_eyebrow||"What we can help with"} title={page.scopeTitle} accent={labels.scope_accent||"covered with care."} text={labels.scope_intro||"Every approved service inclusion is presented clearly below, with the final scope tailored to the property and existing surface condition."}/>
      <div className="scope-grid">{page.scope.map((item,i)=>{const Icon=scopeIcons[i%scopeIcons.length];return <Reveal key={item} delay={(i%5)*.04}><div className={`scope-item scope-${page.tone}`}><small>{String(i+1).padStart(2,'0')}</small><span className="scope-icon"><Icon/></span><b>{item}</b></div></Reveal>})}</div>
    </div><Divider color="#fbf6ec" variant="slash"/></section>

    <section className="inner-section process-section"><div className="container">
      <SectionIntro eyebrow={labels.process_eyebrow||"How it comes together"} title={stepSection?.heading||labels.process_title||"Our Process"} accent={labels.process_accent||"A lasting finish."} text={labels.process_intro||"A clear, practical sequence keeps preparation, application, communication and the final inspection organised from start to finish."}/>
      <div className="service-process">{page.process.map((item,i)=><Reveal key={item} delay={i*.06}><article><b>{String(i+1).padStart(2,'0')}</b><span>{item}</span>{i<page.process.length-1&&<i/>}</article></Reveal>)}</div>
    </div></section>

    <ProjectGallery category={serviceMediaCategory[slug]} items={page.gallery} heading={whySection?{eyebrow:"Why Superior Plus",title:whySection.heading,accent:"Proven through our work.",text:sectionText(whySection)}:undefined}/>

    {storySections.map((section,index)=><section className={`inner-section service-approved-story ${index%2?'cream':''}`} key={section.heading}><div className="container service-story-grid"><Reveal className="service-story-photo"><img src={storyImages[index%storyImages.length]||image} alt={`${section.heading} for ${page.title}`} loading="lazy" decoding="async"/><span>Superior Plus project</span></Reveal><Reveal className="service-story-copy" delay={.1}><span className="service-story-icon">{index%2?<Palette/>:<PaintRoller/>}</span><SectionIntro eyebrow="Approved service information" title={section.heading} accent=""/>{section.paragraphs?.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</Reveal></div></section>)}

    <section className={`benefit-section benefit-${page.tone}`}><div className="container benefit-grid"><Reveal><PaintRoller/><h2>{benefitSection?.heading||labels.benefits_title||"Why this work"}<br/><em>{labels.benefits_accent||"makes a difference."}</em></h2><p className="benefit-intro">{sectionText(benefitSection)||"Careful preparation and a coating system suited to the surface help deliver a cleaner, stronger and longer-lasting result."}</p></Reveal><div className="benefit-list">{(page.benefits||[]).map((item,i)=><Reveal key={item} delay={i*.06}><div><span>0{i+1}</span><h3>{item}</h3></div></Reveal>)}</div></div><Divider color="#fff" variant="drip"/></section>

    {areasSection&&<section className="inner-section service-local-approved"><div className="container service-local-card"><Reveal><span className="service-story-icon"><Check/></span><SectionIntro eyebrow="Melbourne service coverage" title={areasSection.heading} accent=""/><p>{sectionText(areasSection)}</p></Reveal><Reveal className="service-local-photo" delay={.1}><img src={serviceAreaImage} alt="Completed Superior Plus Painting exterior project in Melbourne" loading="lazy" decoding="async"/><span>Painting across Melbourne</span></Reveal></div></section>}

    <section className="inner-section related-section"><div className="container"><SectionIntro eyebrow={labels.related_eyebrow||"Keep exploring"} title={labels.related_title||"Related services"} accent={labels.related_accent||"for the whole property."}/><div className="related-grid">{related.map(service=><button key={service.slug} className={`related-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>

    <TestimonialBand index={Math.max(0,services.findIndex(item=>item.slug===slug))}/>
    <AreasBand seed={slug}/>
    <ClosingCTA title={ctaSection?.heading||cta?.title||`Planning ${page.title.toLowerCase()}?`} text={ctaSection?.paragraphs?.join(' ')||cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}
