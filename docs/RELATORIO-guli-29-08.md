# Relatório — o que precisa ser feito depois da call do Guli (29/08)

**Entradas**

| Fonte | Papel |
|---|---|
| `docs/email-guilherme-27-08-2026.txt` | **single source of truth** — 19 itens, vale por cima de tudo |
| `docs/transcricao-guli-29-08-2026.md` | a call de 29/08, **re-transcrita** com áudio limpo |
| `docs/design-guli-29-08/*.png` | mocks do Guli + frames de alta resolução tirados do vídeo |
| `docs/5H-wheel-25-dimensions.png` | a roda do 5H — **contém as 25 dimensões** |
| `docs/FEITO-E-FALTA-brief-27-08.md` | estado do código até 28/08 |

**Data:** sábado, 29/08/2026. **Target de lançamento:** terça, 01/09.
**Restam:** sábado, domingo, segunda.

> **Este documento substitui `docs/PLANO-design-guli-29-08.md`**, que foi escrito em cima de
> uma transcrição defeituosa (o final era de outra reunião, sobre Black Friday). As
> conclusões de lá sobre 5H, Solutions, Clients e Impact continuam válidas; **duas
> mudaram e estão corrigidas abaixo** (home e 25 dimensões).

---

## 0. As três correções em relação ao que estava escrito antes

**① A home está destravada — e o trabalho revertido em 28/08 deve voltar.**
O plano anterior dizia que a home era a maior lacuna, esperando design do Guli. Na call ele
diz o contrário, com todas as letras *(15:48–16:05)*:

> — *"Esse da homepage… na verdade acho que a gente pode fazer aqui com a IA, né? Não precisa?"*
> — *"Eu acho também. É só reordenar ali, né? Que ele tinha pedido, inclusive."*
> — *"A não ser que tu queira atualizar no Figma, né?"*
> — **"Cara, não quero."**

Ou seja: **a reordenação da home (itens 1 e 2) é nossa, não passa pelo Figma.** O `git
checkout app/page.tsx components/HeroV1.tsx` feito em 28/08 jogou fora exatamente o trabalho
que o Guli acabou de dizer que não vai fazer. Precisa ser refeito.

**② As 25 dimensões do 5H existem — o bloqueio B1 caiu.**
Estão na roda, em `docs/5H-wheel-25-dimensions.png`. Transcritas na seção 3.1. O
`five-h-data.tsx` tem hoje 5 objetos com uma `description` cada; faltam os 25 **nomes** —
e só os nomes, porque no design o que rotaciona é o nome da dimensão, não um parágrafo.

**③ O transcript anterior era inutilizável.**
`transcricao-guli-29-08-2026-raw.txt` foi apagado. A versão limpa (572 segmentos, 24m37s,
`large-v3` com VAD) está em `docs/transcricao-guli-29-08-2026.md`. As citações deste
relatório apontam para ela.

---

## 1. Como esta entrega deve ser lida

O Guli é explícito sobre o status *(19:30)*:

> *"É uma versão inicial, não tá pronto — principalmente por causa das revisões de layout
> que vocês vão ter que fazer."*

E sobre conteúdo *(07:27)*:

> *"Eu fiz um mashup entre o conteúdo atual deles e o que a gente tem no site. Então é muito
> bom que você confira o conteúdo em si. **Eu estou pensando em design e disposição** aqui
> dos elementos."*

Tradução: **o texto dentro dos mocks não é proposta de copy. É preenchimento.** Nada do que
está escrito ali entra no site como está.

⚠️ **A gravação começa com a call já em andamento.** Aos 06:39 o Guli diz *"aqui, só pra
gente recuperar, porque ainda não tava gravando, a solução para puxar um pouco dos black
boxes"*. **A explicação original das Solutions em black boxes ficou fora da gravação** — só
o resumo está registrado, e o mock `solutions-black-boxes.png` é a única especificação.

---

## 2. Os dois riscos que valem mais que qualquer tarefa desta lista

### 🔴 R1 — O brief de 27/08 pode não ter passado pela Rhea

É a teoria do Guli, dita na call *(17:41–18:16)*:

