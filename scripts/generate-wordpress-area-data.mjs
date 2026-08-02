import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { serviceAreas, serviceAreaRegions } from '../src/data/serviceAreas.js'

const root = resolve(import.meta.dirname, '..')
const output = join(
  root,
  'wordpress-plugin',
  'superior-plus-content',
  'data',
  'service-areas.json',
)

const regionDescriptions = Object.fromEntries(
  serviceAreaRegions.map(region => [region.title, region.description]),
)

const payload = {
  schema_version: '1.0.0',
  generated_from: 'src/data/serviceAreas.js',
  regions: serviceAreaRegions.map(({ id, title, description }) => ({
    id,
    title,
    description,
  })),
  areas: serviceAreas.map(area => ({
    slug: area.slug,
    name: area.name,
    region: area.region,
    region_description: regionDescriptions[area.region] || '',
    property_types: area.propertyTypes,
    service_slugs: area.serviceSlugs,
    local_context: area.localContext,
    neighbour_slugs: area.neighbours,
  })),
}

await mkdir(dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(`Generated ${payload.areas.length} editable service areas at ${output}`)
