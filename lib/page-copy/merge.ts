/**
 * A MESCLA "salvo por cima do padrão" — a mesma para toda página editável.
 *
 * Saiu de `lib/home-copy-schema.ts` em 23-09, quando a About passou a usar o
 * mesmo editor: a função era idêntica nas duas, mudando só de qual padrão e de
 * qual schema ela fecha por cima. Agora os dois entram por parâmetro.
 */
import type { ZodType } from "zod";

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Mescla o que foi salvo por cima dos padrões, campo a campo.
 *
 * REGRAS: objeto entra dentro de objeto; string e array SUBSTITUEM (uma lista
 * editada é a lista inteira, não um remendo); string VAZIA cai no padrão, para
 * um campo limpo por engano não apagar um título da página; chave desconhecida
 * é ignorada. Se depois de mesclar o resultado não passa no schema, volta o
 * padrão inteiro — a página nunca renderiza com copy inválida.
 *
 * ⚠️ O EFEITO COLATERAL DA REGRA DA STRING VAZIA: não há como APAGAR um texto
 * que tem padrão, só trocá-lo. Isso é de propósito na maior parte dos campos
 * (um título em branco é sempre engano), e é um limite real nos poucos campos
 * em que o vazio seria uma escolha legítima — o telefone de um escritório, por
 * exemplo. Onde isso pesa, o campo leva `hint` dizendo o que o vazio faz.
 */
export function mergeCopy<T>(defaults: T, schema: ZodType<T>, saved: unknown): T {
  const merged = deepMerge(defaults as unknown as Plain, saved);
  const parsed = schema.safeParse(merged);
  return parsed.success ? parsed.data : defaults;
}

export function deepMerge(base: Plain, over: unknown): Plain {
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
