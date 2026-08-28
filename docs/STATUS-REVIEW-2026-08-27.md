# Brief 27-08 (Guilherme) — tracker de execução

**Fonte:** `docs/email-guilherme-27-08-2026.txt` — declarado pelo próprio email como
**single source of truth**: onde houver conflito com direcionamento anterior de conteúdo,
arquitetura ou design, **vale este**.

**Target:** **1 de setembro de 2026**. Hoje é 27/08 → **3 dias úteis** (qui 27, sex 28, seg 31)
até a véspera do lançamento.

**Princípio da Rhea:** *Don't reinvent CorporateDNA. Modernise and sharpen what already makes
CorporateDNA distinctive.*

**Estado base:** brief 05-08 implantado e no ar (`5084161`, `019ea53`, `a75c3aa`); ciclo de agosto
(stats via CMS, client-proof, resources, gate de autoria, hero iceberg) em `HEAD` = `048c1d7`.

---

## 0. Conflitos diretos com o brief 05-08 — o que este email REVERTE

Cinco decisões já implementadas mudam. Nenhuma é ambígua; todas vêm do email novo.

| # | Estava assim (05-08, no ar) | Passa a ser (27-08) | Onde |
|---|---|---|---|
| 1 | Nav de 7: `Home \| Solutions \| Our Approach \| Client Impact \| About \| Insights \| Start a Conversation` | Nav de 9: `Home \| Our Identity \| Our Solutions \| Our Approach \| Our Partnerships \| Our Clients \| Our Impact \| Our Team \| Our Books` | `lib/nav.ts` |
| 2 | H1 = "When the stakes are high, leadership must become real." (05-08 mandou **reter**) | H1 = **"Keeping Leadership Real"**; a linha antiga **desce** para narrativa secundária | `components/HeroV1.tsx:406` |
| 3 | 7 solutions outcome-led (CEO & Top Team Transformation, Talent & Succession, CHRO/HRLT Effectiveness…) | **8 solutions confirmadas**, nomes diferentes (ExCo / Top 150, Manager Development, Talent Development global…) | CMS + `docs/…10_08.md` §Solutions |
| 4 | Vídeo compilado de depoimentos mantido, heading "What global leaders say about us" | **Remover** o compilado do site; estrutura **modular** por cliente | `components/TestimonialsVideo.tsx` |
| 5 | `About` como área única com 7 seções | About **se desdobra**: `Our Identity` + `Our Team`; e `Client Impact` **se divide** em `Our Clients` + `Our Impact` | `app/about/page.tsx`, `app/cases/` |

Consequência: a IA passa de **5 áreas** para **9**. Isso é o maior item de esforço do brief e o
principal risco para 01/09 — ver §6.

---

## 1. Done / preserved

Confirmado no código, nada a fazer — o email item 18 pede explicitamente preservar.

- Arquitetura headless + CMS de leitura (`lib/cms/*`), revalidação granular por webhook (`dcaddf1`).
- Segurança do form de leads: time-trap + rate limit por IP (`e0ae2fb`); Cloudflare/cutover.
- SEO: metadata, canonicals, sitemap, robots, JSON-LD, llms.txt (`62e17bd`, `4c5e1d7`).
- Redirects legados 308 centralizados no `next.config.mjs` (`985b35d`).
- Responsive foundation, componentes reutilizáveis, multilingual readiness (single-locale EN,
  seam `pt→pt-BR` preservado em `lib/cms/client.ts`).
- **Editable statistics** — stats da home vêm do singleton `home` do CMS (`cd268e4`).
- **Author approval controls** — `authorApprovalStatus`, fallback "Corporate DNA" (`4b7e0cb`).
- **Reports & Resources capability** — `components/ResourceDownloads.tsx` (`4b7e0cb`).
- **Proof components** — `ClientPerspective` em `SolutionView`, blocos de client-proof.
- 5H sob Our Approach + as 25 dimensions (`app/approach/page.tsx`) — email item 10 manda manter.
- Awards já introduzidos (`components/AwardsMentions.tsx`) — item 17 amplia para ticker.
- Paul Polman no bloco do livro (`components/BookEndorsements.tsx`).

