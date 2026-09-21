/**
 * Canonical site navigation + region list.
 * Shared by the header (NavV1), the footer (SiteFooter) and the scaffold pages,
 * so the menu lives in one place as real routes are filled in.
 */

export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
  /**
   * Renders as the header's call-to-action button instead of a plain link.
   * One item at most — a second button is a second primary action, which is
   * none. NavV1/NavV2 read this; the footer ignores it and lists it as a link.
   */
  cta?: boolean;
};

// Navigation agreed with the client on 08-09, replacing the 27-08 brief's list:
//   About | Approach (5H) | Services ▾ | Team | Clients & Impact | Insights |
//   Books | Contact (button)
//
// Labels are the client's, verbatim. Routes are NOT renamed to match: `href` is
// the stable half of this file (nav-server matches the Solutions submenu on
// `/services`, next.config redirects point at these paths, and the sitemap
// reads them), while labels are copy and have now been rewritten twice in a
// fortnight. Renaming routes to chase a label change would invalidate every
// redirect for nothing a visitor can see.
//
// What moved, and why the mapping is what it is:
//
//   • `Home` leaves the menu. The logo already links to `/` in both headers.
//   • `About` → /about. Desde 09-09 a About real mora aqui; a página antiga
//     there). "Our Team" is now its own top-level item, so /about stays split.
//   • `Team` and `Insights` join the menu. Both routes existed and were kept
//     out on purpose — Team pending photography, Insights because the 27-08
//     list omitted it. This structure asks for both, which overrides that.
//   • `Clients & Impact` is ONE item over two pages. It points at /our-clients
//     (wall + stories); /our-impact (numbers + proof) is no longer reachable
//     from the header and is linked from the footer instead. Merging the two
//     pages is content work nobody has asked for yet — flagged to the client.
//   • `Contact` returns as a button (`cta`), reversing the 28-08 removal of
//     "Start a Conversation". It targets the home's `#contact` section, the
//     same destination /contact and /contact-us already redirect to.
//   • `Books` SAIU DA LISTA EM 21-09 e `Events` ocupou a vaga. É a única
//     alteração posterior ao acordo de 08-09 nesta lista, e veio das anotações
//     da reunião, não do e-mail da cliente. A caixa do próprio item conta o
//     porquê de ela ser uma troca de rota e não de label.
export const siteNav: NavItem[] = [
  { label: "About", href: "/about" },
  // Plain "(5H)" and not the site's 5H® treatment: labels are strings here (and
  // are used as React keys), so a superscript would mean a node-typed label
  // across three components for one nav item.
  { label: "Approach (5H)", href: "/approach" },
  // No static children: the Services submenu is filled from the CMS in
  // `buildSiteNav`, and stays a plain link when the CMS returns nothing.
  { label: "Services", href: "/services" },
  // `/team` e não `/our-team` desde 11-09, a pedido. É a exceção que a nota lá
  // em cima prevê: não é o label perseguindo a rota, é a rota mudando por
  // decisão de endereço — e o `/our-team` que está em produção continua
  // respondendo, por 308 em next.config.
  { label: "Team", href: "/team" },
  { label: "Clients & Impact", href: "/our-clients" },
  // `/insights` carrega DUAS coisas desde 21-09: a biblioteca editorial e os
  // livros (*"insights and books e a seção de book vai pra tela de insights"*).
  //
  // O LABEL PASSOU A DIZER AS DUAS no mesmo dia, a pedido — *"só o nome do menu
  // tem que ser insights & books"*. A primeira versão manteve "Insights" com o
  // argumento de que o item continuava sendo o mesmo endereço, e o argumento
  // estava certo sobre a ROTA e errado sobre a NAVEGAÇÃO: o menu perdeu a
  // palavra "Books" na mesma tarde (a vaga virou "Events"), então quem procura
  // os livros deixou de ter por onde chegar sem adivinhar que eles moram dentro
  // de Insights. O 308 de `/books` só socorre quem já tem a URL antiga.
  //
  // É exatamente o caso que a caixa de abertura descreve: label é copy e muda,
  // rota é endereço e fica. A rota segue `/insights`.
  //
  // `&` E NÃO "and", como em "Clients & Impact" logo acima — é string de dado,
  // não JSX, então o caractere entra cru e o React escapa na renderização.
  { label: "Insights & Books", href: "/insights" },
  // ⚠️ ESTE ITEM ERA `{ label: "Books", href: "/books" }` — *"mudar book para
  // events"* (anotação da reunião de 21-09). A troca É de rota, e isso precisa
  // ficar claro contra a regra lá em cima ("labels são copy, rotas são
  // endereço, não se renomeia rota para perseguir label"): aqui NÃO é o mesmo
  // item ganhando outro nome. O destino antigo deixou de existir — os livros
  // foram para a /insights e `/books` virou 308 —, então isto é um item
  // APOSENTADO e outro NASCENDO na vaga dele. A regra continua valendo: o que
  // se proíbe é mexer na rota quando só a palavra mudou, e não é o caso.
  //
  // ⏳ A PÁGINA NASCE VAZIA, de propósito. O pedido de 21-09 é de navegação, e
  // conteúdo de Events não existe em lugar nenhum do projeto — nem no CMS, que
  // não tem tipo "events", nem nos documentos. `app/events/page.tsx` usa o
  // padrão de página pendente do site (PageHero + EmptyNotice + `noindex`), o
  // mesmo de /awards e /our-partnerships. Um item de menu tem de levar a algum
  // lugar; levar a um 404 seria pior que a página vazia.
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact", cta: true },
];

export type Region = { slug: string; name: string };

export const regions: Region[] = [
  { slug: "london", name: "London" },
  { slug: "singapore", name: "Singapore" },
  { slug: "dubai", name: "Dubai" },
  // Labelled by city (Riyadh) to match the homepage offices/context and the
  // Riyadh-by-city labelling (commit 059d1c0); the route slug stays "saudi-arabia".
  { slug: "saudi-arabia", name: "Riyadh" },
  { slug: "miami", name: "Miami" },
];
