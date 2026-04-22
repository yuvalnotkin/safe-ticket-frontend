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

// Full ticket details page. Two-column on md+: event + seat + timeline +
// trust callout on the left, price + Buy CTA + seller card on the right
// (sticky). Collapses to a single column on mobile with the price block
// lifted to the top so it stays visible as the user scrolls.
//
// Buy CTA is intentionally non-functional — the Phase 1 MVP visualizes
// the product; real checkout lands after Phase 2's backend integration.
// Clicking surfaces a toast to confirm the action was received.

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
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/search"
        className="self-start text-small font-medium text-navy-600 hover:text-navy-900"
      >
        ← {t("nav.browse")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: event info, seat, timeline, trust */}
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge />
              <Badge tone="neutral">
                {t("ticket.provider")}: {t(`providerName.${ticket.provider}`)}
              </Badge>
              <Badge tone="neutral">
                {t(`category.${ticket.event.category}`)}
              </Badge>
            </div>
            <h1 className="text-h1 font-bold text-navy-900">
              {ticket.event.name}
            </h1>
            <p className="text-body-lg text-navy-700">
              {dateLabel} · {timeLabel}
            </p>
            <p className="text-body text-navy-600">
              {ticket.event.venue}, {ticket.event.city}
            </p>
          </section>

          <Card className="p-5">
            <h2 className="text-h3 font-semibold text-navy-900">
              {t("ticket.seatDetails")}
            </h2>
            <dl className="mt-4 grid grid-cols-3 gap-4 text-small">
              <SeatField label={t("ticket.section")} value={ticket.seat.section} />
              {ticket.seat.row && (
                <SeatField label={t("ticket.row")} value={ticket.seat.row} />
              )}
              {ticket.seat.seat && (
                <SeatField label={t("ticket.seat")} value={ticket.seat.seat} />
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="text-h3 font-semibold text-navy-900">
              {t("ticket.timelineTitle")}
            </h2>
            <p className="mt-1 text-small text-navy-600">
              {t("home.refundNote")}
            </p>
            <div className="mt-5">
              <TransactionTimeline />
            </div>
          </Card>

          <WhySafe />
        </div>

        {/* RIGHT: price + buy + seller (sticky on md+) */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="flex flex-col gap-4 p-5">
            <PriceBreakdown
              faceValue={ticket.price.faceValue}
              serviceFee={ticket.price.serviceFee}
              variant="full"
            />
            <Button variant="trust" size="lg" onClick={handleBuy}>
              {t("ticket.buyCta")}
            </Button>
            <p className="text-caption text-navy-500">
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
      <dt className="text-caption font-medium uppercase tracking-wide text-navy-500">
        {label}
      </dt>
      <dd className="font-display text-body-lg font-semibold text-navy-900">
        {value}
      </dd>
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
    <section className="rounded-lg border border-green-200 bg-green-50 p-5">
      <h2 className="text-h3 font-semibold text-green-900">
        {t("trust.whySafeTitle")}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-body text-navy-800">
            <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-green-700" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SellerCard({ ticketId }: { ticketId: string }) {
  const { t, language } = useLanguage();
  // Static preview for Phase 1 — Phase 2 will pull a real seller profile
  // from the backend. ticketId is used only to vary the avatar initial so
  // different tickets don't all show identical mock identities.
  const initial = ticketId.slice(-1).toUpperCase();
  const sinceDate = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { month: "long", year: "numeric" },
  ).format(new Date("2024-08-01"));

  return (
    <Card className="p-5">
      <h2 className="text-h3 font-semibold text-navy-900">{t("ticket.seller")}</h2>
      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 font-display text-h3 font-bold text-navy-900">
          {initial}
        </span>
        <div className="flex flex-col">
          <span className="text-body font-medium text-navy-900">
            {t("trust.verifiedBadge")}
          </span>
          <span className="text-small text-navy-600">
            {t("ticket.sellerSince").replace("{date}", sinceDate)}
          </span>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-navy-100 pt-4 text-small">
        <div className="flex flex-col gap-1">
          <dt className="text-caption text-navy-500">{t("ticket.sellerRating")}</dt>
          <dd className="font-display text-h3 font-semibold text-navy-900" data-numeric>
            4.9 / 5
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-caption text-navy-500">{t("ticket.sellerTransfers")}</dt>
          <dd className="font-display text-h3 font-semibold text-navy-900" data-numeric>
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
