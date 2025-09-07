// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Apply security headers (CSP, referrer, permissions, HSTS).
 */
function applySecurityHeaders(res: NextResponse) {
  const cspParts = [
    "default-src 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "media-src 'self' data: blob: https:",
    `connect-src 'self' https: ${isDev ? "http: ws: wss:" : ""}`,
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
      : "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "frame-ancestors 'self'",
    "object-src 'none'"
    // TODO: tighten with your actual domains (analytics, email, media CDNs)
  ];

  res.headers.set("Content-Security-Policy", cspParts.join("; "));
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    [
      "accelerometer=()",
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "usb=()",
      "payment=()"
    ].join(", ")
  );
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");

  if (!isDev) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
}

/**
 * Route protection:
 * - /admin requires role: admin
 * - /creator requires any of: creator, moderator, admin
 */
async function maybeProtect(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAdmin = pathname.startsWith("/admin");
  const needsCreator = pathname.startsWith("/creator");
  if (!needsAdmin && !needsCreator) return null;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, req.url);
    return NextResponse.redirect(url);
  }
  const roles = (token.roles as string[]) || [];
  if (needsAdmin && !roles.includes("admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (needsCreator && !roles.some((r) => r === "creator" || r === "moderator" || r === "admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return null;
}

export async function middleware(req: NextRequest) {
  // Protect gated routes first
  const protection = await maybeProtect(req);
  if (protection) return protection;

  // Then apply headers for all responses
  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
}

/** apply to everything except static assets */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/.*|fonts/.*).*)",
  ],
};

