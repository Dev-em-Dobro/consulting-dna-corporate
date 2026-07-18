---
description: "Task list for Custom Headless CMS (standalone project)"
---

# Tasks: Custom Headless CMS (standalone project)

**Input**: Design documents from `/specs/001-custom-cms/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: INCLUDED — the spec's Success Criteria (SC-003 draft-leak, SC-005 audit, SC-008 MFA),
`quickstart.md` (V1–V9) and research D10 explicitly require automated tests.

**Organization**: Tasks are grouped by user story (US1–US6) so each can be built, tested and
demoed independently.

## ⚠️ Repository note (hard constraint)

The CMS is a **separate project from the marketing site** (FR-001/FR-004). Unless a path is
prefixed `[site]`, **all paths below are in the new standalone repo `corporate-dna-cms/`**, which
has its own Vercel project + Neon DB + admin subdomain. Only the tasks marked `[site]` touch **this**
repo (`consulting-dna-corporate`), and only to add a thin read-API client + revalidation receiver.

**Confirmed CMS location (decided 2026-07-18):**
- On disk: `E:\projetos\corporate-dna-cms` (sibling of this repo, own git repository).
- Remote: new dedicated GitHub repo + new separate Vercel project (Impulse scope), own Neon DB +
  admin subdomain.
- Deploy note: HEAD commit author for CMS deploys must be `impulseaisolutions@gmail.com` (Impulse
  scope rule, same as the site).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1–US6, or SETUP / FOUND / POLISH
- File paths are exact and relative to the CMS repo root unless prefixed `[site]`.

---

## Implementation status (2026-07-18)

**All phases implemented** in the standalone repo `E:\projetos\corporate-dna-cms`
(pushed to https://github.com/Dev-em-Dobro/corporate-dna-cms). Verified: `tsc` clean, unit tests
pass (integration/e2e are guarded and run once `DATABASE_URL` / a running server exist), and
`next build` succeeds (32 routes).

- **Phase 1 Setup (T001–T007)** ✅ — repo, structure, deps, config, `.env.example`. (Vercel project
  link still pending — remote infra the client configures last.)
- **Phase 2 Foundational (T008–T016)** ✅ — Drizzle/Neon, full schema + `0000_init` migration,
  content-type registry + Zod, audit writer, custom sessions + RBAC + TOTP two-step login, HTTP
  helpers + rate limit, admin shell, seed-admin script.
- **Phase 3 US1 (T017–T024)** ✅ — entry service (versioned, publish gate), authoring + publish
  routes, generic ContentEditor, token-gated preview, unit + integration tests.
- **Phase 4 US2 (T025–T032)** ✅ — published read service (facets, locale fallback), read API
  routes, singleton endpoint, site read-client (`lib/cms/client.ts` in the site repo),
  draft-leak + facet tests.
- **Phase 5 US3 (T033–T039)** ✅ — users service + admin routes, users/audit UI, MFA + RBAC + audit
  enforced, guarded tests.
- **Phase 6 US4 (T040–T042)** ✅ — versions/restore routes + VersionsPanel + restore test.
- **Phase 7 US5 (T043–T047)** ✅ — Bunny client, media routes, media library + picker, media gate.
- **Phase 8 US6 (T048–T050)** ✅ — translation route + locale-aware read + locale test.
- **Phase 9 Polish (T051–T057)** ✅ — webhook dispatch + admin config routes, site revalidation
  receiver (`app/api/revalidate` in the site repo), Playwright scaffold, conflict test, security
  headers/CORS, editor guide + handover docs.

**Client-configured last (as agreed):** Neon DB + `DATABASE_URL`, all secrets, Bunny.net/Resend
keys, running `db:migrate` + `seed:admin`, the Vercel project, and registering the site webhook.
Then the guarded integration/e2e tests and quickstart V1–V9 can run end-to-end.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Stand up the separate CMS project skeleton.

- [~] T001 [SETUP] Create the new standalone repository `corporate-dna-cms` at
  `E:\projetos\corporate-dna-cms` (sibling of this repo, its own git repo — separate from the site
  repo) and initialize a Next.js 16 App Router + TypeScript 5.9 project (Node 24) at its root.
  Push to a new dedicated GitHub repo and link a new, separate Vercel project (Impulse scope).
  → **Done**: local git repo on `main`, Next.js base scaffolded, initial commit
  (author `impulseaisolutions@gmail.com`) pushed to
  https://github.com/Dev-em-Dobro/corporate-dna-cms.
  → **Pending**: link the separate Vercel project (Impulse scope) — do when requested.
- [x] T002 [SETUP] Create the folder structure per `plan.md`: `app/(admin)/`, `app/api/`,
  `app/preview/`, `db/schema/`, `db/migrations/`, `lib/{auth,content,media,audit,webhooks}/`,
  `contracts/`, `tests/{contract,integration,unit}/`.
- [x] T003 [P] [SETUP] Add dependencies: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`,
  `next-auth`(Auth.js v5), `otplib` (TOTP), `zod`, `@node-rs/argon2` (prebuilt, replaces `argon2`),
  `resend`; dev: `tsx`, `vitest`, `@playwright/test`. (Bunny.net has no official SDK — the media
  client in `lib/media` will use `fetch`.) `tailwindcss@4` + `@types/*` already present.
