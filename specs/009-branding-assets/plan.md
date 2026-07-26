# Implementation Plan: Visual identity, brand assets & the "Our Identity" page

**Branch**: `009-branding-assets` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-branding-assets/spec.md`

## Summary

Refresh the site's **visual identity layer** and add the **awards/credentials** content. Swap the
recreated logo (Poppins wordmark, higher-contrast greys) into the header and footer with **light and
dark** variants chosen per surface, and apply it to the **favicon** and **OG image** via the App
Router `metadata` (there is currently no `icons`/`openGraph` metadata in `app/layout.tsx`). Build an
**"Our Identity" page** on its own route (recommend `/our-identity`, added to `lib/nav.ts`) that
renders the firm's awards & credentials — logo + description each, legacy 2008/09 included —
sourced from a **CMS-managed list with a static fallback** (per the `002` read-API pattern). Adopt
Guli's **redesigned inner/outer-game diagram** on the methodology content behind a **non-blocking
swap**, and codify an **AI-imagery policy** (all content images via `next/image`, explicit
dimensions/aspect ratios, alt text, allow-listed hosts). The **CDNA monogram** is deferred.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, `next/image`, `metadata` API for `icons`/`openGraph`)
· React 19 · Tailwind 4 · Poppins via `next/font/google` (already loaded in `app/layout.tsx`). CMS
read consumed over the existing HTTP read-API client (per `002`); no new runtime dependency.

**Storage**: No new store. Awards/credentials are (recommended) a **CMS content type** read over the
existing read API, with a **static fallback** array in the repo. Brand image binaries live in
`public/` (logo variants, favicon set, OG image, inner/outer diagram) or on the Bunny CDN.

**Testing**: Vitest (unit: awards fallback mapping; light/dark variant selection helper) · manual/
Playwright smoke of logo variants in light/dark surfaces, favicon, OG preview, the "Our Identity"
route, and the diagram swap · a Lighthouse/`next/image` audit asserting no layout shift.

**Target Platform**: Vercel — the site's existing deployment. Images optimised by `next/image`.

**Project Type**: Web application (Next.js App Router) — static/CMS-driven pages + shared components.

**Performance Goals**: Zero CLS from logo/diagram/AI-image loads (explicit dimensions); no oversized
raster shipped (SVG for the mark where possible); social share shows the recreated OG image.

**Constraints**: Light/dark variant choice must be deterministic per surface (FR-701); OG asset must
avoid stale social caches via a new filename/version (FR-702/SC-705); the swap of the diagram must
be non-blocking (FR-710); remote images must be allow-listed in `next.config.mjs` (FR-712); the CDNA
monogram must NOT be adopted yet but stay trivially addable (FR-704).

**Scale/Scope**: One logo set (light/dark + favicon + OG), one new page, one awards list, one
diagram swap, one imagery policy. Low complexity; mostly assets + one content route.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is the **unratified template** — no
binding gates. Self-imposed gates for this feature:

| Self-imposed gate | Status |
|---|---|
| No layout shift from brand/content images (explicit dimensions) | PASS — `next/image` + reserved space |
| Deterministic light/dark logo variant per surface | PASS — variant chosen by surface, not luck |
| Awards content editable but launch-safe | PASS — CMS list + static fallback |
| External deliverables are non-blocking (diagram, final logo) | PASS — swap only when delivered; old asset stays |
| Single nav source respected | PASS — route added to `lib/nav.ts` |
| Remote images allow-listed (upholds 002 media handling) | PASS — new hosts added to `remotePatterns` |
| Deferred scope stays deferred (CDNA monogram) | PASS — captured, not built |
| Simplicity / no premature complexity | PASS — assets + one page, no new services |

No violations requiring justification. **Recommendation**: ratify a real constitution
(`/speckit-constitution`) before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/009-branding-assets/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — logo variants, Our Identity route/store, imagery policy, diagram swap
├── data-model.md        # Phase 1 — Award/Credential shape + CMS mapping + static fallback (NOT created here)
├── contracts/
│   └── awards-api.md    # Phase 1 — CMS read shape for awards (NOT created here)
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── app/
│   ├── layout.tsx                 # MODIFY: add metadata.icons (favicon set) + metadata.openGraph (recreated OG image)
│   └── our-identity/
│       └── page.tsx               # NEW: "Our Identity" page — awards & credentials + identity story
├── components/
│   ├── SiteFooter.tsx             # MODIFY: swap /cdna-logo.svg → recreated variant (light/dark per surface)
│   ├── NavV1.tsx                  # MODIFY: header logo → recreated variant
│   ├── BrandLogo.tsx              # NEW (optional): logo component choosing light/dark variant by surface
│   ├── AwardsGrid.tsx             # NEW: renders awards (logo + name + description; legacy flag; text fallback)
│   └── InnerOuterDiagram.tsx      # NEW/MODIFY: methodology diagram wrapper (non-blocking swap to redesigned asset)
├── lib/
│   ├── nav.ts                     # MODIFY: add the "Our Identity" nav entry (single nav source)
│   └── awards.ts                  # NEW: fetch awards from CMS (per 002 read API) + static fallback list
├── public/
│   ├── cdna-logo.svg              # EXISTING (dark) — replaced/kept per recreated delivery
│   ├── cdna-logo-light.svg        # EXISTING light variant (already present)
│   ├── cdna-logo-horizontal.svg   # EXISTING · cdna-logo-horizontal-light.svg EXISTING
│   ├── logo-recreated-{light,dark}.svg  # NEW: recreated Poppins/high-contrast mark (on delivery)
│   ├── favicon.ico / icon.svg / apple-icon.png  # NEW: favicon set from recreated mark
│   ├── og-image.png               # NEW: recreated OG/social image (versioned filename)
│   ├── 5H-methodology.jpg         # EXISTING inner/outer diagram — replaced by redesigned asset on delivery
│   └── inner-outer-diagram.<ext>  # NEW: Guli's redesigned diagram (on delivery)
└── next.config.mjs                # MODIFY (if needed): add any new image host to images.remotePatterns
```

