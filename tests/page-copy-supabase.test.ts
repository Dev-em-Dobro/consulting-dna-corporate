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
