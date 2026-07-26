# Content cadastro — launch checklist

**Created**: 2026-07-24 (from the `fixes-reuniao-24-07` meeting) · **Owner**: content/editorial (in
the CMS) · **Type**: operational checklist, not a feature spec.

This tracks the actual **data entry** of launch content into the CMS (feature `001`), which the site
then renders via the read API (`002`). It is distinct from the engineering that makes the fields
exist (`010-cms-enhancements`) and the pages that render them (`006`, `007`, `009`). A route only
goes live once its content here is entered and published.

> Legend: ☐ not started · ◐ in progress · ☑ done. Fill as content lands.

## Content to enter

| # | Content type | What to enter | Feeds page(s) | Needs field from | Status |
|---|---|---|---|---|---|
| 1 | **Solutions** | The **5 Solutions** (full copy each) | `/solutions`, `/solutions/[slug]` | 001 | ☐ |
| 2 | **Cases** | Case studies (challenge, approach, outcome, metric, quote, video, cover) + **client brand colour** + **transparent PNG logo** | `/cases` (+ `[slug]`), homepage Client-Impact | 010 (brand colour, logo, video) | ☐ |
| 3 | **Insights** | Articles (title, body, image, **author**, date, **reading time**), tags | `/insights` (+ `[slug]`) | 010 (author, reading time) | ☐ |
| 4 | **Legal pages** | Privacy, Cookies, Terms — **the actual texts** (pages exist, copy missing) | `/privacy`, `/cookies`, `/terms` | 001/010 (legal rich-text fields) | ☐ |
| 5 | **People** | **LinkedIn URL** per person (+ confirm bios/photos; one photo needs high-res, off-pattern background) | homepage People, `/solutions/leadership` | 010 (LinkedIn field) | ☐ |
| 6 | **Regions** | The 5 regions with **coordinates, country, address, tel, email**, office-vs-coverage flag | homepage offices map, world map (`008`) | 010 (region map fields) | ☐ |
| 7 | **Awards** | Award/credential entries: logo + **description per award**, incl. **legacy 2008/2009** | home awards strip (`006`), "Our Identity" page (`009`) | 009/010 (Awards content type) | ☐ |
| 8 | **Methodologies** | Methodology entries (16:9 imagery) for the Methodologies library | `007` methodologies library | 010 (if a new type) | ☐ |
| 9 | **Singletons** | Book, 5H page notes — NB **5H page is code-owned, NOT CMS-managed** (decision) | `/book`, `/solutions/5h-framework` | — | ☐ |

## Cross-cutting notes

- **Multi-language**: EN/PT/ES locales are already registered in the CMS. Launch renders **EN** on
  the front end; PT/ES content entry can proceed but is surfaced only once `005` (front-end i18n) +
  `010` (locale read API) land. Default is always EN, no geolocation.
- **Media discipline**: uploads must respect the size/aspect limits from `010` so entered content
  can't break layout (e.g. transparent PNG logos, 16:9 methodology images).
- **No draft leakage**: only **published** entries appear on the site (`002` FR-105) — entering
  content as draft is safe for staging.
- **Dependencies**: items marked "Needs field from 010" are blocked until those CMS fields ship; the
  rest can be entered against the existing `001` model now.

## Suggested order

1. People (LinkedIn) + Regions → unblocks home People + maps.
2. Cases (after 010 brand-colour/logo fields) → unblocks `/cases` + homepage Client-Impact.
3. Solutions + Insights → unblock those libraries.
4. Awards + Methodologies → unblock `009` "Our Identity" + `007` methodologies.
5. Legal texts → flip legal pages live.
