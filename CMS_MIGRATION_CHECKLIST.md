# Superior Plus Locked-Design CMS Migration Checklist

This checklist is the source of truth for converting the approved React website into an editable WordPress-backed site.

Reference site: https://grantzz-zzz.github.io/paint-2/

Local source: `C:\Users\Grant\Downloads\paint2`

Legend: `[ ]` not started · `[-]` in progress · `[x]` complete · `[!]` client decision required

## Non-negotiable acceptance rule

- [x] The existing React site is the visual and content baseline
- [ ] Every existing page, section, word, image, gallery and interaction remains present
- [ ] Desktop, tablet and mobile layouts remain visually equivalent to the reference
- [ ] WordPress controls content only; it does not control the approved visual design
- [ ] The client cannot accidentally change fonts, colours, spacing, shapes, animations or responsive rules
- [ ] Existing content always has a local fallback if the WordPress API is temporarily unavailable
- [ ] No migration work is pushed to the client's live WordPress site before staging approval

## Phase 0 — Baseline and preservation

- [x] Fill the four service pages without galleries using generated showcase placeholders
- [x] Add three placeholders each for Residential, Roof, Wallpaper Removal and Plaster Repairs
- [x] Connect a showcase gallery to all nine existing service pages
- [x] Confirm the GitHub Pages reference is reachable
- [x] Confirm the local React source folder
- [x] Confirm the React production build can run inside WordPress
- [x] Confirm the WordPress version contains one React header and one React footer
- [x] Confirm desktop and mobile screenshots of the current WordPress React build
- [ ] Save a machine-readable baseline of every current text string
- [ ] Save a machine-readable baseline of every current image and video assignment
- [ ] Record every button, menu item, internal link, telephone link and email link
- [ ] Record every animation, accordion, slider, gallery and form interaction
- [ ] Generate baseline screenshots for every route at desktop, tablet and mobile widths

### Required route inventory — 15 pages

- [x] 01 Home `/`
- [x] 02 About `/about`
- [x] 03 Services `/services`
- [x] 04 Our Process `/our-process`
- [x] 05 FAQs `/faqs`
- [x] 06 Contact `/contact`
- [x] 07 Residential Painting `/services/residential-painting-melbourne`
- [x] 08 Commercial Painting `/services/commercial-painting-melbourne`
- [x] 09 Interior Painting `/services/interior-painting-melbourne`
- [x] 10 Exterior Painting `/services/exterior-painting-melbourne`
- [x] 11 Roof Painting `/services/roof-painting-melbourne`
- [x] 12 Fence Painting `/services/fence-painting-melbourne`
- [x] 13 Deck Painting & Staining `/services/deck-painting-staining-melbourne`
- [x] 14 Wallpaper Removal `/services/wallpaper-removal-melbourne`
- [x] 15 Plaster Repairs `/services/plaster-repairs-melbourne`

### Asset baseline

- [x] Confirm 70 WebP images
- [x] Confirm one JPEG logo
- [x] Confirm one PNG hero image
- [x] Confirm five MP4 project videos
- [x] Add 12 clearly identified generated WebP showcase placeholders
- [ ] Record alt text, crop position and page usage for every displayed asset
- [ ] Preserve all current local files during CMS integration

## Phase 1 — Locked content architecture

- [ ] Create a separate `Superior Plus Content` companion plugin
- [ ] Keep design components, CSS and animation code inside the React theme
- [ ] Keep client-managed data inside WordPress so theme updates cannot delete it
- [ ] Register only the fields required by the approved React components
- [ ] Expose sanitized content through a versioned WordPress REST API
- [ ] Add WordPress capability and nonce protection for administration
- [ ] Add data validation for URLs, phone numbers, email addresses and media IDs
- [ ] Store image references as Media Library attachment IDs
- [ ] Preserve existing content when the plugin or theme is updated
- [ ] Add an export/import format for backup and migration

## Phase 2 — WordPress editing areas

- [ ] Global site settings: business name, phone, email, location and social links
- [ ] Header navigation labels and destinations
- [ ] Footer columns, contact details and copyright text
- [ ] Homepage hero copy, buttons, trust points and hero image
- [ ] Homepage service cards
- [ ] Homepage commercial section and process summary
- [ ] Homepage selected projects
- [ ] Homepage trust cards and service areas
- [ ] Homepage testimonials
- [ ] Homepage quote section
- [ ] About page content and imagery
- [ ] Services directory content
- [ ] Master painting process
- [ ] FAQ collection
- [ ] Contact page content
- [ ] Service pages
- [ ] Project galleries and video references
- [ ] SEO title, description, canonical data and social-sharing image per page

## Phase 3 — Controlled page creation

