/** A VALIDAÇÃO da copy da listagem de serviços (zod) e a mescla. */
import { z } from "zod";
import { DEFAULT_SERVICES_INDEX_COPY, type ServicesIndexCopy } from "./services-index-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(2000);

export const ServicesIndexCopySchema: z.ZodType<ServicesIndexCopy> = z.object({
  hero: z.object({ eyebrow: str, title: str, subtitle: str }),
  whatWeDo: z.object({ label: str }),
  partners: z.object({ label: str, title: str, body: z.array(str).min(1).max(12) }),
  cta: z.object({ strapline: str, line: str, ctaLabel: str }),
});

export function mergeServicesIndexCopy(saved: unknown): ServicesIndexCopy {
  return mergeCopy(DEFAULT_SERVICES_INDEX_COPY, ServicesIndexCopySchema, saved);
}
