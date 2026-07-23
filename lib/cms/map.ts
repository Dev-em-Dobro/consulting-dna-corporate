/**
 * High-level, typed CMS fetchers used by the pages (D4). Each combines:
 *   client (HTTP) → schema (Zod parse) → view model (component props).
 * Lists drop items that fail validation; detail fetchers return null on miss/parse-fail so
 * routes can call notFound(). All calls are server-side (client.ts sends the key).
 */
import { getList, getCases, getEntry, getPage, getPreviewEntry } from "./client";
import * as S from "./schemas";
import type { Social } from "./schemas";
import { plainText, plainTextList } from "./text";

function parseItems<T>(items: unknown[], schema: { safeParse: (x: unknown) => { success: boolean; data?: T } }): T[] {
  const out: T[] = [];
  for (const it of items) {
    const r = schema.safeParse(it);
    if (r.success && r.data) out.push(r.data);
    else console.warn("[cms] dropped invalid list item");
  }
  return out;
}

/**
 * Build the modal's socials array from the CMS person data. The CMS authors
 * each network as a flat field (data.linkedin, data.x/twitter, ...), so collect
 * whichever are filled; fall back to a pre-built `socials` array if the CMS ever
 * sends one. Empty → undefined so the modal hides the row entirely.
 */
const SOCIAL_FIELDS: { type: Social["type"]; keys: string[] }[] = [
  { type: "linkedin", keys: ["linkedin"] },
  { type: "x", keys: ["x", "twitter"] },
  { type: "instagram", keys: ["instagram"] },
  { type: "email", keys: ["email"] },
];

function buildSocials(d?: S.PersonEntry["data"]): Social[] | undefined {
  if (!d) return undefined;
  if (d.socials?.length) return d.socials;
  const rec = d as Record<string, unknown>;
  const out: Social[] = [];
  for (const { type, keys } of SOCIAL_FIELDS) {
    const raw = keys
      .map((k) => rec[k])
      .find((v): v is string => typeof v === "string" && v.trim() !== "");
    if (!raw) continue;
    const val = raw.trim();
    const href = type === "email" && !/^mailto:/i.test(val) ? `mailto:${val}` : val;
    out.push({ type, href });
  }
  return out.length ? out : undefined;
}

const caseTags =(f?: { industry?: string[]; service?: string[]; outcome?: string[] }): string[] =>
  [...(f?.industry ?? []), ...(f?.service ?? []), ...(f?.outcome ?? [])];

// ---- View models -----------------------------------------------------------
export type PersonVM = {
  name: string; role: string; img?: string; bio: string[]; bioHtml?: string;
  socials?: Social[]; values?: string; strengths?: string; specialties?: string[];
  trackRecord?: string[]; clients?: string; languages?: string; skills?: string[];
};
export type CaseCard = { slug: string; title: string; summary?: string; coverUrl?: string; tags: string[] };
export type CaseArticle = {
  slug: string; tags: string[]; title: string;
  intro?: string;            // introduction — rich text (HTML)
  quote?: string; quoter?: string;
  text?: string;             // main body — rich text (HTML)
  videoUrl?: string; mutedVideoUrl?: string; coverUrl?: string;
  // Legacy structured body, rendered only when a case has no single `text`.
  body: { challenge?: string; approach?: string; outcome?: string; measurableResult?: string };
};
export type SolutionCard = { slug: string; title: string };
export type SolutionVM = {
  slug: string; title: string; problemStatement?: string; body?: string;
  cta?: { label?: string; href?: string }; coverUrl?: string; bannerUrl?: string;
};
export type InsightCard = { slug: string; title: string; summary?: string; publishedAt: string };
export type InsightVM = { slug: string; title: string; body?: string; coverUrl?: string };
export type RegionCard = { slug: string; name: string };
export type RegionVM = {
  slug: string; name: string; city?: string; country?: string;
  addressLines?: string[]; body?: string; coverUrl?: string;
};
/** A location for the homepage locations block (address + derived contact email). */
export type Location = {
  slug: string; name: string; city?: string; country?: string;
  addressLines: string[]; email: string;
};
export type CmsPage = { key?: string; data: Record<string, unknown> };

