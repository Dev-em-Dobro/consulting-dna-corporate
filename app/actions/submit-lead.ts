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
  // Time-trap: ms the form was on screen before submit (set by the client).
  elapsedMs: z.number().nonnegative().optional(),
});

export type LeadResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "server" | "rate" };

// Minimum plausible fill time. A human cannot type name + email + a message
// in under this; a sub-threshold submit is treated as a bot.
const MIN_FILL_MS = 2000;

// In-memory sliding-window rate limit, per IP. Good enough as a first line for
// a low-volume form: it caps floods against a warm instance. For hard limits
// across all instances, back this with a shared store (e.g. Upstash Redis).
const RL_WINDOW_MS = 60_000;
const RL_MAX = 5;
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  if (recent.length >= RL_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (rateHits.size > 5000) {
    for (const [k, v] of rateHits) {
      if (v.every((t) => now - t >= RL_WINDOW_MS)) rateHits.delete(k);
    }
  }
  return false;
}

// Normalise CMS_URL (may be the origin or already end in /api) to `${origin}/api`.
const CMS_BASE = process.env.CMS_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "");
const CMS_KEY = process.env.CMS_READ_API_KEY ?? process.env.READ_API_KEY;

export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  // Honeypot tripped → silently accept and drop (don't tip off the bot).
  if (d.company_website) return { ok: true };

  // Submitted too fast to be human → same silent drop.
  if (typeof d.elapsedMs === "number" && d.elapsedMs < MIN_FILL_MS) {
    return { ok: true };
  }

  const h = await headers();

  // Rate limit by client IP (Vercel sets x-forwarded-for).
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) return { ok: false, error: "rate" };

  if (!CMS_BASE) {
    console.error("[lead] CMS_URL not set");
    return { ok: false, error: "server" };
  }

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
