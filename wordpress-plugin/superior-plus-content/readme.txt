=== Superior Plus Content ===
Contributors: superiorplus
Tags: content, rest-api, media-library
Requires at least: 6.4
Requires PHP: 7.4
Stable tag: 2.3.4
License: GPLv2 or later

Locked-design content management for the Superior Plus React WordPress website.

== Description ==

This companion plugin keeps client-managed text, images, services, projects,
blog articles, testimonials, FAQs and site settings separate from the React theme.

It provides:

* Services, Projects, Blog Articles, Testimonials and FAQ content types
* A revision-backed Site Settings record
* Locked page-template fields
* Media Library image and ordered gallery controls
* Idempotent approved-site importer with client-edit protection
* Role capabilities for content editors
* A read-only versioned REST API under /wp-json/spp/v1
* Secure quote delivery with validation, spam controls and retry-safe feedback
* Administrator-only JSON export and guarded same-site recovery

Elementor and ACF are not required. Deactivation or uninstall does not delete content.

== Installation ==

1. Install on staging only.
2. Activate Superior Plus Content.
3. Open Superior Plus in the WordPress dashboard.
4. Open Superior Plus > Import approved site and run the importer once.
5. Review the migration report, Site Settings and imported content.
6. Rerunning the importer is safe: stable source keys prevent duplicates and client-edited records are protected.
7. Do not remove the React fallback content until parity QA is complete.

== Changelog ==

= 2.3.4 =
* Adds a dedicated Areas dashboard and editable suburb, region, property, service, neighbour, hero and card-image fields.
* Publishes managed service areas through the REST API so directory cards, dropdowns, homepage filters and suburb pages update together.
* Prevents Areas from disappearing when a WordPress menu is incomplete and safely initializes all approved suburb records during import.

= 2.3.3 =
* Replaces stale WordPress hero attachment IDs with the approved aesthetic hero artwork once, even when the page copy is client-protected.
* Preserves all edited text and restores normal Media Library control immediately after the one-time visual upgrade.
* Prevents the old WordPress image from replacing the correct bundled hero after the REST response loads.

= 2.3.2 =
* Creates all nine editable Project gallery records before processing their media, preventing constrained first imports from stopping after four galleries.
* Automatically clears stale import locks and raises the available import execution budget on managed WordPress hosting.
* Keeps every approved gallery section visible when an older import is incomplete while respecting intentionally emptied managed galleries.
* Synchronises the companion theme bundle and importer media paths.

= 2.3.1 =
* Restores the approved aesthetic hero artwork for About, Services, Additional Services, Service Areas, Gallery, FAQs and Contact.
* Keeps the supplied house-painting artwork for Our Process and Blog.
* Preserves editable page copy, media controls and client-modified record protection.

= 2.1.2 =
* Adds a non-cacheable public quote-form token endpoint so cached pages cannot expire the form session.
* Keeps the existing validation, same-origin protection, spam controls and WordPress mail delivery.

= 2.1.1 =
* Updates the approved Our Process and Blog hero media used by the staging importer.
* Keeps all existing editable text, image, gallery, review and template controls unchanged.

= 2.1.0 =
* Synchronises editable controls with the current approved React site.
* Adds editable Google review profile and official Google Maps settings.
* Adds locked service-area, gallery, blog-directory and additional-services creation templates.
* Exposes the homepage third headline line and selected-work heading and description.

= 2.0.0 =
* Adds the reusable locked Blog Article template and imports all 19 approved articles as editable WordPress records.
* Expands page, service, flip-card, review, counter and Media Library controls while preserving the approved layouts.
* Makes service hero updates flow to homepage cards and project galleries flow to the complete Gallery page.
* Supports unlimited verified reviews with optional source, date, URL and image metadata.

= 1.0.4 =
* Imports the optimized client media batch, improves service-gallery fitting and refreshes service and Eastern Suburbs hero photography.

= 1.0.3 =
* Adds clean routes, sitemap coverage and importer records for the complete 19-article Melbourne painting blog.

= 1.0.2 =
* Adds the complete client-approved Eastern Suburbs coverage list, clean suburb routes and sitemap entries.

= 1.0.1 =
* Adds clean public Blog routes and sitemap entries for the approved painting articles.

= 1.0.0 =
* Added editable pages for the service-area hub, all 15 approved local areas, additional services and four supplied painting guides.
* Added approved guide and local SEO metadata to the idempotent importer.
* Expanded the approved page dataset to 81 editable WordPress pages, including the managed gallery and all 67 current suburb pages.

= 0.9.0 =
* Replaced stock and generated showcase imports with optimized client project photography.
* Expanded residential, commercial, interior, exterior, fence, outdoor, roofline, wall-preparation and plaster galleries without duplicate media files.
* Updated service hero imports and project records to use the real client archive.

= 0.8.1 =
* Split repeatable update/recovery QA from the destructive uninstall rehearsal so Phase 9 can be rerun safely.
* Added end-to-end coverage for creating, publishing, editing, unpublishing and cleaning up a locked Standard Page.
* Kept uninstall preservation as an explicit disposable-runtime test.

= 0.8.0 =
* Added a guarded Backup & Recovery screen with capability, nonce, file-size, format, checksum and explicit-confirmation checks.
* Added same-site JSON restoration for Superior Plus records, fields and client-edit protection metadata.
* Added automated lifecycle coverage for package replacement, theme switching, uninstall preservation and recovery.

= 0.7.0 =
* Added automated 15-route parity testing across desktop, tablet and mobile against a real WordPress runtime.
* Matched imported service hero images, gallery metadata, decoded titles and homepage selections to the approved React reference.
* Added atomic migration locking and defensive REST deduplication.

= 0.6.0 =
* Added secure quote-form REST delivery, server-side validation, same-origin and nonce checks, a honeypot, timing checks and rate limiting.
* Added administrator-only delivery configuration and non-personal delivery diagnostics.

= 0.5.0 =
* Added an idempotent approved-site migration for all core pages, services, FAQs, testimonials, project galleries and Media Library assets.
* Added stable source keys, source hashes, migration reporting and client-edit protection.

= 0.4.0 =
* Added clean WordPress routes, direct-refresh support, legacy hash migration and accurate route status handling.
* Added a canonical XML sitemap and robots.txt discovery for published pages, services and projects.

= 0.3.0 =
* Added the Phase 4 React data adapter contract, resolved related-page links and frontend-safe project relationships.
* Kept all public responses versioned, cached and compatible with the complete local React fallback.

= 0.2.0 =

* Add the controlled Standard, Landing, Service and Project creation wizard.
* Lock template and design variant metadata after creation.
* Add publishing requirements, secure content previews and draft enforcement.
* Add project routes, related-page controls and explicit not-found handling.

= 0.1.0 =

* Initial locked-content architecture and editing foundation.
