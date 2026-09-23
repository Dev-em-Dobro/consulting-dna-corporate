/**
 * A VALIDAÇÃO da copy da Team (zod) e a mescla "salvo por cima do padrão".
 *
 * ⚠️ O `.length(6)` DOS LÍDERES NÃO É ENFEITE: a lista casa POR POSIÇÃO com
 * `leaders`, em `lib/team.ts`, que é quem traz nome, retrato e `cmsSlug`. Um
 * salvamento com tamanho diferente é reprovado aqui, e a `mergeCopy` devolve o
 * padrão inteiro em vez de publicar um card com o cargo de outra pessoa.
 *
 * ⚠️ SE ALGUÉM ACRESCENTAR UM SÉTIMO LÍDER em `lib/team.ts`, este número tem de
 * subir junto — senão o padrão (que é derivado de lá, e passa a ter sete) não
 * passa no próprio schema, e a página cai em... nada: `mergeCopy` devolveria o
 * padrão, que é o certo, mas o editor pararia de salvar em silêncio. O teste
 * "o padrão passa no próprio schema" existe para isso falhar no `npm test` e
 * não na tela dela.
 */
import { z } from "zod";
import { DEFAULT_TEAM_COPY, type TeamCopy } from "./team-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(2000);
const lines = z.array(str).min(1).max(20);

export const TeamCopySchema: z.ZodType<TeamCopy> = z.object({
  hero: z.object({
    eyebrow: str,
    title: str,
    subtitle: str,
  }),
  leadership: z.object({
    label: str,
    title: str,
    managersTitle: str,
  }),
  leaders: z.array(z.object({ role: str, region: str, quote: str })).length(6),
  oneTeam: z.object({
    label: str,
    lines: lines,
  }),
  faculty: z.object({
    label: str,
    title: str,
    intro: str,
  }),
  dna: z.object({
    label: str,
    title: str,
    strands: z.array(z.object({ title: str, body: str })).length(4),
  }),
  cta: z.object({
    strapline: str,
    line: str,
    ctaLabel: str,
  }),
});

export function mergeTeamCopy(saved: unknown): TeamCopy {
  return mergeCopy(DEFAULT_TEAM_COPY, TeamCopySchema, saved);
}
