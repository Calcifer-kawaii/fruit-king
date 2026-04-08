/**
 * Hand-rolled minimal types for the public schema.
 * Replace with `supabase gen types typescript` output when convenient.
 */
export type ListingStatus = "draft" | "active" | "sold" | "removed";
export type InquiryStatus = "open" | "closed";
export type Locale = "ja" | "en";

export interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  preferred_language: Locale;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingRow {
  id: string;
  seller_id: string;
  title: string;
  fruit_type: string;
  price: number;
  currency: string;
  description: string | null;
  stock: number;
  prefecture: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ListingImageRow {
  id: string;
  listing_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface InquiryRow {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  subject: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}
