/**
 * Canonical site navigation + region list.
 * Shared by the header (NavV1), the footer (SiteFooter) and the scaffold pages,
 * so the menu lives in one place as real routes are filled in.
 */

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const siteNav: NavItem[] = [
  // No static children: the Solutions submenu is filled from the CMS in
  // `buildSiteNav`, and stays a plain link when the CMS returns nothing.
  { label: "Solutions", href: "/solutions" },
  // 5H is a methodology applied across every solution, not one of them, so it
  // sits beside Solutions as "Our Approach" instead of inside its dropdown.
  { label: "Our Approach", href: "/approach" },
  // "Cases" was renamed to "Client Impact" per the 05-08 brief; the route stays /cases.
  { label: "Client Impact", href: "/cases" },
  // About area (identity/story/values/why/leadership/faculty/presence); several
  // sub-sections are placeholders pending CDNA copy.
  { label: "About", href: "/about" },
  // The book now lives under Insights (home `#book` section); the dedicated /book
  // route was removed, so the legacy /our-book redirects land here too.
  {
    label: "Insights",
    href: "/insights",
    children: [{ label: "The Book", href: "/#book" }],
  },
];

export type Region = { slug: string; name: string };

export const regions: Region[] = [
  { slug: "london", name: "London" },
  { slug: "singapore", name: "Singapore" },
  { slug: "dubai", name: "Dubai" },
  { slug: "saudi-arabia", name: "Saudi Arabia" },
  { slug: "miami", name: "Miami" },
];
