# Implementation Plan: Maps — offices carousel-map & world coverage map

**Branch**: `008-maps` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-maps/spec.md` (derived from meeting `fixes-reuniao-24-07`)

## Summary

Extend the shipped **Leaflet** offices carousel-map (feature 003) with the meeting's polish/behaviour
requirements — infinite continuous carousel, viewport-and-interaction-aware auto-advance (disabled under
`prefers-reduced-motion`), a pin head that overflows the map frame, a fixed-height contact block to kill the
"dancing" layout, and a reliable cross-browser fly transition (fixing the reported PNG-swap "jump" and the
spurious desktop list-fallback) — while capturing a "6 cities at once" redesign as an evaluated option. Add a
**new, distinct world coverage map** that paints served countries data-driven over a GeoJSON world layer,
with the USA and Canada as whole countries and a defined mobile behaviour. Finally, wire both maps to the CMS
"Regions" cadastro (via the existing read-only `lib/cms/`) with a safe fallback to `lib/offices.ts`, gated on
`010-cms-enhancements` exposing region coordinates/country.

This plan targets the **real code (Leaflet 1.9)**; 003's spec text says "Mapbox GL JS" but the implementation
is Leaflet — a documentation discrepancy this feature does not follow.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js (Vercel runtime)

**Primary Dependencies**: Next.js 16 (App Router) · React 19 · **Leaflet 1.9** (existing offices map) ·
Tailwind 4 · Zod 4 (validate CMS Region payloads at the boundary). World coverage map: a lightweight GeoJSON
world layer rendered as SVG/Canvas (candidate: `react-simple-maps`/`d3-geo` or a hand-rolled SVG over a
Natural Earth GeoJSON — decided in research). CMS access via existing `lib/cms/` (`client.ts`, `map.ts`,
`schemas.ts`).

**Storage**: None new. Offices remain a code list (`lib/offices.ts`) until CMS wiring lands; CMS Regions are
read-only over HTTPS (`CMS_URL`/`CMS_READ_API_KEY`) — the site never writes to the CMS. World-map country
data is a static GeoJSON asset + a served-country list (code or CMS).

**Testing**: Vitest (unit: infinite-wrap index maths, auto-advance state machine, country-list → GeoJSON
resolution, CMS Region → Office mapping + fallback) · Playwright/manual smoke (auto-advance + pause on
interaction/off-viewport, reduced-motion no-fly, fly-not-swap across Chrome/Firefox/Safari, zero CLS on the
contact block, whole-country USA/Canada fill, 375px world-map behaviour).

**Target Platform**: Vercel — the site's existing deployment. Maps are client components (Leaflet needs the
DOM; world map renders client-side); loaded lazily so they don't block initial paint (003 NFR-002).

**Project Type**: Web application (Next.js App Router) — client map components + `lib/` data/adapters.

**Performance Goals**: Camera fly ~60fps on a mid-range laptop (003 NFR-001); maps lazy-load near viewport;
auto-advance does no work off-screen; world-map GeoJSON kept small (simplified geometry) to bound bundle/parse.

**Constraints**: Map non-interactive by user (003 FR-005) — auto-advance/carousel is the only navigation;
reduced-motion = instant jump, no auto-fly (003 FR-009, FR-602); graceful degradation to a readable list on
map failure (003 FR-010) — and that fallback must NOT appear spuriously on a working desktop (FR-605); CMS is
read-only and the maps must survive its absence (002 posture, FR-615).

**Scale/Scope**: 5 offices today (London, Miami, Singapore, Dubai, Saudi Arabia) + a served-country list for
the world map. Two map components, a shared data-source/adapter layer, one CMS Region adapter with fallback.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after design.*

The project constitution (`.specify/memory/constitution.md`) is the **unratified template** — no binding
gates. Self-imposed gates for this feature:

| Self-imposed gate | Status |
|---|---|
| Plan against real code, not stale docs (Leaflet, not Mapbox) | PASS — all design references the shipped Leaflet components |
| Reuse the 003 base, don't rebuild it | PASS — additive FR-6xx layered on existing `LocationsBlock/Carousel/Map` |
| Accessibility & motion respect preserved | PASS — auto-advance disabled + instant jump under `prefers-reduced-motion`; keyboard nav inherited from 003 |
| Graceful degradation upheld | PASS — list fallback on map failure (003 FR-010); CMS-absent fallback to code list (002) |
| No CMS coupling beyond read-only client | PASS — Regions consumed via existing `lib/cms/`; site never writes the CMS |
| No secret in the client bundle | PASS — CMS read key stays server-side; maps receive resolved data |
| Simplicity / no premature complexity | PASS — one new component, one adapter, a static GeoJSON asset; redesign deferred as an option |

No violations requiring justification. **Recommendation**: ratify a real constitution
(`/speckit-constitution`) before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/008-maps/
├── plan.md              # This file
├── spec.md              # Feature specification (extends 003)
├── research.md          # Phase 0 — auto-advance, transition-bug root cause, world-map tech, CMS wiring
├── data-model.md        # Phase 1 — Region fields for maps + Office/served-country shapes (/speckit-plan)
├── contracts/           # Phase 1 — CMS Region → Office/served-country adapter contract (/speckit-plan)
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── components/
│   ├── LocationsBlock.tsx        # MODIFY: auto-advance controller (interval + IntersectionObserver +
│   │                             #         reduced-motion), infinite wrap, fixed-height contact block
│   ├── LocationsCarousel.tsx     # MODIFY: continuous/infinite carousel; (optional) 6-cities redesign variant
│   ├── LocationsMap.tsx          # MODIFY: reliable fly (fix jump/PNG-swap), pin-head overflow, fallback only
│   │                             #         on genuine failure
│   └── WorldCoverageMap.tsx      # NEW: distinct world map painting served countries (whole-country USA/CA)
├── lib/
│   ├── offices.ts                # EXISTING code list (fallback source of truth); may become CMS-augmented
│   ├── locations/                # NEW: shared data source + adapters
│   │   ├── source.ts             #   NEW: resolve offices/countries from CMS Regions or fall back to offices.ts
│   │   └── coverage.ts           #   NEW: served-country list + resolve to GeoJSON world features
│   └── cms/
│       ├── client.ts             # EXISTING read-only CMS client (CMS_URL/CMS_READ_API_KEY)
│       ├── map.ts                # MODIFY/REUSE: map CMS Region → Office/served-country
│       └── schemas.ts            # MODIFY: add Region schema (coords, country, office/coverage flag)
└── public/
    └── geo/
        └── world-countries.json  # NEW: simplified Natural Earth world GeoJSON (whole countries)
```

