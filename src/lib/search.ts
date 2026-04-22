import type { Ticket, EventCategory, TicketProvider } from "./types";

// Pure filter + sort logic. Kept out of React so the behavior is easy to
// test later and the UI components stay thin.

export type SortKey = "soonest" | "lowestPrice" | "newest";

export type SearchFilters = {
  query: string;
  category: "all" | EventCategory;
  cities: ReadonlySet<string>;
  providers: ReadonlySet<TicketProvider>;
  dateFrom: string; // "" means unset; "YYYY-MM-DD" otherwise
  dateTo: string;
  minPrice: number | null;
  maxPrice: number | null;
};

export const EMPTY_FILTERS: SearchFilters = {
  query: "",
  category: "all",
  cities: new Set(),
  providers: new Set(),
  dateFrom: "",
  dateTo: "",
  minPrice: null,
  maxPrice: null,
};

export function hasActiveFilters(f: SearchFilters): boolean {
  return (
    f.query.trim().length > 0 ||
    f.category !== "all" ||
    f.cities.size > 0 ||
    f.providers.size > 0 ||
    f.dateFrom !== "" ||
    f.dateTo !== "" ||
    f.minPrice !== null ||
    f.maxPrice !== null
  );
}

export function countActiveFilters(f: SearchFilters): number {
  let n = 0;
  if (f.category !== "all") n++;
  if (f.cities.size > 0) n++;
  if (f.providers.size > 0) n++;
  if (f.dateFrom !== "" || f.dateTo !== "") n++;
  if (f.minPrice !== null || f.maxPrice !== null) n++;
  return n;
}

// AND across filter types; OR within (city = TA OR Haifa, and provider = X).
// Per PHASE_1_PLAN.md 1.2 — filters combine correctly.
export function filterTickets(
  tickets: ReadonlyArray<Ticket>,
  f: SearchFilters,
): Ticket[] {
  const q = f.query.trim().toLowerCase();

  return tickets.filter((t) => {
    if (q) {
      const haystack =
        `${t.event.name} ${t.event.venue} ${t.event.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.category !== "all" && t.event.category !== f.category) return false;
    if (f.cities.size > 0 && !f.cities.has(t.event.city)) return false;
    if (f.providers.size > 0 && !f.providers.has(t.provider)) return false;

    if (f.dateFrom || f.dateTo) {
      const eventDay = t.event.date.slice(0, 10); // "YYYY-MM-DD"
      if (f.dateFrom && eventDay < f.dateFrom) return false;
      if (f.dateTo && eventDay > f.dateTo) return false;
    }

    const total = t.price.faceValue + t.price.serviceFee;
    if (f.minPrice !== null && total < f.minPrice) return false;
    if (f.maxPrice !== null && total > f.maxPrice) return false;

    return true;
  });
}

export function sortTickets(
  tickets: ReadonlyArray<Ticket>,
  sort: SortKey,
): Ticket[] {
  const copy = [...tickets];
  switch (sort) {
    case "soonest":
      return copy.sort(
        (a, b) =>
          new Date(a.event.date).getTime() - new Date(b.event.date).getTime(),
      );
    case "lowestPrice":
      return copy.sort(
        (a, b) =>
          a.price.faceValue +
          a.price.serviceFee -
          (b.price.faceValue + b.price.serviceFee),
      );
    case "newest":
      // No listedAt timestamp in the mock data. As a proxy, sort by ID
      // descending — newer tickets in the fixture have higher IDs. When
      // the backend lands (Phase 2) this swaps to a real timestamp field.
      return copy.sort((a, b) => b.id.localeCompare(a.id));
  }
}
