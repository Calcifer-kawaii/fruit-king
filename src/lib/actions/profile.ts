"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/profile";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { ActionResult } from "./listings";

export async function updateProfile(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const parsed = profileSchema.safeParse({
    display_name: String(formData.get("display_name") ?? ""),
    username: String(formData.get("username") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    preferred_language: String(formData.get("preferred_language") ?? "ja"),
    avatar_url: String(formData.get("avatar_url") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
    });
    return { ok: false, error: "validation", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      username: parsed.data.username || null,
      bio: parsed.data.bio || null,
      preferred_language: parsed.data.preferred_language,
      avatar_url: parsed.data.avatar_url || null,
    })
    .eq("id", current.userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/profile");
  if (parsed.data.username) {
    revalidatePath(`/u/${parsed.data.username}`);
  }
  return { ok: true };
}
