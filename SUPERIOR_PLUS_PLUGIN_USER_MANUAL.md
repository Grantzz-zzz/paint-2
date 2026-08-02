# Superior Plus Content Plugin — User Manual

This manual applies to **Superior Plus Content 2.3.3** and **Superior Plus Theme 3.3.1**.

The plugin lets an editor change website content and media while the theme keeps the approved layout and styling locked.

## 1. Before editing

1. Sign in to the WordPress dashboard.
2. Confirm **Plugins → Installed Plugins → Superior Plus Content** is version **2.3.0**.
3. Make a backup through **Superior Plus → Content Backup** before a large edit.
4. Use the normal WordPress **Edit** screen. Do not use “Edit with Elementor” for these managed pages.
5. After changing anything, click **Update** or **Publish**. Selecting or removing media alone does not publish the change.

## 2. Main navigation map

### Website pages

Go to **Pages → All Pages**, then select **Edit** under the required page:

- Home
- About
- Services
- Additional Services
- Service Areas
- Gallery
- Our Process
- FAQs
- Contact
- Blog/Painting Guides

Scroll to the box named **Superior Plus editable content**.

### Individual service pages

Go to **Superior Plus → Services**, then select the service:

- Residential Painting
- Commercial Painting
- Interior Painting
- Exterior Painting
- Roof Painting
- Fence Painting
- Deck Painting & Staining
- Wallpaper Removal
- Plaster Repairs

### Main gallery projects

Go to **Superior Plus → Projects**.

Each Project record controls one project and can contain:

- a main/featured image;
- additional gallery images or videos;
- a title and project type;
- a gallery category;
- its image crop position.

### Blog articles, FAQs and reviews

- **Superior Plus → Blog Articles** — blog titles, text, hero images and article information.
- **Superior Plus → FAQs** — individual questions and answers.
- **Superior Plus → Testimonials** — review name, review text, rating and image.
- **Superior Plus → Site Settings** — business information, footer, counters, links, map and quote recipient.

## 3. Understanding the controls

### Normal text field

Click inside the field, change the wording, then click **Update**.

Examples include Hero title, Hero eyebrow, Hero introduction and section headings.

### Choose or replace

Used for one image, such as a hero image or featured image.

1. Click **Choose or replace**.
2. Select **Upload files** to upload a new image directly, or choose an existing Media Library image.
3. Select the image.
4. Click **Use selected media**.
5. Click **Update**.

WordPress automatically saves a directly uploaded image in the Media Library. You do not have to visit Media Library first.

### Repeatable card rows

Repeatable rows contain these controls:

- **Add card** or **Add item**
- **Move up**
- **Move down**
- **Remove**

For a card with a heading and description:

1. Edit the **Heading** field.
2. Edit the **Description** field.
3. Reorder it if required.
4. Click **Update**.

Removing a row and clicking **Update** removes the complete corresponding frontend card. An empty card shell is not left behind.

### Gallery editor

Every gallery item contains:

- image/video preview;
- **Alt text**;
- **Caption**;
- **Image focal point**;
- **Replace media**;
- **Move up**;
- **Move down**;
- **Remove**.

The caption is the visible name used by the gallery card or viewer. Alt text describes the image for accessibility and search engines.

## 4. Add a gallery image and create its card

1. Open the relevant Service, Project, FAQ page or other page containing a gallery.
2. Scroll to **Service gallery**, **Project gallery**, or **Before-and-after / project images**.
3. Click **Add images or videos**.
4. Use **Upload files** to upload directly, or select existing media.
5. Select one or several images.
6. Click **Use selected media**.
7. Enter a clear **Alt text** and **Caption** for each item.
8. Adjust the focal point if necessary.
9. Click **Update**.

Each saved image automatically creates one complete styled visual card on the website. Adding five images creates five cards.

## 5. Replace the image inside an existing gallery card

This is the preferred method when the card is already in the correct position.

1. Open the relevant Service or Project.
2. Find the gallery item by its preview or caption.
3. Click **Replace media** on that item.
4. Upload a new image or select one from the Media Library.
5. Click **Use selected media**.
6. Check the Alt text, Caption and Image focal point.
7. Click **Update**.

