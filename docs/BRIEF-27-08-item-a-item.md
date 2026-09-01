# Brief 27-08 — item a item, na ordem do email

Os 19 pontos do `docs/email-guilherme-27-08-2026.txt` na sequência em que ele escreveu, com o
estado de cada um. Atualizado em **2026-09-01**, depois da leva de design do Guli de 31/08 e da
reestruturação das Solutions no CMS.

> **O que mudou nesta atualização (01/09):**
>
> - **As 8 Solutions confirmadas existem no banco**, publicadas, na ordem do e-mail dele. As 12
>   entradas antigas foram despublicadas — não apagadas — com todo o texto migrado. Isso fecha o
>   aviso que estava aqui desde 30/08.
> - **Manager Development nasceu como solution própria.** Não existia: estava fundida numa entrada
>   chamada "High-Performing Teams & Manager Impact".
> - **Quatro flagship cases ligados** (Heineken, GSK ×2, Shell). Frasers Property e adidas não
>   existem como case.
> - **A faixa do item 7 foi preenchida em GSK, Heineken e Unilever**, a partir do "At a glance" que
>   já estava na prosa deles.
> - **A leva de design do Guli de 31/08** está aplicada, mais a resolução dele de 01/09 para o bloco
>   embaixo do hero.
> - **Backups antes de qualquer escrita:** `backup-cms-solutions-2026-09-01.json` e
>   `backup-cms-cases-2026-09-01.json`.
>
> **O que mudou na de 30/08:** o design de 29/08 aplicado — Solutions em black boxes, Our Clients
> com as faixas de cliente, Our Impact na sequência do mock, o 5H reconstruído com as 25 dimensões,
> a home reordenada e o ticker de volta no topo. Our Identity ganhou os sete blocos do item 4.
>
> ⚠️ **Git não diz o que está publicado.** A branch está 33 commits à frente do `origin`
> (tip remoto `4ef7a00`, de 28/08), mas o `alpha` **está com o código local de hoje** — o deploy é
> `vercel` manual, que sobe a cópia de trabalho e não passa pelo `origin`. Verificado no ar em
> 30/08: `/our-clients` mostra o título "Client Stories", que só existe no commit local `3e28d32`,
> e a home mostra os seis termos do item 1, que só existem no HEAD. **Nunca inferir o que está
> publicado a partir de `git rev-list --left-right`. Abrir o site.**
>
> ✅ **O aviso do CMS fechou em 01/09.** O menu de Solutions agora lista os oito nomes confirmados,
> na ordem do e-mail. Os slugs velhos (`inclusion-diversity`, `asian-talent-development`,
> `ceo-top-team-transformation`, `leadership-development`, `talent-succession`) foram despublicados
> e têm redirect. **O ticker continua sem renderizar** — não tem entradas, e isso é conteúdo da
> CDNA, não banco.

**Legenda**

| | Significado |
|---|---|
| ✅ | Feito, no código, `tsc` limpo e build passando |
| 🎨 | **Falta ver com o Guli** — design |
| 🟠 | **Falta do Guilherme / CDNA** — conteúdo, assets, aprovação ou decisão |
| ~~⏳~~ | ~~Falta rodar a migração no CMS~~ — **aposentado em 01/09**: os três tipos novos estão no admin |
| ⚠️ | Conflito ou risco que precisa de decisão |

---

## 1. Homepage — nova hierarquia

**O que ele pediu:** "Keeping Leadership Real" como proposição principal, com a working copy que
ele mesmo aprovou. A primeira tela deixando evidente CEOs, CHROs & CLOs e respondendo três
perguntas: que problema de liderança resolvemos, por que importa, e por que acreditar. Explicar
"Keeping Leadership Real" de forma curta e visual, com *real pressures, real politics, real
choices, real judgement, real people and real consequences*.

✅ Headline e sub-linha aplicadas verbatim do e-mail. CEOs, CHROs & CLOs na primeira tela.
"When the stakes are high" migrou para a sub-linha, como ele pediu.

✅ **O tratamento curto e visual dos seis "reals" existe** — resolvido pelo Guli em 01/09. Era uma
grade 2×3 de cards com os seis termos; virou **uma linha que digita**, ciclando a segunda palavra:
*real pressures → real politics → real choices → real judgement → real people → real consequences*.

O raciocínio: a grade colocava a palavra "real" na tela seis vezes logo abaixo de um hero que já
diz cinco. A linha mantém um "Real" e move o termo. Também é a mesma frase continuando do título
acima, não uma legenda embaixo dele, por isso é dimensionada pelo título.

✅ **As duas frases viraram um bloco só** — resolvido com o Guli ainda em 01/09. Perguntado se
juntava as frases: *"Sim. Duas linhas do 'mesmo texto'"*, com a quebra do mobile escrita por ele:

```
Our purpose
is to make
leadership real.
Real pressures.
```

A linha que digita subiu de 26/30/36 para 30/34/40, igual ao título, e o `mb-10 md:mb-12` entre os
dois saiu. **No mobile as quebras são `<br>` explícitos**, escondidos a partir do `sm` — a segunda
linha é redigitada a cada 55ms, então quebra derivada do conteúdo pularia de lugar conforme a
palavra cresce. **No desktop flui natural**, confirmado em 01/09.

O `RealCycle` fica num `<p>` irmão, fora do `<h2>`: visualmente idêntico, mas um heading que se
reescreve dez vezes por segundo é hostil para leitor de tela e inútil para crawler.

🎨 **Um pedido anterior caducou nessa troca:** o hover vermelho que ele pediu em 31/08 era nas
células da grade 2×3. Não existem mais células. Precisa de forma nova ou morre.

🎨 **Depois da reordenação valeumaolhada do Gulide como ficou o novo ritmo visual da home** 
---

## 2. Proof muito mais cedo

