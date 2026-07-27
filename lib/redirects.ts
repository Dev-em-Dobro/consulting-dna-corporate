/**
 * Permanent (308) redirects from the legacy corporatednaconsulting.com site to
 * the new routes (spec 005). Full inventory + rationale in
 * `specs/redirects-inventory.md` — that doc is the human source of truth.
 *
 * This map holds only the *extensionless* legacy paths; it's applied in
 * `middleware.ts` (before next-intl). The `.html`/`.php` equivalents live in
 * `next.config.mjs` `redirects()` because the middleware matcher skips any path
 * containing a dot (`.*\..*`).
 *
 * A destination may carry a `#hash` to land on a homepage section (e.g. `/#people`).
 * Solution/case slugs were confirmed 1:1 against the CMS (2026-07-27).
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Serviços → Solutions
  "/our-services": "/solutions",
  "/our-services/overview": "/solutions",
  "/our-services/leadership-development": "/solutions/leadership-development",
  "/our-services/executive-coaching": "/solutions/executive-coaching",
  "/our-services/culture-transformation": "/solutions/culture-transformation",
  "/our-services/high-performing-teams": "/solutions/high-performing-teams",
  "/our-services/women-in-leadership": "/solutions/women-in-leadership",
  "/our-services/inclusion_diversity": "/solutions/inclusion-diversity",
  "/our-services/asian-talent-development": "/solutions/asian-talent-development",
  "/our-services/insight-tools": "/solutions",

  // Clientes → home (client decision; 1:1 case mapping noted in the inventory)
  "/clients": "/",
  "/our-clients": "/",
  "/our-clients/aviva": "/",
  "/our-clients/coca-cola": "/",
  "/our-clients/gsk": "/",
  "/our-clients/heineken": "/",
  "/our-clients/levis": "/",
  "/our-clients/morgan-stanley": "/",
  "/our-clients/shell": "/",
  "/our-clients/unilever": "/",
  "/testimonials": "/",

  // Cases / Portfolio → Cases
  "/case-studies": "/cases",
  "/portfolio/case-study-dubai-holding": "/cases",
  "/portfolio/ceo-team-alignment-for-ds-smith-plc": "/cases",
  "/portfolio/edf-leadership-impact-influence-presence": "/cases",
  "/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile": "/cases",
  "/our-impact/see-us-in-action": "/cases",

  // Time / Advisors → home #people
  "/our-team": "/#people",
  "/our-advisors": "/#people",
  "/our-way/our-team-and-network": "/#people",

  // Identidade / Sobre → home #approach (5H onde se aplica)
  "/our-identity": "/#approach",
  "/our-story": "/#approach",
  "/our-approach": "/#approach",
  "/our-way": "/#approach",
  "/our-way/our-values": "/#approach",
  "/our-way/our-thinking": "/#approach",
  "/our-way/head-heart-hunch-hands": "/solutions/5h-framework",
  "/10-dna-ingredients": "/solutions/5h-framework",

  // Livro → /book
  "/our-book": "/book",
  "/book-endorsements": "/book",

  // Impacto / Alcance
  "/our-impact": "/#impact",
  "/our-impact/return-on-investment": "/#impact",
  "/our-way/our-impact-and-global-reach": "/solutions/regions",

  // Notícias → Insights
  "/our-news": "/insights",

  // Contato → home #contact
  "/contact": "/#contact",
  "/contact-us": "/#contact",
  "/brochure-request-form": "/#contact",
  "/asia-pacific-and-global-team-form": "/#contact",

  // Legal
  "/privacy-policy": "/privacy",
  "/copyright": "/terms",
};
