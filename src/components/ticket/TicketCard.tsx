"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { VerificationBadge } from "./VerificationBadge";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Ticket } from "@/lib/types";
import { cn } from "@/lib/utils";

// Editorial event card. Photo (or category gradient) fills the top 16:10
// region with a category pill + date caption + gradient protection for
// text. Bone surface below holds serif title, venue meta, and the price
// with a "face value" eyebrow. Hover: border steps to forest, 6px lift +
// forest-tinted deep shadow, image zooms 6%, "View →" affordance slides in.

// Category gradient fallbacks for tickets without a specific hero image.
const CATEGORY_GRADIENT: Record<Ticket["event"]["category"], string> = {
  sports:
    "linear-gradient(135deg, #063B2E 0%, #1f5a44 60%, #3B7C5F 100%)",
  culture:
    "linear-gradient(135deg, #2B2721 0%, #6E6659 60%, #A45E25 100%)",
};

// Per-id overrides where we have real photography for specific events.
// Matches the pattern from the design bundle's HomeHe.jsx.
const TICKET_IMAGE: Record<string, string> = {
  "t-001": "/images/basketball.jpg",
  "t-013": "/images/basketball.jpg",
  "t-003": "/images/IMG_2189.jpeg",
};

function imageFor(ticket: Ticket): { src?: string; gradient?: string } {
  if (TICKET_IMAGE[ticket.id]) return { src: TICKET_IMAGE[ticket.id] };
  if (ticket.event.category === "sports") return { src: "/images/stadium.jpg" };
  return { gradient: CATEGORY_GRADIENT[ticket.event.category] };
}

export type TicketCardProps = {
  ticket: Ticket;
};

export function TicketCard({ ticket }: TicketCardProps) {
  const { t, language } = useLanguage();
  const { src, gradient } = imageFor(ticket);

  const eventDate = new Date(ticket.event.date);
  const dateLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { day: "2-digit", month: "short" },
  ).format(eventDate);
  const timeLabel = new Intl.DateTimeFormat(
    language === "he" ? "he-IL" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  ).format(eventDate);

  const total = ticket.price.faceValue + ticket.price.serviceFee;
  const currency = new Intl.NumberFormat(
    language === "he" ? "he-IL" : "en-US",
    { style: "currency", currency: "ILS", maximumFractionDigits: 0 },
  );

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-bone shadow-xs",
        "transition-all duration-250 ease-out",
        "hover:-translate-y-1.5 hover:border-forest-900 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/40",
      )}
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={
          src ? undefined : { background: gradient }
        }
      >
        {src && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
            style={{ backgroundImage: `url(${src})` }}
          />
        )}
        {/* Bottom protection gradient so caption stays legible over imagery. */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-forest-950/70 to-transparent" />

        <span className="absolute top-3.5 start-3.5 z-10 inline-flex items-center rounded-pill bg-cream/90 px-2.5 py-1 text-caption font-medium text-forest-900">
          {t(`category.${ticket.event.category}`)}
        </span>

        <div className="absolute bottom-3.5 start-4 z-10 text-micro font-medium uppercase tracking-[0.08em] text-cream">
          {dateLabel} · {timeLabel}
        </div>

        <div
          className={cn(
            "absolute bottom-3.5 end-4 z-10 flex items-center gap-1.5 font-display text-small font-medium text-cream",
            "opacity-0 translate-x-[-8px] transition-all duration-250 ease-out",
            "group-hover:opacity-100 group-hover:translate-x-0",
            "rtl:translate-x-[8px] rtl:group-hover:translate-x-0",
          )}
        >
          {t("ticket.viewDetails")}{" "}
          <span className="text-base leading-none">→</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <VerificationBadge />
          <Badge tone="info" mono>
            {ticket.provider}
          </Badge>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-display text-h4 font-medium leading-tight text-ink">
            {ticket.event.name}
          </h3>
          <p className="text-caption text-ink-3">
            {ticket.event.venue}, {ticket.event.city}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-micro uppercase tracking-[0.08em] text-ink-3">
              {t("price.faceValue")}
            </span>
            <span
              data-numeric
              className="text-body font-medium text-ink-2"
            >
              {currency.format(ticket.price.faceValue)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-micro uppercase tracking-[0.08em] text-ink-3">
              {t("price.total")}
            </span>
            <span className="text-body font-medium text-ink-2" data-numeric>
              {currency.format(total)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
