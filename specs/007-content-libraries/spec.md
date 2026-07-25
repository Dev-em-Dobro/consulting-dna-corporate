# Feature Specification: Content libraries redesign (Cases, Insights, Methodologies) & detail pages

**Feature Branch**: `007-content-libraries`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Client meeting fixes (`fixes-reuniao-24-07`) — the "3 content libraries" redesign:
richer Cases library (brand-coloured logo cards), a lighter Insights library with reading time, a
new Methodologies library, redesigned Insight and Case detail pages, a single robust case-logo
treatment, and a more explanatory (deliberately code-owned) 5H® page. All content-backed views
continue to consume the CMS through the existing read-only `lib/cms/` layer.

## Overview

The site already renders three content areas from the CMS: `/cases` (a rich library with
search + tag filter + date sort, see `components/cases/CasesLibrary.tsx`), `/insights` (a plain
text list) and the Solutions pages. The client meeting asked for these to become **three visually
distinct but structurally consistent content libraries**, plus polished detail pages.

This feature is a **presentation-layer redesign on top of the existing read integration**
(`002-site-cms-integration`). It does **not** change the CMS-is-separate rule (`001-custom-cms`): the
site still reads over the HTTP read API via `lib/cms/` (client → Zod schema → view model) and never
touches the CMS database. Where new content fields are required (client brand colour, transparent
logo, reading time, methodology entries), they are **delivered by the CMS** and depend on
`010-cms-enhancements`; this spec defines how the site consumes them, with a graceful fallback when
a field is absent so nothing regresses before `010` ships.

Concretely, the feature covers: (1) the Cases library card redesign; (2) the Insights library
redesign; (3) the Insight detail page redesign; (4) a new Methodologies library; (5) a single,
resolution-robust case-detail logo treatment; (6) a more explanatory 5H® framework page kept as
code (not CMS-managed, by decision); and (7) removing any remaining hardcoded placeholders from
the Solutions pages.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Cases library with brand-coloured logo cards (Priority: P1)

A visitor browsing `/cases` sees each case as a card showing the **client's logo in perspective**
over a gradient in that **client's brand colour**, can **search**, **filter by tag** and **sort by
date**, and each card's "read more" is clickable through to the case.

**Why this priority**: The cases library is the firm's primary proof-of-work surface and the most
requested redesign in the meeting; the search/filter/sort scaffolding already exists, so this
delivers visible value first.

**Independent Test**: Load `/cases` with published cases; confirm each card renders the client logo
on a brand-colour gradient, that search + tag filter + date sort narrow the list correctly, and
that "read more" navigates to the corresponding `/cases/[slug]`.

**Acceptance Scenarios**:

1. **Given** a published case with a brand colour and a transparent-PNG logo from the CMS, **When**
   `/cases` renders, **Then** its card shows the logo in perspective over a gradient in the case's
   brand colour, with a clickable "read more".
2. **Given** a case whose brand colour and/or logo is absent (pre-`010`), **When** its card renders,
   **Then** it falls back to a neutral brand-token gradient and the existing cover/title treatment
   (no broken image, no missing card).
3. **Given** a search term, a selected tag and a date sort, **When** applied, **Then** the visible
   cards match all active criteria and the order reflects the chosen sort.

### User Story 2 — Insights library, lighter and scannable (Priority: P2)

A visitor on `/insights` sees a lighter layout — each item shows **title, image, author, date and
reading time** — and can **filter by tag** and **by date**.

**Why this priority**: Insights is currently a plain text list; a lighter, richer layout materially
improves the reading surface but is independent of the cases work, so P2.

**Independent Test**: Load `/insights` with published insights; confirm each item shows title,
image, author, date and reading time, and that the tag and date filters narrow the list.

**Acceptance Scenarios**:

1. **Given** published insights with author and cover image, **When** `/insights` renders, **Then**
   each item shows title, image, author, date and reading time.
2. **Given** reading time is not provided by the CMS, **When** an item renders, **Then** reading
   time is **computed** from the body word count (recommended default), so the field is always
   present.
3. **Given** the tag and date filters, **When** a visitor selects them, **Then** the list narrows
   to matching insights (empty state shown when none match).

### User Story 3 — Insight detail page in the Solutions layout (Priority: P2)

A visitor opening an insight sees a detail page that **follows the Solutions page layout** (title,
text, image, banner), with the **cover image carrying a gradient overlay** on top.

**Why this priority**: Completes the Insights redesign end-to-end; depends only on the same CMS
insight data, so P2 alongside US2.

