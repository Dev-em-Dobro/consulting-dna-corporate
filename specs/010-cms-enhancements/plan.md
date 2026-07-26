# Implementation Plan: CMS enhancements — video embeds, case branding, media limits, i18n read API & regions/maps data

**Branch**: `010-cms-enhancements` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-cms-enhancements/spec.md`

## Summary

Extend the standalone **`corporate-dna-cms`** project (feature `001`) with the editor,
content-model and read-API changes surfaced in the 24-07 client meeting. Concretely: add a
validated **YouTube video reference** to the video-bearing content types (cases, insights,
singletons); add **`brandColor`** (validated hex) and a **transparent-PNG logo** to the **Case**
type; enforce **per-field image size/proportion limits** on top of `001`'s type/size validation;
guarantee the **read API serves EN/PT/ES with a documented fallback**; expose the **Region**
geodata the maps need (city, country, lat/lng, zoom, address, tel, email, office-vs-coverage flag);
and ensure the **schema is ready** for all launch content (Person LinkedIn URL, legal rich text,
Awards, launch fields on solutions/cases/insights/regions).

Technical approach follows `001`'s stack unchanged: **Drizzle ORM + drizzle-kit migrations** over
**Neon** Postgres, **Zod** content validation, **Auth.js + TOTP** for the (unchanged) auth model,
**Bunny.net** for media (with added upload validation), all inside the same Next.js 16 App Router
CMS app. New/changed fields flow through the content-type registry, the authoring API, and the
**published read API** contract the site consumes. This is **CMS-repo work**; the marketing site
picks the changes up through the existing read-API integration (`002`) in features `005/007/008`.

> **Repo note**: implementation happens in `E:\projetos\corporate-dna-cms` (separate repo, separate
> Vercel project, per `001`). These `specs/` files live in the marketing-site repo for tracking
> only. Deploys to the CMS's Vercel (Impulse) scope still require the HEAD commit author
> `impulseaisolutions@gmail.com` (same rule as `001`).

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, route handlers) · **Drizzle ORM + drizzle-kit**
(schema + migrations) · **Zod** (field validation / read-API contract) · **Auth.js (NextAuth) +
TOTP** (unchanged auth model guarding new authoring surfaces) · **Bunny.net** SDK/HTTP (media
storage + CDN, extended upload validation) · React 19 + Tailwind 4 (admin UI: video-embed input,
colour picker, logo/aspect-ratio-aware uploader). Image dimension/aspect inspection at upload time
(e.g. `sharp`/`image-size` — confirmed in research). *(This is the CMS stack, not the marketing
site's.)*

**Storage**: Neon serverless Postgres — new/changed columns on `cases`, `regions`, `people`,
legal singletons, plus an `awards` table (or singleton list). Media binaries remain in Bunny.net;
only metadata + delivery URLs + the new validation metadata live in Postgres.

**Testing**: Vitest (unit: YouTube URL normalisation, hex validation, aspect-ratio/transparency
checks, locale fallback resolver, coordinate validation) · contract tests asserting the read API
returns the new fields and never leaks drafts across locales · integration tests for
office-vs-coverage publish rules.

**Target Platform**: Vercel (Fluid Compute) — the CMS's own deployment; Neon for DB; Bunny.net CDN
for media. Admin on the dedicated CMS subdomain, read API on the CMS deployment — separate from the
marketing site (per `001`).

**Project Type**: Web service + admin UI (the existing single Next.js CMS project), consumed by the
external marketing site over the read API.

**Performance Goals**: Unchanged from `001` — read API p95 < 200ms for cached list/detail; upload
validation adds negligible latency (dimension probe on the server before Bunny.net persist).

**Constraints**: Must stay within the **separate CMS project** (`001` FR-001/004); **no draft
leakage** on the read API including across locales (`001` SC-003); **MFA/RBAC/audit** continue to
guard all new authoring (`001` FR-014/015/016); videos remain **external references** (`001`
FR-012); schema changes via **drizzle-kit migrations** only.

**Scale/Scope**: Additive fields on ~4 existing types + one new/confirmed Awards home; single-digit
editors; read-API load unchanged (dominated by site build/revalidation).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is still the **unratified template**
(placeholder principles) — no ratified, binding gates. In its absence this plan self-imposes the
`001` non-negotiables as gates, since this feature extends `001`:

| Self-imposed gate | Status |
|---|---|
| CMS remains a separate project from the site (`001` FR-001/004) | PASS — all work in `corporate-dna-cms`; site integrates only over the read API |
| No draft leakage on the read API, including per-locale (`001` SC-003) | PASS — locale resolution runs after the published-only filter; fallback never returns drafts |
| Admin MFA + RBAC + audit still hold for new authoring (`001` FR-014/015/016) | PASS — new fields reuse the existing session/RBAC/audit path; no new unauthenticated surface |
| Videos are external references, not uploads (`001` FR-012) | PASS — YouTube stored as a normalised reference value object |
| Schema evolves via drizzle-kit migrations with Zod validation | PASS — additive migrations; Zod at the authoring boundary + read-API contract |
| Simplicity / no premature complexity | PASS — additive columns + per-field validation config; no new services or content-store |

No violations requiring justification. **Recommendation**: ratify a real constitution
(`/speckit-constitution`) before implementation so future changes have binding gates. (Not blocking
this plan.)

## Project Structure

### Documentation (this feature)

```text
specs/010-cms-enhancements/
├── plan.md              # This file (/speckit-plan output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 decisions (D1…) + data-model section + migration/config summary
├── data-model.md        # (optional) may be split from research.md's data-model section
├── contracts/           # Phase 1 — read-API delta (video/brandColor/logo/locale/region fields)
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (separate repository — `corporate-dna-cms`, NOT this repo)

