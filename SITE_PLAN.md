# Superior Plus Painting — 15-Page Website Plan

## 1. Strategic Direction

The multi-page site should extend the existing concept rather than replace it:

> **Blocks of wet paint on a clean gallery wall.**

White and warm cream remain the dominant canvas. Brand colours appear in deliberate swatches, irregular section edges, image frames, process markers, and CTA bands. Every page should feel related to the current homepage, while each service page receives one recognisable colour and one visual gesture of its own.

The desired position is a boutique Melbourne painting company that feels:

- skilled and meticulous;
- warm and easy to deal with;
- premium without feeling expensive or aloof;
- colourful without becoming visually noisy;
- trustworthy without relying on unsupported badges or claims.

## 2. What to Take From the Reference Sites

### LPD Painting

Use:

- clear grouping of residential, interior, exterior, and commercial services;
- direct quote access from every page;
- visible contact details and service links;
- project imagery near service content.

Improve:

- avoid the extremely deep navigation tree;
- avoid showing every small service and location in the main menu;
- use less repeated SEO copy and a more editorial page rhythm.

### Ace Team Painting

Use:

- strong quote-first conversion flow;
- proof points near the top of important pages;
- project/case-study modules supporting service claims;
- FAQs close to the decision point;
- clear links between related services.

Improve:

- keep pages shorter and more intentionally paced;
- avoid repeating full quote forms multiple times on one page;
- let the design system establish trust rather than stacking badges everywhere.

### Celtic Decor

Use:

- strong local Melbourne relevance;
- experience-led copy and clear explanation of suitable project types;
- partner/accreditation space when verified assets become available;
- dedicated internal links to related specialties.

Improve:

- avoid a very large suburb dropdown;
- do not create thin location pages merely to target suburb keywords;
- maintain Superior Plus's modern, warmer and more residential tone.

## 3. Final 15-Page Sitemap

The 15 PDFs contain enough material for 15 internal concepts, but adding the existing homepage would create 16 pages. The strongest information architecture is to use the testimonials PDF as reusable social-proof content across the site instead of a thin standalone reviews page.

| # | Page | Route | Primary purpose | Source PDF |
|---|---|---|---|---|
| 1 | Home | `/` | Brand, service discovery, proof, conversion | Existing site + selected content from all PDFs |
| 2 | About | `/about` | Company story, standards and local credibility | About Superior Plus Painting |
| 3 | Services | `/services` | Service directory and secondary property services | Additional Services Updated |
| 4 | Residential Painting | `/services/residential-painting-melbourne` | Residential search intent and homeowner conversion | Residential Painting SEO Page |
| 5 | Commercial Painting | `/services/commercial-painting-melbourne` | Business, strata and property-manager leads | Commercial Painting SEO Page |
| 6 | Interior Painting | `/services/interior-painting-melbourne` | Interior repaint search intent | Interior Painting SEO Page |
| 7 | Exterior Painting | `/services/exterior-painting-melbourne` | Exterior protection and street-appeal search intent | Exterior Painting SEO Page |
| 8 | Roof Painting | `/services/roof-painting-melbourne` | Roof coating and restoration leads | Roof Painting SEO Page |
| 9 | Fence Painting | `/services/fence-painting-melbourne` | Fence painting, spraying and staining leads | Fence Painting SEO Page |
| 10 | Deck Painting & Staining | `/services/deck-painting-staining-melbourne` | Outdoor timber restoration leads | Deck Painting & Staining SEO Page |
| 11 | Wallpaper Removal | `/services/wallpaper-removal-melbourne` | Wallpaper removal and paint-ready preparation | Wallpaper Removal SEO Page |
| 12 | Plaster Repairs | `/services/plaster-repairs-melbourne` | Repair-led leads and support for painting projects | Plaster Repairs SEO Page |
| 13 | Our Process | `/our-process` | Reduce uncertainty and explain quality | Our Painting Process |
| 14 | FAQs | `/faqs` | Resolve common objections and support SEO | Frequently Asked Questions |
| 15 | Contact / Free Quote | `/contact` | Lead capture and direct contact | Get in Touch Form |

### Testimonials content placement

The Testimonials & Reviews PDF should feed a reusable `TestimonialBand` component used on:

- Home: two or three rotating quotes;
- About: one quality/reliability quote;
- Residential and Interior: homeowner-focused quote;
- Commercial: communication/on-schedule quote;
- Contact: compact reassurance quote beside the form.

The supplied reviews are generic and unattributed. Before launch, replace them with verified customer reviews and real names/initials, or label them clearly as placeholder content. Do not present invented quotes as verified Google reviews.