**Independent Test**: Open an `/insights/[slug]` for a published insight; confirm the page uses the
Solutions detail layout (title, rich-text body, image, banner) and that the cover shows a gradient
overlay; confirm an unpublished/absent slug returns 404.

**Acceptance Scenarios**:

1. **Given** a published insight, **When** `/insights/[slug]` renders, **Then** it shows the
   Solutions-style layout (title, body, image, banner) with a gradient overlay on the cover.
2. **Given** an unpublished or absent slug, **When** requested, **Then** the route returns
   `notFound()` with no draft leakage (upholds `002` FR-105).

### User Story 4 — Methodologies library alongside Cases and Insights (Priority: P3)

A visitor can browse a third **Methodologies library** whose cards are rendered in **16:9**; the
three libraries (Cases, Insights, Methodologies) are **visually differentiated** while sharing the
same internal modularity and structure.

**Why this priority**: A net-new library that rounds out the "three libraries" vision; it depends on
the taxonomy/content-type decision (see open inputs) so it is sequenced last.

**Independent Test**: Load the Methodologies library route; confirm cards render in 16:9, that the
library is visually distinct from Cases and Insights, and that it reuses the shared library
structure (filter/sort island + card grid).

**Acceptance Scenarios**:

1. **Given** published methodologies, **When** the library renders, **Then** each card is 16:9 and
   the library is visually distinguishable from the Cases and Insights libraries.
2. **Given** no methodologies are published yet, **When** the route renders, **Then** a documented
   empty state is shown (no crash).

### Edge Cases

- A case has a brand colour but no transparent logo (or vice-versa) → the card degrades to the
  neutral fallback gradient and text treatment, never a broken/half-styled card.
- An extreme brand colour (near-white / very low contrast) → the gradient and any overlaid text
  keep legible contrast (a tint/darken step, not the raw hex).
- Reading time for an insight with no body → shows a sensible minimum (e.g. "1 min read") rather
  than "0 min".
- The case-detail logo at very small and very large viewports → one defined size/treatment must
  hold across all resolutions (no clipping, no oversized logo — the current defect).
- CMS omits a new field (brand colour, logo, author, reading time, methodology type) → the site
  fails safe per `002` FR-104 (skip/fallback, never render `undefined`).
- Methodologies as a curated set that includes 5H® → the 5H® card must link to the code-owned
  `/solutions/5h-framework` page, not to a CMS entry.

## Requirements *(mandatory)*

**Cases library**

- **FR-501**: `/cases` MUST render each case as a card showing the client's transparent-PNG logo in
  perspective over a gradient in the client's brand colour, with a clickable "read more" to
  `/cases/[slug]`.
- **FR-502**: When a case's brand colour or logo is absent, the card MUST fall back to a neutral
  brand-token gradient and the existing cover/title treatment (no broken image, no dropped card).
- **FR-503**: `/cases` MUST retain in-browser search, tag ("content") filter and date sort over the
  server-provided case list (preserve the existing `CasesLibrary` behaviour).

**Insights library**

- **FR-504**: `/insights` MUST render each item with title, cover image, author, date and reading
  time in a lighter layout than the current text list.
- **FR-505**: `/insights` MUST provide a tag filter and a date filter/sort over the insight list.
- **FR-506**: Reading time MUST be shown for every insight — read from the CMS if provided, else
  computed from the body word count (deterministic, server-side).

**Insight detail**

- **FR-507**: `/insights/[slug]` MUST render in the Solutions detail layout (title, rich-text body,
  image, banner) with a gradient overlay on the cover image.
- **FR-508**: `/insights/[slug]` MUST return `notFound()` for absent/unpublished slugs (no draft
  leak), consistent with `002` FR-105.

**Methodologies library**

- **FR-509**: The site MUST provide a Methodologies library alongside Cases and Insights, with cards
  rendered in 16:9.
- **FR-510**: The three libraries MUST be visually differentiated while sharing one internal
  library structure (a common filter/sort island + card-grid pattern parameterised per library).
- **FR-511**: The Methodologies library MUST show a documented empty state when nothing is published.

**Case-detail logo**

- **FR-512**: The case detail page MUST render the top-right client logo at a **single defined
  size/treatment** that works across all resolutions (no clipping or oversizing), sourced from the
  CMS logo field (coordinate with `010-cms-enhancements`).

**5H® framework page**

- **FR-513**: `/solutions/5h-framework` MUST be more explanatory — foregrounding the methodology and
  using AI-generated images — and MUST remain **code-owned (not CMS-managed)** for lower break-risk
  and a bespoke layout.

