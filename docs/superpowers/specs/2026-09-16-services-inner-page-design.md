# Página interna de serviço — desenho, 16/09/2026

**O que é:** o spec da reconstrução de `/services/[slug]` contra o template que a Maliha
mandou no drive.
**Referência visual:** `docs/meetings/drive-download-20260915T125509Z-1-001/4. Services/ExCo
Leadership Services Page.png`
**Fonte da copy:** `…/4. Services/WEBSITE SERVICE COPY.xlsx` (sete colunas: SERVICE, BANNER
STATEMENT, IMPACT OF THE WORK, WHAT CDNA DOES TO HELP, CASE STUDIES, TESTIMONIAL,
Strapline / CTA copy).
**Pedido:** daily de 16/09 — `docs/correcoes-maliha-call-16-09-2026.md`.
**Branch:** `feat/ajustes-clients-services`.

> A licença que ela deu, em letra, e que governa cada decisão abaixo:
> *"Use your initiative on what works and what doesn't work, but ultimately like that"* e
> *"we probably will use some of the layout of the other sections, the components, because if
> we don't do this, all pages will look different."*
> Ou seja: **o template é a referência, o sistema de componentes é o método.** Onde os dois
> discordam, a decisão está escrita aqui com o motivo.

---

## 1. O que já existe

`components/views/SolutionView.tsx` já orquestra a página em sete blocos, reordenados em
15-09. A espinha do template dela está de pé: herói, os dois blocos de texto, faixa de CTA,
evidência, citação condicional e "Related services".

O que **não** está:

1. A faixa de pilares sob o "How we help" (os cinco cartões com ícone do mockup).
2. A densidade de leitura — os blocos de texto são painéis de altura quase cheia.
3. A ênfase tipográfica que ela marcou na copy.
4. O arranjo da evidência (caso, imagem e depoimento na mesma faixa).

---

## 2. Decisões

| # | Decisão | Motivo |
| --- | --- | --- |
| 1 | **Híbrido**, não fidelidade literal | Mantém o painel de cor que é a assinatura das dez páginas (decisão de 12-09) e compra a densidade do mockup encolhendo os blocos. |
| 2 | Pilares **só com título**, extraídos da copy dela | A linha de descrição do mockup não existe em nenhum documento dela. Escrevê-la seria pôr texto nosso na boca do cliente, com a Rhea fora esta semana e sem quem aprove. |
| 3 | **Sem headline por bloco**; em vez dele, a ênfase dela | O headline do mockup não está no XLS. O negrito, sim: cada célula tem um run `<b/>` escolhido por ela, e hoje ele é descartado. |
| 4 | **CTA continua antes da evidência** (ordem de 15-09) | Pedido dela na call de 15-09, posterior e explícito. O template mostra o contrário; pedido recente ganha de mockup. Registrado para ninguém "corrigir" isso depois lendo só a imagem. |
| 5 | **Herói intocado** | `SolutionHero` serve sete rotas (team, books, insights, contact, services, service-tests e a landing). Ela não falou do herói hoje, e a densidade que falta está no meio da página, não no topo. |

---

## 3. Estrutura final

```
1   Herói                SolutionHero         sem mudança
2   Impact               SolutionSection      encolhe · ênfase
3   How we help          SolutionSection      encolhe · ênfase
3b  Pilares              SolutionPillars      NOVO
4   CTA vermelho         SolutionCta          sem mudança
5   Evidência            SolutionEvidence     reorganizado · absorve a citação
6   Related services     ServiceCard × 4      sem mudança
```

**A citação deixa de ser seção própria.** Hoje `ClientPerspective` (dentro de `SolutionView`)
é uma faixa inteira que existe em **um dos dez** serviços. No template dela a citação é a
terceira coluna da evidência, e é assim que passa a viver. Sem citação, a evidência fica em
duas colunas — o mesmo princípio de degradação que o bloco já aplica aos números.

---

## 4. Mudanças, arquivo por arquivo

### 4.1 `components/solutions/SolutionSection.tsx`

