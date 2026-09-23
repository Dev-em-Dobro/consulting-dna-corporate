/**
 * A VALIDAÇÃO da copy das dez internas de serviço (zod) e a mescla.
 *
 * ⚠️ O SCHEMA É UNIFORME E AS LISTAS NÃO TÊM COMPRIMENTO FIXO, ao contrário dos
 * das outras páginas. Os motivos são dois, e os dois vêm do formato:
 *
 *   • A forma é a mesma para os dez serviços, mas nove deles guardam strings
 *     vazias em `audiences`, `closing`, `evidence` e `testimonial` — é o que a
 *     caixa em `lib/service-pages-copy.ts` explica. Travar comprimento aqui
 *     reprovaria o próprio padrão.
 *   • A tira de frases curtas (`pillars`) é o ÚNICO campo do site inteiro em
 *     que a cliente pode mudar quantos itens existem: ela é uma lista de linhas,
 *     e a página desenha quantas vierem. `.max(24)` é só um teto de sanidade.
 *
 * O que guarda a integridade aqui não é o comprimento, é o `applyServiceCopy()`:
 * ele nunca ressuscita um bloco que o serviço não tem, e casa audience e número
 * do case POR POSIÇÃO com o que está em `lib/services.ts`.
 */
import { z } from "zod";
import { DEFAULT_SERVICE_PAGES_COPY, type ServicePagesCopy } from "./service-pages-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(4000);
const list = z.array(str).max(24);

const ServiceCopySchema = z.object({
  title: str,
  banner: str,
  whatWeDoHeadline: str,
  whatWeDoBody: str,
  howWeWorkHeadline: str,
  howWeWorkBody: str,
  pillars: list,
  audiences: z
    .array(z.object({ label: str, title: str, body: str, credential: list }))
    .max(8),
  closing: z.object({ lead: str, accent: str }),
  evidence: z.object({
    client: str,
    title: str,
    body: str,
    facts: z.array(z.object({ value: str, label: str })).max(8),
  }),
  testimonial: z.object({ quote: str, attribution: str }),
  cta: z.object({ strapline: str, line: str, label: str }),
});

export const ServicePagesCopySchema: z.ZodType<ServicePagesCopy> = z.object({
  bySlug: z.record(z.string(), ServiceCopySchema),
});

export function mergeServicePagesCopy(saved: unknown): ServicePagesCopy {
  return mergeCopy(DEFAULT_SERVICE_PAGES_COPY, ServicePagesCopySchema, saved);
}
