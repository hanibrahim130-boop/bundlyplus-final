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
    heading: '1. Digital Subscriptions Are Delivered Quickly',
    paragraphs: [
      'Most subscriptions are delivered within minutes of your payment being confirmed. Some products take longer because they need manual provisioning or upstream activation; if that is the case we tell you the expected window in the same WhatsApp chat.',
      'Once login or activation details have been delivered and the subscription has been opened from your side, the order is considered fulfilled.',
    ],
  },
  {
    heading: '2. Replacement & Support First',
    paragraphs: [
      'Our default response when something goes wrong is to fix it, not to argue about it. If a delivered subscription fails (wrong credentials, expired key, blocked region, captcha lock, provider downtime), message us and we will:',
    ],
    bullets: [
      'Verify the issue from our side, often in minutes.',
      'Send a working replacement, a fresh seat on a shared plan, or a new activation key.',
      'Reset, rotate, or re-provision your access if a shared account was disturbed.',
      'Extend your subscription duration to make up for downtime when reasonable.',
    ],
  },
  {
    heading: '3. When Refunds Are Granted',
    paragraphs: [
      'You are eligible for a full or partial refund in the following cases:',
    ],
    bullets: [
      'We are unable to deliver the subscription you ordered within the window we promised.',
      'A replacement is not possible (the product is no longer offered or the provider blocked the region) and you do not want store credit.',
      'You were charged for an order we cancelled before delivery.',
      'A duplicate payment was made for the same order.',
    ],
  },
  {
    heading: '4. When Refunds Are Not Granted',
    paragraphs: [
      'We do not refund:',
    ],
    bullets: [
      'Orders where access was successfully delivered and used (you signed in, watched, generated content, etc.).',
      'Issues caused by sharing credentials publicly, abusing fair-use limits, or violating the upstream provider\u2019s terms.',
      'Provider-side feature changes outside of our control (a streaming service drops a title, a tool changes its plan structure, etc.) — we will help you migrate or compensate inside our catalog instead.',
      'Buyer\u2019s remorse on a successfully delivered subscription.',
    ],
  },
  {
    heading: '5. How to Request a Refund',
    paragraphs: [
      'Message us on WhatsApp from the same number you used to check out and include your order reference (BundlyPlus sends one in the confirmation message). Tell us briefly what went wrong and attach a screenshot if helpful.',
      'Most decisions land within 24–48 hours. Approved refunds are sent back through the same payment method whenever possible (Whish Money, OMT, USDT). If that is not possible we offer equivalent store credit.',
    ],
  },
  {
    heading: '6. Time Frame',
    paragraphs: [
      'Refund requests must be opened within 25 days of delivery. After that we will still help with replacements and support but cash refunds are case-by-case.',
    ],
  },
];

