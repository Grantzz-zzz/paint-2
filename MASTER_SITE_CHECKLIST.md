# Superior Plus Painting — Master Website Checklist

Updated: 24 July 2026

This is the working checklist for the React/GitHub Pages site first, followed by WordPress staging. A checked item must be visible in the site, supported by the code, or verified in the relevant platform account.

## Status key

- `[x]` Complete and verified
- `[~]` Present but still needs final verification or improvement
- `[ ]` Not implemented
- `[!]` Requires client information, access, or approval

## A. Client PDF content coverage

| Source PDF | Site destination | Status | Remaining action |
|---|---|---:|---|
| About Superior Plus Painting | About, Home trust content, footer | `[x]` | Replace temporary imagery when final team photography is supplied. |
| Additional Services Updated | Services overview | `[x]` | Confirm the scope for tiling, carpentry and property maintenance. |
| Commercial Painting Melbourne | Commercial service page | `[x]` | The duplicate `(1)` PDF is the same source and must not create duplicate content. |
| Deck Painting & Staining Melbourne | Deck service page | `[x]` | Replace temporary media with more real deck projects when available. |
| Exterior Painting Melbourne | Exterior service page | `[x]` | Treat heat-reflective coating performance as product-specific, not a guaranteed saving. |
| Fence Painting Melbourne | Fence service page | `[x]` | Real client fence media is used. |
| Frequently Asked Questions | FAQs page and FAQ structured data | `[x]` | Reconfirm insurance and typical project-time answers before launch. |
| Get in Touch Form | Contact quote form | `[x]` | Test delivery, privacy consent and spam handling on WordPress staging. |
| Interior Painting Melbourne | Interior service page | `[x]` | Real client interior media is used. |
| Our Painting Process | Our Process and service-process sections | `[x]` | Confirm any response-time or scheduling promise before publication. |
| Plaster Repairs Melbourne | Plaster Repairs service page | `[x]` | Replace generated showcase media when real repairs are supplied. |
| Residential Painting Melbourne | Residential service page | `[x]` | Replace generated showcase media when more home projects are supplied. |
| Roof Painting Melbourne | Roof Painting service page | `[~]` | Confirm licences, safety procedures, tile replacement and exact repair scope. |
| Testimonials & Reviews | Home, About and service testimonial bands | `[~]` | PDF quotes are placeholders. Replace them with verified reviews and permitted customer names before launch. |
| Wallpaper Removal Melbourne | Wallpaper Removal service page | `[x]` | Replace generated showcase media when real projects are supplied. |

## B. Client’s 12 website requirements

### 1. Mobile-friendly design

- [x] Responsive desktop, tablet and phone layouts
- [x] Mobile service submenu and click-to-call access
- [x] Mobile form controls and galleries
- [ ] Retest every route after the current staging navigation and scroll fixes

### 2. Fast loading

- [x] Route-level JavaScript splitting
- [x] WebP project imagery
- [x] Lazy-loaded gallery and page images
- [x] Reduced-motion support
- [ ] Run Lighthouse on Home, Services, one service page and Contact
- [ ] Record mobile Core Web Vitals
- [ ] Optimise any image, font, video or API bottleneck found
- [ ] Confirm production cache settings after deployment

### 3. Strong homepage

- [x] Homepage targets “Professional Painters in Melbourne’s Eastern Suburbs”
- [x] Primary Get a Free Quote button above the fold
- [x] Click-to-call action
- [x] Service gateway, real projects, process, trust and local-area sections
- [ ] Confirm final hero wording with the client

### 4. Service and suburb SEO

- [x] Nine dedicated service pages
- [x] Melbourne eastern/south-eastern suburb coverage
- [x] Internal links between related services
- [ ] Agree on priority suburbs using real service coverage and search value
- [ ] Create useful suburb landing pages without duplicating service copy
- [ ] Add each approved suburb page to the sitemap and internal links

### 5. Google-friendly structure

- [x] One descriptive H1 per route
- [x] Structured H2/H3 hierarchy
- [x] Editable title, description, canonical and social-image fields
- [x] Useful image alt text and placeholder disclosure
- [x] LocalBusiness, Service, FAQ, HowTo and breadcrumb structured data
- [x] XML sitemap and robots file
- [ ] Render final per-page metadata server-side in WordPress
- [ ] Validate structured data and social previews on staging

