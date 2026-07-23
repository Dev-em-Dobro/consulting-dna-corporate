---
description: "Task list — Site ↔ CMS read integration (site side)"
---

# Tasks: Site ↔ CMS read integration (site side)

**Input**: Design documents from `/specs/002-site-cms-integration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/site-consumption.md

**Tests**: OPTIONAL — this feature did not request TDD. A single smoke/contract test is included in
Polish and marked optional.

**Repo**: all paths are in `consulting-dna-corporate` (this repo) unless prefixed
`[CMS-REPO]` → `E:\projetos\corporate-dna-cms` (the separate CMS project).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 (render CMS content, P1) or US2 (graceful degradation, P2)

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Add `zod` to dependencies in `package.json` and install (`npm i zod`)
- [x] T002 [P] Add Bunny CDN host to `next.config.mjs` → `images.remotePatterns` for
  `corporate-dna.b-cdn.net` (from `BUNNY_CDN_URL`)
- [x] T003 [P] Harden `lib/cms/client.ts`: normalise base URL (strip trailing `/api` and `/`) so
  endpoints resolve to `${CMS_URL}/content/...` (D8); read key as `CMS_READ_API_KEY ?? READ_API_KEY`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: US1/US2 route wiring depends on the boundary modules (T004–T006). T007 is
cross-repo and blocks **images only** (text wiring can proceed without it).

- [x] T004 Create `lib/cms/schemas.ts` — Zod schemas (optional-tolerant, `.passthrough()`): list
  item, `case`, `solution`, `insight`, `person`, `region`, singleton `page`; per verified shapes in
  `research.md` / `contracts/site-consumption.md`
- [x] T005 Create `lib/cms/map.ts` — map validated responses → view models in `data-model.md`
  (`Person`, `CaseArticle`, `CaseCard`, `Solution`, `Insight`, `Region`, `CmsPage`); list parse
  failures drop the item, detail failures signal not-found
- [x] T006 [P] Add a sanitised-HTML render helper (e.g. `components/RichText.tsx`) for the HTML body
  fields (`body`, `summary`, `problemStatement`)
- [x] T007 [P] [CMS-REPO] Resolve media in the read API: add `coverUrl` on list + detail responses
  (D9). ✅ **Done & verified 2026-07-22** — `cases` now return `coverUrl`
  (`https://corporate-dna.b-cdn.net/uploads/...webp`, CDN 200 image/webp), `coverMediaId` kept
  (backward-compatible). Note: entries with orphaned/missing media omit `coverUrl` → site falls back
  to `ImagePlaceholder` (already handled).
- [x] T008 [P] Refactor `components/PeopleGrid.tsx` to accept `people` as a prop (remove the
  hardcoded `people` array; keep the `Person`/`Social` types and the modal UI)
- [x] T009 Upgrade `app/api/revalidate/route.ts` — parses the `{type, slug}` payload and purges
  via `revalidatePath("/", "layout")`. (Next 16's `revalidateTag` now requires a cache-life profile
  and targets `"use cache"` tags, not fetch tags; a layout purge is simple, correct and adequate at
  this scale.)

**Checkpoint**: boundary (client + schemas + map) ready — route wiring can begin.

---

## Phase 3: User Story 1 — Site renders CMS-managed content (Priority: P1) 🎯 MVP

**Goal**: every content route fetches from the CMS read API and renders live content.

**Independent Test**: with the CMS reachable + populated, each route shows API data (not the old
placeholders); absent slugs 404.

- [x] T010 [P] [US1] Wire `app/solutions/page.tsx` to list the 7 offerings via
  `getList("solutions")` (title + `problemStatement` teaser, link to `/solutions/[slug]`)
- [x] T011 [P] [US1] Create `app/solutions/[slug]/page.tsx` via `getEntry("solutions", slug)`
  (title, `problemStatement`, `body` HTML, `cta`); `notFound()` on absent; `generateStaticParams`
  from the solutions list
- [x] T012 [P] [US1] Wire `app/solutions/flagship-cases/page.tsx` to list cases via `getCases()`
  (card: title, summary, cover) linking to the article slug
- [x] T013 [P] [US1] Create `app/solutions/flagship-cases/[slug]/page.tsx` via
  `getEntry("cases", slug)` → article template (tags from `facets`, headline, intro, `clientQuote`,
  `videoUrl` CTA, body = challenge/approach/outcome/measurableResult); `notFound()` on absent
- [x] T014 [P] [US1] Wire `app/solutions/case-library/page.tsx` via `getCases(facets)` with facet
  filters; show the documented empty state while `< 10` cases
- [x] T015 [P] [US1] Wire people into `app/solutions/leadership/page.tsx` and the `/v1` People
  section via `getList("people")` → `PeopleGrid` (empty state when 0)
