// Skeleton state for the search grid — shown on initial mount while the
// "data loads" (mocked in Phase 1; Phase 2 swaps this for a real fetch).
// Shape mirrors TicketCard so layout doesn't shift when the real cards appear.

import { Card } from "@/components/ui/Card";

export function TicketCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex animate-pulse flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex gap-2">
            <SkeletonBar className="h-5 w-20" />
            <SkeletonBar className="h-5 w-28" />
          </div>
          <SkeletonBar className="h-5 w-3/4" />
          <SkeletonBar className="h-4 w-1/2" />
          <SkeletonBar className="h-4 w-1/3" />
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <SkeletonBar className="h-7 w-24" />
          <SkeletonBar className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return <div className={`rounded-sm bg-navy-100 ${className ?? ""}`} />;
}
