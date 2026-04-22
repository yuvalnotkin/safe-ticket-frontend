"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Visualizes the four-step escrow flow: payment → transfer initiated →
// buyer confirms receipt → seller paid. On the /tickets/[id] page it
// shows the steps as "what will happen after you buy" (all upcoming).
// Phase 4 will hook real state in; the component accepts a `currentStep`
// index so the same visual handles every runtime state.
//
// Step states:
//   - done     (index < currentStep) — check icon, green
//   - current  (index === currentStep) — pulsing dot, navy
//   - upcoming (index > currentStep) — empty circle, muted

export type TransactionTimelineProps = {
  /** 0-based index of the currently active step. -1 means no step active yet (all upcoming). */
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
                  state === "done" ? "bg-green-700" : "bg-navy-100",
                )}
              />
            )}
            <StepMarker state={state} index={i + 1} />
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "text-body font-semibold",
                    state === "upcoming" ? "text-navy-500" : "text-navy-900",
                  )}
                >
                  {step.title}
                </h3>
                <StateBadge state={state} />
              </div>
              <p
                className={cn(
                  "text-small",
                  state === "upcoming" ? "text-navy-400" : "text-navy-700",
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
      <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
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
      <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-small font-semibold text-white">
        {index}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-navy-900 opacity-30"
        />
      </span>
    );
  }
  return (
    <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-navy-200 bg-surface text-small font-semibold text-navy-400">
      {index}
    </span>
  );
}

function StateBadge({ state }: { state: "done" | "current" | "upcoming" }) {
  const { t } = useLanguage();
  if (state === "done") {
    return (
      <span className="inline-flex items-center rounded-pill bg-green-100 px-2 py-0.5 text-caption font-medium text-green-800">
        {t("ticket.stateDone")}
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="inline-flex items-center rounded-pill bg-navy-100 px-2 py-0.5 text-caption font-medium text-navy-800">
        {t("ticket.stateCurrent")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill bg-navy-50 px-2 py-0.5 text-caption font-medium text-navy-500">
      {t("ticket.stateUpcoming")}
    </span>
  );
}
