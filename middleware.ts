import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, RETIRED_LOCALES } from "@/lib/i18n/routing";

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
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|preview|v1|_next|_vercel|.*\\..*).*)"],
};
