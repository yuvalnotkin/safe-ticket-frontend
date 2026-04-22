"use client";

import { useEffect } from "react";

// Mobile bottom-sheet. Slides up from the bottom of the viewport, fills up
// to 85vh, dims the page behind it. Used for the filter panel on /search
// and the mobile nav menu in the global Header (design_system.md: "slide-out
// or bottom sheet, not a cramped sidebar").
//
// The whole subtree is rendered only when `open=true`. That sidesteps a
// subtle interaction bug where a "closed" Sheet still covered the viewport
// with a pointer-events-auto child (pointer-events-none on the parent does
// not propagate to children) — the invisible scrim silently blocked clicks
// on every other page element. Conditional render = no subtree, no leak.

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  // Escape closes the sheet; body scroll lock prevents iOS Safari from
  // scrolling the page behind the sheet. Both only attach when open.
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy-950 opacity-40 animate-[sheet-scrim_200ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-xl bg-surface shadow-lg animate-[sheet-slide_220ms_ease-out]"
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
