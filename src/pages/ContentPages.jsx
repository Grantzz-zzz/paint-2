import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, Hammer, Mail, PaintRoller, Palette, Phone, ShieldCheck, SprayCan, Trees } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA, QualityGrid } from '../components/PageLayout'
import { Reveal, Divider } from '../App'
import { faqs, masterProcess, serviceList, suburbs } from '../data/siteData'

const images = {
  about: './assets/stock/about.webp',
  services: './assets/stock/services.webp',
  process: './assets/stock/process.webp',
  faq: './assets/stock/faq.webp',
  contact: './assets/stock/contact.webp',
}

export function ServicesPage() {
  const navigate=useNavigate()
  const extras=[['Wallpaper removal','Adhesive removal and wall preparation for a smooth paint-ready finish.'],['Carpentry services','Suitable repairs or replacement for damaged trims, frames, weatherboards and timber details.'],['Caulking & gap sealing','Neat sealing around windows, doors, skirtings and suitable interior or exterior joints.'],['Tiling services','Tiling support for suitable residential and commercial improvement projects.'],['Timber restoration','Preparation and restoration for decks, fences, pergolas and weatherboards.'],['Surface preparation','Pressure washing, sanding, scraping, filling and priming.'],['Property maintenance','Ongoing support to keep residential and commercial properties in excellent condition.']]
  return <PageLayout title="Painting & Property Services" description="Explore Superior Plus Painting’s complete painting, preparation, repair and property improvement services across Melbourne." image={images.services} pageType="CollectionPage">
    <PageHero eyebrow="Everything under one careful eye" title="Painting & property services" accent="made beautifully simple." intro="From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place." image={images.services} tone="gold"/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Core painting services" title="Choose your surface." accent="We’ll handle the finish." text="Explore our dedicated service pages for detailed scope, process and preparation information."/><div className="service-directory">{serviceList.map((s,i)=><Reveal key={s.slug} delay={(i%3)*.05}><button className={`directory-card tone-${s.tone}`} onClick={()=>navigate(`/services/${s.slug}`)}><span>0{i+1}</span><h3>{s.title}</h3><p>{s.short}</p><ArrowRight/></button></Reveal>)}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="More ways we can help" title="Preparation, repairs" accent="and property care." text="These complementary services make renovation and maintenance projects easier to coordinate."/><div className="extras-grid">{extras.map(([title,text],i)=><Reveal key={title} delay={(i%4)*.05}><article><span>{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></div></section>
    <ClosingCTA title="Not sure which service you need?" text="Tell us what you can see and what you want to change. We’ll recommend the right preparation and finish during your free consultation."/>
  </PageLayout>
}

export function AboutPage() {
  return <PageLayout title="About Us" description="Meet Superior Plus Painting, Melbourne painting professionals committed to careful preparation, reliable service and quality workmanship." image={images.about} pageType="AboutPage">
    <PageHero eyebrow="Your trusted Melbourne painters" title="Care in every coat." accent="Pride in every detail." intro="Superior Plus Painting is a Melbourne-based team dedicated to high-quality residential and commercial painting with reliable service, honest communication and respect for every property." image={images.about} tone="green"/>
    <TrustStrip/>
    <section className="inner-section"><div className="container editorial-grid"><Reveal><SectionIntro eyebrow="Our approach" title="Quality begins" accent="before the first coat."/><p>From small residential touch-ups to complete home repaints and large commercial projects, we approach every job with professionalism, honesty and pride. We inspect and prepare each surface, protect surrounding areas and use professional application techniques for a smooth, durable finish.</p><p>We understand that your property is one of your most valuable investments. That is why clear communication, reliable scheduling and a clean handover matter just as much as the paint itself.</p></Reveal><Reveal className="editorial-image" delay={.1}><img src={images.about} alt="Professional painter at work placeholder" loading="lazy" decoding="async"/><span>Stock image · team photography to come</span></Reveal></div></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow="Why Superior Plus" title="Standards you can see." accent="Service you can feel."/><QualityGrid items={['Experienced, professional painters','High-quality workmanship','Attention to every detail','Reliable communication','Clean and tidy sites','Competitive, transparent pricing','Fully insured','Free, no-obligation quotes']}/></div></section>
    <TestimonialBand index={0}/><AreasBand/><ClosingCTA/>
  </PageLayout>
}

