# Textos do /edit: do Vercel Blob para o Supabase — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tirar o armazenamento dos textos editáveis (/edit) do Vercel Blob, que estourou a cota de operações, e passar para uma tabela no Supabase do CMS, sem perder nenhuma edição já salva.

**Architecture:** Toda leitura e gravação passa por `createCopyStore` em `lib/page-copy/store.ts`; só o miolo dele muda. Um cliente pequeno da API REST do Supabase (`lib/page-copy/supabase.ts`, sem dependência nova, testável com `fetch` falso) grava cada salvamento como uma linha nova em `page_copy_versions` e lê a mais recente por página. O cache por tag (`unstable_cache` + `revalidateTag`) continua igual. Os dados atuais saem do Blob por um script de migração; antes de tudo, um backup pelas rotas `GET /api/<key>-copy`, que respondem do cache e não gastam operação do Blob.

**Tech Stack:** Next.js 16 (App Router), Supabase (PostgREST via `fetch`), zod, `node --test` com `--experimental-strip-types`.

---

## Contexto que quem executa precisa saber

- **Seis páginas editáveis, seis chaves:** `home`, `about`, `team`, `services-index`, `clients`, `service-pages`. Cada uma tem um `lib/<key>-copy-server.ts` que chama `createCopyStore({ key, defaults, schema })` e uma rota `app/api/<key>-copy/route.ts` (`GET` devolve a copy mesclada; `POST` salva).
- **Hoje:** cada salvamento vira `<key>-copy/<timestamp de 16 dígitos>.json` no Blob (loja `cdna-home-copy`), e a leitura faz `list()`, que é a operação cara que estourou a cota.
- **Só o STAGING (`consulting-dna-corporate-preview`) tinha `BLOB_READ_WRITE_TOKEN`** (anotação de 23-09). A produção nunca leu o Blob, então todo dado salvo está numa loja só. Confirmar no painel antes da Task 5.
- **A produção publica sozinha a cada merge na `main`. O staging é deploy manual pela CLI.** Deploy só quando o usuário pedir.
- **O Supabase é o banco do CMS** (plano gratuito, sem backup automático). A tabela nova fica no schema `public` com RLS ligado e **sem policy**: só a secret key, que ignora RLS, lê e grava. A publishable key não enxerga nada.
- **Staging e produção vão ler a MESMA tabela**, o que era o desenho do Blob (uma loja só). O efeito: o que a cliente salvar no staging aparece na produção quando o cache dela vencer (até 1h, ver `READ_CACHE_SECONDS`). Se isso não for desejado, é decisão a tomar antes da Task 7.
- Testes: `npm test` (roda `tests/*.test.ts`). Arquivos importados pelos testes não podem usar o alias `@/` nem importar `server-only`/`next/*`; imports relativos levam a extensão `.ts`.

## Mapa de arquivos

| Arquivo | O que é |
|---|---|
| `docs/sql/2026-09-24-page-copy-versions.sql` (novo) | Cria a tabela, o índice e liga o RLS. |
| `lib/page-copy/supabase.ts` (novo) | Cliente REST: `latest(key)` e `append(key, copy, opts)`. Sem `server-only`, para ser testável. |
| `tests/page-copy-supabase.test.ts` (novo) | Testes do cliente com `fetch` falso. |
| `lib/page-copy/store.ts` (reescrito) | Troca o Blob pelo Supabase; falha de leitura deixa de ser cacheada. |
| `scripts/backup-page-copy.ts` (novo) | Baixa a copy atual pelas rotas `GET` e marca o que difere do padrão. |
| `scripts/migrate-page-copy-to-supabase.ts` (novo) | Copia as versões do Blob (ou do backup) para a tabela. |
| `docs/edit-paginas.md` | Atualiza a linha "Armazenamento" e a seção do token. |
| `package.json` | Remove `@vercel/blob` na limpeza (Task 8). |

---

### Task 0: Backup imediato do que está salvo (URGENTE, antes de qualquer código)