All changes land in the CMS repo laid out by `001`'s plan. Touched areas are marked; the tree
mirrors `001` so paths are stable.

```text
E:\projetos\
├── consulting-dna-corporate\   # marketing site (this repo) — no code change here; picks up new
│                               # read-API fields via 002 in features 005/007/008
└── corporate-dna-cms\          # the CMS (separate repo) — ALL implementation happens here
```

```text
corporate-dna-cms/                 # separate repo + Vercel project (per 001)
├── app/
│   ├── (admin)/
│   │   ├── cases/                 # MODIFY: video URL input, brand-colour picker, logo uploader
│   │   ├── insights/             # MODIFY: optional video URL input
│   │   ├── people/               # MODIFY: LinkedIn URL field
│   │   ├── regions/              # MODIFY: city/country/lat/lng/zoom/address/tel/email + office flag
│   │   ├── pages/                # MODIFY: legal rich text; video on video-bearing singletons
│   │   ├── awards/               # NEW (or a singleton list under pages/) — coordinate with 009
│   │   └── media/                # MODIFY: aspect-ratio / transparency-aware upload validation UX
│   ├── api/
│   │   ├── content/[type]/...    # MODIFY: read API returns new fields; locale serving + fallback
│   │   └── media/                # MODIFY: dimension/ratio/transparency validation before Bunny.net
│   └── preview/                  # MODIFY: preview renders video embeds + branded case header
├── db/
│   ├── schema/                   # MODIFY: cases (videoRef, brandColor, logoAsset), regions (geo),
│   │                             #   people (linkedinUrl), legal (rich text); NEW awards
│   └── migrations/               # NEW: drizzle-kit migrations for all of the above
├── lib/
│   ├── content/                  # MODIFY: content-type registry + Zod field defs (video, hex,
│   │                             #   coordinates, locationType, LinkedIn URL); locale-fallback resolver
│   ├── media/                    # MODIFY: Bunny.net client + image dimension/aspect/transparency probe
│   ├── video/                    # NEW: YouTube URL parse/normalise → { provider, videoId, url }
│   └── i18n/                     # NEW or MODIFY: read-API locale selection + documented fallback
├── contracts/                    # MODIFY: read-API contract delta mirrored from specs/
└── tests/
    ├── contract/                 # read-API returns new fields; no draft leak per locale
    ├── integration/              # office-vs-coverage publish rule; brand/logo round-trip
    └── unit/                     # URL normalise, hex, coordinates, aspect ratio, fallback resolver
```

**Structure Decision**: Purely **additive** work inside the existing `corporate-dna-cms` Next.js
project — new columns via drizzle-kit migrations, new Zod field definitions in the content registry,
extended Bunny.net upload validation, a small `lib/video/` YouTube normaliser, and a read-API locale
resolver. No new service, no new datastore, and no change to the CMS↔site separation or the
MFA/RBAC/audit model. The marketing site consumes the new fields through the unchanged read-API
contract (`002`).

## Phase 0 — research

See [research.md](./research.md): resolves the open inputs (video-bearing types, per-field upload
limits/aspect ratios, Awards ownership, EN/PT/ES fallback rule, whether region coordinates already
exist, migration approach) with recommended defaults, plus the **data-model delta** and the
**migration/config summary**.

## Complexity Tracking

> No Constitution Check violations require justification. Complexity is deliberately minimal: the
> feature adds columns and per-field validation to existing content types and one Awards home, reuses
> the existing Bunny.net media pipeline, and adds two small library modules (YouTube normalisation,
> locale-fallback resolution). No new services, no new datastore, no change to the two-project
> separation. The only intentional coordination point is Awards ownership, reconciled with `009`.
