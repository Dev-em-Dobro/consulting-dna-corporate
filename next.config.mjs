import createNextIntlPlugin from "next-intl/plugin";

// ---- Legacy redirects (spec 005) -------------------------------------------
// The site serves a single locale with no middleware, so ALL permanent (308)
// redirects live here in next.config (handled natively by Next/Vercel at the
// edge). Full inventory + rationale: specs/redirects-inventory.md.

// Legacy corporatednaconsulting.com paths that carry a file extension (.html/.php).
const legacyDottedRedirects = [
  ["/index.html", "/"],
  ["/our_services.html", "/solutions"],
  ["/insight-tools.html", "/solutions"],
  ["/industry-examples.html", "/cases"],
  ["/our_clients.html", "/"],
  ["/what-our-client-says.html", "/"],
  ["/see_us_in_action.html", "/cases"],
  ["/our_team.html", "/#people"],
  ["/our_advisor.html", "/#people"],
  ["/our_identity.html", "/#approach"],
  ["/our_story.html", "/#approach"],
  ["/way-values.html", "/#approach"],
  ["/our-way-head.html", "/approach"],
  ["/ten-ingredients.html", "/approach"],
  ["/book-endorsement.html", "/#book"],
  ["/our-impact.html", "/#impact"],
  ["/Impact-and-global-reach.html", "/solutions/regions"],
  ["/our-news.html", "/insights"],
  ["/email-us.html", "/#contact"],
  ["/privacy-policy.html", "/privacy"],
];

// Extensionless legacy paths (previously applied in middleware.ts, now that the
// middleware is gone they move here). A destination may carry a `#hash`.
const legacyExtensionlessRedirects = [
  // Serviços → Solutions
  ["/our-services", "/solutions"],
  ["/our-services/overview", "/solutions"],
  ["/our-services/leadership-development", "/solutions/leadership-development"],
  ["/our-services/executive-coaching", "/solutions/executive-coaching"],
  ["/our-services/culture-transformation", "/solutions/culture-transformation"],
  ["/our-services/high-performing-teams", "/solutions/high-performing-teams"],
  ["/our-services/women-in-leadership", "/solutions/women-in-leadership"],
  ["/our-services/inclusion_diversity", "/solutions/inclusion-diversity"],
  ["/our-services/asian-talent-development", "/solutions/asian-talent-development"],
  ["/our-services/insight-tools", "/solutions"],
  // Clientes → o case correspondente (decisão do cliente, 2026-07-29). Cada
  // página de cliente do site antigo tem um case 1:1 no CMS; os índices, que
  // não têm equivalente, continuam caindo na home.
  ["/clients", "/"],
  ["/our-clients", "/"],
  ["/our-clients/aviva", "/cases/aviva"],
  ["/our-clients/coca-cola", "/cases/coca-cola"],
  ["/our-clients/gsk", "/cases/gsk"],
  ["/our-clients/heineken", "/cases/heineken"],
  ["/our-clients/levis", "/cases/levis"],
  ["/our-clients/morgan-stanley", "/cases/morgan-stanley"],
  // O slug da Shell no CMS não é "shell" — vale renomear lá e ajustar aqui.
  ["/our-clients/shell", "/cases/case-1d007617"],
  ["/our-clients/unilever", "/cases/unilever"],
  ["/testimonials", "/"],
  // Cases / Portfolio → Cases
  ["/case-studies", "/cases"],
  ["/portfolio/case-study-dubai-holding", "/cases"],
  ["/portfolio/ceo-team-alignment-for-ds-smith-plc", "/cases"],
  ["/portfolio/edf-leadership-impact-influence-presence", "/cases"],
  ["/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile", "/cases"],
  ["/our-impact/see-us-in-action", "/cases"],
  // Time / Advisors → home #people
  ["/our-team", "/#people"],
  ["/our-advisors", "/#people"],
  ["/our-way/our-team-and-network", "/#people"],
  // Identidade / Sobre → home #approach (5H onde se aplica)
  ["/our-identity", "/#approach"],
  ["/our-story", "/#approach"],
  // O antigo /our-approach agora tem página real (5H), não só a âncora da home.
  ["/our-approach", "/approach"],
  ["/our-way", "/#approach"],
  ["/our-way/our-values", "/#approach"],
  ["/our-way/our-thinking", "/#approach"],
  ["/our-way/head-heart-hunch-hands", "/approach"],
  ["/10-dna-ingredients", "/approach"],
  // Rota interna antiga do 5H (ficou pública durante o desenvolvimento).
  ["/solutions/5h-framework", "/approach"],
  // Livro → seção da home (não há página dedicada do livro)
  ["/our-book", "/#book"],
  ["/book-endorsements", "/#book"],
  // Impacto / Alcance
  ["/our-impact", "/#impact"],
  ["/our-impact/return-on-investment", "/#impact"],
  ["/our-way/our-impact-and-global-reach", "/solutions/regions"],
  // Notícias → Insights
  ["/our-news", "/insights"],
  // Contato → home #contact
  ["/contact", "/#contact"],
  ["/contact-us", "/#contact"],
  ["/brochure-request-form", "/#contact"],
  ["/asia-pacific-and-global-team-form", "/#contact"],
  // Legal
  ["/privacy-policy", "/privacy"],
  ["/copyright", "/terms"],
];

// Retired locale prefixes (pt/es were never translated). Strip the prefix and
// send to the English equivalent, e.g. /pt/solutions → /solutions, /es → /.
const retiredLocaleRedirects = [
  { source: "/pt", destination: "/", permanent: true },
  { source: "/es", destination: "/", permanent: true },
  { source: "/pt/:path*", destination: "/:path*", permanent: true },
  { source: "/es/:path*", destination: "/:path*", permanent: true },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // CMS media is delivered from the Bunny.net CDN (BUNNY_CDN_URL).
    remotePatterns: [
      { protocol: "https", hostname: "corporate-dna.b-cdn.net" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      ...retiredLocaleRedirects,
      ...[...legacyDottedRedirects, ...legacyExtensionlessRedirects].map(
        ([source, destination]) => ({ source, destination, permanent: true }),
      ),
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
