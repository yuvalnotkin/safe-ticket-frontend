"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Five-step explainer. Connect → Verify → List → Transfer → Pay. Each
// step has a numbered marker + icon on an inverted navy surface so the
// sequence reads as a single trust narrative rather than a grid of cards.
// Metadata lives in page-metadata.ts (sibling file) because this page is
// marked "use client".

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    {
      key: "connect",
      icon: <LinkIcon />,
      title: t("howItWorks.connectTitle"),
      body: t("howItWorks.connectBody"),
    },
    {
      key: "verify",
      icon: <ShieldIcon />,
      title: t("howItWorks.verifyTitle"),
      body: t("howItWorks.verifyBody"),
    },
    {
      key: "list",
      icon: <TagIcon />,
      title: t("howItWorks.listTitle"),
      body: t("howItWorks.listBody"),
    },
    {
      key: "transfer",
      icon: <TransferIcon />,
      title: t("howItWorks.transferTitle"),
      body: t("howItWorks.transferBody"),
    },
    {
      key: "pay",
      icon: <CoinIcon />,
      title: t("howItWorks.payTitle"),
      body: t("howItWorks.payBody"),
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-navy-50 to-bg">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-16 md:py-20">
          <h1 className="font-display text-display text-navy-900">
            {t("howItWorks.title")}
          </h1>
          <p className="max-w-2xl text-body-lg text-navy-700">
            {t("howItWorks.intro")}
          </p>
        </div>
      </section>

      <section className="bg-navy-900 py-16 text-white md:py-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6">
          <ol className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <li
                key={s.key}
                className={cn(
                  "grid grid-cols-[auto_1fr] items-start gap-5 rounded-lg border border-navy-700 bg-navy-800 p-6",
                  "md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-8",
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-display font-bold text-green-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-start-1 col-end-3 flex flex-col gap-2 md:col-start-2 md:col-end-3">
                  <h2 className="text-h2 font-bold">{s.title}</h2>
                  <p className="text-body-lg text-navy-100">{s.body}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden h-16 w-16 items-center justify-center rounded-md bg-green-700 text-white md:inline-flex"
                >
                  {s.icon}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-bg py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6">
          <div className="rounded-lg border border-warning/30 bg-warning-bg p-6">
            <h2 className="text-h3 font-semibold text-navy-900">
              {t("howItWorks.refundTitle")}
            </h2>
            <p className="mt-2 text-body text-navy-800">
              {t("howItWorks.refundBody")}
            </p>
          </div>
          <div>
            <Link
              href="/search"
              className="inline-flex h-12 items-center rounded-md bg-navy-900 px-6 text-body font-medium text-white transition-colors hover:bg-navy-800"
            >
              {t("howItWorks.cta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function LinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
        stroke="currentColor"
        strokeWidth="1.75"
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

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2H5v7l13 13 7-7-13-13z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8h14m0 0-4-4m4 4-4 4M20 16H6m0 0 4 4m-4-4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9.5 9a2.5 2.5 0 0 1 2.5-1.5c1.4 0 2.5.9 2.5 2 0 .9-.7 1.5-2 1.8-1.5.3-3 1-3 2.2 0 1.1 1.1 2 2.5 2a2.5 2.5 0 0 0 2.5-1.5M12 6v12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
