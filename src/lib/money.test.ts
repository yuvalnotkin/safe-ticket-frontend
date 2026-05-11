import { describe, it, expect } from "vitest";
import { agorotToShekel, formatPriceILS } from "./money";

describe("agorotToShekel", () => {
  it("converts whole shekels", () => {
    expect(agorotToShekel(25000)).toBe(250);
  });
  it("converts agorot with remainder", () => {
    expect(agorotToShekel(1234)).toBe(12.34);
  });
  it("returns 0 for 0", () => {
    expect(agorotToShekel(0)).toBe(0);
  });
  it("throws on negative", () => {
    expect(() => agorotToShekel(-1)).toThrow();
  });
  it("throws on non-integer", () => {
    expect(() => agorotToShekel(12.5)).toThrow();
  });
});

describe("formatPriceILS", () => {
  it("formats whole shekels in Hebrew with suffix", () => {
    const out = formatPriceILS(25000);
    expect(out).toContain("250");
    expect(out).toContain("₪");
    expect(out.indexOf("₪")).toBeGreaterThan(out.indexOf("250"));
  });
  it("preserves agorot remainder when present", () => {
    expect(formatPriceILS(1250)).toContain("12.50");
  });
  it("hides decimals for whole shekel values", () => {
    expect(formatPriceILS(25000)).not.toContain(".00");
  });
  it("formats 0 cleanly", () => {
    const out = formatPriceILS(0);
    expect(out).toContain("0");
  });
  it("supports en-US locale (prefix)", () => {
    const out = formatPriceILS(25000, "en-US");
    expect(out).toContain("250");
  });
  it("throws on negative input", () => {
    expect(() => formatPriceILS(-100)).toThrow();
  });
});
