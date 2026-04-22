"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Sheet } from "@/components/ui/Sheet";
import { TicketCard } from "@/components/ticket/TicketCard";
import { TicketCardSkeleton } from "@/components/search/TicketCardSkeleton";
import { FilterPanel } from "@/components/search/FilterPanel";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { MOCK_TICKETS } from "@/lib/mock-data";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterTickets,
  hasActiveFilters,
  sortTickets,
  type SearchFilters,
  type SortKey,
} from "@/lib/search";

// Owns all search state. Filters + sort + query combine into the final
// result list; filters are debounced via the query only (typing noise is
// the cost; toggling a checkbox is a deliberate action and runs immediately).

const INITIAL_LOAD_MS = 300;

// useSearchParams() reads the URL but requires a Suspense boundary in
// Next.js App Router, so the page is a Suspense wrapper around the real
// content. The fallback matches the skeleton state of the inner page so
// navigation feels uninterrupted.
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const { t } = useLanguage();
  const params = useSearchParams();

  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("soonest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Simulate an initial fetch so the skeleton state is actually reachable.
  // Phase 2 swaps this for a real pending-query state.
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), INITIAL_LOAD_MS);
    return () => window.clearTimeout(id);
  }, []);

  const debouncedQuery = useDebouncedValue(query, 200);
  const effectiveFilters = useMemo<SearchFilters>(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  );

  const results = useMemo(
    () => sortTickets(filterTickets(MOCK_TICKETS, effectiveFilters), sort),
    [effectiveFilters, sort],
  );

  const activeCount = countActiveFilters(filters);
  const hasAnyFilter = hasActiveFilters(effectiveFilters);

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setQuery("");
  }

  const sortOptions = [
    { value: "soonest", label: t("sort.soonest") },
    { value: "lowestPrice", label: t("sort.lowestPrice") },
    { value: "newest", label: t("sort.newest") },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-h1 font-bold text-navy-900">{t("search.title")}</h1>
        <Input
          type="search"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<SearchIcon />}
        />
      </header>

      <div className="flex items-center justify-between gap-3">
        <ResultsLine
          loading={isLoading}
          count={results.length}
          hasAnyFilter={hasAnyFilter}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden"
            leadingIcon={<FiltersIcon />}
          >
            {t("search.openFiltersMobile")}
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-navy-900 px-1.5 text-caption font-semibold text-white">
                {activeCount}
              </span>
            )}
          </Button>
          <div className="w-44">
            <Select
              aria-label={t("sort.label")}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-6 rounded-lg border border-navy-100 bg-surface p-5">
            <h2 className="mb-4 text-h3 font-semibold text-navy-900">
              {t("filters.title")}
            </h2>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <section className="flex flex-col gap-4">
          {isLoading ? (
            <SkeletonGrid />
          ) : results.length === 0 ? (
            hasAnyFilter ? (
              <NoResultsState onReset={resetFilters} />
            ) : (
              <EmptyQueryState />
            )
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Sheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title={t("filters.title")}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={resetFilters}
              className="flex-1"
            >
              {t("common.reset")}
            </Button>
            <Button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1"
            >
              {t("search.applyFilters")}
            </Button>
          </div>
        }
      >
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </Sheet>
    </main>
  );
}

function ResultsLine({
  loading,
  count,
  hasAnyFilter,
}: {
  loading: boolean;
  count: number;
  hasAnyFilter: boolean;
}) {
  const { t } = useLanguage();
  if (loading) return <p className="text-small text-navy-500">{t("common.loading")}</p>;

  if (count === 0 && !hasAnyFilter) {
    return (
      <div className="flex items-center gap-2">
        <Badge tone="neutral">{MOCK_TICKETS.length}</Badge>
        <span className="text-small text-navy-600">{t("search.title")}</span>
      </div>
    );
  }

  const label =
    count === 1
      ? t("search.singleResult")
      : t("search.resultsCount").replace("{count}", String(count));
  return <p className="text-small text-navy-700">{label}</p>;
}

function SkeletonGrid() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SearchPageFallback() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <SkeletonGrid />
    </main>
  );
}

function EmptyQueryState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-navy-200 bg-surface p-10 text-center">
      <SearchIcon className="h-8 w-8 text-navy-300" />
      <h2 className="text-h3 text-navy-900">{t("search.emptyQueryTitle")}</h2>
      <p className="max-w-md text-body text-navy-600">
        {t("search.emptyQueryBody")}
      </p>
    </div>
  );
}

function NoResultsState({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-navy-200 bg-surface p-10 text-center">
      <h2 className="text-h3 text-navy-900">{t("search.noResultsTitle")}</h2>
      <p className="max-w-md text-body text-navy-600">
        {t("search.noResultsBody")}
      </p>
      <Button variant="secondary" onClick={onReset}>
        {t("search.clearFilters")}
      </Button>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
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

function FiltersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5h14M6 10h8M9 15h2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