// ---- People ----------------------------------------------------------------
export async function getPeople(): Promise<PersonVM[]> {
  const res = await getList("people");
  if (!res) return [];
  // The list endpoint returns COMPACT items (title/summary/coverUrl — no `data`),
  // so parse those, then fetch each person's detail entry for the richer profile
  // (name, role, photo, bio HTML) shown in the modal. Same N+1 shape as
  // getRegionLocations. A person whose detail fails to load still renders from
  // its list item, so the grid never silently drops a published person.
  const items = parseItems<S.PersonListItem>(res.items, S.personListItem);
  const details = await Promise.all(items.map((it) => getEntry("people", it.slug)));
  return items.map((it, i) => {
    const parsed = S.personEntry.safeParse(details[i]);
    const d = parsed.success ? parsed.data.data : undefined;
    return {
      name: plainText(d?.name) ?? plainText(it.title) ?? "",
      role: plainText(d?.role) ?? plainText(it.summary) ?? "",
      img: d?.photoUrl ?? d?.coverUrl ?? it.coverUrl,
      // The CMS stores the full profile as a single HTML string; keep it as
      // bioHtml (rendered via RichText) and leave the legacy structured `bio` empty.
      bio: [],
      bioHtml: typeof d?.bio === "string" ? d.bio : undefined,
      socials: buildSocials(d),
      values: plainText(d?.values),
      strengths: plainText(d?.strengths),
      specialties: plainTextList(d?.specialties),
      trackRecord: plainTextList(d?.trackRecord),
      clients: plainText(d?.clients),
      languages: plainText(d?.languages),
      skills: plainTextList(d?.skills),
    };
  });
}

// ---- Cases -----------------------------------------------------------------
export async function getCaseCards(facets?: Parameters<typeof getCases>[0]): Promise<CaseCard[]> {
  const res = await getCases(facets);
  if (!res) return [];
  return parseItems<S.CaseListItem>(res.items, S.caseListItem).map((c) => ({
    slug: c.slug,
    title: plainText(c.title) ?? "",
    summary: plainText(c.summary),
    coverUrl: c.coverUrl,
    tags: caseTags(c.facets),
  }));
}

function mapCase(raw: unknown): CaseArticle | null {
  const r = S.caseEntry.safeParse(raw);
  if (!r.success) return null;
  const d = r.data.data;
  // Prefer the free-form `tags` list; fall back to the facet-derived tags.
  const tags = d.tags?.length ? d.tags.map((t) => plainText(t)).filter((t): t is string => !!t) : caseTags(d.facets);
  return {
    slug: r.data.slug,
    tags,
    title: plainText(d.title) ?? "",
    // introduction / text are rich text → keep HTML for <RichText>.
    intro: d.introduction ?? d.summary,
    quote: plainText(d.quote ?? d.clientQuote),
    quoter: plainText(d.quoter),
    text: d.text,
    videoUrl: d.videoUrl,
    mutedVideoUrl: d.mutedVideoUrl,
    coverUrl: d.coverUrl,
    body: {
      challenge: plainText(d.challenge),
      approach: plainText(d.approach),
      outcome: plainText(d.outcome),
      measurableResult: plainText(d.measurableResult),
    },
  };
}

export async function getCaseArticle(slug: string): Promise<CaseArticle | null> {
  const raw = await getEntry("cases", slug);
  return raw ? mapCase(raw) : null;
}

// ---- Solutions -------------------------------------------------------------
export async function getSolutionCards(): Promise<SolutionCard[]> {
  const res = await getList("solutions");
  if (!res) return [];
  return parseItems<S.SolutionListItem>(res.items, S.solutionListItem).map((s) => ({
    slug: s.slug,
    title: plainText(s.title) ?? "",
  }));
}

function mapSolution(raw: unknown): SolutionVM | null {
  const r = S.solutionEntry.safeParse(raw);
  if (!r.success) return null;
  const d = r.data.data;
  return {
    slug: r.data.slug,
    title: plainText(d.title) ?? "",
    // Plain-text slot (hero subtitle) — strip any rich-text markup the CMS emits.
    problemStatement: plainText(d.problemStatement),
    // body is rendered via <RichText>, so keep its HTML intact.
    body: d.body,
    cta: d.cta ? { label: plainText(d.cta.label), href: d.cta.href } : undefined,
    coverUrl: d.coverUrl,
    bannerUrl: d.bannerUrl,
  };
}

export async function getSolution(slug: string): Promise<SolutionVM | null> {
  const raw = await getEntry("solutions", slug);
  return raw ? mapSolution(raw) : null;
}

