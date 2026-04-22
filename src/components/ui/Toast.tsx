"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// Simple transient notifications. Used wherever Phase 1 surfaces a
// "not yet available" or "coming soon" state (login submit, Buy CTA).
// Toasts stack at bottom-center on mobile, bottom-start on desktop; each
// auto-dismisses after 4s and can be dismissed by click.
//
// Not a portal in Phase 1 — the viewer lives at the bottom of <body>
// inside layout.tsx; z-50 keeps it above page content and the Sheet.

type ToastTone = "info" | "success" | "warning";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  show: (message: string, opts?: { tone?: ToastTone; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastContextValue["show"]>(
    (message, opts) => {
      const id = ++nextId.current;
      const tone = opts?.tone ?? "info";
      const durationMs = opts?.durationMs ?? DEFAULT_DURATION_MS;
      setToasts((prev) => [...prev, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 mx-auto flex w-full max-w-sm flex-col items-center gap-2 px-4 md:bottom-6 md:items-start md:ps-6"
      >
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-md px-4 py-3 text-start text-body shadow-md",
              "transition-transform duration-150",
              TONE_CLASSES[t.tone],
            )}
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TONE_CLASSES: Record<ToastTone, string> = {
  info: "bg-navy-900 text-white",
  success: "bg-green-700 text-white",
  warning: "bg-warning-bg text-warning border border-warning",
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
