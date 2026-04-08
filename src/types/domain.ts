import type {
  InquiryRow,
  ListingImageRow,
  ListingRow,
  ProfileRow,
} from "./database";

export type SellerSummary = Pick<
  ProfileRow,
  "id" | "display_name" | "username" | "avatar_url"
>;

export interface ListingWithDetails extends ListingRow {
  images: ListingImageRow[];
  seller: SellerSummary | null;
}

export interface InquiryWithDetails extends InquiryRow {
  listing: Pick<ListingRow, "id" | "title"> | null;
  buyer: SellerSummary | null;
  seller: SellerSummary | null;
}
