# Pedido de conteúdo — Solutions e Cases (01/09/2026)

> Continuação de `docs/pedido-conteudo-guilherme-30-08-2026.md`, que era página por página. Este é
> por **campo do CMS**, depois da reestruturação das Solutions feita hoje.
>
> **Backups antes de qualquer escrita:** `docs/backup-cms-solutions-2026-09-01.json` (13 entradas +
> 90 versões) e `docs/backup-cms-cases-2026-09-01.json` (13 + 99 versões + 13 facets). Restauráveis
> entrada por entrada.

---

## O que foi feito no CMS hoje

**Solutions.** As 12 entradas antigas foram despublicadas (não apagadas) e as **8 confirmadas do
brief** foram criadas, publicadas, na ordem do e-mail de 27/08:

| # | Título | slug | flagship |
|---|---|---|---|
| 1 | ExCo / Top 150 | `exco-top-150` | `heineken` |
| 2 | Culture Transformation | `culture-transformation` | `gsk` |
| 3 | Talent Development | `talent-development` | — |
| 4 | Manager Development | `manager-development` | — |
| 5 | Women in Leadership | `women-in-leadership` | `shell` |
| 6 | High Performing Teams | `high-performing-teams` | `gsk` |
| 7 | HRLT Effectiveness | `hrlt-effectiveness` | — |
| 8 | Executive Coaching | `executive-coaching` | — |

`problemStatement`, `body`, banner, `proofRefs` e `resources` foram carregados da entrada antiga
correspondente — nenhum conteúdo se perdeu. `outcome` e `howWeHelp` receberam o marcador
`Pending final copy from CDNA.` para que os blocos **apareçam na tela** e a CDNA veja o que falta.

**Cases.** A faixa do item 7 foi preenchida em três, a partir do bloco "At a glance" que já existia
na prosa deles — realocação, não texto novo. O bloco duplicado saiu do corpo.

| | countries | participants | reach | intervention | impact |
|---|---|---|---|---|---|
| GSK | 26 | 100+ leaders across Asia | 7 year partnership | 2 culture transformations in the Pharma business | — |
| HEINEKEN | 26 | 70+ HiPo successors in APAC | 6 year partnership | APAC Leadership Team | — |
| Unilever | 6 | 200 leaders globally | 7 year partnership | — | — |

**Redirects** ajustados no `next.config.mjs` para os slugs aposentados. Um deles é interino — ver
"Decisões do Guilherme", abaixo.

---

## Os dois buracos maiores

**1. `impact` está vazio em 7 dos 8 cases.** A única métrica de resultado em todo o acervo é o
**88% Net Promoter Score do Shell**. Todo o resto — países, líderes, duração de parceria — é escala,
não impacto. O brief pede que o case abra com evidência visual e feche em resultado; hoje não há
resultado para mostrar. **É o maior buraco de conteúdo do projeto, maior que o das Solutions.**

**2. As 8 quotes são exatamente o que o brief proíbe.** O item 7 diz: *"quotations devem ser
testimonials about CorporateDNA and our work, e não generic client corporate quotes."* Nenhuma das
oito menciona a CorporateDNA — são declarações institucionais sobre cultura, propósito, tecnologia.

Detalhe que fecha o argumento: **o brief cita John Murphy como exemplo do tipo certo.** A quote
atribuída a ele no CMS é *"We continue to invest for sustainable growth in the future..."*, que é
genérica. Existe uma quote melhor dele em algum lugar — vale pedir nominalmente.

Somando com *"nenhum nome, logo, quote ou metric vai para production sem CDNA approval"*, as oito
precisam ser substituídas antes do lançamento.

---

## Proposta de faixa para os outros 5 cases — **não aplicada**

Extraída da prosa existente. Exige interpretação, por isso é proposta e não fato.

