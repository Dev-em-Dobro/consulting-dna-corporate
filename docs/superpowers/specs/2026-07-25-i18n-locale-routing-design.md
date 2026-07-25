# i18n por prefixo de URL (`/en /pt /es`) — design de implementação

**Data:** 2026-07-25
**Branch:** `feat/correcoes-reuniao-24-07`
**Spec de origem:** `specs/005-i18n-seo-redirects/spec.md` (aprovada 24-07) — este doc é o **como**;
a spec é o **porquê**.

## Decisões desta sessão (2026-07-25)

- **Biblioteca:** `next-intl` (conforme `research.md` D1), não a rota nativa. Ganho: middleware
  pronto (`/` → `/en`, prefixos), `Link`/`redirect`/`usePathname` cientes de locale, helpers de
  `hreflang`.
- **Escopo agora = "shell only".** Monta rota + seletor + hreflang + threading de locale no CMS. O
  **chrome (textos fixos da UI) permanece em EN** nos 3 locales; conteúdo vem do CMS (só EN populado
  → PT/ES caem no fallback EN do read API). PT/ES viram "reais" quando o CMS tiver conteúdo, sem
  mudar código.

## Constantes de i18n

- Locales: `en`, `pt`, `es`. Default: `en`.
- `localePrefix: 'always'` → `/en` é explícito (FR-312).
- `localeDetection: false` → **sempre abre em EN**, nunca por geolocalização (FR-312).

## Componentes / módulos

| Unidade | Papel |
|---|---|
| `lib/i18n/routing.ts` | `defineRouting({ locales, defaultLocale:'en', localePrefix:'always', localeDetection:false })` |
| `lib/i18n/navigation.ts` | `createNavigation(routing)` → `Link`, `redirect`, `usePathname`, `useRouter` localizados |
| `lib/i18n/request.ts` | `getRequestConfig` — carrega mensagens do locale |
| `middleware.ts` | middleware do next-intl; matcher exclui `api`, `preview`, `v1`, `_next`, arquivos com ponto |
| `messages/en.json` | textos fixos do chrome (nav, footer, botões, form) |
| `messages/pt.json`, `messages/es.json` | reexportam `en` por ora (chrome EN consistente) |
| `components/LanguageSwitcher.tsx` | bandeiras EN/PT/ES no topo; troca prefixo mantendo a rota; sem auto-redirect |
| `lib/seo/alternates.ts` | helper de `canonical` + `alternates.languages` (hreflang + x-default) por página |

## Estrutura de rotas

- **Mover** todas as páginas públicas de `app/*` para `app/[locale]/*`.
- `app/[locale]/layout.tsx` — novo: `<html lang={locale}>`, `NextIntlClientProvider`, chrome
  (Nav/Footer/WhatsApp/Cookie/JSON-LD Organization), fontes.
- `app/layout.tsx` — reduzido a passthrough (`children`), sem `<html>` (migra para o `[locale]`).
- **Fora do prefixo:** `app/api/*`, `app/preview/*`, `app/v1/*`, `robots.ts`, `sitemap.ts`, estáticos.

## Fluxo

1. Request `/` → middleware 301→ `/en`.
2. `/pt/solutions` → `[locale]=pt`; layout provê mensagens PT (= EN por ora) + `lang="pt"`.
3. Página lê `params.locale`, passa para `getEntry/getPage/getList` (client já aceita `locale`,
   default `"en"`). Fallback EN é do read API do CMS.
4. `generateMetadata` emite canonical do locale atual + `alternates.languages`
   `{ en, pt, es, 'x-default': en }` (FR-311).

## Links & navegação internos

- `next/link` → `@/lib/i18n/navigation` nos 8 arquivos: `NavV1`, `SiteFooter`, `PagePlaceholder`,
  `cases/CaseRow`, `insights/page`, `solutions/page`, `solutions/regions/page`,
  `solutions/5h-framework/page`. `href` continua relativo; o `Link` prefixa o locale.
- `next/navigation`: `notFound()` inalterado; `redirect()` de rota → versão localizada;
  `TopProgress` (`usePathname`) → versão localizada.

## SEO

- `sitemap.ts`: cada rota emitida 1×/locale com `alternates.languages` (hreflang).
- `robots.ts`: inalterado (já exclui `/preview`, `/v1`).
- Canonicais e OG resolvem via `metadataBase` (já configurado, `SITE_URL`).

## Verificação (manual — sem suíte de testes no repo)

- `/` redireciona para `/en` (single hop).
- Seletor troca `/en/solutions` ↔ `/pt/solutions` mantendo a rota.
- `/pt/...` e `/es/...` renderizam (fallback EN do CMS), `<html lang>` correto.
- `<head>` tem canonical do locale + 3 `hreflang` + `x-default`.
- `/api`, `/preview`, `/v1` **não** ganham prefixo de locale.
- Build (`npm run build`) passa.

## Fora de escopo (nesta tarefa)

- Tradução do chrome para PT/ES (fica pronto para preencher: `pt.json`/`es.json`).
- Conteúdo traduzido no CMS (tarefa do repo `corporate-dna-cms`, ver `specs/cms-tarefas.md`).
- Mapa de redirects 301 (aguarda lista do cliente — `specs/005 … research.md` D2).
