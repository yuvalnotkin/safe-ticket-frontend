"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

// Phase 2 deliverable: an auth-gated empty-state shell only. No mock data,
// no fake purchase rows, no skeleton-pretending-to-be-data — the real buyer
// surface arrives in Phase 4 (purchases list, transfer status, escrow).

export default function BuyerDashboardPage() {
  const { t } = useLanguage();

  return (
    <DashboardShell
      eyebrow={t("nav.buyerDashboard")}
      title={t("dashboard.buyerTitle")}
      subtitle={t("dashboard.buyerSubtitle")}
      empty={{
        eyebrow: t("dashboard.buyerEyebrow"),
        heading: t("dashboard.buyerHeading"),
        body: t("dashboard.buyerBody"),
        cta: { href: "/search", label: t("dashboard.browseCta") },
        icon: <TicketIcon />,
      }}
      preview={{
        eyebrow: t("dashboard.previewEyebrow"),
        items: [
          {
            icon: <ReceiptIcon />,
            title: t("dashboard.buyerPreview1Title"),
            body: t("dashboard.buyerPreview1Body"),
          },
          {
            icon: <TransferIcon />,
            title: t("dashboard.buyerPreview2Title"),
            body: t("dashboard.buyerPreview2Body"),
          },
          {
            icon: <ShieldIcon />,
            title: t("dashboard.buyerPreview3Title"),
            body: t("dashboard.buyerPreview3Body"),
          },
        ],
      }}
    />
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 7v10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path d="M4 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m13 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m11 20-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
