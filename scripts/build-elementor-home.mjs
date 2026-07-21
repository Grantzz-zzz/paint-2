import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

let sequence = 0
const id = () => (++sequence).toString(16).padStart(8, '0')
const imageBase = 'https://grantzz-zzz.github.io/paint-2/assets/'

function container(css, elements = [], settings = {}) {
  return { id: id(), elType: 'container', isInner: false, settings: { content_width: 'full', css_classes: css, ...settings }, elements }
}

function widget(widgetType, settings, css = '') {
  return { id: id(), elType: 'widget', widgetType, settings: { _css_classes: css, ...settings }, elements: [] }
}

const heading = (text, css = '', tag = 'h2') => widget('heading', { title: text, header_size: tag }, css)
const text = (html, css = '') => widget('text-editor', { editor: html }, css)
const button = (label, url, css = '') => widget('button', { text: label, link: { url, is_external: '', nofollow: '', custom_attributes: '' }, size: 'md' }, css)
const image = (url, alt, css = '') => widget('image', { image: { url, id: '', alt, source: 'library' }, image_size: 'full' }, css)
const eyebrow = label => heading(label, 'spp-el-eyebrow', 'div')

const services = [
  ['Residential painting', 'Thoughtful interior and exterior finishes that make home feel new again.', 'maroon'],
  ['Commercial painting', 'Flexible, low-disruption painting for offices, retail, strata and more.', 'green'],
  ['Interior & exterior', 'Detailed preparation and durable finishes, inside and out.', 'gold'],
  ['Roof restoration', 'Clean, repair, seal and coat for stronger weather protection.', 'teal'],
  ['Decks & fences', 'Stains and coatings designed to stand up to Melbourne weather.', 'terracotta'],
  ['Colour consultation', 'Clear, confident colour choices that work with your architecture.', 'navy'],
  ['Spray painting', 'Smooth, modern finishes for cabinetry, doors and detailed surfaces.', 'green'],
  ['Carpentry & repairs', 'Plaster, weatherboard and light timber repairs before we paint.', 'maroon'],
]

const trust = [
  ['Fully insured', 'Your property and peace of mind are protected.'],
  ['Premium materials', 'Proven Australian paint systems for lasting results.'],
  ['On time, every time', 'Clear schedules, prompt arrivals and no loose ends.'],
  ['Respectfully clean', 'Careful protection, tidy sites and a spotless handover.'],
]

const projects = [
  ['Warm modern interior', 'Interior project · Melbourne', 'projects/interior/interior-04.webp'],
  ['Exterior transformation', 'Residential project · Melbourne', 'projects/exterior/exterior-07.webp'],
  ['Commercial precision', 'Commercial project · Melbourne', 'projects/commercial/commercial-02.webp'],
]

const testimonials = [
  ['I’m truly amazed by their quality of work and dedication. The painters were courteous, friendly and completed outstanding paintwork in a short time.', 'John', 'Residential painting'],
  ['They painted the exterior of our house and did an amazing job. The team arrived on time every morning. We’re very happy and would definitely use them again.', 'Jenny', 'Exterior repaint'],
  ['Afshin and his team transformed my office with incredible paintwork. The space looks as good as new.', 'Philip', 'Commercial painting'],
]

const sectionHeading = (label, title, copy) => container('spp-el-section-heading', [
  container('spp-el-heading-copy', [eyebrow(label), heading(title)]),
  text(`<p>${copy}</p>`, 'spp-el-lead'),
])

