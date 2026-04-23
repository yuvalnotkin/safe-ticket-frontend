import { Card } from "@/components/ui/Card";

// Mirrors TicketCard's shape so the grid doesn't shift when real cards load.

export function TicketCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-[16/10] w-full animate-pulse bg-cream-deep" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBar className="h-4 w-20" />
          <SkeletonBar className="h-4 w-24" />
        </div>
        <SkeletonBar className="h-5 w-3/4" />
        <SkeletonBar className="h-4 w-1/2" />
        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-col gap-2">
            <SkeletonBar className="h-3 w-16" />
            <SkeletonBar className="h-6 w-20" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <SkeletonBar className="h-3 w-10" />
            <SkeletonBar className="h-4 w-14" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-sm bg-cream-deep ${className ?? ""}`} />
  );
}
