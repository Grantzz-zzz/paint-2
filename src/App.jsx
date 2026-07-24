import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, Brush, Building2, Check, ChevronLeft, ChevronRight,
  ChevronDown, Clock3, Hammer, HeartHandshake, Home, Instagram, Mail, MapPin, Menu, PaintRoller,
  Palette, Phone, ShieldCheck, Sparkles, SprayCan, Star, Trees, Warehouse, X
} from 'lucide-react'
import { serviceList } from './data/siteData'
import { asset, publicRouteUrl, siteUrl } from './utils/assets'
import { mediaUrl, pairItems, textItems, toAppPath, useCollection, useEnquirySubmission, useRouteContent, useSiteContent } from './content/ContentProvider'

gsap.registerPlugin(ScrollTrigger)

const nav = [
  ['/', 'Home'], ['/services', 'Services'], ['/about', 'About'],
  ['/our-process', 'Our Process'], ['/faqs', 'FAQs'], ['/contact', 'Contact']
]

const services = [
  { icon: Home, title: 'Residential painting', text: 'Thoughtful interior and exterior finishes that make home feel new again.', tone: 'maroon' },
  { icon: Building2, title: 'Commercial painting', text: 'Flexible, low-disruption painting for offices, retail, strata and more.', tone: 'green' },
  { icon: PaintRoller, title: 'Interior & exterior', text: 'Detailed preparation and durable finishes, inside and out.', tone: 'gold' },
  { icon: Sparkles, title: 'Roof restoration', text: 'Clean, repair, seal and coat for stronger weather protection.', tone: 'teal' },
  { icon: Trees, title: 'Decks & fences', text: 'Stains and coatings designed to stand up to Melbourne weather.', tone: 'terracotta' },
  { icon: Palette, title: 'Colour consultation', text: 'Clear, confident colour choices that work with your architecture.', tone: 'navy' },
  { icon: SprayCan, title: 'Spray painting', text: 'Smooth, modern finishes for cabinetry, doors and detailed surfaces.', tone: 'green' },
  { icon: Hammer, title: 'Carpentry & repairs', text: 'Plaster, weatherboard and light timber repairs before we paint.', tone: 'maroon' },
]

const process = [
  ['01', 'Inspect & quote'], ['02', 'Plan & schedule'], ['03', 'Prep & prime'],
  ['04', 'Paint & perfect'], ['05', 'Final walkthrough']
]

const trust = [
  { icon: ShieldCheck, title: 'Fully insured', text: 'Your property and peace of mind are protected.' },
  { icon: BadgeCheck, title: 'Premium materials', text: 'Proven Australian paint systems for lasting results.' },
  { icon: Clock3, title: 'On time, every time', text: 'Clear schedules, prompt arrivals and no loose ends.' },
  { icon: HeartHandshake, title: 'Respectfully clean', text: 'Careful protection, tidy sites and a spotless handover.' },
]

const projects = [
  { title: 'Warm modern interior', type: 'Interior project · Melbourne', image: asset('client/projects/interior/interior-04.webp'), pos: 'center', color: '#f3c51d' },
  { title: 'Exterior transformation', type: 'Residential project · Melbourne', image: asset('client/projects/exterior/exterior-07.webp'), pos: 'center', color: '#8f2824' },
  { title: 'Commercial precision', type: 'Commercial project · Melbourne', image: asset('client/projects/commercial/commercial-02.webp'), pos: 'center', color: '#1f5140' },
]

const testimonials = [
  { quote: 'I’m truly amazed by their quality of work and dedication. The painters were courteous, friendly and completed outstanding paintwork in a short time.', name: 'John', project: 'Residential painting' },
  { quote: 'They painted the exterior of our house and did an amazing job. The team arrived on time every morning. We’re very happy and would definitely use them again.', name: 'Jenny', project: 'Exterior repaint' },
  { quote: 'Afshin and his team transformed my office with incredible paintwork. The space looks as good as new.', name: 'Philip', project: 'Commercial painting' },
]

