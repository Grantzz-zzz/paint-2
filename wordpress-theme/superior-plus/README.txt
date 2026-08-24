=== Superior Plus Painting ===
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 3.6.6

Exact WordPress delivery of the approved Superior Plus Painting React frontend.

== Installation ==

1. Back up the WordPress site and use staging.
2. Open Appearance > Themes > Add New > Upload Theme.
3. Upload superior-plus-3.6.6.zip and activate it on staging only.
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
Version 3.5.0 adds flexible-section rendering, compact lists, multi-paragraph
copy and accessible long-hero disclosure controls without removing old data.
Version 3.5.1 prevents bundled emergency copy from flashing before current
WordPress REST content loads, while retaining the fallback after API failure.
Version 3.5.3 adds responsive branded layouts for plugin-managed flexible
sections, including optional project imagery, split/background compositions,
larger readable text and locked Superior Plus colour treatments.
Version 3.5.4 keeps long WordPress homepage copy inside the hero, aligns the
painting-process introduction, and standardizes painting-scope tool icons.
Version 3.5.5 safely restores the three homepage hero trust points when an old
configured list is empty while preserving an explicit visibility control.
Version 3.6.0 renders the editable homepage process strip and one reusable
local-service location band on every route, with safe near-footer placement,
responsive long-content handling and optional global move-down placement.
Version 3.6.1 makes the default homepage service cards consume each service's
editable Services-directory summary even when no custom card selection is saved.
Version 3.6.2 hardens breadcrumb structured data with named WebPage items and
renders the plugin-controlled Additional Services card in the existing flip grid.
Version 3.6.3 prevents the React metadata layer from adding a second structured-
data graph when Yoast or Rank Math already owns server-rendered schema. Direct
page loads remain controlled by the SEO plugin while client navigation keeps
titles, descriptions, canonicals and social tags aligned with the visible route.
Version 3.6.4 restores compatibility with older iPadOS Safari releases by
transpiling the production bundle for Safari 12 and supplying the small standard-
API fallbacks needed before React renders. The frontend shell now uses
`wp_head()` and `wp_footer()` so Yoast can output metadata normally, and a
server-rendered branded loading/contact fallback prevents a blank white page if
JavaScript or a cached asset fails before startup.
Version 3.6.5 keeps the hashed React entry URL identical when it is loaded
directly and imported by lazy chunks, preventing duplicate React runtimes and
error #321. It prints the WordPress content API bridge independently before the
module starts and removes unused Elementor/UAE frontend assets from the locked
React shell without deleting any builder data.
Version 3.6.6 replaces the built-in WebP photo library with verified progressive
JPEG equivalents for older iPad Safari releases, translates saved plugin fields
that still point to an earlier theme WebP URL, and uses stable 2D front/back card
swaps on touch hardware while retaining the desktop flip animation.

== Bundled media ==

The ZIP includes optimized client project images. Large project MP4 files are delivered from the existing GitHub Pages site so the dashboard upload remains reliable.

== Updates ==

Rebuild the ZIP with scripts/package-wordpress-theme.ps1. Increase the Version value in style.css before distributing a later update.
