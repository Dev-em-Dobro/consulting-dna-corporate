import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_HOME_COPY,
  EDITOR_SECTIONS,
  fromInput,
  getAtPath,
  setAtPath,
  toInput,
} from "../lib/home-copy.ts";
import { mergeHomeCopy } from "../lib/home-copy-schema.ts";

test("sem nada salvo, a home usa o padrão", () => {
  assert.deepEqual(mergeHomeCopy(null), DEFAULT_HOME_COPY);
  assert.deepEqual(mergeHomeCopy({}), DEFAULT_HOME_COPY);
});

test("um campo salvo substitui só aquele campo", () => {
  const out = mergeHomeCopy({ hero: { title: "New title" } });
  assert.equal(out.hero.title, "New title");
  assert.equal(out.hero.subtitle, DEFAULT_HOME_COPY.hero.subtitle);
  assert.deepEqual(out.contact, DEFAULT_HOME_COPY.contact);
});

test("string vazia cai no padrão em vez de apagar o título", () => {
  const out = mergeHomeCopy({ hero: { title: "   " } });
  assert.equal(out.hero.title, DEFAULT_HOME_COPY.hero.title);
});

test("lista salva substitui a lista inteira", () => {
  const out = mergeHomeCopy({ solve: { reals: ["a", "b"] } });
  assert.deepEqual(out.solve.reals, ["a", "b"]);
});

test("chave desconhecida e tipo errado são ignorados", () => {
  const out = mergeHomeCopy({ hero: { title: 42, bogus: "x" }, other: true });
  assert.equal(out.hero.title, DEFAULT_HOME_COPY.hero.title);
  assert.equal("other" in out, false);
});

test("salvo inválido (cards a menos) volta o padrão inteiro", () => {
  const out = mergeHomeCopy({ impact: { cases: [] } });
  assert.deepEqual(out, DEFAULT_HOME_COPY);
});

test("todo campo do editor aponta para um valor existente no padrão", () => {
  for (const s of EDITOR_SECTIONS) {
    for (const f of s.fields) {
      const v = getAtPath(DEFAULT_HOME_COPY, f.path);
      assert.ok(v !== undefined, `${f.path} não existe no padrão`);
      if (f.kind === "lines" || f.kind === "paragraphs") assert.ok(Array.isArray(v), f.path);
      else assert.equal(typeof v, "string", f.path);
    }
  }
});

test("setAtPath não muta o original e troca dentro de arrays", () => {
  const next = setAtPath(DEFAULT_HOME_COPY, "impact.cases.1.client", "Acme");
  assert.equal(next.impact.cases[1].client, "Acme");
  assert.equal(DEFAULT_HOME_COPY.impact.cases[1].client, "Coca-Cola");
  assert.equal(next.impact.cases[0], DEFAULT_HOME_COPY.impact.cases[0]);
});

test("lines e paragraphs vão e voltam do textarea", () => {
  assert.deepEqual(fromInput("lines", "a\n b \n\nc"), ["a", "b", "c"]);
  assert.deepEqual(fromInput("paragraphs", "p1 line\n\np2\n\n\np3"), ["p1 line", "p2", "p3"]);
  assert.equal(toInput("lines", ["a", "b"]), "a\nb");
  assert.equal(toInput("paragraphs", ["a", "b"]), "a\n\nb");
  assert.equal(toInput("text", "x"), "x");
});
