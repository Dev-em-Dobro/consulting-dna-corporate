/**
 * A VALIDAÇÃO da copy da About (zod) e a mescla "salvo por cima do padrão".
 *
 * SEPARADO DE `about-copy.ts` pelo mesmo motivo do par da home: aquele arquivo
 * é o conteúdo, sem dependência nenhuma, e é ele que os testes do Node carregam
 * direto. Quem precisa validar (a rota da API e o leitor do servidor) importa
 * daqui.
 *
 * ⚠️ OS COMPRIMENTOS FIXOS (`.length(4)`, `.length(5)`) NÃO SÃO ENFEITE: a
 * página casa ícone com item POR POSIÇÃO — quatro `StatIcon`, cinco
 * `ValueIcon` — e a Clients & Impact desenha quatro colunas. Um salvamento com
 * lista de tamanho diferente é reprovado aqui, e a `mergeCopy` devolve o padrão
 * inteiro em vez de publicar uma página com ícone sem valor ao lado.
 */
import { z } from "zod";
import { DEFAULT_ABOUT_COPY, type AboutCopy } from "./about-copy.ts";
import { mergeCopy } from "./page-copy/merge.ts";

const str = z.string().max(2000);
const lines = z.array(str).min(1).max(20);

export const AboutCopySchema: z.ZodType<AboutCopy> = z.object({
  hero: z.object({
    label: str,
    title: str,
    subtitleLines: lines,
  }),
  stats: z.array(z.object({ value: str, label: str })).length(4),
  purpose: z.object({
    label: str,
    title: str,
    titleNowrap: str,
    quote: str,
    attribution: str,
    body: lines,
  }),
  promise: z.object({
    label: str,
    lead: str,
    accent: str,
    body: lines,
  }),
  identity: z.object({
    label: str,
    quote: lines,
    pillars: z.array(z.object({ heading: str, body: str })).length(4),
  }),
  values: z.object({
    label: str,
    intro: str,
    items: z.array(z.object({ name: str, body: str })).length(5),
  }),
  regions: z.object({
    label: str,
    intro: str,
    items: z.array(z.object({ name: str, offices: str, descriptor: str })).length(4),
  }),
  /* `tel` aceita string vazia — é assim que Riyadh e Miami dizem "sem telefone
     publicado". Os outros campos também aceitam, mas ali o vazio é engano; a
     diferença é que dentro de uma LISTA o vazio persiste (a mescla substitui a
     lista inteira em vez de entrar campo a campo), e fora dela cai no padrão. */
  offices: z
    .array(z.object({ city: str, address: lines, tel: str, email: str }))
    .length(5),
  people: z.object({
    label: str,
    title: str,
    body: str,
    cta: str,
  }),
});

export function mergeAboutCopy(saved: unknown): AboutCopy {
  return mergeCopy(DEFAULT_ABOUT_COPY, AboutCopySchema, saved);
}