## 4. Navigation Architecture

### Desktop header

- Logo
- Home
- Services — restrained mega menu
  - Painting
    - Residential
    - Commercial
    - Interior
    - Exterior
    - Roof
  - Outdoor & preparation
    - Fence
    - Deck
    - Wallpaper Removal
    - Plaster Repairs
  - View All Services
- About
- Our Process
- FAQs
- Phone number
- `Get a Free Quote` button

### Mobile navigation

- Accordion for Services, open one group at a time.
- Phone and quote CTA remain visible at the bottom of the menu.
- Do not show a separate dropdown for every Melbourne suburb.

### Footer

Four columns:

1. brand statement and logo;
2. core painting services;
3. preparation/additional services and company pages;
4. phone, email, Melbourne service area, social links and opening hours when confirmed.

Include Privacy Policy and Terms links before production, even if these legal pages are not part of the initial 15-page count.

## 5. Shared Design System

### Colour allocation

| Role | Colour | Use |
|---|---|---|
| Primary | Deep brick/maroon | Main CTA, residential, contact |
| Secondary | Forest green | Commercial, trust, footer |
| Highlight | Mustard gold | Process, reviews, active details |
| Warm support | Terracotta | Exterior, fence, repair accents |
| Neutral | Warm cream | Alternating content bands and cards |
| Cool accent | Muted teal | Interior or wallpaper detail only |
| Cool accent | Soft navy | Commercial data/process details only |

Maintain approximately 65–70% white/cream and an 80/20 warm-to-cool balance. Never place two fully saturated sections next to one another.

### Typography

- Keep Manrope for display headings and DM Sans for interface/body copy.
- Keep the Georgia italic word or phrase as the human, crafted accent.
- Service pages should use a slightly smaller H1 than the homepage so the site feels editorial rather than campaign-like.
- Limit body-copy width to roughly 65–72 characters.

### Reusable irregular edges

- wave;
- drip;
- painter's-tape diagonal;
- broad brush edge;
- soft blob crop.

Each page uses two or three variants, but never repeats the same divider consecutively.

### Texture and imagery

- One low-opacity roller/noise texture per page, not per section.
- Placeholder images should use consistent aspect ratios and descriptive filenames.
- Use real `<img>` elements with useful alt text, not only CSS backgrounds.
- Image treatments: offset paint frame, irregular corner mask, paint wipe on hover.
- Avoid generic rows of tiny stock-photo cards. Prefer one large work image and two supporting detail crops.

### Motion

- Framer Motion: text/card reveal, menu, accordion, testimonial transition.
- GSAP/ScrollTrigger: divider paint-on, restrained image parallax, one page-specific physical flourish.
- Route transition: a 300–450 ms cream/paint wipe, respecting reduced-motion preferences.
- Do not animate long body copy line by line.

## 6. Global Conversion Components

Every page should contain:

1. sticky header with phone and quote CTA;
2. compact trust strip near the hero;
3. contextual CTA after the primary explanatory section;
4. full closing quote band;
5. related-service links;
6. consistent phone and email details.

Recommended CTA language:

- Primary: `Get a Free Quote`
- Secondary: `Call 0470 234 567`
- Supporting: `See How We Work`, `Explore Related Services`, or `Discuss Your Project`

Avoid changing the primary CTA wording from page to page.

## 7. Page-by-Page Content and Visual Plan

### 1. Home

**Goal:** establish the brand, route visitors to the right service, and generate quote requests.

**Sections:**

1. Current split-image hero with refined headline and two CTAs.
2. Trust strip: fully insured, free written quotes, careful preparation, clean sites.
3. Service gateway with four featured services and `View all services`.
4. Residential/commercial split choice.
5. Selected projects using placeholders initially.
6. Six-step process preview linking to Our Process.
7. Why Superior Plus.
8. Testimonials band.
9. Melbourne service-area chip cloud.
10. FAQ preview with four questions.
11. Closing quote CTA.

**Signature:** maroon hero paint, gold/green roller strokes, wave divider.

### 2. About

**Goal:** explain who the company is and how it works, without unsupported history claims.

**Sections:**

1. Editorial hero: `Melbourne painters who treat every property with care.`
2. Company introduction from the About PDF.
3. What we do: residential, commercial and preparation services.
4. Commitment to quality with one large preparation/detail image.
5. Values grid: professionalism, honesty, pride, communication, respect.
6. Why choose us.
7. Melbourne service area.
8. Testimonial band.
9. Quote CTA.

**Signature:** forest-green offset portrait/image block and soft blob divider.

