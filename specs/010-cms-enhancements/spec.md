# Feature Specification: CMS enhancements — video embeds, case branding, media limits, i18n read API & regions/maps data

**Feature Branch**: `010-cms-enhancements`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Client meeting transcript (fixes-reuniao-24-07) — editor/content-model/read-API fixes:
add YouTube video embeds to the editor; add client brand colour + transparent-PNG logo to cases;
enforce image size/proportion limits; serve EN/PT/ES over the read API with fallback; expose the
regions↔maps data (city, country, coordinates, zoom, address, contacts, office-vs-coverage flag);
and make sure the schema/fields exist to "cadastrar" all launch content (5 solutions, cases,
insights, legal texts, people LinkedIn URLs, regions, awards).

## Overview

This feature is **work in the separate CMS project** (`corporate-dna-cms`), NOT the marketing
site. It **extends feature `001-custom-cms`** — the standalone headless CMS built on Next.js 16
(App Router), Drizzle ORM over Neon serverless Postgres, Auth.js + TOTP MFA, Bunny.net media, and
Zod validation — that already owns the content types (cases, solutions, people, regions, insights
+ singleton pages) and exposes a published read API the site consumes (feature `002`).

The planning artifacts live in **this** repo's `specs/` folder for tracking, but every requirement
below is **implemented in the `corporate-dna-cms` repository** (`E:\projetos\corporate-dna-cms`).

The meeting surfaced six content-model/editor/read-API gaps needed for launch. Each enhancement
extends an existing `001` capability and surfaces through the **published read API** so the
downstream site features can integrate: `007-content-libraries` consumes the new case fields,
`008-maps` consumes the region geodata, and `005-i18n-seo-redirects` consumes the localised read
API. None of these change the `001` non-negotiables: the CMS stays a separate project, the read API
never leaks drafts, and MFA/RBAC/audit continue to hold for all new authoring surfaces.

## User Scenarios & Testing *(mandatory)*

Actors are **editors** (author content) and **administrators** (editors + user/role/config
management), per `001` FR-014.

### User Story 1 — Editor embeds a YouTube video in content (Priority: P1)

Today the CMS editor has **no video support**. An editor opens a content entry that needs a video
(a case, an insight, or a video-bearing singleton page), pastes a **YouTube link**, sees it
validated and previewed as an embed, and publishes. The video surfaces in the read API as an
external reference (not an uploaded file), consistent with `001` FR-012 (videos are external
embeds, never uploaded).

**Why this priority**: Video is a launch content requirement the editor literally cannot fulfil
today, and it is the single most-requested editor gap from the meeting. It is independently
valuable the moment one content type accepts a video.

**Independent Test**: As an editor, add a YouTube URL to a case, confirm an invalid/non-YouTube URL
is rejected, publish, then call the read API for that case and confirm it returns the normalised
video reference (canonical URL + video id); confirm preview renders the embed.

**Acceptance Scenarios**:

1. **Given** an editor on a video-enabled content type, **When** they paste a valid YouTube URL
   (watch, short `youtu.be`, or embed form) and save, **Then** the value is accepted, normalised to
   a canonical reference, and previewed as an embed.
2. **Given** a malformed or non-YouTube URL, **When** the editor saves, **Then** validation blocks
   it with a specific message and nothing is stored.
3. **Given** a published entry with a video, **When** the site requests it via the read API, **Then**
   the response includes the external video reference (no binary, no draft leakage).

---

### User Story 2 — Editor sets a case's brand colour and uploads a transparent logo (Priority: P1)

An editor opens a **Case** and sets the client's **brand colour** (a hex value the site uses to
generate a gradient on case cards/headers) and uploads the client **logo** as a **transparent
PNG**. Both are validated (valid hex; PNG with alpha transparency; within size/proportion limits)
and both surface via the read API so feature `007` can render branded case cards.

**Why this priority**: Feature `007`'s case library is blocked without these fields; they are the
core new content-model change from the meeting and are independently testable on the Case type
alone.

**Independent Test**: As an editor, set a valid `brandColor` and upload a transparent PNG logo on a
case; confirm an invalid hex and a non-transparent/oversized image are rejected; publish; confirm
the read API returns `brandColor` and the logo delivery URL.

**Acceptance Scenarios**:

1. **Given** a Case, **When** the editor enters a valid hex brand colour (e.g. `#0A7C6B`), **Then**
   it is stored and returned by the read API as `brandColor`.
2. **Given** a Case, **When** the editor uploads a transparent PNG logo within limits, **Then** it
   is stored in Bunny.net and its delivery URL surfaces via the read API.
3. **Given** an invalid hex, a non-PNG, a PNG without transparency, or an out-of-limit image,
   **When** the editor tries to save, **Then** the specific validation error is shown and nothing is
   persisted.