- [ ] Add a locked Standard Content Page template
- [ ] Add a locked Service Page template
- [ ] Add a locked Project/Gallery Page template
- [ ] Add an optional locked Landing Page template
- [ ] Let administrators choose a template when creating a page
- [ ] Show only the fields supported by the selected template
- [ ] Generate the slug and public route from WordPress
- [ ] Automatically include published services in the Services dropdown and directory
- [ ] Automatically include related-page links where configured
- [ ] Prevent unsupported layout or style values
- [ ] Provide draft, preview, publish and unpublish workflows
- [ ] Display a helpful 404 page for invalid or unpublished routes

## Phase 4 — React data integration

- [ ] Create a typed content adapter between WordPress JSON and React components
- [ ] Keep the current hardcoded data as a complete fallback dataset
- [ ] Load global content once and cache it
- [ ] Load route-specific content only when needed
- [ ] Add loading, empty and API-error states without changing the approved layout
- [ ] Replace homepage hardcoded copy with WordPress-backed values
- [ ] Replace homepage hardcoded images with WordPress-backed values
- [ ] Connect About, Services, Process, FAQs and Contact
- [ ] Connect all nine existing service pages
- [ ] Connect galleries, testimonials, projects and service areas
- [ ] Confirm no existing section disappears when an optional field is empty
- [ ] Preserve current animations after live data is inserted

## Phase 5 — Clean URLs and WordPress routing

- [ ] Replace public hash routes with clean WordPress paths
- [ ] Serve the React shell for every approved route
- [ ] Support browser refresh and direct navigation on every route
- [ ] Keep redirects from legacy hash URLs
- [ ] Register WordPress rewrite rules for dynamic service and custom pages
- [ ] Generate canonical URLs using the production domain
- [ ] Generate an XML sitemap containing every published page
- [ ] Confirm breadcrumbs and internal links use clean URLs

## Phase 6 — Existing content migration

- [ ] Create an importer for the complete current React dataset
- [ ] Import all global business information
- [ ] Import all homepage content
- [ ] Import all five non-service internal pages
- [ ] Import all nine service pages
- [ ] Import all process steps
- [ ] Import all FAQs
- [ ] Import all testimonials
- [ ] Import all service areas
- [ ] Import all projects and media assignments
- [ ] Match every imported item against the baseline manifest
- [ ] Make the importer idempotent so rerunning it does not duplicate content
- [ ] Never overwrite later client edits during theme/plugin updates

## Phase 7 — Forms and operational features

- [!] Confirm the recipient email address for quote requests
- [!] Confirm required consent/privacy wording
- [ ] Connect the React quote form to a secure WordPress REST endpoint
- [ ] Add server-side validation and spam protection
- [ ] Send the client notification email
- [ ] Show the existing React success state only after confirmed submission
- [ ] Log or safely retain enquiries if required by the client
- [ ] Test failure, retry and confirmation behaviour

## Phase 8 — Automated parity QA

- [ ] Compare all 15 WordPress pages against the GitHub Pages baseline
- [ ] Test desktop at 1440px
- [ ] Test tablet at 820px
- [ ] Test mobile at 390px
- [ ] Verify one H1 per page
- [ ] Verify exact section count and order per page
- [ ] Verify text parity
- [ ] Verify image and video parity
- [ ] Verify menu and nine-item Services dropdown
- [ ] Verify accordions, sliders, galleries and lightboxes
- [ ] Verify all telephone, email, CTA and internal links
- [ ] Verify keyboard navigation and focus states
- [ ] Verify reduced-motion behaviour
- [ ] Verify no horizontal overflow
- [ ] Verify no broken local or API-loaded media
- [ ] Verify no Elementor/UAE header, footer, CSS or JavaScript is rendered
- [ ] Verify fallback content by deliberately disabling the API

## Phase 9 — Update and recovery safety

- [ ] Confirm WordPress content survives a theme update
- [ ] Confirm WordPress content survives a plugin update
- [ ] Confirm switching themes does not delete content
- [ ] Confirm uninstall does not remove content without explicit approval
- [ ] Test plugin export and re-import
- [ ] Test full staging backup restoration
- [ ] Document the rollback procedure

## Phase 10 — Staging and client handoff

- [ ] Package the React theme and content plugin separately
- [ ] Install both packages on staging only
- [ ] Run the existing-content importer once
- [ ] Clear WordPress, host and CDN caches
- [ ] Complete staging parity QA
- [ ] Give the client an editor account with appropriate permissions
- [ ] Demonstrate changing text
- [ ] Demonstrate replacing an image
- [ ] Demonstrate adding a service page
- [ ] Demonstrate drafting and publishing a standard page
- [ ] Provide a short editing guide
- [ ] Obtain client approval before production deployment

## Current focus

`Phase 0 — Baseline and preservation.` No frontend or WordPress content behaviour will be changed until the complete current-site manifest and screenshot baseline are recorded.
