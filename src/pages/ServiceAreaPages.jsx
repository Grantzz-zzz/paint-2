import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Building2, Check, Home, MapPin, PaintRoller } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, ClosingCTA } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { serviceList, servicePages } from '../data/siteData'
import { serviceAreaBySlug, serviceAreaRegions, serviceAreas } from '../data/serviceAreas'
import { asset } from '../utils/assets'
import { mediaUrl, pairItems, useRouteContent } from '../content/ContentProvider'
import NotFoundPage from './NotFoundPage'

const regionImages = {
  'Monash & nearby eastern suburbs': asset('client/projects/residential/residential-01.webp'),
  'Greater Dandenong': asset('client/projects/commercial/commercial-12.webp'),
  'Casey & the outer south-east': asset('client/projects/roof/roof-07.webp'),
}

const areaCardImages = [
  asset('client/projects/exterior/exterior-02.webp'),
  asset('client/projects/residential/residential-02.webp'),
  asset('client/projects/exterior/exterior-09.webp'),
  asset('client/projects/interior/interior-02.webp'),
  asset('client/projects/fence/fence-05.webp'),
  asset('client/projects/residential/residential-05.webp'),
  asset('client/projects/commercial/commercial-03.webp'),
  asset('client/projects/interior/interior-05.webp'),
  asset('client/projects/commercial/commercial-08.webp'),
  asset('client/projects/fence/fence-08.webp'),
  asset('client/projects/exterior/exterior-12.webp'),
  asset('client/projects/residential/residential-09.webp'),
  asset('client/projects/roof/roof-03.webp'),
  asset('client/projects/commercial/commercial-15.webp'),
  asset('client/projects/exterior/exterior-20.webp'),
]

function AreaCard({area,index}) {
  const navigate=useNavigate()
  const globalIndex=serviceAreas.findIndex(item=>item.slug===area.slug)
  const image=areaCardImages[Math.max(0,globalIndex)%areaCardImages.length]
  return <Reveal delay={(index%4)*.04}><button className="area-directory-card" onClick={()=>navigate(area.path)}><span className="area-directory-photo"><img src={image} alt={`Superior Plus Painting project representing service in ${area.name}`} loading="lazy" decoding="async"/><MapPin/></span><span className="area-directory-copy"><small>{area.region}</small><h3>Painters in {area.name}</h3><p>{area.propertyTypes.slice(0,3).join(' · ')}</p></span><ArrowRight/></button></Reveal>
}

