# Plano de implementação — design do Guli (29/08) sobre o brief de 27/08

> ⛔ **SUPERADO por `docs/RELATORIO-guli-29-08.md`.** Este documento foi escrito em cima de
> uma transcrição defeituosa da call (o trecho final era de outra reunião). Duas conclusões
> estão erradas: **C8** — a home não espera design do Guli, ele abriu mão do Figma na call; e
> **B1** — as 25 dimensões do 5H existem, estão em `docs/5H-wheel-25-dimensions.png`.
> Mantido só como histórico.

**Entradas deste plano**

| Fonte | Papel |
|---|---|
| `docs/email-guilherme-27-08-2026.txt` | **single source of truth** — 19 itens, vale por cima de tudo |
| `docs/transcricao-reuniao-guli-29-08-2026.md` | a call de 29/08 onde o Guli apresenta o Figma |
| `docs/design-guli-29-08/*.png` | os mocks (mobile) que saíram da call |
| `docs/FEITO-E-FALTA-brief-27-08.md` | o que já estava construído até 28/08 |

**Data:** 29/08 (sábado). **Target de lançamento:** 01/09 (terça).
**Restam:** sábado, domingo, segunda.

---

## Leitura de situação

O brief de 27/08 dividiu o trabalho em quatro baldes. Três já estavam resolvidos até 28/08:
estrutura de conteúdo, campos de CMS e as cinco rotas novas. O quarto — *"Requires Guli
design"* — era o único bloqueio real, e é exatamente o que a call de 29/08 destrava.

Ou seja: **a estrutura já existe e define os slots.** O que chega agora é tratamento visual
para caixas que já estão de pé. Isso é bom para o prazo e ruim para a improvisação — se o mock
pedir um campo que o CMS não tem, não há dado para preencher.

**O risco número um não é técnico.** Na própria call *(17:23)* o Guli levanta que o Guilherme
pode ter puxado essa direção sem alinhar com a Rhea, e combina tentar validar o layout com ele
antes *(19:35)*. Enquanto esse OK não vier, aplicar o design no site repete exatamente o erro
que fez a home ser revertida em 28/08. **Nada abaixo entra no site antes do OK do Guli.**

---

## Parte 1 — O que o design responde, item a item

| # | Item do brief | O mock responde? | Situação |
|---|---|---|---|
| 5 | Solutions — black boxes | ✅ `solutions-black-boxes.png` | pronto para implementar |
| 7 | Case-study format | ⚠️ `case-shell.png` | **não mostra a faixa de 5 fatos** — ver conflito C4 |
| 8 | Our Clients | ✅ `our-clients.png` | pronto |
| 9 | Our Impact | ✅ `our-impact.png` + `impact-stories.png` | pronto, com pendências de conteúdo |
| 10 | Our Approach / 5H | ✅ `5h-variantes.png` | **precisa das 25 dimensões** — ver bloqueio B1 |
| 16 | Direção visual geral | 🟡 parcial | redução de texto é conteúdo, não design (ver C7) |
| 1, 2 | Home + proof mais cedo | ❌ | **não veio nesta leva.** Segue revertida e pendente |
| 15 | Our Team | ❌ | segue esperando assets |
| 17 | Ticker | ❌ | componente pronto, falta o Guli dizer onde entra |

