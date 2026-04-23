"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Mobile bottom-sheet. Slides up from the bottom, fills up to 85dvh, dims
// the page behind it. Conditionally rendered (return null when !open) so
// there's no invisible scrim over the page when closed.
//
// Rendered via a portal into document.body. Without this, the Sheet sits
// inside whatever component invoked it — and an ancestor with
// `backdrop-filter` (the sticky Header uses `backdrop-blur-md`) creates
// a containing block for fixed-positioned descendants. That anchors
// `fixed inset-0` to the Header's box instead of the viewport, pushing
// most of the Sheet off-screen above. The portal escapes that.

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  // Portal target has to exist before we can render into it; gate on mount
  // so SSR and the first client paint match (both render nothing). setState
  // is deferred via setTimeout to avoid the React 19 sync-setState-in-effect
  // lint rule.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-forest-950 opacity-50 animate-[sheet-scrim_200ms_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-xl bg-bone shadow-lg animate-[sheet-slide_240ms_cubic-bezier(0.22,1,0.36,1)]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          {title && <h2 className="font-display text-h3 text-ink">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-2 hover:bg-cream focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
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
          <div className="border-t border-border bg-cream-deep px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
