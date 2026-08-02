# Superior Plus Theme and Plugin Update Checklist

## Public blog quality

- [x] Restore apostrophes, quotation marks, dashes and ellipses damaged by text encoding.
- [x] Remove internal labels such as “Client SEO brief” from every public blog view.
- [x] Keep the PDF-approved article wording intact while repairing punctuation only.
- [x] Render unordered and ordered lists as clear, accessible cards/bullets on desktop and mobile.
- [x] Add automated checks that fail when damaged characters or internal editorial labels reach public content.

## Service-page galleries

- [x] Let an editor add multiple images or videos from the WordPress Media Library.
- [x] Let an editor replace each gallery item without rebuilding the card.
- [x] Let an editor name each item with alt text and a visible caption.
- [x] Let an editor adjust each image’s focal point/crop position.
- [x] Let an editor move each item up or down.
- [x] Let an editor delete one item and its complete frontend card.
- [x] Let an editor delete every item without bundled fallback images reappearing.
- [x] Preserve the approved service-page layout and PDF-verbatim text.

## Main gallery

- [x] Let an editor create, rename, order and delete project records.
- [x] Let an editor add, replace, caption, reorder and delete every image inside a project.
- [x] Ensure deleting an image removes its whole visual card with no empty shell.
- [x] Ensure deleting all managed images/projects does not silently restore bundled gallery images.

## Repeatable content cards

- [x] Replace line-based list editors with individual card rows.
- [x] Provide Add, Move up, Move down and Delete actions for every list/card row.
- [x] Support heading + description rows where the frontend card has both fields.
- [x] Preserve stable row IDs and sanitise every saved value.
- [x] Allow an intentionally empty card section without deleted default cards returning.
- [x] Keep layout and styling locked; expose content and media only.

## Release and validation

- [x] Bump the theme to 3.3.0 and the plugin to 2.3.0.
- [x] Rebuild and synchronise the React theme bundle.
- [x] Package installable theme and plugin ZIP files.
- [x] Validate PHP syntax, plugin structure, migrations and customization controls.
- [x] Run content, route, build and responsive visual QA.
- [x] Commit and push after the final repository review.
