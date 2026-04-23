"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/lib/search";
import type { TicketProvider } from "@/lib/types";
import { ALL_CITIES, ALL_PROVIDERS } from "@/lib/mock-data";

export type FilterPanelProps = {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onReset: () => void;
};

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const { t } = useLanguage();

  function toggleCity(city: string) {
    const next = new Set(filters.cities);
    if (next.has(city)) next.delete(city);
    else next.add(city);
    onChange({ ...filters, cities: next });
  }

  function toggleProvider(provider: TicketProvider) {
    const next = new Set(filters.providers);
    if (next.has(provider)) next.delete(provider);
    else next.add(provider);
    onChange({ ...filters, providers: next });
  }

  return (
    <div className="flex flex-col gap-7">
      <FilterGroup label={t("filters.eventType")}>
        <div
          role="radiogroup"
          aria-label={t("filters.eventType")}
          className="grid grid-cols-3 gap-2"
        >
          {(["all", "sports", "culture"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={filters.category === key}
              onClick={() => onChange({ ...filters, category: key })}
              className={cn(
                "rounded-md border px-3 py-2 text-caption font-medium transition-colors duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sage/30",
                filters.category === key
                  ? "border-forest-900 bg-forest-900 text-cream"
                  : "border-border bg-bone text-ink-2 hover:border-border-strong",
              )}
            >
              {t(`category.${key}`)}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t("filters.city")}>
        <div className="flex flex-col gap-2.5">
          {ALL_CITIES.map((city) => (
            <Checkbox
              key={city}
              checked={filters.cities.has(city)}
              onChange={() => toggleCity(city)}
              label={city}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t("filters.dateRange")}>
        <div className="grid grid-cols-2 gap-3">
          <DateField
            label={t("filters.dateFrom")}
            value={filters.dateFrom}
            onChange={(v) => onChange({ ...filters, dateFrom: v })}
          />
          <DateField
            label={t("filters.dateTo")}
            value={filters.dateTo}
            onChange={(v) => onChange({ ...filters, dateTo: v })}
          />
        </div>
      </FilterGroup>

      <FilterGroup label={t("filters.provider")}>
        <div className="flex flex-col gap-2.5">
          {ALL_PROVIDERS.map((provider) => (
            <Checkbox
              key={provider}
              checked={filters.providers.has(provider)}
              onChange={() => toggleProvider(provider)}
              label={t(`providerName.${provider}`)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={t("filters.priceRange")}>
        <div className="grid grid-cols-2 gap-3">
          <PriceField
            label={t("filters.minPrice")}
            value={filters.minPrice}
            onChange={(v) => onChange({ ...filters, minPrice: v })}
          />
          <PriceField
            label={t("filters.maxPrice")}
            value={filters.maxPrice}
            onChange={(v) => onChange({ ...filters, maxPrice: v })}
          />
        </div>
      </FilterGroup>

      <Button variant="ghost" onClick={onReset}>
        {t("common.reset")}
      </Button>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-micro font-semibold uppercase tracking-[0.12em] text-ink-3">
        {label}
      </h3>
      {children}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-caption text-ink-2">
      <span className="font-medium">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-md border border-border bg-bone px-3 text-body text-ink outline-none transition-colors hover:border-border-strong focus:border-forest-900 focus:ring-3 focus:ring-sage/30"
      />
    </label>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-caption text-ink-2">
      <span className="font-medium">{label}</span>
      <div className="flex h-11 items-center rounded-md border border-border bg-bone ps-3 pe-3 transition-colors hover:border-border-strong focus-within:border-forest-900 focus-within:ring-3 focus-within:ring-sage/30">
        <span className="text-body text-ink-3">₪</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? null : Number(raw));
          }}
          className="h-full w-full bg-transparent ps-2 text-body text-ink outline-none"
        />
      </div>
    </label>
  );
}