// ---- Insights --------------------------------------------------------------
export async function getInsightCards(): Promise<InsightCard[]> {
  const res = await getList("insights");
  if (!res) return [];
  return parseItems<S.InsightListItem>(res.items, S.insightListItem).map((i) => ({
    slug: i.slug,
    title: plainText(i.title) ?? "",
    summary: plainText(i.summary),
    publishedAt: i.publishedAt,
  }));
}

function mapInsight(raw: unknown): InsightVM | null {
  const r = S.insightEntry.safeParse(raw);
  if (!r.success) return null;
  // body is rendered via <RichText>; title is a plain-text heading.
  return { slug: r.data.slug, title: plainText(r.data.data.title) ?? "", body: r.data.data.body, coverUrl: r.data.data.coverUrl };
}

export async function getInsight(slug: string): Promise<InsightVM | null> {
  const raw = await getEntry("insights", slug);
  return raw ? mapInsight(raw) : null;
}

// ---- Regions ---------------------------------------------------------------
export async function getRegionCards(): Promise<RegionCard[]> {
  const res = await getList("regions");
  if (!res) return [];
  return parseItems<S.RegionListItem>(res.items, S.regionListItem).map((r) => ({ slug: r.slug, name: plainText(r.title) ?? "" }));
}

function mapRegion(raw: unknown): RegionVM | null {
  const r = S.regionEntry.safeParse(raw);
  if (!r.success) return null;
  const d = r.data.data;
  return {
    slug: r.data.slug, name: plainText(d.name) ?? "", city: plainText(d.city), country: plainText(d.country),
    addressLines: plainTextList(d.addressLines),
    // body is rendered via <RichText>, so keep its HTML intact.
    body: d.body, coverUrl: d.coverUrl,
  };
}

export async function getRegion(slug: string): Promise<RegionVM | null> {
  const raw = await getEntry("regions", slug);
  return raw ? mapRegion(raw) : null;
}

/** Slug/city -> a per-office contact email, matching the published pattern. */
function officeEmail(vm: RegionVM): string {
  const handle = (vm.city ?? vm.name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
  return `${handle}@corporatednaconsulting.com`;
}

/**
 * All published regions as homepage locations (address + derived contact
 * email). The list endpoint only returns compact items, so we fetch each
 * region's detail to get its address lines. Regions without an address are
 * dropped so the block never shows an empty office.
 */
export async function getRegionLocations(): Promise<Location[]> {
  const cards = await getRegionCards();
  const vms = await Promise.all(cards.map((c) => getRegion(c.slug)));
  return vms
    .filter((vm): vm is RegionVM => !!vm && !!vm.addressLines?.length)
    .map((vm) => ({
      slug: vm.slug, name: vm.name, city: vm.city, country: vm.country,
      addressLines: vm.addressLines!, email: officeEmail(vm),
    }));
}

// ---- Singleton pages -------------------------------------------------------
export async function getCmsPage(key: string): Promise<CmsPage | null> {
  const raw = await getPage(key);
  if (!raw) return null;
  const r = S.pageEntry.safeParse(raw);
  if (!r.success) return null;
  return { key: r.data.key, data: r.data.data };
}

// ---- Draft preview ---------------------------------------------------------
/**
 * Fetch + map a DRAFT entry for the preview route. Reuses the same mappers as
 * the published pages, so a preview renders identically to the live page. The
 * `type` accepts either the plural segment (solutions) or the raw type
 * (solution) — whichever the CMS put in the preview link.
 */
export type PreviewResult =
  | { kind: "solution"; vm: SolutionVM }
  | { kind: "insight"; vm: InsightVM }
  | { kind: "case"; vm: CaseArticle }
  | { kind: "region"; vm: RegionVM };

export async function getPreview(
  type: string,
  id: string,
  token: string,
): Promise<PreviewResult | null> {
  const raw = await getPreviewEntry(type, id, token);
  if (!raw) return null;
  switch (type) {
    case "solutions":
    case "solution": {
      const vm = mapSolution(raw);
      return vm ? { kind: "solution", vm } : null;
    }
    case "insights":
    case "insight": {
      const vm = mapInsight(raw);
      return vm ? { kind: "insight", vm } : null;
    }
    case "cases":
    case "case": {
      const vm = mapCase(raw);
      return vm ? { kind: "case", vm } : null;
    }
    case "regions":
    case "region": {
      const vm = mapRegion(raw);
      return vm ? { kind: "region", vm } : null;
    }
    default:
      return null;
  }
}
