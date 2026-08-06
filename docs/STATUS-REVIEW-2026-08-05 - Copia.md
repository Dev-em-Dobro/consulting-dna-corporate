# Corporate DNA — Consolidated Implementation Status

**In response to the consolidated brief of 05 Aug 2026 (Nitin's review + JP's observations, coordinated by G).**
Prepared by: Beto & Cadu / Dev em Dobro
Date: 2026-08-05
Scope: the public website only (the CMS is a separate project that this site consumes).

---

# ⏳ Outstanding — só o que faltou (atualizado 2026-08-06)

> **Atualização 2026-08-06:** o restante do código do brief foi implementado, mergeado na `main` e **deployado em produção** (`consulting-dna-corporate-alpha.vercel.app`) e no staging. Validado no ar. Entregue nesta rodada: **Solutions "Client Perspective" proof block (item 8)**, **Reports & Resources downloads (item 10)**, **gate de autoria de Insights → "Corporate DNA" até aprovação (item 10)**, **home stats via CMS (item 5)**, **região "Riyadh" + 5H® (item 12)**. Abaixo fica **apenas o que ainda falta**.

### A. Dev — o que ainda podemos fazer (pequeno / pós-launch)
- **Captions acessíveis do vídeo** — adicionar `<track kind="captions">` ao `<video>` quando houver o arquivo `.vtt`. (Item 4) **[DEV — depende do .vtt]**
- **Atribuição externa de Insights** — mapear/renderizar `originalSource` / `originalPublicationDate` / `sourceLink` (campos já aceitos pelo schema; exibição não implementada por decisão). (Item 10) **[DEV — opcional]**
- **Sweep final de QA** — desktop+mobile, header/footer, links/CTAs, qualidade de imagem, vídeo/captions, acessibilidade, responsivo, page speed, filtros de cases, comportamento do CMS, consistência de títulos/roles/locations/figures. Rodar **por último**. (Item 12) **[DEV — agendado por último]**
- **Re-edit profissional do vídeo** de depoimentos. **[POST]**
- **Resource centre gated + lead capture/automação** (além do Reports & Resources simples). **[POST]**

### B. CMS — CDNA edita direto, sem dev
- **Solutions (item 2):** reestruturar nas 7 outcome-led; liderar cada card com a frase de outcome e mecanismos abaixo; **fold Inclusion & Diversity** em L&C + Women in Leadership.
- **Talent (item 6):** criar **Talent & Succession** (global); reparentar/rotular **Asian Talent Development**; **remover "2025 Asian Talent Shifts"** (salvo revalidação).
- **HPT (item 7):** remover roadmaps 3–6m e 9–12m, apresentação HPT Tools, processo de scoping e "in 2020"; manter **1 visual** high-level; revisar outras Solutions por IP exposto.
- **Testimonials (item 8):** autorar os depoimentos no campo **`proofRefs`** das solutions e removê-los do body (componente já no ar).
- **Cases (item 9):** re-taggear com a taxonomia outcome-led (filtros atualizam sozinhos).
- **Insights (item 10):** preencher **`authorApprovalStatus`** (`approved` só após aprovação) e subir PDFs em **`resources[]`**.
- **Padronização (item 12):** limpeza de capitalização e naming de regiões nas entradas do CMS.

### C. CDNA — conteúdo/aprovação (bloqueia o item) — **lista já enviada, aguardando retorno**
- **"Why We Are Different"** — claim final (Rhea/JP/Nitin). (Item 1)
- **CEO & Top Team Transformation** e **CHRO / HRLT Effectiveness** — copy fonte (Rhea). (Item 2)
- **Team Climate Assessment** — confirmar nome + conteúdo. (Item 3)
- **Auditoria numérica** — validar/remover **95% cite 5H**, **26 countries**, **"ten years"**, **©2021** (reconciliar com 36 países / 18 anos); confirmar set corporativo **18/36/75/90%**; confirmar **70+ intervenções** e **1.000+ coaching clients** se for adicionar. (Itens 3, 5)
- **Vídeo final** — spelling da Rhea, remover Andrew duplicado, nomes/empresas/títulos, captions. (Item 4)
- **Global Talent & Succession** — copy (senão publicamos "Asian Talent Development" rotulado honestamente). (Item 6)
- **Awards** — nomes/datas/descrições finais. (Item 11)
- **Global Faculty** — seleção regional (fotos **já confirmadas corretas** — sem pendência de retrato/AI). (Item 11)
- **Clientes** — todo nome/logo/citação/resultado/métrica em cases e testimonials. (Item 9)

