# Implementation Plan: Site ↔ CMS read integration (site side)

**Branch**: `002-site-cms-integration` | **Date**: 2026-07-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-site-cms-integration/spec.md`

**Depends on**: `001-custom-cms` — reuses its published read-API contract
([read-api.md](../001-custom-cms/contracts/read-api.md)) and data model.

## Summary

Wire the marketing site's content routes to the **custom CMS's published read API** so editors
control what the site shows without code changes. The site fetches **server-side only** through the
existing thin `lib/cms/client.ts` (typed fetchers with tag-based caching), validates responses at
the boundary, maps them to the already-built page components, and falls back gracefully when the
CMS is briefly unavailable. **No database access from the site** (upholds 001 FR-004); **read-only**
(no authoring). The revalidation webhook receiver (`app/api/revalidate/route.ts`) already exists;
this plan only ensures fetches are tagged so it can refresh them.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, Server Components, `fetch` with `next.tags`) ·
React 19 · Tailwind 4 (existing). **Add**: `zod` (boundary validation of CMS responses). **No** DB
driver / Supabase client is added to the site (FR-004).

**Data access**: HTTP GET to the CMS read API via `lib/cms/client.ts` (`getList`, `getCases`,
`getEntry`, `getPage`). All calls are server-side (Server Components / route handlers); the
`x-api-key` never reaches the client. Caching via `next: { tags: [...] }`; invalidation via the
existing publish webhook → `revalidateTag`/`revalidatePath`.

**Storage**: none in the site. Content lives in the CMS's Postgres (Supabase) **behind the API**;
media on the CMS/CDN delivery URLs.

**Testing**: Vitest (unit — response parsers/mappers) · a contract smoke test that hits the live
read API and asserts shapes against the site's Zod schemas · manual quickstart per route. (Test
tooling is not yet in the repo; adding Vitest is part of tasks.)

**Target Platform**: Vercel (Fluid Compute) — the existing site deployment. Env-configured
`CMS_URL`, `CMS_READ_API_KEY`, `CMS_WEBHOOK_SECRET`.

**Project Type**: Web (Next.js App Router site) consuming an external read API.

**Performance Goals**: content routes render from cache; cold fetch p95 bounded by the CMS read API
(001 targets p95 < 200ms). Site does the visitor-facing caching; per-visitor load does not hit the
CMS thanks to tag-cached fetches + ISR.

**Constraints**: HTTP-only, no DB in the site (FR-004/FR-101); key server-only (FR-102); no draft
leakage (FR-105, relies on 001 SC-003); graceful degradation on CMS downtime (FR-107); the site
repo must not carry `DATABASE_URL` (FR-108).

**Scale/Scope**: ~13 routes/sections, single content editor team, ~5,000 visits/month — read load
dominated by build/revalidation, not per-visit.

## Phase 0 resolution (all clarifications closed — see research.md)

1. `CMS_URL` = `http://localhost:3010/api` ✅ · key standardised to `CMS_READ_API_KEY` ✅ ·
   media host `BUNNY_CDN_URL=https://corporate-dna.b-cdn.net` ✅ · `DATABASE_URL` removed ✅.
2. **Base path**: `client.ts` normalises `CMS_URL` (strips trailing `/api`) → endpoints
   `${CMS_URL}/content/...` (D8).
3. **Media**: read API returns `coverMediaId`, not a URL → **CMS-side fix** to resolve
   `coverUrl = ${BUNNY_CDN_URL}/${bunny_path}` inline (D9); cross-repo task in `corporate-dna-cms`.
   Site image slots use `ImagePlaceholder` until deployed.
4. **`/solutions`** lists the 7 real `solutions` offerings + new `/solutions/[slug]` (D10).
5. **Body fields are HTML** (`body`, `summary`, `problemStatement`) → render sanitised HTML.
6. **Empty today**: `people` (0), `regions` (0), `pages/5h|book|awards` (404) → those routes render
   graceful empty/placeholder until authored in the CMS. `cases`/`insights` are test data.
7. **Cross-repo dependency**: the CMS media-resolution change lives in `E:\projetos\corporate-dna-cms`
   (separate repo/deploy); it is a prerequisite for images but not for text wiring.

## Constitution Check

*GATE: Must pass before Phase 0. Re-check after Phase 1.*

The project constitution (`.specify/memory/constitution.md`) is still the **unratified template**
(placeholders) — no binding gates. As `001` did, this plan self-imposes the relevant non-negotiables
as gates:

