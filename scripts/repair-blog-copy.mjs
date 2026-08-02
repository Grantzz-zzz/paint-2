import { readFile, writeFile } from 'node:fs/promises'

const dataFiles = [
  new URL('../src/data/clientApprovedBlogs.json', import.meta.url),
  new URL('../wordpress-plugin/superior-plus-content/data/blog-articles.json', import.meta.url),
]
const sourceFiles = [
  new URL('../src/pages/GuidePages.jsx', import.meta.url),
  new URL('../src/pages/GalleryPage.jsx', import.meta.url),
  new URL('../src/data/paintingGuides.js', import.meta.url),
  new URL('../src/data/expandedPaintingGuides.js', import.meta.url),
]
const replacements = new Map([
  ['\u00e2\u20ac\u2122', '\u2019'],
  ['\u00e2\u20ac\u02dc', '\u2018'],
  ['\u00e2\u20ac\u0153', '\u201c'],
  ['\u00e2\u20ac\u009d', '\u201d'],
  ['\u00e2\u20ac\u201c', '\u2013'],
  ['\u00e2\u20ac\u201d', '\u2014'],
  ['\u00e2\u20ac\u00a6', '\u2026'],
  ['\u00c2\u00b7', '\u00b7'],
  ['\u00c2\u0020', ' '],
])

function repair(value) {
  if (Array.isArray(value)) return value.map(repair)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repair(item)]))
  }
  if (typeof value !== 'string') return value
  let clean = value
  for (const [broken, restored] of replacements) clean = clean.split(broken).join(restored)
  return clean
}

for (const file of dataFiles) {
  const data = repair(JSON.parse(await readFile(file, 'utf8')))
  for (const article of data) {
    if ('source_label' in article) article.source_label = 'Superior Plus Painting guide'
  }
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

for (const file of sourceFiles) {
  let source = repair(await readFile(file, 'utf8'))
  source = source
    .replace(/Client-approved Blog \d+/g, 'Superior Plus Painting guide')
    .replace(/Client SEO brief \u00b7 Expanded/g, 'Superior Plus Painting guide')
  await writeFile(file, source, 'utf8')
}

console.log(`Repaired public blog copy in ${dataFiles.length} data files and ${sourceFiles.length} source files.`)