### D. Blockers de launch
1. **Deploy + população do CMS** — várias tarefas "editar no CMS" acima dependem disso.
2. **Campos novos de Insights** dependem do projeto CMS expor `authorApprovalStatus` e os de atribuição externa (schema do site já pronto).
3. **Número real de WhatsApp** — definir `NEXT_PUBLIC_WHATSAPP_NUMBER` no env da Vercel (hoje o botão some quando não há número; sem mais placeholder no código).
4. Cada item **[CDNA]** da seção C — a lista de aprovação já foi enviada à CDNA (2026-08-06).

---

> **Nota interna (Dev em Dobro — não enviar):** este documento responde ao pedido final do
> item 13 do brief ("please return a single status list"). Ele já está em inglês, pronto para
> mandar ao G. As três lentes que o Beto pediu — *o que mudamos agora / o que depende deles /
> o que eles mesmos editam no CMS* — estão marcadas por tag em cada item e consolidadas na
> Parte C. A "versão resumida" está no fim.

---

## How to read this

Every item is tagged with who owns the next move:

| Tag | Meaning |
|-----|---------|
| **[DONE]** | Already implemented and live in the current beta. |
| **[DEV-NOW]** | We can implement it now, no dependency — a code/build change on our side. |
| **[CMS]** | Content lives in the CMS — **CDNA editors can change it directly**, no developer needed. |
| **[CDNA]** | Blocked on CDNA content, copy or a factual/approval decision before we can ship. |
| **[POST]** | Recommended, but can safely land immediately **after** a credible launch. |

Most page bodies (Solutions, Cases, Insights, Awards) are **CMS-driven**, so a lot of the copy
work is an editing task for CDNA, not a development task. Where we say **[CMS]** the change can
be made today by whoever holds CMS access, without waiting for us.

---

## ✅ Shipped (2026-08-05) — all dependency-free items done & merged to `main`

**Status: complete.** Everything below is implemented, the production build passes, and it is **merged into `main`** (commits `5084161` → merge `a259920`, and `059d1c0` → merge `ad4f803`). No CDNA input was required for any of these. Not yet deployed (deploys are manual, on request).

