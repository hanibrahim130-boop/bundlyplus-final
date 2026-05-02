import React from 'react';
import { Quote, MapPin } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/motion/ScrollReveal';
import { useI18n } from '@/lib/i18n';

const testimonialsData = [
  {
    quote: {
      en: 'I was paying $40/month for Netflix, Spotify and Anghami. With BundlyPlus I pay less than $7. The WhatsApp delivery was instant - no joke.',
      ar: 'كنت أدفع 40$ شهريا لنتفليكس وسبوتيفاي وأنغامي. مع BundlyPlus صرت أدفع أقل من 7$. التسليم على واتساب كان فوريا - بدون مبالغة.',
    },
    name: { en: 'Rami Haddad', ar: 'رامي حداد' },
    role: { en: 'Software Engineer · Beirut', ar: 'مهندس برمجيات · بيروت' },
    color: 'from-pink-400 to-orange-500',
    initials: 'RH',
  },
  {
    quote: {
      en: 'Paid via Whish in seconds. Got my ChatGPT Plus + Canva Pro accounts before I finished my coffee. This is exactly what Lebanon needed.',
      ar: 'دفعت عبر Whish خلال ثوان. وصلني حساب ChatGPT Plus وCanva Pro قبل أن أنهي قهوتي. هذا بالضبط ما كان يحتاجه لبنان.',
    },
    name: { en: 'Layla Mansour', ar: 'ليلى منصور' },
    role: { en: 'Graphic Designer · Tripoli', ar: 'مصممة جرافيك · طرابلس' },
    color: 'from-purple-400 to-pink-500',
    initials: 'LM',
  },
  {
    quote: {
      en: 'As a startup in Beirut, the Ultimate bundle gave my team Adobe, Notion AI, and Figma for the price of one Netflix. Game changer.',
      ar: 'كشركة ناشئة في بيروت، أعطت باقة Ultimate فريقي Adobe وNotion AI وFigma بسعر اشتراك نتفليكس واحد. فرق كبير.',
    },
    name: { en: 'Karim El-Khoury', ar: 'كريم الخوري' },
    role: { en: 'Founder · Saida', ar: 'مؤسس · صيدا' },
    color: 'from-emerald-400 to-cyan-500',
    initials: 'KE',
  },
];

export function Testimonials() {
  const { t, lang } = useI18n();

  return (
    <Section className="overflow-hidden">
      <ScrollReveal className="text-center mb-16">
        <SectionHeader subtitle={t.testimonials.subtitle} title={t.testimonials.title} />
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.12}>
        {testimonialsData.map((item, i) => (
          <StaggerItem key={i} animation="scaleIn">
            <div className="glass-card rounded-3xl p-8 flex flex-col relative h-full group">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-200 dark:text-slate-700 rotate-180 group-hover:text-pink-200 dark:group-hover:text-pink-900 transition-colors duration-300" />
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 flex-grow relative z-10 font-medium" dir="auto">
                "{item.quote[lang]}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.color} flex-shrink-0 shadow-inner border-2 border-white dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center text-white font-bold text-sm`}>
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-slate-800 dark:text-slate-100 font-bold flex items-center gap-1.5">
                    {item.name[lang]}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Lebanon</span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.role[lang]}
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
