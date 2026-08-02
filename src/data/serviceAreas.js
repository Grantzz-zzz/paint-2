const area = (slug, name, region, propertyTypes, serviceSlugs, localContext, neighbours) => ({
  slug,
  name,
  region,
  propertyTypes,
  serviceSlugs,
  localContext,
  neighbours,
  path: `/service-areas/${slug}`,
})

const slugifyArea = name => name.toLocaleLowerCase('en-AU').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const coreAreaNames = new Set(['Chadstone','Mount Waverley','Glen Waverley','Oakleigh','Mulgrave','Clayton','Burwood','Ashwood','Dandenong','Noble Park','Springvale','Keysborough','Berwick','Narre Warren','Endeavour Hills'])
const pdfAreaGroups = [
  {
    id:'inner-eastern',
    title:'Inner Eastern Suburbs',
    description:'Professional residential and commercial painting across Melbourne’s inner eastern homes, renovations, rentals and local businesses.',
    names:['Hawthorn','Hawthorn East','Kew','Kew East','Camberwell','Canterbury','Balwyn','Balwyn North','Surrey Hills','Mont Albert','Deepdene','Box Hill','Box Hill North','Box Hill South'],
  },
  {
    id:'south-eastern',
    title:'South Eastern Suburbs',
    description:'Interior, exterior and property painting for Melbourne’s south-eastern suburbs.',
    names:['Malvern','Malvern East','Glen Iris','Burwood East','Wheelers Hill','Hughesdale','Oakleigh East','Oakleigh South','Clayton South'],
  },
  {
    id:'eastern',
    title:'Eastern Suburbs',
    description:'Painting and preparation services for established homes, townhouses, investment properties and workplaces across Melbourne’s east.',
    names:['Vermont','Vermont South','Forest Hill','Blackburn','Blackburn North','Blackburn South','Nunawading','Mitcham','Ringwood','Ringwood East','Ringwood North','Heathmont','Bayswater','Boronia','Wantirna','Wantirna South','Knoxfield','Ferntree Gully'],
  },
  {
    id:'outer-eastern',
    title:'Outer Eastern Suburbs',
    description:'Professional painting support for homes, renovations, rental properties and businesses throughout Melbourne’s outer east.',
    names:['Scoresby','Rowville','Lysterfield','The Basin','Croydon','Croydon Hills','Kilsyth','Montrose','Lilydale','Mooroolbark','Chirnside Park'],
  },
]

export const serviceAreaRegions = [
  ...pdfAreaGroups.map(group=>({...group,suburbs:group.names.map(slugifyArea)})),
  {
    id: 'monash-east',
    title: 'Monash & nearby eastern suburbs',
    description: 'Painting services for established homes, townhouses, units, rentals, workplaces and managed properties across Melbourne’s east.',
    suburbs: ['chadstone', 'mount-waverley', 'glen-waverley', 'oakleigh', 'mulgrave', 'clayton', 'burwood', 'ashwood'],
  },
  {
    id: 'greater-dandenong',
    title: 'Greater Dandenong',
    description: 'Residential and commercial painting for homes, apartments, shops, workplaces, warehouses and managed properties.',
    suburbs: ['dandenong', 'noble-park', 'springvale', 'keysborough'],
  },
  {
    id: 'casey',
    title: 'Casey & the outer south-east',
    description: 'Careful interior, exterior and outdoor painting for established homes, newer properties, rentals and local businesses.',
    suburbs: ['berwick', 'narre-warren', 'endeavour-hills'],
  },
]