O cache de leitura dura até 24h. Quando ele vencer com o Blob bloqueado, a página cai no texto do código e o backup por esta via deixa de funcionar. Esta task não depende de nenhuma outra.

**Files:**
- Create: `scripts/backup-page-copy.ts`

- [x] **Step 1: Escrever o script**

```ts
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
```

- [x] **Step 2: Rodar contra o staging e a produção**

```bash
node --experimental-strip-types scripts/backup-page-copy.ts https://consulting-dna-corporate-preview.vercel.app staging
node --experimental-strip-types scripts/backup-page-copy.ts https://consulting-dna-corporate-alpha.vercel.app prod
```

Esperado: seis linhas por ambiente, uma por chave, e 12 arquivos em `docs/backup-page-copy-2026-09-24/`. No staging, `home` deve sair `✎ DIFERE DO PADRÃO` (foi editada). Se o staging responder 401/403, é a Deployment Protection da Vercel: rodar com a URL de bypass ou baixar as seis URLs no navegador logado e salvar com o mesmo nome.

- [x] **Step 3: Conferir um arquivo a olho**

Abrir `docs/backup-page-copy-2026-09-24/staging-home.json` e confirmar que tem um texto que a cliente editou (por exemplo, `hero.title`).

- [x] **Step 4: Commit**

```bash
git add scripts/backup-page-copy.ts docs/backup-page-copy-2026-09-24
git commit -m "chore(page-copy): backup da copy editável antes de sair do Blob"
```

---

### Task 1: Tabela no Supabase

**Files:**
- Create: `docs/sql/2026-09-24-page-copy-versions.sql`

- [x] **Step 1: Escrever o SQL**

```sql
-- TEXTOS DO /edit — uma linha por salvamento, 24-09.
-- A mais nova por `page_key` é a publicada; as outras são o histórico.
create table if not exists public.page_copy_versions (
  id bigint generated always as identity primary key,
  page_key text not null,
  copy jsonb not null,
  source text not null default 'editor',
  created_at timestamptz not null default now()
);

create index if not exists page_copy_versions_latest
  on public.page_copy_versions (page_key, created_at desc, id desc);

-- RLS ligado e SEM policy: só a secret key (que ignora RLS) lê e grava.
-- A publishable key, que é pública, não enxerga esta tabela.
alter table public.page_copy_versions enable row level security;
```

- [ ] **Step 2: Rodar no SQL Editor do projeto Supabase do CMS**

Quem tem acesso ao painel do Supabase cola o arquivo no SQL Editor e executa. Esperado: "Success. No rows returned".

- [ ] **Step 3: Conferir que a publishable key não lê nada**

```bash
curl -s "$SUPABASE_URL/rest/v1/page_copy_versions?select=id" -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
```

Esperado: `[]` (RLS filtrando tudo), e nunca um erro de "relation does not exist".

- [ ] **Step 4: Conferir que a secret key lê**

```bash
curl -s "$SUPABASE_URL/rest/v1/page_copy_versions?select=id" -H "apikey: $SUPABASE_SECRET_KEY"
```

Esperado: `[]` com HTTP 200. Se voltar 401, a chave é do formato antigo (JWT `service_role`): acrescentar `-H "Authorization: Bearer $SUPABASE_SECRET_KEY"` e anotar isso para a Task 2, Step 3.

- [x] **Step 5: Commit**

```bash
git add docs/sql/2026-09-24-page-copy-versions.sql
git commit -m "chore(db): tabela page_copy_versions para os textos do /edit"
```

---

### Task 2: Cliente REST do Supabase (TDD)

**Files:**
- Create: `lib/page-copy/supabase.ts`
- Test: `tests/page-copy-supabase.test.ts`

- [x] **Step 1: Escrever os testes que falham**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { createSupabaseCopyTable } from "../lib/page-copy/supabase.ts";

type Call = { url: string; init: RequestInit };

