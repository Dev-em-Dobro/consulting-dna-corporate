# Anon Showcase (branch `demo/anon-showcase`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rodar o site localmente com marca fictícia ("Meridian Leadership Advisory") e conteúdo fake, para capturar screenshots de Home, 1 Case e 1 Solução/5P sem expor nenhum dado real do cliente.

**Architecture:** Branch descartável `demo/anon-showcase`. A marca/assets estão hardcoded no código (Camada A → este plano); o conteúdo dinâmico vem de um CMS local no Docker do usuário (Camada B → o usuário semeia com o pacote de conteúdo da Task 6). Edições diretas, sem flag de "demo mode" (branch é jogada fora).

**Tech Stack:** Next.js 16 App Router, next-intl, next/image, TypeScript. Sem framework de teste no repo → cada task verifica com `grep` (nenhum termo real restante) + build/dev. Porta dev: 3006.

**Convenções de anonimização (referência para todas as tasks):**
- Marca: `Corporate DNA Consulting` / `Corporate DNA` → `Meridian Leadership Advisory` / `Meridian`.
- Domínio: `corporatednaconsulting.com` → `meridianleadership.example`.
- Autora do livro: `Rhea Leckie` → `Elena Hart`.
- Metodologia: `5H` / `5H®` / `The 5H Framework` → `5P` / `The 5P Framework`.
- Mapeamento 5H→5P (label; verbo/game/cor/ícone inalterados):
  `HEAD→PERSPECTIVE`, `HEART→PEOPLE`, `HUNCH→PERCEPTION`, `HANDS→PERFORMANCE`, `HABITS→PERSISTENCE`.
- Parcerias reais (`Harvard Business Impact`, `Imperial College London`) → `Aldbridge Executive Institute`, `Northgate Business School`.

**Fora de escopo:** `next.config.mjs` redirects (contêm nomes de clientes reais mas NÃO renderizam em tela — só afetam navegação a URLs legadas), páginas não-alvo (about, insights, awards, terms…), docs/specs, deploy.

---

### Task 0: Branch + apontar env para o CMS local

**Files:**
- Modify: `.env.local` (NÃO versionado)

- [ ] **Step 1: Criar a branch a partir da main**

Run:
```bash
cd "E:/projetos/consulting-dna-corporate"
git checkout main
git checkout -b demo/anon-showcase
```
Expected: `Switched to a new branch 'demo/anon-showcase'`

- [ ] **Step 2: Apontar `.env.local` para o CMS local do usuário**

Editar `.env.local`:
- `CMS_URL` → a URL do CMS local (ex.: `http://localhost:3000` ou a porta que o Docker do usuário expõe — **confirmar com o usuário**).
- `CMS_READ_API_KEY` → a chave do CMS local (ou remover a linha se o CMS local não exigir).

- [ ] **Step 3: Confirmar que a API local responde**

Run (ajustar host/porta):
```bash
curl -s "$CMS_URL/api/content/cases?pageSize=1"
```
Expected: JSON com `{ items: [...], page, pageSize, total }`. Se vier vazio, o usuário ainda não semeou (Task 6) — seguir mesmo assim; validar de novo na Task 7.

- [ ] **Step 4: Commit (só rastreio da branch; `.env.local` é ignorado)**

```bash
git commit --allow-empty -m "chore: start demo/anon-showcase branch"
```

---

### Task 1: Marca core (`lib/site.ts`)

**Files:**
- Modify: `lib/site.ts`

- [ ] **Step 1: Substituir nome, URL e descrição**

Em `lib/site.ts`:
```ts
export const SITE_URL = "https://meridianleadership.example";
export const SITE_NAME = "Meridian Leadership Advisory";
export const SITE_DESCRIPTION =
  "Global leadership advisory & executive coaching. We help CEOs, CHROs and executive teams align leadership, accelerate decisions and build the talent required to deliver transformation.";
```
(A descrição não cita a marca — mantida.)

- [ ] **Step 2: Verificar**

Run: `grep -rn "Corporate DNA\|corporatednaconsulting" lib/site.ts`
Expected: nenhum resultado.

