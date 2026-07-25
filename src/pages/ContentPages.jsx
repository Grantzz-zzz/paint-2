import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Award, BookOpen, Check, ChevronDown, ClipboardCheck, ExternalLink, Hammer, Mail, MapPin, PaintRoller, Palette, Phone, RotateCw, ShieldCheck, SprayCan, Trees } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA } from '../components/PageLayout'
import { Reveal, Divider } from '../App'
import { faqs, masterProcess, serviceList, servicePages, suburbs } from '../data/siteData'
import { brandTeamArchive } from '../data/projectMedia'
import { asset } from '../utils/assets'
import { collectionFallbacks, mediaUrl, mergeContent, pairItems, textItems, useCollection, useEnquirySubmission, useRouteContent, useSiteContent } from '../content/ContentProvider'

const images = {
  about: asset('client/projects/fence/fence-03.webp'),
  services: asset('client/projects/commercial/commercial-02.webp'),
  process: asset('client/projects/wallpaper/wallpaper-01.webp'),
  faq: asset('client/projects/interior/interior-04.webp'),
  contact: asset('client/projects/residential/residential-01.webp'),
}

function usePageContent(path,fallbackHero) {
  const {data:route}=useRouteContent(path)
  const fields=route?.content?.fields||{}
  const explicitHero=route?{
    eyebrow:fields.eyebrow,
    title:fields.hero_title,
    accent:fields.accent,
    intro:fields.hero_intro,
    image:fields.hero_image||route.hero?.image,
    imageAlt:fields.hero_image_alt||route.hero?.image?.alt,
  }:null
  const mergedHero=mergeContent(fallbackHero,explicitHero)
  return {
    route,
    fields,
    hero:{
      ...mergedHero,
      image:mediaUrl(route?.hero?.image,mergedHero.image),
      imageAlt:route?.hero?.image?.alt,
    },
    seo:route?.seo,
    cta:route?.closing_cta,
  }
}

function FlipFeatureGrid({items,className=''}) {
  const [flipped,setFlipped]=useState(-1)
  return <div className={`flip-feature-grid ${className}`}>{items.map((item,index)=>{
    const active=flipped===index
    return <Reveal key={item.title} delay={(index%4)*.05}><button type="button" className={`flip-feature ${active?'is-flipped':''}`} onClick={()=>setFlipped(active?-1:index)} aria-pressed={active} aria-label={`${active?'Show summary for':'Read more about'} ${item.title}`}><span className="flip-feature-inner"><span className="flip-feature-face flip-feature-front"><span className="flip-feature-photo"><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><i>{String(index+1).padStart(2,'0')}</i></span><span className="flip-feature-summary"><strong>{item.title}</strong><small>{item.brief}</small><em><RotateCw/> Tap to turn</em></span></span><span className="flip-feature-face flip-feature-back"><span>{String(index+1).padStart(2,'0')}</span><strong>{item.title}</strong><p>{item.detail}</p><em><RotateCw/> Back to image</em></span></span></button></Reveal>
  })}</div>
}

