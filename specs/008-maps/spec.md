# Feature Specification: Maps — offices carousel-map & world coverage map

**Feature Branch**: `008-maps`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Client review meeting (`fixes-reuniao-24-07`) — feedback on the homepage locations map plus a
request for a distinct "mapa mundi de atuação" (world coverage map) and wiring both to the CMS
"Regions" cadastro. This feature EXTENDS `003-interactive-locations-map` (the base offices map) with the
meeting's additional requirements; it does not restate 003's base behaviour, it references it.

## Overview

Two related map deliverables on the marketing site, plus a data-wiring track:

- **A) Offices / home locations map** — the existing Leaflet carousel-map (`components/LocationsBlock.tsx`,
  `LocationsCarousel.tsx`, `LocationsMap.tsx`, data in `lib/offices.ts`) built by 003. The meeting added
  polish and behaviour requirements: an *infinite* (wrap-without-stop) carousel, *automatic* slide
  rotation to convey global reach, a pin whose head overflows the map frame, a fixed-height contact block
  so switching offices causes no layout jump, a cross-browser fix for a camera-transition bug (the fly
  animation "jumps" like a swapped PNG on the client's Chrome and the list-only fallback once appeared on
  desktop), and an option to evaluate a "6 cities at once" carousel redesign.
- **B) World coverage map ("mapa mundi de atuação")** — a NEW, distinct component that paints the
  countries where the firm operates on a world map. It must paint the USA and Canada as *whole countries*
  (the current rendering colours individual states, which is wrong), be updatable data-driven (a country
  list painted over a GeoJSON world layer, not a hand-edited static image), and define a mobile behaviour.
- **C) Data wiring** — connect the CMS "Regions" cadastro (feature 001, exposed by `010-cms-enhancements`)
  to drive the offices map (replacing/augmenting the hardcoded `lib/offices.ts`) and, where applicable,
  the world coverage map — with a safe fallback to the code list if the CMS is unavailable (per 002's
  graceful-degradation posture).

**Discrepancy note (must carry forward)**: 003's spec text says "Mapbox GL JS", but the shipped code uses
**Leaflet 1.9**. This feature plans against the *real code* (Leaflet). All references to the camera "fly",
non-interactivity, reduced-motion and list fallback are the Leaflet implementation, not Mapbox.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — The offices map feels alive and conveys global reach (Priority: P1)

A visitor scrolls to the offices section. The carousel *auto-advances* through the cities, the map camera
flying smoothly between them, so the firm's global footprint is felt without any clicking. The visitor can
take over at any time (arrow, swipe, click a city); auto-advance pauses on their interaction and while the
section is off-screen, and never runs under `prefers-reduced-motion`. Reaching the last office continues
seamlessly back to London — the carousel never dead-ends.

**Why this priority**: This is the core of the meeting's ask — "give a sense of global reach and induce
interaction." Auto-advance + infinite wrap is what makes the block feel alive; everything else is polish on
top of the already-shipped 003 base.

**Independent Test**: Load the homepage, leave the offices section in view, and confirm the carousel
advances on its own through all cities and wraps London→…→last→London without stopping; interact and confirm
it pauses; scroll away and confirm it pauses; enable `prefers-reduced-motion` and confirm no auto-fly.

**Acceptance Scenarios**:

1. **Given** the offices section is in the viewport and the visitor is idle, **When** the auto-advance
   interval elapses, **Then** the carousel moves to the next office and the map camera flies to it.
2. **Given** auto-advance is running, **When** the visitor interacts (arrow/swipe/click a city), **Then**
   auto-advance pauses and the visitor's selection takes effect.
3. **Given** the carousel is on the last office, **When** it advances (auto or manual), **Then** it wraps to
   London and continues — no stop, no visible snap-back gap.
4. **Given** `prefers-reduced-motion` is set, **When** the section is viewed, **Then** auto-advance does not
   run and any office change is an instant jump (no fly arc), consistent with 003 FR-009.
5. **Given** the section scrolls out of the viewport, **When** the visitor is elsewhere on the page, **Then**
   auto-advance is paused (no work off-screen).

