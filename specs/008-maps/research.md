# Phase 0 Research: Maps — offices carousel-map & world coverage map

All open items from the plan are resolved below with a recommended default so implementation is unblocked.
Items marked **⚠ confirm** need a one-line answer from the client but ship safely on the default. This feature
extends `003-interactive-locations-map` (base offices map, **Leaflet** — despite 003's Mapbox wording),
consumes the CMS via the read-only client from `002`, and depends on `010-cms-enhancements` for Region data.

## D1 — Offices map: infinite (continuous) carousel

- **Decision**: Make the carousel index modular (`(i + n) % n`) with a *virtualised* wrap so advancing past the
  last office lands on London with no visible snap-back — the strip re-centres continuously rather than
  animating a long scroll back to the start.
- **Rationale**: The meeting requires "reaching the last office wraps back to London WITHOUT stopping." Modular
  indexing plus a re-centre (duplicate the edge items or reset transform without transition at the seam) gives a
  seamless loop. Supersedes 003 FR-008's "wrap *or* stop".
- **Alternatives**: A hard stop at the ends (003's fallback) — rejected, contradicts the ask. An infinitely
  duplicated track — heavier and can drift; the modular + seam-reset approach is lighter.

## D2 — Offices map: automatic slide rotation (auto-advance)

- **Decision**: A small auto-advance controller in `LocationsBlock.tsx`: a `setInterval` at **~6s** that calls
  the same "next office" path as manual nav, wrapped by (a) an `IntersectionObserver` that pauses when the
  section is out of the viewport, (b) pause on any user interaction (arrow/swipe/click) and — recommended — on
  hover, (c) pause when the tab is hidden (`visibilitychange`), and (d) a hard *off* under
  `prefers-reduced-motion` (no auto-fly at all).
- **Rationale**: Delivers the "sense of global reach / induce interaction" ask without hijacking the user or
  wasting work off-screen, and honours motion preferences (consistent with 003 FR-009). ~6s is long enough to
  read an address, short enough to feel alive.
- **⚠ confirm**: the interval (default **6s**) and whether **hover** pauses (default **yes, pause on hover**).
- **Alternatives**: CSS-only autoplay — can't coordinate with the Leaflet fly or reduced-motion cleanly.
  Faster (~3s) rotation — risks feeling frantic and fighting the fly duration.

## D3 — Offices map: transition-animation bug (jump / PNG-swap + spurious desktop fallback)

- **Decision**: Treat as a real defect until proven otherwise. Reproduce with the client's browser/version;
  verify the Leaflet `flyTo`/`setView` path actually animates (correct `animate: true`, a sane `duration`, and
  that `prefers-reduced-motion` isn't being read as *always reduced*), that offices changes coalesce (D4) so a
  queued change doesn't cancel the in-flight animation into an instant `setView`, and that the list fallback is
  gated strictly on a genuine load failure (not a transient tile error or a hydration race that trips on
  desktop). Add a cache-busting/version check to rule out a stale bundle.
- **Rationale**: The client saw the fly "jump like a swapped PNG" and once saw the list-only fallback on
  desktop — classic symptoms of either (i) the animation being short-circuited to `setView`, (ii) a
  reduced-motion misread, (iii) an animation cancelled by a rapid subsequent change, or (iv) a stale cached
  build. All are code/deploy-fixable and must be confirmed, not assumed.
- **⚠ confirm**: exact browser + version + machine where the jump/fallback appeared (to separate a code fix
  from a stale-cache non-issue).
- **Alternatives**: "It's just their cache" — plausible but must be *evidenced*; we still fix the coalescing
  and fallback-gating regardless.

## D4 — Offices map: no animation pile-up

- **Decision**: Coalesce office changes — cancel/ignore superseded targets and animate only to the latest;
  never start a new fly on top of an in-flight one; when reduced-motion is on, jump instantly.
- **Rationale**: Auto-advance plus manual nav plus fast clicks can otherwise stack Leaflet animations, which is
  a likely contributor to the D3 "jump". One animation at a time to the newest target is predictable.

## D5 — Offices map: pin-head overflow & fixed-height contact block

- **Decision**: (a) Render the active pin so its head extends slightly above the map container's top edge —
  a marker with a negative top offset / anchor above the frame and `overflow: visible` on the map wrapper.
  (b) Give the address/contact block a **fixed height** sized to the tallest office address so switching
  offices never shifts layout ("dancing" fix, FR-604) — reserve the space and vertically position the content
  within it.
- **Rationale**: Both are direct meeting asks: the pin head "pokes out of the map frame" as a visual treatment,
  and the different-height address containers cause the observed layout jump. A fixed height (not min-height)
  guarantees CLS ≈ 0 for the block.
- **Alternatives**: `min-height` — still shifts if an address exceeds it; a fixed height measured against the
  tallest office is safer. Absolute-positioning the pin outside the map — brittle across zoom; anchor offset is
  cleaner.

## D6 — Offices carousel redesign ("6 cities at once") — design-pending option

- **Decision**: Capture as an *option to evaluate*, not committed scope (FR-607). If pursued: active city in
  caps/larger, the other cities smaller below with a rotating offset. Flag the risk that it reads as buttons
  (mitigate with non-button styling, no borders/hover-as-control affordances). Default: keep the current
  single-active carousel.
- **⚠ confirm**: whether the 6-cities redesign is approved. Default **no** (ship current carousel).

## D7 — World coverage map: technology & whole-country USA/Canada

- **Decision**: Build a **new, distinct** `WorldCoverageMap.tsx` that renders a **simplified Natural Earth world
  GeoJSON** (`public/geo/world-countries.json`) and paints features whose country is in a served-country list.
  Use a country-boundary dataset keyed by **whole countries** (ISO A3 / admin-0) so the USA and Canada are each
  a single filled feature — explicitly NOT an admin-1 (states/provinces) layer, which is the current bug
  (FR-609). Candidate renderers: `react-simple-maps` (d3-geo under the hood) or a hand-rolled SVG `<path>` per
  feature — both accept the same GeoJSON; pick the lighter integration at build time.
- **Rationale**: Data-driven painting from a country list over admin-0 GeoJSON means ops add a country by
  editing a list — no designer, no image swap (FR-610). Keeping it off Leaflet avoids interactive-map weight for
  a static thematic map.
- **Alternatives**: A static painted image — rejected (can't be updated by ops without a designer). A full
  Leaflet choropleth — heavier than needed for a non-interactive world fill. An admin-1 dataset — the source of
  the current wrong state-by-state rendering.

## D8 — World coverage map: mobile behaviour

- **Decision**: On small screens (<~640px), the world map scales down to fit width with `preserveAspectRatio`
  (no horizontal overflow) and drops to a legible minimum; if the full world becomes an unreadable sliver,
  fall back to a **static, non-interactive fit-to-width render** (and, if needed, a short text list of served
  regions beneath). No pinch-zoom expectation (thematic map, not an explorer).
- **Rationale**: FR-611 requires a *defined* mobile behaviour that stays legible at 375px without overflow.
  Fit-to-width SVG with an aspect ratio is the simplest robust default.
- **⚠ confirm**: acceptable — or does the client want a mobile-specific cropped/regional view instead? Default
  **fit-to-width whole world**.

## D9 — Data wiring: CMS Regions → maps, with fallback

- **Decision**: Add a Region schema to `lib/cms/schemas.ts` and a mapper in `lib/cms/map.ts`; a
  `lib/locations/source.ts` resolves offices (and served countries) from CMS Regions when available and valid,
  otherwise falls back to the `lib/offices.ts` code list / a built-in country list. Regions carry an
  *office vs. coverage-only* flag so coverage-only regions paint the world map but never appear in the offices
  carousel (FR-616).
- **Rationale**: Lets ops manage locations without a deploy once `010` exposes the fields, while upholding 002's
  graceful degradation — the maps never break if the CMS is down, invalid, or empty (FR-615). Zod-validate the
  Region payload at the boundary so bad CMS data degrades to the fallback rather than crashing.
- **⚠ confirm**: keep offices as the `lib/offices.ts` code list at launch (CMS behind a flag) vs. move to CMS
  Regions immediately (gated on `010-cms-enhancements`). Default **code list at launch, CMS behind a flag**.
- **Alternatives**: Hard cut-over to CMS with no fallback — rejected, violates graceful degradation and couples
  launch to 010.

## Data-model note — CMS Region fields required to drive the maps

A CMS "Region" (feature 001, exposed by `010-cms-enhancements`) must expose, at minimum, the following so it
can drive both maps. This mirrors the existing `Office` type in `lib/offices.ts` plus a coverage flag:

| Field | Type | Purpose |
|---|---|---|
| `city` | string | Carousel label / office name |
| `country` | string | Address + resolves to a world-map country feature |
| `coords` | { lat: number; lng: number } | Leaflet camera target (note: `offices.ts` stores `{lng,lat}`) |
| `zoom` | number | Leaflet target zoom for the office |
| `addressLines` | string[] | Contact block (drives the fixed-height sizing, D5) |
| `tel` | string \| null | Contact block (optional) |
| `email` | string | Contact block |
| `isOffice` (vs coverage-only) | boolean | Office → appears in carousel + painted; coverage-only → painted only (FR-616) |

Optional but useful: an ISO A3 country code to resolve world-map features unambiguously (avoids name-matching
typos, ties to FR-612), and an explicit carousel `order`.

## Summary of new configuration & assets

| Item | Scope | Purpose |
|---|---|---|
| `CMS_URL` / `CMS_READ_API_KEY` | server (existing) | Read Regions via `lib/cms/` (no new env) |
| `public/geo/world-countries.json` | asset | Simplified admin-0 (whole-country) world GeoJSON for the coverage map |
| Auto-advance interval | code default ~6s | Offices carousel rotation (⚠ confirm) |
| Offices source flag | code/env | Toggle offices between `lib/offices.ts` and CMS Regions (⚠ confirm launch source) |

No new secrets; the CMS read key stays server-side and the site never writes to the CMS.
