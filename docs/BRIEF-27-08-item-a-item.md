# Brief 27-08 — item a item, na ordem do email

Os 19 pontos do `docs/email-guilherme-27-08-2026.txt` na sequência em que ele escreveu, com o
estado de cada um. Atualizado em **2026-08-28**, depois da leva de rotas (commits `52f9101`,
`53ac926`, `587e9e2`).

> **O que mudou nesta atualização:** as cinco rotas que faltavam foram construídas (itens 3, 4, 8, 9,
> 12 e 15), o índice de Solutions passou a ser liderado pelo outcome (item 5), e o logo wall e as
> estatísticas viraram fonte única. Com isso o balde 📋 esvaziou — o que sobra do nosso lado é a
> migração em produção e o deploy. **Nada disso saiu da máquina ainda.**

**Legenda**

| | Significado |
|---|---|
| ✅ | Feito, no código, testado (`tsc` limpo, build passando) |
| 🎨 | Passado pro Guli — é composição, ele propõe no Figma e aprova com a CDNA |
| 🟠 | Depende da CDNA — conteúdo, assets ou aprovação |
| ⏳ | Código pronto, falta aplicar a migração no banco de produção do CMS |
| 📋 | Nosso, ainda não feito |

---

## 1. Homepage — nova hierarquia

**🎨 inteiro com o Guli.**

Chegou a ser implementado em 27/08 (headline "Keeping Leadership Real", a sub aprovada verbatim,
CEOs/CHROs/CLOs na primeira tela, e uma seção curta com os seis termos) e foi **revertido em 28/08**
por decisão nossa: o Guli propõe a hierarquia no Figma e aprova com eles, depois aplicamos.

O que ele precisa entregar: a headline nova em composição, o tratamento curto e visual dos
*real pressures / real politics / real choices / real judgement / real people / real consequences*,
e a primeira tela respondendo as três perguntas do email (que problema resolvemos, por que importa,
por que acreditar).

> A copy da sub veio aprovada no email ("working copy aprovada como direção"), então essa parte não
> depende de nova aprovação — só de entrar no layout dele.

## 2. Proof muito mais cedo

**🎨 com o Guli.**

O `90%` Chairman/CXO antes dos `18 years` chegou a ser feito e voltou junto com a reversão da home —
é a mesma reordenação. O princípio Claim → Proof → Explanation vale para a página inteira (logos,
depoimentos, métricas subindo), não só para a barra de números, e isso é composição.

## 3. Navegação final

**✅ As cinco rotas foram criadas.** Sete dos nove itens estão no menu; dois ficaram fora de
propósito.

✅ `lib/nav.ts`: "Home" explícito além da logo, `Solutions` → **Our Solutions**, `Our Book` →
**Our Books**. O menu hoje é
`Home | Our Identity | Our Solutions | Our Approach | Our Clients | Our Impact | Insights | Our Books`.

✅ Rotas criadas: `/our-identity`, `/our-team`, `/our-clients`, `/our-impact` e `/our-partnerships`.
O `/about` deixou de existir e virou 308 para `/our-identity`.

🟠 `Our Partnerships` e `Our Team` têm rota pronta e **seguem fora do menu** até o conteúdo chegar —
texto validado e as fotos, respectivamente. Publicar cada um agora é uma linha no `lib/nav.ts`.

⚠️ **Armadilha encontrada ao subir as rotas.** A IA nova recria quatro URLs do WordPress antigo —
`/our-identity`, `/our-team`, `/our-clients` e `/our-impact` — e as quatro estavam na lista de
redirects legados (spec 005). O `redirects()` do Next roda **antes** do filesystem, então as páginas
novas devolviam 308 em vez de renderizar, sem erro nenhum aparecer: o redirect "funciona". Pegamos no
smoke test local, não no type check. Corrigido — e virou ganho, porque essas URLs já estão indexadas
do site antigo e agora servem a página real em vez de âncora da home (`/our_team.html` → `/our-team`,
`/our-story` → `/our-identity#story`, `/clients` → `/our-clients`). Aviso registrado no
`specs/redirects-inventory.md` para não repetir.

