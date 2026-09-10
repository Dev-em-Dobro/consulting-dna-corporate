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
  ["/our_clients.html", "/our-clients"],
  ["/what-our-client-says.html", "/"],
  ["/see_us_in_action.html", "/cases"],
  ["/our_team.html", "/our-team"],
  ["/our_advisor.html", "/our-team"],
  ["/our_identity.html", "/about"],
  ["/our_story.html", "/about"],
  ["/way-values.html", "/about#values"],
  ["/our-way-head.html", "/approach"],
  ["/ten-ingredients.html", "/approach"],
  ["/book-endorsement.html", "/#book"],
  ["/our-impact.html", "/our-impact"],
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
  // O brief 27-08 tirou Leadership Development da arquitetura, e a solution foi
  // despublicada em 01-09. O índice é destino deliberado, não provisório: relendo
  // o texto daquela página, ela era um guarda-chuva — "individual & collective
  // leadership", abordagem "whole person", sem público definido. O conteúdo dela
  // se distribui por pelo menos três das oito novas (ExCo/Top 150, Manager
  // Development, Talent Development), então apontar para uma só entregaria a maior
  // parte do tráfego numa página que cobre uma fatia do que a pessoa procurava.
  // Guarda-chuva aposentado vai para o índice dos sucessores. Confirmação pedida
  // ao Guilherme em 01-09; se ele apontar uma herdeira clara, trocar aqui.
  ["/our-services/leadership-development", "/solutions"],
  ["/our-services/executive-coaching", "/solutions/executive-coaching"],
  ["/our-services/culture-transformation", "/solutions/culture-transformation"],
  ["/our-services/high-performing-teams", "/solutions/high-performing-teams"],
  ["/our-services/women-in-leadership", "/solutions/women-in-leadership"],
  // Inclusion & Diversity saiu da arquitetura (brief 27-08). Categoria aposentada
  // sem sucessora direta → índice.
  ["/our-services/inclusion_diversity", "/solutions"],
  // Renomeada para "Talent Development" pelo brief 27-08 (sai o "Asian").
  ["/our-services/asian-talent-development", "/solutions/talent-development"],
  ["/our-services/insight-tools", "/solutions"],
  // Slugs internos da fase anterior do CMS, aposentados em 01-09 na reestruturação
  // das 8 Solutions. Nunca estiveram no domínio público — só no alpha — mas o
  // redirect custa nada e evita link morto em e-mail ou documento antigo.
  ["/solutions/ceo-top-team-transformation", "/solutions/exco-top-150"],
  ["/solutions/chro-hrlt-effectiveness", "/solutions/hrlt-effectiveness"],
  ["/solutions/asian-talent-development", "/solutions/talent-development"],
  ["/solutions/leadership-development", "/solutions"],
  ["/solutions/talent-succession", "/solutions"],
  ["/solutions/inclusion-diversity", "/solutions"],
  // Clientes → o case correspondente (decisão do cliente, 2026-07-29). Cada
  // página de cliente do site antigo tem um case 1:1 no CMS. O índice
  // `/our-clients` NÃO aparece aqui de propósito: a IA do brief 27-08 recria
  // essa mesma URL como página real, e um redirect com essa `source` passaria
  // na frente da rota (redirects são avaliados antes do filesystem). O índice
  // genérico `/clients` passou a apontar para ela.
  ["/clients", "/our-clients"],
  ["/our-clients/aviva", "/cases/aviva"],
  ["/our-clients/coca-cola", "/cases/coca-cola"],
  ["/our-clients/gsk", "/cases/gsk"],
  ["/our-clients/heineken", "/cases/heineken"],
  ["/our-clients/levis", "/cases/levis"],
  ["/our-clients/morgan-stanley", "/cases/morgan-stanley"],
  // O slug FOI renomeado no CMS, e este redirect ficou para trás. Medido no
  // alpha em 07-09: `/cases/shell` responde 200, `/cases/case-1d007617` responde
  // 404, e portanto `/our-clients/shell` estava mandando o visitante para uma
  // página morta — 308 para um 404, que é pior que não ter redirect nenhum.
  // O case antigo continua no CMS como `shell-archived-0b3629b3`; o vivo é este.
  ["/our-clients/shell", "/cases/shell"],
  ["/our-clients/unilever", "/cases/unilever"],
  ["/testimonials", "/"],
  // Cases / Portfolio → Cases
  ["/case-studies", "/cases"],
  ["/portfolio/case-study-dubai-holding", "/cases"],
  ["/portfolio/ceo-team-alignment-for-ds-smith-plc", "/cases"],
  ["/portfolio/edf-leadership-impact-influence-presence", "/cases"],
  ["/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile", "/cases"],
  ["/our-impact/see-us-in-action", "/cases"],
  // Time / Advisors → a página real de Our Team (antes: âncora da home)
  ["/our-advisors", "/our-team"],
  ["/our-way/our-team-and-network", "/our-team"],
  // Identidade / Sobre → a página real de Our Identity e suas seções
  ["/our-story", "/about"],
  // O antigo /our-approach agora tem página real (5H), não só a âncora da home.
  ["/our-approach", "/approach"],
  ["/our-way", "/#approach"],
  ["/our-way/our-values", "/about#values"],
  ["/our-way/our-thinking", "/#approach"],
  ["/our-way/head-heart-hunch-hands", "/approach"],
  ["/10-dna-ingredients", "/approach"],
  // Rota interna antiga do 5H (ficou pública durante o desenvolvimento).
  ["/solutions/5h-framework", "/approach"],
  // Livro → seção da home (não há página dedicada do livro)
  ["/our-book", "/#book"],
  ["/book-endorsements", "/#book"],
  // Impacto / Alcance — /our-impact agora é página real, não âncora da home
  ["/our-impact/return-on-investment", "/our-impact"],
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

