# Brief 27-08 — o que está feito e o que falta

**Fonte:** `docs/email-guilherme-27-08-2026.txt` (single source of truth; vale por cima de
qualquer direcionamento anterior).
**Atualizado:** 2026-08-28. **Target de lançamento:** 01/09 (terça) — restam **sexta 28** e
**segunda 31**.
**Estado:** nada commitado, nada publicado. Site com 8 arquivos modificados, CMS com 2.

---

## ✅ Feito

> **Decisão 28/08 — a home volta ao estado publicado.** Tudo que era **layout da home**
> (headline nova, seção dos seis "reals", reordenação Claim→Prova→Explicação, remoção do vídeo
> compilado, ticker montado na página) foi **revertido** via `git checkout app/page.tsx
> components/HeroV1.tsx`. Motivo: o Guli propõe essas seções e a ordem no Figma e aprova com a
> CDNA; só depois a gente aplica no site. Assim eles revisam um design, não uma página já mexida.
> A home publicada (`consulting-dna-corporate-alpha.vercel.app`) e o repositório voltaram a bater.

### Site — código

| Item do brief | O que | Onde |
|---|---|---|
| 11 | Team Climate Assessment removido do bloco de IP proprietário | `app/approach/page.tsx` |
| 3 | Nav: "Home" explícito, "Our Solutions", "Our Books" no topo e no plural | `lib/nav.ts` |
| 7 | Faixa de case renderizada antes da história, na ordem do brief; slot vazio não renderiza | `components/views/CaseView.tsx`, `caseFacts()` em `lib/cms/map.ts` |
| 5 | `SolutionView` reescrito nos 5 blocos: Challenge → Outcome → How CDNA Helps → Evidence → Start a Conversation | `components/views/SolutionView.tsx` |
| 5, 7 | Schemas do site espelhando os campos novos | `lib/cms/schemas.ts`, `lib/cms/map.ts` |
| 17 | Componente `RunningTicker` pronto e ligado ao CMS — **não montado na home**, aguardando o Guli definir onde entra | `components/RunningTicker.tsx` |

### CMS

| Item | O que | Onde |
|---|---|---|
| 7 | `countries` · `participants` · `reach` · `intervention` · `impact` no schema e no editor, com help por campo | `lib/content/types.ts`, `lib/content/ui-fields.ts` |
| 5 | `outcome`, `howWeHelp`, `flagshipCaseSlug`; labels numeradas ("1. The Challenge"…); `body` demovido a "further detail (optional)" | idem |
| 6, 7 | Regra das quotes no help dos campos: testimonial sobre a Corporate DNA, não corporate quote genérica, sujeito a aprovação | idem |

> ⚠️ **O checkout local do CMS estava 6 dias atrás do `origin/main`** (local 31/07 × remoto 06/08 =
> `c261a56`). Resolvido com `merge --ff-only` antes de qualquer edição. **Confira o `git log` antes
> de mexer no CMS** — `proofRefs`, `resources` e `page_home` só existem a partir do `38d04b1`.

### Verificação

- Site: `tsc --noEmit` limpo, `npm run build` passando (26 páginas).
- CMS: `tsc --noEmit` limpo, `vitest` com **110 passed / 31 skipped**.
- Redirects legados para `/#impact` conferidos após a reordenação da home.

### Documentos

- `docs/Corporate DNA — Consolidated Implementation Status Update - 27_08.md` — tracker em inglês
  para a CDNA, nos rótulos do ciclo anterior.
- `docs/resposta-guilherme-27-08-2026.md` — rascunho do email de resposta.
- `docs/STATUS-REVIEW-2026-08-27.md` — doc de trabalho interno.
- `C:\Users\Ricardo\Downloads\msg-guli-27-08-2026.txt` — mensagem de WhatsApp para o Guli.

---

## 🔜 Falta

### A. Dá pra fazer agora — não depende de ninguém

- **Rotas novas da IA**: `/identity`, `/clients`, `/impact`, `/team`, `/partnerships`, com o estilo
  atual. Roteamento, metadata, canonicals e sitemap não mudam com o design.
- **Redirects** de `/about` e `/cases` para as áreas novas + entradas no `sitemap.ts`.
- **Logo wall como fonte única**: hoje `orderedLogos` é array fixo em `app/page.tsx`. Vira módulo
  compartilhado entre a home e Our Clients (item 8).
