"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "./types";

export async function adminRemoveListing(id: string): Promise<ActionResult> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "removed" })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function adminToggleAdmin(
  userId: string,
  next: boolean
): Promise<ActionResult> {
  await assertAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_admin: next })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}
