# Phase 1 Component Contracts: Interactive Locations Map

UI contract for the three new components. These are the "interfaces" the feature
exposes within the app.

## `LocationsBlock` (client)

The section-level orchestrator that replaces the homepage "Our offices" grid.

```ts
type LocationsBlockProps = {
  offices?: Office[];   // defaults to the exported `offices` from lib/offices.ts
  eyebrow?: string;     // default "Our offices"
};
```

**Owns**: `activeIndex`, `mapReady`, `mapFailed`.

**Behavior**:
- Renders the eyebrow, the `LocationsMap`, the `LocationsCarousel`, and the active
  office's address/tel/email block.
- Lazily mounts `LocationsMap` (dynamic import, `ssr:false`) only when the section
  scrolls near the viewport (`IntersectionObserver`).
- On `activeIndex` change, tells the map to move to `offices[activeIndex]`.
- If `NEXT_PUBLIC_MAPBOX_TOKEN` is missing or the map errors, sets `mapFailed` and
  renders the **fallback**: the current static office list markup (no broken block).
- Wrap-around: advancing past the last office → index 0; before the first → last (FR-008).

## `LocationsMap` (client, imperative)

Thin wrapper over a Mapbox `Map`. Presentational + imperative; holds no app state.

```ts
type LocationsMapProps = {
  office: Office;                 // active office (center + zoom + pin)
  animate: boolean;              // true → flyTo; false → jumpTo (reduced motion / first mount)
  onReady?: () => void;          // fired on map 'load'
  onError?: (e: unknown) => void;// fired if init fails → parent shows fallback
  className?: string;
};
```

**Guarantees**:
- Initializes with `interactive: false` and no default controls → **no user
  scroll / drag / pan / rotate / zoom** (FR-005).
- Places exactly one brand-colored pin `Marker` at `office.coords`, anchored bottom.
- When `office` changes: `animate ? flyTo : jumpTo` to `office.coords` at `office.zoom`,
  and moves the pin to the new coordinates (FR-004).
- Cleans up the map instance on unmount.
- Never throws to render — surfaces failures via `onError`.

## `LocationsCarousel` (client, presentational)

Horizontal city-name carousel. Controlled by the parent.

```ts
type LocationsCarouselProps = {
  offices: Office[];
  activeIndex: number;
  onChange: (index: number) => void;  // clicking a city, arrow, or swipe
};
```

**Guarantees**:
- Active city is centered, bold, dark (`text-ink`); neighbors faded (FR-002).
- Clicking a non-active city calls `onChange` with its index (FR-006a).
- Exposes prev/next affordances that call `onChange` (FR-006b).
- Supports touch swipe left/right on mobile → prev/next (FR-006c).
- Fully keyboard operable: controls are real `<button>`s with `aria-label`s; the
  active item is announced (e.g. `aria-current`).

## Cross-cutting contracts

- **Reduced motion**: parent passes `animate=false` when
  `prefers-reduced-motion: reduce` → map uses `jumpTo` (FR-009).
- **Styling**: Tailwind tokens consistent with the site (`bg-ink`, `bg-paper`,
  `text-brand`, `text-muted`), matching the reference `mapa.JPG`.
- **No layout shift**: the map container has a reserved aspect ratio / fixed height
  so lazy mounting doesn't shift the page.
- **Env**: requires `NEXT_PUBLIC_MAPBOX_TOKEN`; absence triggers the fallback path.
