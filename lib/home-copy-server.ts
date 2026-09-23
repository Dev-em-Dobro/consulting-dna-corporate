import "server-only";
import { del, list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_HOME_COPY, type HomeCopy } from "@/lib/home-copy";
import { HomeCopySchema, mergeHomeCopy } from "@/lib/home-copy-schema";

/**
 * ONDE O QUE A CLIENTE SALVA FICA GUARDADO.
 *
 * Na Vercel o sistema de arquivos é somente leitura, então o JSON vai para o
 * Vercel Blob (loja `cdna-home-copy`, criada em 23-09 e ligada ao projeto; o
 * `BLOB_READ_WRITE_TOKEN` chega pelo ambiente). Sem token — na máquina de quem
 * desenvolve sem `vercel env pull` — cai num arquivo local em `.data/`, que
 * está no .gitignore.
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
const PREFIX = "home-copy/";
const KEEP = 20;
const LOCAL_FILE = path.join(process.cwd(), ".data", "home-copy.json");
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const versionName = () => `${PREFIX}${String(Date.now()).padStart(16, "0")}.json`;

async function listVersions() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
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
    return JSON.parse(await readFile(LOCAL_FILE, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return null;
    console.warn("[home-copy] read failed:", (err as Error)?.message);
    return null;
  }
}

/** A copy da home como deve ser renderizada: o salvo por cima do padrão. */
export async function getHomeCopy(): Promise<HomeCopy> {
  const saved = await readSaved();
  return saved ? mergeHomeCopy(saved) : DEFAULT_HOME_COPY;
}

/** Valida e grava o objeto inteiro. Lança se o schema reprovar. */
export async function saveHomeCopy(input: unknown): Promise<HomeCopy> {
  const copy = HomeCopySchema.parse(input);
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
      console.warn("[home-copy] prune failed:", (err as Error)?.message);
    }
  } else {
    await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await writeFile(LOCAL_FILE, json, "utf8");
  }
  return copy;
}
