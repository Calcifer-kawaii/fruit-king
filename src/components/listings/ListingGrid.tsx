import { ListingCard } from "./ListingCard";
import type { ListingWithDetails } from "@/types/domain";

interface ListingGridProps {
  listings: ListingWithDetails[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
