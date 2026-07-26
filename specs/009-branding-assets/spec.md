# Feature Specification: Visual identity, brand assets & the "Our Identity" page

**Feature Branch**: `009-branding-assets`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Client meeting (fixes-reuniao-24-07) — visual identity / brand assets follow-ups:
recreated logo (Poppins, higher-contrast greys) in light + dark across the site; Guli's redesigned
inner-game/outer-game diagram; management of AI-generated imagery; and a dedicated **"Our Identity"**
page carrying the **awards & credentials** (with logos + per-award descriptions, incl. legacy
2008/09 material) that today exist only in the sales presentation.

## Overview

The site currently ships a single brand mark (`public/cdna-logo.svg`, used in
`components/SiteFooter.tsx` and the NavV1 header) and a mix of local brand imagery
(`public/book-cover.png`, `public/5H-methodology.jpg`, client logos consumed by
`components/LogoMarquee.tsx`). This feature refreshes and formalises the **visual identity layer**:
it swaps in the **recreated logo** (typeface Poppins, higher-contrast greys) in **both light and
dark** variants across header/footer/favicon/OG, adopts Guli's **redesigned inner/outer-game
diagram** on the methodology content, sets a clear **policy for AI-generated imagery** (where assets
live, dimensions/aspect ratios, alt text, no layout shift, allow-listed domains), and adds a
dedicated **"Our Identity" page** that surfaces the firm's **awards & credentials** — logos plus a
descriptive paragraph per award, including legacy 2008/09 items — which are not yet on the new site.

Scope boundaries: the **homepage awards-logos strip** is owned by `006-content-homepage-finishing`;
this feature owns the **full awards/credentials + identity story page**. The AI images referenced on
the 5H / libraries content relate to `007-content-libraries`; this feature defines the **asset
policy**, not that content. The **reduced "CDNA" monogram** logo variant is **deferred** pending a
team vote (see Assumptions).

## User Scenarios & Testing *(mandatory)*

### User Story 1 — The recreated logo appears correctly everywhere, light and dark (Priority: P1)

Every place the brand mark renders — header, footer, favicon and social/OG preview — uses the newly
recreated logo, with the correct light or dark variant for its background, at crisp resolution and
without layout shift.

**Why this priority**: The logo is the most visible brand signal; a stale or wrong-contrast mark
undermines the whole refresh. It is self-contained and delivers value immediately.

**Independent Test**: Load the site in light and dark contexts, inspect header, footer, browser tab
favicon and the OG image (share preview); confirm each shows the recreated mark in the correct
variant, sharp on high-DPI, with no reflow as it loads.

**Acceptance Scenarios**:

1. **Given** the recreated logo files are in place, **When** the header and footer render on a light
   and on a dark surface, **Then** each shows the correct light/dark variant with adequate contrast.
2. **Given** a page is shared to a social platform, **When** the OG/preview renders, **Then** it
   shows the recreated brand mark (not the old asset).
3. **Given** the logo asset loads, **When** the page paints, **Then** the mark occupies reserved
   space (explicit dimensions) so no cumulative layout shift occurs.
4. **Given** the browser tab, **When** the site loads, **Then** the favicon reflects the recreated
   mark across the required sizes.

### User Story 2 — Visitors can read the firm's awards & credentials on a dedicated page (Priority: P1)

A visitor reaches an **"Our Identity"** page and sees the firm's awards and credentials — each with
its logo and a descriptive paragraph — including legacy 2008/09 recognitions, telling the identity
story that today lives only in the sales deck.

**Why this priority**: Migrating the awards/credentials from the sales presentation to the live site
is a primary ask of the meeting and is missing content; it stands alone from the logo/imagery work.

**Independent Test**: Navigate to the "Our Identity" page from the nav; confirm each award renders
its logo, name and description, legacy 2008/09 items included, in a readable, responsive layout.

**Acceptance Scenarios**:

1. **Given** the awards data (logos + descriptions), **When** the "Our Identity" page renders,
   **Then** every award shows its logo, name and descriptive text.
2. **Given** legacy 2008/09 recognitions, **When** the page renders, **Then** they appear alongside
   current awards (visually distinguishable if dated).
3. **Given** an award logo is missing or fails to load, **When** the page renders, **Then** a
   readable text fallback (award name) is shown rather than a broken image.
4. **Given** the page exists, **When** a visitor uses the site navigation, **Then** the page is
   reachable via `lib/nav.ts` (single nav source) and has its own route.

### User Story 3 — Guli's redesigned inner/outer-game diagram replaces the old one (Priority: P2)