---

### User Story 3 — Uploads cannot break the site layout (Priority: P2)

An editor uploads images across content types. The CMS **enforces per-field size/proportion
constraints** (max dimensions, max file size, and where relevant a required aspect ratio — e.g.
16:9 for methodology imagery, transparent PNG for logos) so a bad upload can never break the site
layout. This **extends `001` FR-013** (type/size validation) with dimension/ratio rules.

**Why this priority**: Protects launch quality and depends on the media pipeline already existing;
valuable but not blocking a single content type, so P2.

**Independent Test**: Upload images that violate max dimensions, max file size, and a required
aspect ratio for a constrained field; confirm each is rejected with a clear reason; upload a
compliant image and confirm it is accepted.

**Acceptance Scenarios**:

1. **Given** a field with a required aspect ratio, **When** an editor uploads an image outside the
   tolerance, **Then** the upload is rejected with the expected ratio stated.
2. **Given** the configured max dimensions/file size, **When** an oversized image is uploaded,
   **Then** it is rejected before it reaches published output.
3. **Given** a compliant image, **When** it is uploaded, **Then** it is accepted and attachable.

---

### User Story 4 — Read API serves the requested locale with fallback (Priority: P2)

EN/PT/ES are already registered locales in the CMS (`001` FR-019). This enhancement guarantees the
**read API serves the requested locale** and applies a **documented fallback** when a translation
is missing, so the site (`005`) can integrate multi-language on the front end. This **realises
`001` FR-020** end-to-end.

**Why this priority**: Multi-language is a launch expectation, but the site can render a single
default locale before the fallback contract is finalised, so P2.

**Independent Test**: Populate an entry in EN and PT (not ES); request each locale from the read API
and confirm EN and PT return their translations and ES returns the documented fallback (default
locale content, flagged as fallback) — never an error, never a draft.

**Acceptance Scenarios**:

1. **Given** an entry translated in a requested locale, **When** the read API is queried with that
   locale, **Then** the localised content is returned.
2. **Given** a requested locale with no translation, **When** the read API is queried, **Then** the
   documented fallback applies (default locale content, marked as fallback) with no error.
3. **Given** any locale request, **When** the entry is a draft, **Then** it is still not returned
   (locale must never bypass the published-only rule — `001` SC-003).

---

### User Story 5 — Regions expose the data the maps need (Priority: P2)

An editor opens a **Region** and fills the fields the site maps (`008`) require: **city**,
**country**, **coordinates (lat/lng)**, default **zoom**, **address lines**, **tel**, **email**,
and a flag distinguishing a **physical office** from a **coverage-only country**. All surface via
the read API so `008` can plot offices and shade covered countries.

**Why this priority**: Feature `008` is blocked without this geodata, but the region content type
already exists (`001`), so this is an additive field set rather than a new type — P2.

**Independent Test**: Populate a physical-office region (with coordinates) and a coverage-only
region (country, no office); confirm the read API returns all fields including the office/coverage
flag; confirm coordinate validation rejects out-of-range lat/lng.

**Acceptance Scenarios**:

1. **Given** a physical-office region, **When** the read API returns it, **Then** it includes city,
   country, lat/lng, zoom, address lines, tel, email and `locationType = office`.
2. **Given** a coverage-only region, **When** the read API returns it, **Then** it includes country
   and `locationType = coverage`, with office-only fields optional/empty.
3. **Given** an out-of-range latitude or longitude, **When** the editor saves, **Then** validation
   blocks it.

---

### User Story 6 — All launch content is "cadastrável" (schema readiness) (Priority: P3)

Every launch content item can be entered because the **model/fields exist**: the 5 Solutions,
Cases, Insights, **legal-page rich text** on legal singletons, **LinkedIn URL** on Person, Regions,
and **Awards**. (Actual data entry is an operational checklist owned elsewhere; this story only
guarantees the schema/fields are present and validated.)

**Why this priority**: Enables the launch content-entry sprint but is a modelling guarantee rather
than a runtime feature, so P3.

**Independent Test**: Confirm each launch item has a home in the schema: Person has a validated
LinkedIn URL field; legal singletons hold rich text; an Awards list/type exists; solutions, cases,
insights and regions accept the launch fields — verified by creating one entry of each.

**Acceptance Scenarios**:

1. **Given** a Person, **When** the editor enters a LinkedIn URL, **Then** it is validated (URL /
   `linkedin.com`) and returned by the read API.
2. **Given** a legal singleton (privacy/cookies/terms), **When** the editor enters the legal text,
   **Then** it is stored as validated rich text and returned by the read API.
