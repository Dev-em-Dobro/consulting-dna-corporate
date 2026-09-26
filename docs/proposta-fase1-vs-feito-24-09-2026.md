# Proposta Fase 1 contra o que já está no site

Fonte: *Corporate DNA: Website Platform Redesign — Phase 1 Foundation / Essential, v2 (July 2026)*.
Contagem do código em 24 de setembro de 2026.
Rascunhos (`/home-v1`, `/home-v3`, `/about-v1`), páginas de teste e editores do CMS ficam de fora da conta.

A proposta é “for discussion, not a binding contract”. O argumento seguro é o da matriz como teto do fee, não o de um contrato assinado. O próprio documento avisa que o acordo de serviço é que fixa os termos finais.

## O argumento em uma frase

O fee de US$ 5.000 compra a matriz de lançamento da seção 7: home, até 5 jornadas, uma página de 5H, até 3 cases, 5 regiões, um livro, uma seção de prêmios, insights, legal e contato. A seção 19 diz que a taxa fixa cobre essa matriz, com até duas rodadas de ajuste no staging. Trabalho fora da matriz é change order a US$ 100/hora, estimado e aceito por escrito antes.

O site já publica **34 rotas de produto**. O teto da matriz é cerca de **22 páginas**. O menu passou de **7 para 9** itens. As jornadas passaram de **até 5 para 10**.

## Os dois exemplos mais limpos

Impact e Events não estão na matriz. Cada uma entrou por um pedido posterior à proposta de julho.

### `/our-impact` — página nova, e contra o texto da proposta

- A seção 6 tem um destino só: **Proof / Client Impact**.
- A seção 5 pede métricas e depoimentos **dentro das páginas relevantes**, e não concentrados numa página. `/our-impact` é exatamente essa página central.
- Nasceu em **28 de agosto de 2026**, a partir do brief de 27 de agosto, um mês depois da proposta.
- O próprio código trata Clients e Impact como uma divisão em duas telas, e marca dashboard ao vivo como fora do escopo.

### `/events` — página nova, e nomeada como Fase 2

- A seção 2 lista events junto de newsletter e resource centre, **fora desta fase**.
- Não há linha na matriz, nem tipo “events” no CMS.
- Entrou no menu em **21 de setembro de 2026**, por anotação de reunião (“mudar book para events”). O e-mail da cliente não menciona Events.
- A página nasceu vazia, com `noindex`, só para o item do menu não cair num 404.

## Menu

A seção 6 limita o menu a sete itens. O logo já leva à home.

| Proposta (máx. 7) | No ar (`lib/nav.ts`, 9 itens) |
| --- | --- |
| Home | — (o logo) |
| Solutions (por jornada) | Services |
| 5H Framework | Approach |
| Proof / Client Impact | Clients **e** Impact |
| About / Leadership | About **e** Team |
| Insights | Insights |
| Contact / Book a Consultation | Contact |
| — | **Events** (excluído na seção 2) |

## Matriz da seção 7 × rotas existentes

| Item da matriz | Contratado | No site | Leitura |
| --- | --- | --- | --- |
| Home | 1 | 1 (`/`) | Dentro |
| Jornadas / solutions | até 5 | 10 páginas em `/services/[slug]` | Dobro do teto |
| 5H Framework | 1, visão geral + CTA | 1 (`/approach`), com explorador | Dentro, mais rico |
| Cases escritos | até 3 | Template `/cases` e `/cases/[slug]` | Template feito |
| Biblioteca de cases | 1 template + entradas | `/cases` | Dentro |
| Liderança | perfis dos líderes-chave, dentro de About | `/about` + `/team` + `/services/leadership` | 3 superfícies |
| Regiões | 5 (Londres, Singapura, Dubai, Riad, Miami) | índice + 5 rotas em `/services/regions` | Dentro + hub extra |
| Livro | 1 página com caminho de compra | seção `#books` dentro de `/insights` | Feito, sem URL própria |
| Awards & partnerships | 1 seção, não uma página | `/awards` e `/our-partnerships` | 2 páginas |
| Insights | estrutura + textos iniciais | `/insights` (+ artigos no CMS) | Dentro |
| Legal | privacy, cookies, terms | as 3 | Dentro |
| Contato | 1 formulário | `/contact` | Dentro |
| Events | fora — Fase 2 | `/events` no menu | Fora do escopo |
| Interviews | não aparece na proposta | `/interviews` | Fora do escopo |
| Clientes e Impacto | 1 destino: Proof / Client Impact | `/our-clients` e `/our-impact` | 2 páginas |
| Índice de serviços | não previsto (as jornadas eram as landings) | `/services` | Página extra |

## As 10 jornadas, contra o teto de 5

Cada uma é uma landing própria em `/services`, com seções compostas em `lib/services.ts` (arquivo de mais de 3.500 linhas). A proposta fala em um template reutilizável, não em dez layouts.

| # | Página | Contra a matriz |
| --- | --- | --- |
| 1 | Senior Leadership Development | Cabe no teto de 5 |
| 2 | Culture Transformation | Cabe no teto de 5 |
| 3 | Talent Development | Cabe no teto de 5 |
| 4 | Manager Development | Cabe no teto de 5 |
| 5 | Women’s Leadership Development | Cabe no teto de 5 |
| 6 | High Performing Teams | Acima da matriz |
| 7 | HR Leadership Teams (HRLT) | Acima da matriz |
| 8 | Judgement in AI | Acima da matriz |
| 9 | Executive Coaching | Acima da matriz |
| 10 | Family Business Consulting | Acima da matriz |

## O que entra na conta de 34

16 rotas estáticas do sitemap + 10 jornadas + 5 regiões + Events, Interviews e Our Partnerships.

**Dentro da matriz.** Home, Approach (5H), as cinco primeiras jornadas, cases, cinco regiões, insights, contato, privacy, cookies, terms. O livro virou seção, não página.

**Acima do combinado.** Mais cinco jornadas. About, Team e Leadership como três telas. Clients e Impact separados. Índice de serviços e índice de regiões. Awards e Partnerships como páginas. Roster de cerca de 32 pessoas (6 líderes, 3 programme managers, 23 faculty) em vez de “key leaders”.

**Fora da Fase 1.** Events está na lista “not in this phase” da seção 2. Interviews não existe no documento. O 5H interativo também estava reservado para uma fase posterior.

## Como usar isso na conversa

A seção 19: a taxa fixa cobre a matriz da seção 7, com até duas rodadas de mudança no staging. Rodadas extras, ou qualquer trabalho além da matriz, são change order a US$ 100/hora, combinados por escrito antes.

Impact e Events são o exemplo mais curto: duas páginas que a proposta de julho não compra, cada uma pedida depois, e as duas já estão no ar.
