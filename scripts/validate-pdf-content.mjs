import { readFile } from 'node:fs/promises'

const sourceFiles = [
  'src/App.jsx',
  'src/data/siteData.js',
  'src/pages/ContentPages.jsx',
]

const source = (await Promise.all(sourceFiles.map(path => readFile(path, 'utf8'))))
  .join('\n')
  .toLocaleLowerCase('en-AU')

const coverage = [
  ['Homepage requirement', ['professional painters', 'eastern suburbs', 'get a free quote']],
  ['About Superior Plus Painting', ['one of your most valuable investments', 'fully insured', 'free, no-obligation quotes']],
  ['Additional Services', ['caulking & gap sealing', 'tiling services', 'timber restoration', 'property maintenance']],
  ['Commercial Painting', ['aged care facilities', 'body corporate and strata', 'scheduled maintenance painting']],
  ['Deck Painting & Staining', ['deck oiling', 'moisture and uv protection', 'entertaining areas']],
  ['Exterior Painting', ['weatherboards', 'gutters and downpipes', 'reflective coating options']],
  ['Fence Painting', ['timber paling fences', 'fence spraying', 'protect plants, paving and surroundings']],
  ['Frequently Asked Questions', ['do you provide free quotes?', 'what type of paint do you use?', 'how do i book my project?']],
  ['Get in Touch Form', ['garage floor coatings', 'driveway painting & coatings', 'property address', 'property type']],
  ['Interior Painting', ['bathrooms and laundries', 'hallways and staircases', 'home offices and studies']],
  ['Our Painting Process', ['transparent pricing', 'drop sheets', 'manufacturer drying guidance', 'final walkthrough']],
  ['Plaster Repairs', ['water-damaged plaster', 'cornice repairs', 'investment properties']],
  ['Residential Painting', ['new home painting', 'feature walls', 'garage and roof painting']],
  ['Roof Painting', ['concrete tile roofs', 'suitable colorbond repainting', 'protective roof coatings']],
  ['Testimonials & Reviews', ['professional & reliable', 'excellent quality', 'great communication', 'value for money']],
  ['Wallpaper Removal', ['vinyl wallpaper removal', 'adhesive and glue removal', 'steam removal where appropriate']],
]

const failures = []

for (const [document, phrases] of coverage) {
  for (const phrase of phrases) {
    if (!source.includes(phrase.toLocaleLowerCase('en-AU'))) {
      failures.push(`${document}: missing “${phrase}”`)
    }
  }
}

console.log(`PDF content documents checked: ${coverage.length}`)
console.log(`Required content markers checked: ${coverage.reduce((total, [, phrases]) => total + phrases.length, 0)}`)

if (failures.length) {
  console.error(`Failures: ${failures.length}`)
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log('Result: PASS')
}
