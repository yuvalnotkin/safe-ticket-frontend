import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Native <details>/<summary>. Correct keyboard + a11y out of the box, zero
// JS. Chevron rotates via Tailwind's `open:` modifier. The question is set
// in the display serif per the editorial direction.

export type AccordionItemProps = {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function AccordionItem({
  question,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group border-b border-border last:border-b-0",
        className,
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-start",
          "font-display text-h4 font-medium text-ink",
          "hover:text-ink-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30",
          "marker:hidden [&::-webkit-details-marker]:hidden",
        )}
      >
        <span>{question}</span>
        <ChevronIcon className="mt-1 h-5 w-5 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-body-lg text-ink-2">{children}</div>
    </details>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-bone px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 8 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
