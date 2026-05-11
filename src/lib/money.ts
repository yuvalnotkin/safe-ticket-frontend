export function agorotToShekel(agorot: number): number {
  if (!Number.isInteger(agorot)) {
    throw new Error(`agorotToShekel: expected integer, got ${agorot}`);
  }
  if (agorot < 0) {
    throw new Error(`agorotToShekel: expected non-negative, got ${agorot}`);
  }
  return agorot / 100;
}

export function formatPriceILS(agorot: number, locale: string = "he-IL"): string {
  if (agorot < 0) {
    throw new Error(`formatPriceILS: expected non-negative agorot, got ${agorot}`);
  }
  const shekels = agorotToShekel(agorot);
  const hasRemainder = agorot % 100 !== 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: hasRemainder ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(shekels);
}