1. **Hero sub-headline** → "The leadership challenges that determine enterprise performance."
2. **Hero signature** → "Making Leadership Real. Results, Not Promises." now shown in the hero.
3. **Navigation** → reordered to the target `Solutions | Our Approach | Client Impact | About | Insights`; **Cases renamed to Client Impact**; **About added**; **The Book moved under Insights** (dropdown child). ("Start a Conversation" is the header CTA; Home is the logo.)
4. **Client Impact index** → heading "Leadership change, measured where it matters." + the new supporting copy; page title + breadcrumb updated.
5. **Video heading** → "What global leaders say about us."
6. **Global Presence** → "Our offices" renamed to "Our Global Presence" + the map context paragraph added; the Saudi office is now labelled by its city, **"Riyadh"** (matching the brief's hub naming).
7. **Data/brand fixes** → the stray "68 members / 16 countries" reconciled to "75 / 36"; "CorporateDNA" → "Corporate DNA" in the book copy, and the coverage-map User-Agent strings standardised to "Corporate-DNA".

**Structural scaffolds built with placeholders (copy-pending, added in a second pass — build passes):**

8. **About area** → new `/about` route with all sub-sections: *Who We Are/Our Identity, Our Story, Our Values & "Keeping It Real", Why We Are Different* (all clearly-marked "pending CDNA copy" placeholders — no invented claims), plus **Leadership** (live CMS people) and **Global Presence** (live map). **About** is now added to the nav.
9. **Our IP & Diagnostics** → new prominent section on Our Approach introducing the **5H Framework** (real copy, links to the framework), the **DNA 360 Profiler** and the **Team Climate Assessment** — the latter two carry a visible "overview / naming pending CDNA confirmation" tag.
10. **Global Faculty** → visible section inside About with a regional mosaic (Europe / Middle East / Asia Pacific / Americas) and the approved "75 across 36 countries" reference; faculty photos/selection marked pending.

**Still held (blocked on the CMS project, not just copy):** **Solutions proof component** (needs the CMS `proofRefs` data shape + approved quotes), **CMS-editable statistics**, and **Insights optional fields / Reports & Resources** — these need the separate CMS repo to expose the fields before the site side is meaningful. They remain in Part B-2/B-3.

> **What CDNA does next on the scaffolds:** send the copy for Identity / Story / Values / Why-We-Are-Different, confirm the DNA 360 Profiler overview and the Team Climate Assessment name+overview, and provide the faculty selection/photos. We drop each into its placeholder with no further structural work.

---

# Part A — Point-by-point response

## 1. Final navigation, About and identity

**Navigation** — current top-level menu is: `Our Approach | Solutions | Cases | Insights | The Book` (`lib/nav.ts:10`). "Start a Conversation" already exists as the header CTA button, and Home is the logo.
- Rename **Cases → Client Impact**, add **About**, and move **The Book** under Insights → target order `Home | Solutions | Our Approach | Client Impact | About | Insights | Start a Conversation`. **[DEV-NOW]** (nav is code-defined; the Solutions sub-menu is already CMS-fed).

**Hero** — the hero headline is already exactly *"When the stakes are high, leadership must become real."* (`HeroV1.tsx:100`). **[DONE]** — preserved as requested.

**Signature line** — *"Making Leadership Real."* appears in the footer (`SiteFooter.tsx:64`) and *"Results, Not Promises."* appears on the home Client-Impact heading. They are **not yet shown together as one signature** in the hero experience. Bringing *"Making Leadership Real. Results, Not Promises."* visibly into the hero area → **[DEV-NOW]**.

**Sub-headline fix** — replace *"The high-stakes leadership challenges facing the enterprise."* with *"The leadership challenges that determine enterprise performance."* (`app/page.tsx:126`). **[DEV-NOW]**.

**About area** — there is **no `/about` route today**. The sub-sections map as follows:
- *Leadership* → exists as the People grid on the homepage **[DONE, needs relocating]**
- *Global Presence* → exists as the offices map **[DONE, needs relocating]**
- *Global Faculty* → only mentioned in a stat line, no real section yet **[DEV-NOW + CDNA content]**
- *Who We Are / Our Story / Our Values & "Keeping It Real" / Why We Are Different* → **do not exist** **[DEV-NOW to build shells; CDNA for copy]**

We will build the About area and its section shells now, with a **placeholder for "Why We Are Different"** (final claim pending from Rhea/JP/Nitin — we will **not** invent it). **[DEV-NOW for structure] + [CDNA for copy]**.

**Paul Polman quote** — present in the Book section (`BookEndorsements.tsx:21`). **[DONE]**. Optional reuse in About is not launch-critical.

---

## 2. Reframe Solutions around business outcomes

Solution cards and pages are **fully CMS-driven** (`app/solutions/page.tsx`, content from CMS). The seven live entries today are: *leadership-development, executive-coaching, culture-transformation, high-performing-teams, women-in-leadership, inclusion-diversity, asian-talent-development*.

The requested outcome-led structure and taglines (CEO & Top Team Transformation; Executive Coaching; Leadership & Culture Transformation; Talent & Succession; High-Performing Teams & Manager Impact; Women in Leadership; CHRO / HRLT Effectiveness) is largely a **content re-authoring job in the CMS**:
- Re-title / merge existing entries and lead each card with the **outcome sentence**, then put programmes/methodology underneath as the mechanism. **[CMS]** — CDNA editors can do this directly.
- New entries **CEO & Top Team Transformation** and **CHRO / HRLT Effectiveness** don't exist yet → create the entries + placeholders. Page structure **[DEV-NOW/CMS]**; source copy **[CDNA]** (Rhea still providing).
- Fold **Inclusion & Diversity** into Leadership & Culture Transformation + Women in Leadership, and move **Asian Talent Development** under Talent & Succession (see point 6). **[CMS]** for the content; **[DEV-NOW]** for the menu grouping.

> The card copy leads with a mechanism vs. an outcome purely as a function of what's typed in the CMS body — so this is an editing decision, not a code change.

---

## 3. Make proprietary IP more visible

- 5H Framework is already under **Our Approach** (`app/approach/page.tsx`). **[DONE]** — preserved.
- **"Our IP & Diagnostics"** section does **not** exist yet. The **DNA 360 Profiler** is only referenced inside an FAQ answer; the **Team Climate Assessment** appears **nowhere** on the site. → Build the "Our IP & Diagnostics" block introducing the three assets. **[DEV-NOW for the section] + [CDNA]** to confirm Team Climate Assessment naming/content.
- **5H numerical audit** — the 5H page is hardcoded and currently states *"95% of our clients cite 5H® as the real secret of our success … across 26 countries"* (`app/approach/page.tsx:134`) and *"Over ten years and across 26 countries"* (`:158`, `:78`). These must be **validated by CDNA or removed** before launch — and note **26 countries here conflicts with the 36 countries** used elsewhere. **[CDNA decision] → [DEV-NOW to apply]**.

---

## 4. Video testimonials and client proof

- Heading is hardcoded as *"What Fortune 500 leaders say about us"* (`TestimonialsVideo.tsx:18`) → change to *"What global leaders say about us."* **[DEV-NOW]**.
- The video is a **placeholder / proof-of-concept** (component shows "coming soon" until a real `src` is supplied). **[CDNA]** to provide the final file/URL.
- Of the listed fixes: **playback/lazy-loading and mobile inline presentation are already handled in code** **[DONE]**. **Accessible captions** need a caption track wired in code **[DEV-NOW, once we have the caption file]**. **Caption accuracy, Rhea's name spelling, the duplicate Andrew, and names/companies/titles are all inside the video asset itself** → **[CDNA]** (fixed in the edit, not the code). A more professional edit can replace the temporary one later without blocking launch **[POST]**.

---

## 5. Statistics and evidence

- The homepage stats are **hardcoded**, not CMS-editable, currently: **18 years · 36 countries · 75 faculty · 90% Chairman/CXO-sponsored** (`app/page.tsx:64`). Good news: none of the risky figures ("1,200+ leaders coached", "700+ teams", "95% approval") are published on the homepage.
- Make the **statistics component CMS-editable** so CDNA controls the numbers. **[DEV-NOW to wire; then [CMS]]**.
- Add the two missing approved figures once confirmed: **70+ executive-team interventions** and **1,000+ coaching clients**. **[CDNA to confirm] → [DEV-NOW/CMS]**.
- **Full numeric audit / approval list** delivered below (Part E). Client-specific metrics (Heineken 45%, Coca-Cola 43, Shell 2,582) live in case journeys, which is where the brief wants them. **[CDNA to approve each]**.

---

## 6. Talent Development

- There is no global "Talent Development" page; **`asian-talent-development`** exists as one CMS solution and is Asia/APAC-specific. The **"2025 Asian Talent Shifts"** material lives in the CMS body (not in code).
- Target: **Talent & Succession** (global) + **Asian Talent Development** (regional specialisation underneath it). Create the global entry + reparent the Asian one. Structure **[DEV-NOW/CMS]**; global copy **[CDNA]**.
- If global copy isn't approved by launch, **relabel the current page accurately as "Asian Talent Development"** rather than a global title. **[CMS]** — quick editor fix.
- **Remove "2025 Asian Talent Shifts"** unless the data/visual is refreshed and revalidated. **[CMS to remove] / [CDNA to revalidate]**.

---

## 7. High Performing Teams and IP protection

The HPT detail (3–6-month roadmap, 9–12-month roadmap, full HPT Tools presentation, detailed scoping process, and the *"#1 priority in 2020"* line) is **CMS body content**, not code — so removing it is an **editing task**. **[CMS]**.
- Keep one high-level proposition visual and lead with client pain, business outcome, engagement triggers, decision/execution improvement, and measurable evidence. **[CMS for copy]**; if we need a dedicated "one visual" proof layout, small **[DEV-NOW]**.
- We will also review the other Solution pages for over-exposed internal methodology. **[DEV-NOW audit] + [CMS to trim]**.

---

## 8. Testimonials within Solution pages

Solution pages currently have **no distinct proof component** — the CMS carries a `proofRefs` field but the page view ignores it, so any testimonial today would just be inline body copy.
- Build a reusable **"Client Perspective" / "Evidence in Practice"** proof block and wire `proofRefs` into the solution view, placed after the first major section. **[DEV-NOW]**; the quotes themselves **[CMS] + [CDNA approval]**.

---

## 9. Client Impact and case taxonomy

- Rename **Cases → Client Impact** in the nav, breadcrumb and index page. **[DEV-NOW]** (`lib/nav.ts:17`, `app/cases/[slug]/page.tsx:52`).
- Index page currently reads *"We were created to deliver results."* / *"Please feel free to see the impact that we have been creating."* (`app/cases/page.tsx:26`) → replace with *"Leadership change, measured where it matters."* and the supplied supporting copy. **[DEV-NOW]** (or **[CMS]** if we surface it as an editable field).
- Filters are **CMS-driven facets** (industry / service / outcome) with in-browser filtering — so once Solutions change, **updating the case tags in the CMS auto-updates the filters**. **[CMS]** for the new outcome-led taxonomy.
- Every client name, logo, quote, result and metric remains **[CDNA]** to approve.

---

## 10. Insights, authorship and downloadable resources

Insights are CMS-driven; **none** of the requested optional fields exist yet in the schema (`lib/cms/schemas.ts`): *Originally published on, Original publication date, Source link, Author approval status, Downloadable file/report attachment*.
- Add these optional fields (site side + CMS schema). **[DEV-NOW on the site] + depends on the CMS project to expose the fields**.
- **Reports & Resources** (simple upload/download of PDFs/white papers within Insights) does **not** exist → build the simple version now; gated resource centre + lead capture stays **[POST]**.
- Author handling today renders *"By {author}"* or nothing — there is **no "Corporate DNA" fallback and no approval gate**. Add: default author **"Corporate DNA"** when none is confirmed, and respect an approval flag so nothing publishes under Rhea/Mike/Gen/JP/Phil/Nitin until approved. **[DEV-NOW logic] + [CDNA approvals]**.

---

## 11. Global presence, team and awards

- Offices block eyebrow is *"Our offices"* (`LocationsBlock.tsx:19`) → rename to **"Our Global Presence."** **[DEV-NOW]**.
- Add the map context paragraph ("From our established hubs in London, Singapore, Dubai and Riyadh, together with our Americas presence…across 36 countries.") — **not present today.** **[DEV-NOW]**. Current offices in code: London, Miami, Singapore, Dubai, Saudi Arabia — consistent with the brief's hubs + Americas.
- **Faculty count inconsistency** confirmed: **75 faculty / 36 countries** is used in most places, but a hardcoded **"68 members across 16 countries"** survives in the DNA-Experience block (`app/page.tsx:314`). Reconcile to the primary **75 / 36**. **[DEV-NOW]**.
- **Global Faculty** has no distinct section yet — build a visible faculty section (regional selection or a mosaic, not 75 profiles). **[DEV-NOW] + [CDNA]** for the selection/assets.
- **Awards** section exists (hardcoded list in `AwardsMentions.tsx` + a CMS-driven `/awards` page). Structure retained; names/dates/descriptions **[CDNA]** to validate.
- Team photos: consistent portraits on home, warmer photos on About, **no AI face alteration** — noted; asset-dependent. **[CDNA assets] + [DEV-NOW to place]**.

---

## 12. Editorial, design and technical QA

- **British English** and **5H®** trademark usage are already **consistent on the live pages** — good. **[DONE]**.
- One brand-name slip: *"CorporateDNA"* (no space) in the book copy (`app/page.tsx:59`) → fix to "Corporate DNA." **[DEV-NOW]**. (Two more in dev-only user-agent strings, harmless.)
- Full editorial/technical QA sweep (desktop+mobile, header/footer, links/CTAs, image quality, video/captions, accessibility, responsive, page speed, case filters, CMS behaviour, consistency of titles/roles/locations/figures) → run **after** the content changes land. **[DEV-NOW, scheduled last]**.
- Capitalisation/region-naming standardisation across CMS entries is partly **[CMS]** (editor pass) + **[DEV-NOW]** for hardcoded copy.

---

## 13. How we will work from here

- We will maintain **one consolidated implementation tracker** (this document + a live checklist). **[DONE — this doc]**.
- We support the time-zone handoff model. **Immediate blockers are listed in Part D.**

---

# Part B — The consolidated status list (as requested)

### 1) Already implemented
- Hero headline "When the stakes are high, leadership must become real." (preserved).
- 5H Framework correctly under Our Approach.
- Paul Polman quote in the Book section.
- Awards section present (structure ready; content pending validation).
- Video lazy-loading + mobile inline playback.
- British English and 5H® usage consistent on live pages.
- Client-proof cards, case-study treatment, homepage positioning.

### 2) Can be implemented now (no dependency — Dev em Dobro)
> **✅ Done & merged to `main` (2026-08-05)** — see the "Shipped" section at the top. The only items that moved to Part B-3 (blocked on the CMS project) are noted below.
- ✅ New nav order + rename **Cases → Client Impact** + move **The Book** under Insights + add **About**.
- ✅ Hero sub-headline swap → "The leadership challenges that determine enterprise performance."
- ✅ Surface the full signature "Making Leadership Real. Results, Not Promises." in the hero experience.
- ✅ Build the **About** area with section shells (Why We Are Different as a placeholder).
- ✅ Build the **"Our IP & Diagnostics"** section (5H · DNA 360 Profiler · Team Climate Assessment placeholder).
- ✅ Video heading → "What global leaders say about us."
- ✅ Cases index heading/copy swap (taxonomy filters already auto-reflect CMS tags).
- ✅ Rename "Our offices" → **"Our Global Presence"** + add the map context paragraph (+ Riyadh label).
- ✅ Fix the **68/16 → 75/36** faculty inconsistency and the **"CorporateDNA"** spacing.
- ✅ Build a visible **Global Faculty** section (regional/mosaic, photos pending).
- ⛔ **Moved to B-3 (needs the CMS project first):** make the **statistics component CMS-editable**; build the **"Client Perspective / Evidence in Practice"** proof component (needs `proofRefs` shape + approved quotes); **Insights** 5 optional fields + author "Corporate DNA" fallback/approval gate + simple **Reports & Resources**.

### 3) Requires CDNA content or approval (blocks the item)
- Final **"Why We Are Different"** claim (Rhea/JP/Nitin).
- Source copy for **CEO & Top Team Transformation** and **CHRO / HRLT Effectiveness** (Rhea).
- **Team Climate Assessment** — confirm name + content.
- **5H figures**: validate/replace "95% cite 5H" and "26 countries" (and reconcile vs 36).
- **Statistics**: confirm "70+ executive-team interventions" and "1,000+ coaching clients"; sign off the whole approval list (Part E).
- **Final video asset** (spelling of Rhea, remove duplicate Andrew, correct names/titles, captions).
- **Global Talent & Succession** copy (else we ship "Asian Talent Development" honestly labelled).
- **Awards** final names/dates/descriptions.
- Every **client name, logo, quote, result, metric** in cases/testimonials.
- **Faculty selection / regional photos** for the Global Faculty section.

### 4) Recommended immediately after launch
- Professional re-edit of the testimonials video.
- Advanced gated resource centre + lead capture/automation (beyond the simple Reports & Resources).
- Optional pruning of legacy redirects via the client's Google Search Console.
- Reuse of the Paul Polman quote in About (design-permitting).

### 5) Impact on scope / timeline
- **No change to the agreed direction.** These items raise the internal pages to the homepage's standard; they are re-authoring + targeted builds, not a redesign.
- The biggest **new build** items are: the About area, "Our IP & Diagnostics", the Solutions proof component, CMS-editable stats, and the Insights fields/Reports & Resources. Each is self-contained.
- **A lot of the Solutions/HPT/Talent work is CMS editing by CDNA, not development time** — that can proceed in parallel and is the main lever on the timeline.
- The dependency that most affects timeline is **CDNA content/approvals** (Part B-3), not engineering.

---

# Part C — What CDNA can change **directly in the CMS** (no developer needed)

These need no code from us — whoever holds CMS access can do them today:
- **Solutions**: re-title cards, lead each with the outcome sentence, push methodology below; fold Inclusion & Diversity into the right categories.
- **HPT**: delete the 3–6 and 9–12-month roadmaps, the HPT Tools presentation, the detailed scoping process, and the "in 2020" line; keep one high-level visual.
- **Talent**: relabel the current page as "Asian Talent Development"; remove "2025 Asian Talent Shifts."
- **Case tags/filters**: retag cases to the new outcome-led taxonomy (filters update automatically).
- **Awards `/awards` page body**: names, dates, descriptions.
- **Testimonial/quote text** on solution and case entries (once we ship the proof component).
- General **capitalisation / region-naming** cleanup inside CMS entries.

*(Items that only exist as new CMS fields — e.g. Insights "Source link", "Author approval status", statistics values — become CMS-editable only after we + the CMS project add those fields.)*

---

# Part D — Blockers (flagged immediately, per the brief)

1. **CMS deploy + content population** — the CMS handoff code (leads, tags, brand colours, YouTube embed, image limits) is committed but the **CMS still needs to be deployed and the entries populated**. Several "just edit in CMS" items above assume that's done.
2. **Insights optional fields** depend on the **separate CMS project** exposing them, not only the site.
3. **WhatsApp number** is still the test placeholder `5511999999999` — need the real number for "Start a Conversation." (Quick env change once provided.)
4. All **[CDNA]** items in Part B-3 — each one blocks its own section from being launch-final.

---

# Part E — Numeric claims audit (for CDNA approval)

| Claim | Where | Status |
|-------|-------|--------|
| 18 years | Homepage stats | Proposed-approved — confirm |
| 36 countries | Homepage stats + several pages | Proposed-approved — confirm; **reconcile with "26 countries" on 5H** |
| 75 faculty | Homepage stats + copy | Primary reference — confirm |
| 90% Chairman/CXO-sponsored | Homepage stats | Proposed-approved — confirm |
| **95% cite 5H®** | 5H page | **Validate or remove** |
| **26 countries (5H)** | 5H page | **Validate or remove / reconcile to 36** |
| "Over ten years" (5H) | 5H page | Soft claim — confirm |
| 68 members / 16 countries | DNA-Experience block | **Inconsistent — replace with 75 / 36** |
| 70+ executive-team interventions | (proposed, not yet on site) | Confirm before adding |
| 1,000+ coaching clients | (proposed, not yet on site) | Confirm before adding |
| Heineken 45% / Coca-Cola 43 / Shell 2,582 | Case cards | Client-specific — approve each |
| 1,200+ leaders / 700+ teams / 95% approval | **Not published** | Keep out unless sourced |

---

# ✅ Summary (versão resumida)

**Where the beta stands:** the homepage, positioning, client proof, 5H-under-Our-Approach, the Paul Polman quote and awards are in good shape. The brief is about lifting the internal pages to that same standard — it **does not change the direction and does not, by itself, delay launch.**

**Split of the work:**
- **We ship now (no dependency):** nav rework (Cases→Client Impact, add About, Book under Insights), hero sub-headline + signature line, "Our IP & Diagnostics" section, video heading, CMS-editable stats, Solutions proof component, Cases index copy, Insights fields + "Corporate DNA" author fallback + simple Reports & Resources, "Our Global Presence" rename + map text, fix 68/16→75/36 and "CorporateDNA" spacing, Global Faculty section.
- **CDNA can edit straight in the CMS (no dev):** Solutions re-authoring to outcome-led copy, HPT trimming, Talent relabel + remove "2025 Asian Talent Shifts", case retagging, awards body, capitalisation cleanup.
- **We're blocked on CDNA for:** "Why We Are Different" copy, CEO & Top-Team + CHRO source copy, Team Climate Assessment naming, the 5H "95%/26 countries" decision, the two new stats, the final video asset, global Talent copy, awards details, and all client names/logos/quotes/metrics.
- **After launch:** professional video re-edit, gated resource centre + lead automation, redirect pruning.

**Top blockers to unblock first:** (1) deploy + populate the CMS; (2) real WhatsApp number; (3) the CDNA content/approval list above — that list, not engineering, is what actually gates the launch date.
