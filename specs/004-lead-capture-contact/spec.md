# Feature Specification: Lead capture, CRM-ready pipeline & WhatsApp contact

**Feature Branch**: `004-lead-capture-contact`

**Created**: 2026-07-24

**Status**: Draft

**Input**: Launch-readiness backlog (site) — "integrar o formulário com o supabase · preparar o
form pra CRM · contact com whatsapp". Split by theme from the combined next-steps list.

## Overview

The homepage contact form (`components/ContactForm.tsx`) currently validates on the client and
then does **nothing** — its submit handler contains `// No backend wired yet`. This feature makes
the form actually capture leads: it **persists every submission to Supabase**, structures the
submission so a **CRM can ingest it** (field mapping + an outbound handoff hook), and adds a
**WhatsApp click-to-chat** contact channel alongside the form.

The three items are one theme: *turn the contact section from a decorative form into a working
lead-capture channel with a durable store and a path into the client's sales process.*

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A prospect's message is captured and never lost (Priority: P1)

A visitor fills in name, work email, organisation (optional) and their leadership challenge, and
submits. The submission is stored durably in Supabase and the visitor sees the existing thank-you
state. Staff can later see every lead even if no CRM/email is wired yet.

**Why this priority**: Losing inbound leads is the worst outcome for a consulting site. A durable
store is the MVP — it delivers value before CRM or notifications exist.

**Independent Test**: Submit the form with valid data; confirm a new row appears in the Supabase
`leads` table with the submitted fields, a server timestamp, and request metadata; confirm the UI
shows the thank-you state.

**Acceptance Scenarios**:

1. **Given** a valid submission, **When** the visitor submits, **Then** a row is persisted in
   Supabase and the thank-you state renders.
2. **Given** the persistence call fails (Supabase unreachable), **When** the visitor submits,
   **Then** the visitor sees a recoverable error (not a silent success), and the failure is logged
   server-side.
3. **Given** invalid/missing required fields, **When** submit is attempted, **Then** the request is
   rejected server-side (not only client-side) and nothing is persisted.

### User Story 2 — Each lead is CRM-ready (Priority: P2)

Every captured lead carries a normalized, documented shape (mapped to standard CRM fields — contact
name, email, company, message, source, timestamp, UTM/referrer) and is handed off to the CRM
through a single, swappable integration point, so connecting the client's CRM is a configuration
step, not a rebuild.

**Why this priority**: The client's specific CRM may not be chosen yet; the value is that the data
is captured in a CRM-mappable shape and there is one clear place to plug the CRM in. P2 because the
lead is already safe (US1) before any CRM exists.

**Independent Test**: Inspect a persisted lead and confirm it contains every field the CRM handoff
needs; enable the handoff hook against a test endpoint and confirm the lead is forwarded with the
documented payload; disable it and confirm leads are still captured.

**Acceptance Scenarios**:

1. **Given** a captured lead, **When** the CRM handoff is enabled, **Then** the lead is forwarded to
   the configured CRM/endpoint with the documented payload and the outcome (success/failure) is
   recorded on the lead.
2. **Given** the CRM handoff fails, **When** a lead is captured, **Then** the lead remains stored in
   Supabase and the handoff is retryable (no lead is dropped because the CRM was down).
3. **Given** the CRM handoff is not configured, **When** a lead is captured, **Then** capture still
   succeeds (handoff is optional/decoupled from persistence).

### User Story 3 — Visitors can reach the firm on WhatsApp (Priority: P2)

A visitor who prefers messaging can start a WhatsApp conversation from the site in one tap, with a
pre-filled greeting, without filling in the form.

**Why this priority**: A high-intent, low-friction channel that complements the form; independent
of persistence, so P2.

**Independent Test**: Click the WhatsApp affordance and confirm it opens a WhatsApp chat to the
firm's number with the pre-filled message, on both desktop (WhatsApp Web / `wa.me`) and mobile.

**Acceptance Scenarios**:

1. **Given** the WhatsApp affordance, **When** a visitor taps it, **Then** WhatsApp opens a chat to
   the configured business number with a pre-filled message.
2. **Given** an unconfigured/missing number, **When** the page renders, **Then** the WhatsApp
   affordance is hidden rather than linking to a broken chat.

### Edge Cases

- Bot / spam submissions → the endpoint must resist automated abuse (rate limiting and/or a
  honeypot/turnstile) without adding friction for real users. *(See research — anti-spam approach.)*
- Duplicate rapid submissions (double-click) → must not create duplicate leads or duplicate CRM
  handoffs.
- Oversized message body / injected HTML → validated and stored safely (no stored XSS surfaced in
  any future admin/CRM view).
- The Supabase key must never reach the client bundle — persistence happens server-side only.
- Visitor on a device without WhatsApp installed → `wa.me` gracefully falls back to WhatsApp Web /
  install prompt (native behaviour).

## Requirements *(mandatory)*

**Capture & persistence**

