# Phase 0 Research: Interactive Locations Map

## D1 — Map library

- **Decision**: Mapbox GL JS v3, used directly (imperative), inside a client component.
- **Rationale**: `flyTo` gives a physically-correct fly animation (zoom out, travel,
  zoom in) in one call — exactly the brief. Interactions are trivially disabled.
  Driving the map directly (vs `react-map-gl`) avoids a wrapper's re-render coupling
  and gives full control of the camera timeline. Generous free tier for a marketing site.
- **Alternatives considered**:
  - *Google Maps JS API*: matches the screenshot look best but requires billing enabled
    and per-load cost; camera animation is less turnkey than `flyTo`.
  - *Leaflet + OSM*: free/no-key, has `flyTo`, but raster OSM looks less like the ref and
    the fly arc is less refined.
  - *Static per-office images*: cheapest, but not a real map and the world-travel zoom
    effect would be faked/limited.

## D2 — The zoom-out → travel → zoom-in transition

- **Decision**: One `map.flyTo({ center, zoom, curve, speed, essential: true })` per office change.
- **Rationale**: `flyTo` already flies along a curve that zooms out to clear the distance
  then zooms back in — no need to choreograph two separate `easeTo` steps. Tune `curve`
  (~1.42) and `speed` (~0.8–1.2) for the desired drama/duration. `essential: true` keeps it
  running under reduced-motion OS settings *only when we choose to* (we gate this ourselves).
- **Alternatives considered**: manual two-phase `easeTo(worldZoom)` → `easeTo(target)` — more
  code, more timing bugs, no visual benefit over `flyTo`.

## D3 — Locking out user interaction

- **Decision**: Initialise with `interactive: false`.
- **Rationale**: A single flag disables scrollZoom, boxZoom, dragRotate, dragPan, keyboard,
  doubleClickZoom, and touchZoomRotate — satisfying FR-005 with no per-handler wiring.
  Programmatic `flyTo`/`jumpTo` still work. Also hide default controls (no `NavigationControl`).
- **Alternatives**: disabling each handler individually — more surface area, easy to miss one.

## D4 — Pin marker

- **Decision**: Custom `mapboxgl.Marker` with an inline SVG pin element in the brand red,
  anchored `bottom`.
- **Rationale**: Matches the reference pin; full CSS control (drop shadow, size, brand color);
  simpler than adding a symbol layer + image sprite for a single marker.
- **Alternatives**: a GeoJSON symbol layer — overkill for one moving pin.

## D5 — Map style

- **Decision**: `mapbox://styles/mapbox/streets-v12`.
- **Rationale**: Closest built-in style to the screenshot (street labels, POIs, light palette).
- **Alternatives**: a custom Mapbox Studio style later if brand tuning is wanted (not needed now).

## D6 — Loading strategy (protect LCP)

- **Decision**: `next/dynamic(() => import('./LocationsMap'), { ssr: false })` and only mount the
  map once the section enters the viewport (`IntersectionObserver`). Import the Mapbox CSS once.
- **Rationale**: `mapbox-gl` is large; keeping it out of the initial homepage bundle protects
  Core Web Vitals. The offices section is far below the fold, so in-view loading is invisible to users.
- **Alternatives**: static import — regresses homepage LCP for a below-the-fold feature.

## D7 — Reduced motion

- **Decision**: When `matchMedia('(prefers-reduced-motion: reduce)')` matches, use `jumpTo`
  (instant) instead of `flyTo`.
- **Rationale**: Honors OS accessibility preference (spec FR-009) while keeping the location in sync.

## D8 — Failure / no-token fallback

- **Decision**: If `NEXT_PUBLIC_MAPBOX_TOKEN` is absent or map init throws, render the existing
  static office list markup instead of the map.
- **Rationale**: Marketing page must never show a broken/empty block (FR-010); mirrors the
  project's existing graceful-degradation pattern for CMS/media.

## D9 — Coordinates

- **Decision**: Store approximate office coordinates + a per-office target `zoom` in `lib/offices.ts`.
- **Rationale**: Fixed data (spec FR-011); no geocoding dependency at runtime. Values below are
  starting points, refined visually during implementation.

  | City | lng | lat | zoom |
  |------|-----|-----|------|
  | London | -0.1270 | 51.5101 | 15 |
  | Miami | -80.1918 | 25.7617 | 15 |
  | Singapore | 103.8480 | 1.2792 | 15 |
  | Dubai | 55.2856 | 25.2232 | 15 |
  | Saudi Arabia (Riyadh) | 46.6753 | 24.7136 | 15 |

## D10 — Environment / secrets

- **Decision**: `NEXT_PUBLIC_MAPBOX_TOKEN` (public, URL-restricted in the Mapbox account).
  Add to `.env.local` and to Vercel (Preview + Production).
- **Rationale**: Public token is required client-side; URL restriction limits abuse.
