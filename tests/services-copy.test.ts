import test from "node:test";
import assert from "node:assert/strict";
import { services } from "../lib/services.ts";
import {
  DEFAULT_SERVICE_PAGES_COPY,
  EDITABLE_SERVICES,
  applyServiceCopy,
  sectionsFor,
} from "../lib/service-pages-copy.ts";
import {
  ServicePagesCopySchema,
  mergeServicePagesCopy,
} from "../lib/service-pages-copy-schema.ts";
import {
  DEFAULT_SERVICES_INDEX_COPY,
  EDITOR_SECTIONS as INDEX_SECTIONS,
} from "../lib/services-index-copy.ts";
import { mergeServicesIndexCopy } from "../lib/services-index-copy-schema.ts";
import { getAtPath } from "../lib/page-copy/fields.ts";

/* ── A listagem ─────────────────────────────────────────────────────────── */

test("sem nada salvo, a listagem usa o padrão", () => {
  assert.deepEqual(mergeServicesIndexCopy(null), DEFAULT_SERVICES_INDEX_COPY);
});

test("todo campo do editor da listagem existe no padrão", () => {
  for (const s of INDEX_SECTIONS) {
    for (const f of s.fields) {
      const v = getAtPath(DEFAULT_SERVICES_INDEX_COPY, f.path);
      assert.ok(v !== undefined, `${f.path} não existe no padrão`);
      if (f.kind === "lines" || f.kind === "paragraphs") assert.ok(Array.isArray(v), f.path);
      else assert.equal(typeof v, "string", f.path);
    }
  }
});

/**
 * A faixa de fecho da `/services` não tinha prop nenhuma: ela caía nos padrões
 * do `SolutionCta`. Se os padrões transcritos aqui divergirem dos do componente,
 * o primeiro deploy troca o texto da faixa sem ninguém ter pedido.
 */
test("os padrões da faixa de fecho são os do SolutionCta", () => {
  assert.equal(DEFAULT_SERVICES_INDEX_COPY.cta.strapline, "Ready to start the conversation?");
  assert.equal(DEFAULT_SERVICES_INDEX_COPY.cta.ctaLabel, "Start a Conversation");
  // Vazio: o componente não desenha o parágrafo quando `line` falta.
  assert.equal(DEFAULT_SERVICES_INDEX_COPY.cta.line, "");
});

/* ── As dez internas ────────────────────────────────────────────────────── */

test("sem nada salvo, as internas usam o padrão", () => {
  assert.deepEqual(mergeServicePagesCopy(null), DEFAULT_SERVICE_PAGES_COPY);
  assert.deepEqual(mergeServicePagesCopy({}), DEFAULT_SERVICE_PAGES_COPY);
});

test("o padrão passa no próprio schema", () => {
  const parsed = ServicePagesCopySchema.safeParse(DEFAULT_SERVICE_PAGES_COPY);
  assert.ok(parsed.success, "o padrão derivado de lib/services.ts não passa no schema");
});

test("os dez serviços estão na copy, na ordem de lib/services.ts", () => {
  assert.equal(EDITABLE_SERVICES.length, services.length);
  assert.deepEqual(
    Object.keys(DEFAULT_SERVICE_PAGES_COPY.bySlug),
    services.map((s) => s.slug),
  );
});

test("um campo salvo muda só aquele serviço", () => {
  const out = mergeServicePagesCopy({ bySlug: { "culture-transformation": { title: "Novo nome" } } });
  assert.equal(out.bySlug["culture-transformation"].title, "Novo nome");
  assert.equal(
    out.bySlug["executive-coaching"].title,
    DEFAULT_SERVICE_PAGES_COPY.bySlug["executive-coaching"].title,
  );
});

/**
 * O corpo das duas seções de texto resolve `whatWeDo ?? outcome` e
 * `howWeWork ?? howWeHelp` no template. Nove serviços caem no segundo de cada
 * par — se o `copyOf` pegasse o campo errado, a tela mostraria vazio e a edição
 * não apareceria na página.
 */
