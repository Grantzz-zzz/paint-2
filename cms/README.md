# CMS migration contracts

- `CONTENT_ARCHITECTURE.md` defines the locked WordPress/React boundary, records,
  fields, permissions, validation, templates, galleries, fallback behavior, and
  update safety.
- `spp-content-contract.schema.json` is the version 1 public REST envelope and shared
  entity schema.
- The Phase 0 preservation evidence remains in `../baseline/`.

Implementation must change this contract deliberately and bump `schema_version` when
a response change is not backward-compatible.