**Duas perguntas em aberto** (registradas na Parte I do tracker): `Insights` e
`Start a Conversation` não aparecem na lista de nove itens. Insights abriga a biblioteca editorial e
os Reports & Resources, que o item 18 manda preservar; Start a Conversation é o CTA de captura de
lead. Assumimos omissão e mantivemos os dois.

## 4. Our Identity

**✅ rota · 🟠 conteúdo.**

✅ Rota `/our-identity` criada, com as quatro seções saindo do `/about` intactas e com as âncoras
preservadas (`#identity`, `#story`, `#values`, `#why`), mais um link para Our Team no fim da página.

🟠 O conteúdo de Purpose, Story, Values e "Why We Are Different" segue pendente da CDNA desde o ciclo
05-08. Os placeholders continuam placeholders **de propósito**: o email proíbe inventar identidade,
então a divisão *move* as seções, não as preenche.

O 5H entra aqui como referência de identidade; a explicação completa fica em Our Approach, como o
email pede.

## 5. Our Solutions — os 8 nomes confirmados

**Estrutura ✅ · nomes e texto 🟠 · visual 🎨**

✅ Os cinco blocos estão construídos e no ar no código: **The Challenge → The Outcome → How
Corporate DNA Helps → Evidence → Start a Conversation**. Campos `outcome`, `howWeHelp` e
`flagshipCaseSlug` criados no CMS e no site; o `body` antigo virou "further detail (optional)" com
aviso no editor de que o brief pede páginas radicalmente mais curtas.

🟠 Os oito nomes confirmados — ExCo / Top 150 · Culture Transformation · Talent Development ·
Manager Development · Women in Leadership · High Performing Teams · HRLT Effectiveness · Executive
Coaching — são **reautoria no CMS**. Hoje estão publicadas seis entradas antigas, incluindo
Inclusion & Diversity e Asian Talent Development, que o email aposenta como core Solutions.

✅ **O índice passou a ser liderado pelo outcome.** Cada card do `/solutions` abre pelo Outcome
autorado, com o nome do serviço virando o label acima e o problem statement como linha de apoio.
Solution que ainda não tem outcome continua liderando pelo nome — o índice melhora card a card
conforme a reautoria acontece, sem placeholder visível no meio do caminho.

🎨 Os *black boxes / coloured bars* em leitura moderna são do Guli.

## 6. Flagship case por Solution

**Campo ✅ · mapeamento 🟠**

✅ `flagshipCaseSlug` existe na Solution, com o link renderizando no bloco Evidence.

🟠 Falta a CDNA confirmar os dois **TBC**: Manager Development e Executive Coaching. Os outros seis
já estão definidos no email (Heineken, GSK ×2, Frasers Property, Shell, adidas).

Sobre "não usar industry dropdown como lógica principal": o filtro de cases já é dirigido pelas tags
do CMS, não por indústria fixa. Tirar indústria da frente é **re-taggear no CMS**, e depende da
taxonomia das oito Solutions entrar primeiro.

## 7. Case-study format

**✅ construído · preenchimento 🟠**

✅ A faixa está no ar, no topo do case, antes da história, exatamente nesta ordem:
**Countries → Participants/Leaders → Reach/Scale → Intervention → Impact**. Slot em branco não
renderiza, então case meio preenchido não fica com buraco.

✅ A regra das quotes está embutida no texto de ajuda do campo no CMS: precisa ser testimonial sobre
a Corporate DNA, não corporate quote genérica do cliente, e depende de aprovação antes de publicar.

✅ A faixa virou a **fonte canônica dos números do case**: o card usado em `/cases` e em
`/our-clients`, e a grade de resultados do `/our-impact`, leem o valor de *Impact* da faixa, com o
campo legado `measurableResult` como fallback. Antes liam só o legado — que está **vazio em todos os
cases publicados** —, então a grade do Our Impact renderizava vazia. Só apareceu quando apontamos o
site para um CMS local com dados de verdade.

🟠 Preencher os valores de cada case é trabalho de conteúdo. E vale repetir o que o email diz:
nenhum nome, logo, quote ou métrica vai para produção sem aprovação da CDNA.

## 8. Our Clients

**✅ rota · 🎨 visual**

