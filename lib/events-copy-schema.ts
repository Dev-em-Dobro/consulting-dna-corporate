import { DEFAULT_EVENTS_COPY } from "./events-copy.ts";
import { schemaForCopy } from "./page-copy/structured-schema.ts";
import { mergeCopy } from "./page-copy/merge.ts";

export const EventsCopySchema = schemaForCopy(DEFAULT_EVENTS_COPY);
export function mergeEventsCopy(saved: unknown) {
  return mergeCopy(DEFAULT_EVENTS_COPY, EventsCopySchema, saved, true);
}
