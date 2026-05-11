"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Sheet } from "@/components/ui/Sheet";
import { TicketCard } from "@/components/ticket/TicketCard";
import { TicketCardSkeleton } from "@/components/search/TicketCardSkeleton";
import { FilterPanel } from "@/components/search/FilterPanel";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { ApiError, listListings } from "@/lib/api";
import type { Listing } from "@/lib/types";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToQuery,
  hasActiveFilters,
  type SearchFilters,
  type SortKey,
} from "@/lib/search-query";

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [items, setItems] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  // Bumped to force a re-fetch when the user clicks the retry button.
  const [retryNonce, setRetryNonce] = useState(0);

  // Close mobile filters when viewport crosses up to md.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMobileFiltersOpen(false);
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

  const debouncedQuery = useDebouncedValue(query, 200);
  const effectiveFilters = useMemo<SearchFilters>(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  );

  // Stable signature of inputs that should snap pagination back to page 1
  // (anything but `page` itself). When the signature changes mid-render
  // we reset `page` and `lastSig` in-place — the React-blessed pattern
  // for "adjusting state when a prop changes" (no effect needed).
  const filterSignature = useMemo(
    () =>
      JSON.stringify({
        ...effectiveFilters,
        cities: Array.from(effectiveFilters.cities),
        providers: Array.from(effectiveFilters.providers),
        sort,
      }),
    [effectiveFilters, sort],
  );
  const [lastFilterSignature, setLastFilterSignature] = useState(filterSignature);
  if (lastFilterSignature !== filterSignature) {
    setLastFilterSignature(filterSignature);
    setPage(1);
  }

  // Fetch results from the live backend whenever the query inputs change.
  // The sync setState pair at the top of the effect (the "show spinner now,
  // resolve later" UX) is the canonical fetch-on-change pattern in vanilla
  // React; the React 19 compiler lint warns against it because it prefers
  // Suspense + a data library. We deliberately use plain fetch in MVP
  // (CLAUDE.md), so the cascade is intentional.
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    const query = filtersToQuery(effectiveFilters, {
      sort,
      page,
      limit: PAGE_SIZE,
    });
    listListings(query)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(
          e instanceof ApiError
            ? e
            : new ApiError({
                code: "unknown_error",
                message: e instanceof Error ? e.message : "Unknown error",
                status: 0,
              }),
        );
        setItems([]);
        setTotal(0);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [effectiveFilters, sort, page, retryNonce]);

  const activeCount = countActiveFilters(filters);
  const hasAnyFilter = hasActiveFilters(effectiveFilters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
  }, []);

  const retry = useCallback(() => setRetryNonce((n) => n + 1), []);

  const sortOptions = [
    { value: "soonest", label: t("sort.soonest") },
    { value: "lowestPrice", label: t("sort.lowestPrice") },
    { value: "newest", label: t("sort.newest") },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:px-12 md:py-14">
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-display-md font-medium text-ink">
          {t("search.title")}
        </h1>
        <Input
          type="search"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<SearchIcon />}
        />
      </header>

      <div className="flex items-center justify-between gap-3">
        <ResultsLine loading={isLoading} error={error} count={total} />
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
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-ochre px-1.5 text-micro font-semibold text-white">
                {activeCount}
              </span>
            )}
          </Button>
          <div className="w-48">
            <Select
              aria-label={t("sort.label")}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr] md:gap-10">
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-lg border border-border bg-bone p-6">
            <h2 className="mb-5 font-display text-h3 font-medium text-ink">
              {t("filters.title")}
            </h2>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <section className="flex flex-col gap-6">
          {isLoading ? (
            <SkeletonGrid />
          ) : error ? (
            <ErrorState onRetry={retry} />
          ) : items.length === 0 ? (
            hasAnyFilter ? (
              <NoResultsState onReset={resetFilters} />
            ) : (
              <EmptyQueryState />
            )
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {items.map((listing) => (
                  <TicketCard key={listing.id} ticket={listing} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pager
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              )}
            </>
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
  error,
  count,
}: {
  loading: boolean;
  error: ApiError | null;
  count: number;
}) {
  const { t } = useLanguage();
  if (loading) return <p className="text-caption text-ink-3">{t("common.loading")}</p>;
  if (error) return <p className="text-caption text-ink-3">{t("search.errorTitle")}</p>;

  const label =
    count === 1
      ? t("search.singleResult")
      : t("search.resultsCount").replace("{count}", String(count));
  return <p className="text-caption font-medium text-ink-2">{label}</p>;
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <TicketCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SearchPageFallback() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 md:px-12 md:py-14">
      <SkeletonGrid />
    </main>
  );
}

function EmptyQueryState() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-bone p-12 text-center">
      <SearchIcon className="h-8 w-8 text-ink-3" />
      <h2 className="font-display text-h2 font-medium text-ink">
        {t("search.emptyQueryTitle")}
      </h2>
      <p className="max-w-md text-body text-ink-2">
        {t("search.emptyQueryBody")}
      </p>
    </div>
  );
}

function NoResultsState({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-bone p-12 text-center">
      <h2 className="font-display text-h2 font-medium text-ink">
        {t("search.noResultsTitle")}
      </h2>
      <p className="max-w-md text-body text-ink-2">
        {t("search.noResultsBody")}
      </p>
      <Button variant="secondary" onClick={onReset}>
        {t("search.clearFilters")}
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-bone p-12 text-center">
      <h2 className="font-display text-h2 font-medium text-ink">
        {t("search.errorTitle")}
      </h2>
      <p className="max-w-md text-body text-ink-2">{t("search.errorBody")}</p>
      <Button variant="secondary" onClick={onRetry}>
        {t("common.retry")}
      </Button>
    </div>
  );
}

function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (next: number) => void;
}) {
  const { t } = useLanguage();
  const label = t("search.pageOf")
    .replace("{page}", String(page))
    .replace("{total}", String(totalPages));
  return (
    <nav className="flex items-center justify-between gap-3 border-t border-border pt-6">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ← {t("common.previous")}
      </Button>
      <span className="text-caption text-ink-2" data-numeric>
        {label}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        {t("common.next")} →
      </Button>
    </nav>
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
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
