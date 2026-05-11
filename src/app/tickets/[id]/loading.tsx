import { Card } from "@/components/ui/Card";

// Skeleton mirroring TicketDetails' two-column layout so the page doesn't
// jank between loading and loaded states.
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:py-14">
      <SkeletonBar className="h-4 w-24" />
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <SkeletonBar className="h-6 w-24" />
              <SkeletonBar className="h-6 w-28" />
              <SkeletonBar className="h-6 w-20" />
            </div>
            <SkeletonBar className="h-10 w-3/4" />
            <SkeletonBar className="h-5 w-1/2" />
            <SkeletonBar className="h-4 w-1/3" />
          </section>
          <Card className="p-6">
            <SkeletonBar className="h-6 w-32" />
            <div className="mt-5 grid grid-cols-3 gap-4">
              <SkeletonBar className="h-12 w-full" />
              <SkeletonBar className="h-12 w-full" />
              <SkeletonBar className="h-12 w-full" />
            </div>
          </Card>
        </div>
        <aside className="flex flex-col gap-4">
          <Card className="flex flex-col gap-5 p-6">
            <SkeletonBar className="h-5 w-32" />
            <SkeletonBar className="h-12 w-full" />
            <SkeletonBar className="h-12 w-full" />
            <SkeletonBar className="h-4 w-3/4" />
          </Card>
        </aside>
      </div>
    </main>
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-cream-deep ${className ?? ""}`}
    />
  );
}
