"use server";

import { z } from "zod";
import { headers } from "next/headers";

/**
 * Lead capture (004). Runs server-side only: the Supabase service-role key
 * never reaches the client bundle. Every valid submission is persisted to the
 * Supabase `leads` table (server re-validation, FR-202), then forwarded to a
 * configurable outbound webhook (FR-207) — decoupled from capture, so a webhook
 * failure never loses the lead (FR-208). Anti-spam via a honeypot (FR-212).
 */
const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().toLowerCase().email().max(320),
  organisation: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  // The page the lead came from (path + query, carries any UTM params).
  source: z.string().max(500).optional().default(""),
  // Honeypot: real users never fill this hidden field; bots do.
  company_website: z.string().max(0).optional().default(""),
});

export type LeadResult = { ok: true } | { ok: false; error: "invalid" | "server" };

export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  // Honeypot tripped → silently accept and drop (don't tip off the bot).
  if (d.company_website) return { ok: true };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[lead] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    return { ok: false, error: "server" };
  }

  const h = await headers();
  const row = {
    name: d.name,
    email: d.email,
    organisation: d.organisation || null,
    message: d.message,
    source: d.source || null,
    referer: h.get("referer"),
    user_agent: h.get("user-agent"),
  };

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[lead] Supabase insert failed:", res.status, await res.text());
      return { ok: false, error: "server" };
    }
    const inserted = (await res.json())?.[0] ?? row;
    // Hand off to the CRM webhook without blocking or risking the capture.
    void forwardToWebhook(inserted);
    return { ok: true };
  } catch (err) {
    console.error("[lead] Supabase insert error:", (err as Error)?.message);
    return { ok: false, error: "server" };
  }
}

/** Optional CRM handoff: POST the lead to a configured webhook (n8n/Zapier/…). */
async function forwardToWebhook(lead: Record<string, unknown>): Promise<void> {
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      cache: "no-store",
    });
  } catch (err) {
    // Capture already succeeded; a webhook failure must not fail the lead.
    console.warn("[lead] webhook forward failed:", (err as Error)?.message);
  }
}
