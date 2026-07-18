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
  { title: 'Warm modern interior', type: 'Interior project · Melbourne', image: './assets/client/projects/interior/interior-04.webp', pos: 'center', color: '#f3c51d' },
  { title: 'Exterior transformation', type: 'Residential project · Melbourne', image: './assets/client/projects/exterior/exterior-07.webp', pos: 'center', color: '#8f2824' },
  { title: 'Commercial precision', type: 'Commercial project · Melbourne', image: './assets/client/projects/commercial/commercial-02.webp', pos: 'center', color: '#1f5140' },
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
  return <button onClick={() => navigate('/')} className="logo-wrap" aria-label="Go to home page"><img src="./assets/logo.jpeg" alt="Superior Plus Painting & Remodeling" /><span className={dark ? 'text-white' : 'text-ink'}><b>Superior Plus</b><small>Painting & Remodeling</small></span></button>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
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
        {nav.map(([path,label]) => path === '/services' ? <div className="nav-dropdown" key={path} onMouseEnter={()=>setServicesOpen(true)} onMouseLeave={()=>setServicesOpen(false)}>
          <button className={`nav-main-link ${location.pathname.startsWith('/services') ? 'active' : ''}`} onClick={() => go(path)}>Services</button>
          <button className="dropdown-trigger" onClick={()=>setServicesOpen(value=>!value)} aria-label="Show service pages" aria-expanded={servicesOpen} aria-controls="desktop-services-menu"><ChevronDown size={14}/></button>
          <AnimatePresence>{servicesOpen&&<motion.div id="desktop-services-menu" className="services-dropdown" role="navigation" aria-label="Service pages" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.16}}>
            <button className="services-overview" onClick={()=>go('/services')}><span><b>All services</b><small>View the complete service directory</small></span><ArrowRight size={17}/></button>
            <div className="services-dropdown-grid">{serviceList.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(`/services/${service.slug}`)}><b>{service.title}</b><ArrowRight size={14}/></button>)}</div>
          </motion.div>}</AnimatePresence>
        </div> : <button key={path} className={`nav-main-link ${location.pathname === path ? 'active' : ''}`} onClick={() => go(path)}>{label}</button>)}
      </div>
      <div className="nav-actions"><a href="tel:0470234567"><Phone size={15} /> 0470 234 567</a><button className="btn btn-small" onClick={() => go('/contact')}>Free quote <ArrowRight size={15} /></button></div>
      <button className="menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
      {nav.map(([path,label]) => path === '/services' ? <div className={`mobile-services ${servicesOpen?'open':''}`} key={path}>
        <div className="mobile-services-head"><button onClick={()=>go(path)}>Services</button><button onClick={()=>setServicesOpen(value=>!value)} aria-label="Toggle service pages" aria-expanded={servicesOpen} aria-controls="mobile-services-menu"><ChevronDown size={18}/></button></div>
        <AnimatePresence>{servicesOpen&&<motion.div id="mobile-services-menu" className="mobile-services-pages" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
          {serviceList.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(`/services/${service.slug}`)}>{service.title}<ArrowRight size={14}/></button>)}
        </motion.div>}</AnimatePresence>
      </div> : <button key={path} onClick={() => go(path)}>{label}<ArrowRight size={16}/></button>)}
      <a className="btn" href="tel:0470234567"><Phone size={17}/> 0470 234 567</a>
    </motion.div>}</AnimatePresence>
  </header>
}

function Hero() {
  const navigate = useNavigate()
  return <section id="home" className="hero section-track">
    <div className="hero-bg"><img src="./assets/hero-painter.png" alt="Professional painter applying a deep red finish in a modern Melbourne home" loading="eager" decoding="async" fetchPriority="high" /></div>
    <div className="paint-ribbon ribbon-green"/><div className="paint-ribbon ribbon-gold"/>
    <div className="container hero-content">
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.8 }} className="hero-copy">
        <Eyebrow>Melbourne painters who care</Eyebrow>
        <h1>Made to feel<br/><em>beautiful.</em><br/>Made to last.</h1>
        <p>Premium residential and commercial painting, delivered with careful preparation, honest advice and a finish we’re proud to put our name on.</p>
        <div className="hero-buttons"><button className="btn" onClick={() => navigate('/contact')}>Get a free quote <ArrowRight size={18}/></button><button className="text-link" onClick={() => scrollTo('projects')}>See our work <span>↘</span></button></div>
        <div className="hero-trust"><span><Check/> Fully insured</span><span><Check/> Free colour advice</span><span><Check/> Melbourne-wide</span></div>
      </motion.div>
    </div>
    <div className="hero-stamp"><span>Quality finish</span><b>100%</b><small>Every detail</small></div>
    <Divider color="#fff" variant="wave" />
  </section>
}

