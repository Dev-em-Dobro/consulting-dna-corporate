# Phase 0 Research: Visual identity, brand assets & the "Our Identity" page

All NEEDS CLARIFICATION items from the plan are resolved below with a recommended default so
implementation is unblocked; items marked **⚠ confirm** need a one-line answer from the client but
have a safe default. Repo facts confirmed by reading: `app/layout.tsx` loads Poppins and defines
`title`/`description` but **no `icons` and no `openGraph`** metadata; `components/SiteFooter.tsx`
and NavV1 render `/cdna-logo.svg`; `public/` already holds `cdna-logo.svg`, `cdna-logo-light.svg`,
`cdna-logo-horizontal.svg`, `cdna-logo-horizontal-light.svg`, `5H-methodology.jpg`; `next.config.mjs`
`images.remotePatterns` allows `corporate-dna.b-cdn.net` (Bunny CDN); `lib/nav.ts` is the single nav
source (Solutions + Insights).

## D1 — Recreated logo: variants, formats & where they render

- **Decision**: Deliver the recreated mark as **SVG** in **light** and **dark** variants; render via
  `next/image` (or existing `<img>` with explicit height, as the footer does today) with **explicit
  dimensions**. Header/footer pick the variant by **surface**: dark mark on light surfaces (footer is
  `bg-white`), light mark on dark surfaces (e.g. the `bg-ink` band). Centralise the choice in an
  optional `BrandLogo` component so the rule is deterministic, not per-call.
- **Rationale**: SVG is crisp on high-DPI and free of CLS when sized; the repo already ships
  light/dark SVG variants, so the pattern is established. A single component prevents the
  "wrong-contrast-on-mid-tone" edge case.
- **Alternatives**: A single mark + CSS `filter`/`currentColor` recolour — fragile for a two-tone
  greyscale wordmark; rejected. PNG-only — heavier and blurs on high-DPI; keep PNG only as favicon/OG
  raster.
- **⚠ confirm**: final file names/formats for the recreated light + dark mark (proposed
  `public/logo-recreated-light.svg` / `logo-recreated-dark.svg`).

## D2 — Favicon & OG image via the App Router metadata API

- **Decision**: Add `metadata.icons` (favicon set: `icon.svg`, `favicon.ico`, `apple-icon.png`) and
  `metadata.openGraph.images` (a recreated `og-image.png`) in `app/layout.tsx`. Ship the OG image
  under a **new, versioned filename** (e.g. `og-image-v2.png`) so social platforms don't serve the
  old cached preview.
- **Rationale**: `app/layout.tsx` has neither `icons` nor `openGraph` today, so both are additive.
  The metadata API is the idiomatic Next 16 way to wire favicons/OG. Versioning the OG filename is
  the standard cure for aggressive social-cache (SC-705).
- **Alternatives**: File-convention icons (`app/icon.svg`, `app/opengraph-image.png`) — also valid
  and even simpler; acceptable substitute. Manual `<link>` tags in `<head>` — avoided (metadata API
  is preferred). **⚠ confirm** whether the OG raster is delivered or must be generated from the mark.

## D3 — "Our Identity" route & information architecture

- **Decision**: A **standalone route `/our-identity`** (`app/our-identity/page.tsx`), added to
  `lib/nav.ts` as a top-level entry (or under a future About/Company group). It carries the
  **awards & credentials** (logos + descriptions, legacy 2008/09 included) plus the identity story.
- **Rationale**: The awards/credentials are a self-contained, linkable story that currently lives
  only in the sales deck; a dedicated route is the cleanest migration and is easy to feature in nav.
  Keeping it separate from the homepage awards strip (owned by `006`) avoids overlap.
- **Alternatives**: Fold it into an existing About/Company section — viable if such a section is
  planned; can be re-parented later without changing the page body. **⚠ confirm** standalone route
  vs. About/Company placement, and the exact path/label.

## D4 — Awards data store: CMS content type vs static

- **Decision**: Store awards as a **CMS-managed content type** (name, logo, description, year/era +
  legacy flag, optional issuer/link, order), read over the existing `002` read API, with a **static
  fallback array** (`lib/awards.ts`) so the page renders even if the CMS entry is absent.
- **Rationale**: Guilherme supplies (and will likely revise) the descriptions and legacy items;
  making them editable in the CMS avoids code changes per edit, consistent with `002`'s read-only
  consumption pattern. The static fallback keeps launch unblocked before the CMS entries exist.