The existing card remains in the same position, but its image changes. You do not need to delete and recreate the card.

## 6. Remove a gallery image and its complete card

1. Open the relevant Service or Project.
2. Find the image in its gallery field.
3. Click **Remove** on that gallery row.
4. Click **Update**.

The image and its complete visual card disappear from the page. The original Media Library file is not permanently deleted, so it can be reused later.

In version 2.3.3, removing every managed gallery image does not cause the bundled default images to return.

## 7. Change the crop or visible part of an image

Use **Image focal point** with two percentages:

- `50% 50%` — centre;
- `50% 20%` — centre near the top;
- `50% 80%` — centre near the bottom;
- `20% 50%` — left side;
- `80% 50%` — right side.

Click **Update**, then check the live page. This changes how the image fits its card without editing the original file.

## 8. Main Gallery page

The public Gallery page is controlled primarily through **Superior Plus → Projects**.

### Change the main image of an existing project

1. Go to **Superior Plus → Projects**.
2. Edit the project.
3. Find **Featured project image**.
4. Click **Choose or replace**.
5. Select the new image and click **Use selected media**.
6. Adjust **Image crop position** if needed.
7. Click **Update**.

### Change an additional image card

1. Edit the Project.
2. Find **Project gallery**.
3. Locate the required image.
4. Click **Replace media**.
5. Choose the replacement and click **Update**.

### Add more cards to a project

Use **Project gallery → Add images or videos**. Each added image becomes another Gallery-page card.

### Delete one Gallery-page card

- For an additional image, click **Remove** beside that Project gallery item.
- For the project’s main card, remove the **Featured project image**.
- Click **Update**.

### Delete an entire project and all its cards

Go to **Superior Plus → Projects**, hover over the project and click **Trash**.

### Add a new project

1. Go to **Superior Plus → Projects → Add New**.
2. Enter the project title.
3. Select the appropriate **Project category** so it appears in the correct Gallery section.
4. Set the **Project type**.
5. Add the **Featured project image**.
6. Add optional images under **Project gallery**.
7. Add captions and alt text.
8. Click **Publish**.

## 9. Service-page galleries

1. Go to **Superior Plus → Services**.
2. Edit the required service.
3. Scroll to **Service gallery**.
4. Add, replace, reorder, caption or remove images.
5. Click **Update**.

The “Why Choose Superior Plus” copy remains paired with the project showcase. Removing a gallery image removes only its visual card, not the approved service wording.

## 10. Before-and-after gallery on the FAQs page

1. Go to **Pages → All Pages → FAQs → Edit**.
2. Scroll to **Before-and-after / project images**.
3. Use the gallery controls to add, replace, reorder or remove images.
4. Use captions such as “Before — exterior preparation” and “After — completed exterior finish.”
5. Click **Update**.

## 11. Cards with separate text and image lists

Some designed flip cards use one numbered text list and one numbered image gallery. Their order must match.

Examples:

- About: **Standards**, **Standard card summaries**, **Standard card full descriptions**, and **Standard card images**.
- Our Process: **Why-it-works points**, summaries, descriptions and images.
- Services page: **Professional-service cards** and **Professional-service card images**.

For example, Card 03 uses:

- text row 03;
- summary/detail row 03;
- image item 03.

### Add one of these cards

1. Add the new text/card row.
2. Add its summary and full description where provided.
3. Add one image to the matching image gallery.
4. Move all related entries to the same numbered position.
5. Click **Update**.

### Replace its image

Find the matching numbered image in the card-image gallery and click **Replace media**.

### Delete it

Remove the text/card row and remove its matching image item. Keep the remaining rows in matching numerical order, then click **Update**.

## 12. Page-by-page quick reference

### Home

Go to **Pages → Home → Edit**.

You can edit:

- hero headings, introduction and hero image;
- hero trust points;
- homepage service selection;
- commercial feature text and image;
- selected projects;
- trust cards;
- service-area copy;
- selected testimonials and articles;
- quote-section wording and fields.

