/**
 * Canonical production site config, shared by SEO metadata, the sitemap,
 * robots and structured data (005).
 *
 * Prefer an explicit NEXT_PUBLIC_SITE_URL. On Vercel, fall back to the
 * deployment host so og:image / canonicals resolve on *.vercel.app before the
 * custom domain is attached. Hardcoded domain is the last resort for local
 * builds without env.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionHost) return `https://${productionHost.replace(/^https?:\/\//, "")}`;

  const deploymentHost = process.env.VERCEL_URL?.trim();
  if (deploymentHost) return `https://${deploymentHost.replace(/^https?:\/\//, "")}`;

  return "https://corporatednaconsulting.com";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "CorporateDNA Consulting";
export const SITE_DESCRIPTION =
  "Global leadership advisory & executive coaching. We help CEOs, CHROs and executive teams align leadership, accelerate decisions and build the talent required to deliver transformation.";