- [ ] **Step 3: Commit**

```bash
git add lib/site.ts && git commit -m "chore(demo): rebrand site core to Meridian"
```

---

### Task 2: Home (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Metadata title (linha ~27-28)**

De:
```ts
    "Global Leadership Advisory & Executive Coaching | Corporate DNA";
```
Para:
```ts
    "Global Leadership Advisory & Executive Coaching | Meridian";
```

- [ ] **Step 2: Esconder o mural de logos de clientes**

Remover o import do `LogoMarquee` (linha ~10), as constantes `orderedLogos` / `logoRowSplit` / `logoRow1` / `logoRow2` (linhas ~40-51), e o bloco de marquee dentro de `{/* CREDIBILITY */}`. Substituir as duas linhas:
```tsx
            <LogoMarquee logos={logoRow1} duration={logoRow1.length * 4.6} />
            <LogoMarquee logos={logoRow2} duration={logoRow2.length * 4.6} reverse />
```
e o parágrafo "Trusted by leadership teams at" acima delas — apagar o `<div className="pb-[34px] pt-[70px]">…</div>` inteiro que contém esse label + as duas marquees. Manter o restante da `<section className="bg-ink text-white">`.

- [ ] **Step 3: Livro — autora fictícia (linhas ~59, ~122, ~125)**

Trocar todas as ocorrências de `Rhea Leckie` por `Elena Hart` neste arquivo:
```bash
# referência — aplicar via editor:
#  linha 59:  "...Rhea Leckie reveals..."  -> "...Elena Hart reveals..."
#  linha 122: personLd({ name: "Rhea Leckie", jobTitle: "Founder" }) -> name: "Elena Hart"
#  linha 125: author: "Rhea Leckie" -> author: "Elena Hart"
```
Também no título do livro (linha ~55) `"Corporate DNA: How Great Companies…"` → `"The Leadership Code: How Great Companies Build What Competitors Can't Copy"` e no corpo (linha ~60) trocar `Corporate DNA that clients now seek to emulate` → `organisational DNA that clients now seek to emulate` (remove a marca, mantém o conceito genérico).

- [ ] **Step 4: 5H → 5P na cópia da home**

- Linha ~86 challenge: `"Proprietary 5H and DNA 360 methodology"` → `"Proprietary 5P and DNA 360 methodology"`.
- Linha ~286 cópia: `Our proprietary 5H methodology works across the` → `Our proprietary 5P methodology works across the`.
- Linha ~298 alt: `alt="The 5H Framework methodology"` → `alt="The 5P Framework methodology"`.

- [ ] **Step 5: Parcerias reais (linhas ~377-379)**

De `Harvard Business Impact` / `Imperial College London` para:
```tsx
            <span className="text-[19px] font-bold text-ink">Aldbridge Executive Institute</span>
            <span className="h-[22px] w-px bg-[#d9d5d1]" />
            <span className="text-[19px] font-bold text-ink">Northgate Business School</span>
```

- [ ] **Step 6: Carrossel de fotos → avatares placeholder (linhas ~365-372)**

Substituir o array de 14 fotos reais por 6 avatares placeholder (criados na Task 5):
```tsx
            <PhotoCarousel
              images={[
                "/avatars/a1.svg",
                "/avatars/a2.svg",
                "/avatars/a3.svg",
                "/avatars/a4.svg",
                "/avatars/a5.svg",
                "/avatars/a6.svg",
              ]}
            />
```

- [ ] **Step 7: Verificar**

