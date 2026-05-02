import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Section } from '@/components/shared/Section';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { useI18n } from '@/lib/i18n';

export function FAQ() {
  const { t } = useI18n();

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <Section maxWidth="md">
      <ScrollReveal className="text-center mb-12">
        <SectionHeader subtitle={t.faq.subtitle} title={t.faq.title} />
      </ScrollReveal>

      <ScrollReveal animation="scaleIn" delay={0.1}>
        <div className="glass-card rounded-3xl p-2 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-slate-200/60 dark:border-slate-700/60 px-4">
                <AccordionTrigger className="text-slate-800 dark:text-slate-100 font-bold hover:text-pink-600 dark:hover:text-pink-400 text-start hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed text-base pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollReveal>
    </Section>
  );
}
