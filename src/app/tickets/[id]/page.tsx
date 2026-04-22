import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { MOCK_TICKETS } from "@/lib/mock-data";

// Placeholder route for Sprint 1.2. The full ticket details page — event
// info, seat, provider badge, PriceBreakdown, TransactionTimeline, seller
// profile, Buy CTA, trust callout — is built in Sprint 1.3.
//
// For now: confirms the id resolves to a real ticket (404 if not), shows
// the name, and tells the user the full page is coming.

export default async function TicketPlaceholderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = MOCK_TICKETS.find((t) => t.id === id);
  if (!ticket) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-12">
      <Link
        href="/search"
        className="text-small font-medium text-navy-600 hover:text-navy-900"
      >
        ← /search
      </Link>
      <div className="rounded-lg border border-dashed border-navy-200 bg-surface p-8">
        <Badge tone="warning">Sprint 1.3</Badge>
        <h1 className="mt-4 text-h1 font-bold text-navy-900">
          {ticket.event.name}
        </h1>
        <p className="mt-2 text-body-lg text-navy-700">
          {ticket.event.venue}, {ticket.event.city}
        </p>
        <p className="mt-6 max-w-prose text-body text-navy-600">
          Ticket details page (full event info, seat, PriceBreakdown,
          TransactionTimeline, seller profile, Buy CTA, trust callout) ships
          in Sprint 1.3.
        </p>
      </div>
    </main>
  );
}
