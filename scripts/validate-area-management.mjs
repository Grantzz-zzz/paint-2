import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { groupManagedServiceAreas, serviceAreaRegions, serviceAreas } from '../src/data/serviceAreas.js'

const root=process.cwd()
const read=path=>readFile(join(root,path),'utf8')
const [dataset,fields,workflow,rest,app,pages]=await Promise.all([
  read('wordpress-plugin/superior-plus-content/data/service-areas.json').then(JSON.parse),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-fields.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-workflow.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-rest.php'),
  read('src/App.jsx'),
  read('src/pages/ServiceAreaPages.jsx'),
])
const alphabeticApiRecords=[...serviceAreas].sort((a,b)=>a.name.localeCompare(b.name,'en-AU'))
const orderedApiGroups=groupManagedServiceAreas(alphabeticApiRecords)

const checks=[
  ['67 managed suburb records',dataset.areas?.length===67],
  ['deduplicated suburb slugs',new Set(dataset.areas?.map(area=>area.slug)).size===67],
  ['area name field',fields.includes("'spp_area_name'")],
  ['area card image field',fields.includes("'spp_area_card_image_id'")],
  ['area services field',fields.includes("'spp_area_service_slugs'")],
  ['dedicated Areas dashboard',workflow.includes("'spp-content-areas'")&&workflow.includes('render_areas_page')],
  ['new areas are nested',workflow.includes("get_page_by_path( 'service-areas'")&&workflow.includes("'post_parent'")],
  ['public Areas endpoint',rest.includes("'areas'")&&rest.includes('public function areas()')],
  ['API navigation guard',rest.includes("'spp-areas'")&&rest.includes("home_url( '/service-areas' )")],
  ['theme navigation guard',app.includes("{id:'areas',label:'Areas',url:'/service-areas'")],
  ['homepage consumes managed areas',app.includes("useCollection('areas',serviceAreas)")],
  ['directory consumes managed areas',pages.includes("useCollection('areas',serviceAreas)")],
  ['new managed suburb routes resolve',pages.includes('routeArea||fallbackArea')],
  ['WordPress records preserve approved region order',orderedApiGroups.map(region=>region.title).join('|')===serviceAreaRegions.map(region=>region.title).join('|')],
  ['WordPress records preserve approved suburb order',orderedApiGroups.every((region,index)=>region.suburbs.join('|')===serviceAreaRegions[index].suburbs.join('|'))],
]

const failed=checks.filter(([,ok])=>!ok)
for(const [label,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${label}`)
if(failed.length) process.exit(1)
console.log(`Area management QA passed (${checks.length} checks).`)
