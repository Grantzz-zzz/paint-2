# Superior Plus locked-design content architecture

Status: Phase 1 contract  
Visual authority: the React source in `src/`  
Preservation authority: `baseline/site-baseline.json` and `baseline/PARITY_CONTRACT.md`

## 1. Boundary

The WordPress build has two separately updateable packages:

1. **Superior Plus React Theme**
   - Owns the compiled React application, components, CSS, fonts, icons, breakpoints,
     animation, responsive rules, page shells, and fallback data.
   - Does not register or delete client content.
2. **Superior Plus Content plugin**
   - Owns post types, fields, permissions, validation, Media Library relationships,
     import/export, REST responses, and the quote endpoint.
   - Does not expose layout, CSS, font, spacing, animation, or arbitrary class controls.

Elementor, UAE, and MetForm are not frontend dependencies. Their existing records do
not need to be deleted, but their templates, headers, footers, CSS, and JavaScript must
not render inside the React site.

## 2. WordPress records

| Record | WordPress storage | Purpose |
| --- | --- | --- |
| Site settings | One private `spp_site_config` post | Business details, social links, shared labels, footer, trust strip, service areas; post storage provides revisions |
| Home | Core `page`, template key `home` | All homepage copy, images, selected services/projects/testimonials, and SEO |
| About | Core `page`, template key `about` | About hero, editorial sections, archive image, standards, and SEO |
| Services directory | Core `page`, template key `services_directory` | Directory hero, introductions, additional services, CTA, and SEO |
| Process | Core `page`, template key `process` | Hero, master ordered process, proof points, CTA, and SEO |
| FAQs | Core `page`, template key `faqs` | Hero, selected FAQ records, CTA, and SEO |
| Contact | Core `page`, template key `contact` | Hero, next-step copy, form labels/options, direct contact presentation, and SEO |
| Standard page | Core `page`, template key `standard` | Locked hero plus approved text/image sections and CTA |
| Landing page | Core `page`, template key `landing` | Optional locked campaign page; same design tokens and allowed sections |
| Service | `spp_service` post type | One locked service page, ordered scope/process/benefits, related services, gallery, and SEO |
| Project | `spp_project` post type | Project title, type, featured media, crop metadata, gallery media, and publication state |
| Testimonial | `spp_testimonial` post type | Quote, attribution/label, project label, rating, verified/placeholder state |
| FAQ | `spp_faq` post type | Question and answer |

All public records support title, author, draft/publish state, revisions, preview, menu
order where relevant, and `show_in_rest`. The plugin must never delete these records
on deactivation, theme switch, plugin update, or uninstall. Destructive uninstall is a
separate administrator-only tool with an explicit confirmation phrase.

## 3. Locked templates

The template key selects a React component; it never contains component markup.

| Key | React renderer | Client may change | Locked |
| --- | --- | --- | --- |
| `home` | `App` homepage sections | Copy, links, record selections, images | Section order, card geometry, animation, colors |
| `about` | `AboutPage` | Copy, hero/editorial/archive images, standards | Editorial grid and archive layout |
| `services_directory` | `ServicesPage` | Intro copy, extra-service items, CTA | Service-card design and directory behavior |
| `process` | `ProcessPage` | Copy, ordered steps, proof points | Step design and proof section |
| `faqs` | `FAQsPage` | Copy and ordered FAQ selection | Accordion behavior |
| `contact` | `ContactPage` | Copy, labels, options, recipient settings | Form layout and success/error presentation |
| `service` | `ServicePage` | Service content and ordered gallery | Scope/process/benefit/gallery/related layout |
| `standard` | New locked standard renderer | Approved text, images, CTA | Supported section types and their layout |
| `landing` | New locked landing renderer | Approved campaign content | Supported section types and their layout |

The existing design tone for each imported page is stored as protected system meta
`_spp_design_variant`. Editors cannot change it. New pages receive a valid variant at
creation from a deterministic plugin rule; administrators may correct it only through
the plugin's system tools. Allowed values are `maroon`, `green`, `gold`, `teal`,
`terracotta`, and `cream`.

## 4. Field rules

### Shared page fields

- `title`, `slug`, `status`, `menu_order`
- `eyebrow`, `hero_title`, `hero_accent`, `hero_intro`
- `hero_image_id`, `hero_image_alt`
- `closing_cta_title`, `closing_cta_text`, `closing_cta_label`,
  `closing_cta_destination`
