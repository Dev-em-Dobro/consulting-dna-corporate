import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // CMS media is delivered from the Bunny.net CDN (BUNNY_CDN_URL).
    remotePatterns: [
      { protocol: "https", hostname: "corporate-dna.b-cdn.net" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
