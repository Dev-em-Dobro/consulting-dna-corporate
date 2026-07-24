# Estado do Projeto — Corporate DNA (site institucional)

**Documento gerado em:** 2026-07-24
**Repositório:** `consulting-dna-corporate`
**Branch atual:** `feat/map` (mapa interativo de escritórios, ainda não mergeado)
**Branch principal:** `main`

Este documento consolida **tudo que foi feito até agora** no projeto: o site em si,
a integração com o CMS e a feature em andamento (mapa interativo). Serve como ponto
de referência único para retomar o trabalho.

---

## 1. O que é o projeto

Site institucional (marketing) da **Corporate DNA Consulting** — consultoria de
liderança executiva (CEOs, C-suite, sucessão, transformação cultural), com atuação
global e 5 escritórios (Londres, Miami, Singapura, Dubai, Arábia Saudita).

O produto maior descrito em `docs/proposta.txt` prevê uma plataforma de marketing
alimentada por um **CMS headless próprio**, construído pela Dev em Dobro. Este
repositório é **apenas o site público**; o CMS é um projeto separado (ver §4).

---

## 2. Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | **Next.js ^16.2** (App Router) |
| UI | **React 19** |
| Estilo | **Tailwind CSS v4** (via `@tailwindcss/postcss`) |
| Animação | **GSAP 3.15** + `@gsap/react` |
| Mapa | **Leaflet 1.9** + tiles CARTO Voyager (keyless) |
| Validação | **Zod 4** |
| Linguagem | **TypeScript 5.9** |
| Deploy | **Vercel** (scope `impulse66` — ver memória de deploy) |

Scripts (`package.json`): `dev` e `start` rodam na porta **3006**.

---

## 3. Estrutura e histórico do site

O site foi construído e polido ao longo de várias iterações (ver `git log`). Marcos
principais, do mais antigo ao mais recente:

- **Design v1/v2/v3** — exploração de layouts; v1 foi consolidado como o design final
  (v3 removido, homepage passou a ser a raiz do site com `/v1` redirecionando).
- **Homepage revamp** — hero, nav e footer redesenhados, formulário de contato, marquee
  de logos de clientes (Aramco, Alphabet, Microsoft, etc.), seção do livro
  ("Leadership: it's in your DNA"), metodologia 5H, contadores de estatísticas.
- **Seção de pessoas (liderança)** — cards clicáveis com modal de perfil detalhado.
- **Integração com CMS** — conteúdo deixou de ser hardcoded e passou a ser lido da API
  do CMS (ver §4).
- **Polimento de conteúdo do CMS** — strip de HTML, hero banner de solução, campos de
  case, correções de richtext.

### Layout principal
`app/page.tsx` é a homepage (raiz). Compõe: `NavV1`, `HeroV1`, `LogoMarquee`,
seções de desafios/diferenciais/5H, `Counter` (stats), `PeopleGrid` (via CMS),
cases, livro, `ContactForm`, **`LocationsBlock`** (mapa — feature nova) e `SiteFooter`.

---

## 4. Ecossistema de specs (`specs/`)

O projeto segue um fluxo de specs numeradas (Spec-Kit). Há três features:

### `001-custom-cms` — CMS headless (projeto SEPARADO)
- **Status:** Draft (especificação).
- Restrição forte do cliente: o CMS **deve ser um projeto separado do site** —
  codebase, deploy e domínio próprios. Este repositório apenas **consome** conteúdo.
- Documentação completa: `spec.md`, `plan.md`, `data-model.md`, `research.md`,
  `quickstart.md`, `tasks.md` + contratos de API (`admin-api.md`, `read-api.md`).

### `002-site-cms-integration` — integração site ↔ CMS (lado do site)
- **Status:** **Implementado** (US1 + US2 entregues em 2026-07-22; build verde, 30 rotas;
  verificado ao vivo contra o CMS em `:3010`).
- O site consome a **API HTTP de leitura** do CMS (não o banco direto). Substituiu
  conteúdo hardcoded (perfis de liderança, solutions/5H/cases/regiões/livro/awards/insights)
  por conteúdo publicado vindo do CMS.
- Teste de smoke opcional (Vitest, T027) foi adiado.
- Conexão via `.env.local` (banco/API já configurados).

### `003-interactive-locations-map` — mapa interativo (FEATURE ATUAL) ⬅
Detalhada na §5 abaixo.

---

## 5. Feature atual: Mapa interativo de escritórios (`feat/map`)

Substitui a antiga grade estática "Our offices" na homepage por um bloco
**mapa + carrossel** interativo.

### Comportamento
- Um mapa mostra o escritório ativo com um **pin** customizado.
- Abaixo, um **carrossel horizontal** com os nomes das cidades; a cidade central
  (ativa) fica em negrito/escura, as vizinhas ficam esmaecidas.