function Services() {
  return <section id="services" className="section section-track services-section">
    <div className="container">
      <Reveal className="section-heading"><div><Eyebrow>What we paint</Eyebrow><h2>Every surface deserves<br/><em>the right finish.</em></h2></div><p>From one carefully refreshed room to a complete commercial transformation, our experienced team brings the same care to every job.</p></Reveal>
      <div className="services-grid">{services.map((service, i) => { const Icon=service.icon; return <Reveal key={service.title} delay={(i%4)*.06}><article className={`service-card tone-${service.tone}`}><span className="service-num">0{i+1}</span><Icon/><h3>{service.title}</h3><p>{service.text}</p><span className="card-arrow">↗</span></article></Reveal>})}</div>
    </div>
    <Divider color="#1f5140" variant="slash" />
  </section>
}

function Commercial() {
  return <section id="commercial" className="commercial section-track">
    <div className="texture"/><div className="container">
      <div className="commercial-top"><Reveal><Eyebrow light>Commercial specialists</Eyebrow><h2>We keep your business<br/><em>looking its best.</em></h2></Reveal><Reveal delay={.15}><p>Professional finishes, clear communication and scheduling built around your operation—from a single office to multi-site projects.</p><div className="business-tags">{['Offices','Retail','Warehouses','Medical','Education','Hospitality','Strata'].map(x=><span key={x}>{x}</span>)}</div></Reveal></div>
      <Reveal className="process-wrap"><div className="process-label"><span>Our process</span><p>Simple, transparent, stress-free.</p></div><div className="process-grid">{process.map(([n,title],i)=><div className="process-step" key={n}><b>{n}</b><span>{title}</span>{i<4&&<i/>}</div>)}</div></Reveal>
    </div>
    <Divider color="#fbf6ec" variant="drip" />
  </section>
}

function Projects() {
  return <section id="projects" className="section cream section-track">
    <div className="container">
      <Reveal className="section-heading"><div><Eyebrow>Selected work</Eyebrow><h2>Colour changes<br/><em>everything.</em></h2></div><p>Explore the care behind every edge, every surface and every final coat. Hover a project to reveal the colour beneath.</p></Reveal>
      <div className="projects-grid">{projects.map((project,i)=><Reveal key={project.title} delay={i*.1} className={`project project-${i+1}`}><div className="splash" style={{background:project.color}}/><div className="project-image"><img src={project.image} style={{objectPosition:project.pos}} alt={project.title}/><div className="project-wipe" style={{background:project.color}}/></div><div className="project-meta"><div><h3>{project.title}</h3><p>{project.type}</p></div><span>↗</span></div></Reveal>)}</div>
    </div>
    <Divider color="#fff" variant="wave" />
  </section>
}

function WhyUs() {
  return <section id="about" className="section section-track why-section">
    <div className="container why-layout">
      <Reveal className="why-copy"><Eyebrow>The Superior difference</Eyebrow><h2>Good painting starts<br/><em>before the first coat.</em></h2><p>We listen, prepare properly and communicate clearly. It’s how we deliver polished, durable work—without turning your home or workplace upside down.</p><a href="tel:0470234567" className="text-link">Talk to our team <span>↗</span></a></Reveal>
      <div className="trust-grid">{trust.map(({icon:Icon,title,text},i)=><Reveal key={title} delay={i*.08}><article><span><Icon/></span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
    </div>
  </section>
}

function Areas() {
  return <section className="areas"><div className="container areas-layout"><Reveal><Eyebrow light>Melbourne-wide</Eyebrow><h2>Your local painting team,<br/><em>wherever you are.</em></h2><p>Based in Melbourne and proudly servicing homes and businesses across the south-east and surrounding suburbs.</p></Reveal><Reveal className="suburb-cloud" delay={.15}>{suburbs.map((s,i)=><span className={`chip chip-${i%4}`} key={s}><MapPin size={13}/>{s}</span>)}</Reveal></div><Divider color="#fff" variant="slash" /></section>
}

function Testimonials() {
  const [index,setIndex]=useState(0)
  const item=testimonials[index]
  return <section className="section testimonials"><div className="container testimonial-layout"><Reveal><Eyebrow>Kind words</Eyebrow><h2>Loved by<br/><em>Melbourne locals.</em></h2><div className="slider-controls"><button onClick={()=>setIndex((index-1+testimonials.length)%testimonials.length)} aria-label="Previous review"><ChevronLeft/></button><span>{String(index+1).padStart(2,'0')} / {String(testimonials.length).padStart(2,'0')}</span><button onClick={()=>setIndex((index+1)%testimonials.length)} aria-label="Next review"><ChevronRight/></button></div></Reveal><div className="quote-card"><div className="stars">{[1,2,3,4,5].map(x=><Star key={x} fill="currentColor"/>)}</div><AnimatePresence mode="wait"><motion.div key={index} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}}><blockquote>“{item.quote}”</blockquote><div className="quote-by"><b>{item.name}</b><span>{item.project}</span></div></motion.div></AnimatePresence></div></div></section>
}

