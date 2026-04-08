import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

export interface CurrentUser {
  userId: string;
  email: string | null;
  profile: ProfileRow | null;
}

/**
 * Returns the currently authenticated user (if any) along with their
 * profile row. Returns null when not signed in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (profile as ProfileRow | null) ?? null,
  };
}
