import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ar';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      bundles: 'Bundles',
      contactUs: 'Contact Us',
      switchLang: 'العربية',
    },
    hero: {
      badge: 'Popular in MENA',
      live: 'digital services available',
      line1: 'Your favorite subscriptions.',
      line2: 'Made to',
      line3: '',
      rotating: ['stream.', 'listen.', 'create.', 'learn.', 'watch.', 'design.'],
      subtitle: 'Get premium access to Netflix, Spotify, ChatGPT, Adobe and 50+ more - with fast WhatsApp delivery and local payment options.',
      cta: 'Browse All Plans',
      viewPackages: 'View Bundles',
      users: '10K+ Users',
      secure: 'Secure Checkout',
      setup: 'Fast Setup',
      marqueeLabel: 'Popular this week',
      from: 'from',
      getOnWhatsApp: 'Get on WhatsApp',
    },
    home: {
      topToolsLabel: 'Top Tools',
      topToolsTitle: 'Best of Bundly',
      viewAll: 'View All',
      viewAllProducts: 'View All Products',
    },
    discountPopup: {
      badge: 'May 1-2 only',
      title: '20% OFF',
      description: 'Celebrate the first days of May with 20% off your next digital subscription order.',
      window: 'Valid on May 1 and May 2. Ask for the May discount when you checkout on WhatsApp.',
      cta: 'Shop the deal',
      later: 'Maybe later',
      dismiss: 'Close discount popup',
    },
    whyUs: {
      label: 'Why Choose',
      brand: 'BundlyPlus',
      intro: "We curate the best digital tools so you don't have to. Enjoy premium features, strong savings, and simple support.",
      security: { title: 'Secure Ordering', desc: 'We keep checkout simple and confirm each order through trusted support channels.' },
      speed: { title: 'Fast Delivery', desc: 'Most digital subscriptions are delivered quickly after payment confirmation.' },
      integration: { title: 'All in One Place', desc: 'Find streaming, AI, design, and productivity tools in one easy catalog.' },
      support: { title: 'Helpful Support', desc: 'Message us on WhatsApp whenever you need help with an order or renewal.' },
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
      title: 'Trusted by Customers',
    },
    faq: {
      subtitle: 'Support',
      title: 'Got Questions?',
      q1: 'How does BundlyPlus work?',
      a1: "Browse the catalog, add subscriptions to your cart, and checkout through WhatsApp. We'll confirm payment and send the account details there.",
      q2: 'Are the accounts private or shared?',
      a2: 'We offer both. Each product description states whether the account is private or shared, so you know what you are ordering before checkout.',
      q3: 'How do I renew my subscriptions?',
      a3: 'Message us on WhatsApp when you want to renew, or reply to the renewal reminder if one is sent before your plan expires.',
      q4: 'Can I request specific tools?',
      a4: 'Yes. Message us on WhatsApp with the tools you need, and we will confirm what is available.',
    },
    footer: {
      description: 'Your digital service aggregator for premium subscriptions at accessible prices, delivered through WhatsApp.',
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
      allTypes: 'All types',
      resultSingular: '1 product',
      resultPlural: '{count} products',
      accountTypeFilter: 'Account type filter',
      sortProducts: 'Sort products',
      sortPopular: 'Sort: Popular',
      sortPriceAsc: 'Price: Low to high',
      sortPriceDesc: 'Price: High to low',
      sortName: 'Name: A to Z',
      noResults: 'No products found',
      noResultsDesc: 'Try adjusting your search or filter criteria.',
    },
    bundles: {
      title: 'Curated',
      gradientWord: 'Packages',
      subtitle: 'Maximize your savings with hand-picked bundles for entertainment, productivity, and creative tools.',
    },
    cart: {
      title: 'Review Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: "Looks like you haven't added any subscriptions to your cart yet.",
      startBrowsing: 'Start Browsing',
      viewBundles: 'View Bundles',
      orderSummary: 'Order Summary',
      items: 'Items',
      processingFee: 'Processing Fee',
      total: 'Total',
      checkout: 'Checkout via WhatsApp',
      checkoutNote: 'You will be redirected to WhatsApp to confirm your order and payment.',
      checkoutPaymentInstruction: 'Message us first. Please wait for our WhatsApp confirmation before sending payment.',
      checkoutHowWorks: 'How checkout works',
      checkoutFlow: [
        {
          title: 'Send order on WhatsApp',
          description: 'Message us first so we can confirm availability and the final amount.',
        },
        {
          title: 'Pay after confirmation',
          description: 'Use Whish, OMT, or USDT only after we reply with the payment go-ahead.',
        },
        {
          title: 'Receive account details',
          description: 'We send the login details and setup notes in the same WhatsApp chat.',
        },
      ],
      whatsappNotConfigured: 'Store WhatsApp number not configured.',
      instantDelivery: 'Instant delivery',
      securePayment: 'Secure payment',
      moneyBackGuarantee: 'Money-back guarantee',
      paymentMethods: 'Payment Methods',
      whishOmt: 'Whish Money & OMT',
      whishQrCode: 'Whish QR Code',
      whishQrAlt: 'Whish Money QR code',
      scanWhishApp: 'Scan in the Whish app',
      usdtWalletAddresses: 'USDT Wallet Addresses',
      paymentIntro: 'Send your order on WhatsApp first. We will confirm what to pay before you transfer.',
      whishPhoneHelp: 'Use this phone number after confirmation.',
      whishQrHelp: 'Scan in the Whish app after we confirm.',
      usdtNetworkHelp: 'Choose the exact network shown below.',
      whishOmtPhoneLabel: 'Whish and OMT phone number',
      usdtBep20Label: 'USDT BEP20 address',
      usdtTrc20Label: 'USDT TRC20 address',
      copy: 'Copy',
      copyFailed: 'Copy failed. Select and copy manually.',
      copiedLabel: '{label} copied',
      copyErrorLabel: 'Could not copy {label}',
    },
    productCard: {
      inCart: 'In Cart',
      hot: 'Hot',
      private: 'Private',
      shared: 'Shared',
      details: 'Details',
      viewDetails: 'View details for {name}',
      add: 'Add',
      added: 'Added',
      outOfStock: 'Out of stock',
      perMonth: '/month',
    },
    productDetails: {
      subscription: 'Subscription',
      account: 'Account',
      privateAccess: 'Dedicated access for your own use.',
      sharedAccess: 'Shared premium access with clear usage guidance.',
      accessConfirmed: 'Access details are confirmed after checkout.',
      renewal: 'Renewal',
      renewalHelp: 'Renew before expiry when you want to keep access active.',
      fastDelivery: 'Fast delivery',
      fastDeliveryHelp: 'Access details are sent through WhatsApp after checkout.',
      guarantee: 'Guarantee',
      guaranteeHelp: 'If access cannot be delivered, support will replace it or help with a refund.',
      includedFeatures: 'Included features',
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
      badge: 'شائع في الشرق الأوسط',
      live: 'خدمات رقمية متاحة',
      line1: 'اشتراكاتك المفضلة.',
      line2: 'مصممة لـ',
      line3: '',
      rotating: ['المشاهدة.', 'الاستماع.', 'الإبداع.', 'التعلم.', 'التصميم.', 'الإنجاز.'],
      subtitle: 'احصل على وصول مميز إلى Netflix وSpotify وChatGPT وAdobe وأكثر من 50 خدمة، مع تسليم سريع عبر واتساب وخيارات دفع محلية.',
      cta: 'استعرض كل الخطط',
      viewPackages: 'عرض الباقات',
      users: '+10 آلاف مستخدم',
      secure: 'دفع آمن',
      setup: 'إعداد سريع',
      marqueeLabel: 'الأكثر طلبا هذا الأسبوع',
      from: 'يبدأ من',
      getOnWhatsApp: 'اطلب عبر واتساب',
    },
    home: {
      topToolsLabel: 'أفضل الأدوات',
      topToolsTitle: 'الأفضل من Bundly',
      viewAll: 'عرض الكل',
      viewAllProducts: 'عرض كل المنتجات',
    },
    discountPopup: {
      badge: 'May 1-2 only',
      title: '20% OFF',
      description: 'Celebrate the first days of May with 20% off your next digital subscription order.',
      window: 'Valid on May 1 and May 2. Ask for the May discount when you checkout on WhatsApp.',
      cta: 'Shop the deal',
      later: 'Maybe later',
      dismiss: 'Close discount popup',
    },
    whyUs: {
      label: 'لماذا تختار',
      brand: 'BundlyPlus',
      intro: 'نختار لك أفضل الأدوات الرقمية لتصل إلى الميزات المميزة بتوفير واضح ودون تعقيد.',
      security: { title: 'طلب آمن', desc: 'نجعل عملية الدفع واضحة ونؤكد كل طلب عبر قنوات دعم موثوقة.' },
      speed: { title: 'تسليم سريع', desc: 'يتم تسليم معظم الاشتراكات الرقمية بسرعة بعد تأكيد الدفع.' },
      integration: { title: 'كل شيء في مكان واحد', desc: 'اعثر على خدمات البث والذكاء الاصطناعي والتصميم والإنتاجية في كتالوج واحد.' },
      support: { title: 'دعم مفيد', desc: 'راسلنا عبر واتساب متى احتجت مساعدة في طلب أو تجديد.' },
    },
    pricing: {
      subtitle: 'اختر باقتك',
      title: 'أسعار بسيطة وواضحة',
      mostPopular: 'الأكثر شيوعا',
      save: 'وفّر',
      was: 'كان',
      perMonth: '/شهر',
      choose: 'اختر',
    },
    testimonials: {
      subtitle: 'آراء العملاء',
      title: 'موثوق من العملاء',
    },
    faq: {
      subtitle: 'الدعم',
      title: 'لديك أسئلة؟',
      q1: 'كيف يعمل BundlyPlus؟',
      a1: 'تصفح الكتالوج، أضف الاشتراكات إلى السلة، ثم أكمل الطلب عبر واتساب. سنؤكد الدفع ونرسل تفاصيل الحساب هناك.',
      q2: 'هل الحسابات خاصة أم مشتركة؟',
      a2: 'نوفر الخيارين. يوضح وصف كل منتج ما إذا كان الحساب خاصا أو مشتركا حتى تعرف ما تطلبه قبل الدفع.',
      q3: 'كيف أجدد اشتراكي؟',
      a3: 'راسلنا عبر واتساب عندما تريد التجديد، أو رد على تذكير التجديد إذا تم إرساله قبل انتهاء خطتك.',
      q4: 'هل يمكنني طلب أدوات محددة؟',
      a4: 'نعم. راسلنا عبر واتساب بالأدوات التي تحتاجها، وسنخبرك بما هو متاح.',
    },
    footer: {
      description: 'منصة تجمع لك الاشتراكات الرقمية المميزة بأسعار مناسبة، مع تسليم عبر واتساب.',
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
      chat: 'الدردشة',
    },
    products: {
      title: 'الترسانة',
      gradientWord: 'الرقمية',
      subtitle: 'تصفح مجموعتنا الكاملة من البرامج المميزة وأدوات الذكاء الاصطناعي وخدمات البث.',
      searchPlaceholder: 'ابحث عن أدوات، ذكاء اصطناعي، بث...',
      all: 'الكل',
      allTypes: 'كل الأنواع',
      resultSingular: 'منتج واحد',
      resultPlural: '{count} منتجات',
      accountTypeFilter: 'فلتر نوع الحساب',
      sortProducts: 'ترتيب المنتجات',
      sortPopular: 'الترتيب: الأكثر شيوعا',
      sortPriceAsc: 'السعر: من الأقل إلى الأعلى',
      sortPriceDesc: 'السعر: من الأعلى إلى الأقل',
      sortName: 'الاسم: أ إلى ي',
      noResults: 'لا توجد منتجات',
      noResultsDesc: 'جرّب تعديل البحث أو الفلتر.',
    },
    bundles: {
      title: 'باقات',
      gradientWord: 'مختارة',
      subtitle: 'وفّر أكثر مع باقات مختارة للترفيه والإنتاجية والأدوات الإبداعية.',
    },
    cart: {
      title: 'مراجعة السلة',
      empty: 'سلتك فارغة',
      emptyDesc: 'يبدو أنك لم تضف أي اشتراكات إلى سلتك بعد.',
      startBrowsing: 'ابدأ التصفح',
      viewBundles: 'عرض الباقات',
      orderSummary: 'ملخص الطلب',
      items: 'العناصر',
      processingFee: 'رسوم المعالجة',
      total: 'الإجمالي',
      checkout: 'الدفع عبر واتساب',
      checkoutNote: 'سيتم تحويلك إلى واتساب لتأكيد الطلب والدفع.',
      checkoutPaymentInstruction: 'راسلنا أولا. يرجى انتظار تأكيدنا عبر واتساب قبل إرسال الدفع.',
      checkoutHowWorks: 'كيف تتم عملية الدفع',
      checkoutFlow: [
        {
          title: 'أرسل الطلب على واتساب',
          description: 'راسلنا أولا حتى نؤكد التوفر والمبلغ النهائي.',
        },
        {
          title: 'ادفع بعد التأكيد',
          description: 'استخدم Whish أو OMT أو USDT فقط بعد أن نرسل لك موافقة الدفع.',
        },
        {
          title: 'استلم تفاصيل الحساب',
          description: 'نرسل بيانات الدخول وملاحظات الإعداد في نفس محادثة واتساب.',
        },
      ],
      whatsappNotConfigured: 'رقم واتساب المتجر غير مضبوط.',
      instantDelivery: 'تسليم فوري',
      securePayment: 'دفع آمن',
      moneyBackGuarantee: 'ضمان استرداد',
      paymentMethods: 'طرق الدفع',
      whishOmt: 'ويش موني وOMT',
      whishQrCode: 'رمز Whish QR',
      whishQrAlt: 'رمز Whish Money QR',
      scanWhishApp: 'امسح الرمز في تطبيق Whish',
      usdtWalletAddresses: 'عناوين محفظة USDT',
      paymentIntro: 'أرسل طلبك على واتساب أولا. سنؤكد المبلغ المطلوب قبل التحويل.',
      whishPhoneHelp: 'استخدم هذا الرقم بعد التأكيد.',
      whishQrHelp: 'امسح الرمز في تطبيق Whish بعد أن نؤكد الطلب.',
      usdtNetworkHelp: 'اختر الشبكة المطابقة تماما لما يظهر أدناه.',
      whishOmtPhoneLabel: 'رقم هاتف Whish وOMT',
      usdtBep20Label: 'عنوان USDT BEP20',
      usdtTrc20Label: 'عنوان USDT TRC20',
      copy: 'نسخ',
      copyFailed: 'تعذر النسخ. حدد النص وانسخه يدويا.',
      copiedLabel: 'تم نسخ {label}',
      copyErrorLabel: 'تعذر نسخ {label}',
    },
    productCard: {
      inCart: 'في السلة',
      hot: 'رائج',
      private: 'خاص',
      shared: 'مشترك',
      details: 'التفاصيل',
      viewDetails: 'عرض تفاصيل {name}',
      add: 'أضف',
      added: 'أضيف',
      outOfStock: 'غير متوفر',
      perMonth: '/شهر',
    },
    productDetails: {
      subscription: 'اشتراك',
      account: 'الحساب',
      privateAccess: 'وصول مخصص لاستخدامك الشخصي.',
      sharedAccess: 'وصول مشترك مع إرشادات استخدام واضحة.',
      accessConfirmed: 'يتم تأكيد تفاصيل الوصول بعد إتمام الطلب.',
      renewal: 'التجديد',
      renewalHelp: 'جدد قبل انتهاء الاشتراك عندما تريد إبقاء الوصول فعالا.',
      fastDelivery: 'تسليم سريع',
      fastDeliveryHelp: 'يتم إرسال تفاصيل الوصول عبر واتساب بعد إتمام الطلب.',
      guarantee: 'الضمان',
      guaranteeHelp: 'إذا تعذر تسليم الوصول، سيساعدك الدعم باستبداله أو الاسترداد.',
      includedFeatures: 'الميزات المضمنة',
    },
    bundleCard: {
      save: 'وفّر',
      inCart: 'في السلة',
      addAnother: 'أضف المزيد',
      addToCart: 'أضف الباقة إلى السلة',
    },
    notFound: {
      title: 'الصفحة غير موجودة',
      desc: 'عذرا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لنعدك إلى المسار الصحيح.',
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
