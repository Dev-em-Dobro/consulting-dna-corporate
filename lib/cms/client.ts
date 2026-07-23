/**
 * Thin, read-only client for the custom CMS (a SEPARATE project/deployment).
 * The marketing site consumes published content over HTTP only — it never
 * touches the CMS database or admin (FR-004). See ../../specs/001-custom-cms.
 *
 * Env:
 *   CMS_URL            base URL of the CMS deployment (e.g. https://api.cdna...)
 *   CMS_READ_API_KEY   read API key (x-api-key), if the CMS enforces one
 */

// Normalise the base so endpoints always resolve to `${origin}/api/content/...`,
// whether CMS_URL is the origin or already ends in `/api` (D8).
const BASE = process.env.CMS_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "");
// Accept the standardised name, falling back to the legacy READ_API_KEY.
const KEY = process.env.CMS_READ_API_KEY ?? process.env.READ_API_KEY;

type Query = Record<string, string | string[] | number | undefined>;

function qs(params?: Query): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else sp.append(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function cmsGet<T>(path: string, tags: string[]): Promise<T | null> {
  if (!BASE) {
    console.warn("[cms] CMS_URL not set");
    return null;
  }
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: KEY ? { "x-api-key": KEY } : undefined,
      // Cache + tag so the revalidation webhook can refresh on publish.
      next: { tags: ["cms", ...tags] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    // CMS unreachable / bad response — degrade gracefully (FR-107): callers
    // treat null as "no content" and serve last-good cache / empty states.
    console.warn(`[cms] fetch failed for ${path}:`, (err as Error)?.message);
    return null;
  }
}

export interface ListResult<T = Record<string, unknown>> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** List a collection type: cases | solutions | people | regions | insights. */
export function getList<T = Record<string, unknown>>(
  type: string,
  params?: Query,
) {
  return cmsGet<ListResult<T>>(`/api/content/${type}${qs(params)}`, [
    `cms:${type}`,
  ]);
}

/** Faceted case-study library. */
export function getCases(
  params?: {
    industry?: string[];
    service?: string[];
    region?: string[];
    outcome?: string[];
    page?: number;
    pageSize?: number;
    locale?: string;
  },
) {
  return cmsGet<ListResult>(`/api/content/cases${qs(params)}`, ["cms:case"]);
}

/** Single published entry by slug. Returns null (404) for drafts/missing. */
export function getEntry(type: string, slug: string, locale = "en") {
  return cmsGet<Record<string, unknown>>(
    `/api/content/${type}/${slug}${qs({ locale })}`,
    [`cms:${type}`, `cms:${type}:${slug}`],
  );
}

/** Singleton page: 5h | book | awards | privacy | cookies | terms. */
export function getPage(key: string, locale = "en") {
  return cmsGet<Record<string, unknown>>(
    `/api/content/pages/${key}${qs({ locale })}`,
    [`cms:page:${key}`],
  );
}

/**
 * Fetch a DRAFT entry for the preview route, authorised by a signed preview
 * token minted by the CMS. Never cached — drafts change constantly and must not
 * leak into the CDN or a shared tag.
 */
export async function getPreviewEntry(
  type: string,
  id: string,
  token: string,
): Promise<Record<string, unknown> | null> {
  if (!BASE) {
    console.warn("[cms] CMS_URL not set");
    return null;
  }
  try {
    const res = await fetch(
      `${BASE}/api/content/preview/${type}/${id}?token=${encodeURIComponent(token)}`,
      { headers: KEY ? { "x-api-key": KEY } : undefined, cache: "no-store" },
    );
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch (err) {
    console.warn("[cms] preview fetch failed:", (err as Error)?.message);
    return null;
  }
}