Run: `grep -n "Corporate DNA\|Rhea Leckie\|5H\|Harvard Business Impact\|Imperial College\|dna-time" app/page.tsx`
Expected: nenhum resultado.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx && git commit -m "chore(demo): anonymise homepage (logos, book, 5P, partners, avatars)"
```

---

### Task 3: Chrome global (layout, manifest, opengraph, nav, footer, offices, carousel aria)

**Files:**
- Modify: `app/layout.tsx`, `app/manifest.ts`, `app/opengraph-image.tsx`, `components/NavV1.tsx`, `components/SiteFooter.tsx`, `lib/offices.ts`, `components/PhotoCarousel.tsx`

- [ ] **Step 1: Localizar todas as ocorrências de marca nesses arquivos**

Run:
```bash
grep -rn "Corporate DNA\|corporatednaconsulting\|CDNA\|cdna-logo" app/layout.tsx app/manifest.ts app/opengraph-image.tsx components/NavV1.tsx components/SiteFooter.tsx lib/offices.ts components/PhotoCarousel.tsx
```

- [ ] **Step 2: Substituir strings de marca**

Para cada ocorrência textual: `Corporate DNA Consulting`/`Corporate DNA` → `Meridian Leadership Advisory`/`Meridian`. Em `components/PhotoCarousel.tsx` (linha ~40) `aria-label="Life at Corporate DNA"` → `aria-label="Life at Meridian"`.

- [ ] **Step 3: Emails/domínio em `lib/offices.ts`**

Trocar os 5 emails `*@corporatednaconsulting.com` → `*@meridianleadership.example` (london/miami/singapore/dubai/riyadh). Endereços físicos e cidades podem permanecer (não identificam a marca), mas o comentário de topo `Corporate DNA offices` → `Meridian offices`.

- [ ] **Step 4: Referências de logo (cdna-logo\*.svg / .png)**

Se `NavV1.tsx`/`SiteFooter.tsx`/`opengraph-image.tsx` importarem `cdna-logo*.svg` ou `cdna-logo-text-white.png`, manter os mesmos caminhos (os arquivos serão sobrescritos na Task 5). Só garantir que qualquer `alt`/`aria-label` textual vire "Meridian".

- [ ] **Step 5: Verificar**

Run:
```bash
grep -rn "Corporate DNA\|corporatednaconsulting" app/layout.tsx app/manifest.ts app/opengraph-image.tsx components/NavV1.tsx components/SiteFooter.tsx lib/offices.ts components/PhotoCarousel.tsx
```
Expected: nenhum resultado.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/manifest.ts app/opengraph-image.tsx components/NavV1.tsx components/SiteFooter.tsx lib/offices.ts components/PhotoCarousel.tsx
git commit -m "chore(demo): rebrand global chrome to Meridian"
```

---

### Task 4: Metodologia 5H → 5P (`five-h-data`, `FiveHExplorer`, `app/approach`)

**Files:**
- Modify: `components/five-h/five-h-data.tsx`, `components/five-h/FiveHExplorer.tsx`, `app/approach/page.tsx`

- [ ] **Step 1: Renomear os 5 labels em `five-h-data.tsx`**

Trocar apenas os campos `label` do array `FIVE_H` (manter `key`, `verb`, `game`, `color`, `icon`, `description`):
```
HEAD   -> PERSPECTIVE
HEART  -> PEOPLE
HUNCH  -> PERCEPTION
HANDS  -> PERFORMANCE
HABITS -> PERSISTENCE
```
E no comentário de topo (linha ~3) `5H® methodology` → `5P framework`.

- [ ] **Step 2: `FiveHExplorer.tsx` — strings "5H" renderizadas**

Run: `grep -n "5H\|HEAD\|HEART\|HUNCH\|HANDS\|HABITS" components/five-h/FiveHExplorer.tsx`
Para cada string **renderizada** (título, aria-label, cópia) trocar `5H`→`5P` e qualquer label antigo pelo novo do mapa. Não mexer em `key`/lógica.

- [ ] **Step 3: `app/approach/page.tsx` — página da metodologia**

Run: `grep -n "5H\|HEAD\|HEART\|HUNCH\|HANDS\|HABITS\|Corporate DNA\|five-h" app/approach/page.tsx`
Trocar todas as strings renderizadas: `The 5H Framework`/`5H®`/`5H` → `The 5P Framework`/`5P`; labels antigos → novos; marca → Meridian.

- [ ] **Step 4: Verificar**