function fakeFetch(respond: (call: Call) => Response) {
  const calls: Call[] = [];
  const f = (async (url: string, init: RequestInit = {}) => {
    const call = { url: String(url), init };
    calls.push(call);
    return respond(call);
  }) as typeof fetch;
  return { f, calls };
}

const cfg = { url: "https://x.supabase.co/", secretKey: "sb_secret_abc" };

test("latest pede só a versão mais nova daquela página, com a secret key", async () => {
  const { f, calls } = fakeFetch(() => Response.json([{ copy: { hero: { title: "Oi" } } }]));
  const table = createSupabaseCopyTable({ ...cfg, fetch: f });

  const copy = await table.latest("home");

  assert.deepEqual(copy, { hero: { title: "Oi" } });
  const u = new URL(calls[0].url);
  assert.equal(u.origin + u.pathname, "https://x.supabase.co/rest/v1/page_copy_versions");
  assert.equal(u.searchParams.get("page_key"), "eq.home");
  assert.equal(u.searchParams.get("order"), "created_at.desc,id.desc");
  assert.equal(u.searchParams.get("limit"), "1");
  assert.equal((calls[0].init.headers as Record<string, string>).apikey, "sb_secret_abc");
});

test("latest devolve null quando a página nunca foi salva", async () => {
  const { f } = fakeFetch(() => Response.json([]));
  assert.equal(await createSupabaseCopyTable({ ...cfg, fetch: f }).latest("team"), null);
});

test("latest lança quando o Supabase responde erro — erro não pode virar 'nada salvo'", async () => {
  const { f } = fakeFetch(() => new Response("boom", { status: 500 }));
  await assert.rejects(createSupabaseCopyTable({ ...cfg, fetch: f }).latest("home"), /500/);
});

test("append grava uma linha nova com a página, a copy e a origem", async () => {
  const { f, calls } = fakeFetch(() => new Response(null, { status: 201 }));
  await createSupabaseCopyTable({ ...cfg, fetch: f }).append("about", { a: 1 });

  assert.equal(calls[0].init.method, "POST");
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
    page_key: "about",
    copy: { a: 1 },
    source: "editor",
  });
});

test("append aceita data e origem da migração", async () => {
  const { f, calls } = fakeFetch(() => new Response(null, { status: 201 }));
  await createSupabaseCopyTable({ ...cfg, fetch: f }).append(
    "home",
    { a: 1 },
    { createdAt: "2026-09-23T15:00:00.000Z", source: "blob-migration" },
  );

  assert.deepEqual(JSON.parse(String(calls[0].init.body)), {
    page_key: "home",
    copy: { a: 1 },
    source: "blob-migration",
    created_at: "2026-09-23T15:00:00.000Z",
  });
});

test("append lança quando o Supabase recusa", async () => {
  const { f } = fakeFetch(() => new Response("nope", { status: 401 }));
  await assert.rejects(createSupabaseCopyTable({ ...cfg, fetch: f }).append("home", {}), /401/);
});
```

- [x] **Step 2: Rodar e ver falhar**

Run: `npm test`
Esperado: FAIL em `tests/page-copy-supabase.test.ts` com "Cannot find module ... lib/page-copy/supabase.ts". Os outros testes continuam passando.

- [x] **Step 3: Implementar**

```ts
/**
 * A TABELA DOS TEXTOS DO /edit NO SUPABASE — 24-09.
 *
 * Substitui o Vercel Blob, cujo `list()` estourou a cota de operações. Fala com
 * a API REST do Supabase (PostgREST) por `fetch`, sem SDK: são duas chamadas, e
 * um cliente de duas funções não justifica uma dependência.
 *
 * SEM `server-only` DE PROPÓSITO, para os testes em `node --test` poderem
 * importar. Quem garante que a secret key não vaza para o navegador é quem
 * chama: só `store.ts`, que é `server-only`, e o script de migração.
 *
 * ⚠️ ERRO LANÇA, NUNCA VIRA `null`. "Nada salvo" e "não consegui ler" têm de
 * ser coisas diferentes: é o `store.ts` que decide cair no padrão SEM guardar
 * isso em cache. Se este arquivo engolisse o erro, o padrão seria cacheado e a
 * edição da cliente sumiria do site em silêncio.
 */
