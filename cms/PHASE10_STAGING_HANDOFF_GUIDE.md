# Superior Plus Phase 10 staging and handoff guide

This guide installs the locked React website on the client's **staging**
WordPress site. It does not authorize changes to the live production site.

## 1. Use only these two ZIP files

| Package | Exact file | Upload screen | Purpose |
| --- | --- | --- | --- |
| Theme | `superior-plus-2.4.2.zip` | **Appearance → Themes → Add New → Upload Theme** | The complete React frontend, design, CSS, responsive rules and animations |
| Plugin | `superior-plus-content-0.8.1.zip` | **Plugins → Add New Plugin → Upload Plugin** | Editable content, Media Library fields, routes, migration, forms and recovery |

Local package links:

- `C:\Users\Grant\Downloads\paint2\wordpress-theme\dist\superior-plus-2.4.2.zip`
- `C:\Users\Grant\Downloads\paint2\wordpress-plugin\dist\superior-plus-content-0.8.1.zip`

Do not upload an older numbered ZIP. Do not upload the React repository ZIP,
the source folder, `folder 1.zip`, or the plugin ZIP on the Themes screen.

## 2. Confirm that this is staging

Before changing anything:

1. Look at the browser address bar.
2. Confirm it is the staging domain or staging subdomain.
3. Open the production site in a separate private/incognito window.
4. Confirm production remains available and has a different dashboard URL.
5. Do not continue if the dashboard URL is the production site.

Write down:

- staging URL;
- production URL;
- active theme name and version;
- current Superior Plus Content plugin version;
- date and time the update begins.

## 3. Create two backups

### Hosting backup

In the hosting dashboard, create a backup containing both:

- the complete WordPress database;
- all WordPress files, especially `wp-content/uploads`, themes and plugins.

Record the backup timestamp. If the WordPress account does not provide a
hosting-backup screen, ask Rene or the hosting provider to create it before
continuing.

### Superior Plus content backup

If Superior Plus Content 0.8.0 or later is already active:

1. Open **Superior Plus → Backup & recovery**.
2. Click **Download JSON backup**.
3. Store the downloaded JSON beside the two installation ZIPs.

This JSON restores matching Superior Plus content on the same WordPress
installation. It does not replace the complete hosting backup.

## 4. Determine which installation path applies

### Existing Superior Plus staging installation

Use the update sequence in sections 5–7. Uploading the numbered ZIPs replaces
the package code but preserves content stored in the WordPress database.

Do not deactivate or delete the old packages first.

### Fresh staging clone without Superior Plus

Use the same sequence, but WordPress will say **Install** instead of **Replace**.
After both packages are active, run the importer once as described in section 8.

## 5. Upload the content plugin first

1. In staging WordPress, open **Plugins → Add New Plugin**.
2. Click **Upload Plugin**.
3. Choose `superior-plus-content-0.8.1.zip`.
4. Click **Install Now**.
5. If WordPress detects an existing version, click
   **Replace current with uploaded**.
6. Wait for the success message.
7. Open **Plugins → Installed Plugins**.
8. Find **Superior Plus Content**.
9. Confirm the version is **0.8.1**.
10. If WordPress says the plugin was updated but could not be reactivated,
    click **Activate** manually.

Expected result:

- **Superior Plus** appears in the left dashboard menu.
- The existing pages, services, projects, FAQs and testimonials remain.
- The public staging site may still use the previous theme until section 6.

Stop and roll back if WordPress reports a PHP fatal error or the dashboard
becomes inaccessible.

## 6. Upload the React theme second

1. Open **Appearance → Themes**.
2. Click **Add New Theme**.
3. Click **Upload Theme**.
4. Choose `superior-plus-2.4.2.zip`.
5. Click **Install Now**.
6. If WordPress detects the existing theme, click
   **Replace current with uploaded**.
7. Return to **Appearance → Themes**.
8. Find **Superior Plus Painting**.
9. Confirm the version is **2.4.2**.
10. Click **Activate** only on staging.

Expected result:

- The staging frontend becomes the approved React design.
- There is one React header and one React footer.
- Elementor/UAE headers, footers, CSS and scripts do not render on the public
  staging pages.