- [ ] T004 [P] [SETUP] Configure ESLint + Prettier + `tsconfig.json` (strict) and `.editorconfig`.
- [ ] T005 [P] [SETUP] Create `.env.example` with `DATABASE_URL`, `AUTH_SECRET`, `BUNNY_STORAGE_KEY`,
  `BUNNY_CDN_URL`, `RESEND_API_KEY`, `READ_API_KEY`, `PREVIEW_TOKEN_SECRET`, `WEBHOOK_SIGNING_KEY`.
- [ ] T006 [P] [SETUP] Configure Vitest (`vitest.config.ts`) and Playwright (`playwright.config.ts`)
  with a test DB URL.
- [ ] T007 [SETUP] Configure the CMS as its own Vercel project (Fluid Compute) with admin subdomain
  routing and Neon connection; document envs in `README.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure every user story depends on. **No user story can start until this
is done.**

- [ ] T008 [FOUND] Configure Drizzle + Neon serverless driver and drizzle-kit migration pipeline in
  `db/index.ts` and `drizzle.config.ts`.
- [ ] T009 [FOUND] Define base schema in `db/schema/` per `data-model.md`: `content_entries`,
  `content_versions`, `users`, `audit_log`, `media_assets`, `webhook_endpoints`,
  `case_study_facets` + enums (content_type, status, role). Generate the initial migration.
- [ ] T010 [P] [FOUND] Content-type registry + per-type Zod field schemas in `lib/content/types.ts`
  (case, solution, person, region, insight, and singleton pages) — the single source of truth for
  fields + required-field validation (FR-006).
- [ ] T011 [P] [FOUND] Central audit writer `lib/audit/log.ts` (actor, action, target, metadata) —
  the single choke-point all mutations call (FR-016, SC-005).
- [ ] T012 [P] [FOUND] Auth.js config in `lib/auth/config.ts` (Credentials provider, argon2 hashing,
  session strategy) + RBAC guard helpers `lib/auth/guards.ts` (`requireSession`, `requireAdmin`).
- [ ] T013 [FOUND] TOTP enrolment/verification in `lib/auth/totp.ts` + two-step login route handlers
  `app/api/auth/login` and `app/api/auth/mfa` (admins MUST pass TOTP — FR-015).
- [ ] T014 [P] [FOUND] Error/response helpers + rate limiting in `lib/http.ts` (401/403/409/422
  shapes per `contracts/admin-api.md`) and structured logging.
- [ ] T015 [P] [FOUND] Admin shell layout `app/(admin)/layout.tsx` (nav for cases/solutions/people/
  regions/insights/pages/media/users) gated by session.
- [ ] T016 [FOUND] Seed script `scripts/seed-admin.ts` creating the first admin with forced TOTP
  enrolment (used by quickstart).

**Checkpoint**: Schema, auth+MFA, RBAC, audit, content-type registry ready. User stories can begin.

---

## Phase 3: User Story 1 — Editor manages structured content without a developer (P1) 🎯 MVP

**Goal**: An editor can create → preview → publish a structured entry (case study) with a cover
image, no developer involved.

**Independent Test**: Log in, create a case with required fields + cover, preview, publish; confirm
it is returned published and drafts are blocked from publish when fields are missing.

### Tests for User Story 1 ⚠️ (write first, must fail)

- [ ] T017 [P] [US1] Unit test for case Zod validation (required fields) in
  `tests/unit/content-case-validation.test.ts`.
- [ ] T018 [P] [US1] Integration test create→draft→publish flow in
  `tests/integration/us1-publish-flow.test.ts` (asserts publish gate blocks missing fields).

### Implementation for User Story 1

- [ ] T019 [US1] Entry service `lib/content/entries.ts`: create/update draft, write a
  `content_versions` snapshot on each save, publish gate (required fields + media exist), calling
  the audit writer (FR-006/FR-008/FR-009 core).
- [ ] T020 [US1] Authoring routes `app/api/admin/[type]/route.ts` (list/create) and
  `app/api/admin/[type]/[id]/route.ts` (get/update) per `contracts/admin-api.md`, with
  `expectedVersionId` concurrency check (409).
- [ ] T021 [US1] Publish/unpublish routes `app/api/admin/[type]/[id]/publish` +
  `.../unpublish` (422 on failed gate).
- [ ] T022 [P] [US1] Case editor UI `app/(admin)/cases/` (list, new, edit form bound to the case
  Zod schema, cover-image picker, Save draft / Publish).
- [ ] T023 [P] [US1] Preview renderer `app/preview/[type]/[slug]/page.tsx` gated by a signed preview
  token (`lib/content/preview-token.ts`) — draft-aware (D5).
- [ ] T024 [US1] Wire audit events (`entry.create/update/publish/unpublish`) into the entry service.

**Checkpoint**: US1 fully functional — MVP replaces the developer-dependent workflow.

---

## Phase 4: User Story 2 — Site consumes CMS content over an API (P1)

**Goal**: Published read API for all content types + faceted case filtering; the separate site
consumes it and never touches the DB/admin.

**Independent Test**: Call `/api/content/*` externally — only published entries returned; case
filters honored; draft slug → 404.

### Tests for User Story 2 ⚠️

- [ ] T025 [P] [US2] Contract test asserting `/api/content/*` responses match
  `contracts/read-api.md` shapes in `tests/contract/read-api.test.ts`.
- [ ] T026 [P] [US2] **Draft-leak** integration test in `tests/integration/us2-no-draft-leak.test.ts`
  (SC-003 / CG-1): draft never appears in list or by-slug.
- [ ] T027 [P] [US2] Facet-filter integration test in `tests/integration/us2-facets.test.ts` (CG-4:
  OR-within / AND-across).

### Implementation for User Story 2

- [ ] T028 [US2] Published read service `lib/content/published.ts`: status=`published` only,
  pagination, locale param + documented fallback (FR-020).
- [ ] T029 [US2] Read API routes `app/api/content/[type]/route.ts` (list) and
  `app/api/content/[type]/[slug]/route.ts` (detail) with API-key auth + edge cache headers.
- [ ] T030 [US2] Case-library faceted filter on `app/api/content/cases/route.ts` querying
  `case_study_facets` (industry/service/region/outcome) (FR-010).
- [ ] T031 [P] [US2] Singleton page endpoint `app/api/content/pages/[key]/route.ts` (5h/book/awards/
  legal).
- [ ] T032 [P] [US2] `[site]` Thin read-API client `lib/cms/client.ts` in **this repo**
  (`consulting-dna-corporate`) — typed fetchers, `CMS_URL` + `READ_API_KEY`, no DB access (FR-004).

**Checkpoint**: US1 + US2 both work; site can render CMS content over HTTP only.

---

## Phase 5: User Story 3 — Roles, permissions & audit (P2)

**Goal**: Admin/Editor RBAC, admin-only user management + audit log view, MFA enforced.

**Independent Test**: Editor gets 403 on user admin; every mutation audited; admin login needs TOTP.

### Tests for User Story 3 ⚠️

- [ ] T033 [P] [US3] RBAC test `tests/integration/us3-rbac.test.ts` (editor → 403 on
  `/api/admin/users/**` and `/api/admin/webhooks/**` — CG-A2).
- [ ] T034 [P] [US3] Audit-coverage test `tests/integration/us3-audit.test.ts` (every mutation →
  1 audit row — SC-005/CG-A1).
- [ ] T035 [P] [US3] MFA-enforcement test `tests/integration/us3-mfa.test.ts` (no admin session
  without valid TOTP — SC-008/CG-A3).

### Implementation for User Story 3

- [ ] T036 [US3] User management routes `app/api/admin/users/route.ts` + `[id]/route.ts` (admin-only
  guard; last-admin + admin-without-MFA safeguards).
- [ ] T037 [P] [US3] Users admin UI `app/(admin)/users/` (invite via Resend, set role, enable MFA).
- [ ] T038 [P] [US3] Audit log route `app/api/admin/audit/route.ts` (filterable, admin-only) + UI
  `app/(admin)/users/audit`.
- [ ] T039 [US3] Enforce `requireAdmin` on all admin-only routes; confirm editor guards across
  content routes.

**Checkpoint**: Governance in place; team can be onboarded safely.

---

## Phase 6: User Story 4 — Version history & safe recovery (P2)

**Goal**: View an entry's version history and restore a prior version.

**Independent Test**: Edit twice, list versions, restore first; content matches and restore is a new
version.

### Tests for User Story 4 ⚠️

- [ ] T040 [P] [US4] Restore test `tests/integration/us4-version-restore.test.ts` (restored content
  == selected version; restore writes a new version — SC-006).

### Implementation for User Story 4

- [ ] T041 [US4] Versions route `app/api/admin/[type]/[id]/versions/route.ts` (list) and restore
  route `.../restore/route.ts` (copies version data → entry, writes new version, audits
  `version.restore`).
- [ ] T042 [P] [US4] Version history UI in `app/(admin)/[type]/[id]/versions` (list + diff-lite +
  Restore button).

**Checkpoint**: Editors can recover from mistakes.

---

## Phase 7: User Story 5 — Media library (P2)

**Goal**: Upload/browse/reuse images + documents on Bunny.net; attach to entries; videos are
YouTube refs.

**Independent Test**: Upload image → stable CDN URL; attach to case; unsupported/oversized → 422.

### Tests for User Story 5 ⚠️

- [ ] T043 [P] [US5] Media validation test `tests/unit/media-validation.test.ts` (MIME allowlist +
  max size → 422 — FR-013).

### Implementation for User Story 5

- [ ] T044 [US5] Bunny.net client `lib/media/bunny.ts` (upload, delete, delivery URL).
- [ ] T045 [US5] Media routes `app/api/media/route.ts` (POST upload → validate → store → persist
  `media_assets`; GET paginated library) + audit `media.upload`.
- [ ] T046 [P] [US5] Media library UI `app/(admin)/media/` + reusable media-picker component used by
  content editors.
- [ ] T047 [P] [US5] Publish gate check for broken media references (edge case) in the entry service.

**Checkpoint**: Rich content with managed media.

---

## Phase 8: User Story 6 — Multilingual-ready model (P3)

**Goal**: Same logical entry in multiple locales via `translation_group_id`, no migration to add a
locale.

**Independent Test**: Add ES/PT variant of an EN entry; request by locale; missing locale uses
documented fallback.

### Tests for User Story 6 ⚠️

- [ ] T048 [P] [US6] Locale test `tests/integration/us6-locale.test.ts` (variant coexistence +
  fallback rule — SC-007/FR-019/FR-020).

### Implementation for User Story 6

- [ ] T049 [US6] "Add translation" action in the entry service (new row, same
  `translation_group_id`, different `locale`) + UI control in the editor.
- [ ] T050 [US6] Locale-aware resolution in the published read service + `locale` param handling and
  fallback across read routes.

**Checkpoint**: All user stories independently functional.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T051 [POLISH] Outbound revalidation webhooks `lib/webhooks/dispatch.ts` (signed HMAC) fired on
  publish/unpublish; admin webhook config routes `app/api/admin/webhooks/*` (FR-021, D7).
- [ ] T052 [POLISH] `[site]` Revalidation receiver route handler in **this repo** — verify HMAC,
  revalidate affected paths (V9).
- [ ] T053 [P] [POLISH] Playwright E2E `tests/e2e/`: login+MFA, create→preview→publish, restore
  version (maps to quickstart V1/V5/V6).
- [ ] T054 [P] [POLISH] Concurrent-edit conflict handling verified (409) + user-facing message.
- [ ] T055 [P] [POLISH] CMS editor's guide + technical handover doc in `docs/` (proposal Section 13).
- [ ] T056 [P] [POLISH] Security hardening: upload scanning, rate limits, security headers,
  dependency scan (no critical/high at launch).
- [ ] T057 [POLISH] Run full `quickstart.md` V1–V9 against staging; fix gaps.

---

## Dependencies & Execution Order

### Phase dependencies
- **Setup (P1)** → no deps.
- **Foundational (P2)** → after Setup; **blocks all user stories**.
- **User Stories (P3–P8)** → after Foundational. US1 and US2 are both P1 (build US1 first for a
  demoable MVP, then US2 to wire the site). US3–US6 can proceed in parallel by different devs.
- **Polish (P9)** → after the targeted user stories (T051/T052 need US1+US2; T053 needs US1/US3/US4).

### Critical cross-story notes
- The **audit writer (T011)** and **content-type registry (T010)** are foundational — every story
  depends on them; build in Phase 2.
- T032 and T052 are the only `[site]`-repo tasks; everything else is in the separate CMS repo.

### Within each story
- Tests first (must fail) → models/services → routes → UI → wire audit.

### Parallel opportunities
- Setup: T003–T006 in parallel.
- Foundational: T010, T011, T012, T014, T015 in parallel after T009.
- Each story's `[P]` tests run together; independent stories (US3/US4/US5/US6) parallelize across devs.

---

## Implementation Strategy

### MVP first
1. Phase 1 Setup → 2. Phase 2 Foundational → 3. US1 (create→preview→publish) → **validate** → demo.
2. Then US2 to connect the separate site over the read API (completes the P1 pair).

### Incremental delivery
US1 → US2 → US3 → US4 → US5 → US6, each tested and demoable independently, then Polish.

---

## Notes
- `[P]` = different files, no dependencies.
- `[site]` = the marketing-site repo (`consulting-dna-corporate`); all other tasks = the new
  `corporate-dna-cms` repo (separate project — the user's hard constraint).
- Verify tests fail before implementing; commit per task or logical group.
- Total: **57 tasks** across 9 phases (6 user stories + setup/foundational/polish).
