# Phase 0 Research: Content libraries redesign & detail pages

All unknowns from the plan are resolved below with a recommended default so implementation is
unblocked. Items marked **⚠ confirm** need a one-line answer from the client (or coordination with
`010-cms-enhancements` / `009-branding-assets`) but each has a safe default.

## D1 — Cases library: brand-coloured perspective logo card

- **Decision**: Each case card renders the client's **transparent-PNG logo** in a subtle perspective
  transform over a **CSS gradient built from the client's brand colour** (hex). Both fields are read
  from the CMS (via `lib/cms/`) as additive, optional properties on the case view model.
- **Rationale**: Matches the meeting's requested card style, is pure CSS/`next/image` (no runtime
  image processing, no perf hit), and layers cleanly onto the existing `CasesLibrary` island.
- **Fallback (FR-502)**: When brand colour and/or logo is absent (pre-`010`), the card degrades to a
  neutral brand-token gradient + the existing cover/title treatment — never a broken image or a
  dropped card.
- **Contrast safety**: The gradient derives from the brand hex via a tint/darken step (not the raw
  hex) so an extreme colour (near-white / low-contrast) keeps overlaid text/logo legible.
- **⚠ confirm**: exact brand-colour + logo field names and delivery host (defer to `010`).
- **Alternatives**: pre-baking gradient images in the CMS (rejected — inflexible, extra assets);
  reading the logo's dominant colour at runtime (rejected — needless complexity vs. an authored hex).

## D2 — Reading time: computed vs. CMS-stored

- **Decision**: **Compute** reading time on the server from the insight body word count
  (≈200 words/min, minimum "1 min read"), in a pure `lib/reading-time.ts` helper; **prefer a
  CMS-provided value if present**.
- **Rationale**: Guarantees the field is always shown (FR-506) without waiting on `010`, is
  deterministic and cache-friendly (runs at build/request time on already-fetched body HTML), and is
  trivially overridable once the CMS authors it.
- **⚠ confirm**: whether editors want to author reading time explicitly (then it wins over the
  computed value).
- **Alternatives**: client-side compute (rejected — body is server-fetched; avoid shipping it twice);
  requiring the CMS field now (rejected — blocks on `010`).

## D3 — Methodologies library: new content type vs. curated set

- **Decision**: Ship the Methodologies library over a **curated set** (the code-owned 5H® plus
  selected solutions/methodologies) rendered through the shared library primitive, **structured so a
  dedicated CMS `methodology` content type can back it later** without changing the UI.
- **Rationale**: Avoids introducing a new CMS content type before content volume justifies it, lets
  the third library ship on the existing read layer, and keeps 5H® pointing at its code-owned page.
- **⚠ confirm**: whether `010` will add a real `methodology` content type (then the curated set is
  replaced by a CMS fetcher behind the same view model).
- **Alternatives**: new CMS content type now (rejected — premature; couples this feature to `010`
  schema work); hardcoding the list with no view model (rejected — breaks the shared-structure goal).

## D4 — Shared library structure, three skins

- **Decision**: Generalise the existing `components/cases/CasesLibrary.tsx` into a
  `components/library/LibraryShell` primitive (search + facet filters + sort island over a
  server-provided list) parameterised by facets and a **card renderer**; Cases, Insights and
  Methodologies each provide their own card skin and facet config.
- **Rationale**: Satisfies "visually differentiated but same internal modularity" (FR-510) with one
  source of truth for filter/sort behaviour, so the three libraries can look distinct while sharing
  correctness. Cases keeps its search + tag + date controls; Insights uses tag + date; Methodologies
  uses tag (16:9 card).
- **Alternatives**: three independent library components (rejected — duplication, drift); a single
  over-configurable mega-component (rejected — harder to skin distinctly).

## D5 — Case-detail logo: one resolution-robust treatment

- **Decision**: Define a **single top-right logo slot** in `CaseView` with a fixed max box (e.g. a
  capped width/height with `object-contain` inside a defined aspect area) and `next/image` `sizes`,
  so the logo neither clips nor oversizes at any breakpoint; the logo source is the CMS transparent
  logo (same field as D1).
- **Rationale**: Fixes the current defect (bad result across resolutions) with one deterministic
  treatment rather than per-breakpoint guesses. Transparent PNG + `object-contain` avoids letterbox
  artefacts.
- **⚠ confirm**: logo delivery/field via `010` (shared with D1); whether a max on-screen size is
  specified by design.
- **Alternatives**: multiple per-breakpoint logo sizes (rejected — the source of the current
  inconsistency); CSS background-image (rejected — loses `next/image` optimisation).

## D6 — Insight detail = "Solutions layout" + cover gradient overlay

- **Decision**: Render `/insights/[slug]` through a new `InsightView` that mirrors the **Solutions
  detail layout** — title, rich-text body, image, and hero **banner** (the Solutions `bannerUrl`
  treatment) — with a **gradient overlay** composited over the cover image.
- **Rationale**: Reuses the proven `002` detail layout for consistency and low risk; the gradient
  overlay is the only new visual (a CSS layer over `next/image`). Keeps `notFound()` behaviour for
  absent/unpublished slugs (FR-508).
- **⚠ confirm**: precise meaning of the Solutions "banner" to mirror (recommended default: reuse the
  Solutions `bannerUrl` hero band).
- **Alternatives**: a bespoke insight layout (rejected — divergence, more surface to maintain).

## D7 — 5H® framework page: more explanatory, code-owned

- **Decision**: Keep `/solutions/5h-framework` as a **bespoke code component** (explicit meeting
  decision — lower break-risk, richer layout) and expand it to be more explanatory, foregrounding the
  methodology and using **AI-generated images** supplied by `009-branding-assets`.
- **Rationale**: A flagship narrative page benefits from a hand-built layout; keeping it out of the
  CMS removes a break vector and lets the copy/structure be as elaborate as needed.
- **⚠ confirm**: final AI imagery from `009-branding-assets`; the depth of the explanatory rewrite
  (copy owner).
- **Alternatives**: CMS-managed 5H® (rejected by the meeting decision).

## D8 — Solutions placeholders audit

- **Decision**: Audit the Solutions routes and ensure every content slot is CMS-backed with **no
  hardcoded placeholders** remaining (FR-514), reusing the `002` mappers/fallbacks.
- **Rationale**: Closes `002` SC-101 for the Solutions area; any residual placeholder undermines the
  "content-backed" claim.

## Dependency coordination

- **`010-cms-enhancements`** supplies: case **brand colour** + **transparent logo**, insight
  **author** (+ optional **reading time**), and (optionally) a **`methodology`** content type. This
  feature consumes them with fallbacks; ⚠ confirm exact field names and delivery host with `010`.
- **`009-branding-assets`** supplies: the 5H® AI imagery and any brand-gradient design tokens. ⚠
  confirm asset delivery.

## Summary of new / changed configuration

| Item | Scope | Purpose |
|---|---|---|
| `CMS_URL`, `CMS_READ_API_KEY` | server (existing) | Read API — unchanged |
| `BUNNY_CDN_URL` | server (existing) | Media delivery — unchanged |
| `next.config.mjs` `images.remotePatterns` | build (existing) | **Add a new host only if** `010` delivers transparent logos from a domain other than `corporate-dna.b-cdn.net` (FR-516) |

No new environment variables are expected. No new storage, no new service. The only potential config
change is one image-host allow-list entry, contingent on `010`'s logo delivery.