Run:
```bash
grep -rn "5H\|HEAD\|HEART\|HUNCH\|HANDS\|HABITS" components/five-h/five-h-data.tsx components/five-h/FiveHExplorer.tsx app/approach/page.tsx
```
Expected: nenhum resultado renderizado (ok se sobrar em nome de função/ícone interno tipo `HeadIcon`, que não aparece em tela — mas prefira não deixar `5H`).

- [ ] **Step 5: Commit**

```bash
git add components/five-h/five-h-data.tsx components/five-h/FiveHExplorer.tsx app/approach/page.tsx
git commit -m "chore(demo): rename 5H methodology to 5P Framework"
```

---

### Task 5: Assets — logo Meridian + avatares placeholder

**Files:**
- Overwrite: `public/cdna-logo.svg`, `public/cdna-logo-light.svg`, `public/cdna-logo-horizontal.svg`, `public/cdna-logo-horizontal-light.svg`
- Create: `public/avatars/a1.svg` … `a6.svg`
- Modify (se necessário): `next.config.mjs`
- Replace: `public/5H-methodology.jpg` (opcional — ver Step 4)

- [ ] **Step 1: Sobrescrever os wordmarks (mesmos nomes de arquivo)**

`public/cdna-logo-horizontal.svg` (versão escura, p/ fundo claro):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 40" role="img" aria-label="Meridian">
  <text x="0" y="28" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" letter-spacing="1.5" fill="#1a1a1a">MERIDIAN</text>
</svg>
```
`public/cdna-logo-horizontal-light.svg` (versão clara, p/ fundo escuro): idêntico, `fill="#ffffff"`.
`public/cdna-logo.svg` (marca compacta, fundo claro):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" role="img" aria-label="Meridian">
  <text x="0" y="30" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#1a1a1a">M</text>
</svg>
```
`public/cdna-logo-light.svg`: idêntico ao compacto, `fill="#ffffff"`.

- [ ] **Step 2: Criar 6 avatares placeholder**

Para `i` de 1 a 6, criar `public/avatars/a{i}.svg` (variar `BG` entre `#c9d4c0 #d8cabc #c3ccd6 #d6c3c9 #cdd0c3 #c3d4d2`):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-label="Team member">
  <rect width="320" height="200" fill="BG"/>
  <circle cx="160" cy="82" r="34" fill="#ffffff" opacity="0.9"/>
  <path d="M108 168c0-29 23-46 52-46s52 17 52 46z" fill="#ffffff" opacity="0.9"/>
</svg>
```

- [ ] **Step 3: Permitir SVG no next/image (branch only)**

Em `next.config.mjs`, dentro de `images: { ... }`, adicionar:
```js
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
```
(necessário porque `PhotoCarousel` usa `next/image` com os avatares SVG.)

- [ ] **Step 4: Imagem da metodologia (opcional)**

`public/5H-methodology.jpg` é uma foto do diagrama 5H. Se aparecer no print da Home/approach, substituir por um placeholder neutro. Opção simples sem tooling de imagem: no `app/page.tsx` trocar o `<Image src={methodology} …>` por uma caixa CSS com o texto "The 5P Framework" (sem depender do .jpg). Alternativa: deixar como está se o print não incluir essa seção. **Decidir com base no enquadramento do screenshot.**

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (sem imports quebrados, sem TS de var não usada da Task 2).

- [ ] **Step 6: Commit**

```bash
git add public/cdna-logo*.svg public/avatars next.config.mjs app/page.tsx
git commit -m "chore(demo): Meridian wordmark + placeholder avatars, allow SVG"
```

---

### Task 6: Pacote de conteúdo fake (deliverable p/ o usuário semear no CMS local)

**Files:**
- Create: `docs/superpowers/anon-showcase-content-pack.md`

- [ ] **Step 1: Escrever o pacote de conteúdo fake**

Criar o arquivo com textos prontos, coerentes com a marca Meridian, para o usuário colar no CMS local. Estrutura (baseada em `lib/cms/schemas.ts`):

**1 Case** (`type: case`, `slug: northwind-energy`):
- `title`: "Aligning a new executive team at Northwind Energy"
- `summary`: "How Meridian helped a global energy group align its top team and accelerate its first-100-days agenda."
- `tags`: ["Executive alignment", "Energy", "EMEA"]
- `introduction`: 2–3 frases sobre o desafio.
- `challenge` / `approach` / `outcome`: 1 parágrafo cada (genéricos, sem cliente real).
- `measurableResult`: "Decision cycle time reduced 34%; top-team alignment score up from 61 to 88."
- `quote` + `quoter`: citação fictícia atribuída a "Chief HR Officer, Northwind Energy".
- `facets`: industry `Energy`, service `Executive team alignment`, region `EMEA`, outcome `Faster decisions`.

**1 Solution** (`type: solution`, `slug: executive-team-alignment`):
- `title`: "Executive Team Alignment"
- resumo + os 5 passos do **5P Framework** (Perspective, People, Perception, Performance, Persistence).

**2–3 Pessoas** (`type: person`): nomes fictícios (ex.: "Elena Hart — Founder", "Marcus Reed — Managing Partner", "Sofia Almeida — Principal"), bios curtas, avatar placeholder (o CMS local pode usar os `/avatars/a{i}.svg` ou qualquer imagem neutra).

**Home singleton** (`page_home`): `years: 18`, `countries: 36`, `faculty: 75`, `sponsoredPct: 90%`.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/anon-showcase-content-pack.md
git commit -m "docs(demo): fake CMS content pack for local seeding"
```

