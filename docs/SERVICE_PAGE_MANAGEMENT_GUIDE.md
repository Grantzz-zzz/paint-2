# Superior Plus service-page management guide

This guide is for the client or content administrator who needs to create or update a service page without changing the approved website layout, colours, fonts or React code.

The content plugin stores service content in WordPress. The theme displays that content through the locked React design.

## Before you start

You need a WordPress administrator account with the Superior Plus content-management permission and access to the live WordPress dashboard.

Prepare the following before creating the page:

- The service name, for example `Epoxy garage floor coatings`.
- A short directory summary for the Services page and service cards.
- A hero introduction explaining who the service is for and what it includes.
- A suitable hero image and meaningful alt text.
- Scope items, one item per line.
- The customer benefits, one item per line.
- The project process, one step per line.
- Optional gallery images and related services.
- An SEO title, meta description and preferred URL slug.

Do not edit the theme files or create a normal WordPress Page for a service. Use the dedicated Service content type so the route, API response, navigation and React page remain connected.

## Create a new service page

1. Log in to WordPress.
2. Open **Superior Plus → Create new**.
3. Select **Service Page**.
4. Enter the working title, such as `Epoxy garage floor coatings`.
5. Select **Create draft and start editing**.

The plugin creates a draft and generates a slug from the title. The public route will be:

```text
/services/epoxy-garage-floor-coatings/
```

The draft is not public until it is published.

## Complete the service editor

### WordPress title and URL

- **Title:** The visible service name.
- **Slug:** The final URL segment. Use lowercase words separated by hyphens.
- Keep the slug short and stable. Once the URL has been published and indexed, do not change it casually.

### Hero fields

Complete these fields first:

- **Hero eyebrow:** Short context above the main heading.
- **Hero title:** The main service heading. Leave this aligned with the page title unless there is a deliberate reason to vary it.
- **Hero accent line:** The short highlighted line in the hero.
- **Hero introduction:** A useful, specific summary of the service.
- **Hero image:** Select an image from the Media Library.
- **Hero image alt text:** Describe the image for accessibility; do not stuff it with keywords.

### Directory and service content

- **Services-directory summary:** A short description used in the service directory and cards.
- **Scope heading:** Heading for the included work.
- **Scope items:** One service deliverable per line.
- **Process introduction:** Explain how the work is planned and delivered.
- **Process steps:** One step per line, in the order customers should expect.
- **Benefits:** One customer benefit per line.

Use plain language. Each list item should stand on its own and should not contain a bullet character because the design adds the bullets.

### Flexible content sections

Use **Imported service sections** for the established service-section pattern. Use **Additional flexible sections** for extra approved content blocks.

For each section, check:

- Eyebrow
- Heading
- Description
- List items, if needed
- Image, if needed
- Approved layout or brand style, if the editor exposes those options

Do not use flexible sections to recreate the whole page or introduce a new layout. If the page needs a new design pattern, ask the developer to add it to the locked design system.

### Gallery and related services

- **Service gallery:** Add only relevant, high-quality project images. Order the images deliberately.
- **Related services:** Select existing published services that a customer may also need.

Related services only appear if the selected services are published.

### Closing CTA and SEO

Complete the closing call to action:

- CTA title
- CTA text
- Button label
- CTA destination, normally `/contact/` or the approved quote path

Then complete:

- **SEO title:** Keep it clear and close to the search intent.
- **SEO description:** Summarise the service, location and next step.
- **Canonical URL:** Leave blank unless there is an approved canonical requirement.
- **Social sharing image:** Optional but recommended for important pages.

## Save and preview before publishing

1. Select **Save Draft** or **Update**.
2. In the **Superior Plus publishing** panel, confirm the locked template is `service`.
3. Confirm the route shown is `/services/your-slug/`.
4. Select **Content preview** or **Preview exact React design**.
5. Review the page at desktop and mobile widths.
6. Check the title, hero image, copy, lists, gallery, related services and CTA.
7. Return to the editor and correct anything that looks wrong.