- **Índice de Solutions liderado pelo outcome**: o `SolutionCard` VM é só `{slug,title}`; falta
  expor uma linha de outcome por card (pendência herdada do ciclo 06-08).
- **Re-taggear cases** para tirar indústria como lógica principal de descoberta (item 6) — é
  trabalho de CMS, mas depende da taxonomia das 8 solutions.

### B. Depende de decisão nossa

- **Nav do dia 01**: 7 itens com conteúdo real (recomendado) × 9 completos com páginas parciais.
- **Redução de texto/scroll (item 16)**: a copy restante foi aprovada pela CDNA no ciclo anterior.
  Cortar por conta própria contraria a regra do brief. Opções: reduzir só o respiro vertical
  (espaçamento, não conteúdo) ou levar junto com a passada do Guli.
- **Preview desatualizado**: `consulting-dna-corporate-preview` está ~3 semanas atrás do `alpha`.
  Ou redeployar para emparelhar, ou aposentar — hoje é armadilha para quem for revisar.

### C. Depende do Guli (design)

> **Modelo de trabalho definido em 28/08:** o Guli propõe no Figma, aprova com a CDNA, e só então
> a gente aplica no site. Vale para tudo abaixo — inclusive a home, que foi revertida por isso.
> A referência que ele recebe é `https://consulting-dna-corporate-alpha.vercel.app/`.
>
> **O que ele precisa saber antes de desenhar:** a estrutura de conteúdo já está construída e
> **define os slots disponíveis**. A faixa de case tem exatamente 5 (Countries ·
> Participants/Leaders · Reach/Scale · Intervention · Impact) e a Solution tem 5 blocos
> (Challenge · Outcome · How CDNA Helps · Evidence · Start a Conversation). Se ele desenhar com
> outra quantidade de campos, não há dado no CMS para preencher.

1. Sistema visual das Solutions — *black boxes / coloured bars* em leitura moderna (item 5).
2. Linguagem visual do 5H: wheel, Inner/Outer Game, os cinco H e as 25 dimensions como um sistema
   só (item 10).
3. Our Clients e Our Impact (itens 8, 9).
4. Tratamento do time (item 15).
5. Expressão visual da home sobre a estrutura já reorganizada (itens 1, 16).

Ordem sugerida se ele precisar fatiar: **Solutions primeiro** (cascateia para cards, detalhe e
provavelmente Clients/Impact); **5H por último** (é o mais isolado).

### D. Depende da CDNA (conteúdo, assets, aprovação)

1. **Flagship de Manager Development e de Executive Coaching** — os dois TBC do item 6.
2. **Aprovação de nomes, logos, quotes e métricas** de cliente.
3. **Quotes que sejam testimonials sobre a CorporateDNA** (padrão John Murphy / Jorge Gardino) —
   as genéricas precisam ser substituídas.
4. **Texto das Partnerships** respondendo "what does this partnership enable for our clients?".
5. **Assets do time**: foto de grupo, retratos P&B, lista final de quem aparece.
6. **Conteúdo do ticker** (2023+).
7. **Reautoria das 8 Solutions no CMS** no formato curto — os campos já estão prontos.
8. **Preenchimento da faixa dos cases** — os campos já estão prontos.
9. **A lista de aprovação de 06/08 segue sem retorno** (95% / 26 countries / ten years / ©2021
   contra os 36 countries / 18 years corporativos).

### E. Tipos de conteúdo novos — ✅ código pronto, ⏳ falta aplicar a migração

Os três tipos foram implementados de ponta a ponta (28/08):

| Tipo | Item | Campos |
|---|---|---|
| `partnership` | 12 | `title`, **`enablesForClients`** (obrigatório — o brief exige que responda "what does this partnership enable for our clients?", não logo nem announcement), `logoMediaId`, `websiteUrl` |
| `ticker_item` | 17 | `title`, `category`, `date`, `linkUrl` |
| `testimonial_video` | 13 | `title` (nome), `client`, `role`, `videoUrl`, `youtube`, `posterMediaId`, `caseSlug` |

Entregue: enum `contentTypeEnum`, schemas Zod, `REGISTRY`, campos do editor com help,
navegação e dashboard do admin, camada de leitura no site (`getPartnerships`,
`getTickerEntries`, `getTestimonialVideos`) e o componente `RunningTicker` já ligado na home.

