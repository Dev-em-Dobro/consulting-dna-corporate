# Revisão correcao-06-08 — progresso

## Item 1 — Final navigation, About and identity ✅ DONE
Tudo já implementado (commits do brief 05-08):
- Nav: Home | Solutions | Our Approach | Client Impact | About | Insights | Start a Conversation (`lib/nav.ts`, `NavV1.tsx`)
- The Book dentro de Insights (`lib/nav.ts:27`)
- Área About com as 7 seções + placeholder de "Why We Are Different" (`app/about/page.tsx`)
- Hero mantido + assinatura "Making Leadership Real. Results, Not Promises." (`HeroV1.tsx`)
- Substituição "high-stakes…" → "The leadership challenges that determine enterprise performance." (`app/page.tsx:146`)
- Citação Paul Polman na seção Book (`BookEndorsements.tsx`, `app/page.tsx:419`)

## Item 2 — Reframe Solutions around business outcomes 🟡 CMS (conteúdo)
Decisão: **documentar como tarefa de CMS, sem mexer no código agora.**

Tarefas de autoria no CMS (parte pendente da Rhea):
- Criar/estruturar as 7 solutions com as taglines de outcome:
  - CEO & Top Team Transformation — "Align the top team. Improve decision quality. Accelerate execution."
  - Executive Coaching — "Strengthen judgment and leadership performance when the stakes are highest."
  - Leadership & Culture Transformation — "Turn strategic intent into leadership behaviour that moves the business."
  - Talent & Succession — "Build a ready-now leadership pipeline and retain critical talent."
  - High-Performing Teams & Manager Impact — "Enhance team dynamics. Increase execution speed and accountability."
  - Women in Leadership — "Accelerate progression and strengthen the leadership pipeline."
  - CHRO / HRLT Effectiveness — "Increase HR's strategic influence and transformation readiness."
- Autorar cada detalhe como outcome-first (campo `problemStatement`) e mecanismos no `body`.
- Inclusion & Diversity absorvido em L&C Transformation + Women in Leadership (não item primário).
- Asian Talent Development como especialização regional sob Talent & Succession (ver item 6).

Lacuna de código conhecida (NÃO implementada por decisão): o índice `app/solutions/page.tsx` mostra só o título dos cards; `SolutionCard` VM = `{slug,title}`. Para "outcome liderar os cards" no índice seria preciso surfacar uma linha de outcome por card (adicionar `summary` ao `solutionListItem`/`getSolutionCards` e renderizar). Deixado para depois.

## Item 3 — Make our proprietary IP more visible 🟡 PARCIAL
- ✅ 5H preservado sob Our Approach (`/approach`).
- ✅ Seção "Our IP & Diagnostics" (`app/approach/page.tsx:141`) com 3 cards: 5H Framework, DNA 360 Profiler, Team Climate Assessment.
- ✅ Team Climate Assessment marcado como "Name & overview pending CDNA confirmation".
- ❌→📋 Auditoria numérica: 95% / 26 countries / ten years / ©2021 são claims não-verificadas e inconsistentes com os números corporativos (36 countries / 18 years).
  - Decisão: **NÃO alterar a página agora**; catalogado em `correcao-06-08-cdna-approval-list.md` (itens 1-4).

## Item 4 — Video testimonials and client proof 🟡 PARCIAL (código ok)
- ✅ Heading trocado para "What global leaders say about us" (`TestimonialsVideo.tsx:18`).
- ✅ Playback/loading: lazy click-to-play — mp4 só carrega no clique (`TestimonialsVideo.tsx:57-84`).
- ✅ Mobile: `playsInline` + `aspect-video`.
- ⚠️ Captions acessíveis: falta `<track kind="captions">` no `<video>`; requer arquivo `.vtt`. Adicionar quando houver footage final.
- 📋 Asset de vídeo (proof-of-concept a ser substituído por footage original — deferido pelo próprio brief): caption sync, spelling da Rhea, Andrew duplicado, nomes/empresas/títulos.

## Item 5 — Statistics and evidence ✅ DONE (código) + 📋 lista CDNA
- ✅ Stats band CMS-editável via singleton `home` (`app/page.tsx:65-117`), commit `cd268e4`.
- ✅ Cifras proibidas (1,200+/700+/95% approval) NÃO publicadas como stats (varredura confirmada).
- ✅ Set atual = 18/36/75/90%, overridable pelo CMS; 75 faculty consistente em todo o código (sem inconsistência 68/16 — item 11 já resolvido no código).
- ✅ Métricas client-specific ficam nos cards de cases (linkam aos cases).
- 📋 Auditoria site-wide completa registrada em `correcao-06-08-cdna-approval-list.md`.
- Nota: "70+ executive-team interventions" e "1,000+ coaching clients" (sugeridos no brief) NÃO estão no site — opção de conteúdo pendente da CDNA.

## Item 6 — Talent Development 🟡 CMS (conteúdo)
- Não há página Talent Development hardcoded — é uma solution do CMS (`app/solutions/[slug]/page.tsx`).
- Tarefas de CMS: criar "Talent & Succession" (global); reestruturar/renomear "Asian Talent Development" (regional); se copy global não aprovada, rotular a página atual explicitamente como "Asian Talent Development"; remover material "2025 Asian Talent Shifts" salvo revalidação.
- Sem alteração de código: solutions novas entram automaticamente no submenu (`buildSiteNav`) e no índice.

