import { readFile, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const categories = [
  'residential',
  'commercial',
  'interior',
  'exterior',
  'roof',
  'fence',
  'outdoor',
  'wallpaper',
  'plaster',
]

const migration = await readFile(
  join(root, 'wordpress-plugin', 'superior-plus-content', 'includes', 'class-spp-content-migration.php'),
  'utf8',
)
const galleryPage = await readFile(join(root, 'src', 'pages', 'GalleryPage.jsx'), 'utf8')
const projectMedia = await readFile(join(root, 'src', 'data', 'projectMedia.js'), 'utf8')
const failures = []

for (const category of categories) {
  if (!migration.includes(`'${category}' =>`)) {
    failures.push(`Importer is missing the ${category} Project gallery`)
  }
  if (!galleryPage.includes(`['${category}'`)) {
    failures.push(`Gallery page is missing the ${category} section`)
  }
  if (!projectMedia.includes(`${category}:`)) {
    failures.push(`Bundled gallery fallback is missing ${category}`)
  }
}

for (const required of [
  'Create every gallery shell before importing any media',
  '$new_records[ $category ] = $is_new;',
  'foreach ( $labels as $category => $title ) {',
  'const hasManagedRecord=matchingProjects.length>0',
]) {
  const source = required.startsWith('const ') ? galleryPage : migration
  if (!source.includes(required)) failures.push(`Missing gallery recovery guard: ${required}`)
}

await stat(join(root, 'wordpress-theme', 'superior-plus', 'react-dist', '.vite', 'manifest.json'))

console.log(JSON.stringify({
  project_groups: categories.length,
  groups: categories,
  failures,
}, null, 2))

if (failures.length) process.exit(1)
