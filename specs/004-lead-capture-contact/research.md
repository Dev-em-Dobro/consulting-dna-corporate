# Phase 0 Research: Lead capture, CRM-ready pipeline & WhatsApp

All NEEDS CLARIFICATION items from the plan are resolved below with a recommended default so
implementation is unblocked; items marked **⚠ confirm** need a one-line answer from the client but
have a safe default.

## D1 — Submission transport: Server Action vs. Route Handler

- **Decision**: Next.js **Server Action** (`'use server'`) called from the client `ContactForm`.
- **Rationale**: Native to App Router (Next 16), no separate API surface, progressive-enhancement
  friendly, keeps the Supabase key server-side by construction. The form already manages its own
  state, so the action returns a discriminated result the component maps to error/thank-you.
- **Alternatives**: `POST /api/contact` route handler — equivalent security but more wiring and an
  extra public URL to rate-limit; chosen only if a non-form client must post too (not needed).

## D2 — Supabase auth model

- **Decision**: Server-only client using the **service-role key**, used exclusively inside the
  Server Action; never imported by a client component.
- **Rationale**: Simplest correct model for server-side inserts; no RLS policy tuning required for
  the write path. The key lives in `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_` prefix) so it
  cannot reach the bundle.
- **Alternatives**: Anon key + insert-only RLS policy on `leads` — viable and slightly safer if the
  key ever leaked, but adds RLS policy management; revisit if leads are ever read from the client
  (they are not). **⚠ confirm** which keys will be provided.

## D3 — CRM handoff target

- **Decision**: Abstract the handoff behind `lib/leads/crm.ts` with **one env-selected target**;
  ship with an **automation-webhook** target (`CRM_WEBHOOK_URL`, POST JSON) as the default.
- **Rationale**: The client's CRM is not yet chosen. A generic webhook lets an automation tool
  (n8n — already in the team's toolkit per repo skills — or Zapier/Make) route into any CRM today,
  and a native CRM adapter (HubSpot/Pipedrive/RD Station/Salesforce) can be added later behind the
  same interface without touching capture.
- **Handoff semantics**: capture persists first; handoff is fire-and-forget with the result recorded
  on the lead (`crm_status`, `crm_synced_at`, `crm_error`). Failed handoffs are retryable via a
  small `lead_events` trail (or a re-POST of unsynced leads). No message broker.
- **⚠ confirm**: target CRM (or "use an n8n/Zapier webbook for now").

## D4 — Anti-spam

- **Decision**: **Honeypot hidden field** + **lightweight per-IP+email rate limit** (e.g. N
  submissions / 10 min) enforced in the Server Action; reject on honeypot fill or limit breach.
- **Rationale**: Zero added friction for real users, no third-party dependency, sufficient for a
  low-traffic B2B site. Rate-limit state can use Supabase (a `count` query over recent rows) — no
  extra infra.
- **Alternatives**: Cloudflare Turnstile / hCaptcha — stronger but adds a client widget + key and
  UX friction; adopt only if honeypot proves insufficient. Idempotency (D6) also blunts bot floods.

## D5 — WhatsApp UX

- **Decision**: `wa.me/<number>?text=<encoded message>` link. Provide **both** placements behind
  config: a labelled link in the contact section (always) and an optional floating button
  (`NEXT_PUBLIC_WHATSAPP_FLOATING=true`).
- **Rationale**: `wa.me` is the official click-to-chat deep link, works on desktop (WhatsApp
  Web/app) and mobile with no API. Env-driven so the number/copy are not hardcoded and the whole
  affordance disappears when unset (FR-211).
- **RESOLVED (24-07 meeting)**: a **floating WhatsApp button** is wanted ("Botão flutuante de
  WhatsApp") → ship the site-wide floating button (`NEXT_PUBLIC_WHATSAPP_FLOATING=true`) in addition
  to the contact-section link.
- **⚠ confirm**: business number (E.164, digits only for `wa.me`) + default pre-filled message.

## D6 — Duplicate / double-submit protection

- **Decision**: Disable the submit button while pending (client) + an idempotency guard in the
  action (reject an identical email+message seen within a short window).
- **Rationale**: Prevents double rows and double CRM handoffs (SC-201) without a unique constraint
  that would block legitimate repeat enquiries later.

## D7 — Lead-notification email (scope question)

- **Decision**: **Out of MVP scope**, but leave a no-op notification hook next to the CRM handoff so
  it can be enabled with Resend later. **⚠ confirm** whether staff want a per-lead email now.
- **Rationale**: The Supabase store + CRM handoff already deliver the lead; email is additive. Resend
  is already used by the sibling CMS project, so wiring it later is cheap.

## D8 — Marketing attribution capture

- **Decision**: Capture `referrer`, and `utm_*` query params (read from the URL on the client, sent
  with the submission) plus a coarse user-agent, stored on the lead.
- **Rationale**: CRMs expect source attribution; capturing it at submit time is free and makes leads
  genuinely CRM-ready (FR-206) without a tracking library.

## Summary of new configuration

| Env var | Scope | Purpose |
|---|---|---|
| `SUPABASE_URL` | server | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | Insert leads (never `NEXT_PUBLIC_`) |
| `CRM_WEBHOOK_URL` | server | Automation/CRM handoff target (optional) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | client | E.164 digits for `wa.me` |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | client | Pre-filled greeting |
| `NEXT_PUBLIC_WHATSAPP_FLOATING` | client | Optional floating button toggle |
| `RESEND_API_KEY` | server | Only if lead-notification email is pulled into scope (D7) |
