import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, PaintRoller } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, TestimonialBand, AreasBand, ClosingCTA } from '../components/PageLayout'
import { serviceList, servicePages } from '../data/siteData'
import { Reveal, Divider } from '../App'

export default function ServicePage() {
  const { slug } = useParams()
  const page = servicePages[slug]
  const navigate = useNavigate()
  if (!page) return <Navigate to="/services" replace/>
  const related = page.related.map(id => serviceList.find(s => s.slug === id)).filter(Boolean)
  return <PageLayout title={`${page.title} Melbourne`} description={page.intro} pageType="Service" image={page.image}>
    <PageHero {...page} imageAlt={`${page.title} service placeholder`}/>
    <TrustStrip/>

    <section className="inner-section scope-section"><div className="container">
      <SectionIntro eyebrow="What we can help with" title={page.scopeTitle} accent="covered with care." text="Every quote is tailored to the property, surface condition and finish you want to achieve."/>
      <div className="scope-grid">{page.scope.map((item,i)=><Reveal key={item} delay={(i%5)*.04}><div className={`scope-item scope-${page.tone}`}><span>{String(i+1).padStart(2,'0')}</span><Check/><b>{item}</b></div></Reveal>)}</div>
    </div><Divider color="#fbf6ec" variant="slash"/></section>

    <section className="inner-section process-section"><div className="container">
      <SectionIntro eyebrow="How it comes together" title="A considered process." accent="A lasting finish." text={page.why}/>
      <div className="service-process">{page.process.map((item,i)=><Reveal key={item} delay={i*.06}><article><b>{String(i+1).padStart(2,'0')}</b><span>{item}</span>{i<page.process.length-1&&<i/>}</article></Reveal>)}</div>
    </div></section>

    <section className={`benefit-section benefit-${page.tone}`}><div className="container benefit-grid"><Reveal><PaintRoller/><h2>Why this work<br/><em>makes a difference.</em></h2></Reveal><div className="benefit-list">{page.benefits.map((item,i)=><Reveal key={item} delay={i*.06}><div><span>0{i+1}</span><h3>{item}</h3></div></Reveal>)}</div></div><Divider color="#fff" variant="drip"/></section>

    <section className="inner-section related-section"><div className="container"><SectionIntro eyebrow="Keep exploring" title="Related services" accent="for the whole property."/><div className="related-grid">{related.map(service=><button key={service.slug} className={`related-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span>Superior Plus</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button>)}</div></div></section>

    <TestimonialBand index={Object.keys(servicePages).indexOf(slug)}/>
    <AreasBand/>
    <ClosingCTA title={`Planning ${page.title.toLowerCase()}?`}/>
  </PageLayout>
}
