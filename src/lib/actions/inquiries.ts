"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validation/inquiry";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { ActionResult } from "./listings";

export async function createInquiry(
  listingId: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const parsed = inquirySchema.safeParse({
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
    });
    return { ok: false, error: "validation", fieldErrors };
  }

  const supabase = await createClient();

  // Look up the seller from the listing.
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("seller_id")
    .eq("id", listingId)
    .maybeSingle();

  if (listingError || !listing) {
    return { ok: false, error: "listing_not_found" };
  }
  if (listing.seller_id === current.userId) {
    return { ok: false, error: "own_listing" };
  }

  const { error } = await supabase.from("inquiries").insert({
    listing_id: listingId,
    buyer_id: current.userId,
    seller_id: listing.seller_id,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
    status: "open",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/inquiries");
  return { ok: true };
}

export async function closeInquiry(id: string): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: "closed" })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/inquiries");
  return { ok: true };
}
