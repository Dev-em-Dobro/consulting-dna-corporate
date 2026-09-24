/**
 * MIGRAÇÃO DOS TEXTOS DO /edit PARA O SUPABASE — 24-09.
 *
 * Duas fontes, na ordem de preferência:
 *   --from-blob            todas as versões guardadas no Blob (até 20 por
 *                          página), com a data original tirada do nome do
 *                          arquivo. Precisa de BLOB_READ_WRITE_TOKEN e de a
 *                          cota do Blob permitir `list()`.
 *   --from-backup <rótulo> os arquivos da Task 0
 *                          (`docs/backup-page-copy-2026-09-24/<rótulo>-<key>.json`),
 *                          só as páginas que diferem do padrão. Uma versão por
 *                          página, sem histórico.
 *
 * ⚠️ NÃO DUPLICA: página que já tem linha na tabela é pulada, a não ser com
 * --force. Rodar duas vezes é seguro.
 *
 * Uso: node --env-file=.env.local --experimental-strip-types \
 *        scripts/migrate-page-copy-to-supabase.ts --from-blob [--dry-run]
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { list } from "@vercel/blob";
import { createSupabaseCopyTable } from "../lib/page-copy/supabase.ts";
import { DEFAULT_HOME_COPY } from "../lib/home-copy.ts";
import { DEFAULT_ABOUT_COPY } from "../lib/about-copy.ts";
import { DEFAULT_TEAM_COPY } from "../lib/team-copy.ts";
import { DEFAULT_SERVICES_INDEX_COPY } from "../lib/services-index-copy.ts";
import { DEFAULT_CLIENTS_COPY } from "../lib/clients-copy.ts";
import { DEFAULT_SERVICE_PAGES_COPY } from "../lib/service-pages-copy.ts";

/* ⚠️ Backup igual ao padrão NÃO é migrado: gravar o padrão na tabela o
   congelaria por cima de qualquer frase que mudar no código depois. */
const DEFAULTS: Record<string, unknown> = {
  home: DEFAULT_HOME_COPY,
  about: DEFAULT_ABOUT_COPY,
  team: DEFAULT_TEAM_COPY,
  "services-index": DEFAULT_SERVICES_INDEX_COPY,
  clients: DEFAULT_CLIENTS_COPY,
  "service-pages": DEFAULT_SERVICE_PAGES_COPY,
};
const KEYS = Object.keys(DEFAULTS);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const fromBlob = args.includes("--from-blob");
const backupLabel = args.includes("--from-backup") ? args[args.indexOf("--from-backup") + 1] : null;

if (!fromBlob && !backupLabel) {
  console.error("uso: --from-blob | --from-backup <rótulo>  [--dry-run] [--force]");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("faltam SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente");
  process.exit(1);
}
const table = createSupabaseCopyTable({ url, secretKey });

type Version = { createdAt?: string; copy: unknown; source: string };

async function versionsFromBlob(key: string): Promise<Version[]> {
  const { blobs } = await list({ prefix: `${key}-copy/`, limit: 1000 });
  const files = blobs
    .filter((b) => b.pathname.endsWith(".json"))
    .sort((a, b) => (a.pathname < b.pathname ? -1 : 1)); // mais velha primeiro
  const out: Version[] = [];
  for (const b of files) {
    const ts = Number(path.basename(b.pathname, ".json"));
    const res = await fetch(b.url);
    if (!res.ok) throw new Error(`${b.pathname}: HTTP ${res.status}`);
    out.push({ createdAt: new Date(ts).toISOString(), copy: await res.json(), source: "blob-migration" });
  }
  return out;
}

async function versionsFromBackup(key: string, label: string): Promise<Version[]> {
  const file = path.join("docs", "backup-page-copy-2026-09-24", `${label}-${key}.json`);
  let copy: unknown;
  try {
    copy = JSON.parse(await readFile(file, "utf8"));
  } catch {
    return [];
  }
  if (JSON.stringify(copy) === JSON.stringify(DEFAULTS[key])) return [];
  return [{ copy, source: `backup-${label}-2026-09-24` }];
}

for (const key of KEYS) {
  if (!force && (await table.latest(key)) !== null) {
    console.log(`↷ ${key}: já tem linha na tabela, pulando`);
    continue;
  }
  const versions = fromBlob ? await versionsFromBlob(key) : await versionsFromBackup(key, backupLabel!);
  if (!versions.length) {
    console.log(`· ${key}: nada salvo`);
    continue;
  }
  for (const v of versions) {
    if (!dryRun) await table.append(key, v.copy, { createdAt: v.createdAt, source: v.source });
  }
  console.log(`${dryRun ? "(dry-run) " : ""}✓ ${key}: ${versions.length} versão(ões)`);
}
