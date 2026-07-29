# Redirects 301 do site antigo → novo (005)

**Status:** ✅ **implementado** (308 permanentes) — `lib/redirects.ts` (paths sem extensão, via
`middleware.ts`) + `next.config.mjs` `redirects()` (paths `.html`). Testado ao vivo em `:3006`.
**Fonte da lista:** Wayback Machine (CDX API), porque o `sitemap.xml` do site atual dá **403**
(Cloudflare) e o `robots.txt` bloqueia `ClaudeBot`. **Domínio antigo:** `https://corporatednaconsulting.com/`.

> ℹ️ **Poda futura (opcional):** a lista veio do **histórico** da Wayback (tudo que já existiu).
> Quando o cliente exportar as "Páginas" do **Google Search Console**, dá pra remover URLs que
> nunca existiram/indexaram — mas manter redirects a mais não causa prejuízo de SEO.

---

## Rotas do site NOVO (destinos válidos)

EN é servido **sem prefixo** (`localePrefix: as-needed`). Rotas públicas:

- `/` — home. Âncoras de seção: `#impact`, `#approach`, `#people`, `#book`, `#contact`.
- `/solutions`, `/solutions/[slug]` (slugs vêm do CMS), `/solutions/leadership`,
  `/solutions/5h-framework`, `/solutions/regions`, `/solutions/regions/[region]`
  (`london`, `singapore`, `dubai`, `saudi-arabia`, `miami`)
- `/cases`, `/cases/[slug]` (slugs do CMS)
- `/insights`, `/insights/[slug]` · `/interviews`
- `/awards`
- `/privacy` · `/cookies` · `/terms`

---

## Mapa de redirects (todos 301 permanentes)

### Home
| Antiga | Nova |
|--------|------|
| `/index.html` | `/` |

### Serviços → Solutions
> ✅ **Slugs confirmados no CMS (2026-07-27)** — as 7 solutions existem e batem 1:1. Sem fallback necessário.

| Antiga | Nova |
|--------|------|
| `/our-services` · `/our_services.html` · `/our-services/overview` | `/solutions` |
| `/our-services/leadership-development` | `/solutions/leadership-development` |
| `/our-services/executive-coaching` | `/solutions/executive-coaching` |
| `/our-services/culture-transformation` | `/solutions/culture-transformation` |
| `/our-services/high-performing-teams` | `/solutions/high-performing-teams` |
| `/our-services/women-in-leadership` | `/solutions/women-in-leadership` |
| `/our-services/inclusion_diversity` | `/solutions/inclusion-diversity` |
| `/our-services/asian-talent-development` | `/solutions/asian-talent-development` |
| `/our-services/insight-tools` · `/insight-tools.html` | `/solutions` |
| `/industry-examples.html` | `/cases` |

### Clientes → o case correspondente
> ✅ **Decisão do cliente (2026-07-29):** cada `/our-clients/<x>` aponta pro **seu case**
> (1:1 confirmado no CMS), não mais pra home. Os **índices** de clientes seguem na home,
> porque não têm equivalente no site novo.
>
> ⚠️ **`shell → /cases/case-1d007617`** — o slug da Shell no CMS não é "shell". Vale
> renomear no CMS e simplificar esse redirect.

| Antiga | Nova |
|--------|------|
| `/clients` · `/our-clients` · `/our_clients.html` | `/` |
| `/our-clients/{aviva,coca-cola,gsk,heineken,levis,morgan-stanley,unilever}` | `/cases/{mesmo-slug}` |
| `/our-clients/shell` | `/cases/case-1d007617` |
| `/what-our-client-says.html` · `/testimonials` | `/` |

### Cases / Portfolio → Cases
> ⚠️ Slugs de `/cases/*` vêm do CMS; portfolios antigos caem no índice `/cases`.

| Antiga | Nova |
|--------|------|
| `/case-studies` | `/cases` |
| `/portfolio/case-study-dubai-holding` · `/portfolio/ceo-team-alignment-for-ds-smith-plc` · `/portfolio/edf-leadership-impact-influence-presence` · `/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile` | `/cases` |
| `/our-impact/see-us-in-action` · `/see_us_in_action.html` | `/cases` |

### Time / Advisors → home #people
| Antiga | Nova |
|--------|------|
| `/our-team` · `/our_team.html` · `/our-advisors` · `/our_advisor.html` · `/our-way/our-team-and-network` | `/#people` |

