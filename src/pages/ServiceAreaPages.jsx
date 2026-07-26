import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Building2, Check, Home, MapPin, PaintRoller } from 'lucide-react'
import { PageLayout, PageHero, TrustStrip, SectionIntro, ClosingCTA } from '../components/PageLayout'
import { Divider, Reveal } from '../App'
import { serviceList, servicePages } from '../data/siteData'
import { serviceAreaBySlug, serviceAreaRegions, serviceAreas } from '../data/serviceAreas'
import { newBatchHeroMedia } from '../data/newBatchMedia'
import { asset } from '../utils/assets'
import { mediaUrl, pairItems, useRouteContent } from '../content/ContentProvider'
import NotFoundPage from './NotFoundPage'

const regionImages = {
  'Inner Eastern Suburbs': asset('client/projects/new-batch/batch-010.webp'),
  'South Eastern Suburbs': asset('client/projects/new-batch/batch-145.webp'),
  'Eastern Suburbs': asset('client/projects/new-batch/batch-165.webp'),
  'Outer Eastern Suburbs': asset('client/projects/new-batch/batch-158.webp'),
  'Monash & nearby eastern suburbs': asset('client/projects/new-batch/batch-096.webp'),
  'Greater Dandenong': asset('client/projects/new-batch/batch-100.webp'),
  'Casey & the outer south-east': asset('client/projects/new-batch/batch-161.webp'),
}

const areaCardImages = [
  asset('client/projects/new-batch/batch-010.webp'), asset('client/projects/new-batch/batch-011.webp'),
  asset('client/projects/new-batch/batch-049.webp'), asset('client/projects/new-batch/batch-070.webp'),
  asset('client/projects/new-batch/batch-002.webp'), asset('client/projects/new-batch/batch-096.webp'),
  asset('client/projects/new-batch/batch-100.webp'), asset('client/projects/new-batch/batch-157.webp'),
  asset('client/projects/new-batch/batch-108.webp'), asset('client/projects/new-batch/batch-148.webp'),
  asset('client/projects/new-batch/batch-145.webp'), asset('client/projects/new-batch/batch-158.webp'),
  asset('client/projects/new-batch/batch-165.webp'), asset('client/projects/new-batch/batch-161.webp'),
  asset('client/projects/new-batch/batch-154.webp'),
]