**Duas coisas que o brief pede e o design ainda não cobre: a home (itens 1 e 2) e o time
(item 15).** A home é a primeira prioridade que o Guilherme listou no e-mail *("Guli, gostaria
que você priorizasse principalmente: homepage visual hierarchy…")*. Vale cobrar na mesma
conversa em que o layout for validado.

---

## Parte 2 — Implementação

### Fase 1 — Solutions em black boxes *(item 5)*

**Arquivo:** `app/solutions/page.tsx`
**Componente novo:** `components/solutions/SolutionBoxList.tsx`

O que muda é só o invólucro. A lógica *outcome-led* (nome do serviço como label, promessa como
título, fallback para o nome quando não há `outcome`) já está no lugar e permanece intacta.

- grid branco de 2 colunas → lista vertical de caixas `bg-ink`
- seta vermelha à direita em cada item
- item ativo/hover: fundo `bg-brand` com **corte diagonal** à esquerda (`clip-path`)
- a diagonal é decorativa: não pode comer texto no breakpoint pequeno

**Também afeta:** o mesmo padrão é reaproveitável nos cards de cliente da Fase 3 — o Guli diz
explicitamente que é *"meio que a ideia dos black boxes também, numa outra disposição"* (07:30).
Construir como componente compartilhado, não duas vezes.

**Em aberto:** a ordem das 8 solutions no índice. Perguntado na call e não respondido *(05:39)*.
Hoje sai na ordem do CMS. **Sugestão:** manter a ordem do e-mail (ExCo/Top 150 → Culture
Transformation → Talent Development → Manager Development → Women in Leadership → High
Performing Teams → HRLT Effectiveness → Executive Coaching), que é a ordem que a CDNA confirmou.

**Tamanho:** pequeno. Meio dia.

---

### Fase 2 — Our Clients *(item 8)*

**Arquivo:** `app/our-clients/page.tsx` (já existe, com o sistema atual)

A ordem que o mock e o brief concordam: **wall → stories → footprint → fotos**.

| Bloco | Como construir | Reaproveita |
|---|---|---|
| Logo wall | duas fileiras contra-rolantes | `LogoMarquee` + `lib/logos.ts` — **já ligados nesta página** |
| Cards de cliente | banner escuro: logo à direita sobre faixa na cor da marca, nome + tags + `FIND OUT MORE` | componente da Fase 1 + `lib/logo-colors.ts` |
| Global footprint | **o mapa real, não a imagem do mock** — o Guli é explícito *(07:44)* | `LocationsMap` / `WorldCoverageMap` |
| Carrossel de fotos | as 3 fotos soltas do site antigo viram carrossel | `PhotoCarousel` **já existe** |

**Trabalho real:** só os cards de cliente. Wall, mapa e carrossel são recolocação de componentes
que já existem e já funcionam.

**Tamanho:** pequeno-médio. Um dia.

---

### Fase 3 — Our Impact *(item 9)*

**Arquivo:** `app/our-impact/page.tsx`

Sequência do mock: **números → client say → social impact → impact stories → evidence across
regions → awards**.

| Bloco | Situação |
|---|---|
| Faixa de números (18 / 36 / 75 / 90%) | ✅ `getSiteStats()` + `Counter` já ligados. Fundo vermelho é CSS. **Mas ver conflitos C1 e C2** |
| Our clients say | 🔴 **bloqueado.** O item 7 do brief exige testimonial *sobre a CorporateDNA*; as quotes atuais são corporate genéricas. A página nova não pode amplificar o que o brief manda corrigir |
| Our Social Impact | 🟡 texto vem do site antigo; carrossel de fotos reaproveita `PhotoCarousel` |
| Impact stories | 🟡 layout pronto; ver conflito C3 sobre o filtro |
| Evidence across regions | 🟡 dado existe por região; precisa da forma visual |
| Our Awards | ✅ `AwardsMentions.tsx` **já existe** — é mover, não construir |

> Sobre "dashboards" (item 9): se significa visualização de dados viva (filtrar por região,
> indústria, ano), isso é build novo e **fora do escopo acordado** — já sinalizado no tracker. Se
> significa tratamento visual forte de números estáticos, o mock resolve e cabe no prazo.

**Tamanho:** médio. Um a dois dias, dependendo de quanto do conteúdo bloqueado destravar.

---

### Fase 4 — O 5H *(item 10)* — a peça mais cara

**Arquivos:** `components/five-h/FiveHExplorer.tsx` (reescrita) e `five-h-data.tsx` (expansão)

É o único item que não é re-skin: é comportamento novo.

**Inversão do layout**
Card de conteúdo em cima, lista de seleção embaixo. O motivo é concreto — hoje o usuário clica
no tab e o painel que muda está fora do viewport *(01:00)*.

**Altura fixa, não negociável**
> *"Se esse conteúdo de cima começa a balançar, o botão se perde."* (01:35)

O card precisa de altura reservada pelo pior caso (a dimensão de texto mais longo), não pelo
conteúdo atual.

**Régua Inner/Outer Game**
Labels verticais à esquerda com linha de acompanhamento. Sólida no grupo do H selecionado,
pontilhada no outro — **e isso inverte quando o usuário seleciona Hands ou Habits** *(02:45)*.
Não é decoração estática.

**Rotação das 25 dimensões**
Cada H tem 5 dimensões que rotacionam sozinhas, com indicadores tipo *stories* do Instagram.

- **1s por dimensão em autoplay; 3s a partir da primeira interação** *(04:33)*
- a bolinha ativa tem o mesmo tamanho das demais *(03:52)* — é preenchimento que muda, não escala
- pausar no hover e ao sair do viewport (`IntersectionObserver`), senão é timer rodando à toa

**Acessibilidade — decisão a tomar.** O projeto tem precedente de ignorar
`prefers-reduced-motion` (commits `ba6a0bc`, `048c1d7`), mas ali o movimento é decorativo. Aqui
o autoplay **troca conteúdo**. Recomendo respeitar a preferência pausando a rotação e mantendo
os indicadores clicáveis — o conteúdo continua acessível, só não se move sozinho.

#### 🔴 Bloqueio B1 — as 25 dimensões não existem no código

`five-h-data.tsx` tem hoje **5 objetos com uma `description` cada**. O design precisa de
**25 pares (nome + texto)**. Sem isso o componente não tem o que rotacionar.

Onde procurar, em ordem: `docs/5H-wheel-25-dimensions.png` · `textos5h.txt` · o site antigo.
O `5h-variantes.png` confirma pelo menos uma: *Growth Mindset & Learning Agility*, sob HEAD.

**É IP proprietário da CDNA.** Extrair do site antigo é o caminho mais rápido, mas os textos
finais entram na lista de aprovação — o brief é explícito que nada vai a produção sem sign-off.

**Tamanho:** médio-grande. Dois dias com os dados em mãos; **indefinido sem eles**.

---

### Fase 5 — Case study *(item 7)*

**Boa notícia: quase nada a fazer.** O `CaseView.tsx` atual já bate com o `case-shell.png` —
eyebrow de tags em vermelho, título grande, faixa de fatos, intro, capa, bloco escuro de quote
com CTA vermelho (*"HEAR THE COMPLETE INTERVIEW"*).

**A fazer:** a seção *The 5H® Framework* dentro da página do case.
**A checar:** o conflito C4 abaixo.

**Tamanho:** pequeno.

---

## Parte 3 — Conflitos e decisões

Levar tudo isso junto na conversa de validação com o Guilherme.

**C1 — A ordem dos números contraria o item 2.**
No `our-impact.png` a sequência é *18 years → 36 countries → 75 faculty → 90% Chairman*. O item
2 do brief é explícito: *"O 90% Chairman/CXO-sponsored work deve aparecer antes de 18 years,
porque é mais diferenciador para nosso público."* **O mock inverte exatamente o que o brief
manda.** Resolução: mover o 90% para primeiro — é o que o cliente pediu por escrito.

**C2 — Os números seguem sem aprovação.**
O mock usa *18 years* e *26 countries*; o site usa *36 countries*. A lista de aprovação de
06/08 (95% / 26 countries / ten years / ©2021 contra 36 countries / 18 years) **nunca teve
retorno**. O próprio Guli levanta a dúvida na call *(11:12)*. Isso não é detalhe de design: são
os números que a página inteira existe para provar.

**C3 — O filtro do listing contraria o item 6.**
`impact-stories-filtro-aberto.png` mostra um dropdown com *ESG, Finance, empowerment, south
america, FMCG, Corporate*. O item 6 diz: *"Não usar industry dropdown como principal lógica de
descoberta dos cases."* Cabe se o filtro for secundário — a descoberta principal continuando por
Solution — mas do jeito que está no mock ele é a lógica principal da página.

**C4 — O case não abre com a faixa de 5 fatos.**
O item 7 exige que cada case comece por *Countries → Participants/Leaders → Reach/Scale →
Intervention → Impact*, e só então a história. O `case-shell.png` abre com headline + métrica
embutida. A faixa **já está construída e renderizando**. Perguntar: o mock omitiu ou substituiu?

**C5 — "DEVEMDOBRO" aparece como cliente nos mocks.**
Placeholder do Guli para preencher o layout. Óbvio, mas o brief é categórico: *"Nenhum nome,
logo, quote ou metric vai para production sem CDNA approval."* Não pode escapar.

**C6 — Fotos em preto e branco.**
O Guli discorda do pedido *("para mim parece uma coisa meio mortuária", 08:05)*. Provavelmente
não é conflito real: o P&B do item 15 é para os **retratos do time**, e o carrossel do Our
Clients é de **fotos de evento**. Vale confirmar para não virar retrabalho.

**C7 — Redução de texto (item 16) não é entregável de design.**
O Guli é direto: *"a redução geral do texto não está no nosso controle, é o conteúdo"* (18:05).
Bate com o que já estava registrado: a copy foi aprovada pela CDNA no ciclo anterior, e cortar
por conta própria contraria a regra do brief. **O que o design entrega é redução de scroll — que
não é a mesma coisa que redução de texto.** Vale dizer isso com todas as letras na resposta.

**C8 — A home não veio nesta leva.**
Itens 1 e 2 são a primeira prioridade da lista do Guilherme para o Guli. A home segue revertida
ao estado publicado desde 28/08, esperando proposta de Figma. **Esta é a maior lacuna em relação
ao target de 01/09.**

---

## Parte 4 — Prazo

**Restam sábado, domingo e segunda para uma terça.** E o design ainda não foi validado pelo
Guilherme — o Guli ia tentar marcar na tarde de 29/08.

Cabe até 01/09, se o OK vier a tempo:

- **Fase 1** — Solutions em black boxes
- **Fase 2** — Our Clients (a maior parte é recolocar componentes existentes)
- **Fase 5** — a seção 5H no case
- Faixa de números do Our Impact **com a ordem corrigida** (C1)
- Our Awards movido para o Our Impact

Não cabe, e é honesto dizer agora:

- **Fase 4 (5H)** — comportamento novo, e travado nas 25 dimensões (B1)
- **Home (itens 1 e 2)** — não há design ainda (C8)
- Qualquer bloco preso a conteúdo não aprovado: *client say*, partnerships, time, ticker

**Recomendação:** lançar 01/09 com Solutions, Our Clients e Our Impact no design novo; 5H e home
entram na semana seguinte. É melhor do que segurar tudo — e é exatamente a lógica de duas ondas
que já foi proposta na resposta ao brief.

---

## Parte 5 — Pendências operacionais que travam qualquer lançamento

Herdadas do ciclo anterior e **ainda abertas**:

- **Migração do CMS não rodou.** `db/migrations/0007_dashing_omega_flight.sql` — três
  `ALTER TYPE ... ADD VALUE`, puramente aditivas. Enquanto não rodar, `partnership`,
  `ticker_item` e `testimonial_video` **não aparecem no admin**. `npm run db:migrate` com
  `DIRECT_URL` na porta 5432 (não a 6543 pooled).
- **Deploy é manual:** `vercel --prod --scope impulse66 --yes`. Não há auto-deploy no push.
- **Autor do commit HEAD** tem que ser `impulseaisolutions@gmail.com` ou o time bloqueia.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** ainda é `5511999999999`. Pendente desde 24/07.
- **Cutover do domínio:** `corporatednaconsulting.com` ainda serve o WordPress antigo. Se
  "lançar em 01/09" significa virar o domínio, **isso não está em nenhum tracker**.

---

## Próximos passos, em ordem

1. **Guli valida o layout com o Guilherme** — inclusive C1, C3 e C4, que são divergências entre
   o mock e o e-mail. Sem isso, nada entra no site.
2. **Cobrar a home (C8)** na mesma conversa — é a prioridade nº 1 da lista dele.
3. **Pedir as 25 dimensões do 5H** (B1) e a lista de aprovação de 06/08 (C2), que está parada
   há três semanas.
4. **Rodar a migração 0007** — independe de design e destrava três tipos de conteúdo.
5. Com o OK: Fases 1, 2 e 5 em paralelo; Our Impact em seguida.
