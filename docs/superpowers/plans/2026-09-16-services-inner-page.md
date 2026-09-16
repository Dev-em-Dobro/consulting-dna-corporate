# Página interna de serviço — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** reconstruir `/services/[slug]` contra o template `ExCo Leadership Services Page.png`,
mantendo a linguagem visual do site — blocos de texto mais densos com a ênfase que a cliente
marcou na planilha, uma faixa de pilares nova e a evidência reunindo caso, imagem e depoimento.

**Architecture:** `components/views/SolutionView.tsx` continua o orquestrador dos sete blocos.
Dois componentes existentes mudam (`SolutionSection`, `SolutionEvidence`), um nasce
(`SolutionPillars`) e um morre (`ClientPerspective`, que era local ao `SolutionView`). O dado
todo vive em `lib/services.ts`, que ganha um campo `pillars` e marcação `**…**` dentro dos dois
campos de texto.

**Tech Stack:** Next.js 16 (App Router, Server Components), React 19, Tailwind v4, TypeScript.
Testes com o runner nativo do Node 22 (`node --test` + `--experimental-strip-types`), sem
dependência nova.

**Spec:** `docs/superpowers/specs/2026-09-16-services-inner-page-design.md`
**Branch:** `feat/ajustes-clients-services`

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Ação |
| --- | --- | --- |
| `lib/services.ts` | Dado dos dez serviços + `paragraphs()` | Modificar — campo `pillars`, ênfase `**…**`, conversão em `paragraphs()` |
| `tests/services.test.ts` | Testes das funções puras e da integridade do dado | Criar |
| `tsconfig.json` | Config TS | Modificar — excluir `tests` do typecheck do build |
| `package.json` | Scripts | Modificar — script `test` |
| `components/solutions/SolutionPillars.tsx` | A faixa de pilares | Criar |
| `components/solutions/SolutionSection.tsx` | Os dois blocos de texto | Modificar — altura e corpo do rótulo |
| `components/solutions/SolutionEvidence.tsx` | A prova: caso, números, imagem, depoimento | Modificar — três colunas |
| `components/views/SolutionView.tsx` | Ordem dos blocos | Modificar — insere pilares, remove `ClientPerspective` |

**Não tocar:** `app/services/[slug]/page.tsx` (a rota deixou de ler o CMS em 11-09, e nada aqui
precisa que ela volte a ler — ver Task 7), `SolutionHero.tsx` (serve sete rotas — decisão 5 do
spec), `SolutionCta.tsx`, `ServiceCard.tsx`, `SolutionBoxList.tsx`.

---

### Task 1: Ligar o runner de teste e converter a ênfase em `paragraphs()`

**Files:**
- Create: `tests/services.test.ts`
- Modify: `lib/services.ts:404-414` (`paragraphs`)
- Modify: `tsconfig.json` (bloco `exclude`)
- Modify: `package.json` (bloco `scripts`)

O repositório não tem suíte de testes e não vamos instalar uma. O Node 22.13 roda TypeScript
com `--experimental-strip-types`, e `lib/services.ts` não importa nada — é dado puro mais duas
funções —, então dá para testá-lo direto, sem bundler e sem dependência nova.

- [ ] **Step 1: Escrever o teste que falha**

Criar `tests/services.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { paragraphs } from "../lib/services.ts";

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
```

- [ ] **Step 2: Excluir `tests` do typecheck do build**

Em `tsconfig.json`, trocar o bloco `exclude` por:

```json
  "exclude": [
    "node_modules",
    "tests"
  ]
```

Motivo: o `include` do projeto é `**/*.ts`, e `next build` reprovaria o `import … from
"../lib/services.ts"` (extensão `.ts` explícita, que o TS só aceita com
`allowImportingTsExtensions`). O Node precisa da extensão; o build não precisa do arquivo.

- [ ] **Step 3: Adicionar o script de teste**

Em `package.json`, dentro de `"scripts"`, depois de `"lint"`:

```json
    "test": "node --experimental-strip-types --test tests/*.test.ts"
```

- [ ] **Step 4: Rodar o teste e confirmar que falha**

```bash
npm test
```

Esperado: os dois primeiros testes falham com `AssertionError`, mostrando
`'<p>um **dois** três</p>'` no lugar do `<strong>`. O terceiro passa.

