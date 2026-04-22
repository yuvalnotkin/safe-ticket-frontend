"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// The homepage is the narrative: hero → trust pillars → how it works →
// footer. Every section restates the product's core promise (verified,
// face value, official transfer, escrow) — that repetition is load-bearing
// per CLAUDE.md rules, not fluff. Copy is Hebrew-first through useLanguage.

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
      <HomeHeader />
      <main className="flex flex-1 flex-col">
        <Hero query={query} setQuery={setQuery} onSubmit={onSearch} />
        <TrustPillars />
        <HowItWorks />
        <RefundNote />
      </main>
      <HomeFooter />
    </>
  );
}

function HomeHeader() {
  const { t, language, setLanguage } = useLanguage();
  return (
    <header className="border-b border-navy-100 bg-surface">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-h3 font-bold text-navy-900">
          {t("common.appName")}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === "he" ? "en" : "he")}
            className="text-small font-medium text-navy-700 hover:text-navy-900"
          >
            {language === "he" ? "EN" : "עברית"}
          </button>
          <Link
            href="/search"
            className="text-small font-medium text-navy-700 hover:text-navy-900"
          >
            {t("home.ctaBrowse")}
          </Link>
          <Button variant="trust" size="sm">
            {t("common.list")}
          </Button>
        </div>
      </div>
    </header>
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
    <section className="border-b border-navy-100 bg-gradient-to-b from-navy-50 to-bg">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-16 md:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="font-display text-display text-navy-900">
            {t("home.heroTitle")}
          </h1>
          <p className="text-body-lg text-navy-700">{t("home.heroSubtitle")}</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-2xl flex-col gap-3 md:flex-row"
        >
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t("home.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leadingIcon={<SearchIcon />}
              aria-label={t("home.searchPlaceholder")}
            />
          </div>
          <Button type="submit" size="lg">
            {t("home.searchCta")}
          </Button>
        </form>
        <QuickTrustRow />
      </div>
    </section>
  );
}

function QuickTrustRow() {
  const { t } = useLanguage();
  const items = [
    t("trust.verified"),
    t("trust.faceValue"),
    t("trust.officialTransfer"),
    t("trust.escrow"),
  ];
  return (
    <div className="flex flex-wrap items-center gap-3 text-small text-navy-700">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckIcon className="h-4 w-4 text-green-700" />
            {item}
          </span>
          {i < items.length - 1 && (
            <span aria-hidden="true" className="text-navy-300">
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function TrustPillars() {
  const { t } = useLanguage();
  const pillars = [
    {
      icon: <ShieldIcon />,
      title: t("home.trustVerifiedTitle"),
      body: t("home.trustVerifiedBody"),
    },
    {
      icon: <TagIcon />,
      title: t("home.trustFaceValueTitle"),
      body: t("home.trustFaceValueBody"),
    },
    {
      icon: <TransferIcon />,
      title: t("home.trustOfficialTransferTitle"),
      body: t("home.trustOfficialTransferBody"),
    },
    {
      icon: <LockIcon />,
      title: t("home.trustEscrowTitle"),
      body: t("home.trustEscrowBody"),
    },
  ];
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h2 className="mb-8 text-h1 font-bold text-navy-900">
          {t("home.trustIntro")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-3 rounded-lg border border-navy-100 bg-bg p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-100 text-green-700">
                {p.icon}
              </span>
              <h3 className="text-h3 font-semibold text-navy-900">{p.title}</h3>
              <p className="text-body text-navy-700">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    {
      title: t("home.howItWorksStep1Title"),
      body: t("home.howItWorksStep1Body"),
    },
    {
      title: t("home.howItWorksStep2Title"),
      body: t("home.howItWorksStep2Body"),
    },
    {
      title: t("home.howItWorksStep3Title"),
      body: t("home.howItWorksStep3Body"),
    },
  ];
  return (
    <section className="bg-navy-900 py-16 text-white md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h2 className="mb-10 font-display text-h1 font-bold">
          {t("home.howItWorksTitle")}
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col gap-3 rounded-lg border border-navy-700 bg-navy-800 p-6"
            >
              <span className="font-display text-h1 font-bold text-green-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 font-semibold">{s.title}</h3>
              <p className="text-body text-navy-100">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link
            href="/search"
            className="inline-flex h-12 items-center rounded-md bg-green-700 px-6 text-body font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("home.ctaBrowse")} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function RefundNote() {
  const { t } = useLanguage();
  return (
    <section className="bg-bg py-8">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <p className="text-small text-navy-500">{t("home.refundNote")}</p>
      </div>
    </section>
  );
}

function HomeFooter() {
  const { t } = useLanguage();
  const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.browse"), href: "/search" },
        { label: t("footer.sell"), href: "#" },
        { label: t("footer.howItWorks"), href: "#" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.faq"), href: "#" },
        { label: t("footer.contact"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.terms"), href: "#" },
        { label: t("footer.privacy"), href: "#" },
      ],
    },
  ];
  return (
    <footer className="border-t border-navy-100 bg-surface py-10">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-2">
          <span className="font-display text-h3 font-bold text-navy-900">
            {t("common.appName")}
          </span>
          <p className="text-small text-navy-600">{t("footer.tagline")}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-small font-semibold text-navy-900">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-small text-navy-600 hover:text-navy-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1200px] border-t border-navy-100 px-6 pt-6">
        <p className="text-caption text-navy-500">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}

function SearchIcon({ className }: { className?: string } = {}) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="m14 14 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5 10 3.5 3.5L15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
        fill="currentColor"
        fillOpacity="0.15"
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
