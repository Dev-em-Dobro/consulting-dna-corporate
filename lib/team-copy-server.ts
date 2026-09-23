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
});

/** A copy da Team como deve ser renderizada: o salvo por cima do padrão. */
export const getTeamCopy = store.read;

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export const saveTeamCopy = store.save;

export const teamCopyStore = store;
