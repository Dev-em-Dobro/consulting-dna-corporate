import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";
import { mergeCopy } from "./merge.ts";
import { supabaseCopyTableFromEnv } from "./supabase.ts";

/**
 * ONDE O QUE A CLIENTE SALVA FICA GUARDADO — uma tabela para todas as páginas.
 *
 * ⚠️ SAIU DO VERCEL BLOB EM 24-09. O `list()` do Blob é uma operação avançada,
 * de cota apertada, e a cota estourou. Agora cada salvamento é uma linha nova
 * em `page_copy_versions`, no Supabase do CMS (`lib/page-copy/supabase.ts`,
 * SQL em `docs/sql/2026-09-24-page-copy-versions.sql`). A mais nova por página
 * é a publicada; as outras são o histórico, sem poda — são ~33 KB por versão.
 *
 * Sem `SUPABASE_URL`/`SUPABASE_SECRET_KEY` — na máquina de quem desenvolve —
 * cai num arquivo local em `.data/`, que está no .gitignore.
 */

/**
 * A LEITURA CONTINUA CACHEADA, por tag, e é o `POST` da rota que invalida
 * (`revalidateTag`) no instante em que a cliente salva. O banco não cobra por
 * leitura como o Blob cobrava, mas cada render ir ao Supabase seria latência à
 * toa. Este número é só o teto para o caso de uma invalidação se perder.
 */
const READ_CACHE_SECONDS = 3_600;

export type CopyStore<T> = {
  /** A copy como deve ser renderizada: o salvo por cima do padrão. */
  read: () => Promise<T>;
  /** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
  save: (input: unknown) => Promise<T>;
  /** A tag do Data Cache desta loja. Quem salva TEM de invalidá-la. */
  tag: string;
};

/**
 * `key` é o nome da página (`home`, `about`) e decide tanto o `page_key` na
 * tabela quanto o arquivo local. ⚠️ TROCAR A CHAVE DE UMA PÁGINA JÁ NO AR
 * ABANDONA O QUE ELA SALVOU, e a página volta a renderizar o padrão.
 */
export function createCopyStore<T>({
  key,
  defaults,
  schema,
}: {
  key: string;
  defaults: T;
  schema: ZodType<T>;
}): CopyStore<T> {
  const localFile = path.join(process.cwd(), ".data", `${key}-copy.json`);

  async function readSaved(): Promise<unknown> {
    const table = supabaseCopyTableFromEnv();
    if (table) return table.latest(key); // erro sobe: ver a caixa do `read` abaixo
    try {
      return JSON.parse(await readFile(localFile, "utf8"));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return null;
      throw err;
    }
  }

  const tag = `page-copy:${key}`;

  const readFresh = async (): Promise<T> => {
    const saved = await readSaved();
    return saved ? mergeCopy(defaults, schema, saved) : defaults;
  };

  /* A impressão dos padrões entra na chave do cache: trocar uma frase no
     código muda a chave e força leitura nova, em vez de o padrão velho ficar
     servido até o prazo vencer (defeito de 24-09, ver o histórico do git). */
  const shape = createHash("sha1").update(JSON.stringify(defaults)).digest("hex").slice(0, 8);

  /* "supabase" na chave: o Data Cache da Vercel sobrevive a deploy, e sem ela
     o primeiro deploy depois do Blob herdaria o padrão que o Blob bloqueado
     deixou guardado, por até um dia. Trocar a origem da leitura = trocar aqui. */
  const readCached = unstable_cache(readFresh, [tag, shape, "supabase"], {
    tags: [tag],
    revalidate: READ_CACHE_SECONDS,
  });

  /**
   * ⚠️⚠️ FALHA DE LEITURA CAI NO PADRÃO, MAS NÃO ENTRA NO CACHE — 24-09.
   *
   * Com o Blob, o erro era engolido DENTRO do `unstable_cache`: o padrão era
   * guardado como se fosse a resposta certa, por até um dia, e a edição da
   * cliente sumia do site sem nenhum aviso. Agora o erro atravessa o
   * `unstable_cache` (que não guarda o que lança) e é aqui fora que a página
   * cai no padrão — só nesta renderização. A próxima tenta o banco de novo.
   */
  const read = cache(async (): Promise<T> => {
    try {
      return await readCached();
    } catch (err) {
      console.warn(`[${key}-copy] read failed, rendering defaults:`, (err as Error)?.message);
      return defaults;
    }
  });

  return {
    tag,
    read,
    async save(input: unknown) {
      const copy = schema.parse(input);
      const table = supabaseCopyTableFromEnv();
      if (table) {
        await table.append(key, copy);
      } else {
        await mkdir(path.dirname(localFile), { recursive: true });
        await writeFile(localFile, JSON.stringify(copy, null, 2), "utf8");
      }
      return copy;
    },
  };
}
