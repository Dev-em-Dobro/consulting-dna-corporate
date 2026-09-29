import { servicePagesCopyStore } from "@/lib/service-pages-copy-server";
import { createCopyRoute } from "@/lib/page-copy/route";
import { services } from "@/lib/services";

/**
 * A API das telas `/edit-services/<serviço>`. Uma rota só para as dez: a copy
 * das dez vive num objeto só, e cada tela salva o objeto inteiro — ver a caixa
 * em `lib/service-pages-copy.ts`.
 *
 * ⚠️ REVALIDA ONZE CAMINHOS. O título e o banner de um serviço aparecem na
 * própria interna, no card da listagem e no card do "Related services" das
 * outras nove. Revalidar só a página editada deixaria os cards com o texto
 * velho até o cache expirar.
 */
export const dynamic = "force-dynamic";

export const { GET, POST } = createCopyRoute({
  key: "service-pages",
  store: servicePagesCopyStore,
  revalidate: ["/services", ...services.map((s) => `/services/${s.slug}`)],
});
