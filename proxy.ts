import { NextRequest, NextResponse } from "next/server";
import { isSiteEditingEnabled, isSiteEditingRoute } from "./lib/edit-access";

/** Block editor pages and copy APIs before rendering or executing route code. */
export function proxy(request: NextRequest) {
  if (!isSiteEditingEnabled() && isSiteEditingRoute(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/edit",
    "/edit/:path*",
    "/edit-home",
    "/edit-about",
    "/edit-team",
    "/edit-services",
    "/edit-services/:path*",
    "/edit-clients",
    "/edit-impact",
    "/edit-approach",
    "/edit-insights",
    "/edit-events",
    "/api/:path*",
  ],
};
