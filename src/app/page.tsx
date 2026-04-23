"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Editorial homepage in the Cloverly idiom:
//   Hero (2-col grid: copy left, dark hero card right with search over
//     concert photography)
//   Trust bar (forest band)
//   How it works (numbered editorial steps)
//   Closing refund note
//
// Every section restates the product's core promise (verified / face value
// / official transfer / escrow) — that repetition is load-bearing per
// CLAUDE.md rules, not decorative filler.

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <>
      <Hero query={query} setQuery={setQuery} onSubmit={onSearch} />
      <TrustBar />
      <HowItWorks />
      <ProvidersStrip />
      <RefundNote />
    </>
  );
}

function Hero({
  query,
  setQuery,
  onSubmit,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const { t } = useLanguage();
  return (
    <section className="bg-cream">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-16 px-6 py-24 md:px-12 md:py-32 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
            {t("home.eyebrow")}
          </span>
          <h1 className="font-display text-display-lg font-medium leading-[1.02] text-ink">
            {t("home.heroTitle")}
          </h1>
          <p className="max-w-[560px] text-body-lg text-ink-2">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex h-13 items-center rounded-md bg-ochre px-6 text-body font-medium text-white transition-colors hover:bg-ochre-deep focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
            >
              {t("home.searchCta")}
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-13 items-center rounded-md border border-border-strong bg-transparent px-6 text-body font-medium text-ink transition-colors hover:bg-bone focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
            >
              {t("nav.howItWorks")}
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl shadow-md">
          <Image
            src="/images/hero-concert.jpg"
            alt=""
            width={1200}
            height={900}
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/55 to-forest-950/92" />
          <div className="relative flex min-h-[360px] flex-col justify-between p-8 text-cream">
            <div>
              <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-on-dark-2">
                {t("home.searchCta")}
              </span>
              <h2 className="mt-3 font-display text-h2 font-medium leading-tight">
                {t("home.heroCardTitle")}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-1 rounded-md bg-bone/95 p-1.5"
              >
                <span className="ps-3 text-ink-3" aria-hidden="true">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  aria-label={t("home.searchPlaceholder")}
                  className="h-11 min-w-0 flex-1 bg-transparent px-2 text-body text-ink outline-none placeholder:text-ink-3"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 shrink-0 items-center rounded-md bg-ochre px-4 text-caption font-medium text-white transition-colors hover:bg-ochre-deep"
                >
                  {t("common.search")}
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {(["מכבי תל אביב", "הפועל", "עומר אדם", "שלמה ארצי"] as const).map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-pill border border-border-on-dark bg-white/10 px-3 py-1.5 text-caption text-ink-on-dark-2"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const { t } = useLanguage();
  const items = [
    { title: t("trust.faceValue"), sub: t("home.trustFaceValueShort") },
    { title: t("trust.escrow"), sub: t("home.trustEscrowShort") },
    { title: t("trust.officialTransfer"), sub: t("home.trustTransferShort") },
  ];
  return (
    <section className="bg-forest-900 py-10 text-cream md:py-12">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 md:grid-cols-3 md:gap-12 md:px-12">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <CheckCircleIcon className="mt-0.5 h-6 w-6 shrink-0 text-sage-soft" />
            <div className="flex flex-col gap-1">
              <p className="text-body font-medium">{item.title}</p>
              <p className="text-caption text-ink-on-dark-2">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    {
      n: "01",
      title: t("home.howItWorksStep1Title"),
      body: t("home.howItWorksStep1Body"),
    },
    {
      n: "02",
      title: t("home.howItWorksStep2Title"),
      body: t("home.howItWorksStep2Body"),
    },
    {
      n: "03",
      title: t("home.howItWorksStep3Title"),
      body: t("home.howItWorksStep3Body"),
    },
  ];
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {t("home.howItWorksEyebrow")}
        </span>
        <h2 className="mt-4 max-w-[680px] font-display text-display-md font-medium leading-tight text-ink">
          {t("home.howItWorksTitle")}
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-4 border-t border-forest-900 pt-6"
            >
              <span className="font-display text-caption tracking-wider text-ink-3">
                {s.n}
              </span>
              <h3 className="font-display text-h3 font-medium leading-tight text-ink">
                {s.title}
              </h3>
              <p className="text-body text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/search"
            className="inline-flex h-12 items-center rounded-md bg-forest-900 px-6 text-body font-medium text-cream transition-colors hover:bg-forest-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
          >
            {t("home.ctaBrowse")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProvidersStrip() {
  const { t } = useLanguage();
  const providers = ["ticketmaster", "leaan", "eventim", "hadran"] as const;
  return (
    <section className="border-y border-border bg-bone py-12">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 md:flex-row md:items-center md:gap-12 md:px-12">
        <p className="text-caption font-medium text-ink-3 md:max-w-[220px]">
          {t("home.providersIntro")}
        </p>
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {providers.map((p) => (
            <span
              key={p}
              className="font-display text-h4 font-medium text-ink"
            >
              {t(`providerName.${p}`)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function RefundNote() {
  const { t } = useLanguage();
  return (
    <section className="bg-cream py-10">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <p className="text-caption text-ink-3">{t("home.refundNote")}</p>
      </div>
    </section>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8 12 3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m14 14 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
