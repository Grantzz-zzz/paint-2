import { readFile } from 'node:fs/promises'

const read = path => readFile(path, 'utf8')
const [fields, admin, projectGallery, galleryPage, contentProvider] = await Promise.all([
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-fields.php'),
  read('wordpress-plugin/superior-plus-content/assets/admin.js'),
  read('src/components/ProjectGallery.jsx'),
  read('src/pages/GalleryPage.jsx'),
  read('src/content/ContentProvider.jsx'),
])
const checks = [
  [fields.includes('render_structured_field'), 'repeatable list/card renderer'],
  [fields.includes('spp-structured-json'), 'repeatable JSON field'],
  [fields.includes('json_decode( (string) $raw, true )'), 'structured/gallery JSON sanitisation'],
  [admin.includes('.spp-add-structured-item'), 'add card action'],
  [admin.includes('.spp-structured-remove'), 'delete card action'],
  [admin.includes('.spp-structured-up') && admin.includes('.spp-structured-down'), 'card reorder actions'],
  [admin.includes('.spp-gallery-replace'), 'gallery replace action'],
  [admin.includes('.spp-gallery-remove'), 'gallery delete action'],
  [admin.includes('.spp-gallery-caption') && admin.includes('.spp-gallery-position'), 'gallery naming and focal-point controls'],
  [projectGallery.includes('hasManagedItems?cmsItems:fallbackGallery.items'), 'empty service gallery stays empty'],
  [galleryPage.includes("projectsStatus==='ready'?managed"), 'empty managed main gallery stays empty'],
  [contentProvider.includes('Array.isArray(incoming) ? incoming : fallback'), 'empty repeatable sections stay empty'],
]
const failures = checks.filter(([passed]) => !passed).map(([, name]) => name)
if (failures.length) {
  console.error(`Plugin customization failures: ${failures.length}`)
  failures.forEach(name => console.error(`- ${name}`))
  process.exit(1)
}
console.log(`Plugin customization: PASS (${checks.length} controls and frontend deletion behaviors verified)`)
