import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Uses native <details>/<summary>. Native gives correct keyboard + a11y
// semantics out of the box (Space/Enter toggle, screen-reader discloses
// state) with zero JS. The chevron rotates via open:rotate-180 on the
// summary element's open state (Tailwind v4's `open:` modifier).

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
        "group border-b border-navy-100 last:border-b-0",
        className,
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-start",
          "text-body-lg font-medium text-navy-900",
          "hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900",
          "marker:hidden [&::-webkit-details-marker]:hidden",
        )}
      >
        <span>{question}</span>
        <ChevronIcon className="mt-1 h-5 w-5 shrink-0 text-navy-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-body text-navy-700">{children}</div>
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
        "overflow-hidden rounded-lg border border-navy-100 bg-surface px-5",
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
