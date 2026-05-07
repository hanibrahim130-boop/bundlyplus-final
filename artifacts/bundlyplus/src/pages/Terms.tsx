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
    heading: '1. Service Usage',
    paragraphs: [
      'BundlyPlus is a digital subscription marketplace. We help you access premium services such as streaming, AI tools, and creative software through curated plans, with delivery and support handled over WhatsApp.',
      'By placing an order with BundlyPlus you confirm that you are at least 16 years old, that the contact details you provide are accurate, and that you will use the subscriptions for lawful personal or business purposes.',
    ],
  },
  {
    heading: '2. Account Delivery',
    paragraphs: [
      'After we confirm your payment we deliver the subscription details (login, activation code, or invite link) to the WhatsApp number you used to check out. Most digital subscriptions are delivered within minutes; a few products may take longer and we will keep you posted in the same chat.',
      'Each product page states whether the access is private (for you only) or shared (used alongside other subscribers under fair-use rules). Please read this before checking out.',
    ],
  },
  {
    heading: '3. Fair Use',
    bullets: [
      'Use a subscription on the number of devices specified in the product description.',
      'Do not change the password, email, or recovery info on shared accounts — that breaks access for everyone.',
      'Do not resell, sublicense, or publicly redistribute access we deliver to you.',
      'Respect each provider\u2019s own terms of service (Netflix, Spotify, OpenAI, Adobe, etc.). BundlyPlus is not affiliated with these brands.',
    ],
  },
  {
    heading: '4. No Abuse',
    paragraphs: [
      'We reserve the right to suspend or cancel access without refund if a subscription is used for fraud, account takeover, scraping, payment chargeback abuse, harassment of our team, or any activity that violates the upstream provider\u2019s rules.',
      'If we detect suspicious activity on a shared plan we may rotate credentials or move you to a replacement seat to keep service stable for everyone.',
    ],
  },
  {
    heading: '5. Pricing & Payments',
    paragraphs: [
      'Prices are shown in USD on the catalog and may be displayed in your preferred currency for convenience. Final amounts are confirmed on WhatsApp before payment. Accepted methods include Whish Money, OMT, and USDT (BEP20 / TRC20).',
      'Promotions and discount codes are honored only while active and only on eligible products.',
    ],
  },
  {
    heading: '6. Liability',
    paragraphs: [
      'Digital subscriptions depend on third-party providers we do not control. If a provider changes their terms, regional availability, or pricing in a way that affects your plan we will work with you on a replacement, credit, or refund per our Refund Policy.',
      'BundlyPlus\u2019 total liability for any single order is capped at the amount you paid for that order.',
    ],
  },
  {
    heading: '7. Changes to These Terms',
    paragraphs: [
      'We may update these terms when we add new products, payment methods, or compliance requirements. The "last updated" date above always reflects the most recent revision. Continued use of BundlyPlus after an update means you accept the new terms.',
    ],
  },
];

