# Tasks: Interactive Locations Map

**Feature**: 003-interactive-locations-map · **Branch**: `feat/map`
**Inputs**: [plan.md](./plan.md) · [data-model.md](./data-model.md) · [contracts/components.md](./contracts/components.md)

`[P]` = can run in parallel (independent file). Ordered by dependency.

## Phase A — Setup

- [x] **T001** Install Leaflet: `npm install leaflet` + `npm install -D @types/leaflet` (v1.9).
- [x] **T002** No token/env var needed — Leaflet + CARTO Voyager raster tiles are keyless.
  Leaflet CSS imported once in `app/layout.tsx` (`import "leaflet/dist/leaflet.css"`).

## Phase B — Data

- [x] **T003** Created `lib/offices.ts` — `Office` type + `offices: Office[]` (5 offices, coords, zoom).

## Phase C — Components (contracts/components.md)

- [x] **T004** `components/LocationsMap.tsx` — non-interactive Leaflet map, brand pin, `flyTo`/`setView`, cleanup.
- [x] **T005** `components/LocationsCarousel.tsx` — centered active city, faded neighbors, arrows, click,
  swipe, keyboard + `aria-current`.
- [x] **T006** `components/LocationsBlock.tsx` — orchestrator, lazy in-view map mount, reduced-motion,
  address block, fallback office grid.

## Phase D — Integration

- [x] **T007** `app/page.tsx` — static offices section replaced with `<LocationsBlock />`; old `offices` array removed.

## Phase E — Validation (quickstart.md)

- [x] **T008** `npx tsc --noEmit` clean; home renders 200 (fallback grid without a token).
- [ ] **T009** Manual pass of quickstart scenarios 1–9. No longer blocked — Leaflet + CARTO tiles
  are keyless, so the map/animation scenarios can be verified locally without any token.

## Notes

- The block renders the fallback office list only on a real tile/network error (Leaflet + CARTO need no token).
- Coordinates in `lib/offices.ts` are approximate; fine-tune `coords`/`zoom` visually.
