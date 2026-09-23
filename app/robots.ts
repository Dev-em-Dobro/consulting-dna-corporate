import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots policy (005 FR-305/FR-307): allow everything (incl. reputable AI
 * crawlers, for GEO) except the staging/utility routes, and point at the
 * sitemap. Excluded: /v1 (legacy) and /preview/* (draft preview).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // As telas de edição de texto (23-09) entram aqui pelo mesmo motivo de
        // `/preview/`: são rotas de trabalho, `noindex` e fora do sitemap. Isso
        // é higiene, não proteção — elas não têm login.
        //
        // `/edit` sozinho já bastaria: a regra do robots.txt casa por PREFIXO,
        // então ela cobre todas as `/edit-*`, inclusive as dez telas em
        // `/edit-services/<serviço>`. As outras ficam escritas mesmo assim,
        // para quem lê o arquivo ver o que existe.
        disallow: [
          "/v1",
          "/preview/",
          "/edit",
          "/edit-home",
          "/edit-about",
          "/edit-team",
          "/edit-services",
          "/edit-clients",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