- `seo_title`, `seo_description`, `canonical_url`, `social_image_id`
- protected: `template_key`, `design_variant`, `source_key`, `import_version`,
  `client_modified_at`

### Global site settings

- Business name, legal/display name, phone display, normalized phone, email, location
- Instagram and future approved social URLs
- Logo attachment and accessible name
- Primary navigation labels and page destinations, maximum two levels
- Footer introduction, column headings, selected links, copyright, closing line
- Four ordered trust-strip labels
- Ordered service-area/suburb strings
- Shared closing CTA defaults
- Quote recipient and privacy/consent settings (administrator only)

The primary menu uses a normal WordPress navigation menu, but the REST presenter
normalizes it to two levels. The Services item always receives every published
`spp_service` child ordered by `menu_order`; this prevents newly published services
from becoming impossible to find.

### Homepage

- Hero eyebrow, title lines, accent line, intro, primary/secondary CTA, hero image
- Ordered trust points
- Services-section introduction and selected service IDs
- Commercial feature copy, CTA, feature image
- Ordered process summary referencing the master steps
- Selected project IDs
- Why-us introduction, direct-contact label, ordered trust cards
- Areas introduction and optional selected suburbs
- Selected testimonial IDs
- Quote-section copy, response-time label, form field labels/placeholders

### Service

- Directory excerpt
- Hero fields
- Scope heading and ordered scope strings
- Process introduction and ordered process strings
- Why/preparation paragraph
- Ordered benefits
- Ordered related service IDs
- Ordered gallery items
- SEO fields

### Core pages

The page-specific fields mirror the exact sections currently rendered in
`src/pages/ContentPages.jsx`. Structured lists use stable item IDs and explicit
`order`; they are never stored as comma-separated text.

### Project gallery item

```json
{
  "id": "stable-uuid",
  "type": "image",
  "attachment_id": 123,
  "poster_attachment_id": 0,
  "alt": "Exterior repaint by Superior Plus Painting",
  "caption": "",
  "object_position": "50% 50%",
  "is_placeholder": false,
  "order": 10
}
```

- `type` is `image` or `video`.
- `attachment_id` must be a valid image/video attachment the editor may read.
- Videos use a video `attachment_id` and an image `poster_attachment_id`.
- `object_position` accepts two percentages only and preserves current cropping.
- The REST API resolves attachment IDs into derivative URLs and dimensions.
- The React client never stores WordPress URLs back into content.
- Galleries have no fixed slot count. Editors can add, remove, replace, reorder,
  caption, and set alt text without changing the gallery component.
- `is_placeholder` preserves the visible showcase disclosure until a real client
  project image replaces it.

## 5. Component-to-content map

| React area | WordPress source |
| --- | --- |
| `Navbar`, mobile menu, Services dropdown | Primary menu plus published services |
| `Logo` | Site settings logo attachment; bundled logo fallback |
| Homepage `Hero` | Home-page hero fields |
| Homepage `Services` | Home section copy plus selected/published services |
| Homepage `Commercial` | Home commercial feature |
| Homepage `Projects` | Selected `spp_project` records |
| Homepage `WhyUs` | Home why-us fields and trust-card repeater |
| `Areas`, `AreasBand` | Site settings service areas plus route copy |
| Homepage `Testimonials`, `TestimonialBand` | Selected/published testimonials |
| Homepage `Contact`, contact-page form | Home/contact labels plus protected form settings |
| `Footer` | Site settings and normalized navigation |
| `PageLayout` metadata/schema | Route SEO, global business, route breadcrumbs |
| `PageHero` | Shared page/service hero fields |
| `TrustStrip` | Site settings trust labels |
| `ServicesPage` directory | All published services |
| `ProcessPage` | Process-page ordered steps and proof points |
| `FAQsPage` | FAQ-page selected/published FAQ records |
| `ServicePage` | `spp_service` fields and related service relationships |
| `ProjectGallery` | Ordered gallery item records with resolved media |
| `ClosingCTA` | Route override merged with global CTA defaults |

## 6. REST contract

Namespace: `/wp-json/spp/v1`

