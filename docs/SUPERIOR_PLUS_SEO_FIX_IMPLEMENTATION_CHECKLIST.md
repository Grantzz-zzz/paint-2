# Superior Plus SEO Fix — Implementation, Verification, and Rollback Checklist

Prepared: 12 August 2026  
Scope: technical SEO cleanup only. Client-approved wording, plugin content, media, page layout, forms, and content relationships must remain unchanged.

## 1. Release identity and rollback point

| Package | Previous rollback version | SEO-fix version |
|---|---:|---:|
| Superior Plus Content plugin | 2.7.1 | 2.8.0 |
| Superior Plus theme | 3.6.2 | 3.6.5 |

Built SEO-fix packages:

- `superior-plus-content-2.8.0.zip` — SHA-256 `C21757F7D494E257CF5F5B8479FA153CBED2A8B4D65D74F2195E110E40025137`
- `superior-plus-3.6.5.zip` — SHA-256 `7EB7FC175C6732E98242869CE3DFB0FA8128A9861C22F337ACB9F4060DC72BF8`

Verified rollback packages retained locally before the change:

- `superior-plus-content-2.7.1.zip` — SHA-256 `1FA54820D0039CA0D946B494533BBDE9DD769A3A151E6AFFB158C316D819A085`
- `superior-plus-3.6.2.zip` — SHA-256 `F3408C65BB6F2871EF3CD0963EC7D874B1B2234A37443BFF6D9273B3B368EC7B`

Important: theme and plugin ZIPs contain code, not the live client content. The edited text, intentionally blank fields, images, cards, lists, sections, locations, relationships, and Yoast values live in the WordPress database/media library. The plugin uninstall routine does not delete that content. A code rollback therefore preserves saved content, provided the database itself is not replaced.

## 2. Behaviour that must not change

- [ ] Existing plugin-edited wording is identical after the update.
- [ ] An untouched empty plugin control still means “use the existing/default content.”
- [ ] A field deliberately cleared after it was configured remains intentionally blank.
- [ ] Existing cards, lists, flexible sections, images, location bands, FAQs, reviews, projects, services, and articles remain present.
- [ ] Existing navigation order and destinations remain usable.
- [ ] Quote forms use the same REST submission and mail-delivery workflow.
- [ ] Desktop, tablet, and mobile layouts retain the previous section order and visible content.
- [ ] No importer/restore command is run merely to install this update.

## 3. What the code update changes

### Plugin 2.8.0

- [ ] Keeps FAQ and testimonial records editable in wp-admin and available to the site REST API, but stops them generating thin standalone public pages.
- [ ] Adds exact one-hop 301 redirects for known legacy duplicates. There is no wildcard redirect and no blanket redirect to the homepage.
- [ ] Makes `/sitemap.xml` defer to Yoast’s `/sitemap_index.xml` while Yoast is active, avoiding competing sitemap systems.
- [ ] Excludes legacy Page records, FAQ/testimonial records, author archives, Uncategorized, and incomplete project records from Yoast sitemaps.
- [ ] Adds a project checkbox: “Allow this completed project page in Google and the XML sitemap.” Projects remain excluded until deliberately approved as finished case studies.
- [ ] Uses an explicitly completed Yoast title, description, or canonical first; otherwise it reuses the corresponding Superior Plus SEO field.
- [ ] Keeps all posts, metadata, media, and relationships in place.

### Theme 3.6.5

- [ ] Suppresses the React-generated schema graph when Yoast or Rank Math is managing server SEO, preventing duplicate structured data.
- [ ] Retains the browser-side title, description, canonical, and social-tag updates needed during React navigation.
- [ ] Gives the homepage reviews block the stable `#reviews` destination.
- [ ] Normalises old Painting Guides navigation to the canonical `/blog` routes without changing article content.
- [ ] Produces Safari-12-compatible JavaScript, restores missing standard APIs on older iPadOS versions, and keeps a branded server fallback visible until React starts.
- [ ] Calls WordPress `wp_head()`/`wp_footer()` so Yoast and other normal WordPress head integrations can run.
- [ ] Keeps the hashed React entry query-free so lazy chunks cannot start a second React runtime.
- [ ] Prints the Superior Plus content/API runtime bridge directly before the module starts.
- [ ] Removes unused Elementor/UAE frontend assets from the locked React shell without deleting builder data.

### Manual WordPress/Yoast work

- [ ] Confirm Yoast SEO is active and XML sitemaps are enabled.
- [ ] Do not paste Yoast breadcrumb code into the theme; the theme already supplies named breadcrumb items and Yoast owns the server graph when active.
- [ ] Complete Yoast titles/descriptions page by page using the approved SEO plan. Do not rewrite client-approved on-page copy merely to turn a Yoast indicator green.
- [ ] Leave project indexing unchecked until the project has a unique title, useful case-study copy, real images, and a complete public presentation.

