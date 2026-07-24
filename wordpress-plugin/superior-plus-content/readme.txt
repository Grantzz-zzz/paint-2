=== Superior Plus Content ===
Contributors: superiorplus
Tags: content, rest-api, media-library
Requires at least: 6.4
Requires PHP: 7.4
Stable tag: 0.8.1
License: GPLv2 or later

Locked-design content management for the Superior Plus React WordPress website.

== Description ==

This companion plugin keeps client-managed text, images, services, projects,
testimonials, FAQs and site settings separate from the React theme.

It provides:

* Services, Projects, Testimonials and FAQ content types
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
