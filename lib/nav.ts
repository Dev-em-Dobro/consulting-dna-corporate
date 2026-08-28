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
// The renames below are the part that can ship without new routes. The four
// areas that still need pages — Our Identity and Our Team (splitting out of
// /about), plus Our Clients and Our Impact (splitting out of /cases) — and
// Our Partnerships (new, copy not yet validated by CDNA) are deliberately NOT
// listed yet: a menu item that opens an empty page is worse than a late one.
// Insights and the "Start a Conversation" button are kept pending G's answer on
// their absence from the brief's list (see docs/STATUS-REVIEW-2026-08-27.md §8).
export const siteNav: NavItem[] = [
  // Home is now an explicit item, in addition to the clickable logo.
  { label: "Home", href: "/" },
  // No static children: the Solutions submenu is filled from the CMS in
  // `buildSiteNav`, and stays a plain link when the CMS returns nothing.
  { label: "Our Solutions", href: "/solutions" },
  // 5H is a methodology applied across every solution, not one of them, so it
  // sits beside Solutions as "Our Approach" instead of inside its dropdown.
  { label: "Our Approach", href: "/approach" },
  // Splits into "Our Clients" (logo wall + flagship stories) and "Our Impact"
  // (metrics, testimonials, proof) once both pages exist. Route stays /cases.
  { label: "Client Impact", href: "/cases" },
  // Splits into "Our Identity" and "Our Team" once both pages exist.
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
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
