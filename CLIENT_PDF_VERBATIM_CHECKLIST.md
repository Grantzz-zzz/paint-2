# Client PDF Verbatim Checklist

Baseline before this copy pass: commit `4d7e346` on `main` and `origin/main`.

Copy policy: client-supplied headings, paragraphs, questions, answers, list items, service options and article topics are retained verbatim. PDF-only line wrapping and broken extraction spacing are removed. Navigation labels, accessibility labels, form validation messages and other interface controls are not treated as client marketing copy.

## Dedicated service pages

- [x] Residential Painting Melbourne — headline, introduction, scope, process, Why Choose, Areas We Service and quote copy
- [x] Commercial Painting Melbourne — headline, introduction, scope, process, business reasons, industries, Areas We Service and quote copy
- [x] Interior Painting Melbourne — headline, introduction, inclusions, process, reasons, benefits, Areas We Service and quote copy
- [x] Exterior Painting Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy
- [x] Roof Painting Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy
- [x] Fence Painting Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy
- [x] Deck Painting & Staining Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy
- [x] Wallpaper Removal Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy
- [x] Plaster Repairs Melbourne — headline, introduction, services, process, reasons, benefits, Areas We Service and quote copy

All nine pages use `src/data/clientApprovedContent.json`. The WordPress plugin contains the identical manifest and marks migrated records with `pdf-verbatim-2026-08-01` so old shortened records cannot override the approved copy.

## Company and utility pages

- [x] About Superior Plus Painting — all six supplied sections and both supplied lists
- [x] Additional Services — all eight named service descriptions, “Need Another Service?” and quote copy
- [x] Our Painting Process — introduction, all six steps, all six Why Our Process Works points and Ready to Start copy
- [x] Frequently Asked Questions — all ten supplied questions and answers
- [x] Get in Touch — all field labels, all 12 service choices and all 8 property types
- [x] Testimonials & Reviews — supplied introduction, all four supplied testimonials, all seven reasons, Share Your Experience and quote copy
- [x] Official Google reviews remain separately identified as Google reviews; client-supplied testimonials are not misrepresented as Google reviews

## Blog PDF

- [x] Four complete supplied articles retained as complete articles
- [x] Fifteen supplied SEO ideas expanded into substantial Superior Plus articles
- [x] Every supplied title, SEO keyword phrase and topic retained as structured source data and represented in its expanded article
- [x] Four fully written client articles remain verbatim; expansion applies only to the fifteen outline-only briefs
- [x] All 19 entries remain selectable from the Blog hub and from each article
- [x] Eastern Suburbs service-area content and every supplied suburb remain represented by the service-area directory
- [x] The PDF recommendation to link articles to relevant service pages remains implemented

## Service-area SEO planning PDF

- [x] All named target suburbs exist in the site’s service-area coverage
- [x] The table is treated as an SEO/page-targeting instruction, not pasted into customer-facing page copy
- [x] Later client-approved homepage wording (“Professional painting services in Melbourne”) is retained instead of replacing it with the earlier table’s Chadstone homepage target
- [x] Later request for all supplied suburbs is retained instead of limiting coverage to only the short target groups in the table

## Brand and implementation checks

- [x] Active code no longer references `commercial-02.webp`, which visibly promotes another painting company
- [x] React and WordPress manifests are byte-for-byte equivalent JSON data
- [x] Plugin upgraded to 2.2.0
- [x] Theme upgraded to 3.2.0
- [x] WordPress migration exposes the approved service sections as editable Heading | Body fields
- [x] About, Additional Services and Process approved sections remain editable through the plugin
- [x] Contact options and form labels remain editable through the plugin
- [x] Production build passes
- [x] Full browser QA passes: 9,013 checks, 125 routes, desktop/tablet/mobile, 0 failures
- [x] Route-normalization test passes
- [x] Verbatim-manifest synchronization test passes
- [x] 247 extracted PDF phrases checked against the nine service manifests, 0 mismatches
- [x] WordPress theme and plugin PHP validation passes
- [x] Embedded WordPress React bundle matches the production build file-for-file

## WordPress update step

After uploading and activating the updated theme and plugin, open **Superior Plus → Migration**, then run **Import or safely refresh approved content** once. This applies the approved PDF copy to the existing WordPress records while keeping the current layout and managed images.
