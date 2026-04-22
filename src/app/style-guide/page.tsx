"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/ticket/VerificationBadge";
import { PriceBreakdown } from "@/components/ticket/PriceBreakdown";
import { TicketCard } from "@/components/ticket/TicketCard";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Ticket } from "@/lib/types";

// Internal self-documenting spec for the design system. Every primitive and
// component appears in every meaningful state. Not linked from main nav —
// access via `/style-guide`. Also the place to verify RTL correctness
// (toggle language top-right) before shipping any screen.

const SAMPLE_TICKET: Ticket = {
  id: "sample-1",
  event: {
    name: "מכבי תל אביב — הפועל באר שבע",
    date: "2026-05-18T20:15:00+03:00",
    venue: "היכל מנורה מבטחים",
    city: "תל אביב",
    category: "sports",
  },
  seat: { section: "103", row: "H", seat: "22" },
  price: { faceValue: 240, serviceFee: 18 },
  provider: "leaan",
};

export default function StyleGuidePage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-3 border-b border-navy-100 pb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-display text-navy-900">
            {t("styleGuide.title")}
          </h1>
          <div className="flex gap-2">
            <Button
              variant={language === "he" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setLanguage("he")}
            >
              עברית
            </Button>
            <Button
              variant={language === "en" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
          </div>
        </div>
        <p className="text-body text-navy-600">{t("styleGuide.intro")}</p>
      </header>

      <Section title={t("styleGuide.colors")}>
        <ColorSwatches />
      </Section>

      <Section title={t("styleGuide.typography")}>
        <div className="flex flex-col gap-3">
          <p className="font-display text-display">Display · 40px / 700</p>
          <p className="text-h1">H1 · 32px / 700</p>
          <p className="text-h2">H2 · 24px / 600</p>
          <p className="text-h3">H3 · 20px / 600</p>
          <p className="text-body-lg">Body LG · 18px / 1.6</p>
          <p className="text-body">Body · 16px / 1.5</p>
          <p className="text-small">Small · 14px</p>
          <p className="text-caption text-navy-500">Caption · 12px · muted</p>
        </div>
      </Section>

      <Section title={t("styleGuide.buttons")}>
        <Grid>
          <StateGroup label="Primary (navy)">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </StateGroup>
          <StateGroup label="Trust (green) — buy / list only">
            <Button variant="trust" size="sm">{t("common.buy")}</Button>
            <Button variant="trust">{t("common.buy")}</Button>
            <Button variant="trust" size="lg">{t("common.list")}</Button>
            <Button variant="trust" disabled>Disabled</Button>
            <Button variant="trust" loading>Loading</Button>
          </StateGroup>
          <StateGroup label="Secondary (outlined)">
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </StateGroup>
          <StateGroup label="Ghost">
            <Button variant="ghost" size="sm">Small</Button>
            <Button variant="ghost">Medium</Button>
            <Button variant="ghost" size="lg">Large</Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </StateGroup>
        </Grid>
      </Section>

      <Section title={t("styleGuide.inputs")}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label={t("common.search")}
            placeholder={t("common.search")}
          />
          <Input
            label={t("common.search")}
            placeholder={t("common.search")}
            hint="הקלידו שם אירוע או מופע"
          />
          <Input
            label={t("common.search")}
            placeholder={t("common.search")}
            error="חובה למלא שדה זה"
            defaultValue=""
          />
          <Input
            label={t("common.search")}
            placeholder={t("common.search")}
            disabled
            defaultValue="Disabled"
          />
        </div>
      </Section>

      <Section title={t("styleGuide.badges")}>
        <div className="flex flex-wrap gap-3">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="trust">{t("trust.verified")}</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <VerificationBadge />
        </div>
      </Section>

      <Section title={t("styleGuide.cards")}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-h3 text-navy-900">Default card</h3>
            <p className="mt-2 text-body text-navy-600">
              White surface, thin border, subtle shadow.
            </p>
          </Card>
          <Card interactive className="p-5">
            <h3 className="text-h3 text-navy-900">Interactive card</h3>
            <p className="mt-2 text-body text-navy-600">
              Hover lift — used for clickable summaries like TicketCard.
            </p>
          </Card>
        </div>
      </Section>

      <Section title={t("styleGuide.ticketComponents")}>
        <div className="flex flex-col gap-6">
          <StateGroup label="PriceBreakdown — compact">
            <div className="rounded-md bg-surface p-4">
              <PriceBreakdown
                faceValue={240}
                serviceFee={18}
                variant="compact"
              />
            </div>
          </StateGroup>
          <StateGroup label="PriceBreakdown — full">
            <div className="max-w-sm">
              <PriceBreakdown faceValue={240} serviceFee={18} variant="full" />
            </div>
          </StateGroup>
          <StateGroup label="TicketCard">
            <TicketCard ticket={SAMPLE_TICKET} />
          </StateGroup>
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-h2 text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

function StateGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption font-medium uppercase tracking-wide text-navy-500">
        {label}
      </p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

function ColorSwatches() {
  const swatches: Array<{ label: string; className: string; note?: string }> = [
    { label: "navy-900", className: "bg-navy-900", note: "brand" },
    { label: "navy-800", className: "bg-navy-800" },
    { label: "navy-700", className: "bg-navy-700" },
    { label: "navy-500", className: "bg-navy-500" },
    { label: "navy-300", className: "bg-navy-300" },
    { label: "navy-100", className: "bg-navy-100" },
    { label: "navy-50", className: "bg-navy-50" },
    { label: "green-700", className: "bg-green-700", note: "trust" },
    { label: "green-500", className: "bg-green-500" },
    { label: "green-200", className: "bg-green-200" },
    { label: "green-100", className: "bg-green-100" },
    { label: "success", className: "bg-success" },
    { label: "warning", className: "bg-warning" },
    { label: "danger", className: "bg-danger" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {swatches.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-2 rounded-md border border-navy-100 bg-surface p-3"
        >
          <div className={`${s.className} h-16 rounded-sm`} />
          <div className="flex items-baseline justify-between">
            <span className="text-small font-medium text-navy-800">
              {s.label}
            </span>
            {s.note && (
              <span className="text-caption text-navy-500">{s.note}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
