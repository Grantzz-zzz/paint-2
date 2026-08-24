import { useId, useState } from 'react'
import { Check } from 'lucide-react'
import { compatibleThemeImageUrl } from '../utils/assets'

function SectionEyebrow({ children }) {
  return <div className="eyebrow text-maroon"><span className="eyebrow-line"/>{children}</div>
}

function cleanListItem(item) {
  const value = typeof item === 'string' ? item : item?.text
  return String(value || '').replace(/^\s*(?:[•●▪◦*-]|\d+[.)])\s*/, '').trim()
}

export function splitEditableCopy(value) {
  let source = String(value || '').replace(/\r\n?/g, '\n')
  if (/<[a-z][\s\S]*>/i.test(source)) {
    const withBreaks = source
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p\s*>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<\/li\s*>/gi, '')
    if (typeof document !== 'undefined') {
      const decoder = document.createElement('div')
      decoder.innerHTML = withBreaks
      source = decoder.textContent || ''
    } else {
      source = withBreaks.replace(/<[^>]+>/g, '')
    }
  }
  source = source.trim()
  if (!source) return { paragraphs: [], items: [] }

  const items = []
  const paragraphBlocks = []
  let current = []
  const flush = () => {
    if (current.length) paragraphBlocks.push(current.join(' ').replace(/\s+/g, ' ').trim())
    current = []
  }

  source.split('\n').forEach(rawLine => {
    const line = rawLine.trim()
    if (!line) {
      flush()
      return
    }
    if (/^(?:[•●▪◦*-]|\d+[.)])\s+/.test(line)) {
      flush()
      const item = cleanListItem(line)
      if (item) items.push(item)
      return
    }
    current.push(line)
  })
  flush()
  return { paragraphs: paragraphBlocks.filter(Boolean), items }
}

export function structuredSections(value, fallback = []) {
  const source = value === undefined ? fallback : value
  if (!Array.isArray(source)) return []
  return source.map((entry, index) => {
    const item = Array.isArray(entry)
      ? { title: entry[0], text: entry[1] }
      : (entry || {})
    const body = splitEditableCopy(item.text ?? item.description ?? item.body ?? (Array.isArray(item.paragraphs) ? item.paragraphs.join('\n\n') : ''))
    const explicitItems = Array.isArray(item.items)
      ? item.items.map(cleanListItem).filter(Boolean)
      : String(item.items || '').split(/\r?\n/).map(cleanListItem).filter(Boolean)
    return {
      id: item.id || `${item.title || item.heading || 'section'}-${index}`,
      eyebrow: String(item.eyebrow || ''),
      title: String(item.title || item.heading || item.label || ''),
      paragraphs: body.paragraphs,
      items: [...body.items, ...explicitItems],
      style: ['auto', 'white', 'cream', 'green', 'maroon', 'gold'].includes(item.style) ? item.style : 'auto',
      layout: ['text', 'image-left', 'image-right', 'image-background'].includes(item.layout) ? item.layout : 'text',
      image: item.image?.url ? item.image : null,
      imageAlt: String(item.image_alt || item.image?.alt || ''),
      imagePosition: /^((100|[0-9]{1,2})%) ((100|[0-9]{1,2})%)$/.test(item.image_position || '') ? item.image_position : '50% 50%',
    }
  }).filter(section => section.eyebrow || section.title || section.paragraphs.length || section.items.length || section.image)
}

export function ManagedContentSection({ section, index = 0, defaultEyebrow = '', fallbackImage = null, fallbackImageAlt = '' }) {
  if (!section) return null
  const image = section.image?.url ? section.image : fallbackImage?.url ? fallbackImage : null
  const selectedLayout = section.layout || 'text'
  const layout = image ? selectedLayout : 'text'
  const tone = section.style && section.style !== 'auto' ? section.style : (index % 2 ? 'cream' : 'white')
  const background = layout === 'image-background'
  const imageAlt = section.imageAlt || image?.alt || fallbackImageAlt || section.title
  const imageUrl = compatibleThemeImageUrl(image?.url)
  return <section className={`inner-section managed-content-section tone-${tone} layout-${layout}`}>
    {background && <div className="managed-content-background" aria-hidden="true">
      <img src={imageUrl} alt="" style={{ objectPosition: section.imagePosition }}/><span/>
    </div>}
    <div className={`container managed-content-grid ${image && !background ? 'has-image' : ''}`}>
      {image && !background && <figure className="managed-content-media">
        <img src={imageUrl} alt={imageAlt} loading="lazy" decoding="async" style={{ objectPosition: section.imagePosition }}/>
        <figcaption>Superior Plus project</figcaption>
      </figure>}
      <div className="managed-content-panel">
        <span className="managed-content-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <StructuredSectionCopy section={section} defaultEyebrow={defaultEyebrow}/>
      </div>
    </div>
  </section>
}

export function CompactList({ items = [] }) {
  if (!items.length) return null
  return <ul className="structured-list">
    {items.map((item, index) => <li key={`${item}-${index}`}><Check aria-hidden="true"/><span>{item}</span></li>)}
  </ul>
}

export function StructuredSectionCopy({ section, defaultEyebrow = '' }) {
  if (!section) return null
  return <div className="structured-section-copy">
    {(section.eyebrow || defaultEyebrow) && <SectionEyebrow>{section.eyebrow || defaultEyebrow}</SectionEyebrow>}
    {section.title && <h2>{section.title}</h2>}
    {section.paragraphs.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
    <CompactList items={section.items}/>
  </div>
}

export function ExpandableCopy({ text, maxCharacters = 330, className = '' }) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()
  const { paragraphs } = splitEditableCopy(text)
  const fullText = paragraphs.join(' ')
  if (!fullText) return null
  const collapsible = fullText.length > maxCharacters
  const boundary = fullText.lastIndexOf(' ', maxCharacters)
  const preview = collapsible ? `${fullText.slice(0, boundary > maxCharacters * .65 ? boundary : maxCharacters).trim()}…` : fullText
  const displayed = expanded || !collapsible ? paragraphs : [preview]

  return <div className={`expandable-copy ${className}`.trim()} id={contentId}>
    {displayed.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)}
    {collapsible && <button
      type="button"
      className="expandable-copy-toggle"
      aria-expanded={expanded}
      aria-controls={contentId}
      onClick={() => setExpanded(value => !value)}
    >{expanded ? 'Show less' : 'See more'}</button>}
  </div>
}