The methodology/5H content shows Guli's cleaner inner-game/outer-game diagram (grey/black/red
palette, no logo on the graphic, site URL as a watermark) in place of the current asset.

**Why this priority**: A content-quality upgrade tied to an external deliverable; the page works
today, so it is P2 and gated on the redesigned file being delivered.

**Independent Test**: On the methodology/5H content, confirm the rendered diagram is the redesigned
asset (correct palette, no logo, URL watermark), at the right dimensions with alt text and no
layout shift.

**Acceptance Scenarios**:

1. **Given** the redesigned diagram file is delivered, **When** the methodology content renders,
   **Then** it shows the new asset (not the old one) at correct aspect ratio with descriptive alt text.
2. **Given** the redesigned file is **not yet** delivered, **When** the content renders, **Then** the
   existing diagram remains (no broken image), so the swap is non-blocking.

### User Story 4 — AI-generated imagery is managed to a consistent standard (Priority: P3)

Pages using AI-generated imagery (5H framework, methodology, hero/section art from the design
partner) load fast, at the correct dimensions/aspect ratios, with alt text, from an allowed source,
with no layout shift.

**Why this priority**: A cross-cutting quality/governance concern; it improves consistency and
performance but does not add a user-facing feature on its own.

**Independent Test**: Audit each page using AI imagery; confirm every image is served via
`next/image` from an allow-listed source, has explicit dimensions and meaningful alt text, and
causes no layout shift.

**Acceptance Scenarios**:

1. **Given** an AI-generated image, **When** its page renders, **Then** it is served through
   `next/image` with explicit width/height (or fill + sized container) and no layout shift.
2. **Given** an image hosted on the CMS/CDN, **When** it renders, **Then** its host is allow-listed
   in `next.config.mjs` `images.remotePatterns` (otherwise `next/image` will refuse it).
3. **Given** any content image, **When** it renders, **Then** it has descriptive, non-empty alt text
   (or empty alt only when purely decorative).

### Edge Cases

- A page places the logo on a mid-tone/photographic background where neither light nor dark variant
  has enough contrast → the variant choice must be deterministic per surface, not left to chance.
- OG image caching: social platforms cache aggressively → the recreated OG asset must not collide
  with the old cached one (filename/version).
- An AI image delivered at the wrong aspect ratio → must not distort or crop meaningfully; target
  ratios are defined so assets are requested correctly.
- Awards data authored with a missing logo or an over-long description → the page must render
  gracefully (text fallback / truncation) rather than break layout.
- Favicon across formats/sizes (ICO/PNG/SVG, dark-mode favicon where supported) must degrade to a
  sensible default on browsers lacking a variant.
- A CMS-hosted award/AI image on a not-yet-allow-listed domain → will fail to render until the host
  is added to `remotePatterns`.

## Requirements *(mandatory)*

**Recreated logo (light/dark)**

- **FR-701**: The site MUST render the recreated logo (Poppins wordmark, higher-contrast greys) in
  the header and footer, choosing the **light or dark variant** appropriate to each surface.
- **FR-702**: The recreated mark MUST be applied to the **favicon** (required sizes/formats) and to
  the **OG / social preview** image, replacing the previous asset (with a filename/version that
  avoids stale social caches).
- **FR-703**: Logo assets MUST render via `next/image` (or equivalent) with **explicit dimensions**
  so no layout shift occurs, and MUST be crisp on high-DPI (vector `.svg` preferred where possible).
- **FR-704**: The **reduced "CDNA" monogram** variant MUST NOT be adopted in this feature; it is
  captured as **deferred** pending the team vote and MUST be trivially addable later without rework.

**"Our Identity" page (awards & credentials)**

- **FR-705**: The site MUST provide an **"Our Identity" page** on its own route, reachable through
  `lib/nav.ts` (the single nav source).
- **FR-706**: The page MUST list the firm's **awards & credentials**, each with its **logo**, name
  and a **descriptive paragraph**, including **legacy 2008/09** recognitions.
- **FR-707**: Award entries MUST fail safe: a missing/failed logo falls back to the award name; an
  absent description does not break layout.
- **FR-708**: Awards content SHOULD be a **maintainable list** (recommended: a CMS-managed content
  type so descriptions are editable, per `002` read-API pattern) with a **static fallback** if the
  CMS entry is unavailable. Final CMS-vs-static decision is an open input (see Dependencies).

**Inner/outer-game diagram**

