# Feature Specification: Internationalization readiness, SEO/GEO & 301 redirects

**Feature Branch**: `005-i18n-seo-redirects`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Launch-readiness backlog (site) — "preparar para outras línguas · preparar SEO e GEO ·
Redirect 301". Split by theme from the combined next-steps list.

## Overview

Three discoverability/launch concerns that share the same layer (routing, metadata, `<head>`, the
edge) and are best planned together:

1. **Internationalization readiness** — prepare the site to serve additional languages later
   (English is the only populated locale at launch, per `001` FR-019/FR-020) without a rebuild: a
   locale-aware routing/metadata structure and a way to pull the right locale's content from the
   CMS.
2. **SEO & GEO** — make pages fully indexable by search engines **and** citable by AI answer
   engines (Generative Engine Optimization): per-page titles/descriptions, canonical URLs, Open
   Graph/Twitter cards, structured data (JSON-LD), a sitemap, `robots.txt`, and AI-crawler
   affordances (e.g. `llms.txt`, clean semantic content).
3. **301 redirects** — permanently redirect old/renamed URLs to their new homes so no equity or
   bookmark breaks (recent restruct: `/solutions/5h` → `/solutions/5h-framework`, cases moved to
   `/cases`, etc.).

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Old URLs never 404 (Priority: P1)

A visitor or search engine hits a URL that moved during the site restructure and is permanently
redirected (301) to the correct current page.

**Why this priority**: Broken inbound links and lost search equity are immediate, visible damage;
redirects are low-effort and high-value, and several routes have already moved (see git history).

**Independent Test**: Request each known old path and confirm a `301` to the correct new path;
confirm no redirect loops and that current paths are untouched.

**Acceptance Scenarios**:

1. **Given** a moved path (e.g. `/solutions/5h`), **When** requested, **Then** the server responds
   `301` to the new path (e.g. `/solutions/5h-framework`).
2. **Given** a current, valid path, **When** requested, **Then** there is no redirect.
3. **Given** a redirect chain risk, **When** any mapped old path is requested, **Then** it reaches
   the destination in a single hop (no chains/loops).

### User Story 2 — Every page is SEO-complete (Priority: P1)

Each route exposes a unique title, meta description, canonical URL, social-share (OG/Twitter) tags,
and appropriate structured data; the site publishes a sitemap and robots policy.

**Why this priority**: The site is launching; without per-page metadata and a sitemap it is poorly
indexed from day one.

**Independent Test**: Crawl each route and confirm unique `<title>`/description, a self-referential
canonical, OG/Twitter tags, and valid JSON-LD; confirm `/sitemap.xml` lists all public routes and
`/robots.txt` is correct.

**Acceptance Scenarios**:

1. **Given** any public route, **When** rendered, **Then** it has a unique title + description, a
   canonical URL, and OG/Twitter card tags.
2. **Given** the Organization and each key page type (article/insight, case study), **When**
   rendered, **Then** valid JSON-LD structured data is present.
3. **Given** the site, **When** `/sitemap.xml` and `/robots.txt` are requested, **Then** both exist
   and reflect the real public routes (excluding `/preview`, `/v1` staging, etc.).

### User Story 3 — The site is citable by AI answer engines (GEO) (Priority: P2)

AI crawlers can access clean, well-structured content and an AI-oriented guide, so the firm can be
surfaced/cited in AI-generated answers.

**Why this priority**: GEO is strategic upside but secondary to core indexability (US2) and not
blocking launch; P2.

**Independent Test**: Confirm `llms.txt` (or equivalent) exists and points to key pages; confirm AI
crawler user-agents are not blocked in `robots.txt`; confirm key pages use semantic headings and
answer-shaped content.

**Acceptance Scenarios**:

1. **Given** the site, **When** an AI crawler reads `robots.txt` / `llms.txt`, **Then** it finds an
   allow policy and a curated map of the firm's key pages.
2. **Given** a key content page, **When** parsed, **Then** it presents a clear, semantically
   structured, self-contained answer to the topic it targets.

### User Story 4 — Adding a language is content-only (Priority: P3)

The routing, metadata and CMS-fetch layers already understand locales, so introducing a second
language (e.g. PT or ES) is a content/config operation, not a rebuild.

**Why this priority**: Launch is English-only (per `001`); the model must not preclude locales.
Validated, not exercised, at launch → P3.

**Independent Test**: Confirm the locale is a first-class part of routing/metadata and the CMS
client can request a locale with a documented fallback (per `001` FR-020), using English as the
only populated locale.

**Acceptance Scenarios**:

1. **Given** the locale-aware structure, **When** a locale is added in config + content, **Then** no
   routing/metadata code changes are required to serve it.
2. **Given** a request for a locale with no translation, **When** served, **Then** the documented
   fallback applies (default locale) without error.

### Edge Cases