- Ao trocar de escritório, a câmera do mapa faz um **fly** (zoom out → viaja pelo
  mundo → zoom in) e o pin cai com um "bounce".
- **O mapa NÃO é interativo** pelo usuário (sem drag, scroll-zoom, double-click, etc.).
  Toda navegação é pelo carrossel: setas, clique numa cidade, swipe (mobile) ou teclado.
- Respeita `prefers-reduced-motion` (pulo instantâneo em vez do fly).
- **Degradação graciosa**: se o mapa falhar, cai para uma grade de escritórios legível.
- Carregamento **lazy** — o mapa só monta quando a seção entra na viewport (protege o LCP).

### Arquivos entregues
| Arquivo | Papel |
|---------|-------|
| `lib/offices.ts` | Fonte de verdade: tipo `Office` + os 5 escritórios (coords, zoom, endereço, tel, email). Define a ordem do carrossel. |
| `components/LocationsMap.tsx` | Wrapper imperativo do Leaflet: mapa 100% não-interativo, pin de marca, `flyTo`/jump, choreografia do pin (fade → fly → bounce), cleanup. |
| `components/LocationsCarousel.tsx` | Carrossel controlado: cidade ativa centralizada, vizinhas esmaecidas, setas/clique/swipe/teclado, `aria-current`, re-centra após carregar fonte e em resize. |
| `components/LocationsBlock.tsx` | Orquestrador: estado do índice ativo, mount lazy via IntersectionObserver, reduced-motion, bloco de endereço, swipe no mapa, fallback grid. |
| `app/page.tsx` | Seção estática antiga substituída por `<LocationsBlock />` (linha 314); array `offices` antigo removido. |
| `public/pin.png` | Imagem do pin customizado (112×160). |
| `mapa.JPG` | Design de referência (na raiz do repo). |

### Progresso das tasks (`tasks.md`)
- **T001–T008: concluídas** (setup, dados, os 3 componentes, integração, `tsc --noEmit` limpo).
- **T009: pendente** — passagem manual dos cenários 1–9 do `quickstart.md`.

---

## 6. ⚠️ Divergência importante: Mapbox (spec) vs Leaflet (código)

A **spec/plan/tasks e vários comentários no código ainda falam em "Mapbox"** (e há
menção a MapLibre/OpenFreeMap numa etapa intermediária), mas a **implementação real
usa Leaflet + tiles CARTO Voyager**, que são **keyless** (não precisam de token).

Consequências práticas:
- **Não há mais bloqueio por token.** A task T009 e as notas dizem que a validação
  manual está "blocked on a real `NEXT_PUBLIC_MAPBOX_TOKEN`" — isso **está desatualizado**.
  Com Leaflet+CARTO o mapa deve renderizar sem token nenhum.
- Comentários desatualizados a corrigir:
  - `LocationsBlock.tsx` — docstring diz "non-interactive **Mapbox** map" e "Keep
    **Mapbox** out of the initial bundle" / "Free **MapLibre** + OpenFreeMap".
  - `tasks.md` T001/T002/T004 — referenciam `mapbox-gl`, `NEXT_PUBLIC_MAPBOX_TOKEN`
    e "non-interactive **Mapbox**".
- `package.json` confirma: dependência é **`leaflet`** + `@types/leaflet`; **não há**
  `mapbox-gl` nem `maplibre-gl` instalados.

**Recomendação:** alinhar spec/tasks/comentários ao que foi de fato construído
(Leaflet + CARTO) e remover as referências a token do Mapbox.

---

## 7. Pendências / próximos passos

1. **Validar o mapa manualmente** (quickstart cenários 1–9): fly entre escritórios,
   pin, não-interatividade, swipe mobile, reduced-motion, fallback, responsivo (375px→desktop).
2. **Ajuste fino de `coords`/`zoom`** em `lib/offices.ts` — as coordenadas são
   aproximadas; refinar visualmente cada escritório.
3. **Sincronizar documentação** com a stack real (Leaflet/CARTO) — ver §6.
4. **Commit + PR** da branch `feat/map` (atualmente tudo untracked/não commitado).
5. **Deploy:** somente quando o usuário pedir explicitamente; HEAD deve ter autor
   `impulseaisolutions@gmail.com` (scope `impulse66`), conforme regras de deploy.

---

## 8. Notas de deploy (memória do projeto)

- Deploy **apenas quando solicitado** — nunca automático.
- Deploy para a Impulse (scope `impulse66`); o autor do commit HEAD **deve** ser
  `impulseaisolutions@gmail.com` ou o time bloqueia.
- Existem dois logins Vercel (Impulse vs pessoal); cada um só enxerga o próprio scope.
