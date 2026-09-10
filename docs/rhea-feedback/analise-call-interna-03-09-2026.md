# Análise — call interna de 03/09/2026, 16:09

Transcrição em `transcricao-call-interna-03-09-2026.md`. Esta é a reunião dos três (Ricardo,
Guilherme, Guli) **logo depois** da call com a Rhea, para transformar o feedback dela em plano de
trabalho. A call com a Rhea está em `transcricao-call-03-09-2026.md` / `analise-call-03-09-2026.md`.

Vinte minutos, e o assunto real são **quinze**: a partir de 14:21 a conversa vira um projeto novo,
sem relação com a CDNA (seção 6).

---

## 1. O que ficou decidido

| # | Decisão | Quem levantou |
|---|---|---|
| 1 | **A Rhea escolhe as fotos.** Ninguém aqui tem acesso nem critério para escolher por ela | Ricardo, confirmado por Guilherme e Guli |
| 2 | **O CMS aberto na mão dela está descartado.** "Viável, mas bem mais complexo" — ela entrega documento, a gente implementa | Guilherme propôs, Ricardo respondeu |
| 3 | **Conteúdo antes de layout.** Nada de estruturar página sem texto fechado | Guli |
| 4 | **Limites de tamanho entram como indicativo, não como prescrição** | Guli |
| 5 | **Um documento por página, com uma pasta do Drive ao lado de cada uma**, para conteúdo e imagem chegarem já amarrados à tela | Guli |
| 6 | **O ticker sai de cima do hero** e vai para baixo, sem caixa em volta | Ricardo propôs tirar; Guli propôs mover |
| 7 | **Duas famílias tipográficas** — Poppins fica para corpo, uma mais expressiva para títulos | Guli |
| 8 | **Fotos de header vão precisar de tratamento** — layer vermelho apagado para casar com o tom da marca | Guli |
| 9 | **Perguntar à Rhea quais telas ficam antes de pedir conteúdo** | Ricardo |
| 10 | Canal continua o grupo de WhatsApp dos quatro | Guilherme |

