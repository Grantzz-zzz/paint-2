# Phase 4 React data adapter

The approved React design remains the rendering layer. WordPress supplies only
versioned content through `/wp-json/spp/v1`.

## Runtime configuration

The WordPress theme injects:

- `window.__SPP_SITE_URL__`
- `window.__SPP_CONTENT_API__`
- `window.__SPP_REST_NONCE__` for logged-in exact-design previews

GitHub Pages does not define the WordPress API variable, so the complete local
dataset renders without making failing WordPress requests.

## Loading and fallback rules

- Bootstrap content and the service directory load once through the provider.
- Route payloads and optional collections load only when their components mount.
- Successful public responses use in-memory and five-minute session caching.
- Authenticated preview responses are never cached.
- Empty strings, null media and empty optional arrays retain their designed local
  fallback. A partially edited WordPress record cannot remove a required section.
- Network, API and schema-version errors keep the complete current site visible
  and expose a non-visual accessible status message.

## Connected content

- Business details, logo, navigation, service submenu, footer, trust items,
  service areas and default CTA
- Homepage hero, copy, images, selected services, projects, trust cards,
  testimonials, areas and quote copy
- About, Services, Process, FAQs and Contact
- All published service pages and their ordered scope, process, benefits,
  related services and galleries
- Published projects, testimonials and FAQs
- Standard, Landing and Project pages created through the controlled workflow
- Related-page links resolved by the REST presenter

## Verification

- `npm run build`
- `npm run qa` — 507 checks across 15 routes and three viewports
- `node scripts/qa-wordpress-react.mjs` against isolated WordPress
- `node scripts/qa-phase4-api.mjs` for real WordPress edits, collections,
  route-specific rendering and authenticated React preview
- PHP syntax, plugin validation, theme validation and JSON contract validation