## 4. Exact redirect register

Core duplicates:

- `/roof-painting-melbourne/` → `/services/roof-painting-melbourne/`
- `/painting-services-melbourne/` → `/services/`
- `/professional-painters-in-melbourne-eastern-suburbs/` → `/service-areas/`
- `/painting-guides/` → `/blog/`
- `/commercial-painting-melbourne/` → `/services/commercial-painting-melbourne/`
- `/residential-painting-melbourne-house-painters-melbourne/` → `/services/residential-painting-melbourne/`
- `/service-areas/painters-camberwell-house-painters-camberwell/` → `/service-areas/camberwell/`
- `/service-areas/painters-hawthorn-east-house-painters-hawthorn-east/` → `/service-areas/hawthorn-east/`
- `/property-improvement-services-melbourne/` → `/additional-services/`
- `/painting-guides-melbourne/` → `/blog/`
- Every supplied `/painting-guides/{article-slug}/` route → the same `/blog/{article-slug}/` route.

Embedded records:

- `?spp_faq=...` → `/faqs/`
- `?spp_testimonial=...` → `/#reviews`

Redirect acceptance criteria:

- [ ] Source returns 301.
- [ ] `Location` is same-site and exactly matches the destination above.
- [ ] Destination returns 200.
- [ ] There is one redirect hop only.
- [ ] Destination has a self-referencing canonical.
- [ ] No valid unknown URL is redirected to the homepage; it must remain a real 404.

## 5. Pre-deployment backup

- [ ] Export a full hosting backup: database plus `wp-content`.
- [ ] Download the plugin’s JSON content export and store it separately.
- [ ] Download or record the active theme/plugin ZIPs and versions.
- [ ] Record current WordPress Settings → Reading and Settings → Permalinks.
- [ ] Export Yoast settings if the installed Yoast edition provides that option; otherwise take screenshots of Search Appearance settings.
- [ ] Record the current primary navigation and footer links.
- [ ] Save screenshots of the homepage, every directory, all nine services, every suburb page, FAQs, Contact, Gallery, About, Our Process, Additional Services, Blog, and every article at desktop and mobile widths.
- [ ] Send a real form test and record the recipient and delivery timestamp.
- [ ] Confirm there is enough access to restore the database and upload an older ZIP if wp-admin becomes unavailable.

## 6. Staging deployment order

1. [ ] Clone live to staging or take a fresh complete backup.
2. [ ] Upload and activate plugin 2.8.0.
3. [ ] Upload and activate theme 3.6.5.
4. [ ] Do **not** click “Restore original,” run the approved-site importer, trash pages, or re-save every page.
5. [ ] Visit Settings → Permalinks and click Save Changes once only if routes return 404 after activation.
6. [ ] Purge WordPress/server/CDN caches.
7. [ ] Open `/sitemap_index.xml`; confirm only the Yoast sitemap is advertised.
8. [ ] Run the all-page checks below before deploying to live.

## 7. All-page parity matrix

Automated baseline scope: 125 routes × 3 viewports (desktop, tablet, mobile). This covers:

- Home.
- About, Services, Additional Services, Our Process, FAQs, Contact, Gallery, and Service Areas.
- All nine canonical service pages.
- Every supplied suburb/service-area page.
- Blog hub and all 19 canonical blog articles.
- The legacy Painting Guides hub and all 19 legacy article routes, which must resolve to matching Blog content.

For every route and viewport verify:

- [ ] Exactly one visible H1 and the same approved H1 text.
- [ ] Same visible wording, heading order, section order, buttons, links, images, videos, and alt text as the pre-update version.
- [ ] No missing image and no unloaded image.
- [ ] No horizontal overflow, clipped long title, overlap, or unreadably small text.
- [ ] Header, mobile menu, dropdowns, floating phone/email controls, and footer work.
- [ ] Long descriptions and multiple flexible sections remain responsive.
- [ ] No browser console error or failed local resource request.
- [ ] Canonical page uses the intended clean route.
- [ ] Legacy route performs one 301 hop to that canonical route.

Interactive checks:

- [ ] Homepage flip cards work with mouse, keyboard, and touch.
- [ ] Additional Services flip card appears only when enabled and links correctly.
- [ ] FAQ accordions and reviews render correctly.
- [ ] Gallery filters, galleries, video, and lightbox work.
- [ ] Flexible sections handle empty images, background images, long paragraphs, multiple paragraphs, lists, and many repeated sections.
- [ ] Location bands accept additions, edits, deletion, and reordering.
- [ ] Contact and quick-quote forms show success only after confirmed REST delivery; failed mail displays an error.
- [ ] Editing one field and saving does not blank untouched controls.
- [ ] Deliberately clearing an already configured field remains blank after refresh.