- A redirect source that is also a valid current route → must not shadow real pages.
- `hreflang` correctness once a second locale exists (self + alternate + `x-default`).
- Canonicals under a future locale prefix must point to the correct per-locale canonical.
- Trailing-slash / case variants of old URLs → normalized before redirecting.
- Staging/utility routes (`/v1`, `/preview/*`) MUST be excluded from sitemap and disallowed from
  indexing.

## Requirements *(mandatory)*

**Redirects**

- **FR-301**: The site MUST 301-redirect every known moved/renamed path to its current path in a
  single hop, defined in one maintainable map.
- **FR-302**: Redirects MUST NOT shadow valid current routes and MUST NOT form chains or loops.

**SEO**

- **FR-303**: Every public route MUST provide a unique title and meta description, a
  self-referential canonical URL, and Open Graph + Twitter card metadata.
- **FR-304**: The site MUST emit valid JSON-LD structured data for the Organization and for key
  content types (Article/Insight, Case study, and Book/Person where applicable).
- **FR-305**: The site MUST publish a `sitemap.xml` covering all public routes (including
  CMS-driven dynamic routes) and a correct `robots.txt`; staging/utility routes MUST be excluded and
  set `noindex`.
- **FR-306**: A canonical production base URL MUST be configured and used for canonicals, OG URLs,
  and sitemap entries.

**GEO (Generative Engine Optimization)**

- **FR-307**: The site SHOULD publish an AI-crawler guide (`llms.txt` or equivalent) mapping the
  firm's key pages, and MUST NOT block reputable AI crawler user-agents in `robots.txt`.
- **FR-308**: Key content pages SHOULD use semantic, answer-shaped structure (clear headings,
  self-contained summaries) to maximise AI citability.

**i18n readiness**

- **FR-309**: Routing and metadata MUST be locale-aware in a way that supports adding locales by
  config/content only, with English as the launch locale (no rebuild — aligns with `001` FR-019).
- **FR-310**: The CMS content client MUST be able to request a locale and apply the documented
  fallback when a translation is absent (aligns with `001` FR-020); at launch it requests English.
- **FR-311**: When a second locale exists, the site MUST emit correct `hreflang` alternates
  (including `x-default`); at launch this is a no-op with a single locale.
- **FR-312**: The site MUST present a **language switcher (flag affordance) at the top** of the page.
  Locales are **EN, PT, ES** (already registered in the CMS). The site MUST **always open in English
  by default** and MUST NOT auto-switch by geolocation; language changes only on explicit user
  selection.

### Key Entities

- **Redirect rule**: old path → new path, permanent. Maintained in one place.
- **Route SEO metadata**: per-route title, description, canonical, OG/Twitter, JSON-LD type.
- **Locale**: a supported language with a default/fallback; English is the only populated one at
  launch.

## Success Criteria *(mandatory)*

- **SC-301**: 100% of known moved URLs 301 to the correct destination in a single hop; 0 loops.
- **SC-302**: 100% of public routes have unique title + description + canonical + OG/Twitter tags.
- **SC-303**: JSON-LD validates for the Organization and each key content type (0 errors in a
  structured-data validator).
- **SC-304**: `/sitemap.xml` and `/robots.txt` exist, list only public routes, and exclude
  `/v1` + `/preview/*` (which are `noindex`).
- **SC-305**: `llms.txt` (or equivalent) is published and reputable AI crawlers are not disallowed.
- **SC-306**: Adding a second locale requires no change to routing/metadata code — config + content
  only (validated by a documented dry-run).

## Assumptions

- English-only content at launch (per `001`); locale work is *readiness*, exercised later.
- The CMS already models locale + translation-group and its read API accepts a locale (per `001`
  FR-019/020); the site consumes it via the existing `lib/cms/` client (`002`).
- A canonical production domain will be provided for absolute URLs.
- Redirect enforcement can run at the framework/edge layer (Next.js config or middleware).

## Decisions (approved by the user, 2026-07-24)

- **Canonical production domain = `corporatednaconsulting.com`.** Used for all canonicals, OG URLs
  and sitemap entries (FR-306). (`https://corporatednaconsulting.com`.)
- **i18n approach = URL prefix, with an explicit `en` prefix.** Locales route as `/en/...`,
  `/pt/...`, `/es/...`; the root `/` redirects to the default `/en`. (Not subdomains.) Library choice
  (`next-intl` vs. native App Router i18n) still per the research recommendation, but the routing
  shape is the prefix strategy.
- **Locales = EN, PT, ES** (already in the CMS); **EN is the default**, **no geolocation**; **flag
  switcher at the top** toggles on explicit selection (FR-312). *(from the 24-07 meeting)*

### Still pending (user will provide)

- **The complete old→new redirect map** — the user will send the old site's URLs later; a seed list
  (inferable from git history) is in `research.md`. Redirects can't be finalized until that arrives.
- Priority **GEO** topics/pages the firm most wants cited for *(nice-to-have)*.
