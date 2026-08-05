import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Award, BookOpen, Check, ChevronDown, ClipboardCheck, ExternalLink, Hammer, Mail, MapPin, PaintRoller, Palette, Phone, RotateCw, ShieldCheck, SprayCan, Trees } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA } from '../components/PageLayout'
import { Reveal, Divider, Testimonials } from '../App'
import { faqs, masterProcess, serviceList, servicePages, suburbs } from '../data/siteData'
import { brandTeamArchive } from '../data/projectMedia'
import { asset } from '../utils/assets'
import { collectionFallbacks, fieldValue, mediaUrl, mergeContent, pairItems, textItems, useCollection, useEnquirySubmission, useRouteContent, useSiteContent } from '../content/ContentProvider'
import approvedContent from '../data/clientApprovedContent.json'

const images = {
  about: asset('stock-main/about.webp'),
  services: asset('stock-main/services.webp'),
  process: asset('client/heroes/our-process-house-hero.jpg'),
  faq: asset('stock-main/faq.webp'),
  contact: asset('stock-main/contact.webp'),
}

function usePageContent(path,fallbackHero) {
  const {data:route}=useRouteContent(path)
  const fields=route?.content?.fields||{}
  const explicitHero=route?{
    eyebrow:fieldValue(fields,'eyebrow',fallbackHero.eyebrow),
    title:fieldValue(fields,'hero_title',fallbackHero.title),
    accent:fieldValue(fields,'accent',fallbackHero.accent),
    intro:fieldValue(fields,'hero_intro',fallbackHero.intro),
    image:fieldValue(fields,'hero_image',route.hero?.image??fallbackHero.image),
    imageAlt:fieldValue(fields,'hero_image_alt',route.hero?.image?.alt),
  }:undefined
  const mergedHero=mergeContent(fallbackHero,explicitHero)
  return {
    route,
    fields,
    hero:{
      ...mergedHero,
      image:mediaUrl(fieldValue(fields,'hero_image',route?.hero?.image),mergedHero.image),
      imageAlt:fieldValue(fields,'hero_image_alt',route?.hero?.image?.alt??mergedHero.imageAlt),
    },
    seo:route?.seo,
    cta:route?.closing_cta,
  }
}

function FlipFeatureGrid({items,className=''}) {
  const [flipped,setFlipped]=useState(-1)
  return <div className={`flip-feature-grid ${className}`}>{items.map((item,index)=>{
    const active=flipped===index
    return <Reveal key={`${item.title}-${index}`} delay={(index%4)*.05}><button type="button" className={`flip-feature ${active?'is-flipped':''}`} onClick={()=>setFlipped(active?-1:index)} aria-pressed={active} aria-label={`${active?'Show summary for':'Read more about'} ${item.title}`}><span className="flip-feature-inner"><span className="flip-feature-face flip-feature-front">{item.image&&<span className="flip-feature-photo"><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><i>{String(index+1).padStart(2,'0')}</i></span>}<span className="flip-feature-summary">{item.title&&<strong>{item.title}</strong>}{item.brief&&<small>{item.brief}</small>}<em><RotateCw/> Tap to turn</em></span></span><span className="flip-feature-face flip-feature-back"><span>{String(index+1).padStart(2,'0')}</span>{item.title&&<strong>{item.title}</strong>}{item.detail&&<p>{item.detail}</p>}<em><RotateCw/> Back to image</em></span></span></button></Reveal>
  })}</div>
}

function ApprovedSections({sections,eyebrow='Helpful information'}) {
  return <>{sections.map((section,index)=>{
    const faqFollowup={
      'Why Clients Choose Us':'faq-followup-why',
      'Share Your Experience':'faq-followup-share',
      'Request a Free Quote':'faq-followup-quote',
    }[section.heading]
    return <section className={`inner-section approved-copy-section ${faqFollowup??(index%2?'cream':'')} ${faqFollowup?'faq-followup-section':''}`} key={section.heading}><div className="container"><SectionIntro eyebrow={eyebrow} title={section.heading} accent=""/><Reveal className="approved-copy-body"><div>{section.body?<p>{section.body}</p>:null}</div>{section.items?.length?<ul>{section.items.map(item=><li key={item}><Check/>{item}</li>)}</ul>:null}</Reveal></div></section>
  })}</>
}

