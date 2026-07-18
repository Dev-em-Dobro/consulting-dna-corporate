# Phase 0 Research: Custom Headless CMS

All Technical Context unknowns are resolved below. Each entry records the decision, the rationale,
and the alternatives rejected. Decisions are anchored to `proposta.txt` (Sections 3, 5, 14, 16) and
the user constraint that the CMS be a separate project from the site.

## D1 — Overall architecture: separate project, headless

- **Decision**: A standalone Next.js (App Router) application, in its own repository and Vercel
  project, that hosts (a) the authenticated admin UI, (b) an internal authoring API, and (c) a
  public **read API** for published content. The marketing site is a separate deployment that only
  consumes the read API + revalidation webhooks.
- **Rationale**: The user's hard constraint is physical separation. Headless separation also
  delivers the proposal's security-by-architecture: visitors hit static/edge pages on the site,
  never the CMS DB/admin. One Next.js app (rather than split admin/api services) keeps operational
  complexity low while still being a distinct project from the site.
- **Alternatives considered**:
  - *CMS inside the site repo (monorepo package)* — rejected: violates the explicit "separate
    project" constraint and couples deploy lifecycles/attack surface.
  - *Off-the-shelf CMS (Sanity/Storyblok/WordPress)* — rejected by the proposal (Section 3/16): the
    differentiator is a custom, license-owned CMS with no third-party lock-in or per-seat fees.
  - *Separate backend service (NestJS/Express) + separate admin SPA* — rejected: more moving parts
    than a single Next.js app needs at this scale; no benefit given single-digit editors.

## D2 — Database & ORM

- **Decision**: Neon serverless Postgres accessed via Drizzle ORM, with drizzle-kit migrations and
  the Neon serverless HTTP driver for edge/Fluid compatibility.
- **Rationale**: `proposta.txt` Section 14 names Neon. Drizzle is TypeScript-first, lightweight, has
  explicit SQL-like schema (good for the versioning/audit tables), and first-class Neon support.
  Migrations are code-reviewed and reproducible.
- **Alternatives considered**: Prisma (heavier runtime, historically weaker on serverless cold
  starts, though improved) — viable but Drizzle's thin footprint suits Fluid Compute better.
  Raw SQL — rejected: loses type-safety across the many content types.

## D3 — Authentication, MFA and RBAC

- **Decision**: Auth.js (NextAuth) with a Credentials provider (email + password, argon2/bcrypt
  hashing) plus a **TOTP second factor mandatory for Administrators**. Roles (`admin`, `editor`)
  stored on the user; server-side guards enforce RBAC on every admin route and authoring mutation.
- **Rationale**: FR-014/FR-015 require RBAC + admin MFA. Auth.js integrates natively with Next.js
  route handlers and sessions; TOTP (authenticator app) is phishing-resistant enough for a small
  team and needs no SMS provider.
- **Alternatives considered**: Hosted auth (Clerk/Auth0) — rejected: reintroduces third-party
  dependency/cost the proposal explicitly avoids, and holds user data off the client's own accounts.
  WebAuthn/passkeys — stronger, deferrable; TOTP chosen for Phase 1 simplicity, model leaves room to
  add passkeys later.

## D4 — Content model: structured + versioned + multilingual-ready

- **Decision**: A single `content_entries` base table carrying shared fields (type, slug, status,
  `locale`, `translation_group_id`, timestamps, `current_version_id`) plus per-type structured data
  in typed JSONB validated by Zod schemas per content type; an append-only `content_versions` table
  snapshots each save. Translations are separate rows sharing a `translation_group_id`.
- **Rationale**: FR-005..FR-010 and FR-019/FR-020. A base table + typed JSONB gives a small, stable
  schema that still enforces per-type field validation at the application layer, and makes adding a
  locale a pure content insert (no migration) — satisfying SC-007. Append-only versions make restore
  trivial and auditable (FR-009).
- **Alternatives considered**:
  - *One table per content type* — rejected: multiplies migrations and complicates cross-type
    concerns (versioning, audit, locale) that are identical across types.
  - *Pure EAV (entity-attribute-value)* — rejected: unqueryable and slow for faceted filtering.
  - *Localized columns on one row* — rejected: not extensible to arbitrary future locales without
    schema change; violates FR-019.
