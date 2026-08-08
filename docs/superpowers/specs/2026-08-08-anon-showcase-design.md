# Design — Branch `demo/anon-showcase` para criativo anonimizado

**Data:** 2026-08-08
**Objetivo:** Rodar o site localmente com uma marca fictícia e conteúdo fake, para
capturar **screenshots** de **Home**, **1 Case** e **1 Solução/5H** sem expor
nenhum dado do cliente real (nomes, logos, autoria, clientes, advisors).

Branch descartável — nada disso vai para produção nem se mergeia na `main`.

---

## Contexto da arquitetura

- Site em Next.js (App Router, porta 3006), conteúdo dinâmico vindo de um **CMS
  externo por HTTP** (`lib/cms/client.ts` → `${CMS_URL}/api/content/...`), com
  `CMS_READ_API_KEY`. O site **não** acessa o Postgres direto.
- Identidade da marca e vários dados sensíveis estão **hardcoded no código/assets**,
  não no CMS:
  - `lib/site.ts` → `SITE_URL`, `SITE_NAME` ("Corporate DNA Consulting"), `SITE_DESCRIPTION`.
  - `app/page.tsx` → mural de logos de clientes reais (`orderedLogos`), bloco do
    livro (título + autora **Rhea Leckie**), labels de stats, challenges, metadata.
  - Metodologia **5H®** em `components/five-h/*`, `app/approach/page.tsx` e cópia.
  - Assets em `public/`: `cdna-logo*.svg`, `public/logos/*` (150+ logos de clientes
    reais), `5H-methodology.jpg`, `book-cover.*`, fotos de advisors
    (`guilherme.jpg`, `mike.jpg`, `phil.jpg`, `rhea.jpg`, `jp.jpg`, `gen.jpg`).
  - `lib/offices.ts`, `lib/nav.ts`, `components/SiteFooter.tsx`, `components/NavV1.tsx`,
    `app/layout.tsx`, `app/manifest.ts`, `app/opengraph-image.tsx`.

## Divisão de trabalho

| Camada | Responsável | Escopo |
|--------|-------------|--------|
| **B — Conteúdo do CMS** (cases, pessoas, soluções, singletons) | **Usuário** | CMS + Postgres local no Docker, expondo `/api/content` num `http://localhost:PORTA`, semeado com o *pacote de conteúdo fake* (abaixo). |
| **A — Marca/assets hardcoded** | **Claude** | Branch, edição de código, troca de assets, apontar env pro CMS local. |

## Decisões travadas

- **Marca fictícia:** `Meridian Leadership Advisory` (SITE_NAME), domínio fictício
  `https://meridianleadership.example` (ou similar não-resolvível).
- **Metodologia:** `5H®` → **"The 5P Framework"**, preservando a estrutura de 5
  itens dos componentes `five-h`. Os 5 nomes (P-words) mapeados 1:1 sobre os 5 H
  atuais serão definidos na implementação (lendo `five-h-data.tsx`); placeholders
  claros são aceitáveis.
- **Livro/autora:** título e autora fictícios (ex.: autora "Elena Hart").
- **Mural de clientes:** **escondido na branch** (a seção de `orderedLogos` na Home
  é removida/comentada) — elimina o risco dos logos reais sem precisar gerar fakes.
- **Fotos de advisors:** substituídas por **avatares placeholder** neutros.

## Mudanças no site (Camada A)

1. **Branch & env**
   - Criar `demo/anon-showcase` a partir da `main`.
   - Ajustar `.env.local`: `CMS_URL` → CMS local do usuário; `CMS_READ_API_KEY` →
     chave do CMS local (se houver). `.env.local` **não** é commitado.

2. **Identidade da marca** (substituição de strings)
   - `lib/site.ts`: `SITE_NAME`, `SITE_URL`, `SITE_DESCRIPTION`.
   - Metadata/title em `app/page.tsx` e `app/layout.tsx`.
   - `app/manifest.ts`, `app/opengraph-image.tsx`.
   - `components/SiteFooter.tsx`, `components/NavV1.tsx`, `lib/nav.ts`.
   - `lib/offices.ts` (nomes/endereços de escritórios, se identificarem).
   - Grep exaustivo por `Corporate DNA`, `corporatedna`, `CDNA`, `Rhea Leckie` nos
     diretórios **renderizáveis** (`app/`, `components/`, `lib/`, `messages/`,
     `public/*.txt`, `public/*.svg`) — docs/specs ficam intactos.

3. **Metodologia 5H → 5P** em `components/five-h/*`, `app/approach/page.tsx` e i18n
   (`messages/*`), preservando 5 itens.

4. **Livro** (`app/page.tsx`): título + autora fictícios.

5. **Assets**
   - `public/cdna-logo*.svg` → wordmark placeholder "Meridian" (mesmos nomes de
     arquivo para não quebrar imports).
   - Mural de clientes: seção removida/comentada na Home.
   - `5H-methodology.jpg`, `book-cover.*` → placeholder neutro (mesmos nomes).
   - Fotos de advisors renderizadas na Home (`PhotoCarousel`) → avatares
     placeholder (mesmos nomes de arquivo).

6. **Pacote de conteúdo fake** (entregue ao usuário para semear no CMS local) —
   textos coerentes com a marca fictícia:
   - **1 Case:** cliente fictício (ex.: "Northwind Energy"), desafio, abordagem,
     resultado com métricas inventadas, indústria/serviço/região.
   - **1 Solução / 5P:** título, resumo, os 5 passos.
   - **~2–3 Pessoas:** nomes fictícios, cargos, bios curtas, avatar placeholder.
   - **Home singleton (`page_home`):** `years / countries / faculty / sponsoredPct`.

7. **Verificação**
   - `npm run dev` (porta 3006) apontando pro CMS local.
   - Conferir que **Home**, **1 Case** e **1 Solução/5P** renderizam com dados fake
     e **sem nenhuma menção real** (grep de sanidade nas rotas + inspeção visual).
   - Só então o usuário captura os screenshots.

## Fora de escopo

- Página de Time dedicada; recriar todos os cases/soluções.
- Qualquer deploy (Vercel etc.) — tudo local.
- Reversibilidade "limpa" via flag: a branch é descartável, então as edições são
  diretas (sem `DEMO_MODE`), o que simplifica o trabalho.

## Critérios de sucesso

- As 3 telas-alvo abrem localmente sem erro, com marca **Meridian** e conteúdo fake.
- Grep por termos reais (`Corporate DNA`, `CDNA`, `Rhea Leckie`, `5H`, nomes de
  clientes reais) **não** retorna nada renderizável nessas rotas.
- Nenhum logo de cliente real, foto real de advisor ou trademark real aparece.

## Riscos / atenção

- **5H → 5P** é a maior mudança textual e toca i18n; risco de sobrar "5H" em alguma
  string traduzida. Mitigar com grep final em `messages/*` e nas rotas.
- Se o CMS local não estiver com a mesma **forma de payload** da produção, as páginas
  podem cair no fallback/estado vazio — validar a resposta da API local antes de printar.
- Avatares/placeholder devem manter proporção esperada pelos componentes para não
  quebrar layout no print.