The homepage service-card images come from the corresponding Service records. To change one, edit that Service’s hero/gallery media.

### About

Go to **Pages → About → Edit**.

You can edit:

- hero text and image;
- approved content sections;
- editorial and archive images;
- local-roots copy;
- standards card text, summaries, details and images.

### Services main page

Go to **Pages → Services → Edit**.

You can edit:

- hero;
- introduction;
- additional-service cards;
- professional-service cards and their corresponding images.

### Additional Services

Go to **Pages → Additional Services → Edit**.

You can add, edit, reorder or remove its service cards and supporting sections.

### Our Process

Go to **Pages → Our Process → Edit**.

You can edit:

- hero;
- supporting sections;
- process-step cards;
- why-it-works cards, summaries, details and images.

### Service Areas

Go to **Pages → Service Areas → Edit** for the directory wording and hero. Use the related managed area pages for individual suburb content where available.

### Gallery

Use **Superior Plus → Projects** for the actual project cards and images.

### FAQs

Use **Superior Plus → FAQs** for individual questions and answers. Use **Pages → FAQs → Edit** for the introduction, displayed FAQ selection and before-and-after images.

### Contact

Go to **Pages → Contact → Edit**.

You can edit:

- hero;
- what-happens-next cards;
- form service and property options;
- form labels/placeholders;
- form note and closing call to action.

Do not change SMTP delivery here. Email delivery remains under **WP Mail SMTP**, while the recipient is under **Superior Plus → Site Settings**.

### Blog

Go to **Superior Plus → Blog Articles** to edit individual articles, excerpts, hero images, takeaways and related services.

## 13. Reordering and saving

- **Move up/Move down** changes the frontend order.
- **Remove** does not take effect publicly until **Update** is clicked.
- If the live page still shows the old content, refresh it once or clear the WordPress/cache plugin cache.
- Do not repeatedly click Update while the first save is still loading.

## 14. Safe image recommendations

- Use WebP or a reasonably compressed JPEG.
- Use clear project photographs without another company’s logo.
- Write meaningful alt text, for example: “Completed exterior repaint in Chadstone by Superior Plus Painting.”
- Avoid uploading the same image repeatedly; select the existing Media Library copy when available.
- Check both desktop and mobile after changing a hero image or focal point.

## 15. Important distinction: remove from a card vs delete permanently

Clicking **Remove** in the plugin:

- removes the image from that website card;
- leaves the file safely inside Media Library.

Deleting through **Media → Library → Delete permanently**:

- deletes the source file itself;
- may break another page that uses the same image.

Use the plugin’s **Remove** button unless the image must be erased from WordPress entirely.

## 16. Universal controls found on pages, services and blog articles

Open the record and scroll to **Superior Plus editable content**. These controls appear on most managed pages, every Service and every Blog Article.

### Hero area

- **Hero eyebrow** changes the small uppercase line above the main heading.
- **Hero title** changes the large first headline.
- **Hero accent line** changes the styled second headline line.
- **Hero introduction** changes the large paragraph under the headline.
- **Hero image** changes the large image on the right or below the hero text.
- **Hero image alt text** describes that hero image to screen readers and search engines.

To replace a hero image, use **Hero image → Choose or replace**, select or upload the image, click **Use selected media**, and then click **Update**.

### Closing call to action

- **Closing CTA title** changes the final large call-to-action heading.
- **Closing CTA text** changes its supporting paragraph.
- **Closing CTA button label** changes the button wording.
- **Closing CTA destination** changes where that button goes. Use a site path such as `/contact`.

If these page-specific fields are empty, the global default CTA from Site Settings is used.

### Search and sharing

- **SEO title** changes the browser/search-result title.
- **SEO description** changes the search-result description.
- **Canonical URL** identifies the preferred public URL.
- **Social sharing image** changes the image shown when the page is shared.

The **Social sharing image** is separate from the visible hero image. Replace both if they should match.

## 17. Complete Homepage editing map

Go to **Pages → All Pages → Home → Edit**, then open **Superior Plus editable content**.