| Self-imposed gate | Status |
|---|---|
| Site never touches CMS DB/admin — HTTP read API only (FR-004/FR-101) | PASS — no DB driver added; `lib/cms/client.ts` HTTP only |
| Read API key is server-only, never in client bundle (FR-102) | PASS — fetches in Server Components / route handlers |
| No draft/deleted leakage (FR-105) | PASS — relies on 001 published API + `notFound()` on absent slugs |
| Graceful degradation on CMS downtime (FR-107) | PASS — tag-cached fetches serve last-good; documented empty/error states |
| Simplicity / no premature complexity | PASS — one thin client, Zod at the boundary, no new infra |
| Site repo carries no DB credentials (FR-108) | ACTION — remove `DATABASE_URL` from site `.env.local` |

No violations requiring justification. **Recommendation**: run `/speckit-constitution` to ratify a
real constitution before implementation (not blocking).

## Project Structure

### Documentation (this feature)

```text
specs/002-site-cms-integration/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (decisions + open inputs)
├── data-model.md        # Phase 1 — site-side view models + response→component mapping
├── quickstart.md        # Phase 1 — how to validate each route end-to-end
└── contracts/
    └── site-consumption.md   # Which read-API endpoint each route calls + expected shape
```

### Source code (this repo — the marketing site)

```text
consulting-dna-corporate/
├── lib/cms/
│   ├── client.ts                 # EXISTS — typed read-API fetchers (getList/getCases/getEntry/getPage)
│   ├── schemas.ts                # NEW — Zod schemas per content type (boundary validation)
│   └── map.ts                    # NEW — CMS response → component props (Person, CaseArticle, PageX, Region, Insight)
├── app/
│   ├── api/revalidate/route.ts   # EXISTS — webhook receiver (ensure tag-based revalidation)
│   ├── v1/page.tsx               # CHANGE — People section from getList('people')
│   ├── solutions/page.tsx        # CHANGE — list the 7 `solutions` offerings (getList('solutions'))
│   ├── solutions/[slug]/page.tsx # NEW — getEntry('solutions', slug): problemStatement/body/cta
│   ├── solutions/5h-framework/page.tsx     # CHANGE — getPage('5h')
│   ├── solutions/flagship-cases/page.tsx   # CHANGE — list flagship cases
│   ├── solutions/flagship-cases/[slug]/page.tsx  # NEW — getEntry('cases', slug) article
│   ├── solutions/case-library/page.tsx     # CHANGE — getCases(facets) (empty state < 10)
│   ├── solutions/leadership/page.tsx       # CHANGE — getList('people') → PeopleGrid
│   ├── solutions/regions/page.tsx          # CHANGE — getList('regions')
│   ├── solutions/regions/[region]/page.tsx # CHANGE — getEntry('regions', slug)
│   ├── book/page.tsx             # CHANGE — getPage('book')
│   ├── awards/page.tsx           # CHANGE — getPage('awards')
│   ├── insights/page.tsx         # CHANGE — getList('insights')
│   └── insights/[slug]/page.tsx  # NEW — getEntry('insights', slug) article
├── components/
│   └── PeopleGrid.tsx            # CHANGE — accept people as props instead of the hardcoded array
└── next.config.mjs              # CHANGE — images.remotePatterns for CMS/CDN media domains
```

**Structure Decision**: Keep the existing thin-client boundary. Add two small modules
(`lib/cms/schemas.ts`, `lib/cms/map.ts`) so every CMS response is parsed/validated once and mapped
to the props the already-built components expect — components stay presentational and untouched in
shape (e.g. `PeopleGrid` simply receives `people` instead of importing them). This isolates all
CMS coupling to `lib/cms/*` and each route's server component.

## Phasing

- **Phase 0 (research.md)** — resolve the NEEDS CLARIFICATION: obtain `CMS_URL`, reconcile the key
  env var, discover media domains + exact shapes for people/regions/insights/solutions by probing
  the live API, decide flagship-vs-library split, decide caching (tags + time) strategy.
- **Phase 1 (data-model.md, contracts/, quickstart.md)** — define the site-side view models and the
  response→component mapping; the per-route consumption contract; the validation runbook.
- **Phase 2 (tasks.md — via `/speckit-tasks`, not here)** — implement: add `zod`; `schemas.ts` +
  `map.ts`; wire each route (Server Components) with tags + `notFound()`; add `[slug]` routes;
  `remotePatterns`; refactor `PeopleGrid` to props; env + `.env.local` cleanup; smoke/contract test.

## Complexity Tracking

> No Constitution violations to justify. The design deliberately adds the minimum: one dependency
> (`zod`) and two small `lib/cms` modules. No database client, no new services, no infra. The only
> new routes (`[slug]` for cases and insights) are required by the article format, not added
> complexity.