| | countries | participants | reach | intervention | impact |
|---|---|---|---|---|---|
| shell | — | leaders across 16 nationalities | Shell Asia | Talent Acceleration Program for Asia (TAPA), 2019 | **88% Net Promoter Score** |
| morgan-stanley | — | top 150 directors | 25 global locations | mindset & behaviours transformation, MD conference 2019 | — |
| coca-cola | — | APAC Leadership Team | 32 APAC markets | culture transformation, 18 meses, 2 tracks | — |
| levis | — | 36 leaders, China leadership team | China | leadership development & executive coaching, 2018–2020 | — |
| aviva | — | Group PLC Board | — | 2 tracks: I&D no Board (2017–18), Accelerating Women Leaders (2016–20) | — |

**`countries` fica vazio nos cinco** porque eles falam em *markets*, *locations* e *nationalities*.
"32 markets" não é 32 países, e preencher como se fosse seria inventar.

---

## Decisões que são do Guilherme, não da CDNA

1. **Para onde aponta `/our-services/leadership-development`.** Leadership Development saiu da
   arquitetura e foi despublicada. Era provavelmente a página de serviço com mais tráfego do site
   antigo. Deixei apontando para `/solutions` para não ficar 404 — é interino, e está comentado no
   código. Candidatos: `manager-development` ou `talent-development`.
2. **Manager Development é solution própria?** Ela não existia: estava fundida em
   "High-Performing Teams & Manager Impact". O brief lista as duas separadas, com flagships
   distintos. Criei como própria, seguindo o brief, mas vale confirmar.

---

---

## ⚠️ Como isto vai ser enviado — decidido em 01/09

**A mensagem longa abaixo não vai ser enviada como está.** Ela mistura três coisas com donos
diferentes, e enterra duas decisões de dois minutos debaixo de um pedido que o Guilherme não
consegue responder sozinho.

| | Quem responde | Prazo real |
|---|---|---|
| Pergunta de processo + 2 decisões | **só o Guilherme** | hoje, 2 minutos |
| 16 campos das Solutions + 8 quotes + impact | Rhea, JP, Nitin — ele precisa delegar | dias |
| O que mudou no CMS | ninguém, é referência | — |

**O que vai agora:** `docs/whats-guilherme-01-09-2026.txt` — WhatsApp curto, só as três perguntas
que são dele.

**A pergunta 1 define o formato do resto.** Se a CDNA for preencher o CMS, o entregável não é
tabela — é uma lista de 8 links com os campos vazios esperando. Se eles mandarem texto, aí sim vale
a tabela. Montar os dois agora é jogar metade fora.

**Quando montar a tabela, cada linha vazia leva um exemplo preenchido ao lado.** Pedir "mandem os
impactos" volta vazio; mostrar o `88% Net Promoter Score` do Shell na coluna ao lado transforma em
"ah, é isso que vocês querem". Foi exatamente o que aconteceu com o "At a glance" — o dado existia
e ninguém tinha percebido que servia.

**Este documento fica como registro**, não como e-mail. Serve para quando alguém perguntar, daqui a
duas semanas, por que o CMS mudou.

---

## 🇧🇷 Mensagem longa — NÃO ENVIAR, base para a tabela futura

Fala, Guilherme, tudo certo?

Aproveitei que você ia olhar conteúdo hoje e deixei o CMS pronto para receber. Antes de listar o que falta, um aviso: **o CMS mudou de cara**, então não estranha.

As 8 Solutions confirmadas no seu e-mail de 27/08 agora existem de verdade, publicadas, na ordem exata que você escreveu. Até hoje o menu ainda listava o conjunto antigo — Inclusion & Diversity, Asian Talent Development e companhia — ou seja, ninguém que abrisse o site via a arquitetura nova. As antigas foram despublicadas, não apagadas, e todo o texto que existia foi carregado para a solution correspondente. Nada se perdeu, e tem backup de tudo.

Também liguei os flagship cases que já existem no CMS: Heineken no ExCo / Top 150, GSK na Culture Transformation e na High Performing Teams, Shell na Women in Leadership.

