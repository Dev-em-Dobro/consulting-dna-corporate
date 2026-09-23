/**
 * A VALIDAÇÃO da copy da home (zod) e a mescla "salvo por cima do padrão".
 *
 * SEPARADO DE `home-copy.ts` de propósito: aquele arquivo é importado pelo
 * `HeroV2`, que é componente de cliente, e trazer o zod para dentro do bundle
 * da home só para declarar um tipo seria peso sem função. Quem precisa validar
 * (a rota da API e o leitor do servidor) importa daqui; os testes também.
 */
import { z } from "zod";
import { DEFAULT_HOME_COPY, type HomeCopy } from "./home-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(2000);
const lines = z.array(str).min(1).max(20);

export const HomeCopySchema: z.ZodType<HomeCopy> = z.object({
  hero: z.object({
    title: str,
    subtitle: str,
    primaryCta: str,
    secondaryCta: str,
  }),
  solve: z.object({
    label: str,
    title: str,
    subtitle: str,
    purposeTitle: str,
    purposeAccent: str,
    reals: lines,
  }),
  credibility: z.object({
    label: str,
    statLabels: z.array(str).length(4),
  }),
  impact: z.object({
    label: str,
    title: str,
    challengeLabel: str,
    readMore: str,
    cases: z
      .array(
        z.object({
          client: str,
          sector: str,
          challenge: str,
          metric: str,
          metricLabel: str,
        }),
      )
      .length(3),
  }),
  people: z.object({
    label: str,
    title: str,
    subtitle: str,
    intro: str,
    pillars: z.array(z.object({ title: str, body: str })).length(3),
    partnersLabel: str,
  }),
  book: z.object({
    kicker: str,
    headline: str,
    body: lines,
  }),
  contact: z.object({
    title: str,
    subtitle: str,
  }),
});

/**
 * A MESCLA saiu daqui em 23-09 para `lib/page-copy/merge.ts`, palavra por
 * palavra: a About usa a mesma, mudando só o padrão e o schema que ela fecha
 * por cima. A função abaixo é o que sobrou — os dois argumentos da home.
 */
export function mergeHomeCopy(saved: unknown): HomeCopy {
  return mergeCopy(DEFAULT_HOME_COPY, HomeCopySchema, saved);
}
