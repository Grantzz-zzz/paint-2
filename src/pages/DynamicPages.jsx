import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'
import ProjectGallery from '../components/ProjectGallery'
import { Divider, Reveal } from '../App'
import { mediaUrl, pairItems, useRouteContent } from '../content/ContentProvider'
import { asset } from '../utils/assets'
import NotFoundPage from './NotFoundPage'

function LoadingPage() {
  return <PageLayout title="Loading page" description="Loading the latest website content.">
    <section className="inner-section"><div className="container"><p>Loading the latest page content…</p></div></section>
  </PageLayout>
}

export function DynamicContentPage() {
  const location=useLocation()
  const navigate=useNavigate()
  const {data:route,status}=useRouteContent(location.pathname)
  if(status==='loading')return <LoadingPage/>
  if(!route||!['standard','landing'].includes(route.template_key))return <NotFoundPage/>
  const fields=route.content?.fields||{}
  const hero={...route.hero,image:mediaUrl(route.hero?.image,asset('stock/residential.webp')),tone:'green'}
  const sections=pairItems(fields.content_sections,route.content?.body?[['Our story',route.content.body]]:[])
  const cta=route.closing_cta
  return <PageLayout title={route.seo?.title||route.title} description={route.seo?.description||hero.intro} image={mediaUrl(route.seo?.social_image,hero.image)}>
    <PageHero {...hero}/>
    <TrustStrip/>
    {sections.map(([title,body],index)=><section className={`inner-section ${index%2?'cream':''}`} key={`${title}-${index}`}><div className="container editorial-grid"><Reveal><SectionIntro eyebrow="Superior Plus" title={title} accent="handled with care."/><div dangerouslySetInnerHTML={{__html:body}}/></Reveal>{index===0&&fields.secondary_image&&<Reveal className="editorial-image" delay={.1}><img src={fields.secondary_image.url} alt={fields.secondary_image.alt||title}/></Reveal>}</div>{!index&&<Divider color="#fbf6ec" variant="wave"/>}</section>)}
    {fields.related_pages?.length>0&&<section className="inner-section"><div className="container"><SectionIntro eyebrow="Keep exploring" title="Related pages" accent="from Superior Plus."/><div className="related-grid">{fields.related_pages.map(page=><button className="related-card tone-cream" key={page.id} onClick={()=>navigate(page.path)}><span>Superior Plus</span><h3>{page.title}</h3><ArrowRight/></button>)}</div></div></section>}
    <ClosingCTA title={cta?.title} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}

export function ProjectPage() {
  const location=useLocation()
  const navigate=useNavigate()
  const {data:route,status}=useRouteContent(location.pathname)
  if(status==='loading')return <LoadingPage/>
  if(!route||route.template_key!=='project')return <NotFoundPage/>
  const project=route.content||{}
  const hero={...route.hero,image:mediaUrl(route.hero?.image,mediaUrl(project.featured_media,asset('stock/residential.webp'))),tone:'terracotta'}
  const cta=route.closing_cta
  return <PageLayout title={route.seo?.title||route.title} description={route.seo?.description||hero.intro||project.project_type} image={mediaUrl(route.seo?.social_image,hero.image)}>
    <PageHero {...hero}/>
    <TrustStrip/>
    <ProjectGallery items={project.gallery}/>
    {project.related_pages?.length>0&&<section className="inner-section"><div className="container"><SectionIntro eyebrow="Keep exploring" title="Related pages" accent="from this project."/><div className="related-grid">{project.related_pages.map(page=><button className="related-card tone-cream" key={page.id} onClick={()=>navigate(page.path)}><span>Superior Plus</span><h3>{page.title}</h3><ArrowRight/></button>)}</div></div></section>}
    <ClosingCTA title={cta?.title} text={cta?.text} label={cta?.link?.label} url={cta?.link?.url}/>
  </PageLayout>
}
