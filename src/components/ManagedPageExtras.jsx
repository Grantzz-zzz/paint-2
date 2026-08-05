import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Divider, Reveal } from '../App'
import { fieldValue, mediaUrl, pairItems } from '../content/ContentProvider'
import { SectionIntro } from './PageLayout'

/**
 * Shared renderer for the generic controls exposed by the WordPress editor.
 *
 * Keeping this in one component prevents a template from showing an editor
 * control that has no effect on the public page. An explicitly empty value is
 * authoritative, so clearing sections, media, or relationships removes them.
 */
export default function ManagedPageExtras({
  fields = {},
  eyebrow = 'More from Superior Plus',
  accent = 'planned around your property.',
  imageAlt = 'Superior Plus Painting project in Melbourne',
}) {
  const navigate = useNavigate()
  const sections = pairItems(fieldValue(fields, 'content_sections', undefined), [])
  const secondaryMedia = fieldValue(fields, 'secondary_image', undefined)
  const secondaryImage = mediaUrl(secondaryMedia)
  const relatedPages = fieldValue(fields, 'related_pages', undefined)
  const related = Array.isArray(relatedPages) ? relatedPages : []

  if (!sections.length && !secondaryImage && !related.length) return null

  return <>
    {sections.map(([title, body], index) => <section
      className={`inner-section managed-page-extra ${index % 2 ? 'cream' : ''}`}
      key={`${title}-${index}`}
    >
      <div className={`container ${index === 0 && secondaryImage ? 'editorial-grid' : ''}`}>
        <Reveal>
          <SectionIntro eyebrow={eyebrow} title={title} accent={accent}/>
          {body && <div className="managed-page-extra-copy" dangerouslySetInnerHTML={{ __html: body }}/>}
        </Reveal>
        {index === 0 && secondaryImage && <Reveal className="editorial-image" delay={.1}>
          <img
            src={secondaryImage}
            alt={secondaryMedia?.alt || imageAlt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: secondaryMedia?.object_position || '50% 50%' }}
          />
        </Reveal>}
      </div>
      {index === 0 && <Divider color={index % 2 ? '#fff' : '#fbf6ec'} variant="wave"/>}
    </section>)}

    {!sections.length && secondaryImage && <section className="inner-section managed-page-extra">
      <div className="container">
        <Reveal className="editorial-image managed-page-extra-image">
          <img
            src={secondaryImage}
            alt={secondaryMedia?.alt || imageAlt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: secondaryMedia?.object_position || '50% 50%' }}
          />
        </Reveal>
      </div>
    </section>}

    {related.length > 0 && <section className="inner-section managed-related-pages">
      <div className="container">
        <SectionIntro eyebrow="Keep exploring" title="Related pages" accent="from Superior Plus."/>
        <div className="related-grid">
          {related.map(page => <button
            className="related-card tone-cream"
            key={page.id ?? page.path ?? page.title}
            type="button"
            onClick={() => navigate(page.path || page.url || '/')}
          >
            <span>Superior Plus</span>
            <h3>{page.title}</h3>
            <ArrowRight/>
          </button>)}
        </div>
      </div>
    </section>}
  </>
}