⚠️ Se em vez disso vier `SyntaxError: Cannot use import statement outside a module`, criar
`tests/package.json` com exatamente `{"type":"module"}` e rodar de novo. É o único ajuste
previsto; não instalar nada.

- [ ] **Step 5: Implementar**

Em `lib/services.ts`, substituir o corpo de `paragraphs()` por:

```ts
export function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) =>
      p
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        /* A ÊNFASE ENTRA DEPOIS DO ESCAPE, e a ordem não é gosto: invertida, o
           `<strong>` que acabamos de inserir seria escapado e sairia como texto
           na tela. O par `**…**` é a marcação da planilha dela — ver a caixa do
           campo `outcome` — e asterisco sem par fica visível de propósito, para
           aparecer na revisão em vez de sumir. */
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
    )
    .map((p) => `<p>${p}</p>`)
    .join("");
}
```

- [ ] **Step 6: Rodar o teste e confirmar que passa**

```bash
npm test
```

Esperado: `# pass 3` e `# fail 0`.

- [ ] **Step 7: Commit**

```bash
git add tests/services.test.ts tsconfig.json package.json lib/services.ts
git commit -m "feat(services): paragraphs() passa a converter a ênfase da planilha"
```

---

### Task 2: A ênfase da Maliha nos vinte campos de texto

**Files:**
- Modify: `lib/services.ts:151-394` (os dez objetos de `services`)
- Modify: `tests/services.test.ts`

Cada célula do `WEBSITE SERVICE COPY.xlsx` tem um trecho em negrito escolhido por ela
(`<b/>` no XML da planilha). As 21 strings abaixo foram extraídas do arquivo e **conferidas
uma a uma contra o texto que já está em `lib/services.ts`** — todas batem literalmente.

- [ ] **Step 1: Escrever o teste que falha**

Primeiro, trocar a linha de import do topo de `tests/services.test.ts` — o arquivo deve ter
**um só** import de `lib/services`:

```ts
import { paragraphs, services } from "../lib/services.ts";
```

Depois, acrescentar ao fim do arquivo:

```ts
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
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test
```

Esperado: `os dez serviços têm ênfase nos dois blocos de texto` falha em
`top-150-leadership-development: outcome sem ênfase`.

- [ ] **Step 3: Aplicar a marcação**

Em `lib/services.ts`, envolver cada trecho abaixo com `**…**`, **sem mudar nenhuma outra
palavra**. Buscar a string, colocar `**` antes e depois.

| # | Serviço | Campo | Trecho a envolver |
| --- | --- | --- | --- |
| 1 | top-150-leadership-development | outcome | `strategic alignment, decision quality and execution speed` |
| 2 | top-150-leadership-development | howWeHelp | `Inner Game and Outer Game of enterprise leadership` |
| 3 | top-150-leadership-development | howWeHelp | `“my function, my market, my priorities” to “our enterprise, our performance, our future.”` |
| 4 | culture-transformation | outcome | `transformation readiness, organisational adaptability and execution discipline` |
| 5 | culture-transformation | howWeHelp | `specific leadership behaviours, choices and habits` |
| 6 | talent-development | outcome | `bench strength, successor readiness and talent velocity` |
| 7 | talent-development | howWeHelp | `readiness, not simply potential` |
| 8 | manager-development | outcome | `execution discipline, team performance and leadership capacity` |
| 9 | manager-development | howWeHelp | `setting direction, making decisions, developing people, managing performance, navigating difficult conversations and leading through change` |
| 10 | women-in-leadership | outcome | `representation, successor readiness and retention of critical female talent` |
| 11 | women-in-leadership | howWeHelp | `individual and organisational level` |
| 12 | high-performing-teams | outcome | `decision quality, execution speed, collective accountability and cross-functional effectiveness` |
| 13 | high-performing-teams | howWeHelp | `trust, constructive challenge, decision rights, accountability, alignment and execution` |
| 14 | hrlt-effectiveness | outcome | `strategic influence, organisational connectivity and transformation readiness` |
| 15 | hrlt-effectiveness | howWeHelp | `collective enterprise leadership` |
| 16 | judgement-in-ai | outcome | `decision quality and decision velocity` |
| 17 | judgement-in-ai | howWeHelp | `critical thinking, judgement, curiosity, sense-making, ethical reasoning and decision-making under uncertainty` |
| 18 | executive-coaching | outcome | `leadership impact, decision quality, role readiness and performance under pressure` |
| 19 | executive-coaching | howWeHelp | `Inner Game and Outer Game` |
| 20 | family-business-consulting | outcome | `succession readiness, governance clarity, decision quality and organisational continuity` |
| 21 | family-business-consulting | howWeHelp | `family, ownership and business systems` |

