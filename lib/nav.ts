/**
 * Canonical site navigation + region list.
 * Shared by the header (NavV1), the footer (SiteFooter) and the scaffold pages,
 * so the menu lives in one place as real routes are filled in.
 */

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export const siteNav: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "The 5H framework", href: "/solutions/5h-framework" },
    ],
  },
  { label: "Cases", href: "/cases" },
  { label: "Insights", href: "/insights" },
];

export type Region = { slug: string; name: string };

export const regions: Region[] = [
  { slug: "london", name: "London" },
  { slug: "singapore", name: "Singapore" },
  { slug: "dubai", name: "Dubai" },
  { slug: "saudi-arabia", name: "Saudi Arabia" },
  { slug: "miami", name: "Miami" },
];
