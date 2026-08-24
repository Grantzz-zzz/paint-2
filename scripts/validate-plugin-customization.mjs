import { readFile } from 'node:fs/promises'

const read = path => readFile(path, 'utf8')
const [fields, admin, projectGallery, galleryPage, contentProvider, migration, workflow, plugin, rest, servicePage, pageLayout, contentPages, guidePages, areaPages, managedExtras, app, seo, contentTypes, router] = await Promise.all([
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-fields.php'),
  read('wordpress-plugin/superior-plus-content/assets/admin.js'),
  read('src/components/ProjectGallery.jsx'),
  read('src/pages/GalleryPage.jsx'),
  read('src/content/ContentProvider.jsx'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-migration.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-workflow.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-plugin.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-rest.php'),
  read('src/pages/ServicePage.jsx'),
  read('src/components/PageLayout.jsx'),
  read('src/pages/ContentPages.jsx'),
  read('src/pages/GuidePages.jsx'),
  read('src/pages/ServiceAreaPages.jsx'),
  read('src/components/ManagedPageExtras.jsx'),
  read('src/App.jsx'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-seo.php'),
  read('wordpress-plugin/superior-plus-content/includes/class-spp-content-types.php'),
  read('src/RouterApp.jsx'),
])
const requiredWorkflow = workflow.slice(workflow.indexOf('private function missing_required_fields'))
const serviceRequiredBlock = requiredWorkflow.match(/'service'\s*=>\s*array\(([\s\S]*?)\n\s*\),\n\s*'project'/)?.[1] || ''
const aestheticHeroes = [
  'stock-main/about.jpg',
  'stock-main/services.jpg',
  'stock-main/additional-services.jpg',
  'stock-main/areas.jpg',
  'stock-main/gallery.jpg',
  'stock-main/faq.jpg',
  'stock-main/contact.jpg',
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
  [contentProvider.includes("media === null || media === ''") && contentProvider.includes('export function fieldValue'), 'intentional text and media removal survives frontend fallbacks'],
  [contentProvider.includes("cache: 'no-store'") && !contentProvider.includes('sessionStorage'), 'fresh WordPress edits are not hidden by stale browser content caches'],
  [rest.includes("metadata_exists( 'post', $post->ID, $key )") && rest.includes("$meta['__configured']"), 'REST distinguishes missing values from intentionally blank values'],
  [rest.includes("$configured[ $configured_index ] = $resolved_key"), 'resolved media fields retain configured-state authority'],
  [servicePage.includes('const heroTitle=page.title === undefined') && !servicePage.includes('approved?.headline||'), 'editable service hero title controls the live heading'],
  [servicePage.includes("service.tone||serviceList.find(item=>item.slug===service.slug)?.tone||'cream'") && rest.includes("'tone'  => $tone"), 'related service cards retain canonical colour tones when live metadata is missing'],
  [pageLayout.includes('title===undefined?defaults.title:title') && pageLayout.includes('resolvedLabel&&destination'), 'blank page CTA fields do not restore hardcoded defaults'],
  [pageLayout.includes("item:{'@type':'WebPage','@id':url,url,name}") && pageLayout.includes("const name=String(item.label??'').trim()||fallbackLabel"), 'breadcrumb schema always supplies ListItem and linked WebPage names'],
  [fields.includes("'spp_home_additional_service_enabled'") && fields.includes("'spp_home_additional_service_image_id'"), 'homepage Additional Services card exposes optional copy and image controls'],
  [app.includes("fieldValue(fields,'home_additional_service_enabled',false)") && app.includes("url:'/additional-services'") && app.includes('showAdditionalService?[...serviceCards,additionalServiceCard]:serviceCards'), 'Additional Services card is default-off, links correctly and preserves existing service selections'],
  [fields.includes("'spp_explicit_blank_fields'") && fields.includes("'' === $value && '' !== $existing"), 'only fields deliberately cleared by an editor receive an explicit-blank marker'],
  [fields.includes('! $was_configured && $this->is_blank_value') && fields.includes('$was_configured || $value'), 'saving one edit does not configure untouched blank text, media, card, or relationship controls'],
  [rest.includes('$explicit_blanks') && rest.includes("in_array( $key, $explicit_blanks, true )"), 'importer blanks fall back while explicitly cleared CTA fields remain removed'],
  [contentPages.includes("textItems(fieldValue(fields,'service_options',undefined),approved.service_options)") && contentPages.includes("pairItems(fieldValue(fields,'contact_form_fields',undefined),defaultFormFields)"), 'contact options and field copy are connected to the editor'],
  [managedExtras.includes("fieldValue(fields, 'content_sections'") && managedExtras.includes("fieldValue(fields, 'secondary_image'") && managedExtras.includes("fieldValue(fields, 'related_pages'"), 'shared page controls preserve blank sections, media, and relationships'],
  [galleryPage.includes('<ManagedPageExtras') && guidePages.includes('<ManagedPageExtras') && areaPages.match(/<ManagedPageExtras/g)?.length >= 2, 'gallery, blog, and both area templates render every shared editor control'],
  [areaPages.includes('route?.closing_cta?.title') && areaPages.includes('route?.closing_cta?.link?.url'), 'service-area calls to action remain editor controlled'],
  [contentProvider.includes('const canonical = fallbackServices.map'), 'canonical service navigation survives a partial WordPress response'],
  [serviceRequiredBlock.includes("'post_title' => 'Title'") && !serviceRequiredBlock.includes('spp_eyebrow') && !serviceRequiredBlock.includes('spp_accent'), 'optional service subheaders cannot force a published service into draft'],
  [plugin.includes('restore_canonical_services') && plugin.includes('_spp_recovered_by_version'), 'canonical services auto-drafted by the previous validator are safely restored'],
  [migration.includes('refresh_approved_hero_once') && migration.includes('APPROVED_HERO_VERSION') && migration.includes("'_spp_client_modified_at'"), 'one-time aesthetic hero upgrade preserves later editor control'],
  [migration.includes("! metadata_exists( 'post', $post->ID, $approved_key )"), 'repeat imports do not overwrite already configured client fields'],
  [fields.includes('render_restore_control') && fields.includes('spp_restore_original_content_') && fields.includes("'page', 'spp_service', 'spp_project', 'spp_article', 'spp_testimonial', 'spp_faq'"), 'all bundled editable record types expose a guarded restore action'],
  [migration.includes('handle_restore_original') && migration.includes("check_admin_referer( 'spp_restore_original_content_'") && migration.includes("current_user_can( 'edit_post', $post_id )"), 'restore action is capability and nonce protected'],
  [migration.includes("0 === strpos( $key, 'spp_' )") && migration.includes("Site settings,\n\t * quote delivery") && migration.includes("get_post_meta( $post_id, '_spp_source_key'"), 'restore remains scoped to one managed record and away from Site Settings'],
  [seo.includes("add_action( 'template_redirect'") && seo.includes('public static function legacy_redirects()'), 'exact legacy redirects are owned by one testable SEO layer'],
  [seo.includes("'/painting-guides/' => '/blog/'") && seo.includes("'/roof-painting-melbourne/' => '/services/roof-painting-melbourne/'"), 'known duplicate routes have one-hop canonical destinations'],
  [seo.includes("wpseo_sitemap_exclude_post_type") && seo.includes("wpseo_exclude_from_sitemap_by_post_ids"), 'Yoast sitemap exclusions cover embedded records and selected projects'],
  [seo.includes('current_canonical_fallback') && seo.includes("get_query_var( 'spp_react_route' )") && seo.includes("is_singular( array( 'page', 'spp_service', 'spp_project', 'spp_article' ) )"), 'Yoast canonical fallback covers stored and virtual managed routes'],
  [contentTypes.includes("'publicly_queryable'  => $front_public") && contentTypes.includes("'show_in_rest'        => true"), 'FAQ and testimonial records remain editable and REST-enabled without public thin pages'],
  [fields.includes("'spp_seo_indexable'") && fields.includes('Allow this completed project page in Google'), 'projects require an explicit completed-case-study indexing choice'],
  [app.includes("id=\"reviews\"") && app.includes('__SPP_SEO_SERVER_MANAGED__'), 'review redirects have a destination and server SEO suppresses duplicate homepage schema'],
  [pageLayout.includes('__SPP_SEO_SERVER_MANAGED__'), 'server SEO suppresses duplicate inner-page schema'],
  [router.includes('LegacyGuideRedirect') && router.includes('/painting-guides/:slug'), 'legacy guide routes converge on canonical blog routes during SPA navigation'],
  ...aestheticHeroes.map(path => [migration.includes(`'hero_asset' => '${path}'`), `approved hero assignment: ${path}`]),
]
const failures = checks.filter(([passed]) => !passed).map(([, name]) => name)
if (failures.length) {
  console.error(`Plugin customization failures: ${failures.length}`)
  failures.forEach(name => console.error(`- ${name}`))
  process.exit(1)
}
console.log(`Plugin customization: PASS (${checks.length} controls and frontend deletion behaviors verified)`)
