"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { TicketCard } from "@/components/ticket/TicketCard";
import { MOCK_TICKETS } from "@/lib/mock-data";

// Cloverly-style editorial homepage. Sections alternate cream / bone /
// forest so the page has real scrolling rhythm and a strong forest
// "tundra" break in the middle carrying the trust promise.
//
// Flow (top → bottom):
//   Hero (cream + embedded forest hero card)
//   Trust indicators (cream, sage accents)
//   Featured tickets grid
//   FOREST TUNDRA — How it works (big serif headline, cream on forest-900)
//   Testimonial quote (cream)
//   Seller CTA (bone)
//   Providers strip (cream, small text)
//   Closing refund note (cream)
//   Footer (forest — lives in layout.tsx)

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
      <TrustIndicators />
      <FeaturedTickets />
      <HowItWorksTundra />
      <Testimonial />
      <SellerCta />
      <ProvidersStrip />
      <RefundNote />
    </>
  );
}

// Hero quick-search chips. Query stays in Hebrew because mock event
// data is Hebrew-only; the label switches per active language so the
// English UI doesn't leak Hebrew strings.
const HERO_CHIPS = [
  { query: "מכבי תל אביב", he: "מכבי תל אביב", en: "Maccabi Tel Aviv" },
  { query: "הפועל", he: "הפועל", en: "Hapoel" },
  { query: "עומר אדם", he: "עומר אדם", en: "Omer Adam" },
  { query: "שלמה ארצי", he: "שלמה ארצי", en: "Shlomo Artzi" },
] as const;

function Hero({
  query,
  setQuery,
  onSubmit,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const { t, language } = useLanguage();
  return (
    <section className="bg-cream">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
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
                {HERO_CHIPS.map((chip) => (
                  <Link
                    key={chip.query}
                    href={`/search?q=${encodeURIComponent(chip.query)}`}
                    className="rounded-pill border border-border-on-dark bg-white/10 px-3 py-1.5 text-caption text-ink-on-dark-2 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
                  >
                    {language === "he" ? chip.he : chip.en}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustIndicators() {
  const { t } = useLanguage();
  const items = [
    { title: t("trust.faceValue"),        sub: t("home.trustFaceValueShort") },
    { title: t("trust.escrow"),           sub: t("home.trustEscrowShort") },
    { title: t("trust.officialTransfer"), sub: t("home.trustTransferShort") },
  ];
  // Light trust strip on cream — the big forest "tundra" lives further
  // down. Keeping this cream prevents two dark blocks back-to-back.
  return (
    <section className="border-y border-border bg-bone py-8 md:py-10">
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 px-6 md:grid-cols-3 md:gap-12 md:px-12">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
            <div className="flex flex-col gap-0.5">
              <p className="text-body font-medium text-ink">{item.title}</p>
              <p className="text-caption text-ink-3">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedTickets() {
  const { t } = useLanguage();
  // Four hand-picked tickets across categories + cities. Clicking any
  // card routes to its details page; the grid item matches the TicketCard
  // from /search so the visual language is consistent everywhere.
  const featured = [
    MOCK_TICKETS.find((x) => x.id === "t-003"),
    MOCK_TICKETS.find((x) => x.id === "t-013"),
    MOCK_TICKETS.find((x) => x.id === "t-006"),
    MOCK_TICKETS.find((x) => x.id === "t-008"),
  ].filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
              {t("home.featuredEyebrow")}
            </span>
            <h2 className="max-w-[680px] font-display text-display-md font-medium leading-tight text-ink">
              {t("home.featuredTitle")}
            </h2>
            <p className="max-w-[620px] text-body-lg text-ink-2">
              {t("home.featuredSub")}
            </p>
          </div>
          <Link
            href="/search"
            className="link-underline self-start text-small font-medium text-ink md:self-end"
          >
            {t("home.featuredViewAll")} →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksTundra() {
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
  // Tundra section per design_system.md §3 — deep-green dark break with
  // a big serif headline in cream. This is the main forest block on the
  // homepage, giving the page the strong visual rhythm Cloverly has.
  return (
    <section className="bg-forest-900 py-24 text-cream md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-sage-soft">
          {t("home.howItWorksEyebrow")}
        </span>
        <h2 className="mt-4 max-w-[760px] font-display text-display-lg font-medium leading-[1.04] text-cream">
          {t("home.howItWorksTitle")}
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-4 border-t border-cream/25 pt-6"
            >
              <span className="font-display text-display-md font-medium leading-none text-sage-soft">
                {s.n}
              </span>
              <h3 className="font-display text-h2 font-medium leading-tight text-cream">
                {s.title}
              </h3>
              <p className="text-body-lg text-ink-on-dark-2">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="inline-flex h-13 items-center rounded-md bg-ochre px-6 text-body font-medium text-white transition-colors hover:bg-ochre-deep focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/40"
          >
            {t("home.ctaBrowse")} →
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex h-13 items-center rounded-md border border-cream/30 px-6 text-body font-medium text-cream transition-colors hover:bg-cream/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/40"
          >
            {t("nav.howItWorks")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  const { t } = useLanguage();
  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="mx-auto w-full max-w-[900px] px-6 md:px-12">
        <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
          {t("home.testimonialEyebrow")}
        </span>
        <blockquote className="mt-6 font-display text-h1 font-medium leading-[1.2] text-ink md:text-[40px]">
          “{t("home.testimonialQuote")}”
        </blockquote>
        <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-900 font-display text-h3 font-medium text-cream">
            {t("home.testimonialAuthor").charAt(0)}
          </span>
          <div className="flex flex-col">
            <span className="text-body font-medium text-ink">
              {t("home.testimonialAuthor")}
            </span>
            <span className="text-caption text-ink-3">
              {t("home.testimonialContext")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SellerCta() {
  const { t } = useLanguage();
  return (
    <section className="bg-bone border-y border-border py-24 md:py-28">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16 md:px-12">
        <div className="flex flex-col gap-5">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
            {t("home.sellerEyebrow")}
          </span>
          <h2 className="whitespace-pre-line font-display text-display-md font-medium leading-tight text-ink">
            {t("home.sellerTitle")}
          </h2>
          <p className="max-w-[560px] text-body-lg text-ink-2">
            {t("home.sellerBody")}
          </p>
          <div>
            <Link
              href="/login"
              className="inline-flex h-13 items-center rounded-md bg-forest-900 px-6 text-body font-medium text-cream transition-colors hover:bg-forest-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30"
            >
              {t("home.sellerCta")} →
            </Link>
          </div>
        </div>
        <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-xl bg-forest-900 p-8 text-cream shadow-md md:aspect-[5/6]">
          <Image
            src="/images/stadium.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 500px, 100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-forest-950/10" />
          <div className="relative flex max-w-xs flex-col gap-2">
            <span className="text-micro font-medium uppercase tracking-[0.12em] text-sage-soft">
              {t("trust.faceValue")}
            </span>
            <p className="font-display text-h2 font-medium leading-tight text-cream">
              {t("trust.verifiedBadge")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProvidersStrip() {
  const { t } = useLanguage();
  const providers = ["ticketmaster", "leaan", "eventim", "hadran"] as const;
  return (
    <section className="bg-cream py-14">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 md:flex-row md:items-center md:gap-12 md:px-12">
        <p className="text-caption font-medium uppercase tracking-[0.12em] text-ink-3 md:max-w-[220px]">
          {t("home.providersIntro")}
        </p>
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {providers.map((p) => (
            <span
              key={p}
              className="font-display text-h3 font-medium text-ink"
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
    <section className="bg-cream pb-16">
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
