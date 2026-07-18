# Implementation Plan: Custom Headless CMS (standalone project)

**Branch**: `001-custom-cms` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-custom-cms/spec.md`

## Summary

Build a custom headless CMS as a **standalone project, entirely separate from the marketing
site**. The CMS owns content authoring (structured content types: cases, solutions, people,
regions, insights + singleton pages), roles/MFA/audit, version history, media, and a
multilingual-ready model. It exposes a **published read API** (plus webhooks for revalidation)
that the separate Next.js marketing site consumes — the site never touches the CMS database or
admin. Technical approach: a Next.js (App Router) application on Vercel with route handlers for
both the admin UI and the content API, Drizzle ORM over Neon serverless Postgres, Auth.js for
sessions + TOTP MFA, and Bunny.net for media delivery. The two projects live in separate
repositories/deployments and integrate only over HTTP + webhooks.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, route handlers) · Drizzle ORM + drizzle-kit
(migrations) · Auth.js (NextAuth) with credentials + TOTP second factor · Zod (validation/contract
schemas) · Bunny.net SDK/HTTP (media storage + CDN) · Resend (transactional email:
invites/password reset) · React 19 + Tailwind 4 for the admin UI

**Storage**: Neon serverless Postgres (content, users, versions, audit, media metadata). Media
binaries live in Bunny.net storage; only metadata + delivery URLs are in Postgres.

**Testing**: Vitest (unit) · Playwright (admin E2E) · contract tests for the read API validating
responses against the Zod/OpenAPI schemas in `contracts/`

**Target Platform**: Vercel (Fluid Compute functions) for the CMS app + API; Neon for DB; Bunny.net
CDN for media. Admin served on a dedicated subdomain (e.g. `admin.<domain>`), API on
`api.<domain>` or a `/api` path on the CMS deployment — separate from the marketing site's domain.

**Project Type**: Web service + admin UI (single Next.js project), consumed by an external site.

**Performance Goals**: Read API p95 < 200ms for cached list/detail responses; content publish →
site-revalidation webhook fired < 5s; admin interactions feel instant (< 100ms perceived on
navigation). Scale is modest (single-digit editors; site does the visitor-facing caching).

**Constraints**: Must be a separate deployment/repo from the site (FR-001/FR-004); no draft leakage
on published endpoints (SC-003); admin MFA mandatory (FR-015); statically-consumable so the site
survives brief CMS downtime; multilingual-ready schema with no future migration to add locales
(FR-019).

**Scale/Scope**: ~10 page templates worth of content types, single-digit concurrent editors,
~5,000 site visits/month at launch (read API load dominated by build/revalidation, not per-visit).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is still the **unratified template**
(placeholder principles). There are therefore no ratified, binding gates to evaluate against. In
its absence, this plan self-imposes the proposal's non-negotiables as gates:

| Self-imposed gate | Status |
|---|---|
| CMS is a separate project from the site (FR-001/004) | PASS — separate repo/deploy; HTTP-only contract |
| Security-by-architecture: no public DB/admin surface to visitors | PASS — site is static/edge, consumes read API only |
| Admin MFA + RBAC + audit (FR-014/015/016) | PASS — Auth.js + TOTP + roles + audit table designed |
| No draft leakage on published API (SC-003) | PASS — published API filters status; separate from preview |
| Multilingual-ready without rebuild (FR-019) | PASS — locale + translation-group in base model |
| Simplicity / no premature complexity | PASS — one Next.js app, one ORM, no microservices |

No violations requiring justification. **Recommendation**: run `/speckit-constitution` to ratify a
real constitution before implementation so future changes have binding gates. (Not blocking this
plan.)

## Project Structure

### Documentation (this feature)

```text
specs/001-custom-cms/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── read-api.md      # Published content read API (site-facing)
│   └── admin-api.md     # Admin/authoring API (internal)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created here)
```

### Source Code (separate repository — NOT this repo)

Per the hard constraint, the CMS is its own repository, `corporate-dna-cms`, deployed
independently. It does **not** live inside the marketing-site repo. The marketing site
(`consulting-dna-corporate`, this repo) only gains a thin content-client module that calls the
read API.

**Confirmed location (decided 2026-07-18):**

- **On disk**: `E:\projetos\corporate-dna-cms` — a sibling folder of this repo (same parent
  `E:\projetos\`), with its own independent git repository.
- **Remote**: a new dedicated GitHub repository + a new, separate Vercel project (same Impulse
  account/scope as the site), with its own Neon database and its own admin subdomain.
- **Coupling**: none beyond the HTTP read API + signed revalidation webhook in `contracts/`.
- **Deploy note**: because it targets the Vercel Impulse scope, the HEAD commit author for CMS
  deploys must be `impulseaisolutions@gmail.com` (same rule as the site).

```text
E:\projetos\
├── consulting-dna-corporate\   # the marketing site (this repo)
└── corporate-dna-cms\          # the CMS (new, separate repo — location above)
```

```text
corporate-dna-cms/                 # NEW, separate repo + Vercel project
├── app/
│   ├── (admin)/                   # Authenticated admin UI (dedicated subdomain)
│   │   ├── login/                 # Auth.js sign-in + TOTP second factor
│   │   ├── cases/                 # CRUD + preview per content type
│   │   ├── solutions/
│   │   ├── people/
│   │   ├── regions/
│   │   ├── insights/
│   │   ├── pages/                 # Singletons: 5H, book, awards, legal
│   │   ├── media/                 # Media library
│   │   └── users/                 # Admin-only: users, roles, audit log
│   ├── api/
│   │   ├── content/               # PUBLISHED read API (site-facing, cached)
│   │   │   └── [type]/...         # list + [slug] detail, faceted filters, locale
│   │   ├── admin/                 # Authoring API (session-guarded)
│   │   ├── media/                 # Upload → Bunny.net, metadata persist
│   │   ├── auth/                  # Auth.js route handlers
│   │   └── webhooks/              # Outbound revalidation dispatch config
│   └── preview/                   # Draft-aware preview renderer
├── db/
│   ├── schema/                    # Drizzle schema (entries, versions, users, audit, media)
│   └── migrations/                # drizzle-kit migrations
├── lib/
│   ├── auth/                      # Auth.js config, RBAC guards, TOTP
│   ├── content/                   # content-type registry, field defs, validation (Zod)
│   ├── media/                     # Bunny.net client
│   ├── audit/                     # audit-log writer
│   └── webhooks/                  # revalidation event dispatch
├── contracts/                     # OpenAPI/Zod contract mirrored from specs
└── tests/
    ├── contract/                  # read-API schema conformance
    ├── integration/               # publish→api, draft-leak, restore-version
    └── unit/

consulting-dna-corporate/          # THIS repo (marketing site) — minimal change
└── lib/cms/                        # thin read-API client + revalidation webhook receiver
    ├── client.ts                  # typed fetchers against the CMS read API
    └── revalidate route handler   # receives CMS webhook → revalidates affected paths
```

**Structure Decision**: Two independent projects. The **CMS** is a new standalone Next.js
repository (`corporate-dna-cms`) with its own Vercel deployment, Neon database and admin subdomain;
it contains the admin UI, the authoring API, the published read API, and outbound webhooks. **This
repository** (the marketing site) receives only a thin `lib/cms/` client that consumes the read API
and a route handler that receives revalidation webhooks. The only coupling between the two is the
HTTP read API + webhook contract documented in `contracts/`. This satisfies FR-001/FR-002/FR-004
and the security-by-separation requirement.

## Complexity Tracking

> No Constitution Check violations require justification. The design deliberately avoids extra
> complexity: a single Next.js app (not separate admin/api services), one ORM, one database, one
> media provider. The only intentional multiplicity — two repositories — is a **required**
> constraint from the user, not added complexity.
