=== Superior Plus Painting ===
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 2.2.0

Exact WordPress delivery of the approved Superior Plus Painting React frontend.

== Installation ==

1. Back up the WordPress site and use staging.
2. Open Appearance > Themes > Add New > Upload Theme.
3. Upload superior-plus-2.2.0.zip and activate it on staging only.
4. Install and activate the separately packaged Superior Plus Content plugin.
5. Clear WordPress, hosting and CDN caches.
6. Test the main menu, Services dropdown and all pages.
7. Push staging to live only after client approval.

== Exact React frontend ==

Version 2.0 renders the compiled React site directly. It includes the homepage, five core pages and nine service pages, with the same design, imagery, responsive behaviour and animations as the approved React reference.

Elementor, UAE and MetForm content is not deleted, but those plugins do not render inside the public React shell. This prevents plugin styling or JavaScript from changing the approved frontend.

The companion Superior Plus Content plugin lets approved editors change text,
images, galleries and page records without changing the React design. The quote
form preserves the approved visual interaction but must be connected to an
email/form endpoint before production launch.

== Bundled media ==

The ZIP includes optimized client and stock images. Large project MP4 files are delivered from the existing GitHub Pages site so the dashboard upload remains reliable.

== Updates ==

Rebuild the ZIP with scripts/package-wordpress-theme.ps1. Increase the Version value in style.css before distributing a later update.