const SECTIONS_AR: Section[] = [
  {
    heading: '١. استخدام الخدمة',
    paragraphs: [
      'BundlyPlus منصة لتجميع الاشتراكات الرقمية. نوفّر لك وصولاً إلى خدمات مميزة مثل البث وأدوات الذكاء الاصطناعي وبرامج التصميم ضمن باقات منتقاة، مع التسليم والدعم عبر واتساب.',
      'بإجراء طلب عبر BundlyPlus فأنت تؤكد أن عمرك لا يقل عن ١٦ عاماً، وأن بيانات التواصل التي قدمتها صحيحة، وأنك ستستخدم الاشتراكات لأغراض شخصية أو تجارية مشروعة.',
    ],
  },
  {
    heading: '٢. تسليم الحساب',
    paragraphs: [
      'بعد تأكيد الدفع نرسل تفاصيل الاشتراك (تسجيل الدخول أو رمز التفعيل أو رابط الدعوة) إلى رقم واتساب الذي استخدمته عند الطلب. تُسلَّم معظم الاشتراكات خلال دقائق، وقد يحتاج بعضها وقتاً أطول وسنبقيك على اطلاع في المحادثة نفسها.',
      'تُوضح صفحة كل منتج إن كان الوصول خاصاً (لك وحدك) أم مشتركاً (يستخدمه عدة مشتركين وفق قواعد الاستخدام العادل). يُرجى قراءتها قبل إتمام الطلب.',
    ],
  },
  {
    heading: '٣. الاستخدام العادل',
    bullets: [
      'استخدم الاشتراك على عدد الأجهزة المحدد في وصف المنتج.',
      'لا تغيّر كلمة المرور أو البريد أو معلومات الاسترداد على الحسابات المشتركة — يقطع ذلك الوصول عن البقية.',
      'لا تُعِد بيع الوصول الذي نسلّمه أو ترخيصه أو إعادة توزيعه علناً.',
      'احترم شروط مزود الخدمة الأصلية (نتفليكس، سبوتيفاي، OpenAI، أدوبي، إلخ). BundlyPlus غير تابع لهذه العلامات.',
    ],
  },
  {
    heading: '٤. لا للإساءة',
    paragraphs: [
      'نحتفظ بحق إيقاف الوصول أو إلغائه دون استرداد إذا استُخدم الاشتراك للاحتيال أو سرقة الحساب أو الاستخراج الآلي أو إساءة استخدام استرجاع الدفع أو مضايقة فريقنا أو أي نشاط يخالف قواعد المزود الأصلي.',
      'إذا لاحظنا نشاطاً مريباً على باقة مشتركة، قد نقوم بتدوير بيانات الدخول أو نقلك إلى مقعد بديل للحفاظ على استقرار الخدمة للجميع.',
    ],
  },
  {
    heading: '٥. الأسعار والدفع',
    paragraphs: [
      'تُعرض الأسعار بالدولار الأميركي في الكتالوج وقد تُعرض بعملتك المفضلة لراحتك. يتم تأكيد المبلغ النهائي عبر واتساب قبل الدفع. وسائل الدفع المقبولة: Whish Money وOMT وUSDT (BEP20 / TRC20).',
      'تُعتمد العروض ورموز الخصم فقط أثناء سريانها وعلى المنتجات المؤهلة.',
    ],
  },
  {
    heading: '٦. حدود المسؤولية',
    paragraphs: [
      'تعتمد الاشتراكات الرقمية على مزودي خدمات خارجيين لا نتحكم بهم. إذا غيّر مزود ما شروطه أو توفره الإقليمي أو أسعاره بشكل يؤثر على باقتك سنعمل معك على بديل أو رصيد أو استرداد وفق سياسة الاسترداد.',
      'تقتصر مسؤولية BundlyPlus الإجمالية عن أي طلب على المبلغ المدفوع لذلك الطلب.',
    ],
  },
  {
    heading: '٧. تعديلات هذه الشروط',
    paragraphs: [
      'قد نحدّث هذه الشروط عند إضافة منتجات أو وسائل دفع أو متطلبات امتثال جديدة. يعكس تاريخ "آخر تحديث" أعلاه آخر مراجعة. الاستمرار في استخدام BundlyPlus بعد التحديث يعني قبولك للشروط الجديدة.',
    ],
  },
];

export default function Terms() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const sections = isAr ? SECTIONS_AR : SECTIONS_EN;

  return (
    <>
      <Seo
        title={isAr ? 'شروط الخدمة' : 'Terms of Service'}
        description={
          isAr
            ? 'شروط استخدام BundlyPlus لشراء وتسليم الاشتراكات الرقمية عبر واتساب.'
            : 'Terms governing the use of BundlyPlus for purchasing and receiving digital subscriptions via WhatsApp.'
        }
        canonical="/terms"
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
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تشرح هذه الصفحة الشروط البسيطة التي توضح كيفية استخدام BundlyPlus وما الذي تتوقعه منا، وما الذي نطلبه منك بالمقابل.'
                : 'This page lays out the simple ground rules for using BundlyPlus — what you can expect from us, and what we expect from you in return.'}
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
              {isAr ? 'لديك سؤال؟ ' : 'Questions? '}
              <Link href="/contact" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                {isAr ? 'تواصل معنا' : 'Contact us'}
              </Link>
              {isAr ? ' وسنرد عبر واتساب.' : ' and we will reply on WhatsApp.'}
            </p>
          </footer>
        </motion.div>
      </PageLayout>
    </>
  );
}