- **Note**: Faceted case-study filters (industry/service/region/outcome) are stored as first-class
  columns/relations (not only JSONB) so the read API can filter efficiently (FR-010).

## D5 — Draft/preview separation and no-leak published API

- **Decision**: Two read paths. The **published read API** (`/api/content/...`) filters
  `status = 'published'` and is safe to cache at the edge; a separate **preview** renderer requires
  a signed preview token and can read drafts. The site consumes only the published API.
- **Rationale**: SC-003 (zero draft leakage) and FR-008/FR-017. Physically separating the query
  paths (not a runtime flag on a shared endpoint) makes leakage a design impossibility on the public
  route.
- **Alternatives considered**: single endpoint with a `preview=true` flag — rejected: one bug leaks
  drafts publicly; higher risk for no benefit.

## D6 — Media storage & delivery

- **Decision**: Upload to Bunny.net storage; serve via Bunny CDN. Postgres stores only metadata
  (filename, type, size, dimensions, delivery URL, alt text). Uploads validated by MIME type + size;
  images processed/variants as needed. Videos are **not** uploaded — stored as YouTube references.
- **Rationale**: `proposta.txt` Section 14 names Bunny.net for media; keeping binaries out of
  Postgres keeps the DB lean and lets the CDN handle delivery/perf. FR-011/FR-012/FR-013.
- **Alternatives considered**: Vercel Blob — viable and simpler, but proposal specifies Bunny.net for
  cost/CDN reach; keep Bunny, abstract behind a `lib/media` client so a swap is cheap. Storing
  binaries in Postgres — rejected: bloat and poor delivery.

## D7 — Site ↔ CMS integration (webhooks + revalidation)

- **Decision**: On publish/unpublish, the CMS dispatches a signed webhook to the site's
  revalidation route handler with the affected type/slug; the site revalidates (ISR/tag-based) the
  impacted paths. API/webhook-first per FR-021.
- **Rationale**: Keeps the site static/fast while staying current within seconds of a publish
  (perf goal < 5s). Signed payloads prevent forged revalidation.
- **Alternatives considered**: Poll-on-build only — rejected: stale until next deploy. Direct DB
  read from the site — rejected: violates FR-004 and the separation constraint.

## D8 — Audit logging

- **Decision**: An append-only `audit_log` table written by a central `lib/audit` helper on every
  authoring mutation and auth event (actor, action, target type/id, timestamp, IP/metadata).
- **Rationale**: FR-016 + SC-005 require 100% coverage; a single choke-point writer guarantees no
  action bypasses the log.
- **Alternatives considered**: DB triggers — rejected: opaque, harder to test, misses app-level
  context (actor identity, request metadata).

## D9 — Transactional email

- **Decision**: Resend for user invites, password resets and MFA-related notifications.
- **Rationale**: Named in `proposta.txt` Section 14; simple API, free tier at launch.
- **Alternatives considered**: SMTP/SES — more setup; not needed at this scale.

## D10 — Testing strategy

- **Decision**: Vitest for unit (validation, RBAC guards, version restore logic); contract tests
  asserting read-API responses conform to the `contracts/` schemas; Playwright for admin E2E
  (login+MFA, create→preview→publish, restore version); an explicit **draft-leak** integration test
  against the published API.
- **Rationale**: Directly maps to the acceptance scenarios and success criteria (esp. SC-003).
- **Alternatives considered**: manual QA only — rejected: draft-leak and RBAC regressions are
  high-cost and must be guarded automatically.

## Resolved unknowns summary

| Unknown (from Technical Context) | Resolution |
|---|---|
| ORM choice | Drizzle ORM over Neon (D2) |
| Auth/MFA mechanism | Auth.js + credentials + TOTP for admins (D3) |
| Content model shape / multilingual approach | Base table + typed JSONB + translation_group_id (D4) |
| Draft vs published isolation | Separate published API vs token-gated preview (D5) |
| Media provider | Bunny.net, metadata-in-DB (D6) |
| Site integration | Signed webhooks → site revalidation (D7) |
| Test tooling | Vitest + Playwright + contract tests (D10) |
