import type {
  EventCategory,
  ListingsQuery,
  TicketProvider,
} from "./types";

export type SortKey = "soonest" | "lowestPrice" | "newest";

export type SearchFilters = {
  query: string;
  category: "all" | EventCategory;
  cities: ReadonlySet<string>;
  providers: ReadonlySet<TicketProvider>;
  dateFrom: string; // "" means unset; "YYYY-MM-DD" otherwise
  dateTo: string;
  minPrice: number | null; // shekels, as typed in the input
  maxPrice: number | null; // shekels, as typed in the input
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

export type QueryOpts = {
  sort: SortKey;
  page: number;
  limit: number;
};

// Maps the UI filter state to the backend query shape from API_CONTRACT.md
// — comma-joined arrays for `cities`/`providers` are handled inside
// `api.ts` (request layer). Shekel inputs convert to agorot here so the
// rest of the app never sees the mixed unit.
export function filtersToQuery(
  f: SearchFilters,
  opts: QueryOpts,
): ListingsQuery {
  const query: ListingsQuery = {
    sort: opts.sort,
    page: opts.page,
    limit: opts.limit,
  };

  const trimmedQ = f.query.trim();
  if (trimmedQ) query.q = trimmedQ;

  if (f.category !== "all") query.category = f.category;

  if (f.cities.size > 0) query.cities = Array.from(f.cities);
  if (f.providers.size > 0) query.providers = Array.from(f.providers);

  if (f.dateFrom) query.dateFrom = f.dateFrom;
  if (f.dateTo) query.dateTo = f.dateTo;

  if (f.minPrice !== null) query.minPriceAgorot = Math.round(f.minPrice * 100);
  if (f.maxPrice !== null) query.maxPriceAgorot = Math.round(f.maxPrice * 100);

  return query;
}
