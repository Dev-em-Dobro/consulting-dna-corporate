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
 * Map the CMS `resources[]` array (shared by cases, solutions and insights) to
 * downloadable links. The read API resolves `fileMediaId` → `fileUrl`; drop any
 * row without a resolved URL (un-uploaded/placeholder), and fall back to a
 * generic label when a resource has no title.
 */
function mapResources(refs?: S.ResourceRefRaw[]): ResourceLink[] | undefined {
  if (!refs?.length) return undefined;
  const out: ResourceLink[] = [];
  for (const r of refs) {
    if (!r.fileUrl) continue;
    out.push({ title: plainText(r.title) || "Download", url: r.fileUrl });
  }
  return out.length ? out : undefined;
}

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
  /**
   * O slug da entrada no CMS.
   *
   * ⚠️ EXISTE PORQUE O NOME NÃO SERVE PARA CASAR. A /team precisa ligar cada um
   * dos seis da liderança (que vêm de `lib/team.ts`) ao perfil do CMS, e os
   * nomes divergem: o CMS grava "Jon-Paul (JP) Pritchard" contra o nosso "Jon
   * Paul Pritchard", e "Nitin Goil " com espaço no fim. Casar por nome
   * normalizado funcionaria hoje e quebraria em silêncio na primeira edição
   * feita pelo admin — o slug é estável e é a chave de verdade da entrada.
   */
  slug: string;
  name: string; role: string; img?: string; bio: string[]; bioHtml?: string;
  socials?: Social[]; values?: string; strengths?: string; specialties?: string[];
  trackRecord?: string[]; clients?: string; languages?: string; skills?: string[];
};
/** A downloadable file surfaced on a detail page ("Reports & Resources"). */
export type ResourceLink = { title: string; url: string };
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
  slug: string; tags: string[];
  /** The client's name — also the key that resolves the logo and brand colour. */
  title: string;
  /** The case's own headline, when authored; the page falls back to `title`. */
  headline?: string;
  intro?: string;            // introduction — rich text (HTML)
  quote?: string; quoter?: string;
  text?: string;             // main body — rich text (HTML)
  videoUrl?: string; mutedVideoUrl?: string; coverUrl?: string;
  resources?: ResourceLink[];
  // Header band shown before the story (27-08 brief, item 7). Only the filled
  // slots render, so a partially-authored case degrades to fewer cells.
  facts: CaseFact[];
  // Legacy structured body, rendered only when a case has no single `text`.
  body: { challenge?: string; approach?: string; outcome?: string; measurableResult?: string };
};
/** One cell of the case header band: a label from the brief and its value. */
export type CaseFact = { label: string; value: string };
export type SolutionCard = { slug: string; title: string };
/** A client-proof quote surfaced on a solution page ("Client Perspective"). */
export type ProofRef = { quote: string; author?: string; role?: string; caseSlug?: string };
export type SolutionVM = {
  slug: string; title: string; problemStatement?: string; body?: string;
  // The 27-08 brief's five blocks: problemStatement is "The Challenge";
  // `outcome` and `howWeHelp` are its middle two; evidence comes from
  // `flagshipCaseSlug` + `proofRefs`; the CTA closes the page.
  outcome?: string; howWeHelp?: string; flagshipCaseSlug?: string;
  cta?: { label?: string; href?: string }; coverUrl?: string; bannerUrl?: string;
  // Bloco 6 do outline de 09-09, por serviço (campos novos no CMS em 11-09).
  ctaStrapline?: string; ctaLine?: string; ctaLabel?: string;
  proofRefs?: ProofRef[];
  resources?: ResourceLink[];
};
export type InsightCard = { slug: string; title: string; summary?: string; publishedAt: string };
export type InsightVM = { slug: string; title: string; body?: string; coverUrl?: string; author?: string; publishedAt?: string; readingMinutes: number; resources?: ResourceLink[] };
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
      slug: it.slug,
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

/**
 * Build the case header band (27-08 brief, item 7) in the brief's fixed order:
 * Countries → Participants/Leaders → Reach/Scale → Intervention → Impact.
 * Blank slots are dropped rather than rendered empty, so a case that has only
 * some of the figures still shows a coherent band instead of gaps. Returns an
 * empty array when none are authored, and the band is skipped entirely.
 */