**Content needed later:** founder/team names, real team photography, years in business, insurance details, memberships and verified accreditations.

### 3. Services Overview

**Goal:** make all services discoverable and house secondary offerings that do not need standalone pages yet.

**Sections:**

1. Service-directory hero.
2. Core service paint-swatch grid linking to the nine dedicated services.
3. Additional services:
   - carpentry associated with painting/renovation;
   - caulking and gap sealing;
   - tiling;
   - timber repairs and restoration;
   - surface preparation;
   - property maintenance.
4. `Not sure what you need?` diagnostic CTA.
5. Process preview.
6. Related proof/gallery strip.
7. Closing CTA.

**Signature:** colour-chip wall with controlled warm/cool alternation; diagonal tape divider.

### 4. Residential Painting

**Goal:** serve broad homeowner and residential painting intent, then route to interior/exterior specialties.

**Sections:**

1. Hero with residential value proposition.
2. Suitable project types: homes, units, apartments, townhouses, landlords, builders.
3. Residential service list from the PDF.
4. Interior versus exterior split cards.
5. Preparation and property protection.
6. Five-step service process.
7. Benefits/outcomes.
8. Homeowner testimonial.
9. Related services: Interior, Exterior, Roof, Fence, Deck, Plaster.
10. Service area and closing CTA.

**Signature:** deep maroon image frame with a warm-cream brush edge.

### 5. Commercial Painting

**Goal:** produce qualified leads from businesses, property managers, body corporates and builders.

**Sections:**

1. Commercial hero with business-hours/scheduling message.
2. Audience chips: businesses, builders, property managers, body corporates, industrial facilities.
3. Property/industry grid: offices, retail, warehouses, medical, education, hospitality, apartments and strata.
4. Planning and disruption-minimisation section.
5. Five-stage commercial process.
6. Durable coating and safe-work explanation—without adding unverified compliance claims.
7. Commercial project placeholder.
8. Communication/on-schedule testimonial.
9. Related services: Exterior, Interior, Plaster, Additional Services.
10. Commercial quote CTA with project-type selector.

**Signature:** forest-green base, small navy accent, paint-drip process connector.

### 6. Interior Painting

**Goal:** target homeowners, landlords and businesses needing clean interior finishes.

**Sections:**

1. Light, gallery-style interior hero.
2. Room and surface coverage grid.
3. Why preparation and protection matter.
4. Five-step process.
5. Colour and finish guidance block.
6. Benefits: light, modernisation, protection and property value.
7. Before/after placeholder composition.
8. Related services: Residential, Plaster, Wallpaper, Additional Services.
9. FAQ subset.
10. Quote CTA.

**Signature:** cream/white page with muted-teal paint frame and a maroon CTA.

### 7. Exterior Painting

**Goal:** explain exterior protection and generate full-home repaint leads.

**Sections:**

1. Exterior hero focused on protection and street appeal.
2. Surfaces covered: weatherboard, brick, render, cladding, fascia/eaves, gutters, doors, windows and outdoor structures.
3. Melbourne-weather problem/solution band.
4. Six-stage process.
5. Preparation close-up/project placeholder.
6. Benefits and maintenance value.
7. Related services: Residential, Roof, Fence, Deck, Carpentry/Timber Repairs.
8. Area coverage and CTA.

**Signature:** terracotta block with a sharp painter's-tape diagonal.

### 8. Roof Painting

**Goal:** generate roof coating/restoration enquiries while clearly defining the service scope.

**Sections:**

1. Roofline hero.
2. Roof types: concrete tile, metal and suitable Colorbond repainting.
3. Services: cleaning, preparation, priming/sealing, coating and suitable minor repairs.
4. Six-stage roof process.
5. Benefits and realistic maintenance outcomes.
6. Safety/inspection reassurance using only verified claims.
7. Roof before/after placeholder.
8. Related services: Exterior, Gutters/Additional Services, Residential.
9. Quote CTA.

**Signature:** brick-red roof geometry with a mustard roller-stroke highlight.

**Verification required:** confirm exactly which roof repairs are legally and practically within the business's service scope before launch.

### 9. Fence Painting

**Goal:** convert fence spraying, repainting, staining and restoration searches.

**Sections:**

1. Fence/detail hero.
2. Fence types and services.
3. Brush versus spray method explanation.
4. Garden, paving and property protection.
5. Six-stage process.
6. Benefits: protection, lifespan, appearance and lower maintenance.
7. Fence transformation placeholder.
8. Related services: Exterior, Deck, Timber Repairs.
9. Quote CTA.

**Signature:** terracotta paint swipe with a forest-green landscaping accent.

