# Rascunho de resposta ao Guilherme — brief 27-08

> Rascunho para revisão do Beto/Cadu antes de enviar. Em anexo vai o tracker atualizado em inglês
> (`Corporate DNA — Consolidated Implementation Status Update - 27_08.md`), no mesmo formato do
> 10-08, para o Guilherme encaminhar à CDNA.

---

**Assunto:** Brief 27-08 — recebido como source of truth, tracker atualizado e o que precisamos de vocês até 01/09

Fala, Guilherme, tudo certo?

Recebido e assumido como single source of truth. Já começamos a executar — segue o retorno
dividido exatamente nos buckets que você pediu, e o tracker atualizado em anexo para a CDNA.

## 1. O que o brief reverte do 05-08 — vamos fazer

Cinco decisões do brief anterior já estavam no ar e mudam com este. Registrando para não haver
dúvida depois, e porque algumas foram vistas e aprovadas pelo time da CDNA no formato antigo:

1. **Headline.** O 05-08 pediu explicitamente para *reter* "When the stakes are high, leadership
   must become real." Agora ela sai da posição principal e entra "Keeping Leadership Real".
2. **Navegação.** A nav de 7 itens que implementamos passa a ter 9, com IA bem diferente.
3. **Vídeo de depoimentos.** O compilado, que o 05-08 mandou manter (e cujo heading ajustamos para
   "What global leaders say about us"), sai do site.
4. **Solutions.** As 7 outcome-led do 05-08 (CEO & Top Team Transformation, Talent & Succession,
   CHRO / HRLT Effectiveness…) dão lugar às 8 confirmadas agora.
5. **About / Client Impact.** `About` se desdobra em `Our Identity` + `Our Team`, e `Client Impact`
   se divide em `Our Clients` + `Our Impact`.

Sem problema nenhum — só sinalizando que são reversões conscientes, não retrabalho por engano.

## 2. Já feito (27–28/08)

Optamos por separar o que é **estrutura de conteúdo** (fazemos agora, não depende de tela) do que é
**layout da home** (fica com o Guli, para ele propor e aprovar com vocês antes de irmos ao site).

**Estrutura de conteúdo — pronta e testada:**

- **Team Climate Assessment removido** do bloco "Proprietary frameworks and diagnostics we own".
  Isso encerra uma pendência que estava marcada como "aguardando confirmação da CDNA" desde 06/08.
- **Faixa dos cases** (item 7): os cinco campos — Countries, Participants/Leaders, Reach/Scale,
  Intervention, Impact — já existem no CMS e já renderizam no topo do case, antes da história.
- **Cinco blocos das Solutions** (item 5): The Challenge / The Outcome / How Corporate DNA Helps /
  Evidence / Start a Conversation, mais o campo para indicar o flagship case de cada Solution.
- **Três áreas novas no CMS**: Partnerships (item 12), Ticker (item 17) e vídeos de depoimento
  individuais (item 13), com os campos que o brief pede.
- **Navegação** — "Home" explícito além da logo, "Solutions" → "Our Solutions", "Our Books" no
  primeiro nível e no plural.

**Layout da home — com o Guli:** a nova hierarquia (headline "Keeping Leadership Real", o bloco
curto e visual dos "reals", a prova subindo antes da explicação) é composição, não conteúdo.
Preferimos que ele proponha isso no Figma e aprove com vocês, em vez de a gente aplicar direto no
site e vocês revisarem já implementado. A home publicada segue como está até lá.

## 3. Proposta: dividir o 01/09 em duas ondas

Antes da proposta, a conta do calendário — porque ela é o que motiva tudo abaixo:

```
qui 27  hoje, brief recebido
sex 28
sáb 29  ─ fim de semana
dom 30  ─
seg 31  telas para aprovação da CDNA
ter  1  LANÇAMENTO — e dia da revisão
```

Para a nova expressão visual entrar no dia 01, a cadeia é: Guli desenha → CDNA aprova (o brief é
explícito, *nada vai para produção sem aprovação*, e a Rhea tem palavra final em marca) → a gente
implementa → QA → deploy. Se a aprovação acontece na terça, não sobra dia para implementar.
Invertendo a conta: precisaríamos de telas **já aprovadas** na sexta 28 — ou seja, o Guli
entregando hoje. Não é uma questão de esforço, é aritmética de calendário.

Dois fatores reforçam isso. Primeiro, o ciclo de aprovação da CDNA não costuma ser de um dia — a
lista que enviamos em 06/08 está aberta há três semanas. Segundo, e mais importante: **conteúdo
trava antes do design**. Mesmo com telas aprovadas, faltariam a copy das Partnerships (que o
próprio brief classifica como não validada), as fotos do time, os dois flagship TBC e a reautoria
das oito Solutions no CMS.

Por isso propomos tratar 01/09 como um release de **arquitetura e conteúdo**, e o redesenho visual
como um segundo marco:

**Onda 1 — 01 de setembro**

Nova proposition e copy (já feito), proof reordenado (já feito), nova arquitetura de informação,
estrutura das oito Solutions no formato curto de cinco blocos, campos da faixa de case
(Countries → Participants → Reach → Intervention → Impact), remoções já executadas (Team Climate
Assessment e vídeo compilado), ticker e logo wall de Our Clients. Rodando sobre o sistema visual
atual.

Navegação no ar, com conteúdo real atrás de cada item:
`Home | Our Identity | Our Solutions | Our Approach | Our Clients | Our Impact | Our Books`.

