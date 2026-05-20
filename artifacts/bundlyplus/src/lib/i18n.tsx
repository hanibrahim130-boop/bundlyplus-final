import React, { createContext, useContext, useEffect, useState } from 'react';
import { ANALYTICS_EVENTS, trackEvent } from './analytics';

export type Lang = 'en' | 'ar';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      comingSoon: 'Coming Soon',
      contactUs: 'Contact Us',
      switchLang: 'العربية',
    },
    hero: {
      badge: 'Global coverage',
      live: 'digital services available',
      line1: 'Your favorite subscriptions.',
      line2: 'Made to',
      line3: '',
      rotating: ['stream.', 'listen.', 'create.', 'learn.', 'watch.', 'design.'],
      subtitle: 'Get premium access to Netflix, Spotify, ChatGPT, Adobe and 50+ more - with fast WhatsApp delivery and local payment options.',
      cta: 'Browse All Plans',
      users: '250+',
      secure: 'Secure Checkout',
      setup: 'Fast Setup',
      marqueeLabel: 'Popular this week',
      from: 'from',
      getOnWhatsApp: 'Get on WhatsApp',
      savingsPill: 'Save up to 80% — prices from $4.99/mo',
      socialProof: [
        'Karim from Beirut saved $84 last month',
        'Nour from Tripoli just subscribed to Netflix + Spotify',
        'Elie from Jounieh renewed ChatGPT Plus for the 3rd time',
        'Rima from Saida switched from the app store and saved $61',
        'Jad from Byblos bundled 4 services and cut his bill in half',
      ],
      // ---- new MENA-focused copy (used by the rewritten hero) ----
      mainHeadline:
        'Netflix + ChatGPT + Adobe + IPTV Premium Subscriptions at the Best Prices Worldwide 🔥',
      mainSubtitle:
        'Instant WhatsApp Delivery • Card • OMT • Bank Transfer • 25-Day Guarantee • Trusted by 500+ Customers',
      primaryCta: 'Browse Subscriptions Now',
      secondaryCta: 'Chat with Us on WhatsApp',
      trustBadges: {
        instantDelivery: 'Instant Delivery',
        localPayment: 'Local Payment',
        moneyBack: '25-Day Money Back',
        lebanese: 'Lebanese Service',
      },
      // ---- editorial / luxury copy (v4 hero rebuild — kept for reference, not rendered) ----
      editorial: {
        kicker: 'WORLDWIDE · TOP SELECTION',
        headline: {
          line1: 'The quiet way',
          line2: 'to own the',
          line3: 'subscriptions',
          line4: 'you already use.',
        },
        subtitle:
          'A curated catalog of streaming, AI, and creative tools — sourced, priced, and delivered for Beirut and the wider region.',
        primaryCta: 'View the catalogue',
        secondaryCta: 'Speak to the house',
        sections: ['Streaming', 'Artificial Intelligence', 'Creative Suite', 'Lifestyle'],
        catalogueCount: '149 services',
        since: 'Beirut · 2024',
      },
      // ---- Apple-style rebuild (v5) — used by the current Hero ----
      apple: {
        overline: 'PREMIUM DIGITAL SUBSCRIPTIONS · WORLDWIDE',
        headline: 'Everything you stream.',
        headlineAccent: 'For a fraction of the price.',
        subline:
          'Netflix, ChatGPT, Adobe, Spotify, IPTV and {count} more — delivered to your phone in minutes. Pay via Card, Whish, OMT, Bank Transfer or MoneyGram.',
        primaryCta: 'Browse all subscriptions',
        secondaryCta: 'Chat on WhatsApp',
        trustPills: [
          'Instant WhatsApp delivery',
          '25-day money-back',
          'Trusted by 500+ customers',
        ],
      },
      // ---- Apple rebuild: homepage subsections ----
      tickerLabel: 'Popular right now',
      trust: {
        overline: 'WHY BUNDLYPLUS',
        title: 'Premium access, without the premium bill.',
        lead:
          'We source subscriptions at retail and hand them off to you at a fraction of the price — fast, private, and globally accessible.',
        items: [
          {
            title: 'Delivered in minutes',
            desc: 'Pay, receive, log in. Most orders complete inside the same WhatsApp chat.',
          },
          {
            title: 'Pay the local way',
            desc: 'Card, Whish Money, OMT, Bank Transfer, or MoneyGram. Fast, global, no fees.',
          },
          {
            title: '25-day guarantee',
            desc: 'Access problems? We replace the account or return your money. No argument, no forms.',
          },
          {
            title: 'Lebanese team, Arabic support',
            desc: 'Beirut-based support on WhatsApp from morning to midnight, every day of the week.',
          },
        ],
      },
      categories: {
        overline: 'BROWSE',
        title: 'Every tool, one catalog.',
        lead: '10 categories. {count} products. One place to manage your digital life.',
      },
    },
    home: {
      // Apple rebuild headings for catalog sections
      catalogOverline: 'THE CATALOG',
      catalogTitle: 'Subscriptions worth owning.',
      catalogLead:
        'Six picks our customers renew again and again — curated from the full {count}-product catalog.',
      viewAllProductsCount: 'View all {count} products',
      pricingOverline: 'PRICING',
      pricingTitle: 'One simple rule: less than retail, every time.',
      pricingLead:
        'Every subscription comes in four durations. The longer you commit, the more you save — up to 17% on the annual tier.',
      topToolsLabel: 'Top Tools',
      topToolsTitle: 'Best of Bundly',
      viewAll: 'View All',
      viewAllProducts: 'View All Products',
    },
    madeForMena: {
      badge: 'AI picks for work, code, content, and design',
      title: 'Best AI tools',
      titleHighlight: 'ready in minutes.',
      description: 'Premium AI subscriptions for writing, research, coding, design, and video creation, curated from the software catalog and priced for easy monthly access.',
      viewAll: 'Explore all AI tools',
      tagChat: 'Chat assistants',
      tagResearch: 'Research and coding',
      tagCreative: 'Creative generation',
    },
    discountPopup: {
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
      // Apple rebuild — duration labels
      duration: {
        oneMonth: '1 Month',
        threeMonths: '3 Months',
        sixMonths: '6 Months',
        oneYear: '1 Year',
      },
      recommended: 'Best value',
      orderWhatsApp: 'Order on WhatsApp',
      total: 'Total',
      effectivePerMonth: 'per month',
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
      analytics: 'We use privacy-friendly analytics with anonymized IPs and no session recording.',
    },
    bottomNav: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      chat: 'Chat',
      account: 'Account',
    },
    account: {
      profile: 'Profile',
      profileDesc: 'Update your contact details and language preferences.',
      mySubscriptions: 'My Subscriptions',
      subsDesc: 'Track active plans and renew before they expire.',
      myOrders: 'My Orders',
      ordersDesc: 'Review past orders and their fulfillment status.',
      signIn: 'Sign in',
      signOut: 'Sign out',
      signedOutTitle: 'Sign in to your account',
      signedOutDesc: 'Manage your subscriptions, orders and saved items in one place.',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone (WhatsApp)',
      preferredLang: 'Preferred language',
      preferredCurrency: 'Preferred currency',
      save: 'Save changes',
      saved: 'Profile saved',
      saveError: 'Could not save profile',
      loadError: 'Could not load profile',
      loading: 'Loading…',
      noSubsTitle: 'No subscriptions yet',
      noSubsDesc: 'Once an order is delivered, your active plans appear here.',
      noOrdersTitle: 'No orders yet',
      noOrdersDesc: 'Browse the catalog and complete a checkout on WhatsApp to start.',
      browseCatalog: 'Browse the catalog',
      orderRef: 'Order',
      expires: 'Expires',
      renewSoon: 'Renew soon',
      renewWhatsapp: 'Renew on WhatsApp',
      statusActive: 'Active',
      statusExpired: 'Expired',
      statusPending: 'Pending',
      statusConfirmed: 'Confirmed',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled',
    },
    admin: {
      tabs: {
        products: 'Products',
        orders: 'Orders',
        customers: 'Customers',
        reminders: 'Reminders',
        promotions: 'Promotions',
        analytics: 'Analytics',
      },
      orders: {
        title: 'Orders',
        empty: 'No orders yet.',
        markConfirmed: 'Mark confirmed',
        markDelivered: 'Mark delivered & create subscriptions',
        markCancelled: 'Cancel',
        loading: 'Loading orders…',
        statusFilter: 'Status',
        all: 'All',
        customer: 'Customer',
        items: 'Items',
        subsCreated: 'Created {count} subscriptions',
      },
      customers: {
        title: 'Customers',
        empty: 'No customers yet.',
        joined: 'Joined',
        active: 'active',
        orders: 'orders',
      },
      reminders: {
        title: 'Renewal reminders',
        intro: 'Subscriptions expiring within {days} days. Send the renewal message and mark as sent.',
        empty: 'Nothing expiring in the next {days} days.',
        send: 'Open WhatsApp',
        markSent: 'Mark as sent',
        sentJustNow: 'Reminder sent',
        daysLeft: '{count}d left',
      },
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
    cart: {
      title: 'Review Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: "Looks like you haven't added any subscriptions to your cart yet.",
      startBrowsing: 'Start Browsing',
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
          description: 'Use Card, Whish Money, OMT, Bank Transfer, or MoneyGram after we reply with the payment go-ahead.',
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
      paymentIntro: 'Send your order on WhatsApp first. We will confirm what to pay before you transfer.',
      whishPhoneHelp: 'Use this phone number after confirmation.',
      whishQrHelp: 'Scan in the Whish app after we confirm.',
      whishOmtPhoneLabel: 'Whish and OMT phone number',
      youSave: 'You save',
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
      // Apple rebuild — product detail
      overline: 'DIGITAL SUBSCRIPTION',
      featuresTitle: 'What you get',
      pricingTitle: 'Choose your plan',
      pricingSubtitle: 'Lock in a longer term, save more. Every plan is paid once and activated instantly.',
      faqTitle: 'Frequently asked',
      faq: [
        {
          q: 'How quickly will I receive my account?',
          a: 'Most orders are delivered on WhatsApp within 5 to 15 minutes during working hours. Overnight orders are handled first thing the next morning.',
        },
        {
          q: 'What if something goes wrong?',
          a: "You're covered by our 25-day guarantee. If the account stops working, message us on WhatsApp with your order ref — we'll replace it or refund you.",
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Card, Whish Money, OMT, Bank Transfer, and MoneyGram. Payment instructions arrive after we confirm your order.',
        },
        {
          q: 'Is this shared or private?',
          a: 'Some subscriptions are shared (logged into on a limited number of devices), others are private (all yours). Check the account type badge near the top of this page.',
        },
      ],
      stickyOrderCta: 'Order via WhatsApp',
      stickyFrom: 'From',
      backToProducts: 'Back to all products',
    },
    comingSoon: {
      title: 'Something new is coming...',
      description: 'BundlyPlus is about to grow beyond digital subscriptions. Real products, delivered to your door — coming soon.',
      teaserText: 'We are not spilling the beans yet… but get your wishlist ready.',
      browseLive: 'Browse what is live now',
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
      comingSoon: 'قريباً',
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
      subtitle:
        'احصل على وصول مميز إلى Netflix وSpotify وChatGPT وAdobe وأكثر من 50 خدمة، مع تسليم سريع عبر واتساب وخيارات دفع محلية.',
      cta: 'استعرض كل الخطط',
      users: '+250',
      secure: 'دفع آمن',
      setup: 'إعداد سريع',
      marqueeLabel: 'الأكثر طلبا هذا الأسبوع',
      from: 'يبدأ من',
      getOnWhatsApp: 'اطلب عبر واتساب',
      savingsPill: 'وفّر حتى 80% — أسعار تبدأ من 4.99$/شهر',
      socialProof: [
        'كريم من بيروت وفّر 84$ الشهر الفائت',
        'نور من طرابلس اشترك للتو بـ Netflix + Spotify',
        'إيلي من جونيه جدّد ChatGPT Plus للمرّة الثالثة',
        'ريما من صيدا حوّلت من الـ app store وفّرت 61$',
        'جاد من جبيل جمع 4 خدمات ونزّل فاتورته للنص',
      ],
      // ---- new MENA-focused copy (used by the rewritten hero) ----
      mainHeadline:
        'Netflix + ChatGPT + Adobe + IPTV — اشتراكات مميزة بأرخص أسعار في لبنان والشرق الأوسط 🔥',
      mainSubtitle:
        'تسليم فوري عبر واتساب • الدفع بالليرة أو USDT • ضمان 25 يومًا • يثق بنا أكثر من 500 زبون',
      primaryCta: 'تصفّح الاشتراكات الآن',
      secondaryCta: 'راسلنا على واتساب',
      trustBadges: {
        instantDelivery: 'تسليم فوري',
        localPayment: 'دفع محلي',
        moneyBack: 'استرجاع خلال 25 يومًا',
        lebanese: 'خدمة لبنانية',
      },
      // ---- editorial / luxury copy (v4 hero rebuild — kept for reference, not rendered) ----
      editorial: {
        kicker: 'لبنان — مينا · ملحق رقم ٠٤',
        headline: {
          line1: 'الطريقة الهادئة',
          line2: 'لتملك اشتراكاتك',
          line3: 'الرقمية',
          line4: 'بكل راحة.',
        },
        subtitle:
          'كاتالوج منتقى من خدمات البثّ والذكاء الاصطناعي والأدوات الإبداعية، مُسعَّر ومُسلَّم لبيروت والمنطقة.',
        primaryCta: 'استعرض الكاتالوج',
        secondaryCta: 'تواصل مع الدار',
        sections: ['البث', 'الذكاء الاصطناعي', 'الإبداع والتصميم', 'نمط الحياة'],
        catalogueCount: '١٤٩ خدمة',
        since: 'بيروت · ٢٠٢٤',
      },
      // ---- Apple-style rebuild (v5) ----
      apple: {
        overline: 'اشتراكات رقمية مميّزة · لبنان والشرق الأوسط',
        headline: 'كل شي بتشوفو وبتسمعو.',
        headlineAccent: 'بأرخص سعر.',
        subline:
          'Netflix وChatGPT وAdobe وSpotify وIPTV و{count} خدمة — بتوصلك عالموبايل بدقائق، وبتدفع بالليرة أو USDT أو كارد.',
        primaryCta: 'تصفّح كل الاشتراكات',
        secondaryCta: 'راسلنا على واتساب',
        trustPills: [
          'تسليم فوري عبر واتساب',
          'استرجاع خلال 25 يوم',
          'أكتر من 500 زبون بلبنان',
        ],
      },
      tickerLabel: 'الأكثر طلباً اليوم',
      trust: {
        overline: 'ليش BundlyPlus',
        title: 'اشتراكات premium، بدون فاتورة premium.',
        lead:
          'منشتري الاشتراكات بسعر السوق، وبنوصلك ياها بسعر أرخص بكتير — سريع، آمن، وبطريقة دفع لبنانية.',
        items: [
          {
            title: 'تسليم بدقائق',
            desc: 'بتدفع، بتستلم، بتسجّل دخولك. معظم الطلبات بتخلص بنفس محادثة الواتساب.',
          },
          {
            title: 'دفع محلّي',
            desc: 'ليرة لبنانية عبر Whish أو OMT، أو USDT على TRC20 أو BEP20. بدون مشاكل الكارد ولا رسوم دولية.',
          },
          {
            title: 'ضمان 25 يوم',
            desc: 'إذا صار شي بالوصول، منبدّلك الحساب أو منرجّعلك مصاري. بدون نقاش وبدون فورم.',
          },
          {
            title: 'فريق لبناني، دعم عربي',
            desc: 'فريق دعم ببيروت على واتساب من الصباح لنص الليل، كل أيام الأسبوع.',
          },
        ],
      },
      categories: {
        overline: 'تصفّح',
        title: 'كل أداة، بكتالوج واحد.',
        lead: '10 فئات. {count} منتج. مكان واحد لكل حياتك الرقمية.',
      },
    },
    home: {
      catalogOverline: 'الكتالوج',
      catalogTitle: 'اشتراكات بتستاهل تكون إلك.',
      catalogLead:
        'ست خيارات بيرجعولنا زباينا كل شهر — منتقاة من أصل {count} منتج بالكتالوج.',
      viewAllProductsCount: 'شوف كل {count} منتج',
      pricingOverline: 'التسعير',
      pricingTitle: 'قاعدة واحدة: أرخص من السعر الأصلي، دايماً.',
      pricingLead:
        'كل اشتراك متوفر بـ4 مدد. كل ما طوّلت المدة، وفّرت أكتر — توفير يوصل لـ17% بالاشتراك السنوي.',
      topToolsLabel: 'أفضل الأدوات',
      topToolsTitle: 'الأفضل من Bundly',
      viewAll: 'عرض الكل',
      viewAllProducts: 'عرض كل المنتجات',
    },
    madeForMena: {
      badge: 'أدوات ذكاء اصطناعي للعمل والبرمجة والمحتوى والتصميم',
      title: 'أفضل أدوات',
      titleHighlight: 'الذكاء الاصطناعي.',
      description: 'اشتراكات ذكاء اصطناعي مميزة للكتابة والبحث والبرمجة والتصميم وصناعة الفيديو، منتقاة من الكتالوج بأسعار شهرية مناسبة.',
      viewAll: 'استكشف كل أدوات الذكاء الاصطناعي',
      tagChat: 'مساعدات المحادثة',
      tagResearch: 'البحث والبرمجة',
      tagCreative: 'التوليد الإبداعي',
    },
    discountPopup: {
      later: 'ربما لاحقا',
      dismiss: 'إغلاق نافذة الخصم',
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
      duration: {
        oneMonth: 'شهر',
        threeMonths: '3 أشهر',
        sixMonths: '6 أشهر',
        oneYear: 'سنة',
      },
      recommended: 'الأوفر',
      orderWhatsApp: 'اطلب عبر واتساب',
      total: 'الإجمالي',
      effectivePerMonth: 'بالشهر',
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
      analytics: 'نستخدم تحليلات تحترم الخصوصية مع إخفاء عناوين IP وبدون تسجيل للجلسات.',
    },
    bottomNav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      cart: 'السلة',
      chat: 'الدردشة',
      account: 'حسابي',
    },
    account: {
      profile: 'الملف الشخصي',
      profileDesc: 'حدّث بيانات التواصل وتفضيلات اللغة.',
      mySubscriptions: 'اشتراكاتي',
      subsDesc: 'تابع خططك النشطة وجددها قبل انتهائها.',
      myOrders: 'طلباتي',
      ordersDesc: 'استعرض طلباتك السابقة وحالتها.',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      signedOutTitle: 'سجّل الدخول إلى حسابك',
      signedOutDesc: 'تابع اشتراكاتك وطلباتك وقائمة المفضلة في مكان واحد.',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم واتساب',
      preferredLang: 'اللغة المفضلة',
      preferredCurrency: 'العملة المفضلة',
      save: 'حفظ التغييرات',
      saved: 'تم حفظ الملف',
      saveError: 'تعذر حفظ الملف',
      loadError: 'تعذر تحميل الملف',
      loading: 'جارٍ التحميل…',
      noSubsTitle: 'لا اشتراكات بعد',
      noSubsDesc: 'تظهر خططك النشطة هنا بعد تسليم الطلب.',
      noOrdersTitle: 'لا طلبات بعد',
      noOrdersDesc: 'تصفح الكتالوج وأكمل الطلب عبر واتساب لتبدأ.',
      browseCatalog: 'تصفح الكتالوج',
      orderRef: 'طلب',
      expires: 'ينتهي في',
      renewSoon: 'جدد قريبا',
      renewWhatsapp: 'تجديد عبر واتساب',
      statusActive: 'نشط',
      statusExpired: 'منتهٍ',
      statusPending: 'بانتظار التأكيد',
      statusConfirmed: 'مؤكد',
      statusDelivered: 'تم التسليم',
      statusCancelled: 'ملغى',
    },
    admin: {
      tabs: {
        products: 'المنتجات',
        orders: 'الطلبات',
        customers: 'العملاء',
        reminders: 'التذكيرات',
        promotions: 'العروض',
        analytics: 'التحليلات',
      },
      orders: {
        title: 'الطلبات',
        empty: 'لا توجد طلبات بعد.',
        markConfirmed: 'تأكيد',
        markDelivered: 'تأكيد التسليم وإنشاء الاشتراكات',
        markCancelled: 'إلغاء',
        loading: 'جارٍ تحميل الطلبات…',
        statusFilter: 'الحالة',
        all: 'الكل',
        customer: 'العميل',
        items: 'العناصر',
        subsCreated: 'تم إنشاء {count} اشتراك',
      },
      customers: {
        title: 'العملاء',
        empty: 'لا يوجد عملاء بعد.',
        joined: 'انضم في',
        active: 'نشط',
        orders: 'طلبات',
      },
      reminders: {
        title: 'تذكيرات التجديد',
        intro: 'الاشتراكات التي ستنتهي خلال {days} أيام. أرسل رسالة التجديد ثم اضغط تم الإرسال.',
        empty: 'لا شيء سينتهي خلال {days} أيام.',
        send: 'فتح واتساب',
        markSent: 'تم الإرسال',
        sentJustNow: 'تم تسجيل التذكير',
        daysLeft: 'متبقي {count} يوم',
      },
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
    cart: {
      title: 'مراجعة السلة',
      empty: 'سلتك فارغة',
      emptyDesc: 'يبدو أنك لم تضف أي اشتراكات إلى سلتك بعد.',
      startBrowsing: 'ابدأ التصفح',
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
      paymentIntro: 'أرسل طلبك على واتساب أولا. سنؤكد المبلغ المطلوب قبل التحويل.',
      whishPhoneHelp: 'استخدم هذا الرقم بعد التأكيد.',
      whishQrHelp: 'امسح الرمز في تطبيق Whish بعد أن نؤكد الطلب.',
      whishOmtPhoneLabel: 'رقم هاتف Whish وOMT',
      youSave: 'توفير',
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
      overline: 'اشتراك رقمي',
      featuresTitle: 'شو بتاخد',
      pricingTitle: 'اختار خطتك',
      pricingSubtitle: 'كل ما طوّلت المدة، وفّرت أكتر. كل خطة بتتفعّل فوراً بعد الدفع.',
      faqTitle: 'أسئلة متكررة',
      faq: [
        {
          q: 'قديش بياخد وقت ليوصلني الحساب؟',
          a: 'معظم الطلبات بتوصل على الواتساب خلال 5 لـ15 دقيقة بأوقات الدوام. الطلبات المسائية منعالجها أول شي بالصبح.',
        },
        {
          q: 'شو بصير إذا صار شي غلط؟',
          a: 'ضمانك معنا 25 يوم. إذا بطّل الحساب يشتغل، راسلنا عالواتساب بالـ order ref ومنبدّلو أو منرجّعلك مصاري.',
        },
        {
          q: 'فيني ادفع بالليرة؟',
          a: 'أكيد. منقبل Whish وOMT بالليرة، وUSDT على TRC20 أو BEP20. تفاصيل الدفع بتوصلك بعد ما نأكّد طلبك.',
        },
        {
          q: 'الحساب خاص ولا مشترك؟',
          a: 'بعض الاشتراكات مشتركة (دخول على عدد محدود من الأجهزة)، والباقي خاص. شيك عالـ badge بأعلى الصفحة.',
        },
      ],
      stickyOrderCta: 'اطلب عبر واتساب',
      stickyFrom: 'يبدأ من',
      backToProducts: 'الرجوع للمنتجات',
    },
    comingSoon: {
      title: 'شي جديد قادم...',
      description: 'BundlyPlus على وشك التوسّع إلى ما هو أبعد من الاشتراكات الرقمية. ترقّبوا منتجات حقيقية تصلكم إلى باب البيت قريباً.',
      teaserText: 'لن نكشف كل شيء بعد... لكن جهّزوا قائمة رغباتكم.',
      browseLive: 'تصفّح المتوفر الآن',
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

  const toggleLang = () =>
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      trackEvent(ANALYTICS_EVENTS.LANGUAGE_TOGGLED, { from: prev, to: next });
      return next;
    });

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang] as T, toggleLang, isRTL: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