Exemplo do resultado, no primeiro serviço:

```ts
    outcome:
      "A senior leadership community with greater **strategic alignment, decision quality and execution speed**. Leaders think enterprise first, operate horizontally and collectively own performance, transformation and the leadership pipeline.",
```

⚠️ **Atenção ao #19 e ao #2:** `Inner Game and Outer Game` (Executive Coaching) é prefixo de
`Inner Game and Outer Game of enterprise leadership` (ExCo). São serviços diferentes; aplicar
cada um no seu objeto, e não com busca-e-substitui global.

⚠️ **Fora de escopo:** as células de `Strapline / CTA copy` também têm negrito na planilha. A
faixa de CTA não muda nesta passada — o spec fixa a ênfase só em `outcome` e `howWeHelp`.

- [ ] **Step 4: Rodar o teste e o build**

```bash
npm test && npm run build
```

Esperado: `# fail 0` e build verde.

- [ ] **Step 5: Conferir na tela**

```bash
npm run dev
```

Abrir `http://localhost:3006/services/top-150-leadership-development` e confirmar que o trecho
em negrito é o da tabela e que **não há asterisco visível** em nenhum dos dois blocos.

- [ ] **Step 6: Commit**

```bash
git add lib/services.ts tests/services.test.ts
git commit -m "feat(services): o negrito que ela marcou na planilha chega aos dois blocos"
```

---

### Task 3: O campo `pillars` no dado

**Files:**
- Modify: `lib/services.ts` (tipo `Service` e os dez objetos)
- Modify: `tests/services.test.ts`

Os termos abaixo saem, palavra por palavra, da frase de *what CDNA does to help* de cada
serviço. Nada foi inventado; só foi promovido a rótulo o que ela já escreveu.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `tests/services.test.ts`:

