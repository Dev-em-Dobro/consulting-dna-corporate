import "server-only";
import { DEFAULT_CLIENTS_COPY, type ClientsCopy } from "@/lib/clients-copy";
import { ClientsCopySchema } from "@/lib/clients-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

/** A copy da `/our-clients` no Vercel Blob (prefixo `clients-copy/`). */
const store = createCopyStore<ClientsCopy>({
  key: "clients",
  defaults: DEFAULT_CLIENTS_COPY,
  schema: ClientsCopySchema,
});

export const getClientsCopy = store.read;
export const saveClientsCopy = store.save;
export const clientsCopyStore = store;
