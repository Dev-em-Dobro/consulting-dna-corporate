/**
 * Thin, read-only client for the custom CMS (a SEPARATE project/deployment).
 * The marketing site consumes published content over HTTP only — it never
 * touches the CMS database or admin (FR-004). See ../../specs/001-custom-cms.
 *
 * Env:
 *   CMS_URL            base URL of the CMS deployment (e.g. https://api.cdna...)
 *   CMS_READ_API_KEY   read API key (x-api-key), if the CMS enforces one
 */

const BASE = process.env.CMS_URL;
const KEY = process.env.CMS_READ_API_KEY;

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
  const res = await fetch(`${BASE}${path}`, {
    headers: KEY ? { "x-api-key": KEY } : undefined,
    // Cache + tag so the revalidation webhook can refresh on publish.
    next: { tags: ["cms", ...tags] },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
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
