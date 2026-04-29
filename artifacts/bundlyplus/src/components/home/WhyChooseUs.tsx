import React from 'react';
import { Shield, Zap, Link as LinkIcon, Headphones } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { useI18n } from '@/lib/i18n';

export function WhyChooseUs() {
  const { t } = useI18n();

  const features = [
    {
      icon: <Shield className="w-7 h-7 text-pink-500" />,
      title: t.whyUs.security.title,
      desc: t.whyUs.security.desc,
    },
    {
      icon: <Zap className="w-7 h-7 text-orange-500" />,
      title: t.whyUs.speed.title,
      desc: t.whyUs.speed.desc,
    },
    {
      icon: <LinkIcon className="w-7 h-7 text-purple-500" />,
      title: t.whyUs.integration.title,
      desc: t.whyUs.integration.desc,
    },
    {
      icon: <Headphones className="w-7 h-7 text-blue-500" />,
      title: t.whyUs.support.title,
      desc: t.whyUs.support.desc,
    }
  ];

  return (
    <Section>
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <ScrollReveal animation="slideLeft" className="md:w-1/3">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-800 dark:text-slate-100 leading-[1.1] tracking-tight mb-6">
            {t.whyUs.label}<br /><span className="text-gradient">{t.whyUs.brand}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.whyUs.intro}
          </p>
        </ScrollReveal>

        <StaggerContainer className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.1}>
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <div className="glass-card rounded-3xl p-8 hover:bg-white/80 dark:hover:bg-white/10 transition-colors h-full group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Section>
  );
}
