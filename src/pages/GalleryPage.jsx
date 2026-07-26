import { useEffect, useMemo, useState } from 'react'
import { Images, X } from 'lucide-react'
import { projectMedia } from '../data/projectMedia'
import { newBatchHeroMedia } from '../data/newBatchMedia'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'
import { mediaUrl, useCollection, useRouteContent } from '../content/ContentProvider'

const gallerySections = [
  ['residential','Residential Painting'],
  ['commercial','Commercial Painting'],
  ['interior','Interior Painting'],
  ['exterior','Exterior Painting'],
  ['roof','Roof Painting'],
  ['fence','Fence Painting'],
  ['outdoor','Deck & Outdoor'],
  ['wallpaper','Wallpaper Removal & Wall Preparation'],
  ['plaster','Plaster Repairs'],
]
const emptyProjects=[]

export default function GalleryPage() {
  const {data:projects}=useCollection('projects',emptyProjects)
  const {data:route}=useRouteContent('/gallery')
  const sections=useMemo(()=>gallerySections.map(([key,label])=>{
    const managed=(projects||[]).filter(project=>{
      const slugs=(project.categories||[]).map(category=>category.slug)
      return slugs.includes(key)||String(project.project_type||'').toLowerCase().includes(key)
    }).flatMap(project=>{
      const gallery=(project.gallery||[]).filter(item=>item.type==='image').map(item=>({src:mediaUrl(item.media),type:'image',position:item.object_position,alt:item.alt||item.media?.alt,caption:item.caption}))
      const featured=mediaUrl(project.featured_media)
      return featured?[{src:featured,type:'image',position:project.object_position,alt:project.featured_media?.alt,caption:project.title},...gallery]:gallery
    }).filter(item=>item.src)
    const combined=[...managed,...projectMedia[key].items.filter(item=>item.type==='image')]
    const unique=combined.filter((item,index,items)=>items.findIndex(candidate=>candidate.src===item.src)===index)
    return {key,label,...projectMedia[key],items:unique}
  }),[projects])
  const photoCount=sections.reduce((total,section)=>total+section.items.length,0)
  const [selected,setSelected]=useState(null)

  useEffect(()=>{
    if(!selected)return undefined
    const close=event=>{if(event.key==='Escape')setSelected(null)}
    document.body.style.overflow='hidden'
    window.addEventListener('keydown',close)
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',close)}
  },[selected])

  return <PageLayout
    title="Painting Project Gallery Melbourne"
    description={`Browse ${photoCount} real Superior Plus Painting project photos, grouped by residential, commercial, interior, exterior, roof, fence and specialist painting services.`}
    pageType="CollectionPage"
    image={projectMedia.residential.items[0].src}
    schemaData={{numberOfItems:photoCount}}
    mainClassName="gallery-main"
  >
    <PageHero
      eyebrow={route?.hero?.eyebrow||"Real Melbourne projects"}
      title={route?.hero?.title||"Every project,"}
      accent={route?.hero?.accent||"all in one place."}
      intro={route?.hero?.intro||"Scroll through our complete project archive. Every photograph is from supplied Superior Plus Painting work and is organised by service so you can quickly find the finish that suits your property."}
      image={mediaUrl(route?.hero?.image,newBatchHeroMedia.exterior.src)}
      imagePosition={newBatchHeroMedia.exterior.position}
      imageAlt="Completed Melbourne exterior painting project by Superior Plus Painting"
      tone="green"
    />
    <TrustStrip/>
    <section className="gallery-directory" aria-label="Gallery sections">
      <div className="container">
        <div className="gallery-directory-summary"><Images aria-hidden="true"/><p><strong>{photoCount} real project photos</strong><span>All visible below. Choose a section or simply keep scrolling.</span></p></div>
        <nav>{sections.map(section=><button key={section.key} type="button" onClick={()=>document.getElementById(`gallery-${section.key}`)?.scrollIntoView({behavior:'auto',block:'start'})}><span>{section.label}</span><b>{section.items.length}</b></button>)}</nav>
      </div>
    </section>
    <div className="complete-gallery">
      {sections.map((section,sectionIndex)=><section className={`gallery-category gallery-category-${sectionIndex%3}`} id={`gallery-${section.key}`} key={section.key}>
        <div className="container">
          <div className="gallery-category-heading">
            <SectionIntro eyebrow={section.eyebrow} title={section.title} accent={section.accent} text={section.intro}/>
            <span>{String(sectionIndex+1).padStart(2,'0')} / {String(sections.length).padStart(2,'0')} · {section.items.length} photos</span>
          </div>
          <div className="gallery-masonry">
            {section.items.map((item,index)=><button
              className="gallery-photo"
              key={item.src}
              onClick={()=>setSelected({...item,section:section.label,number:index+1})}
              aria-label={`Open ${section.label} project photo ${index+1}`}
            >
              <img src={item.src} style={{objectPosition:item.position||'50% 50%'}} alt={item.alt||`${section.label} project ${index+1} by Superior Plus Painting`} loading="lazy" decoding="async"/>
              <span><b>{section.label}</b><small>Project {String(index+1).padStart(2,'0')}</small></span>
            </button>)}
          </div>
        </div>
      </section>)}
    </div>
    <ClosingCTA title="Seen a finish you like?" text="Tell us which project caught your eye and we’ll help you plan a practical, durable finish for your own property."/>
    {selected&&<div className="media-lightbox gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${selected.section} project ${selected.number}`} onMouseDown={event=>{if(event.target===event.currentTarget)setSelected(null)}}>
      <button className="lightbox-close" onClick={()=>setSelected(null)} aria-label="Close project photo"><X/></button>
      <div className="lightbox-media"><img src={selected.src} alt={`${selected.section} project ${selected.number} by Superior Plus Painting`}/><p>{selected.section} · Project {String(selected.number).padStart(2,'0')}</p></div>
    </div>}
  </PageLayout>
}
