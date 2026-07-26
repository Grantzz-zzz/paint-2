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
import { serviceAreaBySlug, serviceAreaRegions } from './data/serviceAreas'
import { paintingGuides } from './data/paintingGuides'
import { asset, publicRouteUrl, siteUrl } from './utils/assets'
import { mediaUrl, pairItems, textItems, toAppPath, useCollection, useEnquirySubmission, useRouteContent, useSiteContent } from './content/ContentProvider'

gsap.registerPlugin(ScrollTrigger)

const nav = [
  ['/', 'Home'], ['/services', 'Services'], ['/service-areas', 'Areas'], ['/gallery', 'Gallery'], ['/about', 'About'],
  ['/our-process', 'Our Process'], ['/faqs', 'FAQs'], ['/blog', 'Blog'], ['/contact', 'Contact']
]

const services = [
  { slug: 'residential-painting-melbourne', icon: Home, title: 'Residential Painting', tone: 'maroon', image: asset('client/projects/exterior/exterior-07.webp') },
  { slug: 'commercial-painting-melbourne', icon: Building2, title: 'Commercial Painting', tone: 'green', image: asset('client/projects/commercial/commercial-02.webp') },
  { slug: 'interior-painting-melbourne', icon: PaintRoller, title: 'Interior Painting', tone: 'teal', image: asset('client/projects/interior/interior-04.webp') },
  { slug: 'exterior-painting-melbourne', icon: SprayCan, title: 'Exterior Painting', tone: 'terracotta', image: asset('client/projects/exterior/exterior-01.webp') },
  { slug: 'roof-painting-melbourne', icon: Sparkles, title: 'Roof Painting', tone: 'maroon', image: asset('client/projects/roof/roof-01.webp') },
  { slug: 'fence-painting-melbourne', icon: Trees, title: 'Fence Painting', tone: 'terracotta', image: asset('client/projects/fence/fence-03.webp') },
  { slug: 'deck-painting-staining-melbourne', icon: Palette, title: 'Deck Painting & Staining', tone: 'gold', image: asset('client/projects/outdoor/outdoor-01.webp') },
  { slug: 'wallpaper-removal-melbourne', icon: Brush, title: 'Wallpaper Removal', tone: 'teal', image: asset('client/projects/wallpaper/wallpaper-09.webp') },
  { slug: 'plaster-repairs-melbourne', icon: Hammer, title: 'Plaster Repairs', tone: 'cream', image: asset('client/projects/plaster/plaster-11.webp') },
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
  { title: 'Warm modern interior', type: 'Residential project · Melbourne', image: asset('client/projects/residential/residential-07.webp'), pos: 'center', color: '#f3c51d' },
  { title: 'Exterior transformation', type: 'Residential project · Melbourne', image: asset('client/projects/residential/residential-01.webp'), pos: 'center', color: '#8f2824' },
  { title: 'Commercial precision', type: 'Commercial project · Melbourne', image: asset('client/projects/commercial/commercial-12.webp'), pos: 'center', color: '#1f5140' },
]

const testimonials = [
  { quote: 'I’m truly amazed by their quality of work and dedication. The painters were courteous, friendly and completed outstanding paintwork in a short time.', name: 'John', project: 'Residential painting' },
  { quote: 'They painted the exterior of our house and did an amazing job. The team arrived on time every morning. We’re very happy and would definitely use them again.', name: 'Jenny', project: 'Exterior repaint' },
  { quote: 'Afshin and his team transformed my office with incredible paintwork. The space looks as good as new.', name: 'Philip', project: 'Commercial painting' },
]

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

