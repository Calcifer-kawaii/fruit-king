import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ListingWithDetails } from "@/types/domain";

interface ListingQueryOptions {
  q?: string;
  fruitType?: string;
  prefecture?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
  status?: "active" | "any";
  sellerId?: string;
}

const SELECT_LISTING_DETAILS = `
  *,
  images:listing_images(id, listing_id, image_url, sort_order, created_at),
  seller:profiles!listings_seller_id_fkey(id, display_name, username, avatar_url)
`;

export async function fetchListings(
  options: ListingQueryOptions = {}
): Promise<ListingWithDetails[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(SELECT_LISTING_DETAILS)
    .limit(options.limit ?? 24);

  if ((options.status ?? "active") === "active") {
    query = query.eq("status", "active");
  }
  if (options.sellerId) query = query.eq("seller_id", options.sellerId);
  if (options.fruitType) query = query.eq("fruit_type", options.fruitType);
  if (options.prefecture) query = query.eq("prefecture", options.prefecture);
  if (options.q) query = query.ilike("title", `%${options.q}%`);

  switch (options.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (options.offset) {
    const from = options.offset;
    const to = from + (options.limit ?? 24) - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;
  if (error) {
    console.error("fetchListings error", error);
    return [];
  }
  return (data as unknown as ListingWithDetails[]).map((row) => ({
    ...row,
    images: (row.images ?? []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}

export async function fetchListingById(
  id: string
): Promise<ListingWithDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_LISTING_DETAILS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const listing = data as unknown as ListingWithDetails;
  return {
    ...listing,
    images: (listing.images ?? []).sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function fetchOwnListings(
  sellerId: string
): Promise<ListingWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_LISTING_DETAILS)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ListingWithDetails[]).map((row) => ({
    ...row,
    images: (row.images ?? []).sort((a, b) => a.sort_order - b.sort_order),
  }));
}
