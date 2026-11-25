export type Lang = "en" | "ar";

export const LANG_COOKIE = "bp_lang";
export const DEFAULT_LANG: Lang = "en";

export const isLang = (value: unknown): value is Lang =>
  value === "en" || value === "ar";

export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

// Arabic digits (٣٥٠). For normal digits (350) in Arabic use "ar-EG-u-nu-latn"
const NUMBER_LOCALE: Record<Lang, string> = { en: "en-US", ar: "ar-EG" };
const CURRENCY_AR = "ج.م";

export function num(
  lang: Lang,
  value: number,
  options?: Intl.NumberFormatOptions
) {
  return value.toLocaleString(NUMBER_LOCALE[lang], options);
}

// English: "EGP 350"   Arabic: "٣٥٠ ج.م"
export function formatMoneyL(lang: Lang, value: number) {
  const n = num(lang, value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return lang === "ar" ? `${n} ${CURRENCY_AR}` : `EGP ${n}`;
}

// "09:00" -> "9:00 AM"  /  "٩:٠٠ ص"
export function formatClockL(lang: Lang, value: string) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;

  const d = getDict(lang);
  const hour = h % 12 === 0 ? 12 : h % 12;
  const hh = num(lang, hour, { useGrouping: false });
  const mm = num(lang, m, { minimumIntegerDigits: 2, useGrouping: false });
  return `${hh}:${mm} ${h >= 12 ? d.pm : d.am}`;
}

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------
const en = {
  brand: { first: "Bahrawy", second: "Planet", full: "Bahrawy Planet" },

  nav: {
    links: { home: "Home", about: "About", books: "Books", footer: "Footer" },
    logoAlt: "Bahrawy Planet logo",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    langButton: "عربي",
    langLabel: "Switch to Arabic",
  },

  theme: {
    toggle: "Toggle dark mode",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },

  home: {
    heroAlt: "Books on a shelf",
    badge: "Welcome to our planet of books",
    description:
      "Find the best books in one place. Explore our hand-picked collection and discover your next great read.",
    browse: "Browse Books",
    aboutUs: "About Us",
    whyA: "Why",
    whyB: "Choose Us",
    features: [
      {
        title: "Huge Collection",
        text: "Thousands of titles across every genre, from timeless classics to the latest releases.",
      },
      {
        title: "Fast Delivery",
        text: "Your books packed with care and delivered to your door quickly and safely.",
      },
      {
        title: "Best Prices",
        text: "Great deals and regular discounts so reading never has to be expensive.",
      },
    ],
  },

  about: {
    imageAlt: "Inside Bahrawy Planet",
    badge: "About Us",
    titleA: "We Love",
    titleB: "Books",
    titleC: "As Much As You Do",
    p1: "Bahrawy Planet started with a simple idea: everyone deserves easy access to great stories. We bring together bestsellers, timeless classics, and hidden gems in one place, so you can find your next favorite read without the hassle.",
    p2: "Every title in our collection is chosen with care, and our team is always here to help you pick the right book for you or for someone you care about.",
    points: [
      "Hand-picked books across every genre",
      "Fast and careful delivery to your door",
      "Fair prices and regular discounts",
      "Friendly support from real book lovers",
    ],
    button: "Explore Our Books",
  },

  books: {
    badge: "Our Collection",
    titleA: "Featured",
    titleB: "Books",
    subtitle:
      "Hand-picked titles for every kind of reader. Choose a category and tap any book to see more details.",
    empty: "Our books are coming soon. Please check back in a moment.",
  },

  card: { by: "by", view: "View Details" },

  detail: {
    back: "Back to books",
    pages: "Pages",
    language: "Language",
    year: "Year",
    publisher: "Publisher",
  },

  footer: {
    about:
      "Your friendly corner for great reads. Discover bestsellers, classics, and hidden gems, all in one place.",
    contact: "Contact Us",
    address: "El Shorouk, Cairo, Egypt",
    hours: "Opening Hours",
    closed: "Closed",
    rights: "All rights reserved.",
  },

  feedback: {
    title: "Tell us what you think",
    name: "Your name",
    message: "Your message",
    send: "Send Feedback",
    sending: "Sending...",
    thanks: "Thank you for your feedback!",
    generic: "Something went wrong.",
    offline: "Could not reach the server. Please try again.",
    tooMany: "Too many messages. Please wait a minute.",
    invalid: "Please check your details and try again.",
    starsLabel: (n: number) => `${n} stars`,
    ratingLabel: "Rating",
  },

  notFound: { title: "404 - Page not found", back: "Back to home" },

  weekdays: [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  am: "AM",
  pm: "PM",

  // Words that come from the database (English is the original text)
  groups: {} as Record<string, string>,
  categories: {} as Record<string, string>,
  languages: {} as Record<string, string>,
};

export type Dict = typeof en;

// ---------------------------------------------------------------------------
// Arabic
// ---------------------------------------------------------------------------
const ar: Dict = {
  brand: { first: "كوكب", second: "البحراوي", full: "كوكب البحراوي" },

  nav: {
    links: {
      home: "الرئيسية",
      about: "من نحن",
      books: "الكتب",
      footer: "تواصل معنا",
    },
    logoAlt: "شعار كوكب البحراوي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    langButton: "EN",
    langLabel: "التبديل إلى الإنجليزية",
  },

  theme: {
    toggle: "تبديل الوضع الليلي",
    toLight: "التبديل إلى الوضع الفاتح",
    toDark: "التبديل إلى الوضع الداكن",
  },

  home: {
    heroAlt: "كتب على رف",
    badge: "أهلاً بك في كوكب الكتب",
    description:
      "اعثر على أفضل الكتب في مكان واحد. تصفّح مجموعتنا المختارة بعناية واكتشف قراءتك المميزة القادمة.",
    browse: "تصفّح الكتب",
    aboutUs: "من نحن",
    whyA: "لماذا",
    whyB: "تختارنا",
    features: [
      {
        title: "مجموعة ضخمة",
        text: "آلاف العناوين في كل المجالات، من الكلاسيكيات الخالدة إلى أحدث الإصدارات.",
      },
      {
        title: "توصيل سريع",
        text: "نغلّف كتبك بعناية ونوصّلها إلى باب منزلك بسرعة وأمان.",
      },
      {
        title: "أفضل الأسعار",
        text: "عروض رائعة وخصومات دورية حتى لا تكون القراءة مكلفة أبدًا.",
      },
    ],
  },

  about: {
    imageAlt: "داخل كوكب البحراوي",
    badge: "من نحن",
    titleA: "نحب",
    titleB: "الكتب",
    titleC: "بقدر ما تحبها أنت",
    p1: "بدأ كوكب البحراوي بفكرة بسيطة: كل شخص يستحق وصولًا سهلًا إلى القصص العظيمة. نجمع في مكان واحد الكتب الأكثر مبيعًا والكلاسيكيات الخالدة والكنوز المخفية، لتجد قراءتك المفضلة القادمة دون عناء.",
    p2: "يُختار كل عنوان في مجموعتنا بعناية، وفريقنا دائمًا هنا لمساعدتك في اختيار الكتاب المناسب لك أو لشخص عزيز عليك.",
    points: [
      "كتب مختارة بعناية في كل المجالات",
      "توصيل سريع وآمن إلى باب منزلك",
      "أسعار عادلة وخصومات دورية",
      "دعم ودود من محبي الكتب الحقيقيين",
    ],
    button: "استكشف كتبنا",
  },

  books: {
    badge: "مجموعتنا",
    titleA: "كتب",
    titleB: "مميزة",
    subtitle:
      "عناوين مختارة بعناية لكل أنواع القرّاء. اختر تصنيفًا واضغط على أي كتاب لعرض المزيد من التفاصيل.",
    empty: "كتبنا قادمة قريبًا. يُرجى المحاولة بعد قليل.",
  },

  card: { by: "بقلم", view: "عرض التفاصيل" },

  detail: {
    back: "العودة إلى الكتب",
    pages: "عدد الصفحات",
    language: "اللغة",
    year: "سنة النشر",
    publisher: "الناشر",
  },

  footer: {
    about:
      "ركنك الودود للقراءة الممتعة. اكتشف الكتب الأكثر مبيعًا والكلاسيكيات والكنوز المخفية في مكان واحد.",
    contact: "تواصل معنا",
    address: "الشروق، القاهرة، مصر",
    hours: "مواعيد العمل",
    closed: "مغلق",
    rights: "جميع الحقوق محفوظة.",
  },

  feedback: {
    title: "شاركنا رأيك",
    name: "اسمك",
    message: "رسالتك",
    send: "إرسال",
    sending: "جارٍ الإرسال...",
    thanks: "شكرًا لك على ملاحظاتك!",
    generic: "حدث خطأ ما.",
    offline: "تعذّر الاتصال بالخادم. يُرجى المحاولة مرة أخرى.",
    tooMany: "رسائل كثيرة جدًا. يُرجى الانتظار دقيقة.",
    invalid: "تحقّق من البيانات المدخلة وأعد المحاولة.",
    starsLabel: (n: number) =>
      n === 1 ? "نجمة واحدة" : n === 2 ? "نجمتان" : `${n} نجوم`,
    ratingLabel: "التقييم",
  },

  notFound: {
    title: "٤٠٤ - الصفحة غير موجودة",
    back: "العودة إلى الرئيسية",
  },

  weekdays: [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ],
  am: "ص",
  pm: "م",

  // Keys are the names stored in the database
  groups: {
    fiction: "روايات",
    "adventure-kids": "مغامرات وأطفال",
    "tech-business": "التقنية والأعمال",
    lifestyle: "أسلوب الحياة",
  },
  categories: {
    Mystery: "غموض وتشويق",
    "Science Fiction": "خيال علمي",
    "Historical Fiction": "روايات تاريخية",
    Fantasy: "فانتازيا",
    Adventure: "مغامرات",
    Children: "أطفال",
    Technology: "التكنولوجيا",
    Finance: "المال والتمويل",
    "Self-Help": "تطوير الذات",
    Cooking: "الطبخ",
  },
  languages: {
    English: "الإنجليزية",
    Arabic: "العربية",
    French: "الفرنسية",
    German: "الألمانية",
    Spanish: "الإسبانية",
  },
};

export function getDict(lang: Lang): Dict {
  return lang === "ar" ? ar : en;
}

// A name that is not in the dictionary (for example a new category) stays as it is
export function translateGroup(lang: Lang, slug: string, fallback: string) {
  return getDict(lang).groups[slug] ?? fallback;
}

export function translateCategory(lang: Lang, name: string) {
  return getDict(lang).categories[name] ?? name;
}

export function translateLanguage(lang: Lang, name: string) {
  return getDict(lang).languages[name] ?? name;
}