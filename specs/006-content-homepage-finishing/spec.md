# Feature Specification: Homepage finishing & global UI polish

**Feature Branch**: `006-content-homepage-finishing`

**Created**: 2026-07-24 · **Revised**: 2026-07-24 (re-scoped against the 24-07 meeting transcript)

**Status**: Draft

**Input**: Launch-readiness backlog + the `fixes-reuniao-24-07` meeting. This feature is the
**homepage + global UI polish** slice. Two adjacent areas were split out after the meeting:
**map work → `008-maps`**, and **content libraries + detail pages (Cases/Insights/Methodologies,
5H page) → `007-content-libraries`**. Branding assets (logo, charts, "Our Identity") → `009`.

## Overview

The finishing pass on the **homepage** and a set of **global UI fixes**: source the homepage
Client-Impact cards from the CMS, add the testimonials ("metralhadora") video before Client-Impact,
fix the impact-number mark that reads like a minus sign, add the home Awards logo strip, swap in
final imagery, polish the people/leadership cards (fixed height, larger LinkedIn icon, off-pattern
photo), centre the book CTA, and make the footer links match the header menu from the single
`siteNav` source. Content wiring here is **homepage-only**; the library/detail routes are `007`, and
all map behaviour is `008`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Homepage Client-Impact cards are CMS-driven (Priority: P1)

The three Client-Impact case cards on the homepage come from the CMS (not the hardcoded `cases`
array in `app/page.tsx`) and each links to its real `/cases/[slug]` detail.

**Why this priority**: The homepage still hardcodes its case cards; making them managed content is a
launch blocker and the last hardcoded content array on the home.

**Independent Test**: Publish/adjust a case in the CMS; confirm the homepage card reflects it and
"read more" opens the correct `/cases/[slug]`; with fewer cases than slots, a defined state renders.

**Acceptance Scenarios**:

1. **Given** published cases, **When** the homepage Client-Impact section renders, **Then** it shows
   CMS cases (client, sector, challenge, metric) and each links to its real case detail.
2. **Given** fewer cases than card slots, **When** the section renders, **Then** it shows a defined
   partial/empty state (no `undefined`, no dead links) — upholds `002` FR-104.

### User Story 2 — Testimonials "metralhadora" video before Client-Impact (Priority: P1)

A short, rapid-cut stitched-testimonials video autoplays (muted) in a section directly **before**
the Client-Impact section, under a heading in the vein of "what Fortune 500 leaders say about us".

**Why this priority**: A specific, requested homepage element that anchors social proof ahead of the
results section.

**Independent Test**: Load the homepage; a video section renders immediately above `#impact`, plays
muted-autoplay-loop (poster until ready), degrades to a poster on failure, and respects
reduced-motion.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** it renders, **Then** the testimonials video section appears
   immediately before `#impact`, with the agreed heading.
2. **Given** the video, **When** viewed, **Then** it autoplays muted + looping with `playsInline`;
   **Given** `prefers-reduced-motion`, **Then** it does not autoplay (poster + play control).
3. **Given** the video fails to load, **When** the section renders, **Then** a poster image shows
   (never a broken/empty block).

> Video source at launch: Guilherme's AI-generated reel (he will correct Rhea's name before sending).
> Per `001`, videos are external/hosted references.

### User Story 3 — Impact numbers no longer read as negatives (Priority: P2)

The credibility stats ("18", "90%", …) currently show a leading mark that looks like a minus sign
("‑18", "‑90%"). The mark is changed so it never reads as negative.

**Why this priority**: A visible correctness/perception bug on a hero credibility section; cheap to
fix, high embarrassment if shipped.

**Independent Test**: View the stats section; confirm no value reads as a negative number.

**Acceptance Scenarios**:

1. **Given** the stats section, **When** rendered, **Then** the leading mark is a lower underline
   closer to the number, or a small arrow — **not** a dash resembling a minus.
2. **Given** the mark still reads as negative in review, **When** decided, **Then** the mark is
   removed and the number stands on the brand-red styling alone.

