import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Let next-intl decide first — if it wants to redirect (e.g. `/` → `/ja`)
  // or rewrite, return that response immediately so the redirect actually fires.
  const intlResponse = intlMiddleware(request);
  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  // Otherwise refresh the Supabase auth cookies for this request.
  const sessionResponse = await updateSession(request);

  // Carry over any cookies that next-intl set (locale cookie etc.) onto the
  // session response so we don't lose them.
  intlResponse.cookies.getAll().forEach((cookie) => {
    sessionResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return sessionResponse;
}

export const config = {
  // Match all paths except API routes, Next internals, static files, and the auth callback.
  matcher: [
    "/",
    "/(ja|en)/:path*",
    "/((?!_next|api|auth/callback|.*\\..*).*)",
  ],
};