### User Story 2 — The offices map looks polished and stable (Priority: P1)

Switching offices must not make the layout "dance": the address/contact block keeps a fixed height so
shorter/longer addresses never shift the surrounding page. The map pin's head overflows slightly above the
map frame for a deliberate visual treatment. The camera transition is a real smooth fly on every supported
browser — never a hard PNG-like jump — and the list-only fallback appears *only* when the map genuinely
fails, never spuriously on a working desktop.

**Why this priority**: The client explicitly flagged the "dancing" text and the broken/jumpy transition as
defects to fix before launch; they undermine the credibility of the whole block.

**Independent Test**: Cycle through all offices and confirm zero layout shift in the contact block; inspect
the pin overflowing the frame; on Chrome/Firefox/Safari confirm the transition is an animated fly (not an
instant swap) with motion enabled; force a map-load failure and confirm the list fallback, then reload
normally and confirm the map (not the fallback) renders on desktop.

**Acceptance Scenarios**:

1. **Given** offices with different-length addresses, **When** the visitor switches between them, **Then**
   the contact block height is constant and no surrounding element shifts (CLS ≈ 0 for the block).
2. **Given** the rendered map, **When** the visitor looks at the active pin, **Then** the pin's head extends
   slightly beyond the top edge of the map container.
3. **Given** motion is enabled on a supported browser, **When** the office changes, **Then** the camera
   animates a zoom-out → travel → zoom-in fly (not a discrete image swap).
4. **Given** a normal, successful map load on desktop, **When** the section renders, **Then** the interactive
   map renders — the simplified list fallback does NOT appear.
5. **Given** the map fails to load (tiles/network/library), **When** the section renders, **Then** the
   readable office-list fallback appears (003 FR-010 preserved).

### User Story 3 — A world coverage map shows every country served (Priority: P2)

A visitor sees a world map with every country the firm operates in painted in the brand colour. The USA and
Canada are painted as *whole countries*, not as a patchwork of individual states/provinces. On mobile the map
degrades to a defined, legible behaviour rather than an unusable tiny world.

**Why this priority**: A distinct, valued asset for conveying reach, but independent of the offices map and
not a launch blocker for it — hence P2.

**Independent Test**: Render the world map and confirm the configured country list is painted; confirm the
USA and Canada are each a single filled shape (no internal state borders coloured differently); shrink to
375px and confirm the defined mobile behaviour.

**Acceptance Scenarios**:

1. **Given** a country list of served markets, **When** the world map renders, **Then** exactly those
   countries are painted in the brand colour and others are neutral.
2. **Given** the USA and Canada are served, **When** the map renders, **Then** each is a single whole-country
   fill (state/province boundaries are not individually painted).
3. **Given** ops add a country to the list, **When** the site rebuilds/refetches, **Then** the new country is
   painted with no designer/image edit required (data-driven).
4. **Given** a 375px-wide screen, **When** the world map renders, **Then** it follows the defined mobile
   behaviour (see FR-611) and remains legible.

### User Story 4 — Maps are driven by the CMS Regions cadastro (Priority: P3)

Office locations (and, where applicable, served countries) come from the CMS "Regions" content type so ops
can add/edit locations without a code change — while a safe fallback to the code list keeps the maps working
if the CMS is unreachable.

**Why this priority**: A durability/operations improvement layered on working maps; depends on
`010-cms-enhancements` exposing region coordinates/country, so it trails A and B.

**Independent Test**: With Regions available from the CMS, confirm the offices map renders CMS-driven offices;
with the CMS unreachable, confirm the maps fall back to `lib/offices.ts` and still render.

**Acceptance Scenarios**:

1. **Given** the CMS exposes Regions with the required fields, **When** the homepage renders, **Then** the
   offices carousel-map is populated from the CMS Regions.
2. **Given** the CMS is unreachable or returns invalid/empty data, **When** the homepage renders, **Then**
   the maps fall back to the hardcoded `lib/offices.ts` list and render normally (no broken block).
3. **Given** a Region flagged coverage-only (not an office), **When** the maps render, **Then** it paints the
   world coverage map but does NOT appear as an office in the carousel.

