import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ApiError, getListing } from "@/lib/api";
import { TicketDetails } from "@/components/ticket/TicketDetails";

type Props = {
  params: Promise<{ id: string }>;
};

// Both `400 invalid_request` (bad UUID) and `404 listing_not_found` should
// surface as "this ticket is not available" to the user — distinguishing
// "malformed id" from "missing record" isn't useful in the UI. Anything
// else (network, 500, etc.) bubbles to the error boundary so the user
// gets a retry rather than a not-found dead end.
function isNotFoundError(e: unknown): boolean {
  if (!(e instanceof ApiError)) return false;
  return e.status === 404 || e.status === 400;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getListing(id);
    return {
      title: listing.event.name,
      description: `${listing.event.venue}, ${listing.event.city} — Safe Ticket`,
    };
  } catch (e) {
    if (isNotFoundError(e)) return { title: "Ticket not found" };
    return { title: "Ticket" };
  }
}

export default async function TicketDetailsPage({ params }: Props) {
  const { id } = await params;
  // Resolve the listing OUTSIDE of JSX so the try/catch only wraps the
  // data fetch — JSX errors must be handled by an error boundary, not
  // by try/catch (eslint react-hooks/error-boundaries).
  let listing;
  try {
    listing = await getListing(id);
  } catch (e) {
    if (isNotFoundError(e)) notFound();
    throw e; // let error.tsx render the retry UI
  }
  return <TicketDetails ticket={listing} />;
}
