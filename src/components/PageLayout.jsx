import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, MapPin, Phone, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { Navbar, Footer, Reveal, Eyebrow, Divider } from '../App'
import { suburbs, testimonials } from '../data/siteData'
import { asset, publicRouteUrl, siteUrl } from '../utils/assets'
import { collectionFallbacks, mediaUrl, useCollection, useSiteContent } from '../content/ContentProvider'

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
  const normalizedPath=pathname.replace(/\/+$/,'')||'/'
  if(/^\/services\/[^/]+/.test(normalizedPath)) items.push({label:'Services',path:'/services'})
  if(normalizedPath==='/additional-services') items.push({label:'Services',path:'/services'})
  if(/^\/service-areas\/[^/]+/.test(normalizedPath)) items.push({label:'Service Areas',path:'/service-areas'})
  if(/^\/(?:painting-guides|blog)\/[^/]+/.test(normalizedPath)) items.push({label:'Blog',path:'/blog'})
  if(pathname!=='/') items.push({label:currentTitle,path:pathname})
  return items
}

export function PageLayout({ children, title, description, pageType = 'WebPage', image = asset('client/projects/residential/residential-01.webp'), schemaData = {}, mainClassName = '' }) {
  const location = useLocation()
  const {business}=useSiteContent()
  const canonical = publicRouteUrl(location.pathname)
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
      {'@type':'LocalBusiness','@id':`${siteUrl}#business`,name:business.name,url:siteUrl,telephone:business.phone_href.replace('tel:',''),email:business.email,areaServed:business.location,image:mediaUrl(business.logo,asset('logo.webp'))},
      {'@type':pageType,name:title,description,url:canonical,provider:{'@id':`${siteUrl}#business`},...JSON.parse(schemaKey)},
      {'@type':'BreadcrumbList','itemListElement':breadcrumbItems(location.pathname,title).map((item,index)=>({'@type':'ListItem',position:index+1,name:item.label,item:publicRouteUrl(item.path)}))}
    ]})
  }, [location.pathname, title, description, canonical, image, pageType, schemaKey, business])
  return <><Navbar/><main id="main-content" tabIndex="-1" className={`inner-main ${mainClassName}`.trim()}><Breadcrumbs currentTitle={title}/>{children}</main><Footer/></>
}

function Breadcrumbs({currentTitle}){
  const location=useLocation();const navigate=useNavigate();const items=breadcrumbItems(location.pathname,currentTitle)
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><div className="container">{items.map((item,index)=><span key={item.path}>{index<items.length-1?<button onClick={()=>navigate(item.path)}>{item.label}</button>:<span aria-current="page">{item.label}</span>}{index<items.length-1&&<i>/</i>}</span>)}</div></nav>
}

export function PageHero({ eyebrow, title, accent, intro, image, tone = 'maroon', imageAlt, imagePosition = 'center center' }) {
  const {trust_items: trustItems}=useSiteContent()
  const navigate=useNavigate()
  const trust=(trustItems?.length ? trustItems : ['Fully insured', 'Free colour advice', 'Melbourne-wide']).slice(0, 3)
  const longTitle=((title?.length || 0) + (accent?.length || 0)) > 42
  return <section className={`page-hero page-hero-${tone} ${longTitle ? 'page-hero-long-title' : ''}`}>
    <motion.div
      className="page-hero-visual"
      initial={{opacity:0, scale:1.035}}
      animate={{opacity:1, scale:1}}
      transition={{duration:.9, ease:[.2,.8,.2,1]}}
    >
      <img src={image} alt={imageAlt || title} style={{objectPosition:imagePosition}} loading="eager" decoding="async" fetchPriority="high" />
    </motion.div>
    <motion.div className="page-hero-paint paint-one" initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.7, delay:.35}}/>
    <motion.div className="page-hero-paint paint-two" initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.7, delay:.5}}/>
    <div className="container page-hero-grid">
      <motion.div
        className="page-hero-copy"
        initial={{opacity:0, x:-42}}
        animate={{opacity:1, x:0}}
        transition={{duration:.75, ease:[.2,.8,.2,1]}}
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}<br/><em>{accent}</em></h1>
        <p>{intro}</p>
        <div className="page-hero-actions">
          <QuoteButton/>
          <button type="button" className="text-link" onClick={()=>navigate('/gallery')}>See our work <span aria-hidden="true">↘</span></button>
        </div>
        <div className="page-hero-trust">
          {trust.map(item=><span key={item}><Check size={17}/>{item}</span>)}
        </div>
      </motion.div>
    </div>
    <motion.div className="page-hero-stamp" initial={{opacity:0, rotate:-16, scale:.75}} animate={{opacity:1, rotate:0, scale:1}} transition={{duration:.65, delay:.65}}>
      <span>Quality finish</span><b>100%</b><small>Every detail</small>
    </motion.div>
    <Divider color="#fff" variant="wave"/>
  </section>
}