> *"Minha teoria: o Guilherme, pelo que eu entendi, puxou tudo isso meio sem autorização da
> Rhea, ou sem a Rhea saber. Eu acho que ao apresentar pra Rhea, ela deu um tipo 'puta, eu
> tava feliz com o site antigo'. Mas a gente vai ter que defender. (…) A gente começou esse
> processo porque as cores estavam zoadas, e eu falei pra ele 'teu site tá muito fora do que
> deveria'. Então recuperar boa parte daquilo agora é desnecessário."*

Se estiver certo, o e-mail que estamos tratando como single source of truth é **a reação de
uma pessoa**, não a decisão do cliente. Implementar tudo antes desse alinhamento é repetir o
erro que fez a home ser revertida em 28/08.

**Combinado na call:** o Guli manda mensagem para o Guilherme e tenta marcar uma reunião
**ainda na tarde de 29/08** para validar o layout. *"Daí eu te dou um ok ou não ok"* (20:29).
Ele pede para participarmos junto *(18:53–19:03)* — quer defender as decisões em conjunto, e
tem receio de alinhamento paralelo *(21:46)*.

**Ação: nada da seção 3 entra no site antes desse OK.** O que dá para adiantar sem risco
está marcado abaixo.

### 🔴 R2 — Parar de gerar conteúdo com IA

O Guli é direto *(22:06–22:13)*:

> *"Se eu fosse vocês, agora pararia total de gerar conteúdo com IA e falaria: a partir de
> agora é vocês que mandam o conteúdo verdadeiro."*

E complementa *(22:24–22:29)*: *"A estrutura tá montada, a ideia tá lançada. A partir de
agora não tem mais o que vocês inventarem por eles."* Sobre o fluxo, ele mudou de posição
*(20:38–20:50)*: tinha proposto que a gente reescrevesse e a CDNA aprovasse, mas agora acha
que **a Rhea vai querer olhar antes** — e que texto pronto-e-corrigido já gerou retrabalho.

Isso bate com o brief, que proíbe inventar claim, nome, número ou quote. **Consequência
prática: toda página desta lista que depende de copy nova fica com o slot montado e vazio
até a CDNA mandar o texto.**

---

## 3. O design, tela a tela

### 3.1 — 5H / Our Approach (item 10) · *a peça mais cara*

**Arquivos:** `components/five-h/FiveHExplorer.tsx` (reescrita), `five-h-data.tsx` (expansão)
**Referência:** `call-5h-explorer-detalhe.png`, `call-5h-five-lenses.png`, `5h-variantes.png`

O problema que ele está resolvendo *(00:40)*: *"o sistema agora está dividido em partes, e
isso parece dar a entender que ele não é tão integrado, que os conceitos não são tão únicos
quando eles realmente são."*

**a) Inverter o layout.** Card de conteúdo em cima, lista de seleção embaixo. Motivo
concreto *(01:20)*: *"antes, com os botões em cima, o usuário podia clicar nos botões e não
ver o que estava acontecendo embaixo."* Hoje o `FiveHExplorer.tsx` tem exatamente esse
defeito — `role="tablist"` no topo, painel abaixo.

**b) Altura fixa, não negociável** *(01:49)*:

> *"Seria muito legal se esse bloco fosse inteiro blocado, para que as coisas não começassem
> a dançar conforme o usuário clica nos botões. Porque considerando que o botão está
> embaixo, se esse container de cima começa a balançar, o botão se perde."*

Reservar altura pelo pior caso — a dimensão de nome mais longo somada à descrição mais longa
— e não pelo conteúdo do H atual.

**c) Anatomia do card de conteúdo** *(01:32–01:46)*: ícone (já aprovado, já existe em
`five-h-data.tsx`) · título (HEAD) · indicativo Inner/Outer Game · palavra-chave (THINKING) ·
frase descritiva de tamanho variável · **nome da dimensão rotativa** em verde, com a bolinha
indicadora ao lado.

**d) Régua Inner/Outer Game** *(02:48–03:26)*: labels verticais à esquerda, cada uma com uma
linha. **Linha sólida no grupo do H selecionado, pontilhada no outro — e isso inverte quando
o usuário seleciona Hands ou Habits.** Não é decoração estática.

**e) As 25 dimensões rotativas.** Cada H tem 5, com indicadores tipo stories do Instagram
*(04:07)*. Regras:

- **Ritmo:** ~1s por dimensão em autoplay; **3s a partir do primeiro clique do usuário**
  *(04:53–05:02)*. Ele reconhece que 1s não dá tempo de ler, e a decisão é consciente
  *(04:43)*: *"não vamos nos importar tanto com o tempo de leitura no momento, vamos atiçar a
  curiosidade."*