The structured preview shows the saved field values. The React preview shows how those values render in the approved design. Check both when troubleshooting.

## Publish the page

Publish only after the preview is approved.

1. Confirm the title and slug.
2. Confirm the hero image has useful alt text.
3. Confirm the directory summary is complete.
4. Confirm the CTA points to the correct destination.
5. Confirm the SEO title and description are present.
6. Select **Publish**.

The plugin protects incomplete managed content. For service pages, the title is the technical minimum, but a page should not be published for a client until the editorial checklist above is complete.

If WordPress changes the item back to Draft, read the red publishing notice and complete the missing fields. Do not force-publish it through another post type.

## Verify the live page

Use a private/incognito browser window after publishing.

### Public URL

Open:

```text
https://YOUR-DOMAIN.example/services/your-slug/
```

Check:

- The URL loads without a 404.
- The correct title and hero image appear.
- The page is not showing stale draft content.
- The layout works on desktop and mobile.
- Internal links work.
- The quote/contact CTA works.
- Images load without broken-image icons.

### Services directory and navigation

Open the Services directory and confirm the new service appears. Published services are included in the service navigation automatically by the content API.

If the service should appear as a homepage service card, edit the homepage/site settings and add it to **Homepage service cards**. Publishing a service does not necessarily select it for the limited homepage card list.

### REST API checks

Replace `YOUR-DOMAIN.example` and `your-slug` with the live values:

```text
https://YOUR-DOMAIN.example/wp-json/spp/v1/services
https://YOUR-DOMAIN.example/wp-json/spp/v1/services/your-slug
https://YOUR-DOMAIN.example/wp-json/spp/v1/routes/services/your-slug
```

The first endpoint should list the published service. The second should return the full service payload. The third should return the route data consumed by the React page.

Confirm the JSON includes the expected title, slug, hero data, scope, process, benefits, gallery and related services.

### Browser check

Open the published page, open the browser developer tools, and check the Network tab. The page should successfully load the relevant `/wp-json/spp/v1/` requests. A failed request or a response containing the wrong slug usually indicates a WordPress publish, permalink, cache or plugin issue.

## Editing an existing service

1. Open **Superior Plus → Services**.
2. Select the service title.
3. Change only the fields that need updating.
4. Select **Update**.
5. Use **Content preview** to review the saved result.
6. Check the public URL and API endpoints again.

If changing the slug is unavoidable, record the old and new URLs first and ask the site administrator/developer to add or verify a permanent redirect. A slug change can break bookmarks, search results, internal links and existing campaign URLs.

## Troubleshooting

### The service is not visible publicly

Check that:

- The post status is **Published**, not Draft or Pending.
- The service has the `service` locked template.
- The URL uses `/services/`, not `/service/`.
- The plugin is active on the live site.
- The live site is not serving a cached page.
- The service appears in `/wp-json/spp/v1/services`.

### The page shows old content

Check the single-service endpoint first. If the API has the new content but the page does not, clear page/CDN/browser caches and verify the theme bundle is current. If the API is old, the WordPress edit may not have been saved or the live site may be connected to a different WordPress installation.

### The page is a 404 after publishing

Check the exact slug and permalink structure. Save WordPress **Settings → Permalinks** once to flush rewrite rules, then retest the public route and the REST route.

### Images are missing

Confirm the image is in the live Media Library, not only in a local development environment. Re-select the image, save the service, and retest the public page.

### The homepage card is missing

The service can be published and visible in the Services directory while still being absent from the homepage card selection. Add it to the homepage's **Homepage service cards** relationship field, save, and verify the homepage.

## Completion record

For each new service, record:

- Service title
- Final slug and public URL
- Date published
- Editor who approved it
- Hero image and alt text
- Whether it was added to homepage cards
- Preview approved: yes/no
- Public URL checked: yes/no
- Services directory checked: yes/no
- REST API checked: yes/no
- Mobile layout checked: yes/no
- Quote/contact CTA checked: yes/no