### 10. Deck Painting & Staining

**Goal:** generate restoration, staining, oiling and new-deck finish leads.

**Sections:**

1. Outdoor-living hero.
2. Paint versus stain versus oil comparison.
3. Deck and pergola service list.
4. Six-stage cleaning, sanding, repair and coating process.
5. Melbourne UV/moisture protection block.
6. Benefits and maintenance guidance.
7. Grain/detail project placeholders.
8. Related services: Fence, Exterior, Timber Repairs.
9. Quote CTA.

**Signature:** mustard/ochre swatch with deep-green type and organic brush edge.

### 11. Wallpaper Removal

**Goal:** explain careful removal and position it as preparation for a quality repaint.

**Sections:**

1. Peel/reveal hero composition.
2. Wallpaper types and removal methods.
3. Why DIY removal can damage plaster.
4. Six-stage protection, removal, adhesive cleaning, repair, sanding and priming process.
5. Paint-ready finish outcome.
6. Before/after placeholder.
7. Related services: Interior, Plaster Repairs, Residential.
8. Quote CTA.

**Signature:** muted-teal layer peeling back to warm cream; clipped-paper divider rather than a paint drip.

### 12. Plaster Repairs

**Goal:** target repair enquiries and demonstrate that surface quality drives paint quality.

**Sections:**

1. Texture/detail hero.
2. Damage types: wall/ceiling cracks, holes, water damage, cornices, plasterboard and renovation touch-ups.
3. Diagnostic section: repair first, paint second.
4. Six-stage repair process.
5. Seamless-finish explanation.
6. Repair progression placeholders.
7. Related services: Interior, Wallpaper, Residential, Additional Services.
8. Quote CTA.

**Signature:** warm-cream plaster texture with small maroon repair marks and a soft uneven edge.

### 13. Our Process

**Goal:** turn preparation and communication into a clear differentiator.

**Sections:**

1. Hero: `A better finish starts with a better process.`
2. Vertical or staggered six-step journey:
   - Consultation & quote
   - Surface preparation
   - Protecting the property
   - Professional painting
   - Quality inspection
   - Clean-up & handover
3. What clients can expect from communication and scheduling.
4. `Why our process works` trust grid.
5. One full-width preparation image placeholder.
6. Service selector CTA.

**Signature:** gold numbered path with animated drip/roller connector on a mostly white background.

### 14. FAQs

**Goal:** answer practical objections and support users who are not ready to enquire.

**Sections:**

1. Compact FAQ hero with direct phone option.
2. Filter/category chips:
   - Quotes & booking
   - Preparation
   - Products & finishes
   - Timing & access
   - Clean-up & service areas
3. Accessible accordion containing all ten supplied questions.
4. Related-service cards.
5. `Still have a question?` contact CTA.

**Signature:** cream page with alternating maroon, green and gold question markers; minimal motion.

**Content expansion later:** pricing guidance, warranty, colour consultation, weather delays, access, deposits and after-hours commercial scheduling—only after business answers are confirmed.

### 15. Contact / Free Quote

**Goal:** collect enough information for a useful follow-up without making the form intimidating.

**Sections:**

1. Contact hero with phone and email.
2. Progressive quote form:
   - Step 1: name, phone and email;
   - Step 2: address/suburb and property type;
   - Step 3: service required;
   - Step 4: project details and optional photo upload;
   - Step 5: preferred contact method/time and consent.
3. Direct contact card.
4. What happens next: inspection, written quote, schedule.
5. Reassurance testimonial.
6. Compact service-area list.

**Signature:** deep-green closing environment, cream form card and maroon submit CTA.

**Technical note:** the form needs a real backend or form service. Add validation, spam protection, success/error states, privacy consent and analytics events before launch.

## 8. Service Page Template System

All nine dedicated service pages should share the same information architecture without looking cloned.

### Core template

1. breadcrumb;
2. service hero;
3. trust strip;
4. service scope;
5. problem/benefit explanation;
6. page-specific process;
7. project imagery;
8. why choose us;
9. related services;
10. local service area;
11. contextual FAQs;
12. closing CTA.

### Controlled layout variants

- **Template A — Home painting:** Residential, Interior, Exterior
  - editorial split hero;
  - room/surface grid;
  - lifestyle-led project imagery.
- **Template B — Outdoor protection:** Roof, Fence, Deck
  - stronger before/after treatment;
  - process timeline;
  - weather/protection benefits.
- **Template C — Preparation:** Wallpaper, Plaster
  - close-up texture hero;
  - problem/solution sequence;
  - repair/removal progression.
