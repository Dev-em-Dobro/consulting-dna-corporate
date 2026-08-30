/**
 * Canonical site navigation + region list.
 * Shared by the header (NavV1), the footer (SiteFooter) and the scaffold pages,
 * so the menu lives in one place as real routes are filled in.
 */

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

// The 27-08 brief sets the final navigation as:
//   Home | Our Identity | Our Solutions | Our Approach | Our Partnerships |
//   Our Clients | Our Impact | Our Team | Our Books
//
// Seven of the nine are listed below. `Our Partnerships` and `Our Team` have
// their routes built (/our-partnerships, /our-team) but stay out of the menu
// until their content arrives — validated partnership copy and the team
// photography respectively. A menu item that opens an empty page is worse than
// a late one, and publishing them is a one-line change here once CDNA delivers.
//
// Insights is deliberately absent: the brief's list does not include it, and
// CDNA confirmed on 28-08 that this was intentional. The /insights route stays
// live — item 18 requires the Reports & Resources capability to be preserved —
// it is simply no longer reachable from the header. The footer still links it.
// The header's "Start a Conversation" button was dropped in the same decision;
// item 5 keeps it as the closing block of every Solution page instead.
export const siteNav: NavItem[] = [
  // Home is now an explicit item, in addition to the clickable logo.
  { label: "Home", href: "/" },
  // Identity half of the old /about, which now 308s here (next.config.mjs).
  { label: "Our Identity", href: "/our-identity" },
  // No static children: the Solutions submenu is filled from the CMS in
  // `buildSiteNav`, and stays a plain link when the CMS returns nothing.
  { label: "Our Solutions", href: "/solutions" },
  // 5H is a methodology applied across every solution, not one of them, so it
  // sits beside Solutions as "Our Approach" instead of inside its dropdown.
  { label: "Our Approach", href: "/approach" },
  // The old single "Client Impact" area, split as the brief requires: the wall
  // and the stories here, the numbers and proof next door. The faceted case
  // library keeps its own route (/cases) and is linked from Our Clients.
  { label: "Our Clients", href: "/our-clients" },
  { label: "Our Impact", href: "/our-impact" },
  // Promoted to top level per the brief, and pluralised: the area is meant to
  // hold books by different team members over time. Points at the home `#book`
  // section until a listing page exists.
  { label: "Our Books", href: "/#book" },
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
