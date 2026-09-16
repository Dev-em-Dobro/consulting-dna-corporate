# O que falta para a página de serviço ficar igual ao template da Maliha

**Contexto:** o pacote do Drive de 15-09 trouxe `4. Services/ExCo Leadership Services
Page.png`, que é o item 14 da daily de 14-09 — *"I will get you the drill down of the
template of how we want this to look and feel."* Este doc é a diferença entre aquele
desenho e o que `/services/[slug]` renderiza hoje, depois do que já foi construído.

> O `WEBSITE SERVICE COPY.xlsx` foi conferido linha a linha contra `lib/services.ts`:
> **é a mesma copy que já está no ar**. Banner, impact, how we help e as três partes do
> CTA batem palavra por palavra nos dez. Nada a migrar — o que falta abaixo é copy que
> não existe em documento nenhum.

---

## 1. Já feito, contra o template

- ✅ **Migalha de pão** no herói — "Home / Services / <serviço>".
- ✅ **"Related services"** no pé, quatro cards. Tinha sido removido em 11-09 porque o
  outline não pedia; o template dela fecha a página exatamente com ele.
- ✅ **A landing** (`/services`): grade 4-4-2 com os dois últimos em largura dupla,
  imagem por card, numeração 01–10, "Learn more", e o skyline no herói.

---

## 2. Travado em copy que não existe

### 2.1 Os títulos dos blocos 2 e 3 — **20 linhas**

No template, "THE OUTCOME" e "HOW CORPORATEDNA HELPS" não são só rótulo e parágrafo.
Cada um tem um **título editorial** à esquerda, e o parágrafo à direita:

| | Título (NÃO TEMOS) | Corpo (temos, é o texto do xlsx) |
|---|---|---|
| THE OUTCOME | *"A stronger, more connected senior leadership community."* | "A senior leadership community with greater strategic alignment, decision quality and execution speed. Leaders think enterprise first…" |
| HOW CORPORATEDNA HELPS | *"From ambition to enterprise leadership in practice."* | "We work with the ExCo and top 100–150 leaders to build the Inner Game and Outer Game…" |

O corpo é o nosso, verbatim. O título é **conteúdo novo**: dois por serviço, dez
serviços, 20 linhas. Só existem para o ExCo, e só dentro de um PNG.

**Por que não escrevemos nós:** a regra deste projeto é que a copy do cliente é
transcrição, não autoria (a caixa de abertura de `lib/services.ts` registra isso). Um
título de bloco em serifa a 40px é a segunda coisa que se lê na página — não é
microcópia de interface.

**Enquanto não chega:** os blocos 2 e 3 continuam no desenho de 12-09, com o campo de
cor. Ele funciona e não tem buraco. Trocar para o arranjo de duas colunas dela com a
coluna da esquerda vazia seria pior que os dois.

### 2.2 A régua de cinco do bloco 3

Sob "HOW CORPORATEDNA HELPS", o template tem cinco colunas com ícone, título e uma
linha: *Immersive experiences · Executive coaching · Real business challenges · Peer
learning · Mastery labs*. É o método do ExCo destrinchado.

**Existe só para o ExCo.** Os outros nove precisariam dos seus cinco — 9 x 5 x (título +
linha). Também não está no xlsx nem no docx.

### 2.3 As quatro citações

O próprio `CDNA_03_Services.docx` diz: *"Nine of the ten have no publishable
testimonial. Four have one identified but not chosen: adidas, GSK Mexico, Heineken and
Vodafone."*

O xlsx de 15-09 confirma e é explícito — nas linhas de Culture Transformation, Talent
Development e High Performing Teams, a célula TESTIMONIAL traz **instrução para nós**,
não citação:

> *"Use strongest existing GSK Mexico CEO / senior leader quote here. Ideally, the quote
> should capture the shift from culture as an aspiration to something visibly different…"*

Nós não temos esse acervo de citações. **Continua sendo o trabalho mais barato que mais
muda estas páginas:** quatro frases e quatro atribuições.

Hoje o bloco 5 só renderiza no Executive Coaching, que é o único com texto publicável.

### 2.4 O mapa de "related services"

O template mostra quatro cards ao pé do ExCo: Culture Transformation, Team
Effectiveness, Organisational Transformation e Executive Coaching — e **duas dessas não
são serviços desta lista de dez**. Sem um mapa de afinidade, o bloco sai com os quatro
primeiros da ordem do documento, que é honesto e arbitrário.

Se ela quiser os relacionados certos, é uma linha por serviço: "quais três ou quatro dos
dez vão no pé de cada um".

---

## 3. Duas divergências encontradas no próprio pacote

**a) O xlsx repete a copy de Executive Coaching na linha do ExCo.** As células CASE
STUDIES e TESTIMONIAL da linha 2 (ExCo / Top 150) são idênticas às da linha 10
(Executive Coaching) — "1,000+ leaders coached | 20+ countries | 6–12 session journeys".
O template DELA para o ExCo mostra outra coisa: HEINEKEN, 150 senior leaders, 18 months.
O site está com a versão do template, que é também a do `CDNA_03_Services.docx`. Parece
erro de cópia na planilha; vale confirmar.

**b) A copy dos cards da landing, no desenho dela, não é a banner statement.** O mockup
escreve *"Build a pipeline deep enough that your next leaders are ready before you need
them"*; o documento e a planilha dizem *"Build the leadership pipeline before the
business needs it"*, marcada FINAL. O site está com a do documento. Se ela preferir a do
desenho, são dez linhas novas e um campo novo — não é troca de layout.

---

## 4. O que continua pendente da lista de 14-09, fora de Services

- **A imagem de "Americas"** — ela respondeu "In progress" em 15-09. A India segue sem
  resposta.
- **O arquivo do skyline em largura de dobra.** O PNG que veio é a mesma imagem sem a
  recompressão do WhatsApp, e isso melhorou de verdade — mas continua 1373x1145, e a
  primeira dobra pede ~1920 de largura.
- **O retrato original da Rhea.** O pacote traz de novo o mesmo JPEG de 1536x1024, em
  paisagem. O card dela segue com a versão reenquadrada por IA.
- **O logo em vetor.** O que veio é PNG. Header é o lugar onde vetor mais se paga.
- **A lista de pessoas da Team.** O `CDNA_04_Team.docx` reenviado é o MESMO de 09-09
  (Rhea, Guilherme, Mike, Genevieve, JP, Nitin) e o mockup reenviado é o MESMO de 14-09
  (Rhea, Guilherme, Zahia, JP, Jojo, Inan). Os dois vieram na mesma pasta, no mesmo dia,
  e continuam se contradizendo. **É o maior risco de retrabalho do projeto e ninguém
  respondeu.**