export function ServicesPage() {
  const navigate=useNavigate()
  const {services}=useSiteContent()
  const fallbackHero={eyebrow:'Everything under one careful eye',title:'Painting & property services',accent:'made beautifully simple.',intro:'From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place.',image:images.services,tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/services',fallbackHero)
  const fallbackExtras=[['Wallpaper removal','Adhesive removal and wall preparation for a smooth paint-ready finish.'],['Carpentry services','Suitable repairs or replacement for damaged trims, frames, weatherboards and timber details.'],['Caulking & gap sealing','Neat sealing around windows, doors, skirtings and suitable interior or exterior joints.'],['Tiling services','Tiling support for suitable residential and commercial improvement projects.'],['Timber restoration','Preparation and restoration for decks, fences, pergolas and weatherboards.'],['Surface preparation','Pressure washing, sanding, scraping, filling and priming.'],['Property maintenance','Ongoing support to keep residential and commercial properties in excellent condition.']]
  const extras=pairItems(fieldValue(fields,'additional_services',undefined),fallbackExtras)
  const extraIcons=[SprayCan,Hammer,ShieldCheck,Palette,Trees,PaintRoller,ClipboardCheck]
  const fallbackServicePrinciples=[
    {title:'A complete, written scope',text:'We inspect the property, discuss the surfaces, colours and finish, then provide a detailed no-obligation quotation with preparation and pricing clearly explained.',image:asset('client/projects/residential/residential-01.webp'),alt:'Superior Plus vehicle attending a residential painting inspection'},
    {title:'Preparation selected for the surface',text:'Cleaning, pressure washing, scraping, sanding, filling, suitable repairs, gap sealing and priming are matched to the condition of the project—not treated as an afterthought.',image:asset('client/projects/plaster/plaster-07.webp'),alt:'Detailed plaster and surface preparation before painting'},
    {title:'A finish planned for daily use',text:'Paint systems and application methods are selected around exposure, expected wear and the substrate, with careful protection, inspection, touch-ups and a tidy handover.',image:asset('client/projects/commercial/commercial-06.webp'),alt:'Commercial painting work prepared for a durable professional finish'},
  ]
  const principlePairs=pairItems(fieldValue(fields,'service_principles',undefined),fallbackServicePrinciples.map(item=>[item.title,item.text]))
	const configuredPrincipleImages=fieldValue(fields,'service_principle_images',undefined)
	const managedPrincipleImages=Array.isArray(configuredPrincipleImages)
	const principleImages=(configuredPrincipleImages??[]).map(item=>({src:mediaUrl(item.media),alt:item.alt})).filter(item=>item.src)
  const servicePrinciples=principlePairs.map(([title,text],index)=>({title,text,image:principleImages[index]?.src??(managedPrincipleImages?'':fallbackServicePrinciples[index%fallbackServicePrinciples.length].image),alt:principleImages[index]?.alt??fallbackServicePrinciples[index%fallbackServicePrinciples.length].alt}))
  return <PageLayout title={seo?.title||'Painting & Property Services'} description={seo?.description||'Explore Superior Plus Painting’s complete painting, preparation, repair and property improvement services across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="CollectionPage" mainClassName="services-main">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Core painting services" title="Choose your surface." accent="We’ll handle the finish." text={fieldValue(fields,'services_intro','Explore our dedicated service pages for detailed scope, process and preparation information.')}/><div className="service-directory">{services.map((s,i)=>{const serviceImage=mediaUrl(s.hero?.image??s.image,servicePages[s.slug]?.image??hero.image);return <Reveal key={s.slug} delay={(i%3)*.05}><button className={`directory-card tone-${s.tone??serviceList[i%serviceList.length].tone}`} onClick={()=>navigate(s.url??`/services/${s.slug}`)}>{serviceImage&&<span className="directory-card-photo"><img src={serviceImage} alt={`${s.title} project completed by Superior Plus Painting`} loading="lazy" decoding="async"/></span>}<span className="directory-card-number">{String(i+1).padStart(2,'0')}</span><span className="directory-card-copy"><h3>{s.title}</h3>{s.short&&<p>{s.short}</p>}</span><ArrowRight/></button></Reveal>})}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section services-detail-band"><div className="container"><SectionIntro eyebrow="What professional service includes" title="More than colour." accent="A complete project plan." text="The supplied service information places inspection, preparation, protection and final quality checks at the centre of every suitable project."/><div className="service-principle-grid">{servicePrinciples.map((item,index)=><Reveal key={`${item.title}-${index}`} delay={index*.07}><article>{item.image&&<img src={item.image} alt={item.alt} loading="lazy" decoding="async"/>}<div><span>0{index+1}</span>{item.title&&<h3>{item.title}</h3>}{item.text&&<p>{item.text}</p>}</div></article></Reveal>)}</div></div></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="More ways we can help" title="Preparation, repairs" accent="and property care." text="These complementary services make renovation and maintenance projects easier to coordinate."/><div className="extras-grid">{extras.map(([title,text],i)=>{const Icon=extraIcons[i%extraIcons.length];return <Reveal key={title} delay={(i%4)*.05}><article className={`extra-service-card extra-service-card-${i%4}`}><span>{String(i+1).padStart(2,'0')}</span><i aria-hidden="true"/><div className="extra-service-icon"><Icon aria-hidden="true"/></div><h3>{title}</h3><p>{text}</p><small aria-hidden="true">Property support</small></article></Reveal>})}</div><div className="section-action"><button className="btn" onClick={()=>navigate('/additional-services')}>Explore additional services <ArrowRight/></button></div></div></section>
    <ClosingCTA title={cta?.title??'Not sure which service you need?'} text={cta?.text??'Tell us what you can see and what you want to change. We’ll recommend the right preparation and finish during your free consultation.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function AdditionalServicesPage() {
  const navigate=useNavigate()
  const approved=approvedContent.documents.additional_services
  const approvedIntro=approved.sections[0]
  const approvedServices=approved.sections.slice(1,9)
  const approvedNeed=approved.sections.find(section=>section.heading==='Need Another Service?')
  const approvedQuote=approved.sections.find(section=>section.heading==='Request a Free Quote')
  const fallbackHero={eyebrow:approved.title,title:approved.headline,accent:'Coordinated with care.',intro:approvedIntro.body,image:asset('stock-main/additional-services.webp'),tone:'terracotta'}
  const {fields,hero,seo,cta}=usePageContent('/additional-services',fallbackHero)
  const fallbackServices=approvedServices.map(section=>[section.heading,section.body])
  const services=pairItems(fieldValue(fields,'additional_services',undefined),fallbackServices)
  const supporting=pairItems(fieldValue(fields,'content_sections',undefined),[[approvedNeed.heading,approvedNeed.body],[approvedQuote.heading,approvedQuote.body]])
  const need=supporting[0]??['','']
  const quote=supporting[1]??[approvedQuote.heading,approvedQuote.body]
  const serviceIcons=[Hammer,ShieldCheck,Palette,Trees,SprayCan,ClipboardCheck,PaintRoller,ShieldCheck,Palette,SprayCan]
  const secondaryImage=mediaUrl(fieldValue(fields,'secondary_image',undefined))
  return <PageLayout title={seo?.title??approved.headline} description={seo?.description??approvedIntro.body} image={mediaUrl(seo?.social_image,hero.image)} pageType="Service" mainClassName="additional-services-main">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section additional-services-intro"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow={approved.title} title="The work around painting" accent="matters just as much."/><p>{approvedIntro.body}</p>{secondaryImage&&<img className="additional-services-secondary-image" src={secondaryImage} alt={fields.secondary_image?.alt??'Superior Plus property service project'} loading="lazy" decoding="async"/>}</Reveal><Reveal className="additional-services-proof" delay={.1}><Hammer/><strong>Inspect</strong><span>Assess the existing condition</span><strong>Coordinate</strong><span>Sequence compatible trades and preparation</span><strong>Finish</strong><span>Complete the suitable coating system</span></Reveal></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream additional-services-directory"><div className="container"><SectionIntro eyebrow="Approved service range" title="Repairs, preparation" accent="and property care." text="Tell us what you can see and what outcome you want. We’ll advise which services suit the project."/><div className="additional-service-grid">{services.map(([title,text],index)=>{const Icon=serviceIcons[index%serviceIcons.length];return <Reveal key={`${title}-${index}`} delay={(index%3)*.04}><article><span>{String(index+1).padStart(2,'0')}</span><div className="additional-service-icon"><Icon/></div><small>Property support</small>{title&&<h3>{title}</h3>}{text&&<p>{text}</p>}</article></Reveal>})}</div></div></section>
    {(need[0]||need[1])&&<section className="additional-service-band"><div className="container"><Reveal><Palette/>{need[0]&&<h2>{need[0]}<br/><em>Tell us what you need.</em></h2>}</Reveal><Reveal delay={.1}>{need[1]&&<p>{need[1]}</p>}<button className="btn" onClick={()=>navigate('/contact')}>Discuss your project <ArrowRight/></button></Reveal></div></section>}
    <TestimonialBand index={1}/><AreasBand/><ClosingCTA title={cta?.title??quote[0]} text={cta?.text??quote[1]} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function AboutPage() {
  const approved=approvedContent.documents.about
  const approvedIntro=approved.sections[0]
  const approvedWhat=approved.sections.find(section=>section.heading==='What We Do')
  const approvedQuality=approved.sections.find(section=>section.heading==='Our Commitment to Quality')
  const approvedReasons=approved.sections.find(section=>section.heading==='Why Choose Superior Plus Painting?')
  const approvedRoots=approved.sections.find(section=>section.heading==='Proudly Servicing Melbourne')
  const approvedClosing=approved.sections.find(section=>section.heading==="Let's Transform Your Property")
  const fallbackHero={eyebrow:approved.title,title:approved.headline,accent:'Care in every detail.',intro:approvedIntro.body,image:images.about,tone:'green'}
  const {fields,hero,seo,cta}=usePageContent('/about',fallbackHero)
  const managedSections=pairItems(fieldValue(fields,'content_sections',undefined),[approvedWhat,approvedQuality,approvedReasons,approvedRoots,approvedClosing].map(section=>[section.heading,[section.body,...(section.items??[])].filter(Boolean).join('\n')]))
  const whatLines=(managedSections[0]?.[1]??'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean)
  const whatTitle=managedSections[0]?.[0]??approvedWhat.heading
  const whatBody=whatLines[0]??''
  const whatItems=whatLines.length>1?whatLines.slice(1):approvedWhat.items
  const qualityTitle=managedSections[1]?.[0]??approvedQuality.heading
  const qualityBody=managedSections[1]?.[1]??approvedQuality.body
  const rootsTitle=managedSections[3]?.[0]??approvedRoots.heading
  const rootsBody=managedSections[3]?.[1]??approvedRoots.body
  const closingTitle=managedSections[4]?.[0]??approvedClosing.heading
  const closingBody=managedSections[4]?.[1]??approvedClosing.body
  const fallbackApproach=[qualityBody]
  const approach=fieldValue(fields,'about_approach_copy',undefined)!==undefined?fieldValue(fields,'about_approach_copy','').split(/\n\s*\n/).filter(Boolean):fallbackApproach
  const standards=textItems(fieldValue(fields,'about_standards',undefined),approvedReasons.items)
  const editorialImage=mediaUrl(fieldValue(fields,'about_editorial_image',undefined),asset('client/projects/new-batch/batch-097.webp'))
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
  const standardSummaries=textItems(fieldValue(fields,'about_standard_summaries',undefined),standardDetails.map(item=>item[0]))
  const standardDescriptions=textItems(fieldValue(fields,'about_standard_details',undefined),standardDetails.map(item=>item[1]))
  const standardImages=[
    asset('client/projects/new-batch/batch-073.webp'),
    asset('client/projects/new-batch/batch-049.webp'),
    asset('client/projects/new-batch/batch-102.webp'),
    asset('client/projects/new-batch/batch-155.webp'),
    asset('client/projects/new-batch/batch-067.webp'),
    asset('client/projects/new-batch/batch-107.webp'),
    asset('client/projects/new-batch/batch-096.webp'),
    asset('client/projects/new-batch/batch-145.webp'),
  ]
  const configuredStandardImages=fieldValue(fields,'about_standard_images',undefined)
  const managedStandardImages=(configuredStandardImages??[]).map(item=>({src:mediaUrl(item.media),alt:item.alt})).filter(item=>item.src)
  const hasManagedStandardImages=Array.isArray(configuredStandardImages)
  const standardCards=standards.map((title,index)=>({title,brief:standardSummaries[index]??'Professional care throughout the project.',detail:standardDescriptions[index]??'Every suitable project is inspected, planned and delivered with clear communication and careful workmanship.',image:managedStandardImages[index]?.src??(hasManagedStandardImages?'':standardImages[index%standardImages.length]),alt:managedStandardImages[index]?.alt??`${title} demonstrated on a Superior Plus Painting project`}))
  const archiveImage=mediaUrl(fieldValue(fields,'about_archive_image',undefined),brandTeamArchive)
  const certificateImage=asset('client/certificate-mpa-costing-estimating.png')
  return <PageLayout title={seo?.title??approved.title} description={seo?.description??approvedIntro.body} image={mediaUrl(seo?.social_image,hero.image)} pageType="AboutPage" mainClassName="about-main">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section about-service-range"><div className="container"><SectionIntro eyebrow={whatTitle} title="Complete painting care" accent="for the whole property." text={whatBody}/><div className="scope-grid">{whatItems.map((item,index)=>{const Icon=[PaintRoller,Palette,SprayCan,Trees,Hammer][index%5];return <Reveal key={`${item}-${index}`} delay={(index%5)*.04}><div className="scope-item scope-green"><small>{String(index+1).padStart(2,'0')}</small><span className="scope-icon"><Icon/></span><b>{item}</b></div></Reveal>})}</div></div></section>
    <section className="inner-section cream"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow={qualityTitle} title={fieldValue(fields,'about_approach_title','Quality begins')} accent="before the first coat."/>{approach.map((paragraph,index)=><p key={`${paragraph}-${index}`}>{paragraph}</p>)}</Reveal>{editorialImage&&<Reveal className="editorial-image" delay={.1}><img src={editorialImage} alt={fields.about_editorial_image?.alt??'Superior Plus painter preparing and painting a protected Melbourne interior'} loading="lazy" decoding="async"/><span>Superior Plus project</span></Reveal>}</div></section>
    <section className="inner-section about-roots"><div className="container brand-archive">{archiveImage&&<Reveal className="brand-archive-media"><img src={archiveImage} alt="Superior Plus Painting company archive" loading="lazy" decoding="async"/><div className="brand-archive-stamp"><span>Melbourne painters</span><strong>Local work.<br/>Visible care.</strong><i>Residential · Commercial</i></div></Reveal>}<Reveal className="brand-archive-copy" delay={.1}><SectionIntro eyebrow={rootsTitle} title="Built through" accent="hands-on service."/>{fieldValue(fields,'about_roots_copy',rootsBody)&&<p>{fieldValue(fields,'about_roots_copy',rootsBody)}</p>}<small>A real Superior Plus work vehicle, equipped for painting projects across Melbourne.</small></Reveal></div></section>
    <section className="inner-section about-certificate"><div className="container certificate-layout"><Reveal className="certificate-frame"><img src={certificateImage} alt="Master Painters Australia Costing and Estimating for Painters and Decorators workshop certificate for Apshin Najibi, dated 30 July 2021" loading="lazy" decoding="async"/><span>Workshop certificate · 2021</span></Reveal><Reveal className="certificate-copy" delay={.1}><Award/><SectionIntro eyebrow="Professional development" title="Learning behind" accent="the written quote."/><p>This Master Painters Australia certificate records Apshin Najibi’s participation in the one-day <strong>Costing & Estimating for Painters & Decorators</strong> workshop on 30 July 2021.</p><div className="certificate-facts"><span><BookOpen/><b>Workshop</b><small>Costing & estimating</small></span><span><ClipboardCheck/><b>Certificate</b><small>CET1249</small></span></div><small className="certificate-note">Displayed as a training record supplied by the client. It is not presented as a trade licence or membership credential.</small></Reveal></div></section>
    <section className="inner-section cream about-standards"><div className="container"><SectionIntro eyebrow="Why Superior Plus" title="Standards you can see." accent="Tap each card to look deeper." text="Each card pairs real project photography with a short service standard. Select a card to turn it over and read what that standard means during a project."/><FlipFeatureGrid items={standardCards} className="about-flip-grid"/></div></section>
    <TestimonialBand index={0}/><AreasBand/><ClosingCTA title={cta?.title??closingTitle} text={cta?.text??closingBody} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ProcessPage() {
  const approved=approvedContent.documents.process
  const approvedIntro=approved.sections[0]
  const approvedWhy=approved.sections.find(section=>section.heading==='Why Our Process Works')
  const approvedReady=approved.sections.find(section=>section.heading==='Ready to Start?')
  const fallbackHero={eyebrow:approved.title,title:approved.headline,accent:'Clear from quote to handover.',intro:approvedIntro.body,image:images.process,imagePosition:'74% center',imageAlt:'Professional painter applying a fresh exterior finish to a modern residential home',tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/our-process',fallbackHero)
  const steps=pairItems(fieldValue(fields,'master_process',undefined),approved.steps.map(item=>[item.heading,item.body])).map(([title,text])=>({title,text}))
  const processSections=pairItems(fieldValue(fields,'content_sections',undefined),[[approvedWhy.heading,approvedWhy.items.join('\n')],[approvedReady.heading,approvedReady.body]])
  const sectionProof=processSections[0]?.[1]?.split(/\r?\n/).map(item=>item.trim()).filter(Boolean)??approvedWhy.items
  const proof=textItems(fieldValue(fields,'process_proof',undefined),sectionProof)
  const processClosing=processSections[1]??[approvedReady.heading,approvedReady.body]
  const proofDetails=[
    ['Know what happens next.','From the first inspection through preparation, painting and final walkthrough, the scope and sequence are explained clearly and practical questions are addressed early.'],
    ['Build the finish on a sound base.','Cleaning or pressure washing, scraping, sanding, filling, suitable repairs, sealing and priming are selected according to the existing substrate and coating condition.'],
    ['Apply the specified system carefully.','Premium coatings are applied with brushes, rollers or spray equipment where appropriate, following suitable coverage and drying requirements before inspection.'],
    ['Protect the spaces around every surface.','Furniture, floors, windows, fixtures, paving and landscaping are covered or masked as required, with the work area cleaned before handover.'],
    ['Plan access, timing and disruption.','The proposed schedule is discussed before work begins, with commercial projects able to consider operating hours and residential projects organised around the property.'],
    ['Inspect the small details before sign-off.','Coverage, lines, trims and the completed surfaces are checked, suitable touch-ups are completed and the client can review the result during the final walkthrough.'],
  ]
  const proofSummaries=textItems(fieldValue(fields,'process_proof_summaries',undefined),proofDetails.map(item=>item[0]))
  const proofDescriptions=textItems(fieldValue(fields,'process_proof_details',undefined),proofDetails.map(item=>item[1]))
  const proofImages=[
    asset('client/projects/new-batch/batch-155.webp'),
    asset('client/projects/new-batch/batch-100.webp'),
    asset('client/projects/new-batch/batch-049.webp'),
    asset('client/projects/new-batch/batch-067.webp'),
    asset('client/projects/new-batch/batch-145.webp'),
    asset('client/projects/new-batch/batch-102.webp'),
  ]
  const configuredProofImages=fieldValue(fields,'process_proof_images',undefined)
  const managedProofImages=(configuredProofImages??[]).map(item=>({src:mediaUrl(item.media),alt:item.alt})).filter(item=>item.src)
  const hasManagedProofImages=Array.isArray(configuredProofImages)
  const proofCards=proof.map((title,index)=>({title,brief:proofSummaries[index]??'A carefully managed part of the project.',detail:proofDescriptions[index]??'The project is planned and checked carefully from quotation to handover.',image:managedProofImages[index]?.src??(hasManagedProofImages?'':proofImages[index%proofImages.length]),alt:managedProofImages[index]?.alt??`${title} during a Superior Plus Painting project`}))
  const preparationStories=[
    {icon:ClipboardCheck,title:'Inspect and document',text:'The quote starts with the site, surface condition, access, repairs, colour direction and finish. This creates a practical written scope before scheduling.',image:asset('client/projects/residential/residential-10.webp'),alt:'Residential property inspection before a painting quotation'},
    {icon:Hammer,title:'Repair and protect',text:'Suitable cracks, holes, plaster or timber defects are addressed, while floors, furniture, windows, landscaping and adjacent surfaces are protected.',image:asset('client/projects/plaster/plaster-13.webp'),alt:'Wall preparation and repairs before a new painted finish'},
    {icon:PaintRoller,title:'Apply, inspect and hand over',text:'The selected coating system is applied, checked for coverage and detail, touched up where required and presented in a clean final walkthrough.',image:asset('client/projects/interior/interior-10.webp'),alt:'Completed interior painting inspected before handover'},
  ]
  return <PageLayout title={seo?.title??approved.title} description={seo?.description??approvedIntro.body} image={mediaUrl(seo?.social_image,hero.image)} pageType="HowTo" schemaData={{step:steps.map((item,index)=>({'@type':'HowToStep',position:index+1,name:item.title,text:item.text}))}}>
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Six considered steps" title="Simple for you." accent="Meticulous from us."/><div className="master-process">{steps.map((step,i)=><Reveal key={step.title} delay={i*.05}><article><b>{String(i+1).padStart(2,'0')}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article></Reveal>)}</div></div></section>
    <section className="inner-section cream process-story"><div className="container"><SectionIntro eyebrow="What sits behind the six steps" title="The practical work" accent="between quote and handover." text="The supplied process and service documents explain the decisions that support a consistent, lasting finish."/><div className="process-story-grid">{preparationStories.map(({icon:Icon,...item},index)=><Reveal key={item.title} delay={index*.07}><article><div><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><Icon/></div><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></article></Reveal>)}</div></div></section>
    <section className="process-proof"><div className="container"><SectionIntro eyebrow="Why it works" title="Preparation protects" accent="the final result." light text="Select a card to turn it over and see how each promise is carried through the painting process."/><FlipFeatureGrid items={proofCards} className="process-flip-grid"/></div><Divider color="#fff" variant="drip"/></section>
    <ClosingCTA title={cta?.title??processClosing[0]} text={cta?.text??processClosing[1]} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function FAQsPage() {
  const [open,setOpen]=useState(0)
  const approved=approvedContent.documents.faqs
  const approvedTestimonials=approvedContent.documents.testimonials
  const fallbackHero={eyebrow:'Straight answers before we start',title:'Frequently asked questions',accent:'made easy.',intro:'Painting comes with practical questions. Here are clear answers about quoting, preparation, scheduling, products and what to expect from our team.',image:images.faq,tone:'cream'}
  const {fields,hero,seo,cta}=usePageContent('/faqs',fallbackHero)
  const {data:allFaqs}=useCollection('faqs',collectionFallbacks.faqs)
  const {data:reviewItems}=useCollection('testimonials',collectionFallbacks.testimonials)
  const {review_profile:reviewProfile}=useSiteContent()
  const configuredFaqIds=fieldValue(fields,'faq_ids',undefined)
  const selectedFaqIds=Array.isArray(configuredFaqIds)?configuredFaqIds.map(Number):null
  const items=selectedFaqIds
    ? selectedFaqIds.map(id=>allFaqs.find(item=>Number(item.id)===id)).filter(Boolean)
    : (allFaqs.length?allFaqs:approved.items)
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
    ['Roof coating restoration',asset('client/projects/roof/roof-before-after.webp')],
    ['Whole-home repaint comparison',asset('client/projects/new-batch/batch-001.webp')],
    ['Windows, garage and entry refresh',asset('client/projects/new-batch/batch-057.webp')],
    ['Commercial ceiling transformation',asset('client/projects/new-batch/batch-089.webp')],
    ['Exterior window restoration',asset('client/projects/new-batch/batch-102.webp')],
    ['Deck and outdoor finish comparison',asset('client/projects/new-batch/batch-111.webp')],
    ['Garage preparation and finish',asset('client/projects/new-batch/batch-114.webp')],
    ['Deck restoration comparison',asset('client/projects/new-batch/batch-116.webp')],
    ['Interior rooms before and after',asset('client/projects/new-batch/batch-117.webp')],
    ['Whole-interior transformation',asset('client/projects/new-batch/batch-118.webp')],
    ['Exterior repaint transformation',asset('client/projects/new-batch/batch-120.webp')],
    ['Cabinetry painting comparison',asset('client/projects/new-batch/batch-121.webp')],
    ['Porch and veranda restoration',asset('client/projects/new-batch/batch-122.webp')],
    ['Façade before and after',asset('client/projects/new-batch/batch-123.webp')],
    ['Fence staining transformation',asset('client/projects/new-batch/batch-125.webp')],
    ['Exterior detail comparison',asset('client/projects/new-batch/batch-126.webp')],
    ['Fence repaint before and after',asset('client/projects/new-batch/batch-127.webp')],
    ['Weatherboard restoration details',asset('client/projects/new-batch/batch-128.webp')],
    ['Interior colour transformation',asset('client/projects/new-batch/batch-130.webp')],
    ['Residential exterior transformation',asset('client/projects/new-batch/batch-159.webp')],
  ]
  const configuredProjectGallery=fieldValue(fields,'faq_project_gallery',undefined)
  const managedComparisonBoards=Array.isArray(configuredProjectGallery)
    ? configuredProjectGallery.map((item,index)=>[item.caption||item.alt||`Project comparison ${index+1}`,mediaUrl(item.media)]).filter(([,image])=>image)
    : comparisonBoards
  const plasterComparisons=[
    {title:'Ceiling and cornice repairs',before:asset('client/projects/plaster/plaster-01.webp'),after:asset('client/projects/plaster/plaster-03.webp')},
    {title:'Detailed plaster finishing',before:asset('client/projects/plaster/plaster-05.webp'),after:asset('client/projects/plaster/plaster-06.webp')},
  ]
  return <PageLayout title={seo?.title||'Frequently Asked Questions'} description={seo?.description||'Answers about quotes, service areas, preparation, timing, paint systems and booking with Superior Plus Painting.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="FAQPage" mainClassName="faqs-main" schemaData={{mainEntity:items.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}}>
    <PageHero {...hero} intro={fieldValue(fields,'faq_intro',hero.intro)}/>
    <section className="inner-section"><div className="container faq-layout"><SectionIntro eyebrow="What clients ask us" title="Everything you need" accent="to move forward."/><div className="faq-list">{items.map((item,i)=><div className={`faq-item ${open===i?'open':''}`} key={item.id||item.question}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,'0')}</span><b>{item.question}</b><ChevronDown/></button>{open===i&&<div className="faq-answer" dangerouslySetInnerHTML={{__html:item.answer}}/>}</div>)}</div></div></section>
    <Testimonials items={reviewItems} className="faq-google-reviews" profile={reviewProfile}/>
    <section className="inner-section client-testimonial-archive"><div className="container"><SectionIntro eyebrow={approvedTestimonials.title} title={approvedTestimonials.headline} accent="" text={approvedTestimonials.sections[0].body}/><div className="client-testimonial-grid">{approvedTestimonials.reviews.map((review,index)=><Reveal key={review.heading} delay={(index%2)*.06}><article><span>★★★★★</span><h3>{review.heading.replace('★★★★★ ','')}</h3><p>“{review.body}”</p></article></Reveal>)}</div></div></section>
    <ApprovedSections sections={approvedTestimonials.sections.slice(5)} eyebrow="Testimonials & Reviews"/>
    <section className="inner-section cream faq-transformations"><div className="container"><SectionIntro eyebrow="Before & after archive" title="The preparation." accent="The visible difference." text="A collection of client-supplied comparison boards showing exterior, fence, interior and repair work. Project results vary with the original surface, repairs and selected coating system."/><div className="comparison-board-grid">{managedComparisonBoards.map(([title,image],index)=><Reveal key={`${image}-${index}`} className={index===0||index===9?'comparison-board-featured':''} delay={(index%4)*.04}><figure><div><img src={image} alt={`${title} before and after comparison supplied by Superior Plus Painting`} loading="lazy" decoding="async"/><span>Comparison {String(index+1).padStart(2,'0')}</span></div><figcaption><Palette/><b>{title}</b><small>Client project archive</small></figcaption></figure></Reveal>)}</div>{!Array.isArray(configuredProjectGallery)&&<div className="plaster-comparison-grid">{plasterComparisons.map((comparison,index)=><Reveal key={comparison.title} delay={index*.08}><article><div className="plaster-pair"><figure><img src={comparison.before} alt={`${comparison.title} before repair`} loading="lazy" decoding="async"/><span>Before</span></figure><figure><img src={comparison.after} alt={`${comparison.title} after repair`} loading="lazy" decoding="async"/><span>After</span></figure></div><div><span>Repair sequence 0{index+1}</span><h3>{comparison.title}</h3><p>Preparation and finishing images retained together from the supplied plaster-repair archive.</p></div></article></Reveal>)}</div>}</div></section>
    <ClosingCTA title={cta?.title??'Still have a question?'} text={cta?.text??'Call our team or send an enquiry. We’ll talk through your property, surfaces and preferred timing before arranging a quote.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ContactPage() {
  const {business}=useSiteContent()
  const enquiry=useEnquirySubmission()
  const approved=approvedContent.documents.contact
  const fallbackHero={eyebrow:'Tell us what you’re planning',title:'Get in touch',accent:'and get a fresh start.',intro:'Share a few details about your property and the work you have in mind. We’ll follow up to arrange a free, no-obligation consultation and written quote.',image:images.contact,tone:'green'}
  const {fields,hero,seo}=usePageContent('/contact',fallbackHero)
  const serviceOptions=textItems(fieldValue(fields,'service_options',undefined),approved.service_options)
  const propertyOptions=textItems(fieldValue(fields,'property_options',undefined),approved.property_options)
  const defaultFormFields=[['Name','Your name'],['Phone Number','04xx xxx xxx'],['Email Address','you@email.com'],['Suburb','Your suburb'],['Property Address','Street address'],['Project Details','What would you like painted or repaired?']]
  const formFields=pairItems(fieldValue(fields,'contact_form_fields',undefined),defaultFormFields)
  const fieldAt=index=>formFields[index]??defaultFormFields[index]
  const steps=pairItems(fieldValue(fields,'contact_steps',undefined),[['We review your enquiry.','We’ll confirm the service, property and best way to reach you.'],['We arrange an inspection.','Our team assesses the surfaces and discusses colours, finishes and timing.'],['You receive a written quote.','Clear scope, preparation and pricing—with no obligation to proceed.']])
  const mapAddress=business.street_address??'20 Rae Street, Chadstone VIC 3148, Australia'
  const mapQuery=mapAddress
  const mapUrl=business.google_maps_url??`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
  const mapEmbedUrl=business.google_maps_embed_url??'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1574.426042956306!2d145.0931577603448!3d-37.88714169706206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66b1a91253ba3%3A0x5219727b7db56b2d!2sSuperior%20plus%20painting%20%26%20remodeling!5e0!3m2!1sen!2sph!4v1785206391867!5m2!1sen!2sph'
  return <PageLayout title={seo?.title||'Get a Free Quote'} description={seo?.description||'Contact Superior Plus Painting for a free residential, commercial or property-painting quote across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="ContactPage">
    <PageHero {...hero}/>
    <section className="quote-page"><div className="container quote-page-grid"><Reveal className="quote-side"><ShieldCheck/><h2>What happens next?</h2><ol>{steps.map(([title,text],index)=><li key={`${title}-${index}`}>{title&&<b>{title}</b>}{text&&<span>{text}</span>}</li>)}</ol>{business.phone_display&&<a href={business.phone_href}><Phone/>{business.phone_display}</a>}{business.email&&<a href={`mailto:${business.email}`}><Mail/>{business.email}</a>}</Reveal><Reveal delay={.1}><form className="full-quote-form" onSubmit={enquiry.submit} aria-busy={enquiry.pending}>{enquiry.sent?<div className="form-success"><span><Check/></span><h3>Thanks — your project is ready for review.</h3><p>Your enquiry was delivered successfully. Our team will contact you about the next step.</p><button type="button" className="text-link" onClick={enquiry.reset}>Send another enquiry</button></div>:<><div className="form-heading"><span>Free quote request</span><small>* Required information</small></div><input className="spp-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true"/><input type="hidden" name="source" value="contact-page"/><div className="form-row"><label>{fieldAt(0)[0]}<input name="name" required autoComplete="name" placeholder={fieldAt(0)[1]}/></label><label>{fieldAt(1)[0]}<input name="phone" required type="tel" autoComplete="tel" placeholder={fieldAt(1)[1]}/></label></div><div className="form-row"><label>{fieldAt(2)[0]}<input name="email" required type="email" autoComplete="email" placeholder={fieldAt(2)[1]}/></label><label>{fieldAt(3)[0]}<input name="suburb" required autoComplete="address-level2" placeholder={fieldAt(3)[1]}/></label></div><label>{fieldAt(4)[0]}<input name="address" autoComplete="street-address" placeholder={fieldAt(4)[1]}/></label><div className="form-row"><label>Service required *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{serviceOptions.map(s=><option key={s}>{s}</option>)}</select></label><label>Property type<select name="property_type" defaultValue={propertyOptions[0]??''}>{propertyOptions.map(option=><option key={option}>{option}</option>)}</select></label></div><label>{fieldAt(5)[0]}<textarea name="details" required minLength="10" rows="5" placeholder={fieldAt(5)[1]}/></label>{enquiry.privacyText&&<label className="form-consent"><input name="consent" value="yes" type="checkbox" required/><span>{enquiry.privacyText}</span></label>}{enquiry.error&&<p className="form-error" role="alert">{enquiry.error}</p>}<button className="btn btn-wide" disabled={enquiry.pending}>{enquiry.pending?'Sending…':<>Request my free quote<ArrowRight/></>}</button>{fieldValue(fields,'contact_form_note','No obligation. Form delivery and privacy consent must be confirmed before launch.')&&<p className="form-note"><ShieldCheck/>{fieldValue(fields,'contact_form_note','No obligation. Form delivery and privacy consent must be confirmed before launch.')}</p>}</>}</form></Reveal></div></section>
    {(mapAddress||mapUrl||mapEmbedUrl)&&<section className="contact-location"><div className="container contact-location-grid"><Reveal><div className="location-icon"><MapPin/></div><SectionIntro eyebrow="Our Melbourne location" title="Local to Chadstone." accent="Ready to come to you."/>{mapAddress&&<address className="contact-street-address"><MapPin/>{mapAddress}</address>}<p>Superior Plus Painting services homes and businesses across Melbourne’s eastern and south-eastern suburbs from our Chadstone location.</p>{mapUrl&&<a className="btn" href={mapUrl} target="_blank" rel="noreferrer">View address in Google Maps <ExternalLink size={17}/></a>}</Reveal>{mapEmbedUrl&&<Reveal className="contact-map" delay={.1}><iframe src={mapEmbedUrl} title={`Superior Plus Painting at ${mapAddress}`} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></Reveal>}</div></section>}
    <TestimonialBand index={2}/><AreasBand/>
  </PageLayout>
}