test("o corpo editável é o que a página realmente renderiza", () => {
  for (const s of services) {
    const c = DEFAULT_SERVICE_PAGES_COPY.bySlug[s.slug];
    assert.equal(c.whatWeDoBody, s.whatWeDo ?? s.outcome, s.slug);
    assert.equal(c.howWeWorkBody, s.howWeWork ?? s.howWeHelp, s.slug);
    assert.ok(c.whatWeDoBody.trim(), `${s.slug}: corpo do "What we do" vazio`);
    assert.ok(c.howWeWorkBody.trim(), `${s.slug}: corpo do "How we work" vazio`);
  }
});

test("todo campo do editor de cada serviço existe no padrão", () => {
  for (const { slug } of EDITABLE_SERVICES) {
    const sections = sectionsFor(slug);
    assert.ok(sections.length, `${slug} não tem seção nenhuma`);
    const ids = sections.map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, `${slug}: id repetido`);
    for (const sec of sections) {
      assert.ok(sec.fields.length, `${slug}/${sec.id} sem campo`);
      for (const f of sec.fields) {
        const v = getAtPath(DEFAULT_SERVICE_PAGES_COPY, f.path);
        assert.ok(v !== undefined, `${f.path} não existe no padrão`);
        if (f.kind === "lines" || f.kind === "paragraphs") assert.ok(Array.isArray(v), f.path);
        else assert.equal(typeof v, "string", f.path);
      }
    }
  }
});

/**
 * O espelho do teste acima, pelo lado da PÁGINA: se um campo está na tela, o
 * texto dele tem de chegar ao HTML. A assinatura de fecho é o caso que quase
 * escapou — o único serviço que a tem também tem `practices`, e o template
 * troca a assinatura por um rótulo fixo quando isso acontece.
 */
test("nenhum serviço publica a assinatura de fecho hoje", () => {
  const rendered = services.filter((s) => s.closing && !s.practices);
  assert.deepEqual(rendered, [], "algum serviço passou a publicar `closing` — reveja sectionsFor");
});

test("slug desconhecido não devolve seção nenhuma", () => {
  assert.deepEqual(sectionsFor("nao-existe"), []);
});

/**
 * A tela de um serviço só mostra as seções que ele TEM. Nove dos dez não têm
 * "Who we work with" nem a assinatura de fecho; expor campos vazios lá daria a
 * impressão de que preencher acrescenta um bloco à página, o que não acontece.
 */
test("a tela de cada serviço mostra só as seções que ele tem", () => {
  for (const s of services) {
    const ids = sectionsFor(s.slug).map((x) => x.id);
    assert.equal(ids.includes("audiences"), Boolean(s.audiences?.length), s.slug);
    /* A assinatura de fecho só chega à tela quando o serviço NÃO tem
       `practices` — ver a caixa em `sectionsFor`. Hoje isso significa que ela
       não aparece em nenhuma das dez telas; o teste guarda a REGRA, não o
       número, para o dia em que um serviço sem práticas ganhar uma. */
    assert.equal(ids.includes("closing"), Boolean(s.closing && !s.practices), s.slug);
    assert.equal(ids.includes("evidence"), Boolean(s.evidence), s.slug);
    /* A faixa de evidência do layout de 24-09 é seção própria, e ela e a de
       cima nunca aparecem na mesma tela — ver o teste do par excludente em
       `tests/services.test.ts`. */
    assert.equal(ids.includes("evidence-summary"), Boolean(s.evidenceSummary), s.slug);
  }
});

/* ── applyServiceCopy ───────────────────────────────────────────────────── */

test("sem copy, o serviço sai intacto", () => {
  for (const s of services) assert.equal(applyServiceCopy(s, undefined), s);
});