function Logo() {
  const navigate = useNavigate()
  const {business}=useSiteContent()
  return <button onClick={() => navigate('/')} className="logo-wrap" aria-label="Go to home page"><img src={mediaUrl(business.logo,asset('logo.webp'))} alt={business.logo?.alt||business.name} /></button>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {business,navigation,services:cmsServices}=useSiteContent()
  const suppliedNav=navigation?.length?navigation:nav.map(([url,label],index)=>({id:index,label,url,children:[]}))
  const galleryIndex=Math.max(1,suppliedNav.findIndex(item=>toAppPath(item.url)==='/services')+1)
  const navWithGallery=suppliedNav.some(item=>toAppPath(item.url)==='/gallery')?suppliedNav:[
    ...suppliedNav.slice(0,galleryIndex),
    {id:'gallery',label:'Gallery',url:'/gallery',children:[]},
    ...suppliedNav.slice(galleryIndex),
  ]
  const normalizedNav=navWithGallery.map(item=>toAppPath(item.url)==='/painting-guides'?{...item,label:'Blog',url:'/blog'}:item)
  const blogIndex=Math.max(1,normalizedNav.findIndex(item=>toAppPath(item.url)==='/gallery')+1)
  const navWithBlog=normalizedNav.some(item=>toAppPath(item.url)==='/blog')?normalizedNav:[
    ...normalizedNav.slice(0,blogIndex),
    {id:'blog',label:'Blog',url:'/blog',children:[]},
    ...normalizedNav.slice(blogIndex),
  ]
  const navOrder=['/','/services','/service-areas','/gallery','/about','/our-process','/faqs','/blog','/contact']
  const navItems=navWithBlog
    .map(item=>({...item,path:toAppPath(item.url)}))
    .sort((a,b)=>{
      const aIndex=navOrder.indexOf(a.path)
      const bIndex=navOrder.indexOf(b.path)
      return (aIndex<0?navOrder.length:aIndex)-(bIndex<0?navOrder.length:bIndex)
    })
  const displayedServices=cmsServices?.length?cmsServices:serviceList
  const go = (path) => { navigate(path); setOpen(false); setServicesOpen(false); setAreasOpen(false) }
  const toggleMobileMenu = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    setServicesOpen(nextOpen)
    setAreasOpen(false)
  }
  return <><header className="nav-shell">
    <nav className="nav-inner">
      <Logo />
      <div className="nav-links">
        {navItems.map(item => {
          if(item.path==='/services') return <div className="nav-dropdown" key={item.id} onMouseEnter={()=>{setServicesOpen(true);setAreasOpen(false)}} onMouseLeave={()=>setServicesOpen(false)}>
            <button className={`nav-main-link ${location.pathname.startsWith('/services') ? 'active' : ''}`} onClick={() => go(item.path)}>{item.label}</button>
            <button className="dropdown-trigger" onClick={()=>{setServicesOpen(value=>!value);setAreasOpen(false)}} aria-label="Show service pages" aria-expanded={servicesOpen} aria-controls="desktop-services-menu"><ChevronDown size={14}/></button>
            <AnimatePresence>{servicesOpen&&<motion.div id="desktop-services-menu" className="services-dropdown" role="navigation" aria-label="Service pages" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.16}}>
              <button className="services-overview" onClick={()=>go('/services')}><span><b>All services</b><small>View the complete service directory</small></span><ArrowRight size={17}/></button>
              <div className="services-dropdown-grid">{displayedServices.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(service.url||`/services/${service.slug}`)}><b>{service.title}</b><ArrowRight size={14}/></button>)}</div>
            </motion.div>}</AnimatePresence>
          </div>
          if(item.path==='/service-areas') return <div className="nav-dropdown nav-areas-dropdown" key={item.id} onMouseEnter={()=>{setAreasOpen(true);setServicesOpen(false)}} onMouseLeave={()=>setAreasOpen(false)}>
            <button className={`nav-main-link ${location.pathname.startsWith('/service-areas')?'active':''}`} onClick={()=>go(item.path)}>{item.label}</button>
            <button className="dropdown-trigger" onClick={()=>{setAreasOpen(value=>!value);setServicesOpen(false)}} aria-label="Show service areas" aria-expanded={areasOpen} aria-controls="desktop-areas-menu"><ChevronDown size={14}/></button>
            <AnimatePresence>{areasOpen&&<motion.div id="desktop-areas-menu" className="areas-dropdown" role="navigation" aria-label="Service areas" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.16}}>
              <button className="areas-overview" onClick={()=>go('/service-areas')}><span><b>All service areas</b><small>Explore Melbourne’s eastern and south-eastern suburbs</small></span><ArrowRight size={17}/></button>
              <div className="areas-dropdown-regions">{serviceAreaRegions.map(region=><section key={region.id}><h3>{region.title}</h3><div>{region.suburbs.map(slug=>{const area=serviceAreaBySlug[slug];return <button key={slug} className={location.pathname.endsWith(slug)?'current':''} onClick={()=>go(area.path)}><MapPin size={13}/><b>{area.name}</b></button>})}</div></section>)}</div>
            </motion.div>}</AnimatePresence>
          </div>
          return <button key={item.id} className={`nav-main-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => go(item.path)}>{item.label}</button>
        })}
      </div>
      <div className="nav-actions"><a href={business.phone_href}><Phone size={15} /> {business.phone_display}</a><button className="btn btn-small" onClick={() => go('/contact')}>Free quote <ArrowRight size={15} /></button></div>
      <button className="menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
    </nav>
    <AnimatePresence>{open && <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
      {navItems.map(item => item.path === '/services' ? <div className={`mobile-services ${servicesOpen?'open':''}`} key={item.id}>
        <div className="mobile-services-head"><button onClick={()=>go(item.path)}>{item.label}</button><button onClick={()=>{setServicesOpen(value=>!value);setAreasOpen(false)}} aria-label="Toggle service pages" aria-expanded={servicesOpen} aria-controls="mobile-services-menu"><ChevronDown size={18}/></button></div>
        <AnimatePresence>{servicesOpen&&<motion.div id="mobile-services-menu" className="mobile-services-pages" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
          {displayedServices.map(service=><button key={service.slug} className={location.pathname.endsWith(service.slug)?'current':''} onClick={()=>go(service.url||`/services/${service.slug}`)}>{service.title}<ArrowRight size={14}/></button>)}
        </motion.div>}</AnimatePresence>
      </div> : item.path==='/service-areas' ? <div className={`mobile-services mobile-areas ${areasOpen?'open':''}`} key={item.id}>
        <div className="mobile-services-head mobile-areas-head"><button onClick={()=>go(item.path)}>{item.label}</button><button onClick={()=>{setAreasOpen(value=>!value);setServicesOpen(false)}} aria-label="Toggle service areas" aria-expanded={areasOpen} aria-controls="mobile-areas-menu"><ChevronDown size={18}/></button></div>
        <AnimatePresence>{areasOpen&&<motion.div id="mobile-areas-menu" className="mobile-areas-pages" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
          {serviceAreaRegions.map(region=><section key={region.id}><strong>{region.title}</strong><div>{region.suburbs.map(slug=>{const area=serviceAreaBySlug[slug];return <button key={slug} className={location.pathname.endsWith(slug)?'current':''} onClick={()=>go(area.path)}>{area.name}<ArrowRight size={13}/></button>})}</div></section>)}
        </motion.div>}</AnimatePresence>
      </div> : <button key={item.id} onClick={() => go(item.path)}>{item.label}<ArrowRight size={16}/></button>)}
      <a className="btn" href={business.phone_href}><Phone size={17}/> {business.phone_display}</a>
    </motion.div>}</AnimatePresence>
  </header><aside className="floating-contact-actions" aria-label="Quick contact options"><a href={business.phone_href} aria-label={`Call ${business.name}`} title={`Call ${business.phone_display}`}><span><Phone/></span></a><a href={`mailto:${business.email}`} aria-label={`Email ${business.name}`} title={`Email ${business.email}`}><span><Mail/></span></a></aside></>
}

function Hero({hero,fields}) {
  const navigate = useNavigate()
  const image=mediaUrl(hero?.image,asset('client/projects/fence/fence-03.webp'))
  const trustPoints=textItems(fields?.home_trust_points,['Fully insured','Free colour advice','Melbourne-wide'])
  const title=hero?.title||'Professional painters'
  const accent=hero?.accent||'in Melbourne’s'
  const closing=fields?.home_hero_closing||'Eastern Suburbs.'
  return <section id="home" className="hero section-track">
    <div className="hero-bg"><img src={image} alt={hero?.image?.alt||'Superior Plus painter spray painting a residential fence'} loading="eager" decoding="async" fetchPriority="high" /></div>
    <div className="paint-ribbon ribbon-green"/><div className="paint-ribbon ribbon-gold"/>
    <div className="container hero-content">
      <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:.8 }} className="hero-copy">
        <Eyebrow>{hero?.eyebrow||'Melbourne’s eastern suburbs painting team'}</Eyebrow>
        <h1 className="hero-title-seo">{title}<br/><em>{accent}</em><br/>{closing}</h1>
        <p>{hero?.intro||'Professional residential and commercial painting across Melbourne’s eastern and south-eastern suburbs, delivered with careful preparation, honest advice and a finish made to last.'}</p>
        <div className="hero-buttons"><button className="btn" onClick={() => navigate('/contact')}>Get a free quote <ArrowRight size={18}/></button><button className="text-link" onClick={() => scrollTo('projects')}>See our work <span>↘</span></button></div>
        <div className="hero-trust">{trustPoints.map(item=><span key={item}><Check/> {item}</span>)}</div>
      </motion.div>
    </div>
    <div className="hero-stamp"><span>Quality finish</span><b>100%</b><small>Every detail</small></div>
    <Divider color="#fff" variant="wave" />
  </section>
}

function Services({fields,serviceItems}) {
  const navigate=useNavigate()
  const [flipped,setFlipped]=useState(null)
  const selectedIds=Array.isArray(fields?.home_service_ids)?fields.home_service_ids.map(String):[]
  const selected=selectedIds.length?serviceItems.filter(item=>selectedIds.includes(String(item.id))):[]
  const fallbackCards=services.map(item=>({
    ...item,
    text:serviceList.find(service=>service.slug===item.slug)?.short||item.text,
  }))
  const cards=selected.length?selected.map((item,index)=>({
    ...item,
    icon:services[index%services.length].icon,
    text:item.short,
    tone:item.tone||services[index%services.length].tone,
    image:mediaUrl(item.hero?.image||item.image,services[index%services.length].image),
  })):fallbackCards
  return <section id="services" className="section section-track services-section">
    <div className="container">
      <Reveal className="section-heading"><div><Eyebrow>{fields?.home_services_eyebrow||'What we paint'}</Eyebrow><h2>{fields?.home_services_title||'Every surface deserves'}<br/><em>{fields?.home_services_accent||'the right finish.'}</em></h2></div><p>{fields?.home_services_intro||'From one carefully refreshed room to a complete commercial transformation, our experienced team brings the same care to every job.'}</p></Reveal>
      <div className="services-grid home-service-flip-grid">{cards.map((service, i) => {
        const Icon=service.icon
        const cardKey=`${service.slug||service.title}-${i}`
        const destination=toAppPath(service.url||`/services/${service.slug||'residential-painting-melbourne'}`)
        const isFlipped=flipped===cardKey
        const leaveCard=event=>{if(!event.currentTarget.contains(event.relatedTarget))setFlipped(null)}
        return <Reveal key={cardKey} delay={(i%4)*.06}>
          <article
            className={`service-card home-service-flip tone-${service.tone} ${isFlipped?'is-flipped':''}`}
            tabIndex="0"
            aria-label={`${service.title}. Hover or press Enter to see details.`}
            aria-pressed={isFlipped}
            onMouseEnter={()=>setFlipped(cardKey)}
            onMouseLeave={event=>{if(!event.currentTarget.contains(document.activeElement))setFlipped(null)}}
            onFocus={()=>setFlipped(cardKey)}
            onBlur={leaveCard}
            onClick={event=>{if(!event.target.closest('.home-service-read-more'))setFlipped(isFlipped?null:cardKey)}}
            onKeyDown={event=>{if(event.target===event.currentTarget&&(event.key==='Enter'||event.key===' ')){event.preventDefault();setFlipped(isFlipped?null:cardKey)}}}
          >
            <span className="home-service-flip-inner">
              <span className="home-service-face home-service-front">
                <img src={service.image} alt={`${service.title} project by Superior Plus Painting`} loading="lazy" decoding="async"/>
                <span className="home-service-front-copy"><Icon/><strong>{service.title}</strong><small>Hover to discover</small></span>
              </span>
              <span className="home-service-face home-service-back">
                <span className="home-service-number">{String(i+1).padStart(2,'0')}</span>
                <Icon/>
                <strong>{service.title}</strong>
                <p>{service.text}</p>
                <button type="button" className="home-service-read-more" onClick={event=>{event.stopPropagation();navigate(destination)}}>Read more <ArrowRight size={16}/></button>
              </span>
            </span>
          </article>
        </Reveal>
      })}</div>
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
  const navigate=useNavigate()
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
      <div className="section-action"><button className="btn" onClick={()=>navigate('/gallery')}>View the complete gallery <ArrowRight/></button></div>
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

function GuidesPreview() {
  const navigate=useNavigate()
  return <section className="section home-guides"><div className="container"><Reveal className="section-heading"><div><Eyebrow>From the blog</Eyebrow><h2>Plan with more<br/><em>confidence.</em></h2></div><p>Client-approved articles about repainting cycles, preparation, coating systems and choosing the right professional team for your property.</p></Reveal><div className="home-guide-grid">{paintingGuides.slice(0,3).map((guide,index)=><Reveal key={guide.slug} delay={index*.07}><article><button onClick={()=>navigate(`/blog/${guide.slug}`)}><img src={guide.image} alt={guide.imageAlt} loading="lazy" decoding="async"/><span><Clock3/>{guide.readTime}</span></button><small>{guide.category}</small><h3>{guide.title}</h3><p>{guide.excerpt}</p><button className="guide-link" onClick={()=>navigate(`/blog/${guide.slug}`)}>Read article <ArrowRight/></button></article></Reveal>)}</div><div className="section-action"><button className="btn" onClick={()=>navigate('/blog')}>Explore the painting blog <ArrowRight/></button></div></div><Divider color="#fbf6ec" variant="wave"/></section>
}

function Areas({fields}) {
  const navigate=useNavigate()
  const [activeRegion,setActiveRegion]=useState('all')
  const regions=serviceAreaRegions.map(region=>({
    ...region,
    areas:region.suburbs.map(slug=>serviceAreaBySlug[slug]).filter(Boolean),
  }))
  const visibleAreas=regions
    .filter(region=>activeRegion==='all'||region.id===activeRegion)
    .flatMap(region=>region.areas)

  return <section className="home-areas">
    <div className="home-areas-overview">
      <div className="container home-areas-overview-grid">
        <Reveal className="home-areas-copy">
          <Eyebrow>Areas we service</Eyebrow>
          <h2>{fields?.home_areas_title||'Local painting across'}<br/><em>Melbourne’s east.</em></h2>
          <p>{fields?.home_areas_text||'Based in Melbourne and proudly servicing homes and businesses across the eastern and south-eastern suburbs.'}</p>
          <div className="home-area-regions" aria-label="Filter service areas by region">
            {regions.map((region,index)=><button type="button" key={region.id} className={activeRegion===region.id?'active':''} aria-pressed={activeRegion===region.id} onClick={()=>setActiveRegion(region.id)}>
              <span><MapPin size={20}/></span>
              <span><b>{region.title}</b><small>{region.areas.length} local suburbs</small></span>
              <ArrowRight size={18}/>
              <i>{String(index+1).padStart(2,'0')}</i>
            </button>)}
          </div>
        </Reveal>
        <Reveal className="home-areas-photo" delay={.15}>
          <img src={asset('client/projects/exterior/exterior-07.webp')} alt="Superior Plus Painting project in Melbourne’s eastern suburbs" loading="lazy"/>
          <div><MapPin size={19}/><span><b>Local to Chadstone</b><small>Painting across Melbourne’s east and south-east</small></span></div>
        </Reveal>
      </div>
    </div>
    <div className="home-area-directory">
      <div className="container">
        <Reveal className="home-area-directory-head">
          <div><Eyebrow light>Our service areas</Eyebrow><h2>Professional painters,<br/><em>close to home.</em></h2></div>
          <div><p>Select your suburb to view local painting services, property-specific advice and nearby areas.</p>{activeRegion!=='all'&&<button type="button" onClick={()=>setActiveRegion('all')}>Show all {regions.reduce((total,region)=>total+region.areas.length,0)} suburbs <ArrowRight size={16}/></button>}</div>
        </Reveal>
        <motion.div layout className="home-area-grid">
          <AnimatePresence mode="popLayout">
            {visibleAreas.map(area=><motion.button layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}} type="button" key={area.slug} onClick={()=>navigate(area.path)}>
              <span><MapPin size={19}/></span><span><small>Painting services</small><b>{area.name}</b></span><ArrowRight size={17}/>
            </motion.button>)}
          </AnimatePresence>
        </motion.div>
        <button type="button" className="home-area-all-link" onClick={()=>navigate('/service-areas')}>Explore our complete service area guide <ArrowRight size={17}/></button>
      </div>
      <Divider color="#fff" variant="slash" />
    </div>
  </section>
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

function HomeLocation() {
  const mapAddress='20 Rae Street, Chadstone VIC 3148, Australia'
  const mapUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`
  const mapEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`
  return <section className="contact-location home-location"><div className="container contact-location-grid"><Reveal className="home-location-copy"><div className="location-icon"><MapPin/></div><Eyebrow>Our Melbourne location</Eyebrow><h2>Local to Chadstone.<br/><em>Ready to come to you.</em></h2><address className="contact-street-address"><MapPin/>{mapAddress}</address><p>Superior Plus Painting services homes and businesses across Melbourne’s eastern and south-eastern suburbs from our Chadstone location.</p><a className="btn" href={mapUrl} target="_blank" rel="noreferrer">View address in Google Maps <ArrowRight size={17}/></a></Reveal><Reveal className="contact-map" delay={.1}><iframe src={mapEmbedUrl} title={`Superior Plus Painting at ${mapAddress}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></Reveal></div></section>
}

function FacebookMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4.1v2.3H8.2V13h2.6v8h2.9Z"/></svg>
}

function CountUpValue({ value }) {
  const elementRef = useRef(null)
  const frameRef = useRef(0)
  const hasAnimated = useRef(false)
  const match = String(value).trim().match(/^([\d,]+)(.*)$/)
  const target = match ? Number(match[1].replaceAll(',', '')) : 0
  const suffix = match?.[2] || ''
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!match || !Number.isFinite(target)) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setDisplay(target)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimated.current) return
      hasAnimated.current = true
      observer.disconnect()
      const startedAt = performance.now()
      const duration = 1150
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        setDisplay(Math.round(target * eased))
        if (progress < 1) frameRef.current = requestAnimationFrame(tick)
      }
      frameRef.current = requestAnimationFrame(tick)
    }, { threshold: .1, rootMargin: '0px 0px -5% 0px' })

    observer.observe(elementRef.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [value, target])

  if (!match) return value
  return <strong ref={elementRef} aria-label={String(value)}><span aria-hidden="true">{display.toLocaleString()}{suffix}</span></strong>
}

function FooterTrustBadges() {
  const image = asset('client/trust-platform-badges.png')
  const badges = [
    ['google', 'Google Rating 5.0, five stars'],
    ['yellow', 'Yellow Pages'],
    ['word-of-mouth', 'Word of Mouth'],
  ]
  return <div className="container footer-trust-platforms" aria-label="Business ratings and directory badges">{badges.map(([name,label])=><div className={`footer-trust-image ${name}`} key={name}><img src={image} alt={label} width="523" height="465" loading="lazy" decoding="async"/></div>)}</div>
}

