import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { PageLayout } from '@/components/shared/PageLayout';
import { Seo } from '@/components/seo/Seo';

const FALLBACK_WHATSAPP = '96176171003';

function formatLocalNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('961') && digits.length >= 11) {
    return `+961 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export default function Contact() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const { siteSettings } = useSettings();

  const whatsappRaw = siteSettings.whatsapp_number || FALLBACK_WHATSAPP;
  const whatsappDigits = whatsappRaw.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${whatsappDigits}`;
  const whatsappDisplay = formatLocalNumber(whatsappRaw);

  return (
    <>
      <Seo
        title={isAr ? 'تواصل معنا' : 'Contact Us'}
        description={
          isAr
            ? 'تواصل مع فريق BundlyPlus عبر واتساب لطلب اشتراك أو الحصول على دعم أو طرح سؤال.'
            : 'Reach the BundlyPlus team on WhatsApp to place an order, get support, or ask a question.'
        }
        canonical="/contact"
      />
      <PageLayout maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          <header className="space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 dark:text-pink-400">
              {isAr ? 'الدعم' : 'Support'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {isAr
                ? 'واتساب هو أسرع طريقة للوصول إلينا. أرسل رسالة في أي وقت وسنرد خلال ساعات العمل.'
                : 'WhatsApp is the fastest way to reach us. Send a message any time and we will reply within working hours.'}
            </p>
          </header>

          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group block rounded-3xl p-px bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 shadow-xl shadow-pink-500/10"
          >
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  {isAr ? 'الطريقة الموصى بها' : 'Recommended channel'}
                </p>
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  {isAr ? 'راسلنا على واتساب' : 'Message us on WhatsApp'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 break-all">
                  {whatsappDisplay}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium shrink-0 group-hover:gap-3 transition-all">
                {isAr ? 'فتح المحادثة' : 'Open chat'}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </span>
            </div>
          </motion.a>

          <section className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">
                {isAr ? 'أوقات الرد' : 'Response time'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'يومياً من ٩ صباحاً حتى ١١ مساءً (بتوقيت بيروت). نهدف للرد خلال ١٥ دقيقة في ساعات الذروة، وفي غضون ساعتين خارجها.'
                  : 'Daily 9:00 AM – 11:00 PM (Beirut time). We aim to reply within 15 minutes during peak hours and within 2 hours otherwise.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">
                {isAr ? 'الموقع' : 'Based in'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? 'بيروت، لبنان. نخدم العملاء في لبنان ومنطقة الشرق الأوسط وشمال أفريقيا.'
                  : 'Beirut, Lebanon. We serve customers across Lebanon and the wider MENA region.'}
              </p>
            </div>

          </section>

          <section className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-3">
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-100">
              {isAr ? 'ما الذي يجب تضمينه في رسالتك' : 'What to include in your message'}
            </h3>
            <ul className="list-disc ms-5 space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed marker:text-pink-500">
              <li>
                {isAr
                  ? 'الاشتراك أو الباقة التي تهتم بها (أو رقم مرجع طلبك إن كان لديك واحد).'
                  : 'The subscription or bundle you are interested in (or your order reference if you already have one).'}
              </li>
              <li>
                {isAr
                  ? 'وصف مختصر للمشكلة إن كنت تطلب الدعم، ولقطة شاشة إن أمكن.'
                  : 'A short description of the issue if you need support, plus a screenshot if you can.'}
              </li>
              <li>
                {isAr
                  ? 'لغة المراسلة المفضلة لديك (عربي أو إنجليزي).'
                  : 'Your preferred language for the conversation (English or Arabic).'}
              </li>
            </ul>
          </section>
        </motion.div>
      </PageLayout>
    </>
  );
}
