"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "./VerificationBadge";
import { PriceBreakdown } from "./PriceBreakdown";
import { TransactionTimeline } from "./TransactionTimeline";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/Toast";
import type { Ticket } from "@/lib/types";

// Editorial ticket details page. Two-column on lg+: narrative on the left
// (event info + seat + timeline + trust callout), action card on the right
// (price + Buy CTA + seller). Collapses to single-column on mobile with the
// action card floating above the timeline so price + Buy stay above the fold.

export function TicketDetails({ ticket }: { ticket: Ticket }) {
  const { t, language } = useLanguage();
  const toast = useToast();

  const eventDate = new Date(ticket.event.date);
  const dateLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(eventDate);
  const timeLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  ).format(eventDate);

  function handleBuy() {
    toast.show(t("toast.buyComingSoon"), { tone: "info" });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:py-14">
      <Link
        href="/search"
        className="link-underline self-start text-caption font-medium text-ink-2"
      >
        ← {t("nav.browse")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* LEFT: event info + seat + timeline + trust */}
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <VerificationBadge />
              <Badge tone="info" mono>
                {ticket.provider}
              </Badge>
              <Badge tone="neutral">
                {t(`category.${ticket.event.category}`)}
              </Badge>
            </div>
            <h1 className="font-display text-display-md font-medium text-ink">
              {ticket.event.name}
            </h1>
            <p className="text-body-lg text-ink-2">
              {dateLabel} · {timeLabel}
            </p>
            <p className="text-body text-ink-3">
              {ticket.event.venue}, {ticket.event.city}
            </p>
          </section>

          <Card className="p-6">
            <h2 className="font-display text-h3 font-medium text-ink">
              {t("ticket.seatDetails")}
            </h2>
            <dl className="mt-5 grid grid-cols-3 gap-4">
              <SeatField label={t("ticket.section")} value={ticket.seat.section} />
              {ticket.seat.row && (
                <SeatField label={t("ticket.row")} value={ticket.seat.row} />
              )}
              {ticket.seat.seat && (
                <SeatField label={t("ticket.seat")} value={ticket.seat.seat} />
              )}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-h3 font-medium text-ink">
              {t("ticket.timelineTitle")}
            </h2>
            <p className="mt-1 text-caption text-ink-3">
              {t("home.refundNote")}
            </p>
            <div className="mt-6">
              <TransactionTimeline />
            </div>
          </Card>

          <WhySafe />
        </div>

        {/* RIGHT: price + Buy + seller (sticky on lg+) */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="flex flex-col gap-5 p-6">
            <PriceBreakdown
              faceValue={ticket.price.faceValue}
              serviceFee={ticket.price.serviceFee}
              variant="full"
            />
            <Button variant="cta" size="lg" onClick={handleBuy}>
              {t("ticket.buyCta")}
            </Button>
            <p className="text-caption text-ink-3">
              {t("ticket.refundNote")}
            </p>
          </Card>

          <SellerCard ticketId={ticket.id} />
        </aside>
      </div>
    </main>
  );
}

function SeatField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
        {label}
      </dt>
      <dd className="font-display text-h3 font-medium text-ink">{value}</dd>
    </div>
  );
}

function WhySafe() {
  const { t } = useLanguage();
  const points = [
    t("trust.whySafeVerified"),
    t("trust.whySafeFaceValue"),
    t("trust.whySafeTransfer"),
    t("trust.whySafeEscrow"),
  ];
  return (
    <section className="rounded-lg border border-border bg-cream-deep p-6">
      <h2 className="font-display text-h3 font-medium text-forest-900">
        {t("trust.whySafeTitle")}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-body text-ink-2">
            <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-sage" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SellerCard({ ticketId }: { ticketId: string }) {
  const { t, language } = useLanguage();
  const initial = ticketId.slice(-1).toUpperCase();
  const sinceDate = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { month: "long", year: "numeric" },
  ).format(new Date("2024-08-01"));

  return (
    <Card className="p-6">
      <h2 className="font-display text-h3 font-medium text-ink">
        {t("ticket.seller")}
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-900 font-display text-h3 font-medium text-cream">
          {initial}
        </span>
        <div className="flex flex-col">
          <VerificationBadge />
          <span className="text-caption text-ink-3">
            {t("ticket.sellerSince").replace("{date}", sinceDate)}
          </span>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div className="flex flex-col gap-1">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-3">
            {t("ticket.sellerRating")}
          </dt>
          <dd
            className="font-display text-h3 font-medium text-ink"
            data-numeric
          >
            4.9 / 5
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-3">
            {t("ticket.sellerTransfers")}
          </dt>
          <dd
            className="font-display text-h3 font-medium text-ink"
            data-numeric
          >
            12
          </dd>
        </div>
      </dl>
    </Card>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5 10 3.5 3.5L15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
