# Como era e como ficou — branch `feat/correcoes-maliha-14-09`

**De onde vem:** a daily de 14-09 com a Maliha (42 pedidos, em
`docs/transcricao-maliha-14-09-2026.md` e `docs/correcoes-maliha-call-14-09-2026.md`) e o
pacote que ela subiu no Drive em 15-09 respondendo a lista de pendências
(`docs/meetings/MALIHA-ATUALIZACA0-15-09` e `docs/meetings/drive-download-*`).

**Base:** `e6abb5b` · **Branch:** `feat/correcoes-maliha-14-09` · **Commits:** 9
**Estado:** build limpo, `tsc` sem erros, 23 rotas verificadas em 200. **Sem deploy.**

Os números entre parênteses são os itens da transcrição.

---

## Índice

1. [Team](#1-team)
2. [About](#2-about)
3. [Services — landing](#3-services--landing)
4. [Services — página de dentro](#4-services--página-de-dentro)
5. [Home](#5-home)
6. [Marca — logo, no site inteiro](#6-marca--logo-no-site-inteiro)
7. [Arquivos novos em `public/`](#7-arquivos-novos-em-public)
8. [O que NÃO mudou, e por quê](#8-o-que-não-mudou-e-por-quê)

---

## 1. Team

### 1.1 (19) O bloco de global presence saiu

| | |
|---|---|
| **Como era** | Última seção da página: `<div id="presence">` com o `LocationsBlock` (mapa Leaflet, régua de cidades, carrossel e endereço), em `tone="paper"`. |
| **Como ficou** | Removido. A página fecha na DNA experience, que é `ink`, encostando no rodapé branco com o filete vermelho do `footerTopBorder`. |
| **Fonte** | *"Remove the global presence from this page."* Os escritórios ficam só no rodapé. |
| **Conferido antes de apagar** | A âncora `#presence` morre junto. Os quatro redirects legados do WordPress que chegam nesta página (`/our_team.html`, `/our_advisor.html`, `/our-advisors`, `/our-way/our-team-and-network`) apontam para `/team` **sem fragmento**, e nem o `lib/nav.ts` nem nenhum link do site cita `#presence`. |

### 1.2 (16) A quote saiu de baixo do nome e foi para o lado do retrato

| | |
|---|---|
| **Como era** | Card empilhado: retrato 4:5 → nome (22px) → `{cargo} · {região}` numa linha vermelha em caixa alta → quote com filete cinza à esquerda. |
| **Como ficou** | Card partido em dois: **retrato à esquerda**, **cartão de quote à direita** (rosa `#fcf2f0`, aspas vermelhas de 46px). Sob a foto: nome, cargo e região em três linhas, e o botão **"+"** à direita. |
| **Fonte** | O mockup que ela subiu no Drive às 12:19, durante a call (`docs/mockup-team-maliha-14-09-2026.png`). |
| **Continua 3 por linha** | O "um card por linha" foi **sugestão do Guli** na call, não pedido dela — ela respondeu apontando para o próprio mockup, que é 3 por linha, e o `CDNA_04_Team.docx` escreve "portrait grid, three across". |

Mudanças de grade que isso obrigou:

| | Antes | Depois |
|---|---|---|
| Colunas | `sm:grid-cols-2 lg:grid-cols-3` | `sm:grid-cols-2 min-[1440px]:grid-cols-3` |
| Vão vertical | `gap-y-14` (56px) | `gap-y-[72px]` |

**Por que a virada é em 1440 e não em `lg`:** em três colunas de uma página de 1440 cada
card tem 432px, que partidos em retrato + quote dão ≈210 e ≈222 — o mínimo em que a
serifa ainda faz ~30 caracteres por linha. A 1024 a mesma conta dá ≈185px e o texto
quebra em quatro palavras por linha. Abaixo de 1440 o card volta a ser empilhado, que é
o desenho anterior.

**O botão "+"** abre o perfil da pessoa em pop-up — ver §1.8, que é onde ele ganhou
função de verdade.

### 1.3 O retrato do Nitin Goil (15-09)

| | |
|---|---|
| **Como era** | Card sem foto, com as iniciais "NG" em serifa de 44px. |
| **Como ficou** | `public/team/nitin-goil.jpg`, 1024x1280. Fecha os seis cards da liderança. |
| **Recorte** | O arquivo dela é 1106x1422 (0,78:1), praticamente o 4:5 do quadro. O `cover` corta 39px, tirados de baixo (`position: top`) — a margem acima da cabeça já é a certa, o que sobra é ombro. |

### 1.4 A DNA experience tinha **três** vertentes e o documento pede **quatro**

| | |
|---|---|
| **Como era** | Três cartões: The DNA Experience, Trusted Relationships, Inclusion & Diversity. A quarta, **One DNA TEAM**, estava sendo consumida como a *frase de abertura* da seção (o `dnaLead`). |
| **Como ficou** | Quatro cartões. O `dnaLead` continua como título da seção — ele apresenta o princípio, o cartão diz o que ele é. Grade `md:grid-cols-2 lg:grid-cols-4`. |
| **Fonte** | `CDNA_04_Team.docx`, bloco 6, em letra: *"Type: **four strands**, moved here from the homepage: One DNA TEAM, The DNA Experience, Trusted Relationships, Inclusion & Diversity."* O mockup confirma: quatro colunas. |
| **Como passou** | A copy veio da home, que também mostra três cartões com a mesma frase de abertura. Na migração para cá ninguém notou que aqui a primeira vertente também tem de ser cartão. |

> ⚠️ **O corpo da primeira é curto e o das outras três é longo.** As três longas são a
> copy da home; para a primeira não existe versão longa em lugar nenhum, e a linha usada
> ("A community of curious, courageous and caring people.") é a do **mockup**.
>
> O documento aponta uma saída que não temos: *"FINAL Copy exists. See the About outline,
> **Home block 8**, for the condensed version."* O `CDNA_About_Page_Dev_Outline.docx` que
> veio no pacote de 15-09 cobre a navegação e a About, e **não tem esse bloco 8** — foi
> procurado. Quando a versão condensada chegar, as quatro ficam do mesmo tamanho.

### 1.5 Faltava a faixa de convite no fim da página

| | |
|---|---|
| **Como era** | A página terminava na DNA experience e caía direto no rodapé. **Não havia CTA nenhum.** |
| **Como ficou** | `<SolutionCta>` — rótulo "Let's talk", **"Ready to make leadership real?"**, "We partner with organisations to unlock real people, cultures and performance." e o botão **"Get in touch"**. |
| **Fonte** | O mockup termina exatamente assim. A falta já estava registrada: a análise do mockup no doc de correções (§4.1) lista, entre o que o desenho traz e a página não tem, *"um CTA final ('LET'S TALK')"*. |
| **Não está no Word** | O `CDNA_04_Team.docx` fecha a página em seis blocos e o sexto é a DNA experience. Quem pede esta faixa é o mockup, e a copy é dele. |

> ⚠️ **Sem o skyline de fundo que o mockup mostra.** O `SolutionCta` é `bg-brand` chapado
> e é a faixa que as dez páginas de serviço usam. Pôr fotografia só nesta criaria duas
> faixas de convite diferentes no mesmo site — e o skyline que temos já é o herói da
> /about e da /services, então apareceria uma terceira vez. Se ela pedir a versão com
> foto, é prop nova e vale para todas.

### 1.6 ⛔ A migalha de pão foi construída e removida no mesmo dia

Ela chegou a rodar na /team ("Home / Team") e nas dez páginas de serviço, tirada dos
mockups do pacote — o template de serviço abre com "Home / Services / ExCo / Top 150", o
de Team com "Home / Team" e o de Clients & Impact com "Home / Clients & Impact".

**Saiu a pedido, no mesmo 15-09.** A prop `trail` do `SolutionHero` saiu junto, em vez de
ficar sem uso esperando; a montagem inteira está no histórico e é copiar de volta. Ela não
é pedido escrito em nenhum `.docx` — só aparece nos desenhos —, então se ela pedir ao
revisar, volta.

Fica registrada uma correção de premissa que a construção expôs, porque ela vale para
qualquer trilha futura: a primeira versão assumiu que migalha era "só das páginas de
dentro", e os mockups de Team e de Clients & Impact desmentem — as duas são rotas de
primeiro nível e têm trilha no desenho dela.

### 1.7 A foto do time na escada (item 4 + item 5 de 15-09)

| | |
|---|---|
| **Como era** | Bloco 4 era um `<ImagePlaceholder label="Group photograph">` de largura cheia, `aspect-[4/3] sm:aspect-[16/9]`, sobre branco. |
| **Como ficou** | Faixa escura em duas colunas: a foto em 2:3 à esquerda, e à direita o rótulo **"ONE TEAM"** com **"Different perspectives. A shared purpose."** e um filete vermelho embaixo. |
| **Por que o slot mudou** | O slot de 16:9 foi dimensionado para "uma foto de seis pessoas lado a lado". A que veio tem as seis em **três degraus**: é 1066x1600, retrato 2:3. Numa faixa 16:9 de largura cheia sobrariam ~40% da altura, cortando a fileira de cima e a de baixo. |
| **De onde veio a composição** | Do próprio mockup dela — foto de um lado, "ONE TEAM" do outro. Ali a foto é paisagem e ocupa dois terços; aqui ela é retrato, então as proporções invertem. |

> ⚠️ **A copy "Different perspectives. A shared purpose." é do MOCKUP, não do Word.** O
> `CDNA_04_Team.docx` para o bloco 4 só diz "HOLD, slot 04". Se o cliente revisar o texto
> da página contra o documento, estas duas linhas não vão estar lá.

> ⚠️ **A mesma foto roda na /about**, em recorte diferente. O documento avisa que repetir
> a fotografia "is visible", e isso continua sendo verdade — foi decisão consciente de
> preencher os dois slots agora. A segunda foto continua valendo a pena pedir.

### 1.8 O botão "+" abre o perfil em pop-up

| | |
|---|---|
| **Como era** | O "+" cortava a quote em 8 linhas e abria o resto. Só aparecia quando havia texto cortado, medido no tamanho real (`scrollHeight > clientHeight`). |
| **Como ficou** | O "+" abre o **perfil da pessoa em pop-up** — foto, nome, cargo, bio e os campos estruturados (valores, forças, especialidades, histórico, clientes, idiomas, credenciais). A quote deixou de ser cortada. |
| **Fonte** | `CDNA_04_Team.docx`, bloco 2, em letra: *"portrait grid, three across. Name, role, region, **short bio on click or hover**."* O botão que o mockup desenha sob a foto é esse gesto. |

**A bio estava no CMS o tempo todo**, nos mesmos registros que a home lia — o que faltava
era ligar as duas fontes. Os seis têm entrada, com bio de 1,1k a 3,8k caracteres:

| slug no CMS | bio | campos |
|---|---|---|
| `rhea-leckie` | 3.824 car. | bio, name, role, linkedin, photo |
| `mike-jackson` | 1.441 car. | + valores, forças |
| `jon-paul-pritchard` | 1.329 car. | + valores, forças |
| `nitin-goil` | 1.114 car. | + região |

Três decisões dentro disso:

- **O `PersonModal` saiu do `PeopleGrid`** e virou componente próprio. Ele era privado da
  grade da home; copiá-lo para a /team criaria dois perfis de pessoa no mesmo site, que
  divergem na primeira correção feita de um lado só. O `PeopleGrid` ficou só com a grade e
  importa o resto — continua rodando na `/home-v1`, na `/home-v3` e na
  `/services/leadership`.
- **Casado por slug, não por nome.** O CMS grava `"Jon-Paul (JP) Pritchard"` contra o
  nosso `"Jon Paul Pritchard"`, e `"Nitin Goil "` com espaço no fim. Normalizar e casar
  por nome funcionaria hoje e quebraria sem aviso na primeira edição feita pelo admin.
  Daí o campo `cmsSlug` no dado e o `slug` passando a sair do `PersonVM`.
- **A /team voltou a tocar o CMS, e só por isto.** O texto da página continua todo em
  `lib/team.ts` — nome, cargo, região e a quote do bloco 2 —, porque o CMS não tem campo
  de citação em `person`. **Se o CMS não responder**, `getPeople()` devolve lista vazia, o
  `find` devolve `undefined` e os cards saem sem o "+": nada do que se **lê** na página
  depende dessa chamada.

**Por que a quote deixou de ser cortada:** o corte em 8 linhas existia porque o "+" abria
a própria quote — era o único trabalho honesto que havia para o botão enquanto a bio não
estava localizada. Com o botão apontando para o perfil, um corte sem gesto para desfazê-lo
esconderia conteúdo. O custo é que as quotes vão de 140 a 271 caracteres, então o cartão
mais alto da fileira estica os outros dois — que é o que o mockup mostra.

> ⚠️ **Não confundir com o bloco 3.** A bio do CMS é o **perfil**. O que o documento marca
> como HOLD é uma frase **nova** por pessoa, resposta a *"what do you believe about
> leadership that most people in this industry get wrong?"*, em até 200 caracteres. São
> conteúdos diferentes, e o segundo continua sem existir — ver §8.5.

---

## 2. About

### 2.1 (2) Os cinco valores viraram caixas — **e esta é uma correção de rota**

| | |
|---|---|
| **Como era** | Cada valor era uma **fileira de largura cheia**: ícone e título na coluna da esquerda (`5fr`), corpo na da direita (`7fr`), cinco delas empilhadas com régua vermelha entre cada. |
| **Como ficou** | Cada valor é uma **coluna**: ícone em cima, nome, corpo embaixo. As cinco lado a lado (`sm:grid-cols-2 lg:grid-cols-5`), com o filete vermelho no topo de cada. Título de 24/26px voltou a 20px, porque a coluna caiu de ~440 para ~250px. |
| **Fonte** | *"Can we make these like vertical by any chance — so you know, currently they're in horizontals — can we have, is it five, five little boxes with the text underneath."* |

> ⚠️ **O doc de correções tinha ancorado este pedido no bloco errado** — nos tiles de
> região (`lg:grid-cols-5`). A primeira rodada mexeu ali e foi desfeita.
>
> **Como se resolveu:** na fita ela diz "can we make **these** vertical" e, na frase
> seguinte, *"and then **THIS ONE**, can we make the map a tiny bit smaller"*. Logo
> "these" é o bloco **imediatamente antes do mapa**. Na /about isso é a lista de valores
> — a única coisa da página que de fato corria em fileiras horizontais. Os tiles de
> região vêm **depois** do mapa e já eram cinco em linha com o texto embaixo, exatamente
> como o mockup dela de 08-09 desenha.
>
> **Os tiles de região voltaram ao que eram.** Nada mudou neles.

### 2.2 (3) O mapa encolheu e o texto foi para o lado dele

| | |
|---|---|
| **Como era** | Três irmãos empilhados em largura cheia: rótulo "WHERE WE WORK." + parágrafo, o `WorldCoverageMap` como seção própria (container de 1200px) e os escritórios. |
| **Como ficou** | Rótulo continua no topo, e abaixo dele um grid de duas colunas: **parágrafo à esquerda (4fr), mapa à direita (8fr)**, dentro do container de 1440px da própria seção. O mapa passou de ~1120 para ~875px de largura numa tela de 1440. |
| **Fonte** | *"Can we make the map just a tiny bit smaller and have the text on the left hand side? Where we work can remain at the top, but the body of the text, with headquarters in London, etc."* |
| **O lado** | Era a decisão travada da §3 do doc de correções — a fala tinha "left hand side" e "we can have that on the right" em sequência. **Confirmado em 15-09: texto à esquerda, mapa à direita.** |

Duas coisas que a troca exigiu:

- **Prop `bare` no `WorldCoverageMap`.** Devolve só o conteúdo, sem a `<section>`, sem o
  container de 1200px e sem padding. Sem ela o mapa abriria uma segunda faixa dentro da
  coluna da direita e o SVG pararia de acompanhar a largura dela. Desligada por padrão —
  as três homes renderizam o mapa como seção inteira e não mudaram. A âncora `#coverage`
  sai do DOM da /about junto com a seção; nenhum link do site a cita (os overrides de
  `[&_#coverage_h2]` do wrapper da home são da home).
- **A quebra é `xl` (1280px), não `lg`.** Os rótulos das cidades são 8,5 unidades de um
  viewBox de 880 e encolhem com a coluna: a 1024px cairiam a ~6px renderizados. A 1280px
  ficam em ~7,4px e a 1440px em ~8,4px. Abaixo de 1280 o bloco empilha e o mapa volta à
  largura cheia, que é o layout já aprovado.

### 2.3 (4) A lista de escritórios virou o carrossel de endereços, sem mapa

| | |
|---|---|
| **Como era** | Cinco fileiras estáticas de largura cheia — cidade em serifa de 38px, endereço, telefone e e-mail em três colunas, separadas por filete. |
| **Como ficou** | O `LocationsBlock` da home, com `showMap={false}`: régua de cidades clicável, carrossel e o endereço da cidade ativa. |
| **Fonte** | *"I did like on the original landing page that it was scrolling for the addresses — if we can have just the bottom bit, without the map."* |

Duas coisas que essa troca **não** custou, e que custariam se feita ingenuamente:

- **Os dados continuam sendo os do documento do cliente.** O `OFFICES` da /about **não é**
  `lib/offices.ts` — três registros divergem do que está no ar (endereço e telefone de
  Singapura, telefone de Dubai, telefone de Miami) e ninguém confirmou qual versão vale.
  O bloco recebe a lista **da própria página** via prop; só `coords`/`zoom`, que são do
  mapa e não renderizam, vêm da entrada de mesma cidade em `lib/offices.ts`.
- **O e-mail por cidade não se perdeu.** A lista publicava cidade, endereço, telefone E
  e-mail; o painel do carrossel sempre mostrou só os três primeiros. Entrou a prop
  `showEmail`, desligada por padrão — a home, a /our-clients e a /home-v3 seguem sem.

**`showMap={false}` também é a resposta ao item 33:** o mapa da /about é o
`WorldCoverageMap` logo acima. Um segundo mapa, do Leaflet, a 400px de distância, seria
exatamente a duplicação que ela apontou na home. Sem ele, o Leaflet nem entra no bundle
desta página.

### 2.4 A foto do time (item 5 de 15-09)

| | |
|---|---|
| **Como era** | `<ImagePlaceholder label="CDNA team photograph">` em `aspect-[3/2]`, esperando desde 09-09 a foto do "approved Our Identity slide", que nunca chegou. |
| **Como ficou** | A foto da escada em **4:5**. |
| **Por que 4:5 e não 3:2** | O arquivo é 1066x1600 (2:3). Um 3:2 tirado dali sobra 711px de altura — o corte comeria as cabeças da fileira de cima e os pés da de baixo. 4:5 tira 267px, metade do forro e metade do piso, e não encosta em ninguém. |

### 2.5 O skyline sem a recompressão do WhatsApp

| | |
|---|---|
| **Como era** | `public/about-hero.jpeg` — 229 KB de JPEG que o WhatsApp já havia recomprimido: céu em blocos, pontos da hélice empastados. |
| **Como ficou** | `public/skyline-dna.jpg` — o PNG de origem que veio na pasta About (2,2 MB), com **uma** compressão só, em q90. |
| **Nome novo de propósito** | Trocar os bytes mantendo a URL não adianta contra o cache longo do `/_next/image`. A `about-hero.jpeg` fica no repositório ao lado, para comparar e para voltar atrás numa linha. |

> ⚠️ **Não resolve a resolução.** O PNG tem os mesmos 1373x1145 do arquivo antigo — é a
> mesma imagem sem a segunda compressão, não uma maior. Num monitor de 1920 o upscale
> segue em 1,4x. O arquivo em largura de dobra continua pendente com ela.

---

## 3. Services — landing

### 3.1 (8 + 9) O herói trocou de imagem

| | |
|---|---|
| **Como era** | A `service-hero-fallback.jpg`, foto padrão compartilhada por onze rotas — e é nela que estão as pessoas de olhos fechados. |
| **Como ficou** | O skyline (`skyline-dna.jpg`), com `imagePosition="object-[50%_38%]"`. |
| **Fonte** | (8) *"Definitely need to change this image because some of the girls have their eyes closed."* (9) *"I'm thinking with the services, if we use the same backdrop as we did the skyline again."* |
| **Escopo** | Só esta página. A padrão continua servindo as outras dez rotas — trocar o fallback mudaria a /team, a /books e as oito de serviço sem pedido nenhum. |
| **Enquadramento** | Centrado, o corte tirava 19% de cima e a ponta do Burj ficava rente à borda superior. Subir para 38% devolve céu acima das torres, que é onde o `h1` mora. |

### 3.2 (10 + 12) A grade

| | Antes | Depois |
|---|---|---|
| Colunas | `grid-cols-1 lg:grid-cols-2` | `grid-cols-1 lg:grid-cols-2 **xl:grid-cols-4**` |
| Últimos dois | cards normais | `xl:col-span-2` — **largura dupla** |
| Conteúdo do card | título + banner statement + "Explore →" | **imagem 16:10** + **número 01–10** + título + banner statement + **"Learn more →"** |

**"The last two at the bottom"** não eram dois cards estreitos sobrando numa fileira de
quatro vagas: no desenho que chegou em 15-09 (`4. Services/Example.png`) eles **dividem a
fileira ao meio**. 4 + 4 + (2×2) fecha as três fileiras cheias.

**As quatro colunas só valem de `xl` para cima.** A 1024 cada card teria 214px e a banner
statement (a mais longa tem 78 caracteres) quebraria em quatro palavras por linha. A 1280
são 278px. Até lá a página segue como estava: uma coluna no telefone e no tablet, duas a
partir de 1024.

**Tipografia com degrau `xl:` para baixo**, porque o card encolheu de ~660 para ~278px:
padding 40→28px, título 27→21px, corpo 17→15px. E o "Learn more" ganhou `mt-auto`, para
que os quatro da fileira caiam na mesma linha mesmo com títulos de uma e de três linhas.

**As imagens dos cards.** Ela respondeu *"use generic for now"*. Seis dos dez recebem as
banners fotográficas do site **antigo** (`public/solutions-banners/`), recortadas em
16:10 — material da própria CDNA, já publicado, não banco de imagem. Os quatro que o site
velho não tinha (Manager Development, HRLT Effectiveness, Judgement in AI, Family Business
Consulting) caem no **campo de cor** com o nome do serviço, que é o mesmo recurso das
páginas de dentro desde 12-09.

> ⚠️ O arquivo do Top 150 é `diversification.png` do acervo antigo — um conselho ao redor
> da mesa com a cidade atrás. O **nome** do arquivo fala de inclusão, o **conteúdo** serve
> a uma jornada de ExCo. Fica escrito para ninguém concluir mais tarde que houve troca de
> imagem entre serviços.

### 3.3 (15) Os dois logos de parceiro

| | |
|---|---|
| **Como era** | A faixa de parceiros saía **só com a copy**, com o lugar das marcas reservado à esquerda desde 11-09. |
| **Como ficou** | Harvard Business Impact e Imperial College London, altura comum de 56px, separados por um filete vertical. |
| **O que faltava não era o arquivo** | Nome de instituição é marca registrada com regra de uso própria, e a nota anterior dizia que não se improvisa com imagem achada na internet. Estes dois vieram **da cliente**, na pasta que ela mesma montou — ou seja, o aceite de uso é dela. |

---

## 4. Services — página de dentro

Comparada com o template que ela mandou em 15-09 (`4. Services/ExCo Leadership Services
Page.png`), que é o item 14 da daily.

### 4.1 ⛔ A migalha de pão saiu

Construída e removida no mesmo 15-09, a pedido. Ver §1.6, onde a história fica inteira.

### 4.2 "Related services" voltou

| | |
|---|---|
| **Como era** | Não existia. A grade tinha sido **removida em 11-09**, porque o §3.2 do outline fechava a página em seis blocos e estrutura extra era decisão do cliente, não nossa. Ficou escrito naquele commit que, se voltasse, voltaria como pedido. |
| **Como ficou** | Quatro cards no pé, sob o rótulo "Related services". |
| **Fonte** | O template dela fecha a página exatamente com este bloco. |
| **Quatro e não nove** | Nove seria o índice repetido no pé de cada uma das dez páginas. |
| **Sem numeração** | 01–04 diria que aqueles são os quatro primeiros serviços, o que é falso. O template dela também não numera. |

> ⚠️ **As quatro são as primeiras da lista, não uma escolha de afinidade.** O documento
> não diz quais serviços se relacionam com quais. No template dela, as quatro ao pé do
> ExCo são Culture Transformation, Team Effectiveness, Organisational Transformation e
> Executive Coaching — e **duas dessas nem são serviços desta lista de dez**. Quando o
> mapa vier, é trocar o `slice` por um campo `related` no dado.

### 4.3 O que ficou travado

Detalhado em `docs/pedido-copy-services-drilldown-15-09-2026.md`. Em resumo:

- **20 títulos editoriais** (dois por serviço) para os blocos "The Outcome" e "How
  CorporateDNA Helps". O corpo é o nosso, verbatim; o título é conteúdo novo e só existe
  para o ExCo, dentro de um PNG. Os dois blocos ficam no desenho de 12-09.
- **A régua de cinco** do bloco 3 (Immersive experiences, Executive coaching, Real
  business challenges, Peer learning, Mastery labs) — é o método do ExCo destrinchado; os
  outros nove precisariam dos seus.
- **As quatro citações** que o próprio docx marca como "identified but not chosen". O
  xlsx de 15-09 confirma: nas linhas de GSK, Vodafone e adidas a célula TESTIMONIAL traz
  **instrução para nós**, não citação.

### 4.4 O `WEBSITE SERVICE COPY.xlsx` não trouxe copy nova

Conferido linha a linha contra `lib/services.ts`: banner, impact, how we help e as três
partes do CTA batem palavra por palavra nos dez. **Nada a migrar.**

Duas divergências dentro do próprio pacote, registradas para confirmar com ela:

- **O xlsx repete a copy de Executive Coaching na linha do ExCo.** As células CASE STUDIES
  e TESTIMONIAL da linha 2 são idênticas às da linha 10. O template **dela** para o ExCo
  mostra outra coisa — HEINEKEN, 150 senior leaders, 18 months —, que é também o que o
  `CDNA_03_Services.docx` diz e o que está no ar. Parece erro de cópia na planilha.
- **A copy dos cards, no desenho da landing, não é a banner statement.** O mockup escreve
  *"Build a pipeline deep enough that your next leaders are ready before you need them"*;
  o documento e a planilha dizem *"Build the leadership pipeline before the business needs
  it"*, marcada FINAL. O site está com a do documento.

---

## 5. Home

### 5.1 (29) As caras do time saíram do topo

| | |
|---|---|
| **Como era** | A seção `#people` abria com o `<PeopleGrid>` — a grade de retratos, lendo do CMS com as fotos substituídas por `officialPortrait()`. |
| **Como ficou** | Só o `<PeopleGrid>` saiu. Ficam o rótulo, o título, o parágrafo, a DNA experience, o carrossel de bastidores e a faixa de parceiros. |
| **Fonte** | *"I'd probably take off the team photos… I don't want to see the team faces on there at the start."* E na mesma frase: *"a lot of the information you have on there would probably remain."* |

Consequências, todas deliberadas:

- **O portão `people.length > 0` saiu.** Ele existia para a seção não aparecer vazia antes
  de o CMS ter gente publicada. Sem a grade, nada ali vem do CMS — manter o portão faria
  uma seção estática sumir por causa de uma coleção que ela não usa.
- **`getPeople()` saiu do `Promise.all`**, junto com os imports de `PeopleGrid` e
  `officialPortrait`. A grade era a única consumidora.
- **A âncora `#people` fica** — está no menu e a seção continua existindo.
- O `mt-14` da DNA experience saiu: era a grade que abria aquele vão.

### 5.2 (32 + 33) Escritórios e mapa-múndi saíram

| | |
|---|---|
| **Como era** | `<LocationsBlock tone="dark" …>` seguido de `<WorldCoverageMap typeLabel />`. |
| **Como ficou** | Os dois removidos. A home vai do bloco do livro direto para os awards. |
| **Fonte** | *"The address is probably not, I don't really see it on a landing page; the map looks like a duplicate."* |

**A duplicação que ela viu era real e estrutural:** dois mapas em sequência, a 400px um do
outro, dizendo a mesma coisa por desenhos diferentes — um com pinos de escritório, outro
com países atendidos. O `LocationsBlock` **não morreu**: é a faixa que a /about acaba de
ganhar, e continua rodando na /our-clients.

### 5.3 (34) Awards & mentions viraram banner

| | |
|---|---|
| **Como era** | Uma tarja vermelha só com o título, e abaixo dela **cinco fileiras de largura cheia** sobre o branco da página: nome do prêmio em 30px, `"FINALIST 2008"` em vermelho maiúsculo, logo à direita, filete vermelho curto separando. Ocupava mais de uma tela. |
| **Como ficou** | **Uma faixa**: título e os cinco logos em régua, com nome e ano sob cada um. Altura de uma faixa de parceiros. |
| **Fonte** | *"Awards and mentions, I'm thinking maybe we just have it as a banner rather than calling out that we were the finalists or the semi-finalists — even though that's what we were."* |

- **A linha de distinção sumiu da tela, mas o campo `distinction` continua no dado.** Dois
  dos cinco não são "finalista" coisa nenhuma — "Top 10 Indian women leader in the UK" e
  "Best international leadership consulting firm" são prêmios ganhos, e é plausível que
  ela queira esses de volta quando revisar a lista com a Ria (item 35). Apagar o campo
  obrigaria a redigitar cinco distinções depois.
- **O ano fica.** É fato datado, não alegação de colocação.
- **A animação virou um gatilho só.** Eram cinco `ScrollTrigger`, um por fileira, porque
  cada uma entrava no viewport em momento diferente. Lado a lado, os cinco logos entram
  juntos — cinco gatilhos disparariam no mesmo instante. Virou um `stagger` da régua
  inteira.

---

## 6. Marca — logo, no site inteiro

| | |
|---|---|
| **Como era** | `cdna-logo-light.svg` nas duas barras e `cdna-logo.svg` no rodapé — **só o letreiro** ("corporate / DNA / consulting"), sem o símbolo. |
| **Como ficou** | A marca completa, com o círculo vermelho e a hélice à esquerda do letreiro. Branco transparente nas barras (`cdna-logo-full-light.png`), vermelho sobre branco no rodapé (`cdna-logo-full.png`). |
| **Fonte** | *"Company logo — to replace the placeholder at the top."* O "placeholder" era o letreiro sozinho. |

**A altura mudou nas barras: `h-12` → `h-10 xl:h-12`.** A marca completa é 2,5:1 contra
1,39:1 do letreiro, ou seja ocupa mais **largura** na mesma altura, e a barra tem
orçamento apertado a 1024, onde o menu de desktop começa. Com o `md:px-10` da faixa:

```
1024 − 80 de padding   = 944 de container
944 − logo − 24 de vão = espaço livre para o menu
menu da NavV2 = 748px (+ ~18px da seta do Services quando o CMS responde)

h-12 (48px) → logo de 120px → sobram 800. Folga: 34px.
h-10 (40px) → logo de 100px → sobram 820. Folga: 54px.
```

Os 34px do `h-12` cabem, mas é a folga inteira do layout apostada num logo. De `xl` para
cima há 256px a mais e ele cresce.

> ⏳ **É PNG porque foi PNG que ela mandou** — não há vetor no pacote. Header é o lugar
> onde vetor mais se paga; vale pedir o `.ai`/`.svg`.
>
> ⚠️ **O do rodapé veio de um JPEG com fundo branco chapado.** Não dá para torná-lo
> transparente: o branco também é a cor da hélice dentro do círculo vermelho, e um recorte
> por cor abriria buracos no meio da marca. Sobre o rodapé, que é branco, a diferença é
> invisível — mas **se o rodapé mudar de cor, isso quebra**, e o conserto é pedir o vetor.

---

## 7. Arquivos novos em `public/`

| Arquivo | O que é | Origem |
|---|---|---|
| `cdna-logo-full-light.png` | Marca completa, branca, transparente | `Company Logo/CDNA LOGO WHITE.png`, aparado e reduzido |
| `cdna-logo-full.png` | Marca completa, vermelha sobre branco | `Company Logo/CDNA LOGO RED.jpeg`, aparado |
| `logos/harvard_business_impact.png` | Logo do parceiro | `Picture1.png` (raiz do pacote) |
| `logos/imperial_college_london.png` | Logo do parceiro | `ImperialCollege.png` |
| `team/nitin-goil.jpg` | Retrato, 1024x1280 | `2. Team/Nitin Goil.png` |
| `team/team-stairs.jpg` | Foto do time, 2:3 (para a /team) | `1.About Page/About page.jpeg` |
| `team-stairs-about.jpg` | Mesma foto, 4:5 (para a /about) | idem |
| `skyline-dna.jpg` | Skyline sem a recompressão do WhatsApp | `1.About Page/ChatGPT Image Sep 8…png` |
| `services/cards/*.jpg` (6) | Imagens dos cards do índice | `public/solutions-banners/`, do site antigo |

Nada foi apagado. A `about-hero.jpeg` continua no repositório, ao lado da nova.

---

## 8. O que NÃO mudou, e por quê

### 8.1 A lista de pessoas da Team — **o maior risco de retrabalho do projeto**

`lib/team.ts` **não foi tocado** na parte que importa. O pacote de 15-09 reenviou os dois
documentos que se contradizem, na mesma pasta, no mesmo dia, sem comentário:

| `CDNA_04_Team.docx` (o que está no ar) | O mockup de 14-09 |
|---|---|
| Rhea Leckie · Guilherme Mendes · **Mike Jackson** · **Genevieve James** · Jon Paul Pritchard · **Nitin Goil** | Rhea Leckie · Guilherme Mendes · **Zahia Marjan** · JP Pritchard · **Jojo Kearney** · **Inan** |

**O mockup reenviado é byte a byte o mesmo de 14-09** — md5 conferido contra
`docs/mockup-team-maliha-14-09-2026.png`. **O docx reenviado traz a mesma lista de
09-09**: os seis nomes, cargos e quotes foram extraídos do arquivo e batem com o que
`lib/team.ts` transcreveu na época. (O `.docx` de 09-09 em si não está no repositório,
então a comparação é de conteúdo, não de bytes.)

**Ninguém respondeu qual vale.** As quotes também são todas diferentes entre os dois. A
diferença são dias de trabalho.

### 8.2 A 5H

Continua travada na **aprovação da Rhea**, que não aconteceu. A `/approach` no ar é a
versão antiga. É o maior bloco de trabalho da lista e o que mais custa se for construído
antes do aval.

### 8.3 Decisões em aberto da §3 do doc de correções

- ~~**De que lado vai o texto no mapa da About** (item 3).~~ **Respondido em 15-09:**
  texto à esquerda, mapa à direita. Construído — §2.2.
- **Se "Making the learning real" sai ou fica** na 5H (item 40).
- **Trocar `resourcefulness`** por uma palavra mais curta.

### 8.4 Assets ainda pendentes com ela

- **A imagem de "Americas"** — ela respondeu "In progress" em 15-09. A India segue sem
  resposta.
- **O skyline em largura de dobra** (~1920px).
- **O retrato original da Rhea.** O pacote traz de novo o mesmo JPEG de 1536x1024, em
  paisagem. O card dela segue com a versão reenquadrada por IA.
- **O logo em vetor.**
- **A foto oficial do Guilherme** — o card dele continua com o recorte da foto antiga do
  site. É a única pendência de retrato que resta na liderança.

### 8.5 O que o mockup da Team traz e **não** foi construído

Da auditoria bloco a bloco de 15-09, três coisas do desenho ficaram de fora **de
propósito**:

- **"Meet the full team →"**, no canto superior direito da seção de liderança. Ele
  implica uma página listando os 75 praticantes, que **não existe** — e o item 21 da
  daily diz que o MVP vai ao ar só com os client directors, com os senior practitioners
  entrando depois. Um call to action que não leva a lugar nenhum é pior que nenhum, que é
  a mesma régua já aplicada às setas dos tiles de região.
- **O ícone de busca** no menu. Não há busca no site.
- **A frase manuscrita** sobre a foto do herói ("People / Real Change / A Brighter
  Tomorrow"). É arte do mockup, não asset — e o herói desta página nem é a foto do
  mockup, é a imagem padrão compartilhada.

E dois pontos do documento que continuam em HOLD, como já estavam:

- **Bloco 3 · Perspectives.** O documento pede frases NOVAS de cada pessoa, resposta a
  *"what do you believe about leadership that most people in this industry get wrong?"*,
  em até 200 caracteres. Ninguém conversou com o cliente sobre o que o bloco é; a
  montagem inteira está no commit de 11-09.
- **Slot 06 — a imagem por região** do bloco 5. As cinco no ar são pontos turísticos do
  Wikimedia (marcadores de lugar, decisão do Ricardo em 12-09), e o documento pede *"a
  representative selection or mosaic image per region"* — ou seja, a faculty ou o
  trabalho acontecendo, não cartão-postal.

> ✅ **O "short bio on click or hover" do bloco 2 deixou de ser pendência.** A auditoria
> tinha registrado que a bio "não existe nem no Word nem no CMS". A primeira metade está
> certa; a segunda estava **errada** — a bio estava no CMS o tempo todo, nos mesmos
> registros que a home lia. Ver §1.8.

**A busca pelas frases do bloco 3, para não se repetir.** Foram procuradas nos **cinco
`.docx`** do pacote, no **xlsx** (aba única, colunas A–G) e nos mockups:

| Onde | O que há |
|---|---|
| `2. Team/CDNA_04_Team.docx` | O único que cita o bloco 3 — e ali ele é **HOLD**, com a pergunta que cada pessoa precisa responder. |
| `4. Services/WEBSITE SERVICE COPY.xlsx` | Coluna TESTIMONIAL, com quotes de **serviço**, não de pessoa: **uma** citação real (Executive Coaching, já no ar), **três** instruções para nós, **cinco** vazias. |
| `4. Services/CDNA_03_Services.docx` | Diz o mesmo em prosa: *"A short quote from Dolf **exists but has not been chosen**"* e *"Nine of the ten have no publishable testimonial."* |
| Os demais `.docx` e mockups | Nada. |

São **duas pendências distintas**, e vale pedir as duas juntas: as **quatro citações de
cliente** (adidas, GSK Mexico, Heineken, Vodafone) e as **seis frases de Perspectives** do
time.

### 8.6 (24) Respondido pelo pacote, sem trabalho

O item 24 pedia para "tirar related case studies e client voice", e o doc de correções
mandava **perguntar o que eram**, porque nenhum dos dois existia no site. O pacote
respondeu: são os blocos **04 (CLIENT VOICE)** e **05 (RELATED CASE STUDIES)** do template
de case study **dela**, que chegou agora
(`5. Clients& Impact/efa52866-….png`). **Não havia nada a remover do nosso site** — é uma
restrição para quando aquele template for construído.

### 8.7 Duas frentes novas entregues em desenho, ainda não construídas

- **A página top-level de Clients & Impact** (item 25), em **dois desenhos alternativos**.
  Ela escreveu *"Content to follow"* — parte do texto ainda não existe.
- **O template de case study** (`/cases/[slug]`), que redesenharia as páginas de caso.
  Temos 3 dos 23 cases escritos, e ela foi explícita de que dois ou três não bastam para
  ir ao ar.
