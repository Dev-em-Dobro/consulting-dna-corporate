import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/seo/alternates";

/**
 * Receives signed revalidation webhooks from the custom CMS (a separate project)
 * and refreshes only the cached pages an entry affects on publish/unpublish/
 * delete. The CMS signs the body with the shared secret (D7 / FR-021).
 *
 * Env: CMS_WEBHOOK_SECRET (must match the CMS webhook endpoint's secret).
 */

/**
 * Locale-relative paths (WITHOUT the locale prefix; "/" = home) that a CMS entry
 * of `type`/`slug` renders on. Returns `null` for types we can't map to concrete
 * routes (e.g. `person`, which is embedded, or any future type) — the caller
 * then falls back to a full-tree purge so nothing is ever left stale.
 */
function affectedPaths(type: string, slug: string): string[] | null {
  switch (type) {
    case "case":
      return ["/", "/cases", `/cases/${slug}`];
    case "insight":
      return ["/", "/insights", `/insights/${slug}`];
    case "solution":
      return ["/", "/solutions", `/solutions/${slug}`];
    case "region":
      return ["/solutions", "/solutions/regions", `/solutions/regions/${slug}`];
    case "page_5h":
      return ["/solutions/5h-framework"];
    case "page_book":
      return ["/book"];
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

  const { type, slug, locale } = payload;
  const paths = type && slug ? affectedPaths(type, slug) : null;

  // Unknown/embedded type — purge the whole route tree to stay correct.
  if (!paths) {
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, revalidated: "all", type, slug });
  }

  // The default locale (English) is the fallback source for every locale, so an
  // English change can alter the localized routes too; a non-default change only
  // affects its own locale.
  const locales =
    locale && locale !== routing.defaultLocale
      ? [locale]
      : [...routing.locales];

  const revalidated: string[] = [];
  for (const loc of locales) {
    for (const p of paths) {
      const full = localePath(loc, p);
      revalidatePath(full);
      revalidated.push(full);
    }
  }

  return NextResponse.json({ ok: true, revalidated });
}
