# Client Media Integration

Source archive: `folder 1.zip`, supplied 18 July 2026.

## Audit summary

- 124 submitted files
- 112 photos and 12 videos
- 51 unique photos and 5 unique videos
- 68 byte-for-byte duplicate copies omitted from the website
- 56 unique photos/posters converted to WebP
- Original videos preserved as MP4 and loaded only when opened

Every unique asset is represented once in the curated website library. Exact duplicate copies are intentionally not repeated because they add download weight without adding new visual information.

## Placement

| Category | Unique media | Website placement |
|---|---:|---|
| Fence painting | 21 photos + 1 video | Fence Painting page project gallery |
| Commercial painting | 8 photos | Commercial Painting page project gallery |
| Exterior and residential | 9 photos + 3 videos | Exterior page gallery, relevant page heroes, homepage featured work |
| Interior painting | 10 photos | Interior page gallery, relevant page heroes, homepage featured work |
| Decks and outdoor structures | 2 photos + 1 video | Deck Painting & Staining page gallery |
| Brand archive | 1 promotional image | About page company-history section |

## Presentation and performance rules

- Service galleries initially show eight items and progressively reveal the remainder.
- Photos are lazy-loaded and open in a focused lightbox.
- Videos use lightweight WebP posters and do not load the MP4 until selected.
- Client photography is labelled “Superior Plus project”; remaining stock placeholders retain their disclosure.
- The strongest client images replace relevant stock heroes without forcing unrelated imagery onto Roof Painting or Wallpaper Removal.

Processed media is stored under `public/assets/client/projects/`. The repeatable optimizer and category map are in `scripts/process-client-media.mjs`.
