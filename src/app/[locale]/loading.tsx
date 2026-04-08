import { ListingGridSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="container py-16">
      <ListingGridSkeleton count={8} />
    </div>
  );
}
