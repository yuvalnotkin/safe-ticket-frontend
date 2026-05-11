"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Error boundary for /tickets/[id]. Anything other than the 400/404
// "not-available" path ends up here — network failures, server errors,
// unexpected response shapes. The user gets a retry button (re-runs the
// server fetch via `reset()`) and a way back to /search.
export default function TicketDetailsError({ reset }: { reset: () => void }) {
  const { t } = useLanguage();
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-6 py-20 text-center md:py-28">
      <h1 className="font-display text-display-md font-medium text-ink">
        {t("ticket.errorTitle")}
      </h1>
      <p className="max-w-md text-body text-ink-2">{t("ticket.errorBody")}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" onClick={() => reset()}>
          {t("common.retry")}
        </Button>
        <Link
          href="/search"
          className="link-underline text-caption font-medium text-ink-2"
        >
          {t("ticket.backToSearch")}
        </Link>
      </div>
    </main>
  );
}