function caseFacts(d: {
  countries?: string; participants?: string; reach?: string;
  intervention?: string; impact?: string;
}): CaseFact[] {
  return (
    [
      { label: "Countries", value: d.countries },
      { label: "Participants / Leaders", value: d.participants },
      { label: "Reach / Scale", value: d.reach },
      { label: "Intervention", value: d.intervention },
      { label: "Impact", value: d.impact },
    ] as const
  ).flatMap(({ label, value }) => {
    const v = plainText(value)?.trim();
    return v ? [{ label, value: v }] : [];
  });
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
    headline: plainText(d.headline)?.trim() || undefined,
    // introduction / text are rich text → keep HTML for <RichText>.
    intro: d.introduction ?? d.summary,
    quote: plainText(d.quote ?? d.clientQuote),
    quoter: plainText(d.quoter),
    text: d.text,
    videoUrl: d.videoUrl,
    mutedVideoUrl: d.mutedVideoUrl,
    coverUrl: d.coverUrl,
    resources: mapResources(d.resources),
    facts: caseFacts(d),
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
      // The 27-08 brief made the case header band the canonical place for a
      // case's figures, so its "Impact" cell is the first source for the card
      // metric; `measurableResult` stays as the fallback for cases authored
      // under the older model. Both run through `splitMetric`, which pulls a
      // leading "45%" / "2,582" out as the highlight number.
      const impactFact = art?.facts.find((f) => f.label === "Impact")?.value;
      const metric = splitMetric(impactFact ?? art?.body.measurableResult);
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

/**
 * One Solution on the index, led by its outcome (27-08 brief, item 5): the
 * listing should say what changes for the client, not just name the service.
 *
 * `outcome` is the block authored on the Solution page, reduced to plain text —
 * the index needs one line, not a rich-text body. `problemStatement` comes
 * along as the fallback lead for solutions authored before the field existed.
 *
 * This costs one fetch per solution, which is why it is separate from
 * `getSolutionCards`: the nav dropdown needs names only and must stay cheap.
 */
export type SolutionIndexEntry = {
  slug: string;
  title: string;
  outcome?: string;
  problemStatement?: string;
};

export async function getSolutionIndexEntries(): Promise<SolutionIndexEntry[]> {
  const cards = await getSolutionCards();
  const entries = await Promise.all(cards.map((c) => getSolution(c.slug)));
  return cards.map((c, i) => {
    const s = entries[i];
    return {
      slug: c.slug,
      title: c.title,
      outcome: plainText(s?.outcome)?.trim() || undefined,
      problemStatement: s?.problemStatement?.trim() || undefined,
    };
  });
}

// ---- Partnerships / ticker / testimonial videos (27-08 brief) --------------

/** Our Partnerships (item 12): what each relationship enables for clients. */
export type PartnershipVM = {
  slug: string; title: string;
  enablesForClients?: string;   // rich text (HTML)
  logoUrl?: string; websiteUrl?: string;
};

/** One running-ticker entry (item 17), 2023 onwards. */
export type TickerEntry = {
  slug: string; text: string;
  category?: string; date?: string; linkUrl?: string;
};

/** An individual client testimonial video (item 13). */
export type TestimonialVideoVM = {
  slug: string; name: string;
  client?: string; role?: string;
  videoUrl?: string; youtubeUrl?: string; posterUrl?: string; caseSlug?: string;
};

export async function getPartnerships(): Promise<PartnershipVM[]> {
  const res = await getList("partnerships");
  if (!res) return [];
  const items = parseItems<S.PartnershipListItem>(res.items, S.partnershipListItem);
  const entries = await Promise.all(
    items.map((i) => getEntry("partnerships", i.slug)),
  );
  return entries.flatMap((raw) => {
    const r = S.partnershipEntry.safeParse(raw);
    if (!r.success) return [];
    const d = r.data.data;
    return [{
      slug: r.data.slug,
      title: plainText(d.title) ?? "",
      enablesForClients: d.enablesForClients,
      logoUrl: d.logoUrl,
      websiteUrl: d.websiteUrl,
    }];
  });
}

/**
 * Ticker entries, newest first. Rendered straight from the list projection —
 * no per-entry fetch — because the CMS surfaces category/date/link on the list
 * item. Items are sorted by the authored event `date` (falling back to the
 * publication date) and, per the brief, anything before 2023 is dropped.
 */
export async function getTickerEntries(): Promise<TickerEntry[]> {
  const res = await getList("ticker");
  if (!res) return [];
  return parseItems<S.TickerListItem>(res.items, S.tickerListItem)
    .map((t) => ({
      slug: t.slug,
      text: plainText(t.title) ?? "",
      category: plainText(t.category),
      date: t.date,
      linkUrl: t.linkUrl,
      sortKey: t.date ?? t.publishedAt,
    }))
    .filter((t) => t.text && (!t.sortKey || t.sortKey >= "2023"))
    .sort((a, b) => (b.sortKey ?? "").localeCompare(a.sortKey ?? ""))
    .map(({ sortKey: _sortKey, ...t }) => t);
}

export async function getTestimonialVideos(): Promise<TestimonialVideoVM[]> {
  const res = await getList("testimonial-videos");
  if (!res) return [];
  const items = parseItems<S.TestimonialVideoListItem>(
    res.items,
    S.testimonialVideoListItem,
  );
  const entries = await Promise.all(
    items.map((i) => getEntry("testimonial-videos", i.slug)),
  );
  return entries.flatMap((raw) => {
    const r = S.testimonialVideoEntry.safeParse(raw);
    if (!r.success) return [];
    const d = r.data.data;
    // A video with neither a file nor a YouTube link has nothing to play.
    if (!d.videoUrl && !d.youtubeUrl) return [];
    return [{
      slug: r.data.slug,
      name: plainText(d.title) ?? "",
      client: plainText(d.client),
      role: plainText(d.role),
      videoUrl: d.videoUrl,
      youtubeUrl: d.youtubeUrl,
      posterUrl: d.posterUrl,
      caseSlug: plainText(d.caseSlug)?.trim() || undefined,
    }];
  });
}

/**
 * Map the CMS `proofRefs` array to the view model. The CMS ships blank/partial
 * placeholder rows (e.g. `{}` or all-empty strings), so drop any ref without a
 * quote — a proof block only renders when there is something to quote.
 */
function mapProofRefs(refs?: S.ProofRefRaw[]): ProofRef[] | undefined {
  if (!refs?.length) return undefined;
  const out: ProofRef[] = [];
  for (const p of refs) {
    const quote = plainText(p.quote);
    if (!quote) continue;
    const caseSlug = typeof p.caseSlug === "string" && p.caseSlug.trim() ? p.caseSlug.trim() : undefined;
    out.push({ quote, author: plainText(p.author), role: plainText(p.role), caseSlug });
  }
  return out.length ? out : undefined;
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
    // outcome / howWeHelp / body are rendered via <RichText> — keep HTML intact.
    outcome: d.outcome,
    howWeHelp: d.howWeHelp,
    flagshipCaseSlug: plainText(d.flagshipCaseSlug)?.trim() || undefined,
    body: d.body,
    cta: d.cta ? { label: plainText(d.cta.label), href: d.cta.href } : undefined,
    // `plainText` porque os três são texto simples no editor, mas o campo de
    // richtext ao lado ensina o hábito de colar com marcação.
    ctaStrapline: plainText(d.ctaStrapline),
    ctaLine: plainText(d.ctaLine),
    ctaLabel: plainText(d.ctaLabel),
    coverUrl: d.coverUrl,
    bannerUrl: d.bannerUrl,
    proofRefs: mapProofRefs(d.proofRefs),
    resources: mapResources(d.resources),
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

/** Byline used until an individual author has been reviewed and approved. */
const CORPORATE_AUTHOR = "Corporate DNA";

/**
 * Resolve an insight's published byline (correcao-06-08 item 10 / status review
 * §10). An individual's name is only shown once CDNA has explicitly approved it
 * (`authorApprovalStatus === "approved"`). With no author, or any non-approved
 * status, the piece is attributed to the firm as "Corporate DNA" — never to an
 * unapproved individual. The byline is therefore always present.
 */
function insightAuthor(d: Record<string, unknown>): string {
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  const name = plainText(str(d.author)) ?? plainText(str(d.authorName));
  if (!name) return CORPORATE_AUTHOR;
  const status = plainText(str(d.authorApprovalStatus))?.toLowerCase();
  return status === "approved" ? name : CORPORATE_AUTHOR;
}

function mapInsight(raw: unknown): InsightVM | null {
  const r = S.insightEntry.safeParse(raw);
  if (!r.success) return null;
  // body is rendered via <RichText>; title is a plain-text heading.
  const d = r.data.data as Record<string, unknown>;
  return {
    slug: r.data.slug,
    title: plainText(r.data.data.title) ?? "",
    body: r.data.data.body,
    coverUrl: r.data.data.coverUrl,
    // Gated byline: an unapproved individual name falls back to "Corporate DNA".
    author: insightAuthor(d),
    // Publish date from the entry envelope (used for Article structured data).
    publishedAt: r.data.publishedAt,
    // Reading time from the body, so the detail page can show it like the card.
    readingMinutes: readingMinutes(r.data.data.body),
    resources: mapResources(r.data.data.resources),
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