function Footer() {
  const navigate = useNavigate()
  const {business,footer,navigation,services:cmsServices}=useSiteContent()
  const go = (path) => navigate(path)
  const suppliedExplore=(navigation?.length?navigation:nav.map(([url,label],id)=>({id,label,url}))).filter(item=>toAppPath(item.url)!=='/')
  const explore=suppliedExplore.some(item=>toAppPath(item.url)==='/gallery')?suppliedExplore:[
    ...suppliedExplore.slice(0,1),
    {id:'gallery',label:'Gallery',url:'/gallery'},
    ...suppliedExplore.slice(1),
  ]
  const hasGuides=explore.some(item=>['/painting-guides','/blog'].includes(toAppPath(item.url)))
  const fallbackStats=[{value:'670+',label:'Residential projects completed'},{value:'99%',label:'Projects completed'},{value:'500+',label:'Commercial projects completed'}]
  const stats=Array.isArray(footer.stats)&&footer.stats.length===3?footer.stats:fallbackStats
  const statIcons=[Home,Star,PaintRoller]
  return <footer><div className="container footer-stats" aria-label="Superior Plus Painting project statistics">{stats.map((stat,index)=>{const Icon=statIcons[index];return <div key={`${stat.label}-${index}`}><Icon aria-hidden="true"/><CountUpValue value={stat.value}/><span>{stat.label}</span></div>})}</div><FooterTrustBadges/><div className="container footer-grid"><div><Logo dark/><p>{footer.intro}</p></div><div><h4>{footer.columns?.[0]?.heading||'Explore'}</h4>{explore.map(item=><button key={item.id} onClick={()=>go(toAppPath(item.url)==='/painting-guides'?'/blog':toAppPath(item.url))}>{toAppPath(item.url)==='/painting-guides'?'Blog':item.label}</button>)}{!hasGuides&&<button onClick={()=>go('/blog')}>Blog</button>}</div><div className="footer-services"><h4>{footer.columns?.[1]?.heading||'Services'}</h4>{cmsServices.map(service=><button key={service.slug} onClick={()=>go(service.url||`/services/${service.slug}`)}>{service.title}</button>)}</div><div><h4>{footer.columns?.[2]?.heading||'Get in touch'}</h4><a href={business.phone_href}>{business.phone_display}</a><a href={`mailto:${business.email}`}>{business.email}</a><span>{business.location}</span><div className="footer-socials" aria-label="Follow Superior Plus Painting">{business.facebook_url&&<a className="footer-social-badge facebook" href={business.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Visit Superior Plus Painting on Facebook"><FacebookMark/><b>Facebook</b></a>}{business.instagram_url&&<a className="footer-social-badge instagram" href={business.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Visit Superior Plus Painting on Instagram"><Instagram aria-hidden="true"/><b>Instagram</b></a>}</div></div></div><div className="container footer-bottom"><span>{footer.copyright}</span><span>{footer.closing_line}</span></div></footer>
}

export default function App() {
  const {business,services:cmsServices}=useSiteContent()
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
    const description=seo?.description||'Professional residential and commercial painters across Melbourne’s eastern and south-eastern suburbs, delivering careful preparation and quality workmanship.'
    const canonical=publicRouteUrl('/')
    const title=seo?.title||'Professional Painters in Melbourne’s Eastern Suburbs | Superior Plus Painting'
    document.title=title
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=description
    const link=document.querySelector('link[rel="canonical"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'canonical'}));link.href=canonical
    ;[['og:title',title],['og:description',description],['og:url',canonical]].forEach(([property,content])=>{let tag=document.querySelector(`meta[property="${property}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute('property',property);document.head.appendChild(tag)}tag.content=content})
    let schema=document.getElementById('page-structured-data');if(!schema){schema=document.createElement('script');schema.id='page-structured-data';schema.type='application/ld+json';document.head.appendChild(schema)}schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'LocalBusiness',name:business.name,url:canonical,telephone:business.phone_href.replace('tel:',''),email:business.email,areaServed:business.location})
    const ctx=gsap.context(()=>{gsap.utils.toArray('.divider-path').forEach(path=>gsap.fromTo(path,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:path,start:'top 92%'}}))})
    return()=>ctx.revert()
  },[seo?.description,seo?.canonical_url,seo?.title,business])
  return <><Navbar/><main id="main-content" tabIndex="-1"><Hero hero={homeHero} fields={fields}/><Services fields={fields} serviceItems={cmsServices}/><Commercial fields={fields}/><Projects fields={fields} projectItems={projectItems}/><WhyUs fields={fields} business={business}/><GuidesPreview/><Areas fields={fields}/><Testimonials fields={fields} items={testimonialItems}/><Contact fields={fields} business={business}/><HomeLocation/></main><Footer/></>
}

export { Navbar, Footer, Reveal, Eyebrow, Divider }
