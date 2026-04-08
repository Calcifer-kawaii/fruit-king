"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { listingSchema } from "@/lib/validation/listing";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { ActionResult } from "./types";

function parseImages(formData: FormData): string[] {
  return formData
    .getAll("images")
    .map((v) => String(v))
    .filter((v) => v.length > 0);
}

function buildPayload(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    fruit_type: String(formData.get("fruit_type") ?? ""),
    price: Number(formData.get("price") ?? 0),
    currency: String(formData.get("currency") ?? "JPY"),
    description: String(formData.get("description") ?? ""),
    stock: Number(formData.get("stock") ?? 1),
    prefecture: String(formData.get("prefecture") ?? ""),
    status: (formData.get("status") as string) ?? "draft",
    images: parseImages(formData),
  };
}

export async function createListing(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const parsed = listingSchema.safeParse(buildPayload(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
    });
    return { ok: false, error: "validation", fieldErrors };
  }

  const supabase = await createClient();
  const { images, ...listingFields } = parsed.data;

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({ ...listingFields, seller_id: current.userId })
    .select("id")
    .single();

  if (error || !listing) {
    return { ok: false, error: error?.message ?? "insert_failed" };
  }

  if (images.length > 0) {
    const rows = images.map((url, idx) => ({
      listing_id: listing.id,
      image_url: url,
      sort_order: idx,
    }));
    const { error: imgError } = await supabase
      .from("listing_images")
      .insert(rows);
    if (imgError) {
      return { ok: false, error: imgError.message };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/listings");
  revalidatePath("/dashboard/listings");
  return { ok: true, id: listing.id };
}

export async function updateListing(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const parsed = listingSchema.safeParse(buildPayload(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => {
      if (i.path[0]) fieldErrors[String(i.path[0])] = i.message;
    });
    return { ok: false, error: "validation", fieldErrors };
  }

  const supabase = await createClient();
  const { images, ...listingFields } = parsed.data;

  const { error } = await supabase
    .from("listings")
    .update(listingFields)
    .eq("id", id)
    .eq("seller_id", current.userId);

  if (error) return { ok: false, error: error.message };

  // Replace images: delete existing, then insert new ordered set.
  await supabase.from("listing_images").delete().eq("listing_id", id);
  if (images.length > 0) {
    const rows = images.map((url, idx) => ({
      listing_id: id,
      image_url: url,
      sort_order: idx,
    }));
    await supabase.from("listing_images").insert(rows);
  }

  revalidatePath("/", "layout");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/dashboard/listings");
  return { ok: true, id };
}

export async function deleteListing(id: string): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("seller_id", current.userId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/listings");
  return { ok: true };
}

export async function setListingStatus(
  id: string,
  status: "draft" | "active" | "sold"
): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "auth" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id)
    .eq("seller_id", current.userId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/listings");
  revalidatePath(`/listings/${id}`);
  return { ok: true };
}
