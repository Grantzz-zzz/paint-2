import { useEffect, useMemo, useState } from 'react'
import { Images, X } from 'lucide-react'
import { projectMedia } from '../data/projectMedia'
import { ClosingCTA, PageHero, PageLayout, SectionIntro, TrustStrip } from '../components/PageLayout'

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

export default function GalleryPage() {
  const sections=useMemo(()=>gallerySections.map(([key,label])=>({
    key,label,...projectMedia[key],
    items:projectMedia[key].items.filter(item=>item.type==='image'),
  })),[])
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
    description="Browse 133 real Superior Plus Painting project photos, grouped by residential, commercial, interior, exterior, roof, fence and specialist painting services."
    pageType="CollectionPage"
    image={projectMedia.residential.items[0].src}
    schemaData={{numberOfItems:photoCount}}
  >
    <PageHero
      eyebrow="Real Melbourne projects"
      title="Every project,"
      accent="all in one place."
      intro="Scroll through our complete project archive. Every photograph is from supplied Superior Plus Painting work and is organised by service so you can quickly find the finish that suits your property."
      image={projectMedia.commercial.items[11].src}
      imageAlt="Completed commercial painting project by Superior Plus Painting"
      tone="green"
    />
    <TrustStrip/>
    <section className="gallery-directory" aria-label="Gallery sections">
      <div className="container">
        <div className="gallery-directory-summary"><Images aria-hidden="true"/><p><strong>{photoCount} real project photos</strong><span>All visible below. Choose a section or simply keep scrolling.</span></p></div>
        <nav>{sections.map(section=><a key={section.key} href={`#gallery-${section.key}`}><span>{section.label}</span><b>{section.items.length}</b></a>)}</nav>
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
              <img src={item.src} alt={`${section.label} project ${index+1} by Superior Plus Painting`} loading="lazy" decoding="async"/>
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
