import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Receives signed revalidation webhooks from the custom CMS (a separate project)
 * and refreshes only the cached pages an entry affects on publish/unpublish/
 * delete. The CMS signs the body with the shared secret (D7 / FR-021).
 *
 * Env: CMS_WEBHOOK_SECRET (must match the CMS webhook endpoint's secret).
 */

/**
 * CMS content-type → fetch cache tags used by `lib/cms/client.ts`.
 * Path revalidation alone is not enough: list/detail fetches live in the Data
 * Cache under these tags, so a newly published insight could open at
 * `/insights/[slug]` while `/insights` still rendered an empty library.
 */
function affectedTags(type: string, slug: string): string[] {
  const segment: Record<string, string> = {
    case: "cases",
    insight: "insights",
    solution: "solutions",
    region: "regions",
    event: "events",
    person: "people",
  };
  const collection = segment[type] ?? type;
  return ["cms", `cms:${collection}`, `cms:${collection}:${slug}`];
}

/**
 * Locale-relative paths (WITHOUT the locale prefix; "/" = home) that a CMS entry
 * of `type`/`slug` renders on. Returns `null` for types we can't map to concrete
 * routes (e.g. `person`, which is embedded, or any future type)  -  the caller
 * then falls back to a full-tree purge so nothing is ever left stale.
 */
function affectedPaths(type: string, slug: string): string[] | null {
  switch (type) {
    case "case":
      return ["/", "/cases", `/cases/${slug}`];
    case "insight":
      return ["/", "/insights", `/insights/${slug}`];
    case "solution":
      return ["/", "/services", `/services/${slug}`];
    case "region":
      return ["/services", "/services/regions", `/services/regions/${slug}`];
    case "event":
      return ["/events", `/events/${slug}`];
    case "page_5h":
      return ["/approach"];
    case "page_book":
      // The book lives in the home `#book` section  -  there is no /book page.
      return ["/"];
    case "page_home":
      // Homepage statistics singleton  -  only the home renders it.
      return ["/"];
    case "page_awards":
      return ["/awards"];
    case "page_legal":
      // slug is one of privacy | cookies | terms
      return [`/${slug}`];
    default:
      return null;
  }
}

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

  let payload: { type?: string; slug?: string; locale?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  const { type, slug } = payload;

  // Always drop the shared CMS Data Cache first. `{ expire: 0 }` matches the
  // page-copy editors: after a publish, the next render must not reuse a stale
  // empty list (the bug that hid the Insights library after the first article).
  revalidateTag("cms", { expire: 0 });
  if (type && slug) {
    for (const tag of affectedTags(type, slug)) {
      if (tag === "cms") continue;
      revalidateTag(tag, { expire: 0 });
    }
  }

  const paths = type && slug ? affectedPaths(type, slug) : null;

  // Unknown/embedded type  -  purge the whole route tree to stay correct.
  if (!paths) {
    revalidatePath("/", "layout");
    return NextResponse.json({
      ok: true,
      revalidated: "all",
      tags: type && slug ? affectedTags(type, slug) : ["cms"],
      type,
      slug,
    });
  }

  // Single locale, no locale prefix  -  the affected paths are the live URLs.
  const revalidated: string[] = [];
  for (const p of paths) {
    revalidatePath(p);
    revalidated.push(p);
  }

  return NextResponse.json({
    ok: true,
    revalidated,
    tags: affectedTags(type!, slug!),
  });
}
