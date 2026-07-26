"use server";

import { z } from "zod";
import { headers } from "next/headers";

/**
 * Lead capture (004). The form submits here (server-side); this action
 * re-validates and forwards the lead to the CMS, which owns the database and
 * persists it (see specs/cms-tarefas.md — TAREFA 1). Routing through the CMS
 * means the site reuses the existing CMS_URL + read key and never needs a
 * Supabase service-role key in its own bundle. Anti-spam via a honeypot.
 *
 * Env (already present for the CMS read API):
 *   CMS_URL            base URL of the CMS (origin or ".../api")
 *   CMS_READ_API_KEY   x-api-key sent to the CMS
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

// Normalise CMS_URL (may be the origin or already end in /api) to `${origin}/api`.
const CMS_BASE = process.env.CMS_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "");
const CMS_KEY = process.env.CMS_READ_API_KEY ?? process.env.READ_API_KEY;

export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  // Honeypot tripped → silently accept and drop (don't tip off the bot).
  if (d.company_website) return { ok: true };

  if (!CMS_BASE) {
    console.error("[lead] CMS_URL not set");
    return { ok: false, error: "server" };
  }

  const h = await headers();
  const payload = {
    name: d.name,
    email: d.email,
    organisation: d.organisation || null,
    message: d.message,
    source: d.source || null,
    referer: h.get("referer"),
    user_agent: h.get("user-agent"),
  };

  try {
    const res = await fetch(`${CMS_BASE}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CMS_KEY ? { "x-api-key": CMS_KEY } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[lead] CMS lead endpoint failed:", res.status, await res.text());
      return { ok: false, error: "server" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[lead] CMS lead request error:", (err as Error)?.message);
    return { ok: false, error: "server" };
  }
}
