// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const isDev = process.env.NODE_ENV !== "production";

/** Security headers */
function applySecurityHeaders(res: NextResponse) {
  const cspParts = [
    "default-src 'self'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "media-src 'self' data: blob: https:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
  ];
  res.headers.set("Content-Security-Policy", cspParts.join("; "));
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (!isDev) res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
}

export async function middleware(request: NextRequest) {
  // Refresh Supabase session & cookies
  const response = await updateSession(request);
  // Apply your security headers
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    // run on all but static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/.*|fonts/.*).*)",
  ],
};


