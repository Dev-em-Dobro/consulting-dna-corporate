import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Receives signed revalidation webhooks from the custom CMS (a separate project)
 * and refreshes the cached content on publish/unpublish. The CMS signs the body
 * with the shared secret (D7 / FR-021).
 *
 * Env: CMS_WEBHOOK_SECRET (must match the CMS webhook endpoint's secret).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CMS_WEBHOOK_SECRET;
  const signature = req.headers.get("x-cms-signature");
  const body = await req.text();

  if (!secret || !signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  let payload: { type?: string; slug?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  // Purge the cached route tree so CMS-backed pages re-fetch on next request.
  // (Next 16's tag revalidation now requires a cache-life profile; a layout-level
  // path purge is simple, correct and adequate at this site's scale.)
  const { type, slug } = payload;
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, revalidated: { type, slug } });
}