New/updated config: `next.config.mjs` `images.remotePatterns` currently allows
`corporate-dna.b-cdn.net` (Bunny CDN) — extend only if awards/AI images use a new host. No new env
expected unless awards live behind a CMS endpoint that needs a var (reuse `002`'s `CMS_URL` /
`CMS_READ_API_KEY`).

**Structure Decision**: Single Next.js app (this repo). The logo variant logic is centralised in an
optional `BrandLogo` component so header/footer share one deterministic light/dark rule. Awards are
isolated in `lib/awards.ts` (CMS fetch + static fallback) and rendered by `AwardsGrid` on the new
`/our-identity` route, added once to `lib/nav.ts`. The inner/outer diagram is wrapped so the swap to
Guli's redesigned file is a one-line, non-blocking change. Favicon/OG are set via the App Router
`metadata` API in `app/layout.tsx` (no such `icons`/`openGraph` metadata exists there today).

## Phase 0 — research (unknowns to resolve → `research.md`)

- **Recreated logo delivery**: which files (light/dark, SVG vs PNG), favicon sizes/formats, OG raster
  variant. *(NEEDS CLARIFICATION — safe default proposed.)*
- **"Our Identity" placement + store**: standalone `/our-identity` vs an About/Company section; CMS
  content type vs static. *(Recommend standalone route + CMS list with static fallback.)*
- **Awards content**: full list + descriptions + legacy 2008/09 items. *(NEEDS CLARIFICATION.)*
- **Inner/outer diagram**: delivery of Guli's redesigned file; non-blocking swap strategy.
- **AI-imagery policy**: local `public/` vs CMS/CDN default rule; target aspect ratios; alt-text rule.
- **CDNA monogram**: confirmed **deferred** (team vote) — captured, not built.

## Complexity Tracking

> No Constitution Check violations require justification. Complexity is deliberately minimal: an
> asset refresh (logo/favicon/OG), one content route with a CMS-or-static awards list, a non-blocking
> diagram swap, and an imagery policy. No new services, stores, or runtime dependencies. The CDNA
> monogram is explicitly out of scope to avoid churn before the team vote.
