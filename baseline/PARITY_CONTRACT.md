# Locked Frontend Parity Contract

This contract defines the behaviour and visual rules that the WordPress-backed React site must preserve. CMS integration may change data sources, but it must not change these behaviours without explicit approval.

## Reference and routing

- Approved visual reference: `https://grantzz-zzz.github.io/paint-2/`
- Approved local source: `C:\Users\Grant\Downloads\paint2`
- Fifteen required route views are recorded in `site-baseline.json`.
- Unknown routes return to the Services or Home view according to the current router rules.
- Route navigation returns the viewport to the top with smooth scrolling.

## Navigation

- Desktop header contains Home, Services, About, Our Process, FAQs and Contact.
- Services opens on pointer hover and with its dedicated disclosure button.
- Services contains one overview item and all nine current service links.
- The active main route and active service receive distinct styling.
- Mobile navigation opens from the menu button using an animated height transition.
- Opening the mobile menu also exposes the service-page list.
- Selecting a route closes the mobile menu and Services submenu.

## Motion

- Standard reveal: opacity `0 → 1`, vertical position `30px → 0`, duration `0.65s`, easing `[.2,.8,.2,1]`, triggered once at approximately 18% visibility.
- Homepage hero copy: opacity `0 → 1`, horizontal position `-40px → 0`, duration `0.8s`.
- Desktop Services menu: opacity and vertical offset transition over `0.16s`.
- Mobile menu: opacity and height transition between closed and automatic height.
- Testimonial change: outgoing content moves upward and incoming content rises from 15px.
- SVG section dividers animate horizontally with GSAP ScrollTrigger, duration `1.2s`, starting near 92% viewport depth.
- Project images and gallery cards preserve their existing hover scaling and colour-wipe treatments.
- `prefers-reduced-motion: reduce` disables animation, transition and smooth scrolling.

## Homepage interactions

- “See our work” scrolls smoothly to the selected-project section.
- Testimonial controls cycle continuously through all three homepage reviews.
- The quote form requires name, phone, email, suburb and project details.
- Successful local submission displays the existing confirmation state.
- The current confirmation remains a designed demonstration until a secure backend is connected.

## FAQs

- The first FAQ starts expanded.
- Only one FAQ answer is displayed at a time.
- Selecting the open question closes it.
- Selecting another question closes the previous one and opens the selected answer.
- All ten approved question-and-answer pairs are preserved in the baseline manifest.

## Service galleries

- All nine service pages contain a gallery.
- Gallery media uses a four-column desktop grid, two columns below 900px and one column below 560px.
- The first gallery item receives the featured two-column/two-row treatment on desktop.
- Galleries initially show eight items and offer “View all” when additional media exists.
- Image selection opens a modal lightbox with caption.
- Video selection opens a modal video player with poster and controls.
- Lightboxes close through the close button, backdrop selection or Escape key.
- Residential, Roof, Wallpaper Removal and Plaster Repairs currently use clearly identified generated showcase placeholders.
- WordPress galleries must allow adding, removing, replacing and reordering items without changing gallery styling.

## Forms and links

- Telephone links retain the `tel:` protocol.
- Email links retain the `mailto:` protocol.
- All internal CTAs retain their current destination and label unless deliberately edited through WordPress.
- Keyboard focus states, skip navigation and semantic button/link behaviour remain intact.

## Responsive contract

- Primary layout adjustments occur at 1100px, 1000px, 900px, 820px, 560px and 540px as recorded in the approved CSS.
- Desktop navigation changes to mobile navigation at 820px.
- Page heroes, section grids, process steps, galleries, forms and footer columns retain their current stacking behaviour.
- No approved route may introduce horizontal document overflow.

## Regression evidence

- `site-baseline.json` records ordered content and structural data.
- `screenshots/desktop/` contains 15 approved 1440px captures.
- `screenshots/tablet/` contains 15 approved 820px captures.
- `screenshots/mobile/` contains 15 approved 390px captures.
- Public asset and React source SHA-256 hashes are recorded in the baseline manifest.
