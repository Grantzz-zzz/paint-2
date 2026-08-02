# Superior Plus Content Plugin — User Manual

This manual applies to **Superior Plus Content 2.3.0** and **Superior Plus Theme 3.3.0**.

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

In version 2.3.0, removing every managed gallery image does not cause the bundled default images to return.

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