✅ Rota `/our-clients` criada: o logo wall abrindo a página — credibilidade antes de explicação, como
o email pede — seguido de três flagship stories e do link para a biblioteca completa em `/cases`, que
continua existindo com seus filtros.

✅ O wall virou **fonte única** (`lib/logos.ts`), compartilhada com a home. Antes a lista morava
dentro do `app/page.tsx`; duas paredes mantidas à mão divergem, e o email pede o wall nos dois
lugares.

🎨 O tratamento visual do wall é do Guli.

## 9. Our Impact

**✅ rota · 🎨 visual · escopo a decidir**

✅ Rota `/our-impact` criada, separada de Our Clients: as estatísticas editáveis (também extraídas
para fonte única em `lib/stats.ts`, compartilhada com a home) e os resultados por engagement lidos da
faixa dos cases.

✅ **Sem depoimentos, de propósito.** O email manda substituir as quotes genéricas por testimonials
sobre a Corporate DNA; colocar as atuais numa página nova de prova amplificaria exatamente o que ele
critica. O bloco está reservado, esperando as aprovadas.

⚠️ **Ponto de escopo:** se "dashboards" significar visualização de dados viva (filtro por região,
indústria, ano), é build novo e está além do que foi orçado. Se for tratamento visual de números
estáticos, cabe. Precisa de definição.

## 10. Our Approach / 5H

**🎨 é o item mais dependente de design de todos.**

O 5H wheel e as 25 dimensions estão preservados (item 18 manda manter). O pedido aqui é
especificamente visual: fazer wheel, Inner/Outer Game, os cinco H e as 25 dimensions parecerem
**um sistema só**. O email cita o realce de um H sem explicação e a imagética de DNA-strand como
elementos que hoje parecem desconectados.

Sugestão de sequência: esse pode ser o **último** dos seis do Guli — é o mais isolado, não cascateia
para outras páginas.

## 11. Proprietary Frameworks & Diagnostics

**✅ feito.**

✅ O **Team Climate Assessment foi removido** do bloco "Proprietary frameworks and diagnostics we
own" em `app/approach/page.tsx`. Isso encerra uma pendência que estava marcada como "aguardando
confirmação da CDNA" desde 06/08 — o email respondeu.

🟠 A estrutura fica pronta para receber outros frameworks, mas só entra o que a CDNA validar. O
email é explícito: não inventar nomes nem claims.

## 12. Our Partnerships

**Tipo ✅ · rota ✅ · migração ⏳ · texto 🟠**

✅ Tipo de conteúdo `partnership` criado no CMS. O campo **"what this partnership enables for our
clients" é obrigatório** — o email diz "não queremos apenas logos ou announcements", então uma
entrada que não responde isso não valida.

✅ Rota `/our-partnerships` criada, renderizando do CMS — **nenhum parceiro hard-coded**, porque
o email diz que os nomes ainda serão validados. Enquanto não houver entrada publicada, a página fica
`noindex` e fora do sitemap, e volta para os dois sozinha no primeiro publish, sem mexer em código.

⏳ Depende da migração `0007` ser aplicada em produção.

🟠 Nomes e textos finais ainda serão validados, como o próprio email registra. Working examples:
Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin.

## 13. Client testimonial videos

**Tipo ✅ · migração ⏳ · remoção do compilado 🎨 · vídeos 🟠**

✅ Tipo `testimonial_video` criado, com `client` como campo de primeira classe — assim a
over-representação de um cliente, que o email manda evitar, aparece na listagem em vez de ficar
escondida no título.

🎨 A **remoção do vídeo compilado** chegou a ser feita e voltou com a reversão da home: tirá-lo muda
a forma da página, então entra na passada do Guli. *Isso empurra uma remoção que o email pedia
direta — está registrado no tracker para o Guilherme ver o motivo.*

🟠 Os vídeos em si: Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas. Os três novos (Dyson,
adidas, +1 TBC) o próprio email libera de bloquear o lançamento.

## 14. CorporateDNA video

**Pós-lançamento, por decisão do próprio email.**

A estrutura pode ser preparada agora; a produção do vídeo novo em torno de *Keeping Leadership Real*
não bloqueia 01/09.

## 15. Our Team

**✅ rota · 🟠 assets · 🎨 tratamento**

