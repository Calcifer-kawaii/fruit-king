import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { InquiryWithDetails } from "@/types/domain";

const SELECT_INQUIRY = `
  *,
  listing:listings(id, title),
  buyer:profiles!inquiries_buyer_id_fkey(id, display_name, username, avatar_url),
  seller:profiles!inquiries_seller_id_fkey(id, display_name, username, avatar_url)
`;

export async function fetchReceivedInquiries(
  userId: string
): Promise<InquiryWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(SELECT_INQUIRY)
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as InquiryWithDetails[];
}

export async function fetchSentInquiries(
  userId: string
): Promise<InquiryWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(SELECT_INQUIRY)
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as unknown as InquiryWithDetails[];
}
