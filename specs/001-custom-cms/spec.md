# Feature Specification: Custom Headless CMS (standalone project)

**Feature Branch**: `001-custom-cms`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "cria as especificações, só importante que seja um projeto separado do site"

## Overview

Corporate DNA needs a **custom headless Content Management System**, built and owned as a
product by Dev em Dobro, that lets non-technical staff manage the firm's structured content
without a developer. The CMS is the editing and content-API layer behind the new marketing
platform described in `proposta.txt` (Phase 1 / Foundation).

**Hard constraint (from the user):** the CMS MUST be a **separate project from the marketing
site**. It has its own codebase, its own deployment, its own admin domain, and its own
lifecycle. The public Next.js site does not embed the CMS; it consumes content from the CMS
through a read API. This keeps the editing environment isolated from what visitors touch
(a security requirement given the prior breaches) and lets each project evolve independently.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Editor manages structured content without a developer (Priority: P1)

A Corporate DNA content editor logs into the CMS admin, creates and edits structured entries
(a case study, a solution, a person, a region, an insight article), attaches images, previews
the result as it will appear on the site, and publishes. No code and no developer are involved
in routine updates.

**Why this priority**: This is the core reason the CMS exists — "a CMS your team can actually
use." Without editable structured content and publishing, nothing else delivers value. It is the
MVP: a single content type that can be created, previewed, and published already replaces the
developer-dependent workflow.

**Independent Test**: Log in as an editor, create a case study with the required fields, upload a
cover image, open preview, publish, and confirm the entry is returned by the content API in
published state. Fully testable with one content type end-to-end.

**Acceptance Scenarios**:

1. **Given** an authenticated editor, **When** they create a case study with all required fields
   and click Publish, **Then** the entry becomes available through the published content API and
   is visible in preview beforehand.
2. **Given** a draft entry, **When** the editor saves without publishing, **Then** it is stored as
   a draft and is NOT returned by the public published API, but IS visible in preview.
3. **Given** an entry with a missing required field, **When** the editor attempts to publish,
   **Then** publication is blocked and the specific missing fields are reported.

---

### User Story 2 - Site consumes CMS content over an API (Priority: P1)

The public marketing site (a separate project) fetches published content from the CMS through a
stable read API — lists and single entries for each content type, with filtering for the
case-study library (industry, service, region, outcome). The site never connects to the CMS's
admin or database directly.

**Why this priority**: The "separate project" constraint only works if there is a clean contract
between the two. Without the read API, the site cannot render CMS-managed content, so P1.

**Independent Test**: Call the published content API for each content type from an external client
and confirm it returns only published entries in a documented, stable shape; confirm the
case-study list endpoint honors the documented filters.

**Acceptance Scenarios**:

1. **Given** published and draft entries exist, **When** the site requests a content list,
   **Then** only published entries are returned.
2. **Given** case studies tagged by industry/service/region/outcome, **When** the site requests
   the library filtered by one or more of those facets, **Then** only matching entries return.
3. **Given** an unpublished or deleted entry, **When** the site requests it by slug,
   **Then** the API responds not-found (no draft leakage).

---

### User Story 3 - Roles, permissions and audit for a small team (Priority: P2)

The CMS supports multiple users with roles (at minimum Administrator and Editor). Administrators
manage users and see an audit log of content and access changes; editors manage content but not
users. Administrator accounts require multi-factor authentication.

**Why this priority**: Security and accountability are explicit proposal requirements (MFA for
admins, role-based access, audit logs), but the CMS delivers value with a single admin before
multi-role governance exists — hence P2, right after the core editing/consumption loop.

**Independent Test**: Create an editor account, confirm it cannot access user management; perform
a content change and confirm it appears in the audit log with actor, action, timestamp and target;
confirm admin login enforces a second factor.

**Acceptance Scenarios**:

1. **Given** an editor account, **When** it opens user administration, **Then** access is denied.
2. **Given** any publish/edit/delete action, **When** it completes, **Then** an audit entry records
   who did what, to which entry, and when.
3. **Given** an administrator with MFA enabled, **When** they log in, **Then** a second factor is
   required before access is granted.

---

### User Story 4 - Version history and safe recovery (Priority: P2)

Every content entry keeps a version history. An editor can view previous versions of an entry and
restore an earlier version.

**Why this priority**: Versioning protects against mistakes and is a named proposal deliverable,
but it builds on top of the core editing loop, so P2.