export function ServicesPage() {
  const navigate=useNavigate()
  const {services}=useSiteContent()
  const fallbackHero={eyebrow:'Everything under one careful eye',title:'Painting & property services',accent:'made beautifully simple.',intro:'From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place.',image:images.services,tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/services',fallbackHero)
  const fallbackExtras=[['Wallpaper removal','Adhesive removal and wall preparation for a smooth paint-ready finish.'],['Carpentry services','Suitable repairs or replacement for damaged trims, frames, weatherboards and timber details.'],['Caulking & gap sealing','Neat sealing around windows, doors, skirtings and suitable interior or exterior joints.'],['Tiling services','Tiling support for suitable residential and commercial improvement projects.'],['Timber restoration','Preparation and restoration for decks, fences, pergolas and weatherboards.'],['Surface preparation','Pressure washing, sanding, scraping, filling and priming.'],['Property maintenance','Ongoing support to keep residential and commercial properties in excellent condition.']]
  const extras=pairItems(fields.additional_services,fallbackExtras)
  const extraIcons=[SprayCan,Hammer,ShieldCheck,Palette,Trees,PaintRoller,ClipboardCheck]
  const servicePrinciples=[
    {title:'A complete, written scope',text:'We inspect the property, discuss the surfaces, colours and finish, then provide a detailed no-obligation quotation with preparation and pricing clearly explained.',image:asset('client/projects/residential/residential-01.webp'),alt:'Superior Plus vehicle attending a residential painting inspection'},
    {title:'Preparation selected for the surface',text:'Cleaning, pressure washing, scraping, sanding, filling, suitable repairs, gap sealing and priming are matched to the condition of the project—not treated as an afterthought.',image:asset('client/projects/plaster/plaster-07.webp'),alt:'Detailed plaster and surface preparation before painting'},
    {title:'A finish planned for daily use',text:'Paint systems and application methods are selected around exposure, expected wear and the substrate, with careful protection, inspection, touch-ups and a tidy handover.',image:asset('client/projects/commercial/commercial-06.webp'),alt:'Commercial painting work prepared for a durable professional finish'},
  ]
  return <PageLayout title={seo?.title||'Painting & Property Services'} description={seo?.description||'Explore Superior Plus Painting’s complete painting, preparation, repair and property improvement services across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="CollectionPage">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Core painting services" title="Choose your surface." accent="We’ll handle the finish." text={fields.services_intro||'Explore our dedicated service pages for detailed scope, process and preparation information.'}/><div className="service-directory">{services.map((s,i)=>{const serviceImage=mediaUrl(s.hero?.image||s.image,servicePages[s.slug]?.image||hero.image);return <Reveal key={s.slug} delay={(i%3)*.05}><button className={`directory-card tone-${s.tone||serviceList[i%serviceList.length].tone}`} onClick={()=>navigate(s.url||`/services/${s.slug}`)}><span className="directory-card-photo"><img src={serviceImage} alt={`${s.title} project completed by Superior Plus Painting`} loading="lazy" decoding="async"/></span><span className="directory-card-number">{String(i+1).padStart(2,'0')}</span><span className="directory-card-copy"><h3>{s.title}</h3><p>{s.short}</p></span><ArrowRight/></button></Reveal>})}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section services-detail-band"><div className="container"><SectionIntro eyebrow="What professional service includes" title="More than colour." accent="A complete project plan." text="The supplied service information places inspection, preparation, protection and final quality checks at the centre of every suitable project."/><div className="service-principle-grid">{servicePrinciples.map((item,index)=><Reveal key={item.title} delay={index*.07}><article><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><div><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></div></article></Reveal>)}</div></div></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="More ways we can help" title="Preparation, repairs" accent="and property care." text="These complementary services make renovation and maintenance projects easier to coordinate."/><div className="extras-grid">{extras.map(([title,text],i)=>{const Icon=extraIcons[i%extraIcons.length];return <Reveal key={title} delay={(i%4)*.05}><article><span>{String(i+1).padStart(2,'0')}</span><Icon aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article></Reveal>})}</div><div className="section-action"><button className="btn" onClick={()=>navigate('/additional-services')}>Explore additional services <ArrowRight/></button></div></div></section>
    <ClosingCTA title={cta?.title||'Not sure which service you need?'} text={cta?.text||'Tell us what you can see and what you want to change. We’ll recommend the right preparation and finish during your free consultation.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function AdditionalServicesPage() {
  const navigate=useNavigate()
  const {data:route}=useRouteContent('/additional-services')
  const services=[
    ['Carpentry services','Repair or replacement of suitable damaged timber, skirting boards, architraves, door frames, window trims, weatherboards and related features.'],
    ['Caulking & gap sealing','Neat sealing around windows, doors, skirting boards, wet areas and suitable exterior joints to improve presentation and help limit moisture, dust and drafts.'],
    ['Tiling services','Tiling support for suitable residential and commercial renovation or maintenance projects, discussed and scoped during the quotation.'],
    ['Timber repairs & restoration','Preparation and restoration for decks, fences, pergolas, weatherboards and other suitable timber surfaces before painting or staining.'],
    ['Detailed surface preparation','Pressure washing, sanding, scraping, filling, priming and minor repairs selected for the existing surface and coating condition.'],
    ['Property maintenance','Coordinated maintenance painting and suitable improvement work for homes, rentals, commercial properties and managed sites.'],
    ['Kitchen cabinet painting','Preparation and repainting for suitable cabinet surfaces where an updated finish can refresh the room without complete replacement.'],
    ['Garage floor coatings','Preparation and coating options for suitable residential garage floors, assessed for moisture, contamination and existing surface condition.'],
    ['Driveway painting & coatings','Suitable driveway cleaning, preparation and coating work where the substrate and existing finish allow a durable system.'],
    ['Pressure washing','Surface cleaning for suitable exteriors, driveways, fences, decks and preparation work before a new coating is applied.'],
  ]
  const image=mediaUrl(route?.hero?.image,asset('client/projects/plaster/plaster-11.webp'))
  const seo=route?.seo
  return <PageLayout title={seo?.title||'Additional Property Improvement Services Melbourne'} description={seo?.description||'Explore carpentry, caulking, tiling, timber restoration, surface preparation, maintenance and suitable coating services from Superior Plus Painting.'} image={mediaUrl(seo?.social_image,image)} pageType="Service">
    <PageHero eyebrow={route?.hero?.eyebrow||'More than the final coat'} title={route?.hero?.title||'Additional property services'} accent={route?.hero?.accent||'coordinated with care.'} intro={route?.hero?.intro||'To make renovation and maintenance easier, Superior Plus can coordinate selected preparation, repair and improvement services alongside residential and commercial painting.'} image={image} imageAlt={route?.hero?.image?.alt||'Surface preparation and repair work by Superior Plus Painting'} tone="terracotta"/>
    <TrustStrip/>
    <section className="inner-section additional-services-intro"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow="One practical project plan" title="The work around painting" accent="matters just as much."/><p>Paint performs best when the surfaces, joints and surrounding details are in suitable condition. Bringing compatible repairs and preparation into the same conversation can simplify scheduling and produce a more complete result.</p><p>Availability and final scope depend on the property, access, substrate and type of work required. We will confirm what can be included during the inspection and written quotation.</p></Reveal><Reveal className="additional-services-proof" delay={.1}><Hammer/><strong>Inspect</strong><span>Assess the existing condition</span><strong>Coordinate</strong><span>Sequence compatible trades and preparation</span><strong>Finish</strong><span>Complete the suitable coating system</span></Reveal></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="Approved service range" title="Repairs, preparation" accent="and property care." text="Tell us what you can see and what outcome you want. We’ll advise which services suit the project."/><div className="additional-service-grid">{services.map(([title,text],index)=><Reveal key={title} delay={(index%3)*.04}><article><span>{String(index+1).padStart(2,'0')}</span>{index%3===0?<Hammer/>:index%3===1?<SprayCan/>:<PaintRoller/>}<h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></div></section>
    <section className="additional-service-band"><div className="container"><Reveal><Palette/><h2>Not sure which service<br/><em>your surface needs?</em></h2></Reveal><Reveal delay={.1}><p>Send photos or arrange an inspection. We can identify the preparation, suitable repairs and coating work that should be considered before the project begins.</p><button className="btn" onClick={()=>navigate('/contact')}>Discuss your project <ArrowRight/></button></Reveal></div></section>
    <TestimonialBand index={1}/><AreasBand/><ClosingCTA title="Bring the whole project into one conversation." text="Contact Superior Plus Painting for a free, no-obligation quote covering suitable painting, preparation, repair and property improvement work."/>
  </PageLayout>
}

export function AboutPage() {
  const fallbackHero={eyebrow:'Your trusted Melbourne painters',title:'Care in every coat.',accent:'Pride in every detail.',intro:'Superior Plus Painting is a Melbourne-based team dedicated to high-quality residential and commercial painting with reliable service, honest communication and respect for every property.',image:images.about,tone:'green'}
  const {fields,hero,seo,cta}=usePageContent('/about',fallbackHero)
  const fallbackApproach=['From small residential touch-ups to complete home repaints and large commercial projects, we approach every job with professionalism, honesty and pride. We inspect and prepare each surface, protect surrounding areas and use professional application techniques for a smooth, durable finish.','We understand that your property is one of your most valuable investments. That is why clear communication, reliable scheduling and a clean handover matter just as much as the paint itself.']
  const approach=fields.about_approach_copy?fields.about_approach_copy.split(/\n\s*\n/).filter(Boolean):fallbackApproach
  const standards=textItems(fields.about_standards,['Experienced, professional painters','High-quality workmanship','Attention to every detail','Reliable communication','Clean and tidy sites','Competitive, transparent pricing','Fully insured','Free, no-obligation quotes'])
  const editorialImage=mediaUrl(fields.about_editorial_image,images.about)
  const standardDetails=[
    ['Practical experience across homes and businesses.','From small residential touch-ups to complete repaints and commercial projects, each suitable job is approached with the same professional planning and pride.'],
    ['Preparation and application treated as one system.','Surfaces are inspected, repaired and prepared before premium coatings are applied with suitable brush, roller or spray techniques for even coverage and durable results.'],
    ['Care at edges, trims and every transition.','Clean lines, consistent coverage and considered touch-ups are checked before sign-off because the small details shape how the complete project feels.'],
    ['Clear updates from quotation to handover.','Scope, preparation, colour decisions, scheduling and progress are discussed clearly so clients understand what is happening and what comes next.'],
    ['Protection during the work and a tidy finish.','Furniture, floors, fixtures, landscaping and surrounding areas are protected, then coverings and project materials are removed before the final walkthrough.'],
    ['A written quote with the project clearly scoped.','Pricing is based on the inspected surfaces, preparation, access and coating system, with a free no-obligation quotation before work is scheduled.'],
    ['Confidence while work is underway.','The supplied company information states that Superior Plus Painting is fully insured, supporting a professional approach to work in and around client properties.'],
    ['Useful advice before any commitment.','The initial consultation is an opportunity to discuss surfaces, colours, finishes, repairs and timing before receiving a detailed written quotation.'],
  ]
  const standardImages=[
    asset('client/projects/exterior/exterior-05.webp'),
    asset('client/projects/interior/interior-08.webp'),
    asset('client/projects/fence/fence-14.webp'),
    asset('client/projects/commercial/commercial-10.webp'),
    asset('client/projects/residential/residential-06.webp'),
    asset('client/projects/brand/brand-01.webp'),
    asset('client/projects/roof/roof-05.webp'),
    asset('client/projects/residential/residential-03.webp'),
  ]
  const standardCards=standards.map((title,index)=>({title,brief:standardDetails[index]?.[0]||'Professional care throughout the project.',detail:standardDetails[index]?.[1]||'Every suitable project is inspected, planned and delivered with clear communication and careful workmanship.',image:standardImages[index%standardImages.length],alt:`${title} demonstrated on a Superior Plus Painting project`}))
  const certificateImage=asset('client/certificate-mpa-costing-estimating.png')
  return <PageLayout title={seo?.title||'About Us'} description={seo?.description||'Meet Superior Plus Painting, Melbourne painting professionals committed to careful preparation, reliable service and quality workmanship.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="AboutPage">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow="Our approach" title={fields.about_approach_title||'Quality begins'} accent="before the first coat."/>{approach.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</Reveal><Reveal className="editorial-image" delay={.1}><img src={editorialImage} alt={fields.about_editorial_image?.alt||'Superior Plus painter spray painting a residential fence'} loading="lazy" decoding="async"/><span>Superior Plus project</span></Reveal></div></section>
    <section className="inner-section cream about-roots"><div className="container brand-archive"><Reveal className="brand-archive-media"><img src={brandTeamArchive} alt="Superior Plus Painting branded work vehicle ready for a Melbourne project" loading="lazy" decoding="async"/><div className="brand-archive-stamp"><span>Melbourne painters</span><strong>Local work.<br/>Visible care.</strong><i>Residential · Commercial</i></div></Reveal><Reveal className="brand-archive-copy" delay={.1}><SectionIntro eyebrow="Our local roots" title="Built through" accent="hands-on service."/><p>{fields.about_roots_copy||'Superior Plus has grown through practical local promotion, direct client relationships and work that can be seen across Melbourne homes and businesses.'}</p><small>A real Superior Plus work vehicle, equipped for painting projects across Melbourne.</small></Reveal></div></section>
    <section className="inner-section about-certificate"><div className="container certificate-layout"><Reveal className="certificate-frame"><img src={certificateImage} alt="Master Painters Australia Costing and Estimating for Painters and Decorators workshop certificate for Apshin Najibi, dated 30 July 2021" loading="lazy" decoding="async"/><span>Workshop certificate · 2021</span></Reveal><Reveal className="certificate-copy" delay={.1}><Award/><SectionIntro eyebrow="Professional development" title="Learning behind" accent="the written quote."/><p>This Master Painters Australia certificate records Apshin Najibi’s participation in the one-day <strong>Costing & Estimating for Painters & Decorators</strong> workshop on 30 July 2021.</p><div className="certificate-facts"><span><BookOpen/><b>Workshop</b><small>Costing & estimating</small></span><span><ClipboardCheck/><b>Certificate</b><small>CET1249</small></span></div><small className="certificate-note">Displayed as a training record supplied by the client. It is not presented as a trade licence or membership credential.</small></Reveal></div></section>
    <section className="inner-section cream about-standards"><div className="container"><SectionIntro eyebrow="Why Superior Plus" title="Standards you can see." accent="Tap each card to look deeper." text="Each card pairs real project photography with a short service standard. Select a card to turn it over and read what that standard means during a project."/><FlipFeatureGrid items={standardCards} className="about-flip-grid"/></div></section>
    <TestimonialBand index={0}/><AreasBand/><ClosingCTA title={cta?.title} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ProcessPage() {
  const fallbackHero={eyebrow:'A proven path to a better finish',title:'Our painting process',accent:'planned down to the detail.',intro:'Outstanding painting starts with careful planning, detailed preparation and clear communication. Our six-step process keeps every residential and commercial project organised from quote to handover.',image:images.process,tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/our-process',fallbackHero)
  const steps=pairItems(fields.master_process,masterProcess.map(item=>[item.title,item.text])).map(([title,text])=>({title,text}))
  const proof=textItems(fields.process_proof,['Clear communication','Thorough preparation','High-quality workmanship','Respect for your property','Reliable scheduling','Attention to detail'])
  const proofDetails=[
    ['Know what happens next.','From the first inspection through preparation, painting and final walkthrough, the scope and sequence are explained clearly and practical questions are addressed early.'],
    ['Build the finish on a sound base.','Cleaning or pressure washing, scraping, sanding, filling, suitable repairs, sealing and priming are selected according to the existing substrate and coating condition.'],
    ['Apply the specified system carefully.','Premium coatings are applied with brushes, rollers or spray equipment where appropriate, following suitable coverage and drying requirements before inspection.'],
    ['Protect the spaces around every surface.','Furniture, floors, windows, fixtures, paving and landscaping are covered or masked as required, with the work area cleaned before handover.'],
    ['Plan access, timing and disruption.','The proposed schedule is discussed before work begins, with commercial projects able to consider operating hours and residential projects organised around the property.'],
    ['Inspect the small details before sign-off.','Coverage, lines, trims and the completed surfaces are checked, suitable touch-ups are completed and the client can review the result during the final walkthrough.'],
  ]
  const proofImages=[
    asset('client/projects/brand/brand-02.webp'),
    asset('client/projects/plaster/plaster-09.webp'),
    asset('client/projects/fence/fence-18.webp'),
    asset('client/projects/interior/interior-06.webp'),
    asset('client/projects/commercial/commercial-16.webp'),
    asset('client/projects/exterior/exterior-18.webp'),
  ]
  const proofCards=proof.map((title,index)=>({title,brief:proofDetails[index]?.[0]||'A carefully managed part of the project.',detail:proofDetails[index]?.[1]||'The project is planned and checked carefully from quotation to handover.',image:proofImages[index%proofImages.length],alt:`${title} during a Superior Plus Painting project`}))
  const preparationStories=[
    {icon:ClipboardCheck,title:'Inspect and document',text:'The quote starts with the site, surface condition, access, repairs, colour direction and finish. This creates a practical written scope before scheduling.',image:asset('client/projects/residential/residential-10.webp'),alt:'Residential property inspection before a painting quotation'},
    {icon:Hammer,title:'Repair and protect',text:'Suitable cracks, holes, plaster or timber defects are addressed, while floors, furniture, windows, landscaping and adjacent surfaces are protected.',image:asset('client/projects/plaster/plaster-13.webp'),alt:'Wall preparation and repairs before a new painted finish'},
    {icon:PaintRoller,title:'Apply, inspect and hand over',text:'The selected coating system is applied, checked for coverage and detail, touched up where required and presented in a clean final walkthrough.',image:asset('client/projects/interior/interior-10.webp'),alt:'Completed interior painting inspected before handover'},
  ]
  return <PageLayout title={seo?.title||'Our Painting Process'} description={seo?.description||'Discover Superior Plus Painting’s six-step process for careful preparation, premium application and a clean final handover.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="HowTo" schemaData={{step:steps.map((item,index)=>({'@type':'HowToStep',position:index+1,name:item.title,text:item.text}))}}>
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Six considered steps" title="Simple for you." accent="Meticulous from us."/><div className="master-process">{steps.map((step,i)=><Reveal key={step.title} delay={i*.05}><article><b>{String(i+1).padStart(2,'0')}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article></Reveal>)}</div></div></section>
    <section className="inner-section cream process-story"><div className="container"><SectionIntro eyebrow="What sits behind the six steps" title="The practical work" accent="between quote and handover." text="The supplied process and service documents explain the decisions that support a consistent, lasting finish."/><div className="process-story-grid">{preparationStories.map(({icon:Icon,...item},index)=><Reveal key={item.title} delay={index*.07}><article><div><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><Icon/></div><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></article></Reveal>)}</div></div></section>
    <section className="process-proof"><div className="container"><SectionIntro eyebrow="Why it works" title="Preparation protects" accent="the final result." light text="Select a card to turn it over and see how each promise is carried through the painting process."/><FlipFeatureGrid items={proofCards} className="process-flip-grid"/></div><Divider color="#fff" variant="drip"/></section>
    <ClosingCTA title={cta?.title||'Ready to start the process?'} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function FAQsPage() {
  const [open,setOpen]=useState(0)
  const fallbackHero={eyebrow:'Straight answers before we start',title:'Frequently asked questions',accent:'made easy.',intro:'Painting comes with practical questions. Here are clear answers about quoting, preparation, scheduling, products and what to expect from our team.',image:images.faq,tone:'cream'}
  const {fields,hero,seo,cta}=usePageContent('/faqs',fallbackHero)
  const {data:allFaqs}=useCollection('faqs',collectionFallbacks.faqs)
  const selectedIds=Array.isArray(fields.faq_ids)?fields.faq_ids.map(String):[]
  const items=selectedIds.length?allFaqs.filter(item=>selectedIds.includes(String(item.id))):allFaqs
  const comparisonBoards=[
    ['Residential exterior refresh',asset('client/projects/residential/residential-02.webp')],
    ['Whole-home exterior repaint',asset('client/projects/residential/residential-04.webp')],
    ['Exterior colour and detail update',asset('client/projects/residential/residential-05.webp')],
    ['Façade transformation',asset('client/projects/residential/residential-06.webp')],
    ['Commercial ceiling detail',asset('client/projects/commercial/commercial-13.webp')],
    ['Heritage exterior repaint',asset('client/projects/exterior/exterior-01.webp')],
    ['Weatherboard colour change',asset('client/projects/exterior/exterior-02.webp')],
    ['Exterior preparation and finish',asset('client/projects/exterior/exterior-03.webp')],
    ['Detailed exterior restoration',asset('client/projects/exterior/exterior-06.webp')],
    ['Fence colour transformation',asset('client/projects/fence/fence-01.webp')],
    ['Boundary fence repaint',asset('client/projects/fence/fence-02.webp')],
    ['Garden fence refresh',asset('client/projects/fence/fence-05.webp')],
    ['Residential exterior comparison',asset('client/projects/roof/roof-05.webp')],
    ['Interior preparation and repaint',asset('client/projects/wallpaper/wallpaper-06.webp')],
    ['Feature-wall transformation',asset('client/projects/wallpaper/wallpaper-12.webp')],
  ]
  const plasterComparisons=[
    {title:'Ceiling and cornice repairs',before:asset('client/projects/plaster/plaster-01.webp'),after:asset('client/projects/plaster/plaster-03.webp')},
    {title:'Detailed plaster finishing',before:asset('client/projects/plaster/plaster-05.webp'),after:asset('client/projects/plaster/plaster-06.webp')},
  ]
  return <PageLayout title={seo?.title||'Frequently Asked Questions'} description={seo?.description||'Answers about quotes, service areas, preparation, timing, paint systems and booking with Superior Plus Painting.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="FAQPage" schemaData={{mainEntity:items.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}}>
    <PageHero {...hero} intro={fields.faq_intro||hero.intro}/>
    <section className="inner-section"><div className="container faq-layout"><SectionIntro eyebrow="What clients ask us" title="Everything you need" accent="to move forward."/><div className="faq-list">{items.map((item,i)=><div className={`faq-item ${open===i?'open':''}`} key={item.id||item.question}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,'0')}</span><b>{item.question}</b><ChevronDown/></button>{open===i&&<div className="faq-answer" dangerouslySetInnerHTML={{__html:item.answer}}/>}</div>)}</div></div></section>
    <section className="inner-section cream faq-transformations"><div className="container"><SectionIntro eyebrow="Before & after archive" title="The preparation." accent="The visible difference." text="A collection of client-supplied comparison boards showing exterior, fence, interior and repair work. Project results vary with the original surface, repairs and selected coating system."/><div className="comparison-board-grid">{comparisonBoards.map(([title,image],index)=><Reveal key={image} className={index===0||index===9?'comparison-board-featured':''} delay={(index%4)*.04}><figure><div><img src={image} alt={`${title} before and after comparison supplied by Superior Plus Painting`} loading="lazy" decoding="async"/><span>Comparison {String(index+1).padStart(2,'0')}</span></div><figcaption><Palette/><b>{title}</b><small>Client project archive</small></figcaption></figure></Reveal>)}</div><div className="plaster-comparison-grid">{plasterComparisons.map((comparison,index)=><Reveal key={comparison.title} delay={index*.08}><article><div className="plaster-pair"><figure><img src={comparison.before} alt={`${comparison.title} before repair`} loading="lazy" decoding="async"/><span>Before</span></figure><figure><img src={comparison.after} alt={`${comparison.title} after repair`} loading="lazy" decoding="async"/><span>After</span></figure></div><div><span>Repair sequence 0{index+1}</span><h3>{comparison.title}</h3><p>Preparation and finishing images retained together from the supplied plaster-repair archive.</p></div></article></Reveal>)}</div></div></section>
    <ClosingCTA title={cta?.title||'Still have a question?'} text={cta?.text||'Call our team or send an enquiry. We’ll talk through your property, surfaces and preferred timing before arranging a quote.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ContactPage() {
  const {business}=useSiteContent()
  const enquiry=useEnquirySubmission()
  const fallbackHero={eyebrow:'Tell us what you’re planning',title:'Get in touch',accent:'and get a fresh start.',intro:'Share a few details about your property and the work you have in mind. We’ll follow up to arrange a free, no-obligation consultation and written quote.',image:images.contact,tone:'green'}
  const {fields,hero,seo}=usePageContent('/contact',fallbackHero)
  const serviceOptions=textItems(fields.service_options,['Residential Painting','Commercial Painting','Interior Painting','Exterior Painting','Roof Painting','Fence Painting','Deck Painting & Staining','Garage Floor Coatings','Driveway Painting & Coatings','Plaster Repairs','Wallpaper Removal','Other'])
  const propertyOptions=textItems(fields.property_options,['House','Unit','Apartment','Townhouse','Office','Retail','Warehouse','Other'])
  const steps=pairItems(fields.contact_steps,[['We review your enquiry.','We’ll confirm the service, property and best way to reach you.'],['We arrange an inspection.','Our team assesses the surfaces and discusses colours, finishes and timing.'],['You receive a written quote.','Clear scope, preparation and pricing—with no obligation to proceed.']])
  const mapQuery='Melbourne eastern suburbs Victoria'
  const mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
  const mapEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
  return <PageLayout title={seo?.title||'Get a Free Quote'} description={seo?.description||'Contact Superior Plus Painting for a free residential, commercial or property-painting quote across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="ContactPage">
    <PageHero {...hero}/>
    <section className="quote-page"><div className="container quote-page-grid"><Reveal className="quote-side"><ShieldCheck/><h2>What happens next?</h2><ol>{steps.map(([title,text])=><li key={title}><b>{title}</b><span>{text}</span></li>)}</ol><a href={business.phone_href}><Phone/>{business.phone_display}</a><a href={`mailto:${business.email}`}><Mail/>{business.email}</a></Reveal><Reveal delay={.1}><form className="full-quote-form" onSubmit={enquiry.submit} aria-busy={enquiry.pending}>{enquiry.sent?<div className="form-success"><span><Check/></span><h3>Thanks — your project is ready for review.</h3><p>Your enquiry was delivered successfully. Our team will contact you about the next step.</p><button type="button" className="text-link" onClick={enquiry.reset}>Send another enquiry</button></div>:<><div className="form-heading"><span>Free quote request</span><small>* Required information</small></div><input className="spp-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true"/><input type="hidden" name="source" value="contact-page"/><div className="form-row"><label>Name *<input name="name" required autoComplete="name" placeholder="Your name"/></label><label>Phone number *<input name="phone" required type="tel" autoComplete="tel" placeholder="04xx xxx xxx"/></label></div><div className="form-row"><label>Email address *<input name="email" required type="email" autoComplete="email" placeholder="you@email.com"/></label><label>Suburb *<input name="suburb" required autoComplete="address-level2" placeholder="Your suburb"/></label></div><label>Property address<input name="address" autoComplete="street-address" placeholder="Street address"/></label><div className="form-row"><label>Service required *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{serviceOptions.map(s=><option key={s}>{s}</option>)}</select></label><label>Property type<select name="property_type" defaultValue={propertyOptions[0]}>{propertyOptions.map(option=><option key={option}>{option}</option>)}</select></label></div><label>Project details *<textarea name="details" required minLength="10" rows="5" placeholder="What would you like painted or repaired?"/></label>{enquiry.privacyText&&<label className="form-consent"><input name="consent" value="yes" type="checkbox" required/><span>{enquiry.privacyText}</span></label>}{enquiry.error&&<p className="form-error" role="alert">{enquiry.error}</p>}<button className="btn btn-wide" disabled={enquiry.pending}>{enquiry.pending?'Sending…':<>Request my free quote<ArrowRight/></>}</button><p className="form-note"><ShieldCheck/>{fields.contact_form_note||'No obligation. Form delivery and privacy consent must be confirmed before launch.'}</p></>}</form></Reveal></div></section>
    <section className="contact-location"><div className="container contact-location-grid"><Reveal><div className="location-icon"><MapPin/></div><SectionIntro eyebrow="Our service area" title="Local to Melbourne." accent="Ready to come to you."/><p>Superior Plus Painting services homes and businesses across Melbourne’s eastern and south-eastern suburbs. The map represents our general service region and is not a storefront address.</p><a className="btn" href={mapUrl} target="_blank" rel="noreferrer">View service area in Google Maps <ExternalLink size={17}/></a></Reveal><Reveal className="contact-map" delay={.1}><iframe src={mapEmbedUrl} title="Superior Plus Painting Melbourne service area" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></Reveal></div></section>
    <TestimonialBand index={2}/><AreasBand/>
  </PageLayout>
}
