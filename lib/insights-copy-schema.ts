import { DEFAULT_INSIGHTS_COPY } from './insights-copy.ts';
import { schemaForCopy } from './page-copy/structured-schema.ts';
import { mergeCopy } from './page-copy/merge.ts';

export const InsightsCopySchema = schemaForCopy(DEFAULT_INSIGHTS_COPY);
export function mergeInsightsCopy(saved: unknown) {
  return mergeCopy(DEFAULT_INSIGHTS_COPY, InsightsCopySchema, saved, true);
}
