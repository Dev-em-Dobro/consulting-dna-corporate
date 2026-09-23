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

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Mescla o que foi salvo por cima dos padrões, campo a campo.
 *
 * REGRAS: objeto entra dentro de objeto; string e array SUBSTITUEM (uma lista
 * editada é a lista inteira, não um remendo); string VAZIA cai no padrão, para
 * um campo limpo por engano não apagar um título da home; chave desconhecida é
 * ignorada. Se depois de mesclar o resultado não passa no schema, volta o
 * padrão inteiro — a home nunca renderiza com copy inválida.
 */
export function mergeHomeCopy(saved: unknown): HomeCopy {
  const merged = deepMerge(DEFAULT_HOME_COPY as unknown as Plain, saved);
  const parsed = HomeCopySchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_HOME_COPY;
}

function deepMerge(base: Plain, over: unknown): Plain {
  if (!isPlain(over)) return base;
  const out: Plain = { ...base };
  for (const key of Object.keys(base)) {
    const b = base[key];
    const o = over[key];
    if (o === undefined || o === null) continue;
    if (isPlain(b)) {
      out[key] = deepMerge(b, o);
    } else if (Array.isArray(b)) {
      if (Array.isArray(o)) out[key] = o;
    } else if (typeof b === "string") {
      if (typeof o === "string" && o.trim() !== "") out[key] = o;
    }
  }
  return out;
}
