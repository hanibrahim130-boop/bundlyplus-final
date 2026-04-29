import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ar';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      bundles: 'Bundles',
      contactUs: 'Contact Us',
      switchLang: 'عربي',
    },
    hero: {
      badge: 'Trending now in MENA',
      live: 'people upgraded today',
      line1: 'Your favorite subscriptions.',
      line2: 'Made to',
      line3: '',
      rotating: ['stream.', 'listen.', 'create.', 'learn.', 'watch.', 'design.'],
      subtitle: 'Get premium access to Netflix, Spotify, ChatGPT, Adobe and 50+ more — at up to 90% off, delivered instantly on WhatsApp.',
      cta: 'Browse All Plans',
      viewPackages: 'View Bundles',
      users: '10K+ Users',
      secure: '100% Secure',
      setup: 'Instant Setup',
      marqueeLabel: 'Most ordered this week',
      from: 'from',
      getOnWhatsApp: 'Get on WhatsApp',
    },
    home: {
      topToolsLabel: 'Top Tools',
      topToolsTitle: 'Best of Bundly',
      viewAll: 'View All',
      viewAllProducts: 'View All Products',
    },
    whyUs: {
      label: 'Why Choose',
      brand: 'BundlyPlus',
      intro: "We curate the best digital tools so you don't have to. Enjoy premium features, massive savings, and zero hassle.",
      security: { title: 'Unmatched Security', desc: 'State-of-the-art encryption to keep your data safe and secure.' },
      speed: { title: 'Blazing Speed', desc: 'Experience rapid performance and minimal load times for all tools.' },
      integration: { title: 'Seamless Integration', desc: 'Effortlessly connect all your essential services in one place.' },
      support: { title: '24/7 Support', desc: 'Our dedicated team is always here to help you around the clock.' },
    },
    pricing: {
      subtitle: 'Pick Your Bundle',
      title: 'Simple, transparent pricing',
      mostPopular: 'Most Popular',
      save: 'Save',
      was: 'was',
      perMonth: '/mo',
      choose: 'Choose',
    },
    testimonials: {
      subtitle: 'Reviews',
      title: 'Trusted by Thousands',
    },
    faq: {
      subtitle: 'Support',
      title: 'Got Questions?',
      q1: 'How does BundlyPlus work?',
      a1: "Simply browse our catalog, add your desired subscriptions or bundles to your cart, and click checkout. You'll be redirected to WhatsApp to finalize your order and receive your account details instantly.",
      q2: 'Are the accounts private or shared?',
      a2: "We offer both! The product description clearly states if an account is private (only for you) or shared (profile on a master account). Private accounts offer full customization and zero interruptions.",
      q3: 'How do I renew my subscriptions?',
      a3: 'We will send you a friendly WhatsApp reminder 3 days before your subscription expires. You can easily renew with a quick message.',
      q4: 'Can I create a custom bundle?',
      a4: "Absolutely! Choose the 'Ultimate' tier or just message us on WhatsApp with the specific tools you need, and we'll create a custom discounted package just for you.",
    },
    footer: {
      description: 'Your ultimate digital service aggregator. Discover premium subscriptions and bundles at unbeatable prices, delivered instantly.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      refund: 'Refund Policy',
      contact: 'Contact Us',
      rights: 'All rights reserved.',
    },
    bottomNav: {
      home: 'Home',
      products: 'Products',
      bundles: 'Bundles',
      cart: 'Cart',
      chat: 'Chat',
    },
    products: {
      title: 'Digital',
      gradientWord: 'Arsenal',
      subtitle: 'Browse our complete collection of premium software, AI tools, and streaming subscriptions.',
      searchPlaceholder: 'Search for tools, AI, streaming...',
      all: 'All',
      noResults: 'No products found',
      noResultsDesc: 'Try adjusting your search or filter criteria.',
    },
    bundles: {
      title: 'Curated',
      gradientWord: 'Packages',
      subtitle: 'Maximize your savings with our hand-picked bundles. Get all your favorite entertainment and productivity tools in one go.',
    },
    cart: {
      title: 'Review Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: "Looks like you haven't added any subscriptions or bundles to your cart yet.",
      startBrowsing: 'Start Browsing',
      viewBundles: 'View Bundles',
      orderSummary: 'Order Summary',
      items: 'Items',
      processingFee: 'Processing Fee',
      total: 'Total',
      checkout: 'Checkout via WhatsApp',
      checkoutNote: 'You will be redirected to WhatsApp to finalize payment securely.',
      whatsappNotConfigured: 'Store WhatsApp number not configured.',
    },
    productCard: {
      inCart: 'In Cart',
      hot: 'Hot',
      private: 'Private',
      shared: 'Shared',
      add: 'Add',
      added: 'Added',
      perMonth: '/month',
    },
    bundleCard: {
      save: 'Save',
      inCart: 'In Cart',
      addAnother: 'Add Another',
      addToCart: 'Add Bundle to Cart',
    },
    notFound: {
      title: 'Page not found',
      desc: "Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.",
      back: 'Back to Home',
    },
  },

  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      bundles: 'الباقات',
      contactUs: 'تواصل معنا',
      switchLang: 'English',
    },
    hero: {
      badge: 'الأكثر رواجاً في الشرق الأوسط',
      live: 'شخص قام بالترقية اليوم',
      line1: 'اشتراكاتك المفضلة.',
      line2: 'مصممة لـ',
      line3: '',
      rotating: ['المشاهدة.', 'الاستماع.', 'الإبداع.', 'التعلّم.', 'التصميم.', 'القراءة.'],
      subtitle: 'احصل على وصول مميز لـ نتفليكس وسبوتيفاي وChatGPT وأدوبي و50+ خدمة — بخصم يصل إلى 90%، تُسلَّم فوراً عبر واتساب.',
      cta: 'استعرض جميع الخطط',
      viewPackages: 'عرض الباقات',
      users: '+10 آلاف مستخدم',
      secure: '100% آمن',
      setup: 'إعداد فوري',
      marqueeLabel: 'الأكثر طلباً هذا الأسبوع',
      from: 'يبدأ من',
      getOnWhatsApp: 'احصل عليه عبر واتساب',
    },
    home: {
      topToolsLabel: 'أفضل الأدوات',
      topToolsTitle: 'أفضل ما في بندلي',
      viewAll: 'عرض الكل',
      viewAllProducts: 'عرض جميع المنتجات',
    },
    whyUs: {
      label: 'لماذا تختار',
      brand: 'BundlyPlus',
      intro: 'نختار لك أفضل الأدوات الرقمية حتى لا تضطر إلى ذلك. استمتع بميزات متميزة، وتوفير هائل، وبدون أي تعقيد.',
      security: { title: 'أمان لا مثيل له', desc: 'تشفير بأحدث التقنيات لإبقاء بياناتك آمنة ومحمية.' },
      speed: { title: 'سرعة فائقة', desc: 'استمتع بأداء سريع وأوقات تحميل منخفضة لجميع الأدوات.' },
      integration: { title: 'تكامل سلس', desc: 'اربط جميع خدماتك الأساسية في مكان واحد بكل سهولة.' },
      support: { title: 'دعم على مدار الساعة', desc: 'فريقنا المتخصص دائماً هنا لمساعدتك في أي وقت.' },
    },
    pricing: {
      subtitle: 'اختر باقتك',
      title: 'أسعار بسيطة وشفافة',
      mostPopular: 'الأكثر شيوعاً',
      save: 'وفّر',
      was: 'كان',
      perMonth: '/شهر',
      choose: 'اختر',
    },
    testimonials: {
      subtitle: 'التقييمات',
      title: 'موثوق من قِبل الآلاف',
    },
    faq: {
      subtitle: 'الدعم',
      title: 'لديك أسئلة؟',
      q1: 'كيف يعمل BundlyPlus؟',
      a1: 'ببساطة، تصفّح الكتالوج وأضف الاشتراكات أو الباقات التي تريدها إلى سلتك، ثم انقر على تسجيل الخروج. سيتم توجيهك إلى واتساب لإتمام طلبك واستلام تفاصيل حسابك فوراً.',
      q2: 'هل الحسابات خاصة أم مشتركة؟',
      a2: 'نقدم كلاهما! يوضح وصف المنتج بجلاء ما إذا كان الحساب خاصاً (لك وحدك) أم مشتركاً (ملف على حساب رئيسي). الحسابات الخاصة توفر تخصيصاً كاملاً وصفر انقطاعات.',
      q3: 'كيف أجدد اشتراكاتي؟',
      a3: 'سنرسل لك تذكيراً ودياً عبر واتساب قبل 3 أيام من انتهاء اشتراكك. يمكنك التجديد بسهولة برسالة سريعة.',
      q4: 'هل يمكنني إنشاء باقة مخصصة؟',
      a4: "بالتأكيد! اختر خطة \"الأقصى\" أو راسلنا على واتساب بالأدوات التي تحتاجها، وسنُنشئ لك باقة مخفضة مخصصة.",
    },
    footer: {
      description: 'أفضل منصة لتجميع الخدمات الرقمية. اكتشف اشتراكات وباقات مميزة بأسعار لا تُقاوم، تُسلَّم فوراً.',
      quickLinks: 'روابط سريعة',
      legal: 'قانوني',
      terms: 'شروط الخدمة',
      privacy: 'سياسة الخصوصية',
      refund: 'سياسة الاسترداد',
      contact: 'تواصل معنا',
      rights: 'جميع الحقوق محفوظة.',
    },
    bottomNav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      bundles: 'الباقات',
      cart: 'السلة',
      chat: 'دردشة',
    },
    products: {
      title: 'الترسانة',
      gradientWord: 'الرقمية',
      subtitle: 'تصفح مجموعتنا الكاملة من البرمجيات المميزة وأدوات الذكاء الاصطناعي وخدمات البث.',
      searchPlaceholder: 'ابحث عن أدوات، ذكاء اصطناعي، بث...',
      all: 'الكل',
      noResults: 'لا توجد منتجات',
      noResultsDesc: 'جرّب تعديل معايير البحث أو الفلتر.',
    },
    bundles: {
      title: 'باقات',
      gradientWord: 'منتقاة',
      subtitle: 'حقق أقصى توفير مع باقاتنا المختارة بعناية. احصل على جميع أدوات الترفيه والإنتاجية المفضلة لديك في آنٍ واحد.',
    },
    cart: {
      title: 'مراجعة سلتك',
      empty: 'سلتك فارغة',
      emptyDesc: 'يبدو أنك لم تضف أي اشتراكات أو باقات إلى سلتك بعد.',
      startBrowsing: 'ابدأ التصفح',
      viewBundles: 'عرض الباقات',
      orderSummary: 'ملخص الطلب',
      items: 'العناصر',
      processingFee: 'رسوم المعالجة',
      total: 'الإجمالي',
      checkout: 'الدفع عبر واتساب',
      checkoutNote: 'سيتم توجيهك إلى واتساب لإتمام الدفع بأمان.',
      whatsappNotConfigured: 'رقم واتساب المتجر غير مُعيَّن.',
    },
    productCard: {
      inCart: 'في السلة',
      hot: 'رائج',
      private: 'خاص',
      shared: 'مشترك',
      add: 'أضف',
      added: 'أُضيف',
      perMonth: '/شهر',
    },
    bundleCard: {
      save: 'وفّر',
      inCart: 'في السلة',
      addAnother: 'أضف مزيداً',
      addToCart: 'أضف الباقة للسلة',
    },
    notFound: {
      title: 'الصفحة غير موجودة',
      desc: 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نعيدك إلى المسار الصحيح.',
      back: 'العودة للرئيسية',
    },
  },
} as const;

export type T = typeof translations['en'];

interface I18nContextValue {
  lang: Lang;
  t: T;
  toggleLang: () => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  t: translations.en,
  toggleLang: () => {},
  isRTL: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('bundlyplus-lang') as Lang | null;
    if (saved === 'ar' || saved === 'en') return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('ar') ? 'ar' : 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (lang === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
    localStorage.setItem('bundlyplus-lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang] as T, toggleLang, isRTL: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
