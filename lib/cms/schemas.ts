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
  })
  .passthrough();

export const caseEntry = entry(caseData);

// ---- Solutions -------------------------------------------------------------
export const solutionListItem = z.object({ ...listItemBase }).passthrough();

export const solutionData = z
  .object({
    title: z.string(),
    problemStatement: z.string().optional(),
    body: z.string().optional(),
    cta: z.object({ label: z.string(), href: z.string() }).partial().optional(),
    proofRefs: z.array(z.unknown()).optional(),
    coverUrl: z.string().url().optional(),
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
  })
  .passthrough();

export const insightEntry = entry(insightData);

// ---- People ----------------------------------------------------------------
export const socialSchema = z.object({
  type: z.enum(["linkedin", "x", "instagram", "email"]),
  href: z.string(),
});

export const personListItem = z
  .object({ ...listItemBase, coverUrl: z.string().url().optional() })
  .passthrough();

export const personData = z
  .object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.array(z.string()).or(z.string()).optional(),
    photoUrl: z.string().url().optional(),
    coverUrl: z.string().url().optional(),
    socials: z.array(socialSchema).optional(),
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

export type CaseListItem = z.infer<typeof caseListItem>;
export type CaseEntry = z.infer<typeof caseEntry>;
export type SolutionListItem = z.infer<typeof solutionListItem>;
export type SolutionEntry = z.infer<typeof solutionEntry>;
export type InsightListItem = z.infer<typeof insightListItem>;
export type InsightEntry = z.infer<typeof insightEntry>;
export type PersonEntry = z.infer<typeof personEntry>;
export type RegionListItem = z.infer<typeof regionListItem>;
export type RegionEntry = z.infer<typeof regionEntry>;
export type PageEntry = z.infer<typeof pageEntry>;
export type Social = z.infer<typeof socialSchema>;
