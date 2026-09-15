# O que falta — pós-call de 14/09

**Para:** Beto
**Fonte:** call com a Maliha em 14/09 (`docs/transcricao-maliha-14-09-2026.md`, 42 pedidos
numerados) + o que está no Drive dela hoje.
**Atualizado:** 14/09/2026, depois da daily.

Os números entre parênteses — (item 12) — apontam para a lista numerada da transcrição.

---

## Antes de começar: três coisas não são o que pareciam

**1. A página de Team já existe e já usa o template dela.** `app/team/page.tsx` (683 linhas)
foi construída a partir do `CDNA_04_Team.docx` que está no Drive desde 09/09, e as 4 fotos
também já estão no repo. Não há "criar a Team" — há **corrigir** a Team.

**2. Mas o mockup que ela subiu hoje troca as pessoas.** Às 12:19 de hoje, durante a call, ela
subiu um PNG na pasta `Team` do Drive ([link](https://drive.google.com/file/d/1x-EGnLi2GqtbS-YjWjp4iFQs8eSdalO4/view)).
É uma página inteira desenhada — e a lista de gente não é a mesma do documento de 09/09 que a
gente seguiu. **Detalhe na seção "A Team mudou" mais abaixo.** Isso é o maior risco de
retrabalho da lista inteira.

**3. A 5H não é ajuste, é construção.** O que o Guli apresentou na call é **desenho**, não
código. A `/approach` no ar ainda é a versão antiga, sem carrossel e sem o gráfico redesenhado
(ver `docs/brief-guli-approach-5h-10-09-2026.md`, o briefing que gerou esse desenho). Os itens
36 a 41 da transcrição são requisitos para essa construção, não correções de algo existente.

---

## Nossa parte — dá para começar agora

Nada aqui depende de a Maliha mandar coisa nenhuma.

### Team
| # | O que | Onde |
|---|---|---|
| 19 | **Remover o bloco de global presence.** Ela foi explícita: *"we can remove the global presence from this page"*, e o mockup confirma — os escritórios aparecem só no rodapé | `app/team/page.tsx:661` — o `<div id="presence">` com o `LocationsBlock` |
| 16 | **A quote sai de baixo do nome e vai para o lado do retrato**, num card claro com aspas vermelhas grandes. Sob a foto ficam só nome, cargo e região | `app/team/page.tsx:86` (`<section id="leadership">`) |

⚠️ **Continua sendo 3 por linha.** O "um por linha" que eu tinha anotado era **sugestão do
Guli**, não pedido dela — ela respondeu apontando para o próprio mockup, que mantém a grade de
três. O `CDNA_04_Team.docx` ("portrait grid, three across") e o mockup concordam nisso.

### About
| # | O que | Onde |
|---|---|---|
| 2 | **Os cinco tiles de região deixam de ser cinco em linha.** Ela quer *"five little boxes with the text underneath"* | `app/about/page.tsx:2038` — o `lg:grid-cols-5` |
| 3 | **Mapa menor com o texto ao lado.** "Where we work" continua no topo; o corpo com "Headquarters in London" sai de baixo do mapa | `app/about/page.tsx:1969-1999` — `<section id="regions">` + `<WorldCoverageMap>` |
| 4 | **Trazer o scroll de endereços da landing original**, só a faixa de baixo, **sem o mapa** | a faixa existe na home; é portar para a About |

✅ O item 3 tinha um conflito na fala — *"the text on the left-hand side"* e, na frase
seguinte, *"we can have that on the right"*. **Respondido em 15-09: texto à esquerda, mapa à
direita.** Feito.

### Services
| # | O que | Onde |
|---|---|---|
| 10 | **Grade 4-4-4 na horizontal, com as duas últimas embaixo.** Hoje é `lg:grid-cols-2` | `app/services/page.tsx:57` |
| 9 | **Mesmo backdrop do skyline** usado na outra página | `app/services/page.tsx:89` |

O layout dá para montar agora com o que já está lá; as imagens novas entram depois (ver
"Bloqueado nela").

### Home
| # | O que | Onde |
|---|---|---|
| 29 | **Tirar as fotos do time do topo** — *"I don't want to see the team faces on there at the start"* | `app/page.tsx:668` (`<section id="people">`), usa `officialPortrait` de `lib/team.ts` |
| 32 | **Tirar os endereços** — *"I don't really see it on a landing page"* | o `LocationsBlock` importado em `app/page.tsx:51` |
| 33 | **O mapa parece duplicado** — revisar se some ou se muda | `WorldCoverageMap`, `app/page.tsx:52` |
| 34 | **Awards & mentions viram banner**, sem chamar finalista/semifinalista | `AwardsMentions`, `app/page.tsx:47` |
| 30, 31 | Metade de baixo fica. O book fica. **Nada a fazer** | — |

⚠️ **A home passou para primeiro** (item 28). Ela decidiu na call: *"The landing page first, I
guess. There won't be many changes."* Isso inverte o que o Guilherme tinha combinado (fechar as
outras páginas e voltar na home no fim). O Ricardo vai confirmar com a Rhea — **não comece pela
home sem esse retorno**, porque a ordem foi decidida com quem não é mais a decisora.

---

## Precisa de decisão antes de codar

1. **Lado do texto no mapa da About** (item 3) — perguntado a ela.
2. **"Making the learning real" sai ou fica** na 5H (item 40) — ela pediu para tirar, o Guli
   defendeu manter, terminou em *"it's up to you"*.
3. **A lista de pessoas da Team** — ver abaixo. É a mais urgente.
4. **Ordem home × demais páginas** (item 28).
5. **`resourcefulness`** — o Guli quer uma palavra mais curta; ela não respondeu.

---

## A Team mudou — confirmar antes de tocar

O mockup de hoje e o documento de 09/09 não batem. O que está no ar hoje segue o **documento**.

| No ar hoje (`lib/team.ts:65-149`) | No mockup de hoje |
|---|---|
| Rhea Leckie — CEO, Founder, Author, Head of MENA · UAE | Rhea Leckie — **Founder & CEO · Global** |
| Guilherme Mendes — CEO Americas · Americas | Guilherme Mendes — CEO Americas · Americas |
| Jon Paul Pritchard — Head of Thought Leadership & Innovation · Asia | JP Pritchard — **Partner** |
| Mike Jackson — Head of UKEE · UK | **não aparece** |
| Genevieve James — Head of Asia · Australia | **não aparece** |
| Nitin Goil — Senior Principal · Asia | **não aparece** |
| — | **Jojo Kearney — Partner · Asia** |
| — | **Zahia Marjan — Partner · GCC & Middle East** |
| — | **Inan (nome truncado no OCR) — Partner · Global** |

**As quotes também são todas diferentes** das do bloco 2 do documento — que é justamente o
bloco que ela mandou usar na call (item 17).

Consequências, se o mockup valer:
- Temos retrato de **Mike Jackson** e **Genevieve James**, que sairiam.
- **Não temos** retrato de Jojo Kearney, Zahia Marjan nem Inan.
- O `lib/team.ts` inteiro (nomes, cargos, regiões, quotes) precisa ser reescrito.

O mockup também mostra um menu **sem "Books"** e com **"Our Approach"** no lugar de
"Approach (5H)" — o que reabre o assunto de renomear rotas que já está pendente desde o outline
da About de 08/09.

**Não mexa no `lib/team.ts` até isso ser confirmado com ela.** Pode ser um mockup ilustrativo
com nomes de exemplo, ou pode ser a lista real e nova. A diferença são dias de trabalho.

### O mockup inteiro × a página no ar

Cópia do mockup: `docs/mockup-team-maliha-14-09-2026.png`. Bloco a bloco:

| Bloco | No ar hoje | No mockup |
|---|---|---|
| Hero | Foto escura, eyebrow "OUR TEAM" | Foto clara, breadcrumb **"Home / Team"** e um **lettering manuscrito** "People Real Change A Brighter Tomorrow" com risco vermelho |
| Liderança | "LEADERSHIP" + título "The team behind the work." | "OUR LEADERSHIP" + link **"Meet the full team →"**. Sem o título. |
| Cards | Retrato em cima, nome + cargo + quote empilhados embaixo | **Retrato e quote lado a lado**; sob a foto só nome/cargo/região + um **botão "+"** (expandir bio) |
| Foto de grupo | **Placeholder cinza vazio** | Bloco **"ONE TEAM"** com a foto do time na escada e "Different perspectives. A shared purpose." sobreposto |
| Faculty | 5 tiles com **gradiente vermelho placeholder** | 5 tiles com **fotos reais** e seta → |
| DNA experience | Faixa escura, **3 cards**, "One DNA TEAM" como título da seção | Fundo claro, **4 itens com ícones vermelhos** em linha — "One DNA TEAM" vira o quarto item |
| CTA final | **não existe** | **"LET'S TALK — Ready to make leadership real?"** sobre skyline, com botão |
| Global presence | Mapa + endereço de Londres | **não existe** — só London \| Singapore \| Dubai \| Riyadh no rodapé |

**A foto do grupo na escada está no mockup.** É a que ela perguntou se a gente tinha (item 5 da
transcrição) e é exatamente o que preenche o nosso placeholder vazio. Vale pedir o arquivo em
alta.

**Os landmarks do faculty estão definidos** — e três dos cinco não são os nossos placeholders:

| Região | Nosso placeholder | O mockup |
|---|---|---|
| Americas | `miami.jpg` | **Brooklyn Bridge / Nova York** |
| UK & Europe | `london.jpg` | Big Ben / Parliament |
| GCC & Middle East | `dubai.jpg` | Burj Khalifa |
| Asia | `singapore.jpg` | Marina Bay Sands ✓ (ela confirmou na call) |
| India | `jaipur.jpg` | **India Gate** |

⚠️ **Americas tem conflito.** O mockup usa Nova York, mas **na call, hoje, ela questionou
exatamente isso**: *"when we say Americas we are talking about South America, Central America"*,
e ficou de mandar outra imagem. A fala é mais nova que o mockup — **espere a imagem dela**.

O mockup também mostra um menu **sem "Books"**, com **"Our Approach"** no lugar de
"Approach (5H)", e um ícone de busca que não temos.

---

## Bloqueado nela

Nada disso dá para adiantar. A lista completa está em
`C:\Users\Ricardo\Downloads\pedidos-para-maliha-14-09-2026.txt`, já enviada.

**Imagens** — logo da empresa · hero + background de **todas** as páginas · imagens da grade de
Services · foto do time · fotos da About · imagem para "Americas" · logos Harvard Business
Impact e Imperial College.

**Conteúdo** — template do drill-down de cada serviço · página top-level de Clients & Impact
(*"it's not ready yet"*) · landing page de Services · case studies (3 de 23; ela confirmou que
não precisa dos 23, mas *"at least a handful"*) · o Word consolidando os e-mails da Rhea.

### O que já está no Drive e é nosso trabalho, não espera

Pasta [`CDNA — Photographs for the new website`](https://drive.google.com/drive/folders/1WgYQ_g74k5C5DdHWX1NqBeA3VWFtzcfz):

- **Team** — `CDNA_04_Team.docx` + 4 retratos + o mockup novo de hoje. Já baixado em
  `docs/maliha-drive-10-09/`, menos o mockup.
- **Services** — `CDNA_03_Services.docx`. Baixado.
- **cDNA. Approach** — docx + `CDNA Circle color palette.pdf` + 2 imagens. Baixado.
- **Guli - design and assets** — pasta nossa, criada em 11/09.

Nenhum arquivo novo desde 10/09 **além do mockup da Team**. Ou seja: o que ela prometeu na call
ainda não subiu.

---

## Sugestão de ordem

1. **Team:** remover o global presence (item 19). É isolado, é certo, é uma linha.
2. **Services:** a grade 4-4-4 (item 10). Layout não depende das imagens.
3. **About:** os cinco tiles (item 2) e o scroll de endereços (item 4). O mapa (item 3) fica
   parado até ela responder de que lado vai o texto.
4. **Home:** só depois de confirmar a ordem com a Rhea.
5. **5H:** construção nova, a partir do desenho do Guli. É o maior bloco de trabalho da lista.

A Team completa e a 5H são as duas frentes grandes — e as duas estão esperando uma confirmação,
não um asset.
