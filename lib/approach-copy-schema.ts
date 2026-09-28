import { DEFAULT_APPROACH_COPY } from './approach-copy.ts';
import { schemaForCopy } from './page-copy/structured-schema.ts';
import { mergeCopy } from './page-copy/merge.ts';

export const ApproachCopySchema = schemaForCopy(DEFAULT_APPROACH_COPY, [
  "games.inner.labels", "games.outer.labels", "games.assessmentLabels",
]);
export function mergeApproachCopy(saved: unknown) {
  return mergeCopy(DEFAULT_APPROACH_COPY, ApproachCopySchema, saved, true);
}
