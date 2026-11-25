import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getCaseCards,
  getInsightCards,
  getPartnerships,
} from "@/lib/cms/map";
import { services } from "@/lib/services";

export const revalidate = 3600;

// Absolute URL for a root-relative path ("" or "/" = home). Single locale, no
// locale prefix, so paths map 1:1 to the live URLs.
const abs = (path: string) => `${SITE_URL}${path || "/"}`;

// Evaluated when the module loads (build / cold start), so `lastmod` follows
// deploys for pages without a date of their own (SEO review, Nov 2026).
const DEPLOYED_AT = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // As páginas de serviço saíram do CMS em 11-09 (ver `lib/services.ts`), então
  // os dez slugs vêm do módulo e não de um fetch  -  o sitemap não pode listar a
  // taxonomia antiga enquanto as rotas publicadas são outras.
  const [cases, insights, partnerships] = await Promise.all([
    getCaseCards(),
    getInsightCards(),
    getPartnerships(),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/approach",
    "/services",
    // /services/regions and its pages are noindex placeholders (layout audit #79),
    // and /services/leadership redirects to /team (#80): neither is listed.
    "/our-clients",
    "/our-impact",
    "/team",
    "/cases",
    "/insights",
    // "/awards" is offline for now (404); add it back when the page returns.
    // Entrou em 11-09, quando Contact deixou de ser só a âncora `#contact` da
    // home. É rota indexável de verdade agora, e é a que as pessoas procuram
    // pelo nome  -  ficar de fora do sitemap seria esconder justamente essa.
    "/contact",
    // /events has real content since Oct 2026 and no noindex. The single event
    // pages still carry noindex, so only the list is included.
    "/events",
    "/privacy",
    "/cookies",
    "/terms",
    // `/our-partnerships` is added below, only once it has content.
    // `/our-identity` e `/about-v2` 308am para `/about` (next.config.mjs).
    // `/about-v1` é o arquivo da página antiga e fica FORA do sitemap.
    // "" (a home) é a antiga `/home-v2`, promovida em 10-09. `/home-v2` 308a
    // para cá; `/home-v1` é o arquivo da home antiga e fica FORA, com
    // `noindex`. `/home-v3` segue proposta, `noindex`, e também fora.
    // `/interviews` is a placeholder and carries `noindex`, so it is not listed.
    // `/books` redireciona para o livro na home e fica fora do sitemap.
  ];

  // Our Partnerships is a real route with no content until CDNA validates the
  // copy. It carries `noindex` while empty (see its generateMetadata), so it
  // must stay out of the sitemap until then  -  the two have to agree.
  if (partnerships.length > 0) staticPaths.push("/our-partnerships");

  const dynamicPaths: { path: string; lastModified?: string }[] = [
    ...services.map((s) => ({ path: `/services/${s.slug}` })),
    ...cases.map((c) => ({ path: `/cases/${c.slug}` })),
    ...insights.map((i) => ({ path: `/insights/${i.slug}`, lastModified: i.publishedAt })),
  ];

  const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    lastModified: lastModified && !Number.isNaN(Date.parse(lastModified)) ? new Date(lastModified) : DEPLOYED_AT,
    changeFrequency: "monthly" as const,
    priority,
  });

  return [
    ...staticPaths.map((p) => entry(p, p === "" ? 1 : 0.7)),
    ...dynamicPaths.map((p) => entry(p.path, 0.6, p.lastModified)),
  ];
}
