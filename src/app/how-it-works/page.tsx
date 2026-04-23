"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Five-step explainer — editorial numbered list, Cloverly-style. Each step
// is a card on the cream surface with a serif title, numbered eyebrow,
// and substantive body copy. The refund callout is a separate warm block.

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const steps = [
    { key: "connect", title: t("howItWorks.connectTitle"), body: t("howItWorks.connectBody") },
    { key: "verify",  title: t("howItWorks.verifyTitle"),  body: t("howItWorks.verifyBody")  },
    { key: "list",    title: t("howItWorks.listTitle"),    body: t("howItWorks.listBody")    },
    { key: "transfer", title: t("howItWorks.transferTitle"), body: t("howItWorks.transferBody") },
    { key: "pay",     title: t("howItWorks.payTitle"),     body: t("howItWorks.payBody")     },
  ];

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6 py-24 md:px-12 md:py-28">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
            {t("nav.howItWorks")}
          </span>
          <h1 className="font-display text-display-lg font-medium leading-tight text-ink">
            {t("howItWorks.title")}
          </h1>
          <p className="max-w-[680px] text-body-lg text-ink-2">
            {t("howItWorks.intro")}
          </p>
        </div>
      </section>

      <section className="bg-bone border-y border-border py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
          <ol className="flex flex-col gap-6">
            {steps.map((s, i) => (
              <li
                key={s.key}
                className="grid gap-5 border-t border-forest-900 pt-8 md:grid-cols-[80px_1fr] md:gap-10"
              >
                <div className="font-display text-display-md font-medium leading-none text-forest-900">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="font-display text-h2 font-medium leading-tight text-ink">
                    {s.title}
                  </h2>
                  <p className="max-w-[68ch] text-body-lg text-ink-2">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 md:px-12">
          <div className="rounded-lg border border-ochre/30 bg-warning-bg p-8">
            <h2 className="font-display text-h2 font-medium leading-tight text-ink">
              {t("howItWorks.refundTitle")}
            </h2>
            <p className="mt-3 max-w-[68ch] text-body-lg text-ink-2">
              {t("howItWorks.refundBody")}
            </p>
          </div>
          <div>
            <Link
              href="/search"
              className="inline-flex h-13 items-center rounded-md bg-ochre px-6 text-body font-medium text-white transition-colors hover:bg-ochre-deep focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
            >
              {t("howItWorks.cta")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