## 8. SEO-specific staging checks

- [ ] View source on Home and an inner page: one canonical URL only.
- [ ] With Yoast active, only one primary schema graph owns breadcrumb/site/page entities; no second React `page-structured-data` graph appears.
- [ ] Breadcrumb Rich Results test reports a name for every `itemListElement`.
- [ ] FAQ/testimonial standalone query URLs redirect to their real presentation section.
- [ ] FAQ and testimonial editor screens still work and the public homepage/FAQ sections still consume their REST data.
- [ ] Non-approved projects contain `noindex, follow` and are absent from the sitemap.
- [ ] A deliberately approved completed project can be indexed and appears in the relevant Yoast sitemap after cache/indexable refresh.
- [ ] Author archives and Uncategorized are noindex and absent from the sitemap.
- [ ] Random missing path returns 404 and is not redirected.
- [ ] `robots.txt` advertises the Yoast sitemap, not two competing sitemap URLs.

## 9. Live deployment and Search Console

1. [ ] Repeat the backup immediately before live deployment.
2. [ ] Install plugin 2.8.0, then theme 3.6.5.
3. [ ] Purge all caches.
4. [ ] Smoke-test Home, Residential, Commercial, Camberwell, Hawthorn East, Blog, Contact, and one random 404 on desktop and mobile.
5. [ ] Submit `/sitemap_index.xml` in Search Console; remove the old `/sitemap.xml` submission only after the Yoast index is accepted.
6. [ ] Inspect the affected breadcrumb URL, run Live Test, then click Validate Fix.
7. [ ] Inspect a representative redirect source and canonical destination.
8. [ ] Monitor Page Indexing, Breadcrumbs, Core Web Vitals, form delivery, 404s, and redirect logs for at least two weeks.

Google may take days or weeks to recrawl. “Validation started” is expected; it is not an immediate deployment failure.

## 10. Rollback triggers

Rollback immediately if any of these occur and cannot be corrected by cache purge/permalink refresh:

- Client-approved content disappears or an untouched blank control removes content.
- A major page, service, suburb, article, form, menu, gallery, or mobile layout fails.
- Redirect loop, redirect chain, or valid page redirected to an unrelated destination.
- WordPress fatal error, REST API failure, or wp-admin editor failure.
- Yoast sitemap becomes unavailable after confirming the plugin is active and rewrites are refreshed.

## 11. Rollback procedure

1. [ ] Keep the database in place unless it is independently proven corrupt; this preserves the newest client edits.
2. [ ] Reinstall/activate plugin 2.7.1 from the verified rollback ZIP.
3. [ ] Reinstall/activate theme 3.6.2 from the verified rollback ZIP.
4. [ ] Purge caches and, if necessary, save permalinks once.
5. [ ] Re-run the smoke tests and form-delivery test.
6. [ ] Restore the database backup only if code rollback does not resolve the problem and a database mutation is confirmed. Warn the client that restoring the database also rolls back edits made after the backup.

Expected rollback limitation: the new SEO redirects, sitemap exclusions, project indexing control, and duplicate-schema suppression disappear with the old code. Saved page/plugin content remains.

## 12. Final sign-off record

- Automated pre-change result: **9,218 checks, 125 routes, 3 viewports, 0 failures**.
- [x] Post-change all-page suite passed: **9,218 checks, 125 routes × desktop/tablet/mobile, 0 failures**.
- [x] Previous-versus-new visible content parity passed: **1,875 strict checks, 125 routes, 0 failures**.
- [x] Representative pixel comparison passed for Home, Residential service, Camberwell area, About, FAQs, Contact, Gallery, and a full Blog article. Exceptionally tall pages used viewport-bounded screenshots; their full content/media/overflow remained covered by the complete suites.
- [x] Flexible-content stress passed: **695 checks**, 14 page types per viewport, 40 sections per field, 8 list items per section, 0 failures.
- [x] PHP syntax and standalone plugin/SEO validators passed: 6 content types, 29 exact redirects, no loops/chains, no missing required files/assets.
- [x] Older-iPad compatibility and WordPress boot regression passed: **30 checks**, three iPad portrait/landscape profiles, modern APIs deliberately removed, runtime bridge present, server fallback replaced, 0 blank roots, 0 runtime errors, and working tablet navigation.
- [x] Plugin and theme package hashes recorded.
- [ ] Staging reviewed by developer.
- [ ] Staging reviewed by client/owner.
- [ ] Live smoke test passed.
- [ ] Search Console sitemap submitted and breadcrumb validation requested.

Record deployment date/time, installer, package hashes, backup location, test reports, and any intentional exceptions below:

```
Deployment:
Installer:
Plugin SHA-256:
Theme SHA-256:
Backup:
Reports:
Exceptions:
```
