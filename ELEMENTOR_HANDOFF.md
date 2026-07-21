# Superior Plus Elementor handoff

The editable homepage targets Elementor 4.2.0 and uses native free-Elementor containers and widgets. The custom theme continues to control the header, footer, service post type and Services dropdown.

## Install on the client site

1. Back up the WordPress database and files.
2. Upload and install `wordpress-theme/dist/superior-plus-1.1.0.zip` as a theme update.
3. Confirm Elementor 4.2.0 is active.
4. Open Appearance → Superior Plus Setup.
5. If starter content has not been created, click **Create starter content** first.
6. Click **Install or replace Elementor homepage**.
7. Open Pages → Home → Edit with Elementor.

The Elementor action replaces only the Home page layout. It does not replace services, navigation, the theme header or the theme footer.

## Editing

- Click a heading, paragraph, button or image to edit it.
- Drag containers in Elementor's Structure panel to reorder sections.
- Duplicate a section before making a substantially different version.
- Keep the supplied CSS classes on widgets and containers; they carry the React design system.
- Use Elementor's responsive controls to preview desktop, tablet and mobile before publishing.

## Portable template

The standalone template is bundled at `wordpress-theme/superior-plus/elementor-templates/superior-plus-home-elementor-4.2.json`. It can also be imported through Elementor's template library, but the theme setup action is preferred because it assigns the homepage and clears Elementor's generated-file cache automatically.

## Free Elementor boundary

The page body is editable with drag and drop. The global header and footer remain theme-managed. Editing those global parts inside Elementor requires Elementor Pro or a separate header/footer builder.
