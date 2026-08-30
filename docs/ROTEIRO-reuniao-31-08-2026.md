# Roteiro da reunião — 31/08/2026

**Objetivo:** passar item a item o brief de 27/08, mostrando na tela o que está feito e saindo com
as decisões que travam o lançamento.

**Base:** `https://consulting-dna-corporate-alpha.vercel.app` — todos os links abaixo são relativos
a ela. Os anchors foram conferidos no ar em 30/08.

**Legenda:**

| | |
| :-- | :-- |
| ✅ | feito — é só mostrar |
| 🎨 | falta design (Guli) |
| 🟠 | falta conteúdo ou decisão (CDNA) |
| ⛔ | trava o dia 1º |

---

## Antes de abrir a tela

**Duas coisas aparecem quebradas e nenhuma é design.** Falar antes, para não gastar tempo de
reunião com elas:

1. **O menu de Solutions ainda lista as nove antigas**, com Inclusion & Diversity no meio. As oito
   confirmadas estão no sistema de conteúdo; falta aplicar a virada no banco do ambiente de
   revisão. É nosso e é rápido.
2. **O ticker não aparece** porque ainda não tem itens. Ele não ocupa espaço até ter o que dizer.

**E um enquadramento para abrir:** o design que o Guli apresentou já foi aprovado, e é o que está
aplicado. O que a reunião precisa fechar não é aquilo — é (a) o conteúdo que falta e (b) as telas
que o Guli ainda não desenhou.

---

## Item 1 — Homepage, nova hierarquia

**Abrir:** `/` · seções `#top` e `#real`

**Mostrar:** a primeira tela inteira — "Keeping Leadership Real", a sub-linha aprovada, e CEOs,
CHROs & CLOs aparecendo sem rolar. Depois descer um pouco até o bloco dos seis termos.

- ✅ Headline nova, sub-linha aprovada, público na primeira tela. O "When the stakes are high"
  migrou para a sub-linha, como o item pede.
- ✅ O bloco `#real` existe: real pressures, real politics, real choices, real judgement, real
  people, real consequences — e nada além disso. Uma frase de abertura seria copy inventada.
- 🎨 **O tratamento visual desse bloco ainda é do Guli.** O que está no ar é a estrutura
  funcionando com o espaçamento do sistema atual, não uma proposta de layout. O item pede "curta e
  visual" — o curto está feito, o visual não.

---

## Item 2 — Proof muito mais cedo

**Abrir:** `/` · rolar de `#top` até `#impact`

**Mostrar:** que os números e o logo wall vêm **antes** do "What we solve" (`#solve`), e que o 90%
Chairman/CXO lidera a faixa de números.

- ✅ A home corre Claim → Proof → Explanation.
- ✅ 90% no lugar do 18 years.
- 🟠 **Registrar em voz alta:** este é o único ponto onde o e-mail do Guilherme e o mock do Guli se
  contradizem — o mock da Our Impact põe 18 years primeiro. Seguimos o e-mail. Confirmar que está
  certo.

---

## Item 3 — Navegação final

**Mostrar:** o menu do topo, em qualquer página.

- ✅ Home explícito, "Our Solutions" e "Our Books" renomeados, Our News → Our Partnerships.
- 🟠 **Our Partnerships e Our Team estão fora do menu** até terem conteúdo. Publicar é uma linha de
  código — é decisão deles, não trabalho.
- 🟠 **Our Books não tem página** (`/books` dá 404). Nosso plano: manter o link para o bloco do
  livro na home no dia 1º e criar a página quando houver um segundo livro. Confirmar.

---

## Item 4 — Our Identity ⛔

**Abrir:** `/our-identity`

**Mostrar:** os sete blocos na ordem do item 4, todos vazios. Rolar a página inteira devagar — o
vazio é o argumento.

- ✅ Os sete blocos existem. Três não existiam antes: Our Purpose, Keeping Leadership Real e a
  referência ao 5H. Londres e o ponto de vista do fundador ficaram **dentro** de Our Story, como o
  item pede.
- 🟠 **Falta todo o texto.** É a maior dependência de conteúdo do projeto.
- 🎨 O Guli ainda não desenhou esta tela.

**Perguntar:**
1. Quando conseguem mandar os textos?
2. "Why We Are Different" (Rhea, JP, Nitin) não está na lista de sete. Fica na página?
3. A frase que o item manda preservar em Our Purpose não existe no site atual — procuramos.
   Então é escrever pela primeira vez, não preservar. Ok?

