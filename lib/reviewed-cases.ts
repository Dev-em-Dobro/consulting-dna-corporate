/** Snapshot of rows marked Reviewed = Yes in CaseStudiesv2.xlsx (6 Oct 2026).
 * Source: https://docs.google.com/spreadsheets/d/1C8OsJLCIlcD9gXtTu4qFMMZaSOeNUN1y/edit?gid=2100036858
 * Shunkhlai is approved in the sheet, but has no case article in the site yet.
 */
const reviewedCaseSlugs = new Set([
  "bt",
  "dp-world",
  "dyson",
  "frasers-property-leadership",
  "frasers-property-hrlt",
  "gsk",
  "maaden",
  "morgan-stanley",
  "vodafone",
  "shunkhlai",
]);

export function isReviewedCaseSlug(slug: string): boolean {
  return reviewedCaseSlugs.has(slug);
}

export function isReviewedCaseHref(href: string): boolean {
  const match = /^\/cases\/([^/?#]+)\/?(?:[?#].*)?$/.exec(href);
  return !!match && isReviewedCaseSlug(match[1]);
}
