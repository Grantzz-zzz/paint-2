import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, MapPin, Phone, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { Navbar, Footer, Reveal, Eyebrow, Divider } from '../App'
import { suburbs, testimonials } from '../data/siteData'

const siteUrl = 'https://grantzz-zzz.github.io/paint-2/'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(attributes.tag || 'meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key,value]) => { if (key !== 'tag') element.setAttribute(key,value) })
  return element
}

function breadcrumbItems(pathname,currentTitle){
  const items=[{label:'Home',path:'/'}]
  if(pathname.startsWith('/services/')) items.push({label:'Services',path:'/services'})
  if(pathname!=='/') items.push({label:currentTitle,path:pathname})
  return items
}

export function PageLayout({ children, title, description, pageType = 'WebPage', image = './assets/stock/residential.webp', schemaData = {} }) {
  const location = useLocation()
  const canonical = `${siteUrl}#${location.pathname}`
  const schemaKey = JSON.stringify(schemaData)
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${title} | Superior Plus Painting`
    upsertMeta('meta[name="description"]',{name:'description',content:description})
    upsertMeta('meta[property="og:title"]',{property:'og:title',content:`${title} | Superior Plus Painting`})
    upsertMeta('meta[property="og:description"]',{property:'og:description',content:description})
    upsertMeta('meta[property="og:type"]',{property:'og:type',content:'website'})
    upsertMeta('meta[property="og:url"]',{property:'og:url',content:canonical})
    upsertMeta('meta[property="og:image"]',{property:'og:image',content:new URL(image,siteUrl).href})
    upsertMeta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'})
    upsertMeta('meta[name="twitter:title"]',{name:'twitter:title',content:`${title} | Superior Plus Painting`})
    upsertMeta('link[rel="canonical"]',{tag:'link',rel:'canonical',href:canonical})
    let script=document.getElementById('page-structured-data')
    if(!script){script=document.createElement('script');script.id='page-structured-data';script.type='application/ld+json';document.head.appendChild(script)}
    script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
      {'@type':'LocalBusiness','@id':`${siteUrl}#business`,name:'Superior Plus Painting & Remodeling',url:siteUrl,telephone:'+61470234567',email:'sppainting.remodeling@gmail.com',areaServed:'Melbourne, Victoria',image:new URL('./assets/logo.jpeg',siteUrl).href},
      {'@type':pageType,name:title,description,url:canonical,provider:{'@id':`${siteUrl}#business`},...JSON.parse(schemaKey)},
      {'@type':'BreadcrumbList','itemListElement':breadcrumbItems(location.pathname,title).map((item,index)=>({'@type':'ListItem',position:index+1,name:item.label,item:`${siteUrl}#${item.path}`}))}
    ]})
  }, [location.pathname, title, description, canonical, image, pageType, schemaKey])
  return <><Navbar/><main id="main-content" tabIndex="-1" className="inner-main"><Breadcrumbs currentTitle={title}/>{children}</main><Footer/></>
}

function Breadcrumbs({currentTitle}){
  const location=useLocation();const navigate=useNavigate();const items=breadcrumbItems(location.pathname,currentTitle)
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><div className="container">{items.map((item,index)=><span key={item.path}>{index<items.length-1?<button onClick={()=>navigate(item.path)}>{item.label}</button>:<span aria-current="page">{item.label}</span>}{index<items.length-1&&<i>/</i>}</span>)}</div></nav>
}

export function PageHero({ eyebrow, title, accent, intro, image, tone = 'maroon', imageAlt }) {
  return <section className={`page-hero page-hero-${tone}`}>
    <div className="page-hero-paint paint-one"/><div className="page-hero-paint paint-two"/>
    <div className="container page-hero-grid">
      <div className="page-hero-copy">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}<br/><em>{accent}</em></h1>
        <p>{intro}</p>
        <div className="page-hero-actions"><QuoteButton/><a href="tel:0470234567" className="text-link"><Phone size={17}/> 0470 234 567</a></div>
      </div>
      <div className="page-hero-visual">
        <div className="page-image-frame"/><img src={image} alt={imageAlt || title} loading="eager" decoding="async" fetchPriority="high" />
        <span className="image-placeholder-note">Stock image · replace with project photography</span>
      </div>
    </div>
    <Divider color="#fff" variant="wave"/>
  </section>
}

function QuoteButton({ label = 'Get a free quote' }) {
  const navigate = useNavigate()
  return <button className="btn" onClick={() => navigate('/contact')}>{label}<ArrowRight size={17}/></button>
}

export function TrustStrip() {
  const items = ['Fully insured', 'Free written quotes', 'Careful preparation', 'Clean, tidy sites']
  return <section className="trust-strip"><div className="container">{items.map(item=><span key={item}><Check/>{item}</span>)}</div></section>
}

export function SectionIntro({ eyebrow, title, accent, text, light = false }) {
  return <Reveal className="inner-section-heading"><div><Eyebrow light={light}>{eyebrow}</Eyebrow><h2>{title}<br/><em>{accent}</em></h2></div>{text&&<p>{text}</p>}</Reveal>
}

export function TestimonialBand({ index = 0 }) {
  const item = testimonials[index % testimonials.length]
  return <section className="testimonial-band"><div className="container testimonial-band-grid"><Reveal><Eyebrow light>Client feedback</Eyebrow><h2>Work people feel<br/><em>good about.</em></h2><p className="placeholder-disclosure">Placeholder testimonial — replace with a verified client review before launch.</p></Reveal><Reveal className="testimonial-band-card" delay={.1}><div>{[1,2,3,4,5].map(n=><Star key={n} fill="currentColor"/>)}</div><blockquote>“{item.quote}”</blockquote><b>{item.label}</b></Reveal></div><Divider color="#fff" variant="slash"/></section>
}

export function AreasBand() {
  return <section className="inner-areas"><div className="container"><SectionIntro eyebrow="Melbourne-wide" title="Local service," accent="carefully delivered." text="We work across Melbourne’s south-east and surrounding suburbs."/><div className="inner-suburbs">{suburbs.map(s=><span key={s}><MapPin size={13}/>{s}</span>)}</div></div></section>
}

export function ClosingCTA({ title = 'Ready for a fresh start?', text = 'Tell us about your property and we’ll arrange a free, no-obligation quotation.' }) {
  return <section className="closing-cta"><div className="closing-splash"/><div className="container closing-cta-grid"><Reveal><Eyebrow light>Let’s talk colour</Eyebrow><h2>{title}</h2><p>{text}</p></Reveal><Reveal className="closing-actions" delay={.1}><QuoteButton label="Request my free quote"/><a href="tel:0470234567"><Phone/>0470 234 567</a></Reveal></div></section>
}

export function QualityGrid({ items }) {
  return <div className="quality-grid">{items.map((item,i)=><Reveal key={item} delay={(i%4)*.06}><article><span>{String(i+1).padStart(2,'0')}</span><Sparkles/><h3>{item}</h3></article></Reveal>)}</div>
}

export function SafetyNote({ children }) {
  return <div className="safety-note"><ShieldCheck/><p>{children}</p></div>
}
