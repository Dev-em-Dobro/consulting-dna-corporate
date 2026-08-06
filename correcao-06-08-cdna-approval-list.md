# Lista de aprovação CDNA — claims numéricas não-verificadas

> Status: **enviada à CDNA para validação** (confirmado pelo cliente em 2026-08-06). Nada aqui foi alterado no código — aguardando retorno da CDNA para validar ou remover.
>
> Números apresentados como fato no site que precisam ser **validados pela CDNA** ou **removidos antes do launch** (correcao-06-08, itens 3 e 5).

## Página 5H / Our Approach (`app/approach/page.tsx`)

| # | Claim | Local | Observação |
|---|---|---|---|
| 1 | "95% of our clients cite 5H® as the real secret of our success" | `app/approach/page.tsx:134` (hero subtitle) | Item 5 lista "95% approval" como algo a NÃO publicar sem fonte confiável |
| 2 | "26 countries" | `app/approach/page.tsx:17` (metadata), `:78` (FAQ), `:134` (hero), `:238` (body) | Conflita com a referência corporativa "36 countries" (itens 5 e 11) |
| 3 | "Over ten years" | `app/approach/page.tsx:238` | Conflita com "18 years" (referência corporativa, item 5) |
| 4 | "© 2021–" (idade implícita da firma) | `app/approach/page.tsx:493` | Inconsistente com "18 years" |

## Referência corporativa alvo (a confirmar pela CDNA — itens 5 e 11)
- 18 years
- 36 countries
- 70+ executive-team interventions
- 1,000+ coaching clients
- 90% Chairman/CXO-sponsored work
- 75 faculty across 36 countries (referência primária; resolver conflito com "68 members across 16 countries")

## Home / stats corporativos (`app/page.tsx`) — CMS-editável, pendente confirmação final CDNA
| Claim | Local | Observação |
|---|---|---|
| 18 years / 36 countries / 75 faculty / 90% CXO-sponsored | `app/page.tsx:69-74` (band de stats) | Editável via CMS singleton `home`. Set corporativo — confirmar valores finais com CDNA |
| "75-strong faculty ... across 36 countries" | `app/page.tsx:87`, `:316`, `:334` | Consistente com o set corporativo |
| Métricas de cases no home: Heineken 45% promotion; Coca-Cola 43 leaders; Shell 2,582 women leaders | `app/page.tsx:96-98` | Client-specific — sujeitas a aprovação CDNA (item 9) |

## Outras páginas
| Claim | Local | Observação |
|---|---|---|
| "36 countries" (faculty/delivery) | `about:132`, `solutions/leadership:13`, `solutions/regions:13`, `opengraph-image:68`, `LocationsBlock:20` | Referência corporativa — confirmar |
| "68 members / 16 countries" (inconsistência citada no item 11) | — | **NÃO existe no código**; tudo já padronizado em 75/36. Verificar apenas se aparece no conteúdo do CMS |

## Set sugerido pelo brief mas AUSENTE do site (opção de conteúdo, pendente CDNA)
- "70+ executive-team interventions"
- "1,000+ coaching clients"

## Awards (item 11) — nomes/datas/descrições pendentes de validação CDNA
Hardcoded em `components/AwardsMentions.tsx:29-60`:
| Award | Distinção | Ano |
|---|---|---|
| Women of the Future Awards | Finalist | 2008 |
| HSBC Start-up Stars | Semi finalist | 2009 |
| British Indian Awards | Finalist | 2008 |
| Women Entrepreneur | Top 10 Indian women leader in the UK | 2021 |
| Corporate Excellence Awards | Best international leadership consulting firm | 2022 |

(o brief pede reter a estrutura, mas tratar nomes/datas/descrições/seleção como pendentes de CDNA)

## Pendências relacionadas
- Item 9: nomes de clientes, logos, citações, resultados e métricas — todos sujeitos a aprovação CDNA.
- Item 11: fotos **confirmadas corretas** pelo cliente (2026-08-06) — sem pendência de foto/AI. Seleção de Global Faculty segue como conteúdo.
