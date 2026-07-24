# Superior Plus Painting — Performance Audit

Updated: 24 July 2026

## Initial mobile Lighthouse sample

These local, throttled Lighthouse runs are diagnostic rather than production field data.

| Route | Performance | Accessibility | SEO | Transfer |
|---|---:|---:|---:|---:|
| Home | 51 | 94 | 100 | 6,317 KB |
| Service Areas | 55 | 93 | 100 | 4,448 KB |
| Interior Painting | 58 | 93 | 100 | 4,238 KB |

The initial audit identified the PNG homepage hero as the clearest avoidable image cost. Local Lighthouse subsequently became unstable on Windows, so final scores must be rerun against the deployed GitHub Pages build and later against WordPress staging.

## Image optimisation completed

The originals remain untouched for future editing.

| Asset | Original | Optimised output | Reduction |
|---|---:|---:|---:|
| Homepage hero — full | 1,832.9 KB PNG | 66.7 KB WebP | 96.4% |
| Homepage hero — tablet | 1,832.9 KB PNG | 45.2 KB WebP | 97.5% |
| Homepage hero — mobile | 1,832.9 KB PNG | 22.6 KB WebP | 98.8% |
| Full logo | 76.1 KB JPEG | 20.8 KB WebP | 72.7% |

The homepage now uses `srcset` so the browser selects a suitable 768, 1280 or 1716-pixel WebP. Desktop and mobile screenshots were visually reviewed after conversion.

## Remaining performance work

- [ ] Rerun Home, Services, Interior Painting, Service Areas and Contact on deployed GitHub Pages
- [ ] Record production LCP, CLS and total blocking time
- [ ] Audit the remaining stock and project images by rendered dimensions
- [ ] Keep project videos click-to-play with lightweight poster images
- [ ] Review Google Fonts delivery
- [ ] Repeat the audit on WordPress staging with cache enabled
- [ ] Compare staging results with and without the Contact map in view
