// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Optional: your security headers in one place
function applySecurityHeaders(res: NextResponse) {
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "0");
  res.headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=()");
  return res;
}

export async function middleware(request: NextRequest) {
  // Refresh Supabase auth cookies server-side on each request (per docs)
  const response = await updateSession(request);
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    // run on everything except static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/.*|fonts/.*).*)",
  ],
};



