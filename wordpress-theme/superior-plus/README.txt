=== Superior Plus Painting ===
Requires at least: 6.4
Requires PHP: 8.0
Stable tag: 1.0.2

Custom WordPress theme matching the approved Superior Plus Painting React frontend.

== Installation ==

1. Back up the WordPress site and use staging whenever possible.
2. Open Appearance > Themes > Add New > Upload Theme.
3. Upload superior-plus-1.0.2.zip and activate the theme.
4. Open Appearance > Superior Plus Setup.
5. Review the warning and click Create starter content only when ready.
6. Open Appearance > Customize > Superior Plus business details to confirm contact information.
7. Review Pages, Services, Projects and Appearance > Menus.

Activation alone does not create pages or change the homepage. Starter content is imported only through the explicit setup screen.

== Editable content ==

Services use a dedicated Service content type with fields for hero copy, scope, process, benefits, colour and gallery category.

Projects use a dedicated Project content type and the WordPress Media Library. Give each project a featured image and assign a project category matching the relevant service gallery.

The contact template accepts a shortcode under Appearance > Customize > Superior Plus business details. It works with form plugins that provide shortcodes.

== Bundled media ==

The theme ZIP includes optimized client photos and excludes large MP4 files to keep dashboard upload reliable. Upload approved videos separately through Media > Add New and place them inside Project content as needed.

== Updates ==

Rebuild the ZIP with scripts/package-wordpress-theme.ps1. Increase the Version value in style.css before distributing an update.
