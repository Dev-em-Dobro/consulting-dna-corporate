import "server-only";
import {
  DEFAULT_SERVICE_PAGES_COPY,
  applyServiceCopy,
  type ServicePagesCopy,
} from "@/lib/service-pages-copy";
import { ServicePagesCopySchema } from "@/lib/service-pages-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";
import { services, type Service } from "@/lib/services";

/**
 * A copy das dez internas de serviço no Vercel Blob (prefixo `service-pages/`).
 * O COMO está em `lib/page-copy/store.ts`.
 */
const store = createCopyStore<ServicePagesCopy>({
  key: "service-pages",
  defaults: DEFAULT_SERVICE_PAGES_COPY,
  schema: ServicePagesCopySchema,
});

export const getServicePagesCopy = store.read;
export const saveServicePagesCopy = store.save;
export const servicePagesCopyStore = store;

/**
 * OS DEZ SERVIÇOS COM A COPY APLICADA — a lista que as páginas devem renderizar.
 *
 * ⚠️ USE ESTA, E NÃO O `services` DE `lib/services.ts`, em qualquer lugar que
 * DESENHE texto de serviço: a dobra da interna, o card da `/services` e o card
 * do "Related services". A constante continua sendo a fonte do PADRÃO, não do
 * que está publicado.
 *
 * Uma leitura só do Blob serve as três — por isso a lista inteira, e não um
 * serviço de cada vez.
 */
export async function getServicesWithCopy(): Promise<Service[]> {
  const copy = await getServicePagesCopy();
  return services.map((s) => applyServiceCopy(s, copy.bySlug[s.slug]));
}