- **A bolinha ativa tem o mesmo tamanho das demais** *(04:14)* — muda o preenchimento, não a
  escala.
- **Não é link** *(06:00–06:11)*. Perguntado se o nome verde leva a alguma página, respondeu:
  *"Não, não pensei nisso. Pensei só no sistema de cards."* Ele inclusive duvida que valha a
  pena aprofundar *(06:22)*: *"acho que talvez seja meio até tiro no pé eles irem tão a fundo
  dentro desses subtópicos."* **Pergunta aberta para a CDNA.**
- Pausar no hover e ao sair do viewport (`IntersectionObserver`) — senão é timer rodando à toa.

**f) Mobile** *(05:22)*: *"o maior problema que eu vi para mobile é que os botões estavam
quadrados e aqui embaixo ficava um divisor."* A lista vertical resolve.
**Web** *(05:37)*: mesma solução — Inner/Outer Game na lateral, bloco de conteúdo em cima.

**g) Tela "Five lenses. One whole leader."** (`call-5h-five-lenses.png`) — não estava nos
prints enviados. Grade de 5 cards com ícone, um por H, sobre o texto que explica Inner Game ×
Outer Game. É a introdução que o brief pede no item 10 (*"redesenhar a introdução"*).

#### ✅ As 25 dimensões — lidas de `5H-wheel-25-dimensions.png`

| H | Game | Dimensões |
|---|---|---|
| **HEAD** | Inner | Critical Thinking (Reasoning) · Decision Making · Growth Mindset & Learning Agility · Scenario Planning · Navigating Complexity |
| **HEART** | Inner | Courage & Resilience · Empathy · Authentic Energy · Interpersonal Savvy · Connection & Collaboration |
| **HUNCH** | Inner | Judgement & Discernment · Curiosity · Sensing & Sense Making · Insightfulness · Accelerated Decisioning |
| **HANDS** | Outer | Resourcefulness · Role Modelling · Accountability · Stakeholder Centricity · Action Oriented |
| **HABITS** | Outer | Listening & Questioning · Leading with Why · Consistency · Ownership · Transparency |

Núcleo da roda: **VALUES, BELIEFS, DRIVERS**.

São **IP proprietário da CDNA**. Os nomes vieram do material deles, mas entram na lista de
aprovação — o brief é categórico que nada vai a produção sem sign-off. Confirmar também a
grafia de *Interpersonal savvy* (na roda está em caixa baixa).

> ⚠️ Nos mocks o texto está trocado de propósito — em `5h-variantes.png` aparece o título
> HEAD com a descrição de HABITS. É placeholder, não especificação.

**Tamanho:** médio-grande. Dois dias. É o único item que é comportamento novo, não re-skin.

---

### 3.2 — Solutions em black boxes (item 5)

**Arquivo:** `app/solutions/page.tsx` · **componente novo:** lista de caixas
**Referência:** `call-solutions-black-boxes.png`, `solutions-black-boxes.png`

Lista vertical de caixas escuras; a ativa/hover vira vermelha **com corte diagonal à
esquerda** e seta `→` à direita. O grid branco de 2 colunas de hoje sai.

A lógica *outcome-led* já está no lugar (commit `587e9e2`) e **permanece intacta** — o que
muda é só o invólucro.

Sobre o porquê *(06:48–07:05)*:

> *"É uma solução que está combinando com o nosso layout, ela não está fugindo do que a gente
> está propondo. Ela só recupera um pouco do senso de controle deles em relação ao que eles
> já tinham. No fundo, eu estou achando que é isso: eles não querem perder o controle, para
> não parecer que rasgaram a história."*

⚠️ **A explicação detalhada ficou fora da gravação.** Se houver dúvida de implementação
(altura das caixas, ângulo da diagonal, comportamento no hover em touch), perguntar — não
inferir do print de 181px.

**Reaproveitamento:** o mesmo padrão vale para os cards de cliente da seção 3.3 — o Guli diz
que é *"meio que a ideia dos black boxes também, mas numa outra disposição"* (07:50).
**Construir como componente compartilhado, não duas vezes.**

