import React from "react";
import { SignUp } from "@clerk/react";
import { basePath } from "@/lib/clerk-appearance";
import { Seo } from "@/components/seo/Seo";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, LayoutDashboard, Bell, Zap } from "lucide-react";

const benefitsEn = [
  { icon: LayoutDashboard, text: 'Track all subscriptions in one dashboard' },
  { icon: Bell, text: 'Get renewal reminders before plans expire' },
  { icon: Zap, text: 'Faster checkout with saved profile info' },
  { icon: CheckCircle2, text: 'Exclusive offers for members' },
];

const benefitsAr = [
  { icon: LayoutDashboard, text: 'تابع اشتراكاتك في لوحة واحدة' },
  { icon: Bell, text: 'احصل على تذكيرات التجديد قبل انتهاء الخطط' },
  { icon: Zap, text: 'دفع أسرع مع معلومات محفوظة' },
  { icon: CheckCircle2, text: 'عروض حصرية للأعضاء' },
];

export default function SignUpPage() {
  const { lang } = useI18n();
  const benefits = lang === 'ar' ? benefitsAr : benefitsEn;

  return (
    <>
      <Seo title="Create account" canonical="/sign-up" noIndex />
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 pt-28 pb-16">
        <h1 className="sr-only">
          {lang === 'ar' ? 'إنشاء حساب BundlyPlus' : 'Create a BundlyPlus account'}
        </h1>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 max-w-4xl w-full">
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            fallbackRedirectUrl={`${basePath}/account`}
          />
          <div className="hidden lg:block flex-shrink-0 max-w-xs pt-12">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {lang === 'ar' ? 'لماذا إنشاء حساب؟' : 'Why create an account?'}
            </h2>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <b.icon size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
