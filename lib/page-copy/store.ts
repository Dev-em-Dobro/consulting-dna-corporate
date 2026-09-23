import "server-only";
import { del, list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";
import { mergeCopy } from "./merge.ts";

/**
 * ONDE O QUE A CLIENTE SALVA FICA GUARDADO — uma loja por PÁGINA, mesmo código.
 *
 * Na Vercel o sistema de arquivos é somente leitura, então o JSON vai para o
 * Vercel Blob (loja `cdna-home-copy`, criada em 23-09 e ligada ao projeto; o
 * `BLOB_READ_WRITE_TOKEN` chega pelo ambiente). Sem token — na máquina de quem
 * desenvolve sem `vercel env pull` — cai num arquivo local em `.data/`, que
 * está no .gitignore.
 *
 * A LOJA É UMA SÓ PARA TODAS AS PÁGINAS; o que separa é o PREFIXO do nome
 * (`home-copy/…`, `about-copy/…`). Criar uma loja por página não traria
 * isolamento nenhum que o prefixo já não dê, e dobraria o número de tokens a
 * configurar em dois projetos da Vercel.
 *
 * ⚠️ UM ARQUIVO NOVO POR SALVAMENTO, e não um arquivo sobrescrito. A primeira
 * versão (23-09, de manhã) sobrescrevia `home-copy.json` e furava o cache com
 * `?v=<uploadedAt>`; não bastou — a CDN do Blob continuou servindo a versão
 * velha por até um minuto depois de salvar, e a cliente recarregava a home e
 * via o texto antigo. Com um nome novo a cada versão (`home-copy/<ts>.json`),
 * a URL nunca esteve em cache, e a leitura é a versão que acabou de subir.
 * Quem diz qual é a mais nova é o `list()` (chamada de API, sem CDN), pela
 * ordem do nome: o timestamp vem com zeros à esquerda para ordenar como texto.
 *
 * De brinde, as últimas `KEEP` versões ficam guardadas — é um histórico
 * mínimo. As mais velhas são apagadas depois de cada gravação.
 */
const KEEP = 20;
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export type CopyStore<T> = {
  /** A copy como deve ser renderizada: o salvo por cima do padrão. */
  read: () => Promise<T>;
  /** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
  save: (input: unknown) => Promise<T>;
};

/**
 * `key` é o nome da página (`home`, `about`) e decide tanto o prefixo no Blob
 * quanto o arquivo local. ⚠️ TROCAR A CHAVE DE UMA PÁGINA JÁ NO AR ABANDONA O
 * QUE ELA SALVOU: as versões velhas continuam na loja, com o prefixo antigo, e
 * a página volta a renderizar o padrão.
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
  const prefix = `${key}-copy/`;
  const localFile = path.join(process.cwd(), ".data", `${key}-copy.json`);
  const versionName = () => `${prefix}${String(Date.now()).padStart(16, "0")}.json`;

  async function listVersions() {
    const { blobs } = await list({ prefix, limit: 1000 });
    return blobs
      .filter((b) => b.pathname.endsWith(".json"))
      .sort((a, b) => (a.pathname < b.pathname ? 1 : -1)); // mais nova primeiro
  }

  async function readSaved(): Promise<unknown> {
    try {
      if (hasBlob()) {
        const [latest] = await listVersions();
        if (!latest) return null;
        const res = await fetch(latest.url, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
      }
      return JSON.parse(await readFile(localFile, "utf8"));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return null;
      console.warn(`[${key}-copy] read failed:`, (err as Error)?.message);
      return null;
    }
  }

  return {
    async read() {
      const saved = await readSaved();
      return saved ? mergeCopy(defaults, schema, saved) : defaults;
    },
    async save(input: unknown) {
      const copy = schema.parse(input);
      const json = JSON.stringify(copy, null, 2);
      if (hasBlob()) {
        await put(versionName(), json, {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
        });
        // Poda das versões antigas. Falhar aqui não pode falhar o salvamento.
        try {
          const old = (await listVersions()).slice(KEEP);
          if (old.length) await del(old.map((b) => b.url));
        } catch (err) {
          console.warn(`[${key}-copy] prune failed:`, (err as Error)?.message);
        }
      } else {
        await mkdir(path.dirname(localFile), { recursive: true });
        await writeFile(localFile, json, "utf8");
      }
      return copy;
    },
  };
}
