import test from "node:test";
import assert from "node:assert/strict";
import { paragraphs, services } from "../lib/services.ts";

test("paragraphs converte **…** em <strong>", () => {
  assert.equal(
    paragraphs("um **dois** três"),
    "<p>um <strong>dois</strong> três</p>",
  );
});

test("paragraphs escapa o HTML antes de aplicar a ênfase", () => {
  assert.equal(
    paragraphs("a < b **e & c**"),
    "<p>a &lt; b <strong>e &amp; c</strong></p>",
  );
});

test("asterisco sem par fica visível em vez de virar tag", () => {
  assert.equal(paragraphs("um *dois"), "<p>um *dois</p>");
});

test("os dez serviços têm ênfase nos dois blocos de texto", () => {
  for (const s of services) {
    assert.match(s.outcome, /\*\*.+\*\*/, `${s.slug}: outcome sem ênfase`);
    assert.match(s.howWeHelp, /\*\*.+\*\*/, `${s.slug}: howWeHelp sem ênfase`);
  }
});

test("toda ênfase está fechada", () => {
  for (const s of services) {
    for (const [field, text] of [
      ["outcome", s.outcome],
      ["howWeHelp", s.howWeHelp],
    ] as const) {
      const marks = (text.match(/\*\*/g) ?? []).length;
      assert.equal(marks % 2, 0, `${s.slug}.${field}: número ímpar de **`);
    }
  }
});

test("pillars: 4 a 6 termos por serviço, sem vazio e sem ponto final", () => {
  for (const s of services) {
    const pillars = s.pillars ?? [];
    assert.ok(
      pillars.length >= 4 && pillars.length <= 6,
      `${s.slug}: ${pillars.length} pilares (esperado 4 a 6)`,
    );
    for (const p of pillars) {
      assert.ok(p.trim().length > 0, `${s.slug}: pilar vazio`);
      assert.ok(!p.endsWith("."), `${s.slug}: "${p}" termina em ponto`);
      assert.match(p, /^[A-Z]/, `${s.slug}: "${p}" não começa maiúsculo`);
    }
  }
});

test("nenhum asterisco vaza para o HTML dos vinte campos", () => {
  for (const s of services) {
    for (const [field, text] of [
      ["outcome", s.outcome],
      ["howWeHelp", s.howWeHelp],
    ] as const) {
      assert.ok(
        !paragraphs(text).includes("*"),
        `${s.slug}.${field}: asterisco vazou para o HTML`,
      );
    }
  }
});

test("ênfase aninhada corrompe em silêncio (comportamento conhecido, não suportado)", () => {
  // Número par de `**` (quatro), então o teste de paridade acima aprovaria — e
  // mesmo assim o resultado sai errado: o regex não guloso casa do primeiro par
  // de `**` ao segundo, sem noção de aninhamento.
  assert.equal(
    paragraphs("**a **b** c**"),
    "<p><strong>a </strong>b<strong> c</strong></p>",
  );
});

/**
 * AS DUAS FAIXAS DE EVIDÊNCIA SÃO EXCLUDENTES, e o tipo não consegue dizer
 * isso. `evidence` desenha o bloco de caso (`SolutionEvidence`) e
 * `evidenceSummary` desenha a faixa do layout de 24-09
 * (`SolutionEvidenceSummary`); as duas ocupam o mesmo lugar na página e as duas
 * escrevem o rótulo "Evidence" em cima. Um serviço com os dois campos publicaria
 * a palavra duas vezes, uma faixa escura seguida de uma clara.
 *
 * `SolutionView` dá precedência ao `evidenceSummary`, então o defeito não
 * quebraria a página — ele passaria numa revisão rápida, que é pior.
 */
test("nenhum serviço tem as duas faixas de evidência ao mesmo tempo", () => {
  const ambos = services.filter((s) => s.evidence && s.evidenceSummary).map((s) => s.slug);
  assert.deepEqual(ambos, [], "estes serviços desenhariam o rótulo Evidence duas vezes");
});

/**
 * O TRAVESSÃO NÃO VOLTA À COPY — a regra de site inteiro pedida na daily de
 * 23-09 (*"tirar o travessão do site todo nos textos pra nao parecer ia"*) e
 * aplicada em `a37355f`, que passou 62 arquivos a limpo.
 *
 * ⚠️ É FÁCIL DESFAZER SEM QUERER, e foi por isso que este teste existe: a copy
 * nova chega por documento e por layout da cliente, os dois escritos ANTES
 * daquele pedido, e transcrever "à letra" reintroduz o caractere. Aconteceu no
 * layout de 24-09, nos três cartões de público.
 *
 * ⚠️ O MEIO-TRAÇO (–) NÃO É ALVO. Ele é sinal de intervalo ("1–2 day", "Top
 * 100–150") e está na copy final da cliente em vários serviços; o pedido é
 * sobre o travessão (—), que é pontuação de frase.
 */
test("nenhum travessão na copy visível dos dez serviços", () => {
  for (const s of services) {
    const campos: [string, string | undefined][] = [
      ["banner", s.banner],
      ["heroSubtitle", s.heroSubtitle],
      ["outcomeHeadline", s.outcomeHeadline],
      ["outcome", s.outcome],
      ["whatWeDoHeadline", s.whatWeDoHeadline],
      ["whatWeDo", s.whatWeDo],
      ["howWeHelpHeadline", s.howWeHelpHeadline],
      ["howWeHelp", s.howWeHelp],
      ["howWeWorkHeadline", s.howWeWorkHeadline],
      ["howWeWork", s.howWeWork],
      ["cta.strapline", s.cta.strapline],
      ["cta.line", s.cta.line],
      ["cta.label", s.cta.label],
      ["closing.lead", s.closing?.lead],
      ["closing.accent", s.closing?.accent],
      ["evidence.body", s.evidence?.body],
      ["testimonial.quote", s.testimonial?.quote],
      ["testimonial.attribution", s.testimonial?.attribution],
      ["evidenceSummary.headline", s.evidenceSummary?.headline],
      ["evidenceSummary.lead", s.evidenceSummary?.lead],
      ...(s.audiences ?? []).flatMap(
        (a, i): [string, string | undefined][] => [
          [`audiences.${i}.title`, a.title],
          [`audiences.${i}.body`, a.body],
        ],
      ),
    ];
    for (const [campo, texto] of campos) {
      assert.ok(
        !(texto ?? "").includes("—"),
        `${s.slug}.${campo} tem travessão: ${texto}`,
      );
    }
  }
});
