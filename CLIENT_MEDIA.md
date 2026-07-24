# Client Media Integration

Source archives:

- `folder 1.zip`, supplied 18 July 2026
- `painntnn.zip`, supplied 24 July 2026

## Audit summary

- The latest archive contained 205 JPEG files.
- 71 byte-for-byte duplicate copies were removed.
- One additional visually identical re-export was omitted.
- Two obvious stock-room graphics were excluded from the real-project library.
- 45 unique photos were already represented by the first client-media import.
- 88 genuinely new client photos were optimized and added.
- The combined library now contains 135 unique project/brand photos and 5 unique videos.
- No byte-identical image files remain in the website project archive.
- Original videos remain MP4 and load only when opened.

Every unique asset is represented once in the curated website library. Exact duplicate copies are intentionally not repeated because they add download weight without adding new visual information.

## Placement

| Category | Unique media | Website placement |
|---|---:|---|
| Residential painting | 11 photos | Residential page gallery, homepage work and service-area heroes |
| Commercial painting | 20 photos | Commercial page gallery and supporting pages |
| Interior painting | 11 photos | Interior page gallery and supporting pages |
| Exterior painting | 22 photos + 3 videos | Exterior page gallery and supporting pages |
| Fence painting | 28 photos + 1 video | Fence Painting page gallery and homepage hero |
| Decks and outdoor structures | 3 photos + 1 video | Deck Painting & Staining page gallery |
| Roofline context | 7 photos | Roof page using real residential exterior and roofline context |
| Wall preparation | 16 photos | Wallpaper Removal page using real preparation and repainting context |
| Plaster and surface repairs | 15 photos | Plaster Repairs page gallery |
| Brand archive | 2 images | About page company-history section |

## Presentation and performance rules

- Service galleries initially show eight items and progressively reveal the remainder.
- Photos are lazy-loaded and open in a focused lightbox.
- Videos use lightweight WebP posters and do not load the MP4 until selected.
- Client photography is labelled “Superior Plus project” or “Project photo.”
- Public stock and generated showcase assets have been removed.
- Roof Painting clearly describes its gallery as real roofline/exterior context until dedicated roof-coating sequences are supplied.
- Wallpaper Removal clearly describes its gallery as real wall-preparation context until dedicated removal sequences are supplied.

Processed media is stored under `public/assets/client/projects/`. The original photo/video import workflow remains in `scripts/process-client-media.mjs`; this document records the audited 24 July archive expansion and its final category counts.
