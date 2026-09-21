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
- `/our-identity` · `/our-team` · `/our-clients` · `/our-impact` · `/our-partnerships`
  (áreas criadas pelo brief 27-08; `/about` passou a 308 para `/our-identity`)
- `/insights`, `/insights/[slug]` · `/interviews`
- `/awards`
- `/privacy` · `/cookies` · `/terms`

---

## Mapa de redirects (todos 301 permanentes)

> ⚠️ **Redirect com `source` igual a uma rota real engole a página.** O `redirects()` do Next é
> avaliado **antes** do filesystem, então enquanto existir `["/our-clients", "/"]` a página
> `app/our-clients/page.tsx` nunca responde — devolve 308 e ninguém vê o erro, porque o redirect
> "funciona". Foi exatamente o que aconteceu em 28-08: a IA do brief recriou quatro URLs do site
> antigo (`/our-identity`, `/our-team`, `/our-clients`, `/our-impact`) que estavam na lista de
> legados. **Ao criar uma rota nova, procurar o path aqui antes.**

### Home
| Antiga | Nova |
|--------|------|
| `/index.html` | `/` |

### Serviços → Solutions
> ✅ **Slugs confirmados no CMS (2026-07-27)** — as 7 solutions existem e batem 1:1. Sem fallback necessário.
>
> 🔄 **Atualizado (2026-09-21):** o serviço "Top 150 Leadership Development" virou **Senior
> Leadership Development**, primeiro no nome e depois na rota. A rota antiga
> `/services/top-150-leadership-development` responde **308** para
> `/services/senior-leadership-development`.
>
> Os três legados que desembocavam na rota antiga — `/solutions/exco-top-150`,
> `/solutions/ceo-top-team-transformation` e `/solutions/leadership-development` — foram
> **repontados direto** para o endereço novo, para ninguém saltar duas vezes.

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
> ✅ **`shell`** — resolvido em 07-09. O slug foi renomeado no CMS e o redirect
> ficou para trás apontando para o nome antigo. Medido no alpha: `/cases/shell`
> dá 200 e `/cases/case-1d007617` dá 404, ou seja `/our-clients/shell` estava
> mandando 308 para uma página morta. Agora a Shell segue a mesma regra de todos
> os outros clientes, e a linha dela sai da tabela por não ser mais exceção.
> O case antigo sobrevive no CMS como `shell-archived-0b3629b3`.

| Antiga | Nova |
|--------|------|
| `/clients` · `/our_clients.html` | `/our-clients` |
| `/our-clients/{aviva,coca-cola,gsk,heineken,levis,morgan-stanley,shell,unilever}` | `/cases/{mesmo-slug}` |
| `/what-our-client-says.html` · `/testimonials` | `/` |

### Cases / Portfolio → Cases
> ⚠️ Slugs de `/cases/*` vêm do CMS; portfolios antigos caem no índice `/cases`.

| Antiga | Nova |
|--------|------|
| `/case-studies` | `/cases` |
| `/portfolio/case-study-dubai-holding` · `/portfolio/ceo-team-alignment-for-ds-smith-plc` · `/portfolio/edf-leadership-impact-influence-presence` · `/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile` | `/cases` |
| `/our-impact/see-us-in-action` · `/see_us_in_action.html` | `/cases` |

### Time / Advisors → Our Team
> 🔄 **Atualizado (2026-08-28, brief 27-08):** `/our-team` deixou de ser redirect — virou
> **página real**. Os demais passaram a apontar pra ela em vez da âncora `/#people`.

| Antiga | Nova |
|--------|------|
| `/our_team.html` · `/our-advisors` · `/our_advisor.html` · `/our-way/our-team-and-network` | `/our-team` |

### Identidade / Sobre → Our Identity
> 🔄 **Resolvido (2026-08-28, brief 27-08):** a página existe. `/our-identity` deixou de ser
> redirect — virou **página real**, com as seções `#identity`, `#story`, `#values`, `#why`.
> Os legados passaram a apontar para ela e, quando havia seção equivalente, para a âncora certa.

| Antiga | Nova |
|--------|------|
| `/our_identity.html` | `/our-identity` |
| `/our-story` · `/our_story.html` | `/our-identity#story` |
| `/our-way/our-values` · `/way-values.html` | `/our-identity#values` |
| `/our-approach` | `/approach` |
| `/our-way` · `/our-way/our-thinking` | `/#approach` |
| `/our-way/head-heart-hunch-hands` · `/our-way-head.html` | `/solutions/5h-framework` |
| `/10-dna-ingredients` · `/ten-ingredients.html` | `/solutions/5h-framework` |

### Livro → Insights #books
> **Decisão (2026-07-29):** a rota `/book` foi **removida**. O livro vivia só na seção
> `#book` da home; os redirects legados passaram a apontar pra lá.
>
> 🔄 **Atualizado (2026-09-21):** os livros deixaram de ter página própria e viraram a
> seção `#books` da `/insights`. Os três legados foram **repontados direto** para o
> destino novo, em vez de encadearem em cima do 308 de `/books` — dois saltos gastam
> orçamento de rastreio e diluem o sinal por nada.
>
> A seção `#book` da home **continua existindo**: o pedido de 21-09 moveu os *awards*
> para cima dela, o que é evidência de que ela fica.

| Antiga | Nova |
|--------|------|
| `/our-book` · `/book-endorsements` · `/book-endorsement.html` | `/insights#books` |
| `/books` | `/insights#books` |

### Impacto / Alcance global
> 🔄 **Atualizado (2026-08-28, brief 27-08):** `/our-impact` deixou de ser redirect — virou
> **página real** (números editáveis + resultados por engagement).

| Antiga | Nova |
|--------|------|
| `/our-impact.html` · `/our-impact/return-on-investment` | `/our-impact` |
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
  // ⚠️ ERRADO, e nunca esteve ativo — `/solutions/leadership` é a página de
  // *perfis dos consultores* ("The people behind the method"), não um serviço.
  // Mandaria quem procura leadership development para uma lista de gente.
  // O valor vivo está no next.config.mjs: aponta para `/solutions`. Ver a
  // linha 51 desta tabela e o comentário lá. (Corrigido em 01-09.)
  "/our-services/leadership-development": "/solutions",
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