function QuoteButton({ label = 'Get a free quote' }) {
  const navigate = useNavigate()
  return <button className="btn" onClick={() => navigate('/contact')}>{label}<ArrowRight size={17}/></button>
}

export function TrustStrip() {
  const {trust_items:items}=useSiteContent()
  return <section className="trust-strip"><div className="container">{items.map(item=><span key={item}><Check/>{item}</span>)}</div></section>
}

export function SectionIntro({ eyebrow, title, accent, text, light = false }) {
  return <Reveal className="inner-section-heading"><div><Eyebrow light={light}>{eyebrow}</Eyebrow><h2>{title}<br/><em>{accent}</em></h2></div>{text&&<p>{text}</p>}</Reveal>
}

export function TestimonialBand({ index = 0 }) {
  const {data:items}=useCollection('testimonials',collectionFallbacks.testimonials)
  const item = items[index % items.length]
  return <section className="testimonial-band"><div className="container testimonial-band-grid"><Reveal><Eyebrow light>Client feedback</Eyebrow><h2>Work people feel<br/><em>good about.</em></h2>{item.is_placeholder&&<p className="placeholder-disclosure">Placeholder testimonial — replace with a verified client review before launch.</p>}</Reveal><Reveal className="testimonial-band-card" delay={.1}><div>{Array.from({length:item.rating||5},(_,n)=><Star key={n} fill="currentColor"/>)}</div><blockquote>“{item.quote}”</blockquote><b>{item.label||item.name}</b></Reveal></div><Divider color="#fff" variant="slash"/></section>
}

function stableAreaScore(value) {
  let score=2166136261
  for(let index=0;index<value.length;index+=1)score=Math.imul(score^value.charCodeAt(index),16777619)
  return score>>>0
}

export function AreasBand({seed=''}) {
  const {service_areas:areas}=useSiteContent()
  const items=areas?.length?areas:suburbs
  const displayName=item=>typeof item==='string'?item:item?.name||item?.title||String(item)
  const displayed=seed&&items.length>12?[...items].sort((a,b)=>stableAreaScore(`${seed}:${displayName(a)}`)-stableAreaScore(`${seed}:${displayName(b)}`)).slice(0,12):items
  return <section className="inner-areas"><div className="container"><SectionIntro eyebrow="Melbourne-wide" title="Local service," accent="carefully delivered." text="A selection of Melbourne suburbs regularly serviced for this type of work."/><div className="inner-suburbs">{displayed.map(s=>{const name=displayName(s);return <span key={name}><MapPin size={13}/>{name}</span>})}</div></div></section>
}

export function ClosingCTA({ title, text, label, url }) {
  const {business,default_cta:defaults}=useSiteContent()
  const navigate=useNavigate()
  const destination=url||defaults.link.url||'/contact'
  const action=()=>destination.startsWith('/')?navigate(destination):window.location.assign(destination)
  return <section className="closing-cta"><div className="closing-splash"/><div className="container closing-cta-grid"><Reveal><Eyebrow light>Let’s talk colour</Eyebrow><h2>{title||defaults.title}</h2><p>{text||defaults.text}</p></Reveal><Reveal className="closing-actions" delay={.1}><button className="btn" onClick={action}>{label||defaults.link.label}<ArrowRight size={17}/></button><a href={business.phone_href}><Phone/>{business.phone_display}</a></Reveal></div></section>
}

export function QualityGrid({ items }) {
  return <div className="quality-grid">{items.map((item,i)=><Reveal key={item} delay={(i%4)*.06}><article><span>{String(i+1).padStart(2,'0')}</span><Sparkles/><h3>{item}</h3></article></Reveal>)}</div>
}

export function SafetyNote({ children }) {
  return <div className="safety-note"><ShieldCheck/><p>{children}</p></div>
}
