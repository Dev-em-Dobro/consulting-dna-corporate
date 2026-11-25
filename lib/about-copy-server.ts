import { publishedFacultyMinimum } from "./faculty-figure.ts";
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
  migrationVersion: "2026-11-25-long-standing",
  migrateSaved(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const copy = structuredClone(saved) as Partial<AboutCopy>;
    // 25-11 (layout audit #62): "long-standing" takes the hyphen. Every change in
    // this function only replaces exact old text, so re-running them is harmless.
    for (const stat of copy.stats ?? []) {
      if (stat?.label === "FTSE 100 companies are long standing clients") stat.label = "FTSE 100 companies are long-standing clients";
    }
    if (typeof copy.regions?.intro === "string") {
      copy.regions.intro = copy.regions.intro.replace("faculty of 60+ senior practitioners", `faculty of ${publishedFacultyMinimum} senior practitioners`);
    }
    const singapore = Array.isArray(copy.offices) && copy.offices.find(office => office.city === "Singapore");
    if (singapore && singapore.address?.join(" ") === "1 Raffles Place, Level 24 Tower 1, Singapore 048616") {
      singapore.address = DEFAULT_ABOUT_COPY.offices.find(office => office.city === "Singapore")!.address;
    }
    return copy;
  },
});

/** A copy da About como deve ser renderizada: o salvo por cima do padrão. */
export const getAboutCopy = store.read;

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export const saveAboutCopy = store.save;

export const aboutCopyStore = store;