test("com o padrão, a página renderiza o mesmo texto de antes", () => {
  for (const s of services) {
    const out = applyServiceCopy(s, DEFAULT_SERVICE_PAGES_COPY.bySlug[s.slug]);
    assert.equal(out.title, s.title, s.slug);
    assert.equal(out.banner, s.banner, s.slug);
    // O template resolve estes dois pares; o resultado tem de ser o mesmo.
    assert.equal(out.whatWeDo ?? out.outcome, s.whatWeDo ?? s.outcome, s.slug);
    assert.equal(out.howWeWork ?? out.howWeHelp, s.howWeWork ?? s.howWeHelp, s.slug);
    assert.deepEqual(out.practices?.items ?? out.pillars, s.practices?.items ?? s.pillars, s.slug);
    assert.deepEqual(out.cta, s.cta, s.slug);
    assert.deepEqual(out.testimonial, s.testimonial, s.slug);
  }
});

/**
 * ⚠️ O GUARDA QUE IMPORTA AQUI. A forma da copy é uniforme nos dez e guarda
 * strings vazias para os blocos que nove serviços não têm. Se o `apply` as
 * devolvesse como objeto, a página desenharia uma assinatura em branco, um bloco
 * de audiences vazio ou um case sem cliente.
 */
test("apply não ressuscita bloco que o serviço não tem", () => {
  for (const s of services) {
    const out = applyServiceCopy(s, DEFAULT_SERVICE_PAGES_COPY.bySlug[s.slug]);
    assert.equal(out.audiences === undefined, s.audiences === undefined, `${s.slug}: audiences`);
    assert.equal(out.closing === undefined, s.closing === undefined, `${s.slug}: closing`);
    assert.equal(out.evidence === undefined, s.evidence === undefined, `${s.slug}: evidence`);
    assert.equal(
      out.evidenceSummary === undefined,
      s.evidenceSummary === undefined,
      `${s.slug}: evidenceSummary`,
    );
    assert.equal(out.testimonial === undefined, s.testimonial === undefined, `${s.slug}: testimonial`);
  }
});

test("o texto editado vence o `??` do template nos nove que caem em outcome", () => {
  const s = services.find((x) => x.slug === "culture-transformation")!;
  const copy = {
    ...DEFAULT_SERVICE_PAGES_COPY.bySlug[s.slug],
    whatWeDoBody: "Texto novo.",
    howWeWorkBody: "Outro texto novo.",
  };
  const out = applyServiceCopy(s, copy);
  assert.equal(out.whatWeDo ?? out.outcome, "Texto novo.");
  assert.equal(out.howWeWork ?? out.howWeHelp, "Outro texto novo.");
});

/**
 * COPY SALVA ANTES DO CAMPO EXISTIR NÃO PODE DERRUBAR A PÁGINA.
 *
 * O defeito que este teste guarda foi real e derrubou as onze rotas de serviço
 * de uma vez, em 24-09, no primeiro render depois de `evidenceSummary` entrar.
 * O `mergeCopy` preenche o campo novo a partir do padrão, então a leitura CRUA
 * do Blob nunca chega aqui sem ele — mas entre a mescla e esta função há o
 * `unstable_cache`, que guarda o resultado por um dia com uma chave que não
 * sabe nada sobre a FORMA do objeto. Entrada gravada pela versão anterior volta
 * sem a chave nova, o tipo garante que ela está lá, e o acesso direto estoura.
 *
 * O teste simula exatamente isso: a copy da versão anterior, sem o campo.
 */
test("copy de uma versão anterior, sem o campo novo, não quebra o apply", () => {
  const s = services.find((x) => x.evidenceSummary)!;
  const { evidenceSummary: _fora, ...antiga } = DEFAULT_SERVICE_PAGES_COPY.bySlug[s.slug];
  const out = applyServiceCopy(s, antiga as never);
  assert.equal(out.evidenceSummary?.headline, s.evidenceSummary!.headline);
  assert.equal(out.evidenceSummary?.lead, s.evidenceSummary!.lead);
  assert.deepEqual(out.evidenceSummary?.facts, s.evidenceSummary!.facts);
});
