"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import type { TranslationKey } from "@/lib/i18n/types";

const QUESTION_COUNT = 10;

export default function FaqPage() {
  const { t } = useLanguage();

  const items = Array.from({ length: QUESTION_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      question: t(`faq.q${n}` as TranslationKey),
      answer: t(`faq.a${n}` as TranslationKey),
    };
  });

  return (
    <>
      {/* Tundra hero — forest block so the editorial accordion below reads
          as the natural content area after a strong brand statement. */}
      <section className="bg-forest-900 text-cream">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6 py-24 md:px-12 md:py-28">
          <span className="text-micro font-medium uppercase tracking-[0.12em] text-sage-soft">
            {t("nav.faq")}
          </span>
          <h1 className="font-display text-display-lg font-medium leading-tight text-cream">
            {t("faq.title")}
          </h1>
          <p className="max-w-[680px] text-body-lg text-ink-on-dark-2">
            {t("faq.intro")}
          </p>
        </div>
      </section>
      <section className="bg-bone border-y border-border py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl px-6">
          <Accordion>
            {items.map((item, i) => (
              <AccordionItem
                key={item.question}
                question={item.question}
                defaultOpen={i === 0}
              >
                {item.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