// Areas the 27-08 brief split in two. `/about` became Our Identity + Our Team,
// so the old route points at the identity half and that page links onward to
// the team — a fragment (/about#leadership) never reaches the server, so it
// cannot be routed here; nothing in the site links to those anchors any more.
// `/cases` is deliberately NOT redirected: the faceted case library and its
// detail pages stay where they are, and Our Clients links into them.
// ⚠️ A DIREÇÃO SE INVERTEU em 09-09. Antes `/about` apontava para
// `/our-identity`; agora a About real MORA em `/about` e é `/our-identity` que
// aponta para ela. A página antiga não foi jogada fora — virou `/about-v1`,
// fora do menu e fora do sitemap, para consulta.
//
// Os três redirects abaixo cobrem os três caminhos que as pessoas já têm:
//   • `/our-identity` está no menu que ESTÁ EM PRODUÇÃO e nos resultados de
//     busca. Sem este 308 ele passa a dar 404 no dia do deploy.
//   • `/about-v2` foi o endereço mandado para revisão do cliente, inclusive na
//     mensagem do grupo. Links já enviados continuam abrindo.
//   • `/our_identity.html` é a página legada do WordPress, tratada mais acima.
//
// 10-09: a home teve o MESMO movimento. A `/home-v2` foi escolhida e subiu para
// `/`; a home que estava no ar virou `/home-v1`, fora do menu e fora do
// sitemap. `/home-v2` era o endereço mandado para o grupo comparar, então links
// já enviados continuam abrindo — agora na home de verdade.
//
// `/home-v3` NÃO entra aqui: ela continua sendo proposta viva. A comparação que
// ela existe para permitir segue de pé, só que agora é `/home-v3` contra `/`.
const splitAreaRedirects = [
  { source: "/our-identity", destination: "/about", permanent: true },
  { source: "/about-v2", destination: "/about", permanent: true },
  { source: "/home-v2", destination: "/", permanent: true },
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
  },
  async redirects() {
    return [
      ...retiredLocaleRedirects,
      ...splitAreaRedirects,
      ...[...legacyDottedRedirects, ...legacyExtensionlessRedirects].map(
        ([source, destination]) => ({ source, destination, permanent: true }),
      ),
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