---

## 2. Can implement immediately (claro e reversível — não depende de ninguém)

> **Executado em 27/08** — `tsc --noEmit` limpo e `npm run build` passando:
> 2.1 stats reordenadas (90% primeiro) · 2.2 Team Climate Assessment removido do bloco de IP
> · 2.3 vídeo compilado fora da home · 2.4 novo H1 "Keeping Leadership Real" + sub aprovada
> · 2.5 CLOs incluídos · 2.6/2.7 nav com Home explícito, "Our Solutions" e "Our Books" top-level.
> **Correção ao 2.8:** não é tarefa de código — o filtro de cases já é dirigido pelas tags do CMS
> (`CasesLibrary.tsx:20-24`), não por indústria. Tirar indústria como lógica principal é
> **re-taggear no CMS**, e depende da taxonomia das 8 solutions novas.

> **Segunda leva de 27/08 — estrutura (site + CMS).** `tsc` limpo nos dois repos, `npm run build`
> do site passando, suíte do CMS 110 ✓ / 31 skipped.
>
> ⚠️ **O checkout local do CMS estava 6 dias atrás do `origin/main`** (local em 31/07, remoto em
> 06/08 = `c261a56`). Antes de qualquer edição foi feito `merge --ff-only`. Quem for mexer no CMS
> daqui pra frente confira o `git log` antes — o ciclo de agosto (page_home, resources, proofRefs)
> só existe a partir do `38d04b1`.
>
> - **Hierarquia da home** (itens 1-2): ordem passou a ser Claim → prova → explicação. Nova seção
>   `#real` com os seis termos do brief, verbatim e **sem gloss inventado**; `Credibility` e
>   `Client Impact` subiram; `What we solve` desceu. Redirects legados p/ `/#impact` conferidos.
> - **Faixa de case** (item 7): `countries`/`participants`/`reach`/`intervention`/`impact` no
>   `caseSchema` + editor do CMS, espelhados em `lib/cms/schemas.ts`, agregados por `caseFacts()`
>   em `map.ts` e renderizados no topo do `CaseView`. Slots vazios não renderizam.
> - **Cinco blocos da Solution** (item 5): `outcome`, `howWeHelp` e `flagshipCaseSlug` no CMS +
>   site; `SolutionView` reescrito na ordem do brief (Challenge → Outcome → How CDNA Helps →
>   Evidence → Start a Conversation). O `body` virou "further detail (optional)" no editor.
> - **Regra das quotes** (item 7) embutida no `help` dos campos de quote do CMS: testimonial sobre
>   a Corporate DNA, não corporate quote genérica, e sujeito a aprovação da CDNA.
>
> **Parou aqui, por decisão:** os tipos de conteúdo novos (`partnership`, ticker, vídeo modular)
> exigem alterar o enum `contentTypeEnum` → migração Drizzle → aplicar no banco de produção do CMS,
> além de rota de read API e navegação do admin. Não é edição de arquivo, é mudança de schema no
> banco — precisa de janela e decisão.

Ordenado por razão esforço/impacto. Tudo abaixo é decisão fechada no email.