### Edge Cases

- Auto-advance while a fly animation is still in progress → advances must queue/skip, never overlap or stack
  camera animations.
- A single office/region in the data → infinite wrap must not spin or divide-by-zero; auto-advance should
  effectively no-op with one item.
- Rapid manual navigation (spamming next) → coalesce to the latest target; no animation pile-up (ties to the
  transition bug).
- Tab backgrounded / returned → auto-advance pauses when hidden and resumes cleanly (no burst of skipped
  frames), consistent with the off-viewport rule.
- World map: a country in the list with no matching GeoJSON feature (typo/wrong ISO code) → skip safely and
  surface nothing broken; log for ops.
- World map on very small screens → must not overflow horizontally or become an unreadable sliver.
- CMS Region missing coords or country → excluded from the map it can't drive, fallback used, no crash.
- The reported transition bug may be a stale cache/version on the client's machine — must be reproduced and
  either fixed in code or ruled out with evidence (see FR-605).

## Requirements *(mandatory)*

> FR-6xx are *additive* to 003 (FR-001…FR-011). Base behaviours (non-interactive map, carousel-only nav,
> reduced-motion instant jump, list fallback) are inherited from 003 and only referenced here.

**A) Offices carousel-map (extends 003)**

- **FR-601**: The carousel MUST be infinite — advancing past the last office wraps to the first (London) and
  continues seamlessly, with no stop, dead-end, or visible snap-back (supersedes 003 FR-008's "wrap or stop").
- **FR-602**: The carousel MUST auto-advance through offices on a timed interval to convey global reach. It
  MUST pause on user interaction, MUST pause while the section is out of the viewport, and MUST NOT run under
  `prefers-reduced-motion`.
- **FR-603**: The active map pin's head MUST overflow slightly beyond the map container's top margin (visual
  treatment — the pin tip/head pokes out of the map frame).
- **FR-604**: The active office's address/contact block MUST have a fixed height so that switching offices
  causes no layout shift in it or the surrounding page.
- **FR-605**: The camera transition between offices MUST be a smooth fly (zoom-out → travel → zoom-in) on all
  supported browsers with motion enabled, never a discrete image-swap "jump". The reported jump/PNG-swap and
  the spurious desktop list-fallback MUST be reproduced and fixed, or ruled out with a documented root cause
  (e.g. stale cache/version). The list fallback MUST appear only on genuine map-load failure.
- **FR-606**: Concurrent/queued office changes MUST NOT stack camera animations; the map coalesces to the
  latest target (no animation pile-up).
- **FR-607** *(design-pending, evaluate — not committed)*: Capture a carousel REDESIGN option showing all
  cities at once — active city in caps/larger, others smaller below, with a rotating offset — flagged as a
  design decision to evaluate, with the risk that it reads as buttons. Ship the current single-active carousel
  unless the redesign is explicitly approved.

**B) World coverage map (new component)**

- **FR-608**: The site MUST provide a world coverage map, a component *distinct* from the offices
  carousel-map, that paints the countries where the firm operates in the brand colour over a neutral world.
- **FR-609**: The USA and Canada MUST each be painted as a single whole country (no individually-coloured
  states/provinces).
- **FR-610**: The set of painted countries MUST be data-driven (a country list painted over a GeoJSON world
  layer) so ops can add/remove countries without a designer or a static-image swap.
- **FR-611**: The world coverage map MUST define and implement a mobile behaviour that keeps it legible and
  non-overflowing at ≥375px (see research for the recommended default).
- **FR-612**: A country listed but with no matching map feature MUST be skipped safely (no broken render) and
  the mismatch surfaced for ops.

**C) Data wiring (CMS Regions)**

- **FR-613**: The offices carousel-map MUST be able to source its offices from the CMS "Regions" cadastro
  (via `lib/cms/`), replacing/augmenting the hardcoded `lib/offices.ts`, once `010-cms-enhancements` exposes
  region coordinates/country.
- **FR-614**: Where applicable, the world coverage map's country list MUST be able to source from CMS Regions
  (coverage-only regions included).
