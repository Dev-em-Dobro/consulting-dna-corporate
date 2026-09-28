import { DEFAULT_IMPACT_COPY } from './impact-copy.ts';
import { schemaForCopy } from './page-copy/structured-schema.ts';
import { mergeCopy } from './page-copy/merge.ts';

export const ImpactCopySchema = schemaForCopy(DEFAULT_IMPACT_COPY);
export function mergeImpactCopy(saved: unknown) {
  return mergeCopy(DEFAULT_IMPACT_COPY, ImpactCopySchema, saved, true);
}