| # | Item | Ação concreta | Arquivo |
|---|---|---|---|
| 2.1 | **Proof antes de idade** (item 2) | Reordenar a stats band: `90%` sponsored **antes** de `18 years` | `app/page.tsx:69-74` (`STAT_FALLBACK`) |
| 2.2 | **Team Climate Assessment fora do IP** (item 11) | Remover o 3º card de "Proprietary frameworks and diagnostics we own" — o email responde a pendência que estava marcada "pending CDNA confirmation" | `app/approach/page.tsx:198-210` |
| 2.3 | **Remover o vídeo compilado** (item 13) | Tirar `TestimonialsVideo` da home; manter o componente no repo para a estrutura modular | `app/page.tsx:227-232` |
| 2.4 | **Nova headline** (item 1) | H1 → `Keeping Leadership Real`; sub → copy aprovada verbatim; linha "When the stakes are high…" reposicionada como narrativa | `components/HeroV1.tsx:405-414` |
| 2.5 | **CEOs, CHROs & CLOs na primeira tela** (item 1) | Incluir a audiência explicitamente no hero (hoje o sub diz "CEOs, CHROs and executive teams" — falta CLO) | `components/HeroV1.tsx:409` |
| 2.6 | **Renomear rotas de nav** (item 3) | `Our News → Our Partnerships`, `Our Book → Our Books`, labels `Our Solutions` / `Our Team` | `lib/nav.ts` |
| 2.7 | **Home explícito na nav** (item 3) | Item "Home" além da logo clicável | `lib/nav.ts`, `components/NavV1.tsx` |
| 2.8 | **Sair o industry dropdown como lógica principal** (item 6) | Filtros de case deixam de liderar por indústria (já são dinâmicos por tag — é reordenar) | `components/cases/CasesLibrary.tsx:20-24` |

**Estrutural, ainda "imediato" mas com peso real (1–2 dias):**

| # | Item | Ação | Observação |
|---|---|---|---|
| 2.9 | **Split `Our Clients` / `Our Impact`** (itens 8, 9) | Duas rotas novas: logo wall + flagship stories / métricas + testimonials + proof blocks | `/cases` continua existindo como fonte dos stories; redirects a definir |
| 2.10 | **`Our Identity`** (item 4) | Promover as seções de identidade do `/about` para área própria (Purpose, Story, Values, Keeping Leadership Real, London origin, founder POV, 5H como identidade) | Reaproveita `app/about/page.tsx:53-115` |
| 2.11 | **`Our Team`** (item 15) | Promover `#leadership` + `#faculty` do About para rota própria | Assets novos são bloqueio de conteúdo, não de código |
| 2.12 | **Encolher as páginas de Solution** (item 5) | Estrutura fixa: The Challenge / The Outcome / How CorporateDNA Helps / Evidence / Start a Conversation | `SolutionView` já tem hero+body+proofRefs; faltam campos de CMS por seção |
| 2.13 | **Header visual de case** (item 7) | Faixa `Countries → Participants/Leaders → Reach/Scale → Intervention → Impact` antes da narrativa | Precisa de 5 campos novos no schema de case |
| 2.14 | **Running ticker** (item 17) | Componente + tipo de conteúdo no CMS, 2023+ | Conteúdo é CDNA (§4) |
| 2.15 | **Estrutura modular de vídeos** (item 13) | Lista de testimonials individuais, alimentada pelo CMS | Vídeos chegam depois; estrutura não bloqueia |

---

## 3. Requires Guli design

O próprio email prioriza estes seis. Nada aqui deve ser inventado no código antes do design.

1. **Homepage visual hierarchy** — nova ordem Claim → Proof → Explanation (item 2).
2. **Solutions visual system** — recuperar a força dos *black boxes / coloured bars* do site antigo
   em interpretação moderna (item 5).
3. **5H visual language** — 5H wheel + Inner/Outer Game + os cinco H + 25 dimensions como **um só
   sistema visual**; hoje o realce de um H sem explicação e a imagética de DNA-strand parecem
   desconectados (item 10).
4. **Our Clients / Our Impact** — logo wall de credibilidade imediata e página de impacto muito
   visual (numbers, quotes, proof blocks, dashboards) (itens 8, 9).
5. **Team treatment** — foto de grupo dos seis, retratos P&B, expressões naturais (item 15).
6. **Redução geral de texto/scroll + recuperação da energia visual** (item 16).

---

## 4. Requires CDNA content / assets / approval

Bloqueios de conteúdo. Nenhum deles é resolvível do nosso lado.