```ts
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
      assert.equal(p[0], p[0].toUpperCase(), `${s.slug}: "${p}" não começa maiúsculo`);
    }
  }
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

```bash
npm test
```

Esperado: `top-150-leadership-development: 0 pilares (esperado 4 a 6)`.

- [ ] **Step 3: Acrescentar o campo ao tipo**

Em `lib/services.ts`, dentro de `export type Service = {`, logo depois de `howWeHelp: string;`:

```ts
  /**
   * Os termos da frase de "what CDNA does to help", promovidos a rótulo — o que
   * o template dela mostra como cinco cartões com ícone sob aquele bloco.
   *
   * ⚠️ SÃO PALAVRAS DELA, e a regra é essa: cada item aparece literalmente na
   * frase logo acima, na mesma ordem em que ela os escreveu. O mockup põe uma
   * linha de descrição em cada cartão ("Shared learning that builds perspective
   * and collective mindset") e ESSA linha não existe em documento nenhum do
   * cliente — por isso o cartão sai só com o rótulo. Quando ela mandar as
   * descrições, é acrescentar um campo; o layout não muda.
   *
   * Ausente ou vazio = a faixa não renderiza. Ver `SolutionPillars`.
   */
  pillars?: string[];
```

- [ ] **Step 4: Preencher os dez**

Acrescentar `pillars` a cada objeto, logo depois de `howWeHelp`:

```ts
// top-150-leadership-development
    pillars: [
      "Immersive experiences",
      "Coaching",
      "Real business challenges",
      "Peer learning",
      "Mastery labs",
    ],

// culture-transformation
    pillars: ["Leaders", "Teams", "Organisational rituals", "The flow of work"],

// talent-development
    pillars: [
      "Assessment",
      "Stretch experiences",
      "Coaching",
      "Business challenges",
      "Deliberate practice",
    ],

// manager-development
    pillars: [
      "Setting direction",
      "Making decisions",
      "Developing people",
      "Managing performance",
      "Navigating difficult conversations",
      "Leading through change",
    ],

// women-in-leadership
    pillars: [
      "Leadership identity",
      "Enterprise influence",
      "Strategic networks",
      "Readiness for bigger roles",
    ],

// high-performing-teams
    pillars: [
      "Trust",
      "Constructive challenge",
      "Decision rights",
      "Accountability",
      "Alignment",
      "Execution",
    ],

// hrlt-effectiveness
    pillars: [
      "Business judgement",
      "Strategic alignment",
      "Horizontal working",
      "Influence",
      "Execution",
    ],

// judgement-in-ai
    pillars: [
      "Critical thinking",
      "Judgement",
      "Curiosity",
      "Sense-making",
      "Ethical reasoning",
      "Decision-making under uncertainty",
    ],

// executive-coaching
    pillars: [
      "Complexity",
      "Transition",
      "Relationships",
      "Performance",
      "Leadership scale",
    ],

// family-business-consulting
    pillars: [
      "Governance",
      "Decision rights",
      "Leadership transitions",
      "Succession",
    ],
```

⚠️ **Duas escolhas de julgamento, registradas para quem revisar:**
- Em **ExCo** a frase dela diz só "coaching"; o cartão do mockup diz "Executive coaching". Fica
  `Coaching`, que é a palavra dela.
- Em **Culture Transformation** a enumeração é de canais ("we activate these through leaders,
  teams, organisational rituals and the flow of work"), não de intervenções. São esses os
  quatro, porque é o que responde "how we help" naquele serviço.

- [ ] **Step 5: Rodar o teste e o build**

```bash
npm test && npm run build
```

Esperado: `# fail 0` e build verde. Nada muda na tela ainda — o campo existe e ninguém o lê.

- [ ] **Step 6: Commit**

```bash
git add lib/services.ts tests/services.test.ts
git commit -m "feat(services): os pilares de cada serviço, tirados da frase dela"
```

---

### Task 4: `SolutionPillars` — a faixa nova

**Files:**
- Create: `components/solutions/SolutionPillars.tsx`
- Modify: `components/views/SolutionView.tsx`

- [ ] **Step 1: Criar o componente**

`components/solutions/SolutionPillars.tsx`:

```tsx
import Reveal from "@/components/Reveal";

/**
 * A faixa de pilares sob o bloco "How we help" — os cinco cartões com ícone do
 * template de 15-09 (`4. Services/ExCo Leadership Services Page.png`).
 *
 * ⚠️ SEM ÍCONE, E ISSO É DECISÃO, NÃO PENDÊNCIA. O projeto não tem biblioteca de
 * ícones: os SVGs de hoje são todos avulsos, desenhados para um uso. Os dez
 * serviços somam ~50 conceitos distintos ("mastery labs", "sense-making",
 * "decision rights"), e ícone genérico repetido nos dez lê como template
 * comprado. O NÚMERO faz o que o ícone faria — dar marcador e ritmo — e não
 * afirma nada sobre o conteúdo.
 *
 * ⚠️ `bg-paper` PARA CONTINUAR O BLOCO DE CIMA, que é o "How we help" e também é
 * paper. Aqui as duas faixas encostadas são o efeito desejado: a lista pertence
 * àquele bloco, não é uma seção nova. O corte vem depois, na faixa vermelha do
 * CTA.
 *
 * Lista vazia (ou ausente) não renderiza nada — sem slot tracejado e sem título
 * órfão, pela mesma régua do resto das páginas de serviço.
 */
export default function SolutionPillars({ items }: { items?: string[] }) {
  const pillars = (items ?? []).filter((p) => p.trim());
  if (pillars.length === 0) return null;

  return (
    <section className="bg-paper">
      {/* Sem padding no topo: o respiro já vem do `py-16 lg:py-28` da coluna de
          texto do bloco acima. Somar os dois abriria um buraco entre a frase e a
          lista que ela desdobra. */}
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {pillars.map((p, i) => (
            <div key={p} className="border-t border-ink/12 pt-5">
              <span className="block text-[13px] font-medium tracking-[1.3px] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-serif text-[19px] leading-[1.25] tracking-[-0.2px] text-ink md:text-[21px]">
                {p}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Ligar no `SolutionView`**

Em `components/views/SolutionView.tsx`, acrescentar o import junto dos outros:

```tsx
import SolutionPillars from "@/components/solutions/SolutionPillars";
```

E, logo depois do `<SolutionSection label="How we help" … />`, antes do comentário do CTA:

```tsx
      <SolutionPillars items={service.pillars} />
```

- [ ] **Step 3: Conferir na tela**

```bash
npm run dev
```

Abrir as três contagens diferentes e confirmar que a grade não deixa sobra feia:
- 4 itens: `http://localhost:3006/services/family-business-consulting`
- 5 itens: `http://localhost:3006/services/top-150-leadership-development`
- 6 itens: `http://localhost:3006/services/high-performing-teams`

E o telefone (DevTools, 390×844): a grade deve estar em duas colunas, com os rótulos longos
("Decision-making under uncertainty") quebrando sem estourar a caixa.

- [ ] **Step 4: Build**

```bash
npm run build
```

Esperado: verde, dez páginas estáticas.

- [ ] **Step 5: Commit**

```bash
git add components/solutions/SolutionPillars.tsx components/views/SolutionView.tsx
git commit -m "feat(services): a faixa de pilares sob o how we help"
```

---

### Task 5: Encolher os dois blocos de texto

**Files:**
- Modify: `components/solutions/SolutionSection.tsx:134` e `:173`

O mockup mostra a página inteira em pouco mais de uma tela e meia; hoje cada bloco de texto
come quase uma tela sozinho. A densidade vem daqui.

- [ ] **Step 1: Reduzir a altura**

Em `components/solutions/SolutionSection.tsx`, na `<div>` de classes da linha 134, trocar
`lg:min-h-[78svh]` por `lg:min-h-[55svh]`:

```tsx
        className={`mx-auto flex max-w-[1440px] flex-col lg:items-stretch ${image ? "lg:min-h-svh" : "lg:min-h-[55svh]"}  ${
          imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
```

⚠️ O `lg:min-h-svh` do caso **com imagem** não muda: nenhum serviço usa imagem neste bloco
hoje (decisão de 12-09), e mexer nele alteraria um caminho que ninguém está olhando.

- [ ] **Step 2: Reduzir o rótulo**

Na linha do `<p>` do painel (173), trocar `lg:text-[68px]` por `lg:text-[48px]`:

```tsx
            <p className="font-serif px-6 pb-12 pt-16 text-[38px] font-semibold leading-[1.02] tracking-[-1px] text-white md:px-10 md:text-[58px] lg:pb-16 lg:text-[48px]">
```

- [ ] **Step 3: Atualizar o comentário do arquivo**

O bloco de comentário logo acima do `return` explica a altura de tela cheia. Acrescentar ao fim
dele:

```
     ⚠️ 55svh DESDE 16-09, e era 78. O template de serviço que ela mandou mostra
     a página inteira em pouco mais de uma tela e meia, e com 78svh cada um
     destes dois blocos comia quase uma tela sozinho. O rótulo desceu junto (68
     → 48px) porque em painel mais baixo ele encostava nas bordas.
```

- [ ] **Step 4: Conferir na tela**

Com o dev server no ar, abrir `http://localhost:3006/services/executive-coaching` e comparar
com `docs/meetings/drive-download-20260915T125509Z-1-001/4. Services/ExCo Leadership Services
Page.png`. O que precisa ser verdade:
- os dois blocos cabem numa tela de 1440×900 sem rolar até o fim de cada um;
- o rótulo ("Impact", "How we help") continua em UMA linha no painel;
- no telefone, o painel de cor não espremeu o rótulo em três linhas.

- [ ] **Step 5: Build e commit**

```bash
npm run build
git add components/solutions/SolutionSection.tsx
git commit -m "fix(services): os blocos de texto encolhem para a densidade do template"
```

---

### Task 6: A evidência em três colunas, absorvendo a citação

**Files:**
- Modify: `components/solutions/SolutionEvidence.tsx`
- Modify: `components/views/SolutionView.tsx` (remover `ClientPerspective`)

Hoje a citação é uma faixa inteira que existe em **um** dos dez serviços. No template dela ela
é a terceira coluna da evidência, ao lado do caso e da imagem.

- [ ] **Step 1: Trocar as props e o layout**

Em `components/solutions/SolutionEvidence.tsx`:

1. Acrescentar aos imports do topo:

```tsx
import Image from "next/image";
import type { ServiceFact, ServiceTestimonial } from "@/lib/services";
```

(o arquivo já importa `ServiceFact`; juntar os dois no mesmo `import type`.)

2. Trocar a assinatura e todo o `return` por:

```tsx
export default function SolutionEvidence({
  caseSlug,
  caseTitle,
  body,
  facts,
  testimonial,
  imageUrl,
}: {
  caseSlug?: string;
  caseTitle?: string;
  body?: string;
  facts?: ServiceFact[];
  /**
   * A citação do cliente — TERCEIRA COLUNA desta faixa desde 16-09, e não mais
   * seção própria. Ela existe em um dos dez serviços, e uma faixa inteira para
   * um caso em dez é uma seção que nove páginas mostram vazia ou pulam. No
   * template dela a citação mora aqui, ao lado da prova a que se refere.
   */
  testimonial?: ServiceTestimonial;
  /** A capa do caso no CMS, quando existe. Sem ela a faixa fica sem a coluna do meio. */
  imageUrl?: string;
}) {
  const all = (facts ?? []).filter((f) => f.value?.trim());
  const impact = all.filter((f) => f.label === "Impact");
  const shown = [...impact, ...all.filter((f) => f.label !== "Impact")].slice(0, 4);

  /* AS TRÊS COLUNAS SE REAJUSTAM SOZINHAS, porque as quatro combinações existem
     no ar: cinco serviços não têm evidência nenhuma, quatro têm evidência sem
     caso ligado, um tem caso e um tem citação. */
  const hasImage = Boolean(imageUrl);
  const hasQuote = Boolean(testimonial);
  const caseSpan = hasImage || hasQuote ? "lg:col-span-5" : "lg:col-span-12";
  const imageSpan = hasQuote ? "lg:col-span-4" : "lg:col-span-7";
  const quoteSpan = hasImage ? "lg:col-span-3" : "lg:col-span-7";

  return (
    <section className="bg-ink text-white">
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
          Evidence
        </p>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={caseSpan}>
            {/* O nome do cliente como TEXTO, não como logo: os arquivos de
                `public/logos/` são as marcas em cores originais para fundo
                claro, e sobre escuro exigiriam uma plaqueta branca. */}
            <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.2px] text-white md:text-[38px]">
              {caseTitle ?? "The flagship client story"}
            </h2>

            {body && (
              <p className="mt-6 font-serif text-[17px] leading-[1.6] text-white/80 md:text-[18px]">
                {body}
              </p>
            )}

            {/* OS NÚMEROS PERDERAM O CARTÃO, 16-09. Eles eram quatro caixas com
                borda e gradiente numa faixa de largura inteira; numa coluna de
                5/12 as caixas ficariam estreitas demais para o valor e o rótulo.
                O template dela mostra os números em linha, separados por régua.

                ⚠️ O VERMELHO CONTINUA SENDO O `brand-light` E A CONTA CONTINUA
                VALENDO: sobre `ink`, o vermelho cheio dá 2,66:1 e reprova; o tom
                claro dá 4,20:1. Sem o gradiente do cartão o fundo é `ink` puro,
                o que só melhora a medida. */}
            {shown.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/12 pt-8">
                {shown.map((f, i) => (
                  <div key={i} className="min-w-[120px]">
                    {factIsMeasure(f) ? (
                      <Counter
                        value={f.value}
                        className="block font-semibold leading-[1.02] tracking-[-1.5px] text-brand-light text-[32px] md:text-[38px]"
                      />
                    ) : (
                      <div className="text-[19px] font-semibold leading-[1.25] tracking-[-0.3px] text-white md:text-[21px]">
                        {f.value}
                      </div>
                    )}
                    {f.label && (
                      <div className="mt-2 max-w-[200px] font-serif text-[14px] leading-[1.45] text-white/75">
                        {f.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {caseSlug && (
              <Link
                href={`/cases/${caseSlug}`}
                className="mt-10 inline-flex items-center gap-2 border-b border-brand-light/50 pb-1 text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light transition-colors hover:border-brand-light hover:text-white"
              >
                Read the client story <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          {imageUrl && (
            <div className={imageSpan}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {testimonial && (
            <figure className={`${quoteSpan} border-white/12 lg:border-l lg:pl-8`}>
              <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-brand-light">
                Testimonial
              </p>
              <blockquote className="mt-6 font-serif text-[19px] leading-[1.5] text-white md:text-[21px]">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-[13px] font-medium uppercase not-italic tracking-[1.3px] text-white/60">
                {testimonial.attribution}
              </figcaption>
            </figure>
          )}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Remover a seção de citação do `SolutionView`**

Em `components/views/SolutionView.tsx`:

1. Apagar a função `ClientPerspective` inteira (com o bloco de comentário dela) e a linha
   `{service.testimonial && <ClientPerspective testimonial={service.testimonial} />}`.
2. Apagar `type ServiceTestimonial` do import de `@/lib/services` (fica sem consumidor).
3. Passar a citação para a evidência:

```tsx
      {service.evidence && (
        <SolutionEvidence
          caseSlug={service.evidence.caseSlug}
          caseTitle={
            service.evidence.title
              ? `${service.evidence.client} — ${service.evidence.title}`
              : service.evidence.client
          }
          body={service.evidence.body}
          facts={service.evidence.facts}
          testimonial={service.testimonial}
        />
      )}
```

⚠️ **Executive Coaching tem os dois** — evidência e citação —, então a citação continua na
tela. Se um dia houver serviço com citação e **sem** evidência, a citação some: registrar isso
no comentário acima do bloco, porque é a consequência real de juntar as duas coisas.

4. Acrescentar esse aviso como comentário logo antes do `{service.evidence && (`:

```tsx
      {/* ⚠️ A CITAÇÃO AGORA DEPENDE DA EVIDÊNCIA. Ela é a terceira coluna desta
          faixa desde 16-09, então serviço com citação e sem evidência não
          mostraria a citação. Hoje não existe esse caso — o único com citação
          (Executive Coaching) também tem evidência —, e o dia em que existir, a
          decisão é dar a ele um bloco de evidência ou devolver a faixa própria. */}
```

- [ ] **Step 3: Conferir as quatro variações na tela**

```bash
npm run dev
```

| URL | O que tem de aparecer |
| --- | --- |
| `/services/top-150-leadership-development` | caso + números + link "Read the client story" (sem imagem, sem citação) |
| `/services/executive-coaching` | caso + números + **citação à direita** |
| `/services/culture-transformation` | caso + números, **sem link** (não tem `caseSlug`) |
| `/services/manager-development` | **nenhuma faixa de evidência** |

- [ ] **Step 4: Build**

```bash
npm run build
```

Esperado: verde. Se reclamar de `ServiceTestimonial` não usado em `SolutionView`, é o import do
passo 2.2 que ficou para trás.

- [ ] **Step 5: Commit**

```bash
git add components/solutions/SolutionEvidence.tsx components/views/SolutionView.tsx
git commit -m "feat(services): a evidência reúne caso, números e citação numa faixa só"
```

---

### Task 7: A coluna da imagem, pronta e desligada

**Files:**
- Modify: `lib/services.ts` (tipo `ServiceEvidence`)
- Modify: `components/views/SolutionView.tsx`

⚠️ **A ideia original desta tarefa era buscar a capa do caso no CMS, e ela está errada.** A
rota `app/services/[slug]/page.tsx` **deixou de ler o CMS em 11-09**, por decisão registrada no
cabeçalho do próprio arquivo: *"a rota virou estática de verdade — sem `revalidate`, sem fetch,
e `generateStaticParams` devolve os dez na hora do build em vez de perguntar ao CMS"*. Os dez
serviços do outline não existem no CMS. Reintroduzir um fetch ali por causa de uma imagem
desfaria essa decisão para nove páginas que nem imagem têm.

O caminho é o mesmo que o resto do arquivo já usa para imagem: um caminho em `public/`, no
dado. Hoje **nenhum serviço tem arquivo** — a foto da evidência é um dos assets que ela ficou de
mandar —, então a coluna nasce pronta e desligada.

- [ ] **Step 1: Acrescentar o campo ao tipo**

Em `lib/services.ts`, dentro de `export type ServiceEvidence = {`, depois de `facts`:

```ts
  /**
   * A foto da coluna do meio da faixa de evidência — o que o template dela
   * mostra ao lado dos números (a placa da HEINEKEN, no mockup do ExCo).
   *
   * ⏳ NENHUM DOS DEZ TEM ARQUIVO HOJE. É asset do cliente, pedido na daily de
   * 16-09 junto com as imagens da grade — ver `docs/correcoes-maliha-call-16-09-
   * 2026.md`. Sem ele a faixa fica em duas colunas, que é um dos quatro estados
   * que `SolutionEvidence` já monta.
   *
   * ⚠️ CAMINHO EM `public/`, E NÃO A CAPA DO CASO NO CMS. Esta rota deixou de
   * ler o CMS em 11-09 de propósito (ver o cabeçalho de `app/services/[slug]/
   * page.tsx`); buscar capa lá devolveria um fetch às dez páginas por causa de
   * uma imagem que uma delas teria.
   */
  image?: string;
```

- [ ] **Step 2: Ligar no `SolutionView`**

Em `components/views/SolutionView.tsx`, acrescentar a prop na chamada da evidência, junto com
`testimonial`:

```tsx
          imageUrl={service.evidence.image}
```

A assinatura de `SolutionView` **não muda** — nada de prop nova na view nem na rota, e
`app/preview/[type]/[id]/page.tsx` segue compilando sem tocar em nada.

- [ ] **Step 3: Conferir que nada mudou na tela**

```bash
npm run dev
```

`/services/top-150-leadership-development`: a faixa de evidência continua exatamente como no
fim da Task 6 — sem coluna do meio, sem buraco e sem quadro vazio. É isso que tem de acontecer:
o campo existe, ninguém preencheu.

Para provar que a coluna funciona antes de a foto chegar, preencher temporariamente
`image: "/logos/heineken.png"` no serviço `top-150-leadership-development`, recarregar, ver a
coluna aparecer em 4:5 — e **desfazer antes do commit**. Logo de cliente não é foto de caso.

- [ ] **Step 4: Build e commit**

```bash
npm run build
git add lib/services.ts components/views/SolutionView.tsx
git commit -m "feat(services): o campo da foto da evidência, pronto para quando ela chegar"
```

---

### Task 8: Verificação final e fechamento

**Files:**
- Modify: `docs/correcoes-maliha-call-16-09-2026.md` (marcar o item de Services)

- [ ] **Step 1: Suíte e build**

```bash
npm test && npm run build
```

Esperado: `# fail 0` e build verde com as dez rotas de `/services/[slug]` estáticas.

- [ ] **Step 2: As dez páginas, uma a uma**

```bash
npm run dev
```

Abrir as dez e conferir, em cada uma: ênfase no lugar certo e sem asterisco visível; faixa de
pilares com 4 a 6 itens sem sobra; evidência no estado correto; "Related services" com quatro
cards.

```
/services/top-150-leadership-development     /services/high-performing-teams
/services/culture-transformation             /services/hrlt-effectiveness
/services/talent-development                 /services/judgement-in-ai
/services/manager-development                /services/executive-coaching
/services/women-in-leadership                /services/family-business-consulting
```

- [ ] **Step 3: Telefone**

DevTools em 390×844, em `/services/judgement-in-ai` (o de rótulos mais longos): pilares em duas
colunas sem estourar, painéis de cor com o rótulo em uma linha, evidência empilhada na ordem
caso → imagem → citação.

- [ ] **Step 4: Lado a lado com o template**

Abrir `/services/top-150-leadership-development` ao lado de `docs/meetings/drive-download-
20260915T125509Z-1-001/4. Services/ExCo Leadership Services Page.png` e conferir que as
diferenças que sobraram são **só** as cinco registradas na §6 do spec (migalha de pão, ícones,
eyebrow de categoria, título com barra, ordem do CTA). Qualquer outra diferença é bug.

- [ ] **Step 5: Marcar o item no doc da daily**

Em `docs/correcoes-maliha-call-16-09-2026.md`, na seção "Services — páginas internas", trocar
`- [ ]` por `- [x]`.

- [ ] **Step 6: Commit**

```bash
git add docs/correcoes-maliha-call-16-09-2026.md
git commit -m "docs: a página interna de serviço sai da lista de hoje"
```

---

## Fora do escopo deste plano

Estão no doc da daily e não aqui: a Clients & Impact (`/our-clients`), a página de case study
(`/cases/[slug]`), os ajustes do Team (India, herói, LinkedIn) e a mensagem ao Guilherme/Guli.
Cada um vira o seu próprio plano.
