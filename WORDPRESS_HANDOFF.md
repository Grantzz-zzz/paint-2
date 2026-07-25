# Superior Plus WordPress React Theme Handoff

Theme 2.6.0 embeds the compiled React frontend inside WordPress. The companion
Superior Plus Content 1.0.0 plugin supplies editable approved content, local SEO
pages, forms and recovery tools.

## Included

- Exact homepage
- About, Services, Additional Services, Our Process, FAQs and Contact pages
- Nine complete service pages
- Service Areas hub plus 15 editable local-area pages
- Painting Guides hub plus four approved guide articles
- Original header, Services dropdown, footer, images, animations and responsive layout
- Direct WordPress URL redirects to matching React routes
- Local image assets; large project videos remain hosted by the current GitHub Pages deployment

## Safe installation

1. Confirm you are in the staging dashboard.
2. Create a current files-and-database backup.
3. Upload `wordpress-plugin/dist/superior-plus-content-1.0.0.zip` through Plugins → Add New Plugin.
4. Upload `wordpress-theme/dist/superior-plus-2.6.0.zip` through Appearance → Themes → Add New.
5. Approve replacing the existing Superior Plus packages when WordPress asks.
6. Activate both packages on staging and run the safe approved-content importer once.
7. Resave permalinks and clear WordPress, host and CDN caches.
8. Test the homepage, navigation, forms, services, areas and painting guides.
9. Push to live only after client approval.

Existing Elementor pages, UAE templates and MetForm entries remain stored in WordPress. Version 2.0 does not print their frontend assets because they conflict with the compiled React application.

## Editing

The public design is code-controlled to preserve pixel accuracy. Edit the React source locally, run `npm run build`, copy the non-video build files into `wordpress-theme/superior-plus/react-dist/`, increase the theme version and rebuild the ZIP.

The quote form submits through the plugin REST endpoint. Configure and verify the
production recipient email on staging before launch.

## Rebuild package

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-wordpress-theme.ps1
```
