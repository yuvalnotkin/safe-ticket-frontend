"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// HE ⇄ EN. Plain text toggle for the header (subtle), segmented control
// for the footer (more visible in the roomier spot).

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "he" ? "en" : "he")}
      aria-label={t("nav.languageToggleAria")}
      className={cn(
        "text-caption font-medium text-ink-2 transition-colors hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30 rounded",
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
        "px-3 py-1.5 text-caption font-medium transition-colors",
        language === v
          ? "bg-cream text-forest-900"
          : "text-cream/70 hover:text-cream",
      )}
    >
      {label}
    </button>
  );
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-md border border-border-on-dark",
        className,
      )}
    >
      {opt("he", "עברית")}
      {opt("en", "English")}
    </div>
  );
}
