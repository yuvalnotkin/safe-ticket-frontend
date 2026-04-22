"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import type { TranslationKey } from "@/lib/i18n/types";

// 10 questions — verification, face value, escrow, transfer failure,
// cancellations, reschedules, fees, providers, privacy, cross-border.
// Questions opened and closed independently; native <details>/<summary>
// via the Accordion primitive gives correct keyboard + SR semantics.

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
      <section className="bg-gradient-to-b from-navy-50 to-bg">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 py-16 md:py-20">
          <h1 className="font-display text-display text-navy-900">
            {t("faq.title")}
          </h1>
          <p className="max-w-2xl text-body-lg text-navy-700">
            {t("faq.intro")}
          </p>
        </div>
      </section>
      <section className="bg-bg py-12 md:py-16">
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
