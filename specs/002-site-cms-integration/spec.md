# Feature Specification: Site ↔ CMS read integration (site side)

**Feature Branch**: `002-site-cms-integration`

**Created**: 2026-07-22

**Status**: Implemented — US1 + US2 delivered 2026-07-22 (build green, 30 routes; live-verified
against the CMS at `:3010`). Optional Vitest smoke test (T027) deferred. See `tasks.md`.

**Input**: User description: "precisamos integrar o site com o CMS, o banco de dados já está
no .env.local — cria um plano de implementação". Clarified decisions (2026-07-22): consume the
**separate CMS's HTTP read API** (not the database directly); the CMS database **already has
schema + published content**; scope of this delivery is **read-only on the site**.

## Overview

The marketing site (this repo) currently renders **hardcoded** content: leadership profiles live
in `components/PeopleGrid.tsx`, and the new Solutions / 5H / case / regions / book / awards /
insights routes are **scaffold placeholders**. This feature replaces that hardcoded/placeholder
content with **live content fetched from the custom CMS's published read API**, so editors can
change what the site shows without a code change.

Per spec `001-custom-cms` (FR-001/FR-004) the CMS is a **separate project**; the site integrates
**only over the HTTP read API + revalidation webhook** and never connects to the CMS database or
admin. This feature is the site-side realisation of `001`'s User Story 2 ("Site consumes CMS
content over an API"). It is **read-only**: no authoring, no admin, no writes from the site.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Site renders CMS-managed content (Priority: P1)

Every content-backed route on the site fetches its content from the CMS read API at build/request
time and renders it, instead of using hardcoded values.

**Independent Test**: With the CMS read API reachable and populated, load each content route and
confirm the rendered values match what the API returns (not the old placeholders).

**Acceptance Scenarios**:

1. **Given** published people exist in the CMS, **When** the homepage People section and
   `/solutions/leadership` render, **Then** the cards/pop-ups show the CMS people (name, role, bio,
   photo, socials), not the hardcoded array.
2. **Given** a published singleton page (5H, book, awards), **When** its route renders, **Then** it
   shows the CMS copy/media for that page.
3. **Given** a published case study, **When** its article route renders, **Then** it shows the CMS
   tags, headline, intro, quote, video link and body.
4. **Given** a draft or deleted entry, **When** the site requests it, **Then** it is **not** shown
   (relies on the read API never returning non-published — SC-003 of 001).

### User Story 2 — Graceful behaviour when the CMS is unavailable (Priority: P2)

The site keeps serving the last successfully fetched content and degrades gracefully if the CMS
read API is briefly unreachable; a missing single entry yields a proper 404, not a crash.

**Independent Test**: Point the site at an unreachable CMS URL and confirm cached pages still serve
and a cold single-entry fetch returns not-found rather than a 500.

**Acceptance Scenarios**:

1. **Given** previously cached content, **When** the CMS is unreachable, **Then** cached routes
   still render (no hard failure).
2. **Given** a slug that is unpublished/absent, **When** its detail route is requested, **Then** the
   site responds 404 via `notFound()` with no draft leakage.

### Edge Cases

- CMS returns a shape the site doesn't expect (missing/extra field) → the site validates at the
  boundary and fails safe (skip the item / 404 / fallback), never renders `undefined`.
- Media URL points at a domain not allowed by `next/image` → images must be configured
  (`remotePatterns`) or they won't render.
- Empty collections (e.g. case-study library with < 10 cases) → show a documented empty state.

## Requirements *(mandatory)*

- **FR-101**: The site MUST fetch all content-backed routes from the CMS **published read API**
  over HTTP; it MUST NOT connect to the CMS database or admin (upholds 001 FR-004).
- **FR-102**: The site MUST use server-side fetching only; the read API key MUST NOT reach the
  client bundle.
- **FR-103**: Each content route MUST map to the read-API endpoint(s) defined in
  `001-custom-cms/contracts/read-api.md` (see this feature's `contracts/site-consumption.md`).
- **FR-104**: The site MUST validate/parse CMS responses at the boundary and fail safe on
  unexpected shapes (no runtime crash, no `undefined` rendered).
- **FR-105**: Single-entry routes MUST return 404 (`notFound()`) for absent/unpublished slugs; no
  draft/deleted content may render.
- **FR-106**: Content MUST be cached with tag-based revalidation so the existing
  `app/api/revalidate` webhook can refresh affected content on publish (revalidation wiring itself
  is pre-existing; this feature only ensures fetches are tagged).
- **FR-107**: The site MUST degrade gracefully when the CMS is briefly unavailable (serve cached
  content; documented empty/error states).
- **FR-108**: Configuration MUST be via environment (`CMS_URL`, `CMS_READ_API_KEY`); the site repo
  MUST NOT carry the CMS **database** credentials (FR-004) — `DATABASE_URL` does not belong here.

### Content routes in scope

Homepage People section (`/v1`), `/solutions` (editorial), `/solutions/5h-framework`,
`/solutions/flagship-cases` (+ `[slug]`), `/solutions/case-library`, `/solutions/leadership`,
`/solutions/regions` (+ `[region]`), `/book`, `/awards`, `/insights` (+ `[slug]`).

## Success Criteria *(mandatory)*

- **SC-101**: 100% of the routes in scope render CMS content with zero hardcoded content arrays
  remaining for those routes.
- **SC-102**: No read API key or DB credential appears in the client bundle (verified).
- **SC-103**: Every single-entry route returns 404 for an unpublished/absent slug (0 draft leaks).
- **SC-104**: With the CMS unreachable, all previously built routes still serve (no 5xx from cache).
- **SC-105**: Publishing a change in the CMS refreshes the corresponding site route within one
  revalidation cycle.

## Assumptions

- The CMS read API (per `001`) is **deployed and reachable**, its base URL will be provided as
  `CMS_URL`, and it is authorised via `x-api-key` using the value currently in `.env.local`.
- The CMS database already holds published content following `001`'s data model; the site only
  reads it through the API.
- Media is delivered from a CDN (Bunny.net) / the CMS's own delivery URLs; those domains will be
  allow-listed for `next/image`.
- This delivery is read-only; authoring/admin is out of scope (owned by the separate CMS project).

## Dependencies / open inputs (from the user)

- **`CMS_URL`** — the deployed CMS read-API base URL (not yet in `.env.local`).
- Confirmation of the **read-API key env var name** (`.env.local` has `READ_API_KEY`; the client
  expects `CMS_READ_API_KEY`) — reconcile.
- The **media delivery domain(s)** for `next/image` allow-listing.
- Whether "flagship" vs "library" cases are distinguished by a flag/facet in the API.
