import { readFile } from 'node:fs/promises'

const read = path => readFile(path, 'utf8')
const [fields, admin, projectGallery, galleryPage, contentProvider, migration, workflow, plugin] = await Promise.all([
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-fields.php'),
  read('wordpress-plugin/superior-plus-content/assets/admin.js'),
  read('src/components/ProjectGallery.jsx'),
  read('src/pages/GalleryPage.jsx'),
  read('src/content/ContentProvider.jsx'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-migration.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-workflow.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-plugin.php'),
])
const requiredWorkflow = workflow.slice(workflow.indexOf('private function missing_required_fields'))
const serviceRequiredBlock = requiredWorkflow.match(/'service'\s*=>\s*array\(([\s\S]*?)\n\s*\),\n\s*'project'/)?.[1] || ''
const aestheticHeroes = [
  'stock-main/about.webp',
  'stock-main/services.webp',
  'stock-main/additional-services.webp',
  'stock-main/areas.webp',
  'stock-main/gallery.webp',
  'stock-main/faq.webp',
  'stock-main/contact.webp',
  'client/heroes/our-process-house-hero.jpg',
  'client/heroes/blog-house-hero.jpg',
]
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
  [galleryPage.includes("projectsStatus==='ready'&&hasManagedRecord"), 'empty managed main gallery stays empty while missing groups recover'],
  [contentProvider.includes('Array.isArray(incoming) ? incoming : fallback'), 'empty repeatable sections stay empty'],
  [contentProvider.includes('const canonical = fallbackServices.map'), 'canonical service navigation survives a partial WordPress response'],
  [serviceRequiredBlock.includes("'post_title' => 'Title'") && !serviceRequiredBlock.includes('spp_eyebrow') && !serviceRequiredBlock.includes('spp_accent'), 'optional service subheaders cannot force a published service into draft'],
  [plugin.includes('restore_canonical_services') && plugin.includes('_spp_recovered_by_version'), 'canonical services auto-drafted by the previous validator are safely restored'],
  [migration.includes('refresh_approved_hero_once') && migration.includes('APPROVED_HERO_VERSION'), 'one-time aesthetic hero upgrade preserves later editor control'],
  ...aestheticHeroes.map(path => [migration.includes(`'hero_asset' => '${path}'`), `approved hero assignment: ${path}`]),
]
const failures = checks.filter(([passed]) => !passed).map(([, name]) => name)
if (failures.length) {
  console.error(`Plugin customization failures: ${failures.length}`)
  failures.forEach(name => console.error(`- ${name}`))
  process.exit(1)
}
console.log(`Plugin customization: PASS (${checks.length} controls and frontend deletion behaviors verified)`)
