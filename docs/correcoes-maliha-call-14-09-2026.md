# Correções pedidas pela Maliha — daily de 14/09/2026

**Fontes:** `docs/transcricao-maliha-14-09-2026.md` (42 pedidos numerados, extraídos do inglês
original) e `docs/PROXIMOS-PASSOS-pos-call-14-09.md` (mapeamento para o código).
**Branch:** `feat/brief-27-08-content-structure` — âncoras de código verificadas em 14/09.
**Formato:** checklist de execução. Os números entre parênteses apontam para a lista numerada
da transcrição.

> Este doc é o **recorte acionável**. O "por quê" de cada pedido, as citações e o contexto da
> call estão na transcrição; a análise de risco de retrabalho está no PROXIMOS-PASSOS.

---

## A reunião

Primeira daily do projeto (40m45s). Participantes: Maliha (cliente), Ricardo, Roberto e Guli.
A Maliha percorreu as páginas já construídas no alpha dando correções ao vivo e, no fim, o Guli
apresentou a proposta da 5H — aprovada com entusiasmo (*"I love this and I will sell her on it
very easily"*).

⚠️ A call é bilíngue. A primeira passagem da transcrição travou o idioma em `pt` e **traduziu**
as falas da Maliha, chegando a inverter as cores do gráfico 5H. Os pedidos abaixo saíram da
passagem multilíngue, do inglês original.

---

## 1. Dá para fazer agora

Nada nesta seção depende de asset da Maliha.

### Team
- [ ] **(19)** Remover o bloco de **global presence**. Os escritórios ficam só no rodapé.
      → `app/team/page.tsx:661` — o `<div id="presence">` com o `LocationsBlock`
- [ ] **(16)** A **quote sai de baixo do nome e vai para o lado do retrato**: card claro com
      aspas vermelhas grandes à direita, e sob a foto só nome, cargo e região + botão "+".
      → `app/team/page.tsx:86` (`<section id="leadership">`)

⚠️ **Continua 3 por linha.** Ver §4.2.

### About
- [ ] **(2)** Os **cinco tiles de região viram verticais** — *"five little boxes with the text
      underneath"*, em vez de cinco em linha.
      → `app/about/page.tsx:2038` — o `lg:grid-cols-5`
- [ ] **(4)** Trazer de volta o **scroll de endereços** da landing original — só a faixa de
      baixo, **sem o mapa**. A faixa já existe na home; é portar.
- [x] **(3)** **Mapa menor com o texto ao lado** — lado confirmado em 15-09: **texto à
      esquerda, mapa à direita**, com "Where we work." continuando no topo dos dois.
      → `app/about/page.tsx` — o grid dentro do `<section id="regions">`, e a prop `bare`
      do `WorldCoverageMap`

### Services
- [ ] **(10)** **Grade 4-4-4 na horizontal**, com as duas últimas embaixo. Hoje é 2 colunas.
      → `app/services/page.tsx:57` — o `lg:grid-cols-2`
- [ ] **(9)** Usar o **mesmo backdrop do skyline** da outra página.
      → `app/services/page.tsx:89`
- [ ] **(8)** Trocar a **imagem do hero** — há pessoas de olhos fechados na foto atual.

### Home
- [ ] **(29)** **Tirar as fotos do time do topo** — *"I don't want to see the team faces on
      there at the start."*
      → `app/page.tsx:668` (`<section id="people">`), usa `officialPortrait` de `lib/team.ts`
- [ ] **(32)** **Tirar os endereços** — *"I don't really see it on a landing page."*
      → `LocationsBlock`, importado em `app/page.tsx:51`
- [ ] **(33)** **O mapa parece duplicado** — revisar se sai ou se muda.
      → `WorldCoverageMap`, `app/page.tsx:52`
- [ ] **(34)** **Awards & mentions viram um banner**, sem chamar que fomos finalistas ou
      semifinalistas.
      → `AwardsMentions`, `app/page.tsx:47`

⚠️ **Não comece pela home** sem o retorno da §3.4.

### Cases
- [ ] **(24)** Tirar "related case studies" e "client voice", mantendo só o bloco de métricas.
      ⚠️ **Nenhum dos dois existe no site nem no brief** — `grep` em `docs/` e `app/cases/` não
      acha nada, e ela não rolou a página além do topo. **Perguntar o que são** antes de
      assumir que não há trabalho aqui.

### Aprovado sem mudança
**(6)** resto da About · **(30)** metade de baixo da home · **(31)** o book ·
**(20)** foto da Ásia (Marina Bay Sands) · **(22)** `/cases/unilever` é o modelo dos case
studies — é a nossa própria página, não referência externa, nada a receber.

---

## 2. 5H — requisitos de construção, **travados na aprovação da Rhea**

> 🔴 **Não começar a construir.** A 5H depende da **aprovação da Rhea**, que ainda não
> aconteceu. A Maliha aprovou o desenho na call, mas a fala dela é explícita sobre isso ser um
> passo anterior, não o aval final: *"I love this and **I will sell her on it** very easily."*
> E o item 42 confirma — ela pediu para o gráfico ir na **DM do Guli**, não no grupo, para a
> Rhea não ver antes da hora: *"I know what Ria likes and doesn't like, and if she sees it, she
> panics."*
>
> Construir antes desse retorno é o maior risco de retrabalho da lista, porque não é ajuste de
> página existente — é página nova inteira.

A `/approach` no ar ainda é a versão antiga. O que o Guli apresentou é **desenho**, não código
(ver `docs/brief-guli-approach-5h-10-09-2026.md`). Os itens abaixo são requisitos para essa
construção, para quando ela for liberada.

- [ ] **(36)** Replicar o **slider/carrossel também no desktop** — ela prefere ao formato de
      caixas: *"I think I like this version more than the boxes."*
- [ ] **(37)** **Amarelo sobre branco está ilegível** — *"I can't see the yellow on white."*
      Mexer na cor ou no fundo.
- [ ] **(38)** O **H de "Heart" volta a ser vermelho**, não marrom. Inegociável: o vermelho é
      marca e *"it's close to her heart"* para a Ria. As outras cores são negociáveis.
- [ ] **(39)** `self-assessment` é **uma palavra só** (pode quebrar em duas linhas com hífen).
      `360 assessment` e `situational assessment` estão corretos como estão.
- [ ] **(41)** FAQs são **expand/collapse**, não dropdown.

Levantado pela Dobro, sem resposta na call: o texto do gráfico antigo diverge do que a Ria
mandou para o site (precisa de fonte única, devem ser **25 elementos** nos cinco H's), e a cor
de cada H precisa ser a mesma em todas as aparições.

---

## 3. Travado em decisão — não codar antes

1. ~~**Lado do texto no mapa da About** (item 3).~~ **RESPONDIDO em 15-09: texto à esquerda,
   mapa à direita.** Construído — ver §1/About acima.
2. **"Making the learning real" sai ou fica** na 5H (item 40). Ela pediu para tirar, o Guli
   defendeu manter como call-out forte, a conversa terminou em *"it's up to you"*.
3. **A lista de pessoas da Team** (§4.1). A mais urgente das cinco.
4. **Ordem home × demais páginas** (item 28). Ela decidiu na call que a home vem primeiro —
   *"The landing page first, I guess. There won't be many changes."* Isso inverte o combinado
   com o Guilherme (fechar as outras páginas e voltar na home no fim). O Ricardo confirma com a
   Rhea, já que a orientação anterior veio de quem não é mais a decisora.
5. **Trocar `resourcefulness`** por uma palavra mais curta — pedido do Guli
   (*"please, please change this word for something else"*). Sem resposta na call.
6. **A 5H inteira** (§2) — espera a **aprovação da Rhea**, que a Maliha ficou de conseguir. É o
   maior bloco de trabalho da lista e o que mais custa se for construído antes do aval.

---

## 4. Três armadilhas

### 4.1 O mockup da Team troca as pessoas

Às 12:19, **durante a própria call**, subiu um PNG de página inteira na pasta `Team` do Drive
(cópia em `docs/mockup-team-maliha-14-09-2026.png`). A lista de gente **não bate** com o
`CDNA_04_Team.docx` de 09/09, que é o que está no ar.

| No ar hoje (`lib/team.ts:65-149`) | No mockup |
|---|---|
| Rhea Leckie — CEO, Founder, Author, Head of MENA · UAE | Rhea Leckie — **Founder & CEO · Global** |
| Guilherme Mendes — CEO Americas · Americas | Guilherme Mendes — CEO Americas · Americas |
| Jon Paul Pritchard — Head of Thought Leadership · Asia | JP Pritchard — **Partner** |
| Mike Jackson — Head of UKEE · UK | **não aparece** |
| Genevieve James — Head of Asia · Australia | **não aparece** |
| Nitin Goil — Senior Principal · Asia | **não aparece** |
| — | **Jojo Kearney — Partner · Asia** |
| — | **Zahia Marjan — Partner · GCC & Middle East** |
| — | **Inan (truncado no OCR) — Partner · Global** |

As quotes também são **todas diferentes** das do bloco 2 do documento — que é justamente o
bloco que ela mandou usar na call (item 17). Temos retrato de dois que sairiam e de nenhum dos
três que entrariam.

**Não mexa em `lib/team.ts` até isso ser confirmado com ela.** Pode ser mockup ilustrativo com
nomes de exemplo, ou pode ser a lista real. A diferença são dias de trabalho.

O mockup traz ainda: menu **sem "Books"**, **"Our Approach"** no lugar de "Approach (5H)",
ícone de busca que não temos, e um **CTA final** ("LET'S TALK") que a página não tem.

### 4.2 O "um card por linha" não foi pedido dela

Foi **sugestão do Guli** na call (*"do you want it maybe just one person in each line?"*). Ela
respondeu apontando para o próprio mockup — que é **3 por linha**, igual ao que já está no ar.
O `CDNA_04_Team.docx` ("portrait grid, three across") concorda. O que muda é só a quote sair de
baixo e ir para o lado (item 16).

### 4.3 "Americas" — o mockup e a fala discordam

Os landmarks do faculty estão definidos no mockup, e três dos cinco não são os nossos
placeholders:

| Região | Nosso placeholder | O mockup |
|---|---|---|
| Americas | `miami.jpg` | **Brooklyn Bridge / Nova York** |
| UK & Europe | `london.jpg` | Big Ben / Parliament |
| GCC & Middle East | `dubai.jpg` | Burj Khalifa |
| Asia | `singapore.jpg` | Marina Bay Sands ✓ (confirmado na call) |
| India | `jaipur.jpg` | **India Gate** |

⚠️ Mas **na call, no mesmo dia**, ela questionou exatamente o Americas: *"when we say Americas
we are talking about South America, Central America"*, e ficou de mandar outra imagem. A fala é
mais nova que o mockup — **espere a imagem dela**. A India também pode precisar trocar
(*"some of our clients are very sensitive"*).

---

## 5. Bloqueado nela — a lista como foi enviada

Nenhum arquivo novo no Drive desde 10/09 **além do mockup da Team**. Esta é a lista que saiu
para ela, na redação enviada:

### Images

| # | Item | Item da transcrição |
|---|---|---|
| 1 | Company logo — to replace the placeholder at the top | (1) |
| 2 | Hero + background images for **every page**. Ela mencionou que cada página precisa das duas, e que listaria no grupo exatamente quais | (11) |
| 3 | Services grid images — para o layout 4-4-4 com as duas últimas embaixo, **mais a troca da imagem de hero atual** | (12) + (8) |
| 4 | Team photo — a do time sentado na escada | (5) |
| 5 | Photos for the About page | (7) |
| 6 | Uma imagem para **"Americas"** — ela ficou de mandar. *E devemos trocar a imagem da India também?* | (20) |
| 7 | Logos Harvard Business Impact e Imperial College. Se preferir, a gente acha e manda para ela aprovar | (15) |

### Content

| # | Item | Item da transcrição |
|---|---|---|
| 8 | O **template do drill-down** de cada serviço — como ela quer que pareça e funcione | (14) |
| 9 | A referência de **client impact / case studies** que ela mostrou na tela | ⚠️ ver abaixo |
| 10 | A **landing page de Services** | (27) |

### ⚠️ Três coisas ficaram de fora da lista enviada

**a) O item 9 pede algo que talvez não exista.** A "reference you showed us on screen" foi
conferida nos frames da tela compartilhada: era a **nossa própria** `/cases/unilever` no alpha
(`consulting-dna-corporate-alpha.vercel.app`), e a fala dela foi *"this will ultimately be the
inspiration behind the case studies"* — item 22 da transcrição, que conclui **"nada a receber
aqui"**. O que de fato está pendente com ela é outra coisa: a **página top-level de Clients &
Impact** (item 25 — *"it's not ready yet"*). Se o item 9 quis dizer isso, vale reformular; se
ela responder mandando um print da nossa própria página, foi isso que aconteceu.

**b) Os case studies em si não foram pedidos.** São **3 de 23 prontos**. Ela confirmou que não
precisa dos 23 para ir ao ar, mas precisa de *"at least a handful"* — e foi explícita de que
dois ou três **não bastam** (item 26). Isso trava a landing de Services (item 10 da lista
acima), porque os call-outs de case study dependem deles. É o item mais estruturante da lista e
não está nela.

