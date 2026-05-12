// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import BuyerDashboardPage from "./buyer/page";
import SellerDashboardPage from "./seller/page";
import heDict from "@/lib/i18n/dictionaries/he.json";
import enDict from "@/lib/i18n/dictionaries/en.json";

// Identity-translator so we can assert on translation keys rather than copy.
// Locks in the i18n keys: if a key drops out of the dictionary the missing
// path is caught by TranslationKey's compile-time narrowing.
vi.mock("@/lib/i18n/LanguageProvider", () => ({
  useLanguage: () => ({
    t: (k: string) => k,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

afterEach(() => cleanup());

describe("BuyerDashboardPage shell", () => {
  it("renders the buyer empty-state copy keys", () => {
    render(<BuyerDashboardPage />);
    expect(screen.getByText("dashboard.buyerTitle")).toBeTruthy();
    expect(screen.getByText("dashboard.buyerHeading")).toBeTruthy();
    expect(screen.getByText("dashboard.buyerBody")).toBeTruthy();
    expect(screen.getByText("dashboard.browseCta")).toBeTruthy();
  });
});

describe("SellerDashboardPage shell", () => {
  it("renders the seller empty-state copy keys", () => {
    render(<SellerDashboardPage />);
    expect(screen.getByText("dashboard.sellerTitle")).toBeTruthy();
    expect(screen.getByText("dashboard.sellerHeading")).toBeTruthy();
    expect(screen.getByText("dashboard.sellerBody")).toBeTruthy();
    expect(screen.getByText("dashboard.browseCta")).toBeTruthy();
  });
});

describe("dashboard i18n parity", () => {
  it("Hebrew and English dictionaries define the same dashboard.* keys", () => {
    const heKeys = Object.keys((heDict as { dashboard?: Record<string, string> }).dashboard ?? {}).sort();
    const enKeys = Object.keys((enDict as { dashboard?: Record<string, string> }).dashboard ?? {}).sort();
    expect(enKeys).toEqual(heKeys);
  });

  it("Hebrew and English dictionaries define the same profile.* keys", () => {
    const heKeys = Object.keys((heDict as { profile?: Record<string, string> }).profile ?? {}).sort();
    const enKeys = Object.keys((enDict as { profile?: Record<string, string> }).profile ?? {}).sort();
    expect(enKeys).toEqual(heKeys);
  });
});
