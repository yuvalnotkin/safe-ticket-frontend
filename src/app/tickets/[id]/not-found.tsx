"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function TicketNotFound() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-6 py-20 text-center md:py-28">
      <h1 className="font-display text-display-md font-medium text-ink">
        {t("ticket.notFoundTitle")}
      </h1>
      <p className="max-w-md text-body text-ink-2">
        {t("ticket.notFoundBody")}
      </p>
      <Link
        href="/search"
        className="mt-4 inline-flex h-13 items-center rounded-md bg-forest-900 px-6 text-body font-medium text-cream transition-colors hover:bg-forest-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
      >
        {t("ticket.backToSearch")}
      </Link>
    </main>
  );
}
