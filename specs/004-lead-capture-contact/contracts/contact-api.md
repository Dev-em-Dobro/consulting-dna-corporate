# Contract: Contact submission & CRM handoff

## 1. Server Action — `submitLead(input)`

**Location**: `lib/leads/actions.ts` (`'use server'`). Called by `components/ContactForm.tsx`.

### Input (from the form; server re-validates — FR-202)

```jsonc
{
  "name": "string (required, trimmed non-empty)",
  "email": "string (required, email format)",
  "organisation": "string (optional, <=200)",
  "message": "string (required, <=5000)",
  "company_url": "string (honeypot — MUST be empty)",
  "referrer": "string (optional)",
  "utm": { "source": "string", "medium": "string", "campaign": "string", "term": "string", "content": "string" }
}
```

### Result (discriminated — the component maps this to UI state)

```jsonc
// success
{ "ok": true }

// validation failure — field-keyed messages, re-rendered by the form
{ "ok": false, "kind": "validation", "errors": { "email": "…", "message": "…" } }

// server/persistence failure — recoverable error, NO thank-you state (FR-204)
{ "ok": false, "kind": "server", "message": "We couldn't send that — please try again." }

// spam (honeypot/rate-limit) — treated as success-looking to the bot, not persisted
{ "ok": true }   // silently dropped
```

**Guarantees**: on `{ ok: true }` from a real submission a row exists in `leads` (SC-201); the
thank-you state is shown only for `ok: true` (SC-202). The Supabase key is used only here,
server-side (SC-203).

## 2. CRM handoff payload (outbound) — `lib/leads/crm.ts`

Sent to `CRM_WEBHOOK_URL` (or a native CRM adapter) after persistence. Fire-and-forget; failure is
recorded on the lead, never surfaced to the visitor (FR-208).

```jsonc
{
  "lead_id": "uuid",
  "created_at": "ISO-8601",
  "contact": { "name": "string", "email": "string", "company": "string|null" },
  "message": "string",
  "source": "homepage-contact",
  "attribution": { "referrer": "string|null", "utm": { "source": "…", "medium": "…", "campaign": "…" } }
}
```

Expected response: any `2xx` → mark `crm_status=synced`, set `crm_synced_at`. Non-2xx / network
error → `crm_status=failed`, store `crm_error`; lead remains captured and retryable.

## 3. WhatsApp deep link — `lib/whatsapp.ts`

Pure function, no network:

```
https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=<encodeURIComponent(NEXT_PUBLIC_WHATSAPP_MESSAGE)>
```

Returns `null` when the number env is unset → the affordance renders nothing (FR-211).
