"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// HE ⇄ EN toggle. Plain button on compact surfaces (header), a proper
// segmented control for the footer's roomier spot.

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "he" ? "en" : "he")}
      aria-label={t("nav.languageToggleAria")}
      className={cn(
        "text-small font-semibold text-navy-700 transition-colors hover:text-navy-900",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900",
        className,
      )}
    >
      {language === "he" ? "EN" : "עברית"}
    </button>
  );
}

export function LanguageToggleSegmented({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const opt = (v: "he" | "en", label: string) => (
    <button
      type="button"
      key={v}
      onClick={() => setLanguage(v)}
      aria-pressed={language === v}
      className={cn(
        "px-3 py-1.5 text-small font-medium transition-colors",
        language === v
          ? "bg-navy-900 text-white"
          : "text-navy-700 hover:text-navy-900",
      )}
    >
      {label}
    </button>
  );
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-md border border-navy-200",
        className,
      )}
    >
      {opt("he", "עברית")}
      {opt("en", "English")}
    </div>
  );
}