A decisão 2 desbloqueia o `docs/tabela-conteudo-cdna-01-09-2026.md`, que estava parado desde 01/09
esperando exatamente esta resposta ("se a CDNA vai preencher direto no CMS, o entregável é a lista de
links"). **Não vai. É documento.** As Tabelas 1–3 daquele arquivo entram como a parte de Solutions e
Cases do documento novo, em vez de virar entregável separado.

---

## 2. A decisão de método — e a única coisa que precisa sair certa

O argumento do Guli está correto e é o mais importante da call:

> `[08:48]` *"Meu medo é a gente falar 'você tem aqui até 400 palavras', e daí ela falar 'puts, só
> preciso de 20' — ou 'eu preciso de 1.500 pra explicar isso'. […] Depois depilar o site é fácil. Ela
> só vai ter noção do tamanho depois que a gente implementar; só que a gente só vai conseguir
> implementar depois que ela der o conteúdo."*

E o fecho: **"qualquer trabalho que a gente faça sem o conteúdo fechado vai ser retrabalhado depois."**
Isso é verdade e define a ordem de trabalho das próximas duas semanas.

**Mas há uma tensão com o que a Rhea pediu, e ninguém na call notou.** Na reunião da manhã ela pediu
contagem de palavras **duas vezes**, e a segunda foi literal:

> `[28:49]` *"give us a word count. If you tell us that for this page your max word count is 50, but
> for this website I'm going to be 150 — **be prescriptive**. Because the moment you are, and you
> stick to that, otherwise we fall into the pattern of let's explain, let's show example, blah blah."*

Ou seja: ela pediu prescrição, e a decisão interna foi indicativo. As duas coisas se resolvem, mas só
se o documento for montado de um jeito específico:

- **Número em toda linha, sem exceção.** Um campo "máx. 140 caracteres" no cabeçalho de cada bloco.
  É o que o Guli já desenhou na tela em `[10:24]`. Isso cumpre o que ela pediu.
- **Uma frase no topo do documento** dizendo que os números são teto de layout, não meta de escrita —
  que se um bloco pedir mais, é para escrever mais e marcar, que a gente ajusta o desenho. Isso
  preserva o que o Guli quer.
- **O que não pode acontecer** é o documento chegar sem números. Ela pediu explicitamente, em voz
  alta, duas vezes. Documento sem número é promessa quebrada logo na primeira entrega depois da call
  em que ela assumiu o projeto — e o "menos texto" volta como opinião toda semana, que é exatamente o
  problema que os números existiam para resolver.

Ela também deu o remédio para a dúvida do Guli sobre tamanho, e vale usar: `[56:49]` *"send me some
examples and say 'Ria, should it be like this?' — talking will only help 50%, examples will help
more."* Um bloco preenchido de exemplo ao lado de cada campo vazio resolve mais que qualquer número.
É o mesmo princípio que já está escrito no `tabela-conteudo-cdna-01-09-2026.md`.

---

## 3. A especificação do documento, com o inventário real

O Guli descreveu o formato em `[12:38]`: `doc.new`, uma seção por página, e **uma pasta do Drive por
página** para ela arrastar as imagens. O motivo é o certo: `[13:11]` *"o importante pra gente é saber
que página vai pra que conteúdo — senão ela vai acabar te mandando de uma outra organização."*

Colunas por bloco: `Seção · Propósito · O que está no ar hoje · Máx. de caracteres · Texto novo ·
Imagem (nome do arquivo na pasta)`.

Inventário conferido no código hoje — **13 telas públicas, 27 blocos nomeados**:

| Tela | Rota | Blocos | Estado |
|---|---|---|---|
| **Home** | `/` | `real` `solve` `challenges` `impact` `approach` `people` `book` `contact` + hero, marquee de logos, mapa, carrossel, números, prêmios, endorsements | conteúdo real, precisa de edição e de foto larga no hero |
| **Our Identity** | `/our-identity` | `identity` (Our Purpose) · `story` · `values` · `keeping-leadership-real` · `five-h` · `why` · people | ⚠️ **as sete seções são texto de marcação.** É a tela mais vazia do site |
| **Our Approach** | `/approach` | `ip-diagnostics` · `the-five-h` | é a tela que ela mais criticou ("theory and distant / classroom style") |
| **Our Team** | `/our-team` | `leadership` · `group` · `faculty` | ela quer "Our People" como página própria e acha os retratos duros |
| **Our Clients** | `/our-clients` | `wall` · `stories` · `in-the-room` | falta a seção de amplitude (logos por serviço) |
| **Our Impact** | `/our-impact` | `figures` · `testimonials` · `social-impact` · `results` | números precisam ser refeitos (§4) |
| **Solutions** | `/solutions` + 8 slugs | 5 blocos por solution | faltam *The Outcome* e *How CorporateDNA Helps* nas 8 — Tabela 1 |
| **Cases** | `/cases` + 8 slugs | faixa de abertura + quote | falta `Impact` em 7 de 8 e as 8 quotes — Tabelas 2 e 3 |
| **Insights** | `/insights` | — | ela quer alimentar com posts do LinkedIn |
| **Awards** · **Interviews** · **Our Partnerships** | — | sem blocos nomeados | candidatas naturais a colapsar no menu |
| **Privacy · Terms · Cookies** | — | — | fora do pedido |

**A dependência que manda em tudo:** a decisão 9 (perguntar quais telas ficam) é **a montante** do
documento inteiro. Se *Awards*, *Interviews* e *Our Partnerships* saírem do menu, some uma fatia do
pedido; se *Our People* virar página, entra uma tela nova. Montar o documento antes disso é pedir
conteúdo para tela que pode morrer — e é justamente o retrabalho que a decisão 3 quer evitar.

O Guilherme vai mandar as pastas para ela agora. **A pergunta sobre quais telas ficam precisa ir na
mesma mensagem**, senão ela começa a separar foto para uma estrutura que ainda vai mudar.

---

## 4. Decisões de design — e o que já dá para conferir no código

**O ticker.** Está em `app/page.tsx:146`, entre a nav e o hero (`HeroV1`, linha 149). Três detalhes
que a call não tinha:

- O comentário no próprio arquivo diz que ele veio do **briefing de 27/08, item 17** — mover é
  contrariar um item escrito do cliente. Não é impeditivo, mas tem que ser dito no grupo, não feito
  em silêncio.
- Ele **só renderiza se o CMS tiver entradas de 2023+**. Se o CMS estiver vazio hoje, o bloco que
  incomodou na apresentação pode nem estar aparecendo — vale abrir o site antes de mexer.
- Levar para "antes do footer" coloca ele encostado no `AwardsMentions` (linha 565), que já é uma
  faixa de prêmios com cinco logos. **Ou um, ou outro** — os dois juntos repetem o mesmo conteúdo no
  mesmo lugar. Essa escolha ainda não foi feita.

**Os números que a Rhea derrubou estão logo ali,** em `app/page.tsx:115-116`, hardcoded:

- `metric: "2,582"` para o Shell — ela disse que são **6.300 mulheres**.
- `metric: "43", metricLabel: "leaders transformed across APAC & Japan"` para a Coca-Cola — ela disse
  *"nobody cares"*.

São duas linhas, não dependem de conteúdo novo e não dependem de decisão de layout. É a correção mais
barata da lista inteira e a mais visível para ela na próxima vez que abrir o site.

**Cor.** O Guli vai estudar uma *accent color* que funcione com o vermelho, aproveitando a paleta do
5H. A observação dele sobre a Rhea ter background indiano é útil como leitura de repertório, mas
convém não fixar decisão de paleta nisso — o que ela escreveu no e-mail é concreto e suficiente:
*"the photography introduces blues, greens, warm neutrals, skin tones"*. **A cor vem da fotografia**,
que é justamente o que ainda não temos. Estudo de accent agora, decisão depois das fotos.

**Tipografia.** Segunda família junto com a Poppins — ela já concordou na call da manhã `[14:27]`.
Não depende de conteúdo, dá para adiantar.

---

## 5. O que ficou sem dono ou sem data

1. **Não há prazo da Rhea para devolver o conteúdo.** Ricardo perguntou (`[05:08]`), a resposta foi
   "não". Com lançamento em 15/09 e a janela dela fechando em 12/09 (viaja para Bangkok), **este é o
   único risco que importa** — e é o mesmo que a análise da call da manhã já tinha apontado como não
   resolvido. Continua não resolvido. A data de devolução precisa sair no grupo, por escrito, junto
   com o documento.
2. **A conta do escopo continua não feita.** A call da manhã criou dois vídeos, roda do 5H
   interativa, página nova, seção nova e serviço novo. Esta call não mencionou nenhum deles. O plano
   aqui é só conteúdo e acabamento — o que está certo como prioridade, mas significa que a lista de
   "fica para depois do lançamento" ainda não existe em lugar nenhum.
3. **Ticker vs. AwardsMentions** — a escolha entre os dois (§4) não foi feita.
4. O Guilherme vai montar um documento com os itens da reunião com a Rhea e marcar o que o Guli deve
   olhar primeiro (`[04:22]`). Não tem data.

---

## 6. Assunto novo — projeto do Felipe (fora da CDNA)

De `[14:21]` a `[19:44]`. Registrado aqui porque não tem outro lugar; não tem relação com a CDNA.

- **Reunião terça, 10h30**, com o Felipe. Convite já enviado, título soa como "Website Andes" (nome
  incerto na gravação). Ricardo e Guli confirmaram presença.
- **Quem é:** fundador, 25 anos de banco, formado no HSBC junto com o Guilherme. Guilherme é sócio
  comercial; o Felipe é o lado financeiro.
- **O que faz:** estruturação de dívida, e criação de **vertical financeira dentro de empresas
  grandes** — o modelo Banco Carrefour. Ele fez o Carrefour e o Banco Renault.
- **Site:** não existe nada. Projeto do zero.
- **Alvo:** empresas grandes brasileiras sem vertical financeira — PPG, Grupo Positivo, Paraná Banco,
  Grupo Pegoraro (maior distribuidor de alimentos do sul).
- **Posicionamento:** sério como banco, mas *"não tão Nubank, mas também não tão Citibank"*.
- **A definição de sucesso, que é o que importa para o briefing:** `[18:49]` — o site **não** serve
  para captar cliente nem tráfego. Serve para o cara olhar depois que o Guilherme já abriu a porta.
  *"A Ferrari dentro da garagem não precisa tá lá na porta tocando. Quando o cara abrir a garagem:
  'puta que pariu'."* → **é site de credencial, não de aquisição.** Isso muda tudo — sem blog, sem
  SEO, sem formulário; peso todo em prova e apresentação.
- **Recorrência:** cada banco novo criado dentro de uma empresa vira um site. O Guilherme está
  entrando para aumentar o escopo dessa frente.
- O Guilherme manda material e o perfil dele antes de terça.

---

## 7. Próximos passos

**Hoje, na mesma mensagem para a Rhea** (as duas coisas juntas, senão ela trabalha em cima de
estrutura que vai mudar):

1. As pastas do Drive, com o pedido para ela criar subpastas "conteúdo novo" e nomear os arquivos de
   um jeito que a gente saiba a que bloco pertencem — Guilherme.
2. **A pergunta sobre quais telas ficam**, com a lista das 13 e as três candidatas a colapsar.
3. **A data em que ela devolve.** Uma pergunta, uma linha.

**Assim que a lista de telas voltar:**

4. Montar o documento — página → bloco → propósito → o que está no ar → máx. de caracteres → texto
   novo → imagem, com um bloco de exemplo preenchido ao lado de cada campo vazio, e as Tabelas 1–3 do
   `tabela-conteudo-cdna-01-09-2026.md` incorporadas como as partes de Solutions e Cases.
5. Uma pasta do Drive por página, linkada na própria linha do documento.

**Em paralelo, não depende de conteúdo:**

6. Corrigir Shell (6.300) e revisar Coca-Cola — `app/page.tsx:115-116`.
7. Decidir ticker vs. `AwardsMentions` e mover/remover, avisando no grupo que contraria o item 17 do
   briefing de 27/08.
8. Estudo de *accent color* e par tipográfico.
9. Mandar as 2–3 referências da roda do 5H no grupo, como ela pediu.

**Terça:** reunião do projeto do Felipe.
