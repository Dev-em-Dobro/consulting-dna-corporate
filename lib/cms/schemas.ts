/**
 * Zod schemas for the CMS read API responses (boundary validation — D3).
 * Shapes verified against the live API (see specs/002-site-cms-integration/research.md).
 * Schemas are intentionally permissive: only truly-required fields are required, everything
 * else is optional, and `.passthrough()` keeps additive CMS fields from breaking parsing (CG-2).
 */
import { z } from "zod";

export const facetsSchema = z
  .object({
    industry: z.array(z.string()).default([]),
    service: z.array(z.string()).default([]),
    region: z.array(z.string()).default([]),
    outcome: z.array(z.string()).default([]),
  })
  .partial()
  .passthrough();

/**
 * An embedded downloadable resource (the CMS `resources[]` array, shared by
 * cases, solutions and insights). The read API resolves `fileMediaId` to a
 * ready-to-use `fileUrl`; the site only surfaces a resource once that URL is
 * present, so an un-resolved/blank row is silently ignored.
 */
export const resourceRef = z
  .object({
    title: z.string().optional(),
    fileMediaId: z.string().optional(),
    fileUrl: z.string().url().optional(),
  })
  .passthrough();

/** Fields common to every list item. */
const listItemBase = {
  id: z.string(),
  type: z.string(),
  slug: z.string(),
  locale: z.string().default("en"),
  publishedAt: z.string(),
  title: z.string(),
};

export const listResult = <T extends z.ZodTypeAny>(item: T) =>
  z
    .object({
      items: z.array(item),
      page: z.number().default(1),
      pageSize: z.number().default(20),
      total: z.number().default(0),
    })
    .passthrough();

/** Single-entry envelope: `{ id, type, slug, locale, data, publishedAt }`. */
const entry = <T extends z.ZodTypeAny>(data: T) =>
  z
    .object({
      id: z.string(),
      type: z.string(),
      slug: z.string(),
      locale: z.string().default("en"),
      data,
      publishedAt: z.string(),
    })
    .passthrough();

// ---- Cases -----------------------------------------------------------------
export const caseListItem = z
  .object({
    ...listItemBase,
    summary: z.string().optional(),
    coverMediaId: z.string().optional(),
    coverUrl: z.string().url().optional(),
    facets: facetsSchema.optional(),
  })
  .passthrough();

export const caseData = z
  .object({
    title: z.string(),
    // Current content model: free tags, an intro, a quote (+ attribution) and a
    // single rich-text body.
    tags: z.array(z.string()).optional(),
    introduction: z.string().optional(),
    quote: z.string().optional(),
    quoter: z.string().optional(),
    text: z.string().optional(),
    // Case header band (27-08 brief, item 7), in the brief's order:
    // Countries → Participants/Leaders → Reach/Scale → Intervention → Impact.
    // Optional throughout — the band renders only the slots the CMS has filled.
    countries: z.string().optional(),
    participants: z.string().optional(),
    reach: z.string().optional(),
    intervention: z.string().optional(),
    impact: z.string().optional(),
    // Autoplay-muted showcase video (YouTube link or direct file).
    mutedVideoUrl: z.string().url().optional(),
    // Legacy model (kept so older cases keep rendering).
    summary: z.string().optional(),
    challenge: z.string().optional(),
    approach: z.string().optional(),
    outcome: z.string().optional(),
    measurableResult: z.string().optional(),
    clientQuote: z.string().optional(),
    facets: facetsSchema.optional(),
    coverMediaId: z.string().optional(),
    coverUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    resources: z.array(resourceRef).optional(),
  })
  .passthrough();

export const caseEntry = entry(caseData);

// ---- Solutions -------------------------------------------------------------
export const solutionListItem = z.object({ ...listItemBase }).passthrough();

/**
 * A single client-proof reference authored on a solution (the CMS `proofRefs`
 * array). Every field is optional — the CMS ships partially-filled/blank rows
 * (an empty `{}` placeholder is valid) and the site drops any ref without a
 * quote. `caseSlug`, when present, links the proof to a case study.
 */
export const proofRef = z
  .object({
    quote: z.string().optional(),
    author: z.string().optional(),
    role: z.string().optional(),
    caseSlug: z.string().optional(),
  })
  .passthrough();

export const solutionData = z
  .object({
    title: z.string(),
    // The 27-08 brief (item 5) fixes five blocks per Solution page:
    // The Challenge (problemStatement) → The Outcome → How CDNA Helps →
    // Evidence (flagshipCaseSlug + proofRefs) → Start a Conversation (cta).
    problemStatement: z.string().optional(),
    outcome: z.string().optional(),
    howWeHelp: z.string().optional(),
    flagshipCaseSlug: z.string().optional(),
    body: z.string().optional(),
    cta: z.object({ label: z.string(), href: z.string() }).partial().optional(),
    proofRefs: z.array(proofRef).optional(),
    resources: z.array(resourceRef).optional(),
    coverUrl: z.string().url().optional(),
    // Optional hero background, resolved by the CMS read API from `bannerMediaId`.
    bannerUrl: z.string().url().optional(),
  })
  .passthrough();

export const solutionEntry = entry(solutionData);

