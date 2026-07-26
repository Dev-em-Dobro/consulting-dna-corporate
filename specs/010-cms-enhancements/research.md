# Phase 0 Research: CMS enhancements — video, case branding, media limits, i18n read API & regions/maps

All open inputs from the meeting (`fixes-reuniao-24-07`) and `plan.md` are resolved below with a
recommended default so implementation in **`corporate-dna-cms`** is unblocked. Items marked
**⚠ confirm** need a one-line answer from the client but ship safely on the default. This file also
carries the **data-model delta** and a **migration/config summary**.

## D1 — Which content types get the video field

- **Decision**: Add an optional **YouTube video reference** to **Cases**, **Insights**, and the
  **video-bearing singleton pages** (recommend: the 5H/framework page and any hero-video landing
  singleton). Leave Solutions, People and Regions without a video field for now.
- **Rationale**: Cases and insights are the content the client described as needing video; a
  singleton hero video is a common launch ask. Keeping the field optional and off the other types
  avoids model bloat. Videos remain **external references** (`001` FR-012).
- **Alternatives**: Add to every content type (rejected — most never use it) or cases-only
  (rejected — insights were mentioned).
- **⚠ confirm**: exact singleton pages that carry a video.

## D2 — YouTube reference storage & validation

- **Decision**: Store a normalised value object `{ provider: 'youtube', videoId, url }`. Accept
  `youtube.com/watch?v=`, `youtu.be/`, and `youtube.com/embed/` inputs; parse out the 11-char video
  id; reject anything else with a specific message. Store the canonical `https://www.youtube.com/watch?v=<id>`.
- **Rationale**: Normalising at authoring time gives the read API and the site a single stable shape
  and lets the site build whichever embed URL it wants. URL-shape validation only — the CMS does not
  check video availability (an unlisted/deleted video is an editorial concern; the site handles an
  unplayable embed).
- **Implementation**: `lib/video/youtube.ts` parse/normalise; Zod refine on the field; unit-tested
  against watch/short/embed/invalid inputs.

## D3 — Case brand colour (`brandColor`)

- **Decision**: New `brandColor` column on `cases`, a validated **hex string** (`#RRGGBB`, and
  accept `#RGB` shorthand normalised to 6-digit). Zod regex validation; surfaced verbatim by the
  read API for the site to build the case-card/header gradient (`007`).
- **Rationale**: A hex string is the simplest interchange; the site (`007`) owns gradient generation
  and text-contrast decisions. The CMS validates **format only**, not contrast (editorial choice).
- **Identifier note**: field/identifier is `brandColor`; prose calls it the client **brand colour**.

## D4 — Client logo (transparent PNG) & per-field media limits

- **Decision**: New `logoAsset` media reference on `cases`, constrained to **PNG with an alpha
  channel**. Enforce per-field upload rules server-side before persisting to Bunny.net, using a
  server-side image probe (`sharp`, or `image-size` for dimensions + a channel check for alpha).
- **Recommended default limits** (⚠ confirm — safe to ship as-is):

  | Field | Format | Max file size | Max dimensions | Aspect / transparency |
  |---|---|---|---|---|
  | Case client logo | PNG | 1 MB | 1024×1024 | alpha channel required (transparent) |
  | Case cover image | JPG/PNG/WebP | 3 MB | 2560×1440 | ~16:9 (±3% tolerance) |
  | Methodology / framework imagery | JPG/PNG/WebP | 3 MB | 2560×1440 | 16:9 (±3%) |
  | Person photo | JPG/PNG/WebP | 2 MB | 1600×1600 | 1:1 (±3%) |
  | Insight cover | JPG/PNG/WebP | 3 MB | 2560×1440 | ~16:9 (±3%) |
  | Generic media library | JPG/PNG/WebP/PDF | 5 MB | 4000×4000 | none |

