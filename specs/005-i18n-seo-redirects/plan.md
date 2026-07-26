# Implementation Plan: Internationalization readiness, SEO/GEO & 301 redirects

**Branch**: `005-i18n-seo-redirects` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-i18n-seo-redirects/spec.md`

## Summary

Add the site's discoverability + launch-hygiene layer without a rebuild. **Redirects**: one
`redirects()` map in `next.config` (single-hop, permanent) for the paths moved in the recent
restructure. **SEO**: adopt Next.js App Router **Metadata API** — a root `metadata` + `generateMetadata`
per dynamic route (canonical, OG/Twitter), a `app/sitemap.ts` and `app/robots.ts`, and JSON-LD
injected per page type; a single `SITE_URL` env drives absolute URLs. **GEO**: publish `llms.txt`
(via a route/static file) mapping key pages, keep AI crawlers allowed, and keep content semantically
clean. **i18n readiness**: introduce a locale-aware structure now (default `en`, no URL change at
launch) and thread a `locale` param through the existing `lib/cms/` client with a documented
fallback — so a second locale is later config+content only. English stays the only populated locale.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 App Router — **Metadata API**, `next.config` `redirects()`,
`app/sitemap.ts`, `app/robots.ts` (all first-party; no new runtime deps for SEO/redirects). i18n:
**`next-intl`** proposed for locale routing/message handling when a second locale lands (evaluated
in research); not required to sit idle at launch.

**Storage**: N/A (config + metadata). Locale-tagged content comes from the CMS read API (per `001`
/`002`); no new store.

**Testing**: A redirect assertion pass (request each old path → expect 301 + destination); a
metadata snapshot per route type; JSON-LD validated against schema.org; sitemap/robots content
checks. Vitest for pure helpers (redirect map, JSON-LD builders, `hreflang`/canonical builders).

**Target Platform**: Vercel — `redirects()` handled at the edge; Metadata/sitemap/robots rendered
by the app.

**Project Type**: Web application (Next.js App Router) — cross-cutting config + `<head>` layer.

**Performance Goals**: Redirects resolve at the edge (no origin hit); metadata adds no measurable
render cost; no client JS added for SEO.

**Constraints**: Single-hop redirects, no loops, no shadowing of live routes (FR-302); staging
routes (`/v1`, `/preview/*`) must be `noindex` + excluded from sitemap (FR-305); locale layer must
add locales by config only (FR-309); English-only at launch.

**Scale/Scope**: ~20 public routes (static + CMS-dynamic: `/cases/[slug]`, `/insights/[slug]`,
`/solutions/*`, `/solutions/regions/[region]`). A handful of redirect rules at launch, growing.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is the unratified template — no binding gates. Self-imposed gates:

| Self-imposed gate | Status |
|---|---|
| Redirects single-hop, no loops/shadowing | PASS — one map, validated against live routes |
| No draft/staging indexed (upholds 002 no-leak posture) | PASS — `/v1` + `/preview/*` noindex + sitemap-excluded |
| i18n adds locales by config only (aligns 001 FR-019) | PASS — locale param threaded; default `en` |
| No new client-side weight for SEO | PASS — server metadata + static robots/sitemap |
| Simplicity | PASS — first-party Next.js APIs; i18n lib deferred until a 2nd locale exists |

No violations requiring justification. **Recommendation**: ratify a constitution
(`/speckit-constitution`) before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/005-i18n-seo-redirects/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — i18n approach, redirect seed map, JSON-LD types, GEO tactics
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── next.config.mjs               # MODIFY: add redirects() map (single-hop, permanent)
├── app/
│   ├── layout.tsx               # MODIFY/ADD: root Metadata (default title/desc, OG, metadataBase)
│   ├── sitemap.ts               # NEW: public routes incl. CMS-dynamic; excludes staging
│   ├── robots.ts                # NEW: allow policy (incl. AI crawlers); sitemap ref; disallow staging
│   ├── llms.txt/route.ts        # NEW: GEO guide to key pages (or static public/llms.txt)
│   ├── cases/[slug]/page.tsx    # MODIFY: generateMetadata + Article/CaseStudy JSON-LD
│   ├── insights/[slug]/page.tsx # MODIFY: generateMetadata + Article JSON-LD
│   └── **/page.tsx              # MODIFY: per-route metadata where missing; noindex on /v1, /preview
├── lib/
│   ├── seo/
│   │   ├── metadata.ts          # NEW: helpers (buildMetadata, canonical, hreflang)
│   │   └── jsonld.ts            # NEW: Organization + Article/CaseStudy/Book builders
│   ├── i18n/
│   │   ├── config.ts            # NEW: locales list, defaultLocale='en', fallback rule
│   │   └── (routing scaffold)   # locale-aware helpers; wired fully when 2nd locale lands
│   ├── redirects.ts             # NEW: source→destination map consumed by next.config
│   └── cms/client.ts            # MODIFY: accept a `locale` arg → forward to read API (001 FR-020)
└── public/
    └── og/                      # NEW: default + per-type OG images (assets from 006 image swap)
```

New env: `SITE_URL` (canonical production base URL) — required for canonicals/OG/sitemap (FR-306).

**Structure Decision**: Single Next.js app. Redirects live in one `lib/redirects.ts` map imported by
`next.config.mjs`. SEO uses the App Router Metadata API with shared builders in `lib/seo/`. i18n is
staged as a thin `lib/i18n/` config + a `locale` parameter on the CMS client — enough to make a
future locale a config/content change, without adopting locale URL prefixes at launch (English-only).
GEO is a small content/route addition (`robots`, `llms.txt`, semantic structure). This keeps three
related-but-distinct concerns in one coherent layer while staying minimal.

## Phase 0 — research (unknowns to resolve → `research.md`)

- **i18n approach**: URL-prefix (`/pt`) vs. subdomain/domain; `next-intl` vs. native — and how much
  to build now vs. scaffold.
- **Redirect seed map**: enumerate moved paths from git history + client's list.
- **Canonical domain** (`SITE_URL`).
- **JSON-LD types** per page; **GEO** tactics (llms.txt shape, target topics).

## Complexity Tracking

> No Constitution Check violations. Complexity is bounded by using first-party Next.js APIs and by
> **deferring** the full i18n library until a second locale is actually funded — only the seams
> (locale config + CMS `locale` param + hreflang builder) are added now, per FR-309.
