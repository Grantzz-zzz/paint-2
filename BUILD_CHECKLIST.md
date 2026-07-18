# Superior Plus Painting — Build Checklist

This file is the source of truth for the 15-page rebuild. Update it whenever a task is completed, changed or blocked.

Legend: `[ ]` not started · `[-]` in progress · `[x]` complete · `[!]` needs client input

## Phase 0 — Planning and content

- [x] Extract and review all 15 supplied PDFs
- [x] Review LPD Painting, Ace Team Painting and Celtic Decor references
- [x] Approve the 15-page sitemap
- [x] Define the shared design philosophy and service templates
- [x] Document the full architecture in `SITE_PLAN.md`
- [x] Preserve all prototype tokens, typography, shapes and motion rules

## Phase 1 — Shared foundation

- [x] Add React Router and GitHub Pages-compatible hash routing
- [x] Create route-aware shared header and mobile navigation
- [x] Add folder-style Services submenu exposing all nine service pages on desktop and mobile
- [x] Create shared footer and global quote CTA
- [x] Refactor paint dividers, reveals, buttons and typography primitives
- [x] Create reusable page hero and trust strip
- [x] Create reusable service scope, process and benefit modules
- [x] Create reusable testimonials, related services and areas modules
- [x] Create accessible FAQ accordion
- [x] Create reusable quote form
- [x] Create central site/contact/process/suburb data
- [x] Create central service-page content from all PDFs
- [x] Add route metadata and canonical support

## Phase 2 — Core pages

- [x] 01 Home `/`
- [x] 02 About `/about`
- [x] 03 Services `/services`
- [x] 04 Residential Painting `/services/residential-painting-melbourne`
- [x] 05 Commercial Painting `/services/commercial-painting-melbourne`
- [x] 15 Contact / Free Quote `/contact`

## Phase 3 — Service pages

- [x] 06 Interior Painting `/services/interior-painting-melbourne`
- [x] 07 Exterior Painting `/services/exterior-painting-melbourne`
- [x] 08 Roof Painting `/services/roof-painting-melbourne`
- [x] 09 Fence Painting `/services/fence-painting-melbourne`
- [x] 10 Deck Painting & Staining `/services/deck-painting-staining-melbourne`
- [x] 11 Wallpaper Removal `/services/wallpaper-removal-melbourne`
- [x] 12 Plaster Repairs `/services/plaster-repairs-melbourne`

## Phase 4 — Trust and support pages

- [x] 13 Our Process `/our-process`
- [x] 14 FAQs `/faqs`
- [x] Distribute supplied testimonial content across relevant pages
- [x] Mark unattributed reviews as placeholders pending verified reviews

## Phase 5 — Stock imagery

- [x] Select cohesive stock placeholders for every page
- [x] Use warm residential/commercial and architectural photography
- [x] Add occasional cool-toned contrast images only
- [x] Download and optimise images locally where licensing/source permits
- [x] Add descriptive alt text and consistent image dimensions
- [x] Create a replacement map for future client photography in `STOCK_IMAGES.md`

## Phase 6 — SEO and quality

- [x] Unique title and meta description on every page
- [x] One H1 per page and logical heading order
- [x] Breadcrumbs and contextual internal links
- [x] LocalBusiness, Service, Breadcrumb, FAQ and HowTo structured data
- [!] SEO-valid 15-route sitemap requires path-based production hosting; GitHub Pages currently uses hash routing
- [x] Robots configuration
- [x] Keyboard navigation, skip navigation and visible focus states
- [x] Reduced-motion support
- [x] Responsive checks at mobile, tablet and desktop widths
- [x] Image lazy loading, local WebP assets and route code splitting
- [x] Form validation and designed success states
- [!] Connect quote form to the client's chosen email/form backend
- [!] Confirm privacy policy and consent wording

## Phase 7 — Business details requiring confirmation

- [!] Legal business name and ABN
- [!] Current insurance wording
- [!] Exact roof-repair scope
- [!] Carpentry and tiling delivery/subcontracting details
- [!] Current paint-brand accreditations
- [!] Warranty terms
- [!] Opening hours and response-time promise
- [!] Final service-area boundaries
- [!] Real team/founder biography
- [!] Verified customer reviews and publication permission
- [!] Social profile URLs

## Phase 8 — Release

- [x] Production build passes
- [x] All 15 routes render on direct hash navigation
- [x] No broken links or missing assets
- [ ] Contact form delivery tested
- [x] Commit completed implementation
- [x] Push to `Grantzz-zzz/paint-2`
- [x] GitHub Pages workflow succeeds
- [x] Live desktop and mobile smoke test

## Current focus

**Frontend navigation refinement.** The 15-page frontend is live, and the Services folder now exposes all nine service subpages on desktop and mobile. Automated browser QA passes across every route and viewport. Remaining work can focus on frontend content polish, final photography and client-confirmed copy; form-backend integration is outside the current scope.