- [ ] **Step 3: Handoff ao usuário**

Avisar o usuário para semear esses itens no CMS local (Docker) antes da verificação da Task 7.

---

### Task 7: Verificação end-to-end + handoff dos screenshots

**Files:** nenhum (validação)

- [ ] **Step 1: Subir o dev server**

Run: `npm run dev`
Expected: server em `http://localhost:3006`.

- [ ] **Step 2: Validar as 3 telas-alvo no browser**

Abrir e inspecionar visualmente:
- `http://localhost:3006/` (Home) — marca Meridian, sem mural de clientes reais, avatares placeholder, livro por "Elena Hart", seção 5P.
- `http://localhost:3006/cases/northwind-energy` (Case) — dados fake do CMS local.
- `http://localhost:3006/approach` (Solução/5P) — "The 5P Framework" com PERSPECTIVE/PEOPLE/PERCEPTION/PERFORMANCE/PERSISTENCE.

- [ ] **Step 3: Grep de sanidade nas rotas renderizáveis**

Run:
```bash
grep -rin "corporate dna\|corporatedna\|rhea\|leckie\| 5h\|5h®\|harvard business impact\|imperial college" app components lib | grep -v "node_modules"
```
Expected: nenhum resultado renderizável (ignorar nomes internos de funções/ícones tipo `HeadIcon`, que não aparecem em tela).

- [ ] **Step 4: Conferir que nenhum logo/foto real aparece**

Confirmar visualmente que `public/logos/*` (clientes reais) e `public/dna-time/*` (fotos reais) NÃO aparecem em nenhuma das 3 telas. (Não precisam ser apagados do disco — só não podem renderizar.)

- [ ] **Step 5: Handoff**

Avisar o usuário: telas prontas para screenshot. Se algo real ainda aparecer, voltar à task correspondente.

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura da spec:** marca (T1, T3), 5H→5P (T2, T4), mural de clientes (T2), livro/autora (T2), advisors/fotos (T2+T5), logos/assets (T5), env/CMS (T0), conteúdo fake (T6), verificação (T7). ✔
- **Placeholders:** nenhum "TBD/TODO" de requisito; os pontos "decidir com base no enquadramento" (T5 Step 4) e host/porta do CMS (T0) dependem de input do usuário e estão marcados como tal. ✔
- **Consistência de tipos/nomes:** mapa 5H→5P idêntico em T2/T4/T6; marca/domínio/autora idênticos em todas as tasks; nomes de arquivo de avatar (`/avatars/a1..a6.svg`) idênticos em T2/T5. ✔
