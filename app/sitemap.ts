import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getCaseCards,
  getInsightCards,
  getRegionCards,
  getPartnerships,
} from "@/lib/cms/map";
import { services } from "@/lib/services";

export const revalidate = 3600;

// Absolute URL for a root-relative path ("" or "/" = home). Single locale, no
// locale prefix, so paths map 1:1 to the live URLs.
const abs = (path: string) => `${SITE_URL}${path || "/"}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // As páginas de serviço saíram do CMS em 11-09 (ver `lib/services.ts`), então
  // os dez slugs vêm do módulo e não de um fetch — o sitemap não pode listar a
  // taxonomia antiga enquanto as rotas publicadas são outras.
  const [cases, insights, regions, partnerships] = await Promise.all([
    getCaseCards(),
    getInsightCards(),
    getRegionCards(),
    getPartnerships(),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/approach",
    "/services",
    "/services/leadership",
    "/services/regions",
    "/our-clients",
    "/our-impact",
    "/team",
    "/cases",
    "/insights",
    "/awards",
    // Entrou em 11-09, quando Contact deixou de ser só a âncora `#contact` da
    // home. É rota indexável de verdade agora, e é a que as pessoas procuram
    // pelo nome — ficar de fora do sitemap seria esconder justamente essa.
    "/contact",
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
    // `/books` SAIU EM 21-09: os livros passaram a ser a seção `#books` da
    // /insights e a rota virou 308 permanente (next.config.mjs). Sitemap que
    // entrega URL redirecionada é sinal contraditório — o buscador é mandado
    // para um endereço que a própria resposta diz não ser o definitivo.
    // `/events` NÃO entra: nasceu vazia na mesma data, esperando conteúdo da
    // cliente, e carrega `noindex` — mesma regra de `/our-partnerships` e
    // `/interviews` logo acima.
  ];

  // Our Partnerships is a real route with no content until CDNA validates the
  // copy. It carries `noindex` while empty (see its generateMetadata), so it
  // must stay out of the sitemap until then — the two have to agree.
  if (partnerships.length > 0) staticPaths.push("/our-partnerships");

  const dynamicPaths = [
    ...services.map((s) => `/services/${s.slug}`),
    ...cases.map((c) => `/cases/${c.slug}`),
    ...insights.map((i) => `/insights/${i.slug}`),
    ...regions.map((r) => `/services/regions/${r.slug}`),
  ];

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    changeFrequency: "monthly" as const,
    priority,
  });

  return [
    ...staticPaths.map((p) => entry(p, p === "" ? 1 : 0.7)),
    ...dynamicPaths.map((p) => entry(p, 0.6)),
  ];
}
