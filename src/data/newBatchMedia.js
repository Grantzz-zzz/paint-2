import { asset, remoteProjectVideo } from '../utils/assets.js'

const root='client/projects/new-batch'
const clientRoofImage=asset('client/projects/roof/roof-client-2026.webp')
const roofServiceHero=asset('client/projects/roof/roof-spray-coating.webp')
const roofBeforeAfter=asset('client/projects/roof/roof-before-after.webp')
const roofCommercialCoating=asset('client/projects/roof/roof-commercial-coating.webp')
const portrait=new Set([1,4,7,8,9,15,17,18,19,20,23,25,27,28,29,31,32,34,37,38,40,41,42,43,44,45,47,50,54,55,60,61,62,64,65,68,69,76,77,78,82,86,90,92,93,95,99,105,107,109,146,163])

const groups={
  residential:[1,4,12,25,48,57,63,96,102,107,117,118,121,123,124,126,128,130,159],
  commercial:[59,61,75,80,89,93,94,100,103,114,147,150],
  exterior:[6,10,11,13,16,24,98,104,105,106,129,131,132,133,134,135,136,137,140,144,154,158,160,161,164],
  fence:[2,3,125,127,148,156],
  outdoor:[46,108,110,111,112,113,115,116,119,122,141,152,162,163],
  roof:[21,22,47,87,99,120,145,165],
  wallpaper:[5,8,32,33,34,38,60,64,76],
  plaster:[7,9,17,19,20,37,41,42,43,67,71,73,74,77,81,83,88,143],
  interior:[14,15,18,23,26,27,28,29,30,31,35,36,39,40,44,45,49,50,51,52,53,54,55,56,58,62,65,66,68,69,70,72,78,79,82,84,85,86,90,91,92,95,97,101,109,138,139,142,146,149,151,155,157],
}

const subjects={
  residential:'Residential painting',
  commercial:'Commercial painting',
  exterior:'Exterior painting',
  fence:'Fence painting',
  outdoor:'Deck and outdoor coating',
  roof:'Roofline and exterior painting',
  wallpaper:'Wall preparation',
  plaster:'Plaster and surface preparation',
  interior:'Interior painting',
}

const photo=(category,index)=>({
  type:'image',
  src:asset(`${root}/batch-${String(index).padStart(3,'0')}.webp`),
  alt:`${subjects[category]} project ${String(index).padStart(3,'0')} by Superior Plus Painting`,
  fit:portrait.has(index)?'contain':'cover',
  batchIndex:index,
})

export const newBatchProjectMedia=Object.fromEntries(
  Object.entries(groups).map(([category,indexes])=>[category,indexes.map(index=>photo(category,index))])
)

newBatchProjectMedia.roof.unshift(
  {
    type:'image',
    src:roofServiceHero,
    alt:'Superior Plus painters applying a protective coating to a corrugated metal roof',
    fit:'cover',
    batchIndex:'roof-spray-coating',
  },
  {
    type:'image',
    src:roofBeforeAfter,
    alt:'Before and after comparison of a restored corrugated metal roof',
    fit:'cover',
    batchIndex:'roof-before-after',
  },
  {
    type:'image',
    src:roofCommercialCoating,
    alt:'Commercial metal roof coating project by Superior Plus Painting',
    fit:'contain',
    batchIndex:'roof-commercial-coating',
  },
  {
    type:'image',
    src:clientRoofImage,
    alt:'Metal roof and upper exterior painting project by Superior Plus Painting',
    fit:'contain',
    batchIndex:'roof-client-2026',
  },
)

newBatchProjectMedia.residential.push({
  type:'video',
  src:remoteProjectVideo(`${root}/batch-166.mp4`),
  poster:asset(`${root}/batch-166-poster.webp`),
  alt:'Interior wall preparation video by Superior Plus Painting',
  fit:'contain',
  batchIndex:166,
})

newBatchProjectMedia.fence.push({
  type:'video',
  src:remoteProjectVideo(`${root}/batch-167.mp4`),
  poster:asset(`${root}/batch-167-poster.webp`),
  alt:'Fence transformation video by Superior Plus Painting',
  fit:'contain',
  batchIndex:167,
})

export const newBatchHeroMedia={
  residential:{src:asset(`${root}/batch-049.webp`),position:'center 48%'},
  commercial:{src:asset(`${root}/batch-100.webp`),position:'center 50%'},
  interior:{src:asset(`${root}/batch-157.webp`),position:'center 55%'},
  exterior:{src:asset(`${root}/batch-165.webp`),position:'center 52%'},
  roof:{src:roofServiceHero,position:'center 46%'},
  fence:{src:asset(`${root}/batch-002.webp`),position:'center 50%'},
  outdoor:{src:asset(`${root}/batch-108.webp`),position:'center 58%'},
  wallpaper:{src:asset(`${root}/batch-005.webp`),position:'center 45%'},
  plaster:{src:asset(`${root}/batch-073.webp`),position:'center 52%'},
  serviceAreas:{src:asset(`${root}/batch-010.webp`),position:'center 48%'},
}

export const roofHomepageCardImage={src:roofCommercialCoating,position:'center 65%'}

export const newBatchPhotoCount=Object.values(groups).reduce((total,indexes)=>total+indexes.length,0)
