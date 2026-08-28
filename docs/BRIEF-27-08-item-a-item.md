# Brief 27-08 — item a item, na ordem do email

Os 19 pontos do `docs/email-guilherme-27-08-2026.txt` na sequência em que ele escreveu, com o
estado de cada um. Atualizado em **2026-08-28**.

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

**Parcial: ✅ o que não exigia página nova, o resto depende de 📋 rotas + 🟠 conteúdo.**

✅ Feito em `lib/nav.ts`: "Home" explícito além da logo, `Solutions` → **Our Solutions**,
`Our Book` → **Our Books** (já no plural).

📋 Falta criar as rotas de `Our Identity`, `Our Partnerships`, `Our Clients`, `Our Impact` e
`Our Team`. Enquanto não existirem, deixamos fora do menu de propósito — item de nav que abre página
vazia é pior que item que ainda não chegou.

🟠 Três dessas dependem de conteúdo: Partnerships (texto não validado), Our Team (assets) e o split
Clients/Impact (aprovação de logos e métricas).

**Duas perguntas em aberto** (registradas na Parte I do tracker): `Insights` e
`Start a Conversation` não aparecem na lista de nove itens. Insights abriga a biblioteca editorial e
os Reports & Resources, que o item 18 manda preservar; Start a Conversation é o CTA de captura de
lead. Assumimos omissão e mantivemos os dois.

## 4. Our Identity

**📋 rota + 🟠 conteúdo.**

As seções de identidade já existem dentro do `/about` (`#identity`, `#story`, `#values`, `#why`) —
é promover para área própria. O conteúdo de Purpose, Story, Values e "Why We Are Different" segue
pendente da CDNA desde o ciclo 05-08, onde já estava marcado como placeholder.

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

🟠 Preencher os valores de cada case é trabalho de conteúdo. E vale repetir o que o email diz:
nenhum nome, logo, quote ou métrica vai para produção sem aprovação da CDNA.

## 8. Our Clients

**📋 rota · 🎨 visual**

O logo wall já existe como componente (`LogoMarquee`, hoje na home). Falta a página própria com o
wall de credibilidade seguido dos flagship client stories. O tratamento visual é do Guli.

## 9. Our Impact

**📋 rota · 🎨 visual · escopo a decidir**

Área separada de Our Clients, muito visual: números, quotes, proof blocks.

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

**Tipo ✅ · migração ⏳ · rota 📋 · texto 🟠**

✅ Tipo de conteúdo `partnership` criado no CMS. O campo **"what this partnership enables for our
clients" é obrigatório** — o email diz "não queremos apenas logos ou announcements", então uma
entrada que não responde isso não valida.

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

**📋 rota · 🟠 assets · 🎨 tratamento**

As seções de liderança e faculty já existem no `/about` — é promover para rota própria.

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

🎨 **Não está montado na página** — onde ele entra é decisão de layout.

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

---

## Resumo por dono

**✅ Já feito (12 entregas):** faixa de case (campos + render), cinco blocos das Solutions,
`flagshipCaseSlug`, três tipos novos no CMS, regra das quotes no editor, remoção do Team Climate
Assessment, renames da nav, componente do ticker, camada de leitura no site, tracker atualizado,
verificação do item 18, e a proposta de duas ondas.

**🎨 Com o Guli (6):** hierarquia da home (itens 1, 2), sistema visual das Solutions (5), linguagem
visual do 5H (10), Our Clients / Our Impact (8, 9), tratamento do time (15), direção visual geral
(16). Mais duas decisões de posição: onde entra o ticker e a remoção do vídeo compilado.

**🟠 Com a CDNA (9):** os dois flagship TBC, aprovação de nomes/logos/quotes/métricas, quotes que
sejam testimonials sobre a CDNA, texto das Partnerships, assets do time, conteúdo do ticker,
reautoria das oito Solutions, preenchimento da faixa dos cases, e **a lista de aprovação enviada em
06/08 que segue sem retorno**.

**📋 Nosso, ainda não feito:** as cinco rotas novas (Identity, Clients, Impact, Team, Partnerships),
redirects e sitemap, logo wall como fonte única, e o índice de Solutions liderado pelo outcome.

**⏳ Uma janela técnica:** aplicar a migração `0007` no banco de produção do CMS. Três
`ALTER TYPE ... ADD VALUE`, puramente aditivas — já rodou limpa no banco local. Enquanto não rodar,
Partnerships, Ticker e Testimonial videos não aparecem no admin publicado.

**Fora do brief, mas trava o lançamento:** o cutover do domínio. `corporatednaconsulting.com` ainda
serve o WordPress antigo; o que chamamos de produção é `consulting-dna-corporate-alpha.vercel.app`.
