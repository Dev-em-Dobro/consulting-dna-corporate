/**
 * High-level, typed CMS fetchers used by the pages (D4). Each combines:
 *   client (HTTP) → schema (Zod parse) → view model (component props).
 * Lists drop items that fail validation; detail fetchers return null on miss/parse-fail so
 * routes can call notFound(). All calls are server-side (client.ts sends the key).
 */
import fs from "node:fs";
import path from "node:path";
import { getList, getCases, getEntry, getPage, getPreviewEntry } from "./client";
import * as S from "./schemas";
import type { Social } from "./schemas";
import { plainText, plainTextList } from "./text";
import { countriesToIso3 } from "../coverage";
import { LOGO_COLORS } from "../logo-colors";

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

/**
 * Client brand logos live in `public/logos/<name>.png`, named as the slugified
 * client (e.g. "Shell" → shell.png, "Coca Cola" → coca_cola.png). Read the
 * folder once and match a slugified client name to a file; return the public
 * URL, or undefined when no logo exists (the case band then stays dark, no image).
 */
let logoSet: Set<string> | null = null;
function logoBasenames(): Set<string> {
  if (logoSet) return logoSet;
  logoSet = new Set();
  try {
    const dir = path.join(process.cwd(), "public", "logos");
    for (const f of fs.readdirSync(dir)) {
      if (f.toLowerCase().endsWith(".png")) logoSet.add(f.slice(0, -4).toLowerCase());
    }
  } catch {
    // No logos folder (or not on a filesystem) → every case band stays dark.
  }
  return logoSet;
}