// ---- Insights --------------------------------------------------------------
export const insightListItem = z
  .object({ ...listItemBase, summary: z.string().optional() })
  .passthrough();

export const insightData = z
  .object({
    title: z.string(),
    excerpt: z.string().optional(),
    body: z.string().optional(),
    coverUrl: z.string().url().optional(),
    resources: z.array(resourceRef).optional(),
    // Optional external-attribution fields (status review §10), resolved server-side.
    author: z.string().optional(),
    // Editorial gate: an individual's name is only published once CDNA marks it
    // "approved" (§10 / correcao-06-08 item 10). Any other value — or none —
    // keeps the piece attributed to "Corporate DNA".
    authorApprovalStatus: z.string().optional(),
    originalSource: z.string().optional(),
    originalPublicationDate: z.string().optional(),
    sourceLink: z.string().url().optional(),
  })
  .passthrough();

export const insightEntry = entry(insightData);

// ---- People ----------------------------------------------------------------
export const socialSchema = z.object({
  type: z.enum(["linkedin", "x", "instagram", "email"]),
  href: z.string(),
});

export const personListItem = z
  .object({
    ...listItemBase,
    summary: z.string().optional(),
    coverUrl: z.string().url().optional(),
  })
  .passthrough();

export const personData = z
  .object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.array(z.string()).or(z.string()).optional(),
    photoUrl: z.string().url().optional(),
    coverUrl: z.string().url().optional(),
    socials: z.array(socialSchema).optional(),
    // Flat social fields as authored in the CMS (each an optional URL/handle).
    linkedin: z.string().optional(),
    x: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    email: z.string().optional(),
    values: z.string().optional(),
    strengths: z.string().optional(),
    specialties: z.array(z.string()).optional(),
    trackRecord: z.array(z.string()).optional(),
    clients: z.string().optional(),
    languages: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .passthrough();

export const personEntry = entry(personData);

// ---- Regions ---------------------------------------------------------------
export const regionListItem = z.object({ ...listItemBase }).passthrough();

export const regionData = z
  .object({
    name: z.string(),
    city: z.string().optional(),
    country: z.string().optional(),
    summary: z.string().optional(),
    addressLines: z.array(z.string()).optional(),
    body: z.string().optional(),
    coverUrl: z.string().url().optional(),
  })
  .passthrough();

export const regionEntry = entry(regionData);

// ---- Singleton pages (5h / book / awards) ----------------------------------
export const pageEntry = z
  .object({
    key: z.string().optional(),
    locale: z.string().default("en"),
    data: z.record(z.string(), z.unknown()).default({}),
    publishedAt: z.string().optional(),
  })
  .passthrough();

// ---- Partnerships / ticker / testimonial videos (27-08 brief) --------------
// Three collections added for items 12, 17 and 13. Partnerships and testimonial
// videos are read as full entries; the ticker renders straight from its list
// projection, which is why category/date/linkUrl travel on the list item.

export const partnershipListItem = z
  .object({ ...listItemBase, coverUrl: z.string().url().optional() })
  .passthrough();

export const partnershipData = z
  .object({
    title: z.string(),
    // The brief's required content: what the partnership enables for clients.
    enablesForClients: z.string().optional(),
    logoUrl: z.string().url().optional(),
    websiteUrl: z.string().url().optional(),
  })
  .passthrough();

export const partnershipEntry = entry(partnershipData);

export const tickerListItem = z
  .object({
    ...listItemBase,
    category: z.string().optional(),
    date: z.string().optional(),
    linkUrl: z.string().url().optional(),
  })
  .passthrough();

export const testimonialVideoListItem = z
  .object({ ...listItemBase, summary: z.string().optional(), coverUrl: z.string().url().optional() })
  .passthrough();

export const testimonialVideoData = z
  .object({
    title: z.string(),
    client: z.string().optional(),
    role: z.string().optional(),
    videoUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    posterUrl: z.string().url().optional(),
    caseSlug: z.string().optional(),
  })
  .passthrough();

export const testimonialVideoEntry = entry(testimonialVideoData);

export type CaseListItem = z.infer<typeof caseListItem>;
export type PartnershipListItem = z.infer<typeof partnershipListItem>;
export type PartnershipEntry = z.infer<typeof partnershipEntry>;
export type TickerListItem = z.infer<typeof tickerListItem>;
export type TestimonialVideoListItem = z.infer<typeof testimonialVideoListItem>;
export type TestimonialVideoEntry = z.infer<typeof testimonialVideoEntry>;
export type CaseEntry = z.infer<typeof caseEntry>;
export type SolutionListItem = z.infer<typeof solutionListItem>;
export type SolutionEntry = z.infer<typeof solutionEntry>;
export type ProofRefRaw = z.infer<typeof proofRef>;
export type ResourceRefRaw = z.infer<typeof resourceRef>;
export type InsightListItem = z.infer<typeof insightListItem>;
export type InsightEntry = z.infer<typeof insightEntry>;
export type PersonListItem = z.infer<typeof personListItem>;
export type PersonEntry = z.infer<typeof personEntry>;
export type RegionListItem = z.infer<typeof regionListItem>;
export type RegionEntry = z.infer<typeof regionEntry>;
export type PageEntry = z.infer<typeof pageEntry>;
export type Social = z.infer<typeof socialSchema>;
