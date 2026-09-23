import "server-only";
import { DEFAULT_ABOUT_COPY, type AboutCopy } from "@/lib/about-copy";
import { AboutCopySchema } from "@/lib/about-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

/**
 * A copy da About no Vercel Blob (prefixo `about-copy/`, mesma loja da home).
 * O COMO está em `lib/page-copy/store.ts`.
 *
 * ⚠️ LIDO POR DUAS PÁGINAS. A `/about` usa tudo; a `/our-clients` usa os quatro
 * números, por `getFirmStats()` em `lib/stats.ts`. Quem salva é só `/edit-about`,
 * e a rota revalida as duas.
 */
const store = createCopyStore<AboutCopy>({
  key: "about",
  defaults: DEFAULT_ABOUT_COPY,
  schema: AboutCopySchema,
});

/** A copy da About como deve ser renderizada: o salvo por cima do padrão. */
export const getAboutCopy = store.read;

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export const saveAboutCopy = store.save;

export const aboutCopyStore = store;