**c) O Word consolidando os e-mails da Rhea não foi pedido.** Ela mesma levantou na call que
*"all I get is emails"* e ficou de consolidar (item 11 da tabela da transcrição). Sem isso, a
fonte de conteúdo continua sendo thread de e-mail.

### E o que não é asset: as perguntas

A lista acima é só de **arquivos**. As decisões travadas da §3 são outra frente e precisam de
resposta separada — em especial a **§4.1, a lista de pessoas da Team**, que não aparece em
lugar nenhum da lista enviada e é o maior risco de retrabalho do projeto.

### Outros combinados da call

**(21)** o MVP vai ao ar só com os client directors, senior practitioners entram depois.
**(42)** o gráfico 5H vai na DM do Guli, não no grupo. **(7)** ela avisou que pode pedir rework
da About no fim, porque a Ria quer fechar as outras páginas antes.

---

## 6. Ordem sugerida

1. **Team** — remover o global presence (19). Isolado, certo, uma linha.
2. **Services** — a grade 4-4-4 (10). O layout não depende das imagens novas.
3. **About** — os cinco tiles (2) e o scroll de endereços (4). O mapa (3) saiu do bloqueio em
   15-09, com o texto à esquerda, e já está feito.
4. **Home** — só depois de confirmar a ordem com a Rhea (§3.4).
5. **5H** — construção nova a partir do desenho do Guli. Maior bloco de trabalho da lista.
   🔴 **Só depois da aprovação da Rhea** (§2). Não é o próximo da fila — é o último, e pode nem
   entrar nesta rodada se o aval demorar.

A Team completa e a 5H são as duas frentes grandes — e as duas esperam **confirmação**, não
asset. Nos dois casos a confirmação vem de **quem não estava na call**: a lista de pessoas da
Team saiu de um mockup que contradiz o documento, e a 5H precisa do aval da Rhea.

---

## Nota sobre mobile

O Guli levantou que virar linhas em colunas prejudica o texto no mobile. A Maliha confirmou que
**mobile importa**: a empresa faz muitos eventos e quer distribuir QR code levando para o site,
o que é tráfego mobile por definição. Ficou combinado que **qualquer decisão de mobile é falada
com ela**. Ela topou medir com analytics depois.