**Em aberto:** a ordem das 8 solutions no índice. Hoje sai na ordem do CMS. **Sugestão:**
usar a ordem do e-mail, que é a que a CDNA confirmou — ExCo/Top 150 → Culture Transformation
→ Talent Development → Manager Development → Women in Leadership → High Performing Teams →
HRLT Effectiveness → Executive Coaching.

**Tamanho:** pequeno. Meio dia.

---

### 3.3 — Our Clients (item 8)

**Arquivo:** `app/our-clients/page.tsx` (já existe, no sistema visual atual)
**Referência:** `our-clients.png`, `call-our-clients-e-impact.png`, `call-our-clients-fotos-quote.png`

Ordem em que o mock e o brief concordam: **logo wall → client cards → global footprint →
fotos/quote**.

| Bloco | O que fazer | Reaproveita |
|---|---|---|
| Logo wall | duas fileiras contra-rolantes | `LogoMarquee` + `lib/logos.ts` — **já ligados nesta página** |
| Client cards | faixa escura: nome + tags (`WOMEN . SOUTH AMERICA.`) + `FIND OUT MORE`; logo à direita sobre painel na cor da marca, com transição para o escuro | componente da 3.2 + `lib/logo-colors.ts` |
| Global footprint | **o mapa real, não a imagem do mock** | `LocationsMap` / `WorldCoverageMap` |
| Fotos | as 3 fotos soltas do site antigo viram **carrossel** | `PhotoCarousel` **já existe** |

Sobre os cards *(07:32–08:01)*: *"usei a mesma solução que a gente tinha para Our Results, do
banner. A diferença é a disposição das informações: nome, tags e um link de Find Out More que
joga para o projeto."*

Sobre o mapa *(08:02)*: *"usei essa imagem desse mapa, mas na verdade é um mapa que vocês já
têm, que deve ter dado um trabalho do cão — é esse mapa que tem que colocar aqui."* **O mapa
do mock é placeholder.**

Sobre as fotos *(08:11–08:50)*: *"eram fotos jogadas muito tristinhas. Modifiquei para ser um
carrossel, também de Instagram — essa foto aparece, daí troca por outra."* E o carrossel vem
com uma frase de impacto antes: no mock, o bloco escuro *"We cut cross cultural boundaries to
release energy in leaders and teams by seeing them as real people with real personalities. We
make leadership real."*

**Divergência registrada — fotos em preto e branco** *(08:21)*: *"achei bizarro esse pedido
deles, inclusive de deixar as fotos pretas e brancas. Para mim parece uma coisa meio
mortuária."* Provavelmente não é conflito real: o P&B do item 15 é para os **retratos do
time**, e este carrossel é de **fotos de evento**. Vale confirmar para não virar retrabalho.

**Trabalho real:** só os client cards. Wall, mapa e carrossel são recolocação de componentes
que já existem e já funcionam.

**Tamanho:** pequeno-médio. Um dia.

---

### 3.4 — Our Impact (item 9) · *o mais confuso dos cinco*

**Arquivo:** `app/our-impact/page.tsx`
**Referência:** `our-impact.png`, `site-antigo-by-the-numbers.png`, `site-antigo-social-impact.png`

Sequência do mock: **números → our clients say → social impact → impact stories → evidence
across regions → awards**.

| Bloco | Situação |
|---|---|
| Faixa de números | ✅ `getSiteStats()` + `Counter` já ligados. **Mas ver 🔴 N1 e 🔴 N2** |
| Our clients say | 🔴 **bloqueado** — ver abaixo |
| Our Social Impact | 🟡 texto vem do site antigo; carrossel reaproveita `PhotoCarousel` |
| Impact stories | 🟡 layout pronto; ver ⚠️ C3 na seção 4 |
| Evidence across regions | 🔴 **ninguém sabe o que é** — ver Q3 |
| Our Awards | ✅ `AwardsMentions.tsx` **já existe** — é mover, não construir |

O Guli trouxe o Awards *"na mesma disposição que a gente já tinha"* *(17:07)*, deixando em
aberto se cada item linka para algo.

Sobre o Social Impact *(14:17–14:27)*: mesma disposição de Instagram, *"você pode aumentar a
quantidade de bolinhas ou diminuir conforme for necessário"*. E ele **não trouxe o texto
inteiro do site antigo de propósito** *(14:37–14:46)*: *"nem vou pegar, porque eles estão
falando 'evitar o scroll em excesso' — e é um textaço."*

#### 🔴 N1 — Os números do mock contrariam o item 2 do brief