✅ Rota `/our-team` criada, com liderança (vinda do CMS), faculty, presença global e um slot
reservado para a foto de grupo. Fora do menu até os assets chegarem.

🟠 Depende de assets que não chegaram: foto de grupo dos seis (possivelmente na escada), retratos em
P&B e a lista final de quem aparece.

Nota do email que vale respeitar até os assets chegarem: **evitar tratamentos que façam as pessoas
parecerem artificialmente uniformes ou geradas por IA**.

## 16. Visual direction geral

**🎨 inteiro.**

Reduzir blocos longos de texto, scroll infinito, espaço em branco excessivo, layouts repetitivos e
aparência genérica. Aumentar dashboards, números, ícones, blocos divididos, estatísticas, logos,
fotografia humana, depoimentos, diagramas e IP proprietário.

⚠️ **Um ponto que precisa de decisão de vocês:** a copy que está no site hoje foi aprovada pela CDNA
no ciclo anterior. Cortar texto por conta própria contraria a regra do próprio brief. As opções são
reduzir só o respiro vertical (espaçamento, não conteúdo) ou levar o corte junto com a passada do
Guli, como decisão editorial conjunta.

## 17. Running ticker

**Tipo + componente ✅ · migração ⏳ · posição 🎨 · conteúdo 🟠**

✅ Tipo `ticker_item` no CMS (título, categoria, data, link) e o componente `RunningTicker`
construído e ligado ao CMS. O corte de **2023 em diante** e a ordenação por data do evento estão na
camada de dados, não no componente.

🎨 **Não está montado na página** — a posição *e o desenho* são do Guli. Chegou a ser cogitado
montar num lugar convencional para não segurar a entrega; decidido em 28/08 que não, justamente
porque o desenho é dele.

⚠️ **Consequência para o tracker do cliente:** a Wave 1 promete o ticker no dia 1º. Enquanto ele
depender do Guli, essa promessa não se sustenta — precisa sair da Wave 1 ou entrar condicionada a o
desenho chegar a tempo.

🟠 Conteúdo: awards, novas regiões, novos escritórios, novas parcerias e milestones.

## 18. O que deve ser PRESERVADO

**✅ verificado item a item.**

Arquitetura headless · CMS · segurança (time-trap e rate limit por IP no form) · Cloudflare/cutover ·
analytics e SEO · base responsiva · estatísticas editáveis · controle de aprovação de autoria ·
Reports & Resources · componentes de prova · multilingual readiness · componentes reutilizáveis ·
propriedade da infraestrutura · 5H e as 25 dimensions · awards · citação do Paul Polman.

Nada disso foi tocado.

## 19. Target e forma de execução

**✅ tracker atualizado.**

✅ `docs/Corporate DNA — Consolidated Implementation Status Update - 27_08.md`, no formato e com os
rótulos do de 10-08, dividido nos buckets que ele pediu.

**A proposta que está lá (Parte G):** tratar 01/09 como release de **arquitetura e conteúdo**, e a
expressão visual como um segundo marco. O motivo é aritmética de calendário, não esforço — para o
design entrar dia 1º, precisaríamos de telas **já aprovadas** na sexta 28, ou seja, o Guli
entregando no mesmo dia em que o brief chegou.

⚠️ **O tracker precisa de três correções antes de ir para eles.** Ficaram devendo desde que as rotas
subiram:

1. **O rótulo "Done" promete demais.** A legenda define *Done (live on beta)* como "construído,
   deployado e validado no beta". Nada da leva de 27–28/08 saiu da máquina: as duas branches são
   locais, sem push. Ou sobe, ou o rótulo vira "Built — deploying to beta".
2. **As três coleções novas não estão editáveis ainda.** O tracker diz "Done — ready for content",
   mas sem a migração `0007` em produção elas não aparecem no admin publicado. A CDNA não consegue
   cadastrar nada.
3. **A Wave 1 promete o ticker**, que depende do desenho do Guli (item 17).

E uma correção que já **melhorou**: a Wave 1 dizia que Our Identity, Our Clients e Our Impact
estariam no menu "com conteúdo real atrás de cada item" sem que existisse tarefa para construí-las.
Agora existem.

---

## Fora da lista do email — o que entrou junto em 28/08

