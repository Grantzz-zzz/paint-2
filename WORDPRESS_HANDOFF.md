# Superior Plus WordPress Theme Handoff

The custom theme lives at `wordpress-theme/superior-plus/`. It is separate from the React/Vite reference site.

## Included in the local theme

- Shared header, Services submenu and footer
- Homepage and five core internal page templates
- Reusable template for all nine Service entries
- Editable Service fields in WordPress Admin
- Editable Project content type backed by the Media Library
- Client-photo galleries with progressive loading and lightbox viewing
- Responsive styling, keyboard navigation and reduced-motion support
- Business details and form shortcode settings in the Customizer

## Safe installation sequence

1. Do not test first on the live site when staging is available.
2. Back up files and the database.
3. Upload `wordpress-theme/dist/superior-plus-1.0.0.zip` through Appearance → Themes → Add New → Upload Theme.
4. Activate the theme. Activation alone does not change the homepage or generate content.
5. Open Appearance → Superior Plus Setup.
6. Click Create starter content only after confirming the backup/staging environment.
7. Review Appearance → Menus and Appearance → Customize.
8. Edit Services and Projects through their dedicated admin menus.
9. Add the chosen form plugin shortcode in the Customizer.

The setup importer creates only missing items and never overwrites an existing Page or Service with the same slug. It does set the generated Home page as the static homepage when deliberately run.

## Updating galleries

The bundled project photos appear as the initial galleries. To replace a gallery with Media Library content:

1. Add Project entries in WordPress.
2. Upload and select a Featured Image for each Project.
3. Assign the Project category: Commercial, Interior, Exterior, Fence or Outdoor.
4. Once a category contains Project entries with featured images, that service gallery automatically uses those editable projects instead of bundled fallback photos.

Upload approved videos separately through the Media Library. The large MP4 files are not included in the theme ZIP so dashboard installation remains reliable.

## Rebuild package

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package-wordpress-theme.ps1
```

