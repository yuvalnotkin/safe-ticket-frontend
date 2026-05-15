"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// Phase 2 deliverable: an auth-gated empty-state shell only. No mock data,
// no fake listing rows. The real seller surface (connect provider, list at
// face value, payouts) arrives in Phase 3.

export default function SellerDashboardPage() {
  const { t } = useLanguage();

  return (
    <DashboardShell
      eyebrow={t("nav.sellerDashboard")}
      title={t("dashboard.sellerTitle")}
      subtitle={t("dashboard.sellerSubtitle")}
      empty={{
        eyebrow: t("dashboard.sellerEyebrow"),
        heading: t("dashboard.sellerHeading"),
        body: t("dashboard.sellerBody"),
        cta: { href: "/search", label: t("dashboard.browseCta") },
        icon: <ListIcon />,
      }}
      preview={{
        eyebrow: t("dashboard.previewEyebrow"),
        items: [
          {
            icon: <PlugIcon />,
            title: t("dashboard.sellerPreview1Title"),
            body: t("dashboard.sellerPreview1Body"),
          },
          {
            icon: <TagIcon />,
            title: t("dashboard.sellerPreview2Title"),
            body: t("dashboard.sellerPreview2Body"),
          },
          {
            icon: <PayoutIcon />,
            title: t("dashboard.sellerPreview3Title"),
            body: t("dashboard.sellerPreview3Body"),
          },
        ],
      }}
    />
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M9 4v3m6-3v3M7 7h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7Zm5 9v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M3 12V4h8l10 10-8 8L3 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PayoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
