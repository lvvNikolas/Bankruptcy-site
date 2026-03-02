import type { Metadata } from "next";
import "@styles/globals.css";

import Navbar from "@/app/components/sections/Navbar/Navbar";
import Footer from "@/app/components/sections/Footer/Footer";
import FloatingCTA from "@/app/components/widgets/FloatingCTA/FloatingCTA";
import ScrollTopButton from "@/app/components/widgets/ScrollTopButton/ScrollTopButton";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://basolution.ru";
const SITE_NAME = "BASolution";

// 👉 Заполни актуальные данные
const PHONE = "+79162979645"; // например "+79162979645"
const EMAIL = "bankruptcyagencysolution@yandex.com";
const ADDRESS = {
  addressCountry: "RU",
  addressLocality: "Москва",
  streetAddress: "Пресненская набережная, д. 12-17",
  postalCode: "", // если знаешь — укажи
};

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
        alt: "BASolution — банкротство физических лиц",
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
      address: {
        "@type": "PostalAddress",
        ...ADDRESS,
      },
      sameAs: [
        // сюда можно добавить соцсети, например Telegram
        // "https://t.me/your_username",
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
    <html lang="ru">
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingCTA />
        <ScrollTopButton />

        {/* ✅ Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}