# Implementation Plan: Content libraries redesign (Cases, Insights, Methodologies) & detail pages

**Branch**: `007-content-libraries` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-content-libraries/spec.md`

## Summary

A **presentation-layer redesign** of the three content libraries and their detail pages, all still
reading the CMS through the existing `lib/cms/` layer (client → Zod schema → view model), with no
new backend and no CMS-database access. The Cases library gains **brand-coloured, perspective logo
cards** (search/filter/sort preserved); Insights becomes a **lighter card library** (title, image,
author, date, reading time) with tag + date filtering and a **Solutions-style detail page** (cover
gradient overlay); a new **Methodologies library** renders 16:9 cards from the same shared library
structure. The three libraries are visually differentiated but built on **one parameterised
filter/sort island + card-grid**. The **case-detail logo** is standardised to a single
resolution-robust treatment. The **5H® page stays code-owned** (bespoke, low-break-risk, AI imagery).
New CMS fields (brand colour, logo, author, reading time, methodologies) come from
`010-cms-enhancements`; this feature consumes them with **safe fallbacks** so nothing regresses
before `010` lands.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, RSC + client islands) · React 19 · Tailwind 4
(card/gradient/overlay styling) · Zod 4 (boundary validation of new CMS fields, already a dep) ·
`next/image` (existing Bunny CDN allow-list). No new runtime dependency expected.

**Storage**: None added. Content is read from the CMS HTTP read API via `lib/cms/` (separate CMS —
`001`; the site never touches the CMS Neon DB, upholds `002` FR-101/108). Reading time, when not
CMS-provided, is **computed** on the server from body text (no storage).

**Testing**: Vitest (unit: reading-time computation, brand-colour → gradient/contrast helper, new
Zod field parsing/fallbacks, methodology mapping) · manual/Playwright smoke of each library
(search/filter/sort, card rendering) and the Insight/Case detail pages across breakpoints ·
404 check for absent insight slug.

**Target Platform**: Vercel (existing site deployment). All CMS fetches server-side; libraries are
client islands hydrated with server-provided lists (as `CasesLibrary` already is).

**Project Type**: Web application (Next.js App Router) — server components fetch + map; client
islands do filter/sort; presentational card/detail components.

**Performance Goals**: No regression to the current library routes (`revalidate = 300`). Card
gradients/overlays are CSS (no runtime image processing). Reading-time compute is O(words) at
build/request time. Logo/cover images sized via `next/image` `sizes` to avoid oversized transfers.

**Constraints**: Read-only CMS consumption; no CMS-DB access (`002`). Fail safe on any absent new
field (`002` FR-104 / this spec FR-515). Single robust logo treatment across all resolutions
(FR-512). 5H® remains code-owned (FR-513). Any new image host must be allow-listed (FR-516).

**Scale/Scope**: Three library routes + two detail-page redesigns + one new library + one code page.
Low content volume (tens of cases/insights). Shared library primitive reused three times.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is the **unratified template** — no
binding gates. Self-imposed gates for this feature:

| Self-imposed gate | Status |
|---|---|
| Read-only CMS consumption; no CMS-DB access (upholds `002` FR-101/108) | PASS — all data via `lib/cms/` |
| Fail safe on absent CMS fields (no `undefined` rendered) | PASS — Zod + documented fallbacks (FR-502/515) |
| No draft leak on detail routes | PASS — `notFound()` on absent insight slug (FR-508) |
| One shared library structure, three skins (no duplication) | PASS — parameterised island + card grid (FR-510) |
| 5H® stays code-owned by decision | PASS — captured as a constraint (FR-513) |
| No premature CMS content type | PASS — Methodologies default = curated set until `010` confirms |

No violations requiring justification. **Recommendation**: ratify a real constitution
(`/speckit-constitution`) before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/007-content-libraries/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — card design, reading time, methodologies shape, logo, 5H, deps
├── data-model.md        # Phase 1 — extended Case/Insight VMs + Methodology VM + CMS field mapping
├── contracts/
│   └── cms-consumption.md   # Phase 1 — new read-API fields consumed (coordinate w/ 010)
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── app/
│   ├── cases/
│   │   ├── page.tsx                  # MODIFY: pass brand colour + logo through to the library
│   │   └── [slug]/page.tsx           # (unchanged entry; logo treatment lives in CaseView)
│   ├── insights/
│   │   ├── page.tsx                  # MODIFY: text list → InsightsLibrary (card layout + filters)
│   │   └── [slug]/page.tsx           # MODIFY: render via Solutions-style InsightView
│   ├── methodologies/
│   │   └── page.tsx                  # NEW: Methodologies library route (16:9 cards)
│   └── solutions/
│       ├── page.tsx                  # AUDIT: no hardcoded placeholders (FR-514)
│       └── 5h-framework/page.tsx     # MODIFY: more explanatory, AI imagery — code-owned (FR-513)
├── components/
│   ├── library/
│   │   ├── LibraryShell.tsx          # NEW: shared filter/sort island + card-grid (generalised from CasesLibrary)
│   │   └── LibraryCard.tsx           # NEW: base card; skinned per library
│   ├── cases/
│   │   ├── CasesLibrary.tsx          # MODIFY: adopt LibraryShell; brand-colour logo card
│   │   └── CaseRow.tsx / CaseLogoCard.tsx  # MODIFY/NEW: perspective logo + brand-gradient
│   ├── insights/
│   │   ├── InsightsLibrary.tsx       # NEW: card library w/ tag + date filters, reading time
│   │   └── InsightCard.tsx           # NEW: title/image/author/date/reading-time card
│   ├── methodologies/
│   │   └── MethodologiesLibrary.tsx  # NEW: 16:9-card library (skinned LibraryShell)
│   └── views/
│       ├── CaseView.tsx              # MODIFY: single robust top-right logo treatment (FR-512)
│       └── InsightView.tsx           # NEW: Solutions-style detail + cover gradient overlay
└── lib/
    ├── cms/
    │   ├── schemas.ts                # MODIFY: add brandColor/logoUrl (case), author/readingTime (insight), methodology*
    │   └── map.ts                    # MODIFY: extend Case/Insight VMs; add methodology fetchers; fallbacks
    └── reading-time.ts               # NEW: deterministic words→minutes helper (used when CMS omits it)
```

