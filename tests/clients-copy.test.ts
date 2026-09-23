import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_CLIENTS_COPY, EDITOR_SECTIONS } from "../lib/clients-copy.ts";
import { mergeClientsCopy } from "../lib/clients-copy-schema.ts";
import { DEFAULT_ABOUT_COPY } from "../lib/about-copy.ts";
import { getAtPath, setAtPath } from "../lib/page-copy/fields.ts";

test("sem nada salvo, a Clients & Impact usa o padrão", () => {
  assert.deepEqual(mergeClientsCopy(null), DEFAULT_CLIENTS_COPY);
  assert.deepEqual(mergeClientsCopy({}), DEFAULT_CLIENTS_COPY);
});

test("um campo salvo substitui só aquele campo", () => {
  const out = mergeClientsCopy({ hero: { title: "New title" } });
  assert.equal(out.hero.title, "New title");
  assert.equal(out.hero.subtitle, DEFAULT_CLIENTS_COPY.hero.subtitle);
  assert.deepEqual(out.cta, DEFAULT_CLIENTS_COPY.cta);
});

test("string vazia cai no padrão em vez de apagar o título", () => {
  const out = mergeClientsCopy({ hero: { title: "   " } });
  assert.equal(out.hero.title, DEFAULT_CLIENTS_COPY.hero.title);
});

test("salvo inválido (dois rótulos de footprint) volta o padrão inteiro", () => {
  const out = mergeClientsCopy({ footprint: { statLabels: ["Regions", "Clients"] } });
  assert.deepEqual(out, DEFAULT_CLIENTS_COPY);
});

test("todo campo do editor aponta para um valor existente no padrão", () => {
  for (const s of EDITOR_SECTIONS) {
    for (const f of s.fields) {
      const v = getAtPath(DEFAULT_CLIENTS_COPY, f.path);
      assert.ok(v !== undefined, `${f.path} não existe no padrão`);
      if (f.kind === "lines" || f.kind === "paragraphs") assert.ok(Array.isArray(v), f.path);
      else assert.equal(typeof v, "string", f.path);
    }
  }
});

test("os id das seções do editor são únicos", () => {
  const ids = EDITOR_SECTIONS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

/**
 * ⚠️ A DIVERGÊNCIA QUE ESTE TESTE GUARDA. Os quatro números da faixa escura
 * desta página são os mesmos quatro da About desde 18-09, a pedido da cliente.
 * Se alguém um dia acrescentar `numbers.stats` aqui "para facilitar", passam a
 * existir duas fontes para o mesmo número — que é exatamente o defeito que
 * juntar as listas foi feito para impedir.
 */
test("os quatro números NÃO estão na copy desta página", () => {
  const paths = EDITOR_SECTIONS.flatMap((s) => s.fields.map((f) => f.path));
  for (const stat of DEFAULT_ABOUT_COPY.stats) {
    for (const p of paths) {
      assert.notEqual(
        getAtPath(DEFAULT_CLIENTS_COPY, p),
        stat.value,
        `${p} repete "${stat.value}", que é da copy da About`,
      );
    }
  }
  assert.equal("stats" in DEFAULT_CLIENTS_COPY.numbers, false);
});

test("setAtPath troca um rótulo do footprint sem mutar o padrão", () => {
  const next = setAtPath(DEFAULT_CLIENTS_COPY, "footprint.statLabels.1", "Organisations");
  assert.equal(next.footprint.statLabels[1], "Organisations");
  assert.equal(DEFAULT_CLIENTS_COPY.footprint.statLabels[1], "Clients");
});