const content = [
  container('spp-el-section spp-el-hero', [
    image(`${imageBase}hero-painter.png`, 'Professional painter applying a deep red finish in a modern Melbourne home', 'spp-el-hero-image'),
    container('spp-el-shell spp-el-hero-shell', [
      container('spp-el-hero-copy', [
        eyebrow('Melbourne painters who care'),
        heading('Made to feel<br><em>beautiful.</em><br>Made to last.', 'spp-el-display', 'h1'),
        text('<p>Premium residential and commercial painting, delivered with careful preparation, honest advice and a finish we’re proud to put our name on.</p>', 'spp-el-hero-lead'),
        container('spp-el-actions', [button('Get a free quote →', '/contact/', 'spp-el-primary'), button('See our work ↘', '#projects', 'spp-el-secondary')]),
        text('<p>✓ Fully insured&nbsp;&nbsp;&nbsp; ✓ Free colour advice&nbsp;&nbsp;&nbsp; ✓ Melbourne-wide</p>', 'spp-el-trustline'),
      ]),
    ]),
    container('spp-el-stamp', [text('<small>Quality finish</small><strong>100%</strong><small>Every detail</small>')]),
  ]),

  container('spp-el-section spp-el-services', [
    container('spp-el-shell', [
      sectionHeading('What we paint', 'Every surface deserves<br><em>the right finish.</em>', 'From one carefully refreshed room to a complete commercial transformation, our experienced team brings the same care to every job.'),
      container('spp-el-service-grid', services.map(([title, copy, tone], index) => container(`spp-el-service-card tone-${tone}`, [
        heading(String(index + 1).padStart(2, '0'), 'spp-el-card-number', 'span'),
        heading(title, 'spp-el-card-title', 'h3'),
        text(`<p>${copy}</p>`, 'spp-el-card-copy'),
        heading('↗', 'spp-el-card-arrow', 'span'),
      ]))),
    ]),
  ]),

  container('spp-el-section spp-el-commercial', [container('spp-el-shell', [
    container('spp-el-commercial-top', [
      container('', [eyebrow('Commercial specialists'), heading('We keep your business<br><em>looking its best.</em>')]),
      container('', [text('<p>Professional finishes, clear communication and scheduling built around your operation—from a single office to multi-site projects.</p>', 'spp-el-lead'), text('<p><span>Offices</span><span>Retail</span><span>Warehouses</span><span>Medical</span><span>Education</span><span>Hospitality</span><span>Strata</span></p>', 'spp-el-tags')]),
    ]),
    container('spp-el-process', [
      container('spp-el-process-label', [heading('Our process', '', 'span'), text('<p>Simple, transparent, stress-free.</p>')]),
      ...['Inspect & quote', 'Plan & schedule', 'Prep & prime', 'Paint & perfect', 'Final walkthrough'].map((label, index) => container('spp-el-process-step', [heading(String(index + 1).padStart(2, '0'), '', 'span'), heading(label, '', 'h3')])),
    ]),
  ])]),

  container('spp-el-section spp-el-projects', [container('spp-el-shell', [
    sectionHeading('Selected work', 'Colour changes<br><em>everything.</em>', 'Explore the care behind every edge, every surface and every final coat. Hover a project to reveal the colour beneath.'),
    container('spp-el-project-grid', projects.map(([title, type, src], index) => container(`spp-el-project spp-el-project-${index + 1}`, [
      image(`${imageBase}client/${src}`, title),
      heading(title, '', 'h3'),
      text(`<p>${type}</p>`),
    ]))),
  ])], { html_tag: 'section', css_id: 'projects' }),

  container('spp-el-section spp-el-why', [container('spp-el-shell spp-el-why-grid', [
    container('spp-el-why-copy', [eyebrow('The Superior difference'), heading('Good painting starts<br><em>before the first coat.</em>'), text('<p>We listen, prepare properly and communicate clearly. It’s how we deliver polished, durable work—without turning your home or workplace upside down.</p>', 'spp-el-lead'), button('Talk to our team ↗', 'tel:0470234567', 'spp-el-secondary')]),
    container('spp-el-trust-grid', trust.map(([title, copy]) => container('spp-el-trust-card', [heading('✓', 'spp-el-check', 'span'), heading(title, '', 'h3'), text(`<p>${copy}</p>`)]))),
  ])]),

  container('spp-el-section spp-el-areas', [container('spp-el-shell spp-el-areas-grid', [
    container('', [eyebrow('Melbourne-wide'), heading('Your local painting team,<br><em>wherever you are.</em>'), text('<p>Based in Melbourne and proudly servicing homes and businesses across the south-east and surrounding suburbs.</p>', 'spp-el-lead')]),
    container('spp-el-suburbs', ['Chadstone','Mount Waverley','Glen Waverley','Oakleigh','Mulgrave','Clayton','Dandenong','Springvale','Keysborough','Berwick','Narre Warren','Endeavour Hills'].map(suburb => heading(`⌖ ${suburb}`, 'spp-el-chip', 'span'))),
  ])]),

  container('spp-el-section spp-el-testimonials', [container('spp-el-shell spp-el-testimonial-grid', [
    container('', [eyebrow('Kind words'), heading('Loved by<br><em>Melbourne locals.</em>'), container('spp-el-slider-controls', [button('←', '#', 'spp-el-review-prev'), heading('01 / 03', 'spp-el-review-count', 'span'), button('→', '#', 'spp-el-review-next')])]),
    container('spp-el-review-stage', testimonials.map(([quote, name, project], index) => container(`spp-el-review${index ? ' is-hidden' : ''}`, [heading('★★★★★', 'spp-el-stars', 'div'), text(`<blockquote>“${quote}”</blockquote>`), heading(name, '', 'h3'), text(`<p>${project}</p>`)]))),
  ])]),

  container('spp-el-section spp-el-contact', [container('spp-el-shell spp-el-contact-grid', [
    container('', [eyebrow('Let’s talk colour'), heading('Ready for a<br><em>fresh start?</em>'), text('<p>Tell us what you’re planning. We’ll arrange a free, no-obligation quote and help you choose the right way forward.</p>', 'spp-el-lead'), text('<p><a href="tel:0470234567">Call us&nbsp; <strong>0470 234 567</strong></a><br><a href="mailto:sppainting.remodeling@gmail.com">Email us&nbsp; <strong>sppainting.remodeling@gmail.com</strong></a></p>', 'spp-el-contact-links')]),
    widget('shortcode', { shortcode: '[spp_quote_form]' }, 'spp-el-form'),
  ])], { html_tag: 'section', css_id: 'contact' }),
]

const template = {
  content,
  page_settings: { hide_title: 'yes', page_layout: 'default' },
  version: '0.4',
  title: 'Superior Plus — React Homepage',
  type: 'page',
}

const output = join(process.cwd(), 'wordpress-theme', 'superior-plus', 'elementor-templates')
await mkdir(output, { recursive: true })
await writeFile(join(output, 'superior-plus-home-elementor-4.2.json'), JSON.stringify(template, null, 2))
console.log(`Created Elementor template with ${sequence} editable elements.`)