New env: **none expected** — reuses `CMS_URL`, `CMS_READ_API_KEY`, `BUNNY_CDN_URL`. If `010`
delivers transparent logos from a **new** host, add it to `next.config.mjs`
`images.remotePatterns` (FR-516).

**Structure Decision**: Single Next.js app (this repo). A new `components/library/` primitive
(generalised from the existing `CasesLibrary`) backs all three libraries so they share structure but
differ only by card skin and facets. Detail-page redesigns reuse the `002` view layer (`CaseView`,
Solutions layout). All new content fields are consumed in `lib/cms/{schemas,map}.ts` with
fallbacks, keeping the CMS-separate contract intact. The 5H® page stays a bespoke code component.

## Phase 0 — research (unknowns to resolve → `research.md`)

- **Brand-colour logo card**: how the brand colour + transparent logo drive the perspective/gradient
  card, and the contrast-safe fallback when either is missing.
- **Reading time**: computed (recommended) vs. CMS-stored; the compute formula.
- **Methodologies shape**: new CMS content type vs. curated set including code-owned 5H®.
- **Case-detail logo**: one size/treatment robust across resolutions; how the logo enters via `010`.
- **Insight detail = "Solutions layout"**: exact mapping of title/text/image/banner + cover overlay.
- **5H® page**: scope of the "more explanatory" rework and AI imagery, given it stays code-owned.
- **Dependency coordination**: field names/delivery from `010-cms-enhancements`; assets from
  `009-branding-assets`.

## Complexity Tracking

> No Constitution Check violations require justification. Complexity is deliberately minimal: one
> shared library primitive skinned three ways, two detail-page redesigns reusing the existing view
> layer, additive CMS fields behind Zod with fallbacks, and one pure reading-time helper. No new
> service, no new storage, no new env beyond a possible image-host allow-list entry.