- **FR-201**: The contact form MUST submit to a server-side handler (Server Action or route
  handler); the browser MUST NOT write to Supabase directly and no Supabase service key may appear
  in the client bundle.
- **FR-202**: The server MUST re-validate all fields (name, email format, message required;
  organisation optional) and reject invalid submissions independently of the client validation.
- **FR-203**: Every valid submission MUST be persisted to a Supabase `leads` table with, at minimum:
  name, email, organisation, message, created-at (server time), source/page, and request metadata
  (referrer, UTM params if present, coarse user agent).
- **FR-204**: A persistence failure MUST surface a recoverable error to the visitor (the form must
  not show the thank-you state on failure) and MUST be logged server-side.
- **FR-205**: The form's existing accessible validation and thank-you UX MUST be preserved.

**CRM readiness**

- **FR-206**: Each lead MUST be representable in a documented, normalized shape mapped to standard
  CRM fields (contact name, email, company, message/notes, source, created-at, marketing
  attribution).
- **FR-207**: The system MUST expose a single, swappable handoff point that forwards a captured lead
  to a configurable outbound **webhook** URL (e.g. n8n/Zapier/Make) via POST with the normalized
  payload; a real CRM is attached downstream of that webhook, not wired directly here.
- **FR-208**: CRM handoff MUST be decoupled from capture: a handoff failure MUST NOT fail or lose
  the capture, and MUST be retryable; handoff outcome MUST be recorded against the lead.
- **FR-209**: If no CRM is configured, capture MUST still succeed (handoff is optional).

**WhatsApp**

- **FR-210**: The site MUST provide a WhatsApp click-to-chat affordance as a **floating button
  present site-wide (every page)** that opens a chat to the configured business number with a
  pre-filled message, working on desktop and mobile.
- **FR-211**: The business number and default message MUST be configuration (not hardcoded), and the
  affordance MUST be hidden if no number is configured.

**Cross-cutting**

- **FR-212**: The submission endpoint MUST be protected against automated abuse (rate limiting
  and/or honeypot/challenge) without materially harming legitimate-user completion.
- **FR-213**: All new configuration (Supabase URL/key, CRM endpoint/key, WhatsApp number/message)
  MUST be supplied via environment variables and documented.

### Key Entities *(include if feature involves data)*

- **Lead**: A captured contact submission. Attributes: id, name, email, organisation, message,
  source/page, marketing attribution (referrer, UTM), request metadata, created-at, CRM handoff
  status + timestamp. See `data-model.md`.

## Success Criteria *(mandatory)*

- **SC-201**: 100% of valid form submissions produce exactly one persisted Supabase lead row (no
  loss, no duplicates on double-submit).
- **SC-202**: 0 submissions display the thank-you state without a persisted lead (no false success).
- **SC-203**: No Supabase or CRM secret appears in the client bundle (verified).
- **SC-204**: With the CRM handoff enabled against a test endpoint, 100% of captured leads are
  forwarded with the documented payload; with it disabled, 100% are still captured.
- **SC-205**: The WhatsApp affordance opens a chat to the configured number with the pre-filled
  message on desktop and mobile; it is absent when unconfigured.

## Assumptions

- Supabase is the chosen lead store (explicit from the input "integrar o formulário com o
  supabase"); a Supabase project/keys will be provided.
- The site is server-rendered (Next.js App Router) so server-side capture is available without a
  separate backend.
- WhatsApp uses the official `wa.me` / click-to-chat deep link (no WhatsApp Business API in scope).
- The specific CRM may be decided later; this feature guarantees CRM-*ready* data + one integration
  point, and wires the actual CRM once chosen. See open inputs.

## Decisions (approved by the user, 2026-07-24)

- **CRM handoff = generic outbound webhook.** No specific CRM is wired now; the single handoff point
  POSTs the normalized lead payload to a configurable webhook URL (e.g. n8n/Zapier/Make), so any CRM
  can be attached downstream. (Resolves FR-206–FR-209.)
- **WhatsApp = floating button, site-wide.** The click-to-chat affordance is a floating button
  present on every page (not only the contact section). Business number + default message stay in
  config; the button is hidden when no number is configured. (Resolves FR-210/FR-211.)
- **Email notification = OUT OF SCOPE for now.** No per-lead staff email in this feature; leads are
  captured + stored + webhook-forwarded only. Can be added later (Resend is already available).
- **Persistence routes through the CMS (updated 24-07).** Rather than the marketing site holding a
  Supabase service-role key, the site's server action POSTs the lead to the CMS (`POST /api/leads`),
  and the **CMS owns the write** to the `leads` table (same Postgres it already uses). The site
  reuses the existing `CMS_URL` + read key — no new secret in the site bundle. The `leads` table has
  RLS enabled with no public policy; only the CMS (service role) writes it. CMS-side work is speced
  in `specs/cms-tarefas.md` (TAREFA 1). Until that endpoint ships, the form submit returns a
  recoverable error (no false success).
