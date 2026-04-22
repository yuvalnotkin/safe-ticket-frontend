"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Face value, service fee, and total are ALWAYS shown separately
// (CLAUDE.md rule + design_system.md §7). Face value and total use the
// display font (Rubik, tabular-nums). Service fee is muted to de-emphasize
// without hiding it.

export type PriceBreakdownProps = {
  faceValue: number;
  serviceFee: number;
  /** `compact` is a one-line summary for cards; `full` is the expanded view for the details page. */
  variant?: "compact" | "full";
  className?: string;
};

function formatShekels(value: number, language: string): string {
  // Intl formatting gives us the currency symbol placement correct for each
  // locale. We strip fractional digits because whole-shekel pricing is the norm.
  return new Intl.NumberFormat(language === "he" ? "he-IL" : "en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PriceBreakdown({
  faceValue,
  serviceFee,
  variant = "full",
  className,
}: PriceBreakdownProps) {
  const { t, language } = useLanguage();
  const total = faceValue + serviceFee;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-baseline gap-2", className)}>
        <span
          data-numeric
          className="font-display text-h2 font-bold text-navy-900"
        >
          {formatShekels(total, language)}
        </span>
        <span className="text-caption text-navy-500">
          {t("price.faceValue")} {formatShekels(faceValue, language)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-navy-100 bg-navy-50 p-4",
        className,
      )}
    >
      <Row
        label={t("price.faceValue")}
        value={formatShekels(faceValue, language)}
      />
      <Row
        label={t("price.serviceFee")}
        value={formatShekels(serviceFee, language)}
        muted
      />
      <div className="my-1 border-t border-navy-100" />
      <Row
        label={t("price.total")}
        value={formatShekels(total, language)}
        emphasized
      />
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
  emphasized = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span
        className={cn(
          "text-body",
          muted ? "text-navy-500" : "text-navy-800",
          emphasized && "font-medium text-navy-900",
        )}
      >
        {label}
      </span>
      <span
        data-numeric
        className={cn(
          emphasized
            ? "font-display text-h3 font-bold text-navy-900"
            : muted
              ? "font-body text-body text-navy-500"
              : "font-display text-body-lg font-medium text-navy-900",
        )}
      >
        {value}
      </span>
    </div>
  );
}