### Homepage hero

- Visible small line: **Hero eyebrow**
- Main headline: **Hero title**
- Styled headline line: **Hero accent line**
- Optional third headline line: **Optional third hero headline line**
- Introductory paragraph: **Hero introduction**
- Main hero photograph: **Hero image**
- Hero accessibility description: **Hero image alt text**
- Check-mark items below the buttons: **Hero trust points — one per line**

### Homepage service flip cards

The Home page only selects which Service records appear. The individual card content comes from those Services.

- Select or remove cards: **Homepage service cards**
- Section small heading: **Services eyebrow**
- Section main heading: **Services title**
- Styled heading line: **Services accent**
- Section paragraph: **Services introduction**

To edit one specific homepage service flip card:

1. Go to **Superior Plus → Services**.
2. Open the corresponding service.
3. Change the Service’s WordPress **Title** for the card title.
4. Change **Services-directory summary** for the card description.
5. Change **Hero image** for the Service image used by the card.
6. Click **Update**.

The Roof card uses the approved roof-specific homepage artwork supplied with the theme. Other selected service cards follow the corresponding Service record.

### Homepage counters and badge

Go to **Superior Plus → Site Settings → Superior Plus Site Settings → Edit**.

- Animated numbers and labels: **Homepage counters — Number | Label**
- Review-platform badge image: **Homepage review-platform badge image**

Each counter is one card row. Edit its Number and Label, reorder it, add a row, or remove the row.

### Commercial feature

Return to **Pages → Home → Edit**.

- Main heading: **Commercial feature title**
- Styled heading line: **Commercial feature accent**
- Supporting paragraph: **Commercial feature text**
- Optional feature image: **Commercial feature image**

The small industry tags and compact process labels in this design are locked presentation labels. They do not currently have separate plugin fields.

### Selected work cards

- Select the three project records: **Selected homepage projects**
- Section heading: **Projects section heading**
- Styled heading line: **Projects section accent line**
- Section paragraph: **Projects section introduction**

To change one selected project card’s title, image or project-type text:

1. Go to **Superior Plus → Projects**.
2. Open that selected Project.
3. Change its WordPress **Title**.
4. Change **Project type**.
5. Replace **Featured project image**.
6. Adjust **Image crop position** if required.
7. Click **Update**.

### Why-us cards

- Section heading: **Why-us title**
- Styled heading line: **Why-us accent**
- Section paragraph: **Why-us introduction**
- Individual cards: **Trust cards — Heading | Description**

Every row is one complete card. Edit the Heading and Description in the same row.

### Homepage blog cards

- Select the displayed articles: **Selected homepage blog articles**
- Section small heading: **Blog preview eyebrow**
- Section heading: **Blog preview title**
- Styled line: **Blog preview accent**
- Section paragraph: **Blog preview introduction**

Each blog card’s image, title, excerpt, category and read time are edited under **Superior Plus → Blog Articles**.

### Homepage service-area section

- Section heading: **Service-areas title**
- Introductory paragraph: **Service-areas introduction**

The master suburb list is edited under **Superior Plus → Site Settings → Service areas — one suburb per line**. Individual suburb-page content is edited under **Pages → All Pages** by opening the relevant suburb page.

### Homepage reviews

- Select displayed reviews: **Selected homepage testimonials**
- Edit each review under **Superior Plus → Testimonials**.
- Google rating, review count and destination link are under **Superior Plus → Site Settings**.

### Homepage quote form

- Section heading: **Quote section title**
- Section paragraph: **Quote section text**
- Response label: **Response-time label**
- Field labels and placeholders: **Quote form fields — Label | Placeholder**

Keep the form rows in their existing order because each row maps to a particular input.

The recipient email and consent wording are edited under **Superior Plus → Site Settings**, not on the Home page.

### Homepage map and business details

Go to **Superior Plus → Site Settings**.

- Address shown beside the map: **Map street address**
- Button destination: **Public Google Maps URL**
- Map preview: **Google Maps embed URL**
- Phone and email: the business contact fields in Site Settings

## 18. Complete About page editing map