**Nossa recomendação:** texto primeiro, design depois. O Guli desenha em cima do texto que existir
de fato — desenhar bloco vazio e encaixar copy depois deixa o layout brigando com o tamanho do
texto, e o item 16 pede menos scroll, que antes de design é decisão de quanto texto tem.

---

## Item 5 — Our Solutions

**Abrir:** `/solutions`

**Mostrar:** as black boxes, **passando o mouse** para a animação diagonal aparecer. Depois entrar
em uma solution para mostrar os cinco blocos.

- ✅ Black boxes aplicadas, índice liderado pelo outcome, cinco blocos no CMS com ajuda em cada
  campo.
- 🟠 Falta a reautoria das oito no formato curto.
- 🟠 Falta definir a ordem do índice — hoje sai na ordem do CMS. Sugerimos a ordem do e-mail deles.
- ⚠️ Lembrar que o menu ainda mostra a lista antiga.

---

## Item 6 — Flagship cases

**Abrir:** `/cases`

- 🟠 Faltam os dois TBC: **Manager Development** e **Executive Coaching**.
- 🟠 **Decisão:** o mock do listing mostra um dropdown por indústria como lógica principal de
  descoberta — que é exatamente o que este item proíbe. Cabe como filtro secundário, com a
  descoberta principal por Solution. Do jeito desenhado, não. Como preferem?

---

## Item 7 — Formato do case study

**Abrir:** `/cases/unilever`

**Mostrar:** a faixa de cinco fatos no topo, antes da história.

- ✅ A faixa renderiza na ordem do item e só mostra o que estiver preenchido.
- ✅ Campo "Headline" separado do nome do cliente. Vale explicar por quê: o campo do nome é o mesmo
  que encontra o logo e a cor da marca da faixa, então escrever a frase longa ali apagava os dois.
- 🟠 Falta preencher a faixa em cada case, e as quotes no padrão John Murphy / Jorge Gardino.
- 🎨 A seção "The 5H® Framework" dentro do case, que está no mock, ainda não foi construída.

**Perguntar ao Guli:** o mock não mostra a faixa de cinco fatos — abre com headline e métrica.
Seguimos o e-mail, que a exige. Você omitiu ou substituiu?

---

## Item 8 — Our Clients ✅

**Abrir:** `/our-clients` · seções `#wall`, `#stories`, `#in-the-room`

**Mostrar, nesta ordem:** o título → `#wall` com os logos passando → `#stories` com as faixas
dissolvendo na cor da marca → o mapa de global footprint → `#in-the-room` com a foto e a frase.

- ✅ **Consideramos esta página fechada.** Falta só eles confirmarem que está certa.
- ✅ A ordem é a do próprio item: wall mostra amplitude e calibre, as faixas mostram profundidade.
  O título "Client Stories" existe para separar os dois — sem ele a página lia como duas listas de
  clientes seguidas.