## Item 7 — High Performing Teams & protection of IP 🟡 CMS (conteúdo)
- Não há página HPT hardcoded — é solution do CMS.
- Tarefas de CMS: remover roadmaps 3–6m e 9–12m, HPT Tools, processo de scoping, referência "in 2020"; reter 1 visual high-level; priorizar client pain / outcome / situações de engajamento / evidência.
- Revisar outras Solution pages por IP exposto.
- Arquitetura `SolutionView` já suporta o formato (hero=pain, body=narrativa, proofRefs=evidência).

## Item 8 — Testimonials within Solution pages ✅ Código DONE (não-commitado)
- `ClientPerspective` em `SolutionView.tsx` (label "Client Perspective", bloco escuro destacado, após o body, link p/ case).
- Dados via `proofRefs` do CMS: schema `proofRef` (`schemas.ts:115`), `mapProofRefs` (`map.ts:351`), descarta linhas sem quote.
- ⚠️ Working tree não-commitado (SolutionView/map/schemas). Commitar.
- 📋 CMS: autorar testimonials como `proofRefs` e removê-los do body copy.

## Item 9 — Client Impact and case taxonomy ✅ Código DONE
- ✅ "Cases" → "Client Impact" na nav (`lib/nav.ts:18`, rota `/cases`); título/metadata (`app/cases/page.tsx:10`).
- ✅ Título do índice "Leadership change, measured where it matters." (`app/cases/page.tsx:27`).
- ✅ Copy de apoio exata do brief (`app/cases/page.tsx:30-32`).
- ✅ Filtros derivam dinamicamente das tags do CMS (`CasesLibrary.tsx:20-24`) — sem taxonomia hardcoded; re-taggear no CMS atualiza os filtros sozinho.
- 📋 CMS: re-taggear cases com taxonomia outcome-led (depende do item 2). CDNA: aprovar nomes/logos/métricas de clientes.

## Item 10 — Insights, authorship & downloadable resources 🟡 PARCIAL
- ✅ Reports & Resources (downloads): `ResourceDownloads.tsx` + `resources` no schema/map, em Insight/Case/Solution views (não-commitado).
- ✅ **Implementado agora**: fallback de autor → "Corporate DNA" + gate de aprovação.
  - `schemas.ts`: campo `authorApprovalStatus` adicionado a `insightData`.
  - `map.ts`: `insightAuthor()` — nome do indivíduo só é exibido se `authorApprovalStatus === "approved"`; senão "Corporate DNA". Byline sempre presente.
  - `InsightView`/`InsightCard` já renderizam o byline; agora nunca fica vazio.
  - `tsc --noEmit` limpo.
- 🟡 Campos de atribuição externa (originalSource / originalPublicationDate / sourceLink): aceitos pelo schema mas **não renderizados** (usuário optou por não implementar a exibição agora).
- 📋 CMS: editores preenchem `authorApprovalStatus` por insight; campos de atribuição externa quando aplicável.
- ⚠️ Working tree não-commitado (inclui esta implementação).

## Item 11 — Global presence, team and awards ✅ Código DONE
- ✅ "Our Offices" → "Our Global Presence" (`LocationsBlock.tsx:19`).
- ✅ Contexto do mapa = texto exato do brief (`LocationsBlock.tsx:20`).
- ✅ Awards retidos (`AwardsMentions.tsx`); nomes/datas → lista CDNA.
- ✅ 75/36 consistente; 68/16 não existe no código.
- ✅ Global Faculty visível no About (`#faculty`, mosaico por região).
- 📋 Conteúdo/foto: portraits (home polido / About natural), sem alteração de IA em rostos, seleção de faculty.

## Item 12 — Editorial, design & technical QA 🟡 PARCIAL
### Padronização (código)
- ✅ "Corporate DNA" consistente (nenhum "CorporateDNA").
- ✅ British English (organisation/programmes/behaviour).
- ✅ **Implementado agora**: naming da região `nav.ts` "Saudi Arabia" → "Riyadh" (slug/rota permanecem `saudi-arabia`), consistente com home/offices.
- ✅ **Implementado agora**: comentário `5H©` → `5H®` em `five-h-data.tsx:3`.
- 🟡 Rodapé `approach:493` "© 2021– 5H is the sole copyright…" — copyright legítimo, mantido (decisão editorial/legal se unificar com ®).
- 🟡 Capitalização de programmes/Solutions/job titles — requer revisão editorial manual.
- `tsc --noEmit` limpo.
### QA (atividade de teste — a executar no fim)
Desktop/mobile, links/CTAs, qualidade de imagem, loading/captions de vídeo, a11y, responsivo, page speed, filtros de cases, comportamento do CMS, consistência de títulos/roles/locations/figures.

---

# Resumo geral (12 itens)
- **Código DONE:** 1, 8, 9, 11 (e as implementações de 10 e 12 feitas nesta revisão).
- **Implementado nesta revisão:** item 10 (gate de autoria + fallback Corporate DNA), item 12 (naming Riyadh + 5H®).
- **CMS / conteúdo (pendente autoria, ex-Rhea):** 2, 6, 7 e partes de 9/10.
- **Lista de aprovação CDNA:** 3 e 5 (números) + awards (11) → `correcao-06-08-cdna-approval-list.md`.
- **Asset de vídeo (proof-of-concept):** item 4 (heading ✅; correções dependem do footage final).
- ⚠️ **Working tree não-commitado** contém itens 8, 10 e 12. Commitar quando aprovado.