export type SupabaseCopyTable = {
  latest: (key: string) => Promise<unknown | null>;
  append: (key: string, copy: unknown, opts?: { createdAt?: string; source?: string }) => Promise<void>;
};

export function createSupabaseCopyTable({
  url,
  secretKey,
  fetch: f = fetch,
}: {
  url: string;
  secretKey: string;
  fetch?: typeof fetch;
}): SupabaseCopyTable {
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/page_copy_versions`;
  const headers = { apikey: secretKey, "content-type": "application/json" };

  return {
    async latest(key) {
      const q = new URLSearchParams({
        select: "copy",
        page_key: `eq.${key}`,
        order: "created_at.desc,id.desc",
        limit: "1",
      });
      const res = await f(`${endpoint}?${q}`, { headers });
      if (!res.ok) throw new Error(`[page-copy] latest ${key}: HTTP ${res.status} ${await res.text()}`);
      const rows = (await res.json()) as { copy: unknown }[];
      return rows[0]?.copy ?? null;
    },

    async append(key, copy, { createdAt, source = "editor" } = {}) {
      const res = await f(endpoint, {
        method: "POST",
        headers: { ...headers, prefer: "return=minimal" },
        body: JSON.stringify({
          page_key: key,
          copy,
          source,
          ...(createdAt ? { created_at: createdAt } : {}),
        }),
      });
      if (!res.ok) throw new Error(`[page-copy] append ${key}: HTTP ${res.status} ${await res.text()}`);
    },
  };
}

/** A tabela configurada pelo ambiente, ou `null` fora dele (máquina local sem as chaves). */
export function supabaseCopyTableFromEnv(): SupabaseCopyTable | null {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  return url && secretKey ? createSupabaseCopyTable({ url, secretKey }) : null;
}
```

Se a Task 1, Step 4 mostrou que a chave é do formato antigo (JWT), acrescentar `Authorization: \`Bearer ${secretKey}\`` em `headers`, e a asserção correspondente no primeiro teste.

- [x] **Step 4: Rodar e ver passar**

Run: `npm test`
Esperado: todos PASS, incluindo os seis de `page-copy-supabase`.

- [x] **Step 5: Commit**

```bash
git add lib/page-copy/supabase.ts tests/page-copy-supabase.test.ts
git commit -m "feat(page-copy): cliente REST da tabela page_copy_versions no Supabase"
```

---

### Task 3: Trocar o Blob pelo Supabase no `store.ts`

**Files:**
- Modify: `lib/page-copy/store.ts` (arquivo inteiro)

O `store.ts` não é testável em `node --test` (importa `server-only` e `next/cache`); a verificação é por typecheck e pelo teste manual da Task 5.

- [x] **Step 1: Substituir o arquivo inteiro por**

```ts
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

  const readCached = unstable_cache(readFresh, [tag, shape], {
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
```

- [x] **Step 2: Typecheck e testes**

Run: `npx tsc --noEmit && npm test`
Esperado: sem erros, todos os testes PASS.

- [x] **Step 3: Conferir que nada mais importa o Blob**

Run: `grep -rn "@vercel/blob" app lib components`
Esperado: nenhuma linha.

- [x] **Step 4: Commit**

```bash
git add lib/page-copy/store.ts
git commit -m "feat(page-copy): textos do /edit passam do Vercel Blob para o Supabase"
```

---

### Task 4: Script de migração Blob → Supabase

**Files:**
- Create: `scripts/migrate-page-copy-to-supabase.ts`

- [x] **Step 1: Escrever o script** (com um ajuste: `--from-backup` filtra de fato o que é igual ao padrão, como o comentário prometia)

```ts
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

const KEYS = ["home", "about", "team", "services-index", "clients", "service-pages"];

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
  try {
    return [{ copy: JSON.parse(await readFile(file, "utf8")), source: `backup-${label}-2026-09-24` }];
  } catch {
    return [];
  }
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
```

- [x] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Esperado: sem erros.

- [x] **Step 3: Commit**

```bash
git add scripts/migrate-page-copy-to-supabase.ts
git commit -m "chore(page-copy): script de migração do Blob para o Supabase"
```

---

### Task 5: Chaves no ambiente, migração e teste local

- [ ] **Step 1: Pôr as chaves no `.env.local`**

Acrescentar (valores do painel do Supabase do CMS → Project Settings → API; a secret key é a `sb_secret_…`, ou a `service_role` no formato antigo):

```
SUPABASE_URL=https://<projeto>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

Garantir que `BLOB_READ_WRITE_TOKEN` do staging também está lá (`vercel env pull` com o projeto linkado ao staging), porque a migração lê o Blob.

- [ ] **Step 2: Ensaio da migração a partir do Blob**

Run: `node --env-file=.env.local --experimental-strip-types scripts/migrate-page-copy-to-supabase.ts --from-blob --dry-run`

Esperado: uma linha por chave, com `(dry-run) ✓ home: N versão(ões)` para as páginas editadas. Se der erro de cota/`BlobError` no `list()`, o Blob está bloqueado: ir para o Step 3b.

- [ ] **Step 3a: Migrar de verdade a partir do Blob**

Run: o mesmo comando, sem `--dry-run`.
Esperado: os mesmos números, sem `(dry-run)`.

- [ ] **Step 3b: (só se o Blob estiver bloqueado) Migrar a partir do backup da Task 0**

Run: `node --env-file=.env.local --experimental-strip-types scripts/migrate-page-copy-to-supabase.ts --from-backup staging`

Esperado: `✓` só nas chaves que a Task 0 marcou como `✎ DIFERE DO PADRÃO`. Anotar no PR que o histórico anterior a 24-09 ficou no Blob e pode ser migrado com `--from-blob --force` quando a cota renovar. ⚠️ Com `--force` a tabela ganha as versões antigas com a data original, e a de backup continua sendo a mais nova, então nada volta atrás.

- [ ] **Step 4: Conferir a tabela**

```bash
curl -s "$SUPABASE_URL/rest/v1/page_copy_versions?select=page_key,source,created_at&order=page_key,created_at" -H "apikey: $SUPABASE_SECRET_KEY"
```

Esperado: as linhas migradas, com `source` = `blob-migration` ou `backup-staging-2026-09-24`.

- [ ] **Step 5: Ver o site local lendo do banco**

Reiniciar o dev server (porta 3006, `npm run dev`; ele tem de voltar a ficar no ar) para pegar o `.env.local` novo. Abrir `http://localhost:3006/` e comparar o título do hero com `docs/backup-page-copy-2026-09-24/staging-home.json` → `hero.title`. Devem ser iguais.

- [ ] **Step 6: Salvar pelo editor e ver aparecer**

Em `http://localhost:3006/edit`, abrir a home, mudar uma palavra do hero, salvar. Esperado: "saved" no editor, a home mostrando a palavra nova ao recarregar, e uma linha nova com `source: editor` no curl do Step 4. **Depois, desfazer a mudança pelo próprio editor** (é a mesma tabela da produção).

- [ ] **Step 7: Ver a queda para o padrão sem cache**

Pôr um `SUPABASE_SECRET_KEY` errado no `.env.local`, reiniciar, abrir a home. Esperado: a página abre com o texto do código e o log do servidor mostra `[home-copy] read failed, rendering defaults`. Restaurar a chave certa, reiniciar e confirmar que o texto salvo volta **na hora**, sem esperar cache.

---

### Task 6: Build de produção

- [x] **Step 1: Build numa porta que não seja a 3006** (feito contra um PostgREST falso local)

Run: `npx next build`
Esperado: build sem erros e sem `Dynamic server usage` para `/`, `/about`, `/team`, `/services`, `/our-clients` e as páginas de serviço. Se aparecer `Dynamic server usage` apontando para o `fetch` do Supabase, passar `{ headers, cache: "force-cache", next: { tags: [] } }` NÃO é a correção (a URL do `latest` é sempre a mesma e ficaria presa); a correção é confirmar que a chamada só acontece dentro do `unstable_cache` (Task 3).

- [x] **Step 2: Subir o build e conferir**

Run: `npx next start -p 3100`, abrir `http://localhost:3100/` e conferir o título do hero como na Task 5, Step 5. Derrubar o 3100 depois.

- [ ] **Step 3: Commit (se algo mudou) e abrir o PR**

PR da branch para a `main`, com a descrição: o que mudou, de onde a migração veio (Blob ou backup), e as variáveis que precisam existir na Vercel ANTES do merge (Task 7).

---

### Task 7: Variáveis na Vercel e rollout (só quando o usuário pedir o deploy)

- [ ] **Step 1: Variáveis nos DOIS projetos, antes do merge**

No escopo `dobro66`, em `consulting-dna-corporate-preview` (staging) e `consulting-dna-corporate` (produção), para Production e Preview: `SUPABASE_URL` e `SUPABASE_SECRET_KEY` (marcada como Sensitive). ⚠️ Se a produção receber o merge sem as variáveis, ela cai no arquivo local, que não existe na Vercel: lê o padrão e o /edit não salva (sistema de arquivos somente leitura).

- [ ] **Step 2: Deploy do staging pela CLI e conferência**

Deploy manual do staging (o commit HEAD tem de ser de impulseaisolutions@gmail.com). No staging: a home mostra o texto salvo; um salvamento pelo /edit aparece ao recarregar; uma linha nova surge na tabela.

- [ ] **Step 3: Merge do PR na `main` (publica a produção sozinho)**

Depois do deploy: `curl -s https://consulting-dna-corporate-alpha.vercel.app/api/home-copy` e comparar com o backup. ⚠️ A produção, que até hoje mostrava só o texto do código, passa a mostrar as edições feitas no staging. É o comportamento esperado se a decisão do "Contexto" (tabela compartilhada) foi mantida.

---

### Task 8: Limpeza (uma semana depois, com tudo estável)

- [ ] **Step 1: Tirar o `@vercel/blob`**

Apagar `scripts/migrate-page-copy-to-supabase.ts` (a migração já rodou) e rodar `npm uninstall @vercel/blob`. Run: `npx tsc --noEmit && npm test`. Esperado: sem erros.

- [ ] **Step 2: Documentação**

Em `docs/edit-paginas.md`: trocar a linha "Armazenamento" (linha 23) por `lib/page-copy/store.ts` → tabela `page_copy_versions` no Supabase do CMS, uma linha por salvamento; trocar a seção "A leitura do Blob é cacheada" por um parágrafo sobre o cache por tag e a queda para o padrão sem cache; trocar "O token do Blob tem de estar lá ANTES do merge" por `SUPABASE_URL`/`SUPABASE_SECRET_KEY`.

- [ ] **Step 3: Vercel**

Remover `BLOB_READ_WRITE_TOKEN` dos dois projetos. **Não apagar a loja `cdna-home-copy`** por pelo menos 30 dias: é o rollback.

- [ ] **Step 4: Commit**

```bash
git add -A package.json package-lock.json scripts docs/edit-paginas.md
git commit -m "chore(page-copy): remove o Vercel Blob depois da migração para o Supabase"
```

---

## Rollback

Até a Task 8, voltar é reverter o commit da Task 3 (`git revert`) e fazer deploy: o Blob continua intacto com tudo o que tinha até 24-09. O que for salvo DEPOIS da migração existe só na tabela; se o rollback acontecer, exportar essas linhas antes (`curl` da Task 5, Step 4).
