=== Superior Plus Content ===
Contributors: superiorplus
Tags: content, rest-api, media-library
Requires at least: 6.4
Requires PHP: 7.4
Stable tag: 0.1.0
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
* Role capabilities for content editors
* A read-only versioned REST API under /wp-json/spp/v1
* Administrator-only JSON export

Elementor and ACF are not required. Deactivation or uninstall does not delete content.

== Installation ==

1. Install on staging only.
2. Activate Superior Plus Content.
3. Open Superior Plus in the WordPress dashboard.
4. Review Site Settings and existing content.
5. Do not remove the React fallback content until parity QA is complete.

== Changelog ==

= 0.1.0 =

* Initial locked-content architecture and editing foundation.