const easternServiceHighlights = [
  {title:'Interior Painting Eastern Suburbs Melbourne',text:'Our interior painting services help refresh and modernise your home with professional finishes.',items:['Walls and ceilings','Bedrooms and living areas','Doors and trims','Feature walls','Kitchens and bathrooms','Renovation projects'],Icon:Home},
  {title:'Exterior Painting Eastern Suburbs Melbourne',text:'Melbourne weather can impact exterior surfaces over time. Our exterior painting services help protect your property.',items:['Weatherboard painting','Render painting','Brick painting','Fascia and eaves painting','Timber painting','Fence and deck painting'],Icon:PaintRoller},
  {title:'Residential Painting Services',text:'We work with homeowners across Melbourne’s Eastern Suburbs.',items:['Complete house repaints','New home painting','Property renovations','Rental property painting','Pre-sale painting'],Icon:Home},
  {title:'Commercial Painting Services',text:'Our commercial painting team provides professional solutions for active and managed properties.',items:['Offices','Retail shops','Warehouses','Strata properties','Body corporate buildings','Commercial facilities'],Icon:Building2},
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
  const image=mediaUrl(route?.hero?.image,newBatchHeroMedia.serviceAreas.src)
  const imagePosition=route?.hero?.image?.object_position||newBatchHeroMedia.serviceAreas.position
  const seo=route?.seo
  const regionStories=[
    {title:'Inner Eastern Suburbs',text:'Hawthorn, Kew, Camberwell, Balwyn, Surrey Hills, Mont Albert, Deepdene and the Box Hill area.',image:regionImages['Inner Eastern Suburbs']},
    {title:'South Eastern Suburbs',text:'Chadstone, Malvern, Glen Iris, Ashwood, Burwood, Mount Waverley, Glen Waverley, Oakleigh and Clayton districts.',image:regionImages['South Eastern Suburbs']},
    {title:'Eastern Suburbs',text:'Vermont, Forest Hill, Blackburn, Nunawading, Mitcham, Ringwood, Heathmont, Bayswater, Boronia, Wantirna and Ferntree Gully.',image:regionImages['Eastern Suburbs']},
    {title:'Outer Eastern Suburbs',text:'Scoresby, Rowville, Lysterfield, The Basin, Croydon, Kilsyth, Montrose, Lilydale, Mooroolbark and Chirnside Park.',image:regionImages['Outer Eastern Suburbs']},
  ]
  return <PageLayout title={seo?.title||'Service Areas — Melbourne’s Eastern Suburbs'} description={seo?.description||`Explore professional residential and commercial painting services across ${serviceAreas.length} named Melbourne suburbs.`} image={mediaUrl(seo?.social_image,image)} pageType="CollectionPage" schemaData={{mainEntity:serviceAreas.map(area=>({'@type':'Place',name:area.name,url:`/service-areas/${area.slug}`}))}}>
    <PageHero eyebrow={route?.hero?.eyebrow||'Melbourne service areas'} title={route?.hero?.title||'Professional painters servicing'} accent={route?.hero?.accent||'Melbourne’s Eastern Suburbs.'} intro={route?.hero?.intro||'Superior Plus Painting and Remodeling provides professional residential and commercial painting services throughout Melbourne’s Eastern Suburbs.'} image={image} imagePosition={imagePosition} imageAlt={route?.hero?.image?.alt||'Superior Plus Painting exterior project in Melbourne'} tone="green"/>
    <TrustStrip/>
    <section className="inner-section area-coverage-story"><div className="container"><SectionIntro eyebrow="Trusted painting contractors" title="Across Melbourne’s" accent="Eastern Suburbs." text="Our experienced painting team helps homeowners, builders, property managers and businesses transform and protect their properties with high-quality workmanship and attention to detail."/><p className="area-coverage-intro">Whether you need interior painting, exterior painting, roof painting, fence painting, commercial painting or property maintenance, our professional painters deliver reliable solutions designed to achieve long-lasting results.</p><div className="area-story-grid">{regionStories.map((story,index)=><Reveal key={story.title} delay={index*.07}><article><img src={story.image} alt={`Superior Plus Painting work across ${story.title}`} loading="lazy" decoding="async"/><div><span>Region {String(index+1).padStart(2,'0')}</span><h3>{story.title}</h3><p>{story.text}</p></div></article></Reveal>)}</div></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section eastern-service-scope"><div className="container"><SectionIntro eyebrow="Professional painting services we offer" title="Complete painting solutions" accent="for every property." text="We focus on detailed preparation, clean workmanship and quality finishes across residential and commercial projects."/><div className="eastern-service-grid">{easternServiceHighlights.map(({title,text,items,Icon},index)=><Reveal key={title} delay={(index%2)*.06}><article><span><Icon/></span><h3>{title}</h3><p>{text}</p><div>{items.map(item=><small key={item}><Check/>{item}</small>)}</div></article></Reveal>)}</div><Reveal className="eastern-why-band"><div><span>Why choose Superior Plus Painting and Remodeling?</span><h2>Detailed solutions,<br/><em>from start to finish.</em></h2></div><div>{['Experienced professional painters','Local Eastern Suburbs service','Quality preparation and workmanship','Reliable communication','Residential and commercial expertise'].map(item=><p key={item}><Check/>{item}</p>)}<p>We understand every property is different, which is why we provide tailored painting solutions to meet your needs and achieve the best possible result.</p></div></Reveal></div><Divider color="#fff" variant="slash"/></section>
    {serviceAreaRegions.map((region,index)=>{
      const areas=region.suburbs.map(slug=>serviceAreaBySlug[slug]).filter(Boolean)
      return <section className={`inner-section area-region ${index%2?'cream':''}`} key={region.id}><div className="container"><SectionIntro eyebrow={`Area ${String(index+1).padStart(2,'0')}`} title={region.title} accent="covered with care." text={region.description}/><div className="area-directory-grid">{areas.map((area,areaIndex)=><AreaCard area={area} index={areaIndex} key={area.slug}/>)}</div></div>{index<serviceAreaRegions.length-1&&<Divider color={index%2?'#fff':'#fbf6ec'} variant={index%2?'slash':'wave'}/>}</section>
    })}
    <section className="local-seo-note"><div className="container"><MapPin/><div><h2>Get your free painting quote today</h2><p>If you are looking for reliable painters in Melbourne’s Eastern Suburbs, Superior Plus Painting and Remodeling is ready to help. Contact our professional painting team and transform your home or business with quality painting services.</p></div><button className="btn" onClick={()=>navigate('/contact')}>Request a free quote <ArrowRight/></button></div></section>
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
  return <PageLayout title={seo?.title||pageTitle} description={seo?.description||description} image={mediaUrl(seo?.social_image,image)} pageType="Service" schemaData={{serviceType:'Painting services',areaServed:{'@type':'Place',name:area.name},availableChannel:{'@type':'ServiceChannel',serviceUrl:'/contact'}}}>
    <PageHero eyebrow={route?.hero?.eyebrow||`${area.region} service area`} title={route?.hero?.title||`Painters in ${area.name}`} accent={route?.hero?.accent||'careful work, clearly planned.'} intro={route?.hero?.intro||`Professional painting for ${area.propertyTypes.join(', ').toLocaleLowerCase('en-AU')} in ${area.name}. We provide detailed preparation, quality application and a clean handover for every suitable project.`} image={image} imageAlt={route?.hero?.image?.alt||'Superior Plus Painting completed project representing Melbourne service capabilities'} tone={area.region==='Greater Dandenong'?'green':area.region.startsWith('Casey')?'terracotta':'maroon'}/>
    <TrustStrip/>
    <section className="inner-section"><div className="container area-intro-grid"><Reveal><SectionIntro eyebrow={`Painting in ${area.name}`} title="The right preparation" accent="for the property."/><p>{editableContext||area.localContext}</p><p>Every project begins with an inspection and written quotation. The final scope depends on the surfaces, access, repairs, coating system and finish you want to achieve.</p></Reveal><Reveal className="area-property-card" delay={.1}><Home/><h3>Properties we can quote</h3>{area.propertyTypes.map(type=><span key={type}><Check/>{type}</span>)}</Reveal></div><Divider color="#fbf6ec" variant="wave"/></section>
    <section className="inner-section cream"><div className="container"><SectionIntro eyebrow={`Services in ${area.name}`} title="Painting and preparation" accent="matched to your project." text={`Explore the services most relevant to ${area.name} properties. The complete service range remains available through our Services page.`}/><div className="area-services-grid">{services.map((service,index)=><Reveal key={service.slug} delay={(index%3)*.05}><button className={`area-service-card tone-${service.tone}`} onClick={()=>navigate(`/services/${service.slug}`)}><span className="area-service-photo"><img src={servicePages[service.slug]?.image||image} alt={`${service.title} project by Superior Plus Painting`} loading="lazy" decoding="async"/></span><span className="area-service-number">{String(index+1).padStart(2,'0')}</span><span className="area-service-copy"><PaintRoller/><h3>{service.title}</h3><p>{service.short}</p></span><ArrowRight/></button></Reveal>)}</div></div></section>
    <section className="area-local-process"><div className="container"><SectionIntro eyebrow="A straightforward local quote" title="From first inspection" accent="to final handover." light/><div className="area-process-grid">{[['01','Tell us the suburb, property type and service you need.'],['02','We inspect suitable projects and document preparation, coatings and access.'],['03','You receive a written quote and proposed schedule before work begins.']].map(([number,text])=><article key={number}><b>{number}</b><p>{text}</p></article>)}</div></div><Divider color="#fff" variant="drip"/></section>
    <section className="inner-section"><div className="container"><SectionIntro eyebrow="Nearby service areas" title={`Around ${area.name}`} accent="and across Melbourne." text="These neighbouring locations are also named in the Superior Plus service-area content."/><div className="neighbour-grid">{neighbours.map(neighbour=><button key={neighbour.slug} onClick={()=>navigate(neighbour.path)}><MapPin/><span>Painters in {neighbour.name}</span><ArrowRight/></button>)}<button onClick={()=>navigate('/service-areas')}><Building2/><span>View all service areas</span><ArrowRight/></button></div></div></section>
    <ClosingCTA title={`Need painters in ${area.name}?`} text={`Tell us about your ${area.name} property, the surfaces involved and your preferred timing. We’ll confirm availability and arrange a free, no-obligation quotation.`}/>
  </PageLayout>
}
