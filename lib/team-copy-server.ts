import { publishedFacultyMinimum } from "./faculty-figure.ts";
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
  migrationVersion: "2026-11-24-faculty-audit",
  migrateSaved(saved) {
    if (!saved || typeof saved !== "object") return saved;
    const copy = structuredClone(saved) as Partial<TeamCopy>;
    const legacyRegions: Record<string, string> = { UAE: "Middle East & North Africa", UK: "UK & Europe", Asia: "Asia Pacific", Australia: "Asia Pacific" };
    for (const leader of Array.isArray(copy.leaders) ? copy.leaders : []) {
      if (leader && Object.hasOwn(legacyRegions, leader.region)) leader.region = legacyRegions[leader.region];
    }
    for (const strand of Array.isArray(copy.dna?.strands) ? copy.dna.strands : []) {
      if (typeof strand?.body === "string") strand.body = strand.body.replace("global pool of 75 members", "global faculty");
    }
    if (typeof copy.hero?.subtitle === "string") copy.hero.subtitle = copy.hero.subtitle.replace(/faculty of (60\+|75) practitioners/, `faculty of ${publishedFacultyMinimum} practitioners`);
    if (typeof copy.faculty?.title === "string") copy.faculty.title = copy.faculty.title.replace(/faculty of (60\+|75) senior practitioners/i, `faculty of ${publishedFacultyMinimum} senior practitioners`);
    if ((saved as Record<string, unknown>).__copyRevision === "2026-09-29-doc-corrections") return copy;
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