**Uma pergunta antes de tudo, e ela muda o resto:** eu deixei os campos preparados na tela de cada Solution para vocês preencherem direto no CMS. Isso é o que vocês querem, ou preferem me mandar os textos por e-mail e eu cadastro? Se for para vocês mesmos preencherem, me diz quem vai fazer que eu passo o acesso e o tutorial. Se for para mim, é só mandar em qualquer formato que eu coloco no lugar certo.

**O que falta — Solutions**

O principal: cada Solution tem cinco blocos, e dois estão vazios nas oito. São **The Outcome** (o que muda no negócio) e **How CorporateDNA Helps** (descrição curta da intervenção). Deixei escrito "Pending final copy from CDNA" nos dois, de propósito, para vocês verem os campos na tela em vez de encontrarem espaço em branco. The Challenge já tem texto vindo das páginas antigas — vale reler, porque foi escrito antes do brief.

Quatro coisas pontuais:

1. O texto da Talent Development ainda diz "We shape Asian talent". O brief tirou o "Asian" do nome, mas o corpo ficou. Precisa de uma frase nova de vocês.
2. Manager Development nasceu vazia porque ela não existia — estava fundida numa solution chamada "High-Performing Teams & Manager Impact". Criei separada seguindo o brief. Confirma que é isso mesmo?
3. Faltam os flagships de Manager Development e Executive Coaching, que já estavam como TBC no seu e-mail.
4. Frasers Property e adidas não existem como case no CMS, então Talent Development e HRLT Effectiveness ficaram sem flagship mesmo tendo um definido no brief.

**O que falta — Cases**

Aqui tem duas coisas, e uma é mais séria do que parece.

A faixa de abertura que o brief pede — Countries, Participants, Reach, Intervention, Impact — estava vazia nos oito cases. Descobri que em três deles os números já existiam, escritos como "At a glance" dentro do texto: GSK, Heineken e Unilever. Movi para os campos certos, então esses três já mostram a faixa. Os outros cinco eu consigo propor a partir do texto, mas prefiro que vocês confirmem antes, porque é interpretação minha.

**O ponto sério: o campo Impact está vazio em sete dos oito.** A única métrica de resultado em todo o acervo é o 88% de Net Promoter Score do Shell. Tudo o mais que existe é escala — quantos países, quantos líderes, quantos anos de parceria. Nenhum diz o que mudou no cliente. O brief pede que o case feche em evidência, e hoje não há evidência para fechar. Se existir esse dado em algum lugar, mesmo que em apresentação ou relatório interno, é o que mais faria diferença no site.

**E as quotes precisam ser trocadas — todas as oito.** O brief é específico: as citações devem ser testimonials sobre a CorporateDNA e o trabalho de vocês, não frases institucionais genéricas do cliente. Hoje temos Emma Walmsley falando sobre cultura, Dolf van den Brink sobre renovação, Sunny Jain sobre propósito. Nenhuma menciona vocês.

Um detalhe que ajuda: você citou o John Murphy no brief como exemplo do tipo certo de quote. A que está no CMS atribuída a ele é "We continue to invest for sustainable growth in the future", que é justamente do tipo genérico. Então existe uma quote melhor dele em algum lugar — se você tiver essa, e as equivalentes dos outros, resolve o bloco de evidência inteiro.

**Duas decisões que são suas**

A primeira é de SEO. Leadership Development saiu da arquitetura, e a URL antiga `/our-services/leadership-development` apontava para ela. Era provavelmente a página de serviço com mais tráfego do site antigo. Deixei redirecionando para o índice de Solutions para não virar erro 404, mas isso desperdiça a relevância acumulada. Ela deveria ir para Manager Development ou para Talent Development?

A segunda é a mesma pergunta do Inclusion & Diversity, que também saiu. Essa eu mandaria para o índice mesmo, a não ser que você veja uma sucessora natural.

Abraço,
Ricardo
