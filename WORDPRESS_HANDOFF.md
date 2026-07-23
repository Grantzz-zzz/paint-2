# Superior Plus WordPress React Theme Handoff

Version 2.0 embeds the compiled React frontend inside the WordPress theme. WordPress serves the same components and CSS instead of rebuilding the design with Elementor widgets.

## Included

- Exact homepage
- About, Services, Our Process, FAQs and Contact pages
- Nine complete service pages
- Original header, Services dropdown, footer, images, animations and responsive layout
- Direct WordPress URL redirects to matching React routes
- Local image assets; large project videos remain hosted by the current GitHub Pages deployment

## Safe installation

1. Confirm you are in the staging dashboard.
2. Create a current files-and-database backup.
3. Upload `wordpress-theme/dist/superior-plus-2.0.0.zip` through Appearance → Themes → Add New → Upload Theme.
4. Approve replacing the existing Superior Plus theme when WordPress asks.
5. Activate the theme on staging.
6. Clear WordPress, host and CDN caches.
7. Test the homepage, menu, dropdown, contact form appearance and all service pages.
8. Push to live only after client approval.

Existing Elementor pages, UAE templates and MetForm entries remain stored in WordPress. Version 2.0 does not print their frontend assets because they conflict with the compiled React application.

## Editing

The public design is code-controlled to preserve pixel accuracy. Edit the React source locally, run `npm run build`, copy the non-video build files into `wordpress-theme/superior-plus/react-dist/`, increase the theme version and rebuild the ZIP.

The quote form currently demonstrates the approved interaction but does not send mail. Connect it to a WordPress REST endpoint or external form service before production launch.

## Rebuild package

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-wordpress-theme.ps1
```
