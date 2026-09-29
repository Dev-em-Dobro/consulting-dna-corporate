import "server-only";
import { DEFAULT_HOME_COPY, type HomeCopy } from "@/lib/home-copy";
import { HomeCopySchema } from "@/lib/home-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

/**
 * A copy da home no Vercel Blob. O COMO está todo em `lib/page-copy/store.ts`:
 * um arquivo novo por versão, as últimas 20 guardadas, e um arquivo local em
 * `.data/` quando não há `BLOB_READ_WRITE_TOKEN`. Este arquivo é só a instância
 * da home  -  a chave `home` é o que decide o prefixo `home-copy/` na loja.
 *
 * ⚠️ A CHAVE NÃO PODE MUDAR: o que a cliente já salvou está sob esse prefixo.
 */
const store = createCopyStore<HomeCopy>({
  key: "home",
  defaults: DEFAULT_HOME_COPY,
  schema: HomeCopySchema,
  migrationVersion: "2026-09-29-doc-corrections",
  migrateSaved(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const copy = structuredClone(saved) as Partial<HomeCopy>;
    const caseTwo = copy.impact?.cases?.[1];
    if (caseTwo?.client === "Coca-Cola" || (caseTwo?.client === "Frasers" && caseTwo.metric === "150+")) {
      copy.impact!.cases[1] = DEFAULT_HOME_COPY.impact.cases[1];
    }
    if (copy.people) {
      const people = copy.people;
      if (people.designTitle === "Different by design") {
        people.designBody = DEFAULT_HOME_COPY.people.designBody;
      }
      if (people.pillars?.length === 3) {
        const oldHeadings = ["Personal energy and personality", "Personal energy & personality", "The DNA Experience", "Relationships that last"];
        people.pillars = people.pillars.map((pillar, index) =>
          oldHeadings.includes(pillar.title) ? DEFAULT_HOME_COPY.people.pillars[index] : pillar,
        );
      }
    }
    return copy;
  },
});

/** A copy da home como deve ser renderizada: o salvo por cima do padrão. */
export const getHomeCopy = store.read;

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export const saveHomeCopy = store.save;

export const homeCopyStore = store;
