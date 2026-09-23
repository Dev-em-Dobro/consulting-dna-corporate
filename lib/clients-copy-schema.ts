/**
 * A VALIDAÇÃO da copy da Clients & Impact (zod) e a mescla.
 *
 * ⚠️ `statLabels` TRAVADO EM TRÊS: a fileira do footprint casa rótulo com
 * contagem POR POSIÇÃO (regiões, clientes, cases publicados), e as contagens
 * são calculadas na página. Um salvamento com outro tamanho publicaria um
 * rótulo ao lado do número errado.
 */
import { z } from "zod";
import { DEFAULT_CLIENTS_COPY, type ClientsCopy } from "./clients-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(2000);

export const ClientsCopySchema: z.ZodType<ClientsCopy> = z.object({
  hero: z.object({ eyebrow: str, title: str, subtitle: str }),
  logos: z.object({ label: str }),
  numbers: z.object({ label: str, kicker: str, rowLabel: str }),
  cases: z.object({ label: str, kicker: str, empty: str }),
  voices: z.object({ label: str, kicker: str }),
  social: z.object({ title: str, body: str, ctaLabel: str }),
  footprint: z.object({ label: str, kicker: str, statLabels: z.array(str).length(3) }),
  cta: z.object({ strapline: str, line: str, ctaLabel: str }),
});

export function mergeClientsCopy(saved: unknown): ClientsCopy {
  return mergeCopy(DEFAULT_CLIENTS_COPY, ClientsCopySchema, saved);
}