- **Rationale**: Extends `001` FR-013 (type/size) with **dimension + aspect + transparency** so a
  bad upload cannot break the site layout. Rules are **configured per field** in the content-type
  registry (`lib/content/`), not hardcoded in the uploader, so they are tunable without code churn.
- **Alternatives**: Client-side-only checks (rejected — bypassable); fixed global limits (rejected —
  logos and 16:9 imagery need different rules).
- **Transparency strictness**: recommend requiring an **alpha channel present** (not that a minimum
  % of pixels be transparent) to avoid false rejections. **⚠ confirm**.

## D5 — Read-API locale serving & fallback (EN/PT/ES)

- **Decision**: The read API accepts a `locale` in `{en, pt, es}`. Resolution order: **(1)** the
  published entry in the requested locale; **(2)** if absent, the published entry in the **default
  locale (EN)**, returned with a `localeFallback: true` marker and the actual `resolvedLocale`.
  Locale resolution runs **after** the published-only filter, so a draft is never returned via any
  locale.
- **Rationale**: Realises `001` FR-020 end-to-end and gives `005` a deterministic contract. EN as
  default matches `001`'s Phase-1 English-first assumption. The `localeFallback`/`resolvedLocale`
  fields let the site render a "translation pending" affordance or set correct `hreflang`.
- **Alternatives**: 404 on missing translation (rejected — worse UX and breaks the maps/library
  pages); silent fallback with no marker (rejected — the site can't signal untranslated content or
  emit correct SEO hints for `005`).
- **⚠ confirm**: default locale = **EN**; per-field vs per-entry fallback (recommend **per-entry**
  fallback for simplicity — a partially-translated entry falls back wholesale, not field-by-field).

## D6 — Regions ↔ maps data: existing vs. new fields

- **Decision**: Treat the maps geodata as an **additive extension** to the `001` Region type. Add
  any of `city`, `country`, `lat`, `lng`, `zoom`, `addressLines`, `tel`, `email`, `locationType`
  that are not already present. `locationType` is an enum `('office' | 'coverage')`.
- **Validation**: lat ∈ [−90, 90], lng ∈ [−180, 180]; a region with `locationType = office` MUST
  have `lat`/`lng` before publish; `coverage` regions do not require coordinates.
- **Rationale**: `008` needs to both **plot offices** (needs coordinates + zoom) and **shade covered
  countries** (needs country + the coverage flag). One enum cleanly separates the two.
- **⚠ confirm**: whether the `001` schema already has any of these columns (extend) or none (add
  all). Default assumption: `001` has basic location text but **not** structured lat/lng/zoom/flag —
  so this feature **adds** them.

## D7 — Awards ownership (coordinate with `009`)

- **Decision**: Provide an **Awards content type** in the CMS (`awards` table: `title`, `issuer`,
  `year`, optional `logoAsset`, optional `link`, `order`), surfaced via the read API — **unless
  `009` already defines Awards**, in which case this feature only ensures the read-API fields exist
  and defers the type to `009`.
- **Rationale**: The meeting asked that the schema be **ready** to register awards for launch. A
  small dedicated type is the cleanest home; but Awards may be owned by `009`, so this must be
  reconciled to avoid defining it twice.
- **⚠ confirm**: is Awards owned here (new content type) or by `009`?

## D8 — Person LinkedIn URL & legal rich text (schema readiness)

- **Decision**: Add `linkedinUrl` to `people` (Zod URL + `linkedin.com` host check, optional). Ensure
  the **legal singletons** (privacy, cookies, terms) each hold a **validated rich-text** body field
  (same rich-text mechanism `001` uses for article bodies). Confirm Solutions/Cases/Insights/Regions
  accept all launch fields.
- **Rationale**: These are the remaining launch-content homes called out in the meeting. All are
  additive and low-risk; data entry itself is an external operational checklist.

## D9 — Migration approach

