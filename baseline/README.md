# Approved React Site Baseline

This directory stores the Phase 0 preservation baseline for the locked-design WordPress CMS migration.

- `site-baseline.json` records route structure, ordered text nodes, headings, sections, links, buttons, form fields, images, videos, interactive content, asset hashes and source hashes.
- `screenshots/desktop`, `screenshots/tablet` and `screenshots/mobile` contain visual references for every route.
- Regenerate the baseline with `node scripts/capture-cms-baseline.mjs` while the approved React development server is available at `http://127.0.0.1:5173`.

The baseline is evidence for regression checks. It is not a source of editable production content and must not be used to silently overwrite later client changes in WordPress.
