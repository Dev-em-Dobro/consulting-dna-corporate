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
