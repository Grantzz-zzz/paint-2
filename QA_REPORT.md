# Superior Plus Painting — QA Report

Run date: 24 July 2026

## Result

**PASS — WordPress parity: 747 checks, 0 failures**

- All 15 approved routes tested against a disposable real WordPress runtime.
- Three viewports per route: desktop (1440 × 1000), tablet (820 × 1000), and mobile (390 × 844).
- All 15 desktop pixel comparisons remained within the strict 5% perceptual-difference threshold.
- The same packaged React bundle remains available as a local fallback when the content API is unavailable.
- Microsoft Edge was used through Playwright.

## Automated coverage

Every route was checked for the exact H1, heading order, section order, visible
text, images, videos, links, buttons, React header/footer, responsive overflow,
runtime errors and basic keyboard semantics. The suite also verified:

- the Services overview plus all nine service dropdown links;
- FAQ accordion state;
- progressive gallery expansion from 8 to 22 items;
- lightbox open and Escape-to-close behaviour;
- the first-focus skip link;
- reduced-motion behaviour;
- complete fallback rendering with the WordPress API deliberately disabled;
- absence of Elementor/UAE public markup.

## Import verification

The approved importer completed with exactly 6 pages, 9 services, 10 FAQs,
4 testimonials and 9 projects. Repeated imports remained count-stable. An atomic
migration lock prevents overlapping requests, and later client-modified records
remain protected.

## Known launch dependencies

Rene must still confirm the production quote-recipient email address and final
privacy/consent wording. Local Phase 9 tests confirmed that content survives
theme replacement, plugin replacement, theme switching and plugin uninstall.
The checksum-validated JSON export/re-import restored an intentional client edit.
The hosting provider's full files-and-database restore must still be rehearsed
on staging before production, and the final staging handoff is not complete.

Run the core checks again with:

```powershell
npm run build
npm run qa
php scripts/validate-wordpress-theme.php
php scripts/validate-wordpress-plugin.php
node scripts/qa-phase8-bundle-parity.mjs
```