The theme ZIP is approximately 32 MB. If WordPress rejects it because of the
upload limit, do not unpack or rebuild it. Ask the host to temporarily raise
`upload_max_filesize` and `post_max_size`, or ask the hosting provider to upload
the exact ZIP.

## 7. Refresh routes and clear caches

1. Open **Settings → Permalinks**.
2. Without changing the permalink structure, click **Save Changes** once.
3. Clear any WordPress caching plugin.
4. Clear the hosting/server cache.
5. Clear object cache or Redis if the host exposes it.
6. Clear CDN/Cloudflare cache if one is active.
7. Open staging in a private/incognito window.

Do not clear or modify production caches.

## 8. Run the importer only when appropriate

Open **Superior Plus → Import approved site**.

### Fresh staging installation

1. Click **Import or safely refresh approved content** once.
2. Wait for the completion report.
3. Confirm there are no errors or missing records.

### Existing staging installation

If the approved importer has already completed successfully, do not run it
again merely because the theme or plugin was updated. The importer is
idempotent and protects client edits, but rerunning it is only necessary when:

- the migration report is missing or incomplete;
- baseline pages or records are missing;
- the package instructions explicitly require a safe refresh.

Expected baseline:

- 1 Site Settings record;
- 6 core pages;
- 9 services;
- 10 FAQs;
- 4 testimonials;
- 9 project records.

Client-created records may increase these totals and must not be deleted.

## 9. Verify global settings

Open **Superior Plus → Site Settings** and check:

- business/display name;
- phone display and telephone number;
- email address;
- Melbourne location;
- logo;
- footer introduction and labels;
- four trust-strip items;
- service areas;
- default CTA;
- navigation labels;
- Instagram/social URL if confirmed.

Administrator-only items:

- quote-recipient email;
- privacy/consent text;
- backup and recovery;
- package installation and system settings.

Do not invent client information. Leave unconfirmed legal, insurance, warranty,
opening-hours and privacy claims unpublished until Rene approves them.

## 10. Check all 15 public routes

Open every route directly and refresh the browser:

1. `/`
2. `/about`
3. `/services`
4. `/our-process`
5. `/faqs`
6. `/contact`
7. `/services/residential-painting-melbourne`
8. `/services/commercial-painting-melbourne`
9. `/services/interior-painting-melbourne`
10. `/services/exterior-painting-melbourne`
11. `/services/roof-painting-melbourne`
12. `/services/fence-painting-melbourne`
13. `/services/deck-painting-staining-melbourne`
14. `/services/wallpaper-removal-melbourne`
15. `/services/plaster-repairs-melbourne`

For each page confirm:

- no 404 after a direct refresh;
- one visible H1;
- correct React header and footer;
- no missing section;
- no broken image;
- mobile layout has no horizontal overflow;
- links and buttons go to the expected destination.

Also verify:

- the Services dropdown contains all nine services;
- FAQ accordions work;
- testimonial controls work;
- galleries and lightboxes work;
- all five project videos play;
- telephone links open the dialler;
- email links open an email client;
- keyboard focus is visible.

The five MP4 files currently stream from the GitHub Pages asset URL. Keep
GitHub Pages available until those files are moved into the WordPress Media
Library or another approved video host.

## 11. Test safe content editing

### Text replacement

1. Open an existing Superior Plus page or service in WordPress.
2. Change one harmless staging-only sentence.
3. Click **Update**.
4. Open the public staging route in a private window.
5. Confirm the text changed but the design did not.
6. Restore the approved sentence and update again.

### Image replacement

1. Open a page or service containing a Hero image or gallery.
2. Click **Choose or replace**.
3. Select an approved Media Library image.
4. Enter accurate alternative text.
5. Update the record.
6. Verify the image, crop and mobile layout publicly.
7. Restore the approved image if this was only a demonstration.

Do not edit these pages with Elementor. Elementor is not the content editor for
the locked React frontend.

## 12. Test creating a locked Standard Page

Use a temporary staging-only page:

1. Open **Superior Plus → Create new**.
2. Choose **Standard content page**.
3. Enter `Phase 10 Staging Test`.
4. Click **Create draft and start editing**.
5. Complete the required hero eyebrow, accent, introduction and hero image.
6. Add at least one supported content section.
7. Save the draft.
8. Preview it through the React preview.
9. Publish it.
10. Open its clean public URL and refresh it.
11. Edit one sentence and verify the public change.
12. Change the status back to **Draft**.
13. Confirm its public URL now returns the designed 404 page.
14. Delete the temporary page when the test is complete.

Editors can manage routine content and create supported core pages. Installing
packages, changing system settings, backups, recovery, and creating protected
Service/Project records require an Administrator. Give the client the lowest
role that supports their agreed workflow.

## 13. Configure and test quote delivery

Do this only after Rene confirms the recipient and privacy wording:

1. Sign in as Administrator.
2. Open **Superior Plus → Site Settings**.
3. Enter the confirmed quote-recipient email.
4. Enter the confirmed privacy/consent wording.
5. Save.
6. Submit a clearly labelled staging test enquiry.
7. Confirm the React success state appears only after delivery succeeds.
8. Confirm the recipient receives the message.
9. Check spam/junk.
10. Test one validation failure and retry.
11. Confirm no personal enquiry content is retained in WordPress.

Until the recipient is configured, the form intentionally tells visitors to
call or email instead of pretending the message was delivered.

## 14. Complete the Phase 9 recovery gate on staging

Follow `cms/PHASE9_VERIFICATION.md` and `cms/ROLLBACK_PROCEDURE.md`.

At minimum:

1. Download a fresh Superior Plus JSON backup.
2. Confirm content survives plugin replacement.
3. Confirm content survives theme replacement.
4. Confirm switching themes and switching back preserves the content.
5. Rehearse the hosting provider's complete files-and-database restore.
6. Record the test result and backup timestamp.

Run the destructive uninstall test only on a separate disposable WordPress
runtime. Do not uninstall the content plugin from the staging site being
prepared for client approval.

## 15. Create the client account and demonstrate editing

1. Open **Users → Add New User**.
2. Use an individual client email, not a shared team password.
3. For routine text/image/page work, begin with **Editor**.
4. Demonstrate:
   - updating text;
   - replacing an image;
   - reordering a gallery;
   - drafting and publishing a Standard Page;
   - unpublishing a page;
   - viewing revisions.
5. Explain that fonts, colours, spacing, shapes and animations are intentionally
   locked.
6. Keep Administrator access limited to trusted people who must install
   packages, configure forms, restore backups, or create protected records.

If the client must independently create new Service or Project records, decide
whether they will receive Administrator access or whether the plugin should be
extended with a narrower custom content-manager role before launch.

## 16. Approval and production stop line

Collect written approval for:

- desktop, tablet and mobile appearance;
- all text and imagery;
- navigation and routes;
- forms and recipient email;
- privacy wording;
- editing workflow;
- video hosting decision;
- backup and rollback rehearsal.

Do not upload either ZIP to production until approval is recorded and a fresh
production files-and-database backup exists.

## Troubleshooting

### “The theme is missing the style.css stylesheet”

The wrong ZIP was uploaded. Use exactly `superior-plus-2.4.2.zip` in
**Appearance → Themes**.

### “Plugin updated but could not be reactivated”

Open **Plugins → Installed Plugins**, find **Superior Plus Content**, and click
**Activate**. Then confirm version 0.8.1.

### “Destination folder already exists”

For a normal update, choose WordPress's **Replace current with uploaded**
option. Do not delete database content.

### Theme upload is too large

Ask the host to raise the upload limit or upload the exact theme ZIP through
the hosting control panel. Do not upload the source repository ZIP.

### Pages return 404 after activation

Open **Settings → Permalinks**, click **Save Changes**, clear caches and retry.

### Styling looks like Elementor or two headers appear

Confirm **Superior Plus Painting 2.4.2** is the active theme, clear every cache,
and inspect the page again in a private window.

### A video does not play

Confirm the corresponding GitHub Pages MP4 URL is reachable. Do not disable
GitHub Pages until all five videos are migrated to another host.

### Content looks missing after an update

Do not rerun random installers or delete records. Review the migration report,
then use the same-site JSON recovery or the complete hosting backup according
to `cms/ROLLBACK_PROCEDURE.md`.
