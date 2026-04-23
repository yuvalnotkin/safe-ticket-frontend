"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { useToast } from "@/components/ui/Toast";
import { VerificationBadge } from "@/components/ticket/VerificationBadge";
import { PriceBreakdown } from "@/components/ticket/PriceBreakdown";
import { TicketCard } from "@/components/ticket/TicketCard";
import { TransactionTimeline } from "@/components/ticket/TransactionTimeline";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Ticket } from "@/lib/types";

const SAMPLE_TICKET: Ticket = {
  id: "t-001",
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
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 px-6 py-12 md:px-12">
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-display-lg font-medium text-ink">
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
        <p className="text-body-lg text-ink-2">{t("styleGuide.intro")}</p>
      </header>

      <Section title={t("styleGuide.colors")}>
        <ColorSwatches />
      </Section>

      <Section title={t("styleGuide.typography")}>
        <div className="flex flex-col gap-4">
          <p className="font-display text-display-xl">Display XL · 80px</p>
          <p className="font-display text-display-lg">Display LG · 64px</p>
          <p className="font-display text-display-md">Display MD · 48px</p>
          <p className="font-display text-h1">H1 · 40px</p>
          <p className="font-display text-h2">H2 · 32px</p>
          <p className="font-display text-h3">H3 · 24px</p>
          <p className="text-h4 font-semibold">H4 sans · 20px</p>
          <p className="text-body-lg">Body large · 18px / 1.6</p>
          <p className="text-body">Body · 16px / 1.6</p>
          <p className="text-small text-ink-2">Small · 14px</p>
          <p className="text-caption text-ink-3">Caption · 13px</p>
          <p className="text-micro uppercase tracking-[0.12em] text-ink-3">
            Micro / eyebrow · 12px
          </p>
        </div>
      </Section>

      <Section title={t("styleGuide.buttons")}>
        <Grid>
          <StateGroup label="Primary (forest)">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </StateGroup>
          <StateGroup label="CTA (ochre) — buy / list only">
            <Button variant="cta" size="sm">{t("common.buy")}</Button>
            <Button variant="cta">{t("common.buy")}</Button>
            <Button variant="cta" size="lg">{t("common.list")}</Button>
            <Button variant="cta" disabled>Disabled</Button>
            <Button variant="cta" loading>Loading</Button>
          </StateGroup>
          <StateGroup label="Secondary (outlined forest)">
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
          <Input label={t("common.search")} placeholder={t("common.search")} />
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
          <Badge tone="verified">{t("trust.verified")}</Badge>
          <Badge tone="face-value">{t("price.faceValue")}</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info" mono>Ticketmaster</Badge>
          <VerificationBadge />
        </div>
      </Section>

      <Section title={t("styleGuide.cards")}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-display text-h3 font-medium text-ink">
              Default card
            </h3>
            <p className="mt-2 text-body text-ink-2">
              Bone surface, 1px warm-grey border, forest-tinted shadow.
            </p>
          </Card>
          <Card interactive className="p-6">
            <h3 className="font-display text-h3 font-medium text-ink">
              Interactive card
            </h3>
            <p className="mt-2 text-body text-ink-2">
              Hover: border steps to forest, 2px lift, deeper shadow.
            </p>
          </Card>
        </div>
      </Section>

      <Section title={t("styleGuide.ticketComponents")}>
        <div className="flex flex-col gap-8">
          <StateGroup label="PriceBreakdown — compact">
            <div className="rounded-md border border-border bg-bone p-5">
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
            <div className="max-w-md">
              <TicketCard ticket={SAMPLE_TICKET} />
            </div>
          </StateGroup>
        </div>
      </Section>

      <Section title={t("styleGuide.timeline")}>
        <div className="grid gap-6 md:grid-cols-3">
          <StateGroup label="All upcoming">
            <div className="w-full rounded-md border border-border bg-bone p-5">
              <TransactionTimeline currentStep={-1} />
            </div>
          </StateGroup>
          <StateGroup label="Mid-flow (step 2 active)">
            <div className="w-full rounded-md border border-border bg-bone p-5">
              <TransactionTimeline currentStep={1} />
            </div>
          </StateGroup>
          <StateGroup label="Completed">
            <div className="w-full rounded-md border border-border bg-bone p-5">
              <TransactionTimeline currentStep={4} />
            </div>
          </StateGroup>
        </div>
      </Section>

      <Section title={t("styleGuide.accordion")}>
        <div className="max-w-2xl">
          <Accordion>
            <AccordionItem question={t("faq.q1")} defaultOpen>
              {t("faq.a1")}
            </AccordionItem>
            <AccordionItem question={t("faq.q2")}>{t("faq.a2")}</AccordionItem>
            <AccordionItem question={t("faq.q3")}>{t("faq.a3")}</AccordionItem>
          </Accordion>
        </div>
      </Section>

      <Section title={t("styleGuide.toast")}>
        <ToastDemo />
      </Section>
    </main>
  );
}

function ToastDemo() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast.show("Info toast — tap to dismiss.", { tone: "info" })}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.show("Success toast — nicely done.", { tone: "success" })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.show("Warning toast — pay attention.", { tone: "warning" })
        }
      >
        Warning
      </Button>
    </div>
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
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-h2 font-medium text-ink">{title}</h2>
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
      <p className="text-micro font-medium uppercase tracking-[0.12em] text-ink-3">
        {label}
      </p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-7">{children}</div>;
}

function ColorSwatches() {
  const swatches: Array<{ label: string; className: string; note?: string }> = [
    { label: "forest-900", className: "bg-forest-900", note: "brand" },
    { label: "forest-950", className: "bg-forest-950" },
    { label: "sage", className: "bg-sage", note: "interactive" },
    { label: "sage-soft", className: "bg-sage-soft" },
    { label: "cream", className: "bg-cream", note: "page bg" },
    { label: "cream-deep", className: "bg-cream-deep" },
    { label: "bone", className: "bg-bone", note: "card surface" },
    { label: "ochre", className: "bg-ochre", note: "reserved CTA" },
    { label: "ochre-deep", className: "bg-ochre-deep" },
    { label: "success", className: "bg-success" },
    { label: "warning", className: "bg-warning" },
    { label: "danger", className: "bg-danger" },
    { label: "neutral-300 (border)", className: "bg-neutral-300" },
    { label: "neutral-400", className: "bg-neutral-400" },
    { label: "neutral-700", className: "bg-neutral-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {swatches.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-2 rounded-md border border-border bg-bone p-3"
        >
          <div className={`${s.className} h-16 rounded-sm`} />
          <div className="flex flex-col">
            <span className="text-caption font-medium text-ink">
              {s.label}
            </span>
            {s.note && (
              <span className="text-micro text-ink-3">{s.note}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