- **FR-709**: When Guli's redesigned inner/outer-game diagram is delivered, the methodology/5H
  content MUST use it in place of the current asset, at correct aspect ratio, with descriptive alt
  text and no layout shift.
- **FR-710**: The swap MUST be **non-blocking**: until the redesigned file is delivered, the existing
  diagram MUST continue to render (no broken image).

**AI-generated imagery policy**

- **FR-711**: All content imagery (AI-generated hero/section art, 5H/methodology visuals) MUST be
  served through `next/image` with **explicit dimensions** (or `fill` + a sized container) so it
  causes **no layout shift**.
- **FR-712**: Remote/CMS/CDN-hosted images MUST be served from a host **allow-listed** in
  `next.config.mjs` `images.remotePatterns` (existing: `corporate-dna.b-cdn.net`, Bunny CDN); any new
  host MUST be added there.
- **FR-713**: Every content image MUST carry meaningful **alt text** (empty alt only for purely
  decorative images), and defined **target aspect ratios** MUST exist so assets are produced/ordered
  at the right dimensions.
- **FR-714**: The policy MUST document whether an asset belongs in local `public/` (via `next/image`
  static import) or on the CMS/CDN, with a default rule (see research).

### Key Entities *(include if feature involves data)*

- **Award / Credential**: A recognition shown on "Our Identity". Attributes: name, logo (image),
  description (paragraph), year/era (e.g. 2008/09 legacy flag), optional issuer/link, display order.
  Store: recommended CMS content type (editable) with static fallback — see research.
- **Brand asset**: A managed image (logo light/dark, favicon set, OG image, inner/outer diagram,
  AI-generated art). Attributes: variant (light/dark), format, intrinsic dimensions/aspect ratio,
  location (local `public/` vs CMS/CDN), alt text.

## Success Criteria *(mandatory)*

- **SC-701**: 100% of logo render sites (header, footer, favicon, OG) show the recreated mark in the
  correct light/dark variant, verified in both contexts, with zero layout shift on logo load.
- **SC-702**: The "Our Identity" page renders every provided award with logo + description (legacy
  2008/09 included) and is reachable from the site nav; 0 broken award images (text fallback works).
- **SC-703**: When the redesigned inner/outer diagram is supplied, the methodology content shows it
  (correct palette/no-logo/URL watermark) with alt text; before delivery, the old diagram still
  renders (no broken image).
- **SC-704**: 100% of audited content images are served via `next/image` from an allow-listed host,
  with explicit dimensions and non-empty alt text (decorative excepted); 0 layout-shift regressions.
- **SC-705**: No stale social-cache collision — the recreated OG image is served under a new
  filename/version so shares show the new mark.

## Assumptions

- The recreated logo will be delivered as **light and dark** files in web-appropriate formats (SVG
  preferred; PNG fallbacks and favicon/OG raster variants as needed).
- The site is Next.js 16 App Router with `next/image`; remote media is allow-listed via
  `next.config.mjs` `images.remotePatterns` (Bunny CDN `corporate-dna.b-cdn.net` already present).
- The **CDNA monogram** decision is pending a **team vote Guilherme will run** — treated as deferred,
  not blocking this feature.
- Awards descriptions (and legacy 2008/09 items) will be provided by Guilherme; recommended default
  is to store them as an editable CMS list with a static fallback so launch is not blocked on the CMS.
- The homepage awards-logos strip is delivered by `006-content-homepage-finishing`; AI imagery on
  the 5H/libraries content is `007-content-libraries` — this feature governs asset standards, not
  that content.

## Decisions (approved by the user, 2026-07-24) — this whole spec is DEFERRED for now

- **Logo (US1) = current logo is correct — NO action now.** The existing mark is fine as shipped. The
  swap to the redesigned logo happens **only when the new files are delivered** (not available yet).
  FR-701–FR-704 are on hold pending those assets.
- **"Our Identity" page + Awards (US2) = DEFERRED — not now.** Do not build the Our Identity page or
  the awards/credentials list yet. (Note: `006`'s home awards strip therefore also waits on this
  page's destination — both are later work.)
- **AI-generated imagery policy (US4) = DEFERRED — not now.** No AI-imagery audit/standardisation in
  this round.
- **Inner/outer-game diagram (US3) = pending Guli's file.** Non-blocking: keep the current asset;
  swap in Guli's redesign (grey/black/red, no logo, URL watermark) when he delivers it.

### Net effect

Nothing in `009` is actionable now — it is entirely gated on assets from Guilherme (logo files,
awards content, diagram) and an explicit go-ahead for the Our Identity page. Revisit when those
arrive.
