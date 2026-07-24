import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Building2, Check, Home, MapPin, PaintRoller } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, ClosingCTA } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { serviceList } from '../data/siteData'
import { serviceAreaBySlug, serviceAreaRegions, serviceAreas } from '../data/serviceAreas'
import { asset } from '../utils/assets'
import NotFoundPage from './NotFoundPage'

const regionImages = {
  'Monash & nearby eastern suburbs': asset('client/projects/exterior/exterior-07.webp'),
  'Greater Dandenong': asset('client/projects/commercial/commercial-02.webp'),
  'Casey & the outer south-east': asset('client/projects/exterior/exterior-01.webp'),
}

function AreaCard({area,index}) {
  const navigate=useNavigate()
  return <Reveal delay={(index%4)*.04}><button className="area-directory-card" onClick={()=>navigate(area.path)}><MapPin/><span>{area.region}</span><h3>Painters in {area.name}</h3><p>{area.propertyTypes.slice(0,3).join(' · ')}</p><ArrowRight/></button></Reveal>
}

export function ServiceAreasPage() {
  const navigate=useNavigate()
  const image=asset('client/projects/exterior/exterior-07.webp')
  return <PageLayout title="Service Areas — Melbourne’s Eastern Suburbs" description="Explore Superior Plus Painting services across Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Greater Dandenong, Casey and surrounding suburbs." image={image} pageType="CollectionPage" schemaData={{mainEntity:serviceAreas.map(area=>({'@type':'Place',name:area.name,url:`/service-areas/${area.slug}`}))}}>
    <PageHero eyebrow="Melbourne service areas" title="Painters across Melbourne’s" accent="eastern & south-eastern suburbs." intro="Superior Plus Painting provides residential, commercial and specialist painting services across the suburbs named in our client service-area information. Choose your suburb for relevant services, property types and a direct quote path." image={image} imageAlt="Superior Plus Painting exterior project in Melbourne" tone="green"/>
    <TrustStrip/>
    {serviceAreaRegions.map((region,index)=>{
      const areas=region.suburbs.map(slug=>serviceAreaBySlug[slug]).filter(Boolean)
      return <section className={`inner-section area-region ${index%2?'cream':''}`} key={region.id}><div className="container"><SectionIntro eyebrow={`Area ${String(index+1).padStart(2,'0')}`} title={region.title} accent="covered with care." text={region.description}/><div className="area-directory-grid">{areas.map((area,areaIndex)=><AreaCard area={area} index={areaIndex} key={area.slug}/>)}</div></div>{index<serviceAreaRegions.length-1&&<Divider color={index%2?'#fff':'#fbf6ec'} variant={index%2?'slash':'wave'}/>}</section>
    })}
    <section className="local-seo-note"><div className="container"><MapPin/><div><h2>Not sure if your suburb is covered?</h2><p>The listed areas come directly from the supplied service content. Nearby Melbourne suburbs may also be available—contact the team with your property location and required service.</p></div><button className="btn" onClick={()=>navigate('/contact')}>Check your suburb <ArrowRight/></button></div></section>
  </PageLayout>
}

export function ServiceAreaPage() {
  const {slug}=useParams()
  const navigate=useNavigate()
  const area=serviceAreaBySlug[slug]
  if(!area) return <NotFoundPage/>
  const services=area.serviceSlugs.map(serviceSlug=>serviceList.find(service=>service.slug===serviceSlug)).filter(Boolean)
  const neighbours=area.neighbours.map(neighbourSlug=>serviceAreaBySlug[neighbourSlug]).filter(Boolean)
  const image=regionImages[area.region]||asset('client/projects/exterior/exterior-07.webp')
  const pageTitle=`Painters in ${area.name}`
  const description=`Professional residential and commercial painters in ${area.name}, Melbourne. Explore interior, exterior and related painting services from Superior Plus Painting.`
  return <PageLayout title={pageTitle} description={description} image={image} pageType="Service" schemaData={{serviceType:'Painting services',areaServed:{'@type':'Place',name:area.name},availableChannel:{'@type':'ServiceChannel',serviceUrl:`/contact`}}}>
    <PageHero eyebrow={`${area.region} service area`} title={`Painters in ${area.name}`} accent="careful work, clearly planned." intro={`Professional painting for ${area.propertyTypes.join(', ').toLocaleLowerCase('en-AU')} in ${area.name}. We provide detailed preparation, quality application and a clean handover for every suitable project.`} image={image} imageAlt="Superior Plus Painting completed project representing Melbourne service capabilities" tone={area.region==='Greater Dandenong'?'green':area.region.startsWith('Casey')?'terracotta':'maroon'}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container area-intro-grid"><Reveal><SectionIntro eyebrow={`Painting in ${area.name}`} title="The right preparation" accent="for the property."/><p>{area.localContext}</p><p>Every project begins with an inspection and written quotation. The final scope depends on the surfaces, access, repairs, coating system and finish you want to achieve.</p></Reveal><Reveal className="area-property-card" delay={.1}><Home/><h3>Properties we can quote</h3>{area.propertyTypes.map(type=><span key={type}><Check/>{type}</span>)}</Reveal></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow={`Services in ${area.name}`} title="Painting and preparation" accent="matched to your project." text={`Explore the services most relevant to ${area.name} properties. The complete service range remains available through our Services page.`}/><div className="area-services-grid">{services.map((service,index)=><Reveal key={service.slug} delay={(index%3)*.05}><button className={`area-service-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span>{String(index+1).padStart(2,'0')}</span><PaintRoller/><h3>{service.title}</h3><p>{service.short}</p><ArrowRight/></button></Reveal>)}</div></div></section>
    <section className="area-local-process"><div className="container"><SectionIntro eyebrow="A straightforward local quote" title="From first inspection" accent="to final handover." light/><div className="area-process-grid">{[['01','Tell us the suburb, property type and service you need.'],['02','We inspect suitable projects and document preparation, coatings and access.'],['03','You receive a written quote and proposed schedule before work begins.']].map(([number,text])=><article key={number}><b>{number}</b><p>{text}</p></article>)}</div></div><Divider color="#fff" variant="drip"/></section>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Nearby service areas" title={`Around ${area.name}`} accent="and across Melbourne." text="These neighbouring locations are also named in the Superior Plus service-area content."/><div className="neighbour-grid">{neighbours.map(neighbour=><button key={neighbour.slug} onClick={()=>navigate(neighbour.path)}><MapPin/><span>Painters in {neighbour.name}</span><ArrowRight/></button>)}<button onClick={()=>navigate('/service-areas')}><Building2/><span>View all service areas</span><ArrowRight/></button></div></div></section>
    <ClosingCTA title={`Need painters in ${area.name}?`} text={`Tell us about your ${area.name} property, the surfaces involved and your preferred timing. We’ll confirm availability and arrange a free, no-obligation quotation.`}/>
  </PageLayout>
}