### 6. Easy contact

- [x] Phone number and click-to-call links
- [x] Homepage quick-quote form
- [x] Detailed Contact form matching the supplied PDF
- [x] Email links
- [x] Contact service-area map
- [ ] Confirm exact public address or service-area-only wording
- [ ] Configure and test the production form recipient

### 7. Trust building

- [x] Real client project galleries
- [x] Preparation, process and clean-site proof points
- [~] Fully insured wording supplied by the client
- [~] PDF testimonials are unverified placeholders
- [ ] Add verified Google reviews or a Google review link
- [ ] Add approved before/after labels or comparison pairs
- [!] Confirm licences, insurance details, experience and warranty

### 8. Professional photos

- [x] Real interior, exterior, commercial, fence and outdoor media
- [x] Real client videos with poster images
- [~] Generated showcase images are clearly temporary
- [ ] Replace remaining stock/generated residential, roof, wallpaper and plaster media
- [ ] Add verified job, suburb and service captions

### 9. Google Analytics and Search Console

- [ ] Create or obtain the client’s GA4 property
- [ ] Add GA4 without loading it twice through WordPress
- [ ] Track quote starts, successful submissions, phone clicks and email clicks
- [ ] Verify Google Search Console
- [ ] Submit the production sitemap
- [ ] Check indexing and conversion events after launch

### 10. Easy to update

- [x] WordPress can edit page text and SEO fields
- [x] WordPress can replace hero and gallery images
- [x] WordPress can manage services, projects, FAQs and testimonials
- [x] Editors can create supported standard/landing pages
- [x] The theme keeps the approved design locked
- [ ] Complete an editor handoff test with the client
- [ ] Document the “add a page” workflow with screenshots

### 11. Security and backups

- [x] WordPress permissions, nonces and input validation
- [x] Form honeypot and rate limiting
- [x] Content recovery export and uninstall safeguards
- [ ] Confirm automatic hosting backups for files and database
- [ ] Perform and document one staging restore test
- [ ] Enable administrator 2FA and least-privilege client accounts
- [ ] Confirm update, malware monitoring and uptime responsibilities

### 12. Local SEO

- [x] Melbourne service-area copy and suburb lists
- [x] LocalBusiness structured data with `areaServed`
- [x] Contact service-area map
- [ ] Confirm consistent legal name, phone, service area and address
- [ ] Connect the final site to the Google Business Profile
- [ ] Add the production website and quote link to the profile
- [ ] Create approved suburb pages
- [ ] Add verified local project and review signals

## C. Current implementation order

### Batch 1 — React and GitHub Pages content

- [x] Audit all supplied PDFs
- [x] Create this master checklist
- [x] Add the target eastern-suburbs homepage message
- [x] Restore missing PDF details to service/process fallback content
- [x] Add a Contact service-area map without inventing a street address
- [x] Build and run automated route/content QA
- [x] Perform local desktop and mobile smoke tests
- [x] Commit and push the verified GitHub Pages update
- [x] Confirm the GitHub Pages deployment

### Batch 2 — Content proof and photography

- [ ] Obtain verified reviews
- [ ] Obtain licence, insurance and warranty details
- [ ] Replace remaining generated/stock images
- [ ] Label genuine before/after pairs
- [ ] Confirm the public business location and service boundaries

### Batch 3 — SEO, tracking and performance

- [ ] Add approved suburb pages
- [ ] Finish server-rendered WordPress metadata
- [ ] Connect GA4, Search Console and Google Business Profile
- [ ] Complete Lighthouse/Core Web Vitals optimisation

### Batch 4 — WordPress staging release

- [ ] Finish staging navigation, refresh and scroll bug fixes
- [ ] Package the verified theme and plugin separately
- [ ] Back up staging
- [ ] Install/update on staging
- [ ] Resave permalinks and clear every cache layer
- [ ] Test routes, forms, CMS edits and mobile layouts
- [ ] Obtain client approval before touching production