`Our Partnerships` e `Our Team` ficam com as rotas prontas e fora do menu, entrando assim que
texto validado e fotos chegarem — sem novo trabalho de arquitetura. Publicar a nav completa no dia
01 significaria entregar itens de menu que abrem página vazia, o oposto do "Does this feel
unmistakably CorporateDNA?".

**Onda 2 — data a definir**

5H como sistema visual único, black boxes / coloured bars de Solutions, Our Impact e o tratamento
do time. A data sai da entrega do Guli mais o tempo de aprovação de vocês — não do nosso tempo de
build. Do nosso lado, tudo que é estrutura estará pronto para receber o design: quando as telas
chegarem, é trabalho de aplicação, não de construção.

Já mandamos mensagem para o Guli pedindo que ele comece a olhar isso desde já, para não perder
tempo enquanto o resto se organiza. O que falta para fechar a data é uma informação só: **Guli,
que data você consegue comprometer para as telas?** Com ela a gente monta o cronograma da onda 2
no mesmo dia.

Uma ressalva para não passar pessimismo: o dia 01 não fica visualmente igual ao de hoje. O ticker,
o logo wall e a redução de texto e scroll do item 16 são ganhos visuais reais que não dependem de
tela nova.

Se vocês preferirem manter tudo em 01/09 mesmo com páginas parciais, ou empurrar a data do
lançamento para acomodar as duas ondas juntas, são decisões de vocês — só não queremos tomá-las
por conta própria.

## 4. O que trava do lado da CDNA

Priorizado pelo que bloqueia o lançamento:

1. **Flagship de Manager Development e de Executive Coaching** — os dois TBC do item 6.
2. **Aprovação de nomes, logos, quotes e métricas** de cliente. Seguimos a regra do brief: nada vai
   para produção sem aprovação.
3. **Quotes que sejam testimonials sobre a CorporateDNA**, no padrão John Murphy / Jorge Gardino —
   as genéricas precisam ser substituídas, e isso é reautoria de conteúdo.
4. **Texto das Partnerships** respondendo "what does this partnership enable for our clients?".
5. **Assets do time**: foto de grupo, retratos P&B e a lista final de quem aparece.
6. **Conteúdo do ticker** (2023+): awards, regiões, escritórios, parcerias, milestones.
7. **Reautoria das 8 Solutions no CMS** no formato curto de 5 blocos.
8. **A lista de aprovação que enviamos em 06/08 segue sem retorno** — são os números
   inconsistentes (95% / 26 countries / ten years / ©2021 contra os 36 countries / 18 years
   corporativos). Enquanto não voltar, eles continuam no ar como estão.

## 5. O que depende do Guli

Os seis que você mesmo priorizou: hierarquia visual da home, sistema visual de Solutions,
linguagem visual do 5H, Our Clients / Our Impact, tratamento do time e a redução geral de
texto/scroll. Já avisamos o Guli para começar a olhar — esses seis formam a onda 2 do bloco 3.

Uma sugestão de sequenciamento, caso ele precise entregar em partes: **hierarquia da home e
sistema visual de Solutions primeiro**. São os que mais cascateiam — o sistema de Solutions define
cards, páginas de detalhe e provavelmente se reaproveita em Our Clients e Our Impact. O 5H é o
mais isolado dos seis e pode vir por último sem travar nada.

E, do nosso lado, um compromisso: vamos adiantar toda a estrutura que não depende de tela — campos
de CMS, rotas, modelo de dados da faixa de case. Quando o design chegar, é aplicação, não
construção. Isso também significa que o Guli desenha sabendo exatamente quais campos existem, em
vez de compor e depois descobrir que falta o dado.

## 6. Dois pontos da nav que queremos confirmar antes de mexer

Na lista de 9 itens, **`Insights` e `Start a Conversation` não aparecem**.

- **Insights** é onde vivem a biblioteca editorial e a capability de Reports & Resources — que o
  item 18 do seu email manda preservar. Assumimos que foi omissão e mantivemos no ar.
- **Start a Conversation** é o CTA de captura de lead, ligado ao formulário e ao roteamento por
  região. Também mantivemos, como botão no topo.

Se a intenção era mesmo tirar os dois, é só dizer que ajustamos.

Outras três, menores:

- `Our News → Our Partnerships`: o site novo não tem "Our News" — a área editorial é Insights.
  Entendemos Partnerships como área **nova**, com Insights seguindo separada. Confere?
- **Talent Development global** encerra a pendência do "Asian Talent Development"? Assumimos que
  sim, com o material regional virando conteúdo interno da página global.
- As **taglines outcome-led do 05-08** morrem com os nomes novos, ou continuam valendo por baixo
  deles?

## 7. Fora do escopo acordado — para vocês decidirem

Não é recusa, é sinalização de tamanho:

- **Our Books no plural com múltiplos autores** é um tipo de conteúdo novo no CMS mais página de
  listagem. Sugestão: entra em 01/09 já como "Our Books" apontando para o livro da Rhea, e o
  multi-livro quando houver um segundo livro real.
- **Dashboards em Our Impact**: se for visualização de dados viva (filtro por região, indústria,
  ano), é build novo. Se for tratamento visual de números estáticos, cabe.
- **Ticker administrável** e **estrutura modular de vídeos**: ambos pequenos, mas são tipos de
  conteúdo novos no CMS que não estavam previstos.

---

Resumindo: o que era claro e reversível já está feito, o tracker está atualizado em anexo, e o que
segura 01/09 é conteúdo e design — não desenvolvimento. Manda os itens do bloco 4 conforme forem
saindo que a gente vai encaixando.

Abraço,
Beto e Cadu
