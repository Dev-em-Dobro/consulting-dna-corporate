# Brief 27-08 — item a item, na ordem do email

Os 19 pontos do `docs/email-guilherme-27-08-2026.txt` na sequência em que ele escreveu, com o
estado de cada um. Atualizado em **2026-08-30**, depois de aplicar a leva de design do Guli
(29/08) e a reordenação da home.

> **O que mudou nesta atualização:** o design de 29/08 está aplicado — Solutions em black boxes,
> Our Clients com as faixas de cliente, Our Impact na sequência do mock, o 5H reconstruído com as
> 25 dimensões, a home reordenada e o ticker de volta no topo. Our Identity ganhou os sete blocos
> do item 4. Tudo commitado na `feat/brief-27-08-content-structure`, **nada pushado ou publicado**.

**Legenda**

| | Significado |
|---|---|
| ✅ | Feito, no código, `tsc` limpo e build passando |
| 🎨 | **Falta ver com o Guli** — design |
| 🟠 | **Falta do Guilherme / CDNA** — conteúdo, assets, aprovação ou decisão |
| ⏳ | Código pronto, falta rodar a migração no banco de produção do CMS |
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

🎨 **O tratamento curto e visual dos seis "reals" não existe.** É a única parte do item 1 que
ainda não foi feita, e é design.

🎨 **A reordenação quebrou o ritmo visual da home em quatro pontos** — ver item 2.

---

## 2. Proof muito mais cedo

**O que ele pediu:** reorganizar a home para trazer evidence antes. O 90% Chairman/CXO deve
aparecer antes de 18 years. Logos, testimonials, métricas e prova cedo. Claim → Proof →
Explanation, e não long explanation antes de proof.

✅ O logo wall e as estatísticas subiram para entre o hero e o "What we solve", que antes vinha
primeiro. O 90% agora lidera a faixa (`lib/stats.ts`), o que também vale para o Our Impact.

⚠️ Esse é o único ponto onde o mock do Guli e o e-mail se contradizem: o mock do Our Impact põe
18 years primeiro. Seguimos o e-mail.

🎨 **O que a reordenação quebrou, e precisa de passada do Guli:**
1. Três faixas escuras seguidas no topo — ticker, hero com vídeo, bloco de credibilidade. O
   vídeo termina num corte seco contra o cinza chapado.
2. O logo wall perdeu a deixa: antes vinha depois de uma frase, agora abre sozinho.
3. "What we solve" e "Client Impact" ficaram os dois em branco puro, colados, com o alinhamento
   virando de centralizado para esquerdo no meio do scroll.
4. O mesmo entre o bloco do livro e o de escritórios, ambos no mesmo cinza claro.

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

🟠 **"Why We Are Different" está parado desde o brief de 05/08**, com a Rhea, o JP e o Nitin. E
não está na lista de sete itens do item 4 — perguntar se continua na página.

🎨 **O Guli não desenhou esta tela.** Os itens 1 e 16 valem para ela também.

---

## 5. Our Solutions — nomes confirmados

**O que ele pediu:** as oito core Solutions como arquitetura oficial. Tirar Inclusion & Diversity
e Asian Talent Development. Recuperar a força dos black boxes / coloured bars do site antigo, ou
uma interpretação moderna. Reduzir radicalmente o tamanho das páginas, com a estrutura The
Challenge → The Outcome → How CorporateDNA Helps → Evidence → Start a Conversation.

✅ Black boxes implementadas, com a geometria medida do mock. Índice liderado pelo outcome. Os
cinco blocos existem no CMS com ajuda por campo.

🟠 **Reautoria das oito no formato curto.** Os campos estão prontos, falta o texto.

🟠 **A ordem das oito no índice.** Hoje sai na ordem do CMS. Sugerimos a ordem do e-mail dele,
que é a que a CDNA confirmou.

---

## 6. Flagship cases — um por Solution

**O que ele pediu:** um flagship case por Solution, com o mapeamento que ele listou. Manager
Development e Executive Coaching a confirmar. Não usar industry dropdown como principal lógica de
descoberta.

✅ Campo `flagshipCaseSlug` no CMS.

🟠 **Faltam os dois TBC:** Manager Development e Executive Coaching.

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

🟠 **Preencher a faixa** em cada case.

🟠 **As quotes** no padrão John Murphy / Jorge Gardino.

🎨 **O mock não mostra a faixa de cinco fatos** — abre com headline e métrica embutida. Seguimos
o e-mail, que a exige. Perguntar ao Guli se omitiu ou substituiu.

🎨 **A seção "The 5H® Framework" dentro da página do case não foi construída.** Está no
`case-shell.png` e é a única parte do mock dele que ainda não existe.