3. **Given** the Awards content (type or singleton list — see `009`), **When** an award is entered,
   **Then** it is stored and returned by the read API.

### Edge Cases

- A YouTube URL points at a private/deleted/age-restricted video → stored as-is (the CMS validates
  URL shape, not availability); the site handles an unplayable embed gracefully.
- A brand colour with poor contrast against text on the gradient → out of scope for validation
  (editorial choice); the site owns contrast handling. Only hex validity is enforced.
- A "transparent" PNG that is actually fully opaque → flagged: the logo field requires an alpha
  channel with some transparency (⚠ confirm strictness — recommend: require alpha channel present).
- An image that meets file-size but not aspect-ratio (or vice-versa) → rejected with the specific
  failing rule named.
- A locale requested that is not one of EN/PT/ES → treated as unsupported → documented fallback to
  the default locale (⚠ confirm default = EN).
- A region marked `office` but missing coordinates → publish blocked (offices must be plottable);
  coverage-only regions do not require coordinates.
- An Awards entry whose ownership overlaps `009` → coordinate so Awards is defined once (⚠ confirm
  whether Awards is a new content type here or owned by `009`).

## Requirements *(mandatory)*

Functional requirements use the **FR-8xx** range. All are implemented in `corporate-dna-cms`.

**Video embeds**

- **FR-801**: The CMS editor MUST allow embedding a video via a **YouTube link** on the content
  types that need one (recommended: cases, insights, and video-bearing singleton pages — ⚠ confirm
  exact set), storing it as an **external reference** (never an upload), consistent with `001`
  FR-012.
- **FR-802**: The CMS MUST validate the video link (accept YouTube watch / `youtu.be` / embed
  forms; reject other/malformed URLs) and **normalise** it to a canonical reference (video id +
  canonical URL).
- **FR-803**: The read API MUST expose the video reference on entries that carry one, so the site
  can render the embed.

**Case branding**

- **FR-804**: The **Case** content type MUST gain a **brand colour** field storing a validated hex
  colour (identifier `brandColor`); the read API MUST return it.
- **FR-805**: The **Case** content type MUST support uploading a client **logo** as a **transparent
  PNG**, validated for PNG format, alpha transparency, and the logo size/proportion limits; the read
  API MUST return its delivery URL.
- **FR-806**: Brand colour and logo MUST surface via the read API for the marketing site
  (`007-content-libraries` consumes both to generate case-card gradients and render logos).

**Media size/proportion limits**

- **FR-807**: The CMS MUST enforce **per-field upload constraints** — maximum dimensions, maximum
  file size, and (where a field requires it) a **required aspect ratio** — extending `001` FR-013's
  type/size validation, so editor uploads cannot break the site layout.
- **FR-808**: Aspect-ratio and transparency rules MUST be **configurable per field** (e.g. 16:9 for
  methodology imagery; transparent PNG for logos), with sensible defaults (recommended in
  `research.md`).

**Multi-language read API**

- **FR-809**: The read API MUST accept a requested locale from **{EN, PT, ES}** and return that
  locale's content when present (realising `001` FR-020).
- **FR-810**: When a requested locale has no translation, the read API MUST apply the **documented
  fallback** (default locale content, flagged as fallback) without error and without ever returning
  a draft.

**Regions ↔ maps data**

- **FR-811**: The **Region** content type MUST expose the fields the maps feature (`008`) needs:
  **city**, **country**, **coordinates (lat/lng)**, default **zoom**, **address lines**, **tel**,
  **email**, and a **`locationType`** flag distinguishing a **physical office** from a
  **coverage-only** country.
- **FR-812**: Coordinate values MUST be validated (lat ∈ [−90, 90], lng ∈ [−180, 180]); a region
  flagged as an **office** MUST have coordinates before it can be published; coverage-only regions
  MUST NOT require coordinates.
- **FR-813**: All region maps fields MUST surface via the read API for `008`.

**Launch content schema readiness**

- **FR-814**: The **Person** content type MUST include a validated **LinkedIn URL** field, surfaced
  via the read API.
- **FR-815**: The **legal singleton pages** (privacy, cookies, terms) MUST hold **validated rich
  text** for their body copy, surfaced via the read API.
- **FR-816**: The model MUST provide a home for **Awards** (a dedicated content type or a singleton
  Awards list — coordinate with `009`), surfaced via the read API.
- **FR-817**: The **Solutions (×5), Cases, Insights and Regions** types MUST accept all launch
  fields so launch content can be entered without further schema change (schema readiness only;
  data entry is an external operational checklist).

**Cross-cutting (inherited from `001`, MUST still hold)**

- **FR-818**: All new authoring surfaces MUST remain behind Auth.js sessions + RBAC, be recorded in
  the audit log, and MUST NOT leak drafts on the published read API (`001` FR-014/015/016, SC-003).
