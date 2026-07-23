# Superior Plus Elementor status

Theme 2.0 no longer reconstructs the approved site with Elementor. Elementor could not reproduce the React reference one-to-one, and its frontend scripts conflict with the production React bundle.

Elementor 4.2.0, Ultimate Addons for Elementor 2.9.2 and MetForm 4.1.7 may remain installed. Their saved pages and templates remain in the WordPress database, but the theme's public React shell does not load them.

Do not edit the public design with Elementor in version 2.0. Make visual and copy changes in the React source, rebuild, test locally, and upload a versioned theme ZIP to staging.

If client-managed editing is required later, build a controlled WordPress content API for the React fields. That preserves the exact frontend while allowing approved text and images to be changed from WordPress Admin.
