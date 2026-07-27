import createNextIntlPlugin from "next-intl/plugin";

// Legacy corporatednaconsulting.com paths that carry a file extension (.html/.php).
// The next-intl middleware matcher skips dotted paths, so these permanent (308)
// redirects live here instead. Extensionless legacy paths are in lib/redirects.ts.
// Full inventory + rationale: specs/redirects-inventory.md.
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
  ["/our-way-head.html", "/solutions/5h-framework"],
  ["/ten-ingredients.html", "/solutions/5h-framework"],
  ["/book-endorsement.html", "/book"],
  ["/our-impact.html", "/#impact"],
  ["/Impact-and-global-reach.html", "/solutions/regions"],
  ["/our-news.html", "/insights"],
  ["/email-us.html", "/#contact"],
  ["/privacy-policy.html", "/privacy"],
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
    return legacyDottedRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