| | Hoje | Depois |
| --- | --- | --- |
| Altura (sem imagem) | `lg:min-h-[78svh]` | `lg:min-h-[55svh]` |
| Rótulo no painel | `lg:text-[68px]` | `lg:text-[48px]` |
| Corpo | `html` já montado por `paragraphs()` | idem, agora com `<strong>` |

A proporção 44/56 entre painel e texto **não muda**, nem os `tone`/`panelTone` — a regra de
cor registrada no próprio arquivo (dois painéis da mesma cor não podem antecipar a faixa
seguinte) continua valendo tal como está, porque a ordem dos blocos não muda.

### 4.2 `components/solutions/SolutionPillars.tsx` — novo

```tsx
export default function SolutionPillars({ items }: { items: string[] })
```

- Não renderiza nada com `items` vazio. Nenhum estado vazio, nenhum placeholder.
- Faixa clara (`bg-white`), largura `max-w-[1440px]`, mesma caixa das outras seções.
- Cada item: número em vermelho (`01`, `02`, …) sobre o rótulo. Sem ícone e sem descrição.
- Grade: 2 colunas no telefone, 3 no tablet, 5 ou 6 no desktop conforme a contagem —
  `sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]`, para que 4, 5 e 6 itens
  caibam sem sobra visível.
- Entra sob o bloco "How we help", dentro do mesmo `Reveal` do resto da página.

**Por que numeração e não ícone:** o projeto não tem biblioteca de ícones — os SVGs de hoje
são todos avulsos, desenhados para um uso. Os dez serviços somam ~50 conceitos distintos
("mastery labs", "sense-making", "decision rights"), e ícone genérico repetido lê como
template comprado. O número dá o marcador e o ritmo que o ícone daria, e não mente sobre nada.

### 4.3 `components/solutions/SolutionEvidence.tsx`

Passa a receber a citação e a imagem:

```tsx
{
  caseSlug?: string;
  caseTitle?: string;
  body?: string;
  facts?: ServiceFact[];
  testimonial?: ServiceTestimonial;   // NOVO
  imageUrl?: string;                  // NOVO — foto do caso, quando houver
}
```

Arranjo em três colunas no desktop, empilhado no telefone:

```
┌───────────────────────────┬──────────────┬────────────────┐
│ EVIDENCE                  │              │ TESTIMONIAL    │
│ HEINEKEN | Top 150 leaders│   imagem     │ "…"            │
│ corpo                     │   do caso    │ — Nome, Cargo  │
│ 150 · 18 · Enterprise wide│              │                │
│ Read the full story →     │              │                │
└───────────────────────────┴──────────────┴────────────────┘
```

Degradação, na ordem: sem `testimonial` → duas colunas; sem `imageUrl` → o texto e os números
ocupam a faixa como hoje; sem `caseSlug` → sem link, o bloco fecha no texto.

`ClientPerspective` sai de `SolutionView` junto com o `<section>` dele. A prop `testimonial`
do `Service` continua existindo e passa a alimentar a evidência.

### 4.4 `components/views/SolutionView.tsx`

Só a orquestração: insere `<SolutionPillars items={service.pillars} />` depois do "How we
help", passa `testimonial` e `imageUrl` para a evidência, e remove `ClientPerspective`.

---

## 5. Dados

### 5.1 Campos novos em `lib/services.ts`

```ts
export type Service = {
  …
  /** Os termos da frase de "what CDNA does to help", verbatim. 4 a 6 por serviço. */
  pillars?: string[];
};
```

A ênfase **não** vira campo: ela entra dentro de `outcome` e `howWeHelp`, marcada com
`**…**`, porque é parte do texto e não metadado. Um serviço sem `**` renderiza como hoje.

### 5.2 `paragraphs()` passa a converter a ênfase

A conversão roda **depois** do escape de HTML, não antes — senão o `<strong>` que acabamos de
inserir sairia escapado na tela:

```ts
// o escape que já está lá (& < >), e só depois a ênfase
.map((p) => escape(p).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"))
```

Asterisco solto (sem par) fica como está, visível. É a falha correta: aparece na revisão em
vez de sumir silenciosamente.

### 5.3 De onde vem o conteúdo

