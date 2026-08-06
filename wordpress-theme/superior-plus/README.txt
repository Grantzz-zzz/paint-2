=== Superior Plus Painting ===
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 3.5.0

Exact WordPress delivery of the approved Superior Plus Painting React frontend.

== Installation ==

1. Back up the WordPress site and use staging.
2. Open Appearance > Themes > Add New > Upload Theme.
3. Upload superior-plus-3.5.0.zip and activate it on staging only.
4. Install and activate the separately packaged Superior Plus Content plugin.
5. Clear WordPress, hosting and CDN caches.
6. Test the main menu, Services dropdown and all pages.
7. Push staging to live only after client approval.

== Exact React frontend ==

Version 2.0 renders the compiled React site directly. It includes the homepage, five core pages and nine service pages, with the same design, imagery, responsive behaviour and animations as the approved React reference.

Elementor, UAE and MetForm content is not deleted, but those plugins do not render inside the public React shell. This prevents plugin styling or JavaScript from changing the approved frontend.

The companion Superior Plus Content plugin lets approved editors change text,
images, galleries and page records without changing the React design. Version
2.3 connects the approved quote-form interface to the plugin's secure delivery
endpoint and only shows success after WordPress confirms email delivery.
Version 2.4 includes the parity-verified React bundle used for the complete
15-route WordPress comparison across desktop, tablet and mobile.
Version 2.4.1 normalizes staging subdirectory links and supports WordPress
`index.php` permalink structures without duplicated paths or false React 404s.
Version 2.4.2 selects the normal staging basename on the homepage and the
`index.php` basename only when the current WordPress URL actually uses it.
Version 2.5 replaces stock and generated showcase imagery with the deduplicated,
optimized client project archive and expands service, area and company imagery.
Version 2.6 adds the approved painting-guide and additional-services designs,
editable local-area routes, and server-rendered WordPress SEO metadata.
Version 3.0 matches the current approved React frontend and adds the reusable
Blog Article layout consumed by Superior Plus Content 2.0.
Version 3.1 synchronizes the newest approved React build, adds selectable
content-hub, local-area and campaign templates, and extends server-rendered
article metadata for future managed blog posts.
Version 3.3.1 synchronizes the gallery recovery behaviour with Superior Plus
Content 2.3.2 so all nine approved project groups remain visible after an
interrupted or partial first import.
Version 3.3.2 connects the navigation, homepage area filters, full directory,
dropdowns and local pages to the editable Areas API, with a fallback that keeps
the Areas menu visible even when the WordPress menu is incomplete.
Version 3.3.3 restores the original compact Areas navigation dropdown while
keeping all managed suburbs available on the full Service Areas directory.
Version 3.3.4 restores every managed suburb and all seven regional groups to
the original full Areas navigation dropdown.
Version 3.4.1 preserves the approved localhost region and suburb arrangement
when WordPress returns the same managed areas in alphabetical database order.

== Bundled media ==

The ZIP includes optimized client project images. Large project MP4 files are delivered from the existing GitHub Pages site so the dashboard upload remains reliable.

== Updates ==

Rebuild the ZIP with scripts/package-wordpress-theme.ps1. Increase the Version value in style.css before distributing a later update.
