"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Face value, service fee, and total are ALWAYS shown separately (CLAUDE.md
// + design_system.md). The editorial direction uses serif (Frank Ruhl Libre)
// for prices in the `full` variant — they read as receipt-grade editorial
// figures. The `compact` variant for cards uses Rubik tabular-nums so prices
// line up visually in dense lists.

export type PriceBreakdownProps = {
  faceValue: number;
  serviceFee: number;
  /** `compact` is a one-line summary for cards; `full` is the expanded view for the details page. */
  variant?: "compact" | "full";
  className?: string;
};

function formatShekels(value: number, language: string): string {
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
      <div className={cn("flex flex-col items-end gap-0.5", className)}>
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-sage">
          {t("price.faceValue")}
        </span>
        <span
          data-numeric
          className="font-display text-h3 font-medium text-ink"
        >
          {formatShekels(faceValue, language)}
        </span>
        <span className="text-caption text-ink-3" data-numeric>
          +{formatShekels(serviceFee, language)} {t("price.serviceFee")}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-cream p-5",
        className,
      )}
    >
      <Row
        label={t("price.faceValue")}
        value={formatShekels(faceValue, language)}
        emphasized
      />
      <Row
        label={t("price.serviceFee")}
        value={formatShekels(serviceFee, language)}
        muted
      />
      <div className="my-1 border-t border-border" />
      <Row
        label={t("price.total")}
        value={formatShekels(total, language)}
        total
      />
    </div>
  );
}

function Row({
  label,
  value,
  muted = false,
  emphasized = false,
  total = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasized?: boolean;
  total?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          "text-body",
          total
            ? "font-medium text-ink"
            : muted
              ? "text-ink-3"
              : "text-ink-2",
        )}
      >
        {label}
      </span>
      <span
        data-numeric
        className={cn(
          total
            ? "font-display text-h2 font-medium text-ink"
            : emphasized
              ? "font-display text-h3 text-ink"
              : "font-body text-body-lg text-ink-3",
        )}
      >
        {value}
      </span>
    </div>
  );
}
