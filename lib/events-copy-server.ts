import "server-only";
import { DEFAULT_EVENTS_COPY } from "@/lib/events-copy";
import { EventsCopySchema } from "@/lib/events-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

export const eventsCopyStore = createCopyStore({
  key: "events",
  defaults: DEFAULT_EVENTS_COPY,
  schema: EventsCopySchema,
  mergeArrayObjects: true,
});
export const getEventsCopy = eventsCopyStore.read;
