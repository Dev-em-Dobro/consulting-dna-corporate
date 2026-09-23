import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_ABOUT_COPY, EDITOR_SECTIONS } from "../lib/about-copy.ts";
import { mergeAboutCopy } from "../lib/about-copy-schema.ts";
import { getAtPath, setAtPath } from "../lib/page-copy/fields.ts";

test("sem nada salvo, a About usa o padrão", () => {
  assert.deepEqual(mergeAboutCopy(null), DEFAULT_ABOUT_COPY);
  assert.deepEqual(mergeAboutCopy({}), DEFAULT_ABOUT_COPY);
});

test("um campo salvo substitui só aquele campo", () => {
  const out = mergeAboutCopy({ hero: { title: "New title" } });
  assert.equal(out.hero.title, "New title");
  assert.deepEqual(out.hero.subtitleLines, DEFAULT_ABOUT_COPY.hero.subtitleLines);
  assert.deepEqual(out.people, DEFAULT_ABOUT_COPY.people);
});

test("string vazia cai no padrão em vez de apagar o título", () => {
  const out = mergeAboutCopy({ hero: { title: "   " } });
  assert.equal(out.hero.title, DEFAULT_ABOUT_COPY.hero.title);
});

test("lista salva substitui a lista inteira", () => {
  const out = mergeAboutCopy({ purpose: { body: ["um", "dois", "três"] } });
  assert.deepEqual(out.purpose.body, ["um", "dois", "três"]);
});

/**
 * O telefone é o campo em que o vazio é uma ESCOLHA, e não engano — Riyadh e
 * Miami não publicam nenhum. Ele sobrevive porque mora dentro de uma lista, e
 * lista é substituída inteira em vez de mesclada campo a campo.
 */
test("telefone vazio sobrevive, porque está dentro de uma lista", () => {
  const offices = DEFAULT_ABOUT_COPY.offices.map((o, i) => (i === 0 ? { ...o, tel: "" } : o));
  const out = mergeAboutCopy({ offices });
  assert.equal(out.offices[0].tel, "");
  assert.equal(out.offices[0].city, "London");
});

test("salvo inválido (um valor a menos) volta o padrão inteiro", () => {
  const out = mergeAboutCopy({ values: { items: DEFAULT_ABOUT_COPY.values.items.slice(0, 4) } });
  assert.deepEqual(out, DEFAULT_ABOUT_COPY);
});

test("chave desconhecida e tipo errado são ignorados", () => {
  const out = mergeAboutCopy({ hero: { title: 42, bogus: "x" }, other: true });
  assert.equal(out.hero.title, DEFAULT_ABOUT_COPY.hero.title);
  assert.equal("other" in out, false);
});

test("todo campo do editor aponta para um valor existente no padrão", () => {
  for (const s of EDITOR_SECTIONS) {
    for (const f of s.fields) {
      const v = getAtPath(DEFAULT_ABOUT_COPY, f.path);
      assert.ok(v !== undefined, `${f.path} não existe no padrão`);
      if (f.kind === "lines" || f.kind === "paragraphs") assert.ok(Array.isArray(v), f.path);
      else assert.equal(typeof v, "string", f.path);
    }
  }
});

/**
 * Cada seção do editor pede `public/edit-about-guide/<id>.jpg`, e o `id` também
 * vira âncora `#s-<id>` no índice da tela. Dois iguais dariam duas seções com o
 * mesmo print e um link que pula para a errada.
 */
test("os id das seções do editor são únicos", () => {
  const ids = EDITOR_SECTIONS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("os quatro números e os cinco valores casam com os ícones por posição", () => {
  // O schema trava os tamanhos; isto guarda os números contra uma edição no
  // padrão que passasse despercebida — os ícones vivem em outro arquivo.
  assert.equal(DEFAULT_ABOUT_COPY.stats.length, 4);
  assert.equal(DEFAULT_ABOUT_COPY.values.items.length, 5);
  assert.equal(DEFAULT_ABOUT_COPY.identity.pillars.length, 4);
  assert.equal(DEFAULT_ABOUT_COPY.offices.length, 5);
});

test("setAtPath troca dentro das listas da About sem mutar o padrão", () => {
  const next = setAtPath(DEFAULT_ABOUT_COPY, "values.items.2.name", "Acme");
  assert.equal(next.values.items[2].name, "Acme");
  assert.equal(DEFAULT_ABOUT_COPY.values.items[2].name, "Relationship Centricity");
  assert.equal(next.values.items[0], DEFAULT_ABOUT_COPY.values.items[0]);
});