| Method/path | Public result |
| --- | --- |
| `GET /bootstrap` | Schema version, global settings, normalized navigation, footer, trust strip, suburbs |
| `GET /routes/{path}` | Published route, template key, SEO, and template-specific content |
| `GET /services` | Ordered published service summaries |
| `GET /services/{slug}` | One published service with media and related summaries |
| `GET /projects` | Published project summaries; optional IDs/category query |
| `GET /faqs` | Published FAQs in configured order |
| `GET /testimonials` | Published testimonials in configured order |
| `GET /export` | Administrator-only portable content package |
| `POST /import` | Administrator-only validated import with dry-run support |
| `POST /quote` | Public enquiry submission with nonce/token, rate limit, validation, and spam checks |

Every successful response contains `schema_version`, `generated_at`, and `data`.
Responses expose published content only, use resolved absolute media URLs, and include
an `ETag`. Unknown or unpublished routes return a real 404 response.

Administrative writes use authenticated WordPress screens or standard authenticated
REST operations with cookie authentication and `X-WP-Nonce`. The public API does not
expose content mutation. `spp-content-contract.schema.json` is the machine-readable
shape consumed by the React adapter and QA.

## 7. Sanitization and permissions

| Value | Sanitization/validation |
| --- | --- |
| Single-line text | `sanitize_text_field`, length limit |
| Multi-line plain copy | `sanitize_textarea_field`, length limit |
| Approved rich text | `wp_kses_post`; no scripts, inline style, classes, embeds, or shortcodes |
| Email | `sanitize_email` plus `is_email` |
| Phone | store display text plus normalized E.164-compatible digits |
| Internal destination | published post ID or validated same-site path |
| External URL | `esc_url_raw`, HTTPS allow-list where applicable |
| Attachment | positive ID, `attachment` post type, expected MIME family |
| Relationship | existing allowed post type, editor can read it |
| Repeater | maximum count, stable ID, normalized order, per-item validation |
| SEO description | plain text and length limit |

Capabilities:

- `manage_spp_content`: edit site/home/core content and ordered collections.
- `edit_spp_services`, `publish_spp_services`, `delete_spp_services`.
- `edit_spp_projects`, `publish_spp_projects`, `delete_spp_projects`.
- `manage_spp_system`: import/export, recipient, protected design variant, maintenance.

The plugin grants content capabilities to Administrator and Editor on activation.
Only Administrator receives `manage_spp_system`. Every custom save action verifies
capability, record ownership where applicable, nonce, autosave/revision state, and
the expected post type.

## 8. Fallback and merge behavior

The existing modules in `src/data/` remain a complete, production-safe fallback.

1. Load `/bootstrap` once and cache it for the session.
2. Load only the current route payload.
3. Validate responses against the versioned contract.
4. Accept only known fields; never spread unknown API data into component props.
5. Deep-merge valid, present values onto that route's local fallback.
6. Missing or invalid values retain the local value.
7. A section disappears only when its supported `enabled` flag is explicitly `false`.
8. Network, JSON, version, or validation failure renders the complete local route.
9. Media failures use the corresponding local media item, never a blank layout.

This behavior permits CMS integration section by section without making incomplete
WordPress records damage the approved frontend.

## 9. Import, export, and update safety

The portable JSON package contains a manifest, schema version, source keys, records,
relationships, media metadata, and checksums. It does not depend on database IDs.

- Initial records receive immutable `source_key` values matching the React dataset.
- The importer resolves relationships and media to local WordPress IDs.
- A dry run reports creates, safe updates, conflicts, missing media, and validation errors.
- Re-running an import cannot duplicate records.
- Once a record differs from its last imported checksum, it is client-modified.
- Normal imports and plugin/theme updates never overwrite client-modified fields.
- An explicit administrator conflict-resolution screen is required to replace them.
- Database migrations are versioned, additive where possible, restartable, and backed
  up before destructive transformation.

## 10. Acceptance gates for implementation

- The plugin can be deactivated while React renders the complete baseline fallback.
- Theme replacement or update leaves all WordPress records intact.
- Editors see content/media controls but no design controls.
- All 15 baseline routes can be represented without losing a string, asset assignment,
  crop, ordering rule, relationship, SEO field, or interaction state.
- A new service can be drafted, previewed, published, automatically listed, and
  unpublished without editing React code.
- Gallery media can be added and reordered without a theme rebuild.
- Export followed by import into a clean staging site reproduces the content graph.
- Automated parity QA remains governed by `baseline/PARITY_CONTRACT.md`.
