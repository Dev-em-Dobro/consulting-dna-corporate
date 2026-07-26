# Implementation Plan: Homepage finishing & global UI polish

**Branch**: `006-content-homepage-finishing` | **Date**: 2026-07-24 (revised) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-content-homepage-finishing/spec.md`

## Summary

The homepage + global-UI finishing slice. Source the homepage Client-Impact cards from the CMS
(replace the hardcoded `cases` array in `app/page.tsx`); add a testimonials ("metralhadora") video
section directly above `#impact` (autoplay-muted-loop, poster fallback, reduced-motion aware); fix
the credibility-stat mark that reads like a minus sign; add a home awards/credentials logo strip;
swap final homepage imagery; polish people/leadership cards (uniform fixed height, larger LinkedIn
icon, off-pattern photo); centre the book CTA; and make `SiteFooter` render its primary links from
the single `siteNav` source. **Map work is in `008-maps`; content libraries + detail pages + the 5H
page are in `007-content-libraries`; brand assets + the awards/"Our Identity" page are in `009`.**

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, Server Components) · React 19 · Tailwind 4 · Zod 4
(boundary validation in `lib/cms/schemas.ts`) · `next/image`. Video via native `<video>` (hosted
MP4) or a lightweight YouTube facade (poster → iframe on interaction). No new runtime deps expected.

**Storage**: N/A — content from the CMS read API via `lib/cms/client.ts` (`002`).
`next.config.mjs` `images.remotePatterns` extended only if a new media/poster domain appears.

**Testing**: Vitest for any new CMS mapper/util; a parity assertion that footer links equal
`siteNav`; visual checks for the video (poster fallback, reduced-motion), the stat mark, fixed-height
cards (0px stair-step), and image CLS.

**Target Platform**: Vercel — existing site deployment. Video lazy/poster-first.

**Project Type**: Web application (Next.js App Router).

**Performance Goals**: No initial-paint regression — video poster-first/lazy, `next/image` with
explicit `sizes`, 0 CLS on image swaps and fixed-height blocks.

**Constraints**: 0 hardcoded case data on the home (SC-401); CMS fail-safe (`002` FR-104);
reduced-motion respected (video); footer parity sourced not duplicated (FR-411).

**Scale/Scope**: The homepage + `SiteFooter` + `PeopleGrid` (shared with `/solutions/leadership`);
one new video component; a handful of image slots.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution `.specify/memory/constitution.md` is the unratified template — no binding gates.
Self-imposed gates:

| Self-imposed gate | Status |
|---|---|
| No hardcoded content for the homepage cards | PASS — replace array with `lib/cms/` fetch (`002`) |
| Boundary validation / fail-safe rendering | PASS — reuse `lib/cms/schemas.ts` Zod parse |
| Reduced-motion + graceful degradation (video, images) | PASS — poster fallback, reduced-motion guard |
| Footer↔menu single source of truth | PASS — `SiteFooter` consumes `siteNav` (FR-411) |
| No initial-paint regression | PASS — poster-first video, `next/image` |
| No scope bleed into maps/libraries/branding | PASS — those are 008/007/009 |

No violations requiring justification. **Recommendation**: ratify a constitution before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/006-content-homepage-finishing/
├── plan.md              # This file
├── spec.md              # Feature specification (re-scoped)
├── research.md          # Phase 0 — video behaviour, stat mark, image plan, footer parity
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── app/
│   └── page.tsx                 # MODIFY: Client-Impact cards ← CMS; <TestimonialsVideo/> before #impact;
│                                #         fix stat mark; add <AwardsStrip/>; centre book CTA; swap images
├── components/
│   ├── TestimonialsVideo.tsx    # NEW: "metralhadora" video (autoplay-muted-loop, poster, reduced-motion)
│   ├── AwardsStrip.tsx          # NEW: home awards/credentials logo strip → links to 009 page
│   ├── Counter.tsx              # MODIFY (or its call site): stat leading-mark treatment (FR-404)
│   ├── PeopleGrid.tsx           # MODIFY: fixed-height cards, larger LinkedIn icon (FR-407/408/409)
│   └── SiteFooter.tsx           # MODIFY: primary links from siteNav (FR-411)
├── lib/
│   ├── cms/ (client.ts, map.ts, schemas.ts)  # EXTEND: homepage cases mapper
│   └── nav.ts / nav-server.ts   # SOURCE for footer parity (no new hardcode)
├── next.config.mjs               # MODIFY only if a new media/poster domain is introduced
└── public/                      # final homepage assets; pending-slots list tracked in research
```

**Structure Decision**: Single Next.js app. This feature is homepage + global-polish edits reusing
the existing `002` CMS client and `next/image`; the only new components are the testimonials video
and the awards strip. Everything map-related edits `components/Locations*` under `008-maps`;
everything library/detail edits the route pages under `007-content-libraries`; brand assets and the
awards page live in `009-branding-assets`. Footer↔menu parity is achieved by having `SiteFooter`
consume the same resolved nav as the header.

## Phase 0 — research (unknowns → `research.md`)

- Testimonials **video**: hosting/behaviour + poster + heading copy.
- **Stat mark** treatment (underline vs. arrow vs. none).
- **Image plan** + pending-slots tracking; the high-res leadership photo (FR-409).
- **Footer parity**: how to flatten `siteNav` into the footer's link style.

## Complexity Tracking

> No Constitution Check violations. Scope is a set of small, mostly-independent homepage/global edits
> reusing existing infrastructure. The only new components are the video section and the awards
> strip; the rest are modifications. Related concerns were deliberately split to 007/008/009 to keep
> this feature coherent and shippable on its own.
