import "server-only";
import {
  DEFAULT_SERVICE_PAGES_COPY,
  applyServiceCopy,
  type ServicePagesCopy,
} from "@/lib/service-pages-copy";
import { ServicePagesCopySchema } from "@/lib/service-pages-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";
import { services, type Service } from "@/lib/services";

/* Os textos ANTIGOS da High Performing Teams, que a copy salva pode ter
   congelado antes do layout de 01-10 (o editor grava o objeto inteiro). Só são
   trocados se ainda forem EXATAMENTE estes: edição da cliente não é tocada. */
const HPT_OLD_WHAT_WE_DO =
  "Better **decision quality, execution speed, collective accountability and cross-functional effectiveness**. Less organisational friction. More leadership capacity directed at the priorities that matter most.";
const HPT_OLD_HOW_WE_WORK =
  "We work with real teams on their real work, strengthening **trust, constructive challenge, decision rights, accountability, alignment and execution**. Rather than generic team building, we identify what is helping and hindering collective performance and embed new ways of working.";

/**
 * A copy das dez internas de serviço no Vercel Blob (prefixo `service-pages/`).
 * O COMO está em `lib/page-copy/store.ts`.
 */
const store = createCopyStore<ServicePagesCopy>({
  key: "service-pages",
  defaults: DEFAULT_SERVICE_PAGES_COPY,
  schema: ServicePagesCopySchema,
  migrationVersion: "2026-10-01-call-corrections-services-2",
  migrateSaved(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const copy = structuredClone(saved) as Partial<ServicePagesCopy>;
    // 01-10: Shell é 8.000 mulheres ("not 6k"), no cartão de evidência de Women in Leadership.
    const items = (copy.bySlug?.["women-in-leadership"]?.layout as
      { evidenceCases?: { items?: { facts?: { value?: string }[] }[] } } | undefined)?.evidenceCases?.items;
    for (const fact of items?.[0]?.facts ?? []) {
      if (fact && ["6,000", "6,300", "6k"].includes(fact.value?.trim() ?? "")) fact.value = "8,000";
    }
    // 01-10: "Women’s Leadership Development" volta a ser "Women in Leadership" (cabe em uma linha).
    const wil = copy.bySlug?.["women-in-leadership"];
    if (wil && /^Women[’']s Leadership Development$/i.test(wil.title?.trim() ?? "")) {
      wil.title = DEFAULT_SERVICE_PAGES_COPY.bySlug["women-in-leadership"].title;
    }
    // 01-10: High Performing Teams refeita pelo layout da call; textos antigos e intocados dão lugar aos novos.
    const hpt = copy.bySlug?.["high-performing-teams"];
    const hptDefault = DEFAULT_SERVICE_PAGES_COPY.bySlug["high-performing-teams"];
    if (hpt && hptDefault) {
      if (!hpt.whatWeDoHeadline?.trim()) hpt.whatWeDoHeadline = hptDefault.whatWeDoHeadline;
      if (!hpt.howWeWorkHeadline?.trim()) hpt.howWeWorkHeadline = hptDefault.howWeWorkHeadline;
      if (hpt.whatWeDoBody === HPT_OLD_WHAT_WE_DO) hpt.whatWeDoBody = hptDefault.whatWeDoBody;
      if (hpt.howWeWorkBody === HPT_OLD_HOW_WE_WORK) hpt.howWeWorkBody = hptDefault.howWeWorkBody;
      // A faixa Evidence (Frasers + Heineken) não existia antes: a copy salva congelou as medidas vazias.
      if (hpt.evidenceSummary && !hpt.evidenceSummary.facts?.some((f) => f.value?.trim())) {
        hpt.evidenceSummary.facts = structuredClone(hptDefault.evidenceSummary.facts);
      }
    }
    return copy;
  },
});

export const getServicePagesCopy = store.read;
export const saveServicePagesCopy = store.save;
export const servicePagesCopyStore = store;

/**
 * OS DEZ SERVIÇOS COM A COPY APLICADA  -  a lista que as páginas devem renderizar.
 *
 * ⚠️ USE ESTA, E NÃO O `services` DE `lib/services.ts`, em qualquer lugar que
 * DESENHE texto de serviço: a dobra da interna, o card da `/services` e o card
 * do "Related services". A constante continua sendo a fonte do PADRÃO, não do
 * que está publicado.
 *
 * Uma leitura só do Blob serve as três  -  por isso a lista inteira, e não um
 * serviço de cada vez.
 */
export async function getServicesWithCopy(): Promise<Service[]> {
  const copy = await getServicePagesCopy();
  return services.map((s) => applyServiceCopy(s, copy.bySlug[s.slug]));
}