**Structure Decision**: Single Next.js app (this repo). The offices map is *extended in place* — the three
existing `Locations*` components are modified, not replaced, so 003's non-interactive, carousel-only,
reduced-motion and fallback behaviours are preserved. The world coverage map is a **new, independent**
component (`WorldCoverageMap.tsx`) with its own GeoJSON asset — deliberately not entangled with Leaflet. A
thin `lib/locations/` layer centralises "where does map data come from" (CMS Regions with a `lib/offices.ts`
fallback), keeping the CMS wiring swappable and the maps resilient to CMS outages.

## Phase 0 — research (unknowns to resolve → `research.md`)

- **Auto-advance design**: interval (recommend ~6s), pause triggers (interaction + off-viewport + recommend
  hover), interaction with the in-flight fly (coalesce), reduced-motion handling. *(⚠ confirm interval/hover)*
- **Transition-bug root cause**: reproduce the "jump like a swapped PNG" and the spurious desktop list
  fallback; determine code fix vs. stale cache/version. *(⚠ confirm client browser/version)*
- **World-map technology**: `react-simple-maps`/`d3-geo` vs. hand-rolled SVG over Natural Earth GeoJSON;
  ensure whole-country USA/Canada; define mobile behaviour. *(⚠ confirm country list + data source)*
- **CMS Regions wiring**: the Region fields the maps need, the adapter, and the fallback; whether offices move
  to CMS at launch or stay a code list (gated on 010). *(⚠ confirm launch source)*
- **"6 cities at once" redesign**: approve/reject; if approved, spec the layout. *(⚠ confirm)*

See `research.md` for the data-model note on required CMS Region fields.

## Complexity Tracking

> No Constitution Check violations require justification. Complexity is deliberately bounded: the offices map
> is extended, not rewritten; the world map is a single new component over a static, simplified GeoJSON asset;
> and CMS wiring is one adapter with a code-list fallback (no new store, no CMS writes). The "6 cities"
> redesign is intentionally kept as a deferred, design-pending option rather than committed scope to avoid
> speculative rework.