No mock a sequência é *18 years → 36 countries → 75 faculty → 90% Chairman*. O item 2 é
explícito: *"O 90% Chairman/CXO-sponsored work deve aparecer antes de 18 years, porque é mais
diferenciador para nosso público."* **O mock inverte exatamente o que o brief manda.**
Resolução: 90% primeiro. É o que o cliente pediu por escrito.

#### 🔴 N2 — O Guli acha que pegou os números errados, e ele pode estar certo

Na call *(11:25–12:24)*: *"pode ser que sejam esses números e eu peguei os números errados,
entendeu? (…) Não, o que eu tô achando é que são outros números."*

O motivo é real. O brief pede **duas coisas** no item 9 — *measurable results* **e** *impact
statistics* — e o site antigo tem uma seção **BY THE NUMBERS** com nove indicadores que não
são os quatro do mock (`site-antigo-by-the-numbers.png`):

> `>78%` Net Promoter Score · `88%` Engagement Results · `>90%` Programme Impact ·
> `>75%` Talent promoted mid-programme · `50%` Of Top FTSE 10 are our clients ·
> `2007` Year Founded · `>30` Countries in Global Footprint · `500+` Leadership Teams
> serviced · `1000+` Coaching clients serviced

*(Lidos do vídeo da call, com o contador em animação — **conferir os valores finais na fonte
antes de usar.**)*

Note que isso conflita com o próprio mock e com o site atual: `>30 countries` × `36
countries`; `2007 Year Founded` × `18 years` (2026 − 2007 = 19).

E some com a pendência antiga: **a lista de aprovação de 06/08 (95% / 26 countries / ten
years / ©2021 contra 36 countries / 18 years) nunca teve retorno.** São os números que a
página inteira existe para provar.

**Decisão de layout que depende disso** *(12:24–12:39)*: se forem dois blocos de números em
sequência, um precisa inverter a cor — senão viram dois comportamentos iguais colados.

#### 🔴 "Our clients say" está bloqueado

O item 7 do brief exige testimonial **sobre a Corporate DNA**; as quotes atuais são corporate
genéricas. A página nova não pode amplificar o que o brief manda corrigir — o slot fica
montado e vazio, como já está hoje em `app/our-impact/page.tsx`.

O Guli entende esse bloco como o lugar do *"vídeo enxuto"* *(12:49)*, o que casa com o item
13 (vídeos individuais em vez do compilado).

**Tamanho:** médio. Um a dois dias, dependendo de quanto destravar.

---

### 3.5 — Case study e listagem (itens 6 e 7)

**Referência:** `case-shell.png`, `impact-stories.png`, `impact-stories-filtro-aberto.png`

**Boa notícia: quase nada a fazer.** O `CaseView.tsx` atual já bate com o mock — eyebrow de
tags em vermelho, título grande, faixa de fatos, intro, capa, bloco escuro de quote com CTA
vermelho (*"HEAR THE COMPLETE INTERVIEW"*).

**A fazer:** a seção *The 5H® Framework* dentro da página do case.
**A checar:** ⚠️ C4 na seção 4.

**Tamanho:** pequeno.

---

### 3.6 — Home (itens 1 e 2) · *destravada, e é nossa*

Ver correção ① na seção 0. **Não vai haver Figma da home.** O que precisa acontecer:

1. Refazer o que o `git checkout` de 28/08 desfez: headline nova (*Keeping Leadership Real*),
   a seção dos seis "reals", a reordenação Claim → Prova → Explicação, remoção do vídeo
   compilado, e o `RunningTicker` montado na página.
2. `RunningTicker` **já existe e já está ligado ao CMS** — falta só montar. O Guli não deu
   posição; sugestão é logo abaixo do hero, que é onde o site antigo tinha.
3. Aplicar o item 2: **90% Chairman antes de 18 years**, logos e prova antes de explicação.

⚠️ Isso é layout da home, e a regra de 28/08 dizia que layout de home espera o Guli. **A
regra caiu para este caso porque o próprio Guli abriu mão do Figma na call.** Vale confirmar
com ele na mesma conversa de validação — é uma frase, não uma reunião.

**Tamanho:** pequeno-médio. É recuperar trabalho já feito uma vez.

---

## 4. Perguntas para levar na conversa com o Guilherme

