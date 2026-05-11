import { describe, it, expect } from "vitest";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToQuery,
  hasActiveFilters,
  type SearchFilters,
} from "./search-query";

function filters(overrides: Partial<SearchFilters> = {}): SearchFilters {
  return { ...EMPTY_FILTERS, ...overrides };
}

describe("EMPTY_FILTERS", () => {
  it("is inert: no fields active", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0);
  });
});

describe("hasActiveFilters / countActiveFilters", () => {
  it("query alone is active but not counted as a chip", () => {
    const f = filters({ query: "maccabi" });
    expect(hasActiveFilters(f)).toBe(true);
    expect(countActiveFilters(f)).toBe(0);
  });
  it("category != all counts", () => {
    expect(countActiveFilters(filters({ category: "sports" }))).toBe(1);
  });
  it("cities set counts as one chip regardless of size", () => {
    expect(
      countActiveFilters(filters({ cities: new Set(["Tel Aviv", "Haifa"]) })),
    ).toBe(1);
  });
  it("date range counts once even when both ends set", () => {
    expect(
      countActiveFilters(
        filters({ dateFrom: "2026-05-01", dateTo: "2026-06-01" }),
      ),
    ).toBe(1);
  });
  it("min OR max price counts as a chip", () => {
    expect(countActiveFilters(filters({ minPrice: 100 }))).toBe(1);
    expect(countActiveFilters(filters({ maxPrice: 500 }))).toBe(1);
  });
});

describe("filtersToQuery", () => {
  it("returns minimal query for EMPTY_FILTERS (only sort/page/limit)", () => {
    const q = filtersToQuery(EMPTY_FILTERS, {
      sort: "soonest",
      page: 1,
      limit: 20,
    });
    expect(q).toEqual({ sort: "soonest", page: 1, limit: 20 });
  });

  it("trims and forwards `q`", () => {
    const q = filtersToQuery(filters({ query: "  maccabi  " }), {
      sort: "soonest",
      page: 1,
      limit: 20,
    });
    expect(q.q).toBe("maccabi");
  });

  it("omits `q` when blank or whitespace-only", () => {
    const q = filtersToQuery(filters({ query: "   " }), {
      sort: "soonest",
      page: 1,
      limit: 20,
    });
    expect(q.q).toBeUndefined();
  });

  it("omits category when 'all'", () => {
    const q = filtersToQuery(filters({ category: "all" }), {
      sort: "soonest",
      page: 1,
      limit: 20,
    });
    expect(q.category).toBeUndefined();
  });

  it("forwards a real category", () => {
    const q = filtersToQuery(filters({ category: "culture" }), {
      sort: "soonest",
      page: 1,
      limit: 20,
    });
    expect(q.category).toBe("culture");
  });

  it("converts cities Set → sorted array, omits when empty", () => {
    const empty = filtersToQuery(EMPTY_FILTERS, { sort: "soonest", page: 1, limit: 20 });
    expect(empty.cities).toBeUndefined();

    const with2 = filtersToQuery(
      filters({ cities: new Set(["Haifa", "Tel Aviv"]) }),
      { sort: "soonest", page: 1, limit: 20 },
    );
    expect(with2.cities).toEqual(["Haifa", "Tel Aviv"]);
  });

  it("converts providers Set → array, omits when empty", () => {
    const empty = filtersToQuery(EMPTY_FILTERS, { sort: "soonest", page: 1, limit: 20 });
    expect(empty.providers).toBeUndefined();

    const with2 = filtersToQuery(
      filters({ providers: new Set(["eventim_il", "leaan"]) }),
      { sort: "soonest", page: 1, limit: 20 },
    );
    expect(with2.providers).toEqual(["eventim_il", "leaan"]);
  });

  it("forwards date range when set, omits otherwise", () => {
    const empty = filtersToQuery(EMPTY_FILTERS, { sort: "soonest", page: 1, limit: 20 });
    expect(empty.dateFrom).toBeUndefined();
    expect(empty.dateTo).toBeUndefined();

    const set = filtersToQuery(
      filters({ dateFrom: "2026-05-01", dateTo: "2026-06-01" }),
      { sort: "soonest", page: 1, limit: 20 },
    );
    expect(set.dateFrom).toBe("2026-05-01");
    expect(set.dateTo).toBe("2026-06-01");
  });

  it("converts minPrice/maxPrice from shekels to agorot integers", () => {
    const q = filtersToQuery(
      filters({ minPrice: 100, maxPrice: 500 }),
      { sort: "soonest", page: 1, limit: 20 },
    );
    expect(q.minPriceAgorot).toBe(10000);
    expect(q.maxPriceAgorot).toBe(50000);
  });

  it("rounds fractional shekel input to nearest agorot", () => {
    const q = filtersToQuery(
      filters({ minPrice: 12.345 }),
      { sort: "soonest", page: 1, limit: 20 },
    );
    // 12.345 ILS → 1234.5 agorot → rounded to 1235
    expect(q.minPriceAgorot).toBe(1235);
  });

  it("omits minPriceAgorot/maxPriceAgorot when null", () => {
    const q = filtersToQuery(EMPTY_FILTERS, { sort: "soonest", page: 1, limit: 20 });
    expect(q.minPriceAgorot).toBeUndefined();
    expect(q.maxPriceAgorot).toBeUndefined();
  });

  it("forwards sort, page, limit verbatim", () => {
    const q = filtersToQuery(EMPTY_FILTERS, {
      sort: "lowestPrice",
      page: 3,
      limit: 50,
    });
    expect(q.sort).toBe("lowestPrice");
    expect(q.page).toBe(3);
    expect(q.limit).toBe(50);
  });
});
