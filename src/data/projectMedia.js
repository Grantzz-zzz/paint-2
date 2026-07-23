import { asset, remoteProjectVideo } from '../utils/assets'

const root = 'client/projects'

function photos(category,count,subject) {
  return Array.from({length:count},(_,index)=>({
    type:'image',
    src:asset(`${root}/${category}/${category}-${String(index+1).padStart(2,'0')}.webp`),
    alt:`${subject} project by Superior Plus Painting`,
  }))
}

function videos(category,count,subject) {
  return Array.from({length:count},(_,index)=>{
    const stem=`${root}/${category}/${category}-video-${String(index+1).padStart(2,'0')}`
    return {type:'video',src:remoteProjectVideo(`${stem}.mp4`),poster:asset(`${stem}-poster.webp`),alt:`${subject} project video by Superior Plus Painting`}
  })
}

export const projectMedia = {
  commercial: {
    eyebrow:'Commercial portfolio', title:'Real work.', accent:'Real working spaces.',
    intro:'Completed commercial interiors, warehouses, floor coatings and active job sites from the Superior Plus project archive.',
    items:photos('commercial',8,'Commercial painting'),
  },
  interior: {
    eyebrow:'Interior portfolio', title:'Fresh rooms.', accent:'Careful finishes.',
    intro:'A selection of completed rooms, preparation work and interior transformations delivered by the Superior Plus team.',
    items:photos('interior',10,'Interior painting'),
  },
  exterior: {
    eyebrow:'Exterior portfolio', title:'Street appeal.', accent:'Built back beautifully.',
    intro:'Exterior repaints, before-and-after transformations and detailed residential finishes from recent projects.',
    items:[...photos('exterior',9,'Exterior painting'),...videos('exterior',3,'Exterior painting')],
  },
  fence: {
    eyebrow:'Fence portfolio', title:'Boundaries transformed.', accent:'From prep to finish.',
    intro:'The complete fence-painting archive, including preparation, spraying, detail work and finished boundaries.',
    items:[...photos('fence',21,'Fence painting'),...videos('fence',1,'Fence painting')],
  },
  outdoor: {
    eyebrow:'Outdoor portfolio', title:'Outdoor structures.', accent:'Protected with care.',
    intro:'Preparation and coating work for pergolas, covered outdoor areas and suitable exterior timber.',
    items:[...photos('outdoor',2,'Outdoor timber painting'),...videos('outdoor',1,'Outdoor timber painting')],
  },
}

export const brandArchive = asset(`${root}/brand/brand-01.webp`)

export const serviceMediaCategory = {
  'commercial-painting-melbourne':'commercial',
  'interior-painting-melbourne':'interior',
  'exterior-painting-melbourne':'exterior',
  'fence-painting-melbourne':'fence',
  'deck-painting-staining-melbourne':'outdoor',
}