- **Alternatives**: Purely static list in-repo — simplest but every copy edit is a deploy; keep only
  as the fallback. **⚠ confirm** whether the CMS will get an "awards/credentials" content type now,
  or we launch on the static list and migrate.

## D5 — Awards content (list + descriptions + legacy 2008/09)

- **Decision**: Treat the **award list, per-award descriptions and legacy 2008/09 items as inbound
  content** from Guilherme; model the entity to accept a `year`/`era` and a `legacy` flag so dated
  recognitions render distinguishably. Provide a text fallback (award name) when a logo is
  missing/broken.
- **⚠ confirm**: the full list of awards, their logos, description text, and which items are the
  2008/09 legacy recognitions.

## D6 — Inner/outer-game diagram swap (non-blocking)

- **Decision**: Wrap the methodology diagram in `InnerOuterDiagram` pointing at the current
  `public/5H-methodology.jpg`; when Guli delivers the **redesigned** file (grey/black/red, no logo,
  site-URL watermark), swap the source in one place. Until then, the existing diagram renders.
- **Rationale**: Decouples the content from an external deliverable (FR-710); avoids a broken-image
  window. The wrapper also enforces explicit dimensions + alt text so the swap can't introduce CLS.
- **⚠ confirm**: delivery of Guli's redesigned diagram file (format + intrinsic dimensions).

## D7 — AI-generated imagery policy

- **Decision**: **Default location rule** — brand/structural art that changes rarely (logo, diagram,
  hero/section art tied to a page) lives in **local `public/`** and is imported through `next/image`
  (build-time optimisation, no allow-listing needed); **editor-managed** imagery lives on the **Bunny
  CDN / CMS** and is served through `next/image` from an **allow-listed host**. Every content image
  MUST have **explicit dimensions** (or `fill` + a sized container) and **meaningful alt text**
  (empty alt only for decorative). Define **target aspect ratios** per slot (e.g. hero, section,
  diagram, award logo) so assets are produced at the right size.
- **Rationale**: `next/image` already governs images and remote media is allow-listed
  (`corporate-dna.b-cdn.net`) per `002`; codifying the local-vs-CDN split and the dimensions/alt-text
  rule prevents CLS and broken remote images (FR-711–714). AI provenance doesn't change the handling.
- **Alternatives**: All imagery on the CDN — centralises delivery but needs an upload step for static
  brand art; keep static brand art local. Any **new** image host must be added to
  `next.config.mjs` `images.remotePatterns` or `next/image` will refuse it.

## D8 — CDNA monogram (deferred)

- **Decision**: **Do not adopt** the reduced "CDNA" monogram in this feature. Capture it as deferred
  pending the **team vote Guilherme will run**; structure the logo component so a monogram variant
  can be added later (e.g. a `variant="monogram"` prop) without rework.
- **Rationale**: Building it before the vote risks churn; the wordmark refresh stands on its own.

## Summary of decisions & config

| Item | Decision (default) | Confirm? |
|---|---|---|
| Logo variants | Recreated **light + dark SVG**, deterministic per surface via `BrandLogo` | ⚠ files |
| Favicon / OG | App Router `metadata.icons` + `openGraph`; OG under versioned filename | ⚠ OG raster |
| "Our Identity" route | Standalone `/our-identity`, added to `lib/nav.ts` | ⚠ route vs About |
| Awards store | CMS content type (per `002`) + **static fallback** in `lib/awards.ts` | ⚠ CMS now? |
| Awards content | List + descriptions + 2008/09 legacy from Guilherme; `legacy` flag | ⚠ content |
| Inner/outer diagram | Wrapped, **non-blocking** swap to Guli's redesigned file | ⚠ delivery |
| AI imagery | Local `public/` (static) vs Bunny CDN (editor); `next/image` + dims + alt | — |
| CDNA monogram | **Deferred** (team vote); component kept extensible | — |

| Config / file | Change |
|---|---|
| `next.config.mjs` `images.remotePatterns` | Extend only if awards/AI images use a **new** host (Bunny `corporate-dna.b-cdn.net` already allowed) |
| `app/layout.tsx` metadata | ADD `icons` + `openGraph` (currently absent) |
| `lib/nav.ts` | ADD "Our Identity" entry |
| Env | Reuse `002`'s `CMS_URL` / `CMS_READ_API_KEY` if awards are CMS-managed; no new env otherwise |
