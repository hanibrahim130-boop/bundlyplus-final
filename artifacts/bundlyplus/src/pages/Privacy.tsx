import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { PageLayout } from '@/components/shared/PageLayout';
import { Seo } from '@/components/seo/Seo';

const LAST_UPDATED_EN = 'May 7, 2026';
const LAST_UPDATED_AR = '7 مايو 2026';

interface Section {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

const SECTIONS_EN: Section[] = [
  {
    heading: '1. What We Collect',
    paragraphs: [
      'We only collect what we genuinely need to deliver an order and stay in touch about it. That means:',
    ],
    bullets: [
      'Your name and WhatsApp number (so we can deliver and support the subscription).',
      'The email address tied to your sign-in, if you create a BundlyPlus account.',
      'The items you ordered, the total, the currency, and the payment method you used.',
      'Light technical info from your device — browser, language, anonymized IP — used for analytics and abuse prevention.',
    ],
  },
  {
    heading: '2. How We Use Your Data',
    bullets: [
      'Confirm orders, deliver subscription details, and provide support over WhatsApp.',
      'Send renewal reminders before a plan expires, only if you opted in.',
      'Operate, troubleshoot, and improve the BundlyPlus catalog and checkout flow.',
      'Detect fraud, chargeback abuse, or violations of our Terms of Service.',
      'Comply with legal obligations when we are required to.',
    ],
  },
  {
    heading: '3. WhatsApp as Our Main Channel',
    paragraphs: [
      'Most of our communication happens on WhatsApp because it is the fastest way to reach you and confirm sensitive details. Messages are end-to-end encrypted by WhatsApp itself; we keep a record of delivery confirmations, payment confirmations, and support exchanges so we can serve you reliably.',
      'You can ask us to delete WhatsApp records linked to your account at any time, except where we are required to keep transactional data for accounting.',
    ],
  },
  {
    heading: '4. We Do Not Sell Your Data',
    paragraphs: [
      'BundlyPlus does not sell, rent, or trade your personal data to advertisers, brokers, or any third party. Period.',
      'We share data only with the strict minimum of providers required to operate: payment processors that confirm a transfer, the upstream subscription provider (e.g. when activation requires the email tied to the order), and our analytics tool which receives anonymized usage data.',
    ],
  },
  {
    heading: '5. Storage & Retention',
    paragraphs: [
      'Order, payment, and delivery records are kept for as long as the related subscription is active and for a reasonable period afterwards for accounting and dispute resolution.',
      'Marketing or renewal-reminder data is removed as soon as you ask us to stop, or after a period of inactivity.',
    ],
  },
  {
    heading: '6. Your Rights',
    paragraphs: [
      'You can ask us to:',
    ],
    bullets: [
      'Show you what we have on file about you.',
      'Correct any detail that is wrong or out of date.',
      'Delete your data, subject to the records we are legally required to retain.',
      'Stop sending you renewal reminders or other non-essential messages.',
    ],
  },
  {
    heading: '7. Analytics & Cookies',
    paragraphs: [
      'We use a privacy-friendly analytics setup with anonymized IPs and no session recording. We do not use third-party advertising trackers. Your browser may store small amounts of data (theme preference, language, cart contents) locally on your device — these never leave your device.',
    ],
  },
  {
    heading: '8. Children',
    paragraphs: [
      'BundlyPlus is intended for users aged 16 and above. If you believe a minor has placed an order, contact us and we will help cancel it and remove their data.',
    ],
  },
];

const SECTIONS_AR: Section[] = [
  {
    heading: '١. ما الذي نجمعه',
    paragraphs: [
      'نجمع فقط ما نحتاجه فعلياً لتسليم الطلب والبقاء على تواصل معك بشأنه، وهو:',
    ],
    bullets: [
      'اسمك ورقم واتساب (لنسلّم لك الاشتراك ونقدّم الدعم).',
      'البريد الإلكتروني المرتبط بتسجيل الدخول إذا أنشأت حساباً على BundlyPlus.',
      'المنتجات التي طلبتها والإجمالي والعملة وطريقة الدفع.',
      'بيانات تقنية بسيطة من جهازك — المتصفح واللغة وعنوان IP بشكل مجهول — لأغراض التحليلات ومنع الإساءة.',
    ],
  },
  {
    heading: '٢. كيف نستخدم بياناتك',
    bullets: [
      'تأكيد الطلبات وتسليم تفاصيل الاشتراك وتقديم الدعم عبر واتساب.',
      'إرسال تذكيرات التجديد قبل انتهاء الباقة، فقط إذا اخترت ذلك.',
      'تشغيل كتالوج BundlyPlus وعملية الدفع وتحسينهما.',
      'اكتشاف الاحتيال أو إساءة استخدام استرجاع الدفع أو مخالفات شروط الخدمة.',
      'الامتثال للالتزامات القانونية عند الحاجة.',
    ],
  },
  {
    heading: '٣. واتساب قناتنا الأساسية',
    paragraphs: [
      'تتم معظم التواصل عبر واتساب لأنه أسرع وسيلة للوصول إليك وتأكيد التفاصيل الحساسة. الرسائل مشفّرة من طرف إلى طرف عبر واتساب نفسه، ونحتفظ بسجلات لتأكيدات التسليم والدفع وتبادلات الدعم لنخدمك بشكل موثوق.',
      'يمكنك أن تطلب منا حذف سجلات واتساب المرتبطة بحسابك في أي وقت، باستثناء البيانات التي يلزمنا الاحتفاظ بها للأغراض المحاسبية.',
    ],
  },
  {
    heading: '٤. لا نبيع بياناتك',
    paragraphs: [
      'لا تبيع BundlyPlus بياناتك الشخصية ولا تؤجرها ولا تتاجر بها مع المعلنين أو الوسطاء أو أي طرف ثالث. نقطة.',
      'نشارك البيانات فقط مع الحد الأدنى الضروري من المزودين لتشغيل الخدمة: مزودو الدفع لتأكيد التحويل، ومزود الاشتراك الأصلي عند الحاجة (مثلاً عندما يتطلب التفعيل البريد المرتبط بالطلب)، وأداة التحليلات التي تتلقى استخداماً مجهولاً.',
    ],
  },
  {
    heading: '٥. التخزين ومدة الاحتفاظ',
    paragraphs: [
      'نحتفظ بسجلات الطلبات والدفع والتسليم طوال فترة فعالية الاشتراك ولفترة معقولة بعدها لأغراض المحاسبة وحل النزاعات.',
      'تُحذف بيانات التسويق وتذكيرات التجديد فور طلبك إيقافها أو بعد فترة من عدم النشاط.',
    ],
  },
  {
    heading: '٦. حقوقك',
    paragraphs: [
      'يمكنك أن تطلب منا:',
    ],
    bullets: [
      'إطلاعك على ما لدينا من بيانات عنك.',
      'تصحيح أي بيان خاطئ أو قديم.',
      'حذف بياناتك مع مراعاة السجلات التي يُلزمنا القانون بالاحتفاظ بها.',
      'إيقاف تذكيرات التجديد أو أي رسائل غير ضرورية.',
    ],
  },
  {
    heading: '٧. التحليلات وملفات الكوكيز',
    paragraphs: [
      'نستخدم نظام تحليلات يحترم الخصوصية مع إخفاء عناوين IP وبدون تسجيل للجلسات، ولا نستخدم متتبعات إعلانية خارجية. قد يخزّن متصفحك بيانات صغيرة (تفضيل المظهر، اللغة، محتويات السلة) محلياً على جهازك، ولا تغادر هذه البيانات جهازك.',
    ],
  },
  {
    heading: '٨. الأطفال',
    paragraphs: [
      'BundlyPlus موجّه للمستخدمين من عمر ١٦ عاماً فأكثر. إذا كنت تظن أن قاصراً أجرى طلباً، تواصل معنا وسنساعد على إلغائه وحذف بياناته.',
    ],
  },
];

export default function Privacy() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const sections = isAr ? SECTIONS_AR : SECTIONS_EN;