Go to **Pages → All Pages → About → Edit**.

### Hero

Use the universal Hero fields described in Section 16.

### Approved information sections

Use **Client-approved sections — Heading | Body**. Each row controls one complete text section.

### Quality/approach section

- Heading: **Approach heading**
- Paragraphs: **Approach paragraphs**
- Image beside the text: **Editorial project image**

Use a blank line inside **Approach paragraphs** to create a separate paragraph.

### Local-roots/archive section

- Company/archive image: **Company archive image**
- Text: **Local-roots copy**

The certificate and its supporting archive description remain part of the approved About design. Do not delete the source Media Library item unless the client wants the certificate removed everywhere.

### About flip cards

These controls are order-matched:

- Card front title: **Standards — one per line**
- Card front short description: **Standard card summaries — one per line**
- Card back description: **Standard card full descriptions — one per line**
- Card photograph: **Standard card images — same order as cards**

To edit Card 04, edit item 04 in all relevant lists. To replace only its image, replace image item 04 under **Standard card images**.

## 19. Complete main Services page editing map

Go to **Pages → All Pages → Services → Edit**.

### Hero

Use the universal Hero fields.

### Core service directory cards

The nine large service cards come from **Superior Plus → Services**.

For one service card:

- Card title: the Service’s WordPress **Title**
- Card description: **Services-directory summary**
- Card image: the Service’s **Hero image**

The main page’s introductory text is **Core services introduction**.

### Additional-service text cards

Use **Additional services — Heading | Description**. Every row is one card.

### Professional-service visual cards

These two controls are order-matched:

- Card heading and description: **Professional-service cards — Heading | Description**
- Card image: **Professional-service card images**

Card 01 uses image 01, Card 02 uses image 02, and so on.

## 20. Complete Additional Services page editing map

Go to **Pages → All Pages → Additional Services → Edit**.

- Hero: universal Hero fields
- Main service cards: **Additional services — Heading | Description**
- Additional text sections: **Supporting content — Heading | Body**
- Supporting photograph: **Secondary image**
- Selected internal links: **Related pages**
- Final CTA: universal Closing CTA fields

Every Additional Service row is one full card. Removing the row removes the card.

## 21. Complete Our Process page editing map

Go to **Pages → All Pages → Our Process → Edit**.

- Hero: universal Hero fields
- Approved supporting sections: **Client-approved supporting sections — Heading | Body**
- Six main process cards: **Process steps — Heading | Description**

### Why-it-works flip cards

These controls are order-matched:

- Card title: **Why-it-works points — one per line**
- Short front description: **Why-it-works summaries — one per line**
- Detailed back description: **Why-it-works full descriptions — one per line**
- Card image: **Why-it-works images — same order as cards**

To change the image on “Thorough preparation,” find its position in **Why-it-works points**, then replace the image with the same number.

## 22. Complete FAQ page editing map

### FAQ page design

Go to **Pages → All Pages → FAQs → Edit**.

- Hero: universal Hero fields
- Introductory paragraph: **FAQ introduction**
- Choose and order questions: **Displayed FAQs**
- Before/after archive: **Before-and-after / project images**

Each item in **Before-and-after / project images** is an independent visual card with Replace, Remove, Caption, Alt text and focal-point controls.

### Individual questions and answers

Go to **Superior Plus → FAQs** and open the required FAQ.

- Question: WordPress **Title**
- Answer: main WordPress editor content
- Order: the selection/order under **Pages → FAQs → Displayed FAQs**

## 23. Complete Contact page editing map

Go to **Pages → All Pages → Contact → Edit**.

- Hero: universal Hero fields
- “What happens next?” cards: **What-happens-next steps — Heading | Description**
- Service dropdown choices: **Form service options — one per line**
- Property dropdown choices: **Form property options — one per line**
- Form labels and placeholders: **Form fields — Label | Placeholder**
- Note below the form: **Form note**
- Final CTA: universal Closing CTA fields

Go to **Superior Plus → Site Settings** for:

