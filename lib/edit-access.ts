/**
 * Temporary switch for the built-in page-copy editors. Disabled unless an
 * operator explicitly sets SITE_EDITING_ENABLED=true on the server and redeploys.
 * Re-enable only after adding admin authentication or accepting the former
 * public access model. The separate signed CMS webhook is not an editor route.
 */
export function isSiteEditingEnabled(): boolean {
  return process.env.SITE_EDITING_ENABLED === "true";
}

export function isSiteEditingRoute(pathname: string): boolean {
  return /^\/edit(?:\/|$|-)/.test(pathname) ||
    /^\/api\/[a-z-]+-copy(?:\/|$)/.test(pathname);
}
