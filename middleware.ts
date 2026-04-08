import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First refresh the Supabase session cookies on the original request,
  // then let next-intl handle locale routing on the response.
  const sessionResponse = await updateSession(request);
  const intlResponse = intlMiddleware(request);

  // Merge any cookies set by Supabase onto the locale-routed response.
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse ?? NextResponse.next();
}

export const config = {
  // Match all paths except API routes, Next internals, static files, and the auth callback.
  matcher: [
    "/((?!api|_next/static|_next/image|auth/callback|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
