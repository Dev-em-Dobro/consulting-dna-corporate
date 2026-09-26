/**
 * BACKUP DA COPY EDITÁVEL PELAS ROTAS PÚBLICAS — 24-09.
 *
 * Lê `GET /api/<key>-copy`, que responde do Data Cache do Next e NÃO chama o
 * Blob enquanto o cache estiver quente. É a rede de segurança para o caso de o
 * `list()` do Blob estar bloqueado pela cota na hora da migração.
 *
 * ⚠️ A RESPOSTA É A COPY MESCLADA (salvo por cima do padrão do DEPLOY), não o
 * arquivo cru. Regravada, renderiza igual. "Difere do padrão" compara com o
 * padrão do código LOCAL: se o deploy for mais velho que o código, uma página
 * sem edição pode aparecer como editada. Na dúvida, guardar é de graça.
 *
 * Uso: node --experimental-strip-types scripts/backup-page-copy.ts <url-base> <rótulo>
 *   ex.: ... https://consulting-dna-corporate-preview.vercel.app staging
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_HOME_COPY } from "../lib/home-copy.ts";
import { DEFAULT_ABOUT_COPY } from "../lib/about-copy.ts";
import { DEFAULT_TEAM_COPY } from "../lib/team-copy.ts";
import { DEFAULT_SERVICES_INDEX_COPY } from "../lib/services-index-copy.ts";
import { DEFAULT_CLIENTS_COPY } from "../lib/clients-copy.ts";
import { DEFAULT_SERVICE_PAGES_COPY } from "../lib/service-pages-copy.ts";

const DEFAULTS: Record<string, unknown> = {
  home: DEFAULT_HOME_COPY,
  about: DEFAULT_ABOUT_COPY,
  team: DEFAULT_TEAM_COPY,
  "services-index": DEFAULT_SERVICES_INDEX_COPY,
  clients: DEFAULT_CLIENTS_COPY,
  "service-pages": DEFAULT_SERVICE_PAGES_COPY,
};

const [base, label] = process.argv.slice(2);
if (!base || !label) {
  console.error("uso: backup-page-copy.ts <url-base> <rótulo>");
  process.exit(1);
}

const dir = path.join("docs", "backup-page-copy-2026-09-24");
await mkdir(dir, { recursive: true });

for (const [key, defaults] of Object.entries(DEFAULTS)) {
  const url = `${base.replace(/\/$/, "")}/api/${key}-copy`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`✗ ${key}: HTTP ${res.status} em ${url}`);
    continue;
  }
  const copy = await res.json();
  const file = path.join(dir, `${label}-${key}.json`);
  await writeFile(file, JSON.stringify(copy, null, 2), "utf8");
  const edited = JSON.stringify(copy) !== JSON.stringify(defaults);
  console.log(`${edited ? "✎ DIFERE DO PADRÃO" : "= igual ao padrão"}  ${key} → ${file}`);
}