function logoSlug(client: string): string {
  return client
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’´`]/g, "") // drop apostrophes so "Levi's" → levis, not levi_s
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Client legal names don't always slugify to the brand's logo filename. Map the
// slugified client name → the actual logo basename for those mismatches.
const LOGO_ALIASES: Record<string, string> = {
  levi_strauss_and_co: "levis",
};

function resolveClientLogo(client: string): { url?: string; color?: string } {
  if (!client) return {};
  const slug = LOGO_ALIASES[logoSlug(client)] ?? logoSlug(client);
  if (!logoBasenames().has(slug)) return {};
  // Predominant brand colour is baked by scripts/gen-logo-colors.ts.
  return { url: `/logos/${slug}.png`, color: LOGO_COLORS[slug] };
}

// ---- View models -----------------------------------------------------------
export type PersonVM = {
  name: string; role: string; img?: string; bio: string[]; bioHtml?: string;
  socials?: Social[]; values?: string; strengths?: string; specialties?: string[];
  trackRecord?: string[]; clients?: string; languages?: string; skills?: string[];
};
export type CaseCard = { slug: string; title: string; summary?: string; coverUrl?: string; tags: string[] };
export type CaseListEntry = {
  slug: string;
  client: string;        // case title, used as the client name
  tags: string[];        // free tags, else facet-derived
  coverUrl?: string;
  challenge?: string;    // plain text
  metricValue?: string;  // e.g. "90%"
  metricLabel?: string;  // remainder of measurableResult
  publishedAt: string;   // ISO — for date sort
  logoUrl?: string;      // /logos/<client>.png when a brand logo exists
  logoColor?: string;    // predominant logo colour (hex) for the band tint
};
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
export type InsightVM = { slug: string; title: string; body?: string; coverUrl?: string; author?: string; publishedAt?: string };
/** Richer insight list row: adds cover + computed reading time for the library. */
export type InsightListEntry = {
  slug: string; title: string; summary?: string; coverUrl?: string;
  publishedAt: string; readingMinutes: number; author?: string;
};
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
/**
 * Split a free-form `measurableResult` string into a big highlight number and a
 * label, for the /cases card. If the string starts with a token containing a
 * digit (e.g. "90%", "3x", "2.5M", "$4B"), that token is the value and the rest
 * is the label; otherwise the whole string is the label (no big number).
 */
export function splitMetric(text?: string): { value?: string; label?: string } {
  const t = text?.trim();
  if (!t) return {};
  // Leading whitespace-free token containing a digit (e.g. "90%", "3x", "$4B") is
  // the highlight value; anything after it is the label. A value-only string
  // (e.g. "90%") yields just the value, no label.
  const m = t.match(/^(\S*\d\S*)(?:\s+([\s\S]*))?$/);
  if (m) {
    const label = m[2]?.replace(/^[\s—–:-]+/, "").trim();
    return { value: m[1], label: label || undefined };
  }
  return { label: t };
}

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

export async function getCaseArticle(slug: string, locale = "en"): Promise<CaseArticle | null> {
  const raw = await getEntry("cases", slug, locale);
  return raw ? mapCase(raw) : null;
}

/**
 * Pull a short excerpt of the "Client Challenge" section out of a case's rich
 * `text` body, for the /cases list preview. Grabs the content between the
 * "Client Challenge" heading and the next heading, flattens it to plain text,
 * and truncates to ~300 chars on a word boundary with an ellipsis. Returns
 * undefined when the body has no such section (so the row shows nothing).
 */
function challengeExcerpt(html?: string, max = 300): string | undefined {
  if (!html) return undefined;
  const heading = /<h[1-4][^>]*>\s*client\s+challenge\s*<\/h[1-4]>/i.exec(html);
  if (!heading) return undefined;
  const after = html.slice(heading.index + heading[0].length);
  const next = /<h[1-4][^>]*>/i.exec(after);
  const section = next ? after.slice(0, next.index) : after;
  const text = plainText(section);
  if (!text) return undefined;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const trimmed = cut.slice(0, cut.lastIndexOf(" ")).trimEnd() || cut.trimEnd();
  return `${trimmed}…`;
}

/**
 * Rich case list for the /cases library: the compact list (for slug, cover,
 * facets, publishedAt) enriched per-case with the detail entry (challenge,
 * measurableResult, tags). Same N+1 shape as getPeople. A case whose detail
 * fails to load still appears, just without challenge/metric.
 */
export async function getCaseListEntries(): Promise<CaseListEntry[]> {
  const res = await getCases();
  if (!res) return [];
  const items = parseItems<S.CaseListItem>(res.items, S.caseListItem);
  return Promise.all(
    items.map(async (it) => {
      const art = await getCaseArticle(it.slug);
      const metric = splitMetric(art?.body.measurableResult);
      const client = art?.title || plainText(it.title) || "";
      const logo = resolveClientLogo(client);
      return {
        slug: it.slug,
        client,
        // `caseTags(it.facets)` is only the fallback for when the detail entry failed to load.
        tags: art?.tags.length ? art.tags : caseTags(it.facets),
        coverUrl: art?.coverUrl ?? it.coverUrl,
        // Prefer the structured field; else pull the excerpt from the rich body.
        challenge: art?.body.challenge ?? challengeExcerpt(art?.text),
        metricValue: metric.value,
        metricLabel: metric.label,
        publishedAt: it.publishedAt,
        logoUrl: logo.url,
        logoColor: logo.color,
      };
    }),
  );
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

export async function getSolution(slug: string, locale = "en"): Promise<SolutionVM | null> {
  const raw = await getEntry("solutions", slug, locale);
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
  const d = r.data.data as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    slug: r.data.slug,
    title: plainText(r.data.data.title) ?? "",
    body: r.data.data.body,
    coverUrl: r.data.data.coverUrl,
    // Author is an optional CMS field (schema passes it through) → plain text.
    author: plainText(str(d.author)) ?? plainText(str(d.authorName)),
    // Publish date from the entry envelope (used for Article structured data).
    publishedAt: r.data.publishedAt,
  };
}

export async function getInsight(slug: string, locale = "en"): Promise<InsightVM | null> {
  const raw = await getEntry("insights", slug, locale);
  return raw ? mapInsight(raw) : null;
}

/** Reading time from body word count (~200 wpm), min 1 min. Computed on the site. */
function readingMinutes(html?: string): number {
  const text = plainText(html) ?? "";
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Rich insight list for the /insights library: the compact list enriched
 * per-insight with the detail entry (cover image + body for reading time).
 * Same N+1 shape as getCaseListEntries. Reading time is computed here (007
 * decision); author is optional until the CMS provides it (010).
 */
export async function getInsightListEntries(): Promise<InsightListEntry[]> {
  const cards = await getInsightCards();
  const details = await Promise.all(cards.map((c) => getInsight(c.slug)));
  return cards.map((c, i) => ({
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    coverUrl: details[i]?.coverUrl,
    publishedAt: c.publishedAt,
    readingMinutes: readingMinutes(details[i]?.body),
    author: details[i]?.author,
  }));
}

// ---- Regions ---------------------------------------------------------------
export async function getRegionCards(): Promise<RegionCard[]> {
  // pageSize 100 (the CMS cap) so all offices are returned — the list endpoint
  // defaults to 20, which would silently drop regions once there are more.
  const res = await getList("regions", { pageSize: 100 });
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

export async function getRegion(slug: string, locale = "en"): Promise<RegionVM | null> {
  const raw = await getEntry("regions", slug, locale);
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

/**
 * ISO3 country codes the firm operates in, derived from the published CMS
 * regions' `country` field (008), for the world coverage map. Returns [] when
 * the CMS has no regions (or none map to a known country) so the caller can
 * fall back to the static COVERAGE_ISO3 list.
 */
export async function getCoverageIso3(): Promise<string[]> {
  const cards = await getRegionCards();
  if (!cards.length) return [];
  const vms = await Promise.all(cards.map((c) => getRegion(c.slug)));
  return countriesToIso3(vms.map((vm) => vm?.country));
}

export type CoverageRegion = { slug: string; city?: string; country?: string };

/**
 * Published regions reduced to what the coverage map needs: `country` (which
 * country to paint) and `city` (geocoded to a pin). Unlike getRegionLocations,
 * this does NOT require an address — a region needs only country/city to appear
 * on the map. Returns [] when the CMS has no regions.
 */
export async function getCoverageRegions(): Promise<CoverageRegion[]> {
  const cards = await getRegionCards();
  if (!cards.length) return [];
  const vms = await Promise.all(cards.map((c) => getRegion(c.slug)));
  return vms
    .filter((v): v is RegionVM => !!v)
    .map((v) => ({ slug: v.slug, city: v.city, country: v.country }));
}

// ---- Singleton pages -------------------------------------------------------
export async function getCmsPage(key: string, locale = "en"): Promise<CmsPage | null> {
  const raw = await getPage(key, locale);
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