**Independent Test**: Edit an entry twice, open its history, confirm both prior versions are
listed, restore the first version, and confirm the entry content matches the restored version.

**Acceptance Scenarios**:

1. **Given** an entry edited several times, **When** the editor opens history, **Then** each saved
   version is listed with timestamp and author.
2. **Given** a selected earlier version, **When** the editor restores it, **Then** the current entry
   content becomes that version and the restore is itself recorded as a new version.

---

### User Story 5 - Media library (Priority: P2)

Editors upload and reuse images and documents inside the CMS. Uploaded media is served from a
media/CDN layer and can be attached to any content entry. Videos are referenced as external
(YouTube) embeds rather than uploaded.

**Why this priority**: Content is incomplete without images, but a first content type can be
created before a full media library exists (a single image field suffices for MVP), so P2.

**Independent Test**: Upload an image, confirm it is retrievable via its delivery URL, attach it to
a case study, and confirm the entry references it through the content API.

**Acceptance Scenarios**:

1. **Given** an editor, **When** they upload a supported image or document, **Then** it appears in
   the media library and returns a stable delivery URL.
2. **Given** a media item, **When** it is attached to an entry and the entry is published,
   **Then** the content API exposes the media reference for that entry.

---

### User Story 6 - Multilingual-ready content model (Priority: P3)

The content model can hold the same entry in multiple locales. Phase 1 authors content only in
English, but adding Spanish/Portuguese later is a content operation, not a schema rebuild.

**Why this priority**: Explicitly deferred in the proposal (Phase 1 is English only) but the model
must not preclude it — so it is a modeling requirement, validated but not exercised, at P3.

**Independent Test**: Confirm an entry can carry a locale, that two locale variants of the same
logical entry can coexist and be requested independently, and that the API can return a requested
locale — using English as the only populated locale for Phase 1.

**Acceptance Scenarios**:

1. **Given** the content model, **When** an entry is created, **Then** it is associated with a
   locale and a locale-independent identity that can group translations.
2. **Given** a request for a locale that has no translation, **When** the API is queried,
   **Then** it responds per the documented fallback rule (e.g. default locale or not-found) without
   error.

### Edge Cases

- What happens when an editor tries to publish an entry that references a media item that was
  later deleted? (Publication should be blocked or the reference flagged; no broken references in
  published output.)
- How does the system handle two editors editing the same entry concurrently? (Later save must not
  silently overwrite; the conflict is detected and surfaced.)
- What happens to the read API when the CMS admin/database is temporarily unavailable? (The site,
  being a separate statically/edge-rendered project, must be able to keep serving the
  last-published content; see Assumptions.)
- How are malicious or oversized file uploads handled? (Rejected by type/size and scanned.)
- What happens on failed MFA / repeated failed logins? (Access denied, attempts rate-limited and
  audited.)

## Requirements *(mandatory)*

### Functional Requirements

**Separation & consumption**

- **FR-001**: The CMS MUST be a standalone project — separate codebase, deployment and admin
  domain — from the marketing site, with no shared runtime or admin surface.
- **FR-002**: The CMS MUST expose a read API that returns only published content for consumption by
  the marketing site and other authorized clients.
- **FR-003**: The read API MUST provide list and single-entry access for each content type, and
  faceted filtering for the case-study library (industry, service, region, outcome).
- **FR-004**: The CMS MUST NOT require the marketing site to connect to the CMS database or admin
  interface directly.

**Content management**

- **FR-005**: The CMS MUST support structured content types for at least: cases (case studies),
  solutions, people, regions, and insights (articles). It MUST also support the singular/landing
  content needed by the site: 5H Framework page, Book page, Awards & partnerships, and legal pages.
- **FR-006**: Each content type MUST have defined fields and required-field validation enforced at
  publish time.
- **FR-007**: Case studies MUST carry a consistent structure (challenge, approach, outcome,
  measurable result, client quote) and support an optional video reference and cover image.
- **FR-008**: Editors MUST be able to save drafts, preview an entry as it will render on the site,
  and publish/unpublish entries.
- **FR-009**: The CMS MUST keep a version history per entry and allow restoring a previous version.
- **FR-010**: Case studies MUST be taggable by industry, service, region and outcome to power the
  filterable library.

**Media**

- **FR-011**: Editors MUST be able to upload, browse and reuse images and documents, served from a
  media/CDN delivery layer with stable URLs.
