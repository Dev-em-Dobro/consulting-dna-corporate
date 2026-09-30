import "server-only";
import { DEFAULT_TEAM_COPY, type TeamCopy } from "@/lib/team-copy";
import { TeamCopySchema } from "@/lib/team-copy-schema";
import { createCopyStore } from "@/lib/page-copy/store";

/**
 * A copy da Team no Vercel Blob (prefixo `team-copy/`, mesma loja das outras).
 * O COMO está em `lib/page-copy/store.ts`.
 */
const store = createCopyStore<TeamCopy>({
  key: "team",
  defaults: DEFAULT_TEAM_COPY,
  schema: TeamCopySchema,
  migrationVersion: "2026-09-29-doc-corrections",
  migrateSaved(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const copy = structuredClone(saved) as Partial<TeamCopy>;
    if (copy.hero?.title?.trim() === "We bring experience from both sides of the table.") {
      copy.hero.title = "We bring experience from both sides of the table";
    }
    if (copy.leadership?.label === "Leadership") copy.leadership.label = "Leadership Team";
    const legacyManagersText = copy.leadership?.managersTitle;
    if (copy.leadership && typeof legacyManagersText === "string" && legacyManagersText.includes("The team that carries every project from promise to impact.")) {
      copy.leadership.managersIntro = legacyManagersText.replace(/^PMO\s+/, "").trim();
      copy.leadership.managersTitle = DEFAULT_TEAM_COPY.leadership.managersTitle;
    }
    return copy;
  },
});

/** A copy da Team como deve ser renderizada: o salvo por cima do padrão. */
export const getTeamCopy = store.read;

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export const saveTeamCopy = store.save;

export const teamCopyStore = store;