- [x] T016 [P] [US1] Wire `app/solutions/regions/page.tsx` + `app/solutions/regions/[region]/page.tsx`
  via `getList("regions")` / `getEntry("regions", slug)`; derive params from the API, keep
  `lib/nav.ts` static slugs as build fallback
- [x] T017 [P] [US1] Wire `app/solutions/5h-framework/page.tsx` via `getPage("5h")` (graceful when
  the singleton is 404 — keep placeholder until authored)
- [x] T018 [P] [US1] Wire `app/book/page.tsx` via `getPage("book")` incl. the "Buy on Amazon" CTA
  block
- [x] T019 [P] [US1] Wire `app/awards/page.tsx` via `getPage("awards")`
- [x] T020 [P] [US1] Wire `app/insights/page.tsx` via `getList("insights")` (card list)
- [x] T021 [P] [US1] Create `app/insights/[slug]/page.tsx` via `getEntry("insights", slug)`
  (title, `body` HTML); `notFound()` on absent
- [x] T022 [US1] Confirm every route fetches **server-side** with cache tags (via `client.ts`) and
  no key reaches the client bundle

**Checkpoint**: US1 functional — CMS content renders across all wired routes (images pending T007).

---

## Phase 4: User Story 2 — Graceful behaviour when CMS is unavailable (Priority: P2)

**Goal**: cached routes survive CMS downtime; missing entries 404; unexpected shapes fail safe.

**Independent Test**: point `CMS_URL` at an unreachable host after a build → cached routes still
serve; a cold detail fetch 404s; a malformed item is skipped, not crashed.

- [x] T023 [US2] Add empty/error states to each collection route (people, regions, cases, insights,
  solutions) — no crash on `total: 0`
- [x] T024 [US2] Ensure all detail routes call `notFound()` for absent/unpublished/malformed slugs
  (no draft leakage; FR-105)
- [x] T025 [US2] Add a fetch fallback in `lib/cms/client.ts` (null on network error) + a modest
  time-based `revalidate` safety net so previously-built routes serve last-good on CMS downtime

**Checkpoint**: US1 + US2 both hold independently.

---

## Phase 5: Polish & Cross-Cutting

- [x] T026 [P] Replace `ImagePlaceholder` with real `next/image` on routes where `coverUrl` is now
  available (after T007 deployed); keep placeholder fallback when absent
- [ ] T027 [P] (Optional — SKIPPED) Add Vitest + a smoke/contract test that hits the read API and
  asserts the `lib/cms/schemas.ts` shapes. Intentionally deferred: optional, and it would add test
  tooling not otherwise present. The live-probe + quickstart sweep (T029) validated the shapes.
- [x] T028 Security check (SC-102): `npm run build` then grep `.next/static` for `x-api-key` /
  `postgres` / the key — must be clean
- [x] T029 Run `quickstart.md` validation across all routes (per-route checklist + degradation)
- [x] T030 [P] Update `specs/002-site-cms-integration/` status to reflect delivery

---

## Dependencies & Execution Order

- **Setup (T001–T003)**: start immediately; T002/T003 parallel.
- **Foundational (T004–T009)**: after Setup. T004→T005 sequential (map uses schemas); T006/T007/T008
  parallel; T009 independent. T007 is cross-repo and blocks only images.
- **US1 (T010–T022)**: after T004–T005 (+T006 for HTML, +T008 for people). T010–T021 are largely
  parallel (different files); T022 after them.
- **US2 (T023–T025)**: after US1 routes exist (refines them).
- **Polish (T026–T030)**: after US1 (T026 also after T007 deploy).

### Parallel example (US1)

```text
# After the boundary (T004–T006, T008) is ready, wire routes in parallel:
T010 solutions list · T012 flagship list · T014 case-library · T015 people ·
T016 regions · T017 5h · T018 book · T019 awards · T020 insights list
# Detail routes in parallel too:
T011 solutions/[slug] · T013 cases/[slug] · T021 insights/[slug]
```

---

## Implementation Strategy

### MVP (US1 only)

1. Phase 1 Setup → 2. Phase 2 Foundational (T004–T006, T008–T009; T007 in parallel in the CMS repo)
→ 3. Phase 3 US1 → 4. **STOP & VALIDATE** each route renders CMS content → 5. demo.

Text content renders even before T007; images light up once the CMS media-resolution deploys.

### Incremental

US1 (live content) → US2 (resilience/empty/404) → Polish (real images, security grep, quickstart).

---

## Notes

- `[P]` = different files, no incomplete-dependency.
- Boundary is isolated in `lib/cms/*`; components stay presentational (fed by props).
- Empty collections (people/regions) and 404 singletons (5h/book/awards) render graceful
  placeholders until authored in the CMS — not failures.
- The only cross-repo task is **T007** (CMS media resolution).