Higiene que apareceu enquanto as rotas subiam. Nada disso ele pediu; tudo isso teria dado problema.

- **`/about` não estava no sitemap.** Página de navegação, indexável, fora do `app/sitemap.ts`. Virou
  discussão acadêmica quando o `/about` deixou de existir, mas as rotas novas entraram no sitemap
  desde o começo por causa disso.
- **`/interviews` era placeholder indexável**, linkado do CTA "Hear the complete interview" dos
  cases. Ganhou `noindex` até ter conteúdo.
- **O nome "Client Impact" sobrevivia em dois lugares** — no title do `/cases` e no breadcrumb do
  case — depois de o email aposentar a área. Viraram "Case Studies", que é o que a rota realmente é.
- **O CMS local estava travado** (dev server com os workers caindo, 500 em todos os endpoints de
  conteúdo). Foi o que fez o dropdown de Solutions sumir no local — nada a ver com a nav. Reiniciado.
  Vale saber: enquanto ele está fora, o site inteiro cai nos empty states **em silêncio**, que é o
  comportamento desenhado (FR-107) mas engana em QA.

---

## Resumo por dono

**✅ Já feito (18 entregas).** Leva 1 — *estrutura de conteúdo*: faixa de case (campos + render),
cinco blocos das Solutions, `flagshipCaseSlug`, três tipos novos no CMS, regra das quotes no editor,
remoção do Team Climate Assessment, renames da nav, componente do ticker, camada de leitura no site,
tracker, verificação do item 18 e a proposta de duas ondas. Leva 2 — *arquitetura de páginas*: **as
cinco rotas novas**, o **índice de Solutions liderado pelo outcome**, o **logo wall e as estatísticas
como fonte única**, os **redirects legados corrigidos**, o **sitemap** e a **faixa como fonte dos
números do case**.

**🎨 Com o Guli (6):** hierarquia da home (itens 1, 2), sistema visual das Solutions (5), linguagem
visual do 5H (10), Our Clients / Our Impact (8, 9), tratamento do time (15), direção visual geral
(16). Nos itens 8, 9 e 15 a estrutura já está no ar esperando ele — a passada vira aplicação, não
construção. Mais duas coisas que ficaram com ele por decisão de 28/08: **o ticker inteiro** (posição
e desenho, não só onde entra) e a remoção do vídeo compilado.

**🟠 Com a CDNA (9):** os dois flagship TBC, aprovação de nomes/logos/quotes/métricas, quotes que
sejam testimonials sobre a CDNA, texto das Partnerships, assets do time, conteúdo do ticker,
reautoria das oito Solutions, preenchimento da faixa dos cases, e **a lista de aprovação enviada em
06/08 que segue sem retorno**.

**📋 Nosso, ainda não feito:** ~~as cinco rotas novas, redirects e sitemap, logo wall como fonte
única, o índice de Solutions liderado pelo outcome~~ — **tudo feito em 28/08**. Sobra montar o ticker,
que está esperando o desenho do Guli, e as três correções do tracker (item 19).

**⏳ Duas janelas técnicas**, as duas aguardando o "pode":

1. Aplicar a migração `0007` no banco de produção do CMS. Três `ALTER TYPE ... ADD VALUE`, puramente
   aditivas — já rodou limpa no banco local. Enquanto não rodar, Partnerships, Ticker e Testimonial
   videos não aparecem no admin publicado.
2. **Push e deploy.** Nada saiu da máquina: `feat/brief-27-08-content-structure` (site) e
   `feat/brief-27-08-content-types` (CMS) estão locais, sem upstream. Enquanto isso, "feito" quer
   dizer feito aqui.

**Estado da verificação:** build limpo, as cinco rotas prerenderizam e respondem 200, todos os
redirects legados caem onde deveriam, e o caminho **com dados reais** foi conferido contra o CMS
local (6 solutions, 8 cases, 5 partnerships) — case rows, métricas do Our Impact, entradas de
Partnerships e o `noindex` saindo sozinho no primeiro publish. Falta a passada em homolog.

**Fora do brief, mas trava o lançamento:** o cutover do domínio. `corporatednaconsulting.com` ainda
serve o WordPress antigo; o que chamamos de produção é `consulting-dna-corporate-alpha.vercel.app`.