  return (
    <>
      <Seo
        title={isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        description={
          isAr
            ? 'كيف تجمع BundlyPlus بياناتك وتستخدمها وتحميها لتسليم الاشتراكات الرقمية عبر واتساب.'
            : 'How BundlyPlus collects, uses, and protects your data to deliver digital subscriptions over WhatsApp.'
        }
        canonical="/privacy"
      />
      <PageLayout maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500 dark:text-pink-400">
              {isAr ? `آخر تحديث · ${LAST_UPDATED_AR}` : `Last updated · ${LAST_UPDATED_EN}`}
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'باختصار: نأخذ منك أقل قدر ممكن من المعلومات، ونستخدمها لتسليم اشتراكاتك ودعمها فقط، ولا نبيعها لأحد.'
                : 'Short version: we keep what we collect to a minimum, use it only to deliver and support your subscriptions, and never sell it to anyone.'}
            </p>
          </header>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-slate-800 dark:text-slate-100">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc ms-5 space-y-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed marker:text-pink-500">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <footer className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'لطلبات الخصوصية أو حذف البيانات، ' : 'For privacy requests or data deletion, '}
              <Link href="/contact" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                {isAr ? 'تواصل معنا' : 'contact us'}
              </Link>
              {isAr ? ' وسنرد عبر واتساب.' : ' and we will reply on WhatsApp.'}
            </p>
          </footer>
        </motion.div>
      </PageLayout>
    </>
  );
}
