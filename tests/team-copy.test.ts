import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_TEAM_COPY, EDITOR_SECTIONS } from "../lib/team-copy.ts";
import { TeamCopySchema, mergeTeamCopy } from "../lib/team-copy-schema.ts";
import { leaders, dnaStrands } from "../lib/team.ts";
import { getAtPath, setAtPath } from "../lib/page-copy/fields.ts";

test("sem nada salvo, a Team usa o padrão", () => {
  assert.deepEqual(mergeTeamCopy(null), DEFAULT_TEAM_COPY);
  assert.deepEqual(mergeTeamCopy({}), DEFAULT_TEAM_COPY);
});

test("um campo salvo substitui só aquele campo", () => {
  const out = mergeTeamCopy({ hero: { title: "New title" } });
  assert.equal(out.hero.title, "New title");
  assert.equal(out.hero.subtitle, DEFAULT_TEAM_COPY.hero.subtitle);
  assert.deepEqual(out.cta, DEFAULT_TEAM_COPY.cta);
});

test("string vazia cai no padrão em vez de apagar o título", () => {
  const out = mergeTeamCopy({ hero: { title: "   " } });
  assert.equal(out.hero.title, DEFAULT_TEAM_COPY.hero.title);
});

test("a lista de linhas do One team substitui a lista inteira", () => {
  const out = mergeTeamCopy({ oneTeam: { lines: ["Uma linha só."] } });
  assert.deepEqual(out.oneTeam.lines, ["Uma linha só."]);
});

test("salvo inválido (um líder a menos) volta o padrão inteiro", () => {
  const out = mergeTeamCopy({ leaders: DEFAULT_TEAM_COPY.leaders.slice(0, 5) });
  assert.deepEqual(out, DEFAULT_TEAM_COPY);
});

test("chave desconhecida e tipo errado são ignorados", () => {
  const out = mergeTeamCopy({ hero: { title: 42, bogus: "x" }, other: true });
  assert.equal(out.hero.title, DEFAULT_TEAM_COPY.hero.title);
  assert.equal("other" in out, false);
});

test("todo campo do editor aponta para um valor existente no padrão", () => {
  for (const s of EDITOR_SECTIONS) {
    for (const f of s.fields) {
      const v = getAtPath(DEFAULT_TEAM_COPY, f.path);
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
 * ⚠️ O GUARDA QUE IMPORTA NESTA PÁGINA. O padrão é DERIVADO de `lib/team.ts`,
 * e os comprimentos estão cravados no schema: acrescentar um sétimo líder (ou
 * uma quinta vertente) em `lib/team.ts` faz o próprio padrão parar de passar na
 * validação, e o editor pararia de salvar em silêncio. Este teste faz isso
 * falhar no `npm test` em vez de na tela da cliente.
 */
test("o padrão passa no próprio schema", () => {
  const parsed = TeamCopySchema.safeParse(DEFAULT_TEAM_COPY);
  assert.ok(
    parsed.success,
    "o padrão derivado de lib/team.ts não passa no schema — os comprimentos travados em team-copy-schema.ts saíram de sincronia",
  );
});

/**
 * O card de cada líder junta nome/retrato/`cmsSlug` (de `lib/team.ts`) com
 * cargo/região/frase (daqui) POR POSIÇÃO. Se as duas listas tiverem tamanhos
 * diferentes, um card sai com o cargo de outra pessoa.
 */
test("os seis líderes e as quatro vertentes casam por posição com lib/team.ts", () => {
  assert.equal(DEFAULT_TEAM_COPY.leaders.length, leaders.length);
  assert.equal(DEFAULT_TEAM_COPY.dna.strands.length, dnaStrands.length);
  DEFAULT_TEAM_COPY.leaders.forEach((l, i) => {
    assert.equal(l.role, leaders[i].role, `líder ${i}`);
    assert.equal(l.quote, leaders[i].quote, `líder ${i}`);
  });
});

/**
 * Os rótulos dos campos dos líderes trazem o NOME da pessoa — é o que diz à
 * cliente de quem é o cargo que ela está editando. Um rótulo genérico ("Leader
 * 3 — job title") seria inutilizável numa grade de seis.
 */
test("cada campo de líder traz o nome da pessoa no rótulo", () => {
  const section = EDITOR_SECTIONS.find((s) => s.id === "leaders");
  assert.ok(section);
  assert.equal(section.fields.length, leaders.length * 3);
  leaders.forEach((p, i) => {
    for (const f of section.fields.filter((f) => f.path.startsWith(`leaders.${i}.`))) {
      assert.ok(f.label.startsWith(p.name), `${f.path}: "${f.label}" não começa com "${p.name}"`);
    }
  });
});

test("setAtPath troca dentro das listas da Team sem mutar o padrão", () => {
  const next = setAtPath(DEFAULT_TEAM_COPY, "leaders.2.role", "Acme");
  assert.equal(next.leaders[2].role, "Acme");
  assert.equal(DEFAULT_TEAM_COPY.leaders[2].role, leaders[2].role);
  assert.equal(next.leaders[0], DEFAULT_TEAM_COPY.leaders[0]);
});
