import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Hammer, Mail, PaintRoller, Palette, Phone, ShieldCheck, SprayCan, Trees } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA, QualityGrid } from '../components/PageLayout'
import { Reveal, Divider } from '../App'
import { faqs, masterProcess, serviceList, suburbs } from '../data/siteData'
import { brandArchive } from '../data/projectMedia'
import { asset } from '../utils/assets'
import { collectionFallbacks, mediaUrl, mergeContent, pairItems, textItems, useCollection, useRouteContent, useSiteContent } from '../content/ContentProvider'

const images = {
  about: asset('client/projects/fence/fence-03.webp'),
  services: asset('client/projects/commercial/commercial-02.webp'),
  process: asset('client/projects/commercial/commercial-06.webp'),
  faq: asset('client/projects/interior/interior-04.webp'),
  contact: asset('client/projects/exterior/exterior-07.webp'),
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

export function ServicesPage() {
  const navigate=useNavigate()
  const {services}=useSiteContent()
  const fallbackHero={eyebrow:'Everything under one careful eye',title:'Painting & property services',accent:'made beautifully simple.',intro:'From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place.',image:images.services,tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/services',fallbackHero)
  const fallbackExtras=[['Wallpaper removal','Adhesive removal and wall preparation for a smooth paint-ready finish.'],['Carpentry services','Suitable repairs or replacement for damaged trims, frames, weatherboards and timber details.'],['Caulking & gap sealing','Neat sealing around windows, doors, skirtings and suitable interior or exterior joints.'],['Tiling services','Tiling support for suitable residential and commercial improvement projects.'],['Timber restoration','Preparation and restoration for decks, fences, pergolas and weatherboards.'],['Surface preparation','Pressure washing, sanding, scraping, filling and priming.'],['Property maintenance','Ongoing support to keep residential and commercial properties in excellent condition.']]
  const extras=pairItems(fields.additional_services,fallbackExtras)
  return <PageLayout title={seo?.title||'Painting & Property Services'} description={seo?.description||'Explore Superior Plus Painting’s complete painting, preparation, repair and property improvement services across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="CollectionPage">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Core painting services" title="Choose your surface." accent="We’ll handle the finish." text={fields.services_intro||'Explore our dedicated service pages for detailed scope, process and preparation information.'}/><div className="service-directory">{services.map((s,i)=><Reveal key={s.slug} delay={(i%3)*.05}><button className={`directory-card tone-${s.tone||serviceList[i%serviceList.length].tone}`} onClick={()=>navigate(s.url||`/services/${s.slug}`)}><span>{String(i+1).padStart(2,'0')}</span><h3>{s.title}</h3><p>{s.short}</p><ArrowRight/></button></Reveal>)}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="More ways we can help" title="Preparation, repairs" accent="and property care." text="These complementary services make renovation and maintenance projects easier to coordinate."/><div className="extras-grid">{extras.map(([title,text],i)=><Reveal key={title} delay={(i%4)*.05}><article><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></div></section>
    <ClosingCTA title={cta?.title||'Not sure which service you need?'} text={cta?.text||'Tell us what you can see and what you want to change. We’ll recommend the right preparation and finish during your free consultation.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function AboutPage() {
  const fallbackHero={eyebrow:'Your trusted Melbourne painters',title:'Care in every coat.',accent:'Pride in every detail.',intro:'Superior Plus Painting is a Melbourne-based team dedicated to high-quality residential and commercial painting with reliable service, honest communication and respect for every property.',image:images.about,tone:'green'}
  const {fields,hero,seo,cta}=usePageContent('/about',fallbackHero)
  const fallbackApproach=['From small residential touch-ups to complete home repaints and large commercial projects, we approach every job with professionalism, honesty and pride. We inspect and prepare each surface, protect surrounding areas and use professional application techniques for a smooth, durable finish.','We understand that your property is one of your most valuable investments. That is why clear communication, reliable scheduling and a clean handover matter just as much as the paint itself.']
  const approach=fields.about_approach_copy?fields.about_approach_copy.split(/\n\s*\n/).filter(Boolean):fallbackApproach
  const standards=textItems(fields.about_standards,['Experienced, professional painters','High-quality workmanship','Attention to every detail','Reliable communication','Clean and tidy sites','Competitive, transparent pricing','Fully insured','Free, no-obligation quotes'])
  const editorialImage=mediaUrl(fields.about_editorial_image,images.about)
  const archiveImage=mediaUrl(fields.about_archive_image,brandArchive)
  return <PageLayout title={seo?.title||'About Us'} description={seo?.description||'Meet Superior Plus Painting, Melbourne painting professionals committed to careful preparation, reliable service and quality workmanship.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="AboutPage">
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow="Our approach" title={fields.about_approach_title||'Quality begins'} accent="before the first coat."/>{approach.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</Reveal><Reveal className="editorial-image" delay={.1}><img src={editorialImage} alt={fields.about_editorial_image?.alt||'Superior Plus painter spray painting a residential fence'} loading="lazy" decoding="async"/><span>Superior Plus project</span></Reveal></div></section>
    <section className="inner-section cream"><div className="container brand-archive"><Reveal><img src={archiveImage} alt={fields.about_archive_image?.alt||'Superior Plus Painting original promotional artwork'} loading="lazy" decoding="async"/></Reveal><Reveal delay={.1}><SectionIntro eyebrow="Our local roots" title="Built through" accent="hands-on service."/><p>{fields.about_roots_copy||'Superior Plus has grown through practical local promotion, direct client relationships and work that can be seen across Melbourne homes and businesses.'}</p><small>Original client-supplied promotional artwork retained as part of the company archive.</small></Reveal></div></section>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Why Superior Plus" title="Standards you can see." accent="Service you can feel."/><QualityGrid items={standards}/></div></section>
    <TestimonialBand index={0}/><AreasBand/><ClosingCTA title={cta?.title} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ProcessPage() {
  const fallbackHero={eyebrow:'A proven path to a better finish',title:'Our painting process',accent:'planned down to the detail.',intro:'Outstanding painting starts with careful planning, detailed preparation and clear communication. Our six-step process keeps every residential and commercial project organised from quote to handover.',image:images.process,tone:'gold'}
  const {fields,hero,seo,cta}=usePageContent('/our-process',fallbackHero)
  const steps=pairItems(fields.master_process,masterProcess.map(item=>[item.title,item.text])).map(([title,text])=>({title,text}))
  const proof=textItems(fields.process_proof,['Clear communication','Thorough preparation','High-quality workmanship','Respect for your property','Reliable scheduling','Attention to detail'])
  return <PageLayout title={seo?.title||'Our Painting Process'} description={seo?.description||'Discover Superior Plus Painting’s six-step process for careful preparation, premium application and a clean final handover.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="HowTo" schemaData={{step:steps.map((item,index)=>({'@type':'HowToStep',position:index+1,name:item.title,text:item.text}))}}>
    <PageHero {...hero}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Six considered steps" title="Simple for you." accent="Meticulous from us."/><div className="master-process">{steps.map((step,i)=><Reveal key={step.title} delay={i*.05}><article><b>{String(i+1).padStart(2,'0')}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article></Reveal>)}</div></div></section>
    <section className="process-proof"><div className="container"><SectionIntro eyebrow="Why it works" title="Preparation protects" accent="the final result." light/><QualityGrid items={proof}/></div><Divider color="#fff" variant="drip"/></section>
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
  return <PageLayout title={seo?.title||'Frequently Asked Questions'} description={seo?.description||'Answers about quotes, service areas, preparation, timing, paint systems and booking with Superior Plus Painting.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="FAQPage" schemaData={{mainEntity:items.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}}>
    <PageHero {...hero} intro={fields.faq_intro||hero.intro}/>
    <section className="inner-section"><div className="container faq-layout"><SectionIntro eyebrow="What clients ask us" title="Everything you need" accent="to move forward."/><div className="faq-list">{items.map((item,i)=><div className={`faq-item ${open===i?'open':''}`} key={item.id||item.question}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,'0')}</span><b>{item.question}</b><ChevronDown/></button>{open===i&&<div className="faq-answer" dangerouslySetInnerHTML={{__html:item.answer}}/>}</div>)}</div></div></section>
    <ClosingCTA title={cta?.title||'Still have a question?'} text={cta?.text||'Call our team or send an enquiry. We’ll talk through your property, surfaces and preferred timing before arranging a quote.'} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ContactPage() {
  const [sent,setSent]=useState(false)
  const {business}=useSiteContent()
  const fallbackHero={eyebrow:'Tell us what you’re planning',title:'Get in touch',accent:'and get a fresh start.',intro:'Share a few details about your property and the work you have in mind. We’ll follow up to arrange a free, no-obligation consultation and written quote.',image:images.contact,tone:'green'}
  const {fields,hero,seo}=usePageContent('/contact',fallbackHero)
  const serviceOptions=textItems(fields.service_options,['Residential Painting','Commercial Painting','Interior Painting','Exterior Painting','Roof Painting','Fence Painting','Deck Painting & Staining','Garage Floor Coatings','Driveway Painting & Coatings','Plaster Repairs','Wallpaper Removal','Other'])
  const propertyOptions=textItems(fields.property_options,['House','Unit','Apartment','Townhouse','Office','Retail','Warehouse','Other'])
  const steps=pairItems(fields.contact_steps,[['We review your enquiry.','We’ll confirm the service, property and best way to reach you.'],['We arrange an inspection.','Our team assesses the surfaces and discusses colours, finishes and timing.'],['You receive a written quote.','Clear scope, preparation and pricing—with no obligation to proceed.']])
  return <PageLayout title={seo?.title||'Get a Free Quote'} description={seo?.description||'Contact Superior Plus Painting for a free residential, commercial or property-painting quote across Melbourne.'} image={mediaUrl(seo?.social_image,hero.image)} pageType="ContactPage">
    <PageHero {...hero}/>
    <section className="quote-page"><div className="container quote-page-grid"><Reveal className="quote-side"><ShieldCheck/><h2>What happens next?</h2><ol>{steps.map(([title,text])=><li key={title}><b>{title}</b><span>{text}</span></li>)}</ol><a href={business.phone_href}><Phone/>{business.phone_display}</a><a href={`mailto:${business.email}`}><Mail/>{business.email}</a></Reveal><Reveal delay={.1}><form className="full-quote-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="form-success"><span><Check/></span><h3>Thanks — your project is ready for review.</h3><p>This is the designed success state. The form still needs to be connected to the chosen email or CRM service.</p><button type="button" className="text-link" onClick={()=>setSent(false)}>Send another enquiry</button></div>:<><div className="form-heading"><span>Free quote request</span><small>* Required information</small></div><div className="form-row"><label>Name *<input required placeholder="Your name"/></label><label>Phone number *<input required type="tel" placeholder="04xx xxx xxx"/></label></div><div className="form-row"><label>Email address *<input required type="email" placeholder="you@email.com"/></label><label>Suburb *<input required placeholder="Your suburb"/></label></div><label>Property address<input placeholder="Street address"/></label><div className="form-row"><label>Service required *<select required defaultValue=""><option value="" disabled>Select a service</option>{serviceOptions.map(s=><option key={s}>{s}</option>)}</select></label><label>Property type<select defaultValue={propertyOptions[0]}>{propertyOptions.map(option=><option key={option}>{option}</option>)}</select></label></div><label>Project details *<textarea required rows="5" placeholder="What would you like painted or repaired?"/></label><button className="btn btn-wide">Request my free quote<ArrowRight/></button><p className="form-note"><ShieldCheck/>{fields.contact_form_note||'No obligation. Form delivery and privacy consent must be connected before launch.'}</p></>}</form></Reveal></div></section>
    <TestimonialBand index={2}/><AreasBand/>
  </PageLayout>
}