**Solutions content**

- **FR-514**: The Solutions pages MUST render CMS content with **no hardcoded placeholders**
  remaining (completing `002` SC-101 for these routes).

**Cross-cutting**

- **FR-515**: All new CMS-sourced fields (brand colour, transparent logo, author, reading time,
  methodology entries) MUST be validated at the boundary (Zod, `.passthrough()`) and fail safe when
  absent (upholds `002` FR-104); the site MUST NOT connect to the CMS database (`001` FR-004).
- **FR-516**: Any new image host (e.g. transparent-logo delivery domain, if not already
  `corporate-dna.b-cdn.net`) MUST be allow-listed in `next.config.mjs` `images.remotePatterns`.

### Key Entities *(include if feature involves data)*

- **Case card (extended)**: existing `CaseListEntry` plus **brand colour** (hex) and **transparent
  logo URL** for the perspective/gradient card. Both optional until `010` (fallback per FR-502).
- **Insight (extended)**: existing insight fields plus **author**, **cover image** and **reading
  time** (stored or computed). Powers both the library card and the detail page.
- **Methodology**: a library entry (title, cover in 16:9, tags/summary, slug) — either a new CMS
  content type or a curated set including the code-owned 5H® (see open inputs). Consumed via
  `lib/cms/` like the other collections.

## Success Criteria *(mandatory)*

- **SC-501**: 100% of `/cases` cards render a brand-coloured logo card when brand colour + logo are
  present, and a clean fallback card when they are absent (0 broken/half-styled cards).
- **SC-502**: `/cases` search + tag filter + date sort return correct results for every combination
  tested (no regressions vs. current behaviour).
- **SC-503**: 100% of `/insights` items show title, image, author, date and reading time; reading
  time is present on every item (stored or computed).
- **SC-504**: Every `/insights/[slug]` renders the Solutions-style layout with a cover gradient
  overlay; 100% of absent/unpublished slugs return 404 (0 draft leaks).
- **SC-505**: The Methodologies library renders 16:9 cards and is visually distinct from Cases and
  Insights, while reusing the shared library structure.
- **SC-506**: The case-detail logo renders correctly (no clipping/oversizing) across mobile, tablet
  and desktop breakpoints at one defined treatment.
- **SC-507**: `/solutions/5h-framework` remains code-owned and no Solutions route renders a
  hardcoded placeholder (verified).

## Assumptions

- The Cases library search/filter/sort island (`components/cases/CasesLibrary.tsx`) is the pattern to
  generalise across the three libraries; brand-colour + logo are additive to its card.
- Brand colour is a single hex per case and the logo is a transparent PNG, both delivered by the CMS
  read API (`010`); before `010`, the site uses the FR-502 fallback so nothing regresses.
- Reading time defaults to **computed** (≈200 words/min) unless the CMS provides an explicit value.
- The 5H® page is intentionally **not** CMS-managed — kept in code for a bespoke, low-break-risk
  layout (explicit meeting decision).
- Detail pages reuse the existing `002` view components/layout (`CaseView`, Solutions layout) rather
  than introducing a new rendering stack.
- British/en spelling ("organisation", "colour") consistent with existing specs.

## Decisions (approved by the user, 2026-07-24)

- **Reading time = computed on the site** (≈200 words/min from the body). Not a CMS field (FR-506).
- **Methodologies library = DEFERRED — not now.** US4 / FR-509–FR-511 (the 16:9 Methodologies
  library and its taxonomy decision) are out of scope for this round; revisit later. The 5H® page
  (FR-513) stays code-owned regardless.
- **Tags = real, structured tags (not free-derived).** Cases and insights need a proper tag field so
  tag-based search/filter works reliably later — implement tags as an actual taxonomy, coordinated
  with `010-cms-enhancements` for the CMS side. (Refines FR-503/FR-505.)
- **Insight-detail banner = DEFERRED — don't touch now.** The insight detail can still adopt the
  Solutions-style title/body/image + cover gradient (FR-507), but the **banner** element is left as
  is for now; skip mirroring the Solutions `bannerUrl` treatment in this round.

### Still needed from other specs / inputs

- **`010-cms-enhancements`** supplies case **brand colour** + **transparent logo**, insight
  **author**, and the **real tag** field. This feature consumes them with FR-502 fallbacks until
  `010` ships.
- **`009-branding-assets`** supplies the AI imagery for the 5H® page and brand-gradient tokens.
- **Brand-colour / logo** exact format + host — defer to `010`.
