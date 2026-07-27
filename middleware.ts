import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, RETIRED_LOCALES } from "@/lib/i18n/routing";
import { LEGACY_REDIRECTS } from "@/lib/redirects";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // Permanently redirect retired locale prefixes (/pt, /es and their subpaths)
  // to the English equivalent, e.g. /pt/solutions → /solutions, /es → /.
  const segment = req.nextUrl.pathname.split("/")[1];
  if (RETIRED_LOCALES.includes(segment)) {
    const url = req.nextUrl.clone();
    url.pathname = req.nextUrl.pathname.slice(segment.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  // Permanently redirect legacy corporatednaconsulting.com paths to new routes
  // (spec 005). The .html/.php equivalents are handled in next.config.mjs, which
  // this matcher excludes. See lib/redirects.ts + specs/redirects-inventory.md.
  const path = req.nextUrl.pathname;
  const key = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  const dest = LEGACY_REDIRECTS[key];
  if (dest) {
    const url = req.nextUrl.clone();
    const hash = dest.indexOf("#");
    url.pathname = (hash >= 0 ? dest.slice(0, hash) : dest) || "/";
    url.hash = hash >= 0 ? dest.slice(hash) : "";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|preview|v1|_next|_vercel|.*\\..*).*)"],
};
