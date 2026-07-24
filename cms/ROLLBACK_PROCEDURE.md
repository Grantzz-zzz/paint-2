# Superior Plus WordPress rollback procedure

Use this procedure on staging first. Never begin a package update without a
current hosting backup that includes both the database and all WordPress files.

## Before every update

1. Confirm the dashboard URL is the staging site, not production.
2. Create a complete files-and-database backup in the hosting control panel.
3. Download a second content safety copy from **Superior Plus → Backup &
   recovery → Download JSON backup**.
4. Record the currently active theme and plugin versions.
5. Keep the previous working theme and plugin ZIP files.
6. Do not clear the last known-good backup until the updated site is approved.

## Normal package rollback

Use this when WordPress is still accessible and the database is healthy.

1. Put staging into maintenance mode if the host provides it.
2. Upload the previous `superior-plus-x.y.z.zip` in **Appearance → Themes →
   Add New → Upload Theme** and approve replacement.
3. Upload the previous `superior-plus-content-x.y.z.zip` in **Plugins → Add
   Plugin → Upload Plugin** and approve replacement.
4. Activate Superior Plus Painting and Superior Plus Content.
5. Clear WordPress, host, object, and CDN caches.
6. Check Home, Services, one service page, Contact, and the quote form.
7. Confirm the content counts remain 6 pages, 9 services, 10 FAQs,
   4 testimonials, and 9 projects.

Package rollback replaces code only. It must not delete or reset WordPress
content.

## Content-only recovery

Use this when the code works but matching Superior Plus text or fields were
changed incorrectly on the same WordPress installation.

1. Open **Superior Plus → Backup & recovery**.
2. Select the previously downloaded Superior Plus JSON file.
3. Check the explicit replacement confirmation.
4. Run the restore and review its report.
5. Verify the affected pages and media assignments.

The JSON recovery is intentionally administrator-only and checksum-validated.
It is not a substitute for a full hosting backup and should not be used to move
media between unrelated WordPress installations.

## Full hosting restore

Use this after database damage, missing uploads, an inaccessible dashboard, or
an unsuccessful content-only recovery.

1. Stop changes on staging.
2. Open the hosting backup tool or contact the hosting provider.
3. Restore the database and WordPress files from the same backup timestamp.
4. Confirm `wp-content/uploads`, the Superior Plus theme, and the Superior Plus
   Content plugin were restored.
5. Clear every cache layer.
6. Log in again and verify content counts, navigation, media, forms, and all
   15 public routes.
7. Record the restored backup timestamp and test result.

The hosting-provider restore must be rehearsed on staging before production
launch because its controls and retention rules are provider-specific.