- 🟠 Falta aprovação dos nomes e logos, e da frase de fechamento ("We cut cross cultural
  boundaries…"), que veio do site antigo e não passou por aprovação neste ciclo.

**Perguntar:** o item 15 pede preto e branco para os retratos do time, e a foto que mandaram para o
rodapé desta página também é P&B. Mas o carrossel do Social Impact está colorido. **A fotografia é
P&B em todo o site, ou só nos retratos?**

**Registrar (é nosso, não deles):** o sistema de conteúdo já tem campo de logo e de cor de marca em
cada case, e o site ainda não lê nenhum dos dois — usa um arquivo nosso, achado pelo nome do
cliente. Logo subido lá hoje não muda nada na página. Ligar isso está na nossa lista. Dizer antes
que alguém gaste tempo subindo arquivo.

---

## Item 9 — Our Impact

**Abrir:** `/our-impact` · seções `#figures`, `#testimonials`, `#social-impact`, `#results`,
`#awards`

**Mostrar:** a sequência inteira, sinalizando que "Our clients say" está de pé e **vazio de
propósito**.

- ✅ A página segue a sequência do mock.
- 🟠 ⛔ **Três definições travam a página:**
  1. **Quais números são os certos?** O mock usa 18 years / 36 countries / 75 faculty / 90%
     Chairman. O site antigo tem uma seção "By the numbers" com **nove** indicadores diferentes.
  2. **"Measurable results" e "impact statistics" são a mesma coisa, ou dois blocos?**
  3. **O que são "programme outcomes" e "evidence across regions"?** Nenhum dos dois tem descrição
     no brief nem existe no site antigo — nós também não sabemos o que são.

  *Nossa hipótese, mais rápido confirmar do que responder do zero:* os nove números do site antigo
  se separam sozinhos em dois grupos — os da empresa (fundação, países, leadership teams, coaching
  clients, top FTSE 10) e os de programa (NPS, engagement, programme impact, talent promoted). Se
  "impact statistics" for o primeiro e "programme outcomes" o segundo, a página tem duas faixas de
  números e "measurable results" é o guarda-chuva das duas.

- 🎨 A tela não está terminada: programme outcomes sem tratamento, evidence across regions como
  título sem forma, e os "dashboards" do item não apareceram. **A resposta acima destrava o design
  junto.**
- 🟠 Our Social Impact e Awards não estão neste item — vieram do site antigo. Faz sentido, mas
  confirmar.
- 🟠 **Decisão:** Awards aparece hoje na home **e** na Our Impact. Foi movido para cá, mas nunca
  houve mock da home, e o item 2 pede proof cedo na home. Fica em um dos dois, ou nos dois?

---

## Item 10 — Our Approach / 5H

**Abrir:** `/approach` · seções `#the-five-h` e `#fh-panel`

**Mostrar:** a introdução redesenhada, depois **clicar em um H** (Heart, por exemplo) e deixar
rodar — as cinco dimensões passam uma a uma, e a régua Inner/Outer Game inverte conforme se navega.

- ✅ Explorer reconstruído com as **25 dimensões**, transcritas da roda deles com a grafia deles.
- 🟠 **Sign-off nas 25 dimensões antes de produção — é IP deles.** Dizer onde olhar: é a linha que
  fica girando dentro da seção Inner & Outer Game. O que precisa de aprovação é esse texto, não o
  design em volta.
- 🟠 **A ordem dentro de cada faculdade é nossa.** A roda é um círculo sem começo e o mock não fixa
  sequência, então lemos cada faculdade ao longo do arco. Se quiserem outra, é uma linha.
- 🟠 **Três afirmações antigas nesta página, nunca fechadas:**
  - "95% of our clients cite 5H® as the real secret of our success" — confirmar ou tirar.
  - **"across 26 countries", em quatro lugares, contra 36 countries em todo o resto do site.** É a
    única contradição direta do site: mesmo fato, dois números.
  - "over ten years" para o 5H, a um clique de "18 years" — pode estar certo, mas lê como conflito.

**Perguntar (Guli + CDNA juntos):**
1. O item manda manter o 5H wheel. Nosso entendimento é que a seção nova **já é** a roda em leitura
   moderna, então ela não volta como imagem. Confirmam?
2. A **DNA-strand imagery** continua na página e não foi substituída. Agora que existe a seção nova
   acima dela, fica ou sai?
3. **"O highlighting de um H sem explicação"** — não conseguimos identificar do que se trata. Podem
   apontar onde está?

---

## Item 11 — Frameworks e diagnostics proprietários

**Abrir:** `/approach` · seção `#ip-diagnostics`

- ✅ Team Climate Assessment removido do bloco de IP proprietário.
- 🟠 Falta definir quais entram. A estrutura está preparada e vazia, como o brief pede — não
  inventamos nenhum nome.

---

## Item 12 — Our Partnerships

**Abrir:** `/our-partnerships` (fora do menu)

- ✅ O tipo existe no CMS com o campo "o que esta parceria permite para nossos clientes" como
  **obrigatório**, e a rota lê de lá. Nenhum nome fixo no código.
- 🟠 Falta a confirmação da lista — Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin,
  mais qualquer outra validada — e o texto de cada uma respondendo àquela pergunta. O brief é
  explícito que logo e anúncio não bastam.
- 🎨 Sem design. **Mesma recomendação de Our Identity:** conteúdo e imagens primeiro. Quantas
  parcerias são, o tamanho de cada descrição e se cada uma tem imagem utilizável mudam o layout
  inteiro.

---

## Item 13 — Vídeos de depoimento

- ✅ O vídeo compilado saiu do site público. A estrutura modular para os individuais está pronta,
  com o cliente como campo de primeira classe — para a over-representação aparecer na listagem em
  vez de ficar escondida no título.
- 🟠 Faltam os vídeos: Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas. **Não travam o
  lançamento.**

---

## Item 14 — Vídeo CorporateDNA

- 🟠 Falta previsão. Estrutura preparada. **Não trava o lançamento.**

---

## Item 15 — Our Team

**Abrir:** `/our-team` (fora do menu) · seções `#leadership`, `#faculty`, `#group`

- ✅ A rota existe.
- 🟠 Faltam a foto de grupo, os retratos em preto e branco e a lista final de quem aparece.
- 🎨 O tratamento visual do time não veio nesta leva.

---

## Item 16 — Direção visual geral

- ✅ Our Clients encurtou, cortando altura sem conteúdo — o hero escuro e os cabeçalhos repetidos.
  O cabeçalho de página ganhou uma variante compacta que as outras podem adotar.
- **Dizer com todas as letras:** redução de texto é **conteúdo**, não design. O que o design
  entrega é redução de **scroll**, que não é a mesma coisa. O texto atual foi aprovado por eles no
  ciclo anterior, e cortar por conta própria contrariaria a regra do próprio brief.
- 🎨 Duas emendas visuais sobraram na home, e mudam o ritmo de cor da página inteira:
  - `#solve` e `#impact` são os dois brancos e agora vizinhos, com o alinhamento trocando de
    centralizado para à esquerda no meio da rolagem. A faixa escura separava os dois.
  - A mesma colisão entre o bloco do livro e o de escritórios.

---

## Item 17 — Running ticker

**Abrir:** `/` · topo, logo abaixo da navegação

**Mostrar:** onde ele fica — hoje invisível por não ter itens.

- ✅ No topo, abaixo da nav, onde o site antigo carregava. Faixa escura, texto branco, sublinhado
  só onde há link.
- ✅ Decisão registrada: categoria e data não aparecem na faixa. O item lista Awards, regiões,
  escritórios, parcerias e marcos como **conteúdo** que entra, não como rótulo a imprimir.
- 🟠 **Atalho que talvez dispense trabalho deles:** se for só para trazer a faixa do site antigo
  como está, é falar que a gente faz. Não fizemos por conta porque a faixa antiga é anterior ao
  corte de 2023 que o item pede.
- 🟠 **O que não conseguimos resolver sozinhos são os links.** No site antigo alguns itens eram
  clicáveis. O campo existe e funciona — mas link tem que levar a algum lugar, e para vários desses
  itens não há destino óbvio no site novo. **Os itens têm link? Cada um vai para onde?**

---

## Item 18 — O que deve ser preservado

- ✅ Verificado item por item, nada foi removido. Vale citar **Insights**: saiu do menu mas continua
  vivo e linkado no rodapé, porque este item exige preservar o Reports & Resources — e uma página
  que ninguém linka está preservada só no nome.

---

## Item 19 — Target e forma de execução ⛔

- O tracker em anexo está nos baldes que o item pediu.
- ⛔ **"Launch no dia 1º" significa o ambiente de revisão completo, ou o domínio virando?** Hoje o
  corporatednaconsulting.com ainda serve o site antigo. A virada é rápida — dois registros de DNS —
  mas não está em nenhum tracker, e as duas leituras pedem quantidades bem diferentes de folga.
- 🟠 **Como o conteúdo chega:** já validado, ou a gente propõe e vocês revisam? Já houve retrabalho
  nesse ponto, e imaginamos que a Rhea vai querer olhar antes de publicar de qualquer forma.

---

# O que precisa sair da reunião

Se o tempo apertar, estas são as que realmente mudam o planejamento — nesta ordem:

1. **Launch dia 1º = alpha completo ou domínio virando?** (item 19) — muda tudo.
2. **Quando chega o texto de Our Identity?** (item 4) — sete blocos vazios, e o design espera o
   texto.
3. **As três definições da Our Impact** (item 9) — travam a página e destravam o Guli junto.
4. **Sign-off nas 25 dimensões do 5H** (item 10) — é IP deles, não vai para produção sem.
5. **Conteúdo do ticker, ou o "ok, traz o antigo"** (item 17).
6. **P&B: todas as fotos ou só os retratos?** (itens 8 e 15).

## Telas que o Guli ainda não desenhou

Vale fechar a lista com ele na própria reunião, já que o design aprovado não cobre estas:

| Tela | Situação |
| :-- | :-- |
| Our Identity | Não começou — recomendamos depois do texto |
| Our Partnerships | Não começou — recomendamos depois do conteúdo |
| Our Team | Não começou |
| Our Impact | Pela metade — depende das definições do item 9 |
| Bloco "Keeping Leadership Real" na home | Estrutura de pé, sem tratamento visual |
| As duas emendas da home | `#solve`/`#impact` e livro/escritórios |
| "The 5H® Framework" dentro do case | Está no mock, não foi construída |
