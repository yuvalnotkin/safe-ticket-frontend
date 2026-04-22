import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MOCK_TICKETS } from "@/lib/mock-data";
import { TicketDetails } from "@/components/ticket/TicketDetails";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ticket = MOCK_TICKETS.find((t) => t.id === id);
  if (!ticket) return { title: "Ticket" };
  return {
    title: ticket.event.name,
    description: `${ticket.event.venue}, ${ticket.event.city} — Safe Ticket`,
  };
}

export default async function TicketDetailsPage({ params }: Props) {
  const { id } = await params;
  const ticket = MOCK_TICKETS.find((t) => t.id === id);
  if (!ticket) notFound();
  return <TicketDetails ticket={ticket} />;
}