- recipient: **Quote recipient email**
- privacy checkbox wording: **Form privacy/consent text**
- public phone and email
- address and Google Maps URLs

Go to **WP Mail SMTP** only for mail-delivery configuration. Updating the theme does not replace the SMTP account settings.

## 24. Complete Service Areas editing map

### Main Service Areas page

Go to **Pages → All Pages → Service Areas → Edit**.

- Hero: universal Hero fields
- Extra text blocks: **Content sections — Heading | Body**
- Supporting image: **Secondary image**
- Internal links: **Related pages**

### Master suburb list

Go to **Superior Plus → Site Settings → Service areas — one suburb per line**.

### Individual suburb page

Go to **Pages → All Pages**, search for the suburb, and click **Edit**.

- WordPress Title: page/suburb title
- Hero: universal Hero fields
- Main copy: **Content sections — Heading | Body**
- Supporting image: **Secondary image**
- Nearby/internal pages: **Related pages**
- CTA and SEO: universal fields

## 25. Complete Gallery page and project-card editing map

The page at **Pages → Gallery** controls only the Gallery hero, supporting page copy, secondary image, SEO and CTA.

The actual visual cards are aggregated from **Superior Plus → Projects**.

### Identify which Project controls a Gallery section

Open **Superior Plus → Projects**. The project’s assigned **Project category** places it under Residential, Commercial, Interior, Exterior, Roof, Fence, Outdoor, Wallpaper or Plaster.

### Edit the first card in a section

1. Open the corresponding Project.
2. Replace **Featured project image**.
3. Adjust **Image crop position**.
4. Change the WordPress **Title** if the card caption should change.
5. Click **Update**.

### Edit any additional card

1. Open the Project.
2. Scroll to **Project gallery**.
3. Locate the card by thumbnail or Caption.
4. Click **Replace media** to change only the image.
5. Edit its **Caption**, **Alt text**, or **Image focal point**.
6. Click **Update**.

### Add, delete or reorder cards

- Add: **Project gallery → Add images or videos**
- Delete: **Remove** on the individual item
- Reorder: **Move up** or **Move down**
- Delete the section’s featured card: remove **Featured project image**
- Delete an entire Project group: move that Project to Trash

The Gallery page itself intentionally does not duplicate these image controls because the same Project records also feed homepage project cards and related galleries.

## 26. Complete individual Service page editing map

Go to **Superior Plus → Services** and open the required Service.

This applies to Residential, Commercial, Interior, Exterior, Roof, Fence, Deck, Wallpaper Removal and Plaster Repairs.

### Service directory and hero

- Service/card title: WordPress **Title**
- Long page content, where used: main WordPress editor
- Directory card description: **Services-directory summary**
- Hero: universal Hero fields

### Scope cards

- Section heading: **Scope heading**
- Small section line: **Scope eyebrow**
- Styled section line: **Scope accent**
- Section paragraph: **Scope introduction**
- Individual cards: **Scope items — one per line**

Each Scope item creates one designed card. The painting-related icon is selected automatically by the locked layout.

### PDF narrative sections

Use **Client PDF sections — Heading | Verbatim body**.

These supplied sections feed areas such as “Why Choose Superior Plus,” benefits, service coverage and other approved narrative content. Preserve the approved wording unless the client supplies replacement copy.

### Process section

- Introductory copy: **Process introduction**
- Small section line: **Process eyebrow**
- Main section title: **Process section title**
- Styled line: **Process section accent**
- Process cards: **Process steps — one per line**

### Service showcase/gallery

Use **Service gallery**.

Every item is one visual card. Replace, remove, add, reorder, caption or adjust the focal point independently.

### Benefits section

- Main heading: **Benefits section title**
- Styled line: **Benefits section accent**
- Benefit cards: **Benefits — one per line**

### Related services

- Selected cards: **Related services**
- Small line: **Related-services eyebrow**
- Main heading: **Related-services title**
- Styled line: **Related-services accent**

Each related card’s own title, summary and image come from that related Service record.

### Local service-area wording

The “Areas We Service” wording is stored inside **Client PDF sections — Heading | Verbatim body**. Edit that row only when the client supplies approved replacement wording.

