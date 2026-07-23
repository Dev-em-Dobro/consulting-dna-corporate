/**
 * Server-only: builds the site nav with the Solutions submenu populated from the CMS.
 * Falls back to the static `siteNav` (lib/nav.ts) when the CMS has no solutions / is down.
 */
import { siteNav, type NavItem } from "./nav";
import { getSolutionCards } from "./cms/map";

export async function buildSiteNav(): Promise<NavItem[]> {
  const solutions = await getSolutionCards();
  const solutionChildren = solutions.map((s) => ({
    label: s.title,
    href: `/solutions/${s.slug}`,
  }));

  return siteNav.map((item) =>
    item.label === "Solutions"
      ? { ...item, children: [...(item.children ?? []), ...solutionChildren] }
      : item,
  );
}