const suburbs = ['Chadstone', 'Mount Waverley', 'Glen Waverley', 'Oakleigh', 'Mulgrave', 'Clayton', 'Dandenong', 'Springvale', 'Keysborough', 'Berwick', 'Narre Warren', 'Endeavour Hills']

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function Reveal({ children, className = '', delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .65, delay, ease: [.2,.8,.2,1] }}>{children}</motion.div>
}

function Eyebrow({ children, light = false }) {
  return <div className={`eyebrow ${light ? 'text-white/75' : 'text-maroon'}`}><span className="eyebrow-line" />{children}</div>
}

function Divider({ color = '#fff', variant = 'wave' }) {
  const paths = {
    wave: 'M0 42 C180 2 350 78 560 32 C790 -16 1010 68 1200 24 L1200 90 L0 90Z',
    drip: 'M0 8 H180 C210 8 210 48 239 48 C271 48 271 13 305 13 H520 C545 13 545 72 574 72 C602 72 602 17 638 17 H820 C852 17 852 54 884 54 C916 54 916 9 950 9 H1200 V90 H0Z',
    slash: 'M0 48 L1200 0 V90 H0Z'
  }
  return <svg className="section-divider" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true"><path className="divider-path" fill={color} d={paths[variant]} /></svg>
}

function Logo({ dark = false }) {
  const navigate = useNavigate()
  const {business}=useSiteContent()
  return <button onClick={() => navigate('/')} className="logo-wrap" aria-label="Go to home page"><img src={mediaUrl(business.logo,asset('logo.jpeg'))} alt={business.logo?.alt||business.name} /><span className={dark ? 'text-white' : 'text-ink'}><b>Superior Plus</b><small>Painting & Remodeling</small></span></button>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {business,navigation,services:cmsServices}=useSiteContent()
  const navItems=(navigation?.length?navigation:nav.map(([url,label],index)=>({id:index,label,url,children:[]}))).map(item=>({...item,path:toAppPath(item.url)}))
  const displayedServices=cmsServices?.length?cmsServices:serviceList
  const go = (path) => { navigate(path); setOpen(false); setServicesOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleMobileMenu = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    setServicesOpen(nextOpen)
  }
  return <header className="nav-shell">
    <nav className="nav-inner">
      <Logo />
      <div className="nav-links">
        {navItems.map(item => item.path === '/services' ? <div className="nav-dropdown" key={item.id} onMouseEnter={()=>setServicesOpen(true)} onMouseLeave={()=>setServicesOpen(false)}>
          <button className={`nav-main-link ${location.pathname.startsWith('/services') ? 'active' : ''}`} onClick={() => go(item.path)}>{item.label}</button>
          <button className="dropdown-trigger" onClick={()=>setServicesOpen(value=>!value)} aria-label="Show service pages" aria-expanded={servicesOpen} aria-controls="desktop-services-menu"><ChevronDown size={14}/></button>
          <AnimatePresence>{servicesOpen&&<motion.div id="desktop-services-menu" className="services-dropdown" role="navigation" aria-label="Service pages" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.16}}>
            <button className="services-overview" onClick={()=>go('/services')}><span><b>All services</b><small>View the complete service directory</small></span><ArrowRight size={17}/></button>
            <div className="services-dropdown-grid">{displayedServices.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(service.url||`/services/${service.slug}`)}><b>{service.title}</b><ArrowRight size={14}/></button>)}</div>
          </motion.div>}</AnimatePresence>
        </div> : <button key={item.id} className={`nav-main-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => go(item.path)}>{item.label}</button>)}
      </div>
      <div className="nav-actions"><a href={business.phone_href}><Phone size={15} /> {business.phone_display}</a><button className="btn btn-small" onClick={() => go('/contact')}>Free quote <ArrowRight size={15} /></button></div>
      <button className="menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
      {navItems.map(item => item.path === '/services' ? <div className={`mobile-services ${servicesOpen?'open':''}`} key={item.id}>
        <div className="mobile-services-head"><button onClick={()=>go(item.path)}>{item.label}</button><button onClick={()=>setServicesOpen(value=>!value)} aria-label="Toggle service pages" aria-expanded={servicesOpen} aria-controls="mobile-services-menu"><ChevronDown size={18}/></button></div>
        <AnimatePresence>{servicesOpen&&<motion.div id="mobile-services-menu" className="mobile-services-pages" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
          {displayedServices.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(service.url||`/services/${service.slug}`)}>{service.title}<ArrowRight size={14}/></button>)}
        </motion.div>}</AnimatePresence>
      </div> : <button key={item.id} onClick={() => go(item.path)}>{item.label}<ArrowRight size={16}/></button>)}
      <a className="btn" href={business.phone_href}><Phone size={17}/> {business.phone_display}</a>
    </motion.div>}</AnimatePresence>
  </header>
}

function Hero({hero,fields}) {
  const navigate = useNavigate()
  const image=mediaUrl(hero?.image,asset('hero-painter.png'))
  const trustPoints=textItems(fields?.home_trust_points,['Fully insured','Free colour advice','Melbourne-wide'])
  return <section id="home" className="hero section-track">
    <div className="hero-bg"><img src={image} alt={hero?.image?.alt||'Professional painter applying a deep red finish in a modern Melbourne home'} loading="eager" decoding="async" fetchPriority="high" /></div>
    <div className="paint-ribbon ribbon-green"/><div className="paint-ribbon ribbon-gold"/>
    <div className="container hero-content">
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.8 }} className="hero-copy">
        <Eyebrow>{hero?.eyebrow||'Melbourne painters who care'}</Eyebrow>
        <h1>{hero?.title||'Made to feel'}<br/><em>{hero?.accent||'beautiful.'}</em><br/>Made to last.</h1>
        <p>{hero?.intro||'Premium residential and commercial painting, delivered with careful preparation, honest advice and a finish we’re proud to put our name on.'}</p>
        <div className="hero-buttons"><button className="btn" onClick={() => navigate('/contact')}>Get a free quote <ArrowRight size={18}/></button><button className="text-link" onClick={() => scrollTo('projects')}>See our work <span>↘</span></button></div>
        <div className="hero-trust">{trustPoints.map(item=><span key={item}><Check/> {item}</span>)}</div>
      </motion.div>
    </div>
    <div className="hero-stamp"><span>Quality finish</span><b>100%</b><small>Every detail</small></div>
    <Divider color="#fff" variant="wave" />
  </section>
}

function Services({fields,serviceItems}) {
  const selectedIds=Array.isArray(fields?.home_service_ids)?fields.home_service_ids.map(String):[]
  const selected=selectedIds.length?serviceItems.filter(item=>selectedIds.includes(String(item.id))):[]
  const cards=selected.length?selected.map((item,index)=>({
    ...item,
    icon:services[index%services.length].icon,
    text:item.short,
    tone:item.tone||services[index%services.length].tone,
  })):services
  return <section id="services" className="section section-track services-section">
    <div className="container">
      <Reveal className="section-heading"><div><Eyebrow>{fields?.home_services_eyebrow||'What we paint'}</Eyebrow><h2>{fields?.home_services_title||'Every surface deserves'}<br/><em>{fields?.home_services_accent||'the right finish.'}</em></h2></div><p>{fields?.home_services_intro||'From one carefully refreshed room to a complete commercial transformation, our experienced team brings the same care to every job.'}</p></Reveal>
      <div className="services-grid">{cards.map((service, i) => { const Icon=service.icon; return <Reveal key={service.slug||service.title} delay={(i%4)*.06}><article className={`service-card tone-${service.tone}`}><span className="service-num">{String(i+1).padStart(2,'0')}</span><Icon/><h3>{service.title}</h3><p>{service.text}</p><span className="card-arrow">↗</span></article></Reveal>})}</div>
    </div>
    <Divider color="#1f5140" variant="slash" />
  </section>
}

function Commercial({fields}) {
  return <section id="commercial" className="commercial section-track">
    <div className="texture"/><div className="container">
      <div className="commercial-top"><Reveal><Eyebrow light>Commercial specialists</Eyebrow><h2>{fields?.home_commercial_title||'We keep your business'}<br/><em>{fields?.home_commercial_accent||'looking its best.'}</em></h2></Reveal><Reveal delay={.15}><p>{fields?.home_commercial_text||'Professional finishes, clear communication and scheduling built around your operation—from a single office to multi-site projects.'}</p><div className="business-tags">{['Offices','Retail','Warehouses','Medical','Education','Hospitality','Strata'].map(x=><span key={x}>{x}</span>)}</div></Reveal></div>
      <Reveal className="process-wrap"><div className="process-label"><span>Our process</span><p>Simple, transparent, stress-free.</p></div><div className="process-grid">{process.map(([n,title],i)=><div className="process-step" key={n}><b>{n}</b><span>{title}</span>{i<4&&<i/>}</div>)}</div></Reveal>
    </div>
    <Divider color="#fbf6ec" variant="drip" />
  </section>
}

function Projects({fields,projectItems}) {
  const selectedIds=Array.isArray(fields?.home_project_ids)?fields.home_project_ids.map(String):[]
  const selected=selectedIds.length?projectItems.filter(item=>selectedIds.includes(String(item.id))):[]
  const cards=selected.length?selected.slice(0,3).map((project,index)=>({
    title:project.title,
    type:project.project_type||'Superior Plus project · Melbourne',
    image:mediaUrl(project.featured_media,projects[index%projects.length].image),
    pos:project.object_position||'50% 50%',
    color:projects[index%projects.length].color,
  })):projects
  return <section id="projects" className="section cream section-track">
    <div className="container">
      <Reveal className="section-heading"><div><Eyebrow>Selected work</Eyebrow><h2>Colour changes<br/><em>everything.</em></h2></div><p>Explore the care behind every edge, every surface and every final coat. Hover a project to reveal the colour beneath.</p></Reveal>
      <div className="projects-grid">{cards.map((project,i)=><Reveal key={project.title} delay={i*.1} className={`project project-${i+1}`}><div className="splash" style={{background:project.color}}/><div className="project-image"><img src={project.image} style={{objectPosition:project.pos}} alt={project.title}/><div className="project-wipe" style={{background:project.color}}/></div><div className="project-meta"><div><h3>{project.title}</h3><p>{project.type}</p></div><span>↗</span></div></Reveal>)}</div>
    </div>
    <Divider color="#fff" variant="wave" />
  </section>
}

function WhyUs({fields,business}) {
  const trustPairs=pairItems(fields?.home_trust_cards,trust.map(item=>[item.title,item.text]))
  const cards=trustPairs.map(([title,text],index)=>({title,text,icon:trust[index%trust.length].icon}))
  return <section id="about" className="section section-track why-section">
    <div className="container why-layout">
      <Reveal className="why-copy"><Eyebrow>The Superior difference</Eyebrow><h2>{fields?.home_why_title||'Good painting starts'}<br/><em>{fields?.home_why_accent||'before the first coat.'}</em></h2><p>{fields?.home_why_text||'We listen, prepare properly and communicate clearly. It’s how we deliver polished, durable work—without turning your home or workplace upside down.'}</p><a href={business.phone_href} className="text-link">Talk to our team <span>↗</span></a></Reveal>
      <div className="trust-grid">{cards.map(({icon:Icon,title,text},i)=><Reveal key={title} delay={i*.08}><article><span><Icon/></span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
    </div>
  </section>
}

function Areas({fields,serviceAreas}) {
  return <section className="areas"><div className="container areas-layout"><Reveal><Eyebrow light>Melbourne-wide</Eyebrow><h2>{fields?.home_areas_title||'Your local painting team,'}<br/><em>wherever you are.</em></h2><p>{fields?.home_areas_text||'Based in Melbourne and proudly servicing homes and businesses across the south-east and surrounding suburbs.'}</p></Reveal><Reveal className="suburb-cloud" delay={.15}>{serviceAreas.map((s,i)=><span className={`chip chip-${i%4}`} key={s}><MapPin size={13}/>{s}</span>)}</Reveal></div><Divider color="#fff" variant="slash" /></section>
}

function Testimonials({fields,items}) {
  const [index,setIndex]=useState(0)
  const selectedIds=Array.isArray(fields?.home_testimonial_ids)?fields.home_testimonial_ids.map(String):[]
  const displayed=selectedIds.length?items.filter(item=>selectedIds.includes(String(item.id))):testimonials
  const safeItems=displayed.length?displayed:testimonials
  const item=safeItems[index%safeItems.length]
  return <section className="section testimonials"><div className="container testimonial-layout"><Reveal><Eyebrow>Kind words</Eyebrow><h2>Loved by<br/><em>Melbourne locals.</em></h2><div className="slider-controls"><button onClick={()=>setIndex((index-1+safeItems.length)%safeItems.length)} aria-label="Previous review"><ChevronLeft/></button><span>{String(index%safeItems.length+1).padStart(2,'0')} / {String(safeItems.length).padStart(2,'0')}</span><button onClick={()=>setIndex((index+1)%safeItems.length)} aria-label="Next review"><ChevronRight/></button></div></Reveal><div className="quote-card"><div className="stars">{Array.from({length:item.rating||5},(_,x)=><Star key={x} fill="currentColor"/>)}</div><AnimatePresence mode="wait"><motion.div key={index} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}}><blockquote>“{item.quote}”</blockquote><div className="quote-by"><b>{item.name||item.label}</b><span>{item.project||item.label}</span></div></motion.div></AnimatePresence></div></div></section>
}

function Contact({fields,business}) {
  const enquiry=useEnquirySubmission()
  return <section id="contact" className="contact section-track"><div className="contact-blob"/><div className="container contact-layout"><Reveal className="contact-copy"><Eyebrow light>Let’s talk colour</Eyebrow><h2>{fields?.home_quote_title||'Ready for a'}<br/><em>fresh start?</em></h2><p>{fields?.home_quote_text||'Tell us what you’re planning. We’ll arrange a free, no-obligation quote and help you choose the right way forward.'}</p><div className="contact-direct"><a href={business.phone_href}><span><Phone/></span><div><small>Call us</small><b>{business.phone_display}</b></div></a><a href={`mailto:${business.email}`}><span><Mail/></span><div><small>Email us</small><b>{business.email}</b></div></a></div></Reveal><Reveal delay={.15}><form className="quote-form" onSubmit={enquiry.submit} aria-busy={enquiry.pending}>{enquiry.sent ? <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="form-success"><span><Check/></span><h3>Thanks — we’ll be in touch.</h3><p>Your enquiry was delivered successfully. Our team will review the details and contact you.</p><button type="button" className="text-link" onClick={enquiry.reset}>Send another enquiry</button></motion.div> : <><div className="form-title"><span>Free quote request</span><small>{fields?.home_response_label||'Usually replies within 2 hours'}</small></div><input className="spp-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true"/><input type="hidden" name="source" value="homepage"/><div className="form-row"><label>Name<input name="name" required autoComplete="name" placeholder="Your name"/></label><label>Phone<input name="phone" required type="tel" autoComplete="tel" placeholder="04xx xxx xxx"/></label></div><div className="form-row"><label>Email<input name="email" required type="email" autoComplete="email" placeholder="you@email.com"/></label><label>Suburb<input name="suburb" required autoComplete="address-level2" placeholder="Your suburb"/></label></div><label>Tell us about your project<textarea name="details" required minLength="10" rows="4" placeholder="What would you like painted?"/></label>{enquiry.privacyText&&<label className="form-consent"><input name="consent" value="yes" type="checkbox" required/><span>{enquiry.privacyText}</span></label>}{enquiry.error&&<p className="form-error" role="alert">{enquiry.error}</p>}<button className="btn btn-wide" type="submit" disabled={enquiry.pending}>{enquiry.pending?'Sending…':<>Request my free quote <ArrowRight/></>}</button><p className="form-note"><ShieldCheck/> No obligation. Your details stay private.</p></>}</form></Reveal></div></section>
}

function Footer() {
  const navigate = useNavigate()
  const {business,footer,navigation,services:cmsServices}=useSiteContent()
  const go = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const explore=(navigation?.length?navigation:nav.map(([url,label],id)=>({id,label,url}))).filter(item=>toAppPath(item.url)!=='/').slice(0,5)
  return <footer><div className="container footer-grid"><div><Logo dark/><p>{footer.intro}</p></div><div><h4>{footer.columns?.[0]?.heading||'Explore'}</h4>{explore.map(item=><button key={item.id} onClick={()=>go(toAppPath(item.url))}>{item.label}</button>)}</div><div><h4>{footer.columns?.[1]?.heading||'Services'}</h4>{cmsServices.slice(0,4).map(service=><button key={service.slug} onClick={()=>go(service.url||`/services/${service.slug}`)}>{service.title}</button>)}</div><div><h4>{footer.columns?.[2]?.heading||'Get in touch'}</h4><a href={business.phone_href}>{business.phone_display}</a><a href={`mailto:${business.email}`}>{business.email}</a><span>{business.location}</span>{business.instagram_url&&<a href={business.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19}/></a>}</div></div><div className="container footer-bottom"><span>{footer.copyright}</span><span>{footer.closing_line}</span></div></footer>
}

export default function App() {
  const {business,services:cmsServices,service_areas:serviceAreas}=useSiteContent()
  const {data:homeRoute}=useRouteContent('/')
  const {data:projectItems}=useCollection('projects',projects)
  const {data:testimonialItems}=useCollection('testimonials',testimonials)
  const fields=homeRoute?.content?.fields||{}
  const seo=homeRoute?.seo
  const homeHero=homeRoute?{
    eyebrow:fields.eyebrow,
    title:fields.hero_title,
    accent:fields.accent,
    intro:fields.hero_intro,
    image:fields.hero_image||homeRoute.hero?.image,
  }:null
  useEffect(()=>{
    const description=seo?.description||'Premium residential and commercial painting across Melbourne, delivered with careful preparation, honest advice and quality workmanship.'
    const canonical=publicRouteUrl('/')
    const title=seo?.title||'Superior Plus Painting | Melbourne Painters'
    document.title=title
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=description
    const link=document.querySelector('link[rel="canonical"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'canonical'}));link.href=canonical
    ;[['og:title',title],['og:description',description],['og:url',canonical]].forEach(([property,content])=>{let tag=document.querySelector(`meta[property="${property}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute('property',property);document.head.appendChild(tag)}tag.content=content})
    let schema=document.getElementById('page-structured-data');if(!schema){schema=document.createElement('script');schema.id='page-structured-data';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name:business.name,url:canonical,telephone:business.phone_href.replace('tel:',''),email:business.email,areaServed:business.location})
    const ctx=gsap.context(()=>{gsap.utils.toArray('.divider-path').forEach(path=>gsap.fromTo(path,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:path,start:'top 92%'}}))})
    return()=>ctx.revert()
  },[seo?.description,seo?.canonical_url,seo?.title,business])
  return <><Navbar/><main id="main-content" tabIndex="-1"><Hero hero={homeHero} fields={fields}/><Services fields={fields} serviceItems={cmsServices}/><Commercial fields={fields}/><Projects fields={fields} projectItems={projectItems}/><WhyUs fields={fields} business={business}/><Areas fields={fields} serviceAreas={serviceAreas?.length?serviceAreas:suburbs}/><Testimonials fields={fields} items={testimonialItems}/><Contact fields={fields} business={business}/></main><Footer/></>
}

export { Navbar, Footer, Reveal, Eyebrow, Divider }