O Guli pede explicitamente que a conversa seja feita **em cima do e-mail dele, item a item**
*(22:53–23:12)*: *"quando tu for falar com ele, pode pegar o e-mail que ele mandou e passar
junto com ele os pontos, porque daí facilita para ele mesmo ver o que está faltando."*

| # | Pergunta | Por quê |
|---|---|---|
| **Q1** | O brief de 27/08 foi validado pela Rhea antes de ser enviado? | R1. Se não foi, metade desta lista pode mudar |
| **Q2** | *Programme outcomes* — o que é? | Item 9 pede; não existe no site antigo; **o Guli não sabe o que é** *(13:38–13:44)* |
| **Q3** | *Evidence across regions* — o que é? | Item 9 pede; sem descrição no e-mail; ninguém na call soube dizer *(14:48–14:59)* |
| **Q4** | *Measurable results* e *impact statistics* são a mesma coisa ou dois blocos? | Define se Our Impact tem uma ou duas faixas de números *(10:53–12:24)* |
| **Q5** | Quais são os números certos? Os quatro do site atual ou os nove do BY THE NUMBERS? | 🔴 N2 |
| **Q6** | A lista de aprovação de 06/08 — 95% / 26 countries / ten years / ©2021 | Parada há três semanas |
| **Q7** | *Portfolio snapshot* (item 8) — é o logo wall ou outra coisa? | O Guli deduziu que é *(09:17–09:31)*, não sabe |
| **Q8** | O P&B do item 15 vale só para os retratos do time, ou também para as fotos de evento? | Divergência da seção 3.3 |
| **Q9** | As 25 dimensões do 5H devem ser explicadas em profundidade ou só aparecer? | O Guli acha que aprofundar é *"tiro no pé"* *(06:22)* |
| **Q10** | Confirmar os nomes e a grafia das 25 dimensões | IP proprietário; nada vai a produção sem sign-off |
| **Q11** | Os flagship de *Manager Development* e *Executive Coaching* | Os dois TBC do item 6 |
| **Q12** | *Proprietary Frameworks & Diagnostics* (item 11) — quais entram? | Levantado na call *(21:18)* e não resolvido |
| **Q13** | Quem escreve a copy nova: vocês mandam pronto, ou a gente propõe e vocês aprovam? | R2 — define se as páginas lançam cheias ou com slot vazio |

**⚠️ C3 — o filtro do listing contraria o item 6.** `impact-stories-filtro-aberto.png` mostra
um dropdown com *ESG, Finance, empowerment, south america, FMCG, Corporate*. O item 6 diz:
*"não usar industry dropdown como principal lógica de descoberta dos cases."* Cabe se for
filtro secundário, com a descoberta principal continuando por Solution — mas do jeito que
está no mock ele é a lógica principal da página.

**⚠️ C4 — o case não abre com a faixa de 5 fatos.** O item 7 exige *Countries →
Participants/Leaders → Reach/Scale → Intervention → Impact* antes da história. O
`case-shell.png` abre com headline + métrica embutida. A faixa **já está construída e
renderizando**. Perguntar: o mock omitiu ou substituiu?

**⚠️ C5 — "DEVEMDOBRO" aparece como cliente nos mocks.** Placeholder do Guli. Óbvio, mas o
brief é categórico: *"nenhum nome, logo, quote ou metric vai para production sem CDNA
approval."*

**⚠️ C6 — redução de texto não é entregável de design.** O Guli é direto *(18:25–18:32)*:
*"redução geral de texto e scroll não está no nosso controle, é o conteúdo."* E sobre o
espaço em branco *(18:34–18:47)*: *"sou obrigado pela minha formação a ignorar esse tipo de
comentário, porque espaço em branco é o que faz o design desde sempre."* **O que o design
entrega é redução de scroll — que não é a mesma coisa que redução de texto.** Vale dizer isso
com todas as letras na resposta.

---

## 5. O que depende da CDNA (conteúdo, assets, aprovação)

Herdado do ciclo anterior e **ainda aberto**:

