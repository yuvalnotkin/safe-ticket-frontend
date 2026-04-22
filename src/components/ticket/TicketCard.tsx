"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceBreakdown } from "./PriceBreakdown";
import { VerificationBadge } from "./VerificationBadge";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Ticket } from "@/lib/types";

// Summary card for search results. Composes Card + VerificationBadge +
// PriceBreakdown (compact). Mobile-first: breathes vertically on narrow
// screens; shifts to a 2-col layout on md+ for denser desktop lists.
//
// Clicks route to /tickets/[id] (details page lands in Sprint 1.3). Until
// then the link is valid but the destination is a 404 — fine for 1.1/1.2.

export type TicketCardProps = {
  ticket: Ticket;
};

export function TicketCard({ ticket }: TicketCardProps) {
  const { t, language } = useLanguage();

  const eventDate = new Date(ticket.event.date);
  const dateLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { day: "2-digit", month: "short", year: "numeric" },
  ).format(eventDate);
  const timeLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  ).format(eventDate);

  return (
    <Card interactive className="overflow-hidden">
      <Link
        href={`/tickets/${ticket.id}`}
        className="flex flex-col gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy-900 md:flex-row md:items-start md:justify-between"
      >
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge />
            <Badge tone="neutral">{t(`ticket.provider`)}: {ticket.provider}</Badge>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-h3 font-semibold text-navy-900">
              {ticket.event.name}
            </h3>
            <p className="text-small text-navy-600">
              {dateLabel} · {timeLabel} · {ticket.event.venue}, {ticket.event.city}
            </p>
          </div>
          <p className="text-small text-navy-700">
            {t("ticket.section")} {ticket.seat.section}
            {ticket.seat.row && <> · {t("ticket.row")} {ticket.seat.row}</>}
            {ticket.seat.seat && <> · {t("ticket.seat")} {ticket.seat.seat}</>}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <PriceBreakdown
            faceValue={ticket.price.faceValue}
            serviceFee={ticket.price.serviceFee}
            variant="compact"
          />
          <span className="text-small font-medium text-navy-900">
            {t("ticket.viewDetails")} →
          </span>
        </div>
      </Link>
    </Card>
  );
}