## 27. Complete Blog editing map

### Main Blog page

Go to **Pages → All Pages → Blog** or **Painting Guides → Edit**.

- Hero: universal Hero fields
- Supporting copy: **Content sections — Heading | Body**
- Supporting image: **Secondary image**
- Related pages: **Related pages**

Published Blog Articles are inserted into the directory automatically.

### Individual article

Go to **Superior Plus → Blog Articles** and open the article.

- Article title: WordPress **Title**
- Article text, headings, bullets and links: main WordPress editor
- Card summary/search excerpt: WordPress **Excerpt**
- Hero and sharing controls: universal fields
- Category label: **Article category**
- Small hero/article label: **Article eyebrow**
- Reading-time label: **Read time**
- Public source label: **Source label**
- Preserved SEO phrases: **Client SEO keywords — one phrase per line**
- Preserved supplied outline: **Client brief topics — one per line**
- Key-takeaway cards: **Key takeaways — one per line**
- Reference links: **Official references — Label | URL**
- Related cards: **Related services**

The homepage Blog preview card uses this article’s Title, Excerpt, Hero image, Category and Read time.

## 28. Complete Testimonial and Google-review editing map

Go to **Superior Plus → Testimonials** and open a review.

- Review name: **Client name**
- Optional short label: **Review label**
- Project/service label: **Project label**
- Stars: **Star rating**
- Source: **Review source**
- Original review link: **Original review URL**
- Review date: **Review date**
- Optional avatar/project image: **Client/project image**
- Review quotation: main WordPress editor
- Placeholder status: **Placeholder review**

Only genuine Google records should use Google as the source. The public carousel filters for verified Google reviews.

Go to **Superior Plus → Site Settings** for the overall Google rating, total review count and Google reviews-page URL.

## 29. Complete Site Settings, header and footer map

Go to **Superior Plus → Site Settings → Superior Plus Site Settings → Edit**.

### Business/header/contact details

- Business name
- Display phone number
- Phone number used by call links
- Email address
- General location
- Street address
- Public Google Maps URL
- Google Maps embed URL
- Facebook URL
- Instagram URL
- Site logo and logo accessible name

### Google review summary

- Google rating
- Google review count
- Google reviews page URL

### Footer

- Footer introduction
- Explore heading
- Services heading
- Contact heading
- Copyright
- Closing line

Footer navigation links and service links are populated from the approved site navigation and Service records.

### Global trust and conversion content

- Homepage counters
- Homepage badge image
- Four trust-strip lines
- Master service-area list
- Default CTA title, text, button label and destination
- Quote recipient email
- Form privacy/consent text

## 30. Quick “where do I edit this?” index

- Any main-page hero image: **Pages → page → Hero image**
- Homepage service-card image: **Superior Plus → Services → service → Hero image**
- Homepage selected-project image: **Superior Plus → Projects → project → Featured project image**
- Homepage blog-card image: **Superior Plus → Blog Articles → article → Hero image**
- Homepage counter or badge: **Superior Plus → Site Settings**
- About flip-card image: **Pages → About → Standard card images**
- Services professional-card image: **Pages → Services → Professional-service card images**
- Process flip-card image: **Pages → Our Process → Why-it-works images**
- FAQ archive image: **Pages → FAQs → Before-and-after / project images**
- Service showcase image: **Superior Plus → Services → service → Service gallery**
- Gallery first image: **Superior Plus → Projects → project → Featured project image**
- Gallery additional image: **Superior Plus → Projects → project → Project gallery**
- Blog article text: **Superior Plus → Blog Articles → main editor**
- FAQ question/answer: **Superior Plus → FAQs → Title/main editor**
- Review text/image: **Superior Plus → Testimonials**
- Logo, phone, email, address, map, social links or footer: **Superior Plus → Site Settings**

If a visible decorative label is not listed in this manual and no matching field appears under **Superior Plus editable content**, it is part of the locked layout rather than editable content. Changing a locked label requires a theme/plugin update so the responsive design cannot be accidentally damaged.