---

## 8. Our Clients

**O que ele pediu:** trazer de volta uma forte client logo wall / portfolio snapshot, para mostrar
imediatamente breadth, scale and calibre. Depois do wall, os flagship client stories ligados às
oito Solutions. Logo wall = credibilidade imediata; client stories = profundidade.

✅ Wall → faixas de cliente → global footprint → foto e quote de fechamento. O cabeçalho virou
título e uma linha, como o mock, sem a faixa escura.

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

🟠 **A lista de aprovação de 06/08 nunca teve retorno** — 95% × 90%, 26 × 36 countries, "ten
years" × 18 years, ©2021. Enquanto não fecha, o site carrega as duas versões em páginas
diferentes.

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

⏳ **Migração `0007` não rodou** — o tipo não aparece no admin até rodar.

🟠 **O texto de cada parceria**, e confirmação da lista.

---

## 13. Client testimonial videos

**O que ele pediu:** remover o compiled testimonial video do site público e criar estrutura
modular para vídeos individuais. Candidatos: Yolanda/Heineken, Andrew Morovski, Sonali,
Fred/adidas. Evitar over-representação de um cliente. Três novos (Dyson, adidas, +1) não bloqueiam
o lançamento.

✅ **O compilado saiu da home.** O componente fica no repo para quando os individuais chegarem.

✅ Tipo `testimonial_video` com `client` como campo de primeira classe, justamente para a
over-representação aparecer na listagem em vez de ficar escondida no título.

⏳ Migração `0007`.

🟠 **Os vídeos.**

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

⏳ Migração `0007`.

🟠 **O conteúdo do ticker, de 2023 em diante.**

---

## 18. O que deve ser PRESERVADO

**O que ele pediu:** preservar headless architecture, CMS, segurança, Cloudflare/cutover,
analytics e SEO, base responsiva, estatísticas editáveis, controles de aprovação de autoria,
Reports & Resources, componentes de prova, multilingual readiness, componentes reutilizáveis e
propriedade da infraestrutura.

✅ Verificado. Nada foi removido — `/insights` continua vivo, apenas saiu do header e é linkado
pelo rodapé, para o Reports & Resources continuar alcançável.

⚠️ **Achado novo, e não é do brief:** o mapa do `LocationsBlock` renderiza com **"API KEY
REQUIRED"** carimbado nos tiles. A CARTO fechou o endpoint sem chave que o `LocationsMap.tsx` usa.
O carimbo é gravado no PNG pelo servidor deles, então **não é artefato de localhost — vai para
produção assim**. Afeta home, `/our-team` e `/our-clients`. Resolver exige uma chave da CARTO na
conta do cliente ou trocar de provedor, o que tem implicação de licença.

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

- ⏳ **Migração `0007` do CMS não rodou.** Três `ALTER TYPE … ADD VALUE`, puramente aditivas.
  Enquanto não rodar, `partnership`, `ticker_item` e `testimonial_video` não aparecem no admin —
  e o ticker da home depende disso. `npm run db:migrate` com `DIRECT_URL` na porta 5432.
- 🔴 **O formulário de lead não avisa ninguém.** Grava no banco e fica invisível: sem e-mail, sem
  webhook. Lançar assim é perder lead.
- **Deploy é manual.** O scope da Vercel é `dobro66`, não `impulse66` — o time foi renomeado e os
  docs do repo ainda mandam usar o slug antigo, que só dá erro.
- **Autor do commit HEAD** precisa ser `impulseaisolutions@gmail.com` ou o time bloqueia. Os
  commits desta leva estão como `cadu.hd@gmail.com`.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** ainda é `5511999999999`, pendente desde 24/07.
- **Cutover do domínio** não está em nenhum tracker.

---

## Resumo

**Falta ver com o Guli (🎨)** — itens 1, 2, 4, 7, 9, 10, 15 e 16:
a seção dos seis "reals" na home; o ritmo visual da home reordenada; o design de Our Identity; a
faixa de cinco fatos no case e a seção 5H dentro dele; se Our Impact está terminada; a DNA-strand
e a confirmação sobre a roda; o tratamento do time.

**Falta do Guilherme / CDNA (🟠)** — itens 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17 e 19:
praticamente todo o texto de Our Identity; a reautoria das oito Solutions; os dois flagship TBC;
os números certos do Our Impact e as três definições que faltam; o sign-off das 25 dimensões; os
frameworks proprietários; o texto das parcerias; os vídeos; os assets do time; o conteúdo do
ticker; e as duas decisões do item 19.

**Nosso, e dá para fazer sem esperar ninguém:** rodar a migração `0007` e ligar a notificação do
formulário de lead.
