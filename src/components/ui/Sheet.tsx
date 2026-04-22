"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

// Mobile bottom-sheet. Slides up from the bottom of the viewport, fills most
// of the screen, dims the page behind it. Used for the filter panel on small
// screens (design_system.md spec: "slide-out or bottom sheet, not a cramped
// sidebar"). Keep non-modal styling simple; no focus-trap library in Phase 1
// — we rely on <dialog>-like behavior via Escape to close.

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  // Escape closes the sheet. Body scroll lock prevents the background from
  // scrolling under the sheet on iOS Safari.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-navy-950 transition-opacity duration-200",
          open ? "opacity-40" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl bg-surface shadow-lg",
          "transition-transform duration-200",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          {title && <h2 className="text-h3 text-navy-900">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-700 hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
              <path
                d="M5 5l10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-navy-100 bg-navy-50 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