Decisões que valem registrar:
- **Read API não precisou de rota nova** — é genérico por segmento via `SEGMENT_TO_TYPE`.
  Os endpoints `/api/content/partnerships`, `/ticker` e `/testimonial-videos` já respondem.
- **`ContentTypeDef.toListItem` ganhou `date`/`category`/`linkUrl`.** O endpoint de lista só
  devolve a projeção do `toListItem`, nunca o `data` completo; o ticker renderiza direto da lista,
  então precisa desses campos para ordenar por data do evento (não por data de publicação) e para
  linkar cada item. Sem isso seria um fetch por entrada.
- **Corte de 2023+** (exigência do brief) e ordenação ficam em `getTickerEntries`, não no componente.
- `client` é campo de primeira classe no vídeo para que a **over-representação de um cliente**,
  que o brief manda evitar, apareça na listagem em vez de ficar escondida no título.

**⏳ O que falta:** aplicar `db/migrations/0007_dashing_omega_flight.sql` no banco de produção do
CMS. São três `ALTER TYPE "public"."content_type" ADD VALUE` — **puramente aditivas**, sem
alteração de tabela e sem risco de perda de dados. Comando: `npm run db:migrate` no repo do CMS,
com `DIRECT_URL` apontando para a porta 5432 (não a 6543 pooled — DDL por pooling é instável).
Enquanto não rodar, os três tipos não aparecem no admin.

### F. Pós-lançamento (o próprio brief desbloqueia)

- Três novos testimonials (Dyson, adidas, +1 TBC).
- Novo vídeo institucional em torno de *Keeping Leadership Real* (item 14).
- Vídeos individuais restantes entrando pelo CMS.
- Captions `.vtt` (pendência de a11y do ciclo 06-08).
- Poda fina dos redirects com o Search Console.

---

## Pendências operacionais (fora do brief, mas travam o lançamento)

- **Deploy é manual**: `vercel --prod --scope impulse66 --yes`. Não há auto-deploy no push.
- **Autor do commit HEAD tem que ser `impulseaisolutions@gmail.com`** ou o time bloqueia. Os
  commits do Beto estão como `roberto.rhd@gmail.com` — conferir antes de publicar.
- **Número real do WhatsApp**: `NEXT_PUBLIC_WHATSAPP_NUMBER` segue com o valor de teste
  `5511999999999`, pendente desde 24/07.
- **Cutover do domínio**: `corporatednaconsulting.com` ainda serve o WordPress antigo. O que chamamos
  de "produção" é `consulting-dna-corporate-alpha.vercel.app`. Se o lançamento de 01/09 inclui virar
  o domínio, isso não está em nenhum tracker e precisa entrar.

---

## Mapa dos 19 itens

| Item | Estado |
|---|---|
| 1. Homepage — nova hierarquia | → Guli (revertido do site em 28/08; ele propõe no Figma) |
| 2. Proof mais cedo | → Guli (faz parte da mesma reordenação) |
| 3. Navegação final | Renames ✅ · 5 áreas novas → A + B |
| 4. Our Identity | Rota → A · conteúdo → D |
| 5. Our Solutions (8 confirmadas) | Estrutura ✅ · conteúdo → D · visual → Guli |
| 6. Flagship por Solution | Campo ✅ · 2 TBC → D |
| 7. Case-study format | Campos + render ✅ · preenchimento → D |
| 8. Our Clients | Rota → A · visual → Guli |
| 9. Our Impact | Rota → A · visual → Guli · dashboards = fora de escopo |
| 10. Our Approach / 5H | → Guli |
| 11. Frameworks & Diagnostics | Remoção do TCA ✅ · resto → D |
| 12. Our Partnerships | Tipo ✅ · migração ⏳ · rota → A · texto → D |
| 13. Testimonial videos | Tipo ✅ · migração ⏳ · remoção do compilado → Guli (é layout) · vídeos → D/F |
| 14. CorporateDNA video | → F |
| 15. Our Team | Rota → A · assets → D · visual → Guli |
| 16. Visual direction geral | → Guli + B (decisão sobre cortar texto) |
| 17. Running ticker | Tipo + componente ✅ · migração ⏳ · onde entra na página → Guli · conteúdo → D |
| 18. Preservar | ✅ verificado |
| 19. Target e tracker | ✅ tracker atualizado; proposta de duas ondas no email |
