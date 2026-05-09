"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatPriceILS } from "@/lib/money";

// Face value, service fee, and total are ALWAYS shown separately (CLAUDE.md
// + design_system.md). The editorial direction uses serif (Frank Ruhl Libre)
// for prices in the `full` variant — they read as receipt-grade editorial
// figures. The `compact` variant for cards uses Rubik tabular-nums so prices
// line up visually in dense lists.

export type PriceBreakdownProps = {
  faceValueAgorot: number;
  serviceFeeAgorot: number;
  /** `compact` is a one-line summary for cards; `full` is the expanded view for the details page. */
  variant?: "compact" | "full";
  className?: string;
};

export function PriceBreakdown({
  faceValueAgorot,
  serviceFeeAgorot,
  variant = "full",
  className,
}: PriceBreakdownProps) {
  const { t, language } = useLanguage();
  const totalAgorot = faceValueAgorot + serviceFeeAgorot;
  const fmt = (agorot: number) =>
    formatPriceILS(agorot, language === "he" ? "he-IL" : "en-US");

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
          {fmt(faceValueAgorot)}
        </span>
        <span className="text-caption text-ink-3" data-numeric>
          +{fmt(serviceFeeAgorot)} {t("price.serviceFee")}
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
        value={fmt(faceValueAgorot)}
        emphasized
      />
      <Row
        label={t("price.serviceFee")}
        value={fmt(serviceFeeAgorot)}
        muted
      />
      <div className="my-1 border-t border-border" />
      <Row
        label={t("price.total")}
        value={fmt(totalAgorot)}
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
          total || emphasized
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
              ? "font-display text-h3 font-medium text-ink"
              : "font-body text-body-lg text-ink-3",
        )}
      >
        {value}
      </span>
    </div>
  );
}