### User Story 4 — Home Awards logo strip (Priority: P2)

The homepage includes an Awards & credentials section showing the award/partner logos (they exist in
the sales deck's "Our Identity" page but are absent from the new home).

**Why this priority**: Credibility signal expected at launch; the fuller awards page + descriptions
are `009` (Our Identity), but the home needs at least the logo strip.

**Independent Test**: View the homepage; an awards/credentials logo strip renders with correct,
optimised logos and links to the fuller awards/Our-Identity page.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** rendered, **Then** an awards/credentials logo section is present.
2. **Given** the awards page exists (`009`), **When** the strip is shown, **Then** it links through
   to it.

### User Story 5 — Final imagery replaces homepage placeholders (Priority: P2)

Placeholder homepage images are swapped for the final assets, with correct aspect ratios, `alt`
text, and no layout shift.

**Why this priority**: Visual credibility for launch; decoupled from logic → P2. (Brand/AI asset
management and the recreated logo are `009`.)

**Independent Test**: Confirm each homepage image slot shows the final asset at the right dimensions
with `alt` and 0 CLS; CMS-driven images use an allow-listed delivery domain.

**Acceptance Scenarios**:

1. **Given** final assets, **When** each homepage image renders, **Then** it shows the final image,
   correct ratio/`alt`, 0 CLS.
2. **Given** a slot's asset is not yet delivered, **When** rendered, **Then** the current placeholder
   remains (no broken image) and the slot is on a tracked pending list.

### User Story 6 — People / leadership card polish (Priority: P3)

People cards (home `PeopleGrid` and `/solutions/leadership`) render at a uniform fixed height, with a
larger LinkedIn icon, and the one photo with an off-pattern background is corrected.

**Why this priority**: Quality polish; low risk. Full bios remain in the existing pop-up.

**Independent Test**: With varying bio lengths, all cards are equal height and top-aligned (no
"stair-step"); the LinkedIn icon is visibly larger; the off-pattern photo matches the others.

**Acceptance Scenarios**:

1. **Given** people with varying bio lengths, **When** the grid renders, **Then** all cards are the
   same fixed height, aligned along the top (no "escadinha").
2. **Given** a card, **When** rendered, **Then** the LinkedIn icon is enlarged per design.
3. **Given** the off-background photo, **When** replaced with the high-res asset, **Then** its
   background matches the standard. *(Depends on the high-res photo — tracked as a pending asset.)*

### User Story 7 — Book section CTA centred (Priority: P3)

In the book section the CTA ("Buy on Amazon") is vertically centred within the section band, and the
middle line/layout is tidied.

**Independent Test**: The book CTA sits centred in the section; the middle line reads correctly.

**Acceptance Scenarios**:

1. **Given** the book section, **When** rendered, **Then** the CTA column is vertically centred in
   the section and the middle line is adjusted per design.

### User Story 8 — Footer links match the menu (Priority: P3)

The footer's primary navigation links are identical to the header menu, sourced from the single
`siteNav` definition (`lib/nav.ts`), not a separate hardcoded list.

**Independent Test**: The footer's primary links equal the header menu (labels + hrefs); editing the
menu updates both.

**Acceptance Scenarios**:

1. **Given** the footer, **When** rendered, **Then** its primary links equal the header menu
   (Solutions, Insights, …) sourced from `siteNav`; the legacy `mainLinks` anchors (e.g.
   `/#approach`, `/#people`) that point at hidden sections are gone.

### Edge Cases

- CMS returns fewer cases than card slots → defined partial/empty state (`002` FR-104).
- A final homepage image not yet delivered → keep placeholder, keep on the pending list (SC-503).
- Video autoplay blocked by the browser → poster remains; no console-breaking behaviour.
- Footer↔menu parity must survive future menu edits → both read from the same resolved nav source.

## Requirements *(mandatory)*

**Homepage content**

- **FR-401**: The homepage Client-Impact cards MUST be sourced from the CMS (replacing the hardcoded
  `cases` array in `app/page.tsx`), each linking to its real `/cases/[slug]`; boundary-validated and
  fail-safe on empties (`002` FR-104).

**Testimonials video**

- **FR-402**: The homepage MUST show a rapid-cut testimonials video section immediately before the
  Client-Impact (`#impact`) section, with the agreed heading, autoplay-muted-loop + `playsInline`,
  a poster shown until ready and as the failure fallback, loaded so as not to harm initial paint.
- **FR-403**: The video MUST NOT autoplay under `prefers-reduced-motion` (poster + play control) and
  MUST be keyboard-operable if interactive.

**Impact numbers**

- **FR-404**: The credibility stats MUST render their leading mark so no value reads as a negative
  number (lower underline near the number, or a small arrow; or remove the mark entirely).

**Awards strip**

- **FR-405**: The homepage MUST include an awards/credentials logo section, with optimised logos,
  linking to the fuller awards/"Our Identity" page (owned by `009`).

**Imagery**

- **FR-406**: Homepage placeholder images MUST be replaceable with final assets without layout
  shift, at correct aspect ratios with `alt`; undelivered slots keep the placeholder and are tracked
  on a pending list; CMS-driven images use an allow-listed delivery domain (`next.config.mjs`).

**People / leadership**

- **FR-407**: People cards (home `PeopleGrid` and `/solutions/leadership`) MUST render at a uniform
  fixed height, top-aligned (no stair-step), with the full bio available in the existing pop-up.
- **FR-408**: The LinkedIn icon on people cards MUST be enlarged per design.
- **FR-409**: The person photo with an off-pattern background MUST be corrected to match the standard
  (pending the high-res asset).

**Book**

- **FR-410**: The book section CTA MUST be vertically centred within the section, with the middle
  line/layout adjusted per design.

**Footer**

- **FR-411**: The footer's primary navigation links MUST match the header menu, sourced from the
  single `siteNav` definition in `lib/nav.ts` (not a separate hardcoded array); legal/utility links
  remain.

### Key Entities

No new content entities (owned by the CMS `001`, consumed via `002`). New: a homepage video asset
reference (external/hosted per `001`) and a tracked pending-image list.

## Success Criteria *(mandatory)*

- **SC-401**: The homepage Client-Impact section has 0 hardcoded case data; every card links to a
  valid CMS `/cases/[slug]` for published cases.
- **SC-402**: The testimonials video renders immediately before `#impact`, autoplays muted (or
  poster under reduced-motion), and degrades to a poster on failure.
- **SC-403**: No stat in the credibility section reads as a negative number.
- **SC-404**: An awards/credentials logo strip is present on the home and links to the awards page.
- **SC-405**: All final homepage image slots render at correct ratio/`alt` with 0 CLS; the pending
  list is empty at launch or explicitly signed off.
- **SC-406**: People cards are pixel-uniform in height and top-aligned; the LinkedIn icon is enlarged.
- **SC-407**: The book CTA is vertically centred; the footer primary links equal `siteNav` (verified
  to read from the same source).

## Assumptions

- The CMS (`001`) is populated/being populated; the site side consumes via the existing `lib/cms/`
  client (`002`).
- The testimonials video and final imagery are client/design-partner supplied; per `001` videos are
  external/hosted.
- Map behaviour is **out of scope here** (owned by `008-maps`); the library/detail routes and the
  5H page are **out of scope here** (owned by `007-content-libraries`); the recreated logo, the
  inner/outer chart, AI imagery and the "Our Identity"/awards page are **out of scope here** (owned
  by `009-branding-assets`).

## Dependencies / open inputs — (⚠ confirm)

- The testimonials **video file/URL + poster** + final heading copy.
- Which **impact-number mark** treatment is preferred (underline vs. arrow vs. none).
- The **award logos** for the home strip + the destination page href (from `009`).
- **Final homepage images** per slot (dimensions, local vs. CMS/CDN) and the high-res leadership
  photo for FR-409.
- Confirmation that the CMS has published **cases** for the homepage (people already publish today).