- **FR-615**: Both maps MUST fall back safely to the code list (`lib/offices.ts`) / a built-in country list if
  the CMS is unavailable, invalid, or empty — the maps never render broken (upholds 002's graceful degradation
  and 003 FR-010).
- **FR-616**: A Region MUST be distinguishable as an *office* vs. *coverage-only* so it can drive the world
  map without appearing as an office in the carousel.

### Key Entities *(include if feature involves data)*

- **Office** *(existing, `lib/offices.ts`)*: slug, city, country, addressLines[], tel?, email, coords{lng,lat},
  zoom. Drives the offices carousel-map. Order defines carousel order. Note the codebase uses
  `coords{lng,lat}` (Leaflet expects `[lat,lng]` — mapping lives in the map component).
- **Region (CMS)**: the CMS "Regions" content type that will drive both maps. Must expose, at minimum: city,
  country, coordinates (lat/lng), zoom, address lines, tel, email, and an *office vs. coverage-only* flag.
  See the data-model note in `plan.md`/`research.md`. Provided by `010-cms-enhancements`.
- **Served country**: an entry in the world coverage map's country list, resolved to a GeoJSON world feature
  (by ISO code / name) and painted. Sourced from a built-in list and/or CMS Regions.

## Success Criteria *(mandatory)*

- **SC-601**: With the section in view and no interaction, the carousel auto-advances through every office and
  wraps continuously (last → London) with no stop or visible gap.
- **SC-602**: Auto-advance pauses within one interval of any user interaction and whenever the section leaves
  the viewport, and never runs under `prefers-reduced-motion`.
- **SC-603**: Switching between any two offices produces zero layout shift in the contact block (CLS ≈ 0 for
  the block) and the pin head visibly overflows the map frame.
- **SC-604**: On the latest Chrome, Firefox and Safari with motion enabled, 100% of office changes render as
  an animated fly (never a discrete swap); the list fallback appears only when the map is forced to fail.
- **SC-605**: The world coverage map paints exactly the configured countries, with the USA and Canada each a
  single whole-country fill, updatable by editing the country list alone (no image edit).
- **SC-606**: The world coverage map is legible and non-overflowing from 375px to desktop.
- **SC-607**: With the CMS reachable, the offices map is CMS-driven; with the CMS unreachable, both maps fall
  back to the code list and still render (no broken block).

## Assumptions

- The offices map stays on **Leaflet 1.9** (the shipped implementation), not Mapbox — 003's Mapbox wording is
  a documentation discrepancy, not the code.
- The world coverage map is a new component and may use a lightweight GeoJSON/SVG approach (see research); it
  does not need Leaflet interactivity.
- `010-cms-enhancements` will deliver the Region fields the maps need (coords, country, office/coverage flag);
  until then the offices map remains a code list and the CMS wiring (US4) trails A and B.
- Auto-advance defaults and the redesign approval are open inputs with recommended defaults (below /research).

## Decisions (approved by the user, 2026-07-24)

- **Pin head overflow (FR-603) = DROPPED.** No longer required — do not implement the pin poking out
  of the map frame.
- **Transition "bug" (FR-605) = NOT A BUG — nothing to do.** The camera transition is working
  correctly; the reported jump/PNG-swap was environment/cache on the client's machine, not a code
  defect. No code change; the list fallback rule (only on genuine failure) still stands from 003.
- **CMS Regions wiring (US4 / FR-613–FR-616) = DEFERRED.** Keep the offices/regions **hardcoded in
  `lib/offices.ts`** for now; do not pull from the CMS yet. Revisit once `010` is ready and the need
  arises.
- **Auto-advance = ~6s interval, pause on hover** (in addition to interaction / off-viewport /
  reduced-motion) — recommended default applied (FR-602).
- **"6 cities at once" redesign (FR-607) = keep the current single-active carousel** for now (default;
  redesign only if explicitly approved later).

### Still pending (user will provide)

- **World-map country list** — the exact list of served countries to paint (FR-608/FR-610). Built-in
  list at launch (no CMS). The world coverage map (US3) can't be finalized until this list arrives.