- **Decision**: **drizzle-kit** migrations (consistent with `001`), one migration per logical change
  set (cases branding/video, region geodata, people LinkedIn, legal rich text, awards). All changes
  are **additive/nullable** first, so existing published content is unaffected and no backfill blocks
  deploy.
- **Rationale**: Matches `001`'s toolchain; additive-nullable keeps the migration safe and
  reversible. Zod schemas and the read-API contract are updated in lockstep with each migration.
- **⚠ confirm**: drizzle-kit (recommended) — trivially yes since it is `001`'s tool.

## Data-model delta

New/changed fields and how they surface in the **published read API**:

| Entity | New/changed field | Type / validation | Read API |
|---|---|---|---|
| Case | `videoRef` | value object `{provider:'youtube', videoId, url}`; URL normalised | returned when present |
| Case | `brandColor` | hex string `#RRGGBB` (Zod regex) | returned verbatim (site builds gradient) |
| Case | `logoAsset` | media ref → PNG, alpha required, ≤1 MB, ≤1024² | returned as delivery URL |
| Insight | `videoRef` | optional; same as case | returned when present |
| Singleton (video-bearing) | `videoRef` | optional; same as case | returned when present |
| Region | `city`, `country` | text | returned |
| Region | `lat`, `lng` | numeric, lat∈[−90,90] lng∈[−180,180] | returned |
| Region | `zoom` | int (default map zoom) | returned |
| Region | `addressLines`, `tel`, `email` | text / validated | returned |
| Region | `locationType` | enum `office` \| `coverage`; office ⇒ coords required | returned (drives plot vs. shade in `008`) |
| Person | `linkedinUrl` | optional URL, `linkedin.com` host | returned |
| Legal singleton | rich-text body | validated rich text | returned |
| Award | `title`, `issuer`, `year`, `logoAsset?`, `link?`, `order` | validated; **or deferred to `009`** | returned |
| Media Asset | validation metadata | dimensions / aspect / transparency captured at upload | delivery URL unchanged |

**Read-API guarantees carried over from `001`**: only published entries; no draft leakage across any
locale; locale resolution returns `resolvedLocale` + `localeFallback` (D5). New fields are added to
the read-API contract in `contracts/` and covered by contract tests.

## Migration & config summary

- **Migrations** (drizzle-kit, additive/nullable, one per change set):
  1. `cases`: `+ video_ref (jsonb)`, `+ brand_color (text)`, `+ logo_asset_id (fk media)`
  2. `insights` (+ video-bearing singletons): `+ video_ref (jsonb)`
  3. `regions`: `+ city`, `+ country`, `+ lat`, `+ lng`, `+ zoom`, `+ address_lines`, `+ tel`,
     `+ email`, `+ location_type (enum)`
  4. `people`: `+ linkedin_url (text)`
  5. legal singletons: `+ body_rich (text/jsonb)` where missing
  6. `awards` table (new) — **skip if owned by `009`**
- **Media validation** (Bunny.net path): server-side image probe (dimensions + alpha) before persist;
  per-field rules from the content-type registry (D4 table).
- **No new environment variables** are required for the core feature (video is a stored reference;
  branding/media reuse the existing Bunny.net + Neon config from `001`). If a server-side image
  library is added, it is a build-time dependency only.
- **Constitution / `001` gates**: re-verify green after migration — no draft leakage (incl.
  per-locale), MFA/RBAC/audit intact, CMS still a separate project.

## Cross-references

- `001-custom-cms` — base CMS (types, read API, media, MFA/RBAC/audit) this feature extends.
- `002-site-cms-integration` — read-API contract the site consumes; new fields extend it.
- `005-i18n-seo-redirects` — consumes the localised read API + fallback markers (D5).
- `007-content-libraries` — consumes case `videoRef` / `brandColor` / `logoAsset` (D2–D4).
- `008-maps` — consumes region geodata + `locationType` (D6).
- `009` — Awards ownership reconciliation (D7).
