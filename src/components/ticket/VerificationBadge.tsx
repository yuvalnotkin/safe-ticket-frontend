"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Per the refreshed design direction, the "verified" signal now reads as a
// fact rather than a sticker: inline sage-colored checkmark + word, no pill
// background. Appears on every ticket card and the details page.

export function VerificationBadge() {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 text-caption font-medium text-sage">
      <CheckIcon className="h-4 w-4" />
      <span>{t("trust.verified")}</span>
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.5 10 2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