function Contact() {
  const [sent,setSent]=useState(false)
  return <section id="contact" className="contact section-track"><div className="contact-blob"/><div className="container contact-layout"><Reveal className="contact-copy"><Eyebrow light>Let’s talk colour</Eyebrow><h2>Ready for a<br/><em>fresh start?</em></h2><p>Tell us what you’re planning. We’ll arrange a free, no-obligation quote and help you choose the right way forward.</p><div className="contact-direct"><a href="tel:0470234567"><span><Phone/></span><div><small>Call us</small><b>0470 234 567</b></div></a><a href="mailto:sppainting.remodeling@gmail.com"><span><Mail/></span><div><small>Email us</small><b>sppainting.remodeling@gmail.com</b></div></a></div></Reveal><Reveal delay={.15}><form className="quote-form" onSubmit={(e)=>{e.preventDefault();setSent(true)}}>{sent ? <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="form-success"><span><Check/></span><h3>Thanks — we’ll be in touch.</h3><p>Your project details are ready to send. Connect this form to your preferred email service before launch.</p><button type="button" className="text-link" onClick={()=>setSent(false)}>Send another enquiry</button></motion.div> : <><div className="form-title"><span>Free quote request</span><small>Usually replies within 2 hours</small></div><div className="form-row"><label>Name<input required placeholder="Your name"/></label><label>Phone<input required type="tel" placeholder="04xx xxx xxx"/></label></div><div className="form-row"><label>Email<input required type="email" placeholder="you@email.com"/></label><label>Suburb<input required placeholder="Your suburb"/></label></div><label>Tell us about your project<textarea required rows="4" placeholder="What would you like painted?"/></label><button className="btn btn-wide" type="submit">Request my free quote <ArrowRight/></button><p className="form-note"><ShieldCheck/> No obligation. Your details stay private.</p></>}</form></Reveal></div></section>
}

function Footer() {
  const navigate = useNavigate()
  const go = (path) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return <footer><div className="container footer-grid"><div><Logo dark/><p>Premium residential and commercial painting across Melbourne, with care in every coat.</p></div><div><h4>Explore</h4>{nav.slice(1).map(([path,label])=><button key={path} onClick={()=>go(path)}>{label}</button>)}</div><div><h4>Services</h4><button onClick={()=>go('/services/residential-painting-melbourne')}>Residential painting</button><button onClick={()=>go('/services/commercial-painting-melbourne')}>Commercial painting</button><button onClick={()=>go('/services/roof-painting-melbourne')}>Roof painting</button><button onClick={()=>go('/services/plaster-repairs-melbourne')}>Plaster repairs</button></div><div><h4>Get in touch</h4><a href="tel:0470234567">0470 234 567</a><a href="mailto:sppainting.remodeling@gmail.com">sppainting.remodeling@gmail.com</a><span>Melbourne, Victoria</span><a href="#" aria-label="Instagram"><Instagram size={19}/></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Superior Plus Painting & Remodeling</span><span>Made with care in Melbourne.</span></div></footer>
}

export default function App() {
  useEffect(()=>{
    const description='Premium residential and commercial painting across Melbourne, delivered with careful preparation, honest advice and quality workmanship.'
    const canonical='https://grantzz-zzz.github.io/paint-2/'
    document.title='Superior Plus Painting | Melbourne Painters'
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=description
    const link=document.querySelector('link[rel="canonical"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'canonical'}));link.href=canonical
    ;[['og:title','Superior Plus Painting | Melbourne Painters'],['og:description',description],['og:url',canonical]].forEach(([property,content])=>{let tag=document.querySelector(`meta[property="${property}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute('property',property);document.head.appendChild(tag)}tag.content=content})
    let schema=document.getElementById('page-structured-data');if(!schema){schema=document.createElement('script');schema.id='page-structured-data';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name:'Superior Plus Painting & Remodeling',url:canonical,telephone:'+61470234567',email:'sppainting.remodeling@gmail.com',areaServed:'Melbourne, Victoria'})
    const ctx=gsap.context(()=>{gsap.utils.toArray('.divider-path').forEach(path=>gsap.fromTo(path,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:path,start:'top 92%'}}))})
    return()=>ctx.revert()
  },[])
  return <><Navbar/><main id="main-content" tabIndex="-1"><Hero/><Services/><Commercial/><Projects/><WhyUs/><Areas/><Testimonials/><Contact/></main><Footer/></>
}

export { Navbar, Footer, Reveal, Eyebrow, Divider }
