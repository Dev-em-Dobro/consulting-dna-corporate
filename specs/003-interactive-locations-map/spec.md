# Feature Specification: Interactive Locations Map

**Feature ID**: 003-interactive-locations-map
**Branch**: `feat/map`
**Date**: 2026-07-23
**Status**: Planned

## Summary

Replace the static "Our offices" grid on the homepage with an interactive
map-and-carousel block. A horizontal carousel of office city names sits below a
map; the centered name is the active office. Moving to the next/previous office
animates the map camera — it zooms out, travels across the world, then zooms in
to the new location — with a pin marking the office. The map itself is **not**
pan/scroll/zoom-able by the user; all navigation happens through the carousel.
The address/contact block beneath updates to the active office.

Reference design: `mapa.JPG` (map with red pin on top, faded side city names with
the active one bold-centered, address + tel + email below).

## User Scenarios

### Primary

As a prospective client browsing the homepage, I want to visually explore where
Corporate DNA has offices, so I can find the one nearest me and its contact
details.

1. User scrolls to the offices section and sees a map focused on the first
   office, with its city name centered/bold in the carousel and its address below.
2. User advances the carousel (arrow, swipe, or clicking a side city name).
3. The map camera zooms out, flies to the new office, and zooms in; the pin lands
   on the new location; the carousel re-centers on the new city; the address block
   updates.
4. User can move both directions; the carousel wraps or stops at the ends
   (see FR-008).

### Accessibility

- The carousel is keyboard-operable (arrows/Tab), each city is a labeled control.
- Users with `prefers-reduced-motion` get an instant camera jump (no fly arc).

## Requirements

### Functional

- **FR-001**: Display a map centered on the active office with a pin at its coordinates.
- **FR-002**: Display a horizontal carousel of all office city names; the active
  one is visually emphasized (bold, dark, centered), neighbors are faded.
- **FR-003**: Display the active office's address lines, telephone (if any), and email below.
- **FR-004**: Advancing to another office animates the map camera with a
  zoom-out → travel → zoom-in transition (a single "fly" arc), landing the pin on the new office.
- **FR-005**: The map must **not** be user-interactive — no scroll-zoom, no drag/pan,
  no double-click zoom, no rotate, no touch zoom. Navigation is carousel-only.
- **FR-006**: Carousel navigation via (a) next/prev affordance, (b) clicking a
  non-active city name, and (c) touch swipe on mobile.
- **FR-007**: The section replaces the current static "Our offices" grid on the homepage.
- **FR-008**: Reaching the last/first office wraps around to the other end.
- **FR-009**: Respect `prefers-reduced-motion`: replace the fly animation with an instant jump.
- **FR-010**: If the map fails to load (missing token / network), degrade gracefully to a
  readable list of offices (never a broken/empty block).

### Data

- **FR-011**: Offices are a fixed, code-defined list (the 5 current offices), each with
  city, country, address lines, optional tel, email, and map coordinates + target zoom.

### Non-Functional

- **NFR-001**: Camera animation should feel smooth (~60fps) on a mid-range laptop.
- **NFR-002**: The map library must not block initial page load — load it lazily
  (only when the section is near the viewport).
- **NFR-003**: Responsive: works on mobile (375px) through desktop; touch swipe on mobile.

## Offices (source content)

| City | Country | Tel | Email |
|------|---------|-----|-------|
| London | UK | +44 20 3755 5329 | london@corporatednaconsulting.com |
| Miami | USA | +1 305-374-4611 | miami@corporatednaconsulting.com |
| Singapore | Singapore | +65 6995 2480 | singapore@corporatednaconsulting.com |
| Dubai | UAE | — | dubai@corporatednaconsulting.com |
| Saudi Arabia | KSA | — | riyadh@corporatednaconsulting.com |

Addresses carried over verbatim from the current homepage `offices` array.

## Out of Scope

- Sourcing offices from the CMS (kept as a fixed code list for now).
- Directions, live hours, or any Places/search interactivity.
- Multiple map instances / a dedicated offices page (homepage only for this feature).

## Open Questions (resolved)

- Map tech → **Mapbox GL JS** (resolved via planning).
- Data source → **fixed code list + lat/lng** (resolved).
- Placement → **replace the homepage offices section** (resolved).