- **Template D — Commercial:** Commercial only
  - industry grid;
  - scheduling/disruption module;
  - larger quote brief.

## 9. Content Consolidation Rules

The PDFs repeat several ideas. Use a central content/data layer so updates remain consistent:

- one canonical six-step master process;
- short page-specific process variants generated from that master;
- one approved suburb list;
- one verified trust-point set;
- one contact-details object;
- one testimonial collection with audience/service tags;
- one service relationship map;
- one global quote CTA definition.

Do not paste the same `Why Choose Us`, suburb paragraph, or generic closing paragraph verbatim on every page. Each service page should contain:

- a unique opening proposition;
- service-specific scope;
- service-specific preparation details;
- unique benefits and FAQs;
- contextual internal links.

## 10. SEO and Technical Plan

### Per-page SEO

- unique title and meta description;
- exactly one descriptive H1;
- canonical URL;
- Open Graph title, description and image;
- breadcrumb navigation;
- descriptive image filenames and alt text;
- contextual links to parent and related services;
- Melbourne language used naturally, not in every heading;
- suburb list shown once per page at most.

### Structured data

- sitewide `LocalBusiness` / appropriate painting-contractor schema using verified business data;
- `Service` schema on service pages;
- `BreadcrumbList` on internal pages;
- `FAQPage` only where the visible page contains the same FAQ content;
- review/rating schema only for genuine, attributable and policy-compliant reviews.

### React architecture

- add React Router with route-level lazy loading;
- move page content into structured data objects where practical;
- create `PageHero`, `TrustStrip`, `ServiceScope`, `ProcessSteps`, `ProjectGallery`, `TestimonialBand`, `RelatedServices`, `AreaBand`, `FAQAccordion`, `QuoteCTA`, and `SEO` components;
- keep existing `Divider`, palette and reveal concepts, refactored into shared components;
- add route-aware navigation and breadcrumbs;
- preserve Vite's relative build base for GitHub Pages;
- add a GitHub Pages SPA fallback strategy or use hash routing if a server rewrite cannot be configured.

### Performance and accessibility

- convert placeholder/final imagery to WebP or AVIF;
- responsive `srcset` and explicit dimensions;
- lazy-load below-the-fold images;
- keyboard-accessible menus and accordions;
- visible focus styles;
- reduced-motion support;
- AA contrast minimum;
- avoid text baked into images;
- keep the mobile quote CTA reachable without covering content.

## 11. Content and Business Details to Verify Before Launch

- legal business name and ABN;
- full insurance wording and policy status;
- trade/licensing requirements for repair work;
- exact roof-repair scope;
- whether tiling is performed directly or by a subcontractor;
- brands used and whether any accreditation is current;
- warranties and their written terms;
- opening hours and expected response time;
- service-area boundaries;
- real team/founder information;
- verified testimonials and permission to publish names;
- social media URLs;
- privacy policy and form consent wording.

Do not reuse claims found on competitor sites—such as membership, years in business, $20 million liability cover, specific standards compliance, warranties, low-VOC guarantees or money-back guarantees—unless Superior Plus provides evidence for them.

## 12. Recommended Implementation Sequence

### Phase 1 — Foundation

1. Add routing and shared page shell.
2. Refactor the current homepage components into reusable design-system components.
3. Create the central services, contact, suburbs, testimonials and process data.
4. Add metadata, breadcrumbs and GitHub Pages routing support.

### Phase 2 — Core conversion pages

5. Rebuild Home within the new routing structure.
6. Build Services overview.
7. Build Residential and Commercial pages.
8. Build Contact and connect the form.

### Phase 3 — Service templates

9. Build Template A: Interior and Exterior.
10. Build Template B: Roof, Fence and Deck.
11. Build Template C: Wallpaper Removal and Plaster Repairs.

### Phase 4 — Trust and support pages

12. Build About.
13. Build Our Process.
14. Build FAQs.
15. Place verified testimonials and project imagery throughout.

### Phase 5 — Quality and launch

16. Replace placeholders with final imagery.
17. Complete content/business verification.
18. Run accessibility, responsive, performance and form testing.
19. Validate metadata, schema, sitemap, robots and internal links.
20. Deploy and verify every route on GitHub Pages.

## 13. Recommended First Build Step

Start with **Phase 1: routing, shared page shell and design-system refactor**. This is the safest next step because every later page depends on the same header, footer, hero, divider, CTA, SEO and routing primitives. Once the foundation is stable, build the Services overview and the Residential page as the first two examples; together they prove both the directory layout and the reusable service-page template before multiplying it across the remaining pages.