1. Flagship de *Manager Development* e *Executive Coaching* (Q11).
2. Aprovação de nomes, logos, quotes e métricas de cliente.
3. Quotes que sejam testimonials **sobre a Corporate DNA** (padrão John Murphy / Jorge Gardino).
4. Texto das Partnerships respondendo *"what does this partnership enable for our clients?"*.
5. Assets do time: foto de grupo, retratos P&B, lista final de quem aparece.
6. Conteúdo do ticker (2023+).
7. Reautoria das 8 Solutions no CMS no formato curto — **os campos já estão prontos**.
8. Preenchimento da faixa dos cases — **os campos já estão prontos**.
9. A lista de aprovação de 06/08 (Q6).
10. **Novo:** os números certos do Our Impact (Q5) e a definição de Q2/Q3/Q4.
11. **Novo:** sign-off das 25 dimensões (Q10).

---

## 6. Pendências operacionais que travam qualquer lançamento

- **Migração do CMS não rodou.** `db/migrations/0007_dashing_omega_flight.sql` — três
  `ALTER TYPE … ADD VALUE`, puramente aditivas. Enquanto não rodar, `partnership`,
  `ticker_item` e `testimonial_video` **não aparecem no admin** — e o ticker da home
  (seção 3.6) depende disso. `npm run db:migrate` com `DIRECT_URL` na porta 5432 (não a 6543
  pooled). **Independe de design: dá para rodar hoje.**
- **O formulário de lead não avisa ninguém.** Grava no banco e fica invisível — sem e-mail,
  sem webhook. Lançar com ele assim é perder lead.
- **Deploy é manual.** O scope da Vercel é **`dobro66`**, não `impulse66` — o time foi
  renomeado e os docs do repo ainda mandam usar o slug antigo, que só dá erro.
- **Autor do commit HEAD** tem que ser `impulseaisolutions@gmail.com` ou o time bloqueia.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** ainda é `5511999999999`. Pendente desde 24/07.
- **Cutover do domínio:** `corporatednaconsulting.com` ainda serve o WordPress antigo. O que
  chamamos de "produção" é `consulting-dna-corporate-alpha.vercel.app`. Se "lançar em 01/09"
  significa virar o domínio, **isso não está em nenhum tracker**.
- **Preview desatualizado:** `consulting-dna-corporate-preview` está semanas atrás do `alpha`.
  Ou redeployar, ou aposentar — hoje é armadilha para quem for revisar.

---

## 7. O que cabe até 01/09

Restam sábado, domingo e segunda. E o design **ainda não foi validado**.

### Dá para começar agora, sem esperar ninguém

- Rodar a **migração 0007** do CMS.
- **Ligar a notificação do formulário de lead.**
- Expandir `five-h-data.tsx` com as **25 dimensões** (a estrutura de dados não depende do OK
  de layout — só a renderização depende).
- Extrair o **componente compartilhado de black box** (serve Solutions e Client cards).

### Cabe, se o OK do Guilherme vier a tempo

- **3.2** — Solutions em black boxes
- **3.3** — Our Clients (a maior parte é recolocar componentes que já existem)
- **3.6** — Home reordenada (recuperação de trabalho já feito)
- **3.5** — a seção 5H no case
- Faixa de números do Our Impact **com a ordem corrigida** (N1)
- Our Awards movido para o Our Impact

### Não cabe, e é honesto dizer agora

- **3.1 (5H completo)** — comportamento novo: rotação, autoplay com dois ritmos, régua que
  inverte, altura travada. Dois dias com tudo definido.
- Qualquer bloco preso a conteúdo não aprovado: *our clients say*, partnerships, time,
  ticker, e as três incógnitas do Our Impact (Q2, Q3, Q4).

**Recomendação:** lançar 01/09 com Solutions, Our Clients, home reordenada e a parte
desbloqueada do Our Impact. **5H e os blocos de conteúdo entram na semana seguinte.** É a
mesma lógica de duas ondas já proposta na resposta ao brief — e é melhor do que segurar tudo.

---

## 8. Próximos passos, em ordem

1. **Guli valida o layout com o Guilherme** — levando N1, N2, C3, C4 e as 13 perguntas da
   seção 4. Ele ficou de marcar para a tarde de 29/08 e de dar *"um ok ou não ok"*.
2. **Confirmar com o Guli que a home é nossa** (correção ①) — uma frase, e destrava o item
   mais atrasado.
3. **Fechar a regra de conteúdo (Q13)** — quem escreve. Enquanto isso não fecha, nenhuma
   copy nova é gerada.
4. **Rodar a migração 0007 e ligar a notificação de lead** — independem de tudo acima.
5. Com o OK: 3.2, 3.3 e 3.6 em paralelo; Our Impact em seguida; 5H na onda 2.
