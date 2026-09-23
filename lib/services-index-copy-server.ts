import "server-only";
import { DEFAULT_SERVICES_INDEX_COPY, type ServicesIndexCopy } from "@/lib/services-index-copy";
import { ServicesIndexCopySchema } from "@/lib/services-index-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

/** A copy da listagem `/services` no Vercel Blob (prefixo `services-index/`). */
const store = createCopyStore<ServicesIndexCopy>({
  key: "services-index",
  defaults: DEFAULT_SERVICES_INDEX_COPY,
  schema: ServicesIndexCopySchema,
});

export const getServicesIndexCopy = store.read;
export const saveServicesIndexCopy = store.save;
export const servicesIndexCopyStore = store;