**O que ele pediu:** reorganizar a home para trazer evidence antes. O 90% Chairman/CXO deve
aparecer antes de 18 years. Logos, testimonials, métricas e prova cedo. Claim → Proof →
Explanation, e não long explanation antes de proof.

✅ O logo wall e as estatísticas subiram para entre o hero e o "What we solve", que antes vinha
primeiro. O 90% agora lidera a faixa (`lib/stats.ts`), o que também vale para o Our Impact.

*Observação nossa, não pedido dele:* o bloco do livro é a maior seção da home, com 1.409px —
maior que o hero. Se o Guli for mexer na home, é onde há mais a ganhar contra o item 16.

---

## 3. Navegação final

**O que ele pediu:** Home | Our Identity | Our Solutions | Our Approach | Our Partnerships | Our
Clients | Our Impact | Our Team | Our Books. Home explícito além da logo. `Our News → Our
Partnerships`, `Our Book → Our Books`, e Our Books permitindo livros de vários membros do time.

✅ Home explícito, renames feitos, Our Books no plural. Sete dos nove no menu.

🟠 **Our Partnerships e Our Team estão fora do menu** até terem conteúdo — item de menu que abre
página vazia é pior que item que chega depois. Publicar é uma linha em `lib/nav.ts`.

🟠 **Our Books é o único item sem página.** A frase dele ("deve permitir livros de diferentes
membros do time no futuro") é sobre a estrutura suportar mais de um, não sobre existir página
agora. **Plano:** manter o link para o bloco da home no dia 1º e criar a página quando houver um
segundo livro. Se houver outro livro pronto, muda o plano.

---

## 4. Our Identity

**O que ele pediu:** manter como seção própria e forte, incluindo Our Purpose, Our Story, Our
Values, Keeping Leadership Real, a London origin story, o founder point of view e o 5H como parte
da identidade. Londres tem que entrar na company story, **não como founder quote isolada**.
Preservar a ideia de que o papel de consultores é *cut through complexity, connect the present and
deliver the truth — real problems and real solutions*. O 5H referenciado aqui, com a explicação
completa ficando em Our Approach.

✅ Os sete blocos existem agora, na ordem do item. Três não existiam: Our Purpose, Keeping
Leadership Real e a referência ao 5H. Londres e o founder point of view ficaram **dentro** de Our
Story, como ele pediu. A seção mudou de "Keeping It Real" para **"Keeping Leadership Real"**, que
é o nome que o item 1 promoveu.

🟠 **Todo o texto.** Esta é a página que mais depende deles: os sete blocos estão montados e
todos vazios. A frase "cut through complexity…" que ele manda preservar **não existe em lugar
nenhum do site** — não é preservar, é escrever pela primeira vez.

⚠️ **Our Identity não tem cadastro no CMS** (verificado em 01/09). `app/our-identity/page.tsx` não
importa nada de `lib/cms` — são sete `<section>` de JSX escrito à mão. **Consequência: quando o
texto chegar, é trabalho de dev, não de cadastro.** Ninguém da CDNA consegue publicar esta página
digitando no admin, e por isso a pergunta "vocês preenchem ou nós cadastramos?" não pode ser
respondida em bloco.

**O mapa completo, para não prometer errado:**

| Preenchível no CMS | Só por código |
|---|---|
| home, solutions, cases, our-clients, our-impact, our-partnerships, our-team, insights, awards | **our-identity**, **approach** (o 5H e o bloco de frameworks do item 11), interviews, páginas legais |

É a mesma armadilha já registrada no item 11: se eles responderem "temos mais dois frameworks",
aquilo também é dev, não cadastro.

**Como está colocado com eles:** como pergunta de prazo — *quando conseguem mandar esses textos?*
—, dizendo que não acreditamos que quem deva produzi-los sejamos nós. Nesta página o texto é a
própria identidade da empresa: o que a gente inventasse seria nossa leitura da CDNA, e eles
reescreveriam. Encurtar o site antigo também não serve — três dos sete blocos não têm equivalente
lá. O pedido é direcionamento por bloco: o texto, ou o material bruto mais os pontos que ele tem
que fazer, nas palavras deles.

🟠 **"Why We Are Different" está parado desde o brief de 05/08**, com a Rhea, o JP e o Nitin. E
não está na lista de sete itens do item 4 — perguntar se continua na página.

🎨 **O Guli não desenhou esta tela** — e a sugestão é que desenhe **depois** do texto confirmado,
não antes. Sete blocos vazios desenhados primeiro viram layout brigando com o tamanho da copy, e o
item 16 pede menos scroll. Os itens 1 e 16 valem para ela também.

---

## 5. Our Solutions — nomes confirmados

**O que ele pediu:** as oito core Solutions como arquitetura oficial. Tirar Inclusion & Diversity
e Asian Talent Development. Recuperar a força dos black boxes / coloured bars do site antigo, ou
uma interpretação moderna. Reduzir radicalmente o tamanho das páginas, com a estrutura The
Challenge → The Outcome → How CorporateDNA Helps → Evidence → Start a Conversation.

✅ Black boxes implementadas, com a geometria medida do mock. Índice liderado pelo outcome. Os
cinco blocos existem no CMS com ajuda por campo.

✅ **As oito existem no banco, publicadas** (01/09), com `sort_order` 1 a 8 na ordem do e-mail —
o que fecha a pendência da ordem. As 12 antigas foram despublicadas, não apagadas, e
`problemStatement`, `body`, banner, `proofRefs` e `resources` foram migrados para a substituta.

✅ **Manager Development criada.** Não existia como solution: estava dentro de
"High-Performing Teams & Manager Impact". O item 5 lista as duas separadas e o item 6 dá flagships
diferentes, então separamos. **Não é decisão pendente** — ele já decidiu, duas vezes, no próprio
brief. Nasceu vazia por não haver página de origem.

🟠 **`The Outcome` e `How CorporateDNA Helps` estão vazios nas oito.** São 16 campos, e são o que
separa oito páginas construídas de oito páginas publicáveis. Não estão em branco na tela: trazem
`Pending final copy from CDNA`, de propósito, para a CDNA ver que o campo existe.

🟠 **O texto da Talent Development ainda diz "We shape Asian leaders".** O item 5 tirou o "Asian"
do nome; o corpo ficou. Precisa de frase nova deles.

---

## 6. Flagship cases — um por Solution

**O que ele pediu:** um flagship case por Solution, com o mapeamento que ele listou. Manager
Development e Executive Coaching a confirmar. Não usar industry dropdown como principal lógica de
descoberta.

✅ Campo `flagshipCaseSlug` no CMS.

✅ **Quatro ligados** (01/09): Heineken → ExCo / Top 150, GSK → Culture Transformation, Shell →
Women in Leadership, GSK → High Performing Teams.

🟠 **Faltam os dois TBC:** Manager Development e Executive Coaching.

🟠 **E dois que o próprio item define, mas cujo case não existe no CMS:** Frasers Property
(Talent Development) e adidas (HRLT Effectiveness). Ou os cases são criados, ou o flagship dessas
duas muda.

⚠️ **Conflito:** o mock do listing (`impact-stories-filtro-aberto.png`) mostra um dropdown por
indústria como lógica principal, que é o que o item 6 proíbe. Cabe como filtro secundário, com a
descoberta principal por Solution — mas do jeito que está desenhado, não. **Decisão do Guilherme.**

---

## 7. Case-study format

**O que ele pediu:** cada case começa por Countries → Participants/Leaders → Reach/Scale →
Intervention → Impact, e só então a história. Menos prosa, mais evidência visual. Quotes têm que
ser testimonials sobre a CorporateDNA, não corporate quotes genéricas. Nada vai a produção sem
aprovação da CDNA.

✅ A faixa de cinco fatos renderiza, na ordem dele, e só mostra o que estiver preenchido.

✅ **Campo `headline` novo.** O mock lidera o case pelo resultado ("SHELL Discovery Journey
registered 200 millions…") e nós mostrávamos só "Shell". Parecia questão de cadastro e não era: o
`title` também resolve o logo e a cor da marca da faixa, então escrever a frase longa ali apagava
os dois. Agora são campos separados.

✅ **A faixa foi preenchida em GSK, Heineken e Unilever** (01/09) — countries, participants, reach
e intervention. **Não escrevemos nada:** os três já traziam um bloco "At a glance" dentro da prosa,
que é exatamente o dado que a faixa pede. Movemos para os campos e tiramos o duplicado do corpo.

🟠 **`Impact` está vazio em 7 dos 8 cases.** A única métrica de resultado em todo o acervo é o
**88% Net Promoter Score do Shell**. Todo o resto é escala — países, líderes, anos de parceria —
e nenhum diz o que mudou no cliente. O item pede que o case feche em evidência, e hoje não há
evidência para fechar. **É o segundo maior buraco de conteúdo do projeto**, atrás só dos 16 campos
das Solutions.

🟠 **`countries` vazio em 5.** Os textos falam em *markets*, *locations* e *nationalities*.
"32 markets" não é 32 países, e preencher como se fosse seria inventar.

🟠 **A faixa dos outros cinco** — shell, morgan-stanley, coca-cola, levis, aviva. Há proposta
extraída da prosa em `docs/tabela-conteudo-cdna-01-09-2026.md`, aguardando confirmação da CDNA. Não
foi aplicada porque exige interpretação.

🟠 **As oito quotes precisam ser trocadas.** Lidas uma a uma em 01/09: **nenhuma menciona a
CorporateDNA.** São declarações institucionais — Emma Walmsley sobre cultura, Dolf van den Brink
sobre renovação, Sunny Jain sobre propósito. O detalhe que fecha o argumento: **o item cita o John
Murphy como exemplo do tipo certo**, e a quote atribuída a ele no CMS é justamente do tipo genérico.
Logo, existe uma quote melhor dele. Somando com *"nada vai a produção sem aprovação da CDNA"*, as
oito são bloqueadoras de lançamento.

🎨 **O mock não mostra a faixa de cinco fatos** — abre com headline e métrica embutida. Seguimos
o e-mail, que a exige. Perguntar ao Guli se omitiu ou substituiu.

🎨 **A seção "The 5H® Framework" dentro da página do case não foi construída.** Está no
`case-shell.png` e é a única parte do mock dele que ainda não existe.

---

## 8. Our Clients

**O que ele pediu:** trazer de volta uma forte client logo wall / portfolio snapshot, para mostrar
imediatamente breadth, scale and calibre. Depois do wall, os flagship client stories ligados às
oito Solutions. Logo wall = credibilidade imediata; client stories = profundidade.

✅ **Na ordem exata do item:** título → logo wall (os 27 logos passando, de `lib/logos.ts`) →
**Client Stories** com as faixas de cliente → global footprint → foto e quote de fechamento. O
cabeçalho virou título e uma linha, como o mock, sem a faixa escura.

O título "Client Stories" não está no mock do Guli, e foi acrescentado de propósito: o item separa
os dois blocos por função — *"Logo wall = immediate credibility, Client stories = depth"* — e sem
o título a página lia como duas listas de clientes seguidas.

**Página considerada fechada de build.** Falta a confirmação da CDNA sobre nomes, logos e a linha
de fechamento — ver Resumo.

> *Corrigido em 01/09:* este parágrafo dizia que o mapa ainda estava com o "API KEY REQUIRED" da
> CARTO. **Estava desatualizado e contradizia o item 18**, que registra a troca para Esri World
> Light Gray em 30/08. Confirmado no código: `components/LocationsMap.tsx` usa o Esri, keyless.

✅ As faixas reproduzem o tratamento do mock: painel na cor da marca dissolvendo no preto, com a
marca vazada em branco.

🟠 **Aprovação dos nomes e logos** que aparecem no wall e nas faixas.

🟠 **O quote de fechamento** ("We cut cross cultural boundaries…") veio do site antigo, foi de lá
que o Guli pegou. Não passou por aprovação neste ciclo.

🟠 **Confirmar que o P&B do item 15 vale só para os retratos do time**, não para fotos de evento.

⚠️ Os logos em `/public/logos` são PNG opaco com fundo branco. Nas faixas resolvemos vazando a
marca, mas o resultado é monocromático — a Heineken perde o vermelho da estrela. Bater com o mock
exigiria os assets de knockout de cada marca.

---

## 9. Our Impact

**O que ele pediu:** área separada de Our Clients, priorizando measurable results, impact
statistics, client testimonials, programme outcomes, impact stories e evidence across regions.
Página muito visual — numbers, quotes, proof blocks, dashboards. Pouco long-form copy.

✅ A sequência do mock: números → "Our clients say" → Our Social Impact → resultados por
engajamento → Our Awards. O 90% lidera.

🎨 **O layout não cobre tudo que o item 9 pede.** Faltaram, no mock do Guli:
- **programme outcomes** — sem tratamento nenhum
- **evidence across regions** — título sem forma
- **dashboards** — não apareceu

E ele **acrescentou** Our Social Impact e Our Awards, que não estão no item 9 — puxou os dois do
site antigo. Faz sentido, mas o Guilherme precisa confirmar.

Na call ele diz, aos 13:30: *"Ele quer uns números, ele quer outros números, ele quer o client
say, e daí ele quer os outcomes, que também é outros números. Sinceramente, esse programme
outcomes eu não sei nem o que é."* Ou seja: parou por falta de definição, não por ter terminado.

🟠 **Quais são os números.** O mock usa 18 years / 36 countries / 75 faculty / 90% Chairman. O
site antigo tem uma seção "By the numbers" com **nove** indicadores completamente diferentes.

🟠 **Measurable results e impact statistics são a mesma coisa ou dois blocos?**

🟠 **O que são "programme outcomes" e "evidence across regions".** *Nossa hipótese, no e-mail:* os
nove números do site antigo se separam em números da empresa (2007, países, leadership teams,
coaching clients, top FTSE 10) e resultados de programa (NPS, engagement, programme impact, talent
promoted). O primeiro grupo seria impact statistics, o segundo programme outcomes — inclusive
porque "Programme Impact" já é um dos indicadores de lá.

🟠 **Testimonials sobre a CorporateDNA.** O slot está montado e vazio: o item 7 exige depoimentos
sobre o trabalho, e as quotes atuais são corporate genéricas.

✅ **A lista de 06/08 estava classificada errada, e foi resolvida em 01/09.** Ela figurava aqui como
🟠 — "falta do Guilherme" —, mas não estava em aberto: o e-mail dele de **12/08**, escrito para a
equipe da CDNA e copiado para nós, já continha a decisão.

> *"I have also **instructed the developers to remove** the unsupported 5H claims referring to 95%,
> 26 countries and 'over ten years' **unless anyone can provide a reliable source**."*

Era instrução para nós, com uma condicional que venceu por decurso de prazo — três semanas sem
fonte. Ficar em 🟠 fez parecer que aguardávamos resposta quando a resposta tinha chegado e não fora
aplicada. **Aplicado em 01/09**, nos quatro pontos de `app/approach/page.tsx`:

| era | virou | por quê |
| :-- | :---- | :------ |
| `26 countries` (×4: metadata, FAQ, hero, corpo) | **`36 countries`** | correção, não remoção — 36 é o número que ele autorizou no mesmo e-mail, e 26 era a única contradição real com o resto do site |
| `95% of our clients cite 5H®…` | **removido** | sem fonte |
| `Over ten years and across…` | **removido** | sem fonte |

⚠️ **O que saiu junto com o 95%, e vale saber.** Não é versão velha do 90% da home: **90% é *work
sponsored by Chairman/CXO*, 95% é *clients who cite 5H as the secret of our success*** — medições
diferentes. Saiu por falta de fonte, não por conflito, e volta no dia em que a CDNA apresentar uma.
O mesmo vale para "over ten years", que era a idade do 5H e não a da empresa.

🟠 **E o e-mail de 12/08 trouxe dois números que o site ainda não usa:** *70+ executive-team
interventions* e *1,000+ coaching clients*, autorizados por ele junto com os quatro que já estão no
ar (18 years, 36 countries, 75 faculty, 90% Chairman/CXO). Decidir onde entram — provavelmente na
faixa de Our Impact, ver item 9.

**A linha de copyright saiu do documento do cliente** (decisão de 30/08 — se eles quiserem mandar
fonte ou ano, que mandem; não vamos perguntar). **Mas ela continua na página e ninguém está
olhando:** `app/approach/page.tsx:479-482`, um `<p>` centralizado cinza, último elemento antes do
footer — *"© 2021– 5H is the sole copyright and IP of Corporate DNA Consulting. All rights
reserved."* Veio do site antigo junto com a página (commit `312ea8b`, que moveu o 5H de Solutions
para Our Approach). Dois defeitos: o ano é 2021, e o travessão abre um intervalo que nunca fecha,
então na tela lê *"© 2021– 5H is the sole copyright…"*. É também **o único aviso de copyright do
site inteiro** — o footer não tem nenhum — e cobre o 5H, não a empresa.

⚠️ **Cuidado com o pareamento.** Vale de novo, agora que os claims saíram: o tracker antigo listava
"95% × 90%" e "ten years × 18 years" como se fossem duas versões do mesmo dado. Não são — ver o
detalhe acima. **A única contradição real era 26 × 36 countries**, e essa foi corrigida, não
removida.

✅ **O set corporativo está resolvido:** o item 2 do e-mail de 27/08 usa "90% Chairman/CXO-sponsored"
e "18 years" pelo nome, e o e-mail de 12/08 autorizou explicitamente os seis — **18 years, 36
countries, 75 faculty, 90% Chairman/CXO-sponsored, 70+ executive-team interventions e 1,000+
coaching clients**. Os quatro primeiros estão no ar; os dois últimos ainda não têm lugar.

---

## 10. Our Approach / 5H

**O que ele pediu:** manter o 5H wheel e as 25 dimensions — IP proprietário importante. Redesenhar
a introdução e criar *one coherent visual language around the 5H*, porque hoje alguns elementos
parecem desconectados, "inclusive o highlighting de um H sem explicação e a DNA-strand imagery".
Ele nomeia o Guli e pede que wheel, Inner/Outer Game, os cinco H e as 25 dimensions pareçam
partes do mesmo sistema visual.

✅ **O explorer foi reconstruído** ao design do Guli: painel em cima com altura travada, lista
embaixo, régua Inner/Outer que inverte, e as **25 dimensões** rotacionando a 1s no automático e
3s depois do primeiro clique.

✅ **As 25 dimensões existem no código**, transcritas da roda com a grafia da CDNA.

✅ A introdução foi redesenhada — é a seção "Five lenses. One whole leader.".

🎨 **A DNA-strand imagery continua na página** (`public/5H-methodology.jpg`, na seção "The 5H
don't live in separate compartments"). Ele cita ela pelo nome como elemento desconectado, e o
Guli não a substituiu. Agora que existe a seção nova acima dela, fica ou sai? **Decisão dos dois.**

🎨 **A roda:** nosso entendimento é que a visualização nova **é** a leitura moderna dela — Inner/
Outer, os cinco H e as 25 dimensões num sistema só, que é o que o item pede. Ou seja, a roda não
entra como imagem. Confirmar.

🟠 **Sign-off nos nomes das 25 dimensões.** É IP deles e nada vai a produção sem aprovação.

🟠 **O que é "o highlighting de um H sem explicação"?** Não localizamos na página atual.

🟠 **As dimensões devem ser explicadas a fundo ou basta aparecerem?** Hoje rotacionam como nome,
sem página por trás. O Guli acha que aprofundar seria tiro no pé, mas é decisão deles.

---

## 11. Proprietary Frameworks & Diagnostics

**O que ele pediu:** criar/manter a área, **sem** incluir Team Climate Assessment como IP
proprietário, sem inventar nomes ou claims, deixando a estrutura pronta para preencher só com o
que a CDNA validar.

✅ Team Climate Assessment removido do bloco de IP.

🟠 **Quais frameworks e diagnostics entram.** A estrutura está preparada e vazia, como ele pediu.
Levantado na call (21:18) e não resolvido.

---

## 12. Our Partnerships

**O que ele pediu:** criar a área. Para cada parceria, o conteúdo deve responder *what does this
partnership enable for our clients?* — não é para ser só logo e anúncio. Working examples:
Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin.

✅ Tipo `partnership` no CMS com `enablesForClients` **obrigatório**, rota `/our-partnerships`
lendo do CMS, nenhum nome hard-coded.

✅ **Migração aplicada em 01/09** — o tipo aparece no admin. Falta o conteúdo (ver item 12 abaixo).

🟠 **O texto de cada parceria**, e confirmação da lista.

🎨 **Guli desenha depois do conteúdo.** Recomendação explícita no PDF e no e-mail de 30/08: quantas
parcerias são, o tamanho de cada descrição e se cada uma tem imagem utilizável mudam o layout —
desenhar antes disso é retrabalho quase garantido. Mesma lógica de Our Identity.

---

## 13. Client testimonial videos

**O que ele pediu:** remover o compiled testimonial video do site público e criar estrutura
modular para vídeos individuais. Candidatos: Yolanda/Heineken, Andrew Morovski, Sonali,
Fred/adidas. Evitar over-representação de um cliente. Três novos (Dyson, adidas, +1) não bloqueiam
o lançamento.

✅ **O compilado saiu da home.** O componente fica no repo para quando os individuais chegarem.

✅ Tipo `testimonial_video` com `client` como campo de primeira classe, justamente para a
over-representação aparecer na listagem em vez de ficar escondida no título.

✅ Migração aplicada em 01/09 — o tipo está no admin.

⚠️ **Não existe superfície para eles** (verificado em 01/09). `getTestimonialVideos()` está em
`lib/cms/map.ts` e o endpoint responde, mas **nenhuma página ou componente consome a função**. Se a
CDNA cadastrar um vídeo hoje, ele não aparece em lugar nenhum do site.

**O brief não decide isso.** O item 13 manda remover o compilado e criar estrutura modular; não diz
onde os individuais entram. Por isso a função ficou órfã — construímos a capacidade e o destino
nunca foi definido. Três candidatos:

| Onde | A favor |
|---|---|
| **Página do case** | o tipo tem `caseSlug`, o que sugere ter sido a intenção original |
| **Our Impact** | o item 9 lista "client testimonials" entre as prioridades da página |
| **Home** | o compilado saiu de lá (item 13) e nada ocupou o lugar — o item 2 quer prova cedo |

Página própria **não está no brief**: a navegação do item 3 tem nove itens e nenhum é de vídeos.

**Leitura provável:** case + Our Impact, não um dos três. Mas é decisão de produto, não dedução —
**perguntar ao Guilherme, e ao Guli se envolver layout.**

🟠 **Os vídeos.** Candidatos do item: Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas.

---

## 14. CorporateDNA video

**O que ele pediu:** substituir o antigo vídeo Heineken/founder por um novo, centrado em Keeping
Leadership Real. A estrutura pode ser preparada agora; a produção não bloqueia o lançamento.

🟠 **Previsão de quando o vídeo fica pronto.** Não bloqueia.

---

## 15. Our Team

**O que ele pediu:** priorizar human credibility sobre consistência fotográfica. Foto de grupo dos
seis, possivelmente na escada; retratos individuais em P&B; expressões naturais; perfis clicáveis;
personalidade e "vibe", não só credenciais. Evitar tratamentos que deixem as pessoas artificiais
ou com cara de IA. A CDNA confirma a lista final.

✅ Rota `/our-team` construída, fora do menu até ter os assets.

🟠 **Foto de grupo, retratos P&B e a lista final de quem aparece.**

🟠 **Até onde vai o P&B.** O item 15 escopa o preto e branco **aos retratos do time** — e só. A
foto que a CDNA mandou para o pé de Our Clients também é P&B, e o carrossel do Social Impact em
Our Impact é colorido. A pergunta é legítima, mas **é daqui, não de Our Clients**: no PDF de 30/08
ela estava listada como "aprovação de Our Clients", dando a entender que o item 15 governa aquela
página. **Movida para cá.**

🎨 **O tratamento visual do time.** O Guli não desenhou.

---

## 16. Visual direction geral

**O que ele pediu:** reduzir blocos longos de texto, scroll infinito, espaço em branco excessivo,
layouts repetitivos e apresentação genérica com cara de stock/IA. Aumentar dashboards visuais,
números, ícones, blocos divididos, estatísticas fortes, logos, fotografia humana, depoimentos,
diagramas, IP proprietário e uso deliberado da cor.

🎨 **É o item do Guli por definição.**

✅ Do nosso lado: Our Clients caiu de 3.716px para 3.046px num viewport de 390, cortando o hero
escuro e os cabeçalhos repetidos de seção. O `PageHero` ganhou uma variante compacta que as outras
páginas podem adotar.

⚠️ **Redução de texto não é entregável de design.** O Guli é direto na call (18:25): *"redução
geral de texto e scroll não está no nosso controle, é o conteúdo."* O que o design entrega é
redução de **scroll**, que não é a mesma coisa. E sobre o espaço em branco (18:34): *"sou obrigado
pela minha formação a ignorar esse tipo de comentário, porque espaço em branco é o que faz o
design desde sempre."*

---

## 17. Running ticker

**O que ele pediu:** trazer de volta um running ticker cobrindo 2023 em diante, com awards, novas
regiões, novos escritórios, novas parcerias e marcos relevantes, administrável pelo CMS.

✅ **No topo da home, sob a nav**, onde o site antigo carregava. Faixa escura, texto branco,
sublinhado só onde há link — igual à referência.

✅ O corte de 2023+ e a ordenação por data do evento ficam em `getTickerEntries`.

**Decisão registrada:** categoria e data **não são renderizadas**. O item lista Awards, regiões,
escritórios, parcerias e marcos como o *conteúdo* que entra, não como rótulo a imprimir — os
campos existem no dado e servem ao corte e à ordenação.

✅ Migração aplicada em 01/09 — o tipo está no admin.

🟠 **O conteúdo do ticker, de 2023 em diante.** Mas pode ser que não precise deles: copiar a faixa
do site antigo é trabalho curto e está à nossa mão. O que segurou foi o corte de 2023 — a faixa
antiga é anterior, então parte entra e parte não, e essa escolha é deles.

🟠 **Os links dos itens.** No site antigo alguns eram clicáveis. `linkUrl` existe no schema
(`lib/cms/schemas.ts:286`) e o componente sublinha só quando há link (`RunningTicker.tsx:81`), mas
link tem que levar a algum lugar e para vários itens não há destino no site novo. **É a única
coisa do item 17 que depende mesmo deles.** Não dá para descobrir sozinho: o site antigo carrega o
ticker por AJAX (plugin Ditty, `ditty 7576`), então o dump em `docs/advisors.txt` não traz os itens
nem os destinos.

---

## 18. O que deve ser PRESERVADO

**O que ele pediu:** preservar headless architecture, CMS, segurança, Cloudflare/cutover,
analytics e SEO, base responsiva, estatísticas editáveis, controles de aprovação de autoria,
Reports & Resources, componentes de prova, multilingual readiness, componentes reutilizáveis e
propriedade da infraestrutura.

✅ Verificado. Nada foi removido — `/insights` continua vivo, apenas saiu do header e é linkado
pelo rodapé, para o Reports & Resources continuar alcançável.

✅ **Achado novo, e não é do brief — era nosso, e já está resolvido (30/08).** O mapa do
`LocationsBlock` renderizava com **"API KEY REQUIRED"** carimbado nos tiles, porque a CARTO fechou
o endpoint sem chave que o `LocationsMap.tsx` usava. Afetava home, `/our-team` e `/our-clients`.
**Trocado para Esri World Light Gray**, sem chave e sem carimbo, verificado renderizando no site.
Detalhes e as duas armadilhas da troca em `ESTADO-DO-PROJETO.md` §6.1.

**Confirmado que não era ambiente:** baixando o tile
`https://a.basemaps.cartocdn.com/rastertiles/voyager/4/8/5.png` direto por HTTP, com e sem
`Referer` do domínio do alpha, vinham **os mesmos 20.215 bytes**, já carimbados. O carimbo era
gravado no PNG pelo servidor da CARTO — iria para produção exatamente assim, e já estava visível
no alpha, que é o link que a CDNA abre.

**Decisão de 30/08: sai do PDF e do e-mail.** Escolher provedor de tiles é encanamento nosso — nós
é que colocamos a CARTO keyless ali. Virar "decisão da CDNA antes do lançamento" seria empurrar
para o cliente um problema que ele não criou e não tem como avaliar. **Resolvido no mesmo dia**,
antes de virar pendência de lançamento.

**Uma coisa que quase passou batido na troca:** acima do zoom 16 a Esri devolve **HTTP 200** com
um tile cinza escrito *"Map data not yet available"*. Como não é erro, o `onError` do
`LocationsMap` nunca dispararia e o fallback de lista não entraria — a gente teria trocado um
carimbo por outro, só que mais silencioso. Resolvido com `maxNativeZoom: 16`. Ver
[[carto-tiles-api-key-required]].

---

## 19. Target e forma de execução

**O que ele pediu:** target 1º de setembro. Atualizar o tracker dividido em Done/preserved, Can
implement immediately, Requires Guli design, Requires CDNA content/assets/approval, Can follow
immediately after launch, Any impact on September 1, e o que estiver materialmente fora de escopo.

🟠 **O que "launch no dia 1º" significa — homologação ou produção?** Perguntado no ciclo anterior
e ainda sem resposta. Hoje `corporatednaconsulting.com` serve o WordPress antigo; o que eles
revisam é URL de staging.

🟠 **Quem escreve a copy:** eles mandam validado, ou propomos e eles revisam? O Guli mudou de
posição na call (20:38) e agora acha que a Rhea vai querer olhar antes de qualquer forma.

---

## Fora do brief, mas trava o lançamento

- ✅ ~~Migração `0007` do CMS~~ — **aplicada em 01/09**, via `ALTER TYPE` direto no banco.
  `partnership`, `ticker_item` e `testimonial_video` aparecem no admin. Nota para a próxima:
  a API REST do Supabase aceita DML mas **não DDL** — `ALTER TYPE` só sai por conexão Postgres.
- 🔴 **O formulário de lead não avisa ninguém** — mas é configuração, não código faltando
  (verificado em 01/09). O caminho existe inteiro: `ContactForm` → `submitLead` →
  `POST {CMS}/api/leads` → grava → `dispatchLeadWebhook`. **O dispatcher é no-op porque
  `LEAD_WEBHOOK_URL` não está setada** (`lib/leads/webhook.ts`: `if (!url) return`). Falta escolher
  o destino. O CMS já tem `RESEND_API_KEY` no ambiente, então e-mail direto também é barato se for
  preferível a webhook. Lançar sem isso é perder lead.
- **Deploy é manual.** O scope da Vercel é `dobro66`, não `impulse66` — o time foi renomeado e os
  docs do repo ainda mandam usar o slug antigo, que só dá erro.
- ✅ **Autor do commit** — resolvido. Os últimos commits estão como
  `Impulse Ai Solutions <impulseaisolutions@gmail.com>`, que é o que o time da Vercel exige.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — o valor de teste `5511999999999` **não existe mais no repo**
  (verificado em 01/09); o componente lê da env. Falta confirmar se está setada na Vercel, o que
  não dá para ver do repositório.
- 🔴 **Nada de 01/09 está publicado.** `app/page.tsx` e `components/HeroV1.tsx` sem commit; os
  redirects commitados mas não deployados; **52 commits à frente do `origin`**, sem push. As
  mudanças do CMS, essas sim, estão no ar — é a assimetria que sempre confunde neste projeto.
- **Cutover do domínio** não está em nenhum tracker.

---

## Resumo — 01/09

### 🎨 Com o Guli — design

| Item | O quê |
|---|---|
| 1 | **A linha que digita, embaixo do hero** — resolução dele de 01/09, ainda em revisão. E o hover vermelho que ele pediu em 31/08 caducou junto com as células da grade |
| 2 | O ritmo visual da home reordenada — duas colisões de cor ainda abertas |
| 4 | O design de Our Identity |
| 7 | A faixa de cinco fatos não aparece no mock dele, e a seção 5H dentro do case não foi construída |
| 9 | Se Our Impact está terminada |
| 10 | A DNA-strand e a confirmação sobre a roda |
| 15 | O tratamento do time |
| 16 | Redução de texto e scroll |

### 🟠 Com a CDNA — conteúdo

Em ordem de impacto no lançamento:

| # | O quê | Item |
|---|---|---|
| 1 | **`The Outcome` e `How CorporateDNA Helps` nas 8 Solutions** — 16 campos, o que separa 8 páginas construídas de 8 publicáveis | 5 |
| 2 | **As 8 quotes dos cases** — nenhuma menciona a CorporateDNA, e o próprio item proíbe. Bloqueia produção pela regra deles | 7 |
| 3 | **`Impact` em 7 dos 8 cases** — só o Shell tem (88% NPS). Sem isso o case não fecha em evidência | 7 |
| 4 | **Todo o texto de Our Identity** — sete blocos vazios, três sem equivalente no site antigo | 4 |
| 5 | O texto da Talent Development ainda diz "Asian" | 5 |
| 6 | Flagships de Manager Development e Executive Coaching, e os cases de Frasers Property e adidas, que não existem | 6 |
| 7 | Números e as três definições do Our Impact; sign-off das 25 dimensões; frameworks; texto das parcerias; vídeos; assets do time; conteúdo do ticker | 9, 10, 11, 12, 13, 14, 15, 17 |

### 🟠 Com o Guilherme — decisões, não conteúdo

Estas voltam em minutos e destravam o resto:

1. **Quem preenche?** A CDNA cadastra direto no CMS, ou manda o texto e nós cadastramos? Define o formato de todo o pedido. *(item 19)*
2. **Para onde aponta `/our-services/leadership-development`?** Saiu da arquitetura e provavelmente era a página de serviço mais acessada do site antigo. Está no índice como interino. Manager Development ou Talent Development? *(item 5)*
3. O dropdown de indústria no listing de cases, que o item 6 proíbe mas o mock mostra. *(item 6)*
4. Awards na home e no Our Impact, ou só num dos dois. *(item 2)*

### ✅ Nosso, e dá para fazer sem esperar ninguém

- **Ligar a notificação do formulário de lead** — é o único 🔴 da lista, e lançar assim é perder
  lead. Ver abaixo: é uma variável de ambiente, não código.
- **Publicar** — nada de 01/09 está no ar.
- Confirmar o `NEXT_PUBLIC_WHATSAPP_NUMBER` na Vercel.

---

# Onde paramos — 01/09, fim do dia

*Fechamento do dia, para retomar sem reler o documento inteiro.*

## Nosso, e não depende de ninguém

**1. Nada de hoje está publicado — e essa é a assimetria que sempre confunde neste projeto.**
As mudanças do **CMS estão no ar agora**: as 8 Solutions novas, os flagships, a faixa dos três
cases. As mudanças de **código não**: `app/page.tsx` (o bloco junto embaixo do hero) e
`components/HeroV1.tsx` (o eyebrow branco) estão **sem commit**; os redirects do `next.config.mjs`
estão commitados mas **não deployados**; e a branch está **52 commits à frente do `origin`**, sem
push. O deploy é `vercel` manual.

> **Consequência prática:** se o Guilherme ou o Guli abrirem o alpha agora, veem as 8 Solutions
> novas **e ainda veem o eyebrow vermelho ilegível**. Vale publicar antes de pedir revisão.

**2. O formulário de lead — menor do que parecia.** O caminho existe inteiro:

```
ContactForm → submitLead → POST {CMS}/api/leads → grava → dispatchLeadWebhook
```

E o dispatcher (`corporate-dna-cms/lib/leads/webhook.ts`) é **no-op porque `LEAD_WEBHOOK_URL` não
está setada** — `if (!url) return`. Não falta código, falta destino. Três caminhos: um endpoint que
mande e-mail, um Zapier/Make, ou Resend direto no CMS, que **já tem `RESEND_API_KEY` no ambiente**.

**3. Checklist do cutover**, tudo do dia da virada: SSL em **Full (strict)** (em Flexible dá loop
de redirect), **desligar o Under Attack**, garantir que `robots.txt` e `sitemap.xml` venham do app
e não do managed robots do Cloudflare, e varrer a zona atrás de registro órfão.

**4. `NEXT_PUBLIC_WHATSAPP_NUMBER`** — sem valor de teste no repo; falta confirmar na Vercel.

## Esperando sair daqui

- **E-mail à Axon** — `docs/resposta-axon-01-09.ENVIAR.txt`. Reply All na mensagem do Amit,
  recolocando `rico.m@` na cópia e acrescentando `nitin.goil@`.
- **WhatsApp ao Guilherme** — `docs/whats-guilherme-01-09-2026.txt`. Três perguntas que só ele
  responde. A primeira decide o formato do pedido de conteúdo.
- **Carta timbrada** — `docs/carta-axon-PARA-O-GUILHERME.txt`, anexa ao WhatsApp/e-mail. Falta o
  telefone com DDI e a data. **Não colher assinatura antes** da Axon dizer se tem modelo próprio.

## Esperando eles

Ordenado por impacto no lançamento — o detalhe está no Resumo, acima.

1. Os 16 campos das Solutions (`The Outcome` e `How CorporateDNA Helps` nas oito)
2. As 8 quotes dos cases
3. O `Impact` de 7 dos 8 cases
4. Todo o texto de Our Identity — **e esse não é cadastro, é dev**
5. As três decisões do Guilherme
6. Confirmação da faixa proposta para os 5 cases restantes
   (`docs/tabela-conteudo-cdna-01-09-2026.md`)
7. **Onde entram os vídeos de depoimento** (item 13). Achado em 01/09: o tipo existe no CMS e a
   camada de leitura existe, mas **nenhuma página consome** — vídeo cadastrado hoje não aparece.
   O brief não define o destino. Decisão do Guilherme, com o Guli se envolver layout.

> **Padrão que apareceu três vezes hoje, e vale vigiar:** capacidade construída sem superfície ou
> sem caminho de edição. Our Identity (texto que só entra por código), os frameworks do item 11 (o
> mesmo), e agora os vídeos de depoimento (tipo sem página que renderize). Nos três, "está pronto"
> significa coisas diferentes — e é fácil prometer errado ao cliente.

## Datas duras

| Quando | O quê |
|---|---|
| **30/09** | A hospedagem da Axon termina. **O backup do WordPress tem que sair antes** — depois disso o servidor é desligado e o conteúdo vai junto |
| **16/09** | Última data de virada que ainda dá as 2 semanas cheias de rollback (23/09 dá 1 semana; 30/09 dá zero) |
| **13/10** | O domínio expira |

## Documentos de hoje

| Arquivo | O quê |
|---|---|
| `pedido-conteudo-solutions-cases-01-09-2026.md` | registro do que mudou no CMS e por quê |
| `tabela-conteudo-cdna-01-09-2026.md` | as três tabelas para a CDNA preencher |
| `Corporate DNA — …Status Update - 01_09.md` | tracker do cliente |
| `resposta-axon-01-09-2026.md` + `.ENVIAR.txt` | e-mail à Axon |
| `whats-guilherme-01-09-2026.txt` | WhatsApp |
| `carta-axon-PARA-O-GUILHERME.txt` | carta timbrada |
| `backup-cms-solutions-2026-09-01.json` | 13 entradas + 90 versões |
| `backup-cms-cases-2026-09-01.json` | 13 + 99 versões + 13 facets |
| `painel-axon/` | prints do portal de faturamento e do GA4 |