- **FR-012**: Videos MUST be referenced as external embeds (YouTube), not uploaded into the CMS.
- **FR-013**: Uploads MUST be validated by file type and size and rejected if unsafe or oversized.

**Users, roles & security**

- **FR-014**: The CMS MUST support multiple users with at least Administrator and Editor roles,
  where editors cannot manage users.
- **FR-015**: Administrator accounts MUST require multi-factor authentication.
- **FR-016**: The CMS MUST maintain an audit log recording actor, action, target entry and
  timestamp for content and access changes.
- **FR-017**: The CMS MUST provide a staging/preview environment distinct from published output.
- **FR-018**: The CMS MUST protect the read API and admin against unauthorized access
  (authenticated admin; authorized/rate-limited read API).

**Multilingual-readiness**

- **FR-019**: The content model MUST support per-locale variants of an entry grouped by a
  locale-independent identity, populated in English for Phase 1, without schema changes to add
  further locales later.
- **FR-020**: The read API MUST accept a requested locale and apply a documented fallback rule when
  a translation is absent.

**Interoperability**

- **FR-021**: The CMS SHOULD expose content changes via webhooks or an equivalent mechanism so the
  site can revalidate/rebuild when content is published (API/webhook-first).

### Key Entities *(include if feature involves data)*

- **User**: A CMS account. Attributes: identity, role (Administrator/Editor), MFA status. Performs
  audited actions.
- **Content Entry (base)**: Shared concept for all editable items. Attributes: type, slug, status
  (draft/published), locale, translation-group id, timestamps, current version. Owns a version
  history.
- **Case Study**: Content entry with challenge, approach, outcome, measurable result, client quote,
  cover image, optional video reference, and facets (industry, service, region, outcome).
- **Solution / Journey**: Content entry describing a problem-first offering with proof references
  and CTA.
- **Person**: Content entry for leadership/regional leads: name, role, bio, photo, region link.
- **Region**: Content entry for an office/regional presence (London, Singapore, Dubai, Riyadh,
  Miami): location details, related people and content.
- **Insight (Article)**: Content entry for thought-leadership articles.
- **Singleton Pages**: 5H Framework, Book, Awards & partnerships, Legal (privacy/cookies/terms).
- **Media Asset**: An uploaded image or document with a stable delivery URL; referenced by entries.
- **Content Version**: A historical snapshot of an entry with author and timestamp; restorable.
- **Audit Log Entry**: A record of actor, action, target and timestamp.
- **Webhook/Revalidation Event**: A published-content change signal delivered to authorized
  consumers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A non-technical editor can create, preview and publish a new case study end-to-end in
  under 10 minutes without developer assistance.
- **SC-002**: 100% of routine content updates (edit existing entry, add an insight, update a
  person) are completable by editors with no code change and no deployment.
- **SC-003**: The published read API never returns draft or deleted entries — 0 draft/deleted
  leaks across the published endpoints under test.
- **SC-004**: The marketing site can render every CMS-managed content type solely through the read
  API, with no direct database or admin access.
- **SC-005**: Every publish/edit/delete action produces a matching audit-log record (100%
  coverage).
- **SC-006**: An editor can restore any prior version of an entry and the restored content matches
  the selected version exactly.
- **SC-007**: Adding a second locale (ES or PT) to an existing entry requires no schema/code
  migration — content-only operation.
- **SC-008**: Administrator login without a valid second factor is rejected 100% of the time.

## Assumptions

- The CMS is a **separate project/repository** from the marketing site; the two communicate only
  through the published read API and change/webhook events. (Explicit user constraint.)
- Both projects deploy to the client's own accounts; the site is statically/edge-rendered and can
  continue serving the last-published content if the CMS is briefly unavailable.
- Phase 1 launches in **English only**; the model is multilingual-ready but only English is
  populated.
- Persistence is a serverless Postgres database (Neon) and media is delivered via a CDN
  (e.g. Bunny.net), per `proposta.txt`; exact provider wiring is confirmed in planning.
- Videos are client-supplied and hosted on YouTube; the CMS stores references only.
- Content types and required fields follow `proposta.txt` Sections 5–7; the launch content matrix
  fixes quantities but not the CMS's structural capability.
- A small number of concurrent editors (single-digit team), ~5,000 site visits/month at launch —
  the read API load is dominated by the site's build/revalidation, not per-visitor traffic.
- Legal/privacy page copy is provided by the client; the CMS provides the structure to hold it.
