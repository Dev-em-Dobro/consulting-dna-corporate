# Quickstart & Validation: Interactive Locations Map

Manual validation guide (the repo has no automated test runner). Implementation
details live in `tasks.md` (after `/speckit-tasks`) — this file only proves the
feature works end-to-end.

## Prerequisites

1. A Mapbox account + a **public** access token (URL-restricted).
2. Add the token locally and to Vercel:
   ```
   # .env.local
   NEXT_PUBLIC_MAPBOX_TOKEN="pk.xxxxx"
   ```
   ```
   # Vercel (Preview + Production), Impulse scope
   vercel env add NEXT_PUBLIC_MAPBOX_TOKEN preview   --scope impulse66
   vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production --scope impulse66
   ```
3. Install the dependency:
   ```
   npm install mapbox-gl
   npm install -D @types/mapbox-gl   # if types aren't bundled
   ```

## Run

```
npm run dev            # http://localhost:3006
npx tsc --noEmit       # type-check the new components/data module
```

## Validation scenarios

Open `http://localhost:3006` and scroll to the offices section.

1. **Initial render** — map shows the first office at street zoom with a red pin;
   that city is bold/centered in the carousel; its address/tel/email show below.
2. **Advance (arrow / click city / swipe)** — the map **zooms out, flies across the
   world, and zooms in** to the next office; the pin lands on it; the carousel
   re-centers; the address block updates. (FR-002/003/004)
3. **No map interaction** — try to scroll-zoom, drag, double-click, and pinch on the
   map: nothing happens; page scroll still works over it. (FR-005)
4. **Wrap-around** — from the last office, "next" returns to the first; from the
   first, "prev" goes to the last. (FR-008)
5. **Keyboard** — Tab to the carousel, operate with Enter/Space/arrows; active city
   is announced via `aria-current`. (Accessibility)
6. **Reduced motion** — enable OS "reduce motion" (or DevTools emulation); advancing
   now **jumps instantly** with no fly arc, still in sync. (FR-009)
7. **Fallback** — temporarily unset `NEXT_PUBLIC_MAPBOX_TOKEN` and reload: the block
   renders the plain office list instead of a broken/empty map. (FR-010)
8. **LCP guard** — with DevTools Network throttling, confirm the Mapbox bundle loads
   only when scrolling near the section, not on initial homepage load. (NFR-002)
9. **Responsive** — at 375px width, the carousel + map + address stack cleanly and
   swipe works. (NFR-003)

## Definition of done

- All 9 scenarios pass.
- `npx tsc --noEmit` clean.
- The old static "OFFICES / REGIONS" grid on the homepage is fully replaced.
- No console errors; no cumulative layout shift when the map mounts.
