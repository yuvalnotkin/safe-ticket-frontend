"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui/Sheet";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// Global site header. Sticky on scroll. Desktop shows nav inline; mobile
// collapses it into a sheet (the same Sheet component used on /search).
// "search" on desktop is a full input stub that navigates on submit;
// on mobile it's a magnifier icon that routes to /search.

export function Header() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // Force-close the mobile nav when the viewport is ≥md (768px). The
  // hamburger trigger is `md:hidden`, so once the menu is open and the
  // user resizes up — or HMR / back-forward cache preserves menuOpen=true
  // across a viewport-size change — there'd otherwise be no way to close
  // it. Initial check is deferred via setTimeout so setState isn't called
  // synchronously inside the effect body (React 19 lint rule).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) close();
    };
    const id = mq.matches ? window.setTimeout(close, 0) : 0;
    mq.addEventListener("change", onChange);
    return () => {
      window.clearTimeout(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const navLinks: Array<{ label: string; href: string }> = [
    { label: t("nav.browse"), href: "/search" },
    { label: t("nav.howItWorks"), href: "/how-it-works" },
    { label: t("nav.faq"), href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-4 px-4 py-3 md:gap-6 md:px-6">
        <Link
          href="/"
          className="font-display text-h3 font-bold text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        >
          {t("common.appName")}
        </Link>

        <nav className="hidden flex-1 items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-small font-medium text-navy-700 transition-colors hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-small font-medium text-navy-700 hover:text-navy-900"
          >
            {t("nav.login")}
          </Link>
          <LanguageToggle />
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-md bg-green-700 px-4 text-small font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            {t("nav.sell")}
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="ms-auto flex items-center gap-2 md:hidden">
          <Link
            href="/search"
            aria-label={t("nav.searchAria")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-700 hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <SearchIcon />
          </Link>
          <LanguageToggle />
          <button
            type="button"
            aria-label={t("nav.menuAria")}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-navy-700 hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <Sheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t("common.appName")}
      >
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-body-lg font-medium text-navy-900 hover:bg-navy-50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-3 text-body-lg font-medium text-navy-900 hover:bg-navy-50"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "mt-4 inline-flex h-12 items-center justify-center rounded-md",
              "bg-green-700 text-body font-medium text-white transition-colors hover:bg-green-800",
            )}
          >
            {t("nav.sell")}
          </Link>
        </nav>
      </Sheet>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
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

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
      <path
        d="M3 6h14M3 10h14M3 14h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
