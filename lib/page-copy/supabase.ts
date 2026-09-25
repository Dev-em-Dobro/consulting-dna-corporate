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
