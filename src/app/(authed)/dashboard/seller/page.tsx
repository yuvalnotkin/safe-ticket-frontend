"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Phase 2 deliverable: an auth-gated empty-state shell only. No mock data,
// no fake listing rows. The real seller surface (connect provider, list at
// face value, payouts) arrives in Phase 3.

export default function SellerDashboardPage() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-4 py-10 md:px-12 md:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-h1 font-medium leading-tight text-ink">
          {t("dashboard.sellerTitle")}
        </h1>
      </header>

      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong bg-bone p-12 text-center">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {t("dashboard.sellerEyebrow")}
        </span>
        <h2 className="font-display text-h2 font-medium text-ink">
          {t("dashboard.sellerHeading")}
        </h2>
        <p className="max-w-md text-body text-ink-2">
          {t("dashboard.sellerBody")}
        </p>
        <Link
          href="/search"
          className="mt-2 inline-flex h-11 items-center rounded-md border border-forest-900 px-5 text-small font-medium text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
        >
          {t("dashboard.browseCta")}
        </Link>
      </div>
    </section>
  );
}