- **Flagship por Solution** (item 6): `Manager Development → TBC` e `Executive Coaching → TBC`.
  Confirmados: Heineken, GSK ×2, Frasers Property, Shell, adidas.
- **Aprovação de nome, logo, quote e métrica de cliente** — o email é explícito: *nada vai para
  produção sem CDNA approval* (item 7).
- **Quotes que são testimonials sobre a CorporateDNA**, não corporate quotes genéricas —
  no padrão John Murphy / Jorge Gardino (item 7). Exige varredura + reautoria no CMS.
- **Our Partnerships** (item 12): texto de cada parceria respondendo *what does this partnership
  enable for our clients?* — Harvard, Imperial, Emeld AI, Explore Performance, TerraGrin.
  Nomes e textos **ainda serão validados**.
- **Frameworks & Diagnostics** (item 11): só preencher com o que a CDNA validar. Não inventar nomes.
- **Assets do time** (item 15): foto de grupo (possivelmente na escada) + retratos P&B + lista final
  de quem aparece.
- **Conteúdo do ticker** (item 17): awards, novas regiões, novos escritórios, parcerias, milestones — 2023+.
- **Reautoria das 8 Solutions no CMS**: os nomes estão confirmados, mas o corpo de cada página
  precisa ser reescrito no formato curto de 5 blocos.
- **Pendências abertas do ciclo anterior** — `correcao-06-08-cdna-approval-list.md` foi enviada em
  06/08 e **segue sem retorno** (auditoria numérica: 95% / 26 countries / ten years / ©2021 vs.
  36 countries / 18 years).

---

## 5. Can follow immediately after launch

Explicitamente desbloqueado pelo próprio email — não segura 01/09.

- **Três novos testimonials** (Dyson, adidas, +1 TBC) — o email diz que não bloqueiam o lançamento.
- **Novo vídeo institucional CorporateDNA** em torno de *Keeping Leadership Real*, substituindo o
  vídeo Heineken/founder — estrutura preparada agora, produção depois (item 14).
- Vídeos individuais restantes (Yolanda/Heineken, Andrew Morovski, Sonali, Fred/adidas) entrando
  pelo CMS conforme chegarem.
- Captions `.vtt` dos vídeos (pendência de a11y que vem do ciclo 06-08).
- Poda fina dos redirects com o Google Search Console do cliente.

---

## 6. Impacto no 1º de setembro — leitura honesta

**Cabe em 3 dias úteis:** todo o bloco §2.1–2.8 (copy, nav, reordenação de proof, remoção do vídeo
compilado, remoção do TCA do IP). São mudanças pequenas e reversíveis.

