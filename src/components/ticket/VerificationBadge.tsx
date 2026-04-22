"use client";

import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Green-tinted, pill-shaped, shield icon. Appears on every ticket card
// and the ticket details page. Copy is translated — never hardcoded.
// design_system.md §7: reads as reassuring, not decorative.

export function VerificationBadge() {
  const { t } = useLanguage();
  return (
    <Badge tone="trust" leadingIcon={<ShieldIcon />}>
      {t("trust.verified")}
    </Badge>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