### Identidade / Sobre → home #approach
> ⚠️ A página **Our Identity + Awards** (009) está adiada. Quando existir, repontar
> `/our-identity`, `/our-story` p/ ela (provavelmente `/awards` ou nova rota).

| Antiga | Nova |
|--------|------|
| `/our-identity` · `/our_identity.html` · `/our-story` · `/our_story.html` · `/our-approach` | `/#approach` |
| `/our-way` · `/our-way/our-values` · `/our-way/our-thinking` · `/way-values.html` | `/#approach` |
| `/our-way/head-heart-hunch-hands` · `/our-way-head.html` | `/solutions/5h-framework` |
| `/10-dna-ingredients` · `/ten-ingredients.html` | `/solutions/5h-framework` |

### Livro → home #book
> **Decisão (2026-07-29):** a rota `/book` foi **removida**. O livro vive só na seção
> `#book` da home; os redirects legados passaram a apontar pra lá.

| Antiga | Nova |
|--------|------|
| `/our-book` · `/book-endorsements` · `/book-endorsement.html` | `/#book` |

### Impacto / Alcance global
| Antiga | Nova |
|--------|------|
| `/our-impact` · `/our-impact.html` · `/our-impact/return-on-investment` | `/#impact` |
| `/Impact-and-global-reach.html` · `/our-way/our-impact-and-global-reach` | `/solutions/regions` |

### Notícias → Insights
| Antiga | Nova |
|--------|------|
| `/our-news` · `/our-news.html` | `/insights` |

### Contato / Formulários → home #contact
| Antiga | Nova |
|--------|------|
| `/contact` · `/contact-us` · `/email-us.html` · `/brochure-request-form` · `/asia-pacific-and-global-team-form` | `/#contact` |

### Legal
| Antiga | Nova |
|--------|------|
| `/privacy-policy` · `/privacy-policy.html` | `/privacy` |
| `/copyright` | `/terms` |

### Sem redirect (deixar 404 / não mapear)
`/wp-login.php`, `/maintenance`, `/tag/europe`, `/)` (trap da Wayback).

---

## Como implementar (nota técnica)

O middleware `next-intl` tem `matcher` que **exclui paths com ponto** (`.*\..*`), então:

- **URLs sem extensão** (`/our-services`, `/contact-us`, `/our-team`…) → tratar **dentro do
  `middleware.ts`**, antes de `intlMiddleware(req)`, no mesmo padrão do bloco `RETIRED_LOCALES`
  já existente. Redirects de config **não** disparam de forma confiável aqui porque o middleware
  roda antes.
- **URLs com `.html` / `.php`** (`/index.html`, `/our_team.html`…) → o middleware **não** roda
  nelas; colocar em `next.config.mjs` `redirects()` (roda independente do matcher).

Sugestão: uma única fonte `lib/redirects.ts` exportando o mapa, consumida pelos dois lugares.

```ts
// lib/redirects.ts (rascunho)
export const REDIRECTS: Record<string, string> = {
  "/our-services": "/solutions",
  "/our-services/overview": "/solutions",
  "/our-services/leadership-development": "/solutions/leadership",
  // … (extensionless)
  "/contact": "/#contact",
  "/contact-us": "/#contact",
  "/our-team": "/#people",
  // …
};

// mapa só das URLs COM ponto, p/ o next.config
export const REDIRECTS_DOTTED: Record<string, string> = {
  "/index.html": "/",
  "/our_team.html": "/#people",
  "/privacy-policy.html": "/privacy",
  // …
};
```

```ts
// middleware.ts — dentro do handler, antes de intlMiddleware(req)
import { REDIRECTS } from "@/lib/i18n/... ou @/lib/redirects";
const dest = REDIRECTS[req.nextUrl.pathname];
if (dest) {
  const url = req.nextUrl.clone();
  const [path, hash] = dest.split("#");
  url.pathname = path || "/";
  if (hash) url.hash = hash;
  return NextResponse.redirect(url, 301);
}
```

```js
// next.config.mjs — async redirects()
async redirects() {
  return [
    { source: "/index.html", destination: "/", permanent: true },
    { source: "/our_team.html", destination: "/#people", permanent: true },
    // … (todas as .html/.php de REDIRECTS_DOTTED)
  ];
}
```

**Nota:** com `permanent: true` o Next emite 308 (config) / usar 301 no middleware conforme acima.
Ambos preservam o link juice; 301 é o mais reconhecido por ferramentas de SEO legadas.