export function ProcessPage() {
  return <PageLayout title="Our Painting Process" description="Discover Superior Plus Painting’s six-step process for careful preparation, premium application and a clean final handover." image={images.process} pageType="HowTo" schemaData={{step:masterProcess.map((item,index)=>({'@type':'HowToStep',position:index+1,name:item.title,text:item.text}))}}>
    <PageHero eyebrow="A proven path to a better finish" title="Our painting process" accent="planned down to the detail." intro="Outstanding painting starts with careful planning, detailed preparation and clear communication. Our six-step process keeps every residential and commercial project organised from quote to handover." image={images.process} tone="gold"/>
    <TrustStrip/>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Six considered steps" title="Simple for you." accent="Meticulous from us."/><div className="master-process">{masterProcess.map((step,i)=><Reveal key={step.title} delay={i*.05}><article><b>{String(i+1).padStart(2,'0')}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article></Reveal>)}</div></div></section>
    <section className="process-proof"><div className="container"><SectionIntro eyebrow="Why it works" title="Preparation protects" accent="the final result." light/><QualityGrid items={['Clear communication','Thorough preparation','High-quality workmanship','Respect for your property','Reliable scheduling','Attention to detail']}/></div><Divider color="#fff" variant="drip"/></section>
    <ClosingCTA title="Ready to start the process?"/>
  </PageLayout>
}

export function FAQsPage() {
  const [open,setOpen]=useState(0)
  return <PageLayout title="Frequently Asked Questions" description="Answers about quotes, service areas, preparation, timing, paint systems and booking with Superior Plus Painting." image={images.faq} pageType="FAQPage" schemaData={{mainEntity:faqs.map(([question,answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))}}>
    <PageHero eyebrow="Straight answers before we start" title="Frequently asked questions" accent="made easy." intro="Painting comes with practical questions. Here are clear answers about quoting, preparation, scheduling, products and what to expect from our team." image={images.faq} tone="cream"/>
    <section className="inner-section"><div className="container faq-layout"><SectionIntro eyebrow="What clients ask us" title="Everything you need" accent="to move forward."/><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${open===i?'open':''}`} key={q}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>0{i+1}</span><b>{q}</b><ChevronDown/></button>{open===i&&<div className="faq-answer"><p>{a}</p></div>}</div>)}</div></div></section>
    <ClosingCTA title="Still have a question?" text="Call our team or send an enquiry. We’ll talk through your property, surfaces and preferred timing before arranging a quote."/>
  </PageLayout>
}

export function ContactPage() {
  const [sent,setSent]=useState(false)
  const services=['Residential Painting','Commercial Painting','Interior Painting','Exterior Painting','Roof Painting','Fence Painting','Deck Painting & Staining','Garage Floor Coatings','Driveway Painting & Coatings','Plaster Repairs','Wallpaper Removal','Other']
  return <PageLayout title="Get a Free Quote" description="Contact Superior Plus Painting for a free residential, commercial or property-painting quote across Melbourne." image={images.contact} pageType="ContactPage">
    <PageHero eyebrow="Tell us what you’re planning" title="Get in touch" accent="and get a fresh start." intro="Share a few details about your property and the work you have in mind. We’ll follow up to arrange a free, no-obligation consultation and written quote." image={images.contact} tone="green"/>
    <section className="quote-page"><div className="container quote-page-grid"><Reveal className="quote-side"><ShieldCheck/><h2>What happens next?</h2><ol><li><b>We review your enquiry.</b><span>We’ll confirm the service, property and best way to reach you.</span></li><li><b>We arrange an inspection.</b><span>Our team assesses the surfaces and discusses colours, finishes and timing.</span></li><li><b>You receive a written quote.</b><span>Clear scope, preparation and pricing—with no obligation to proceed.</span></li></ol><a href="tel:0470234567"><Phone/>0470 234 567</a><a href="mailto:sppainting.remodeling@gmail.com"><Mail/>sppainting.remodeling@gmail.com</a></Reveal><Reveal delay={.1}><form className="full-quote-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="form-success"><span><Check/></span><h3>Thanks — your project is ready for review.</h3><p>This is the designed success state. The form still needs to be connected to the chosen email or CRM service.</p><button type="button" className="text-link" onClick={()=>setSent(false)}>Send another enquiry</button></div>:<><div className="form-heading"><span>Free quote request</span><small>* Required information</small></div><div className="form-row"><label>Name *<input required placeholder="Your name"/></label><label>Phone number *<input required type="tel" placeholder="04xx xxx xxx"/></label></div><div className="form-row"><label>Email address *<input required type="email" placeholder="you@email.com"/></label><label>Suburb *<input required placeholder="Your suburb"/></label></div><label>Property address<input placeholder="Street address"/></label><div className="form-row"><label>Service required *<select required defaultValue=""><option value="" disabled>Select a service</option>{services.map(s=><option key={s}>{s}</option>)}</select></label><label>Property type<select defaultValue="House"><option>House</option><option>Unit</option><option>Apartment</option><option>Townhouse</option><option>Office</option><option>Retail</option><option>Warehouse</option><option>Other</option></select></label></div><label>Project details *<textarea required rows="5" placeholder="What would you like painted or repaired?"/></label><button className="btn btn-wide">Request my free quote<ArrowRight/></button><p className="form-note"><ShieldCheck/>No obligation. Form delivery and privacy consent must be connected before launch.</p></>}</form></Reveal></div></section>
    <TestimonialBand index={2}/><AreasBand/>
  </PageLayout>
}
