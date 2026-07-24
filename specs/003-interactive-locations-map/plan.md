# Implementation Plan: Interactive Locations Map

**Branch**: `feat/map` | **Date**: 2026-07-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-interactive-locations-map/spec.md`

## Summary

Replace the homepage's static "Our offices" grid with an interactive
map + city-carousel block. Mapbox GL JS renders a non-interactive map; a single
`flyTo` per transition produces the zoom-out → travel → zoom-in effect and lands a
pin on the active office. A horizontal carousel (bold active / faded neighbors)
plus an address block drive and reflect the active office. Offices are a fixed
code list enriched with coordinates. The map library is loaded lazily and the
block degrades to a plain office list if the map can't load.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)

**Primary Dependencies**: `mapbox-gl` v3 (map + camera `flyTo`), Tailwind CSS v4,
`next/dynamic` for lazy loading. No React wrapper lib — drive the map directly for
precise camera control.

**Storage**: N/A — offices are a static TypeScript module (`lib/offices.ts`).

**Testing**: Repo has no test runner configured. Validation is manual via
`quickstart.md` (typecheck with `tsc --noEmit`, visual checks in the browser).

**Target Platform**: Modern browsers, responsive 375px → desktop.

**Project Type**: Web — single Next.js app.

**Performance Goals**: ~60fps camera animation; Mapbox bundle excluded from the
initial homepage payload (lazy, in-view load).

**Constraints**: Map is fully non-interactive (`interactive: false`); respect
`prefers-reduced-motion` (jump instead of fly); requires `NEXT_PUBLIC_MAPBOX_TOKEN`;
graceful fallback to an office list when the map can't initialise.

**Scale/Scope**: 5 offices, one homepage section, ~3 new components + 1 data module.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is an unfilled
template — no ratified principles or gates. **Result: PASS (no constraints to
violate).** General repo conventions still apply: server components by default,
client components only where interactivity is required (the map block is a client
component), Tailwind utility styling matching the existing design tokens
(`bg-ink`, `text-brand`, etc.), and graceful CMS/asset degradation patterns.

## Project Structure

### Documentation (this feature)

```text
specs/003-interactive-locations-map/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions (Mapbox, flyTo, interaction lockdown)
├── data-model.md        # Phase 1 — Office entity + coordinates
├── quickstart.md        # Phase 1 — setup + manual validation
└── contracts/
    └── components.md     # Phase 1 — component props + behavior contract
```

### Source Code (repository root)

```text
lib/
└── offices.ts               # NEW — Office[] fixed list w/ coords + zoom (data model)

components/
├── LocationsMap.tsx         # NEW — client component: Mapbox map + pin, camera flyTo
├── LocationsCarousel.tsx    # NEW — city-name carousel (active bold, neighbors faded)
└── LocationsBlock.tsx       # NEW — client wrapper: owns activeIndex, wires map+carousel+address,
                             #        lazy-loads Mapbox, renders fallback list on failure

app/
└── page.tsx                 # EDIT — replace the static "OFFICES / REGIONS" <section> with <LocationsBlock/>

app/
└── globals.css (or layout)  # EDIT — import 'mapbox-gl/dist/mapbox-gl.css' (once)

next.config.mjs              # (no change expected — Mapbox tiles are same-origin via its CDN)
.env.local / Vercel env      # NEW — NEXT_PUBLIC_MAPBOX_TOKEN
```

**Structure Decision**: Single Next.js app. A `LocationsBlock` client component
owns the `activeIndex` state and composes a presentational `LocationsCarousel`
and an imperatively-driven `LocationsMap`. Office data lives in `lib/offices.ts`
so it stays a pure, testable, server-importable module (the homepage can also
still read it if needed elsewhere). Mapbox is dynamically imported inside
`LocationsBlock` so it never lands in the initial homepage bundle.

## Phase 0 — Research

See [research.md](./research.md). Key decisions:

- **Mapbox GL JS v3, driven directly** (no `react-map-gl`) for precise camera control.
- **`flyTo` is the transition** — its natural parabolic zoom-out→zoom-in matches the
  brief in one call (tuned via `curve`/`speed`), so no manual two-step choreography.
- **Interaction lockdown** via `interactive: false` at init (kills scroll/drag/rotate/zoom).
- **Pin** = custom HTML `Marker` with an inline SVG pin in the brand color.
- **Style** `mapbox://styles/mapbox/streets-v12` (closest to the reference screenshot).
- **Lazy load** via `next/dynamic` + `IntersectionObserver` (in-view) to protect LCP.
- **Reduced motion** → `jumpTo` instead of `flyTo`.
- **Fallback** → render the office list (current markup) if token missing / map error.

## Phase 1 — Design & Contracts

- Data model: [data-model.md](./data-model.md) — `Office` entity with `coords {lng,lat}`
  and target `zoom`.
- Component contract: [contracts/components.md](./contracts/components.md) — props and
  behavioral guarantees for `LocationsBlock`, `LocationsMap`, `LocationsCarousel`.
- Validation: [quickstart.md](./quickstart.md).

## Complexity Tracking

No constitution violations — table not required.

## Phase 2 — Next step

Run `/speckit-tasks` to generate `tasks.md` (dependency-ordered implementation tasks).
This plan does not create tasks.