const coreServiceAreas = [
  area(
    'chadstone',
    'Chadstone',
    'Monash & nearby eastern suburbs',
    ['Established homes', 'Units and townhouses', 'Rental properties', 'Retail and commercial spaces'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'commercial-painting-melbourne', 'plaster-repairs-melbourne'],
    'Chadstone includes a varied mix of established residential streets, units, rentals and busy commercial properties. We tailor preparation, access and scheduling to the property—whether the job is a lived-in home, a tenancy refresh or a workplace repaint.',
    ['mount-waverley', 'oakleigh', 'ashwood', 'burwood'],
  ),
  area(
    'mount-waverley',
    'Mount Waverley',
    'Monash & nearby eastern suburbs',
    ['Family homes', 'Townhouses and units', 'Renovation projects', 'Rental properties'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne', 'plaster-repairs-melbourne'],
    'Mount Waverley projects often range from individual room updates to full interior and exterior repaints. Our process accounts for occupied homes, renovation sequencing, careful protection and the surface repairs needed before a durable finish.',
    ['glen-waverley', 'chadstone', 'burwood', 'mulgrave'],
  ),
  area(
    'glen-waverley',
    'Glen Waverley',
    'Monash & nearby eastern suburbs',
    ['Family homes', 'Townhouses', 'Investment properties', 'Local commercial spaces'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'commercial-painting-melbourne', 'roof-painting-melbourne', 'deck-painting-staining-melbourne'],
    'From family homes and townhouses to investment and commercial properties, Glen Waverley painting work needs clear planning and consistent finishes. We can coordinate interiors, exteriors and suitable outdoor surfaces under one detailed quote.',
    ['mount-waverley', 'mulgrave', 'clayton'],
  ),
  area(
    'oakleigh',
    'Oakleigh',
    'Monash & nearby eastern suburbs',
    ['Weatherboard and brick homes', 'Units and apartments', 'Shops and offices', 'Rental properties'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'commercial-painting-melbourne', 'wallpaper-removal-melbourne', 'plaster-repairs-melbourne'],
    'Oakleigh has residential and commercial properties with different access, preparation and coating requirements. We assess the existing surface first, then plan repairs, protection and application around the way the property is used.',
    ['chadstone', 'clayton', 'ashwood', 'mount-waverley'],
  ),
  area(
    'mulgrave',
    'Mulgrave',
    'Monash & nearby eastern suburbs',
    ['Family homes', 'Townhouses', 'Offices and workplaces', 'Industrial and managed properties'],
    ['residential-painting-melbourne', 'commercial-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne'],
    'Mulgrave enquiries can involve family homes, townhouses, workplaces and larger managed sites. We scope the surfaces, access and operating requirements before recommending a practical painting schedule and coating system.',
    ['glen-waverley', 'clayton', 'dandenong', 'noble-park'],
  ),
  area(
    'clayton',
    'Clayton',
    'Monash & nearby eastern suburbs',
    ['Homes and units', 'Apartments and rentals', 'Offices and clinics', 'Commercial properties'],
    ['residential-painting-melbourne', 'commercial-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'wallpaper-removal-melbourne', 'plaster-repairs-melbourne'],
    'Clayton includes homes, apartments, rentals and active workplaces. We plan protection, access and drying time around residents, tenants or business operations while keeping preparation and finish quality consistent.',
    ['oakleigh', 'mulgrave', 'glen-waverley', 'springvale'],
  ),
  area(
    'burwood',
    'Burwood',
    'Monash & nearby eastern suburbs',
    ['Established homes', 'Units and townhouses', 'Rental properties', 'Renovation projects'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'fence-painting-melbourne', 'deck-painting-staining-melbourne', 'plaster-repairs-melbourne'],
    'Burwood painting projects commonly involve established homes, units, townhouses and renovation work. We pay particular attention to surface condition, old coatings, plaster repairs and protection before the first finish coat is applied.',
    ['ashwood', 'mount-waverley', 'chadstone'],
  ),
  area(
    'ashwood',
    'Ashwood',
    'Monash & nearby eastern suburbs',
    ['Established homes', 'Townhouses and units', 'Rental properties', 'Pre-sale refreshes'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'wallpaper-removal-melbourne', 'plaster-repairs-melbourne', 'fence-painting-melbourne'],
    'Ashwood homeowners, landlords and property managers can use one team for painting and the preparation behind it. That can include wallpaper removal, minor plaster repairs, interior repainting and exterior or fence updates.',
    ['chadstone', 'burwood', 'oakleigh', 'mount-waverley'],
  ),
  area(
    'dandenong',
    'Dandenong',
    'Greater Dandenong',
    ['Homes and apartments', 'Shops and offices', 'Warehouses and factories', 'Body corporate and managed properties'],
    ['commercial-painting-melbourne', 'residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'plaster-repairs-melbourne'],
    'Dandenong projects range from homes and apartments to shops, offices, warehouses and managed sites. We plan commercial work to reduce disruption and residential work to protect occupied spaces throughout preparation and painting.',
    ['noble-park', 'keysborough', 'springvale', 'mulgrave'],
  ),
  area(
    'noble-park',
    'Noble Park',
    'Greater Dandenong',
    ['Family homes', 'Units and rentals', 'Shops and offices', 'Managed properties'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'commercial-painting-melbourne', 'fence-painting-melbourne', 'plaster-repairs-melbourne'],
    'Noble Park painting services cover family homes, units, rentals and local commercial properties. We can combine surface repairs, interior and exterior painting, and suitable fence work into a clearly staged project.',
    ['dandenong', 'springvale', 'keysborough', 'mulgrave'],
  ),
  area(
    'springvale',
    'Springvale',
    'Greater Dandenong',
    ['Homes and units', 'Rental properties', 'Retail spaces', 'Offices and workplaces'],
    ['commercial-painting-melbourne', 'residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'wallpaper-removal-melbourne', 'plaster-repairs-melbourne'],
    'Springvale contains busy homes, rentals, shops and workplaces that benefit from careful staging and tidy work areas. We assess access and operating needs, then coordinate preparation and painting to minimise avoidable disruption.',
    ['noble-park', 'clayton', 'dandenong', 'keysborough'],
  ),
  area(
    'keysborough',
    'Keysborough',
    'Greater Dandenong',
    ['Established and newer homes', 'Townhouses', 'Warehouses and workplaces', 'Investment properties'],
    ['residential-painting-melbourne', 'commercial-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne'],
    'Keysborough work can include established homes, newer residential properties, townhouses and commercial sites. We match the preparation and paint system to the surface rather than using one approach for every building.',
    ['dandenong', 'noble-park', 'springvale'],
  ),
  area(
    'berwick',
    'Berwick',
    'Casey & the outer south-east',
    ['Established and newer homes', 'Townhouses', 'Rental properties', 'Local commercial spaces'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne', 'deck-painting-staining-melbourne'],
    'Berwick homeowners and property managers can coordinate complete interior and exterior painting as well as suitable roof, fence and deck coatings. Every quote considers the current surface condition, access and finish expected.',
    ['narre-warren', 'endeavour-hills'],
  ),
  area(
    'narre-warren',
    'Narre Warren',
    'Casey & the outer south-east',
    ['Family homes', 'Townhouses and units', 'Rental properties', 'Shops and offices'],
    ['residential-painting-melbourne', 'commercial-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne'],
    'Narre Warren painting enquiries include homes, townhouses, rentals and commercial spaces. We provide written scope and preparation details so owners, landlords and businesses understand how the work will be staged.',
    ['berwick', 'endeavour-hills'],
  ),
  area(
    'endeavour-hills',
    'Endeavour Hills',
    'Casey & the outer south-east',
    ['Established family homes', 'Rental properties', 'Interior renovations', 'Outdoor timber and fences'],
    ['residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne', 'deck-painting-staining-melbourne'],
    'Endeavour Hills projects often involve established homes where preparation makes the largest difference. We can assess worn coatings, minor plaster or timber defects, and suitable interior, exterior, roof, fence or deck finishes.',
    ['narre-warren', 'berwick', 'dandenong'],
  ),
]

const expandedServiceAreas = pdfAreaGroups.flatMap(group=>group.names
  .filter(name=>!coreAreaNames.has(name))
  .map((name,index,names)=>{
    const slug=slugifyArea(name)
    const neighbours=[names[(index-1+names.length)%names.length],names[(index+1)%names.length],names[(index+2)%names.length]]
      .map(slugifyArea)
      .filter(neighbour=>neighbour!==slug)
    return area(
      slug,
      name,
      group.title,
      ['Homes and apartments','Renovation and rental properties','Local businesses and managed properties','Interior and exterior projects'],
      ['residential-painting-melbourne','interior-painting-melbourne','exterior-painting-melbourne','commercial-painting-melbourne','roof-painting-melbourne','fence-painting-melbourne','deck-painting-staining-melbourne'],
      `Superior Plus Painting and Remodeling provides professional residential and commercial painting services in ${name}. The team can quote interior painting, exterior painting, roof painting, fence painting, suitable deck work and property preparation, with the final scope tailored to the actual surfaces and access.`,
      neighbours,
    )
  }))

export const serviceAreas = [...coreServiceAreas,...expandedServiceAreas]

export const serviceAreaBySlug = Object.fromEntries(serviceAreas.map(item => [item.slug, item]))
export const serviceAreaPathByName = Object.fromEntries(serviceAreas.map(item => [item.name.toLocaleLowerCase('en-AU'), item.path]))
