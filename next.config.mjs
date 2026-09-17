import createNextIntlPlugin from "next-intl/plugin";

// ---- Legacy redirects (spec 005) -------------------------------------------
// The site serves a single locale with no middleware, so ALL permanent (308)
// redirects live here in next.config (handled natively by Next/Vercel at the
// edge). Full inventory + rationale: specs/redirects-inventory.md.

// Legacy corporatednaconsulting.com paths that carry a file extension (.html/.php).
const legacyDottedRedirects = [
  ["/index.html", "/"],
  ["/our_services.html", "/services"],
  ["/insight-tools.html", "/services"],
  ["/industry-examples.html", "/cases"],
  ["/our_clients.html", "/our-clients"],
  ["/what-our-client-says.html", "/"],
  ["/see_us_in_action.html", "/cases"],
  // Direto para `/team`, e não para `/our-team`: a rota foi renomeada em 11-09 e
  // um destino desatualizado aqui viraria 308 → 308. A corrente funciona, mas
  // cada salto é um round-trip, e buscadores tratam cadeia como sinal fraco.
  ["/our_team.html", "/team"],
  ["/our_advisor.html", "/team"],
  ["/our_identity.html", "/about"],
  ["/our_story.html", "/about"],
  ["/way-values.html", "/about#values"],
  ["/our-way-head.html", "/approach"],
  ["/ten-ingredients.html", "/approach"],
  // ⚠️ DESTINO ATUALIZADO EM 11-09: era `/#book`, a seção da home. Com `/books`
  // existindo, a página de endossos legada tem um destino próprio — e o leitor
  // que procurava endossos cai onde eles estão, e não numa home de onde precisa
  // rolar até achar.
  ["/book-endorsement.html", "/books"],
  ["/our-impact.html", "/our-impact"],
  ["/Impact-and-global-reach.html", "/services/regions"],
  ["/our-news.html", "/insights"],
  ["/email-us.html", "/contact"],
  ["/privacy-policy.html", "/privacy"],
];

