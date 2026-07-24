# Phase 0 Research: Homepage finishing & global UI polish

Re-scoped after the 24-07 meeting. Each unknown has a recommended default; **⚠ confirm** marks items
needing a short client answer. (Map research → `008-maps`; libraries/detail + 5H → `007`; brand
assets + awards page → `009`.)

## D1 — Testimonials "metralhadora" video

- **Decision**: A `TestimonialsVideo` section inserted directly above `#impact` in `app/page.tsx`.
  Default behaviour **autoplay, muted, loop, `playsInline`** with a **poster** until ready and as the
  failure fallback; under `prefers-reduced-motion`, show the poster + a play control (no autoplay).
  Heading in the vein of *"What Fortune 500 leaders say about us."*
- **Hosting**: at launch use Guilherme's AI-generated reel (he will correct Rhea's name before
  sending). If delivered as an MP4, self-host in `public/` (or the CDN) and use native `<video>`; if
  on YouTube/Vimeo, use a poster→iframe facade to protect initial paint. Per `001`, videos are
  external/hosted references.
- **⚠ confirm**: the video file/URL, the poster image, and the final heading copy.

## D2 — Impact-number mark (the "minus sign" bug)

- **Decision**: Replace the leading brand mark before each stat with a **lower, shorter underline
  sat close beneath the number** (or a small upward arrow), so it never reads as a minus. Keep the
  brand-red styling. If review still reads it as negative, **remove the mark** and let the number +
  colour stand alone.
- **Rationale**: Directly fixes the reported "‑18 / ‑90%" misreading on the credibility section.
  The mark today is a small brand dash rendered before the `Counter` value; the fix is a style
  change at that call site.
- **⚠ confirm**: underline vs. arrow vs. none.

## D3 — Home awards/credentials logo strip

- **Decision**: A `AwardsStrip` component on the home showing the award/partner logos (optimised via
  `next/image`), linking through to the fuller awards / "Our Identity" page owned by `009`.
- **Rationale**: The logos exist in the sales deck's "Our Identity" page but are absent from the new
  home; the home needs at least the credibility strip while `009` builds the full page + descriptions.
- **⚠ confirm**: the award logo set for the strip and the destination href (coordinate with `009`).

## D4 — Homepage image swap + pending-slots tracking

- **Decision**: Keep a **pending-slots checklist** (slot → status → source). Local hero/section
  images go in `public/` and render via `next/image` with explicit `sizes`/aspect ratio; CMS-driven
  images come through the read API + CDN (Bunny, already allow-listed: `corporate-dna.b-cdn.net`).
  Any new delivery domain is added to `next.config.mjs` `remotePatterns`.
- **Rationale**: Prevents CLS and broken images and makes launch readiness visible (which of "as
  imagens que o Guli está fazendo" are still pending). Brand/AI-asset management + the recreated logo
  are `009`; this covers the homepage slots only.
- **⚠ confirm**: the homepage asset list + dimensions per slot, and the high-res leadership photo
  (FR-409).

## D5 — People / leadership cards

- **Decision**: In `PeopleGrid.tsx`, give every card a **uniform fixed height**, top-aligned, with
  the bio line-clamped (full bio stays in the existing pop-up); **enlarge the LinkedIn icon**; and
  swap the one photo whose background differs from the standard once the high-res asset arrives. The
  same grid is used on `/solutions/leadership`, so the fix lands both places.
- **Rationale**: Fixes the "escadinha" (stair-step) misalignment and the small LinkedIn icon called
  out in the meeting.

## D6 — Book CTA centring

- **Decision**: In the book section (`app/page.tsx` `#book`), vertically centre the text/CTA column
  within the section band (align-items centre) and adjust the "middle line" per design so the
  "Buy on Amazon" CTA sits centred.
- **⚠ confirm**: "meio" = vertical centring of the CTA column (assumed) and what the "middle line"
  adjustment should be.

## D7 — Footer links = menu (single source)

- **Decision**: `SiteFooter.tsx` renders its **primary** links from `siteNav` (`lib/nav.ts`) — the
  same source the header uses (`buildSiteNav()` in `lib/nav-server.ts`) — instead of its current
  separate `mainLinks` array (which points at anchors like `/#approach`, `/#people` that are
  conditionally hidden on the home). Legal/utility links (privacy/cookies/terms) stay.
- **Rationale**: Meeting: "os nomes no rodapé ainda estão na versão antiga — alinhar com
  Solutions/Insights". Sourcing from one place keeps them in sync as the menu evolves.

## Summary of new configuration

| Change | Where | Purpose |
|---|---|---|
| Extend `images.remotePatterns` | `next.config.mjs` | Only if a new media/video-poster domain is used |

No new secrets. Content comes from the existing CMS env; the video/images are assets.