const SECTIONS_AR: Section[] = [
  {
    heading: '١. الاشتراكات الرقمية تُسلَّم بسرعة',
    paragraphs: [
      'تُسلَّم معظم الاشتراكات خلال دقائق من تأكيد الدفع. تحتاج بعض المنتجات وقتاً أطول لأنها تتطلب تفعيلاً يدوياً أو من المزود الأصلي، وفي هذه الحالة نخبرك بالمدة المتوقعة في نفس محادثة واتساب.',
      'بمجرد تسليم بيانات الدخول أو التفعيل وفتح الاشتراك من جهتك، يُعدّ الطلب منفّذاً.',
    ],
  },
  {
    heading: '٢. الاستبدال والدعم أولاً',
    paragraphs: [
      'موقفنا الافتراضي عندما يحدث خطأ هو حلّه، لا الجدال حوله. إذا تعطّل اشتراك سُلِّم لك (بيانات خاطئة، مفتاح منتهٍ، منطقة محجوبة، قفل كابتشا، انقطاع لدى المزود)، راسلنا وسنقوم بـ:',
    ],
    bullets: [
      'التحقق من المشكلة من جهتنا، غالباً خلال دقائق.',
      'إرسال بديل يعمل أو مقعد جديد على باقة مشتركة أو مفتاح تفعيل جديد.',
      'إعادة تعيين الوصول أو تدويره أو إعادة تجهيزه إذا تعطّل حساب مشترك.',
      'تمديد مدة اشتراكك لتعويض فترة الانقطاع عند الحاجة.',
    ],
  },
  {
    heading: '٣. متى يُمنح الاسترداد',
    paragraphs: [
      'يحق لك استرداد كامل أو جزئي في الحالات التالية:',
    ],
    bullets: [
      'تعذّر علينا تسليم الاشتراك خلال المدة التي وعدنا بها.',
      'لا يمكن تقديم بديل (لم يعد المنتج متوفراً أو حُجبت المنطقة) ولم تقبل برصيد للمتجر.',
      'دُفع مبلغ عن طلب ألغيناه قبل التسليم.',
      'تم تنفيذ دفعة مكررة لنفس الطلب.',
    ],
  },
  {
    heading: '٤. متى لا يُمنح الاسترداد',
    paragraphs: [
      'لا نسترد قيمة:',
    ],
    bullets: [
      'الطلبات التي سُلِّم وصولها بنجاح وتم استخدامه (سجّلت الدخول، شاهدت، أنشأت محتوى، إلخ).',
      'مشكلات ناتجة عن مشاركة بيانات الدخول علناً أو إساءة استخدام حدود الاستخدام العادل أو مخالفة شروط المزود الأصلي.',
      'تغييرات لدى المزود لا نتحكم بها (شطب عنوان من خدمة بث، تغيير في خطط أداة، إلخ) — سنساعدك في الانتقال أو نعوّضك ضمن كتالوجنا بدلاً من ذلك.',
      'تغيّر رأي المشتري بعد تسليم اشتراك يعمل بشكل صحيح.',
    ],
  },
  {
    heading: '٥. كيفية طلب الاسترداد',
    paragraphs: [
      'راسلنا عبر واتساب من نفس الرقم الذي استخدمته عند الطلب، وأرفق رقم مرجع الطلب (يرسله BundlyPlus في رسالة التأكيد). أخبرنا باختصار ما المشكلة وأرفق لقطة شاشة إن لزم.',
      'تصدر معظم القرارات خلال ٢٤ إلى ٤٨ ساعة. تُعاد الاستردادات المعتمدة عبر نفس وسيلة الدفع كلما أمكن (Whish Money أو OMT أو USDT)، وإلا نقدّم رصيداً مكافئاً للمتجر.',
    ],
  },
  {
    heading: '٦. الإطار الزمني',
    paragraphs: [
      'يجب فتح طلب الاسترداد خلال ٧ أيام من التسليم. بعد ذلك نواصل مساعدتك في الاستبدال والدعم، لكن استرداد المبلغ النقدي يُدرس حالة بحالة.',
    ],
  },
];

export default function RefundPolicy() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const sections = isAr ? SECTIONS_AR : SECTIONS_EN;

  return (
    <>
      <Seo
        title={isAr ? 'سياسة الاسترداد' : 'Refund Policy'}
        description={
          isAr
            ? 'كيف تتعامل BundlyPlus مع الاستبدال والدعم والاسترداد للاشتراكات الرقمية المسلَّمة عبر واتساب.'
            : 'How BundlyPlus handles replacements, support, and refunds for digital subscriptions delivered via WhatsApp.'
        }
        canonical="/refund-policy"
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
              {isAr ? 'سياسة الاسترداد' : 'Refund Policy'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'سياستنا واضحة: نُصلح المشكلة قبل الجدال حولها. الاستبدال والدعم أولاً؛ الاسترداد عندما لا نستطيع تسليم ما طلبته.'
                : 'Our policy is simple: we fix issues before we argue about them. Replacement and support first; refunds when we cannot deliver what you ordered.'}
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
              {isAr ? 'لفتح طلب استبدال أو استرداد، ' : 'To open a replacement or refund request, '}
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