**Não cabe inteiro:** o bloco §2.9–2.15. A nav de 9 itens implica **cinco áreas novas**
(Our Identity, Our Partnerships, Our Clients, Our Impact, Our Team, Our Books) e três delas
dependem de conteúdo que o próprio email declara não validado — Partnerships ("nomes e textos ainda
serão validados"), Team (assets não recebidos) e os dois flagship TBC. Publicar a nav completa em
01/09 significa entregar itens de menu que abrem páginas vazias ou com placeholder.

**Recomendação — lançar 01/09 com nav reduzida e ligar o resto conforme o conteúdo chega:**

- **Vai ao ar 01/09:** `Home | Our Identity | Our Solutions | Our Approach | Our Clients | Our Impact | Our Books`
  (7 itens). Todas com conteúdo real.
- **Entram logo depois, sem novo deploy de arquitetura:** `Our Partnerships` e `Our Team`, assim que
  texto validado e assets chegarem. A rota fica pronta e escondida da nav.
- O design do Guli para Solutions/5H/Clients/Impact é o caminho crítico real. Se o design não chegar
  até **sexta 28/08**, o que vai ao ar em 01/09 é a nova IA + copy nova sobre o sistema visual atual,
  e a expressão visual entra na semana seguinte.

Isso preserva o princípio do email — *nada vai para produção sem aprovação* — sem estourar a data.

---

## 7. Materially outside the agreed scope

Levantado para decisão, não recusado.

- **`Our Books` no plural com múltiplos autores** (item 3): o escopo acordado tinha **um** livro
  (seção `#book` da home). Suportar livros de vários membros do time é um **tipo de conteúdo novo
  no CMS** + página de listagem. Ordem de grandeza: além do previsto. Sugestão: em 01/09 entra como
  `Our Books` já no plural apontando para o livro da Rhea; o multi-livro entra quando houver um
  segundo livro real.
- **Dashboards em `Our Impact`** (item 9): se "dashboards" significar visualização de dados viva
  (filtro por região/indústria/ano), é build novo — não é a página estática de proof que está
  orçada. Se for tratamento visual de números estáticos, cabe.
- **Ticker administrável pelo CMS** (item 17): componente + tipo de conteúdo novo. Pequeno, mas não
  estava no escopo.
- **Estrutura modular de vídeos por cliente** (item 13): substitui um `<video>` único por uma
  coleção gerenciada — novo tipo de conteúdo no CMS.

---

## 8. Perguntas que precisam do Guilherme (bloqueiam decisão, não código)

1. **`Insights` sumiu da nav de 9 itens.** Foi decisão ou omissão? A biblioteca de Insights e a
   capability de Reports & Resources estão construídas e o item 18 manda preservá-las. Assumindo
   **omissão** e mantendo Insights acessível até resposta em contrário.
2. **`Start a Conversation` também sumiu da nav.** É o CTA de captura de lead, hoje ligado ao form e
   ao roteamento por região. Mantendo o CTA no header enquanto não houver decisão.
3. **`Our News → Our Partnerships`**: o site novo não tem "Our News" — a área editorial é `Insights`.
   Confirmar que Partnerships é área **nova** e que Insights permanece separada (ver ponto 1).
4. **`Talent Development` global** (item 5) encerra a pendência de "Asian Talent Development" do
   ciclo 06-08? Assumindo que sim: vira Talent Development global, e o material regional asiático
   é absorvido como conteúdo interno.
5. **Taglines outcome-led do brief 05-08** (CEO & Top Team Transformation etc.) — foram substituídas
   pelos 8 nomes confirmados ou as frases de outcome continuam valendo **por baixo** dos nomes novos?
6. **GSK em duas Solutions** (Culture Transformation e High Performing Teams) — precisa ser duas
   intervenções claramente distintas; a CDNA confirma que são?

---

## Mapa item-a-item do email → destino

| Item do email | Bucket |
|---|---|
| 1. Homepage — nova hierarquia | §2 (copy) + §3 (hierarquia visual) |
| 2. Proof mais cedo | §2.1 imediato + §3 |
| 3. Navegação final | §2.6/2.7 imediato + §2.9-2.11 estrutural + §8 (perguntas 1-3) |
| 4. Our Identity | §2.10 |
| 5. Our Solutions (8 confirmadas) | §2.12 código + §4 conteúdo + §3 design |
| 6. Flagship por Solution | §4 (2 TBC) |
| 7. Case-study format | §2.13 código + §4 aprovação |
| 8. Our Clients | §2.9 + §3 |
| 9. Our Impact | §2.9 + §3 + §7 (dashboards) |
| 10. Our Approach / 5H | §3 (design é o item central) |
| 11. Frameworks & Diagnostics | §2.2 imediato (remover TCA) + §4 |
| 12. Our Partnerships | §4 (conteúdo não validado) |
| 13. Client testimonial videos | §2.3 imediato + §2.15 + §5 |
| 14. CorporateDNA video | §5 |
| 15. Our Team | §2.11 + §3 + §4 |
| 16. Visual direction geral | §3 |
| 17. Running ticker | §2.14 + §4 + §7 |
| 18. Preservar | §1 |
| 19. Target e tracker | este documento |
