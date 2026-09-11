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
// `/solutions`, next.config redirects point at these paths, and the sitemap
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
export const siteNav: NavItem[] = [
  { label: "About", href: "/about" },
  // Plain "(5H)" and not the site's 5H® treatment: labels are strings here (and
  // are used as React keys), so a superscript would mean a node-typed label
  // across three components for one nav item.
  { label: "Approach (5H)", href: "/approach" },
  // No static children: the Services submenu is filled from the CMS in
  // `buildSiteNav`, and stays a plain link when the CMS returns nothing.
  { label: "Services", href: "/solutions" },
  // `/team` e não `/our-team` desde 11-09, a pedido. É a exceção que a nota lá
  // em cima prevê: não é o label perseguindo a rota, é a rota mudando por
  // decisão de endereço — e o `/our-team` que está em produção continua
  // respondendo, por 308 em next.config.
  { label: "Team", href: "/team" },
  { label: "Clients & Impact", href: "/our-clients" },
  { label: "Insights", href: "/insights" },
  // Points at the home `#book` section until a listing page exists.
  { label: "Books", href: "/#book" },
  { label: "Contact", href: "/#contact", cta: true },
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