export function ServiceAreasPage() {
  const navigate=useNavigate()
  const {data:route}=useRouteContent('/service-areas')
  const image=mediaUrl(route?.hero?.image,asset('client/projects/residential/residential-01.webp'))
  const seo=route?.seo
  const regionStories=[
    {title:'Monash and nearby eastern suburbs',text:'Residential repaints, interior refreshes, exterior protection and property preparation for established homes, units, townhouses and local businesses.',image:regionImages['Monash & nearby eastern suburbs']},
    {title:'Greater Dandenong',text:'Carefully scheduled residential and commercial work for houses, apartments, shops, offices, warehouses and managed properties.',image:regionImages['Greater Dandenong']},
    {title:'Casey and the outer south-east',text:'Practical painting and maintenance support across growing residential areas, investment properties and suitable commercial sites.',image:regionImages['Casey & the outer south-east']},
  ]
  return <PageLayout title={seo?.title||'Service Areas — Melbourne’s Eastern Suburbs'} description={seo?.description||'Explore Superior Plus Painting services across Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Greater Dandenong, Casey and surrounding suburbs.'} image={mediaUrl(seo?.social_image,image)} pageType="CollectionPage" schemaData={{mainEntity:serviceAreas.map(area=>({'@type':'Place',name:area.name,url:`/service-areas/${area.slug}`}))}}>
    <PageHero eyebrow={route?.hero?.eyebrow||'Melbourne service areas'} title={route?.hero?.title||'Painters across Melbourne’s'} accent={route?.hero?.accent||'eastern & south-eastern suburbs.'} intro={route?.hero?.intro||'Superior Plus Painting provides residential, commercial and specialist painting services across the suburbs named in our client service-area information. Choose your suburb for relevant services, property types and a direct quote path.'} image={image} imageAlt={route?.hero?.image?.alt||'Superior Plus Painting exterior project in Melbourne'} tone="green"/>
    <TrustStrip/>
    <section className="inner-section area-coverage-story"><div className="container"><SectionIntro eyebrow="Local knowledge, complete capability" title="One painting team." accent="Different property needs." text="The supplied service-area information covers established eastern suburbs, busy commercial centres and the growing outer south-east. Every quote is still based on the actual property, surfaces and access."/><div className="area-story-grid">{regionStories.map((story,index)=><Reveal key={story.title} delay={index*.07}><article><img src={story.image} alt={`Superior Plus Painting work across ${story.title}`} loading="lazy" decoding="async"/><div><span>Region 0{index+1}</span><h3>{story.title}</h3><p>{story.text}</p></div></article></Reveal>)}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
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
  const {data:route}=useRouteContent(`/service-areas/${slug}`)
  if(!area) return <NotFoundPage/>
  const fields=route?.content?.fields||{}
  const sections=pairItems(fields.content_sections,[])
  const editableContext=sections[0]?.[1]?.replace(/<[^>]*>/g,'').trim()
  const services=area.serviceSlugs.map(serviceSlug=>serviceList.find(service=>service.slug===serviceSlug)).filter(Boolean)
  const neighbours=area.neighbours.map(neighbourSlug=>serviceAreaBySlug[neighbourSlug]).filter(Boolean)
  const image=mediaUrl(route?.hero?.image,regionImages[area.region]||asset('client/projects/residential/residential-01.webp'))
  const pageTitle=`Painters in ${area.name}`
  const description=`Professional residential and commercial painters in ${area.name}, Melbourne. Explore interior, exterior and related painting services from Superior Plus Painting.`
  const seo=route?.seo
  return <PageLayout title={seo?.title||pageTitle} description={seo?.description||description} image={mediaUrl(seo?.social_image,image)} pageType="Service" schemaData={{serviceType:'Painting services',areaServed:{'@type':'Place',name:area.name},availableChannel:{'@type':'ServiceChannel',serviceUrl:`/contact`}}}>
    <PageHero eyebrow={route?.hero?.eyebrow||`${area.region} service area`} title={route?.hero?.title||`Painters in ${area.name}`} accent={route?.hero?.accent||'careful work, clearly planned.'} intro={route?.hero?.intro||`Professional painting for ${area.propertyTypes.join(', ').toLocaleLowerCase('en-AU')} in ${area.name}. We provide detailed preparation, quality application and a clean handover for every suitable project.`} image={image} imageAlt={route?.hero?.image?.alt||'Superior Plus Painting completed project representing Melbourne service capabilities'} tone={area.region==='Greater Dandenong'?'green':area.region.startsWith('Casey')?'terracotta':'maroon'}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container area-intro-grid"><Reveal><SectionIntro eyebrow={`Painting in ${area.name}`} title="The right preparation" accent="for the property."/><p>{editableContext||area.localContext}</p><p>Every project begins with an inspection and written quotation. The final scope depends on the surfaces, access, repairs, coating system and finish you want to achieve.</p></Reveal><Reveal className="area-property-card" delay={.1}><Home/><h3>Properties we can quote</h3>{area.propertyTypes.map(type=><span key={type}><Check/>{type}</span>)}</Reveal></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow={`Services in ${area.name}`} title="Painting and preparation" accent="matched to your project." text={`Explore the services most relevant to ${area.name} properties. The complete service range remains available through our Services page.`}/><div className="area-services-grid">{services.map((service,index)=><Reveal key={service.slug} delay={(index%3)*.05}><button className={`area-service-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span className="area-service-photo"><img src={servicePages[service.slug]?.image||image} alt={`${service.title} project by Superior Plus Painting`} loading="lazy" decoding="async"/></span><span className="area-service-number">{String(index+1).padStart(2,'0')}</span><span className="area-service-copy"><PaintRoller/><h3>{service.title}</h3><p>{service.short}</p></span><ArrowRight/></button></Reveal>)}</div></div></section>
    <section className="area-local-process"><div className="container"><SectionIntro eyebrow="A straightforward local quote" title="From first inspection" accent="to final handover." light/><div className="area-process-grid">{[['01','Tell us the suburb, property type and service you need.'],['02','We inspect suitable projects and document preparation, coatings and access.'],['03','You receive a written quote and proposed schedule before work begins.']].map(([number,text])=><article key={number}><b>{number}</b><p>{text}</p></article>)}</div></div><Divider color="#fff" variant="drip"/></section>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Nearby service areas" title={`Around ${area.name}`} accent="and across Melbourne." text="These neighbouring locations are also named in the Superior Plus service-area content."/><div className="neighbour-grid">{neighbours.map(neighbour=><button key={neighbour.slug} onClick={()=>navigate(neighbour.path)}><MapPin/><span>Painters in {neighbour.name}</span><ArrowRight/></button>)}<button onClick={()=>navigate('/service-areas')}><Building2/><span>View all service areas</span><ArrowRight/></button></div></div></section>
    <ClosingCTA title={`Need painters in ${area.name}?`} text={`Tell us about your ${area.name} property, the surfaces involved and your preferred timing. We’ll confirm availability and arrange a free, no-obligation quotation.`}/>
  </PageLayout>
}
