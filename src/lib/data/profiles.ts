import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

export async function fetchProfileByUsername(
  username: string
): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}

export async function fetchProfileById(
  id: string
): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}

export async function searchProfiles(q: string): Promise<ProfileRow[]> {
  if (!q.trim()) return [];
  const supabase = await createClient();
  const term = `%${q}%`;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`display_name.ilike.${term},username.ilike.${term}`)
    .limit(24);
  if (error || !data) return [];
  return data as ProfileRow[];
}
