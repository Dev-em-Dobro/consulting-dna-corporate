# Phase 0 Research: i18n readiness, SEO/GEO & redirects

Each unknown is resolved with a recommended default; **⚠ confirm** marks items needing a one-line
client answer that have a safe default.

## D1 — i18n approach (how much to build now)

- **Decision**: Stage the **seams only** at launch: a `lib/i18n/config.ts` (`locales=['en']`,
  `defaultLocale='en'`, documented fallback), a `locale` parameter threaded through
  `lib/cms/client.ts`, and canonical/`hreflang` builders that are single-locale no-ops today. Adopt
  **`next-intl`** with **locale URL prefixes** (`/`, `/pt`, `/es`) when a second locale is funded.
- **Rationale**: Satisfies FR-309/FR-310 (adding a locale = config + content) without paying for a
  full i18n routing refactor while the site is English-only. `next-intl` is the App-Router-native
  choice (Next 16, Server Components) and URL-prefix routing is the most SEO-friendly (clean
  per-locale canonicals + `hreflang`).
- **Alternatives**: Native App-Router `[locale]` segment + hand-rolled message loading (more code,
  no library) — viable but reinvents `next-intl`. Subdomain/domain-per-locale — heavier ops, deferred.
- **RESOLVED (24-07 meeting)**: locales are **EN, PT, ES** (already registered in the CMS); **EN is
  the default**; **no geolocation** — language changes only on explicit selection.

## D1b — Language switcher UI (flags)

- **Decision**: A **flag-based language switcher at the top** of the page (in the header/nav),
  toggling EN/PT/ES. Default is always EN; selection is explicit and remembered (cookie/localStorage),
  never geolocated. At launch (EN-only content populated on the front end) the switcher can be
  shipped disabled/hidden or shown once PT/ES front-end wiring lands — coordinate with `010`
  (multi-language content surfaced by the read API).
- **Rationale**: Meeting: "bandeirinhas no topo, sempre abrindo em inglês por padrão (sem
  geolocalização)". A cookie-persisted explicit choice is the SEO-safe pattern (no auto-redirects).
- **Component**: a small `LanguageSwitcher` client component in the header; wires to the locale
  routing once `next-intl` prefixes are enabled (D1).

## D2 — Redirect seed map (301, single-hop)

From git history of the recent restructure (`d9b7f43`, `13ec334`, `e9a66d8`, `8f413b4`) plus the
routes named in `002`. **⚠ confirm** the full list; seed below:

| Old path | New path | Source |
|---|---|---|
| `/solutions/5h` | `/solutions/5h-framework` | 5H page moved (`13ec334`) |
| `/solutions/5h-framework/` variants | `/solutions/5h-framework` | normalize |
| `/solutions/flagship-cases` | `/cases` | cases moved out of /solutions (`e9a66d8`) |
| `/solutions/flagship-cases/:slug` | `/cases/:slug` | per-case detail moved |
| `/solutions/case-library` | `/cases` | library moved |
| `/solutions/cases` | `/cases` | catch old alias |

Rules: match is exact/normalized (trailing slash + case), `permanent: true`, destination is a live
route (verified against the route list), and no source equals a current valid path (FR-302). Any
externally-known legacy URLs (old marketing site, printed collateral) should be added here — **⚠
confirm** if any exist.

## D3 — Canonical domain (`SITE_URL`)

- **Decision**: Introduce `SITE_URL` env (e.g. `https://corporatednaconsulting.com`) used as
  `metadataBase` and for sitemap/OG/canonical absolute URLs.
- **Rationale**: Canonicals and OG require absolute URLs; centralizing avoids per-page hardcoding.
- **⚠ confirm**: the exact production domain (apex vs. `www`) — this also fixes the canonical host.

## D4 — SEO metadata implementation

- **Decision**: App Router **Metadata API**. Root `metadata` in `app/layout.tsx` (default title
  template `%s | Corporate DNA Consulting`, description, OG defaults, `metadataBase=SITE_URL`).
  `generateMetadata` on dynamic routes (`/cases/[slug]`, `/insights/[slug]`,
  `/solutions/regions/[region]`) pulling title/description/OG from CMS content. `app/sitemap.ts`
  enumerates static routes + CMS-driven slugs; `app/robots.ts` emits allow + sitemap ref and
  disallows `/preview` + `/v1`; those staging routes also set `robots: { index:false }` in their
  own metadata.
- **Rationale**: First-party, server-rendered, zero client JS, integrates with CMS fetches already
  in place (`002`).

## D5 — Structured data (JSON-LD) types

- **Decision**: `Organization` (+ `sameAs` socials, logo) site-wide; `Article` for insights;
  `Article`/`CaseStudy`-style for cases; `Book` on `/book`; `Person` on people where useful.
  Builders in `lib/seo/jsonld.ts`, injected as `<script type="application/ld+json">`.
- **Rationale**: Covers the page types the site actually has; improves rich results + AI parsing.

## D6 — GEO (Generative Engine Optimization)

- **Decision**: Publish **`llms.txt`** (curated map of key pages: what the firm does, 5H framework,
  cases, insights, contact) at the site root; keep reputable AI crawler user-agents **allowed** in
  `robots.txt`; ensure key pages use semantic headings and a self-contained summary near the top.
  Reuse the repo's `ai-seo` skill guidance for content shaping.
- **Rationale**: GEO citability comes from accessible + well-structured + answer-shaped content plus
  an explicit crawler guide; all low-cost and non-blocking (FR-307/FR-308).
- **⚠ confirm** (nice-to-have): the priority topics/queries the firm most wants to be cited for.

## D7 — Redirect enforcement layer

- **Decision**: `next.config.mjs` `async redirects()` (built from `lib/redirects.ts`). No custom
  middleware unless locale routing later needs it (then `next-intl` middleware handles locale and
  can compose with redirects).
- **Rationale**: Config redirects run at the edge, are declarative, and are the simplest correct
  option for static path moves.

## Summary of new configuration

| Env var | Scope | Purpose |
|---|---|---|
| `SITE_URL` | server | Canonical base URL for metadata/OG/sitemap (FR-306) |

Everything else (locales, redirect map, JSON-LD, llms.txt) is in-repo config/content, not secrets.