// Extensionless legacy paths (previously applied in middleware.ts, now that the
// middleware is gone they move here). A destination may carry a `#hash`.
const legacyExtensionlessRedirects = [
  // Serviços → Services
  ["/our-services", "/services"],
  ["/our-services/overview", "/services"],
  // O brief 27-08 tirou Leadership Development da arquitetura, e a solution foi
  // despublicada em 01-09. O índice é destino deliberado, não provisório: relendo
  // o texto daquela página, ela era um guarda-chuva — "individual & collective
  // leadership", abordagem "whole person", sem público definido. O conteúdo dela
  // se distribui por pelo menos três das oito novas (ExCo/Top 150, Manager
  // Development, Talent Development), então apontar para uma só entregaria a maior
  // parte do tráfego numa página que cobre uma fatia do que a pessoa procurava.
  // Guarda-chuva aposentado vai para o índice dos sucessores. Confirmação pedida
  // ao Guilherme em 01-09; se ele apontar uma herdeira clara, trocar aqui.
  ["/our-services/leadership-development", "/services"],
  ["/our-services/executive-coaching", "/services/executive-coaching"],
  ["/our-services/culture-transformation", "/services/culture-transformation"],
  ["/our-services/high-performing-teams", "/services/high-performing-teams"],
  ["/our-services/women-in-leadership", "/services/women-in-leadership"],
  // Inclusion & Diversity saiu da arquitetura (brief 27-08). Categoria aposentada
  // sem sucessora direta → índice.
  ["/our-services/inclusion_diversity", "/services"],
  // Renomeada para "Talent Development" pelo brief 27-08 (sai o "Asian").
  ["/our-services/asian-talent-development", "/services/talent-development"],
  ["/our-services/insight-tools", "/services"],
  // Slugs internos da fase anterior do CMS, aposentados em 01-09 na reestruturação
  // das 8 Solutions. Nunca estiveram no domínio público — só no alpha — mas o
  // redirect custa nada e evita link morto em e-mail ou documento antigo.
  // ⚠️ REVISADOS EM 11-09, quando os dez serviços do outline de 09-09 passaram a
  // ser a lista publicada (`lib/services.ts` — os slugs de destino são os de lá,
  // e é ali que se confere se um destino ainda existe).
  //
  // ⚠️ `exco-top-150` ESTÁ NO AR. Conferido em 11-09 contra o alpha, não contra
  // o backup de 01-09: o CMS de produção foi reautorado depois daquele backup e
  // hoje publica oito solutions com os slugs limpos, `exco-top-150` entre elas.
  // Sem a linha abaixo, a URL que existe hoje viraria 404 no próximo deploy.
  //
  // Vale como lembrete de método: o backup do repositório é uma FOTOGRAFIA de
  // uma data, e conteúdo muda no painel sem passar por aqui. Para saber o que
  // está publicado, abrir o site.
  ["/solutions/exco-top-150", "/services/top-150-leadership-development"],
  ["/solutions/ceo-top-team-transformation", "/services/top-150-leadership-development"],
  // O outline é explícito sobre onde Leadership Development foi parar: o caso da
  // Heineken "arrived labelled Leadership Development, which is not a service on
  // this site. Mapped to ExCo / Top 150." Herdeira clara — sai o índice.
  ["/solutions/leadership-development", "/services/top-150-leadership-development"],
  ["/solutions/chro-hrlt-effectiveness", "/services/hrlt-effectiveness"],
  ["/solutions/asian-talent-development", "/services/talent-development"],
  // Succession é o que Talent Development entrega ("successor readiness",
  // "bench strength" na copy do cliente) — herdeira mais próxima que o índice.
  ["/solutions/talent-succession", "/services/talent-development"],
  // Duplicata do CMS, no plural, com o mesmo conteúdo da singular.
  ["/solutions/culture-transformations", "/services/culture-transformation"],
  // Inclusion & Diversity continua sem sucessora: Women in Leadership é UMA
  // fatia dela, não a categoria. Índice, como antes.
  ["/solutions/inclusion-diversity", "/services"],
  // Clientes → o case correspondente (decisão do cliente, 2026-07-29). Cada
  // página de cliente do site antigo tem um case 1:1 no CMS. O índice
  // `/our-clients` NÃO aparece aqui de propósito: a IA do brief 27-08 recria
  // essa mesma URL como página real, e um redirect com essa `source` passaria
  // na frente da rota (redirects são avaliados antes do filesystem). O índice
  // genérico `/clients` passou a apontar para ela.
  ["/clients", "/our-clients"],
  // ⚠️ SEIS DESTES APONTAM PARA A BIBLIOTECA, NÃO PARA O CASE. Em 17-09 os seis
  // cases herdados do site antigo — aviva, coca-cola, heineken, levis, shell,
  // unilever — foram despublicados no CMS: nenhum tem `Reviewed = Yes` na
  // planilha dela, e a instrução da daily de 16-09 foi "filter column B under
  // yes". Um 308 para `/cases/heineken` viraria 308 para um 404, que é pior que
  // não ter redirect nenhum (foi exatamente o erro medido no Shell em 07-09,
  // nota abaixo). Mandando para `/cases`, o link herdado cai na biblioteca dos
  // nove aprovados. Quando um case voltar a ser publicado, o destino dele volta
  // a ser `/cases/<slug>` — é uma linha por case.
  ["/our-clients/aviva", "/cases"],
  ["/our-clients/coca-cola", "/cases"],
  ["/our-clients/gsk", "/cases/gsk"],
  ["/our-clients/heineken", "/cases"],
  ["/our-clients/levis", "/cases"],
  ["/our-clients/morgan-stanley", "/cases/morgan-stanley"],
  // O slug FOI renomeado no CMS, e este redirect ficou para trás. Medido no
  // alpha em 07-09: `/cases/shell` responde 200, `/cases/case-1d007617` responde
  // 404, e portanto `/our-clients/shell` estava mandando o visitante para uma
  // página morta — 308 para um 404, que é pior que não ter redirect nenhum.
  // O case antigo continua no CMS como `shell-archived-0b3629b3`; em 17-09 o
  // vivo (`shell`, e a variante `pt-BR`) foi despublicado com os outros cinco.
  ["/our-clients/shell", "/cases"],
  ["/our-clients/unilever", "/cases"],
  ["/testimonials", "/"],
  // Cases / Portfolio → Cases
  ["/case-studies", "/cases"],
  ["/portfolio/case-study-dubai-holding", "/cases"],
  ["/portfolio/ceo-team-alignment-for-ds-smith-plc", "/cases"],
  ["/portfolio/edf-leadership-impact-influence-presence", "/cases"],
  ["/portfolio/a-leadership-participant-reflects-on-the-dark-side-profile", "/cases"],
  ["/our-impact/see-us-in-action", "/cases"],
  // Time / Advisors → a página real de Team (antes: âncora da home). Destino
  // atualizado em 11-09 com a renomeação da rota; ver a nota em
  // `legacyDottedRedirects` sobre não encadear 308.
  ["/our-advisors", "/team"],
  ["/our-way/our-team-and-network", "/team"],
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
  // Idem, 11-09: os dois apontavam para a âncora da home porque não havia
  // página de livros. Agora há.
  ["/our-book", "/books"],
  ["/book-endorsements", "/books"],
  // Impacto / Alcance — /our-impact agora é página real, não âncora da home
  ["/our-impact/return-on-investment", "/our-impact"],
  ["/our-way/our-impact-and-global-reach", "/services/regions"],
  // Notícias → Insights
  ["/our-news", "/insights"],
  // Contato → a página real de Contact (antes: âncora da home).
  //
  // ⚠️ `["/contact", "/#contact"]` SAIU DAQUI EM 11-09 e não pode voltar. Com
  // ele no lugar, `app/contact/page.tsx` nunca é alcançada: redirect é avaliado
  // ANTES do filesystem, então a rota inteira continuaria pulando para a home.
  // É a mesma armadilha descrita na caixa do `/our-clients` mais acima — lá o
  // redirect nunca chegou a ser escrito por isso; aqui ele existia e teve de
  // ser removido no mesmo commit que criou a página.
  ["/contact-us", "/contact"],
  ["/brochure-request-form", "/contact"],
  ["/asia-pacific-and-global-team-form", "/contact"],
  // Legal
  ["/privacy-policy", "/privacy"],
  ["/copyright", "/terms"],
  // ⚠️ `/solutions` VIRA `/services` (11-09). Estas duas linhas são o que impede
  // a área inteira de dar 404 no dia do deploy, e são o caso mais exposto do
  // arquivo: `/solutions` é a rota do item **Services do menu que está em
  // produção**, está no sitemap entregue aos buscadores e é o destino de nove
  // redirects do WordPress antigo (todos já repontados acima, direto para
  // `/services`, para ninguém tomar dois saltos).
  //
  // A MUDANÇA É DECISÃO DE ENDEREÇO, não label perseguindo rota — é a exceção
  // que a caixa do `lib/nav.ts` prevê, e o mesmo movimento que `/our-team` →
  // `/team` fez em 11-09. Quem manda é o documento do cliente
  // (`CDNA_03_Services.docx`), que titula o §3.1 de "Index page (/services)" e
  // o §3.2 de "Detail page template (/services/[slug])".
  //
  // A ORDEM AQUI É O QUE FAZ FUNCIONAR. Estas linhas têm de ficar DEPOIS das
  // `source: "/solutions/..."` específicas lá de cima (`exco-top-150`,
  // `chro-hrlt-effectiveness`, `5h-framework`…): o Next casa na ordem do array,
  // e um curinga antes delas mandaria `/solutions/exco-top-150` para
  // `/services/exco-top-150`, que não existe. Pôr no `splitAreaRedirects` teria
  // esse efeito, porque aquele bloco é espalhado antes deste.
  ["/solutions", "/services"],
  ["/solutions/:path*", "/services/:path*"],
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
  // 11-09: `/our-team` vira `/team`, a pedido. Este 308 não é opcional e é o
  // mais exposto dos três acima — `/our-team` NÃO é um endereço de revisão que
  // circulou por WhatsApp, é a rota que está no menu EM PRODUÇÃO, no sitemap
  // entregue aos buscadores, e o destino de quatro redirects do WordPress
  // antigo (/our_team.html, /our_advisor.html, /our-advisors,
  // /our-way/our-team-and-network — todos já repontados direto para /team).
  // Sem esta linha, a rota que hoje responde 200 passa a dar 404 no deploy.
  { source: "/our-team", destination: "/team", permanent: true },
];

// Retired locale prefixes (pt/es were never translated). Strip the prefix and
// send to the English equivalent, e.g. /pt/services → /services, /es → /.
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