Do `WEBSITE SERVICE COPY.xlsx`, em uma passagem com script no scratchpad
(`xl/sharedStrings.xml` guarda cada célula como runs; o run com `<b/>` é a ênfase dela), e
**conferência manual dos dez**. A extração dos pilares não é mecânica: a enumeração em Culture
Transformation é *"leaders, teams, organisational rituals and the flow of work"*, que são
canais de ativação e não intervenções, e cada lista precisa de olho humano antes de virar
rótulo de cartão.

Referência das contagens já conferidas: ExCo 5 · Culture 4 · Talent Development 5 · Manager
Development 6 · Women in Leadership 4 · High Performing Teams 6 · HRLT 5 · Judgement in AI 6 ·
Executive Coaching 5 · Family Business 4.

### 5.4 Rota de preview do CMS

`serviceFromSolutionVM()` não ganha `pillars` — o CMS não tem o campo. O preview renderiza a
página sem a faixa, que é o comportamento correto para conteúdo que ainda vem de lá.

---

## 6. O que fica de fora, e por quê

| Item do mockup | Decisão |
| --- | --- |
| Migalha de pão (`Home / Services / ExCo / Top 150`) | **Não volta.** Rodou em 15-09 e saiu por pedido direto dela — `bbfe2b2`. |
| Ícones nos pilares | Sem biblioteca no projeto; ~50 conceitos distintos. A numeração faz o papel. |
| Eyebrow de categoria ("SENIOR LEADERSHIP") | Não existe no dado. Segue "Our Services". |
| Título com barra vermelha ("ExCo / Top 150") | O nome no nosso dado é "Top 150 Leadership Development". Trocar rótulo é decisão dela. |
| Headline por bloco | Ver decisão 3. |
| CTA no fim da página | Ver decisão 4. |

---

## 7. Como saber que ficou certo

O projeto não tinha suíte de testes. O plano liga uma mínima, sem dependência nova — o runner
do Node 22 (`node --test --experimental-strip-types`) rodando sobre `lib/services.ts`, que não
importa nada e por isso se testa direto. Ela cobre as funções puras e a integridade do dado; o
resto é olho. A verificação, na ordem:

1. `npm test` verde — a ênfase converte, nenhum `**` ficou aberto, os dez têm de 4 a 6 pilares.
2. `npm run build` verde — as dez páginas são estáticas e qualquer dado malformado quebra ali.
3. As **dez** páginas abertas no dev server, não uma. O que se olha em cada uma:
   - a faixa de pilares aparece com 4, 5 ou 6 itens e sem sobra na grade;
   - o trecho em negrito é o que está no XLS, e não outro;
   - a evidência degrada certo. Os dez cobrem todas as variações sozinhos: **cinco** não têm
     bloco de evidência nenhum, **quatro** têm evidência sem caso ligado, **um** (ExCo/
     Heineken) tem evidência com link, e **um** (Executive Coaching) tem citação. Não é
     preciso inventar dado de teste — é abrir as dez.
4. Telefone (dobra ~0,46:1): os blocos encolhidos não podem espremer o painel de cor a ponto
   de o rótulo quebrar em três linhas.
5. Comparação lado a lado com `ExCo Leadership Services Page.png` na `/services/top-150-
   leadership-development`, que é o serviço que o mockup desenha.

---

## 8. Perguntas abertas para a cliente

Nenhuma bloqueia a construção; todas cabem numa mensagem de WhatsApp hoje.

- **Os pilares ganham uma linha de descrição?** Se ela mandar, os cartões passam a ser os do
  mockup sem mudar o layout — é preencher um campo.
- **O nome do serviço é "ExCo / Top 150" ou "Top 150 Leadership Development"?** O mockup usa o
  primeiro, o XLS dela também, e o site usa o segundo.
- **A imagem da evidência** — a coluna do meio da faixa. O campo é um caminho em `public/` e
  nasce vazio nos dez; **não** vem da capa do caso no CMS, porque esta rota deixou de ler o CMS
  em 11-09 por decisão registrada no cabeçalho de `app/services/[slug]/page.tsx` (corrigido em
  16-09, ao escrever o plano). É asset a pedir a ela, junto com as imagens da grade.
