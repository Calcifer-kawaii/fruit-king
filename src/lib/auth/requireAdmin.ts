import "server-only";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "./getCurrentUser";

/**
 * Server-side admin guard. Redirects non-admins to home.
 * Use at the top of admin-only server components and server actions.
 */
export async function requireAdmin(locale: string) {
  const current = await getCurrentUser();
  if (!current?.profile?.is_admin) {
    redirect({ href: "/", locale });
  }
  return current!;
}

/** Throwing variant for use inside server actions where redirect isn't appropriate. */
export async function assertAdmin() {
  const current = await getCurrentUser();
  if (!current?.profile?.is_admin) {
    throw new Error("Not authorized");
  }
  return current;
}
