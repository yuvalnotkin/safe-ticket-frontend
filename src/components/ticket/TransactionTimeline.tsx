"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Four-step escrow flow visual. Accepts `currentStep` so the same component
// handles every runtime state; on the details page it renders as "what will
// happen after you buy" (currentStep = -1, all upcoming).
//   - done     → sage dot + connecting rail, deemphasized copy
//   - current  → pulsing forest ring, full-color copy
//   - upcoming → outlined circle + number, muted copy

export type TransactionTimelineProps = {
  /** 0-based index of the currently active step. -1 means no step yet. */
  currentStep?: number;
  className?: string;
};

export function TransactionTimeline({
  currentStep = -1,
  className,
}: TransactionTimelineProps) {
  const { t } = useLanguage();

  const steps = [
    { title: t("ticket.timelineStep1"), body: t("ticket.timelineStep1Body") },
    { title: t("ticket.timelineStep2"), body: t("ticket.timelineStep2Body") },
    { title: t("ticket.timelineStep3"), body: t("ticket.timelineStep3Body") },
    { title: t("ticket.timelineStep4"), body: t("ticket.timelineStep4Body") },
  ];

  return (
    <ol className={cn("flex flex-col gap-0", className)}>
      {steps.map((step, i) => {
        const state =
          i < currentStep ? "done" : i === currentStep ? "current" : "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute start-[15px] top-8 bottom-0 w-px",
                  state === "done" ? "bg-sage" : "bg-border",
                )}
              />
            )}
            <StepMarker state={state} index={i + 1} />
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-display text-h4 font-medium",
                    state === "upcoming" ? "text-ink-3" : "text-ink",
                  )}
                >
                  {step.title}
                </h3>
                <StateBadge state={state} />
              </div>
              <p
                className={cn(
                  "text-body",
                  state === "upcoming" ? "text-ink-3" : "text-ink-2",
                )}
              >
                {step.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepMarker({
  state,
  index,
}: {
  state: "done" | "current" | "upcoming";
  index: number;
}) {
  if (state === "done") {
    return (
      <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-cream">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path
            d="m3.5 8.5 3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-900 text-caption font-semibold text-cream">
        {index}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-forest-900 opacity-30"
        />
      </span>
    );
  }
  return (
    <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-border-strong bg-bone text-caption font-semibold text-ink-3">
      {index}
    </span>
  );
}

function StateBadge({ state }: { state: "done" | "current" | "upcoming" }) {
  const { t } = useLanguage();
  if (state === "done") {
    return (
      <span className="inline-flex items-center rounded-pill bg-success-bg px-2 py-0.5 text-micro font-medium text-sage">
        {t("ticket.stateDone")}
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="inline-flex items-center rounded-pill bg-forest-900 px-2 py-0.5 text-micro font-medium text-cream">
        {t("ticket.stateCurrent")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill bg-cream-deep px-2 py-0.5 text-micro font-medium text-ink-3">
      {t("ticket.stateUpcoming")}
    </span>
  );
}