- **FR-819**: Schema changes MUST be delivered as **drizzle-kit migrations**; new/changed fields
  MUST be validated with **Zod** at the authoring boundary and reflected in the read-API contract.

### Key Entities *(new / changed fields)*

- **Case** *(changed)*: adds `videoRef` (external YouTube reference), `brandColor` (validated hex),
  `logoAsset` (transparent-PNG media reference). Existing challenge/approach/outcome/quote/cover and
  facets unchanged.
- **Insight (Article)** *(changed)*: adds optional `videoRef`.
- **Singleton Pages** *(changed)*: video-bearing pages gain an optional `videoRef` (⚠ confirm which
  singletons).
- **Region** *(changed)*: adds `city`, `country`, `lat`, `lng`, `zoom`, `addressLines`, `tel`,
  `email`, `locationType` (`office` | `coverage`).
- **Person** *(changed)*: adds `linkedinUrl` (validated URL).
- **Legal Singleton** *(changed)*: adds validated rich-text body field(s).
- **Award** *(new or referenced)*: `title`, `issuer`, `year`, optional `logoAsset`, optional link —
  as a content type or singleton list (coordinate with `009`).
- **Media Asset** *(changed)*: gains per-field validation metadata (dimensions, aspect ratio,
  transparency) captured/enforced at upload; delivery URL unchanged.
- **Video Reference** *(new value object)*: `{ provider: 'youtube', videoId, url }` embedded on the
  entries that carry a video.

## Success Criteria *(mandatory)*

- **SC-801**: An editor can embed a YouTube video on a supported content type and it surfaces via
  the read API; 100% of non-YouTube/malformed URLs are rejected at authoring time.
- **SC-802**: An editor can set a case's brand colour and upload a transparent-PNG logo; both are
  returned by the read API; 100% of invalid hex values and non-transparent/oversized logos are
  rejected.
- **SC-803**: 0 uploads that violate the configured per-field dimension / file-size / aspect-ratio
  rules reach published output.
- **SC-804**: The read API returns the requested locale for EN/PT/ES when present and the documented
  fallback when absent — 0 errors and 0 draft leaks across locale requests under test.
- **SC-805**: 100% of the maps fields (city, country, lat/lng, zoom, address, tel, email,
  `locationType`) are returned by the read API for both an office region and a coverage-only region.
- **SC-806**: Every launch content item (5 solutions, cases, insights, legal texts, people LinkedIn
  URLs, regions, awards) has a validated schema home — verified by entering one of each.
- **SC-807**: All schema changes ship as drizzle-kit migrations with no draft leakage and no
  regression to MFA/RBAC/audit (`001` gates re-verified green).

## Assumptions

- This feature is implemented in the **separate `corporate-dna-cms` repo**; these `specs/` artifacts
  are tracking documents only.
- EN/PT/ES are already **registered** locales in the CMS (`001` FR-019); this feature wires the
  **read-API serving + fallback**, not the locale registration.
- Videos remain **external YouTube embeds** (`001` FR-012); the CMS stores references only.
- Media continues to be delivered via **Bunny.net**; brand-logo and constrained images use the same
  pipeline with added validation.
- Schema evolution uses **drizzle-kit migrations** against **Neon**; validation uses **Zod**.
- Some region geodata may already exist in the `001` region schema; where present this feature
  extends it, where absent it adds it (⚠ confirm — see `research.md`).

## Dependencies / open inputs (from the meeting) — resolved with defaults in `research.md`

- **Which content types get the video field** — recommended cases + insights + video-bearing
  singletons. *(⚠ confirm)*
- **Exact upload limits / aspect ratios per field** — recommended defaults in `research.md`.
  *(⚠ confirm)*
- **Whether Awards is a new content type** — coordinate with `009`. *(⚠ confirm)*
- **EN/PT/ES fallback rule** — recommended default: fall back to **EN**, flagged as fallback.
  *(⚠ confirm)*
- **Whether region coordinates already exist** in the `001` schema or need adding. *(⚠ confirm)*
- **Migration approach** — drizzle-kit (recommended, consistent with `001`). *(⚠ confirm)*

## Cross-references

- `001-custom-cms` — the base CMS this feature extends (content types, read API, MFA/RBAC/audit).
- `002-site-cms-integration` — the read API the site consumes; new fields extend that contract.
- `005-i18n-seo-redirects` — consumes the localised read API (FR-809/810).
- `007-content-libraries` — consumes the new case fields (video, brand colour, logo).
- `008-maps` — consumes the region geodata (coordinates, country, `locationType`).
- `009` — coordinates Awards ownership (content type vs. list).
