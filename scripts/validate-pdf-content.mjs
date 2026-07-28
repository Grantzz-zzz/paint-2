import { readFile } from 'node:fs/promises'

const sourceFiles = [
  'src/App.jsx',
  'src/data/siteData.js',
  'src/data/serviceAreas.js',
  'src/data/paintingGuides.js',
  'src/data/expandedPaintingGuides.js',
  'src/pages/ContentPages.jsx',
  'src/pages/ServiceAreaPages.jsx',
]

const source = (await Promise.all(sourceFiles.map(path => readFile(path, 'utf8'))))
  .join('\n')
  .toLocaleLowerCase('en-AU')

const coverage = [
  ['Homepage requirement', ['professional painters', 'eastern suburbs', 'get a free quote']],
  ['Local service-area requirement', ['service-areas', 'chadstone', 'mount waverley', 'glen waverley', 'dandenong', 'berwick']],
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
  // The client later limited public testimonials to the verified Google set.
  ['Official Google Reviews', ['chen yangyang', 'indigo jewel', 'shane mclachlan', 'timothy fagan']],
  ['Wallpaper Removal', ['vinyl wallpaper removal', 'adhesive and glue removal', 'steam removal where appropriate']],
  ['SEO Blog 1 — Preparing for painters', ['moving furniture', 'protecting floors', 'removing wall decorations', 'what homeowners should expect']],
  ['SEO Blog 2 — Interior house painting', ['walls, ceilings, doors', 'choosing paint colours', 'how long interior painting takes']],
  ['SEO Blog 3 — Exterior house painting', ['weather protection', 'timber protection', 'render and brick painting', 'preventing water damage']],
  ['SEO Blog 4 — Commercial painting', ['office painting', 'retail shop painting', 'warehouse painting', 'reducing business disruption']],
  ['SEO Blog 5 — Roof painting', ['roof cleaning', 'roof repairs', 'priming and roof coatings', 'tile and suitable metal roof painting']],
  ['SEO Blog 6 — Crack repairs', ['hairline cracks', 'water-damaged plaster', 'caulking and gaps', 'preparation before the finish coats']],
  ['SEO Blog 7 — 2026 colours', ['modern warm neutrals', 'expressive and earthy colour', 'soft greens, mauves and pastels', 'exterior colour trends']],
  ['SEO Blog 8 — Dulux systems', ['paint durability', 'washable interior walls', 'exterior protection', 'professional application']],
  ['SEO Blog 9 — New homes', ['new construction painting', 'builder and painter partnerships', 'final finishes', 'timelines and drying requirements']],
  ['SEO Blog 10 — Before and after', ['renovation painting', 'refreshing older melbourne homes', 'property presentation', 'real project photography']],
  ['SEO Blog 11 — Fence painting', ['timber and paling fences', 'fence spraying', 'weather protection and maintenance']],
  ['SEO Blog 12 — Strata painting', ['apartment buildings', 'common areas', 'maintenance schedules', 'quoting large projects']],
  ['SEO Blog 13 — Paint lifespan', ['interior painting lifespan', 'exterior painting lifespan', 'signs you may need repainting', 'maintenance tips']],
  ['SEO Blog 14 — Insured contractors', ['insurance is part of responsible contracting', 'safety and property protection', 'professional standards', 'customer protection starts before work']],
  ['SEO Blog 15 — Local painter', ['start with the actual project', 'use reviews carefully', 'confirm experience and communication', 'quality checks before handover']],
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
