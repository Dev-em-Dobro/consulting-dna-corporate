# Implementation Plan: Lead capture, CRM-ready pipeline & WhatsApp contact

**Branch**: `004-lead-capture-contact` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-lead-capture-contact/spec.md`

## Summary

Wire the existing homepage `ContactForm` to a real backend. A **Next.js Server Action** (server-only)
validates the submission with Zod, persists it to a **Supabase `leads` table** via the Supabase JS
client using a **server-side key** (never shipped to the browser), then fires a **decoupled CRM
handoff** (direct CRM API or an automation webhook, selected by env) that never blocks or fails the
capture. A **WhatsApp click-to-chat** affordance (`wa.me` deep link, env-configured number +
message) is added to the contact section. Anti-spam is a honeypot field + lightweight per-IP rate
limit. No new services beyond Supabase; the CRM is plugged in through one swappable module.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js 24 LTS

**Primary Dependencies**: Next.js 16 (App Router, Server Actions) · React 19 · Zod 4 (already a dep,
boundary validation) · `@supabase/supabase-js` (NEW) · Tailwind 4 (existing form styles). Optional:
Resend for lead-notification email (only if that item is pulled into scope — see research).

**Storage**: Supabase Postgres — a single `leads` table (+ optional `lead_events` for handoff
attempts/retries). Binaries N/A. This is **separate** from the CMS's Neon database (which the site
must not touch, per `002` FR-108); Supabase here is the site's own lead store.

**Testing**: Vitest (unit: Zod schema, CRM payload mapping) · a server-action integration test that
asserts a row is written (against a Supabase test project or a mocked client) · manual/Playwright
smoke of the submit → thank-you and WhatsApp deep-link.

**Target Platform**: Vercel (Fluid Compute) — the site's existing deployment. Server Action runs
server-side; Supabase reached over HTTPS.

**Project Type**: Web application (Next.js App Router) — server action + client form component.

**Performance Goals**: Submit round-trip < 800ms p95 (single insert + fire-and-forget handoff);
handoff ret/latency must not block the user response.

**Constraints**: No secret in the client bundle (FR-201/SC-203); capture must not depend on the CRM
(FR-208/209); preserve existing accessible validation + thank-you UX (FR-205); resist spam
(FR-212).

**Scale/Scope**: Low volume (single-digit leads/day expected at launch). One form, one table, one
CRM handoff module, one WhatsApp link.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is the **unratified template** — no
binding gates. Self-imposed gates for this feature:

| Self-imposed gate | Status |
|---|---|
| No credential in the client bundle (server-only capture) | PASS — Server Action + server-only Supabase key |
| Capture is durable and CRM-independent | PASS — persist first, handoff decoupled + retryable |
| Fail safe (no false success) | PASS — thank-you only on confirmed persistence |
| No coupling to the CMS DB (upholds 002 FR-108) | PASS — Supabase is the site's own store; CMS untouched |
| Simplicity / no premature complexity | PASS — one table, one action, one swappable handoff |

No violations requiring justification. **Recommendation**: ratify a real constitution
(`/speckit-constitution`) before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/004-lead-capture-contact/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — CRM choice, anti-spam, Supabase auth model, WhatsApp UX
├── data-model.md        # Phase 1 — leads (+ lead_events) schema + CRM field mapping
├── contracts/
│   └── contact-api.md   # Phase 1 — Server Action input contract + CRM handoff payload
└── tasks.md             # Phase 2 (/speckit-tasks — NOT created here)
```

### Source Code (repository root — this repo)

```text
consulting-dna-corporate/
├── components/
│   └── ContactForm.tsx          # MODIFY: submit → server action; error state; honeypot field
├── app/
│   └── page.tsx                 # MODIFY (contact section): add WhatsApp affordance
├── lib/
│   ├── leads/
│   │   ├── actions.ts           # NEW: 'use server' submitLead(): validate → persist → handoff
│   │   ├── schema.ts            # NEW: Zod schema (server-authoritative)
│   │   ├── supabase.ts          # NEW: server-only Supabase client (service key)
│   │   ├── crm.ts               # NEW: swappable CRM handoff (env-selected target) + retry
│   │   └── mapping.ts           # NEW: Lead → normalized CRM payload
│   └── whatsapp.ts              # NEW: build wa.me link from env (number + default message)
└── components/
    └── WhatsAppButton.tsx       # NEW: click-to-chat affordance (hidden if unconfigured)
```

New env (documented in research/quickstart): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
(server-only), `CRM_WEBHOOK_URL` (or CRM-specific creds — TBD in research), `NEXT_PUBLIC_WHATSAPP_NUMBER`,
`NEXT_PUBLIC_WHATSAPP_MESSAGE`.

**Structure Decision**: Single Next.js app (this repo). All lead logic lives under `lib/leads/`
with a thin client change in `ContactForm.tsx`. The CRM is isolated in `lib/leads/crm.ts` so the
choice can change without touching capture. Supabase is the site's own lead store, deliberately
separate from the CMS database (which the site must never connect to — `002` FR-108).

## Phase 0 — research (unknowns to resolve → `research.md`)

- **CRM handoff target**: direct CRM API vs. automation webhook (n8n/Zapier/Make). *(NEEDS
  CLARIFICATION — CRM not yet chosen.)*
- **Supabase auth model**: service-role key server-side (recommended) vs. anon key + insert-only RLS.
- **Anti-spam**: honeypot + rate limit vs. Turnstile/hCaptcha — pick lowest-friction sufficient.
- **WhatsApp placement**: contact-section link vs. floating site-wide button; number + default copy.
- **Lead-notification email**: in scope? (Resend already used by the CMS project.) *(NEEDS
  CLARIFICATION.)*

## Complexity Tracking

> No Constitution Check violations require justification. Complexity is deliberately minimal: one
> Supabase table, one Server Action, one isolated CRM module, one WhatsApp deep link. Retry/queue
> for the CRM handoff is kept as a simple recorded-status + retry, not a message broker.
