import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@styles/globals.css";
import {
  SITE_URL,
  SITE_NAME,
  PHONE_RAW,
  EMAIL,
  METRIKA_ID,
} from "@/config";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

import Navbar from "@/app/components/sections/Navbar/Navbar";
import Footer from "@/app/components/sections/Footer/Footer";
import FloatingCTA from "@/app/components/widgets/FloatingCTA/FloatingCTA";
import ScrollTopButton from "@/app/components/widgets/ScrollTopButton/ScrollTopButton";
import CookieBanner from "@/app/components/widgets/CookieBanner/CookieBanner";
import MessengerButtons from "@/app/components/widgets/MessengerButtons/MessengerButtons";
import ExitPopup from "@/app/components/widgets/ExitPopup/ExitPopup";
import LiveStats from "@/app/components/widgets/LiveStats/LiveStats";
import MobileCTA from "@/app/components/widgets/MobileCTA/MobileCTA";
import GoalTracker from "@/app/components/widgets/GoalTracker/GoalTracker";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const PHONE = PHONE_RAW;
const ADDRESSES = [
  {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressLocality: "Москва",
    streetAddress: "Пресненская набережная, д. 12",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Банкротство физических лиц — помощь по 127-ФЗ",
    template: "%s | Банкротство физических лиц",
  },

  description:
    "Списываем долги законно по 127-ФЗ. Бесплатная консультация, прозрачные условия, сопровождение до результата. Работаем по всей России.",

  keywords: [
    "банкротство физических лиц",
    "списание долгов",
    "127-ФЗ",
    "юрист по банкротству",
    "финансовая защита",
    "банкротство Москва",
  ],

  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description:
      "Законно спишем долги. Бесплатная консультация и сопровождение до результата. Работаем по всей России.",
    images: [
      {
        url: "/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Юридическое агентство по банкротству Солюшен — банкротство физических лиц",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Банкротство физических лиц — помощь по 127-ФЗ",
    description:
      "Юридическая помощь по списанию долгов по 127-ФЗ. Бесплатная консультация.",
    images: ["/og-preview.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ Schema.org JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "LegalService"],
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      image: [`${SITE_URL}/og-preview.jpg`],
      description:
        "Юридическая помощь по банкротству физических лиц по 127-ФЗ. Бесплатная консультация, сопровождение до результата.",
      areaServed: "RU",
      telephone: PHONE,
      email: EMAIL,
      address: ADDRESSES,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: PHONE,
          contactType: "customer service",
          areaServed: "RU",
          availableLanguage: "Russian",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            opens: "09:00",
            closes: "21:00",
          },
        },
      ],
      sameAs: [
        "https://t.me/ba_solution",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ];

  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        {/* Yandex.Metrika */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
          }}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Перейти к содержимому</a>
        <Navbar />
        <main id="main-content" style={{ paddingTop: "var(--nav-h, 68px)" }}>{children}</main>
        <Footer />
        <FloatingCTA />
        <MessengerButtons />
        <ScrollTopButton />
        <CookieBanner />
        <ExitPopup />
        <LiveStats />
        <MobileCTA />
        <GoalTracker />

        {/* ✅ Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}