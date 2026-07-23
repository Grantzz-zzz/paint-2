import { useEffect, useState } from 'react'
import { Images, Play, Plus, X } from 'lucide-react'
import { Reveal } from '../App'
import { SectionIntro } from './PageLayout'
import { projectMedia } from '../data/projectMedia'

export default function ProjectGallery({category}) {
  const gallery=projectMedia[category]
  const [visible,setVisible]=useState(8)
  const [selected,setSelected]=useState(null)
  useEffect(()=>{
    if(!selected)return
    const close=event=>{if(event.key==='Escape')setSelected(null)}
    document.body.style.overflow='hidden'
    window.addEventListener('keydown',close)
    return()=>{document.body.style.overflow='';window.removeEventListener('keydown',close)}
  },[selected])
  if(!gallery)return null
  return <section className="client-work"><div className="container">
    <SectionIntro eyebrow={gallery.eyebrow} title={gallery.title} accent={gallery.accent} text={gallery.intro}/>
    <div className="client-gallery-grid">{gallery.items.slice(0,visible).map((item,index)=><Reveal key={item.src} delay={(index%4)*.035}><button className={`client-media-card ${index===0?'featured':''}`} onClick={()=>setSelected(item)} aria-label={`Open ${item.alt}`}>
      <img src={item.type==='video'?item.poster:item.src} alt={item.alt} loading="lazy" decoding="async"/>
      <span className="client-media-badge">{item.type==='video'?<><Play/>Video</>:<><Images/>{item.placeholder?'Showcase image':'Project photo'}</>}</span>
      <i><Plus/></i>
    </button></Reveal>)}</div>
    {visible<gallery.items.length&&<button className="gallery-more" onClick={()=>setVisible(gallery.items.length)}>View all {gallery.items.length} project items <Plus/></button>}
  </div>
  {selected&&<div className="media-lightbox" role="dialog" aria-modal="true" aria-label={selected.alt} onMouseDown={event=>{if(event.target===event.currentTarget)setSelected(null)}}>
    <button className="lightbox-close" onClick={()=>setSelected(null)} aria-label="Close project viewer"><X/></button>
    <div className="lightbox-media">{selected.type==='video'?<video src={selected.src} poster={selected.poster} controls autoPlay playsInline/>:<img src={selected.src} alt={selected.alt}/>}<p>{selected.alt}</p></div>
  </div>}
  </section>
}
