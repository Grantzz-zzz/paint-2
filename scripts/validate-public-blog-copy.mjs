import { readFile } from 'node:fs/promises'

const publicFiles = [
  'src/data/clientApprovedBlogs.json',
  'wordpress-plugin/superior-plus-content/data/blog-articles.json',
  'src/data/paintingGuides.js',
  'src/data/expandedPaintingGuides.js',
  'src/pages/GuidePages.jsx',
]
const failures = []
const forbiddenLabels = [/Client SEO brief/i, /Client-approved Blog/i]
const mojibake = /(?:\u00e2\u20ac|\u00c2\u00b7|\u00ef\u00bf\u00bd|\ufffd)/

for (const file of publicFiles) {
  const source = await readFile(file, 'utf8')
  if (mojibake.test(source) && !file.endsWith('GuidePages.jsx')) failures.push(`${file}: damaged punctuation remains`)
  for (const pattern of forbiddenLabels) {
    if (pattern.test(source)) failures.push(`${file}: internal editorial label remains`)
  }
}

const articles = JSON.parse(await readFile(publicFiles[0], 'utf8'))
for (const article of articles) {
  if (article.source_label !== 'Superior Plus Painting guide') failures.push(`${article.slug}: unsafe public source label`)
  if (/<ul>\s*<li>/i.test(article.content) && !/<\/li>\s*<\/ul>/i.test(article.content)) failures.push(`${article.slug}: malformed bullet list`)
}

if (failures.length) {
  console.error(`Public blog copy failures: ${failures.length}`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exit(1)
}
console.log(`Public blog copy: PASS (${articles.length} articles, clean punctuation, branded labels and valid lists)`)
